import React, { useEffect, useState } from 'react';
import { me, now } from '../data';
import { Link } from '../router';
import { Wipe, useClock, useTitle, Arrow } from '../ui';

const ago = d => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};
function describe(e) {
  const repo = e.repo.name.split('/')[1];
  switch (e.type) {
    case 'PushEvent': { const n = e.payload?.size ?? e.payload?.commits?.length ?? 1; return [`Pushed ${n} commit${n === 1 ? '' : 's'}`, repo]; }
    case 'CreateEvent': return [`Created ${e.payload?.ref_type || 'repo'}`, repo];
    case 'ReleaseEvent': return ['Released', repo];
    case 'WatchEvent': return ['Starred', repo];
    case 'PullRequestEvent': return [`${e.payload?.action === 'closed' ? 'Merged' : 'Opened'} a PR`, repo];
    case 'IssuesEvent': return [`${e.payload?.action || 'Updated'} an issue`, repo];
    case 'ForkEvent': return ['Forked', repo];
    default: return [e.type.replace('Event', ''), repo];
  }
}

function Feed() {
  const [items, set] = useState(null);
  useEffect(() => {
    fetch(`https://api.github.com/users/${me.githubUser}/events/public?per_page=30`)
      .then(r => (r.ok ? r.json() : [])).then(d => set(Array.isArray(d) ? d.slice(0, 7) : [])).catch(() => set([]));
  }, []);
  if (!items) return <div className="feed-load mono">Fetching live activity<span className="blink">_</span></div>;
  if (!items.length) return <a className="mono" href={me.github} target="_blank" rel="noreferrer">See activity on GitHub ↗</a>;
  return (
    <ul className="feed">
      {items.map((e, i) => { const [what, repo] = describe(e); return (
        <li key={e.id} style={{ '--i': i }}><span>{what}</span><a href={`https://github.com/${e.repo.name}`} target="_blank" rel="noreferrer">{repo}</a><time className="mono">{ago(e.created_at)}</time></li>
      ); })}
    </ul>
  );
}

export default function Now() {
  useTitle('Now');
  const time = useClock();
  return (
    <>
      <section className="page-head">
        <div className="ph-meta mono"><span>06 — Now</span><span>Updated {now.updated}</span></div>
        <h1 className="ph-word"><Wipe text="NOW" fit maxH={.4} /></h1>
        <p className="ph-lede rv">A <em>now</em> page: what I’m focused on this month. If we talk, this is what I’ll probably bring up.</p>
      </section>
      <section className="now-grid section">
        <div className="card c-build rv">
          <span className="mono">Building</span>
          {now.building.map(([n, d, to]) => <Link key={n} to={to} label={n} className="nb"><strong>{n}</strong><span>{d}</span><Arrow d="e" /></Link>)}
        </div>
        <div className="card c-clock rv" style={{ '--i': 1 }}>
          <span className="mono">Right now in Gurugram</span>
          <strong className="big-clock">{time}</strong>
          <span className="dim">IST · UTC+5:30</span>
        </div>
        <div className="card c-learn rv" style={{ '--i': 2 }}>
          <span className="mono">Learning</span>
          <ul>{now.learning.map(l => <li key={l}>{l}</li>)}</ul>
        </div>
        <div className="card c-feed rv" style={{ '--i': 3 }}>
          <span className="mono"><i className="dot" /> Live from GitHub</span>
          <Feed />
        </div>
        <div className="card c-look rv" style={{ '--i': 4 }}>
          <span className="mono">Looking for</span>
          <p>{now.looking}</p>
          <Link to="/contact" className="btn small">Let’s talk <Arrow d="e" /></Link>
        </div>
      </section>
    </>
  );
}
