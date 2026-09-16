'use client'

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from '@/components/transition-link'
import type { Project } from '@/lib/projects'

type Entry = Pick<Project, 'id' | 'slug' | 'title' | 'disciplines' | 'categories'> & { year?: string; media?: Project['heroMedia'][] }

function getCategories(project: Entry) {
  const categories = project.categories?.filter(category => category.trim())
  return [...new Set((categories?.length ? categories : project.disciplines).map(category => {
    const key = category.trim().toLowerCase()
    return key === 'growth' ? 'search' : key
  }).filter(Boolean))]
}

export function WorkIndex({ projects }: { projects: Entry[] }) {
  const resultsId = useId()
  const [category, setCategory] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const libraryRef = useRef<HTMLDivElement>(null)
  const previousHeight = useRef<number | null>(null)
  const entries = projects.map(project => ({ project, categories: getCategories(project) }))
  const categories = [...new Set(entries.flatMap(entry => entry.categories))].sort((a, b) => a.localeCompare(b, 'en'))
  const activeCategory = category && categories.includes(category) ? category : null
  const visible = entries.filter(entry => activeCategory === null || entry.categories.includes(activeCategory))

  useLayoutEffect(() => {
    const results = resultsRef.current
    const library = libraryRef.current
    const fromHeight = previousHeight.current
    previousHeight.current = null
    if (!results || !library || fromHeight === null) return

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(results, { height: fromHeight }, {
        height: library.offsetHeight,
        duration: 0.42,
        ease: 'power2.inOut',
        clearProps: 'height',
      })
      gsap.fromTo(library.children, { opacity: 0, y: 8 }, {
        opacity: 1,
        y: 0,
        duration: 0.32,
        stagger: { amount: 0.12 },
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      })
    })
    return () => media.revert()
  }, [activeCategory, projects])

  function selectCategory(nextCategory: string | null) {
    if (nextCategory === activeCategory) return
    previousHeight.current = resultsRef.current?.getBoundingClientRect().height ?? null
    setCategory(nextCategory)
  }

  return <div className="portfolio-browser">
    <div role="group" aria-label="Filter work by category" className="portfolio-filters">
      <button type="button" aria-pressed={activeCategory === null} aria-controls={resultsId} className="pill pill-small" onClick={() => selectCategory(null)}>all work</button>
      {categories.map(filter => <button key={filter} type="button" aria-pressed={activeCategory === filter} aria-controls={resultsId} className="pill pill-small" onClick={() => selectCategory(filter)}>{filter}</button>)}
    </div>
    <div id={resultsId} ref={resultsRef} className="portfolio-results" aria-live="polite">
      <div ref={libraryRef} className="portfolio-library">
        {visible.map(({ project, categories: projectCategories }) => <Link key={project.id} href={`/work/${project.slug}`} className="portfolio-library-entry">
          <div className="portfolio-library-copy"><h3 className="font-sans">{project.title}</h3>{project.year && <span>{project.year}</span>}</div>
          <div className="archive-categories">{projectCategories.map(projectCategory => <span key={projectCategory}>{projectCategory}</span>)}</div>
        </Link>)}
        {visible.length === 0 && <div className="portfolio-empty">
          <p>No projects to show yet.</p>
          {activeCategory !== null && <button type="button" className="pill pill-small" onClick={() => selectCategory(null)}>Show all work</button>}
        </div>}
      </div>
    </div>
  </div>
}
