import type { CSSProperties } from 'react'
import type { ContentModule, MediaItem, ProjectStat } from '@/lib/projects'
import { ParallaxImage } from '@/components/parallax-image'
import { RevealHeading } from '@/components/reveal-heading'

const sentenceCase = (value: string) => value ? `${value[0].toUpperCase()}${value.slice(1)}` : value
export const isWebsiteMedia = (item: MediaItem) => /\/web-/.test(item.src ?? '') || /\b(website|homepage|online store|site)\b/i.test(item.label)

export function ProjectImage({ item, priority = false, sizes, strength = 3 }: { item: MediaItem; priority?: boolean; sizes?: string; strength?: number }) {
  if (!item.src) return null
  return <ParallaxImage src={item.src} alt={item.label} priority={priority} sizes={sizes} strength={strength} />
}

export function MediaFrame({ item, priority = false, index = 0, sizes, strength = 3 }: { item: MediaItem; priority?: boolean; index?: number; sizes?: string; strength?: number }) {
  if (!item.src) return null
  return <figure className="cs-figure" data-media-kind={isWebsiteMedia(item) ? 'screen' : 'image'}>
    <div className="cs-frame" data-media-ratio={item.ratio} data-cs-reveal="media" data-cs-index={index} style={{ '--media-aspect': (item.width ?? 1200) / (item.height ?? 800), '--media-source-width': `${item.width ?? 1200}px` } as CSSProperties}>
      <ProjectImage item={item} priority={priority} sizes={sizes} strength={strength} />
    </div>
    {item.caption && <figcaption>{item.caption}</figcaption>}
  </figure>
}

export function mediaGroups(items: MediaItem[]) {
  const pictures = items.filter(item => item.src && !isWebsiteMedia(item))
  const screens = items.filter(item => item.src && isWebsiteMedia(item))
  const groups: { layout: 'single' | 'pair' | 'trio' | 'site'; items: MediaItem[] }[] = []
  let preferPair = true
  while (pictures.length) {
    const count = pictures.length <= 3 ? pictures.length : pictures.length === 4 && groups.length === 0 ? 2 : preferPair ? 2 : 3
    groups.push({ layout: count === 1 ? 'single' : count === 2 ? 'pair' : 'trio', items: pictures.splice(0, count) })
    preferPair = !preferPair
  }
  screens.forEach(item => groups.push({ layout: 'site', items: [item] }))
  return groups
}

export function MediaLayouts({ items, priority = false }: { items: MediaItem[]; priority?: boolean }) {
  return <>{mediaGroups(items).map((group, index) => <div key={`${group.items[0].src}-${index}`} className="cs-media" data-layout={group.layout} data-media-kind={group.layout === 'site' ? 'screen' : 'image'} data-media-ratio={group.items[0].ratio}>
    {group.layout === 'site' ? <div className="cs-panel"><MediaFrame item={group.items[0]} priority={priority} /></div> : group.items.map((item, itemIndex) => <MediaFrame key={item.src} item={item} priority={priority} index={itemIndex} strength={group.layout === 'single' ? 3 : 1.5} sizes={group.layout === 'single' ? undefined : '(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 600px'} />)}
  </div>)}</>
}

export function StatRow({ stats, source }: { stats: ProjectStat[]; source?: string }) {
  return <div className="cs-results">
    <div className="cs-stats" role="list">
      {stats.map(stat => <div className="cs-stat" role="listitem" key={stat.label}>
        <span className="cs-stat__value font-serif" role="img" aria-label={stat.accessibleValue ?? stat.value} data-cs-reveal="stat" data-value={stat.value}><span aria-hidden="true">{stat.value}</span></span>
        <span className="cs-stat__label">{stat.label}</span>
      </div>)}
    </div>
    {source && <p className="cs-source">Source: {source}</p>}
  </div>
}

type Section = { module?: ContentModule; items: MediaItem[] }
export function groupSections(modules: ContentModule[]): Section[] {
  const sections: Section[] = []
  for (const module of modules) {
    if (module.type === 'media' || module.type === 'mediaPair' || module.type === 'mediaGrid') {
      if (!sections.length) sections.push({ items: [] })
      sections[sections.length - 1].items.push(...(module.type === 'media' ? [module.item] : module.items))
    } else {
      sections.push({ module, items: module.type === 'mediaSplit' ? [module.item] : [] })
    }
  }
  return sections
}

function withCaption(item: MediaItem, slug: string): MediaItem {
  if (slug === 'wagner-wealth' && /a09[45]\.jpg/.test(item.src ?? '')) return { ...item, caption: 'Concept mockups' }
  if (slug === 'harvest-dating' && item.src?.includes('pdf-6-10')) return { ...item, caption: 'App icon concept' }
  if (/^(Before|After):/.test(item.label)) return { ...item, caption: item.label.split(':')[0] }
  return item
}

export function ProjectModules({ modules, slug }: { modules: ContentModule[]; slug: string }) {
  return <>{groupSections(modules).map(({ module, items }, index) => <section className="cs-section" data-case-module={module?.type ?? 'media'} key={index}>
    {module && 'title' in module && module.title && <RevealHeading className="cs-section__title font-serif" text={sentenceCase(module.title)} />}
    {module && (module.type === 'text' || module.type === 'mediaSplit') && <div className="cs-section__body" data-cs-reveal="body">{module.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>}
    {module?.type === 'quote' && <figure className="cs-quote" data-cs-reveal="body"><blockquote>{module.body}</blockquote>{module.name && <figcaption>{module.name}{module.role ? `, ${module.role}` : ''}</figcaption>}</figure>}
    {module?.type === 'video' && <>
      {module.body && <div className="cs-section__body" data-cs-reveal="body">{module.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>}
      <div className="cs-media cs-video" data-orientation={(module.aspect ?? 16 / 9) < 1 ? 'portrait' : 'landscape'} data-cs-reveal="media" style={{ '--video-aspect': module.aspect ?? 16 / 9 } as CSSProperties}>
        <iframe src={module.vimeoId ? `https://player.vimeo.com/video/${module.vimeoId}?dnt=1&title=0&byline=0&portrait=0` : module.driveId ? `https://drive.google.com/file/d/${module.driveId}/preview` : `https://www.instagram.com/reel/${module.instagramId}/embed/`} title={module.label} loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    </>}
    {module?.type === 'process' && <ol className="cs-process">{module.steps.map(step => <li key={step.title}><h3>{sentenceCase(step.title)}</h3><p>{step.body}</p></li>)}</ol>}
    <MediaLayouts items={items.map(item => withCaption(item, slug))} />
    {module?.type === 'text' && module.stats && <StatRow stats={module.stats} source={module.source} />}
  </section>)}</>
}
