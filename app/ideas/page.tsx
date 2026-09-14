import type { Metadata } from 'next'
import { EditorialIndex } from '@/components/editorial-index'

export const metadata: Metadata = {
  title: 'Ideas',
  description: 'Ideas, methods, and things worth a second look from Burgama.',
}

export default function IdeasPage() {
  return <EditorialIndex />
}
