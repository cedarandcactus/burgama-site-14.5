import type { ReactNode } from 'react'

/**
 * ModularField — the one primitive every notched surface is built from.
 *
 * A field is a large plane whose edge can step up (a tab that reaches past
 * the boundary) or step down (a recess carved into it). Both are the same
 * geometry family, driven by the shared `--notch-*` tokens, so a hero, a
 * section and a footer all cut the same way at different scales.
 *
 * The shape is a union of same-coloured blocks plus mask-carved fillets, not
 * a clip-path — see the MODULAR FIELD SYSTEM block in globals.css for why.
 * This component's only real job is emitting the correct set of shape pieces
 * for the chosen edge, so no page has to hand-assemble them (and get the
 * fillet count wrong).
 *
 * Deliberately NOT a card. Fields are meant to be big, sparse and few.
 */

export type FieldEdge =
  | 'flat'
  /* Material extends UPWARD past the top edge, on one side. */
  | 'tab-top-left'
  | 'tab-top-right'
  /* Material is carved DOWN into the top edge, centred. */
  | 'recess-top'

type ModularFieldProps = {
  children: ReactNode
  edge?: FieldEdge
  /** Element type for the outer field — `footer`, `section`, etc. */
  as?: 'div' | 'section' | 'footer' | 'header'
  /** Surface colour token. Stays inside the active two-colour pair. */
  face?: string
  className?: string
  bodyClassName?: string
}

export function ModularField({
  children,
  edge = 'flat',
  as: Tag = 'div',
  face,
  className = '',
  bodyClassName = '',
}: ModularFieldProps) {
  const variant = edge === 'flat' ? '' : `mfield--${edge}`

  return (
    <Tag
      className={`mfield ${variant} ${className}`.trim()}
      style={face ? ({ '--f-face': face } as React.CSSProperties) : undefined}
    >
      {/*
        Shape pieces are aria-hidden and pointer-events:none — they carry no
        content and must never intercept a click meant for the body.
      */}
      {(edge === 'tab-top-left' || edge === 'tab-top-right') && (
        <>
          <i className="mfield-tab" aria-hidden="true" />
          <i className="mfield-fil" aria-hidden="true" />
        </>
      )}

      {/*
        The recess needs TWO shoulders and TWO fillets: the dip is the gap
        between them, so both inner corners have to be turned.
      */}
      {edge === 'recess-top' && (
        <>
          <i className="mfield-tab mfield-tab-l" aria-hidden="true" />
          <i className="mfield-tab mfield-tab-r" aria-hidden="true" />
          <i className="mfield-fil mfield-fil-l" aria-hidden="true" />
          <i className="mfield-fil mfield-fil-r" aria-hidden="true" />
        </>
      )}

      <div className={`mfield-body ${bodyClassName}`.trim()}>{children}</div>
    </Tag>
  )
}
