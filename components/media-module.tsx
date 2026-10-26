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
    <figure className={`case-media ${className}`} data-media-kind={item.src.includes('/web-') ? 'screen' : item.src.includes('/film-') ? 'still' : item.width && item.height && item.height > item.width * 1.3 ? 'document' : 'image'}>
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

export function FilmFrame({ item, href, title }: { item: MediaItem; href: string; title: string }) {
  if (!item.src) return null
  const intrinsicAspectRatio = item.width && item.height ? `${item.width} / ${item.height}` : '16 / 9'

  return (
    <figure className="case-media case-film" data-media-kind="still">
      <div className="case-media-frame" data-media-ratio={item.ratio} style={{ aspectRatio: intrinsicAspectRatio }}>
        <a
          href={href}
          className="case-film-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch the ${title} on Google Drive (opens in a new tab)`}
        >
          <img
            src={item.src}
            alt={item.label}
            width={item.width}
            height={item.height}
            loading="lazy"
            decoding="async"
          />
          <span className="case-film-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M8.5 5.6v12.8a.6.6 0 0 0 .92.5l10.1-6.4a.6.6 0 0 0 0-1L9.42 5.1a.6.6 0 0 0-.92.5Z" fill="currentColor" />
            </svg>
          </span>
          <span className="case-film-caption" aria-hidden="true">
            <span>Production</span>
          </span>
        </a>
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
              <div key={index} className="case-module" data-case-module={module.type}>
                {module.title ? (
                  <h2 className="case-module-title">{sentenceCase(module.title)}</h2>
                ) : null}
                {module.body.length > 0 && (
                  <div className="case-module-body">
                    {module.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            )

          case 'media':
            if (!module.item.src) return null
            return (
              <div key={index} data-case-module={module.type}>
                <MediaFrame item={module.item} />
              </div>
            )

          case 'film':
            if (!module.item.src) return null
            return (
              <div key={index} data-case-module={module.type}>
                <FilmFrame item={module.item} href={module.href} title={module.title} />
              </div>
            )

          case 'mediaPair': {
            const items = module.items.filter(item => item.src)
            if (items.length === 0) return null
            return (
              <div key={index} data-case-module={module.type} className={items.length > 1 ? 'case-media-row' : undefined}>
                {items.map(item => <MediaFrame key={item.src} item={item} />)}
              </div>
            )
          }

          case 'mediaSplit':
            return (
              <div key={index} data-case-module={module.type} className={module.item.src ? `case-split case-split-${module.split.replace('/', '-')}` : 'case-module'}>
                <div className="case-split-copy">
                  <h2 className="case-module-title">{sentenceCase(module.title)}</h2>
                  <div className="case-module-body">
                    {module.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
                <MediaFrame item={module.item} />
              </div>
            )

          case 'mediaGrid': {
            const items = module.items.filter(item => item.src)
            if (items.length === 0) return null
            return (
              <div key={index} data-case-module={module.type} className={items.length > 2 ? 'case-media-row case-media-row-3' : items.length > 1 ? 'case-media-row' : undefined}>
                {items.map(item => <MediaFrame key={item.src} item={item} />)}
              </div>
            )
          }

          case 'quote':
            return (
              <div key={index} data-case-module={module.type}>
                <blockquote className="case-quote">{module.body}</blockquote>
              </div>
            )

          case 'process':
            return (
              <div key={index} className="case-module" data-case-module={module.type}>
                <h2 className="case-module-title">{sentenceCase(module.title)}</h2>
                <ol className="case-process">
                  {module.steps.map(step => (
                    <li key={step.title}>
                      <h3>{sentenceCase(step.title)}</h3>
                      <p>{step.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )

          default:
            return null
        }
      })}
    </>
  )
}
