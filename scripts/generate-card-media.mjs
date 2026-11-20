import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { projects } from '../lib/projects.ts'
import { ideas } from '../lib/editorial.ts'

const fontfile = resolve('public/fonts/cenura.otf')
const sources = {
  'wagner-wealth': '/work/wagner-wealth/a094.jpg',
  go2bites: '/work/go2bites/a153.jpg',
  cellinkey: '/work/cellinkey/a073.jpg',
  'hiking-pony': '/work/hiking-pony/sweet-cream-packaging.jpg',
  'harvest-dating': '/work/harvest-dating/pdf-6-4.jpg',
  avro: '/client-logos/avro.png',
  cloon: '/client-logos/cloon.png',
  'matchday-local-seo': '/client-logos/matchday.png',
  'matchday-meta-ads': '/work/matchday-meta-ads/app-promo.jpg',
  'hush-hush-tan-seasonal': '/work/hush-hush-tan-seasonal/email-header.jpg',
  'matchday-social': '/work/matchday-social/okc-launch.jpg',
  'avro-website': '/work/avro-website/shop-all.jpg',
  'wagner-founder-film': '/work/founder-films/wagner-wealth.jpg',
  'hiking-pony-founder-film': '/work/founder-films/hiking-pony.jpg',
  'cold-cycle-founder-video': '/work/founder-films/cold-cycle.jpg',
  'go2bites-packaging': '/work/go2bites/family-cinnamon-front.jpg',
  'go2bites-photography': '/work/go2bites/ingredient-pumpkin-spice.jpg',
  'go2bites-film-website': '/work/go2bites/film-go2bites.jpg',
}
// Designed cards (made by hand outside this script). Kept as is.
const designed = new Set(['wurqly', 'matchday', 'matchday-meta-ads', 'matchday-social', 'matchday-local-seo'])
const existing = JSON.parse(await readFile('lib/card-image-metadata.json', 'utf8'))
const dimensions = {}
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

async function makeCard(destination, title, source) {
  const image = source
    ? await sharp(await readFile(resolve(`public${source}`))).resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer()
    : await sharp({ text: { text: `<span foreground="#95bce5">${escape(title)}</span>`, font: 'Cenura 64', fontfile, width: 560, height: 400, align: 'centre', rgba: true } }).webp({ quality: 88 }).toBuffer()
  const metadata = await sharp(image).metadata()
  dimensions[destination] = { width: metadata.width, height: metadata.height }
  await writeFile(resolve(`public${destination}`), image)
  for (const width of [640, 960, 1440, 2400]) await sharp(image).resize(width).webp({ quality: 82 }).toFile(resolve(`public${destination.replace(/\.[^.]+$/, '')}-${width}.webp`))
}

await mkdir('public/work/cards', { recursive: true })
await mkdir('public/research/cards', { recursive: true })
for (const project of projects) {
  if (designed.has(project.slug)) { dimensions[project.cardImage] = existing[project.cardImage]; continue }
  await makeCard(project.cardImage, project.client, sources[project.slug] ?? project.heroMedia.src)
  console.log(`Retained natural proportions: ${project.slug}`)
}
for (const idea of ideas) {
  await makeCard(`/research/cards/${idea.slug}.webp`, idea.title, idea.slug === 'wix-vs-vercel' ? '/images/research-built-or-build.png' : undefined)
}
await writeFile('lib/card-image-metadata.json', JSON.stringify(dimensions, null, 2) + '\n')
