import React, { useEffect, useRef, useState } from 'react';
import { journey, highlights, education, certificates, internship } from '../data';
import { Wipe, Label, useTitle, CharField } from '../ui';

export default function Experience() {
  useTitle('Experience');
  const tl = useRef(null), [year, setYear] = useState(journey[0].when.slice(0, 4));
  useEffect(() => {
    let raf;
    const tick = () => {
      const el = tl.current; if (!el) return;
      const b = el.getBoundingClientRect();
      const bar = el.querySelector('.tl-line i');
      if (bar) bar.style.transform = `scaleY(${Math.max(0, Math.min(1, (innerHeight * .55 - b.top) / b.height))})`;
      let y = journey[0].when.slice(0, 4);
      el.querySelectorAll('.tl-item').forEach(it => { if (it.getBoundingClientRect().top < innerHeight * .55) y = it.dataset.y; });
      setYear(y);
      raf = requestAnimationFrame(tick);
    };
    tick(); return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <section className="page-head">
        <CharField className="head-field" />
        <div className="ph-meta mono"><span>04 — Experience</span><span>2024 → now</span></div>
        <h1 className="ph-word"><Wipe text="EXPERIENCE" fit maxH={.3} step={.045} /></h1>
        <p className="ph-lede rv">A software development internship on real client products, three hackathon wins, a package on PyPI, and a long log of things I’ve shipped since starting my B.Tech.</p>
      </section>

      <section className="intern section">
        <Label n="01">Internship</Label>
        <div className="in-card rv">
          <div className="in-head">
            <div>
              <span className="mono">{internship.when} · {internship.mode}</span>
              <h2>{internship.role}</h2>
              <span className="in-co">{internship.company}</span>
            </div>
            <div className="in-big" aria-hidden="true"><strong>60</strong><span className="mono">days</span></div>
          </div>
          <p className="in-sum">{internship.summary}</p>
          <div className="in-projects">
            {internship.projects.map((p, i) => (
              <article key={p.name} className="in-p rv" style={{ '--i': i + 1 }}>
                <span className="mono">0{i + 1} · {p.platform}</span>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
          <div className="in-stack">{internship.stack.map((t, i) => <span key={t} style={{ '--k': i }}>{t}</span>)}</div>
        </div>
      </section>

      <section className="hl section">
        {highlights.map(([big, small], i) => (
          <div key={small} className="hl-item rv" style={{ '--i': i }}><strong>{big}</strong><span className="mono">{small}</span></div>
        ))}
      </section>

      <section className="tl section" ref={tl}>
        <div className="tl-year" aria-hidden="true"><span key={year}>{year}</span></div>
        <div className="tl-line" aria-hidden="true"><i /></div>
        <ol className="tl-list">
          {journey.map((j, i) => (
            <li key={j.title} className="tl-item rv" data-y={j.when.slice(0, 4)} style={{ '--i': 0 }}>
              <span className="tl-dot" />
              <div className="tl-meta mono"><span>{j.when}</span><span className="tag">{j.tag}</span></div>
              <h3>{j.title}</h3>
              <span className="tl-place">{j.place}</span>
              <p>{j.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="edu section">
        <Label n="+">Education</Label>
        {education.map(([a, b, c], i) => (
          <div key={a} className="edu-row rv" style={{ '--i': i }}><strong>{a}</strong><span>{b}</span><span className="mono">{c}</span></div>
        ))}
        <div className="certs rv">
          <span className="mono">Certificates</span>
          {certificates.map(c => <span key={c} className="cert">{c}</span>)}
        </div>
      </section>
    </>
  );
}
