import type { Metadata } from 'next'
import { AnimatedText } from '@/components/animated-text'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Start a project with Burgama.',
}

const INCLUDE = [
  { label: 'What you are making', basis: '54%' },
  { label: 'Where it needs to go', basis: '44%' },
  { label: 'Timing', basis: '38%' },
  { label: 'Budget range', basis: '32%' },
  { label: 'Who is involved', basis: '28%' },
]

export default function ContactPage() {
  return (
    <>
      <section className="flex flex-col gap-module px-module pt-[92px] pb-16 md:pt-[140px]">
        <AnimatedText
          as="h1"
          lines={['Start a project']}
          className="t-display rail mx-auto mb-6"
        />

        <div className="rail mx-auto flex flex-col gap-module md:flex-row">
          <a
            href="mailto:hello@burgama.com"
            className="flex min-h-[36svh] flex-col justify-between gap-8 rounded-module bg-surface-1 p-6 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy md:basis-[58%] md:p-10"
          >
            <span className="t-ui">Direct line</span>
            <span className="t-title block">hello@burgama.com</span>
          </a>

          <div className="flex flex-col gap-module md:basis-[40%]">
            <p className="t-body flex-1 rounded-module bg-surface-2 p-6">
              One conversation, not a form funnel. Write with as much or as little as you have —
              we will reply with a straight answer about fit.
            </p>
            <p className="t-body rounded-module bg-surface-2 p-6">
              Austin, Texas
              <span className="t-ui mt-2 block">Working wherever the project leads</span>
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="include-title"
        className="flex flex-col gap-module px-module pb-24 md:pb-36"
      >
        <AnimatedText
          as="h2"
          id="include-title"
          lines={['Useful to include']}
          className="t-title rail mx-auto mb-6"
        />
        <div className="rail mx-auto flex flex-wrap gap-module">
          {INCLUDE.map((item) => (
            <p
              key={item.label}
              style={{ flexBasis: item.basis, flexGrow: 1 }}
              className="t-body flex h-24 min-w-[200px] items-end rounded-module bg-surface-1 p-5"
            >
              {item.label}
            </p>
          ))}
        </div>
      </section>

      <SiteFooter />
    </>
  )
}
