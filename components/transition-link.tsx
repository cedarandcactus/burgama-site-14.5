'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { usePageTransition } from './page-transition'
import { useSmoothScroll } from './smooth-scroll'

export default function TransitionLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  const transition = usePageTransition()
  const scroll = useSmoothScroll()
  return <Link {...props} onClick={event => {
    onClick?.(event)
    const anchor = event.currentTarget
    if (!transition || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return
    const url = new URL(anchor.href, location.href)
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return
    if (url.pathname === location.pathname && url.search === location.search) {
      if (props.scroll !== false && scroll?.scrollToHash(url.hash, props.replace)) event.preventDefault()
      return
    }
    event.preventDefault()
    transition({ href: url.pathname + url.search + url.hash, replace: props.replace, scroll: props.scroll })
  }} />
}
