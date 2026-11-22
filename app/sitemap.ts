import type { MetadataRoute } from 'next'
import { ideas } from '@/lib/editorial'
import { getPublishedProjects } from '@/lib/projects'
import { services } from '@/lib/services'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['/', '/work', '/services', '/studio', '/research', '/faq', '/ai-visibility-check', '/tiktok-shop', '/roas-calculator'].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.8,
  }))

  const servicePages = services.map((service) => ({
    url: absoluteUrl(`/services/${service.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const projectPages = getPublishedProjects().map((project) => ({
    url: absoluteUrl(`/work/${project.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const researchPages = ideas.map((idea) => ({
    url: absoluteUrl(`/research/${idea.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...projectPages, ...researchPages]
}
