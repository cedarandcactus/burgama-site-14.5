import type { Metadata } from 'next'
import { LandingFooter, LandingMark } from '../landing-footer'
import { BookingEmbed } from './booking-embed'
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
            We just emailed you a confirmation. Your report arrives within {turnaround}, usually sooner. If you don’t see our email, check your spam folder or write to <a href="mailto:hello@burgama.com">hello@burgama.com</a>.
          </p>
          <h2 className={styles.bookingTitle}>Pick a time to walk through it</h2>
          <p className={styles.formNote}>A free 30-minute call. We’ll go through your report, answer questions, and show you what to fix first. No pressure to sign up.</p>
          <div className={styles.thanksActions}>
            <a href={bookingUrl} className={styles.textLink} target="_blank" rel="noopener noreferrer">Open the calendar in a new tab</a>
            <a href="/faq#packages" className={styles.textLink}>See our packages and pricing</a>
          </div>
        </div>
        <BookingEmbed />
      </section>
      <LandingFooter />
    </div>
  )
}
