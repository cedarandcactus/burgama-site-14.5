import type { Metadata, Viewport } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Terms — Draft',
  description: 'Draft website terms for Burgama, pending review.',
  robots: { index: false, follow: true },
}

export const viewport: Viewport = { themeColor: '#afc8f2', colorScheme: 'light' }

const sections = [
  {
    id: 'scope',
    title: 'about these terms',
    paragraphs: [
      'These proposed terms concern access to and use of the Burgama website. They are a draft for review, are not yet in effect, and do not create an agreement merely by being displayed here.',
      'Before adoption, confirm the legal entity operating the site, the effective date, and the appropriate notice or acceptance process.',
    ],
  },
  {
    id: 'site-use',
    title: 'using the site',
    paragraphs: [
      'The website presents the studio, selected work, and ways to get in touch. The proposed terms permit ordinary browsing and lawful use while prohibiting attempts to disrupt the site, gain unauthorized access, introduce malicious code, or infringe the rights of others.',
    ],
  },
  {
    id: 'ownership',
    title: 'work & intellectual property',
    paragraphs: [
      'Website text, designs, images, branding, and project materials may belong to Burgama, its clients, or other rights holders. Displaying a project does not transfer ownership or grant permission to reproduce, adapt, distribute, or commercially use it.',
      'Except where permitted by applicable law, obtain permission from the relevant rights holder before reusing materials. Client names and marks remain the property of their respective owners.',
    ],
  },
  {
    id: 'services',
    title: 'inquiries & project agreements',
    paragraphs: [
      'Sending an inquiry does not commit either party to a project. Scope, deliverables, schedules, fees, confidentiality, ownership, and other project terms should be set out in a separate written agreement.',
      'These website terms are not intended to replace or amend a signed client agreement. Avoid submitting sensitive or confidential material until suitable arrangements are in place.',
    ],
  },
  {
    id: 'third-parties',
    title: 'external links',
    paragraphs: [
      'The site may link to third-party websites or services. Those destinations have their own terms and privacy practices. A link does not imply ownership, control, or endorsement of all content at that destination.',
    ],
  },
  {
    id: 'availability',
    title: 'information & availability',
    paragraphs: [
      'Site content may change and may not always be complete or current. Confirm any project-specific information directly with the studio. Uninterrupted availability and error-free operation cannot be guaranteed.',
      'Any warranty exclusions or liability limits must be reviewed for applicable law before being added to the final terms. Nothing in this draft is intended to exclude rights or liabilities that cannot lawfully be excluded.',
    ],
  },
  {
    id: 'law-and-updates',
    title: 'review & future updates',
    paragraphs: [
      'Governing law, dispute procedures, and any jurisdiction provisions remain to be determined with legal counsel. No arbitration requirement, venue restriction, or waiver is established by this draft.',
      'An effective date and any required update notices will be added when the terms are approved and adopted.',
    ],
  },
]

export default function TermsPage() {
  return <LegalPage title="terms of use" current="terms" introduction="Draft ground rules for using this website. Client projects are covered by their own agreements." sections={sections} />
}
