'use client'

import Link from 'next/link'
import type { FormEvent } from 'react'
import { BrandMark } from '@/components/brand-mark'
import type { Project } from '@/lib/projects'

const capabilities = ['Brand systems', 'Digital experiences', 'Content and production', 'Growth systems']

export function HomepageRailLayout({ projects }: { projects: Project[] }) {
  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    const subject = encodeURIComponent(`Project inquiry from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:hello@burgama.com?subject=${subject}&body=${body}`
  }

  return (
    <section className="home-rail-shell" aria-label="Burgama studio overview">
      <div className="home-rail-layout">
        <div className="home-rail-utility">
          <Link href="/" aria-label="Burgama home" className="home-rail-action home-rail-logo">
            <BrandMark className="h-auto w-full" />
          </Link>

          <nav aria-label="Homepage sections" className="home-rail-links">
            <Link href="/studio">Studio</Link>
            <a href="#home-studio">Capabilities</a>
          </nav>

          <Link href="/work" className="home-rail-action home-rail-work-button">Work</Link>
        </div>

        <div className="home-rail-panel home-rail-work" aria-label="Selected work">
          <div className="home-rail-panel-heading">
            <h2>Selected work</h2>
            <Link href="/work" className="inline-action">View all</Link>
          </div>
          <div className="home-rail-projects">
            {projects.slice(0, 3).map((project) => (
              <Link key={project.slug} href={`/work/${project.slug}`} className="home-rail-project">
                {project.heroMedia.src ? (
                  <img src={project.heroMedia.src} alt="" className="home-rail-project-image" />
                ) : null}
                <span>{project.title}</span>
                <span>{project.disciplines.slice(0, 2).join(' · ')}</span>
              </Link>
            ))}
          </div>
        </div>

        <article id="home-studio" className="home-rail-panel home-rail-studio">
          <div>
            <p>Burgama is an independent creative studio in Austin, Texas.</p>
            <p>We build brands, digital experiences, content and growth systems as one connected practice.</p>
          </div>
          <ul>
            {capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
          <div>
            <p>Close collaboration from the first point of view through launch and what follows.</p>
            <Link href="/studio" className="inline-action">About the studio</Link>
          </div>
        </article>

        <aside className="home-rail-actions">
          <a href="#home-contact" className="home-rail-action home-rail-menu">Menu</a>

          <form id="home-contact" className="home-rail-contact" onSubmit={submitContact}>
            <h2>Start a project</h2>
            <label>
              <span>Name</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="home-rail-message">
              <span>Project</span>
              <textarea name="message" required rows={4} />
            </label>
            <button type="submit">Compose email</button>
          </form>
        </aside>
      </div>
    </section>
  )
}
