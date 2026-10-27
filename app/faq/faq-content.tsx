import { SectionRise } from '@/components/home/section-rise'
import { ModularButton } from '@/components/modular-button'
import { PageHero } from '@/components/page-hero'
import { SiteFooter } from '@/components/site-footer'
import { faqEntries, faqSections, faqServices, formatServicePrice } from '@/lib/faq-content'
import { FaqAccordion } from './faq-accordion'
import styles from './faq.module.css'

export function FaqContent() {
  return (
    <div className={`studio-page ${styles.page} font-sans`} data-nav-surface="ink">
      <PageHero
        variant="centered"
        wordmark="Good questions. Clear answers."
        titleId="faq-title"
        surface="navy"
        nextSurface="navy"
        intro={['The studio, the process, and what it costs to work together.']}
        actions={<><ModularButton href="#questions">explore the FAQ</ModularButton><ModularButton href="#packages">see packages</ModularButton></>}
      />
      <div className={styles.content}>
        <nav id="questions" className={styles.sectionNav} aria-label="FAQ topics">
          {faqSections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
          <a href="#packages">Packages &amp; pricing</a>
        </nav>
        {faqSections.map(section => (
          <section key={section.id} className={styles.faqSection} aria-labelledby={section.id}>
            <div className={styles.sectionHeading}>
              <h2 id={section.id} className="font-serif">{section.title}</h2>
            </div>
            <div className={styles.accordion}>
              {faqEntries.filter(entry => entry.section === section.id).map(entry => (
                <FaqAccordion key={entry.id} question={entry.question}>
                  <p>{entry.answer}</p>
                </FaqAccordion>
              ))}
            </div>
          </section>
        ))}
        <section className={styles.packagesSection} aria-labelledby="packages">
          <div className={styles.packagesHeading}>
            <h2 id="packages" className="font-serif">A starting point.</h2>
            <p>Reference packages, not one-size-fits-all.<br />Every proposal is custom. All prices in USD.</p>
          </div>
          <div className={styles.packageGrid}>
            {faqServices.map(service => {
              const [amount, ...period] = formatServicePrice(service).split(' ')
              return (
                <article key={service['@id']} id={service['@id'].split('#')[1]} className={styles.packageCard}>
                  <header className={styles.packageHeader}>
                    <h3 className="font-serif">{service.name}</h3>
                    <p className={styles.price}>
                      <span className={`${styles.priceAmount} font-serif`}>{amount}</span>{' '}
                      <span className={styles.pricePeriod}>{period.join(' ')}</span>
                    </p>
                  </header>
                  <p className={styles.packageBody}>{service.description}</p>
                </article>
              )
            })}
          </div>
          <div className={styles.nextStep}>
            <p>Have something else in mind? Let&apos;s talk about what your business needs.</p>
            <ModularButton href="#start-a-project">start a conversation</ModularButton>
          </div>
        </section>
      </div>
      <div className={styles.footerTransition}>
        <SectionRise surface="powder-deep" />
      </div>
      <SiteFooter />
    </div>
  )
}
