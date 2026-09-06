const capabilities = [
  { title: 'brand & direction', body: 'Positioning, identity, messaging and art direction. A shared point of view, expressed clearly everywhere it appears.' },
  { title: 'digital & development', body: 'Websites, commerce and digital experiences. Designed to be useful, built to be used.' },
  { title: 'campaigns & content', body: 'Photography, production and content systems. A consistent story with room to meet the moment.' },
  { title: 'marketing & growth', body: 'Search, social and ongoing creative partnerships. Keeping the right work in front of the right people.' },
]

export function ActCapabilities() {
  return (
    <section className="home-plate capabilities-plate" data-home-plate aria-labelledby="capabilities-heading">
      <div className="capabilities-intro"><h2 id="capabilities-heading" className="font-serif">a broad range.<br />one close team.</h2><p>Strategy, design, and marketing under one roof. We bring the right disciplines together, without putting layers between you and the people doing the work.</p></div>
      <div className="capabilities-rows">{capabilities.map(item => <details key={item.title}><summary><span className="font-serif">{item.title}</span><span className="detail-toggle" aria-hidden="true" /></summary><p>{item.body}</p></details>)}</div>
    </section>
  )
}
