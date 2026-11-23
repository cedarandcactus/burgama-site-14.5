// Free calculators. They live in the research section, next to the articles.
export type CalculatorEntry = {
  slug: string
  name: string
  deck: string
}

export const calculators: CalculatorEntry[] = [
  {
    slug: 'roas-calculator',
    name: 'ROAS calculator',
    deck: 'See what a 4x return on ad spend lets you pay for a purchase, and what a month of spend returns.',
  },
  {
    slug: 'break-even-roas-calculator',
    name: 'Break-even ROAS calculator',
    deck: 'Find the return where an order only pays for its own ad, then see what your target leaves you.',
  },
  {
    slug: 'customer-acquisition-cost-calculator',
    name: 'Customer acquisition cost calculator',
    deck: 'Work out what each new customer costs you, and whether their first year pays it back.',
  },
]

export const calculatorPath = (slug: string) => `/research/${slug}`
