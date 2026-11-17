import React, { useEffect, useRef } from 'react';
import { me, now } from '../data';
import { Link } from '../router';
import { Wipe, Label, LitText, Arrow, useTitle } from '../ui';
import { getAtlas, PAL } from '../fx/atlas';

function AsciiPortrait() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d'), img = new Image();
    const dpr = Math.min(devicePixelRatio || 1, 2), CW = 7, CH = 10;
    let lum = null, cols, rows, W, H, raf, t0 = performance.now(), mouse = { x: -999, y: -999, in: false }, vis = true;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const build = () => {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      cols = Math.floor(W / CW); rows = Math.floor(H / CH);
      const s = document.createElement('canvas'); s.width = cols; s.height = rows;
      const sx = s.getContext('2d', { willReadFrequently: true });
      // cover-crop, biased a little toward the top (faces live there)
      const ia = img.width / img.height, ca = (cols * CW) / (rows * CH);
      let w = img.width, h = img.height, x = 0, y = 0;
      if (ia > ca) { w = h * ca; x = (img.width - w) / 2; } else { h = w / ca; y = (img.height - h) * .25; }
      sx.drawImage(img, x, y, w, h, 0, 0, cols, rows);
      const d = sx.getImageData(0, 0, cols, rows).data; lum = new Float32Array(cols * rows);
      let lo = 1, hi = 0;
      for (let i = 0; i < cols * rows; i++) { const v = (.2126 * d[i * 4] + .7152 * d[i * 4 + 1] + .0722 * d[i * 4 + 2]) / 255; lum[i] = v; lo = Math.min(lo, v); hi = Math.max(hi, v); }
      for (let i = 0; i < lum.length; i++) lum[i] = Math.pow((lum[i] - lo) / (hi - lo || 1), 1.15);
    };
    const draw = now => {
      const t = (now - t0) / 1000, atlas = getAtlas(CW, CH, dpr, 9.5);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      const scan = still ? rows : Math.min(rows, t * 70);
      for (let r = 0; r < rows; r++) {
        if (r > scan) break;
        for (let c = 0; c < cols; c++) {
          const px = c * CW + CW / 2, py = r * CH + CH / 2;
          let b = lum[r * cols + c], ramp = 'cream', p = .3 + b * .6;
          if (mouse.in) {
            const d = Math.hypot(px - mouse.x, py - mouse.y), f = Math.exp(-d / 110);
            b += Math.sin(d * .09 - t * 7) * .28 * f; if (f > .25) { ramp = 'ember'; p = .45 + b * .5; }
          }
          if (r > scan - 3) { ramp = 'ember'; b = Math.max(b, .7); }
          ctx.globalAlpha = .45 + .55 * Math.min(1, b);
          atlas.draw(ctx, b, p, ramp, c * CW, r * CH);
        }
      }
      ctx.globalAlpha = 1;
      if (mouse.in && img.complete) { // a lens of the real photo
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.save(); ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 58, 0, 7); ctx.clip();
        const ia = img.width / img.height, ca = W / H; let w = img.width, h = img.height, x = 0, y = 0;
        if (ia > ca) { w = h * ca; x = (img.width - w) / 2; } else { h = w / ca; y = (img.height - h) * .25; }
        ctx.filter = 'grayscale(1) contrast(1.1)'; ctx.drawImage(img, x, y, w, h, 0, 0, W, H); ctx.filter = 'none'; ctx.restore();
        ctx.strokeStyle = PAL.ember; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 58, 0, 7); ctx.stroke();
      }
      if (vis && (!still || mouse.in)) raf = requestAnimationFrame(draw);
    };
    img.onload = () => { build(); raf = requestAnimationFrame(draw); };
    img.src = '/hardik.jpeg';
    const mv = e => { const b = cv.getBoundingClientRect(); mouse = { x: e.clientX - b.left, y: e.clientY - b.top, in: true }; if (still) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } };
    const lv = () => { mouse.in = false; };
    cv.addEventListener('pointermove', mv); cv.addEventListener('pointerleave', lv);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && lum) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } });
    io.observe(cv);
    const ro = new ResizeObserver(() => { if (img.complete && img.naturalWidth) build(); }); ro.observe(cv);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="portrait" role="img" aria-label="Portrait of Hardik Dhingra drawn in text characters" data-cursor="Look" />;
}

export default function About() {
  useTitle('About');
  return (
    <>
      <section className="page-head">
        <div className="ph-meta mono"><span>05 — About</span><span>{me.city}</span></div>
        <h1 className="ph-word"><Wipe text="ABOUT" fit maxH={.4} /></h1>
      </section>
      <section className="about section">
        <div className="ab-portrait rv">
          <AsciiPortrait />
          <span className="mono">FIG. 01 — Hover to look closer</span>
        </div>
        <div className="ab-copy">
          <LitText className="ab-lead" text="Hey, I’m Hardik. I’m a computer science student at Dronacharya College of Engineering, and I learn best with my hands on the build." />
          <p className="rv">I build web apps, backends, macOS software and AI tools, and I take rough ideas all the way to something people can actually use. React and TypeScript up front; Python, FastAPI and Node behind; Swift when it has to feel native.</p>
          <p className="rv">I’m drawn to problems that touch everyday life: healthcare that reaches people earlier, railways that see conflicts coming, developer tools that make errors less scary. I’m happiest on a team where ideas are shared freely and everyone grows along the way.</p>
          <dl className="facts rv">
            <div><dt className="mono">Based in</dt><dd>{me.city}</dd></div>
            <div><dt className="mono">Studying</dt><dd>B.Tech CSE, 2024 – present</dd></div>
            <div><dt className="mono">Building</dt><dd>Notchi, SkillForge, GhostAPI</dd></div>
            <div><dt className="mono">Looking for</dt><dd>Internships & collaborations</dd></div>
          </dl>
          <div className="ab-links rv">
            <a className="btn solid" href={me.resume} target="_blank" rel="noreferrer">Download résumé <Arrow d="down" /></a>
            <Link to="/contact" className="btn">Get in touch <Arrow d="e" /></Link>
          </div>
        </div>
      </section>
      <section className="principles section">
        <Label n="+">How I work</Label>
        <div className="pr-grid">
          {[['Build', 'Get something real on screen fast. Ideas get clearer once they exist.'], ['Test', 'Put it in front of people and real data. Find where it breaks.'], ['Learn', 'Read the failure closely. Most of my best features started as bugs.'], ['Go again', 'Iterate until it earns its place. Then start the next one.']].map(([h, d], i) => (
            <div key={h} className="pr rv" style={{ '--i': i }}><span className="mono">0{i + 1}</span><h3>{h}.</h3><p>{d}</p></div>
          ))}
        </div>
      </section>
      <section className="offline section">
        <Label n="+">Off the keyboard</Label>
        <div className="off-row">{now.offline.map((o, i) => <span key={o} className="rv" style={{ '--i': i }}>{o}</span>)}</div>
      </section>
    </>
  );
}
