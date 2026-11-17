// Tiny signed-distance scenes, one per project, rendered as ASCII on the covers.
// Each returns brightness 0..1 for a point (x, y), y in [-1, 1], x scaled by aspect.
const { abs, sin, cos, sqrt, atan2, max, min, exp, hypot, PI, floor } = Math;
const glow = (d, w = .05) => exp(-((d / w) ** 2));
const fill = (d, soft = .02) => d < 0 ? 1 : max(0, 1 - d / soft);
const box = (x, y, w, h, r = 0) => { const qx = abs(x) - w + r, qy = abs(y) - h + r; return hypot(max(qx, 0), max(qy, 0)) + min(max(qx, qy), 0) - r; };
const shade = (x, y, z) => max(0, -.5 * x - .5 * y + .7 * z);
const hash = (a, b) => { const s = sin(a * 127.1 + b * 311.7) * 43758.5453; return s - floor(s); };

export const scenes = {
  notch(x, y, t) {
    const pill = box(x, y + .72, .55 + .08 * sin(t * 1.4), .13, .13);
    let v = fill(pill) * .95 + glow(pill, .06) * .5;
    // music bars inside the open notch
    if (abs(y + .72) < .09 && abs(x) < .4) { const k = floor((x + .4) / .08); v = max(v * .3, abs(y + .72) < .03 + .05 * abs(sin(t * 4 + k * 1.7)) ? 1 : .2); }
    // menu-bar dots + a dock
    const dock = box(x, y - .78, .7, .09, .09);
    v = max(v, fill(dock) * .55 + glow(dock, .04) * .3);
    for (let i = -3; i <= 3; i++) v = max(v, fill(hypot(x - i * .19, y - .78) - .055) * (i === floor(sin(t) * 3.5) ? 1 : .8));
    return max(v, .05 + .05 * sin(x * 3 + y * 2 + t));
  },
  gear(x, y, t) {
    const r = hypot(x, y), a = atan2(y, x) + t * .5;
    const teeth = .62 + .1 * (sin(a * 10) > 0 ? 1 : 0);
    let v = r < teeth && r > .28 ? shade(x, y, sqrt(max(0, 1 - r * r))) * .7 + .35 : 0;
    v += glow(r - .2, .03) * .9;
    const r2 = hypot(x - .62, y + .55), a2 = atan2(y + .55, x - .62) - t * 1;
    if (r2 < .25 + .05 * (sin(a2 * 8) > 0 ? 1 : 0) && r2 > .1) v = max(v, .75);
    for (let i = 0; i < 5; i++) { const sx = sin(i * 2.4 + t * .7) * .9, sy = ((i * .37 + t * .3) % 2) - 1; v = max(v, glow(hypot(x - sx, y + sy), .04)); }
    return v;
  },
  rails(x, y, t) {
    if (y < -.15) { const hz = glow(y + .15, .04); return .05 + hz * .5 + (hash(floor(x * 20), floor(y * 14)) > .97 ? .7 : 0); }
    const depth = (y + .15) / 1.15, w = .05 + depth * .9;
    let v = .04;
    for (const s of [-1, 1]) v = max(v, glow(x - s * w * .55, .015 + depth * .02));
    const z = 1 / max(.05, depth), sleeper = (z + t * 3) % 1;
    if (abs(x) < w * .7 && sleeper < .18) v = max(v, .45 * depth + .1);
    const train = hypot(x, (y + .1) * 3);
    v = max(v, glow(train, .06 + .02 * sin(t * 6)) * 1.1);
    return v;
  },
  ghost(x, y, t) {
    y += .06 * sin(t * 1.6);
    const head = hypot(x, y + .15) - .48, body = box(x, y - .25, .48, .4);
    const hem = y - (.62 + .07 * sin(x * 14 + t * 4));
    let d = min(head, max(body, hem));
    let v = fill(d, .03) * (.55 + .4 * shade(x, y, .6)) + glow(d, .07) * .35;
    for (const s of [-1, 1]) if (hypot(x - s * .17, (y + .18) * .8) < .09) v = .02;
    if (box(x, y + .0, .1, .045 + .03 * abs(sin(t * 2)), .04) < 0) v = .02;
    return max(v, .04);
  },
  pulse(x, y, t) {
    const hx = x * 1.15, hy = -y * 1.1 + .1;
    const heart = (hx * hx + hy * hy - .3) ** 3 - hx * hx * hy ** 3;
    const beat = 1 + .06 * max(0, sin(t * 6)) ** 8;
    let v = heart * beat < 0 ? .45 + .5 * shade(x, y, .7) : 0;
    const p = ((x + 1.2 + t * .8) % 2.4) - 1.2, ecg = .75 + (abs(p) < .12 ? -sin(p * 26) * .25 : 0);
    v = max(v, glow(y - ecg, .025) * .95);
    return max(v, .04);
  },
  grid(x, y, t) {
    const gx = floor((x + 1) * 4), gy = floor((y + 1) * 5), fx = ((x + 1) * 4) % 1, fy = ((y + 1) * 5) % 1;
    const on = hash(gx, gy + floor(t * 1.5)) > .7;
    let v = (fx < .08 || fy < .08) ? .35 : on ? .75 : .1;
    if (gy === 0) v = (fx < .08) ? .35 : .9;
    return v;
  },
  hex(x, y, t) {
    const a = atan2(y, x) + t * .4, r = hypot(x, y);
    const hexd = r * cos(((a % (PI / 3)) + PI / 3) % (PI / 3) - PI / 6) - .55;
    let v = fill(hexd, .02) * (.35 + .5 * shade(x, y, .5)) + glow(hexd, .05) * .6;
    const sword = box(x * cos(.8) + y * sin(.8), -x * sin(.8) + y * cos(.8), .04, .55) ;
    v = max(v, fill(sword) * .98);
    const guard = box(x * cos(.8) + y * sin(.8), -x * sin(.8) + y * cos(.8) - .25, .16, .03);
    v = max(v, fill(guard));
    return max(v, glow(r - .82 - .03 * sin(a * 6 + t * 3), .02) * .6);
  },
  terminal(x, y, t) {
    const row = floor((y + .9) / .16), fx = (x + .85);
    if (row < 0 || row > 10) return .04;
    const len = .4 + hash(row, 3) * 1.2, shown = row < (t * 2) % 12;
    if (row === 0) return fx < .25 ? .95 : fx < len ? .5 : .04;
    let v = shown && fx > .15 && fx < len ? (hash(floor(fx * 18), row) > .25 ? .55 : .1) : .04;
    if (fx < .08 && shown) v = .9;
    if (row === floor((t * 2) % 12) && fx > len + .03 && fx < len + .12 && sin(t * 8) > 0) v = 1;
    return v;
  },
  cross(x, y, t) {
    const c = min(box(x, y, .14, .45, .04), box(x, y, .45, .14, .04));
    let v = fill(c) * (.6 + .4 * shade(x, y, .7)) + glow(c, .05) * .4;
    const r = hypot(x, y * 2.6), ring = glow(r - .82, .03);
    const a = atan2(y * 2.6, x) - t * 1.2;
    v = max(v, ring * (.4 + .5 * (sin(a) > .9 ? 1 : 0)));
    return max(v, .04);
  },
  bridge(x, y, t) {
    let v = .04;
    const arch = .35 - .7 * (1 - x * x);
    v = max(v, glow(y - arch, .025));
    v = max(v, glow(y - .35, .02) * .9);
    if (y > arch && y < .35 && abs((x * 8) % 1) < .07) v = max(v, .45);
    v = max(v, (y > .45 ? .1 + .25 * glow(sin(x * 10 + t * 2) * .03 + .55 - y, .02) : 0));
    const car = ((t * .4) % 2.4) - 1.2;
    v = max(v, glow(hypot(x - car, y - .3), .05));
    return v;
  },
  beam(x, y, t) {
    let v = .04;
    for (const s of [-1, 1]) { const dish = hypot(x - s * .82, y) - .22; v = max(v, fill(dish) * .7 * (abs(x - s * .82) > .1 || 1)); }
    if (abs(x) < .8) { const w = .03 + .02 * sin(x * 30 - t * 9); v = max(v, glow(y + .02 * sin(x * 7 + t * 3), w) * (.8 + .2 * sin(x * 40 - t * 20))); }
    if (hash(floor(x * 25 + t * 10), floor(y * 18)) > .985) v = max(v, .6);
    return v;
  },
  orb(x, y, t) {
    const r = hypot(x, y), z = sqrt(max(0, 1 - (r / .62) ** 2));
    let v = r < .62 ? .1 + shade(x / .62, y / .62, z) * .85 : glow(r - .62, .05) * .5;
    for (const s of [-1, 1]) if (hypot(x - s * .2, y + .08) < .055 && sin(t * 2.2) < .95) v = .02;
    if (abs(y - .2) < .025 && abs(x) < .14 + .06 * abs(sin(t * 7))) v = .02;
    const ring = glow(hypot(x, y * 3.2) - .85, .02);
    return max(v, ring * .7);
  },
  page(x, y, t) {
    const pg = box(x, y, .5, .72, .02);
    let v = pg < 0 ? .5 : glow(pg, .03) * .4;
    if (pg < 0 && x > .3 && y < -.52 && (x - .3) > (y + .72)) v = .85;
    if (pg < 0 && abs(((y + .5) * 7) % 1) < .12 && x < .3 && y > -.4) v = .25;
    const p = (t * .35) % 1, sx = -.35 + p * .7, sy = .35 + .05 * sin(p * 20);
    if (pg < 0 && y > .28 && y < .42 && x < sx && abs(y - (.35 + .05 * sin(((x + .35) / .7) * 20))) < .025) v = .98;
    v = max(v, glow(hypot(x - sx, y - sy), .04));
    return max(v, .04);
  },
  bowl(x, y, t) {
    let v = .04;
    if (y > .05 && y < .55 && hypot(x, y - .05) < .7) v = .45 + .45 * shade(x, -y, .6);
    v = max(v, glow(y - .05, .02) * (abs(x) < .7 ? 1 : 0));
    for (let i = -1; i <= 1; i++) { const sx = i * .25 + .06 * sin(y * 9 + t * 2 + i); if (y < -.05 && y > -.85) v = max(v, glow(x - sx, .03) * (1 + y) * .9); }
    return v;
  },
};

// Render a scene into a canvas with ASCII cells. ramp: 'ember' | 'cream' | 'ink'
import { getAtlas } from './atlas';
export function renderArt(canvas, scene, t, ramp, cell = [7, 10]) {
  const dpr = Math.min(devicePixelRatio || 1, 2), [cw, ch] = cell;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  if (!W || !H) return;
  if (canvas.width !== Math.round(W * dpr)) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
  const ctx = canvas.getContext('2d'), atlas = getAtlas(cw, ch, dpr, cw * 1.3);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.floor(W / cw), rows = Math.floor(H / ch), asp = W / H, fn = scenes[scene] || scenes.orb;
  const ox = (W - cols * cw) / 2, oy = (H - rows * ch) / 2;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = ((c + .5) / cols * 2 - 1) * asp, y = (r + .5) / rows * 2 - 1;
    const b = fn(x, y, t);
    if (b > .03) atlas.draw(ctx, b, .25 + b * .7, ramp, ox + c * cw, oy + r * ch);
  }
}
