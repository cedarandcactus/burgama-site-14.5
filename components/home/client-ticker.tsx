import styles from './client-ticker.module.css'

const logos = [
  { file: 'harvest', name: 'Harvest', shape: 'wordmark' },
  { file: 'wagner', name: 'Wagner Wealth Management', shape: 'symbol' },
  { file: 'sidecar', name: 'Sidecar Spirits', shape: 'script' },
  { file: 'avro', name: 'AVRO', shape: 'wordmark' },
  { file: 'go2bites', name: 'Go2Bites', shape: 'symbol' },
  { file: 'cellinkey', name: 'Cellinkey', shape: 'wordmark' },
  { file: 'wurqly', name: 'Wurqly', shape: 'script' },
  { file: 'clement', name: 'Clement Senior Solutions', shape: 'wordmark' },
  { file: 'logo-21', name: 'Hush Hush Tan', shape: 'symbol' },
  { file: 'matchday', name: 'MatchDay', shape: 'wordmark' },
  { file: 'hiking-pony', name: 'Hiking Pony Coffee Co.', shape: 'illustration' },
  { file: 'smoothsailing', name: 'Smoothsailing Sustainability', shape: 'wordmark' },
  { file: 'cloon', name: 'Cloon', shape: 'symbol' },
  { file: 'livelihood', name: 'Livelihood', shape: 'wordmark' },
  { file: 'logo-02', name: 'Zeytin', shape: 'script' },
]

export function ClientTicker() {
  return (
    <section className={styles.section} data-scroll-palette="ticker" aria-label="Brands we have worked with">
      <div className={styles.window}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul className={styles.group} key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {logos.map((logo) => (
                <li className={`${styles.logo} ${styles[logo.shape]}`} key={logo.file}>
                  <img src={`/client-logos/${logo.file}.webp`} alt={copy === 0 ? logo.name : ''} width={180} height={80} decoding="async" draggable={false} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
