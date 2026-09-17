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
import {
  serviceOptions, timingOptions, currencies, budgetBands, recipient, mailtoLengthLimit,
  createEmptyDraft, currentDateValue, formatBudget, optionLabel, normalizeWebsite,
  budgetLabel, timingLabel, validateStep, validateDraft, fieldStep, buildEnquiry,
  type Currency, type Service, type Timing, type EnquiryDraft, type Errors,
} from '@/lib/enquiry'

const stepDefinitions = [
  { id: 'company', heading: 'A few details' },
  { id: 'project', heading: 'What are we making?' },
  { id: 'timing', heading: 'When?' },
  { id: 'budget', heading: 'Budget' },
  { id: 'review', heading: 'Looks good?' },
] as const

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
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const sendRequest = useRef(0)
  const honeypot = useRef<HTMLInputElement>(null)
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

  useEffect(() => () => { copyRequest.current += 1; sendRequest.current += 1 }, [])

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

  /*
    The enquiry is posted rather than handed to a mail client. A failure
    here is not a dead end: `failed` puts the old mailto (or the copy
    fallback for an over-long enquiry) back in front of the visitor.
  */
  async function sendEnquiry() {
    if (busyRef.current || sendState === 'sending' || !validateEverything()) return
    const request = ++sendRequest.current
    setSendState('sending')
    setCopyState('idle')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, company: honeypot.current?.value ?? '' }),
      })
      if (request !== sendRequest.current) return
      setSendState(response.ok ? 'sent' : 'failed')
      if (response.ok) window.dispatchEvent(new Event('burgama:submission-success'))
    } catch {
      if (request === sendRequest.current) setSendState('failed')
    }
  }

  function reset() {
    if (busyRef.current) return
    setDraft(createEmptyDraft())
    setErrors({})
    sendRequest.current += 1
    setSendState('idle')
    focusError.current = null
    goTo(0)
  }

  function handleServices(values: string[]) {
    updateDraft('services', values as Service[])
  }

  const companySummary = [draft.companyName.trim(), draft.website.trim()]
  const contactSummary = [draft.name.trim(), draft.email.trim()]
  const projectSummary = [draft.services.map(service => optionLabel(serviceOptions, service)).join(', '), draft.brief.trim()]
  const timingSummary = [timingLabel(draft)]

  return (
    <form ref={form} id={id ?? `${idPrefix}-form`} className={styles.form} data-variant={variant} aria-label={inline ? 'Start a project with Burgama' : 'Start a project'} aria-describedby={`${idPrefix}-progress`} noValidate onSubmit={submit} onKeyDown={event => {
      if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault()
    }}>
      {/* Hidden from people and from assistive technology; only a bot fills it. */}
      <div className={styles.honeypot} aria-hidden="true">
        <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
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
              <FieldGroup className={styles.contactFields}>
                  <Field data-enquiry-motion="" data-invalid={!!errors.name}>
                    <FieldLabel htmlFor={`${idPrefix}-name`}>Name</FieldLabel>
                    <Input id={`${idPrefix}-name`} data-error-key="name" name="name" autoComplete="name" maxLength={100} value={draft.name} onChange={event => updateDraft('name', event.target.value)} required aria-invalid={!!errors.name} aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined} />
                    <FieldError id={`${idPrefix}-name-error`}>{errors.name}</FieldError>
                  </Field>
                  <Field data-enquiry-motion="" data-invalid={!!errors.email}>
                    <FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
                    <Input id={`${idPrefix}-email`} data-error-key="email" name="email" type="email" autoComplete="email" maxLength={254} value={draft.email} onChange={event => updateDraft('email', event.target.value)} placeholder="you@company.com" required aria-invalid={!!errors.email} aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined} />
                    <FieldError id={`${idPrefix}-email-error`}>{errors.email}</FieldError>
                  </Field>
                  <Field data-enquiry-motion="" data-invalid={!!errors.companyName}>
                    <FieldLabel htmlFor={`${idPrefix}-companyName`}>Company</FieldLabel>
                    <Input id={`${idPrefix}-companyName`} data-error-key="companyName" name="companyName" autoComplete="organization" maxLength={120} value={draft.companyName} onChange={event => updateDraft('companyName', event.target.value)} required aria-invalid={!!errors.companyName} aria-describedby={errors.companyName ? `${idPrefix}-companyName-error` : undefined} />
                    <FieldError id={`${idPrefix}-companyName-error`}>{errors.companyName}</FieldError>
                  </Field>
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
                  <FieldLegend variant="label">Area</FieldLegend>
                  <ToggleGroup className={styles.companyChoices} data-error-key="services" tabIndex={0} multiple value={draft.services} onValueChange={handleServices} aria-label="Services needed" aria-invalid={!!errors.services} aria-describedby={errors.services ? `${idPrefix}-services-error` : undefined}>
                    {serviceOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-services-error`}>{errors.services}</FieldError>
                </FieldSet>
                <Field data-enquiry-motion="" data-invalid={!!errors.brief}>
                  <FieldLabel htmlFor={`${idPrefix}-brief`}>In a few sentences</FieldLabel>
                  <Textarea id={`${idPrefix}-brief`} data-error-key="brief" name="brief" className={styles.brief} placeholder="What needs to change? What would a good outcome look like?" maxLength={1600} rows={4} required value={draft.brief} onChange={event => updateDraft('brief', event.target.value)} aria-invalid={!!errors.brief} aria-describedby={errors.brief ? `${idPrefix}-brief-error` : undefined} />
                  <FieldError id={`${idPrefix}-brief-error`}>{errors.brief}</FieldError>
                </Field>
              </FieldGroup>
            )}

            {step === 2 && (
              <FieldGroup>
                <FieldSet data-enquiry-motion="" data-invalid={!!errors.timing}>
                  <FieldLegend variant="label">Timing</FieldLegend>
                  <ToggleGroup className={styles.companyChoices} data-error-key="timing" tabIndex={0} value={draft.timing ? [draft.timing] : []} onValueChange={values => {
                    const timing = (values[0] ?? '') as Timing | ''
                    setDraft(previous => ({ ...previous, timing, deadline: timing === 'date' ? previous.deadline : '' }))
                    setErrors(previous => ({ ...previous, timing: undefined, deadline: undefined }))
                  }} aria-label="Project timing" aria-invalid={!!errors.timing} aria-describedby={errors.timing ? `${idPrefix}-timing-error` : undefined}>
                    {timingOptions.map(([value, label]) => <ToggleGroupItem key={value} value={value}>{label}</ToggleGroupItem>)}
                  </ToggleGroup>
                  <FieldError id={`${idPrefix}-timing-error`}>{errors.timing}</FieldError>
                </FieldSet>
                {draft.timing === 'date' && (
                  <Field className={styles.revealField} data-enquiry-motion="" data-invalid={!!errors.deadline}>
                    <FieldLabel htmlFor={`${idPrefix}-deadline`}>Target date</FieldLabel>
                    <Input id={`${idPrefix}-deadline`} data-error-key="deadline" name="deadline" type="date" min={currentDateValue()} value={draft.deadline} onChange={event => updateDraft('deadline', event.target.value)} required aria-invalid={!!errors.deadline} aria-describedby={errors.deadline ? `${idPrefix}-deadline-error` : undefined} />
                    <FieldError id={`${idPrefix}-deadline-error`}>{errors.deadline}</FieldError>
                  </Field>
                )}
              </FieldGroup>
            )}

            {step === 3 && (
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

            {step === 4 && (
              <>
                <dl className={styles.review} data-enquiry-motion="">
                  <ReviewRow label="company" lines={companySummary} editLabel="Edit company details" onEdit={() => goTo(0)} />
                  <ReviewRow label="contact" lines={contactSummary} editLabel="Edit contact details" onEdit={() => goTo(0)} />
                  <ReviewRow label="project" lines={projectSummary} editLabel="Edit project details" onEdit={() => goTo(1)} />
                  <ReviewRow label="timing" lines={timingSummary} editLabel="Edit project timing" onEdit={() => goTo(2)} />
                  <ReviewRow label="budget" lines={[budgetLabel(draft)]} editLabel="Edit budget" onEdit={() => goTo(3)} />
                </dl>
                <p className={styles.copyStatus} role="status">{
                  sendState === 'sent' ? `Sent. We’ll reply to ${draft.email.trim()}.`
                  : sendState === 'failed' ? 'That did not send.'
                  : copyState === 'copied' ? `Copied. Paste it into an email to ${recipient}.`
                  : copyState === 'manual' ? 'Select the text below to copy.'
                  : ''
                }</p>
                {sendState === 'failed' && (
                  <p className={styles.fallbackNote}>
                    {mailtoFits
                      ? <a href={enquiry.mailto}>Open an email draft instead</a>
                      : <button type="button" onClick={copyEnquiry}>Copy the enquiry</button>}
                    {' '}or write to <a href={`mailto:${recipient}`}>{recipient}</a>.
                  </p>
                )}
                {copyState === 'manual' && <Field><FieldLabel className="sr-only" htmlFor={`${idPrefix}-copy`}>Enquiry</FieldLabel><Textarea id={`${idPrefix}-copy`} data-enquiry-copy="" className={styles.copyText} readOnly value={enquiry.text} rows={8} onFocus={event => event.target.select()} /></Field>}
              </>
            )}
          </section>
          <footer className={styles.footer} data-enquiry-motion="">
            <div className={styles.actions}>
              {(!inline || step > 0) && <button type="button" className={styles.back} onClick={() => step === 0 ? onMenu?.() : goTo(step - 1)}><CircularArrowIcon direction="left" />{step === 0 ? 'menu' : 'back'}</button>}
              {step < stepDefinitions.length - 1 ? (
                <button type="submit" className={styles.continue}>{step === stepDefinitions.length - 2 ? 'review' : 'continue'}<CircularArrowIcon /></button>
              ) : sendState === 'sent' ? null : (
                <button type="button" className={styles.continue} disabled={sendState === 'sending'} onClick={sendEnquiry}>
                  {sendState === 'sending' ? 'sending' : sendState === 'failed' ? 'try again' : 'send enquiry'}<CircularArrowIcon />
                </button>
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
