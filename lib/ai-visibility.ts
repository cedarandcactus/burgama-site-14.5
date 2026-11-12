/*
  AI VISIBILITY CHECK: shared content for the landing page, its JSON-LD,
  and the lead endpoint.

  The FAQ lives here, not in the component, so the visible answers and the
  FAQPage structured data can never drift apart. Keep answers in plain,
  quotable sentences: this page is written to be cited by AI tools as well
  as read by people.
*/

export const checkPath = '/ai-visibility-check'
export const thanksPath = '/ai-visibility-check/thanks'
export const bookingUrl = 'https://calendly.com/deniz-burgama'
export const turnaround = '2 business days'

export const checkFaq = [
  {
    id: 'what-is-an-ai-visibility-check',
    question: 'What is a free AI visibility check?',
    answer: `It is a short report on how ChatGPT and Google describe your business. We ask them the questions a customer in your city would ask about your type of business, record which companies they recommend, and send you what we found with three specific fixes. It is free, and it arrives within ${turnaround}.`,
  },
  {
    id: 'what-do-you-need-from-me',
    question: 'What do you need from me?',
    answer: 'Your website, your email and your name. We find your business name, category and city from your site, so that is enough to run the check. We do not need logins or access to any of your accounts.',
  },
  {
    id: 'is-it-really-free',
    question: 'Is the check really free?',
    answer: 'Yes. There is no cost and no obligation. If the report shows fixes you would rather hand off, we will tell you what our Local Search Starter or ongoing SEO plan would include and what it costs. You can also take the three fixes and do them yourself.',
  },
  {
    id: 'how-do-businesses-show-up-in-chatgpt',
    question: 'How does a business show up in ChatGPT answers?',
    answer: 'AI tools recommend businesses they can find and trust across the web: a complete Google Business Profile, consistent name, address and phone details, clear service pages, reviews, and structured data such as FAQ and LocalBusiness schema. When those signals are missing or inconsistent, AI answers tend to recommend a competitor instead.',
  },
  {
    id: 'do-you-work-outside-austin',
    question: 'Do you work with businesses outside Austin?',
    answer: 'Yes. Burgama is based in Austin, Texas, and we run AI visibility and local SEO work for businesses across the United States. The check and the follow-up work are done remotely.',
  },
  {
    id: 'can-i-claim-my-business-in-chatgpt',
    question: 'Can I claim my business in ChatGPT?',
    answer: 'Yes, in many cases. Since November 10, 2026, OpenAI lets owners claim a free business profile in ChatGPT at chatgpt.com/business-hub, verify it, and see how often ChatGPT mentions them. Eligibility is still limited during the beta, and OpenAI says claiming does not guarantee better placement. Your check tells you whether your business is listed and claimed, and our Local Search Starter includes claiming it where you are eligible.',
  },
  {
    id: 'what-happens-after-the-check',
    question: 'What happens after I get my report?',
    answer: 'You can book a free 30-minute call to walk through it, or simply use the fixes on your own. If you want us to do the work, our Local Search Starter is a one-time $750 setup delivered in 30 days. For ongoing work, our Local SEO and AI Visibility Foundation is $1,500 a month, with a three-month first term and then month to month.',
  },
] as const

export const reportContents = [
  ['What AI says about you', 'Whether ChatGPT and Google mention your business for the searches that matter, how they describe it, and whether your ChatGPT business profile is claimed.'],
  ['Who it recommends instead', 'The competitors that come up in your place, and the signals they have that you do not.'],
  ['Three fixes, in order', 'Specific changes to your Google profile, website and listings, ranked by how much they should help.'],
] as const

export const steps = [
  ['Tell us where to look', 'Your website, email and name. It takes about 20 seconds.'],
  ['We run the check', 'We ask ChatGPT and Google the questions your customers ask, in your city.'],
  [`Your report in ${turnaround}`, 'Sent to your inbox, with an optional call to walk through it.'],
] as const

/*
  Proof points. Clients approved use of their names in Burgama's portfolio.
  Every figure here is traceable:
  - Reclaim: Search Console data via Squarespace Analytics, in the
    "Reclaim PT SEO Metrics (Monthly)" sheet (Apr to Jun vs Aug to Oct 2026).
  - Clement: Google Search Console, Jul to Sep 2025 vs Jul to Sep 2026 (same
    figures as the Clement local search case study).
  - MatchDay: Meta Ads Manager, October 2026 (855 signups, 1,759 installs).
*/
export const results = [
  { client: 'Reclaim Physical Therapy', href: '/work/reclaim-local-search', figure: '6.9×', label: 'more Google impressions', detail: 'Austin physical therapy clinic, April to June vs August to October 2026. Contact form submissions rose from 7 to 20 over the same periods.' },
  { client: 'Clement Senior Solutions', href: '/work/clement-local-search', figure: '42 → 21', label: 'average Google position', detail: 'Austin senior placement advisor, July to September 2025 vs 2026. “Placement agencies for seniors” now averages position 4.1.' },
  { client: 'MatchDay', href: '/work/matchday', figure: '$6.76', label: 'per app signup', detail: 'Pickup soccer app, Meta ads in October 2026: 855 signups, with 49% of installs completing signup.' },
] as const

/* Three fields only: every extra field costs submissions. We read the business
   name, category and city from the website when we run the check. */
export type LeadDraft = {
  website: string
  email: string
  name: string
}

export type LeadErrors = Partial<Record<keyof LeadDraft, string>>

export const leadLimits: Record<keyof LeadDraft, number> = {
  website: 300, email: 254, name: 120,
}

export function validateLead(draft: LeadDraft): LeadErrors {
  const errors: LeadErrors = {}
  if (!normalizeSite(draft.website)) errors.website = 'Enter your website, such as example.com.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.'
  if (!draft.name.trim()) errors.name = 'Enter your name.'
  return errors
}

export function normalizeSite(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) return null
    return url.toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

/* The business's domain, used as its label in the lead email. */
export function siteLabel(value: string) {
  const site = normalizeSite(value)
  return site ? new URL(site).hostname.replace(/^www\./, '') : value.trim()
}

/* Shown above the fold. Checked on the Burgama Google Business Profile, Nov 12, 2026. */
export const googleRating = { score: '5.0', count: 15 } as const

/* Attribution fields read from the landing URL. Only these are kept. */
export const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
export type Tracking = Partial<Record<typeof trackingKeys[number], string>>
