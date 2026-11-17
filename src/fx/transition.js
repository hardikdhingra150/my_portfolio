// Page transition: a diagonal sweep of characters covers the screen, the destination
// name flashes in the middle, then the characters peel away to reveal the new page.
import { getAtlas, PAL, clamp, reduced } from './atlas';

let busy = false;
export function wipe(label, swap) {
  if (reduced() || busy) { swap(); return Promise.resolve(); }
  busy = true;
  const dpr = Math.min(devicePixelRatio || 1, 2), CW = 10, CH = 15;
  const W = innerWidth, H = innerHeight, cols = Math.ceil(W / CW), rows = Math.ceil(H / CH);
  const cv = document.createElement('canvas');
  cv.width = W * dpr; cv.height = H * dpr;
  cv.style.cssText = 'position:fixed;inset:0;z-index:2147483600;width:100vw;height:100vh;pointer-events:auto';
  cv.setAttribute('aria-hidden', 'true');
  document.documentElement.appendChild(cv);
  const ctx = cv.getContext('2d'), atlas = getAtlas(CW, CH, dpr, 13);
  const delay = new Float32Array(cols * rows), seed = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = r * cols + c;
    delay[i] = (c / cols) * .34 + (r / rows) * .14 + Math.random() * .09;
    seed[i] = Math.random();
  }
  const IN = .62, HOLD = .26, OUT = .62, CELL = .11;
  let t = 0, last = 0, swapped = false;
  return new Promise(resolve => {
    function tick(now) {
      const dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now; t += dt;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      const outT = t - IN - HOLD;
      for (let i = 0; i < cols * rows; i++) {
        let s;
        if (outT < 0) s = clamp((t - delay[i]) / CELL);
        else s = 1 - clamp((outT - delay[i]) / CELL);
        if (s <= 0) continue;
        const x = (i % cols) * CW, y = Math.floor(i / cols) * CH;
        ctx.fillStyle = PAL.bg; ctx.globalAlpha = s;
        ctx.fillRect(x * dpr, y * dpr, CW * dpr + 1, CH * dpr + 1);
        // fresh cells flash bright, settled cells fade to dim dust
        const edge = 1 - Math.abs(s * 2 - 1);
        const b = s < 1 ? .35 + edge * .6 : (seed[i] < .45 ? .06 + seed[i] * .1 : 0);
        if (b > 0) { ctx.globalAlpha = 1; atlas.draw(ctx, b, s < 1 ? .55 + edge * .4 : .1, s < 1 && seed[i] < .7 ? 'ember' : 'cream', x, y); }
      }
      ctx.globalAlpha = 1;
      if (t > IN - .05 && !swapped) { swapped = true; swap(); }
      const la = clamp(Math.min((t - IN + .1) / .15, (IN + HOLD + .1 - t) / .15));
      if (la > 0 && label) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalAlpha = la; ctx.fillStyle = PAL.ember; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `400 ${Math.min(W * .16, 190)}px Anton, Impact, sans-serif`;
        ctx.fillText(label.toUpperCase(), W / 2, H / 2 + (1 - la) * 20);
        ctx.font = '500 11px "JetBrains Mono", monospace'; ctx.fillStyle = PAL.cream;
        ctx.fillText('→ LOADING PAGE', W / 2, H / 2 + Math.min(W * .16, 190) * .62);
        ctx.globalAlpha = 1;
      }
      if (outT > .34 + .14 + .09 + CELL) { cv.remove(); busy = false; resolve(); return; }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
