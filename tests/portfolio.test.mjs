import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import test from 'node:test'
import vm from 'node:vm'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const ts = require('typescript')
function load(path) {
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } })
  const exports = {}
  vm.runInNewContext(outputText, { exports, require: name => name.startsWith('@/components/') ? {} : require(name) }, { filename: path })
  return exports
}
const data = load(resolve('lib/projects.ts'))
const media = load(resolve('components/media-module.tsx'))
const projects = data.getPortfolioOrder()
const expectedOrder = ['wurqly','hiking-pony','go2bites','cellinkey','wagner-wealth','matchday-social','matchday-local-seo','hush-hush-tan-social','clement-local-search','reclaim-local-search','sidecar-spirits','harvest-dating','matchday','hush-hush-tan','clement-senior-solutions','smoothsailing','10-pillar-productions','alh-senior-solutions','dr-saba-syed','turant','avro','patent-earth','ollivate','cloon']
const plain = value => JSON.parse(JSON.stringify(value))

test('all 24 projects form the exact index-order loop', () => {
  assert.deepEqual(plain(projects.map(project => project.slug)), expectedOrder)
  projects.forEach((project, index) => {
    const navigation = data.getProjectNavigation(project)
    assert.equal(navigation.next.slug, expectedOrder[(index + 1) % expectedOrder.length])
    assert.equal(navigation.backHref, project.collection === 'case-study' ? '/work' : `/work#${project.collection}`)
    assert.equal(navigation.previous, undefined)
  })
})

test('related cards follow index order without repeating the current client or another selected client', () => {
  projects.forEach((project, index) => {
    const picks = data.getRelatedProjects(project)
    assert.equal(picks.length, 3)
    assert.equal(new Set(picks.map(item => item.client)).size, 3)
    assert.ok(picks.every(item => item.client !== project.client))
    const offsets = picks.map(item => (projects.indexOf(item) - index + projects.length) % projects.length)
    assert.deepEqual(plain(offsets), plain([...offsets].sort((a,b)=>a-b)))
  })
})

test('recommendations react to index reordering and handle small collections', () => {
  const reordered = [...projects].reverse()
  assert.deepEqual(plain(data.getMoreWork(reordered[0].slug, 3, reordered).map(item => item.slug)), reordered.slice(1, 4).map(item => item.slug))
  assert.equal(data.getMoreWork(projects[0].slug, 3, projects.slice(0, 3)).length, 2)
  assert.equal(data.getMoreWork('missing').length, 0)
})

test('missing card fields fail immediately and dedicated cards preserve their declared intrinsic dimensions', async () => {
  const dimensions = JSON.parse(readFileSync('lib/card-image-metadata.json', 'utf8'))
  for (const project of projects) {
    assert.throws(() => data.validateProjectCard({ ...project, cardImage: undefined }), /requires cardImage and cardAlt/)
    assert.throws(() => data.validateProjectCard({ ...project, cardAlt: '' }), /requires cardImage and cardAlt/)
    const metadata = await sharp(resolve(`public${project.cardImage}`)).metadata()
    assert.deepEqual({ width: metadata.width, height: metadata.height }, dimensions[project.cardImage])
    assert.notEqual(project.cardImage, project.heroMedia.src)
  }
})

test('portrait and landscape card exports retain source proportions without portrait mats', async () => {
  const examples = [
    ['matchday-social', 'public/work/matchday/a112.jpg'],
    ['go2bites', 'public/work/go2bites/a153.jpg'],
    ['wagner-wealth', 'public/work/wagner-wealth/a094.jpg'],
  ]
  for (const [slug, source] of examples) {
    const original = await sharp(source).metadata()
    const card = await sharp(resolve(`public${data.getProject(slug).cardImage}`)).metadata()
    assert.ok(Math.abs(original.width / original.height - card.width / card.height) < .003, slug)
  }
})

test('presentation does not reintroduce cursors, image zooms or moving slope masks', () => {
  const image = readFileSync('components/parallax-image.tsx', 'utf8')
  const section = readFileSync('components/card-section.tsx', 'utf8')
  const layout = readFileSync('app/layout.tsx', 'utf8')
  const css = readFileSync('app/work/[slug]/case-study.css', 'utf8')
  assert.doesNotMatch(image + section + layout, /ViewCursor|data-cursor|data-motion-band/)
  assert.doesNotMatch(image, /scale:/)
  assert.match(css, /aspect-ratio: var\(--media-aspect\)/)
  assert.match(css, /object-fit: contain/)
})

test('public copy is clean while unpublished status stays out of the template', () => {
  for (const project of projects) {
    const { status, ...visible } = project
    assert.doesNotMatch(JSON.stringify(visible), /\b(supplied|draft|pending|evidence|unverified)\b|\.docx|pp\.|should not|not published|[—–!]/i, project.slug)
    assert.equal(project.closingLine, undefined)
  }
  const page = readFileSync('app/work/[slug]/page.tsx', 'utf8')
  const hero = readFileSync('components/case-study-hero.tsx', 'utf8')
  assert.doesNotMatch(page + hero, /project\.status/)
  assert.match(page, /\$\{project.title\} \| \$\{primaryWork\} \| Burgama/)
})

test('image counts determine layouts and screenshots are isolated after the group', () => {
  const item = number => ({ src: `/work/example/image-${number}.jpg`, label: 'Product portrait', ratio: 'wide' })
  const cases = { 1: ['single'], 2: ['pair'], 3: ['trio'], 4: ['pair','pair'], 5: ['pair','trio'], 6: ['pair','trio','single'], 7: ['pair','trio','pair'], 8: ['pair','trio','trio'] }
  for (const [count, expected] of Object.entries(cases)) assert.deepEqual(plain(media.mediaGroups(Array.from({ length: Number(count) }, (_, index) => item(index))).map(group => group.layout)), expected)
  assert.deepEqual(plain(media.mediaGroups([item(1), { ...item(2), label: 'Website homepage' }, item(3)]).map(group => group.layout)), ['pair','site'])
  assert.equal(media.mediaGroups([{ label: '', ratio: 'full' }]).length, 0)
})

test('grouping preserves every image in its original narrative section', () => {
  for (const project of projects) {
    const grouped = media.groupSections(project.contentModules)
    const originalCount = project.contentModules.reduce((sum, module) => sum + (module.type === 'media' || module.type === 'mediaSplit' ? 1 : module.items?.length ?? 0), 0)
    assert.equal(grouped.reduce((sum, section) => sum + section.items.length, 0), originalCount, project.slug)
    assert.equal(grouped.length, project.contentModules.filter(module => ['text','quote','process','mediaSplit'].includes(module.type)).length, project.slug)
  }
})

test('published report numbers and sources stay together and unchanged', () => {
  const expected = {
    'matchday-social': ['576,649','6,555','79,576','2,976'],
    'hush-hush-tan-social': ['172,503','1,426','81'],
    'clement-local-search': ['7','3','2'],
    'reclaim-local-search': ['6.9x','4.7x','3.6x','2.9x'],
  }
  for (const [slug, values] of Object.entries(expected)) {
    const project = data.getProject(slug)
    const report = project.contentModules.find(module => module.stats)
    assert.deepEqual(plain(report.stats.map(stat => stat.value)), values)
    assert.ok(report.source)
    assert.equal(project.source, undefined)
  }
  assert.equal(data.getProject('clement-local-search').links.length, 0)
  assert.equal(data.getProject('reclaim-local-search').links[0].href, '/ai-visibility-check')
})

test('all 41 source images have real WebP candidates at the four required widths', async () => {
  const sources = new Set(projects.flatMap(project => [project.heroMedia, ...media.groupSections(project.contentModules).flatMap(section => section.items)]).flatMap(item => item.src ? [item.src] : []))
  assert.equal(sources.size, 41)
  for (const src of sources) for (const width of [640,960,1440,2400]) {
    const path = resolve(`public${src.replace(/\.[^.]+$/, '')}-${width}.webp`)
    const metadata = await sharp(path).metadata()
    assert.equal(metadata.width, width, path)
    assert.equal(metadata.format, 'webp', path)
  }
})
