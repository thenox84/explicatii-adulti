"use strict";
/* SCENA 4 — Planul: tabla cu sarcini, lada cu date, planul se schimbă */
SCENE(4, { build(world, cue) {
  const L = i => cue(i), Le = i => cue.e(i);
  const cam = G(world);
  const bg = bgWorkshop(cam, { windows: [[30, 130, 230, 290]], pegboard: false, clockX: 1528, clockY: 122, shelves: [[1478, 640, 140]], lamps: [330, 880, 1400] });

  /* tabla-plan (blueprint) */
  const board = G(cam);
  E('rect', { x: 318, y: 98, width: 1164, height: 474, rx: 16, fill: '#000', 'fill-opacity': .25, transform: 'translate(8,10)' }, board);
  E('rect', { x: 318, y: 98, width: 1164, height: 474, rx: 16, fill: '#8A5A3B' }, board);
  E('rect', { x: 334, y: 114, width: 1132, height: 442, rx: 8, fill: lgrad([[0, '#245A9E'], [1, '#1B467E']]) }, board);
  for (let x = 354; x < 1466; x += 28) E('path', { d: `M${x},114 V556`, stroke: '#fff', 'stroke-opacity': x % 140 === 74 ? .16 : .07, 'stroke-width': 1.5 }, board);
  for (let y = 134; y < 556; y += 28) E('path', { d: `M334,${y} H1466`, stroke: '#fff', 'stroke-opacity': .07, 'stroke-width': 1.5 }, board);
  E('rect', { x: 330, y: 560, width: 1140, height: 14, rx: 5, fill: '#6B4228' }, board);
  [[420, '#fff'], [452, '#FFE066'], [1380, '#FF9FB2']].forEach(([x, c]) => E('rect', { x, y: 552, width: 26, height: 9, rx: 4, fill: c }, board));
  /* titlul scris cu creta */
  const ttl = G(board, { 'clip-path': clipRect(350, 120, 900, 60) });
  const ttlClip = DEFS.lastChild.firstChild;
  TX(ttl, 360, 165, 'PLAN · Family Recipes app', 34, '#F4F8FF', { w: 700, hand: true });
  /* sloturi, numere, săgeți */
  const slot = i => [450 + (i % 5) * 224, 260 + Math.floor(i / 5) * 150];
  const slots = [], arrows = [];
  for (let i = 0; i < 10; i++) { const [x, y] = slot(i); const n = N(board, x, y);
    E('rect', { x: -95, y: -52, width: 190, height: 104, rx: 10, fill: 'none', stroke: '#fff', 'stroke-opacity': .45, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, n); slots.push(n);
    if (i % 5 < 4) { const a = G(board); E('path', { d: `M${x + 101},${y} H${x + 126} M${x + 118},${y - 7} L${x + 127},${y} L${x + 118},${y + 7}`, stroke: '#F4F8FF', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, a); arrows.push(a); } }
  const longA = E('path', { d: 'M1346,316 C1346,342 450,322 450,354', stroke: '#F4F8FF', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, board);

  /* cartonașele cu sarcini */
  const TASKS = [['Xcode\nproject', 'folder'], ['Data box', 'file'], ['Screens', 'phone'], ['Search', 'lupa'], ['Favourites', 'heart'], ['Photos', 'camera'], ['Shopping\nlist', 'list'], ['Tests', 'check'], ['Build\nthe app', 'hammer'], ['Try on test\niPhone', 'phone']];
  const COLS = ['#FFE066', '#FF9FB2', '#9EE6C9', '#A9D6FF', '#FFC285'];
  const cardsL = G(cam);
  const cards = TASKS.map(([t, ic], i) => {
    const n = G(cardsL); const inner = G(n);
    E('rect', { x: -91, y: -46, width: 190, height: 100, rx: 8, fill: '#000', 'fill-opacity': .22 }, inner);
    E('rect', { x: -95, y: -52, width: 190, height: 104, rx: 8, fill: COLS[i % 5] }, inner);
    E('rect', { x: -95, y: -52, width: 190, height: 14, rx: 8, fill: '#000', 'fill-opacity': .06 }, inner);
    const glow = E('rect', { x: -101, y: -58, width: 202, height: 116, rx: 12, fill: 'none', stroke: '#FFF3B0', 'stroke-width': 6, opacity: 0 }, inner);
    const ig = G(inner); tf(ig, -56, 6);
    if (ic === 'heart') E('path', { d: HEART, transform: 'scale(2.2)', fill: '#E84855' }, ig); else icon(ig, ic, 38, '#3A3020', 3.5);
    const two = t.includes('\n');
    TX(inner, -24, two ? -4 : 14, t, 21, '#2E2516', { w: 800, lh: 1.15 });
    E('circle', { cx: 0, cy: -44, r: 7, fill: ['#E84855', '#4D96FF', '#3BB273'][i % 3] }, inner);
    return { n, inner, glow, x: slot(i)[0], y: slot(i)[1], r: (hash(i + 2) - .5) * 5 };
  });
  /* numerele de ordine (rămân pe loc) */
  const nums = []; for (let i = 0; i < 10; i++) { const [x, y] = slot(i); const n = N(cam, x - 86, y - 44);
    E('circle', { r: 17, fill: '#F4F8FF' }, n); TX(n, 0, 7, String(i + 1), 19, '#1B467E', { a: 'middle', w: 800 }); nums.push(n); }
  /* cartonașul nou */
  const newC = G(cam);
  E('rect', { x: -110, y: -36, width: 228, height: 76, rx: 8, fill: '#000', 'fill-opacity': .22, transform: 'translate(5,6)' }, newC);
  E('rect', { x: -110, y: -36, width: 228, height: 76, rx: 8, fill: '#FF9FB2' }, newC);
  TX(newC, 4, 9, '+ photo permission', 21, '#2E2516', { a: 'middle', w: 800 });
  const badge = G(newC); tf(badge, 104, -34, 14);
  E('rect', { x: -30, y: -15, width: 60, height: 28, rx: 8, fill: '#E84855' }, badge); TX(badge, 0, 6, 'NEW', 16, '#fff', { a: 'middle', w: 800 });
  const bang = G(cam); E('circle', { r: 30, fill: '#FFE066' }, bang); TX(bang, 0, 14, '!', 42, '#8A5A2B', { a: 'middle', w: 800 });

  /* lada cu date */
  const crate = N(cam, 0, 0);
  const CX = 1150, CW = 430, CY0 = 594;
  E('ellipse', { cx: CX, cy: 728, rx: 240, ry: 14, fill: '#000', 'fill-opacity': .25 }, crate);
  E('path', { d: `M${CX - CW / 2 + 16},${CY0 - 22} H${CX + CW / 2 - 16} L${CX + CW / 2},${CY0} H${CX - CW / 2} Z`, fill: '#5A3D22' }, crate);
  for (let k = 1; k < 4; k++) E('path', { d: `M${CX - CW / 2 + k * CW / 4},${CY0} l${(k - 2) * 4},-22`, stroke: '#9C7040', 'stroke-width': 6 }, crate);
  const cItems = G(crate);
  const front = G(crate);
  E('rect', { x: CX - CW / 2, y: CY0, width: CW, height: 130, rx: 6, fill: '#C8954F' }, front);
  for (let k = 0; k < 3; k++) E('rect', { x: CX - CW / 2, y: CY0 + 8 + k * 42, width: CW, height: 5, fill: '#A0723A', opacity: .7 }, front);
  for (let k = 1; k < 4; k++) E('rect', { x: CX - CW / 2 + k * CW / 4 - 4, y: CY0, width: 8, height: 130, fill: '#A0723A' }, front);
  E('rect', { x: CX - CW / 2, y: CY0, width: CW, height: 10, rx: 4, fill: '#DBA968' }, front);
  TX(front, CX, CY0 + 44, 'RECIPE DATA', 22, '#5A3D22', { a: 'middle', w: 800, ls: 3 });
  const lab = ['title', 'ingredients', 'steps', 'photo'].map((s, k) => TX(front, CX - CW / 2 + (k + .5) * CW / 4, CY0 + 92, s, 17, '#3E2A14', { a: 'middle', w: 800 }));
  const compX = k => CX - CW / 2 + (k + .5) * CW / 4;
  const mk = [];
  { const g = G(cItems); E('rect', { x: -48, y: -20, width: 96, height: 40, rx: 8, fill: '#fff' }, g); E('rect', { x: -48, y: -20, width: 96, height: 12, rx: 6, fill: '#E84855' }, g); TX(g, 0, 14, 'Sarmale', 18, '#2A211B', { a: 'middle', w: 800, hand: true }); mk.push(g); }
  { const g = G(cItems); paper(g, 74, 92, { lines: 5, color: '#3BB273' }); mk.push(g); }
  { const g = G(cItems); paper(g, 74, 92, { lines: 0 }); ['1', '2', '3'].forEach((s, j) => { TX(g, -22, -18 + j * 22, s + '.', 15, '#4D5FA8', { w: 800 }); E('rect', { x: -6, y: -26 + j * 22, width: 34, height: 5, rx: 2, fill: '#CFC6B2' }, g); }); mk.push(g); }
  { const g = G(cItems); E('rect', { x: -40, y: -44, width: 80, height: 92, rx: 4, fill: '#fff' }, g); E('rect', { x: -32, y: -36, width: 64, height: 60, fill: '#B8573A' }, g);
    E('circle', { cx: 0, cy: -6, r: 22, fill: '#fff', 'fill-opacity': .85 }, g); E('circle', { cx: 0, cy: -6, r: 14, fill: '#7FA35A' }, g); mk.push(g); }

  /* robotul */
  const boss = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1, scale: .9 });
  const cb = G(boss.propL); tf(cb, 0, -60, 0, .8); clipboard(cb, 130, 170);
  const marker = G(boss.propR); E('rect', { x: -8, y: -58, width: 16, height: 52, rx: 5, fill: '#E84855' }, marker); E('rect', { x: -8, y: -62, width: 16, height: 14, rx: 4, fill: '#B83240' }, marker); E('path', { d: 'M-5,-6 L0,8 L5,-6 Z', fill: '#2B2F45' }, marker);
  const sparks = [0, 1, 2, 3, 4].map(() => sparkle(cam, '#FFE066', 13));

  /* momentele cartonașelor */
  const tCard = [L(1) + .6, L(2) + .3, L(3) + .45, L(3) + 1.15, L(3) + 1.85, L(3) + 2.7, L(3) + 3.4, L(4) + 1.1, L(4) + 2.0, L(4) + 3.1];
  const RX = 215, RY = 726, RS = .9;

  return (lt, at) => {
    bg.anim(at);
    camera(cam, lt, [[0, 800, 450, 1], [L(1) - .3, 800, 450, 1], [L(1) + .8, 660, 380, 1.08], [L(2) - .2, 660, 380, 1.08], [L(2) + .9, 830, 430, 1.06], [Le(2) + .2, 830, 430, 1.06],
      [L(3) + .7, 880, 420, 1], [L(4) + .3, 880, 420, 1], [L(4) + 1.2, 900, 420, 1.03], [L(5) - .2, 900, 420, 1.03], [L(5) + 1.2, 840, 430, 1], [cue.d, 830, 430, 1.03]]);

    /* titlul se scrie, sloturile apar, săgețile se desenează */
    const tp = prog(lt, L(0) + 1.7, 1.6, t => t); ttlClip.setAttribute('width', f2(900 * tp));
    slots.forEach((s, i) => show(s, lt, L(0) + .9 + i * .22, 1e9, { pop: true }));
    nums.forEach((n, i) => show(n, lt, L(0) + 1.0 + i * .22, 1e9, { pop: true }));
    arrows.forEach((a, i) => op(a, prog(lt, L(0) + 2.0 + i * .25, .4)));
    longA.setAttribute('stroke-dashoffset', f2(1 - prog(lt, L(0) + 3.1, .9)));

    /* cartonașele: zboară din mâna robotului */
    const swapP = prog(lt, L(5) + 1.8, 1.2);
    cards.forEach((c, i) => { const t0 = tCard[i]; const p = prog(lt, t0, .55, t => t);
      let tx = c.x, ty = c.y;
      if (i === 7) { tx = lerp(c.x, slot(8)[0], swapP); ty = c.y - Math.sin(Math.PI * swapP) * 70; }
      if (i === 8) { tx = lerp(c.x, slot(7)[0], swapP); ty = c.y + Math.sin(Math.PI * swapP) * 50; }
      if (p <= 0) { op(c.n, 0); return; }
      op(c.n, 1);
      const from = [RX + 150, RY - 250];
      const q = easeOut(p); const [x, y] = arcPos(q, from, [tx, ty], 110);
      const land = pop(lt, t0 + .5, .45);
      tf(c.n, p < 1 ? x : tx, p < 1 ? y : ty, p < 1 ? (1 - q) * -60 : c.r + swing(lt, t0 + .5, 5, 7, 2.5), p < 1 ? lerp(.4, 1, q) : lerp(1.15, 1, land));
      /* evidențiere când e numită */
      const hl = win(lt, t0 + .1, t0 + 1.6, .2, .6) + (i === 5 ? win(lt, L(5) + 3.4, L(5) + 5.4, .3, .5) : 0) + ((i === 7 || i === 8) ? win(lt, L(5) + 1.6, L(5) + 3.4, .3, .5) : 0);
      c.glow.setAttribute('opacity', f2(clamp(hl) * (.7 + .3 * Math.sin(at * 7))));
    });

    /* lada cu date */
    const cv = show(crate, lt, L(2) + .6, 1e9, { dy: 60, d: .7 });
    lab.forEach((l, k) => l.setAttribute('fill', win(lt, L(2) + 2.7 + k * .9, L(2) + 3.9 + k * .9, .2, .4) > .3 ? '#B83240' : '#3E2A14'));
    mk.forEach((m, k) => { const t0 = L(2) + 2.6 + k * .9, p = prog(lt, t0, .7, t => t);
      if (p <= 0) { op(m, 0); return; } op(m, 1);
      const [x, y] = arcPos(easeIn(p), [slot(1)[0], slot(1)[1] + 30], [compX(k), CY0 - 18], 160);
      tf(m, x, y + (p >= 1 ? Math.sin((lt - t0) * 2 + k) * 1.5 : 0), (1 - p) * 120 * (k % 2 ? 1 : -1), p >= 1 ? .82 : lerp(.5, .82, p)); });

    /* robotul */
    const st = { x: RX, y: RY, s: RS, at, face: 'happy', look: [1, -.5], bob: Math.sin(at * 2.2) * 2 };
    op(cb, 1 - prog(lt, L(1) - .2, .4)); op(marker, prog(lt, L(1) - .2, .4));
    let throwing = false;
    tCard.forEach((t0, i) => { const p = (lt - (t0 - .45)) / .65; if (p >= 0 && p <= 1) { throwing = true;
      const hp = keyed(p, [[0, [70, -120]], [.45, [40, -300]], [.75, [170, -250]], [1, [120, -170]]]);
      Object.assign(st, { hR: hp, rotR: -30, look: [clamp((cards[i].x - RX) / 500, -1, 1), clamp((cards[i].y - 500) / 300, -1, 1)], face: 'focus', tilt: p < .45 ? -4 : 5 }); } });
    if (lt < L(1) - .2) Object.assign(st, { hL: [-30, -190], bendL: 30, hR: [70, -110], look: [-.5, .4], face: 'focus', headTilt: -6 + Math.sin(at * 2) * 2 });
    else if (!throwing && lt < L(5)) {
      if (lt > L(2) + 2 && lt < Le(2) + .3) Object.assign(st, { hR: [170, -170], rotR: -60, hL: [-66, -100], look: [1, .3], face: 'happy' });
      else Object.assign(st, { hR: [52, -250 + Math.sin(at * 3) * 6], rotR: -10, hL: [-66, -100], look: [.8, -.6], face: 'happy', headTilt: Math.sin(at * 1.7) * 4 });
    }
    /* planul se schimbă: robotul merge la tablă */
    if (lt >= L(5)) {
      const wx = keyed(lt, [[L(5), RX], [L(5) + 1.5, 770]], t => t);
      const walking = lt < L(5) + 1.5;
      st.x = wx;
      if (walking) { const w = walkCycle(wx / 20); Object.assign(st, { fL: w.fL, fR: w.fR, bob: w.bob, hL: [-64 + w.swing * 14, -96], hR: [64 - w.swing * 14, -96], look: [1, -.3], face: 'happy' }); }
      else if (lt < L(5) + 3.2) { const cx = lerp(slot(7)[0], slot(8)[0], swapP); Object.assign(st, { hR: [clamp((cx - 770) / RS, -60, 170), -300], rotR: -20, hL: [-70, -110], look: [clamp((cx - 770) / 300, -1, 1), -1], face: 'focus' }); }
      else if (lt < L(5) + 4.6) Object.assign(st, { hR: [60, -290], hL: [-66, -100], face: 'surprise', look: [-.6, -1] });
      else { const p = (lt - (L(5) + 4.6)) / .65; Object.assign(st, p < 1 ? { hR: keyed(clamp(p), [[0, [60, -280]], [.5, [-60, -300]], [1, [-170, -230]]]), rotR: 20, look: [-1, -.6], face: 'focus' } : { hR: [80, -270], hL: [-80, -270], bendL: 30, bendR: -30, face: 'joy', look: [0, 0], y: RY - Math.abs(Math.sin((lt - L(5) - 5.3) * 6)) * 12 * (1 - prog(lt, cue.d - 1.5, 1)) }); }
    }
    boss.set(st);

    /* scântei: din clipboard spre sloturi */
    sparks.forEach((s, i) => { const t0 = L(0) + .6 + i * .35, p = prog(lt, t0, .8, t => t);
      if (p > 0 && p < 1) { const [x, y] = arcPos(easeOut(p), [RX - 30, RY - 230], slot(i * 2), 120); op(s, 1); tf(s, x, y, at * 200, .8 + .4 * Math.sin(at * 9)); } else op(s, 0); });
    /* ceva nou: „!” și cartonașul nou */
    const bv = pop(lt, L(5) + 3.3, .5) * (1 - prog(lt, L(5) + 5.2, .4));
    op(bang, bv > 0 ? 1 : 0); tf(bang, 770 + 10, RY - 345 + Math.sin(at * 6) * 5, Math.sin(at * 8) * 8, bv);
    const np = prog(lt, L(5) + 4.9, .6, t => t);
    if (np > 0) { op(newC, 1); const [x, y] = arcPos(easeOut(np), [620, 480], [534, 498], 90); tf(newC, x, y, np < 1 ? (1 - np) * 40 : 3 + swing(lt, L(5) + 5.5, 5, 7, 2.5), np < 1 ? lerp(.4, 1, np) : lerp(1.15, 1, pop(lt, L(5) + 5.5, .45))); }
    else op(newC, 0);
    tf(badge, 104, -34, 14 + Math.sin(at * 5) * 6);
  };
} });
