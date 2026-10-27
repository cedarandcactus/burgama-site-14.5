import { faqLlmText } from '@/lib/faq-content'

export const dynamic = 'force-static'

export function GET() {
  return new Response(faqLlmText(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
