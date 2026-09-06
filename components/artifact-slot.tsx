import { getArtifact, RATIO_CSS } from '@/lib/artifacts'
import { cn } from '@/lib/utils'

export function ArtifactSlot({ id, className }: { id: string; className?: string }) {
  const artifact = getArtifact(id)
  if (!artifact?.src) return null
  return <figure className="artifact-figure"><div className={cn('artifact', className)} style={{ aspectRatio: RATIO_CSS[artifact.ratio] }} data-artifact={id}><img src={artifact.src} alt={artifact.alt ?? ''} className="artifact-media" loading="lazy" decoding="async" /></div>{artifact.caption && <figcaption className="artifact-caption">{artifact.caption}</figcaption>}</figure>
}
