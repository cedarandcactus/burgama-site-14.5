import styles from './footer-stamp.module.css'

export function FooterStamp() {
  return (
    <svg className={`${styles.stamp} font-sans`} viewBox="0 0 240 240" role="img" aria-label="Burgama. Independent design studio. Austin, Texas. Working everywhere.">
      <defs>
        <path id="burgama-stamp-top" d="M 20,120 A 100,100 0 0,1 220,120" />
        <path id="burgama-stamp-bottom" d="M 10,120 A 110,110 0 0,0 230,120" />
      </defs>
      <circle cx="120" cy="120" r="118" fill="none" stroke="currentColor" strokeWidth="1" />
      <g fill="currentColor" textAnchor="middle" fontSize="16" fontWeight="300">
        <text letterSpacing="1.1"><textPath href="#burgama-stamp-top" startOffset="50%">INDEPENDENT DESIGN STUDIO</textPath></text>
        <text letterSpacing="1"><textPath href="#burgama-stamp-bottom" startOffset="50%">AUSTIN, TEXAS · EVERYWHERE</textPath></text>
      </g>
      <image href="/burgama-symbol.svg" x="99" y="62" width="42" height="42" />
      <path d="M 31,114 H 209 M 31,153 H 209" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="120" y="144" textAnchor="middle" fill="currentColor" fontSize="39" className="font-serif">burgama</text>
      <text x="120" y="175" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="300">ideas into identities.</text>
    </svg>
  )
}
