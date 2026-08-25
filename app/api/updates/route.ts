import { NextResponse } from 'next/server'

/*
  UPDATES SIGNUP — validation only, no persistence yet.

  STATUS: intentionally incomplete. No mailing provider or database is
  connected to this project, so this endpoint validates the address and
  records it in the server log, and nothing more. It does NOT store
  addresses and does NOT subscribe anyone.

  The client copy is worded to match that exactly ("Address received"), so
  the UI is not claiming a result this cannot deliver. When a provider is
  added, three things change together:

    1. the write below replaces the log line
    2. the success copy in `corner-shell.tsx` becomes list language
    3. the "Unsubscribe any time" consent line goes back

  Validation is done server-side rather than trusting the browser, because
  `type="email"` is a UX affordance and not a guarantee — anything can POST
  here directly.
*/

/* Deliberately conservative: one @, a dot in the domain, no whitespace. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const email =
    typeof payload === 'object' &&
    payload !== null &&
    'email' in payload &&
    typeof (payload as { email: unknown }).email === 'string'
      ? (payload as { email: string }).email.trim().toLowerCase()
      : ''

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
    The stand-in for the real write. Logged rather than silently dropped so
    a submission during this phase is at least observable.
  */
  console.log('[v0] updates signup received:', email)

  return NextResponse.json({ ok: true, persisted: false })
}
