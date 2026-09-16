import { Reveal } from '@/components/reveal'
import { type ContentModule, type MediaItem } from '@/lib/projects'

function sentenceCase(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value
}

export function MediaFrame({
  item,
  className = '',
  priority = false,
}: {
  item: MediaItem
  className?: string
  priority?: boolean
}) {
  if (!item.src) return null
  const intrinsicAspectRatio = item.width && item.height
    ? `${item.width} / ${item.height}`
    : 'auto'

  return (
    <figure className={`case-media ${className}`}>
      <div className="case-media-frame" data-media-ratio={item.ratio} style={{ aspectRatio: intrinsicAspectRatio }}>
        <img
          src={item.src}
          alt={item.label}
          width={item.width}
          height={item.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </div>
    </figure>
  )
}

export function ProjectModules({ modules }: { modules: ContentModule[] }) {
  return (
    <>
      {modules.map((module, index) => {
        switch (module.type) {
          case 'text':
            /*
              An untitled text module renders as prose with NO heading. It
              previously emitted an empty `<h2>`, which reserved the label
              column and left an unexplained gap beside the paragraph — a
              label existing only because other sections have one.
            */
            return (
              <Reveal key={index} as="section" className="case-module">
                {module.title ? (
                  <h2 className="case-module-title">{sentenceCase(module.title)}</h2>
                ) : null}
                <div className="case-module-body">
                  {module.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            )

          case 'media':
            if (!module.item.src) return null
            return (
              <Reveal key={index}>
                <MediaFrame item={module.item} />
              </Reveal>
            )

          case 'mediaPair': {
            const items = module.items.filter(item => item.src)
            if (items.length === 0) return null
            return (
              <Reveal key={index} className={items.length > 1 ? 'case-media-row' : undefined}>
                {items.map(item => <MediaFrame key={item.src} item={item} />)}
              </Reveal>
            )
          }

          case 'mediaSplit':
            return (
              <Reveal key={index} className={module.item.src ? `case-split case-split-${module.split.replace('/', '-')}` : 'case-module'}>
                <div className="case-split-copy">
                  <h2 className="case-module-title">{sentenceCase(module.title)}</h2>
                  <div className="case-module-body">
                    {module.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
                <MediaFrame item={module.item} />
              </Reveal>
            )

          case 'mediaGrid': {
            const items = module.items.filter(item => item.src)
            if (items.length === 0) return null
            return (
              <Reveal key={index} className={items.length > 2 ? 'case-media-row case-media-row-3' : items.length > 1 ? 'case-media-row' : undefined}>
                {items.map(item => <MediaFrame key={item.src} item={item} />)}
              </Reveal>
            )
          }

          case 'quote':
            return (
              <Reveal key={index}>
                <blockquote className="case-quote">{module.body}</blockquote>
              </Reveal>
            )

          case 'process':
            return (
              <Reveal key={index} as="section" className="case-module">
                <h2 className="case-module-title">{sentenceCase(module.title)}</h2>
                <ol className="case-process">
                  {module.steps.map(step => (
                    <li key={step.title}>
                      <h3>{sentenceCase(step.title)}</h3>
                      <p>{step.body}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )

          default:
            return null
        }
      })}
    </>
  )
}
