import { ActCapabilities } from '@/components/home/act-capabilities'
import { ActClose } from '@/components/home/act-close'
import { ActMoreWork } from '@/components/home/act-more-work'
import { ActOpening } from '@/components/home/act-opening'
import { ActResearch } from '@/components/home/act-research'
import { ActStatement } from '@/components/home/act-statement'
import { ActWork } from '@/components/home/act-work'
import { SmoothScroll } from '@/components/smooth-scroll'

/*
  The homepage is a sequence of composed acts, not a stack of sections.

  Each act is its own file because each one is laid out by hand — there is no
  shared card or grid component being repeated with different content. That is
  the whole point of the approach: the composition changes as you descend.

  The acts take no props. Their content is transcribed by hand from the real
  entries in `lib/projects.ts` (titles, and scope lines drawn from each
  project's actual `services` array), because passing a project array in is
  exactly what pushes a layout back toward one component rendered N times.

  `SiteFooter` is deliberately NOT rendered here. ActClose ends the page with
  contact and carries the essential footer information inside that final
  composition. Appending the generic footer as well would give the homepage two
  endings and undo the handoff.
*/
export default function HomePage() {
  /*
    Ordered so the descent alternates between dense and open, and so the two
    projects that have no imagery (MatchDay, AVRO — neither has a `src` in
    projects.ts) sit inside an act built for typography rather than being
    dropped into an image-led one.
  */
  return (
    <>
      {/*
        Side-effect only — it installs Lenis on the document scroller and
        returns null, so it is a sibling rather than a wrapper.
      */}
      <SmoothScroll />
      <ActOpening />
      <ActWork />
      <ActResearch />
      <ActMoreWork />
      <ActStatement />
      <ActCapabilities />
      <ActClose />
    </>
  )
}
