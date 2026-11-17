import assert from 'node:assert/strict'
import sharp from 'sharp'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { projects, validateProjectCard } from '../lib/projects.ts'

const dimensions = JSON.parse(await readFile('lib/card-image-metadata.json', 'utf8'))
for (const project of projects) {
  validateProjectCard(project)
  const image = await sharp(resolve(`public${project.cardImage}`)).metadata()
  assert.ok(image.width > 0 && image.height > 0, `${project.slug}: card image must have valid intrinsic dimensions`)
  assert.deepEqual(dimensions[project.cardImage], { width: image.width, height: image.height }, `${project.slug}: card dimensions must match the asset`)
  assert.notEqual(project.cardImage, project.heroMedia.src, `${project.slug}: card image must be separate from the hero`)
  for (const width of [640, 960, 1440, 2400]) {
    const candidate = await sharp(resolve(`public${project.cardImage.replace(/\.[^.]+$/, '')}-${width}.webp`)).metadata()
    assert.equal(candidate.width, width, `${project.slug}: missing responsive candidate`)
  }
}
console.log(`Validated ${projects.length} dedicated portfolio cards.`)
