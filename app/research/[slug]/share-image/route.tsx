import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getIdea, ideas } from '@/lib/editorial'
import { getEditorialDirection } from '@/lib/editorial-layouts'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export function generateStaticParams() {
  return ideas.map(idea => ({ slug: idea.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idea = getIdea(slug)
  if (!idea) return new Response('Not found', { status: 404 })
  const [displayFont, bodyFont] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/cenura.otf')),
    readFile(join(process.cwd(), 'public/fonts/pangram-medium.otf')),
  ])
  const direction = getEditorialDirection(idea)
  const ink = '#001328'
  const paper = '#dce3f3'

  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '48px 64px', background: paper, color: ink, fontFamily: 'Pangram' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${ink}`, paddingBottom: 24 }}>
        <span style={{ fontFamily: 'Cenura', fontSize: 44 }}>burgama</span>
        <span style={{ fontSize: 22 }}>Research / {direction.format}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <span style={{ fontSize: 22 }}>{idea.categories[0]}</span>
        <span style={{ fontFamily: 'Cenura', fontSize: idea.title.length > 72 ? 64 : 76, lineHeight: 1.08, letterSpacing: '-2px' }}>{idea.title}</span>
      </div>
      <span style={{ fontSize: 20 }}>burgama.com/research</span>
    </div>,
    { width: 1200, height: 630, fonts: [
      { name: 'Cenura', data: displayFont, weight: 400, style: 'normal' },
      { name: 'Pangram', data: bodyFont, weight: 500, style: 'normal' },
    ] },
  )
}
