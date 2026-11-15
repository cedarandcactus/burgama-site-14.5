import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { deflateRawSync, inflateRawSync } from 'node:zlib'
import { bookingUrl, normalizeSite, siteLabel } from '@/lib/ai-visibility'

/*
  LEAD FLOW for the free AI visibility check.

  On submit (app/api/visibility-check/route.ts):
    1. sendConfirmation()  the lead gets an instant, fixed-template email with
                           the booking link. Nothing in it can be wrong.
    2. draftReport()       runs after the response: asks OpenAI (with web
                           search) the questions a customer would ask, writes
                           the report, and emails it to the studio with an
                           "Approve and send" link. Nothing goes to the lead
                           until someone approves.
  On approve (app/api/visibility-check/approve):
    3. sendReport()        sends the report to the lead and schedules two
                           follow-ups (day 2, day 5) in Resend. The studio
                           email has a link to cancel them once a call is booked.

  Links are signed with an HMAC derived from RESEND_API_KEY, so no extra
  secret is needed. The report travels inside the signed link (compressed),
  so there is no database.

  Environment: RESEND_API_KEY (set), OPENAI_API_KEY (needed for step 2; without
  it the studio gets a "draft by hand" notice), OPENAI_REPORT_MODEL (optional).
*/

const resendEndpoint = 'https://api.resend.com/emails'
export const leadFrom = process.env.CONTACT_FROM ?? 'Burgama <enquiries@send.burgama.com>'
export const studioReplyTo = 'hello@burgama.com'
const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.burgama.com'

export type Lead = {
  name: string; email: string; website: string; source: string
  /* Optional: the cities to check, for businesses in more than one market.
     Set from the redraft page. Without it the model reads the cities off the site. */
  cities?: string[]
}

export type Report = {
  lead: Lead
  date: string
  business: string
  verdict: string
  summary: string
  rows: { question: string; result: string; mentioned: boolean }[]
  competitors: { name: string; times: string; why: string }[]
  fixes: { title: string; body: string }[]
  offer: 'starter' | 'scope'
  /* v2: the one fix the lead sees, written for a non-marketer. */
  first_fix?: { headline: string; plain: string }
}

/* ------------------------------------------------------------------ utils */

/* Model output can carry markdown (**bold**) and doubled punctuation. Strip it. */
const plain = (s: string) => s
  .replace(/\*\*|__|`/g, '')
  .replace(/^\s*#+\s*/gm, '')
  .replace(/\s+([.,!?])/g, '$1')
  .replace(/([.!?])[.]+/g, '$1')
  .trim()
const noDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ', ').replace(/,\s*,/g, ',')
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
const firstName = (name: string) => name.trim().split(/\s+/)[0] || 'there'

function signingKey() {
  const base = process.env.RESEND_API_KEY
  if (!base) throw new Error('RESEND_API_KEY is not set')
  return createHash('sha256').update(`burgama-lead-flow:${base}`).digest()
}

export function sign(data: unknown) {
  const payload = deflateRawSync(Buffer.from(JSON.stringify(data))).toString('base64url')
  const mac = createHmac('sha256', signingKey()).update(payload).digest('base64url')
  return `${payload}.${mac}`
}

export function verify<T>(token: string): T | null {
  const [payload, mac] = token.split('.')
  if (!payload || !mac) return null
  const expected = createHmac('sha256', signingKey()).update(payload).digest()
  const given = Buffer.from(mac, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  try { return JSON.parse(inflateRawSync(Buffer.from(payload, 'base64url')).toString()) as T } catch { return null }
}

export function bookingLink(lead: Pick<Lead, 'name' | 'email'>, content: string) {
  const url = new URL(bookingUrl)
  url.searchParams.set('name', lead.name.trim())
  url.searchParams.set('email', lead.email.trim())
  url.searchParams.set('utm_source', 'ai-check')
  url.searchParams.set('utm_content', content)
  return url.toString()
}

export async function resend(body: Record<string, unknown>, idempotencyKey?: string): Promise<{ id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { error: 'RESEND_API_KEY not set' }
  const response = await fetch(resendEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`, 'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    },
    body: JSON.stringify(body),
  })
  const json = await response.json().catch(() => ({}))
  if (!response.ok) return { error: `${response.status} ${JSON.stringify(json).slice(0, 300)}` }
  return { id: (json as { id?: string }).id }
}

export async function cancelScheduled(id: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const response = await fetch(`${resendEndpoint}/${id}/cancel`, { method: 'POST', headers: { Authorization: `Bearer ${key}` } })
  return response.ok
}

/* Every link in a lead email must point straight at its destination. A
   wrapped link (google.com/url, a tracking redirect) adds a hop and a
   warning page, and loses bookings. Fail loudly instead of sending one. */
export function assertDirectLinks(html: string) {
  const bad = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1])
    .filter(u => /google\.[a-z.]+\/url|safelinks|urldefense|\/redirect\?|click\./i.test(u))
  if (bad.length) throw new Error(`Wrapped link in email: ${bad[0].slice(0, 120)}`)
  return html
}

/* Email shell: document style, no em dashes. */
const h3 = (t: string) => `<h3 style="font-size:15px;margin:24px 0 4px;padding-bottom:6px;border-bottom:1px solid #ddd;">${t}</h3>`
const td = 'border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top'
const button = (href: string, label: string) =>
  `<p style="margin:20px 0"><a href="${href}" style="display:inline-block;background:#001328;color:#f0f0fa;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${label}</a></p>`
const shell = (inner: string) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#1a1a1a;max-width:680px">${inner}</div>`
const signoff = `<p>The Burgama team<br><span style="color:#666">burgama.com &middot; (713) 724-3637</span></p>`

/* --------------------------------------------------------- 1. confirmation */

export function confirmationEmail(lead: Lead) {
  const site = siteLabel(lead.website)
  const book = bookingLink(lead, 'confirmation')
  const html = shell(`
<p>Hi ${esc(firstName(lead.name))},</p>
<p>Thanks for requesting a free AI visibility check for <b>${esc(site)}</b>. <b>It's running now.</b> We ask ChatGPT the questions your customers ask, see who it recommends, and a strategist on our team reviews the results before anything reaches you. Your report arrives by email within 2 business days, usually sooner.</p>
<p><b>Want to go through it together?</b> Book a free 30-minute call and we'll walk you through what we found and what to fix first. Most people pick a time now so the report and the call line up.</p>
${button(book, 'Book a free 30-minute call')}
<p>If you have a question in the meantime, just reply to this email.</p>
${signoff}`)
  const text = [
    `Hi ${firstName(lead.name)},`, '',
    `Thanks for requesting a free AI visibility check for ${site}. It's running now. We ask ChatGPT the questions your customers ask, see who it recommends, and a strategist on our team reviews the results before anything reaches you. Your report arrives by email within 2 business days, usually sooner.`, '',
    `Want to go through it together? Book a free 30-minute call and we'll walk you through what we found and what to fix first: ${book}`, '',
    'If you have a question in the meantime, just reply to this email.', '',
    'The Burgama team', 'burgama.com · (713) 724-3637',
  ].join('\n')
  return { subject: `Your AI visibility check for ${site} is running`, html, text }
}

export async function sendConfirmation(lead: Lead) {
  const mail = confirmationEmail(lead)
  return resend({ from: leadFrom, to: [lead.email.trim()], reply_to: studioReplyTo, ...mail })
}

/* ------------------------------------------------------------- 2. report */

type OpenAIResponse = { output_text?: string; output?: { type: string; content?: { type: string; text?: string }[] }[] }

function outputText(json: OpenAIResponse) {
  if (json.output_text) return json.output_text
  return (json.output ?? []).flatMap(o => o.content ?? []).filter(c => c.type === 'output_text').map(c => c.text ?? '').join('\n')
}

async function ask(input: string, opts: { search?: boolean; json?: boolean } = {}) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY is not set')
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_REPORT_MODEL ?? 'gpt-5',
      input,
      ...(opts.search ? { tools: [{ type: 'web_search' }] } : {}),
      ...(opts.json ? { text: { format: { type: 'json_object' } } } : {}),
    }),
  })
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${(await response.text()).slice(0, 300)}`)
  return outputText(await response.json() as OpenAIResponse)
}

async function siteSnapshot(website: string) {
  /* Only public hostnames: no IP literals or internal names. */
  const host = new URL(website).hostname
  if (/^[\d.]+$|^\[|localhost|\.internal$|\.local$/i.test(host)) return { title: '', description: '', schema: 0, text: '' }
  try {
    const response = await fetch(website, { headers: { 'User-Agent': 'BurgamaAIVisibilityCheck/1.0' }, signal: AbortSignal.timeout(10000) })
    const html = (await response.text()).slice(0, 400000)
    const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? ''
    const textOnly = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    return {
      title: pick(/<title[^>]*>([^<]*)<\/title>/i),
      description: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i),
      schema: (html.match(/application\/ld\+json/gi) ?? []).length,
      text: textOnly.slice(0, 6000),
    }
  } catch {
    return { title: '', description: '', schema: 0, text: '' }
  }
}

const MAX_CITIES = 8

export async function draftReport(lead: Lead): Promise<Report> {
  const website = normalizeSite(lead.website) ?? `https://${lead.website.trim()}`
  const business = siteLabel(lead.website)
  const snap = await siteSnapshot(website)

  /* Step A: who they are and what their customers would ask. */
  const plan = JSON.parse(await ask(
    `You plan an AI visibility check for a business. Website: ${website}\nTitle: ${snap.title}\nMeta description: ${snap.description}\nPage text: ${snap.text}\n\n` +
    (lead.cities?.length ? `The business serves these cities, check every one: ${lead.cities.slice(0, MAX_CITIES).join('; ')}.\n` : '') +
    'Return JSON: {"business_name": string, "category": string, "cities": [every city or metro the business serves or lists on the site, main one first, at most ' + MAX_CITIES + ', [] if not local], "customer_type": "local consumers" | "businesses" | "national consumers", ' +
    '"questions": [questions a real customer of this kind of business would type into ChatGPT when looking for a provider, in the customer\'s own words. ' +
    'One city or none: 3 questions, naming the city when local. Two to four cities: 2 questions per city. Five or more: 1 question per city, the most common thing a customer there would ask. Every question names its city. ' +
    'Then one last question, always last: "What do you know about {business_name}?" with its main city if local]}',
    { json: true },
  )) as { business_name: string; category: string; cities?: string[]; customer_type: string; questions: string[] }
  const cities = (lead.cities?.length ? lead.cities : plan.cities ?? []).slice(0, MAX_CITIES)
  const where = cities.length ? ` in ${cities.join(', ')}` : ''

  /* Step B: ask each question the way a customer would, with web search. */
  const answers = await Promise.all(plan.questions.slice(0, MAX_CITIES * 2 + 1).map(async q => {
    try { return { question: q, answer: await ask(q, { search: true }) } } catch (e) { return { question: q, answer: `ERROR ${String(e)}` } }
  }))

  /* Step C: turn the answers into the report. */
  const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/Chicago', month: 'long', day: 'numeric', year: 'numeric' })
  const report = JSON.parse(await ask(
    `You write a free "AI visibility check" for ${plan.business_name} (${website}), a ${plan.category}${where}, from a marketing agency called Burgama.\n` +
    `Website facts we observed: title tag "${snap.title}", meta description "${snap.description}", structured data blocks found: ${snap.schema}.\n\n` +
    `These are ChatGPT's answers to customer questions:\n${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer.slice(0, 5000)}`).join('\n\n')}\n\n` +
    'Return JSON with: "verdict" (one plain sentence for our team: whether ChatGPT recommends them and who it recommends instead), ' +
    '"summary" (2 to 4 sentences for our team on how often they appeared, where, and whether the description of them was accurate), ' +
    '"rows" (one per question, same order: {"question", "result" (short: "Not mentioned", "Recommended, #2 of 5", "Knew you, accurate", "Did not know you"), "mentioned": true only if the answer named or recommended this business}), ' +
    '"competitors" (up to 3 businesses recommended instead, most frequent first: {"name", "times" ("3 of 4 answers"), "why" (what ChatGPT cited them for, from the answers only)}), ' +
    '"fixes" (exactly 3 for our team, ranked by impact for effort, specific to this business and to what you observed: {"title", "body" (2 to 3 sentences)}), ' +
    '"first_fix" (the top fix rewritten for a busy owner with no marketing background: {"headline" (at most 10 words, starts with a verb), "plain" (one or two sentences, at most 35 words, saying what to do and why it helps ChatGPT recommend them)}). ' +
    'In first_fix never use these words: SEO, schema, structured data, meta, title tag, citation, entity, intent, keyword, signals, Q1, Q2. ' +
    `"offer": "starter" if this is a local business a $750 local search setup fits, otherwise "scope".\n` +
    (cities.length > 1 ? `They serve several cities (${cities.join(', ')}). In "verdict", "summary" and "first_fix", say which cities they are recommended in and which they are missing from. ` : '') +
    'Rules: plain text only, no markdown, no asterisks. Write as "we" for Burgama and "you" for the reader. Plain, direct sentences. Never use em dashes or en dashes. ' +
    'Never promise rankings or customers. Only state what the answers above show; do not invent review counts or facts.',
    { json: true },
  )) as Omit<Report, 'lead' | 'date' | 'business'>

  const tidy = <T,>(v: T): T => JSON.parse(JSON.stringify(v), (_k, x) => typeof x === 'string' ? plain(noDashes(x)) : x)
  return tidy({ ...report, lead, date: today, business: plan.business_name || business })
}

/* Lead-facing report, v2: short, plain, one reason to book.
   The count is computed from the rows (not written by the model), so the
   headline can't contradict the scorecard. The last row is always the
   "what do you know about us" question and is shown separately. */
function reportFacts(r: Report) {
  const rows = r.rows.map(x => ({ ...x, question: plain(x.question), result: plain(x.result) }))
  const named = rows.length > 1 ? rows[rows.length - 1] : undefined
  const asked = named ? rows.slice(0, -1) : rows
  const hits = asked.filter(x => x.mentioned).length
  const rivals = r.competitors.map(c => plain(c.name)).filter(Boolean).slice(0, 3)
  const list = (a: string[]) => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`
  const biz = plain(r.business)
  const headline = hits === 0
    ? `ChatGPT did not recommend ${biz} for any of the ${asked.length} questions your customers ask.`
    : `ChatGPT recommended ${biz} for ${hits} of the ${asked.length} questions your customers ask.`
  const instead = rivals.length ? `It sent people to ${list(rivals)} instead.` : ''
  const knows = named ? (named.mentioned ? 'When we asked about you by name, it knew who you are.' : 'When we asked about you by name, it did not know who you are.') : ''
  /* Reports drafted before v2 have no plain-language fix: show the title only. */
  const fix = r.first_fix ?? { headline: plain(r.fixes[0]?.title ?? ''), plain: '' }
  const subject = rivals.length && hits < asked.length
    ? `${firstName(r.lead.name)}, ChatGPT is recommending ${rivals[0]} instead of you`
    : `${firstName(r.lead.name)}, here is what ChatGPT says about ${biz}`
  return { asked, hits, named, headline, instead, knows, fix, subject, biz }
}

export function reportEmail(r: Report) {
  const book = bookingLink(r.lead, 'report')
  const f = reportFacts(r)
  const mark = (ok: boolean) => ok
    ? '<span style="color:#1f7a3a;font-weight:700">&#10003;</span>'
    : '<span style="color:#a3261b;font-weight:700">&#10007;</span>'
  const card = f.asked.map(x =>
    `<tr><td style="padding:6px 10px 6px 0;vertical-align:top;width:18px">${mark(x.mentioned)}</td><td style="padding:6px 0;vertical-align:top">&ldquo;${esc(x.question)}&rdquo;</td></tr>`).join('')
  const ps = r.offer === 'starter'
    ? `<p style="color:#555;font-size:13px">P.S. Rather we just handle it? Our Local Search Starter is a one-time $750 setup, done in 30 days.</p>`
    : ''
  const html = shell(`
<p>Hi ${esc(firstName(r.lead.name))},</p>
<p>We ran your free AI visibility check. <b>${esc(f.headline)}</b> ${esc(f.instead)}</p>
<table style="border-collapse:collapse;font-size:14px;margin:4px 0 8px">${card}</table>
<p>${esc(f.knows)}</p>
${h3('The first thing we would fix')}
<p><b>${esc(f.fix.headline)}.</b> ${esc(f.fix.plain)}</p>
<p>There are two more fixes behind this one. On a free 30-minute call we will walk you through all three and what it takes to get recommended.</p>
${button(book, 'Pick a time for your free call')}
<p>Or just reply to this email with any questions.</p>
<p>Deniz<br><span style="color:#666">Burgama &middot; burgama.com &middot; (713) 724-3637</span></p>
${ps}
<p style="color:#888;font-size:12px">We asked ChatGPT on ${esc(r.date)}. Answers change from day to day, so treat this as a snapshot.</p>`)
  const text = [
    `Hi ${firstName(r.lead.name)},`, '',
    `We ran your free AI visibility check. ${f.headline} ${f.instead}`.trim(), '',
    ...f.asked.map(x => `${x.mentioned ? '[yes]' : '[no]'} "${x.question}"`), '',
    f.knows, '',
    `The first thing we would fix: ${f.fix.headline}. ${f.fix.plain}`, '',
    'There are two more fixes behind this one. On a free 30-minute call we will walk you through all three and what it takes to get recommended.',
    `Pick a time: ${book}`, '',
    'Or just reply to this email with any questions.', '',
    'Deniz', 'Burgama · burgama.com · (713) 724-3637',
    ...(r.offer === 'starter' ? ['', 'P.S. Rather we just handle it? Our Local Search Starter is a one-time $750 setup, done in 30 days.'] : []),
    '', `We asked ChatGPT on ${r.date}. Answers change from day to day, so treat this as a snapshot.`,
  ].join('\n')
  return { subject: f.subject, html: assertDirectLinks(noDashes(html)), text: noDashes(text) }
}

/* Studio email: the report as the lead will see it, plus the approve link. */
export const redraftLink = (lead: Lead) => `${siteOrigin}/api/visibility-check/redraft?t=${sign({ lead })}`

export async function sendReportForApproval(r: Report, studio: string[]) {
  const mail = reportEmail(r)
  const approve = `${siteOrigin}/api/visibility-check/approve?t=${sign(r)}`
  const html = shell(`
<p style="background:#fff7d6;border:1px solid #e6d27a;padding:12px 14px;border-radius:8px"><b>Draft report for ${esc(r.lead.name)} (${esc(r.lead.email)}), ${esc(normalizeSite(r.lead.website) ?? r.lead.website)}, source ${esc(r.lead.source)}.</b><br>
Read it below. If it is right, approve it and it goes to them straight away from Burgama, with follow-ups on day 2 and day 5. If something is off, reply to them by hand instead and do not approve.</p>
${button(approve, 'Approve and send to ' + esc(firstName(r.lead.name)))}
<p style="font-size:13px">Not right? <a href="${redraftLink(r.lead)}">Redraft it</a>, and add cities if they serve more than one market. Never rebuild it as a Gmail draft: Gmail rewrites the booking link into a redirect.</p>
<hr style="border:0;border-top:1px solid #ddd;margin:24px 0">
<details style="margin:0 0 16px"><summary style="cursor:pointer;color:#326a9f"><b>Internal notes for the call (not sent)</b></summary>
<p>${esc(plain(r.verdict))} ${esc(plain(r.summary))}</p>
<p>${r.competitors.map(c => `<b>${esc(plain(c.name))}</b> (${esc(c.times)}): ${esc(plain(c.why))}`).join('<br>')}</p>
<p>${r.fixes.map((x, i) => `<b>${i + 1}. ${esc(plain(x.title))}:</b> ${esc(plain(x.body))}`).join('<br>')}</p></details>
<p style="color:#666;font-size:12px">Subject: ${esc(mail.subject)}</p>`) + mail.html
  return resend({ from: leadFrom, to: studio, reply_to: r.lead.email, subject: `Approve report: ${plain(r.business)} (${r.lead.source.split(' / ').slice(0, 3).join(' / ')})`, html })
}

export async function sendDraftFailed(lead: Lead, studio: string[], reason: string) {
  return resend({
    from: leadFrom, to: studio, reply_to: lead.email,
    subject: `Report needs a manual draft: ${siteLabel(lead.website)}`,
    text: `The automatic report for ${lead.name} (${lead.email}, ${normalizeSite(lead.website) ?? lead.website}) could not be drafted.\nReason: ${reason}\n\nThe lead already got the instant confirmation with the booking link. Try again (and add cities if they serve more than one market): ${redraftLink(lead)}`,
  })
}

/* ------------------------------------------------------ 3. send + follow-ups */

function followUps(r: Report) {
  const book = bookingLink(r.lead, 'followup')
  const first = firstName(r.lead.name)
  const day = (n: number) => new Date(Date.now() + n * 24 * 3600 * 1000).toISOString()
  const fix = r.first_fix?.headline ?? plain(r.fixes[0]?.title ?? 'the first fix')
  return [
    {
      scheduled_at: day(2),
      subject: `Re: ${reportFacts(r).subject}`,
      text: noDashes(`Hi ${first},\n\nChecking in on your AI visibility report. If you want, we can walk through it on a free 30-minute call, starting with "${fix}", which is the change we would make first.\n\nPick a time here: ${book}\n\nDeniz\nBurgama`),
    },
    {
      scheduled_at: day(5),
      subject: `Re: ${reportFacts(r).subject}`,
      text: noDashes(`Hi ${first},\n\nLast note from us on this. AI answers change as competitors update their sites, so the gaps in your report are worth closing while they are small. If a quick call would help, here is the link: ${book}\n\nEither way, thanks for checking with us.\n\nDeniz\nBurgama`),
    },
  ]
}

/* `once` is a stable key per approval link: Resend drops repeats for 24 hours,
   so a double tap on Approve cannot send the report twice. */
export async function sendReport(r: Report, once: string) {
  const mail = reportEmail(r)
  const sent = await resend({ from: leadFrom, to: [r.lead.email.trim()], reply_to: studioReplyTo, ...mail }, `report-${once}`)
  if (sent.error) return { error: sent.error, followUpIds: [] as string[] }
  const followUpIds: string[] = []
  for (const [i, f] of followUps(r).entries()) {
    const res = await resend({ from: leadFrom, to: [r.lead.email.trim()], reply_to: studioReplyTo, ...f }, `followup${i}-${once}`)
    if (res.id) followUpIds.push(res.id)
  }
  return { id: sent.id, followUpIds }
}

export function stopLink(followUpIds: string[]) {
  return `${siteOrigin}/api/visibility-check/stop?t=${sign({ ids: followUpIds })}`
}
