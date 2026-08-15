import Link from 'next/link'
import type { Project } from '@/lib/projects'

/**
 * Deterministic bar field for the barcode band. A tiny LCG keeps the server and
 * client render identical without shipping any randomness to the browser.
 */
function buildBars(seed: number, count: number) {
  let state = seed
  const random = () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }

  return Array.from({ length: count }, (_, index) => {
    const roll = random()
    return {
      x: (index + 0.5) * (1200 / count) + (random() - 0.5) * 5,
      width: roll < 0.14 ? 1.5 : roll < 0.4 ? 3 : roll < 0.86 ? 5.5 : 8,
      accent: random() > 0.94,
      lean: random() > 0.96 ? (random() - 0.5) * 90 : 0,
      trim: random() * 0.14,
    }
  })
}

function BarcodeRow({ seed, count, delay }: { seed: number; count: number; delay: number }) {
  const bars = buildBars(seed, count)

  return (
    <svg
      className="ed-barcode-row"
      viewBox="0 0 1200 240"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {bars.map((bar, index) => (
        <line
          key={index}
          className={bar.accent ? 'ed-bar ed-bar-accent' : 'ed-bar'}
          x1={bar.x}
          y1={240 * bar.trim}
          x2={bar.x + bar.lean}
          y2={240}
          strokeWidth={bar.width}
          style={{ animationDelay: `${delay + index * 14}ms` }}
        />
      ))}
    </svg>
  )
}

export function HomeEditorial({ projects }: { projects: Project[] }) {
  const work = projects.slice(0, 5)

  return (
    <div className="ed-page">
      <p className="ed-strip">
        <Link href="/contact">
          Burgama is booking new brand and web engagements for this quarter.
        </Link>
      </p>

      <section className="ed-hero" aria-labelledby="ed-hero-title">
        <h1 id="ed-hero-title" className="ed-display">
          Identity systems made for what comes next
        </h1>

        <p className="ed-lede">
          Burgama is a design-led studio in Austin, Texas. We build identities, sites and
          campaigns that can move, change and stay recognizable — a point of view first, then
          the system that carries it.
        </p>

        <div className="ed-actions">
          <Link href="/work" className="ed-button ed-button-solid">
            See the work
          </Link>
          <Link href="/contact" className="ed-button ed-button-quiet">
            Start a project
          </Link>
        </div>
      </section>

      <figure className="ed-barcode">
        <BarcodeRow seed={20460019} count={48} delay={0} />
        <BarcodeRow seed={78341902} count={54} delay={220} />
        <figcaption className="sr-only">
          A generative field of vertical rules standing in for the studio&apos;s systems work.
        </figcaption>
      </figure>

      <section className="ed-work" aria-labelledby="ed-work-title">
        <div className="ed-work-head">
          <p className="ed-label">Selected work</p>
          <h2 id="ed-work-title" className="ed-work-title">
            Six years of systems, campaigns and launches
          </h2>
        </div>

        <ul className="ed-list">
          {work.map((project) => (
            <li key={project.slug} className="ed-row">
              <Link href={`/work/${project.slug}`} className="ed-row-link">
                <span className="ed-row-name">{project.client}</span>
                <span className="ed-row-meta">{project.disciplines.join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/work" className="ed-button ed-button-quiet ed-work-cta">
          All work
        </Link>
      </section>
    </div>
  )
}
