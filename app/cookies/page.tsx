import type { Metadata, Viewport } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Burgama uses first-party preference cookies, essential consent storage, cookie-free website analytics, and consent-based advertising measurement.',
}

export const viewport: Viewport = { themeColor: '#afc8f2', colorScheme: 'light' }

const sections = [
  {
    id: 'overview',
    title: 'About this policy',
    paragraphs: [
      'This Cookie Policy explains the browser technologies used on the Burgama website, why they are used, how long they remain, and the choices available to you. Read it with our Privacy Policy, which explains how we handle personal information more broadly.',
      'Cookies are small text files a website can ask your browser to store. Some remember a choice on the website; others may support measurement, security, or advertising. Burgama uses the first-party preference cookies described below and, only if you choose “Accept,” an advertising measurement pixel from OpenAI on our free AI visibility check page.',
    ],
  },
  {
    id: 'consent-cookie',
    title: 'Your cookie choice',
    paragraphs: [
      'The burgama-cookie-consent cookie records whether you selected “Accept” or “Only necessary” in our cookie notice. It is necessary to remember your choice and prevent the notice from appearing on every page view. It lasts for 30 days, after which we ask again.',
      'This is a first-party cookie available across routes on the Burgama website. It uses the SameSite=Lax attribute and, when the website is served over HTTPS, the Secure attribute. It stores only your selected consent category and does not contain your name, email address, or a unique advertising identifier.',
    ],
  },
  {
    id: 'headline-cookie',
    title: 'Homepage preference',
    paragraphs: [
      'If you select “Accept,” the burgama-hero-message cookie remembers which homepage introduction you most recently saw so the website can present a different version on a later visit. It contains only a number from 0 to 2, lasts for 30 days, and uses Path=/, SameSite=Lax, and Secure on HTTPS.',
      'This preference is not necessary for the website to work. If you select “Only necessary,” Burgama does not create it and removes an existing copy where possible. The homepage still works and chooses an introduction for the current visit without saving that choice.',
    ],
  },
  {
    id: 'analytics-hosting',
    title: 'Analytics, hosting & security',
    paragraphs: [
      'The production website uses Vercel Web Analytics for aggregated usage statistics. Vercel describes this service as cookie-free: it uses a request-derived identifier that is discarded after 24 hours rather than placing a tracking cookie in your browser. We do not use it to follow you across unrelated websites.',
      'Vercel also hosts and delivers the website. Its infrastructure processes ordinary request information and may apply essential delivery, fraud-prevention, or security mechanisms to operate and protect the service. More detail about technical data and service providers appears in our Privacy Policy.',
    ],
  },
  {
    id: 'advertising-measurement',
    title: 'Advertising measurement',
    paragraphs: [
      'Burgama advertises its free AI visibility check in ChatGPT. If you select “Accept,” the AI visibility check pages load OpenAI’s measurement pixel so we can learn whether a visit that started from one of our ChatGPT ads led to a request. The pixel sets two cookies: __oppref, which stores the ad click reference from the link you followed for 30 days, and __obref, a random browser reference kept for up to 365 days.',
      'When you submit the check form after selecting “Accept,” the pixel may send OpenAI a conversion event that includes a one-way hashed (SHA-256) copy of your email address, and our server may send the same event with your IP address, browser details and city. OpenAI uses this to report and improve ad results for Burgama. If you select “Only necessary,” the pixel is not loaded, these cookies are not set, and no conversion event is sent; we still learn which campaign you came from through ordinary link parameters in the page address.',
    ],
  },
  {
    id: 'choices',
    title: 'Managing your choices',
    paragraphs: [
      'You can choose “Accept” to allow the homepage preference and advertising measurement, or “Only necessary” to keep only the cookie that remembers your consent choice. You can also delete Burgama cookies in your browser settings at any time. Removing the consent cookie causes the notice to return on a later page load so you can choose again.',
      'Most browsers let you view, block, or delete cookies for a particular site. Blocking all cookies may cause the website to ask for your choice again because it cannot remember your response, but the main content remains available.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to cookie use',
    paragraphs: [
      'If Burgama introduces a nonessential analytics, advertising, or similar technology that requires consent, we will update this policy and provide a new notice or choice before activating it where required. The current version and last-updated date appear on this page.',
    ],
  },
]

export default function CookiesPage() {
  return <LegalPage title="Cookie policy" current="cookies" introduction="A plain-language guide to the small number of cookies Burgama uses, why they exist, and the choices you control." sections={sections} updated={{ iso: '2026-11-11', label: 'November 11, 2026' }} />
}
