import type { Metadata } from 'next'
import { FaqPreviewContent } from './faq-preview-content'

export const metadata: Metadata = {
  title: { absolute: 'Burgama FAQ and Pricing | Austin Marketing Agency' },
  description: 'Burgama is an Austin marketing agency. See prices for SEO, social, video, email and websites, plus how we work, billing and terms.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

const jsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://burgama.com/#organization",
      "name": "Burgama",
      "legalName": "Cedar and Cactus LLC",
      "alternateName": "Cedar & Cactus",
      "url": "https://burgama.com",
      "description": "Burgama is a marketing and creative agency in Austin, Texas. We help small and growing businesses get found on Google, in AI answers and on social media.",
      "priceRange": "$$",
      "address": {"@type": "PostalAddress", "addressLocality": "Austin", "addressRegion": "TX", "addressCountry": "US"},
      "areaServed": {"@type": "Country", "name": "United States"},
      "founder": {"@type": "Person", "name": "Deniz Sipahi", "jobTitle": "Founder and CMO"},
      "knowsAbout": ["SEO", "AI search optimization", "Social media management", "Video production", "Email marketing", "Web design", "Paid advertising"]
    },
    {
      "@type": "Service",
      "@id": "https://burgama.com/#service-seo",
      "name": "Local SEO and AI Visibility Foundation",
      "serviceType": "Local SEO and AI search optimization",
      "description": "Google Business Profile buildout, technical SEO on your current site, keyword and competitor research, AI search work, citation cleanup, and weekly and monthly reporting. Three-month first term, then month to month.",
      "provider": {"@id": "https://burgama.com/#organization"},
      "areaServed": {"@type": "Country", "name": "United States"},
      "offers": {"@type": "Offer", "price": "1500", "priceCurrency": "USD",
        "priceSpecification": {"@type": "UnitPriceSpecification", "price": "1500", "priceCurrency": "USD", "billingDuration": "P1M", "unitCode": "MON"}}
    },
    {
      "@type": "Service",
      "@id": "https://burgama.com/#service-social",
      "name": "Social Media Management",
      "serviceType": "Social media management",
      "description": "Weekly Reels and static posts across Instagram, Facebook and TikTok, a LinkedIn post, Instagram Trial Reels, daily Stories, weekday community management, a monthly calendar you approve and weekly analytics review.",
      "provider": {"@id": "https://burgama.com/#organization"},
      "areaServed": {"@type": "Country", "name": "United States"},
      "offers": {"@type": "Offer", "price": "2500", "priceCurrency": "USD",
        "priceSpecification": {"@type": "UnitPriceSpecification", "price": "2500", "priceCurrency": "USD", "billingDuration": "P1M", "unitCode": "MON"}}
    },
    {
      "@type": "Service",
      "@id": "https://burgama.com/#service-founder-video",
      "name": "Founder Video Production",
      "serviceType": "Video production",
      "description": "One 90-second founder video, from first call to final files. Includes pre-production, a half-day shoot anywhere in Texas, editing, color, sound, captions and delivery in 16:9 and 9:16 with three cutdowns.",
      "provider": {"@id": "https://burgama.com/#organization"},
      "areaServed": {"@type": "Country", "name": "United States"},
      "offers": {"@type": "Offer", "price": "5000", "priceCurrency": "USD"}
    },
    {
      "@type": "Service",
      "@id": "https://burgama.com/#service-email",
      "name": "Email Marketing Foundation",
      "serviceType": "Email marketing",
      "description": "Core email flows including welcome, abandoned cart, browse abandonment, post-purchase, replenishment and winback, plus SMS signup and a campaign calendar. About 5 to 6 weeks.",
      "provider": {"@id": "https://burgama.com/#organization"},
      "areaServed": {"@type": "Country", "name": "United States"},
      "offers": {"@type": "Offer", "price": "1900", "priceCurrency": "USD"}
    },
    {
      "@type": "Service",
      "@id": "https://burgama.com/#service-website",
      "name": "Website Creation",
      "serviceType": "Web design",
      "description": "A custom, mobile-friendly website of up to 5 pages with SEO basics, LocalBusiness and FAQ schema, a contact or booking form, analytics setup, two revision rounds and redirects from your old site.",
      "provider": {"@id": "https://burgama.com/#organization"},
      "areaServed": {"@type": "Country", "name": "United States"},
      "offers": {"@type": "Offer", "price": "1500", "priceCurrency": "USD"}
    },
    {
      "@type": "FAQPage",
      "@id": "https://burgama.com/faq/#faq",
      "mainEntity": [
        {"@type":"Question","name":"What is Burgama?","acceptedAnswer":{"@type":"Answer","text":"Burgama is a marketing and creative agency in Austin, Texas. We help small and growing businesses get found on Google, in AI answers and on social media. One team does the strategy, SEO, social, video, email, websites and paid ads."}},
        {"@type":"Question","name":"Is Burgama the same company as Cedar & Cactus?","acceptedAnswer":{"@type":"Answer","text":"Yes, Burgama is the same company as Cedar & Cactus. Cedar & Cactus became Burgama in September 2026. The founder, team and clients did not change. Our legal name is Cedar and Cactus LLC, doing business as Burgama."}},
        {"@type":"Question","name":"Where is Burgama based?","acceptedAnswer":{"@type":"Answer","text":"Burgama is based in Austin, Texas, and works with clients across the US."}},
        {"@type":"Question","name":"Do you work with businesses outside Texas?","acceptedAnswer":{"@type":"Answer","text":"Yes, Burgama works with businesses outside Texas. We are based in Austin and work with clients across the US, including clients in Arizona and the Midwest."}},
        {"@type":"Question","name":"Who works on my account at Burgama?","acceptedAnswer":{"@type":"Answer","text":"At Burgama, you work directly with the people who do the work. Deniz Sipahi, Founder and CMO, leads strategy and runs accounts himself. Josiah Cadis, Lead Visual Strategist, leads design and video."}},
        {"@type":"Question","name":"What kinds of businesses does Burgama work with?","acceptedAnswer":{"@type":"Answer","text":"Burgama works with owner-led small and mid-sized businesses. Recent work includes health and wellness brands, physical therapy clinics, senior care advisors, coffee brands, B2B marketplaces and sustainability consultants."}},
        {"@type":"Question","name":"What services does Burgama offer?","acceptedAnswer":{"@type":"Answer","text":"Burgama offers SEO, social, video, branding, websites, email and paid ads. That covers SEO and AI search, social media and community management, founder and brand video, commercial-grade AI video, UGC with actors and team members, logos and brand guidelines, websites, email and SMS marketing, and Meta, Google, LinkedIn and Reddit ads."}},
        {"@type":"Question","name":"What are Burgama's packages and prices?","acceptedAnswer":{"@type":"Answer","text":"Burgama's reference packages are Local SEO and AI Visibility Foundation at $1,500 a month, Social Media Management at $2,500 a month, Founder Video Production at $5,000, Email Marketing Foundation at $1,900 and Website Creation at $1,500, all in USD. Every proposal is custom, so these are reference points."}},
        {"@type":"Question","name":"How much does Burgama charge for marketing services?","acceptedAnswer":{"@type":"Answer","text":"Burgama's standard rate is $100 an hour. Most work is quoted as a fixed project or a monthly retainer, so you know the price before we start. Retainer clients keep the rate they signed at for as long as the retainer stays active."}},
        {"@type":"Question","name":"Does Burgama give custom quotes?","acceptedAnswer":{"@type":"Answer","text":"Yes, every Burgama proposal is built for your business. The packages are reference points. While we work, we often find small fixes and quick wins, and we take care of them as we go."}},
        {"@type":"Question","name":"What happens after I contact Burgama?","acceptedAnswer":{"@type":"Answer","text":"After you contact Burgama, you get a discovery call and then a custom proposal, usually within one business day. Next come a signed agreement and the first invoice, then kickoff, then weekly written updates and a monthly report."}},
        {"@type":"Question","name":"Do I approve content before Burgama publishes it?","acceptedAnswer":{"@type":"Answer","text":"Yes, nothing goes live at Burgama without your approval. Every piece goes through five steps: brief, proof copy, draft creative, final asset, your sign-off."}},
        {"@type":"Question","name":"How many revisions does Burgama include?","acceptedAnswer":{"@type":"Answer","text":"Burgama includes two rounds of revisions on every deliverable, unless the package says otherwise."}},
        {"@type":"Question","name":"How does Burgama billing work?","acceptedAnswer":{"@type":"Answer","text":"Burgama bills projects half at kickoff and half on delivery, and bills retainers monthly in advance. The first retainer invoice is due before work starts. After that, invoices are due on the 1st. Invoices come through QuickBooks, and you can pay online by bank transfer or card."}},
        {"@type":"Question","name":"Is there a minimum contract length?","acceptedAnswer":{"@type":"Answer","text":"Burgama recommends a first term of three months for retainers. After that it runs month to month, with 30 days' written notice from either side."}},
        {"@type":"Question","name":"Who pays for ad spend?","acceptedAnswer":{"@type":"Answer","text":"You pay for ad spend directly when Burgama runs your ads. Ads run in accounts you own, charged to your card by Google or Meta. Outside costs like photography, talent or creator fees are billed at cost, and only with your approval."}},
        {"@type":"Question","name":"Can agencies hire Burgama for white-label work?","acceptedAnswer":{"@type":"Answer","text":"Yes, Burgama takes referral and white-label projects from partner agencies."}},
        {"@type":"Question","name":"How much does an SEO agency in Austin cost?","acceptedAnswer":{"@type":"Answer","text":"Burgama's Local SEO and AI Visibility Foundation costs $1,500 a month (USD). The first term is three months, then it runs month to month. Our standard rate is $100 an hour. Other agencies price differently, so compare what each package includes."}},
        {"@type":"Question","name":"How long does SEO take?","acceptedAnswer":{"@type":"Answer","text":"SEO with Burgama takes about 90 days to show real movement. Days 1 to 30 cover the audit, Google Business Profile, technical fixes and tracking. Days 30 to 60 cover content, citations and AI search work. Days 60 to 90 bring the first real movement in rankings. Anyone who promises faster results is overselling."}},
        {"@type":"Question","name":"What is AI search optimization?","acceptedAnswer":{"@type":"Answer","text":"AI search optimization is how Burgama makes your business easy for AI tools like ChatGPT, Gemini, Perplexity and Google's AI Overviews to cite. We use structured FAQ content, schema markup, consistent business details across the web, and an llms.txt file."}},
        {"@type":"Question","name":"How do I get my business to show up in ChatGPT and Gemini?","acceptedAnswer":{"@type":"Answer","text":"Burgama helps your business get cited by ChatGPT, Gemini and Perplexity with structured FAQ content, schema markup, consistent business details across the web and an llms.txt file. These are part of our Local SEO and AI Visibility Foundation package."}},
        {"@type":"Question","name":"Do I need a new website for SEO?","acceptedAnswer":{"@type":"Answer","text":"No, Burgama usually improves the site you already have. We don't change URLs without redirects, so you keep the rankings you've earned."}},
        {"@type":"Question","name":"Can Burgama track visits from ChatGPT, Gemini and Perplexity?","acceptedAnswer":{"@type":"Answer","text":"Yes, Burgama adds AI referral tracking to your analytics. Your reports then show visits from ChatGPT, Gemini and Perplexity, not just Google."}}
      ]
    }
  ]
}`

export default function FaqPreviewPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <FaqPreviewContent />
    </>
  )
}
