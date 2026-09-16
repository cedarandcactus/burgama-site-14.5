'use client'

import { useEffect, useLayoutEffect, useId, useRef, useState, type FormEvent } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSmoothScroll } from '@/components/smooth-scroll'
import styles from './nav-project-form.module.css'

const serviceOptions = [
  ['strategy-design', 'strategy / design'],
  ['website-growth', 'website / growth'],
] as const
const preferredStartOptions = [
  ['soon', 'as soon as practical'],
  ['flexible', 'flexible / not sure'],
] as const
const launchOptions = [
  ['flexible', 'flexible / not sure'],
  ['date', 'I have a date'],
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
type PreferredStart = typeof preferredStartOptions[number][0]
type LaunchMode = typeof launchOptions[number][0]
type EnquiryDraft = {
  companyName: string
  website: string
  services: Service[]
  brief: string
  audience: string
  assets: string
  preferredStart: PreferredStart | ''
  launchMode: LaunchMode | ''
  deadline: string
  budget: number
  budgetUndecided: boolean
  currency: Currency
  name: string
  email: string
}
type Errors = Partial<Record<keyof EnquiryDraft, string>>

const fieldStep: Record<keyof EnquiryDraft, number> = {
  companyName: 0,
  website: 0,
  services: 1,
  brief: 1,
  audience: 2,
  assets: 2,
  preferredStart: 3,
  launchMode: 3,
  deadline: 3,
  budget: 4,
  budgetUndecided: 4,
  currency: 4,
  name: 5,
  email: 5,
}

function createEmptyDraft(): EnquiryDraft {
  return {
    companyName: '', website: '', services: [], brief: '', audience: '', assets: '',
    preferredStart: '', launchMode: '', deadline: '', budget: 2,
    budgetUndecided: false, currency: 'USD', name: '', email: '',
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

function budgetLabel(draft: EnquiryDraft) {
  return draft.budgetUndecided ? `not sure yet (${draft.currency})` : `${formatBudget(draft.budget, draft.currency)} ${draft.currency}`
}

function launchLabel(draft: EnquiryDraft) {
  if (draft.launchMode === 'date') {
    const date = new Date(`${draft.deadline}T12:00:00`)
    return Number.isNaN(date.getTime()) ? draft.deadline : new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date)
  }
  return optionLabel(launchOptions, draft.launchMode)
}

function validateStep(index: number, draft: EnquiryDraft): Errors {
  const errors: Errors = {}
  if (index === 0) {
    if (!draft.companyName.trim()) errors.companyName = 'Enter your company name.'
    if (draft.website && !normalizeWebsite(draft.website)) errors.website = 'Enter a valid website, such as example.com.'
  }
  if (index === 1) {
    if (!draft.services.length) errors.services = 'Choose at least one area.'
    if (!draft.brief.trim()) errors.brief = 'Tell us what you want to accomplish.'
  }
  if (index === 3) {
    if (!draft.preferredStart) errors.preferredStart = 'Choose a start window.'
    if (!draft.launchMode) errors.launchMode = 'Choose a launch option.'
    if (draft.launchMode === 'date') {
      if (!draft.deadline) errors.deadline = 'Choose a target launch date.'
      else if (draft.deadline < currentDateValue()) errors.deadline = 'Choose today or a future date.'
    }
  }
  if (index === 5) {
    if (!draft.name.trim()) errors.name = 'Enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.'
  }
  return errors
}

function validateDraft(draft: EnquiryDraft) {
  return [0, 1, 3, 5].reduce<Errors>((all, index) => ({ ...all, ...validateStep(index, draft) }), {})
}

function buildEnquiry(draft: EnquiryDraft) {
  const serviceLabels = draft.services.map(service => optionLabel(serviceOptions, service)).join(', ')
  const body = [
    'Hello Burgama,', '',
    `Company: ${draft.companyName.trim()}`,
    ...(draft.website.trim() ? [`Website: ${draft.website.trim()}`] : []), '',
    `Project: ${serviceLabels}`,
    draft.brief.trim(),
    ...(draft.audience.trim() ? ['', `Audience: ${draft.audience.trim()}`] : []),
    ...(draft.assets.trim() ? [`Existing work: ${draft.assets.trim()}`] : []), '',
    `Start: ${optionLabel(preferredStartOptions, draft.preferredStart)}`,
    `Launch: ${launchLabel(draft)}`,
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

function ReviewRow({ label, lines, editLabel, onEdit }: { label: string; lines: string[]; editLabel: string; onEdit: () => void }) {
  const visibleLines = lines.filter(Boolean)
  if (!visibleLines.length) return null
  return (
    <div>
      <dt>{label}</dt>
      <dd>{visibleLines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</dd>
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
    updateDraft('services', values as Service[])
  }

  const companySummary = [draft.companyName.trim(), draft.website.trim()]
  const projectSummary = [draft.services.map(service => optionLabel(serviceOptions, service)).join(', '), draft.brief.trim()]
  const contextSummary = [draft.audience.trim(), draft.assets.trim()]
  const timingSummary = [optionLabel(preferredStartOptions, draft.preferredStart), launchLabel(draft)]

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
                <Field data-enquiry-motion="" data-invalid={!!errors.website}>
                  <FieldLabel htmlFor={`${idPrefix}-website`}>Website</FieldLabel>
                  <Input id={`${idPrefix}-website`} data-error-key="website" name="website" type="url" inputMode="url" autoComplete="url" maxLength={240} value={draft.website} onChange={event => updateDraft('website', event.target.value)} onBlur={() => {
                    const normalized = normalizeWebsite(draft.website)
                    if (normalized) updateDraft('website', normalized)
                  }} placeholder="example.com, if you have one" aria-invalid={!!errors.website} aria-describedby={errors.website ? `${idPrefix}-website-error` : undefined} />
                  <FieldError id={`${idPrefix}-website-error`}>{errors.website}</FieldError>
                </Field>
              </FieldGroup>
            )}

            {step === 1 && (
              <FieldGroup>
                <FieldSet data-enquiry-motion="" data-invalid={!!errors.services}>
                  <FieldLegend variant="label">Services needed</FieldLegend>
                  <ToggleGroup className={styles.companyChoices} data-error-key="services" tabIndex={0} multiple value={draft.services} onValueChange={handleServices} aria-label="Services needed" aria-invalid={!!errors.services} aria-describedby={errors.services ? `${idPrefix}-services-error` : undefined}>
                    {serviceOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-services-error`}>{errors.services}</FieldError>
                </FieldSet>
                <Field data-enquiry-motion="" data-invalid={!!errors.brief}>
                  <FieldLabel htmlFor={`${idPrefix}-brief`}>Project goals</FieldLabel>
                  <Textarea id={`${idPrefix}-brief`} data-error-key="brief" name="brief" className={styles.brief} placeholder="What needs to change, and what would a good outcome look like?" maxLength={1600} rows={4} required value={draft.brief} onChange={event => updateDraft('brief', event.target.value)} aria-invalid={!!errors.brief} aria-describedby={errors.brief ? `${idPrefix}-brief-error` : undefined} />
                  <FieldError id={`${idPrefix}-brief-error`}>{errors.brief}</FieldError>
                </Field>
              </FieldGroup>
            )}

            {step === 2 && (
              <FieldGroup>
                <Field data-enquiry-motion="">
                  <FieldLabel htmlFor={`${idPrefix}-audience`}>Target audience</FieldLabel>
                  <Textarea id={`${idPrefix}-audience`} data-error-key="audience" name="audience" className={styles.contextArea} placeholder="Who are you trying to reach? Leave blank if unsure." maxLength={600} rows={3} value={draft.audience} onChange={event => updateDraft('audience', event.target.value)} />
                </Field>
                <Field data-enquiry-motion="">
                  <FieldLabel htmlFor={`${idPrefix}-assets`}>Existing work</FieldLabel>
                  <Textarea id={`${idPrefix}-assets`} data-error-key="assets" name="assets" className={styles.contextArea} placeholder="Website, brand, content, or research. Leave blank if none." maxLength={600} rows={3} value={draft.assets} onChange={event => updateDraft('assets', event.target.value)} />
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
                  <ToggleGroup className={styles.companyChoices} data-error-key="launchMode" tabIndex={0} value={draft.launchMode ? [draft.launchMode] : []} onValueChange={values => {
                    const mode = (values[0] ?? '') as LaunchMode | ''
                    setDraft(previous => ({ ...previous, launchMode: mode, deadline: mode === 'date' ? previous.deadline : '' }))
                    setErrors(previous => ({ ...previous, launchMode: undefined, deadline: undefined }))
                  }} aria-label="Target launch format" aria-invalid={!!errors.launchMode} aria-describedby={errors.launchMode ? `${idPrefix}-launchMode-error` : undefined}>
                    {launchOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-launchMode-error`}>{errors.launchMode}</FieldError>
                </FieldSet>
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
                  ] as const).map(({ key, label, type, autocomplete, placeholder, max }) => (
                    <Field key={key} data-enquiry-motion="" data-invalid={!!errors[key]}>
                      <FieldLabel htmlFor={`${idPrefix}-${key}`}>{label}</FieldLabel>
                      <Input id={`${idPrefix}-${key}`} data-error-key={key} name={key} type={type} autoComplete={autocomplete} placeholder={placeholder} maxLength={max} required value={draft[key]} onChange={event => updateDraft(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${idPrefix}-${key}-error` : undefined} />
                      <FieldError id={`${idPrefix}-${key}-error`}>{errors[key]}</FieldError>
                    </Field>
                  ))}
                </div>
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
                  <ReviewRow label="contact" lines={[draft.name.trim(), draft.email.trim()]} editLabel="Edit your details" onEdit={() => goTo(5)} />
                </dl>
                <p className={styles.copyStatus} role="status">{copyState === 'copied' ? `Copied. Paste it into an email to ${recipient}.` : copyState === 'manual' ? 'Select the text below to copy.' : ''}</p>
                {copyState === 'manual' && <Field><FieldLabel className="sr-only" htmlFor={`${idPrefix}-copy`}>Enquiry</FieldLabel><Textarea id={`${idPrefix}-copy`} data-enquiry-copy="" className={styles.copyText} readOnly value={enquiry.text} rows={8} onFocus={event => event.target.select()} /></Field>}
              </>
            )}
          </section>
          <footer className={styles.footer} data-enquiry-motion="">
            <div className={styles.actions}>
              {(!inline || step > 0) && <button type="button" className={styles.back} onClick={() => step === 0 ? onMenu?.() : goTo(step - 1)}><CircularArrowIcon direction="left" />{step === 0 ? 'menu' : 'back'}</button>}
              {step < stepDefinitions.length - 1 ? (
                <button type="submit" className={styles.continue}>{step === stepDefinitions.length - 2 ? 'review' : 'continue'}<CircularArrowIcon /></button>
              ) : mailtoFits ? (
                <a className={styles.continue} href={enquiry.mailto} onClick={event => { if (!validateEverything()) event.preventDefault() }}>open email draft<CircularArrowIcon /></a>
              ) : (
                <button type="button" className={styles.continue} onClick={copyEnquiry}>copy for email<CircularArrowIcon /></button>
              )}
            </div>
            {step === stepDefinitions.length - 1 && (
              <div className={styles.footerNote}>
                <button type="button" onClick={reset}>start over</button>
              </div>
            )}
          </footer>
        </div>
      </div>
    </form>
  )
}
