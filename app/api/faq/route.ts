import { generateText, jsonSchema, Output } from 'ai'
import { faqInstructions, groundedAnswer, parseQuestion, type GeneratedFaq } from '@/lib/faq'

export const maxDuration = 30
export const runtime = 'nodejs'

const schema = jsonSchema<GeneratedFaq>({
  type: 'object',
  additionalProperties: false,
  required: ['scope', 'answer', 'sources', 'contact'],
  properties: {
    scope: { type: 'string', enum: ['supported', 'uncertain', 'unrelated'] },
    answer: { type: 'string', maxLength: 1200 },
    sources: { type: 'array', items: { type: 'string', enum: ['studio', 'team', 'approach', 'enquiry', 'unconfirmed'] }, maxItems: 5 },
    contact: { type: 'boolean' },
  },
}, {
  validate(value) {
    const item = value as GeneratedFaq | null
    if (!item || !['supported', 'uncertain', 'unrelated'].includes(item.scope) || typeof item.answer !== 'string' || item.answer.length > 1200 || typeof item.contact !== 'boolean' || !Array.isArray(item.sources) || !item.sources.every(id => typeof id === 'string')) {
      return { success: false, error: new Error('Invalid FAQ answer') }
    }
    return { success: true, value: item }
  },
})

// This bounds concurrent work per instance, not a distributed abuse-prevention service.
let activeRequests = 0

function reply(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Please ask from the Burgama website.' }, 403)
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return reply({ error: 'Please ask from the Burgama website.' }, 403)
  if (!request.headers.get('content-type')?.includes('application/json')) return reply({ error: 'Please send a question.' }, 415)

  let payload: unknown
  try {
    const reader = request.body?.getReader()
    if (!reader) return reply({ error: 'Please enter a question.' }, 400)
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 4096) {
        await reader.cancel()
        return reply({ error: 'Please keep your question under 500 characters.' }, 413)
      }
      chunks.push(value)
    }
    payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return reply({ error: 'Please enter a valid question.' }, 400)
  }
  const question = parseQuestion(payload)
  if (!question) return reply({ error: 'Please use between 3 and 500 characters.' }, 400)
  if (activeRequests >= 8) return reply({ error: 'A few questions are being answered. Please try again shortly.' }, 429)

  activeRequests += 1
  try {
    const { output } = await generateText({
      model: 'anthropic/claude-haiku-4.5',
      instructions: faqInstructions,
      prompt: JSON.stringify({ visitorQuestion: question }),
      output: Output.object({ schema }),
      maxOutputTokens: 450,
      maxRetries: 0,
      abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(22000)]),
    })
    return reply(groundedAnswer(output))
  } catch {
    return reply({ error: 'We couldn’t answer that just now. Try again, or contact the studio directly.' }, 503)
  } finally {
    activeRequests -= 1
  }
}
