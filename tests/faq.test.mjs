import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const cache = new Map()

function loadModule(path) {
  if (cache.has(path)) return cache.get(path)
  if (path.endsWith('.json')) return JSON.parse(readFileSync(path, 'utf8'))
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  })
  const exports = {}
  const context = {
    exports,
    URL,
    require: name => name.startsWith('.')
      ? loadModule(resolve(dirname(path), `${name}${name.endsWith('.json') ? '' : '.ts'}`))
      : require(name),
  }
  vm.runInNewContext(outputText, context, { filename: path })
  cache.set(path, exports)
  return exports
}

const content = loadModule(resolve('lib/faq-content.ts'))
const faq = loadModule(resolve('lib/faq.ts'))

test('all approved FAQ entries have unique ids and a visible section', () => {
  assert.equal(content.faqEntries.length, 23)
  assert.equal(new Set(content.faqEntries.map(entry => entry.id)).size, 23)
  for (const entry of content.faqEntries) {
    assert.ok(content.faqSections.some(section => section.id === entry.section))
    assert.ok(entry.question && entry.answer)
    assert.ok(!entry.answer.includes('To confirm'))
  }
})

test('homepage questions use the exact public FAQ entries', () => {
  assert.equal(content.homeFaqs.length, 5)
  for (const entry of content.homeFaqs) assert.ok(content.faqEntries.includes(entry))
  assert.ok(content.homeFaqs.some(entry => entry.answer.includes('$1,500')))
})

test('structured data and llms.txt match the visible FAQ and packages', () => {
  const graph = content.faqJsonLd['@graph']
  const schema = graph.find(item => item['@type'] === 'FAQPage')
  assert.equal(schema.url, 'https://www.burgama.com/faq')
  assert.equal(schema.mainEntity.length, content.faqEntries.length)
  const text = content.faqLlmText()
  content.faqEntries.forEach((entry, index) => {
    assert.equal(schema.mainEntity[index].name, entry.question)
    assert.equal(schema.mainEntity[index].acceptedAnswer.text, entry.answer)
    assert.ok(text.includes(entry.question))
    assert.ok(text.includes(entry.answer))
  })
  assert.equal(content.faqServices.length, 5)
  for (const service of content.faqServices) {
    assert.ok(text.includes(service.description))
    assert.ok(text.includes(content.formatServicePrice(service)))
    assert.ok(graph.includes(service))
  }
  assert.equal(content.formatServicePrice(content.faqServices[0]), '$1,500 a month')
  assert.equal(content.formatServicePrice(content.faqServices[2]), '$5,000 / project')
})

test('AI knowledge contains every approved answer and service', () => {
  for (const entry of content.faqEntries) {
    const source = faq.studioFacts.find(fact => fact.id === entry.id)
    assert.ok(source.text.includes(entry.answer))
    assert.ok(faq.faqInstructions.includes(entry.answer))
  }
  for (const service of content.faqServices) {
    assert.ok(faq.studioFacts.some(fact => fact.text.includes(service.description)))
  }
  assert.equal(new Set(faq.studioFacts.map(fact => fact.id)).size, faq.studioFacts.length)
})

test('unknown sources, markup, uncertain and unrelated responses remain guarded', () => {
  const supported = { scope: 'supported', answer: 'A supported answer.', sources: [content.faqEntries[0].id], contact: false }
  assert.equal(faq.groundedAnswer(supported).answer, supported.answer)
  assert.equal(faq.groundedAnswer({ ...supported, sources: ['invented'] }).answer, faq.unknownAnswer)
  assert.equal(faq.groundedAnswer({ ...supported, sources: [] }).answer, faq.unknownAnswer)
  assert.equal(faq.groundedAnswer({ ...supported, scope: 'uncertain' }).answer, faq.unknownAnswer)
  assert.equal(faq.groundedAnswer({ ...supported, answer: '<script>bad</script>' }).answer, faq.unknownAnswer)
  assert.equal(faq.groundedAnswer({ ...supported, scope: 'unrelated' }).answer, faq.offTopicAnswer)
})

test('question validation rejects invalid or oversized payloads', () => {
  assert.equal(faq.parseQuestion({ question: '  What does SEO cost?  ' }), 'What does SEO cost?')
  for (const payload of [null, 'hello', {}, { question: 10 }, { question: 'ab' }, { question: 'x'.repeat(501) }, { question: 'hello\u0000there' }]) {
    assert.equal(faq.parseQuestion(payload), null)
  }
})
