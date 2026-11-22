'use client'

import { useId, useState } from 'react'
import styles from './calculator.module.css'

type FieldKey = 'spend' | 'other' | 'customers' | 'aov' | 'margin' | 'orders'

const fields: { key: FieldKey; label: string; hint: string; prefix?: string; suffix?: string; step: number; min: number; max?: number }[] = [
  { key: 'spend', label: 'Ad spend', hint: 'What you paid the ad platforms in the period.', prefix: '$', step: 100, min: 0 },
  { key: 'other', label: 'Other marketing costs', hint: 'Agency or freelancer fees, tools, and the share of salaries spent on winning customers.', prefix: '$', step: 50, min: 0 },
  { key: 'customers', label: 'New customers', hint: 'First-time buyers in the same period. Leave out repeat orders.', step: 1, min: 1 },
  { key: 'aov', label: 'Average order value', hint: 'What a customer spends on one order.', prefix: '$', step: 1, min: 1 },
  { key: 'margin', label: 'Margin after costs', hint: 'What is left after product, packaging, shipping and payment fees.', suffix: '%', step: 1, min: 1, max: 100 },
  { key: 'orders', label: 'Orders per customer in a year', hint: 'Use 1 if you don’t know. Subscriptions and reorders push it up.', step: 0.1, min: 1 },
]

const defaults: Record<FieldKey, string> = { spend: '3000', other: '750', customers: '100', aov: '60', margin: '65', orders: '2' }

// Prices on this site are written without commas on purpose.
const money = (value: number) => (Number.isFinite(value) ? `${value < 0 ? '-' : ''}$${Math.abs(value).toFixed(2)}` : '$0')
const wholeMoney = (value: number) => (Number.isFinite(value) ? `$${Math.round(Math.abs(value))}` : '$0')
const times = (value: number) => (Number.isFinite(value) ? `${value.toFixed(2)}x` : 'n/a')

export function CacCalculator() {
  const id = useId()
  const [values, setValues] = useState(defaults)

  const read = (key: FieldKey) => {
    const parsed = Number.parseFloat(values[key])
    return Number.isFinite(parsed) ? parsed : 0
  }

  const totalCost = read('spend') + read('other')
  const customers = read('customers')
  const profitPerOrder = read('aov') * (read('margin') / 100)
  const orders = Math.max(1, read('orders'))
  const cac = customers > 0 ? totalCost / customers : 0
  const yearValue = profitPerOrder * orders
  const kept = yearValue - cac
  const ratio = cac > 0 ? yearValue / cac : Number.POSITIVE_INFINITY
  const paybackOrders = profitPerOrder > 0 ? cac / profitPerOrder : Number.POSITIVE_INFINITY
  const ready = customers > 0 && profitPerOrder > 0
  const clears = ready && kept >= 0

  let verdict = 'Enter your costs, new customers and margin to see what a customer costs you.'
  if (ready && clears) {
    const payback = paybackOrders <= 1 ? 'The first order pays it back.' : `It takes ${paybackOrders.toFixed(1)} orders to earn it back.`
    verdict = `Each new customer costs ${money(cac)} and leaves ${money(yearValue)} in their first year, so you keep ${money(kept)}. ${payback}`
  } else if (ready) {
    verdict = `Each new customer costs ${money(cac)} but leaves only ${money(yearValue)} in their first year. Lower the cost, raise the order value, or give customers a reason to order again.`
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
        <p className={styles.resultLabel}>Your customer acquisition cost</p>
        <p className={`${styles.resultHero} font-serif`}>{customers > 0 ? money(cac) : '$0'}</p>
        <p className={styles.verdict} data-clears={clears}>{verdict}</p>

        <dl className={styles.figures}>
          <div>
            <dt>Spent on winning customers</dt>
            <dd>{wholeMoney(totalCost)}</dd>
          </div>
          <div>
            <dt>Profit per order</dt>
            <dd>{ready ? money(profitPerOrder) : '$0'}</dd>
          </div>
          <div>
            <dt>Profit per customer in year one</dt>
            <dd>{ready ? money(yearValue) : '$0'}</dd>
          </div>
          <div>
            <dt>Kept per customer after CAC</dt>
            <dd>{ready ? money(kept) : '$0'}</dd>
          </div>
          <div>
            <dt>Year-one profit for every $1 of CAC</dt>
            <dd>{ready && cac > 0 ? times(ratio) : 'n/a'}</dd>
          </div>
          <div>
            <dt>Most you can pay for a customer and break even in year one</dt>
            <dd>{ready ? money(yearValue) : '$0'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
