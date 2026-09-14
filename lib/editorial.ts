export type IdeaVisual = 'friction' | 'strength' | 'museum' | 'second-look'
export type IdeaTheme = 'cyan' | 'navy'

export type IdeaSection = {
  heading: string
  paragraphs: string[]
  pullQuote?: string
}

export type Idea = {
  slug: string
  category: string
  title: string
  dek: string
  meta: string
  thesis: string
  visual: IdeaVisual
  theme: IdeaTheme
  sections: IdeaSection[]
  closing: string
}

const ideas: Idea[] = [
  {
    slug: 'make-friction-useful',
    category: 'Design practice',
    title: 'Make friction useful',
    dek: 'The best experiences are not always the easiest. Sometimes a small amount of resistance is what makes an idea legible, memorable, and worth choosing.',
    meta: 'Essay · 6 minute read',
    thesis: 'Good friction slows people down at exactly the right moment. It asks for attention before a meaningful choice, gives an unfamiliar idea enough room to land, and makes an interaction feel authored rather than merely efficient.',
    visual: 'friction',
    theme: 'navy',
    sections: [
      {
        heading: 'Ease is not the only measure',
        paragraphs: [
          'Digital work is often judged by how completely it removes effort. Fewer steps, shorter copy, faster decisions. That instinct is useful when a person is repeating a known task, but it becomes limiting when the job is to create understanding or change a mind.',
          'A brand, exhibition, or new product sometimes needs a beat of uncertainty. The pause gives people time to notice what is different and decide how they feel about it. Remove that moment and the work may move quickly while leaving almost nothing behind.',
        ],
        pullQuote: 'The job is not to remove every pause. It is to make each pause earn its place.',
      },
      {
        heading: 'Friction can be a form of authorship',
        paragraphs: [
          'A deliberate sequence, an unexpected crop, or a question asked before a reveal can all create productive resistance. These choices tell the audience that the experience has a point of view. They make the structure part of the story.',
          'The distinction is intent. Useful friction creates anticipation, clarity, or commitment. Accidental friction creates doubt about whether something works. One strengthens trust; the other spends it.',
        ],
      },
      {
        heading: 'A practical test',
        paragraphs: [
          'When a moment takes longer than expected, ask what the extra time produces. Does it sharpen the decision? Does it reveal something that would otherwise be missed? Does it help the person understand where they are and what happens next?',
          'If the answer is no, simplify it. If the answer is yes, make the intention unmistakable. A purposeful pause should feel confident enough that no one mistakes it for a mistake.',
        ],
      },
    ],
    closing: 'Efficiency gets people through an experience. Useful friction gives them a reason to remember it.',
  },
  {
    slug: 'how-small-brands-feel-strong',
    category: 'Brand systems',
    title: 'How small brands feel strong',
    dek: 'Scale is not a prerequisite for authority. A clear point of view, repeated with discipline, can make a small organization feel larger than its footprint.',
    meta: 'Field note · 5 minute read',
    thesis: 'Small brands rarely need more material. They need fewer, stronger decisions: a recognizable voice, a visual rule people can repeat, and the confidence to leave some things unsaid.',
    visual: 'strength',
    theme: 'cyan',
    sections: [
      {
        heading: 'Strength begins with selection',
        paragraphs: [
          'Large organizations can afford inconsistency because recognition does some of the work for them. Smaller organizations cannot. Every touchpoint has to reinforce the same idea, especially when time and budget are limited.',
          'That makes editing more valuable than expansion. One type family used with range is stronger than five used cautiously. One useful sentence repeated in the right places is stronger than a page of interchangeable claims.',
        ],
      },
      {
        heading: 'Build a rule, not a moodboard',
        paragraphs: [
          'A moodboard can align taste, but it cannot keep a brand coherent once the launch is over. A useful system explains what stays fixed, what can move, and how to make a new thing feel related without making it identical.',
          'The best rules are visible in the work. They may be a particular relationship between image and language, a recurring rhythm, or a way of speaking that belongs to the organization. If the rule needs a long explanation, it is probably not doing enough.',
        ],
        pullQuote: 'Consistency is not making everything the same. It is making every difference feel intentional.',
      },
      {
        heading: 'Leave room for conviction',
        paragraphs: [
          'Small brands often soften their most distinctive qualities in an attempt to appeal to everyone. The result feels polite, familiar, and easy to forget. Authority comes from deciding what the brand will not be.',
          'A strong system gives a small team permission to move quickly because the important choices have already been made. That confidence is visible long before anyone knows the size of the organization behind it.',
        ],
      },
    ],
    closing: 'A small brand feels strong when every decision appears to come from the same clear center.',
  },
  {
    slug: 'digital-does-not-need-to-feel-corporate',
    category: 'Culture and digital',
    title: 'Digital doesn’t need to feel corporate',
    dek: 'Cultural organizations can be useful online without flattening the curiosity, texture, and surprise that make a physical visit matter.',
    meta: 'Perspective · 7 minute read',
    thesis: 'Museum and cultural websites should not imitate the building, but they should carry the same generosity: clear orientation, space for discovery, and many ways into the material.',
    visual: 'museum',
    theme: 'navy',
    sections: [
      {
        heading: 'Utility is part of the welcome',
        paragraphs: [
          'Opening hours, access information, tickets, and directions are not administrative debris. They are the first act of hospitality. When that information is difficult to find, the digital experience has already contradicted the institution’s public purpose.',
          'Clarity does not require a generic interface. It requires a hierarchy that respects why people arrived and what they may need next. The useful path can be direct while the surrounding experience remains expressive.',
        ],
      },
      {
        heading: 'A collection is not a catalogue page',
        paragraphs: [
          'Search and filters help people retrieve something they know. Culture also depends on encountering what they did not know to ask for. Digital systems should support both behaviors rather than treating discovery as an optional flourish.',
          'Connections between artists, ideas, places, and moments can become an editorial layer over the collection. That layer gives the institution a voice and turns database structure into a public experience.',
        ],
        pullQuote: 'The interface should organize the material without making the institution feel organized out of existence.',
      },
      {
        heading: 'Design for return visits',
        paragraphs: [
          'Many cultural sites behave as if every visitor is arriving for the first time. A stronger approach makes room for people who follow a program, revisit an archive, teach from the collection, or simply want a reason to come back.',
          'Editorial series, useful saved pathways, and living relationships between current and historic material can make the site feel active between physical visits. Digital stops being a brochure and becomes part of the institution itself.',
        ],
      },
    ],
    closing: 'The most useful cultural websites are not less expressive. They are expressive about the things people genuinely came to do.',
  },
  {
    slug: 'the-case-for-a-second-look',
    category: 'Working method',
    title: 'The case for a second look',
    dek: 'The first answer is often the most available one. Better work begins when a team stays with the question long enough to notice what the obvious answer missed.',
    meta: 'Studio note · 4 minute read',
    thesis: 'A second look is not endless revision. It is a deliberate return to the premise—after the first excitement has passed and before familiarity makes every choice feel inevitable.',
    visual: 'second-look',
    theme: 'cyan',
    sections: [
      {
        heading: 'Distance changes the question',
        paragraphs: [
          'Early ideas benefit from momentum. They need enough speed to become visible before judgement closes them down. But momentum can also hide assumptions, especially when the first route is fluent and easy to present.',
          'Stepping away creates a small amount of distance between the team and its own taste. The useful question changes from “Do we like this?” to “What is this choice doing, and is that still the right job?”',
        ],
      },
      {
        heading: 'Look again at what feels settled',
        paragraphs: [
          'The most valuable review is often aimed at the decisions no one is discussing: the familiar phrase in the brief, the inherited navigation, the audience described too broadly, or the format treated as fixed.',
          'Reopening one of those decisions can simplify everything downstream. The second look is powerful because it happens with more evidence than the first, not because it is automatically more cautious.',
        ],
        pullQuote: 'Iteration improves an answer. A second look can improve the question.',
      },
      {
        heading: 'Know when to stop',
        paragraphs: [
          'Reflection becomes avoidance when it no longer changes the work. A useful second look should produce a clearer premise, a stronger choice, or a confident return to the original direction.',
          'Once that happens, the team needs commitment more than another option. Looking again is valuable because it helps the work move forward with conviction.',
        ],
      },
    ],
    closing: 'The second look is not a retreat from instinct. It is how instinct becomes a decision the whole team can stand behind.',
  },
]

export function getPublishedIdeas() {
  return ideas
}

export function getIdea(slug: string) {
  return ideas.find(idea => idea.slug === slug)
}

export function getAdjacentIdeas(slug: string) {
  const index = ideas.findIndex(idea => idea.slug === slug)
  if (index === -1) return { previous: undefined, next: undefined }

  return {
    previous: index > 0 ? ideas[index - 1] : undefined,
    next: index < ideas.length - 1 ? ideas[index + 1] : undefined,
  }
}
