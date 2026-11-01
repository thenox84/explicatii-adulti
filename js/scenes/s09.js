"use strict";
/* SCENA 9 — Când se umple masa: foile se adună, rezumat, memorie */
SCENE(9, { build(world, cue) {
  const L = cue, Le = cue.e;
  const cam = G(world);
  const bg = bgWorkshop(cam, { windows: [[300, 90, 380, 300], [980, 90, 380, 300]], pegX: 830, pegY: 110, clockX: 1490, clockY: 180, shelves: [[730, 360, 200]] });
  const FLOOR = 705, HOME = 520;

  /* ---------- dulapul cu dosare ---------- */
  const cab = N(cam, 155, FLOOR);
  E('rect', { x: -88, y: -332, width: 176, height: 332, rx: 8, fill: '#5C6E8C' }, cab);
  E('rect', { x: -88, y: -332, width: 176, height: 14, rx: 6, fill: '#6F82A3' }, cab);
  const drawers = [0, 1, 2].map(i => {
    const g = G(cab); const y = -310 + i * 102;
    const inside = E('rect', { x: -74, y: y - 4, width: 148, height: 18, fill: '#1F2433' }, cab);
    cab.insertBefore(inside, g);
    E('rect', { x: -76, y, width: 152, height: 92, rx: 6, fill: '#7B8FB0' }, g);
    E('rect', { x: -26, y: y + 52, width: 52, height: 12, rx: 6, fill: '#3E4A63' }, g);
    E('rect', { x: -40, y: y + 14, width: 80, height: 28, rx: 4, fill: '#FBF7EE' }, g);
    TX(g, 0, y + 34, ['Summaries', 'Archive', 'Old work'][i], 15, '#3A3020', { a: 'middle', w: 800 });
    return { g, inside };
  });
  /* ---------- raftul memoriei ---------- */
  const shelf = G(cam);
  E('rect', { x: 1400, y: 380, width: 190, height: 14, rx: 4, fill: '#8A5E34' }, shelf);
  E('path', { d: 'M1420,394 L1420,420 L1450,394 Z M1570,394 L1570,420 L1540,394 Z', fill: '#6B4A2B' }, shelf);
  [[1418, '#4D96FF', 64], [1438, '#F7C948', 52], [1456, '#3BB273', 70]].forEach(([x, c, h]) => E('rect', { x, y: 380 - h, width: 16, height: h, rx: 3, fill: c }, shelf));
  const memOnShelf = N(cam, 1530, 316); notebook(memOnShelf, 80, 120, { color: '#9B5DE5' });
  TX(memOnShelf, 4, 4, 'MEMORY', 13, '#5A2E8C', { a: 'middle', w: 800 });

  /* ---------- tubul de sus din care cad foile ---------- */
  const pipe = G(cam);
  E('rect', { x: 950, y: -120, width: 60, height: 400, fill: '#5A6B86' }, pipe);
  E('rect', { x: 940, y: 262, width: 80, height: 34, rx: 8, fill: '#6F82A3' }, pipe);
  E('rect', { x: 946, y: 290, width: 68, height: 10, rx: 4, fill: '#1F2433' }, pipe);
  [40, 140].forEach(y => E('rect', { x: 944, y, width: 72, height: 14, rx: 5, fill: '#6F82A3' }, pipe));
  const puff = G(cam); const puffs = [0, 1, 2].map(i => E('circle', { r: 10, fill: '#fff', 'fill-opacity': .5 }, puff));

  /* ---------- robotul ---------- */
  const boss = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1 });
  const pen = G(boss.propR); E('rect', { x: -4, y: -46, width: 8, height: 44, rx: 2, fill: '#F7C948' }, pen); E('path', { d: 'M-4,-2 L0,8 L4,-2 Z', fill: '#3A3020' }, pen);
  const sweat = G(cam); E('path', { d: 'M0,-14 Q10,2 0,8 Q-10,2 0,-14 Z', fill: '#8FD0FF' }, sweat);

  /* ---------- masa (contextul) ---------- */
  const desk = G(cam);
  E('path', { d: 'M650,612 L670,705 L690,705 L680,612 Z M1290,612 L1270,705 L1250,705 L1260,612 Z', fill: '#5E3E28' }, desk);
  E('path', { d: 'M640,580 L1300,580 L1300,614 L640,614 Z', fill: '#7E5038' }, desk);
  E('path', { d: 'M680,470 L1260,470 L1300,580 L640,580 Z', fill: '#B98552' }, desk);
  for (let i = 0; i < 5; i++) E('path', { d: `M${690 + i * 4},${490 + i * 20} L${1254 + i * 8},${490 + i * 20}`, stroke: '#A8763F', 'stroke-width': 2, opacity: .6 }, desk);
  const rim = E('path', { d: 'M680,470 L1260,470 L1300,580 L640,580 Z', fill: 'none', stroke: '#7A4E2A', 'stroke-width': 9, 'stroke-linejoin': 'round' }, desk);
  const rimGlow = E('path', { d: 'M680,470 L1260,470 L1300,580 L640,580 Z', fill: 'none', stroke: '#FF4D4D', 'stroke-width': 16, 'stroke-linejoin': 'round', 'stroke-opacity': .0 }, desk);
  /* indicator de spațiu */
  const gauge = G(cam);
  E('rect', { x: 1316, y: 470, width: 34, height: 150, rx: 17, fill: '#2B2238', stroke: '#8A97B0', 'stroke-width': 3 }, gauge);
  const gFill = E('rect', { x: 1322, y: 600, width: 22, height: 14, rx: 11, fill: '#3BB273' }, gauge);
  TX(gauge, 1333, 456, 'space', 17, '#E8E1D0', { a: 'middle', w: 700 });
  const edgeLbl = N(cam, 1140, 655);
  E('rect', { x: -112, y: -24, width: 224, height: 40, rx: 20, fill: '#2A1418', 'fill-opacity': .85, stroke: '#FF6B6B', 'stroke-width': 2 }, edgeLbl);
  TX(edgeLbl, 0, 4, 'the edge of the desk', 18, '#FFB0B0', { a: 'middle', w: 800, it: true });
  const ctxChip = N(cam, 970, 438);
  E('rect', { x: -170, y: -22, width: 340, height: 38, rx: 19, fill: '#1E1A2E', 'fill-opacity': .86, stroke: '#F7C948', 'stroke-width': 2 }, ctxChip);
  TX(ctxChip, 0, 4, 'the desk = the context', 19, '#FFE7A8', { a: 'middle', w: 700, it: true });

  /* ---------- foile ---------- */
  const KIND = [['code', '#4D96FF'], ['error', '#E84855'], ['screenshot', '#2EC4B6'], ['report', '#9B5DE5']];
  const SX = [735, 850, 965, 1080, 1195];
  const NC = 24;
  const cards = [];
  for (let k = 0; k < NC; k++) {
    const g = G(cam); const inner = G(g, { transform: 'scale(1,.6)' });
    const kd = KIND[(k * 3 + Math.floor(k / 5)) % 4];
    paper(inner, 118, 86, { label: kd[0], color: kd[1], lines: 3, size: 16 });
    const st = k % 5, lv = Math.floor(k / 5);
    cards.push({ g, st, lv, x: SX[st] + (hash(k) - .5) * 16, y: 548 - lv * 17, r: (hash(k + 9) - .5) * 14, t: 1.4 + k * .36 });
  }
  /* foile care cad pe jos (ultimele 4) */
  const fallX = [760, 980, 1120, 1210];
  /* noi foi după curățenie */
  const fresh = [0, 1].map(i => { const g = G(cam); const inner = G(g, { transform: 'scale(1,.6)' }); paper(inner, 118, 86, { label: ['code', 'report'][i], color: ['#4D96FF', '#9B5DE5'][i], lines: 3, size: 16 }); return g; });

  /* ---------- dosarul „Summary” ---------- */
  const fol = G(cam);
  const folBack = G(fol);
  E('path', { d: 'M-80,-56 H-30 L-20,-66 H10 L20,-56 H80 V56 H-80 Z', fill: '#C9963A' }, folBack);
  const folPages = G(fol); for (let i = 0; i < 3; i++) E('rect', { x: -66 + i * 4, y: -52 - i * 3, width: 120, height: 70, rx: 3, fill: '#FBF7EE', stroke: '#CFC6B2' }, folPages);
  const folFront = G(fol);
  E('rect', { x: -80, y: -40, width: 160, height: 96, rx: 6, fill: '#E9B44C' }, folFront);
  E('rect', { x: -56, y: -12, width: 112, height: 34, rx: 6, fill: '#FFF6E5' }, folFront);
  TX(folFront, 0, 12, 'Summary', 22, '#6B4A10', { a: 'middle', w: 800 });

  /* ---------- caietul „Memory” mare ---------- */
  const memBig = N(cam, 780, 380);
  E('rect', { x: -176, y: -136, width: 352, height: 272, rx: 14, fill: '#000', 'fill-opacity': .25, transform: 'translate(6,8)' }, memBig);
  E('rect', { x: -176, y: -136, width: 352, height: 272, rx: 14, fill: '#9B5DE5' }, memBig);
  E('rect', { x: -158, y: -124, width: 326, height: 248, rx: 8, fill: '#FBF7EE' }, memBig);
  for (let i = 0; i < 8; i++) { const y = -114 + i * 30; E('circle', { cx: -170, cy: y, r: 6, fill: '#2B2F45' }, memBig); }
  for (let i = 0; i < 6; i++) E('path', { d: `M-140,${-58 + i * 34} H150`, stroke: '#D8E3F5', 'stroke-width': 2 }, memBig);
  TX(memBig, 0, -84, 'MEMORY', 30, '#6A3BB0', { a: 'middle', w: 800 });
  const ML = ['Decided: Tudor types recipes', 'Prefers: iOS 17 or newer', 'To do: the app icon'];
  const mlN = ML.map((t, i) => TX(memBig, -138, -30 + i * 48, '', 18, '#2B2238', { w: 700, hand: true }));
  const memSmall = G(cam); notebook(memSmall, 80, 120, { color: '#9B5DE5' });

  /* ---------- fărâme care se pierd ---------- */
  const scraps = [0, 1, 2, 3, 4].map(i => { const g = G(cam); E('rect', { x: -9, y: -6, width: 18 + i * 2, height: 12, rx: 2, fill: '#FBF7EE', stroke: '#CFC6B2' }, g); return g; });
  const lostLbl = N(cam, 360, 300);
  E('rect', { x: -130, y: -24, width: 260, height: 40, rx: 20, fill: '#1E1A2E', 'fill-opacity': .82 }, lostLbl);
  TX(lostLbl, 0, 4, 'a few details get lost', 19, '#FFE7A8', { a: 'middle', w: 700, it: true });

  /* ---------- cronologie ---------- */
  const tGather = L(2) + .2, tClose = tGather + 2.1, tWalk1 = tClose + .3, tDrop = tWalk1 + 1.3, tWalk2 = tDrop + 1.1;
  const tWrite = L(3) + .3, tShelf = Le(3) - 1.2;
  const fillK = [[0, .06], [1.4, .06], [9.6, .97], [tGather, .97], [tClose, .3], [L(4) + 1, .32], [cue.d, .38]];

  return (lt, at) => {
    bg.anim(at);
    camera(cam, lt, [[0, 800, 450, 1], [L(1) - .2, 800, 450, 1], [L(1) + .8, 980, 500, 1.12], [Le(1), 980, 500, 1.12], [L(2) + .6, 760, 460, 1], [tWalk2, 760, 460, 1],
      [L(3) + .6, 800, 420, 1.2], [tShelf, 800, 420, 1.2], [tShelf + 1.2, 980, 440, 1.05], [L(4) + .6, 800, 450, 1], [cue.d, 800, 450, 1]]);
    /* --- foile care cad din tub și se adună --- */
    const gp = t => prog(lt, tGather + t * .07, .7, easeIn);
    let onDesk = 0;
    cards.forEach((c, k) => {
      if (lt < c.t) { op(c.g, 0); return; }
      const p = clamp((lt - c.t) / .6);
      let x, y, r = c.r, s = 1;
      if (k < 20) {
        const pos = arcPos(easeOut(p), [980, 300], [c.x, c.y], 60);
        x = pos[0]; y = pos[1]; r = lerp(180, c.r, p);
        if (p >= 1) onDesk++;
      } else {
        const lvTop = 548 - 4 * 17;
        const pos = arcPos(easeOut(p), [980, 300], [SX[k - 20], lvTop], 60);
        x = pos[0]; y = pos[1];
        const slide = prog(lt, c.t + .6, .5, easeIn), fall = prog(lt, c.t + 1.1, .6, easeIn);
        if (slide > 0) { x = lerp(SX[k - 20], SX[k - 20] + 20, slide); y = lerp(lvTop, 600, slide); r = c.r + slide * 20; }
        if (fall > 0) { x = lerp(SX[k - 20] + 20, fallX[k - 20], fall); y = lerp(600, 690, fall); r = lerp(c.r + 20, [8, -12, 15, -6][k - 20] + (k % 2 ? 360 : -360), fall); }
        if (p >= 1) onDesk++;
      }
      /* strânse în dosar (toate foile vechi, inclusiv cele de pe jos), mai puțin ultimele 4 de pe masă */
      const keep = k >= 15 && k < 20;
      if (!keep) { const q = gp(k % 16); if (q > 0) { x = lerp(x, 600, q); y = lerp(y, 590, q); s = lerp(1, .25, q); r = lerp(r, 0, q); op(c.g, 1 - prog(lt, tGather + (k % 16) * .07 + .55, .2)); tf(c.g, x, y, r, s); return; } }
      else { const q = prog(lt, tGather + 1.4, .8); x = lerp(x, [760, 900, 1040, 1180, 1250][k - 15], q); y = lerp(y, 548, q); r = lerp(r, (k - 17) * 3, q); }
      op(c.g, 1); tf(c.g, x, y, r, s);
    });
    fresh.forEach((g, i) => { const t0 = L(4) + 1.6 + i * 2.2, p = clamp((lt - t0) / .7);
      if (lt < t0) { op(g, 0); return; } const pos = arcPos(easeOut(p), [980, 300], [860 + i * 230, 536], 50); op(g, 1); tf(g, pos[0], pos[1], lerp(160, -4 + i * 6, p)); });
    /* abur la gura tubului */
    puffs.forEach((pf, i) => { const ph = (at * 1.3 + i / 3) % 1; const busy = lt > 1.2 && lt < 10.4 || (lt > L(4) + 1.4 && lt < L(4) + 4.4);
      pf.setAttribute('cx', f2(980 + (i - 1) * 18 + Math.sin(ph * 6) * 6)); pf.setAttribute('cy', f2(300 + ph * 30)); pf.setAttribute('r', f2(6 + ph * 12)); op(pf, busy ? .6 * (1 - ph) : 0); });

    /* --- indicator + margine --- */
    const fl = keyed(lt, fillK);
    gFill.setAttribute('height', f2(14 + 124 * fl)); gFill.setAttribute('y', f2(614 - 14 - 124 * fl));
    gFill.setAttribute('fill', fl > .8 ? (Math.sin(at * 9) > 0 ? '#FF4D4D' : '#C92A3A') : fl > .55 ? '#F2994A' : '#3BB273');
    const alarm = win(lt, 8.6, tGather + .6, .4, .5);
    rimGlow.setAttribute('stroke-opacity', f2(alarm * (.45 + .4 * Math.sin(at * 8))));
    rim.setAttribute('stroke', alarm > .3 ? '#B23A3A' : '#7A4E2A');
    show(edgeLbl, lt, L(1) + .6, tGather, { pop: true });
    show(ctxChip, lt, 1.0, L(1) + .2, { pop: true });

    /* --- robotul --- */
    {
      const st = { at, x: HOME, y: FLOOR, face: 'happy', bob: Math.sin(at * 2) * 2, look: [1, .2] };
      let carry = false;
      if (lt < 1.4) Object.assign(st, { hL: [-64, -96], hR: [120, -126], look: [1, -.4] });
      else if (lt < 6.4) { const k = Math.floor(lt * 1.6) % 3; Object.assign(st, { face: lt < 4.4 ? 'focus' : 'surprise', hR: [130 + k * 40 + Math.sin(at * 6) * 10, -150 - Math.abs(Math.sin(at * 5)) * 20], hL: [-40, -150], look: [1, .4] }); }
      else if (lt < tGather) Object.assign(st, { face: 'worried', hL: [-80, -250 + Math.sin(at * 7) * 10], hR: [86, -250 - Math.sin(at * 7) * 10], look: [Math.sin(at * 1.8), -.3], headTilt: Math.sin(at * 3) * 5 });
      else if (lt < tClose) { const q = prog(lt, tGather, .4); Object.assign(st, { x: lerp(HOME, 450, q), face: 'focus', hL: [60 + Math.sin(at * 9) * 20, -150], hR: [170 + Math.sin(at * 9) * 30, -170], look: [1, .5] }); if (q > 0 && q < 1) { const wc = walkCycle(lt * 9); Object.assign(st, { fL: wc.fL, fR: wc.fR }); } }
      else if (lt < tDrop) { const p = clamp((lt - tWalk1) / 1.2); const wc = walkCycle((lt - tWalk1) * 9); carry = true;
        Object.assign(st, { x: lerp(450, 300, p), face: 'happy', hL: [-86, -170], hR: [60 - wc.swing * 12, -110], look: [-1, 0] }); if (p > 0 && p < 1) Object.assign(st, { fL: wc.fL, fR: wc.fR, bob: wc.bob }); }
      else if (lt < tWalk2) { const q = clamp((lt - tDrop) / .6); Object.assign(st, { x: 300, face: 'happy', hL: [lerp(-86, -150, q), lerp(-170, -300, q)], hR: [66, -100], look: [-1, -.2] }); carry = lt < tDrop + .5; }
      else if (lt < L(3)) { const p = clamp((lt - tWalk2) / 1.1); const wc = walkCycle((lt - tWalk2) * 9);
        Object.assign(st, { x: lerp(300, HOME, p), face: 'proud', hL: [-60 + wc.swing * 12, -110], hR: [60 - wc.swing * 12, -110], look: [1, 0] }); if (p > 0 && p < 1) Object.assign(st, { fL: wc.fL, fR: wc.fR, bob: wc.bob }); }
      else if (lt < tShelf) Object.assign(st, { face: 'focus', hL: [60, -170], hR: [150 + Math.sin(at * 7) * 22, -262 + Math.floor(clamp((lt - tWrite) / 1.8, 0, 2.9)) * 48 * .9 + Math.sin(at * 14) * 4], look: [1, -.4] });
      else if (lt < L(4)) Object.assign(st, { face: 'proud', hR: [90, -300], hL: [-60, -110], look: [1, -.8] });
      else { const k = Math.floor(lt * 1.2) % 3; Object.assign(st, { face: 'happy', hR: [130 + k * 40, -150 - Math.abs(Math.sin(at * 4)) * 14], hL: [-50 + Math.sin(at * 3) * 10, -150], look: [1, .4], headTilt: Math.sin(at * 2.4) * 6, bob: Math.abs(Math.sin(at * 4.8)) * -6 }); }
      boss.set(st);
      op(pen, lt > tWrite - .2 && lt < tShelf ? 1 : 0);
      /* picătura de transpirație */
      const sw = win(lt, 6.8, tGather, .3, .3); const ph = (at * 1.2) % 1;
      op(sweat, sw * (1 - ph * .6)); tf(sweat, HOME + 62, FLOOR - 270 + ph * 50);
      /* dosarul */
      const fo = prog(lt, tGather - .2, .4);
      op(fol, fo * (1 - prog(lt, tDrop + .5, .3)));
      const shut = prog(lt, tClose - .3, .4, easeOut);
      folFront.setAttribute('transform', `translate(0,56) scale(1,${f2(lerp(.35, 1, shut))}) translate(0,-56)`);
      op(folPages, 1 - shut * .9);
      if (!carry && lt < tWalk1) tf(fol, 600, 600, 0, 1);
      else if (lt < tDrop) tf(fol, st.x - 86, FLOOR - 170 + 20, -8, .8);
      else { const q = prog(lt, tDrop, .5, easeIn); tf(fol, lerp(st.x - 120, 155, q), lerp(FLOOR - 250, FLOOR - 330, q), 0, lerp(.8, .5, q)); }
      /* sertarul de sus */
      const dOpen = win(lt, tDrop - .4, tDrop + .7, .3, .3);
      tf(drawers[0].g, 0, dOpen * 10, 0, 1 + dOpen * .06); op(drawers[0].inside, dOpen);
    }

    /* --- memoria --- */
    const mOpen = pop(lt, L(3) - .1, .5) * (1 - prog(lt, tShelf, .4));
    op(memBig, mOpen > 0 ? 1 : 0); tf(memBig, 780, 380, 0, Math.max(.01, mOpen));
    mlN.forEach((n, i) => { const t0 = tWrite + i * 1.8; const k = Math.floor(clamp((lt - t0) / 1.5) * ML[i].length); n.textContent = (k > 0 ? '• ' : '') + ML[i].slice(0, k); });
    { const q = prog(lt, tShelf, 1.0); op(memSmall, q > 0 && q < 1 ? 1 : 0); const pos = arcPos(q, [780, 400], [1530, 316], 140); tf(memSmall, pos[0], pos[1], (1 - q) * 30, lerp(1.4, 1, q)); }
    op(memOnShelf, lt > tShelf + 1 ? 1 : 0); tf(memOnShelf, 1530, 316, 0, lt > tShelf + 1 ? lerp(1.15, 1, prog(lt, tShelf + 1, .4)) : 1);

    /* --- fărâmele pierdute --- */
    scraps.forEach((g, i) => { const t0 = L(4) + 2.2 + i * .7, p = clamp((lt - t0) / 4.2);
      if (lt < t0) { op(g, 0); return; }
      op(g, Math.sin(Math.PI * p) * .95); tf(g, 155 + 40 * p * (1 + i * .3) + Math.sin(at * 3 + i) * 18, FLOOR - 340 - p * (180 + i * 30), Math.sin(at * 4 + i) * 40 + p * 200); });
    show(lostLbl, lt, L(4) + 3.6, 1e9, { pop: true });
  };
} });
