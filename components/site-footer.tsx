import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { BrandMark } from '@/components/brand-mark'

const LINKS = [
  { label: 'Selected work', href: '/work', basis: '44%' },
  { label: 'Studio', href: '/studio', basis: '54%' },
]

export function SiteFooter() {
  return (
    <footer className="px-module py-12 md:py-20">
      <div className="rail mx-auto flex flex-col gap-module">
        <div className="rounded-module bg-surface-1 p-5 text-center md:p-7">
          <AnimatedText
            as="h2"
            lines={['Start a project', 'with the studio']}
            className="t-title mx-auto max-w-[18ch]"
          />
        </div>

        <div className="flex gap-module">
          <a
            href="mailto:hello@burgama.com"
            className="flex min-h-24 basis-[58%] flex-col items-center justify-center rounded-module bg-surface-2 p-4 text-center font-sans text-sm leading-relaxed transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
          >
            hello@burgama.com
          </a>
          <p className="flex min-h-24 basis-[42%] flex-col items-center justify-center rounded-module bg-surface-3 p-4 text-center font-sans text-sm leading-relaxed">
            Austin, Texas
            <span className="mt-1 block text-xs leading-snug text-muted-foreground">
              Working wherever the project leads
            </span>
          </p>
        </div>

        <div className="flex gap-module">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ flexBasis: link.basis }}
              className="flex h-control items-center justify-center rounded-module bg-surface-1 px-4 text-center font-sans text-sm leading-none transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
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
