import { NextResponse } from 'next/server'
import {
  budgetBands, currencies, recipient, serviceOptions, timingOptions,
  buildEnquiry, validateDraft,
  type Currency, type EnquiryDraft, type Service, type Timing,
} from '@/lib/enquiry'

/*
  PROJECT ENQUIRY — server-side send.

  The review step used to hand the visitor a `mailto:` link, which meant
  the site never actually sent anything: delivery depended on the visitor
  having a mail client registered, and on them pressing send themselves.
  Anyone reading webmail in a browser tab got a dead link and no error.

  This endpoint sends the enquiry instead. The browser still keeps the
  mailto as a fallback, so a failure here degrades to the old behaviour
  rather than losing the enquiry.

  The draft is re-validated and re-composed here rather than accepting a
  body built in the browser. Anything can POST to this route, so the
  shapes below are checked one field at a time before `buildEnquiry` sees
  them.
*/

const endpoint = 'https://api.resend.com/emails'

/*
  Sending domain, not the destination. Resend will only send from a domain
  verified in the account, which is why this is a `send.` subdomain rather
  than `hello@burgama.com` — it keeps the main domain's mail reputation
  separate from transactional sends. Override with CONTACT_FROM.
*/
const from = process.env.CONTACT_FROM ?? 'Burgama <enquiries@send.burgama.com>'
const to = process.env.CONTACT_TO ?? recipient

/* Free text is capped before it reaches the composer. */
const limits: Partial<Record<keyof EnquiryDraft, number>> = {
  companyName: 200, website: 300, name: 120, email: 254, brief: 5000, deadline: 10,
}

function text(payload: Record<string, unknown>, key: keyof EnquiryDraft) {
  const value = payload[key]
  if (typeof value !== 'string') return ''
  return value.slice(0, limits[key] ?? 200)
}

/*
  Returns null when the payload is not shaped like a draft at all. Field
  level problems are left to validateDraft so the visitor gets the same
  messages the browser would have shown them.
*/
function coerceDraft(payload: Record<string, unknown>): EnquiryDraft | null {
  const services = payload.services
  if (!Array.isArray(services)) return null

  const allowedServices = serviceOptions.map(option => option[0]) as readonly string[]
  const allowedTimings = timingOptions.map(option => option[0]) as readonly string[]

  const timing = text(payload, 'timing')
  const currency = text(payload, 'currency')
  const budget = Number(payload.budget)

  return {
    companyName: text(payload, 'companyName'),
    website: text(payload, 'website'),
    name: text(payload, 'name'),
    email: text(payload, 'email'),
    services: services.filter((s): s is Service => typeof s === 'string' && allowedServices.includes(s)),
    brief: text(payload, 'brief'),
    timing: allowedTimings.includes(timing) ? timing as Timing : '',
    deadline: text(payload, 'deadline'),
    budget: Number.isInteger(budget) && budget >= 0 && budget < budgetBands.length ? budget : 0,
    budgetUndecided: payload.budgetUndecided === true,
    currency: (currencies as readonly string[]).includes(currency) ? currency as Currency : 'USD',
  }
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const body = payload as Record<string, unknown>

  /*
    Honeypot. The field is present in the markup but hidden from people and
    from assistive technology, so anything filled in came from a bot. A 200
    is returned deliberately: telling a scripted submitter that it failed
    only invites a retry with the field left blank.
  */
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true })
  }

  const draft = coerceDraft(body)
  if (!draft) {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const errors = validateDraft(draft)
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Some details need another look.', errors }, { status: 400 })
  }

  /*
    Missing key is not an error the visitor caused, and the browser reads
    this status to decide whether to offer the mailto fallback instead of
    showing a failure.
  */
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[contact] RESEND_API_KEY is not set; enquiry was not sent')
    return NextResponse.json({ error: 'Sending is not configured.', fallback: true }, { status: 503 })
  }

  const enquiry = buildEnquiry(draft)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        /* So a reply in the inbox goes to the visitor, not to the sender domain. */
        reply_to: draft.email.trim(),
        subject: `${enquiry.subject} — ${draft.companyName.trim()}`,
        text: enquiry.body,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('[contact] resend rejected the send:', response.status, detail)
      return NextResponse.json({ error: 'The enquiry could not be sent.', fallback: true }, { status: 502 })
    }
  } catch (cause) {
    console.error('[contact] send failed:', cause)
    return NextResponse.json({ error: 'The enquiry could not be sent.', fallback: true }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
