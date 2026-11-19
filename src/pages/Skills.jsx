import React, { useEffect, useMemo, useRef, useState } from 'react';
import { skillGroups, usage } from '../data';
import { Link } from '../router';
import { Wipe, Label, useTitle, CharField } from '../ui';

const GROUPS = Object.keys(skillGroups);

function Jar({ filter, shakeKey, onPick, picked }) {
  const box = useRef(null), els = useRef([]), bodies = useRef([]), filterRef = useRef(filter);
  const tokens = useMemo(() => GROUPS.flatMap(g => skillGroups[g].map(s => ({ s, g, n: usage(s).length }))), []);
  filterRef.current = filter;

  useEffect(() => {
    const el = box.current; let W = el.clientWidth, H = el.clientHeight, raf, last = 0, started = false;
    const k = Math.max(.55, Math.min(1, W / 1150));
    bodies.current = tokens.map((t, i) => ({
      ...t, r: Math.min(78, 30 + t.n * 8) * k, x: 60 + Math.random() * (W - 120), y: -120 - i * 38 - Math.random() * 60, vx: (Math.random() - .5) * 60, vy: 0,
    }));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let drag = null;
    const step = dt => {
      const B = bodies.current;
      for (const b of B) {
        if (b === drag?.b) { b.vx = (drag.x - b.x) / Math.max(dt, .008) * .35; b.vy = (drag.y - b.y) / Math.max(dt, .008) * .35; }
        else b.vy += 2000 * dt;
        b.vx *= .995; b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < b.r) { b.x = b.r; b.vx *= -.4; } if (b.x > W - b.r) { b.x = W - b.r; b.vx *= -.4; }
        if (b.y > H - b.r) { b.y = H - b.r; b.vy *= -.25; b.vx *= .92; }
      }
      for (let it = 0; it < 3; it++) for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
        const a = B[i], c = B[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy), m = a.r + c.r;
        if (d >= m || d === 0) continue;
        const nx = dx / d, ny = dy / d, o = (m - d) / 2;
        const wa = a === drag?.b ? 0 : c === drag?.b ? 1 : .5, wc = 1 - wa;
        a.x -= nx * o * 2 * wa; a.y -= ny * o * 2 * wa; c.x += nx * o * 2 * wc; c.y += ny * o * 2 * wc;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) { const imp = -rv * .6; a.vx -= nx * imp * wa * 2; a.vy -= ny * imp * wa * 2; c.vx += nx * imp * wc * 2; c.vy += ny * imp * wc * 2; }
      }
    };
    const render = () => bodies.current.forEach((b, i) => {
      const e = els.current[i]; if (!e) return;
      e.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px) rotate(${(b.x / b.r) * 18 % 360}deg)`;
    });
    const loop = now => {
      const dt = last ? Math.min(.033, (now - last) / 1000) : .016; last = now;
      step(dt / 2); step(dt / 2); render(); raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { started = true; if (reduce) { settle(); render(); } else raf = requestAnimationFrame(loop); }
    }, { threshold: .25 });
    const settle = () => { for (let i = 0; i < 900; i++) step(1 / 60); };
    io.observe(el);
    const pos = e => { const r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const down = e => {
      const i = els.current.indexOf(e.target.closest('.token')); if (i < 0) return;
      e.preventDefault(); el.setPointerCapture(e.pointerId);
      drag = { b: bodies.current[i], ...pos(e), sx: e.clientX, sy: e.clientY, i };
    };
    const move = e => { if (drag) Object.assign(drag, pos(e)); };
    const up = e => { if (!drag) return; if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) onPick(tokens[drag.i]); drag = null; };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    const rs = new ResizeObserver(() => { W = el.clientWidth; H = el.clientHeight; }); rs.observe(el);
    el.kick = (pred, power) => bodies.current.forEach(b => { if (pred(b)) { b.vy -= power * (.7 + Math.random() * .6); b.vx += (Math.random() - .5) * power * .6; } });
    return () => { cancelAnimationFrame(raf); io.disconnect(); rs.disconnect(); };
  }, [tokens, onPick]);

  useEffect(() => { if (filter !== 'All') box.current.kick?.(b => b.g === filter, 1100); }, [filter]);
  useEffect(() => { if (shakeKey) box.current.kick?.(() => true, 1500); }, [shakeKey]);

  return (
    <div className="jar" ref={box} data-cursor="Grab">
      {tokens.map((t, i) => (
        <div key={t.s} ref={e => (els.current[i] = e)} className={`token g${GROUPS.indexOf(t.g)} ${filter !== 'All' && filter !== t.g ? 'dim' : ''} ${picked?.s === t.s ? 'picked' : ''}`}
          style={{ width: `${Math.min(78, 30 + t.n * 8) * 2}px`, '--fs': `${Math.min(78, 30 + t.n * 8) * .3}px` }}>
          <span>{t.s}</span>
        </div>
      ))}
      <div className="jar-hint mono">Drag · throw · click for details</div>
    </div>
  );
}

export default function Skills() {
  useTitle('Skills');
  const [filter, setFilter] = useState('All'), [shake, setShake] = useState(0);
  const [picked, setPicked] = useState(null);
  const onPick = useMemo(() => t => setPicked(t), []);
  const used = picked ? usage(picked.s) : [];
  return (
    <>
      <section className="page-head">
        <CharField className="head-field" />
        <div className="ph-meta mono"><span>03 — Skills</span><span>{Object.values(skillGroups).flat().length} tools in the jar</span></div>
        <h1 className="ph-word"><Wipe text="SKILLS" fit maxH={.3} /></h1>
        <p className="ph-lede rv">No progress bars, no made-up percentages. Every token is a tool I’ve shipped with, and it gets bigger the more of my projects (and my work at CityScene Global) use it. Grab one and throw it.</p>
      </section>
      <section className="skills section">
        <div className="sk-bar rv">
          <div className="chips">
            {['All', ...GROUPS].map(g => <button key={g} className={filter === g ? 'on' : ''} onClick={() => setFilter(g)}>{g}</button>)}
          </div>
          <button className="btn small" onClick={() => setShake(s => s + 1)}>Shake the jar ⤳</button>
        </div>
        <div className="sk-wrap">
          <Jar filter={filter} shakeKey={shake} onPick={onPick} picked={picked} />
          <aside className={`sk-info ${picked ? 'on' : ''}`} aria-live="polite">
            {picked ? (
              <>
                <span className="mono">{picked.g}</span>
                <h3>{picked.s}</h3>
                <p>{used.length ? `Used in ${used.length} place${used.length > 1 ? 's' : ''}:` : 'Part of the toolkit — used in coursework and experiments.'}</p>
                <div className="sk-used">{used.map(u => <Link key={u.name} to={u.to} label={u.name}>{u.name} ↗</Link>)}</div>
                <button className="mono" onClick={() => setPicked(null)}>Close ✕</button>
              </>
            ) : <p className="mono">Click a token to see where it’s been used.</p>}
          </aside>
        </div>
      </section>
      <section className="toolbox section">
        <Label n="+">The full toolbox, as a list</Label>
        <div className="tb-grid">
          {GROUPS.map((g, i) => (
            <div key={g} className="tb rv" style={{ '--i': i }}>
              <div className="tb-head">
                <span className={`sw g${i}`} />
                <h3>{g}</h3>
                <span className="mono tb-count">{String(skillGroups[g].length).padStart(2, '0')}</span>
              </div>
              <ul>
                {skillGroups[g].map((s, k) => {
                  const n = usage(s).length;
                  return (
                    <li key={s} style={{ '--k': k }}>
                      <span>{s}</span>
                      <i className="tb-bar" style={{ '--n': Math.min(1, n / 6) }} />
                      <span className="mono">{n ? `${n}×` : '—'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="mono tb-note">Number = how many projects (and my CityScene Global work) use it</p>
      </section>
    </>
  );
}
