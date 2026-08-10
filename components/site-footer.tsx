import Link from 'next/link'
import { AnimatedText } from '@/components/animated-text'
import { BrandMark } from '@/components/brand-mark'

const LINKS = [
  { label: 'Selected work', href: '/work' },
  { label: 'Studio', href: '/studio' },
  { label: 'Capabilities', href: '/#capabilities' },
  { label: 'Contact', href: '/contact' },
]

export function SiteFooter() {
  return (
    <footer className="section-navy px-module py-12 md:py-20">
      <div className="rail mx-auto grid gap-module min-[900px]:grid-cols-12">
        <div className="pair-invert rounded-module p-5 md:p-8 min-[900px]:col-span-7 min-[900px]:row-span-2 min-[900px]:min-h-[320px]">
          <AnimatedText
            as="h2"
            lines={['Start a project', 'with the studio']}
            className="t-title max-w-[18ch] min-[900px]:text-6xl"
          />
        </div>

        <a
          href="mailto:hello@burgama.com"
          className="flex min-h-24 flex-col justify-between rounded-module bg-navy p-5 ring-1 ring-inset ring-periwinkle/30 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy min-[900px]:col-span-5"
        >
          <span className="t-ui">Direct line</span>
          <span className="t-section">hello@burgama.com</span>
        </a>

        <p className="flex min-h-24 flex-col justify-between rounded-module bg-navy p-5 ring-1 ring-inset ring-periwinkle/30 min-[900px]:col-span-5">
          <span className="t-ui">Based in</span>
          <span className="t-section">Austin, Texas</span>
        </p>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-module min-[900px]:col-span-8 min-[900px]:grid-cols-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="t-ui flex h-control items-center justify-center rounded-module bg-navy px-4 text-center ring-1 ring-inset ring-periwinkle/30 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-end justify-between gap-module rounded-module bg-navy p-4 ring-1 ring-inset ring-periwinkle/30 min-[900px]:col-span-4">
          <BrandMark className="h-4 w-auto" />
          <p className="t-ui text-right">Independent studio</p>
        </div>
      </div>
    </footer>
  )
}
