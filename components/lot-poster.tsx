type Row = {
  /** Width as a fraction of the poster width. */
  w: number
  /** Height as a fraction of the poster width. */
  h: number
  /** Font size as a fraction of the poster width. */
  fs?: number
  text?: string
  wordmark?: boolean
  qr?: boolean
  tracking?: number
}

const ROWS: Row[] = [
  { w: 0.2, h: 0.132, fs: 0.077, text: '2' },
  { w: 0.66, h: 0.127, fs: 0.068, text: 'E\u20030019-3\u20038' },
  { w: 0.88, h: 0.136, fs: 0.077, text: '4\u2003LIFE-STREAM\u20036' },
  { w: 0.46, h: 0.127, fs: 0.073, text: '(DJ SET)' },
  { w: 0.86, h: 0.15, fs: 0.135, wordmark: true, text: 'LOT', tracking: 0.145 },
  { w: 0.42, h: 0.127, fs: 0.077, text: 'BERLIN' },
  { w: 1, h: 0.132, fs: 0.075, text: 'TWITCH.COM/LOT_2046' },
  { w: 0.72, h: 0.127, fs: 0.075, text: '1900 HR, JULY 26' },
  { w: 0.6, h: 0.132, fs: 0.077, text: 'THIS FRIDAY' },
  { w: 0.15, h: 0.13 },
  { w: 0.36, h: 0.109, fs: 0.059, text: '10:00 LA' },
  { w: 0.38, h: 0.109, fs: 0.059, text: '13:00 NYC' },
  { w: 0.36, h: 0.109, fs: 0.059, text: '18:00 UK' },
  { w: 0.52, h: 0.109, fs: 0.059, text: '20:00 MOSCOW' },
  { w: 0.2, h: 0.1, fs: 0.055, text: '0' },
  { w: 0.3, h: 0.245, qr: true },
]

function rowStyle(row: Row): React.CSSProperties {
  return {
    width: `calc(var(--poster-w) * ${row.w})`,
    height: `calc(var(--poster-w) * ${row.h})`,
  }
}

export function LotPoster({ qrSvg }: { qrSvg: string }) {
  return (
    <div className="lot-poster">
      <svg aria-hidden="true" className="lot-poster-defs" focusable="false">
        <defs>
          <filter id="lot-goo" x="-14%" y="-6%" width="128%" height="112%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="soft" />
            <feColorMatrix
              in="soft"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            />
          </filter>
        </defs>
      </svg>

      <figure className="lot-poster-figure">
        <div className="lot-poster-body">
          {/* Fused silhouette: shapes only, so the goo filter never touches the type. */}
          <div aria-hidden="true" className="lot-poster-shapes">
            {ROWS.map((row, index) => (
              <div key={index} className="lot-poster-shape" style={rowStyle(row)} />
            ))}
          </div>

          {/* Crisp type layer mirrors the shape stack exactly. */}
          <div className="lot-poster-type">
            {ROWS.map((row, index) => (
              <div key={index} className="lot-poster-line" style={rowStyle(row)}>
                {row.qr ? (
                  <span
                    className="lot-poster-qr"
                    role="img"
                    aria-label="QR code linking to twitch.com/lot_2046"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                ) : row.text ? (
                  <span
                    className={row.wordmark ? 'lot-poster-wordmark' : undefined}
                    style={{
                      fontSize: `calc(var(--poster-w) * ${row.fs})`,
                      letterSpacing: row.tracking
                        ? `calc(var(--poster-w) * ${row.tracking})`
                        : undefined,
                      // Letter-spacing trails the last glyph; pull it back so the group stays centred.
                      marginRight: row.tracking
                        ? `calc(var(--poster-w) * -${row.tracking})`
                        : undefined,
                    }}
                  >
                    {row.text}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div aria-hidden="true" className="lot-poster-ear lot-poster-ear-left" />
          <div aria-hidden="true" className="lot-poster-ear lot-poster-ear-right" />
        </div>

        <figcaption className="sr-only">
          LOT_2046 life-stream DJ set, broadcast from Berlin on twitch.com/lot_2046 at 1900 hours on
          Friday July 26. Local start times: 10:00 Los Angeles, 13:00 New York, 18:00 United Kingdom,
          20:00 Moscow.
        </figcaption>
      </figure>
    </div>
  )
}
