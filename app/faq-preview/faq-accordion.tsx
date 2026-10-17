'use client'

import { useId, useState, type ReactNode } from 'react'
import styles from './faq-preview.module.css'

type FaqAccordionProps = {
  question: string
  children: ReactNode
}

export function FaqAccordion({ question, children }: FaqAccordionProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const triggerId = `faq-trigger-${id}`
  const answerId = `faq-answer-${id}`

  return (
    <article className={styles.faqItem} data-open={open}>
      <button
        type="button"
        id={triggerId}
        className={styles.faqButton}
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((current) => !current)}
      >
        <h3>{question}</h3>
        <span className={styles.faqToggle} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
      <div
        id={answerId}
        className={styles.answerGrid}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
      >
        <div className={styles.answerClip}>
          <div className={styles.answer}>{children}</div>
        </div>
      </div>
    </article>
  )
}
