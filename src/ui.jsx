import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, navigate, usePath } from './router';
import { me, projects, routes } from './data';
import { renderArt } from './fx/art';
import { replayIntro } from './fx/loader';
import { getAtlas } from './fx/atlas';

export const Arrow = ({ d = 'ne' }) => <span className={`arr arr-${d}`} aria-hidden="true">{d === 'down' ? '↓' : d === 'e' ? '→' : '↗'}</span>;

export function useTitle(t) { useEffect(() => { document.title = t ? `${t} — Hardik Dhingra` : 'Hardik Dhingra — Developer & Builder'; }, [t]); }

export function Mark({ size = 34 }) {
  // HD monogram: a rounded tile with the H and D drawn as strokes, plus a blinking caret
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="10" fill="currentColor" />
      <path d="M9.5 11.5v17M9.5 20h7.5M17 11.5v17M22.5 11.5v17h3.2a8.5 8.5 0 0 0 0-17z" fill="none" stroke="var(--bg)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect className="mark-caret" x="33" y="25" width="2.6" height="5" rx="1" fill="var(--bg)" />
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
// maxH (fraction of viewport height) caps how tall the word may get.
export function Wipe({ text, className = '', fit = false, maxH = 0, delay = 0, as: Tag = 'span', gate = true, step = .06 }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!fit) return;
    const el = ref.current;
    const run = () => {
      el.style.fontSize = '100px';
      const w = el.scrollWidth, box = el.parentElement.clientWidth;
      if (!w) return;
      let fs = (box / w) * 100;
      const cap = fs * .7, lim = maxH * innerHeight;
      if (maxH && cap > lim) fs *= lim / cap; // too tall: shrink, never stretch
      el.style.fontSize = fs + 'px';
    };
    run();
    document.fonts?.load('700 100px "Bricolage Grotesque"').then(run);
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

// Scroll-reactive marquee: speeds up with scroll velocity, flips direction when you scroll up,
// and leans into the motion. `px` = base speed in px/s, `reverse` starts it the other way.
export function Marquee({ items, px = 60, reverse = false, className = '' }) {
  const wrap = useRef(null), track = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0, v = 0, dir = reverse ? 1 : -1, lastY = scrollY, last = 0, raf, vis = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; });
    io.observe(wrap.current);
    const loop = now => {
      const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
      const dy = scrollY - lastY; lastY = scrollY;
      if (Math.abs(dy) > 1) dir = (dy > 0 ? -1 : 1) * (reverse ? -1 : 1);
      v += (Math.min(60, Math.abs(dy)) * 40 - v) * .08;
      if (vis) {
        const half = track.current.scrollWidth / 2;
        x += dir * (px + v) * dt; if (x <= -half) x += half; if (x > 0) x -= half;
        track.current.style.transform = `translate3d(${x}px,0,0) skewX(${dir * -Math.min(14, v / 120)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [px, reverse]);
  const row = items.map((t, i) => <React.Fragment key={i}><span className={i % 2 ? 'o' : ''}>{t}</span><i aria-hidden="true">✦</i></React.Fragment>);
  return <div ref={wrap} className={`marquee ${className}`} aria-hidden="true"><div ref={track}>{row}{row}{row}{row}</div></div>;
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
        <Marquee items={['LET’S BUILD IT', 'SAY HELLO', 'START A PROJECT']} px={90} className="foot-mq" />
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

/* ---------- a field of dim characters: an ambient wave drifts across, and they flare around the cursor ---------- */
export function CharField({ className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), CW = 12, CH = 18;
    let W, H, cols, rows, seed, raf, trail = [], vis = true;
    const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; cols = Math.ceil(W / CW); rows = Math.ceil(H / CH); seed = Float32Array.from({ length: cols * rows }, Math.random); };
    size();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = now => {
      const t = now / 1000, atlas = getAtlas(CW, CH, dpr, 13);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      trail = trail.filter(p => t - p.t < .9);
      const wx = ((t * .12) % 1.6 - .3) * W; // ambient diagonal sweep
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c, px = c * CW + CW / 2, py = r * CH + CH / 2;
        let b = seed[i] < .35 ? .05 + .06 * Math.sin(t * 1.5 + seed[i] * 40) : 0;
        const band = Math.exp(-(((px + py * .6 - wx) / 90) ** 2));
        if (band > .05 && seed[i] < .6) b = Math.max(b, band * (.25 + .3 * Math.sin(t * 3 + seed[i] * 30)));
        for (const p of trail) { const d = Math.hypot(px - p.x, py - p.y), age = t - p.t; b = Math.max(b, Math.exp(-d / 60) * (1 - age / .9) * .9); }
        if (b > .03) atlas.draw(ctx, b, .3 + b * .6, b > .2 ? 'ember' : 'cream', c * CW, r * CH);
      }
      if (!still && vis) raf = requestAnimationFrame(draw);
    };
    const mv = e => { const b = cv.getBoundingClientRect(); if (e.clientY < b.top || e.clientY > b.bottom) return; trail.push({ x: e.clientX - b.left, y: e.clientY - b.top, t: performance.now() / 1000 }); if (trail.length > 40) trail.shift(); };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(draw); });
    io.observe(cv);
    const ro = new ResizeObserver(size); ro.observe(cv);
    addEventListener('pointermove', mv);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); removeEventListener('pointermove', mv); };
  }, []);
  return <canvas ref={ref} className={`field ${className}`} aria-hidden="true" />;
}
