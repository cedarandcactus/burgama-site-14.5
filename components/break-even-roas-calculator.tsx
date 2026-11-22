'use client'

import { useId, useState } from 'react'
import styles from './calculator.module.css'

type FieldKey = 'aov' | 'margin' | 'fees' | 'target'

const fields: { key: FieldKey; label: string; hint: string; prefix?: string; suffix?: string; step: number; min: number; max?: number }[] = [
  { key: 'aov', label: 'Average order value', hint: 'What a customer spends on one order.', prefix: '$', step: 1, min: 1 },
  { key: 'margin', label: 'Gross margin', hint: 'What is left after product, packaging and shipping.', suffix: '%', step: 1, min: 1, max: 100 },
  { key: 'fees', label: 'Payment fees', hint: 'Shopify Payments is about 3% of each order.', suffix: '%', step: 0.1, min: 0, max: 30 },
  { key: 'target', label: 'Your target ROAS', hint: 'The return you are aiming for. Start with 4.', suffix: 'x', step: 0.1, min: 0.1 },
]

const defaults: Record<FieldKey, string> = { aov: '60', margin: '65', fees: '3', target: '4' }

// Prices on this site are written without commas on purpose.
const money = (value: number) => (Number.isFinite(value) ? `${value < 0 ? '-' : ''}$${Math.abs(value).toFixed(2)}` : '$0')
const times = (value: number) => (Number.isFinite(value) ? `${value.toFixed(2)}x` : 'n/a')
const percent = (value: number) => (Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : 'n/a')

export function BreakEvenRoasCalculator() {
  const id = useId()
  const [values, setValues] = useState(defaults)

  const read = (key: FieldKey) => {
    const parsed = Number.parseFloat(values[key])
    return Number.isFinite(parsed) ? parsed : 0
  }

  const aov = read('aov')
  const target = read('target')
  const contribution = aov * (read('margin') / 100) - aov * (read('fees') / 100)
  const ready = aov > 0 && contribution > 0
  const breakEven = ready ? aov / contribution : Number.POSITIVE_INFINITY
  const contributionRate = aov > 0 ? contribution / aov : 0
  const costAtTarget = target > 0 ? aov / target : 0
  const keptAtTarget = contribution - costAtTarget
  const clears = ready && target > breakEven

  let verdict = 'Enter an order value and a margin above your fees to see your floor.'
  if (ready && clears) {
    verdict = `Below ${times(breakEven)}, every sale loses money once the ad is paid for. At your ${times(target)} target you keep ${money(keptAtTarget)} an order.`
  } else if (ready) {
    verdict = `Your ${times(target)} target sits below your floor of ${times(breakEven)}, so each sale loses ${money(-keptAtTarget)} after the ad. Raise the target, the order value or the margin.`
  }

  return (
    <div className={styles.calculator}>
      <form className={styles.inputs} aria-label="Your numbers" onSubmit={event => event.preventDefault()}>
        {fields.map(field => (
          <div className={styles.field} key={field.key}>
            <label htmlFor={`${id}-${field.key}`}>{field.label}</label>
            <div className={styles.control}>
              {field.prefix && <span aria-hidden="true">{field.prefix}</span>}
              <input
                id={`${id}-${field.key}`}
                type="number"
                inputMode="decimal"
                min={field.min}
                max={field.max}
                step={field.step}
                value={values[field.key]}
                aria-describedby={`${id}-${field.key}-hint`}
                onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))}
              />
              {field.suffix && <span aria-hidden="true">{field.suffix}</span>}
            </div>
            <p id={`${id}-${field.key}-hint`}>{field.hint}</p>
          </div>
        ))}
      </form>

      <div className={styles.results} aria-live="polite">
        <p className={styles.resultLabel}>Your break-even ROAS</p>
        <p className={`${styles.resultHero} font-serif`}>{ready ? times(breakEven) : 'n/a'}</p>
        <p className={styles.verdict} data-clears={clears}>{verdict}</p>

        <dl className={styles.figures}>
          <div>
            <dt>Profit per order before ads</dt>
            <dd>{ready ? money(contribution) : '$0'}</dd>
          </div>
          <div>
            <dt>Most you can pay for a sale and break even</dt>
            <dd>{ready ? money(contribution) : '$0'}</dd>
          </div>
          <div>
            <dt>Break-even ACOS</dt>
            <dd>{ready ? percent(contributionRate) : 'n/a'}</dd>
          </div>
          <div>
            <dt>Cost per sale at your target</dt>
            <dd>{ready && target > 0 ? money(costAtTarget) : '$0'}</dd>
          </div>
          <div>
            <dt>Kept per order at your target</dt>
            <dd>{ready && target > 0 ? money(keptAtTarget) : '$0'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
