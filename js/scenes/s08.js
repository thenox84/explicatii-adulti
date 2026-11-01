"use strict";
/* SCENA 8 — Siguranță și control: agentul cere voie, omul decide */
SCENE(8, { build(world, cue) {
  const L = cue, Le = cue.e;
  /* ---------- ecran împărțit: două decupaje ---------- */
  const mkClip = () => { const id = uid('s08c'); const cp = E('clipPath', { id }, DEFS); const r = E('rect', { x: 0, y: 0, width: 800, height: 900 }, cp); return { url: `url(#${id})`, r }; };
  const cL = mkClip(), cR = mkClip();
  const left = G(world, { 'clip-path': cL.url }), right = G(world, { 'clip-path': cR.url });

  /* ================= STÂNGA: atelierul ================= */
  const camL = G(left);
  const bgW = G(camL); tf(bgW, -380, 0); const bgw = bgWorkshop(bgW);
  /* șina cu alte butoane încuiate (Publish, App Store, Pay) */
  const rail = G(camL);
  E('rect', { x: 60, y: 186, width: 690, height: 14, rx: 7, fill: '#5A4366' }, rail);
  const LOCKS = [['PUBLISH', '#4D96FF', 165], ['APP STORE', '#2EC4B6', 405], ['PAY', '#3BB273', 645]];
  const lockBoxes = LOCKS.map(([lab, col, x]) => {
    const b = G(rail); b._x = x; b._y = 200;
    E('rect', { x: -96, y: 0, width: 192, height: 136, rx: 16, fill: '#000', 'fill-opacity': .25, transform: 'translate(5,7)' }, b);
    E('rect', { x: -96, y: 0, width: 192, height: 136, rx: 16, fill: '#3A3F55' }, b);
    E('rect', { x: -84, y: 12, width: 168, height: 28, rx: 8, fill: '#2B2F45' }, b);
    TX(b, 0, 33, lab, 19, '#FFF6E5', { a: 'middle', w: 800, ls: 1 });
    E('circle', { cx: -40, cy: 82, r: 26, fill: shade(col, -.35) }, b); E('circle', { cx: -40, cy: 78, r: 22, fill: col }, b);
    E('ellipse', { cx: -46, cy: 70, rx: 8, ry: 5, fill: '#fff', 'fill-opacity': .45 }, b);
    const lk = G(b); tf(lk, 30, 84); const sh = E('path', { d: 'M-11,-8 V-20 A11,11 0 0 1 11,-20 V-8', stroke: '#C9CFDE', 'stroke-width': 6, fill: 'none' }, lk);
    E('rect', { x: -17, y: -10, width: 34, height: 30, rx: 6, fill: '#F7C948' }, lk); E('circle', { cy: 2, r: 4, fill: '#8A6A1E' }, lk); E('rect', { x: -2, y: 2, width: 4, height: 9, fill: '#8A6A1E' }, lk);
    const lamp = E('circle', { cx: 80, cy: 26, r: 7, fill: '#F7C948' }, b);
    const tag = G(b); tf(tag, 0, 168);
    E('rect', { x: -70, y: -22, width: 140, height: 34, rx: 17, fill: '#FFF1C9' }, tag);
    TX(tag, 0, 1, 'asks first', 18, '#7A4B10', { a: 'middle', w: 800 });
    const q = G(b); tf(q, 92, -6); E('circle', { r: 18, fill: '#fff' }, q); TX(q, 0, 8, '?', 24, '#E84855', { a: 'middle', w: 900 });
    return { b, lk, lamp, tag, q };
  });
  /* consola cu butonul DELETE */
  const con = G(camL); tf(con, 520, 716);
  E('ellipse', { cx: 0, cy: 2, rx: 100, ry: 14, fill: '#000', 'fill-opacity': .25 }, con);
  E('rect', { x: -84, y: -176, width: 168, height: 178, rx: 14, fill: '#5C6378' }, con);
  E('rect', { x: 30, y: -176, width: 54, height: 178, rx: 14, fill: '#000', 'fill-opacity': .14 }, con);
  const stripe = G(con, { 'clip-path': clipRect(-84, -170, 168, 22) });
  E('rect', { x: -84, y: -170, width: 168, height: 22, fill: '#F7C948' }, stripe);
  for (let i = 0; i < 9; i++) E('path', { d: `M${-100 + i * 26},-148 l14,-22 h12 l-14,22 z`, fill: '#2B2F45' }, stripe);
  E('rect', { x: -62, y: -126, width: 124, height: 46, rx: 9, fill: '#2B2F45' }, con);
  TX(con, 0, -95, 'DELETE', 26, '#FF8A8A', { a: 'middle', w: 900, ls: 2 });
  const conLight = E('circle', { cx: 0, cy: -46, r: 9, fill: '#F7C948' }, con);
  E('rect', { x: -96, y: -198, width: 192, height: 24, rx: 9, fill: '#7A8299' }, con);
  E('ellipse', { cx: 0, cy: -198, rx: 48, ry: 13, fill: '#2B2F45' }, con);
  const btn = G(con);
  E('path', { d: 'M-38,-200 Q-38,-244 0,-244 Q38,-244 38,-200 Z', fill: '#E84855' }, btn);
  E('path', { d: 'M-24,-226 Q-16,-238 -2,-238', stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, btn);
  const cover = G(con);
  E('path', { d: 'M-58,-198 Q-58,-274 0,-274 Q58,-274 58,-198 Z', fill: '#BFEFFF', 'fill-opacity': .28, stroke: '#E8F7FF', 'stroke-opacity': .75, 'stroke-width': 3 }, cover);
  E('path', { d: 'M-38,-226 Q-34,-258 -8,-264', stroke: '#fff', 'stroke-opacity': .6, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, cover);
  const pad = G(con); tf(pad, 0, -170);
  const padSh = E('path', { d: 'M-12,-8 V-22 A12,12 0 0 1 12,-22 V-8', stroke: '#C9CFDE', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, pad);
  E('rect', { x: -20, y: -10, width: 40, height: 34, rx: 7, fill: '#F7C948' }, pad); E('rect', { x: -20, y: -10, width: 40, height: 8, rx: 4, fill: '#FFE08A' }, pad);
  E('circle', { cy: 5, r: 4.5, fill: '#8A6A1E' }, pad); E('rect', { x: -2, y: 5, width: 4, height: 10, fill: '#8A6A1E' }, pad);
  /* dosarul vechi care va fi șters */
  const shelf = G(camL); tf(shelf, 700, 620);
  E('rect', { x: -70, y: 0, width: 140, height: 14, rx: 5, fill: '#8A5E34' }, shelf);
  E('rect', { x: -60, y: 14, width: 10, height: 82, fill: '#6B4A2B' }, shelf); E('rect', { x: 50, y: 14, width: 10, height: 82, fill: '#6B4A2B' }, shelf);
  const oldF = G(shelf); tf(oldF, 0, -46); folder(oldF, 120, 88, { label: 'Old tests', size: 17, color: '#C9B48A' });
  const poof = G(shelf); const puffs = [0, 1, 2, 3, 4].map(i => E('circle', { r: 20, fill: '#E7E2F0' }, poof));
  /* robotul (șeful de șantier) */
  const bot = Robot(camL, { hat: 'hard', color: '#F2994A', seed: 1 });
  const stopS = G(camL);
  E('path', { d: 'M-17,-41 L17,-41 L41,-17 L41,17 L17,41 L-17,41 L-41,17 L-41,-17 Z', fill: '#E84855', stroke: '#fff', 'stroke-width': 4 }, stopS);
  TX(stopS, 0, 9, 'STOP', 22, '#fff', { a: 'middle', w: 900 });
  const askNote = G(camL); tf(askNote, 400, 180);
  E('rect', { x: -170, y: -32, width: 340, height: 64, rx: 32, fill: '#14121F', 'fill-opacity': .78 }, askNote);
  TX(askNote, 0, 10, 'Important step → ask first', 26, '#FFE7A8', { a: 'middle', w: 800 });

  /* ================= DREAPTA: biroul lui Tudor ================= */
  const camR = G(right);
  E('rect', { x: -600, y: -300, width: 3200, height: 1000, fill: '#5B4A6E' }, camR);
  E('rect', { x: -600, y: 700, width: 3200, height: 600, fill: '#5A3B2B' }, camR);
  const bgO = G(camR); tf(bgO, -180, 0); const bgo = bgOffice(bgO, { clockX: 1530 });
  const chair = G(camR); tf(chair, 1250, 0);
  E('rect', { x: -84, y: 470, width: 168, height: 210, rx: 40, fill: '#7E2F3A' }, chair);
  E('rect', { x: -66, y: 488, width: 132, height: 170, rx: 30, fill: '#953A47' }, chair);
  const tudor = Human(camR, { seed: 4 });
  const gavel = G(tudor.propL);
  E('rect', { x: -4, y: -6, width: 8, height: 64, rx: 4, fill: '#8A5A2B' }, gavel);
  E('rect', { x: -26, y: -20, width: 52, height: 26, rx: 9, fill: '#6B3E1E' }, gavel); E('rect', { x: -26, y: -12, width: 52, height: 6, fill: '#C9A227' }, gavel);
  const idCard = G(tudor.propL); tf(idCard, 0, -40);
  E('rect', { x: -78, y: -50, width: 156, height: 100, rx: 12, fill: '#F7F9FD' }, idCard);
  E('rect', { x: -78, y: -50, width: 156, height: 26, rx: 12, fill: '#4D96FF' }, idCard); E('rect', { x: -78, y: -34, width: 156, height: 10, fill: '#4D96FF' }, idCard);
  TX(idCard, 0, -32, 'Apple Account', 15, '#fff', { a: 'middle', w: 800 });
  E('circle', { cx: -46, cy: 8, r: 16, fill: '#E8B98F' }, idCard); E('path', { d: 'M-66,40 Q-46,16 -26,40 Z', fill: '#34495E' }, idCard);
  TX(idCard, -18, 4, 'Tudor', 17, '#1E2235', { w: 800 });
  const dots = TX(idCard, -18, 32, '', 20, '#1E2235', { w: 900, ls: 2 });
  const signed = G(idCard); tf(signed, 56, 26); E('circle', { r: 15, fill: '#3BB273' }, signed); icon(signed, 'check', 18, '#fff', 5);
  const clip = G(tudor.propL); tf(clip, 0, -10); const cb = clipboard(clip, 110, 140);
  const myPh = G(tudor.propR); tf(myPh, -26, -96); const mp = phone(myPh, .17);
  const scrBg = E('rect', { x: 0, y: 0, width: 300, height: 620, fill: '#101626' }, mp.screen);
  TX(mp.screen, 150, 250, 'Installing', 30, '#fff', { a: 'middle', w: 700 });
  E('rect', { x: 50, y: 290, width: 200, height: 16, rx: 8, fill: '#2B3352' }, mp.screen);
  const bar = E('rect', { x: 50, y: 290, width: 0, height: 16, rx: 8, fill: '#3BB273' }, mp.screen);
  const appIc = G(mp.screen); tf(appIc, 150, 420); E('rect', { x: -60, y: -60, width: 120, height: 120, rx: 30, fill: '#E07A3F' }, appIc); E('path', { d: 'M-34,-6 H34 V18 Q34,34 18,34 H-18 Q-34,34 -34,18 Z', fill: '#fff' }, appIc); E('rect', { x: -40, y: -14, width: 80, height: 10, rx: 5, fill: '#fff' }, appIc); E('circle', { cx: 0, cy: -22, r: 6, fill: '#fff' }, appIc);
  const desk = G(camR); tf(desk, 1300, 640); officeDesk(desk, 640);
  const block = G(camR); tf(block, 1130, 640); E('ellipse', { cx: 0, cy: -4, rx: 34, ry: 9, fill: '#5A3420' }, block); E('rect', { x: -34, y: -18, width: 68, height: 14, fill: '#6B3E1E' }, block); E('ellipse', { cx: 0, cy: -18, rx: 34, ry: 9, fill: '#8A5A2B' }, block);
  const bang = G(camR); tf(bang, 1130, 600);
  for (let i = 0; i < 6; i++) { const a = -Math.PI * (i + .5) / 6; E('path', { d: `M${Math.cos(a) * 30},${Math.sin(a) * 30} L${Math.cos(a) * 58},${Math.sin(a) * 58}`, stroke: '#FFE066', 'stroke-width': 6, 'stroke-linecap': 'round' }, bang); }
  const lampD = G(camR); tf(lampD, 1040, 640); deskLamp(lampD);
  const lap = laptop(camR, { w: 250, h: 160 }); tf(lap, 1440, 640);
  const lapScr = lap.screen;
  const lsTop = E('rect', { x: 12, y: 12, width: 206, height: 18, rx: 4, fill: '#DCE6F7' }, lapScr);
  const lsAsk = G(lapScr); E('rect', { x: 40, y: 40, width: 150, height: 74, rx: 10, fill: '#FFF1C9' }, lsAsk); TX(lsAsk, 115, 84, '?', 34, '#E84855', { a: 'middle', w: 900 });
  const cable = E('path', { d: 'M1318,630 C1306,700 1240,692 1232,606', stroke: '#E8ECF4', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, camR);
  const cableL = 200;
  cable.setAttribute('stroke-dasharray', cableL + ' ' + cableL);
  /* robotul-hologramă care apare la final lângă Tudor */
  const holo = G(camR);
  const holoGlow = E('ellipse', { cx: 0, cy: -150, rx: 120, ry: 190, fill: rgrad([[0, '#9CC8FF', .55], [1, '#9CC8FF', 0]]) }, holo);
  const bot2 = Robot(holo, { hat: 'hard', color: '#F2994A', seed: 1 });
  const scan = G(holo); for (let i = 0; i < 10; i++) E('rect', { x: -80, y: -300 + i * 30, width: 160, height: 4, fill: '#BFE3FF', 'fill-opacity': .35 }, scan);

  /* ================= peste ambele: cererea, separatorul, decizia ================= */
  const divider = G(world);
  E('rect', { x: -5, y: 0, width: 10, height: 900, fill: '#F7C948' }, divider);
  E('rect', { x: -1.5, y: 0, width: 3, height: 900, fill: '#FFF6D0' }, divider);
  const req = G(world);
  E('rect', { x: -196, y: -104, width: 392, height: 214, rx: 22, fill: '#000', 'fill-opacity': .25, transform: 'translate(6,10)' }, req);
  E('rect', { x: -196, y: -104, width: 392, height: 214, rx: 22, fill: '#F7F9FD' }, req);
  E('rect', { x: -196, y: -104, width: 392, height: 44, rx: 22, fill: '#FFE7A8' }, req); E('rect', { x: -196, y: -82, width: 392, height: 22, fill: '#FFE7A8' }, req);
  const rqi = G(req); tf(rqi, -170, -82); icon(rqi, 'lock', 22, '#7A4B10', 3.5);
  TX(req, -148, -74, 'The agent asks permission', 17, '#7A4B10', { w: 800 });
  TX(req, -172, -22, 'May I delete the old', 23, '#1E2235', { w: 700 });
  TX(req, -172, 8, 'test folder?', 23, '#1E2235', { w: 700 });
  TX(req, -172, 36, "This can't be undone.", 18, '#8A4B4B', { w: 600 });
  const allow = G(req); tf(allow, -88, 78); const allowR = E('rect', { x: -78, y: -21, width: 156, height: 42, rx: 21, fill: '#2F9E5B' }, allow); TX(allow, 0, 7, 'Allow', 20, '#fff', { a: 'middle', w: 800 });
  const refuse = G(req); tf(refuse, 88, 78); E('rect', { x: -78, y: -21, width: 156, height: 42, rx: 21, fill: '#fff', stroke: '#C5CEDD', 'stroke-width': 2 }, refuse); TX(refuse, 0, 7, 'Refuse', 20, '#1E2235', { a: 'middle', w: 800 });
  const okTok = G(world); E('circle', { r: 26, fill: '#3BB273' }, okTok); icon(okTok, 'check', 28, '#fff', 5);
  const okTrail = []; for (let i = 0; i < 10; i++) okTrail.push(E('circle', { r: 7 - i * .5, fill: '#9BF0B8' }, world));
  /* panoul de decizie */
  const dec = G(world);
  E('rect', { x: -380, y: -72, width: 760, height: 144, rx: 28, fill: '#000', 'fill-opacity': .3, transform: 'translate(6,10)' }, dec);
  E('rect', { x: -380, y: -72, width: 760, height: 144, rx: 28, fill: '#FBF7EE' }, dec);
  TX(dec, 0, -36, 'The human decides', 26, '#5A4A30', { a: 'middle', w: 800 });
  const dA = G(dec); tf(dA, -170, 20); const dAr = E('rect', { x: -150, y: -34, width: 300, height: 68, rx: 34, fill: '#2F9E5B' }, dA);
  const dAi = G(dA); tf(dAi, -88, 0); icon(dAi, 'check', 30, '#fff', 5); TX(dA, 16, 11, 'Allow', 30, '#fff', { a: 'middle', w: 800 });
  const dR = G(dec); tf(dR, 170, 20); const dRr = E('rect', { x: -150, y: -34, width: 300, height: 68, rx: 34, fill: '#D64550' }, dR);
  const dRi = G(dR); tf(dRi, -88, 0); icon(dRi, 'cross', 26, '#fff', 5); TX(dR, 16, 11, 'Refuse', 30, '#fff', { a: 'middle', w: 800 });
  const stamp = G(dec); tf(stamp, 0, 18, -8);
  E('rect', { x: -230, y: -40, width: 460, height: 80, rx: 14, fill: '#FBF7EE', 'fill-opacity': .85, stroke: '#2F6FDB', 'stroke-width': 6 }, stamp);
  TX(stamp, 0, 14, 'TUDOR HAS THE LAST WORD', 30, '#2F6FDB', { a: 'middle', w: 900, ls: 1 });
  /* banner „Doar omul” */
  const only = G(world); tf(only, 800, 120);
  E('rect', { x: -250, y: -38, width: 500, height: 76, rx: 38, fill: '#14121F', 'fill-opacity': .8 }, only);
  const oi = G(only); tf(oi, -200, 0); E('circle', { r: 24, fill: '#8FD0FF' }, oi); icon(oi, 'person', 28, '#14121F', 4);
  TX(only, 20, 11, 'Only the human does this', 30, '#FFF6E5', { a: 'middle', w: 800 });
  const sup = G(world); tf(sup, 800, 120);
  E('rect', { x: -240, y: -38, width: 480, height: 76, rx: 38, fill: '#14121F', 'fill-opacity': .8 }, sup);
  TX(sup, 0, 11, 'Under human supervision', 30, '#FFE7A8', { a: 'middle', w: 800 });
  const spk = [0, 1, 2, 3, 4].map(() => sparkle(world, '#FFE066', 14));

  return (lt, at) => {
    bgw.anim(at); bgo.anim(at);
    /* ---- împărțirea ecranului ---- */
    const split = lerp(800, 0, prog(lt, L(5) - .5, 1.1));
    cL.r.setAttribute('width', f2(Math.max(0, split - 1)));
    cR.r.setAttribute('x', f2(split)); cR.r.setAttribute('width', f2(1600 - split));
    op(left, split > 2 ? 1 : 0);
    tf(divider, split, 0); op(divider, split > 4 ? 1 : 0);
    /* camera stânga (centru 400) */
    const vl = keyed(lt, [[0, [400, 470, 1]], [L(0) + 1, [420, 480, 1.08]], [L(1), [400, 460, 1]], [L(3), [410, 440, .96]], [L(4), [400, 450, .96]]]);
    tf(camL, 400 - vl[0] * vl[2], 450 - vl[1] * vl[2], 0, vl[2]);
    /* camera dreapta: centrul jumătății */
    const cxR = split + (1600 - split) / 2;
    const vr = keyed(lt, [[0, [1200, 450, 1]], [L(5) - .5, [1200, 450, 1]], [L(5) + .8, [1255, 500, 1.28]], [L(6) - .2, [1255, 500, 1.28]], [L(6) + 1.2, [1290, 460, 1.12]]]);
    tf(camR, cxR - vr[0] * vr[2], 450 - vr[1] * vr[2], 0, vr[2]);

    /* ---- robotul ---- */
    const arrive = 2.2;
    const bx = keyed(lt, [[0, -120], [arrive, 320]], t => t);
    const st = { x: bx, y: 720, s: .9, at, face: 'happy', look: [1, 0] };
    if (lt < arrive) { const w = walkCycle(bx / 20); Object.assign(st, { fL: w.fL, fR: w.fR, bob: w.bob, hL: [-62 + w.swing * 14, -96], hR: [62 - w.swing * 14, -96] }); }
    const reachP = prog(lt, arrive + .3, 1.2), stopP = prog(lt, L(0) + 2.1, .35);
    const pressP = prog(lt, L(3) + .6, .35) * (1 - prog(lt, L(3) + 1.2, .4));
    if (lt >= arrive && lt < L(0) + 2.1) Object.assign(st, { hR: [lerp(62, 200, reachP), lerp(-96, -250, reachP)], face: 'focus', look: [1, .4] });
    else if (lt >= L(0) + 2.1 && lt < L(1)) Object.assign(st, { hR: [lerp(200, 76, stopP), lerp(-250, -300, stopP)], rotR: -20, face: 'surprise', look: [1, 0], tilt: -3 * stopP });
    else if (lt >= L(1) && lt < L(3) + .4) Object.assign(st, { hR: [70, -290 + Math.sin(at * 2) * 4], hL: [-60, -120], face: lt < Le(1) + .2 ? 'neutral' : 'happy', talk: cue.talk(lt, 'A'), look: [lt > Le(1) ? 1 : 0, 0] });
    else if (lt >= L(3) + .4 && lt < L(3) + 1.6) Object.assign(st, { hR: [210, lerp(-268, -236, pressP)], face: 'joy', look: [1, .4] });
    else if (lt < L(4)) Object.assign(st, { hR: [60, -200 - Math.abs(Math.sin(at * 3)) * 30], hL: [-60, -120], face: 'happy', look: [0, -1], headTilt: Math.sin(at * 1.5) * 4 });
    else Object.assign(st, { hL: [-30, -100], hR: [30, -100], bendL: 30, bendR: -30, face: 'neutral', look: [1, 0], headTilt: Math.sin(at * 1.2) * 5 });
    if (lt >= arrive) st.bob = Math.sin(at * 2.4) * 2;
    bot.set(st);
    const so = pop(lt, L(0) + 2.1, .5) * (1 - prog(lt, L(1) - .2, .4));
    op(stopS, so > 0 ? 1 : 0); tf(stopS, 640, 360 + Math.sin(at * 3) * 4, Math.sin(at * 2) * 5, so);
    const an = prog(lt, L(0) + 3, .6) * (1 - prog(lt, L(1) + .2, .5));
    op(askNote, an); tf(askNote, 400, 180 + (1 - an) * 10);
    /* lacăt, capac, buton, dosar */
    const unlock = prog(lt, L(3) - .4, .4);
    tf(padSh, 0, -10 * unlock); padSh.setAttribute('transform', `translate(0,${f2(-10 * unlock)}) rotate(${f2(-35 * unlock)} 12 -8)`);
    const fall = prog(lt, L(3) - .05, .6, easeIn);
    tf(pad, 0 - 40 * fall, -170 + 200 * fall, -50 * fall); op(pad, 1 - prog(lt, L(3) + .4, .3));
    if (unlock < 1) tf(pad, Math.sin(at * 9) * (lt > L(0) + 2 && lt < L(1) + 3 ? 3 : 0), -170);
    const coverO = prog(lt, L(3) + .1, .5, easeOut);
    cover.setAttribute('transform', `rotate(${f2(-110 * coverO)} -58 -198)`);
    tf(btn, 0, 10 * pressP);
    conLight.setAttribute('fill', lt > L(3) - .4 ? (lt > L(3) + .8 ? '#3BB273' : '#7CFFB2') : (Math.sin(at * 6) > 0 ? '#F7C948' : '#8A6A1E'));
    const gone = prog(lt, L(3) + .9, .5);
    tf(oldF, 0, -46, 0, 1 - gone); op(oldF, 1 - gone);
    puffs.forEach((p, i) => { const a = i / 5 * Math.PI * 2, k = prog(lt, L(3) + .85, .9, easeOut); op(p, k > 0 && k < 1 ? (1 - k) * .9 : 0);
      tf(p, Math.cos(a) * 50 * k, -46 + Math.sin(a) * 34 * k - 20 * k, 0, .5 + k); });
    /* alte butoane încuiate */
    lockBoxes.forEach((b, i) => { const t0 = [L(3) + .9, L(3) + 2.2, L(3) + 4.2][i];
      const v = pop(lt, t0, .55); op(b.b, v > 0 ? 1 : 0); tf(b.b, b.b._x, b.b._y - 30 * (1 - Math.min(1, v)), 0, Math.max(.01, v));
      b.lamp.setAttribute('fill', Math.sin(at * 5 + i) > 0 ? '#F7C948' : '#8A6A1E');
      tf(b.lk, 30, 84, Math.sin(at * 7 + i) * 6 * (lt < L(4) ? 1 : .2));
      op(b.tag, prog(lt, t0 + .4, .4)); tf(b.q, 92, -6 + Math.sin(at * 3 + i) * 4); op(b.q, prog(lt, t0 + .3, .3)); });
    /* ---- cererea zboară la Tudor ---- */
    const rIn = pop(lt, L(1) + .1, .55), fly = prog(lt, Le(1) - .7, 1.0), rOut = prog(lt, L(3) - .9, .4);
    const rp = arcPos(fly, [400, 290], [1392, 300], 90);
    op(req, rIn > 0 ? 1 - rOut : 0); tf(req, rp[0], rp[1], 0, Math.max(.01, rIn) * lerp(.85, 1, fly) * (1 - .3 * rOut));
    const clickA = clamp(1 - Math.abs(lt - (Le(2) - .1)) / .3);
    allowR.setAttribute('fill', clickA > 0 ? mix('#2F9E5B', '#7CE0A3', clickA) : '#2F9E5B'); tf(allow, -88, 78, 0, 1 - .08 * clickA);
    const ok = prog(lt, Le(2) + .05, .9, ease);
    const op0 = [1392, 378], op1 = [520, 545];
    const okp = arcPos(ok, op0, op1, 140);
    op(okTok, ok > 0 && ok < 1 ? 1 : 0); tf(okTok, okp[0] < split ? okp[0] : okp[0], okp[1], ok * 360, 1);
    okTrail.forEach((d, i) => { const q = ok - (i + 1) * .035; const pq = arcPos(Math.max(0, q), op0, op1, 140); tf(d, pq[0], pq[1]); op(d, q > 0 && ok < 1 ? .8 * (1 - i / 10) : 0); });
    /* ---- Tudor ---- */
    const standP = prog(lt, L(6) - .2, .7);
    const tst = { x: 1250, y: lerp(772, 700, standP), at, face: 'neutral', look: [1, .5], turn: .5 };
    const typing = lt < L(1) + .4 || (lt > L(3) && lt < L(4));
    tst.hL = [150 + (typing ? Math.sin(at * 21) * 6 : 0), -152 - (typing ? Math.abs(Math.sin(at * 17)) * 9 : 0)];
    tst.hR = [210 + (typing ? Math.sin(at * 19 + 1) * 6 : 0), -150 - (typing ? Math.abs(Math.sin(at * 15 + 2)) * 9 : 0)];
    if (lt > Le(1) - .4 && lt < L(2)) Object.assign(tst, { face: 'think', hR: [40, -290], hL: [150, -152], look: [1, .2], headTilt: 6 });
    if (lt >= L(2) && lt < L(3)) { const jab = clamp(1 - Math.abs(lt - (Le(2) - .1)) / .35); Object.assign(tst, { face: 'happy', talk: cue.talk(lt, 'T'), look: [1, -.3], hR: [200, -190 + 40 * jab], hL: [150, -152] }); }
    if (lt >= L(3) && lt < L(4)) Object.assign(tst, { face: 'happy', look: [-1, -.5], turn: -.3, headTilt: Math.sin(at * 3) * 4 });
    const gav = lt >= L(4) && lt < L(5) - .6;
    const hit = prog(lt, Le(4) - 1.9, .25, easeIn) * (1 - prog(lt, Le(4) - 1.5, .5));
    if (gav) Object.assign(tst, { face: lt > Le(4) - 2.2 ? 'proud' : 'think', look: [-1, -.2], turn: -.4, hL: [lerp(-90, -128, hit), lerp(-310, -150, hit)], bendL: 20, propRotL: lerp(-70, -10, hit) - 60, hR: [60, -150] });
    op(gavel, gav ? 1 : 0); tf(gavel, 0, 0, 0, 1);
    const bv = lt > Le(4) - 1.75 && lt < Le(4) - .6 ? 1 - prog(lt, Le(4) - 1.75, 1.1) : 0; op(bang, bv); tf(bang, 1130, 600, 0, .7 + .5 * (1 - bv));
    /* sign-in + cablu */
    const card = lt >= L(5) && lt < L(6) - .4;
    if (card) Object.assign(tst, { face: lt < L(5) + 3.2 ? 'focus' : 'happy', look: [-.3, -.4], turn: -.2, hL: [-70, -268], bendL: 30, hR: lt > L(5) + 3.2 ? [-20, -180] : [210, -150] });
    op(idCard, card && lt < L(5) + 3.6 ? 1 : 0);
    dots.textContent = '•'.repeat(Math.floor(clamp((lt - L(5) - .6) / 1.4) * 8));
    op(signed, prog(lt, L(5) + 2.2, .3));
    const phOn = card && lt > L(5) + 3.2;
    op(myPh, phOn ? 1 : 0);
    const cab = prog(lt, L(5) + 3.6, .8);
    cable.setAttribute('stroke-dashoffset', f2(cableL * (1 - cab))); op(cable, phOn ? 1 : 0);
    const inst = clamp((lt - L(5) - 4.4) / 2.0);
    bar.setAttribute('width', f2(200 * inst)); op(appIc, prog(lt, L(5) + 6.4, .3));
    /* supraveghere */
    if (lt >= L(6) - .4) Object.assign(tst, { face: 'happy', look: [1, 0], turn: .3, hL: [-78, -170], hR: [-50 + Math.sin(at * 6) * 8, -170 + Math.abs(Math.sin(at * 5)) * 10], bendL: 30, sit: false });
    op(clip, lt >= L(6) - .4 ? 1 : 0);
    if (lt >= L(6)) { cb.rows.forEach((r, i) => op(r.ck, prog(lt, L(6) + .8 + i * .7, .2))); } else cb.rows.forEach(r => op(r.ck, 0));
    tst.bob = Math.sin(at * 2.2) * 1.5;
    if (tst.y > 701 && tst.sit !== false) tst.sit = true; else tst.sit = false;
    tudor.set(tst);
    /* laptop: ecranul arată cererea; se închide la final */
    const lid = 1 - prog(lt, L(6) - .6, .5);
    tf(lapScr, -115, -150 + 150 * (1 - lid), 0, 1, Math.max(.02, lid));
    lap.glow.setAttribute('fill-opacity', f2(.25 * lid));
    op(lsAsk, lt > Le(1) - .2 && lt < Le(2) + .2 ? (Math.sin(at * 8) > -.3 ? 1 : .4) : 0);
    /* robotul hologramă */
    const ho = prog(lt, L(6) + .2, .6);
    op(holo, ho * (lt < L(6) + .9 ? (Math.sin(at * 40) > 0 ? 1 : .35) : 1));
    tf(holo, 1460, 712, 0, 1);
    bot2.set({ x: 0, y: 0, s: .72 * (0.6 + .4 * ho), at, face: 'joy', hR: [70, -250 + Math.sin(at * 7) * 8], rotR: -25, hL: [-62, -100], bob: Math.sin(at * 2.6) * 3, look: [-1, 0] });
    tf(scan, 0, ((at * 60) % 30)); op(scan, ho * .8);
    holoGlow.setAttribute('ry', f2(190 + 10 * Math.sin(at * 3)));
    /* panouri */
    const dv = pop(lt, L(4) + .1, .6) * (1 - prog(lt, L(5) - .6, .4));
    op(dec, dv > 0 ? 1 : 0); tf(dec, 800, 128, 0, Math.max(.01, dv));
    const alt = Math.sin(at * 4) > 0;
    const pre = lt < Le(4) - 2.2;
    dAr.setAttribute('fill', pre ? (alt ? '#2F9E5B' : '#5C8A6E') : '#2F9E5B'); dRr.setAttribute('fill', pre ? (alt ? '#8E5A5E' : '#D64550') : '#8E5A5E');
    tf(dA, -170, 22, 0, pre ? (alt ? 1.04 : 1) : 1.06); tf(dR, 170, 22, 0, pre ? (alt ? 1 : 1.04) : .96);
    const sp = pop(lt, Le(4) - 1.7, .4); op(stamp, sp > 0 ? 1 : 0); tf(stamp, 0, 18, -8, 1.6 - .6 * Math.min(1, sp));
    const ov = prog(lt, L(5) + .3, .5) * (1 - prog(lt, L(6) - .5, .4)); op(only, ov); tf(only, 800, 120 - 10 * (1 - ov));
    const sv = prog(lt, L(6) + .6, .6); op(sup, sv); tf(sup, 800, 120 - 10 * (1 - sv));
    spk.forEach((s, i) => { const v = lt > L(6) + .3 ? 1 : 0; op(s, v * Math.abs(Math.sin(at * 2 + i)));
      tf(s, 1140 + i * 90, 300 + Math.sin(i * 2.3) * 70 + Math.sin(at + i) * 10, at * 60, .6 + .5 * Math.abs(Math.sin(at * 2 + i))); });
  };
} });
