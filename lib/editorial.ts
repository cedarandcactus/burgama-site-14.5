export type IdeaCategory =
  | 'Business Strategy'
  | 'Client Process'
  | 'Copywriting'
  | 'Ecommerce'
  | 'Email Marketing'
  | 'SEO'
  | 'Shopify'
  | 'Site Speed and Performance'
  | 'Web Design'
  | 'Web Development'

export type IdeaVisual =
  | 'platforms'
  | 'email'
  | 'audit'
  | 'reviews'
  | 'sitemap'
  | 'performance'

export type IdeaPost = {
  slug: string
  issue: string
  title: string
  metaTitle: string
  metaDescription: string
  targetKeyword: string
  categories: IdeaCategory[]
  deck: string
  body: string[]
  theme: 'cyan' | 'navy'
  visual: IdeaVisual
  artwork: {
    code: string
    notation: string
  }
  internalLink: {
    href: string
    label: string
  }
  sources: {
    label: string
    href: string
  }[]
}

export const ideas: IdeaPost[] = [
  {
    slug: 'wix-vs-vercel',
    issue: '01',
    title: 'Wix vs Vercel: Which One Actually Works for Your Website',
    metaTitle: 'Wix vs Vercel: Which One Actually Works for Your Site',
    metaDescription:
      'Wix or Vercel for a business website? The honest breakdown on cost, control, speed and who each one is for, from an agency that just made the switch.',
    targetKeyword: 'wix vs vercel',
    categories: ['Web Development', 'Web Design', 'Business Strategy'],
    deck: 'Wix or Vercel for a business website? The honest breakdown on cost, control, speed and who each one is for, from an agency that just made the switch.',
    theme: 'cyan',
    visual: 'platforms',
    artwork: {
      code: 'W / V',
      notation: 'BUILDER / DEPLOY',
    },
    body: [
      'This is not really a fair fight, and that is the first thing to understand. Wix is a website builder. Vercel is a hosting and deployment platform for sites that someone has built in code. Comparing them is like comparing a furnished apartment to a plot of land with utilities. Both can be the right answer. They are answers to different questions.',
      "Wix gives you the editor, the templates, the hosting, the domain management and the app marketplace in one subscription. You can have a respectable site live in a weekend without writing anything. The tradeoff is that everything runs inside Wix's box. Performance is what Wix decides it is, animation and interaction are limited to what the editor supports, and if you ever want to move, you rebuild from scratch because there is no export of the site as code. Domain and email arrangements bought through Wix can also get tangled with Wix's resellers, which is a headache you only discover when you try to leave.",
      'Vercel gives you almost nothing out of the box except an excellent place to put a site. You bring the code, whether that is a framework like Next.js or plain HTML, connect a repository, and every push deploys automatically with a preview link. Domains are simple and cheap to attach, performance is excellent by default because it serves static assets from a global edge network, and you have total control over what the site does. The tradeoff is that someone has to build and maintain the thing, and if that someone is not you, you are paying a developer or an agency.',
      'So the real differences are control, ceiling and ownership. Wix has a low floor and a low ceiling. Vercel has a higher floor and no ceiling. Wix owns the site. On Vercel, you do.',
      "When we rebuilt our own site this year, we moved from Wix to Vercel for exactly those reasons. We wanted custom motion, a portfolio that behaves the way we designed it rather than the way a template allows, and the ability to spin up additional domains and landing pages in minutes without another subscription. That is an agency's list of needs. It is not everyone's.",
      'Here is how we would choose. If you need a site up this month, you will maintain it yourself, and your business does not compete on the site experience, use Wix and do not overthink it. If the website is a meaningful part of how you sell, if you care about speed and search performance, or if you expect the site to grow into something custom, build it properly and host it on Vercel. And if you are on Wix today and feeling the ceiling, plan the move before the ceiling starts costing you customers.',
      'Building and hosting on Vercel is now our default for client sites at Burgama, for the same reasons we chose it for our own.',
    ],
    internalLink: {
      href: '/#capabilities',
      label: 'Explore digital & development',
    },
    sources: [
      { label: 'Vercel: Domains', href: 'https://vercel.com/docs/domains' },
      { label: 'Vercel: Deployments', href: 'https://vercel.com/docs/deployments' },
      {
        label: 'Wix: Site performance overview',
        href: 'https://support.wix.com/en/article/site-performance-an-overview',
      },
    ],
  },
  {
    slug: 'klaviyo-popup-best-practices',
    issue: '02',
    title: 'How to Build an Email Popup People Actually Use',
    metaTitle: 'Klaviyo Popup Best Practices That Actually Convert',
    metaDescription:
      'Most popups collect an email and then lose the sale. Here is how to structure the offer, the timing and the discount code so the popup pays for itself.',
    targetKeyword: 'klaviyo popup best practices',
    categories: ['Email Marketing', 'Ecommerce', 'Copywriting'],
    deck: 'Most popups collect an email and then lose the sale. Here is how to structure the offer, the timing and the discount code so the popup pays for itself.',
    theme: 'navy',
    visual: 'email',
    artwork: {
      code: 'OPT / IN',
      notation: 'OFFER / TIMING',
    },
    body: [
      'Most ecommerce popups are built backwards. They ask for an email, promise a discount, and then send the shopper off to their inbox to go find it. Half of those people never come back. The email lands in promotions, or they were browsing on their phone between other things, and the moment passes. The store gets a subscriber and loses a sale. The usual advice is to tweak the headline or test a different percentage. The real fix is structural.',
      'The version that works has three parts, and none of them are complicated.',
      'First, show the code on the screen, right away, the second the email goes in. Do not make the reward live in the inbox. The email is a backup, not the delivery mechanism. Klaviyo supports unique codes on the success step natively, and it can apply the code at checkout automatically, so the shopper does not even have to copy anything. The offer should be usable within the same tab they are already in.',
      'Second, give the code a real expiry and show a countdown next to it. Forty eight hours is a good default. Long enough that nobody feels pressured, short enough that it does not become a coupon that lives in a notes app forever. The countdown is what turns a nice gesture into a reason to finish the order today. One honest caveat: the timer in the popup resets if the page reloads, so the timer that actually governs the deadline should live in the welcome email, where it is tied to the person rather than the session.',
      'Third, make sure the offer does not collide with anything you already run. If the store has a subscribe and save discount, decide up front whether the welcome code stacks with it, and say so in the popup. Ambiguity at checkout is where these things quietly die.',
      'On timing, the two triggers worth using are a short delay of roughly ten to fifteen seconds and exit intent, which works on mobile as well as desktop now. Show it once. If someone dismisses it, collapse it into a small tab at the edge of the screen instead of reopening it on the next page. People who want the offer will find the tab. People who do not will thank you for not asking again.',
      'We have found that a quiz style popup, three quick questions that route someone to the right product before the email field appears, outperforms a plain offer on product pages where people are still deciding. On the homepage, the plain offer wins. Build both, put each where it belongs, and let the numbers settle it.',
      'This is how we approach email capture at Burgama. The popup is not the goal. The order that follows it is.',
    ],
    internalLink: {
      href: '/#capabilities',
      label: 'Explore marketing & growth',
    },
    sources: [
      {
        label: 'Klaviyo: Signup form targeting and behavior',
        href: 'https://help.klaviyo.com/hc/en-us/search?query=signup%20form%20targeting%20behavior',
      },
      {
        label: 'Klaviyo: Unique coupon codes in signup forms',
        href: 'https://help.klaviyo.com/hc/en-us/search?query=unique%20coupon%20codes%20signup%20forms',
      },
      {
        label: 'Klaviyo: Countdown timer blocks',
        href: 'https://help.klaviyo.com/hc/en-us/search?query=countdown%20timer%20signup%20forms',
      },
    ],
  },
  {
    slug: 'ai-website-audits',
    issue: '03',
    title: 'Why AI Website Audits Get It Wrong',
    metaTitle: 'AI Website Audits Miss Nearly Half the Time. Here Is Why',
    metaDescription:
      'We checked an AI generated site audit line by line against the live site. What we found changed how we report website problems to clients.',
    targetKeyword: 'ai website audit',
    categories: ['SEO', 'Business Strategy', 'Client Process'],
    deck: 'We checked an AI generated site audit line by line against the live site. What we found changed how we report website problems to clients.',
    theme: 'cyan',
    visual: 'audit',
    artwork: {
      code: 'VERIFY',
      notation: 'CLAIM / OBSERVE',
    },
    body: [
      'Earlier this year a client sent us a website audit they had generated with an AI tool. It was long, confident, and formatted like a real report, with severity levels and a numbered list of findings. Before responding, we did the boring thing and checked every claim against the live site. Roughly six out of ten held up. The rest were wrong.',
      'The pattern in the misses was the interesting part. The tool reported a pricing inconsistency that did not exist. Every product on the site was the same price everywhere. It flagged a product page as broken when it loaded fine. It listed a page as live that had been unpublished. None of those were close calls. They were things you could disprove by clicking.',
      'What the tool got right was also telling. It correctly caught a sitewide metadata problem, an outdated claim in old page copy, and an external image host that the site depended on. Those are pattern level findings, the kind of thing a language model is good at spotting because they look like known categories of problem. Where it failed was on observed values. A price. A status code. Whether a URL resolves. A model can only guess at those, and it will guess in the same confident tone it uses when it is right.',
      'That is the discovery, and it is one idea: an AI audit is a hypothesis generator, not an inspector. It is useful for producing a list of things worth checking. It is not evidence that any of them are true.',
      'Why it matters for anyone running a business site is that these reports are going to keep landing in inboxes, and they carry weight because they look thorough. If you act on one without verification, you will spend time fixing things that are not broken and you may miss the real problems that the tool happened to describe vaguely. If you dismiss one entirely, you throw away the forty percent of it that was worth reading.',
      'The practical takeaway is to separate the two jobs. Let an AI tool propose. Let a crawler verify. A crawler like Screaming Frog reports what it actually observed on each URL, the status code, the title, the canonical, the price in the structured data. It cannot invent a number because it never guesses. When we moved a client from AI generated audits to a crawler based one, the conversation changed from arguing about whether findings were real to deciding which ones to fix first.',
      'At Burgama we now run audits that way by default. If a finding cannot be reproduced on the live site, it does not go in the report.',
    ],
    internalLink: {
      href: '/#capabilities',
      label: 'Explore search & strategy',
    },
    sources: [
      {
        label: 'Screaming Frog: SEO Spider',
        href: 'https://www.screamingfrog.co.uk/seo-spider/',
      },
      {
        label: 'Google Search Central: JavaScript SEO basics',
        href: 'https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics',
      },
    ],
  },
  {
    slug: 'judgeme-vs-yotpo',
    issue: '04',
    title: 'Judge.me vs Yotpo: Which Review App Actually Works for Shopify',
    metaTitle: 'Judge.me vs Yotpo: Which Review App Actually Works',
    metaDescription:
      'A clear answer on Judge.me vs Yotpo for Shopify, covering cost, migration, retail syndication and why running both at once quietly hurts your store.',
    targetKeyword: 'judge.me vs yotpo',
    categories: ['Shopify', 'Ecommerce', 'Business Strategy'],
    deck: 'A clear answer on Judge.me vs Yotpo for Shopify, covering cost, migration, retail syndication and why running both at once quietly hurts your store.',
    theme: 'navy',
    visual: 'reviews',
    artwork: {
      code: 'J / Y',
      notation: 'COST / REACH',
    },
    body: [
      'Both of these apps do the core job well. They collect reviews after an order, display them on the product page, and pass rating data to Google. If you are choosing between them for a new store, either will work. The decision comes down to three things: how you pay, where your products sell, and how much weight you are willing to add to the page.',
      'On cost, Judge.me is the simpler story. There is a genuinely usable free tier and a flat monthly plan above it that does not change with your order volume. Yotpo\'s pricing scales with orders, which is fine for a small store and gets expensive quickly once volume picks up. If cost predictability matters to you, Judge.me wins that round without much debate.',
      'On distribution, Yotpo has an advantage that Judge.me simply does not offer: syndication of your reviews to retailer listings such as Amazon and Walmart. If you sell on those marketplaces alongside your own store, that feature alone can justify the higher price, because reviews are the currency of a marketplace listing and collecting them twice is painful. If you only sell through your own site, the feature is irrelevant.',
      "On performance, Yotpo's widget is heavier. On a product page it adds a noticeable amount of script and can push your largest contentful paint out by most of a second. Judge.me is lighter. Neither is catastrophic, but if you are already fighting page speed, it is a real difference.",
      'Migration between them is easier than most people expect. Both support CSV export and import in either direction, so switching does not mean starting from zero. The two caveats are that imported reviews do not carry a verified buyer badge automatically, and video reviews do not transfer.',
      "The situation we see most often is not a store choosing between them. It is a store running both. Someone installed one, someone else installed the other, and now two apps are sending review request emails to the same customers, two pixels are tracking every order, and only one widget is actually visible on the page. The invisible one is still costing money and still emailing people. If that is you, the fix is not a comparison. Pick whichever one your product page already displays, export the other's reviews, import them, disconnect the old app's pixel in Shopify's customer events settings, and uninstall it.",
      'Our honest rule of thumb: Judge.me for stores that sell on their own site and care about cost and speed, Yotpo for brands that sell on marketplaces and want their reviews to travel. And never both.',
      'Sorting out app overlap like this is a regular part of the Shopify work we do at Burgama.',
    ],
    internalLink: {
      href: '/#capabilities',
      label: 'Explore Shopify & ecommerce',
    },
    sources: [
      { label: 'Judge.me: Pricing', href: 'https://judge.me/pricing' },
      { label: 'Yotpo: Pricing', href: 'https://www.yotpo.com/pricing/' },
      {
        label: 'Shopify: Custom pixels and customer events',
        href: 'https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels',
      },
    ],
  },
  {
    slug: 'squarespace-sitemap-not-updating',
    issue: '05',
    title: 'New Pages Not Showing on Google? Check Your Squarespace Sitemap',
    metaTitle: 'Squarespace Sitemap Not Updating? Here Is the Fix',
    metaDescription:
      'Published new pages and Google cannot find them. Here is why the Squarespace sitemap lags behind and what to do before you touch Search Console.',
    targetKeyword: 'squarespace sitemap not updating',
    categories: ['SEO', 'Web Design', 'Client Process'],
    deck: 'Published new pages and Google cannot find them. Here is why the Squarespace sitemap lags behind and what to do before you touch Search Console.',
    theme: 'cyan',
    visual: 'sitemap',
    artwork: {
      code: 'MAP / NOW',
      notation: 'CRAWL / INDEX',
    },
    body: [
      'You publish a batch of new service pages, wait a week, search for them, and nothing. The usual advice is to submit the URLs in Search Console and wait. That is not wrong, but it skips the step that is actually causing the delay on Squarespace sites, and it can bury a problem that will keep hurting you long after those first pages get indexed.',
      'Squarespace generates your sitemap automatically at yoursite.com/sitemap.xml. That sounds like a solved problem, and most of the time it is. The catch is that the sitemap does not always regenerate the moment you hit publish. We have opened a sitemap days after publishing a dozen new pages and found only two of them listed. Worse, it still included a URL from a page that had been deleted and now returned a 404. Google was being handed a stale map with a dead end on it while the new pages sat unlisted.',
      'Here is the check, and it takes two minutes. Open your sitemap in a browser. Count the URLs and compare that number against the Pages panel in Squarespace. If pages are missing, note which ones. Then open each missing page directly and confirm three things: it loads with a normal 200 response, the page settings do not have it hidden from search engines, and the canonical URL points at itself rather than at some older slug. In our experience the pages themselves are almost always fine. The sitemap is the thing lagging.',
      'What fixes it depends on what you find. If the pages are healthy and only the sitemap is behind, give it a few days. Squarespace regenerates on its own schedule and forcing things rarely speeds it up. If a page is hidden from search or has a wrong canonical, fix that first, because no amount of submitting will get a page indexed that is telling Google to ignore it. If a deleted page is still in the sitemap, set up a redirect from the old slug to the closest live page so the crawl budget is not wasted on a 404.',
      'Only after that should you go into Search Console. Submit the sitemap URL once, then use Request Indexing on the handful of pages that matter most, not all of them. Google throttles those requests, so spend them on the pages you actually want ranking this month.',
      'The reason this matters beyond the first week is that a stale sitemap is a quiet, recurring tax on a site. Every future page you publish inherits the same lag, and every page you delete lingers as a dead entry. Building the two minute check into your publishing routine is what keeps that from compounding.',
      'This is the kind of thing we do as part of SEO work at Burgama. Before we ever ask Google to look at a page, we make sure the page and the map agree.',
    ],
    internalLink: {
      href: '/#capabilities',
      label: 'Explore SEO & search',
    },
    sources: [
      {
        label: 'Squarespace: Your site map',
        href: 'https://support.squarespace.com/hc/en-us/articles/206543547-Your-site-map',
      },
      {
        label: 'Google Search Central: Sitemaps overview',
        href: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
      },
    ],
  },
  {
    slug: 'squarespace-vs-custom-website',
    issue: '06',
    title: 'Squarespace vs a Custom Website: How to Choose for a Local Business',
    metaTitle: 'Squarespace vs Custom Website: How to Choose',
    metaDescription:
      'Squarespace or a custom build for a local business? What actually differs on mobile speed, cost and control, plus a simple rule for choosing.',
    targetKeyword: 'squarespace vs custom website',
    categories: ['Web Design', 'Site Speed and Performance', 'Business Strategy'],
    deck: 'Squarespace or a custom build for a local business? What actually differs on mobile speed, cost and control, plus a simple rule for choosing.',
    theme: 'navy',
    visual: 'performance',
    artwork: {
      code: 'BUILD / FIT',
      notation: 'SPEED / CONTROL',
    },
    body: [
      'Most local businesses we talk to are on Squarespace, and most of them are fine there. It is worth saying that clearly, because a lot of comparison articles are written by people who want to sell you the custom option. Squarespace is a good product. The question is whether you have outgrown it, and there is a fairly reliable way to tell.',
      'Start with what Squarespace does well. The templates look professional. The editor is easy enough that an owner can update hours, add a service page or swap a photo without calling anyone. Hosting, security and updates are handled. Booking, forms and basic ecommerce are built in. For a service business whose website mostly needs to exist, look credible and let people get in touch, that is the entire job, and paying a developer to rebuild it would be money spent for no gain.',
      'Now the limits, and the first one is the one that matters most. Mobile performance on Squarespace is capped. The platform loads its own scripts on every page whether you use them or not, and there is only so much you can do about it. You can compress images, trim third party embeds and simplify the page, and those help, but the floor is set by the platform. If most of your traffic is on phones, and for a local business it almost always is, that floor is where you live.',
      'The second limit is structural. Squarespace works beautifully until you want something it was not designed for: a page that behaves differently for different visitors, a custom quote tool, an unusual layout, a change to how the site is crawled. At that point you are either fighting the editor with code injections or accepting that it cannot be done.',
      'A custom build removes both limits. Built well and hosted on a modern platform, it will be faster on mobile than any template site, it will do exactly what you want, and you will own it outright. The cost is the honest part: it takes longer to build, it costs more up front, and someone has to maintain it. If the owner wants to edit the site themselves, that has to be designed in deliberately rather than assumed.',
      'So here is the rule of thumb we use. Run your homepage through Google PageSpeed Insights on mobile. If the score is acceptable and the site does everything you need, stay on Squarespace and put the money into marketing instead. If the score is poor after you have already compressed images and removed what you can, or if there is a feature you keep wishing the site had, the platform is now the bottleneck, and a custom build is the fix rather than another round of tweaks.',
      'That is the conversation we have with every local business before we recommend anything at Burgama. Sometimes the answer is to leave the site alone.',
    ],
    internalLink: {
      href: '/#capabilities',
      label: 'Explore web design & development',
    },
    sources: [
      { label: 'Google: PageSpeed Insights', href: 'https://pagespeed.web.dev/' },
      {
        label: 'Squarespace: Reducing page size for faster loading',
        href: 'https://support.squarespace.com/hc/en-us/articles/360022529371-Reducing-your-page-size-for-faster-loading',
      },
    ],
  },
]

export function getIdea(slug: string) {
  return ideas.find((idea) => idea.slug === slug)
}

export function getIdeaReadingTime(idea: IdeaPost) {
  const words = idea.body.join(' ').trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
