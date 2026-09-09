import { ModularButton } from '@/components/modular-button'
import { SiteFooter } from '@/components/site-footer'

export function ActClose() {
  return <>
    <section className="home-plate studio-plate" data-home-plate aria-labelledby="studio-heading">
      <h2 id="studio-heading" className="font-serif">small team.<br />shared ambition.</h2>
      <div className="studio-description"><p>For people with something to make, share, or change. We work with you, from the first conversation to the final detail.</p><ModularButton href="/studio" wide>meet the studio</ModularButton></div>
    </section>
    <SiteFooter home />
  </>
}
