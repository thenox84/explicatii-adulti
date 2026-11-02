"use strict";
/* SCENE 6 — "The band plays on"  (gentle comedy → quiet dignity)
   Beat sheet (lt in s at the current timing; [n] = script line, every beat is anchored to cue(n) in code):
   A  0.0 – 12.9  GRAND SALOON (bgSaloon) tilting 4° → 12°; chandeliers hang plumb; the lights dip at each lurch.
      0.0– 3.6    establishing: armchairs, palm and grand piano lined up; the Captain sips his tea, unbothered.
      [0] 2.0– 7.9  lurch on "the bow was going under" (3.6); from 3.85 the green armchair, the potted palm
                    (steps out of its corner), the red armchair and the grand piano bob downhill in a stately,
                    in-step conga line and out through the double doors (burst open 7.1).  Eyes-only tracking.
      [1] 8.4–11.8  "Steady, everyone" (calming pat of the air) … sets the teacup on the sloping table (10.1);
                    it balances, glides off the edge (11.3), lands upright and trots out of the doors after the
                    piano (11.6–12.5); his eyes follow it; he straightens his cap (12.1) and turns away to help
                    with the boats (12.4).  Not shown again.
   B 12.9 – 23.9  BOAT DECK under the stars (bgDeck, tilt 5.6° → 8.4°), boat 0 already going down
      [2] 12.3–16.2 cut on "deck": the band (castMusician 0–3) plays on, calm; soft notes drift up; the sheet
                    music lifts away sheet by sheet (13.5–15.3), they glance up, then play on from memory,
                    eyes half closed; the camera drifts away from them while they still play (14.8 →).
      [3] 16.7–19.2 the Lady (smug): Mitzi hops into her arms, she hurries to the boat; the twelve-suitcase
                    tower hops after her (17.3 →).
      [4] 19.5–21.1 the Officer steps into its path, ONE finger raised; the tower halts and wobbles.
      [5] 21.4–22.9 she holds Mitzi (flat cap) up to him — "Then I choose Mitzi"; he hands them up into the
                    boat (22.4–22.8); the suitcases slump into a sulky heap (22.5); he salutes, boat lowered.
   C 23.4 – 37.3  ON THE GLASSY SEA (dissolve 23.4–23.9); far layer (sky/sea/ship) with its own camera
      [6] 24.2–28.7 close on the lifeboat: the Owner draws the wad from his waistcoat pocket (24.4–25.3) and
                    smooths it flat on his knee in three strokes (25.4–27.5) → PRACTICALLY, held.
      [7] 30.3–35.7 wide and still: the Lady with Mitzi, the Owner, the Lookout and the Wireless operator, in
                    blankets, all watching.  Far off the music notes stop, the lights go out (30.5–31.3), she
                    breaks in two (31.3–33.7) and slips under (33.2–35.3); no people on the ship.
      35.3–37.3     held silence: stars, glassy sea, a last ripple ring; heads bowed; the iris closes.
*/
SCENE(6, { build(world, cue) {
  const L = cue, Le = cue.e, DUR = cue.d;
  const RAD = Math.PI / 180;
  const rotAbout = (p, c, deg) => { const a = deg * RAD, cs = Math.cos(a), sn = Math.sin(a), dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * cs - dy * sn, c[1] + dx * sn + dy * cs]; };
  /* person-local point ↔ parent point, for a state {x, y, s, rot, flip} */
  const toPar = (st, p) => { const f = st.flip ? -1 : 1, a = (st.rot || 0) * RAD, lx = p[0] * st.s * f, ly = p[1] * st.s; return [st.x + lx * Math.cos(a) - ly * Math.sin(a), st.y + lx * Math.sin(a) + ly * Math.cos(a)]; };
  const toLoc = (st, q) => { const f = st.flip ? -1 : 1, a = -(st.rot || 0) * RAD, dx = q[0] - st.x, dy = q[1] - st.y; return [(dx * Math.cos(a) - dy * Math.sin(a)) / (st.s * f), (dx * Math.sin(a) + dy * Math.cos(a)) / st.s]; };
  const lin = t => t;
  const kv = (t, K, f) => keyed(t, K.map(k => [k[0], k.slice(1)]), f);
  const camSet = (g, cx, cy, z) => g.setAttribute('transform', `translate(800,450) scale(${f2(z * 1000) / 1000}) translate(${f2(-cx)},${f2(-cy)})`);
  /* cuts */
  const tAB = L(2) + .55;               /* saloon → deck, on "deck" */
  const tBC = Le(5) + .55, dBC = .5;    /* deck → sea (dissolve) */

  /* ---------- soft music notes (shared) ---------- */
  const mkNote = (p, k, col) => {
    const g = G(p);
    if (k % 3 === 2) {
      E('path', { d: 'M-3,-1 V-27 L17,-33 V-6', stroke: col, 'stroke-width': 2.6, fill: 'none', 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M-3,-27 L17,-33 L17,-27 L-3,-21 Z', fill: col }, g);
      E('ellipse', { cx: -8, cy: 0, rx: 6.5, ry: 4.8, fill: col, transform: 'rotate(-22 -8 0)' }, g);
      E('ellipse', { cx: 12, cy: -5, rx: 6.5, ry: 4.8, fill: col, transform: 'rotate(-22 12 -5)' }, g);
    } else {
      E('path', { d: 'M5.5,-1 V-30 Q15,-25 14,-12', stroke: col, 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, g);
      E('ellipse', { cx: 0, cy: 0, rx: 7, ry: 5.2, fill: col, transform: 'rotate(-22)' }, g);
    }
    return g;
  };
  /* pool of n notes, one spawned every dt s; src(m, lt) → [x, y, scale]; gate(t0) → 0..1 by spawn time */
  const noteSys = (p, n, dt, src, o = {}) => {
    const ns = [], col = o.col || '#F3DFA2', life = Math.min(o.life || 3.6, n * dt);
    for (let i = 0; i < n; i++) ns.push(mkNote(p, i, col));
    return (lt, gate) => ns.forEach((g, j) => {
      const m = j + n * Math.floor((lt / dt - j) / n), t0 = m * dt, age = lt - t0, u = age / life;
      const gv = gate(t0, lt);
      if (u < 0 || u >= 1 || gv <= 0) { op(g, 0); return; }
      const e = src(m, lt), sw = Math.sin(age * 1.9 + m * 2.3) * (o.sway || 14) * e[2];
      op(g, gv * (o.a || .7) * Math.min(1, u * 6) * Math.min(1, (1 - u) * 2.5));
      tf(g, e[0] + sw + u * (o.drift || 60) * e[2], e[1] - age * (o.rise || 60) * e[2], sw * .5, e[2] * (.85 + u * .3));
    });
  };

  /* ---------- blankets ---------- */
  const blanketWrap = (R, c1, c2) => {            /* full wrap: drawn over the arms, under the chin */
    const b = G(R.up);
    E('path', { d: 'M-60,-244 Q-38,-257 -15,-244 L0,-224 L15,-244 Q38,-257 60,-244 Q80,-196 74,-104 Q0,-90 -74,-104 Q-80,-196 -60,-244 Z', fill: c1 }, b);
    E('path', { d: 'M-15,-244 L0,-224 L15,-244 L8,-238 L0,-229 L-8,-238 Z', fill: shade(c1, -.25) }, b);
    E('path', { d: 'M-71,-128 Q0,-114 71,-128 M-73,-116 Q0,-102 73,-116', stroke: c2, 'stroke-width': 5, fill: 'none' }, b);
    E('path', { d: 'M-30,-238 Q-36,-180 -26,-108 M30,-238 Q38,-180 28,-108 M2,-222 Q4,-170 0,-102', stroke: shade(c1, -.22), 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, b);
    E('path', { d: 'M-56,-238 Q-70,-190 -66,-120', stroke: '#fff', 'stroke-opacity': .14, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, b);
    return b;
  };
  const blanketCape = (R, c1, c2, wide = 1) => {   /* over the shoulders only: the arms stay free */
    const b = G(R.torso), w = wide;
    E('path', { d: `M${-62 * w},-246 Q-30,-260 0,-250 Q30,-260 ${62 * w},-246 Q${86 * w},-196 ${92 * w},-128 L${58 * w},-122 Q${50 * w},-196 22,-244 L-22,-244 Q${-50 * w},-196 ${-58 * w},-122 L${-92 * w},-128 Q${-86 * w},-196 ${-62 * w},-246 Z`, fill: c1 }, b);
    E('path', { d: `M${-88 * w},-140 L${-60 * w},-136 M${88 * w},-140 L${60 * w},-136`, stroke: c2, 'stroke-width': 5 }, b);
    return b;
  };

  const A = G(world), Cg = G(world), B = G(world);

  /* =====================================================================
     PART A — the grand saloon
     ===================================================================== */
  const camA = G(A), roomA = G(camA);
  const sal = bgSaloon(roomA, { vignette: false });
  const PVA = [950, 700];
  const salKids = [...sal.children];
  const byTf = s => salKids.find(n => n.getAttribute && n.getAttribute('transform') === s);
  const chandSw = [480, 900, 1320].map(x => { const c = byTf(`translate(${x},-20)`); return c ? c.children[1] : null; }).filter(Boolean);
  const bgPalm = byTf('translate(690,664) scale(1.55,1.55)'); if (bgPalm) op(bgPalm, 0);
  /* table 3 and its two chairs stand further right: open floor in front of the doors */
  const T3DX = 250;
  tf(sal.tables[2], T3DX, 0);
  [...sal.tables[1].children].forEach(c => { const d = c.getAttribute('d') || '', tg = c.tagName, cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), x = +c.getAttribute('x'), y = +c.getAttribute('y');
    if ((tg === 'ellipse' && cx === 900 && cy === 560) || (tg === 'rect' && ((x === 888 && y === 590) || (x === 897.5 && y === 556))) || d.indexOf('M874,56') === 0 || d.indexOf('M934,594') === 0 || (tg === 'circle' && cy < 575 && cx > 925 && cx < 950)) c.setAttribute('transform', 'translate(-104,0)'); });
  salKids.forEach(n => { if (n.getAttribute('transform')) return; const f = n.firstChild, d = f && f.getAttribute && f.getAttribute('d'); if (d && (d.indexOf('M1211,620') === 0 || d.indexOf('M1361,620') === 0)) tf(n, T3DX, 0); });

  /* furniture */
  const armchair = (p, col) => {
    const g = G(p), dk = shade(col, -.32), lt2 = shade(col, .2), wd = '#5E3A22';
    E('ellipse', { cx: 0, cy: 3, rx: 78, ry: 10, fill: '#000', 'fill-opacity': .26 }, g);
    E('path', { d: 'M-52,-26 Q-58,-12 -58,0 M52,-26 Q58,-12 58,0', stroke: wd, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, g);
    E('circle', { cx: -58, cy: 0, r: 4.5, fill: '#C9A045' }, g); E('circle', { cx: 58, cy: 0, r: 4.5, fill: '#C9A045' }, g);
    E('path', { d: 'M-52,-70 L-56,-130 Q-58,-162 -30,-164 Q0,-171 30,-164 Q58,-162 56,-130 L52,-70 Z', fill: col, stroke: dk, 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-34,-82 L-37,-138 Q0,-152 37,-138 L34,-82 Z', fill: lt2, 'fill-opacity': .35 }, g);
    [[-18, -130], [0, -136], [18, -130], [-18, -106], [0, -112], [18, -106]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 2.6, fill: dk }, g));
    E('path', { d: 'M-56,-132 Q-80,-130 -78,-96 L-62,-70 L-52,-70 Z M56,-132 Q80,-130 78,-96 L62,-70 L52,-70 Z', fill: dk }, g);
    E('path', { d: 'M-60,-74 Q0,-88 60,-74 L62,-46 Q0,-40 -62,-46 Z', fill: lt2 }, g);
    E('path', { d: 'M-64,-48 Q0,-42 64,-48 L62,-22 Q0,-16 -62,-22 Z', fill: col, stroke: dk, 'stroke-width': 2 }, g);
    E('path', { d: 'M-60,-30 q6,6 12,0 q6,6 12,0 q6,6 12,0 q6,6 12,0 q6,6 12,0 q6,6 12,0 q6,6 12,0 q6,6 12,0 q6,6 12,0 q6,6 12,0', stroke: '#C9A045', 'stroke-width': 1.8, fill: 'none' }, g);
    [-1, 1].forEach(s2 => {
      E('path', { d: `M${s2 * 50},-94 Q${s2 * 84},-98 ${s2 * 80},-74 L${s2 * 72},-22 L${s2 * 52},-22 L${s2 * 48},-82 Z`, fill: col, stroke: dk, 'stroke-width': 2 }, g);
      E('ellipse', { cx: s2 * 66, cy: -90, rx: 15, ry: 10, fill: lt2 }, g);
      E('path', { d: `M${s2 * 66},-90 m-5,0 a5,4 0 1 0 10,0 a5,4 0 1 0 -10,0`, fill: 'none', stroke: dk, 'stroke-width': 1.5 }, g);
    });
    E('path', { d: 'M-46,-150 Q-30,-160 -10,-160', stroke: '#fff', 'stroke-opacity': .22, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    return g;
  };
  const grandPiano = p => {
    const g = G(p), bk = '#17161E', hi = '#3C4260', gd = '#C9A045';
    E('ellipse', { cx: 6, cy: 4, rx: 176, ry: 13, fill: '#000', 'fill-opacity': .3 }, g);
    /* far leg + lyre */
    E('path', { d: 'M-88,-118 L-90,-6', stroke: '#0C0B10', 'stroke-width': 15, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-40,-118 Q-54,-70 -44,-26 L-28,-26 Q-18,-70 -32,-118 Z', fill: '#0F0E14' }, g);
    E('path', { d: 'M-48,-24 h-10 M-36,-24 h-8 M-26,-24 h10', stroke: gd, 'stroke-width': 3 }, g);
    /* lid (propped open) + prop stick */
    E('path', { d: 'M-128,-178 L168,-178 Q178,-200 150,-232 Q96,-292 -6,-276 Q-96,-256 -128,-178 Z', fill: '#0E0D14' }, g);
    E('path', { d: 'M-110,-182 Q-80,-244 -6,-262 Q86,-276 140,-228', stroke: hi, 'stroke-width': 3, fill: 'none', 'stroke-opacity': .7 }, g);
    E('path', { d: 'M70,-178 L52,-262', stroke: '#5A4A3A', 'stroke-width': 4 }, g);
    /* music desk */
    E('path', { d: 'M-122,-180 L-118,-212 L-62,-216 L-64,-180 Z', fill: '#24222E' }, g);
    E('rect', { x: -112, y: -210, width: 40, height: 26, fill: '#F4EEE0', transform: 'rotate(-4 -92 -197)' }, g);
    /* body */
    E('path', { d: 'M-150,-178 L124,-178 Q174,-178 174,-150 L174,-130 Q174,-118 152,-118 L-150,-118 Z', fill: bk }, g);
    E('path', { d: 'M-150,-172 L124,-172 Q166,-172 168,-150', stroke: hi, 'stroke-width': 3, fill: 'none' }, g);
    E('path', { d: 'M-150,-128 H150', stroke: gd, 'stroke-width': 2.2, 'stroke-opacity': .8 }, g);
    /* keybed + keys (edge-on) */
    E('rect', { x: -172, y: -160, width: 30, height: 30, rx: 4, fill: '#201F28' }, g);
    E('rect', { x: -170, y: -164, width: 26, height: 6, fill: '#F6F2EA' }, g);
    E('rect', { x: -170, y: -166, width: 26, height: 2.5, fill: '#1A1A1E' }, g);
    /* near legs with brass casters */
    [-128, 134].forEach(x => { E('path', { d: `M${x},-120 Q${x - 6},-60 ${x},-8`, stroke: bk, 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, g);
      E('path', { d: `M${x - 3},-112 Q${x - 7},-60 ${x - 3},-16`, stroke: hi, 'stroke-width': 3, fill: 'none', 'stroke-opacity': .6 }, g);
      E('circle', { cx: x, cy: -2, r: 6, fill: gd }, g); });
    return g;
  };
  /* item carriers: outer (room space, may be clipped to the doorway) > inner (moves) */
  const doorClip = clipRect(1024, 80, 172, 576);
  const carrier = p => { const o = G(p), i = G(o); return { o, i, clipped: false }; };
  const setClip = (c, on) => { if (c.clipped !== on) { c.clipped = on; if (on) c.o.setAttribute('clip-path', doorClip); else c.o.removeAttribute('clip-path'); } };

  /* the palm at home (behind the tables) + its travelling twin (in front) */
  const palmHomeC = carrier(sal.mid); const palmHome = itrPalm(palmHomeC.i, 0, 0, 1.55, 7);
  const cap = castCaptain(sal.mid);
  const cupH = gagTeacup(cap.propL);
  const items = [
    { kind: 'chair', col: '#3E6B4E', x0: 560, t0: 3.85, v: 400, turnK: .6 },
    { kind: 'palm', merge: [740, 777], tm0: 4.3, tm1: 5.0, v: 400, turnK: 1.15 },
    { kind: 'chair', col: '#8E3B3A', x0: 300, t0: 4.15, v: 400, turnK: .6 },
    { kind: 'piano', x0: 60, t0: 4.45, v: 400, turnK: 1.3, s: .92, post: .32 }
  ];
  items.forEach(it => {
    it.c = carrier(sal.over);
    if (it.kind === 'chair') armchair(it.c.i, it.col);
    else if (it.kind === 'piano') grandPiano(it.c.i);
    else it.palm = itrPalm(it.c.i, 0, 0, 1.55, 7);
  });
  const cupC = carrier(sal.over); const cupR = gagTeacup(cupC.i);
  /* the route: across the front, round to the right and back up into the doorway */
  const RW = [[-340, 778, 1, 1], [900, 776, 1, 1], [1180, 772, .98, 1], [1258, 748, .93, .84], [1240, 708, .85, .7], [1180, 676, .77, .62],
    [1114, 660, .70, .62], [1120, 630, .55, .7], [1130, 600, .43, .78], [1140, 578, .33, .84], [1146, 562, .25, .9]];
  const route = (() => {
    const S = [];
    for (let i = 0; i < RW.length - 1; i++) {
      const p0 = RW[Math.max(0, i - 1)], p1 = RW[i], p2 = RW[i + 1], p3 = RW[Math.min(RW.length - 1, i + 2)];
      for (let k = 0; k < 16; k++) { const t = k / 16, t2 = t * t, t3 = t2 * t;
        S.push(p1.map((_, j) => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); }
    }
    S.push(RW[RW.length - 1].slice());
    const D = [0]; for (let i = 1; i < S.length; i++) D.push(D[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]) / ((S[i][2] + S[i - 1][2]) / 2));
    const at = d => { d = clamp(d, 0, D[D.length - 1]); let i = 1; while (i < D.length - 1 && D[i] < d) i++; const u = (d - D[i - 1]) / Math.max(1e-6, D[i] - D[i - 1]); return S[i - 1].map((v, j) => lerp(v, S[i][j], u)); };
    return { at, len: D[D.length - 1], dDoor: D[6 * 16] };
  })();
  const dStart = x => (x - RW[0][0]);
  const BEAT = .6;
  const itemD = (it, t) => {          /* distance along the route at time t (ease-in start, slower beyond the doors) */
    let d;
    if (it.kind === 'palm') d = dStart(it.merge[0]) + Math.max(0, t - it.tm1) * it.v;
    else { const a = .5, tau = t - it.t0; d = dStart(it.x0) + (tau <= 0 ? 0 : tau < a ? it.v * tau * tau / (2 * a) : it.v * (tau - a / 2)); }
    if (d > route.dDoor) d = route.dDoor + (d - route.dDoor) * (it.post || .45);
    return d;
  };
  sal.setDoor(0);

  /* ---- saloon lighting overlays (screen space) ---- */
  const flickA = E('rect', { x: -100, y: -100, width: 1800, height: 1100, fill: '#0A0C1C', opacity: 0 }, A);
  /* render budget: the room re-rasterises every frame (it tilts), so drop the soft floor pools under the
     tables (mostly hidden by the cloths; table 3's is orphaned since the table moved) */
  salKids.forEach(n => { if (n.tagName === 'ellipse' && n.getAttribute('rx') === '300' && n.getAttribute('ry') === '70') op(n, 0); });

  /* =====================================================================
     PART B — the boat deck
     ===================================================================== */
  const camB = G(B);
  const deck = bgDeck(camB, { vignette: false });
  /* node budget: this scene never vents steam, and only a strip of sky shows above the rail —
     drop the unused steam plume group and every other star of the deck's starfield */
  { const steamG = deck.children[2]; if (steamG && steamG !== deck.ship && steamG.children.length === 16) steamG.remove();
    const starG = [...deck.sky.children].find(n => n.tagName === 'g' && n.children.length === 6);
    if (starG) [...starG.children].forEach(grp => [...grp.children].forEach((c, i) => { if (i % 2) c.remove(); })); }
  /* boat 0 (left) carries a few dark silhouettes as it is lowered */
  const silh = (p, x, y, s, c = '#1E2742', rim = '#7F95C8') => { const g = G(p); tf(g, x, y, 0, s);
    E('path', { d: 'M-22,0 Q-24,-30 -12,-36 Q0,-40 12,-36 Q24,-30 22,0 Z', fill: c }, g);
    E('circle', { cx: 0, cy: -48, r: 12, fill: c }, g);
    E('path', { d: 'M-10,-56 A12,12 0 0 1 10,-56', stroke: rim, 'stroke-width': 2, fill: 'none', 'stroke-opacity': .6 }, g);
    return g; };
  const tinyPax = (p, x, y, s, coat, hat, skin = '#E9C29E') => { const g = G(p); tf(g, x, y, 0, s);
    E('path', { d: 'M-22,0 Q-24,-30 -12,-36 Q0,-40 12,-36 Q24,-30 22,0 Z', fill: coat }, g);
    E('circle', { cx: 0, cy: -49, r: 12.5, fill: skin }, g);
    E('path', { d: hat === 1 ? 'M-15,-55 Q-14,-66 0,-67 Q14,-66 15,-55 Z M-20,-55 H20' : 'M-12.5,-50 Q-13,-63 0,-63 Q13,-63 12.5,-50 Q6,-58 -12.5,-50 Z', fill: hat === 1 ? '#2A2A33' : '#5A3A2A', stroke: hat === 1 ? '#2A2A33' : 'none', 'stroke-width': 3 }, g);
    E('path', { d: 'M-22,-2 Q-24,-30 -12,-36', stroke: '#9FB4E8', 'stroke-width': 2, fill: 'none', 'stroke-opacity': .5 }, g);
    return g; };
  [[-150, 1.45, '#3E4A6A', 1], [-62, 1.35, '#7A4A5A', 0], [64, 1.45, '#4A5A4A', 1], [168, 1.3, '#6A5A7A', 0]].forEach(([x, s, c, h]) => tinyPax(deck.boats[0].seat, x, 4, s, c, h));
  /* music stands (behind the players) */
  const BR = deck.anchors.bandRow;
  const stands = BR.map(([x, y]) => {
    const g = G(deck.mid); tf(g, x + 74, y + 8);
    E('path', { d: 'M0,0 V-150 M-20,0 L0,-26 L20,0', stroke: '#B88E3A', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-32,-148 L32,-148 L27,-188 L-27,-188 Z', fill: '#8E6E2E' }, g);
    const sheet = G(g); tf(sheet, 0, -178, -3);
    E('rect', { x: -26, y: -20, width: 52, height: 40, rx: 2, fill: '#FBF7EE' }, sheet);
    E('path', { d: 'M-21,-13 h42 M-21,-6 h42 M-21,1 h42 M-21,8 h42', stroke: '#3A3020', 'stroke-width': 1, 'stroke-opacity': .55 }, sheet);
    E('path', { d: 'M-14,-15 v6 M2,-8 v6 M12,-1 v6', stroke: '#3A3020', 'stroke-width': 2.2, 'stroke-opacity': .7 }, sheet);
    return { g, sheet, x: x + 74, y: y + 8 };
  });
  const band = [0, 1, 2, 3].map(i => castMusician(deck.mid, i));
  const tower = gagSuitcases(deck.mid);
  const officer = castOfficer(deck.mid);        /* stands nearer the rail: the lady passes in front of him */
  const lady = castPoshLady(deck.mid);
  const mitzi = Dog(deck.mid); gagCap(mitzi.head);
  const finger = G(officer.propL);
  E('rect', { x: -5, y: -36, width: 10, height: 30, rx: 5, fill: '#F1C49C' }, finger);
  E('path', { d: 'M-3,-31 Q0,-34 3,-31', stroke: '#D59E78', 'stroke-width': 1.4, fill: 'none' }, finger);
  /* the lady and Mitzi again, seated in boat 1 */
  const seat1 = deck.boats[1].seat;
  const ladyBoat = castPoshLady(seat1, { lite: true });
  const mitziBoat = Dog(seat1); gagCap(mitziBoat.head);
  if (ladyBoat.fan) op(ladyBoat.fan, 0);   /* her hands hold Mitzi now */
  /* level layer for flying sheets and notes */
  const levelB = G(deck);
  const flySheets = stands.map(() => { const g = G(levelB);
    E('rect', { x: -26, y: -20, width: 52, height: 40, rx: 2, fill: '#FBF7EE' }, g);
    E('path', { d: 'M-21,-13 h42 M-21,-6 h42 M-21,1 h42 M-21,8 h42', stroke: '#3A3020', 'stroke-width': 1, 'stroke-opacity': .55 }, g);
    E('path', { d: 'M-14,-15 v6 M2,-8 v6 M12,-1 v6', stroke: '#3A3020', 'stroke-width': 2.2, 'stroke-opacity': .7 }, g);
    return g; });
  const bandSt = BR.map(([x, y]) => ({ x, y, s: 1, rot: 0 }));
  const NOTE_SRC_B = [[44, -262], [44, -262], [26, -214], [30, -246]];
  const notesB = noteSys(levelB, 16, .26, (m, lt) => { const j = m % 4, p = toPar(bandSt[j], NOTE_SRC_B[j]); const w = deck.toWorld(p[0], p[1]); return [w[0], w[1], 1]; }, { rise: 62, drift: 150, life: 4.1, col: '#FFE7A6', a: .85 });
  const sheetT = [0, 1, 2, 3].map(j => L(2) + 1.15 + j * .48);

  /* =====================================================================
     PART C — on the glassy sea
     ===================================================================== */
  const HZ = 452;
  const farC = G(Cg), nearC = G(Cg);
  const skyC = Sky(farC, { mood: 'night', x0: -700, w: 3000, y0: -560, y: HZ, shootEvery: 1e6, seed: 9 });
  const seaC = Sea(farC, { y: HZ, mood: 'night', calm: true, x0: -700, w: 3000, y1: 1500, skyTop: -560, seed: 9, rows: 7 });
  const ship = Titanic(farC, { mood: 'night', calm: true });
  const farBoats = [[1530, 548, .34, false], [190, 512, .22, true], [760, 494, .15, false]].map(([x, y, s, fl], i) => {
    const b = Lifeboat(farC, { mood: 'night' });
    [-90, -30, 40, 96].slice(0, 3 + (i % 2)).forEach((sx, k) => silh(b.crew, sx, -30, .95 + hash(k + i * 3) * .2));
    return { b, x, y, s, fl, ph: i * .37 };
  });
  const ripG = G(farC); const rings = [0, 1, 2].map(() => E('ellipse', { fill: 'none', stroke: '#8E9CC6', 'stroke-width': 1.6, opacity: 0 }, ripG));
  const notesC = noteSys(farC, 8, .45, (m, lt) => { const p = ship.pt(-60 + (m % 3) * 70, -150); return [p[0], p[1], .55]; }, { rise: 46, drift: 40, life: 3.0, a: .6, col: '#FFE7A6' });
  /* the foreground lifeboat: Wireless operator, Lady + Mitzi, Owner, Lookout */
  const nb = Lifeboat(nearC, { mood: 'night' });
  const nearOars = nb.front.nextSibling, farOars = nb.back.firstChild;   /* oars shipped: hidden every frame */
  const NBX = 470, NBY = 800, NBS = 2.6, PS = .34, PY = -8;
  const SEATX = { w: -104, l: -38, o: 28, k: 96 };
  const wire = castWireless(nb.crew, { rim: '#A8C6FF' });
  const ladyC = castPoshLady(nb.crew, { rim: '#A8C6FF' });
  const owner = castOwner(nb.crew, { rim: '#A8C6FF' });
  const look = castLookout(nb.crew, 0);
  blanketWrap(wire, '#5E6472', '#C9B88A');
  blanketWrap(ladyC, '#6E5A72', '#D8C79A');
  blanketWrap(look, '#4E5E52', '#C9B88A');
  blanketCape(owner, '#7A5E4E', '#D8C79A', 1.12);
  const pocket = gagPocketOn(owner);
  if (ladyC.fan) op(ladyC.fan, 0);
  const mitziC = Dog(nb.crew); gagCap(mitziC.head);
  const ladyHands = G(nb.crew);
  [-1, 1].forEach(s2 => E('circle', { cx: s2 * 9, cy: 0, r: 4.4, fill: '#F7F3EA' }, ladyHands));
  /* PRACTICALLY: a wad twin (gagWord crumpled) + a flat twin (gagWord at crumple 0) inside a wrapper that
     the scene squashes, with crease lines that fade as he smooths it — gagWord alone goes nearly
     transparent around crumple .4, which would hide the payoff mid-stroke */
  const wordW = gagWord(nb.crew), wordWrap = G(nb.crew), word = gagWord(wordWrap);
  const creases = G(word.flat);
  E('path', { d: 'M-92,-28 L-80,-2 L-94,27 M-44,-30 L-33,-4 L-47,28 M6,-28 L-5,3 L10,29 M52,-30 L63,-1 L50,28 M98,-26 L87,3 L99,25 M-118,-6 L118,8', stroke: '#9C8A64', 'stroke-width': 3.2, fill: 'none', 'stroke-linejoin': 'round' }, creases);
  E('path', { d: 'M-89,-28 L-77,-2 L-91,27 M-41,-30 L-30,-4 L-44,28 M9,-28 L-2,3 L13,29 M55,-30 L66,-1 L53,28 M101,-26 L90,3 L102,25', stroke: '#FFFFFF', 'stroke-opacity': .55, 'stroke-width': 2, fill: 'none', 'stroke-linejoin': 'round' }, creases);
  /* render budget: the Milky Way's three 1300-dot dust paths are the costliest thing in the night sky;
     keep the brightest one (the band still reads) and hide the two faint ones and the dark lanes */
  { const mw = [...skyC.children].find(n => /^rotate\(-24 /.test(n.getAttribute('transform') || ''));
    if (mw) { const dust = [...mw.children].filter(n => n.tagName === 'path'); dust.slice(0, 2).forEach(n => op(n, 0));
      [...mw.children].slice(-5).forEach(n => { if (n.tagName === 'ellipse') op(n, 0); }); } }   /* + the five dark dust lanes */

  return (lt, at) => {
    const inA = lt < tAB, inB = lt >= tAB && lt < tBC + dBC, inC = lt >= tBC - .02;
    op(A, inA ? 1 : 0);
    op(B, inB ? (lt < tBC ? 1 : 1 - prog(lt, tBC, dBC, lin)) : 0);
    op(Cg, inC ? 1 : 0);

    /* ============================ PART A ============================ */
    if (inA) {
      const tilt = keyed(lt, [[0, 4], [3.45, 4.8], [3.75, 7.2], [7.5, 8.4], [9.15, 9], [9.4, 10.6], [12.9, 12]]);
      const lurch = swing(lt, 3.6, 1.6, 9, 3.2) + swing(lt, 9.25, 1.2, 9, 3.2);
      roomA.setAttribute('transform', `rotate(${f2(tilt + lurch * .25)} ${PVA[0]} ${PVA[1]})`);
      const cv = kv(lt, [[0, 760, 488, 1.0], [3.0, 772, 494, 1.0], [6.4, 880, 512, 1.07], [8.15, 990, 526, 1.3], [10.3, 1004, 532, 1.38], [12.9, 1012, 536, 1.42]]);
      const cc = rotAbout([cv[0], cv[1]], PVA, tilt);
      camSet(camA, cc[0] + lurch * 2, cc[1] + lurch * 3, cv[2]);
      sal.anim(at);
      const chSw = swing(lt, 3.75, 2.2, 3.1, .7) + swing(lt, 9.4, 1.5, 3.1, .7);
      chandSw.forEach((sw, i) => sw.setAttribute('transform', `rotate(${f2(-tilt + chSw + Math.sin(at * .9 + i * 2) * .8)})`));
      /* flicker: the lights dip at each lurch and slowly dim */
      const fl = (prog(lt, 3.6, .08) - prog(lt, 3.9, .25)) * .3 * (hash(Math.floor(at * 14)) > .4 ? 1 : .3)
        + (prog(lt, 9.25, .08) - prog(lt, 9.6, .25)) * .28 * (hash(Math.floor(at * 14) + 3) > .4 ? 1 : .3);
      op(flickA, fl);
      /* doors: burst open for the leading armchair, flap as the line passes, close behind the cup */
      const dOpen = pop(lt, 7.1, .5) * (1 - prog(lt, 12.6, .3));
      sal.setDoor(clamp(dOpen * (1 - .07 * Math.abs(Math.sin(lt * 5.2)) * win(lt, 7.45, 12.3, .3, .3))));
      /* conga line */
      const ph = lt / BEAT, bt = Math.floor(ph), fr = ph - bt, kick = bt % 4 === 3 ? Math.sin(Math.PI * fr) : 0;
      items.forEach((it, k) => {
        const d = itemD(it, lt), P = route.at(d), moving = it.kind === 'palm' ? lt > it.tm0 : lt > it.t0 - .05;
        let x = P[0], y = P[1], s = P[2], sx = 1 - (1 - P[3]) * it.turnK;
        const far = clamp((d - route.dDoor) / (route.len - route.dDoor));
        let o = 1 - prog(far, .62, .38, lin);
        let dance = moving ? 1 : 0;
        /* shudder before leaving (the lurch) */
        let jx = lt < (it.t0 || it.tm0) ? Math.sin(at * 40 + k) * 1.6 * win(lt, 3.6, 4.4, .1, .3) : 0;
        if (it.kind === 'palm') {
          const m = prog(lt, it.tm0, it.tm1 - it.tm0, ease);
          if (lt < it.tm1) { x = lerp(690, it.merge[0], m); y = lerp(664, it.merge[1], m); s = 1; }
          dance = lt > it.tm0 ? 1 : 0;
          const front = lt >= it.tm1 || y > 768;
          op(palmHomeC.o, front ? 0 : 1); op(it.c.o, front ? o : 0);
          const bob = dance * -Math.abs(Math.sin(Math.PI * ph)) * 6 * s, rk = dance * (Math.sin(Math.PI * ph) * 3 - kick * 4);
          tf(front ? it.c.i : palmHomeC.i, x + jx, y + bob, rk, s * sx, s);
          (front ? it.palm : palmHome).anim(at * (1 + dance * 1.5));
          setClip(it.c, d >= route.dDoor);
          return;
        }
        const heavy = it.kind === 'piano' ? .45 : 1, sc = s * (it.s || 1);
        const bob = dance * -Math.abs(Math.sin(Math.PI * ph)) * 7 * heavy * s - kick * 6 * heavy * dance;
        const rk = dance * (Math.sin(Math.PI * ph) * 3 * heavy - kick * 5 * heavy);
        tf(it.c.i, x + jx, y + bob, rk, sc * sx, sc);
        op(it.c.o, o);
        setClip(it.c, d >= route.dDoor);
      });
      /* ---- the teacup ---- */
      const tPut = L(1) + 1.62, tGl = L(1) + 2.32, tEdge = L(1) + 2.87, tLand = L(1) + 3.17, tDoor = L(1) + 3.77, tGone = L(1) + 4.12;
      const capSt = { x: 975, y: 745, s: 1, rot: -tilt * .85 };
      const putP = [952, 600];
      const handTgt = toLoc(capSt, [putP[0], putP[1] - 8]);
      const held = lt < tPut;
      op(cupH.g, held ? 1 : 0); op(cupC.o, held ? 0 : 1);
      let cx = putP[0], cy = putP[1], cs = 1, cr = 0, co = 1;
      if (!held) {
        if (lt < tGl) { cr = 0; }
        else if (lt < tEdge) { const u = prog(lt, tGl, tEdge - tGl, t => t * t); cx = lerp(952, 1040, u); }
        else if (lt < tLand) { const u = clamp((lt - tEdge) / (tLand - tEdge)); cx = lerp(1040, 1058, u); cy = lerp(600, 748, u * u); cr = Math.sin(u * Math.PI) * 18; }
        else if (lt < tDoor) { const u = clamp((lt - tLand) / (tDoor - tLand)), hop = Math.sin(Math.PI * clamp(u * 4)) * 10 * (1 - clamp(u * 4 - 1)); cx = lerp(1058, 1112, ease(u)); cy = lerp(748, 662, ease(u)) - hop; cs = lerp(1, .74, u); }
        else { const u = clamp((lt - tDoor) / (tGone - tDoor)); cx = lerp(1112, 1126, u); cy = lerp(662, 612, u); cs = lerp(.74, .45, u); co = 1 - prog(u, .55, .45, lin); }
        setClip(cupC, lt >= tDoor - .05);
        tf(cupC.i, 0, 0); op(cupC.o, co);
        const slosh = swing(lt, tPut, 8, 9, 3) + swing(lt, tGl, 6, 10, 2.5) + swing(lt, tLand, 10, 12, 3);
        cupR.set({ x: cx, y: cy, s: cs * .95, rot: cr, tilt: -tilt + slosh, steam: .8, at });
      }
      /* ---- the Captain ---- */
      const tk = cue.talk(lt, 'C');
      const st = { at, x: capSt.x, y: capSt.y, s: 1, rot: capSt.rot, rim: 0, face: 'neutral', talk: tk, look: [0, 0], headTilt: 0, turn: 0 };
      st.bob = Math.sin(at * 1.6) * 1.2;
      let hL = [-50, -180], hR = [64, -128], cupRot = 0, cupY = 8;
      /* sips (before the line; calm as ever) */
      const sip = win(lt, 1.0, 2.3, .45, .5) + win(lt, 7.3, 8.05, .35, .35);
      hL = [lerp(-50, -10, sip), lerp(-180, -262, sip)]; cupRot = -22 * sip;
      if (sip > .5) st.face = 'proud';
      /* eyes follow the furniture */
      st.look = [keyed(lt, [[0, -.2], [3.4, -.1], [3.7, .3], [4.1, -.7], [5.9, .9], [6.2, -.6], [7.1, .7], [7.4, -.5], [8.1, .6], [8.6, 0]]), keyed(lt, [[0, .1], [3.6, -.3], [4.2, .2]])];
      st.headTilt = swing(lt, 3.75, 4, 6, 2);
      /* line 1 */
      if (lt > L(1) - .1) {
        const pat = win(lt, L(1) - .05, L(1) + 1.1, .3, .3);
        hR = [lerp(64, 76, pat), lerp(-128, -196 + Math.abs(Math.sin((lt - L(1)) * 7)) * 10, pat)];
        st.face = 'proud';
        const reach = prog(lt, L(1) + 1.05, .57, ease) * (1 - prog(lt, tPut, .4, ease));
        if (lt < tPut) { hL = [lerp(hL[0], handTgt[0], reach), lerp(hL[1], handTgt[1], reach)]; cupRot = lerp(cupRot, tilt, reach); }
        else hL = [lerp(-50, handTgt[0], reach), lerp(-174, handTgt[1], reach)];
        st.bob += reach * 6; st.tilt = reach * 3;
        st.look = [lerp(0, .15, reach), lerp(0, .7, reach)];
        if (lt > tPut) {
          const fx = lt < tGl ? .2 : lt < tEdge ? lerp(.2, .55, prog(lt, tGl, tEdge - tGl)) : lt < tLand ? .7 : lt < tDoor ? lerp(.7, 1, prog(lt, tLand, tDoor - tLand)) : 1;
          const fy = lt < tEdge ? .62 : lt < tLand ? lerp(.62, 1, prog(lt, tEdge, tLand - tEdge)) : lerp(1, .2, prog(lt, tLand, tDoor - tLand));
          st.look = [lerp(st.look[0], fx, prog(lt, tPut, .3)), lerp(st.look[1], fy, prog(lt, tPut, .3))];
          if (lt > tEdge) st.face = 'surprise';
          if (lt > tDoor) st.face = 'neutral';
        }
        /* straightens his cap, turns to the boats */
        const capUp = win(lt, L(1) + 3.65, L(1) + 4.05, .22, .2);
        if (capUp > 0) { hR = [lerp(hR[0], 62, capUp), lerp(hR[1], -352, capUp)]; st.headTilt = -3 * capUp + 2 * prog(lt, L(1) + 3.9, .15); st.look = [lerp(1, 0, capUp), lerp(.2, 0, capUp)]; }
        const turn = prog(lt, L(1) + 4.0, .3);
        if (turn > 0) { st.turn = -turn; st.look = [-turn, 0]; st.face = 'neutral';
          const step = prog(lt, L(1) + 4.1, .4, lin); st.x -= step * 40; const w2 = Math.sin(step * Math.PI * 2);
          st.fL = [-22 + w2 * 10, -Math.max(0, w2) * 7]; st.fR = [22 - w2 * 10, -Math.max(0, -w2) * 7]; }
      }
      st.hL = hL; st.hR = hR; st.bendL = 14; st.bendR = -16;
      cap.set(st);
      cupH.set({ x: 0, y: cupY, s: .95, rot: cupRot, tilt: -cupRot * .6, steam: .8, at });
    }

    /* ============================ PART B ============================ */
    if (inB) {
      const tilt = keyed(lt, [[tAB, 5.6], [tBC + dBC, 8.4]], lin);
      deck.setTilt(tilt); deck.setSlide(lerp(470, 560, prog(lt, tAB, tBC - tAB, lin)));
      deck.setBoat(0, keyed(lt, [[tAB, .12], [L(5), .86]], lin));
      deck.setBoat(1, prog(lt, Le(5) + .15, 1.0, ease) * .62);
      deck.anim(at);
      const cv = kv(lt, [[tAB, 340, 598, 1.32], [L(2) + 1.9, 372, 598, 1.3], [L(3) - .35, 720, 600, 1.12], [L(3) + 2.2, 1280, 598, 1.2], [L(4) + .4, 1296, 598, 1.22], [Le(5) - .1, 1330, 594, 1.22], [tBC + dBC, 1380, 570, 1.18]]);
      const cw = deck.toWorld(cv[0], cv[1]); camSet(camB, cw[0], cw[1], cv[2]);
      const crot = -tilt * .85;
      /* --- the band: plays on, calm; eyes close once the sheets have flown --- */
      const memo = prog(lt, sheetT[3] + .6, 1.2);
      band.forEach((R, i) => {
        const [x, y] = BR[i]; const sv = bandSt[i]; sv.x = x; sv.y = y; sv.rot = crot;
        const lk = win(lt, sheetT[i] - .1, sheetT[i] + 1.4, .3, .5);
        R.set({ at: at + i * .7, x, y, s: 1, rot: crot, play: 1, face: 'proud', lid: memo * .75, look: [lk * .8, -lk * .7], rim: .55, rimSide: -1 });
      });
      stands.forEach((sd, j) => {
        const t0 = sheetT[j], fly = flySheets[j];
        op(sd.sheet, lt < t0 ? 1 : 0);
        if (lt < t0 || lt > t0 + 3.4) { op(fly, 0); return; }
        const u = (lt - t0) / 3.4, p0 = deck.toWorld(sd.x, sd.y - 178);
        const x = p0[0] + 300 * u + 60 * Math.sin(u * 7 + j) * u, y = p0[1] - 420 * easeOut(u) + 30 * Math.sin(u * 9 + j);
        tf(fly, x, y, -3 + u * 260 * (j % 2 ? -1 : 1), 1 - u * .35, (1 - u * .35) * Math.cos(u * 11 + j));
        op(fly, 1 - prog(u, .7, .3, lin));
      });
      stands.forEach((sd, j) => { if (lt < sheetT[j]) tf(sd.sheet, 0, -178, -3 + Math.sin(at * 9 + j) * 4 * prog(lt, sheetT[j] - .7, .5)); });
      notesB(lt, t0 => 1);
      /* --- the lady, Mitzi, the tower, the officer ---
         left → right: tower (hops 1012 → 1090) · officer (by the rail 1318, blocks at 1222) · lady (1100 → 1462) */
      const tScoop = L(3) - .15, tGo = L(3) + .45, tArr = L(3) + 2.4, tUp = L(5) - .1, tIn = L(5) + 1.0, tInE = L(5) + 1.4;
      const LX0 = 1132, LX1 = 1462, LY = 822;
      const lst = { at, x: LX0, y: LY, s: 1.1, rot: crot, face: 'worried', rim: .45, fan: 1 };
      /* during line 2: dithering, fanning, glancing at the boat */
      lst.turn = .35 * Math.sin(lt * 1.3) + .2; lst.look = [.7, -.3 + .2 * Math.sin(lt * .9)];
      lst.hR = [38, -250 + Math.sin(at * 3) * 6]; lst.hL = [-40, -150]; lst.bob = Math.sin(at * 2) * 1.5;
      const scoop = win(lt, tScoop, tScoop + .7, .25, .35);
      if (lt > tScoop) { lst.face = 'smug'; lst.talk = cue.talk(lt, 'P'); lst.bob = scoop * 22; lst.tilt = scoop * 6; lst.turn = .4; lst.look = [.4, .4 * scoop]; }
      const carry = prog(lt, tScoop + .4, .25);
      if (carry > 0) { lst.hL = [lerp(-40, -30, carry), lerp(-150, -170, carry)]; lst.hR = [lerp(38, 32, carry), lerp(-250, -174, carry)]; }
      const walk = prog(lt, tGo, tArr - tGo, lin);
      if (lt > tGo) {
        lst.x = lerp(LX0, LX1, ease(walk)); const wph = (lt - tGo) * 13;
        const moving = walk < 1 ? 1 : 0, w2 = Math.sin(wph) * moving;
        lst.fL = [-22 + w2 * 18, -Math.max(0, w2) * 9]; lst.fR = [22 - w2 * 18, -Math.max(0, -w2) * 9];
        lst.bob = -Math.abs(Math.cos(wph)) * 5 * moving; lst.walkPh = wph * moving; lst.turn = .65 * moving; lst.look = [.8 * moving, 0]; lst.tilt = 3 * moving;
        lst.talk = cue.talk(lt, 'P');
      }
      if (lt > tArr) { const tb = prog(lt, tArr, .5); lst.turn = lerp(.65, -.45, tb); lst.look = [lerp(.8, -.8, tb), 0]; lst.face = lt > L(4) ? 'surprise' : 'smug'; }
      if (lt > L(4) + .6) { lst.face = 'worried'; lst.look = [-.9, -.1]; }
      /* "Then I choose Mitzi." — holds her up, out towards the officer */
      const hold = prog(lt, tUp, .4) * (1 - prog(lt, L(5) + .72, .3));
      if (lt > tUp) { lst.face = lt < tIn - .2 ? 'proud' : 'happy'; lst.talk = cue.talk(lt, 'P'); lst.turn = -.4; lst.look = [-.7, -.2]; }
      if (carry > 0 && hold > 0) { lst.hL = [lerp(-30, -100, hold), lerp(-170, -334, hold)]; lst.hR = [lerp(32, 40, hold), lerp(-174, -196, hold)]; }
      /* she is handed up into the boat: a little hop, then she is seated in it */
      const inK = prog(lt, tIn, tInE - tIn, ease);
      if (inK > 0) { lst.x = lerp(LX1, 1452, inK); lst.y = lerp(LY, 562, inK) - Math.sin(Math.PI * inK) * 46; lst.s = lerp(1.1, .56, inK); lst.face = 'joy'; lst.fL = [-22, -12 * inK]; lst.fR = [22, -20 * inK]; lst.turn = 0; lst.look = [0, -.3]; }
      const xin = prog(inK, .68, .3, lin), gone = xin >= 1;
      if (lady.fan) op(lady.fan, carry > 0 ? 0 : 1);
      lady.set(lst); op(lady.root, 1 - xin);
      /* Mitzi */
      const MX = 1204;
      const dst = { at, x: MX, y: LY + 2, s: .62, rot: crot, face: 'happy', wag: .7 };
      if (lt < tScoop) { dst.face = lt > L(2) + 2 ? 'smug' : 'happy'; dst.flip = Math.sin(lt * .8) > .6; }
      if (lt > tScoop) {
        const hp = toPar(lst, [lerp((lst.hL[0] + lst.hR[0]) / 2, lst.hL[0] + 6, hold), lerp((lst.hL[1] + lst.hR[1]) / 2 + 24, lst.hL[1] + 18, hold)]);
        const j = prog(lt, tScoop + .1, .45, ease);
        dst.x = lerp(MX, hp[0], j); dst.y = lerp(LY + 2, hp[1], j) - Math.sin(Math.PI * j) * 90; dst.jump = Math.sin(Math.PI * j) * .7;
        dst.s = .62 * (lst.s / 1.1); dst.flip = hold > .5 || (lt > tArr && lt < tUp); dst.face = lt > L(4) && lt < tUp ? 'worried' : 'happy'; dst.rot = lst.rot + (lst.tilt || 0) * .5;
      }
      mitzi.set(dst); op(mitzi.root, 1 - xin);
      /* the tower of suitcases hops after her */
      const tHop0 = L(3) + .6, tStop = L(4) + .1, TX0 = 1012, TX1 = 1090;
      const HP = .3, NH = Math.max(1, Math.round((tStop - tHop0) / HP)), hopT = clamp(lt - tHop0, 0, NH * HP), nh = Math.min(NH - 1, Math.floor(hopT / HP)), hf = lt >= tHop0 + NH * HP ? 1 : (hopT - nh * HP) / HP;
      const hopping = lt > tHop0 && lt < tHop0 + NH * HP;
      const tx = TX0 + (TX1 - TX0) * (nh + ease(hf)) / NH;
      const slump = prog(lt, tIn + .1, .6, easeOut);
      tower.set({ x: lt < tHop0 ? TX0 : tx, y: LY - 10, s: .95, rot: crot * .6, at, hop: hopping ? Math.sin(Math.PI * hf) : 0,
        sway: (hopping ? Math.sin(Math.PI * 2 * hf) * 5 : 0) + swing(lt, tHop0 + NH * HP, 10, 6.5, 1.3) + Math.sin(at * 1.7) * 2 * (1 - slump), slump });
      /* the officer */
      const ftk = cue.talk(lt, 'F');
      const OX0 = 1318, OY0 = 796, OX1 = 1222, OY1 = 812;
      const ost = { at, x: OX0, y: OY0, s: 1.04, rot: crot, face: 'neutral', talk: ftk, turn: -.3, look: [-.5, 0], rim: .5, hL: [-40, -132], hR: [40, -132] };
      ost.bob = Math.sin(at * 1.5) * 1.2;
      ost.look = [lerp(-.6, .7, prog(lt, L(3) + 1.0, 1.4)), 0]; ost.turn = lerp(-.3, .3, prog(lt, L(3) + 1.0, 1.4));
      const block = prog(lt, L(4) - .45, .45);
      if (block > 0) { ost.x = lerp(OX0, OX1, block); ost.y = lerp(OY0, OY1, block); ost.s = lerp(1.04, 1.07, block);
        const w2 = Math.sin(block * Math.PI * 2) * (block < 1 ? 1 : 0); ost.fL = [-22 + w2 * 10, -Math.max(0, w2) * 6]; ost.fR = [22 - w2 * 10, -Math.max(0, -w2) * 6];
        ost.turn = -.6; ost.look = [-.9, -.25]; ost.face = 'focus'; }
      const fing = win(lt, L(4) - .15, L(5) + .25, .25, .3);
      ost.hL = [lerp(-40, -64, fing), lerp(-132, -342, fing)]; op(finger, fing > .5 ? 1 : 0);
      if (lt > L(4) + .95 && lt < L(5)) { ost.turn = .35; ost.look = [.85, 0]; ost.face = 'neutral'; }
      if (lt > L(5)) { ost.turn = .5; ost.look = [.85, -.2]; ost.face = 'happy'; }
      const helpK = prog(lt, L(5) + .62, .42);
      if (helpK > 0) { ost.x = lerp(OX1, 1306, helpK); ost.y = lerp(OY1, 806, helpK); ost.hR = [lerp(40, 96, helpK), lerp(-132, -210, helpK)]; const w2 = Math.sin(helpK * Math.PI * 3) * (helpK < 1 ? 1 : 0); ost.fL = [-22 + w2 * 10, -Math.max(0, w2) * 6]; ost.fR = [22 - w2 * 10, -Math.max(0, -w2) * 6]; }
      const lift = win(lt, tIn - .1, tInE + .1, .15, .2);
      if (lift > 0) ost.hR = [96, -210 - lift * 70];
      const salute = prog(lt, Le(5) + .25, .35);
      if (salute > 0) { ost.hR = [lerp(96, 50, salute), lerp(-210, -352, salute)]; ost.look = [.5, -.6]; ost.face = 'proud'; ost.turn = .4; }
      officer.set(ost);
      /* the lady and Mitzi in the boat */
      const inB2 = xin;
      op(ladyBoat.root, inB2); op(mitziBoat.root, inB2);
      if (inB2 > 0) {
        const bx = 72, by = 86, bounce = swing(lt, tInE, 7, 12, 4);
        ladyBoat.set({ at, x: bx, y: by + bounce, s: .5, sit: true, face: lt < Le(5) + .5 ? 'joy' : 'happy', look: [-.6, .3], turn: -.25, hL: [-26, -170], hR: [30, -172], rim: .4 });
        mitziBoat.set({ at, x: bx - 2, y: by - 84 + bounce, s: .32, face: 'happy', wag: .9 });
      }
    }

    /* ============================ PART C ============================ */
    if (inC) {
      const zn = kv(lt, [[tBC, 548, 548, 1.62], [Le(6) + .1, 544, 546, 1.55], [L(7) + .35, 800, 450, .82], [DUR, 794, 448, .85]]);
      const zf = kv(lt, [[tBC, 960, 444, 1.1], [Le(6) + .1, 952, 445, 1.08], [L(7) + .35, 800, 446, 1.0], [DUR, 798, 446, 1.012]]);
      camSet(nearC, zn[0], zn[1], zn[2]); camSet(farC, zf[0], zf[1], zf[2]);
      skyC.anim(at); seaC.anim(at);
      /* the ship: lights out, breaks in two, slips under */
      const tOut = L(7) + .2, tSplit = L(7) + 1.0, tSink0 = L(7) + 2.9, tSink1 = L(7) + 4.95;
      const sx = keyed(lt, [[tBC, 1320], [L(7) + .3, 1170], [DUR, 1165]]), ss = keyed(lt, [[tBC, .38], [L(7) + .3, .36], [DUR, .355]]);
      ship.set({ x: sx, y: HZ + 2, s: ss, tilt: keyed(lt, [[tBC, 7.5], [tSplit, 9], [tSplit + 2.4, 13], [tSink1, 14]]), split: keyed(lt, [[tSplit, 0], [tSplit + .9, .36], [tSplit + 1.5, .46], [tSplit + 2.4, 1]]),
        sink: lerp(.025, 1, prog(lt, tSink0, tSink1 - tSink0, t => t * t * (3 - 2 * t))), lights: 1 - prog(lt, tOut, .8, lin), smoke: 0, boats: 0, wind: .3 });
      ship.anim(at);
      notesC(lt, (t0, t) => (1 - prog(t0, tOut - 1.4, .6, lin)) * (1 - prog(t, tOut - .3, .9, lin)));
      const rp = clamp((lt - (tSink1 - .5)) / 3);
      rings.forEach((r, i) => { const q = clamp(rp * 1.3 - i * .18); r.setAttribute('cx', f2(sx)); r.setAttribute('cy', f2(HZ + 3)); r.setAttribute('rx', f2(30 + q * 190)); r.setAttribute('ry', f2(3 + q * 9)); op(r, q > 0 && q < 1 ? (1 - q) * .55 : 0); });
      farBoats.forEach((fb, i) => { const dx = (lt - tBC) * (fb.fl ? -6 : 7);
        fb.b.set({ x: fb.x + dx, y: fb.y, s: fb.s, flip: fb.fl, row: (lt - tBC) * .45 * (1 - prog(lt, L(7) + 1, 1.5)) + fb.ph, lower: 1 }); fb.b.anim(at); });
      /* foreground boat (drifting, oars shipped) */
      nb.set({ x: NBX + (lt - tBC) * 2.5, y: NBY, s: NBS, row: .22, lower: 1 }); nb.anim(at); op(nearOars, 0); op(farOars, 0);
      const watch = prog(lt, Le(6) + .3, 1.4);          /* everyone turns to watch the ship */
      const grief = prog(lt, tSplit, 1.2), bow = prog(lt, tSink1 - .2, 1.6);
      const sh = [.62, -.25];
      const P0 = { x: 0, y: PY, s: PS, sit: true };
      /* wireless operator */
      const wst = Object.assign({}, P0, { at: at + 1.3, x: SEATX.w, noLegs: true, face: grief > .5 ? 'sad' : 'worried',
        look: [lerp(.4, sh[0], watch), lerp(-.1, sh[1], watch) + bow * .9], turn: .35 * watch, headTilt: bow * 6, rim: .5, rimSide: 1 });
      wire.set(wst);
      /* the lady + Mitzi */
      const lst = Object.assign({}, P0, { at: at + .4, x: SEATX.l, face: grief > .5 ? 'sad' : 'neutral',
        look: [lerp(.7, sh[0], watch), lerp(.5, sh[1], watch) + bow * .8], turn: lerp(.35, .4, watch), headTilt: bow * 7, rim: .5, rimSide: 1 });
      ladyC.set(lst);
      mitziC.set({ at, x: SEATX.l - 3, y: PY - 40, s: .22, face: grief > .3 ? 'worried' : 'happy', wag: .25 * (1 - grief) });
      tf(ladyHands, SEATX.l, PY - 46, 0, 1);
      /* the Owner and PRACTICALLY */
      const tPk0 = L(6) + .2, tPk1 = L(6) + .65, tLap = L(6) + 1.1, tS0 = L(6) + 1.15, SL = .7, tFlat = tS0 + 3 * SL;
      const ost = Object.assign({}, P0, { at: at + 2.1, x: SEATX.o, noLegs: true, face: 'think', look: [0, .75], headTilt: 5, rim: .5, rimSide: 1 });
      const WY = -150;                                   /* the word lies across his lap, just above the gunwale */
      let hL = [-44, -132], hR = [44, -132], wl = [0, WY], wc = 1, ws = .27, wrot = -3, wv = 0;
      const toPk = win(lt, tPk0 - .3, tLap, .35, .45);
      if (lt < tPk1) { hR = [lerp(44, 36, toPk), lerp(-132, -176, toPk)]; }
      else if (lt < tLap) { const u = prog(lt, tPk1, tLap - tPk1); hR = [lerp(36, 6, u), lerp(-176, WY + 4, u)]; wl = [hR[0], hR[1] - 6]; wv = 1; }
      else wv = 1;
      pocket.set({ s: lt < tPk1 ? 1.3 : 0 });
      if (lt >= tLap) {
        hL = [-10, WY + 4]; hR = [10, WY + 4];
        if (lt < tFlat) {
          const k = Math.min(2, Math.floor((lt - tS0) / SL)), u = clamp(((lt - tS0) - k * SL) / SL), sp = Math.sin(Math.PI * Math.min(1, u * 1.15));
          const reach = 30 + 46 * (k + 1) / 3;
          hL = [-8 - sp * reach, WY + 4 + Math.sin(u * 6) * 2]; hR = [8 + sp * reach, WY + 4 + Math.sin(u * 6 + 1) * 2];
          wc = lt < tS0 ? 1 : lerp(1 - k / 3, 1 - (k + 1) / 3, ease(u));
          ost.face = 'focus';
        } else { wc = 0; const hold2 = prog(lt, tFlat, .5); hL = [lerp(-60, -100, hold2), WY + 4 - hold2 * 4]; hR = [lerp(60, 100, hold2), WY + 4 - hold2 * 4]; ost.face = lt > tFlat + 1.2 ? 'sad' : 'think'; }
        wl = [0, WY - prog(lt, tFlat, .5) * 4]; wrot = lerp(-3, -1, prog(lt, tFlat, .5));
      }
      ost.hL = hL; ost.hR = hR; ost.bendL = 24; ost.bendR = -24;
      if (watch > 0) { ost.look = [lerp(0, sh[0], watch), lerp(.75, sh[1], watch) + bow * 1.05]; ost.turn = .3 * watch; ost.headTilt = lerp(5, 0, watch) + bow * 6; ost.face = grief > .5 ? 'sad' : ost.face; }
      owner.set(ost);
      const wp = toPar(ost, wl);
      /* smoothing kS: 0 = wad … 1 = flat.  Stroke 1 loosens the wad; then the strip is opened and stretched flat */
      const kS = 1 - wc, SW = .34, wadO = 1 - prog(kS, SW - .05, .08, lin), flatO = prog(kS, SW - .05, .08, lin);
      const cW = lerp(1, .62, clamp(kS / SW));
      wordW.set({ x: wp[0], y: wp[1], s: wv && wadO > 0 ? ws * 1.15 * (1 + kS * 1.2) / (.4 + .6 * cW) : 0, rot: wrot + 8 + kS * 30, crumple: cW, at }); op(wordW.g, wv ? wadO : 0);
      const uF = clamp((kS - SW) / (1 - SW));
      word.set({ x: 0, y: 0, s: ws, crumple: 0, flutter: .22 * uF * (1 - watch * .7), at });
      tf(wordWrap, wp[0], wp[1], lerp(9, wrot, ease(uF)), lerp(.5, 1, ease(uF)), lerp(.62, 1, ease(uF)));
      op(wordWrap, wv ? flatO : 0); op(creases, 1 - uF);
      /* the lookout */
      const kst = Object.assign({}, P0, { at: at + 3.3, x: SEATX.k, noLegs: true, face: grief > .5 ? 'sad' : 'neutral',
        look: [lerp(.2, sh[0], watch), lerp(-.2, sh[1], watch) + bow * .9], turn: lerp(.2, .45, watch), headTilt: bow * 6, rim: .6, rimSide: 1 });
      look.set(kst);
    }
  };
}});
