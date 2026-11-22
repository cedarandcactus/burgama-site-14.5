// Service pages at /services/<slug>. Prices are written without a comma on purpose.
// Sources: the FAQ and pricing page, the client-facing Community Management
// Standards document, and the published case studies in lib/projects.ts.

export type ServiceSurface = 'white' | 'powder' | 'navy' | 'blue-slate'

export type ServiceSection =
  | { kind: 'rows'; title: string; intro?: string; items: [string, string][] }
  | { kind: 'packages'; title: string; intro?: string; items: { name: string; price: string; period: string; body: string }[] }
  | { kind: 'split'; checksTitle: string; checks: string[]; note?: string; stepsTitle: string; steps: [string, string][] }
  | { kind: 'feature'; title: string; body: string[]; points?: [string, string][] }

export type Service = {
  slug: string
  name: string
  serviceType: string
  title: string
  description: string
  h1: string
  intro: string
  summary: string
  priceNote: string
  offers?: { name: string; price: string }[]
  sections: ServiceSection[]
  workTitle: string
  work: string[]
  faq: [string, string][]
  closing: { title: string; body: string; link?: { label: string; href: string } }
}

export const services: Service[] = [
  {
    slug: 'local-seo',
    name: 'Local SEO',
    serviceType: 'Local SEO and AI search optimization',
    title: 'Austin SEO Company: Local SEO and AI Search | Burgama',
    description: 'An Austin SEO company for owner-led businesses: Google Business Profile, site fixes, citations and AI search. Local SEO from $750.',
    h1: 'Austin SEO and AI search for local businesses',
    intro: 'Burgama is an Austin SEO company. We get local and service-area businesses found on Google Maps, in search results and in AI answers. A one-time Local Search Starter is $750. The ongoing Local SEO and AI Visibility Foundation is $1500 a month.',
    summary: 'Get found on Google Maps, in search and in AI answers.',
    priceNote: 'From $750',
    offers: [
      { name: 'Local Search Starter', price: '750' },
      { name: 'Local SEO and AI Visibility Foundation', price: '1500' },
    ],
    sections: [
      {
        kind: 'rows',
        title: 'What we fix first',
        items: [
          ['Google Business Profile', 'Every field completed, with categories and services in the words your customers search, real photos and a first post.'],
          ['Name, address and phone', 'One exact version on your site, your profile and every directory. Small mismatches make Google hesitate.'],
          ['The site you already have', 'Indexing problems, page titles, schema and tracking. We don’t change URLs without redirects, so you keep the rankings you’ve earned.'],
          ['Pages for each search', 'New pages for the searches that bring you customers, so each service and area has a page that matches it.'],
          ['Reviews', 'A review request system with a short link, a QR code and a follow-up text, so asking becomes part of finishing a job.'],
          ['AI search', 'Structured FAQ content, schema, consistent business details and an llms.txt file, so ChatGPT, Gemini and Google’s AI Overviews can cite you.'],
        ],
      },
      {
        kind: 'packages',
        title: 'Two ways to start',
        intro: 'Reference packages. Every proposal is custom.',
        items: [
          { name: 'Local Search Starter', price: '$750', period: 'one time', body: 'A 30-day local search setup: your Google Business Profile completed, a review request system, three new pages for the searches that bring you customers, sitemap, LocalBusiness schema and contact form tracking, listings on 10 relevant directories, and a before and after report at 30 days.' },
          { name: 'Local SEO and AI Visibility Foundation', price: '$1500', period: 'a month', body: 'Google Business Profile buildout, technical SEO on your current site, keyword and competitor research, AI search work, citation cleanup, and weekly and monthly reporting. Three-month first term, then month to month.' },
        ],
      },
      {
        kind: 'split',
        checksTitle: 'A fit if',
        checks: [
          'You serve customers in a city or a service area.',
          'People search for what you do before they call.',
          'Your Google Business Profile exists, and nobody looks after it.',
          'You want to know what AI tools say about your business.',
        ],
        note: 'SEO takes about 90 days to show real movement. Anyone who promises faster results is overselling.',
        stepsTitle: 'The first 90 days',
        steps: [
          ['Days 1 to 30', 'The audit, your Google Business Profile, technical fixes and tracking.'],
          ['Days 30 to 60', 'Content, citations and AI search work.'],
          ['Days 60 to 90', 'The first real movement in rankings.'],
        ],
      },
    ],
    workTitle: 'Local search work',
    work: ['reclaim-local-search', 'clement-local-search', 'matchday-local-seo'],
    faq: [
      ['How much does local SEO cost in Austin?', 'The Local Search Starter is $750 one time and is delivered in 30 days. The Local SEO and AI Visibility Foundation is $1500 a month, with a three-month first term and then month to month. Every proposal is custom, so these are reference points.'],
      ['How long does local SEO take?', 'About 90 days to show real movement. Days 1 to 30 cover the audit, Google Business Profile, technical fixes and tracking. Days 30 to 60 cover content, citations and AI search work. Days 60 to 90 bring the first real movement in rankings.'],
      ['Do I need a new website for SEO?', 'No. We usually improve the site you already have. We don’t change URLs without redirects, so you keep the rankings you’ve earned.'],
      ['Do you manage my Google Business Profile?', 'Yes. Both packages include building out your Google Business Profile. You stay the owner of the profile and add us as a manager.'],
      ['Can you track visits from ChatGPT?', 'Yes. We add AI referral tracking to your analytics, so your reports show visits from ChatGPT, Gemini and Perplexity, not just Google.'],
    ],
    closing: {
      title: 'See where you stand first.',
      body: 'The free AI visibility check shows what ChatGPT says about your business today.',
      link: { label: 'free AI visibility check', href: '/ai-visibility-check' },
    },
  },
  {
    slug: 'website-design',
    name: 'Website design',
    serviceType: 'Website design and development',
    title: 'Austin Web Design for Small Businesses and Online Stores | Burgama',
    description: 'Austin web design for service businesses, nonprofits and online stores. Websites from $1500, ecommerce from $2450, with SEO, schema and analytics built in.',
    h1: 'Austin web design for service businesses, nonprofits and online stores',
    intro: 'We are an Austin web design team. We design and build websites that are easy to find and easy to act on. Websites for service-based businesses and nonprofits start at $1500. Ecommerce websites start at $2450.',
    summary: 'For service businesses, nonprofits and online stores.',
    priceNote: 'From $1500',
    offers: [
      { name: 'Website for service-based businesses and nonprofits', price: '1500' },
      { name: 'Ecommerce website', price: '2450' },
    ],
    sections: [
      {
        kind: 'packages',
        title: 'Two starting points',
        intro: 'Reference prices. Every proposal is custom.',
        items: [
          { name: 'Service businesses and nonprofits', price: '$1500', period: '/ project', body: 'A custom, mobile-friendly website of up to 5 pages with SEO basics, LocalBusiness and FAQ schema, a contact or booking form, analytics setup, two revision rounds and redirects from your old site. Extra pages are $100 an hour.' },
          { name: 'Ecommerce websites', price: '$2450', period: '/ project', body: 'A custom Shopify store. Store structure planned for one-time and subscription purchases, a custom homepage, shop, product, about, contact and FAQ pages, copywriting for the main pages, three custom rendered images, checkout and payment testing, page speed work, redirects from your old site and 30 days of monitoring after launch. First draft in about 4 to 6 weeks.' },
        ],
      },
      {
        kind: 'rows',
        title: 'Built in from the start',
        items: [
          ['Search basics', 'Page titles, descriptions and headings written for the searches your customers make.'],
          ['Schema', 'LocalBusiness and FAQ schema, so Google and AI tools read your business details correctly.'],
          ['Redirects', 'Every old URL is kept or redirected, so a redesign doesn’t cost you the rankings you’ve earned.'],
          ['Analytics', 'Tracking set up before launch, so you can see where visitors come from and what they do.'],
          ['A form that works', 'A contact or booking form that reaches you, tested before the site goes live.'],
          ['Mobile first', 'Designed for the phone first, because that is where most visitors arrive.'],
        ],
      },
      {
        kind: 'split',
        checksTitle: 'A fit if',
        checks: [
          'You run a service business or a nonprofit and need a clear, credible home online.',
          'You sell products and want a store of your own.',
          'Your current site is slow on a phone or hard to update.',
          'You’re changing platforms and don’t want to lose your search traffic.',
        ],
        stepsTitle: 'How a build runs',
        steps: [
          ['Call and proposal', 'A discovery call, then a custom proposal, usually within one business day.'],
          ['Design and build', 'You see the design, then the working site. Two rounds of revisions are included.'],
          ['Launch', 'Redirects, analytics and a final check on phone and desktop. Then the site is yours.'],
        ],
      },
    ],
    workTitle: 'Websites we’ve built',
    work: ['10-pillar-productions', 'hiking-pony-website', 'avro-website', 'wagner-wealth'],
    faq: [
      ['How much does a small business website cost?', 'Websites for service-based businesses and nonprofits start at $1500 for up to 5 pages. Ecommerce websites start at $2450. Extra pages are $100 an hour. Every proposal is custom, so these are reference points.'],
      ['Will I lose my Google rankings in a redesign?', 'No. We keep or redirect every URL from your old site, so you keep the rankings you’ve earned.'],
      ['How many revisions are included?', 'Two rounds of revisions on every deliverable, unless the proposal says otherwise.'],
      ['What does an ecommerce website include?', 'The $2450 ecommerce website is a custom Shopify store: store structure for one-time and subscription purchases, a custom homepage, shop, product, about, contact and FAQ pages, copywriting, three custom rendered images, checkout and payment testing, page speed work, redirects and 30 days of monitoring after launch. Larger catalogs and extra integrations are scoped in the proposal.'],
      ['Do you build Shopify stores?', 'Yes. Ecommerce websites are built on Shopify. Recent Shopify work includes the AVRO and CellinKey stores.'],
      ['How does billing work?', 'Projects are billed half at kickoff and half on delivery.'],
    ],
    closing: { title: 'Tell us about the site you need.', body: 'A discovery call, then a proposal built for your business.' },
  },
  {
    slug: 'social-media-management',
    name: 'Social media management',
    serviceType: 'Social media management and community management',
    title: 'Social Media Management in Austin, TX | Burgama',
    description: 'Weekly Reels and posts, daily Stories, Trial Reels and weekday community management with a 24-hour reply standard. $2500 a month.',
    h1: 'Social media management for growing brands',
    intro: 'We plan, make and post your content, then look after the community it builds. Social Media Management is $2500 a month, with a calendar you approve before anything goes live.',
    summary: 'Content, posting and daily community management.',
    priceNote: '$2500 a month',
    offers: [{ name: 'Social Media Management', price: '2500' }],
    sections: [
      {
        kind: 'rows',
        title: 'What a month includes',
        intro: 'Instagram, Facebook and TikTok, plus a LinkedIn post. Add-on platforms are $300 a month each.',
        items: [
          ['Weekly Reels and posts', 'Reels and static posts every week across Instagram, Facebook and TikTok, plus a LinkedIn post.'],
          ['Daily Stories', 'At least one active Story every day, built from your feed content, industry news and behind-the-scenes moments.'],
          ['Trial Reels', 'For Instagram accounts with the feature, 3 Trial Reels a week that put your proven content in front of new audiences.'],
          ['Community management', 'Every weekday, a community manager works your accounts: replies, comments, tags and outbound engagement.'],
          ['A calendar you approve', 'A monthly content calendar. Nothing goes live without your sign-off.'],
          ['Reporting', 'A weekly analytics review and a monthly report.'],
        ],
      },
      {
        kind: 'feature',
        title: 'Community management is never passive.',
        body: [
          'It is an active, daily service that protects your account health, keeps your standing with the platform algorithms and grows an audience that takes part.',
          'These are the standards we hold on every account we manage.',
        ],
        points: [
          ['Daily coverage', 'Every business day, across your active platforms. Each scheduled post is checked live on the platform itself, and publishing failures are caught and fixed right away.'],
          ['Posted natively', 'Content that needs trending audio, account tags or locations is published by hand on Instagram and TikTok, not auto-posted.'],
          ['A reply within 24 hours', 'Every comment and DM gets a reply within 24 hours of receipt. Notifications are on for comments, tags and mentions on every account.'],
          ['Proactive engagement', 'Each day we like and comment on content from your partners, industry leaders and target audience, guided by your brand voice, core content pillars and current campaigns.'],
          ['Always-on Stories', 'At least one active Story every 24 hours, ideally 1 to 2 frames a day, with polls, question boxes and sliders wherever they fit.'],
          ['Weekly quality check', 'Our management team reviews analytics and account activity every week to confirm these standards are met.'],
        ],
      },
      {
        kind: 'feature',
        title: 'Trial Reels, three times a week.',
        body: [
          'Trial Reels are an Instagram feature that shows a Reel to people who don’t follow you yet.',
          'For accounts that have it, we post 3 Trial Reels a week. We re-test your proven, high-performing content to bring engagement back and reach new audiences, with no new filming needed.',
        ],
      },
      {
        kind: 'split',
        checksTitle: 'A fit if',
        checks: [
          'You post when there is time, and there is rarely time.',
          'Comments and DMs sit unanswered for days.',
          'You want one team to plan, make, post and reply.',
          'You want to approve everything before it goes live.',
        ],
        stepsTitle: 'How approval works',
        steps: [
          ['Brief', 'What the piece is for and who it is for.'],
          ['Proof copy', 'The words, for you to check.'],
          ['Draft creative', 'The first version of the design or edit.'],
          ['Final asset', 'The finished piece, ready to post.'],
          ['Your sign-off', 'Nothing goes live without it.'],
        ],
      },
    ],
    workTitle: 'Social work',
    work: ['hush-hush-tan-social', 'matchday-social', 'avro'],
    faq: [
      ['How much does social media management cost?', 'Social Media Management is $2500 a month. Add-on platforms are $300 a month each. Every proposal is custom, so this is a reference point.'],
      ['Which platforms are included?', 'Instagram, Facebook and TikTok, plus a LinkedIn post. Other platforms can be added for $300 a month each.'],
      ['Do I approve posts before they go live?', 'Yes. Nothing goes live without your approval. Every piece goes through five steps: brief, proof copy, draft creative, final asset, your sign-off.'],
      ['How fast do you reply to comments and DMs?', 'Every comment and DM gets a reply within 24 hours of receipt. Community management runs every business day, Monday to Friday.'],
      ['What are Instagram Trial Reels?', 'Trial Reels are an Instagram feature that shows a Reel to people who don’t follow you yet. For accounts with the feature, we post 3 Trial Reels a week, re-testing your proven content with new audiences.'],
      ['Is there a minimum term?', 'We recommend a first term of three months for retainers. After that it runs month to month, with 30 days’ written notice from either side.'],
    ],
    closing: { title: 'Hand over the calendar.', body: 'Tell us which accounts you want looked after and we’ll come back with a proposal.' },
  },
  {
    slug: 'meta-ads',
    name: 'Meta ads',
    serviceType: 'Facebook and Instagram ads management',
    title: 'Meta Ads Management in Austin, TX | Burgama',
    description: 'Facebook and Instagram ads managed by the team that makes the creative. Management from $750 a month. Ads run in your own account and you pay Meta directly.',
    h1: 'Facebook and Instagram ads, managed and measured',
    intro: 'We plan, make and run your Meta ads, with the creative made by the same team. Ads run in an account you own, and you pay Meta directly for ad spend. Management starts at $750 a month. A first batch of ad creative is $1500.',
    summary: 'Facebook and Instagram ads, with the creative made in-house.',
    priceNote: 'From $750 a month',
    offers: [
      { name: 'Meta ads management', price: '750' },
      { name: 'Meta ad creative batch', price: '1500' },
    ],
    sections: [
      {
        kind: 'rows',
        title: 'What management covers',
        items: [
          ['Strategy', 'Which campaigns to run, for whom, and what each one is supposed to do.'],
          ['Audiences', 'Who sees the ads, set up and adjusted as the results come in.'],
          ['Creative', 'Video, UGC with actors and team members, and static ads, made by our own team.'],
          ['Testing', 'New ads tested against what is already working, so spend moves to what performs.'],
          ['Conversion tracking', 'Tracking set up so results are measured, not guessed.'],
          ['Reporting', 'Weekly written updates and a monthly report.'],
        ],
      },
      {
        kind: 'packages',
        title: 'What it costs',
        intro: 'Reference prices. Every proposal is custom, and ad spend is paid to Meta.',
        items: [
          { name: 'Ads management', price: '$750', period: 'a month', body: 'Launching, measuring and adjusting your campaigns, with a monthly report. $750 a month covers up to $5000 in monthly ad spend. From $5000 to $10000 in ad spend, management is $1250 a month.' },
          { name: 'Ad creative batch', price: '$1500', period: 'one time', body: '12 video ads and 6 static ads sized for Meta placements, with account and tracking setup, two revision rounds and the usage license for the creators in the videos. More creative is quoted per batch.' },
        ],
      },
      {
        kind: 'feature',
        title: 'Your account. Your card.',
        body: [
          'Ads run in accounts you own, and Meta charges your card directly for ad spend.',
          'Outside costs like photography, talent or creator fees are billed at cost, and only with your approval.',
        ],
      },
      {
        kind: 'split',
        checksTitle: 'A fit if',
        checks: [
          'You have an offer people already buy.',
          'You’ve boosted posts and want a real campaign structure.',
          'You need the ads and the creative from one team.',
          'You want to own the account and the data.',
        ],
        stepsTitle: 'How we start',
        steps: [
          ['Call and proposal', 'A discovery call, then a custom proposal, usually within one business day.'],
          ['Setup', 'Account access, tracking and the first set of creative.'],
          ['Launch and report', 'Campaigns go live, with weekly written updates and a monthly report.'],
        ],
      },
    ],
    workTitle: 'Meta ads work',
    work: ['matchday-meta-ads', 'ollivate'],
    faq: [
      ['How much does Meta ads management cost?', 'Meta ads management starts at $750 a month for up to $5000 in monthly ad spend, and is $1250 a month from $5000 to $10000 in ad spend. A first batch of ad creative, 12 videos and 6 static ads, is $1500 one time. Ad spend is paid directly to Meta. Every proposal is custom, so these are reference points.'],
      ['Who pays for ad spend?', 'You do, directly. Ads run in accounts you own and Meta charges your card.'],
      ['Who owns the ad account?', 'You do. We work inside your account, and it stays yours.'],
      ['Do you make the ad creative?', 'Yes. Video, UGC and static ads are made by our own team. Outside costs like talent or creator fees are billed at cost, and only with your approval.'],
      ['Do you run ads on other platforms?', 'Yes. Burgama also runs Google, LinkedIn and Reddit ads.'],
    ],
    closing: { title: 'Bring the offer. We’ll bring the ads.', body: 'Tell us what you sell and who buys it.', link: { label: 'ROAS calculator', href: '/research/roas-calculator' } },
  },
  {
    slug: 'email-marketing',
    name: 'Email marketing',
    serviceType: 'Klaviyo email and SMS marketing',
    title: 'Klaviyo Email Marketing in Austin, TX | Burgama',
    description: 'Core Klaviyo flows, SMS signup and a campaign calendar built in about 5 to 6 weeks. Email Marketing Foundation from $1900.',
    h1: 'Email and SMS marketing built in Klaviyo',
    intro: 'We build the automated emails that follow up for you: welcome, abandoned cart, post-purchase and winback. The Email Marketing Foundation is $1900 and takes about 5 to 6 weeks.',
    summary: 'Klaviyo flows, SMS signup and a campaign calendar.',
    priceNote: 'From $1900',
    offers: [{ name: 'Email Marketing Foundation', price: '1900' }],
    sections: [
      {
        kind: 'rows',
        title: 'The flows we build',
        items: [
          ['Welcome', 'The first emails a new subscriber gets, introducing who you are and what to do next.'],
          ['Abandoned cart', 'A reminder to shoppers who added something and left before paying.'],
          ['Browse abandonment', 'A follow-up for people who looked at a product and went no further.'],
          ['Post-purchase', 'What a customer hears from you after they buy.'],
          ['Replenishment', 'A prompt to reorder around the time the product runs out.'],
          ['Winback', 'A reason to return, for customers who have gone quiet.'],
        ],
      },
      {
        kind: 'packages',
        title: 'One foundation',
        intro: 'A reference package. Every proposal is custom.',
        items: [
          { name: 'Email Marketing Foundation', price: '$1900', period: '/ project', body: 'Core email flows built in Klaviyo, including welcome, abandoned cart, browse abandonment, post-purchase, replenishment and winback, plus SMS signup and a campaign calendar. About 5 to 6 weeks.' },
        ],
      },
      {
        kind: 'split',
        checksTitle: 'A fit if',
        checks: [
          'You have an email list and rarely write to it.',
          'Shoppers leave carts and never hear from you.',
          'Customers buy once and you’d like a second order.',
          'You want email earning in the background while you run the business.',
        ],
        stepsTitle: 'How the build runs',
        steps: [
          ['Plan', 'Which flows you need first, and what each one should say.'],
          ['Build', 'The flows, the signup forms and SMS signup, set up in your Klaviyo account.'],
          ['Launch', 'Flows go live, with a campaign calendar for what to send next.'],
        ],
      },
    ],
    workTitle: 'Email work',
    work: ['matchday-email', 'patent-earth-email'],
    faq: [
      ['How much does Klaviyo setup cost?', 'The Email Marketing Foundation is $1900. It covers the core flows, SMS signup and a campaign calendar. Every proposal is custom, so this is a reference point.'],
      ['How long does it take?', 'About 5 to 6 weeks.'],
      ['Which flows are included?', 'Welcome, abandoned cart, browse abandonment, post-purchase, replenishment and winback.'],
      ['Can you set up SMS too?', 'Yes. The Foundation includes SMS signup.'],
      ['How does billing work?', 'Projects are billed half at kickoff and half on delivery.'],
    ],
    closing: { title: 'Put your list to work.', body: 'Tell us what you sell and what you send today.' },
  },
  {
    slug: 'brand-identity',
    name: 'Brand identity',
    serviceType: 'Brand identity and logo design',
    title: 'Austin Branding Agency: Brand Identity and Logo Design | Burgama',
    description: 'Brand identity from an Austin branding agency: positioning, logo, color, type and guidelines, made by the people shaping the strategy. $3900.',
    h1: 'Brand identity and logo design',
    intro: 'We build brand identities for new and growing brands. Strategy and design stay with the same people from the first call to the final files. A brand identity is $3900.',
    summary: 'Positioning, logo, color, type and guidelines.',
    priceNote: '$3900',
    offers: [{ name: 'Brand identity', price: '3900' }],
    sections: [
      {
        kind: 'rows',
        title: 'What we make',
        items: [
          ['Positioning', 'What sets you apart, and how to say it so the right people remember.'],
          ['Logo and wordmark', 'A mark that holds up at every size, from a favicon to a storefront.'],
          ['Color and type', 'A palette and typefaces that hold together everywhere your brand appears.'],
          ['Brand guidelines', 'Usage rules your team and vendors can follow.'],
          ['Logo files', 'Files for web and print, ready to hand to a printer or a developer.'],
          ['Rebrands', 'A new name or look, with the plan for moving everything that carries the old one.'],
        ],
      },
      {
        kind: 'packages',
        title: 'What it costs',
        intro: 'A reference price. Every proposal is custom.',
        items: [
          { name: 'Brand identity', price: '$3900', period: '/ project', body: 'Positioning, a logo and wordmark, color palette and type, logo files for web and print, and brand guidelines your team and vendors can follow. Two rounds of revisions are included.' },
        ],
      },
      {
        kind: 'feature',
        title: 'The people shaping the strategy are the ones making the work.',
        body: [
          'You work directly with the people who do the work. Nothing is handed from a strategist to a designer you never meet.',
          'That keeps the idea intact from the first conversation to the final files.',
        ],
      },
      {
        kind: 'split',
        checksTitle: 'A fit if',
        checks: [
          'You’re starting a business and need a name, a look and a way to talk about it.',
          'You’ve outgrown the logo you started with.',
          'Your brand looks different everywhere it appears.',
          'You’re renaming the business and don’t want to lose what you’ve built.',
        ],
        stepsTitle: 'How a project runs',
        steps: [
          ['Call and proposal', 'A discovery call, then a custom proposal, usually within one business day.'],
          ['Direction', 'We agree the idea before anything is designed.'],
          ['Design', 'The identity, with two rounds of revisions.'],
          ['Final files', 'Everything you need to print, publish and brief a vendor.'],
        ],
      },
    ],
    workTitle: 'Brand identity work',
    work: ['sidecar-spirits', 'harvest-dating', 'wurqly', 'cellinkey'],
    faq: [
      ['How much does a brand identity cost?', 'A brand identity is $3900: positioning, a logo and wordmark, color palette and type, logo files and brand guidelines. Every proposal is custom, so this is a reference point.'],
      ['How many revisions are included?', 'Two rounds of revisions on every deliverable, unless the proposal says otherwise.'],
      ['Do you design packaging too?', 'Yes. Packaging design and packaging photography have their own page.'],
      ['Do you work with brands outside Austin?', 'Yes. Burgama is based in Austin and works with clients across the US and internationally.'],
      ['How does billing work?', 'Projects are billed half at kickoff and half on delivery.'],
    ],
    closing: { title: 'What could we make together?', body: 'Tell us about the brand.', link: { label: 'packaging design', href: '/services/packaging-design' } },
  },
  {
    slug: 'packaging-design',
    name: 'Packaging design',
    serviceType: 'Packaging design and packaging photography',
    title: 'Packaging Design Agency in Austin, TX | Burgama',
    description: 'A packaging design agency in Austin for food, drink and consumer brands: new packaging, redesigns across a product line, print-ready artwork and packaging photography.',
    h1: 'Packaging design for consumer brands',
    intro: 'Burgama is a packaging design agency in Austin. We design packaging for new products, rebuild a line that grew one product at a time, and photograph the result. Packaging design is quoted per project. Packaging photography is $350 per product.',
    summary: 'New packaging, redesigns and packaging photography.',
    priceNote: 'Quoted per project',
    offers: [{ name: 'Packaging photography, per product', price: '350' }],
    sections: [
      {
        kind: 'rows',
        title: 'What we make',
        items: [
          ['Packaging design', 'Packaging for new products, designed to be read at a glance.'],
          ['Packaging redesign', 'A system for a range that grew one product at a time, so it looks like one family.'],
          ['Packaging architecture', 'How sizes, flavors and formats relate, so the next product has a place to go.'],
          ['Production artwork', 'Print-ready files built to your printer’s dielines and specs.'],
          ['3D mockups', 'Renders of the finished pack before anything is printed.'],
          ['Packaging photography', 'Photos of the printed product for your website, ads and retail listings.'],
        ],
      },
      {
        kind: 'packages',
        title: 'What it costs',
        intro: 'Reference prices. Every proposal is custom.',
        items: [
          { name: 'Packaging design', price: 'Quoted', period: 'per project', body: 'The price depends on how many products, sizes and formats are in the line. You get a fixed quote after a discovery call, so you know the cost before we start. Two rounds of revisions are included.' },
          { name: 'Packaging photography', price: '$350', period: 'per product', body: 'A set of 8 images for each product: 4 of the package for the main product gallery and 4 lifestyle shots with ingredients and props. Props and staging are included, and you get the edited and raw files. We also size, compress and name every image, write the alt text and upload the set to your product page. A full product line is priced as a bundle.' },
        ],
      },
      {
        kind: 'feature',
        title: 'Designed as a system, not one pack at a time.',
        body: [
          'A product line usually grows one product at a time, and the packaging shows it. We design the rules first: what stays the same on every pack, and what changes by flavor, size and format.',
          'That is how a single-serve sachet and a retail pouch end up looking like the same brand, and how the next product gets a pack without starting over.',
        ],
      },
      {
        kind: 'split',
        checksTitle: 'A fit if',
        checks: [
          'You’re launching a product and need it to look like it belongs on the shelf.',
          'Your packaging grew one product at a time and no longer looks like a family.',
          'You’re adding sizes or flavors and need them to fit the line.',
          'You need photos that show the product as well as it is made.',
        ],
        stepsTitle: 'How a project runs',
        steps: [
          ['Call and proposal', 'A discovery call, then a custom proposal, usually within one business day.'],
          ['Direction', 'We agree the idea and the system before anything is designed.'],
          ['Design', 'The packaging, with two rounds of revisions.'],
          ['Final files', 'Print-ready artwork for your printer, then photography once the packs arrive.'],
        ],
      },
    ],
    workTitle: 'Packaging work',
    work: ['hiking-pony-packaging', 'go2bites-packaging', 'hiking-pony-photography', 'go2bites-photography'],
    faq: [
      ['How much does packaging design cost?', 'Packaging design is quoted per project after a discovery call, as a fixed price. The price depends on how many products, sizes and formats are in the line.'],
      ['How much does packaging photography cost?', 'Packaging photography is $350 per product: 8 images, with props, staging, edited and raw files, and the upload to your product page included. A full product line is priced as a bundle.'],
      ['Do you prepare the files for the printer?', 'Yes. We deliver print-ready artwork built to your printer’s dielines and specs.'],
      ['Do you design food and drink packaging?', 'Yes. Recent packaging work includes Hiking Pony collagen coffee and Go2Bites.'],
      ['Do you work with brands outside Austin?', 'Yes. Burgama is based in Austin and works with clients across the US and internationally.'],
    ],
    closing: { title: 'Tell us about the product.', body: 'A discovery call, then a proposal built for your line.', link: { label: 'brand identity', href: '/services/brand-identity' } },
  },
]

export function getService(slug: string) {
  return services.find(service => service.slug === slug)
}

// Maps the free-text service labels on a case study to the service pages they belong to,
// so each case study can link back to the pages it is proof for. Order matters: the first
// rule that matches a label wins.
const serviceLabelRules: [RegExp, string][] = [
  [/seo|city-page|service page strategy/i, 'local-seo'],
  [/email|klaviyo|deliverability/i, 'email-marketing'],
  [/meta ads|paid social|ad creative|funnel planning/i, 'meta-ads'],
  [/social|community management|content calendar/i, 'social-media-management'],
  [/website|shopify|site structure|checkout|conversion design/i, 'website-design'],
  [/packaging|product photography|sku|production artwork|3d mockups/i, 'packaging-design'],
  [/brand|logo|identity|lettering|illustration|color and typography|positioning/i, 'brand-identity'],
]

export function getServicesForLabels(labels: string[]) {
  const slugs = new Set<string>()
  for (const label of labels) {
    const rule = serviceLabelRules.find(([pattern]) => pattern.test(label))
    if (rule) slugs.add(rule[1])
  }
  return services.filter(service => slugs.has(service.slug))
}
