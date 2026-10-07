'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { curatedFaqs, questionLimit, type FaqAnswer } from '@/lib/faq'
import { ScrollTrigger } from '@/lib/motion'
import styles from './infinite-faq.module.css'

type Entry = { id: string; question: string; answer: string; placeholder?: string; contact?: boolean; pending?: boolean; error?: boolean }

function FaqItem({ entry, busy, onAsk }: { entry: Entry; busy: boolean; onAsk: (question: string) => void }) {
  const [draft, setDraft] = useState(entry.question)
  const hasAnswer = Boolean(entry.pending || entry.answer)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!busy && draft.trim().length >= 3) onAsk(draft.trim())
  }

  return (
    <div className={styles.item}>
      <form onSubmit={submit} className={styles.questionRow}>
        <label htmlFor={`faq-question-${entry.id}`} className="sr-only">Ask anything</label>
        <textarea id={`faq-question-${entry.id}`} name="question" rows={2} required minLength={3} maxLength={questionLimit} value={draft} onChange={event => setDraft(event.target.value)} placeholder={entry.placeholder || 'Ask another question…'} aria-describedby="faq-guidance" aria-controls={hasAnswer ? `faq-answer-${entry.id}` : undefined} onKeyDown={event => {
          if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return
          event.preventDefault()
          event.currentTarget.form?.requestSubmit()
        }} />
        <button type="submit" disabled={busy || draft.trim().length < 3} className={styles.submit} aria-label="Ask question"><ArrowUpRight size={20} aria-hidden="true" /></button>
      </form>
      {hasAnswer && <div id={`faq-answer-${entry.id}`} className={styles.answer} aria-busy={entry.pending}>
        <p role={entry.pending ? 'status' : entry.error ? 'alert' : undefined}>{entry.pending ? 'Thinking…' : entry.answer}</p>
        {entry.error && <button type="button" disabled={busy} className={styles.textLink} onClick={() => onAsk(entry.question)}>Try again</button>}
        {(entry.contact || entry.error) && <Link className={styles.textLink} href="mailto:hello@burgama.com">Contact the studio <ArrowUpRight size={16} aria-hidden="true" /></Link>}
      </div>}
    </div>
  )
}

const standardQuestions = [
  { id: 'services', question: 'What can we work on together?' },
  { id: 'process', question: 'What does your process look like?' },
  { id: 'pricing', question: 'How much does a project cost?' },
  { id: 'timelines', question: 'How long will my project take?' },
  { id: 'start', question: 'What do you need to get started?' },
]

function StandardFaq({ id, question }: { id: string; question: string }) {
  const answer = curatedFaqs.find(entry => entry.id === id)?.answer
  return (
    <details className={styles.item}>
      <summary className={styles.standardQuestion}>{question}<span className={styles.toggle} aria-hidden="true" /></summary>
      <div className={styles.answer}><p>{answer}</p></div>
    </details>
  )
}

export function InfiniteFaq() {
  const [entry, setEntry] = useState<Entry>({ id: 'sixth', question: '', answer: '', placeholder: 'Ask anything…' })
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState('')
  const requestRef = useRef<AbortController | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

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
    setEntry({ ...entry, answer: '', contact: false, pending: true, error: false })
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
      setEntry(current => ({ ...current, ...result, pending: false, error: false }))
      setNotice('Your answer is ready below your question.')
    } catch (cause) {
      if (controller.signal.aborted) return
      const message = cause instanceof Error && cause.name !== 'TimeoutError' ? cause.message : 'That took longer than expected. Please try again.'
      setEntry(current => ({ ...current, pending: false, error: true, answer: message }))
      setNotice('Your question could not be answered. Try again above, or contact the studio.')
    } finally {
      requestRef.current = null
      setPending(false)
    }
  }

  return (
    <section id="faq" ref={sectionRef} className={`${styles.section} font-sans`} data-nav-surface="ink" aria-labelledby="faq-heading">
      <div className={styles.centeredLayout}>
        <header className={styles.centeredIntro}>
          <h2 id="faq-heading">Good questions.<br />Your questions.</h2>
          <p>Type a question. Get an answer.</p>
        </header>
        <div className={styles.stack}>
          {standardQuestions.map(question => <StandardFaq key={question.id} {...question} />)}
          <FaqItem entry={entry} busy={pending} onAsk={question => { void answerQuestion({ ...entry, question }) }} />
          <p id="faq-guidance" className={styles.guidance}>AI answers. No confidential details, please. <Link href="/privacy">Privacy</Link></p>
          <p className="sr-only" role="status" aria-live="polite">{notice}</p>
        </div>
      </div>
    </section>
  )
}
