import React, { useEffect, useRef, useState } from 'react';
import { me, projects } from '../data';
import { Link } from '../router';
import { Wipe, Cover, LitText, Marquee, Label, Arrow, useClock, useTitle, CharField } from '../ui';

export function CountUp({ to, suffix = '' }) {
  const ref = useRef(null), [v, set] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const step = now => { const p = Math.min(1, (now - t0) / 1600); set(Math.round(to * (1 - (1 - p) ** 4))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: .4 });
    io.observe(ref.current); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function IssueIndex() {
  const [hover, setHover] = useState(null);
  const prev = useRef(null), pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    let raf;
    const move = e => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    const loop = () => {
      const p = pos.current; p.x += (p.tx - p.x) * .14; p.y += (p.ty - p.y) * .14;
      if (prev.current) prev.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${(p.tx - p.x) * .05}deg)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener('pointermove', move); loop();
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
  const list = projects.slice(0, 8);
  return (
    <section className="index section fx">
        <CharField variant="rain" className="sec-field" />
      <Label n="02">Selected work</Label>
      <div className="index-list" onPointerLeave={() => setHover(null)}>
        {list.map((p, i) => (
          <Link key={p.slug} to={`/work/${p.slug}`} label={p.name} className="index-row rv" style={{ '--i': i }} onPointerEnter={() => setHover(p)} data-cursor="Read">
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            <strong>{p.name}</strong>
            <span className="ix-tag">{p.tagline}</span>
            <span className="mono ix-kind">{p.kind}</span>
            <Arrow />
          </Link>
        ))}
      </div>
      <div ref={prev} className={`ix-preview ${hover ? 'on' : ''}`} aria-hidden="true">
        {hover && <div key={hover.slug} className="show"><Cover p={hover} link={false} tilt={false} /></div>}
      </div>
      <Link to="/work" className="btn rv">Explore all the work <Arrow d="e" /></Link>
    </section>
  );
}

export default function Home() {
  useTitle();
  const time = useClock();
  const feat = projects.filter(p => p.featured);
  const covers = useRef(null);
  useEffect(() => {
    const el = covers.current;
    const move = e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; el.style.setProperty('--mx', x); el.style.setProperty('--my', y); };
    addEventListener('pointermove', move); return () => removeEventListener('pointermove', move);
  }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-meta mono">
          <span className="hm-a"><i className="dot" />{me.available}</span>
          <span className="hm-b">Full-stack developer & builder</span>
          <span className="hm-c">{me.city} · {time}</span>
        </div>
        <h1 className="hero-word" aria-label="Hardik Dhingra"><Wipe text="HARDIK" fit maxH={.3} step={.07} /></h1>
        <div className="hero-covers" ref={covers}>
          {feat.map((p, i) => <div key={p.slug} className={`hc hc${i}`}><Cover p={p} /></div>)}
        </div>
      </section>

      <div className="tapes">
        <Marquee items={['DESIGN WITH INTENT', 'SHIP WITH NERVE', 'ITERATE FOREVER', 'BUILT IN GURUGRAM']} className="tape t1" />
        <Marquee items={['WEB', 'MOBILE', 'MACOS', 'AI AGENTS', 'HEALTH TECH', 'WEB3']} px={45} reverse className="tape t2" />
      </div>

      <section className="statement section fx">
        <CharField variant="rain" className="sec-field" />
        <Label n="01">What I do</Label>
        <LitText text="Give me a fuzzy idea and I’ll hand you something you can click. I design, build and test web, mobile and macOS products end to end, from dashboards for solar companies to AI agents that repair their own skills, and I care about the small details that make software feel alive." />
        <div className="stats">
          <div className="rv"><strong><CountUp to={3} suffix="×" /></strong><span className="mono">Hackathon winner</span></div>
          <div className="rv" style={{ '--i': 1 }}><strong><CountUp to={1} /></strong><span className="mono">Internship · CityScene Global</span></div>
          <div className="rv" style={{ '--i': 2 }}><strong><CountUp to={5} /></strong><span className="mono">Client apps contributed to</span></div>
          <div className="rv" style={{ '--i': 3 }}><strong><CountUp to={1} /></strong><span className="mono">Package on PyPI</span></div>
        </div>
      </section>

      <IssueIndex />

      <section className="explore section fx">
        <CharField variant="rain" className="sec-field" />
        <Label n="03">Keep reading</Label>
        {[
          ['/skills', 'Skills', 'A jar of every tool I’ve shipped with. Grab one and throw it.'],
          ['/experience', 'Experience', 'An internship, three hackathon wins and the path so far.'],
          ['/about', 'About', 'The person behind the builds, rendered in characters.'],
          ['/contact', 'Contact', 'Open to internships and collaborations. Say hello.'],
        ].map(([to, t, d], i) => (
          <Link key={to} to={to} className="ex-row rv" style={{ '--i': i }} data-cursor="Go">
            <span className="mono">0{i + 1}</span><strong>{t}</strong><p>{d}</p><Arrow d="e" />
          </Link>
        ))}
      </section>
    </>
  );
}
