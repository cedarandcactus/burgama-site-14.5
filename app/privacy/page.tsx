import type { Metadata, Viewport } from 'next'
import { LegalPage } from '@/components/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Burgama handles website information, project enquiries, analytics, and privacy requests, including your choices and contact details.',
}

export const viewport: Viewport = { themeColor: '#afc8f2', colorScheme: 'light' }

const sections = [
  {
    id: 'scope',
    title: 'What this policy covers',
    paragraphs: [
      'This Privacy Policy explains how Burgama (“we,” “us,” or “our”) handles personal information when you visit our website, use its enquiry tools, or communicate with the studio. Burgama is based in Austin, Texas, and is responsible for the information it handles for these purposes.',
      'A separate contract, confidentiality agreement, or data-processing agreement may apply to information handled as part of a client project. This policy does not replace those agreements or cover websites and services operated by other organizations.',
    ],
  },
  {
    id: 'information',
    title: 'Information you provide',
    paragraphs: [
      'When you contact us by email, telephone, or another communication channel, we receive the information you choose to share. This may include your name, email address, telephone number, company or company type, project description, budget range and currency, attachments, and correspondence with us.',
      'When you complete our project enquiry form and choose to send it, the details you entered are transmitted to Burgama through our website and delivered to us by email. Those details are not saved in a website database; they reach us as an email message. If sending is unavailable, the form instead offers to open a draft in your own email application or to copy the message, in which case Burgama receives it only if you send it yourself.',
      'If you choose “copy enquiry,” the prepared message is written to your device’s clipboard. Your browser, operating system, clipboard settings, and email provider govern how they handle that information. The website does not save enquiry details in local storage or cookies.',
      'The newsletter signup shown on the site subscribes you to our updates. Your email address is sent to our email marketing provider and added to our subscriber list, along with a record of your consent and where it was given. You can unsubscribe at any time using the link in any update we send, or by contacting us.',
      'Please provide only information needed for your enquiry and only information you are authorized to share. Do not send passwords, payment-card details, government identification numbers, sensitive personal information, or confidential client materials unless we have agreed on an appropriate way to exchange them.',
    ],
  },
  {
    id: 'website-data',
    title: 'Website data & analytics',
    paragraphs: [
      'The website is hosted on Vercel. Hosting and delivery infrastructure may process technical information such as your IP address, browser and device details, request times, requested URLs, and diagnostic or security logs to deliver pages, troubleshoot issues, and protect the service.',
      'The production website includes Vercel Web Analytics to understand website usage through aggregated statistics. Analytics data may include pages visited, referring websites, filtered URL parameters, visit times, approximate location, device type, operating system, and browser. We do not configure enquiry fields or newsletter email addresses as analytics events.',
      'Vercel describes its Web Analytics as using a request-derived identifier rather than tracking cookies, with visitor identifiers discarded after 24 hours. This identifier lifetime is separate from the retention of aggregated statistics or hosting logs. The analytics service is not designed to track an individual’s browsing across unrelated websites.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & tracking choices',
    paragraphs: [
      'The website uses a necessary first-party cookie for 30 days to remember whether you accepted optional cookies or chose only necessary storage. If you accept, a second first-party preference cookie remembers the homepage introduction shown to you for 30 days. It contains only a number from 0 to 2 and is removed when you choose only necessary. Neither cookie stores enquiry details, newsletter entries, or an advertising identifier.',
      'Vercel Web Analytics does not rely on tracking cookies. You can manage or delete cookies through your browser settings; deleting the consent cookie causes the choice notice to return. Our Cookie Policy describes each cookie, its purpose, duration, and attributes in more detail.',
      'We do not use information from this website for targeted advertising or cross-context behavioral advertising, and we do not sell personal information collected through this website. If we introduce nonessential technology that requires consent, we will update our notice and provide the required choice before activating it. The website does not perform automated decisions or profiling that produce legal or similarly significant effects on visitors.',
    ],
  },
  {
    id: 'use-and-sharing',
    title: 'How we use information',
    paragraphs: [
      'We use information to respond to enquiries, evaluate potential projects, communicate with you, prepare proposals, and administer agreed services. We also use it to maintain relevant business records, improve the website, investigate technical or security issues, prevent misuse, and meet legal obligations.',
      'We do not treat a project enquiry or acceptance of our Terms of Service as permission to subscribe you to marketing. If you separately request marketing communications, you can opt out using any unsubscribe instructions provided or by contacting us. Necessary replies and service-related communications may continue.',
      'Where applicable data-protection law requires a legal basis, we process information as needed to take steps at your request before a contract or to perform a contract, comply with legal obligations, pursue legitimate interests such as responding to business enquiries and securing the website where your rights do not override those interests, or act on your consent where required. You may withdraw consent without affecting processing that was lawful before withdrawal.',
    ],
  },
  {
    id: 'disclosures',
    title: 'When information is shared',
    paragraphs: [
      'Information may be handled by service providers supporting website hosting and analytics, email and communications, and business administration, where needed for those purposes. Vercel provides hosting and web analytics. Resend delivers project enquiries submitted through the website to us by email. Klaviyo stores our newsletter subscriber list and sends our updates. Information you choose to send by email also passes through the email services used by you and Burgama.',
      'We may disclose information to professional advisers when necessary, to comply with a legal obligation or lawful request, to establish or defend legal claims, or to protect rights, safety, and security. If a business reorganization or transfer involves personal information, that information may be reviewed or transferred subject to appropriate confidentiality protections and applicable law.',
      'We may also share information when you specifically ask us to do so or give permission. We do not authorize service providers to use enquiry information for their own unrelated marketing.',
    ],
  },
  {
    id: 'retention',
    title: 'Retention & security',
    paragraphs: [
      'We retain personal information for as long as reasonably necessary for the purpose for which it was received, including following up on enquiries, managing an ongoing relationship, complying with legal and recordkeeping obligations, and resolving disputes. The period depends on the type of information, the nature of the relationship, and applicable requirements; there is no single retention period for all records.',
      'When information is no longer needed, we delete it or de-identify it, subject to applicable legal obligations and ordinary backup cycles. Details entered into the current website’s enquiry and newsletter interfaces are not retained by Burgama unless you send them through a separate communication channel.',
      'We use reasonable administrative, technical, and organizational measures appropriate to the information we handle. No website, email service, transmission method, or storage system can be guaranteed completely secure. Contact us promptly if you believe information shared with Burgama has been compromised.',
    ],
  },
  {
    id: 'international',
    title: 'International visitors',
    paragraphs: [
      'Burgama operates in the United States. Information may be processed in the United States or other countries where our service providers operate, whose privacy laws may differ from those where you live. Where applicable law requires safeguards for an international transfer, we use the legally required transfer arrangements and protections. Contact us for information about safeguards relevant to your information.',
    ],
  },
  {
    id: 'choices',
    title: 'Your privacy rights & requests',
    paragraphs: [
      'Depending on where you live, the law that applies, and any relevant exemptions, you may have rights to know whether we process your personal information; access, correct, or delete it; receive a portable copy; object to or restrict processing; withdraw consent; or opt out of sale, targeted advertising, or certain profiling. Not every right applies in every situation. We do not sell website personal information or use it for targeted advertising or significant-effect profiling.',
      'To ask a question or exercise a right, email legal@burgama.com with the subject “Privacy request” and describe your request. We may ask for information reasonably necessary to verify your identity and authority, and we will use verification information for that purpose. An authorized agent may submit a request where applicable law permits, subject to verification of their authority.',
      'We respond within the time required by applicable law and explain any extension or denial where required. If you are entitled to appeal a decision, reply to our response or email legal@burgama.com with the subject “Privacy appeal.” We will review the appeal and provide the outcome and any further options required by law.',
      'You may also have the right to complain to your state attorney general or relevant data-protection authority. Exercising applicable privacy rights will not result in unlawful discrimination. We may retain or withhold information where a legal obligation, protected interest, or applicable exception requires or permits it.',
    ],
  },
  {
    id: 'children',
    title: 'Children’s privacy',
    paragraphs: [
      'The website is intended for businesses and people seeking professional services, not children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided information to us, contact legal@burgama.com so we can investigate and take appropriate steps to delete it.',
    ],
  },
  {
    id: 'external-services',
    title: 'External websites & services',
    paragraphs: [
      'Links to client sites, social platforms, articles, and other third-party services take you outside this website. Those services have their own privacy policies, and Burgama does not control their information practices. Review their policies before sharing information with them.',
    ],
  },
  {
    id: 'updates',
    title: 'Changes to this policy',
    paragraphs: [
      'We may update this policy when our website, information practices, or legal obligations change. The current version and its last-updated date will appear on this page. For material changes, we will provide additional notice or obtain consent where required by applicable law. Changes do not remove rights you already have under applicable law.',
    ],
  },
]

export default function PrivacyPage() {
  return <LegalPage title="Privacy policy" current="privacy" introduction="How Burgama handles your information when you visit the website or get in touch, and the choices available to you." sections={sections} />
}
