import type { Metadata } from 'next'
import { CacCalculator } from '@/components/cac-calculator'
import { CalculatorPage } from '@/components/calculator-page'
import { defaultSocialImage } from '@/lib/seo'
import styles from '@/components/calculator.module.css'

const path = '/research/customer-acquisition-cost-calculator'
const title = 'Customer Acquisition Cost (CAC) Calculator | Burgama'
const description = 'A free customer acquisition cost calculator. Enter what you spent and how many new customers it brought, and see whether their first year pays the cost back.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [defaultSocialImage] },
  twitter: { card: 'summary_large_image', title, description, images: [defaultSocialImage] },
}

const faq: [string, string][] = [
  ['What is customer acquisition cost?', 'Customer acquisition cost, or CAC, is what you spend on average to win one new customer. It counts everything you spend on getting customers, not only the ads.'],
  ['How do you calculate CAC?', 'Add up your ad spend and other marketing costs for a period, then divide by the number of new customers you won in that period. CAC = (ad spend + other marketing costs) / new customers.'],
  ['What should I include in CAC?', 'Ad spend, agency or freelancer fees, marketing tools, and the share of salaries spent on winning customers. Leave out the cost of the product itself; that belongs in your margin.'],
  ['What is a good customer acquisition cost?', 'One that a customer pays back. A $40 CAC is cheap for a customer who leaves $150 in profit in their first year and expensive for one who leaves $30. Compare your CAC to what a customer is worth to you, not to another brand’s number.'],
  ['What is the difference between CAC and cost per purchase?', 'Cost per purchase in an ads account counts every purchase the ads drove, including repeat buyers, and only the ad spend. CAC counts only first-time customers and every cost of winning them, so it is usually higher.'],
  ['Why does this use the first year instead of lifetime value?', 'Because you can check the first year. Lifetime value depends on guesses about how long customers stay. If a customer pays back their CAC inside a year, you can keep spending with confidence and treat anything after that as upside.'],
]

export default function CacCalculatorPage() {
  return (
    <CalculatorPage
      slug="customer-acquisition-cost-calculator"
      name="Customer acquisition cost calculator"
      description={description}
      wordmark="Customer acquisition cost calculator"
      intro="See what each new customer costs you, and whether their first year pays it back. The numbers below are examples."
      calculator={<CacCalculator />}
      howTitle="How the calculator works"
      how={<>
        <p>CAC on its own is just a cost. It only means something next to what a customer is worth. So this calculator works out both, and shows whether the first year covers the cost.</p>

        <h3 className="font-serif">What a customer costs</h3>
        <p className={styles.formula}>CAC = (ad spend + other marketing costs) / new customers</p>
        <p>$3000 in ads and $750 in other costs that bring in 100 new customers is a CAC of $37.50. Count only first-time buyers, or repeat orders will make the number look better than it is.</p>

        <h3 className="font-serif">What a customer is worth in year one</h3>
        <p className={styles.formula}>Year-one profit = order value x margin after costs x orders per year</p>
        <p>A $60 order at a 65% margin leaves $39. A customer who orders twice in a year leaves $78. That is the most you could pay to win them and still break even inside the year.</p>

        <h3 className="font-serif">Whether it pays back</h3>
        <p className={styles.formula}>Kept per customer = year-one profit - CAC</p>
        <p>$78 minus $37.50 leaves $40.50 a customer, and the first order covers the cost on its own. When the first order pays back the CAC, every reorder is profit, and you can afford to spend more to grow faster. To plan the ad side, the <a href="/research/roas-calculator">ROAS calculator</a> turns a target return into the price you can pay for each sale.</p>
      </>}
      faq={faq}
      closing={{ title: 'Know what a customer is worth. We’ll go get more of them.', body: 'We plan, make and run Facebook and Instagram ads, and build the email flows that bring customers back. Management starts at $750 a month.' }}
    />
  )
}
