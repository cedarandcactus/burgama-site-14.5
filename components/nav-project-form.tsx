'use client'

import { useEffect, useLayoutEffect, useId, useRef, useState, type FormEvent } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSmoothScroll } from '@/components/smooth-scroll'
import styles from './nav-project-form.module.css'

const companyTypes = ['startup', 'small business', 'established company', 'agency', 'nonprofit', 'other'] as const
const serviceOptions = [
  ['strategy', 'strategy'],
  ['brand-design', 'brand / design'],
  ['website-digital', 'website / digital'],
  ['ecommerce', 'ecommerce'],
  ['marketing-growth', 'marketing / growth'],
  ['not-sure', 'not sure yet'],
] as const
const preferredStartOptions = [
  ['asap', 'as soon as possible'],
  ['one-three-months', 'within 1–3 months'],
  ['three-six-months', 'within 3–6 months'],
  ['flexible', 'flexible / not sure'],
] as const
const launchOptions = [
  ['flexible', 'flexible / not sure'],
  ['quarter', 'quarter / year'],
  ['date', 'specific date'],
] as const
const roleOptions = [
  ['decision-maker', 'decision maker'],
  ['team', 'part of the team'],
  ['researching', 'researching options'],
  ['other', 'other'],
] as const
const currencies = ['USD', 'GBP', 'EUR', 'CAD', 'AUD'] as const
const budgetBands = [[0, 5000], [5000, 10000], [10000, 25000], [25000, 50000], [50000, 100000], [100000, null]] as const
const stepDefinitions = [
  { id: 'company', heading: 'About your company' },
  { id: 'project', heading: 'What do you need?' },
  { id: 'context', heading: 'A little more context' },
  { id: 'timing', heading: 'Timing' },
  { id: 'budget', heading: 'Budget' },
  { id: 'you', heading: 'Your details' },
  { id: 'review', heading: 'Review' },
] as const
const recipient = 'hello@burgama.com'
const mailtoLengthLimit = 1800

type Currency = typeof currencies[number]
type Service = typeof serviceOptions[number][0]
type CompanyType = typeof companyTypes[number]
type PreferredStart = typeof preferredStartOptions[number][0]
type LaunchMode = typeof launchOptions[number][0]
type DecisionRole = typeof roleOptions[number][0]
type EnquiryDraft = {
  companyName: string
  companyType: CompanyType | ''
  customType: string
  website: string
  services: Service[]
  brief: string
  audience: string
  assets: string
  preferredStart: PreferredStart | ''
  launchMode: LaunchMode | ''
  launchQuarter: string
  launchYear: string
  deadline: string
  budget: number
  budgetUndecided: boolean
  currency: Currency
  name: string
  email: string
  phone: string
  role: DecisionRole | ''
  customRole: string
}
type Errors = Partial<Record<keyof EnquiryDraft, string>>

const fieldStep: Record<keyof EnquiryDraft, number> = {
  companyName: 0,
  companyType: 0,
  customType: 0,
  website: 0,
  services: 1,
  brief: 1,
  audience: 2,
  assets: 2,
  preferredStart: 3,
  launchMode: 3,
  launchQuarter: 3,
  launchYear: 3,
  deadline: 3,
  budget: 4,
  budgetUndecided: 4,
  currency: 4,
  name: 5,
  email: 5,
  phone: 5,
  role: 5,
  customRole: 5,
}

function createEmptyDraft(): EnquiryDraft {
  return {
    companyName: '', companyType: '', customType: '', website: '', services: [], brief: '', audience: '', assets: '',
    preferredStart: '', launchMode: '', launchQuarter: '', launchYear: '', deadline: '', budget: 2,
    budgetUndecided: false, currency: 'USD', name: '', email: '', phone: '', role: '', customRole: '',
  }
}

function currentDateValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function formatBudget(index: number, currency: Currency, compact = false) {
  const [min, max] = budgetBands[index]
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0, ...(compact ? { notation: 'compact' as const } : {}) })
  if (!min) return `under ${formatter.format(max!)}`
  if (max === null) return `${formatter.format(min)}+`
  return `${formatter.format(min)}–${formatter.format(max)}`
}

function optionLabel<T extends readonly (readonly [string, string])[]>(options: T, value: string) {
  return options.find(option => option[0] === value)?.[1] ?? value
}

function normalizeWebsite(value: string) {
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

function companyTypeLabel(draft: EnquiryDraft) {
  return draft.companyType === 'other' ? `other — ${draft.customType.trim()}` : draft.companyType
}

function budgetLabel(draft: EnquiryDraft) {
  return draft.budgetUndecided ? `not sure yet (${draft.currency})` : `${formatBudget(draft.budget, draft.currency)} ${draft.currency}`
}

function launchLabel(draft: EnquiryDraft) {
  if (draft.launchMode === 'quarter') return `${draft.launchQuarter} ${draft.launchYear}`
  if (draft.launchMode === 'date') {
    const date = new Date(`${draft.deadline}T12:00:00`)
    return Number.isNaN(date.getTime()) ? draft.deadline : new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
  }
  return optionLabel(launchOptions, draft.launchMode)
}

function validateStep(index: number, draft: EnquiryDraft): Errors {
  const errors: Errors = {}
  if (index === 0) {
    if (!draft.companyName.trim()) errors.companyName = 'Tell us the name of your company.'
    if (!draft.companyType) errors.companyType = 'Choose the type that fits best.'
    if (draft.companyType === 'other' && !draft.customType.trim()) errors.customType = 'Tell us a little about your company type.'
    if (draft.website && !normalizeWebsite(draft.website)) errors.website = 'Enter a valid website, such as example.com.'
  }
  if (index === 1) {
    if (!draft.services.length) errors.services = 'Choose at least one area, or select not sure yet.'
    if (!draft.brief.trim()) errors.brief = 'Tell us what you would like the project to accomplish.'
  }
  if (index === 3) {
    if (!draft.preferredStart) errors.preferredStart = 'Choose a preferred start window.'
    if (!draft.launchMode) errors.launchMode = 'Choose how you would like to describe the launch timing.'
    if (draft.launchMode === 'quarter') {
      if (!draft.launchQuarter) errors.launchQuarter = 'Choose a target quarter.'
      if (!draft.launchYear) errors.launchYear = 'Choose a target year.'
      if (draft.launchQuarter && draft.launchYear) {
        const now = new Date()
        const selectedQuarter = Number(draft.launchQuarter.slice(1))
        const currentQuarter = Math.floor(now.getMonth() / 3) + 1
        if (Number(draft.launchYear) < now.getFullYear() || (Number(draft.launchYear) === now.getFullYear() && selectedQuarter < currentQuarter)) {
          errors.launchQuarter = 'Choose the current quarter or a future quarter.'
        }
      }
    }
    if (draft.launchMode === 'date') {
      if (!draft.deadline) errors.deadline = 'Choose a target launch date.'
      else if (draft.deadline < currentDateValue()) errors.deadline = 'Choose today or a future date.'
    }
  }
  if (index === 5) {
    if (!draft.name.trim()) errors.name = 'Tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.'
    const digits = draft.phone.replace(/\D/g, '')
    if (!/^[+\d\s().-]+$/.test(draft.phone.trim()) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a phone number, including your country code.'
    if (!draft.role) errors.role = 'Tell us your role in the decision.'
    if (draft.role === 'other' && !draft.customRole.trim()) errors.customRole = 'Tell us how you are involved.'
  }
  return errors
}

function validateDraft(draft: EnquiryDraft) {
  return [0, 1, 3, 5].reduce<Errors>((all, index) => ({ ...all, ...validateStep(index, draft) }), {})
}

function buildEnquiry(draft: EnquiryDraft) {
  const serviceLabels = draft.services.map(service => optionLabel(serviceOptions, service)).join(', ')
  const role = draft.role === 'other' ? draft.customRole.trim() : optionLabel(roleOptions, draft.role)
  const body = [
    'Hello Burgama,', '', 'I’d love to talk about a project.', '',
    `Company: ${draft.companyName.trim()}`,
    `Company type: ${companyTypeLabel(draft)}`,
    `Website: ${draft.website.trim() || 'Not provided'}`, '',
    `Services needed: ${serviceLabels}`,
    `Project goals: ${draft.brief.trim()}`, '',
    `Target audience: ${draft.audience.trim() || 'Not provided'}`,
    `Existing assets / context: ${draft.assets.trim() || 'Not provided'}`, '',
    `Preferred start: ${optionLabel(preferredStartOptions, draft.preferredStart)}`,
    `Target launch: ${launchLabel(draft)}`, '',
    `Budget: ${budgetLabel(draft)}`, '',
    `Name: ${draft.name.trim()}`,
    `Email: ${draft.email.trim()}`,
    `Phone: ${draft.phone.trim()}`,
    `Decision-making role: ${role}`, '',
    'Let’s make something good.',
  ].join('\n')
  const subject = 'Let’s start a project — Burgama'
  return {
    body,
    subject,
    text: `To: ${recipient}\nSubject: ${subject}\n\n${body}`,
    mailto: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  }
}

function ReviewRow({ label, lines, editLabel, onEdit }: { label: string; lines: string[]; editLabel: string; onEdit: () => void }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{lines.map((line, index) => <span key={`${line}-${index}`}>{line || 'Not provided'}</span>)}</dd>
      <dd className={styles.reviewAction}><button type="button" onClick={onEdit} aria-label={editLabel}>edit</button></dd>
    </div>
  )
}

export { ProjectEnquiryForm as NavProjectForm }

type ProjectEnquiryProps = {
  variant?: 'navbar' | 'inline'
  introHeading?: string
  active?: boolean
  id?: string
  onMenu?: () => void
  onHeightChange?: (height: number) => void
}

export function ProjectEnquiryForm({ variant = 'navbar', introHeading = 'Tell us a bit about your project', active = true, id, onMenu, onHeightChange }: ProjectEnquiryProps) {
  const idPrefix = `enquiry-${useId()}`
  const scroll = useSmoothScroll()
  const inline = variant === 'inline'
  const focusStep = useRef(false)
  const focusError = useRef<keyof EnquiryDraft | null>(null)
  const [draft, setDraft] = useState<EnquiryDraft>(createEmptyDraft)
  const [step, setStep] = useState(0)
  const direction = useRef(1)
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const pendingStep = useRef<number | null>(null)
  const pendingErrors = useRef<Errors | null>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const transition = useRef<gsap.core.Timeline | null>(null)
  const deadline = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyRequest = useRef(0)
  const settleMotion = useRef<() => void>(() => {})
  const [errors, setErrors] = useState<Errors>({})
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle')
  const form = useRef<HTMLFormElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const heightCallback = useRef(onHeightChange)
  heightCallback.current = onHeightChange

  const now = new Date()
  const years = Array.from({ length: 6 }, (_, index) => String(now.getFullYear() + index))
  const enquiry = buildEnquiry(draft)
  const mailtoFits = enquiry.mailto.length <= mailtoLengthLimit

  useLayoutEffect(() => {
    const element = content.current
    const frame = viewport.current
    const root = form.current
    if (!element || !frame || !root) return
    let previousHeight = element.getBoundingClientRect().height
    let reportedHeight = 0
    let measureFrame = 0
    let resizeTween: gsap.core.Tween | null = null
    const settled = () => {
      delete root.dataset.layoutAnimating
      root.dispatchEvent(new Event('enquiry-layout-settled', { bubbles: true }))
    }
    const measure = () => {
      const height = element.getBoundingClientRect().height
      if (!height) return
      const formStyle = getComputedStyle(root)
      const chrome = (root.firstElementChild?.getBoundingClientRect().height ?? 0) + parseFloat(formStyle.rowGap) + parseFloat(formStyle.paddingTop) + parseFloat(formStyle.paddingBottom)
      const formHeight = Math.ceil(height + chrome)
      if (formHeight !== reportedHeight) {
        reportedHeight = formHeight
        heightCallback.current?.(formHeight)
      }
      if (Math.abs(height - previousHeight) < 1) return
      resizeTween?.kill()
      if (!active || prefersReducedMotion() || document.hidden || !previousHeight) {
        gsap.set(frame, { clearProps: 'height' })
        settled()
      } else {
        if (!frame.style.height) gsap.set(frame, { height: previousHeight })
        root.dataset.layoutAnimating = 'true'
        resizeTween = gsap.to(frame, { height, duration: .42, ease: 'power3.inOut', onComplete: () => {
          gsap.set(frame, { clearProps: 'height' })
          settled()
        } })
      }
      previousHeight = height
    }
    const observer = new ResizeObserver(() => {
      if (measureFrame) return
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0
        measure()
      })
    })
    observer.observe(element)
    observer.observe(root.firstElementChild!)
    measure()
    const finishResize = () => {
      resizeTween?.kill()
      gsap.set(frame, { clearProps: 'height' })
      settled()
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const onReduced = () => { if (reduced.matches) finishResize() }
    const onVisibility = () => { if (document.hidden) finishResize() }
    reduced.addEventListener('change', onReduced)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(measureFrame)
      resizeTween?.kill()
      gsap.set(frame, { clearProps: 'height' })
      reduced.removeEventListener('change', onReduced)
      document.removeEventListener('visibilitychange', onVisibility)
      settled()
    }
  }, [active])

  useLayoutEffect(() => {
    const element = content.current
    if (!element) return
    const items = element.querySelectorAll('[data-enquiry-motion]')
    const focus = () => {
      if (!active || document.hidden || (inline && !focusStep.current)) return
      focusStep.current = false
      if (inline && form.current && heading.current) {
        const clearance = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 84
        const bounds = heading.current.getBoundingClientRect()
        if (bounds.top < clearance || bounds.bottom > window.innerHeight) {
          scroll?.cancelScroll()
          window.scrollTo({ top: Math.max(0, window.scrollY + form.current.getBoundingClientRect().top - clearance), behavior: 'instant' })
        }
      }
      const errorKey = focusError.current
      focusError.current = null
      const errorTarget = errorKey ? form.current?.querySelector<HTMLElement>(`[data-error-key="${errorKey}"]`) : null
      ;(errorTarget ?? heading.current)?.focus({ preventScroll: true })
      if (!inline) form.current?.closest('.header-inner')?.scrollTo({ top: 0, behavior: 'instant' })
    }
    const finish = () => {
      if (deadline.current) clearTimeout(deadline.current)
      transition.current?.kill()
      gsap.set(items, { clearProps: 'opacity,transform' })
      busyRef.current = false
      element.inert = false
      setBusy(false)
      if (pendingStep.current !== null) {
        const next = pendingStep.current
        const nextErrors = pendingErrors.current
        pendingStep.current = null
        pendingErrors.current = null
        setErrors(nextErrors ?? {})
        setCopyState('idle')
        setStep(next)
      } else focus()
    }
    settleMotion.current = finish
    if (!active || prefersReducedMotion() || document.hidden) finish()
    else if (focusStep.current) {
      transition.current = gsap.timeline({ onComplete: finish }).fromTo(items,
        { opacity: 0, x: direction.current * (innerWidth < 700 ? 8 : 14) },
        { opacity: 1, x: 0, duration: .36, stagger: .035, ease: 'power3.out' })
      deadline.current = setTimeout(finish, 900)
    } else focus()
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const onReduced = () => { if (reduced.matches) finish() }
    const onVisibility = () => { if (document.hidden) finish() }
    reduced.addEventListener('change', onReduced)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      transition.current?.kill()
      if (deadline.current) clearTimeout(deadline.current)
      gsap.set(items, { clearProps: 'opacity,transform' })
      reduced.removeEventListener('change', onReduced)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active, step, inline, scroll])

  useEffect(() => () => { copyRequest.current += 1 }, [])

  useEffect(() => {
    if (copyState !== 'manual') return
    form.current?.querySelector<HTMLTextAreaElement>('[data-enquiry-copy]')?.focus({ preventScroll: true })
  }, [copyState])

  function updateDraft<K extends keyof EnquiryDraft>(key: K, value: EnquiryDraft[K]) {
    setDraft(previous => ({ ...previous, [key]: value }))
    setErrors(previous => ({ ...previous, [key]: undefined }))
    setCopyState('idle')
  }

  function goTo(next: number, nextErrors?: Errors) {
    if (busyRef.current || !active || next === step) return
    busyRef.current = true
    setBusy(true)
    focusStep.current = true
    direction.current = next < step ? -1 : 1
    pendingStep.current = next
    pendingErrors.current = nextErrors ?? null
    copyRequest.current += 1
    const commit = () => {
      if (pendingStep.current === null) return
      const destination = pendingStep.current
      const destinationErrors = pendingErrors.current
      pendingStep.current = null
      pendingErrors.current = null
      setErrors(destinationErrors ?? {})
      setCopyState('idle')
      setStep(destination)
    }
    if (prefersReducedMotion() || document.hidden) { commit(); return }
    if (content.current) content.current.inert = true
    transition.current?.kill()
    transition.current = gsap.timeline({ onComplete: commit }).to(content.current?.querySelectorAll('[data-enquiry-motion]') ?? [], {
      opacity: 0, x: direction.current * -8, duration: .14, ease: 'power2.in',
    })
    deadline.current = setTimeout(() => settleMotion.current(), 800)
  }

  function focusFirstError(nextErrors: Errors, index = step) {
    const firstError = Object.keys(nextErrors)[0] as keyof EnquiryDraft | undefined
    if (!firstError) return false
    focusError.current = firstError
    const destination = fieldStep[firstError]
    if (destination !== index) goTo(destination, nextErrors)
    else {
      setErrors(nextErrors)
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[data-error-key="${firstError}"]`)?.focus())
    }
    return true
  }

  function validateEverything() {
    const nextErrors = validateDraft(draft)
    return !focusFirstError(nextErrors)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (busyRef.current || !active) return
    const nextErrors = validateStep(step, draft)
    if (focusFirstError(nextErrors)) return
    if (step < stepDefinitions.length - 1) goTo(step + 1)
  }

  async function copyEnquiry() {
    if (busyRef.current || copyState === 'copying' || !validateEverything()) return
    const request = ++copyRequest.current
    setCopyState('copying')
    try {
      await navigator.clipboard.writeText(enquiry.text)
      if (request === copyRequest.current) setCopyState('copied')
    } catch {
      if (request === copyRequest.current) setCopyState('manual')
    }
  }

  function reset() {
    if (busyRef.current) return
    setDraft(createEmptyDraft())
    setErrors({})
    focusError.current = null
    goTo(0)
  }

  function handleServices(values: string[]) {
    const selected = values as Service[]
    const choseUnsure = selected.includes('not-sure') && !draft.services.includes('not-sure')
    updateDraft('services', choseUnsure ? ['not-sure'] : selected.filter(service => service !== 'not-sure'))
  }

  const companySummary = [draft.companyName.trim(), companyTypeLabel(draft), draft.website.trim() || 'Not provided']
  const projectSummary = [draft.services.map(service => optionLabel(serviceOptions, service)).join(', '), draft.brief.trim()]
  const contextSummary = [draft.audience.trim() || 'Target audience not provided', draft.assets.trim() || 'Existing assets not provided']
  const timingSummary = [optionLabel(preferredStartOptions, draft.preferredStart), launchLabel(draft)]
  const roleSummary = draft.role === 'other' ? draft.customRole.trim() : optionLabel(roleOptions, draft.role)

  return (
    <form ref={form} id={id ?? `${idPrefix}-form`} className={styles.form} data-variant={variant} aria-label={inline ? 'Project enquiry' : 'Start a project'} aria-describedby={`${idPrefix}-progress`} noValidate onSubmit={submit} onKeyDown={event => {
      if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault()
    }}>
      <div id={`${idPrefix}-progress`} className={styles.progress} role="progressbar" aria-label="Enquiry progress" aria-valuemin={1} aria-valuemax={stepDefinitions.length} aria-valuenow={step + 1} aria-valuetext={`${stepDefinitions[step].heading}, step ${step + 1} of ${stepDefinitions.length}`}>
        <span style={{ transform: `scaleX(${(step + 1) / stepDefinitions.length})` }} />
      </div>
      <div ref={viewport} className={styles.viewport}>
        <div ref={content} className={styles.content} inert={busy}>
          <section key={step} className={styles.step} aria-labelledby={`${idPrefix}-step-heading`}>
            <div className={styles.intro} data-enquiry-motion="">
              <h2 ref={heading} id={`${idPrefix}-step-heading`} tabIndex={-1}><span className="sr-only">Step {step + 1} of {stepDefinitions.length}. </span>{inline && step === 0 ? introHeading : stepDefinitions[step].heading}</h2>
            </div>

            {step === 0 && (
              <FieldGroup>
                <Field data-enquiry-motion="" data-invalid={!!errors.companyName}>
                  <FieldLabel htmlFor={`${idPrefix}-companyName`}>Company name</FieldLabel>
                  <Input id={`${idPrefix}-companyName`} data-error-key="companyName" name="companyName" autoComplete="organization" maxLength={120} value={draft.companyName} onChange={event => updateDraft('companyName', event.target.value)} placeholder="Your company" required aria-invalid={!!errors.companyName} aria-describedby={errors.companyName ? `${idPrefix}-companyName-error` : undefined} />
                  <FieldError id={`${idPrefix}-companyName-error`}>{errors.companyName}</FieldError>
                </Field>
                <FieldSet data-enquiry-motion="" data-invalid={!!errors.companyType}>
                  <FieldLegend variant="label">Company type</FieldLegend>
                  <FieldDescription>Choose the closest fit.</FieldDescription>
                  <ToggleGroup className={styles.companyChoices} data-error-key="companyType" tabIndex={0} value={draft.companyType ? [draft.companyType] : []} onValueChange={values => updateDraft('companyType', (values[0] ?? '') as CompanyType | '')} aria-label="Company type" aria-invalid={!!errors.companyType} aria-describedby={errors.companyType ? `${idPrefix}-companyType-error` : undefined}>
                    {companyTypes.map(type => <ToggleGroupItem key={type} value={type}>{type}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-companyType-error`}>{errors.companyType}</FieldError>
                </FieldSet>
                {draft.companyType === 'other' && (
                  <Field className={styles.revealField} data-enquiry-motion="" data-invalid={!!errors.customType}>
                    <FieldLabel htmlFor={`${idPrefix}-customType`}>Your company type</FieldLabel>
                    <Input id={`${idPrefix}-customType`} data-error-key="customType" name="companyTypeOther" maxLength={100} value={draft.customType} onChange={event => updateDraft('customType', event.target.value)} placeholder="Tell us what fits better" required aria-invalid={!!errors.customType} aria-describedby={errors.customType ? `${idPrefix}-customType-error` : undefined} />
                    <FieldError id={`${idPrefix}-customType-error`}>{errors.customType}</FieldError>
                  </Field>
                )}
                <Field data-enquiry-motion="" data-invalid={!!errors.website}>
                  <FieldLabel htmlFor={`${idPrefix}-website`}>Website <span className={styles.optional}>optional</span></FieldLabel>
                  <Input id={`${idPrefix}-website`} data-error-key="website" name="website" type="url" inputMode="url" autoComplete="url" maxLength={240} value={draft.website} onChange={event => updateDraft('website', event.target.value)} onBlur={() => {
                    const normalized = normalizeWebsite(draft.website)
                    if (normalized) updateDraft('website', normalized)
                  }} placeholder="example.com" aria-invalid={!!errors.website} aria-describedby={errors.website ? `${idPrefix}-website-error` : undefined} />
                  <FieldError id={`${idPrefix}-website-error`}>{errors.website}</FieldError>
                </Field>
              </FieldGroup>
            )}

            {step === 1 && (
              <FieldGroup>
                <FieldSet data-enquiry-motion="" data-invalid={!!errors.services}>
                  <FieldLegend variant="label">Services needed</FieldLegend>
                  <FieldDescription>Select as many as apply. Not sure yet is fine.</FieldDescription>
                  <ToggleGroup className={styles.companyChoices} data-error-key="services" tabIndex={0} multiple value={draft.services} onValueChange={handleServices} aria-label="Services needed" aria-invalid={!!errors.services} aria-describedby={errors.services ? `${idPrefix}-services-error` : undefined}>
                    {serviceOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-services-error`}>{errors.services}</FieldError>
                </FieldSet>
                <Field data-enquiry-motion="" data-invalid={!!errors.brief}>
                  <FieldLabel htmlFor={`${idPrefix}-brief`}>Project goals</FieldLabel>
                  <FieldDescription>What needs to change, and what would a useful outcome look like?</FieldDescription>
                  <Textarea id={`${idPrefix}-brief`} data-error-key="brief" name="brief" className={styles.brief} placeholder="Share the challenge, opportunity, or result you are working toward" maxLength={1600} rows={4} required value={draft.brief} onChange={event => updateDraft('brief', event.target.value)} aria-invalid={!!errors.brief} aria-describedby={errors.brief ? `${idPrefix}-brief-error` : undefined} />
                  <FieldError id={`${idPrefix}-brief-error`}>{errors.brief}</FieldError>
                </Field>
              </FieldGroup>
            )}

            {step === 2 && (
              <FieldGroup>
                <Field data-enquiry-motion="">
                  <FieldLabel htmlFor={`${idPrefix}-audience`}>Target audience <span className={styles.optional}>optional</span></FieldLabel>
                  <FieldDescription>Who are you trying to reach or serve?</FieldDescription>
                  <Textarea id={`${idPrefix}-audience`} data-error-key="audience" name="audience" className={styles.contextArea} placeholder="Customers, partners, teams, or communities" maxLength={600} rows={3} value={draft.audience} onChange={event => updateDraft('audience', event.target.value)} />
                </Field>
                <Field data-enquiry-motion="">
                  <FieldLabel htmlFor={`${idPrefix}-assets`}>Existing assets and context <span className={styles.optional}>optional</span></FieldLabel>
                  <FieldDescription>Note anything already in place: a website, brand system, content, research, or internal support.</FieldDescription>
                  <Textarea id={`${idPrefix}-assets`} data-error-key="assets" name="assets" className={styles.contextArea} placeholder="What should we know or build from?" maxLength={600} rows={3} value={draft.assets} onChange={event => updateDraft('assets', event.target.value)} />
                </Field>
              </FieldGroup>
            )}

            {step === 3 && (
              <FieldGroup>
                <FieldSet data-enquiry-motion="" data-invalid={!!errors.preferredStart}>
                  <FieldLegend variant="label">Preferred start</FieldLegend>
                  <ToggleGroup className={styles.companyChoices} data-error-key="preferredStart" tabIndex={0} value={draft.preferredStart ? [draft.preferredStart] : []} onValueChange={values => updateDraft('preferredStart', (values[0] ?? '') as PreferredStart | '')} aria-label="Preferred start" aria-invalid={!!errors.preferredStart} aria-describedby={errors.preferredStart ? `${idPrefix}-preferredStart-error` : undefined}>
                    {preferredStartOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-preferredStart-error`}>{errors.preferredStart}</FieldError>
                </FieldSet>
                <FieldSet data-enquiry-motion="" data-invalid={!!errors.launchMode}>
                  <FieldLegend variant="label">Target launch</FieldLegend>
                  <FieldDescription>A flexible answer is completely fine.</FieldDescription>
                  <ToggleGroup className={styles.companyChoices} data-error-key="launchMode" tabIndex={0} value={draft.launchMode ? [draft.launchMode] : []} onValueChange={values => {
                    const mode = (values[0] ?? '') as LaunchMode | ''
                    setDraft(previous => ({ ...previous, launchMode: mode, launchQuarter: mode === 'quarter' ? previous.launchQuarter : '', launchYear: mode === 'quarter' ? previous.launchYear : '', deadline: mode === 'date' ? previous.deadline : '' }))
                    setErrors(previous => ({ ...previous, launchMode: undefined, launchQuarter: undefined, launchYear: undefined, deadline: undefined }))
                  }} aria-label="Target launch format" aria-invalid={!!errors.launchMode} aria-describedby={errors.launchMode ? `${idPrefix}-launchMode-error` : undefined}>
                    {launchOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-launchMode-error`}>{errors.launchMode}</FieldError>
                </FieldSet>
                {draft.launchMode === 'quarter' && (
                  <div className={styles.pairedFields} data-enquiry-motion="">
                    <Field data-invalid={!!errors.launchQuarter}>
                      <FieldLabel htmlFor={`${idPrefix}-launchQuarter`}>Quarter</FieldLabel>
                      <NativeSelect className={styles.nativeSelect} id={`${idPrefix}-launchQuarter`} data-error-key="launchQuarter" name="launchQuarter" value={draft.launchQuarter} onChange={event => updateDraft('launchQuarter', event.target.value)} required aria-invalid={!!errors.launchQuarter} aria-describedby={errors.launchQuarter ? `${idPrefix}-launchQuarter-error` : undefined}>
                        <NativeSelectOption value="">Choose quarter</NativeSelectOption>
                        {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => <NativeSelectOption key={quarter} value={quarter}>{quarter}</NativeSelectOption>)}
                      </NativeSelect>
                      <FieldError id={`${idPrefix}-launchQuarter-error`}>{errors.launchQuarter}</FieldError>
                    </Field>
                    <Field data-invalid={!!errors.launchYear}>
                      <FieldLabel htmlFor={`${idPrefix}-launchYear`}>Year</FieldLabel>
                      <NativeSelect className={styles.nativeSelect} id={`${idPrefix}-launchYear`} data-error-key="launchYear" name="launchYear" value={draft.launchYear} onChange={event => updateDraft('launchYear', event.target.value)} required aria-invalid={!!errors.launchYear} aria-describedby={errors.launchYear ? `${idPrefix}-launchYear-error` : undefined}>
                        <NativeSelectOption value="">Choose year</NativeSelectOption>
                        {years.map(year => <NativeSelectOption key={year} value={year}>{year}</NativeSelectOption>)}
                      </NativeSelect>
                      <FieldError id={`${idPrefix}-launchYear-error`}>{errors.launchYear}</FieldError>
                    </Field>
                  </div>
                )}
                {draft.launchMode === 'date' && (
                  <Field className={styles.revealField} data-enquiry-motion="" data-invalid={!!errors.deadline}>
                    <FieldLabel htmlFor={`${idPrefix}-deadline`}>Target launch date</FieldLabel>
                    <Input id={`${idPrefix}-deadline`} data-error-key="deadline" name="deadline" type="date" min={currentDateValue()} value={draft.deadline} onChange={event => updateDraft('deadline', event.target.value)} required aria-invalid={!!errors.deadline} aria-describedby={errors.deadline ? `${idPrefix}-deadline-error` : undefined} />
                    <FieldError id={`${idPrefix}-deadline-error`}>{errors.deadline}</FieldError>
                  </Field>
                )}
              </FieldGroup>
            )}

            {step === 4 && (
              <FieldGroup>
                <div className={styles.budgetTop} data-enquiry-motion="">
                  <span className={styles.amount}>{draft.budgetUndecided ? '—' : formatBudget(draft.budget, draft.currency, true)}</span>
                  <Field className={styles.currencyField}>
                    <FieldLabel className="sr-only" htmlFor={`${idPrefix}-currency`}>Currency</FieldLabel>
                    <NativeSelect id={`${idPrefix}-currency`} name="currency" value={draft.currency} onChange={event => updateDraft('currency', event.target.value as Currency)}>
                      {currencies.map(code => <NativeSelectOption key={code} value={code}>{code}</NativeSelectOption>)}
                    </NativeSelect>
                  </Field>
                </div>
                <Field data-enquiry-motion="">
                  <FieldLabel className="sr-only">Budget range</FieldLabel>
                  <div className={styles.budgetControl} data-undecided={draft.budgetUndecided}>
                    <Slider value={[draft.budget]} min={0} max={budgetBands.length - 1} step={1} className={styles.budgetSlider} onValueChange={values => {
                      const budget = Array.isArray(values) ? values[0] : values
                      setDraft(previous => ({ ...previous, budget, budgetUndecided: false }))
                    }} thumbProps={{ 'aria-label': 'Budget', getAriaValueText: () => draft.budgetUndecided ? 'Not sure yet; adjust to choose a budget' : budgetLabel(draft) }} />
                  </div>
                  <button type="button" className={styles.unsure} aria-pressed={draft.budgetUndecided} onClick={() => updateDraft('budgetUndecided', !draft.budgetUndecided)}>not sure yet</button>
                </Field>
              </FieldGroup>
            )}

            {step === 5 && (
              <FieldGroup>
                <div className={styles.contactFields}>
                  {([
                    { key: 'name', label: 'Name', type: 'text', autocomplete: 'name', placeholder: 'Your name', max: 100 },
                    { key: 'email', label: 'Email', type: 'email', autocomplete: 'email', placeholder: 'you@company.com', max: 254 },
                    { key: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', placeholder: '+1 512 555 0123', max: 40 },
                  ] as const).map(({ key, label, type, autocomplete, placeholder, max }) => (
                    <Field key={key} data-enquiry-motion="" data-invalid={!!errors[key]}>
                      <FieldLabel htmlFor={`${idPrefix}-${key}`}>{label}</FieldLabel>
                      <Input id={`${idPrefix}-${key}`} data-error-key={key} name={key} type={type} autoComplete={autocomplete} placeholder={placeholder} maxLength={max} required value={draft[key]} onChange={event => updateDraft(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${idPrefix}-${key}-error` : undefined} />
                      <FieldError id={`${idPrefix}-${key}-error`}>{errors[key]}</FieldError>
                    </Field>
                  ))}
                </div>
                <FieldSet data-enquiry-motion="" data-invalid={!!errors.role}>
                  <FieldLegend variant="label">Your role in the decision</FieldLegend>
                  <ToggleGroup className={styles.companyChoices} data-error-key="role" tabIndex={0} value={draft.role ? [draft.role] : []} onValueChange={values => updateDraft('role', (values[0] ?? '') as DecisionRole | '')} aria-label="Your role in the decision" aria-invalid={!!errors.role} aria-describedby={errors.role ? `${idPrefix}-role-error` : undefined}>
                    {roleOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-role-error`}>{errors.role}</FieldError>
                </FieldSet>
                {draft.role === 'other' && (
                  <Field className={styles.revealField} data-enquiry-motion="" data-invalid={!!errors.customRole}>
                    <FieldLabel htmlFor={`${idPrefix}-customRole`}>How are you involved?</FieldLabel>
                    <Input id={`${idPrefix}-customRole`} data-error-key="customRole" name="customRole" maxLength={100} value={draft.customRole} onChange={event => updateDraft('customRole', event.target.value)} placeholder="Your role" required aria-invalid={!!errors.customRole} aria-describedby={errors.customRole ? `${idPrefix}-customRole-error` : undefined} />
                    <FieldError id={`${idPrefix}-customRole-error`}>{errors.customRole}</FieldError>
                  </Field>
                )}
              </FieldGroup>
            )}

            {step === 6 && (
              <>
                <dl className={styles.review} data-enquiry-motion="">
                  <ReviewRow label="company" lines={companySummary} editLabel="Edit company details" onEdit={() => goTo(0)} />
                  <ReviewRow label="project" lines={projectSummary} editLabel="Edit project details" onEdit={() => goTo(1)} />
                  <ReviewRow label="context" lines={contextSummary} editLabel="Edit project context" onEdit={() => goTo(2)} />
                  <ReviewRow label="timing" lines={timingSummary} editLabel="Edit project timing" onEdit={() => goTo(3)} />
                  <ReviewRow label="budget" lines={[budgetLabel(draft)]} editLabel="Edit budget" onEdit={() => goTo(4)} />
                  <ReviewRow label="contact" lines={[draft.name.trim(), draft.email.trim(), draft.phone.trim(), roleSummary]} editLabel="Edit your details" onEdit={() => goTo(5)} />
                </dl>
                <div className={styles.handoff} data-enquiry-motion="">
                  {inline ? <p id={`${idPrefix}-delivery`}>email delivery isn&apos;t connected yet</p> : <a href={`mailto:${recipient}`}>{recipient}</a>}
                  <button type="button" onClick={copyEnquiry} disabled={copyState === 'copying'} aria-label={copyState === 'copied' ? 'Enquiry copied' : 'Copy enquiry'}>{copyState === 'copied' ? 'copied' : inline ? 'copy enquiry' : 'copy'}</button>
                </div>
                <p className={styles.copyStatus} role="status">{copyState === 'copied' ? 'Enquiry copied.' : copyState === 'manual' ? 'Select the text below to copy.' : ''}</p>
                {copyState === 'manual' && <Field><FieldLabel className="sr-only" htmlFor={`${idPrefix}-copy`}>Enquiry</FieldLabel><Textarea id={`${idPrefix}-copy`} data-enquiry-copy="" className={styles.copyText} readOnly value={enquiry.text} rows={8} onFocus={event => event.target.select()} /></Field>}
              </>
            )}
          </section>
          <footer className={styles.footer} data-enquiry-motion="">
            <div className={styles.actions}>
              {(!inline || step > 0) && <button type="button" className={styles.back} onClick={() => step === 0 ? onMenu?.() : goTo(step - 1)}><CircularArrowIcon direction="left" />{step === 0 ? 'menu' : 'back'}</button>}
              {step < stepDefinitions.length - 1 ? (
                <button type="submit" className={styles.continue}>{step === stepDefinitions.length - 2 ? 'review' : 'continue'}<CircularArrowIcon /></button>
              ) : inline ? (
                <button type="button" className={styles.continue} disabled aria-describedby={`${idPrefix}-delivery`}>send enquiry<CircularArrowIcon /></button>
              ) : mailtoFits ? (
                <a className={styles.continue} href={enquiry.mailto} onClick={event => { if (!validateEverything()) event.preventDefault() }}>open email draft<CircularArrowIcon /></a>
              ) : (
                <button type="button" className={styles.continue} onClick={copyEnquiry}>copy for email<CircularArrowIcon /></button>
              )}
            </div>
            {step === stepDefinitions.length - 1 && (
              <div className={styles.footerNote}>
                <button type="button" onClick={reset}>start over</button>
                {!inline && <p>{mailtoFits ? 'opens your email app' : `copy, then paste into a new email to ${recipient}`}</p>}
              </div>
            )}
          </footer>
        </div>
      </div>
    </form>
  )
}
