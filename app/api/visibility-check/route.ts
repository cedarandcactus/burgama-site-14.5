import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { leadLimits, normalizeSite, siteLabel, trackingKeys, validateLead, type LeadDraft, type Tracking } from '@/lib/ai-visibility'
import { recipient } from '@/lib/enquiry'

/*
  AI VISIBILITY CHECK — lead endpoint for the ChatGPT ads landing page.

  1. Validates the three fields again (anything can POST here).
  2. Emails the lead to the studio inbox and to Deniz straight away, with
     the ad source, so follow-up can happen within 24 hours.
  3. If measurement is allowed (US visitor who has not opted out or sent
     Global Privacy Control, or anyone who chose "Accept all"), sends the `lead_created` conversion
     to OpenAI's Conversions API with the same event ID the browser pixel
     used, so OpenAI counts it once.

  Environment (Vercel, server-only unless noted):
  - RESEND_API_KEY          already set for the contact form
  - LEAD_ALERT_TO           comma-separated extra recipients; defaults to deniz@burgama.com
  - OPENAI_ADS_API_KEY      Conversions API key from Ads Manager. Never NEXT_PUBLIC_.
  - NEXT_PUBLIC_OPENAI_PIXEL_ID  pixel ID (public by design; also used by the browser pixel)
  - OPENAI_ADS_VALIDATE_ONLY=true  test mode: OpenAI checks events without recording them
*/

const resendEndpoint = 'https://api.resend.com/emails'
const from = process.env.CONTACT_FROM ?? 'Burgama <enquiries@send.burgama.com>'
const inbox = process.env.CONTACT_TO ?? recipient
const alertTo = (process.env.LEAD_ALERT_TO ?? 'deniz@burgama.com').split(',').map(s => s.trim()).filter(Boolean)

function text(body: Record<string, unknown>, key: keyof LeadDraft) {
  const value = body[key]
  return typeof value === 'string' ? value.slice(0, leadLimits[key]) : ''
}

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

function sha256(value: string) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

function cookie(request: Request, name: string) {
  const header = request.headers.get('cookie') ?? ''
  const match = header.split('; ').find(part => part.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : ''
}

async function sendConversion(request: Request, input: { eventId: string; email: string; landingUrl: string; oppref: string }) {
  const key = process.env.OPENAI_ADS_API_KEY
  const pixelId = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID
  if (!key || !pixelId) return 'not configured'

  /* Prefer the click ID in the landing URL; fall back to the pixel's cookie. */
  const oppref = input.oppref || cookie(request, '__oppref')
  const obref = cookie(request, '__obref')
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

  const event = {
    id: input.eventId,
    type: 'lead_created',
    timestamp_ms: Date.now(),
    action_source: 'web',
    source_url: input.landingUrl || 'https://www.burgama.com/ai-visibility-check',
    ...(oppref ? { oppref } : {}),
    data: { type: 'customer_action' },
    user: {
      emails_sha256: [sha256(input.email)],
      ...(obref ? { obref } : {}),
      ...(forwarded ? { ip_address: forwarded } : {}),
      ...(request.headers.get('user-agent') ? { user_agent: request.headers.get('user-agent') } : {}),
      countries: ['us'],
    },
  }

  const params = new URLSearchParams({ pid: pixelId })
  if (process.env.OPENAI_ADS_VALIDATE_ONLY === 'true') params.set('validate_only', 'true')

  try {
    const response = await fetch(`https://bzr.openai.com/v1/events?${params}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: [event] }),
    })
    if (!response.ok) {
      console.error('[visibility-check] conversions api rejected the event:', response.status, await response.text())
      return `rejected (${response.status})`
    }
    return 'sent'
  } catch (cause) {
    console.error('[visibility-check] conversions api failed:', cause)
    return 'failed'
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

  /* Honeypot: a filled field means a bot. Answer 200 so it doesn't retry. */
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true })
  }

  const draft: LeadDraft = {
    website: text(body, 'website'),
    email: text(body, 'email'),
    name: text(body, 'name'),
  }
  const business = siteLabel(draft.website)
  const errors = validateLead(draft)
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Some details need another look.', errors }, { status: 400 })
  }

  const tracking: Tracking = {}
  const rawTracking = typeof body.tracking === 'object' && body.tracking !== null ? body.tracking as Record<string, unknown> : {}
  for (const key of trackingKeys) {
    const value = clean(rawTracking[key], 200)
    if (value) tracking[key] = value
  }
  const oppref = clean(body.oppref, 500)
  const landingUrl = clean(body.landingUrl, 1000)
  const eventId = clean(body.eventId, 100) || crypto.randomUUID()
  const optedOut = body.optedOut === true || request.headers.get('sec-gpc') === '1'
  const usVisitor = request.headers.get('x-vercel-ip-country') === 'US'
  const measurementAllowed = !optedOut && (body.consent === true || usVisitor)

  const conversion = measurementAllowed
    ? await sendConversion(request, { eventId, email: draft.email, landingUrl, oppref })
    : optedOut ? 'skipped (visitor opted out)' : 'skipped (outside the US, no consent)'

  const source = tracking.utm_source
    ? [tracking.utm_source, tracking.utm_medium, tracking.utm_campaign, tracking.utm_content].filter(Boolean).join(' / ')
    : oppref ? 'ChatGPT ad (click ID present, no UTMs)' : 'direct or unknown'

  const emailBody = [
    'New free AI visibility check request. Reply within 24 hours.', '',
    `Name: ${draft.name.trim()}`,
    `Website: ${normalizeSite(draft.website)}`,
    `Email: ${draft.email.trim()}`,
    'Business name and city: not asked on the form. Read them from the website.', '',
    `Source: ${source}`,
    ...(tracking.utm_term ? [`Term: ${tracking.utm_term}`] : []),
    `ChatGPT click ID: ${oppref ? 'yes' : 'no'}`,
    `OpenAI conversion: ${conversion}`,
    `Landing page: ${landingUrl || 'unknown'}`,
    `Received: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })} Central`,
  ].join('\n')

  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[visibility-check] RESEND_API_KEY is not set; lead was not emailed:\n' + emailBody)
    return NextResponse.json({ error: 'Sending is not configured.' }, { status: 503 })
  }

  try {
    const response = await fetch(resendEndpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [inbox, ...alertTo.filter(address => address !== inbox)],
        reply_to: draft.email.trim(),
        subject: `AI visibility check request: ${business} (${source})`,
        text: emailBody,
      }),
    })
    if (!response.ok) {
      console.error('[visibility-check] resend rejected the send:', response.status, await response.text())
      return NextResponse.json({ error: 'The request could not be sent.' }, { status: 502 })
    }
  } catch (cause) {
    console.error('[visibility-check] send failed:', cause)
    return NextResponse.json({ error: 'The request could not be sent.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
