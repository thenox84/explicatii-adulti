"use strict";
/* SCENA 6 — Uneltele în acțiune: proiect, cod, mașina de construit, erori, reparații, bucla */
SCENE(6, { build(world, cue) {
  const L = i => cue(i), Le = i => cue.e(i);
  const cam = G(world);
  const WIN = [1140, 70, 370, 250];
  const bg = bgWorkshop(cam, { windows: [WIN], pegboard: false, shelves: [[-170, 470, 240]], clock: false, lamps: [330, 760, 1230] });

  /* ---------- fereastra: zi/noapte pentru „time-lapse” ---------- */
  const tl = G(cam, { 'clip-path': clipRect(WIN[0], WIN[1], WIN[2], WIN[3]) });
  const tlSky = E('rect', { x: WIN[0], y: WIN[1], width: WIN[2], height: WIN[3], fill: '#9AD8FF' }, tl);
  const tlSun = E('circle', { r: 26, fill: '#FFE066' }, tl);
  const tlMoon = E('circle', { r: 20, fill: '#FFF4D6' }, tl);
  const tlCity = G(tl);
  for (let i = 0; i < 9; i++) { const bw = 34 + hash(i + 3) * 30, bh = 50 + hash(i + 8) * 90, bx = WIN[0] + i * 44 - 10;
    E('rect', { x: bx, y: WIN[1] + WIN[3] - bh, width: bw, height: bh, fill: '#3C2F5C' }, tlCity); }
  const tlBars = G(cam);
  for (let k = 1; k < 4; k++) E('rect', { x: WIN[0] + WIN[2] * k / 4 - 4, y: WIN[1], width: 8, height: WIN[3], fill: '#2B2238' }, tlBars);
  for (let k = 1; k < 3; k++) E('rect', { x: WIN[0], y: WIN[1] + WIN[3] * k / 3 - 4, width: WIN[2], height: 8, fill: '#2B2238' }, tlBars);

  /* ---------- masa, monitorul, tastatura ---------- */
  const table = G(cam);
  E('rect', { x: 110, y: 672, width: 18, height: 50, fill: '#5A3B2B' }, table); E('rect', { x: 832, y: 672, width: 18, height: 50, fill: '#5A3B2B' }, table);
  E('rect', { x: 86, y: 652, width: 790, height: 24, rx: 6, fill: '#8A5A3B' }, table); E('rect', { x: 86, y: 652, width: 790, height: 7, rx: 3, fill: '#A9744F' }, table);
  const cup = mug(cam, .8, '#2EC4B6'); tf(cup, 160, 630);
  const pl = plant(cam, .62); tf(pl, 860, 640);
  const mon = monitor(cam, 700, 440); tf(mon, 470, 350);
  const kb = G(cam);
  E('path', { d: 'M640,640 L824,640 L840,656 L624,656 Z', fill: '#2B2F45' }, kb);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 11; c++) E('rect', { x: 636 + c * 17 + r * 6, y: 643 + r * 6, width: 13, height: 4, rx: 1.5, fill: '#5B6280' }, kb);
  const stk = G(cam); tf(stk, 790, 150, 8); sticky(stk, 'make it\nwork', '#FFE066', { w: 96, h: 80, size: 15 });
  /* bara de titlu cu file */
  const tabs = ['Recipe.swift', 'RecipeList.swift'].map((s, i) => { const t = G(mon); tf(t, -350 + 90 + i * 190, -220 + 4);
    const bgT = E('rect', { x: 0, y: 2, width: 180, height: 28, rx: 8, fill: '#0F1424' }, t); TX(t, 14, 22, s, 15, '#C9D1E6', { w: 600 }); return { t, bgT }; });
  const content = mon.content; // (0,0) = colțul de sus al zonei de text
  /* bara laterală cu fișiere */
  E('rect', { x: -20, y: -32, width: 168, height: 376, fill: '#0B101D' }, content);
  const files = [['RecipesApp', 3.0, 1], ['RecipesApp.swift', 4.2], ['Recipe.swift', 7.7], ['RecipeList.swift', 15.2], ['RecipeRow.swift', 20.0], ['Info.plist', L(8) + 1.0]];
  const fileN = files.map((f, i) => { const n = G(content); tf(n, f[2] ? 0 : 14, i * 30);
    const ic = G(n); tf(ic, 8, -5); icon(ic, f[2] ? 'folder' : 'file', f[2] ? 18 : 15, f[2] ? '#F7C948' : '#8A95B5', 3);
    const t = TX(n, 22, 0, f[0], 14, '#C9D1E6', { w: 600 }); return { n, t, at: f[1] }; });
  /* codul */
  const f1 = ['struct Recipe: Identifiable {', '    let id = UUID()', '    var title: String', '    var ingredients: [String]', '    var steps: [String]', '    var photo: Data?', '    var isFavourite = false', '}'];
  const cA = ['struct RecipeList: View {', '    @State private var query = ""', '    var recipes: [Recipe]'];
  const cI = ['    var results: [Recipe] {', '        recipes.filter { $0.matches(query) }', '    }'];
  const cB = ['    var body: some View {', '        NavigationStack {', '            List(results) { recipe in', '                RecipeRow(recipe: recipe)', '            }', '            .searchable(text: $query)', '        }', '    }', '}'];
  const LH = 24;
  const ed = G(content); tf(ed, 166, 0);
  const code1 = codeBlock(ed, f1, { lh: LH, size: 16 });
  const code2 = G(ed);
  const bA = codeBlock(code2, cA, { lh: LH, size: 16 });
  const ins = G(code2); const insHl = E('rect', { x: -8, y: 3 * LH - 18, width: 540, height: 3 * LH, rx: 5, fill: C.green, 'fill-opacity': .14 }, ins);
  const bI = codeBlock(ins, cI, { lh: LH, size: 16 }); tf(bI, 0, 3 * LH);
  const bBw = G(code2); const bB = codeBlock(bBw, cB, { lh: LH, size: 16 }); tf(bB, 0, 3 * LH);
  const errL = G(bBw);
  E('rect', { x: -8, y: 5 * LH - 18, width: 540, height: LH, rx: 4, fill: C.red, 'fill-opacity': .2 }, errL);
  E('path', { d: 'M' + [...Array(30)].map((_, i) => `${96 + i * 6},${5 * LH + 6 + (i % 2 ? 4 : 0)}`).join(' L'), stroke: '#FF6B6B', 'stroke-width': 2.2, fill: 'none' }, errL);
  E('circle', { cx: -16, cy: 5 * LH - 6, r: 6, fill: '#FF6B6B' }, errL);

  /* ---------- dosarul proiectului care apare ---------- */
  const fold = G(cam); folder(fold, 230, 170, { label: 'RecipesApp', size: 24 });
  const flyFiles = [0, 1, 2].map(i => { const n = G(cam); paper(n, 54, 70, { color: [C.blue, C.gold, C.teal][i] }); return n; });

  /* ---------- mașina de construit ---------- */
  const M = G(cam); const Min = G(M);
  const hopperPages = [0, 1, 2].map(i => { const n = G(cam); paper(n, 46, 60, { color: C.blue }); return n; });
  E('rect', { x: 1090, y: 440, width: 310, height: 262, rx: 26, fill: '#4F5D7E' }, Min);
  E('rect', { x: 1090, y: 440, width: 310, height: 42, rx: 21, fill: '#5F6F94' }, Min);
  E('rect', { x: 1108, y: 500, width: 274, height: 186, rx: 16, fill: '#44506D' }, Min);
  [[1104, 456], [1386, 456], [1104, 688], [1386, 688]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 4, fill: '#8E9AAF' }, Min));
  TX(Min, 1112, 474, 'BUILD-O-MATIC', 17, '#F7C948', { w: 800, ls: 1.5 });
  /* hublou cu rotiță */
  E('circle', { cx: 1300, cy: 600, r: 58, fill: '#232A42' }, Min);
  const pg = gear(Min, 34, 9, '#C9A227'); tf(pg, 1300, 600);
  E('circle', { cx: 1300, cy: 600, r: 52, fill: '#9CC8FF', 'fill-opacity': .14, stroke: '#8E9AAF', 'stroke-width': 9 }, Min);
  E('path', { d: 'M1268,572 Q1280,558 1298,556', stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, Min);
  /* coș de fum */
  E('rect', { x: 1118, y: 372, width: 42, height: 72, fill: '#3E4A66' }, Min); E('rect', { x: 1110, y: 362, width: 58, height: 16, rx: 5, fill: '#2F3850' }, Min);
  /* pâlnie */
  E('path', { d: 'M1214,398 L1300,398 L1282,442 L1232,442 Z', fill: '#8E9AAF' }, Min);
  E('rect', { x: 1210, y: 394, width: 94, height: 10, rx: 4, fill: '#A7B2C6' }, Min);
  /* roți dințate pe lateral */
  const g1 = gear(Min, 40, 10, '#8E9AAF'); tf(g1, 1404, 528);
  const g2 = gear(Min, 26, 8, '#C9A227'); tf(g2, 1440, 600);
  /* braț cu ciocan */
  const arm = G(Min);
  E('rect', { x: -112, y: -9, width: 124, height: 18, rx: 9, fill: '#6C7890' }, arm);
  E('rect', { x: -138, y: -28, width: 46, height: 52, rx: 8, fill: '#9AA6BD' }, arm); E('rect', { x: -138, y: -28, width: 12, height: 52, rx: 4, fill: '#6C7890' }, arm);
  E('circle', { r: 14, fill: '#3E4A66' }, arm);
  /* lampa de stare */
  E('circle', { cx: 1350, cy: 470, r: 18, fill: '#232A42' }, Min);
  const lampGlow = E('circle', { cx: 1350, cy: 470, r: 36, fill: '#7CFFB2', 'fill-opacity': 0 }, Min);
  const lamp = E('circle', { cx: 1350, cy: 470, r: 12, fill: '#6B7280' }, Min);
  const alarm = alarmLight(Min, .9); tf(alarm, 1185, 440);
  /* fanta imprimantei */
  E('rect', { x: 1112, y: 508, width: 160, height: 12, rx: 5, fill: '#1B2033' }, Min);
  /* banda transportoare + trapă */
  E('rect', { x: 1386, y: 640, width: 24, height: 50, rx: 4, fill: '#2B3350' }, M);
  E('rect', { x: 1400, y: 680, width: 200, height: 14, rx: 7, fill: '#2B3350' }, M);
  const belt = E('path', { d: 'M1404,681 H1596', stroke: '#8E9AAF', 'stroke-width': 3, 'stroke-dasharray': '10 10' }, M);
  [1414, 1500, 1586].forEach(x => E('circle', { cx: x, cy: 702, r: 9, fill: '#3E4A66' }, M));
  /* pâlpâit de fum */
  const smoke = [...Array(7)].map(() => E('circle', { r: 10, fill: '#7A7E92' }, cam));
  /* șurub care sare */
  const bolt = G(cam); E('path', { d: 'M-10,-6 L0,-12 L10,-6 L10,6 L0,12 L-10,6 Z', fill: '#C9CFDE' }, bolt); E('circle', { r: 4, fill: '#6C7890' }, bolt);
  /* cutia cu aplicația */
  const box = G(cam);
  E('rect', { x: -44, y: -48, width: 88, height: 52, rx: 6, fill: '#C8954F' }, box); E('rect', { x: -44, y: -48, width: 88, height: 12, rx: 4, fill: '#B07D3A' }, box);
  const bph = G(box); tf(bph, -12, -20); icon(bph, 'phone', 30, '#5A3B1E', 4);
  TX(box, 22, -12, 'APP', 15, '#5A3B1E', { a: 'middle', w: 800 });
  const boxCk = G(box); tf(boxCk, 34, -56); E('circle', { r: 16, fill: C.green }, boxCk); icon(boxCk, 'check', 20, '#fff', 5);
  /* banda de hârtie a imprimantei (4 bilețele) */
  const tapes = [
    { at: L(4) + .3, off: L(6) + .2, ok: false, lines: ['✗ BUILD FAILED', 'RecipeList.swift', 'line 6:', 'cannot find', "'results'"] },
    { at: Le(6) - .6, off: L(8) + .2, ok: true, lines: ['✓ BUILD', 'SUCCEEDED'] },
    { at: L(8) + .5, off: L(8) + 3.6, ok: false, lines: ['✗ BUILD FAILED', 'missing photo', 'permission'] },
    { at: L(8) + 3.8, off: 1e9, ok: true, lines: ['✓ BUILD', 'SUCCEEDED'] }
  ].map(tp => { const g = G(cam); const H = 28 + tp.lines.length * 22;
    const r = E('rect', { x: 1118, y: 514, width: 148, height: 0, fill: '#FFFDF5' }, g);
    const zig = E('path', { fill: '#FFFDF5' }, g);
    const tx = tp.lines.map((s, i) => TX(g, 1128, 540 + i * 22, s, i === 0 ? 16 : 16, tp.ok ? '#1E7A46' : (i === 0 ? '#C92A3A' : '#5B1E26'), { w: i === 0 ? 800 : 600, mono: i > 0 }));
    return Object.assign(tp, { g, r, zig, tx, H }); });

  /* ---------- maneta ---------- */
  const post = G(cam);
  E('rect', { x: 1000, y: 568, width: 22, height: 154, rx: 6, fill: '#3E4A66' }, post);
  E('rect', { x: 976, y: 548, width: 70, height: 34, rx: 10, fill: '#5F6F94' }, post);
  TX(post, 1011, 572, 'BUILD', 13, '#F7C948', { a: 'middle', w: 800 });
  E('rect', { x: 984, y: 712, width: 54, height: 10, rx: 4, fill: '#2B3350' }, post);
  const lever = G(post); E('rect', { x: -5, y: -84, width: 10, height: 86, rx: 5, fill: '#9AA6BD' }, lever); E('circle', { cx: 0, cy: -88, r: 15, fill: '#E84855' }, lever); E('circle', { cx: -5, cy: -93, r: 5, fill: '#fff', 'fill-opacity': .5 }, lever);
  const knob = a => [1011 + 88 * Math.sin(a * Math.PI / 180), 552 - 88 * Math.cos(a * Math.PI / 180)];

  /* ---------- agentul ---------- */
  const bot = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1 });
  const S = .9;
  const toL = (wx, wy, rx) => [(wx - rx) / S, (wy - 720) / S];
  const mag = magnifier(bot.propR, .8);
  const wr = G(bot.propR); wrench(wr, .7);

  /* ---------- bucla mică + ceas ---------- */
  const LC = [990, 200], LR = 78;
  const loop = G(cam); tf(loop, LC[0], LC[1]);
  E('circle', { r: LR + 46, fill: '#1E1A2B', 'fill-opacity': .55 }, loop);
  E('circle', { r: LR, fill: 'none', stroke: '#6C7BA6', 'stroke-width': 4, 'stroke-dasharray': '3 10', 'stroke-linecap': 'round' }, loop);
  const ldot = E('circle', { r: 8, fill: '#fff' }, loop);
  const lnodes = [['THINK', C.gold, -90], ['ACT', C.blue, 30], ['LOOK', C.teal, 150]].map(([t, c, a]) => { const n = G(loop); const r = a * Math.PI / 180; tf(n, LR * Math.cos(r), LR * Math.sin(r));
    const cc = E('circle', { r: 34, fill: '#1B2238', stroke: c, 'stroke-width': 3 }, n); TX(n, 0, 6, t, 15, '#FFF6E5', { a: 'middle', w: 800 }); return { n, cc, c, px: LR * Math.cos(r), py: LR * Math.sin(r) }; });
  const round = TX(loop, 0, 6, '', 17, '#FFE7A8', { a: 'middle', w: 800 });
  const LK = [[0, 0], [7.2, 0], [7.8, 1], [L(4), 1], [L(4) + .6, 2], [L(5) + .2, 2], [L(5) + .8, 3], [L(6), 3], [L(6) + .6, 4], [Le(6) - .3, 4], [Le(6) + .3, 5], [L(7) + .3, 5], [Le(7) - .1, 11], [L(8) + .3, 11], [L(8) + .8, 12], [L(8) + 1.6, 13], [L(8) + 3.4, 13], [L(8) + 3.9, 14], [L(9), 14], [cue.d, 14 + 24]];
  const clock = wallClock(cam, 64); tf(clock, LC[0], LC[1]);
  const chip = G(cam); tf(chip, LC[0], 336);
  E('rect', { x: -190, y: -26, width: 380, height: 50, rx: 25, fill: '#14121F', 'fill-opacity': .85, stroke: C.gold, 'stroke-width': 2 }, chip);
  TX(chip, 0, 8, 'real life: minutes → hours', 22, '#FFE7A8', { a: 'middle', w: 800 });
  /* bulă de exclamare */
  const exc = G(cam); E('circle', { r: 26, fill: '#fff' }, exc); TX(exc, 0, 12, '!', 36, C.red, { a: 'middle', w: 900 });

  return (lt, at) => {
    bg.anim(at); cup.anim(at); pl.anim(at);
    camera(cam, lt, [[0, 800, 450, 1], [L(1) - .2, 800, 450, 1], [L(1) + 1.2, 500, 380, 1.32], [Le(2) - .2, 500, 380, 1.32], [L(3) + .6, 1030, 440, 1.1],
      [L(4) - .2, 1030, 440, 1.1], [L(4) + .6, 1150, 470, 1.22], [L(5) - .2, 1150, 470, 1.22], [L(5) + .9, 820, 430, 1.0], [L(6) - .1, 820, 430, 1.0],
      [L(6) + .9, 600, 400, 1.2], [L(6) + 2.8, 600, 400, 1.2], [Le(6), 1040, 440, 1.08], [L(7) - .1, 1040, 440, 1.08], [L(7) + .9, 920, 340, 1.22],
      [Le(7), 920, 340, 1.22], [L(8) + .8, 1080, 470, 1.12], [Le(8), 1080, 470, 1.12], [L(9) + .9, 900, 420, 1.0], [cue.d, 920, 410, 1.06]]);

    /* --- stări ale mașinii --- */
    const run = (lt > L(3) + 1.0 && lt < L(4)) || (lt > Le(6) - 1.6 && lt < Le(6) - .3) || (lt > L(8) + 2.6 && lt < L(8) + 3.6) || (lt > L(9) && Math.sin(lt * 5) > -.3);
    const err1 = lt > L(4) && lt < L(6) + .8, err2 = lt > L(8) + .3 && lt < L(8) + 2.6;
    const err = err1 || err2;
    const okT = (lt > Le(6) - .3 && lt < L(8) + .3) || lt > L(8) + 3.6;
    const shake = err ? Math.max(0, 1 - (lt - (err1 ? L(4) : L(8) + .3)) / 1.5) : 0;
    tf(Min, Math.sin(at * 55) * 4 * shake + (run ? Math.sin(at * 30) * 1.2 : 0), 0);
    const spin = run ? at * 220 : 0;
    tf(pg, 1300, 600, spin); tf(g1, 1404, 528, spin * .8); tf(g2, 1440, 600, -spin * 1.2);
    tf(arm, 1400, 418, run ? 26 * Math.abs(Math.sin(at * 7)) : 24);
    belt.setAttribute('stroke-dashoffset', f2(okT || run ? -at * 60 : 0));
    const lc = err ? '#FF4D4D' : okT ? '#4ADE80' : run ? (Math.sin(at * 10) > 0 ? '#FFD166' : '#B88A1C') : '#6B7280';
    lamp.setAttribute('fill', lc); lampGlow.setAttribute('fill', lc); lampGlow.setAttribute('fill-opacity', lc === '#6B7280' ? 0 : f2(.3 + .15 * Math.sin(at * 6)));
    alarm.anim(at, err);
    /* fum */
    smoke.forEach((s, i) => { const t0 = L(4), on = lt > t0 && lt < t0 + 4.5; const p = ((lt - t0) * .7 + i / 7) % 1;
      if (!on) { op(s, 0); return; } s.setAttribute('cx', f2(1139 + Math.sin(p * 6 + i) * 14 + p * 30)); s.setAttribute('cy', f2(356 - p * 170)); s.setAttribute('r', f2(12 + p * 30)); op(s, .7 * Math.sin(Math.PI * p) * (1 - prog(lt, t0 + 3.5, 1))); });
    /* foi în pâlnie */
    hopperPages.forEach((n, i) => { const t0 = L(3) + .2 + i * .35, p = prog(lt, t0, .9, t => t); const q = arcPos(p, [520, 330], [1257, 410], 160);
      op(n, p > 0 && p < 1 ? 1 : 0); tf(n, q[0], q[1], p * 200, lerp(1, .5, p)); });
    /* benzi de hârtie */
    tapes.forEach(tp => { const grow = prog(lt, tp.at, 1.2, easeOut), fall = prog(lt, tp.off, .9, easeIn);
      const h = tp.H * grow; tp.r.setAttribute('height', f2(h));
      let d = `M1118,${514 + h}`; for (let k = 0; k < 8; k++) d += ` L${1118 + (k + .5) * 18.5},${514 + h + 7} L${1118 + (k + 1) * 18.5},${514 + h}`; tp.zig.setAttribute('d', d + ' Z');
      tp.tx.forEach((t, i) => op(t, h > 30 + i * 22 ? 1 : 0));
      op(tp.g, grow > 0 ? 1 - fall : 0); tf(tp.g, -fall * 40, fall * 220, 0); });
    /* șurubul */
    const bp = prog(lt, L(8) + .35, .8, t => t); const bq = arcPos(bp, [1100, 600], [930, 712], 120);
    op(bolt, lt > L(8) + .35 && lt < L(8) + 4 ? 1 - prog(lt, L(8) + 3.4, .5) : 0); tf(bolt, bq[0], bq[1], bp * 720);
    /* cutia cu aplicația */
    const bx = prog(lt, Le(6) - .2, 1.6, easeOut);
    op(box, bx > 0 ? 1 : 0); tf(box, lerp(1380, 1520, bx), 680, 0, pop(lt, Le(6) - .2, .6));
    op(boxCk, pop(lt, Le(6) + 1.0, .5)); tf(boxCk, 34, -56, 0, Math.max(.01, pop(lt, Le(6) + 1.0, .5)));
    /* maneta */
    const pulls = [L(3) + .5, Le(6) - 2.0, L(8) + 2.2];
    let la = -12; pulls.forEach(t => { la += 72 * win(lt, t, t + .9, .3, .4); });
    if (lt > L(9)) la = -12 + 72 * Math.max(0, Math.sin((lt - L(9)) * 7));
    tf(lever, 1011, 552, la);

    /* --- dosarul și fișierele --- */
    const fp = pop(lt, L(0) + .3, .6), fgo = prog(lt, L(0) + 3.2, .9);
    op(fold, fp * (1 - fgo)); tf(fold, lerp(470, 160, fgo), lerp(330, 196, fgo), 0, Math.max(.01, fp * lerp(1, .12, fgo)));
    flyFiles.forEach((n, i) => { const t0 = L(0) + 1.2 + i * .45, p = prog(lt, t0, 1.0); const q = arcPos(p, [470, 330], [190, 240 + i * 30], 90);
      op(n, p > 0 && p < 1 ? 1 : 0); tf(n, q[0], q[1], (1 - p) * 30, lerp(1, .3, p)); });
    fileN.forEach(f => { op(f.n, prog(lt, f.at, .4)); f.t.setAttribute('fill', (f.t.textContent === 'Info.plist' && lt > L(8) + 1 && lt < L(8) + 3.6) ? '#FFD166' : '#C9D1E6'); });
    /* --- codul --- */
    const onB = lt >= L(2) - .1;
    op(code1, onB ? 0 : 1); op(code2, onB ? 1 : 0);
    tabs[0].bgT.setAttribute('fill', onB ? '#191F33' : '#0F1424'); tabs[1].bgT.setAttribute('fill', onB ? '#0F1424' : '#191F33'); op(tabs[1].t, prog(lt, L(2) - .2, .3));
    op(tabs[0].t, prog(lt, L(1), .3));
    code1.type(Math.floor(clamp((lt - L(1) - .3) / (Le(1) - L(1) - .8)) * code1.total), lt < Le(1));
    const n2 = Math.floor(clamp((lt - L(2)) / (Le(2) - L(2) - .3)) * (bA.total + bB.total));
    bA.type(Math.min(n2, bA.total), n2 < bA.total); bB.type(n2 - bA.total, n2 >= bA.total && lt < Le(2));
    const shI = prog(lt, L(6) + .2, .6); tf(bBw, 0, 3 * LH * shI); op(ins, shI);
    bI.type(Math.floor(clamp((lt - L(6) - .7) / 1.8) * bI.total), lt < L(6) + 2.6);
    insHl.setAttribute('fill-opacity', f2(.16 * (1 - prog(lt, Le(6) + 1, 1))));
    op(errL, lt > L(4) + .6 && lt < L(6) + .3 ? (.7 + .3 * Math.sin(at * 6)) : 0);

    /* --- agentul --- */
    const XK = [[0, 880], [L(3) + .1, 880], [L(3) + .5, 930], [L(5), 930], [L(5) + .9, 1000], [L(6) - .1, 1000], [L(6) + .6, 880], [Le(6) - 2.4, 880], [Le(6) - 2.1, 930],
      [L(8) + .6, 930], [L(8) + 1.3, 1000], [L(8) + 2.0, 1000], [L(8) + 2.3, 930], [L(9), 930]];
    const x = keyed(lt, XK, t => t), x2 = keyed(lt + .06, XK, t => t), moving = Math.abs(x2 - x) > .3;
    const wc = walkCycle(x / 14, 18, 14);
    const st = { x, y: 720, s: S, at, face: 'neutral', look: [0, 0], bob: Math.sin(at * 2.4) * 2 };
    const typing = (k = 1) => { const a = [toL(720 + Math.sin(at * 21) * 7, 634 - Math.abs(Math.sin(at * 17)) * 12 * k, x), toL(796 + Math.sin(at * 19 + 1) * 7, 634 - Math.abs(Math.sin(at * 15 + 2)) * 12 * k, x)];
      return { hL: a[0], hR: a[1], bendR: 30, face: 'focus', look: [-1, .4], headTilt: -4 }; };
    const leverHand = () => { const k = knob(la); return { hR: toL(k[0], k[1], x), hL: [-64, -96], look: [1, -.3] }; };
    let showMag = false, showWr = false;
    if (lt < L(1)) Object.assign(st, { hL: toL(lerp(780, 600, prog(lt, L(0) + .3, .6)), 420 + Math.sin(at * 3) * 10, x), face: 'happy', look: [-1, -.3] });
    else if (lt < Le(2) + .3) Object.assign(st, typing());
    else if (lt < L(4)) Object.assign(st, leverHand(), { face: lt > L(3) + 1.6 ? 'happy' : 'focus' });
    else if (lt < L(5)) { const j = Math.max(0, 1 - (lt - L(4)) / .6); Object.assign(st, { face: 'surprise', hL: [-90, -270 + Math.sin(at * 9) * 8], hR: [90, -270 + Math.sin(at * 9 + 1) * 8], look: [1, -.2], bob: -40 * Math.sin(Math.PI * clamp((lt - L(4)) / .5)) }); }
    else if (lt < L(6)) { showMag = !moving; Object.assign(st, { face: cue.talk(lt, 'A') ? 'think' : 'focus', talk: cue.talk(lt, 'A'), hR: moving ? [70, -100] : toL(1180 + Math.sin(at * 1.5) * 6, 580 + Math.sin(at * 1.1) * 14, x), hL: [-60, -112], look: [1, .4], headTilt: 6 }); }
    else if (lt < Le(6) - 2.2) Object.assign(st, typing());
    else if (lt < L(7)) Object.assign(st, leverHand(), { face: lt > Le(6) - .3 ? 'joy' : 'focus' });
    else if (lt < L(8)) Object.assign(st, { face: 'proud', hR: [84, -250 + Math.sin(at * 4) * 6], rotR: -30, hL: [-66, -96], look: [-.6, -1] });
    else if (lt < L(8) + .8) Object.assign(st, { face: 'surprise', hL: [-70, -230], hR: [70, -230], look: [1, 0] });
    else if (lt < L(8) + 2.0) { showWr = !moving; Object.assign(st, { face: 'focus', hR: moving ? [70, -100] : toL(1104, 598, x), propRotR: showWr ? Math.sin(at * 9) * 50 : 0, hL: [-60, -110], look: [1, .3] }); }
    else if (lt < L(9)) Object.assign(st, leverHand(), { face: lt > L(8) + 3.7 ? 'joy' : 'focus' });
    else { const ph = Math.floor((lt - L(9)) / .35) % 3; const ff = ph === 0 ? typing(1.6) : ph === 1 ? leverHand() : { hL: [-70, -250], hR: [70, -250], face: 'joy' };
      Object.assign(st, ff, { bob: Math.sin(at * 18) * 4 }); if (ph === 0) st.face = 'focus'; }
    if (moving) Object.assign(st, { fL: wc.fL, fR: wc.fR, bob: wc.bob });
    bot.set(st);
    op(mag, showMag ? 1 : 0); op(wr, showWr ? 1 : 0);
    /* exclamare */
    const ex = pop(lt, L(4) + .1, .4) * (1 - prog(lt, L(4) + 2.2, .4));
    op(exc, ex); tf(exc, x + 40, 360 + Math.sin(at * 8) * 4, 0, Math.max(.01, ex));
    /* --- bucla și ceasul --- */
    const lv = prog(lt, L(3) + .3, .6) * (1 - prog(lt, L(9) - .2, .5));
    op(loop, lv); const big = 1 + .22 * win(lt, L(7) - .2, Le(7), .5, .5);
    tf(loop, LC[0], LC[1], 0, big);
    const k = keyed(lt, LK); const a = (-90 + 120 * k) * Math.PI / 180;
    ldot.setAttribute('cx', f2(LR * Math.cos(a))); ldot.setAttribute('cy', f2(LR * Math.sin(a)));
    const kr = Math.round(k), act = ((kr % 3) + 3) % 3, cl = 1 - clamp(Math.abs(k - kr) * 2.5);
    lnodes.forEach((nd, i) => { const h = i === act ? cl : 0; nd.cc.setAttribute('fill', h > 0 ? mix('#1B2238', nd.c, .35 * h) : '#1B2238'); tf(nd.n, nd.px, nd.py, 0, 1 + .12 * h); });
    round.textContent = 'round ' + (Math.floor(k / 3 + .001) + 1);
    const cv = prog(lt, L(9) - .1, .6);
    op(clock, cv); tf(clock, LC[0], LC[1], 0, Math.max(.01, pop(lt, L(9) - .1, .6)));
    clock.anim(lt < L(9) ? at : 40000 + (lt - L(9)) * 2200);
    op(chip, prog(lt, L(9) + .8, .6));
    /* zi / noapte */
    const tv = prog(lt, L(9), .8);
    const ph = (lt - L(9)) * 1.6 * Math.PI / 2;
    const day = .5 + .5 * Math.cos(ph);
    op(tl, tv); op(tlBars, tv);
    tlSky.setAttribute('fill', mix('#0B1030', '#8FD3FF', day));
    const sa = ph % (Math.PI * 2);
    tlSun.setAttribute('cx', f2(WIN[0] + WIN[2] / 2 + Math.sin(sa) * 150)); tlSun.setAttribute('cy', f2(WIN[1] + WIN[3] - 20 - Math.cos(sa) * 170)); op(tlSun, day);
    tlMoon.setAttribute('cx', f2(WIN[0] + WIN[2] / 2 - Math.sin(sa) * 150)); tlMoon.setAttribute('cy', f2(WIN[1] + WIN[3] - 20 + Math.cos(sa) * 170)); op(tlMoon, 1 - day);
    tlCity.setAttribute('fill-opacity', 1);
  };
} });
