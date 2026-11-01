"use strict";
/* SCENA 1 — Ce este, de fapt, AI-ul: biblioteca, mașinăria „Language model”,
   token-urile, alegerea bucățică cu bucățică, avertismentul onest. */
SCENE(1, { build(world, cue) {
  const L = i => cue(i), Le = i => cue.e(i);
  const cam = G(world);

  /* ================= DECOR: sala bibliotecii ================= */
  const bg = G(cam);
  E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#24192B' }, bg);
  E('rect', { x: -200, y: -200, width: 2000, height: 920, fill: lgrad([[0, '#2E2036'], [1, '#4A3040']]) }, bg);
  /* fereastra rozetă */
  const rose = G(bg); tf(rose, 800, 40);
  E('circle', { r: 104, fill: '#5B3A2C' }, rose);
  E('circle', { r: 90, fill: rgrad([[0, '#FFE9B0'], [.6, '#F2B56B'], [1, '#C46A4A']]) }, rose);
  for (let i = 0; i < 12; i++) E('rect', { x: -3, y: -90, width: 6, height: 90, fill: '#5B3A2C', transform: `rotate(${i * 30})` }, rose);
  E('circle', { r: 26, fill: '#5B3A2C' }, rose); E('circle', { r: 16, fill: '#FFE9B0' }, rose);
  /* rafturi cu cărți (două niveluri) */
  const shelvesG = G(bg);
  const bookCols = ['#B5532F', '#2F6F64', '#C9A227', '#4D5FA8', '#7E2F55', '#3BB273', '#D9822B', '#5C4B8A', '#A33B3B', '#2E7DA6'];
  const shelfRow = (x0, x1, y, h) => {
    E('rect', { x: x0, y: y - h - 6, width: x1 - x0, height: h + 6, fill: '#2A1A14' }, shelvesG);
    let x = x0 + 4, k = 0;
    while (x < x1 - 14) {
      const r = hash(x * .37 + y * 1.3); const bw = 11 + r * 15, bh = h * (.62 + hash(x + y) * .36);
      if (hash(x * 3.1 + y) > .93) { x += 26; continue; } // gol (de unde au zburat cărți)
      const lean = hash(x + 7 * y) > .9 ? (r > .5 ? 8 : -8) : 0;
      E('rect', { x, y: y - bh, width: bw, height: bh, rx: 2, fill: bookCols[Math.floor(hash(x * 1.9 + y * .7) * 10)], transform: lean ? `rotate(${lean} ${x + bw / 2} ${y})` : '' }, shelvesG);
      if (bw > 18) E('rect', { x: x + 3, y: y - bh + 10, width: bw - 6, height: 4, fill: '#F2D49B', 'fill-opacity': .55 }, shelvesG);
      x += bw + 1.5; k++;
    }
    E('rect', { x: x0 - 6, y, width: x1 - x0 + 12, height: 12, rx: 2, fill: '#7A4E30' }, shelvesG);
  };
  /* nivelul de sus (cu loc pentru rozetă) */
  [[-200, 660], [940, 1800]].forEach(([a, b]) => { shelfRow(a, b, 30, 80); shelfRow(a, b, 140, 92); });
  /* balcon */
  E('rect', { x: -200, y: 152, width: 2000, height: 16, fill: '#6B4329' }, bg);
  const rail = G(bg); for (let x = -190; x < 1800; x += 26) E('rect', { x, y: 168, width: 9, height: 28, rx: 4, fill: '#8A5A36' }, rail);
  E('rect', { x: -200, y: 194, width: 2000, height: 10, fill: '#6B4329' }, bg);
  /* nivelul de jos */
  [[-200, 1800]].forEach(([a, b]) => { shelfRow(a, b, 330, 112); shelfRow(a, b, 470, 120); shelfRow(a, b, 610, 120); });
  /* coloane */
  for (let x = -60; x < 1800; x += 440) { E('rect', { x: x - 20, y: -200, width: 40, height: 900, fill: '#5A3824' }, bg); E('rect', { x: x - 28, y: 196, width: 56, height: 18, rx: 4, fill: '#7A4E30' }, bg); }
  /* scări pe șină */
  const ladders = [300, 1480].map(x => { const l = G(bg); E('path', { d: 'M-34,-470 L-70,0 M34,-470 L70,0', stroke: '#A8733F', 'stroke-width': 9, 'stroke-linecap': 'round' }, l);
    for (let k = 0; k < 9; k++) { const t = (k + .5) / 9; E('path', { d: `M${-34 - 36 * t},${-470 + 470 * t} H${34 + 36 * t}`, stroke: '#A8733F', 'stroke-width': 6 }, l); } return { l, x }; });
  E('rect', { x: -200, y: 222, width: 2000, height: 6, fill: '#9C7A4A' }, bg);
  E('rect', { x: -200, y: -200, width: 2000, height: 912, fill: '#140C18', 'fill-opacity': .42 }, bg);
  /* podea */
  E('rect', { x: -200, y: 712, width: 2000, height: 420, fill: '#5B3B2B' }, bg);
  for (let r = 0; r < 6; r++) for (let c = -12; c < 14; c++) {
    const y0 = 712 + r * r * 14 + r * 22, y1 = 712 + (r + 1) * (r + 1) * 14 + (r + 1) * 22;
    const sp = 1 + r * .35, x0 = 800 + (c - .5) * 120 * sp, x1 = 800 + (c + .5) * 120 * sp, sp2 = 1 + (r + 1) * .35;
    E('path', { d: `M${x0},${y0} L${x1},${y0} L${800 + (c + .5) * 120 * sp2},${y1} L${800 + (c - .5) * 120 * sp2},${y1} Z`, fill: (r + c) % 2 ? '#6E4A35' : '#4E3326' }, bg);
  }
  /* raze de lumină din rozetă + praf */
  const rays = G(bg);
  const rayEls = [[-140, -60], [-40, 60], [70, 170]].map(([a, b], i) => E('path', { d: `M${800 + a * .3},70 L${800 + b * .3},70 L${520 + b * 2.2},720 L${520 + a * 2.2},720 Z`, fill: '#FFE3A0', 'fill-opacity': .07 }, rays));
  const motes = []; for (let i = 0; i < 46; i++) motes.push({ c: E('circle', { r: 1.4 + hash(i + 3) * 2, fill: '#FFF1C9' }, rays), x: 330 + hash(i) * 700, y: 120 + hash(i + 20) * 560, s: hash(i + 40) });
  /* candelabre */
  const chand = [330, 1300].map(x => { const c = G(bg); E('path', { d: 'M0,-220 V40', stroke: '#2A1A14', 'stroke-width': 3 }, c);
    E('ellipse', { cx: 0, cy: 50, rx: 70, ry: 14, fill: '#B0832F' }, c); E('path', { d: 'M-60,50 Q0,90 60,50', stroke: '#B0832F', 'stroke-width': 5, fill: 'none' }, c);
    const fl = []; [-56, -28, 0, 28, 56].forEach(dx => { E('rect', { x: dx - 4, y: 22, width: 8, height: 24, fill: '#FFF4D6' }, c); fl.push(E('ellipse', { cx: dx, cy: 15, rx: 5, ry: 9, fill: '#FFB347' }, c)); });
    E('circle', { cx: 0, cy: 30, r: 120, fill: rgrad([[0, '#FFD58A', .28], [1, '#FFD58A', 0]]) }, c);
    return { c, fl, x }; });

  /* ================= PĂSĂRI-CĂRȚI (zboară spre mașinărie) ================= */
  const flyG = G(cam);
  const FN = 16, funnel = [1000, 150];
  const flyers = [];
  for (let i = 0; i < FN; i++) {
    const type = i % 4, g = G(flyG), inner = G(g);
    let wings = [], pageFlap = null;
    if (type === 0) { // carte
      const c = bookCols[i % 10];
      const lw = G(inner), rw = G(inner);
      E('rect', { x: -30, y: -20, width: 30, height: 40, rx: 3, fill: c }, lw); E('rect', { x: -26, y: -17, width: 24, height: 34, fill: C.paper }, lw);
      E('rect', { x: 0, y: -20, width: 30, height: 40, rx: 3, fill: c }, rw); E('rect', { x: 2, y: -17, width: 24, height: 34, fill: C.paper2 }, rw);
      E('rect', { x: -3, y: -21, width: 6, height: 42, rx: 2, fill: shade(c, -.3) }, inner);
      wings = [lw, rw];
    } else {
      const p = G(inner); pageFlap = p;
      if (type === 1) { E('rect', { x: -32, y: -22, width: 64, height: 44, rx: 3, fill: '#E9E4D8' }, p); TX(p, -26, -8, 'NEWS', 11, '#333', { w: 800 }); for (let k = 0; k < 3; k++) E('rect', { x: -26 + k * 18, y: -2, width: 14, height: 18, fill: '#B9B2A2' }, p); }
      else if (type === 2) { E('rect', { x: -32, y: -22, width: 64, height: 44, rx: 4, fill: '#FFFFFF' }, p); E('rect', { x: -32, y: -22, width: 64, height: 10, rx: 4, fill: '#4D96FF' }, p); [0, 1, 2].forEach(k => E('circle', { cx: -26 + k * 6, cy: -17, r: 2, fill: '#fff' }, p)); for (let k = 0; k < 3; k++) E('rect', { x: -26, y: -4 + k * 8, width: k === 2 ? 30 : 52, height: 4, rx: 2, fill: '#C9D3E6' }, p); }
      else { E('rect', { x: -32, y: -22, width: 64, height: 44, rx: 4, fill: '#1B2133' }, p); ['#F7C948', '#7CC4FF', '#C39BFF', '#7CFFB2'].forEach((c, k) => E('rect', { x: -26 + (k % 2) * 8, y: -15 + k * 9, width: 24 + hash(k + i) * 20, height: 4, rx: 2, fill: c }, p)); }
    }
    const side = i % 3; // 0 stânga, 1 dreapta, 2 sus
    const src = side === 0 ? [-60 + hash(i) * 320, 260 + hash(i + 5) * 380] : side === 1 ? [1350 + hash(i) * 300, 250 + hash(i + 5) * 380] : [80 + hash(i) * 1300, 40 + hash(i + 9) * 120];
    flyers.push({ g, inner, wings, pageFlap, src, ph: i / FN, ctl: [lerp(src[0], funnel[0], .5) + (hash(i + 2) - .5) * 300, Math.min(src[1], funnel[1]) - 120 - hash(i + 11) * 120] });
  }

  /* ================= MAȘINĂRIA „LANGUAGE MODEL” ================= */
  const mach = G(cam);
  const gearA = gear(mach, 52, 12, '#B08D3A'), gearB = gear(mach, 34, 9, '#9C7A30'), gearC = gear(mach, 26, 8, '#C9A227');
  /* țevi cu abur */
  E('path', { d: 'M1250,450 V300 Q1250,270 1280,270 H1330 V250', stroke: '#8C6A2A', 'stroke-width': 16, fill: 'none' }, mach);
  E('rect', { x: 1316, y: 236, width: 28, height: 18, rx: 4, fill: '#B08D3A' }, mach);
  const st1 = steam(mach, 3, 90, '#FFFFFF'); tf(st1, 1330, 236);
  E('path', { d: 'M950,450 V330 Q950,312 932,312 H900', stroke: '#8C6A2A', 'stroke-width': 12, fill: 'none' }, mach);
  const st2 = steam(mach, 2, 60, '#FFFFFF'); tf(st2, 896, 306);
  /* pâlnia */
  E('path', { d: 'M922,150 L1078,150 L1014,228 L986,228 Z', fill: '#C9A227' }, mach);
  E('path', { d: 'M1040,150 L1078,150 L1014,228 L1000,228 Z', fill: '#A88420' }, mach);
  E('ellipse', { cx: 1000, cy: 150, rx: 78, ry: 18, fill: '#8C6A2A' }, mach);
  E('ellipse', { cx: 1000, cy: 147, rx: 66, ry: 12, fill: '#3A2A1A' }, mach);
  E('rect', { x: 988, y: 226, width: 24, height: 70, fill: '#B08D3A' }, mach);
  /* corpul */
  E('rect', { x: 916, y: 438, width: 368, height: 268, rx: 26, fill: '#2F5F6E' }, mach);
  E('path', { d: 'M1180,438 H1258 Q1284,438 1284,464 V680 Q1284,706 1258,706 H1180 Z', fill: '#24495A' }, mach);
  E('rect', { x: 906, y: 428, width: 388, height: 20, rx: 8, fill: '#C9A227' }, mach);
  E('rect', { x: 906, y: 694, width: 388, height: 18, rx: 8, fill: '#B08D3A' }, mach);
  for (let x = 925; x < 1290; x += 30) { E('circle', { cx: x, cy: 438, r: 3, fill: '#8C6A2A' }, mach); E('circle', { cx: x, cy: 703, r: 3, fill: '#8C6A2A' }, mach); }
  [930, 1270].forEach(x => E('rect', { x: x - 14, y: 708, width: 28, height: 12, rx: 4, fill: '#8C6A2A' }, mach));
  E('rect', { x: 976, y: 462, width: 248, height: 42, rx: 10, fill: '#C9A227' }, mach);
  E('rect', { x: 982, y: 468, width: 236, height: 30, rx: 7, fill: 'none', stroke: '#8C6A2A', 'stroke-width': 2 }, mach);
  TX(mach, 1100, 491, 'LANGUAGE MODEL', 21, '#4A3310', { a: 'middle', w: 800, ls: 1.5 });
  /* cadrane */
  const needles = [[1000, 560], [1200, 560]].map(([x, y]) => { E('circle', { cx: x, cy: y, r: 30, fill: '#C9A227' }, mach); E('circle', { cx: x, cy: y, r: 24, fill: '#FBF7EE' }, mach);
    for (let k = 0; k < 5; k++) E('rect', { x: x - 1.5, y: y - 22, width: 3, height: 6, fill: '#3A3020', transform: `rotate(${-60 + k * 30} ${x} ${y})` }, mach);
    const n = E('rect', { x: x - 2, y: y - 20, width: 4, height: 22, rx: 2, fill: '#E84855' }, mach); E('circle', { cx: x, cy: y, r: 4, fill: '#3A3020' }, mach); return { n, x, y }; });
  /* becuri */
  const bulbs = []; for (let k = 0; k < 7; k++) { E('circle', { cx: 1010 + k * 30, cy: 660, r: 10, fill: '#1B2B33' }, mach); bulbs.push(E('circle', { cx: 1010 + k * 30, cy: 660, r: 7, fill: ['#FF6B6B', '#FFD166', '#7CFFB2', '#7CC4FF'][k % 4] }, mach)); }
  /* manetă */
  E('rect', { x: 1060, y: 590, width: 80, height: 36, rx: 10, fill: '#1B2B33' }, mach);
  const lever = G(mach); tf(lever, 1100, 612); E('rect', { x: -4, y: -46, width: 8, height: 46, rx: 4, fill: '#9AA6BD' }, lever); E('circle', { cx: 0, cy: -48, r: 10, fill: '#E84855' }, lever);
  /* fanta de intrare/ieșire */
  E('rect', { x: 902, y: 546, width: 30, height: 64, rx: 8, fill: '#141A24' }, mach);
  E('rect', { x: 896, y: 540, width: 12, height: 76, rx: 5, fill: '#B08D3A' }, mach);
  /* cupola de sticlă cu rețea și chip */
  const domeG = G(mach);
  E('path', { d: 'M932,440 A168,192 0 0 1 1268,440 Z', fill: rgrad([[0, '#2A6F86', .55], [1, '#163844', .65]], .5, .7, .7) }, domeG);
  const nodes = [];
  for (let i = 0; i < 18; i++) { const a = Math.PI * (1.05 + hash(i + 31) * .9), rr = .35 + hash(i + 77) * .6; nodes.push([1100 + Math.cos(a) * 150 * rr, 430 + Math.sin(a) * 175 * rr]); }
  const edges = [];
  nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 95) edges.push(E('path', { d: `M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])}`, stroke: '#7CF0FF', 'stroke-width': 2 }, domeG)); }));
  const nodeEls = nodes.map((p, i) => E('circle', { cx: f2(p[0]), cy: f2(p[1]), r: 5, fill: i % 3 ? '#7CF0FF' : '#FFD166' }, domeG));
  const faceG = G(domeG);
  const eyes = [-1, 1].map(s => { const g = G(faceG); const o = E('rect', { x: -14, y: -22, width: 28, height: 44, rx: 14, fill: '#E8FEFF' }, g);
    const h = E('path', { d: 'M-15,8 Q0,-14 15,8', stroke: '#E8FEFF', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g); return { g, o, h, s }; });
  const mouth = E('path', { stroke: '#E8FEFF', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, faceG);
  const sweat = E('path', { d: 'M0,-12 Q8,0 0,6 Q-8,0 0,-12 Z', fill: '#9EE7FF' }, domeG);
  E('path', { d: 'M932,440 A168,192 0 0 1 1268,440', fill: 'none', stroke: '#CFF4FB', 'stroke-width': 5 }, domeG);
  E('path', { d: 'M972,380 Q990,300 1050,268', stroke: '#fff', 'stroke-opacity': .35, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, domeG);
  E('path', { d: 'M1225,330 Q1238,360 1240,392', stroke: '#fff', 'stroke-opacity': .2, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, domeG);
  /* eticheta „experts call this” */
  const tagLM = N(cam, 1180, 205);
  E('rect', { x: -190, y: -24, width: 380, height: 48, rx: 24, fill: '#14121F', 'fill-opacity': .82, stroke: '#F7C948', 'stroke-width': 2 }, tagLM);
  TX(tagLM, 0, 8, 'experts call this: a language model', 20, '#FFE7A8', { a: 'middle', w: 700, it: true });

  /* ================= TABLA (pe șevalet) ================= */
  const board = G(cam);
  E('path', { d: 'M230,500 L190,712 M570,500 L610,712 M400,500 L400,712', stroke: '#7A4E30', 'stroke-width': 12, 'stroke-linecap': 'round' }, board);
  E('rect', { x: 162, y: 182, width: 476, height: 330, rx: 14, fill: '#8A5A36' }, board);
  E('rect', { x: 178, y: 198, width: 444, height: 298, rx: 6, fill: '#2C4A3A' }, board);
  E('path', { d: 'M200,470 Q300,460 420,474', stroke: '#fff', 'stroke-opacity': .06, 'stroke-width': 18, fill: 'none' }, board);
  E('rect', { x: 230, y: 500, width: 340, height: 10, rx: 4, fill: '#7A4E30' }, board);
  E('rect', { x: 260, y: 492, width: 30, height: 8, rx: 3, fill: '#F4F1E0' }, board);
  const chalk = '#F4F1E0', chalkY = '#FFE38A';
  /* B: tipare */
  const cB = G(board);
  TX(cB, 200, 238, 'Patterns it learned:', 22, '#BFD8C8', { hand: true, w: 700 });
  const happy = TX(cB, 205, 292, 'Happy', 38, chalk, { hand: true, w: 700 });
  E('rect', { x: 340, y: 296, width: 180, height: 4, rx: 2, fill: chalk, 'fill-opacity': .7 }, cB);
  const bday = TX(cB, 345, 290, 'birthday', 36, chalkY, { hand: true, w: 800 });
  const optB = [['birthday', 70, chalkY], ['new year', 22, chalk], ['Monday', 1, '#9FB7A8']].map(([w, p, c], i) => {
    const g = G(cB); const y = 352 + i * 46; const t = TX(g, 205, y, w, 24, c, { hand: true, w: 700 });
    const bar = E('rect', { x: 345, y: y - 18, width: 0, height: 20, rx: 6, fill: c, 'fill-opacity': .85 }, g);
    const pc = TX(g, 560, y, p + '%', 20, c, { hand: true, w: 700 }); return { g, bar, p, pc }; });
  /* C: token-uri */
  const cC = G(board);
  TX(cC, 400, 250, 'Experts call them:', 24, '#BFD8C8', { a: 'middle', hand: true, w: 700 });
  TX(cC, 400, 320, 'TOKENS', 64, chalkY, { a: 'middle', hand: true, w: 800, ls: 4 });
  E('path', { d: 'M265,338 Q400,350 535,334', stroke: chalkY, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, cC);
  const cC2 = G(cC);
  TX(cC2, 400, 400, '1 piece  →  1 number', 26, chalk, { a: 'middle', hand: true, w: 700 });
  TX(cC2, 400, 450, 'iPhone  →  22413', 26, '#7CFFB2', { a: 'middle', mono: true, w: 700 });
  /* D: alegerea următoarei bucăți */
  const cD = G(board);
  TX(cD, 400, 236, 'What comes next?', 28, chalkY, { a: 'middle', hand: true, w: 800 });
  const ctx = TX(cD, 400, 270, '', 20, '#BFD8C8', { a: 'middle', hand: true, w: 600 });
  const STEPS = [{ t: 38.3, ctx: '…Sure! I\'ll ___', c: [['start', 58], ['begin', 27], ['dance', 1]] }, { t: 42.4, ctx: '…start with a ___', c: [['plan', 64], ['list', 22], ['pancake', 1]] }];
  STEPS.forEach(s => { s.g = G(cD); s.rows = s.c.map(([w, p], i) => { const g = G(s.g); const y = 316 + i * 60;
    const card = E('rect', { x: 196, y: y - 22, width: 130, height: 44, rx: 10, fill: '#FBF7EE' }, g);
    const ring = E('rect', { x: 190, y: y - 28, width: 142, height: 56, rx: 14, fill: 'none', stroke: chalkY, 'stroke-width': 4 }, g);
    const tw = TX(g, 261, y + 8, w, 22, C.ink, { a: 'middle', w: 800 });
    const bar = E('rect', { x: 342, y: y - 12, width: 0, height: 24, rx: 7, fill: i === 0 ? chalkY : i === 1 ? '#9FD1B5' : '#7E9A88' }, g);
    const pc = TX(g, 552, y + 8, p + '%', 20, chalk, { hand: true, w: 700 }); return { g, card, ring, tw, bar, p, w, y }; }); });
  const counter = G(cD); const cnt = TX(counter, 400, 360, '', 44, chalkY, { a: 'middle', hand: true, w: 800 }); TX(counter, 400, 420, '⏩  very, very fast', 26, chalk, { a: 'middle', hand: true, w: 700 });
  /* E: verificarea */
  const cE = G(board);
  TX(cE, 400, 246, 'Check the work', 32, chalkY, { a: 'middle', hand: true, w: 800 });
  const checks = ['Read it carefully', 'Test it', 'Fix mistakes'].map((t, i) => { const g = G(cE); const y = 318 + i * 58;
    E('rect', { x: 214, y: y - 22, width: 30, height: 30, rx: 6, fill: 'none', stroke: chalk, 'stroke-width': 3 }, g);
    const ck = E('path', { d: `M218,${y - 8} l9,10 l17,-22`, stroke: '#7CFFB2', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    TX(g, 262, y, t, 26, chalk, { hand: true, w: 700 }); return ck; });

  /* ================= BANDA RULANTĂ ================= */
  const belt = G(cam);
  [180, 520, 860].forEach(x => { E('rect', { x: x - 9, y: 632, width: 18, height: 82, fill: '#2B3047' }, belt); E('rect', { x: x - 24, y: 706, width: 48, height: 10, rx: 4, fill: '#1E2235' }, belt); });
  E('path', { d: 'M180,690 L520,650 L860,690', stroke: '#2B3047', 'stroke-width': 6, fill: 'none' }, belt);
  E('rect', { x: 110, y: 598, width: 812, height: 38, rx: 19, fill: '#3A3F55' }, belt);
  E('rect', { x: 120, y: 602, width: 792, height: 14, rx: 7, fill: '#22263A' }, belt);
  const treadG = G(belt, { 'clip-path': clipRect(120, 602, 792, 14, 7) });
  const treads = []; for (let k = 0; k < 36; k++) treads.push(E('rect', { x: 0, y: 604, width: 8, height: 10, rx: 2, fill: '#4A5070' }, treadG));
  const rollers = [130, 902].map(x => { const r = G(belt); tf(r, x, 618); E('circle', { r: 17, fill: '#5C6380' }, r); for (let k = 0; k < 3; k++) E('rect', { x: -2, y: -14, width: 4, height: 28, fill: '#2B3047', transform: `rotate(${k * 60})` }, r); return r; });
  /* obiectele de pe bandă (decupate la intrarea în mașinărie) */
  const items = G(cam, { 'clip-path': clipRect(60, 300, 862, 460) });
  /* token-urile mesajului lui Tudor */
  const TOK = [['Make', 12048], ['me', 757], ['an', 459], ['iPhone', 22413], ['app', 917], ['with', 449], ['our', 1039], ['family', 3070], ['rec', 8579], ['ipes', 15215]];
  const tokCols = ['#FFD6A5', '#CAFFBF', '#9BF6FF', '#BDB2FF', '#FFC6FF', '#FDFFB6', '#A0C4FF', '#FFADAD', '#B8F2E6', '#E4C1F9'];
  let px = 140, gx = 140;
  const toks = TOK.map(([w, n], k) => { const bw = w.length * 12 + 22;
    const g = G(items); const r = E('rect', { x: 0, y: 0, width: bw, height: 62, rx: 8, fill: '#FBF7EE' }, g);
    TX(g, bw / 2, 26, w, 20, C.ink, { a: 'middle', w: 800 });
    const num = TX(g, bw / 2, 52, String(n), 15, '#3D2E7A', { a: 'middle', mono: true, w: 700 });
    const o = { g, r, num, bw, x0: px, x1: gx, col: tokCols[k] }; px += bw; gx += bw + 10; return o; });
  const strip = toks[0].x0, stripEnd = px;
  /* foarfeca */
  const sc = G(cam);
  const bladeA = G(sc), bladeB = G(sc);
  [bladeA, bladeB].forEach((b, i) => { E('path', { d: 'M0,0 L-8,-70 Q0,-80 6,-68 Z', fill: '#C9CFDE' }, b); E('ellipse', { cx: i ? 10 : -10, cy: 26, rx: 13, ry: 17, fill: 'none', stroke: i ? '#E84855' : '#4D96FF', 'stroke-width': 7 }, b); });
  E('circle', { r: 5, fill: '#5C6380' }, sc);
  /* ștampila (piston) */
  const stamper = G(cam);
  E('rect', { x: -3, y: -46, width: 6, height: 20, fill: '#5C6380' }, stamper);
  const blades = E('ellipse', { cx: 0, cy: -48, rx: 34, ry: 5, fill: '#C9CFDE' }, stamper);
  E('rect', { x: -20, y: -30, width: 40, height: 22, rx: 8, fill: '#5C6380' }, stamper);
  E('circle', { cx: -8, cy: -19, r: 3.5, fill: '#7CFFB2' }, stamper); E('circle', { cx: 8, cy: -19, r: 3.5, fill: '#7CFFB2' }, stamper);
  E('rect', { x: -26, y: -10, width: 52, height: 22, rx: 8, fill: '#E84855' }, stamper); E('rect', { x: -22, y: 10, width: 44, height: 8, rx: 3, fill: '#5A1F25' }, stamper);
  /* avionul lui Tudor */
  const plane = G(cam); paperPlane(plane, 1.4, '#FFFFFF');
  const strip0 = G(items); E('rect', { x: 0, y: 0, width: stripEnd - strip, height: 62, rx: 8, fill: '#FBF7EE' }, strip0);
  TX(strip0, 16, 38, 'Make me an iPhone app with our family recipes…', 21, C.ink, { w: 700 });
  /* răspunsul: bucăți care ies din mașinărie */
  const ANS = ['Sure!', 'I\'ll', 'start', 'with', 'a', 'plan', '.'];
  const ansT = [37.0, 37.7, 41.3, 41.8, 42.2, 45.4, 45.9];
  const ansCols = ['#FFE38A', '#FFD6A5', '#CAFFBF', '#9BF6FF', '#BDB2FF', '#FFC6FF', '#FDFFB6'];
  let ax = 150;
  const ans = ANS.map((w, k) => { const bw = w.length * 14 + 30; const g = G(items);
    E('rect', { x: 0, y: 0, width: bw, height: 56, rx: 10, fill: ansCols[k] }, g); E('rect', { x: 0, y: 44, width: bw, height: 12, rx: 6, fill: '#000', 'fill-opacity': .08 }, g);
    TX(g, bw / 2, 37, w, 26, C.ink, { a: 'middle', w: 800 }); const o = { g, bw, x: ax, t: ansT[k], picked: k === 2 || k === 5 }; ax += bw + 10; return o; });
  /* fluxul rapid */
  const stream = []; for (let j = 0; j < 26; j++) { const g = G(items); const bw = 30 + hash(j + 5) * 46; E('rect', { x: 0, y: 0, width: bw, height: 34, rx: 7, fill: tokCols[j % 10] }, g); stream.push({ g, bw, s: 46.2 + j * .12 }); }
  const page = G(items); paper(page, 250, 170, { label: 'Answer', lines: 6, size: 20 });
  /* gheara */
  const claw = G(cam);
  const cable = E('path', { stroke: '#2B3047', 'stroke-width': 4 }, claw);
  const clawB = G(claw);
  E('rect', { x: -18, y: -16, width: 36, height: 22, rx: 6, fill: '#F2994A' }, clawB);
  const prongs = [-1, 1].map(s => E('path', { stroke: '#5C6380', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, clawB));
  const carry = STEPS.map(s => { const g = G(clawB); E('rect', { x: -65, y: 14, width: 130, height: 44, rx: 10, fill: '#FBF7EE', stroke: chalkY, 'stroke-width': 4 }, g); TX(g, 0, 44, s.c[0][0], 22, C.ink, { a: 'middle', w: 800 }); return g; });

  /* ================= FAZA E: răspuns greșit, ștampila „?” ================= */
  const wrong = G(cam);
  const wb = speechBubble(wrong, 420, 160, 'br', {}); tf(wb, -210, -80);
  const wT1 = TX(wrong, 0, -22, 'Paris is the capital', 30, C.ink, { a: 'middle', w: 800 });
  const wT2 = TX(wrong, 0, 22, 'of Italy.', 30, C.ink, { a: 'middle', w: 800 });
  const fix = G(wrong); E('path', { d: 'M-160,-32 L-52,-32', stroke: '#E84855', 'stroke-width': 5 }, fix); TX(fix, -105, -52, 'Rome', 28, '#2E9C62', { a: 'middle', w: 800, hand: true });
  const rib = G(wrong); tf(rib, -200, -78);
  E('path', { d: 'M-14,10 L-24,46 L-8,38 L0,52 L4,14 Z M14,10 L24,46 L8,38 L0,52 L-4,14 Z', fill: '#E84855' }, rib);
  E('circle', { r: 34, fill: '#F7C948' }, rib); E('circle', { r: 27, fill: '#FFE38A' }, rib);
  TX(rib, 0, -3, '100%', 15, '#7A4E10', { a: 'middle', w: 800 }); TX(rib, 0, 14, 'sure!', 14, '#7A4E10', { a: 'middle', w: 800 });
  const okB = G(wrong); tf(okB, -200, -78); E('circle', { r: 30, fill: '#3BB273' }, okB); icon(okB, 'check', 34, '#fff', 6);
  const qmark = G(wrong); E('circle', { r: 62, fill: 'none', stroke: '#E84855', 'stroke-width': 9, 'stroke-opacity': .9 }, qmark); TX(qmark, 0, 34, '?', 96, '#E84855', { a: 'middle', w: 900 });
  const stamp = G(cam);
  E('rect', { x: -16, y: -150, width: 32, height: 100, rx: 10, fill: '#8A5A36' }, stamp); E('ellipse', { cx: 0, cy: -150, rx: 30, ry: 18, fill: '#A0672E' }, stamp);
  E('rect', { x: -70, y: -56, width: 140, height: 40, rx: 8, fill: '#5C3A1E' }, stamp); E('rect', { x: -66, y: -18, width: 132, height: 16, rx: 4, fill: '#C92A3A' }, stamp);
  /* robotul șef vine să verifice */
  const boss = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1 });
  const bossMag = magnifier(boss.propR, .75); tf(bossMag, 0, -20);

  /* ================= ANIMAȚIE ================= */
  const camK = [[0, 800, 450, 1], [L(1), 820, 440, 1], [L(1) + 4, 920, 420, 1.07], [L(2) - 1, 920, 420, 1.07], [L(2) + .4, 560, 400, 1.12], [L(3) - 1.2, 560, 400, 1.12],
    [L(3) - .2, 560, 455, 1.08], [L(5) - .8, 560, 455, 1.08], [L(5) + .2, 640, 430, 1.0], [L(6) + 2, 660, 440, 1.0], [L(7) - .6, 820, 400, 1.04], [L(8), 780, 420, 1.0], [cue.d, 790, 425, 1.03]];
  const toolClaw = (lt, s) => { // poziția ghearei pentru pasul s
    const t = s.t, row0 = s.rows[0]; const card = [261, row0.y - 30], drop = [ans[s === STEPS[0] ? 2 : 5].x + ans[s === STEPS[0] ? 2 : 5].bw / 2, 470];
    return keyed(lt, [[t + .8, [700, 60]], [t + 1.8, card], [t + 2.1, card], [t + 2.8, drop], [t + 3.1, drop], [t + 3.9, [700, 60]]]);
  };
  return (lt, at) => {
    /* ---- ambient ---- */
    const shake = lt > 56.85 && lt < 57.25 ? Math.sin(lt * 90) * 5 * (57.25 - lt) / .4 : 0;
    const cv = keyed(lt, camK.map(k => [k[0], k.slice(1)]));
    camera(cam, 0, [[0, cv[0] + shake, cv[1], cv[2]]]);
    rayEls.forEach((r, i) => r.setAttribute('fill-opacity', f2(.05 + .035 * (.5 + .5 * Math.sin(at * .7 + i * 2)))));
    motes.forEach((m, i) => { tf(m.c, m.x + wob(at * .3, i) * 30, m.y - ((at * (6 + m.s * 10) + i * 37) % 120) + 60); m.c.setAttribute('fill-opacity', f2(.25 + .5 * (.5 + .5 * Math.sin(at * 2 + i)))); });
    chand.forEach((c, i) => { tf(c.c, c.x, 0, Math.sin(at * .8 + i) * 1.2); c.fl.forEach((f, k) => tf(f, 0, 0, 0, 1, .8 + .3 * Math.abs(wob(at * 5, k + i * 7)))); });
    ladders.forEach((l, i) => tf(l.l, l.x + Math.sin(at * .25 + i * 2) * 30, 712));
    tf(rose, 800, 40, at * 3);
    st1.anim(at); st2.anim(at * 1.2);
    const fast = 1 + 4 * win(lt, L(6), Le(6) - .5, .6, .8) + (lt > 35 && lt < 36.7 ? 1.5 : 0);
    const spin = at * 40 + lt * 40 * fast;
    tf(gearA, 1300, 520, spin); tf(gearB, 1325, 610, -spin * 1.5); tf(gearC, 1262, 470, -spin * 2);
    needles.forEach((n, i) => n.n.setAttribute('transform', `rotate(${f2(wob(at * 1.5 * fast, i * 3) * 50)} ${n.x} ${n.y})`));
    bulbs.forEach((b, k) => b.setAttribute('fill-opacity', f2(.35 + .65 * (Math.sin(at * 4 * fast + k * 1.3) > 0 ? 1 : 0))));
    tf(lever, 1100, 612, Math.sin(at * 2) * 8);
    edges.forEach((e, k) => e.setAttribute('stroke-opacity', f2(.12 + .38 * Math.pow(.5 + .5 * Math.sin(at * 2.4 * fast - k * .7), 3))));
    nodeEls.forEach((n, k) => n.setAttribute('r', f2(4 + 2.5 * (.5 + .5 * Math.sin(at * 3 * fast + k)))));
    /* fața mașinăriei */
    let face = 'neutral', look = [-1, -1];
    if (lt < L(2) - .5) look = [-1, -1.2]; else if (lt < L(3) - .5) { look = [-1.4, 0]; face = 'happy'; } else if (lt < L(5)) look = [-1.3, .9]; else if (lt < L(7)) { look = [-1.1, .6]; face = lt > L(6) ? 'focus' : 'happy'; }
    else if (lt < 56.9) { face = 'proud'; look = [-1.2, -1.2]; } else if (lt < L(8) + 1.6) { face = 'worried'; look = [-1, -.4]; } else { face = 'happy'; look = [-1.1, .3]; }
    const bl = Math.max(.08, blink(at, 7));
    tf(faceG, look[0] * 8, look[1] * 6);
    const hap = face === 'happy' || face === 'proud';
    eyes.forEach(e => { tf(e.g, 1100 + e.s * 40, 352, 0, 1, hap ? 1 : bl * (face === 'focus' ? .55 : 1)); op(e.o, hap ? 0 : 1); op(e.h, hap ? 1 : 0); });
    mouth.setAttribute('d', face === 'proud' ? 'M1072,392 Q1100,420 1128,392' : face === 'happy' ? 'M1078,394 Q1100,410 1122,394' : face === 'worried' ? 'M1080,400 Q1090,392 1100,400 Q1110,408 1120,398' : face === 'focus' ? 'M1084,398 L1116,398' : 'M1082,396 Q1100,404 1118,396');
    const sw = win(lt, 57.2, L(8) + 1.4, .3, .4); op(sweat, sw); tf(sweat, 1190, 300 + ((lt - 57.2) * 30) % 50);
    /* ---- A: zborul cărților ---- */
    const flyOn = 1 - prog(lt, L(3) - 2.2, 1.2);
    flyers.forEach((f, i) => {
      const u = ((lt * .1 + at * .015 + f.ph) % 1);
      const p = [lerp(lerp(f.src[0], f.ctl[0], u), lerp(f.ctl[0], funnel[0], u), u), lerp(lerp(f.src[1], f.ctl[1], u), lerp(f.ctl[1], funnel[1], u), u)];
      const sc2 = u > .85 ? lerp(1, .25, (u - .85) / .15) : 1;
      op(f.g, flyOn * clamp(u * 8) * (u > .95 ? (1 - u) * 20 : 1));
      tf(f.g, p[0], p[1] + Math.sin(at * 3 + i) * 6, Math.sin(at * 2 + i) * 12, sc2 * (.9 + hash(i) * .4));
      const fl = Math.abs(Math.cos(at * 9 + i * 1.3));
      if (f.wings.length) { tf(f.wings[0], 0, 0, 0, .25 + .75 * fl, 1); tf(f.wings[1], 0, 0, 0, .25 + .75 * fl, 1); }
      else tf(f.pageFlap, 0, 0, 0, 1, .55 + .45 * fl);
    });
    show(tagLM, lt, L(1) + 2.6, L(2) - .4, { dy: 10 });
    /* ---- tabla ---- */
    op(board, prog(lt, L(2) - 1.5, .8) * (1 - win(lt, L(7) - .6, L(8) - .1, .4, .4)));
    op(cB, win(lt, L(2), L(3) - .6, .5, .4));
    optB.forEach((o, i) => { op(o.g, prog(lt, L(2) + 1.2 + i * .35, .4)); o.bar.setAttribute('width', f2(2 * o.p * prog(lt, L(2) + 1.4 + i * .35, 1.2))); });
    const bp = prog(lt, L(2) + 3.4, .7); op(bday, bp); tf(bday, 0, (1 - bp) * 60);
    happy.setAttribute('fill', bp > .5 ? chalkY : chalk);
    op(cC, win(lt, L(3) + 1.6, L(5) - .7, .5, .4)); op(cC2, prog(lt, L(4) + .3, .5));
    const dOn = win(lt, L(5) + .6, L(7) - .6, .4, .4); op(cD, dOn);
    let ctxS = '';
    STEPS.forEach((s, si) => { const v = win(lt, s.t, s.t + 3.6, .3, .3); op(s.g, v); if (v > 0) ctxS = s.ctx;
      s.rows.forEach((r, i) => { op(r.g, prog(lt, s.t + .15 + i * .2, .3)); r.bar.setAttribute('width', f2(1.9 * r.p * prog(lt, s.t + .5 + i * .15, .9)));
        op(r.ring, i === 0 ? win(lt, s.t + 1.4, s.t + 2.2, .2, .2) * (.6 + .4 * Math.sin(at * 12)) : 0);
        op(r.card, i === 0 && lt > s.t + 2.1 ? .25 : 1); }); });
    ctx.textContent = ctxS;
    const cn = Math.floor(7 + 2400 * prog(lt, L(6) + .4, 3.6, t => t * t));
    op(counter, win(lt, L(6) + .3, L(7) - .8, .3, .3)); cnt.textContent = cn.toLocaleString('en') + ' steps';
    op(cE, prog(lt, L(8) + .2, .5));
    checks.forEach((c, i) => { const p = prog(lt, L(8) + 1.6 + i * .8, .35); c.setAttribute('stroke-dasharray', '40'); c.setAttribute('stroke-dashoffset', f2(40 * (1 - p))); op(c, p > 0 ? 1 : 0); });
    /* ---- banda ---- */
    const bpos = lt < 36.4 ? lt * 46 + (lt > 35 ? (lt - 35) * 120 : 0) : 36.4 * 46 + 1.4 * 120 - (lt - 36.4) * 46 - (lt > L(6) ? (lt - L(6)) * 240 : 0);
    treads.forEach((t2, k) => t2.setAttribute('x', f2(120 + (((k * 24 + bpos) % 864) + 864) % 864 - 30)));
    rollers.forEach(r => r.setAttribute('transform', `translate(${r === rollers[0] ? 130 : 902},618) rotate(${f2(bpos * 3)})`));
    /* ---- C: avionul aterizează, se desface, foarfeca taie ---- */
    const pp = prog(lt, L(3) - .5, 1.7, t => t);
    const pA = arcPos(easeOut(pp), [-120, 120], [300, 560], -40);
    op(plane, pp > 0 && pp < 1 ? 1 : 0); tf(plane, pA[0] + Math.sin(lt * 9) * 5 * (1 - pp), pA[1], 18 + Math.sin(lt * 6) * 8 * (1 - pp), 1 - pp * .3);
    const unf = prog(lt, L(3) + 1.1, .5);
    const snipT = k => L(3) + 2.0 + k * .4;
    const intoM = prog(lt, L(5) - 1.6, 1.4, easeIn) * 900;
    op(strip0, unf * (lt < snipT(0) ? 1 : 0)); tf(strip0, strip, 542, 0, lerp(.2, 1, unf), 1);
    toks.forEach((tk, k) => {
      const sn = prog(lt, snipT(Math.min(k, 8)) + (k === 9 ? .4 : 0), .3);
      op(tk.g, lt >= snipT(0) ? 1 - prog(lt, L(5) + .2, .3) : 0);
      tf(tk.g, lerp(tk.x0, tk.x1, sn) + intoM, 542 - Math.sin(Math.PI * sn) * 10);
      tk.r.setAttribute('fill', sn > .5 ? tk.col : '#FBF7EE');
      const st = L(4) + .5 + k * .44; op(tk.num, prog(lt, st + .15, .2));
    });
    const snipping = lt > snipT(0) - .6 && lt < snipT(8) + .6;
    op(sc, snipping ? 1 : 0);
    if (snipping) { const k = clamp(Math.floor((lt - snipT(0) + .2) / .4), 0, 8); const bx = toks[k].x0 + toks[k].bw; const ph = ((lt - snipT(0) + .2) % .4) / .4;
      const ang = 22 * Math.abs(Math.cos(ph * Math.PI)); tf(sc, bx + 4, 548, 180); tf(bladeA, 0, 0, -ang); tf(bladeB, 0, 0, ang); }
    /* piston-ștampila */
    const stOn = win(lt, L(4) + .1, Le(4) + .4, .3, .3); op(stamper, stOn);
    if (stOn > 0) { const k = clamp(Math.floor((lt - L(4) - .5) / .44), 0, 9); const ph = clamp(((lt - L(4) - .5) % .44) / .44); const tk = toks[k];
      const sx = lerp(tk.x1 + tk.bw / 2, (toks[Math.min(9, k + 1)].x1 + toks[Math.min(9, k + 1)].bw / 2), prog(ph, .6, .4));
      tf(stamper, sx, 480 + 44 * Math.sin(Math.PI * clamp(ph / .55)) + Math.sin(at * 7) * 3); tf(blades, 0, 0, 0, Math.cos(at * 40), 1); }
    /* ---- D: răspunsul ---- */
    const scrollOut = prog(lt, L(6) + .3, 1.6, easeIn) * 900;
    ans.forEach((a, k) => {
      const v = lt >= a.t ? 1 : 0;
      op(a.g, v * (1 - prog(lt, L(7) - 1, .4)));
      if (!v) return;
      if (a.picked) { const d = prog(lt, a.t, .35, easeOut); tf(a.g, a.x - scrollOut, lerp(470, 548, d) - Math.sin(Math.PI * prog(lt, a.t + .3, .3)) * 8); }
      else { const d = prog(lt, a.t, .9, easeOut); tf(a.g, lerp(940, a.x, d) - scrollOut, 548 - Math.abs(Math.sin(d * Math.PI * 2)) * 8 * (1 - d)); }
    });
    stream.forEach((s, j) => { const x = 930 - (lt - s.s) * 820; op(s.g, lt > s.s && x > 60 ? 1 : 0); tf(s.g, x, 570 - (j % 3) * 2); });
    const pg = prog(lt, Le(6) - 1.6, 1, easeOut); op(page, pg > 0 ? 1 - prog(lt, L(7) - 1, .4) : 0); tf(page, lerp(1060, 560, pg), 519);
    /* gheara */
    const sAct = STEPS.find(s => lt > s.t + .6 && lt < s.t + 4.2);
    op(claw, win(lt, L(5) + .8, L(6) + .4, .4, .4));
    const cp = sAct ? toolClaw(lt, sAct) : [700, 60];
    tf(claw, 0, 0); tf(clawB, cp[0], cp[1]); cable.setAttribute('d', `M${f2(cp[0])},-140 V${f2(cp[1] - 14)}`);
    const closed = sAct && lt > sAct.t + 2.0 && lt < sAct.t + 2.95;
    prongs.forEach((p, i) => { const s = i ? 1 : -1, o = closed ? 6 : 22; p.setAttribute('d', `M${s * 10},4 Q${s * (o + 8)},22 ${s * o},44`); });
    carry.forEach((g, i) => op(g, sAct === STEPS[i] && closed ? 1 : 0));
    /* ---- E: răspunsul greșit, ștampila, verificarea ---- */
    const wv = pop(lt, L(7) + .5, .6) * (1 - prog(lt, cue.d - .6, .4));
    op(wrong, wv > 0 ? 1 : 0); tf(wrong, 790, 150, 0, Math.max(.01, wv));
    op(rib, lt < L(8) + 1.8 ? 1 : 0); tf(rib, -200, -78, Math.sin(at * 3) * 6, 1 + .06 * Math.sin(at * 5));
    const qs = pop(lt, 56.9, .35); op(qmark, qs * (1 - prog(lt, L(8) + 1.9, .4))); tf(qmark, 120, 4, -12, 1.6 - .6 * qs);
    const sY = keyed(lt, [[56.2, -260], [56.88, 70], [57.25, 70], [57.9, -260]]); op(stamp, lt > 56.2 && lt < 57.9 ? 1 : 0); tf(stamp, 905, sY);
    const fx = prog(lt, L(8) + 1.9, .5); op(fix, fx); op(okB, pop(lt, L(8) + 2.2, .5));
    wT1.setAttribute('fill', fx > .5 ? '#8A8478' : C.ink);
    /* robotul */
    const bIn = keyed(lt, [[L(8) - .6, -180], [L(8) + 1.3, 640]], t => t);
    const walking = lt > L(8) - .6 && lt < L(8) + 1.3;
    const wc = walkCycle(bIn / 20);
    op(boss.root, lt > L(8) - .7 ? 1 : 0);
    const bst = { x: bIn, y: 742, s: .82, at, face: lt > L(8) + 2.1 ? 'happy' : 'focus', look: [1, -1], bob: Math.sin(at * 2) * 2 };
    if (walking) Object.assign(bst, { fL: wc.fL, fR: wc.fR, bob: wc.bob, hL: [-64 + wc.swing * 14, -96], hR: [70, -150] });
    else Object.assign(bst, { hR: [96 + Math.sin(at * 2) * 8, -300 + Math.sin(at * 3) * 6], hL: lt > L(8) + 2.6 ? [-50, -250] : [-64, -96], rotL: lt > L(8) + 2.6 ? 180 : 0 });
    boss.set(bst);
  };
} });
