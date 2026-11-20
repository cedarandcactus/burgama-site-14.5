export type Tone = 'surface-1' | 'surface-2' | 'surface-3' | 'periwinkle'
export type Discipline = 'Brand' | 'Web' | 'Marketing' | 'Content' | 'Production' | 'Growth' | 'Photography' | 'Packaging'
export type MediaRatio = 'wide' | 'landscape' | 'tall' | 'square' | 'full'
export type MediaItem = {
  label: string
  ratio: MediaRatio
  tone?: Tone
  src?: string
  width?: number
  height?: number
  caption?: string
}
export type ProjectStat = { value: string; label: string; accessibleValue?: string }
export type ContentModule =
  | { type: 'text'; title?: string; body: string[]; stats?: ProjectStat[]; source?: string }
  | { type: 'media'; item: MediaItem }
  | { type: 'mediaPair'; items: [MediaItem, MediaItem] }
  | { type: 'mediaSplit'; split: '60/40' | '40/60'; title: string; body: string[]; item: MediaItem }
  | { type: 'mediaGrid'; items: MediaItem[] }
  | { type: 'quote'; body: string; name?: string; role?: string }
  | { type: 'process'; title: string; steps: { title: string; body: string }[] }
  | { type: 'video'; title?: string; body?: string[]; vimeoId: string; label: string; aspect?: number }

export type PortfolioCollection = 'featured' | 'case-study' | 'archive'
export type Project = {
  id: string
  slug: string
  title: string
  client: string
  summary: string
  tagline: string
  disciplines: Discipline[]
  categories?: string[]
  services: string[]
  heroMedia: MediaItem
  cardImage: string
  cardAlt: string
  thumbnailMedia?: MediaItem
  contentModules: ContentModule[]
  credits: { role: string; name: string }[]
  links: { label: string; href: string }[]
  collection: PortfolioCollection
  parentSlug?: string
  status?: string
  source?: string
  period?: string
  note?: string
  closingLine?: string
}

const imageDimensions: Record<string, readonly [width: number, height: number]> = {
  'wagner-wealth/a090.jpg': [1225, 1800],
  'wagner-wealth/a093.jpg': [1254, 1254],
  'wagner-wealth/a094.jpg': [1448, 1086],
  'wagner-wealth/a095.jpg': [1448, 1086],
  'wagner-wealth/web-wagner.jpg': [1280, 720],
  'sidecar-spirits/sidecar-gold.jpg': [981, 1469],
  'sidecar-spirits/sidecar-mono.jpg': [981, 1469],
  'sidecar-spirits/sidecar-orange.jpg': [981, 1469],
  'sidecar-spirits/sidecar-primary.jpg': [981, 1469],
  'sidecar-spirits/sidecar-wordmark.jpg': [533, 270],
  'harvest-dating/pdf-6-4.jpg': [1800, 1258],
  'harvest-dating/pdf-6-6.jpg': [1800, 1249],
  'harvest-dating/pdf-6-8.jpg': [1800, 1258],
  'harvest-dating/pdf-6-10.jpg': [1800, 1258],
  'harvest-dating/pdf-6-14.jpg': [1800, 1255],
  'harvest-dating/pdf-6-17.jpg': [1800, 1263],
  'go2bites/a153.jpg': [1800, 1440],
  'go2bites/a155.jpg': [1800, 1440],
  'go2bites/a165.jpg': [1800, 1350],
  'go2bites/a172.jpg': [1800, 1350],
  'go2bites/film-go2bites.jpg': [619, 348],
  'go2bites/web-go2bites.jpg': [1280, 720],
  'go2bites/family-cinnamon-front.jpg': [1238, 1548],
  'go2bites/family-oh-ghee-front.jpg': [1238, 1548],
  'go2bites/family-cinnamon-back.jpg': [1238, 1548],
  'go2bites/family-oh-ghee-back.jpg': [1238, 1548],
  'go2bites/range-black.jpg': [2000, 1500],
  'go2bites/range-hand.jpg': [2000, 1500],
  'go2bites/oh-ghee-single.jpg': [2000, 1500],
  'go2bites/ingredient-pumpkin-spice.jpg': [2000, 1600],
  'go2bites/ingredient-spicy-cinnamon.jpg': [2000, 1600],
  'go2bites/ingredient-oh-ghee-dates.jpg': [2000, 1600],
  'go2bites/ingredient-cinnamon.jpg': [2000, 1600],
  'go2bites/web-before-home.jpg': [1556, 696],
  'go2bites/web-after-home.jpg': [1556, 696],
  'go2bites/web-after-story.jpg': [1556, 696],
  'cellinkey/a000.jpg': [1800, 1201],
  'cellinkey/a017.jpg': [1800, 1201],
  'cellinkey/a041.jpg': [1800, 1201],
  'cellinkey/a052.jpg': [1800, 1201],
  'cellinkey/a073.jpg': [1800, 1201],
  'cellinkey/a088.jpg': [1800, 1201],
  'matchday/a112.jpg': [914, 1800],
  'matchday/a114.jpg': [923, 1800],
  'hush-hush-tan/a109.jpg': [830, 1800],
  'hush-hush-tan/a111.jpg': [1179, 1489],
  '10-pillar-productions/web-10-pillar.jpg': [1280, 720],
  'alh-senior-solutions/web-alh.jpg': [1280, 720],
  'clement-senior-solutions/web-clement.jpg': [1280, 720],
  'reclaim-physical-therapy/web-reclaim.jpg': [1280, 595],
  'dr-saba-syed/web-dr-saba-syed.jpg': [1280, 720],
  'hiking-pony/packaging-range.jpg': [1920, 1280],
  'hiking-pony/sweet-cream-packaging.jpg': [1920, 1280],
  'hiking-pony/web-hiking-pony.jpg': [1280, 720],
  'smoothsailing/web-smoothsailing.jpg': [1272, 716],
  'turant/web-turant.jpg': [1280, 720],
  'wurqly/web-wurqly.jpg': [1280, 720],
  'wurqly/guide-cover.jpg': [2084, 1303],
  'wurqly/guide-built-for-work.jpg': [2084, 1303],
  'wurqly/guide-benefits.jpg': [2084, 1303],
  'wurqly/guide-two-colors.jpg': [2084, 1303],
  'wurqly/guide-artwork.jpg': [2084, 1303],
  'wurqly/guide-color.jpg': [2084, 1303],
  'wurqly/guide-invert.jpg': [2084, 1303],
  'wurqly/guide-type.jpg': [2084, 1303],
  'wurqly/guide-imagery.jpg': [2084, 1303],
  'wurqly/guide-touchpoints.jpg': [2084, 1303],
  'wurqly/guide-voice.jpg': [2084, 1303],
  'wurqly/social-youtube-banner.jpg': [2560, 1440],
  'wurqly/social-post-square.jpg': [1080, 1080],
  'wurqly/social-post-portrait.jpg': [1080, 1350],
  'wurqly/social-post-band.jpg': [1080, 1350],
  'wurqly/social-story.jpg': [1080, 1920],
  'wurqly/social-linkedin.jpg': [1200, 627],
  'matchday-meta-ads/free-game-code.jpg': [720, 1280],
  'matchday-meta-ads/app-promo.jpg': [720, 1280],
  'matchday-meta-ads/text-message-ugc.jpg': [720, 1280],
  'matchday-meta-ads/static-group-chat.jpg': [400, 500],
  'matchday-meta-ads/static-three-reasons.jpg': [400, 500],
  'matchday-meta-ads/static-testimonial.jpg': [400, 500],
  'hush-hush-tan-seasonal/studio-flyer.jpg': [1080, 1296],
  'hush-hush-tan-seasonal/email-header.jpg': [1545, 1089],
  'hush-hush-tan-seasonal/social-graphic.jpg': [650, 458],
  'matchday-social/profile-now.jpg': [800, 730],
  'matchday-social/wemby-katy.jpg': [413, 679],
  'matchday-social/okc-launch.jpg': [413, 533],
  'avro-website/before-home.jpg': [1556, 598],
  'avro-website/after-home.jpg': [1556, 598],
  'avro-website/before-pdp.jpg': [1556, 598],
  'avro-website/after-pdp.jpg': [1556, 598],
  'avro-website/shop-all.jpg': [1556, 640],
}

type Input = Omit<Project, 'id' | 'client' | 'heroMedia' | 'credits' | 'links' | 'collection'> & Partial<Pick<Project, 'client' | 'heroMedia' | 'credits' | 'links' | 'collection'>>
export function validateProjectCard(input: { slug: string; cardImage?: string; cardAlt?: string }) {
  if (!input.cardImage?.trim() || !input.cardAlt?.trim()) throw new Error(`Project ${input.slug} requires cardImage and cardAlt`)
}
const project = (input: Input): Project => {
  validateProjectCard(input)
  return {
    id: input.slug, client: input.title, heroMedia: { label: '', ratio: 'full' },
    credits: [], links: [], collection: 'archive', ...input,
  }
}
const image = (company: string, file: string, label: string, ratio: MediaRatio = 'wide'): MediaItem => {
  const dimensions = imageDimensions[`${company}/${file}`]
  return {
    src: `/work/${company}/${file}`,
    label,
    ratio,
    width: dimensions?.[0],
    height: dimensions?.[1],
  }
}
const text = (title: string, ...body: string[]): ContentModule => ({ type: 'text', title, body })
const media = (company: string, file: string, label: string, ratio: MediaRatio = 'wide'): ContentModule => ({ type: 'media', item: image(company, file, label, ratio) })
const pair = (company: string, a: [string, string, MediaRatio?], b: [string, string, MediaRatio?]): ContentModule => ({ type: 'mediaPair', items: [image(company, ...a), image(company, ...b)] })

export const projects: Project[] = [
  project({
    cardImage: '/work/cards/wagner-wealth.webp', cardAlt: 'Wagner Wealth Management, the letterhead and correspondence design.',
    slug: 'wagner-wealth', title: 'Wagner Wealth Management', collection: 'featured',
    tagline: 'We shaped a personal practice into a precise, composed system.',
    summary: 'We built an angular monogram, a restrained identity, and a measured website for Wagner Wealth Management.',
    categories: ['Website'],
    disciplines: ['Web', 'Brand', 'Production'], services: ['Website', 'Visual identity', 'Founder film'],
    heroMedia: image('wagner-wealth', 'a093.jpg', 'Embossed business-card design mockup in Wagner’s plum colorway.', 'square'),
    thumbnailMedia: {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A_dense_layered_3D_composition_202606012258_web.png-iYJDPqey04ri7dx9KMCoPWcPIJQuR7.jpeg',
      label: 'Layered three-dimensional Wagner monograms with metallic plum surfaces and soft mauve lighting.',
      ratio: 'wide',
      width: 2752,
      height: 1536,
    },
    contentModules: [
      text('make the personal feel established.', 'We shaped the identity to give a personal wealth-management practice a clear, consistent presence. An angular monogram provides the recognizable center; a deep plum palette keeps the wider system composed rather than corporate.'),
      media('wagner-wealth', 'a090.jpg', 'The geometric monogram in the plum colorway.'),
      text('carry the idea beyond the mark.', 'We extended the monogram, color, and typography across card, letterhead, and apparel concepts so the identity could hold together at very different scales.'),
      pair('wagner-wealth', ['a094.jpg', 'Letterhead and correspondence design mockup.'], ['a095.jpg', 'Polo application shown as a design mockup.']),
      text('build a quieter digital presence.', 'We carried the same visual language into a website that organizes service information and leads toward a consultation. We also developed a founder film as a companion to the practice’s story.'),
      media('wagner-wealth', 'web-wagner.jpg', 'Website presentation for the advisory practice.'),
    ],
    links: [{ label: 'visit the website', href: 'https://www.wagnerwealthtx.com/' }],
    note: 'Website and identity work are presented without investment performance claims.',
  }),
  project({
    cardImage: '/work/cards/sidecar-spirits.webp', cardAlt: 'Sidecar Spirits, the complete gold and navy illustrated emblem.',
    slug: 'sidecar-spirits', title: 'Sidecar Spirits', collection: 'archive',
    tagline: 'A richly drawn identity with a practical system.',
    summary: 'An illustrated emblem, expressive wordmark, and a family of colorways for Sidecar Spirits.',
    disciplines: ['Brand'], services: ['Visual identity', 'Logo system', 'Color and typography'],
    heroMedia: image('sidecar-spirits', 'sidecar-gold.jpg', 'Sidecar Spirits’ finished gold-and-navy emblem.', 'tall'),
    contentModules: [
      text('character in every detail.', 'The illustrated emblem anchors the identity. Its detailed drawing and expressive lettering create a distinctive visual vocabulary, with navy, gold, orange, and bone forming the core palette.'),
      text('one identity, more ways to use it.', 'A focused set of color and typography roles gives the expressive direction a practical structure across labels, print, and digital applications.'),
    ],
  }),
  project({
    cardImage: '/work/cards/harvest-dating.webp', cardAlt: 'Harvest Dating, the primary identity and apple heart mark.',
    slug: 'harvest-dating', title: 'Harvest Dating', collection: 'archive',
    tagline: 'An identity rooted in intentional connection.',
    summary: 'An apple-and-heart symbol, expressive typography, and a plum-and-red palette connecting digital touchpoints.',
    disciplines: ['Brand'], services: ['Visual identity', 'App-icon applications', 'Social design system'],
    heroMedia: image('harvest-dating', 'pdf-6-8.jpg', 'Harvest’s plum-and-red identity applied across three vertical social-story compositions.', 'wide'),
    contentModules: [
      text('a recognizable starting point.', 'We gave the idea of intentional dating a recognizable visual form. The apple-and-heart symbol is the central identifier, working alongside the Harvest wordmark and independently at smaller scales.'),
      media('harvest-dating', 'pdf-6-6.jpg', 'Logo construction documented in the brand guide.'),
      text('from logo to app icon.', 'The same symbol connects the primary identity, social stories, and app-icon mockups. Each application changes in scale and format while retaining the relationship between mark, color, and type.'),
      pair('harvest-dating', ['pdf-6-4.jpg', 'Primary identity and apple heart mark.'], ['pdf-6-10.jpg', 'App icon concept for Harvest Dating.']),
      text('a system with defined roles.', 'Headline, label, and body treatments establish a clear hierarchy. Plum, red, and supporting tones give different compositions a shared visual structure.'),
      pair('harvest-dating', ['pdf-6-14.jpg', 'Typography hierarchy for Harvest Dating.'], ['pdf-6-17.jpg', 'The identity’s defined color palette.']),
    ],
  }),
  project({
    cardImage: '/work/cards/go2bites.webp', cardAlt: 'Go2Bites, Lemon Cashew Coconut packaging with its ingredients.',
    slug: 'go2bites', title: 'Go2Bites', collection: 'featured',
    tagline: 'Packaging, photography, film and a new store for an Austin snack brand.',
    summary: 'We gave creative direction on the 3-bite packs, designed the family packs, shot the product photography, filmed the founder and rebuilt the online store for Go2Bites, then carried it all into email and Meta Ads.',
    categories: ['Packaging photography'],
    disciplines: ['Packaging', 'Photography', 'Production', 'Web', 'Marketing'], services: ['Packaging creative direction', 'Packaging design', 'Product photography', 'Founder film', 'Shopify website', 'Email and Meta Ads'],
    heroMedia: image('go2bites', 'ingredient-pumpkin-spice.jpg', 'Pumpkin Spice Donut Hole with a pumpkin, cashews and spice, a hand lifting one bite, on navy.'),
    contentModules: [
      text('one brand, built piece by piece.', 'Go2Bites makes protein bites in Austin. Since 2025 we have shaped almost every place a customer meets the brand: the pouches, the photos of them, the founder telling her story, and the store where people buy. Each piece has its own case study below.'),
      pair('go2bites', ['family-cinnamon-front.jpg', 'The 18-bite Cinnamon Donut Hole family pack we designed.', 'tall'], ['family-oh-ghee-front.jpg', 'The 18-bite Oh Ghee Dates! family pack we designed.', 'tall']),
      text('packaging.', 'We gave creative direction on the 3-bite packs, designed the 18-bite family packs ourselves, then photographed all of it for the store and retail.'),
      media('go2bites', 'range-black.jpg', 'The five Go2Bites flavors photographed together on black.'),
      text('photography and film.', 'An ingredient-led product set on navy, lifestyle images, and a founder film shot in a family kitchen that now leads the brand’s Our Story page.'),
      media('go2bites', 'a153.jpg', 'Lemon Cashew Coconut with a lemon, cashews and coconut on navy.'),
    ],
    links: [
      { label: 'see the packaging', href: '/work/go2bites-packaging' },
      { label: 'see the product photography', href: '/work/go2bites-photography' },
      { label: 'see the founder film and website', href: '/work/go2bites-film-website' },
      { label: 'visit the website', href: 'https://go2bites.com/' },
    ],
  }),
  project({
    cardImage: '/work/cards/cellinkey.webp', cardAlt: 'CellinKey, the blue bottle photographed with directional light and stone.',
    slug: 'cellinkey', title: 'CellinKey', collection: 'featured',
    tagline: 'We gave the product range a tactile world of its own.',
    summary: 'We directed a cohesive image system for CellinKey through sculpted light, textured sets, product photography, and web presentation.',
    categories: ['Packaging photography'],
    disciplines: ['Photography', 'Web'], services: ['Packaging photography', 'Website'],
    heroMedia: image('cellinkey', 'a000.jpg', 'The product range arranged in warm directional light.'),
    thumbnailMedia: {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Poolside%20Mockup%20_%20Spaced%20Out.png-kAK4mJIdLez54vWnl9Z0Scrnx8otYj.jpeg',
      label: 'CellinKey and Comaeryo skincare products arranged on a cream poolside lounger beside turquoise water.',
      ratio: 'wide',
      width: 5408,
      height: 3072,
    },
    contentModules: [
      text('build one world without repeating one frame.', 'We kept the packaging clear while changing the atmosphere around it. Directional light creates shape and depth; warm stone, suspended powder, foliage, and saturated color give each product a distinct setting inside one recognizable visual system.'),
      pair('cellinkey', ['a017.jpg', 'Product photographed with a suspended powder effect.'], ['a041.jpg', 'White pump bottle in a warm stone setting.']),
      text('use contrast to give the range rhythm.', 'We moved between pale mineral arrangements, a saturated red set, and darker sculptural scenes. That contrast lets individual products hold their own while the lighting and set direction keep the full collection connected.'),
      pair('cellinkey', ['a052.jpg', 'White tube and foliage on a red set.'], ['a073.jpg', 'Blue bottle study with directional light and stone.']),
      media('cellinkey', 'a088.jpg', 'Dark serum bottle in a sculptural setting.'),
      text('carry the character online.', 'We carried the same product-first hierarchy into the website presentation, using the photography to connect individual items back to one coherent range. The digital experience stays focused on the product rather than adding a competing visual layer.'),
    ],
    links: [{ label: 'visit the website', href: 'https://www.cellinkeyskincare.com/' }],
  }),
  project({
    cardImage: '/work/cards/matchday.webp', cardAlt: 'MatchDay: more players, more games. An ad, the Instagram profile and a TikTok, with 3,458 app installs and 2,577 new followers.',
    slug: 'matchday', title: 'MatchDay', collection: 'featured', tagline: 'Filling pickup games across eight cities.',
    summary: 'Paid social and organic content for a pickup soccer app: 3,458 app installs at $3.34 each, and 2,577 new followers across Instagram and TikTok.',
    disciplines: ['Marketing', 'Content', 'Growth', 'Photography'], services: ['Meta Ads', 'Social media management', 'Content creation', 'SEO'],
    heroMedia: image('matchday-social', 'profile-now.jpg', 'MatchDay’s Instagram profile in November 2026, with city highlights and match content.', 'square'),
    thumbnailMedia: {
      src: '/work/cards/matchday.webp',
      label: 'MatchDay: more players, more games. An ad, the Instagram profile and a TikTok, with 3,458 app installs and 2,577 new followers.',
      ratio: 'wide',
      width: 1600,
      height: 1100,
    },
    contentModules: [
      { type: 'text', title: 'the headline numbers.', body: ['Two programs, one goal: more players at more games.'], stats: [
        { value: '3,458', label: 'App installs from Meta Ads in September and October 2026' },
        { value: '$3.34', label: 'Cost per app install' },
        { value: '+2,091', accessibleValue: '2,091 new', label: 'New Instagram followers, 1,519 to 3,610' },
        { value: '13x', accessibleValue: '13 times', label: 'TikTok views in our first five months' },
      ] },
      text('paid and organic, city by city.', 'We plan, film and run MatchDay’s Meta campaigns market by market, and we run the Instagram and TikTok feeds that show what a MatchDay game actually feels like. Each side has its own case study with the full numbers.'),
      pair('matchday-meta-ads', ['free-game-code.jpg', 'A MatchDay ad for Atlanta with a free game code.', 'tall'], ['static-testimonial.jpg', 'A MatchDay testimonial static ad.', 'tall']),
    ],
    links: [
      { label: 'read the Meta Ads case study', href: '/work/matchday-meta-ads' },
      { label: 'read the social case study', href: '/work/matchday-social' },
    ],
  }),
  project({
    cardImage: '/work/cards/hush-hush-tan.webp', cardAlt: 'Hush Hush Tan, the refreshed social profile.',
    slug: 'hush-hush-tan', title: 'Hush Hush Tan', tagline: 'A refreshed brand, carried into the feed.',
    summary: 'A coordinated social relaunch through education, seasonal promotions, and client-centered content.',
    disciplines: ['Marketing', 'Content'], services: ['Social media management'],
    heroMedia: image('hush-hush-tan', 'a109.jpg', 'The refreshed Hush Hush Tan social profile.', 'tall'),
    contentModules: [text('a more coherent daily presence.', 'We aligned the content calendar and visual presentation with the refreshed brand direction. Educational tanning content, seasonal messages, and client moments gave the channels a regular publishing rhythm.')],
  }),
  project({
    cardImage: '/work/cards/clement-senior-solutions.webp', cardAlt: 'Clement Senior Solutions, the senior-living guidance website.',
    slug: 'clement-senior-solutions', title: 'Clement Senior Solutions', tagline: 'A clearer path from local search to support.',
    summary: 'Website improvements and foundational local SEO for senior-living guidance in Austin.',
    disciplines: ['Web', 'Growth', 'Content'], services: ['Website optimization', 'Local SEO', 'Social content'],
    heroMedia: image('clement-senior-solutions', 'web-clement.jpg', 'Clement website presentation.'),
    contentModules: [text('make the next step clearer.', 'Service-page structure, metadata, headings, accessibility tagging, and local keyword targeting formed the foundation of the work. Website updates addressed navigation and the company’s presentation.'), text('early visibility, in context.', 'The focused local-search study documents the initial keyword footprint. Search-tool estimates are kept separate from measured enquiries, consultations, and revenue.')],
    links: [{ label: 'visit the website', href: 'https://www.clementseniorsolutions.com/' }, { label: 'view selected social content', href: 'https://www.instagram.com/reel/DZ3SSzZp6ku/' }],
  }),
  project({
    cardImage: '/work/cards/wurqly.webp', cardAlt: 'Wurqly, the complete blue and navy website presentation.',
    slug: 'wurqly', title: 'Wurqly', collection: 'featured',
    tagline: 'One field service brand, from the first word to every channel.',
    summary: 'Positioning, a full identity system and 29-page brand guidelines, a public website, a five-platform social reset and an ongoing growth program for a field service marketplace.',
    disciplines: ['Brand', 'Web', 'Content', 'Marketing'], services: ['Positioning', 'Brand identity', 'Brand guidelines', 'Website design and development', 'Social identity', 'Growth marketing'], period: '2026',
    heroMedia: image('wurqly', 'guide-cover.jpg', 'The cover of the Wurqly brand guidelines: the speed-line wordmark in cobalt on black.'),
    thumbnailMedia: {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fitted%20Shelf%20Laptop%20Mockup-iM0MGqvA2aEo1lNctqheBQrUUcYYc2.png',
      label: 'Wurqly’s navy and blue website displayed on a laptop resting on a curved silver shelf.',
      ratio: 'wide',
      width: 4800,
      height: 3456,
    },
    contentModules: [
      text('one product, two audiences.', 'Wurqly is a field service marketplace for IT work. Sourcing, dispatch, coverage and payout happen in one workflow, and the product has to make sense to two very different people: the company that needs the job done and the technician who does it. We started there, defining the audience, category and message hierarchy, and landed the line that now leads everything: “Field service, reinvented. Built for companies. Loved by technicians.”'),
      media('wurqly', 'guide-built-for-work.jpg', 'Brand guidelines: built for the work, with what companies, technicians and both sides get.'),
      media('wurqly', 'guide-benefits.jpg', 'Brand guidelines: three benefits, one workflow. AI at every step, Instant Pay and Free Insurance.'),
      text('an identity with motion built in.', 'The mark is a speed-line W: the letter breaks into lines that read as movement, the same thing the product promises a dispatcher. We kept the system strict on purpose. Two colors, cobalt #0040DC and black, flip between page and card so every layout stays readable. Zalando Sans Expanded carries headlines, Lexend carries body copy and Cousine handles work order details, the way a ticket would print them.'),
      media('wurqly', 'guide-two-colors.jpg', 'Brand guidelines: two colors, clear structure, with the wordmark on cobalt.'),
      media('wurqly', 'guide-artwork.jpg', 'Brand guidelines: use the artwork, never retype it. The full wordmark and the W symbol.'),
      media('wurqly', 'guide-color.jpg', 'Brand guidelines: cobalt and black as the only two layout colors.'),
      media('wurqly', 'guide-type.jpg', 'Brand guidelines: three typefaces, one recognizable voice.'),
      media('wurqly', 'guide-imagery.jpg', 'Brand guidelines: show the world where the work happens, with city and network imagery.'),
      text('guidelines the whole team can use.', 'The brand guidelines, now on version 3.0, run 29 pages: foundations, identity, color and shape, type and layout, digital expression and real applications. They are written for the people who use them, with rules like “use the artwork, never retype it” and “write the next useful sentence,” so sales, product and contractors can produce on-brand work without asking us first.'),
      media('wurqly', 'guide-touchpoints.jpg', 'Brand guidelines: the same identity across every touchpoint, from ads to product screens.'),
      media('wurqly', 'guide-voice.jpg', 'Brand guidelines: write the next useful sentence, with headline and copy examples.'),
      text('one look on every platform.', 'In October we reset Wurqly’s profiles on Instagram, Facebook, LinkedIn, X and YouTube with one kit: profile photos, covers and banners, feed posts in every size, stories, and short motion pieces where the wordmark builds out of the speed lines.'),
      media('wurqly', 'social-youtube-banner.jpg', 'Social kit: the YouTube banner, with the W symbol over the speed-line pattern.'),
      media('wurqly', 'social-post-square.jpg', 'Social kit: a square feed post with the full wordmark.'),
      media('wurqly', 'social-post-portrait.jpg', 'Social kit: a portrait feed post in deep cobalt.'),
      media('wurqly', 'social-story.jpg', 'Social kit: a vertical story frame.'),
      media('wurqly', 'social-post-band.jpg', 'Social kit: the wordmark on a single band of lines.'),
      media('wurqly', 'social-linkedin.jpg', 'Social kit: a LinkedIn post with the W symbol.'),
      text('make the website.', 'We shaped the information architecture, wrote the core site narrative, designed every key page, and built the responsive public website from first impression through the deeper product paths.'),
      media('wurqly', 'web-wurqly.jpg', 'Wurqly’s website homepage: field service, reinvented.'),
      text('now, growth.', 'Since October we have run Wurqly’s growth marketing. We set a search and AI visibility baseline, mapped the keywords their buyers use, wrote the technical search and tracking fixes for their developer, produced a vertical product demo video, and plan LinkedIn posts for three of the company’s leaders.'),
    ],
    links: [{ label: 'visit the website', href: 'https://wurqly.com/' }, { label: 'watch the demo video', href: 'https://drive.google.com/file/d/1h5cEKf-NVUWcjfpQLG5jd2Y9XPg71oQI/view' }],
  }),
  project({
    cardImage: '/work/cards/hiking-pony.webp', cardAlt: 'Hiking Pony, front and back of the Sweet Cream collagen coffee pouch.',
    slug: 'hiking-pony', title: 'Hiking Pony', collection: 'featured', period: '2025',
    tagline: 'A functional coffee range, built to travel from sachet to shelf.',
    summary: 'A scalable packaging system and digital extension for an Austin-born functional coffee brand.',
    categories: ['Packaging redesign'],
    disciplines: ['Packaging', 'Brand', 'Web'],
    services: ['Packaging redesign', 'Packaging architecture', 'SKU rollout', 'Production artwork', '3D mockups', 'Website'],
    heroMedia: image('hiking-pony', 'packaging-range.jpg', 'Front-and-back Hiking Pony coffee pouches in Latte, Mocha, and Sweet Cream flavors.'),
    contentModules: [
      text('one system, built to scale.', 'Hiking Pony needed to carry its existing identity from single-serve sachets into a larger retail format without losing the brand’s outdoor character or functional message. We translated the system into 10-serving pouches with a repeatable architecture for changing flavor names, product weights, and serving details.'),
      media('hiking-pony', 'sweet-cream-packaging.jpg', 'Front and back of the berry Sweet Cream collagen coffee pouch.'),
      text('make the function easy to find.', 'A clear top-of-pack line brings collagen, protein, MCTs, and preservative-free messaging into immediate view. The front balances the Hiking Pony mark, flavor, product format, origin details, and preparation cue, while the back organizes the brand story, directions, nutrition panel, ingredients, dietary badges, and QR touchpoint.'),
      text('four flavors, one architecture.', 'The packaging framework was prepared across Latte, Mocha, Sweet Cream, and Peppermint Mocha. Shared placement and typography make the range recognizable as one family, while flavor-led color gives each SKU a distinct shelf presence.'),
      text('ready for production.', 'The rollout included single-serve and multi-pack pouch layouts, production-ready mechanical artwork, and 3D product mockups. The result is a flexible system designed to hold together across pouch sizes and product lines.'),
      media('hiking-pony', 'web-hiking-pony.jpg', 'Hiking Pony website with product-led navigation and the coffee range.'),
      text('from shelf to screen.', 'The website extends the same product story through the full coffee range, ingredient information, recipes, retail links, and brand narrative. The QR touchpoint on pack gives the physical system a direct route into that digital experience.'),
    ],
    links: [{ label: 'visit the website', href: 'https://hikingpony.com/' }],
    note: 'The range presentation shown here features Latte, Mocha, and Sweet Cream. The broader packaging architecture also included Peppermint Mocha.',
  }),
  project({
    cardImage: '/work/cards/smoothsailing.webp', cardAlt: 'Smoothsailing Sustainability, the consultancy homepage.',
    slug: 'smoothsailing', title: 'Smoothsailing Sustainability', tagline: 'A broad consultancy. A clear structure.',
    summary: 'A service-led website organizing a sustainability consultancy’s areas of expertise.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('smoothsailing', 'web-smoothsailing.jpg', 'Smoothsailing’s homepage and consultancy service structure.'),
    contentModules: [text('a clearer way through.', 'The homepage connects the consultancy’s positioning with defined service categories, an explanation of its approach, and a route to contact. A sailboat illustration gives the content a distinctive setting.')],
    links: [{ label: 'visit the website', href: 'https://smoothsailingsustainability.com/' }],
  }),
  project({
    cardImage: '/work/cards/10-pillar-productions.webp', cardAlt: '10 Pillar Productions, the film portfolio website.',
    slug: '10-pillar-productions', title: '10 Pillar Productions', tagline: 'A home for work made to be watched.',
    summary: 'A portfolio website bringing films, commercial work, and booking information together.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('10-pillar-productions', 'web-10-pillar.jpg', 'The production company’s portfolio website.'),
    contentModules: [text('let the work lead.', 'Film and commercial categories organize the portfolio, while an About page, events section, and booking route support visitors exploring the company or discussing a project.')],
    note: 'Burgama’s scope is the website. Film production displayed on that site belongs to 10 Pillar Productions unless separately credited.',
    links: [{ label: 'visit the website', href: 'https://www.10pillarproductions.com/' }],
  }),
  project({
    cardImage: '/work/cards/alh-senior-solutions.webp', cardAlt: 'ALH Senior Solutions, the senior-placement guidance website.',
    slug: 'alh-senior-solutions', title: 'ALH Senior Solutions', tagline: 'Making the next step easier to find.',
    summary: 'A Lending Hand’s senior-placement guidance, presented through services, resources, and a clear consultation path.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('alh-senior-solutions', 'web-alh.jpg', 'A Lending Hand Senior Solutions website presentation.'),
    contentModules: [text('information with a clear next step.', 'The homepage organizes the company’s story around the questions families bring to senior-living decisions. Services, FAQs, resources, and a consultation route help visitors move from introduction toward conversation.')],
    links: [{ label: 'visit the website', href: 'https://www.alhseniorsolutions.com/' }],
  }),
  project({
    cardImage: '/work/cards/dr-saba-syed.webp', cardAlt: 'Dr. Saba Syed, the coaching and speaking website.',
    slug: 'dr-saba-syed', title: 'Dr. Saba Syed', tagline: 'A personal practice with a clear invitation.',
    summary: 'A direct introduction to Dr. Syed’s coaching and speaking work.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('dr-saba-syed', 'web-dr-saba-syed.jpg', 'Dr. Saba Syed’s coaching and speaking website.'),
    contentModules: [text('a direct introduction.', 'The page introduces Dr. Syed’s background and the people she serves, then offers routes to a discovery call, speaking enquiries, and resources. A warm palette and straightforward navigation keep the focus on her practice.')],
    links: [{ label: 'visit the website', href: 'https://www.drsabasyed.com/' }],
  }),
  project({
    cardImage: '/work/cards/turant.webp', cardAlt: 'TURANT, the community events and membership website.',
    slug: 'turant', title: 'TURANT', tagline: 'A digital gathering place for a community.',
    summary: 'Events, membership, and community programs for Turkish Americans in North Texas.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('turant', 'web-turant.jpg', 'TURANT website with community events and membership routes.'),
    contentModules: [text('participation at the center.', 'The homepage connects the association’s history with upcoming events, community imagery, and opportunities to take part. Membership and support routes help visitors find their place in an active community.')],
    credits: [{ role: 'Legacy website attribution', name: 'Cedar & Cactus, as credited on the live site' }],
    links: [{ label: 'visit the website', href: 'https://www.turant.net/' }],
  }),
  project({
    cardImage: '/work/cards/avro.webp', cardAlt: 'AVRO, the existing brand logo shown without a background panel.',
    slug: 'avro', title: 'AVRO', tagline: 'One product, several social contexts.',
    summary: 'A supporting content collection spanning a mocktail concept, creator-style content, and a retailer collaboration.',
    disciplines: ['Content', 'Production'], services: ['Social content', 'Video production'],
    contentModules: [text('different moments in the feed.', 'The collection brings the brand into a mocktail-making moment, creator-style storytelling, and a retailer collaboration. Each selection explores a different social context for the product.')],
    status: 'Content selection',
  }),
  project({
    cardImage: '/work/cards/patent-earth.webp', cardAlt: 'Patent Earth, a typographic client-name cover.',
    slug: 'patent-earth', title: 'Patent Earth', tagline: 'A compact short-form content feature.',
    summary: 'A selected social reel, presented as an individual content piece rather than a full campaign.',
    disciplines: ['Content'], services: ['Social media content creation'],
    contentModules: [text('one piece of the picture.', 'A short-form Patent Earth reel is the focus of this content selection. The original post is linked below.')],
    links: [{ label: 'view the selected reel', href: 'https://www.instagram.com/reel/DbWC2CTgQ4L/' }],
  }),
  project({
    cardImage: '/work/cards/ollivate.webp', cardAlt: 'Ollivate, a typographic client-name cover.',
    slug: 'ollivate', title: 'Ollivate', tagline: 'Introducing an education app through paid social.',
    summary: 'App-focused video and static creative paired with audience testing.',
    disciplines: ['Marketing', 'Content'], services: ['Meta Ads', 'Video and static campaign creative'],
    contentModules: [text('a broader creative starting point.', 'The paid-social program combined video and static formats around the app’s proposition. Audience testing gave the campaign different ways to introduce the product, beyond a single boosted post.')],
    note: 'Download-link clicks are not completed installs.',
  }),
  project({
    cardImage: '/work/cards/cloon.webp', cardAlt: 'Cloon, the existing brand logo shown without a background panel.',
    slug: 'cloon', title: 'Cloon', tagline: 'A focused approach to search advertising.',
    summary: 'Intent-based keyword selection, tailored ad copy, and bid management for a Google Search campaign.',
    disciplines: ['Marketing', 'Growth'], services: ['Google Ads'],
    contentModules: [text('start with intent.', 'The campaign approach brought together focused keywords, ad-copy decisions, and bid management. Its aim was to connect searchers with the website while keeping spending controlled.')],
  }),
  project({
    cardImage: '/work/cards/matchday-meta-ads.webp', cardAlt: 'MatchDay Meta Ads: $3.34 per install, with three of the ads we made.',
    slug: 'matchday-meta-ads', title: 'MatchDay Meta Ads', client: 'MatchDay', parentSlug: 'matchday', collection: 'case-study',
    tagline: 'Filling pickup games, one city at a time.',
    summary: 'City-by-city Meta campaigns we planned, filmed and ran for MatchDay: 3,458 app installs at $3.34 each, and a 79% lower cost per site visit.',
    disciplines: ['Marketing', 'Content', 'Growth'], services: ['Meta Ads', 'Ad creative production', 'Tracking audit'], period: 'August 2025 to October 2026',
    heroMedia: image('matchday-meta-ads', 'free-game-code.jpg', 'A MatchDay ad for Atlanta with the free game code ATLMD over a soccer field.', 'tall'),
    contentModules: [
      { type: 'text', title: 'the headline numbers.', body: ['Across fourteen months of paid social for a pickup soccer app operating in eight cities.'], stats: [
        { value: '3,458', label: 'App installs in September and October 2026' },
        { value: '$3.34', label: 'Cost per app install' },
        { value: '79%', label: 'Lower cost per site visit, $2.67 to $0.56' },
        { value: '15x', accessibleValue: '15 times', label: 'Monthly ad spend, $374 to $5,783' },
      ], source: 'MatchDay Meta Ads account, August 1, 2025 to October 31, 2026, pulled November 4, 2026.' },
      text('the starting point.', 'MatchDay books pickup soccer at premium fields, supplies the gear and records match highlights. Players book through the MatchDay app. In August 2025 the account spent about $375 a month with no campaign structure by city. The job was to get local players to try a first game and download the app in every market MatchDay operates.'),
      text('one city at a time.', 'Each market got its own campaign and its own free first game code, such as ATLMD, DFWMD and HTXMD. A player in Houston saw a Houston field, a Houston code and a reason to show up this week. Every city ran the same tested formats: voiceover videos, text-message hooks, free-code field shots and scripted b-roll. Spend followed the results, and in February 2026 all eight city campaigns held between $0.48 and $0.68 per landing page view.'),
      pair('matchday-meta-ads', ['app-promo.jpg', 'A vertical app promotion ad filmed at a MatchDay field.', 'tall'], ['text-message-ugc.jpg', 'A text-message hook ad: a player asking where to play pickup soccer.', 'tall']),
      text('fixing what Meta could not see.', 'In July 2026 the campaigns switched from site visits to app sign-ups, and Meta reported almost nothing. Our audit of Events Manager found the sign-ups were happening, but reached Meta with no data to match them to the people who saw the ads. iOS attribution had never been set up, and the website pixel was not attached to any ad set. We wrote the fix plan, handed the developer work to MatchDay, and rebuilt the account around app promotion campaigns.'),
      { type: 'text', title: 'app growth after the fix.', body: ['Installs and sign-ups are Meta-attributed with the default window. Earlier installs went unreported, so these are not before-and-after growth figures.'], stats: [
        { value: '1,759', label: 'Attributed app installs in October 2026' },
        { value: '1,230', label: 'Completed in-app sign-ups from October campaigns' },
        { value: '$5.55', label: 'Per completed sign-up, top October campaign' },
      ], source: 'MatchDay Meta Ads account, August to October 2026.' },
      text('the creative library.', 'We planned, filmed and edited 53 ads: city launch videos for six markets, a text-message and creator-style set customized for eight cities, bilingual English and Spanish ads for El Paso, dedicated ads for new field openings, and six static concepts for the first-match-free offer.'),
      { type: 'mediaGrid', items: [
        image('matchday-meta-ads', 'static-group-chat.jpg', 'Static ad: every pickup group chat ever.', 'tall'),
        image('matchday-meta-ads', 'static-three-reasons.jpg', 'Static ad: three reasons players book MatchDay.', 'tall'),
        image('matchday-meta-ads', 'static-testimonial.jpg', 'Static ad: a player testimonial.', 'tall'),
      ] },
    ],
    links: [{ label: 'see MatchDay on Instagram', href: 'https://www.instagram.com/playmatchday/' }],
  }),
  project({
    cardImage: '/work/cards/matchday-social.webp', cardAlt: 'MatchDay social: from memes to the game, with the Instagram profile and two match videos.',
    slug: 'matchday-social', title: 'MatchDay social', client: 'MatchDay', parentSlug: 'matchday', collection: 'case-study',
    tagline: 'From a meme page to where local players find their next game.',
    summary: 'City-by-city content on Instagram and TikTok for a pickup soccer app: 2,577 new followers across both platforms, and 13 times the TikTok views in our first five months.',
    disciplines: ['Marketing', 'Content'], services: ['Social media management', 'Content creation'], period: 'May 2025 to November 2026',
    heroMedia: image('matchday-social', 'profile-now.jpg', 'MatchDay’s Instagram profile in November 2026, with city highlights and match content.', 'square'),
    contentModules: [
      { type: 'text', title: 'the headline numbers.', body: ['May 2025, when we started, compared with November 2026.'], stats: [
        { value: '+2,091', accessibleValue: '2,091 new', label: 'New Instagram followers, 1,519 to 3,610 (2.4x)' },
        { value: '+486', accessibleValue: '486 new', label: 'New TikTok followers, 70 to 556 (8x)' },
        { value: '13x', accessibleValue: '13 times', label: 'TikTok views in our first five months' },
        { value: '406K', accessibleValue: '406 thousand', label: 'TikTok video views since June 2025' },
      ], source: 'Sprout Social (May 2025 to April 2026), Later (May to November 2026) and the public profiles, pulled November 6, 2026.' },
      text('the starting point.', 'In May 2025 MatchDay ran games in three Texas cities. Instagram was mostly memes, and TikTok had 107 posts in five months that earned 5,910 views combined. The players, the fields and the energy were there, but none of it was on the feed. Our job was to show the real MatchDay experience, city by city, and send people to the app.'),
      pair('matchday', ['a114.jpg', 'Before: the earlier Instagram profile, May 2025.', 'tall'], ['a112.jpg', 'After: shared identity and city-specific highlights.', 'tall']),
      text('four pillars, every city.', 'We wrote the content pillars and voice, then built a weekly engine around them: about 60 Instagram posts, 30 TikToks and 35 to 40 stories a month. The mix was community and match content (40%), soccer memes and culture (30%), app features and testimonials (20%), and events and launches (10%). Every market got its own highlight cover and its own posts, from Austin and Houston to Atlanta, St. Louis and Oklahoma City.'),
      text('same volume, 13 times the views.', 'In the five months before us, 107 TikTok posts drew 5,910 views. In our first five months, 115 posts drew 79,576 views and 2,976 engagements, so views per post went from about 55 to about 690. On Instagram we published 258 posts against 40 the period before, and views rose 71% to 576,649.'),
      pair('matchday-social', ['wemby-katy.jpg', 'Instagram reel: Wembanyama plays MatchDay in Katy.', 'tall'], ['okc-launch.jpg', 'TikTok: did you know OKC had pickup like this?', 'tall']),
      text('growth is speeding up.', 'TikTok views peaked at 55,766 in April 2026, and the most-watched video on the account, a San Antonio highlight, has passed 21,800 views. On Instagram, October 2026 added 299 followers, the best month we have tracked. The audience is the one MatchDay wants: 73% men, 47% aged 25 to 34, with Austin, San Antonio and Houston as the top cities.'),
      text('keep the result in proportion.', 'Followers, views and engagements describe reach and interest. They are not attributed app registrations or revenue.'),
    ],
    links: [
      { label: 'see @playmatchday on Instagram', href: 'https://www.instagram.com/playmatchday/' },
      { label: 'see @playmatchday on TikTok', href: 'https://www.tiktok.com/@playmatchday' },
    ],
  }),
  project({
    cardImage: '/work/cards/hush-hush-tan-seasonal.webp', cardAlt: 'Hush Hush Tan Spooky Season Glow flyer: let us get tan, witches, 20% off all packages.',
    slug: 'hush-hush-tan-seasonal', title: 'Hush Hush Tan seasonal campaign', client: 'Hush Hush Tan', parentSlug: 'hush-hush-tan', collection: 'case-study',
    tagline: 'One idea, everywhere a client might see it.',
    summary: 'A Halloween promotion carried through video, email, ads, print and the website for an Austin tanning studio: package sales up 12.9 times in nine days.',
    disciplines: ['Marketing', 'Content'], services: ['Campaign planning', 'Email marketing', 'Social and ad creative'], period: 'October 2026',
    heroMedia: image('hush-hush-tan-seasonal', 'studio-flyer.jpg', 'The in-studio flyer: let us get tan, witches, 20% off all packages with code WITCHES20.', 'tall'),
    contentModules: [
      { type: 'text', title: 'the result.', body: ['Austin studio, October 13 to 21 compared with September 15 to 23, 2026.'], stats: [
        { value: '12.9x', accessibleValue: '12.9 times', label: 'Package sales, $810 to $10,470 at full price' },
        { value: '$7,944', label: 'Collected from 31 promo packages in nine days' },
        { value: '2,022', label: 'Google profile interactions in October, the most since June' },
        { value: '+74%', accessibleValue: 'up 74 percent', label: 'Profile interactions, October vs August' },
      ], source: 'Hush Hush Tan Booker sales, and Google Business Profile, pulled November 11, 2026.' },
      text('one line, one code.', 'Spooky Season Glow ran on one idea, “let’s get tan, witches,” and one code, WITCHES20, for 20% off every package. The same line appeared on the studio flyer, the website banner, an email, social posts, ads and texts, so a client heard the same offer however they found it.'),
      media('hush-hush-tan-seasonal', 'email-header.jpg', 'The campaign email header: let us get tan, witches, 20% off.'),
      text('data that connects.', 'Before the email went out on October 13 we fixed the sync between the studio’s Booker booking system and Klaviyo, so package sales now sit next to email results for every future promotion. The email ran with an A/B subject line test, and the social set mixed static posts, carousels, talking-head videos and a ghost video.'),
      { type: 'quote', body: 'A clear improvement over the Fourth of July campaign and a big win worth celebrating!', name: 'Liz Thorson', role: 'CMO, Hush Hush Tan' },
      text('keep the result in proportion.', 'The code ran across email, ads, the website, social and texts, so the sales figures describe the promotion as a whole, not any single channel. Of the $10,470 in package sales, 31 packages used the code.'),
    ],
    links: [{ label: 'watch the Austin promo video', href: 'https://drive.google.com/file/d/1cptpnBYDXo7_735xHGV26m6a4iwimb2s/view' }],
  }),
  project({
    cardImage: '/work/cards/avro-website.webp', cardAlt: 'The new AVRO shop page with Calm, Focus and Energy tubes.',
    slug: 'avro-website', title: 'AVRO website', client: 'AVRO', parentSlug: 'avro', collection: 'case-study',
    tagline: 'A store that explains the product before it asks for the sale.',
    summary: 'A rebuilt Shopify store for a GABA drink mix brand: a new homepage, clearer product pages for three lines and six flavors, subscriptions up front, and search copy written for every product.',
    disciplines: ['Web', 'Growth'], services: ['Shopify development', 'Conversion design', 'SEO'], period: 'July to November 2026',
    heroMedia: image('avro-website', 'shop-all.jpg', 'The new AVRO shop page: choose your formula, with one button each for Calm, Focus and Energy.'),
    contentModules: [
      text('the starting point.', 'AVRO’s old store led with lifestyle photography and a menu of Shop, Our Story, PharmaGABA and Contact. Shoppers had to work out on their own what the product was, which line fit them and why the ingredient mattered. Product pages were a single block of label copy, a flavor dropdown and a price.'),
      media('avro-website', 'before-home.jpg', 'Before: the previous AVRO homepage, a full-bleed surf photo with the logo and a four-item menu.'),
      media('avro-website', 'after-home.jpg', 'After: the new homepage states the promise in the first line and points to Shop AVRO and The Science.'),
      text('say it in the first screen.', 'We rebuilt the store on a new Shopify theme and built the homepage around one line, “Start Calm. Stay Ready.” The shop page asks one question, which formula fits your moment, with a button for each line. The navigation now follows the questions a new customer asks: Shop, Subscribe, Why AVRO, Science and FAQ. A clinician trust badge sits right under the headline, and dedicated pages speak to golf, work and esports, the moments where the product fits best.'),
      media('avro-website', 'before-pdp.jpg', 'Before: the AVRO Calm product page on the old site, with label copy, a flavor dropdown and a single price.'),
      media('avro-website', 'after-pdp.jpg', 'After: the AVRO Calm product page on the new site, with a one-line benefit, review rating, clinician panel, flavor buttons and subscribe-and-save shown first.'),
      text('product pages that sell.', 'Each product page now opens with a one-line benefit, the star rating on the main image and a clinician panel. Flavors are buttons instead of a dropdown, and subscribe and save sits above the one-time price, so the recurring option is the default choice. The same layout runs across Calm, Focus and Energy and all six flavors, with copy kept to structure and function language that suits a dietary supplement.'),
      text('built to be found.', 'We wrote new search titles and meta descriptions for every flavor page, each naming the line, the flavor and what sets it apart, such as caffeine or no caffeine. We shipped everything as numbered theme versions, each previewed before it went live, so the store never went down for a redesign.'),
    ],
    links: [{ label: 'visit avrolife.com', href: 'https://avrolife.com/' }],
  }),
  project({
    cardImage: '/work/cards/go2bites-packaging.webp', cardAlt: 'The Cinnamon Donut Hole and Oh Ghee Dates! family packs.',
    slug: 'go2bites-packaging', title: 'Go2Bites packaging', client: 'Go2Bites', parentSlug: 'go2bites', collection: 'case-study',
    tagline: 'Direction on the snack packs, then a bigger bag we designed for families.',
    summary: 'Creative direction on the Go2Bites 3-bite packs, plus the 18-bite family packs we designed and photographed.',
    disciplines: ['Packaging', 'Photography'], services: ['Packaging creative direction', 'Packaging design', 'Packaging photography'], period: '2025',
    heroMedia: image('go2bites', 'range-black.jpg', 'The five Go2Bites flavors photographed together on black.'),
    contentModules: [
      text('one system, five flavors.', 'Go2Bites already had its round Austin badge and its pattern of the places people take their snacks. We gave creative direction on the 3-bite packs, building on that base with one bold color per flavor and a yellow band showing the bite itself, so each flavor stands apart on a shelf while the range reads as one brand.'),
      media('go2bites', 'range-hand.jpg', 'A hand lifting Oh Ghee Dates! from the five-flavor lineup on black.'),
      text('a bigger bag for families.', 'When Go2Bites added an 18-bite size, we designed the family packs from the ground up. The larger 7 by 10 inch pouch keeps the same badge, pattern and flavor band, adds the bite count and gluten-free callout up front, and uses the back for the founder: her photo, her signature and the line “Every recipe is a reflection of my journey. I make what I believe in.”'),
      pair('go2bites', ['family-cinnamon-front.jpg', 'Front of the Cinnamon Donut Hole family pack.', 'tall'], ['family-oh-ghee-front.jpg', 'Front of the Oh Ghee Dates! family pack.', 'tall']),
      pair('go2bites', ['family-cinnamon-back.jpg', 'Back of the Cinnamon Donut Hole family pack, with the founder note and nutrition panel.', 'tall'], ['family-oh-ghee-back.jpg', 'Back of the Oh Ghee Dates! family pack, with the founder note and nutrition panel.', 'tall']),
      text('photographed for the store.', 'We shot the family packs and the full range on clean backgrounds for product pages and retail listings, so every size and flavor shows up the same way online.'),
      media('go2bites', 'a172.jpg', 'All five Go2Bites flavors photographed together on white.'),
    ],
    links: [{ label: 'shop the family packs', href: 'https://go2bites.com/collections/all' }],
  }),
  project({
    cardImage: '/work/cards/go2bites-photography.webp', cardAlt: 'Pumpkin Spice Donut Hole with a pumpkin and cashews on navy.',
    slug: 'go2bites-photography', title: 'Go2Bites product photography', client: 'Go2Bites', parentSlug: 'go2bites', collection: 'case-study',
    tagline: 'Every flavor, explained by what goes into it.',
    summary: 'An ingredient-led product set on navy for all five Go2Bites flavors, plus range and lifestyle photography used across the website, email and ads.',
    disciplines: ['Photography'], services: ['Product photography', 'Art direction', 'Lifestyle photography'], period: '2025',
    heroMedia: image('go2bites', 'ingredient-pumpkin-spice.jpg', 'Pumpkin Spice Donut Hole with a pumpkin, cashews and spice, a hand lifting one bite, on navy.'),
    contentModules: [
      text('one set, every flavor.', 'We built one photo system to carry the whole range: a deep navy set, the pouch at the center, the real ingredients beside it and a hand reaching in for a bite. Each image explains a flavor at a glance, and together they read as one family.'),
      media('go2bites', 'a153.jpg', 'Lemon Cashew Coconut with a lemon, cashews and coconut on navy.'),
      media('go2bites', 'ingredient-cinnamon.jpg', 'Cinnamon Donut Hole with cinnamon sticks and cashews on navy.'),
      media('go2bites', 'ingredient-spicy-cinnamon.jpg', 'Spicy Cinnamon Donut Hole with cinnamon, cashews and chili on navy.'),
      media('go2bites', 'ingredient-oh-ghee-dates.jpg', 'Oh Ghee Dates! with ghee, dates and banana chips on navy.'),
      text('details and real life.', 'Alongside the ingredient set we shot single-pouch hero images, the pouch in hand, and the bites outside the studio, where people actually eat them.'),
      pair('go2bites', ['a155.jpg', 'A hand holding the Cinnamon Donut Hole pouch on navy.'], ['oh-ghee-single.jpg', 'The Oh Ghee Dates! pouch on black.']),
      media('go2bites', 'a165.jpg', 'A Go2Bites bite outdoors, mid-snack.'),
      text('working across channels.', 'The same photos now lead the Go2Bites homepage, product pages, emails and Meta Ads.'),
    ],
    links: [{ label: 'see the photos on go2bites.com', href: 'https://go2bites.com/' }],
  }),
  project({
    cardImage: '/work/cards/go2bites-film-website.webp', cardAlt: 'Still from the Go2Bites founder film, the founder in her kitchen.',
    slug: 'go2bites-film-website', title: 'Go2Bites founder film and website', client: 'Go2Bites', parentSlug: 'go2bites', collection: 'case-study',
    tagline: 'The founder tells the story, and the store is built around it.',
    summary: 'A founder film shot in a family kitchen, and a Shopify store rebuilt around our photography with the film on its own Our Story page.',
    disciplines: ['Production', 'Web'], services: ['Founder film', 'Shopify website', 'Website design'], period: '2025 to 2026',
    heroMedia: image('go2bites', 'web-after-story.jpg', 'The new Our Story page on the Go2Bites site, built around the founder film.'),
    contentModules: [
      { type: 'video', title: 'the founder, in her own words.', body: ['We filmed founder Basimma Hammonds in a family kitchen, telling the story of the snack she wanted and could not find.'], vimeoId: '1164559329', label: 'Go2Bites founder film' },
      text('from template to storefront.', 'The old site was a Squarespace template with a basic menu. We rebuilt Go2Bites on Shopify around the product: our photography leads the homepage, seasonal flavors rotate in the hero, store locations and shopping sit in the top navigation, and the founder film anchors its own page.'),
      media('go2bites', 'web-before-home.jpg', 'Before: the Go2Bites homepage in December 2024.'),
      media('go2bites', 'web-after-home.jpg', 'After: the Go2Bites homepage today, led by our Pumpkin Spice product photo.'),
      media('go2bites', 'web-after-story.jpg', 'After: the new Our Story page on the Go2Bites site, built around the founder film.'),
    ],
    links: [{ label: 'watch the founder film', href: 'https://vimeo.com/1164559329' }, { label: 'visit the website', href: 'https://go2bites.com/' }],
  }),
  project({
    cardImage: '/work/cards/matchday-local-seo.webp', cardAlt: 'MatchDay search: a pickup soccer search with city pages for Austin, San Antonio, Houston and Dallas.',
    slug: 'matchday-local-seo', title: 'MatchDay search', client: 'MatchDay', parentSlug: 'matchday', collection: 'case-study',
    tagline: 'Search visibility around where people want to play.',
    summary: 'A city-page strategy connecting local pickup-soccer searches to relevant destinations.',
    disciplines: ['Growth', 'Web'], services: ['Local SEO', 'City-page strategy', 'Technical website improvements'],
    status: 'Source draft · evidence pending', period: 'April 2025 to July 2026',
    contentModules: [
      text('the search problem.', 'The SEO brief identified a gap between the app’s offering and its discoverability for local soccer searches. Dedicated city pages and technical site improvements were intended to make local games easier to find.'),
      text('give every search a destination.', 'Austin, San Antonio, Houston, and Dallas each received a relevant city destination. The approach connects geographic intent with a page about playing locally, rather than sending every searcher to the same general introduction.'),
    ],
  }),
  project({
    cardImage: '/work/cards/hush-hush-tan-social.webp', cardAlt: 'Hush Hush Tan social, the coordinated profile after the relaunch.',
    slug: 'hush-hush-tan-social', title: 'Hush Hush Tan social', client: 'Hush Hush Tan', parentSlug: 'hush-hush-tan', collection: 'case-study',
    tagline: 'A refreshed beauty brand, in daily use.',
    summary: 'A coordinated feed, educational content, and a regular calendar for a social relaunch.',
    disciplines: ['Marketing', 'Content'], services: ['Social media management', 'Content calendar', 'Community management'],
    heroMedia: image('hush-hush-tan', 'a109.jpg', 'The coordinated feed after the social refresh.', 'tall'),
    contentModules: [
      text('carry the new identity forward.', 'The brand was refreshing its identity while social channels still reflected the previous look. The brief was to make the new direction recognizable to existing clients and understandable to new audiences.'),
      pair('hush-hush-tan', ['a111.jpg', 'Before: the previous profile and visual identity.'], ['a109.jpg', 'After: a more coordinated everyday presence.']),
      text('give the identity a rhythm.', 'The publishing mix combined tanning education, seasonal promotions, transformations, and client moments. Platform-specific scheduling and community management supported the calendar.'),
      { type: 'text', title: 'What the reports show.', body: ['Across Instagram and TikTok, the relaunch period recorded:', 'The TikTok report records 65,634 video views and 938 engagements. Its later end date means the two platform reporting windows are not identical.'], stats: [
        { value: '172,503', label: 'Instagram views, 121,679 organic and 50,824 paid' },
        { value: '1,426', label: 'Instagram engagements' },
        { value: '81', label: 'Instagram net new followers' },
      ], source: 'Instagram report, June 1 to September 22, 2025, and TikTok report, June 1 to September 30, 2025.' },
    ],
    note: 'Reported visibility and engagement do not establish booking or revenue uplift. Net follower additions are not total-audience growth.',
  }),
  project({
    cardImage: '/work/cards/clement-local-search.webp', cardAlt: 'Clement Senior Solutions Local SEO setup, website presentation.',
    slug: 'clement-local-search', title: 'Clement Senior Solutions Local SEO setup', client: 'Clement Senior Solutions', parentSlug: 'clement-senior-solutions', collection: 'case-study',
    tagline: 'An early foothold in local search.',
    summary: 'Clearer service content and foundational local SEO for families looking for guidance around Austin.',
    disciplines: ['Growth', 'Web'], services: ['Local SEO', 'Website optimization'], period: 'November 2025',
    heroMedia: image('clement-senior-solutions', 'web-clement.jpg', 'Clement website presentation.'),
    contentModules: [
      text('build the foundation.', 'The work refined metadata, page titles, headings, accessibility tags, and keyword placement across core service content. Website updates addressed navigation and company presentation.'),
      { type: 'text', title: 'the observed stage of growth.', body: ['A November 19, 2025 search tool snapshot showed:', '“Senior advisor austin tx” was reported at position 9 after a 13-position improvement. The tool estimated two monthly organic clicks, indicating an early stage rather than a lead-volume breakthrough.'], stats: [
        { value: '7', label: 'Ranking organic keywords' },
        { value: '3', label: 'Improved keywords' },
        { value: '2', label: 'Newly ranked keywords' },
      ], source: 'SEO tool snapshot, November 19, 2025. Figures are tool estimates.' },
      text('keep the result in proportion.', 'Ranking movement and modeled traffic describe an initial search footprint. They are not measured enquiries, consultations, or revenue.'),
    ],
  }),
  project({
    cardImage: '/work/cards/reclaim-local-search.webp', cardAlt: 'Reclaim Physical Therapy local search, the clinic homepage.',
    slug: 'reclaim-local-search', title: 'Reclaim Physical Therapy local search', client: 'Reclaim Physical Therapy', collection: 'case-study',
    tagline: 'From a few searches a week to a steady stream.',
    summary: 'New service and question pages for an Austin physical therapy clinic, followed by 6.9 times the Google impressions and nearly three times the contact form submissions.',
    disciplines: ['Growth', 'Web'], services: ['Local SEO', 'Service page strategy', 'Website content'], period: 'April to October 2026',
    heroMedia: image('reclaim-physical-therapy', 'web-reclaim.jpg', 'Reclaim Physical Therapy homepage.'),
    contentModules: [
      text('the starting point.', 'Reclaim is a one-on-one physical therapy clinic in Austin. Before the work began, its Squarespace site earned a few hundred Google impressions a month and a handful of clicks. From April to June 2026 the site recorded 21 Google clicks and seven contact form submissions.'),
      text('give every search a page.', 'We started on June 22, 2026. Over July 29 to 31 we published about twelve new pages: a services hub for physical therapy in Austin, a page for each core service, and pages that answer the questions patients ask before they book. Each page names the clinic, the service and Austin in plain language, so both Google and AI tools can tell what Reclaim does and where.'),
      { type: 'text', title: 'what the numbers show.', body: ['August to October 2026 compared with April to June 2026:', 'From January 1 to November 6, Google clicks reached 190 in 2026, compared with 17 over the same dates in 2025.'], stats: [
        { value: '6.9x', accessibleValue: '6.9 times', label: 'Google impressions, 1,121 to 7,727' },
        { value: '4.7x', accessibleValue: '4.7 times', label: 'Google clicks, 21 to 99' },
        { value: '3.6x', accessibleValue: '3.6 times', label: 'Website visits, 143 to 512' },
        { value: '2.9x', accessibleValue: '2.9 times', label: 'Contact form submissions, 7 to 20' },
      ], source: 'Google Search Console and Squarespace Analytics for reclaimphysicaltherapy.com, pulled November 6, 2026.' },
      text('keep the result in proportion.', 'Website visits and form submissions count all sources, not only search, and average Google position moved modestly. Impressions and clicks describe visibility. They are not booked patients or revenue.'),
    ],
    links: [{ label: 'get a free AI visibility check', href: '/ai-visibility-check' }],
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
const featuredProjectOrder = ['matchday', 'wurqly', 'hiking-pony', 'go2bites', 'cellinkey', 'wagner-wealth'] as const
export const featuredProjects = featuredProjectOrder.flatMap(slug => {
  const item = getProject(slug)
  return item?.collection === 'featured' ? [item] : []
})
export function getPortfolioOrder() {
  return [...featuredProjects, ...getPublishedProjects('case-study'), ...getPublishedProjects('archive')]
}

export function getProjectNavigation(current: Project) {
  const ordered = getPortfolioOrder()
  const index = ordered.findIndex(item => item.slug === current.slug)
  return {
    // The requested strategy anchor does not exist; leave the index unchanged.
    backHref: current.collection === 'case-study' ? '/work' : `/work#${current.collection}`,
    next: ordered[(index + 1) % ordered.length],
  }
}

export function getMoreWork(currentSlug: string, count = 3, ordered = getPortfolioOrder()) {
  const index = ordered.findIndex(item => item.slug === currentSlug)
  if (index < 0) return []
  const picks: Project[] = []
  const clients = new Set([ordered[index].client])
  for (let offset = 1; offset < ordered.length && picks.length < Math.max(0, Math.floor(count)); offset++) {
    const candidate = ordered[(index + offset) % ordered.length]
    if (clients.has(candidate.client)) continue
    clients.add(candidate.client)
    picks.push(candidate)
  }
  return picks
}

export function getRelatedProjects(current: Project) {
  return getMoreWork(current.slug)
}
