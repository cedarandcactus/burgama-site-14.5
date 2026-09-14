export const ideaCategories = [
  'AI',
  'Email Marketing',
  'Shopify',
  'Website Platforms',
  'SEO',
] as const

export type IdeaCategory = (typeof ideaCategories)[number]
export type IdeaVisual = 'audit' | 'email' | 'reviews' | 'sitemap' | 'platforms'
export type IdeaTheme = 'cyan' | 'navy'

export type IdeaSource = {
  label: string
  href: string
}

export type IdeaPost = {
  slug: string
  number: string
  title: string
  metaTitle: string
  metaDescription: string
  targetKeyword: string
  categories: readonly IdeaCategory[]
  visual: IdeaVisual
  theme: IdeaTheme
  body: readonly string[]
  sources: readonly IdeaSource[]
  internalLink: {
    label: string
    href: string
  }
}

export const ideas: readonly IdeaPost[] = [
  {
    slug: 'why-most-website-audits-are-useless',
    number: '01',
    title: 'Why Most Website Audits Are Useless',
    metaTitle: 'Why Most Website Audits Are Useless | Burgama',
    metaDescription:
      'Most website audits overwhelm small businesses with technical jargon. A practical audit should focus on a few changes that improve clarity and conversion.',
    targetKeyword: 'website audit for small business',
    categories: ['AI', 'SEO'],
    visual: 'audit',
    theme: 'cyan',
    body: [
      'Most website audits fail because they confuse volume with value. They arrive as long documents filled with technical language, vague warnings, and dozens of issues ranked by severity. For a small business owner, that often creates more uncertainty than clarity. The problem is not that the findings are wrong. The problem is that they are not prioritized around the outcomes that actually matter: getting found, building trust, and making it easy for someone to take the next step.',
      'A useful audit should answer a few simple questions. Can people understand what the business offers within a few seconds? Is the site fast enough to keep visitors from leaving? Can search engines clearly interpret the content? Does the mobile experience work without friction? And are the calls to action obvious? These questions connect technical performance with real behavior. They also help distinguish between changes that matter and changes that simply make a report look thorough.',
      'The best audits are short, specific, and ordered by impact. Fix unclear messaging before adjusting tiny keyword variations. Repair broken mobile layouts before rewriting every meta description. Improve the conversion path before chasing new traffic. A good audit should not make a business owner feel behind. It should give them a clear sequence of decisions and a realistic place to begin.',
    ],
    sources: [
      {
        label: 'Screaming Frog SEO Spider documentation',
        href: 'https://www.screamingfrog.co.uk/seo-spider/',
      },
      {
        label: 'Google Search Central JavaScript SEO basics',
        href: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics',
      },
    ],
    internalLink: {
      label: 'See how these choices show up in our work',
      href: '/work',
    },
  },
  {
    slug: 'the-quiet-power-of-email-marketing',
    number: '02',
    title: 'The Quiet Power of Email Marketing',
    metaTitle: 'Why Email Marketing Still Matters | Burgama',
    metaDescription:
      'Email marketing gives small businesses a direct, owned way to stay connected with customers without relying on social algorithms.',
    targetKeyword: 'email marketing for small business',
    categories: ['Email Marketing'],
    visual: 'email',
    theme: 'navy',
    body: [
      'Channels change. Platforms get louder. Algorithms get moody. Email is still one of the simplest ways to reach people who asked to hear from you.',
      'Your list is yours. You can welcome new subscribers, follow up after a purchase, share useful updates, recover abandoned carts, and bring past customers back without paying for every impression.',
      'Good email marketing works because it is timely and relevant. A welcome flow answers common questions. A post-purchase message sets expectations. A reminder brings someone back when they were already close to buying. These small moments add up.',
      'The goal is not to send more email. It is to send better email: clear, helpful, and connected to what the customer actually needs next.',
    ],
    sources: [
      {
        label: 'Klaviyo signup form triggers and behavior documentation',
        href: 'https://help.klaviyo.com/hc/en-us/search?query=signup%20form%20triggers%20behavior',
      },
      {
        label: 'Klaviyo custom coupon codes in signup forms documentation',
        href: 'https://help.klaviyo.com/hc/en-us/search?query=custom%20coupon%20codes%20signup%20forms',
      },
      {
        label: 'Klaviyo countdown timer blocks in signup forms documentation',
        href: 'https://help.klaviyo.com/hc/en-us/search?query=countdown%20timer%20blocks%20signup%20forms',
      },
    ],
    internalLink: {
      label: 'Start a project with Burgama',
      href: '/contact',
    },
  },
  {
    slug: 'judgeme-vs-yotpo-shopify-reviews',
    number: '03',
    title: 'Judge.me vs Yotpo: Picking the Right Shopify Reviews App',
    metaTitle: 'Judge.me vs Yotpo for Shopify Reviews | Burgama',
    metaDescription:
      'Judge.me is the practical choice for most small Shopify stores. Yotpo makes more sense when reviews are part of a broader retention program.',
    targetKeyword: 'Judge.me vs Yotpo',
    categories: ['Shopify'],
    visual: 'reviews',
    theme: 'cyan',
    body: [
      'Both apps do the basic job: collect reviews, display ratings, and add social proof to product pages. The real difference is how much system you need around those reviews.',
      'Judge.me is usually the better fit for small teams. It is quick to set up, affordable, and focused. You can automate review requests, add photo and video reviews, and place widgets without turning reviews into a major project.',
      'Yotpo becomes more useful when reviews sit inside a larger retention stack. It can connect reviews with loyalty, SMS, email, and broader customer programs. That can be valuable, but it also adds cost, setup, and complexity.',
      'The best choice is the smallest tool that supports the experience you want. If you need reliable reviews, start simple. If reviews are one part of a larger lifecycle program, Yotpo may earn the extra overhead.',
    ],
    sources: [
      {
        label: 'Shopify custom pixels documentation',
        href: 'https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels',
      },
      {
        label: 'Yotpo pricing documentation',
        href: 'https://www.yotpo.com/pricing/',
      },
    ],
    internalLink: {
      label: 'Explore our Shopify and web work',
      href: '/work',
    },
  },
  {
    slug: 'squarespace-sitemap-guide',
    number: '04',
    title: 'Squarespace Sitemap: What It Is, Where It Lives, and How to Submit It',
    metaTitle: 'Squarespace Sitemap Guide | Burgama',
    metaDescription:
      'Squarespace automatically creates a sitemap at /sitemap.xml. Learn where to find it, how to submit it to Google, and what to check if pages are missing.',
    targetKeyword: 'Squarespace sitemap',
    categories: ['Website Platforms', 'SEO'],
    visual: 'sitemap',
    theme: 'navy',
    body: [
      'A sitemap is a file that lists the important pages on your website. It helps search engines discover and understand your site structure.',
      'On Squarespace, the sitemap is created automatically. You can usually find it by adding /sitemap.xml to the end of your domain. For example: yourdomain.com/sitemap.xml.',
      'You can submit that address in Google Search Console under Sitemaps. This gives Google a clear place to check for new and updated pages. You do not need to edit the file by hand.',
      'If a page is missing, check whether it is disabled, password protected, or hidden from search. Also confirm the page is published and linked from somewhere on the site. A sitemap helps discovery, but it does not guarantee indexing. Clear content, useful internal links, and a healthy site still matter.',
    ],
    sources: [
      {
        label: 'Squarespace sitemap documentation',
        href: 'https://support.squarespace.com/hc/en-us/articles/206543547-Your-site-map',
      },
      {
        label: 'Google Search Central sitemap documentation',
        href: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
      },
    ],
    internalLink: {
      label: 'Need help with your site structure?',
      href: '/contact',
    },
  },
  {
    slug: 'wix-vs-wordpress',
    number: '05',
    title: 'Wix vs WordPress: Which Platform Fits Your Business?',
    metaTitle: 'Wix vs WordPress for Small Business | Burgama',
    metaDescription:
      'Wix is easier to manage. WordPress gives you more control. The right choice depends on your site, your team, and how much flexibility you need.',
    targetKeyword: 'Wix vs WordPress for small business',
    categories: ['Website Platforms'],
    visual: 'platforms',
    theme: 'cyan',
    body: [
      'Wix is easier to manage. WordPress gives you more control. The right choice depends on what you are building and who will maintain it.',
      'Wix is a good fit when you want an all-in-one system with hosting, templates, support, and a visual editor in one place. Small teams can update pages, publish content, and manage basic SEO without handling much technical maintenance.',
      'WordPress is a better fit when you need deeper customization, complex content structures, or more control over hosting and integrations. It can support almost any type of website, but that flexibility comes with more decisions, updates, and maintenance.',
      'Think about the site after launch. Who will make changes? How often will the content grow? Do you need custom features? What is your tolerance for plugins, updates, and technical support?',
      'Choose Wix for speed, simplicity, and a lower maintenance burden. Choose WordPress for flexibility, ownership, and room to build something more custom.',
      'The platform matters less than the quality of the site. Clear messaging, strong structure, fast pages, and an easy path to contact or purchase will do more for the business than the logo on the website builder.',
    ],
    sources: [
      {
        label: 'Wix site performance overview',
        href: 'https://support.wix.com/en/article/site-performance-an-overview',
      },
      {
        label: 'Vercel domains documentation',
        href: 'https://vercel.com/docs/domains',
      },
      {
        label: 'Vercel deployments documentation',
        href: 'https://vercel.com/docs/deployments',
      },
    ],
    internalLink: {
      label: 'Talk to Burgama about your next website',
      href: '/contact',
    },
  },
]

export function getIdea(slug: string) {
  return ideas.find((idea) => idea.slug === slug)
}

export function getIdeaReadingTime(idea: IdeaPost) {
  const wordCount = idea.body.join(' ').trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(wordCount / 200))} min read`
}
