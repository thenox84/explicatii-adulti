"use strict";
/* SCENA 3 — Cum înțelege mesajul: masa de lucru (contextul), cerințe, întrebări */
SCENE(3, { build(world, cue) {
  const L = i => cue(i), Le = i => cue.e(i);
  const cam = G(world);
  const bg = bgWorkshop(cam, { windows: [[150, 90, 360, 300], [1060, 90, 360, 300]], pegX: 800, pegY: 110, clockX: 1490, clockY: 118, shelves: [[-120, 470, 220]] });

  /* lucruri care NU sunt pe masă (în întuneric) */
  const ghosts = G(cam);
  const crate = (x, y, w, h, label) => { const g = G(ghosts); tf(g, x, y);
    E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 6, fill: '#B88A52' }, g);
    E('rect', { x: -w / 2, y: -h, width: w, height: 14, rx: 4, fill: '#9C7040' }, g);
    for (let i = 1; i < 3; i++) E('rect', { x: -w / 2 + 6, y: -h + i * h / 3, width: w - 12, height: 5, fill: '#9C7040' }, g);
    TX(g, 0, -h / 2 + 8, label, 18, '#4A3510', { a: 'middle', w: 800 }); return g; };
  crate(1430, 722, 190, 120, 'Other projects'); crate(1440, 602, 150, 90, 'Old chats');
  crate(150, 722, 170, 100, 'Everything else');
  const qs = [[1360, 470], [1520, 520], [120, 560]].map(([x, y]) => { const t = TX(ghosts, x, y, '?', 50, '#FFE7A8', { a: 'middle', w: 800 }); return t; });

  /* robotul */
  const boss = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1 });

  /* masa de lucru = contextul */
  const desk = G(cam);
  E('ellipse', { cx: 892, cy: 726, rx: 420, ry: 16, fill: '#000', 'fill-opacity': .25 }, desk);
  [[540, 26], [1218, 26]].forEach(([x, w]) => E('rect', { x, y: 672, width: w, height: 52, fill: '#6B4228' }, desk));
  const SURF = 'M560,440 L1225,440 L1262,640 L522,640 Z';
  E('path', { d: SURF, fill: '#C9945F' }, desk);
  for (let i = 0; i < 7; i++) E('path', { d: `M${565 - i * 5},${462 + i * 27} H${1222 + i * 5}`, stroke: '#B88350', 'stroke-width': 2, opacity: .7 }, desk);
  const rimGlow = E('path', { d: SURF, fill: 'none', stroke: '#FFB347', 'stroke-width': 22, 'stroke-linejoin': 'round', opacity: 0 }, desk);
  E('path', { d: SURF, fill: 'none', stroke: '#7A4B2A', 'stroke-width': 12, 'stroke-linejoin': 'round' }, desk);
  E('path', { d: 'M566,446 L1219,446', stroke: '#E2B282', 'stroke-width': 3, opacity: .8 }, desk);
  E('rect', { x: 516, y: 640, width: 752, height: 34, rx: 4, fill: '#8A5A3B' }, desk);
  E('rect', { x: 516, y: 668, width: 752, height: 6, fill: '#6B4228' }, desk);
  /* indicatorul de umplere */
  const gauge = G(cam);
  E('rect', { x: 1276, y: 330, width: 24, height: 292, rx: 12, fill: '#22263A', stroke: '#E8E1C9', 'stroke-width': 3 }, gauge);
  const gFill = E('rect', { x: 1282, y: 620, width: 12, height: 0, rx: 6, fill: C.green }, gauge);
  const gBulb = E('circle', { cx: 1288, cy: 636, r: 19, fill: C.green, stroke: '#E8E1C9', 'stroke-width': 3 }, gauge);
  for (let i = 1; i < 6; i++) E('rect', { x: 1302, y: 330 + i * 48, width: 10, height: 3, fill: '#E8E1C9' }, gauge);
  TX(gauge, 1288, 318, 'FULL', 17, '#FF8A80', { a: 'middle', w: 800 });
  const setGauge = f => { f = clamp(f); const h = 280 * f; gFill.setAttribute('y', f2(620 - h)); gFill.setAttribute('height', f2(h));
    const c = f > .75 ? C.red : f > .5 ? C.warm : C.green; gFill.setAttribute('fill', c); gBulb.setAttribute('fill', c); };

  /* obiectele de pe masă */
  const items = G(cam);
  const book = N(items, 640, 525);
  E('rect', { x: -66, y: -38, width: 140, height: 86, rx: 8, fill: '#F2E1C1' }, book);
  E('rect', { x: -72, y: -46, width: 140, height: 86, rx: 8, fill: '#B83240' }, book);
  E('rect', { x: -72, y: -46, width: 18, height: 86, rx: 6, fill: '#8E2432' }, book);
  TX(book, 6, -10, 'BASIC', 20, '#F7C948', { a: 'middle', w: 800, ls: 2 }); TX(book, 6, 20, 'RULES', 24, '#F7C948', { a: 'middle', w: 800, ls: 2 });
  const msg = N(items, 800, 540); paper(msg, 150, 160, { label: 'From Tudor', color: '#4D96FF', size: 19 });
  const fol = N(items, 975, 530); folder(fol, 160, 116, { label: 'Project files', size: 18 });
  const note = N(items, 1140, 525); notebook(note, 130, 150, { label: 'Memory', color: '#9B5DE5' });
  const plane = G(cam); paperPlane(plane, 1.5, '#FFFFFF');
  /* teancul „de umplere” */
  const pile = G(cam); const pileP = [];
  for (let i = 0; i < 16; i++) { const n = G(pile); paper(n, 96, 116, { color: ['#4D96FF', '#E84855', '#3BB273', '#F7C948', '#9B5DE5'][i % 5], lines: 4 });
    pileP.push({ n, x: 600 + hash(i + 3) * 620, y: 470 + hash(i + 11) * 140, r: (hash(i + 7) - .5) * 40 }); }

  /* întuneric în afara mesei */
  const mid = uid('m3'); const mask = E('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -400, y: -400, width: 2400, height: 1700 }, DEFS);
  E('rect', { x: -400, y: -400, width: 2400, height: 1700, fill: '#fff' }, mask);
  const hole = rgrad([[0, '#000'], [.72, '#000'], [1, '#fff']]);
  E('ellipse', { cx: 905, cy: 540, rx: 480, ry: 205, fill: hole }, mask);
  E('ellipse', { cx: 392, cy: 545, rx: 185, ry: 270, fill: hole }, mask);
  const dark = E('rect', { x: -400, y: -400, width: 2400, height: 1700, fill: '#07060E', mask: `url(#${mid})` }, cam);

  /* semnul „context” */
  const sign = N(cam, 892, 300);
  E('path', { d: 'M-150,-260 V10 M150,-260 V10', stroke: '#3A2A20', 'stroke-width': 4 }, sign);
  woodSign(sign, 420, 96, '', {});
  TX(sign, 0, 36, 'experts call this', 21, '#FFE7B8', { a: 'middle', w: 700, it: true });
  TX(sign, 0, 74, 'THE CONTEXT', 34, '#FFF6E5', { a: 'middle', w: 800, ls: 2 });
  const edgeLbl = N(cam, 1170, 700);
  arrow3(edgeLbl);
  function arrow3(p) { E('path', { d: 'M-20,0 L-60,-40', stroke: '#FFB347', 'stroke-width': 5, 'stroke-linecap': 'round' }, p); E('path', { d: 'M-48,-42 L-62,-42 L-60,-28', stroke: '#FFB347', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
    TX(p, 0, 12, 'the edge', 26, '#FFD27A', { w: 800 }); }

  /* lista de cerințe (clipboard pe perete) */
  const clip = G(cam); const clipIn = G(clip); tf(clipIn, 0, 200);
  E('rect', { x: -132, y: -196, width: 264, height: 380, rx: 14, fill: '#000', 'fill-opacity': .25, transform: 'translate(6,8)' }, clipIn);
  E('rect', { x: -132, y: -196, width: 264, height: 380, rx: 14, fill: '#A0672E' }, clipIn);
  E('rect', { x: -116, y: -170, width: 232, height: 340, rx: 6, fill: C.paper }, clipIn);
  E('rect', { x: -40, y: -210, width: 80, height: 30, rx: 8, fill: '#B8BDCC' }, clipIn);
  E('circle', { cx: 0, cy: -200, r: 6, fill: '#5C5F73' }, clipIn);
  TX(clipIn, 0, -130, 'Requirements', 25, '#2A211B', { a: 'middle', w: 800 });
  E('rect', { x: -96, y: -118, width: 192, height: 3, fill: '#CFC6B2' }, clipIn);
  const REQ = ['Recipe list', 'Search', 'Favourites', 'Photos', 'Shopping list'];
  const rows = REQ.map((r, i) => { const n = N(clipIn, -96, -78 + i * 54);
    E('rect', { x: 0, y: -20, width: 26, height: 26, rx: 6, fill: '#fff', stroke: '#8D8574', 'stroke-width': 2.5 }, n);
    TX(n, 40, 2, r, 22, '#2A211B', { w: 700 }); return n; });
  const sparks = REQ.map(() => sparkle(cam, '#FFE066', 14));

  /* întrebările */
  const qb = G(cam);
  const q1 = G(qb); tf(q1, 60, 148); speechBubble(q1, 450, 100, null);
  TX(q1, 24, 42, '? Where do the recipes come from?', 22, '#2A211B', { w: 800 });
  const a1 = TX(q1, 24, 78, '→ Tudor types them in', 21, '#2E8B57', { w: 800 });
  const q2 = G(qb); tf(q2, 110, 266); speechBubble(q2, 360, 100, 'br');
  TX(q2, 24, 42, '? Which iPhones?', 22, '#2A211B', { w: 800 });
  const a2 = TX(q2, 24, 78, '→ iOS 17 or newer', 21, '#2E8B57', { w: 800 });
  const qm = [0, 1, 2].map(i => TX(cam, 0, 0, '?', 56, '#FFD166', { a: 'middle', w: 800 }));

  /* indicatorul cu două direcții */
  const post = N(cam, 132, 722);
  E('rect', { x: -7, y: -270, width: 14, height: 270, rx: 4, fill: '#7A4B2A' }, post);
  const arL = G(post); E('path', { d: 'M-96,-250 L50,-250 L50,-196 L-96,-196 L-120,-223 Z', fill: '#B9814A' }, arL);
  TX(arL, -26, -214, 'Ask', 24, '#FFF6E5', { a: 'middle', w: 800 });
  const arR = G(post); E('path', { d: 'M-44,-180 L118,-180 L142,-153 L118,-126 L-44,-126 Z', fill: '#B9814A' }, arR);
  TX(arR, 38, -145, 'Pick & say so', 20, '#FFF6E5', { a: 'middle', w: 800 });
  const glowL = E('path', { d: 'M-96,-250 L50,-250 L50,-196 L-96,-196 L-120,-223 Z', fill: 'none', stroke: '#FFE066', 'stroke-width': 5 }, arL);
  const glowR = E('path', { d: 'M-44,-180 L118,-180 L142,-153 L118,-126 L-44,-126 Z', fill: 'none', stroke: '#FFE066', 'stroke-width': 5 }, arR);

  /* apelul video cu Tudor */
  const call = G(cam); const callIn = G(call);
  E('rect', { x: -268, y: -152, width: 536, height: 304, rx: 22, fill: '#000', 'fill-opacity': .3, transform: 'translate(6,10)' }, callIn);
  E('rect', { x: -268, y: -152, width: 536, height: 304, rx: 22, fill: '#22263A' }, callIn);
  E('rect', { x: -268, y: -152, width: 536, height: 40, rx: 22, fill: '#2F3550' }, callIn); E('rect', { x: -268, y: -130, width: 536, height: 18, fill: '#2F3550' }, callIn);
  const live = E('circle', { cx: -240, cy: -132, r: 7, fill: '#3BB273' }, callIn);
  TX(callIn, -224, -125, 'Video call · Tudor', 19, '#E8ECF4', { w: 700 });
  const vw = G(callIn, { 'clip-path': clipRect(-252, -104, 504, 244, 12) });
  E('rect', { x: -252, y: -104, width: 504, height: 244, fill: '#5B4A6E' }, vw);
  const vwin = G(vw); E('rect', { x: 80, y: -84, width: 150, height: 120, rx: 6, fill: '#6E4F3A' }, vwin);
  E('rect', { x: 88, y: -76, width: 134, height: 104, fill: lgrad([[0, '#28306B'], [1, '#F08A6B']]) }, vwin);
  E('circle', { cx: 190, cy: -50, r: 12, fill: '#FFF4D6' }, vwin);
  E('rect', { x: 150, y: -76, width: 6, height: 104, fill: '#6E4F3A' }, vwin);
  const vsh = G(vw); E('rect', { x: -240, y: -90, width: 110, height: 240, fill: '#6E4F3A' }, vsh);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) E('rect', { x: -232 + k * 16, y: -80 + r * 70 + (hash(k + r) * 18), width: 13, height: 52 - hash(k + r) * 18, fill: ['#B5532F', '#2F6F64', '#C9A227', '#4D5FA8'][(k + r) % 4] }, vsh);
  const tud = Human(vw, { seed: 4 });
  const thumb = E('rect', { x: -6, y: -30, width: 12, height: 22, rx: 6, fill: '#F1C27D' }, tud.propR);

  return (lt, at) => {
    bg.anim(at);
    camera(cam, lt, [[0, 800, 450, 1], [L(1), 800, 450, 1], [L(1) + 1.8, 860, 500, 1.08], [L(4) - .5, 880, 505, 1.1], [Le(4) + .4, 880, 505, 1.1], [L(5) + 1, 980, 430, 1], [Le(5), 980, 430, 1],
      [L(6) + 1.2, 800, 440, 1], [L(8) - .6, 800, 440, 1], [L(8) + 1, 790, 420, 1.03], [cue.d, 790, 420, 1.05]]);

    /* întuneric: apare la linia 1, dispare la cerințe */
    const dk = prog(lt, L(1) + .3, 1.2) * (1 - prog(lt, L(5) - .2, 1.2));
    op(dark, dk * lerp(.72, .55, prog(lt, L(2), 2)));
    op(ghosts, 1 - prog(lt, L(5), 1.2));
    qs.forEach((q, i) => { op(q, win(lt, L(1) + 3.5 + i * .4, L(2), .4, .5)); tf(q, 0, Math.sin(at * 2 + i) * 8); });
    op(sign, 1); show(sign, lt, L(1) + .6, L(5) - .5, { dy: -60, d: .7 });
    if (lt > L(1) + .6 && lt < L(5)) tf(sign, 892, 300, swing(lt, L(1) + .9, 5, 4, 1.4));

    /* robotul */
    const st = { x: 390, y: 722, at, face: 'happy', look: [0, 0] };
    const wx = keyed(lt, [[0, -170], [.3, -170], [6, 390]], t => t);
    if (lt < 6) { const w = walkCycle(wx / 22); Object.assign(st, { x: wx, fL: w.fL, fR: w.fR, bob: w.bob, hL: [-64 + w.swing * 16, -96], hR: [64 - w.swing * 16, -96], look: [1, 0] }); }
    else if (lt < L(1)) { const g = prog(lt, 6.2, .6); Object.assign(st, { hR: [lerp(66, 140, g), lerp(-92, -170, g)], rotR: -30 * g, look: [1, .3], headTilt: Math.sin(at * 2) * 3 }); }
    else if (lt < L(2)) { const away = lt > L(1) + 3.6 && lt < L(1) + 6.5; Object.assign(st, { hL: [-44, -96], bendL: 30, hR: [130, -150 + Math.sin(at * 3) * 4], look: away ? [-1, .2] : [1, .3], face: away ? 'think' : 'happy', headTilt: away ? -6 : 0 }); }
    else if (lt < L(4)) {
      /* se uită spre obiectul care zboară */
      let tx = 900, ty = 300; const ts = [L(2) + .1, L(2) + 1.6, L(3) + .4, L(3) + 3.0];
      if (lt < ts[1]) { tx = 400; ty = 200; } else if (lt < ts[2]) { tx = 1200; ty = 300; } else if (lt < ts[3]) { tx = 1300; ty = 520; } else { tx = 1100; ty = 200; }
      const lk = [clamp((tx - 390) / 400, -1, 1), clamp((ty - 400) / 300, -1, 1)];
      const reach = .5 + .5 * Math.sin(at * 2.4);
      Object.assign(st, { look: lk, hR: [110 + reach * 30, -160 - reach * 20], hL: [-70, -110], face: 'happy', bob: Math.sin(at * 3) * 2 });
    }
    else if (lt < L(5)) { const pan = lt < Le(4) + .2; Object.assign(st, { face: pan ? 'worried' : 'happy', hL: pan ? [-44, -250] : [-66, -92], hR: pan ? [44, -250] : [66, -92], bendL: pan ? 30 : 14, bendR: pan ? -30 : -14, look: [1, .2], tilt: pan ? -3 : 0, bob: pan ? Math.sin(at * 12) * 2 : 0 }); }
    else if (lt < L(6)) { Object.assign(st, { face: 'focus', hR: [150, -250], rotR: -40, hL: [-66, -100], look: [1, -.2], headTilt: Math.sin(at * 3) * 4 }); }
    else if (lt < L(7)) { Object.assign(st, { face: 'think', hR: [66 + Math.sin(at * 14) * 7, -268 + Math.cos(at * 14) * 5], bendR: -40, hL: [-60, -110], look: [-.4, -1], headTilt: -8 }); }
    else if (lt < L(8)) { const sh = Math.sin((lt - L(7)) * 1.6); const idea = lt > L(7) + 2.6;
      Object.assign(st, idea ? { face: 'happy', hR: [70, -300], rotR: -10, hL: [-66, -100], look: [-.4, -.6] } : { face: 'think', hL: [-115, -170 + sh * 6], hR: [115, -170 - sh * 6], look: [-1, -.3], tilt: sh * 3 }); }
    else if (lt < L(9)) { const g = Math.sin(at * 3); Object.assign(st, { face: 'happy', talk: cue.talk(lt, 'A'), hR: [120 + g * 14, -180 + g * 20], hL: [-70, -120 + g * 6], look: [1, -.6], headTilt: g * 3 }); }
    else { const j = Math.abs(Math.sin((lt - L(9)) * 7)) * prog(lt, L(9) + .6, .3); Object.assign(st, { face: 'joy', y: 722 - j * 22, hL: [-80, -290], hR: [80, -290], bendL: 30, bendR: -30, look: [1, -.6] }); }
    if (st.bob == null) st.bob = Math.sin(at * 2.1) * 2;
    boss.set(st);

    /* obiectele zboară pe masă */
    const fly = (n, t0, d, from, h, rot) => { const p = prog(lt, t0, d, t => t); op(n, p > 0 ? 1 : 0);
      if (p > 0) { const q = easeOut(p); const [x, y] = arcPos(q, from, [n._x, n._y], h); const land = pop(lt, t0 + d - .05, .45); tf(n, x, y, (1 - q) * rot, p < 1 ? 1 : lerp(1.12, 1, land)); } };
    fly(book, L(2) + .1, 1.3, [120, -60], 120, -40);
    fly(fol, L(3) + .4, 1.2, [1700, 480], 160, 30);
    fly(note, L(3) + 3.0, 1.2, [1050, -120], 90, 220);
    /* avionul aterizează și se desface în mesajul lui Tudor */
    const pp = prog(lt, L(2) + 1.6, 1.8, t => t);
    const pk = [[0, [1560, 160]], [.4, [1150, 260]], [.7, [930, 340]], [1, [800, 520]]];
    if (pp > 0 && pp < 1) { const a = keyed(pp, pk, t => t), b = keyed(Math.min(1, pp + .02), pk, t => t);
      op(plane, 1); tf(plane, a[0], a[1] + Math.sin(pp * 14) * 6 * (1 - pp), Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + 10, lerp(1.2, .8, pp)); }
    else op(plane, 0);
    const un = pop(lt, L(2) + 3.4, .55); op(msg, un > 0 ? 1 : 0); tf(msg, 800, 540, (1 - un) * 25, un);

    /* teancul care umple masa */
    pileP.forEach((p, i) => { const t0 = L(4) + .2 + i * .2; const v = prog(lt, t0, .25) * (1 - prog(lt, Le(4) + .1 + hash(i) * .5, .5));
      op(p.n, v); tf(p.n, p.x, p.y - (1 - prog(lt, t0, .3)) * 80 - prog(lt, Le(4) + .1 + hash(i) * .5, .5) * 120, p.r, 1); });
    const nPile = pileP.filter((p, i) => lt > L(4) + .2 + i * .2).length;
    const base = [L(2) + 1.4, L(2) + 3.6, L(3) + 1.6, L(3) + 4.2].filter(t => lt > t).length * .075;
    const pileF = nPile * .035 * (1 - prog(lt, Le(4) + .3, .9));
    setGauge(base + pileF);
    const rg = prog(lt, L(4) - .1, .6) * (1 - prog(lt, Le(4) + .6, .6));
    rimGlow.setAttribute('opacity', f2(rg * (.55 + .45 * Math.sin(at * 6))));
    rimGlow.setAttribute('stroke', pileF > .35 ? '#FF6B6B' : '#FFB347');
    show(edgeLbl, lt, L(4) + .3, L(5), { dx: 30, dy: 0 });

    /* cerințele */
    const cp = pop(lt, L(5) + .1, .6), out = prog(lt, cue.d + 5, 1);
    op(clip, cp > 0 ? 1 : 0); tf(clip, 1440, 180, swing(lt, L(5) + .4, 7, 4.2, 1.3), cp);
    rows.forEach((r, i) => show(r, lt, L(5) + 1.0 + i * .9, 1e9, { dx: -16, dy: 0 }));
    sparks.forEach((s, i) => { const t0 = L(5) + .4 + i * .9, p = prog(lt, t0, .65, t => t);
      if (p > 0 && p < 1) { const [x, y] = arcPos(easeOut(p), [800, 520], [1344 + 0, 180 + 200 - 78 + i * 54 - 6], 120); op(s, 1); tf(s, x, y, at * 200, .8 + .4 * Math.sin(at * 9)); } else op(s, 0); });

    /* întrebările */
    const qv = prog(lt, L(6) + .2, .5);
    op(qb, qv); tf(q1, 60, 148 + (1 - pop(lt, L(6) + .3, .5)) * 30); tf(q2, 110, 266 + (1 - pop(lt, L(6) + 2.6, .5)) * 30);
    op(q1, prog(lt, L(6) + .3, .3)); op(q2, prog(lt, L(6) + 2.6, .3));
    op(a1, prog(lt, L(8) + 2.6, .5)); op(a2, prog(lt, L(8) + 5.2, .5));
    qm.forEach((q, i) => { const v = win(lt, L(6) + .4 + i * .5, L(7) + 2.6, .4, .4); op(q, v);
      tf(q, 390 + [92, 130, 100][i], 420 + [0, 46, 92][i] + Math.sin(at * 3 + i * 2) * 8, Math.sin(at * 2 + i) * 14, .6 + .4 * pop(lt, L(6) + .4 + i * .5, .5)); });
    /* indicatorul */
    show(post, lt, L(7) + .2, 1e9, { dy: 40 });
    op(arL, prog(lt, L(7) + .4, .4)); tf(arL, 0, 0, swing(lt, L(7) + .4, 4, 5, 1.5));
    op(arR, prog(lt, L(7) + 1.4, .4)); tf(arR, 0, 0, swing(lt, L(7) + 1.4, 4, 5, 1.5));
    op(glowL, win(lt, L(7) + .4, L(7) + 2.4, .3, .3) * (.6 + .4 * Math.sin(at * 8)));
    op(glowR, prog(lt, L(7) + 2.6, .3) * (.6 + .4 * Math.sin(at * 8)));

    /* apelul video */
    const cv = pop(lt, L(8) - .4, .6);
    op(call, cv > 0 ? 1 : 0); tf(call, 820, 262, 0, cv);
    op(live, .5 + .5 * Math.sin(at * 5));
    const ok = lt > L(9) - .1;
    const tst = { x: 0, y: 190, s: .62, at, face: ok ? 'joy' : 'happy', look: [-.6, 0], turn: -.3, talk: cue.talk(lt, 'T'), noLegs: true };
    if (ok) Object.assign(tst, { hR: [70, -300], hL: [-58, -128], rotR: 0 });
    else Object.assign(tst, { hR: [20, -268], hL: [-58, -128], bendR: -30, headTilt: Math.sin(at * 2.4) * 4 + (cue.talk(lt, 'A') ? Math.sin(at * 5) * 2 : 0) });
    tst.bob = Math.sin(at * 2) * 1.5;
    tud.set(tst); op(thumb, ok ? 1 : 0);
  };
} });
