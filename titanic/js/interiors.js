"use strict";
/* =====================================================================
   INTERIORS — interior sets for the Titanic film (stage 1600 × 900).
   Every set is  fn(parent, o) → group g, built once, with
     g.anim(at)     ambient motion; call every frame (at = ambient seconds)
     g.anchors      named points [x, y]; y = the floor where feet stand
     g.vignette     the set's soft corner vignette (o.vignette:false = none;
                    a scene may instead put one itrVignette(p) OUTSIDE its camera)
     g.fade(o)      fades the set: background + front (sets with g.mid: not the
                    characters); shipCutaway / bgDeck: everything inside g
   Character layers (every set except shipCutaway and bgDeck):
     parent ▸ g (background) ▸ g.mid ▸ g.front ▸ g.over
     g.mid    characters standing in the set (behind desk / tables / wheel /
              basket wall, which live in g.front and hide their legs)
     g.over   characters in front of everything (walkers, close-ups)
     No raiseFront needed.  The old pattern still works: add characters to
     parent, then g.raiseFront(before?) (moves front+over to the end of parent,
     or just before the node `before`, so later titles stay on top).
   Everything is drawn well beyond 1600 × 900 for camera moves.
   Deterministic (hash only), no SVG filters.  Helpers start with "itr".
   ===================================================================== */

/* ---------- small shared helpers ---------- */
function itrClip(d) { const id = uid('ic'); const cp = E('clipPath', { id }, DEFS); E('path', { d }, cp); return 'url(#' + id + ')'; }
/* soft corner darkening centred on the 1600×900 frame (public: scenes may
   also call it on a screen-space group).  The gradient is in user space and
   the rect is huge, so zooming out or panning never shows a hard edge.
   k = strength at the corners, cy = vertical centre (fraction of 900). */
function itrVignette(p, k = .45, cy = .45) {
  const id = uid('vg'), Y = -200 + 1300 * cy;
  const gr = E('radialGradient', { id, gradientUnits: 'userSpaceOnUse', cx: 800, cy: f2(Y), r: 1500, gradientTransform: `translate(0 ${f2(Y)}) scale(1 .65) translate(0 ${f2(-Y)})` }, DEFS);
  [[0, 0], [.66, 0], [1, k]].forEach(([o, a]) => E('stop', { offset: o, 'stop-color': '#000', 'stop-opacity': a }, gr));
  return E('rect', { x: -1400, y: -1100, width: 4400, height: 3100, fill: 'url(#' + id + ')', 'pointer-events': 'none' }, p);
}
function itrGlow(p, cx, cy, rx, ry, col, a = .5) { return E('ellipse', { cx, cy, rx, ry, fill: rgrad([[0, col, a], [.45, col, a * .45], [1, col, 0]]) }, p); }
/* sibling layers of a set inside `parent`:  g ▸ g.mid ▸ g.front ▸ g.over
   g.mid   characters that stand IN the set (drawn under g.front, no raiseFront needed)
   g.front foreground pieces of the set (desk, basket wall, wheel, tables…)
   g.over  characters that pass IN FRONT of g.front (walkers, close-ups)
   g.raiseFront(before?) moves front+over to the end of parent (or just before
   the node `before`), for scenes that added characters to parent directly. */
function itrFront(g, parent) {
  g.mid = G(parent); g.front = G(parent); g.over = G(parent);
  g.raiseFront = before => { const p = g.front.parentNode; if (!p) return; const ref = before && before.parentNode === p ? before : null; p.insertBefore(g.front, ref); p.insertBefore(g.over, ref); };
  g.fade = o => { op(g, o); op(g.front, o); };
}
/* write an attribute only when its value changed (cheap per-frame updates) */
function itrSet(n, k, v) { if (n['_' + k] !== v) { n['_' + k] = v; n.setAttribute(k, v); } }
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
    E('circle', { r: 10, fill: col }, q);
    if (o.lit) { E('circle', { cx: 4, cy: -4, r: 7.5, fill: shade(col, -.1) }, q); E('ellipse', { cx: -1, cy: 4, rx: 8.5, ry: 6, fill: o.lit, 'fill-opacity': .55 }, q); }
    else { E('circle', { cx: 7, cy: 3, r: 7.5, fill: shade(col, -.12) }, q); E('circle', { cx: -4, cy: -4, r: 6.5, fill: shade(col, .16) }, q); }
    ps.push(q); }
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
  const h = w * .25;
  E('rect', { x: -w * .3, y: -1, width: w * .1, height: 5, fill: '#5A4A3A' }, g); E('rect', { x: w * .2, y: -1, width: w * .1, height: 5, fill: '#5A4A3A' }, g);
  E('path', { d: `M${-w / 2},${-h} L${w / 2},${-h} Q${w * .47},${-h * .3} ${w * .34},0 L${-w * .34},0 Q${-w * .47},${-h * .3} ${-w / 2},${-h} Z`, fill: o.hull || '#F6F3EC' }, g);
  E('path', { d: `M${-w * .48},${-h * .5} L${w * .48},${-h * .5} Q${w * .44},${-h * .15} ${w * .34},0 L${-w * .34},0 Q${-w * .44},${-h * .15} ${-w * .48},${-h * .5} Z`, fill: '#000', 'fill-opacity': .09 }, g);
  E('rect', { x: -w * .47, y: -h * .62, width: w * .94, height: Math.max(1, w * .02), fill: '#BDB6A6' }, g);
  E('rect', { x: -w / 2 - 1, y: -h - 2, width: w + 2, height: Math.max(3, w * .05), rx: 1.5, fill: o.rail || '#9A6A3A' }, g);
  if (o.cover !== false) { E('path', { d: `M${-w * .44},${-h - 2} L${-w * .4},${-h - w * .07} H${w * .4} L${w * .44},${-h - 2} Z`, fill: o.coverC || '#DCD4C0' }, g);
    E('path', { d: `M${-w * .4},${-h - w * .07} H${w * .4}`, stroke: '#C4BBA4', 'stroke-width': Math.max(1, w * .02) }, g); }
  return g;
}
/* quadrant davit (side view), standing at (x,y), arm reaching dir (+1/-1) over the boat; falls drop to yb */
function itrDavit(p, x, y, hgt = 40, dir = 1, col = '#DCD6C8', yb = null) {
  const g = G(p), sw = Math.max(2.5, hgt * .1);
  E('path', { d: `M${x},${y} V${y - hgt * .55} Q${x},${y - hgt} ${x + dir * hgt * .34},${y - hgt}`, stroke: shade(col, -.25), 'stroke-width': sw + 1.5, fill: 'none', 'stroke-linecap': 'round' }, g);
  E('path', { d: `M${x},${y} V${y - hgt * .55} Q${x},${y - hgt} ${x + dir * hgt * .34},${y - hgt}`, stroke: col, 'stroke-width': sw, fill: 'none', 'stroke-linecap': 'round' }, g);
  E('rect', { x: x - sw * 1.2, y: y - sw * .8, width: sw * 2.4, height: sw * .8, fill: shade(col, -.35) }, g);
  const fx = x + dir * hgt * .34;
  E('rect', { x: fx - sw * .6, y: y - hgt + sw * .2, width: sw * 1.2, height: sw * 1.5, rx: sw * .3, fill: '#6B5A44' }, g);
  if (yb != null) E('path', { d: `M${fx - sw * .25},${y - hgt + sw * 1.6} V${yb} M${fx + sw * .25},${y - hgt + sw * 1.6} V${yb}`, stroke: '#8A7A60', 'stroke-width': Math.max(.8, sw * .22) }, g);
  return g;
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
   1) shipCutaway(parent, o) — the "layer cake": the ship in side view, hull
      cut open (bow to the right).  o.sky: 'dusk' (default) | 'day' | 'night'
      o.labels: false starts with every plaque hidden (each one can still be
      brought in with show(g.signs.x, t, tIn, tOut, {pop:1}));  o.vignette: false
   g.rooms            { boat, first, second, third, boiler }: one group per layer,
                      clipped to its rooms and dimmed by focus() — put characters here
   g.focus(name, k)   dim everything except layer `name` by k 0..1 (null = none)
   g.signs            { first, second, third, engine, boiler } plaques (N-groups)
   g.layers           { name: [x0, y0, x1, y1] } box of every layer
   g.fade(o)
   g.anchors  (scale = Human scale that fits the room height)
     boat:   { floor:213, x:[90,1490], scale:.14 }
     first:  { floor:370, x:[70,1545], scale:.30, bath:[250,370], stairs:[610,370], lounge:[930,370], pool:[1330,370] }
     second: { floor:500, x:[60,1555], scale:.27, dining:[380,500], library:[800,500], cabins:[1130,500] }
     third:  { floor:630, x:[55,1555], scale:.27, dance:[440,630], dining:[850,630], cabins:[1130,630] }
     boiler: { floor:855, x:[170,1500], scale:.42, engine:[400,855],
               catwalk:[300,800], catwalkX:[215,590]  (grating in front of the cranks; same .42 scale),
               stokers:[[668,855],[808,855],[976,855],[1116,855],[1276,855],[1416,855]]  (left of each boiler),
               stokerFace:[1,1,1,1,1,1]  (+1 = the furnace is to his right) }
   ===================================================================== */
function shipCutaway(parent, o = {}) {
  const g = G(parent), A = [];
  const mode = o.sky || 'dusk', night = mode === 'night';
  const SKY = { day: [[0, '#4F9FDB'], [.65, '#9ED2EE'], [1, '#D8EEF5']], dusk: [[0, '#2C3A76'], [.4, '#6E5A98'], [.75, '#D9837A'], [1, '#F6B97C']], night: [[0, '#060A1A'], [.6, '#121A36'], [1, '#222C55']] }[mode];
  const SEA = { day: [[0, '#2D7AAE'], [1, '#0F3858']], dusk: [[0, '#4A5A92'], [1, '#141D3C']], night: [[0, '#101A38'], [1, '#03060E']] }[mode];
  const WIN = night ? '#FFD98A' : mode === 'dusk' ? '#FFD08A' : '#BFD6E2';
  const winSky = { day: [[0, '#79BDE8'], [1, '#CFEAF5']], dusk: [[0, '#7A64A0'], [1, '#F2A27E']], night: [[0, '#0B1230'], [1, '#26305A']] }[mode];

  /* ---------- sky, clouds, sea ---------- */
  E('rect', { x: -1400, y: -1200, width: 4400, height: 1860, fill: SKY[0][1] }, g);
  E('rect', { x: -1400, y: -300, width: 4400, height: 960, fill: lgrad(SKY) }, g);
  if (night) { const st = itrStars(g, -300, -200, 2200, 560, 260, 4); A.push(st.anim); itrStars(g, -1400, -1100, 4400, 1300, 220, 9, { glint: false }); }
  const clouds = [];
  if (!night) for (let i = 0; i < 5; i++) { const c = G(g), cw = 120 + hash(i + 3) * 120;
    [[0, 0, cw * .32], [cw * .28, -12, cw * .26], [cw * .55, 2, cw * .2], [-cw * .25, 6, cw * .2]].forEach(([cx, cy, r]) => E('ellipse', { cx, cy, rx: r, ry: r * .42, fill: mode === 'day' ? '#FFFFFF' : '#FFD2C0', 'fill-opacity': mode === 'day' ? .8 : .5 }, c));
    clouds.push({ c, y: 30 + hash(i + 7) * 90, sp: 5 + hash(i) * 6, off: hash(i + 1) * 2000 }); }
  E('rect', { x: -1400, y: 640, width: 4400, height: 1400, fill: lgrad(SEA) }, g);
  const waves = G(g); const wv = [];
  for (let k = 0; k < 2; k++) { let d = ''; for (let i = 0; i < 70; i++) { const x = -300 + i * 34; d += `M${x},${652 + k * 26 + (i % 3) * 6} q8,-5 16,0 `; }
    wv.push(E('path', { d, stroke: '#fff', 'stroke-opacity': night ? .12 : .22, 'stroke-width': 2, fill: 'none' }, waves)); }

  /* ---------- hull outline ---------- */
  const H = 'M36,215 L1574,215 L1559,650 Q1552,846 1452,872 L272,872 Q192,872 164,836 L142,692 Q74,690 52,612 Q33,470 36,215 Z';
  /* stern frame: rudder hung on its post under the counter, sole piece from
     the keel to the rudder heel, centre propeller in the aperture */
  E('path', { d: 'M206,862 Q160,866 112,864 L110,873 Q160,875 208,871 Z', fill: '#7A2622' }, g);
  E('rect', { x: 113, y: 668, width: 9, height: 30, fill: '#5A1E1A' }, g);
  E('path', { d: 'M122,686 L122,868 L90,870 Q76,800 80,722 Q84,696 122,686 Z', fill: '#8E2E29' }, g);
  E('path', { d: 'M101,690 Q84,700 80,722 Q76,800 90,870 L101,869 Z', fill: '#000', 'fill-opacity': .2 }, g);
  E('rect', { x: 117, y: 686, width: 6, height: 182, fill: '#B8453E' }, g);
  E('path', { d: 'M114,724 h11 M114,782 h11 M114,840 h11', stroke: '#5A1E1A', 'stroke-width': 4 }, g);
  const prop = G(g); tf(prop, 141, 806);
  E('ellipse', { cx: 0, cy: -24, rx: 9, ry: 26, fill: '#C79A4A' }, prop); E('ellipse', { cx: 0, cy: 24, rx: 9, ry: 26, fill: '#A87E36' }, prop); E('circle', { r: 8, fill: '#8A6526' }, prop);
  const hullClip = itrClip(H), I = G(g, { 'clip-path': hullClip });
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
  /* the carving: two robed figures (Honour and Glory) crowning the clock, laurel swag between */
  [-1, 1].forEach(s => { const fx = 420 + s * 11;
    E('path', { d: `M${fx - 5},328 Q${fx - 5},312 ${fx},305 Q${fx + 5},312 ${fx + 5},328 Z`, fill: '#6E4426' }, I);
    E('path', { d: `M${fx - s * 1},307 Q${fx - s * 4},299 ${fx - s * 6},294`, stroke: '#6E4426', 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round' }, I);
    E('circle', { cx: fx, cy: 301, r: 3.6, fill: '#7E5230' }, I); E('circle', { cx: fx - 1, cy: 300, r: 1.5, fill: '#C79A62' }, I);
    E('path', { d: `M${fx - 2},309 Q${fx - 3},318 ${fx - 2},326`, stroke: '#C79A62', 'stroke-width': 1.2, fill: 'none', 'stroke-opacity': .8 }, I); });
  E('path', { d: 'M412,316 Q420,324 428,316', stroke: '#5E3A20', 'stroke-width': 2.2, fill: 'none' }, I);
  { let d = ''; [[413, 318], [416, 321], [420, 322], [424, 321], [427, 318]].forEach(([x, y]) => d += `M${x},${y} m-1.6,0 a1.6,1.6 0 1 0 3.2,0 a1.6,1.6 0 1 0 -3.2,0 `); E('path', { d, fill: '#8EA05A' }, I); }
  /* the stairs: rise from (708,FF) up-left into the opening */
  { let d = `M716,${FF}`, x = 716, y = FF; for (let i = 0; i < 12; i++) { d += ` V${y - 11.5} H${x - 17}`; y -= 11.5; x -= 17; } d += ` L${x - 20},${y} L560,${FF + 4} Z`;
    E('path', { d, fill: '#8E5E33' }, I);
    let c = `M716,${FF - 1}`; x = 716; y = FF - 1; for (let i = 0; i < 12; i++) { c += ` V${y - 11.5} H${x - 17}`; y -= 11.5; x -= 17; }
    E('path', { d: c, stroke: '#A8322F', 'stroke-width': 4, fill: 'none' }, I);
    E('path', { d: `M712,${FF - 2} L${x + 4},${y - 2}`, stroke: '#6E4426', 'stroke-width': 7, 'stroke-opacity': .5 }, I); }
  /* balustrade: iron scrolls + oak handrail */
  { let d = ''; for (let i = 0; i < 12; i++) { const bx = 706 - i * 17, by = FF - 8 - i * 11.5, top = FF - 53.5 - 11.07 * i, h = by - top, top2 = top - 5.2, h2 = by - 2 - top2;
      d += `M${bx},${f2(by)} q-6,${f2(-h * .28)} 0,${f2(-h * .5)} q6,${f2(-h * .22)} 0,${f2(-h * .5)} M${bx - 8},${f2(by - 2)} q5,${f2(-h2 * .3)} 0,${f2(-h2 * .55)} q-4,${f2(-h2 * .2)} 0,${f2(-h2 * .45)} `; }
    E('path', { d, stroke: '#2E2522', 'stroke-width': 1.8, fill: 'none' }, I);
    let dg = ''; for (let i = 0; i < 12; i++) dg += `M${704 - i * 17},${FF - 22 - i * 11.5} m-2,0 a2,2 0 1 0 4,0 a2,2 0 1 0 -4,0 `; E('path', { d: dg, fill: '#E2BE62' }, I);
    E('path', { d: `M724,${FF - 44} L${716 - 12 * 17 - 6},${FF - 44 - 12 * 11.5 - 4}`, stroke: '#7A4A26', 'stroke-width': 5, 'stroke-linecap': 'round' }, I); }
  /* newel post + cherub lamp */
  E('rect', { x: 718, y: FF - 52, width: 12, height: 52, fill: '#7A4A26' }, I); E('rect', { x: 716, y: FF - 56, width: 16, height: 6, rx: 2, fill: '#8E5E33' }, I);
  { const ch = G(I); tf(ch, 724, FF - 56);
    itrGlow(ch, 6, -34, 52, 44, '#FFE2A0', .75);
    E('path', { d: 'M-3,-15 Q-15,-24 -12,-7 Q-7,-11 -3,-10 Z', fill: '#D8B57A' }, ch);
    E('ellipse', { cx: 0, cy: -10, rx: 5.5, ry: 8.5, fill: '#B08A50' }, ch); E('ellipse', { cx: -2, cy: -12, rx: 1.8, ry: 4.5, fill: '#E2C285' }, ch);
    E('path', { d: 'M2,-16 L6.5,-31', stroke: '#B08A50', 'stroke-width': 2.8, 'stroke-linecap': 'round' }, ch);
    E('circle', { cx: 0, cy: -23, r: 5, fill: '#BE9A5E' }, ch); E('circle', { cx: -1.6, cy: -24.6, r: 2, fill: '#ECD29C' }, ch);
    E('circle', { cx: 6.5, cy: -35, r: 6, fill: '#FFF0C0', 'fill-opacity': .6 }, ch); E('circle', { cx: 6.5, cy: -35, r: 3.8, fill: '#FFFDF0' }, ch); }
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
  [1250, 1450].forEach(lx => { itrGlow(I, lx, 250, 70, 50, '#FFE7B0', .4); E('path', { d: `M${lx},${F0 + 8} V242`, stroke: '#B88E3A', 'stroke-width': 1.5 }, I); E('circle', { cx: lx, cy: 248, r: 7, fill: '#FFF4D6' }, I); E('rect', { x: lx - 4, y: 238, width: 8, height: 4, fill: '#C9A045' }, I); });
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
  [325, 430, 530].forEach(px => itrPorthole(I, px, 420, 9, { mode }));
  [378, 482].forEach(px => itrSconce(I, px, 430, .7));
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
  E('path', { d: `M1234,${T0 + 10} Q1290,${T0 + 20} 1346,${T0 + 10}`, stroke: '#7A6A5A', 'stroke-width': 1.2, fill: 'none' }, I);
  [[1246, '#E84855', 's'], [1266, '#F2EEE4', 'shirt'], [1292, '#2F6FD6', 's'], [1310, '#F7C948', 's'], [1330, '#3BB273', 's']].forEach(([x, c, t]) => {
    const y = T0 + 11 + Math.sin((x - 1234) / 112 * Math.PI) * 8;
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
  /* overhead steam pipe from boilers into the engine */
  E('path', { d: `M1550,${B0 + 13} H626 Q600,${B0 + 13} 600,${B0 + 36} V690`, stroke: '#CFC8BC', 'stroke-width': 10, fill: 'none' }, I);
  { let d = ''; for (let x = 640; x < 1550; x += 40) d += `M${x},${B0 + 8} V${B0 + 18} `; E('path', { d, stroke: '#A89F92', 'stroke-width': 2 }, I); }
  E('rect', { x: 620, y: B0 + 24, width: 930, height: 5, rx: 2, fill: '#B5653A' }, I);
  /* cylinders (lagged, domed covers) */
  const CX = [262, 357, 452, 547];
  E('rect', { x: 206, y: 680, width: 392, height: 5, fill: '#3E4646' }, I);
  CX.forEach((cx, i) => { const cw = i === 0 ? 62 : i === 3 ? 92 : 78, top = 690;
    E('rect', { x: cx - cw / 2, y: top, width: cw, height: 50, rx: 4, fill: '#5A6664' }, I);
    let d = ''; for (let x = cx - cw / 2 + 7; x < cx + cw / 2; x += 7) d += `M${x},${top + 4} V${top + 48} `; E('path', { d, stroke: '#4E5A58', 'stroke-width': 1.5 }, I);
    E('rect', { x: cx - cw / 2, y: top, width: cw * .28, height: 50, rx: 4, fill: '#fff', 'fill-opacity': .12 }, I);
    E('rect', { x: cx - cw / 2 - 2, y: top + 8, width: cw + 4, height: 4, fill: '#C9A045' }, I); E('rect', { x: cx - cw / 2 - 2, y: top + 38, width: cw + 4, height: 4, fill: '#C9A045' }, I);
    E('path', { d: `M${cx - cw / 2 + 2},${top} Q${cx},${top - 12} ${cx + cw / 2 - 2},${top} Z`, fill: '#7E8A88' }, I);
    E('rect', { x: cx - 5, y: top - 14, width: 10, height: 6, rx: 2, fill: '#C9A045' }, I); });
  /* A-frame columns + crank pit */
  E('rect', { x: 200, y: 740, width: 404, height: 7, fill: '#3E4646' }, I);
  [212, 309, 404, 499, 594].forEach(x => E('path', { d: `M${x - 6},747 L${x - 12},842 H${x + 12} L${x + 6},747 Z`, fill: '#424C4C' }, I));
  E('rect', { x: 200, y: 830, width: 404, height: 25, fill: '#241F21' }, I);
  E('path', { d: 'M150,816 L604,820', stroke: '#8A9098', 'stroke-width': 9 }, I); E('path', { d: 'M150,814 L604,818', stroke: '#C9D1D6', 'stroke-width': 2.5 }, I);
  const eng = CX.map((cx, i) => { const rod = E('rect', { x: cx - 3, y: 747, width: 6, height: 20, fill: '#D8DEE2' }, I);
    const head = E('rect', { x: cx - 13, y: 0, width: 26, height: 10, rx: 2, fill: '#9AA2A8' }, I);
    const con = E('path', { stroke: '#B8C0C6', 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }, I);
    const crank = G(I); tf(crank, cx, 818); E('circle', { r: 21, fill: '#5A6262' }, crank); E('path', { d: 'M-19,8 A21,21 0 0 0 19,8 Z', fill: '#3E4646' }, crank); E('circle', { r: 5, fill: '#2A2E2E' }, crank);
    const pin = E('circle', { r: 5, fill: '#C9A045' }, I);
    return { cx, rod, head, con, crank, pin, ph: i * Math.PI / 2 }; });
  /* gauge board on bulkhead */
  E('rect', { x: 596, y: 690, width: 36, height: 80, rx: 4, fill: '#5A3E2A' }, I);
  const eGauges = [702, 730, 758].map(y => { E('circle', { cx: 614, cy: y, r: 10, fill: '#C9A045' }, I); E('circle', { cx: 614, cy: y, r: 7.5, fill: '#FBF7EE' }, I);
    const nd = E('path', { d: 'M0,0 V-6', stroke: '#C0392B', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, I); return { nd, y }; });
  { const l = itrCageLamp(I, 176, B0, 34, .6); lanterns.push(l); }
  /* starting-platform catwalk (grating + handrail + ladder) in front of the cranks */
  E('rect', { x: 206, y: 800, width: 392, height: 6, fill: '#4A5454' }, I); E('rect', { x: 206, y: 800, width: 392, height: 2, fill: '#8A9498' }, I);
  { let d = ''; for (let x = 210; x < 598; x += 7) d += `M${x},801 v4 `; E('path', { d, stroke: '#2E3434', 'stroke-width': 1.2 }, I); }
  itrRail(I, 206, 598, 800, 22, '#9AA2A8', 26, 1.8);
  E('path', { d: 'M196,800 V855 M210,800 V855', stroke: '#7A8088', 'stroke-width': 2.4 }, I);
  { let d = ''; for (let y = 808; y < 855; y += 9) d += `M196,${y} H210 `; E('path', { d, stroke: '#7A8088', 'stroke-width': 2 }, I); }
  wall(140, 640, 846, B1, '#2C2628');
  part(640, B0, B1, 14);
  E('rect', { x: 644, y: 790, width: 6, height: 60, fill: '#1E1A1C' }, I);
  /* --- boiler rooms (654..1575) --- */
  const furn = [], stokers = [], bxs = [], bGauges = [], heaps = [];
  [[654, 950], [962, 1250], [1262, 1600]].forEach(([x0, x1], ri) => {
    if (ri) part(x0 - 12, B0, B1, 12);
    [x0 + 78, x0 + 218].forEach((bx, k) => { if (bx > 1520) return;
      const cy = 760, r = 62;
      E('path', { d: `M${bx - 26},${B0 + 30} H${bx + 26} L${bx + 40},${cy - r + 6} H${bx - 40} Z`, fill: '#2E2A2C' }, I);
      E('rect', { x: bx - 46, y: cy + r - 14, width: 92, height: BF - (cy + r - 14), fill: '#2A2426' }, I);
      /* steel boiler end: flat plates, lap seams and rivet rows (no glassy shine) */
      E('circle', { cx: bx, cy, r: r + 4, fill: '#24272B' }, I);
      E('circle', { cx: bx, cy, r, fill: '#4A5056' }, I);
      E('path', { d: `M${bx - r * .8},${f2(cy - r * .6)} A${r},${r} 0 0 1 ${bx + r * .8},${f2(cy - r * .6)} Z`, fill: '#555C62' }, I);
      E('path', { d: `M${bx - r},${cy + 4} A${r},${r} 0 0 0 ${bx + r},${cy + 4} Z`, fill: '#3F4449' }, I);
      E('circle', { cx: bx, cy, r, fill: lgrad([[0, '#FF8A3A', 0], [.6, '#FF8A3A', 0], [1, '#FF8A3A', .22]]) }, I);
      E('circle', { cx: bx, cy, r: r - 5, fill: 'none', stroke: '#33373B', 'stroke-width': 2 }, I);
      E('path', { d: `M${bx - r * .8},${f2(cy - r * .6)} H${bx + r * .8}`, stroke: '#33373B', 'stroke-width': 2 }, I);
      { let rv = ''; for (let k = 0; k < 30; k++) { const a = k / 30 * Math.PI * 2; rv += `M${f2(bx + Math.cos(a) * (r - 9))},${f2(cy + Math.sin(a) * (r - 9))} m-1.3,0 a1.3,1.3 0 1 0 2.6,0 a1.3,1.3 0 1 0 -2.6,0 `; }
        for (let x = bx - r * .74; x < bx + r * .75; x += 6.5) rv += `M${f2(x)},${f2(cy - r * .6 + 4)} m-1.2,0 a1.2,1.2 0 1 0 2.4,0 a1.2,1.2 0 1 0 -2.4,0 `;
        E('path', { d: rv, fill: '#2E3236' }, I); }
      /* gauge */
      E('circle', { cx: bx + 30, cy: cy - 36, r: 9, fill: '#C9A045' }, I); E('circle', { cx: bx + 30, cy: cy - 36, r: 6.5, fill: '#FBF7EE' }, I);
      bGauges.push({ nd: E('path', { d: 'M0,0 V-5', stroke: '#C0392B', 'stroke-width': 1.6, 'stroke-linecap': 'round' }, I), x: bx + 30, y: cy - 36, ph: hash(bx) * 6 });
      E('rect', { x: bx - 40, y: cy - 30, width: 4, height: 22, rx: 2, fill: '#BFE4F0', 'fill-opacity': .7 }, I);
      /* furnace doors */
      [-34, 0, 34].forEach(dx => { const fx = bx + dx, fy = cy + 22;
        E('rect', { x: fx - 13, y: fy - 11, width: 26, height: 24, rx: 5, fill: '#2A2627' }, I);
        const hot = E('rect', { x: fx - 9, y: fy - 3, width: 18, height: 8, rx: 2, fill: '#FF9A3A' }, I);
        E('rect', { x: fx - 9, y: fy - 1, width: 18, height: 2, fill: '#FFE07A' }, I);
        const gl = itrGlow(I, fx, fy + 6, 40, 30, '#FF9A3A', .7);
        furn.push({ hot, gl, ph: hash(fx * .37) * 9 }); });
      stokers.push([bx - 64, BF]); bxs.push(bx);
    });
    heaps.push(x0);
    { const l = itrCageLamp(I, x0 + 148, B0 + 29, 18, .6, '#FFD27A'); lanterns.push(l); }
  });
  wall(654, 1600, 846, B1, '#2C2628');
  bxs.forEach((bx, i) => { const fl = itrGlow(I, bx, BF - 4, 100, 18, '#FF8A2A', .55); furn.push({ hot: null, gl: fl, ph: i * 1.7 }); });
  heaps.forEach((x0, ri) => {
    /* coal heaps + shovel */
    const hx = x0 + 148; let d = `M${hx - 56},${BF + 2} Q${hx - 34},${BF - 40} ${hx},${BF - 44} Q${hx + 34},${BF - 40} ${hx + 56},${BF + 2} Z`; E('path', { d, fill: '#1C191B' }, I);
    let lumps = ''; for (let k = 0; k < 16; k++) { const lx = hx - 36 + hash(k + ri * 20) * 72, ly = BF - 4 - hash(k * 3 + ri) * 34 * (1 - Math.abs(lx - hx) / 50); lumps += `M${f2(lx)},${f2(ly)} l3,-3 l4,1 l1,4 l-4,2 Z `; }
    E('path', { d: lumps, fill: '#3E393C' }, I);
    E('path', { d: `M${hx + 30},${BF - 6} L${hx + 52},${BF - 70}`, stroke: '#8A5A33', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, I);
    E('path', { d: `M${hx + 22},${BF - 2} L${hx + 38},${BF - 2} L${hx + 34},${BF - 16} L${hx + 26},${BF - 16} Z`, fill: '#5A5F66', transform: `rotate(18 ${hx + 30} ${BF - 9})` }, I);
  });
  /* double bottom */
  E('rect', { x: 0, y: B1, width: 1600, height: 14, fill: '#3A3437' }, I); E('rect', { x: 0, y: B1, width: 1600, height: 3, fill: '#5B5052' }, I);

  /* =================== BOAT DECK (above 215) =================== */
  const D = G(g);
  const BRX = 1330, WELL = 1432, FC = 1498;   /* bridge BRX..WELL, open well deck WELL..FC, raised forecastle FC..stem */
  /* masts (the foremast stands on the well deck, ahead of the bridge) + stays */
  [[70, -80], [1468, -80]].forEach(([mx, my]) => { E('path', { d: `M${mx},215 L${mx - 4},${my}`, stroke: '#B78A4A', 'stroke-width': 9 }, D); E('path', { d: `M${mx + 2},215 L${mx - 2},${my}`, stroke: '#D6A866', 'stroke-width': 3 }, D); });
  E('path', { d: 'M1465,-40 L1362,128 M1465,-40 L1579,193 M1466,-10 L1530,196 M66,-40 L190,215 M66,-40 L36,215', stroke: '#2E2A2E', 'stroke-width': 1.3, 'stroke-opacity': .6 }, D);
  /* crow's nest on the foremast */
  E('path', { d: 'M1448,62 H1484 L1480,88 H1452 Z', fill: '#B78A4A' }, D); E('rect', { x: 1446, y: 59, width: 40, height: 5, rx: 2, fill: '#D6A866' }, D);
  E('path', { d: 'M1466,62 V88 L1480,88 L1484,62 Z', fill: '#000', 'fill-opacity': .15 }, D);
  if (night) itrGlow(D, 1466, 64, 22, 14, '#FFE7A8', .4);
  /* funnels (shorter, so their smoke has room inside the frame) */
  const FUN = [380, 680, 980, 1280], smokes = [], FT = 62, FB = 152, FW = 34, FDX = -11;
  const SMK = mode === 'day' ? '#6E6A72' : mode === 'dusk' ? '#4A4054' : '#8A8292', SLIT = mode === 'day' ? null : mode === 'dusk' ? '#E09A86' : '#C9AA8E';
  FUN.forEach(fx => E('path', { d: `M${fx + FDX},${FT + 8} L${fx - 118},${FB} M${fx + FDX},${FT + 8} L${fx + 98},${FB}`, stroke: '#2E2A2E', 'stroke-width': 1, 'stroke-opacity': .45 }, D));
  FUN.forEach((fx, i) => { const top = FT, base = FB, dx = FDX, w = FW, bk = 26, kb = 1 - bk / (base - top);
    E('path', { d: `M${fx - w},${base} L${fx - w + dx},${top} L${fx + w + dx},${top} L${fx + w},${base} Z`, fill: '#D99A3E' }, D);
    E('path', { d: `M${fx + w * .35},${base} L${fx + w * .35 + dx},${top} L${fx + w + dx},${top} L${fx + w},${base} Z`, fill: '#B97E2C' }, D);
    E('path', { d: `M${fx - w * .6},${base} L${fx - w * .6 + dx},${top}`, stroke: '#F2C070', 'stroke-width': 5, 'stroke-opacity': .7 }, D);
    E('path', { d: `M${f2(fx - w + dx * kb)},${top + bk} L${fx - w + dx},${top} L${fx + w + dx},${top} L${f2(fx + w + dx * kb)},${top + bk} Z`, fill: '#1E1C20' }, D);
    E('path', { d: `M${fx - w + dx},${top} H${fx + w + dx}`, stroke: '#3A363C', 'stroke-width': 4 }, D);
    E('path', { d: `M${fx + w + 3},${base} L${f2(fx + w + 3 + dx * .8)},${top + 22}`, stroke: '#C9A045', 'stroke-width': 3 }, D);
    E('rect', { x: fx - w - 8, y: base - 10, width: w * 2 + 16, height: 10, rx: 3, fill: '#CBBFA6' }, D);
    /* the aft funnel (i = 0) was a dummy ventilator: no smoke */
    if (i > 0) { const sm = itrSmoke(D, fx + dx, top - 3, { n: 8, seed: i * .31, col: SMK, lit: SLIT, a: night ? .72 : .62, dx: -380, dy: -24, grow: 2.4, speed: .09 }); smokes.push(sm); A.push(sm.anim); } });
  /* deckhouse */
  E('rect', { x: 210, y: 152, width: BRX - 210, height: 63, fill: '#EFE9DC' }, D);
  E('rect', { x: 206, y: 148, width: BRX - 202, height: 6, rx: 2, fill: '#D8CFBC' }, D);
  E('rect', { x: 210, y: 200, width: BRX - 210, height: 15, fill: '#000', 'fill-opacity': .07 }, D);
  { let d = ''; for (let x = 222; x < BRX - 12; x += 22) { if (x > 466 && x < 624) continue; d += `M${x},170 h9 v12 h-9 Z `; } E('path', { d, fill: WIN }, D); }
  [300, 760, 1200].forEach(x => { E('rect', { x, y: 176, width: 14, height: 39, fill: '#9A6A3A' }, D); E('rect', { x: x + 2, y: 180, width: 10, height: 8, fill: WIN, 'fill-opacity': .8 }, D); });
  /* grand staircase dome, cut open */
  E('rect', { x: 470, y: 152, width: 150, height: 63, fill: '#BE8A55' }, D);
  E('rect', { x: 470, y: 152, width: 150, height: 63, fill: lgrad([[0, '#FFF2C8', .55], [1, '#FFF2C8', .05]]) }, D);
  E('path', { d: 'M466,152 V215 M624,152 V215', stroke: '#3A3437', 'stroke-width': 8 }, D);
  E('path', { d: 'M470,152 Q470,96 545,92 Q620,96 620,152 Z', fill: '#E4EEF0' }, D);
  E('path', { d: 'M480,152 Q482,104 545,100 Q608,104 610,152 Z', fill: lgrad([[0, '#FFFBEA'], [1, '#FFE7A8']]) }, D);
  E('path', { d: 'M545,92 V152 M508,98 Q500,120 498,152 M582,98 Q590,120 592,152 M478,128 Q545,118 612,128', stroke: '#A8B9C0', 'stroke-width': 2, fill: 'none' }, D);
  itrGlow(D, 545, 130, 110, 60, '#FFE7A8', night ? .5 : .3);
  /* bridge + wheelhouse */
  E('rect', { x: BRX, y: 128, width: WELL - BRX, height: 87, fill: '#F4EFE4' }, D); E('rect', { x: BRX - 4, y: 124, width: WELL - BRX + 12, height: 7, rx: 2, fill: '#D8CFBC' }, D);
  E('rect', { x: WELL - 2, y: 131, width: 8, height: 30, fill: '#E4DDCD' }, D);
  { let d = ''; for (let x = BRX + 8; x < WELL - 10; x += 14) d += `M${x},140 h10 v14 h-10 Z `; E('path', { d, fill: night ? '#FFE7A8' : '#9FB7C7' }, D); }
  E('rect', { x: BRX, y: 176, width: WELL - BRX, height: 39, fill: '#000', 'fill-opacity': .05 }, D);
  /* open well deck: hatch, cargo derrick */
  E('rect', { x: 1442, y: 203, width: 40, height: 12, rx: 2, fill: '#7A5A3A' }, D); E('rect', { x: 1442, y: 203, width: 40, height: 3, fill: '#A07A50' }, D);
  E('path', { d: 'M1490,215 V184 M1490,187 L1452,199', stroke: '#6E5A44', 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, D);
  /* raised forecastle at the bow (sheer rising to the stem) */
  E('path', { d: `M${FC - 4},216 L${FC},198 L1581,192 L1578,216 Z`, fill: '#EFE9DC' }, D);
  E('path', { d: `M${FC},198 L1581,192 L1581,196 L${FC},202 Z`, fill: '#C49A64' }, D);
  E('path', { d: `M${FC - 4},216 L${FC},198 L${FC + 6},198 L${FC + 3},216 Z`, fill: '#000', 'fill-opacity': .12 }, D);
  { let d = ''; [1514, 1532, 1550, 1566].forEach(x => d += `M${x},208 m-2.2,0 a2.2,2.2 0 1 0 4.4,0 a2.2,2.2 0 1 0 -4.4,0 `); E('path', { d, fill: WIN }, D); }
  { let d = `M${FC},188 L1580,182 M${FC},193 L1580,187`; for (let x = FC; x <= 1580; x += 12) d += ` M${x},${f2(198 - (x - FC) * 6 / 82 - 10)} V${f2(198 - (x - FC) * 6 / 82)}`; E('path', { d, stroke: '#F2EEE6', 'stroke-width': 1.4, fill: 'none' }, D); }
  E('rect', { x: 1540, y: 186, width: 9, height: 8, rx: 2, fill: '#3A3437' }, D);
  /* lifeboats in quadrant davits (boats longer than the davits are tall) */
  const boatX = [250, 340, 430, 520, 1000, 1090, 1180, 1270];
  boatX.forEach(bx => { itrBoat(D, bx, 208, 84, { rail: '#5A3A20', coverC: '#E2DAC6' }); itrDavit(D, bx - 46, 214, 30, 1, '#CFC9BB', 186); itrDavit(D, bx + 46, 214, 30, -1, '#CFC9BB', 186); });
  E('rect', { x: 36, y: 211, width: FC - 36, height: 4, fill: '#C49A64' }, D);
  itrRail(D, 40, WELL, 214, 14, '#F2EEE6', 16, 1.6); itrRail(D, WELL, FC - 4, 214, 9, '#F2EEE6', 12, 1.4);
  /* boat-deck slab */
  E('rect', { x: 36, y: 215, width: 1538, height: 10, fill: '#3A3437', 'clip-path': hullClip }, D);

  /* ---------- character rooms: one group per layer, clipped to its room ---------- */
  const RB = { boat: [-1400, -1200, 4400, 1424], first: [0, F0, 1600, S0 - F0], second: [0, S0, 1600, T0 - S0], third: [0, T0, 1600, B0 - T0], boiler: [0, B0, 1600, 880 - B0] };
  const RG = G(g), rooms = {};
  Object.keys(RB).forEach(k => { const [x, y, w, h] = RB[k]; rooms[k] = G(k === 'boat' ? RG : G(RG, { 'clip-path': hullClip }), { 'clip-path': clipRect(x, y, w, h) }); });

  /* ---------- hull cut-face (plating) ---------- */
  const HL = G(g);
  E('path', { d: H, fill: 'none', stroke: '#1F2128', 'stroke-width': 16 }, HL);
  E('path', { d: H, fill: 'none', stroke: '#F2EEE4', 'stroke-width': 16, 'clip-path': clipRect(-100, 205, 1800, 176) }, HL);
  E('path', { d: H, fill: 'none', stroke: '#A8322D', 'stroke-width': 16, 'clip-path': clipRect(-100, 640, 1800, 400) }, HL);
  E('path', { d: H, fill: 'none', stroke: '#D4A73A', 'stroke-width': 18, 'clip-path': clipRect(-100, 379, 1800, 5) }, HL);
  E('path', { d: H, fill: 'none', stroke: '#fff', 'stroke-opacity': .18, 'stroke-width': 4, transform: 'translate(-3,-2)' }, HL);
  /* waterline foam at bow/stern */
  const foam = G(g); E('path', { d: 'M1560,642 q14,-6 28,0 q14,6 28,0 M20,642 q-14,-6 -28,0 q-14,6 -28,0', stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 3, fill: 'none' }, foam);

  /* ---------- labels (under the focus overlays, so they dim with their layer) ---------- */
  const SG = G(g);
  const signs = {
    first: itrPlaque(SG, 145, 236, 'First class', { chain: 10 }),
    second: itrPlaque(SG, 145, 396, 'Second class', { chain: 8, size: 19 }),
    third: itrPlaque(SG, 145, 526, 'Third class', { chain: 8, size: 19 }),
    engine: itrPlaque(SG, 404, 652, 'Engines', { size: 17 }),
    boiler: itrPlaque(SG, 800, 658, 'Boiler rooms', { chain: 10, size: 20 })
  };
  if (o.labels === false) Object.keys(signs).forEach(k => op(signs[k], 0));
  /* ---------- focus overlays: one evenodd path for everything outside the hull
     (no seam in the sky), one rect per layer inside the hull ---------- */
  const dimG = G(g), dims = {};
  dims.outside = E('path', { d: 'M-1400,-1200 H3000 V2000 H-1400 Z ' + H, 'fill-rule': 'evenodd', fill: '#0B0D18' }, dimG);
  { const dimI = G(dimG, { 'clip-path': hullClip });
    const DB = { boat: [190, 225], first: [225, 381], second: [381, 511], third: [511, 641], boiler: [641, 900] };
    Object.keys(DB).forEach(k => { dims[k] = E('rect', { x: -100, y: DB[k][0], width: 1800, height: DB[k][1] - DB[k][0], fill: '#0B0D18' }, dimI); }); }
  Object.keys(dims).forEach(k => op(dims[k], 0));
  if (o.vignette !== false) g.vignette = itrVignette(g, .35);

  const LY = { boat: [0, -300, 1600, 225], first: [36, 225, 1574, 381], second: [36, 381, 1574, 511], third: [36, 511, 1574, 641], boiler: [36, 641, 1574, 880] };
  g.signs = signs; g.layers = LY; g.rooms = rooms;
  g.focus = (name, k = 1) => { const a = .55 * clamp(k);
    Object.keys(dims).forEach(n => op(dims[n], !name ? 0 : n === 'outside' ? (name === 'boat' ? 0 : a) : (n === name ? 0 : a))); };
  g.fade = v => op(g, v);
  g.anchors = {
    boat: { floor: 213, x: [90, 1490], scale: .14 },
    first: { floor: FF, x: [70, 1545], scale: .3, bath: [250, FF], stairs: [610, FF], lounge: [930, FF], pool: [1330, FF] },
    second: { floor: SF, x: [60, 1555], scale: .27, dining: [380, SF], library: [800, SF], cabins: [1130, SF] },
    third: { floor: TF, x: [55, 1555], scale: .27, dance: [440, TF], dining: [850, TF], cabins: [1130, TF] },
    boiler: { floor: BF, x: [170, 1500], scale: .42, engine: [400, BF], catwalk: [300, 800], catwalkX: [215, 590], stokers, stokerFace: stokers.map(() => 1) }
  };
  g.anim = at => {
    A.forEach(f => f(at));
    clouds.forEach(cl => tf(cl.c, -300 + ((cl.off + at * cl.sp) % 2400), cl.y));
    wv.forEach((w, k) => tf(w, -((at * (10 + k * 6)) % 34), 0));
    /* fire, furnaces */
    op(fireGlow, .7 + .3 * wob(at * 4, 1)); fire.setAttribute('transform', `translate(931,366) scale(1,${f2(.85 + .2 * wob(at * 5, 2))}) translate(-931,-366)`);
    const tq = Math.floor(at * 12) / 12;   /* glows flicker at 12 Hz in .05 steps: cheap repaints */
    furn.forEach(f => { const v = Math.round((.62 + .38 * wob(tq * 3.3, f.ph)) * 20) / 20; itrSet(f.gl, 'opacity', f2(v)); if (f.hot) itrSet(f.hot, 'fill', v > .7 ? '#FFB24A' : '#FF8A2A'); });
    lanterns.forEach((l, i) => itrSet(l.glow, 'opacity', f2(Math.round((.78 + .22 * wob(tq * 2.2, i * 3)) * 20) / 20)));
    /* engine: cranks + rods */
    eng.forEach(e => { const th = at * 2.6 + e.ph, R = 17, px = e.cx + R * Math.sin(th), py = 818 - R * Math.cos(th);
      const chy = py - Math.sqrt(52 * 52 - (px - e.cx) * (px - e.cx));
      e.rod.setAttribute('height', f2(Math.max(4, chy - 747))); e.head.setAttribute('y', f2(chy - 5));
      e.con.setAttribute('d', `M${e.cx},${f2(chy)} L${f2(px)},${f2(py)}`); e.pin.setAttribute('cx', f2(px)); e.pin.setAttribute('cy', f2(py));
      e.crank.setAttribute('transform', `translate(${e.cx},818) rotate(${f2(th * 180 / Math.PI)})`); });
    eGauges.forEach((n, i) => n.nd.setAttribute('transform', `translate(614,${n.y}) rotate(${f2(20 + i * 30 + 8 * wob(at * 2, i))})`));
    bGauges.forEach(n => n.nd.setAttribute('transform', `translate(${n.x},${n.y}) rotate(${f2(40 + 10 * wob(at * 1.6, n.ph))})`));
    /* pool */
    let d = '', d2 = ''; for (let x = 1190; x <= 1478; x += 12) { const y = 334 + 1.6 * Math.sin(x * .07 + at * 2.4); d += (d ? ' L' : 'M') + x + ',' + f2(y); d2 = ` L${x},${f2(y + 4)}` + d2; } ripple.setAttribute('d', d + d2 + ' Z');
    tf(caust, Math.sin(at * .9) * 6, 0);
    prop.setAttribute('transform', `translate(141,806) scale(${f2(.35 + .65 * Math.abs(Math.cos(at * 5)))},1)`);
    bunt.setAttribute('transform', `translate(0,${f2(Math.sin(at * 1.3) * 1.2)})`);
    tf(foam, Math.sin(at * 1.4) * 4, 0);
  };
  g.anim(0);
  return g;
}

/* =====================================================================
   2) bgSaloon(parent, o) — first-class dining saloon: Jacobean white
      panelling, backlit leaded windows, chandeliers, round tables, palms,
      the trio's dais with an upright piano.
   Diners and the trio → g.mid (the tablecloths in g.front hide diners' legs);
   a waiter walking in front of the tables (anchors.walkY) → g.over.
   g.tables[i]   front group of table i (0..2, left→right): to pass BEHIND table
                 i but in front of the others use g.front.insertBefore(char.root, g.tables[i])
   g.setDoor(k)  0 = closed .. 1 = open (double doors at the back)
   g.anchors = {
     table1:[480,740], table2:[900,740], table3:[1320,740]   (diner behind table centre)
     seats: [[[405,740],[555,740]], [[825,740],[975,740]], [[1245,740],[1395,740]]]  (sit:true, s:1)
     tableTop: 600 (y of the cloth top), door:[1110,652] (s ≈ .8),
     trio: [[80,672],[195,672],[310,672]], trioScale: .85  (pianist, cellist, violinist),
     walkY: 850 (waiter's line in front of the tables, s:1) }
   ===================================================================== */
function bgSaloon(parent, o = {}) {
  const g = G(parent), A = []; itrFront(g, parent);
  const FL = 652;
  /* --- ceiling: moulded coffers --- */
  E('rect', { x: -200, y: -200, width: 2000, height: 360, fill: '#E9E0CC' }, g);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { const x = -200 + c * 150, y = -192 + r * 76;
    E('rect', { x: x + 8, y: y + 6, width: 134, height: 62, rx: 3, fill: '#DDD1B8' }, g);
    E('rect', { x: x + 14, y: y + 12, width: 122, height: 50, rx: 2, fill: '#E8DECA' }, g);
    E('path', { d: `M${x + 14},${y + 62} H${x + 136} V${y + 12}`, stroke: '#F6F0E2', 'stroke-width': 2.5, fill: 'none' }, g);
    E('circle', { cx: x + 75, cy: y + 37, r: 10, fill: '#D3C4A6' }, g); E('circle', { cx: x + 75, cy: y + 37, r: 5, fill: '#F2EBDC' }, g);
    E('path', { d: `M${x + 4},${y + 3} l4,-6 l4,6 l-4,6 Z`, fill: '#F4EEE2' }, g); }
  E('rect', { x: -200, y: -200, width: 2000, height: 312, fill: lgrad([[0, '#3A2A1A', .35], [1, '#3A2A1A', 0]]) }, g);
  /* --- cornice --- */
  E('rect', { x: -200, y: 106, width: 2000, height: 46, fill: '#F7F1E4' }, g);
  E('rect', { x: -200, y: 106, width: 2000, height: 7, fill: '#D3C6AC' }, g);
  { let d = ''; for (let x = -200; x < 1800; x += 16) d += `M${x},126 h9 v12 h-9 Z `; E('path', { d, fill: '#E2D6BE' }, g); }
  E('rect', { x: -200, y: 117, width: 2000, height: 4, fill: '#FFFFFF' }, g);
  E('rect', { x: -200, y: 146, width: 2000, height: 6, fill: '#CDBFA2' }, g);
  /* --- wall: white Jacobean panelling --- */
  E('rect', { x: -200, y: 152, width: 2000, height: 500, fill: '#F0E8D8' }, g);
  E('rect', { x: -200, y: 152, width: 2000, height: 46, fill: '#E8DECB' }, g);
  { let d = ''; for (let x = -200; x < 1800; x += 30) d += `M${x + 4},194 V180 Q${x + 15},164 ${x + 26},180 V194 Z `; E('path', { d, fill: '#DDD0B6' }, g);
    let d2 = ''; for (let x = -200; x < 1800; x += 30) d2 += `M${x + 8},194 V182 Q${x + 15},172 ${x + 22},182 V194 Z `; E('path', { d: d2, fill: '#EFE6D4' }, g); }
  const rp = (x, y, w, h) => { E('rect', { x, y, width: w, height: h, rx: 2, fill: '#E2D7C2' }, g); E('rect', { x: x + 5, y: y + 5, width: w - 10, height: h - 10, rx: 2, fill: '#F5EFE3' }, g);
    E('path', { d: `M${x + 5},${y + h - 5} V${y + 5} H${x + w - 5}`, stroke: '#FFFFFF', 'stroke-width': 2, fill: 'none' }, g);
    E('path', { d: `M${x + 5},${y + h - 5} H${x + w - 5} V${y + 5}`, stroke: '#D6CAB2', 'stroke-width': 2, fill: 'none' }, g); };
  for (let x = -200; x < 1800; x += 120) { rp(x + 14, 212, 92, 248);
    E('path', { d: `M${x + 60},262 l22,74 l-22,74 l-22,-74 Z`, fill: '#EAE1CF' }, g); E('path', { d: `M${x + 60},282 l14,54 l-14,54 l-14,-54 Z`, fill: '#F5EFE3' }, g);
    rp(x + 14, 474, 92, 72); rp(x + 14, 576, 92, 52); }
  E('rect', { x: -200, y: 554, width: 2000, height: 14, fill: '#E6DBC4' }, g); E('rect', { x: -200, y: 554, width: 2000, height: 3, fill: '#FFFFFF' }, g);
  E('rect', { x: -200, y: 634, width: 2000, height: 20, fill: '#8A6A48' }, g); E('rect', { x: -200, y: 634, width: 2000, height: 4, fill: '#A88560' }, g);
  /* pilasters */
  [-40, 430, 1320, 1700].forEach(px => { E('rect', { x: px - 26, y: 196, width: 52, height: 440, fill: '#F6F0E4' }, g);
    for (let k = -2; k <= 2; k++) E('rect', { x: px + k * 9 - 2.5, y: 236, width: 5, height: 360, rx: 2.5, fill: '#E2D6BE' }, g);
    E('rect', { x: px - 32, y: 196, width: 64, height: 26, fill: '#EDE4D2' }, g); E('rect', { x: px - 34, y: 214, width: 68, height: 8, fill: '#DCCFB4' }, g);
    E('rect', { x: px - 32, y: 600, width: 64, height: 36, fill: '#E6DBC6' }, g);
    E('rect', { x: px + 14, y: 196, width: 12, height: 440, fill: '#000', 'fill-opacity': .05 }, g);
    const sc = itrSconce(g, px, 344, 1.5, '#F3C9B8'); });
  /* backlit leaded windows */
  const leaded = (cx, w = 176, top = 214, bot = 540) => { const ww = w / 2;
    const arch = (k) => `M${cx - ww - k},${bot + k} V${top + ww * .55} Q${cx - ww - k},${top - k} ${cx},${top - k} Q${cx + ww + k},${top - k} ${cx + ww + k},${top + ww * .55} V${bot + k} Z`;
    itrGlow(g, cx, (top + bot) / 2, w * 1.2, 260, '#FFE2A0', .3);
    E('path', { d: arch(16), fill: '#DCCFB4' }, g); E('path', { d: arch(9), fill: '#C9B998' }, g);
    E('path', { d: arch(0), fill: lgrad([[0, '#FFF3D0'], [.55, '#F9D98E'], [1, '#EDB060']]) }, g);
    const L = G(g, { 'clip-path': itrClip(arch(0)) }); let d = '';
    for (let k = -20; k < 30; k++) { const x0 = cx - ww + k * 22; d += `M${x0},${top - 10} L${x0 + 360},${top + 350} M${x0},${top - 10} L${x0 - 360},${top + 350} `; }
    E('path', { d, stroke: '#9A7440', 'stroke-opacity': .45, 'stroke-width': 1.6 }, L);
    /* stained-glass cartouche with a fleur-de-lis, coloured lozenges around it */
    { const m = G(L); tf(m, cx, top + 74);
      E('ellipse', { rx: 34, ry: 46, fill: '#B8863A', 'fill-opacity': .75 }, m); E('ellipse', { rx: 30, ry: 42, fill: '#FBE6A8' }, m);
      E('path', { d: 'M0,-30 Q11,-12 0,6 Q-11,-12 0,-30 Z', fill: '#4E8A5A' }, m);
      [-1, 1].forEach(sd => E('path', { d: `M${sd * 3},2 Q${sd * 25},-6 ${sd * 19},-22 Q${sd * 14},-6 ${sd * 2},-4 Z`, fill: '#5E9A68' }, m));
      E('rect', { x: -13, y: 4, width: 26, height: 6, rx: 2, fill: '#B8863A' }, m); E('path', { d: 'M0,10 L-7,26 H7 Z', fill: '#4E8A5A' }, m);
      [[0, -58, '#C9504A'], [0, 58, '#C9504A'], [-46, 0, '#5A7AB8'], [46, 0, '#5A7AB8']].forEach(([x, y, c]) => E('path', { d: `M${x},${y - 11} l8,11 l-8,11 l-8,-11 Z`, fill: c, 'fill-opacity': .75 }, m)); }
    E('rect', { x: cx - ww, y: top + (bot - top) * .45, width: w, height: 30, fill: '#F2D27E', 'fill-opacity': .45 }, L);
    E('rect', { x: cx - 3, y: top, width: 6, height: bot - top, fill: '#E9E0CC' }, g); E('rect', { x: cx - ww, y: top + (bot - top) * .45 - 3, width: w, height: 6, fill: '#E9E0CC' }, g);
    E('rect', { x: cx - ww - 22, y: bot + 6, width: w + 44, height: 12, rx: 3, fill: '#F7F2E8' }, g); E('rect', { x: cx - ww - 22, y: bot + 15, width: w + 44, height: 4, fill: '#D3C6AC' }, g); };
  leaded(170); leaded(690); leaded(1540);
  /* double doors */
  const DX = 1110;
  E('rect', { x: DX - 104, y: 244, width: 208, height: 392, fill: '#F7F2E8' }, g);
  E('path', { d: `M${DX - 118},248 L${DX - 118},226 L${DX - 30},200 M${DX + 30},200 L${DX + 118},226 L${DX + 118},248 Z`, fill: '#EFE7D6', stroke: '#E0D3B8', 'stroke-width': 10, 'stroke-linejoin': 'round' }, g);
  E('rect', { x: DX - 122, y: 240, width: 244, height: 12, fill: '#E4D8C0' }, g);
  E('circle', { cx: DX, cy: 214, r: 16, fill: '#C9A045' }, g); E('circle', { cx: DX, cy: 214, r: 9, fill: '#E8C96E' }, g);
  E('rect', { x: DX - 86, y: 262, width: 172, height: 374, fill: lgrad([[0, '#FFE0A8'], [1, '#B8743E']]) }, g);
  E('path', { d: `M${DX - 86},636 L${DX - 40},420 H${DX + 40} L${DX + 86},636 Z`, fill: '#9A5A32', 'fill-opacity': .5 }, g);
  E('rect', { x: DX - 40, y: 300, width: 80, height: 120, fill: '#FFF2D0', 'fill-opacity': .6 }, g);
  const leaf = (s) => { const hx = DX + s * 86; const lg = G(g); const inner = G(lg);
    const x0 = s < 0 ? DX - 86 : DX;
    E('rect', { x: x0, y: 262, width: 86, height: 374, fill: '#EDE5D4' }, inner);
    E('rect', { x: x0 + 10, y: 276, width: 66, height: 170, rx: 2, fill: '#C9B998' }, inner);
    E('rect', { x: x0 + 14, y: 280, width: 58, height: 162, fill: lgrad([[0, '#FFF0C8'], [1, '#F2C878']]) }, inner);
    let d = ''; for (let k = -4; k < 10; k++) d += `M${x0 + 14 + k * 14},280 l58,58 M${x0 + 72 - k * 14},280 l-58,58 `;
    E('path', { d, stroke: '#9A7440', 'stroke-opacity': .4, 'stroke-width': 1.3, 'clip-path': clipRect(x0 + 14, 280, 58, 162) }, inner);
    E('rect', { x: x0 + 10, y: 462, width: 66, height: 150, rx: 2, fill: '#E2D7C2' }, inner); E('rect', { x: x0 + 16, y: 468, width: 54, height: 138, rx: 2, fill: '#F4EEE2' }, inner);
    E('circle', { cx: s < 0 ? x0 + 76 : x0 + 10, cy: 452, r: 6, fill: '#C9A045' }, inner);
    return { lg, hx }; };
  const leaves = [leaf(-1), leaf(1)];
  /* --- floor: linoleum tiles in perspective --- */
  { const VP = [800, 240], X = (xa, y) => 800 + (xa - 800) * (y - VP[1]) / (FL - VP[1]);
    const rows = [FL, 668, 688, 714, 748, 792, 848, 920, 1010, 1120]; let dA = '', dB = '', dC = '';
    for (let i = 0; i < rows.length - 1; i++) for (let xa = -1250; xa < 2850; xa += 54) { const j = Math.round((xa + 1250) / 54), y0 = rows[i], y1 = rows[i + 1];
      const poly = `M${f2(X(xa, y0))},${y0} L${f2(X(xa + 54, y0))},${y0} L${f2(X(xa + 54, y1))},${y1} L${f2(X(xa, y1))},${y1} Z `;
      if ((i + j) % 2) dA += poly; else if ((i * 3 + j) % 7 === 0) dC += poly; else dB += poly; }
    E('path', { d: dA, fill: '#DCCAA8' }, g); E('path', { d: dB, fill: '#C9A57A' }, g); E('path', { d: dC, fill: '#9A6448' }, g); }
  E('rect', { x: -200, y: FL, width: 2000, height: 450, fill: lgrad([[0, '#2A1A10', .38], [.25, '#2A1A10', .08], [1, '#2A1A10', .3]]) }, g);
  [480, 900, 1320].forEach(x => itrGlow(g, x, 760, 300, 70, '#FFE2A0', .35));
  /* --- trio corner: dais + upright piano (musicians stand at anchors.trio, scale ≈ .85) --- */
  E('path', { d: 'M-200,640 H410 L432,676 H-200 Z', fill: '#A8743F' }, g);
  { let d = ''; for (let y = 646; y < 676; y += 8) d += `M-200,${y} H${f2(410 + (y - 640) * .6)} `; E('path', { d, stroke: '#8E5E33', 'stroke-width': 1.2 }, g); }
  E('rect', { x: -200, y: 676, width: 632, height: 26, fill: '#6E4426' }, g); E('rect', { x: -200, y: 676, width: 632, height: 4, fill: '#8E5E33' }, g);
  E('path', { d: 'M432,676 L410,640 V648 L424,672 Z', fill: '#5A3620' }, g);
  { const pn = G(g); tf(pn, 70, 648);
    E('ellipse', { cx: 0, cy: 2, rx: 92, ry: 8, fill: '#000', 'fill-opacity': .22 }, pn);
    E('rect', { x: -78, y: -196, width: 156, height: 196, rx: 4, fill: '#3A2218' }, pn); E('rect', { x: -84, y: -204, width: 168, height: 12, rx: 3, fill: '#4E3024' }, pn);
    E('rect', { x: -78, y: -196, width: 156, height: 5, fill: '#5E3A2A' }, pn);
    E('rect', { x: -62, y: -180, width: 124, height: 70, rx: 4, fill: '#4A2C20' }, pn); E('path', { d: 'M-50,-150 q20,-20 50,0 q30,20 50,0', stroke: '#C9A045', 'stroke-width': 2, fill: 'none' }, pn);
    E('rect', { x: -26, y: -174, width: 52, height: 30, rx: 2, fill: '#F4EEE0' }, pn); { let d = ''; for (let k = 0; k < 4; k++) d += `M-22,${-168 + k * 6} h44 `; E('path', { d, stroke: '#3A3020', 'stroke-width': .8, 'stroke-opacity': .6 }, pn); }
    E('rect', { x: -80, y: -96, width: 160, height: 14, fill: '#F6F2EA' }, pn); { let d = ''; for (let k = 0; k < 14; k++) d += `M${-74 + k * 11},-96 v8 `; E('path', { d, stroke: '#1E1A1C', 'stroke-width': 4 }, pn); }
    E('rect', { x: -84, y: -82, width: 168, height: 8, fill: '#4E3024' }, pn);
    E('rect', { x: -70, y: -74, width: 10, height: 74, fill: '#4E3024' }, pn); E('rect', { x: 60, y: -74, width: 10, height: 74, fill: '#4E3024' }, pn);
    E('rect', { x: 66, y: -196, width: 12, height: 196, fill: '#000', 'fill-opacity': .2 }, pn);
    [-60, 60].forEach(x => { E('rect', { x: x - 2, y: -228, width: 4, height: 24, fill: '#C9A045' }, pn); E('ellipse', { cx: x, cy: -232, rx: 3, ry: 5, fill: '#FFE7A8' }, pn); });
    const cg = [-60, 60].map(x => itrGlow(pn, x, -232, 40, 40, '#FFE2A0', .55)); A.push(at => cg.forEach((c, i) => op(c, .75 + .25 * wob(at * 6, i + 2))));
    /* piano stool */
    E('rect', { x: 2, y: 4, width: 44, height: 10, rx: 4, fill: '#7A2E3A' }, pn); E('path', { d: 'M8,14 V30 M40,14 V30', stroke: '#3A2218', 'stroke-width': 4 }, pn); }
  { const pl = itrPalm(g, -150, 642, 1.5, 21); A.push(pl.anim); }
  { const pl = itrPalm(g, 690, 664, 1.55, 7); A.push(pl.anim); }
  { const pl = itrPalm(g, 1550, 664, 1.55, 13); A.push(pl.anim); }
  /* --- chairs behind the tables --- */
  const chairBack = (cx, y) => { const c = G(g);
    E('path', { d: `M${cx - 34},${y + 150} V${y + 30} Q${cx - 34},${y} ${cx},${y - 6} Q${cx + 34},${y} ${cx + 34},${y + 30} V${y + 150} Z`, fill: '#7A4E2E' }, c);
    E('path', { d: `M${cx - 24},${y + 120} V${y + 34} Q${cx - 24},${y + 12} ${cx},${y + 8} Q${cx + 24},${y + 12} ${cx + 24},${y + 34} V${y + 120} Z`, fill: '#3E6B4E' }, c);
    [[0, 30], [-12, 56], [12, 56], [0, 82], [-12, 106], [12, 106]].forEach(([dx, dy]) => E('circle', { cx: cx + dx, cy: y + dy, r: 2.2, fill: '#2C5038' }, c));
    E('path', { d: `M${cx - 14},${y - 2} Q${cx},${y - 16} ${cx + 14},${y - 2}`, stroke: '#8E5E33', 'stroke-width': 5, fill: 'none' }, c);
    E('rect', { x: cx + 18, y: y + 20, width: 8, height: 120, fill: '#000', 'fill-opacity': .1 }, c); };
  const TX3 = [480, 900, 1320];
  TX3.forEach(tx => { chairBack(tx - 75, 470); chairBack(tx + 75, 470); });
  /* --- chandeliers --- */
  TX3.forEach((x, i) => { const c = itrChandelier(g, x, -20, 120, 1.55, 30 + i); A.push(c.anim); });
  if (o.vignette !== false) g.vignette = itrVignette(g, .42);
  /* --- FRONT: tables, music stands --- */
  const lamps = [];
  const tables = [];
  TX3.forEach((tx, ti) => { const t = G(g.front); tables.push(t);
    E('ellipse', { cx: tx, cy: 774, rx: 172, ry: 20, fill: '#000', 'fill-opacity': .22 }, t);
    let hem = ''; for (let k = 0; k <= 8; k++) { const x = tx - 142 + k * 35.5; hem += ` Q${f2(x - 17.75)},${k % 2 ? 772 : 760} ${f2(x)},${766}`; }
    const drape = `M${tx - 132},600 L${tx - 142},766${hem.replace(/^ Q[^ ]+ [^ ]+/, '')} L${tx + 132},600 Z`;
    E('path', { d: drape, fill: '#FBF8F1' }, t);
    [-100, -58, -18, 22, 62, 102].forEach((dx, k) => E('path', { d: `M${tx + dx},612 Q${tx + dx * 1.06 + 4},690 ${tx + dx * 1.08},764`, stroke: '#E7E0D2', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, t));
    E('path', { d: drape, fill: lgrad([[0, '#000', 0], [.55, '#000', 0], [1, '#3A2A1A', .16]], 0, 0, 1, 0) }, t);
    E('ellipse', { cx: tx, cy: 602, rx: 134, ry: 26, fill: '#EAE3D5' }, t);
    E('ellipse', { cx: tx, cy: 599, rx: 132, ry: 24, fill: '#FFFFFF' }, t);
    /* settings */
    [[-78, 592], [78, 592], [-104, 604], [104, 604]].forEach(([dx, dy]) => { E('ellipse', { cx: tx + dx, cy: dy, rx: 20, ry: 5.5, fill: '#F2EEE6', stroke: '#C9A045', 'stroke-width': 1.2 }, t);
      E('ellipse', { cx: tx + dx, cy: dy, rx: 11, ry: 3, fill: '#E9E3D8' }, t);
      E('rect', { x: tx + dx - 28, y: dy - 5, width: 3, height: 9, rx: 1, fill: '#B8BEC8' }, t); E('rect', { x: tx + dx + 25, y: dy - 5, width: 3, height: 9, rx: 1, fill: '#B8BEC8' }, t); });
    [[-50, 590], [50, 590], [-128, 596]].forEach(([dx, dy]) => { E('path', { d: `M${tx + dx},${dy} V${dy - 12} M${tx + dx - 4},${dy} h8`, stroke: '#D6E6F0', 'stroke-width': 1.6 }, t);
      E('path', { d: `M${tx + dx - 6},${dy - 24} Q${tx + dx - 6},${dy - 12} ${tx + dx},${dy - 12} Q${tx + dx + 6},${dy - 12} ${tx + dx + 6},${dy - 24} Z`, fill: '#E6F2FA', 'fill-opacity': .8 }, t);
      if (dx > 0) E('path', { d: `M${tx + dx - 5},${dy - 18} Q${tx + dx},${dy - 13} ${tx + dx + 5},${dy - 18} Z`, fill: '#8E2B3A' }, t); });
    /* silk-shaded table lamp + flowers */
    const lg = itrGlow(t, tx, 560, 120, 70, '#FFD9A0', .55); lamps.push(lg);
    E('rect', { x: tx - 12, y: 590, width: 24, height: 6, rx: 3, fill: '#C9A045' }, t); E('rect', { x: tx - 2.5, y: 556, width: 5, height: 36, fill: '#B88E3A' }, t);
    E('path', { d: `M${tx - 26},560 L${tx + 26},560 L${tx + 16},530 L${tx - 16},530 Z`, fill: '#F4A99E' }, t);
    E('path', { d: `M${tx - 26},560 L${tx + 26},560 L${tx + 24},554 L${tx - 24},554 Z`, fill: '#E58A80' }, t);
    E('path', { d: `M${tx - 26},561 q4,5 8,0 q4,5 8,0 q4,5 8,0 q4,5 8,0 q4,5 8,0 q4,5 8,0 q4,5 8,0`, stroke: '#C9A045', 'stroke-width': 1.5, fill: 'none' }, t);
    E('path', { d: `M${tx + 34},594 Q${tx + 30},584 ${tx + 36},578 Q${tx + 42},584 ${tx + 38},594 Z`, fill: '#DCEBFA', 'fill-opacity': .85 }, t);
    [[-4, -8, '#E84855'], [3, -12, '#FFFFFF'], [8, -6, '#F7C948'], [0, -16, '#E84855']].forEach(([dx, dy, c]) => E('circle', { cx: tx + 36 + dx, cy: 578 + dy, r: 4, fill: c }, t));
  });
  /* music stands beside the cellist and the violinist */
  [138, 252].forEach(x => { const m = G(g.front); E('path', { d: `M${x},668 V560 M${x - 16},668 L${x},640 L${x + 16},668`, stroke: '#B88E3A', 'stroke-width': 3, fill: 'none' }, m);
    E('path', { d: `M${x - 26},560 L${x + 26},560 L${x + 22},526 L${x - 22},526 Z`, fill: '#B88E3A' }, m); E('rect', { x: x - 20, y: 520, width: 40, height: 34, fill: '#FBF7EE', transform: `rotate(-3 ${x} 537)` }, m);
    let d = ''; for (let k = 0; k < 4; k++) d += `M${x - 16},${527 + k * 7} h32 `; E('path', { d, stroke: '#3A3020', 'stroke-width': .8, 'stroke-opacity': .6 }, m); });
  g.tables = tables;
  g.setDoor = k => leaves.forEach((L, i) => L.lg.setAttribute('transform', `translate(${L.hx},0) scale(${f2(Math.cos(clamp(k) * 1.7))},1) translate(${-L.hx},0)`));
  g.anchors = {
    table1: [480, 740], table2: [900, 740], table3: [1320, 740],
    seats: TX3.map(x => [[x - 75, 740], [x + 75, 740]]), tableTop: 600,
    door: [1110, FL], trio: [[80, 672], [195, 672], [310, 672]], trioScale: .85, walkY: 850
  };
  g.anim = at => { A.forEach(f => f(at)); lamps.forEach((l, i) => op(l, .75 + .25 * wob(at * 5, i * 2.3))); };
  g.setDoor(0); g.anim(0);
  return g;
}

/* =====================================================================
   3) bgBoiler(parent, o) — boiler room: three steel boilers end-on, nine
      furnace doors, coal, pipes, gauges, steam, swinging cage lamps.
   Stokers → g.mid; g.front = foreground coal heap + flood water (over them).
   g.setDoor(i, k)  furnace door i (0..8, left→right) open k 0..1
   g.setHeat(k)     fire intensity (default 1; 1.5 = "full speed"; 0 = fires out)
   g.setGauge(v)    pressure needles 0..1 (default .6)
   g.setWater(h)    flood 0 (dry) .. 1 (chest-high); the fires dim, hiss and die as it rises
   g.anchors = {
     stokers: [[145,795],[555,795],[1045,795],[1455,795]]  (s:1, beside doors 1,3,5,7 so the fire stays visible)
     stokerFace: [1,1,-1,-1]  (+1 = his door is to his right; -1 = to his left → flip:true)
     stokerDoor: [1,3,5,7], doors: [[x,558]×9] (door centres: x 90,240,390,650,800,950,1210,1360,1510),
     floor: 795, bunker: [520,700], bunkers: [[520,700],[1080,700]], gauge: [[x,y]×3] }
   ===================================================================== */
function bgBoiler(parent, o = {}) {
  const g = G(parent), A = []; itrFront(g, parent);
  const FL = 700, BC = [240, 800, 1360], CY = 362, R = 255;
  let heat = 1, gaugeV = .6;
  E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#2A2225' }, g);
  { let d = ''; for (let x = -180; x < 1800; x += 130) d += `M${x},-200 V${FL} `; for (let y = -150; y < FL; y += 110) d += `M-200,${y} H1800 `;
    E('path', { d, stroke: '#211A1D', 'stroke-width': 4 }, g);
    let r = ''; for (let x = -180; x < 1800; x += 130) for (let y = -190; y < FL; y += 16) r += `M${x + 7},${y} m-2,0 a2,2 0 1 0 4,0 a2,2 0 1 0 -4,0 `;
    for (let y = -150; y < FL; y += 110) for (let x = -200; x < 1800; x += 16) r += `M${x},${y + 7} m-2,0 a2,2 0 1 0 4,0 a2,2 0 1 0 -4,0 `;
    E('path', { d: r, fill: '#3A3034' }, g); }
  E('rect', { x: -200, y: -200, width: 2000, height: 900, fill: lgrad([[0, '#000', .45], [.5, '#000', 0], [1, '#FF7A2A', .12]]) }, g);
  /* --- overhead pipes --- */
  E('rect', { x: -200, y: 18, width: 2000, height: 46, fill: '#CFC6B8' }, g); E('rect', { x: -200, y: 46, width: 2000, height: 18, fill: '#000', 'fill-opacity': .14 }, g);
  E('rect', { x: -200, y: 22, width: 2000, height: 6, fill: '#FFFFFF', 'fill-opacity': .35 }, g);
  { let d = ''; for (let x = -180; x < 1800; x += 90) d += `M${x},18 h10 v46 h-10 Z `; E('path', { d, fill: '#A89F92' }, g); }
  E('rect', { x: -200, y: 78, width: 2000, height: 12, rx: 6, fill: '#B5653A' }, g); E('rect', { x: -200, y: 78, width: 2000, height: 4, fill: '#E09060', 'fill-opacity': .6 }, g);
  E('rect', { x: -200, y: 98, width: 2000, height: 9, rx: 4, fill: '#6E7378' }, g);
  { let d = ''; for (let x = -150; x < 1800; x += 260) d += `M${x},-200 V18 M${x + 6},-200 V18 `; E('path', { d, stroke: '#1A1517', 'stroke-width': 3 }, g); }
  const wheelV = (x, y, r = 16) => { const w = G(g); tf(w, x, y); E('circle', { r, fill: 'none', stroke: '#B8362E', 'stroke-width': 5 }, w);
    E('path', { d: `M${-r},0 H${r} M0,${-r} V${r}`, stroke: '#B8362E', 'stroke-width': 3 }, w); E('circle', { r: 4, fill: '#7A2420' }, w); return w; };
  [520, 1080].forEach(x => { E('rect', { x: x - 10, y: 64, width: 20, height: 40, fill: '#A89F92' }, g); wheelV(x, 120); });
  /* --- boilers --- */
  const doors = [], fires = [], glowG = [], floorG = [], gauges = [], dAnch = [];
  BC.forEach((cx, bi) => {
    E('rect', { x: cx - 215, y: CY + 150, width: 430, height: FL - CY - 150, fill: '#231C1E' }, g);
    /* boiler end: flat steel plates with lap seams and rivet rows (matte, no shine) */
    const yT = CY - R * .45, wT = R * .893, yB = CY + R * .5, wB = R * .866;
    E('circle', { cx, cy: CY, r: R + 18, fill: '#1A1C1F' }, g);
    E('circle', { cx, cy: CY, r: R, fill: '#4A4F55' }, g);
    E('path', { d: `M${f2(cx - wT)},${f2(yT)} A${R},${R} 0 0 1 ${f2(cx + wT)},${f2(yT)} Z`, fill: '#535960' }, g);
    E('path', { d: `M${f2(cx - wB)},${f2(yB)} A${R},${R} 0 0 0 ${f2(cx + wB)},${f2(yB)} Z`, fill: '#40454B' }, g);
    E('circle', { cx, cy: CY, r: R, fill: lgrad([[0, '#FF8A3A', 0], [.62, '#FF8A3A', 0], [1, '#FF8A3A', .26]]) }, g);
    E('circle', { cx, cy: CY, r: R - 10, fill: 'none', stroke: '#2C3034', 'stroke-width': 4 }, g);
    E('path', { d: `M${f2(cx - wT)},${f2(yT)} H${f2(cx + wT)} M${f2(cx - wB)},${f2(yB)} H${f2(cx + wB)}`, stroke: '#2C3034', 'stroke-width': 4 }, g);
    E('path', { d: `M${f2(cx - R * .94)},${f2(CY - R * .34)} A${R - 3},${R - 3} 0 0 1 ${f2(cx + R * .94)},${f2(CY - R * .34)}`, stroke: '#6E757C', 'stroke-width': 3, fill: 'none', 'stroke-opacity': .55 }, g);
    { let d = '', h = ''; const rv = (x, y) => { d += `M${f2(x)},${f2(y)} m-2.6,0 a2.6,2.6 0 1 0 5.2,0 a2.6,2.6 0 1 0 -5.2,0 `; h += `M${f2(x - 1)},${f2(y - 1)} m-.9,0 a.9,.9 0 1 0 1.8,0 a.9,.9 0 1 0 -1.8,0 `; };
      for (let k = 0; k < 56; k++) { const a = k / 56 * Math.PI * 2; rv(cx + Math.cos(a) * (R - 22), CY + Math.sin(a) * (R - 22)); }
      for (let x = cx - wT + 30; x < cx + wT - 28; x += 15) { rv(x, yT - 8); rv(x, yT + 8); }
      for (let x = cx - wB + 30; x < cx + wB - 28; x += 15) { rv(x, yB - 8); rv(x, yB + 8); }
      E('path', { d, fill: '#2A2D31' }, g); E('path', { d: h, fill: '#7A8188', 'fill-opacity': .7 }, g); }
    /* smoke-box doors */
    E('rect', { x: cx - 150, y: CY - 196, width: 300, height: 170, rx: 26, fill: '#3B3436' }, g);
    E('rect', { x: cx - 144, y: CY - 190, width: 140, height: 158, rx: 20, fill: '#463F41' }, g); E('rect', { x: cx + 4, y: CY - 190, width: 140, height: 158, rx: 20, fill: '#463F41' }, g);
    [-1, 1].forEach(s => { E('rect', { x: cx + s * 24 - 5, y: CY - 130, width: 10, height: 40, rx: 4, fill: '#7A7072' }, g); [CY - 168, CY - 58].forEach(y => E('rect', { x: s < 0 ? cx - 156 : cx + 140, y: y - 10, width: 16, height: 20, rx: 3, fill: '#2E2729' }, g)); });
    E('rect', { x: cx - 2, y: CY - 192, width: 4, height: 162, fill: '#2E2729' }, g);
    /* brass plate */
    E('rect', { x: cx - 34, y: CY - 16, width: 68, height: 24, rx: 4, fill: '#C9A045' }, g); E('rect', { x: cx - 30, y: CY - 12, width: 60, height: 16, rx: 3, fill: '#B88E3A' }, g);
    TX(g, cx, CY + 1, 'No. ' + (bi + 1), 13, '#3A2A10', { a: 'middle', w: 800 });
    /* water gauge glasses */
    [-206, -180].forEach((dx, k) => { E('rect', { x: cx + dx - 6, y: CY - 110, width: 12, height: 12, fill: '#C9A045' }, g); E('rect', { x: cx + dx - 6, y: CY - 10, width: 12, height: 12, fill: '#C9A045' }, g);
      E('rect', { x: cx + dx - 4, y: CY - 98, width: 8, height: 88, fill: '#BFE4F0', 'fill-opacity': .5 }, g); E('rect', { x: cx + dx - 4, y: CY - 54, width: 8, height: 44, fill: '#4DA6C8', 'fill-opacity': .85 }, g); });
    /* pressure gauge */
    const gx = cx + 186, gy = CY - 108; E('path', { d: `M${gx},${gy + 30} V${CY - 40}`, stroke: '#B88E3A', 'stroke-width': 5 }, g);
    E('circle', { cx: gx, cy: gy, r: 36, fill: '#C9A045' }, g); E('circle', { cx: gx, cy: gy, r: 30, fill: '#FBF7EE' }, g);
    E('path', { d: `M${f2(gx + Math.cos(-.35) * 24)},${f2(gy + Math.sin(-.35) * 24)} A24,24 0 0 1 ${f2(gx + Math.cos(.55) * 24)},${f2(gy + Math.sin(.55) * 24)}`, stroke: '#E84855', 'stroke-width': 5, fill: 'none' }, g);
    { let d = ''; for (let k = 0; k <= 10; k++) { const a = (-210 + k * 24) * Math.PI / 180; d += `M${f2(gx + Math.cos(a) * 26)},${f2(gy + Math.sin(a) * 26)} L${f2(gx + Math.cos(a) * (k % 5 ? 22 : 19))},${f2(gy + Math.sin(a) * (k % 5 ? 22 : 19))} `; }
      E('path', { d, stroke: '#2B2B35', 'stroke-width': 1.8 }, g); }
    const nd = E('path', { d: 'M0,4 L0,-24', stroke: '#2B2B35', 'stroke-width': 3, 'stroke-linecap': 'round' }, g); E('circle', { cx: gx, cy: gy, r: 4, fill: '#2B2B35' }, g);
    gauges.push({ nd, x: gx, y: gy, ph: bi * 2.1 });
    /* furnaces */
    [-150, 0, 150].forEach((dx, k) => { const fx = cx + dx, fy = CY + 196, w = 100, h = 88;
      dAnch.push([fx, fy]);
      E('rect', { x: fx - w / 2 - 10, y: fy - h / 2 - 10, width: w + 20, height: h + 20, rx: 38, fill: '#2A2426' }, g);
      const fire = G(g);
      E('rect', { x: fx - w / 2, y: fy - h / 2, width: w, height: h, rx: 30, fill: rgrad([[0, '#FFF4B8'], [.45, '#FFB040'], [1, '#C8401A']], .5, .6, .6) }, fire);
      const fl = G(fire); E('path', { d: `M${fx - 40},${fy + 40} Q${fx - 34},${fy - 8} ${fx - 22},${fy + 10} Q${fx - 14},${fy - 30} ${fx},${fy + 4} Q${fx + 12},${fy - 26} ${fx + 22},${fy + 8} Q${fx + 34},${fy - 6} ${fx + 40},${fy + 40} Z`, fill: '#FFE07A' }, fl);
      E('path', { d: `M${fx - 44},${fy + 44} H${fx + 44}`, stroke: '#7A2A10', 'stroke-width': 8 }, fire);
      fires.push({ fl, fx, fy, ph: hash(fx) * 9 });
      const leafG = G(g); const hx = fx - w / 2;
      E('rect', { x: fx - w / 2, y: fy - h / 2, width: w, height: h, rx: 30, fill: '#3E3739' }, leafG);
      E('rect', { x: fx - w / 2 + 6, y: fy - h / 2 + 6, width: w - 12, height: h - 12, rx: 25, fill: '#4A4345' }, leafG);
      const slots = []; for (let s = 0; s < 3; s++) slots.push(E('rect', { x: fx - 26, y: fy - 16 + s * 14, width: 52, height: 6, rx: 3, fill: '#FF9A3A' }, leafG));
      E('rect', { x: fx + 24, y: fy - 4, width: 30, height: 8, rx: 4, fill: '#8A8284' }, leafG); E('circle', { cx: fx + 52, cy: fy, r: 6, fill: '#9A9294' }, leafG);
      E('rect', { x: hx - 6, y: fy - 30, width: 12, height: 14, rx: 3, fill: '#2A2426' }, leafG); E('rect', { x: hx - 6, y: fy + 16, width: 12, height: 14, rx: 3, fill: '#2A2426' }, leafG);
      doors.push({ leafG, hx, slots, gl: null, fg: null, fire, k: 0, bi, fx, fy, sub: 0 });
      /* ash-pit door */
      E('rect', { x: fx - 40, y: FL - 46, width: 80, height: 34, rx: 6, fill: '#352E30' }, g); E('rect', { x: fx - 30, y: FL - 34, width: 60, height: 5, rx: 2, fill: '#5A1E10' }, g);
    });
    /* the three door glows of this boiler flicker together (one group = cheap) */
    const gg = G(g); glowG.push(gg); doors.forEach(d => { if (d.bi === bi) d.gl = itrGlow(gg, d.fx, d.fy + 10, 110, 90, '#FF9A3A', .5); });
  });
  /* between boilers: bunker door, lamps */
  [520, 1080].forEach((x, i) => { E('rect', { x: x - 34, y: 470, width: 68, height: FL - 470, fill: '#1E181A' }, g); E('rect', { x: x - 30, y: 474, width: 60, height: 70, fill: '#3E3739' }, g);
    E('rect', { x: x - 30, y: 474, width: 60, height: 8, fill: '#57504F' }, g);
    let d = `M${x - 30},${FL} Q${x - 20},${560} ${x},${548} Q${x + 20},${560} ${x + 30},${FL} Z`; E('path', { d, fill: '#1A1719' }, g); });
  const lamps = [520, 1080, -40, 1640].map((x, i) => itrCageLamp(g, x, -20, i < 2 ? 300 : 230, 1.1, '#FFD27A'));
  /* --- floor: chequer plate --- */
  E('rect', { x: -200, y: FL, width: 2000, height: 420, fill: '#3A3234' }, g);
  { const VP = [800, 200], X = (xa, y) => 800 + (xa - 800) * (y - VP[1]) / (FL - VP[1]); let d = '';
    [FL, 724, 756, 798, 852, 920, 1010, 1120].forEach(y => d += `M-200,${y} H1800 `);
    for (let xa = -1300; xa < 2900; xa += 90) d += `M${f2(X(xa, FL))},${FL} L${f2(X(xa, 1120))},1120 `;
    E('path', { d, stroke: '#2A2325', 'stroke-width': 3 }, g);
    let t = ''; for (let r = 0; r < 26; r++) for (let c = 0; c < 46; c++) { const y = FL + 10 + r * r * 1.1 + r * 10, x = -200 + c * 44 + (r % 2) * 22; if (y > 1110) continue;
      const s = .6 + (y - FL) / 300; t += `M${f2(x)},${f2(y)} l${f2(6 * s)},${f2(-3 * s)} `; }
    E('path', { d: t, stroke: '#4A4144', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g); }
  E('rect', { x: -200, y: FL, width: 2000, height: 40, fill: lgrad([[0, '#000', .45], [1, '#000', 0]]) }, g);
  BC.forEach((cx, bi) => { const fg = G(g); floorG.push(fg); doors.forEach(d => { if (d.bi === bi) d.fg = itrGlow(fg, d.fx, FL + 60, 150, 46, '#FF8A2A', .5); }); });
  BC.forEach(cx => itrGlow(g, cx, FL + 120, 420, 140, '#FF7A2A', .22));
  /* coal heaps on the floor + scattered lumps */
  const heap = (P, x, y, w, h, seed) => { E('path', { d: `M${x - w},${y} Q${x - w * .55},${y - h * 1.15} ${x},${y - h} Q${x + w * .55},${y - h * 1.15} ${x + w},${y} Z`, fill: '#1C191B' }, P);
    let d = ''; for (let k = 0; k < w * .5; k++) { const lx = x - w * .85 + hash(k + seed) * w * 1.7, ly = y - 4 - hash(k * 3 + seed) * h * .95 * Math.max(0, 1 - Math.pow((lx - x) / w, 2));
      const s = 4 + hash(k * 7 + seed) * 5; d += `M${f2(lx)},${f2(ly)} l${f2(s)},${f2(-s * .7)} l${f2(s * .9)},${f2(s * .3)} l${f2(-s * .2)},${f2(s)} l${f2(-s)},${f2(s * .4)} Z `; }
    E('path', { d, fill: '#3A3537' }, P);
    let hl = ''; for (let k = 0; k < w * .15; k++) { const lx = x - w * .6 + hash(k * 5 + seed) * w * 1.2, ly = y - h * .3 - hash(k * 9 + seed) * h * .6 * Math.max(0, 1 - Math.pow((lx - x) / w, 2)); hl += `M${f2(lx)},${f2(ly)} l4,-2 `; }
    E('path', { d: hl, stroke: '#7A7276', 'stroke-width': 2, 'stroke-linecap': 'round' }, P); };
  heap(g, 445, 760, 95, 62, 3); heap(g, 1150, 760, 100, 58, 9); heap(g, 520, 712, 60, 30, 5); heap(g, 1080, 712, 60, 30, 7);
  { let d = ''; for (let k = 0; k < 60; k++) { const x = -150 + hash(k * 2.3) * 1900, y = 730 + hash(k * 5.1) * 300, s = 3 + hash(k) * 5; d += `M${f2(x)},${f2(y)} l${f2(s)},${f2(-s * .6)} l${f2(s)},${f2(s * .5)} l${f2(-s * .6)},${f2(s * .7)} Z `; }
    E('path', { d, fill: '#1E1A1C' }, g); }
  /* shovels + slice bar leaning */
  const shovel = (x, y, r) => { const s = G(g); tf(s, x, y, r); E('rect', { x: -4, y: -230, width: 8, height: 200, rx: 3, fill: '#8A5A33' }, s); E('path', { d: 'M-12,-236 H12 V-224 H-12 Z', fill: '#6B4426' }, s);
    E('path', { d: 'M-26,-32 H26 L22,30 Q0,40 -22,30 Z', fill: '#5A5F66' }, s); E('path', { d: 'M-26,-32 H26 L24,-18 H-24 Z', fill: '#7A8088' }, s); };
  shovel(380, 700, 14); shovel(1210, 700, -12); shovel(1500, 700, 8);
  E('path', { d: 'M640,700 L560,470', stroke: '#5A5F66', 'stroke-width': 7, 'stroke-linecap': 'round' }, g); E('path', { d: 'M560,470 l-18,8', stroke: '#5A5F66', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  /* steam puffs from pipe joints */
  const st1 = steam(g, 4, 110, '#FFFFFF'); tf(st1, 300, 66); A.push(st1.anim);
  const st2 = steam(g, 3, 90, '#FFFFFF'); tf(st2, 1240, 66); A.push(st2.anim);
  const jet = G(g); const jets = [0, 1, 2, 3, 4].map(i => E('ellipse', { rx: 18, ry: 10, fill: '#FFFFFF' }, jet));
  if (o.vignette !== false) g.vignette = itrVignette(g, .55, .4);
  /* --- FRONT: foreground coal heap, flood water --- */
  heap(g.front, -60, 930, 200, 120, 11);
  const water = G(g.front);
  const wBody = E('path', { fill: '#1E5A7A', 'fill-opacity': .55 }, water);
  const wTop = E('path', { fill: 'none', stroke: '#9FD8F0', 'stroke-width': 4, 'stroke-opacity': .7 }, water);
  /* steam hissing where the sea reaches a furnace */
  const hiss = doors.map(d => { const q = G(g.front); E('ellipse', { rx: 22, ry: 14, fill: '#F2F4F8' }, q); E('ellipse', { cx: 12, cy: -8, rx: 15, ry: 11, fill: '#FFFFFF' }, q); op(q, 0); return q; });
  let waterH = 0;
  g.setDoor = (i, k) => { const d = doors[i]; if (!d) return; d.k = clamp(k); itrSet(d.leafG, 'transform', `translate(${d.hx},0) scale(${f2(Math.cos(d.k * 1.95))},1) translate(${-d.hx},0)`); };
  g.setHeat = k => { heat = k; };
  g.setGauge = v => { gaugeV = v; };
  g.setWater = h => { waterH = clamp(h); };
  g.anchors = { stokers: [[145, 795], [555, 795], [1045, 795], [1455, 795]], stokerFace: [1, 1, -1, -1], stokerDoor: [1, 3, 5, 7], doors: dAnch, floor: 795, bunker: [520, 700], bunkers: [[520, 700], [1080, 700]], gauge: gauges.map(q => [q.x, q.y]) };
  g.anim = at => {
    A.forEach(f => f(at));
    const wy = waterH > 0 ? lerp(905, 560, waterH) : 2000;
    /* fire flicker: sampled at 12 Hz and in .05 steps, written only on change
       (the big glow layers are the most expensive thing to repaint) */
    const tq = Math.floor(at * 12) / 12, fl = BC.map((_, bi) => .6 + .4 * wob(tq * 3.2, bi * 2.7));
    glowG.forEach((q, bi) => itrSet(q, 'opacity', f2(Math.round(fl[bi] * 20) / 20))); floorG.forEach((q, bi) => itrSet(q, 'opacity', f2(Math.round((.75 + .25 * fl[bi]) * 20) / 20)));
    doors.forEach((d, i) => { const sub = clamp((d.fy + 44 - wy) / 88), lit = 1 - clamp(Math.max((FL - wy) / 140, sub * 1.5)), sF = clamp((FL + 62 - wy) / 50);
      const base = clamp(heat * (1 + d.k * .6), 0, 1.6);
      itrSet(d.gl, 'opacity', f2(clamp(base * (.45 + d.k * .55)) * lit)); itrSet(d.fg, 'opacity', f2(clamp(base * (.55 + d.k * .45)) * lit * (1 - sF)));
      itrSet(d.fire, 'opacity', f2(lit * clamp(heat))); const hot = fl[d.bi] * base > .8;
      d.slots.forEach(s => { itrSet(s, 'fill', hot ? '#FFB24A' : '#FF8A2A'); itrSet(s, 'opacity', f2(lit * clamp(heat * 1.5))); });
      const hs = hiss[i]; if (lit > 0 && lit < 1 && heat > 0) { const ph = (at * 1.2 + i * .37) % 1; op(hs, .8 * Math.sin(ph * Math.PI) * Math.min(1, lit * 3));
        tf(hs, d.fx - 30 + ph * 40 + Math.sin(at * 3 + i) * 6, Math.min(wy, d.fy + 40) - 8 - ph * 80, 0, .6 + ph * 1.4); } else op(hs, 0); });
    fires.forEach(f => f.fl.setAttribute('transform', `translate(${f.fx},${f.fy + 40}) scale(${f2(1 + .06 * wob(at * 7, f.ph))},${f2(.8 + .3 * Math.abs(wob(at * 6, f.ph + 1)) * Math.min(1.4, heat))}) translate(${-f.fx},${-f.fy - 40})`));
    gauges.forEach(q => q.nd.setAttribute('transform', `translate(${q.x},${q.y}) rotate(${f2(-120 + gaugeV * 240 + 4 * wob(at * 2.5, q.ph))})`));
    lamps.forEach((l, i) => { op(l.glow, .8 + .2 * wob(at * 2, i)); l.setAttribute('transform', `translate(${[520, 1080, -40, 1640][i]},-20) rotate(${f2(Math.sin(at * .8 + i) * 1.2)})`); });
    jets.forEach((e, i) => { const ph = (at * 1.1 + i / 5) % 1; tf(e, 1300 + ph * 120, 104 + ph * 30, 0, .4 + ph * 2.2); op(e, .5 * (1 - ph) * Math.min(1, ph * 8)); });
    if (waterH > 0) { const y = lerp(905, 560, waterH); let d = '', d2 = '';
      for (let x = -200; x <= 1800; x += 40) d += (d ? ' L' : 'M') + x + ',' + f2(y + 5 * Math.sin(x * .02 + at * 2.2) + 3 * Math.sin(x * .05 - at * 3));
      wBody.setAttribute('d', d + ' L1800,1120 L-200,1120 Z'); wTop.setAttribute('d', d); op(water, 1); } else op(water, 0);
  };
  g.anim(0);
  return g;
}

/* telegram form (small sheet with a coloured header band) */
function itrForm(p, x, y, r = 0, s = 1, band = '#9FB4C8') {
  const f = G(p); tf(f, x, y, r, s);
  E('rect', { x: -20, y: -25, width: 44, height: 56, fill: '#000', 'fill-opacity': .16 }, f);
  E('rect', { x: -22, y: -28, width: 44, height: 56, fill: '#F6EFD9' }, f);
  E('rect', { x: -22, y: -28, width: 44, height: 9, fill: band }, f);
  E('path', { d: 'M-16,-12 h32 M-16,-5 h26 M-16,2 h32 M-16,9 h18 M-16,16 h24', stroke: '#B9AE95', 'stroke-width': 1.6 }, f);
  return f;
}

/* =====================================================================
   4) bgWireless(parent, o) — the wireless room at night.
   The operator sits in g.mid at anchors.seat ({sit:true}); g.front = the desk
   with Morse key, detector, tuner, spike and telegram pile (hides his legs).
   g.setClock(h, m)  wall clock (default 11:40)
   g.setPile(k)      telegram pile on the desk 0..1 (default .5)
   g.setSpark(k)     spark gap: 0 = silent, .55 = idle crackle (default), 1 = roaring
   g.setKey(d)       Morse key pressed 0..1 (lever dips, contact spark when d > .6)
   g.anchors = { seat:[760,765], key:[836,572] (top of the key's knob — put a hand here),
     pile:[520,642], tube:[120,330], basket:[140,390] (overflowing wire basket under the tube),
     wasteBasket:[360,820], spark:[1325,420], clock:[590,250], porthole:[960,270], floorPile:[170,700] }
   ===================================================================== */
function bgWireless(parent, o = {}) {
  const g = G(parent), A = []; itrFront(g, parent);
  const FL = 652;
  /* walls */
  E('rect', { x: -200, y: -200, width: 2000, height: 860, fill: '#E9DDC3' }, g);
  E('rect', { x: -200, y: -200, width: 2000, height: 250, fill: '#DCCFB2' }, g);
  { let d = ''; for (let x = -200; x < 1800; x += 170) d += `M${x},-200 h22 v250 h-22 Z `; E('path', { d, fill: '#CDBF9F' }, g); }
  E('rect', { x: -200, y: 44, width: 2000, height: 12, fill: '#8E5E36' }, g);
  { let d = ''; for (let x = -200; x < 1800; x += 46) d += `M${x},60 V400 `; E('path', { d, stroke: '#E0D3B6', 'stroke-width': 3 }, g); }
  E('rect', { x: -200, y: 396, width: 2000, height: 12, fill: '#7A4E2E' }, g); E('rect', { x: -200, y: 396, width: 2000, height: 3, fill: '#A87A4E' }, g);
  E('rect', { x: -200, y: 408, width: 2000, height: 246, fill: '#8E5E36' }, g);
  for (let x = -190; x < 1800; x += 130) { E('rect', { x: x + 10, y: 428, width: 108, height: 196, rx: 3, fill: '#7E5230' }, g); E('rect', { x: x + 16, y: 434, width: 96, height: 184, rx: 2, fill: '#946440' }, g);
    E('rect', { x: x + 16, y: 434, width: 96, height: 4, fill: '#B0825A' }, g); }
  E('rect', { x: -200, y: 636, width: 2000, height: 18, fill: '#5A3820' }, g);
  /* floor */
  E('rect', { x: -200, y: FL, width: 2000, height: 460, fill: '#6E4A32' }, g);
  { const X = (xa, y) => 800 + (xa - 800) * (y - 200) / (FL - 200); let d = '';
    for (let xa = -1200; xa < 2800; xa += 70) d += `M${f2(X(xa, FL))},${FL} L${f2(X(xa, 1110))},1110 `;
    E('path', { d, stroke: '#5E3E2A', 'stroke-width': 3 }, g); }
  E('rect', { x: -200, y: FL, width: 2000, height: 60, fill: lgrad([[0, '#000', .4], [1, '#000', 0]]) }, g);
  /* ceiling lamp (green glass) */
  const lampG = itrGlow(g, 760, 420, 560, 380, '#FFE2A0', .32);
  E('path', { d: 'M760,-200 V96', stroke: '#2B2622', 'stroke-width': 3 }, g);
  E('path', { d: 'M712,130 Q714,94 760,92 Q806,94 808,130 Z', fill: '#2E7A4E' }, g); E('path', { d: 'M760,92 Q806,94 808,130 H770 Z', fill: '#000', 'fill-opacity': .15 }, g);
  E('ellipse', { cx: 760, cy: 130, rx: 48, ry: 7, fill: '#24603C' }, g); E('ellipse', { cx: 760, cy: 132, rx: 18, ry: 5, fill: '#FFF2C4' }, g);
  E('path', { d: 'M716,124 Q722,104 744,98', stroke: '#7FC79A', 'stroke-width': 3, fill: 'none', 'stroke-opacity': .6 }, g);
  /* call-sign plate */
  { const pl = G(g); tf(pl, 760, 182); E('rect', { x: -58, y: -22, width: 116, height: 44, rx: 6, fill: '#B88E3A' }, pl); E('rect', { x: -52, y: -16, width: 104, height: 32, rx: 4, fill: '#2A2622' }, pl);
    TX(pl, 0, 9, 'M G Y', 22, '#F0D27E', { a: 'middle', w: 800, ls: 2 }); }
  /* clock */
  const CK = [590, 250];
  { const c = G(g); tf(c, CK[0], CK[1]); E('circle', { r: 64, fill: '#000', 'fill-opacity': .18, cx: 4, cy: 6 }, c); E('circle', { r: 62, fill: '#6B4A2B' }, c); E('circle', { r: 55, fill: '#B88E3A' }, c); E('circle', { r: 50, fill: '#FBF7EE' }, c);
    for (let i = 0; i < 60; i++) { const a = i * 6; E('rect', { x: -1, y: -47, width: 2, height: i % 5 ? 4 : 9, fill: '#3A3020', transform: `rotate(${a})` }, c); }
    [[12, 0, -30], [3, 31, 6], [6, 0, 40], [9, -31, 6]].forEach(([n, x, y]) => TX(c, x, y, String(n), 13, '#3A3020', { a: 'middle', w: 800 }));
    E('path', { d: 'M-24,-6 A26,26 0 0 1 0,-26', stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 4, fill: 'none' }, c); }
  const hHand = E('path', { d: 'M-3,6 L0,-28 L3,6 Z', fill: '#2B2B35' }, g), mHand = E('path', { d: 'M-2,7 L0,-42 L2,7 Z', fill: '#2B2B35' }, g);
  E('circle', { cx: CK[0], cy: CK[1], r: 4, fill: '#C0392B' }, g);
  /* porthole (night) */
  const PH = [960, 270];
  itrGlow(g, PH[0], PH[1], 90, 90, '#6E8CD8', .2);
  itrPorthole(g, PH[0], PH[1], 62, { mode: 'night' });
  /* pinned notice board with forms */
  { E('rect', { x: 330, y: 150, width: 150, height: 190, rx: 4, fill: '#7A4E2E' }, g); E('rect', { x: 338, y: 158, width: 134, height: 174, fill: '#A88A62' }, g); }
  const pinned = [[370, 196, -6], [440, 190, 5], [372, 270, 4], [442, 282, -3]].map(([x, y, r], i) => { const f = itrForm(g, x, y, r, 1, i === 3 ? '#E8A0A0' : '#9FB4C8'); E('circle', { cx: 0, cy: -24, r: 3.5, fill: '#E84855' }, f); return { f, x, y, r, ph: i * 1.7 }; });
  /* pneumatic tube + overflowing basket (left) */
  E('rect', { x: 104, y: -200, width: 32, height: 500, fill: '#B88E3A' }, g); E('rect', { x: 104, y: -200, width: 9, height: 500, fill: '#E2BE62' }, g); E('rect', { x: 128, y: -200, width: 8, height: 500, fill: '#8A6526' }, g);
  [40, 160].forEach(y => E('rect', { x: 98, y, width: 44, height: 10, rx: 3, fill: '#8A6526' }, g));
  E('path', { d: 'M88,300 H152 L144,336 H96 Z', fill: '#C9A045' }, g); E('ellipse', { cx: 120, cy: 336, rx: 26, ry: 6, fill: '#3A2A10' }, g);
  E('path', { d: 'M150,304 l22,-10', stroke: '#8A6526', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  /* wire basket */
  E('path', { d: 'M40,380 H250 L234,450 H56 Z', fill: '#3A3436', 'fill-opacity': .3 }, g);
  const basketPapers = []; for (let i = 0; i < 14; i++) { const x = 60 + hash(i * 3.3) * 170, y = 386 - hash(i * 1.9) * 50, r = (hash(i * 7.1) - .5) * 70;
    basketPapers.push({ f: itrForm(g, x, y, r, .9, hash(i) > .8 ? '#E8A0A0' : '#9FB4C8'), x, y, r, ph: i }); }
  { let d = 'M40,380 H250 L234,450 H56 Z '; for (let x = 60; x < 240; x += 18) d += `M${x},380 L${x + (x - 145) * -.08},450 `; d += 'M48,415 H242'; E('path', { d, stroke: '#5A5458', 'stroke-width': 2.5, fill: 'none' }, g); }
  E('path', { d: 'M40,380 L20,360 M250,380 L270,360', stroke: '#5A5458', 'stroke-width': 3 }, g);
  /* paper heap on the floor */
  for (let i = 0; i < 26; i++) { const x = 40 + hash(i * 2.7 + 5) * 300, y = 690 + hash(i * 4.1) * 80 - (1 - Math.abs(x - 180) / 160) * 40, r = (hash(i * 6.3) - .5) * 160;
    itrForm(g, x, y, r, 1.05, hash(i * 9) > .82 ? '#E8A0A0' : '#9FB4C8'); }
  const faller = itrForm(g, 0, 0, 0, .9);
  /* wicker waste basket, overflowing with crumpled forms (left of the desk) */
  { const w = G(g); tf(w, 360, 820);
    E('ellipse', { cx: 4, cy: 2, rx: 48, ry: 7, fill: '#000', 'fill-opacity': .25 }, w);
    E('path', { d: 'M-42,-74 H42 L33,0 H-33 Z', fill: '#A8784A' }, w); E('path', { d: 'M12,-74 H42 L33,0 H8 Z', fill: '#000', 'fill-opacity': .14 }, w);
    { let d = ''; for (let y = -64; y < 0; y += 9) d += `M${f2(-41 + (y + 74) * .12)},${y} H${f2(41 - (y + 74) * .12)} `; for (let x = -36; x <= 36; x += 9) d += `M${x},-74 L${f2(x * .8)},0 `; E('path', { d, stroke: '#7E5530', 'stroke-width': 1.6 }, w); }
    const ball = (x, y, r, rot) => { const b = G(w); tf(b, x, y, rot);
      E('circle', { r, fill: '#F4EEDF' }, b); E('path', { d: `M${f2(r * .2)},${f2(-r)} A${r},${r} 0 0 1 ${f2(r * .2)},${r} Q${f2(r * .55)},0 ${f2(r * .2)},${f2(-r)} Z`, fill: '#D3C8B0' }, b);
      E('path', { d: `M${f2(-r * .7)},${f2(-r * .2)} L${f2(-r * .1)},${f2(r * .1)} L${f2(-r * .3)},${f2(r * .6)} M${f2(-r * .1)},${f2(r * .1)} L${f2(r * .5)},${f2(-r * .4)} M${f2(-r * .4)},${f2(-r * .7)} L${f2(-r * .1)},${f2(r * .1)}`, stroke: '#A89C82', 'stroke-width': 1.4, fill: 'none', 'stroke-linecap': 'round' }, b); };
    [[-24, -80, 15, 0], [4, -88, 17, 40], [26, -78, 14, 80], [-6, -70, 13, 120], [-60, -6, 12, 30], [56, -4, 11, 200]].forEach(([x, y, r, rot]) => ball(x, y, r, rot));
    E('rect', { x: -44, y: -78, width: 88, height: 7, rx: 3.5, fill: '#8A5E36' }, w); }
  /* --- spark transmitter (right) --- */
  const SX = 1325, SY = 420;
  E('path', { d: 'M1250,-200 V200 M1400,-200 V200', stroke: '#2A2A30', 'stroke-width': 10 }, g); E('path', { d: 'M1262,-200 V200', stroke: '#B5302A', 'stroke-width': 8 }, g);
  E('rect', { x: 1170, y: 196, width: 310, height: 456, rx: 8, fill: '#3A2A20' }, g);
  E('rect', { x: 1184, y: 210, width: 282, height: 92, rx: 4, fill: '#2A2A30' }, g);
  [[1214, 'A'], [1264, 'B'], [1314, 'C']].forEach(([x], i) => { E('rect', { x: x - 4, y: 236, width: 8, height: 40, fill: '#9AA0A8' }, g); E('path', { d: `M${x},240 L${x + 22},226`, stroke: '#C9A045', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x + 22, cy: 226, r: 5, fill: '#1E1A1C' }, g); });
  [1390, 1440].forEach(x => { E('circle', { cx: x, cy: 256, r: 22, fill: '#C9A045' }, g); E('circle', { cx: x, cy: 256, r: 17, fill: '#FBF7EE' }, g); E('path', { d: `M${x},256 L${x + 8},${242}`, stroke: '#C0392B', 'stroke-width': 2 }, g); });
  E('rect', { x: 1200, y: 318, width: 250, height: 210, rx: 10, fill: '#1A1A20' }, g);
  E('rect', { x: 1206, y: 324, width: 238, height: 198, rx: 8, fill: '#0E1018' }, g);
  const disc = G(g); tf(disc, SX, SY);
  E('circle', { r: 66, fill: '#5A6068' }, disc); E('circle', { r: 58, fill: '#4A5058' }, disc); E('circle', { r: 12, fill: '#2A2E34' }, disc);
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; E('circle', { cx: f2(Math.cos(a) * 66), cy: f2(Math.sin(a) * 66), r: 6, fill: '#C9CED6' }, disc); }
  E('path', { d: 'M-40,-30 A50,50 0 0 1 20,-46', stroke: '#8A9098', 'stroke-width': 5, fill: 'none' }, disc);
  [[-1, SX - 112], [1, SX + 112]].forEach(([s, x]) => { E('rect', { x: s < 0 ? x - 20 : x - 16, y: SY - 9, width: 36, height: 18, rx: 4, fill: '#B88E3A' }, g); E('path', { d: `M${x},${SY} L${SX + s * 100},${SY}`, stroke: '#D8C08A', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: SX + s * 100, cy: SY, r: 6, fill: '#E8D8A8' }, g); });
  { let d = ''; for (let x = 1212; x < 1444; x += 14) d += `M${x},328 V518 `; for (let y = 334; y < 520; y += 14) d += `M1208,${y} H1442 `; E('path', { d, stroke: '#4A4C54', 'stroke-width': 1.2, 'stroke-opacity': .55 }, g); }
  const sparkGlow = itrGlow(g, SX, SY, 190, 150, '#BDE6FF', .9);
  const cores = [-1, 1].map(s => E('circle', { cx: SX + s * 96, cy: SY, r: 12, fill: '#FFFFFF' }, g));
  const boltsC = [0, 1].map(() => E('path', { stroke: '#7FC8FF', 'stroke-width': 9, fill: 'none', 'stroke-opacity': .5, 'stroke-linejoin': 'round' }, g));
  const bolts = [0, 1, 2, 3].map(() => E('path', { stroke: '#F2FBFF', 'stroke-width': 3.2, fill: 'none', 'stroke-linejoin': 'round' }, g));
  const roomFlash = itrGlow(g, SX, SY, 520, 420, '#9FD8FF', .18);
  E('rect', { x: 1206, y: 324, width: 238, height: 198, rx: 8, fill: 'none', stroke: '#6B4A2B', 'stroke-width': 6 }, g);
  /* Leyden jars */
  for (let i = 0; i < 6; i++) { const x = 1206 + i * 42; E('rect', { x, y: 548, width: 32, height: 86, rx: 6, fill: '#BFD8E2', 'fill-opacity': .45 }, g); E('rect', { x: x + 2, y: 584, width: 28, height: 48, rx: 4, fill: '#C87A4A' }, g);
    E('rect', { x: x + 13, y: 530, width: 6, height: 20, fill: '#9AA0A8' }, g); E('circle', { cx: x + 16, cy: 528, r: 5, fill: '#C9CED6' }, g); E('path', { d: `M${x + 5},556 V600`, stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 3 }, g); }
  E('path', { d: 'M1222,528 H1438', stroke: '#9AA0A8', 'stroke-width': 3 }, g);
  { const pl = G(g); tf(pl, 1325, 210); E('rect', { x: -70, y: -34, width: 140, height: 22, rx: 3, fill: '#E9DFC9' }, pl); TX(pl, 0, -18, 'HIGH TENSION', 13, '#B5302A', { a: 'middle', w: 800, ls: 1 }); }
  /* operator's chair (behind the operator) */
  { const c = G(g); E('path', { d: 'M690,640 V500 Q690,468 760,466 Q830,468 830,500 V640', stroke: '#5A3820', 'stroke-width': 12, fill: 'none' }, c);
    E('path', { d: 'M694,490 Q760,476 826,490 V512 Q760,500 694,512 Z', fill: '#6B4426' }, c);
    for (let k = 0; k < 6; k++) E('rect', { x: 708 + k * 20, y: 512, width: 7, height: 120, rx: 3, fill: '#6B4426' }, c);
    E('rect', { x: 682, y: 636, width: 156, height: 18, rx: 6, fill: '#5A3820' }, c); E('path', { d: 'M760,654 V740 M700,770 L760,740 L820,770', stroke: '#3A2A1A', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, c); }
  /* headphones on a hook */
  { const h = G(g); tf(h, 1100, 300); E('rect', { x: -4, y: -46, width: 8, height: 14, fill: '#B88E3A' }, h); E('path', { d: 'M-26,10 Q-26,-38 0,-38 Q26,-38 26,10', stroke: '#2A2622', 'stroke-width': 6, fill: 'none' }, h);
    [-1, 1].forEach(s => { E('rect', { x: s * 26 - 11, y: 0, width: 22, height: 30, rx: 9, fill: '#3A3436' }, h); E('rect', { x: s * 26 - 7, y: 4, width: 14, height: 22, rx: 6, fill: '#555' }, h); });
    E('path', { d: 'M26,30 Q40,90 10,120', stroke: '#B5302A', 'stroke-width': 3, fill: 'none' }, h); }
  if (o.vignette !== false) g.vignette = itrVignette(g, .5, .42);
  /* --- FRONT: desk with apparatus + pile (desk group lowered by 46 px) --- */
  const F = G(g.front); tf(F, 0, 46);
  E('rect', { x: 412, y: 586, width: 708, height: 18, rx: 4, fill: '#A0703F' }, F); E('rect', { x: 412, y: 586, width: 708, height: 5, rx: 2, fill: '#C08E5A' }, F);
  E('rect', { x: 424, y: 604, width: 684, height: 166, fill: '#7E5230' }, F);
  [[440, 230], [880, 210]].forEach(([x, w]) => { E('rect', { x, y: 620, width: w, height: 60, rx: 4, fill: '#8E5E36' }, F); E('rect', { x: x + w / 2 - 18, y: 646, width: 36, height: 8, rx: 4, fill: '#C9A045' }, F);
    E('rect', { x, y: 692, width: w, height: 64, rx: 4, fill: '#8E5E36' }, F); E('rect', { x: x + w / 2 - 18, y: 720, width: 36, height: 8, rx: 4, fill: '#C9A045' }, F); });
  E('rect', { x: 690, y: 620, width: 170, height: 136, rx: 4, fill: '#6E4628' }, F);
  E('rect', { x: 424, y: 604, width: 684, height: 14, fill: '#000', 'fill-opacity': .18 }, F);
  E('rect', { x: 1060, y: 604, width: 48, height: 166, fill: '#000', 'fill-opacity': .12 }, F);
  /* tuner cabinet */
  { const t = G(F); tf(t, 1010, 588); E('rect', { x: -78, y: -112, width: 156, height: 112, rx: 6, fill: '#5A3820' }, t); E('rect', { x: -70, y: -104, width: 140, height: 96, rx: 4, fill: '#2A2A30' }, t);
    [[-40, -66], [0, -66], [40, -66]].forEach(([x, y], i) => { E('circle', { cx: x, cy: y, r: 15, fill: '#1A1A1E' }, t); E('circle', { cx: x, cy: y, r: 11, fill: '#3E3E46' }, t); E('path', { d: `M${x},${y} L${x + 8 * Math.cos(i * 2)},${y + 8 * Math.sin(i * 2)}`, stroke: '#E9DFC9', 'stroke-width': 2.5 }, t); });
    [-50, -25, 0, 25, 50].forEach(x => E('circle', { cx: x, cy: -28, r: 4, fill: '#C9A045' }, t)); }
  /* magnetic detector with pulleys */
  const pul = []; { const d = G(F); tf(d, 912, 588); E('rect', { x: -42, y: -48, width: 84, height: 48, rx: 4, fill: '#6B4426' }, d); E('rect', { x: -14, y: -40, width: 28, height: 16, rx: 3, fill: '#2A2A30' }, d);
    [-28, 28].forEach(x => { const p = G(d); tf(p, x, -64); E('circle', { r: 14, fill: '#9AA0A8' }, p); E('circle', { r: 4, fill: '#3A3E44' }, p); E('rect', { x: -1.5, y: -14, width: 3, height: 28, fill: '#5A6068' }, p); pul.push(p); });
    E('path', { d: 'M-28,-78 H28 M-28,-50 H28', stroke: '#3A3E44', 'stroke-width': 1.5 }, d); }
  /* Morse key (the hero prop): pale marble plate, ebonite block, bright brass
     lever pivoting at (716,552), big black knob, contact spark when pressed */
  E('rect', { x: 686, y: 586, width: 182, height: 4, rx: 2, fill: '#000', 'fill-opacity': .25 }, F);
  E('rect', { x: 690, y: 575, width: 172, height: 11, rx: 3, fill: '#DCD4C2' }, F); E('rect', { x: 690, y: 575, width: 172, height: 3, rx: 1.5, fill: '#F4EEE2' }, F);
  E('rect', { x: 700, y: 567, width: 152, height: 9, rx: 2, fill: '#1E1C22' }, F);
  [[696, 579], [856, 579]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 2.5, fill: '#B88E3A' }, F));
  E('rect', { x: 708, y: 548, width: 16, height: 20, rx: 2, fill: '#C9A045' }, F); E('rect', { x: 708, y: 548, width: 5, height: 20, fill: '#F0D27E' }, F);
  E('path', { d: 'M762,567 l-5,-2.5 l10,-2.5 l-10,-2.5 l10,-2.5 l-5,-1.5', stroke: '#B8BEC8', 'stroke-width': 1.6, fill: 'none' }, F);
  E('rect', { x: 806, y: 559, width: 10, height: 9, rx: 1.5, fill: '#B8BEC8' }, F); E('rect', { x: 808, y: 557, width: 6, height: 3, fill: '#E6EAF0' }, F);
  const keyLever = G(F);
  E('rect', { x: 704, y: 546, width: 142, height: 11, rx: 4, fill: '#E2B84A' }, keyLever); E('rect', { x: 708, y: 547, width: 134, height: 3, rx: 1.5, fill: '#FFE9A8' }, keyLever);
  E('rect', { x: 706, y: 554, width: 138, height: 3, rx: 1.5, fill: '#9A7430' }, keyLever);
  E('circle', { cx: 716, cy: 552, r: 5.5, fill: '#F0D27E' }, keyLever); E('circle', { cx: 716, cy: 552, r: 2.2, fill: '#7A5A1E' }, keyLever);
  E('rect', { x: 832, y: 538, width: 8, height: 10, fill: '#2A2628' }, keyLever);
  E('ellipse', { cx: 836, cy: 534, rx: 19, ry: 10, fill: '#1A1618' }, keyLever); E('ellipse', { cx: 829, cy: 530, rx: 8, ry: 3.2, fill: '#5E585C' }, keyLever);
  const keySpark = G(F); tf(keySpark, 811, 562); E('circle', { r: 13, fill: '#BDE6FF', 'fill-opacity': .45 }, keySpark); E('path', { d: 'M0,-12 L2,-2 L12,0 L2,2 L0,12 L-2,2 L-12,0 L-2,-2 Z', fill: '#FFFFFF' }, keySpark); op(keySpark, 0);
  let keyD = 0;
  /* paper spike + growing pile */
  E('path', { d: 'M640,586 V530', stroke: '#9AA0A8', 'stroke-width': 3 }, F); E('ellipse', { cx: 640, cy: 586, rx: 14, ry: 4, fill: '#3A3436' }, F);
  [0, 1, 2, 3, 4].forEach(i => itrForm(F, 640, 548 - i * 4 + 6, (hash(i * 3) - .5) * 30, .7, i === 2 ? '#E8A0A0' : '#9FB4C8'));
  const pileG = G(F); const sheets = [];
  for (let i = 0; i < 26; i++) { const y = 584 - i * 4.2, x = 520 + (hash(i * 1.3) - .5) * 14, r = (hash(i * 2.9) - .5) * 14; const f = itrForm(pileG, x, y - 20, r, 1, hash(i * 5) > .78 ? '#E8A0A0' : '#9FB4C8');
    f.setAttribute('transform', `translate(${f2(x)},${f2(y)}) rotate(${f2(r)}) scale(1.6,.32)`); sheets.push({ f, x, y, r }); }
  const topSheets = [0, 1, 2].map(i => { const f = itrForm(F, 0, 0, 0, 1, i === 1 ? '#E8A0A0' : '#9FB4C8'); return { f, ph: i * 2.2 }; });
  let pileK = .5, sparkK = .55;
  g.setClock = (h, m) => { const mm = (h % 12) * 60 + m; hHand.setAttribute('transform', `translate(${CK[0]},${CK[1]}) rotate(${f2(mm / 2)})`); mHand.setAttribute('transform', `translate(${CK[0]},${CK[1]}) rotate(${f2(m * 6)})`); };
  g.setPile = k => { pileK = clamp(k); const n = Math.round(pileK * sheets.length); sheets.forEach((s, i) => op(s.f, i < n ? 1 : 0)); };
  g.setSpark = k => { sparkK = clamp(k); };
  g.setKey = d => { keyD = clamp(d); keyLever.setAttribute('transform', `rotate(${f2(3.2 * keyD)} 716 552)`); };
  g.anchors = { seat: [760, 765], pile: [520, 642], key: [836, 572], tube: [120, 330], basket: [140, 390], wasteBasket: [360, 820], spark: [SX, SY], clock: CK, porthole: PH, floorPile: [170, 700] };
  g.anim = at => {
    A.forEach(f => f(at));
    op(lampG, .85 + .15 * wob(at * 1.5, 3));
    /* sparks: deterministic crackle */
    const fr = Math.floor(at * 24), k = sparkK;
    tf(disc, SX, SY, (at * 900) % 360);
    let lit = 0;
    op(keySpark, keyD > .6 ? .55 + .45 * hash(fr * 2.3 + 1) : 0);
    bolts.forEach((b, i) => { const on = k > 0 && hash(fr * 1.31 + i * 7.7) < .2 + k * .75; if (!on) { op(b, 0); if (i < 2) op(boltsC[i], 0); return; } lit++;
      const s = i % 2 ? 1 : -1, a = (i > 1 ? .45 : .12) * (hash(fr * .3 + i) > .5 ? 1 : -1), x0 = SX + s * 98, x1 = SX + s * Math.cos(a) * 66, y1 = SY + Math.sin(a) * 66, n = 6; let d = `M${x0},${SY}`;
      for (let j = 1; j <= n; j++) { const t = j / n; d += ` L${f2(lerp(x0, x1, t) + (j < n ? (hash(fr * 1.7 + i * 5 + j) - .5) * 8 : 0))},${f2(lerp(SY, y1, t) + (j < n ? (hash(fr + i * 13 + j * 3.7) - .5) * 30 * (.4 + k) : 0))}`; }
      b.setAttribute('d', d); op(b, .7 + .3 * k); if (boltsC[i % 2]) { boltsC[i % 2].setAttribute('d', d); op(boltsC[i % 2], .6 * k); } });
    op(sparkGlow, k > 0 ? clamp((.3 + .7 * k) * (lit ? 1 : .4) * (.7 + .3 * hash(fr * .7))) : 0); cores.forEach((c, i) => op(c, lit ? clamp(k * (.5 + .5 * hash(fr * 3.1 + i))) : 0)); op(roomFlash, clamp(k * (lit > 1 ? 1 : .3) * (.6 + .4 * hash(fr * 1.9))));
    pul.forEach((p, i) => p.setAttribute('transform', `translate(${i ? 28 : -28},-64) rotate(${f2((at * 60) % 360)})`));
    /* paper flutter */
    pinned.forEach(p => tf(p.f, p.x, p.y, p.r + 3 * Math.sin(at * 2.6 + p.ph) * Math.max(0, Math.sin(at * .7 + p.ph))));
    basketPapers.forEach(p => tf(p.f, p.x, p.y + Math.sin(at * 3 + p.ph) * 1.2, p.r + 2.5 * Math.sin(at * 2.2 + p.ph), .9));
    const top = 584 - Math.max(0, Math.round(pileK * sheets.length) - 1) * 4.2 - 22;
    topSheets.forEach((t, i) => { const lift = Math.max(0, Math.sin(at * 2.1 + t.ph)) * 6; tf(t.f, 524 + (i - 1) * 10, top - i * 3 - lift, -4 + i * 5 + lift * 1.2, .95); op(t.f, pileK > .05 ? 1 : 0); });
    const ph = (at % 6) / 6; tf(faller, 150 + Math.sin(ph * 9) * 34, lerp(400, 700, ph), Math.sin(ph * 12) * 35, .9); op(faller, ph < .9 ? 1 : (1 - ph) * 10);
  };
  g.setClock(11, 40); g.setPile(.5); g.setKey(0); g.anim(0);
  return g;
}

/* a loose telephone handset (origin = grip centre, earpiece up); the cord
   attaches at (0,22).  Shared by bgCrowsNest and bgBridge. */
function itrHandset(p) {
  const h = G(p);
  E('rect', { x: -7, y: -19, width: 14, height: 38, rx: 6, fill: '#2A2622' }, h); E('rect', { x: -4.5, y: -15, width: 3, height: 28, rx: 1.5, fill: '#5A5458' }, h);
  E('ellipse', { cx: 0, cy: -20, rx: 10.5, ry: 7, fill: '#1E1A1C' }, h); E('ellipse', { cx: -3, cy: -22, rx: 4, ry: 2, fill: '#5A5458' }, h);
  E('ellipse', { cx: 0, cy: 19, rx: 9.5, ry: 6.5, fill: '#1E1A1C' }, h);
  return h;
}
/* wires g.makeHandset / g.setHandset / g.setCord for a wall phone whose
   hooked receiver is `hook` and whose cord leaves the box at `socket` [x,y] */
function itrPhoneLink(g, hook, socket) {
  const cord = G(g.over); const c1 = E('path', { stroke: '#1E1A1C', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, cord);
  const c2 = E('path', { stroke: '#5A5458', 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '1.5 3.5' }, cord); op(cord, 0);
  const hs = []; let manual = null, lifted = 0;
  g.makeHandset = p => { const h = itrHandset(p); hs.push(h); return h; };
  g.setHandset = k => { lifted = k > .5 ? 1 : 0; op(hook, lifted ? 0 : 1); };
  g.setCord = pt => { manual = pt || null; };
  return at => {
    let e = manual;
    if (!e && lifted) for (let i = 0; i < hs.length && !e; i++) { const h = hs[i]; if (!h.isConnected) continue;
      const a = h.getCTM && h.getCTM(), b = g.getCTM && g.getCTM(); if (!a || !b) continue;
      const m = b.inverse().multiply(a); e = [m.c * 22 + m.e, m.d * 22 + m.f]; }
    if (!lifted || !e) { op(cord, 0); return; }
    const sx = socket[0], sy = socket[1], dx = e[0] - sx, mx = (sx + e[0]) / 2, my = Math.max(sy, e[1]) + 34 + Math.abs(dx) * .18 + Math.sin(at * 1.8) * 3;
    const d = `M${f2(sx)},${f2(sy)} Q${f2(mx)},${f2(my)} ${f2(e[0])},${f2(e[1])}`; c1.setAttribute('d', d); c2.setAttribute('d', d); op(cord, 1);
  };
}

/* =====================================================================
   5) bgCrowsNest(parent, o) — high on the foremast, moonless night.
   Lookouts → g.mid (g.front = the basket wall, hides their legs).
   g.far              far layer inside the swaying sky/sea, behind rigging, mast
                      and nest: put the iceberg here (at anchors.ahead)
   g.setBell(deg)     swing the bell (e.g. swing(t, t0, 25, 14, 1.2))
   g.setHandset(k)    k > .5: receiver off the hook (hook copy hidden, cord shown)
   g.makeHandset(p)   → loose receiver group (origin = grip, earpiece up) to put in
                      a hand, e.g. tf(g.makeHandset(lookout.propL), 0, 0, -20); while
                      setHandset(1) the cord from the box follows it automatically
   g.setCord([x,y])   force the cord end (set coordinates); null = auto again
   g.anchors = { lookouts:[[610,820],[1000,820]], phoneSpot:[895,820] (stand here to use the
     phone, right of the box), bell:[930,330], bellRope:[934,478], phone:[800,548],
     handset:[847,565] (hooked receiver), rim:722, horizon:470,
     ahead:[1180,470] (= aheadR), aheadL:[420,470]  (iceberg spots on the horizon, clear of the mast) }
   The sky/sea (and g.far) sway gently; the nest stays put.
   ===================================================================== */
function bgCrowsNest(parent, o = {}) {
  const g = G(parent), A = []; itrFront(g, parent);
  const HZ = 470;
  const bgW = G(g);
  E('rect', { x: -500, y: -500, width: 2600, height: HZ + 502, fill: lgrad([[0, '#02040C'], [.55, '#060B1C'], [.9, '#0E1838'], [1, '#18244C']]) }, bgW);
  E('ellipse', { cx: 820, cy: 120, rx: 1200, ry: 140, fill: rgrad([[0, '#9FB2E8', .2], [.6, '#9FB2E8', .06], [1, '#9FB2E8', 0]]), transform: 'rotate(-22 820 120)' }, bgW);
  { const mw = G(bgW, { transform: 'rotate(-22 820 120)' }); let d = ''; for (let i = 0; i < 380; i++) { const x = -400 + hash(i * 1.7 + 3) * 2440, y = 120 + (hash(i * 2.3) + hash(i * 3.9) - 1) * 150; d += `M${f2(x)},${f2(y)} m-.8,0 a.8,.8 0 1 0 1.6,0 a.8,.8 0 1 0 -1.6,0 `; }
    E('path', { d, fill: '#DCE6FF', 'fill-opacity': .55 }, mw); }
  const st = itrStars(bgW, -500, -500, 2600, HZ + 480, 560, 11, { pow: 1.3 }); A.push(st.anim);
  E('rect', { x: -500, y: HZ - 60, width: 2600, height: 62, fill: lgrad([[0, '#22305E', 0], [1, '#22305E', .55]]) }, bgW);
  E('rect', { x: -500, y: HZ, width: 2600, height: 900, fill: lgrad([[0, '#070B18'], [.3, '#03050C'], [1, '#010205']]) }, bgW);
  E('rect', { x: -500, y: HZ - 1, width: 2600, height: 2, fill: '#3A4A7A', 'fill-opacity': .6 }, bgW);
  { let d = ''; for (let i = 0; i < 70; i++) { const x = -400 + hash(i * 5.3) * 2400, y = HZ + 6 + Math.pow(hash(i * 2.1), 1.6) * 420, w = 4 + hash(i * 1.1) * 14 * (1 + (y - HZ) / 200); d += `M${f2(x)},${f2(y)} h${f2(w)} `; }
    E('path', { d, stroke: '#C9D6FF', 'stroke-opacity': .22, 'stroke-width': 1.5 }, bgW); }
  const shipLt = G(bgW); E('circle', { cx: 1380, cy: HZ - 3, r: 2, fill: '#FFE7A8' }, shipLt); E('circle', { cx: 1386, cy: HZ - 5, r: 1.6, fill: '#FFF2D0' }, shipLt); E('circle', { cx: 1392, cy: HZ - 3, r: 1.4, fill: '#E84855' }, shipLt);
  /* far layer: the iceberg goes here (sways with the sea, behind rigging, mast and nest) */
  g.far = G(bgW);
  /* rigging */
  const rig = G(g);
  E('path', { d: 'M790,-300 L-300,860 M780,-200 L-300,640 M810,-300 L1900,860 M820,-200 L1900,640', stroke: '#2A2F45', 'stroke-width': 4 }, rig);
  E('path', { d: 'M790,-300 L-300,860 M810,-300 L1900,860', stroke: '#5A6488', 'stroke-width': 1.2, 'stroke-opacity': .5, transform: 'translate(-2,-1)' }, rig);
  /* mast */
  E('rect', { x: 758, y: -300, width: 84, height: 1300, fill: '#7A6448' }, g);
  E('rect', { x: 758, y: -300, width: 22, height: 1300, fill: '#9A8262' }, g); E('rect', { x: 818, y: -300, width: 24, height: 1300, fill: '#5E4C38' }, g);
  [-120, 80, 300].forEach(y => { E('rect', { x: 752, y, width: 96, height: 14, rx: 3, fill: '#4A4A52' }, g); E('rect', { x: 752, y, width: 96, height: 4, fill: '#6E7088' }, g); });
  E('rect', { x: 758, y: -300, width: 84, height: 1300, fill: lgrad([[0, '#0A1030', 0], [1, '#0A1030', .35]]) }, g);
  /* masthead light */
  const mLight = itrGlow(g, 800, 150, 240, 200, '#FFF2D0', .35);
  E('rect', { x: 776, y: 128, width: 48, height: 52, rx: 6, fill: '#3A3A44' }, g); E('rect', { x: 784, y: 136, width: 32, height: 32, rx: 4, fill: '#FFF6DE' }, g);
  E('path', { d: 'M770,128 H830 L820,116 H780 Z', fill: '#2A2A32' }, g); E('rect', { x: 796, y: 108, width: 8, height: 10, fill: '#2A2A32' }, g);
  /* nest interior (back) */
  E('ellipse', { cx: 800, cy: 650, rx: 432, ry: 72, fill: '#2C3044' }, g);
  E('path', { d: 'M368,650 A432,72 0 0 1 1232,650 L1232,700 A432,72 0 0 0 368,700 Z', fill: lgrad([[0, '#3E4460'], [1, '#232638']]) }, g);
  E('path', { d: 'M368,650 A432,72 0 0 1 1232,650', stroke: '#8A90AE', 'stroke-width': 14, fill: 'none' }, g);
  E('path', { d: 'M372,646 A428,68 0 0 1 1228,646', stroke: '#B8C0DA', 'stroke-width': 3, fill: 'none', 'stroke-opacity': .6 }, g);
  /* hatch in the mast + phone box */
  E('rect', { x: 772, y: 590, width: 56, height: 110, rx: 6, fill: '#5E4C38' }, g); E('rect', { x: 778, y: 596, width: 44, height: 104, rx: 4, fill: '#4A3A2A' }, g); E('circle', { cx: 816, cy: 650, r: 3.5, fill: '#B88E3A' }, g);
  const PB = G(g); tf(PB, 800, 548);
  E('rect', { x: -40, y: -56, width: 80, height: 104, rx: 6, fill: '#6B4426' }, PB); E('rect', { x: -34, y: -50, width: 68, height: 92, rx: 4, fill: '#7E5230' }, PB);
  [-14, 14].forEach(x => { E('circle', { cx: x, cy: -64, r: 11, fill: '#C9A045' }, PB); E('circle', { cx: x - 3, cy: -67, r: 3.5, fill: '#F0D27E' }, PB); });
  E('rect', { x: -22, y: -36, width: 44, height: 30, rx: 4, fill: '#2A2622' }, PB); E('circle', { cx: 0, cy: -21, r: 9, fill: '#1A1614' }, PB);
  E('path', { d: 'M-40,10 l-14,0 l0,14', stroke: '#B88E3A', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, PB); E('circle', { cx: -54, cy: 26, r: 5, fill: '#2A2622' }, PB);
  E('rect', { x: 40, y: -10, width: 8, height: 14, fill: '#B88E3A' }, PB);
  const handset = G(PB); E('path', { d: 'M46,-14 Q56,-8 52,18', stroke: '#1E1A1C', 'stroke-width': 5, fill: 'none' }, handset);
  E('rect', { x: 40, y: -2, width: 14, height: 38, rx: 6, fill: '#2A2622' }, handset); E('ellipse', { cx: 47, cy: -2, rx: 10, ry: 7, fill: '#1E1A1C' }, handset); E('ellipse', { cx: 47, cy: 36, rx: 9, ry: 6, fill: '#1E1A1C' }, handset);
  /* bell on a bracket */
  E('path', { d: 'M842,318 H936 M842,336 L900,318', stroke: '#4A4A52', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
  const bell = G(g); const bellIn = G(bell);
  E('rect', { x: -5, y: 0, width: 10, height: 12, fill: '#4A4A52' }, bellIn);
  E('path', { d: 'M-24,58 Q-26,26 -16,16 Q0,4 16,16 Q26,26 24,58 L32,66 H-32 Z', fill: '#C9A045' }, bellIn);
  E('path', { d: 'M6,10 Q22,18 24,58 L32,66 H12 Z', fill: '#000', 'fill-opacity': .18 }, bellIn);
  E('path', { d: 'M-14,24 Q-16,40 -16,56', stroke: '#F0D27E', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .7 }, bellIn);
  E('ellipse', { cx: 0, cy: 66, rx: 32, ry: 5, fill: '#8A6526' }, bellIn); E('circle', { cx: 0, cy: 72, r: 6, fill: '#5A4632' }, bellIn);
  E('path', { d: 'M0,74 Q10,110 4,150', stroke: '#C8B48A', 'stroke-width': 3.5, fill: 'none' }, bellIn);
  /* starlight rim light on the whole nest */
  if (o.vignette !== false) g.vignette = itrVignette(g, .5, .5);
  /* --- FRONT: basket wall (painted steel cylinder) --- */
  const F = g.front;
  const body = 'M368,650 A432,72 0 0 0 1232,650 V1120 H368 Z';
  E('path', { d: body, fill: lgrad([[0, '#2A2F48'], [.18, '#5E6688'], [.38, '#8C94B6'], [.55, '#7A82A4'], [.82, '#454C6A'], [1, '#22263C']], 0, 0, 1, 0) }, F);
  { let d = ''; for (let k = 1; k < 10; k++) { const x = 800 - Math.cos(k / 10 * Math.PI) * 432; d += `M${f2(x)},${f2(650 + Math.sin(k / 10 * Math.PI) * 72)} V1120 `; } E('path', { d, stroke: '#2E3350', 'stroke-width': 3, 'stroke-opacity': .55 }, F); }
  [800, 930].forEach(y => { E('path', { d: `M368,${y} A432,72 0 0 0 1232,${y}`, stroke: '#363B58', 'stroke-width': 12, fill: 'none' }, F); E('path', { d: `M368,${y - 5} A432,72 0 0 0 1232,${y - 5}`, stroke: '#9AA2C4', 'stroke-width': 2, fill: 'none', 'stroke-opacity': .5 }, F); });
  { let d = ''; for (let k = 0; k < 36; k++) { const t = (k + .5) / 36, a = Math.PI * t, x = 800 - Math.cos(a) * 426; [688, 812, 942].forEach(y0 => { const y = y0 + Math.sin(a) * 70; d += `M${f2(x)},${f2(y)} m-2.6,0 a2.6,2.6 0 1 0 5.2,0 a2.6,2.6 0 1 0 -5.2,0 `; }); }
    E('path', { d, fill: '#AEB6D6', 'fill-opacity': .6 }, F); }
  E('path', { d: body, fill: lgrad([[0, '#000', 0], [.3, '#000', .05], [1, '#000', .55]]) }, F);
  E('path', { d: 'M366,652 A434,74 0 0 0 1234,652', stroke: '#2A2E44', 'stroke-width': 30, fill: 'none' }, F);
  E('path', { d: 'M368,648 A432,72 0 0 0 1232,648', stroke: '#B4BCDA', 'stroke-width': 20, fill: 'none' }, F);
  E('path', { d: 'M372,642 A428,70 0 0 0 1228,642', stroke: '#E4EAFA', 'stroke-width': 4, fill: 'none', 'stroke-opacity': .8 }, F);
  { let d = ''; for (let k = 0; k < 46; k++) { const t = hash(k * 3.7), a = Math.PI * t, x = 800 - Math.cos(a) * 432, y = 646 + Math.sin(a) * 72 + (hash(k) - .5) * 10; d += `M${f2(x)},${f2(y)} m-1.6,0 a1.6,1.6 0 1 0 3.2,0 a1.6,1.6 0 1 0 -3.2,0 `; }
    E('path', { d, fill: '#FFFFFF', 'fill-opacity': .8 }, F); }
  g.setBell = deg => bell.setAttribute('transform', `translate(930,330) rotate(${f2(deg)})`);
  const cordAnim = itrPhoneLink(g, handset, [846, 536]);
  g.anchors = { lookouts: [[610, 820], [1000, 820]], phoneSpot: [895, 820], bell: [930, 330], bellRope: [934, 478], phone: [800, 548], handset: [847, 565], rim: 722, horizon: HZ,
    ahead: [1180, HZ], aheadL: [420, HZ], aheadR: [1180, HZ] };
  g.anim = at => { A.forEach(f => f(at)); cordAnim(at); op(mLight, .85 + .15 * wob(at * 1.3, 7)); bgW.setAttribute('transform', `rotate(${f2(Math.sin(at * .45) * .5)} 800 700) translate(0,${f2(Math.sin(at * .6 + 1) * 4)})`);
    rig.setAttribute('transform', `translate(${f2(Math.sin(at * .45) * 3)},0)`); op(shipLt, .5 + .5 * Math.max(0, Math.sin(at * 1.3))); };
  g.setBell(0); g.anim(0);
  return g;
}

/* =====================================================================
   6) bgBridge(parent, o) — the bridge at night.
   Officers → g.mid; g.front = the ship's wheel (in front of the helmsman,
   hub at his chest, rim below his chin).
   g.far              far layer behind the forecastle, mast and window frames: the iceberg
   g.setWheel(deg)    wheel rotation (+ = clockwise)
   g.wheelGrip(i)     → [x,y] on the rim for hand i (0 = left, 1 = right); follows setWheel
   g.setTelegraph(v)  -1 full astern .. 0 stop .. 1 full ahead (red pointer + side lever)
   g.telegraphGrip()  → [x,y] of the lever's grip, on the officer's side of the dial:
                      up = ahead, level = stop, down = astern (always within reach of anchors.officer)
   g.setHandset(k) / g.makeHandset(p) / g.setCord(pt)   as in bgCrowsNest (wall phone "CROW'S NEST")
   g.anchors = { helm:[520,792], wheel:[520,650] (hub), wheelR:95, telegraph:[1290,590] (dial centre),
     officer:[1100,800] (reaches the grip with hR), binnacle:[790,800], captain:[950,805],
     phone:[80,430], phoneHandset:[139,430], phoneMan:[215,800], window:[835,300],
     iceberg:[925,352] (centre window, clear of mast and pillars), ahead:[800,352] (dead ahead,
     behind the mast), horizon:352 }   all characters at s:1
   ===================================================================== */
function bgBridge(parent, o = {}) {
  const g = G(parent), A = []; itrFront(g, parent);
  const FL = 652, HZ = 352;
  /* ---------- view through the windows (sways a little) ---------- */
  const view = G(g);
  E('rect', { x: -1000, y: -900, width: 3600, height: HZ + 900, fill: lgrad([[0, '#03050D'], [.75, '#0A1230'], [1, '#18244C']]) }, view);
  const st = itrStars(view, -200, -100, 2000, HZ + 80, 300, 5, { pow: 1.2 }); A.push(st.anim);
  E('ellipse', { cx: 760, cy: 40, rx: 1100, ry: 90, fill: rgrad([[0, '#9FB2E8', .14], [.6, '#9FB2E8', .04], [1, '#9FB2E8', 0]]), transform: 'rotate(-14 760 40)' }, view);
  E('rect', { x: -1000, y: HZ, width: 3600, height: 900, fill: lgrad([[0, '#060A16'], [1, '#020308']]) }, view);
  E('rect', { x: -1000, y: HZ - 1, width: 3600, height: 2, fill: '#34447A', 'fill-opacity': .55 }, view);
  { let d = ''; for (let i = 0; i < 50; i++) { const x = -200 + hash(i * 4.7) * 2000, y = HZ + 6 + Math.pow(hash(i * 1.3), 1.5) * 120; d += `M${f2(x)},${f2(y)} h${f2(5 + hash(i) * 12)} `; } E('path', { d, stroke: '#C9D6FF', 'stroke-opacity': .2, 'stroke-width': 1.4 }, view); }
  /* far layer: the iceberg goes here (behind the forecastle, the mast and the window frames) */
  g.far = G(view);
  /* forecastle + foremast seen ahead */
  E('path', { d: 'M180,520 L760,392 Q800,384 840,392 L1420,520 Z', fill: '#1C1E28' }, view);
  E('path', { d: 'M260,506 L770,398 Q800,392 830,398 L1340,506 Z', fill: '#3A3226' }, view);
  { let d = ''; for (let k = 1; k < 9; k++) { const t = k / 9; d += `M${f2(lerp(260, 770, t))},${f2(lerp(506, 398, t))} L${f2(lerp(1340, 830, t))},${f2(lerp(506, 398, t))} `; } E('path', { d, stroke: '#2E2820', 'stroke-width': 1.5 }, view); }
  E('path', { d: 'M180,520 L760,392 Q800,384 840,392 L1420,520', stroke: '#C9C4B8', 'stroke-width': 2, fill: 'none', 'stroke-opacity': .5 }, view);
  E('path', { d: 'M800,520 L800,92', stroke: '#6B5A44', 'stroke-width': 12 }, view); E('path', { d: 'M797,520 L797,92', stroke: '#8A7656', 'stroke-width': 4 }, view);
  E('path', { d: 'M800,100 L470,470 M800,100 L1130,470 M800,92 L800,-200', stroke: '#2A2F45', 'stroke-width': 2 }, view);
  E('path', { d: 'M772,176 H828 L822,204 H778 Z', fill: '#5A4A38' }, view); E('rect', { x: 768, y: 172, width: 64, height: 6, rx: 2, fill: '#7A6448' }, view);
  [[520, 458], [1080, 458], [700, 410], [900, 410]].forEach(([x, y]) => E('rect', { x: x - 12, y: y - 8, width: 24, height: 12, rx: 3, fill: '#2A2A30' }, view));
  /* ---------- window frames: left wall -200..190, pillars, centre pane 630..1040 ---------- */
  E('rect', { x: -1000, y: -900, width: 3600, height: 1018, fill: '#3A3036' }, g);
  E('rect', { x: -200, y: -200, width: 2000, height: 318, fill: lgrad([[0, '#000', .4], [1, '#000', 0]]) }, g);
  { let d = ''; for (let x = -200; x < 1800; x += 110) d += `M${x},-200 h40 v300 h-40 Z `; E('path', { d, fill: '#2E262A' }, g); }
  E('rect', { x: -1000, y: 104, width: 3600, height: 22, fill: '#6B4A30' }, g); E('rect', { x: -1000, y: 104, width: 3600, height: 4, fill: '#8E6440' }, g);
  E('rect', { x: -1000, y: 470, width: 3600, height: 30, fill: '#6B4A30' }, g); E('rect', { x: -1000, y: 470, width: 3600, height: 5, fill: '#9A6E48' }, g);
  const PIL = [[-1000, 1190], [400, 30], [600, 30], [1040, 30], [1290, 30], [1600, 1000]];
  PIL.forEach(([x, w]) => { E('rect', { x, y: 120, width: w, height: 352, fill: '#6B4A30' }, g); E('rect', { x: x + w - 6, y: 120, width: 6, height: 352, fill: '#4E3422' }, g); if (x > -900) E('rect', { x, y: 120, width: 5, height: 352, fill: '#8E6440' }, g); });
  { let d = ''; for (let x = 0; x < 190; x += 46) d += `M${x},130 h38 v330 h-38 Z `; E('path', { d, fill: '#5E4028' }, g); }
  [[190, 210], [430, 170], [630, 410], [1070, 220], [1320, 280]].forEach(([x, w]) => E('path', { d: `M${x + 24},462 L${f2(x + w * .62)},130`, stroke: '#9FB4E8', 'stroke-opacity': .07, 'stroke-width': 24 }, g));
  /* ---------- lower wall, floor ---------- */
  E('rect', { x: -1000, y: 500, width: 3600, height: 154, fill: '#5A3C28' }, g);
  for (let x = -190; x < 1800; x += 120) { E('rect', { x: x + 8, y: 516, width: 104, height: 116, rx: 3, fill: '#4E3422' }, g); E('rect', { x: x + 14, y: 522, width: 92, height: 104, rx: 2, fill: '#644430' }, g); E('rect', { x: x + 14, y: 522, width: 92, height: 3, fill: '#80583C' }, g); }
  E('rect', { x: -1000, y: 636, width: 3600, height: 18, fill: '#3A2618' }, g);
  E('rect', { x: -1000, y: FL, width: 3600, height: 900, fill: '#7A5236' }, g);
  { const X = (xa, y) => 800 + (xa - 800) * (y - 150) / (FL - 150); let d = '';
    for (let xa = -1300; xa < 2900; xa += 64) d += `M${f2(X(xa, FL))},${FL} L${f2(X(xa, 1110))},1110 `;
    E('path', { d, stroke: '#5E3E28', 'stroke-width': 3 }, g); let b = ''; for (let i = 0; i < 40; i++) { const xa = -1200 + Math.floor(hash(i * 3.1) * 62) * 64, y = FL + 20 + hash(i * 5.7) * 400; b += `M${f2(X(xa, y))},${f2(y)} L${f2(X(xa + 64, y))},${f2(y)} `; }
    E('path', { d: b, stroke: '#5E3E28', 'stroke-width': 2.5 }, g); }
  E('rect', { x: -1000, y: FL, width: 3600, height: 900, fill: lgrad([[0, '#0A0E20', .55], [1, '#0A0E20', .25]]) }, g);
  /* hanging lamp */
  const lamp = itrGlow(g, 860, 420, 520, 360, '#FFD28A', .3);
  E('path', { d: 'M860,-200 V40', stroke: '#1E1A1C', 'stroke-width': 3 }, g);
  E('path', { d: 'M826,70 Q828,40 860,38 Q892,40 894,70 Z', fill: '#2E3A36' }, g); E('ellipse', { cx: 860, cy: 72, rx: 14, ry: 5, fill: '#FFE7A8' }, g);
  /* ---------- wall telephone to the crow's nest (left wall) + voice pipes ---------- */
  const PHX = 80, PHY = 430;
  { const p = G(g); tf(p, PHX, PHY);
    E('rect', { x: -46, y: -66, width: 100, height: 140, rx: 8, fill: '#000', 'fill-opacity': .25 }, p);
    E('rect', { x: -50, y: -70, width: 100, height: 140, rx: 8, fill: '#7E5230' }, p); E('rect', { x: -42, y: -62, width: 84, height: 124, rx: 6, fill: '#946440' }, p);
    [-18, 18].forEach(x => { E('circle', { cx: x, cy: -48, r: 13, fill: '#C9A045' }, p); E('circle', { cx: x - 4, cy: -52, r: 4, fill: '#F0D27E' }, p); });
    E('rect', { x: -24, y: -22, width: 48, height: 40, rx: 6, fill: '#2A2622' }, p); E('circle', { cx: 0, cy: -2, r: 12, fill: '#1A1614' }, p);
    E('path', { d: 'M-50,0 h-14 v26', stroke: '#B88E3A', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, p); E('circle', { cx: -64, cy: 30, r: 6, fill: '#2A2622' }, p);
    E('rect', { x: 50, y: -16, width: 10, height: 12, fill: '#B88E3A' }, p);
    TX(p, 0, 50, 'CROW\'S NEST', 10, '#F0D27E', { a: 'middle', w: 800, ls: .5 }); }
  const phoneHook = G(g); tf(phoneHook, PHX + 59, PHY);
  E('path', { d: 'M-9,-26 Q-18,0 -2,22', stroke: '#1E1A1C', 'stroke-width': 4, fill: 'none' }, phoneHook);
  itrHandset(phoneHook);
  [[150, 312], [174, 340]].forEach(([x, y]) => { E('path', { d: `M${x},-200 V${y}`, stroke: '#B88E3A', 'stroke-width': 14 }, g); E('path', { d: `M${x - 4},-200 V${y}`, stroke: '#E2BE62', 'stroke-width': 3 }, g);
    E('path', { d: `M${x - 14},${y + 22} Q${x},${y - 6} ${x + 14},${y + 22} Z`, fill: '#C9A045' }, g); E('ellipse', { cx: x, cy: y + 22, rx: 14, ry: 5, fill: '#3A2A10' }, g); });
  /* ---------- compass binnacle (brass hood, Kelvin spheres) ---------- */
  const BX = 790;
  { const b = G(g); tf(b, BX, 800);
    E('ellipse', { cx: 0, cy: 6, rx: 110, ry: 16, fill: '#000', 'fill-opacity': .3 }, b);
    E('path', { d: 'M-70,0 L-44,-200 H44 L70,0 Z', fill: '#7A5236' }, b); E('path', { d: 'M20,-200 H44 L70,0 H34 Z', fill: '#000', 'fill-opacity': .18 }, b);
    E('rect', { x: -76, y: -14, width: 152, height: 14, rx: 4, fill: '#5E3E28' }, b);
    E('rect', { x: -56, y: -214, width: 112, height: 18, rx: 6, fill: '#B88E3A' }, b);
    E('path', { d: 'M-50,-214 Q-50,-290 0,-294 Q50,-290 50,-214 Z', fill: '#C9A045' }, b); E('path', { d: 'M10,-292 Q50,-286 50,-214 H24 Z', fill: '#000', 'fill-opacity': .15 }, b);
    E('path', { d: 'M-30,-276 Q-34,-252 -32,-226', stroke: '#F0D27E', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, b);
    E('rect', { x: -22, y: -262, width: 44, height: 30, rx: 8, fill: '#FFE7A8' }, b); E('path', { d: 'M0,-258 V-236 M-14,-247 H14', stroke: '#8A5A20', 'stroke-width': 2 }, b);
    E('circle', { cx: 0, cy: -300, r: 9, fill: '#B88E3A' }, b);
    [-1, 1].forEach(s => { E('path', { d: `M${s * 50},-206 H${s * 84}`, stroke: '#B88E3A', 'stroke-width': 6 }, b); E('circle', { cx: s * 98, cy: -206, r: 24, fill: '#24302C' }, b); E('circle', { cx: s * 98 - 8, cy: -214, r: 7, fill: '#5A6E66' }, b); });
    const bl = itrGlow(b, 0, -246, 70, 50, '#FFD27A', .55); A.push(at => op(bl, .8 + .2 * wob(at * 2, 5))); }
  /* ---------- engine-order telegraph: dial at chest height, side lever ----------
     the lever pivots at the dial centre and sticks out on the LEFT (towards the
     officer): up = ahead, level = stop, down = astern; the red pointer shows the order */
  const TC = [1290, 590], TR = 80, LR = TR + 38, ANG = v => v * 78, LANG = v => -90 + 55 * v;
  const tg = G(g);
  E('ellipse', { cx: TC[0], cy: 806, rx: 80, ry: 13, fill: '#000', 'fill-opacity': .3 }, tg);
  E('path', { d: `M${TC[0] - 34},800 L${TC[0] - 20},${TC[1] + 80} H${TC[0] + 20} L${TC[0] + 34},800 Z`, fill: '#B88E3A' }, tg);
  E('path', { d: `M${TC[0] + 6},800 L${TC[0] + 6},${TC[1] + 80} H${TC[0] + 20} L${TC[0] + 34},800 Z`, fill: '#000', 'fill-opacity': .16 }, tg);
  E('path', { d: `M${TC[0] - 22},${TC[1] + 100} V780`, stroke: '#F0D27E', 'stroke-width': 4, 'stroke-opacity': .6 }, tg);
  E('rect', { x: TC[0] - 50, y: 784, width: 100, height: 18, rx: 6, fill: '#9A7430' }, tg);
  const lever = G(tg);
  E('rect', { x: -7, y: -LR + 4, width: 14, height: LR, rx: 6, fill: '#9A7430' }, lever); E('rect', { x: -7, y: -LR + 4, width: 5, height: LR, rx: 2, fill: '#F0D27E', 'fill-opacity': .6 }, lever);
  E('rect', { x: -22, y: -LR - 12, width: 44, height: 24, rx: 12, fill: '#2A2622' }, lever); E('rect', { x: -17, y: -LR - 8, width: 16, height: 6, rx: 3, fill: '#5A5458' }, lever);
  E('circle', { cx: TC[0], cy: TC[1], r: TR + 16, fill: '#9A7430' }, tg); E('circle', { cx: TC[0], cy: TC[1], r: TR + 10, fill: '#C9A045' }, tg);
  E('path', { d: `M${TC[0] - TR - 6},${TC[1] - 16} A${TR + 8},${TR + 8} 0 0 1 ${TC[0] - 24},${TC[1] - TR - 4}`, stroke: '#F0D27E', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .7 }, tg);
  E('circle', { cx: TC[0], cy: TC[1], r: TR, fill: '#F6F0E2' }, tg);
  const SEG = [[-1, 'FULL'], [-.66, 'HALF'], [-.33, 'SLOW'], [0, 'STOP'], [.33, 'SLOW'], [.66, 'HALF'], [1, 'FULL']];
  SEG.forEach(([v, lab]) => { const a0 = ANG(v) - 13, a1 = ANG(v) + 13, r0 = TR - 3, r1 = TR * .48;
    const Pt = (a, r) => [TC[0] + Math.sin(a * Math.PI / 180) * r, TC[1] - Math.cos(a * Math.PI / 180) * r];
    const [x0, y0] = Pt(a0, r0), [x1, y1] = Pt(a1, r0), [x2, y2] = Pt(a1, r1), [x3, y3] = Pt(a0, r1);
    E('path', { d: `M${f2(x0)},${f2(y0)} A${r0},${r0} 0 0 1 ${f2(x1)},${f2(y1)} L${f2(x2)},${f2(y2)} A${r1},${r1} 0 0 0 ${f2(x3)},${f2(y3)} Z`, fill: v < 0 ? '#F2CFC8' : v > 0 ? '#FFFFFF' : '#F7E7A8' }, tg);
    const [tx, ty] = Pt(ANG(v), TR * .74); const rot = v === 0 ? 0 : (v > 0 ? ANG(v) - 90 : ANG(v) + 90);
    const t = TX(tg, f2(tx), f2(ty + 3.6), lab, v === 0 ? 11 : 10, v < 0 ? '#9E2B2B' : '#1E2235', { a: 'middle', w: 800 }); t.setAttribute('transform', `rotate(${f2(rot)} ${f2(tx)} ${f2(ty)})`); });
  { let d = ''; for (let i = 0; i < 8; i++) { const a = (-91 + i * 26) * Math.PI / 180; d += `M${f2(TC[0] + Math.sin(a) * (TR - 3))},${f2(TC[1] - Math.cos(a) * (TR - 3))} L${f2(TC[0] + Math.sin(a) * TR * .48)},${f2(TC[1] - Math.cos(a) * TR * .48)} `; } E('path', { d, stroke: '#8A7A5A', 'stroke-width': 1.3 }, tg); }
  TX(tg, TC[0] - 36, TC[1] + 32, 'ASTERN', 10, '#9E2B2B', { a: 'middle', w: 800, ls: .8 }); TX(tg, TC[0] + 36, TC[1] + 32, 'AHEAD', 10, '#1E2235', { a: 'middle', w: 800, ls: .8 });
  E('path', { d: `M${TC[0]},${TC[1] + 16} V${TC[1] + TR - 5}`, stroke: '#D9CFB8', 'stroke-width': 2 }, tg);
  const pointer = G(tg); E('path', { d: `M-5,0 L0,${-TR * .46} L5,0 Z`, fill: '#B5302A' }, pointer); E('path', { d: `M-6,${-TR - 8} L0,${-TR + 3} L6,${-TR - 8} Z`, fill: '#B5302A' }, pointer);
  E('circle', { cx: TC[0], cy: TC[1], r: 13, fill: '#9A7430' }, tg); E('circle', { cx: TC[0], cy: TC[1], r: 6.5, fill: '#E2BE62' }, tg);
  E('path', { d: `M${TC[0] - TR + 15},${TC[1] - TR + 26} Q${TC[0] - 26},${TC[1] - TR + 4} ${TC[0]},${TC[1] - TR + 2}`, stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, tg);
  const tLamp = itrGlow(tg, TC[0], TC[1] - 30, 150, 120, '#FFD28A', .25);
  if (o.vignette !== false) g.vignette = itrVignette(g, .5, .45);
  /* ---------- FRONT: the ship's wheel on its pedestal ----------
     hub at chest height of the helmsman (anchors.helm), rim top at his
     shoulders; 8 spokes set 22.5° off vertical so no handle crosses his face */
  const W = [520, 650], WR = 95, HLN = 28;
  const F = g.front;
  E('ellipse', { cx: W[0], cy: 806, rx: 72, ry: 11, fill: '#000', 'fill-opacity': .3 }, F);
  E('path', { d: `M${W[0] - 38},800 L${W[0] - 22},${W[1] + 14} H${W[0] + 22} L${W[0] + 38},800 Z`, fill: '#7A5236' }, F);
  E('path', { d: `M${W[0] + 6},800 L${W[0] + 6},${W[1] + 14} H${W[0] + 22} L${W[0] + 38},800 Z`, fill: '#000', 'fill-opacity': .2 }, F);
  E('rect', { x: W[0] - 46, y: 788, width: 92, height: 16, rx: 5, fill: '#5E3E28' }, F);
  E('rect', { x: W[0] - 30, y: W[1] + 4, width: 60, height: 18, rx: 6, fill: '#B88E3A' }, F); E('rect', { x: W[0] - 30, y: W[1] + 4, width: 60, height: 5, rx: 2.5, fill: '#E2BE62' }, F);
  const wheel = G(F); const wIn = G(wheel);
  for (let i = 0; i < 8; i++) { const sp = G(wIn, { transform: `rotate(${22.5 + i * 45})` });
    E('rect', { x: -4.5, y: -WR - 6, width: 9, height: WR + 6, rx: 3.5, fill: '#8A5A33' }, sp);
    E('path', { d: `M-6,${-WR - 4} Q-9,${-WR - 13} -5,${-WR - 19} Q-8,${-WR - 25} 0,${-WR - HLN} Q8,${-WR - 25} 5,${-WR - 19} Q9,${-WR - 13} 6,${-WR - 4} Z`, fill: '#A06C3E' }, sp);
    E('rect', { x: -1.8, y: -WR - 26, width: 2.6, height: 22, rx: 1.3, fill: '#C89A68' }, sp);
    if (!i) E('rect', { x: -6, y: -WR - 12, width: 12, height: 5, rx: 2, fill: '#E2BE62' }, sp); }
  E('circle', { r: WR, fill: 'none', stroke: '#6E4426', 'stroke-width': 20 }, wIn);
  E('circle', { r: WR, fill: 'none', stroke: '#9A6A3E', 'stroke-width': 13 }, wIn);
  E('circle', { r: WR - 3, fill: 'none', stroke: '#C08E5A', 'stroke-width': 2.5, 'stroke-opacity': .7 }, wIn);
  E('circle', { r: WR * .5, fill: 'none', stroke: '#B88E3A', 'stroke-width': 5 }, wIn);
  E('circle', { r: 24, fill: '#B88E3A' }, wIn); E('circle', { r: 15, fill: '#E2BE62' }, wIn); E('circle', { r: 6, fill: '#8A6526' }, wIn);
  E('path', { d: `M${f2(-WR * .7)},${f2(-WR * .55)} A${f2(WR * .9)},${f2(WR * .9)} 0 0 1 ${f2(-WR * .1)},${f2(-WR * .89)}`, stroke: '#E8B888', 'stroke-width': 3.5, fill: 'none', 'stroke-opacity': .5 }, wheel);
  const cordAnim = itrPhoneLink(g, phoneHook, [PHX + 50, PHY - 26]);
  let tv = 0, wa = 0;
  g.setWheel = deg => { wa = deg; wheel.setAttribute('transform', `translate(${W[0]},${W[1]}) rotate(${f2(deg)})`); };
  g.wheelGrip = (i = 0) => { const a = ((i ? 58 : -58) + wa) * Math.PI / 180; return [W[0] + Math.sin(a) * WR, W[1] - Math.cos(a) * WR]; };
  g.setTelegraph = v => { tv = clamp(v, -1, 1); pointer.setAttribute('transform', `translate(${TC[0]},${TC[1]}) rotate(${f2(ANG(tv))})`); lever.setAttribute('transform', `translate(${TC[0]},${TC[1]}) rotate(${f2(LANG(tv))})`); };
  g.telegraphGrip = () => { const a = LANG(tv) * Math.PI / 180; return [TC[0] + Math.sin(a) * LR, TC[1] - Math.cos(a) * LR]; };
  g.anchors = { helm: [520, 792], wheel: W, wheelR: WR, telegraph: TC, officer: [1100, 800], binnacle: [BX, 800], captain: [950, 805],
    phone: [PHX, PHY], phoneHandset: [PHX + 59, PHY], phoneMan: [215, 800], window: [835, 300], iceberg: [925, HZ], ahead: [800, HZ], horizon: HZ };
  g.anim = at => { A.forEach(f => f(at)); cordAnim(at); op(lamp, .85 + .15 * wob(at * 1.2, 2)); op(tLamp, .8 + .2 * wob(at * 1.7, 4)); tf(view, Math.sin(at * .3) * 3, Math.sin(at * .5) * 2); };
  g.setWheel(0); g.setTelegraph(1); g.anim(0);
  return g;
}

/* lifeboat for the deck view, seen from the side and a little from above.
   Local origin = middle of the near gunwale.  Returns { g, back, seat, front,
   seats } — passengers go in `seat` (between the boat's inside and its near
   side), so the hull hides their legs; seats are Human root points for
   { sit:true, s: .5 }. */
function itrDeckBoat(p, L, o = {}) {
  const g = G(p), back = G(g), seat = G(g), front = G(g);
  const Hd = L * .17, n = 22;
  const sheer = u => -10 * u * u, half = L / 2;
  let near = '', far = '';
  for (let i = 0; i <= n; i++) { const u = -1 + 2 * i / n, x = u * half;
    near += (i ? ' L' : 'M') + f2(x) + ',' + f2(sheer(u));
    far = ` L${f2(x)},${f2(sheer(u) - 19 * Math.sqrt(Math.max(0, 1 - u * u)))}` + far; }
  /* inside: far planking + thwarts */
  E('path', { d: near + far + ' Z', fill: o.inside || '#7A5636' }, back);
  E('path', { d: near + far + ' Z', fill: lgrad([[0, '#000', .25], [1, '#000', 0]]) }, back);
  const NS = o.seats || 6, seats = [];
  for (let k = 0; k < NS; k++) { const x = -half + 70 + k * (L - 140) / (NS - 1), u = x / half, yf = sheer(u) - 19 * Math.sqrt(1 - u * u);
    E('path', { d: `M${f2(x - 7)},${f2(yf + 2)} L${f2(x + 7)},${f2(yf + 2)} L${f2(x + 9)},${f2(sheer(u))} L${f2(x - 9)},${f2(sheer(u))} Z`, fill: '#B8885A' }, back);
    seats.push([f2(x), 86]); }
  { let d = ''; for (let i = 0; i <= n; i++) { const u = -1 + 2 * i / n; d += (i ? ' L' : 'M') + f2(u * half) + ',' + f2(sheer(u) - 19 * Math.sqrt(Math.max(0, 1 - u * u))); }
    E('path', { d, stroke: '#5E3E22', 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round' }, back); }
  /* near side of the hull */
  const hull = `${near} Q${f2(L * .49)},${f2(Hd * .72)} ${f2(L * .36)},${f2(Hd)} L${f2(-L * .36)},${f2(Hd)} Q${f2(-L * .49)},${f2(Hd * .72)} ${f2(-half)},${f2(sheer(-1))} Z`;
  E('path', { d: hull, fill: o.hull || '#DCD8CE' }, front);
  E('path', { d: hull, fill: lgrad([[0, '#000', 0], [.45, '#000', .04], [1, '#0A1030', .38]]) }, front);
  { let d = ''; for (let k = 1; k < 4; k++) { const y = Hd * k * .23; d += `M${f2(-L * .47 + k * 8)},${f2(y)} Q0,${f2(y + 4)} ${f2(L * .47 - k * 8)},${f2(y)} `; } E('path', { d, stroke: '#B9B4A8', 'stroke-width': 1.5, fill: 'none' }, front); }
  E('path', { d: near, stroke: '#8A5A33', 'stroke-width': 7, fill: 'none', transform: 'translate(0,9)', 'stroke-linecap': 'round' }, front);
  E('path', { d: near, stroke: '#5E3E22', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, front);
  E('path', { d: near, stroke: '#A0703F', 'stroke-width': 2.5, fill: 'none', transform: 'translate(0,-2)', 'stroke-linecap': 'round' }, front);
  { let d = ''; for (let x = -half + 30; x < half - 40; x += 38) d += `M${f2(x)},${f2(sheer(x / half) + 16)} q19,16 38,0 `; E('path', { d, stroke: '#C8B48A', 'stroke-width': 2.2, fill: 'none' }, front); }
  E('rect', { x: -18, y: Hd * .38, width: 36, height: 16, rx: 3, fill: '#F2EEE4' }, front);
  [-1, 1].forEach(s => E('rect', { x: s * (half - 18) - 4, y: -22, width: 8, height: 14, rx: 2, fill: '#3A3436' }, front));
  return { g, back, seat, front, seats, L };
}

/* =====================================================================
   7) bgDeck(parent, o) — the boat deck at night, looking out to sea.
   Structure:  g ▸ g.sky   (level: stars, horizon, sea)
                 ▸ g.ship  (tilts: deck, deckhouse, funnel, lifeboats, rail, furniture)
                     ▸ g.mid    ← add characters here (they tilt with the deck)
                     ▸ g.front  (= g.over) foreground above g.mid
                 ▸ steam plume (level) ▸ flood water (level) ▸ g.vignette
   g.setTilt(deg)   tilt the ship around anchors.pivot (800,720); + = clockwise (right side down)
   g.setSlide(dx)   loose deckchairs/bench slide dx px along the deck
   g.setBoat(i, k)  lower lifeboat i (0 = left, 1 = right) by k 0..1 (1 = gone below the deck edge);
                    its passengers go down with it
   g.boats[i]       { g, back, seat, front, seats:[[x,y]×6], seatScale:.5, bx, L, k } — seat a passenger with
                    Human(g.boats[i].seat).set({ x, y, sit:true, s:.5 }) using a seats[] point (boat-local);
                    the hull side (front) hides the legs, so leave seats empty for "half-empty boats"
   g.setWater(y)    screen y of the rising sea over the deck (null / ≥ 1000 = none)
   g.setSteam(k)    steam roaring from the funnel's escape pipes 0..1: a plume billows across the
                    top of the frame (stays level, reads at any tilt) + a hissing pipe flange
   g.scaleAt(y)     Human scale for feet at ship-frame y (perspective: 1 at y 780, ≈ .55 at the rail)
   g.toWorld(x, y)  ship-frame point → set point for the current tilt
   g.fade(o) fades everything (characters included);  g.raiseFront() is a no-op here
   g.anchors = { band:[330,780], bandRow:[[110,780],[260,780],[410,780],[560,780]] (s:1),
     lifeboat:[1380,700] (boarding spot, s ≈ .8), boat0:[700,446], boat1:[1380,446] (gunwale centres),
     rail:610, deck:770, door:[150,640], doorScale:.62, railScale:.55, boatScale:.5, horizon:400, pivot:[800,720] }
   (anchors are in the un-tilted ship frame: put characters inside g.mid)
   ===================================================================== */
function bgDeck(parent, o = {}) {
  const g = G(parent), A = [];
  const HZ = 400, PV = [800, 720];
  /* --- level sky + sea --- */
  const sky = G(g);
  E('rect', { x: -1600, y: -1400, width: 4800, height: 500, fill: '#02040C' }, sky);
  E('rect', { x: -1600, y: -1000, width: 4800, height: HZ + 1002, fill: lgrad([[0, '#02040C'], [.6, '#070C20'], [.92, '#121D44'], [1, '#1C2A58']]) }, sky);
  E('ellipse', { cx: 700, cy: 60, rx: 1300, ry: 130, fill: rgrad([[0, '#9FB2E8', .18], [.6, '#9FB2E8', .05], [1, '#9FB2E8', 0]]), transform: 'rotate(-18 700 60)' }, sky);
  const st = itrStars(sky, -900, -900, 3400, HZ + 880, 620, 21, { pow: 1.2 }); A.push(st.anim);
  E('rect', { x: -1600, y: HZ, width: 4800, height: 1800, fill: lgrad([[0, '#070B1A'], [.25, '#03050C'], [1, '#010204']]) }, sky);
  E('rect', { x: -1600, y: HZ - 1, width: 4800, height: 2, fill: '#3A4A7A', 'fill-opacity': .55 }, sky);
  { let d = ''; for (let i = 0; i < 80; i++) { const x = -800 + hash(i * 3.9) * 3200, y = HZ + 5 + Math.pow(hash(i * 2.2), 1.5) * 500; d += `M${f2(x)},${f2(y)} h${f2(4 + hash(i * 7) * 14)} `; } E('path', { d, stroke: '#C9D6FF', 'stroke-opacity': .2, 'stroke-width': 1.5 }, sky); }
  /* --- tilting ship --- */
  const ship = G(g); const S = G(ship);
  const DK = 610;
  E('rect', { x: -1400, y: DK, width: 4400, height: 1400, fill: '#6E5A48' }, S);
  { let d = ''; let y = DK, h = 8; while (y < 1700) { d += `M-1000,${f2(y)} H2600 `; y += h; h *= 1.09; } E('path', { d, stroke: '#4E3E32', 'stroke-width': 2 }, S);
    let b = ''; y = DK; h = 8; let r = 0; while (y < 1500) { for (let k = 0; k < 4; k++) { const x = -900 + hash(r * 9 + k) * 3400; b += `M${f2(x)},${f2(y + 1)} v${f2(h - 2)} `; } y += h; h *= 1.09; r++; }
    E('path', { d: b, stroke: '#54443A', 'stroke-width': 1.5 }, S);
    E('rect', { x: -1000, y: DK, width: 3600, height: 900, fill: lgrad([[0, '#0A0E22', .1], [1, '#0A0E22', .35]]) }, S); }
  E('rect', { x: -1000, y: DK, width: 3600, height: 70, fill: lgrad([[0, '#000', .45], [1, '#000', 0]]) }, S);
  /* deckhouse (left) with funnel base */
  E('rect', { x: -1000, y: 230, width: 1330, height: 386, fill: '#BDB8AE' }, S);
  E('rect', { x: -1000, y: 222, width: 1340, height: 14, rx: 3, fill: '#9E998E' }, S);
  E('rect', { x: 300, y: 230, width: 30, height: 386, fill: '#000', 'fill-opacity': .14 }, S);
  { let d = ''; for (let x = -980; x < 300; x += 46) d += `M${x},236 V610 `; E('path', { d, stroke: '#ADA89E', 'stroke-width': 2 }, S); }
  [[-260, 330], [-120, 330], [250, 330], [-700, 330], [-560, 330]].forEach(([x, y]) => { E('rect', { x: x - 34, y: y - 50, width: 68, height: 90, rx: 6, fill: '#8E897E' }, S); E('rect', { x: x - 28, y: y - 44, width: 56, height: 78, rx: 4, fill: '#FFD98A' }, S);
    E('path', { d: `M${x},${y - 44} V${y + 34} M${x - 28},${y - 6} H${x + 28}`, stroke: '#8E897E', 'stroke-width': 4 }, S); itrGlow(S, x, y + 40, 90, 60, '#FFD98A', .22); });
  /* door with warm light (first-class entrance) — in perspective: a person at
     anchors.door is drawn at scale ≈ .62 (see g.scaleAt) */
  E('rect', { x: 66, y: 400, width: 168, height: 214, fill: '#8E897E' }, S); E('rect', { x: 76, y: 410, width: 148, height: 204, fill: lgrad([[0, '#FFE7B0'], [1, '#E8A860']]) }, S);
  E('path', { d: 'M150,410 V614 M76,500 H224', stroke: '#8E6A44', 'stroke-width': 6 }, S);
  E('path', { d: 'M76,614 L-40,760 L380,760 L224,614 Z', fill: rgrad([[0, '#FFD98A', .35], [1, '#FFD98A', 0]], .5, 0, 1) }, S);
  E('rect', { x: 56, y: 390, width: 188, height: 14, rx: 3, fill: '#9E998E' }, S);
  { const lb = G(S); tf(lb, 40, 296, 0, .8); E('circle', { r: 46, fill: '#F2EEE6' }, lb); E('circle', { r: 26, fill: '#BDB8AE' }, lb);
    [0, 90, 180, 270].forEach(a => E('path', { d: 'M0,-46 A46,46 0 0 1 20.5,-41.2 L11.6,-23.3 A26,26 0 0 0 0,-26 Z', fill: '#C8403A', transform: `rotate(${a + 25})` }, lb));
    E('path', { d: 'M-40,-22 Q0,-66 40,-22', stroke: '#C8B48A', 'stroke-width': 3, fill: 'none' }, lb); }
  { const sg = G(S); tf(sg, 150, 372); E('rect', { x: -90, y: -16, width: 180, height: 28, rx: 4, fill: '#2A2F45' }, sg); TX(sg, 0, 4, 'FIRST CLASS ENTRANCE', 12, '#F0D27E', { a: 'middle', w: 800, ls: 1 }); }
  /* wall lamps */
  const lampsG = [-20, 300].map(x => { E('rect', { x: x - 4, y: 360, width: 8, height: 20, fill: '#5A5458' }, S); E('circle', { cx: x, cy: 352, r: 13, fill: '#FFF2C4' }, S); E('path', { d: `M${x - 13},346 Q${x},328 ${x + 13},346`, fill: '#5A5458' }, S);
    return itrGlow(S, x, 360, 210, 190, '#FFE2A0', .4); });
  /* funnel base on the roof, with its steam escape pipes */
  { const fx0 = -250, fx1 = 300, fw = fx1 - fx0;
    E('rect', { x: fx0 - 40, y: 180, width: fw + 80, height: 46, rx: 6, fill: '#8E897E' }, S); E('rect', { x: fx0 - 40, y: 180, width: fw + 80, height: 8, rx: 4, fill: '#ADA89E' }, S);
    E('rect', { x: fx0, y: -1000, width: fw, height: 1182, fill: lgrad([[0, '#7A5420'], [.22, '#C9913E'], [.4, '#D49C48'], [.75, '#9E6E28'], [1, '#6E4A1A']], 0, 0, 1, 0) }, S);
    let d = ''; for (let y = -980; y < 180; y += 52) d += `M${fx0},${y} H${fx1} `; E('path', { d, stroke: '#7A5420', 'stroke-width': 3, 'stroke-opacity': .5 }, S);
    let r = ''; for (let y = -980; y < 180; y += 52) for (let x = fx0 + 12; x < fx1; x += 22) r += `M${x},${y + 5} m-1.6,0 a1.6,1.6 0 1 0 3.2,0 a1.6,1.6 0 1 0 -3.2,0 `; E('path', { d: r, fill: '#E2B060', 'fill-opacity': .5 }, S);
    E('rect', { x: fx0, y: -1000, width: fw, height: 1182, fill: lgrad([[0, '#05081A', .55], [1, '#05081A', .1]]) }, S);
    E('rect', { x: fx1 - 70, y: -1000, width: 18, height: 1182, fill: '#B88E3A' }, S); E('rect', { x: fx1 - 66, y: -1000, width: 5, height: 1182, fill: '#E2BE62' }, S);
    E('rect', { x: fx1 - 40, y: -1000, width: 12, height: 1182, fill: '#9A7430' }, S);
    [60, 120].forEach(y => { E('rect', { x: fx1 - 76, y, width: 30, height: 9, rx: 3, fill: '#7A5A20' }, S); E('rect', { x: fx1 - 46, y: y + 2, width: 22, height: 7, rx: 3, fill: '#7A5A20' }, S); }); }
  /* hissing leak at the escape-pipe flange (tilts with the ship) */
  const leakG = G(S); const leak = [0, 1, 2, 3, 4].map(() => { const q = G(leakG); E('ellipse', { rx: 16, ry: 10, fill: '#EEF2F8' }, q); E('ellipse', { cx: 8, cy: -4, rx: 10, ry: 7, fill: '#FFFFFF' }, q); return q; });
  /* lifeboats in quadrant davits beyond the rail: 30-ft boats in perspective
     (≈ .5 scale) with room for six seated passengers each */
  const boats = [], BXs = [700, 1380], BL = 580, BY = 446;
  BXs.forEach((bx, i) => {
    [-1, 1].forEach(sd => { const dx = bx + sd * (BL / 2 + 22); const dv = G(S);
      E('path', { d: `M${dx},${DK} V330 Q${dx},250 ${dx - sd * 70},250`, stroke: '#8E897E', 'stroke-width': 22, fill: 'none', 'stroke-linecap': 'round' }, dv);
      E('path', { d: `M${dx},${DK} V330 Q${dx},250 ${dx - sd * 70},250`, stroke: '#C9C4BA', 'stroke-width': 15, fill: 'none', 'stroke-linecap': 'round' }, dv);
      E('path', { d: `M${dx - 4},${DK} V330 Q${dx - 4},256 ${dx - sd * 66},254`, stroke: '#E2DED4', 'stroke-width': 3, fill: 'none', 'stroke-opacity': .6 }, dv);
      E('rect', { x: dx - sd * 70 - 10, y: 244, width: 20, height: 26, rx: 4, fill: '#5A4A38' }, dv);
      E('rect', { x: dx - 22, y: DK - 10, width: 44, height: 14, rx: 3, fill: '#6E6A62' }, dv); });
    const bg = G(S, { 'clip-path': clipRect(-1000, -1000, 3600, DK + 1000) }); const falls = E('path', { stroke: '#C8B48A', 'stroke-width': 2.5, fill: 'none' }, bg);
    const B = itrDeckBoat(bg, BL, {});
    boats.push({ g: B.g, back: B.back, seat: B.seat, front: B.front, seats: B.seats, seatScale: .5, falls, bx, L: BL, k: 0 }); });
  /* railing (deck edge) */
  { const r = G(S); let d = ''; for (let x = -1000; x <= 2600; x += 46) d += `M${x},${DK} V478 `;
    E('path', { d, stroke: '#9E998E', 'stroke-width': 6, 'clip-path': clipRect(330, 300, 2400, 400) }, r);
    E('path', { d: `M330,478 H2600 M330,530 H2600 M330,575 H2600`, stroke: '#C9C4BA', 'stroke-width': 7 }, r);
    E('path', { d: `M330,474 H2600`, stroke: '#8A6A48', 'stroke-width': 12 }, r); E('path', { d: `M330,470 H2600`, stroke: '#A8845E', 'stroke-width': 4 }, r); }
  /* ventilator cowl (on the deck, in front of the rail) */
  { const v = G(S); tf(v, 1040, 636, 0, .92);
    E('ellipse', { cx: 10, cy: 2, rx: 50, ry: 8, fill: '#000', 'fill-opacity': .25 }, v);
    E('rect', { x: -26, y: -150, width: 52, height: 150, fill: '#BDB8AE' }, v); E('rect', { x: 8, y: -150, width: 18, height: 150, fill: '#000', 'fill-opacity': .12 }, v);
    E('path', { d: 'M-26,-150 Q-30,-230 40,-238 L70,-238 Q76,-180 26,-150 Z', fill: '#C9C4BA' }, v);
    E('ellipse', { cx: 56, cy: -206, rx: 26, ry: 40, fill: '#D9D4CA', transform: 'rotate(-15 56 -206)' }, v);
    E('ellipse', { cx: 58, cy: -206, rx: 18, ry: 31, fill: '#A8322D', transform: 'rotate(-15 58 -206)' }, v);
    E('rect', { x: -34, y: -12, width: 68, height: 12, rx: 3, fill: '#8E897E' }, v); }
  /* loose furniture */
  const loose = G(S); const furn = [];
  const bench = (x, y) => { const b = G(loose); tf(b, x, y);
    E('ellipse', { cx: 0, cy: 2, rx: 150, ry: 9, fill: '#000', 'fill-opacity': .22 }, b);
    E('rect', { x: -130, y: -150, width: 260, height: 14, rx: 4, fill: '#9A6A3A' }, b); E('rect', { x: -130, y: -126, width: 260, height: 14, rx: 4, fill: '#9A6A3A' }, b);
    E('rect', { x: -136, y: -70, width: 272, height: 16, rx: 4, fill: '#A87444' }, b); E('rect', { x: -136, y: -70, width: 272, height: 5, rx: 2, fill: '#C08E5A' }, b);
    [-120, 120].forEach(sx => E('path', { d: `M${sx},0 V-60 M${sx},-60 L${sx * 1.02},-156`, stroke: '#3A3436', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, b));
    return b; };
  /* steamer deckchair, side view: wooden frame + a thick sagging canvas sling */
  const chair = (x, y, c) => { const b = G(loose); tf(b, x, y);
    E('ellipse', { cx: 20, cy: 2, rx: 110, ry: 9, fill: '#000', 'fill-opacity': .25 }, b);
    E('path', { d: 'M-72,-196 L-36,-74 L-52,0 M-36,-74 L100,-50 L104,0', stroke: '#5E3A20', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
    const sl = 'M-64,-182 Q-48,-118 -30,-84 Q-4,-50 40,-58 Q78,-64 110,-54';
    E('path', { d: sl, stroke: c, 'stroke-width': 24, fill: 'none', 'stroke-linecap': 'round' }, b);
    E('path', { d: sl, stroke: shade(c, -.25), 'stroke-width': 24, fill: 'none', 'stroke-dasharray': '9 13', 'stroke-opacity': .45 }, b);
    E('path', { d: sl, stroke: '#fff', 'stroke-opacity': .2, 'stroke-width': 7, fill: 'none', transform: 'translate(-3,-6)', 'stroke-linecap': 'round' }, b);
    E('path', { d: 'M-60,-120 L30,-104 M24,-104 L28,-58', stroke: '#8E5E36', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, b);
    return b; };
  furn.push({ n: bench(800, 750), x: 800, y: 750, m: 1 }); furn.push({ n: chair(1080, 800, '#3E6B8E'), x: 1080, y: 800, m: 1.4 }); furn.push({ n: chair(1235, 812, '#8E3B32'), x: 1235, y: 812, m: 1.2 });
  /* deck lamp post */
  { const lp = G(S); tf(lp, 1560, DK + 4); E('rect', { x: -5, y: -150, width: 10, height: 150, fill: '#3A3436' }, lp); E('circle', { cx: 0, cy: -164, r: 15, fill: '#FFF2C4' }, lp);
    E('path', { d: 'M-16,-170 Q0,-190 16,-170', fill: '#3A3436' }, lp); lampsG.push(itrGlow(lp, 0, -164, 120, 100, '#FFE2A0', .4)); }
  g.mid = G(ship);
  g.front = G(ship); g.over = g.front; g.raiseFront = () => {}; g.fade = v => op(g, v);
  /* --- level steam plume (world space): roars from the escape pipes above the
     frame and billows across the top of the picture, whatever the tilt --- */
  const steamW = G(g); const plume = [];
  for (let i = 0; i < 16; i++) { const q = G(steamW); E('circle', { r: 34, fill: '#DDE3EC' }, q); E('circle', { cx: 16, cy: 12, r: 26, fill: '#B9C1CE' }, q); E('circle', { cx: -14, cy: -12, r: 22, fill: '#FFFFFF' }, q); plume.push(q); }
  /* --- level flood water (over everything) --- */
  const water = G(g); const wBody = E('path', { fill: '#0E2440', 'fill-opacity': .82 }, water), wTop = E('path', { fill: 'none', stroke: '#8FB8E8', 'stroke-width': 3, 'stroke-opacity': .6 }, water);
  if (o.vignette !== false) g.vignette = itrVignette(g, .5, .42);
  let tilt = 0, waterY = null, steamK = 0;
  const rot = (x, y) => { const a = tilt * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), dx = x - PV[0], dy = y - PV[1]; return [PV[0] + dx * c - dy * s, PV[1] + dx * s + dy * c]; };
  g.ship = ship; g.sky = sky; g.boats = boats;
  g.setTilt = deg => { tilt = deg; ship.setAttribute('transform', `rotate(${f2(deg)} ${PV[0]} ${PV[1]})`); };
  g.setSlide = dx => { furn.forEach(f => tf(f.n, f.x + dx * f.m, f.y, clamp(dx * .02 * f.m, -8, 8))); };
  g.setBoat = (i, k) => { const b = boats[i]; if (!b) return; b.k = clamp(k); };
  g.setWater = y => { waterY = (y == null || y >= 1000) ? null : y; };
  g.setSteam = k => { steamK = clamp(k); };
  g.scaleAt = y => clamp((y - HZ) / 380, .15, 1.6);
  g.toWorld = (x, y) => rot(x, y);
  g.anchors = { band: [330, 780], bandRow: [[110, 780], [260, 780], [410, 780], [560, 780]], lifeboat: [1380, 700], boat0: [BXs[0], BY], boat1: [BXs[1], BY],
    rail: DK, deck: 770, door: [150, 640], doorScale: .62, railScale: .55, boatScale: .5, horizon: HZ, pivot: PV };
  g.anim = at => {
    A.forEach(f => f(at));
    lampsG.forEach((l, i) => op(l, .8 + .2 * wob(at * 1.8, i * 2)));
    boats.forEach((b, i) => { const drop = b.k * 300, sw = Math.sin(at * .9 + i) * (1 + b.k * 1.4), y = BY + drop;
      b.g.setAttribute('transform', `translate(${b.bx},${f2(y)}) rotate(${f2(sw)})`);
      const e = b.L / 2 + 22, ex = b.L / 2 - 18; b.falls.setAttribute('d', `M${b.bx - e + 70},262 L${f2(b.bx - ex)},${f2(y - 22)} M${b.bx + e - 70},262 L${f2(b.bx + ex)},${f2(y - 22)}`); });
    if (steamK > 0) { op(steamW, 1); op(leakG, 1); const e0 = rot(244, -20);
      plume.forEach((q, i) => { const ph = (at * .45 + i / plume.length) % 1, yT = 150 + 46 * Math.sin(i * 1.7);
        const x = e0[0] + 900 * (ph * .55 + easeOut(ph) * .45) + Math.sin(at * 1.6 + i) * 14, y = lerp(e0[1], yT, Math.pow(ph, .7)) - 24 * Math.sin(ph * Math.PI);
        tf(q, x, y, 0, .7 + ph * 2.8); op(q, steamK * .92 * Math.min(1, ph * 6) * (1 - ph)); });
      leak.forEach((q, i) => { const ph = (at * 1.4 + i / 5) % 1; tf(q, 256 + ph * 130, 128 - ph * 40 + Math.sin(at * 5 + i) * 3, 0, .5 + ph * 1.6); op(q, steamK * .8 * (1 - ph) * Math.min(1, ph * 8)); });
    } else { op(steamW, 0); op(leakG, 0); }
    if (waterY != null) { let d = ''; for (let x = -400; x <= 2000; x += 40) d += (d ? ' L' : 'M') + x + ',' + f2(waterY + 6 * Math.sin(x * .015 + at * 1.8) + 3 * Math.sin(x * .04 - at * 2.6));
      wBody.setAttribute('d', d + ' L2000,1400 L-400,1400 Z'); wTop.setAttribute('d', d); op(water, 1); } else op(water, 0);
  };
  g.setTilt(0); g.setSlide(0); g.anim(0);
  return g;
}
