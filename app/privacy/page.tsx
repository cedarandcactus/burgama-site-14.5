import type { Metadata, Viewport } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Privacy — Draft',
  description: 'Draft privacy policy for the Burgama website, pending review.',
  robots: { index: false, follow: true },
}

export const viewport: Viewport = { themeColor: '#afc8f2', colorScheme: 'light' }

const sections = [
  {
    id: 'scope',
    title: 'what this covers',
    paragraphs: [
      'This proposed policy describes how Burgama handles personal information connected with this website and inquiries sent to the studio. A separate agreement or notice may apply to client projects.',
    ],
  },
  {
    id: 'information',
    title: 'information you share',
    paragraphs: [
      'When you email Burgama, you may provide your name, email address, company, project details, and any other information included in your message. The contact links on this website open your email application; they do not submit a website form.',
      'Please share only what is needed to discuss your inquiry, and avoid sending sensitive personal information or confidential materials before agreeing on an appropriate way to exchange them.',
    ],
  },
  {
    id: 'website-data',
    title: 'website data & analytics',
    paragraphs: [
      'The production website includes Vercel Web Analytics to help understand site usage. Hosting and delivery services may also process technical information such as IP addresses, browser details, request times, and requested pages to operate and protect the site.',
      'Before this policy is adopted, confirm the live analytics configuration, any cookies or similar technologies, embedded services, and consent requirements. Update this section to describe the tools actually used.',
    ],
  },
  {
    id: 'use-and-sharing',
    title: 'how information is used',
    paragraphs: [
      'Proposed uses include responding to inquiries, discussing and delivering agreed services, maintaining business records, improving the website, and addressing security or legal obligations.',
      'Information may be processed by service providers supporting website hosting, analytics, email, and business operations, or disclosed where required by law. Confirm the providers, processing locations, and any other sharing before adopting this policy.',
    ],
  },
  {
    id: 'retention',
    title: 'retention & security',
    paragraphs: [
      'The proposed approach is to retain personal information only for as long as needed for the purpose it was collected, applicable recordkeeping requirements, or resolving disputes. Specific retention periods and deletion procedures need to be confirmed before adoption.',
      'Appropriate safeguards should be used to protect personal information. No method of transmission or storage can be guaranteed completely secure.',
    ],
  },
  {
    id: 'choices',
    title: 'your choices',
    paragraphs: [
      'Depending on your location and applicable law, you may have rights to access, correct, delete, or obtain a copy of personal information, or to object to or restrict certain processing. Contact the studio to ask about your information or submit a request.',
      'The final policy should confirm applicable rights, identity-verification procedures, response deadlines, appeal options, and any regulator contact information required by law.',
    ],
  },
  {
    id: 'updates',
    title: 'policy updates',
    paragraphs: [
      'An effective date will be added when this policy is reviewed and adopted. Material changes should be reflected here and communicated where required by applicable law.',
    ],
  },
]

export default function PrivacyPage() {
  return <LegalPage title="privacy policy" current="privacy" introduction="A draft overview of how information is handled when you visit the site or get in touch." sections={sections} />
}
