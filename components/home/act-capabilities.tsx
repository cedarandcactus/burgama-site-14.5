const capabilities = [
  { title: 'Brand & direction', body: 'Know what you stand for. Give it a look, a voice, and a system that holds.' },
  { title: 'Digital & development', body: 'Websites and products that look right, work hard, and stay maintainable.' },
  { title: 'Campaigns & content', body: 'Photography, production, and creative that keeps moving without losing the plot.' },
  { title: 'Marketing & growth', body: 'Search, social, and ongoing support focused on traction—not noise.' },
]

export function ActCapabilities() {
  return (
    <section className="home-plate capabilities-plate" data-home-plate aria-labelledby="capabilities-heading">
      <div className="capabilities-intro"><h2 id="capabilities-heading" className="font-serif">Built wide.<br />Kept close.</h2><p>Strategy, identity, digital, campaigns, and the people who connect them. One team stays with the work.</p></div>
      <div className="capabilities-grid">{capabilities.map(item => <article key={item.title}><h3 className="font-serif text-balance">{item.title}</h3><p>{item.body}</p></article>)}</div>
    </section>
  )
}
