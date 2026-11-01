"use strict";
/* =====================================================================
   CAST — the characters of "Titanic, told as a comedy"
   Person(parent, o)   extended Human rig (same .set(st) contract as
                       Human in rigs.js) + Edwardian costumes, hats,
                       beards, instruments, shiver / sweat / blush.
   cast*(parent, …)    ready-made characters (presets → Person)
   Dog(parent, o)      fluffy lapdog (origin at the feet)
   Iceberg(parent, o)  the smug antagonist (origin on the waterline)
   Build once; per frame call .set(st).  No randomness (hash only).
   ===================================================================== */

/* ---------- small geometry helpers (all prefixed cst) ---------- */
function cstCtrl(a, b, bend) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  return [mx - dy / L * bend, my + dx / L * bend];
}
function cstPt(a, c, b, t) { const u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; }
/* draws the piece [t0,t1] of the quadratic a-c-b into el */
function cstSeg(el, a, c, b, t0, t1) {
  const p0 = cstPt(a, c, b, t0), p1 = cstPt(a, c, b, t1);
  const k0 = (1 - t0) * (1 - t1), k1 = (1 - t0) * t1 + t0 * (1 - t1), k2 = t0 * t1;
  const q = [k0 * a[0] + k1 * c[0] + k2 * b[0], k0 * a[1] + k1 * c[1] + k2 * b[1]];
  el.setAttribute('d', `M${f2(p0[0])},${f2(p0[1])} Q${f2(q[0])},${f2(q[1])} ${f2(p1[0])},${f2(p1[1])}`);
}
const cstP = p => f2(p[0]) + ',' + f2(p[1]);

/* outline of a violin-family body standing on y=0, top at y=-L */
function cstViolBody(L, wl, ww, wu) {
  const y = k => f2(-L * k), r = (s, v) => f2(s * v);
  const side = s => s > 0
    ? `C${r(s, wl * .62)},0 ${r(s, wl)},${y(.06)} ${r(s, wl)},${y(.22)} C${r(s, wl)},${y(.36)} ${r(s, ww * 1.22)},${y(.41)} ${r(s, ww)},${y(.5)} C${r(s, ww * 1.22)},${y(.59)} ${r(s, wu)},${y(.62)} ${r(s, wu)},${y(.76)} C${r(s, wu)},${y(.92)} ${r(s, wu * .55)},${y(1)} 0,${y(1)}`
    : `C${r(s, wu * .55)},${y(1)} ${r(s, wu)},${y(.92)} ${r(s, wu)},${y(.76)} C${r(s, wu)},${y(.62)} ${r(s, ww * 1.22)},${y(.59)} ${r(s, ww)},${y(.5)} C${r(s, ww * 1.22)},${y(.41)} ${r(s, wl)},${y(.36)} ${r(s, wl)},${y(.22)} C${r(s, wl)},${y(.06)} ${r(s, wl * .62)},0 0,0`;
  return `M0,0 ${side(1)} ${side(-1)} Z`;
}
/* violin / cello / double bass, drawn along -y (bottom = endpin or chin end) */
function cstFiddle(g, k) {
  const col = k.col, dk = shade(col, -.42), lt = shade(col, .32), L = k.L, pin = k.pin || 0, ww = k.ww;
  const wood = shade(col, -.18), ebony = '#17110F';
  if (pin) { E('rect', { x: -2.2, y: -pin - 4, width: 4.4, height: pin + 4, rx: 2, fill: '#80838F' }, g); E('circle', { cx: 0, cy: -1, r: 2.6, fill: '#5C5F6A' }, g); }
  const b = G(g); tf(b, 0, -pin);
  const top = -(L + k.neck), pbH = Math.max(14, k.neck * .3);
  /* neck, pegbox, scroll */
  E('path', { d: `M${f2(-ww * .2)},${f2(-L * .9)} L${f2(ww * .2)},${f2(-L * .9)} L${f2(ww * .17)},${f2(top)} L${f2(-ww * .17)},${f2(top)} Z`, fill: wood }, b);
  E('rect', { x: -ww * .21, y: top - pbH, width: ww * .42, height: pbH + 2, rx: ww * .08, fill: wood }, b);
  E('rect', { x: -ww * .09, y: top - pbH + 3, width: ww * .18, height: pbH - 4, rx: ww * .05, fill: dk }, b);
  for (let i = 0; i < 2; i++) [-1, 1].forEach(s => E('ellipse', { cx: s * ww * .34, cy: top - pbH * (.25 + i * .45), rx: ww * .17, ry: ww * .075, fill: ebony }, b));
  const sr = ww * .26;
  E('circle', { cx: 0, cy: top - pbH - sr * .7, r: sr, fill: wood }, b);
  E('circle', { cx: sr * .15, cy: top - pbH - sr * .75, r: sr * .55, fill: dk }, b);
  E('circle', { cx: sr * .2, cy: top - pbH - sr * .8, r: sr * .25, fill: wood }, b);
  /* body: dark rim + varnished top + sheen */
  E('path', { d: cstViolBody(L, k.wl, ww, k.wu), fill: dk }, b);
  E('path', { d: cstViolBody(L * .93, k.wl * .9, ww * .84, k.wu * .9), transform: `translate(0,${f2(-L * .035)})`, fill: col }, b);
  E('ellipse', { cx: -k.wl * .42, cy: -L * .2, rx: k.wl * .26, ry: L * .1, fill: lt, 'fill-opacity': .42 }, b);
  E('ellipse', { cx: -k.wu * .42, cy: -L * .77, rx: k.wu * .22, ry: L * .07, fill: lt, 'fill-opacity': .32 }, b);
  E('path', { d: cstViolBody(L * .93, k.wl * .9, ww * .84, k.wu * .9), transform: `translate(${f2(k.wl * .16)},${f2(-L * .035)}) scale(.7,1)`, fill: '#000', 'fill-opacity': .1 }, b);
  /* f-holes */
  const fw = Math.max(1.4, L * .014);
  [-1, 1].forEach(s => {
    E('path', { d: `M${f2(s * ww * .6)},${f2(-L * .35)} c${f2(-s * ww * .28)},${f2(-L * .05)} ${f2(s * ww * .28)},${f2(-L * .14)} 0,${f2(-L * .2)}`, stroke: '#2A120A', 'stroke-width': fw, fill: 'none', 'stroke-linecap': 'round' }, b);
    E('circle', { cx: s * ww * .6, cy: -L * .35, r: fw * 1.1, fill: '#2A120A' }, b); E('circle', { cx: s * ww * .6, cy: -L * .55, r: fw * 1.1, fill: '#2A120A' }, b);
  });
  if (k.chin) E('ellipse', { cx: -k.wl * .3, cy: -L * .07, rx: k.wl * .32, ry: L * .07, fill: ebony }, b);
  /* tailpiece, bridge, fingerboard, strings */
  E('path', { d: `M${f2(-k.wl * .22)},${f2(-L * .04)} L${f2(k.wl * .22)},${f2(-L * .04)} L${f2(ww * .24)},${f2(-L * .3)} L${f2(-ww * .24)},${f2(-L * .3)} Z`, fill: ebony }, b);
  E('path', { d: `M${f2(-ww * .26)},${f2(-L * .52)} L${f2(ww * .26)},${f2(-L * .52)} L${f2(ww * .18)},${f2(top)} L${f2(-ww * .18)},${f2(top)} Z`, fill: ebony }, b);
  E('rect', { x: -ww * .55, y: -L * .455, width: ww * 1.1, height: Math.max(2, L * .022), rx: 1, fill: '#E9CC92' }, b);
  for (let i = 0; i < 4; i++) { const t = (i - 1.5) / 1.5;
    E('path', { d: `M${f2(t * ww * .16)},${f2(-L * .3)} L${f2(t * ww * .1)},${f2(top)}`, stroke: '#EFE6D2', 'stroke-width': Math.max(.7, L * .006), 'stroke-opacity': .85 }, b); }
  return { contact: -pin - L * .49, hold: -pin - L - k.neck * .5, top: top - pin - pbH - sr * 1.7 };
}
function cstBow(g, len) {
  E('path', { d: `M-4,4 L${len - 4},2`, stroke: '#F3EAD3', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
  E('path', { d: `M-10,0 Q${len * .5},3 ${len},0`, stroke: '#5A2E17', 'stroke-width': 3.2, fill: 'none', 'stroke-linecap': 'round' }, g);
  E('rect', { x: -10, y: -1, width: 15, height: 7, rx: 2, fill: '#17110F' }, g);
  E('rect', { x: len - 5, y: -2, width: 7, height: 7, rx: 2, fill: '#EDE4CC' }, g);
}

/* ===================================================================== */
function Person(parent, o = {}) {
  const PAL = {
    suit: ['#34495E', '#DCEBFA', '#2C3040', '#9B2C3C'],
    uniform: ['#1F2B4A', '#F7F4EC', '#1A2238', '#151927'],
    tailcoat: ['#1D1E29', '#FBF8F0', '#1D1E29', '#15151D'],
    waistcoat: ['#5C4636', '#F1ECDF', '#4A4139', '#34557E'],
    shirt: ['#F4F1E8', '#F4F1E8', '#33364A', '#2E3A5E'],
    peacoat: ['#26334F', '#E9E2D2', '#2B2F3F', null],
    stoker: ['#CFC5AF', '#CFC5AF', '#39332F', null],
    bandsman: ['#253360', '#F7F4EC', '#1E2542', '#151927'],
    sailorsuit: ['#F7F5EF', '#F7F5EF', '#24325C', '#C8343F'],
    dress: ['#9E86C4', '#FAF3E6', '#3B2A20', null]
  };
  const coat = o.dress ? 'dress' : (o.coat || 'suit');
  const pal = PAL[coat] || PAL.suit;
  const dress = coat === 'dress';
  const skin = o.skin || '#F1C27D', sd = shade(skin, -.16), sdd = shade(skin, -.32);
  const jacket = o.jacket || pal[0], shirt = o.shirt || pal[1], pants = o.pants || pal[2];
  const tieC = o.tie === false ? null : (o.tie || pal[3] || null);
  const hair = o.hair || '#4A3226', hairD = shade(hair, -.22), hairL = shade(hair, .3);
  const narrow = dress || !!o.narrow;
  const W = narrow ? .88 : (o.wide ? 1.08 : 1);
  const belly = o.belly || 0;
  const shX = narrow ? 41 : (o.wide ? 49 : 46);
  const bare = coat === 'stoker';
  const armC = o.sleeve || (bare ? skin : (coat === 'waistcoat' || coat === 'shirt') ? shirt : jacket);
  const armW = (coat === 'peacoat' || bare) ? 24 : (narrow ? 18 : 21);
  const legW = dress ? 18 : 25;
  const handC = o.gloves || skin, handD = shade(handC, -.15);
  const GOLD = '#E8BD55', GOLDD = '#B78A2E';
  const bot = (coat === 'uniform' || coat === 'peacoat' || coat === 'bandsman') ? -98 : -112;
  const hs = o.hairStyle || 'side';

  const root = G(parent);
  const shadow = E('ellipse', { cx: 0, cy: 3, rx: dress ? 72 : 60, ry: 11, fill: '#000', 'fill-opacity': .22 }, root);
  /* tailcoat tails hang behind the legs */
  const tails = G(root);
  if (coat === 'tailcoat') [-1, 1].forEach(s => {
    E('path', { d: `M${s * 46},-150 Q${s * 54},-90 ${s * 50},-34 L${s * 30},-40 L${s * 8},-128 Z`, fill: shade(jacket, -.12) }, tails);
    E('path', { d: `M${s * 46},-150 Q${s * 54},-90 ${s * 50},-34 L${s * 43},-36 Q${s * 46},-92 ${s * 38},-146 Z`, fill: '#fff', 'fill-opacity': .07 }, tails);
  });
  /* legs */
  const legs = G(root);
  const legL = E('path', { fill: 'none', stroke: pants, 'stroke-width': legW, 'stroke-linecap': 'round' }, legs);
  const legR = E('path', { fill: 'none', stroke: pants, 'stroke-width': legW, 'stroke-linecap': 'round' }, legs);
  const legDeco = [];
  if (o.socks && !dress) [0, 1].forEach(i => legDeco.push({ i, el: E('path', { fill: 'none', stroke: o.socks, 'stroke-width': legW - 4, 'stroke-linecap': 'butt' }, legs), t0: .56, t1: 1 }));
  if (dress) { op(legL, 0); op(legR, 0); }
  const shoeStyle = o.shoe || (dress ? 'lady' : (bare || coat === 'peacoat') ? 'boot' : 'std');
  const shoeC = o.shoes || (dress ? '#2E2224' : '#2F241D');
  const shoe = s => {
    const g = G(legs);
    const d = shoeStyle === 'boot' ? `M${-16 * s},2 Q${-18 * s},-24 ${-2 * s},-26 Q${12 * s},-26 ${13 * s},-15 Q${30 * s},-13 ${31 * s},2 Z`
      : shoeStyle === 'lady' ? `M${-9 * s},2 Q${-11 * s},-12 ${2 * s},-13 Q${18 * s},-11 ${24 * s},2 Z`
      : `M${-14 * s},2 Q${-16 * s},-14 ${4 * s},-14 Q${26 * s},-12 ${28 * s},2 Z`;
    E('path', { d, fill: shoeC }, g);
    E('path', { d: `M${-15 * s},2 L${(shoeStyle === 'boot' ? 31 : 28) * s},2 L${(shoeStyle === 'boot' ? 30 : 27) * s},-2 L${-15 * s},-2 Z`, fill: shade(shoeC, -.35) }, g);
    E('ellipse', { cx: 14 * s, cy: -8, rx: 6, ry: 2.6, fill: '#fff', 'fill-opacity': .16 }, g);
    return g;
  };
  const shL = shoe(-1), shR = shoe(1);

  /* ---------------- upper body ---------------- */
  const up = G(root);
  const torso = G(up);
  const tD = (w, b, y2) => `M${f2(-54 * w)},-236 Q${f2(-58 * w)},-246 ${f2(-38 * w)},-252 L${f2(38 * w)},-252 Q${f2(58 * w)},-246 ${f2(54 * w)},-236 Q${f2((52 + b * 44) * w)},-176 ${f2((48 + b * 12) * w)},${y2} Q0,${y2 + 12} ${f2(-(48 + b * 12) * w)},${y2} Q${f2(-(52 + b * 44) * w)},-176 ${f2(-54 * w)},-236 Z`;
  const baseFill = (coat === 'waistcoat' || coat === 'shirt') ? shirt : bare ? skin : jacket;
  E('path', { d: tD(W, belly, bot), fill: baseFill }, torso);
  const tieAt = (y0 = -246, y1 = -186, c = tieC) => { if (c) E('path', { d: `M-6,${y0} L6,${y0} L10,${y1 - 14} L0,${y1} L-10,${y1 - 14} Z`, fill: c }, torso); if (c) E('path', { d: `M-6,${y0} L6,${y0} L5,${y0 + 8} L-5,${y0 + 8} Z`, fill: shade(c, -.25) }, torso); };
  const collar = () => E('path', { d: 'M-17,-252 L-4,-238 L-14,-232 Z M17,-252 L4,-238 L14,-232 Z', fill: shade(shirt, .5) }, torso);
  const btn = (x, y, r = 3.4, c = shade(jacket, -.35)) => { E('circle', { cx: x, cy: y, r, fill: c }, torso); };
  const gbtn = (x, y, r = 4) => { E('circle', { cx: x, cy: y, r, fill: GOLDD }, torso); E('circle', { cx: x - r * .2, cy: y - r * .2, r: r * .7, fill: GOLD }, torso); E('circle', { cx: x - r * .35, cy: y - r * .35, r: r * .25, fill: '#FFF3C4' }, torso); };
  let trimC = null;
  switch (coat) {
    case 'suit':
      E('path', { d: 'M-17,-252 L0,-200 L17,-252 Z', fill: shirt }, torso);
      [-1, 1].forEach(s => E('path', { d: `M${s * 18},-252 L${s * 1},-201 L${s * 13},-208 L${s * 32},-242 Z`, fill: shade(jacket, -.2) }, torso));
      tieAt(); collar();
      [-150, -128].forEach(y => btn(0, y));
      if (o.pocket) E('path', { d: 'M-40,-214 L-26,-214 L-30,-224 L-34,-218 Z', fill: o.pocket }, torso);
      E('path', { d: 'M-44,-132 L-26,-132', stroke: shade(jacket, -.25), 'stroke-width': 3, 'stroke-linecap': 'round' }, torso);
      break;
    case 'uniform':
      E('path', { d: 'M-14,-252 L0,-212 L14,-252 Z', fill: shirt }, torso);
      tieAt(-248, -208);
      [-1, 1].forEach(s => E('path', { d: `M${s * 15},-252 L${s * 1},-213 L${s * 22},-204 L${s * 36},-240 Z`, fill: shade(jacket, -.24) }, torso));
      collar();
      [-194, -172, -150, -128].forEach(y => { gbtn(-17, y); gbtn(17, y); });
      [-1, 1].forEach(s => E('rect', { x: s > 0 ? 24 : -46, y: -142, width: 22, height: 5, rx: 2, fill: shade(jacket, -.3) }, torso));
      E('path', { d: `M${-48 * W},${bot - 2} Q0,${bot + 10} ${48 * W},${bot - 2}`, stroke: shade(jacket, -.3), 'stroke-width': 3, fill: 'none' }, torso);
      break;
    case 'tailcoat':
      E('path', { d: 'M-24,-252 L24,-252 L30,-154 Q0,-144 -30,-154 Z', fill: '#FFFFFF' }, torso);
      [-1, 1].forEach(s => E('path', { d: `M${s * 28},-246 L${s * 10},-246 Q${s * 5},-200 ${s * 2},-162 L${s * 16},-140 L${s * 32},-158 Z`, fill: '#EEEADB' }, torso));
      [-190, -172].forEach(y => { btn(-9, y, 2.6, '#C9C3B0'); btn(9, y, 2.6, '#C9C3B0'); });
      [-226, -206].forEach(y => btn(0, y, 2.2, '#2B2B35'));
      [-1, 1].forEach(s => E('path', { d: `M${s * 28},-252 L${s * 14},-252 Q${s * 24},-206 ${s * 38},-164 L${s * 48},-170 Q${s * 44},-220 ${s * 28},-252 Z`, fill: '#33354A' }, torso));
      collar();
      { const bt = G(torso); E('path', { d: 'M0,-246 L-15,-254 L-15,-238 Z M0,-246 L15,-254 L15,-238 Z', fill: tieC || '#15151D' }, bt); E('rect', { x: -4, y: -250, width: 8, height: 8, rx: 3, fill: shade(tieC || '#15151D', .15) }, bt); }
      if (o.chain) E('path', { d: 'M-14,-168 Q-22,-156 -30,-164', stroke: GOLD, 'stroke-width': 2, fill: 'none' }, torso);
      break;
    case 'waistcoat': {
      E('path', { d: 'M-30,-246 Q-34,-200 -26,-150 M30,-246 Q34,-200 26,-150', stroke: shade(shirt, -.12), 'stroke-width': 3, fill: 'none' }, torso);
      const vw = jacket;
      E('path', { d: `M${-42 * W},-246 Q-28,-252 -17,-250 L0,-196 L17,-250 Q28,-252 ${42 * W},-246 Q${(50 + belly * 40) * W},-176 ${(47 + belly * 10) * W},-118 L28,-104 L0,-114 L-28,-104 L${-(47 + belly * 10) * W},-118 Q${-(50 + belly * 40) * W},-176 ${-42 * W},-246 Z`, fill: vw }, torso);
      E('path', { d: 'M-17,-250 L0,-196 L17,-250 Z', fill: shirt }, torso);
      tieAt(-246, -196); collar();
      [-186, -168, -150, -132].forEach(y => btn(0, y, 3, shade(vw, -.4)));
      [-1, 1].forEach(s => E('path', { d: `M${s * 18},-150 L${s * 34},-152`, stroke: shade(vw, -.3), 'stroke-width': 3, 'stroke-linecap': 'round' }, torso));
      E('path', { d: 'M0,-150 Q-14,-138 -30,-150', stroke: GOLD, 'stroke-width': 2, fill: 'none' }, torso);
      break; }
    case 'shirt':
      E('path', { d: 'M-30,-244 Q-34,-200 -26,-140 M28,-240 Q30,-200 22,-140', stroke: shade(shirt, -.1), 'stroke-width': 3, fill: 'none' }, torso);
      E('path', { d: `M${-48 * W},-130 L${48 * W},-130 L${48 * W},-112 Q0,-100 ${-48 * W},-112 Z`, fill: pants }, torso);
      tieAt(-246, -184); collar();
      [-1, 1].forEach(s => E('path', { d: `M${s * 26},-252 Q${s * 22},-190 ${s * 18},-128`, stroke: o.braces || '#7A2E35', 'stroke-width': 6, fill: 'none' }, torso));
      [-1, 1].forEach(s => E('rect', { x: s * 18 - 4, y: -136, width: 8, height: 8, rx: 2, fill: '#C9B37A' }, torso));
      break;
    case 'peacoat':
      [-1, 1].forEach(s => E('path', { d: `M${s * 22},-256 L${s * 4},-206 L${s * 30},-194 L${s * 56},-236 Z`, fill: shade(jacket, -.22) }, torso));
      [-1, 1].forEach(s => E('path', { d: `M${s * 4},-206 L${s * 30},-194 L${s * 24},-186 Z`, fill: shade(jacket, -.35) }, torso));
      [-180, -154, -128].forEach(y => [-1, 1].forEach(s => { E('circle', { cx: s * 20, cy: y, r: 5.5, fill: '#121827' }, torso); E('circle', { cx: s * 20 - 1, cy: y - 1, r: 3, fill: '#3A4560' }, torso); }));
      [-1, 1].forEach(s => E('path', { d: `M${s * 34},-150 L${s * 44},-118`, stroke: shade(jacket, -.3), 'stroke-width': 3.5, 'stroke-linecap': 'round' }, torso));
      break;
    case 'stoker': {
      E('path', { d: 'M-24,-246 Q0,-236 24,-246', stroke: sd, 'stroke-width': 2.5, fill: 'none' }, torso);
      E('path', { d: `M${-42 * W},-250 L-26,-250 Q0,-212 26,-250 L${42 * W},-250 Q${46 * W},-200 ${48 * W},-128 L${-48 * W},-128 Q${-46 * W},-200 ${-42 * W},-250 Z`, fill: jacket }, torso);
      E('path', { d: `M${18 * W},-236 Q${44 * W},-200 ${46 * W},-130 L${20 * W},-130 Q${30 * W},-190 ${18 * W},-236 Z`, fill: '#000', 'fill-opacity': .08 }, torso);
      E('path', { d: `M${-48 * W},-132 L${48 * W},-132 L${48 * W},-112 Q0,-100 ${-48 * W},-112 Z`, fill: pants }, torso);
      E('rect', { x: -48 * W, y: -134, width: 96 * W, height: 9, rx: 3, fill: '#4A3426' }, torso);
      E('rect', { x: -7, y: -136, width: 14, height: 13, rx: 2, fill: '#9A8A62' }, torso);
      for (let i = 0; i < 6; i++) E('ellipse', { cx: -36 + hash(i * 5 + (o.seed || 0)) * 72, cy: -228 + hash(i * 7 + 2) * 90, rx: 6 + hash(i + 3) * 9, ry: 4 + hash(i + 8) * 5, fill: '#2B2622', 'fill-opacity': .15 }, torso);
      [-1, 1].forEach(s => E('ellipse', { cx: s * 46, cy: -238, rx: 8, ry: 5, fill: '#2B2622', 'fill-opacity': .18 }, torso));
      break; }
    case 'bandsman':
      E('path', { d: `M0,-252 L0,${bot + 6}`, stroke: GOLD, 'stroke-width': 3 }, torso);
      [-232, -210, -188, -166, -144, -122].forEach(y => gbtn(0, y, 3.4));
      [-1, 1].forEach(s => E('path', { d: `M${s * 22},-250 Q${s * 40},-252 ${s * 52},-238`, stroke: GOLD, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, torso));
      E('path', { d: `M${-48 * W},${bot - 2} Q0,${bot + 10} ${48 * W},${bot - 2}`, stroke: GOLD, 'stroke-width': 2.5, fill: 'none' }, torso);
      [-1, 1].forEach(s => E('rect', { x: s > 0 ? 22 : -44, y: -146, width: 22, height: 4, rx: 2, fill: shade(jacket, -.3) }, torso));
      trimC = GOLD;
      break;
    case 'sailorsuit':
      E('path', { d: 'M-44,-250 L44,-250 L46,-228 L0,-196 L-46,-228 Z', fill: '#24325C' }, torso);
      E('path', { d: 'M-40,-244 L-41,-230 L0,-202 L41,-230 L40,-244', stroke: '#fff', 'stroke-width': 2.5, fill: 'none' }, torso);
      E('path', { d: 'M-16,-252 L0,-214 L16,-252 Z', fill: '#F7F5EF' }, torso);
      E('path', { d: 'M-8,-206 L8,-206 L4,-196 L-4,-196 Z M-4,-198 L-10,-174 L-2,-178 Z M4,-198 L10,-174 L2,-178 Z', fill: tieC || '#C8343F' }, torso);
      E('path', { d: `M${-48 * W},-128 L${48 * W},-128 L${48 * W},-112 Q0,-100 ${-48 * W},-112 Z`, fill: pants }, torso);
      break;
    case 'dress':
      [-1, 1].forEach(s => E('ellipse', { cx: s * 40, cy: -238, rx: 14, ry: 11, fill: shade(jacket, .1) }, torso));
      E('path', { d: 'M-15,-252 L15,-252 L11,-170 L0,-160 L-11,-170 Z', fill: shirt }, torso);
      for (let i = 0; i < 7; i++) [-1, 1].forEach(s => E('circle', { cx: s * 5.5, cy: -244 + i * 11, r: 1.8, fill: shade(shirt, -.14) }, torso));
      E('path', { d: 'M-40,-168 Q0,-162 40,-168 L39,-150 Q0,-144 -39,-150 Z', fill: o.sash || shade(jacket, -.26) }, torso);
      E('path', { d: 'M18,-166 L30,-176 L32,-156 Z M18,-160 L28,-148 L20,-146 Z', fill: shade(o.sash || shade(jacket, -.26), .2) }, torso);
      break;
  }
  if (o.apron) { E('path', { d: 'M-30,-206 L30,-206 L36,-96 Q0,-88 -36,-96 Z', fill: o.apron }, torso); E('path', { d: 'M-30,-206 L-40,-250 M30,-206 L40,-250', stroke: o.apron, 'stroke-width': 5 }, torso); }
  /* soft shading: dark right flank, light left edge */
  E('path', { d: `M${f2(18 * W)},-250 Q${f2(50 * W)},-244 ${f2(52 * W)},-232 Q${f2((50 + belly * 44) * W)},-176 ${f2((46 + belly * 12) * W)},${bot} Q${f2(30 * W)},${bot + 6} ${f2(14 * W)},${bot + 8} Q${f2((26 + belly * 20) * W)},-170 ${f2(18 * W)},-250 Z`, fill: '#000', 'fill-opacity': .12 }, torso);
  E('path', { d: `M${f2(-50 * W)},-238 Q${f2(-(54 + belly * 34) * W)},-180 ${f2(-(46 + belly * 10) * W)},${bot + 3} L${f2(-39 * W)},${bot + 5} Q${f2(-(44 + belly * 26) * W)},-180 ${f2(-41 * W)},-244 Z`, fill: '#fff', 'fill-opacity': .07 }, torso);
  if (o.shawl) {
    const c = o.shawl;
    E('path', { d: 'M-58,-234 Q-62,-254 -36,-258 L36,-258 Q62,-254 58,-234 L54,-186 Q26,-170 6,-204 L0,-190 L-6,-204 Q-26,-170 -54,-186 Z', fill: c }, torso);
    E('path', { d: 'M-50,-240 Q-30,-216 -8,-212 M50,-240 Q30,-216 8,-212', stroke: shade(c, -.18), 'stroke-width': 2.5, fill: 'none' }, torso);
    for (let i = 0; i < 9; i++) [-1, 1].forEach(s => { const t = i / 8, x = s * lerp(54, 8, t), y = lerp(-186, -204, t) + Math.sin(t * Math.PI) * 14; E('path', { d: `M${f2(x)},${f2(y)} l${s * -1},7`, stroke: shade(c, -.25), 'stroke-width': 2, 'stroke-linecap': 'round' }, torso); });
    E('circle', { cx: 0, cy: -198, r: 6, fill: shade(c, -.2) }, torso);
  }
  /* neck + things that wrap the neck */
  E('rect', { x: -13, y: -272, width: 26, height: 26, rx: 8, fill: sd }, torso);
  E('ellipse', { cx: 0, cy: -262, rx: 12, ry: 5, fill: sdd, 'fill-opacity': .35 }, torso);
  if (coat === 'bandsman' || coat === 'uniform' && o.highCollar) { E('path', { d: 'M-17,-268 L17,-268 L19,-250 L-19,-250 Z', fill: jacket }, torso); E('path', { d: 'M-17,-268 L17,-268', stroke: GOLD, 'stroke-width': 2.5 }, torso); [-1, 1].forEach(s => E('circle', { cx: s * 11, cy: -258, r: 3, fill: GOLD }, torso)); }
  if (dress) {
    E('path', { d: 'M-14,-280 L14,-280 L17,-250 L-17,-250 Z', fill: shirt }, torso);
    for (let i = 0; i < 6; i++) E('path', { d: `M${-11 + i * 4.4},-278 L${-12 + i * 4.8},-252`, stroke: shade(shirt, -.1), 'stroke-width': 1.5 }, torso);
    E('ellipse', { cx: 0, cy: -251, rx: 6, ry: 5, fill: GOLDD }, torso); E('ellipse', { cx: 0, cy: -251, rx: 3.6, ry: 3, fill: o.gem || '#C44569' }, torso);
  }
  if (o.pearls) [[13, 32, 18], [17, 50, 26]].forEach(([n, dep, wd]) => { for (let i = 0; i <= n; i++) { const t = i / n, x = lerp(-wd, wd, t), y = -252 + Math.sin(t * Math.PI) * dep; E('circle', { cx: x, cy: y, r: 3, fill: '#F7F2E8' }, torso); E('circle', { cx: x - .9, cy: y - .9, r: 1.1, fill: '#fff' }, torso); } });
  if (coat === 'peacoat') {
    const c = o.scarf || '#B83A3A', c2 = shade(c, -.2);
    E('path', { d: 'M-30,-270 Q0,-254 30,-270 L32,-246 Q0,-230 -32,-246 Z', fill: c }, torso);
    E('path', { d: 'M-30,-258 Q0,-244 31,-258', stroke: c2, 'stroke-width': 2.5, fill: 'none' }, torso);
    E('path', { d: 'M8,-248 L28,-250 L34,-170 L14,-166 Z', fill: c }, torso);
    [-226, -204, -184].forEach(y => E('path', { d: `M${f2(10 + (y + 248) * .07)},${y} L${f2(30 + (y + 250) * .075)},${y - 1}`, stroke: o.scarf2 || c2, 'stroke-width': 5 }, torso));
    for (let i = 0; i < 5; i++) E('path', { d: `M${15 + i * 4.2},-167 l${.5},8`, stroke: c, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, torso);
    E('ellipse', { cx: 12, cy: -248, rx: 10, ry: 8, fill: c2 }, torso);
  }
  if (bare) {
    const c = o.rag || '#8E3B32';
    E('path', { d: 'M-17,-268 Q0,-258 17,-268 L18,-256 Q0,-246 -18,-256 Z', fill: c }, torso);
    E('path', { d: 'M-4,-256 L-12,-236 L-4,-238 Z M2,-256 L8,-234 L0,-238 Z', fill: shade(c, -.15) }, torso);
    E('circle', { cx: -1, cy: -255, r: 5, fill: shade(c, .1) }, torso);
  }

  /* ---------------- skirt (dress) ---------------- */
  let skirt = null;
  if (dress) {
    const sc = o.skirt || jacket;
    const g = G(up);
    skirt = { g, base: E('path', { fill: sc }, g), shade: E('path', { fill: '#000', 'fill-opacity': .13 }, g),
      f1: E('path', { fill: 'none', stroke: shade(sc, -.2), 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-opacity': .8 }, g),
      f2: E('path', { fill: 'none', stroke: shade(sc, -.2), 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-opacity': .8 }, g),
      hl: E('path', { fill: 'none', stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-opacity': .1 }, g),
      trim: E('path', { fill: 'none', stroke: o.trim || shade(sc, -.28), 'stroke-width': 7, 'stroke-linecap': 'round' }, g),
      apron: o.apron ? E('path', { fill: o.apron }, g) : null };
  }

  /* ---------------- head ---------------- */
  const head = G(up);
  const hin = G(head);
  const jaw = o.jaw || 'round';
  const hrx = jaw === 'long' ? 41 : jaw === 'wide' ? 47 : 44, hry = jaw === 'long' ? 53 : 48, hcy = jaw === 'long' ? -304 : -308;
  if (hs === 'long' || hs === 'braids') E('path', { d: 'M-50,-300 Q-60,-350 0,-362 Q60,-350 50,-300 L54,-236 Q0,-226 -54,-236 Z', fill: hairD }, hin);
  [-1, 1].forEach(s => { E('ellipse', { cx: s * (hrx - 1), cy: -304, rx: 9, ry: 12, fill: sd }, hin); E('ellipse', { cx: s * (hrx), cy: -304, rx: 4, ry: 6, fill: sdd, 'fill-opacity': .5 }, hin); });
  E('ellipse', { cx: 0, cy: hcy, rx: hrx, ry: hry, fill: skin }, hin);
  E('path', { d: `M${hrx * .45},${hcy - hry * .9} Q${hrx * 1.08},${hcy - hry * .35} ${hrx * .92},${hcy + hry * .3} Q${hrx * .6},${hcy + hry * .92} ${hrx * .1},${hcy + hry * .98} Q${hrx * .9},${hcy + hry * .2} ${hrx * .45},${hcy - hry * .9} Z`, fill: sd, 'fill-opacity': .55 }, hin);
  E('ellipse', { cx: -hrx * .42, cy: hcy - hry * .5, rx: 13, ry: 7, fill: '#fff', 'fill-opacity': .14, transform: `rotate(-20 ${-hrx * .42} ${hcy - hry * .5})` }, hin);
  /* hair */
  if (hs === 'side') {
    E('path', { d: 'M-46,-306 Q-50,-360 -4,-362 Q42,-362 47,-312 Q44,-330 26,-338 Q8,-334 -12,-340 Q-30,-336 -38,-322 Q-44,-314 -46,-306 Z', fill: hair }, hin);
    E('path', { d: 'M-44,-312 Q-46,-296 -42,-288 L-38,-300 Z M44,-312 Q46,-296 42,-288 L38,-300 Z', fill: hairL }, hin);
    E('path', { d: 'M-30,-350 Q-6,-358 20,-352', stroke: hairL, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .7 }, hin);
  } else if (hs === 'parted') {
    E('path', { d: 'M-46,-300 Q-50,-358 -2,-362 L0,-344 L2,-362 Q50,-358 46,-300 Q42,-330 22,-340 Q8,-338 0,-344 Q-8,-338 -22,-340 Q-42,-330 -46,-300 Z', fill: hair }, hin);
    E('path', { d: 'M-34,-346 Q-18,-356 -6,-354 M34,-346 Q18,-356 6,-354', stroke: hairL, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .7 }, hin);
  } else if (hs === 'bald') {
    E('path', { d: 'M-45,-290 Q-50,-320 -38,-338 Q-30,-326 -36,-312 Q-38,-300 -36,-290 Z M45,-290 Q50,-320 38,-338 Q30,-326 36,-312 Q38,-300 36,-290 Z', fill: mix(hair, skin, .15) }, hin);
    E('path', { d: 'M-40,-334 Q0,-372 40,-334', stroke: hair, 'stroke-width': 2, fill: 'none', 'stroke-opacity': .18 }, hin);
    E('ellipse', { cx: -12, cy: -346, rx: 14, ry: 5, fill: '#fff', 'fill-opacity': .22 }, hin);
  } else if (hs === 'bun') {
    E('circle', { cx: 0, cy: -362, r: 20, fill: hair }, hin);
    E('path', { d: 'M-47,-296 Q-52,-358 0,-360 Q52,-358 47,-296 Q42,-330 0,-336 Q-42,-330 -47,-296 Z', fill: hair }, hin);
  } else if (hs === 'updo') {
    E('path', { d: 'M-50,-298 Q-64,-352 -36,-380 Q0,-400 36,-380 Q64,-352 50,-298 Q46,-326 28,-336 Q0,-344 -28,-336 Q-46,-326 -50,-298 Z', fill: hair }, hin);
    E('circle', { cx: 0, cy: -390, r: 20, fill: hair }, hin);
    E('path', { d: 'M-40,-360 Q-20,-384 6,-382 M14,-386 Q34,-378 44,-354', stroke: hairL, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .7 }, hin);
  } else if (hs === 'long' || hs === 'braids') {
    E('path', { d: 'M-48,-292 Q-58,-360 0,-362 Q58,-360 48,-292 Q44,-330 26,-338 Q0,-332 0,-346 Q0,-332 -26,-338 Q-44,-330 -48,-292 Z', fill: hair }, hin);
    if (hs === 'braids') [-1, 1].forEach(s => { for (let i = 0; i < 5; i++) E('ellipse', { cx: s * (50 + i * .8), cy: -294 + i * 13, rx: 8 - i * .5, ry: 8, fill: i % 2 ? hairD : hair }, hin); E('path', { d: `M${s * 52},-232 l${-s * 8},-6 l0,12 Z M${s * 52},-232 l${s * 8},-6 l0,12 Z`, fill: o.bow || '#E8557A' }, hin); });
  } else if (hs === 'buzz') {
    E('path', { d: 'M-45,-300 Q-48,-358 0,-360 Q48,-358 45,-300 Q42,-334 0,-338 Q-42,-334 -45,-300 Z', fill: hair, 'fill-opacity': .75 }, hin);
    for (let i = 0; i < 26; i++) { const a = Math.PI * (1.1 + .8 * hash(i * 1.7)), r = 30 + hash(i * 2.9) * 14; E('circle', { cx: f2(Math.cos(a) * r), cy: f2(-318 + Math.sin(a) * r), r: 1.2, fill: hairD, 'fill-opacity': .6 }, hin); }
  } else if (hs === 'kid') {
    E('path', { d: 'M-46,-300 Q-48,-362 0,-362 Q48,-362 46,-300 Q36,-332 16,-326 Q20,-342 -2,-334 Q-20,-340 -30,-324 Q-40,-318 -46,-300 Z', fill: hair }, hin);
  } else if (hs === 'curly') {
    for (let i = 0; i < 11; i++) { const a = Math.PI * (1.05 + i * .09); E('circle', { cx: Math.cos(a) * 42, cy: -312 + Math.sin(a) * 46, r: 13, fill: i % 2 ? hair : hairD }, hin); }
  }
  if (o.headscarf) { const c = o.headscarf;
    E('path', { d: 'M-51,-300 Q-56,-372 0,-374 Q56,-372 51,-300 Q50,-272 30,-258 L22,-266 Q40,-286 40,-316 Q34,-340 0,-342 Q-34,-340 -40,-316 Q-40,-286 -22,-266 L-30,-258 Q-50,-272 -51,-300 Z', fill: c }, hin);
    E('path', { d: 'M-40,-316 Q-34,-340 0,-342 Q34,-340 40,-316', stroke: shade(c, -.2), 'stroke-width': 3, fill: 'none' }, hin);
    E('path', { d: 'M-30,-362 Q0,-370 30,-362 M-44,-330 Q-46,-300 -38,-280', stroke: shade(c, .18), 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, hin);
    E('path', { d: 'M-4,-262 L-18,-238 L-8,-240 Z M4,-262 L16,-240 L6,-242 Z', fill: shade(c, -.12) }, hin); E('ellipse', { cx: 0, cy: -261, rx: 8, ry: 6, fill: c }, hin); }
  /* hats */
  const hatG = G(hin);
  const H = o.hat, hatC = o.hatColor;
  const plumes = [];
  if (H === 'captain' || H === 'officer') {
    const c = hatC || '#1A2340', capt = H === 'captain';
    E('path', { d: 'M-46,-350 Q-68,-372 -54,-388 Q0,-404 54,-388 Q68,-372 46,-350 Z', fill: c }, hatG);
    E('path', { d: 'M-50,-386 Q0,-402 50,-386 Q26,-390 0,-391 Q-26,-390 -50,-386 Z', fill: shade(c, .25) }, hatG);
    E('path', { d: 'M22,-394 Q60,-388 60,-372 Q60,-358 46,-350 L30,-350 Q42,-368 22,-394 Z', fill: '#000', 'fill-opacity': .2 }, hatG);
    E('rect', { x: -47, y: -364, width: 94, height: 17, rx: 5, fill: '#0D111D' }, hatG);
    E('path', { d: 'M-46,-353 Q0,-343 46,-353', stroke: capt ? GOLD : '#20263A', 'stroke-width': 3.2, fill: 'none' }, hatG);
    E('path', { d: 'M-47,-352 Q0,-338 47,-352 Q42,-332 0,-326 Q-42,-332 -47,-352 Z', fill: '#0A0D16' }, hatG);
    E('path', { d: 'M-30,-336 Q0,-329 30,-336', stroke: '#fff', 'stroke-opacity': .24, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, hatG);
    if (capt) for (let i = 0; i < 10; i++) { const t = i / 9, x = lerp(-37, 37, t), y = -336 - Math.pow((t - .5) * 2, 2) * 8; E('ellipse', { cx: f2(x), cy: f2(y), rx: 4.2, ry: 2.1, fill: GOLD, transform: `rotate(${f2((t - .5) * 46 + (i % 2 ? 22 : -22))} ${f2(x)} ${f2(y)})` }, hatG); }
    const b = G(hatG); tf(b, 0, -374, 0, capt ? 1 : .8);
    [-1, 1].forEach(s => { for (let i = 0; i < 4; i++) { const a = (200 + i * 30) * Math.PI / 180; E('ellipse', { cx: f2(s * Math.cos(a) * 12), cy: f2(-Math.sin(a) * 10 + 2), rx: 4.4, ry: 2.2, fill: GOLD, transform: `rotate(${s * (60 - i * 30)} ${f2(s * Math.cos(a) * 12)} ${f2(-Math.sin(a) * 10 + 2)})` }, b); } });
    E('ellipse', { cx: 0, cy: 0, rx: 6.5, ry: 8, fill: '#0D111D' }, b);
    E('path', { d: 'M0,-6 L0,5 M-4,-2 L4,-2 M-5,2 Q0,8 5,2', stroke: GOLD, 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }, b);
    E('path', { d: 'M-6,-10 L-3,-15 L0,-11 L3,-15 L6,-10 Z', fill: GOLD }, b);
  } else if (H === 'top') {
    const c = hatC || '#1B1B24';
    E('path', { d: 'M-40,-354 L-45,-456 Q0,-466 45,-456 L40,-354 Z', fill: c }, hatG);
    E('ellipse', { cx: 0, cy: -456, rx: 45, ry: 9, fill: shade(c, .16) }, hatG);
    E('path', { d: 'M14,-462 L37,-457 L33,-356 L14,-354 Z', fill: '#000', 'fill-opacity': .25 }, hatG);
    E('path', { d: 'M-28,-450 L-25,-378', stroke: '#fff', 'stroke-opacity': .17, 'stroke-width': 7, 'stroke-linecap': 'round' }, hatG);
    E('path', { d: 'M-41,-376 L41,-376 L40,-354 L-40,-354 Z', fill: '#2E2E3C' }, hatG);
    E('path', { d: 'M-68,-350 Q-74,-366 -56,-364 Q0,-352 56,-364 Q74,-366 68,-350 Q0,-334 -68,-350 Z', fill: shade(c, -.25) }, hatG);
    E('path', { d: 'M-56,-358 Q0,-348 56,-358', stroke: '#fff', 'stroke-opacity': .14, 'stroke-width': 2.5, fill: 'none' }, hatG);
  } else if (H === 'bowler') {
    const c = hatC || '#22201E';
    E('path', { d: 'M-44,-350 Q-48,-404 0,-406 Q48,-404 44,-350 Z', fill: c }, hatG);
    E('path', { d: 'M12,-402 Q42,-396 44,-352 L26,-352 Q30,-388 12,-402 Z', fill: '#000', 'fill-opacity': .25 }, hatG);
    E('path', { d: 'M-26,-390 Q-14,-400 0,-400', stroke: '#fff', 'stroke-opacity': .2, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, hatG);
    E('path', { d: 'M-44,-364 Q0,-370 44,-364 L44,-352 L-44,-352 Z', fill: shade(c, -.3) }, hatG);
    E('path', { d: 'M-60,-348 Q-66,-360 -52,-358 Q0,-346 52,-358 Q66,-360 60,-348 Q0,-334 -60,-348 Z', fill: shade(c, .08) }, hatG);
  } else if (H === 'feathered') {
    const c = hatC || '#4A2E5C', rib = o.ribbon || '#E58FAE', pl = o.plume || '#FBF6EE';
    const fh = G(hatG, { transform: 'rotate(-8 0 -360)' });
    const pg = G(fh);
    const PP = [[0, 0, 8], [3, -18, 10], [12, -36, 12], [28, -50, 13], [48, -57, 13], [68, -55, 12], [84, -46, 11], [93, -32, 9], [92, -19, 7], [85, -12, 5]];
    [[shade(pl, -.06), 34, 34, .86], [o.plume2 || '#F2C9DA', 16, 12, .95], [pl, 28, -10, 1.05]].forEach(([pc, bx, rot, sc], i) => {
      const p = G(pg); const base = [bx, -398];
      const inner = G(p);
      PP.forEach(([x, y, r]) => E('circle', { cx: x + 2, cy: y + 3.5, r: r + .5, fill: shade(pc, -.2) }, inner));
      PP.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: pc }, inner));
      PP.slice(2, 8).forEach(([x, y, r]) => E('circle', { cx: x - 2, cy: y - 3, r: r * .5, fill: '#fff', 'fill-opacity': .55 }, inner));
      PP.slice(2, 9).forEach(([x, y, r], k) => E('path', { d: `M${f2(x - 2)},${f2(y - r + 2)} q${k < 4 ? -4 : 4},-7 ${k < 4 ? -9 : 7},-8`, stroke: shade(pc, -.1), 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }, inner));
      E('path', { d: 'M0,0 Q4,-30 26,-48 Q56,-62 80,-50', stroke: shade(pc, -.28), 'stroke-width': 1.6, fill: 'none', 'stroke-opacity': .7 }, inner);
      plumes.push({ p, inner, base, rot, sc, ph: i * 1.7 });
    });
    E('path', { d: 'M-122,-360 Q-124,-390 0,-388 Q124,-390 122,-360 Q0,-328 -122,-360 Z', fill: c }, fh);
    E('path', { d: 'M-122,-360 Q0,-328 122,-360 Q112,-348 0,-334 Q-112,-348 -122,-360 Z', fill: shade(c, -.3) }, fh);
    E('path', { d: 'M-110,-368 Q0,-382 110,-368', stroke: shade(c, .2), 'stroke-width': 3, fill: 'none', 'stroke-opacity': .6 }, fh);
    E('path', { d: 'M-50,-378 Q-56,-418 0,-420 Q56,-418 50,-378 Z', fill: shade(c, .12) }, fh);
    E('path', { d: 'M-52,-392 Q0,-400 52,-392 L52,-376 Q0,-384 -52,-376 Z', fill: rib }, fh);
    E('path', { d: 'M18,-414 Q46,-410 50,-380 L34,-380 Q34,-404 18,-414 Z', fill: '#000', 'fill-opacity': .14 }, fh);
    const bowX = -48;
    E('path', { d: `M${bowX},-386 Q${bowX - 30},-410 ${bowX - 26},-380 Z M${bowX},-386 Q${bowX - 34},-376 ${bowX - 18},-366 Z`, fill: shade(rib, -.08) }, fh);
    [[-70, -376], [-86, -372], [-58, -366]].forEach(([x, y], i) => { E('circle', { cx: x, cy: y, r: 9, fill: ['#F0F0F6', '#E8557A', '#F7C9D6'][i] }, fh); E('path', { d: `M${x - 4},${y} q4,-5 8,0 q-4,5 -6,1`, stroke: '#000', 'stroke-opacity': .18, 'stroke-width': 1.6, fill: 'none' }, fh); });
  } else if (H === 'beanie') {
    const c = hatC || '#8E3A3A';
    E('path', { d: 'M-48,-340 Q-54,-402 0,-404 Q54,-402 48,-340 Z', fill: c }, hatG);
    E('path', { d: 'M14,-400 Q48,-392 48,-342 L28,-342 Q32,-380 14,-400 Z', fill: '#000', 'fill-opacity': .16 }, hatG);
    for (let i = -3; i <= 3; i++) E('path', { d: `M${i * 12},-352 Q${i * 14},-380 ${i * 6},-400`, stroke: shade(c, -.15), 'stroke-width': 2, fill: 'none', 'stroke-opacity': .6 }, hatG);
    E('rect', { x: -51, y: -356, width: 102, height: 24, rx: 10, fill: shade(c, -.1) }, hatG);
    for (let i = 0; i < 14; i++) E('path', { d: `M${-46 + i * 7},-353 L${-46 + i * 7},-335`, stroke: shade(c, -.28), 'stroke-width': 2, 'stroke-opacity': .55 }, hatG);
  } else if (H === 'sailor') {
    const c = hatC || '#1D2842';
    E('rect', { x: -46, y: -366, width: 92, height: 26, rx: 6, fill: shade(c, -.1) }, hatG);
    E('rect', { x: -46, y: -362, width: 92, height: 10, fill: '#0C0F18' }, hatG);
    E('ellipse', { cx: 4, cy: -370, rx: 60, ry: 15, fill: c }, hatG);
    E('ellipse', { cx: -4, cy: -374, rx: 44, ry: 8, fill: shade(c, .18) }, hatG);
    E('path', { d: 'M40,-356 l14,22 l-8,2 Z M44,-356 l2,26 l-6,-2 Z', fill: '#0C0F18' }, hatG);
  } else if (H === 'flatcap') {
    const c = hatC || '#7A6A55';
    E('path', { d: 'M-49,-338 Q-56,-364 -30,-374 Q4,-382 40,-372 Q60,-364 54,-344 Q50,-336 40,-336 Z', fill: c }, hatG);
    E('path', { d: 'M-30,-374 Q4,-382 40,-372 Q20,-364 -6,-364 Q-22,-366 -30,-374 Z', fill: shade(c, .24) }, hatG);
    E('path', { d: 'M-40,-352 Q0,-366 44,-352', stroke: shade(c, -.2), 'stroke-width': 2, fill: 'none', 'stroke-opacity': .6 }, hatG);
    for (let i = 0; i < 22; i++) E('rect', { x: -42 + hash(i * 3.1) * 88, y: -372 + hash(i * 5.7) * 30, width: 3, height: 3, fill: shade(c, hash(i) > .5 ? .22 : -.25), 'fill-opacity': .55 }, hatG);
    E('path', { d: 'M18,-374 Q58,-366 54,-344 L36,-340 Q40,-360 18,-374 Z', fill: '#000', 'fill-opacity': .15 }, hatG);
    E('path', { d: 'M-46,-344 Q0,-334 48,-344 Q44,-324 0,-320 Q-40,-324 -46,-344 Z', fill: shade(c, -.38) }, hatG);
    E('path', { d: 'M-30,-330 Q0,-324 30,-330', stroke: '#fff', 'stroke-opacity': .12, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, hatG);
    E('path', { d: 'M-46,-344 Q0,-334 48,-344', stroke: shade(c, -.35), 'stroke-width': 2, fill: 'none' }, hatG);
  } else if (H === 'headphones') {
    E('path', { d: 'M-50,-300 Q-60,-384 0,-388 Q60,-384 50,-300', stroke: '#4A4E5C', 'stroke-width': 6, fill: 'none' }, hatG);
    E('path', { d: 'M-40,-352 Q-20,-380 0,-381', stroke: '#9AA0AE', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, hatG);
    [-1, 1].forEach(s => {
      E('path', { d: `M${s * 50},-290 Q${s * 60},-262 ${s * 40},-240`, stroke: '#3A2E26', 'stroke-width': 2.5, fill: 'none' }, hatG);
      E('circle', { cx: s * 51, cy: -304, r: 17, fill: '#9BA2B0' }, hatG); E('circle', { cx: s * 52, cy: -304, r: 13, fill: '#1F1F27' }, hatG);
      E('circle', { cx: s * 52, cy: -304, r: 4, fill: '#3A3A46' }, hatG); E('path', { d: `M${s * 44},-314 q${s * 6},-4 ${s * 12},0`, stroke: '#fff', 'stroke-opacity': .35, 'stroke-width': 2, fill: 'none' }, hatG);
    });
  }
  if (o.bow && hs !== 'braids') { const b = G(hatG); tf(b, 30, -350, 20); E('path', { d: 'M0,0 Q-22,-16 -20,8 Z M0,0 Q22,-16 20,8 Z', fill: o.bow }, b); E('circle', { r: 5, fill: shade(o.bow, -.2) }, b); }
  if (o.pencil) { const p = G(hin); tf(p, 46, -326, 58); E('rect', { x: -22, y: -3.5, width: 40, height: 7, rx: 1, fill: '#F2C14E' }, p); E('rect', { x: -22, y: -3.5, width: 40, height: 2.4, fill: '#D9A12E' }, p); E('path', { d: 'M18,-3.5 L28,0 L18,3.5 Z', fill: '#E9CFA0' }, p); E('path', { d: 'M25,-1 L28,0 L25,1 Z', fill: '#333' }, p); E('rect', { x: -28, y: -3.5, width: 7, height: 7, rx: 2, fill: '#E88A9A' }, p); }

  /* ---------------- face ---------------- */
  const face = G(hin);
  if (o.soot) [[-26, -290, 9, 5], [22, -334, 11, 4], [28, -282, 6, 4], [-8, -318, 5, 3]].forEach(([x, y, rx, ry]) => E('ellipse', { cx: x, cy: y, rx, ry, fill: '#2B2622', 'fill-opacity': .3 }, face));
  if (o.beard === 'stubble') {
    E('path', { d: 'M-42,-298 C-44,-268 -26,-256 0,-255 C26,-256 44,-268 42,-298 C36,-284 26,-276 14,-270 Q0,-266 -14,-270 C-26,-276 -36,-284 -42,-298 Z', fill: hairD, 'fill-opacity': .22 }, face);
    for (let i = 0; i < 22; i++) { const a = Math.PI * (.08 + .84 * hash(i * 2.3)), r = 30 + hash(i * 4.1) * 10; E('circle', { cx: f2(-Math.cos(a) * r), cy: f2(-282 + Math.sin(a) * r * .55), r: 1.1, fill: hairD, 'fill-opacity': .5 }, face); }
  }
  if (o.old) E('path', { d: 'M-14,-338 Q0,-342 14,-338 M-10,-332 Q0,-335 10,-332 M27,-307 l7,-3 M27,-301 l7,1 M-27,-307 l-7,-3 M-27,-301 l-7,1', stroke: sd, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, face);
  const blush = G(face); [-1, 1].forEach(s => E('ellipse', { cx: s * 25, cy: -290, rx: 9, ry: 5, fill: '#FF8A80', 'fill-opacity': .45 }, blush));
  const blush2 = G(face); [-1, 1].forEach(s => { E('ellipse', { cx: s * 26, cy: -289, rx: 12, ry: 6.5, fill: '#FF5F72', 'fill-opacity': .5 }, blush2); E('path', { d: `M${s * 20},-292 l3,-5 M${s * 26},-292 l3,-5 M${s * 32},-292 l3,-5`, stroke: '#E0435A', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-opacity': .7 }, blush2); });
  if (o.rosy) [-1, 1].forEach(s => E('ellipse', { cx: s * 26, cy: -289, rx: 10, ry: 6, fill: '#FF6F7D', 'fill-opacity': .4 }, face));
  const eyes = [-1, 1].map(s => {
    const g = G(face);
    const white = E('ellipse', { rx: 8, ry: 9.5, fill: '#FFFFFF' }, g);
    const pup = G(g); E('ellipse', { rx: 5.2, ry: 6.8, fill: '#2A1E1A' }, pup); E('circle', { cx: 1.8, cy: -2.5, r: 1.8, fill: '#fff' }, pup);
    const lid = E('rect', { x: -9, y: -11, width: 18, height: 0, fill: skin }, g);
    const lash = E('rect', { x: -7, y: -11, width: 14, height: 2.2, rx: 1, fill: '#2A1E1A' }, g);
    return { g, s, white, pup, lid, lash };
  });
  const hapEyes = G(face); [-1, 1].forEach(s => E('path', { d: `M${s * 15 - 7},-302 Q${s * 15},-311 ${s * 15 + 7},-302`, stroke: '#2A1E1A', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, hapEyes));
  const browC = o.browColor || shade(hair, -.1), browW = o.brows === 'bushy' ? 6.5 : 4.5;
  const brows = [-1, 1].map(s => E('path', { d: o.brows === 'bushy' ? 'M-10,1 Q0,-6 10,0' : 'M-8,0 Q0,-4 8,0', stroke: browC, 'stroke-width': browW, fill: 'none', 'stroke-linecap': 'round' }, face));
  if (o.beard === 'white' || o.beard === 'grey' || o.beard === 'full') {
    const bc = o.beardColor || (o.beard === 'white' ? '#F1EFE9' : o.beard === 'grey' ? '#A9A6A0' : hair), bd = shade(bc, -.14);
    if (o.beard === 'grey') E('path', { d: 'M-42,-298 C-43,-262 -26,-240 0,-238 C26,-240 43,-262 42,-298 L37,-293 C33,-278 22,-268 12,-266 Q0,-262 -12,-266 C-22,-268 -33,-278 -37,-293 Z', fill: bc }, face);
    else E('path', { d: 'M-44,-304 C-48,-256 -30,-228 0,-224 C30,-228 48,-256 44,-304 L38,-298 C35,-284 26,-272 14,-266 Q0,-261 -14,-266 C-26,-272 -35,-284 -38,-298 Z', fill: bc }, face);
    E('path', { d: o.beard === 'grey' ? 'M8,-244 C26,-246 38,-262 40,-286 C34,-266 24,-256 8,-252 Z' : 'M8,-230 C28,-232 44,-254 42,-290 C36,-264 26,-246 8,-240 Z', fill: bd }, face);
    E('path', { d: 'M-20,-254 l4,6 M-6,-246 l2,7 M10,-248 l-2,7 M24,-256 l-4,6', stroke: bd, 'stroke-width': 2, 'stroke-linecap': 'round' }, face);
  }
  const mouth = E('path', { stroke: '#7A3B2E', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, face);
  const teeth = G(face);
  const tTop = E('rect', { x: -9, y: -277, width: 18, height: 4.2, rx: 1.5, fill: '#FFFFFF' }, teeth);
  const tBot = E('rect', { x: -9, y: -273, width: 18, height: 4.2, rx: 1.5, fill: '#F2EEE6' }, teeth);
  const mst = o.mustache;
  const mC = (o.beard === 'white' || o.beard === 'grey') ? (o.beardColor || (o.beard === 'white' ? '#F1EFE9' : '#A9A6A0')) : (o.mustacheColor || hair);
  if (mst === 'walrus' || (mst == null && o.beard === 'white')) {
    E('path', { d: 'M-24,-273 Q-28,-292 -10,-294 Q0,-290 10,-294 Q28,-292 24,-273 Q18,-281 12,-277 Q7,-283 2,-279 Q0,-282 -2,-279 Q-7,-283 -12,-277 Q-18,-281 -24,-273 Z', fill: mC }, face);
    E('path', { d: 'M4,-291 Q16,-293 21,-280', stroke: shade(mC, -.16), 'stroke-width': 2.5, fill: 'none' }, face);
  } else if (mst === 'handlebar') {
    E('path', { d: 'M0,-282 Q-12,-290 -22,-283 Q-29,-279 -31,-287 Q-32,-293 -26,-294 Q-30,-288 -25,-285 Q-14,-279 0,-279 Q14,-279 25,-285 Q30,-288 26,-294 Q32,-293 31,-287 Q29,-279 22,-283 Q12,-290 0,-282 Z', fill: mC }, face);
  } else if (mst || (mst == null && o.beard === 'grey')) {
    E('path', { d: 'M-16,-278 Q-8,-286 0,-281 Q8,-286 16,-278 Q8,-276 0,-279 Q-8,-276 -16,-278 Z', fill: mC }, face);
  }
  const nose = o.nose || 'line';
  if (nose === 'line') E('path', { d: 'M1,-300 Q7,-288 0,-285', stroke: sd, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, face);
  else { const r = nose === 'big' ? 9 : 6.5; E('ellipse', { cx: 2, cy: -290, rx: r, ry: r * .85, fill: sd }, face); E('ellipse', { cx: 0, cy: -293, rx: r * .4, ry: r * .3, fill: '#fff', 'fill-opacity': .25 }, face); }
  if (o.rosy) E('ellipse', { cx: 2, cy: -288, rx: 6.5, ry: 5.5, fill: '#E8616B', 'fill-opacity': .75 }, face);
  if (o.glasses) { const gl = G(face); [-1, 1].forEach(s => E('circle', { cx: s * 15, cy: -303, r: 11.5, fill: '#fff', 'fill-opacity': .16, stroke: '#3A332C', 'stroke-width': 2.6 }, gl)); E('path', { d: 'M-4,-305 Q0,-309 4,-305 M-26,-305 L-40,-309 M26,-305 L40,-309', stroke: '#3A332C', 'stroke-width': 2.4, fill: 'none' }, gl); [-1, 1].forEach(s => E('path', { d: `M${s * 15 - 6},-309 q3,-3 7,-3`, stroke: '#fff', 'stroke-width': 2, 'stroke-opacity': .6, fill: 'none', 'stroke-linecap': 'round' }, gl)); }
  /* sweat drops */
  const sweatG = G(head);
  const drops = [[38, -340, 0], [-40, -330, .45], [46, -316, .72]].map(([x, y, ph]) => { const g = G(sweatG); E('path', { d: 'M0,-9 Q7,0 5,4 Q0,9 -5,4 Q-7,0 0,-9 Z', fill: '#9FD8FF' }, g); E('ellipse', { cx: -1.6, cy: 1, rx: 1.6, ry: 2.4, fill: '#fff', 'fill-opacity': .85 }, g); return { g, x, y, ph }; });

  /* ---------------- instrument (between head and arms) ---------------- */
  let inst = null;
  if (o.instrument) {
    const SP = {
      violin: { L: 80, wl: 24, ww: 14, wu: 19.5, neck: 38, pin: 0, px: 10, py: -252, rot: 114, col: '#B4592A', bow: 150, bang: -26, dmin: 52, dmax: 128, floor: false, chin: true },
      cello: { L: 142, wl: 42, ww: 27, wu: 36, neck: 64, pin: 50, px: -14, py: 0, rot: -20, col: '#9C4A22', bow: 140, dmin: 55, dmax: 122, floor: true },
      bass: { L: 196, wl: 56, ww: 37, wu: 46, neck: 104, pin: 18, px: -30, py: 0, rot: -10, col: '#7E3C1E', bow: 128, dmin: 50, dmax: 108, floor: true }
    };
    const k = SP[o.instrument] || SP.violin;
    const ig = G(up), pg = G(ig); tf(pg, k.px, k.py, k.rot);
    const geo = cstFiddle(pg, k);
    const r = k.rot * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
    const toP = ly => [k.px - ly * sn, k.py + ly * cs];
    const bang = k.floor ? k.rot + 180 : k.bang;
    inst = { k, ig, contact: toP(geo.contact), hold: toP(geo.hold), bang, violin: !k.floor };
    if (inst.violin) { inst.hold[1] += 7; }
  }

  /* ---------------- arms ---------------- */
  const mkArm = i => {
    const el = E('path', { fill: 'none', stroke: armC, 'stroke-width': armW, 'stroke-linecap': 'round' }, up);
    const deco = [];
    const add = (c, t0, t1, w = armW + 1, cap = 'butt', opa = 1) => deco.push({ el: E('path', { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': cap, 'stroke-opacity': opa }, up), t0, t1 });
    if (coat === 'uniform') { const n = o.stripes != null ? o.stripes : 2; for (let j = 0; j < n; j++) add(GOLD, .82 - j * .055, .85 - j * .055, armW + 1); add(shirt, .9, .96, armW - 3); }
    else if (coat === 'bandsman') { add(GOLD, .8, .835); add(shirt, .9, .96, armW - 3); }
    else if (coat === 'tailcoat' || coat === 'suit') add(shirt, .88, .95, armW - 3);
    else if (coat === 'peacoat') add(shade(jacket, -.2), .8, .9, armW + 1);
    else if (coat === 'waistcoat' || o.rolled) { add(skin, .56, 1, armW - 4, 'round'); add(shade(shirt, .2), .5, .6, armW + 4); add(shade(shirt, -.12), .58, .61, armW + 4); }
    else if (coat === 'shirt') { add('#3A3A46', .3, .36, armW + 1); add(shade(shirt, -.08), .88, .96, armW + 1); }
    else if (coat === 'sailorsuit') { add('#24325C', .82, .9, armW + 1); add('#fff', .85, .865, armW + 1.5); }
    else if (bare) add('#fff', .12, .4, 6, 'round', .2);
    if (dress) { if (o.gloves) add(o.gloves, .5, 1, armW - 1, 'round'); else add(shirt, .88, .95, armW + 2); }
    return { el, deco };
  };
  const arms = [mkArm(0), mkArm(1)];
  /* bow (for string players) */
  let bowG = null;
  if (inst) { bowG = G(up); cstBow(bowG, inst.k.bow); }
  const mkHand = () => {
    const h = G(up); const back = G(h); const hi = G(h);
    E('circle', { r: 12.5, fill: handC }, hi);
    E('ellipse', { cx: -9, cy: -6, rx: 5, ry: 6.5, fill: handC }, hi);
    E('path', { d: 'M-7,7 Q2,12 10,5', stroke: handD, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }, hi);
    if (o.soot) E('ellipse', { cx: 3, cy: 2, rx: 7, ry: 5, fill: '#2A2420', 'fill-opacity': .28 }, hi);
    const prop = G(h); return { h, hi, prop, back };
  };
  const hL = mkHand(), hR = mkHand();
  /* shiver marks */
  const shiverG = G(up);
  [-1, 1].forEach(s => [0, 1].forEach(k => E('path', { d: `M${s * (70 + k * 10)},${-262 + k * 8} q${s * 7},13 0,26`, stroke: '#D6EEFF', 'stroke-width': 3.2, fill: 'none', 'stroke-linecap': 'round' }, shiverG)));

  const R = { root, up, head, torso, propL: hL.prop, propR: hR.prop, propBackL: hL.back, propBackR: hR.back, handL: hL.h, handR: hR.h, opts: o };

  R.set = function (st) {
    const at = st.at || 0;
    const s = (st.s != null ? st.s : (o.scale || 1)) * (o.size || 1);
    const shv = clamp(st.shiver || 0), pl = inst ? clamp(st.play || 0) : 0;
    tf(root, st.x || 0, st.y || 0, st.rot || 0, s * (st.flip ? -1 : 1), s);
    const bob = st.bob || 0;
    const jx = shv ? (Math.sin(at * 61) * 1.7 + Math.sin(at * 43 + 1) * 1.1) * shv : 0;
    const tilt = (st.tilt || 0) + (shv ? Math.sin(at * 53) * 1.1 * shv : 0) + (pl ? Math.sin(at * 1.7) * 2.2 * pl : 0);
    up.setAttribute('transform', `translate(${f2(jx)},${f2(bob)}) rotate(${f2(tilt)} 0 -112)`);
    tf(tails, jx, bob);
    const th = tilt * Math.PI / 180, ct = Math.cos(th), stt = Math.sin(th);
    const inv = (p) => { const x = p[0] - jx, y = p[1] - bob + 112; return [x * ct + y * stt, -x * stt + y * ct - 112]; };
    /* legs */
    const fL = st.fL || [-22, 0], fR = st.fR || [22, 0];
    const hipL = [-18 + jx, -112 + bob], hipR = [18 + jx, -112 + bob];
    let kL, kR, eL, eR;
    if (st.sit) { eL = [-28, -40]; eR = [28, -40]; kL = cstCtrl(hipL, eL, -10); kR = cstCtrl(hipR, eR, 10); tf(shL, -28, -30); tf(shR, 28, -30); }
    else { eL = [fL[0], fL[1] - 10]; eR = [fR[0], fR[1] - 10]; kL = cstCtrl(hipL, eL, -6); kR = cstCtrl(hipR, eR, 6); tf(shL, fL[0], fL[1]); tf(shR, fR[0], fR[1]); }
    if (!dress) {
      legL.setAttribute('d', `M${cstP(hipL)} Q${cstP(kL)} ${cstP(eL)}`); legR.setAttribute('d', `M${cstP(hipR)} Q${cstP(kR)} ${cstP(eR)}`);
      legDeco.forEach(d => d.i ? cstSeg(d.el, hipR, kR, eR, d.t0, d.t1) : cstSeg(d.el, hipL, kL, eL, d.t0, d.t1));
    }
    op(legs, st.noLegs ? 0 : 1); op(shadow, st.noLegs ? 0 : 1); op(tails, st.noLegs ? 0 : 1);
    /* skirt */
    if (skirt) {
      op(skirt.g, st.noLegs ? 0 : 1);
      if (!st.noLegs) {
        const sw = st.sit ? 0 : ((fL[0] + 22) - (fR[0] - 22)) * .2 + ((fL[0] + fR[0]) / 2) * .55;
        const hy = st.sit ? -32 : -9;
        const lL = st.sit ? 0 : -fL[1] * .5, lR = st.sit ? 0 : -fR[1] * .5;
        const hemL = inv([-66 + sw, hy - lL]), hemR = inv([66 + sw, hy - lR]), hemM = inv([sw * 1.3, hy + 3]);
        const wv = Math.sin(at * 2.1) * 1.5 + sw * .35;
        const qL = [(hemL[0] + hemM[0]) / 2, hemM[1] + 3 + wv], qR = [(hemR[0] + hemM[0]) / 2, hemM[1] + 3 - wv];
        const sideL = `C-50,-128 ${f2(hemL[0] + 8)},${f2(hemL[1] - 60)} ${cstP(hemL)}`, sideR = `C${f2(hemR[0] - 8)},${f2(hemR[1] - 60)} 50,-128 38,-158`;
        const bottom = `Q${cstP(qL)} ${cstP(hemM)} Q${cstP(qR)} ${cstP(hemR)}`;
        skirt.base.setAttribute('d', `M-38,-158 ${sideL} ${bottom} ${sideR} Z`);
        const mR = [lerp(hemM[0], hemR[0], .42), lerp(hemM[1], hemR[1], .42) + 2];
        skirt.shade.setAttribute('d', `M12,-158 L38,-158 C50,-128 ${f2(hemR[0] - 8)},${f2(hemR[1] - 60)} ${cstP(hemR)} Q${cstP(qR)} ${cstP(mR)} Q${f2(22 + sw * .5)},-80 12,-158 Z`);
        const o9 = p => [p[0], p[1] - 9];
        skirt.trim.setAttribute('d', `M${cstP(o9([hemL[0] + 3, hemL[1]]))} Q${cstP(o9(qL))} ${cstP(o9(hemM))} Q${cstP(o9(qR))} ${cstP(o9([hemR[0] - 3, hemR[1]]))}`);
        const mL = [lerp(hemL[0], hemM[0], .55), lerp(hemL[1], hemM[1], .55) - 4], mR2 = [lerp(hemM[0], hemR[0], .45), lerp(hemM[1], hemR[1], .45) - 4];
        skirt.f1.setAttribute('d', `M-14,-150 Q${f2(-24 + sw * .45)},-80 ${cstP(mL)}`);
        skirt.f2.setAttribute('d', `M14,-150 Q${f2(22 + sw * .45)},-80 ${cstP(mR2)}`);
        if (skirt.apron) { const aL = [lerp(hemL[0], hemM[0], .45), lerp(hemL[1], hemM[1], .45) - 22], aR = [lerp(hemM[0], hemR[0], .55), lerp(hemM[1], hemR[1], .55) - 22]; skirt.apron.setAttribute('d', `M-26,-160 L26,-160 Q34,-100 ${cstP(aR)} Q${f2((aL[0] + aR[0]) / 2)},${f2(aL[1] + 8)} ${cstP(aL)} Q-34,-100 -26,-160 Z`); }
        skirt.hl.setAttribute('d', `M-30,-146 Q${f2(-44 + sw * .4)},-90 ${f2(hemL[0] + 14)},${f2(hemL[1] - 16)}`);
      }
    }
    /* head */
    const hsc = o.headScale || 1;
    let ht = st.headTilt != null ? st.headTilt : (inst ? (inst.violin ? 10 : 0) + Math.sin(at * 1.7 + .6) * 3 * pl : 0);
    head.setAttribute('transform', `translate(${f2(st.hx || 0)},${f2(st.hy || 0)}) rotate(${f2(ht)} 0 -262)` + (hsc !== 1 ? ` translate(0,-262) scale(${hsc}) translate(0,262)` : ''));
    const lk = st.look || [0, 0], turn = st.turn || 0;
    tf(face, turn * 9 + lk[0] * 2, lk[1] * 2);
    tf(hatG, turn * 3, 0);
    const ex = st.face || 'neutral', bl = blink(at, o.seed || 3);
    let mouthD = 'M-11,-276 Q0,-268 11,-276', bY = -323, bR = 0, hap = 0, eyeY = 1, bl2 = 0, lid = 0, wide = 0, teethOn = 0, bLy = 0, bLr = 0, chat = 0;
    switch (ex) {
      case 'happy': mouthD = 'M-14,-279 Q0,-264 14,-279 Z'; bY = -327; bl2 = 1; break;
      case 'joy': hap = 1; mouthD = 'M-15,-280 Q0,-260 15,-280 Z'; bY = -329; bl2 = 1; break;
      case 'surprise': mouthD = 'M-6,-276 Q0,-264 6,-276 Q0,-284 -6,-276 Z'; bY = -331; eyeY = 1.2; break;
      case 'think': mouthD = 'M-9,-274 Q2,-274 10,-279'; bY = -325; bR = -10; break;
      case 'focus': mouthD = 'M-9,-274 L9,-274'; bY = -320; bR = 10; eyeY = .8; lid = .25; break;
      case 'worried': mouthD = 'M-10,-272 Q0,-279 10,-272'; bR = -14; bY = -325; break;
      case 'proud': mouthD = 'M-13,-278 Q0,-266 13,-278'; bl2 = .7; lid = .3; break;
      case 'scared': mouthD = 'M-12,-273 Q0,-283 12,-273 Q12,-262 0,-262 Q-12,-262 -12,-273 Z'; bY = -333; bR = -17; eyeY = 1.1; wide = 1; teethOn = 1; break;
      case 'smug': mouthD = 'M-12,-275 Q3,-270 14,-283'; lid = .52; bY = -322; bLy = -7; bLr = 8; bl2 = .35; break;
    }
    if (shv > .05 && !st.talk) { chat = Math.sin(at * 44) > 0 ? 1 : 0; mouthD = `M-11,-278 L11,-278 L11,${-269 + chat * 2.5} L-11,${-269 + chat * 2.5} Z`; teethOn = 1; }
    if (st.talk) { const m = .5 + .5 * Math.abs(Math.sin(at * 12) * Math.sin(at * 4.7 + 1)); mouthD = `M-10,-276 Q0,${f2(-276 + 13 * m)} 10,-276 Q0,${f2(-276 + 3 * m)} -10,-276 Z`; teethOn = 0; }
    mouth.setAttribute('d', mouthD);
    mouth.setAttribute('fill', /Z$/.test(mouthD) ? '#7A3B2E' : 'none');
    op(teeth, teethOn);
    if (teethOn) { if (ex === 'scared' && !shv) { tTop.setAttribute('y', -279); op(tBot, 0); } else { tTop.setAttribute('y', -277); tBot.setAttribute('y', f2(-274 + chat * 2.5)); op(tBot, 1); } }
    op(blush, Math.max(bl2 * .9 + .1, o.rosy ? .9 : 0)); op(blush2, st.blush || 0);
    op(hapEyes, hap);
    const lidA = Math.max(lid, st.lid || 0);
    eyes.forEach(e => {
      op(e.g, hap ? 0 : 1);
      tf(e.g, e.s * 15 + lk[0] * 3, -303 + lk[1] * 3, 0, 1, eyeY * Math.max(.1, bl));
      op(e.white, wide); tf(e.pup, wide ? lk[0] * 1.5 : 0, wide ? lk[1] * 1.5 : 0, 0, wide ? .62 : 1);
      e.lid.setAttribute('height', f2(lidA * 10)); op(e.lid, lidA > .02 ? 1 : 0);
      e.lash.setAttribute('y', f2(-11 + lidA * 10 - 1)); op(e.lash, lidA > .02 ? 1 : 0);
    });
    brows.forEach((b, i) => { const sd2 = i ? 1 : -1; b.setAttribute('transform', `translate(${sd2 * 15},${f2(bY + (i ? 0 : bLy))}) rotate(${f2(sd2 * bR + (i ? 0 : bLr))})`); });
    /* sweat */
    const sw2 = clamp(st.sweat || 0); op(sweatG, sw2);
    if (sw2) drops.forEach(d => { const p = (at * .7 + d.ph) % 1; tf(d.g, d.x, d.y + p * 30, 0, .8 + .3 * Math.min(1, p * 4)); d.g.setAttribute('opacity', f2(Math.min(1, p * 6) * (1 - p))); });
    op(shiverG, shv > .05 ? (Math.sin(at * 23) > -.2 ? shv : shv * .3) : 0);
    if (shv > .05) tf(shiverG, Math.sin(at * 37) * 2, 0);
    /* plumes */
    plumes.forEach(p => tf(p.p, p.base[0], p.base[1], p.rot + Math.sin(at * 1.6 + p.ph) * 3 + (st.walkPh ? Math.sin(st.walkPh) * 4 : 0), p.sc));
    /* instrument pose */
    let defL = [-(58 + belly * 16), -128], defR = [58 + belly * 16, -128];
    let bowAt = null, bowAng = 0;
    if (inst) {
      inst.ig.setAttribute('transform', inst.violin ? '' : `rotate(${f2(-tilt)} 0 -112) translate(${f2(-jx)},${f2(-bob)})`);
      const wave = Math.sin(at * 3.4 + (o.seed || 0)) * .85 + Math.sin(at * 7.3 + 1) * .15;
      const d = lerp(inst.k.dmin, inst.k.dmax, .5 + .5 * wave * pl);
      const a = inst.bang * Math.PI / 180;
      let bh = [inst.contact[0] - Math.cos(a) * d, inst.contact[1] - Math.sin(a) * d];
      let nh = [inst.hold[0], inst.hold[1] + Math.sin(at * 31) * 1.3 * pl];
      if (!inst.violin) { bh = inv(bh); nh = inv(nh); }
      if (inst.violin) { defL = bh; defR = nh; } else { defR = bh; defL = nh; }
      bowAng = inst.bang - (inst.violin ? 0 : tilt);
    }
    const sL = [-shX, -232], sR = [shX, -232];
    const pL = st.hL || defL, pR = st.hR || defR;
    const cL = cstCtrl(sL, pL, st.bendL != null ? st.bendL : 12), cR = cstCtrl(sR, pR, st.bendR != null ? st.bendR : -12);
    arms[0].el.setAttribute('d', `M${cstP(sL)} Q${cstP(cL)} ${cstP(pL)}`);
    arms[1].el.setAttribute('d', `M${cstP(sR)} Q${cstP(cR)} ${cstP(pR)}`);
    arms[0].deco.forEach(d => cstSeg(d.el, sL, cL, pL, d.t0, d.t1));
    arms[1].deco.forEach(d => cstSeg(d.el, sR, cR, pR, d.t0, d.t1));
    const aL = Math.atan2(pL[1] - cL[1], pL[0] - cL[0]) * 180 / Math.PI, aR = Math.atan2(pR[1] - cR[1], pR[0] - cR[0]) * 180 / Math.PI;
    tf(hL.h, pL[0], pL[1]); tf(hL.hi, 0, 0, aL - 90 + (st.rotL || 0));
    tf(hR.h, pR[0], pR[1]); tf(hR.hi, 0, 0, aR - 90 + (st.rotR || 0), -1, 1);
    const fan = o.fan ? Math.sin(at * 7) * 9 * (st.fan != null ? st.fan : .5) : 0;
    tf(hL.prop, 0, 0, (st.propRotL || 0)); tf(hL.back, 0, 0, (st.propRotL || 0));
    tf(hR.prop, 0, 0, (st.propRotR || 0) + fan); tf(hR.back, 0, 0, (st.propRotR || 0));
    if (bowG) { const bh = inst.violin ? pL : pR; tf(bowG, bh[0], bh[1], bowAng); }
  };
  R.set({});
  return R;
}

/* ---------------- hand props (drawn into the propBack / prop groups) ---------------- */
function cstCane(g) {
  E('rect', { x: -3.2, y: -4, width: 6.4, height: 128, rx: 3, fill: '#2A1A14' }, g);
  E('rect', { x: -1.6, y: 0, width: 1.8, height: 120, fill: '#5A3A2A' }, g);
  E('rect', { x: -3.6, y: 116, width: 7.2, height: 10, rx: 2, fill: '#C9A34A' }, g);
  E('circle', { cx: 0, cy: -8, r: 8, fill: '#C9CED8' }, g); E('circle', { cx: -2, cy: -10, r: 3, fill: '#fff', 'fill-opacity': .7 }, g);
}
function cstShovel(g) {
  const s = G(g);
  E('path', { d: 'M-13,-8 Q0,-20 13,-8 L9,0 Q0,-10 -9,0 Z', fill: '#4A2E1A' }, s);
  E('rect', { x: -4.6, y: -3, width: 9.2, height: 82, rx: 4, fill: '#8A5A32' }, s);
  E('rect', { x: -2.4, y: 0, width: 2.4, height: 78, fill: '#B07A4A' }, s);
  E('path', { d: 'M-6,76 L6,76 L10,90 L-10,90 Z', fill: '#4A4E58' }, s);
  E('path', { d: 'M-28,88 L28,88 Q33,108 26,126 Q0,132 -26,126 Q-33,108 -28,88 Z', fill: '#5E6470' }, s);
  E('path', { d: 'M-28,88 L28,88 L26,96 L-26,96 Z', fill: '#8C929E' }, s);
  E('path', { d: 'M-28,88 Q-33,108 -26,126 L-20,124 Q-26,108 -22,92 Z M28,88 Q33,108 26,126 L20,124 Q26,108 22,92 Z', fill: '#474C57' }, s);
  E('path', { d: 'M-14,104 Q0,108 14,104', stroke: '#4A4F5A', 'stroke-width': 2.5, fill: 'none' }, s);
  const coal = G(s); [[-12, 116, 8], [2, 113, 9], [14, 119, 6], [-1, 123, 6], [-18, 122, 5]].forEach(([x, y, r]) => { E('path', { d: `M${x - r},${y} L${x - r * .4},${y - r} L${x + r * .7},${y - r * .7} L${x + r},${y + r * .3} L${x},${y + r * .6} Z`, fill: '#1C1C22' }, coal); E('path', { d: `M${x - r * .4},${y - r} L${x + r * .7},${y - r * .7} L${x},${y - r * .1} Z`, fill: '#4A4C58' }, coal); });
  return { g: s, coal };
}
function cstFan(g, col = '#F4E3EC') {
  const f = G(g); tf(f, 4, -4);
  const R = 46, a0 = -160, a1 = -20, P = a => [Math.cos(a * Math.PI / 180) * R, Math.sin(a * Math.PI / 180) * R];
  const p0 = P(a0), p1 = P(a1);
  E('path', { d: `M0,0 L${cstP(p0)} A${R},${R} 0 0 1 ${cstP(p1)} Z`, fill: col }, f);
  for (let i = 0; i <= 8; i++) { const p = P(lerp(a0, a1, i / 8)); E('path', { d: `M0,0 L${cstP(p)}`, stroke: shade(col, -.18), 'stroke-width': 1.6 }, f); }
  E('path', { d: `M${cstP(P(a0 + 5).map(v => v * .72))} A${R * .72},${R * .72} 0 0 1 ${cstP(P(a1 - 5).map(v => v * .72))}`, stroke: '#E58FAE', 'stroke-width': 4, fill: 'none', 'stroke-opacity': .8 }, f);
  for (let i = 0; i < 7; i++) { const p = P(lerp(a0 + 10, a1 - 10, i / 6)); E('circle', { cx: p[0] * .9, cy: p[1] * .9, r: 3, fill: '#fff', 'fill-opacity': .8 }, f); }
  E('circle', { r: 4, fill: '#C9A34A' }, f);
  return f;
}
function cstBlueprintRoll(g) {
  const r = G(g); tf(r, 0, 0, -24);
  E('rect', { x: -52, y: -10, width: 104, height: 20, rx: 9, fill: '#2F5E9E' }, r);
  E('rect', { x: -52, y: -10, width: 104, height: 6, rx: 3, fill: '#4F7FC0' }, r);
  E('rect', { x: -52, y: 4, width: 104, height: 6, rx: 3, fill: '#24497C' }, r);
  [-30, -6, 20].forEach(x => E('path', { d: `M${x},-10 L${x + 6},10`, stroke: '#CFE0F7', 'stroke-width': 1.4, 'stroke-opacity': .5 }, r));
  E('ellipse', { cx: 52, cy: 0, rx: 5, ry: 10, fill: '#9CC0EC' }, r);
  E('path', { d: 'M52,-6 A3,6 0 1 1 51,4 A1.8,3.5 0 1 1 52,-1', stroke: '#2F5E9E', 'stroke-width': 1.3, fill: 'none' }, r);
  E('rect', { x: -12, y: -11, width: 6, height: 22, fill: '#C44A3A' }, r);
  return r;
}

/* ===================================================================== */
/* PRESETS */
function castCaptain(p) {
  return Person(p, { seed: 11, coat: 'uniform', stripes: 4, hat: 'captain', beard: 'white', hair: '#E9E6DF', browColor: '#D9D5CC', brows: 'bushy', skin: '#F0C3A0', old: true, nose: 'round', belly: .32 });
}
function castOwner(p) {
  const P = Person(p, { seed: 21, coat: 'tailcoat', hat: 'top', mustache: 'walrus', hair: '#2E2420', skin: '#F3CDA8', nose: 'big', belly: .62, brows: 'bushy', chain: true, hairStyle: 'side' });
  cstCane(P.propBackL);
  return P;
}
function castShipbuilder(p) {
  const P = Person(p, { seed: 31, coat: 'waistcoat', glasses: true, pencil: true, hair: '#5A3A26', hairStyle: 'parted', skin: '#F1C9A0', jacket: '#4E5A3E', tie: '#2E4E7A', pants: '#3E3A36' });
  P.blueprint = cstBlueprintRoll(P.propBackR);
  return P;
}
function castLookout(p, v = 0) {
  return v ? Person(p, { seed: 42, coat: 'peacoat', hat: 'sailor', rosy: true, scarf: '#C9A23A', scarf2: '#8A6A1E', hair: '#7A5A3A', skin: '#EBC09A', beard: 'stubble', mustache: true, jaw: 'long' })
    : Person(p, { seed: 41, coat: 'peacoat', hat: 'beanie', hatColor: '#6E7380', rosy: true, scarf: '#B83A3A', hair: '#3A2A20', skin: '#F2C8A4', hairStyle: 'kid' });
}
function castWireless(p) {
  return Person(p, { seed: 51, coat: 'shirt', hat: 'headphones', hair: '#3A2A20', hairStyle: 'parted', skin: '#F4CFAA', tie: '#2D3A5A', headScale: 1.04 });
}
function castPoshLady(p) {
  const P = Person(p, { seed: 61, dress: true, hat: 'feathered', hatColor: '#5A2E6A', ribbon: '#E58FAE', hairStyle: 'updo', hair: '#8A4A2A', skin: '#F6D3B4', jacket: '#B9A3DA', skirt: '#A68BCF', shirt: '#FBF4E8', pearls: true, gloves: '#F7F3EA', fan: true, sash: '#6E4A9A', trim: '#7E5FAE', gem: '#5FB4C9' });
  cstFan(P.propR, '#F6E3EE');
  return P;
}
function castOfficer(p) {
  return Person(p, { seed: 71, coat: 'uniform', stripes: 2, hat: 'officer', mustache: true, hair: '#6B4A2E', skin: '#F1C49C', jaw: 'long' });
}
function castRescueCaptain(p) {
  return Person(p, { seed: 81, coat: 'uniform', stripes: 4, hat: 'captain', beard: 'grey', hair: '#9C9890', browColor: '#6E6A64', brows: 'bushy', skin: '#E6B992', jaw: 'long', nose: 'line', old: true, jacket: '#1C2744', size: 1.03 });
}
function castStoker(p, i = 0) {
  const V = [
    { seed: 91, hairStyle: 'buzz', hair: '#3A2A20', skin: '#E8B48C', beard: 'stubble', rag: '#8E3B32', wide: true, brows: 'bushy' },
    { seed: 92, hairStyle: 'kid', hair: '#2A1E18', skin: '#F0C29C', hat: 'flatcap', hatColor: '#6A625A', rag: '#3E5A7A' },
    { seed: 93, hairStyle: 'side', hair: '#1A1412', skin: '#B07A52', mustache: true, rag: '#6A7A3A' },
    { seed: 94, hairStyle: 'side', hair: '#B5562A', skin: '#F6CDB0', mustache: 'handlebar', rag: '#9A6A2A', beard: 'stubble' }
  ][((i % 4) + 4) % 4];
  const P = Person(p, Object.assign({ coat: 'stoker', soot: true, shoes: '#221C18' }, V));
  P.shovel = cstShovel(P.propBackR); P.coal = P.shovel.coal; op(P.coal, i % 2 ? 1 : 0);
  return P;
}
function castMusician(p, i = 0) {
  const V = [
    { seed: 101, instrument: 'violin', hair: '#4A3226', hairStyle: 'parted', mustache: true, skin: '#F1C49C' },
    { seed: 102, instrument: 'violin', hair: '#C9A15A', hairStyle: 'side', skin: '#F6D2B0', headScale: 1.02 },
    { seed: 103, instrument: 'cello', hair: '#2A1E18', hairStyle: 'side', glasses: true, skin: '#E9B98F' },
    { seed: 104, instrument: 'bass', hair: '#6A4428', hairStyle: 'bald', mustache: 'handlebar', skin: '#F0C29C', belly: .25 }
  ][((i % 4) + 4) % 4];
  return Person(p, Object.assign({ coat: 'bandsman' }, V));
}
function castPassenger(p, i = 0) {
  const V = [
    { seed: 111, coat: 'suit', hat: 'bowler', mustache: 'handlebar', jacket: '#3E4A5E', shirt: '#F4F1E8', tie: '#7A2E45', pants: '#2E3442', hair: '#5A3A26', pocket: '#E8E2D0' },
    { seed: 112, dress: true, hat: 'feathered', hatColor: '#2E5E6A', ribbon: '#F2C14E', plume: '#FFFFFF', plume2: '#BFE3E8', hairStyle: 'updo', hair: '#3A2418', skin: '#F4CFAE', jacket: '#E28C6A', skirt: '#D9785A', sash: '#8E3B32', trim: '#A9472F', gloves: '#F7F3EA', pearls: true },
    { seed: 113, dress: true, hairStyle: 'updo', hair: '#C9C5BE', skin: '#EFC7A6', jacket: '#4E3A66', skirt: '#3E2E56', sash: '#2A1E3E', pearls: true, old: true, glasses: true, gem: '#D9A53A' },
    { seed: 114, coat: 'tailcoat', hairStyle: 'parted', hair: '#2A1E18', mustache: 'handlebar', skin: '#F2CAA6', chain: true },
    { seed: 115, coat: 'waistcoat', hat: 'flatcap', hatColor: '#6A5A44', beard: 'stubble', hair: '#6A4428', skin: '#E8B48C', jacket: '#5A4A3A', tie: false, rolled: true, pants: '#4A443C' },
    { seed: 116, dress: true, headscarf: '#7A8A5A', shawl: '#9A5A3A', hairStyle: 'side', hair: '#3A2418', skin: '#EDC09A', jacket: '#5E6E8A', skirt: '#4E5A6E', sash: '#3E4656', shirt: '#E8E0CC' },
    { seed: 117, coat: 'suit', hat: 'flatcap', hatColor: '#5A6070', hairStyle: 'kid', hair: '#C98A4A', skin: '#F6D2B0', jacket: '#7A5A3E', shirt: '#EDE6D6', tie: false, pants: '#4A4A52', socks: '#8E8A80', size: .6, headScale: 1.22 },
    { seed: 118, dress: true, hairStyle: 'braids', hair: '#8A5A2A', bow: '#E8557A', skin: '#F4CFAE', jacket: '#C95A4A', skirt: '#B44A3E', apron: '#F4EEE2', sash: '#8E3B32', shirt: '#F4EEE2', size: .56, headScale: 1.24 },
    { seed: 119, coat: 'suit', hat: 'beanie', hatColor: '#3E4A3A', mustache: true, hair: '#2A1E18', skin: '#C48A60', jacket: '#5A4636', shirt: '#E2D8C4', tie: false, pants: '#3A3430' },
    { seed: 120, coat: 'sailorsuit', hairStyle: 'side', hair: '#E2C27A', skin: '#F8DCC0', socks: '#F7F5EF', size: .58, headScale: 1.22 }
  ][((i % 10) + 10) % 10];
  return Person(p, V);
}

/* ===================================================================== */
/* DOG — Pomeranian-ish lapdog, side view facing +x, origin at the feet */
function Dog(parent, o = {}) {
  const fur = o.fur || '#EEA75E', fl = shade(fur, .42), fd = shade(fur, -.18), fdd = shade(fur, -.36), ink = '#2B1B16';
  const root = G(parent);
  const shadow = E('ellipse', { cx: 2, cy: 2, rx: 40, ry: 7, fill: '#000', 'fill-opacity': .22 }, root);
  const bod = G(root);
  const mkLeg = (x, far) => { const g = G(bod); E('rect', { x: -6.5, y: -4, width: 13, height: 20, rx: 6.5, fill: far ? fd : fur }, g); E('ellipse', { cx: 1.5, cy: 14, rx: 8, ry: 4.6, fill: far ? fd : fl }, g); return { g, x }; };
  const legs = [mkLeg(-16, true), mkLeg(26, true)];
  /* tail */
  const tail = G(bod); const tailIn = G(tail);
  const TP = [[0, 0, 10], [-6, -12, 12], [-4, -26, 13], [6, -34, 12], [18, -36, 10], [27, -30, 7]];
  TP.forEach(([x, y, r]) => E('circle', { cx: x + 2, cy: y + 3, r: r + 1, fill: fdd }, tailIn));
  TP.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: fur }, tailIn));
  TP.slice(1, 5).forEach(([x, y, r]) => E('circle', { cx: x - 2, cy: y - 3, r: r * .5, fill: fl, 'fill-opacity': .4 }, tailIn));
  /* body */
  const bodyG = G(bod);
  const ring = (cx, cy, rx, ry, n, r, fill, dy = 0) => { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; E('circle', { cx: f2(cx + Math.cos(a) * rx), cy: f2(cy + Math.sin(a) * ry + dy), r, fill }, bodyG); } };
  ring(0, -36, 28, 17, 14, 11, fdd, 3);
  ring(0, -36, 28, 17, 14, 11, fur);
  E('ellipse', { cx: 0, cy: -36, rx: 32, ry: 21, fill: fur }, bodyG);
  E('ellipse', { cx: 4, cy: -26, rx: 22, ry: 9, fill: fl, 'fill-opacity': .55 }, bodyG);
  E('ellipse', { cx: -8, cy: -48, rx: 16, ry: 6, fill: fl, 'fill-opacity': .35 }, bodyG);
  const legs2 = [mkLeg(-24, false), mkLeg(16, false)];
  /* lifejacket: canvas vest with cork blocks */
  const vest = G(bod);
  E('path', { d: 'M-20,-60 L16,-60 Q27,-37 18,-12 L-20,-12 Q-31,-36 -20,-60 Z', fill: '#F3EEDF' }, vest);
  E('path', { d: 'M4,-60 L16,-60 Q27,-37 18,-12 L4,-12 Q12,-36 4,-60 Z', fill: '#000', 'fill-opacity': .1 }, vest);
  [-9, 4].forEach(x => E('path', { d: `M${x},-59 Q${x + 4},-36 ${x},-13`, stroke: '#C9BFA6', 'stroke-width': 2, fill: 'none' }, vest));
  E('path', { d: 'M-24,-36 Q0,-32 24,-37', stroke: '#B88A4A', 'stroke-width': 4, fill: 'none' }, vest);
  E('path', { d: 'M22,-37 l7,6 M22,-37 l8,-3', stroke: '#B88A4A', 'stroke-width': 3, 'stroke-linecap': 'round' }, vest);
  /* head */
  const head = G(bod);
  const hR = G(head);
  for (let i = 0; i < 11; i++) { const a = (i / 11) * Math.PI * 2; E('circle', { cx: f2(-6 + Math.cos(a) * 21), cy: f2(8 + Math.sin(a) * 19), r: 10, fill: fl }, hR); }
  [[-20, 0], [-10, 22], [4, 20]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6, fill: '#fff', 'fill-opacity': .25 }, hR));
  const earF = G(head); E('path', { d: 'M-16,-6 L-12,-30 L2,-12 Z', fill: fd }, earF);
  const ear = G(head); E('path', { d: 'M-4,-10 L4,-33 L14,-10 Z', fill: fur }, ear); E('path', { d: 'M0,-12 L4,-26 L10,-12 Z', fill: '#F5A3A8' }, ear);
  E('circle', { cx: 0, cy: 0, r: 19, fill: fur }, head);
  [[-14, 8, 8], [-6, 15, 7], [6, 15, 6]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: fl }, head));
  E('ellipse', { cx: -6, cy: -10, rx: 9, ry: 5, fill: fl, 'fill-opacity': .45 }, head);
  E('ellipse', { cx: 15, cy: 5, rx: 11, ry: 8.5, fill: fl }, head);
  const tongue = E('path', { d: 'M12,12 Q14,24 20,22 Q24,18 21,11 Z', fill: '#F26B7A' }, head);
  const mouth = E('path', { stroke: ink, 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round' }, head);
  E('ellipse', { cx: 25, cy: 2, rx: 5, ry: 4, fill: ink }, head); E('ellipse', { cx: 23.5, cy: .5, rx: 1.8, ry: 1.2, fill: '#fff', 'fill-opacity': .7 }, head);
  const blushD = E('ellipse', { cx: 4, cy: 8, rx: 5, ry: 3, fill: '#FF8A9A', 'fill-opacity': .5 }, head);
  const eye = G(head); E('ellipse', { rx: 4.4, ry: 5.2, fill: ink }, eye); E('circle', { cx: 1.4, cy: -2, r: 1.6, fill: '#fff' }, eye);
  const eyeLid = E('rect', { x: -6, y: -7, width: 12, height: 0, fill: fur }, eye);
  const eyeH = E('path', { d: 'M-5,1 Q0,-6 5,1', stroke: ink, 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, head);
  const brow = E('path', { d: 'M-4,0 L4,0', stroke: fdd, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, head);
  const bowG = G(head); tf(bowG, -6, -20, -15);
  E('path', { d: 'M0,0 Q-15,-12 -14,6 Z M0,0 Q15,-12 14,6 Z', fill: o.bowColor || '#E8557A' }, bowG); E('circle', { r: 4, fill: shade(o.bowColor || '#E8557A', -.2) }, bowG);
  const D = { root, head };
  D.set = st => {
    const at = st.at || 0, s = st.s || 1, j = clamp(st.jump || 0), wk = st.walk || 0, ex = st.face || 'happy';
    tf(root, st.x || 0, st.y || 0, 0, s * (st.flip ? -1 : 1), s);
    const breath = 1 + Math.sin(at * (ex === 'happy' ? 9 : 3)) * .012;
    const jy = -j * 46 - (wk ? Math.abs(Math.sin(at * 14)) * 3 : 0);
    tf(bod, 0, jy, -j * 8, 1, breath);
    shadow.setAttribute('rx', f2(40 * (1 - j * .35))); shadow.setAttribute('fill-opacity', f2(.22 * (1 - j * .5)));
    const legA = k => (wk ? Math.sin(at * 14 + k * Math.PI) * 24 * wk : 0);
    [legs[0], legs2[0]].forEach((l, k) => tf(l.g, l.x, -16, legA(k) + j * 34));
    [legs[1], legs2[1]].forEach((l, k) => tf(l.g, l.x, -16, legA(k + 1) - j * 30));
    const wag = st.wag != null ? st.wag : .4;
    tf(tail, -26, -44, (ex === 'worried' ? 38 : 0) + Math.sin(at * 16) * 18 * wag);
    const htilt = ex === 'smug' ? -12 : ex === 'worried' ? 6 : Math.sin(at * 1.3) * 3;
    tf(head, 30, -58, htilt);
    tf(ear, 0, 0, ex === 'worried' ? -40 : (j ? -14 * j : 0)); tf(earF, 0, 0, ex === 'worried' ? -34 : 0);
    const bl = blink(at, 7);
    op(eye, ex === 'happy' ? 0 : 1); op(eyeH, ex === 'happy' ? 1 : 0);
    tf(eye, 7, -3, 0, ex === 'worried' ? 1.18 : 1, Math.max(.12, bl) * (ex === 'worried' ? 1.18 : 1));
    eyeLid.setAttribute('height', ex === 'smug' ? 6.5 : 0);
    tf(eyeH, 7, -2);
    brow.setAttribute('transform', ex === 'worried' ? 'translate(6,-11) rotate(-24)' : ex === 'smug' ? 'translate(7,-12) rotate(10)' : 'translate(7,-11)');
    op(brow, ex === 'happy' ? 0 : 1);
    op(tongue, ex === 'happy' ? 1 : 0);
    if (ex === 'happy') tongue.setAttribute('transform', `translate(0,${f2(Math.sin(at * 9) * 1.2)})`);
    mouth.setAttribute('d', ex === 'happy' ? 'M8,8 Q15,17 25,9' : ex === 'worried' ? 'M11,13 Q15,10 19,13 Q22,15 25,12' : 'M10,11 Q18,14 25,8');
    op(blushD, ex === 'worried' ? 0 : 1);
    op(vest, st.lifejacket ? 1 : 0); op(bowG, st.bow ? 1 : 0);
  };
  D.set({});
  return D;
}

/* ===================================================================== */
/* ICEBERG — origin on the waterline (o.water = local y of the waterline) */
function Iceberg(parent, o = {}) {
  const Wy = o.water != null ? o.water : 0;
  const root = G(parent);
  const P = pts => 'M' + pts.map(p => f2(p[0]) + ',' + f2(p[1] + Wy)).join(' L') + ' Z';
  /* ---- underwater mass ---- */
  const underClip = G(root, { 'clip-path': clipRect(-3000, Wy, 6000, 4000) });
  const under = G(underClip); const underIn = G(under);
  const UP = [[-226, -10], [-300, 50], [-372, 140], [-420, 270], [-388, 400], [-300, 500], [-170, 590], [-30, 640], [110, 628], [250, 560], [352, 450], [410, 320], [404, 190], [340, 80], [228, -10]];
  E('path', { d: P(UP), fill: lgrad([[0, '#5FB2D8', .62], [.45, '#2E7FB0', .62], [1, '#0F3E66', .72]]) }, underIn);
  const UF = [
    [[-226, -10], [-300, 50], [-150, 120], [-40, 30], [-120, -10]],
    [[-300, 50], [-372, 140], [-420, 270], [-250, 260], [-150, 120]],
    [[-420, 270], [-388, 400], [-300, 500], [-180, 380], [-250, 260]],
    [[-150, 120], [-250, 260], [-180, 380], [20, 360], [60, 180]],
    [[-40, 30], [-150, 120], [60, 180], [200, 120], [120, 20]],
    [[120, 20], [200, 120], [340, 80], [228, -10]],
    [[200, 120], [60, 180], [20, 360], [250, 380], [404, 190], [340, 80]],
    [[-300, 500], [-170, 590], [-30, 640], [20, 360], [-180, 380]],
    [[20, 360], [-30, 640], [110, 628], [250, 560], [250, 380]],
    [[250, 380], [250, 560], [352, 450], [410, 320], [404, 190]]
  ];
  UF.forEach((f, i) => E('path', { d: P(f), fill: i % 3 === 0 ? '#BFEAFF' : i % 3 === 1 ? '#0A2E50' : '#7FCBEA', 'fill-opacity': i % 3 === 1 ? .2 : .2 }, underIn));
  [[-200, 60, 160, 0], [-60, 250, 220, 1], [120, 420, 180, 2], [-280, 330, 120, 3]].forEach(([x, y, w, k]) => E('path', { d: `M${x},${y + Wy} q${w * .25},-8 ${w * .5},0 t${w * .5},0`, stroke: '#DDF6FF', 'stroke-width': 3, fill: 'none', 'stroke-opacity': .22, 'stroke-linecap': 'round' }, underIn));
  const caustics = []; for (let i = 0; i < 7; i++) caustics.push(E('path', { d: `M${-300 + i * 100},${Wy + 12} q20,10 40,0 t40,0`, stroke: '#E8FBFF', 'stroke-width': 2.5, fill: 'none', 'stroke-opacity': .3, 'stroke-linecap': 'round' }, underIn));
  /* ---- above water ---- */
  const aboveClip = G(root, { 'clip-path': clipRect(-3000, Wy - 4000, 6000, 4000 + 1) });
  const above = G(aboveClip);
  const AP = [[-224, 24], [-222, 0], [-210, -36], [-192, -66], [-184, -104], [-152, -132], [-138, -176], [-106, -198], [-82, -238], [-42, -254], [-16, -292], [12, -310], [36, -282], [62, -264], [84, -228], [114, -216], [136, -178], [154, -162], [172, -120], [192, -94], [208, -48], [224, 0], [226, 24]];
  E('path', { d: P(AP), fill: '#B9E3F2' }, above);
  const c1 = [-122, -150], c2 = [-52, -212], c3 = [10, -242], c4 = [72, -202], c5 = [132, -140], c6 = [-162, -60], c7 = [162, -60], c8 = [-92, -36], c9 = [104, -36];
  const AF = [
    [[[-82, -238], [-42, -254], [-16, -292], [12, -310], c3, c2], '#FBFEFF'],
    [[[12, -310], [36, -282], [62, -264], [84, -228], c4, c3], '#D3EEF9'],
    [[[84, -228], [114, -216], [136, -178], c5, c4], '#A9DBEE'],
    [[[136, -178], [154, -162], [172, -120], [192, -94], c7, c5], '#84C6E2'],
    [[[192, -94], [208, -48], [224, 0], [226, 24], [152, 24], c7], '#64B1D6'],
    [[c5, c7, [152, 24], [104, 24], c9], '#98D1E8'],
    [[[-138, -176], [-106, -198], [-82, -238], c2, c1], '#F3FBFE'],
    [[[-192, -66], [-184, -104], [-152, -132], [-138, -176], c1, c6], '#FFFFFF'],
    [[[-224, 24], [-222, 0], [-210, -36], [-192, -66], c6, [-152, 24]], '#E6F7FD'],
    [[c6, c1, c8, [-112, 24], [-152, 24]], '#D4EFF9'],
    [[c1, c2, c3, c4, c5, c9, c8], '#E2F4FB'],
    [[c8, c9, [104, 24], [-112, 24]], '#C2E6F4']
  ];
  AF.forEach(([pts, c]) => E('path', { d: P(pts), fill: c }, above));
  E('path', { d: P([c8, c9, [100, -24], [-90, -24]]), fill: '#A8D8EA', 'fill-opacity': .6 }, above);
  E('path', { d: P([[-224, 1], [226, 1], [222, -9], [-220, -9]]), fill: '#8CCBE4', 'fill-opacity': .5 }, above);
  [[-176, -40, 40], [-64, -272, 30], [-150, -150, 28], [-40, -16, 70]].forEach(([x, y, w]) => E('path', { d: `M${x},${y + Wy} l${w},${-w * .12}`, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-opacity': .75, 'stroke-linecap': 'round' }, above));
  [[150, -40, 30], [180, -70, 22], [112, -130, 26], [60, -232, 18]].forEach(([x, y, w]) => E('path', { d: `M${x},${y + Wy} l${w * .3},${w}`, stroke: '#4E9BC2', 'stroke-width': 3, 'stroke-opacity': .45, 'stroke-linecap': 'round' }, above));
  E('path', { d: `M-82,${-238 + Wy} L-42,${-254 + Wy} L-16,${-292 + Wy} L12,${-310 + Wy} L6,${-296 + Wy} L-20,${-280 + Wy} L-46,${-246 + Wy} L-78,${-232 + Wy} Z`, fill: '#FFFFFF' }, above);
  E('path', { d: `M12,${-310 + Wy} L36,${-282 + Wy} L62,${-264 + Wy} L84,${-228 + Wy} L80,${-224 + Wy} L58,${-258 + Wy} L32,${-276 + Wy} Z`, fill: '#ECF8FD' }, above);
  const glints = [[-30, -268], [-160, -96], [84, -212], [-104, -196], [176, -64]].map(([x, y], i) => { const g = G(above); tf(g, x, y + Wy); E('path', { d: 'M0,-9 L2,-2 L9,0 L2,2 L0,9 L-2,2 L-9,0 L-2,-2 Z', fill: '#fff' }, g); return g; });
  /* ---- face ---- */
  const face = G(above); face.setAttribute('transform', `translate(0,${Wy}) translate(0,-118) scale(1.32) translate(0,118)`);
  const halo = E('ellipse', { cx: 10, cy: -320, rx: 42, ry: 10, fill: 'none', stroke: '#FFE58A', 'stroke-width': 6, 'stroke-opacity': .9 }, face);
  const cheeks = G(face); [[-82, -114], [74, -118]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 20, ry: 11, fill: '#FF9FB5', 'fill-opacity': .4 }, cheeks));
  const EYE = [[-46, -160], [40, -162]];
  const eyes = EYE.map(([x, y], i) => {
    const g = G(face); tf(g, x, y);
    const id = uid('ice'); const cp = E('clipPath', { id }, DEFS); E('ellipse', { rx: 28, ry: 24 }, cp);
    E('ellipse', { cx: 0, cy: 3, rx: 31, ry: 27, fill: '#8FCDE3', 'fill-opacity': .55 }, g);
    const w = G(g, { 'clip-path': 'url(#' + id + ')' });
    E('ellipse', { rx: 28, ry: 24, fill: '#FFFFFF' }, w);
    E('ellipse', { cx: 0, cy: 14, rx: 28, ry: 12, fill: '#D5EFF8' }, w);
    const pup = G(w); E('circle', { r: 11, fill: '#173248' }, pup); E('circle', { r: 6, fill: '#0B1B2A' }, pup); E('circle', { cx: 4, cy: -4, r: 3.8, fill: '#fff' }, pup);
    const lid = E('rect', { x: -32, y: -28, width: 64, height: 0, fill: '#BDE6F4' }, w);
    const lash = E('rect', { x: -32, y: -28, width: 64, height: 4.5, fill: '#4E93B5' }, w);
    const low = E('rect', { x: -32, y: 24, width: 64, height: 0, fill: '#C9ECF7' }, w);
    const hap = E('path', { d: 'M-20,6 Q0,-16 20,6', stroke: '#2B5E7E', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g);
    return { g, w, pup, lid, lash, low, hap, x, y };
  });
  const brows = EYE.map(() => { const b = G(face); E('path', { d: 'M-30,4 Q-4,-12 30,-4 L28,6 Q-2,-2 -28,12 Z', fill: '#7DBFD9' }, b); E('path', { d: 'M-24,2 Q-4,-8 24,-3', stroke: '#B6E2F2', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, b); return b; });
  const mouthG = G(face); tf(mouthG, -4, -94);
  const mid = uid('icm'); const mcp = E('clipPath', { id: mid }, DEFS); const mClip = E('path', { d: 'M0,0' }, mcp);
  const mouth = E('path', { fill: '#1F4B66' }, mouthG);
  const mIn = G(mouthG, { 'clip-path': 'url(#' + mid + ')' });
  const tongue = E('ellipse', { cx: 0, cy: 30, rx: 30, ry: 16, fill: '#E58BA0' }, mIn);
  const teeth = E('path', { fill: '#FFFFFF' }, mIn);
  const gapLine = E('path', { stroke: '#9FCFE2', 'stroke-width': 2.5, fill: 'none' }, mIn);
  const lip = E('path', { fill: 'none', stroke: '#7DBFD9', 'stroke-width': 4, 'stroke-linecap': 'round' }, mouthG);
  const pucker = G(mouthG); E('ellipse', { cx: 0, cy: 0, rx: 15, ry: 13, fill: '#8CCBE2' }, pucker); E('ellipse', { cx: 1, cy: 1, rx: 7, ry: 6, fill: '#1F4B66' }, pucker);
  const drop = G(face); E('path', { d: 'M0,-14 Q11,0 8,6 Q0,14 -8,6 Q-11,0 0,-14 Z', fill: '#E9FBFF' }, drop); E('path', { d: 'M0,-14 Q11,0 8,6 Q0,14 -8,6 Q-11,0 0,-14 Z', fill: 'none', stroke: '#6FB4D0', 'stroke-width': 2 }, drop);
  const notes = [0, 1, 2].map(i => { const g = G(face); E('ellipse', { cx: 0, cy: 0, rx: 7, ry: 5.5, fill: '#2B5E7E', transform: 'rotate(-20)' }, g); E('path', { d: i === 1 ? 'M6,-2 V-26 L18,-22 V-4' : 'M6,-2 V-26 Q14,-22 16,-14', stroke: '#2B5E7E', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g); if (i === 1) E('ellipse', { cx: 13, cy: -3, rx: 6, ry: 4.5, fill: '#2B5E7E', transform: 'rotate(-20 13 -3)' }, g); return g; });
  /* waterline foam (does not bob) */
  const foam = G(root);
  const foams = []; for (let i = 0; i < 9; i++) foams.push(E('path', { stroke: '#FFFFFF', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .85 }, foam));
  if (o.foam === false) op(foam, 0);
  const sways = [under, above];
  const I = { root, above, under, face };
  I.set = st => {
    const at = st.at || 0, s = st.s || 1, ex = st.face || 'smug';
    tf(root, st.x || 0, st.y || 0, 0, s * (st.flip ? -1 : 1), s);
    const shake = ex === 'laugh' ? Math.sin(at * 22) * 1.4 : 0;
    const by = (st.bob || 0) + Math.sin(at * .8) * 3 + (ex === 'laugh' ? Math.abs(Math.sin(at * 11)) * -4 : 0);
    sways.forEach(g => g.setAttribute('transform', `translate(0,${f2(by)}) rotate(${f2(shake + Math.sin(at * .6) * .5)} 0 ${Wy})`));
    op(underClip, st.showUnder != null ? st.showUnder : 1);
    caustics.forEach((c, i) => tf(c, Math.sin(at * .7 + i) * 18, (i % 3) * 30));
    glints.forEach((g, i) => { const v = Math.max(0, Math.sin(at * 1.6 + i * 2.3)); g.setAttribute('opacity', f2(v * v)); g.setAttribute('transform', `translate(${[-30, -160, 84, -104, 176][i]},${[-268, -96, -212, -196, -64][i] + Wy}) scale(${f2(.4 + v * .8)}) rotate(${f2(at * 30)})`); });
    for (let i = 0; i < foams.length; i++) { const x0 = -230 + i * 52 + Math.sin(at * .9 + i) * 6, y0 = Wy + (i % 2 ? 4 : -1); foams[i].setAttribute('d', `M${f2(x0)},${f2(y0)} q12,${f2(-5 - Math.sin(at * 2 + i) * 2)} 24,0 t24,0`); foams[i].setAttribute('stroke-opacity', f2(.55 + .35 * Math.sin(at * 1.5 + i))); }
    /* expression */
    let lidU = .45, lidL = .1, lk = st.look || [-.25 + wob(at * .45, 3) * .35, .15 + wob(at * .38, 7) * .15], pS = 1, brY = [-196, -196], brR = [-6, 6], hapE = 0;
    let Lc = [-64, -2], Rc = [62, -16], tc = [0, 6], bc = [4, 32], tH = 9, tongueO = 0, puck = 0, hal = 0, chk = 0, drp = 0, nts = 0, gap = 0;
    switch (ex) {
      case 'smug': brY = [-202, -192]; brR = [-14, 4]; chk = .4; break;
      case 'innocent': lidU = 0; lidL = 0; lk = st.look || [.35, -.75]; brY = [-210, -210]; brR = [8, -8]; Lc = [-18, -4]; Rc = [18, -4]; tc = [0, 2]; bc = [0, 12]; tH = 0; hal = 1; chk = 1; break;
      case 'surprised': lidU = 0; lidL = 0; pS = .62; lk = st.look || [0, 0]; brY = [-218, -218]; brR = [-4, 4]; Lc = [-22, -4]; Rc = [22, -4]; tc = [0, -32]; bc = [0, 34]; tH = 0; tongueO = 1; break;
      case 'laugh': hapE = 1; brY = [-208, -208]; brR = [-10, 10]; Lc = [-60, -14]; Rc = [60, -14]; tc = [0, -4]; bc = [0, 62]; tH = 10; tongueO = 1; chk = 1; break;
      case 'whistle': lidU = .3; lk = st.look || [-.7, -.55]; brY = [-206, -200]; brR = [-8, 10]; puck = 1; nts = 1; break;
      case 'oops': lidU = 0; lidL = 0; pS = .6; lk = st.look || [.8, .1]; brY = [-206, -206]; brR = [16, -16]; Lc = [-50, -6]; Rc = [50, -6]; tc = [0, -14]; bc = [0, 18]; tH = 40; gap = 1; drp = 1; break;
      case 'neutral': lidU = .35; brY = [-198, -198]; brR = [-4, 4]; Lc = [-40, -6]; Rc = [40, -8]; tc = [0, 0]; bc = [0, 8]; tH = 0; break;
    }
    if (st.talk) { const m = .5 + .5 * Math.abs(Math.sin(at * 11) * Math.sin(at * 4.3 + 1)); if (puck) { puck = 0; Lc = [-30, -6]; Rc = [30, -8]; tc = [0, -2]; bc = [0, 6]; tH = 6; } bc = [bc[0], bc[1] + 10 + m * 26]; tc = [tc[0], tc[1] - m * 4]; tongueO = 1; }
    const bl = blink(at, 13), lu = Math.max(lidU, 1 - bl);
    eyes.forEach((e, i) => {
      op(e.w, hapE ? 0 : 1); op(e.hap, hapE);
      tf(e.pup, lk[0] * 13, lk[1] * 10, 0, pS);
      e.lid.setAttribute('height', f2(lu * 48 + 2)); e.lash.setAttribute('y', f2(-28 + lu * 48 - 1)); op(e.lash, lu > .03 ? 1 : 0);
      e.low.setAttribute('y', f2(24 - lidL * 48)); e.low.setAttribute('height', f2(lidL * 48 + 1));
    });
    brows.forEach((b, i) => tf(b, EYE[i][0], brY[i] + (ex === 'laugh' ? Math.sin(at * 11) * 2 : 0), brR[i]));
    const md = `M${cstP(Lc)} Q${cstP(tc)} ${cstP(Rc)} Q${cstP(bc)} ${cstP(Lc)} Z`;
    op(mouth, puck ? 0 : 1); op(mIn, puck ? 0 : 1); op(lip, puck ? 0 : 1); op(pucker, puck);
    mouth.setAttribute('d', md); mClip.setAttribute('d', md);
    lip.setAttribute('d', `M${cstP([Lc[0] - 4, Lc[1] - 2])} Q${cstP([tc[0], tc[1] - 4])} ${cstP([Rc[0] + 4, Rc[1] - 2])}`);
    teeth.setAttribute('d', tH ? `M${cstP([Lc[0] - 4, Lc[1] - 6])} Q${cstP([tc[0], tc[1] - 8])} ${cstP([Rc[0] + 4, Rc[1] - 6])} L${cstP([Rc[0], Rc[1] + tH * .5])} Q${cstP([tc[0], tc[1] + tH])} ${cstP([Lc[0], Lc[1] + tH * .5])} Z` : 'M0,0');
    gapLine.setAttribute('d', gap ? `M${cstP([Lc[0] + 4, Lc[1]])} Q${cstP([tc[0], (tc[1] + bc[1]) / 2 - 2])} ${cstP([Rc[0] - 4, Rc[1]])} M-26,-14 V16 M-9,-14 V18 M9,-14 V18 M26,-14 V16` : 'M0,0');
    op(gapLine, gap);
    op(tongue, tongueO); tongue.setAttribute('cy', f2((tc[1] + bc[1]) / 2 + 12));
    tf(pucker, 26 + Math.sin(at * 3) * 1.5, -4, 0, 1 + Math.sin(at * 6) * .06);
    op(halo, hal); halo.setAttribute('cy', f2(-318 + Math.sin(at * 2) * 3));
    op(cheeks, chk);
    op(drop, drp); if (drp) { const p = (at * .5) % 1; tf(drop, 92, -190 + p * 50, 0, 1); drop.setAttribute('opacity', f2(Math.min(1, p * 5) * (1 - p * .6))); }
    notes.forEach((n, i) => { const p = (at * .55 + i / 3) % 1; op(n, nts ? Math.min(1, p * 4) * (1 - p) : 0); if (nts) tf(n, 36 + p * 50 + Math.sin(p * 9 + i) * 10, -110 - p * 100, Math.sin(p * 6) * 14, .8 + p * .4); });
  };
  I.set({});
  return I;
}
