/**
 * The Burgama text logo. The drawn mark is retired site-wide, so the wordmark
 * set in Extended is the only brand signature the site uses.
 */
export function BrandMark({ className = '' }: { className?: string }) {
  return <span className={`wordmark ${className}`}>Burgama</span>
}
