"use strict";
/* SCENA 5 — Ajutoarele: subagenții
   A: șeful cheamă ajutoarele, le dă bilete (0–27 s)
   B: fiecare la biroul lui, lucru în paralel, rapoarte scurte (27–56 s)
   C: biletul vag vs. biletul clar (56 s – final) */
SCENE(5, { build(world, cue) {
  const L = cue, Le = cue.e;
  const cam = G(world);
  const bg = bgWorkshop(cam, { shelves: [[-120, 470, 220]], clockX: 935, clockY: 175 });
  const FLOOR = 705;

  /* ---------- mici ajutoare locale ---------- */
  const chip = (p, x, y, str, size = 22) => {
    const g = N(p, x, y); const w = str.length * size * .5 + 44;
    E('rect', { x: -w / 2, y: -size * 1.15, width: w, height: size * 1.9, rx: size * .95, fill: '#1E1A2E', 'fill-opacity': .86, stroke: '#F7C948', 'stroke-width': 2.5 }, g);
    TX(g, 0, size * .2, str, size, '#FFE7A8', { a: 'middle', w: 700, it: true });
    return g;
  };
  const pill = (p, str, col) => {
    const g = N(p, 0, 0); const w = str.length * 11 + 34;
    E('rect', { x: -w / 2 + 2, y: -14, width: w, height: 34, rx: 17, fill: '#000', 'fill-opacity': .25 }, g);
    E('rect', { x: -w / 2, y: -17, width: w, height: 34, rx: 17, fill: col }, g);
    TX(g, 0, 7, str, 19, '#fff', { a: 'middle', w: 800 });
    return g;
  };
  const glass = (p, x, y, w, h) => {
    const g = G(p);
    E('rect', { x, y, width: w, height: h, rx: 6, fill: '#E4F0FF', 'fill-opacity': .34, stroke: '#FFFFFF', 'stroke-opacity': .55, 'stroke-width': 2 }, g);
    for (let i = 0; i < Math.floor(h / 70); i++) E('path', { d: `M${x + 4},${y + 46 + i * 70} L${x + w - 4},${y + 18 + i * 70}`, stroke: '#fff', 'stroke-opacity': .4, 'stroke-width': 3 }, g);
    for (let i = 0; i < Math.floor(h / 22); i++) E('circle', { cx: x + w * (.2 + hash(i + w) * .6), cy: y + 10 + i * 22, r: 2 + hash(i) * 3, fill: '#fff', 'fill-opacity': .22 }, g);
    return g;
  };
  const deskAt = (p, x, w = 300) => {
    const g = N(p, x, 598);
    E('rect', { x: -w / 2 + 6, y: 6, width: w, height: 104, fill: '#000', 'fill-opacity': .18 }, g);
    E('rect', { x: -w / 2 + 10, y: 14, width: w - 20, height: 92, fill: '#7E5038' }, g);
    E('rect', { x: -w / 2, y: 0, width: w, height: 15, rx: 5, fill: '#A9744F' }, g);
    E('rect', { x: -w / 2, y: 0, width: w, height: 5, rx: 3, fill: '#C48B60' }, g);
    E('rect', { x: -w / 2 + 26, y: 30, width: w * .34, height: 36, rx: 5, fill: '#8C5C40' }, g);
    E('rect', { x: -w / 2 + 26 + w * .17 - 13, y: 45, width: 26, height: 6, rx: 3, fill: '#C9A227' }, g);
    return g;
  };
  const pile = (p, x, y, n) => {
    const g = G(p); const sl = [];
    for (let i = 0; i < n; i++) { const jx = (hash(i * 3 + x) - .5) * 10;
      const r = G(g); E('rect', { x: x - 38 + jx, y: y - (i + 1) * 7, width: 76, height: 6.5, rx: 2, fill: i % 3 ? '#FBF7EE' : '#EFE7D6', stroke: '#BFB49C', 'stroke-width': .8 }, r);
      if (i % 4 === 1) E('rect', { x: x - 38 + jx, y: y - (i + 1) * 7, width: 8, height: 6.5, fill: ['#4D96FF', '#E84855', '#F7C948'][i % 3] }, r);
      sl.push(r); }
    g.set = k => sl.forEach((r, i) => op(r, i < k ? 1 : 0)); g.set(0);
    return g;
  };
  const stampMark = (p, ok) => {
    const g = N(p, 0, 0); const c = ok ? '#3BB273' : '#E84855';
    E('circle', { r: 58, fill: '#fff', 'fill-opacity': .9, stroke: c, 'stroke-width': 8 }, g);
    const ic = G(g); icon(ic, ok ? 'check' : 'cross', 70, c, 8);
    return g;
  };
  /* poziția mâinii unui personaj în lume */
  const handW = (x, y, s, h) => [x + s * h[0], y + s * h[1]];

  /* ---------- FAZA A: mormanul de lucru + personajele ---------- */
  const crates = N(cam, 1420, FLOOR);
  [[-66, 0, 'Screens', '#C8954F'], [66, 0, 'Search', '#B9854A'], [-66, -90, 'Photos', '#B9854A'], [66, -90, 'Tests', '#C8954F'], [0, -180, 'Shopping list', '#D2A15A']].forEach(([x, y, t, c], i) => {
    const b = G(crates); tf(b, x, y);
    E('rect', { x: -64, y: -88, width: 128, height: 86, rx: 6, fill: c }, b);
    E('rect', { x: -64, y: -88, width: 128, height: 12, rx: 4, fill: shade(c, -.15) }, b);
    E('path', { d: 'M-56,-70 L56,-10 M56,-70 L-56,-10', stroke: shade(c, -.2), 'stroke-width': 4, opacity: .5 }, b);
    E('rect', { x: -50, y: -60, width: 100, height: 28, rx: 6, fill: '#FFF6E5' }, b);
    TX(b, 0, -40, t, t.length > 8 ? 14 : 17, '#5A3B1E', { a: 'middle', w: 800 });
  });
  const bigLbl = N(cam, 1420, 425); TX(bigLbl, 0, 0, 'Big project!', 24, '#FFE7A8', { a: 'middle', w: 800 });

  /* frunzele de sticlă mată și birourile (apar în faza B) */
  const wallG = N(cam, 0, 0); glass(wallG, 1168, 240, 38, 465);
  const panels = [430, 790].map(x => { const g = N(cam, 0, 0); glass(g, x - 8, 400, 16, 305); return g; });
  const hatch = G(cam);
  const hatchHole = E('ellipse', { cx: 560, cy: 712, rx: 66, ry: 15, fill: '#16121E' }, hatch);
  const hatchLid = E('ellipse', { cx: 560, cy: 712, rx: 66, ry: 15, fill: '#5C4632', stroke: '#3B2C20', 'stroke-width': 3 }, hatch);

  const boss = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1 });
  const mega = megaphone(boss.propL, 1);
  const waves = G(cam); const wv = [0, 1, 2].map(i => E('path', { fill: 'none', stroke: '#FFE7A8', 'stroke-width': 5, 'stroke-linecap': 'round' }, waves));
  const ropeR = E('path', { stroke: '#C9A26B', 'stroke-width': 5, fill: 'none' }, cam);
  const res = Robot(cam, { color: '#2EC4B6', glasses: true, hat: 'beret', capColor: '#1F7A70', seed: 2, scale: .75 });
  const resMag = magnifier(res.propR, .55); tf(resMag, 0, 0);
  const bldWrap = G(cam, { 'clip-path': clipRect(-300, -1200, 2300, 1922) });
  const bld = Robot(bldWrap, { color: '#4D96FF', hat: 'cap', capColor: '#E84855', belt: true, seed: 3, scale: .75 });
  const bldHam = G(bld.propR); hammer(bldHam, .75); tf(bldHam, 0, 0);
  const chk = Robot(cam, { color: '#9B5DE5', badge: true, seed: 5, scale: .75 });
  const umb = G(chk.propR);
  E('path', { d: 'M0,0 V-120', stroke: '#3A3F55', 'stroke-width': 5 }, umb);
  E('path', { d: 'M0,4 q8,10 14,0', stroke: '#3A3F55', 'stroke-width': 5, fill: 'none' }, umb);
  const canopy = G(umb); tf(canopy, 0, -118);
  E('path', { d: 'M-92,0 Q-90,-70 0,-76 Q90,-70 92,0 Q69,-14 46,0 Q23,-14 0,0 Q-23,-14 -46,0 Q-69,-14 -92,0 Z', fill: '#FFD166' }, canopy);
  E('path', { d: 'M-46,0 Q-40,-60 0,-76 Q-12,-40 -2,0 Z M46,0 Q40,-60 0,-76 Q12,-40 2,0 Z', fill: '#E84855' }, canopy);
  const pencil = G(chk.propR); E('rect', { x: -4, y: -48, width: 8, height: 46, rx: 2, fill: '#F7C948' }, pencil); E('path', { d: 'M-4,-2 L0,8 L4,-2 Z', fill: '#3A3020' }, pencil);

  /* etichete cu nume (faza A) */
  const tags = [pill(cam, 'Researcher', '#1F9C90'), pill(cam, 'Builder', '#2F6FD6'), pill(cam, 'Checker', '#7A44C4')];
  const subChip = chip(cam, 640, 182, 'experts call them: subagents', 24);

  /* birourile (după personaje, ca să le acopere picioarele) */
  const BX = [250, 610, 970], FX = 1400;
  const desks = BX.map(x => deskAt(cam, x));
  const bossDesk = deskAt(cam, FX, 320);
  /* obiectele de pe birouri */
  const items = G(cam);
  /* Cercetătorul: carte uriașă, pagini care zboară */
  const bookG = N(items, 196, 575); bookProp(bookG, '#1F7A70', 1.15, 1);
  const flip = G(bookG, { transform: 'scale(1.15)' }); const flipPg = E('path', { d: 'M0,-30 Q30,-38 62,-30 V30 Q30,22 0,30 Z', fill: '#FFFDF5', stroke: '#D9CFB8', 'stroke-width': 1 }, flip);
  const flyPg = [0, 1, 2, 3].map(i => { const g = G(items); paper(g, 34, 44, { lines: 3 }); return g; });
  const pileR = pile(items, 362, 598, 13);
  /* Constructorul: ecran mic de aplicație, construit din blocuri */
  const frame = N(items, 700, 538);
  E('rect', { x: -40, y: -64, width: 80, height: 128, rx: 14, fill: '#1E2333' }, frame);
  E('rect', { x: -34, y: -58, width: 68, height: 116, rx: 9, fill: '#FBF7F2' }, frame);
  const blocks = []; for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) blocks.push(E('rect', { x: -30 + c * 31, y: -52 + r * 22, width: 29, height: 19, rx: 4, fill: ['#E07A3F', '#4D96FF', '#F7C948', '#3BB273', '#E84855'][(r + c * 2) % 5] }, frame));
  const sparkB = sparkle(items, '#FFE066', 12);
  const pileB = pile(items, 505, 598, 13);
  /* Verificatorul: clipboard cu teste */
  const cbG = N(items, 1062, 540, .78); const cb = clipboard(cbG, 130, 170);
  const pileK = pile(items, 865, 598, 13);
  /* biletele rămase pe birouri */
  const deskTix = BX.map((x, i) => { const g = N(items, x + [-30, -100, -100][i], 590, .42, -6); ticket(g, 150, 80, { title: 'TICKET' }); return g; });
  /* lumini de reflector pe cabine */
  const spots = BX.map(x => { const g = G(cam); E('path', { d: `M${x - 40},250 L${x - 170},705 L${x + 170},705 L${x + 40},250 Z`, fill: rgrad([[0, '#FFF2C4', .35], [1, '#FFF2C4', 0]], .5, 0, 1) }, g); return g; });
  /* biroul șefului: note mici și indicator */
  const notes = [0, 1, 2].map(i => { const g = N(items, 1320 + i * 62, 586, 1, -8 + i * 8); paper(g, 50, 34, { lines: 2, color: ['#2EC4B6', '#4D96FF', '#9B5DE5'][i] }); return g; });
  const gauge = G(cam); E('rect', { x: 1572, y: 500, width: 16, height: 92, rx: 8, fill: '#2B2238' }, gauge);
  const gFill = E('rect', { x: 1574, y: 570, width: 12, height: 20, rx: 6, fill: '#3BB273' }, gauge);
  const tidy = N(cam, 1400, 655); TX(tidy, 0, 0, 'tidy desk ✓', 20, '#C8FFD9', { a: 'middle', w: 800 });
  /* semne pe cabine */
  const signs = ['Researcher', 'Builder', 'Checker', 'Foreman'].map((t, i) => { const x = i < 3 ? BX[i] : FX;
    const g = N(cam, x, 300); E('path', { d: 'M-60,-320 V0 M60,-320 V0', stroke: '#3B2C20', 'stroke-width': 3 }, g);
    woodSign(g, 200, 50, t, { size: 22, fill: i < 3 ? '#B9814A' : '#9C6A3C' }); return g; });
  const glassChip = chip(cam, 1188, 222, "can't see the foreman's desk", 20);
  /* biletele care zboară */
  const tix = [0, 1, 2].map(() => { const g = G(cam); ticket(g, 150, 80, { title: 'TICKET' }); return g; });
  const bigTix = N(cam, 470, 255);
  ticket(bigTix, 420, 160, { title: 'TICKET · RESEARCHER', text: 'Find out how Apple handles\nsearch and photos.\nBring back: a short summary.', size: 21 });
  /* avioanele-raport */
  const planes = [0, 1, 2].map(() => { const g = G(cam); paperPlane(g, .9, '#FFFFFF'); return g; });
  /* gândul șefului: imaginea de ansamblu */
  const big = N(cam, 1385, 205);
  const tb = thoughtBubble(big, 320, 170); tf(tb, -160, -110);
  TX(big, 0, -58, 'The big picture', 22, '#6B4A2B', { a: 'middle', w: 800 });
  const bpItems = ['Data', 'Screens', 'Search', 'Photos', 'Tests'].map((t, i) => { const g = N(big, -110 + i * 55, -10);
    E('rect', { x: -24, y: -20, width: 48, height: 40, rx: 8, fill: ['#F7C948', '#4D96FF', '#2EC4B6', '#E07A3F', '#9B5DE5'][i] }, g);
    TX(g, 0, 36, t, 12, '#5A4A3A', { a: 'middle', w: 700 });
    const ck = G(g); icon(ck, 'check', 22, '#fff', 5); g.ck = ck; return g; });
  const sweat = G(cam); E('path', { d: 'M0,-12 Q8,0 0,6 Q-8,0 0,-12 Z', fill: '#8FD0FF' }, sweat);

  /* ---------- FAZA C: biletul vag vs. biletul clar ---------- */
  const PC = G(world);
  const dim = E('rect', { x: -50, y: -50, width: 1700, height: 1000, fill: '#120F1C' }, PC);
  const head = N(PC, 800, 120);
  E('rect', { x: -330, y: -34, width: 660, height: 58, rx: 29, fill: '#F7C948' }, head);
  TX(head, 0, 7, 'A helper only knows its ticket.', 32, '#2A1B05', { a: 'middle', w: 800 });
  const mkPanel = (px, good) => {
    const g = N(PC, px, 165);
    E('rect', { x: 6, y: 10, width: 700, height: 540, rx: 26, fill: '#000', 'fill-opacity': .35 }, g);
    E('rect', { x: 0, y: 0, width: 700, height: 540, rx: 26, fill: good ? '#EAF5E9' : '#F7E8E4' }, g);
    E('rect', { x: 0, y: 440, width: 700, height: 100, rx: 26, fill: good ? '#D3E9D1' : '#EDD3CC' }, g);
    E('rect', { x: 0, y: 440, width: 700, height: 30, fill: good ? '#D3E9D1' : '#EDD3CC' }, g);
    E('rect', { x: 0, y: 0, width: 700, height: 540, rx: 26, fill: 'none', stroke: '#3A2E4A', 'stroke-width': 6 }, g);
    const tk = N(g, good ? 230 : 190, good ? 140 : 100);
    if (good) ticket(tk, 400, 222, { title: 'TICKET · BUILDER', text: 'Search the recipe list:\ntitles AND ingredients.\nIgnore capitals & accents.\nWhy: Tudor finds recipes fast.\nAdd tests. Report in 5 lines.', size: 19 });
    else ticket(tk, 300, 112, { title: 'TICKET · BUILDER', text: 'Do the search.', size: 30 });
    const arrowG = G(g); const ay0 = good ? 256 : 162, al = good ? 30 : 100;
    E('path', { d: `M150,${ay0} Q132,${ay0 + al / 2} 150,${ay0 + al}`, stroke: '#7A6A8A', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '8 8' }, arrowG);
    E('path', { d: `M140,${ay0 + al - 12} L150,${ay0 + al + 2} L162,${ay0 + al - 10}`, stroke: '#7A6A8A', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, arrowG);
    const r = Robot(g, { color: '#4D96FF', hat: 'cap', capColor: '#E84855', belt: true, seed: good ? 7 : 3, scale: .64 });
    const h = G(r.propR); hammer(h, .7);
    const qs = [0, 1, 2].map(i => { const q = N(g, 215 + i * 36, 330 - i * 26); TX(q, 0, 0, '?', 38 - i * 4, '#E84855', { a: 'middle', w: 800 }); return q; });
    const res2 = N(g, 520, 320);
    if (!good) {
      const bar = N(res2, 0, 0);
      E('rect', { x: -132, y: -28, width: 264, height: 56, rx: 14, fill: '#fff', stroke: '#B9A99A', 'stroke-width': 3 }, bar);
      E('rect', { x: -126, y: 30, width: 90, height: 18, rx: 5, fill: '#D9CFC2', transform: 'rotate(14 -80 39)' }, bar);
      TX(bar, -90, 10, 'serch', 24, '#9C9288', { w: 700, it: true });
      const mg = N(res2, 110, -6); icon(mg, 'lupa', 30, '#8F857B', 4);
      const blk = [0, 1, 2].map(i => { const b = N(res2, -100 + i * 70, 110); E('rect', { x: -26, y: -14, width: 52, height: 28, rx: 5, fill: ['#E07A3F', '#4D96FF', '#F7C948'][i] }, b); return b; });
      const note = N(res2, 0, 150); TX(note, 0, 0, 'titles only · exact spelling\nno tests', 19, '#C0392B', { a: 'middle', w: 800, lh: 1.25 });
      Object.assign(res2, { bar, mg, blk, note });
    } else {
      const bar = N(res2, 0, -40);
      E('rect', { x: -140, y: -27, width: 280, height: 54, rx: 14, fill: '#fff', stroke: '#3BB273', 'stroke-width': 3 }, bar);
      const ic2 = G(bar, { transform: 'translate(-112,0)' }); icon(ic2, 'lupa', 22, '#5A6B5A', 3.5);
      TX(bar, -90, 9, 'sar', 24, '#2A211B', { w: 700 });
      const rows = ['Sarmale', 'Sarmale (Grandma)'].map((t, i) => { const rr = N(res2, 0, 32 + i * 50);
        E('rect', { x: -140, y: -21, width: 280, height: 42, rx: 10, fill: '#fff', stroke: '#CFE3CC', 'stroke-width': 2 }, rr);
        E('rect', { x: -130, y: -15, width: 30, height: 30, rx: 7, fill: i ? '#7FA35A' : '#B8573A' }, rr);
        TX(rr, -88, 7, t, 19, '#2A211B', { w: 700 }); return rr; });
      const tests = N(res2, 0, 150); TX(tests, 0, 0, '✓ tests pass  ✓ short report', 20, '#2E8B57', { a: 'middle', w: 800 });
      Object.assign(res2, { bar, rows, tests });
    }
    const stamp = N(g, 610, 110); stampMark(stamp, good);
    return { g, tk, arrowG, r, qs, res2, stamp, good };
  };
  const pBad = mkPanel(80, false), pGood = mkPanel(820, true);

  /* ---------- cronologie ---------- */
  const T = {
    resIn: 7.5, bldIn: 9.3, chkIn: 10.7,
    tix: [14.4, 15.6, 16.8],
    walk: 27.6, work: 33.9,
    planes: [45.4, 46.3, 47.2],
    pc: L(10) - .3
  };
  const catchT = T.tix.map(t => t + 1.0);
  const startX = [300, 560, 820], helpers = [res, bld, chk];

  /* stare comună pentru un ajutor: x pe cronologie (sosire, mers la cabină) */
  function helperX(i, lt) {
    const tw = T.walk + i * .25, d = Math.abs(BX[i] - startX[i]) / 110 + .4;
    const hp = clamp((lt - tw - d) / .35);
    return { x: lerp(startX[i], BX[i], clamp((lt - tw) / d)), walking: lt > tw && lt < tw + d, ph: (lt - tw) * 9, y: FLOOR - 65 * hp - Math.sin(Math.PI * hp) * 30 };
  }

  return (lt, at) => {
    bg.anim(at);
    camera(cam, lt, [[0, 800, 450, 1], [L(3) - .3, 800, 450, 1], [L(3) + .9, 640, 440, 1.12], [Le(4) + .3, 640, 440, 1.12], [L(5) + .8, 800, 450, 1],
      [L(6) + .2, 800, 450, 1], [L(6) + 1.6, 620, 470, 1.1], [Le(7), 640, 470, 1.1], [L(8) + .3, 800, 450, 1], [L(9) - .2, 800, 450, 1], [L(9) + 1.1, 1220, 430, 1.22], [L(10) - .5, 1220, 430, 1.22], [L(10), 800, 450, 1], [cue.d, 800, 450, 1]]);
    const phaseB = lt > T.walk - .3;

    /* --- morman de lucru --- */
    op(crates, 1 - prog(lt, T.walk - .2, .8)); tf(crates, 1420, FLOOR, 0, 1, 1 + .02 * Math.sin(at * 3) * (lt < 3 ? 1 : 0));
    op(bigLbl, win(lt, .8, 7, .5, .5)); tf(bigLbl, 1420, 425 + Math.sin(at * 3) * 4);

    /* --- șeful --- */
    {
      const st = { at, face: 'neutral', bob: Math.sin(at * 2) * 2 };
      const tw = T.walk, dW = 2.6;
      const bx = lerp(1130, FX, clamp((lt - tw) / dW));
      st.x = bx; st.y = FLOOR;
      op(mega, lt > 1.9 && lt < 7.2 ? 1 : 0);
      if (lt < 2.2) Object.assign(st, { face: 'worried', look: [1, -.4], hR: [40, -300], hL: [-66, -95], headTilt: 6 });
      else if (lt < 7.2) Object.assign(st, { face: 'joy', hL: [-82, -226], propRotL: 180, hR: [70, -100 + Math.sin(at * 6) * 8], tilt: -4 + Math.sin(at * 5) * 2, look: [-1, 0] });
      else if (lt < 14) Object.assign(st, { face: 'happy', hL: [-90 + Math.sin(at * 7) * 16, -250], hR: [70, -110], look: [-1, 0] });
      else if (lt < 19.6) {
        let k = -1; T.tix.forEach((t, i) => { if (lt > t - .5 && lt < t + .35) k = i; });
        const p = k < 0 ? 0 : clamp((lt - (T.tix[k] - .5)) / .5);
        Object.assign(st, { face: 'happy', look: [-1, 0], hL: k < 0 ? [-60, -150] : [lerp(-40, -110, easeOut(p)), lerp(-170, -250, p)], hR: [68, -120] });
      }
      else if (lt < Le(4) + .3) Object.assign(st, { face: cue.talk(lt, 'A') ? 'happy' : 'proud', talk: cue.talk(lt, 'A'), look: [-1, 0], hL: [-104, -205 + Math.sin(at * 4) * 6], hR: [64, -110], headTilt: -4 });
      else if (lt < tw + dW) { const wc = walkCycle((lt - tw) * 9); Object.assign(st, { face: 'happy', fL: wc.fL, fR: wc.fR, bob: wc.bob, hL: [-60 + wc.swing * 14, -110], hR: [60 - wc.swing * 14, -110], look: [1, 0] }); }
      else {
        /* la biroul lui */
        let k = -1; T.planes.forEach((t, i) => { if (lt > t + 1.1 && lt < t + 1.9) k = i; });
        if (k >= 0) Object.assign(st, { face: 'happy', hL: [-40 - k * 10, -260], hR: [66, -120], look: [-1, -1] });
        else if (lt > L(9) && lt < L(10)) Object.assign(st, { face: 'proud', hL: [-56, -150], hR: [44, -300], bendR: 30, look: [0, -1], headTilt: Math.sin(at * 2) * 4 });
        else if (lt > T.work && lt < T.planes[0] + 1) Object.assign(st, { face: 'focus', hL: [-60, -150 + Math.sin(at * 5) * 5], hR: [60, -150 + Math.sin(at * 5 + 2) * 5], look: [0, 1] });
        else Object.assign(st, { face: 'happy', hL: [-62, -150], hR: [62, -150], look: [-1, 0] });
        st.s = .9;
      }
      boss.set(st);
      /* unde sonore din megafon */
      const shout = lt > 2.6 && lt < 7.0;
      wv.forEach((w, i) => { const ph = (at * 1.6 + i / 3) % 1; const cx = bx - 118 - ph * 120, cy = FLOOR - 226;
        w.setAttribute('d', `M${f2(cx)},${f2(cy - 30 - ph * 30)} Q${f2(cx - 20)},${cy} ${f2(cx)},${f2(cy + 30 + ph * 30)}`); op(w, shout ? (1 - ph) * .9 : 0); });
    }

    /* --- Cercetătorul: coboară pe frânghie --- */
    {
      const hx = helperX(0, lt);
      const st = { at, s: .75, x: hx.x, y: FLOOR, face: 'happy', bob: Math.sin(at * 2.3 + 1) * 2 };
      const p = clamp((lt - T.resIn) / 1.2);
      op(res.root, lt > T.resIn ? 1 : 0);
      if (p < 1) { st.y = lerp(-260, FLOOR, easeOut(p)); Object.assign(st, { air: 1, hL: [-12, -380], hR: [12, -410], fL: [-16, -6 + Math.sin(at * 9) * 5], fR: [16, -10 - Math.sin(at * 9) * 5], face: 'joy', bob: 0 }); }
      else if (lt < T.resIn + 1.5) { const q = (lt - T.resIn - 1.2) / .3; st.squash = 1 - .14 * Math.sin(Math.PI * clamp(q)); st.hL = [-12, -380 + 100 * clamp(q)]; }
      else if (lt < 14) Object.assign(st, { hR: [70 + Math.sin(at * 9) * 14, -300], face: 'joy' });
      else if (lt < Le(4) + .2) {
        const ct = catchT[0];
        if (lt > ct - .5 && lt < ct + .2) st.hR = [36, -260];
        else if (lt >= ct + .2) st.hR = [56, -140];
        if (lt > L(3) && lt < L(4)) Object.assign(st, { face: 'focus', look: [1, -.2], headTilt: Math.sin(at * 5) * 5 });
        if (lt >= L(4) - .1) { const q = clamp((lt - L(4)) / .6); Object.assign(st, { face: 'joy', talk: cue.talk(lt, 'R'), hR: [26, -276], hL: [-56, -140], y: FLOOR - 26 * Math.sin(Math.PI * q) }); }
      }
      else if (hx.walking) { const wc = walkCycle(hx.ph); Object.assign(st, { fL: wc.fL, fR: wc.fR, bob: wc.bob, hL: [-60, -110], hR: [56, -140], look: [-1, 0] }); }
      else if (lt < T.work) Object.assign(st, { y: hx.y, face: 'happy', look: [Math.sin(at * 1.5), .5], hL: [-62, -90], hR: [62, -90] });
      else if (lt < T.planes[0] - .2) Object.assign(st, { y: hx.y, face: 'focus', look: [-.6, 1], hL: [-72, -86], hR: [-60 + Math.sin(at * 1.4) * 40, -130 + Math.cos(at * 1.4) * 12], headTilt: Math.sin(at * 1.4) * 4 });
      else if (lt < T.planes[0] + .4) Object.assign(st, { y: hx.y, face: 'joy', hR: [60, -280], hL: [-50, -100] });
      else Object.assign(st, { y: hx.y, face: 'happy', look: [1, 0], hL: [-50, -100], hR: [40, -100] });
      op(resMag, lt > T.work - .2 && lt < T.planes[0] - .2 ? 1 : 0);
      res.set(st);
      /* frânghia */
      const ropeEnd = p < 1 ? st.y - .75 * 400 : lerp(st.y - .75 * 390, -120, prog(lt, T.resIn + 1.5, .7));
      ropeR.setAttribute('d', `M300,-120 L300,${f2(ropeEnd)}`); op(ropeR, lt > T.resIn && lt < T.resIn + 2.3 ? 1 : 0);
    }

    /* --- Constructorul: iese din trapă --- */
    {
      const hx = helperX(1, lt);
      const st = { at, s: .75, x: hx.x, y: FLOOR, face: 'happy', bob: Math.sin(at * 2.1 + 2) * 2 };
      const t0 = T.bldIn;
      op(bld.root, lt > t0 ? 1 : 0);
      const lid = prog(lt, t0 - .5, .3) * (1 - prog(lt, t0 + 1.6, .3));
      hatchLid.setAttribute('transform', `rotate(${f2(-lid * 75)} 494 712)`);
      op(hatch, win(lt, t0 - .6, t0 + 2.2, .3, .5));
      if (lt < t0 + 1.1) { if (lt < t0 + .55) st.y = lerp(990, 520, easeOut(clamp((lt - t0) / .55))); else st.y = lerp(520, FLOOR, easeIn(clamp((lt - t0 - .55) / .55)));
        Object.assign(st, { air: 1, hL: [-60, -300], hR: [60, -300], face: 'joy', fL: [-20, -14], fR: [20, -14], bob: 0 }); }
      else if (lt < t0 + 1.4) st.squash = 1 - .15 * Math.sin(Math.PI * (lt - t0 - 1.1) / .3);
      else if (lt < 14) Object.assign(st, { hR: [74, -170 + Math.sin(at * 8) * 30], propRotR: Math.sin(at * 8) * 20 });
      else if (lt < Le(4) + .2) { const ct = catchT[1];
        if (lt > ct - .5 && lt < ct + .2) st.hR = [36, -260]; else if (lt >= ct + .2) st.hR = [56, -140];
        st.look = [1, 0]; st.hL = [-62, -110]; }
      else if (hx.walking) { const wc = walkCycle(hx.ph); Object.assign(st, { fL: wc.fL, fR: wc.fR, bob: wc.bob, hL: [-60, -110], hR: [56, -140], look: [1, 0] }); }
      else if (lt < T.work) Object.assign(st, { y: hx.y, face: 'happy', look: [Math.sin(at * 1.3 + 1), .5], hL: [-62, -90], hR: [62, -90] });
      else if (lt < T.planes[1] - .2) { const up = Math.abs(Math.sin(at * 4.4)); Object.assign(st, { y: hx.y, face: 'focus', look: [1, .6], hL: [50, -84], hR: [82, -96 - 50 * up], propRotR: -20 - 40 * up }); }
      else if (lt < T.planes[1] + .4) Object.assign(st, { y: hx.y, face: 'joy', hR: [60, -280], hL: [-50, -100] });
      else Object.assign(st, { y: hx.y, face: 'happy', look: [1, 0], hL: [-50, -100], hR: [50, -100] });
      op(bldHam, (lt > t0 + 1.3 && lt < 14) || (lt > T.work - .2 && lt < T.planes[1] - .2) ? 1 : 0);
      bld.set(st);
    }

    /* --- Verificatorul: coboară cu umbrela --- */
    {
      const hx = helperX(2, lt);
      const st = { at, s: .75, x: hx.x, y: FLOOR, face: 'happy', bob: Math.sin(at * 2.2 + 3) * 2 };
      const t0 = T.chkIn, p = clamp((lt - t0) / 1.8);
      op(chk.root, lt > t0 ? 1 : 0);
      const umbOpen = 1 - prog(lt, t0 + 2.0, .4);
      op(umb, lt < t0 + 2.6 ? 1 : 0); tf(canopy, 0, -118, 0, Math.max(.15, umbOpen), 1);
      if (p < 1) { st.y = lerp(-200, FLOOR, ease(p)); st.x = startX[2] + Math.sin(p * 7) * 40 * (1 - p); Object.assign(st, { air: 1, hR: [26, -380], hL: [-60, -200 + Math.sin(at * 6) * 20], face: 'happy', tilt: Math.sin(p * 7) * 8 * (1 - p), fL: [-18, -8], fR: [18, -12], bob: 0 }); }
      else if (lt < t0 + 2.6) { st.hR = [26, -380 + 200 * prog(lt, t0 + 2.0, .5)]; st.squash = 1 - .1 * Math.sin(Math.PI * clamp((lt - t0 - 1.8) / .3)); }
      else if (lt < 14) Object.assign(st, { face: 'happy', hL: [-66, -96], hR: [66, -96], look: [1, 0] });
      else if (lt < Le(4) + .2) { const ct = catchT[2];
        if (lt > ct - .5 && lt < ct + .2) st.hR = [36, -260]; else if (lt >= ct + .2) st.hR = [56, -140]; st.look = [1, 0]; }
      else if (hx.walking) { const wc = walkCycle(hx.ph); Object.assign(st, { fL: wc.fL, fR: wc.fR, bob: wc.bob, hL: [-60, -110], hR: [56, -140], look: [1, 0] }); }
      else if (lt < T.work) Object.assign(st, { y: hx.y, face: lt > L(5) + 1.6 ? 'think' : 'happy', look: [1, -.2], hL: [-62, -90], hR: [62, -90] });
      else if (lt < T.planes[2] - .2) { const row = Math.floor(clamp((lt - T.work) / 2.2, 0, 3.9)); Object.assign(st, { y: hx.y, face: 'focus', look: [1, .7], hL: [64, -86], hR: [80 + Math.sin(at * 9) * 10, -170 + row * 30] }); }
      else if (lt < T.planes[2] + .4) Object.assign(st, { y: hx.y, face: 'joy', hR: [60, -280], hL: [-50, -100] });
      else Object.assign(st, { y: hx.y, face: 'happy', look: [1, 0], hL: [-50, -100], hR: [50, -100] });
      op(pencil, lt > T.work - .2 && lt < T.planes[2] - .2 ? 1 : 0);
      chk.set(st);
    }

    /* --- etichete cu nume, cip „subagents” --- */
    tags.forEach((g, i) => { const tIn = [T.resIn + 1.4, T.bldIn + 1.3, T.chkIn + 2.0][i]; const x = helperX(i, lt).x;
      const v = pop(lt, tIn, .5) * (1 - prog(lt, T.walk - .3, .4)); op(g, v > 0 ? 1 : 0); tf(g, x, 438 + Math.sin(at * 2 + i) * 3, 0, Math.max(.01, v)); });
    show(subChip, lt, 11.6, L(3) - .4, { pop: true });

    /* --- biletele: zboară de la șef la ajutoare --- */
    tix.forEach((g, i) => {
      const t0 = T.tix[i], p = clamp((lt - t0) / 1.0);
      const from = [1130 - 110 * 1, FLOOR - 250];
      const hx = helperX(i, lt).x;
      let pos, sc = .55, r = 0;
      if (lt < t0) { op(g, 0); return; }
      if (p < 1) { pos = arcPos(easeOut(p), from, [startX[i] + 30, FLOOR - 195], 120); r = p * 720; sc = lerp(.5, .55, p); }
      else if (lt < T.walk + 3.2) { const hy = helperX(i, lt).y; pos = (i === 0 && lt > L(4) - .1 && lt < T.walk) ? [hx - 42, FLOOR - 105] : [hx + 42, hy - 105]; }
      else { op(g, 0); return; }
      op(g, 1); tf(g, pos[0], pos[1], r, sc);
    });
    show(bigTix, lt, L(3) + .2, Le(4) + .4, { pop: true });
    deskTix.forEach((g, i) => show(g, lt, T.walk + 3.2 + i * .1, 1e9, { dy: -20 }));

    /* --- faza B: sticlă, birouri, semne --- */
    const gB = (n, t) => { const v = pop(lt, t, .55); op(n, v > 0 ? 1 : 0); return v; };
    { const v = prog(lt, T.walk + 1.1, .8, easeOut); op(wallG, v); wallG.setAttribute('transform', `translate(0,${f2((1 - v) * 470)})`); }
    panels.forEach((g, i) => { const v = prog(lt, T.walk + .3 + i * .2, .7, easeOut); op(g, v); g.setAttribute('transform', `translate(0,${f2((1 - v) * 310)})`); });
    desks.forEach((g, i) => { const v = gB(g, T.walk + .4 + i * .3); tf(g, g._x, 598 + (1 - v) * 30, 0, 1, Math.max(.01, v)); });
    { const v = gB(bossDesk, T.walk + 1.4); tf(bossDesk, FX, 598 + (1 - v) * 30, 0, 1, Math.max(.01, v)); }
    signs.forEach((g, i) => { const t = T.walk + .8 + i * .3; const dn = prog(lt, t, .7, easeOut); op(g, dn > 0 ? 1 : 0); tf(g, g._x, lerp(-60, 300, dn), swing(lt, t + .5, 7, 5, 1.6)); });
    show(glassChip, lt, L(5) + 2.6, L(8), { pop: true });
    op(items, prog(lt, T.walk + 1.3, .5));
    spots.forEach((g, i) => { const hl = [[L(6), Le(6) + .3], [L(7), L(7) + 2], [L(7) + 2, Le(7) + .3]][i]; op(g, win(lt, hl[0], hl[1], .4, .5) * .9); });

    /* --- lucrul în paralel --- */
    const wp = clamp((lt - T.work) / (T.planes[0] - T.work));
    /* carte: pagina se întoarce */
    { const ph = lt > T.work && lt < T.planes[0] ? ((lt - T.work) / .9) % 1 : 0; flip.setAttribute('transform', `scale(${f2(1.15 * Math.cos(ph * Math.PI))},1.15)`); op(flip, ph > 0 ? 1 : 0); }
    flyPg.forEach((g, i) => { const per = 2.2, t0 = T.work + .6 + i * .55; if (lt < t0 || lt > T.planes[0]) { op(g, 0); return; }
      const ph = ((lt - t0) / per) % 1; const pos = arcPos(ph, [200, 560], [362, 540 - i * 6], 130 + i * 20);
      op(g, Math.sin(Math.PI * ph)); tf(g, pos[0] + Math.sin(ph * 9) * 10, pos[1], Math.sin(ph * 6 + i) * 30, .9); });
    pileR.set(Math.floor(wp * 13)); pileB.set(Math.floor(clamp((lt - T.work - .5) / (T.planes[1] - T.work)) * 13)); pileK.set(Math.floor(clamp((lt - T.work - 1) / (T.planes[2] - T.work)) * 13));
    const nb = Math.floor(clamp((lt - T.work) / (T.planes[1] - T.work - .4)) * 10);
    blocks.forEach((b, i) => { const v = i < nb ? 1 : 0; op(b, v); });
    { const hitPh = (at * 4.4 / Math.PI) % 1; const on = lt > T.work && lt < T.planes[1] - .2 && hitPh < .2; op(sparkB, on ? 1 : 0); tf(sparkB, 672 + Math.sin(at * 3) * 10, 600 - 48, at * 90, .9); }
    cb.rows.forEach((r, i) => op(r.ck, lt > T.work + 1.2 + i * 2.2 ? 1 : 0));

    /* --- avioane-raport --- */
    planes.forEach((g, i) => { const t0 = T.planes[i], p = clamp((lt - t0) / 1.3);
      if (lt < t0 || p >= 1) { op(g, 0); return; }
      const a = [BX[i] + 40, 470], b = [1320 + i * 62, 575];
      const pos = arcPos(easeIn(p) * .2 + p * .8, a, b, 260), pos2 = arcPos(Math.min(1, easeIn(p) * .2 + p * .8 + .02), a, b, 260);
      op(g, 1); tf(g, pos[0], pos[1], Math.atan2(pos2[1] - pos[1], pos2[0] - pos[0]) * 180 / Math.PI + 10, 1); });
    notes.forEach((g, i) => show(g, lt, T.planes[i] + 1.25, 1e9, { pop: true }));
    gFill.setAttribute('height', f2(14 + 10 * clamp((lt - T.planes[0] - 1) / 3))); gFill.setAttribute('y', f2(590 - (14 + 10 * clamp((lt - T.planes[0] - 1) / 3))));
    op(gauge, phaseB ? prog(lt, T.walk + 1.6, .5) : 0);
    show(tidy, lt, L(9) + .3, L(10) - .3, { pop: true });
    { const v = pop(lt, L(9) + .4, .6) * (1 - prog(lt, L(10) - .5, .4)); op(big, v > 0 ? 1 : 0); tf(big, 1385, 205 + Math.sin(at * 1.5) * 5, 0, Math.max(.01, v));
      bpItems.forEach((it, i) => { op(it.ck, prog(lt, L(9) + 1.2 + i * .35, .3)); tf(it, -110 + i * 55, -10 + Math.sin(at * 3 + i) * 2); }); }
    op(sweat, 0);

    /* --- FAZA C --- */
    const pc = prog(lt, T.pc, .6);
    op(PC, pc); op(dim, .82);
    show(head, lt, T.pc + .2, 1e9, { pop: true });
    [pBad, pGood].forEach((P, k) => {
      const t0 = T.pc + .3 + k * .3;
      const v = prog(lt, t0, .7, easeOut); tf(P.g, P.g._x, 165 + (1 - v) * 600, (1 - v) * (k ? 6 : -6));
      const tA = k ? L(12) : L(11);
      const st = { x: 150, y: 505, at, s: .64, face: 'happy', look: [.4, -1], bob: Math.sin(at * 2.2 + k) * 2, hL: [-62, -100], hR: [62, -100] };
      if (lt < tA) Object.assign(st, { face: 'focus', look: [.3, -1], headTilt: Math.sin(at * 2 + k) * 4 });
      else if (!P.good) {
        if (lt < tA + 2.2) Object.assign(st, { face: 'worried', hR: [30 + Math.sin(at * 14) * 8, -300], look: [0, -1], headTilt: -8 });
        else { const up = Math.abs(Math.sin(at * 6)); Object.assign(st, { face: 'worried', look: [1, .2], hR: [120, -180 - 50 * up], propRotR: -30 * up }); }
      } else {
        if (lt < tA + 1.6) Object.assign(st, { face: 'focus', look: [.4, -1], hy: Math.sin(at * 8) * 3 });
        else if (lt < tA + 3.8) { const up = Math.abs(Math.sin(at * 6)); Object.assign(st, { face: 'happy', look: [1, .2], hR: [120, -180 - 50 * up], propRotR: -30 * up }); }
        else Object.assign(st, { face: 'joy', hR: [70, -300], hL: [-70, -300], bendL: -20, bendR: 20 });
      }
      P.r.set(st);
      op(P.arrowG, .5 + .5 * Math.sin(at * 4));
      P.qs.forEach((q, i) => show(q, lt, P.good ? 1e9 : tA + .2 + i * .25, tA + 2.6, { pop: true }));
      const R2 = P.res2;
      if (!P.good) {
        const b0 = tA + 2.2;
        show(R2.bar, lt, b0, 1e9, { pop: true }); if (lt > b0 + .5) tf(R2.bar, 0, 0, -12 + Math.sin(at * 5) * 5);
        const fall = prog(lt, b0 + .6, .7, easeIn); op(R2.mg, lt > b0 ? 1 : 0); tf(R2.mg, 110 + fall * 20, -6 + fall * 110, fall * 120);
        R2.blk.forEach((b, i) => { show(b, lt, b0 + .3 + i * .2, 1e9, { pop: true }); if (lt > b0 + 1) tf(b, -100 + i * 70, 110, [18, -25, 34][i] + Math.sin(at * 4 + i) * 4); });
        show(R2.note, lt, b0 + 1.2, 1e9, { dy: 10 });
        const sv = pop(lt, Le(11) - .5, .5); op(P.stamp, sv > 0 ? 1 : 0); tf(P.stamp, 610, 110, -12, Math.max(.01, sv * (1 + .3 * (1 - prog(lt, Le(11) - .5, .3)))));
      } else {
        const b0 = tA + 1.8;
        show(R2.bar, lt, b0, 1e9, { pop: true });
        R2.rows.forEach((r, i) => show(r, lt, b0 + .8 + i * .4, 1e9, { dx: 30, dy: 0 }));
        show(R2.tests, lt, b0 + 1.8, 1e9, { dy: 10 });
        const sv = pop(lt, Le(12) - .6, .5); op(P.stamp, sv > 0 ? 1 : 0); tf(P.stamp, 610, 110, 10, Math.max(.01, sv));
      }
    });
  };
} });
