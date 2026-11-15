import { after } from 'next/server'
import { draftReport, sendDraftFailed, sendReportForApproval, verify, type Lead } from '@/lib/lead-flow'

/*
  REDRAFT an AI visibility report from the approval or "needs a manual draft"
  email, without emailing the lead again.

  Use it when a report is wrong, was drafted by an older version, or the
  business serves more than one city. The new draft arrives as a fresh
  "Approve report" email; approving it sends from Burgama with direct links
  and schedules the follow-ups. This replaces rebuilding reports as Gmail
  drafts, which rewrites every link into a google.com redirect.

  GET shows the form (mail scanners open links, so a GET never drafts).
*/

export const maxDuration = 300

const studio = (process.env.LEAD_ALERT_TO ?? 'deniz@burgama.com').split(',').map(s => s.trim()).filter(Boolean)

const page = (title: string, body: string) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f0f0fa;color:#001328;max-width:560px;margin:0 auto;padding:48px 16px;line-height:1.55}
button{background:#001328;color:#f0f0fa;border:0;border-radius:999px;padding:14px 26px;font-size:16px;font-weight:600;cursor:pointer}
input[type=text]{width:100%;box-sizing:border-box;padding:12px;border:1px solid #95bce5;border-radius:8px;font-size:16px;margin:6px 0 18px}
.muted{color:#326a9f}</style></head><body>${body}</body></html>`,
  { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
)

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
const invalid = () => page('Link not valid', '<h1>This link is not valid.</h1><p>Open it from the original email.</p>')

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('t') ?? ''
  const lead = verify<{ lead: Lead }>(token)?.lead
  if (!lead) return invalid()
  return page('Redraft report', `<h1>Redraft the report for ${esc(lead.name)}?</h1>
<p>${esc(lead.website)} &middot; ${esc(lead.email)}</p>
<form method="post"><input type="hidden" name="t" value="${esc(token)}">
<label for="cities"><b>Cities to check</b> (optional, comma separated, up to 8)</label>
<input type="text" id="cities" name="cities" placeholder="Austin, Dallas, Houston" value="${esc((lead.cities ?? []).join(', '))}">
<button type="submit">Redraft</button></form>
<p class="muted">Nothing goes to ${esc(lead.name)}. A new approval email reaches you in a few minutes.</p>`)
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const lead = verify<{ lead: Lead }>(String(form?.get('t') ?? ''))?.lead
  if (!lead) return invalid()
  const cities = String(form?.get('cities') ?? '').split(',').map(s => s.trim()).filter(Boolean).slice(0, 8)
  const next: Lead = { ...lead, cities: cities.length ? cities : undefined }

  after(async () => {
    try {
      const report = await draftReport(next)
      const sent = await sendReportForApproval(report, studio)
      if (sent.error) throw new Error(sent.error)
    } catch (cause) {
      console.error('[visibility-check/redraft] failed:', cause)
      await sendDraftFailed(next, studio, String(cause).slice(0, 500))
    }
  })

  return page('Redrafting', `<h1>Redrafting the report for ${esc(lead.name)}.</h1>
<p>${cities.length ? `Checking ${esc(cities.join(', '))}. ` : ''}The new approval email reaches you in a few minutes.</p>`)
}
