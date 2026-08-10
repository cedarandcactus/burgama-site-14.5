import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { BrandMark } from '@/components/brand-mark'

const LINKS = [
  { label: 'Selected work', href: '/work', basis: '44%' },
  { label: 'Studio', href: '/studio', basis: '54%' },
]

export function SiteFooter() {
  return (
    <footer className="px-module pb-module">
      <div className="rounded-module bg-surface-1 px-module py-12 md:py-16">
        <div className="rail mx-auto flex flex-col gap-module">
        <AnimatedText
          as="h2"
          lines={['Start a project', 'with the studio']}
          className="t-title max-w-[18ch]"
        />

        <div className="flex flex-col gap-module md:flex-row">
          <a
            href="mailto:hello@burgama.com"
            className="t-body flex min-h-[104px] flex-col justify-end rounded-module bg-surface-2 p-5 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy md:basis-[56%]"
          >
            hello@burgama.com
          </a>
          <p className="t-body flex min-h-[104px] flex-col justify-end rounded-module bg-surface-2 p-5 md:basis-[42%]">
            Austin, Texas
            <span className="t-ui mt-2 block">Working wherever the project leads</span>
          </p>
        </div>

        <div className="flex gap-module">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ flexBasis: link.basis }}
              className="t-ui flex h-control items-center rounded-module bg-surface-2 px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </div>

          <div className="flex items-end justify-between gap-module pt-6">
            <BrandMark className="h-4 w-auto" />
            <p className="t-ui">Independent design studio</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
