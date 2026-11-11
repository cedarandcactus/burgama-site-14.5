import { OpenAIPixel } from '@/components/openai-pixel'

/* The ChatGPT ads landing page and its thank-you page share the pixel. */
export default function AiVisibilityLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <OpenAIPixel />
    </>
  )
}
