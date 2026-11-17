// Shared ASCII glyph atlas: every character in every shade, pre-rendered once.
export const RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
export const STEPS = 16;
export const PAL = { bg: '#0b0907', ember: '#ff6b35', cream: '#efe5d0', ink: '#1a120c' };

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
function ramp(stops) {
  const out = [];
  for (let i = 0; i < STEPS; i++) {
    const p = (i / (STEPS - 1)) * (stops.length - 1), k = Math.min(stops.length - 2, Math.floor(p));
    out.push(`rgb(${mix(stops[k], stops[k + 1], p - k).join(',')})`);
  }
  return out;
}
const E = hex(PAL.ember), C = hex(PAL.cream), B = hex(PAL.bg), W = [255, 255, 255], K = [0, 0, 0];
export const RAMPS = {
  ember: ramp([mix(E, B, .8), mix(E, K, .4), E, mix(E, W, .5), W]),
  cream: ramp([mix(E, B, .85), mix(C, B, .62), C, W]),
  ink: ramp([mix(C, K, .05), mix(E, K, .25), mix(E, K, .6), [12, 8, 6]]), // for light backgrounds
};
export const RAMP_ROW = { ember: 0, cream: 1, ink: 2 };

const cache = new Map();
export function getAtlas(cw, ch, dpr, px = 11) {
  const key = `${cw}x${ch}@${dpr}/${px}`;
  if (cache.has(key)) return cache.get(key);
  const cv = document.createElement('canvas');
  const rows = Object.keys(RAMPS).length * STEPS;
  cv.width = RAMP.length * cw * dpr; cv.height = rows * ch * dpr;
  const x = cv.getContext('2d');
  x.scale(dpr, dpr);
  x.font = `600 ${px}px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`;
  x.textAlign = 'center'; x.textBaseline = 'middle';
  Object.values(RAMPS).forEach((cols, ri) => cols.forEach((col, si) => {
    x.fillStyle = col;
    for (let c = 1; c < RAMP.length; c++) x.fillText(RAMP[c], c * cw + cw / 2, (ri * STEPS + si) * ch + ch / 2 + .5);
  }));
  const atlas = {
    cv, cw, ch, dpr,
    // draw char (brightness b 0-1, ramp position p 0-1) at css px x,y. ctx must have identity transform.
    draw(ctx, b, p, ramp, X, Y) {
      const ci = Math.round(Math.max(0, Math.min(1, b)) * (RAMP.length - 1));
      if (ci <= 0) return;
      const row = RAMP_ROW[ramp] * STEPS + Math.round(Math.max(0, Math.min(1, p)) * (STEPS - 1));
      ctx.drawImage(cv, ci * cw * dpr, row * ch * dpr, cw * dpr, ch * dpr, X * dpr, Y * dpr, cw * dpr, ch * dpr);
    },
  };
  cache.set(key, atlas);
  return atlas;
}

export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
