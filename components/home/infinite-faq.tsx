'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Field, FieldGroup } from '@/components/ui/field'
import { curatedFaqs, questionLimit, type FaqAnswer } from '@/lib/faq'
import { ScrollTrigger } from '@/lib/motion'
import styles from './infinite-faq.module.css'

type Entry = { id: string; question: string; answer: string; contact?: boolean; pending?: boolean; error?: boolean }

function FaqItem({ entry, expanded, onToggle, onRetry }: { entry: Entry; expanded: boolean; onToggle: () => void; onRetry: () => void }) {
  return (
    <div className={styles.item}>
      <h3>
        <button type="button" id={`faq-trigger-${entry.id}`} aria-expanded={expanded} aria-controls={`faq-answer-${entry.id}`} onClick={onToggle} className={styles.trigger}>
          <span>{entry.question}</span><Plus aria-hidden="true" className={styles.plus} />
        </button>
      </h3>
      <div id={`faq-answer-${entry.id}`} aria-labelledby={`faq-trigger-${entry.id}`} hidden={!expanded} className={styles.answer}>
        <p role={entry.pending ? 'status' : entry.error ? 'alert' : undefined}>{entry.pending ? 'Thinking…' : entry.answer}</p>
        {entry.error && <button type="button" className={styles.textLink} onClick={onRetry}>Try again</button>}
        {(entry.contact || entry.error) && <Link className={styles.textLink} href="mailto:hello@burgama.com">Contact the studio <ArrowUpRight size={16} aria-hidden="true" /></Link>}
      </div>
    </div>
  )
}

export function InfiniteFaq() {
  const [entries, setEntries] = useState<Entry[]>(() => [...curatedFaqs])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState('')
  const requestRef = useRef<AbortController | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const fieldRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    observer.observe(section)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      requestRef.current?.abort()
    }
  }, [])

  async function answerQuestion(entry: Entry) {
    if (requestRef.current) return
    const controller = new AbortController()
    requestRef.current = controller
    setPending(true)
    setNotice('Answering your question.')
    setExpanded(entry.id)
    setEntries(current => current.some(item => item.id === entry.id)
      ? current.map(item => item.id === entry.id ? { ...item, pending: true, error: false } : item)
      : [...current, { ...entry, pending: true }])
    try {
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: entry.question }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(28000)]),
      })
      const result: FaqAnswer & { error?: string } = await response.json()
      if (!response.ok) throw new Error(result.error || 'We couldn’t answer that just now. Please try again.')
      if (typeof result.answer !== 'string' || typeof result.contact !== 'boolean') throw new Error('We couldn’t answer that just now. Please try again.')
      setEntries(current => current.map(item => item.id === entry.id ? { ...item, ...result, pending: false, error: false } : item))
      setNotice('Your answer is ready above. You can ask another question.')
    } catch (cause) {
      if (controller.signal.aborted) return
      const message = cause instanceof Error && cause.name !== 'TimeoutError' ? cause.message : 'That took longer than expected. Please try again.'
      setEntries(current => current.map(item => item.id === entry.id ? { ...item, pending: false, error: true, answer: message } : item))
      setNotice('Your question could not be answered. Try again above, or contact the studio.')
    } finally {
      requestRef.current = null
      setPending(false)
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = question.trim()
    if (requestRef.current || value.length < 3) return
    const existing = entries.find(entry => entry.question.toLocaleLowerCase() === value.toLocaleLowerCase())
    if (existing) {
      setExpanded(existing.id)
      document.getElementById(`faq-trigger-${existing.id}`)?.focus({ preventScroll: true })
      document.getElementById(`faq-trigger-${existing.id}`)?.scrollIntoView({ block: 'center', behavior: 'auto' })
    } else {
      void answerQuestion({ id: crypto.randomUUID(), question: value, answer: '' })
    }
    setQuestion('')
    if (!existing) fieldRef.current?.focus({ preventScroll: true })
  }

  return (
    <section id="faq" ref={sectionRef} className={`${styles.section} font-sans`} data-nav-surface="ink" aria-labelledby="faq-heading">
      <div className={styles.layout}>
        <header className={styles.intro}>
          <h2 id="faq-heading">Questions,<br />answered.</h2>
          <p>A few things people usually ask us. If yours isn’t here, ask it.</p>
        </header>
        <div className={styles.stack}>
          {entries.map(entry => <FaqItem key={entry.id} entry={entry} expanded={expanded === entry.id} onToggle={() => setExpanded(current => current === entry.id ? null : entry.id)} onRetry={() => { if (!pending) void answerQuestion(entry) }} />)}
          <form onSubmit={submit} className={styles.form}>
            <FieldGroup>
              <Field>
                <label htmlFor="faq-question" className={styles.label}>Your question</label>
                <div className={styles.inputRow}>
                  <textarea ref={fieldRef} id="faq-question" name="question" rows={2} required minLength={3} maxLength={questionLimit} value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask Burgama anything about working with us…" aria-describedby="faq-guidance" onKeyDown={event => {
                    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return
                    event.preventDefault()
                    event.currentTarget.form?.requestSubmit()
                  }} />
                  <button type="submit" disabled={pending || question.trim().length < 3} className={styles.submit} aria-label="Submit question">Ask <ArrowUpRight size={20} aria-hidden="true" /></button>
                </div>
                <p id="faq-guidance" className={styles.guidance}>Please leave out personal or confidential details. <Link href="/privacy">Privacy</Link></p>
              </Field>
            </FieldGroup>
          </form>
          <p className="sr-only" role="status" aria-live="polite">{notice}</p>
        </div>
      </div>
    </section>
  )
}
