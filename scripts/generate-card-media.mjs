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
  'hiking-pony': '/work/hiking-pony/photo-trio-latte.jpg',
  'harvest-dating': '/work/harvest-dating/pdf-6-4.jpg',
  avro: '/work/avro/topdown-drinks.jpg',
  'patent-earth': '/work/patent-earth/ad-numbers.jpg',
  'patent-earth-email': '/work/patent-earth-email/hero-dad.jpg',
  'matchday-email': '/work/matchday-email/hero-find-your-game.jpg',
  ollivate: '/work/ollivate/ad-vertical-ce-app.jpg',
  cloon: '/client-logos/cloon.png',
  'matchday-local-seo': '/client-logos/matchday.png',
  'matchday-meta-ads': '/work/matchday-meta-ads/app-promo.jpg',
  'hush-hush-tan-seasonal': '/work/hush-hush-tan-seasonal/email-header.jpg',
  'matchday-social': '/work/matchday-social/okc-launch.jpg',
  'avro-website': '/work/avro-website/shop-all.jpg',
  'hiking-pony-packaging': '/work/hiking-pony/sweet-cream-packaging.jpg',
  'hiking-pony-photography': '/work/hiking-pony/photo-mocha-styled.jpg',
  'hiking-pony-website': '/work/hiking-pony/web-hiking-pony.jpg',
  wurqly: '/work/wurqly/card-source.webp',
  'sidecar-spirits': '/work/sidecar-spirits/card-source.jpg',
  'wagner-founder-film': '/work/founder-films/wagner-wealth.jpg',
  'hiking-pony-founder-film': '/work/founder-films/hiking-pony.jpg',
  'cold-cycle-founder-video': '/work/founder-films/cold-cycle.jpg',
  'go2bites-packaging': '/work/go2bites/family-cinnamon-front.jpg',
  'go2bites-photography': '/work/go2bites/ingredient-pumpkin-spice.jpg',
  'go2bites-film-website': '/work/go2bites/film-go2bites.jpg',
}
// Designed cards (made by hand outside this script). Kept as is.
const designed = new Set(['harvest-dating', 'hush-hush-tan-social', 'matchday', 'matchday-meta-ads', 'matchday-social', 'matchday-local-seo'])
const existing = JSON.parse(await readFile('lib/card-image-metadata.json', 'utf8'))
const dimensions = {}
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// Every work card shares one frame so card rows line up. Photos close to the
// frame are cropped to fill; logos, phone screens and other off-ratio sources
// sit whole on a soft blurred (or solid, for transparent logos) background.
const CARD_W = 1600
const CARD_H = 1100
const LOGO_BG = { r: 233, g: 239, b: 248, alpha: 1 }

async function framedCard(sourceBuffer) {
  const meta = await sharp(sourceBuffer).metadata()
  const ratio = meta.width / meta.height
  if (ratio >= 1.25 && ratio <= 1.6) return sharp(sourceBuffer).resize(CARD_W, CARD_H, { fit: 'cover', position: 'centre' }).webp({ quality: 88 }).toBuffer()
  const isLogo = Boolean(meta.hasAlpha)
  const pad = isLogo ? 0.62 : 0.88
  const fg = await sharp(sourceBuffer).resize({ width: Math.round(CARD_W * pad), height: Math.round(CARD_H * pad), fit: 'inside', withoutEnlargement: false }).png().toBuffer()
  const bg = isLogo
    ? sharp({ create: { width: CARD_W, height: CARD_H, channels: 4, background: LOGO_BG } })
    : sharp(sourceBuffer).resize(CARD_W, CARD_H, { fit: 'cover' }).blur(60).modulate({ brightness: 0.9 })
  return bg.composite([{ input: fg, gravity: 'centre' }]).flatten({ background: LOGO_BG }).webp({ quality: 88 }).toBuffer()
}

async function textCard(title, framed) {
  const text = await sharp({ text: { text: `<span foreground="#95bce5">${escape(title)}</span>`, font: 'Cenura 64', fontfile, width: framed ? 1100 : 560, height: framed ? 700 : 400, align: 'centre', rgba: true } }).png().toBuffer()
  if (!framed) return sharp(text).webp({ quality: 88 }).toBuffer()
  return sharp({ create: { width: CARD_W, height: CARD_H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite([{ input: text, gravity: 'centre' }]).webp({ quality: 88 }).toBuffer()
}

async function makeCard(destination, title, source, framed = false) {
  const image = source
    ? framed
      ? await framedCard(await readFile(resolve(`public${source}`)))
      : await sharp(await readFile(resolve(`public${source}`))).resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer()
    : await textCard(title, framed)
  const metadata = await sharp(image).metadata()
  dimensions[destination] = { width: metadata.width, height: metadata.height }
  await writeFile(resolve(`public${destination}`), image)
  for (const width of [640, 960, 1440, 2400]) await sharp(image).resize(width).webp({ quality: 82 }).toFile(resolve(`public${destination.replace(/\.[^.]+$/, '')}-${width}.webp`))
}

await mkdir('public/work/cards', { recursive: true })
await mkdir('public/research/cards', { recursive: true })
for (const project of projects) {
  if (designed.has(project.slug)) { dimensions[project.cardImage] = existing[project.cardImage]; continue }
  await makeCard(project.cardImage, project.client, sources[project.slug] ?? project.heroMedia.src, true)
  console.log(`Framed card: ${project.slug}`)
}
for (const idea of ideas) {
  await makeCard(`/research/cards/${idea.slug}.webp`, idea.title, idea.slug === 'wix-vs-vercel' ? '/images/research-built-or-build.png' : undefined)
}
await writeFile('lib/card-image-metadata.json', JSON.stringify(dimensions, null, 2) + '\n')
