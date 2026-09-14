export type Tone = 'surface-1' | 'surface-2' | 'surface-3' | 'periwinkle'
export type Discipline = 'Brand' | 'Web' | 'Marketing' | 'Content' | 'Production' | 'Growth' | 'Photography'
export type MediaRatio = 'wide' | 'landscape' | 'tall' | 'square' | 'full'
export type MediaItem = { label: string; ratio: MediaRatio; tone?: Tone; src?: string }
export type ContentModule =
  | { type: 'text'; title?: string; body: string[] }
  | { type: 'media'; item: MediaItem }
  | { type: 'mediaPair'; items: [MediaItem, MediaItem] }
  | { type: 'mediaSplit'; split: '60/40' | '40/60'; title: string; body: string[]; item: MediaItem }
  | { type: 'mediaGrid'; items: MediaItem[] }
  | { type: 'quote'; body: string }
  | { type: 'process'; title: string; steps: { title: string; body: string }[] }

export type PortfolioCollection = 'featured' | 'case-study' | 'archive'
export type Project = {
  id: string
  slug: string
  title: string
  client: string
  summary: string
  tagline: string
  disciplines: Discipline[]
  services: string[]
  heroMedia: MediaItem
  contentModules: ContentModule[]
  credits: { role: string; name: string }[]
  links: { label: string; href: string }[]
  collection: PortfolioCollection
  parentSlug?: string
  status?: string
  source?: string
  period?: string
  note?: string
}

type Input = Omit<Project, 'id' | 'client' | 'heroMedia' | 'credits' | 'links' | 'collection'> & Partial<Pick<Project, 'client' | 'heroMedia' | 'credits' | 'links' | 'collection'>>
const project = (input: Input): Project => ({
  id: input.slug, client: input.title, heroMedia: { label: '', ratio: 'full' },
  credits: [], links: [], collection: 'archive', ...input,
})
const image = (company: string, file: string, label: string, ratio: MediaRatio = 'wide'): MediaItem => ({ src: `/work/${company}/${file}`, label, ratio })
const text = (title: string, ...body: string[]): ContentModule => ({ type: 'text', title, body })
const media = (company: string, file: string, label: string, ratio: MediaRatio = 'wide'): ContentModule => ({ type: 'media', item: image(company, file, label, ratio) })
const pair = (company: string, a: [string, string], b: [string, string]): ContentModule => ({ type: 'mediaPair', items: [image(company, ...a), image(company, ...b)] })

export const projects: Project[] = [
  project({
    slug: 'wagner-wealth', title: 'Wagner Wealth Management', collection: 'featured',
    tagline: 'A composed identity for a personal practice.',
    summary: 'An angular monogram, a restrained identity, and a website for a personal wealth-management practice.',
    disciplines: ['Brand', 'Web', 'Production'], services: ['Visual identity', 'Website', 'Founder film'],
    heroMedia: image('wagner-wealth', 'a093.jpg', 'Embossed business-card design mockup in Wagner’s plum colorway.', 'square'),
    contentModules: [
      text('a personal practice, a precise identity.', 'We built the identity around an angular monogram and a deep plum palette. The system gives Wagner Wealth Management a consistent visual language across its digital presence and everyday touchpoints.'),
      media('wagner-wealth', 'a090.jpg', 'The geometric monogram in the supplied plum colorway.'),
      text('beyond the mark.', 'Card, letterhead, and apparel concepts extend the identity into a family of applications. These are design mockups, not photographs of manufactured items.'),
      pair('wagner-wealth', ['a094.jpg', 'Letterhead and correspondence design mockup.'], ['a095.jpg', 'Polo application shown as a design mockup.']),
      text('a quieter digital presence.', 'The website carries the same visual language into service information and a consultation path. A founder film was developed as a companion to the practice’s story; its final export remains pending.'),
      media('wagner-wealth', 'web-wagner.jpg', 'Website presentation for the advisory practice.'),
    ],
    links: [{ label: 'visit the website', href: 'https://www.wagnerwealthtx.com/' }],
    note: 'Founder film: supplied draft, final approved export pending. Website and identity work are presented here without investment-performance claims.',
  }),
  project({
    slug: 'sidecar-spirits', title: 'Sidecar Spirits', collection: 'featured',
    tagline: 'A richly drawn identity with a practical system.',
    summary: 'An illustrated emblem, expressive wordmark, and a family of colorways for Sidecar Spirits.',
    disciplines: ['Brand'], services: ['Visual identity', 'Logo system', 'Color and typography'],
    heroMedia: image('sidecar-spirits', 'sidecar-primary.jpg', 'Sidecar Spirits’ finished full-color primary emblem.', 'tall'),
    contentModules: [
      text('character in every detail.', 'The illustrated emblem anchors the identity. Its detailed drawing and expressive lettering create a distinctive visual vocabulary, with navy, gold, orange, and bone forming the core palette.'),
      pair('sidecar-spirits', ['sidecar-gold.jpg', 'Gold-and-navy emblem for limited-color applications.'], ['sidecar-orange.jpg', 'Orange-and-bone alternate from the finished identity system.']),
      text('one identity. more ways to use it.', 'Full-color, two-color, and monochrome versions give the emblem room to work across different formats. Separate display, label, and body type roles keep the expressive direction practical.'),
      pair('sidecar-spirits', ['sidecar-mono.jpg', 'Finished monochrome identity mark.'], ['sidecar-wordmark.jpg', 'The supplied wordmark with its establishment line.']),
    ],
  }),
  project({
    slug: 'harvest-dating', title: 'Harvest Dating', collection: 'featured',
    tagline: 'An identity rooted in intentional connection.',
    summary: 'An apple-and-heart symbol, expressive typography, and a plum-and-red palette connecting digital touchpoints.',
    disciplines: ['Brand'], services: ['Visual identity', 'App-icon applications', 'Social design system'],
    heroMedia: image('harvest-dating', 'pdf-6-8.jpg', 'Harvest’s plum-and-red identity applied across three vertical social-story compositions.', 'wide'),
    contentModules: [
      text('a recognizable starting point.', 'We gave the idea of intentional dating a recognizable visual form. The apple-and-heart symbol is the central identifier, working alongside the Harvest wordmark and independently at smaller scales.'),
      media('harvest-dating', 'pdf-6-6.jpg', 'Logo construction documented in the brand guide.'),
      text('from logo to app icon.', 'The same symbol connects the primary identity, social stories, and app-icon mockups. Each application changes in scale and format while retaining the relationship between mark, color, and type.'),
      pair('harvest-dating', ['pdf-6-8.jpg', 'Vertical social-story identity applications.'], ['pdf-6-10.jpg', 'App-icon identity mockup; not a developed application.']),
      text('a system with defined roles.', 'Headline, label, and body treatments establish a clear hierarchy. Plum, red, and supporting tones give different compositions a shared visual structure.'),
      pair('harvest-dating', ['pdf-6-14.jpg', 'Typography hierarchy from the supplied guide.'], ['pdf-6-17.jpg', 'The identity’s defined color palette.']),
    ],
    source: 'Harvest Dating — Brand Guide Version 2.0 (Plum), pp. 4, 6, 8, 10, 14, 17.',
    note: 'App screens are identity applications, not evidence of app development. The accompanying design analysis is editorial, not an independent research study.',
  }),
  project({
    slug: 'go2bites', title: 'Go2Bites', collection: 'featured',
    tagline: 'Making the product part of everyday life.',
    summary: 'Product photography, everyday scenes, an online store, and a founder film telling one connected product story.',
    disciplines: ['Web', 'Photography', 'Production'], services: ['Website', 'Product and lifestyle photography', 'Founder film'],
    heroMedia: image('go2bites', 'a172.jpg', 'Five Go2Bites flavors photographed as a product range.'),
    contentModules: [
      text('start with the product.', 'A clear view of the range establishes the packaging. Ingredient-led compositions then bring individual products into focus, giving each photograph a different job within the collection.'),
      media('go2bites', 'a153.jpg', 'Lemon Cashew Coconut with ingredients and packaging.'),
      text('bring it into everyday life.', 'Kitchen and outdoor scenes place the product in recognizable settings. The sequence moves from product recognition to moments of use, rather than repeating the same package angle.'),
      pair('go2bites', ['a116.jpg', 'A kitchen scene places the product in a family setting.'], ['a165.jpg', 'An outdoor product moment.']),
      pair('go2bites', ['a129.jpg', 'Founder and product portrait from the supplied collection.'], ['a155.jpg', 'Package-in-hand detail from the photography sequence.']),
      text('connect the pictures to the story.', 'The online store connects the photography with product discovery and shopping. A kitchen-set founder interview adds the person behind the brand to the experience.'),
      media('go2bites', 'web-go2bites.jpg', 'Go2Bites online store: product discovery, brand story, and shopping.'),
      media('go2bites', 'film-go2bites.jpg', 'Founder interview still from the supplied 110.4-second film.'),
    ],
    links: [{ label: 'visit the website', href: 'https://go2bites.com/' }, { label: 'watch the founder film', href: 'https://drive.google.com/file/d/1_p5yYQ7Zkrr1NM2VmrIDJyIDZzpTgRvj/view' }],
  }),
  project({
    slug: 'cellinkey', title: 'CellinKey', tagline: 'A tactile world around the product.',
    summary: 'Directional light, warm stone, and saturated sets give the skincare range a cohesive photographic character.',
    disciplines: ['Photography', 'Web'], services: ['Product photography', 'Website'],
    heroMedia: image('cellinkey', 'a000.jpg', 'The product range arranged in warm directional light.'),
    contentModules: [text('light, texture, contrast.', 'The photography keeps the packaging prominent while varying the surrounding mood. Warm stone arrangements and saturated red sets create a tactile visual world around the range.'),
      pair('cellinkey', ['a017.jpg', 'Product photographed with a suspended powder effect.'], ['a041.jpg', 'White pump bottle in a warm stone setting.']),
      pair('cellinkey', ['a052.jpg', 'White tube and foliage on a red set.'], ['a073.jpg', 'Blue bottle study with directional light and stone.']),
      media('cellinkey', 'a088.jpg', 'Dark serum bottle in a sculptural setting.')],
    links: [{ label: 'visit the website', href: 'https://www.cellinkeyskincare.com/' }],
  }),
  project({
    slug: 'matchday', title: 'MatchDay', tagline: 'Bringing the pickup game into view.',
    summary: 'City-specific social content, local search pages, and campaigns for a pickup-soccer community.',
    disciplines: ['Marketing', 'Content', 'Growth', 'Photography'], services: ['Social media management', 'SEO', 'Photography', 'Content creation', 'Meta and Google Ads'],
    heroMedia: image('matchday', 'a112.jpg', 'The refreshed MatchDay Instagram profile and city highlights.', 'tall'),
    contentModules: [text('the game, beyond the pitch.', 'We brought a consistent visual identity to Instagram and TikTok, pairing gameplay with stories from individual cities. Local search pages supported discovery around pickup soccer, while paid campaigns added distribution across active markets.'), text('two sides of discovery.', 'The focused social study follows the visual refresh and platform reporting. The search study explains the city-page structure; its performance figures remain unpublished pending underlying Search Console evidence.')],
    links: [{ label: 'view selected Instagram content', href: 'https://www.instagram.com/reel/DbObtvtR6Gt/' }, { label: 'view selected TikTok content', href: 'https://vt.tiktok.com/ZS4NTX3rn/' }],
  }),
  project({
    slug: 'hush-hush-tan', title: 'Hush Hush Tan', tagline: 'A refreshed brand, carried into the feed.',
    summary: 'A coordinated social relaunch through education, seasonal promotions, and client-centered content.',
    disciplines: ['Marketing', 'Content'], services: ['Social media management'],
    heroMedia: image('hush-hush-tan', 'a109.jpg', 'The refreshed Hush Hush Tan social profile.', 'tall'),
    contentModules: [text('a more coherent daily presence.', 'We aligned the content calendar and visual presentation with the refreshed brand direction. Educational tanning content, seasonal messages, and client moments gave the channels a regular publishing rhythm.')],
  }),
  project({
    slug: 'clement-senior-solutions', title: 'Clement Senior Solutions', tagline: 'A clearer path from local search to support.',
    summary: 'Website improvements and foundational local SEO for senior-living guidance in Austin.',
    disciplines: ['Web', 'Growth', 'Content'], services: ['Website optimization', 'Local SEO', 'Social content'],
    heroMedia: image('clement-senior-solutions', 'web-clement.jpg', 'Clement website presentation; site imagery includes AI-generated illustrations.'),
    contentModules: [text('make the next step clearer.', 'Service-page structure, metadata, headings, accessibility tagging, and local keyword targeting formed the foundation of the work. Website updates addressed navigation and the company’s presentation.'), text('early visibility, in context.', 'The focused local-search study documents the initial keyword footprint. Search-tool estimates are kept separate from measured enquiries, consultations, and revenue.')],
    links: [{ label: 'visit the website', href: 'https://www.clementseniorsolutions.com/' }, { label: 'view selected social content', href: 'https://www.instagram.com/reel/DZ3SSzZp6ku/' }],
    note: 'AI-generated site imagery is illustrative, not documentary photography of clients.',
  }),
  project({
    slug: 'wurqly', title: 'Wurqly', tagline: 'A clear front door for field operations.',
    summary: 'A product-focused website and vivid visual presentation for a field-service platform.',
    disciplines: ['Web', 'Brand'], services: ['Website', 'Visual presentation'],
    heroMedia: image('wurqly', 'web-wurqly.jpg', 'Wurqly’s blue-and-dark website presentation.'),
    contentModules: [text('clarity before complexity.', 'The website introduces the platform through work-order examples, service coverage, and organized feature information. Visitors can move from the broad proposition toward a sales conversation or signup.'), text('the scope.', 'This project presents the website and its visual direction. It does not claim development of the operational platform, insurance services, or payment functionality.')],
    links: [{ label: 'visit the website', href: 'https://wurqly.com/' }],
  }),
  project({
    slug: 'hiking-pony', title: 'Hiking Pony', tagline: 'Product discovery with an outdoor point of view.',
    summary: 'An online shopping experience connecting the coffee range, brand story, and everyday rituals.',
    disciplines: ['Web', 'Photography'], services: ['Website', 'Photography'],
    heroMedia: image('hiking-pony', 'web-hiking-pony.jpg', 'Hiking Pony website and product-range presentation.'),
    contentModules: [text('an outdoor point of view.', 'The site connects an outdoor visual direction with product-led sections, ingredient information, recipes, and retail links. Navigation brings the product range and the brand story together.'), text('website selection.', 'This page presents the supplied website capture. The separate photography collection is not reproduced here while individual selections await source access.')],
    links: [{ label: 'visit the website', href: 'https://hikingpony.com/' }],
  }),
  project({
    slug: 'smoothsailing', title: 'Smoothsailing Sustainability', tagline: 'A broad consultancy. A clear structure.',
    summary: 'A service-led website organizing a sustainability consultancy’s areas of expertise.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('smoothsailing', 'web-smoothsailing.jpg', 'Smoothsailing’s homepage and consultancy service structure.'),
    contentModules: [text('a clearer way through.', 'The homepage connects the consultancy’s positioning with defined service categories, an explanation of its approach, and a route to contact. A sailboat illustration gives the content a distinctive setting.')],
    links: [{ label: 'visit the website', href: 'https://smoothsailingsustainability.com/' }],
  }),
  project({
    slug: '10-pillar-productions', title: '10 Pillar Productions', tagline: 'A home for work made to be watched.',
    summary: 'A portfolio website bringing films, commercial work, and booking information together.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('10-pillar-productions', 'web-10-pillar.jpg', 'The production company’s portfolio website.'),
    contentModules: [text('let the work lead.', 'Film and commercial categories organize the portfolio, while an About page, events section, and booking route support visitors exploring the company or discussing a project.')],
    note: 'Burgama’s scope is the website. Film production displayed on that site belongs to 10 Pillar Productions unless separately credited.',
    links: [{ label: 'visit the website', href: 'https://www.10pillarproductions.com/' }],
  }),
  project({
    slug: 'alh-senior-solutions', title: 'ALH Senior Solutions', tagline: 'Making the next step easier to find.',
    summary: 'A Lending Hand’s senior-placement guidance, presented through services, resources, and a clear consultation path.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('alh-senior-solutions', 'web-alh.jpg', 'A Lending Hand Senior Solutions website presentation.'),
    contentModules: [text('information with a clear next step.', 'The homepage organizes the company’s story around the questions families bring to senior-living decisions. Services, FAQs, resources, and a consultation route help visitors move from introduction toward conversation.')],
    links: [{ label: 'visit the website', href: 'https://www.alhseniorsolutions.com/' }],
  }),
  project({
    slug: 'dr-saba-syed', title: 'Dr. Saba Syed', tagline: 'A personal practice with a clear invitation.',
    summary: 'A direct introduction to Dr. Syed’s coaching and speaking work.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('dr-saba-syed', 'web-dr-saba-syed.jpg', 'Dr. Saba Syed’s coaching and speaking website.'),
    contentModules: [text('a direct introduction.', 'The page introduces Dr. Syed’s background and the people she serves, then offers routes to a discovery call, speaking enquiries, and resources. A warm palette and straightforward navigation keep the focus on her practice.')],
    links: [{ label: 'visit the website', href: 'https://www.drsabasyed.com/' }],
  }),
  project({
    slug: 'turant', title: 'TURANT', tagline: 'A digital gathering place for a community.',
    summary: 'Events, membership, and community programs for Turkish Americans in North Texas.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('turant', 'web-turant.jpg', 'TURANT website with community events and membership routes.'),
    contentModules: [text('participation at the center.', 'The homepage connects the association’s history with upcoming events, community imagery, and opportunities to take part. Membership and support routes help visitors find their place in an active community.')],
    credits: [{ role: 'Legacy website attribution', name: 'Cedar & Cactus — as credited on the live site' }],
    links: [{ label: 'visit the website', href: 'https://www.turant.net/' }],
  }),
  project({
    slug: 'avro', title: 'AVRO', tagline: 'One product, several social contexts.',
    summary: 'A supporting content collection spanning a mocktail concept, creator-style content, and a retailer collaboration.',
    disciplines: ['Content', 'Production'], services: ['Social content', 'Video production'],
    contentModules: [text('different moments in the feed.', 'The collection brings the brand into a mocktail-making moment, creator-style storytelling, and a retailer collaboration. Each selection explores a different social context for the product.')],
    status: 'Content selection',
    note: 'The supplied 20.4-second mocktail film remains a draft. Final export and creator credits are pending, so the film is not published here.',
  }),
  project({
    slug: 'patent-earth', title: 'Patent Earth', tagline: 'A compact short-form content feature.',
    summary: 'A selected social reel, presented as an individual content piece rather than a full campaign.',
    disciplines: ['Content'], services: ['Social media content creation'],
    contentModules: [text('one piece of the picture.', 'A short-form Patent Earth reel is the focus of this content selection. The original post is linked below; undated view and sharing counts are not presented as verified campaign results.')],
    links: [{ label: 'view the selected reel', href: 'https://www.instagram.com/reel/DbWC2CTgQ4L/' }],
  }),
  project({
    slug: 'ollivate', title: 'Ollivate', tagline: 'Introducing an education app through paid social.',
    summary: 'App-focused video and static creative paired with audience testing.',
    disciplines: ['Marketing', 'Content'], services: ['Meta Ads', 'Video and static campaign creative'],
    contentModules: [text('a broader creative starting point.', 'The paid-social program combined video and static formats around the app’s proposition. Audience testing gave the campaign different ways to introduce the product, beyond a single boosted post.')],
    note: 'Campaign results are withheld while source dates and underlying reporting are reconciled. Download-link clicks are not completed installs.',
  }),
  project({
    slug: 'cloon', title: 'Cloon', tagline: 'A focused approach to search advertising.',
    summary: 'Intent-based keyword selection, tailored ad copy, and bid management for a Google Search campaign.',
    disciplines: ['Marketing', 'Growth'], services: ['Google Ads'],
    contentModules: [text('start with intent.', 'The campaign approach brought together focused keywords, ad-copy decisions, and bid management. Its aim was to connect searchers with the website while keeping spending controlled.')],
    note: 'Results are not published while a client-name error in the source reporting is resolved. Site clicks should not be described as conversions.',
  }),
  project({
    slug: 'matchday-social', title: 'MatchDay social', client: 'MatchDay', parentSlug: 'matchday', collection: 'case-study',
    tagline: 'A local soccer community. A consistent social presence.',
    summary: 'A shared visual system and city-specific short-form stories across Instagram and TikTok.',
    disciplines: ['Marketing', 'Content'], services: ['Social media management', 'Content creation'], period: 'May 15–October 12, 2025',
    heroMedia: image('matchday', 'a112.jpg', 'MatchDay’s refreshed profile, with a consistent identity and city highlights.', 'tall'),
    contentModules: [
      text('the starting point.', 'The social presence did not fully reflect the active pickup-soccer community. The task was to create a more consistent identity, give individual cities a voice, and make the match experience visible to prospective players.'),
      pair('matchday', ['a114.jpg', 'Before: the earlier Instagram profile.'], ['a112.jpg', 'After: shared identity and city-specific highlights.']),
      text('a system for local stories.', 'Shared colors, typography, reel framing, and city highlights supported a publishing approach around gameplay and local stories. Content pointed toward participation, app downloads, and city communities; these were intended actions, not measured registrations.'),
      text('what the reports show.', 'May 15–October 12, 2025: Instagram recorded 576,649 views, comprising 403,246 organic and 173,403 paid views, alongside 6,555 engagements.', 'For the same period, TikTok recorded 79,576 video views and 2,976 engagements. These totals describe platform visibility and interaction, not attributed registrations or revenue.'),
    ],
    source: 'Match Day Social Media Growth Case Study.docx; supplied Instagram report pp. 3–4 and TikTok report p. 3.',
  }),
  project({
    slug: 'matchday-local-seo', title: 'MatchDay search', client: 'MatchDay', parentSlug: 'matchday', collection: 'case-study',
    tagline: 'Search visibility around where people want to play.',
    summary: 'A city-page strategy connecting local pickup-soccer searches to relevant destinations.',
    disciplines: ['Growth', 'Web'], services: ['Local SEO', 'City-page strategy', 'Technical website improvements'],
    status: 'Source draft · evidence pending', period: 'April 2025–July 2026 (source draft)',
    contentModules: [
      text('the search problem.', 'The SEO brief identified a gap between the app’s offering and its discoverability for local soccer searches. Dedicated city pages and technical site improvements were intended to make local games easier to find.'),
      text('give every search a destination.', 'Austin, San Antonio, Houston, and Dallas each received a relevant city destination. The approach connects geographic intent with a page about playing locally, rather than sending every searcher to the same general introduction.'),
      text('scope, not unverified results.', 'The underlying Search Console export or dated screenshots have not been supplied. Search totals, ranking figures, and growth charts are therefore withheld. This page documents the approach only.'),
    ],
    source: 'MatchDay SEO Case Study.docx, supplied editorial summary. Source draft, April 2025–July 2026.',
  }),
  project({
    slug: 'hush-hush-tan-social', title: 'Hush Hush Tan social', client: 'Hush Hush Tan', parentSlug: 'hush-hush-tan', collection: 'case-study',
    tagline: 'A refreshed beauty brand, in daily use.',
    summary: 'A coordinated feed, educational content, and a regular calendar for a social relaunch.',
    disciplines: ['Marketing', 'Content'], services: ['Social media management', 'Content calendar', 'Community management'],
    heroMedia: image('hush-hush-tan', 'a109.jpg', 'The coordinated feed after the social refresh.', 'tall'),
    contentModules: [
      text('carry the new identity forward.', 'The brand was refreshing its identity while social channels still reflected the previous look. The brief was to make the new direction recognizable to existing clients and understandable to new audiences.'),
      pair('hush-hush-tan', ['a111.jpg', 'Before: the previous profile and visual identity.'], ['a109.jpg', 'After: a more coordinated everyday presence.']),
      text('give the identity a rhythm.', 'The publishing mix combined tanning education, seasonal promotions, transformations, and client moments. Platform-specific scheduling and community management supported the calendar.'),
      text('Instagram: June 1–September 22, 2025.', 'The supplied report records 172,503 views: 121,679 organic and 50,824 paid. It also records 1,426 engagements and 81 net new followers.'),
      text('TikTok: June 1–September 30, 2025.', 'The TikTok report records 65,634 video views and 938 engagements. Its later end date means the two platform reporting windows are not identical.'),
    ],
    source: 'Hush Hush Tan Social Media.docx; supplied HHT Instagram report pp. 3–5 and HHT TikTok report p. 3.',
    note: 'Reported visibility and engagement do not establish booking or revenue uplift. Net follower additions are not total-audience growth.',
  }),
  project({
    slug: 'clement-local-search', title: 'Clement local search', client: 'Clement Senior Solutions', parentSlug: 'clement-senior-solutions', collection: 'case-study',
    tagline: 'An early foothold in local search.',
    summary: 'Clearer service content and foundational local SEO for families looking for guidance around Austin.',
    disciplines: ['Growth', 'Web'], services: ['Local SEO', 'Website optimization'], period: 'November 19, 2025 snapshot',
    heroMedia: image('clement-senior-solutions', 'web-clement.jpg', 'Clement website presentation; AI-generated imagery is illustrative.'),
    contentModules: [
      text('build the foundation.', 'The work refined metadata, page titles, headings, accessibility tags, and keyword placement across core service content. Website updates addressed navigation and company presentation.'),
      text('the observed stage of growth.', 'The supplied November 19, 2025 search-tool snapshot reports seven ranking organic keywords, three improved keywords, and two newly ranked keywords.', '“Senior advisor austin tx” was reported at position 9 after a 13-position improvement. The tool estimated two monthly organic clicks, indicating an early stage rather than a lead-volume breakthrough.'),
      text('keep the result in proportion.', 'Ranking movement and modeled traffic describe an initial search footprint. They are not measured enquiries, consultations, or revenue. Site imagery identified as AI-generated is illustrative, not documentary photography of clients.'),
    ],
    source: 'Clement Senior Solutions SEO & Website Optimization Case Study.docx and supplied screenshots dated November 19, 2025. Figures are SEO-tool estimates.',
  }),
]

export const disciplines: Discipline[] = ['Brand', 'Web', 'Photography', 'Marketing', 'Content', 'Production', 'Growth']
export const portfolioPublications = [
  ...projects.map((item, order) => ({ slug: item.slug, collection: item.collection, published: true, order })),
  { slug: 'athletica', collection: 'archive' as const, published: false, order: projects.length },
]
export function getProject(slug: string) {
  if (!portfolioPublications.some(item => item.slug === slug && item.published)) return undefined
  return projects.find(item => item.slug === slug)
}
export function getPublishedProjects(collection?: PortfolioCollection) {
  return portfolioPublications.filter(item => item.published && (!collection || item.collection === collection))
    .sort((a, b) => a.order - b.order).flatMap(item => {
      const found = getProject(item.slug)
      return found ? [found] : []
    })
}
export const featuredProjects = getPublishedProjects('featured')
export function getRelatedProjects(current: Project) {
  const published = getPublishedProjects()
  const siblings = published.filter(item => item.slug !== current.slug && (item.parentSlug === current.slug || (current.parentSlug && (item.slug === current.parentSlug || item.parentSlug === current.parentSlug))))
  const others = published.filter(item => item.slug !== current.slug && !siblings.includes(item) && item.collection !== 'case-study' && item.disciplines.some(d => current.disciplines.includes(d)))
  return [...siblings, ...others].slice(0, 3)
}
