import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'

export function ActClose({ afterEnquiry }: { afterEnquiry?: ReactNode }) {
  return <SiteFooter afterEnquiry={afterEnquiry} />
}
