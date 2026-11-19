// "Ember core" boot loader: an ASCII planet with a text ring, a boot log,
// an implosion into a spark, then the whole screen breaks into falling pixels.
import { getAtlas, PAL, clamp, ease, reduced } from './atlas';

const KEY = 'hd-intro-seen';
const T = { sphereIn: .25, implode: 3.05, flash: 3.6, dissolve: 3.75, dissolveLen: 1.25 };
const LOG = [
  'HD/OS 26.11 — cold boot',
  '> mounting /work ............... ok',
  '> linking github/hardikdhingra150 ..... ok',
  '> warming the ember core ......... ok',
  '> rendering portfolio',
];
const RING = ' HARDIK DHINGRA ✦ DEVELOPER ✦ BUILDER ✦ GURUGRAM ✦';

export function shouldPlayIntro() {
  if (reduced()) return false;
  try { return !sessionStorage.getItem(KEY); } catch { return true; }
}

export function playIntro({ onReveal, onDone }) {
  const html = document.documentElement;
  const finish = () => { html.classList.remove('booting'); onReveal(); onDone(); };
  if (!shouldPlayIntro()) { finish(); return; }

  const dpr = Math.min(devicePixelRatio || 1, 2), CW = 8, CH = 12;
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:block;width:100vw;height:100vh;cursor:pointer';
  const ctx = cv.getContext('2d');
  const frame = document.createElement('canvas'), fctx = frame.getContext('2d');
  let W, H, cols, rows, cells, atlas, sparks = [], parts = [], blocks = null, rem, rctx;
  const savedOverflow = html.style.overflow; html.style.overflow = 'hidden';

  function size() {
    W = innerWidth; H = innerHeight;
    for (const c of [cv, frame]) { c.width = W * dpr; c.height = H * dpr; }
    cols = Math.ceil(W / CW); rows = Math.ceil(H / CH);
    cells = new Float32Array(cols * rows * 3);
    for (let i = 0; i < cols * rows; i++) {
      const r = Math.floor(i / cols);
      cells[i * 3] = Math.random() * .33 + (r / rows) * .15;                 // appear time
      cells[i * 3 + 1] = Math.random() < .5 ? .03 + Math.random() * .1 : 0;  // dust
      cells[i * 3 + 2] = Math.random();                                      // jitter seed
    }
  }

  let t = 0, last = 0, raf, done = false, revealed = false, jitterT = -1;
  const skip = () => { if (t < T.dissolve) t = T.dissolve; };
  const onKey = e => { if (e.type === 'pointerdown' || e.key) skip(); };
  addEventListener('pointerdown', onKey, true); addEventListener('keydown', onKey, true);
  const onResize = () => { if (!blocks) size(); };
  addEventListener('resize', onResize);

  function sphere(px, py, cx, cy, R, rot, glow) {
    const dx = (px - cx) / R, dy = (py - cy) / R, d2 = dx * dx + dy * dy;
    if (d2 >= 1) {
      const halo = Math.exp(-(((Math.sqrt(d2) - 1) / .08) ** 2)) * .5 * (1 + glow);
      return halo > .04 ? [halo, .45 + glow * .3] : null;
    }
    const z = Math.sqrt(1 - d2);
    // tilt then spin
    const tl = .38, y1 = dy * Math.cos(tl) - z * Math.sin(tl), z1 = dy * Math.sin(tl) + z * Math.cos(tl);
    const lon = Math.atan2(dx, z1) + rot, lat = Math.asin(clamp(y1, -1, 1));
    const land = Math.sin(lon * 3 + 1.3) * Math.cos(lat * 4) + .6 * Math.sin(lon * 7 - lat * 5) * Math.sin(lat * 3 + lon);
    const grid = (Math.abs(Math.sin(lon * 6)) < .07 || Math.abs(Math.sin(lat * 7)) < .07) ? .22 : 0;
    const diff = Math.max(0, -.45 * dx - .55 * dy + .7 * z);
    const rim = (1 - z) ** 3 * .6;
    const b = .08 + diff * (land > .25 ? .95 : .55) + grid + rim + glow * .6;
    return [b, .3 + diff * .45 + rim * .3 + glow * .5];
  }

  function draw() {
    const cx = W / 2, cy = H / 2, base = Math.min(W, H) * .27;
    const grow = ease(clamp((t - T.sphereIn) / .9));
    const imp = clamp((t - T.implode) / (T.flash - T.implode));
    const shrink = 1 - imp ** 2.2 * (1 + .25 * Math.sin(imp * Math.PI));
    const R = base * grow * Math.max(0, shrink);
    const rot = t * .9 + imp * imp * 9;
    const glow = imp ** 1.5;
    const flash = Math.max(0, 1 - Math.abs(t - T.flash) / .18);
    const jt = Math.floor(t * 12);
    fctx.setTransform(1, 0, 0, 1, 0, 0);
    fctx.fillStyle = PAL.bg; fctx.fillRect(0, 0, frame.width, frame.height);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, a = clamp((t - cells[i * 3]) / .15);
      if (a <= 0) continue;
      const px = c * CW + CW / 2, py = r * CH + CH / 2;
      let b = cells[i * 3 + 1] * (1 - glow * .5), p = .05, ramp = 'cream';
      if (R > 1) {
        const s = sphere(px, py, cx, cy, R, rot, glow);
        if (s) { b = Math.max(b, s[0]); p = s[1]; ramp = 'ember'; }
      }
      if (flash > 0) { const d = Math.hypot(px - cx, py - cy) / (Math.min(W, H) * .5); b = Math.max(b, flash * Math.max(0, 1 - d) ** 2); if (b > .2) { ramp = 'ember'; p = .9; } }
      if (b <= 0) continue;
      const jit = (((cells[i * 3 + 2] * 9301 + jt * 49297) % 233280) / 233280 - .5) * .14;
      b = clamp(b + (b > .02 ? jit : 0)) * (r & 1 ? .85 : 1);
      fctx.globalAlpha = a * (.35 + .65 * b);
      atlas.draw(fctx, b, p, ramp, c * CW, r * CH);
    }
    fctx.globalAlpha = 1;
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // text ring
    if (R > 2) {
      const rx = R * 1.55, ry = R * .34, tilt = -.2, n = RING.length * 2;
      fctx.font = '600 12px "JetBrains Mono", monospace'; fctx.textAlign = 'center'; fctx.textBaseline = 'middle';
      for (let k = 0; k < n; k++) {
        const ph = k / n * Math.PI * 2 + t * .55 + imp * imp * 6;
        const ex = Math.cos(ph) * rx, ey = Math.sin(ph) * ry;
        const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt), y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt);
        const front = Math.sin(ph) > 0;
        if (!front && Math.hypot(x - cx, y - cy) < R) continue;
        fctx.globalAlpha = (front ? 1 : .35) * grow * (1 - imp);
        fctx.fillStyle = front ? PAL.cream : PAL.ember;
        fctx.fillText(RING[k % RING.length], x, y);
      }
    }
    // boot log
    fctx.globalAlpha = clamp(1 - imp * 1.5);
    fctx.font = '500 12px "JetBrains Mono", monospace'; fctx.textAlign = 'left'; fctx.textBaseline = 'top';
    let chars = Math.floor(t * 70);
    LOG.forEach((line, i) => {
      const s = line.slice(0, Math.max(0, chars)); chars -= line.length + 8;
      fctx.fillStyle = i === 0 ? PAL.ember : PAL.cream;
      if (s) fctx.fillText(s + (chars < 0 && chars > -line.length - 8 && (t * 3 | 0) % 2 ? '▌' : ''), 20, 22 + i * 18);
    });
    // counter
    const pct = Math.round(clamp(t / T.flash) ** .8 * 100);
    fctx.globalAlpha = clamp(t * 2) * clamp(1 - glow * .3);
    fctx.textAlign = 'right'; fctx.textBaseline = 'alphabetic'; fctx.fillStyle = PAL.ember;
    fctx.font = `700 ${Math.min(160, W * .14)}px "Bricolage Grotesque", Impact, sans-serif`;
    fctx.fillText(String(pct).padStart(3, '0'), W - 20, H - 16);
    fctx.font = '500 11px "JetBrains Mono", monospace'; fctx.fillStyle = PAL.cream; fctx.textAlign = 'left';
    fctx.fillText('CLICK OR PRESS ANY KEY TO SKIP', 20, H - 22);
    fctx.fillStyle = 'rgba(239,229,208,.15)'; fctx.fillRect(20, H - 44, Math.min(260, W * .5), 3);
    fctx.fillStyle = PAL.ember; fctx.fillRect(20, H - 44, Math.min(260, W * .5) * pct / 100, 3);
    // sparks
    for (const s of sparks) {
      const age = t - s.born; if (age < 0) continue;
      s.x += s.vx * dtLast; s.y += s.vy * dtLast; s.vx *= .97; s.vy *= .97;
      const tw = .65 + .35 * Math.sin(age * s.f * 6.283 + s.ph), fade = clamp(age / .2);
      fctx.globalAlpha = fade * tw; fctx.fillStyle = age > .5 ? '#ffe6cf' : PAL.ember;
      fctx.shadowColor = fctx.fillStyle; fctx.shadowBlur = 4 + s.size * .35;
      fctx.font = `${s.size * (.75 + .25 * tw) * fade}px system-ui, "Segoe UI Symbol", sans-serif`;
      fctx.textAlign = 'center'; fctx.textBaseline = 'middle'; fctx.fillText('✦', s.x, s.y);
    }
    fctx.shadowBlur = 0; fctx.globalAlpha = 1;
  }

  function spawnSparks() {
    const n = Math.round(W * H / 9000);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, sp = 120 + Math.random() * 900;
      sparks.push({ x: W / 2, y: H / 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 7 + 46 * Math.random() ** 3.2, born: T.flash + Math.random() * .12, f: 2 + Math.random() * 3, ph: Math.random() * 6 });
    }
  }

  function startDissolve() {
    cv.style.pointerEvents = 'none';
    rem = document.createElement('canvas'); rem.width = frame.width; rem.height = frame.height; rctx = rem.getContext('2d');
    rctx.drawImage(frame, 0, 0);
    const img = rctx.getImageData(0, 0, rem.width, rem.height).data;
    const B = 12, bw = Math.ceil(W / B), bh = Math.ceil(H / B);
    const seeds = [{ x: W / 2, y: H / 2, s: 120 }, ...sparks.map(s => ({ x: s.x, y: s.y, s: s.size }))];
    blocks = []; let maxD = 1;
    for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
      const x = i * B + B / 2, y = j * B + B / 2; let d = 1e9;
      for (const s of seeds) d = Math.min(d, Math.max(0, Math.hypot(x - s.x, y - s.y) - 1.2 * s.s) / (1 + s.s / 30));
      maxD = Math.max(maxD, d); blocks.push({ i, j, d });
    }
    for (const b of blocks) {
      b.delay = (.72 * b.d / maxD + .15 * Math.random()) * T.dissolveLen;
      let r = 0, g = 0, bl = 0;
      for (const [ox, oy] of [[.5, .5], [.2, .2], [.8, .2], [.2, .8], [.8, .8]]) {
        const k = (Math.floor((b.j * B + oy * B) * dpr) * rem.width + Math.floor((b.i * B + ox * B) * dpr)) * 4;
        r += img[k] || 0; g += img[k + 1] || 0; bl += img[k + 2] || 0;
      }
      b.c = [r / 5, g / 5, bl / 5]; b.lum = (.2126 * b.c[0] + .7152 * b.c[1] + .0722 * b.c[2]) / 255;
    }
    blocks.sort((a, b) => a.delay - b.delay); blocks.ptr = 0; blocks.B = B;
    for (const s of sparks) s.burstAt = T.dissolve + (Math.hypot(s.x - W / 2, s.y - H / 2) / Math.hypot(W, H)) * T.dissolveLen * .7;
  }

  function dissolve(dt) {
    const dtime = t - T.dissolve, B = blocks.B;
    while (blocks.ptr < blocks.length && blocks[blocks.ptr].delay <= dtime) {
      const b = blocks[blocks.ptr++];
      rctx.clearRect(b.i * B * dpr, b.j * B * dpr, B * dpr, B * dpr);
      if (b.lum > .3) {
        const n = b.lum > .6 ? 2 : 1, s = B / n;
        for (let a = 0; a < n; a++) for (let c = 0; c < n; c++) parts.push({ x: b.i * B + a * s, y: b.j * B + c * s, s, vx: (Math.random() - .5) * 280, vy: -60 - Math.random() * 220, life: 1, col: `rgb(${b.c.map(Math.round).join(',')})` });
      }
    }
    for (const s of sparks) if (!s.burst && s.burstAt <= t) {
      s.burst = true;
      for (let k = 0; k < 6 + s.size / 5; k++) parts.push({ x: s.x, y: s.y, s: 2 + Math.random() * 3, vx: (Math.random() - .5) * 360, vy: (Math.random() - .7) * 360, life: 1, col: Math.random() < .5 ? '#fff' : '#ffb38f', glow: 1 });
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(rem, 0, 0);
    if (dtime < T.dissolveLen * .6) for (let k = 0; k < 3; k++) {
      const h = (6 + Math.random() * 26) * dpr, y = Math.random() * cv.height, off = (Math.random() < .5 ? -1 : 1) * (10 + Math.random() * 40) * dpr;
      ctx.drawImage(rem, 0, y, cv.width, h, off, y, cv.width, h);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const p of parts) {
      p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) continue;
      ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
      if (p.glow) { ctx.shadowColor = p.col; ctx.shadowBlur = 8; } else ctx.shadowBlur = 0;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    parts = parts.filter(p => p.life > 0 && p.y < H + 40);
  }

  let dtLast = 0;
  function tick(now) {
    const dt = last ? Math.min(.1, (now - last) / 1000) : 0; last = now; dtLast = dt; t += dt;
    if (t >= T.flash && !sparks.length) spawnSparks();
    if (t < T.dissolve) {
      draw();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(frame, 0, 0);
      if (!cv.isConnected) { html.appendChild(cv); }
      html.classList.remove('booting');
    } else {
      if (!sparks.length) spawnSparks();
      if (!blocks) { draw(); startDissolve(); }
      dissolve(dt);
      if (!revealed && t > T.dissolve + T.dissolveLen * .25) { revealed = true; onReveal(); }
      if (t > T.dissolve + T.dissolveLen && blocks.ptr >= blocks.length && !parts.length) return end();
    }
    raf = requestAnimationFrame(tick);
  }

  function end() {
    if (done) return; done = true;
    cancelAnimationFrame(raf); cv.remove();
    removeEventListener('pointerdown', onKey, true); removeEventListener('keydown', onKey, true); removeEventListener('resize', onResize);
    html.style.overflow = savedOverflow; html.classList.remove('booting');
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    if (!revealed) onReveal();
    onDone();
  }

  size();
  const go = () => { atlas = getAtlas(CW, CH, dpr, 11); raf = requestAnimationFrame(tick); };
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 600))]).then(go);
}

export function replayIntro() {
  try { sessionStorage.removeItem(KEY); } catch {}
  location.href = '/';
}
