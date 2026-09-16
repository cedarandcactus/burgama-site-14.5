import { NextResponse } from 'next/server'

/*
  UPDATES SIGNUP — subscribes the address to a Klaviyo list.

  This endpoint previously validated an address, logged it, and stopped
  there; the footer said so in as many words. It now sends the address to
  Klaviyo with marketing consent, so three things moved together:

    1. the write below replaces the log line
    2. the footer copy in `footer-updates.tsx` became list language
    3. the privacy policy no longer says the signup is unconnected

  Klaviyo's bulk subscription job is used rather than a plain profile
  create because it is the endpoint that records consent. If the list has
  double opt-in enabled, this triggers the confirmation email and the
  profile stays pending until the visitor confirms — the footer copy is
  worded to be true either way.

  Validation is done server-side rather than trusting the browser, because
  `type="email"` is a UX affordance and not a guarantee — anything can POST
  here directly.
*/

/* Deliberately conservative: one @, a dot in the domain, no whitespace. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const endpoint = 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs'

/*
  Klaviyo pins behaviour to a dated revision. Changing this is a deliberate
  upgrade, not a maintenance detail — a newer revision can change how
  consent is recorded.
*/
const revision = '2024-10-15'

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
    Honeypot. Hidden from people and from assistive technology, so anything
    filled in came from a bot. A 200 is returned deliberately: telling a
    scripted submitter that it failed only invites a retry with the field
    left blank.
  */
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  /*
    Length cap before the regex. An unbounded string from an untrusted
    client is worth rejecting on size alone.
  */
  if (email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json(
      { error: 'That email address is not valid.' },
      { status: 400 },
    )
  }

  /*
    Missing configuration is not an error the visitor caused. The browser
    reads this status to keep the honest "not connected" wording rather
    than claiming a subscription that did not happen.
  */
  const key = process.env.KLAVIYO_API_KEY
  const list = process.env.KLAVIYO_LIST_ID
  if (!key || !list) {
    console.error('[updates] KLAVIYO_API_KEY or KLAVIYO_LIST_ID is not set; nothing was subscribed')
    return NextResponse.json({ error: 'Signup is not configured.', unconfigured: true }, { status: 503 })
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${key}`,
        revision,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            /* Shows in Klaviyo as the origin of the consent record. */
            custom_source: 'Burgama website footer',
            profiles: {
              data: [{
                type: 'profile',
                attributes: {
                  email,
                  subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
                },
              }],
            },
          },
          relationships: { list: { data: { type: 'list', id: list } } },
        },
      }),
    })

    /* The job is queued rather than executed inline, so 202 is the success. */
    if (!response.ok) {
      const detail = await response.text()
      console.error('[updates] klaviyo rejected the subscription:', response.status, detail)
      return NextResponse.json({ error: 'That could not be saved.' }, { status: 502 })
    }
  } catch (cause) {
    console.error('[updates] subscription failed:', cause)
    return NextResponse.json({ error: 'That could not be saved.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, persisted: true })
}
