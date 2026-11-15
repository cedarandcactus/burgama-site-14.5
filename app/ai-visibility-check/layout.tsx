import { headers } from 'next/headers'
import { OpenAIPixel } from '@/components/openai-pixel'

/* The ChatGPT ads landing page and its thank-you page share the pixel. */
export default async function AiVisibilityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /* Vercel's geo header. US visitors get opt-out measurement; elsewhere it stays opt-in. */
  const country = (await headers()).get('x-vercel-ip-country')
  return (
    <>
      {children}
      <OpenAIPixel optOutRegion={country === 'US'} />
    </>
  )
}
