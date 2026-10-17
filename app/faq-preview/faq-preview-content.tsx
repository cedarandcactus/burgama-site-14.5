import type { ReactNode } from 'react'
import { FaqAccordion } from './faq-accordion'
import styles from './faq-preview.module.css'

type FaqSectionProps = {
  id: string
  title: string
  children: ReactNode
}

function FaqSection({ id, title, children }: FaqSectionProps) {
  return (
    <section className={styles.faqSection} aria-labelledby={id}>
      <div className={styles.sectionHeading}>
        <h2 id={id}>{title}</h2>
      </div>
      <div className={styles.accordion}>{children}</div>
    </section>
  )
}

function ConfirmMarker() {
  return <span className={styles.confirmMarker}>To confirm</span>
}

type PackageCardProps = {
  name: string
  price: string
  summary?: ReactNode
  children: ReactNode
  quiet?: ReactNode
  featured?: boolean
}

function PackageCard({ name, price, summary, children, quiet, featured = false }: PackageCardProps) {
  return (
    <article className={styles.packageCard} data-featured={featured || undefined}>
      <header className={styles.packageHeader}>
        <h3>{name}</h3>
        <p className={styles.price}>{price}</p>
        {summary && <div className={styles.packageSummary}>{summary}</div>}
      </header>
      <div className={styles.packageBody}>{children}</div>
      {quiet && <div className={styles.packageQuiet}>{quiet}</div>}
    </article>
  )
}

export function FaqPreviewContent() {
  return (
    <div className={styles.page} data-nav-surface="ink">
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Burgama FAQ and Pricing: Austin Marketing, SEO and Video</h1>
        </div>
      </header>

      <div className={styles.content}>
        <FaqSection id="about-burgama" title="About Burgama">
          <FaqAccordion question="What is Burgama?">
            <p>Burgama is a marketing and creative agency in Austin, Texas. We help small and growing businesses get found on Google, in AI answers and on social media. One team does the strategy, SEO, social, video, email, websites and paid ads.</p>
          </FaqAccordion>
          <FaqAccordion question="Is Burgama the same company as Cedar & Cactus?">
            <p>Yes, Burgama is the same company as Cedar &amp; Cactus. Cedar &amp; Cactus became Burgama in September 2026. The founder, team and clients did not change. Our legal name is Cedar and Cactus LLC, doing business as Burgama.</p>
          </FaqAccordion>
          <FaqAccordion question="Where is Burgama based?">
            <p>Burgama is based in Austin, Texas, and works with clients across the US.</p>
          </FaqAccordion>
          <FaqAccordion question="Do you work with businesses outside Texas?">
            <p>Yes, Burgama works with businesses outside Texas. We are based in Austin and work with clients across the US, including clients in Arizona and the Midwest.</p>
          </FaqAccordion>
          <FaqAccordion question="Who works on my account at Burgama?">
            <p>At Burgama, you work directly with the people who do the work.</p>
            <ul>
              <li>Deniz Sipahi, Founder and CMO, leads strategy and runs accounts himself.</li>
              <li>Josiah Cadis, Lead Visual Strategist, leads design and video.</li>
              <li>Amanda, Marketing Coordinator. <ConfirmMarker /></li>
              <li>Luisa, Marketing Coordinator Intern. <ConfirmMarker /></li>
            </ul>
          </FaqAccordion>
          <FaqAccordion question="What kinds of businesses does Burgama work with?">
            <p>Burgama works with owner-led small and mid-sized businesses. Recent work includes health and wellness brands, physical therapy clinics, senior care advisors, coffee brands, B2B marketplaces and sustainability consultants.</p>
          </FaqAccordion>
          <FaqAccordion question="What services does Burgama offer?">
            <p>Burgama offers SEO, social, video, branding, websites, email and paid ads.</p>
            <ul>
              <li>SEO and AI search</li>
              <li>Social media management and community management</li>
              <li>Founder and brand video</li>
              <li>Commercial-grade AI video</li>
              <li>UGC with actors and team members</li>
              <li>Branding: logos and brand guidelines</li>
              <li>Websites</li>
              <li>Email and SMS marketing</li>
              <li>Meta, Google, LinkedIn and Reddit ads</li>
            </ul>
          </FaqAccordion>
          <FaqAccordion question="What are Burgama's packages and prices?">
            <p>Burgama&apos;s reference packages are Local SEO and AI Visibility Foundation at $1,500 a month, Social Media Management at $2,500 a month, Founder Video Production at $5,000, Email Marketing Foundation at $1,900 and Website Creation at $1,500, all in USD. Every proposal is custom, so these are reference points. Details of each package are further down this page.</p>
          </FaqAccordion>
        </FaqSection>

        <FaqSection id="how-we-work" title="How we work">
          <FaqAccordion question="How much does Burgama charge for marketing services?">
            <p>Burgama&apos;s standard rate is $100 an hour. Most work is quoted as a fixed project or a monthly retainer, so you know the price before we start. Retainer clients keep the rate they signed at for as long as the retainer stays active.</p>
          </FaqAccordion>
          <FaqAccordion question="Does Burgama give custom quotes?">
            <p>Yes, every Burgama proposal is built for your business. The packages below are reference points. While we work, we often find small fixes and quick wins, and we take care of them as we go.</p>
          </FaqAccordion>
          <FaqAccordion question="What happens after I contact Burgama?">
            <p>After you contact Burgama, you get a discovery call and then a custom proposal, usually within one business day.</p>
            <ol>
              <li>A discovery call.</li>
              <li>A custom proposal, usually within one business day.</li>
              <li>A signed agreement and the first invoice.</li>
              <li>Kickoff.</li>
              <li>Weekly written updates and a monthly report.</li>
            </ol>
          </FaqAccordion>
          <FaqAccordion question="Do I approve content before Burgama publishes it?">
            <p>Yes, nothing goes live at Burgama without your approval. Every piece goes through five steps: brief, proof copy, draft creative, final asset, your sign-off.</p>
          </FaqAccordion>
          <FaqAccordion question="How many revisions does Burgama include?">
            <p>Burgama includes two rounds of revisions on every deliverable, unless the package says otherwise.</p>
          </FaqAccordion>
          <FaqAccordion question="How does Burgama billing work?">
            <p>Burgama bills projects half at kickoff and half on delivery, and bills retainers monthly in advance.</p>
            <ul>
              <li>Projects: half at kickoff, half on delivery.</li>
              <li>Retainers: billed monthly in advance. The first invoice is due before work starts. After that, invoices are due on the 1st.</li>
              <li>Invoices come through QuickBooks. You can pay online by bank transfer or card.</li>
            </ul>
          </FaqAccordion>
          <FaqAccordion question="Is there a minimum contract length?">
            <p>Burgama recommends a first term of three months for retainers. After that it runs month to month, with 30 days&apos; written notice from either side.</p>
          </FaqAccordion>
          <FaqAccordion question="Who pays for ad spend?">
            <p>You pay for ad spend directly when Burgama runs your ads. Ads run in accounts you own, charged to your card by Google or Meta. Outside costs like photography, talent or creator fees are billed at cost, and only with your approval.</p>
          </FaqAccordion>
          <FaqAccordion question="Can agencies hire Burgama for white-label work?">
            <p>Yes, Burgama takes referral and white-label projects from partner agencies.</p>
          </FaqAccordion>
        </FaqSection>

        <FaqSection id="seo-ai-search" title="SEO and AI search">
          <FaqAccordion question="How much does an SEO agency in Austin cost?">
            <p>Burgama&apos;s Local SEO and AI Visibility Foundation costs $1,500 a month (USD). The first term is three months, then it runs month to month. Our standard rate is $100 an hour. Other agencies price differently, so compare what each package includes.</p>
          </FaqAccordion>
          <FaqAccordion question="How long does SEO take?">
            <p>SEO with Burgama takes about 90 days to show real movement.</p>
            <ul>
              <li>Days 1 to 30: audit, Google Business Profile, technical fixes and tracking.</li>
              <li>Days 30 to 60: content, citations and AI search work.</li>
              <li>Days 60 to 90: the first real movement in rankings.</li>
            </ul>
            <p>Anyone who promises faster results is overselling.</p>
          </FaqAccordion>
          <FaqAccordion question="What is AI search optimization?">
            <p>AI search optimization is how Burgama makes your business easy for AI tools like ChatGPT, Gemini, Perplexity and Google&apos;s AI Overviews to cite. We use structured FAQ content, schema markup, consistent business details across the web, and an llms.txt file.</p>
          </FaqAccordion>
          <FaqAccordion question="How do I get my business to show up in ChatGPT and Gemini?">
            <p>Burgama helps your business get cited by ChatGPT, Gemini and Perplexity with structured FAQ content, schema markup, consistent business details across the web and an llms.txt file. These are part of our Local SEO and AI Visibility Foundation package.</p>
          </FaqAccordion>
          <FaqAccordion question="Do I need a new website for SEO?">
            <p>No, Burgama usually improves the site you already have. We don&apos;t change URLs without redirects, so you keep the rankings you&apos;ve earned.</p>
          </FaqAccordion>
          <FaqAccordion question="Can Burgama track visits from ChatGPT, Gemini and Perplexity?">
            <p>Yes, Burgama adds AI referral tracking to your analytics. Your reports then show visits from ChatGPT, Gemini and Perplexity, not just Google.</p>
          </FaqAccordion>
        </FaqSection>

        <section className={styles.packagesSection} aria-labelledby="packages">
          <div className={styles.packagesHeading}>
            <h2 id="packages">Packages</h2>
            <p>all prices in USD</p>
          </div>
          <div className={styles.packageGrid}>
            <PackageCard
              featured
              name="Local SEO and AI Visibility Foundation"
              price="Price: $1,500 a month"
              summary={<p>For local businesses that don&apos;t show up on Google or in AI answers.</p>}
            >
              <ul>
                <li>Google Business Profile: claim, verification and a full buildout of categories, service area and services. Weekly posts. A review link and QR code. Q&amp;A seeding and photo management.</li>
                <li>Technical SEO on your current site: Search Console and Bing Webmaster Tools setup, sitemap and indexing. New page titles, meta descriptions and headers. LocalBusiness and FAQ schema. Alt text, internal links, page speed and mobile fixes.</li>
                <li>Research: keyword and competitor research mapped page by page, with a gap analysis against the competitors who outrank you.</li>
                <li>AI search: structured FAQ content and consistent business details so AI tools cite you.</li>
                <li>Citations: name, address and phone number cleaned up across directories.</li>
                <li>Reporting: a weekly written update and a monthly report on rankings, profile views, calls and direction requests.</li>
              </ul>
            </PackageCard>

            <PackageCard
              name="Social Media Management"
              price="Price: $2,500 a month"
              quiet={<p>Add-ons: Threads, X, Pinterest, YouTube Shorts or Google Business Profile posts, at $300 a month per platform. <ConfirmMarker /></p>}
            >
              <h4>Every week:</h4>
              <ul>
                <li>3 Reels and 1 static post, cross-posted to Instagram, Facebook and TikTok.</li>
                <li>1 LinkedIn post on your company page.</li>
                <li>3 Instagram Trial Reels that re-test your best content to reach new people.</li>
                <li>Stories: at least one live Story every 24 hours, 1 to 2 frames a day, with polls, questions and sliders.</li>
              </ul>
              <h4>Community management, Monday to Friday:</h4>
              <ul>
                <li>Every comment and DM answered within 24 hours, on every platform.</li>
                <li>Alerts on for comments, tags and mentions.</li>
                <li>Daily outbound engagement with your partners, industry leaders and target audience, in your brand voice.</li>
                <li>Every post checked live on the platform. Publishing failures are fixed right away.</li>
                <li>Instagram and TikTok posted natively, so trending audio, tags and locations carry over.</li>
              </ul>
              <h4>Planning:</h4>
              <ul>
                <li>A monthly calendar built from a strategy session. You approve it before anything posts.</li>
                <li>Weekly analytics review.</li>
                <li>A monthly report. <ConfirmMarker /></li>
              </ul>
            </PackageCard>

            <PackageCard
              name="Founder Video Production"
              price="Price: $5,000"
              summary={<p>One 90-second founder video, from first call to final files.</p>}
              quiet={<p>Not included: travel outside Texas, paid talent and location fees. These are quoted per project.</p>}
            >
              <ul>
                <li>Pre-production: discovery call and message strategy. Script or talking points. Shot list and storyboard. Location scouting. Call sheet. Wardrobe and on-camera prep guide.</li>
                <li>Production: up to a half-day shoot anywhere in Texas. Director and camera operator. Cinema camera, lighting, and lapel and boom audio. On-camera coaching, with a teleprompter if you want one. B-roll of you, your team and your space.</li>
                <li>Post-production: editing and color grading. Sound mix and noise cleanup. Licensed music. Motion titles and logo. Captions. Three rounds of revisions.</li>
                <li>Delivery: a 16:9 master for your site and YouTube. A 9:16 version for Reels, TikTok and Shorts. Three 15 to 30 second cutdowns. A custom thumbnail. An SEO title, description and chapters. A transcript ready to publish on your site.</li>
              </ul>
            </PackageCard>

            <PackageCard
              name="Email Marketing Foundation"
              price="Price: $1,900"
              summary={<p>Built in Klaviyo. <ConfirmMarker /> About 5 to 6 weeks.</p>}
            >
              <ul>
                <li>A welcome series on your signup popup. It stops when the person buys.</li>
                <li>Abandoned cart emails at 2 hours, 24 hours and 3 days. They stop when the person orders.</li>
                <li>A browse abandonment flow.</li>
                <li>Branded order and shipping emails.</li>
                <li>A post-purchase check-in and review request.</li>
                <li>Replenishment reminders.</li>
                <li>A winback flow with list cleanup, plus a one-time email to past buyers.</li>
                <li>A segmented popup that asks one question, then email, then phone number, and tags each audience.</li>
                <li>SMS signup and a holiday or launch campaign calendar.</li>
                <li>You approve every email at the proof and final stages.</li>
                <li>We measure flow revenue, cart recovery and list growth.</li>
              </ul>
            </PackageCard>

            <PackageCard
              name="Website Creation"
              price="Price: $1,500"
              quiet={<p>Not included: domain, image creation, hosting and platform fees. Extra pages are $100 an hour. <ConfirmMarker /></p>}
            >
              <ul>
                <li>Up to 5 pages.</li>
                <li>Custom design that works on mobile.</li>
                <li>Titles, meta descriptions, headers and alt text.</li>
                <li>LocalBusiness and FAQ schema.</li>
                <li>A contact or booking form.</li>
                <li>Search Console, Bing and Google Analytics setup, with your sitemap submitted.</li>
                <li>Page speed basics.</li>
                <li>Two revision rounds.</li>
                <li>Redirects from your old site at launch.</li>
              </ul>
            </PackageCard>
          </div>
        </section>
      </div>
    </div>
  )
}
