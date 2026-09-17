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

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  url: `${siteUrl}/`,
  description:
    'Independent creative and marketing studio working across brand identity, websites, packaging, content, campaigns, and search.',
  email: 'hello@burgama.com',
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/burgama-symbol.svg`,
  },
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
