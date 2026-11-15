import { createHash } from 'node:crypto'
import { leadFrom, resend, sendReport, stopLink, verify, type Report } from '@/lib/lead-flow'
import { recipient } from '@/lib/enquiry'

/*
  APPROVE AND SEND a drafted AI visibility report.

  GET shows a confirm button (mail scanners open links, so a GET never sends).
  POST verifies the signed token, sends the report to the lead, schedules the
  day-2 and day-5 follow-ups, and emails the studio a link to cancel them.
*/

export const maxDuration = 60

const page = (title: string, body: string) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f0f0fa;color:#001328;max-width:560px;margin:0 auto;padding:48px 16px;line-height:1.55}
button{background:#001328;color:#f0f0fa;border:0;border-radius:999px;padding:14px 26px;font-size:16px;font-weight:600;cursor:pointer}
.muted{color:#326a9f}</style></head><body>${body}</body></html>`,
  { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
)

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('t') ?? ''
  const report = verify<Report>(token)
  if (!report) return page('Link not valid', '<h1>This link is not valid.</h1><p>It may have been cut off by your mail app. Open it from the original email.</p>')
  return page('Approve report', `<h1>Send the report to ${esc(report.lead.name)}?</h1>
<p>${esc(report.business)} &middot; ${esc(report.lead.email)}</p>
<p class="muted">It goes out now from Burgama, with follow-ups on day 2 and day 5. You will get a link to cancel the follow-ups once they book.</p>
<form method="post"><input type="hidden" name="t" value="${esc(token)}"><button type="submit">Approve and send</button></form>`)
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const token = String(form?.get('t') ?? '')
  const report = verify<Report>(token)
  if (!report) return page('Link not valid', '<h1>This link is not valid.</h1>')

  const once = createHash('sha256').update(token).digest('hex').slice(0, 32)
  const result = await sendReport(report, once)
  if (result.error) {
    console.error('[visibility-check/approve] send failed:', result.error)
    return page('Not sent', `<h1>The report was not sent.</h1><p>${esc(result.error)}</p><p>Try again, or send it by hand.</p>`)
  }

  const stop = stopLink(result.followUpIds)
  await resend({
    from: leadFrom,
    to: [process.env.CONTACT_TO ?? recipient],
    subject: `Report sent: ${report.business}`,
    text: `The AI visibility report went to ${report.lead.name} (${report.lead.email}).\n\nFollow-ups are scheduled for day 2 and day 5. When they book a call or reply, cancel them here:\n${stop}`,
  }, `sent-${once}`)

  return page('Sent', `<h1>Sent to ${esc(report.lead.name)}.</h1>
<p>Follow-ups are scheduled for day 2 and day 5.</p>
<p><a href="${stop}">Cancel the follow-ups</a> once they book. The link is also in your inbox.</p>`)
}
