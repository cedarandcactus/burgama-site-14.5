import type { Metadata, Viewport } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing use of the Burgama website, including intellectual property, acceptable use, client agreements, and Texas jurisdiction.',
}

export const viewport: Viewport = { themeColor: '#afc8f2', colorScheme: 'light' }

const sections = [
  {
    id: 'scope',
    title: 'Acceptance of terms',
    paragraphs: [
      'These Terms of Service govern your access to and use of the Burgama website. In these terms, “Burgama,” “we,” “us,” and “our” refer to the studio operating this website. By accessing or using the website, you agree to these terms. If you do not agree, please do not use the website.',
      'These terms apply to website visitors and users. Professional marketing, creative, and consulting services are governed by a separate signed client agreement, subcontractor agreement, or statement of work, as applicable. These website terms do not replace or amend that agreement.',
    ],
  },
  {
    id: 'ownership',
    title: 'Intellectual property rights',
    paragraphs: [
      'Unless otherwise stated, the text, graphics, logos, designs, images, case studies, audio, downloads, proprietary frameworks, and other materials on this website are owned by Burgama or used with permission from the relevant rights holders. Client names, trademarks, and project materials remain the property of their respective owners. All rights not expressly granted are reserved.',
      'You may view the website and download or print individual pages for your personal, noncommercial use, provided you keep copyright, trademark, and other ownership notices intact.',
      'Except as permitted by applicable law or with prior written permission from the relevant rights holder, you must not republish, sell, rent, sublicense, reproduce, adapt, distribute, or commercially exploit website materials or proprietary content. Display of a project does not transfer ownership or grant a license to use its branding, designs, or other materials.',
    ],
  },
  {
    id: 'site-use',
    title: 'Acceptable use',
    paragraphs: [
      'Use the website only for lawful purposes and in a way that respects the rights of others. You must not use it for fraudulent, deceptive, abusive, or otherwise unlawful activity; impersonate another person; submit information you are not entitled to share; or infringe intellectual property, privacy, or other legal rights.',
      'You must not introduce malicious software, attempt unauthorized access to the website or its systems, bypass security measures, or interfere with its availability or operation. Automated access that disrupts the website or circumvents access restrictions is prohibited. We may restrict access where reasonably necessary to protect the website, its users, or our legal rights.',
    ],
  },
  {
    id: 'services',
    title: 'Client engagements & case studies',
    paragraphs: [
      'Service descriptions, articles, portfolio examples, and case studies are provided for general information. They are not a binding offer, a promise of results, or advice tailored to your circumstances. Results depend on the project and its circumstances; past performance does not guarantee future outcomes.',
      'An inquiry, selected budget range, or discussion does not create a client relationship or commit either party to a project. Scope, deliverables, schedules, pricing, payment, confidentiality, and ownership are established in a separate finalized written agreement. If that agreement conflicts with these terms on a matter relating to the services, the signed agreement controls.',
      'Only share information you have authority to provide. Avoid sending sensitive personal information, trade secrets, or confidential client materials until we have agreed on suitable confidentiality and delivery arrangements.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & communications',
    paragraphs: [
      'Our Privacy Policy explains how information is handled when you visit the website or contact us. Please read it alongside these terms. Acceptance of these terms does not by itself constitute consent to marketing or waive any privacy rights.',
      'The website’s enquiry tools prepare information for you to copy or send using your email application; entering details or opening an email draft does not mean a message has been delivered. You are responsible for reviewing and sending the message. A project is not confirmed until agreed in writing.',
    ],
  },
  {
    id: 'third-parties',
    title: 'Third-party links',
    paragraphs: [
      'The website may link to third-party websites or services that Burgama does not own or control. Links are provided for convenience or reference and do not imply endorsement. We are not responsible for third-party content, availability, products, or privacy practices. Your use of those services is governed by their own terms and policies.',
    ],
  },
  {
    id: 'availability',
    title: 'Disclaimer of warranties',
    paragraphs: [
      'To the fullest extent permitted by applicable law, the website and its materials are provided “as is” and “as available,” without express or implied warranties, including warranties of merchantability, fitness for a particular purpose, and noninfringement.',
      'We do not guarantee that the website will be uninterrupted, error-free, secure, or free from harmful components, or that its content will always be complete, accurate, or current. We may correct, change, suspend, or remove content or functionality. Nothing in these terms excludes a warranty or protection that cannot lawfully be excluded.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    paragraphs: [
      'To the fullest extent permitted by applicable law, Burgama and its officers, directors, employees, and affiliates will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or loss of profits, revenue, data, goodwill, or business opportunities, arising from your use of or inability to use the website, even if advised that such losses were possible.',
      'Nothing in these terms limits or excludes liability for fraud, intentional misconduct, gross negligence, or any other liability that cannot be limited or excluded under applicable law. Mandatory consumer rights remain unaffected. Liability relating to professional services is governed by the applicable signed agreement.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing law & jurisdiction',
    paragraphs: [
      'These terms are governed by the laws of the State of Texas, without regard to conflict-of-law principles. Subject to any mandatory rights or jurisdiction rules that apply to you, disputes arising out of or relating to these terms or the website will be subject to the exclusive jurisdiction of the state and federal courts located in Travis County, Texas.',
      'This provision does not deprive you of protections or rights to bring a claim in another jurisdiction where applicable law does not permit those rights to be waived.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    paragraphs: [
      'We may update these terms to reflect changes to the website, our practices, or applicable law. The revised version will be posted on this page with an updated date. Changes apply prospectively from that date unless a later effective date is stated, and we will provide additional notice or obtain agreement where required by law.',
      'Please review this page periodically. Your continued use of the website after revised terms take effect constitutes acceptance to the extent permitted by applicable law. If you do not agree to the revised terms, stop using the website.',
    ],
  },
  {
    id: 'general',
    title: 'General provisions',
    paragraphs: [
      'If a provision is found invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law. A failure to enforce a provision does not waive our right to enforce it later. These terms govern website use only and do not supersede a separate signed agreement with Burgama.',
    ],
  },
]

export default function TermsPage() {
  return <LegalPage title="Terms of service" current="terms" introduction="The terms for using the Burgama website. Professional services are covered by separate signed agreements." sections={sections} />
}
