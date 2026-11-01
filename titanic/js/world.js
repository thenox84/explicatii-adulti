"use strict";
/* =====================================================================
   WORLD — exteriors for the Titanic film
   Titanic, Sea, Sky, Dock, Lifeboat, Tugboat, Carpathia, Rocket, IceFloes
   All built once; per frame only .set(state) / .anim(at) touch attributes.
   Private helpers are prefixed with "wld".
   ===================================================================== */

/* ---------- private helpers ---------- */
const wldTints = { day: null, dusk: ['#5E3A6E', .22], night: ['#0A1230', .6], dawn: ['#C58A9C', .14] };
function wldTint(m) { const t = wldTints[m || 'day']; return t ? (c => mix(c, t[0], t[1])) : (c => c); }
function wldPl(pts, close) {
  let d = ''; for (let i = 0; i < pts.length; i++) d += (i ? ' L' : 'M') + f2(pts[i][0]) + ',' + f2(pts[i][1]);
  return close ? d + ' Z' : d;
}
/* 2D affine matrices [a,b,c,d,e,f] (SVG order) */
const wldMx = {
  mul: (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3],
    A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]],
  rot: (deg, cx = 0, cy = 0) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy]; },
  tr: (x, y) => [1, 0, 0, 1, x, y],
  ap: (M, x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]],
  set: (n, M) => n.setAttribute('transform', 'matrix(' + M.map(v => Math.round(v * 10000) / 10000).join(' ') + ')')
};
/* polygon ∩ horizontal line y=0 → [xmin,xmax] or null */
function wldCut(pts) {
  let a = 1e9, b = -1e9;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    if ((p[1] <= 0 && q[1] >= 0) || (p[1] >= 0 && q[1] <= 0)) {
      const x = p[1] === q[1] ? p[0] : p[0] + (0 - p[1]) * (q[0] - p[0]) / (q[1] - p[1]);
      a = Math.min(a, x); b = Math.max(b, x);
    }
  }
  return a <= b ? [a, b] : null;
}
/* deterministic star field shared by Sky (stars) and Sea (reflections) */
function wldStars(seed, n, x0, w, y0, y1) {
  const a = [];
  for (let i = 0; i < n; i++) {
    const h1 = hash(seed * 13.7 + i * 1.913), h2 = hash(seed * 7.1 + i * 3.77 + 2), h3 = hash(seed * 1.3 + i * 5.31 + 4), h4 = hash(seed * 3.3 + i * 9.17 + 6);
    const b = .12 + .88 * Math.pow(h3, 2.4);
    a.push({ x: x0 + h1 * w, y: y0 + h2 * (y1 - y0), b, r: .5 + b * 1.6 + (h4 > .985 ? .8 : 0),
      c: h4 < .14 ? '#CFE0FF' : h4 > .88 ? '#FFE9C6' : '#FFFFFF', ph: h4 * 40 });
  }
  return a;
}
/* tiny circles merged into one path (for static star dust) */
function wldDots(list) { return list.map(([x, y, r]) => `M${f2(x - r)},${f2(y)}a${f2(r)},${f2(r)} 0 1,0 ${f2(2 * r)},0a${f2(r)},${f2(r)} 0 1,0 ${f2(-2 * r)},0`).join(''); }
/* shaded smoke puff (3 circles) */
function wldPuff(p, c1, c2, c3, r = 13) {
  const g = G(p);
  E('circle', { cx: r * .38, cy: r * .38, r: r, fill: c3 }, g);
  E('circle', { cx: 0, cy: 0, r: r, fill: c1 }, g);
  E('circle', { cx: -r * .38, cy: -r * .45, r: r * .55, fill: c2 }, g);
  return g;
}
/* wavy foam line between x0 and x1 at y≈0 */
function wldFoam(x0, x1, at, amp, ph = 0, yb = 2.5, step = 7) {
  if (!(x1 > x0)) return 'M0,0';
  const n = Math.max(2, Math.ceil((x1 - x0) / step)); let d = '';
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); d += (i ? ' L' : 'M') + f2(x) + ',' + f2(yb + Math.sin(x * .07 + at * 3.1 + ph) * amp * .6 + Math.sin(x * .023 - at * 1.7 + ph) * amp * .4); }
  return d;
}

/* =====================================================================
   1) TITANIC — side view, bow to the right, origin = waterline centre.
   ~1412 px long at s=1. Two halves (bow / stern) for the break-up.
   Titanic(parent, {mood:'day'|'dusk'|'night'|'dawn'})
   .set({x,y,s,tilt,split,sink,lights,smoke,wake,boats,wind}) · .anim(at)
   ===================================================================== */
function Titanic(parent, o = {}) {
  const K = wldTint(o.mood), M = wldMx, mood = o.mood || 'day';
  const XB = -110, KL = 60, NL = 6;
  const S = x => -90 - 26 * Math.pow(Math.max(0, (x + 50) / 750), 2) - 14 * Math.pow(Math.max(0, (-x - 50) / 650), 2);
  const along = (xa, xb, off = 0, step = 16) => { const a = [], n = Math.max(1, Math.ceil((xb - xa) / step)); for (let i = 0; i <= n; i++) { const x = lerp(xa, xb, i / n); a.push([x, S(x) + off]); } return a; };
  const band = (xa, xb, o1, o2) => wldPl(along(xa, xb, o1).concat(along(xa, xb, o2).reverse()), true);
  const line = (xa, xb, off) => wldPl(along(xa, xb, off));
  const FX = [290, 130, -30, -190], FW = 24, FR = -16, FH = 166;
  const fBase = x => S(x) - 41;
  const MF = { x: 520, top: [502, -430] }, MM = { x: -575, top: [-593, -410] };
  const mastX = (m, y) => lerp(m.x, m.top[0], (S(m.x) - y) / (S(m.x) - m.top[1]));
  const CN = [mastX(MF, -292), -292];
  const foamC = mood === 'night' ? '#8E9CC6' : mood === 'dawn' ? '#FFF1EA' : mood === 'dusk' ? '#FFE3D6' : '#FFFFFF';
  const litA = '#FFE3A0', litB = '#FFC45E';

  const root = G(parent);
  const reflG = G(root), wakeG = G(root), smokeG = G(root);
  const clipG = G(root, { 'clip-path': clipRect(-4000, -6000, 8000, 6001) });
  const sternG = G(clipG), bowG = G(clipG);
  const foamG = G(root);
  const LG = [], glowGs = [], warmGs = [], breakGs = [], navGs = [], boats = [], falls = [], EM = [];
  let flagEl = null, f4 = null; const aerials = [];

  function lightSet(P, dark) { const a = []; for (let k = 0; k < NL; k++) { const g = G(P, { fill: dark }); const l = { g, dark, lit: mix(litA, litB, k / (NL - 1)), k }; LG.push(l); a.push(l); } return a; }
  const pickL = (set, i, j) => set[Math.floor(hash(i * 3.31 + j * 17.9) * NL)].g;

  function deckBoat(P, bx, far, idx) {
    const dk = S(bx) - 41, y = dk - (far ? 5 : 2.5);
    const g = G(P);
    const c = far ? K('#CFCAC0') : K('#F7F4ED');
    E('path', { d: `M${bx - 17},${f2(y - 9)} L${bx + 17},${f2(y - 9.6)} Q${bx + 16},${f2(y - 1)} ${bx + 9},${f2(y)} L${bx - 9},${f2(y)} Q${bx - 16},${f2(y - 1)} ${bx - 17},${f2(y - 9)} Z`, fill: c }, g);
    E('rect', { x: bx - 17.5, y: f2(y - 10.8), width: 35, height: 2.4, rx: 1.1, fill: far ? K('#8C7152') : K('#A0703F') }, g);
    if (!far) {
      E('path', { d: `M${bx - 13},${f2(y - 4.5)} H${bx + 13}`, stroke: K('#D6D0C2'), 'stroke-width': 1 }, g);
      E('path', { d: `M${bx - 8},${f2(y - .4)} H${bx + 8}`, stroke: K('#BDB6A6'), 'stroke-width': 1.2 }, g);
    }
    boats.push({ g, idx });
    return g;
  }

  function buildPiece(P, xa, xb, bow) {
    const inR = x => x >= xa && x < xb;
    const cl = (a, b) => [Math.max(a, xa), Math.min(b, xb)];
    /* ---------- rigging & wireless aerial (behind) ---------- */
    const rig = G(P, { stroke: K('#4E4A44'), 'stroke-width': 1.1, fill: 'none', 'stroke-linecap': 'round' });
    const wireY = (x, off) => { const t = (MF.top[0] - x) / (MF.top[0] - MM.top[0]); return lerp(MF.top[1], MM.top[1], t) + 14 * 4 * t * (1 - t) + off; };
    let wd = '', ad = '';
    [2, 7].forEach(off => { const a = bow ? XB : MM.top[0], b = bow ? MF.top[0] : XB; const pts = []; for (let i = 0; i <= 12; i++) { const x = lerp(a, b, i / 12); pts.push([x, wireY(x, off)]); } ad += wldPl(pts) + ' '; });
    if (bow) {
      const m = MF, b = S(m.x), sy = -372, sx = mastX(m, sy);
      wd += `M${m.top[0]},${m.top[1] + 3} L706,-117 `;
      [-27, -14, 13, 25].forEach(d => { wd += `M${f2(sx)},${sy} L${m.x + d},${f2(S(m.x + d))} `; });
      ad += `M338,${f2(wireY(338, 7))} L338,${f2(S(338) - 56)} M346,${f2(wireY(346, 7))} L344,${f2(S(344) - 56)} `;
      wd += `M${f2(mastX(m, -300))},-300 L452,${f2(S(452) - 64)} `;
    } else {
      const m = MM, b = S(m.x), sy = -352, sx = mastX(m, sy);
      wd += `M${m.top[0]},${m.top[1] + 3} L-703,-107 `;
      [-27, -14, 13, 25].forEach(d => { wd += `M${f2(sx)},${sy} L${m.x + d},${f2(S(m.x + d))} `; });
    }
    E('path', { d: wd }, rig);
    aerials.push(E('path', { d: ad, 'stroke-width': .9 }, rig));
    /* ---------- far-side lifeboats (peek above the deck) ---------- */
    const farG = G(P);
    [341, 299, 257, 215, -283, -325, -367, -409].forEach((bx, i) => { if (inR(bx)) deckBoat(farG, bx, true, 8 + i); });
    /* ---------- funnels ---------- */
    const fG = G(P);
    FX.forEach((fx, fi) => {
      if (!inR(fx)) return;
      const b = fBase(fx) + 2, t = b - FH - 2, sh = y => FR * (b - y) / (b - t);
      const g = G(fG);
      if (fi === 3) { f4 = g; f4.base = [fx, b]; }
      E('path', { d: `M${f2(fx + sh(t + 54) - FW)},${f2(t + 54)} L${fx - 70},${f2(b - 2)} M${f2(fx + sh(t + 54) - FW)},${f2(t + 54)} L${fx - 40},${f2(b - 2)} M${f2(fx + sh(t + 54) + FW)},${f2(t + 54)} L${fx + 66},${f2(b - 2)} M${f2(fx + sh(t + 54) + FW)},${f2(t + 54)} L${fx + 38},${f2(b - 2)}`,
        stroke: K('#5E5850'), 'stroke-width': .9, 'stroke-opacity': .85 }, g);
      const quad = (l, r, y0, y1) => `M${f2(fx + l + sh(y0))},${f2(y0)} L${f2(fx + r + sh(y0))},${f2(y0)} L${f2(fx + r + sh(y1))},${f2(y1)} L${f2(fx + l + sh(y1))},${f2(y1)} Z`;
      E('path', { d: quad(-FW, FW, b, t), fill: K('#D49B43') }, g);
      E('path', { d: quad(-FW, -FW + 10, b, t), fill: K('#E7B964') }, g);
      E('path', { d: quad(-FW + 3, -FW + 6, b, t), fill: K('#F2CD82') }, g);
      E('path', { d: quad(FW - 13, FW, b, t), fill: K('#B27C31') }, g);
      E('path', { d: quad(-FW, FW, t + 36, t), fill: K('#1C1C21') }, g);
      E('path', { d: quad(FW - 12, FW, t + 36, t), fill: K('#0F0F13') }, g);
      E('path', { d: quad(-FW + 3, -FW + 7, t + 36, t + 3), fill: K('#3A3A42') }, g);
      E('path', { d: quad(-FW - 1.6, FW + 1.6, t + 4, t - 1.5), fill: K('#26262C') }, g);
      E('path', { d: quad(-FW, FW, t + 38.5, t + 36), fill: K('#8E6A2E') }, g);
      /* steam pipes + whistle on the forward face */
      E('path', { d: `M${f2(fx + FW + 2.4 + sh(b))},${f2(b)} L${f2(fx + FW + 2.4 + sh(t + 16))},${f2(t + 16)} M${f2(fx + FW + 6 + sh(b))},${f2(b)} L${f2(fx + FW + 6 + sh(t + 30))},${f2(t + 30)}`, stroke: K('#C49752'), 'stroke-width': 2.3, fill: 'none' }, g);
      if (fi < 3) E('rect', { x: f2(fx + FW + .5 + sh(t + 44)), y: f2(t + 40), width: 7.5, height: 6, rx: 1.5, fill: K('#D8B060') }, g);
      E('path', { d: quad(-FW - 3, FW + 3, b + 1, b - 6), fill: K('#9A773E') }, g);
      if (fi < 3) EM[fi] = { p: [fx + FR, t - 3], bow: fx > XB };
    });
    /* ---------- masts ---------- */
    const mast = (m) => {
      const b = S(m.x) + 1, g = G(P);
      E('path', { d: `M${m.x - 3.3},${f2(b)} L${m.x + 3.3},${f2(b)} L${m.top[0] + 1.5},${m.top[1]} L${m.top[0] - 1.5},${m.top[1]} Z`, fill: K('#C79D5D') }, g);
      E('path', { d: `M${m.x + 1},${f2(b)} L${m.x + 3.3},${f2(b)} L${m.top[0] + 1.5},${m.top[1]} L${m.top[0] + .4},${m.top[1]} Z`, fill: K('#9E7942') }, g);
      E('rect', { x: m.top[0] - 7, y: m.top[1] + 4, width: 14, height: 2.4, rx: 1, fill: K('#9E7942') }, g);
      E('circle', { cx: m.top[0], cy: m.top[1] - 1.5, r: 2.6, fill: K('#E0BE80') }, g);
      return g;
    };
    if (bow) {
      mast(MF);
      const cn = G(P); tf(cn, CN[0], CN[1]);
      E('path', { d: 'M-8.5,-7 L8.5,-7 L7,7 L-7,7 Z', fill: K('#C9A062') }, cn);
      E('path', { d: 'M2,-7 L8.5,-7 L7,7 L3,7 Z', fill: K('#A68048') }, cn);
      E('rect', { x: -9.5, y: -9, width: 19, height: 3, rx: 1.2, fill: K('#7D5D36') }, cn);
      E('path', { d: 'M-6,1 H6', stroke: K('#8E6B3E'), 'stroke-width': 1 }, cn);
      E('path', { d: 'M11,-6 Q11,-9 13.5,-9 Q16,-9 16,-6 L16.6,-3 L10.4,-3 Z', fill: K('#D9B04A') }, cn);   // lookout bell
      E('path', { d: 'M8.5,-7 L13.5,-9', stroke: K('#7D5D36'), 'stroke-width': .8 }, cn);
    } else mast(MM);
    /* ---------- white superstructure ---------- */
    const sup = G(P);
    let [a0, a1] = cl(-575, 455);
    if (a1 > a0) {
      E('path', { d: band(a0, a1, 1, -21), fill: K('#ECE8DD') }, sup);
      E('path', { d: band(a0, a1, -1, -3), fill: K('#B9B2A3') }, sup);
    }
    [a0, a1] = cl(-525, 432);
    if (a1 > a0) {
      E('path', { d: band(a0, a1, -20, -41.5), fill: K('#F5F2EA') }, sup);
      E('path', { d: band(a0, a1, -19, -22), fill: K('#C9C2B3') }, sup);
    }
    if (bow) {
      E('path', { d: band(451, 455, 1, -21), fill: K('#FFFFFF') }, sup);
      E('path', { d: band(428.5, 432, -20, -41.5), fill: K('#FFFFFF') }, sup);
      E('path', { d: band(441, 452, -54, -57), fill: K('#E3DDCE') }, sup);
    } else {
      E('path', { d: `M-575,${f2(S(-575) + 1)} L-575,${f2(S(-575) - 21)} L-560,${f2(S(-560) - 21)} L-560,${f2(S(-560) + 1)} Z`, fill: K('#D8D2C4') }, sup);
    }
    /* deck houses on the boat deck */
    const houses = [[330, 441, 15], [205, 252, 10], [40, 100, 11], [-96, -58, 9], [-272, -230, 10], [-420, -300, 10], [-507, -455, 8]];
    houses.forEach(([h0, h1, hh]) => {
      if (!inR(h0)) return;
      E('path', { d: band(h0, h1, -40, -41 - hh), fill: K('#E9E4D7') }, sup);
      E('path', { d: band(h0, h1, -39 - hh, -42 - hh), fill: K('#FFFFFF') }, sup);
      E('path', { d: band(h1 - 6, h1, -40, -41 - hh), fill: K('#D6D0C1') }, sup);
    });
    if (bow) {
      E('path', { d: band(404, 441, -55, -64), fill: K('#E3DDCE') }, sup);
      E('path', { d: band(402, 444, -63, -66), fill: K('#F7F5EF') }, sup);
      E('path', { d: band(400, 404, -41, -55), fill: K('#CFC8B8') }, sup);
      E('ellipse', { cx: 228, cy: f2(S(228) - 51), rx: 13, ry: 6.5, fill: K('#B9C7CB') }, sup);
      E('ellipse', { cx: 224, cy: f2(S(224) - 53), rx: 6, ry: 2.6, fill: K('#E4EEF0') }, sup);
      E('ellipse', { cx: -77, cy: f2(S(-77) - 50), rx: 10, ry: 5, fill: K('#B9C7CB') }, sup);
    }
    /* rails along the boat deck (one path of stanchions) */
    [a0, a1] = cl(-525, 432);
    if (a1 > a0) {
      let rd = line(a0, a1, -47) + ' ';
      for (let x = Math.ceil(a0 / 7) * 7; x < a1; x += 7) rd += `M${x},${f2(S(x) - 41.5)} v-5.5 `;
      E('path', { d: rd, stroke: K('#E7E2D6'), 'stroke-width': .8, fill: 'none' }, sup);
      E('path', { d: line(a0, a1, -41.5), stroke: K('#FFFFFF'), 'stroke-width': 1.5, fill: 'none' }, sup);
    }
    /* cowl ventilators */
    [362, 266, 196, 160, 112, 18, -64, -150, -236, -296, -384, -444].forEach(vx => {
      if (!inR(vx)) return; const b = S(vx) - 41;
      E('path', { d: `M${vx - 2},${f2(b)} L${vx - 2},${f2(b - 7)} Q${vx - 2},${f2(b - 13)} ${vx + 4},${f2(b - 13)} L${vx + 6},${f2(b - 7.5)} Q${vx + 2.6},${f2(b - 8)} ${vx + 2},${f2(b - 6)} L${vx + 2},${f2(b)} Z`, fill: K('#E6E1D4') }, sup);
      E('path', { d: `M${vx + 4},${f2(b - 13)} L${vx + 6},${f2(b - 7.5)} L${vx + 4.4},${f2(b - 8.6)} Z`, fill: K('#2B2B30') }, sup);
    });
    /* windows (B deck) and promenade openings (A deck) */
    const wl = lightSet(sup, K('#596072'));
    [a0, a1] = cl(-565, 446);
    for (let x = -565, i = 0; x < 446; x += 9.6, i++) { if (!inR(x) || hash(i * 2.17 + 3) < .2) continue; E('rect', { x: f2(x), y: f2(S(x) - 14), width: 4.6, height: 6, rx: .8 }, pickL(wl, i, 1)); }
    for (let x = -514, i = 0; x < 424; x += 12.6, i++) { if (!inR(x)) continue; E('rect', { x: f2(x), y: f2(S(x) - 37), width: 8.4, height: 10.5, rx: 1 }, pickL(wl, i, 2)); }
    houses.forEach(([h0, h1, hh], j) => { if (!inR(h0)) return; for (let x = h0 + 5, i = 0; x < h1 - 8; x += 9, i++) E('rect', { x: f2(x), y: f2(S(x) - 41 - hh * .72), width: 4.2, height: f2(hh * .42), rx: .6 }, pickL(wl, i, 5 + j)); });
    if (bow) for (let x = 406, i = 0; x < 438; x += 6, i++) E('rect', { x, y: f2(S(x) - 62), width: 3.6, height: 4.2 }, pickL(wl, i, 9));
    /* warm light spill on the superstructure (night) */
    const warm = G(P, { fill: '#FFB45C', opacity: 0 }); warmGs.push(warm);
    [a0, a1] = cl(-565, 450); if (a1 > a0) E('path', { d: band(a0, a1, -2, -41), 'fill-opacity': .16 }, warm);
    /* well-deck cranes, rails, docking bridge */
    const det = G(P, { stroke: K('#DCD6C8'), fill: 'none', 'stroke-linecap': 'round' });
    const crane = cx => { const b = S(cx); E('path', { d: `M${cx},${f2(b)} V${f2(b - 15)} M${cx},${f2(b - 13)} L${cx + 15},${f2(b - 25)}`, 'stroke-width': 2.2 }, det); E('rect', { x: cx - 4, y: f2(b - 18), width: 8, height: 6, rx: 1.4, fill: K('#E4DED1'), stroke: 'none' }, P); };
    [478, 566, -598].forEach(cx => { if (inR(cx)) crane(cx); });
    let rd2 = '';
    const rails = (r0, r1) => { rd2 += line(r0, r1, -6) + ' '; for (let x = r0; x <= r1; x += 7) rd2 += `M${x},${f2(S(x))} v-6 `; };
    if (bow) rails(590, 702); else rails(-700, -612);
    E('path', { d: rd2, 'stroke-width': .8 }, det);
    if (!bow) { const y = S(-667) - 15; E('path', { d: `M-692,${f2(y)} H-640 M-688,${f2(y)} V${f2(S(-688))} M-645,${f2(y)} V${f2(S(-645))}`, 'stroke-width': 2 }, det); }
    /* ---------- hull ---------- */
    const hd = bow
      ? wldPl(along(XB - 1, 700)) + ' L706,-117 L701,8 Q697,52 660,60 L' + (XB - 1) + ',60 Z'
      : 'M' + (XB + 1) + ',60 L' + wldPl(along(-694, XB + 1).reverse()).slice(1) + ' Q-716,-102 -713,-78 Q-709,-38 -688,-12 L-664,-8 L-656,-7 L-652,26 Q-644,58 -600,60 Z';
    if (!bow) {
      E('path', { d: 'M-657,-9 L-680,-11 Q-687,14 -683,52 L-658,55 Z', fill: K('#8C2528') }, P);
      E('path', { d: 'M-657,-9 L-680,-11 L-681.5,-5 L-657,-5 Z', fill: K('#1E2029') }, P);
    }
    const cid = uid('hc'); const cp = E('clipPath', { id: cid }, DEFS); E('path', { d: hd }, cp);
    const hull = G(P);
    E('path', { d: hd, fill: K('#1E2029') }, hull);
    const hc = G(hull, { 'clip-path': 'url(#' + cid + ')' });
    const X0 = xa - 40, W = xb - xa + 80;
    E('path', { d: band(xa - 20, xb + 20, -6, 14), fill: K('#2F323D') }, hc);
    E('path', { d: band(xa - 20, xb + 20, -6, 3), fill: K('#3A3E4B') }, hc);
    E('rect', { x: X0, y: -27, width: W, height: 22, fill: '#000', 'fill-opacity': .22 }, hc);
    E('rect', { x: X0, y: -5, width: W, height: 90, fill: K('#A3302C') }, hc);
    E('rect', { x: X0, y: 14, width: W, height: 80, fill: K('#8C2729') }, hc);
    E('rect', { x: X0, y: 38, width: W, height: 50, fill: K('#721F25') }, hc);
    E('rect', { x: X0, y: -5, width: W, height: 1.8, fill: K('#D0533F') }, hc);
    let sd = ''; for (let x = Math.ceil(xa / 44) * 44; x < xb; x += 44) sd += `M${x},${f2(S(x) + 2)} V-6 `;
    E('path', { d: sd, stroke: '#000', 'stroke-opacity': .18, 'stroke-width': 1 }, hc);
    E('path', { d: line(xa, xb, 40) + ' ' + line(xa, xb, 64), stroke: '#000', 'stroke-opacity': .14, 'stroke-width': 1, fill: 'none' }, hc);
    if (bow) {
      E('rect', { x: 600, y: -130, width: 110, height: 126, fill: lgrad([[0, '#FFFFFF', 0], [.75, '#FFFFFF', .08], [1, '#FFFFFF', 0]], 0, 0, 1, 0) }, hc);
    } else {
      E('ellipse', { cx: -690, cy: -16, rx: 34, ry: 8, fill: '#000', 'fill-opacity': .35 }, hc);
      E('rect', { x: -730, y: -130, width: 70, height: 126, fill: lgrad([[0, '#FFFFFF', .06], [1, '#FFFFFF', 0]], 0, 0, 1, 0) }, hc);
    }
    E('path', { d: line(Math.max(xa, -700), Math.min(xb, 702), 2.6), stroke: K('#D6B458'), 'stroke-width': 2.2, fill: 'none' }, hull);
    if (!bow) {
      E('path', { d: 'M-602,35 L-560,40 L-560,46 L-602,42 Z', fill: K('#3A2A28') }, hull);
      const prop = (px, py, r, rt) => { const pr = G(hull); tf(pr, px, py, rt);
        E('ellipse', { cx: 0, cy: -r * .62, rx: r * .3, ry: r * .62, fill: K('#D2A65C') }, pr); E('ellipse', { cx: 0, cy: r * .62, rx: r * .3, ry: r * .62, fill: K('#A97F3E') }, pr);
        E('ellipse', { cx: r * .2, cy: 0, rx: r * .5, ry: r * .22, fill: K('#BC9149') }, pr); E('circle', { r: r * .26, fill: K('#7A5A2C') }, pr); };
      prop(-648, 26, 21, 6); prop(-604, 38, 25, 10);
    }
    /* portholes */
    const hl = lightSet(hull, K('#3B3F4C'));
    const rows = [[18, -662, 680, [552, 672]], [33, -650, 640, [560, 656]], [48, -610, 610, null], [63, -470, 470, null]];
    rows.forEach(([off, r0, r1, skip], ri) => {
      for (let x = r0, i = 0; x <= r1; x += 11.5, i++) {
        if (!inR(x) || (skip && x > skip[0] && x < skip[1]) || hash(i * 7.13 + ri * 31.7) < .16) continue;
        E('circle', { cx: f2(x), cy: f2(S(x) + off), r: 2.3 }, pickL(hl, i, ri));
      }
    });
    /* night glow strips */
    const glow = G(P, { fill: 'none', stroke: '#FFC864', 'stroke-linecap': 'round', opacity: 0 }); glowGs.push(glow);
    rows.forEach(([off, r0, r1]) => { const [g0, g1] = cl(r0, r1); if (g1 > g0) { const d = line(g0, g1, off); E('path', { d, 'stroke-width': 9, 'stroke-opacity': .13 }, glow); E('path', { d, 'stroke-width': 3.4, 'stroke-opacity': .2 }, glow); } });
    [[-11, -565, 446], [-32, -514, 424]].forEach(([off, r0, r1]) => { const [g0, g1] = cl(r0, r1); if (g1 > g0) E('path', { d: line(g0, g1, off), 'stroke-width': 12, 'stroke-opacity': .12 }, glow); });
    /* name, anchor */
    if (bow) {
      TX(P, 610, f2(S(610) + 25), 'TITANIC', 12.5, K('#EBD38D'), { a: 'middle', w: 800, ls: 2.6 });
      const an = G(P); tf(an, 673, -73);
      E('circle', { cx: 0, cy: -9, r: 5, fill: '#0E0F14' }, an);
      E('path', { d: 'M-1.7,-9 L1.7,-9 L1.4,8 L-1.4,8 Z M-7.5,3 Q0,13 7.5,3 L5.4,2 Q0,8 -5.4,2 Z', fill: K('#565A66') }, an);
    } else {
      TX(P, -650, -86, 'TITANIC', 7.5, K('#EBD38D'), { a: 'middle', w: 800, ls: 1.2 });
      TX(P, -650, -77, 'LIVERPOOL', 5.5, K('#C9B477'), { a: 'middle', w: 700, ls: 1 });
    }
    /* ---------- near-side lifeboats + davits ---------- */
    const nearG = G(P);
    [362, 320, 278, 236, -262, -304, -346, -388].forEach((bx, i) => {
      if (!inR(bx)) return;
      const dk = S(bx) - 41, y = dk - 2.5;
      E('path', { d: `M${bx - 16},${f2(dk)} L${bx - 16},${f2(y - 15)} Q${bx - 16},${f2(y - 20)} ${bx - 11.5},${f2(y - 19)} M${bx + 16},${f2(dk)} L${bx + 16},${f2(y - 15)} Q${bx + 16},${f2(y - 20)} ${bx + 11.5},${f2(y - 19)}`, stroke: K('#D9D4C8'), 'stroke-width': 1.3, fill: 'none', 'stroke-linecap': 'round' }, nearG);
      const fl = E('path', { d: `M${bx - 11.5},${f2(y - 19)} q-1,14 1,26 M${bx + 11.5},${f2(y - 19)} q1,14 -1,26`, stroke: K('#C9B48E'), 'stroke-width': .8, fill: 'none' }, nearG);
      falls.push({ el: fl, idx: i });
      deckBoat(nearG, bx, false, i);
    });
    /* navigation lights */
    const nav = G(P, { opacity: 0 }); navGs.push(nav);
    const lamp = (x, y, c) => { E('circle', { cx: f2(x), cy: f2(y), r: 9, fill: c, 'fill-opacity': .28 }, nav); E('circle', { cx: f2(x), cy: f2(y), r: 2.6, fill: c }, nav); };
    if (bow) { lamp(mastX(MF, -340) + 4, -340, '#FFF4D6'); lamp(442, S(442) - 53, '#FF4A4A'); }
    else lamp(-702, -110, '#FFF4D6');
    /* break edge (visible when split) */
    const bk = G(P, { opacity: 0 }); breakGs.push(bk);
    const dir = bow ? 1 : -1, jag = [];
    for (let y = -138, i = 0; y <= 64; y += 12, i++) jag.push([XB + dir * (3 + hash(i * 1.7 + (bow ? 3 : 9)) * 17), y]);
    E('path', { d: wldPl([[XB - dir * 2, -140]].concat(jag, [[XB - dir * 2, 64]]), true), fill: '#140D0B' }, bk);
    let dl = ''; [-41, -21, 0, 20, 40].forEach(off => { const y = S(XB) + off; dl += `M${XB - dir * 2},${f2(y)} h${dir * 12} `; });
    E('path', { d: dl, stroke: '#6A4636', 'stroke-width': 1.6 }, bk);
    E('path', { d: wldPl(jag), stroke: '#8A7A70', 'stroke-width': 1.2, fill: 'none' }, bk);
    /* pennant (mainmast) */
    if (!bow) { const fg = G(P); tf(fg, MM.top[0], MM.top[1] + 2); flagEl = E('path', { fill: K('#D83A3A') }, fg); }
  }
  buildPiece(sternG, -760, XB, false);
  buildPiece(bowG, XB, 760, true);

  /* ---------- smoke (root frame) ---------- */
  const NP = 13, puffs = [];
  for (let f = 0; f < 3; f++) for (let i = 0; i < NP; i++) puffs.push({ g: wldPuff(smokeG, K('#4D4844'), K('#706963'), K('#38332F'), 14), f, i });
  /* ---------- wake ---------- */
  const bowW = G(wakeG), sternW = G(wakeG);
  const bwIn = G(bowW);
  E('path', { d: 'M-210,4 Q-130,3 -64,-3 Q-26,-8 -9,-20 Q0,-28 8,-22 Q15,-15 30,-8 Q52,-1 80,3 Q40,7 -40,7 Q-130,7 -210,6 Z', fill: foamC, 'fill-opacity': .9 }, bwIn);
  E('path', { d: 'M-160,5 Q-90,4 -44,-1 Q-16,-5 -6,-14 Q0,-19 4,-15 Q10,-9 24,-4 Q-20,3 -160,6 Z', fill: mix(foamC, '#6FA8CC', .4), 'fill-opacity': .55 }, bwIn);
  E('path', { d: 'M46,6 Q80,9 120,6 M-60,9 Q-130,11 -220,9', stroke: foamC, 'stroke-width': 2, 'stroke-opacity': .5, fill: 'none', 'stroke-linecap': 'round' }, bwIn);
  const spray = []; for (let i = 0; i < 10; i++) spray.push(E('circle', { r: 2 + hash(i * 3.3) * 2.2, fill: foamC }, bowW));
  const trail = [];
  E('path', { d: 'M8,1 C-150,2 -420,5 -900,9 L-900,24 C-420,17 -150,9 8,6 Z', fill: lgrad([[0, foamC, 0], [.7, foamC, .14], [1, foamC, .38]], 0, 0, 1, 0) }, sternW);
  const trGrad = lgrad([[0, foamC, 0], [.6, foamC, .45], [1, foamC, .85]], 0, 0, 1, 0);
  [[2, 3, '46 20 80 28 24 36'], [6, 2.4, '30 24 56 18 74 40'], [11, 2, '64 28 22 34 38 24'], [16, 1.5, '20 36 46 28']].forEach(([y, wdt, da], i) => {
    trail.push(E('path', { d: `M4,${y * .3} C-200,${f2(y * .6)} -480,${y} -860,${f2(y * 1.3)}`, stroke: trGrad, 'stroke-width': wdt, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': da }, sternW));
  });
  const churnS = []; for (let i = 0; i < 8; i++) churnS.push(E('ellipse', { rx: 10, ry: 3.5, fill: foamC, 'fill-opacity': .55 }, sternW));
  /* ---------- waterline foam, churn, light reflections ---------- */
  const foamA = [0, 1].map(() => E('path', { fill: 'none', stroke: foamC, 'stroke-linecap': 'round', 'stroke-opacity': .7 }, foamG));
  const foamB = [0, 1].map(() => E('path', { fill: 'none', stroke: foamC, 'stroke-linecap': 'round', 'stroke-opacity': .22, 'stroke-width': 7 }, foamG));
  const bub = []; for (let i = 0; i < 22; i++) bub.push(E('circle', { r: 3, fill: foamC }, foamG));
  const refl = []; for (let j = 0; j < 44; j++) refl.push({ el: E('line', { stroke: j % 3 ? '#FFC864' : '#FFE3A0', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, reflG), u: hash(j * 3.71 + 1), d: hash(j * 5.13 + 2), w: hash(j * 7.7 + 3) });

  /* ---------- state + pose ---------- */
  const st = { x: 0, y: 0, s: 1, tilt: 0, split: 0, sink: 0, lights: mood === 'night' ? 1 : 0, smoke: 1, wake: 0, boats: 16, wind: 1 };
  let MB = [1, 0, 0, 1, 0, 0], MS = MB.slice(), cuts = [null, null], sp = 0, wakeEff = 0, churn = 0, T = 0;
  const KEYS = [[MF.top[0], MF.top[1] - 4], [MM.top[0], MM.top[1] - 4], [-716, -104], [-689, 54], [-600, 60], [706, -117], [660, 60], [XB, -132], [XB, 60]].concat(FX.map(fx => [fx + FR, fBase(fx) - FH - 4]));
  const polyB = [[XB, -132], [432, S(432) - 41], [456, S(456) - 21], [706, -117], [701, 8], [660, 60], [XB, 60]];
  const polyS = [[-704, -104], [-575, S(-575) - 21], [-525, S(-525) - 41], [XB, S(XB) - 41], [XB, 60], [-600, 60], [-652, 26], [-656, -7], [-688, -12], [-713, -78]];
  const sh = { g: root, root, bowG, sternG, XB };
  sh.set = function (u) {
    if (u) Object.assign(st, u);
    tf(root, st.x, st.y, 0, st.s);
    sp = ease(clamp(st.split));
    const base = M.rot(st.tilt, -60, 0);
    let mb = M.mul(base, M.mul(M.tr(58 * sp, 84 * sp), M.rot(30 * sp, XB, KL)));
    let ms = M.mul(base, M.mul(M.tr(-30 * sp, 18 * sp), M.rot(sp * Math.max(0, 78 - st.tilt), XB, KL)));
    let minY = 0;
    KEYS.forEach(([x, y]) => { const p = M.ap(x >= XB ? mb : ms, x, y); if (p[1] < minY) minY = p[1]; });
    const dy = clamp(st.sink) * (-minY + 40);
    MB = M.mul(M.tr(0, dy), mb); MS = M.mul(M.tr(0, dy), ms);
    M.set(bowG, MB); M.set(sternG, MS);
    cuts = [wldCut(polyB.map(p => M.ap(MB, p[0], p[1]))), wldCut(polyS.map(p => M.ap(MS, p[0], p[1])))];
    wakeEff = clamp(st.wake) * (1 - clamp(Math.abs(st.tilt) / 3)) * (1 - sp) * (1 - clamp(st.sink * 4));
    churn = clamp(Math.max(st.tilt / 5, sp * 1.5, st.sink * 4)) * (1 - clamp((st.sink - .92) * 12));
    const nb = Math.round(clamp(st.boats, 0, 16));
    boats.forEach(b => op(b.g, b.idx >= 16 - nb ? 1 : 0));
    falls.forEach(f => op(f.el, f.idx >= 16 - nb ? 0 : 1));
    breakGs.forEach(b => op(b, clamp(sp * 6)));
    aerials.forEach(a => op(a, 1 - clamp(sp * 5)));
    if (f4) { const k = clamp(sp / .55); f4.setAttribute('transform', k > 0 ? `translate(${f2(k * 26)},${f2(k * k * 40)}) rotate(${f2(easeIn(k) * 75)} ${f4.base[0]} ${f4.base[1]})` : ''); op(f4, 1 - clamp((sp - .25) / .3)); }
    sh.anim(T);
  };
  sh.anim = function (at) {
    T = at;
    /* smoke */
    const sm = clamp(st.smoke), em = EM.map(e => e ? M.ap(e.bow ? MB : MS, e.p[0], e.p[1]) : null);
    puffs.forEach(p => {
      const e = em[p.f];
      if (!e || sm <= 0 || e[1] > -6) { op(p.g, 0); return; }
      const ph = (at * .26 + p.i / NP + p.f * .137) % 1;
      const dx = -ph * 270 * st.wind + Math.sin(at * 1.1 + p.i * 2.3 + p.f) * 8 * ph, dy = -Math.pow(ph, .62) * (130 + hash(p.i * 1.3 + p.f * 9) * 50) + ph * ph * 30;
      tf(p.g, e[0] + dx, e[1] + dy, ph * 50 + p.i * 30, .34 + ph * 1.9);
      op(p.g, sm * Math.min(1, ph * 9) * Math.pow(1 - ph, 1.4) * .9);
    });
    /* lights with flicker */
    const L = clamp(st.lights);
    LG.forEach((l, j) => {
      let v = L;
      if (L > 0 && L < .97) { const n = hash(Math.floor(at * 8 + j * .37) * 1.37 + j * 7.7); v = n < (1 - L) * .75 ? v * .12 : v * (.8 + .2 * Math.sin(at * 23 + j)); }
      l.g.setAttribute('fill', mix(l.dark, l.lit, v));
    });
    const fl = L < .97 && L > 0 ? (hash(Math.floor(at * 8) * 2.9) < (1 - L) * .7 ? .2 : 1) : 1;
    glowGs.forEach(g => op(g, L * fl)); warmGs.forEach(g => op(g, L * fl)); navGs.forEach(g => op(g, L));
    /* pennant */
    if (flagEl) { const top = [], bot = []; for (let i = 0; i <= 8; i++) { const u2 = i / 8, w2 = Math.sin(at * 6 - u2 * 5) * 3.2 * u2 * st.wind + u2 * 2; top.push([-u2 * 54 * Math.min(1, .35 + st.wind), -5 * (1 - u2) + w2]); bot.unshift([-u2 * 54 * Math.min(1, .35 + st.wind), 5 * (1 - u2) + w2]); } flagEl.setAttribute('d', wldPl(top.concat(bot), true)); }
    /* waterline foam */
    const amp = 1.3 + wakeEff * 1.2 + churn * 2.5;
    [0, 1].forEach(k => {
      const c = cuts[k];
      if (!c) { op(foamA[k], 0); op(foamB[k], 0); return; }
      op(foamA[k], 1); op(foamB[k], 1);
      const d = wldFoam(c[0] - 3, c[1] + 3, at, amp, k * 2, 2.6 + amp * .3);
      foamA[k].setAttribute('d', d); foamA[k].setAttribute('stroke-width', f2(2 + wakeEff * 1.2 + churn * 2));
      foamB[k].setAttribute('d', d); foamB[k].setAttribute('transform', 'translate(0,3)');
    });
    /* churn bubbles where the ship meets the sea while sinking */
    bub.forEach((b, i) => {
      const c = cuts[i % 2] || cuts[(i + 1) % 2];
      if (!c || churn <= 0) { op(b, 0); return; }
      const u2 = hash(i * 4.1), x = lerp(c[0], c[1], u2 < .5 ? u2 * .3 : 1 - (1 - u2) * .3) + Math.sin(at * 2 + i) * 10;
      const q = (at * .9 + hash(i * 2.2)) % 1;
      b.setAttribute('cx', f2(x)); b.setAttribute('cy', f2(-2 - q * 9)); b.setAttribute('r', f2(2 + q * 6));
      op(b, churn * (1 - q) * .8);
    });
    /* bow wave + stern trail */
    const cb = cuts[0], cs = cuts[1];
    if (wakeEff > .01 && cb) { op(bowW, wakeEff); tf(bowW, cb[1] - 4, 0); tf(bwIn, 0, 0, 0, .7 + .3 * wakeEff, (.75 + .25 * wakeEff) * (1 + .1 * Math.sin(at * 2.3)));
      spray.forEach((s2, i) => { const q = (at * 1.3 + i / 10) % 1; s2.setAttribute('cx', f2(-6 - q * (40 + 50 * hash(i)))); s2.setAttribute('cy', f2(-10 - Math.sin(Math.PI * q) * (14 + 16 * hash(i * 2)) + q * 8)); op(s2, (1 - q) * .9); });
    } else op(bowW, 0);
    if (wakeEff > .01 && cs) { op(sternW, wakeEff); tf(sternW, cs[0] + 6, 0, 0, .4 + .6 * wakeEff, 1);
      trail.forEach((p, i) => p.setAttribute('stroke-dashoffset', f2(at * (120 + i * 25))));
      churnS.forEach((c, i) => { const q = (at * 1.5 + i / 8) % 1; c.setAttribute('cx', f2(-6 - q * 110)); c.setAttribute('cy', f2(2 + (i % 3) * 2.5 + q * 3)); c.setAttribute('rx', f2(7 + q * 26)); c.setAttribute('ry', f2(2.5 + q * 2.5)); op(c, Math.sin(Math.PI * Math.min(1, q * 1.4)) * .7); });
    } else op(sternW, 0);
    /* light reflections on the water */
    const ux0 = Math.min(cb ? cb[0] : 1e9, cs ? cs[0] : 1e9), ux1 = Math.max(cb ? cb[1] : -1e9, cs ? cs[1] : -1e9);
    const rv = L * fl * (1 - clamp(st.sink * 2.5));
    refl.forEach((r, j) => {
      if (rv <= .01 || ux1 <= ux0) { op(r.el, 0); return; }
      const x = lerp(ux0 + 20, ux1 - 20, r.u), y = 5 + Math.pow(r.d, 1.3) * 62, wdt = (6 + 22 * r.w) * (1 - r.d * .5);
      const xx = x + Math.sin(at * 1.7 + j) * 4;
      r.el.setAttribute('x1', f2(xx - wdt / 2)); r.el.setAttribute('x2', f2(xx + wdt / 2)); r.el.setAttribute('y1', f2(y)); r.el.setAttribute('y2', f2(y));
      op(r.el, rv * (.28 + .62 * Math.max(0, Math.sin(at * 2.6 + j * 1.7))) * (1 - r.d * .55));
    });
  };
  /* ---------- anchors ---------- */
  const LOC = { crowsNest: CN, bridge: [424, S(424) - 60], bow: [706, -117], stern: [-712, -92], wireless: [338, S(338) - 50],
    boatDeck: [0, S(0) - 41], breakTop: [XB, S(XB) - 41], foremast: MF.top, mainmast: MM.top, keelBreak: [XB, KL] };
  sh.L = LOC; sh.S = S;
  sh.pt = (x, y) => { const p = M.ap(x >= XB ? MB : MS, x, y); return [st.x + p[0] * st.s, st.y + p[1] * st.s]; };
  sh.crowsNest = () => sh.pt(CN[0], CN[1]);
  sh.bridge = () => sh.pt(LOC.bridge[0], LOC.bridge[1]);
  sh.bow = () => sh.pt(706, -117);
  sh.stern = () => sh.pt(-712, -92);
  sh.wireless = () => sh.pt(LOC.wireless[0], LOC.wireless[1]);
  sh.funnelTop = i => sh.pt(FX[i] + FR, fBase(FX[i]) - FH);
  sh.boatAt = i => { const bx = [362, 320, 278, 236, -262, -304, -346, -388][i % 8]; return sh.pt(bx, S(bx) - 52); };
  sh.angle = part => { const m = part === 'stern' ? MS : MB; return Math.atan2(m[1], m[0]) * 180 / Math.PI; };
  sh.scale = () => st.s;
  sh.state = st;
  sh.set({ s: o.s || 1 });
  return sh;
}

/* =====================================================================
   2) SEA — layered animated ocean from o.y (horizon) down to o.y1.
   Sea(parent, {y:520, x0:-400, w:2400, y1:1250, mood:'day'|'dusk'|'night'|'dawn',
                calm:false, rows:10, sunX:null (glitter column), stars:true})
   .anim(at) · .setMood(mood)
   ===================================================================== */
const wldSeaPal = {
  day: { hz: '#A6D9E8', mid: '#4C97C2', deep: '#184C7A', hi: '#E6F7FF', foam: '#FFFFFF', glint: '#FFF8DC' },
  dusk: { hz: '#E6A388', mid: '#76598C', deep: '#29295A', hi: '#FFD3B6', foam: '#FFE9DE', glint: '#FFD08A' },
  night: { hz: '#18213F', mid: '#0D1430', deep: '#04070F', hi: '#34467A', foam: '#7F8DB8', glint: '#C9D4FF' },
  dawn: { hz: '#F2C2A8', mid: '#8A8FB9', deep: '#33467C', hi: '#FFE8D2', foam: '#FFF3EC', glint: '#FFE2A6' }
};
function Sea(parent, o = {}) {
  const y0 = o.y != null ? o.y : 520, x0 = o.x0 != null ? o.x0 : -400, w = o.w || 2400, y1 = o.y1 || 1250;
  const calm = !!o.calm, R = o.rows || 12;
  let mood = o.mood || 'day';
  const g = G(parent);
  const gid = uid('seag'); const lg = E('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, DEFS);
  const stops = [0, .16, 1].map(of => E('stop', { offset: of }, lg));
  E('rect', { x: x0, y: y0, width: w, height: y1 - y0, fill: 'url(#' + gid + ')' }, g);
  const haze = E('rect', { x: x0, y: y0 - 1, width: w, height: 5 }, g);
  /* far shimmer band right under the horizon */
  const hzLines = G(g); let hd0 = '';
  for (let i = 0; i < 70; i++) { const x = x0 + hash(i * 1.9 + 4) * w, y = y0 + 3 + Math.pow(hash(i * 2.7), 2) * 26; hd0 += `M${f2(x)},${f2(y)} h${f2(8 + hash(i * 3.3) * 40)} `; }
  const hzPath = E('path', { d: hd0, 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none' }, hzLines);
  const rows = [];
  for (let i = 0; i < R; i++) {
    const t = (i + 1) / (R + 1), yi = y0 + 4 + (y1 - y0) * Math.pow(t, 1.8) * .92;
    const yn = y0 + 4 + (y1 - y0) * Math.pow((i + 2) / (R + 1), 1.8) * .92;
    const Pw = lerp(70, 400, Math.pow(t, 1.1)), a = calm ? lerp(.25, 2.2, t) : lerp(1.6, 18, Math.pow(t, 1.2));
    const rg = G(g), n = Math.ceil(w / Pw) + 2;
    const gid2 = uid('swg'), lg2 = E('linearGradient', { id: gid2, gradientUnits: 'userSpaceOnUse', x1: 0, y1: f2(yi - a), x2: 0, y2: f2(yn + 4) }, DEFS);
    const gst = [0, .45, 1].map(of => E('stop', { offset: of }, lg2));
    let d = `M${f2(x0 - Pw)},${y1 + 10} L${f2(x0 - Pw)},${f2(yi)}`;
    for (let k = 0; k <= n; k++) { const xk = x0 - Pw + k * Pw; d += ` C${f2(xk + Pw * .3)},${f2(yi)} ${f2(xk + Pw * .36)},${f2(yi - a)} ${f2(xk + Pw * .5)},${f2(yi - a)} C${f2(xk + Pw * .64)},${f2(yi - a)} ${f2(xk + Pw * .7)},${f2(yi)} ${f2(xk + Pw)},${f2(yi)}`; }
    d += ` L${f2(x0 - Pw + (n + 1) * Pw)},${y1 + 10} Z`;
    const body = E('path', { d, fill: 'url(#' + gid2 + ')' }, rg);
    let hd = '';
    for (let k = 0; k <= n; k++) {
      const xk = x0 - Pw + k * Pw;
      if (calm) { const s0 = hash(k * 3.1 + i * 7.3), s1 = hash(k * 5.7 + i * 2.1); hd += `M${f2(xk + Pw * s0 * .5)},${f2(yi - a * .3)} h${f2(Pw * (.15 + s1 * .45))} `; }
      else hd += `M${f2(xk + Pw * .37)},${f2(yi - a * .78)} C${f2(xk + Pw * .43)},${f2(yi - a * 1.02)} ${f2(xk + Pw * .57)},${f2(yi - a * 1.02)} ${f2(xk + Pw * .63)},${f2(yi - a * .78)} `;
    }
    const hi = E('path', { d: hd, fill: 'none', 'stroke-width': f2(calm ? lerp(.6, 1.5, t) : lerp(1, 3.6, t)), 'stroke-linecap': 'round' }, rg);
    const caps = [];
    if (!calm && t > .28) for (let k = 0; k <= n; k++) {
      if (hash(k * 1.7 + i * 9.1) < .42) continue;
      const xc = x0 - Pw + k * Pw + Pw * (.44 + hash(k + i) * .1), cs = a * .6;
      const c = E('path', { d: `M${f2(xc - cs * 1.5)},${f2(yi - a * .66)} Q${f2(xc - cs * .2)},${f2(yi - a * 1.32)} ${f2(xc + cs * 1.9)},${f2(yi - a * .6)} Q${f2(xc + cs * .4)},${f2(yi - a * .86)} ${f2(xc - cs * 1.5)},${f2(yi - a * .66)} Z` }, rg);
      caps.push({ c, ph: hash(k * 2.3 + i * 4.4) * 6.28, fr: .45 + hash(k + i * 3) * .6 });
    }
    rows.push({ rg, body, gst, hi, caps, t, Pw, a, i, sp: lerp(5, 30, t) * (calm ? .3 : 1) });
  }
  /* glitter column under the sun */
  const glints = [];
  if (o.sunX != null) for (let j = 0; j < 64; j++) {
    const tt = Math.pow(hash(j * 2.71 + 5), 1.6), y = y0 + 2 + tt * Math.min(y1 - y0, 430), spread = 10 + tt * 170;
    const x = o.sunX + (hash(j * 4.33) - .5) * 2 * spread * (.4 + .6 * hash(j * 1.1)), wd = 5 + (6 + 46 * tt) * (.3 + .7 * hash(j * 6.1));
    glints.push({ el: E('rect', { x: f2(x - wd / 2), y: f2(y), width: f2(wd), height: f2(1.2 + tt * 2.8), rx: 1.2 }, g), ph: hash(j * 9.7) * 6.28, fr: 1.4 + hash(j * 1.3) * 2.6, tt });
  }
  /* calm-night star reflections (mirror of Sky's stars with the same seed/frame) */
  const sref = []; const srefG = G(g);
  if (calm && o.stars !== false) {
    const stl = wldStars(o.seed || 7, o.nStars || 650, x0, w, o.skyTop != null ? o.skyTop : -400, y0 - 10);
    stl.forEach((s, j) => {
      const yr = y0 + (y0 - s.y) * .92; if (yr > y0 + 440 || s.b < .25) return;
      const e = E('ellipse', { cx: f2(s.x), cy: f2(yr), rx: f2(s.r * .75), ry: f2(s.r * 1.6), fill: s.c, 'fill-opacity': f2(s.b * .42) }, srefG);
      if (s.b > .4) sref.push({ e, b: s.b, ph: s.ph });
    });
  }
  function paint(m) {
    mood = m; const P = wldSeaPal[m] || wldSeaPal.day;
    stops[0].setAttribute('stop-color', P.hz); stops[1].setAttribute('stop-color', P.mid); stops[2].setAttribute('stop-color', P.deep);
    haze.setAttribute('fill', P.hi); haze.setAttribute('fill-opacity', m === 'night' ? .12 : .45);
    hzPath.setAttribute('stroke', P.hi); hzPath.setAttribute('stroke-opacity', m === 'night' ? .15 : .35);
    rows.forEach(r => {
      const base = r.t < .25 ? mix(P.hz, P.mid, r.t / .25) : mix(P.mid, P.deep, (r.t - .25) / .75);
      const b2 = shade(base, calm ? (r.i % 2 ? .01 : -.01) : (r.i % 2 ? .03 : -.02));
      r.gst[0].setAttribute('stop-color', calm ? mix(b2, P.hi, .06) : mix(b2, P.hi, m === 'night' ? .1 : .2));
      r.gst[1].setAttribute('stop-color', b2); r.gst[2].setAttribute('stop-color', shade(b2, calm ? -.02 : -.07));
      r.hi.setAttribute('stroke', P.hi); r.hi.setAttribute('stroke-opacity', f2((calm ? .14 : .26) + r.t * (calm ? .2 : .34)));
      r.caps.forEach(c => c.c.setAttribute('fill', P.foam));
    });
    glints.forEach(gl => gl.el.setAttribute('fill', P.glint));
    op(srefG, m === 'night' ? 1 : 0);
  }
  paint(mood);
  g.setMood = paint;
  g.anim = at => {
    rows.forEach(r => {
      const dx = -((at * r.sp + r.i * 37) % r.Pw), dy = Math.sin(at * .8 + r.i * 1.3) * r.a * .22;
      r.rg.setAttribute('transform', `translate(${f2(dx)},${f2(dy)})`);
      r.caps.forEach(c => c.c.setAttribute('fill-opacity', f2(clamp(Math.sin(at * c.fr + c.ph) * 1.7 - .35) * .9)));
    });
    glints.forEach(gl => gl.el.setAttribute('fill-opacity', f2((.15 + .85 * Math.max(0, Math.sin(at * gl.fr + gl.ph))) * (1 - gl.tt * .55))));
    sref.forEach(s => s.e.setAttribute('fill-opacity', f2(s.b * (.25 + .2 * Math.sin(at * 1.3 + s.ph)))));
    tf(hzLines, Math.sin(at * .2) * 12, 0);
  };
  g.anim(0);
  return g;
}

/* =====================================================================
   3) SKY — Sky(parent, {mood, x0:-400, w:2400, y0:-400, y:520 (horizon),
                       sun:[x,y], clouds:n, gulls:n, stars:420, seed:7})
   'day' clouds+gulls · 'dusk' · 'night' moonless, dense stars, Milky Way,
   shooting stars · 'dawn' pink-gold with a low sun.  .anim(at)
   ===================================================================== */
const wldSkyPal = {
  day: [[0, '#2E78C6'], [.5, '#64AEE4'], [.82, '#A6D6F2'], [1, '#DDF2F8']],
  dusk: [[0, '#1C1846'], [.38, '#4B3276'], [.66, '#A9507A'], [.85, '#EA855E'], [1, '#FBC07A']],
  night: [[0, '#02040A'], [.45, '#060A1A'], [.8, '#0C132B'], [1, '#18203F']],
  dawn: [[0, '#3C4F8A'], [.42, '#8A7DAE'], [.68, '#E39EA4'], [.86, '#F8BE96'], [1, '#FFDDA2']]
};
function wldCloud(p, cw, top, shd, hi, seed, flat) {
  const g = G(p), ch = cw * (flat ? .13 : .3);
  const lay = (c, dy, k) => {
    const L = G(g); tf(L, 0, dy);
    if (flat) {
      for (let i = 0; i < 6; i++) { const u = (hash(seed * 2.1 + i * 1.7) - .5) * .7, v = -ch * (.2 + hash(seed + i * 3.1) * .7), rx = cw * (.16 + hash(seed * 1.3 + i) * .22);
        E('rect', { x: f2(cw * u - rx), y: f2(v - ch * .2 * k), width: f2(rx * 2 * k), height: f2(ch * .4 * k), rx: f2(ch * .2), fill: c }, L); }
      E('rect', { x: f2(-cw * .5 * k), y: f2(-ch * .25 * k), width: f2(cw * k), height: f2(ch * .32 * k), rx: f2(ch * .16), fill: c }, L);
    } else {
      E('rect', { x: -cw * .5, y: -ch * .36, width: cw, height: ch * .36, rx: ch * .18, fill: c }, L);
      [[-.3, -.38, .4], [-.08, -.62, .56 + hash(seed) * .14], [.18, -.5, .46], [.36, -.3, .3]].forEach(([u, v, r], i) =>
        E('circle', { cx: cw * u, cy: ch * v, r: ch * r * (.85 + hash(seed * 3 + i) * .3) * k, fill: c }, L));
    }
  };
  lay(shd, flat ? ch * .14 : ch * .1, 1); lay(top, -ch * .05, .97);
  if (hi && !flat) { E('circle', { cx: -cw * .14, cy: -ch * .84, r: ch * .2, fill: hi }, g); E('circle', { cx: -cw * .33, cy: -ch * .6, r: ch * .12, fill: hi }, g); }
  return g;
}
function Sky(parent, o = {}) {
  const mood = o.mood || 'day', x0 = o.x0 != null ? o.x0 : -400, w = o.w || 2400, y0 = o.y0 != null ? o.y0 : -400, hy = o.y != null ? o.y : 520;
  const H = hy - y0, seed = o.seed || 7;
  const g = G(parent); const fx = [];
  E('rect', { x: x0, y: y0, width: w, height: H + 6, fill: lgrad(wldSkyPal[mood] || wldSkyPal.day) }, g);
  /* ---------- stars ---------- */
  const twk = [];
  const starField = (n, maxB, yMax) => {
    const list = wldStars(seed, n, x0, w, y0, hy - 10), buckets = {};
    list.forEach((s, i) => {
      if (s.y > yMax) return;
      const fade = clamp((hy - s.y) / 110, .12, 1), b = s.b * fade * maxB;
      if (b > .55 && twk.length < 90) {
        const sg = G(g); tf(sg, s.x, s.y);
        E('circle', { r: s.r * 2.6, fill: s.c, 'fill-opacity': .12 }, sg);
        E('circle', { r: s.r, fill: s.c }, sg);
        if (s.r > 1.6) E('path', { d: `M${-s.r * 4.5},0 H${s.r * 4.5} M0,${-s.r * 4.5} V${s.r * 4.5}`, stroke: s.c, 'stroke-width': .6, 'stroke-opacity': .55 }, sg);
        twk.push({ g: sg, b, ph: s.ph, fr: 1.2 + hash(i) * 2.4 });
      } else { const k = s.c + '|' + Math.min(4, Math.floor(b * 5)); (buckets[k] = buckets[k] || []).push([s.x, s.y, s.r * .85]); }
    });
    for (const k in buckets) { const [c, q] = k.split('|'); E('path', { d: wldDots(buckets[k]), fill: c, 'fill-opacity': f2(.18 + q * .17) }, g); }
  };
  /* ---------- night: Milky Way + stars + shooting star ---------- */
  let shoot = null;
  if (mood === 'night') {
    const cx = x0 + w * .47, cy = y0 + H * .52;
    E('rect', { x: x0, y: hy - 120, width: w, height: 126, fill: lgrad([[0, '#2A3866', 0], [1, '#2A3866', .45]]) }, g);
    const mw = G(g); mw.setAttribute('transform', `rotate(-24 ${f2(cx)} ${f2(cy)})`);
    E('ellipse', { cx: f2(cx), cy: f2(cy), rx: 1600, ry: 260, fill: rgrad([[0, '#8FA4F0', .09], [.6, '#8FA4F0', .04], [1, '#8FA4F0', 0]]) }, mw);
    for (let i = 0; i < 16; i++) {
      const u = (i / 15 - .5) * 2300 + (hash(i * 3.7) - .5) * 120, v = (hash(i * 5.9) - .5) * 90, rx = 140 + hash(i * 2.3) * 260, ry = 40 + hash(i * 4.1) * 70;
      const c = hash(i * 8.1) > .7 ? '#FFE3C4' : hash(i * 8.1) > .35 ? '#C9D3FF' : '#E8ECFF';
      E('ellipse', { cx: f2(cx + u), cy: f2(cy + v), rx: f2(rx), ry: f2(ry), fill: rgrad([[0, c, .1 + hash(i) * .06], [.6, c, .04], [1, c, 0]]), transform: `rotate(${f2((hash(i * 6.6) - .5) * 14)} ${f2(cx + u)} ${f2(cy + v)})` }, mw);
    }
    const dust = [[], [], []];
    for (let i = 0; i < 1300; i++) {
      const u = hash(i * 1.37 + 3) - .5, v = (hash(i * 2.11) + hash(i * 3.7 + 1) + hash(i * 5.3 + 2) - 1.5) / 1.5;
      dust[i % 3].push([cx + u * 2600, cy + v * 175 * (1 - Math.abs(u) * .7), .3 + hash(i * 7.7) * .7]);
    }
    dust.forEach((a, k) => E('path', { d: wldDots(a), fill: '#FFFFFF', 'fill-opacity': [.25, .42, .65][k] }, mw));
    [[-180, 18, 420, 26, 4], [240, -14, 300, 18, -6], [-700, 4, 260, 20, 8], [640, 10, 220, 16, -3], [-420, -20, 160, 14, 10]].forEach(([dx, dy, rx, ry, r]) =>
      E('ellipse', { cx: f2(cx + dx), cy: f2(cy + dy), rx, ry, fill: rgrad([[0, '#03050D', .45], [1, '#03050D', 0]]), transform: `rotate(${r} ${f2(cx + dx)} ${f2(cy + dy)})` }, mw));
    starField(o.stars || 650, 1, hy);
    shoot = G(g);
    const sh1 = E('path', { stroke: '#BFD0FF', 'stroke-width': 3.5, 'stroke-opacity': .25, 'stroke-linecap': 'round', fill: 'none' }, shoot);
    const sh2 = E('path', { stroke: '#FFFFFF', 'stroke-width': 1.6, 'stroke-linecap': 'round', fill: 'none' }, shoot);
    const shH = E('circle', { r: 2.2, fill: '#FFFFFF' }, shoot);
    const per = o.shootEvery || 5.5, sx0 = o.shootX || [80, 1520], sy0 = o.shootY || [30, Math.max(60, hy * .45)];
    fx.push(at => {
      const k = Math.floor(at / per), t = at - k * per, dur = 1.1;
      if (t > dur || hash(k * 3.1 + seed) < .2) { op(shoot, 0); return; }
      const dir = hash(k * 7.7) > .5 ? 1 : -1, ang = .32 + hash(k * 2.9) * .4, L = 260 + hash(k * 4.1) * 160;
      const sx = lerp(sx0[0], sx0[1], hash(k * 5.3)), sy = lerp(sy0[0], sy0[1], hash(k * 6.1));
      const q = t / dur, hx = sx + Math.cos(ang) * dir * L * q, hyy = sy + Math.sin(ang) * L * q, tl = 70 + 60 * Math.sin(Math.PI * q);
      const d = `M${f2(hx - Math.cos(ang) * dir * tl)},${f2(hyy - Math.sin(ang) * tl)} L${f2(hx)},${f2(hyy)}`;
      sh1.setAttribute('d', d); sh2.setAttribute('d', d); shH.setAttribute('cx', f2(hx)); shH.setAttribute('cy', f2(hyy));
      op(shoot, Math.sin(Math.PI * q));
    });
  } else if (mood === 'dusk') starField(60, .7, y0 + H * .55);
  else if (mood === 'dawn') starField(40, .35, y0 + H * .45);
  /* ---------- sun ---------- */
  if (mood !== 'night' && o.sun !== false) {
    const sp = o.sun || (mood === 'day' ? [x0 + w * .74, y0 + H * .5] : mood === 'dusk' ? [x0 + w * .6, hy - 40] : [x0 + w * .62, hy + 4]);
    const sg = G(g); tf(sg, sp[0], sp[1]);
    if (mood === 'day') {
      [[160, .07], [105, .1], [72, .2]].forEach(([r, a]) => E('circle', { r, fill: '#FFF6D0', 'fill-opacity': a }, sg));
      E('circle', { r: 46, fill: '#FFF0B0' }, sg); E('circle', { r: 38, fill: '#FFFBE6' }, sg);
    } else {
      E('circle', { r: 560, fill: rgrad([[0, mood === 'dusk' ? '#FFB070' : '#FFE6A8', .55], [.4, mood === 'dusk' ? '#FF9A6A' : '#FFD0A0', .18], [1, '#FFC090', 0]]) }, sg);
      if (mood === 'dawn') { const rays = G(sg); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, a2 = a + .07; E('path', { d: `M0,0 L${f2(Math.cos(a) * 2600)},${f2(Math.sin(a) * 2600)} L${f2(Math.cos(a2) * 2600)},${f2(Math.sin(a2) * 2600)} Z`, fill: '#FFF2D0', 'fill-opacity': i % 2 ? .035 : .07 }, rays); } fx.push(at => tf(rays, 0, 0, at * 1.2)); }
      E('circle', { r: 84, fill: mood === 'dusk' ? '#FFB46E' : '#FFE7B0', 'fill-opacity': .5 }, sg);
      E('circle', { r: 66, fill: mood === 'dusk' ? '#FFCB80' : '#FFF1CC' }, sg);
      E('circle', { r: 56, fill: mood === 'dusk' ? '#FFDA9A' : '#FFF8E6' }, sg);
    }
  }
  /* ---------- clouds ---------- */
  const nc = o.clouds != null ? o.clouds : mood === 'night' ? 0 : mood === 'day' ? 11 : 9;
  const clouds = [];
  const CP = { day: ['#FFFFFF', '#D3E5F2', '#FFFFFF'], dusk: ['#7E4F86', '#FFB088', null], dawn: ['#E7AABB', '#FFE3B8', null] }[mood] || ['#FFFFFF', '#D3E5F2', null];
  for (let i = 0; i < nc; i++) {
    const far = i < nc * .45, cw = far ? 120 + hash(i * 3.3) * 120 : 220 + hash(i * 3.3) * 240;
    const y = far ? hy - 30 - hash(i * 5.1) * 120 : y0 + H * (.42 + hash(i * 5.1) * .35);
    const hz = far ? .45 : .1;
    const top = mix(CP[0], mood === 'day' ? '#BFE2F5' : mood === 'dusk' ? '#E07A6A' : '#F6C3A8', hz), shd = mix(CP[1], mood === 'day' ? '#BFE2F5' : '#F8B990', hz * .6);
    const c = wldCloud(g, cw, top, shd, CP[2] ? mix(CP[2], '#FFFFFF', 0) : null, i + seed, mood !== 'day');
    clouds.push({ c, y, sp: (far ? 2.5 : 7) + hash(i * 7.3) * 6, off: hash(i * 1.9 + seed) * (w + 600) });
  }
  /* ---------- gulls ---------- */
  const ng = o.gulls != null ? o.gulls : mood === 'day' ? 6 : 0, gulls = [];
  for (let i = 0; i < ng; i++) {
    const gg = G(g); const s = .7 + hash(i * 2.2) * .6;
    const wing = E('path', { stroke: '#FFFFFF', 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gg);
    const tip = E('path', { stroke: '#4A4F5C', 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, gg);
    E('ellipse', { cx: 0, cy: 1, rx: 5, ry: 2.4, fill: '#FFFFFF' }, gg);
    gulls.push({ gg, wing, tip, s, bx: lerp(100, 1500, hash(i * 4.4 + 1)), by: lerp(y0 + H * .55, hy - 140, hash(i * 6.6)), ph: hash(i * 8.8) * 6.28, dir: hash(i * 9.9) > .5 ? 1 : -1 });
  }
  g.anim = at => {
    clouds.forEach(cl => tf(cl.c, x0 + ((cl.off + at * cl.sp) % (w + 600)) - 300, cl.y));
    twk.forEach(t => op(t.g, t.b * (.62 + .38 * Math.sin(at * t.fr + t.ph))));
    gulls.forEach(gl => {
      const x = gl.bx + Math.sin(at * .16 + gl.ph) * 180 * gl.dir, y = gl.by + Math.sin(at * .5 + gl.ph) * 22;
      const glide = Math.sin(at * .7 + gl.ph) > .2, f = glide ? .25 + .1 * Math.sin(at * 3) : Math.sin(at * 9 + gl.ph);
      tf(gl.gg, x, y, Math.cos(at * .16 + gl.ph) * 6 * gl.dir, gl.s * (Math.cos(at * .16 + gl.ph) * gl.dir > 0 ? 1 : -1), gl.s);
      gl.wing.setAttribute('d', `M-16,${f2(-5 * f)} Q-8,${f2(-9 * f - 3)} 0,0 Q8,${f2(-9 * f - 3)} 16,${f2(-5 * f)}`);
      gl.tip.setAttribute('d', `M-18,${f2(-5 * f + 1)} L-15,${f2(-5 * f)} M15,${f2(-5 * f)} L18,${f2(-5 * f + 1)}`);
    });
    fx.forEach(f => f(at));
  };
  g.anim(0);
  return g;
}

/* =====================================================================
   4) DOCK — Southampton quay, April 1912 (daylight). x ≈ -100…1700.
   Dock(parent, {shipX:800, ropes:true})
   Layers: dock.back (far shore + harbour water) · dock.mid (EMPTY: put the
   Titanic / tugs here, waterline at dock.shipY) · dock.front (quay, sheds,
   cranes, bunting, crowd, carts). dock.ropes = mooring-rope group.
   Draw the Sky BEFORE the Dock.  .anim(at)
   ===================================================================== */
function wldPerson(p, seed, o = {}) {
  const h = i => hash(seed * 7.31 + i * 1.71);
  const kind = o.kind || (h(1) < .4 ? 'lady' : h(2) < .1 ? 'kid' : 'man');
  const T = o.tint || (c => c);
  const COATS = ['#2E3A52', '#4A3B33', '#5B5F66', '#3E4A3C', '#6B2F36', '#2B2B30', '#7A6A55', '#3A4E6A'];
  const DRESS = ['#6A3D5A', '#2F4A6A', '#8A5A4A', '#4E6B5A', '#7A7FA0', '#C9B48A', '#5A3348', '#3E3E52'];
  const SKIN = ['#F1C9A5', '#E8B98F', '#D9A27A', '#F5D3B5', '#C68B62'];
  const HAIR = ['#3A2A20', '#5A3A24', '#1E1A18', '#8A6A3E', '#6E4A2E', '#B9A07A'];
  const pick = (a, i) => a[Math.floor(h(i) * a.length)];
  const coat = T(kind === 'lady' ? pick(DRESS, 3) : kind === 'porter' ? '#3A3F52' : kind === 'bobby' ? '#1F2638' : pick(COATS, 3));
  const skin = T(pick(SKIN, 4)), hair = T(pick(HAIR, 5)), dk = shade(coat, -.25);
  const g = G(p), body = G(g);
  if (kind === 'lady') {
    E('path', { d: 'M-10,-50 Q-15,-22 -17,0 L17,0 Q15,-22 10,-50 Z', fill: coat }, body);
    E('path', { d: 'M4,-50 L10,-50 Q15,-22 17,0 L8,0 Q8,-26 4,-50 Z', fill: dk, 'fill-opacity': .6 }, body);
    E('path', { d: 'M-10,-80 Q-12,-66 -11,-50 L11,-50 Q12,-66 10,-80 Q0,-84 -10,-80 Z', fill: shade(coat, -.08) }, body);
    E('rect', { x: -11, y: -53, width: 22, height: 3.5, rx: 1.5, fill: T(pick(['#E9E1CF', '#2B2B30', '#C9A24A'], 6)) }, body);
  } else {
    const tr = T(kind === 'kid' ? '#4A4A55' : pick(['#2B2B33', '#3B3A40', '#4A4038', '#55534F'], 6));
    E('path', { d: 'M-4.5,-44 L-5,-1 M4.5,-44 L5,-1', stroke: tr, 'stroke-width': 6.5, 'stroke-linecap': 'round' }, body);
    E('path', { d: 'M-9,0 Q-9,-4 -4,-4 L-1,-4 L-1,1 Z M9,0 Q9,-4 4,-4 L1,-4 L1,1 Z', fill: '#1C1A1A' }, body);
    const coatLen = kind === 'porter' ? -44 : -34;
    E('path', { d: `M-12.5,-80 Q-14.5,-60 -14,${coatLen} L14,${coatLen} Q14.5,-60 12.5,-80 Q0,-84 -12.5,-80 Z`, fill: coat }, body);
    E('path', { d: `M3,-82 Q12,-82 12.5,-80 Q14.5,-60 14,${coatLen} L5,${coatLen} Z`, fill: dk, 'fill-opacity': .55 }, body);
    E('path', { d: `M0,-76 V${coatLen + 2}`, stroke: dk, 'stroke-width': 1, 'stroke-opacity': .6 }, body);
    if (kind === 'bobby') E('rect', { x: -13, y: -58, width: 26, height: 3, fill: '#11151F' }, body);
  }
  /* head (seen from behind / three-quarter) */
  E('rect', { x: -3.5, y: -86, width: 7, height: 6, fill: shade(skin, -.1) }, body);
  E('ellipse', { cx: -8.6, cy: -90, rx: 2, ry: 3, fill: skin }, body); E('ellipse', { cx: 8.6, cy: -90, rx: 2, ry: 3, fill: skin }, body);
  E('circle', { cx: 0, cy: -92, r: 9, fill: hair }, body);
  E('path', { d: 'M-5,-99 Q0,-101.5 5,-99', stroke: shade(hair, .25), 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' }, body);
  if (kind === 'lady') E('circle', { cx: 0, cy: -85, r: 4.5, fill: shade(hair, -.1) }, body);
  /* hats */
  const hatG = G(body);
  const hatKind = o.hat || (kind === 'lady' ? 'lady' : kind === 'porter' ? 'peak' : kind === 'bobby' ? 'helmet' : kind === 'kid' ? (h(8) < .5 ? 'cap' : 'boater') : ['bowler', 'bowler', 'boater', 'cap', 'top'][Math.floor(h(8) * 5)]);
  const drawHat = (hg, hk) => {
    if (hk === 'bowler') { E('ellipse', { cx: 0, cy: -98.5, rx: 11, ry: 2.4, fill: T('#1E1E22') }, hg); E('path', { d: 'M-7.5,-98 Q-7.5,-110 0,-110 Q7.5,-110 7.5,-98 Z', fill: T('#26262B') }, hg); E('path', { d: 'M-4,-107 Q-1,-109 2,-109', stroke: '#fff', 'stroke-opacity': .2, 'stroke-width': 1.5, fill: 'none' }, hg); }
    else if (hk === 'boater') { E('ellipse', { cx: 0, cy: -98.5, rx: 12, ry: 2.4, fill: T('#E2C77C') }, hg); E('rect', { x: -7.5, y: -106, width: 15, height: 8, rx: 1.5, fill: T('#EBD28D') }, hg); E('rect', { x: -7.5, y: -101.5, width: 15, height: 2.6, fill: T('#3A2E5A') }, hg); }
    else if (hk === 'cap') E('path', { d: 'M-9.5,-95 Q-10,-105 0,-105 Q9.5,-105 10,-97 L13,-95 Z', fill: T(pick(['#6C6458', '#4A4A50', '#7A6A55'], 9)) }, hg);
    else if (hk === 'top') { E('ellipse', { cx: 0, cy: -99, rx: 10.5, ry: 2.2, fill: T('#17171B') }, hg); E('rect', { x: -6.5, y: -115, width: 13, height: 16, rx: 1.5, fill: T('#1F1F24') }, hg); E('rect', { x: -6.5, y: -102.5, width: 13, height: 2.5, fill: T('#3A3A44') }, hg); }
    else if (hk === 'peak') { E('path', { d: 'M-8.5,-96 L-8,-104 L8,-104 L8.5,-96 Z', fill: T('#2B3042') }, hg); E('path', { d: 'M5,-96 L14,-94.5 L8,-97 Z', fill: T('#14161E') }, hg); E('rect', { x: -2, y: -102, width: 4, height: 3, fill: T('#C9A24A') }, hg); }
    else if (hk === 'helmet') { E('path', { d: 'M-8,-95 Q-9,-114 0,-117 Q9,-114 8,-95 Z', fill: T('#1C2234') }, hg); E('ellipse', { cx: 0, cy: -95.5, rx: 10, ry: 2, fill: T('#151A28') }, hg); E('circle', { cx: 0, cy: -117, r: 1.6, fill: T('#C9C9D0') }, hg); }
    else if (hk === 'lady') {
      const hc = T(pick(['#F1E7D2', '#2B2B30', '#5A3348', '#3E4A6A', '#C9A27A', '#7A2E3A'], 10)), fc = [T('#FF8FA3'), T('#FFFFFF'), T('#F7C948'), T('#E84855')];
      E('ellipse', { cx: 0, cy: -100, rx: 17, ry: 3.6, fill: shade(hc, -.12) }, hg); E('ellipse', { cx: 0, cy: -104, rx: 9, ry: 5.5, fill: hc }, hg);
      for (let i = 0; i < 3; i++) E('circle', { cx: -7 + i * 4.5 + h(11 + i) * 2, cy: -104 + h(14 + i) * 3, r: 2.6, fill: fc[Math.floor(h(17 + i) * 4)] }, hg);
      if (h(20) < .4) E('path', { d: 'M6,-106 Q16,-118 22,-110 Q14,-112 8,-104 Z', fill: T('#F4F1EA') }, hg);
    }
  };
  drawHat(hatG, hatKind);
  /* arms: one hangs, one waves (or both hang) */
  const side = h(21) < .5 ? -1 : 1;
  const wave = o.wave != null ? o.wave : kind !== 'porter' && kind !== 'bobby' && h(22) < .85;
  E('path', { d: `M${-side * 11},-77 Q${-side * 14},-64 ${-side * 13},-52`, stroke: kind === 'lady' ? shade(coat, -.08) : coat, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, body);
  E('circle', { cx: -side * 13, cy: -50, r: 3.2, fill: skin }, body);
  const arm = G(body); tf(arm, side * 11, -77);
  const prop = h(23) < .45 ? 'hat' : 'hanky';
  if (wave) {
    E('path', { d: 'M0,0 L0,-24', stroke: kind === 'lady' ? shade(coat, -.08) : coat, 'stroke-width': 6, 'stroke-linecap': 'round' }, arm);
    E('circle', { cx: 0, cy: -27, r: 3.4, fill: skin }, arm);
    if (prop === 'hat' && kind !== 'lady') { const ph = G(arm); tf(ph, 0, 70); drawHat(ph, hatKind); op(hatG, 0); }
    else { const hk = G(arm); tf(hk, 0, -28); E('path', { d: 'M0,0 Q6,-6 12,-3 L11,6 Q6,3 0,4 Z', fill: T('#FBF8F0') }, hk); arm.hk = hk; }
  } else { E('path', { d: `M0,0 Q${side * 3},13 ${side * 2},25`, stroke: coat, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, arm); E('circle', { cx: side * 2, cy: 27, r: 3.2, fill: skin }, arm); }
  return { g, body, arm, side, wave, fr: 4 + h(24) * 4, ph: h(25) * 6.28, jump: h(26) < .25, s: kind === 'kid' ? .72 : 1 };
}
function Dock(parent, o = {}) {
  const HZ = 452, QY = 700, X0 = -160, X1 = 1760, W = X1 - X0;
  const g = G(parent); const back = G(g), mid = G(g), front = G(g); const fx = [];
  const haze = '#C3D5DE', hz = (c, k = .45) => mix(c, haze, k);
  /* ---------- far shore ---------- */
  let hd = `M${X0},${HZ}`; for (let x = X0; x <= X1; x += 40) hd += ` L${x},${f2(HZ - 26 - Math.sin(x * .004) * 18 - Math.sin(x * .011 + 1) * 8)}`; hd += ` L${X1},${HZ} Z`;
  E('path', { d: hd, fill: hz('#7E9C88', .55) }, back);
  /* distant ships laid up (coal strike), masts and funnels */
  const far = G(back);
  [[960, 34], [1040, 30]].forEach(([x, hh]) => { E('rect', { x: x - 60, y: HZ - 16, width: 130, height: 16, fill: hz('#2B2B33', .5) }, far); E('rect', { x: x - 8, y: HZ - 16 - hh, width: 13, height: hh, fill: hz('#C47A3A', .5) }, far); E('rect', { x: x - 8, y: HZ - 16 - hh, width: 13, height: 7, fill: hz('#1E1E22', .5) }, far);
    E('path', { d: `M${x - 45},${HZ - 16} V${HZ - 80} M${x + 50},${HZ - 16} V${HZ - 74} M${x - 52},${HZ - 66} h14 M${x + 44},${HZ - 62} h12`, stroke: hz('#4A4A50', .5), 'stroke-width': 1.5 }, far); });
  [[260, 70], [300, 62], [1560, 66]].forEach(([x, hh]) => E('path', { d: `M${x},${HZ - 6} V${HZ - hh} M${x - 9},${HZ - hh + 14} h18 M${x - 7},${HZ - hh + 30} h14`, stroke: hz('#4A4A50', .5), 'stroke-width': 1.5 }, far));
  /* town: warehouses, terraces, spires, chimneys, gasholder */
  const town = G(back); const tSmoke = [];
  let x = X0;
  for (let i = 0; x < X1; i++) {
    const bw = 34 + hash(i * 3.1) * 70, bh = 14 + hash(i * 4.7) * 44, c = ['#B98E78', '#A88672', '#C9B79F', '#9A8A80', '#B0A08E', '#C2A48A'][Math.floor(hash(i * 5.3) * 6)];
    if (hash(i * 7.9) > .82) { x += 20; continue; }
    const by = HZ - 4;
    E('rect', { x: f2(x), y: f2(by - bh), width: f2(bw), height: f2(bh + 4), fill: hz(c) }, town);
    if (hash(i * 2.2) > .5) E('path', { d: `M${f2(x - 2)},${f2(by - bh)} L${f2(x + bw / 2)},${f2(by - bh - 12 - hash(i) * 8)} L${f2(x + bw + 2)},${f2(by - bh)} Z`, fill: hz('#6E5A5A') }, town);
    else E('rect', { x: f2(x - 2), y: f2(by - bh - 3), width: f2(bw + 4), height: 3, fill: hz('#6E5A5A') }, town);
    for (let k = 0; k < bw / 12 - 1; k++) if (hash(i * 9 + k) > .45) E('rect', { x: f2(x + 5 + k * 12), y: f2(by - bh + 7), width: 4, height: 5, fill: hz('#4A4048') }, town);
    x += bw + 2;
  }
  [[430, 1, 110], [1190, .8, 90]].forEach(([sx, k, hh]) => { E('rect', { x: sx - 9 * k, y: HZ - hh * .55, width: 18 * k, height: hh * .55, fill: hz('#A89888') }, town); E('path', { d: `M${sx - 11 * k},${HZ - hh * .55} L${sx},${HZ - hh} L${sx + 11 * k},${HZ - hh * .55} Z`, fill: hz('#6E6470') }, town); });
  [[250, 86], [880, 96], [1490, 80]].forEach(([cx, hh], i) => { E('rect', { x: cx - 4.5, y: HZ - hh, width: 9, height: hh, fill: hz('#8A5A48') }, town); E('rect', { x: cx - 5.5, y: HZ - hh, width: 11, height: 4, fill: hz('#5A3A30') }, town);
    for (let k = 0; k < 5; k++) tSmoke.push({ el: E('circle', { r: 6, fill: hz('#8A8A90', .4) }, town), x: cx, y: HZ - hh - 4, k, i }); });
  const gh = G(town); E('rect', { x: 1640, y: HZ - 42, width: 70, height: 38, rx: 4, fill: hz('#7E8A86') }, gh); for (let k = 0; k < 6; k++) E('rect', { x: 1640 + k * 13.5, y: HZ - 50, width: 2.5, height: 46, fill: hz('#5A6460') }, gh);
  [[650, 1], [740, -1], [1330, 1]].forEach(([cx, d]) => E('path', { d: `M${cx - 8},${HZ - 4} L${cx},${HZ - 46} L${cx + 8},${HZ - 4} M${cx},${HZ - 44} L${cx - 50 * d},${HZ - 78} M${cx - 50 * d},${HZ - 78} V${HZ - 56}`, stroke: hz('#55504C', .5), 'stroke-width': 2.2, fill: 'none' }, town));
  /* ---------- harbour water ---------- */
  E('rect', { x: X0, y: HZ, width: W, height: 560, fill: lgrad([[0, '#8DB3BE'], [.25, '#6A97A6'], [1, '#3E6E80']]) }, back);
  E('rect', { x: X0, y: HZ, width: W, height: 14, fill: hz('#6E8A7C', .3), 'fill-opacity': .35 }, back);
  const rip = []; for (let i = 0; i < 70; i++) { const t = Math.pow(hash(i * 2.9), 1.3), y = HZ + 6 + t * 300; rip.push({ el: E('path', { d: `M0,0 h${f2(10 + t * 50 + hash(i) * 20)}`, stroke: '#D2E6EC', 'stroke-width': f2(1 + t * 1.6), 'stroke-opacity': f2(.25 + t * .3), 'stroke-linecap': 'round' }, back), x: X0 + hash(i * 5.7) * W, y, t, ph: hash(i * 1.1) * 6.28 }); }
  /* ---------- front: quay surface ---------- */
  E('rect', { x: X0, y: QY, width: W, height: 380, fill: lgrad([[0, '#B6A487'], [1, '#8E7A60']]) }, front);
  const pid = uid('cob'); const pat = E('pattern', { id: pid, width: 34, height: 16, patternUnits: 'userSpaceOnUse' }, DEFS);
  E('rect', { x: 1, y: 1, width: 15, height: 6, rx: 3, fill: '#000', 'fill-opacity': .08 }, pat); E('rect', { x: 18, y: 9, width: 14, height: 6, rx: 3, fill: '#000', 'fill-opacity': .08 }, pat); E('rect', { x: 3, y: 2, width: 8, height: 2, rx: 1, fill: '#fff', 'fill-opacity': .08 }, pat);
  E('rect', { x: X0, y: QY + 14, width: W, height: 380, fill: 'url(#' + pid + ')' }, front);
  E('rect', { x: X0, y: QY, width: W, height: 12, fill: '#CFC6B6' }, front);
  let jd = ''; for (let x2 = X0; x2 < X1; x2 += 46) jd += `M${x2},${QY} v12 `; E('path', { d: jd, stroke: '#9E9484', 'stroke-width': 1.5 }, front);
  E('rect', { x: X0, y: QY + 12, width: W, height: 4, fill: '#000', 'fill-opacity': .18 }, front);
  /* rail tracks */
  [[748, 9], [846, 13]].forEach(([ry, gap]) => { let sd2 = ''; for (let x2 = X0; x2 < X1; x2 += 20) sd2 += `M${x2},${ry - 2} h9 v${gap + 4} h-9 Z `; E('path', { d: sd2, fill: '#5E4E3E', 'fill-opacity': .55 }, front);
    E('path', { d: `M${X0},${ry} H${X1} M${X0},${ry + gap} H${X1}`, stroke: '#6E6A66', 'stroke-width': 3 }, front); E('path', { d: `M${X0},${ry - 1} H${X1} M${X0},${ry + gap - 1} H${X1}`, stroke: '#C8C2B8', 'stroke-width': 1 }, front); });
  /* bollards + mooring ropes */
  const ropes = G(front);
  for (let bx = X0 + 40; bx < X1; bx += 170) { const b = G(front); tf(b, bx, QY + 12); E('path', { d: 'M-7,0 L-5.5,-12 Q-9,-13 -9,-16 L9,-16 Q9,-13 5.5,-12 L7,0 Z', fill: '#24262B' }, b); E('rect', { x: -9, y: -17, width: 18, height: 3, rx: 1.5, fill: '#3A3D44' }, b); }
  const sx = o.shipX != null ? o.shipX : 800;
  [[sx - 620, sx - 520], [sx + 540, sx + 470]].forEach(([b0, sx2]) => { const bx = X0 + 40 + Math.round((b0 - X0 - 40) / 170) * 170; E('path', { d: `M${bx},${QY + 2} Q${(bx + sx2) / 2},${QY - 20} ${sx2},${QY - 92}`, stroke: '#8A6E4A', 'stroke-width': 3, fill: 'none' }, ropes); });
  if (o.ropes === false) op(ropes, 0);
  /* ---------- sheds ---------- */
  const shedL = G(front); tf(shedL, 34, 0);
  E('rect', { x: -130, y: 470, width: 430, height: 268, fill: '#9B5A40' }, shedL);
  let bd = ''; for (let r = 0; r < 24; r++) for (let c = 0; c < 20; c++) { if (hash(r * 31 + c * 7) > .3) continue; bd += `M${-126 + c * 22 + (r % 2) * 11},${474 + r * 11} h16 v6 h-16 Z `; } E('path', { d: bd, fill: '#B06A4C', 'fill-opacity': .7 }, shedL);
  E('path', { d: 'M-146,474 L85,360 L316,474 L300,474 L85,374 L-130,474 Z', fill: '#5D636E' }, shedL);
  E('path', { d: 'M-130,474 L85,374 L300,474 Z', fill: '#A8644A' }, shedL);
  E('circle', { cx: 85, cy: 428, r: 20, fill: '#F1E6CC' }, shedL); E('circle', { cx: 85, cy: 428, r: 20, fill: 'none', stroke: '#3A3530', 'stroke-width': 3 }, shedL);
  const clkH = E('path', { d: 'M85,428 L85,416', stroke: '#2B2B30', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, shedL); E('path', { d: 'M85,428 L93,431', stroke: '#2B2B30', 'stroke-width': 3, 'stroke-linecap': 'round' }, shedL);
  [[-130, 470], [292, 470]].forEach(([qx]) => { for (let k = 0; k < 9; k++) E('rect', { x: qx, y: 474 + k * 30, width: 8, height: 15, fill: '#D2C3A8' }, shedL); });
  E('rect', { x: -52, y: 486, width: 274, height: 44, rx: 4, fill: '#2E4A3A' }, shedL); E('rect', { x: -46, y: 492, width: 262, height: 32, rx: 3, fill: '#F1E6CC' }, shedL);
  TX(shedL, 85, 517, 'SOUTHAMPTON', 24, '#2E4A3A', { a: 'middle', w: 800, ls: 2 });
  E('path', { d: 'M5,738 V610 Q85,540 165,610 V738 Z', fill: '#2B211D' }, shedL);
  [[22, 700, 46, 38], [70, 690, 40, 48], [112, 706, 44, 32], [40, 664, 30, 26]].forEach(([cx, cy, w2, h2]) => { E('rect', { x: cx, y: cy, width: w2, height: h2, fill: '#5A4330' }, shedL); E('path', { d: `M${cx},${cy} L${cx + w2},${cy + h2} M${cx + w2},${cy} L${cx},${cy + h2}`, stroke: '#3E2E22', 'stroke-width': 2 }, shedL); });
  E('rect', { x: 150, y: 600, width: 60, height: 138, fill: '#4C6B4A' }, shedL); for (let k = 0; k < 5; k++) E('path', { d: `M${156 + k * 11},604 V734`, stroke: '#3B5539', 'stroke-width': 2 }, shedL);
  [[-100, 560], [-40, 560], [220, 560]].forEach(([wx, wy]) => { E('path', { d: `M${wx},${wy + 50} V${wy + 12} Q${wx + 20},${wy - 8} ${wx + 40},${wy + 12} V${wy + 50} Z`, fill: '#D2C3A8' }, shedL); E('path', { d: `M${wx + 4},${wy + 46} V${wy + 14} Q${wx + 20},${wy - 2} ${wx + 36},${wy + 14} V${wy + 46} Z`, fill: '#86A6B4' }, shedL); E('path', { d: `M${wx + 20},${wy + 2} V${wy + 46} M${wx + 4},${wy + 28} H${wx + 36}`, stroke: '#D2C3A8', 'stroke-width': 2.5 }, shedL); });
  E('rect', { x: -130, y: 730, width: 430, height: 8, fill: '#6E6050' }, shedL);
  const shedR = G(front);
  E('rect', { x: 1430, y: 500, width: 360, height: 238, fill: '#C2BB94' }, shedR);
  let vb = ''; for (let k = 0; k < 30; k++) vb += `M${1436 + k * 12},502 V736 `; E('path', { d: vb, stroke: '#A39C78', 'stroke-width': 2 }, shedR);
  E('path', { d: 'M1414,504 L1610,404 L1806,504 L1790,504 L1610,418 L1430,504 Z', fill: '#7A3E32' }, shedR);
  E('path', { d: 'M1430,504 L1610,418 L1790,504 Z', fill: '#B5AD86' }, shedR);
  E('rect', { x: 1478, y: 520, width: 264, height: 40, rx: 4, fill: '#7A3E32' }, shedR); E('rect', { x: 1484, y: 525, width: 252, height: 30, rx: 3, fill: '#F4ECD6' }, shedR);
  TX(shedR, 1610, 547, 'OCEAN DOCK', 22, '#7A3E32', { a: 'middle', w: 800, ls: 3 });
  E('rect', { x: 1520, y: 600, width: 90, height: 138, fill: '#2E2622' }, shedR); E('rect', { x: 1650, y: 586, width: 70, height: 56, fill: '#86A6B4' }, shedR); E('path', { d: 'M1685,586 V642 M1650,614 H1720', stroke: '#C2BB94', 'stroke-width': 3 }, shedR);
  const sign = G(shedR); tf(sign, 1456, 640); E('rect', { x: -4, y: 0, width: 6, height: 98, fill: '#3B2E22' }, sign); E('path', { d: 'M-12,-4 H62 L74,12 L62,28 H-12 Z', fill: '#2E4A3A' }, sign); TX(sign, 26, 18, 'BOARDING', 12, '#F4ECD6', { a: 'middle', w: 800, ls: 1 });
  E('rect', { x: 1430, y: 730, width: 360, height: 8, fill: '#7A6E58' }, shedR);
  /* ---------- crowd (3 depth rows) ---------- */
  const people = [];
  const row = (y, s, x0, x1, step, tk, seed) => { const T2 = c => mix(c, '#B9C3C8', tk); const list = []; for (let px = x0, i = 0; px < x1; px += step * (.75 + hash(i * 3.3 + seed) * .5), i++) { if (hash(i * 6.1 + seed) < .12) continue; const pp = wldPerson(front, seed + i * 1.37, { tint: T2 }); pp.x = px; pp.y = y + (hash(i * 2.9 + seed) - .5) * 8; pp.sc = s * pp.s; list.push(pp); } list.sort((a, b) => a.y - b.y).forEach(pp => { front.appendChild(pp.g); people.push(pp); }); };
  row(726, .52, 440, 1290, 24, .16, 11);
  /* lamps & cranes (stand on the edge rail) */
  const lampAt = lx => { const l = G(front); tf(l, lx, 770); E('path', { d: 'M-7,0 L-5,-12 L-3,-12 L-2.5,-150 L2.5,-150 L3,-12 L5,-12 L7,0 Z', fill: '#2F3B33' }, l); E('rect', { x: -12, y: -142, width: 24, height: 3, fill: '#2F3B33' }, l);
    E('path', { d: 'M-9,-150 L-7,-170 L7,-170 L9,-150 Z', fill: '#E9E2C6' }, l); E('path', { d: 'M-11,-170 L0,-180 L11,-170 Z M-10,-151 h20', fill: '#2F3B33', stroke: '#2F3B33', 'stroke-width': 2 }, l); return l; };
  [360, 760, 1120, 1390].forEach(lampAt);
  const cranes = [];
  [[560, 1], [980, 1], [1260, -1]].forEach(([cx, d]) => {
    const c = G(front); tf(c, cx, 770);
    E('path', { d: 'M-42,0 L-30,-170 M42,0 L30,-170 M-36,-80 L36,-80 M-40,-10 L32,-80 M40,-10 L-32,-80 M-33,-125 L33,-125 M-33,-125 L28,-165 M33,-125 L-28,-165', stroke: '#4F4A47', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, c);
    E('rect', { x: -48, y: -4, width: 22, height: 8, rx: 3, fill: '#2E2B29' }, c); E('rect', { x: 26, y: -4, width: 22, height: 8, rx: 3, fill: '#2E2B29' }, c);
    E('rect', { x: -38, y: -176, width: 76, height: 10, fill: '#5A524C' }, c);
    const top = G(c); tf(top, 0, -176);
    E('rect', { x: -26, y: -46, width: 52, height: 46, rx: 4, fill: '#6E5E50' }, top); E('rect', { x: -26, y: -50, width: 52, height: 7, rx: 3, fill: '#4A3E36' }, top);
    E('rect', { x: d * 4 - 6, y: -36, width: 14, height: 12, fill: '#A9C4CC' }, top);
    E('rect', { x: -d * 26 - (d > 0 ? 20 : 0), y: -30, width: 20, height: 24, fill: '#3A3532' }, top);
    const jx = -d * 190, jy = -300;
    E('path', { d: `M${d * 10},-30 L${jx},${jy} M${d * 20},-10 L${jx + d * 6},${jy + 10}`, stroke: '#4F4A47', 'stroke-width': 4, 'stroke-linecap': 'round' }, top);
    let lat = ''; for (let k = 0; k < 9; k++) { const t0 = k / 9, t1 = (k + .5) / 9; lat += `M${f2(lerp(d * 10, jx, t0))},${f2(lerp(-30, jy, t0))} L${f2(lerp(d * 20, jx + d * 6, t1))},${f2(lerp(-10, jy + 10, t1))} `; }
    E('path', { d: lat, stroke: '#5E5854', 'stroke-width': 1.6 }, top);
    E('path', { d: `M0,-50 L${jx},${jy}`, stroke: '#3A3532', 'stroke-width': 1.2 }, top);
    const hook = G(top); const hr = E('path', { stroke: '#2E2B29', 'stroke-width': 1.4 }, hook); const hb = G(hook);
    E('path', { d: 'M-4,0 h8 v6 h-8 Z M0,6 v6 q0,6 -5,5', fill: '#2E2B29', stroke: '#2E2B29', 'stroke-width': 2, 'stroke-linecap': 'round' }, hb);
    cranes.push({ hook, hr, hb, jx, jy, ph: cx * .01 });
  });
  /* bunting between lamps, cranes and sheds */
  const flags = [];
  const anchors = [[334, 478], [360, 596], [560, 538], [760, 596], [980, 538], [1120, 596], [1260, 538], [1390, 596], [1440, 508]];
  const FC = ['#D64545', '#F4F1EA', '#3E6FB0', '#E8B83A', '#3F9A5A'];
  for (let i = 0; i < anchors.length - 1; i++) {
    const [ax, ay] = anchors[i], [bx2, by2] = anchors[i + 1], sag = 34;
    const pt = t => [lerp(ax, bx2, t), lerp(ay, by2, t) + sag * 4 * t * (1 - t)];
    const pts = []; for (let k = 0; k <= 14; k++) pts.push(pt(k / 14));
    E('path', { d: wldPl(pts), stroke: '#3A3530', 'stroke-width': 1.2, fill: 'none' }, front);
    const L = Math.hypot(bx2 - ax, by2 - ay), n = Math.floor(L / 21);
    for (let k = 1; k < n; k++) { const t = k / n, p2 = pt(t), q = pt(t + .01), ang = Math.atan2(q[1] - p2[1], q[0] - p2[0]) * 180 / Math.PI;
      const fg = G(front); tf(fg, p2[0], p2[1], ang); const fi = E('path', { d: 'M-6,0 L6,0 L0,14 Z', fill: FC[(i * 3 + k) % 5] }, fg); flags.push({ fi, ph: i * 1.3 + k * .7 }); }
  }
  row(764, .6, 400, 1330, 30, .06, 23);
  /* luggage carts with porters */
  const cart = (cx, cy, s, seed) => {
    const c = G(front); tf(c, cx, cy, 0, s);
    E('path', { d: 'M38,-14 L64,-44', stroke: '#6B4A2B', 'stroke-width': 4, 'stroke-linecap': 'round' }, c);
    E('rect', { x: -44, y: -20, width: 86, height: 8, rx: 2, fill: '#8A5E34' }, c);
    [[-40, -46, 44, 26, '#7A4A2A'], [6, -40, 34, 20, '#4A5A6A'], [-34, -62, 30, 16, '#B98A5A'], [2, -58, 26, 18, '#6A2E2E']].forEach(([x2, y2, w2, h2, col], i) => {
      E('rect', { x: x2, y: y2, width: w2, height: h2, rx: 2.5, fill: col }, c); E('rect', { x: x2, y: y2, width: w2, height: 4, rx: 2, fill: shade(col, .15) }, c);
      E('path', { d: `M${x2 + w2 * .3},${y2} v${h2} M${x2 + w2 * .7},${y2} v${h2}`, stroke: shade(col, -.35), 'stroke-width': 2 }, c);
      if (hash(seed + i) > .4) E('rect', { x: x2 + 3, y: y2 + h2 * .45, width: 8, height: 6, fill: ['#F4ECD6', '#E8B83A', '#9EC4D8'][i % 3] }, c);
    });
    E('ellipse', { cx: 18, cy: -66, rx: 11, ry: 4, fill: '#E6D2B0' }, c); E('rect', { x: 7, y: -66, width: 22, height: 8, fill: '#D9C29C' }, c); E('path', { d: 'M7,-62 h22', stroke: '#B05A5A', 'stroke-width': 2 }, c);
    [-26, 26].forEach(wx => { E('circle', { cx: wx, cy: -8, r: 9, fill: '#3A2E24' }, c); E('circle', { cx: wx, cy: -8, r: 3, fill: '#8A7A6A' }, c); });
    const pp = wldPerson(front, seed, { kind: 'porter', wave: false }); pp.x = cx + 78 * s; pp.y = cy; pp.sc = s * 1.05; people.push(pp);
  };
  cart(470, 828, .82, 3.3); cart(1170, 836, .86, 7.7);
  row(822, .7, 200, 1480, 52, 0, 41);
  /* foreground props */
  const fg2 = G(front);
  [[-60, 900, 1], [1660, 910, 1.1]].forEach(([bx, by, s]) => { const b = G(fg2); tf(b, bx, by, 0, s); E('rect', { x: -40, y: -70, width: 80, height: 70, rx: 4, fill: '#9A6A3E' }, b); E('rect', { x: -40, y: -70, width: 80, height: 10, fill: '#7A4E2A' }, b); E('path', { d: 'M-34,-56 L34,-6 M34,-56 L-34,-6', stroke: '#7A4E2A', 'stroke-width': 5 }, b); E('rect', { x: -30, y: -44, width: 60, height: 18, rx: 2, fill: '#E9DCC0' }, b); TX(b, 0, -30, 'R.M.S.', 12, '#5A3B1E', { a: 'middle', w: 800 }); });
  const coil = G(fg2); tf(coil, 1540, 890); [26, 19, 12].forEach(r => E('ellipse', { rx: r * 1.6, ry: r * .55, fill: 'none', stroke: '#B08A5A', 'stroke-width': 6 }, coil));
  const barrel = G(fg2); tf(barrel, 120, 905); E('path', { d: 'M-24,0 Q-30,-35 -24,-70 L24,-70 Q30,-35 24,0 Z', fill: '#8A5A34' }, barrel); E('path', { d: 'M-27,-18 H27 M-27,-52 H27', stroke: '#3A3530', 'stroke-width': 4 }, barrel);
  /* ---------- animation ---------- */
  const dock = { g, back, mid, front, ropes, shipY: 650, quayY: QY };
  dock.anim = at => {
    people.forEach(pp => {
      const b = pp.jump ? -Math.abs(Math.sin(at * pp.fr * .6 + pp.ph)) * 5 : Math.sin(at * 2 + pp.ph) * .8;
      tf(pp.g, pp.x, pp.y, 0, pp.sc);
      tf(pp.body, 0, b, Math.sin(at * 1.3 + pp.ph) * 1.5);
      if (pp.wave) { tf(pp.arm, pp.side * 11, -77, pp.side * (16 + 24 * Math.sin(at * pp.fr + pp.ph))); if (pp.arm.hk) tf(pp.arm.hk, 0, -28, 0, .7 + .3 * Math.sin(at * 14 + pp.ph), 1); }
    });
    flags.forEach(f => f.fi.setAttribute('transform', `rotate(${f2(Math.sin(at * 3.2 + f.ph) * 12)}) scale(1,${f2(.9 + .1 * Math.sin(at * 5 + f.ph))})`));
    cranes.forEach(c => { const sw = Math.sin(at * .9 + c.ph) * 7, len = 150 + Math.sin(at * .25 + c.ph) * 30; c.hr.setAttribute('d', `M${c.jx},${c.jy} L${f2(c.jx + sw)},${f2(c.jy + len)}`); tf(c.hb, c.jx + sw, c.jy + len); });
    tSmoke.forEach(s => { const q = (at * .12 + s.k / 5 + s.i * .3) % 1; s.el.setAttribute('cx', f2(s.x - q * 50)); s.el.setAttribute('cy', f2(s.y - q * 40)); s.el.setAttribute('r', f2(4 + q * 12)); op(s.el, (1 - q) * .7); });
    rip.forEach(r => { tf(r.el, r.x + Math.sin(at * .5 + r.ph) * 14, r.y); op(r.el, .5 + .5 * Math.sin(at * 1.2 + r.ph)); });
    clkH.setAttribute('transform', `rotate(${f2(at * .5)} 85 428)`);
  };
  dock.anim(0);
  return dock;
}

/* =====================================================================
   5) LIFEBOAT — wooden clinker lifeboat, ~300 px long at s=1, bow right.
   Origin = waterline centre. lb = Lifeboat(parent, {mood, num, drop:380})
   lb.crew: group between the far and near hull sides (characters put here are
   hidden below the gunwale; feet ≈ y -6, gunwale ≈ y -46). lb.seats: [x,y].
   lb.set({x,y,rot,s,flip,row (0..1 stroke phase), lower (0 at davits … 1 afloat)})
   lb.anim(at): bobbing + ripples.
   ===================================================================== */
function Lifeboat(parent, o = {}) {
  const K = wldTint(o.mood), drop = o.drop || 380, mood = o.mood || 'day';
  const foamC = mood === 'night' ? '#9AA8D0' : mood === 'dawn' ? '#FFF1EA' : '#FFFFFF';
  const sheer = x => -46 - 16 * Math.pow(x / 150, 2);
  const root = G(parent);
  const ropeG = G(root, { stroke: K('#CDB892'), 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' });
  const ropes = [E('path', {}, ropeG), E('path', {}, ropeG)];
  const ripB = G(root);
  const ringsB = [0, 1, 2].map(() => E('ellipse', { fill: 'none', stroke: foamC, 'stroke-width': 1.6 }, ripB));
  const clipG = G(root, { 'clip-path': clipRect(-3000, -6000, 6000, 6003) });
  const lowG = G(clipG), bobG = G(lowG);
  const back = G(bobG), crew = G(bobG), front = G(bobG);
  /* far side: interior + far gunwale + far oars */
  const farOars = G(back);
  E('path', { d: 'M-150,-62 Q0,-38 150,-62 L150,-55 Q0,-24 -150,-55 Z', fill: K('#B6875A') }, back);
  E('path', { d: 'M-146,-60 Q0,-37 146,-60', stroke: K('#7E522C'), 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, back);
  E('path', { d: 'M-128,-52 Q0,-30 128,-52', stroke: K('#9C6E42'), 'stroke-width': 3, fill: 'none', 'stroke-opacity': .6 }, back);
  /* near side hull */
  const hullD = 'M-150,-62 Q0,-30 150,-62 Q160,-22 128,18 Q0,32 -128,18 Q-160,-22 -150,-62 Z';
  const cid = uid('lbc'); const cp = E('clipPath', { id: cid }, DEFS); E('path', { d: hullD }, cp);
  E('path', { d: hullD, fill: K('#F3EFE6') }, front);
  const hc = G(front, { 'clip-path': 'url(#' + cid + ')' });
  E('rect', { x: -170, y: -4, width: 340, height: 40, fill: K('#D9D2C3') }, hc);
  E('rect', { x: -170, y: 14, width: 340, height: 30, fill: K('#B9B2A4') }, hc);
  [14, 28, 42].forEach((dy, k) => E('path', { d: `M${-150 + k * 3},${-62 + dy} Q0,${-30 + dy} ${150 - k * 3},${-62 + dy}`, stroke: K('#CFC7B6'), 'stroke-width': 1.8, fill: 'none' }, hc));
  E('path', { d: 'M100,-70 Q150,-60 170,-40 L170,30 L120,30 Z', fill: '#FFFFFF', 'fill-opacity': .18 }, hc);
  E('path', { d: 'M-128,18 Q0,32 128,18', stroke: K('#6B4A2B'), 'stroke-width': 4, fill: 'none' }, front);
  E('path', { d: 'M-151,-61 Q0,-29 151,-61', stroke: K('#8E5C31'), 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, front);
  E('path', { d: 'M-148,-64 Q0,-32 148,-64', stroke: K('#C08A55'), 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, front);
  let fd = 'M-122,' + f2(sheer(-122) + 7); for (let x = -122; x < 118; x += 30) fd += ` q15,${f2(9)} 30,${f2(sheer(x + 30) - sheer(x))}`;
  E('path', { d: fd, stroke: K('#C9B48E'), 'stroke-width': 1.5, fill: 'none' }, front);
  const numT = o.num != null ? TX(front, 116, -30, String(o.num), 14, K('#2A3550'), { a: 'middle', w: 800 }) : null;
  /* hooks for the falls */
  [-122, 122].forEach(hx => E('path', { d: `M${hx},${f2(sheer(hx) - 2)} v-12`, stroke: K('#55504A'), 'stroke-width': 2.4 }, front));
  /* oars: near (in front) and far (behind) */
  const OX = [-55, 50], oars = [];
  const mkOar = (p, far) => { const g2 = G(p); const loom = E('path', { stroke: K(far ? '#A9844F' : '#C99D63'), 'stroke-width': far ? 3.4 : 4.2, 'stroke-linecap': 'round', fill: 'none' }, g2); const blade = E('path', { stroke: K(far ? '#A9844F' : '#D6AC70'), 'stroke-width': far ? 8 : 10, 'stroke-linecap': 'round', fill: 'none' }, g2); return { g: g2, loom, blade, far }; };
  OX.forEach(ox => { oars.push(Object.assign(mkOar(farOars, true), { ox })); });
  const nearOars = G(bobG);
  OX.forEach(ox => { oars.push(Object.assign(mkOar(nearOars, false), { ox })); });
  const splashG = G(root); const splashes = OX.map(() => E('ellipse', { fill: foamC, 'fill-opacity': 0 }, splashG));
  const foamL = E('path', { stroke: foamC, 'stroke-width': 2.2, 'stroke-opacity': .7, fill: 'none', 'stroke-linecap': 'round' }, root);
  const st = { x: 0, y: 0, s: 1, rot: 0, row: 0, lower: 1, flip: false };
  let T = 0;
  const lb = { g: root, root, crew, back, front, seats: [[-95, -6], [-35, -6], [25, -6], [85, -6]], gunwaleY: -46 };
  const drawOars = () => {
    const ph = ((st.row % 1) + 1) % 1, drive = ph < .5;
    const sweep = drive ? lerp(1, -1, ease(ph / .5)) : lerp(-1, 1, ease((ph - .5) / .5));
    const lift = drive ? 0 : Math.sin(Math.PI * (ph - .5) / .5);
    oars.forEach((oa, i) => {
      const py = sheer(oa.ox) - (oa.far ? 8 : 0), px = oa.ox;
      const bx = px + sweep * 58, by = (oa.far ? 8 : 18) - lift * 26;
      const dx = bx - px, dy = by - py, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      const ex = px + ux * 112, ey = py + uy * 112, hx = px - ux * 36, hy = py - uy * 36;
      oa.loom.setAttribute('d', `M${f2(hx)},${f2(hy)} L${f2(ex)},${f2(ey)}`);
      oa.blade.setAttribute('d', `M${f2(px + ux * 88)},${f2(py + uy * 88)} L${f2(ex)},${f2(ey)}`);
    });
    const inW = st.lower >= .98;
    splashes.forEach((sp, i) => { const k = Math.max(0, 1 - Math.min(Math.abs(ph - .02), Math.abs(ph - 1.02)) / .1) + Math.max(0, 1 - Math.abs(ph - .52) / .1);
      sp.setAttribute('cx', f2(OX[i] + sweep * 64)); sp.setAttribute('cy', 1); sp.setAttribute('rx', f2(8 + k * 8)); sp.setAttribute('ry', f2(2 + k * 2.5)); sp.setAttribute('fill-opacity', f2(inW ? clamp(k) * .8 : 0)); });
  };
  lb.set = function (u) {
    if (u) Object.assign(st, u);
    const fl = st.flip ? -1 : 1;
    tf(root, st.x, st.y, 0, st.s * fl, st.s);
    if (numT) numT.setAttribute('transform', st.flip ? 'translate(232,0) scale(-1,1)' : '');
    const lw = st.lower == null ? 1 : clamp(st.lower), up = (1 - lw) * drop;
    const jig = (1 - lw) * Math.sin(lw * Math.PI * 5) * 2.2;
    tf(lowG, 0, -up, jig);
    const inW = lw >= .98;
    op(ropeG, inW ? 0 : 1);
    if (!inW) [-122, 122].forEach((hx, i) => { const a = Math.PI / 180 * jig, hy = sheer(hx) - 14; const rx = hx * Math.cos(a) - hy * Math.sin(a), ry = hx * Math.sin(a) + hy * Math.cos(a) - up; ropes[i].setAttribute('d', `M${f2(rx)},${f2(ry)} L${hx},${-drop - 140}`); });
    op(nearOars, inW ? 1 : 0); op(farOars, inW ? 1 : 0); op(foamL, inW ? 1 : 0); op(ripB, inW ? 1 : 0);
    tf(bobG, 0, 0, st.rot || 0);
    drawOars();
    lb.anim(T);
  };
  lb.anim = function (at) {
    T = at;
    const inW = (st.lower == null ? 1 : st.lower) >= .98;
    const b = inW ? Math.sin(at * 1.5 + st.x * .01) * 1.6 : 0, r = inW ? Math.sin(at * 1.1 + st.x * .02) * 1.3 : 0;
    tf(bobG, 0, b, (st.rot || 0) + r);
    if (inW) {
      foamL.setAttribute('d', wldFoam(-136, 138, at, 1.2, st.x * .01, 2.5, 8));
      ringsB.forEach((rg, i) => { const q = (at * .35 + i / 3) % 1; rg.setAttribute('cx', 0); rg.setAttribute('cy', 3); rg.setAttribute('rx', f2(150 + q * 90)); rg.setAttribute('ry', f2(6 + q * 8)); rg.setAttribute('stroke-opacity', f2((1 - q) * .45)); });
    }
  };
  lb.set({});
  return lb;
}

/* =====================================================================
   6) TUGBOAT — cheeky harbour tug, ~250 px long at s=1, bow right.
   tg = Tugboat(parent, {mood}); tg.set({x,y,s,flip,tow:[px,py]|null (parent coords)}); tg.anim(at)
   ===================================================================== */
function Tugboat(parent, o = {}) {
  const K = wldTint(o.mood), mood = o.mood || 'day';
  const foamC = mood === 'night' ? '#9AA8D0' : '#FFFFFF';
  const root = G(parent);
  const towG = G(root); const tow = E('path', { stroke: K('#8A6E4A'), 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, towG);
  const smokeG = G(root);
  const clipG = G(root, { 'clip-path': clipRect(-3000, -5000, 6000, 5003) });
  const bob = G(clipG);
  /* funnel (behind the wheelhouse) */
  const fun = G(bob);
  E('path', { d: 'M-40,-60 L-6,-60 L-12,-168 L-44,-168 Z', fill: K('#D9893A') }, fun);
  E('path', { d: 'M-40,-60 L-31,-60 L-36,-168 L-44,-168 Z', fill: K('#EBA65A') }, fun);
  E('path', { d: 'M-15,-60 L-6,-60 L-12,-168 L-20,-168 Z', fill: K('#B86E28') }, fun);
  E('path', { d: 'M-44,-168 L-12,-168 L-13.4,-142 L-42.6,-142 Z', fill: K('#1E1E22') }, fun);
  E('path', { d: 'M-46,-172 L-10,-172 L-11,-166 L-45,-166 Z', fill: K('#2A2A30') }, fun);
  E('path', { d: 'M-42.6,-130 L-9.9,-130 L-9.6,-124 L-42.2,-124 Z', fill: K('#F4F1EA') }, fun);
  E('rect', { x: -4, y: -140, width: 5, height: 14, rx: 1.5, fill: K('#D9B04A') }, fun);
  E('path', { d: 'M-1.5,-126 V-62', stroke: K('#C49752'), 'stroke-width': 2 }, fun);
  /* mast + pennant */
  E('path', { d: 'M62,-96 L60,-160', stroke: K('#3A3A40'), 'stroke-width': 3 }, bob);
  const pen = E('path', { fill: K('#3E6FB0') }, bob);
  /* hull */
  const hullD = 'M-124,-34 Q-40,-38 60,-44 Q100,-48 124,-54 Q132,-20 112,10 Q100,26 70,28 L-96,28 Q-126,20 -132,-6 Q-134,-22 -124,-34 Z';
  E('path', { d: hullD, fill: K('#24262E') }, bob);
  const hcid = uid('tgc'); const hcp = E('clipPath', { id: hcid }, DEFS); E('path', { d: hullD }, hcp);
  const hc = G(bob, { 'clip-path': 'url(#' + hcid + ')' });
  E('rect', { x: -140, y: -60, width: 280, height: 14, fill: K('#33363F') }, hc);
  E('rect', { x: -140, y: -4, width: 280, height: 40, fill: K('#B03A2E') }, hc);
  E('rect', { x: -140, y: 12, width: 280, height: 30, fill: K('#8C2A24') }, hc);
  E('rect', { x: -140, y: -4, width: 280, height: 2, fill: K('#D9583F') }, hc);
  E('path', { d: 'M-124,-34 Q-40,-38 60,-44 Q100,-48 124,-54', stroke: K('#EDE6D6'), 'stroke-width': 3.2, fill: 'none' }, bob);
  [-60, -10, 40].forEach((px2, i) => { E('circle', { cx: px2, cy: -18, r: 3.6, fill: K('#E9D9A8') }, bob); E('circle', { cx: px2, cy: -18, r: 3.6, fill: 'none', stroke: K('#C9A24A'), 'stroke-width': 1.4 }, bob); });
  /* tyre fenders */
  [-96, -30, 30, 86].forEach(fx => { E('path', { d: `M${fx},${f2(-38 - fx * .06)} v10`, stroke: K('#8A6E4A'), 'stroke-width': 1.5 }, bob); E('circle', { cx: fx, cy: f2(-20 - fx * .06), r: 8, fill: 'none', stroke: K('#141418'), 'stroke-width': 5 }, bob); });
  /* bow "pudding" fender – the cheeky nose */
  E('ellipse', { cx: 127, cy: -24, rx: 11, ry: 17, fill: K('#9A7148'), transform: 'rotate(-12 127 -24)' }, bob);
  E('path', { d: 'M119,-36 Q129,-30 133,-14 M123,-38 Q133,-30 136,-18', stroke: K('#6E4E2E'), 'stroke-width': 1.6, fill: 'none' }, bob);
  /* deckhouse + wheelhouse with round "eye" windows and a visor */
  E('path', { d: 'M-70,-38 L52,-44 L52,-62 L-70,-60 Z', fill: K('#E8DFC8') }, bob);
  E('path', { d: 'M40,-43 L52,-44 L52,-62 L40,-62 Z', fill: K('#D2C8AE') }, bob);
  [-58, -36].forEach(wx => E('rect', { x: wx, y: -55, width: 12, height: 9, rx: 2, fill: K('#5A6A7A') }, bob));
  E('circle', { cx: -14, cy: -50, r: 7, fill: 'none', stroke: K('#D64545'), 'stroke-width': 3.5, 'stroke-dasharray': '5.5 5.5' }, bob);
  E('circle', { cx: -14, cy: -50, r: 7, fill: 'none', stroke: K('#F4F1EA'), 'stroke-width': 3.5, 'stroke-dasharray': '5.5 5.5', 'stroke-dashoffset': 5.5 }, bob);
  E('path', { d: 'M4,-62 L66,-62 L66,-98 L8,-98 Z', fill: K('#A06E45') }, bob);
  E('path', { d: 'M50,-62 L66,-62 L66,-98 L50,-98 Z', fill: K('#7E5232') }, bob);
  E('rect', { x: 4, y: -66, width: 62, height: 4, fill: K('#E8DFC8') }, bob);
  [[22, -81], [44, -81]].forEach(([ex, ey]) => { E('circle', { cx: ex, cy: ey, r: 9.5, fill: K('#E8DFC8') }, bob); E('circle', { cx: ex, cy: ey, r: 7, fill: K('#9FCBE0') }, bob); E('circle', { cx: ex - 2.5, cy: ey - 2.5, r: 2.4, fill: '#FFFFFF', 'fill-opacity': .8 }, bob); });
  E('path', { d: 'M0,-96 L72,-104 L74,-97 L4,-92 Z', fill: K('#2E3038') }, bob);
  /* towing hook & bitts at the stern */
  E('path', { d: 'M-98,-36 V-50 M-104,-50 H-92 M-112,-35 V-44', stroke: K('#3A3A40'), 'stroke-width': 3.4, 'stroke-linecap': 'round' }, bob);
  /* smoke */
  const puffs = []; for (let i = 0; i < 7; i++) puffs.push({ g: wldPuff(smokeG, K('#4A4644'), K('#76706A'), K('#363230'), 12), i });
  /* foam */
  const fm = E('path', { stroke: foamC, 'stroke-width': 2.4, 'stroke-opacity': .8, fill: 'none', 'stroke-linecap': 'round' }, root);
  const bw = E('path', { d: 'M88,4 Q110,2 120,-7 Q127,-13 132,-7 Q138,-1 152,3 Q120,7 88,6 Z', fill: foamC, 'fill-opacity': .85 }, root);
  const sw = []; for (let i = 0; i < 5; i++) sw.push(E('ellipse', { rx: 10, ry: 3, fill: foamC, 'fill-opacity': .6 }, root));
  const st = { x: 0, y: 0, s: 1, flip: false, tow: null, speed: 1 };
  let T = 0, M0 = [1, 0, 0, 1, 0, 0];
  const tg = { g: root, root };
  tg.set = function (u) {
    if (u) Object.assign(st, u);
    const fl = st.flip ? -1 : 1;
    tf(root, st.x, st.y, 0, st.s * fl, st.s);
    if (st.tow) {
      const lx = (st.tow[0] - st.x) / (st.s * fl), ly = (st.tow[1] - st.y) / st.s;
      tow.setAttribute('d', `M-98,-48 Q${f2((-98 + lx) / 2)},${f2(Math.max(-48, ly) + 22)} ${f2(lx)},${f2(ly)}`); op(towG, 1);
    } else op(towG, 0);
    tg.anim(T);
  };
  tg.anim = function (at) {
    T = at;
    const b = Math.sin(at * 2.1 + st.x * .01) * 2, r = Math.sin(at * 1.6 + st.x * .02) * 1.8;
    tf(bob, 0, b, r);
    pen.setAttribute('d', `M60,-160 L${f2(38 + Math.sin(at * 7) * 2)},${f2(-154 + Math.sin(at * 6) * 2)} L60,-150 Z`);
    const top = wldMx.ap(wldMx.mul(wldMx.tr(0, b), wldMx.rot(r)), -28, -172);
    puffs.forEach(p => { const ph = (at * .55 + p.i / 7) % 1, pulse = 1 + .35 * Math.max(0, Math.sin(at * 6.2 + p.i * 2.1));
      tf(p.g, top[0] - ph * 120 + Math.sin(at * 1.3 + p.i) * 5, top[1] - Math.pow(ph, .6) * 110, ph * 60, (.4 + ph * 1.5) * pulse);
      op(p.g, Math.min(1, ph * 8) * Math.pow(1 - ph, 1.3) * .95); });
    fm.setAttribute('d', wldFoam(-128, 124, at, 1.6, st.x * .01, 2.5, 8));
    tf(bw, 0, 0, 0, 1, 1 + .15 * Math.sin(at * 3));
    sw.forEach((e, i) => { const q = (at * 1.2 + i / 5) % 1; e.setAttribute('cx', f2(-128 - q * 70)); e.setAttribute('cy', f2(3 + (i % 2) * 3)); e.setAttribute('rx', f2(6 + q * 18)); op(e, (1 - q) * .7); });
  };
  tg.set({});
  return tg;
}

/* =====================================================================
   7) CARPATHIA — single red funnel with black top, four masts, black hull.
   ~700 px long at s=1, bow right, origin = waterline centre.
   cp = Carpathia(parent, {mood}); cp.set({x,y,s,flip,wake,lights,smoke}); cp.anim(at)
   ===================================================================== */
function Carpathia(parent, o = {}) {
  const K = wldTint(o.mood), mood = o.mood || 'day';
  const foamC = mood === 'night' ? '#9AA8D0' : mood === 'dawn' ? '#FFF1EA' : '#FFFFFF';
  const S = x => -50 - 14 * Math.pow(Math.max(0, x / 350), 2) - 8 * Math.pow(Math.max(0, -x / 350), 2);
  const along = (xa, xb, off = 0, step = 14) => { const a = [], n = Math.max(1, Math.ceil((xb - xa) / step)); for (let i = 0; i <= n; i++) { const x = lerp(xa, xb, i / n); a.push([x, S(x) + off]); } return a; };
  const band = (xa, xb, o1, o2) => wldPl(along(xa, xb, o1).concat(along(xa, xb, o2).reverse()), true);
  const line = (xa, xb, off) => wldPl(along(xa, xb, off));
  const root = G(parent);
  const wakeG = G(root), smokeG = G(root);
  const clipG = G(root, { 'clip-path': clipRect(-3000, -5000, 6000, 5001) });
  const P = G(clipG);
  /* masts & rigging */
  const MS = [[262, -238], [-92, -224], [-180, -220], [-268, -214]];
  let rd = `M262,-236 L354,-66 M-268,-212 L-352,-60 `;
  MS.forEach(([mx, top], i) => { if (i < 3) rd += `M${mx},${top + 2} L${MS[i + 1] ? MS[i + 1][0] : mx},${MS[i + 1] ? MS[i + 1][1] + 2 : top} `; [-16, 14].forEach(d => { rd += `M${mx - 4},${top + 30} L${mx + d},${f2(S(mx + d))} `; }); });
  rd += `M262,-236 L80,-140 `;
  E('path', { d: rd, stroke: K('#4E4A44'), 'stroke-width': 1, fill: 'none' }, P);
  MS.forEach(([mx, top], i) => { E('path', { d: `M${mx - 2.6},${f2(S(mx))} L${mx + 2.6},${f2(S(mx))} L${mx - 4 + 1.2},${top} L${mx - 4 - 1.2},${top} Z`, fill: K('#B98E55') }, P);
    if (i < 2) E('rect', { x: mx - 26, y: top + 34, width: 44, height: 3, rx: 1.4, fill: K('#9E7942') }, P); });
  /* funnel */
  const fx = 20, fb = S(fx) - 28, ft = fb - 132, FR2 = -14, FW2 = 21;
  const shf = y => FR2 * (fb - y) / (fb - ft);
  const quad = (l, r, y0, y1) => `M${f2(fx + l + shf(y0))},${f2(y0)} L${f2(fx + r + shf(y0))},${f2(y0)} L${f2(fx + r + shf(y1))},${f2(y1)} L${f2(fx + l + shf(y1))},${f2(y1)} Z`;
  E('path', { d: `M${fx - 60},${f2(fb)} L${f2(fx - FW2 + shf(ft + 40))},${f2(ft + 40)} L${fx + 56},${f2(fb)} M${f2(fx + FW2 + shf(ft + 40))},${f2(ft + 40)} L${fx + 30},${f2(fb)}`, stroke: K('#5E5850'), 'stroke-width': .9, fill: 'none' }, P);
  E('path', { d: quad(-FW2, FW2, fb, ft), fill: K('#D24A2E') }, P);
  E('path', { d: quad(-FW2, -FW2 + 8, fb, ft), fill: K('#E66A48') }, P);
  E('path', { d: quad(FW2 - 10, FW2, fb, ft), fill: K('#A8361F') }, P);
  E('path', { d: quad(-FW2, FW2, ft + 30, ft), fill: K('#1C1C21') }, P);
  E('path', { d: quad(-FW2 - 1.5, FW2 + 1.5, ft + 3, ft - 1.5), fill: K('#28282E') }, P);
  E('path', { d: `M${f2(fx + FW2 + 2 + shf(fb))},${f2(fb)} L${f2(fx + FW2 + 2 + shf(ft + 18))},${f2(ft + 18)}`, stroke: K('#C49752'), 'stroke-width': 2, fill: 'none' }, P);
  /* superstructure */
  E('path', { d: band(-176, 176, 1, -16), fill: K('#ECE8DD') }, P);
  E('path', { d: band(-136, 152, -15, -29), fill: K('#F5F2EA') }, P);
  E('path', { d: band(138, 178, -28, -41), fill: K('#E7E1D3') }, P);
  E('path', { d: band(134, 182, -40, -43), fill: K('#FFFFFF') }, P);
  E('path', { d: band(-176, 176, -1, -3), fill: K('#B9B2A3') }, P);
  E('path', { d: band(-40, 70, -28, -36), fill: K('#E9E4D7') }, P);
  const lights = [];
  const lg = (dark) => { const g2 = G(P, { fill: dark }); lights.push({ g: g2, dark }); return g2; };
  const wl = lg(K('#596072')), wl2 = lg(K('#596072'));
  for (let x = -170, i = 0; x < 170; x += 9, i++) if (hash(i * 2.3) > .2) E('rect', { x, y: f2(S(x) - 11), width: 4.4, height: 5.6, rx: .6 }, i % 2 ? wl : wl2);
  for (let x = -130, i = 0; x < 146; x += 11, i++) E('rect', { x, y: f2(S(x) - 25), width: 6.5, height: 7.5, rx: .8 }, i % 2 ? wl : wl2);
  for (let x = 141, i = 0; x < 174; x += 6, i++) E('rect', { x, y: f2(S(x) - 38), width: 3.4, height: 4 }, wl);
  /* lifeboats */
  [118, 86, 54, -54, -86, -118].forEach(bx => { const y = S(bx) - 31; E('path', { d: `M${bx - 13},${f2(y - 7)} L${bx + 13},${f2(y - 7.4)} Q${bx + 12},${f2(y - 1)} ${bx + 7},${f2(y)} L${bx - 7},${f2(y)} Q${bx - 12},${f2(y - 1)} ${bx - 13},${f2(y - 7)} Z`, fill: K('#F7F4ED') }, P);
    E('rect', { x: bx - 13.5, y: f2(y - 8.6), width: 27, height: 2, rx: 1, fill: K('#A0703F') }, P);
    E('path', { d: `M${bx - 12},${f2(y + 3)} L${bx - 12},${f2(y - 12)} Q${bx - 12},${f2(y - 15)} ${bx - 8},${f2(y - 14)} M${bx + 12},${f2(y + 3)} L${bx + 12},${f2(y - 12)} Q${bx + 12},${f2(y - 15)} ${bx + 8},${f2(y - 14)}`, stroke: K('#D9D4C8'), 'stroke-width': 1.1, fill: 'none' }, P); });
  /* vents */
  [-20, 64, 100, -150].forEach(vx => { const b = S(vx) - 29; E('path', { d: `M${vx - 1.6},${f2(b)} V${f2(b - 6)} Q${vx - 1.6},${f2(b - 10)} ${vx + 3},${f2(b - 10)} L${vx + 4.5},${f2(b - 5.5)} Q${vx + 1.6},${f2(b - 6)} ${vx + 1.6},${f2(b - 4)} V${f2(b)} Z`, fill: K('#E6E1D4') }, P); });
  /* hull */
  const hd = wldPl(along(-344, 348)) + ' L354,-66 L348,6 Q344,30 322,32 L-300,32 Q-338,26 -350,-6 Q-358,-36 -344,' + f2(S(-344)) + ' Z';
  const hcid = uid('cpc'); const hcp = E('clipPath', { id: hcid }, DEFS); E('path', { d: hd }, hcp);
  E('path', { d: hd, fill: K('#1F2129') }, P);
  const hc = G(P, { 'clip-path': 'url(#' + hcid + ')' });
  E('path', { d: band(-360, 360, -4, 9), fill: K('#30333E') }, hc);
  E('rect', { x: -380, y: -18, width: 760, height: 14, fill: '#000', 'fill-opacity': .2 }, hc);
  E('rect', { x: -380, y: -4, width: 760, height: 60, fill: K('#A3302C') }, hc);
  E('rect', { x: -380, y: 10, width: 760, height: 50, fill: K('#7E2328') }, hc);
  let sd = ''; for (let x = -330; x < 350; x += 36) sd += `M${x},${f2(S(x) + 2)} V-5 `; E('path', { d: sd, stroke: '#000', 'stroke-opacity': .16, 'stroke-width': 1 }, hc);
  E('path', { d: line(-346, 350, 2), stroke: K('#D6B458'), 'stroke-width': 1.6, fill: 'none' }, P);
  const hl = lg(K('#3B3F4C')), hl2 = lg(K('#3B3F4C'));
  [[13, -330, 300], [26, -300, 290]].forEach(([off, a, b], r) => { for (let x = a, i = 0; x <= b; x += 10, i++) if (hash(i * 3.7 + r * 9) > .18 && !(x > 250 && x < 316 && r === 0)) E('circle', { cx: x, cy: f2(S(x) + off), r: 1.8 }, (i + r) % 2 ? hl : hl2); });
  const name = TX(P, 283, f2(S(283) + 16), 'CARPATHIA', 8.5, K('#EBD38D'), { a: 'middle', w: 800, ls: 1.4 });
  E('path', { d: line(300, 354, -5), stroke: K('#E2DDD2'), 'stroke-width': .8, fill: 'none' }, P);
  /* smoke + wake */
  const puffs = []; for (let i = 0; i < 14; i++) puffs.push({ g: wldPuff(smokeG, K('#4D4844'), K('#706963'), K('#38332F'), 12), i });
  const bowW = G(wakeG); E('path', { d: 'M-120,3 Q-60,1 -20,-6 Q-4,-15 4,-10 Q10,-4 24,0 Q44,3 60,3 Q20,6 -120,6 Z', fill: foamC, 'fill-opacity': .9 }, bowW);
  const stW = G(wakeG); E('path', { d: 'M4,1 C-100,2 -280,5 -560,8 L-560,20 C-280,14 -100,7 4,5 Z', fill: lgrad([[0, foamC, 0], [1, foamC, .4]], 0, 0, 1, 0) }, stW);
  const trG = lgrad([[0, foamC, 0], [1, foamC, .8]], 0, 0, 1, 0);
  const trail = [[2, 2.6, '36 18 60 24'], [7, 2, '24 22 46 30'], [12, 1.5, '50 26 20 30']].map(([y, wd, da]) => E('path', { d: `M2,${y * .3} C-150,${y * .6} -320,${y} -540,${y * 1.3}`, stroke: trG, 'stroke-width': wd, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': da }, stW));
  const fm = E('path', { stroke: foamC, 'stroke-width': 2, 'stroke-opacity': .75, fill: 'none', 'stroke-linecap': 'round' }, root);
  const st = { x: 0, y: 0, s: 1, flip: false, wake: 0, lights: mood === 'night' ? 1 : mood === 'dawn' ? .6 : 0, smoke: 1 };
  let T = 0;
  const cp = { g: root, root };
  cp.set = function (u) {
    if (u) Object.assign(st, u);
    const fl = st.flip ? -1 : 1;
    tf(root, st.x, st.y, 0, st.s * fl, st.s);
    name.setAttribute('transform', st.flip ? `translate(${283 * 2},0) scale(-1,1)` : '');
    lights.forEach((l, i) => l.g.setAttribute('fill', mix(l.dark, i % 2 ? '#FFD27A' : '#FFE3A0', clamp(st.lights))));
    cp.anim(T);
  };
  cp.anim = function (at) {
    T = at;
    puffs.forEach(p => { const ph = (at * .3 + p.i / 14) % 1;
      tf(p.g, fx + FR2 - ph * 230 + Math.sin(at * 1.2 + p.i) * 6 * ph, ft - 3 - Math.pow(ph, .65) * 120, ph * 50 + p.i * 20, .32 + ph * 1.7);
      op(p.g, clamp(st.smoke) * Math.min(1, ph * 9) * Math.pow(1 - ph, 1.4) * .92); });
    const wk = clamp(st.wake);
    op(bowW, wk); op(stW, wk);
    if (wk > 0) { tf(bowW, 350, 0, 0, .6 + .4 * wk, 1 + .1 * Math.sin(at * 2.4)); tf(stW, -340, 0, 0, .4 + .6 * wk, 1); trail.forEach((t, i) => t.setAttribute('stroke-dashoffset', f2(at * (110 + i * 25)))); }
    fm.setAttribute('d', wldFoam(-342, 352, at, 1.2 + wk, 0, 2.4, 8));
  };
  cp.set({});
  return cp;
}

/* =====================================================================
   8) ROCKET — white socket distress signal. Origin = launch point.
   r = Rocket(parent, {h:380, seed, x, y}); const flash = r.set(p)  (p 0..1; ≤0 or ≥1 hidden)
   Position it with tf(r, x, y) (or o.x/o.y).
   returns a 0..1 flash value the scene can use to light things up.
   ===================================================================== */
function Rocket(parent, o = {}) {
  const H = o.h || 380, seed = o.seed || 1, NSP = 30;
  const dx = (hash(seed * 3.7) - .5) * 50;
  const g = G(parent); if (o.x != null || o.y != null) tf(g, o.x || 0, o.y || 0);
  const smoke = E('path', { fill: 'none', stroke: '#C9CCD6', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
  const trailGlow = E('path', { fill: 'none', stroke: '#FFE7B0', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-opacity': .25 }, g);
  const trail = E('path', { fill: 'none', stroke: '#FFF6DC', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
  const headGlow = E('circle', { r: 14, fill: '#FFF0C0', 'fill-opacity': .35 }, g);
  const head = E('circle', { r: 4.2, fill: '#FFFFFF' }, g);
  const burst = G(g); tf(burst, dx, -H);
  const flashBig = E('circle', { r: 150, fill: rgrad([[0, '#FFFFFF', .5], [.5, '#EAF0FF', .15], [1, '#FFFFFF', 0]]) }, burst);
  const rays = E('path', { stroke: '#FFFFFF', 'stroke-width': 2.4, 'stroke-linecap': 'round', fill: 'none' }, burst);
  const core = E('circle', { r: 10, fill: '#FFFFFF' }, burst);
  const sparks = [];
  for (let i = 0; i < NSP; i++) { const a = i / NSP * Math.PI * 2 + (hash(seed + i * 1.3) - .5) * .3, v = 120 + hash(seed * 2 + i * 2.1) * 110;
    sparks.push({ a, v, tail: E('path', { stroke: '#FFF4D0', 'stroke-width': 1.8, 'stroke-linecap': 'round', fill: 'none' }, burst), dot: E('circle', { r: 2.8, fill: '#FFFFFF' }, burst) }); }
  const pos = u => [dx * u, -H * easeOut(u)];
  const sp = (s, t) => { const k = 1.5, q = (1 - Math.exp(-k * t)) / k; return [Math.cos(s.a) * s.v * q, Math.sin(s.a) * s.v * q + 30 * t * t]; };
  g.set = p => {
    if (!(p > 0 && p < 1)) { op(g, 0); return 0; }
    op(g, 1);
    const RISE = .28, u = clamp(p / RISE);
    const pts = []; for (let i = 0; i <= 8; i++) pts.push(pos(u * i / 8));
    smoke.setAttribute('d', wldPl(pts)); op(smoke, .35 * (1 - clamp((p - RISE) / .5)));
    if (p < RISE) {
      const tp = []; for (let i = 0; i <= 6; i++) tp.push(pos(lerp(Math.max(0, u - .35), u, i / 6)));
      const d = wldPl(tp); trail.setAttribute('d', d); trailGlow.setAttribute('d', d); op(trail, 1); op(trailGlow, 1);
      const hp = pos(u); head.setAttribute('cx', f2(hp[0])); head.setAttribute('cy', f2(hp[1])); headGlow.setAttribute('cx', f2(hp[0])); headGlow.setAttribute('cy', f2(hp[1])); op(head, 1); op(headGlow, 1);
      op(burst, 0);
      return .1;
    }
    op(trail, 0); op(trailGlow, 0); op(head, 0); op(headGlow, 0); op(burst, 1);
    const q = (p - RISE) / (1 - RISE), t = q * 2.8;
    core.setAttribute('r', f2(6 + 26 * easeOut(Math.min(1, q * 8)))); op(core, 1 - clamp(q * 5));
    op(flashBig, 1 - clamp(q * 2.6)); flashBig.setAttribute('r', f2(110 + 80 * easeOut(Math.min(1, q * 4))));
    const L = 30 + 100 * easeOut(Math.min(1, q * 3)); let rd = '';
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + .1; rd += `M${f2(Math.cos(a) * L * .45)},${f2(Math.sin(a) * L * .45)} L${f2(Math.cos(a) * L)},${f2(Math.sin(a) * L)} `; }
    rays.setAttribute('d', rd); op(rays, 1 - clamp(q * 2.6));
    sparks.forEach((s, i) => {
      const a = sp(s, t), b = sp(s, Math.max(0, t - .22)), tw = hash(Math.floor(p * 90) + i * 7.3) > .22 ? 1 : .3;
      s.dot.setAttribute('cx', f2(a[0])); s.dot.setAttribute('cy', f2(a[1])); s.dot.setAttribute('r', f2(2.8 * (1 - q * .6)));
      s.tail.setAttribute('d', `M${f2(b[0])},${f2(b[1])} L${f2(a[0])},${f2(a[1])}`);
      const v = Math.pow(1 - q, 1.2) * tw; op(s.dot, v); op(s.tail, v * .7);
    });
    return Math.max(0, 1 - q * 3);
  };
  g.set(0);
  return g;
}

/* =====================================================================
   9) ICE FLOES — scattered floes bobbing on the sea.
   IceFloes(parent, {x0:-300, w:2200, y:560 (nearest-to-horizon row), y1:900,
                     n:16, mood:'dawn', seed:3, berg:{x,y,s}|null}) · .anim(at)
   ===================================================================== */
function IceFloes(parent, o = {}) {
  const mood = o.mood || 'dawn', seed = o.seed || 3;
  const PAL = { day: ['#FFFFFF', '#CDEBF5', '#8FCBE0', '#E6F6FC'], dawn: ['#FFF5F1', '#D8DCF2', '#9EB2D8', '#FFE3D2'], dusk: ['#F6E3EC', '#B9A9CF', '#7E7AAE', '#FFD2C0'], night: ['#8E9CC2', '#5A6890', '#2E3B62', '#A8B4D6'] }[mood] || ['#FFFFFF', '#CDEBF5', '#8FCBE0', '#E6F6FC'];
  const x0 = o.x0 != null ? o.x0 : -300, w = o.w || 2200, yT = o.y != null ? o.y : 560, yB = o.y1 || 900, n = o.n != null ? o.n : 16;
  const g = G(parent); const fl = [];
  const floeShape = (p, W2, T2, sd) => {
    const pts = []; const N = 11;
    for (let k = 0; k < N; k++) { const a = k / N * Math.PI * 2, r = .78 + hash(sd * 3.1 + k * 1.7) * .32; pts.push([Math.cos(a) * W2 / 2 * r, Math.sin(a) * W2 * .15 * r]); }
    const low = pts.filter(q => q[1] >= 0).sort((a, b) => b[0] - a[0]);
    const xs = pts.map(q => q[0]), L = Math.min(...xs), R = Math.max(...xs);
    const ly = pts[xs.indexOf(L)][1], ry = pts[xs.indexOf(R)][1];
    const front = [[R, ry]].concat(low, [[L, ly]]);
    const under = G(p);
    E('ellipse', { cx: 0, cy: T2 + 8, rx: W2 * .56, ry: W2 * .13, fill: PAL[2], 'fill-opacity': .35 }, under);
    E('ellipse', { cx: 0, cy: T2 + 14, rx: W2 * .4, ry: W2 * .07, fill: PAL[0], 'fill-opacity': .08 }, under);
    E('path', { d: wldPl(front.concat(front.slice().reverse().map(q => [q[0], q[1] + T2])), true), fill: PAL[1] }, p);
    E('path', { d: wldPl(front.slice(Math.floor(front.length / 2)).concat(front.slice(Math.floor(front.length / 2)).reverse().map(q => [q[0], q[1] + T2])), true), fill: PAL[2], 'fill-opacity': .45 }, p);
    E('path', { d: wldPl(pts, true), fill: PAL[0] }, p);
    E('path', { d: `M${f2(-W2 * .3)},${f2(-W2 * .06)} Q${f2(-W2 * .05)},${f2(-W2 * .1)} ${f2(W2 * .18)},${f2(-W2 * .07)}`, stroke: PAL[3], 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .8 }, p);
    if (hash(sd * 5.5) > .55) { const hw = W2 * .32; E('path', { d: `M${f2(-hw)},0 L${f2(-hw * .3)},${f2(-hw * .5)} L${f2(hw * .4)},${f2(-hw * .38)} L${f2(hw)},0 Z`, fill: PAL[0] }, p); E('path', { d: `M${f2(hw * .4)},${f2(-hw * .38)} L${f2(hw)},0 L${f2(hw * .2)},0 Z`, fill: PAL[1] }, p); }
    E('path', { d: wldPl(front.map(q => [q[0], q[1] + T2])), stroke: '#FFFFFF', 'stroke-width': 1.6, 'stroke-opacity': .55, fill: 'none', 'stroke-linecap': 'round' }, p);
  };
  for (let i = 0; i < n; i++) {
    const t = Math.pow(hash(seed * 1.9 + i * 2.37), 1.25), y = lerp(yT, yB, t), sc = lerp(.25, 1.05, t);
    fl.push({ y, sc, x: x0 + hash(seed * 4.1 + i * 3.71) * w, W2: 60 + hash(seed + i * 5.3) * 100, T2: 7 + hash(seed + i * 6.7) * 7, sd: seed + i, ph: hash(i * 8.3) * 6.28, fr: .8 + hash(i * 9.1) * .7 });
  }
  if (o.berg) { const b = o.berg, bg = G(g); tf(bg, b.x, b.y, 0, b.s || 1);
    if (b.reflect !== false) { const rf = G(bg, { opacity: mood === 'night' ? .22 : .14 }); rf.setAttribute('transform', 'scale(1,-.8)');
      E('path', { d: 'M-118,2 L-92,-46 L-70,-40 L-42,-118 L-18,-96 L8,-160 L34,-112 L58,-124 L84,-58 L104,-50 L126,2 Z', fill: PAL[0] }, rf); }
    E('ellipse', { cx: 0, cy: 10, rx: 140, ry: 12, fill: PAL[2], 'fill-opacity': .3 }, bg);
    E('path', { d: 'M-118,2 L-92,-46 L-70,-40 L-42,-118 L-18,-96 L8,-160 L34,-112 L58,-124 L84,-58 L104,-50 L126,2 Z', fill: PAL[0] }, bg);
    E('path', { d: 'M8,-160 L34,-112 L58,-124 L84,-58 L104,-50 L126,2 L30,2 L20,-90 Z', fill: PAL[1] }, bg);
    E('path', { d: 'M-42,-118 L-18,-96 L-30,-40 L-60,2 L-80,2 L-56,-60 Z', fill: PAL[3], 'fill-opacity': .5 }, bg);
    E('path', { d: 'M-118,2 H126', stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-opacity': .5 }, bg);
    fl.berg = bg; }
  fl.sort((a, b) => a.y - b.y).forEach(f => { f.g = G(g); const inner = G(f.g); floeShape(inner, f.W2, f.T2, f.sd); f.inner = inner; });
  g.anim = at => {
    fl.forEach(f => { tf(f.g, f.x + Math.sin(at * .2 + f.ph) * 6 * f.sc, f.y + Math.sin(at * f.fr + f.ph) * 1.8 * f.sc, Math.sin(at * f.fr * .7 + f.ph) * 1.5, f.sc); });
  };
  g.anim(0);
  return g;
}
