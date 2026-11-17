import React, { useEffect, useRef, useState } from 'react';
import { me } from '../data';
import { Link } from '../router';
import { Wipe, Arrow, AsciiArt, useClock, useTitle } from '../ui';
import { getAtlas } from '../fx/atlas';

/* a field of dim characters that flare up around the cursor */
function Field() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), CW = 12, CH = 18;
    let W, H, cols, rows, seed, raf, m = { x: -999, y: -999 }, trail = [];
    const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; cols = Math.ceil(W / CW); rows = Math.ceil(H / CH); seed = Float32Array.from({ length: cols * rows }, Math.random); };
    size();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = now => {
      const t = now / 1000, atlas = getAtlas(CW, CH, dpr, 13);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      trail = trail.filter(p => t - p.t < .9);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c, px = c * CW + CW / 2, py = r * CH + CH / 2;
        let b = seed[i] < .35 ? .05 + .06 * Math.sin(t * 1.5 + seed[i] * 40) : 0;
        for (const p of trail) { const d = Math.hypot(px - p.x, py - p.y), age = t - p.t; b = Math.max(b, Math.exp(-d / 60) * (1 - age / .9) * .9); }
        if (b > .03) atlas.draw(ctx, b, .3 + b * .6, b > .2 ? 'ember' : 'cream', c * CW, r * CH);
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    const mv = e => { const b = cv.getBoundingClientRect(); trail.push({ x: e.clientX - b.left, y: e.clientY - b.top, t: performance.now() / 1000 }); if (trail.length > 40) trail.shift(); };
    addEventListener('pointermove', mv); addEventListener('resize', size);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', mv); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="field" aria-hidden="true" />;
}

export default function Contact() {
  useTitle('Contact');
  const time = useClock(), [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(me.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); };
  return (
    <section className="contact">
      <Field />
      <div className="ct-in">
        <div className="ph-meta mono"><span>07 — Contact</span><span><i className="dot" />{me.available}</span></div>
        <h1 className="ct-word"><Wipe text="SAY HELLO" fit maxH={.36} step={.05} /></h1>
        <div className="ct-grid">
          <div className="ct-mail rv">
            <span className="mono">The fastest way to reach me</span>
            <a href={`mailto:${me.email}`} className="mail" data-cursor="Write">{me.email}</a>
            <button className={`btn small ${copied ? 'ok' : ''}`} onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
          </div>
          <div className="ct-links rv" style={{ '--i': 1 }}>
            <a href={me.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><Arrow /></a>
            <a href={me.github} target="_blank" rel="noreferrer"><span>GitHub</span><Arrow /></a>
            <a href="https://pypi.org/project/errorbuddy/" target="_blank" rel="noreferrer"><span>PyPI</span><Arrow /></a>
            <a href={me.resume} target="_blank" rel="noreferrer"><span>Résumé (PDF)</span><Arrow d="down" /></a>
          </div>
          <div className="ct-time rv" style={{ '--i': 2 }}>
            <span className="mono">My local time</span>
            <strong>{time}</strong>
            <span className="dim">{me.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NotFound() {
  useTitle('Lost');
  return (
    <section className="nf">
      <AsciiArt scene="ghost" ramp="ember" cell={[9, 13]} className="nf-art" />
      <h1 className="ph-word"><Wipe text="404" /></h1>
      <p>This page wandered off. It happens to the best of us.</p>
      <Link to="/" className="btn solid">Take me home <Arrow d="e" /></Link>
    </section>
  );
}
