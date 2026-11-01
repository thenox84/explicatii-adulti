"use strict";
/* =====================================================================
   RECUZITĂ — obiecte desenate, refolosite în scene.
   Toate sunt centrate în (0,0) dacă nu se spune altfel.
   ===================================================================== */

/* foaie de hârtie, cu colț îndoit și rânduri */
function paper(parent, w = 120, h = 150, o = {}) {
  const g = G(parent);
  E('rect', { x: -w / 2 + 4, y: -h / 2 + 6, width: w, height: h, rx: 6, fill: '#000', 'fill-opacity': .18 }, g);
  E('path', { d: `M${-w / 2},${-h / 2} H${w / 2 - 18} L${w / 2},${-h / 2 + 18} V${h / 2} H${-w / 2} Z`, fill: o.fill || C.paper }, g);
  E('path', { d: `M${w / 2 - 18},${-h / 2} V${-h / 2 + 18} H${w / 2} Z`, fill: C.paper2 }, g);
  if (o.color) E('rect', { x: -w / 2, y: -h / 2, width: Math.max(6, w * .06), height: h, fill: o.color }, g);
  const top = o.label ? -h / 2 + Math.min(h * .34, 40) : -h / 2 + h * .18;
  const n = o.lines != null ? o.lines : Math.max(2, Math.floor((h / 2 - top) / 16));
  for (let i = 0; i < n; i++) E('rect', { x: -w / 2 + w * .14, y: top + i * Math.min(16, (h / 2 - top - 8) / n) + 4, width: w * .72 * (i === n - 1 ? .55 : (.8 + hash(i + w) * .2)), height: Math.max(3, Math.min(5, h * .03)), rx: 2, fill: '#CFC6B2' }, g);
  if (o.label) TX(g, -w / 2 + w * .14, -h / 2 + Math.min(h * .24, 28), o.label, o.size || Math.min(18, h * .14), C.ink, { w: 700 });
  return g;
}
/* bilet (ticket) cu margine zimțată */
function ticket(parent, w = 150, h = 90, o = {}) {
  const g = G(parent); let d = `M${-w / 2},${-h / 2} H${w / 2} V${h / 2}`;
  const n = 10; for (let i = 0; i < n; i++) { const x = w / 2 - (i + .5) * w / n; d += ` L${x},${h / 2 - 7} L${w / 2 - (i + 1) * w / n},${h / 2}`; }
  d += ` Z`;
  E('path', { d, fill: '#000', 'fill-opacity': .18, transform: 'translate(4,6)' }, g);
  E('path', { d, fill: o.fill || '#FFF1C9' }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: 18, fill: o.band || '#F2994A' }, g);
  TX(g, -w / 2 + 10, -h / 2 + 14, o.title || 'TICKET', 12, '#fff', { w: 800, ls: 2 });
  if (o.text) TX(g, -w / 2 + 10, -h / 2 + 40, o.text, o.size || 15, '#3B2E14', { w: 600, lh: 1.3 });
  else for (let i = 0; i < 3; i++) E('rect', { x: -w / 2 + 10, y: -h / 2 + 30 + i * 13, width: (w - 20) * (i === 2 ? .5 : 1), height: 5, rx: 2.5, fill: '#D9C495' }, g);
  return g;
}
function folder(parent, w = 150, h = 110, o = {}) {
  const g = G(parent); const c = o.color || '#E9B44C';
  E('path', { d: `M${-w / 2},${-h / 2 + 12} V${h / 2} H${w / 2} V${-h / 2 + 12} H${-w / 2 + w * .38} L${-w / 2 + w * .3},${-h / 2} H${-w / 2 + 6} Z`, fill: shade(c, -.15) }, g);
  E('rect', { x: -w / 2, y: -h / 2 + 24, width: w, height: h - 24, rx: 6, fill: c }, g);
  if (o.label) TX(g, 0, h / 2 - (h - 24) / 2 + 12, o.label, o.size || 18, '#4A3510', { a: 'middle', w: 800 });
  return g;
}
function notebook(parent, w = 170, h = 210, o = {}) {
  const g = G(parent); const c = o.color || '#9B5DE5';
  E('rect', { x: -w / 2 + 5, y: -h / 2 + 7, width: w, height: h, rx: 10, fill: '#000', 'fill-opacity': .2 }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: c }, g);
  E('rect', { x: -w / 2 + 16, y: -h / 2 + 10, width: w - 26, height: h - 20, rx: 6, fill: C.paper }, g);
  for (let i = 0; i < 7; i++) { const y = -h / 2 + 22 + i * (h - 40) / 6; E('circle', { cx: -w / 2 + 8, cy: y, r: 5, fill: '#2B2F45' }, g); E('rect', { x: -w / 2 + 3, y: y - 2, width: 18, height: 4, rx: 2, fill: '#B8BDCC' }, g); }
  if (o.label) TX(g, 8, -h / 2 + 38, o.label, 20, shade(c, -.3), { a: 'middle', w: 800 });
  return g;
}
function clipboard(parent, w = 130, h = 170) {
  const g = G(parent);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: '#A0672E' }, g);
  E('rect', { x: -w / 2 + 10, y: -h / 2 + 18, width: w - 20, height: h - 28, rx: 4, fill: C.paper }, g);
  E('rect', { x: -26, y: -h / 2 - 8, width: 52, height: 22, rx: 6, fill: '#B8BDCC' }, g);
  const rows = []; for (let i = 0; i < 4; i++) { const y = -h / 2 + 44 + i * 28; const box = E('rect', { x: -w / 2 + 20, y: y - 9, width: 16, height: 16, rx: 3, fill: 'none', stroke: '#8D8574', 'stroke-width': 2 }, g);
    E('rect', { x: -w / 2 + 44, y: y - 3, width: w - 66, height: 5, rx: 2.5, fill: '#CFC6B2' }, g);
    const ck = E('path', { d: `M${-w / 2 + 22},${y - 1} l5,5 l9,-11`, stroke: C.green, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, g); rows.push({ box, ck }); }
  g.rows = rows; return g;
}
function sticky(parent, text, color = '#FFE066', o = {}) {
  const g = G(parent); const w = o.w || 150, h = o.h || 120;
  E('rect', { x: -w / 2 + 4, y: -h / 2 + 6, width: w, height: h, fill: '#000', 'fill-opacity': .18 }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: color }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: 14, fill: '#000', 'fill-opacity': .06 }, g);
  E('circle', { cx: 0, cy: -h / 2 + 7, r: 6, fill: o.pin || '#E84855' }, g);
  TX(g, 0, -h / 2 + 42, text, o.size || 19, '#3A3020', { a: 'middle', w: 700, hand: true, lh: 1.2 });
  return g;
}

/* icoane de unelte (desen cu linie) */
function icon(p, name, size = 48, color = '#F4F1EA', sw = 3) {
  const g = E('g', { transform: 'scale(' + (size / 48) + ')', fill: 'none', stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
  const P = d => E('path', { d }, g);
  switch (name) {
    case 'file': P('M-13,-19 H5 L14,-10 V19 H-13 Z'); P('M5,-19 V-10 H14'); P('M-6,-1 H7 M-6,6 H7 M-6,13 H2'); break;
    case 'term': E('rect', { x: -19, y: -15, width: 38, height: 30, rx: 5 }, g); P('M-11,-5 L-5,0 L-11,5'); P('M0,7 H10'); break;
    case 'hammer': { const h = E('g', { transform: 'rotate(40)' }, g); E('rect', { x: -3, y: -6, width: 6, height: 28, rx: 2 }, h); E('rect', { x: -15, y: -18, width: 30, height: 12, rx: 3 }, h); break; }
    case 'phone': E('rect', { x: -12, y: -20, width: 24, height: 40, rx: 6 }, g); P('M-4,-15 H4'); break;
    case 'camera': E('rect', { x: -19, y: -10, width: 38, height: 25, rx: 5 }, g); P('M-8,-10 L-5,-16 H5 L8,-10'); E('circle', { cx: 0, cy: 2, r: 7 }, g); break;
    case 'lupa': E('circle', { cx: -4, cy: -4, r: 12 }, g); P('M5,5 L16,16'); break;
    case 'check': P('M-13,0 L-4,9 L14,-10'); break;
    case 'cross': P('M-10,-10 L10,10 M10,-10 L-10,10'); break;
    case 'lock': E('rect', { x: -13, y: -3, width: 26, height: 20, rx: 4 }, g); P('M-8,-3 V-9 A8,8 0 0 1 8,-9 V-3'); break;
    case 'person': E('circle', { cx: 0, cy: -9, r: 8 }, g); P('M-15,18 C-15,3 15,3 15,18'); break;
    case 'clock': E('circle', { r: 17 }, g); P('M0,-10 V0 L8,6'); break;
    case 'folder': P('M-19,-13 H-6 L-2,-8 H19 V15 H-19 Z'); break;
    case 'chat': P('M-19,-15 H19 V9 H-3 L-12,17 V9 H-19 Z'); break;
    case 'list': P('M-8,-12 H16 M-8,0 H16 M-8,12 H16'); E('circle', { cx: -15, cy: -12, r: 1.5 }, g); E('circle', { cx: -15, cy: 0, r: 1.5 }, g); E('circle', { cx: -15, cy: 12, r: 1.5 }, g); break;
    case 'team': E('circle', { cx: 0, cy: -10, r: 7 }, g); E('circle', { cx: -15, cy: 6, r: 6 }, g); E('circle', { cx: 15, cy: 6, r: 6 }, g); break;
    case 'loop': P('M-14,-4 A15,15 0 0 1 13,-8'); P('M14,4 A15,15 0 0 1 -13,8'); P('M13,-8 L14,-16 M13,-8 L5,-7'); P('M-13,8 L-14,16 M-13,8 L-5,7'); break;
    case 'bulb': P('M-9,8 C-18,0 -14,-18 0,-18 C14,-18 18,0 9,8 V13 H-9 Z'); P('M-6,18 H6'); break;
    case 'gear': E('circle', { r: 8 }, g); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; P(`M${Math.cos(a) * 12},${Math.sin(a) * 12} L${Math.cos(a) * 18},${Math.sin(a) * 18}`); } break;
  }
  return g;
}

/* unelte desenate plin (în mâna roboților) */
function hammer(parent, s = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  E('rect', { x: -5, y: -10, width: 10, height: 70, rx: 4, fill: '#A0672E' }, g);
  E('rect', { x: -5, y: 40, width: 10, height: 20, rx: 4, fill: '#7A4B1E' }, g);
  E('path', { d: 'M-30,-26 H22 Q34,-26 34,-14 V-4 H-30 Z', fill: '#8E9AAF' }, g);
  E('path', { d: 'M-30,-26 H-20 V-4 H-30 Z', fill: '#6C7890' }, g);
  return g;
}
function wrench(parent, s = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  E('rect', { x: -5, y: -6, width: 10, height: 64, rx: 5, fill: '#9AA6BD' }, g);
  E('path', { d: 'M-16,-30 A18,18 0 1 0 16,-30 L8,-30 L8,-16 L-8,-16 L-8,-30 Z', fill: '#9AA6BD' }, g);
  return g;
}
function magnifier(parent, s = 1, col = '#C9A227') {
  const g = G(parent, { transform: `scale(${s})` });
  E('rect', { x: -5, y: 20, width: 10, height: 44, rx: 5, fill: '#5B3A1E', transform: 'rotate(-35)' }, g);
  E('circle', { r: 30, fill: '#BFEFFF', 'fill-opacity': .35, stroke: col, 'stroke-width': 8 }, g);
  E('path', { d: 'M-16,-10 Q-12,-20 -2,-22', stroke: '#fff', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .8 }, g);
  return g;
}
function cameraProp(parent, s = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  E('rect', { x: -40, y: -24, width: 80, height: 54, rx: 10, fill: '#3A3F55' }, g);
  E('rect', { x: -18, y: -34, width: 34, height: 14, rx: 4, fill: '#3A3F55' }, g);
  E('circle', { cx: 0, cy: 3, r: 20, fill: '#1B1F2E' }, g); E('circle', { cx: 0, cy: 3, r: 13, fill: '#4D96FF' }, g); E('circle', { cx: -5, cy: -2, r: 4, fill: '#fff', 'fill-opacity': .7 }, g);
  E('rect', { x: 22, y: -18, width: 12, height: 7, rx: 2, fill: '#F7C948' }, g);
  return g;
}
function megaphone(parent, s = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  E('path', { d: 'M-30,-10 L20,-34 L20,34 L-30,10 Z', fill: '#E84855' }, g); E('rect', { x: -42, y: -12, width: 16, height: 24, rx: 4, fill: '#C9CFDE' }, g);
  E('ellipse', { cx: 20, cy: 0, rx: 8, ry: 34, fill: '#B83240' }, g);
  return g;
}
function bookProp(parent, color = '#4D96FF', s = 1, open = 0) {
  const g = G(parent, { transform: `scale(${s})` });
  if (open) { E('path', { d: 'M0,-30 Q-30,-38 -62,-30 V30 Q-30,22 0,30 Z', fill: C.paper }, g); E('path', { d: 'M0,-30 Q30,-38 62,-30 V30 Q30,22 0,30 Z', fill: C.paper2 }, g);
    for (let i = 0; i < 4; i++) { E('rect', { x: -52, y: -18 + i * 11, width: 40, height: 3, fill: '#CFC6B2' }, g); E('rect', { x: 12, y: -18 + i * 11, width: 40, height: 3, fill: '#CFC6B2' }, g); }
    E('path', { d: 'M-64,30 Q-30,24 0,34 Q30,24 64,30 V36 Q30,30 0,40 Q-30,30 -64,36 Z', fill: color }, g); }
  else { E('rect', { x: -26, y: -36, width: 52, height: 72, rx: 5, fill: color }, g); E('rect', { x: 20, y: -34, width: 6, height: 68, fill: C.paper2 }, g); E('rect', { x: -18, y: -20, width: 30, height: 6, rx: 3, fill: '#fff', 'fill-opacity': .5 }, g); }
  return g;
}
function gear(parent, r = 40, teeth = 10, color = '#8E9AAF') {
  const g = G(parent); let d = '';
  for (let i = 0; i < teeth * 2; i++) { const a = i / (teeth * 2) * Math.PI * 2, a2 = (i + 1) / (teeth * 2) * Math.PI * 2, rr = i % 2 ? r : r * 1.18;
    d += (i ? ' L' : 'M') + f2(Math.cos(a) * rr) + ',' + f2(Math.sin(a) * rr) + ' L' + f2(Math.cos(a2) * rr) + ',' + f2(Math.sin(a2) * rr); }
  E('path', { d: d + ' Z', fill: color }, g); E('circle', { r: r * .35, fill: shade(color, -.35) }, g); E('circle', { r: r * .62, fill: 'none', stroke: shade(color, -.15), 'stroke-width': r * .12 }, g);
  return g;
}
/* gândac de cod (bug), cu picioare care se mișcă */
function bugProp(parent, s = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  const legs = [];
  for (let i = 0; i < 3; i++) [-1, 1].forEach(sd => legs.push(E('path', { stroke: '#2B1B17', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g)));
  E('ellipse', { cx: 0, cy: 0, rx: 26, ry: 32, fill: '#E84855' }, g);
  E('path', { d: 'M0,-32 V32', stroke: '#2B1B17', 'stroke-width': 3 }, g);
  [[-11, -8], [11, 4], [-10, 16], [12, -18]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 5, fill: '#2B1B17' }, g));
  E('circle', { cx: 0, cy: -36, r: 14, fill: '#2B1B17' }, g);
  [-1, 1].forEach(sd => { E('circle', { cx: sd * 6, cy: -40, r: 5, fill: '#fff' }, g); E('circle', { cx: sd * 6 + 1, cy: -40, r: 2.5, fill: '#000' }, g); E('path', { d: `M${sd * 5},-48 Q${sd * 14},-64 ${sd * 22},-60`, stroke: '#2B1B17', 'stroke-width': 3, fill: 'none' }, g); });
  g.anim = at => legs.forEach((l, i) => { const sd = i % 2 ? 1 : -1, k = Math.floor(i / 2), y = -14 + k * 14, w = Math.sin(at * 18 + k * 2 + (sd > 0 ? Math.PI : 0)) * 6;
    l.setAttribute('d', `M${sd * 20},${y} Q${sd * 34},${y - 6 + w} ${sd * 42},${y + 8 + w}`); });
  g.anim(0);
  return g;
}
/* abur care se ridică (ceașcă, oală) */
function steam(parent, n = 3, h = 70, col = '#FFFFFF') {
  const g = G(parent); const ps = [];
  for (let i = 0; i < n; i++) ps.push(E('path', { stroke: col, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .5 }, g));
  g.anim = at => ps.forEach((p, i) => { const ph = (at * .6 + i / n) % 1, y0 = -ph * h, x = (i - (n - 1) / 2) * 14;
    p.setAttribute('d', `M${x},${y0} q${8 * Math.sin(at * 2 + i)},-12 0,-24 q${-8 * Math.sin(at * 2 + i)},-12 0,-24`); p.setAttribute('stroke-opacity', f2(.55 * Math.sin(ph * Math.PI))); });
  return g;
}
/* scântei / steluțe */
function sparkle(parent, color = '#FFE066', r = 14) {
  const g = G(parent); E('path', { d: `M0,${-r} Q${r * .18},${-r * .18} ${r},0 Q${r * .18},${r * .18} 0,${r} Q${-r * .18},${r * .18} ${-r},0 Q${-r * .18},${-r * .18} 0,${-r} Z`, fill: color }, g); return g;
}
function paperPlane(parent, s = 1, col = '#FFFFFF') {
  const g = G(parent, { transform: `scale(${s})` });
  E('path', { d: 'M-34,0 L34,-16 L-6,8 Z', fill: col }, g); E('path', { d: 'M-6,8 L34,-16 L2,22 Z', fill: shade(col, -.15) }, g); E('path', { d: 'M-6,8 L-2,24 L4,12 Z', fill: shade(col, -.3) }, g);
  return g;
}
function lightbulb(parent, s = 1, on = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  const glow = E('circle', { r: 46, fill: '#FFE066', 'fill-opacity': .25 * on }, g);
  E('path', { d: 'M-20,8 C-36,-8 -28,-40 0,-40 C28,-40 36,-8 20,8 L16,22 H-16 Z', fill: on ? '#FFE066' : '#D8D2BC' }, g);
  E('rect', { x: -15, y: 22, width: 30, height: 16, rx: 4, fill: '#9AA6BD' }, g);
  E('path', { d: 'M-8,-6 Q0,-14 8,-6', stroke: '#E0A82E', 'stroke-width': 3, fill: 'none' }, g);
  g.glow = glow; return g;
}
/* lumină de alarmă rotativă */
function alarmLight(parent, s = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  const beam = E('path', { d: 'M0,-20 L160,-70 L160,30 Z', fill: '#FF4D4D', 'fill-opacity': .18 }, g);
  E('rect', { x: -26, y: 0, width: 52, height: 14, rx: 4, fill: '#3A3F55' }, g);
  const dome = E('path', { d: 'M-20,0 V-18 Q-20,-38 0,-38 Q20,-38 20,-18 V0 Z', fill: '#E84855' }, g);
  g.anim = (at, on) => { op(beam, on ? .9 : 0); beam.setAttribute('transform', `rotate(${(at * 300) % 360} 0 -18)`); dome.setAttribute('fill', on ? (Math.sin(at * 10) > 0 ? '#FF6B6B' : '#C92A3A') : '#7A3540'); };
  return g;
}
/* plantă în ghiveci care se leagănă */
function plant(parent, s = 1) {
  const g = G(parent, { transform: `scale(${s})` });
  const leaves = G(g);
  [[-30, -70, -25], [0, -90, 0], [28, -72, 25], [-16, -50, -50], [18, -54, 48]].forEach(([x, y, r]) => E('ellipse', { cx: x, cy: y, rx: 14, ry: 34, fill: r % 2 ? '#3BB273' : '#2E9C62', transform: `rotate(${r} ${x} ${y})` }, leaves));
  E('path', { d: 'M-30,-24 H30 L24,20 H-24 Z', fill: '#C8693B' }, g); E('rect', { x: -34, y: -30, width: 68, height: 10, rx: 4, fill: '#D97E4E' }, g);
  g.anim = at => leaves.setAttribute('transform', `rotate(${f2(Math.sin(at * .9) * 3)} 0 -20)`);
  return g;
}
function mug(parent, s = 1, color = '#E84855') {
  const g = G(parent, { transform: `scale(${s})` });
  E('path', { d: 'M16,-22 Q34,-22 34,-6 Q34,10 16,10', stroke: color, 'stroke-width': 7, fill: 'none' }, g);
  E('path', { d: 'M-20,-30 H20 V14 Q20,22 12,22 H-12 Q-20,22 -20,14 Z', fill: color }, g);
  E('ellipse', { cx: 0, cy: -30, rx: 20, ry: 5, fill: '#5A3420' }, g);
  const st = steam(g, 3, 60); tf(st, 0, -34); g.anim = at => st.anim(at);
  return g;
}
function wallClock(parent, r = 40) {
  const g = G(parent);
  E('circle', { r: r + 6, fill: '#6B4A2B' }, g); E('circle', { r, fill: '#FBF7EE' }, g);
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; E('rect', { x: -1.5, y: -r + 4, width: 3, height: i % 3 ? 5 : 9, fill: '#3A3020', transform: `rotate(${i * 30})` }, g); }
  const hh = E('rect', { x: -2.5, y: -r * .5, width: 5, height: r * .55, rx: 2.5, fill: '#2B2B35' }, g);
  const mh = E('rect', { x: -2, y: -r * .8, width: 4, height: r * .85, rx: 2, fill: '#2B2B35' }, g);
  const sh2 = E('rect', { x: -1, y: -r * .85, width: 2, height: r * .95, fill: '#E84855' }, g);
  E('circle', { r: 4, fill: '#E84855' }, g);
  g.anim = at => { hh.setAttribute('transform', `rotate(${(at * .5) % 360 + 120})`); mh.setAttribute('transform', `rotate(${(at * 6) % 360})`); sh2.setAttribute('transform', `rotate(${Math.floor(at) * 6 % 360})`); };
  return g;
}

/* laptop văzut din față-lateral; ecranul e un grup în care se poate scrie */
function laptop(parent, o = {}) {
  const g = G(parent); const w = o.w || 300, h = o.h || 190;
  E('path', { d: `M${-w / 2 - 30},20 L${w / 2 + 30},20 L${w / 2 + 10},0 L${-w / 2 - 10},0 Z`, fill: '#AEB6C8' }, g);
  E('path', { d: `M${-w / 2 - 30},20 L${w / 2 + 30},20 L${w / 2 + 30},28 L${-w / 2 - 30},28 Z`, fill: '#8C95AA' }, g);
  E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 12, fill: '#2B2F45' }, g);
  const scr = G(g); tf(scr, -w / 2 + 10, -h + 10);
  E('rect', { x: 0, y: 0, width: w - 20, height: h - 20, rx: 6, fill: o.screen || '#F4F6FB' }, scr);
  const glow = E('ellipse', { cx: 0, cy: -h / 2, rx: w * .9, ry: h * .9, fill: rgrad([[0, '#9CC8FF', .9], [1, '#9CC8FF', 0]]), 'fill-opacity': 0 }, g);
  g.insertBefore(glow, g.firstChild);
  g.screen = scr; g.glow = glow; g.sw = w - 20; g.sh = h - 20;
  return g;
}

/* iPhone + aplicația de rețete (ecran 300×620, colț stânga-sus = 0,0) */
function phone(parent, s = 1) {
  const g = G(parent); tf(g, 0, 0, 0, s);
  E('rect', { x: -17, y: -17, width: 334, height: 654, rx: 56, fill: '#0B0E16' }, g);
  E('rect', { x: -13, y: -13, width: 326, height: 646, rx: 52, fill: '#1E2333' }, g);
  const screen = G(g, { 'clip-path': clipRect(0, 0, 300, 620, 40) });
  E('rect', { x: 108, y: 10, width: 84, height: 25, rx: 12.5, fill: '#000' }, g);
  E('path', { d: 'M20,8 Q150,-6 280,8', stroke: '#fff', 'stroke-opacity': .07, 'stroke-width': 6, fill: 'none' }, g);
  g.screen = screen; return g;
}
const RECIPES = [
  { t: 'Sarmale', s: '9 ingredients · 3 h', a: '#B8573A', b: '#7FA35A' },
  { t: 'Sponge cake', s: '8 ingredients · 1 h', a: '#D9A657', b: '#8B5A2E' },
  { t: 'Chicken soup', s: '10 ingredients · 1 h', a: '#E3B24F', b: '#CF6A3F' },
  { t: 'Papanași', s: '7 ingredients · 40 min', a: '#E6CFA8', b: '#7E2F55' },
];
const SHOP = ['1 kg minced meat', '1 sour cabbage', '200 g rice', '2 onions', 'Sour cream'];
const HEART = 'M0,7 C-12,-2 -9,-14 0,-8 C9,-14 12,-2 0,7 Z';
function appUI(p) {
  const g = G(p);
  E('rect', { x: 0, y: 0, width: 300, height: 620, fill: '#FBF7F2' }, g);
  TX(g, 30, 31, '9:41', 14, '#222', { w: 700 });
  E('rect', { x: 244, y: 21, width: 24, height: 11, rx: 3, fill: 'none', stroke: '#222', 'stroke-width': 1.5 }, g); E('rect', { x: 246, y: 23, width: 16, height: 7, rx: 1.5, fill: '#222' }, g);
  const L = G(g);
  const title = TX(L, 18, 86, 'Family Recipes', 27, '#2A211B', { w: 800 });
  E('rect', { x: 16, y: 102, width: 268, height: 38, rx: 11, fill: '#EFE8DF' }, L);
  const ic = G(L, { transform: 'translate(36,121)' }); icon(ic, 'lupa', 16, '#8F857B', 3);
  const q = TX(L, 52, 127, 'Search recipes', 15, '#9C9288', {});
  const rows = RECIPES.map((r, i) => {
    const n = G(L); tf(n, 0, 156 + i * 80);
    E('rect', { x: 16, y: 0, width: 268, height: 70, rx: 14, fill: '#fff', stroke: '#EFE6DA', 'stroke-width': 1.2 }, n);
    E('rect', { x: 24, y: 7, width: 56, height: 56, rx: 11, fill: r.a }, n);
    E('circle', { cx: 52, cy: 35, r: 20, fill: '#fff', 'fill-opacity': .85 }, n); E('circle', { cx: 52, cy: 35, r: 13, fill: r.b }, n);
    E('circle', { cx: 47, cy: 30, r: 4, fill: '#fff', 'fill-opacity': .45 }, n);
    TX(n, 92, 31, r.t, 16, '#2A211B', { w: 700 }); TX(n, 92, 52, r.s, 12, '#8E8378', {});
    const h = E('path', { d: HEART, transform: 'translate(258,35) scale(1.25)', fill: 'none', stroke: '#C9BEB2', 'stroke-width': 1.6 }, n);
    return { n, h };
  });
  const btn = G(L);
  E('rect', { x: 16, y: 484, width: 268, height: 46, rx: 13, fill: '#E07A3F' }, btn);
  TX(btn, 150, 513, '+ Add a recipe', 17, '#fff', { a: 'middle', w: 700 });
  const S = G(g);
  TX(S, 18, 86, 'Shopping list', 27, '#2A211B', { w: 800 });
  TX(S, 18, 116, 'for: Sarmale', 15, '#8E8378', {});
  const items = SHOP.map((s, i) => {
    const n = G(S); tf(n, 0, 140 + i * 62);
    E('rect', { x: 16, y: 0, width: 268, height: 52, rx: 12, fill: '#fff', stroke: '#EFE6DA', 'stroke-width': 1.2 }, n);
    const box = E('rect', { x: 30, y: 15, width: 22, height: 22, rx: 6, fill: '#fff', stroke: '#BDB2A6', 'stroke-width': 2 }, n);
    const ck = E('path', { d: 'M35,26 L40,31 L48,21', fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, n);
    const t = TX(n, 66, 32, s, 16, '#2A211B', { w: 500 });
    const st = E('rect', { x: 64, y: 26, width: s.length * 7.6, height: 2, fill: '#8E8378' }, n);
    return { box, ck, t, st };
  });
  E('rect', { x: 0, y: 556, width: 300, height: 64, fill: '#FFFFFF' }, g); E('rect', { x: 0, y: 556, width: 300, height: 1, fill: '#EDE4D9' }, g);
  const tabs = ['Recipes', 'Favourites', 'Shopping'].map((s, i) => { const x = 50 + i * 100;
    const c = E('circle', { cx: x, cy: 576, r: 8, fill: '#C9BEB2' }, g); const t = TX(g, x, 600, s, 11, '#9C9288', { a: 'middle', w: 600 }); return { c, t }; });
  const tap = E('circle', { r: 22, fill: '#000', 'fill-opacity': .12 }, g);
  const set = st => {
    const bug = st.bug || 0;
    title.setAttribute('font-size', f2(lerp(27, 11, bug)));
    tf(btn, 150 * bug, 0);
    q.textContent = st.q ? st.q + (st.qc ? '|' : '') : 'Search recipes'; q.setAttribute('fill', st.q ? '#2A211B' : '#9C9288');
    const fp = st.fp || 0;
    rows.forEach((r, i) => { op(r.n, i === 0 ? 1 : 1 - fp);
      const fav = i === 0 && st.fav > 0; r.h.setAttribute('fill', fav ? '#E5484D' : 'none'); r.h.setAttribute('stroke', fav ? '#E5484D' : '#C9BEB2');
      const sc = fav ? 1.25 * (1 + .4 * Math.sin(Math.PI * clamp(st.fav))) : 1.25; r.h.setAttribute('transform', `translate(258,35) scale(${f2(sc)})`); });
    const sh = st.shop || 0; op(L, 1 - sh); op(S, sh);
    items.forEach((it, i) => { const c = (st.checked || 0) > i; it.box.setAttribute('fill', c ? '#56A86F' : '#fff'); it.box.setAttribute('stroke', c ? '#56A86F' : '#BDB2A6');
      op(it.ck, c ? 1 : 0); it.t.setAttribute('fill', c ? '#A39A90' : '#2A211B'); op(it.st, c ? 1 : 0); });
    const at2 = sh > .5 ? 2 : (st.tab || 0);
    tabs.forEach((t, i) => { t.c.setAttribute('fill', i === at2 ? '#E07A3F' : '#C9BEB2'); t.t.setAttribute('fill', i === at2 ? '#E07A3F' : '#9C9288'); });
    if (st.tap) { op(tap, st.tap.o); tap.setAttribute('cx', st.tap.x); tap.setAttribute('cy', st.tap.y); tap.setAttribute('r', f2(16 + 14 * st.tap.o)); } else op(tap, 0);
  };
  set({});
  return { g, set };
}

/* monitor mare cu editor de cod */
function monitor(parent, w = 640, h = 420) {
  const g = G(parent);
  E('rect', { x: -40, y: h / 2 + 10, width: 80, height: 60, fill: '#3A3F55' }, g);
  E('rect', { x: -110, y: h / 2 + 66, width: 220, height: 16, rx: 8, fill: '#2B2F45' }, g);
  E('rect', { x: -w / 2 - 14, y: -h / 2 - 14, width: w + 28, height: h + 28, rx: 20, fill: '#22263A' }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, fill: '#0F1424' }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: 34, rx: 8, fill: '#191F33' }, g);
  [C.red, C.gold, C.green].forEach((c, i) => E('circle', { cx: -w / 2 + 20 + i * 20, cy: -h / 2 + 17, r: 6, fill: c, 'fill-opacity': .8 }, g));
  const content = G(g); tf(content, -w / 2 + 20, -h / 2 + 66);
  g.content = content; return g;
}
/* bloc de cod care se „tastează” singur */
function codeBlock(parent, lines, o = {}) {
  const g = G(parent); const lh = o.lh || 28, size = o.size || 19;
  const col = l => { const s = l.trim(); if (s.startsWith('struct')) return '#F7C948'; if (s.startsWith('@') || s.startsWith('.')) return '#C39BFF'; if (s.startsWith('var') || s.startsWith('let')) return '#7CC4FF'; if (s === '}' || s === '') return '#8A95B5'; return '#E2E7F3'; };
  const nodes = lines.map((l, i) => TX(g, 0, i * lh, '', size, col(l), { mono: true }));
  const total = lines.reduce((a, s) => a + s.length, 0);
  g.total = total;
  g.type = (n, cursor) => { let acc = 0; lines.forEach((s, i) => { const k = clamp(n - acc, 0, s.length); const cur = cursor && n >= acc && n < acc + s.length + (i === lines.length - 1 ? 1 : 0) && n < total; nodes[i].textContent = s.slice(0, k) + (cur ? '▌' : ''); acc += s.length; }); };
  g.lh = lh;
  return g;
}

/* semn de lemn (pentru capitole și etichete) */
function woodSign(parent, w, h, text, o = {}) {
  const g = G(parent);
  E('rect', { x: -w / 2 + 6, y: 8, width: w, height: h, rx: 14, fill: '#000', 'fill-opacity': .22 }, g);
  E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 14, fill: o.fill || '#B9814A' }, g);
  E('rect', { x: -w / 2 + 8, y: 8, width: w - 16, height: h - 16, rx: 9, fill: 'none', stroke: '#8A5A2B', 'stroke-width': 3 }, g);
  for (let i = 0; i < 3; i++) E('path', { d: `M${-w / 2 + 20},${h * (.3 + i * .22)} q${w * .3},${-6 + i * 4} ${w * .6},0`, stroke: '#A8733F', 'stroke-width': 2, fill: 'none', opacity: .7 }, g);
  if (text) TX(g, 0, h / 2 + (o.size || 30) * .36, text, o.size || 30, o.color || '#FFF6E5', { a: 'middle', w: 800 });
  return g;
}
