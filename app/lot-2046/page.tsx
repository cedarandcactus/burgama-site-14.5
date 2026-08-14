import type { Metadata } from 'next'
import QRCode from 'qrcode'
import { LotPoster } from '@/components/lot-poster'

export const metadata: Metadata = {
  title: 'LOT_2046 — Life-stream DJ set',
  description:
    'LOT_2046 life-stream DJ set from Berlin. Friday July 26, 1900 hr, on twitch.com/lot_2046.',
}

export const viewport = {
  colorScheme: 'light' as const,
  themeColor: '#ffffff',
}

export default async function LotPosterPage() {
  const qrSvg = await QRCode.toString('https://twitch.com/lot_2046', {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#ffffff', light: '#00000000' },
  })

  return <LotPoster qrSvg={qrSvg} />
}
