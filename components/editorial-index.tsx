import Link from '@/components/transition-link'
import { EditorialArtwork } from '@/components/editorial-artwork'
import { SiteFooter } from '@/components/site-footer'
import { getPublishedIdeas } from '@/lib/editorial'
import styles from './editorial.module.css'

export function EditorialIndex() {
  const [featured, ...secondaryIdeas] = getPublishedIdeas()

  return (
    <div className={styles.indexRoot}>
      <main className={styles.indexMain}>
        <header className={styles.indexHero}>
          <p className={styles.eyebrow}>burgama ideas</p>
          <h1 className="font-serif text-balance">Ideas, methods, and things worth a second look.</h1>
          <p className={styles.indexIntroduction}>Notes on making brands, digital experiences, and cultural work more useful—and more difficult to forget.</p>
        </header>

        <section className={styles.publication} aria-label="Latest ideas">
          <Link href={`/ideas/${featured.slug}`} className={styles.featureLink}>
            <EditorialArtwork visual={featured.visual} className={styles.featureArtwork} />
            <div className={styles.featureCopy}>
              <div className={styles.articleMeta}><span>{featured.category}</span><span>{featured.meta}</span></div>
              <div>
                <h2 className="font-serif text-balance">{featured.title}</h2>
                <p>{featured.dek}</p>
              </div>
              <span className={styles.readAction}>Read the essay <span aria-hidden="true">↗</span></span>
            </div>
          </Link>

          <div className={styles.secondaryGrid}>
            {secondaryIdeas.map(idea => (
              <Link key={idea.slug} href={`/ideas/${idea.slug}`} className={styles.secondaryLink}>
                <EditorialArtwork visual={idea.visual} className={styles.secondaryArtwork} />
                <div className={styles.secondaryCopy}>
                  <div className={styles.articleMeta}><span>{idea.category}</span><span>{idea.meta}</span></div>
                  <h2 className="font-serif text-balance">{idea.title}</h2>
                  <p>{idea.dek}</p>
                  <span className={styles.readAction}>Read <span aria-hidden="true">↗</span></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
