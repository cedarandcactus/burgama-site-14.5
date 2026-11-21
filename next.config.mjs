/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/contact', destination: '/#start-a-project', permanent: true },
      { source: '/ideas/:path*', destination: '/research/:path*', permanent: true },
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
