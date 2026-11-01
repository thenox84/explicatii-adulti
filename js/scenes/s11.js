"use strict";
/* SCENA 11 — Tot drumul: harta cu stațiile, căruciorul agentului, porțile omului */
SCENE(11, { build(world, cue) {
  const L = cue, Le = cue.e;
  const cam = G(world);
  const amb = [];
  /* ---------- cer și peisaj ---------- */
  E('rect', { x: -300, y: -300, width: 2200, height: 700, fill: lgrad([[0, '#7CC6F5'], [1, '#DDF2FF']]) }, cam);
  const sun = G(cam); tf(sun, 1530, 80);
  const rays = G(sun); for (let i = 0; i < 12; i++) E('rect', { x: -4, y: -92, width: 8, height: 26, rx: 4, fill: '#FFE58A', transform: `rotate(${i * 30})` }, rays);
  E('circle', { r: 52, fill: '#FFE58A' }, sun); E('circle', { r: 40, fill: '#FFD45C' }, sun);
  const clouds = [0, 1, 2, 3, 4].map(i => { const c = G(cam); const w = 70 + hash(i + 2) * 50;
    [[0, 0, w], [w * .8, -18, w * .7], [w * 1.5, 0, w * .6], [-w * .6, 6, w * .5]].forEach(([x, y, r]) => E('ellipse', { cx: x, cy: y, rx: r, ry: r * .5, fill: '#fff', 'fill-opacity': .92 }, c));
    return { c, y: 60 + hash(i + 7) * 170, sp: 10 + hash(i) * 14, off: hash(i + 3) * 2000, s: .5 + hash(i + 11) * .5 }; });
  /* munți îndepărtați */
  E('path', { d: 'M-300,330 L-120,200 L40,300 L220,170 L420,310 L600,190 L790,320 L980,180 L1180,300 L1360,190 L1560,310 L1760,200 L1900,330 V500 H-300 Z', fill: '#A8C3E0' }, cam);
  E('path', { d: 'M220,170 L260,200 L235,205 L250,225 L200,215 Z M980,180 L1020,212 L995,214 L1010,232 L962,220 Z M1360,190 L1396,218 L1374,220 L1386,236 L1344,226 Z', fill: '#fff', 'fill-opacity': .85 }, cam);
  /* dealuri */
  E('path', { d: 'M-300,380 Q100,280 500,360 T1300,330 T1900,350 V1200 H-300 Z', fill: '#8FD07A' }, cam);
  E('path', { d: 'M-300,470 Q300,380 800,450 T1900,420 V1200 H-300 Z', fill: '#7BC46A' }, cam);
  /* câmpuri cu dungi */
  const fields = G(cam);
  [[120, 470, 220, 70, '#B6DB7A'], [560, 440, 180, 60, '#E8D47A'], [1500, 560, 200, 80, '#B6DB7A'], [700, 720, 260, 60, '#E8D47A']].forEach(([x, y, w, h, c]) => {
    const f = G(fields, { 'clip-path': clipRect(x, y, w, h, 18) }); E('rect', { x, y, width: w, height: h, rx: 18, fill: c }, f);
    for (let k = 0; k < 12; k++) E('path', { d: `M${x + k * 24},${y + h} L${x + k * 24 + 40},${y}`, stroke: shade(c, -.15), 'stroke-width': 5 }, f); });
  /* lac */
  E('ellipse', { cx: 560, cy: 790, rx: 170, ry: 40, fill: '#6EC1E4' }, cam);
  const ripples = [0, 1, 2].map(i => E('ellipse', { cx: 520 + i * 40, cy: 790, rx: 30, ry: 5, fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-opacity': .6 }, cam));
  /* moară de vânt */
  const mill = G(cam); tf(mill, 70, 420);
  E('path', { d: 'M-26,0 L-16,-120 L16,-120 L26,0 Z', fill: '#F3E3C3' }, mill); E('path', { d: 'M-22,-120 L0,-150 L22,-120 Z', fill: '#B5532F' }, mill);
  E('rect', { x: -8, y: -30, width: 16, height: 30, rx: 8, fill: '#8A5A3B' }, mill);
  const blades = G(mill); tf(blades, 0, -120); for (let i = 0; i < 4; i++) { const b = G(blades, { transform: `rotate(${i * 90})` }); E('rect', { x: -5, y: -86, width: 10, height: 86, fill: '#8A5A3B' }, b); E('rect', { x: 5, y: -84, width: 20, height: 62, fill: '#FFF8E6', stroke: '#8A5A3B', 'stroke-width': 2 }, b); }
  E('circle', { cx: 0, cy: -120, r: 8, fill: '#5A3B2B' }, mill);
  /* copaci */
  const trees = [[40, 560], [300, 470], [470, 420], [700, 470], [930, 640], [960, 280], [1240, 300], [1560, 400], [1530, 700], [260, 760], [880, 760], [1380, 760], [1100, 680]].map(([x, y], i) => {
    const t = G(cam); tf(t, x, y); const s = .7 + hash(i + 40) * .5;
    E('rect', { x: -6 * s, y: -30 * s, width: 12 * s, height: 34 * s, rx: 4, fill: '#7A5230' }, t);
    const cr = G(t); E('circle', { cx: 0, cy: -52 * s, r: 32 * s, fill: i % 2 ? '#3E9B4F' : '#4FAE5A' }, cr); E('circle', { cx: -14 * s, cy: -62 * s, r: 18 * s, fill: '#6CC46A', 'fill-opacity': .7 }, cr);
    return { cr, ph: i, s }; });
  /* ---------- drumul ---------- */
  const D = 'M30,705 C90,668 120,640 170,632 C240,620 320,520 400,520 C480,520 520,620 610,620 C700,620 740,520 830,520 C905,520 950,470 1015,470 ' +
            'A115,115 0 0 0 1130,585 A115,115 0 0 0 1245,470 A115,115 0 0 0 1130,355 C1130,300 1250,318 1330,318 C1380,318 1410,318 1440,318';
  E('path', { d: D, stroke: '#C9A26B', 'stroke-width': 56, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cam);
  E('circle', { cx: 1130, cy: 470, r: 115, fill: 'none', stroke: '#C9A26B', 'stroke-width': 56 }, cam);
  const road = E('path', { d: D, stroke: '#E9CB94', 'stroke-width': 44, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cam);
  E('circle', { cx: 1130, cy: 470, r: 115, fill: 'none', stroke: '#E9CB94', 'stroke-width': 44 }, cam);
  E('path', { d: D, stroke: '#fff', 'stroke-width': 4, 'stroke-dasharray': '14 16', fill: 'none', opacity: .8 }, cam);
  E('circle', { cx: 1130, cy: 470, r: 115, fill: 'none', stroke: '#fff', 'stroke-width': 4, 'stroke-dasharray': '14 16', opacity: .8 }, cam);
  /* insula din sensul giratoriu: bucla */
  const isl = G(cam); tf(isl, 1130, 470);
  E('circle', { r: 86, fill: '#7BC46A' }, isl); E('circle', { r: 62, fill: '#8FD07A' }, isl);
  const loopI = G(isl); E('path', { d: 'M-34,-12 A36,36 0 0 1 30,-20', stroke: '#2F6F64', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, loopI);
  E('path', { d: 'M34,12 A36,36 0 0 1 -30,20', stroke: '#2F6F64', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, loopI);
  E('path', { d: 'M22,-34 L32,-18 L14,-12 Z M-22,34 L-32,18 L-14,12 Z', fill: '#2F6F64' }, loopI);
  const loopT = TX(isl, 0, 56, 'the loop', 18, '#1F4F47', { a: 'middle', w: 800 });
  /* eșantionare drum pentru cărucior */
  const NSMP = 700, Ltot = road.getTotalLength(), pts = [];
  for (let i = 0; i < NSMP; i++) { const p = road.getPointAtLength(Ltot * i / (NSMP - 1)); pts.push([p.x, p.y]); }
  const nearest = (x, y, from) => { let bi = from, bd = 1e9; for (let i = from; i < NSMP; i++) { const d = (pts[i][0] - x) ** 2 + (pts[i][1] - y) ** 2; if (d < bd) { bd = d; bi = i; } } return bi; };
  const ST = [[170, 632], [400, 520], [610, 620], [830, 520], [1015, 470], [1130, 585], [1245, 470], [1440, 318]];
  let from = 0; const stIdx = ST.map(([x, y]) => { const i = nearest(x, y, from); from = i; return i; });
  const posAt = u => { const f = clamp(u) * (NSMP - 1), i = Math.floor(f), k = f - i, a = pts[i], b = pts[Math.min(NSMP - 1, i + 1)]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; };
  /* ---------- stațiile ---------- */
  function s11_house(x, y, col, roof, ic, label, o = {}) {
    const h = G(cam); tf(h, x, y);
    const w = o.w || 100, hh = o.h || 70;
    E('ellipse', { cx: 0, cy: 4, rx: w * .62, ry: 10, fill: '#000', 'fill-opacity': .15 }, h);
    E('rect', { x: -w / 2, y: -hh, width: w, height: hh, rx: 6, fill: col }, h);
    E('rect', { x: w / 2 - 22, y: -hh, width: 22, height: hh, fill: '#000', 'fill-opacity': .1 }, h);
    E('path', { d: `M${-w / 2 - 12},${-hh} L0,${-hh - 46} L${w / 2 + 12},${-hh} Z`, fill: roof }, h);
    E('rect', { x: -12, y: -38, width: 24, height: 38, rx: 4, fill: '#7A5230' }, h);
    E('rect', { x: -w / 2 + 10, y: -hh + 14, width: 20, height: 18, rx: 3, fill: '#FFF2C4' }, h);
    E('rect', { x: w / 2 - 30, y: -hh + 14, width: 20, height: 18, rx: 3, fill: '#FFF2C4' }, h);
    const b = G(h); tf(b, 0, -hh - 22); E('circle', { r: 21, fill: '#fff', stroke: roof, 'stroke-width': 4 }, b); icon(b, ic, 24, '#2A2A35', 3.5);
    const plate = G(h); const pw = label.length * 12 + 34; tf(plate, o.lx || 0, o.ly != null ? o.ly : -hh - 74);
    E('rect', { x: -pw / 2 + 3, y: -17, width: pw, height: 34, rx: 10, fill: '#000', 'fill-opacity': .2 }, plate);
    E('rect', { x: -pw / 2, y: -20, width: pw, height: 34, rx: 10, fill: '#FFF8E6', stroke: '#8A5A2B', 'stroke-width': 2.5 }, plate);
    TX(plate, 0, 4, label, 21, '#3A2A1A', { a: 'middle', w: 800 });
    h.plate = plate; h.badge = b;
    return h;
  }
  const H = [
    s11_house(170, 600, '#F7E1C1', '#B5532F', 'chat', 'Message', { lx: -10 }),
    s11_house(400, 470, '#E3EEF9', '#4D96FF', 'lupa', 'Understanding'),
    s11_house(612, 580, '#FFF1C9', '#F2994A', 'list', 'Plan', { ly: 52 }),
    s11_house(830, 470, '#E9E1FF', '#9B5DE5', 'team', 'Helpers'),
    s11_house(925, 380, '#E5E9F0', '#5C6378', 'hammer', 'Tools', { lx: -96, ly: -40 }),
    s11_house(1290, 640, '#FFE3E3', '#E84855', 'gear', 'Errors & fixes', { ly: 50 }),
    s11_house(1370, 470, '#DDF5E8', '#3BB273', 'check', 'Checking', { ly: 50 }),
  ];
  /* casa finală pe deal, cu telefon uriaș și steag */
  const fin = G(cam); tf(fin, 1492, 304);
  E('path', { d: 'M-150,20 Q0,-40 150,20 Z', fill: '#7BC46A' }, fin);
  E('rect', { x: -70, y: -90, width: 140, height: 100, rx: 8, fill: '#FFF1C9' }, fin);
  E('path', { d: 'M-86,-90 L0,-150 L86,-90 Z', fill: '#E07A3F' }, fin);
  E('rect', { x: -14, y: -44, width: 28, height: 54, rx: 4, fill: '#7A5230' }, fin);
  const bigPh = G(fin); tf(bigPh, 46, -46); E('rect', { x: -20, y: -38, width: 40, height: 76, rx: 9, fill: '#1E2333' }, bigPh); E('rect', { x: -15, y: -31, width: 30, height: 62, rx: 6, fill: '#E07A3F' }, bigPh);
  E('path', { d: 'M-9,2 H9 V8 Q9,14 3,14 H-3 Q-9,14 -9,8 Z', fill: '#fff' }, bigPh);
  E('rect', { x: -3, y: -196, width: 6, height: 52, fill: '#5A3B2B' }, fin);
  const flag = E('path', { fill: '#E84855' }, fin);
  const finPlate = G(fin); tf(finPlate, -10, 48);
  E('rect', { x: -84, y: -20, width: 168, height: 36, rx: 10, fill: '#FFF8E6', stroke: '#8A5A2B', 'stroke-width': 2.5 }, finPlate);
  TX(finPlate, 0, 6, 'Finished app', 21, '#3A2A1A', { a: 'middle', w: 800 });
  /* cutia poștală la casa lui Tudor */
  const mb = G(cam); tf(mb, 100, 650); E('rect', { x: -3, y: -40, width: 6, height: 40, fill: '#7A5230' }, mb); E('path', { d: 'M-18,-40 V-62 Q-18,-74 0,-74 Q18,-74 18,-62 V-40 Z', fill: '#4D96FF' }, mb);
  const mbFlag = E('rect', { x: 18, y: -70, width: 4, height: 22, fill: '#E84855' }, mb);
  /* ---------- porțile omului ---------- */
  const GATES = [[455, 505, 1], [985, 520, 4], [1392, 340, 7]];
  const gates = GATES.map(([x, y], i) => {
    const g = G(cam); tf(g, x, y);
    E('rect', { x: -6, y: -60, width: 12, height: 62, rx: 4, fill: '#5C6378' }, g);
    const arm = G(g); tf(arm, 0, -50);
    E('rect', { x: 0, y: -6, width: 90, height: 12, rx: 6, fill: '#fff' }, arm); for (let k = 0; k < 4; k++) E('rect', { x: 10 + k * 22, y: -6, width: 11, height: 12, fill: '#E84855' }, arm);
    const tud = G(g); const hum = Human(tud, { seed: 4 + i });
    const ok = G(g); E('circle', { r: 20, fill: '#3BB273', stroke: '#fff', 'stroke-width': 3 }, ok); icon(ok, 'check', 22, '#fff', 5);
    return { g, arm, tud, hum, ok, x, y };
  });
  /* ---------- căruciorul cu agentul ---------- */
  const cart = G(cam);
  const cartIn = G(cart);
  const puffs = [0, 1, 2, 3].map(() => E('circle', { r: 8, fill: '#fff', 'fill-opacity': .7 }, cam));
  cam.insertBefore(puffs[0], cart); puffs.forEach(p => cam.insertBefore(p, cart));
  const botG = G(cartIn); const bot = Robot(botG, { hat: 'hard', color: '#F2994A', seed: 1 });
  const letterC = G(cartIn); tf(letterC, -44, -44, -12); paper(letterC, 34, 44, { lines: 3 });
  E('path', { d: 'M-62,-46 H62 Q70,-46 70,-38 V-6 Q70,4 60,4 H-60 Q-70,4 -70,-6 V-38 Q-70,-46 -62,-46 Z', fill: '#4D96FF' }, cartIn);
  E('path', { d: 'M-62,-46 H62 Q70,-46 70,-38 V-30 H-70 V-38 Q-70,-46 -62,-46 Z', fill: '#7DB4FF' }, cartIn);
  E('rect', { x: 52, y: -34, width: 14, height: 9, rx: 3, fill: '#FFE58A' }, cartIn);
  const wheels = [-40, 40].map(x => { const w = G(cartIn); tf(w, x, 6); E('circle', { r: 17, fill: '#2B2F45' }, w); E('circle', { r: 9, fill: '#C9CFDE' }, w);
    const sp = G(w); for (let k = 0; k < 4; k++) E('rect', { x: -1.5, y: -9, width: 3, height: 18, fill: '#5C6378', transform: `rotate(${k * 45})` }, sp); return sp; });
  /* agentul pe jos, la final */
  const botEnd = G(cam); const bot2 = Robot(botEnd, { hat: 'hard', color: '#F2994A', seed: 1 });
  /* avionul cu mesajul lui Tudor */
  const plane = G(cam); paperPlane(plane, .9, '#FFFFFF');
  /* păsări */
  const birds = [0, 1, 2, 3].map(i => E('path', { stroke: '#2B2F45', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, cam));
  /* ---------- bannerul final, tras de un dirijabil ---------- */
  const ban = G(world);
  const blimp = G(ban); tf(blimp, -520, 0);
  E('ellipse', { cx: 0, cy: 0, rx: 96, ry: 40, fill: '#F2994A' }, blimp); E('ellipse', { cx: -10, cy: -12, rx: 70, ry: 16, fill: '#F7B267' }, blimp);
  E('path', { d: 'M84,-8 L118,-34 L112,0 L118,34 L84,8 Z', fill: '#C46F1C' }, blimp);
  E('rect', { x: -26, y: 34, width: 52, height: 20, rx: 6, fill: '#5C6378' }, blimp);
  const prop = E('ellipse', { cx: 34, cy: 44, rx: 4, ry: 14, fill: '#2B2F45' }, blimp);
  const ropes = E('path', { stroke: '#5A3B2B', 'stroke-width': 3, fill: 'none' }, ban);
  const cloth = G(ban);
  const BW = 1040, BH = 128;
  const clothP = E('path', { fill: '#FFF8E6', stroke: '#E0C68E', 'stroke-width': 4 }, cloth);
  TX(cloth, 130, -10, 'An agent is not magic:', 32, '#B5532F', { a: 'middle', w: 900 });
  TX(cloth, 130, 34, 'a model that works in loops, uses tools, and checks its own work.', 27, '#2A2A35', { a: 'middle', w: 800 });
  const spk = [0, 1, 2, 3, 4, 5].map(() => sparkle(world, '#FFE066', 16));

  /* program: [timp, indice stație] */
  const SCH = [[0, 0], [L(1) - .3, 0], [L(1) + .5, 1], [L(1) + 1.3, 2], [L(1) + 2.1, 3], [L(1) + 2.9, 4], [L(2) + .8, 5], [L(2) + 2.0, 6], [L(2) + 3.3, 7]];
  return (lt, at) => {
    /* ambient */
    clouds.forEach(cl => tf(cl.c, ((cl.off + at * cl.sp) % 2100) - 250, cl.y, 0, cl.s));
    tf(rays, 0, 0, at * 8);
    blades.setAttribute('transform', `translate(0,-120) rotate(${f2(at * 60 % 360)})`);
    trees.forEach(t => tf(t.cr, 0, 0, Math.sin(at * 1.2 + t.ph) * 2.5));
    ripples.forEach((r, i) => { const k = (at * .5 + i / 3) % 1; r.setAttribute('rx', f2(20 + 50 * k)); r.setAttribute('stroke-opacity', f2(.6 * (1 - k))); });
    birds.forEach((b, i) => { const x = ((at * (40 + i * 6) + i * 420) % 2000) - 200, y = 140 + i * 36 + Math.sin(at + i) * 12, fl = Math.sin(at * 9 + i * 2) * 8;
      b.setAttribute('d', `M${f2(x - 14)},${f2(y - fl)} Q${f2(x - 7)},${f2(y - 6)} ${f2(x)},${f2(y)} Q${f2(x + 7)},${f2(y - 6)} ${f2(x + 14)},${f2(y - fl)}`); });
    const fw = Math.sin(at * 6) * 6; flag.setAttribute('d', `M3,-196 Q24,${f2(-190 + fw)} 46,-186 Q24,${f2(-178 - fw)} 3,-172 Z`);
    tf(loopI, 0, 0, -at * 40);
    /* cameră: urmărește căruciorul pe drum, apoi vedere de ansamblu */
    const sch = keyed(lt, SCH.map(([t, k]) => [t, stIdx[k]]));
    const cp = posAt(sch / (NSMP - 1)), cp2 = posAt(Math.min(1, sch / (NSMP - 1) + .004));
    const follow = prog(lt, L(1) - .6, 1) * (1 - prog(lt, Le(2), 1.2));
    const zoomIn = prog(lt, .2, 1.4) * (1 - prog(lt, L(1) - .6, 1));
    const cx = lerp(lerp(800, 380, zoomIn), lerp(800, clamp(cp[0], 600, 1000), 1), follow), cy = lerp(lerp(450, 560, zoomIn), lerp(450, clamp(cp[1], 380, 520), 1), follow);
    const z = 1 + .3 * zoomIn + .18 * follow - .03 * prog(lt, L(4), 2);
    cam.setAttribute('transform', `translate(800,450) scale(${f2(z * 1000) / 1000}) translate(${f2(-cx)},${f2(-cy)})`);
    /* avionul aduce scrisoarea */
    const fl = prog(lt, L(0) + .2, 1.6, t => t);
    const pp = arcPos(fl, [-60, 300], [cp[0] - 40, cp[1] - 60], -60);
    op(plane, fl > 0 && fl < 1 ? 1 : 0); tf(plane, pp[0], pp[1], 30 * (1 - fl), 1);
    op(letterC, fl >= 1 ? 1 : 0);
    tf(mbFlag, 0, 0, fl >= 1 ? 0 : -90);
    /* căruciorul */
    const moving = Math.abs(cp2[0] - cp[0]) + Math.abs(cp2[1] - cp[1]) > .5 && lt > SCH[1][0] && lt < SCH[SCH.length - 1][0];
    const dir = cp2[0] - cp[0] < -.2 ? -1 : 1;
    const ang = clamp(Math.atan2(cp2[1] - cp[1], Math.abs(cp2[0] - cp[0]) + .01) * 180 / Math.PI, -24, 24) * dir;
    const exit = prog(lt, SCH[SCH.length - 1][0] + .3, .6);
    tf(cart, cp[0], cp[1] - 8 - (moving ? Math.abs(Math.sin(at * 18)) * 2 : 0), ang * (dir < 0 ? -1 : 1) * (dir < 0 ? -1 : 1), 1, 1);
    tf(cartIn, 0, 0, 0, dir * .9, .9);
    wheels.forEach(w => tf(w, 0, 0, sch * 6));
    tf(botG, 6, -20, 0, 1);
    bot.set({ x: 0, y: 0, s: .36, at, face: moving ? 'joy' : 'happy', hL: [-60, -110 + (moving ? Math.sin(at * 9) * 6 : 0)], hR: moving ? [70, -230 + Math.sin(at * 10) * 10] : [62, -100], look: [1, 0], bob: moving ? -Math.abs(Math.sin(at * 9)) * 6 : Math.sin(at * 2) * 2 });
    op(botG, 1 - exit);
    puffs.forEach((p, i) => { const k = (at * 1.6 + i / 4) % 1; op(p, moving ? (1 - k) * .8 : 0); tf(p, cp[0] - dir * (60 + k * 50), cp[1] - 14 - k * 30, 0, .6 + k); });
    /* stațiile pulsează când căruciorul trece */
    H.forEach((h, i) => { const d = Math.abs(sch - stIdx[i]); const hi = clamp(1 - d / 25); const yb = -(i === 2 ? 70 : 70) - 22; h.badge.setAttribute('transform', `translate(0,${yb - 8 * hi}) scale(${f2(1 + .3 * hi)})`); });
    const fh = clamp(1 - Math.abs(sch - stIdx[7]) / 25); tf(bigPh, 46, -46 - 6 * fh, Math.sin(at * 2) * 3, 1 + .2 * fh);
    /* porțile: brațul se ridică la trecere; Tudor aprobă la rândul 3 */
    gates.forEach((g, i) => {
      const gi = stIdx[GATES[i][2]]; const near = clamp(1 - Math.abs(sch - gi) / 60);
      tf(g.arm, 0, -50, -80 * Math.max(near, prog(lt, L(3) + .3 + i * .9, .5)));
      const tp = pop(lt, L(3) + .1 + i * .9, .55);
      op(g.tud, tp > 0 ? 1 : 0); tf(g.tud, 46, 0, 0, Math.max(.01, tp));
      const wave = lt >= L(4) - .3;
      g.hum.set({ x: 0, y: 0, s: .27, at, face: 'joy', hR: [70 + (wave ? Math.sin(at * 9 + i) * 16 : 0), wave ? -330 : -300], hL: [-58, -128], look: [0, 0] });
      const ok = pop(lt, L(3) + .5 + i * .9, .45); op(g.ok, ok > 0 ? 1 : 0); tf(g.ok, 46, -128 + Math.sin(at * 3 + i) * 3, 0, Math.max(.01, ok));
    });
    /* agentul coboară și face cu mâna */
    op(botEnd, exit);
    bot2.set({ x: 1440 + 60 * exit, y: 340, s: .4, at, face: 'joy', hR: [76 + Math.sin(at * 8) * 16, -280], hL: [-62, -96], bob: Math.sin(at * 2.4) * 2, look: [-1, 0] });
    /* bannerul */
    const bi = prog(lt, L(4) - .4, 1.8, easeOut);
    op(ban, bi > 0 ? 1 : 0);
    const bx = lerp(2300, 660, bi), by = 152 + Math.sin(at * 1.2) * 5;
    tf(ban, bx, by);
    const un = prog(lt, L(4) + .6, .9, easeOut), half = BW / 2 * un, cx0 = 130 - BW / 2;
    const wv = k => f2(Math.sin(at * 2.4 + k) * 5);
    clothP.setAttribute('d', `M${cx0 + BW / 2 - half},${-BH / 2 + wv(0)} Q${cx0 + BW / 2},${-BH / 2 + wv(1) * 2} ${cx0 + BW / 2 + half},${-BH / 2 + wv(2)} L${cx0 + BW / 2 + half},${BH / 2 + wv(3)} Q${cx0 + BW / 2},${BH / 2 + wv(4) * 2} ${cx0 + BW / 2 - half},${BH / 2 + wv(5)} Z`);
    [...cloth.querySelectorAll('text')].forEach(t => op(t, prog(lt, L(4) + 1.2, .6)));
    ropes.setAttribute('d', `M-420,6 L${f2(cx0 + BW / 2 - half)},${-BH / 2 + 4} M-420,6 L${f2(cx0 + BW / 2 - half)},${BH / 2 - 4}`);
    op(ropes, un > .05 ? 1 : 0);
    tf(blimp, -520, Math.sin(at * 1.6) * 4); prop.setAttribute('ry', f2(14 * Math.abs(Math.sin(at * 30))));
    spk.forEach((s, i) => { const v = lt > L(4) + 1.6 ? 1 : 0; op(s, v * Math.abs(Math.sin(at * 1.8 + i)));
      tf(s, 230 + i * 230, 260 + Math.sin(i * 1.9) * 30 + Math.sin(at + i) * 8, at * 50, .5 + .5 * Math.abs(Math.sin(at * 2 + i))); });
  };
} });
