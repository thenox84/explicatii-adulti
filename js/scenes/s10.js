"use strict";
/* SCENA 10 — Produsul finit: bucătăria familiei, aplicația în acțiune, rezumatul agentului */
SCENE(10, { build(world, cue) {
  const L = cue, Le = cue.e;
  const cam = G(world);
  const ambient = [];
  /* ---------- bucătăria ---------- */
  E('rect', { x: -300, y: -300, width: 2200, height: 1100, fill: '#F3DDBD' }, cam);
  const wp = G(cam, { opacity: .25 }); for (let r = 0; r < 9; r++) for (let c = 0; c < 26; c++) E('circle', { cx: -260 + c * 80 + (r % 2) * 40, cy: -240 + r * 70, r: 6, fill: '#E2B98A' }, wp);
  /* faianță */
  E('rect', { x: -300, y: 400, width: 2200, height: 300, fill: '#FDF6EC' }, cam);
  const tiles = G(cam); for (let i = 0; i < 70; i++) E('path', { d: `M${-300 + i * 34},400 V700`, stroke: '#E6D3B8', 'stroke-width': 2 }, tiles);
  for (let r = 1; r < 9; r++) E('path', { d: `M-300,${400 + r * 34} H1900`, stroke: '#E6D3B8', 'stroke-width': 2 }, tiles);
  for (let i = 0; i < 30; i++) { const x = -260 + (i * 7 % 30) * 68, y = 417 + (i * 3 % 8) * 34; E('rect', { x: x - 13, y: y - 13, width: 26, height: 26, fill: '#7FB3D5', 'fill-opacity': .35, transform: `rotate(45 ${x} ${y})` }, tiles); }
  /* fereastra cu zi senină */
  const wx = 520, wy = 100, ww = 380, wh = 290;
  E('rect', { x: wx - 18, y: wy - 18, width: ww + 36, height: wh + 36, rx: 12, fill: '#FFFFFF' }, cam);
  const win = G(cam, { 'clip-path': clipRect(wx, wy, ww, wh, 6) });
  E('rect', { x: wx, y: wy, width: ww, height: wh, fill: lgrad([[0, '#7EC8F2'], [1, '#CDEBFA']]) }, win);
  E('circle', { cx: wx + 300, cy: wy + 70, r: 40, fill: '#FFE58A' }, win); E('circle', { cx: wx + 300, cy: wy + 70, r: 60, fill: '#FFE58A', 'fill-opacity': .3 }, win);
  const wclouds = [0, 1, 2].map(i => { const c = G(win); [[0, 0, 40], [34, -12, 30], [64, 2, 26]].forEach(([x, y, r]) => E('ellipse', { cx: x, cy: y, rx: r, ry: r * .6, fill: '#fff' }, c)); return c; });
  E('path', { d: `M${wx},${wy + wh} Q${wx + 120},${wy + 200} ${wx + 260},${wy + 240} T${wx + ww},${wy + 220} V${wy + wh} Z`, fill: '#8CCB6E' }, win);
  E('path', { d: `M${wx},${wy + wh} Q${wx + 200},${wy + 240} ${wx + ww},${wy + 262} V${wy + wh} Z`, fill: '#6DB25A' }, win);
  const branch = G(win); tf(branch, wx, wy + 30);
  E('path', { d: 'M-20,0 Q80,10 170,40', stroke: '#6B4A2B', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, branch);
  [[40, 6], [80, 14], [120, 26], [160, 40], [100, -4], [60, 20]].forEach(([x, y], i) => E('ellipse', { cx: x, cy: y + (i % 2 ? 12 : -10), rx: 16, ry: 9, fill: i % 2 ? '#5FA84F' : '#4C9A42', transform: `rotate(${i * 25} ${x} ${y})` }, branch));
  const bird = G(win); E('ellipse', { rx: 13, ry: 10, fill: '#E84855' }, bird); E('circle', { cx: 10, cy: -6, r: 7, fill: '#E84855' }, bird); E('path', { d: 'M16,-6 l8,2 l-8,3 z', fill: '#F7C948' }, bird); E('circle', { cx: 12, cy: -8, r: 1.6, fill: '#000' }, bird);
  const wing = E('path', { d: 'M-4,-2 Q-14,-16 -2,-14 Z', fill: '#B83240' }, bird);
  const fr = G(cam); E('rect', { x: wx + ww / 2 - 5, y: wy, width: 10, height: wh, fill: '#fff' }, fr); E('rect', { x: wx, y: wy + wh / 2 - 5, width: ww, height: 10, fill: '#fff' }, fr);
  E('rect', { x: wx - 34, y: wy + wh + 16, width: ww + 68, height: 18, rx: 6, fill: '#E9D4B4' }, cam);
  /* perdele în carouri */
  [[wx - 60, 1], [wx + ww + 60, -1]].forEach(([cx, s]) => { const c = G(cam); E('path', { d: `M${cx - 50},${wy - 40} H${cx + 50} Q${cx + 30 * s},${wy + 160} ${cx + 44},${wy + wh + 30} H${cx - 44} Q${cx - 20 * s},${wy + 160} ${cx - 50},${wy - 40} Z`, fill: '#E84855' }, c);
    for (let k = 0; k < 6; k++) E('rect', { x: cx - 50 + k * 18, y: wy - 40, width: 8, height: wh + 70, fill: '#fff', 'fill-opacity': .35 }, c); });
  E('rect', { x: wx - 120, y: wy - 52, width: ww + 240, height: 14, rx: 7, fill: '#9A6B45' }, cam);
  /* plante pe pervaz */
  const pl1 = plant(cam, .6); tf(pl1, wx + 50, wy + wh + 14); ambient.push(pl1.anim);
  const pl2 = plant(cam, .5); tf(pl2, wx + ww - 50, wy + wh + 14); ambient.push(pl2.anim);
  /* frigiderul cu rețeta bunicii */
  const fridge = G(cam); tf(fridge, 150, 0);
  E('rect', { x: -110, y: 170, width: 220, height: 540, rx: 26, fill: '#EAF2F6' }, fridge);
  E('rect', { x: 60, y: 170, width: 50, height: 540, rx: 20, fill: '#D3E1EA' }, fridge);
  E('rect', { x: -110, y: 360, width: 220, height: 8, fill: '#C9D8E2' }, fridge);
  E('rect', { x: 80, y: 220, width: 12, height: 100, rx: 6, fill: '#9AAFC0' }, fridge); E('rect', { x: 80, y: 400, width: 12, height: 120, rx: 6, fill: '#9AAFC0' }, fridge);
  const card = G(fridge); tf(card, -18, 470, -5);
  E('rect', { x: -80, y: -84, width: 160, height: 178, fill: '#FFF8E6' }, card);
  for (let k = 0; k < 7; k++) E('path', { d: `M-70,${-40 + k * 20} H70`, stroke: '#BFD7EA', 'stroke-width': 1.5 }, card);
  TX(card, 0, -52, 'Sarmale', 24, '#B5532F', { a: 'middle', w: 800, hand: true });
  TX(card, -66, -18, 'cabbage leaves', 15, '#5A4A3A', { hand: true }); TX(card, -66, 2, 'rice, onion, meat', 15, '#5A4A3A', { hand: true }); TX(card, -66, 22, 'cook slowly…', 15, '#5A4A3A', { hand: true });
  TX(card, 60, 76, '— Grandma ♥', 15, '#B5532F', { a: 'end', hand: true });
  E('circle', { cx: 0, cy: -84, r: 9, fill: '#E84855' }, card);
  [[-60, 230, '#F7C948'], [-10, 260, '#4D96FF'], [30, 215, '#3BB273']].forEach(([x, y, c]) => E('circle', { cx: x, cy: y, r: 11, fill: c }, fridge));
  const draw = G(fridge); tf(draw, -40, 300); E('rect', { x: -30, y: -40, width: 60, height: 50, rx: 4, fill: '#fff', transform: 'rotate(4)' }, draw);
  E('circle', { cx: -6, cy: -20, r: 9, fill: '#F7C948' }, draw); E('path', { d: 'M-18,0 L-6,-10 L6,0 M8,-4 h10', stroke: '#3BB273', 'stroke-width': 3, fill: 'none' }, draw);
  /* raft cu borcane */
  const jars = G(cam); tf(jars, 380, 300);
  E('rect', { x: -100, y: 0, width: 200, height: 12, rx: 4, fill: '#9A6B45' }, jars);
  [['#E84855', -70], ['#F7C948', -24], ['#3BB273', 22], ['#9B5DE5', 66]].forEach(([c, x], i) => { E('rect', { x: x - 18, y: -50 + (i % 2) * 8, width: 36, height: 50 - (i % 2) * 8, rx: 8, fill: '#E9F4F7', 'fill-opacity': .9 }, jars);
    E('rect', { x: x - 15, y: -30 + (i % 2) * 8, width: 30, height: 28 - (i % 2) * 8, rx: 6, fill: c, 'fill-opacity': .85 }, jars); E('rect', { x: x - 19, y: -58 + (i % 2) * 8, width: 38, height: 10, rx: 4, fill: '#C8954F' }, jars); });
  /* aragaz + oala cu sarmale */
  const stove = G(cam); tf(stove, 1470, 0);
  E('rect', { x: -130, y: 520, width: 260, height: 190, rx: 10, fill: '#E5E9F0' }, stove);
  E('rect', { x: -130, y: 506, width: 260, height: 20, rx: 6, fill: '#2B2F45' }, stove);
  E('rect', { x: -100, y: 560, width: 200, height: 120, rx: 10, fill: '#2B2F45' }, stove); E('rect', { x: -86, y: 574, width: 172, height: 70, rx: 6, fill: '#3E4560' }, stove);
  const flame = G(stove); for (let k = 0; k < 5; k++) E('path', { d: `M${-40 + k * 20},508 q6,-14 0,-22 q-6,8 0,22 z`, fill: '#4D96FF' }, flame);
  [-80, -40, 40, 80].forEach(x => E('circle', { cx: x, cy: 542, r: 8, fill: '#9AA6BD' }, stove));
  const pot = G(stove); tf(pot, 0, 506);
  E('path', { d: 'M-80,-90 H80 V-14 Q80,0 64,0 H-64 Q-80,0 -80,-14 Z', fill: '#C0392B' }, pot);
  E('path', { d: 'M40,-90 H80 V-14 Q80,0 64,0 H40 Z', fill: '#000', 'fill-opacity': .15 }, pot);
  E('rect', { x: -100, y: -74, width: 24, height: 12, rx: 6, fill: '#7A241B' }, pot); E('rect', { x: 76, y: -74, width: 24, height: 12, rx: 6, fill: '#7A241B' }, pot);
  const lid = G(pot); E('ellipse', { cx: 0, cy: -92, rx: 86, ry: 14, fill: '#A93226' }, lid); E('rect', { x: -14, y: -112, width: 28, height: 14, rx: 6, fill: '#2B2F45' }, lid);
  const potSteam = steam(pot, 4, 110, '#FFFFFF'); tf(potSteam, 0, -110); ambient.push(potSteam.anim);
  /* tigăi agățate */
  const pans = G(cam); E('rect', { x: 1300, y: 160, width: 300, height: 8, rx: 4, fill: '#6B4A2B' }, pans);
  const panG = [1340, 1430, 1530].map((x, i) => { const p = G(pans); tf(p, x, 168); E('path', { d: 'M0,0 V40', stroke: '#2B2F45', 'stroke-width': 3 }, p); E('circle', { cx: 0, cy: 40 + 34 + i * 6, r: 34 + i * 6, fill: '#3A3F55' }, p); E('circle', { cx: 0, cy: 40 + 34 + i * 6, r: 26 + i * 6, fill: '#4B5170' }, p); E('rect', { x: -4, y: 0, width: 8, height: 40, fill: '#2B2F45' }, p); return p; });
  /* podea */
  E('rect', { x: -300, y: 700, width: 2200, height: 400, fill: '#C46B45' }, cam);
  for (let r = 0; r < 6; r++) for (let c = 0; c < 30; c++) if ((r + c) % 2) E('rect', { x: -300 + c * 80, y: 700 + r * 60, width: 80, height: 60, fill: '#B05C39' }, cam);
  /* ---------- familia ---------- */
  const partner = Human(cam, { hairStyle: 'bun', glasses: false, tie: false, jacket: '#3BB273', shirt: '#FFF4E0', hair: '#7A4A2A', apron: '#F2C4CE', skin: '#E8B98F', seed: 7 });
  const kid = Human(cam, { hairStyle: 'kid', glasses: false, tie: false, jacket: '#F2994A', shirt: '#FFFFFF', hair: '#3A2A20', scale: .66, seed: 9 });
  const tudor = Human(cam, { seed: 4 });
  const handPh = G(tudor.propR); tf(handPh, -18, -66); const hp = phone(handPh, .12);
  E('rect', { width: 300, height: 620, fill: '#FBF7F2' }, hp.screen); for (let k = 0; k < 4; k++) E('rect', { x: 20, y: 150 + k * 80, width: 260, height: 64, rx: 12, fill: ['#B8573A', '#D9A657', '#E3B24F', '#E6CFA8'][k] }, hp.screen);
  const spoon = G(tudor.propL); E('rect', { x: -3, y: -10, width: 6, height: 54, rx: 3, fill: '#C9CFDE' }, spoon); E('ellipse', { cx: 0, cy: -16, rx: 11, ry: 15, fill: '#C9CFDE' }, spoon); E('ellipse', { cx: 0, cy: -16, rx: 7, ry: 9, fill: '#7FA35A' }, spoon);
  /* masa cu fața de masă */
  const table = G(cam); tf(table, 600, 610);
  E('rect', { x: -380, y: 0, width: 760, height: 120, fill: '#8A5A3B' }, table);
  E('path', { d: 'M-400,-6 H400 V70 Q370,84 340,70 Q310,84 280,70 Q250,84 220,70 Q190,84 160,70 Q130,84 100,70 Q70,84 40,70 Q10,84 -20,70 Q-50,84 -80,70 Q-110,84 -140,70 Q-170,84 -200,70 Q-230,84 -260,70 Q-290,84 -320,70 Q-350,84 -400,70 Z', fill: '#E84855' }, table);
  const chk = G(table, { opacity: .45 }); for (let k = 0; k < 20; k++) E('rect', { x: -400 + k * 40, y: -6, width: 20, height: 80, fill: '#fff' }, chk); for (let k = 0; k < 3; k++) E('rect', { x: -400, y: 6 + k * 24, width: 800, height: 10, fill: '#fff' }, chk);
  const plate = G(table); tf(plate, 0, -8);
  E('ellipse', { cx: 0, cy: 0, rx: 110, ry: 24, fill: '#fff' }, plate); E('ellipse', { cx: 0, cy: -2, rx: 86, ry: 16, fill: '#EDE7DD' }, plate);
  for (let k = 0; k < 6; k++) E('ellipse', { cx: -54 + k * 22, cy: -10 - (k % 2) * 6, rx: 16, ry: 10, fill: k % 2 ? '#7FA35A' : '#6A8F48' }, plate);
  const bowl = G(table); tf(bowl, -240, -8); E('path', { d: 'M-44,-20 H44 Q40,14 0,16 Q-40,14 -44,-20 Z', fill: '#4D96FF' }, bowl); E('ellipse', { cx: 0, cy: -20, rx: 44, ry: 9, fill: '#FFFDF5' }, bowl);
  const bread = G(table); tf(bread, 250, -16); E('ellipse', { rx: 54, ry: 22, fill: '#D9A657' }, bread); [-24, 0, 24].forEach(x => E('path', { d: `M${x - 8},-12 l14,10`, stroke: '#A8742E', 'stroke-width': 4 }, bread));
  /* inimioare/confetti la final */
  const conf = []; for (let i = 0; i < 26; i++) { const c = G(world); if (i % 3 === 0) E('path', { d: HEART, fill: '#FF6B8A', transform: 'scale(1.6)' }, c); else E('rect', { x: -6, y: -3, width: 12, height: 6, rx: 2, fill: ['#F7C948', '#4D96FF', '#3BB273', '#E84855', '#9B5DE5'][i % 5] }, c); conf.push(c); }
  /* ---------- telefonul mărit ---------- */
  const zoom = G(world);
  const beam = E('path', { fill: '#FFFFFF', 'fill-opacity': .18 }, zoom);
  const big = G(zoom); const bp = phone(big, .95); const app = appUI(bp.screen);
  const hl = E('rect', { x: 14, y: 154, width: 272, height: 74, rx: 15, fill: 'none', stroke: '#F2994A', 'stroke-width': 4 }, bp.screen);
  const PX = 1050, PY = 112, PS = .95;
  /* ---------- scrisoarea agentului ---------- */
  const plane = G(world); paperPlane(plane, 1.3, '#FFFFFF');
  const env = G(world);
  E('rect', { x: -90, y: -56, width: 180, height: 112, rx: 8, fill: '#F7E6C4' }, env);
  E('path', { d: 'M-90,56 L0,0 L90,56 Z', fill: '#EFD8AE' }, env);
  const flap = E('path', { d: 'M-90,-56 L0,10 L90,-56 Z', fill: '#E9CD98' }, env);
  E('circle', { cx: 0, cy: 4, r: 12, fill: '#E84855' }, env);
  const letter = G(world);
  const LW = 640, LH = 580;
  E('rect', { x: 8, y: 12, width: LW, height: LH, rx: 24, fill: '#000', 'fill-opacity': .25 }, letter);
  E('rect', { x: 0, y: 0, width: LW, height: LH, rx: 24, fill: '#FFFDF6' }, letter);
  E('rect', { x: 0, y: 0, width: LW, height: 86, rx: 24, fill: '#FFE7A8' }, letter); E('rect', { x: 0, y: 60, width: LW, height: 26, fill: '#FFE7A8' }, letter);
  const face = G(letter); tf(face, 48, 44); E('rect', { x: -28, y: -24, width: 56, height: 48, rx: 14, fill: '#F2994A' }, face); E('rect', { x: -20, y: -16, width: 40, height: 30, rx: 9, fill: '#141A2C' }, face);
  E('path', { d: 'M-12,-2 q4,-6 8,0 M4,-2 q4,-6 8,0', stroke: '#A8F4FF', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, face); E('path', { d: 'M-30,-18 Q-30,-44 0,-44 Q30,-44 30,-18 Z', fill: '#F7C948' }, face);
  TX(letter, 92, 40, 'Summary from your AI agent', 26, '#5A3B10', { w: 800 });
  TX(letter, 92, 70, 'To: Tudor', 18, '#8A6A3A', { w: 700 });
  const SEC = [
    ['check', '#2F9E5B', 'Done', ['Recipe list, search, favourites,', 'photos and the shopping list.']],
    ['check', '#2F9E5B', 'Checked', ['It builds, the automatic tests pass,', 'and the screenshots look right.']],
    ['warn', '#D9822B', "Couldn't check", ['On a real iPhone, with your own photos.']],
    ['arrow', '#2F6FDB', 'Your steps', []]];
  let yy = 124;
  const secs = SEC.map(([ic, col, title, lines], i) => { const n = G(letter); tf(n, 0, yy);
    const b = G(n); tf(b, 46, 0); E('circle', { r: 19, fill: col }, b);
    if (ic === 'check') icon(b, 'check', 20, '#fff', 5); else if (ic === 'warn') TX(b, 0, 9, '!', 26, '#fff', { a: 'middle', w: 900 }); else E('path', { d: 'M-8,0 H8 M2,-7 L9,0 L2,7', stroke: '#fff', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, b);
    TX(n, 80, 9, title, 25, col, { w: 800 });
    lines.forEach((l, j) => TX(n, 80, 40 + j * 28, l, 22, '#2A2A35', { w: 500 }));
    yy += 36 + lines.length * 28 + 16; return n; });
  const STEPS = ['1. Sign in with your Apple account', '2. Connect your iPhone with a cable', '3. Press Run'];
  const steps = STEPS.map((s, i) => { const n = G(letter); tf(n, 80, yy - 4 + i * 38); const t = TX(n, 0, 0, s, 22, '#1E2235', { w: 600 }); return n; });
  const runB = G(steps[2]); tf(runB, 160, -8); E('circle', { r: 16, fill: '#2F6FDB' }, runB); E('path', { d: 'M-5,-8 L8,0 L-5,8 Z', fill: '#fff' }, runB);
  const LX = 930, LY = 108;

  return (lt, at) => {
    ambient.forEach(f => f(at));
    /* ambient */
    wclouds.forEach((c, i) => tf(c, wx + ((i * 150 + at * (8 + i * 3)) % (ww + 200)) - 80, wy + 50 + i * 40));
    tf(branch, wx, wy + 30, Math.sin(at * 1.1) * 2.5);
    const hop = Math.abs(Math.sin(at * 3)) * 6; tf(bird, wx + 200 + Math.sin(at * .4) * 30, wy + 66 - hop, 0, Math.cos(at * .4) > 0 ? 1 : -1, 1);
    wing.setAttribute('transform', `rotate(${f2(Math.sin(at * 14) * 20)})`);
    tf(lid, Math.sin(at * 13) * 1.5, -Math.max(0, Math.sin(at * 7)) * 4, Math.sin(at * 9) * 2);
    flame.setAttribute('transform', `scale(1,${f2(.85 + .2 * Math.sin(at * 17))})`); flame.setAttribute('transform-origin', '0 508');
    panG.forEach((p, i) => tf(p, [1340, 1430, 1530][i], 168, Math.sin(at * 1.3 + i) * 3));
    /* camera */
    camera(cam, lt, [[0, 800, 450, 1], [L(0), 760, 440, 1.04], [L(5) - .5, 780, 450, 1.02], [L(8) - 1.2, 780, 450, 1.02], [L(8) + .2, 620, 430, 1.28], [cue.d, 610, 430, 1.32]]);
    /* ---- familia ---- */
    const cheer = prog(lt, L(8) + 1.1, .4);
    const tst = { x: 600, y: 700, at, face: 'happy', look: [1, 0], turn: .3, bob: Math.sin(at * 2.2) * 1.5 };
    const showPh = lt < L(5) - .3;
    if (lt < L(1)) Object.assign(tst, { hR: [70, lerp(-200, -310, pop(lt, L(0), .6)) + Math.sin(at * 3) * 6], hL: [-58, -128], face: 'joy', look: [0, -1] });
    else if (showPh) Object.assign(tst, { hR: [70, -220 + Math.sin(at * 2) * 3], hL: [-58, -128], face: 'happy', look: [1, -.4], turn: .4 });
    else if (lt < L(8) - .8) Object.assign(tst, { hL: [-50, -170], hR: [30, -250], bendR: 30, face: lt > L(6) && lt < L(7) ? 'think' : 'happy', look: [1, -.3], turn: .5, headTilt: Math.sin(at * 1.4) * 3 });
    else { const eat = prog(lt, L(8) - .7, .6); Object.assign(tst, { hL: [lerp(-60, -16, eat), lerp(-90, -282, eat)], bendL: 30, hR: [58, -128], face: cheer > 0 ? 'joy' : 'happy', talk: cue.talk(lt, 'T'), look: [0, 0], turn: 0 });
      if (cheer > 0) Object.assign(tst, { hR: [80, -330 + Math.sin(at * 9) * 12], hL: [-80, -330 + Math.sin(at * 9 + 1) * 12], bob: -Math.abs(Math.sin(at * 7)) * 8 }); }
    op(handPh, showPh ? 1 : 0); op(spoon, lt >= L(8) - .8 && cheer < .5 ? 1 : 0);
    tudor.set(tst);
    const pst = { x: 390, y: 700, at, face: 'happy', look: [1, 0], turn: .5, bob: Math.sin(at * 2 + 1) * 1.5, hL: [-58, -128], hR: [58, -128] };
    if (lt > L(3) && lt < Le(3) + .4) Object.assign(pst, { hL: [-20, -230], hR: [20, -230], face: 'joy', bendL: -10, bendR: 10 });
    if (lt > L(5) && lt < L(8)) Object.assign(pst, { look: [1, -.3], turn: .6, face: lt > L(6) && lt < L(7) ? 'surprise' : 'happy', hR: [40, -250], bendR: 30 });
    if (cheer > 0) Object.assign(pst, { face: 'joy', hL: [-80, -330 + Math.sin(at * 8) * 14], hR: [80, -330 + Math.sin(at * 8 + 2) * 14], bob: -Math.abs(Math.sin(at * 6)) * 8 });
    partner.set(pst);
    const kst = { x: 820, y: 700, at, face: 'happy', look: [-1, 0], turn: -.4, bob: Math.sin(at * 3) * 2, hL: [-58, -128], hR: [58, -128] };
    if (lt > L(2) && lt < Le(2) + .5) Object.assign(kst, { hR: [150, -330 + Math.sin(at * 6) * 8], face: 'joy', look: [1, -1], turn: .4 });
    if (lt > L(4) && lt < Le(4)) Object.assign(kst, { face: 'surprise', look: [1, -1], turn: .5 });
    if (cheer > 0) Object.assign(kst, { face: 'joy', hL: [-90, -340], hR: [90, -340 + Math.sin(at * 10) * 16], y: 700 - Math.abs(Math.sin(at * 7)) * 34 });
    kid.set(kst);
    /* ---- telefonul mărit ---- */
    const zIn = pop(lt, L(0) + .3, .6), zOut = prog(lt, L(5) - .6, .5);
    const zs = Math.max(.01, zIn) * (1 - zOut * .85);
    op(zoom, zIn > 0 ? 1 - zOut : 0);
    tf(big, PX + 142 * (1 - zs), PY + 294 * (1 - zs), 0, zs);
    /* fascicul de la telefonul din mână la telefonul mare */
    const hx = 600 + 70 - 18 + 18, hy = 700 - 220 - 30;
    beam.setAttribute('d', `M${hx},${hy} L${PX + 8},${PY + 60} L${PX + 8},${PY + 540} Z`); op(beam, (zIn > 0 ? 1 - zOut : 0) * (lt > L(1) ? 1 : prog(lt, L(0) + .6, .4)));
    const row = Math.floor(Math.max(0, lt - L(1) - .2) / .55) % 4;
    hl.setAttribute('y', 154 + row * 80); op(hl, lt > L(1) && lt < Le(1) + .2 ? 1 : 0);
    const n = Math.floor(clamp((lt - L(2) - .9) / 1.1) * 3);
    const qOn = lt > L(2) + .8 && lt < Le(3) + .2;
    const fp = prog(lt, L(2) + 2.5, .7) * (1 - prog(lt, Le(3) + .1, .5));
    const tapO = clamp(1 - Math.abs(lt - (L(3) + 1.1)) / .35);
    const fav = lt < L(3) + 1.15 ? 0 : prog(lt, L(3) + 1.15, .6);
    const shop = prog(lt, L(4) + .2, .7);
    const checked = Math.floor(clamp((lt - L(4) - 1.2) / 3.6, 0, 1) * 5 + .001);
    app.set({ q: qOn ? 'sar'.slice(0, n) : '', qc: qOn && lt < L(2) + 2.6, fp, fav, shop, checked, tab: 0, tap: tapO > 0 ? { x: 258, y: 191, o: tapO } : null });
    /* ---- avionul, plicul, scrisoarea ---- */
    const fl = prog(lt, L(5) - .5, 1.1, t => t);
    const pa = arcPos(fl, [wx + 120, wy + 120], [1240, 420], 120);
    op(plane, fl > 0 && fl < 1 ? 1 : 0); tf(plane, pa[0], pa[1], 20 + Math.sin(fl * 9) * 12, 1);
    const ev = pop(lt, L(5) + .6, .45) * (1 - prog(lt, L(5) + 1.6, .3));
    op(env, ev > 0 ? 1 : 0); tf(env, 1240, 420, 0, Math.max(.01, ev));
    flap.setAttribute('transform', `scale(1,${f2(1 - 2 * prog(lt, L(5) + 1.0, .4))})`);
    const lv = pop(lt, L(5) + 1.5, .6) * (1 - prog(lt, L(8) - 1.1, .5));
    op(letter, lv > 0 ? 1 : 0);
    tf(letter, LX + (LW / 2) * (1 - lv) + (1240 - LX - LW / 2) * (1 - lv), LY + (LH / 2) * (1 - lv) + (420 - LY - LH / 2) * (1 - lv), 0, Math.max(.01, lv));
    const st = [L(5) + 2.0, L(5) + 3.2, L(6) + .3, L(7) + .2];
    secs.forEach((s, i) => { const v = prog(lt, st[i], .45); op(s, v); });
    const sv = [L(7) + 1.4, L(7) + 3.6, L(7) + 5.6];
    steps.forEach((s, i) => op(s, prog(lt, sv[i], .4)));
    tf(runB, 160, -8, 0, 1 + .15 * Math.sin(at * 6) * (lt > sv[2] ? 1 : 0));
    /* confetti */
    conf.forEach((c, i) => { const t0 = L(8) + 1.0 + (i % 6) * .08; const p = lt - t0; if (p < 0) { op(c, 0); return; }
      const x0 = 300 + hash(i) * 700, vy = -260 - hash(i + 5) * 200; const tt = p + (lt >= cue.d ? 0 : 0);
      const y = 520 + vy * Math.min(tt, 1.2) + 260 * Math.pow(Math.min(tt, 1.2), 2) + Math.max(0, tt - 1.2) * 20;
      const yw = ((y - 60) % 700) + 60;
      op(c, .95); tf(c, x0 + Math.sin(at * 2 + i) * 30, Math.min(yw, 700), at * 120 + i * 30, 1); });
  };
} });
