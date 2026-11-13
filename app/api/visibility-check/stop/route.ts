import { cancelScheduled, verify } from '@/lib/lead-flow'

/* CANCEL scheduled follow-ups for a lead. GET confirms, POST cancels. */

const page = (body: string) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Follow-ups</title>
<style>body{font-family:Arial,Helvetica,sans-serif;background:#f0f0fa;color:#001328;max-width:560px;margin:0 auto;padding:48px 16px;line-height:1.55}
button{background:#001328;color:#f0f0fa;border:0;border-radius:999px;padding:14px 26px;font-size:16px;font-weight:600;cursor:pointer}</style></head><body>${body}</body></html>`,
  { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
)

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('t') ?? ''
  if (!verify<{ ids: string[] }>(token)) return page('<h1>This link is not valid.</h1>')
  return page(`<h1>Cancel the follow-up emails?</h1><form method="post"><input type="hidden" name="t" value="${token.replace(/"/g, '')}"><button type="submit">Cancel follow-ups</button></form>`)
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const data = verify<{ ids: string[] }>(String(form?.get('t') ?? ''))
  if (!data) return page('<h1>This link is not valid.</h1>')
  const results = await Promise.all(data.ids.map(cancelScheduled))
  const cancelled = results.filter(Boolean).length
  return page(`<h1>${cancelled} of ${data.ids.length} follow-ups cancelled.</h1><p>Any not cancelled had already gone out.</p>`)
}
