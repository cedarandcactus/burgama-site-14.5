import Image from 'next/image'
import { ModularButton } from '@/components/modular-button'

export function ActOpening() {
  return (
    <section className="home-plate opening-plate" data-home-plate aria-labelledby="opening-title">
      <div className="opening-layout">
        <div className="opening-copy">
          <h1 id="opening-title" className="font-serif">marketing solutions for founders and startups in austin and beyond.</h1>
          <div className="opening-bottom">
            <p>We&apos;re a creative and marketing studio working across brand, digital, and campaign work. Thoughtful decisions, a clear direction, and a distinct point of view.</p>
            <ModularButton href="/studio">learn more</ModularButton>
          </div>
        </div>
        <div className="opening-art">
          <Image src="/hero/brand-artwork.webp" alt="" fill priority sizes="(min-width: 900px) 43vw, 100vw" />
        </div>
      </div>
    </section>
  )
}
