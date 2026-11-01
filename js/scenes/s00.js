"use strict";
/* SCENA 0 — Deschidere: Tudor, ideea, mesajul care pleacă */
SCENE(0, { build(world, cue) {
  const cam = G(world);
  const bg = bgOffice(cam, { winX: 1000 });
  /* scaun în spatele lui Tudor */
  const chair = G(cam); tf(chair, 600, 0);
  E('rect', { x: -84, y: 470, width: 168, height: 210, rx: 40, fill: '#7E2F3A' }, chair);
  E('rect', { x: -66, y: 488, width: 132, height: 170, rx: 30, fill: '#953A47' }, chair);
  const tudor = Human(cam, { seed: 4 });
  /* birou + obiecte */
  const desk = G(cam); tf(desk, 640, 640); officeDesk(desk, 640);
  const lamp = G(cam); tf(lamp, 410, 640); deskLamp(lamp);
  const cup = mug(cam, .9, '#E84855'); tf(cup, 905, 618);
  const books = G(cam); tf(books, 360, 640);
  [['#4D96FF', 0], ['#F7C948', -22], ['#3BB273', -44]].forEach(([c, y], i) => E('rect', { x: -50 + i * 6, y: y - 22, width: 100, height: 22, rx: 4, fill: c }, books));
  const rcard = G(cam); tf(rcard, 560, 634, -8);
  E('rect', { x: -46, y: -8, width: 92, height: 12, rx: 3, fill: '#F2E1C1' }, rcard);
  /* laptop */
  const lap = laptop(cam, { w: 250, h: 160 }); tf(lap, 780, 640);
  const lapScr = lap.screen;
  const mini = G(lapScr); E('rect', { x: 12, y: 12, width: 206, height: 18, rx: 4, fill: '#DCE6F7' }, mini);
  const miniLines = []; for (let i = 0; i < 5; i++) miniLines.push(E('rect', { x: 14, y: 42 + i * 16, width: 0, height: 7, rx: 3, fill: '#5B6B8C' }, mini));
  /* bec + gând */
  const bulb = G(cam); const bulbIn = lightbulb(bulb, 1.1);
  const thought = G(cam); const tb = thoughtBubble(thought, 300, 170); tf(tb, -150, -200);
  const tph = G(thought); tf(tph, -70, -118); const pp = phone(tph, .2); const pu = appUI(pp.screen);
  const tbk = G(thought); tf(tbk, 48, -112); bookProp(tbk, '#E84855', 1.1, 1);
  TX(thought, 48, -64, 'Grandma\'s recipes', 15, '#8A5A2B', { a: 'middle', w: 800, hand: true });
  /* fereastra de mesaj (mărită) */
  const msg = G(cam);
  const MW = 720, MH = 250;
  E('rect', { x: -MW / 2 + 6, y: -MH / 2 + 10, width: MW, height: MH, rx: 26, fill: '#000', 'fill-opacity': .25 }, msg);
  E('rect', { x: -MW / 2, y: -MH / 2, width: MW, height: MH, rx: 26, fill: '#F7F9FD' }, msg);
  E('rect', { x: -MW / 2, y: -MH / 2, width: MW, height: 46, rx: 26, fill: '#E3EAF7' }, msg); E('rect', { x: -MW / 2, y: -MH / 2 + 26, width: MW, height: 20, fill: '#E3EAF7' }, msg);
  TX(msg, -MW / 2 + 26, -MH / 2 + 30, 'New message to the AI agent', 18, '#55617E', { w: 700 });
  const S = ['Make me an iPhone app with our family recipes:', 'a list of recipes, search, favourites, a photo', 'for every recipe, and a shopping list.'];
  const mL = S.map((s, i) => TX(msg, -MW / 2 + 26, -MH / 2 + 88 + i * 40, '', 26, '#1E2235', { w: 600 }));
  const send = G(msg); tf(send, MW / 2 - 90, MH / 2 - 40);
  const sendB = E('rect', { x: -66, y: -24, width: 132, height: 48, rx: 24, fill: '#4D96FF' }, send);
  TX(send, 0, 8, 'Send ➤', 21, '#fff', { a: 'middle', w: 800 });
  /* avionul de hârtie + dâră */
  const trail = []; for (let i = 0; i < 14; i++) trail.push(E('circle', { r: 5 - i * .3, fill: '#FFE7A8' }, cam));
  const plane = G(cam); paperPlane(plane, 1.4, '#FFFFFF');
  /* titlul filmului */
  const title = G(world);
  E('rect', { x: 260, y: 250, width: 1080, height: 220, rx: 30, fill: '#14121F', 'fill-opacity': .72 }, title);
  const t1 = TX(title, 800, 345, 'How an AI Agent', 76, '#FFF6E5', { a: 'middle', w: 800 });
  const t2 = TX(title, 800, 432, 'Builds an iPhone App', 76, '#F7C948', { a: 'middle', w: 800 });
  const spk = [0, 1, 2, 3].map(i => sparkle(title, '#FFE066', 16));

  const L = i => cue(i), Le = i => cue.e(i);
  const flightK = [[0, [790, 470]], [.25, [700, 250]], [.45, [880, 150]], [.62, [1120, 230]], [.8, [1230, 290]], [1, [1340, 200]]];
  return (lt, at) => {
    bg.anim(at); cup.anim(at);
    camera(cam, lt, [[0, 800, 450, 1], [L(2), 800, 450, 1], [L(2) + 1.6, 790, 470, 1.22], [L(4) + .2, 790, 470, 1.22], [L(4) + 1.6, 1000, 390, 1.08], [cue.d, 1180, 330, 1.3]]);
    /* titlu */
    op(title, prog(lt, .2, .8) * (1 - prog(lt, L(0) - .4, .6)));
    tf(t1, 0, -8 * (1 - pop(lt, .3, .7))); tf(t2, 0, 10 * (1 - pop(lt, .7, .7)));
    spk.forEach((s, i) => { const ph = at * 1.3 + i * 1.6; tf(s, [300, 1300, 330, 1270][i], [270, 280, 450, 450][i], at * 40, .6 + .4 * Math.abs(Math.sin(ph))); });
    /* Tudor: intră, face cu mâna, are ideea, se așază, scrie */
    const sitP = prog(lt, L(2) + .2, .8);
    const walkX = keyed(lt, [[0, -140], [.6, -140], [L(0) - .2, 560]], t => t);
    const walking = lt < L(0) - .2;
    const wc = walkCycle(walkX / 22);
    const st = { x: walkX, y: lerp(700, 772, sitP), at, s: 1, face: 'happy', look: [0, 0], turn: 0 };
    if (walking) Object.assign(st, { fL: wc.fL, fR: wc.fR, bob: wc.bob, hL: [-60 + wc.swing * 14, -120], hR: [60 - wc.swing * 14, -120], face: 'happy', turn: .5 });
    else if (lt < Le(0) + .3) { const w = Math.sin(at * 10) * 18; Object.assign(st, { hR: [84 + w, -330], hL: [-58, -128], face: 'joy' }); }
    else if (lt < L(2)) { Object.assign(st, { hR: [44, -318], face: lt < L(1) + 1.5 ? 'surprise' : 'happy', look: [0, -1], headTilt: Math.sin(at * 2) * 3 }); }
    else if (lt < L(3) - .3) { Object.assign(st, { hL: [lerp(-58, 104, sitP), lerp(-128, -152, sitP)], hR: [lerp(58, 166, sitP), lerp(-128, -150, sitP)], face: 'happy', look: [1, .5], turn: .5 }); }
    else if (lt < L(4) + .2) { const ty = lt < Le(3) + .2; Object.assign(st, { hL: [104 + (ty ? Math.sin(at * 21) * 6 : 0), -152 - (ty ? Math.abs(Math.sin(at * 17)) * 10 : 0)], hR: [166 + (ty ? Math.sin(at * 19 + 1) * 6 : 0), -150 - (ty ? Math.abs(Math.sin(at * 15 + 2)) * 10 : 0)], face: ty ? 'focus' : 'happy', look: [1, .6], turn: .55, talk: cue.talk(lt, 'T') }); }
    else { const pr = prog(lt, L(4) + .25, .5); if (lt < L(4) + 1.1) Object.assign(st, { hL: [104, -152], hR: [170, -150 - 30 * Math.sin(Math.PI * pr)], face: 'happy', look: [1, .5], turn: .55 });
      else Object.assign(st, { hL: [-40, -330], hR: [40, -330], bendL: -40, bendR: 40, face: 'joy', tilt: -4, look: [1, -1], turn: .3 }); }
    if (!walking) st.bob = Math.sin(at * 2.2) * 1.5;
    if (st.y > 701) st.sit = true;
    tudor.set(st);
    /* bec */
    const bp = pop(lt, L(1) + .1, .5) * (1 - prog(lt, L(2) + .2, .4));
    op(bulb, bp > 0 ? 1 : 0); tf(bulb, 560 + 70, 280 + Math.sin(at * 3) * 6, Math.sin(at * 2) * 6, bp);
    bulbIn.glow.setAttribute('r', f2(46 + 8 * Math.sin(at * 6)));
    const tp = pop(lt, L(1) + 1.6, .6) * (1 - prog(lt, L(2) + .1, .4));
    op(thought, tp > 0 ? 1 : 0); tf(thought, 860, 330 + Math.sin(at * 1.4) * 5, 0, tp);
    pu.set({});
    /* laptop: capacul se deschide */
    const open = prog(lt, L(2) + 1.2, .7, easeOut);
    tf(lapScr, -115, -150 + 150 * (1 - open), 0, 1, Math.max(.02, open));
    lap.glow.setAttribute('fill-opacity', f2(.25 * open));
    const typed = Math.floor(clamp((lt - L(3) - .2) / (Le(3) - L(3) - .4)) * S.join('').length);
    miniLines.forEach((m, i) => m.setAttribute('width', f2(clamp(typed / 120 - i) * (i === 4 ? 120 : 196))));
    /* fereastra mărită a mesajului */
    const mp = pop(lt, L(3) - .5, .6), fold = prog(lt, L(4) + .7, .5);
    op(msg, mp * (1 - fold)); tf(msg, 1000, 300, 0, mp * (1 - fold * .9));
    let acc = 0; S.forEach((s, i) => { const k = clamp(typed - acc, 0, s.length); mL[i].textContent = s.slice(0, k) + ((typed >= acc && typed < acc + s.length && lt < Le(3)) ? '|' : ''); acc += s.length; });
    const press = clamp(1 - Math.abs(lt - (L(4) + .45)) / .25);
    sendB.setAttribute('fill', press > 0 ? mix('#4D96FF', '#2A6FDB', press) : '#4D96FF'); tf(send, MW / 2 - 90, MH / 2 - 40, 0, 1 - .08 * press);
    /* zborul avionului */
    const fp = prog(lt, L(4) + .9, cue.d - L(4) - 1.6, t => t);
    op(plane, fp > 0 && fp < 1 ? 1 : (fp >= 1 ? 1 : 0));
    const pos = p => { const v = keyed(p, flightK, t => t); return [v[0] + Math.sin(p * 12) * 8 * (1 - p), v[1]]; };
    const p0 = pos(fp), p1 = pos(Math.min(1, fp + .01));
    tf(plane, p0[0], p0[1], Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180 / Math.PI + 10, lerp(1, .35, prog(fp, .55, .45)));
    trail.forEach((d, i) => { const q = fp - (i + 1) * .018; const pq = pos(Math.max(0, q)); tf(d, pq[0], pq[1]); op(d, q > 0 && fp > 0 ? .8 * (1 - i / 14) : 0); });
  };
} });
