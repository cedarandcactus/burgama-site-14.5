'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
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
        { key: 'name', label: 'name', type: 'text', autocomplete: 'name', placeholder: 'name', max: 100 },
        { key: 'email', label: 'email', type: 'email', autocomplete: 'email', placeholder: 'email', max: 254 },
        { key: 'phone', label: 'phone', type: 'tel', autocomplete: 'tel', placeholder: 'phone', max: 40 },
      ] as const).map(({ key, label, type, autocomplete, placeholder, max }) => (
        <Field key={key} data-invalid={!!errors[key]}>
          <FieldLabel className="sr-only" htmlFor={`${idPrefix}-${key}`}>{label}</FieldLabel>
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
  const [direction, setDirection] = useState(1)
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

  useEffect(() => {
    if (!active || !form.current || inline) return
    const observer = new ResizeObserver(([entry]) => heightCallback.current?.(entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height))
    observer.observe(form.current)
    return () => observer.disconnect()
  }, [active, inline])

  useEffect(() => {
    if (!active || (inline && !focusStep.current)) return
    const frame = requestAnimationFrame(() => {
      focusStep.current = false
      if (inline && form.current && heading.current) {
        const clearance = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 84
        const bounds = heading.current.getBoundingClientRect()
        if (bounds.top < clearance || bounds.bottom > window.innerHeight) {
          scroll?.cancelScroll()
          window.scrollTo({ top: Math.max(0, Math.round(window.scrollY + form.current.getBoundingClientRect().top - clearance)), behavior: 'instant' })
        }
      }
      heading.current?.focus({ preventScroll: true })
      if (!inline) form.current?.closest('.header-inner')?.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [active, step, inline, scroll])

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
    focusStep.current = true
    setDirection(next < step ? -1 : 1)
    setErrors({})
    setCopyState('idle')
    setStep(next)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
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
    setCopyState('copying')
    try {
      await navigator.clipboard.writeText(enquiryText)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
    }
  }

  function reset() {
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
      <div id={`${idPrefix}-progress`} className={styles.progress} role="progressbar" aria-label="Enquiry progress" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={step + 1} aria-valuetext={`${steps[step]}, step ${step + 1} of ${steps.length}`}>
        <span style={{ transform: `scaleX(${(step + 1) / steps.length})` }} />
      </div>
      <section key={step} className={styles.step} data-direction={direction < 0 ? 'back' : 'forward'} aria-labelledby={`${idPrefix}-step-heading`}>
        <div className={styles.intro}>
          <h2 ref={heading} id={`${idPrefix}-step-heading`} tabIndex={-1}><span className="sr-only">Step {step + 1} of 4. </span>{inline && step === 0 ? introHeading : headings[step]}</h2>
        </div>
        {step === 0 && (
          <FieldGroup>
            <Field data-invalid={!!errors.company}>
              <ToggleGroup className={styles.companyChoices} value={company ? [company] : []} onValueChange={(values) => {
                setCompany(values[0] ?? '')
                setErrors({})
              }} aria-label="Company type" aria-invalid={!!errors.company} aria-describedby={errors.company ? `${idPrefix}-company-error` : undefined}>
                {companyTypes.map((type) => <ToggleGroupItem key={type} value={type}>{type}</ToggleGroupItem>)}
              </ToggleGroup>
              <FieldError id={`${idPrefix}-company-error`}>{errors.company}</FieldError>
            </Field>
            {company === 'other' && (
              <Field data-invalid={!!errors.customType}>
                <FieldLabel className="sr-only" htmlFor={`${idPrefix}-customType`}>company type</FieldLabel>
                <Input id={`${idPrefix}-customType`} name="companyType" maxLength={100} value={customType} onChange={(event) => { setCustomType(event.target.value); setErrors({}) }} placeholder="company type" required aria-invalid={!!errors.customType} aria-describedby={errors.customType ? `${idPrefix}-customType-error` : undefined} />
                <FieldError id={`${idPrefix}-customType-error`}>{errors.customType}</FieldError>
              </Field>
            )}
            {inline && <Field data-invalid={!!errors.brief}>
              <FieldLabel className="sr-only" htmlFor={`${idPrefix}-brief`}>project brief</FieldLabel>
              <Textarea id={`${idPrefix}-brief`} name="brief" className={styles.brief} placeholder={inline ? 'project details' : 'a little about your project'} maxLength={1200} rows={3} required value={brief} onChange={(event) => { setBrief(event.target.value); setErrors((previous) => ({ ...previous, brief: undefined })) }} aria-invalid={!!errors.brief} aria-describedby={errors.brief ? `${idPrefix}-brief-error` : undefined} />
              <FieldError id={`${idPrefix}-brief-error`}>{errors.brief}</FieldError>
            </Field>}
          </FieldGroup>
        )}
        {step === 1 && (
          <FieldGroup>
            <div className={styles.budgetTop}>
              <span className={styles.amount}>{undecided ? '—' : formatBudget(budget, currency, true)}</span>
              <Field className={styles.currencyField}>
                <FieldLabel className="sr-only" htmlFor={`${idPrefix}-currency`}>currency</FieldLabel>
                <NativeSelect id={`${idPrefix}-currency`} name="currency" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
                  {currencies.map((code) => <NativeSelectOption key={code} value={code}>{code}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            </div>
            <Field>
              <div className={styles.budgetControl} data-undecided={undecided}>
                <Slider value={[budget]} min={0} max={budgetBands.length - 1} step={1} className={styles.budgetSlider} onValueChange={(values) => { setBudget(Array.isArray(values) ? values[0] : values); setUndecided(false) }} thumbProps={{ 'aria-label': 'Budget', getAriaValueText: () => undecided ? 'Not sure yet; adjust to choose a budget' : budgetLabel }} />
              </div>
              <button type="button" className={styles.unsure} aria-pressed={undecided} onClick={() => setUndecided((value) => !value)}>not sure yet</button>
            </Field>
          </FieldGroup>
        )}
        {step === 2 && <ContactFields idPrefix={idPrefix} contact={contact} errors={errors} onChange={(key, value) => {
          setContact((previous) => ({ ...previous, [key]: value }))
          setErrors((previous) => ({ ...previous, [key]: undefined }))
        }} />}
        {step === 3 && (
          <>
            <dl className={styles.review}>
              <div><dt>company</dt><dd>{companyLabel}</dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(0)} aria-label="Edit company type">edit</button></dd></div>
              {inline && <div><dt>project</dt><dd className={styles.reviewBrief}>{brief.trim()}</dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(0)} aria-label="Edit project brief">edit</button></dd></div>}
              <div><dt>budget</dt><dd>{budgetLabel}</dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(1)} aria-label="Edit budget">edit</button></dd></div>
              <div><dt>contact</dt><dd>{contact.name.trim()}<span>{contact.email.trim()}</span><span>{contact.phone.trim()}</span></dd><dd className={styles.reviewAction}><button type="button" onClick={() => goTo(2)} aria-label="Edit contact details">edit</button></dd></div>
            </dl>
            <div className={styles.handoff}>
              {inline ? <p id={`${idPrefix}-delivery`}>email delivery isn&apos;t connected yet</p> : <a href={`mailto:${recipient}`}>{recipient}</a>}
              <button type="button" onClick={copyEnquiry} disabled={copyState === 'copying'} aria-label={copyState === 'copied' ? 'Enquiry copied' : 'Copy enquiry'}>{copyState === 'copied' ? 'copied' : inline ? 'copy enquiry' : 'copy'}</button>
            </div>
            <p className={styles.copyStatus} role="status">{copyState === 'copied' ? <span className="sr-only">Enquiry copied.</span> : copyState === 'manual' ? 'Select the text below to copy.' : ''}</p>
            {copyState === 'manual' && <Field><FieldLabel className="sr-only" htmlFor={`${idPrefix}-copy`}>enquiry</FieldLabel><Textarea id={`${idPrefix}-copy`} data-enquiry-copy="" className={styles.copyText} readOnly value={enquiryText} rows={6} onFocus={(event) => event.target.select()} /></Field>}
          </>
        )}
      </section>
      <footer className={styles.footer}>
        <div className={styles.actions}>
          {(!inline || step > 0) && <button type="button" className={styles.back} onClick={() => step === 0 ? onMenu?.() : goTo(step - 1)}><CircularArrowIcon direction="left" />{step === 0 ? 'menu' : 'back'}</button>}
          {step < 3 ? <button type="submit" className={styles.continue}>{step === 2 ? 'review' : 'continue'}<CircularArrowIcon /></button> : inline ? <button type="button" className={styles.continue} disabled aria-describedby={`${idPrefix}-delivery`}>send enquiry<CircularArrowIcon /></button> : <a className={styles.continue} href={mailto}>open email draft<CircularArrowIcon /></a>}
        </div>
        {step === 3 && <div className={styles.footerNote}><button type="button" onClick={reset}>start over</button>{!inline && <p>opens your email app</p>}</div>}
      </footer>
    </form>
  )
}
