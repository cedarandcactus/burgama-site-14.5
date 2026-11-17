import styles from './portfolio-motion.module.css'

type Props = { text: string; as?: 'h1' | 'h2' | 'h3' | 'span'; className?: string; id?: string }
export function RevealHeading({ text, as: Tag = 'h2', className, id }: Props) {
  return <Tag className={className} id={id} aria-label={text} data-motion-heading="">
    {text.split(/\s+/).map((word, index) => <span key={`${word}-${index}`} aria-hidden="true"><span className={styles.wordMask}><span data-motion-word="">{word}</span></span>{' '}</span>)}
  </Tag>
}
