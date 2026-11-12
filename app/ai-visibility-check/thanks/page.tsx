import type { Metadata } from 'next'
import { LandingFooter, LandingMark } from '../landing-footer'
import { bookingUrl, turnaround } from '@/lib/ai-visibility'
import styles from '../page.module.css'

export const metadata: Metadata = {
  title: { absolute: 'Thanks, your AI visibility check is on its way | Burgama' },
  description: 'Your free AI visibility check request was received.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: '/ai-visibility-check/thanks' },
}

export default function ThanksPage() {
  return (
    <div className={`studio-page ${styles.page} font-sans`} data-nav-surface="frost" data-landing-page="">
      <LandingMark />
      <section className={`${styles.hero} ${styles.thanks}`} aria-labelledby="thanks-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Request received</p>
          <h1 id="thanks-title" className="font-serif">Thanks. We’re on it.</h1>
          <p className={styles.lede}>
            Your AI visibility report will arrive at the email you gave us within {turnaround}. If it isn’t there, check your spam folder or write to <a href="mailto:hello@burgama.com">hello@burgama.com</a>.
          </p>
          <div className={styles.thanksActions}>
            <a href={bookingUrl} className={`pill ${styles.submit}`} target="_blank" rel="noopener noreferrer">Book a 30-minute call</a>
            <a href="/faq#packages" className={styles.textLink}>See our packages and pricing</a>
          </div>
          <p className={styles.formNote}>The call is optional. We’ll walk through your report and answer questions, with no pressure to sign up.</p>
        </div>
      </section>
      <LandingFooter />
    </div>
  )
}
