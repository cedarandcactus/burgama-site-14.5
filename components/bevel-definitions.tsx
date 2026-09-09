export function BevelDefinitions() {
  return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', pointerEvents: 'none' }}>
    <defs>
      {[
        { id: 'burgama-bevel', radius: 2.8, depth: 12, inverse: false },
        { id: 'burgama-bevel-small', radius: 1.2, depth: 7, inverse: false },
        { id: 'burgama-bevel-logo', radius: 1.8, depth: 14, inverse: false },
        { id: 'burgama-bevel-inverse', radius: 2.4, depth: 12, inverse: true },
      ].map(({ id, radius, depth, inverse }) => <filter key={id} id={id} x="-15%" y="-25%" width="130%" height="160%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation={radius} result="heightMap" />
        <feDiffuseLighting in="heightMap" surfaceScale={depth} diffuseConstant="1.3" lightingColor={inverse ? '#008ca8' : '#00c8ed'} result="sculpted">
          <feDistantLight azimuth="265" elevation="24" />
        </feDiffuseLighting>
        <feComposite in="sculpted" in2="SourceAlpha" operator="in" result="body" />
        <feSpecularLighting in="heightMap" surfaceScale={depth} specularConstant="1.7" specularExponent="22" lightingColor={inverse ? '#00c8ed' : '#b6f6ff'} result="shine">
          <feDistantLight azimuth="85" elevation="38" />
        </feSpecularLighting>
        <feComposite in="shine" in2="SourceAlpha" operator="in" result="clippedShine" />
        <feComposite in="body" in2="clippedShine" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
        <feComposite in="lit" in2="SourceAlpha" operator="in" />
      </filter>)}
    </defs>
  </svg>
}
