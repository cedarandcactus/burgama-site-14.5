import { AnimatedText } from '@/components/animated-text'
import { type ContentModule, type MediaItem, toneClass } from '@/lib/projects'

const RATIO: Record<MediaItem['ratio'], string> = {
  wide: 'aspect-[3/2]',
  video: 'aspect-video',
  tall: 'aspect-[3/4]',
  square: 'aspect-square',
  full: 'aspect-[16/10]',
}

export function MediaFrame({
  item,
  className = '',
}: {
  item: MediaItem
  className?: string
}) {
  return (
    <figure className={`flex flex-col gap-module ${className}`}>
      <div
        className={`relative w-full overflow-hidden rounded-module ${RATIO[item.ratio]} ${
          toneClass[item.tone ?? 'surface-1']
        } ${item.src?.includes('/wurqly/') ? 'wurqly-media-frame' : ''}`}
      >
        {item.src && item.mediaType === 'video' ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label={item.label}
            className="h-full w-full object-cover"
          />
        ) : item.src ? (
          <img
            src={item.src}
            alt={item.label}
            className={`h-full w-full ${item.src.includes('/wurqly/') ? 'object-contain p-6 md:p-12' : 'object-cover'}`}
          />
        ) : (
          <span className="t-title absolute inset-0 flex items-end p-6" aria-hidden="true">
            {item.label}
          </span>
        )}
      </div>
      <figcaption className="t-ui">{item.label}</figcaption>
    </figure>
  )
}

export function ProjectModules({ modules }: { modules: ContentModule[] }) {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {modules.map((module, index) => {
        switch (module.type) {
          case 'text':
            return (
              <section key={index} className="flex flex-col gap-6 md:flex-row md:gap-module">
                {module.title ? (
                  <h2 className="t-section md:basis-[38%]">{module.title}</h2>
                ) : null}
                <div className="flex flex-col gap-4 md:basis-[58%]">
                  {module.body.map((paragraph) => (
                    <p key={paragraph} className="t-body max-w-[62ch]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )

          case 'media':
            return <MediaFrame key={index} item={module.item} />

          case 'mediaPair':
            return (
              <div key={index} className="flex flex-col gap-module md:flex-row">
                <MediaFrame item={module.items[0]} className="md:basis-[56%]" />
                <MediaFrame item={module.items[1]} className="md:basis-[44%]" />
              </div>
            )

          case 'mediaSplit': {
            const textFirst = module.split === '60/40'
            return (
              <div
                key={index}
                className={`flex flex-col gap-module md:flex-row ${
                  textFirst ? '' : 'md:flex-row-reverse'
                }`}
              >
                <div
                  className="flex flex-col justify-end gap-5 rounded-module bg-surface-1 p-6 md:p-8"
                  style={{ flexBasis: textFirst ? '58%' : '42%' }}
                >
                  <h2 className="t-section">{module.title}</h2>
                  {module.body.map((paragraph) => (
                    <p key={paragraph} className="t-body max-w-[52ch]">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <MediaFrame
                  item={module.item}
                  className={textFirst ? 'md:basis-[42%]' : 'md:basis-[58%]'}
                />
              </div>
            )
          }

          case 'mediaGrid':
            return (
              <div key={index} className="flex flex-col gap-module md:flex-row">
                {module.items.map((item, itemIndex) => (
                  <MediaFrame
                    key={item.label}
                    item={item}
                    className={itemIndex === 0 ? 'md:basis-[40%]' : 'md:basis-[30%]'}
                  />
                ))}
              </div>
            )

          case 'quote':
            return (
              <AnimatedText
                key={index}
                as="blockquote"
                lines={[module.body]}
                className="t-title max-w-[24ch] rounded-module bg-surface-2 p-6 md:p-10"
              />
            )

          case 'process':
            return (
              <section key={index} className="flex flex-col gap-module">
                <h2 className="t-section">{module.title}</h2>
                <div className="flex flex-col gap-module md:flex-row">
                  {module.steps.map((step, stepIndex) => (
                    <div
                      key={step.title}
                      className="flex flex-col gap-3 rounded-module bg-surface-1 p-6"
                      style={{
                        flexBasis:
                          stepIndex === 0 ? '38%' : stepIndex === 1 ? '32%' : '30%',
                      }}
                    >
                      <h3 className="text-xl leading-none">{step.title}</h3>
                      <p className="t-body">{step.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
