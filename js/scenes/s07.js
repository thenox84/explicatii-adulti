"use strict";
/* SCENA 7 — Verificarea: simulator, captură, reparație, teste, Verificatorul și „gândacul” */
SCENE(7, { build(world, cue) {
  const L = i => cue(i), Le = i => cue.e(i);
  const cam = G(world);
  const bg = bgWorkshop(cam, { windows: [[640, 56, 330, 214]], pegboard: false, shelves: [[-170, 470, 240]], clock: false, lamps: [400, 830, 1300] });

  /* ---------- iPhone-ul de test pe stativ ---------- */
  const PX = 250, PY = 104, PS = .85;
  const stand = G(cam);
  E('path', { d: 'M377,650 L318,722 M377,650 L436,722 M377,650 L377,722', stroke: '#2B3047', 'stroke-width': 9, 'stroke-linecap': 'round' }, stand);
  E('rect', { x: 366, y: 630, width: 22, height: 40, rx: 6, fill: '#3E4A66' }, stand);
  E('rect', { x: 300, y: 640, width: 154, height: 18, rx: 8, fill: '#5F6F94' }, stand);
  const plaque = G(stand); tf(plaque, 377, 700);
  E('rect', { x: -70, y: -16, width: 140, height: 28, rx: 8, fill: '#C9A227' }, plaque); TX(plaque, 0, 4, 'TEST iPHONE', 14, '#3A2A08', { a: 'middle', w: 800, ls: 1 });
  const pw = G(cam); tf(pw, PX, PY);
  const ph = phone(pw, PS); const app = appUI(ph.screen);
  const off = E('rect', { x: 0, y: 0, width: 300, height: 620, fill: '#000' }, ph.screen);
  const flashS = E('rect', { x: 0, y: 0, width: 300, height: 620, fill: '#fff' }, ph.screen);
  const W = (sx, sy) => [PX + sx * PS, PY + sy * PS];
  /* cercuri roșii + etichete */
  const mk = (sx, sy, rx, ry, label, lx, ly) => { const g = G(cam); const [cx, cy] = W(sx, sy);
    E('ellipse', { cx, cy, rx, ry, fill: 'none', stroke: C.red, 'stroke-width': 6 }, g);
    const p = G(g); tf(p, lx, ly); const w = label.length * 12 + 34;
    E('rect', { x: -w / 2, y: -20, width: w, height: 38, rx: 19, fill: C.red }, p); TX(p, 0, 7, label, 21, '#fff', { a: 'middle', w: 800 }); return g; };
  const mBtn = mk(236, 507, 74, 38, 'cut off!', 452, 470);
  const mTit = mk(62, 82, 66, 24, 'too small!', 430, 222);
  /* ---------- eticheta „simulator” ---------- */
  const chip = G(cam); tf(chip, 760, 316);
  E('rect', { x: -205, y: -26, width: 410, height: 50, rx: 25, fill: '#14121F', 'fill-opacity': .85, stroke: C.gold, 'stroke-width': 2 }, chip);
  TX(chip, 0, 8, 'experts call it: a simulator', 23, '#FFE7A8', { a: 'middle', w: 800 });

  /* ---------- biroul agentului ---------- */
  const desk = G(cam);
  E('rect', { x: 878, y: 628, width: 16, height: 94, fill: '#5A3B2B' }, desk); E('rect', { x: 1100, y: 628, width: 16, height: 94, fill: '#5A3B2B' }, desk);
  E('rect', { x: 860, y: 610, width: 274, height: 24, rx: 6, fill: '#8A5A3B' }, desk); E('rect', { x: 860, y: 610, width: 274, height: 7, rx: 3, fill: '#A9744F' }, desk);
  const run = G(desk); tf(run, 908, 604);
  E('rect', { x: -30, y: -6, width: 60, height: 12, rx: 4, fill: '#3E4A66' }, run);
  const runB = E('ellipse', { cx: 0, cy: -10, rx: 22, ry: 12, fill: '#E84855' }, run);
  TX(run, 0, -28, 'RUN TESTS', 13, '#FFE7A8', { a: 'middle', w: 800 });
  /* fotografii (polaroid) */
  const photos = [1, 0].map(b => { const g = G(cam);
    E('rect', { x: -52, y: -82, width: 104, height: 168, rx: 4, fill: '#000', 'fill-opacity': .2, transform: 'translate(4,5)' }, g);
    E('rect', { x: -52, y: -82, width: 104, height: 168, rx: 4, fill: '#FFFDF7' }, g);
    const sc = G(g, { transform: 'translate(-39,-72) scale(.26)' }); const cl = G(sc, { 'clip-path': clipRect(0, 0, 300, 620) });
    appUI(cl).set({ bug: b });
    if (!b) { const ck = G(g); tf(ck, 38, -70); E('circle', { r: 20, fill: C.green }, ck); icon(ck, 'check', 24, '#fff', 5); }
    else { const q = G(g); tf(q, 38, -70); E('circle', { r: 20, fill: C.red }, q); TX(q, 0, 9, '?', 26, '#fff', { a: 'middle', w: 900 }); }
    return g; });
  const burst = G(cam); for (let i = 0; i < 8; i++) E('path', { d: 'M0,-26 L6,-60 L-6,-60 Z', fill: '#FFF6C9', transform: `rotate(${i * 45})` }, burst);
  E('circle', { r: 22, fill: '#FFFDF0' }, burst);

  /* ---------- panoul de teste ---------- */
  const rack = G(cam); tf(rack, 1180, 100);
  E('rect', { x: 0, y: 0, width: 350, height: 318, rx: 18, fill: '#22263A', stroke: '#5F6F94', 'stroke-width': 4 }, rack);
  E('rect', { x: 0, y: 0, width: 350, height: 50, rx: 18, fill: '#2F3550' }, rack); E('rect', { x: 0, y: 30, width: 350, height: 20, fill: '#2F3550' }, rack);
  TX(rack, 175, 34, 'AUTOMATIC TESTS', 20, '#FFE7A8', { a: 'middle', w: 800, ls: 1.5 });
  const TT = ['Add a recipe', "Search 'sar'", 'Mark a favourite', 'Shopping list', 'Add a photo'];
  const rows = TT.map((t, i) => { const n = G(rack); tf(n, 26, 88 + i * 45);
    const ring = E('circle', { cx: 16, cy: -6, r: 15, fill: 'none', stroke: '#FFD166', 'stroke-width': 4, 'stroke-dasharray': '22 80', 'stroke-linecap': 'round' }, n);
    const dot = E('circle', { cx: 16, cy: -6, r: 15, fill: '#4B5168' }, n);
    const ok = G(n); tf(ok, 16, -6); E('circle', { r: 16, fill: C.green }, ok); icon(ok, 'check', 20, '#fff', 5);
    TX(n, 46, 2, t, 21, '#E8ECF6', { w: 600 }); return { ring, dot, ok }; });
  const passed = TX(rack, 175, 302, '5 / 5 passed', 20, '#7CFFB2', { a: 'middle', w: 800 });

  /* ---------- biroul Verificatorului ---------- */
  const cdesk = G(cam);
  E('rect', { x: 1240, y: 636, width: 16, height: 86, fill: '#4A3B6A' }, cdesk); E('rect', { x: 1466, y: 636, width: 16, height: 86, fill: '#4A3B6A' }, cdesk);
  E('rect', { x: 1220, y: 618, width: 282, height: 24, rx: 6, fill: '#7A5BA8' }, cdesk); E('rect', { x: 1220, y: 618, width: 282, height: 7, rx: 3, fill: '#9C7BD0' }, cdesk);
  const glints = [0, 1, 2].map(i => { const s = sparkle(cdesk, '#FFF6C9', 12); return s; });
  const cTag = G(cdesk); tf(cTag, 1462, 566); TX(cTag, 0, 0, 'its own\nclean desk', 18, '#E9DDFF', { a: 'middle', w: 700, it: true });

  /* ---------- personaje ---------- */
  const bot = Robot(cam, { hat: 'hard', color: '#F2994A', seed: 1 });
  const S = .95; const toL = (wx, wy, rx) => [(wx - rx) / S, (wy - 720) / S];
  const camP = cameraProp(bot.propL, .8);
  const magP = magnifier(bot.propL, .7);
  const chk = Robot(cam, { color: '#9B5DE5', badge: true, seed: 5, scale: .75 });
  const CS = .75; const toLc = (wx, wy, rx) => [(wx - rx) / CS, (wy - 720) / CS];
  const cMag = magnifier(chk.propL, .6);
  /* gândacul + borcanul */
  const bug = G(cam); const bugIn = bugProp(bug, .55);
  const jar = G(cam);
  E('path', { d: 'M-40,-70 H40 V-6 Q40,6 28,6 H-28 Q-40,6 -40,-6 Z', fill: '#BFEFFF', 'fill-opacity': .28, stroke: '#E8F7FF', 'stroke-width': 4 }, jar);
  E('rect', { x: -44, y: -82, width: 88, height: 16, rx: 5, fill: '#C9A227' }, jar);
  E('path', { d: 'M-26,-58 V-14', stroke: '#fff', 'stroke-opacity': .6, 'stroke-width': 6, 'stroke-linecap': 'round' }, jar);
  /* insignă „salvat” lângă telefon */
  const saved = G(cam); tf(saved, 700, 330);
  E('rect', { x: -150, y: -24, width: 300, height: 46, rx: 23, fill: C.green }, saved); TX(saved, 0, 8, 'favourites saved ✓', 21, '#fff', { a: 'middle', w: 800 });
  const closed = G(cam); tf(closed, ...W(150, 300)); TX(closed, 0, 0, 'app closed…', 22, '#C9CFDE', { a: 'middle', w: 700 });
  const hi5 = G(cam); for (let i = 0; i < 10; i++) { const s = sparkle(hi5, i % 2 ? '#FFE066' : '#7CFFB2', 14); s._a = i * 36; }
  const exc = G(cam); E('circle', { r: 24, fill: '#fff' }, exc); TX(exc, 0, 11, '!', 34, C.red, { a: 'middle', w: 900 });

  return (lt, at) => {
    bg.anim(at); bugIn.anim(at);
    camera(cam, lt, [[0, 800, 450, 1], [L(1) - .2, 800, 450, 1], [L(1) + 1, 560, 400, 1.15], [L(2) - .3, 560, 400, 1.15], [L(2) + .6, 700, 420, 1.1], [Le(2), 700, 420, 1.1],
      [L(3) + .4, 480, 400, 1.3], [Le(3) + .2, 480, 400, 1.3], [L(4) + 1, 700, 420, 1.08], [L(5) - .2, 700, 420, 1.08], [L(5) + .8, 900, 420, 1.0], [Le(5), 900, 420, 1.0],
      [L(6) + .8, 1120, 450, 1.1], [Le(6), 1120, 450, 1.1], [L(7) - .1, 820, 450, 1.0], [Le(7), 820, 450, 1.0], [L(8) + 1, 980, 430, 1.06], [cue.d, 1000, 420, 1.1]]);

    /* ---------- aplicația ---------- */
    const t0 = L(5) + .8; // pornește testele
    const tIdx = Math.floor((lt - t0) / 1.0);
    const st = { bug: 1 - prog(lt, L(4) + .3, 1.5), tab: 0 };
    if (lt > t0 && lt < t0 + 5) {
      if (tIdx === 0) st.tap = { x: 150, y: 507, o: win(lt, t0, t0 + .8, .2, .3) };
      if (tIdx === 1) { st.q = 'sar'.slice(0, Math.floor(clamp((lt - t0 - 1) / .5) * 3)); st.fp = prog(lt, t0 + 1.5, .3); }
      if (tIdx === 2) st.tap = { x: 258, y: 191, o: win(lt, t0 + 2, t0 + 2.8, .2, .3) };
      if (tIdx === 3) { st.shop = prog(lt, t0 + 3, .3); st.checked = Math.floor(clamp((lt - t0 - 3.2) / .6) * 3); }
      if (tIdx === 4) st.tap = { x: 52, y: 191, o: win(lt, t0 + 4, t0 + 4.8, .2, .3) };
    }
    const favOn = lt > t0 + 2.3 && !(lt > L(7) + .5 && lt < L(8) + 1.2);
    st.fav = favOn ? (lt < t0 + 3 ? prog(lt, t0 + 2.3, .5) : 1) : 0;
    if (lt > L(8) + 1.2) st.fav = 1;
    app.set(st);
    const offV = win(lt, L(7) + .1, L(7) + .7, .15, .2) + win(lt, L(8) + .9, L(8) + 1.4, .15, .2);
    op(off, Math.min(1, offV)); op(closed, Math.min(1, win(lt, L(7) + .15, L(7) + .65, .1, .1)));
    const fl = Math.max(clamp(1 - Math.abs(lt - (L(2) + .7)) / .25), clamp(1 - Math.abs(lt - (L(4) + 2.6)) / .25));
    op(flashS, fl * .9);
    op(mBtn, prog(lt, L(3) + .3, .4) * (1 - prog(lt, L(4) + .5, .4)));
    op(mTit, prog(lt, L(3) + 2.0, .4) * (1 - prog(lt, L(4) + .5, .4)));
    op(chip, win(lt, L(1) + 3, Le(1) + .3, .5, .5));
    op(saved, pop(lt, L(8) + 1.6, .5) * 1); tf(saved, 700, 330, 0, Math.max(.01, pop(lt, L(8) + 1.6, .5)));

    /* ---------- panoul de teste ---------- */
    op(rack, prog(lt, L(5) - .4, .6)); tf(rack, 1180, 100 - 30 * (1 - prog(lt, L(5) - .4, .6)));
    rows.forEach((r, i) => { const ti = t0 + i * 1.0, done = lt > ti + .85;
      op(r.ring, lt > ti && !done ? 1 : 0); r.ring.setAttribute('transform', `rotate(${f2((at * 420) % 360)} 16 -6)`);
      op(r.dot, done ? 0 : 1); op(r.ok, done ? 1 : 0); tf(r.ok, 16, -6, 0, done ? Math.max(.01, pop(lt, ti + .85, .4)) : .01); });
    op(passed, prog(lt, t0 + 5, .4));
    runB.setAttribute('fill', win(lt, L(5) + .4, L(5) + .9, .1, .2) > .1 ? '#B83240' : '#E84855');

    /* ---------- fotografii ---------- */
    /* ---------- agentul ---------- */
    const XK = [[0, 760], [L(3), 760], [L(3) + .7, 660], [L(4) + 1.5, 660], [L(4) + 2.1, 760], [L(5) - .2, 760], [L(5) + .4, 790], [L(6) + .4, 790], [L(6) + 1.2, 900], [L(8) + 1.8, 900], [L(8) + 2.6, 1080], [cue.d, 1080]];
    const bx = keyed(lt, XK, t => t), moving = Math.abs(keyed(lt + .06, XK, t => t) - bx) > .3;
    const wc = walkCycle(bx / 14, 18, 14);
    const b = { x: bx, y: 720, s: S, at, face: 'neutral', bob: Math.sin(at * 2.4) * 2 };
    let hl = [-66, -96]; let showCam = false, showMag = false;
    if (lt < L(1)) Object.assign(b, { face: 'neutral', look: [-1, -.2], hL: [-40, -112], hR: [40, -112], bendL: -30, bendR: 30, headTilt: -4 });
    else if (lt < L(2)) Object.assign(b, { face: 'happy', look: [-1, -.3], hL: [-150 + Math.sin(at * 2) * 6, -230 + Math.sin(at * 3) * 6], hR: [60, -110] });
    else if (lt < L(3)) { showCam = true; hl = [-108, -228]; Object.assign(b, { face: lt > L(2) + 2.2 ? 'happy' : 'focus', look: lt > L(2) + 2.2 ? [1, .6] : [-1, 0], hL: hl, hR: [-60, -200], bendR: 20 }); }
    else if (lt < L(4)) { showMag = !moving; hl = moving ? [-66, -96] : toL(468 + Math.sin(at * 1.4) * 8, 536 + Math.sin(at * 1.1) * 8, bx);
      Object.assign(b, { face: cue.talk(lt, 'A') ? 'focus' : 'think', talk: cue.talk(lt, 'A'), look: [-1, lt > L(3) + 2 ? -1 : .2], hL: hl, hR: lt > L(3) + 2 ? [-30, -330] : [60, -110], headTilt: lt > L(3) + 2 ? -8 : 4 }); }
    else if (lt < L(4) + 1.6) { const tw = Math.sin(at * 14) * 10; Object.assign(b, { face: 'focus', look: [-1, -.2], hL: [-130 + tw, -230], hR: [-90, -240 - tw], bendR: 30 }); }
    else if (lt < L(5)) { showCam = !moving; hl = [-108, -228]; Object.assign(b, { face: lt > L(4) + 3.5 ? 'proud' : 'focus', hL: moving ? [-66, -96] : hl, hR: moving ? [66, -96] : [-60, -200], look: lt > L(4) + 3.5 ? [1, .6] : [-1, 0] }); }
    else if (lt < L(6)) { const press = win(lt, L(5) + .3, L(5) + .9, .15, .2);
      Object.assign(b, { face: lt > t0 + 5 ? 'joy' : 'happy', look: [1, -.8], hR: moving ? [66, -96] : toL(908, 590 - 20 * (1 - press) - 10, bx), hL: lt > t0 + 5 ? [-80, -270 + Math.sin(at * 8) * 10] : [-66, -96] }); }
    else if (lt < L(8) + 1.8) Object.assign(b, { face: lt > L(7) && lt < L(8) ? 'surprise' : 'happy', look: lt < L(7) ? [1, 0] : lt < L(8) ? [-1, .4] : [1, 0], hR: lt < L(6) + 2 ? [96, -230 + Math.sin(at * 9) * 14] : [66, -96], hL: [-66, -96] });
    else { const h5 = win(lt, L(8) + 2.6, L(8) + 3.8, .3, .4); Object.assign(b, { face: 'joy', look: [1, -.6], hR: [lerp(66, 58, h5), lerp(-96, -305, h5)], hL: [-66, -100] }); }
    if (moving) Object.assign(b, { fL: wc.fL, fR: wc.fR, bob: wc.bob });
    bot.set(b);
    op(camP, showCam ? 1 : 0); op(magP, showMag ? 1 : 0);
    /* flash + fotografii */
    const camW = [bx + hl[0] * S, 720 + hl[1] * S];
    op(burst, fl); tf(burst, camW[0] - 10, camW[1] - 10, at * 90, .6 + fl * .6);
    [[L(2) + .9, [1040, 560], -8], [L(4) + 2.8, [1086, 552], 6]].forEach(([tp, dst, rot], i) => { const p = prog(lt, tp, 1.2); const q = arcPos(p, [camW[0], camW[1] + 20], dst, 150);
      const vis2 = lt > tp ? 1 : 0; op(photos[i], vis2); tf(photos[i], p < 1 ? q[0] : dst[0], p < 1 ? q[1] : dst[1], lerp(-30, rot, p) + (p < 1 ? Math.sin(p * 9) * 10 : 0), lerp(.3, .62, p)); });

    /* ---------- Verificatorul ---------- */
    const CK = [[0, 1760], [L(6) + .2, 1760], [L(6) + 2.6, 1360], [L(7) + .9, 1360], [L(7) + 2.0, 1262], [L(8) + .1, 1262], [L(8) + 1.0, 1300], [L(8) + 2.0, 1300], [L(8) + 2.6, 1190], [cue.d, 1190]];
    const cx = keyed(lt, CK, t => t), cmov = Math.abs(keyed(lt + .06, CK, t => t) - cx) > .3; const cw = walkCycle(cx / 12, 18, 14);
    const c = { x: cx, y: 720, s: CS, at, face: 'happy', look: [-1, 0], bob: Math.sin(at * 2.6 + 1) * 2 };
    let cShowMag = false;
    if (lt < L(7)) { cShowMag = lt > L(6) + 2.8; Object.assign(c, { face: 'focus', hL: cShowMag ? [-110 + Math.sin(at * 1.3) * 10, -150 + Math.sin(at * 1.7) * 10] : [-66, -96], look: [-1, .2] }); }
    else if (lt < L(8)) { const catchP = prog(lt, L(7) + 2.0, .5);
      Object.assign(c, { face: lt < L(7) + 1.0 ? 'surprise' : 'joy', talk: cue.talk(lt, 'K'), look: [-1, .7], tilt: -8 * catchP, hR: [-40, -80 + 40 * catchP], hL: [-90, -110 + 70 * catchP] }); }
    else Object.assign(c, { face: 'joy', look: [-1, -.4], hL: lt > L(8) + 2.4 ? [lerp(-66, -73, win(lt, L(8) + 2.6, L(8) + 3.8, .3, .4)), lerp(-96, -387, win(lt, L(8) + 2.6, L(8) + 3.8, .3, .4))] : [-66, -96], hR: lt < L(8) + 1.4 ? [-30, -150] : [66, -96] });
    if (cmov) Object.assign(c, { fL: cw.fL, fR: cw.fR, bob: cw.bob });
    chk.set(c);
    op(cMag, cShowMag && !cmov ? 1 : 0);
    op(cdesk, prog(lt, L(6) + 1.0, .6)); tf(cdesk, 0, 30 * (1 - prog(lt, L(6) + 1.0, .6)));
    glints.forEach((g, i) => { const ph2 = (at * .8 + i / 3) % 1; tf(g, 1260 + i * 90, 600 - ph2 * 30, at * 90, Math.sin(ph2 * Math.PI) * .9 + .05); });
    op(cTag, win(lt, L(6) + 1.6, L(7) + .2, .5, .5));

    /* ---------- gândacul ---------- */
    const BK = [[L(7) + .8, [395, 600]], [L(7) + 1.4, [395, 702]], [L(7) + 2.4, [1196, 708]]];
    const bp = keyed(lt, BK, t => t), bp2 = keyed(lt + .05, BK, t => t);
    const caught = lt > L(7) + 2.4;
    const jarAt = lt < L(7) + 2.0 ? [cx - 60, 640] : lt < L(8) + .6 ? [1196, 712] : arcPos(prog(lt, L(8) + .6, .9), [1196, 712], [1330, 618], 90);
    const bugAt = caught ? [jarAt[0], jarAt[1] - 30] : bp;
    op(bug, lt > L(7) + .8 ? 1 : 0);
    const ang = caught ? Math.sin(at * 12) * 15 : Math.atan2(bp2[1] - bp[1], bp2[0] - bp[0]) * 180 / Math.PI + 90;
    tf(bug, bugAt[0], bugAt[1], ang, 1);
    op(jar, lt > L(7) + .9 ? prog(lt, L(7) + .9, .4) : 0);
    tf(jar, jarAt[0], jarAt[1] + (lt > L(7) + 2.0 && lt < L(7) + 2.4 ? -40 * (1 - prog(lt, L(7) + 2.0, .4)) : 0));
    const ex = pop(lt, L(7) + .7, .4) * (1 - prog(lt, L(7) + 2.6, .4));
    op(exc, ex); tf(exc, cx - 10, 720 - 330 * CS - 40 + Math.sin(at * 8) * 4, 0, Math.max(.01, ex));
    /* high five */
    const h5 = clamp(1 - Math.abs(lt - (L(8) + 3.3)) / .5);
    hi5.childNodes.forEach((s, i) => { const r = 30 + 70 * prog(lt, L(8) + 3.1, .6); const a = s._a * Math.PI / 180; tf(s, 1135 + Math.cos(a) * r, 430 + Math.sin(a) * r, at * 120, Math.max(.01, h5)); });
    op(hi5, h5);
  };
} });
