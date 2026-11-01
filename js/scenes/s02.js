"use strict";
/* SCENA 2 — De la chatbot la agent: chatbotul care doar vorbește, ecuația
   agentului, bucla GÂNDEȘTE → ACȚIONEAZĂ → PRIVEȘTE, meșterul, trusa de scule. */
SCENE(2, { build(world, cue) {
  const L = i => cue(i), Le = i => cue.e(i);
  const TXT = (window.SCRIPT.scenes[2] || { lines: [] }).lines.map(l => l.text);
  const wordT = (i, w) => { const s = TXT[i] || '', k = s.indexOf(w); return L(i) + (Le(i) - L(i)) * (k < 0 ? .5 : k / s.length); };
  const cam = G(world);
  const bg = bgWorkshop(cam);
  const label = (p, x, y, text, size = 24, col = '#FFF6E5') => { const g = G(p); const w = text.length * size * .56 + 30;
    E('rect', { x: x - w / 2, y: y - size * .95, width: w, height: size * 1.55, rx: size * .77, fill: '#14121F', 'fill-opacity': .78 }, g);
    TX(g, x, y + size * .05, text, size, col, { a: 'middle', w: 800 }); return g; };

  /* ================= A: chatbotul ================= */
  const kiosk = G(cam);
  E('ellipse', { cx: 560, cy: 712, rx: 110, ry: 16, fill: '#000', 'fill-opacity': .25 }, kiosk);
  E('rect', { x: 470, y: 690, width: 180, height: 22, rx: 10, fill: '#3A3F55' }, kiosk);
  E('rect', { x: 528, y: 520, width: 64, height: 175, rx: 12, fill: '#4A5070' }, kiosk);
  E('rect', { x: 502, y: 590, width: 116, height: 36, rx: 8, fill: '#8E9AAF' }, kiosk);
  TX(kiosk, 560, 615, 'CHATBOT', 18, '#1E2235', { a: 'middle', w: 800, ls: 2 });
  E('rect', { x: 386, y: 278, width: 348, height: 256, rx: 34, fill: '#3A3F55' }, kiosk);
  E('rect', { x: 402, y: 294, width: 316, height: 224, rx: 24, fill: lgrad([[0, '#9FE3FF'], [1, '#5FB4E8']]) }, kiosk);
  E('path', { d: 'M420,320 Q440,300 480,300', stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, kiosk);
  for (let k = 0; k < 5; k++) E('rect', { x: 520 + k * 16, y: 538, width: 8, height: 4, rx: 2, fill: '#22263A' }, kiosk);
  const cbFace = G(kiosk);
  const cbEyes = [-1, 1].map(s => { const g = G(cbFace); E('ellipse', { rx: 24, ry: 30, fill: '#fff' }, g); const pu = E('circle', { r: 12, fill: '#1E2235' }, g); E('circle', { cx: 4, cy: -5, r: 4, fill: '#fff' }, g); return { g, pu, s }; });
  const cbMouth = E('path', { fill: '#1E2235' }, cbFace);
  [-1, 1].forEach(s => E('ellipse', { cx: 560 + s * 82, cy: 450, rx: 16, ry: 9, fill: '#FF7AA2', 'fill-opacity': .5 }, cbFace));
  const cbBub = G(cam); const bb = speechBubble(cbBub, 470, 150, 'l'); tf(bb, 0, 0);
  const advice = ['You should create a new project', 'in Xcode, and then write', 'the first screen.'];
  const advT = advice.map((s, i) => TX(cbBub, 28, 46 + i * 38, '', 26, C.ink, { w: 700 }));
  const advAll = advice.join(' ').split(' ');
  /* bancul vechi cu trusa neatinsă + pânză de păianjen */
  const oldBench = G(cam);
  E('rect', { x: 1080, y: 590, width: 320, height: 20, rx: 6, fill: '#8A5A36' }, oldBench);
  [1100, 1370].forEach(x => E('rect', { x, y: 606, width: 16, height: 106, fill: '#6B4329' }, oldBench));
  const spiderT = E('path', { stroke: '#DDE3EE', 'stroke-width': 1.5 }, oldBench);
  const spider = G(oldBench); E('circle', { r: 8, fill: '#1E1A28' }, spider); for (let k = 0; k < 4; k++) [-1, 1].forEach(s => E('path', { d: `M${s * 5},${-3 + k * 2} q${s * 8},-6 ${s * 12},${4 + k}`, stroke: '#1E1A28', 'stroke-width': 2, fill: 'none' }, spider));
  [-1, 1].forEach(s => E('circle', { cx: s * 3, cy: -2, r: 2, fill: '#fff' }, spider));
  /* trusa (aceeași pe toată scena) */
  const tb = G(cam); const tbIn = G(tb);
  E('rect', { x: -95, y: -40, width: 190, height: 80, rx: 10, fill: '#D63A3A' }, tbIn);
  E('rect', { x: -95, y: -40, width: 190, height: 14, fill: '#B52E2E' }, tbIn);
  E('rect', { x: -14, y: -16, width: 28, height: 14, rx: 3, fill: '#C9CFDE' }, tbIn);
  const tbInside = E('rect', { x: -88, y: -40, width: 176, height: 12, rx: 4, fill: '#2B1416' }, tbIn);
  const lid = G(tbIn); E('rect', { x: -98, y: -58, width: 196, height: 22, rx: 8, fill: '#E84855' }, lid); E('path', { d: 'M-30,-58 V-74 H30 V-58', stroke: '#3A3F55', 'stroke-width': 8, fill: 'none' }, lid);
  const web = G(tbIn); E('path', { d: 'M98,-58 L60,-34 M98,-58 L76,-10 M98,-58 L98,-6 M68,-46 Q82,-40 88,-28 M76,-36 Q86,-30 92,-18 M80,-52 Q90,-44 96,-36', stroke: '#E8EEF8', 'stroke-width': 1.6, fill: 'none', opacity: .8 }, web);
  const dust = G(tbIn); for (let k = 0; k < 6; k++) E('circle', { cx: -70 + k * 26, cy: -62, r: 3, fill: '#CFC6B2', opacity: .6 }, dust);
  const puff = G(cam); const puffs = []; for (let k = 0; k < 8; k++) puffs.push(E('circle', { r: 14, fill: '#E8E1D4' }, puff));
  /* Tudor cu lista de făcut */
  const tudor = Human(cam, { seed: 4 });
  const todo = G(tudor.propL); tf(todo, -30, -60, -8);
  E('rect', { x: -60, y: -80, width: 120, height: 170, rx: 6, fill: C.paper }, todo);
  TX(todo, 0, -52, 'To do:', 18, C.ink, { a: 'middle', w: 800 });
  ['New project', 'First screen', 'Search', 'Photos', 'Tests…'].forEach((t, i) => { E('rect', { x: -48, y: -36 + i * 24, width: 12, height: 12, rx: 2, fill: 'none', stroke: '#8D8574', 'stroke-width': 2 }, todo); TX(todo, -30, -26 + i * 24, t, 14, C.ink, { w: 600 }); });
  const sweatT = E('path', { d: 'M0,-12 Q8,0 0,6 Q-8,0 0,-12 Z', fill: '#9EE7FF' }, cam);

  /* ================= B: ecuația ================= */
  const eq = G(cam);
  const eModel = N(eq, 250, 410); E('circle', { r: 80, fill: rgrad([[0, '#2A6F86', .9], [1, '#163844', .9]]), stroke: '#CFF4FB', 'stroke-width': 5 }, eModel);
  const mNodes = []; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, r = 22 + hash(k + 3) * 38; mNodes.push([Math.cos(a) * r, Math.sin(a) * r]); }
  mNodes.forEach((a, i) => mNodes.forEach((b, j) => { if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1]) < 50) E('path', { d: `M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])}`, stroke: '#7CF0FF', 'stroke-width': 2, opacity: .6 }, eModel); }));
  const mDots = mNodes.map(p => E('circle', { cx: f2(p[0]), cy: f2(p[1]), r: 5, fill: '#FFD166' }, eModel));
  E('path', { d: 'M-50,-40 Q-30,-66 6,-70', stroke: '#fff', 'stroke-opacity': .4, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, eModel);
  label(eModel, 0, 130, 'model');
  const ePlus1 = N(eq, 430, 410), ePlus2 = N(eq, 790, 410), eEq = N(eq, 1150, 410);
  [[ePlus1, '+'], [ePlus2, '+'], [eEq, '=']].forEach(([n, s]) => TX(n, 0, 26, s, 84, '#FFF6E5', { a: 'middle', w: 900 }));
  const eToolsL = N(eq, 610, 410); label(eToolsL, 0, 130, 'tools');
  const eLoop = N(eq, 970, 410); const loopIc = G(eLoop);
  [0, 180].forEach(r => { const a = G(loopIc, { transform: `rotate(${r})` }); E('path', { d: 'M-62,-14 A64,64 0 0 1 50,-40', stroke: '#2EC4B6', 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, a); E('path', { d: 'M34,-66 L64,-38 L26,-26 Z', fill: '#2EC4B6' }, a); });
  label(eLoop, 0, 130, 'a loop');
  const eAgentL = N(eq, 1380, 548); label(eAgentL, 0, 40, 'AGENT', 30, '#FFD166');
  const sparks = []; for (let k = 0; k < 8; k++) sparks.push(sparkle(cam, k % 2 ? '#FFE066' : '#FFFFFF', 14));

  /* ================= C: bucla ca un traseu ================= */
  const loopG = G(cam);
  const LC = [800, 590], RX = 470, RY = 118;
  E('ellipse', { cx: LC[0], cy: LC[1] + 8, rx: RX + 34, ry: RY + 26, fill: '#000', 'fill-opacity': .18 }, loopG);
  E('ellipse', { cx: LC[0], cy: LC[1], rx: RX, ry: RY, fill: 'none', stroke: '#9C7A55', 'stroke-width': 42 }, loopG);
  E('ellipse', { cx: LC[0], cy: LC[1], rx: RX, ry: RY, fill: 'none', stroke: '#B8946A', 'stroke-width': 30 }, loopG);
  const flow = E('ellipse', { cx: LC[0], cy: LC[1], rx: RX, ry: RY, fill: 'none', stroke: '#FFF6E5', 'stroke-width': 4, 'stroke-dasharray': '16 22', opacity: .7 }, loopG);
  const chevs = []; for (let k = 0; k < 8; k++) { const c = G(loopG); E('path', { d: 'M-8,-10 L6,0 L-8,10', stroke: '#6B4A2B', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, c); chevs.push(c); }
  const roundTag = G(loopG); E('rect', { x: -90, y: -26, width: 180, height: 50, rx: 25, fill: '#14121F', 'fill-opacity': .75 }, roundTag); const roundT = TX(roundTag, 0, 9, '', 24, '#FFF6E5', { a: 'middle', w: 800 });
  const pos = th => { const a = th * Math.PI / 180; return [LC[0] + RX * Math.cos(a), LC[1] + RY * Math.sin(a)]; };
  /* stații */
  const stSign = (x, y, n, t, col) => { const g = G(loopG); E('rect', { x: x - 6, y: y, width: 12, height: 90, fill: '#6B4329' }, g);
    const w = woodSign(g, 190, 62, '', {}); tf(w, x, y - 50); TX(g, x, y - 8, n + '  ' + t, 28, col, { a: 'middle', w: 900 }); return g; };
  /* GÂNDEȘTE (în spate) */
  stSign(LC[0] + 150, 412, '1', 'THINK', '#FFE38A');
  const thinkCloud = G(cam); const tcb = thoughtBubble(thinkCloud, 230, 140); tf(tcb, -115, -150);
  const tg1 = gear(thinkCloud, 26, 9, '#8E9AAF'), tg2 = gear(thinkCloud, 18, 7, '#B08D3A');
  const tBulb = G(thinkCloud); const bulbIn = lightbulb(tBulb, .7);
  /* ACȚIONEAZĂ (dreapta-față) */
  const actB = G(loopG);
  E('rect', { x: 1290, y: 606, width: 190, height: 16, rx: 5, fill: '#8A5A36' }, actB);
  [1300, 1460].forEach(x => E('rect', { x, y: 620, width: 12, height: 92, fill: '#6B4329' }, actB));
  stSign(1440, 470, '2', 'ACT', '#9FE8FF');
  const fileFly = G(cam); paper(fileFly, 60, 76, { lines: 4, color: '#4D96FF' });
  const termPop = G(cam); E('rect', { x: -95, y: -40, width: 190, height: 80, rx: 10, fill: '#0F1424', stroke: '#4A5070', 'stroke-width': 3 }, termPop);
  E('rect', { x: -95, y: -40, width: 190, height: 18, rx: 8, fill: '#22263A' }, termPop); const termTxt = TX(termPop, -82, 12, '', 20, '#7CFFB2', { mono: true, w: 700 });
  /* PRIVEȘTE (stânga-față) */
  stSign(160, 470, '3', 'LOOK', '#B6F5C8');
  const mon = G(loopG); E('rect', { x: 196, y: 640, width: 12, height: 72, fill: '#3A3F55' }, mon); E('rect', { x: 160, y: 704, width: 84, height: 10, rx: 4, fill: '#3A3F55' }, mon);
  E('rect', { x: 120, y: 520, width: 164, height: 124, rx: 12, fill: '#22263A' }, mon); E('rect', { x: 130, y: 530, width: 144, height: 104, rx: 6, fill: '#F4F6FB' }, mon);
  const mBars = [0, 1, 2, 3].map(k => E('rect', { x: 146 + k * 30, y: 620, width: 20, height: 0, rx: 3, fill: ['#4D96FF', '#2EC4B6', '#F7C948', '#3BB273'][k] }, mon));
  const mOk = G(mon); tf(mOk, 252, 552); E('circle', { r: 15, fill: '#3BB273' }, mOk); icon(mOk, 'check', 18, '#fff', 6);
  const done = G(cam); const doneW = woodSign(done, 200, 66, 'Done!', { size: 34, fill: '#3BB273', color: '#fff' }); tf(doneW, 0, -33);
  /* ================= D: meșterul ================= */
  const craft = G(cam);
  const cBench = G(craft); E('rect', { x: 210, y: 600, width: 230, height: 18, rx: 5, fill: '#8A5A36' }, cBench); [222, 418].forEach(x => E('rect', { x, y: 616, width: 12, height: 96, fill: '#6B4329' }, cBench));
  const levelOnBench = G(craft);
  const lvl = G(levelOnBench); E('rect', { x: -60, y: -10, width: 120, height: 20, rx: 6, fill: '#F7C948' }, lvl); E('rect', { x: -20, y: -6, width: 40, height: 12, rx: 6, fill: '#B6F5C8' }, lvl);
  const lvlBubble = E('circle', { cx: 0, cy: 0, r: 5, fill: '#fff' }, lvl); E('path', { d: 'M-8,-6 V6 M8,-6 V6', stroke: '#2E9C62', 'stroke-width': 2 }, lvl);
  const hamBench = G(craft); hammer(hamBench, .8);
  const chair = G(craft);
  const chairIn = G(chair);
  E('rect', { x: -70, y: -200, width: 14, height: 200, rx: 5, fill: '#9C6B3C' }, chairIn); E('rect', { x: 56, y: -200, width: 14, height: 200, rx: 5, fill: '#9C6B3C' }, chairIn);
  [-170, -140].forEach(y => E('rect', { x: -60, y, width: 120, height: 10, rx: 4, fill: '#B98552' }, chairIn));
  E('rect', { x: -80, y: -96, width: 160, height: 20, rx: 6, fill: '#B98552' }, chairIn);
  E('rect', { x: -70, y: -78, width: 14, height: 78, rx: 5, fill: '#9C6B3C' }, chairIn);
  const shortLeg = E('rect', { x: 56, y: -78, width: 14, height: 66, rx: 5, fill: '#9C6B3C' }, chairIn);
  const nailBang = G(craft); const bang = sparkle(nailBang, '#FFE066', 26); TX(nailBang, 30, -30, 'bang!', 26, '#FFE066', { w: 900, hand: true });
  const advB = G(craft); const ab = speechBubble(advB, 300, 70, 'bl'); TX(advB, 150, 45, 'You should fix that…', 22, C.ink, { a: 'middle', w: 700 });
  const poof = G(craft); const poofs = []; for (let k = 0; k < 7; k++) poofs.push(E('circle', { r: 12, fill: '#fff' }, poof));
  const okBadge = G(craft); E('circle', { r: 30, fill: '#3BB273' }, okBadge); icon(okBadge, 'check', 36, '#fff', 6);
  const carp = Human(craft, { seed: 8, tie: false, glasses: false, mustache: true, hair: '#6A4428', jacket: '#2F6F64', shirt: '#EAD9B8', apron: '#8A5A36', skin: '#E0A878' });
  const carpHam = G(carp.propR); hammer(carpHam, .75); tf(carpHam, 0, 0, -20);
  const anaTag = label(craft, 600, 236, 'Like a good craftsman', 30, '#FFE38A');
  /* ================= E: trusa cu șase unelte ================= */
  const tools = G(cam);
  const TOOLS = [['files', 'Files', '#4D96FF'], ['commands', 'Commands', '#2EC4B6'], ['building', 'Build', '#F2994A'], ['iPhone', 'Test iPhone', '#9B5DE5'], ['screenshots', 'Screenshots', '#E84855'], ['documentation', 'Documentation', '#3BB273']];
  const SLOTS = [[250, 330], [470, 262], [690, 228], [910, 228], [1130, 262], [1350, 330]];
  const tItems = TOOLS.map(([w, lab, col], k) => {
    const g = G(tools); const badge = G(g);
    E('circle', { r: 76, fill: '#000', 'fill-opacity': .2, cx: 4, cy: 8 }, badge); E('circle', { r: 76, fill: '#FFF6E5', stroke: col, 'stroke-width': 8 }, badge);
    const pr = G(badge);
    if (k === 0) { const a = G(pr); tf(a, -12, 4, -12); paper(a, 58, 74, { lines: 4, color: col }); const b = G(pr); tf(b, 14, -2, 8); paper(b, 58, 74, { lines: 4 }); }
    else if (k === 1) { E('rect', { x: -52, y: -36, width: 104, height: 72, rx: 9, fill: '#0F1424' }, pr); E('rect', { x: -52, y: -36, width: 104, height: 15, rx: 7, fill: '#2B3047' }, pr); TX(pr, -42, 6, '> build', 17, '#7CFFB2', { mono: true, w: 700 }); TX(pr, -42, 26, '> run_', 17, '#7CFFB2', { mono: true, w: 700 }); }
    else if (k === 2) { const h = G(pr); tf(h, 0, -6, -35); hammer(h, .75); }
    else if (k === 3) { const ph = phone(pr, .155); tf(ph, -23, -48, 0, .155); const u = appUI(ph.screen); }
    else if (k === 4) { cameraProp(pr, .95); }
    else { const b = G(pr); tf(b, -4, 4); bookProp(b, col, .72, 1); const m = G(pr); tf(m, 30, -24); magnifier(m, .45); }
    const lb = label(g, 0, 112, lab, 22);
    return { g, badge, t: wordT(8, w) - .2, col };
  });
  const tbHead = label(tools, 800, 116, 'The agent\'s toolbox', 30, '#FFE38A');

  /* ================= robotul (agentul) ================= */
  const boss = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1 });
  const bHam = G(boss.propR); hammer(bHam, .75); tf(bHam, 0, -8, 10);
  const bMag = G(boss.propL); magnifier(bMag, .6); tf(bMag, 0, -26);
  const motion = G(cam); const mLines = [0, 1, 2].map(k => E('path', { stroke: '#FFF6E5', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: .6 }, motion));

  /* ================= timpi ================= */
  const tModel = wordT(3, 'model'), tTools = wordT(3, 'tools'), tLoop = wordT(3, 'loop');
  const tAgain = wordT(6, 'thinks again'), tRound = wordT(6, 'Round'), tDone = wordT(6, 'until');
  const thK = [[L(4) - .1, -90], [Le(4) + .2, -90], [L(5) + .7, 30], [Le(5) - .1, 30], [L(6) + .6, 150], [tAgain - .4, 150], [tAgain + .4, 270], [tRound, 270], [tDone + .3, 990]];
  const camK = [[0, 800, 450, 1], [L(1) - .5, 760, 430, 1.04], [L(2), 820, 440, 1.02], [L(3) - .6, 800, 420, 1], [L(4) - .8, 800, 440, 1], [L(4) + .6, 800, 400, 1.06],
    [Le(4) + .2, 800, 400, 1.06], [L(5) + .8, 1000, 470, 1.05], [Le(5), 1000, 470, 1.05], [L(6) + .6, 620, 470, 1.05], [tAgain - .3, 620, 470, 1.05], [tRound, 800, 440, 1],
    [L(7) - .4, 800, 440, 1], [L(7) + .6, 640, 470, 1.1], [Le(7), 640, 470, 1.1], [L(8) + .2, 800, 430, 1], [cue.d, 800, 435, 1.02]];

  return (lt, at) => {
    bg.anim(at);
    camera(cam, lt, camK);
    /* ---------- A ---------- */
    const kOn = 1 - prog(lt, L(3) - .7, .6);
    op(kiosk, kOn); tf(kiosk, 0, prog(lt, L(3) - .7, .6) * 60);
    const talkB = cue.talk(lt, 'B');
    const bl = Math.max(.08, blink(at, 11));
    cbEyes.forEach(e => { tf(e.g, 560 + e.s * 62, 390 + Math.sin(at * 2) * 2, 0, 1, bl); tf(e.pu, talkB ? Math.sin(at * 1.3) * 5 : 6, talkB ? 0 : 3); });
    const m = talkB ? .5 + .5 * Math.abs(Math.sin(at * 13) * Math.sin(at * 4.7 + 1)) : 0;
    cbMouth.setAttribute('d', `M520,452 Q560,${f2(462 + 34 * m)} 600,452 Q560,${f2(458 + 10 * m)} 520,452 Z`);
    tf(cbFace, 0, Math.sin(at * 2.2) * 2);
    const bv = pop(lt, L(1) - .2, .5) * (1 - prog(lt, L(3) - .9, .4));
    op(cbBub, bv > 0 ? 1 : 0); tf(cbBub, 770, 190 + Math.sin(at * 1.6) * 4, 0, Math.max(.01, bv));
    const nW = Math.floor(clamp((lt - L(1)) / (Le(1) - L(1) - .3)) * advAll.length); let used = 0;
    advice.forEach((s, i) => { const ws = s.split(' '); const k = clamp(nW - used, 0, ws.length); advT[i].textContent = ws.slice(0, k).join(' '); used += ws.length; });
    op(oldBench, 1 - prog(lt, L(3) - .2, .6));
    const sy = 640 + Math.sin(at * 1.4) * 22; spiderT.setAttribute('d', `M1384,606 V${f2(sy - 8)}`); tf(spider, 1384, sy, Math.sin(at * 2) * 10);
    /* trusa: bancul vechi → ecuație → bancul ACT → mare, în centru */
    const tbP = keyed(lt, [[tTools - .6, [1230, 550, 1, 0]], [tTools + .3, [610, 420, 1.15, -360]], [L(4) - 1, [610, 420, 1.15, -360]], [L(4) + .2, [1385, 566, .75, -360]], [L(8) - .9, [1385, 566, .75, -360]], [L(8) - .85, [760, 660, 1.6, -360]]]);
    const shakeTb = lt > tTools - 1 && lt < tTools - .5 ? Math.sin(at * 60) * 4 : 0;
    tf(tb, tbP[0] + shakeTb, tbP[1] + (lt > L(7) - .8 && lt < L(8) - .5 ? 0 : Math.sin(at * 2) * 1.5), lt > tTools - .6 && lt < tTools + .3 ? tbP[3] * 0 + Math.sin(prog(lt, tTools - .6, .9) * Math.PI) * 25 : 0, tbP[2]);
    op(tb, 1 - win(lt, L(7) - .7, L(8) - .7, .4, .3));
    op(web, 1 - prog(lt, tTools - .7, .3)); op(dust, 1 - prog(lt, tTools - .7, .3));
    const pf = prog(lt, tTools - .7, .9, easeOut); op(puff, pf > 0 && pf < 1 ? (1 - pf) * .8 : 0);
    puffs.forEach((p, k) => { const a = k / 8 * Math.PI * 2; tf(p, 1230 + Math.cos(a) * 80 * pf, 520 + Math.sin(a) * 40 * pf, 0, .6 + pf); });
    const lidP = lt > L(8) - .4 ? prog(lt, L(8) - .2, .6, easeBack) : 0; lid.setAttribute('transform', `translate(0,${f2(-30 * lidP)}) translate(0,-58) scale(1,${f2(1 - .55 * lidP)}) translate(0,58)`); op(tbInside, lidP);
    /* Tudor cu lista */
    const tIn = keyed(lt, [[L(2) - .9, 1720], [L(2) + 1.1, 1040], [L(3) - .9, 1040], [L(3) + .9, 1760]], t => t);
    const tWalk = (lt > L(2) - .9 && lt < L(2) + 1.1) || (lt > L(3) - .9 && lt < L(3) + .9);
    op(tudor.root, lt > L(2) - 1 && lt < L(3) + .9 ? 1 : 0);
    const twc = walkCycle(tIn / 22);
    const tst = { x: tIn, y: 712, s: .92, at, face: 'worried', look: [-1, .5], turn: -.4, hL: [-40, -210], bob: Math.sin(at * 2) * 1.5 };
    if (tWalk) Object.assign(tst, { fL: twc.fL, fR: twc.fR, bob: twc.bob, hR: [60 - twc.swing * 12, -128] });
    else if (lt > Le(2) - 1.5) Object.assign(tst, { hR: [86, -250 + Math.sin(at * 4) * 6], hL: [-70, -240], face: 'worried', look: [0, 0], turn: 0, headTilt: Math.sin(at * 3) * 4 });
    else Object.assign(tst, { hR: [40, -150], headTilt: -6 });
    tudor.set(tst);
    const sw = lt > L(2) + 1 && lt < L(3) - .9 ? 1 : 0; op(sweatT, sw); tf(sweatT, tIn + 38, 712 - 330 * .92 + ((lt * 30) % 30));
    /* ---------- B ---------- */
    const eqOn = 1 - prog(lt, L(4) - 1, .6); op(eq, eqOn);
    show(eModel, lt, tModel - .3, 1e9, { pop: true });
    show(ePlus1, lt, tTools - .5, 1e9, { pop: true }); show(eToolsL, lt, tTools + .1, 1e9, { dy: 10 });
    show(ePlus2, lt, tLoop - .45, 1e9, { pop: true }); show(eLoop, lt, tLoop - .25, 1e9, { pop: true });
    show(eEq, lt, tLoop + .35, 1e9, { pop: true }); show(eAgentL, lt, L(3) + .6, 1e9, { dy: 12 });
    mDots.forEach((d, k) => d.setAttribute('r', f2(4 + 2.5 * (.5 + .5 * Math.sin(at * 3 + k)))));
    tf(loopIc, 0, 0, at * 60);
    const spT = L(3) + .1;
    sparks.forEach((s, k) => { const p = prog(lt, spT, 1.2, easeOut); const a = k / 8 * Math.PI * 2 + .3; op(s, p > 0 && p < 1 ? 1 - p : 0); tf(s, 1380 + Math.cos(a) * 150 * p, 410 + Math.sin(a) * 120 * p, at * 200, 1 - p * .5); });
    /* ---------- C: traseul ---------- */
    const lOn = win(lt, L(4) - 1, L(7) - .5, .7, .6); op(loopG, lOn);
    flow.setAttribute('stroke-dashoffset', f2(-at * 40));
    chevs.forEach((c, k) => { const th = (k / 8) * 360 + at * 12; const p = pos(th), p2 = pos(th + 2); tf(c, p[0], p[1], Math.atan2(p2[1] - p[1], p2[0] - p[0]) * 180 / Math.PI, 1, .8); });
    const th = keyed(lt, thK, t => ease(t));
    const nRound = 1 + Math.floor((th + 90 + .01) / 360);
    tf(roundTag, LC[0], LC[1] + 4); roundT.textContent = 'round ' + Math.max(1, nRound); op(roundTag, lOn * prog(lt, L(4) + .5, .4) * (1 - prog(lt, L(7) - 1, .3)));
    const atThink = (lt > L(4) - .1 && lt < Le(4) + .2) || (lt > tAgain + .3 && lt < tRound);
    const tcv = pop(lt, L(4) + .3, .5) * (1 - prog(lt, Le(4), .3)) + (lt > tAgain + .3 ? pop(lt, tAgain + .3, .4) * (1 - prog(lt, tRound - .1, .3)) : 0);
    op(thinkCloud, clamp(tcv) > 0 ? 1 : 0); tf(thinkCloud, LC[0] + 10, 248 + Math.sin(at * 1.6) * 5, 0, Math.max(.01, clamp(tcv)));
    tf(tg1, -30, -80, at * 90); tf(tg2, 6, -96, -at * 130); tf(tBulb, 60, -86, 0, 1);
    const bOn = lt > L(4) + 2.2; bulbIn.glow.setAttribute('fill-opacity', bOn ? f2(.3 + .15 * Math.sin(at * 6)) : '0');
    /* acțiunea: fișierul zboară, terminalul apare */
    const acting = lt > L(5) + .7 && lt < Le(5) - .1;
    const fp = prog(lt, wordT(5, 'writes'), 1.0, easeOut); op(fileFly, acting && fp > 0 ? 1 - prog(lt, Le(5) - .4, .3) : 0);
    const fa = arcPos(fp, [1385, 560], [1240, 330], 60); tf(fileFly, fa[0], fa[1], (1 - fp) * 30, .6 + .5 * fp);
    const tp2 = pop(lt, wordT(5, 'runs'), .4); op(termPop, acting && tp2 > 0 ? 1 - prog(lt, Le(5) - .4, .3) : 0); tf(termPop, 1110, 320, 0, Math.max(.01, tp2));
    termTxt.textContent = ('> run app').slice(0, Math.floor(clamp((lt - wordT(5, 'runs') - .2) / 1) * 9)) + (Math.sin(at * 8) > 0 ? '_' : '');
    /* priveşte rezultatul */
    const looking = lt > L(6) + .5 && lt < tAgain;
    mBars.forEach((b, k) => { const h = (30 + k * 14) * prog(lt, L(6) + .7 + k * .2, .5); b.setAttribute('y', f2(620 - h)); b.setAttribute('height', f2(h)); });
    op(mOk, pop(lt, L(6) + 1.8, .4));
    const dv = pop(lt, tDone + .3, .5) * (1 - prog(lt, L(7) - .7, .4)); op(done, dv > 0 ? 1 : 0); tf(done, LC[0] - 250, 380 + Math.sin(at * 3) * 4, Math.sin(at * 4) * 4, Math.max(.01, dv));
    /* ---------- D: meșterul ---------- */
    const cOn = win(lt, L(7) - .5, L(8) - .5, .6, .5); op(craft, cOn);
    const tPick = wordT(7, 'picks'), tJob = wordT(7, 'does the job'), tCheck = wordT(7, 'checks'), tAdv = wordT(7, 'advice');
    const fixed = lt > tJob + 1.0;
    tf(chair, 830, 712); tf(chairIn, 0, 0, fixed ? 0 : Math.sin(at * 7) * 2.2);
    shortLeg.setAttribute('height', fixed ? '78' : '66');
    const bangV = win(lt, tJob + .3, tJob + 1.3, .1, .4); op(nailBang, bangV); tf(nailBang, 890, 660, 0, .8 + .4 * bangV); tf(bang, 0, 0, at * 200);
    const hasHam = lt > tPick + .2;
    op(hamBench, hasHam ? 0 : 1); tf(hamBench, 300, 588, 90);
    const lvlOn = lt > tCheck - .1;
    const lvlP = prog(lt, tCheck - .1, .6, easeOut);
    tf(levelOnBench, lerp(380, 830, lvlP), lerp(590, 604, lvlP) - Math.sin(Math.PI * lvlP) * 60);
    lvlBubble.setAttribute('cx', f2(lvlOn ? lerp(26, 0, prog(lt, tCheck + .6, .8)) + Math.sin(at * 3) * (1 - prog(lt, tCheck + .6, .8)) * 4 : 26));
    const abv = pop(lt, tAdv - 1.2, .4) * (1 - prog(lt, tAdv + .3, .2)); op(advB, abv > 0 ? 1 : 0); tf(advB, 470, 340, 0, Math.max(.01, abv));
    const pfv = prog(lt, tAdv + .3, .6, easeOut); op(poof, pfv > 0 && pfv < 1 ? 1 - pfv : 0);
    poofs.forEach((p, k) => { const a = k / 7 * Math.PI * 2; tf(p, 620 + Math.cos(a) * 90 * pfv, 375 + Math.sin(a) * 40 * pfv, 0, 1 - pfv * .6); });
    op(okBadge, pop(lt, tCheck + 1.3, .5)); tf(okBadge, 830, 520, 0, Math.max(.01, pop(lt, tCheck + 1.3, .5)));
    show(anaTag, lt, L(7) + .2, L(8) - .7, { dy: -10 }); op(anaTag, win(lt, L(7) + .2, L(8) - .7, .5, .4));
    const cx = keyed(lt, [[tPick - .3, 520], [tPick + .3, 470], [tJob - .4, 470], [tJob, 700], [tCheck + 1.2, 700]]);
    const cst = { x: cx, y: 712, s: 1, at, face: 'happy', look: [0, 0], bob: Math.sin(at * 2.2) * 1.5, turn: 0 };
    if (lt < tAdv - 1.3) Object.assign(cst, { hR: [80 + Math.sin(at * 10) * 16, -330], face: 'joy' });
    else if (lt < tAdv + .3) Object.assign(cst, { hR: [70, -300 + Math.sin(at * 12) * 10], face: 'think', turn: .4 });
    else if (lt < tPick + .3) Object.assign(cst, { hR: [lerp(60, -150, prog(lt, tAdv + .4, .6)), lerp(-128, -112, prog(lt, tAdv + .4, .6))], face: 'focus', turn: -.5, look: [-1, 1] });
    else if (lt < tJob - .4) Object.assign(cst, { hR: [70, -200], face: 'happy', turn: .4, look: [1, 0] });
    else if (lt < tCheck) { const sw2 = Math.abs(Math.sin((lt - tJob) * 9)); Object.assign(cst, { hR: [110, lerp(-260, -120, sw2)], rotR: lerp(-40, 20, sw2), face: 'focus', look: [1, 1], turn: .5, tilt: 5 }); }
    else Object.assign(cst, { hR: [70, -300], face: 'joy', turn: .2, look: [1, .6] });
    carp.set(cst); op(carpHam, hasHam ? 1 : 0);
    /* ---------- E: trusa ---------- */
    const eOn = prog(lt, L(8) - .4, .5); op(tools, eOn);
    op(tbHead, prog(lt, L(8), .5));
    tItems.forEach((it, k) => { const p = prog(lt, it.t, .9, easeOut); const from = [760, 590], to = SLOTS[k];
      const a = arcPos(p, from, [to[0], to[1] + Math.sin(at * 1.5 + k) * 6], 140);
      op(it.g, lt > it.t ? 1 : 0); tf(it.g, a[0], a[1], (1 - p) * 360, lerp(.2, 1, p)); });
    /* ---------- robotul ---------- */
    const bst = { at, face: 'happy', look: [0, 0], bob: Math.sin(at * 2.2) * 2, s: .8 };
    let showHam = false, showMag = false, robOn = 0;
    if (lt < L(4) - 1.2) { robOn = prog(lt, spT, .01); const ps = pop(lt, spT, .6); Object.assign(bst, { x: 1380, y: 520, s: .8 * Math.max(.01, ps), face: 'joy', hR: [80, -260 + Math.sin(at * 9) * 30], hL: [-70, -110] }); showHam = true; }
    else if (lt < L(4) - .1) { robOn = 1; const p = prog(lt, L(4) - 1.2, 1.1); const a = arcPos(p, [1380, 520], pos(-90), 160); Object.assign(bst, { x: a[0], y: a[1], s: lerp(.8, .62, p), face: 'joy', hL: [-90, -250], hR: [90, -250], air: 1 }); }
    else if (lt < L(7) - .6) {
      robOn = 1; const p = pos(th), s = .72 + .12 * Math.sin(th * Math.PI / 180);
      const moving = Math.abs(keyed(lt + .05, thK) - keyed(lt - .05, thK)) > .3; const fastM = lt > tRound && lt < tDone + .3;
      const wc = walkCycle(th / 9);
      Object.assign(bst, { x: p[0], y: p[1], s });
      if (moving) Object.assign(bst, { fL: wc.fL, fR: wc.fR, bob: wc.bob, hL: [-64 + wc.swing * 16, -100], hR: [64 - wc.swing * 16, -100], face: fastM ? 'joy' : 'happy', tilt: fastM ? 10 : 0 });
      else if (atThink) Object.assign(bst, { face: 'think', hR: [26, -196], hL: [-60, -84], look: [1, -1], headTilt: Math.sin(at * 2) * 5 });
      else if (acting) { const sw3 = Math.abs(Math.sin(at * 9)); Object.assign(bst, { face: 'focus', hR: [110, lerp(-230, -110, sw3)], rotR: lerp(-30, 30, sw3), hL: [70, -120], look: [1, 1] }); showHam = true; }
      else if (looking) { Object.assign(bst, { face: lt > L(6) + 1.8 ? 'happy' : 'surprise', hL: [-120, -220], hR: [60, -110], look: [-1, -.4], tilt: -6 }); showMag = true; }
      else if (lt > tDone) Object.assign(bst, { face: 'joy', hL: [-80, -280], hR: [80, -280] });
      const ml = fastM ? 1 : 0; op(motion, ml); if (ml) { const p2 = pos(th - 25); mLines.forEach((l, k) => l.setAttribute('d', `M${f2(p2[0])},${f2(p2[1] - 60 - k * 40 * s)} L${f2(p[0] - 30)},${f2(p[1] - 60 - k * 40 * s)}`)); }
    } else if (lt < L(8) - .6) { robOn = 1; const p = prog(lt, L(7) - .6, 1.2); const x = lerp(pos(-90 + 720 + 360)[0], 1180, p); const wc = walkCycle(x / 20);
      Object.assign(bst, { x, y: lerp(472, 712, p), s: lerp(.62, .8, p), face: 'happy', look: [-1, 0] });
      if (p < 1) Object.assign(bst, { fL: wc.fL, fR: wc.fR, bob: wc.bob }); else Object.assign(bst, { headTilt: Math.sin(at * 4) * 6, hR: lt > wordT(7, 'checks') + 1.3 ? [70, -260] : [64, -92] });
    } else { robOn = 1; const p = prog(lt, L(8) - .6, 1); const x = lerp(1180, 1010, p); const wc = walkCycle(x / 20);
      Object.assign(bst, { x, y: lerp(712, 700, p), s: .8, face: 'joy', look: [0, -1] });
      if (p < 1) Object.assign(bst, { fL: wc.fL, fR: wc.fR, bob: wc.bob });
      else { const k = tItems.findIndex(it => lt > it.t - .4 && lt < it.t + .5); const up = k >= 0;
        Object.assign(bst, { hL: up && k % 2 === 0 ? [-70, -300] : [-80, -170 + Math.sin(at * 6) * 20], hR: up && k % 2 === 1 ? [70, -300] : [80, -170 + Math.sin(at * 6 + 2) * 20], face: up ? 'joy' : 'happy', look: up ? [0, -1] : [0, 0] }); }
    }
    op(boss.root, robOn); op(bHam, showHam ? 1 : 0); op(bMag, showMag ? 1 : 0);
    boss.set(bst);
  };
} });
