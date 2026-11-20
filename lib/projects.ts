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
  | { type: 'video'; title?: string; body?: string[]; vimeoId?: string; driveId?: string; instagramId?: string; label: string; aspect?: number }

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
  'go2bites/web-before-home.jpg': [1328, 594],
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
  'hiking-pony/photo-trio-studio.jpg': [1179, 706],
  'hiking-pony/photo-mocha-styled.jpg': [1251, 706],
  'hiking-pony/photo-trio-latte.jpg': [1121, 706],
  'hiking-pony/photo-scoop.jpg': [1251, 706],
  'hiking-pony/photo-lineup.jpg': [1056, 706],
  'hiking-pony/photo-hand.jpg': [468, 706],
  'hiking-pony/photo-latte-styled.jpg': [1252, 706],
  'hiking-pony/singles-board.jpg': [3606, 1000],
  'sidecar-spirits/logo-full.jpg': [1600, 1800],
  'sidecar-spirits/before-logo.jpg': [1200, 1200],
  'sidecar-spirits/after-logo.jpg': [1200, 1200],
  'sidecar-spirits/guide-cover.jpg': [1275, 1650],
  'sidecar-spirits/guide-logos.jpg': [1275, 1650],
  'sidecar-spirits/guide-color-type.jpg': [1275, 1650],
  'sidecar-spirits/guide-usage.jpg': [1275, 1650],
  'sidecar-spirits/wordmark-gold.jpg': [1600, 900],
  'sidecar-spirits/card-source.jpg': [1600, 1100],
  'harvest-dating/hero-brand.jpg': [1600, 900],
  'harvest-dating/thorns-wheat-field.jpg': [1360, 768],
  'harvest-dating/thorns-frame-field.jpg': [1360, 768],
  'harvest-dating/thorns-barley.jpg': [768, 1360],
  'harvest-dating/thorns-blooming.jpg': [768, 1360],
  '10-pillar-productions/web-before-home.jpg': [1328, 638],
  '10-pillar-productions/web-after-home.jpg': [1566, 706],
  '10-pillar-productions/web-after-about.jpg': [1566, 588],
  '10-pillar-productions/web-after-book.jpg': [1566, 706],
  '10-pillar-productions/web-after-films.jpg': [1566, 706],
  'cellinkey-website/home-hero.jpg': [1560, 605],
  'cellinkey-website/results-slider.jpg': [968, 661],
  'cellinkey-website/five-step-system.jpg': [986, 661],
  'cellinkey-website/add-system.jpg': [1260, 661],
  'cellinkey-website/cart.jpg': [1560, 620],
  'cellinkey-website/checkout.jpg': [1560, 706],
  'hiking-pony/web-home-hero.jpg': [1560, 655],
  'hiking-pony/web-triple-energy.jpg': [1230, 555],
  'hiking-pony/web-recipes.jpg': [1230, 555],
  'smoothsailing/web-cta.jpg': [1560, 474],
  'smoothsailing/web-what-we-do.jpg': [1100, 350],
  'alh-senior-solutions/web-benefits.jpg': [1560, 504],
  'alh-senior-solutions/web-journey.jpg': [1090, 480],
  'dr-saba-syed/web-about.jpg': [910, 530],
  'dr-saba-syed/web-coaching.jpg': [890, 600],
  'turant/web-fifty-years.jpg': [1560, 504],
  'turant/web-what-we-do.jpg': [1560, 380],
  'ollivate/ad-square-duolingo.jpg': [1080, 1080],
  'ollivate/ad-vertical-quiz.jpg': [1080, 1920],
  'ollivate/ad-vertical-ce-app.jpg': [1600, 2844],
  'ollivate/ad-vertical-ce-photo.jpg': [1080, 1920],
  'patent-earth/ad-dad.jpg': [1080, 1350],
  'patent-earth/ad-numbers.jpg': [1080, 1350],
  'patent-earth/ad-four-ways.jpg': [1080, 1350],
  'patent-earth/ad-athlete.jpg': [1080, 1350],
  'patent-earth/carousel-july-fourth.jpg': [1600, 2000],
  'avro/lifestyle-terrace.jpg': [2000, 1116],
  'avro/golf-display.jpg': [1254, 1254],
  'avro/topdown-drinks.jpg': [2000, 2482],
  'patent-earth-email/email-dad.jpg': [875, 1180],
  'patent-earth-email/email-musicians.jpg': [875, 1080],
  'patent-earth-email/email-trades.jpg': [875, 1287],
  'patent-earth-email/email-veterans.jpg': [875, 1081],
  'matchday-email/email-welcome.jpg': [875, 1180],
  'matchday-email/email-find-your-game.jpg': [875, 1136],
  'matchday-email/email-comeback.jpg': [875, 1385],
  'founder-films/wagner-wealth.jpg': [1237, 696],
  'founder-films/hiking-pony.jpg': [1237, 696],
  'founder-films/cold-cycle.jpg': [376, 629],
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
    links: [{ label: 'visit the website', href: 'https://www.wagnerwealthtx.com/' }, { label: 'watch the founder film', href: '/work/wagner-founder-film' }],
    note: 'Website and identity work are presented without investment performance claims.',
  }),
  project({
    cardImage: '/work/cards/sidecar-spirits.webp', cardAlt: 'The Sidecar Spirits emblem and gold script wordmark on navy.',
    slug: 'sidecar-spirits', title: 'Sidecar Spirits', collection: 'archive', period: '2026',
    tagline: 'A bar brand built from two family stories.',
    summary: 'We rebuilt the Sidecar Spirits identity around the founders’ Mexican and Guatemalan roots: a hand-drawn emblem, a custom script wordmark, a full logo system and a brand guide.',
    disciplines: ['Brand'], services: ['Brand strategy', 'Illustration', 'Custom lettering', 'Logo system', 'Brand guidelines'],
    heroMedia: image('sidecar-spirits', 'logo-full.jpg', 'The full color Sidecar Spirits emblem: a dancer in a feathered headdress lounging in a motorcycle sidecar with a martini raised, ocelots on either side and volcanoes over a lake behind him.', 'tall'),
    contentModules: [
      text('where it started.', 'Sidecar Spirits is an Austin mobile bartending company run by two bartenders who came up in cocktail bars. They came to us with a working logo and a brief for a premium Miami lounge look: black, brown and dark orange, old school Harley meets upscale bar. In our first brand session, Thomas Kall asked to go the other way.'),
      pair('sidecar-spirits', ['before-logo.jpg', 'Before: the original Sidecar Spirits mobile bartending logo.', 'square'], ['after-logo.jpg', 'After: the full color emblem we drew.', 'square']),
      text('the story Thomas wanted to tell.', 'He wanted the brand to carry where the founders come from: Thomas’s family roots in Zacatecas, Mexico, and his partner’s hometown of Rabinal in Baja Verapaz, Guatemala. We moved from ultra-luxury to something warmer and louder, a maximalist, vintage label style built from vintage hotel luggage labels and matchbox art, Huichol beadwork from the Zacatecas side and Maya pattern and ceremonial dress from the Guatemalan side.'),
      text('one figure, a whole bar.', 'The emblem puts a dancer in a feathered headdress, inspired by the Rabinal Achí tradition, in the sidecar with a martini raised and his boots up on the bike. Two ocelots frame the scene, with volcanoes over a lake behind him. An S hides in the fuel tank, and the Sidecar Spirits script is hand-lettered in gold. We sketched six directions in pen, narrowed to one with Thomas, then took it into full color.'),
      media('sidecar-spirits', 'guide-logos.jpg', 'Brand guide page showing the primary emblem in full color, gold and navy, orange and monotone.', 'tall'),
      text('built to be used.', 'The emblem leads, with gold and navy, orange and one-color versions for print, merch and small sizes. The custom wordmark works on its own in eight colorways, with and without the founding year. A short brand guide sets the palette of navy, gold, orange and bone, the type system and the rules for using all of it.'),
      pair('sidecar-spirits', ['guide-cover.jpg', 'The Sidecar Spirits brand guide cover.', 'tall'], ['guide-color-type.jpg', 'Wordmark colorways, palette and typography from the brand guide.', 'tall']),
      media('sidecar-spirits', 'wordmark-gold.jpg', 'The custom Sidecar Spirits script wordmark in gold with EST 2026.'),
    ],
  }),
  project({
    cardImage: '/work/cards/harvest-dating.webp', cardAlt: 'The Harvest apple heart and wordmark under an arch of red thorned stems over a golden grain field.',
    slug: 'harvest-dating', title: 'Harvest Dating', collection: 'archive',
    tagline: 'A dating brand built on intention.',
    summary: 'We created the Harvest identity: an apple and heart symbol, a warm serif wordmark, a plum and red palette, and a world of grain and thorn graphics around it.',
    disciplines: ['Brand'], services: ['Visual identity', 'Logo design', 'Brand graphics', 'Color and typography', 'Brand guidelines'],
    heroMedia: image('harvest-dating', 'hero-brand.jpg', 'The Harvest apple heart and wordmark framed by glossy red thorned stems over a golden grain field.', 'wide'),
    contentModules: [
      text('a symbol for dating with intention.', 'Harvest is a dating app built for people who are ready for something real. We gave that idea a mark people recognize at a glance: an apple with a heart at its core, paired with a warm serif wordmark. The symbol carries the brand on its own at app icon size and sits beside the wordmark everywhere else.'),
      media('harvest-dating', 'pdf-6-4.jpg', 'The primary Harvest identity: the apple heart symbol beside the wordmark on black.'),
      media('harvest-dating', 'pdf-6-6.jpg', 'Construction of the apple heart mark on a geometric grid.'),
      text('grain and thorns.', 'Around the logo we built a set of 3D brand graphics from the name itself: ripe grain fields crossed with glossy, thorned stems in the brand’s plum, red and gold. Soft and sharp in the same frame, they give the brand a world that feels warm without being saccharine, and they work as backgrounds, social posts and launch visuals.'),
      media('harvest-dating', 'thorns-wheat-field.jpg', 'Red thorned stems rising through a golden wheat field under a deep red sky.'),
      pair('harvest-dating', ['thorns-barley.jpg', 'A glossy thorned stem crossing golden barley.', 'tall'], ['thorns-blooming.jpg', 'A deep red rose and thorned stem against blurred grain.', 'tall']),
      text('one system, every screen.', 'The same mark, colors and graphics run through social stories and the app icon. Each application changes scale and format while keeping the relationship between symbol, color and type.'),
      pair('harvest-dating', ['pdf-6-8.jpg', 'Harvest social story designs in the plum and red palette.'], ['pdf-6-10.jpg', 'The Harvest app icon on a phone home screen.']),
      text('defined roles for type and color.', 'Headline, label and body styles set a clear hierarchy, and a palette of deep plum, harvest red and warm neutrals gives every composition the same mood.'),
      pair('harvest-dating', ['pdf-6-14.jpg', 'Typography hierarchy for Harvest Dating.'], ['pdf-6-17.jpg', 'The Harvest color palette.']),
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
    links: [{ label: 'see the website and checkout', href: '/work/cellinkey-website' }, { label: 'visit the website', href: 'https://www.cellinkeyskincare.com/' }],
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
    links: [{ label: 'see local search', href: '/work/matchday-local-seo' }, 
      { label: 'read the Meta Ads case study', href: '/work/matchday-meta-ads' },
      { label: 'read the social case study', href: '/work/matchday-social' },
      { label: 'see the email flows', href: '/work/matchday-email' },
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
    links: [{ label: 'see the local SEO setup', href: '/work/clement-local-search' }, { label: 'visit the website', href: 'https://www.clementseniorsolutions.com/' }, { label: 'view selected social content', href: 'https://www.instagram.com/reel/DZ3SSzZp6ku/' }],
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
    slug: 'hiking-pony', title: 'Hiking Pony', collection: 'featured', period: '2025 to 2026',
    tagline: 'A functional coffee range, built to travel from sachet to shelf.',
    summary: 'We designed the packaging system, shot the product photography, built the website and filmed the founder for an Austin-born functional coffee brand.',
    disciplines: ['Packaging', 'Photography', 'Production', 'Web'],
    services: ['Packaging design', 'Product photography', 'Website', 'Founder film'],
    heroMedia: image('hiking-pony', 'photo-trio-studio.jpg', 'Latte, Mocha and Sweet Cream collagen coffee pouches photographed together in the studio.'),
    contentModules: [
      text('one brand, every touchpoint.', 'Hiking Pony makes no-brew collagen coffee in Austin. We carried the brand from single-serve sachets to 10-serving retail pouches, photographed the finished range, built the website people buy it on and filmed the founder introducing it. Each piece has its own case study below.'),
      media('hiking-pony', 'sweet-cream-packaging.jpg', 'Front and back of the berry Sweet Cream collagen coffee pouch.'),
      text('packaging.', 'One architecture across sachets and 10-serving pouches, with flavor-led color, a clear function line on the front and production-ready artwork for every SKU.'),
      media('hiking-pony', 'photo-mocha-styled.jpg', 'The Mocha pouch styled with coconut, cocoa and dark chocolate on weathered wood.'),
      text('photography and website.', 'A studio and styled product shoot of the finished pouches, and a website that carries the same story into the full range, recipes and retail links.'),
    ],
    links: [
      { label: 'see the packaging design', href: '/work/hiking-pony-packaging' },
      { label: 'see the product photography', href: '/work/hiking-pony-photography' },
      { label: 'see the website', href: '/work/hiking-pony-website' },
      { label: 'watch the founder film', href: '/work/hiking-pony-founder-film' },
    ],
  }),
  project({
    cardImage: '/work/cards/smoothsailing.webp', cardAlt: 'Smoothsailing Sustainability, the consultancy homepage.',
    slug: 'smoothsailing', title: 'Smoothsailing Sustainability', tagline: 'A broad consultancy. A clear structure.',
    summary: 'A service-led website organizing a sustainability consultancy’s areas of expertise.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('smoothsailing', 'web-smoothsailing.jpg', 'Smoothsailing’s homepage and consultancy service structure.'),
    contentModules: [
      text('a clearer way through.', 'The homepage connects the consultancy’s positioning with defined service categories, an explanation of its approach, and a route to contact. A sailboat illustration gives the content a distinctive setting.'),
      media('smoothsailing', 'web-what-we-do.jpg', 'The What we do panel with moving tags for compliance, reporting, ESG, supply chain and more.'),
      media('smoothsailing', 'web-cta.jpg', 'A full-width call to chart a resilient, profitable and sustainable future, with a Let’s talk button.'),
    ],
    links: [{ label: 'visit the website', href: 'https://smoothsailingsustainability.com/' }],
  }),
  project({
    cardImage: '/work/cards/10-pillar-productions.webp', cardAlt: '10 Pillar Productions, the full-screen film homepage.',
    slug: '10-pillar-productions', title: '10 Pillar Productions', tagline: 'A home for work made to be watched.',
    summary: 'We redesigned the 10 Pillar Productions website around full-screen footage, clear film and commercial sections and a direct route to booking.',
    disciplines: ['Web'], services: ['Website design', 'Website build', 'Site structure'],
    heroMedia: image('10-pillar-productions', 'web-after-home.jpg', 'The new 10 Pillar Productions homepage: a full-screen film still behind the pillar mark and a short menu.'),
    contentModules: [
      text('from a busy menu to the footage.', '10 Pillar Productions makes narrative films, commercials, music videos and branded content. The old site opened on a large logo, a seven-item menu and a tagline before any of the work appeared. We rebuilt it so the footage leads: the homepage opens full screen on their films, with the pillar mark and a five-item menu laid over it.'),
      pair('10-pillar-productions', ['web-before-home.jpg', 'Before: the old 10 Pillar homepage with a large gold logo and a seven-item menu.'], ['web-after-home.jpg', 'After: the new homepage, opening full screen on the footage.']),
      text('organized the way clients look for work.', 'The menu now follows how people hire a production company: Films for feature length and short films, Commercial for brand work, Events, and Booking. The Films page opens straight onto the trailers.'),
      media('10-pillar-productions', 'web-after-films.jpg', 'The Films page: feature length movies and short films, opening on the trailers.'),
      text('a clear case, then a clear ask.', 'A bold statement and short company story sit next to behind-the-scenes photos, then a single Book With Us button and a scrolling list of what they make.'),
      media('10-pillar-productions', 'web-after-about.jpg', 'The homepage introduction: a bold company statement over the company story.'),
      media('10-pillar-productions', 'web-after-book.jpg', 'The Book With Us button and the scrolling list of services on the homepage.'),
    ],
    note: 'Burgama’s scope is the website. Film production displayed on that site belongs to 10 Pillar Productions unless separately credited.',
    links: [{ label: 'visit the website', href: 'https://www.10pillarproductions.com/' }],
  }),
  project({
    cardImage: '/work/cards/alh-senior-solutions.webp', cardAlt: 'ALH Senior Solutions, the senior-placement guidance website.',
    slug: 'alh-senior-solutions', title: 'ALH Senior Solutions', tagline: 'Making the next step easier to find.',
    summary: 'A Lending Hand’s senior-placement guidance, presented through services, resources, and a clear consultation path.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('alh-senior-solutions', 'web-alh.jpg', 'A Lending Hand Senior Solutions website presentation.'),
    contentModules: [
      text('information with a clear next step.', 'The homepage organizes the company’s story around the questions families bring to senior-living decisions. Services, FAQs, resources, and a consultation route help visitors move from introduction toward conversation.'),
      media('alh-senior-solutions', 'web-benefits.jpg', 'Four reasons to call: free service, local St. Louis and St. Charles experts, compassionate guidance and 24/7 consultations, plus 1,000+ families helped.'),
      media('alh-senior-solutions', 'web-journey.jpg', 'Your Journey With Us: a five-step process next to a photo of the team.'),
    ],
    links: [{ label: 'visit the website', href: 'https://www.alhseniorsolutions.com/' }],
  }),
  project({
    cardImage: '/work/cards/dr-saba-syed.webp', cardAlt: 'Dr. Saba Syed, the coaching and speaking website.',
    slug: 'dr-saba-syed', title: 'Dr. Saba Syed', tagline: 'A personal practice with a clear invitation.',
    summary: 'A direct introduction to Dr. Syed’s coaching and speaking work.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('dr-saba-syed', 'web-dr-saba-syed.jpg', 'Dr. Saba Syed’s coaching and speaking website.'),
    contentModules: [
      text('a direct introduction.', 'The page introduces Dr. Syed’s background and the people she serves, then offers routes to a discovery call, speaking enquiries, and resources. A warm palette and straightforward navigation keep the focus on her practice.'),
      pair('dr-saba-syed', ['web-about.jpg', 'Dr. Syed’s introduction beside her portrait.'], ['web-coaching.jpg', 'The coaching section with who it is for and a free discovery call button.']),
    ],
    links: [{ label: 'visit the website', href: 'https://www.drsabasyed.com/' }],
  }),
  project({
    cardImage: '/work/cards/turant.webp', cardAlt: 'TURANT, the community events and membership website.',
    slug: 'turant', title: 'TURANT', tagline: 'A digital gathering place for a community.',
    summary: 'Events, membership, and community programs for Turkish Americans in North Texas.',
    disciplines: ['Web'], services: ['Website'],
    heroMedia: image('turant', 'web-turant.jpg', 'TURANT website with community events and membership routes.'),
    contentModules: [
      text('participation at the center.', 'The homepage connects the association’s history with upcoming events, community imagery, and opportunities to take part. Membership and support routes help visitors find their place in an active community.'),
      media('turant', 'web-fifty-years.jpg', 'Celebrating 50 years of community, with the anniversary emblem.'),
      media('turant', 'web-what-we-do.jpg', 'What we do: cultural events, scholarships and community support.'),
    ],
    credits: [{ role: 'Legacy website attribution', name: 'Cedar & Cactus, as credited on the live site' }],
    links: [{ label: 'visit the website', href: 'https://www.turant.net/' }],
  }),
  project({
    cardImage: '/work/cards/avro.webp', cardAlt: 'A hand pulling an AVRO Energy stick from its tube between two orange drinks.',
    slug: 'avro', title: 'AVRO', tagline: 'One product, several social contexts.',
    summary: 'Social video and campaign imagery for AVRO’s calm, focus and energy drink mixes: a mocktail series, creator-style content and a retailer collaboration.',
    disciplines: ['Content', 'Production'], services: ['Social content', 'Video production', 'Campaign imagery'], period: '2026',
    heroMedia: image('avro', 'lifestyle-terrace.jpg', 'A man sipping an AVRO Energy orange tangerine drink at a sunset terrace party, with the yellow AVRO tube on the table.', 'wide'),
    contentModules: [
      text('different moments in the feed.', 'AVRO makes drink mixes for calm, focus and energy. Rather than one look, we put the product into the moments people actually reach for it: a mocktail by the pool, a creator at a local grocer, and a drink being made. Every piece in this collection was made by our team.'),
      { type: 'video', title: 'a mocktail, made on camera.', body: ['A Calm blackberry jasmine mocktail built poolside, shot vertically for Reels and TikTok.'], driveId: '1TURtE78gL7iA8PzASZ4li8jO8bcJWUSN', label: 'AVRO mocktail video', aspect: 9 / 16 },
      { type: 'video', title: 'a creator at the store.', body: ['A creator-style selfie video shot at Wheatsville, the Austin co-op grocer, for a retailer collaboration.'], driveId: '185LopBNJUZxeaBgNvKYS0udi1d8YmZBs', label: 'AVRO and Wheatsville collaboration video', aspect: 9 / 16 },
      { type: 'video', title: 'the pour.', body: ['A close, hands-only mixology piece that turns the mix into a drink step by step.'], driveId: '1nuFEzsvZGkHw8csxUx1tbMWO7zQtAPMR', label: 'AVRO mixology video', aspect: 9 / 16 },
      text('campaign imagery.', 'Alongside video we produced campaign images that place the tubes and sticks in settings that match each flavor, from a sunset terrace to the golf course.'),
      pair('avro', ['golf-display.jpg', 'The AVRO Energy orange tangerine tube on a wooden rail at a seaside golf course.', 'square'], ['topdown-drinks.jpg', 'A hand pulling an Energy stick from the AVRO tube between two orange drinks on marble.', 'tall']),
    ],
    links: [{ label: 'see the website before and after', href: '/work/avro-website' }],
  }),
  project({
    cardImage: '/work/cards/patent-earth.webp', cardAlt: 'Patent Earth ad: 60,000+ prints sold, with three patent prints.',
    slug: 'patent-earth', title: 'Patent Earth', tagline: 'Patent art, sold as the gift for someone who has everything.',
    summary: 'Content strategy, social video and gift-guide ad creative for Patent Earth, a wall art brand built on original patent drawings, including a reel with 144K views.',
    disciplines: ['Content', 'Marketing'], services: ['Content strategy', 'Social media content', 'Paid social creative'], period: '2026',
    heroMedia: image('patent-earth', 'ad-dad.jpg', 'Patent Earth gift guide ad: For the dad who has everything, with camera, screwdriver and golf club patent prints and a 1,800+ designs badge.', 'tall'),
    contentModules: [
      text('a strategy built on the buyers.', 'Patent Earth sells prints of original patent drawings, from golf clubs to guitars. We started with a content pillars document that defined who actually buys: gift-givers shopping for the person who has everything, hobbyists building a gallery wall, and people decorating a new place. Every post and ad maps back to one of them.'),
      { type: 'text', title: 'a reel that took off.', body: ['Our short-form videos pair Patent Earth’s art with moments people recognize. “POV: you turn on the big light” turned a universal pet peeve into a case for warm lighting and good wall art.'], stats: [
        { value: '144K', label: 'views on Instagram' },
        { value: '4,846', label: 'likes' },
      ], source: 'Instagram, November 2026.' },
      { type: 'video', title: 'the vibe killer.', body: ['The reel, posted July 28, 2026.'], instagramId: 'DbWC2CTgQ4L', label: 'Patent Earth big light reel on Instagram', aspect: 9 / 16 },
      text('history people want to share.', 'The organic side also leans on the stories behind everyday objects: green screen explainers on single patents, like the angle grinder, and carousels like eight facts about the Fourth of July that people swipe through and send to a friend, without a hard sell.'),
      { type: 'video', title: 'one tool, endless possibilities.', body: ['A green screen explainer on the angle grinder patent.'], instagramId: 'DbTXeggAegv', label: 'Patent Earth angle grinder explainer on Instagram', aspect: 9 / 16 },
      media('patent-earth', 'carousel-july-fourth.jpg', 'Carousel cover: 8 Facts About Our Country That We Bet You Didn’t Know, over a vintage small-town courthouse and flag.', 'tall'),
      text('gift guides that do the choosing.', 'For the holiday push we designed a full set of feed and story ads around gift-giving. Each one names the person you are shopping for, shows three prints that fit them, and closes on the same promise: free U.S. shipping and 45-day returns.'),
      { type: 'mediaGrid', items: [
        image('patent-earth', 'ad-athlete.jpg', 'Gift guide ad: For the athlete in your life, with golf and tennis patent prints and 30 sports to pick from.', 'tall'),
        image('patent-earth', 'ad-numbers.jpg', 'Ad: 60,000+ prints sold, with tennis racket, guitar and camera patent prints.', 'tall'),
        image('patent-earth', 'ad-four-ways.jpg', 'Ad: Poster. Canvas. Framed. Fourteen sizes and four print types, shown on a tennis court, a home plate and beside a guitar.', 'tall'),
      ] },
    ],
    links: [{ label: 'see the email marketing', href: '/work/patent-earth-email' }, { label: 'watch the reel on Instagram', href: 'https://www.instagram.com/reel/DbWC2CTgQ4L/' }, { label: 'visit Patent Earth', href: 'https://patentearth.com/' }],
  }),
  project({
    cardImage: '/work/cards/ollivate.webp', cardAlt: 'Ollivate ad: earn AANA-approved CE credits for free, with the app on a phone.',
    slug: 'ollivate', title: 'Ollivate', tagline: 'Duolingo-style learning for nurse anesthetists, sold through paid social.',
    summary: 'A two-funnel Meta Ads program for Ollivate’s CRNA continuing education and board prep products: 91,818 impressions and 1,050 link clicks at $0.80 each.',
    disciplines: ['Marketing', 'Content'], services: ['Meta Ads strategy', 'Funnel planning', 'Static and video ad creative'], period: 'August to October 2025',
    heroMedia: image('ollivate', 'ad-square-duolingo.jpg', 'Ollivate ad: Play. Learn. Earn. Just like Duolingo but for CRNAs, with screens of the learning map, a quiz question, daily quests and the leaderboard.', 'square'),
    contentModules: [
      { type: 'text', title: 'the headline numbers.', body: ['Three months of Meta Ads, August through October 2025.'], stats: [
        { value: '91,818', label: 'impressions' },
        { value: '1,050', label: 'link clicks' },
        { value: '$0.80', label: 'cost per link click' },
      ], source: 'Meta Ads Manager, August 1 to October 31, 2025. $835.71 total spend.' },
      text('two products, two funnels.', 'Ollivate is a gamified study app for nurse anesthetists. We built separate awareness, consideration and conversion paths for its two products: free AANA-approved continuing education credits for working CRNAs, and board prep for students. Each stage had its own audience, from CRNA lookalikes and interest groups at the top to retargeted engagers at the bottom.'),
      text('show the app, not a stock photo.', 'The creative leads with the product itself. Quiz questions people can answer in their head, the map-style learning path, streaks and the leaderboard make the app feel like a game before anyone downloads it. Static and motion versions ran in square and vertical formats, with variations built for partnership ads with the AANA.'),
      { type: 'mediaGrid', items: [
        image('ollivate', 'ad-vertical-quiz.jpg', 'Vertical ad: Do you know your anesthesia? with a quiz question and the correct answer rationale.', 'tall'),
        image('ollivate', 'ad-vertical-ce-app.jpg', 'Vertical ad: Earn AANA-approved CE credits for free, with the app’s learning map on a phone.', 'tall'),
        image('ollivate', 'ad-vertical-ce-photo.jpg', 'Vertical ad: Earn AANA-approved CE credits for free, with gloved hands making a heart.', 'tall'),
      ] },
      text('test, then scale.', 'We tested audiences first, lookalikes against interests, then creative, and moved budget toward the ad sets with the lowest cost per click. The strongest campaign, interests plus lookalikes, reached 601 link clicks at $0.67 each.'),
    ],
    note: 'Link clicks are visits to the app download page, not completed installs.',
  }),
  project({
    cardImage: '/work/cards/cloon.webp', cardAlt: 'Cloon, the existing brand logo shown without a background panel.',
    slug: 'cloon', title: 'Cloon', tagline: 'A focused approach to search advertising.',
    summary: 'Intent-based keyword selection, tailored ad copy, and bid management for a Google Search campaign.',
    disciplines: ['Marketing', 'Growth'], services: ['Google Ads'],
    contentModules: [text('start with intent.', 'The campaign approach brought together focused keywords, ad-copy decisions, and bid management. Its aim was to connect searchers with the website while keeping spending controlled.')],
  }),
  project({
    cardImage: '/work/cards/matchday-email.webp', cardAlt: 'MatchDay email: Find your game this week, with a search bar, filter chips and a match photo.',
    slug: 'matchday-email', title: 'MatchDay email flows', client: 'MatchDay', parentSlug: 'matchday', collection: 'case-study',
    tagline: 'Emails that look and work like the app.',
    summary: 'Automated Klaviyo flows that move pickup soccer players from sign-up to their first, second and third match: 28,463 emails delivered and 1,494 match bookings attributed.',
    disciplines: ['Marketing'], services: ['Email marketing', 'Klaviyo flows', 'HTML email design'], period: 'August to November 2026',
    heroMedia: image('matchday-email', 'email-find-your-game.jpg', 'MatchDay email: Find your game this week, with a search bar, date, field, time range and team size chips, and a night match photo.', 'tall'),
    contentModules: [
      { type: 'text', title: 'the headline numbers.', body: ['Every live flow, August 7 to November 20, 2026.'], stats: [
        { value: '28,463', label: 'Flow emails delivered' },
        { value: '1,494', label: 'Match bookings attributed to the flows, from 1,050 players' },
        { value: '36%', label: 'Open rate on the Welcome flow' },
        { value: '4.7%', label: 'Of players emailed by the weekly flow booked again' },
      ], source: 'Klaviyo flow report, pulled November 20, 2026, with Booked Match as the conversion.' },
      text('a flow for every stage.', 'MatchDay makes money when people keep playing, so we mapped the email program to the player’s path rather than the calendar. Welcome offers the first match free. Second Match and Third Match follow each booking while the game is still fresh. A weekly flow reaches players who booked recently but skipped the last week, a membership flow shows regulars what they would save on one monthly rate, and a churn flow brings lapsed players back with a 50% off COMEBACK code.'),
      text('send when people book.', 'The weekly flow only sends Monday to Wednesday at 2:30 PM Central, because that is when MatchDay sees the most bookings and app activity. The email lands right as players are planning their week.'),
      text('emails that look like the app.', 'In November we rebuilt the flows in HTML styled after the MatchDay app itself: a notification card, stat tiles for matches played, a search bar with filter chips, and real match photos. Every button, card and image opens the app, and we tested the designs in dark mode on iPhone Gmail before they went live.'),
      { type: 'mediaGrid', items: [
        image('matchday-email', 'email-welcome.jpg', 'Welcome email: Welcome, Deniz, your first match is free, styled like an app notification with matches played and first match stat tiles.', 'tall'),
        image('matchday-email', 'email-comeback.jpg', 'Churn email: Comeback, the pitch is calling, with a player celebrating and the 50% off COMEBACK code.', 'tall'),
      ] },
      text('a cleaner list every month.', 'Before each monthly renewal we run MatchDay’s 60-day rule: profiles with no opens, clicks, site visits, registrations or bookings in 60 days are suppressed from email, while their SMS consent is kept. The list stays engaged, deliverability stays healthy and MatchDay only pays for profiles that are still playing.'),
    ],
    note: 'Klaviyo attributes a booking to an email when the player opened or clicked it within its attribution window, so some of these bookings would have happened anyway. Treat them as influence, not incremental lift.',
    links: [{ label: 'see MatchDay on Instagram', href: 'https://www.instagram.com/playmatchday/' }],
  }),
  project({
    cardImage: '/work/cards/patent-earth-email.webp', cardAlt: 'Patent Earth email: For the dad who has everything, with three patent prints.',
    slug: 'patent-earth-email', title: 'Patent Earth email marketing', client: 'Patent Earth', parentSlug: 'patent-earth', collection: 'case-study',
    tagline: 'A dormant list, back in the inbox and selling.',
    summary: 'Klaviyo flows, deliverability repair and a holiday gift-guide series for a patent art brand: open rates up from 18% to 35%, and welcome and checkout flows earning about twice Klaviyo’s averages per person.',
    disciplines: ['Marketing'], services: ['Email marketing', 'Klaviyo flows', 'Deliverability', 'Email design'], period: 'July to November 2026',
    heroMedia: image('patent-earth-email', 'email-dad.jpg', 'Patent Earth gift guide email: For the dad who has everything, with camera, screwdriver and golf club patent prints and a he doesn’t have this one sticker.', 'tall'),
    contentModules: [
      { type: 'text', title: 'the headline numbers.', body: ['From the first send to a dormant list in August to the holiday run in November.'], stats: [
        { value: '$5.53', label: 'Revenue per welcome email recipient, against Klaviyo’s $2.65 average' },
        { value: '$6.40', label: 'Revenue per abandoned checkout recipient, against a $3.65 average' },
        { value: '35.4%', label: 'Open rate after we moved to engaged-only sending, up from 18.2%' },
        { value: '2.4x', accessibleValue: '2.4 times', label: 'Gmail open rate, 4.5% to 10.6%' },
      ], source: 'Klaviyo. Flow revenue June 27 to September 25, 2026, compared with Klaviyo’s 2024 benchmarks. Open rates for the week after October 15, 2026, against the prior 30 days.' },
      text('wake the list without burning it.', 'Patent Earth had about 9,000 subscribers who had not heard from the brand in a long time. The first newsletter reached a 23.8% open rate with spam complaints at 0.2%, which told us the audience still recognized the brand. A subject line test showed a plain update more than doubled clicks over borrowed urgency, 1.39% against 0.62%, and two product photos linked straight to their listings pulled nearly as many clicks as all the Wall Art buttons combined. That shaped every send after it: photography first, with each print linked to its exact product.'),
      text('fix what the reports could not see.', 'Klaviyo was reporting $0 for every flow because it was still counting orders from an old Magento metric. We switched it to BigCommerce, added the tracking snippet for product views, and checked the skipped sends by hand. 38 new subscribers ordered before the second welcome email, while Klaviyo credited only 12, so the popup code was doing more work than any report showed.'),
      text('get back into Gmail.', 'Gmail was about half of all mail and only 4.5% of it was opened, against 26% at Yahoo and 40% at Outlook. We moved every campaign to engaged subscribers, built a sunset flow for roughly 5,270 profiles that had not engaged in 120 days, and mapped the SPF fix for order emails. Within a week, opens nearly doubled and bounces halved.'),
      text('a gift guide for every person on the list.', 'For the holidays we planned a run of gift guides from Veterans Day to Cyber Monday, each one led by the person rather than the discount: the veteran, the musician, the dad who has everything, the trades, the professional. The sale sits in a thin bar under the hero, and every print shown links to its own product page.'),
      { type: 'mediaGrid', items: [
        image('patent-earth-email', 'email-veterans.jpg', 'Veterans Day email: Thank the ones who served, the patents behind the gear they served with.', 'tall'),
        image('patent-earth-email', 'email-musicians.jpg', 'Music gift guide email: Turn it up, gifts for musicians and the people who listen to them, with a 1955 guitar patent.', 'tall'),
        image('patent-earth-email', 'email-trades.jpg', 'Trades gift guide email: For the one who works with their hands, with a screwdriver patent print.', 'tall'),
      ] },
      text('flows that keep selling.', 'Alongside the campaigns we built post-purchase and sunset flows in the same design: a review request that routes lower ratings to a private feedback form, gift picks matched to what someone bought, and a last-chance pair of emails before an inactive subscriber is removed.'),
    ],
    note: 'Revenue per recipient covers orders Klaviyo attributes to an email. Orders placed with the popup code without opening an email are not included, so the welcome figure understates the flow.',
    links: [{ label: 'visit Patent Earth', href: 'https://patentearth.com/' }],
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
    cardImage: '/work/cards/hiking-pony-packaging.webp', cardAlt: 'Front and back of the Hiking Pony Sweet Cream collagen coffee pouch.',
    slug: 'hiking-pony-packaging', title: 'Hiking Pony packaging', client: 'Hiking Pony', parentSlug: 'hiking-pony', collection: 'case-study',
    tagline: 'One system, from sachet to shelf.',
    summary: 'A scalable packaging architecture for Hiking Pony’s collagen coffee, carried from single-serve sachets into 10-serving retail pouches.',
    disciplines: ['Packaging'], services: ['Packaging redesign', 'Packaging architecture', 'SKU rollout', 'Production artwork', '3D mockups'], period: '2025',
    heroMedia: image('hiking-pony', 'packaging-range.jpg', 'Front-and-back Hiking Pony coffee pouches in Latte, Mocha, and Sweet Cream flavors.'),
    contentModules: [
      text('one system, built to scale.', 'Hiking Pony needed to carry its existing identity from single-serve sachets into a larger retail format without losing the brand’s outdoor character or functional message. We translated the system into 10-serving pouches with a repeatable architecture for changing flavor names, product weights, and serving details.'),
      media('hiking-pony', 'sweet-cream-packaging.jpg', 'Front and back of the berry Sweet Cream collagen coffee pouch.'),
      text('make the function easy to find.', 'A clear top-of-pack line brings collagen, protein, MCTs, and preservative-free messaging into immediate view. The front balances the Hiking Pony mark, flavor, product format, origin details, and preparation cue, while the back organizes the brand story, directions, nutrition panel, ingredients, dietary badges, and QR touchpoint.'),
      media('hiking-pony', 'singles-board.jpg', 'Final front and back artwork for the Latte, Mocha and Sweet Cream single-serve sachets.'),
      text('four flavors, one architecture.', 'The framework was prepared across Latte, Mocha, Sweet Cream, and Peppermint Mocha. Shared placement and typography make the range recognizable as one family, while flavor-led color gives each SKU a distinct shelf presence. The rollout included single-serve and multi-pack layouts, production-ready mechanical artwork, and 3D product mockups.'),
    ],
    links: [{ label: 'see the product photography', href: '/work/hiking-pony-photography' }],
  }),
  project({
    cardImage: '/work/cards/hiking-pony-photography.webp', cardAlt: 'The Hiking Pony Mocha pouch styled with coconut and chocolate.',
    slug: 'hiking-pony-photography', title: 'Hiking Pony product photography', client: 'Hiking Pony', parentSlug: 'hiking-pony', collection: 'case-study',
    tagline: 'The new pouches, photographed for the store.',
    summary: 'A studio and styled product shoot of Hiking Pony’s 10-serving collagen coffee pouches for the website, retail and social.',
    disciplines: ['Photography'], services: ['Product photography', 'Art direction', 'Styling'], period: 'January 2026',
    heroMedia: image('hiking-pony', 'photo-mocha-styled.jpg', 'The Mocha pouch styled with coconut, cocoa and dark chocolate on weathered wood.'),
    contentModules: [
      text('show what is inside.', 'Each flavor is styled with the ingredients that define it: coconut, cocoa and dark chocolate for Mocha, coconut for Latte. The weathered wood set keeps the brand’s outdoor character without leaving the studio.'),
      media('hiking-pony', 'photo-latte-styled.jpg', 'The Latte pouch with coconut and ground coffee on weathered wood.'),
      text('the range, together.', 'Clean studio frames of the three flavors give retail partners and the online store a consistent set of range images.'),
      media('hiking-pony', 'photo-trio-studio.jpg', 'Latte, Mocha and Sweet Cream pouches together in the studio.'),
      media('hiking-pony', 'photo-lineup.jpg', 'The three pouches in a row with shallow depth of field.'),
      text('details and hands.', 'Close-ups of the product itself and the pouch in hand round out the set for social and email.'),
      pair('hiking-pony', ['photo-hand.jpg', 'A hand holding the Latte pouch through kraft paper.', 'tall'], ['photo-scoop.jpg', 'A spoonful of collagen coffee lifted from an open Latte pouch.', 'tall']),
    ],
    links: [{ label: 'see the packaging design', href: '/work/hiking-pony-packaging' }],
  }),
  project({
    cardImage: '/work/cards/hiking-pony-website.webp', cardAlt: 'The Hiking Pony website homepage.',
    slug: 'hiking-pony-website', title: 'Hiking Pony website', client: 'Hiking Pony', parentSlug: 'hiking-pony', collection: 'case-study',
    tagline: 'From shelf to screen.',
    summary: 'A product-led website carrying Hiking Pony’s coffee range, ingredients, recipes and retail links.',
    disciplines: ['Web'], services: ['Website design', 'Website development'], period: '2025',
    heroMedia: image('hiking-pony', 'web-hiking-pony.jpg', 'Hiking Pony website with product-led navigation and the coffee range.'),
    contentModules: [
      text('from shelf to screen.', 'The website extends the packaging story through the full coffee range, ingredient information, recipes, retail links, and brand narrative. The QR code on every pouch gives the physical product a direct route into that digital experience.'),
      media('hiking-pony', 'web-home-hero.jpg', 'The Hiking Pony homepage hero: an illustrated forest and sunburst behind the No-Brew Latte pouch, with protein and sugar callouts and shop buttons.'),
      text('explain the function, then show how to use it.', 'Below the hero, a Triple Energy section breaks the formula into collagen protein, coconut MCTs and clean caffeine. A recipe section filters by flavor, so a shopper can go from Sweet Cream to an iced latte in a few taps.'),
      pair('hiking-pony', ['web-triple-energy.jpg', 'The Triple Energy section explaining collagen protein, coconut MCTs and clean caffeine.'], ['web-recipes.jpg', 'Recipes filtered by blend, with step-by-step cards.']),
    ],
    links: [{ label: 'visit the website', href: 'https://hikingpony.com/' }],
  }),
  project({
    cardImage: '/work/cards/cellinkey-website.webp', cardAlt: 'The CellinKey homepage with a before and after slider over the model video.',
    slug: 'cellinkey-website', title: 'CellinKey website', client: 'CellinKey', parentSlug: 'cellinkey', collection: 'case-study',
    tagline: 'Proof first, then a short path to checkout.',
    summary: 'A Shopify storefront for CellinKey built around visible results, a one-click complete system and a checkout styled to match the brand.',
    disciplines: ['Web'], services: ['Shopify development', 'Conversion design', 'Checkout design'], period: '2025 to 2026',
    heroMedia: image('cellinkey-website', 'home-hero.jpg', 'The CellinKey homepage: a model video behind the headline Radiance Redefined, with a draggable before and after slider on the right.'),
    contentModules: [
      text('show the result before the pitch.', 'Skincare buyers want proof. The homepage opens on a model video with a draggable before and after slider built into the hero, so a visitor can see real skin results without scrolling. A full results gallery follows, with its own slider on every pair.'),
      media('cellinkey-website', 'results-slider.jpg', 'The Real Results gallery: a draggable before and after slider comparing skin texture.'),
      text('one decision, not five.', 'CellinKey sells a five-step routine. Instead of asking people to build it product by product, the homepage explains the system and what sets it apart, then offers the whole routine with one button and the savings next to it.'),
      pair('cellinkey-website', ['five-step-system.jpg', 'The five-step system section with a single Add Complete System to Cart button.'], ['add-system.jpg', 'The confirmation that appears once the complete system is in the cart.']),
      text('a checkout that feels like the brand.', 'The cart keeps to one product line, a clear total and express payment. The checkout carries the navy and white of the store, so the last step feels like the same site rather than a hand-off.'),
      media('cellinkey-website', 'cart.jpg', 'The CellinKey cart with the 5-Step System, estimated total, Check out and Google Pay buttons.'),
      media('cellinkey-website', 'checkout.jpg', 'The branded CellinKey checkout: express checkout, contact and delivery on navy, the order summary on the right.'),
      text('more reasons to stay.', 'Further down the store we added a shoppable TikTok carousel that adds products to the cart from the video itself, an ingredient glossary that breaks each formula into tappable ingredient tags, and clear shipping information for the United States and Latin America.'),
    ],
    links: [{ label: 'visit the website', href: 'https://cellinkeyskincare.com/' }, { label: 'see the CellinKey photography', href: '/work/cellinkey' }],
  }),
  project({
    cardImage: '/work/cards/wagner-founder-film.webp', cardAlt: 'Still from the Wagner Wealth Management founder film.',
    slug: 'wagner-founder-film', title: 'Wagner Wealth founder film', client: 'Wagner Wealth Management', parentSlug: 'wagner-wealth', collection: 'case-study',
    tagline: 'A personal practice, explained by the person behind it.',
    summary: 'A founder film for Wagner Wealth Management, finished with the identity we built for the practice.',
    disciplines: ['Production'], services: ['Founder film', 'Interview direction', 'Editing'],
    heroMedia: image('founder-films', 'wagner-wealth.jpg', 'Still from the Wagner Wealth Management founder film.'),
    contentModules: [
      { type: 'video', title: 'in his own words.', body: ['Wealth management runs on trust, and trust starts with a person. We put the founder in front of the camera, let him explain the practice in his own words, and finished the film with the Wagner monogram and colors from the identity we designed.'], driveId: '1nZrkLPwR09TKEjQ07b20RwFeM-ltP-EO', label: 'Wagner Wealth Management founder film' },
      text('one story, every touchpoint.', 'The film sits alongside the identity and website we made for the practice, so a prospective client gets the same voice whether they are reading the site or watching the founder.'),
    ],
    links: [{ label: 'see the Wagner identity and website', href: '/work/wagner-wealth' }],
  }),
  project({
    cardImage: '/work/cards/hiking-pony-founder-film.webp', cardAlt: 'Still from the Hiking Pony founder film, founder Nicole Pinedo waving hello.',
    slug: 'hiking-pony-founder-film', title: 'Hiking Pony founder film', client: 'Hiking Pony', parentSlug: 'hiking-pony', collection: 'case-study',
    tagline: 'Meet the founder behind the coffee bombs.',
    summary: 'A founder film for Hiking Pony’s coffee bombs launch, with founder Nicole Pinedo telling the story behind the product.',
    disciplines: ['Production'], services: ['Founder film', 'Interview direction', 'Editing'], period: 'June 2026',
    heroMedia: image('founder-films', 'hiking-pony.jpg', 'Hiking Pony founder Nicole Pinedo waving hello in front of a stone wall.'),
    contentModules: [
      { type: 'video', title: 'a founder, not a spokesperson.', body: ['For the coffee bombs launch we put founder Nicole Pinedo in front of the camera and let her introduce the product in her own voice: warm, quick and a little playful, the way she talks about it in person.'], driveId: '1uniEC6IBE0KvPS2Mz22UJGW7LKNKmuTR', label: 'Hiking Pony coffee bombs founder film' },
    ],
    links: [{ label: 'see the Hiking Pony packaging', href: '/work/hiking-pony' }],
  }),
  project({
    cardImage: '/work/cards/cold-cycle-founder-video.webp', cardAlt: 'Still from the Cold Cycle Coffee founder video featuring co-founder Monika.',
    slug: 'cold-cycle-founder-video', title: 'Cold Cycle Coffee founder video', client: 'Cold Cycle Coffee', collection: 'case-study',
    tagline: 'Meet Monika, the co-founder behind the brand.',
    summary: 'A vertical founder video for Cold Cycle Coffee introducing co-founder and CMO Monika.',
    disciplines: ['Production', 'Content'], services: ['Founder video', 'Social video'],
    heroMedia: image('founder-films', 'cold-cycle.jpg', 'Cold Cycle co-founder Monika in the founder video.', 'tall'),
    contentModules: [
      { type: 'video', title: 'built for the feed.', body: ['Cold Cycle’s co-founders met at UT. We put co-founder and CMO Monika in front of the camera, cut her story for vertical video and added bold on-screen captions, so the founder and the product land together in the first few seconds.'], instagramId: 'DdW5cqvohWh', label: 'Cold Cycle Coffee founder video on Instagram', aspect: 9 / 16 },
    ],
    links: [{ label: 'watch on Instagram', href: 'https://www.instagram.com/reel/DdW5cqvohWh/' }],
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
      media('go2bites', 'web-before-home.jpg', 'Before: the old Go2Bites Squarespace homepage.'),
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
// One filter per project on /work. Client overviews that span several
// disciplines sit under multi-channel; every other page sits under its main
// discipline, so each filter only shows work of that kind.
export type WorkFilter = 'multi-channel' | 'brand' | 'content' | 'marketing' | 'packaging' | 'photography' | 'production' | 'search' | 'web'
const workFilterOverrides: Record<string, WorkFilter> = {
  'matchday-meta-ads': 'marketing',
  'matchday-social': 'content',
  'matchday-email': 'marketing',
  'patent-earth-email': 'marketing',
  'matchday-local-seo': 'search',
  'hush-hush-tan-social': 'content',
  'hush-hush-tan-seasonal': 'marketing',
  'avro-website': 'web',
  'cold-cycle-founder-video': 'production',
  'go2bites-packaging': 'packaging',
  'go2bites-film-website': 'production',
  'clement-local-search': 'search',
  'reclaim-local-search': 'search',
  ollivate: 'marketing',
  'patent-earth': 'multi-channel',
  cloon: 'marketing',
}
export function getWorkFilter(project: Pick<Project, 'slug' | 'disciplines' | 'parentSlug'>): WorkFilter {
  const override = workFilterOverrides[project.slug]
  if (override) return override
  const disciplines = project.disciplines.map(discipline => (discipline.toLowerCase() === 'growth' ? 'search' : discipline.toLowerCase()) as WorkFilter)
  if (!project.parentSlug && new Set(disciplines).size > 1) return 'multi-channel'
  return disciplines[0]
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
