import content from './faq-content.json'
import { absoluteUrl, siteUrl } from './seo'

export const faqSections = [
  { id: 'about-burgama', title: 'About Burgama' },
  { id: 'how-we-work', title: 'How we work' },
  { id: 'seo-ai-search', title: 'SEO & AI search' },
] as const

export const faqEntries = content.questions
export const faqServices = content.services
export const faqOrganization = content.organization

const homeQuestionIds = [
  'what-services-does-burgama-offer',
  'what-happens-after-i-contact-burgama',
  'what-are-burgama-s-packages-and-prices',
  'how-many-revisions-does-burgama-include',
  'is-there-a-minimum-contract-length',
]

export const homeFaqs = homeQuestionIds.map(id => {
  const entry = faqEntries.find(question => question.id === id)
  if (!entry) throw new Error(`Missing homepage FAQ: ${id}`)
  return entry
})

export function formatServicePrice(service: (typeof faqServices)[number]) {
  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: service.offers.priceCurrency, maximumFractionDigits: 0,
  }).format(Number(service.offers.price))
  return `${amount}${service.offers.priceSpecification ? ' a month' : ' / project'}`
}

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    faqOrganization,
    ...faqServices,
    {
      '@type': 'FAQPage',
      '@id': `${absoluteUrl('/faq')}#faq`,
      url: absoluteUrl('/faq'),
      name: 'Burgama FAQ and Pricing',
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#organization` },
      mainEntity: faqEntries.map(entry => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: { '@type': 'Answer', text: entry.answer },
      })),
    },
  ],
}

export function faqLlmText() {
  return [
    '# Burgama',
    '',
    `> ${faqOrganization.description} One team does the strategy, SEO, social, video, email, websites and paid ads. Prices below are in USD. Every proposal is custom.`,
    '',
    'Legal name: Cedar and Cactus LLC, doing business as Burgama. Formerly Cedar & Cactus (renamed September 2026).',
    `Website: ${siteUrl}`,
    `FAQ and pricing: ${absoluteUrl('/faq')}`,
    '',
    '## Packages and prices (USD)',
    ...faqServices.map(service => `- ${service.name}: ${formatServicePrice(service)}. ${service.description}`),
    '',
    ...faqSections.flatMap(section => [
      `## ${section.title}`,
      '',
      ...faqEntries.filter(entry => entry.section === section.id).flatMap(entry => [
        `Q: ${entry.question}`,
        `A: ${entry.answer}`,
        '',
      ]),
    ]),
  ].join('\n')
}
