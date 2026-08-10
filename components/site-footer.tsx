import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { BrandMark } from '@/components/brand-mark'

const LINKS = [
  { label: 'Selected work', href: '/work', basis: '44%' },
  { label: 'Studio', href: '/studio', basis: '54%' },
]

export function SiteFooter() {
  return (
    <footer className="px-module py-16 md:py-24">
      <div className="rail mx-auto flex flex-col gap-module">
        <div className="rounded-module bg-surface-1 p-5 md:p-7">
          <AnimatedText
            as="h2"
            lines={['Start a project', 'with the studio']}
            className="t-title max-w-[18ch]"
          />
        </div>

        <div className="flex gap-module">
          <a
            href="mailto:hello@burgama.com"
            className="t-body flex min-h-[112px] basis-[58%] flex-col justify-end rounded-module bg-surface-2 p-5 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
          >
            hello@burgama.com
          </a>
          <p className="t-body flex min-h-[112px] basis-[42%] flex-col justify-end rounded-module bg-surface-3 p-5">
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
              className="t-ui flex h-control items-center rounded-module bg-surface-1 px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-end justify-between gap-module rounded-module bg-surface-2 p-4">
          <BrandMark className="h-4 w-auto" />
          <p className="t-ui text-right">Independent design studio</p>
        </div>
      </div>
    </footer>
  )
}
