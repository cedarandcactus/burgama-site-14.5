/*
  ENQUIRY MODEL — shared by the browser form and the send endpoint.

  This lives outside the component because the server composes the email
  itself rather than trusting a body assembled in the browser. Both sides
  import the same option lists, labels and validation, so a change to a
  budget band or a timing label cannot drift between what a visitor sees
  on the review step and what arrives in the inbox.

  Everything here is pure and framework-free: no React, no server-only
  APIs, safe to import from either side.
*/

export const serviceOptions = [
  ['strategy-design', 'strategy / design'],
  ['website-growth', 'website / growth'],
] as const
export const timingOptions = [
  ['soon', 'as soon as practical'],
  ['flexible', 'flexible'],
  ['date', 'I have a date'],
] as const
export const currencies = ['USD', 'GBP', 'EUR', 'CAD', 'AUD'] as const
export const budgetBands = [[0, 5000], [5000, 10000], [10000, 25000], [25000, 50000], [50000, 100000], [100000, null]] as const
export const recipient = 'hello@burgama.com'
export const mailtoLengthLimit = 1800

export type Currency = typeof currencies[number]
export type Service = typeof serviceOptions[number][0]
export type Timing = typeof timingOptions[number][0]
export type EnquiryDraft = {
  companyName: string
  website: string
  name: string
  email: string
  services: Service[]
  brief: string
  timing: Timing | ''
  deadline: string
  budget: number
  budgetUndecided: boolean
  currency: Currency
}
export type Errors = Partial<Record<keyof EnquiryDraft, string>>

export const fieldStep: Record<keyof EnquiryDraft, number> = {
  companyName: 0,
  website: 0,
  name: 0,
  email: 0,
  services: 1,
  brief: 1,
  timing: 2,
  deadline: 2,
  budget: 3,
  budgetUndecided: 3,
  currency: 3,
}

export function createEmptyDraft(): EnquiryDraft {
  return {
    companyName: '', website: '', name: '', email: '', services: [], brief: '',
    timing: '', deadline: '', budget: 2, budgetUndecided: false, currency: 'USD',
  }
}

export function currentDateValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function formatBudget(index: number, currency: Currency, compact = false) {
  const [min, max] = budgetBands[index]
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0, ...(compact ? { notation: 'compact' as const } : {}) })
  if (!min) return `under ${formatter.format(max!)}`
  if (max === null) return `${formatter.format(min)}+`
  return `${formatter.format(min)}–${formatter.format(max)}`
}

export function optionLabel<T extends readonly (readonly [string, string])[]>(options: T, value: string) {
  return options.find(option => option[0] === value)?.[1] ?? value
}

export function normalizeWebsite(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) return null
    return url.toString().replace(/\/$/, '')
  } catch {
    return null
  }
}

export function budgetLabel(draft: EnquiryDraft) {
  return draft.budgetUndecided ? `not sure yet (${draft.currency})` : `${formatBudget(draft.budget, draft.currency)} ${draft.currency}`
}

export function timingLabel(draft: EnquiryDraft) {
  if (draft.timing === 'date') {
    const date = new Date(`${draft.deadline}T12:00:00`)
    return Number.isNaN(date.getTime()) ? draft.deadline : new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
  }
  return optionLabel(timingOptions, draft.timing)
}

export function validateStep(index: number, draft: EnquiryDraft): Errors {
  const errors: Errors = {}
  if (index === 0) {
    if (!draft.companyName.trim()) errors.companyName = 'Enter your company name.'
    if (draft.website && !normalizeWebsite(draft.website)) errors.website = 'Enter a valid website, such as example.com.'
    if (!draft.name.trim()) errors.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.'
  }
  if (index === 1) {
    if (!draft.services.length) errors.services = 'Choose at least one area.'
    if (!draft.brief.trim()) errors.brief = 'Tell us what you want to accomplish.'
  }
  if (index === 2) {
    if (!draft.timing) errors.timing = 'Choose a timeframe.'
    if (draft.timing === 'date') {
      if (!draft.deadline) errors.deadline = 'Choose a target date.'
      else if (draft.deadline < currentDateValue()) errors.deadline = 'Choose today or a future date.'
    }
  }
  return errors
}

export function validateDraft(draft: EnquiryDraft) {
  return [0, 1, 2].reduce<Errors>((all, index) => ({ ...all, ...validateStep(index, draft) }), {})
}

export function buildEnquiry(draft: EnquiryDraft) {
  const serviceLabels = draft.services.map(service => optionLabel(serviceOptions, service)).join(', ')
  const body = [
    'Hello Burgama,', '',
    `Company: ${draft.companyName.trim()}`,
    ...(draft.website.trim() ? [`Website: ${draft.website.trim()}`] : []), '',
    `Project: ${serviceLabels}`,
    draft.brief.trim(), '',
    `Timing: ${timingLabel(draft)}`,
    `Budget: ${budgetLabel(draft)}`, '',
    draft.name.trim(),
    draft.email.trim(),
  ].join('\n')
  const subject = 'Let’s start a project — Burgama'
  return {
    body,
    subject,
    text: `To: ${recipient}\nSubject: ${subject}\n\n${body}`,
    mailto: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  }
}
