import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, navigate, usePath } from './router';
import { me, projects, routes } from './data';
import { renderArt } from './fx/art';
import { replayIntro } from './fx/loader';

export const Arrow = ({ d = 'ne' }) => <span className={`arr arr-${d}`} aria-hidden="true">{d === 'down' ? '↓' : d === 'e' ? '→' : '↗'}</span>;

export function useTitle(t) { useEffect(() => { document.title = t ? `${t} — Hardik Dhingra` : 'Hardik Dhingra — Developer & Builder'; }, [t]); }

export function Mark({ size = 34 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <g className="mark-spin">{[0, 45, 90, 135].map(a => <rect key={a} x="17.5" y="3" width="5" height="34" rx="2.5" transform={`rotate(${a} 20 20)`} fill="currentColor" />)}</g>
      <circle cx="20" cy="20" r="4.2" fill="var(--bg)" />
    </svg>
  );
}

/* ---------- time in Gurugram ---------- */
export function useClock() {
  const fmt = useMemo(() => new Intl.DateTimeFormat('en-GB', { timeZone: me.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), []);
  const [now, set] = useState(() => fmt.format(new Date()));
  useEffect(() => { const i = setInterval(() => set(fmt.format(new Date())), 1000); return () => clearInterval(i); }, [fmt]);
  return now;
}

/* ---------- letter-by-letter wipe; `fit` stretches the word edge to edge ---------- */
// maxH (fraction of viewport height) squashes the word vertically when it would get too tall.
export function Wipe({ text, className = '', fit = false, maxH = 0, delay = 0, as: Tag = 'span', gate = true, step = .06 }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!fit) return;
    const el = ref.current;
    const run = () => {
      el.style.fontSize = '100px'; el.style.transform = ''; el.style.marginBottom = '';
      const w = el.scrollWidth, box = el.parentElement.clientWidth;
      if (!w) return;
      const fs = (box / w) * 100; el.style.fontSize = fs + 'px';
      const cap = fs * .74, lim = maxH * innerHeight;
      if (maxH && cap > lim) { el.style.transformOrigin = '50% 0'; el.style.transform = `scaleY(${lim / cap})`; el.style.marginBottom = `${-el.offsetHeight * (1 - lim / cap)}px`; }
    };
    run();
    document.fonts?.load('100px Anton').then(run);
    const ro = new ResizeObserver(run); ro.observe(el.parentElement);
    if (maxH) addEventListener('resize', run);
    return () => { ro.disconnect(); removeEventListener('resize', run); };
  }, [fit, text, maxH]);
  return (
    <Tag ref={ref} className={`wipe ${gate ? 'gate' : ''} ${className}`} aria-label={text}>
      {[...text].map((ch, i) => <span aria-hidden="true" key={i} style={{ '--d': `${delay + i * step}s` }}>{ch === ' ' ? ' ' : ch}</span>)}
    </Tag>
  );
}

/* ---------- words light up as you scroll ---------- */
export function LitText({ text, className = '' }) {
  const ref = useRef(null);
  const words = text.split(' ');
  useEffect(() => {
    const el = ref.current, spans = [...el.children]; let raf;
    const tick = () => {
      const b = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * .85 - b.top) / (b.height + innerHeight * .4)));
      spans.forEach((s, i) => s.classList.toggle('on', i / spans.length < p));
      raf = requestAnimationFrame(tick);
    };
    tick(); return () => cancelAnimationFrame(raf);
  }, [text]);
  return <p ref={ref} className={`lit ${className}`}>{words.map((w, i) => <span key={i}>{w} </span>)}</p>;
}

export function Marquee({ items, speed = 40, className = '' }) {
  const row = items.map((t, i) => <React.Fragment key={i}><span>{t}</span><i aria-hidden="true">✦</i></React.Fragment>);
  return <div className={`marquee ${className}`} aria-hidden="true"><div style={{ '--sp': `${speed}s` }}>{row}{row}{row}{row}</div></div>;
}

/* ---------- ASCII art canvas that only animates while visible ---------- */
export function AsciiArt({ scene, ramp, cell, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; let raf, vis = false, last = 0, t0 = performance.now() / 1000 + Math.random() * 10;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = now => { if (now - last > 40) { last = now; renderArt(cv, scene, now / 1000 - t0 + 20, ramp, cell); } if (vis && !still) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(loop); });
    io.observe(cv); renderArt(cv, scene, 20, ramp, cell);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [scene, ramp]);
  return <canvas ref={ref} className={`ascii ${className}`} aria-hidden="true" />;
}

/* ---------- magazine cover ---------- */
const rampFor = theme => (theme === 'dark' ? 'ember' : 'ink');
export function Cover({ p, i = 0, className = '', style, link = true, tilt = true }) {
  const ref = useRef(null);
  const issue = String(projects.indexOf(p) + 1).padStart(2, '0');
  const onMove = e => {
    if (!tilt) return;
    const b = ref.current.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    ref.current.style.setProperty('--rx', `${-y * 10}deg`); ref.current.style.setProperty('--ry', `${x * 12}deg`);
    ref.current.style.setProperty('--gx', `${(x + .5) * 100}%`); ref.current.style.setProperty('--gy', `${(y + .5) * 100}%`);
  };
  const onLeave = () => { ['--rx', '--ry'].forEach(k => ref.current.style.setProperty(k, '0deg')); };
  const body = (
    <div ref={ref} className={`cover t-${p.theme} ${className}`} style={style} onPointerMove={onMove} onPointerLeave={onLeave} role="img" aria-label={`${p.name} cover: ${p.tagline}`}>
      <div className="c-in">
        <div className="c-top"><span>ISSUE {issue}</span><span>{p.year} EDITION</span><span>FREE</span></div>
        <div className="c-title" style={{ '--n': p.cover.length }}>{p.cover}</div>
        <AsciiArt scene={p.art} ramp={rampFor(p.theme)} cell={[7, 10]} className="c-art" />
        <div className="c-lines">{p.lines.map(l => <span key={l}>{l}</span>)}</div>
        <div className="c-foot"><span>{p.kind}</span><span className="barcode" /></div>
        <div className="c-shine" />
      </div>
    </div>
  );
  return link ? <Link to={`/work/${p.slug}`} label={p.name} className="cover-link" data-cursor="Open">{body}</Link> : body;
}

/* ---------- custom cursor ---------- */
export function Cursor() {
  const dot = useRef(null), ring = useRef(null), lab = useRef(null);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf;
    const move = e => { x = e.clientX; y = e.clientY; };
    const over = e => {
      const t = e.target.closest('a,button,[data-cursor],input,textarea');
      ring.current.classList.toggle('hot', !!t);
      const l = t?.closest('[data-cursor]')?.dataset.cursor || '';
      lab.current.textContent = l; ring.current.classList.toggle('lab', !!l);
    };
    const loop = () => { rx += (x - rx) * .18; ry += (y - ry) * .18; dot.current.style.transform = `translate(${x}px,${y}px)`; ring.current.style.transform = `translate(${rx}px,${ry}px)`; raf = requestAnimationFrame(loop); };
    addEventListener('pointermove', move); addEventListener('pointerover', over); loop();
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerover', over); cancelAnimationFrame(raf); };
  }, []);
  return <><div ref={dot} className="cur-dot" aria-hidden="true" /><div ref={ring} className="cur-ring" aria-hidden="true"><span ref={lab} /></div></>;
}

/* ---------- ⌘K command palette ---------- */
export function Palette({ open, setOpen }) {
  const [q, setQ] = useState(''), [sel, setSel] = useState(0), input = useRef(null);
  const [toast, setToast] = useState('');
  const items = useMemo(() => [
    ...routes.map(([to, l]) => ({ g: 'Pages', l, k: to, run: () => navigate(to) })),
    ...projects.map(p => ({ g: 'Projects', l: p.name, k: p.kind, run: () => navigate(`/work/${p.slug}`, { label: p.name }) })),
    { g: 'Actions', l: 'Copy email address', k: me.email, run: () => { navigator.clipboard?.writeText(me.email); setToast('Email copied'); } },
    { g: 'Actions', l: 'Download résumé', k: 'PDF', run: () => window.open(me.resume, '_blank') },
    { g: 'Actions', l: 'Open GitHub', k: 'github.com', run: () => window.open(me.github, '_blank') },
    { g: 'Actions', l: 'Open LinkedIn', k: 'linkedin.com', run: () => window.open(me.linkedin, '_blank') },
    { g: 'Actions', l: 'Replay the intro', k: 'loader', run: replayIntro },
  ], []);
  const list = items.filter(i => (i.l + ' ' + i.k + ' ' + i.g).toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const k = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o); }
      else if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); setOpen(true); }
      else if (e.key === 'Escape') setOpen(false);
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [setOpen]);
  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => input.current?.focus(), 30); } }, [open]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 1600); return () => clearTimeout(t); } }, [toast]);
  const run = it => { if (!it) return; it.run(); if (it.g !== 'Actions' || it.l.startsWith('Replay')) setOpen(false); };
  let lastG = '';
  return (
    <>
      <div className={`palette ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && setOpen(false)} aria-hidden={!open}>
        <div className="pal-box" role="dialog" aria-label="Command menu">
          <div className="pal-in"><span className="mono">⌘K</span>
            <input ref={input} value={q} placeholder="Jump to a page, project or action…" onChange={e => { setQ(e.target.value); setSel(0); }}
              onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(list.length - 1, s + 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)); } if (e.key === 'Enter') run(list[sel]); }} />
          </div>
          <div className="pal-list">
            {list.map((it, i) => {
              const head = it.g !== lastG ? (lastG = it.g, <div className="pal-g mono" key={'g' + it.g}>{it.g}</div>) : null;
              return <React.Fragment key={it.g + it.l}>{head}<button className={i === sel ? 'sel' : ''} onMouseEnter={() => setSel(i)} onClick={() => run(it)}><span>{it.l}</span><small>{it.k}</small></button></React.Fragment>;
            })}
            {!list.length && <div className="pal-empty mono">Nothing matches “{q}”</div>}
          </div>
          <div className="pal-foot mono"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></div>
        </div>
      </div>
      <div className={`toast mono ${toast ? 'on' : ''}`} role="status">{toast}</div>
    </>
  );
}

/* ---------- navigation ---------- */
export function Nav({ openPalette }) {
  const path = usePath(), [menu, setMenu] = useState(false), [sc, setSc] = useState({ on: false, hide: false });
  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    let last = scrollY;
    const f = () => { const y = scrollY; setSc({ on: y > 60, hide: y > 300 && y > last }); last = y; };
    addEventListener('scroll', f, { passive: true }); f(); return () => removeEventListener('scroll', f);
  }, []);
  useEffect(() => { document.documentElement.classList.toggle('menu-open', menu); }, [menu]);
  const is = to => (to === '/' ? path === '/' : path.startsWith(to));
  return (
    <>
      <header className={`nav ${sc.on ? 'scrolled' : ''} ${sc.hide && !menu ? 'hide' : ''}`}>
        <Link to="/" className="brand" aria-label="Hardik Dhingra, home"><Mark /><span>HARDIK<br />DHINGRA</span></Link>
        <nav aria-label="Main" className="nav-links">
          {routes.slice(1).map(([to, l], i) => <Link key={to} to={to} className={is(to) ? 'on' : ''} aria-current={is(to) ? 'page' : undefined}><small>0{i + 1}</small>{l}</Link>)}
        </nav>
        <button className="kbd" onClick={openPalette} aria-label="Open command menu"><span>Search</span><kbd>⌘K</kbd></button>
        <button className="burger" onClick={() => setMenu(m => !m)} aria-expanded={menu} aria-label="Menu"><i /><i /></button>
      </header>
      <div className={`mmenu ${menu ? 'open' : ''}`} aria-hidden={!menu}>
        {routes.map(([to, l], i) => <Link key={to} to={to} style={{ '--i': i }} className={is(to) ? 'on' : ''}><small>0{i}</small>{l}</Link>)}
        <div className="mm-foot mono"><a href={`mailto:${me.email}`}>{me.email}</a></div>
      </div>
    </>
  );
}

/* ---------- footer ---------- */
export function Footer() {
  const time = useClock();
  return (
    <footer className="foot">
      <Link to="/contact" className="foot-cta" data-cursor="Say hi">
        <span className="mono">Got an idea?</span>
        <Marquee items={['LET’S BUILD IT', 'SAY HELLO', 'START A PROJECT']} speed={22} className="foot-mq" />
      </Link>
      <div className="foot-grid">
        <div><span className="mono">Pages</span>{routes.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}</div>
        <div><span className="mono">Elsewhere</span><a href={me.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="https://pypi.org/project/errorbuddy/" target="_blank" rel="noreferrer">PyPI <Arrow /></a><a href={me.resume} target="_blank" rel="noreferrer">Résumé <Arrow d="down" /></a></div>
        <div><span className="mono">Local time</span><strong className="foot-time">{time}</strong><span className="dim">{me.city} · IST</span></div>
        <div><span className="mono">Easter eggs</span><button onClick={replayIntro}>Replay the intro ↻</button><span className="dim">Press <kbd>⌘K</kbd> anywhere</span></div>
      </div>
      <div className="foot-base mono"><span>© {new Date().getFullYear()} Hardik Dhingra</span><span>Hand-built with React and a lot of characters</span><button onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div>
    </footer>
  );
}

/* ---------- section label ---------- */
export const Label = ({ n, children }) => <div className="label rv"><span className="n">{n}</span><span>{children}</span><i /></div>;
