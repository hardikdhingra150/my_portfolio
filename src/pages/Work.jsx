import React, { useMemo, useState } from 'react';
import { projects, archive } from '../data';
import { Link } from '../router';
import { Wipe, Cover, Label, Arrow, AsciiArt, useTitle, CharField } from '../ui';

export function Work() {
  useTitle('Work');
  const cats = useMemo(() => ['All', ...new Set(projects.map(p => p.cat))], []);
  const [cat, setCat] = useState('All');
  const list = projects.filter(p => cat === 'All' || p.cat === cat);
  return (
    <>
      <section className="page-head">
        <CharField className="head-field" />
        <div className="ph-meta mono"><span>02 — Work</span><span>Selected projects · 2025–2026</span></div>
        <h1 className="ph-word"><Wipe text="WORK" fit maxH={.3} /></h1>
        <p className="ph-lede rv">Every project gets its own magazine cover. The art on each one is generated live, in characters. Pick an issue.</p>
      </section>
      <section className="rack section">
        <div className="chips rv" role="tablist" aria-label="Filter projects">
          {cats.map(c => (
            <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
              {c}<sup>{c === 'All' ? projects.length : projects.filter(p => p.cat === c).length}</sup>
            </button>
          ))}
        </div>
        <div className="rack-grid" key={cat}>
          {list.map((p, i) => (
            <div className="rack-item" key={p.slug} style={{ '--i': i }}>
              <Cover p={p} />
              <div className="ri-cap"><strong>{p.name}</strong><span className="mono">{p.kind}</span></div>
            </div>
          ))}
        </div>
      </section>
      <section className="archive section">
        <Label n="+">From the archive</Label>
        {archive.map(([n, d, url], i) => (
          <a key={n} href={url} target="_blank" rel="noreferrer" className="ar-row rv" style={{ '--i': i }}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span><strong>{n}</strong><span>{d}</span><Arrow />
          </a>
        ))}
      </section>
    </>
  );
}

export function Project({ slug }) {
  const i = projects.findIndex(p => p.slug === slug), p = projects[i];
  useTitle(p?.name || 'Not found');
  if (!p) return null;
  const next = projects[(i + 1) % projects.length];
  const repo = `https://github.com/hardikdhingra150/${p.repo}`;
  return (
    <>
      <section className="proj-hero">
        <CharField className="head-field" />
        <Link to="/work" className="back mono">← All issues</Link>
        <div className="ph-grid">
          <div className="ph-cover"><Cover p={p} link={false} /></div>
          <div className="ph-copy">
            <div className="mono pc-meta"><span>Issue {String(i + 1).padStart(2, '0')}</span><span>{p.year}</span><span>{p.kind}</span></div>
            <h1 className="pc-title" aria-label={p.name} style={{ '--len': Math.max(...p.name.split(' ').map(w => w.length)) }}>{p.name.toUpperCase().split(' ').map((w, k) => <Wipe key={w} text={w} delay={.15 + k * .3} />)}</h1>
            <p className="pc-tag rv">{p.tagline}</p>
            <p className="pc-sum rv">{p.summary}</p>
            <div className="pc-stack rv">{p.stack.map(s => <span key={s}>{s}</span>)}</div>
            <div className="pc-links rv">
              {p.live && <a className="btn solid" href={p.live} target="_blank" rel="noreferrer" data-cursor="Visit">Visit live <Arrow /></a>}
              <a className="btn" href={repo} target="_blank" rel="noreferrer" data-cursor="Code">Source code <Arrow /></a>
            </div>
          </div>
        </div>
      </section>
      <section className="feats section">
        <Label n="01">What it does</Label>
        <ol>
          {p.features.map((f, k) => <li key={f} className="rv" style={{ '--i': k }}><span className="mono">{String(k + 1).padStart(2, '0')}</span><p>{f}</p></li>)}
        </ol>
      </section>
      <section className="art-band rv" aria-hidden="true">
        <AsciiArt scene={p.art} ramp="ember" cell={[9, 14]} />
        <span className="mono">FIG. {String(i + 1).padStart(2, '0')} — {p.name}, rendered in characters</span>
      </section>
      <Link to={`/work/${next.slug}`} label={next.name} className="next" data-cursor="Next">
        <span className="mono">Next issue →</span>
        <strong>{next.name}</strong>
        <span className="next-tag">{next.tagline}</span>
      </Link>
    </>
  );
}
