import { ModularButton } from '@/components/modular-button'
import { SiteFooter } from '@/components/site-footer'

export function ActClose() {
  return <>
    <section className="home-plate studio-plate" data-home-plate aria-labelledby="studio-heading">
      <h2 id="studio-heading" className="font-serif">Small team.<br />No handoffs.</h2>
      <div className="studio-description"><p>You work with the people doing the thinking and making. Fewer layers. Faster decisions. Better work.</p><ModularButton href="/studio" wide>Meet the studio</ModularButton></div>
    </section>
    <SiteFooter home />
  </>
}
