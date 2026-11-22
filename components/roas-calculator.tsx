'use client'

import { useId, useState } from 'react'
import styles from './calculator.module.css'

// Formulas from the budget calculator we use with clients. Meta's "about 50 results in a
// week" guideline is from its learning phase help page, linked on the page itself.
const RESULTS_PER_WEEK = 50
const WEEKS_PER_MONTH = 4.33

type FieldKey = 'aov' | 'margin' | 'fees' | 'target' | 'spend' | 'orders'

const fields: { key: FieldKey; label: string; hint: string; prefix?: string; suffix?: string; step: number; min: number; max?: number }[] = [
  { key: 'aov', label: 'Average order value', hint: 'What a customer spends on one order.', prefix: '$', step: 1, min: 1 },
  { key: 'margin', label: 'Gross margin', hint: 'What is left after product, packaging and shipping.', suffix: '%', step: 1, min: 1, max: 100 },
  { key: 'fees', label: 'Payment fees', hint: 'Shopify Payments is about 3% of each order.', suffix: '%', step: 0.1, min: 0, max: 30 },
  { key: 'target', label: 'Target ROAS', hint: 'Revenue for every $1 of ad spend. Start with 4.', suffix: 'x', step: 0.1, min: 0.1 },
  { key: 'spend', label: 'Monthly ad spend', hint: 'What you pay Meta in a month.', prefix: '$', step: 100, min: 0 },
  { key: 'orders', label: 'Orders per customer in 90 days', hint: 'Use 1 if you don’t know. Subscriptions and reorders push it up.', step: 0.1, min: 1 },
]

const defaults: Record<FieldKey, string> = { aov: '60', margin: '65', fees: '3', target: '4', spend: '3000', orders: '1' }

function money(value: number, digits = 0) {
  if (!Number.isFinite(value)) return '$0'
  const sign = value < 0 ? '-' : ''
  // Prices on this site are written without commas on purpose.
  return `${sign}$${Math.abs(value).toFixed(digits)}`
}

function times(value: number) {
  return Number.isFinite(value) ? `${value.toFixed(2)}x` : 'n/a'
}

export function RoasCalculator() {
  const id = useId()
  const [values, setValues] = useState(defaults)

  const read = (key: FieldKey) => {
    const parsed = Number.parseFloat(values[key])
    return Number.isFinite(parsed) ? parsed : 0
  }

  const aov = read('aov')
  const target = read('target')
  const spend = read('spend')
  const orders = Math.max(1, read('orders'))
  const contribution = aov * (read('margin') / 100) - aov * (read('fees') / 100)
  const breakEven = contribution > 0 ? aov / contribution : Number.POSITIVE_INFINITY
  const costPerPurchase = target > 0 ? aov / target : 0
  const profitPerOrder = contribution - costPerPurchase
  const profitPerCustomer = contribution * orders - costPerPurchase
  const revenue = spend * target
  const purchases = aov > 0 ? revenue / aov : 0
  const monthlyProfit = purchases * contribution - spend
  const learningBudget = costPerPurchase * RESULTS_PER_WEEK * WEEKS_PER_MONTH
  const ready = aov > 0 && target > 0 && contribution > 0
  const clears = ready && target > breakEven

  let verdict = 'Enter your order value, margin and target to see what it takes.'
  if (ready && clears) {
    verdict = `At ${times(target)} you can pay up to ${money(costPerPurchase, 2)} for a purchase and keep ${money(profitPerOrder, 2)} on the first order, after product costs, fees and the ad.`
  } else if (ready) {
    verdict = `At your margin, ${times(target)} loses money on the first order. You need more than ${times(breakEven)} before an order pays for its own ad. Raise the target, the order value or the margin.`
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
        <p className={styles.resultLabel}>The most you can pay for a purchase at {times(target)}</p>
        <p className={`${styles.resultHero} font-serif`}>{ready ? money(costPerPurchase, 2) : '$0'}</p>
        <p className={styles.verdict} data-clears={clears}>{verdict}</p>

        <dl className={styles.figures}>
          <div>
            <dt>Revenue from {money(spend)} of ad spend</dt>
            <dd>{ready ? money(revenue) : '$0'}</dd>
          </div>
          <div>
            <dt>Purchases</dt>
            <dd>{ready ? Math.round(purchases) : 0}</dd>
          </div>
          <div>
            <dt>Left after product costs, fees and ads</dt>
            <dd>{ready ? money(monthlyProfit) : '$0'}</dd>
          </div>
          <div>
            <dt>Kept per customer over 90 days</dt>
            <dd>{ready ? money(profitPerCustomer, 2) : '$0'}</dd>
          </div>
          <div>
            <dt>Monthly spend for Meta to learn on purchases</dt>
            <dd>{ready ? money(learningBudget) : '$0'}</dd>
          </div>
          <div>
            <dt>Your floor: the ROAS where an order pays for its own ad</dt>
            <dd>{ready ? times(breakEven) : 'n/a'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
