import { ModularButton } from '@/components/modular-button'
import { SiteFooter } from '@/components/site-footer'

export function ActClose() {
  return <>
    <section className="home-plate studio-plate" data-home-plate aria-labelledby="studio-heading">
      <h2 id="studio-heading" className="font-serif">small team.<br />shared ambition.</h2>
      <div className="studio-description"><p>Burgama shapes identities and digital experiences for people with something meaningful to make. Small, senior teams. No account layer between planning the work and making it.</p><ModularButton href="/studio" wide>meet the studio</ModularButton></div>
    </section>
    <SiteFooter home />
  </>
}
