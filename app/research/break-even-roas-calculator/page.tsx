import type { Metadata } from 'next'
import { BreakEvenRoasCalculator } from '@/components/break-even-roas-calculator'
import { CalculatorPage } from '@/components/calculator-page'
import { defaultSocialImage } from '@/lib/seo'
import styles from '@/components/calculator.module.css'

const path = '/research/break-even-roas-calculator'
const title = 'Break-Even ROAS Calculator: Find Your Floor | Burgama'
const description = 'A free break-even ROAS calculator. Enter your order value, margin and fees to find the return where a sale only pays for its ad, and what your target leaves you.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [defaultSocialImage] },
  twitter: { card: 'summary_large_image', title, description, images: [defaultSocialImage] },
}

const faq: [string, string][] = [
  ['What is break-even ROAS?', 'Break-even ROAS is the return on ad spend where a sale earns back exactly what it cost: the product, the fees and the ad. Above it, ads make money. Below it, every sale loses money.'],
  ['How do you calculate break-even ROAS?', 'Divide your average order value by the profit an order leaves before ads. Break-even ROAS = order value / (order value x gross margin - payment fees). It is the same as 1 divided by your margin after fees. A 62% margin after fees gives a break-even ROAS of 1.61x.'],
  ['Is break-even ROAS a good target?', 'No. At break-even every sale makes $0 after the ad. It is the floor your target has to clear, not the goal. Set a target well above it, then use the ROAS calculator to see what that target lets you pay for each sale.'],
  ['What is break-even ACOS?', 'ACOS is ad spend divided by sales, the way Amazon reports it. Break-even ACOS is your margin after fees as a percentage. It is 1 divided by your break-even ROAS, so a 1.61x break-even ROAS is a 62% break-even ACOS.'],
  ['Where do shipping and packaging go?', 'Take them out of your gross margin. Enter the margin that is left after the product, the packaging and shipping, and keep payment fees as their own line.'],
  ['Does this work for Google, TikTok and Amazon ads?', 'Yes. Break-even ROAS depends only on your order value, margin and fees, so it is the same on every ad platform.'],
]

export default function BreakEvenRoasCalculatorPage() {
  return (
    <CalculatorPage
      slug="break-even-roas-calculator"
      name="Break-even ROAS calculator"
      description={description}
      wordmark="Break-even ROAS calculator"
      intro="Find the return where a sale only pays for its own ad. Then see what your real target leaves you. The numbers below are examples."
      calculator={<BreakEvenRoasCalculator />}
      howTitle="How the calculator works"
      how={<>
        <p>Break-even ROAS is the floor, not the goal. Knowing it tells you how much room your target has, and how far you can push spend before a sale stops paying for itself.</p>

        <h3 className="font-serif">What an order leaves before ads</h3>
        <p className={styles.formula}>Profit per order = (order value x gross margin) - payment fees</p>
        <p>On a $60 order with a 65% margin and 3% fees, that is $39 minus $1.80, or $37.20. That is also the most you can pay an ad to bring in that sale and still break even.</p>

        <h3 className="font-serif">Your break-even ROAS</h3>
        <p className={styles.formula}>Break-even ROAS = order value / profit per order</p>
        <p>$60 divided by $37.20 is 1.61x. At 1.61x, every dollar of ad spend brings back $1.61 in sales, and the profit on those sales pays for the ad and nothing more.</p>

        <h3 className="font-serif">What your target leaves you</h3>
        <p className={styles.formula}>Kept per order = profit per order - (order value / target ROAS)</p>
        <p>At 4x, the same order can cost up to $15 in ads and still keep $22.20. The gap between your floor and your target is the profit, and the reason we plan from the target. The <a href="/research/roas-calculator">ROAS calculator</a> takes it further, to monthly revenue and the budget Meta needs to learn.</p>
      </>}
      faq={faq}
      closing={{ title: 'The floor is where we start, not where we aim.', body: 'We plan, make and run Facebook and Instagram ads to a target well above break-even. Management starts at $750 a month.' }}
    />
  )
}
