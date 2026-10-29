import { createElement } from 'react'

export const siteUrl = 'https://www.burgama.com'
export const siteName = 'Burgama'
export const defaultSocialImage = `${siteUrl}/images/burgama-social-share.png`

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}

export function jsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

// Name, address and phone must match the Google Business Profile exactly.
export const businessContact = {
  telephone: '+1-713-724-3637',
  telephoneDisplay: '(713) 724-3637',
  streetAddress: '701 Tillery St #12, Mailbox #289',
  addressLocality: 'Austin',
  addressRegion: 'TX',
  postalCode: '78702',
  addressCountry: 'US',
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  url: `${siteUrl}/`,
  description:
    'Independent creative and marketing studio in Austin, TX, working across brand identity, websites, packaging, content, campaigns, and search.',
  email: 'hello@burgama.com',
  telephone: businessContact.telephone,
  image: defaultSocialImage,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/burgama-symbol.svg`,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: businessContact.streetAddress,
    addressLocality: businessContact.addressLocality,
    addressRegion: businessContact.addressRegion,
    postalCode: businessContact.postalCode,
    addressCountry: businessContact.addressCountry,
  },
  areaServed: [
    { '@type': 'City', name: 'Austin', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'State', name: 'Texas' },
  ],
  knowsAbout: [
    'Brand identity',
    'Website design',
    'Packaging design',
    'Search engine optimization',
    'Local SEO',
    'Social media marketing',
    'Email marketing',
    'Video production',
  ],
  sameAs: [
    'https://www.instagram.com/byburgama/',
    'https://www.tiktok.com/@byburgama',
    'https://www.linkedin.com/company/burgama/',
  ],
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: siteName,
  alternateName: 'burgama.com',
  publisher: { '@id': `${siteUrl}/#organization` },
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function primaryImageUrl(src?: string) {
  return src ? absoluteUrl(src) : defaultSocialImage
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: jsonLd(data) },
  })
}
