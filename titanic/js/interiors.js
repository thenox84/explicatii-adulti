"use strict";
/* =====================================================================
   INTERIORS — interior sets for the Titanic film (stage 1600 × 900).
   Every set is  fn(parent, o) → group g  with
     g.anim(at)     ambient motion; call every frame (at = ambient seconds)
     g.anchors      named points [x, y]; y is the floor where feet stand
     g.front        (some sets) a SIBLING group that must be drawn OVER the
                    characters: add the characters, then call g.raiseFront()
   Everything is drawn a bit beyond 1600 × 900 for camera moves.
   All helper names start with "itr" (no collisions with other files).
   ===================================================================== */

/* ---------- small shared helpers ---------- */
function itrClip(d) { const id = uid('ic'); const cp = E('clipPath', { id }, DEFS); E('path', { d }, cp); return 'url(#' + id + ')'; }
function itrVignette(p, k = .45, cy = .45) {
  return E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: rgrad([[0, '#000', 0], [.66, '#000', 0], [1, '#000', k]], .5, cy, .75), 'pointer-events': 'none' }, p);
}
function itrGlow(p, cx, cy, rx, ry, col, a = .5) { return E('ellipse', { cx, cy, rx, ry, fill: rgrad([[0, col, a], [.45, col, a * .45], [1, col, 0]]) }, p); }
function itrFront(g, parent) {
  g.front = G(parent);
  g.raiseFront = () => { if (g.front.parentNode) g.front.parentNode.appendChild(g.front); };
}
/* starfield; stars twinkle in 6 groups (cheap) */
function itrStars(p, x, y, w, h, n, seed = 1, o = {}) {
  const g = G(p); const grp = [0, 1, 2, 3, 4, 5].map(() => G(g));
  for (let i = 0; i < n; i++) {
    const hx = hash(i * 1.37 + seed * 9.1), hy = hash(i * 2.71 + seed * 3.3), hr = hash(i * 4.13 + seed * 1.9);
    const sx = x + hx * w, sy = y + Math.pow(hy, o.pow || 1) * h, r = (o.r || 1) * (.45 + Math.pow(hr, 5) * 2.4);
    const col = hr > .94 ? '#FFE3B0' : hr < .07 ? '#BFD4FF' : '#FFFFFF';
    E('circle', { cx: f2(sx), cy: f2(sy), r: f2(r), fill: col }, grp[i % 6]);
    if (r > 2.2 && o.glint !== false) E('path', { d: `M${f2(sx - r * 3.4)},${f2(sy)} H${f2(sx + r * 3.4)} M${f2(sx)},${f2(sy - r * 3.4)} V${f2(sy + r * 3.4)}`, stroke: col, 'stroke-width': .9, 'stroke-opacity': .65 }, grp[i % 6]);
  }
  g.anim = at => grp.forEach((s, i) => s.setAttribute('opacity', f2(.62 + .38 * Math.sin(at * (.8 + i * .37) + i * 2.1))));
  return g;
}
/* crystal chandelier hanging from (x,y); chain L; returns group with .anim */
function itrChandelier(p, x, y, L = 40, s = 1, seed = 0) {
  const g = G(p); tf(g, x, y);
  E('ellipse', { cx: 0, cy: 1, rx: 14 * s, ry: 4 * s, fill: '#C9A045' }, g);
  const sw = G(g);
  itrGlow(sw, 0, L + 26 * s, 95 * s, 70 * s, '#FFE2A0', .42);
  E('rect', { x: -1.6 * s, y: 0, width: 3.2 * s, height: L, fill: '#9C7A34' }, sw);
  const b = G(sw); tf(b, 0, L, 0, s);
  E('path', { d: 'M-9,0 H9 L6,9 H-6 Z', fill: '#B88E3A' }, b);
  E('ellipse', { cx: 0, cy: 12, rx: 22, ry: 5, fill: '#D6AE4F' }, b);
  E('path', { d: 'M0,10 Q-20,14 -36,30 M0,10 Q-10,18 -18,32 M0,10 V33 M0,10 Q10,18 18,32 M0,10 Q20,14 36,30', stroke: '#C9A045', 'stroke-width': 2.6, fill: 'none' }, b);
  E('ellipse', { cx: 0, cy: 33, rx: 38, ry: 7, fill: '#B88E3A' }, b);
  E('ellipse', { cx: 0, cy: 31.5, rx: 38, ry: 5, fill: '#E8C96E' }, b);
  /* crystal drops */
  for (let i = 0; i < 9; i++) { const dx = -32 + i * 8, dl = 8 + (4 - Math.abs(i - 4)) * 3.2;
    E('path', { d: `M${dx},38 V${38 + dl}`, stroke: '#EAF6FF', 'stroke-width': 1, 'stroke-opacity': .7 }, b);
    E('path', { d: `M${dx},${38 + dl} l-2.6,3.5 l2.6,4.5 l2.6,-4.5 Z`, fill: i % 2 ? '#DDF2FF' : '#FFFFFF' }, b); }
  E('path', { d: 'M-16,38 Q0,64 16,38 Z', fill: '#C9A045' }, b);
  E('path', { d: 'M0,60 l-4,6 l4,8 l4,-8 Z', fill: '#FFFFFF' }, b);
  /* candle bulbs */
  [-36, -18, 0, 18, 36].forEach((cx, i) => { const cy = i === 2 ? 22 : (Math.abs(cx) > 20 ? 28 : 30);
    E('rect', { x: cx - 2.5, y: cy - 8, width: 5, height: 8, rx: 1.5, fill: '#FFF7E6' }, b);
    E('circle', { cx, cy: cy - 11, r: 7, fill: '#FFE7A8', 'fill-opacity': .35 }, b);
    E('ellipse', { cx, cy: cy - 11, rx: 2.8, ry: 4, fill: '#FFF4C8' }, b); });
  E('path', { d: 'M-20,12 Q0,8 20,12', stroke: '#FFF2C4', 'stroke-width': 1.5, 'stroke-opacity': .6, fill: 'none' }, b);
  const ph = hash(seed + 3) * 6, amp = 1.2 + hash(seed) * .8;
  g.anim = at => sw.setAttribute('transform', `rotate(${f2(Math.sin(at * .9 + ph) * amp)})`);
  return g;
}
/* wall sconce (bracket + shaded bulb + glow) */
function itrSconce(p, x, y, s = 1, shadeC = '#F3D7A6') {
  const g = G(p); tf(g, x, y, 0, s);
  itrGlow(g, 0, -6, 46, 40, '#FFE2A0', .45);
  E('path', { d: 'M0,6 Q-2,-2 0,-8', stroke: '#B88E3A', 'stroke-width': 3, fill: 'none' }, g);
  E('ellipse', { cx: 0, cy: 7, rx: 5, ry: 3, fill: '#C9A045' }, g);
  E('path', { d: 'M-8,-4 L8,-4 L5,-16 L-5,-16 Z', fill: shadeC }, g);
  E('path', { d: 'M1,-4 L8,-4 L5,-16 L2,-16 Z', fill: '#000', 'fill-opacity': .08 }, g);
  return g;
}
/* potted palm (Kentia); origin = bottom of pot; returns group with .anim */
function itrPalm(p, x, y, s = 1, seed = 0, potC = '#B88E3A') {
  const g = G(p); tf(g, x, y, 0, s);
  const fr = G(g);
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a = (-162 + i * (144 / (n - 1)) + (hash(i + seed) - .5) * 12) * Math.PI / 180, len = 92 + hash(i * 3 + seed) * 40;
    const S = [0, -58], T = [Math.cos(a) * len, -58 + Math.sin(a) * len * .55 + len * .3], Cp = [Math.cos(a) * len * .45, -58 + Math.sin(a) * len * 1.05];
    const col = i % 2 ? '#3E8C4A' : '#2F7340', col2 = i % 2 ? '#4FA35A' : '#3A8A4C';
    E('path', { d: `M${S[0]},${S[1]} Q${f2(Cp[0])},${f2(Cp[1])} ${f2(T[0])},${f2(T[1])}`, stroke: '#2A5E33', 'stroke-width': 2.6, fill: 'none' }, fr);
    let d = '';
    for (let k = 2; k < 15; k++) { const t = k / 15, u = 1 - t;
      const px = u * u * S[0] + 2 * u * t * Cp[0] + t * t * T[0], py = u * u * S[1] + 2 * u * t * Cp[1] + t * t * T[1];
      const tx = 2 * u * (Cp[0] - S[0]) + 2 * t * (T[0] - Cp[0]), ty = 2 * u * (Cp[1] - S[1]) + 2 * t * (T[1] - Cp[1]), tl = Math.hypot(tx, ty) || 1;
      const nx = -ty / tl, ny = tx / tl, ll = 20 * (1 - t * .7);
      [-1, 1].forEach(sd => { d += `M${f2(px)},${f2(py)} Q${f2(px + nx * sd * ll * .5 + tx / tl * ll * .3)},${f2(py + ny * sd * ll * .5 + ty / tl * ll * .3 + 3)} ${f2(px + nx * sd * ll * .7 + tx / tl * ll * .6)},${f2(py + ny * sd * ll * .7 + ty / tl * ll * .6 + 9)} `; });
    }
    E('path', { d, stroke: hash(i * 7 + seed) > .5 ? col : col2, 'stroke-width': 4.2, fill: 'none', 'stroke-linecap': 'round' }, fr);
  }
  E('path', { d: 'M-2,-2 Q-4,-30 0,-60', stroke: '#6B4A2B', 'stroke-width': 5, fill: 'none' }, g);
  E('path', { d: 'M-30,-44 H30 L24,-4 Q22,0 18,0 H-18 Q-22,0 -24,-4 Z', fill: potC }, g);
  E('path', { d: 'M8,-44 H30 L24,-4 Q22,0 18,0 H4 Z', fill: '#000', 'fill-opacity': .14 }, g);
  E('rect', { x: -34, y: -50, width: 68, height: 9, rx: 4, fill: shade(potC, .15) }, g);
  E('path', { d: 'M-26,-30 H26', stroke: shade(potC, .3), 'stroke-width': 2, opacity: .7 }, g);
  const ph = hash(seed + 11) * 5;
  g.anim = at => fr.setAttribute('transform', `rotate(${f2(Math.sin(at * .8 + ph) * 1.6)} 0 -58)`);
  return g;
}
/* brass porthole; glass shows a night (or dusk/day) sea view */
function itrPorthole(p, x, y, r, o = {}) {
  const g = G(p); tf(g, x, y);
  const mode = o.mode || 'night';
  const glass = { night: [[0, '#0B1230'], [.56, '#1C2A55'], [.58, '#0A1226'], [1, '#04070F']], dusk: [[0, '#5B5E9E'], [.56, '#F0A884'], [.58, '#3D4F86'], [1, '#1E2A50']], day: [[0, '#6FB7E8'], [.56, '#CDEBF5'], [.58, '#2F7DB0'], [1, '#174E78']] }[mode];
  E('circle', { r: r + r * .32 + 2, fill: '#000', 'fill-opacity': .18, cx: 2, cy: 3 }, g);
  E('circle', { r: r + r * .32, fill: o.ring || '#B8893A' }, g);
  E('circle', { r: r + r * .16, fill: o.ring2 || '#D9B25C' }, g);
  E('circle', { r, fill: lgrad(glass) }, g);
  if (mode === 'night') for (let i = 0; i < Math.max(3, r / 3); i++) { const a = hash(i * 3.1 + x) * Math.PI * 2, d = Math.sqrt(hash(i * 7.7 + y)) * r * .8;
    const sx = Math.cos(a) * d, sy = -Math.abs(Math.sin(a) * d) * .9; E('circle', { cx: f2(sx), cy: f2(sy), r: .9, fill: '#fff', 'fill-opacity': .8 }, g); }
  E('path', { d: `M${f2(-r * .62)},${f2(-r * .2)} A${r * .66},${r * .66} 0 0 1 ${f2(r * .1)},${f2(-r * .66)}`, stroke: '#fff', 'stroke-opacity': .28, 'stroke-width': Math.max(1.5, r * .12), fill: 'none', 'stroke-linecap': 'round' }, g);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; E('circle', { cx: f2(Math.cos(a) * (r + r * .24)), cy: f2(Math.sin(a) * (r + r * .24)), r: Math.max(.8, r * .05), fill: '#8A6526' }, g); }
  return g;
}
/* hanging caged work lamp; origin = ceiling point; .glow for flicker */
function itrCageLamp(p, x, y, L = 60, s = 1, col = '#FFD27A') {
  const g = G(p); tf(g, x, y);
  E('path', { d: `M0,0 V${L}`, stroke: '#1E1A1C', 'stroke-width': 2.5 * s }, g);
  const glow = itrGlow(g, 0, L + 16 * s, 150 * s, 120 * s, col, .4);
  const b = G(g); tf(b, 0, L, 0, s);
  E('path', { d: 'M-16,6 Q-14,-2 0,-2 Q14,-2 16,6 Z', fill: '#3C3A3E' }, b);
  E('circle', { cx: 0, cy: 14, r: 9, fill: '#FFF2C4' }, b);
  E('path', { d: 'M-10,8 Q-12,24 0,26 Q12,24 10,8 M-4,8 Q-5,24 0,26 M4,8 Q5,24 0,26', stroke: '#2B292C', 'stroke-width': 1.6, fill: 'none' }, b);
  g.glow = glow; return g;
}
/* drifting smoke puffs (funnels) */
function itrSmoke(p, x, y, o = {}) {
  const g = G(p); const n = o.n || 7, col = o.col || '#5D5862', ps = [];
  for (let i = 0; i < n; i++) { const q = G(g);
    E('circle', { r: 10, fill: col }, q); E('circle', { cx: 7, cy: 3, r: 7.5, fill: shade(col, -.12) }, q); E('circle', { cx: -4, cy: -4, r: 6.5, fill: shade(col, .16) }, q); ps.push(q); }
  const sp = o.speed || .11, dx = o.dx || -260, dy = o.dy || -150, gr = o.grow || 3, sd = o.seed || 0;
  g.anim = at => ps.forEach((q, i) => { const ph = (at * sp + i / n + sd) % 1;
    tf(q, x + dx * ph + Math.sin(at * .8 + i * 2) * 8 * ph, y + dy * Math.pow(ph, .65), 0, 1 + ph * gr);
    op(q, (o.a || .8) * Math.min(1, ph * 7) * (1 - ph)); });
  return g;
}
/* ship's railing between x0..x1, top at y-h, base at y */
function itrRail(p, x0, x1, y, h, col = '#E9E4D8', step = 14, w = 2) {
  let d = `M${x0},${y - h} H${x1} M${x0},${y - h * .5} H${x1}`;
  for (let x = x0; x <= x1 + .1; x += step) d += ` M${f2(x)},${y - h} V${y}`;
  return E('path', { d, stroke: col, 'stroke-width': w, fill: 'none' }, p);
}
/* lifeboat side view; origin = keel bottom centre; w = length */
function itrBoat(p, x, y, w = 90, o = {}) {
  const g = G(p); tf(g, x, y);
  const h = w * .26;
  E('path', { d: `M${-w / 2},${-h} Q${-w * .44},${-h * .15} ${-w * .3},0 L${w * .3},0 Q${w * .44},${-h * .15} ${w / 2},${-h} Z`, fill: o.hull || '#F4F1EA' }, g);
  E('path', { d: `M${-w * .46},${-h * .45} Q${-w * .4},${-h * .05} ${-w * .3},0 L${w * .3},0 Q${w * .4},${-h * .05} ${w * .46},${-h * .45} Z`, fill: '#000', 'fill-opacity': .1 }, g);
  E('rect', { x: -w / 2 - 1, y: -h - 3, width: w + 2, height: 5, rx: 2, fill: o.rail || '#9A6A3A' }, g);
  if (o.cover !== false) E('path', { d: `M${-w * .44},${-h - 3} Q0,${-h - w * .13} ${w * .44},${-h - 3} Z`, fill: o.coverC || '#E2D7BC' }, g);
  E('path', { d: `M${-w * .2},${-h * .55} H${w * .2}`, stroke: '#000', 'stroke-opacity': .12, 'stroke-width': 2 }, g);
  return g;
}
/* quadrant davit (side view), standing at (x,y), arm reaching dir (+1/-1) */
function itrDavit(p, x, y, hgt = 40, dir = 1, col = '#E2DCCD') {
  return E('path', { d: `M${x},${y} V${y - hgt * .55} Q${x},${y - hgt} ${x + dir * hgt * .32},${y - hgt} V${y - hgt * .78}`, stroke: col, 'stroke-width': Math.max(2.5, hgt * .085), fill: 'none', 'stroke-linecap': 'round' }, p);
}
/* layer label: brass-framed enamel plaque, origin = top centre (works with show()) */
function itrPlaque(p, x, y, text, o = {}) {
  const g = N(p, x, y); const size = o.size || 21, w = o.w || Math.round(text.length * size * .55 + 46), h = Math.round(size * 1.85);
  if (o.chain) E('path', { d: `M${-w * .3},${-o.chain} V2 M${w * .3},${-o.chain} V2`, stroke: '#4B4033', 'stroke-width': 2.2, 'stroke-dasharray': '3 2' }, g);
  E('rect', { x: -w / 2 + 3, y: 5, width: w, height: h, rx: 9, fill: '#000', 'fill-opacity': .32 }, g);
  E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 9, fill: o.frame || '#C9A045' }, g);
  E('rect', { x: -w / 2 + 2, y: 1, width: w - 4, height: h * .4, rx: 8, fill: '#FFF1C0', 'fill-opacity': .35 }, g);
  E('rect', { x: -w / 2 + 4, y: 4, width: w - 8, height: h - 8, rx: 6, fill: o.fill || '#1E2A4A' }, g);
  E('rect', { x: -w / 2 + 4, y: 4, width: w - 8, height: (h - 8) * .45, rx: 6, fill: '#fff', 'fill-opacity': .07 }, g);
  [-1, 1].forEach(s => E('circle', { cx: s * (w / 2 - 11), cy: h / 2, r: 2.6, fill: '#F0D27E' }, g));
  TX(g, 0, h / 2 + size * .36, text, size, o.color || '#FFF1D0', { a: 'middle', w: 800, ls: .6 });
  g.w = w; g.h = h;
  return g;
}

/* =====================================================================
   1) shipCutaway(parent, o) — the "layer cake": the ship in side view,
      hull cut open.  o.sky: 'dusk' (default) | 'day' | 'night'
      o.labels: false hides the plaques.
   Returns g with:
     g.anim(at)
     g.focus(name, k)   dim every layer except `name` (k 0..1); name null = none
                        names: 'boat' | 'first' | 'second' | 'third' | 'boiler'
     g.signs            { first, second, third, boiler, engine } plaques (N-groups,
                        usable with show(node, t, tIn, tOut, {pop:1}))
     g.layers           { name: [x0, y0, x1, y1] } box of every layer
     g.anchors = {
       boat:   { floor:213, x:[90,1540] },                     (character scale ≈ .14)
       first:  { floor:370, x:[70,1545], bath, stairs, lounge, pool:[x,y] }   (scale ≈ .30)
       second: { floor:500, x:[60,1555], dining, library, cabins }           (scale ≈ .27)
       third:  { floor:630, x:[55,1555], dance, dining, cabins }             (scale ≈ .27)
       boiler: { floor:855, x:[170,1500], engine, catwalk:[x,y], stokers:[[x,y]×6] } (scale ≈ .42)
     }
   ===================================================================== */
function shipCutaway(parent, o = {}) {
  const g = G(parent), A = [];
  const mode = o.sky || 'dusk', night = mode === 'night';
  const SKY = { day: [[0, '#4F9FDB'], [.65, '#9ED2EE'], [1, '#D8EEF5']], dusk: [[0, '#2C3A76'], [.4, '#6E5A98'], [.75, '#D9837A'], [1, '#F6B97C']], night: [[0, '#060A1A'], [.6, '#121A36'], [1, '#222C55']] }[mode];
  const SEA = { day: [[0, '#2D7AAE'], [1, '#0F3858']], dusk: [[0, '#4A5A92'], [1, '#141D3C']], night: [[0, '#101A38'], [1, '#03060E']] }[mode];
  const WIN = night ? '#FFD98A' : mode === 'dusk' ? '#FFD08A' : '#BFD6E2';
  const winSky = { day: [[0, '#79BDE8'], [1, '#CFEAF5']], dusk: [[0, '#7A64A0'], [1, '#F2A27E']], night: [[0, '#0B1230'], [1, '#26305A']] }[mode];

  /* ---------- sky, clouds, sea ---------- */
  E('rect', { x: -300, y: -300, width: 2200, height: 960, fill: lgrad(SKY) }, g);
  if (night) { const st = itrStars(g, -300, -200, 2200, 560, 260, 4); A.push(st.anim); }
  const clouds = [];
  if (!night) for (let i = 0; i < 5; i++) { const c = G(g), cw = 120 + hash(i + 3) * 120;
    [[0, 0, cw * .32], [cw * .28, -12, cw * .26], [cw * .55, 2, cw * .2], [-cw * .25, 6, cw * .2]].forEach(([cx, cy, r]) => E('ellipse', { cx, cy, rx: r, ry: r * .42, fill: mode === 'day' ? '#FFFFFF' : '#FFD2C0', 'fill-opacity': mode === 'day' ? .8 : .5 }, c));
    clouds.push({ c, y: 30 + hash(i + 7) * 90, sp: 5 + hash(i) * 6, off: hash(i + 1) * 2000 }); }
  E('rect', { x: -300, y: 640, width: 2200, height: 600, fill: lgrad(SEA) }, g);
  const waves = G(g); const wv = [];
  for (let k = 0; k < 2; k++) { let d = ''; for (let i = 0; i < 70; i++) { const x = -300 + i * 34; d += `M${x},${652 + k * 26 + (i % 3) * 6} q8,-5 16,0 `; }
    wv.push(E('path', { d, stroke: '#fff', 'stroke-opacity': night ? .12 : .22, 'stroke-width': 2, fill: 'none' }, waves)); }

  /* ---------- hull outline ---------- */
  const H = 'M36,215 L1574,215 L1559,650 Q1552,846 1452,872 L272,872 Q192,872 164,836 L142,692 Q74,690 52,612 Q33,470 36,215 Z';
  /* rudder + centre propeller (outside the hull) */
  E('path', { d: 'M120,700 L80,712 Q70,786 74,860 L122,866 Z', fill: '#7A2A26' }, g);
  E('path', { d: 'M100,706 L80,712 Q70,786 74,860 L100,863 Z', fill: '#000', 'fill-opacity': .18 }, g);
  const prop = G(g); tf(prop, 132, 806);
  E('ellipse', { cx: 0, cy: -24, rx: 9, ry: 26, fill: '#C79A4A' }, prop); E('ellipse', { cx: 0, cy: 24, rx: 9, ry: 26, fill: '#A87E36' }, prop); E('circle', { r: 8, fill: '#8A6526' }, prop);
  const I = G(g, { 'clip-path': itrClip(H) });
  E('rect', { x: 0, y: 200, width: 1600, height: 700, fill: '#2A2427' }, I);

  /* slabs (decks) */
  const slab = (y, h = 12, top = '#6B5E57') => { E('rect', { x: 0, y, width: 1600, height: h, fill: '#3A3437' }, I); E('rect', { x: 0, y, width: 1600, height: 3, fill: top }, I);
    E('rect', { x: 0, y: y + h - 2, width: 1600, height: 2, fill: '#000', 'fill-opacity': .25 }, I); };
  const part = (x, y0, y1, w = 12) => { E('rect', { x, y: y0, width: w, height: y1 - y0, fill: '#3A3437' }, I); E('rect', { x, y: y0, width: 3, height: y1 - y0, fill: '#574C4C' }, I); };
  const wall = (x0, x1, y0, y1, c) => E('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: c }, I);
  const shadeDown = (x0, x1, y0, y1, k = .22) => E('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: lgrad([[0, '#000', 0], [.6, '#000', 0], [1, '#000', k]]) }, I);
  const ceilShade = (x0, x1, y0, h = 16, k = .25) => E('rect', { x: x0, y: y0, width: x1 - x0, height: h, fill: lgrad([[0, '#000', k], [1, '#000', 0]]) }, I);
  const sky = (x, y, w, h) => E('rect', { x, y, width: w, height: h, fill: lgrad(winSky) }, I);

  /* =================== FIRST CLASS (225..375) =================== */
  const F0 = 225, F1 = 375, FF = 370;
  /* --- Turkish bath (36..345) --- */
  wall(0, 345, F0, F1, '#2F7D77');
  { let d = ''; for (let x = 6; x < 345; x += 13) d += `M${x},${F0 + 16} V${F1}`; for (let y = F0 + 22; y < F1; y += 13) d += `M0,${y} H345`;
    E('path', { d, stroke: '#28706A', 'stroke-width': 1.3 }, I); }
  wall(0, 345, 332, 362, '#235F5A'); E('rect', { x: 0, y: 330, width: 345, height: 3, fill: '#C9A045' }, I);
  wall(0, 345, F0, F0 + 16, '#7A2E2A'); { let d = ''; for (let x = 8; x < 345; x += 16) d += `M${x},${F0 + 8} l5,-5 l5,5 l-5,5 Z`; E('path', { d, fill: '#E2BE62' }, I); }
  [92, 292].forEach((cx, i) => {
    E('path', { d: `M${cx - 30},332 V286 Q${cx - 30},266 ${cx},252 Q${cx + 30},266 ${cx + 30},286 V332 Z`, fill: '#1B4A47' }, I);
    E('path', { d: `M${cx - 23},330 V288 Q${cx - 23},272 ${cx},261 Q${cx + 23},272 ${cx + 23},288 V330 Z`, fill: lgrad([[0, '#FFD08A'], [1, '#C8662A']]) }, I);
    let d = ''; for (let yy = 266; yy < 330; yy += 7) for (let xx = cx - 22; xx < cx + 23; xx += 7) d += `M${xx + ((yy / 7) % 2) * 3.5},${yy} m-2.4,0 a2.4,2.4 0 1 0 4.8,0 a2.4,2.4 0 1 0 -4.8,0 `;
    E('path', { d, fill: '#173431', 'fill-opacity': .85 }, I);
    itrGlow(I, cx, 300, 80, 60, '#FFB65C', .35);
    /* lounger */
    const lx = cx - 2; E('path', { d: `M${lx - 42},${FF - 14} H${lx + 30} L${lx + 44},${FF - 36} L${lx + 50},${FF - 34} L${lx + 38},${FF - 10} H${lx - 42} Z`, fill: '#9A6A3A' }, I);
    E('path', { d: `M${lx - 40},${FF - 20} H${lx + 30} L${lx + 42},${FF - 38} L${lx + 47},${FF - 36} L${lx + 36},${FF - 15} H${lx - 40} Z`, fill: '#EFE2C4' }, I);
    E('path', { d: `M${lx - 30},${FF - 20} V${FF - 15} M${lx - 14},${FF - 20} V${FF - 15} M${lx + 2},${FF - 20} V${FF - 15} M${lx + 18},${FF - 20} V${FF - 15}`, stroke: '#C0504A', 'stroke-width': 4 }, I);
    E('path', { d: `M${lx - 38},${FF - 10} V${FF} M${lx + 34},${FF - 10} V${FF}`, stroke: '#7A4E2A', 'stroke-width': 3 }, I);
  });
  /* marble fountain with steam */
  E('path', { d: `M176,${FF} L180,${FF - 34} H210 L214,${FF} Z`, fill: '#E6E1D6' }, I);
  E('ellipse', { cx: 195, cy: FF - 36, rx: 24, ry: 6, fill: '#F2EEE6' }, I); E('ellipse', { cx: 195, cy: FF - 36, rx: 18, ry: 3.5, fill: '#7FC4C9' }, I);
  E('rect', { x: 192, y: FF - 52, width: 6, height: 16, fill: '#C9A045' }, I);
  { const st = steam(I, 3, 55, '#FFFFFF'); tf(st, 195, FF - 52); A.push(st.anim); }
  wall(0, 345, 362, F1, '#C9B79A'); { let d = ''; for (let x = 0; x < 345; x += 8) d += `M${x},362 h4 v6 h-4 Z M${x + 4},368 h4 v7 h-4 Z`; E('path', { d, fill: '#9E3A30' }, I); }
  ceilShade(0, 345, F0 + 16, 14, .3);
  part(345, F0, F1);

  /* --- Grand staircase (357..722) --- */
  wall(357, 722, F0, F1, '#BE8A55');
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { const px = 368 + c * 70, py = 246 + r * 56;
    E('rect', { x: px, y: py, width: 58, height: 46, rx: 3, fill: '#A87443' }, I); E('rect', { x: px + 3, y: py + 3, width: 52, height: 40, rx: 2, fill: '#B98350' }, I);
    E('rect', { x: px + 3, y: py + 3, width: 52, height: 2.5, fill: '#D7A774' }, I); }
  wall(357, 722, F0, F0 + 9, '#F1E4C4'); E('rect', { x: 357, y: F0 + 9, width: 365, height: 3, fill: '#C9A045' }, I);
  /* skylight opening under the dome */
  E('rect', { x: 480, y: F0 - 12, width: 130, height: 24, fill: '#FFF0C8' }, I);
  E('path', { d: `M480,${F0 + 10} L610,${F0 + 10} L700,${FF} L420,${FF} Z`, fill: lgrad([[0, '#FFF2C8', .35], [1, '#FFF2C8', 0]]) }, I);
  /* "Honour & Glory" clock panel */
  E('path', { d: 'M392,334 V268 Q392,250 420,248 Q448,250 448,268 V334 Z', fill: '#8E5E33' }, I);
  E('path', { d: 'M398,330 V270 Q398,256 420,254 Q442,256 442,270 V330 Z', fill: '#A3703F' }, I);
  E('circle', { cx: 420, cy: 280, r: 13, fill: '#F6EED8' }, I); E('circle', { cx: 420, cy: 280, r: 13, fill: 'none', stroke: '#C9A045', 'stroke-width': 2.5 }, I);
  E('path', { d: 'M420,280 V271 M420,280 L426,284', stroke: '#2B2B35', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, I);
  E('path', { d: 'M402,312 Q410,298 420,306 Q430,298 438,312 Q430,320 420,316 Q410,320 402,312 Z', fill: '#7A4E2A' }, I);
  /* the stairs: rise from (708,FF) up-left into the opening */
  { let d = `M716,${FF}`, x = 716, y = FF; for (let i = 0; i < 12; i++) { d += ` V${y - 11.5} H${x - 17}`; y -= 11.5; x -= 17; } d += ` L${x - 20},${y} L560,${FF + 4} Z`;
    E('path', { d, fill: '#8E5E33' }, I);
    let c = `M716,${FF - 1}`; x = 716; y = FF - 1; for (let i = 0; i < 12; i++) { c += ` V${y - 11.5} H${x - 17}`; y -= 11.5; x -= 17; }
    E('path', { d: c, stroke: '#A8322F', 'stroke-width': 4, fill: 'none' }, I);
    E('path', { d: `M712,${FF - 2} L${x + 4},${y - 2}`, stroke: '#6E4426', 'stroke-width': 7, 'stroke-opacity': .5 }, I); }
  /* balustrade: iron scrolls + oak handrail */
  { let d = ''; for (let i = 0; i < 12; i++) { const bx = 706 - i * 17, by = FF - 8 - i * 11.5; d += `M${bx},${by} q-6,-10 0,-18 q6,-8 0,-16 M${bx - 8},${by - 2} q5,-10 0,-17 `; }
    E('path', { d, stroke: '#2E2522', 'stroke-width': 1.8, fill: 'none' }, I);
    let dg = ''; for (let i = 0; i < 12; i++) dg += `M${704 - i * 17},${FF - 22 - i * 11.5} m-2,0 a2,2 0 1 0 4,0 a2,2 0 1 0 -4,0 `; E('path', { d: dg, fill: '#E2BE62' }, I);
    E('path', { d: `M724,${FF - 44} L${716 - 12 * 17 - 6},${FF - 44 - 12 * 11.5 - 4}`, stroke: '#7A4A26', 'stroke-width': 5, 'stroke-linecap': 'round' }, I); }
  /* newel post + cherub lamp */
  E('rect', { x: 718, y: FF - 52, width: 12, height: 52, fill: '#7A4A26' }, I); E('rect', { x: 716, y: FF - 56, width: 16, height: 6, rx: 2, fill: '#8E5E33' }, I);
  { const ch = G(I); tf(ch, 724, FF - 56);
    itrGlow(ch, 4, -34, 40, 34, '#FFE2A0', .55);
    E('ellipse', { cx: 0, cy: -10, rx: 5, ry: 8, fill: '#6E5A3A' }, ch); E('circle', { cx: 0, cy: -22, r: 4.5, fill: '#7E6844' }, ch);
    E('path', { d: 'M-3,-14 Q-12,-20 -10,-8 Z', fill: '#8E7A52' }, ch); E('path', { d: 'M2,-16 L6,-30', stroke: '#6E5A3A', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, ch);
    E('circle', { cx: 6, cy: -34, r: 4, fill: '#FFF2C4' }, ch); }
  wall(357, 722, 362, F1, '#E9DFC9'); { let d = ''; for (let x = 357; x < 722; x += 14) d += `M${x},362 h7 v6.5 h-7 Z M${x + 7},368.5 h7 v6.5 h-7 Z`; E('path', { d, fill: '#2E2A2C' }, I); }
  { const pl = itrPalm(I, 382, FF, .32, 2); A.push(pl.anim); }
  ceilShade(357, 722, F0 + 12, 12, .2);
  part(722, F0, F1);

  /* --- First-class lounge (734..1140) --- */
  wall(734, 1140, F0, F1, '#F2E4C4');
  wall(734, 1140, F0, F0 + 10, '#FFF6E0'); E('rect', { x: 734, y: F0 + 10, width: 406, height: 3, fill: '#C9A045' }, I);
  [760, 870, 986, 1100].forEach((px, i) => { if (i === 1 || i === 2) return;
    E('path', { d: `M${px - 22},344 V262 Q${px - 22},248 ${px},246 Q${px + 22},248 ${px + 22},262 V344 Z`, fill: '#E9D7AF' }, I);
    E('path', { d: `M${px - 18},340 V264 Q${px - 18},252 ${px},250 Q${px + 18},252 ${px + 18},264 V340 Z`, fill: 'none', stroke: '#C9A045', 'stroke-width': 1.6 }, I); });
  /* windows with sky */
  [[806, '#7E2B3A'], [1056, '#7E2B3A']].forEach(([wx, cc]) => {
    E('rect', { x: wx - 26, y: 250, width: 52, height: 72, rx: 3, fill: '#C9A045' }, I); sky(wx - 22, 254, 44, 64);
    if (night) itrStars(I, wx - 22, 254, 44, 40, 8, wx, { glint: false });
    E('path', { d: `M${wx},254 V318 M${wx - 22},276 H${wx + 22} M${wx - 22},298 H${wx + 22}`, stroke: '#B88E3A', 'stroke-width': 2 }, I);
    E('path', { d: `M${wx - 34},244 Q${wx - 20},250 ${wx - 24},300 Q${wx - 26},322 ${wx - 32},330 L${wx - 40},330 Q${wx - 36},290 ${wx - 40},244 Z M${wx + 34},244 Q${wx + 20},250 ${wx + 24},300 Q${wx + 26},322 ${wx + 32},330 L${wx + 40},330 Q${wx + 36},290 ${wx + 40},244 Z`, fill: cc }, I);
    E('rect', { x: wx - 44, y: 240, width: 88, height: 6, rx: 3, fill: '#B88E3A' }, I); });
  /* fireplace + mirror */
  E('path', { d: 'M900,254 Q900,240 931,238 Q962,240 962,254 V300 H900 Z', fill: '#C9A045' }, I);
  E('path', { d: 'M905,256 Q905,245 931,243 Q957,245 957,256 V296 H905 Z', fill: lgrad([[0, '#E4EEF0'], [1, '#B9C8CE']]) }, I);
  E('path', { d: 'M912,290 L930,250 M926,292 L944,252', stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 3 }, I);
  E('rect', { x: 892, y: 304, width: 78, height: 7, rx: 2, fill: '#F2EEE6' }, I);
  E('rect', { x: 898, y: 311, width: 66, height: 55, fill: '#E9E4DA' }, I);
  E('path', { d: 'M902,320 q14,8 6,22 M950,316 q-8,14 4,26', stroke: '#C9C2B4', 'stroke-width': 1.3, fill: 'none' }, I);
  E('path', { d: 'M913,366 V334 Q913,322 931,322 Q949,322 949,334 V366 Z', fill: '#2A1E1A' }, I);
  const fire = G(I); E('path', { d: 'M918,366 Q920,346 926,352 Q928,338 934,350 Q940,342 944,366 Z', fill: '#FF9A3A' }, fire); E('path', { d: 'M924,366 Q927,354 931,358 Q935,350 938,366 Z', fill: '#FFE07A' }, fire);
  const fireGlow = itrGlow(I, 931, 362, 90, 30, '#FF9A3A', .45);
  E('rect', { x: 924, y: 294, width: 14, height: 10, rx: 2, fill: '#C9A045' }, I); E('circle', { cx: 931, cy: 297, r: 3.5, fill: '#FFF6E0' }, I);
  [906, 956].forEach(cx => { E('rect', { x: cx - 1.5, y: 290, width: 3, height: 14, fill: '#C9A045' }, I); E('ellipse', { cx, cy: 287, rx: 2, ry: 3, fill: '#FFE7A8' }, I); });
  /* tables + armchairs */
  const tableS = (tx, cloth = '#FBF8F0') => {
    [-1, 1].forEach(s => { const cx = tx + s * 30; E('path', { d: `M${cx - 11 * s},${FF} V${FF - 34} Q${cx - 11 * s},${FF - 44} ${cx},${FF - 44} Q${cx + 11 * s},${FF - 44} ${cx + 11 * s},${FF - 34} V${FF - 16} Z`, fill: '#B85C6A' }, I);
      E('rect', { x: Math.min(cx - 13 * s, cx + 13 * s), y: FF - 18, width: 26, height: 8, rx: 3, fill: '#A04E5B' }, I); E('path', { d: `M${cx - 10},${FF - 10} V${FF} M${cx + 10},${FF - 10} V${FF}`, stroke: '#B88E3A', 'stroke-width': 2 }, I); });
    E('path', { d: `M${tx - 22},${FF - 30} H${tx + 22} L${tx + 25},${FF - 12} H${tx - 25} Z`, fill: cloth }, I);
    E('rect', { x: tx - 24, y: FF - 32, width: 48, height: 4, rx: 2, fill: '#FFFFFF' }, I);
    E('rect', { x: tx - 2, y: FF - 12, width: 4, height: 12, fill: '#7A4A26' }, I);
    E('rect', { x: tx - 9, y: FF - 42, width: 4, height: 10, rx: 1, fill: '#DCEBFA', 'fill-opacity': .8 }, I); E('rect', { x: tx + 4, y: FF - 40, width: 8, height: 8, rx: 2, fill: '#E86A7A' }, I); };
  tableS(806); tableS(1056);
  wall(734, 1140, 362, F1, '#3F5A3A'); { let d = ''; for (let x = 740; x < 1140; x += 18) d += `M${x},368 l4,-3 l4,3 l-4,3 Z`; E('path', { d, fill: '#C9A045', 'fill-opacity': .7 }, I); }
  shadeDown(734, 1140, F0, 362, .12);
  part(1140, F0, F1);

  /* --- swimming pool (1152..1575) --- */
  wall(1152, 1600, F0, F1, '#E6F0F1');
  { let d = ''; for (let x = 1156; x < 1600; x += 12) d += `M${x},${F0} V${F1}`; for (let y = F0 + 6; y < F1; y += 12) d += `M1152,${y} H1600`; E('path', { d, stroke: '#CFE1E4', 'stroke-width': 1.2 }, I); }
  E('rect', { x: 1152, y: 286, width: 448, height: 9, fill: '#3E8FB0' }, I); E('rect', { x: 1152, y: 298, width: 448, height: 3, fill: '#3E8FB0' }, I);
  wall(1152, 1600, F0, F0 + 8, '#FFFFFF');
  [1200, 1300, 1400].forEach(px => { E('path', { d: `M${px - 24},286 V258 Q${px - 24},240 ${px},238 Q${px + 24},240 ${px + 24},258 V286 Z`, fill: '#D2E5E9' }, I); });
  { const lb = G(I); tf(lb, 1300, 262); E('circle', { r: 14, fill: '#F2EEE6' }, lb); E('circle', { r: 7.5, fill: '#D2E5E9' }, lb);
    [0, 90, 180, 270].forEach(a => E('path', { d: 'M0,-14 A14,14 0 0 1 7,-12.1 L3.75,-6.5 A7.5,7.5 0 0 0 0,-7.5 Z', fill: '#D9443F', transform: `rotate(${a + 20})` }, lb)); }
  /* shower */
  E('path', { d: 'M1166,232 V300 M1166,232 H1178', stroke: '#B88E3A', 'stroke-width': 3, fill: 'none' }, I); E('path', { d: 'M1172,236 h14 l-3,6 h-8 Z', fill: '#C9A045' }, I);
  /* pool basin */
  E('rect', { x: 1184, y: 326, width: 300, height: 44, fill: '#F4EEDD' }, I);
  E('rect', { x: 1190, y: 334, width: 288, height: 36, fill: lgrad([[0, '#6FD0E3'], [1, '#2C86AE']]) }, I);
  const ripple = E('path', { fill: '#BDF0F7', 'fill-opacity': .55 }, I);
  const caust = G(I); { let d = ''; for (let i = 0; i < 16; i++) { const cx = 1200 + i * 18; d += `M${cx},${350 + (i % 3) * 5} q5,-3 10,0 `; } E('path', { d, stroke: '#D8F7FB', 'stroke-opacity': .5, 'stroke-width': 1.6, fill: 'none' }, caust); }
  E('rect', { x: 1184, y: 324, width: 300, height: 5, rx: 2, fill: '#FFFFFF' }, I);
  E('path', { d: 'M1196,346 V316 Q1196,308 1204,308 Q1210,308 1210,316 V322 M1206,346 V316 Q1206,312 1212,312', stroke: '#C9A045', 'stroke-width': 2.5, fill: 'none' }, I);
  /* changing cubicles */
  [1500, 1538].forEach((cx, i) => { E('rect', { x: cx - 17, y: 286, width: 34, height: 84, fill: '#9A6A3A' }, I);
    E('path', { d: `M${cx - 15},292 Q${cx - 6},${300} ${cx - 13},${360} H${cx + 15} V292 Z`, fill: '#F4EEE6' }, I);
    let d = ''; for (let k = 0; k < 4; k++) d += `M${cx - 9 + k * 7},294 V360 `; E('path', { d, stroke: '#D9443F', 'stroke-width': 3 }, I);
    E('rect', { x: cx - 19, y: 282, width: 38, height: 5, rx: 2, fill: '#B88E3A' }, I); });
  wall(1152, 1600, 362, F1, '#BFD8DF'); { let d = ''; for (let x = 1152; x < 1600; x += 10) d += `M${x},362 h5 v13 h-5 Z`; E('path', { d, fill: '#E6F0F1' }, I); }

  /* chandeliers (first class) */
  [[540, 150, 98, .55], [836, F0 + 12, 18, .5], [1020, F0 + 12, 18, .5]].forEach(([cx, cy, L, s], i) => { const c = itrChandelier(I, cx, cy, L, s, i + 3); A.push(c.anim); });
  slab(F1);

  /* =================== SECOND CLASS (387..505) =================== */
  const S0 = 387, S1 = 505, SF = 500;
  /* --- dining saloon (36..560) --- */
  wall(0, 560, S0, S1, '#C9A06A');
  for (let x = 20; x < 560; x += 86) { E('rect', { x, y: S0 + 10, width: 9, height: S1 - S0 - 22, fill: '#B08550' }, I); E('rect', { x: x + 14, y: S0 + 30, width: 64, height: 46, rx: 3, fill: '#BF955F' }, I); }
  wall(0, 560, S0, S0 + 9, '#F1E8D4');
  [300, 420, 520].forEach(px => itrPorthole(I, px, 420, 9, { mode }));
  [360, 470].forEach(px => itrSconce(I, px, 430, .7));
  /* chairs, long table */
  for (let i = 0; i < 7; i++) { const cx = 262 + i * 42; E('path', { d: `M${cx - 9},${SF - 30} Q${cx - 9},${SF - 50} ${cx},${SF - 50} Q${cx + 9},${SF - 50} ${cx + 9},${SF - 30} Z`, fill: '#8E3B32' }, I); }
  E('rect', { x: 242, y: SF - 36, width: 300, height: 5, rx: 2, fill: '#FFFFFF' }, I);
  E('path', { d: `M244,${SF - 32} H540 L536,${SF - 16} H248 Z`, fill: '#F4EFE4' }, I);
  E('path', { d: `M262,${SF - 16} V${SF} M520,${SF - 16} V${SF}`, stroke: '#6E4426', 'stroke-width': 4 }, I);
  for (let i = 0; i < 7; i++) { const cx = 262 + i * 42; E('ellipse', { cx, cy: SF - 37, rx: 8, ry: 2, fill: '#E7E2D8' }, I); E('rect', { x: cx + 9, y: SF - 45, width: 3, height: 8, fill: '#DCEBFA', 'fill-opacity': .9 }, I); }
  /* sideboard */
  E('rect', { x: 62, y: SF - 40, width: 110, height: 40, fill: '#7A4A2A' }, I); E('rect', { x: 58, y: SF - 44, width: 118, height: 6, rx: 2, fill: '#8E5E33' }, I);
  [80, 110, 140].forEach(cx => E('rect', { x: cx - 10, y: SF - 34, width: 22, height: 26, rx: 2, fill: '#6A3E22' }, I));
  [78, 98, 150].forEach(cx => E('ellipse', { cx, cy: SF - 52, rx: 8, ry: 8, fill: '#F2EEE6' }, I));
  wall(0, 560, 492, S1, '#7A5236');
  shadeDown(0, 560, S0, 492, .15); ceilShade(0, 560, S0 + 9, 12, .2);
  part(560, S0, S1);
  /* --- library (572..1030) --- */
  wall(572, 1030, S0, S1, '#DCC497');
  for (let x = 590; x < 1030; x += 70) E('rect', { x, y: S0 + 18, width: 54, height: 70, rx: 3, fill: '#D0B47F' }, I);
  wall(572, 1030, S0, S0 + 9, '#F6EEDC');
  const books = (bx, by, bw, rows) => { E('rect', { x: bx - 6, y: by - 6, width: bw + 12, height: rows * 26 + 12, rx: 3, fill: '#6E3B27' }, I);
    for (let r = 0; r < rows; r++) { E('rect', { x: bx, y: by + r * 26, width: bw, height: 22, fill: '#3E2018' }, I); let x = bx + 1;
      while (x < bx + bw - 5) { const w = 4 + hash(x * 1.3 + r) * 4, h = 14 + hash(x + r * 7) * 7;
        E('rect', { x, y: by + r * 26 + 22 - h, width: w, height: h, fill: ['#9E3A30', '#3E6B4E', '#C9A045', '#2F4A7A', '#7A2E52', '#D9C79A'][Math.floor(hash(x * 2.1 + r) * 6)] }, I); x += w + .8; } } };
  books(594, S0 + 18, 74, 3); books(934, S0 + 18, 74, 3);
  E('rect', { x: 772, y: 404, width: 60, height: 52, rx: 2, fill: '#B88E3A' }, I); sky(776, 408, 52, 44);
  E('path', { d: 'M802,408 V452 M776,430 H828', stroke: '#B88E3A', 'stroke-width': 2 }, I);
  E('path', { d: 'M762,398 Q776,404 772,440 Q770,458 764,466 L756,466 Q760,430 756,398 Z M842,398 Q828,404 832,440 Q834,458 840,466 L848,466 Q844,430 848,398 Z', fill: '#3E6B4E' }, I);
  E('rect', { x: 752, y: 394, width: 100, height: 5, rx: 2, fill: '#8E5E33' }, I);
  /* desk + green lamp, armchairs */
  E('rect', { x: 770, y: SF - 32, width: 64, height: 6, rx: 2, fill: '#7A4A2A' }, I); E('path', { d: `M774,${SF - 26} V${SF} M830,${SF - 26} V${SF}`, stroke: '#6E4426', 'stroke-width': 4 }, I);
  E('path', { d: `M816,${SF - 32} V${SF - 46}`, stroke: '#C9A045', 'stroke-width': 2 }, I); E('path', { d: `M806,${SF - 46} H826 L822,${SF - 54} H810 Z`, fill: '#2E7A4E' }, I);
  itrGlow(I, 816, SF - 36, 34, 18, '#FFE7A8', .5);
  E('rect', { x: 786, y: SF - 38, width: 16, height: 5, fill: '#F4EFE4' }, I);
  [710, 890].forEach((cx, i) => { const s = i ? -1 : 1; E('path', { d: `M${cx - 18 * s},${SF} V${SF - 36} Q${cx - 18 * s},${SF - 48} ${cx - 6 * s},${SF - 46} L${cx + 16 * s},${SF - 18} V${SF} Z`, fill: '#3E6B4E' }, I);
    E('rect', { x: cx - 18, y: SF - 22, width: 36, height: 10, rx: 4, fill: '#35603F' }, I); });
  { const pl = itrPalm(I, 1008, SF, .26, 5, '#8E5E33'); A.push(pl.anim); }
  wall(572, 1030, 492, S1, '#8E3B32'); E('rect', { x: 572, y: 492, width: 458, height: 2, fill: '#C9A045', 'fill-opacity': .6 }, I);
  shadeDown(572, 1030, S0, 492, .12); ceilShade(572, 1030, S0 + 9, 12, .18);
  part(1030, S0, S1);
  /* --- cabins (1042..1575) --- */
  wall(1042, 1600, S0, S1, '#EFE6D2');
  [1210, 1385].forEach(x => part(x, S0, S1, 7));
  [1042, 1217, 1392].forEach((cx0, i) => {
    E('rect', { x: cx0, y: S0, width: 175, height: 10, fill: '#FBF6EA' }, I); E('rect', { x: cx0, y: 470, width: 175, height: 22, fill: '#B98350' }, I);
    itrPorthole(I, cx0 + 120, 425, 10, { mode });
    /* bunk bed */
    const bx = cx0 + 14; E('rect', { x: bx, y: 404, width: 70, height: 96, fill: '#7A4A2A' }, I);
    [[420, '#B0353A'], [462, '#2F5A8A']].forEach(([by, bl]) => { E('rect', { x: bx + 4, y: by, width: 62, height: 30, fill: '#3A2418' }, I); E('rect', { x: bx + 4, y: by + 12, width: 62, height: 16, rx: 3, fill: '#F7F3EA' }, I);
      E('rect', { x: bx + 22, y: by + 15, width: 44, height: 13, rx: 3, fill: bl }, I); E('rect', { x: bx + 6, y: by + 8, width: 16, height: 9, rx: 4, fill: '#FFFFFF' }, I); });
    E('rect', { x: bx - 2, y: 400, width: 74, height: 5, rx: 2, fill: '#8E5E33' }, I);
    /* washstand */
    E('rect', { x: cx0 + 136, y: SF - 34, width: 28, height: 34, fill: '#8E5E33' }, I); E('rect', { x: cx0 + 133, y: SF - 38, width: 34, height: 5, rx: 2, fill: '#ECE8E0' }, I);
    E('path', { d: `M${cx0 + 144},${SF - 38} V${SF - 50} Q${cx0 + 150},${SF - 56} ${cx0 + 156},${SF - 50} V${SF - 38} Z`, fill: '#F6F2EA' }, I);
    E('rect', { x: cx0 + 100, y: SF - 16, width: 26, height: 16, rx: 2, fill: ['#7A3A2A', '#5A4A30', '#2F4A5A'][i] }, I); E('path', { d: `M${cx0 + 108},${SF - 16} q5,-6 10,0`, stroke: '#3A2418', 'stroke-width': 2, fill: 'none' }, I);
  });
  wall(1042, 1600, 492, S1, '#8A6A50');
  slab(S1);

  /* =================== THIRD CLASS (517..635) =================== */
  const T0 = 517, T1 = 635, TF = 630;
  /* --- general room (36..650) --- */
  wall(0, 650, T0, T1, '#ECE5D3');
  for (let x = 12; x < 650; x += 58) E('rect', { x, y: T0, width: 7, height: T1 - T0, fill: '#D7B888' }, I);
  wall(0, 650, 585, 622, '#C99A5B'); E('rect', { x: 0, y: 582, width: 650, height: 5, fill: '#A8743F' }, I);
  { let d = ''; for (let x = 0; x < 650; x += 12) d += `M${x},588 V622 `; E('path', { d, stroke: '#B8884E', 'stroke-width': 1.2 }, I); }
  /* upright piano */
  E('rect', { x: 62, y: TF - 52, width: 70, height: 52, fill: '#4A2E22' }, I); E('rect', { x: 58, y: TF - 56, width: 78, height: 6, rx: 2, fill: '#5E3A2A' }, I);
  E('rect', { x: 64, y: TF - 30, width: 66, height: 6, fill: '#F6F2EA' }, I); { let d = ''; for (let k = 0; k < 9; k++) d += `M${68 + k * 7},${TF - 30} v3.5 `; E('path', { d, stroke: '#1E1A1C', 'stroke-width': 2.5 }, I); }
  E('rect', { x: 74, y: TF - 50, width: 46, height: 16, rx: 2, fill: '#5E3A2A' }, I);
  /* benches */
  [[250, 400], [470, 630]].forEach(([b0, b1]) => { E('rect', { x: b0, y: TF - 26, width: b1 - b0, height: 6, rx: 2, fill: '#B07A42' }, I); E('rect', { x: b0, y: TF - 50, width: b1 - b0, height: 5, rx: 2, fill: '#A06C38' }, I);
    E('rect', { x: b0, y: TF - 42, width: b1 - b0, height: 4, rx: 2, fill: '#A06C38' }, I);
    let d = ''; for (let x = b0 + 8; x < b1; x += (b1 - b0 - 16) / 3) d += `M${f2(x)},${TF - 50} V${TF} `; E('path', { d, stroke: '#7E5230', 'stroke-width': 3.5 }, I); });
  /* clock + bunting */
  E('circle', { cx: 430, cy: 556, r: 11, fill: '#6E4426' }, I); E('circle', { cx: 430, cy: 556, r: 8.5, fill: '#FBF7EE' }, I); E('path', { d: 'M430,556 V550 M430,556 L434,558', stroke: '#2B2B35', 'stroke-width': 1.5 }, I);
  const bunt = G(I); { E('path', { d: `M230,${T0 + 6} Q435,${T0 + 30} 640,${T0 + 6}`, stroke: '#7A5A3A', 'stroke-width': 1.2, fill: 'none' }, bunt);
    for (let i = 0; i < 19; i++) { const t = (i + .5) / 19, x = 230 + 410 * t, y = T0 + 6 + 24 * 4 * t * (1 - t) * .5 * 2 - 0;
      E('path', { d: `M${f2(x - 7)},${f2(y)} L${f2(x + 7)},${f2(y)} L${f2(x)},${f2(y + 13)} Z`, fill: ['#E84855', '#F7C948', '#2F6FD6', '#3BB273', '#FFFFFF'][i % 5] }, bunt); } }
  /* lanterns */
  const lanterns = [325, 545].map((lx, i) => { const l = itrCageLamp(I, lx, T0, 16, .55, '#FFC870'); return l; });
  wall(0, 650, 622, T1, '#9A7A58'); { let d = ''; for (let x = 0; x < 650; x += 22) d += `M${x},622 V635 `; E('path', { d, stroke: '#86684A', 'stroke-width': 1.5 }, I); }
  ceilShade(0, 650, T0, 14, .2);
  part(650, T0, T1);
  /* --- third-class dining (662..1030) --- */
  wall(662, 1030, T0, T1, '#ECE5D3');
  for (let x = 670; x < 1030; x += 58) E('rect', { x, y: T0, width: 7, height: T1 - T0, fill: '#D7B888' }, I);
  [720, 850, 980].forEach(px => itrPorthole(I, px, 552, 9, { mode }));
  wall(662, 1030, 585, 622, '#C99A5B'); E('rect', { x: 662, y: 582, width: 368, height: 5, fill: '#A8743F' }, I);
  E('rect', { x: 690, y: TF - 34, width: 320, height: 6, rx: 2, fill: '#A8743F' }, I); E('rect', { x: 690, y: TF - 30, width: 320, height: 4, fill: '#F2EADA' }, I);
  E('path', { d: `M700,${TF - 28} V${TF} M1000,${TF - 28} V${TF} M850,${TF - 28} V${TF}`, stroke: '#7E5230', 'stroke-width': 4 }, I);
  E('rect', { x: 684, y: TF - 14, width: 332, height: 5, rx: 2, fill: '#B07A42' }, I);
  for (let i = 0; i < 8; i++) { const cx = 712 + i * 40; E('ellipse', { cx, cy: TF - 35, rx: 9, ry: 2.2, fill: '#D9D4CA' }, I); E('rect', { x: cx + 9, y: TF - 44, width: 7, height: 9, rx: 1.5, fill: '#9AA0A8' }, I); }
  E('ellipse', { cx: 850, cy: TF - 39, rx: 14, ry: 6, fill: '#C88A4A' }, I);
  { const l = itrCageLamp(I, 846, T0, 14, .5, '#FFC870'); lanterns.push(l); }
  wall(662, 1030, 622, T1, '#9A7A58');
  part(1030, T0, T1);
  /* --- third-class cabins (1042..1575) --- */
  wall(1042, 1600, T0, T1, '#F0EBDD');
  [1220, 1400].forEach(x => part(x, T0, T1, 7));
  [1042, 1227, 1407].forEach((cx0, i) => {
    itrPorthole(I, cx0 + 140, 552, 9, { mode });
    [cx0 + 12, cx0 + 64].forEach((bx, k) => { if (k === 1 && i === 2) return; E('rect', { x: bx, y: 532, width: 46, height: 98, fill: '#B88A52' }, I);
      [[548, '#8A8F98'], [590, '#A8473E']].forEach(([by, bl]) => { E('rect', { x: bx + 3, y: by, width: 40, height: 24, fill: '#5A4630' }, I); E('rect', { x: bx + 3, y: by + 8, width: 40, height: 14, rx: 3, fill: bl }, I);
        E('rect', { x: bx + 4, y: by + 4, width: 13, height: 8, rx: 3, fill: '#F2EEE4' }, I); }); });
    E('rect', { x: cx0 + 120, y: TF - 18, width: 34, height: 18, rx: 3, fill: ['#6B4A2B', '#7A3A2A', '#4A5A3A'][i] }, I); E('rect', { x: cx0 + 120, y: TF - 12, width: 34, height: 3, fill: '#3A2418' }, I);
  });
  /* washing line */
  E('path', { d: `M1236,${T0 + 12} Q1310,${T0 + 22} 1392,${T0 + 12}`, stroke: '#7A6A5A', 'stroke-width': 1.2, fill: 'none' }, I);
  [[1256, '#E84855', 's'], [1280, '#F2EEE4', 'shirt'], [1314, '#2F6FD6', 's'], [1340, '#F7C948', 's'], [1366, '#F2EEE4', 'shirt']].forEach(([x, c, t]) => {
    const y = T0 + 14 + Math.sin((x - 1236) / 156 * Math.PI) * 8;
    if (t === 's') E('path', { d: `M${x - 3},${f2(y)} V${f2(y + 14)} Q${x - 3},${f2(y + 19)} ${x + 4},${f2(y + 19)} H${x + 6} V${f2(y + 14)} H${x + 3} V${f2(y)} Z`, fill: c }, I);
    else E('path', { d: `M${x - 9},${f2(y)} H${x + 9} L${x + 13},${f2(y + 6)} L${x + 8},${f2(y + 9)} V${f2(y + 22)} H${x - 8} V${f2(y + 9)} L${x - 13},${f2(y + 6)} Z`, fill: c }, I); });
  wall(1042, 1600, 622, T1, '#9A7A58');
  shadeDown(0, 1600, T0, 622, .1);
  slab(T1);

  /* =================== BOILER ROOMS + ENGINES (647..860) =================== */
  const B0 = 647, B1 = 860, BF = 855;
  wall(0, 1600, B0, B1, '#3A3135');
  { let d = ''; for (let x = 20; x < 1600; x += 64) d += `M${x},${B0} V${B1} `; for (let y = B0 + 40; y < B1; y += 48) d += `M0,${y} H1600 `; E('path', { d, stroke: '#2C2528', 'stroke-width': 2 }, I);
    let r = ''; for (let x = 26; x < 1600; x += 64) for (let y = B0 + 8; y < B1; y += 12) r += `M${x},${y} m-1.3,0 a1.3,1.3 0 1 0 2.6,0 a1.3,1.3 0 1 0 -2.6,0 `; E('path', { d: r, fill: '#4A3F43' }, I); }
  /* warm glow over the boiler side */
  E('rect', { x: 640, y: B0, width: 960, height: B1 - B0, fill: lgrad([[0, '#FF8A3A', 0], [1, '#FF8A3A', .18]]) }, I);
  /* --- engine room (40..640) --- */
  /* overhead steam pipe from boilers */
  E('rect', { x: 150, y: B0 + 8, width: 1400, height: 10, rx: 5, fill: '#CFC8BC' }, I); E('rect', { x: 150, y: B0 + 14, width: 1400, height: 4, fill: '#000', 'fill-opacity': .15 }, I);
  { let d = ''; for (let x = 170; x < 1550; x += 40) d += `M${x},${B0 + 8} V${B0 + 18} `; E('path', { d, stroke: '#A89F92', 'stroke-width': 2 }, I); }
  E('rect', { x: 150, y: B0 + 24, width: 1400, height: 5, rx: 2, fill: '#B5653A' }, I);
  /* cylinders */
  const CX = [250, 345, 440, 535];
  E('rect', { x: 200, y: 668, width: 384, height: 10, fill: '#3E4646' }, I);
  CX.forEach((cx, i) => { const cw = i === 0 || i === 3 ? 80 : 70;
    E('rect', { x: cx - cw / 2, y: 674, width: cw, height: 50, rx: 10, fill: '#5A6664' }, I);
    E('rect', { x: cx - cw / 2, y: 674, width: cw * .35, height: 50, rx: 10, fill: '#728080' }, I);
    E('rect', { x: cx - cw / 2, y: 688, width: cw, height: 4, fill: '#C9A045' }, I); E('rect', { x: cx - cw / 2, y: 710, width: cw, height: 4, fill: '#C9A045' }, I);
    E('ellipse', { cx, cy: 674, rx: cw / 2 - 2, ry: 5, fill: '#7E8A88' }, I); });
  /* A-frame columns */
  E('rect', { x: 196, y: 722, width: 392, height: 8, fill: '#3E4646' }, I);
  [205, 297, 393, 488, 583].forEach(x => E('path', { d: `M${x - 6},730 L${x - 12},842 H${x + 12} L${x + 6},730 Z`, fill: '#424C4C' }, I));
  /* catwalk */
  E('rect', { x: 150, y: 722, width: 440, height: 5, fill: '#5B5F66' }, I); itrRail(I, 150, 196, 722, 22, '#8A9098', 12, 2);
  /* crank pit + shaft */
  E('rect', { x: 196, y: 826, width: 392, height: 29, fill: '#2A2526' }, I);
  E('path', { d: 'M160,812 L600,816', stroke: '#8A9098', 'stroke-width': 9 }, I); E('path', { d: 'M160,810 L600,814', stroke: '#C9D1D6', 'stroke-width': 2.5 }, I);
  const eng = CX.map((cx, i) => { const rod = E('rect', { x: cx - 3, y: 724, width: 6, height: 40, fill: '#D8DEE2' }, I);
    const head = E('rect', { x: cx - 13, y: 0, width: 26, height: 10, rx: 2, fill: '#9AA2A8' }, I);
    const con = E('path', { stroke: '#B8C0C6', 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }, I);
    const crank = G(I); tf(crank, cx, 815); E('circle', { r: 22, fill: '#5A6262' }, crank); E('path', { d: 'M-20,8 A22,22 0 0 0 20,8 Z', fill: '#3E4646' }, crank); E('circle', { r: 5, fill: '#2A2E2E' }, crank);
    const pin = E('circle', { r: 5, fill: '#C9A045' }, I);
    return { cx, rod, head, con, crank, pin, ph: i * Math.PI / 2 }; });
  /* gauge board on bulkhead */
  E('rect', { x: 596, y: 690, width: 36, height: 80, rx: 4, fill: '#5A3E2A' }, I);
  const eGauges = [702, 730, 758].map(y => { E('circle', { cx: 614, cy: y, r: 10, fill: '#C9A045' }, I); E('circle', { cx: 614, cy: y, r: 7.5, fill: '#FBF7EE' }, I);
    const nd = E('path', { d: 'M0,0 V-6', stroke: '#C0392B', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, I); return { nd, y }; });
  { const l = itrCageLamp(I, 300, B0 + 29, 22, .7); l.glow.setAttribute('opacity', .7); lanterns.push(l); }
  { const l = itrCageLamp(I, 520, B0 + 29, 22, .7); lanterns.push(l); }
  wall(140, 640, 846, B1, '#2C2628');
  part(640, B0, B1, 14);
  E('rect', { x: 644, y: 790, width: 6, height: 60, fill: '#1E1A1C' }, I);
  /* --- boiler rooms (654..1575) --- */
  const furn = [], stokers = [], bGauges = [];
  [[654, 950], [962, 1250], [1262, 1600]].forEach(([x0, x1], ri) => {
    if (ri) part(x0 - 12, B0, B1, 12);
    [x0 + 78, x0 + 218].forEach((bx, k) => { if (bx > 1520) return;
      const cy = 760, r = 62;
      E('path', { d: `M${bx - 26},${B0 + 30} H${bx + 26} L${bx + 40},${cy - r + 6} H${bx - 40} Z`, fill: '#2E2A2C' }, I);
      E('rect', { x: bx - 46, y: cy + r - 14, width: 92, height: BF - (cy + r - 14), fill: '#2A2426' }, I);
      E('circle', { cx: bx, cy, r: r + 4, fill: '#2E2A2C' }, I);
      E('circle', { cx: bx, cy, r, fill: '#57504F' }, I);
      E('path', { d: `M${bx - r},${cy} A${r},${r} 0 0 0 ${bx + r},${cy} Z`, fill: '#4A4344' }, I);
      E('circle', { cx: bx, cy, r: r - 6, fill: 'none', stroke: '#6B6362', 'stroke-width': 2, 'stroke-dasharray': '1.5 6' }, I);
      E('path', { d: `M${bx - r * .7},${cy - r * .55} A${r * .9},${r * .9} 0 0 1 ${bx + r * .2},${cy - r * .88}`, stroke: '#7A7270', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, I);
      /* gauge */
      E('circle', { cx: bx + 30, cy: cy - 36, r: 9, fill: '#C9A045' }, I); E('circle', { cx: bx + 30, cy: cy - 36, r: 6.5, fill: '#FBF7EE' }, I);
      bGauges.push({ nd: E('path', { d: 'M0,0 V-5', stroke: '#C0392B', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, I), x: bx + 30, y: cy - 36, ph: hash(bx) * 6 });
      E('rect', { x: bx - 40, y: cy - 30, width: 4, height: 22, rx: 2, fill: '#BFE4F0', 'fill-opacity': .7 }, I);
      /* furnace doors */
      [-34, 0, 34].forEach(dx => { const fx = bx + dx, fy = cy + 22;
        E('rect', { x: fx - 13, y: fy - 11, width: 26, height: 24, rx: 5, fill: '#2A2627' }, I);
        const hot = E('rect', { x: fx - 9, y: fy - 3, width: 18, height: 8, rx: 2, fill: '#FF9A3A' }, I);
        E('rect', { x: fx - 9, y: fy - 1, width: 18, height: 2, fill: '#FFE07A' }, I);
        const gl = itrGlow(I, fx, fy + 8, 34, 26, '#FF8A2A', .55);
        furn.push({ hot, gl, ph: hash(fx * .37) * 9 }); });
      const fl = itrGlow(I, bx, BF - 2, 80, 12, '#FF8A2A', .45); furn.push({ hot: null, gl: fl, ph: hash(bx) * 4 });
      stokers.push([bx, BF]);
    });
    /* coal heaps + shovel */
    const hx = x0 + 148; let d = `M${hx - 46},${BF + 2} Q${hx - 30},${BF - 30} ${hx},${BF - 34} Q${hx + 30},${BF - 30} ${hx + 46},${BF + 2} Z`; E('path', { d, fill: '#1C191B' }, I);
    let lumps = ''; for (let k = 0; k < 16; k++) { const lx = hx - 36 + hash(k + ri * 20) * 72, ly = BF - 4 - hash(k * 3 + ri) * 24 * (1 - Math.abs(lx - hx) / 50); lumps += `M${f2(lx)},${f2(ly)} l3,-3 l4,1 l1,4 l-4,2 Z `; }
    E('path', { d: lumps, fill: '#3E393C' }, I);
    E('path', { d: `M${hx + 30},${BF - 6} L${hx + 52},${BF - 70}`, stroke: '#8A5A33', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, I);
    E('path', { d: `M${hx + 22},${BF - 2} L${hx + 38},${BF - 2} L${hx + 34},${BF - 16} L${hx + 26},${BF - 16} Z`, fill: '#5A5F66', transform: `rotate(18 ${hx + 30} ${BF - 9})` }, I);
    { const l = itrCageLamp(I, x0 + 148, B0 + 29, 18, .6, '#FFD27A'); lanterns.push(l); }
  });
  wall(654, 1600, 846, B1, '#2C2628');
  /* double bottom */
  E('rect', { x: 0, y: B1, width: 1600, height: 14, fill: '#3A3437' }, I); E('rect', { x: 0, y: B1, width: 1600, height: 3, fill: '#5B5052' }, I);

  /* =================== BOAT DECK (above 215) =================== */
  const D = G(g);
  /* masts + stays */
  [[70, -80, 60], [1540, -80, 1560]].forEach(([mx, my]) => { E('path', { d: `M${mx},215 L${mx - 4},${my}`, stroke: '#B78A4A', 'stroke-width': 9 }, D); E('path', { d: `M${mx + 2},215 L${mx - 2},${my}`, stroke: '#D6A866', 'stroke-width': 3 }, D); });
  E('path', { d: 'M1536,-40 L1420,215 M1536,-40 L1580,215 M66,-40 L190,215 M66,-40 L36,215', stroke: '#2E2A2E', 'stroke-width': 1.3, 'stroke-opacity': .6 }, D);
  /* crow's nest */
  E('path', { d: 'M1520,58 H1556 L1552,84 H1524 Z', fill: '#B78A4A' }, D); E('rect', { x: 1518, y: 55, width: 40, height: 5, rx: 2, fill: '#D6A866' }, D);
  if (night) itrGlow(D, 1538, 60, 22, 14, '#FFE7A8', .4);
  /* funnels */
  const FUN = [380, 680, 980, 1280], smokes = [];
  FUN.forEach((fx, i) => { const top = 6, base = 152, dx = -15, w = 37;
    E('path', { d: `M${fx - w},${base} L${fx - w + dx},${top} L${fx + w + dx},${top} L${fx + w},${base} Z`, fill: '#D99A3E' }, D);
    E('path', { d: `M${fx + w * .35},${base} L${fx + w * .35 + dx},${top} L${fx + w + dx},${top} L${fx + w},${base} Z`, fill: '#B97E2C' }, D);
    E('path', { d: `M${fx - w * .6},${base} L${fx - w * .6 + dx},${top}`, stroke: '#F2C070', 'stroke-width': 5, 'stroke-opacity': .7 }, D);
    E('path', { d: `M${fx - w + dx * .76},${top + 34} L${fx - w + dx},${top} L${fx + w + dx},${top} L${fx + w + dx * .76},${top + 34} Z`, fill: '#1E1C20' }, D);
    E('path', { d: `M${fx - w + dx},${top} H${fx + w + dx}`, stroke: '#3A363C', 'stroke-width': 4 }, D);
    E('path', { d: `M${fx + w + 3},${base} L${fx + w + 3 + dx * .8},${top + 30}`, stroke: '#C9A045', 'stroke-width': 3 }, D);
    E('rect', { x: fx - w - 8, y: base - 10, width: w * 2 + 16, height: 10, rx: 3, fill: '#CBBFA6' }, D);
    E('path', { d: `M${fx + dx},${top + 10} L${fx - 120},150 M${fx + dx},${top + 10} L${fx + 110},150`, stroke: '#2E2A2E', 'stroke-width': 1, 'stroke-opacity': .45 }, D);
    if (i > 0) { const sm = itrSmoke(D, fx + dx, top - 4, { n: 7, seed: i * .31, col: mode === 'day' ? '#6E6A72' : '#4A4552', dx: -300, dy: -170 }); smokes.push(sm); A.push(sm.anim); } });
  /* deckhouse */
  E('rect', { x: 210, y: 152, width: 1230, height: 63, fill: '#EFE9DC' }, D);
  E('rect', { x: 206, y: 148, width: 1238, height: 6, rx: 2, fill: '#D8CFBC' }, D);
  E('rect', { x: 210, y: 200, width: 1230, height: 15, fill: '#000', 'fill-opacity': .07 }, D);
  { let d = ''; for (let x = 222; x < 1430; x += 22) { if (x > 466 && x < 624) continue; d += `M${x},170 h9 v12 h-9 Z `; } E('path', { d, fill: WIN }, D); }
  [300, 760, 1200].forEach(x => { E('rect', { x, y: 176, width: 14, height: 39, fill: '#9A6A3A' }, D); E('rect', { x: x + 2, y: 180, width: 10, height: 8, fill: WIN, 'fill-opacity': .8 }, D); });
  /* grand staircase dome, cut open */
  E('rect', { x: 470, y: 152, width: 150, height: 63, fill: '#BE8A55' }, D);
  E('rect', { x: 470, y: 152, width: 150, height: 63, fill: lgrad([[0, '#FFF2C8', .55], [1, '#FFF2C8', .05]]) }, D);
  E('path', { d: 'M466,152 V215 M624,152 V215', stroke: '#3A3437', 'stroke-width': 8 }, D);
  E('path', { d: 'M470,152 Q470,96 545,92 Q620,96 620,152 Z', fill: '#E4EEF0' }, D);
  E('path', { d: 'M480,152 Q482,104 545,100 Q608,104 610,152 Z', fill: lgrad([[0, '#FFFBEA'], [1, '#FFE7A8']]) }, D);
  E('path', { d: 'M545,92 V152 M508,98 Q500,120 498,152 M582,98 Q590,120 592,152 M478,128 Q545,118 612,128', stroke: '#A8B9C0', 'stroke-width': 2, fill: 'none' }, D);
  itrGlow(D, 545, 130, 110, 60, '#FFE7A8', night ? .5 : .3);
  /* bridge */
  E('rect', { x: 1440, y: 128, width: 110, height: 87, fill: '#F4EFE4' }, D); E('rect', { x: 1436, y: 124, width: 118, height: 7, rx: 2, fill: '#D8CFBC' }, D);
  { let d = ''; for (let x = 1448; x < 1546; x += 14) d += `M${x},140 h10 v14 h-10 Z `; E('path', { d, fill: night ? '#FFE7A8' : '#9FB7C7' }, D); }
  /* lifeboats + davits + rail */
  const boatX = [250, 342, 434, 526, 1064, 1156, 1248, 1340];
  boatX.forEach((bx, i) => { itrDavit(D, bx - 42, 214, 46, 1); itrDavit(D, bx + 42, 214, 46, -1);
    itrBoat(D, bx, 207, 80);
    E('path', { d: `M${bx - 28},${170} V${190} M${bx + 28},${170} V${190}`, stroke: '#8A7A60', 'stroke-width': 1.2 }, D); });
  E('rect', { x: 36, y: 211, width: 1538, height: 4, fill: '#C49A64' }, D);
  itrRail(D, 40, 1570, 214, 14, '#F2EEE6', 16, 1.6);
  /* boat-deck slab */
  E('rect', { x: 36, y: 215, width: 1538, height: 10, fill: '#3A3437', 'clip-path': itrClip(H) }, D);

  /* ---------- hull cut-face (plating) ---------- */
  const HL = G(g);
  E('path', { d: H, fill: 'none', stroke: '#1F2128', 'stroke-width': 16 }, HL);
  E('path', { d: H, fill: 'none', stroke: '#F2EEE4', 'stroke-width': 16, 'clip-path': clipRect(-100, 205, 1800, 176) }, HL);
  E('path', { d: H, fill: 'none', stroke: '#A8322D', 'stroke-width': 16, 'clip-path': clipRect(-100, 640, 1800, 400) }, HL);
  E('path', { d: H, fill: 'none', stroke: '#D4A73A', 'stroke-width': 18, 'clip-path': clipRect(-100, 379, 1800, 5) }, HL);
  E('path', { d: H, fill: 'none', stroke: '#fff', 'stroke-opacity': .18, 'stroke-width': 4, transform: 'translate(-3,-2)' }, HL);
  /* waterline foam at bow/stern */
  const foam = G(g); E('path', { d: 'M1560,642 q14,-6 28,0 q14,6 28,0 M20,642 q-14,-6 -28,0 q-14,6 -28,0', stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 3, fill: 'none' }, foam);

  /* ---------- labels + focus overlays ---------- */
  const LY = { boat: [0, -300, 1600, 225], first: [36, 225, 1574, 381], second: [36, 381, 1574, 511], third: [36, 511, 1574, 641], boiler: [36, 641, 1574, 880] };
  const dimG = G(g); const dims = {};
  Object.keys(LY).forEach(k => { const [x0, y0, x1, y1] = LY[k]; dims[k] = E('rect', { x: k === 'boat' ? -300 : x0 - 12, y: y0, width: k === 'boat' ? 2200 : x1 - x0 + 24, height: y1 - y0, fill: '#0B0D18' }, dimG); op(dims[k], 0); });
  const SG = G(g); if (o.labels === false) op(SG, 0);
  const signs = {
    first: itrPlaque(SG, 195, 238, 'First class', { chain: 12 }),
    second: itrPlaque(SG, 195, 398, 'Second class', { chain: 10, size: 19 }),
    third: itrPlaque(SG, 195, 528, 'Third class', { chain: 10, size: 19 }),
    engine: itrPlaque(SG, 390, 736, 'Engines', { size: 17 }),
    boiler: itrPlaque(SG, 800, 658, 'Boiler rooms', { chain: 10, size: 20 })
  };
  itrVignette(g, .35);

  g.signs = signs; g.layers = LY;
  g.focus = (name, k = 1) => Object.keys(dims).forEach(n => op(dims[n], name && n !== name ? .55 * k : 0));
  g.anchors = {
    boat: { floor: 213, x: [90, 1540] },
    first: { floor: FF, x: [70, 1545], bath: [195, FF], stairs: [610, FF], lounge: [930, FF], pool: [1330, FF] },
    second: { floor: SF, x: [60, 1555], dining: [380, SF], library: [800, SF], cabins: [1130, SF] },
    third: { floor: TF, x: [55, 1555], dance: [440, TF], dining: [850, TF], cabins: [1130, TF] },
    boiler: { floor: BF, x: [170, 1500], engine: [400, BF], catwalk: [170, 721], stokers }
  };
  g.anim = at => {
    A.forEach(f => f(at));
    clouds.forEach(cl => tf(cl.c, -300 + ((cl.off + at * cl.sp) % 2400), cl.y));
    wv.forEach((w, k) => tf(w, -((at * (10 + k * 6)) % 34), 0));
    /* fire, furnaces */
    op(fireGlow, .7 + .3 * wob(at * 4, 1)); fire.setAttribute('transform', `translate(931,366) scale(1,${f2(.85 + .2 * wob(at * 5, 2))}) translate(-931,-366)`);
    furn.forEach(f => { const v = .62 + .38 * wob(at * 3.3, f.ph); op(f.gl, v); if (f.hot) f.hot.setAttribute('fill', v > .7 ? '#FFB24A' : '#FF8A2A'); });
    lanterns.forEach((l, i) => op(l.glow, .78 + .22 * wob(at * 2.2, i * 3)));
    /* engine: cranks + rods */
    eng.forEach(e => { const th = at * 2.6 + e.ph, R = 20, px = e.cx + R * Math.sin(th), py = 815 - R * Math.cos(th);
      const chy = py - Math.sqrt(64 * 64 - (px - e.cx) * (px - e.cx));
      e.rod.setAttribute('height', f2(Math.max(4, chy - 724))); e.head.setAttribute('y', f2(chy - 5));
      e.con.setAttribute('d', `M${e.cx},${f2(chy)} L${f2(px)},${f2(py)}`); e.pin.setAttribute('cx', f2(px)); e.pin.setAttribute('cy', f2(py));
      e.crank.setAttribute('transform', `translate(${e.cx},815) rotate(${f2(th * 180 / Math.PI)})`); });
    eGauges.forEach((n, i) => n.nd.setAttribute('transform', `translate(614,${n.y}) rotate(${f2(20 + i * 30 + 8 * wob(at * 2, i))})`));
    bGauges.forEach(n => n.nd.setAttribute('transform', `translate(${n.x},${n.y}) rotate(${f2(40 + 10 * wob(at * 1.6, n.ph))})`));
    /* pool */
    let d = '', d2 = ''; for (let x = 1190; x <= 1478; x += 12) { const y = 334 + 1.6 * Math.sin(x * .07 + at * 2.4); d += (d ? ' L' : 'M') + x + ',' + f2(y); d2 = ` L${x},${f2(y + 4)}` + d2; } ripple.setAttribute('d', d + d2 + ' Z');
    tf(caust, Math.sin(at * .9) * 6, 0);
    tf(prop, 132, 806); prop.setAttribute('transform', `translate(132,806) scale(${f2(.35 + .65 * Math.abs(Math.cos(at * 5)))},1)`);
    bunt.setAttribute('transform', `translate(0,${f2(Math.sin(at * 1.3) * 1.2)})`);
    tf(foam, Math.sin(at * 1.4) * 4, 0);
  };
  g.anim(0);
  return g;
}
