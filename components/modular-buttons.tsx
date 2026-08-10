import Link from 'next/link'

type Action = {
  label: string
  href: string
  /** Flex basis so the pair fills the rail with intentional unevenness. */
  basis: string
  tone?: 'surface-1' | 'surface-2' | 'surface-3' | 'periwinkle'
}

const TONES = {
  'surface-1': 'bg-surface-1 text-foreground',
  'surface-2': 'bg-surface-2 text-foreground',
  'surface-3': 'bg-surface-3 text-foreground',
  periwinkle: 'bg-periwinkle text-navy',
}

export function ModularButtonGroup({
  actions,
  className = '',
}: {
  actions: Action[]
  className?: string
}) {
  return (
    <div className={`flex gap-module ${className}`}>
      {actions.map((action) => {
        const external = action.href.startsWith('mailto:') || action.href.startsWith('http')
        const classes = `t-ui flex h-control items-center rounded-module px-4 transition-colors duration-300 ease-module hover:bg-periwinkle hover:text-navy focus-visible:bg-periwinkle focus-visible:text-navy ${
          TONES[action.tone ?? 'surface-1']
        }`

        if (external) {
          return (
            <a
              key={action.label}
              href={action.href}
              className={classes}
              style={{ flexBasis: action.basis }}
            >
              {action.label}
            </a>
          )
        }

        return (
          <Link
            key={action.label}
            href={action.href}
            className={classes}
            style={{ flexBasis: action.basis }}
          >
            {action.label}
          </Link>
        )
      })}
    </div>
  )
}
