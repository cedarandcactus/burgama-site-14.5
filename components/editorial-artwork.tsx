import type { IdeaPost, IdeaVisual } from '@/lib/editorial'
import styles from './editorial.module.css'

type DotFieldProps = {
  className: string
  columns: number
  rows: number
  cell: number
  originX: number
  originY: number
  radius: number
  phase: number
}

function DotField({
  className,
  columns,
  rows,
  cell,
  originX,
  originY,
  radius,
  phase,
}: DotFieldProps) {
  return (
    <g className={className}>
      {Array.from({ length: columns * rows }, (_, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const x = column * cell + cell / 2
        const y = row * cell + cell / 2
        const distance = Math.hypot(x - originX, y - originY)
        const wave = (Math.sin(distance * 0.095 + phase) + 1) / 2
        const interference = (Math.cos((x + y) * 0.032 - phase) + 1) / 2
        const isVisible = distance < radius && (wave > 0.34 || interference > 0.76)

        if (!isVisible) return null

        const size = Math.min(cell * 0.72, 3 + wave * cell * 0.58)
        const opacity = 0.28 + interference * 0.72

        return (
          <rect
            key={`${column}-${row}`}
            x={x - size / 2}
            y={y - size / 2}
            width={size}
            height={size}
            opacity={opacity}
          />
        )
      })}
    </g>
  )
}

function ArtworkComposition({ visual }: { visual: IdeaVisual }) {
  if (visual === 'platforms') {
    return (
      <>
        <rect className={styles.artPanel} x="0" y="0" width="352" height="940" />
        <rect className={styles.artAccentPanel} x="604" y="0" width="196" height="940" />
        <DotField className={styles.artDotsReverse} columns={17} rows={20} cell={48} originX={372} originY={468} radius={445} phase={0.5} />
        <DotField className={styles.artDots} columns={17} rows={20} cell={48} originX={585} originY={450} radius={350} phase={2.7} />
        <rect className={styles.artOutline} x="254" y="220" width="294" height="500" />
        <line className={styles.artLine} x1="254" y1="366" x2="548" y2="366" />
      </>
    )
  }

  if (visual === 'email') {
    return (
      <>
        <rect className={styles.artAccentPanel} x="0" y="574" width="800" height="366" />
        <DotField className={styles.artDotsReverse} columns={17} rows={20} cell={48} originX={410} originY={508} radius={430} phase={1.8} />
        <rect className={styles.artPanel} x="172" y="214" width="456" height="492" />
        <rect className={styles.artOutlineReverse} x="214" y="258" width="372" height="284" />
        <rect className={styles.artReverse} x="214" y="574" width="236" height="52" />
        <rect className={styles.artReverse} x="468" y="574" width="118" height="52" />
        <line className={styles.artLineReverse} x1="214" y1="332" x2="586" y2="332" />
      </>
    )
  }

  if (visual === 'audit') {
    return (
      <>
        <rect className={styles.artPanel} x="0" y="382" width="800" height="210" />
        <DotField className={styles.artDots} columns={17} rows={20} cell={48} originX={408} originY={266} radius={390} phase={4.1} />
        <DotField className={styles.artDotsReverse} columns={17} rows={20} cell={48} originX={408} originY={660} radius={310} phase={0.8} />
        <rect className={styles.artOutlineReverse} x="108" y="420" width="584" height="134" />
        <line className={styles.artLineReverse} x1="304" y1="420" x2="304" y2="554" />
        <line className={styles.artLineReverse} x1="500" y1="420" x2="500" y2="554" />
        <rect className={styles.artReverse} x="124" y="442" width="154" height="18" />
        <rect className={styles.artReverse} x="320" y="442" width="154" height="18" />
        <rect className={styles.artReverse} x="516" y="442" width="160" height="18" />
      </>
    )
  }

  if (visual === 'reviews') {
    return (
      <>
        <rect className={styles.artPanel} x="0" y="0" width="400" height="940" />
        <rect className={styles.artAccentPanel} x="400" y="0" width="400" height="940" />
        <DotField className={styles.artDotsReverse} columns={17} rows={20} cell={48} originX={290} originY={480} radius={405} phase={2.2} />
        <DotField className={styles.artDots} columns={17} rows={20} cell={48} originX={514} originY={480} radius={405} phase={5.4} />
        <rect className={styles.artOutlineReverse} x="96" y="252" width="258" height="432" />
        <rect className={styles.artOutline} x="446" y="252" width="258" height="432" />
        <line className={styles.artLineReverse} x1="96" y1="570" x2="354" y2="570" />
        <line className={styles.artLine} x1="446" y1="570" x2="704" y2="570" />
      </>
    )
  }

  if (visual === 'sitemap') {
    const nodes = [
      [114, 198], [264, 198], [414, 198], [564, 198], [714, 198],
      [114, 408], [264, 408], [414, 408], [564, 408], [714, 408],
      [114, 618], [264, 618], [414, 618], [564, 618], [714, 618],
    ]

    return (
      <>
        <DotField className={styles.artDotsReverse} columns={17} rows={20} cell={48} originX={404} originY={476} radius={438} phase={3.3} />
        <g className={styles.artGrid}>
          <line x1="114" y1="198" x2="714" y2="198" />
          <line x1="114" y1="408" x2="714" y2="408" />
          <line x1="114" y1="618" x2="714" y2="618" />
          <line x1="114" y1="198" x2="114" y2="618" />
          <line x1="264" y1="198" x2="264" y2="618" />
          <line x1="414" y1="198" x2="414" y2="618" />
          <line x1="564" y1="198" x2="564" y2="618" />
          <line x1="714" y1="198" x2="714" y2="618" />
        </g>
        <g className={styles.artNodes}>
          {nodes.map(([x, y], index) => (
            <rect key={`${x}-${y}`} x={x - (index % 3 === 0 ? 18 : 9)} y={y - (index % 3 === 0 ? 18 : 9)} width={index % 3 === 0 ? 36 : 18} height={index % 3 === 0 ? 36 : 18} />
          ))}
        </g>
        <rect className={styles.artPanel} x="222" y="720" width="384" height="86" />
      </>
    )
  }

  return (
    <>
      <polygon className={styles.artPanel} points="0,0 496,0 276,940 0,940" />
      <polygon className={styles.artAccentPanel} points="496,0 800,0 800,940 276,940" />
      <DotField className={styles.artDotsReverse} columns={17} rows={20} cell={48} originX={390} originY={456} radius={420} phase={1.15} />
      <rect className={styles.artOutlineReverse} x="246" y="174" width="308" height="570" />
      <rect className={styles.artOutlineReverse} x="270" y="206" width="260" height="474" />
      <rect className={styles.artReverse} x="338" y="704" width="124" height="15" />
      <line className={styles.artLineReverse} x1="270" y1="284" x2="530" y2="284" />
      <polyline className={styles.artLineReverse} points="296,590 350,516 408,548 492,424" />
    </>
  )
}

export function EditorialArtwork({ idea }: { idea: IdeaPost }) {
  return (
    <div
      className={styles.artwork}
      data-theme={idea.theme}
      data-visual={idea.visual}
      aria-hidden="true"
    >
      <svg viewBox="0 0 800 940" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect className={styles.artBase} width="800" height="940" />
        <ArtworkComposition visual={idea.visual} />
      </svg>
      <div className={styles.artworkRail} aria-hidden="true">
        <span>IDEAS / {idea.issue}</span>
        <span>BURGAMA</span>
      </div>
      <p className={styles.artworkCode} aria-hidden="true">{idea.artwork.code}</p>
      <p className={styles.artworkNotation} aria-hidden="true">{idea.artwork.notation}</p>
    </div>
  )
}
