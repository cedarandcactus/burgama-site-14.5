/**
 * ARTIFACT REGISTRY — the one file to edit when filling the site with assets.
 *
 * Every artifact slot on the site reads from this map by id. A slot with no
 * `src` renders a small labelled placeholder showing what belongs there, so
 * the site can be filled in one artifact at a time without touching any
 * component or stylesheet.
 *
 * To fill a slot:
 *   1. Drop the file in `public/artifacts/`.
 *   2. Set `src` (and `poster` for video).
 *   3. Nothing else. Ratio, treatment and captions already live here.
 *
 * `kind: 'model'` is reserved for real 3D. It currently renders the same
 * placeholder as the others — the slot, sizing and caption are all in place,
 * so wiring a viewer later is a component change, not a layout change.
 */

export type ArtifactKind = 'image' | 'video' | 'model'

/** Treatment applied to the asset. Matches the supplied references. */
export type ArtifactTreatment =
  /** Crushed toward 1-bit and screened with an ordered dot lattice. */
  | 'dither'
  /** Tones inverted, as in the right half of the colour reference. */
  | 'invert'
  /** Untouched — for portfolio work and video that should read as itself. */
  | 'none'

export type ArtifactRatio = 'square' | 'wide' | 'tall' | 'panorama' | 'free'

export type Artifact = {
  /** Tiny text shown in an unfilled slot. Describe the intended object. */
  label: string
  kind: ArtifactKind
  ratio: ArtifactRatio
  treatment: ArtifactTreatment
  /** Set this to fill the slot. Leave undefined to keep the placeholder. */
  src?: string
  /** Video only. */
  poster?: string
  /** Optional visible caption, set beneath the artifact. */
  caption?: string
  /**
   * Decorative artifacts stay out of the accessibility tree. Set a real
   * description for anything that carries meaning.
   */
  alt?: string
}

export const RATIO_CSS: Record<ArtifactRatio, string | undefined> = {
  square: '1 / 1',
  wide: '4 / 3',
  tall: '3 / 4',
  panorama: '21 / 9',
  free: undefined,
}

export const artifacts: Record<string, Artifact> = {
  /* ---- Homepage ------------------------------------------------- */
  'home-hero': {
    label: 'Primary hero artifact',
    kind: 'model',
    ratio: 'square',
    treatment: 'dither',
    alt: '',
  },
  'home-specimen-a': {
    label: 'Specimen 01',
    kind: 'image',
    ratio: 'tall',
    treatment: 'dither',
    alt: '',
  },
  'home-specimen-b': {
    label: 'Specimen 02',
    kind: 'model',
    ratio: 'tall',
    treatment: 'invert',
    alt: '',
  },
  'home-specimen-c': {
    label: 'Specimen 03',
    kind: 'image',
    ratio: 'tall',
    treatment: 'dither',
    alt: '',
  },

  /*
    The vault footage from the previous direction, kept as a filled slot so
    the reworked site still has one moving artifact in it. Treatment is
    'dither' to match everything else; the clip is already near-monochrome.
  */
  'home-motion': {
    label: 'Motion study',
    kind: 'video',
    ratio: 'panorama',
    treatment: 'dither',
    src: '/hero/vault.mp4',
    poster: '/hero/vault.jpg',
    caption: 'Motion study — vault sequence',
    alt: '',
  },

  /* ---- Interior page heroes ------------------------------------- */
  'work-hero': {
    label: 'Work index artifact',
    kind: 'model',
    ratio: 'panorama',
    treatment: 'dither',
    alt: '',
  },
  'studio-hero': {
    label: 'Studio artifact',
    kind: 'model',
    ratio: 'panorama',
    treatment: 'dither',
    alt: '',
  },
  'contact-hero': {
    label: 'Contact artifact',
    kind: 'image',
    ratio: 'wide',
    treatment: 'invert',
    alt: '',
  },
}

export function getArtifact(id: string): Artifact | undefined {
  return artifacts[id]
}
