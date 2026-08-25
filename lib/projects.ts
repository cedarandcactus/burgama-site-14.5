export type Tone = 'surface-1' | 'surface-2' | 'surface-3' | 'periwinkle'

export type Discipline = 'Brand' | 'Web' | 'Marketing' | 'Content' | 'Production' | 'Growth'
export type MediaRatio = 'wide' | 'video' | 'tall' | 'square' | 'full'

export type MediaItem = {
  label: string
  ratio: MediaRatio
  tone?: Tone
  src?: string
  mediaType?: 'image' | 'video'
  poster?: string
}

export type ContentModule =
  | { type: 'text'; title?: string; body: string[] }
  | { type: 'media'; item: MediaItem }
  | { type: 'mediaPair'; items: [MediaItem, MediaItem] }
  | { type: 'mediaSplit'; split: '60/40' | '40/60'; title: string; body: string[]; item: MediaItem }
  | { type: 'mediaGrid'; items: MediaItem[] }
  | { type: 'quote'; body: string }
  | { type: 'process'; title: string; steps: { title: string; body: string }[] }

/**
 * The tonal family a case study is set in.
 *
 * Only these five are valid on a project: the three case-study families plus
 * navy and magenta, the two site fields that also work as a full-page ground.
 *
 * Periwinkle is deliberately excluded. It is the one field that inverts to a
 * LIGHT ground, and a case study is a long read — setting some projects light
 * and others dark would make the archive feel like it was built by different
 * people. It stays a homepage accent.
 *
 * Every value needs a matching `[data-field='…']` block in globals.css.
 */
export type ProjectField = 'paper' | 'magenta' | 'pine' | 'rust' | 'teal'

export type Project = {
  id: string
  slug: string
  title: string
  /**
   * This project's ground, chosen for its subject rather than for variety —
   * the pitch is green, food is warm, wealth work stays institutional navy.
   *
   * Repeats are expected: there are more projects than families, and
   * inventing a sixth so every project could be unique would dilute the set
   * into a palette-per-page free-for-all. Two projects sharing pine is fine.
   */
  field: ProjectField
  client: string
  year: string
  summary: string
  disciplines: Discipline[]
  services: string[]
  role: string
  collaborators: string[]
  heroMedia: MediaItem
  introCopy: string[]
  contentModules: ContentModule[]
  credits: { role: string; name: string }[]
  outcomes: string[]
  externalUrl?: string
  externalLabel?: string
  nextProjectSlug: string
}

export const projects: Project[] = [
  {
    id: 'matchday',
    slug: 'matchday',
    title: 'MatchDay',
    /* Football pickup platform — the grass of the pitch. */
    field: 'pine',
    client: 'MatchDay',
    year: 'Ongoing engagement',
    summary: 'A joined-up growth and content partnership for a football pickup platform.',
    disciplines: ['Marketing', 'Content', 'Growth', 'Production'],
    services: ['Social media management', 'Content creation', 'SEO', 'Photography'],
    role: 'Marketing and creative partner',
    collaborators: [],
    heroMedia: { label: 'MatchDay social and campaign system', ratio: 'full', tone: 'periwinkle' },
    introCopy: ['One client story,', 'from search to social to the sideline.'],
    contentModules: [
      { type: 'text', title: 'The engagement', body: ['Burgama supports MatchDay across social media management, search optimization, content creation and photography—bringing the brand’s channels into one coordinated body of work.'] },
      { type: 'process', title: 'Connected scope', steps: [
        { title: 'Social', body: 'Ongoing management and publishing for the MatchDay community.' },
        { title: 'Search', body: 'SEO work designed to strengthen how the platform is found.' },
        { title: 'Field content', body: 'Photography and short-form content grounded in the game itself.' },
      ] },
      { type: 'text', title: 'Selected reach', body: ['A selected Instagram reel reached 15K views and 550 sends. A selected TikTok reached 21K views.'] },
    ],
    credits: [{ role: 'Marketing, content, SEO and photography', name: 'Burgama' }],
    outcomes: ['15K views and 550 sends on a selected Instagram reel.', '21K views on a selected TikTok.'],
    externalUrl: 'https://www.instagram.com/reel/DbObtvtR6Gt/',
    externalLabel: 'View selected MatchDay content',
    nextProjectSlug: 'go2bites',
  },
  {
    /* Food brand — warm and appetising rather than cool. */
    id: 'go2bites', slug: 'go2bites', title: 'Go2Bites', field: 'rust', client: 'Go2Bites', year: 'Selected work',
    summary: 'A food brand expressed through digital commerce, marketing, photography and founder film.',
    disciplines: ['Web', 'Marketing', 'Content', 'Production'],
    services: ['Website', 'Marketing', 'Photography', 'Founder video'], role: 'Digital and creative partner', collaborators: [],
    heroMedia: { label: 'Go2Bites ecommerce experience', ratio: 'full', tone: 'surface-2', src: '/work/go2bites/cover.png' },
    introCopy: ['A product story built', 'to move from shelf to screen.'],
    contentModules: [
      { type: 'text', title: 'The engagement', body: ['Burgama brought Go2Bites together across website design, marketing, product photography and a founder-led film—creating a coherent expression for both product and people.'] },
      { type: 'media', item: { label: 'Go2Bites website and seasonal campaign', ratio: 'wide', src: '/work/go2bites/cover.png', tone: 'surface-2' } },
      { type: 'process', title: 'One brand, four surfaces', steps: [
        { title: 'Commerce', body: 'A website that gives the product story a clear place to convert.' },
        { title: 'Campaign', body: 'Marketing work shaped for timely product moments.' },
        { title: 'Image and film', body: 'Photography and founder video that add appetite and authorship.' },
      ] },
    ],
    credits: [{ role: 'Web, marketing, photography and production', name: 'Burgama' }], outcomes: ['A unified customer-facing system across web, marketing, photography and film.'], externalUrl: 'https://go2bites.com/', externalLabel: 'Visit Go2Bites', nextProjectSlug: 'wagner-wealth',
  },
  {
    /*
      Private wealth — stays on the site's own navy. Not every project needs a
      new colour, and an institutional finance brand is exactly where the
      restrained default is the right answer.
    */
    id: 'wagner-wealth', slug: 'wagner-wealth', title: 'Wagner Wealth', field: 'paper', client: 'Wagner Wealth Management', year: 'Selected work',
    summary: 'A private wealth brand shaped through identity, digital experience and founder storytelling.',
    disciplines: ['Brand', 'Web', 'Production'], services: ['Branding', 'Website', 'Founder video'], role: 'Brand and digital partner', collaborators: [],
    heroMedia: { label: 'Wagner Wealth digital experience', ratio: 'full', src: '/work/wagner-wealth/cover.png', tone: 'surface-3' },
    introCopy: ['A measured identity', 'for a deeply personal service.'],
    contentModules: [
      { type: 'text', title: 'The engagement', body: ['Burgama developed Wagner Wealth Management across branding, website and founder film, pairing a composed visual language with a more human introduction to the firm.'] },
      { type: 'media', item: { label: 'Wagner Wealth website', ratio: 'wide', src: '/work/wagner-wealth/cover.png', tone: 'surface-3' } },
      { type: 'process', title: 'The system', steps: [
        { title: 'Identity', body: 'A brand foundation for a private wealth practice.' },
        { title: 'Digital', body: 'A website carrying the identity into a clear client experience.' },
        { title: 'Founder story', body: 'Film that gives the practice a face and point of view.' },
      ] },
    ], credits: [{ role: 'Brand, web and production', name: 'Burgama' }], outcomes: ['A consistent brand story across identity, website and founder film.'], externalUrl: 'https://www.wagnerwealthtx.com/', externalLabel: 'Visit Wagner Wealth', nextProjectSlug: 'avro',
  },
  {
    /* Content and production work — magenta, the most editorial of the set. */
    id: 'avro', slug: 'avro', title: 'AVRO', field: 'magenta', client: 'AVRO', year: 'Selected work',
    summary: 'A production partnership spanning commercial social, UGC and retailer collaboration content.',
    disciplines: ['Content', 'Production', 'Marketing'], services: ['Commercial production', 'Social content', 'UGC content', 'Retailer collaborations'], role: 'Content and production partner', collaborators: [],
    heroMedia: { label: 'AVRO content production', ratio: 'full', tone: 'surface-3' },
    introCopy: ['A content system', 'made to meet the moment.'],
    contentModules: [
      { type: 'text', title: 'The engagement', body: ['Burgama produces AVRO content across commercial social work, UGC and retailer collaborations—building a varied stream of brand material without separating production from channel context.'] },
      { type: 'process', title: 'Production range', steps: [
        { title: 'Commercial social', body: 'Produced campaign content for AVRO’s social channels.' },
        { title: 'UGC', body: 'Platform-native content with a more direct, lived-in voice.' },
        { title: 'Retail', body: 'Collaborative content designed around retailer moments.' },
      ] },
    ], credits: [{ role: 'Content and production', name: 'Burgama' }], outcomes: ['A multidisciplinary content library spanning commercial, UGC and retail formats.'], externalUrl: 'https://www.instagram.com/reel/DW9Tvp7kYqJ/', externalLabel: 'View selected AVRO content', nextProjectSlug: 'wurqly',
  },
  {
    /*
      Outdoor brand — pine again, and deliberately so. It shares the family
      with MatchDay because both are literally outdoors; forcing a different
      colour purely to avoid a repeat is what turns a system into decoration.
    */
    id: 'hiking-pony', slug: 'hiking-pony', title: 'Hiking Pony', field: 'pine', client: 'Hiking Pony', year: 'Selected work',
    summary: 'A connected website, product design and social presence for an outdoor-minded brand.',
    disciplines: ['Web', 'Content', 'Marketing'], services: ['Website', 'Product design', 'Social'], role: 'Digital, product and social partner', collaborators: [],
    heroMedia: { label: 'Hiking Pony digital and product experience', ratio: 'full', src: '/work/hiking-pony/cover.png', tone: 'surface-1' },
    introCopy: ['One product world,', 'from interface to feed.'],
    contentModules: [
      { type: 'text', title: 'The engagement', body: ['Burgama worked with Hiking Pony across website, product design and social—building a consistent experience from the product itself to the places audiences meet it.'] },
      { type: 'media', item: { label: 'Hiking Pony website and product design', ratio: 'wide', src: '/work/hiking-pony/cover.png', tone: 'surface-1' } },
      { type: 'process', title: 'Connected touchpoints', steps: [
        { title: 'Website', body: 'A focused digital home for the brand and its product story.' },
        { title: 'Product', body: 'Product design shaped around a clear, useful customer experience.' },
        { title: 'Social', body: 'A channel presence that carries the same visual and verbal system.' },
      ] },
    ], credits: [{ role: 'Website, product design and social', name: 'Burgama' }], outcomes: ['A consistent brand experience across website, product and social.'], nextProjectSlug: 'matchday',
  },
  {
    id: 'wurqly',
    slug: 'wurqly',
    title: 'Wurqly',
    /*
      The brand's own cobalt is the closest thing in the archive to a signal
      colour, so teal gives it a ground in the same cool region without the
      page competing with the identity work it is showing.
    */
    field: 'teal',
    client: 'Wurqly',
    year: '2025',
    summary: 'A category-defining identity and digital launch for the workforce marketplace built for every side of service work.',
    disciplines: ['Brand', 'Web', 'Marketing', 'Content'],
    services: ['Brand strategy', 'Messaging', 'Visual identity', 'Website design', 'Website development', 'SEO', 'Developer handoff'],
    role: 'Lead brand and digital partner',
    collaborators: [],
    heroMedia: {
      label: 'Wurqly identity in motion',
      ratio: 'video',
      src: '/work/wurqly/brand-motion.mp4',
      poster: '/work/wurqly/shaded-logo.png',
      mediaType: 'video',
      tone: 'surface-2',
    },
    introCopy: ['One workforce.', 'Every side of the work.'],
    contentModules: [
      {
        type: 'text',
        title: 'Challenge',
        body: [
          'Wurqly entered a fragmented field-service market where technicians, contractors and the businesses hiring them were forced through disconnected tools and generic job-board language.',
          'The launch needed to explain a two-sided platform without splitting the story in two, establish trust before marketplace scale existed, and give a new category a name people could remember.',
        ],
      },
      {
        type: 'media',
        item: {
          label: 'The Wurqly identity system',
          ratio: 'wide',
          src: '/work/wurqly/shaded-logo.png',
          tone: 'surface-2',
        },
      },
      {
        type: 'mediaSplit',
        split: '60/40',
        title: 'Strategy',
        body: [
          'We positioned Wurqly as the workforce marketplace where skilled work finds the right match. The message system speaks to workers and companies with equal clarity while keeping one shared promise at the center.',
          'A direct verbal framework made room for product education, recruiting and growth without losing the warmth of a platform built around people.',
        ],
        item: {
          label: 'Wurqly cobalt wordmark',
          ratio: 'square',
          src: '/work/wurqly/wordmark.svg',
          tone: 'surface-2',
        },
      },
      {
        type: 'text',
        title: 'Identity',
        body: [
          'The identity pairs a vivid cobalt signal with a calm periwinkle field. Its continuous, dimensional lettering suggests workflow, connection and forward movement without falling into familiar software symbolism.',
          'The system was designed to remain recognizable from a full-screen launch moment down to practical sales, product and recruiting applications.',
        ],
      },
      {
        type: 'mediaPair',
        items: [
          {
            label: 'Dimensional Wurqly logomark',
            ratio: 'square',
            src: '/work/wurqly/shaded-logo.png',
            tone: 'surface-2',
          },
          {
            label: 'Wurqly wordmark system',
            ratio: 'square',
            src: '/work/wurqly/wordmark.svg',
            tone: 'surface-2',
          },
        ],
      },
      {
        type: 'text',
        title: 'Execution',
        body: [
          'Burgama carried the strategy into a responsive marketing site that introduces the marketplace, routes each audience toward the right value story and builds a foundation for search visibility as the platform grows.',
          'Design, development and structured handoff were treated as one connected system, giving Wurqly a launch surface the internal team could extend without diluting the brand.',
        ],
      },
      {
        type: 'process',
        title: 'Built as one system',
        steps: [
          { title: 'Positioning', body: 'One market narrative with distinct paths for skilled workers and hiring teams.' },
          { title: 'Digital launch', body: 'A responsive, search-ready website translating the identity into a clear public experience.' },
          { title: 'Handoff', body: 'Reusable design logic and implementation guidance prepared for continued product and marketing growth.' },
        ],
      },
      {
        type: 'quote',
        body: 'A workforce platform should feel as connected as the people and businesses it brings together.',
      },
    ],
    credits: [
      { role: 'Strategy, messaging and identity', name: 'Burgama' },
      { role: 'Website design, development and SEO', name: 'Burgama' },
      { role: 'Developer handoff', name: 'Burgama' },
    ],
    outcomes: [
      'A differentiated launch identity for a two-sided workforce marketplace.',
      'One coherent message system spanning workers, contractors and hiring businesses.',
      'A responsive digital foundation prepared for search, product expansion and future campaigns.',
    ],
    externalUrl: 'https://wurqly.com/',
    externalLabel: 'Visit Wurqly',
    nextProjectSlug: 'cellinkey',
  },
  {
    /* Skincare — teal reads clean and clinical without going cold grey. */
    id: 'cellinkey', slug: 'cellinkey', title: 'CellinKey', field: 'teal', client: 'CellinKey', year: 'Selected work',
    summary: 'A skincare ecommerce experience supported by product and brand photography.',
    disciplines: ['Web', 'Content'], services: ['Website', 'Photography'], role: 'Digital and photography partner', collaborators: [],
    heroMedia: { label: 'CellinKey ecommerce experience', ratio: 'full', src: '/work/cellinkey/cover.png', tone: 'surface-1' },
    introCopy: ['A product experience', 'built around image and ritual.'],
    contentModules: [
      { type: 'text', title: 'The engagement', body: ['Burgama worked across CellinKey’s website and photography, placing product imagery at the center of the digital shopping experience.'] },
      { type: 'media', item: { label: 'CellinKey skincare website', ratio: 'wide', src: '/work/cellinkey/cover.png', tone: 'surface-1' } },
      { type: 'process', title: 'The pairing', steps: [
        { title: 'Website', body: 'An ecommerce surface for product discovery and education.' },
        { title: 'Photography', body: 'Brand and product imagery designed to carry the experience.' },
        { title: 'Continuity', body: 'A consistent visual language from campaign image to product page.' },
      ] },
    ], credits: [{ role: 'Web and photography', name: 'Burgama' }], outcomes: ['A connected ecommerce and photography system for the skincare brand.'], externalUrl: 'https://cellinkeyskincare.com/', externalLabel: 'Visit CellinKey', nextProjectSlug: 'matchday',
  },
]

export const disciplines: Discipline[] = ['Brand', 'Web', 'Marketing', 'Content', 'Production', 'Growth']
export function getProject(slug: string) { return projects.find((project) => project.slug === slug) }
export const toneClass: Record<Tone, string> = {
  'surface-1': 'bg-surface-1 text-foreground', 'surface-2': 'bg-surface-2 text-foreground',
  'surface-3': 'bg-surface-3 text-foreground', periwinkle: 'bg-periwinkle text-navy',
}
