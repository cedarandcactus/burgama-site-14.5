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
    title: 'Wix vs Vercel: Which one actually works for your website',
    metaTitle: 'Wix vs Vercel: Which one actually works for your site',
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
      href: '/services/website-design',
      label: 'See website design and pricing',
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
    title: 'How to build an email popup people actually use',
    metaTitle: 'Klaviyo popup best practices that actually convert',
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
      href: '/services/email-marketing',
      label: 'See the email marketing foundation',
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
    title: 'Why AI website audits get it wrong',
    metaTitle: 'AI website audits miss nearly half the time. Here is why',
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
      href: '/services/local-seo',
      label: 'See what our Austin SEO includes',
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
    title: 'Judge.me vs Yotpo: Which review app actually works for Shopify',
    metaTitle: 'Judge.me vs Yotpo: Which review app actually works',
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
      href: '/services/website-design',
      label: 'See website design and pricing',
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
    title: 'New pages not showing on Google? Check your Squarespace sitemap',
    metaTitle: 'Squarespace sitemap not updating? Here is the fix',
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
      href: '/services/local-seo',
      label: 'See what our Austin SEO includes',
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
    title: 'Squarespace vs a custom website: How to choose for a local business',
    metaTitle: 'Squarespace vs custom website: How to choose',
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
      href: '/services/website-design',
      label: 'See website design and pricing',
    },
    sources: [
      { label: 'Google: PageSpeed Insights', href: 'https://pagespeed.web.dev/' },
      {
        label: 'Squarespace: Reducing page size for faster loading',
        href: 'https://support.squarespace.com/hc/en-us/articles/360022529371-Reducing-your-page-size-for-faster-loading',
      },
    ],
  },
  {
    slug: 'claim-your-business-in-chatgpt',
    issue: '07',
    title: 'How to claim your business in ChatGPT',
    metaTitle: 'How to claim your business in ChatGPT (Business Hub guide)',
    metaDescription:
      'OpenAI now lets owners claim a free business profile in ChatGPT. Here is how to claim it, what it changes, what it does not, and what to do next.',
    targetKeyword: 'claim business on chatgpt',
    categories: ['SEO', 'Business Strategy'],
    deck: 'OpenAI now lets owners claim a free business profile in ChatGPT. Here is how to claim it, what it changes, what it does not, and what to do next.',
    theme: 'navy',
    visual: 'audit',
    artwork: {
      code: 'CLAIM',
      notation: 'VERIFY / MEASURE',
    },
    body: [
      'On November 10, 2026, OpenAI opened a beta called Businesses in ChatGPT. For the first time, an owner can claim the profile ChatGPT shows for their business, keep its details accurate, and see how often ChatGPT mentions them. Claiming is free for now. Here is how it works, what it changes, and what it does not.',
      'Start at Business Hub, at chatgpt.com/business-hub, or from the ChatGPT sidebar. Sign in with the account that will manage the profile, search for your business, and select your listing. If there is no listing, an eligible online business can add one. If the listing says to contact support, it is locked and you will need OpenAI to grant access.',
      'Next, prove the business is yours. Depending on your listing, OpenAI offers a code by text or call to the business phone, a code to the business email, a TXT record added to your domain, or a Shopify connection. After that comes an identity check through Persona, which can ask for a government ID and business registration details. Until it is done, you cannot publish changes or see your data. OpenAI emails its decision after each review.',
      'Once you are verified, you can update the details ChatGPT shows, such as your website, description and category, and online stores can connect a product feed. OpenAI reviews every change before it goes live. Get the details right before you publish, because a published profile cannot simply be taken down by support.',
      'The new dashboard, Insights, reports mentions, profile views, website clicks and the common topics in conversations where your site is cited. It only shows numbers once there is enough activity to protect privacy, so a blank chart does not mean zero. It does not show the questions people asked or how you compare with competitors. ChatGPT also tags its links with utm_source=chatgpt.com, so you can see those visits in your own analytics.',
      'Eligibility is still narrow. Local shops and restaurants can only claim an existing United States listing, and in the first days some markets showed service businesses as coming soon. The Business Agent, a branded chat that answers questions about your products and policies, is limited to eligible US ecommerce and online service businesses.',
      'The most important line is OpenAI\'s own: claiming does not guarantee better placement or more sales. Whether ChatGPT recommends you still depends on your website, your Google profile, your reviews and what other sites say about you. Claiming makes sure the details are yours and gives you data. It does not do the work of earning the recommendation.',
      'So here is what we would do this week. Claim the profile if you are eligible, and set a calendar reminder to check Insights monthly. Then ask ChatGPT the questions your customers ask and see who it recommends. If it is not you, the fixes are usually a complete Google Business Profile, a page for each service, plain answers to common questions, consistent listings and more reviews.',
      'If you want to know where you stand first, our free AI visibility check shows who ChatGPT and Google recommend for your searches, whether your ChatGPT profile is claimed, and three fixes in order.',
    ],
    internalLink: {
      href: '/ai-visibility-check',
      label: 'Get a free AI visibility check',
    },
    sources: [
      { label: 'OpenAI: Introducing Businesses in ChatGPT', href: 'https://openai.com/index/introducing-businesses-chatgpt/' },
      {
        label: 'VentureBeat: OpenAI lets you claim your business in ChatGPT',
        href: 'https://venturebeat.com/technology/openai-lets-you-claim-your-business-in-chatgpt-and-set-up-a-custom-agentic-ai-customer-sales-rep',
      },
    ],
  },
  {
    slug: 'how-much-do-facebook-ads-cost',
    issue: '08',
    title: 'How much do Facebook ads cost? Start from what a sale is worth',
    metaTitle: 'How much do Facebook ads cost? Start with one sale',
    metaDescription:
      'Facebook ads have no price list. You set the budget. Here is how to work back from what one sale is worth to a budget Meta can actually learn from.',
    targetKeyword: 'how much do facebook ads cost',
    categories: ['Business Strategy', 'Ecommerce'],
    deck: 'Facebook ads have no price list. You set the budget. Here is how to work back from what one sale is worth to a budget Meta can actually learn from.',
    theme: 'cyan',
    visual: 'performance',
    artwork: {
      code: 'COST / SALE',
      notation: 'BUDGET / RETURN',
    },
    body: [
      'There is no price list for Facebook ads. You tell Meta how much you are willing to spend, and Meta spends it. Its own pricing page describes two choices: a daily budget, which it calls the average amount you’re willing to spend on an ad set or campaign per day, and a lifetime budget for the entire run. So the honest answer to how much Facebook ads cost is whatever you decide. The more useful question is how much you can afford to pay for one sale, because that number tells you what the budget has to be.',
      'Start by separating two bills that often get blurred together. The first is ad spend, which goes to Meta. The second is whatever you pay a person or a studio to plan, make and manage the ads. They are not the same money and they should not hide inside one number. When we manage ads, they run in an account the client owns and Meta charges the client’s card directly. If an agency quotes you a single figure that covers both, ask how much of it reaches Meta.',
      'Now work backwards from a sale. Here is an example with made-up numbers. Say your average order is $60, your gross margin is 65% and payment fees take 3%. Each order leaves you $39 after the cost of the product, and $37.20 after fees of $1.80. If you want every dollar of ad spend to bring back four dollars in sales, a 4x return, you can pay $60 divided by 4, which is $15, to win one purchase. After the ad cost, that order still contributes $22.20.',
      'That $15 matters because of how Meta’s delivery system learns. Meta says ad sets exit the learning phase as soon as they can deliver stably, and that this usually occurs after about 50 results in the week after the last significant edit. In the example, 50 purchases at $15 each is $750 a week. Multiply by 4.33 weeks and you get $3247.50 a month. That is the spend that gives Meta enough purchases to learn from at the price you can afford. It is a figure to plan around, not a promise of what each purchase will cost.',
      'This is why a very small budget so often disappoints. If the store in the example spends $300 a month, that pays for 20 purchases at $15, spread over four weeks. Meta never sees anything close to 50 results in a week, so the ad set stays in the learning phase and you end up judging ads that Meta has not finished learning how to deliver. Nothing is broken. The budget is too small for the goal. You can raise the budget, ask Meta to optimize for an earlier step such as an add to cart, or wait.',
      'You do not need a spreadsheet for this. Our free ROAS calculator, at burgama.com/roas-calculator, takes your order value, margin, fees and target return and gives you the cost per purchase you can afford and the monthly learning budget that goes with it. Run it before you talk to anyone who sells ads, including us. If the monthly figure is far beyond what you can spend, that is worth knowing now, and it costs nothing to find out.',
      'Then there is the second bill. At Burgama, an Austin studio, management is $750 a month for up to $5000 in monthly ad spend, and $1250 a month from $5000 to $10000. That covers launching, measuring and adjusting the campaigns, with weekly written updates and a monthly report. The ads themselves have to be made too. A first batch of creative, 12 video ads and 6 static ads, is $1500 one time. These are reference prices, and every proposal is custom. Our Meta ads work for MatchDay and Ollivate is on the site as case studies.',
      'Sometimes the right budget is zero. If people are not yet buying the product without ads, ads will mostly show you that faster and at a cost. If you cannot trace a purchase back to an ad, you will be guessing. If the margin leaves nothing after a realistic cost per purchase, more spend only loses more. Fix the offer, the tracking or the price first. We would rather tell you to wait than manage a budget that cannot work.',
    ],
    internalLink: {
      href: '/roas-calculator',
      label: 'Run your numbers in the ROAS calculator',
    },
    sources: [
      {
        label: 'Meta for Business: Facebook and Instagram ads pricing and cost',
        href: 'https://www.facebook.com/business/ads/pricing',
      },
      {
        label: 'Meta Business Help Center: About the learning phase',
        href: 'https://www.facebook.com/business/help/112167992830700',
      },
    ],
  },
  {
    slug: 'how-much-does-a-website-cost',
    issue: '09',
    title: 'How much does a website cost for a small business?',
    metaTitle: 'How much does a website cost for a small business?',
    metaDescription:
      'A 5-page service site and an online store are different jobs. What moves the price of a small business website, and what ours include at $1500 and $2450.',
    targetKeyword: 'how much does a website cost',
    categories: ['Web Design', 'Business Strategy'],
    deck: 'A 5-page service site and an online store are different jobs. What moves the price of a small business website, and what ours include at $1500 and $2450.',
    theme: 'navy',
    visual: 'platforms',
    artwork: {
      code: 'PAGE / STORE',
      notation: 'SCOPE / PRICE',
    },
    body: [
      'Two quotes for a small business website can be far apart and both be fair, because they are often quotes for different jobs. A 5-page site for a service business and an online store with a checkout are not the same amount of work. At Burgama, websites for service businesses and nonprofits start at $1500 and ecommerce websites start at $2450. Those are what our Austin studio charges, and they are reference points, since every proposal is custom. Here is what moves the number up or down.',
      'Three things move the price more than anything else. The first is how many pages there are, because each page has to be designed, written and checked on a phone. The second is whether the site sells anything. A store adds products, payments and a checkout that has to be tested. The third is who writes the words. If you arrive with finished copy, the build is faster. If the studio writes it, that is real work and it belongs in the quote. Ask any designer which of the three their price assumes.',
      'Our $1500 site is for service businesses and nonprofits that need a clear, credible home online. It is a custom, mobile-friendly website of up to 5 pages with SEO basics, LocalBusiness and FAQ schema, a contact or booking form, analytics setup, two rounds of revisions and redirects from your old site. Extra pages are billed at $100 an hour. It suits a business whose site needs to explain what it does, show that it is real and make it easy to get in touch.',
      'The $2450 ecommerce website is a custom Shopify store. The store structure is planned for one-time and subscription purchases. You get a custom homepage, shop, product, about, contact and FAQ pages, copywriting for the main pages, three custom rendered images, checkout and payment testing, page speed work, redirects from your old site and 30 days of monitoring after launch. A first draft takes about 4 to 6 weeks. Larger catalogs and extra integrations are scoped in the proposal, which is where a store’s price usually grows.',
      'The hidden cost of a cheap redesign is not on the invoice. It is the Google traffic you can lose when old pages vanish. Every page on your current site has an address Google already knows, and some of those addresses have earned rankings. Google’s own guidance for moving a site recommends permanent redirects from the old URLs to the new ones, so its signals transfer. On every build we keep or redirect every old URL. When you compare quotes, ask each one what happens to your existing pages. If the answer is vague, the low price is not the real price.',
      'You may not need a studio at all. Builders like Squarespace are good products, and for a business whose website mostly needs to exist, look credible and let people get in touch, a template you maintain yourself can be the whole job. We wrote about how to tell when you have outgrown one in an earlier article, Squarespace vs a custom website. The short version: if the site is acceptable on a phone and does everything you need, stay where you are and put the money into marketing instead.',
      'Before you ask anyone for a quote, have a few things ready. A list of the pages you think you need. Whether you will sell online, and roughly how many products. Who is writing the words and supplying the photos. Access to your domain and your current site. Two or three sites you like, with a sentence on why. A quote built on those answers will be closer to the final bill than one built on a guess, and it lets you compare two studios on the same job.',
      'One note on how the money moves, so there are no surprises. Our projects are billed half at kickoff and half on delivery, and a build starts with a discovery call followed by a custom proposal. Websites we have built include 10 Pillar Productions, Hiking Pony and AVRO, and each has a case study on our site. And if your current site already loads well on a phone, says what you do and brings in enquiries, the cheapest website is the one you already have. We will tell you so.',
    ],
    internalLink: {
      href: '/services/website-design',
      label: 'See website design and pricing',
    },
    sources: [
      {
        label: 'Google Search Central: How to move a site',
        href: 'https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes',
      },
    ],
  },
  {
    slug: 'klaviyo-pricing-and-first-flows',
    issue: '10',
    title: 'Klaviyo pricing: what it costs and the flows to build first',
    metaTitle: 'Klaviyo pricing: what it costs and what to build first',
    metaDescription:
      'Klaviyo charges by the size of your list, so the cost only makes sense once the automated flows earn it back. How pricing works and which flows come first.',
    targetKeyword: 'klaviyo pricing',
    categories: ['Email Marketing', 'Ecommerce', 'Shopify'],
    deck: 'Klaviyo charges by the size of your list, so the cost only makes sense once the automated flows earn it back. How pricing works and which flows come first.',
    theme: 'cyan',
    visual: 'email',
    artwork: {
      code: 'LIST / FLOW',
      notation: 'COST / RETURN',
    },
    body: [
      'Klaviyo charges by the size of your list, not by how much you sell. On its pricing page you select your number of active profiles, which Klaviyo defines as any contact in your database that you can market to, and the price moves with that number. When we read the page in November 2026, the free plan covered up to 250 active profiles and 500 emails per month, and the Email plan was listed at $20 a month for 500 active profiles and 5000 emails per month. Prices change, so read the page itself before you budget.',
      'That structure has a consequence. Your bill grows as your list grows, whether or not those people buy anything. A list of contacts who never hear from you is a cost and nothing else. So the question is less what Klaviyo costs and more what the list is doing to earn it. In our experience the answer is the automated emails, which Klaviyo calls flows. Until those are built, a store is paying for a tool that can do far more than it is being asked to do.',
      'Klaviyo sends two kinds of email. A campaign is one message you write and send to a group on a day you choose: a launch, a sale, a newsletter. A flow is a series that sends itself when a person does something, such as joining the list or leaving a cart. Campaigns take effort every time. Flows are built once and keep running. Both matter, but for a small team the flows come first, because they follow up with people on the days you are too busy to write anything.',
      'There are six flows worth knowing, and it helps to take them in the order a customer meets them. The welcome flow is the first emails a new subscriber gets. Abandoned cart reminds a shopper who added something and left before paying. Browse abandonment follows up with people who looked at a product and went no further. Post-purchase is what a customer hears from you after they buy. Replenishment prompts a reorder around the time the product runs out. Winback gives customers who have gone quiet a reason to return.',
      'Build the welcome flow and the abandoned cart flow first. Both reach people at the moment they are most interested: one has just asked to hear from you, the other was a step from paying. Post-purchase comes next, because a customer who hears nothing after an order has little reason to come back. Replenishment and winback need order history to work with, so they can wait until you have some. Browse abandonment fits anywhere after the first two. A store with only the first two running is already following up where it used to go silent.',
      'SMS comes after the flows, not before. On Klaviyo’s pricing page, SMS and MMS are listed as an add-on to the paid plans, so texting is an extra line on the bill. A text also lands somewhere more personal than an inbox, so it should carry a message you already know people want. Once the flows show you which emails people act on, you know what is worth a text. Collect phone numbers with consent in the meantime, and decide what to send them later.',
      'None of this works without people joining the list, so the signup form comes before everything. If your popup collects an email and then sends the shopper off to their inbox to hunt for a code, fix that first. We covered the structure in an earlier article, How to build an email popup people actually use. A welcome flow that nobody enters is a flow you built and will never see send, and no amount of clever writing inside it changes that.',
      'If you would rather have it built for you, our Email Marketing Foundation is $1900 and takes about 5 to 6 weeks. It covers the core flows in your own Klaviyo account, which are welcome, abandoned cart, browse abandonment, post-purchase, replenishment and winback, plus SMS signup and a campaign calendar for what to send next. That is the price at our Austin studio, and it is a reference point, since every proposal is custom. Our email work for MatchDay and Patent Earth is on the site as case studies.',
      'You may not need Klaviyo, or us, yet. If your list fits inside the free plan and you send a note now and then, the free plan is the right price. If the store has very few visitors, flows have nobody to follow up with, and the money is better spent on getting visitors first. Klaviyo starts to earn its fee when people are joining the list every week and leaving carts behind. That is the point to build the foundation, and not before.',
    ],
    internalLink: {
      href: '/services/email-marketing',
      label: 'See the email marketing foundation',
    },
    sources: [
      { label: 'Klaviyo: Pricing', href: 'https://www.klaviyo.com/pricing' },
    ],
  },
  {
    slug: 'hire-a-social-media-manager',
    issue: '11',
    title: 'How to hire a social media manager for a small business',
    metaTitle: 'How to hire a social media manager for a small business',
    metaDescription:
      'When to hire a social media manager, what to ask a freelancer or an agency before you sign, and how to judge the first month on what you actually get.',
    targetKeyword: 'hire social media manager',
    categories: ['Business Strategy', 'Client Process'],
    deck: 'When to hire a social media manager, what to ask a freelancer or an agency before you sign, and how to judge the first month on what you actually get.',
    theme: 'cyan',
    visual: 'audit',
    artwork: {
      code: 'MAKE / REPLY',
      notation: 'PITCH / MONTH',
    },
    body: [
      'Hire a social media manager when the posting is already happening and the replies are not. If comments and messages sit for days while the feed looks busy, the account has outgrown the spare hour you give it. Then judge whoever you hire on the month you actually get, not on the pitch. The rest of this article is how to tell which kind of help you need, what to ask before you sign, and how to test the arrangement for a month before you commit to anything longer.',
      'First, the honest case for not hiring anyone. Nobody knows the business like the people inside it. The owner who films a short clip at the counter, or the employee who knows every regular by name, will often make better content than an outsider with a nicer camera. If someone on your team enjoys it, posts most weeks and answers people the same day, keep it in-house and spend the money somewhere else. Outside help is for when the work has stopped fitting into anyone’s week.',
      'It helps to see that social media is really three jobs. Making is the filming, the design and the captions. Posting is the calendar: getting the right piece out on the right day, on each platform, with the audio, tags and location it needs. Replying is everything after that: comments, direct messages, tags and mentions. Making gets the attention because everyone can see it. Replying slips first, because nobody sees an unanswered message except the person who sent it, and that person was often close to booking or buying.',
      'There are three ways to get help. A freelancer is one person, usually strongest at one of the three jobs, and a good fit when you need a steady hand on the making or the posting and can keep the replies yourself. An in-house hire is inside the business all day and catches the moments nobody outside would see, but it is still one person covering three jobs, and you manage them. An agency brings a team, so planning, making and replying sit with different people, and you are paying for that coverage. None of the three is right for everyone.',
      'Whichever you lean toward, ask the same four questions before you hire. Who makes the content, and do they need you on camera or on site to do it? Who replies to comments and messages, on which days, and how fast? What do you approve before it goes live, and what happens when you are slow to approve? What does the report show, and how often does it arrive? A good candidate answers all four without reaching for adjectives. If the answer to the reply question is vague, assume replying is not included.',
      'For a reference point, here is what a managed month looks like with us. Burgama is a studio in Austin, and our Social Media Management is $2500 a month. That covers Reels and posts every week across Instagram, Facebook and TikTok plus a LinkedIn post, at least one Story every day, and a community manager on your accounts every weekday, with every comment and message answered within 24 hours. You approve a monthly content calendar, and nothing goes live without your sign-off. Our social work for Hush Hush Tan and MatchDay is published as case studies on our site.',
      'One part of that month is worth explaining, because it is a fair test of whether a manager knows the platform. Instagram has a feature called trial reels. By Instagram’s own description, a trial reel is shown to people who do not follow you first, and your followers will not see it in their feed or the Reels tab unless you later share it with everyone. For accounts that have the feature, we post 3 a week, re-testing content that has already done well so it can reach new people with no new filming. Ask any candidate how they would use it.',
      'Whoever you choose, treat the first month as the trial, whatever the agreement says. We recommend a first term of three months on our own retainers, and the first month is still where you find out. Before it starts, write down what you will check: how many pieces went out against the calendar you approved, how long comments and messages waited for a reply, and whether the report told you something you could act on. Read the account the way a customer would. A month is too short to judge growth and long enough to judge habits.',
      'If the habits are there at the end of the month, keep going. If you spent week three chasing drafts, you have your answer, and it is better to have it early. And if the month shows that you only needed one of the three jobs covered, hire for that one. Plenty of businesses need someone to reply and nothing else. Sometimes the right hire is smaller than the one you went looking for.',
    ],
    internalLink: {
      href: '/services/social-media-management',
      label: 'See how we manage social',
    },
    sources: [
      {
        label: 'Instagram for Creators: Trial reels',
        href: 'https://creators.instagram.com/blog/instagram-trial-reels',
      },
    ],
  },
  {
    slug: 'how-much-does-seo-cost',
    issue: '12',
    title: 'How much does SEO cost for a local business?',
    metaTitle: 'How much does SEO cost for a local business?',
    metaDescription:
      'What local SEO costs as a one-time setup and as monthly work, what a quote should list line by line, and what you can do yourself this week for free.',
    targetKeyword: 'how much does seo cost',
    categories: ['SEO', 'Business Strategy'],
    deck: 'What local SEO costs as a one-time setup and as monthly work, what a quote should list line by line, and what you can do yourself this week for free.',
    theme: 'navy',
    visual: 'sitemap',
    artwork: {
      code: 'ONCE / MONTHLY',
      notation: 'QUOTE / WORK',
    },
    body: [
      'The short answer, from our own price list: a one-time local setup costs hundreds of dollars and ongoing work costs four figures a month. At Burgama that is $750 once, or $1500 a month. We are a studio in Austin, and those are the prices we publish. But the price matters less than whether the quote names the work. Two quotes for the same amount can describe completely different months, and a cheaper quote that lists nothing is not the better deal.',
      'Quotes vary so much because SEO is not one job. For one business it means fixing a Google Business Profile that nobody has touched in years. For another it means repairing a site that Google cannot read properly, or writing pages for services that have no page at all. A quote is only comparable to another quote when both say which of those jobs are included. One thing no quote can honestly include is a position. Google’s own guidance on hiring an SEO says it plainly: "No one can guarantee a #1 ranking on Google."',
      'It helps to split the work into two kinds. One-time work is setup: completing the Google Business Profile, fixing what is broken on the site, getting your name, address and phone number to match across directory listings, and putting a system in place for asking customers for reviews. It has an end. Monthly work is what continues after that: research into what people search and what competitors are doing, new pages, cleaning up old listings, and reporting on what changed. If a monthly quote is mostly setup, it should stop being monthly once the setup is done.',
      'So ask for the quote line by line. Which pages will be written or fixed, and how many? Which directories? Who owns the Google Business Profile afterward? What does the report contain, and how often does it arrive? Google suggests a few questions of its own for anyone hiring an SEO: ask for examples of previous work, ask what results they expect and in what timeframe, and ask how they measure success. A provider who does real work can answer those in a sentence each. Be careful with one who answers with a promise.',
      'Some of this costs nothing, and you can do it this week. Google’s help page on local ranking says results are based mainly on relevance, distance and prominence, and that businesses with complete and accurate information are more likely to show up. So verify your profile, fill in every field, keep your hours current including holidays, add real photos, and reply to your reviews. The same page says there is no way to pay Google for a better local ranking. Anyone can do the basics, and the basics are where most of the early gain is.',
      'Here is what our one-time price covers. The Local Search Starter is $750 and is delivered in 30 days. It includes your Google Business Profile completed, a review request system, three new pages for the searches that bring you customers, a sitemap, LocalBusiness schema and contact form tracking, listings on 10 relevant directories, and a before and after report at 30 days. It is built for a business whose foundations were never set up, and for many small businesses it is all the paid SEO they need for a while.',
      'The monthly option is the Local SEO and AI Visibility Foundation at $1500 a month, with a three-month first term and then month to month. It covers the Google Business Profile buildout, technical SEO on the site you already have, keyword and competitor research, AI search work, citation cleanup, and weekly and monthly reporting. The first term is three months because SEO takes about 90 days to show real movement, and anyone who promises faster is overselling. Our search work for MatchDay is one of the case studies on our site.',
      'AI answers are part of the same job now. When someone asks ChatGPT or reads a Google AI Overview instead of scrolling results, the answer is built from the same raw material: your site, your business details and what other sites say about you. The work that helps is structured FAQ content, schema and consistent details everywhere your business is listed. A quote written this year should say whether that is included. It should not appear as a separate, expensive mystery line.',
      'Finally, when not to pay for monthly SEO yet. If your profile is unverified, your hours are wrong and you have a handful of reviews, do the free work first, or pay for a one-time setup and see what it changes. If most of your customers come by referral and do not search before they call, monthly SEO is a slow way to spend money. And if you cannot give it three months, wait until you can. Sometimes the right amount to spend on SEO this quarter is nothing.',
    ],
    internalLink: {
      href: '/services/local-seo',
      label: 'See what our Austin SEO includes',
    },
    sources: [
      {
        label: 'Google Business Profile Help: Tips to improve your local ranking on Google',
        href: 'https://support.google.com/business/answer/7091',
      },
      {
        label: 'Google Search Central: Do you need an SEO?',
        href: 'https://developers.google.com/search/docs/fundamentals/do-i-need-seo',
      },
    ],
  },
  {
    slug: 'how-much-does-a-logo-and-brand-identity-cost',
    issue: '13',
    title: 'How much does a logo and brand identity cost?',
    metaTitle: 'How much does a logo and brand identity cost?',
    metaDescription:
      'A logo alone is the cheap part. What a brand identity includes, what ours costs, what our own rename taught us, and when you do not need a rebrand.',
    targetKeyword: 'logo design cost',
    categories: ['Business Strategy', 'Copywriting'],
    deck: 'A logo alone is the cheap part. What a brand identity includes, what ours costs, what our own rename taught us, and when you do not need a rebrand.',
    theme: 'cyan',
    visual: 'reviews',
    artwork: {
      code: 'MARK / RULES',
      notation: 'LOGO / SYSTEM',
    },
    body: [
      'A logo alone is the cheap part. You can get one almost anywhere, at almost any price. What you are paying for in a brand identity is the thinking that makes the logo right and the rules that keep it consistent once other people start using it. At Burgama a brand identity is $3900. Whether you need to spend that, or anything close to it, depends on what you already have and on how many places your brand has to show up.',
      'There are roughly three ways to get a logo. A template or logo maker gives you a file quickly, and that is all it gives you: a mark that other businesses may be using too, with no reasoning behind it. A freelance designer gives you an original mark and usually a few variations, and how much thinking comes with it depends on the person and the brief. A studio gives you the mark as one part of a system, with the positioning that led to it and the rules for using it. Each is a fair choice at a different stage.',
      'So what is in a brand identity? It starts with positioning, which is not design at all. It is the written answer to what sets you apart and how to say it so the right people remember. Without it, a logo is a matter of taste, and every round of feedback becomes an argument about which version someone likes. With it, there is something to test the design against. Then comes the logo and wordmark, drawn to hold up at every size, from a favicon to a storefront sign.',
      'Color and type come next: a palette and typefaces that hold together everywhere the brand appears, so your website, your invoice and your sign look related. Then the logo files themselves, in the formats a printer and a developer will each ask for, which is the part people miss most when they only have one small image saved from an old email. And last, brand guidelines: the usage rules your team and vendors can follow. Guidelines are what stop the brand drifting apart the first time someone outside the business makes something for you.',
      'Our price for all of that is $3900 for the project: positioning, a logo and wordmark, color palette and type, logo files for web and print, and brand guidelines, with two rounds of revisions included. The people shaping the strategy are the ones making the work, so nothing is handed from a strategist to a designer you never meet. Every proposal is custom, so treat the number as a reference point. Sidecar Spirits, Harvest Dating and Wurqly are three identities we have published on our site.',
      'We have also been our own client. We were founded as Cedar & Cactus in 2025 and renamed ourselves Burgama in September 2026, because the Austin-rooted name no longer fit work that reaches past Texas. The hard part was not the logo. It was moving everything that carried the old name. Old URLs had to be redirected, Google had to be told about the move, and every profile had to be made to say the same thing. That is the unglamorous part of a rebrand, and it is where a rename either keeps what the business has built or loses it.',
      'Google’s documentation on moving a site reads like a checklist for that work: use permanent redirects from each old address to its new one, keep them in place for at least a year, and update as many links as you can, including social and profile links. If you are budgeting for a rebrand, budget for this as well as the design. A new name with the old one still scattered across directories and profiles confuses customers and search engines alike, and it is far easier to plan the move than to repair it afterward.',
      'You may not need a rebrand at all. If people recognize you, your materials look consistent and the name still describes what you do, a new logo is a cost with no return. Often the real problem is smaller: nobody can find the original files, or there are no rules, so every flyer looks different. That calls for a cleanup and a set of guidelines. Rebrand when the name or the look is actively wrong for where the business is going. Being a little tired of it is not enough.',
      'One last distinction: packaging is its own job. An identity tells you what the brand looks like. Packaging has to apply that across sizes, flavors and formats, to a printer’s specifications, and be readable at a glance on a shelf. We quote packaging design per project after a discovery call, because the price depends on how many products are in the line, and it has its own page on our site at burgama.com/services/packaging-design. If you sell a physical product, plan for both, in that order.',
    ],
    internalLink: {
      href: '/services/brand-identity',
      label: 'See brand identity and pricing',
    },
    sources: [
      {
        label: 'Google Search Central: Site moves with URL changes',
        href: 'https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes',
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
