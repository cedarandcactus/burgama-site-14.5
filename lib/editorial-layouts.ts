import type { IdeaPost } from './editorial'

export type EditorialFigure =
  | { kind: 'sequence' | 'comparison'; caption: string; items: { label: string; text: string }[] }
  | { kind: 'image'; src: string; alt: string; width: number; height: number; caption: string }

export type EditorialDirection = {
  style: 'journal' | 'technical'
  format: string
  sections: { title: string; start: number; note?: string }[]
  pullQuote?: string
  figure?: EditorialFigure
}

const directions: Record<string, EditorialDirection> = {
  'wix-vs-vercel': {
    style: 'journal', format: 'Analysis',
    sections: [
      { title: 'Two different starting points', start: 0 },
      { title: 'Control, ceiling and ownership', start: 3 },
      { title: 'Choosing for the job', start: 5 },
    ],
    pullQuote: 'Both can be the right answer. They are answers to different questions.',
  },
  'ai-website-audits': {
    style: 'journal', format: 'Field notes',
    sections: [
      { title: 'Checking the claims', start: 0, note: 'An observation from a single client audit, not a benchmark of every AI tool.' },
      { title: 'Patterns are not observations', start: 2 },
      { title: 'Separate the two jobs', start: 5 },
    ],
    pullQuote: 'An AI audit is a hypothesis generator, not an inspector.',
  },
  'squarespace-vs-custom-website': {
    style: 'journal', format: 'Perspective',
    sections: [
      { title: 'When the template is enough', start: 0 },
      { title: 'Where the limits appear', start: 2 },
      { title: 'A reason to rebuild', start: 4 },
    ],
    pullQuote: 'Sometimes the answer is to leave the site alone.',
  },
  'klaviyo-popup-best-practices': {
    style: 'technical', format: 'Practical guide',
    sections: [
      { title: 'The structural problem', start: 0 },
      { title: 'Three parts of a usable offer', start: 2, note: 'The email is a backup, not the delivery mechanism.' },
      { title: 'Timing and context', start: 5 },
    ],
    figure: { kind: 'sequence', caption: 'The offer stays in the shopping session. The welcome email provides a backup.', items: [
      { label: 'Show the code', text: 'Deliver the reward on the success screen.' },
      { label: 'Set the deadline', text: 'Tie the actual expiry to the subscriber.' },
      { label: 'Clarify the terms', text: 'State whether other discounts can combine.' },
    ] },
  },
  'judgeme-vs-yotpo': {
    style: 'technical', format: 'Comparison',
    sections: [
      { title: 'Cost, distribution and performance', start: 0 },
      { title: 'Migration and overlap', start: 4, note: 'Imported reviews do not automatically retain verified-buyer badges. Video reviews do not transfer.' },
      { title: 'Choosing one system', start: 6 },
    ],
    figure: { kind: 'comparison', caption: 'Two different priorities. The decision depends on where the store sells.', items: [
      { label: 'Judge.me', text: 'Cost predictability and reviews on your own storefront.' },
      { label: 'Yotpo', text: 'Retail syndication and reviews that travel to marketplaces.' },
    ] },
  },
  'squarespace-sitemap-not-updating': {
    style: 'technical', format: 'Technical note',
    sections: [
      { title: 'A stale map', start: 0 },
      { title: 'Verify the page first', start: 2, note: 'A successful response, indexable settings and a self-referencing canonical are separate checks.' },
      { title: 'Then request indexing', start: 4 },
    ],
    figure: { kind: 'sequence', caption: 'Verify the page and its map before asking a search engine to revisit it.', items: [
      { label: 'Page', text: 'Check the response, search settings and canonical URL.' },
      { label: 'Sitemap', text: 'Compare listed URLs with published pages.' },
      { label: 'Search Console', text: 'Submit the sitemap and prioritize indexing requests.' },
    ] },
  },
}

export function getEditorialDirection(idea: IdeaPost): EditorialDirection {
  return directions[idea.slug] ?? {
    style: 'journal', format: 'Essay', sections: [{ title: 'The observation', start: 0 }],
  }
}

export function getRelatedIdeas(idea: IdeaPost, entries: IdeaPost[]) {
  return entries.filter(entry => entry.slug !== idea.slug)
    .map(entry => ({ entry, overlap: entry.categories.filter(category => idea.categories.includes(category)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 2).map(({ entry }) => entry)
}
