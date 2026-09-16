'use client'

import { useEffect, useLayoutEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, Plus } from 'lucide-react'
import { gsap, prefersReducedMotion } from '@/lib/motion'
import { CircularArrowIcon } from '@/components/circular-arrow-icon'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useSmoothScroll } from '@/components/smooth-scroll'
import styles from './nav-project-form.module.css'

const companyTypes = ['startup', 'small business', 'established company', 'agency', 'nonprofit', 'other']
const currencies = ['USD', 'GBP', 'EUR', 'CAD', 'AUD'] as const
const budgetBands = [[0, 5000], [5000, 10000], [10000, 25000], [25000, 50000], [50000, 100000], [100000, null]] as const
const steps = ['company', 'budget', 'you', 'review']
const headings = ['company type', 'budget', 'your details', 'review']
const recipient = 'hello@burgama.com'
type Currency = typeof currencies[number]
type Contact = { name: string; email: string; phone: string }
type Errors = Partial<Record<keyof Contact | 'company' | 'customType' | 'brief', string>>
const emptyContact: Contact = { name: '', email: '', phone: '' }

function formatBudget(index: number, currency: Currency, compact = false) {
  const [min, max] = budgetBands[index]
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0, ...(compact ? { notation: 'compact' as const } : {}) })
  if (!min) return `under ${formatter.format(max!)}`
  if (max === null) return `${formatter.format(min)}+`
  return `${formatter.format(min)}–${formatter.format(max)}`
}

function validateContact(contact: Contact): Errors {
  const errors: Errors = {}
  if (!contact.name.trim()) errors.name = 'Tell us your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) errors.email = 'Enter a valid email address.'
  const digits = contact.phone.replace(/\D/g, '')
  if (!/^[+\d\s().-]+$/.test(contact.phone.trim()) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a phone number, including your country code.'
  return errors
}

function ContactFields({ idPrefix, contact, errors, onChange }: { idPrefix: string; contact: Contact; errors: Errors; onChange: (key: keyof Contact, value: string) => void }) {
  return (
    <FieldGroup className={styles.contactFields}>
      {([
        { key: 'name', label: 'your name', type: 'text', autocomplete: 'name', placeholder: 'Alex Morgan', max: 100 },
        { key: 'email', label: 'email address', type: 'email', autocomplete: 'email', placeholder: 'alex@company.com', max: 254 },
        { key: 'phone', label: 'phone number', type: 'tel', autocomplete: 'tel', placeholder: '+1 555 123 4567', max: 40 },
      ] as const).map(({ key, label, type, autocomplete, placeholder, max }) => (
        <Field key={key} data-enquiry-motion="" data-invalid={!!errors[key]} data-filled={!!contact[key]}>
          <FieldLabel htmlFor={`${idPrefix}-${key}`}>{label}</FieldLabel>
          <Input id={`${idPrefix}-${key}`} name={key} type={type} autoComplete={autocomplete} placeholder={placeholder} maxLength={max} required value={contact[key]} onChange={(event) => onChange(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${idPrefix}-${key}-error` : undefined} />
          <FieldError id={`${idPrefix}-${key}-error`}>{errors[key]}</FieldError>
        </Field>
      ))}
    </FieldGroup>
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

export function ProjectEnquiryForm({ variant = 'navbar', introHeading = 'tell us a bit about your project', active = true, id, onMenu, onHeightChange }: ProjectEnquiryProps) {
  const idPrefix = `enquiry-${useId()}`
  const scroll = useSmoothScroll()
  const inline = variant === 'inline'
  const focusStep = useRef(false)
  const [brief, setBrief] = useState('')
  const [step, setStep] = useState(0)
  const direction = useRef(1)
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const pendingStep = useRef<number | null>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const transition = useRef<gsap.core.Timeline | null>(null)
  const deadline = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyRequest = useRef(0)
  const settleMotion = useRef<() => void>(() => {})
  const [company, setCompany] = useState('')
  const [customType, setCustomType] = useState('')
  const [budget, setBudget] = useState(2)
  const [undecided, setUndecided] = useState(false)
  const [currency, setCurrency] = useState<Currency>('USD')
  const [contact, setContact] = useState<Contact>(emptyContact)
  const [errors, setErrors] = useState<Errors>({})
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'manual'>('idle')
  const form = useRef<HTMLFormElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const heightCallback = useRef(onHeightChange)
  heightCallback.current = onHeightChange

  useLayoutEffect(() => {
    const element = content.current
    const frame = viewport.current
    const root = form.current
    if (!element || !frame || !root) return
    let previousHeight = element.getBoundingClientRect().height
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
      heightCallback.current?.(height + chrome)
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
    const observer = new ResizeObserver(measure)
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
      heading.current?.focus({ preventScroll: true })
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
        pendingStep.current = null
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

  const companyLabel = company === 'other' ? `other — ${customType.trim()}` : company
  const budgetLabel = undecided ? `not sure yet (${currency})` : `${formatBudget(budget, currency)} ${currency}`
  const subject = 'Let’s start a project — Burgama'
  const body = [
    'Hello Burgama,', '', 'I’d love to talk about a project.', '',
    `Company type: ${companyLabel}`,
    ...(inline ? [`Project: ${brief.trim()}`, ''] : []),
    `Budget: ${budgetLabel}`, `Currency: ${currency}`, '',
    `Name: ${contact.name.trim()}`, `Email: ${contact.email.trim()}`, `Phone: ${contact.phone.trim()}`, '',
    'Let’s make something good.',
  ].join('\n')
  const enquiryText = `To: ${recipient}\nSubject: ${subject}\n\n${body}`
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  function goTo(next: number) {
    if (busyRef.current || !active || next === step) return
    busyRef.current = true
    setBusy(true)
    focusStep.current = true
    direction.current = next < step ? -1 : 1
    pendingStep.current = next
    copyRequest.current += 1
    const commit = () => {
      if (pendingStep.current === null) return
      pendingStep.current = null
      setErrors({})
      setCopyState('idle')
      setStep(next)
    }
    if (prefersReducedMotion() || document.hidden) { commit(); return }
    if (content.current) content.current.inert = true
    transition.current?.kill()
    transition.current = gsap.timeline({ onComplete: commit }).to(content.current?.querySelectorAll('[data-enquiry-motion]') ?? [], {
      opacity: 0, x: direction.current * -8, duration: .14, ease: 'power2.in',
    })
    deadline.current = setTimeout(() => settleMotion.current(), 800)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (busyRef.current || !active) return
    const nextErrors: Errors = step === 0
      ? !company ? { company: 'Choose the type that fits best.' } : company === 'other' && !customType.trim() ? { customType: 'Tell us a little about your company type.' } : {}
      : step === 2 ? validateContact(contact) : {}
    if (step === 0 && inline && !brief.trim()) nextErrors.brief = 'Tell us about your project.'
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      requestAnimationFrame(() => {
        const target = firstError === 'company' ? form.current?.querySelector<HTMLElement>('[data-slot="toggle-group-item"]') : document.getElementById(`${idPrefix}-${firstError}`)
        target?.focus()
      })
      return
    }
    if (step < 3) goTo(step + 1)
  }

  async function copyEnquiry() {
    if (busyRef.current || copyState === 'copying') return
    const request = ++copyRequest.current
    setCopyState('copying')
    try {
      await navigator.clipboard.writeText(enquiryText)
      if (request === copyRequest.current) setCopyState('copied')
    } catch {
      if (request === copyRequest.current) setCopyState('manual')
    }
  }

  function reset() {
    if (busyRef.current) return
    setBrief('')
    setCompany('')
    setCustomType('')
    setBudget(2)
    setUndecided(false)
    setCurrency('USD')
    setContact(emptyContact)
    goTo(0)
  }

  return (
    <form ref={form} id={id ?? `${idPrefix}-form`} className={styles.form} data-variant={variant} aria-label={inline ? 'Project enquiry' : 'Start a project'} aria-describedby={`${idPrefix}-progress`} noValidate onSubmit={submit} onKeyDown={(event) => {
      if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault()
    }}>
      <div className={styles.progressHeader}>
        <div className={styles.progressCaption}><span>start a project</span><span id={`${idPrefix}-progress`}>step {step + 1} of 4</span></div>
        <ol className={styles.stages} aria-label="Enquiry stages">
          {steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined} data-complete={index < step}><span className={styles.stageMarker} aria-hidden="true">{index < step ? <Check /> : index + 1}</span>{label}</li>)}
        </ol>
        <div className={styles.progress} aria-hidden="true"><span style={{ transform: `scaleX(${(step + 1) / steps.length})` }} /></div>
      </div>
      <div ref={viewport} className={styles.viewport}>
      <div ref={content} className={styles.content} inert={busy}>
      <section key={step} className={styles.step} aria-labelledby={`${idPrefix}-step-heading`}>
        <div className={styles.intro} data-enquiry-motion="">
          <h2 ref={heading} id={`${idPrefix}-step-heading`} tabIndex={-1}><span className="sr-only">Step {step + 1} of 4. </span>{inline && step === 0 ? introHeading : headings[step]}</h2>
          <p>{['a little context helps us see the bigger picture.', 'a starting point, not a commitment.', 'who should we get in touch with? all fields are required.', 'a quick look before the next step.'][step]}</p>
        </div>
        {step === 0 && (
          <FieldGroup>
            <Field data-enquiry-motion="" data-invalid={!!errors.company}>
              <ToggleGroup className={styles.companyChoices} value={company ? [company] : []} onValueChange={(values) => {
                setCompany(values[0] ?? '')
                setErrors({})
              }} aria-label="Company type" aria-invalid={!!errors.company} aria-describedby={errors.company ? `${idPrefix}-company-error` : undefined}>
                {companyTypes.map((type) => <ToggleGroupItem key={type} value={type}><span className={styles.choiceMarker} aria-hidden="true">{company === type ? <Check /> : <Plus />}</span>{type}</ToggleGroupItem>)}
              </ToggleGroup>
              <FieldError id={`${idPrefix}-company-error`}>{errors.company}</FieldError>
            </Field>
            {company === 'other' && (
              <Field className={styles.revealField} data-invalid={!!errors.customType}>
                <FieldLabel htmlFor={`${idPrefix}-customType`}>how would you describe your company?</FieldLabel>
                <Input id={`${idPrefix}-customType`} name="companyType" maxLength={100} value={customType} onChange={(event) => { setCustomType(event.target.value); setErrors({}) }} placeholder="company type" required aria-invalid={!!errors.customType} aria-describedby={errors.customType ? `${idPrefix}-customType-error` : undefined} />
                <FieldError id={`${idPrefix}-customType-error`}>{errors.customType}</FieldError>
              </Field>
            )}
            {inline && <Field data-enquiry-motion="" data-invalid={!!errors.brief}>
              <FieldLabel htmlFor={`${idPrefix}-brief`}>a little about your project</FieldLabel>
              <Textarea id={`${idPrefix}-brief`} name="brief" className={styles.brief} placeholder="what are you imagining? what would you like to change?" maxLength={1200} rows={3} required value={brief} onChange={(event) => { setBrief(event.target.value); setErrors((previous) => ({ ...previous, brief: undefined })) }} aria-invalid={!!errors.brief} aria-describedby={errors.brief ? `${idPrefix}-brief-error` : undefined} />
              <FieldError id={`${idPrefix}-brief-error`}>{errors.brief}</FieldError>
            </Field>}
          </FieldGroup>
        )}
        {step === 1 && (
          <FieldGroup>
            <div className={styles.budgetTop} data-enquiry-motion="">
              <div className={styles.budgetValue}><span className={styles.rangeLabel}>{undecided ? 'we can work it out together' : 'your estimated investment'}</span><span className={styles.amount} data-undecided={undecided}>{undecided ? 'let’s talk' : formatBudget(budget, currency, true)}</span></div>
              <Field className={styles.currencyField}>
                <FieldLabel className="sr-only" htmlFor={`${idPrefix}-currency`}>currency</FieldLabel>
                <NativeSelect id={`${idPrefix}-currency`} name="currency" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
                  {currencies.map((code) => <NativeSelectOption key={code} value={code}>{code}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            </div>
            <Field data-enquiry-motion="">
              <div className={styles.budgetControl} data-undecided={undecided}>
                <Slider value={[budget]} min={0} max={budgetBands.length - 1} step={1} className={styles.budgetSlider} onValueChange={(values) => { setBudget(Array.isArray(values) ? values[0] : values); setUndecided(false) }} thumbProps={{ 'aria-label': 'Budget', getAriaValueText: () => undecided ? 'Not sure yet; adjust to choose a budget' : budgetLabel }} />
              </div>
              <div className={styles.rangeLabels} aria-hidden="true"><span>{formatBudget(0, currency, true)}</span><span>{formatBudget(5, currency, true)}</span></div>
              <button type="button" className={styles.unsure} aria-pressed={undecided} onClick={() => setUndecided((value) => !value)}><span className={styles.choiceMarker} aria-hidden="true">{undecided ? <Check /> : <Plus />}</span>not sure yet</button>
            </Field>
          </FieldGroup>
        )}
        {step === 2 && <ContactFields idPrefix={idPrefix} contact={contact} errors={errors} onChange={(key, value) => {
          setContact((previous) => ({ ...previous, [key]: value }))
          setErrors((previous) => ({ ...previous, [key]: undefined }))
        }} />}
        {step === 3 && (
          <>
            <dl className={styles.review} data-enquiry-motion="">
              <div><dt>company</dt><dd>{companyLabel}</dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(0)} aria-label="Edit company type">edit</button></dd></div>
              {inline && <div><dt>project</dt><dd className={styles.reviewBrief}>{brief.trim()}</dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(0)} aria-label="Edit project brief">edit</button></dd></div>}
              <div><dt>budget</dt><dd>{budgetLabel}</dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(1)} aria-label="Edit budget">edit</button></dd></div>
              <div><dt>contact</dt><dd>{contact.name.trim()}<span>{contact.email.trim()}</span><span>{contact.phone.trim()}</span></dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(2)} aria-label="Edit contact details">edit</button></dd></div>
            </dl>
            <div className={styles.handoff} data-enquiry-motion="">
              <div className={styles.delivery}><a href={`mailto:${recipient}`}>{recipient}</a><p id={`${idPrefix}-delivery`}>{inline ? 'sending isn’t connected yet. copy your enquiry and email us.' : 'open a draft in your email app, or copy your enquiry.'}</p></div>
              <button type="button" onClick={copyEnquiry} disabled={copyState === 'copying'} aria-label={copyState === 'copied' ? 'Enquiry copied' : 'Copy enquiry'}><span key={copyState} className={styles.copyLabel}>{copyState === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copyState === 'copied' ? 'copied' : 'copy enquiry'}</span></button>
            </div>
            <p className={styles.copyStatus} role="status">{copyState === 'copied' ? <span className="sr-only">Enquiry copied.</span> : copyState === 'manual' ? 'Select the text below to copy.' : ''}</p>
            {copyState === 'manual' && <Field><FieldLabel className="sr-only" htmlFor={`${idPrefix}-copy`}>enquiry</FieldLabel><Textarea id={`${idPrefix}-copy`} data-enquiry-copy="" className={styles.copyText} readOnly value={enquiryText} rows={6} onFocus={(event) => event.target.select()} /></Field>}
          </>
        )}
      </section>
      <footer className={styles.footer} data-enquiry-motion="">
        <div className={styles.actions}>
          {(!inline || step > 0) && <button type="button" className={styles.back} onClick={() => step === 0 ? onMenu?.() : goTo(step - 1)}><CircularArrowIcon direction="left" />{step === 0 ? 'menu' : 'back'}</button>}
          {step < 3 ? <button type="submit" className={styles.continue}>{step === 2 ? 'review' : 'continue'}<CircularArrowIcon /></button> : inline ? <button type="button" className={styles.continue} disabled aria-describedby={`${idPrefix}-delivery`}>send enquiry<CircularArrowIcon /></button> : <a className={styles.continue} href={mailto}>open email draft<CircularArrowIcon /></a>}
        </div>
        {step === 3 && <div className={styles.footerNote}><button type="button" onClick={reset}>start over</button>{!inline && <p>opens your email app</p>}</div>}
      </footer>
      </div>
      </div>
    </form>
  )
}
