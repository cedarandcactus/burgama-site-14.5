'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import styles from './nav-project-form.module.css'

const companyTypes = ['startup', 'small business', 'established company', 'agency', 'nonprofit', 'other']
const currencies = ['USD', 'GBP', 'EUR', 'CAD', 'AUD'] as const
const budgetBands = [[0, 5000], [5000, 10000], [10000, 25000], [25000, 50000], [50000, 100000], [100000, null]] as const
const steps = ['company', 'budget', 'you', 'review']
const headings = ['what kind of company?', 'what are you thinking?', 'who should we talk to?', 'the start of something good.']
const descriptions = ['Big ambitions come in all shapes. Tell us yours.', 'A ballpark is perfect. We can figure out the details together.', 'Just a few details to put a person to the project.', 'One last look, then let’s get the conversation going.']
const recipient = 'hello@burgama.com'
type Currency = typeof currencies[number]
type Contact = { name: string; email: string; phone: string }
type Errors = Partial<Record<keyof Contact | 'company' | 'customType', string>>
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

function ContactFields({ contact, errors, onChange }: { contact: Contact; errors: Errors; onChange: (key: keyof Contact, value: string) => void }) {
  return (
    <FieldGroup className={styles.contactFields}>
      {([
        { key: 'name', label: 'your name', type: 'text', autocomplete: 'name', placeholder: 'First and last name', max: 100 },
        { key: 'email', label: 'email address', type: 'email', autocomplete: 'email', placeholder: 'you@company.com', max: 254 },
        { key: 'phone', label: 'phone number', type: 'tel', autocomplete: 'tel', placeholder: '+1 555 123 4567', max: 40 },
      ] as const).map(({ key, label, type, autocomplete, placeholder, max }) => (
        <Field key={key} data-invalid={!!errors[key]}>
          <FieldLabel htmlFor={`enquiry-${key}`}>{label}</FieldLabel>
          <Input id={`enquiry-${key}`} name={key} type={type} autoComplete={autocomplete} placeholder={placeholder} maxLength={max} required value={contact[key]} onChange={(event) => onChange(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `enquiry-${key}-error` : undefined} />
          <FieldError id={`enquiry-${key}-error`}>{errors[key]}</FieldError>
        </Field>
      ))}
    </FieldGroup>
  )
}

export function NavProjectForm({ active, onMenu, onHeightChange }: { active: boolean; onMenu: () => void; onHeightChange: (height: number) => void }) {
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
    if (!active || !form.current) return
    const observer = new ResizeObserver(([entry]) => heightCallback.current(entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height))
    observer.observe(form.current)
    return () => observer.disconnect()
  }, [active])

  useEffect(() => {
    if (!active) return
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true })
      form.current?.closest('.header-inner')?.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [active, step])

  const companyLabel = company === 'other' ? `other — ${customType.trim()}` : company
  const budgetLabel = undecided ? `not sure yet (${currency})` : `${formatBudget(budget, currency)} ${currency}`
  const subject = 'Let’s start a project — Burgama'
  const body = [
    'Hello Burgama,', '', 'I’d love to talk about a project.', '',
    `Company type: ${companyLabel}`, `Budget: ${budgetLabel}`, `Currency: ${currency}`, '',
    `Name: ${contact.name.trim()}`, `Email: ${contact.email.trim()}`, `Phone: ${contact.phone.trim()}`, '',
    'Let’s make something good.',
  ].join('\n')
  const enquiryText = `To: ${recipient}\nSubject: ${subject}\n\n${body}`
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  function goTo(next: number) {
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
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      requestAnimationFrame(() => {
        const target = firstError === 'company' ? form.current?.querySelector<HTMLElement>('[data-slot="toggle-group-item"]') : document.getElementById(`enquiry-${firstError}`)
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
    setCompany('')
    setCustomType('')
    setBudget(2)
    setUndecided(false)
    setCurrency('USD')
    setContact(emptyContact)
    goTo(0)
  }

  return (
    <form ref={form} id="nav-project-enquiry" className={styles.form} aria-label="Start a project" noValidate onSubmit={submit} onKeyDown={(event) => {
      if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) event.preventDefault()
    }}>
      <ol className={styles.progress} aria-label="Enquiry progress">
        {steps.map((label, index) => (
          <li key={label} data-current={index === step} data-complete={index < step} aria-current={index === step ? 'step' : undefined}>
            <span className={styles.progressTrack}><span /></span>
            <span className={styles.progressLabel}><span>{index < step ? <Check aria-hidden="true" /> : `0${index + 1}`}</span>{label}</span>
          </li>
        ))}
      </ol>
      <section key={step} className={styles.step} data-direction={direction < 0 ? 'back' : 'forward'} aria-labelledby="enquiry-step-heading">
        <div className={styles.intro}>
          <h2 ref={heading} id="enquiry-step-heading" tabIndex={-1}><span className="sr-only">Step {step + 1} of 4. </span>{headings[step]}</h2>
          <p>{descriptions[step]}</p>
        </div>
        {step === 0 && (
          <FieldGroup>
            <Field data-invalid={!!errors.company}>
              <ToggleGroup className={styles.companyChoices} value={company ? [company] : []} onValueChange={(values) => {
                setCompany(values[0] ?? '')
                setErrors({})
              }} aria-label="Company type" aria-invalid={!!errors.company} aria-describedby={errors.company ? 'enquiry-company-error' : undefined}>
                {companyTypes.map((type) => <ToggleGroupItem key={type} value={type}>{type}<Check aria-hidden="true" /></ToggleGroupItem>)}
              </ToggleGroup>
              <FieldError id="enquiry-company-error">{errors.company}</FieldError>
            </Field>
            {company === 'other' && (
              <Field data-invalid={!!errors.customType}>
                <FieldLabel htmlFor="enquiry-customType">a little more about your company</FieldLabel>
                <Input id="enquiry-customType" name="companyType" maxLength={100} value={customType} onChange={(event) => { setCustomType(event.target.value); setErrors({}) }} placeholder="A collective, a personal brand, something new…" required aria-invalid={!!errors.customType} aria-describedby={errors.customType ? 'enquiry-customType-error' : undefined} />
                <FieldError id="enquiry-customType-error">{errors.customType}</FieldError>
              </Field>
            )}
          </FieldGroup>
        )}
        {step === 1 && (
          <FieldGroup>
            <div className={styles.budgetTop}>
              <div className={styles.budgetAmount}><span className={styles.eyebrow}>project budget · {currency}</span><span key={`${currency}-${budget}-${undecided}`} className={styles.amount}>{undecided ? 'let’s talk' : formatBudget(budget, currency, true)}</span></div>
              <Field className={styles.currencyField}>
                <FieldLabel htmlFor="enquiry-currency">currency</FieldLabel>
                <NativeSelect id="enquiry-currency" name="currency" value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
                  {currencies.map((code) => <NativeSelectOption key={code} value={code}>{code}</NativeSelectOption>)}
                </NativeSelect>
              </Field>
            </div>
            <Field>
              <div className={styles.budgetControl} data-undecided={undecided}>
                <Slider value={[budget]} min={0} max={budgetBands.length - 1} step={1} className={styles.budgetSlider} onValueChange={(values) => { setBudget(Array.isArray(values) ? values[0] : values); setUndecided(false) }} thumbProps={{ 'aria-label': 'Project budget', getAriaValueText: () => undecided ? 'Not sure yet; adjust to choose a budget' : budgetLabel, 'aria-describedby': 'enquiry-budget-help' }} />
                <div className={styles.budgetTicks} aria-hidden="true">{budgetBands.map((_, index) => <span key={index} data-selected={!undecided && index <= budget} />)}</div>
                <div className={styles.budgetEnds} aria-hidden="true"><span>{formatBudget(0, currency, true)}</span><span>{formatBudget(5, currency, true)}</span></div>
              </div>
              <div className={styles.budgetHelp}><p id="enquiry-budget-help">drag to find your range</p><button type="button" className={styles.unsure} aria-pressed={undecided} onClick={() => setUndecided((value) => !value)}>{undecided && <Check aria-hidden="true" />}not sure yet</button></div>
              <p className={styles.smallNote}>Currency sets your budget denomination, not an exchange-rate conversion.</p>
            </Field>
          </FieldGroup>
        )}
        {step === 2 && <ContactFields contact={contact} errors={errors} onChange={(key, value) => {
          setContact((previous) => ({ ...previous, [key]: value }))
          setErrors((previous) => ({ ...previous, [key]: undefined }))
        }} />}
        {step === 3 && (
          <>
            <dl className={styles.review}>
              <div><dt>company type</dt><dd>{companyLabel}</dd><button type="button" onClick={() => goTo(0)} aria-label="Edit company type">edit</button></div>
              <div><dt>project budget</dt><dd>{budgetLabel}</dd><button type="button" onClick={() => goTo(1)} aria-label="Edit budget">edit</button></div>
              <div><dt>your details</dt><dd>{contact.name.trim()}<span>{contact.email.trim()}</span><span>{contact.phone.trim()}</span></dd><button type="button" onClick={() => goTo(2)} aria-label="Edit contact details">edit</button></div>
            </dl>
            <div className={styles.handoff}>
              <p>to <a href={`mailto:${recipient}`}>{recipient}</a></p>
              <button type="button" onClick={copyEnquiry} disabled={copyState === 'copying'}><Copy aria-hidden="true" />{copyState === 'copied' ? 'copied' : 'copy enquiry'}</button>
            </div>
            <p className={styles.copyStatus} role="status">{copyState === 'copied' ? 'Enquiry copied. Paste it into an email whenever you’re ready.' : copyState === 'manual' ? 'Copying isn’t available here. Select the text below to copy it manually.' : ''}</p>
            {copyState === 'manual' && <Field><FieldLabel htmlFor="enquiry-copy">your enquiry — select and copy</FieldLabel><textarea id="enquiry-copy" className={styles.copyText} readOnly value={enquiryText} rows={6} onFocus={(event) => event.target.select()} /></Field>}
          </>
        )}
      </section>
      <footer className={styles.footer}>
        <div className={styles.actions}>
          <button type="button" className={styles.back} onClick={() => step === 0 ? onMenu() : goTo(step - 1)}><ArrowLeft aria-hidden="true" />{step === 0 ? 'menu' : 'back'}</button>
          {step < 3 ? <button type="submit" className={styles.continue}>{step === 2 ? 'review enquiry' : 'continue'}<ArrowRight aria-hidden="true" /></button> : <a className={styles.continue} href={mailto}>open email draft<ArrowUpRight aria-hidden="true" /></a>}
        </div>
        <div className={styles.footerNote}><p>{step === 3 ? 'opens your email app — you’ll send it from there.' : step === 2 ? 'all fields required · nothing is sent yet.' : 'just the essentials. we’ll take it from there.'}</p>{step === 3 && <button type="button" onClick={reset}>start over</button>}</div>
      </footer>
    </form>
  )
}
