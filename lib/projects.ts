/**
 * Burgama project data model.
 * One schema drives /work and every /work/[slug] page.
 * All copy below is editable placeholder content.
 */

export type Tone = 'surface-1' | 'surface-2' | 'surface-3' | 'periwinkle'

export type Discipline =
  | 'Identity'
  | 'Digital'
  | 'Campaign'
  | 'Strategy'
  | 'Motion'

export type MediaRatio = 'wide' | 'video' | 'tall' | 'square' | 'full'

export type MediaItem = {
  /** Caption/alt describing what the frame holds. */
  label: string
  ratio: MediaRatio
  tone?: Tone
  /** Optional real asset. Solid surface is used when absent. */
  src?: string
}

export type ContentModule =
  | { type: 'text'; title?: string; body: string[] }
  | { type: 'media'; item: MediaItem }
  | { type: 'mediaPair'; items: [MediaItem, MediaItem] }
  | {
      type: 'mediaSplit'
      split: '60/40' | '40/60'
      title: string
      body: string[]
      item: MediaItem
    }
  | { type: 'mediaGrid'; items: MediaItem[] }
  | { type: 'quote'; body: string }
  | { type: 'process'; title: string; steps: { title: string; body: string }[] }

export type Project = {
  id: string
  slug: string
  title: string
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
  nextProjectSlug: string
}

export const projects: Project[] = [
  {
    id: 'p-identity-system',
    slug: 'identity-system',
    title: 'Identity system',
    client: 'Client to be confirmed',
    year: 'Year to be confirmed',
    summary:
      'A flexible identity built to hold a growing product family without losing its centre.',
    disciplines: ['Identity', 'Strategy'],
    services: ['Positioning', 'Identity design', 'Typography', 'Guidelines'],
    role: 'Studio of record',
    collaborators: ['Collaborators to be confirmed'],
    heroMedia: { label: 'Identity system hero frame', ratio: 'full', tone: 'surface-2' },
    introCopy: [
      'The identity begins as a point of view and',
      'ends as a system other people can build with.',
    ],
    contentModules: [
      {
        type: 'text',
        title: 'Overview',
        body: [
          'Placeholder overview copy. Describe what the work is, the surfaces it covers and why it exists.',
          'Keep the paragraph short. The modules that follow carry the detail.',
        ],
      },
      {
        type: 'mediaPair',
        items: [
          { label: 'Mark construction', ratio: 'square', tone: 'surface-2' },
          { label: 'Type specimen', ratio: 'square', tone: 'surface-1' },
        ],
      },
      {
        type: 'mediaSplit',
        split: '60/40',
        title: 'Point of view',
        body: [
          'Placeholder copy for the central idea. One decision, stated plainly, that the rest of the system answers to.',
        ],
        item: { label: 'Primary lockup', ratio: 'tall', tone: 'surface-3' },
      },
      {
        type: 'process',
        title: 'System',
        steps: [
          {
            title: 'Structure',
            body: 'Placeholder note on grid, spacing and the repeated module gap.',
          },
          {
            title: 'Typography',
            body: 'Placeholder note on the type system and how weight stays consistent.',
          },
          {
            title: 'Colour',
            body: 'Placeholder note on a small, fully opaque palette.',
          },
        ],
      },
      {
        type: 'mediaGrid',
        items: [
          { label: 'Application one', ratio: 'square', tone: 'surface-1' },
          { label: 'Application two', ratio: 'square', tone: 'surface-3' },
          { label: 'Application three', ratio: 'square', tone: 'surface-2' },
        ],
      },
      { type: 'quote', body: 'Placeholder quote. Replace with supplied words only.' },
    ],
    credits: [
      { role: 'Creative direction', name: 'To be confirmed' },
      { role: 'Design', name: 'To be confirmed' },
      { role: 'Production', name: 'To be confirmed' },
    ],
    outcomes: ['Outcomes to be supplied by the client.'],
    nextProjectSlug: 'digital-platform',
  },
  {
    id: 'p-digital-platform',
    slug: 'digital-platform',
    title: 'Digital platform',
    client: 'Client to be confirmed',
    year: 'Year to be confirmed',
    summary:
      'A product surface where editorial pacing and interface logic share the same grid.',
    disciplines: ['Digital', 'Identity'],
    services: ['Art direction', 'Design system', 'Front-end build'],
    role: 'Design and build partner',
    collaborators: ['Collaborators to be confirmed'],
    heroMedia: { label: 'Digital platform hero frame', ratio: 'full', tone: 'surface-3' },
    introCopy: [
      'One grid, one radius, one gap —',
      'repeated until the product feels inevitable.',
    ],
    contentModules: [
      {
        type: 'text',
        title: 'Overview',
        body: [
          'Placeholder overview copy describing the platform, its audience and the scope of the engagement.',
        ],
      },
      {
        type: 'media',
        item: { label: 'Primary interface', ratio: 'video', tone: 'surface-2' },
      },
      {
        type: 'mediaSplit',
        split: '40/60',
        title: 'Context',
        body: [
          'Placeholder copy on what needed to change, clarify or launch before the design work began.',
        ],
        item: { label: 'Mobile flow', ratio: 'tall', tone: 'surface-1' },
      },
      {
        type: 'process',
        title: 'Application',
        steps: [
          { title: 'Navigation', body: 'Placeholder note on compact, modular navigation.' },
          { title: 'Templates', body: 'Placeholder note on reusable page templates.' },
          { title: 'Motion', body: 'Placeholder note on clipped, opaque transitions.' },
        ],
      },
      {
        type: 'mediaPair',
        items: [
          { label: 'Component set', ratio: 'square', tone: 'surface-3' },
          { label: 'Editorial layout', ratio: 'square', tone: 'surface-2' },
        ],
      },
    ],
    credits: [
      { role: 'Design direction', name: 'To be confirmed' },
      { role: 'Engineering', name: 'To be confirmed' },
    ],
    outcomes: ['Outcomes to be supplied by the client.'],
    nextProjectSlug: 'campaign-system',
  },
  {
    id: 'p-campaign-system',
    slug: 'campaign-system',
    title: 'Campaign system',
    client: 'Client to be confirmed',
    year: 'Year to be confirmed',
    summary:
      'A campaign built as a kit of parts so every placement stays recognisable.',
    disciplines: ['Campaign', 'Motion'],
    services: ['Concept', 'Art direction', 'Toolkit', 'Rollout'],
    role: 'Creative studio',
    collaborators: ['Collaborators to be confirmed'],
    heroMedia: { label: 'Campaign hero frame', ratio: 'full', tone: 'surface-1' },
    introCopy: ['A campaign is a system', 'that happens to run on a deadline.'],
    contentModules: [
      {
        type: 'text',
        title: 'Overview',
        body: ['Placeholder overview copy for the campaign and the surfaces it ran across.'],
      },
      {
        type: 'mediaGrid',
        items: [
          { label: 'Out of home', ratio: 'square', tone: 'surface-2' },
          { label: 'Social frame', ratio: 'square', tone: 'surface-1' },
          { label: 'Print spread', ratio: 'square', tone: 'surface-3' },
        ],
      },
      {
        type: 'media',
        item: { label: 'Motion sequence', ratio: 'video', tone: 'surface-2' },
      },
      {
        type: 'text',
        title: 'Outcome',
        body: ['Outcomes to be supplied. No performance claims are published here yet.'],
      },
    ],
    credits: [{ role: 'Art direction', name: 'To be confirmed' }],
    outcomes: ['Outcomes to be supplied by the client.'],
    nextProjectSlug: 'motion-language',
  },
  {
    id: 'p-motion-language',
    slug: 'motion-language',
    title: 'Motion language',
    client: 'Client to be confirmed',
    year: 'Year to be confirmed',
    summary:
      'A motion grammar where type unfolds out of a mask instead of fading into view.',
    disciplines: ['Motion', 'Identity'],
    services: ['Motion principles', 'Type in motion', 'Handover kit'],
    role: 'Motion direction',
    collaborators: ['Collaborators to be confirmed'],
    heroMedia: { label: 'Motion language hero frame', ratio: 'full', tone: 'surface-2' },
    introCopy: ['Movement as architecture:', 'one thought reorganising into the next.'],
    contentModules: [
      {
        type: 'text',
        title: 'Overview',
        body: ['Placeholder overview copy for the motion system and where it is used.'],
      },
      {
        type: 'media',
        item: { label: 'Title sequence', ratio: 'video', tone: 'surface-3' },
      },
      {
        type: 'process',
        title: 'Principles',
        steps: [
          { title: 'Clip', body: 'Phrases begin masked rather than transparent.' },
          { title: 'Unfold', body: 'Small vertical travel with slight compression.' },
          { title: 'Settle', body: 'The next phrase inherits the same rhythm.' },
        ],
      },
    ],
    credits: [{ role: 'Motion design', name: 'To be confirmed' }],
    outcomes: ['Outcomes to be supplied by the client.'],
    nextProjectSlug: 'positioning-study',
  },
  {
    id: 'p-positioning-study',
    slug: 'positioning-study',
    title: 'Positioning study',
    client: 'Client to be confirmed',
    year: 'Year to be confirmed',
    summary:
      'Language work first: what the company means before anything is drawn.',
    disciplines: ['Strategy'],
    services: ['Research', 'Positioning', 'Naming architecture', 'Messaging'],
    role: 'Strategic partner',
    collaborators: ['Collaborators to be confirmed'],
    heroMedia: { label: 'Positioning study hero frame', ratio: 'full', tone: 'surface-3' },
    introCopy: ['Before the system,', 'a sentence worth designing around.'],
    contentModules: [
      {
        type: 'text',
        title: 'Overview',
        body: ['Placeholder overview copy for the positioning engagement.'],
      },
      {
        type: 'mediaSplit',
        split: '60/40',
        title: 'Point of view',
        body: ['Placeholder copy stating the central strategic decision.'],
        item: { label: 'Messaging map', ratio: 'tall', tone: 'surface-1' },
      },
    ],
    credits: [{ role: 'Strategy', name: 'To be confirmed' }],
    outcomes: ['Outcomes to be supplied by the client.'],
    nextProjectSlug: 'identity-system',
  },
]

export const disciplines: Discipline[] = [
  'Identity',
  'Digital',
  'Campaign',
  'Strategy',
  'Motion',
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export const featuredProjects = projects.slice(0, 3)

export const toneClass: Record<Tone, string> = {
  'surface-1': 'bg-surface-1 text-foreground',
  'surface-2': 'bg-surface-2 text-foreground',
  'surface-3': 'bg-surface-3 text-foreground',
  periwinkle: 'bg-periwinkle text-navy',
}
