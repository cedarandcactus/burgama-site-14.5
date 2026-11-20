import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { projects } from '../lib/projects.ts'

const items = projects.flatMap(project => [project.heroMedia, ...project.contentModules.flatMap(module => {
  if (module.type === 'media' || module.type === 'mediaSplit') return [module.item]
  if (module.type === 'mediaPair' || module.type === 'mediaGrid') return module.items
  return []
})])
const journeyEmails = new Set(projects.flatMap(project => project.contentModules.flatMap(module => module.type === 'journey' ? module.stages.flatMap(stage => (stage.emails ?? []).map(email => email.src)) : [])))
const sources = [...new Set([...items.flatMap(item => item.src ? [item.src] : []), ...journeyEmails])]
for (const src of sources) {
  if (!src.startsWith('/work/') || src.includes('..')) throw new Error(`Expected a local portfolio image: ${src}`)
  const original = fileURLToPath(new URL(`../public${src}`, import.meta.url))
  for (const width of journeyEmails.has(src) ? [640, 960] : [640, 960, 1440, 2400]) {
    const destination = original.replace(/\.[^.]+$/, `-${width}.webp`)
    await sharp(original).resize({ width }).webp({ quality: 82 }).toFile(destination)
  }
  console.log(`Generated responsive sizes for ${src}`)
}
