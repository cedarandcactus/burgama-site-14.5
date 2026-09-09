export function BevelDefinitions() {
  return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', pointerEvents: 'none' }}>
    <defs>
      {[['burgama-bevel', 3, 4], ['burgama-bevel-small', 1, 2]].map(([id, radius, offset]) => <filter key={id} id={String(id)} x="-10%" y="-20%" width="120%" height="150%" colorInterpolationFilters="sRGB">
        <feMorphology in="SourceAlpha" operator="erode" radius={Number(radius)} result="core" />
        <feGaussianBlur in="core" stdDeviation={Number(radius) * .65} result="softCore" />
        <feOffset in="softCore" dx="-1" dy={Number(offset)} result="lower" />
        <feComposite in="SourceAlpha" in2="lower" operator="out" result="upperEdge" />
        <feFlood floodColor="#000020" floodOpacity=".98" result="navy" />
        <feComposite in="navy" in2="upperEdge" operator="in" result="shadow" />
        <feOffset in="softCore" dx="1" dy={-Number(offset)} result="upper" />
        <feComposite in="SourceAlpha" in2="upper" operator="out" result="lowerEdge" />
        <feFlood floodColor="#00c8ed" result="cyan" />
        <feComposite in="cyan" in2="lowerEdge" operator="in" result="highlight" />
        <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="shadow" /><feMergeNode in="highlight" /></feMerge>
      </filter>)}
    </defs>
  </svg>
}
