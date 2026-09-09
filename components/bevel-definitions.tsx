export function BevelText({ text }: { text: string }) {
  return <span className="bevel-motion">
    <span className="bevel-rest"><span className="bevel-blue">{text}</span><span className="bevel-coral" aria-hidden="true">{text}</span></span>
    <span className="bevel-shift" aria-hidden="true"><span className="bevel-blue">{text}</span><span className="bevel-coral">{text}</span></span>
  </span>
}

export function BevelDefinitions() {
  return <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', pointerEvents: 'none' }}>
    <defs>
      {[
        { id: 'burgama-bevel', radius: 2.8, depth: 12, inverse: false },
        { id: 'burgama-bevel-small', radius: 1.2, depth: 7, inverse: false },
        { id: 'burgama-bevel-logo', radius: 1.8, depth: 14, inverse: false },
        { id: 'burgama-bevel-inverse', radius: 2.4, depth: 12, inverse: true },
        { id: 'burgama-bevel-hover', radius: 2, depth: 16, inverse: false },
      ].map(({ id, radius, depth, inverse }) => <filter key={id} id={id} x="-15%" y="-25%" width="130%" height="160%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation={radius} result="heightMap" />
        <feDiffuseLighting in="heightMap" surfaceScale={depth} diffuseConstant="1.3" lightingColor={inverse ? '#008ca8' : '#00c8ed'} result="sculpted">
          <feDistantLight azimuth={id === 'burgama-bevel-hover' ? 135 : 265} elevation={id === 'burgama-bevel-hover' ? 40 : 24} />
        </feDiffuseLighting>
        <feComposite in="sculpted" in2="SourceAlpha" operator="in" result="body" />
        <feSpecularLighting in="heightMap" surfaceScale={depth} specularConstant="1.7" specularExponent="22" lightingColor="#00c8ed" result="shine">
          <feDistantLight azimuth={id === 'burgama-bevel-hover' ? 315 : 85} elevation="38" />
        </feSpecularLighting>
        <feComposite in="shine" in2="SourceAlpha" operator="in" result="clippedShine" />
        <feComposite in="body" in2="clippedShine" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
        <feColorMatrix in="lit" type="matrix" values="0 0 0 0 0  0 0 0.784 0 0  0 0 0.804 0 0.125  0 0 0 1 0" result="blueOnly" />
        <feComposite in="blueOnly" in2="SourceAlpha" operator="in" />
      </filter>)}
      {[false, true].map(hover => <filter key={String(hover)} id={`burgama-bevel-coral${hover ? '-hover' : ''}`} x="-15%" y="-25%" width="130%" height="160%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation={hover ? 4 : 6} result="heightMap" />
        <feFlood floodColor="#31c8ef" result="cyanBody" />
        <feComposite in="cyanBody" in2="SourceAlpha" operator="in" result="body" />
        <feSpecularLighting in="heightMap" surfaceScale={hover ? 28 : 22} specularConstant="2" specularExponent="12" lightingColor="#ffffff" result="shine">
          <feDistantLight azimuth={hover ? 315 : 85} elevation={hover ? 44 : 38} />
        </feSpecularLighting>
        <feColorMatrix in="shine" type="matrix" values="0 0 0 0 1  0 0 0 0 .65  0 0 0 0 .8  .333 .333 .333 0 0" result="pinkShine" />
        <feMorphology in="SourceAlpha" operator="erode" radius="10" result="inset" />
        <feComposite in="SourceAlpha" in2="inset" operator="out" result="edge" />
        <feGaussianBlur in="edge" stdDeviation="2" result="softEdge" />
        <feComposite in="pinkShine" in2="softEdge" operator="in" result="edgeShine" />
        <feComposite in="edgeShine" in2="SourceAlpha" operator="in" result="clippedShine" />
        <feMerge><feMergeNode in="body" /><feMergeNode in="clippedShine" /></feMerge>
      </filter>)}
    </defs>
  </svg>
}
