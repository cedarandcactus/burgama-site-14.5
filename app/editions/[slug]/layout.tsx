import type { Viewport } from 'next'
import { Archivo, Source_Serif_4 } from 'next/font/google'
import { getIdea } from '@/lib/editorial'
import { getEditorialDirection } from '@/lib/editorial-layouts'

const editorialSerif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], display: 'swap', variable: '--font-editorial-serif' })
const editorialSans = Archivo({ subsets: ['latin'], axes: ['wdth'], display: 'swap', variable: '--font-editorial-sans' })

export async function generateViewport({ params }: { params: Promise<{ slug: string }> }): Promise<Viewport> {
  const { slug } = await params
  const idea = getIdea(slug)
  const technical = idea && getEditorialDirection(idea).style === 'technical'
  return { themeColor: technical ? '#011329' : '#f0f0eb', colorScheme: technical ? 'dark' : 'light' }
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${editorialSerif.variable} ${editorialSans.variable}`}>{children}</div>
}
