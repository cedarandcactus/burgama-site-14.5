/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/contact', destination: '/#start-a-project', permanent: true },
      { source: '/ideas/:path*', destination: '/research/:path*', permanent: true },
      // Old cedarandcactus.com pages (from the Wayback Machine, Jan to May 2026).
      { source: '/about', destination: '/studio', permanent: true },
      { source: '/book-online', destination: '/#start-a-project', permanent: true },
      { source: '/form-finished', destination: '/', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/work/houston-dynamo', destination: '/work', permanent: true },
      { source: '/work/livelihood', destination: '/work', permanent: true },
      { source: '/work/meanwhile-brew', destination: '/work', permanent: true },
    ]
  },
  async rewrites() {
    return [{ source: '/demo/:slug', destination: '/demo/:slug/index.html' }]
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
    ] }, { source: '/demo/:path*', headers: [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
    ] }]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
