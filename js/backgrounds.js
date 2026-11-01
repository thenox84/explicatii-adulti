"use strict";
/* =====================================================================
   FUNDALURI — decoruri bogate, cu mișcare ambientală.
   Fiecare întoarce un grup cu .anim(at) pentru mișcările de fundal.
   Lumea scenei e 1600×900; decorurile depășesc puțin marginile
   (pentru mișcările de cameră).
   ===================================================================== */

/* cer de amurg cu nori, stele, oraș îndepărtat și macara */
function duskSky(parent, x, y, w, h, o = {}) {
  const g = G(parent, { 'clip-path': clipRect(x, y, w, h, o.rx || 0) });
  E('rect', { x, y, width: w, height: h, fill: lgrad([[0, '#2B2F6B'], [.45, '#7A4D8C'], [.75, '#E2766A'], [1, '#F7B267']]) }, g);
  const sun = E('circle', { cx: x + w * .7, cy: y + h * .86, r: h * .16, fill: '#FFD58A', 'fill-opacity': .9 }, g);
  const stars = []; for (let i = 0; i < 18; i++) stars.push(E('circle', { cx: x + hash(i) * w, cy: y + hash(i + 50) * h * .4, r: 1 + hash(i + 9) * 1.6, fill: '#fff' }, g));
  const clouds = []; for (let i = 0; i < 4; i++) { const c = G(g); const cw = 120 + hash(i + 3) * 90;
    [[0, 0, cw * .32], [cw * .28, -12, cw * .26], [cw * .55, 2, cw * .22], [-cw * .25, 6, cw * .2]].forEach(([cx, cy, r]) => E('ellipse', { cx, cy, rx: r, ry: r * .45, fill: '#FFD9C2', 'fill-opacity': .55 }, c));
    clouds.push({ c, y: y + h * (.18 + hash(i + 7) * .35), sp: 6 + hash(i) * 8, off: hash(i + 1) * w }); }
  /* oraș */
  const city = G(g);
  for (let i = 0; i < 26; i++) { const bw = 30 + hash(i + 20) * 50, bh = 40 + hash(i + 40) * h * .35, bx = x + i * (w / 24) - 20;
    E('rect', { x: bx, y: y + h - bh, width: bw, height: bh, fill: '#3C2F5C', 'fill-opacity': .9 }, city);
    for (let k = 0; k < 4; k++) if (hash(i * 7 + k) > .55) E('rect', { x: bx + 6 + (k % 2) * 14, y: y + h - bh + 10 + Math.floor(k / 2) * 18, width: 7, height: 9, fill: '#FFD58A', 'fill-opacity': .8 }, city); }
  /* macara */
  const crane = G(g); const cx = x + w * (o.craneX || .28), cb = y + h;
  E('rect', { x: cx - 7, y: cb - h * .78, width: 14, height: h * .78, fill: '#2A2347' }, crane);
  for (let k = 0; k < 10; k++) E('path', { d: `M${cx - 7},${cb - k * h * .078} L${cx + 7},${cb - (k + 1) * h * .078}`, stroke: '#4A3F70', 'stroke-width': 2 }, crane);
  const jib = G(crane); tf(jib, cx, cb - h * .78);
  E('rect', { x: -w * .1, y: -6, width: w * .38, height: 10, fill: '#2A2347' }, jib);
  E('path', { d: `M0,-30 L${-w * .1},-2 M0,-30 L${w * .28},-2`, stroke: '#2A2347', 'stroke-width': 3 }, jib);
  E('rect', { x: -6, y: -34, width: 12, height: 30, fill: '#2A2347' }, jib);
  const hook = G(jib); E('path', { d: 'M0,0 V60', stroke: '#2A2347', 'stroke-width': 2 }, hook); E('rect', { x: -16, y: 60, width: 32, height: 22, fill: '#3E3466' }, hook);
  const lamp = E('circle', { cx: 0, cy: -36, r: 4, fill: '#FF5A5A' }, jib);
  return Object.assign(g, {
    anim(at) {
      clouds.forEach(cl => tf(cl.c, x + ((cl.off + at * cl.sp) % (w + 300)) - 150, cl.y));
      stars.forEach((s, i) => s.setAttribute('fill-opacity', f2(.35 + .4 * (.5 + .5 * Math.sin(at * 2 + i)))));
      tf(jib, cx, cb - h * .78, 0, Math.cos(at * .12) * .9 + .1 * Math.sign(Math.cos(at * .12) || 1), 1);
      tf(hook, w * .18 + Math.sin(at * .3) * w * .06, 0);
      op(lamp, Math.sin(at * 3) > 0 ? 1 : .2);
    }
  });
}

/* ATELIERUL AGENTULUI — perete de cărămidă, ferestre industriale,
   lămpi suspendate, panou cu scule, rafturi, podea de lemn */
function bgWorkshop(parent, o = {}) {
  const g = G(parent); const anims = [];
  E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#2A2438' }, g);
  /* perete */
  E('rect', { x: -200, y: -200, width: 2000, height: 900, fill: lgrad([[0, '#3A3150'], [1, '#4A3B55']]) }, g);
  const bricks = G(g, { opacity: .55 });
  for (let r = 0; r < 26; r++) for (let c = 0; c < 30; c++) { if (hash(r * 31 + c) > .35) continue; const bx = -200 + c * 72 + (r % 2) * 36, by = -200 + r * 34;
    E('rect', { x: bx, y: by, width: 66, height: 28, rx: 4, fill: hash(r + c * 3) > .5 ? '#56456A' : '#4F3F62' }, bricks); }
  /* ferestre */
  const wins = o.windows || [[160, 90, 420, 330], [1020, 90, 420, 330]];
  wins.forEach(([wx, wy, ww, wh], i) => {
    E('rect', { x: wx - 18, y: wy - 18, width: ww + 36, height: wh + 36, rx: 10, fill: '#2B2238' }, g);
    const sky = duskSky(g, wx, wy, ww, wh, { craneX: i ? .7 : .3 }); anims.push(sky.anim);
    const fr = G(g); for (let k = 1; k < 4; k++) E('rect', { x: wx + ww * k / 4 - 4, y: wy, width: 8, height: wh, fill: '#2B2238' }, fr);
    for (let k = 1; k < 3; k++) E('rect', { x: wx, y: wy + wh * k / 3 - 4, width: ww, height: 8, fill: '#2B2238' }, fr);
    E('path', { d: `M${wx + 20},${wy + wh - 20} L${wx + ww * .45},${wy + 20}`, stroke: '#fff', 'stroke-opacity': .08, 'stroke-width': 30 }, g);
    E('rect', { x: wx - 30, y: wy + wh + 14, width: ww + 60, height: 16, rx: 6, fill: '#5A4366' }, g);
  });
  /* panou cu scule */
  if (o.pegboard !== false) {
    const pb = G(g); tf(pb, o.pegX || 700, o.pegY || 120);
    E('rect', { x: -110, y: -10, width: 220, height: 200, rx: 10, fill: '#B98552' }, pb);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) E('circle', { cx: -96 + c * 24, cy: 6 + r * 24, r: 2.5, fill: '#8A5E34' }, pb);
    const h1 = G(pb); tf(h1, -60, 70, -20, .75); hammer(h1);
    const w1 = G(pb); tf(w1, 0, 60, 15, .8); wrench(w1);
    const s1 = G(pb); tf(s1, 60, 90); E('rect', { x: -6, y: -60, width: 12, height: 70, rx: 4, fill: '#E84855' }, s1); E('rect', { x: -2, y: 10, width: 4, height: 50, fill: '#9AA6BD' }, s1);
    const m1 = G(pb); tf(m1, 0, 150, 0, .6); E('rect', { x: -70, y: -10, width: 140, height: 20, rx: 4, fill: '#7FA35A' }, m1);
  }
  /* rafturi */
  const shelf = (sx, sy, sw) => { const s = G(g); E('rect', { x: sx, y: sy, width: sw, height: 12, rx: 3, fill: '#8A5E34' }, s);
    let x = sx + 10; while (x < sx + sw - 30) { const bw = 16 + hash(x) * 22, bh = 40 + hash(x + 1) * 40;
      if (hash(x + 2) > .7) { E('rect', { x, y: sy - 46, width: 46, height: 46, rx: 4, fill: '#C8954F' }, s); E('path', { d: `M${x},${sy - 34} H${x + 46}`, stroke: '#A0723A', 'stroke-width': 3 }, s); x += 52; }
      else { E('rect', { x, y: sy - bh, width: bw, height: bh, rx: 3, fill: ['#4D96FF', '#E84855', '#F7C948', '#2EC4B6', '#9B5DE5', '#3BB273'][Math.floor(hash(x + 3) * 6)] }, s); x += bw + 3; } } };
  (o.shelves || [[640, 360, 200], [-120, 470, 220]]).forEach(s => shelf(...s));
  /* ceas */
  if (o.clock !== false) { const ck = wallClock(g, 42); tf(ck, o.clockX || 920, o.clockY || 170); anims.push(ck.anim); }
  /* podea */
  E('rect', { x: -200, y: 700, width: 2000, height: 420, fill: '#6B4A35' }, g);
  E('rect', { x: -200, y: 700, width: 2000, height: 14, fill: '#4E3426' }, g);
  for (let i = 0; i < 40; i++) E('path', { d: `M${-200 + i * 60},714 L${-200 + (i - 20) * 140 + 1400},1120`, stroke: '#5A3D2C', 'stroke-width': 3 }, g);
  for (let r = 0; r < 4; r++) E('path', { d: `M-200,${740 + r * r * 28 + r * 30} H1800`, stroke: '#5A3D2C', 'stroke-width': 2, opacity: .6 }, g);
  /* lămpi suspendate cu conuri de lumină */
  const lamps = [];
  (o.lamps || [380, 800, 1220]).forEach((lx, i) => {
    const l = G(g); E('path', { d: 'M0,-300 V0', stroke: '#1E1A28', 'stroke-width': 3 }, l);
    E('path', { d: 'M-46,40 Q-40,0 0,0 Q40,0 46,40 Z', fill: '#2F6F64' }, l); E('ellipse', { cx: 0, cy: 40, rx: 46, ry: 8, fill: '#244F48' }, l);
    E('ellipse', { cx: 0, cy: 44, rx: 18, ry: 7, fill: '#FFF2C4' }, l);
    const cone = E('path', { d: 'M-36,42 L-260,720 L260,720 L36,42 Z', fill: rgrad([[0, '#FFE8A8', .22], [1, '#FFE8A8', 0]], .5, 0, 1) }, l);
    lamps.push({ l, x: lx, ph: i * 1.7 });
  });
  /* vignetă */
  E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: rgrad([[0, '#000', 0], [.7, '#000', 0], [1, '#000', .45]], .5, .45, .75), 'pointer-events': 'none' }, g);
  g.anim = at => { anims.forEach(f => f(at)); lamps.forEach(L => tf(L.l, L.x, 0, Math.sin(at * .7 + L.ph) * 1.6)); };
  return g;
}

/* BIROUL LUI TUDOR — seară, fereastră spre acoperișuri vechi */
function bgOffice(parent, o = {}) {
  const g = G(parent); const anims = [];
  E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#3B3350' }, g);
  E('rect', { x: -200, y: -200, width: 2000, height: 900, fill: lgrad([[0, '#4C4066'], [1, '#5B4A6E']]) }, g);
  /* tapet cu model discret */
  const wp = G(g, { opacity: .18 });
  for (let r = 0; r < 14; r++) for (let c = 0; c < 22; c++) E('path', { d: `M${-200 + c * 90 + (r % 2) * 45},${-180 + r * 64} l10,-14 l10,14 l-10,14 z`, fill: '#E9D8FF' }, wp);
  /* fereastră spre oraș vechi */
  const wx = o.winX || 980, wy = 90, ww = 470, wh = 380;
  E('rect', { x: wx - 22, y: wy - 22, width: ww + 44, height: wh + 44, rx: 12, fill: '#6E4F3A' }, g);
  const win = G(g, { 'clip-path': clipRect(wx, wy, ww, wh) });
  E('rect', { x: wx, y: wy, width: ww, height: wh, fill: lgrad([[0, '#28306B'], [.5, '#6B4F95'], [.85, '#F08A6B'], [1, '#FFC285']]) }, win);
  const moon = E('circle', { cx: wx + ww * .78, cy: wy + 70, r: 26, fill: '#FFF4D6' }, win);
  const stars = []; for (let i = 0; i < 14; i++) stars.push(E('circle', { cx: wx + hash(i + 70) * ww, cy: wy + hash(i + 90) * wh * .35, r: 1.4, fill: '#fff' }, win));
  /* turn de biserică */
  const tw = G(win); const tx = wx + ww * .32;
  E('rect', { x: tx - 26, y: wy + wh * .3, width: 52, height: wh * .7, fill: '#3F2E4E' }, tw);
  E('path', { d: `M${tx - 32},${wy + wh * .3} L${tx},${wy + wh * .05} L${tx + 32},${wy + wh * .3} Z`, fill: '#2F2240' }, tw);
  E('circle', { cx: tx, cy: wy + wh * .38, r: 11, fill: '#FFE7A8' }, tw);
  /* acoperișuri cu ferestre „ochi” */
  const roofs = G(win);
  for (let i = 0; i < 7; i++) { const rx = wx - 30 + i * 80, rw = 110, rb = wy + wh, rh = 90 + hash(i + 5) * 60, rt = rb - rh - 40;
    E('rect', { x: rx, y: rb - rh, width: rw - 10, height: rh, fill: ['#E7C8A0', '#D9B48A', '#EBD2B0'][i % 3] }, roofs);
    E('path', { d: `M${rx - 8},${rb - rh} L${rx + rw / 2 - 5},${rt} L${rx + rw},${rb - rh} Z`, fill: ['#B5532F', '#A34828', '#C2603A'][i % 3] }, roofs);
    E('path', { d: `M${rx + rw / 2 - 20},${rb - rh - 10} Q${rx + rw / 2 - 5},${rb - rh - 26} ${rx + rw / 2 + 10},${rb - rh - 10} Z`, fill: '#2B1D1A' }, roofs);
    for (let k = 0; k < 2; k++) E('rect', { x: rx + 14 + k * 46, y: rb - rh + 22, width: 18, height: 24, rx: 3, fill: hash(i * 3 + k) > .4 ? '#FFD58A' : '#5A4A60' }, roofs); }
  const fr = G(g); E('rect', { x: wx + ww / 2 - 6, y: wy, width: 12, height: wh, fill: '#6E4F3A' }, fr); E('rect', { x: wx, y: wy + wh * .45, width: ww, height: 12, fill: '#6E4F3A' }, fr);
  E('rect', { x: wx - 40, y: wy + wh + 18, width: ww + 80, height: 20, rx: 6, fill: '#8A6448' }, g);
  /* draperii */
  [-1, 1].forEach(s => { const cx = s < 0 ? wx - 30 : wx + ww + 30; E('path', { d: `M${cx - 40},${wy - 40} Q${cx + s * 10},${wy + 200} ${cx - 30},${wy + wh + 60} L${cx + 40},${wy + wh + 60} Q${cx + s * 30},${wy + 200} ${cx + 40},${wy - 40} Z`, fill: '#8C3B4A' }, g); });
  E('rect', { x: wx - 90, y: wy - 52, width: ww + 180, height: 14, rx: 7, fill: '#5A3B2B' }, g);
  /* pisică pe pervaz */
  const cat = G(g); tf(cat, wx + 80, wy + wh + 18);
  const tail = E('path', { stroke: '#2E2A33', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, cat);
  E('ellipse', { cx: 0, cy: -24, rx: 46, ry: 26, fill: '#2E2A33' }, cat);
  E('circle', { cx: -40, cy: -44, r: 20, fill: '#2E2A33' }, cat);
  E('path', { d: 'M-56,-56 L-52,-76 L-42,-60 Z M-36,-60 L-26,-76 L-24,-56 Z', fill: '#2E2A33' }, cat);
  const catEye = E('path', { d: 'M-50,-46 q4,3 8,0 M-36,-46 q4,3 8,0', stroke: '#F7C948', 'stroke-width': 2.5, fill: 'none' }, cat);
  /* bibliotecă */
  const bs = G(g); tf(bs, o.shelfX != null ? o.shelfX : 60, 120);
  E('rect', { x: 0, y: 0, width: 330, height: 560, rx: 8, fill: '#6E4F3A' }, bs);
  for (let r = 0; r < 4; r++) { E('rect', { x: 12, y: 18 + r * 132, width: 306, height: 118, fill: '#3E2C22' }, bs);
    let x = 18; while (x < 300) { const bw = 14 + hash(x + r * 9) * 18, bh = 70 + hash(x + r) * 40;
      E('rect', { x, y: 18 + r * 132 + 118 - bh, width: bw, height: bh, rx: 2, fill: ['#B5532F', '#2F6F64', '#C9A227', '#4D5FA8', '#7E2F55', '#3BB273'][Math.floor(hash(x * 1.7 + r) * 6)] }, bs);
      x += bw + 2; if (hash(x + r * 5) > .9) { const pl = plant(bs, .5); tf(pl, x + 26, 18 + r * 132 + 108); anims.push(pl.anim); x += 56; } } }
  /* tablou de familie */
  const fp = G(g); tf(fp, o.photoX || 560, 180);
  E('rect', { x: -70, y: -55, width: 140, height: 110, rx: 6, fill: '#C9A227' }, fp); E('rect', { x: -58, y: -43, width: 116, height: 86, fill: '#F2E1C1' }, fp);
  [[-28, '#E07A3F'], [0, '#4D96FF'], [28, '#3BB273']].forEach(([x, c], i) => { E('circle', { cx: x, cy: -6 - (i === 1 ? 6 : 0), r: 11, fill: '#E8B98F' }, fp); E('rect', { x: x - 14, y: 8 - (i === 1 ? 6 : 0), width: 28, height: 34, rx: 12, fill: c }, fp); });
  /* ceas */
  const ck = wallClock(g, 36); tf(ck, o.clockX || 820, 160); anims.push(ck.anim);
  /* podea + covor */
  E('rect', { x: -200, y: 700, width: 2000, height: 420, fill: '#5A3B2B' }, g);
  for (let i = 0; i < 30; i++) E('path', { d: `M${-200 + i * 70},700 L${-200 + (i - 15) * 150 + 1200},1120`, stroke: '#4A2F22', 'stroke-width': 3 }, g);
  E('ellipse', { cx: 800, cy: 820, rx: 560, ry: 70, fill: '#8C3B4A', 'fill-opacity': .8 }, g);
  E('ellipse', { cx: 800, cy: 820, rx: 520, ry: 56, fill: 'none', stroke: '#E7C8A0', 'stroke-width': 4, 'stroke-dasharray': '14 10', opacity: .6 }, g);
  E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: rgrad([[0, '#000', 0], [.7, '#000', 0], [1, '#000', .45]], .5, .45, .75) }, g);
  g.anim = at => {
    anims.forEach(f => f(at));
    stars.forEach((s, i) => s.setAttribute('fill-opacity', f2(.3 + .5 * (.5 + .5 * Math.sin(at * 1.7 + i)))));
    tail.setAttribute('d', `M40,-20 Q${f2(80 + Math.sin(at * 1.6) * 16)},${f2(-10 + Math.cos(at * 1.6) * 10)} ${f2(76 + Math.sin(at * 1.6 + 1) * 22)},${f2(-50 + Math.sin(at * 1.3) * 8)}`);
    const b = blink(at * .7, 9); catEye.setAttribute('transform', `translate(0,${f2(-46 * (1 - b))}) scale(1,${f2(Math.max(.1, b))})`);
  };
  return g;
}

/* birou de lucru (masa) în biroul lui Tudor */
function officeDesk(parent, w = 620) {
  const g = G(parent);
  E('rect', { x: -w / 2, y: 0, width: w, height: 26, rx: 6, fill: '#8A5A3B' }, g);
  E('rect', { x: -w / 2, y: 0, width: w, height: 8, rx: 4, fill: '#A9744F' }, g);
  E('rect', { x: -w / 2 + 20, y: 26, width: w - 40, height: 180, fill: '#704630' }, g);
  E('rect', { x: -w / 2 + 40, y: 46, width: w * .3, height: 60, rx: 6, fill: '#7E5038' }, g);
  E('rect', { x: -w / 2 + 40 + w * .15 - 16, y: 72, width: 32, height: 6, rx: 3, fill: '#C9A227' }, g);
  return g;
}
/* lampă de birou cu lumină caldă */
function deskLamp(parent) {
  const g = G(parent);
  const cone = E('path', { d: 'M54,-128 L-60,30 L170,30 L96,-120 Z', fill: rgrad([[0, '#FFE8A8', .45], [1, '#FFE8A8', 0]], .5, 0, 1) }, g);
  E('ellipse', { cx: 0, cy: 0, rx: 40, ry: 9, fill: '#2B2F45' }, g);
  E('path', { d: 'M0,0 L-10,-100 L60,-150', stroke: '#2B2F45', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M40,-170 L104,-118 L80,-100 L30,-150 Z', fill: '#2F6F64' }, g);
  return g;
}
