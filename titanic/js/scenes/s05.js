"use strict";
/* =====================================================================
   SCENE 5 — "Lifeboats, anyone?"   (the cold boat deck at night, 46.4 s)
   Sets: P = the long boat deck seen from high up (16 white boats in davits, 4 flat collapsibles A–D),
         D = bgDeck under a huge chalk blackboard, L = a boat creaking down the black hull (+ wireless
         inset, the sea, the two ships), C = the nearby ship that stayed put (cut-away cabin).
   Beat sheet (lt; L# = script line):
   0.0–3.3   L0  P  establishing: rows of boats in davits, tiny officers coaxing passengers in evening dress.
   3.3–10.3  L0  D  the Shipbuilder chalks "≈ 2,200 people" / "20 lifeboats" / "room for ≈ 1,178" as they are
                    spoken; the chalk snaps in half on the last digit (≈9.95); the Owner nods, finger up, twirls.
   9.8–11.6  L1  D  the Owner struts over and slaps a big gold star beside "20 lifeboats".
   11.6–13.6 L1  P  insert: the Owner (foreground) sweeps his cane over the 16 davit boats (each pings as
                    counted, a "16" tag on "sixteen"), then to the 4 collapsibles, which sparkle.
   13.6–16.6 L2  D  the Shipbuilder sketches two stick figures sharing one chair, ½ each, wobbling.
   16.4–18.9 L3  D  the Owner measures a deckchair with a tape, then chalks an X on the cushion end.
   19.0–23.0 L4  D  the bearded rulebook on its lectern creaks open, coughs dust, a moth flutters out across
                    the board; the Owner peels his star off, hides it behind his back and whistles.
   23.0–26.3 L5  D  whip-pan (a near post flicks past): an Officer waves the Lady to a boat; she looks at it,
                    then up at the huge glowing funnel (camera tilts up), and back; Mitzi nods on the bench.
   26.3–32.0 L6  L  a boat stencilled CAPACITY 65 creaks down the hull in jerks: a handful aboard, spread
                    over rows of empty benches; "about 28" tag on the number.
   32.0–35.6 L7  L  the camera looks out to sea; inset: the Wireless operator, calm, taps his key; SOS rings
                    go out, a single reply ring crosses the sea from a far ship; a pocket watch = hours away.
   35.6–39.3 L8  D  a quiet stretch of deck: the Officer shrugs and waves; the Owner hops into a half-empty boat
                    and pins on a huge TESTED rosette.
   39.3–41.2 L9  D  white rockets burst overhead; the Officer flashes a Morse lamp at a small lit ship on the
                    horizon, no reply; the Owner's boat sinks out of frame on its falls, him waving.
   41.2–46.4 L9  C  aboard that ship: two sailors in mufflers watch the far rockets; thought bubble cake → "?";
                    push-in below decks to their wireless operator snoring in a nightcap by his set marked OFF.
   ===================================================================== */
SCENE(5, { build(world, cue) {
  const L = cue, Le = cue.e, DUR = cue.d;
  const CH = '#F6F4EC';
  /* ---- shot boundaries ---- */
  const T_B1 = L(0) + 1.3;                    // P establishing → board
  const T_P2 = L(1) + .85, T_B2 = L(2) - .3;  // P insert
  const T_PAN = L(5) - .5;                    // whip-pan board → boat
  const T_LOW = L(6) - .25;                   // boat creaks down the side
  const T_TEST = L(8) - .3;                   // the Owner tests a boat
  const T_SHIP = L(9) + 1.65;                 // the nearby ship

  /* ================= helpers ================= */
  const P = (x, y) => f2(x) + ',' + f2(y);
  const camSet = (g, cx, cy, z) => g.setAttribute('transform', `translate(800,450) scale(${f2(z * 1000) / 1000}) translate(${f2(-cx)},${f2(-cy)})`);
  const camK = (g, t, K) => { const v = keyed(t, K.map(k => [k[0], k.slice(1)])); camSet(g, v[0], v[1], v[2]); return v; };
  /* starfield in a handful of paths (dots = zero-length round-capped segments) */
  const stars = (p, x0, y0, w, h, n, seed) => {
    const g = G(p), B = [[1.5, '#FFFFFF'], [2.3, '#FFFFFF'], [3.3, '#FFF1D2'], [1.5, '#D2E0FF'], [2.3, '#FFFFFF'], [3.4, '#FFFFFF']], ds = B.map(() => '');
    for (let i = 0; i < n; i++) {
      const hx = hash(i * 1.37 + seed * 9.1), hy = hash(i * 2.71 + seed * 3.3), hr = hash(i * 4.13 + seed * 1.9);
      ds[(hr > .95 ? 2 : hr > .72 ? 1 : 0) + (i % 2) * 3] += `M${f2(x0 + hx * w)},${f2(y0 + Math.pow(hy, 1.25) * h)}h.01`;
    }
    const ps = B.map(([sw, c], i) => E('path', { d: ds[i] || 'M0,0', stroke: c, 'stroke-width': sw, 'stroke-linecap': 'round' }, g));
    g.anim = at => { ps[1].setAttribute('opacity', f2(.65 + .35 * Math.sin(at * 1.7))); ps[2].setAttribute('opacity', f2(.6 + .4 * Math.sin(at * 2.3 + 1))); ps[4].setAttribute('opacity', f2(.65 + .35 * Math.sin(at * 1.3 + 2.4))); ps[5].setAttribute('opacity', f2(.6 + .4 * Math.sin(at * 2.9 + .7))); };
    return g;
  };
  /* chalk text revealed left→right with a clip */
  const chalkRow = (p, x, y, str, size, w, col = CH) => {
    const id = uid('ck'), cp = E('clipPath', { id }, DEFS), r = E('rect', { x: x - 8, y: y - size * 1.05, width: 0, height: size * 1.5 }, cp);
    const g = G(p, { 'clip-path': `url(#${id})` });
    [[1.8, 1.6, .16], [0, 0, .97]].forEach(([dx, dy, a]) => { const t = TX(g, x + dx, y + dy, str, size, col, { hand: true, w: 700, op: a }); t.setAttribute('textLength', w); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); });
    g.k = -1; g.set = k => { k = clamp(k); if (k !== g.k) { g.k = k; r.setAttribute('width', f2((w + 18) * k)); } };
    g.x = x; g.w = w; g.y = y; g.set(0); return g;
  };
  /* a path that draws itself (pathLength 1) */
  const drawPath = (p, d, w = 5, col = CH, o = .92) => { const e = E('path', { d, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, p); e._o = o; e.k = -1; return e; };
  const setDraw = (e, k) => { k = clamp(k); if (k === e.k) return; e.k = k; e.setAttribute('stroke-dashoffset', f2(1 - k)); e.setAttribute('opacity', k > .002 ? e._o : 0); };
  /* morse: on/off timeline from a pattern ('.', '-', ' ' = letter gap) */
  const morse = (pat, u) => { const on = []; let t = 0; for (const c of pat) { if (c === ' ') { t += u * 2; continue; } const d = c === '.' ? u : u * 3; on.push([t, t + d]); t += d + u; } return { on, len: t + u * 4 }; };
  const morseAt = (M, t) => { if (t < 0) return 0; t %= M.len; for (const [a, b] of M.on) if (t >= a && t < b) return 1; return 0; };
  /* walking: feet + bob from the horizontal speed (pure function of lt) */
  const walkPose = (X, t, stride = 40) => { const v = Math.abs(X(t + .05) - X(t - .05)) / .1, m = clamp(v / 140), ph = X(t) / stride * Math.PI, sn = Math.sin(ph);
    return { fL: [-22 + sn * 15 * m, -Math.max(0, sn) * 10 * m], fR: [22 - sn * 15 * m, -Math.max(0, -sn) * 10 * m], bob: -Math.abs(sn) * 6 * m, m }; };
  /* hand target in world → hand in person-local coords (tilt 0) */
  const handTo = (x, y, s, fl, bob, wx, wy, tl = 0) => { const qx = (wx - x) / (s * fl), qy = (wy - y) / s - bob + 112, a = -tl * Math.PI / 180;
    return [qx * Math.cos(a) - qy * Math.sin(a), qx * Math.sin(a) + qy * Math.cos(a) - 112]; };
  /* gold star */
  const mkStar = (p, r) => {
    const g = G(p); let d = '';
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .46 : r; d += (i ? 'L' : 'M') + P(Math.cos(a) * rr, Math.sin(a) * rr); } d += 'Z';
    E('path', { d, fill: '#8A6410', transform: 'translate(3,4)', opacity: .55 }, g);
    E('path', { d, fill: '#F7C93A', stroke: '#B8861A', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d, fill: '#FFF2A8', transform: 'translate(-3,-4) scale(.45)', opacity: .8 }, g);
    return g;
  };
  /* tiny far-away figure (for the high shots) */
  const mini = (p, x, y, s, o) => {
    const g = N(p, x, y, s);
    E('ellipse', { cx: 0, cy: 1, rx: 13, ry: 3.5, fill: '#000', 'fill-opacity': .35 }, g);
    if (o.dress) E('path', { d: 'M-11,0 L-6,-27 L6,-27 L11,0 Z', fill: o.c }, g);
    else E('path', { d: 'M-5,0 V-24 M5,0 V-24', stroke: o.leg || '#1C1F2E', 'stroke-width': 5.5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -8, y: -48, width: 16, height: 26, rx: 7, fill: o.c }, g);
    const arm = G(g); tf(arm, 6, -44); E('path', { d: 'M0,0 L10,14', stroke: o.c, 'stroke-width': 5, 'stroke-linecap': 'round' }, arm);
    E('circle', { cx: 0, cy: -55, r: 7.5, fill: o.skin || '#E9B994' }, g);
    if (o.hat === 'top') { E('rect', { x: -6, y: -76, width: 12, height: 16, fill: '#14151C' }, g); E('rect', { x: -10, y: -62, width: 20, height: 3.5, rx: 1.5, fill: '#14151C' }, g); }
    else if (o.hat === 'cap') { E('path', { d: 'M-9,-59 Q-8,-69 0,-69 Q8,-69 9,-59 Z', fill: '#F0EEE8' }, g); E('rect', { x: -10, y: -61, width: 20, height: 4, rx: 2, fill: '#1A2236' }, g); }
    else if (o.hat === 'plume') { E('path', { d: 'M-14,-58 Q0,-70 14,-58 Z', fill: o.hc || '#5A2E6A' }, g); E('path', { d: 'M4,-64 q10,-12 16,-6', stroke: '#F4F0FF', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g); }
    if (o.rim) E('path', { d: 'M-8,-46 V-24', stroke: '#A8C6FF', 'stroke-width': 2, 'stroke-opacity': .6 }, g);
    g.arm = arm; return g;
  };
  /* small distant steamer with her lights on (origin = waterline centre, ~ 160 px long at s=1) */
  const farShip = (p, x, y, s, o = {}) => {
    const g = N(p, x, y, s);
    E('ellipse', { cx: 0, cy: 6, rx: 110, ry: 6, fill: '#FFD98A', 'fill-opacity': .12 }, g);
    E('path', { d: 'M-80,0 L-74,-16 L78,-16 L86,0 Z', fill: '#15171F' }, g);
    E('rect', { x: -40, y: -27, width: 70, height: 11, fill: '#C9C4B8' }, g);
    E('rect', { x: -22, y: -36, width: 30, height: 9, fill: '#B9B4A8' }, g);
    E('rect', { x: -6, y: -58, width: 13, height: 26, fill: '#2A2420' }, g); E('rect', { x: -6, y: -50, width: 13, height: 5, fill: '#D8D2C4' }, g);
    E('path', { d: 'M-62,-16 V-70 M60,-16 V-64 M-62,-64 L60,-58', stroke: '#2A2420', 'stroke-width': 2.2, fill: 'none' }, g);
    let d = ''; for (let i = 0; i < 11; i++) d += `M${-66 + i * 13},-9h.01 `; for (let i = 0; i < 6; i++) d += `M${-34 + i * 11},-21h.01 `;
    E('path', { d, stroke: '#FFE2A0', 'stroke-width': 3.6, 'stroke-linecap': 'round' }, g);
    const lt = G(g); [[-62, -72], [60, -66], [84, -12]].forEach(([lx, ly], i) => { E('circle', { cx: lx, cy: ly, r: 9, fill: i === 2 ? '#7CF0A0' : '#FFF4D6', 'fill-opacity': .25 }, lt); E('circle', { cx: lx, cy: ly, r: 3, fill: i === 2 ? '#9CFFB8' : '#FFFFFF' }, lt); });
    E('path', { d: 'M-70,6 h20 M-30,9 h34 M20,6 h28 M-50,14 h18 M10,15 h22', stroke: '#FFD98A', 'stroke-opacity': .35, 'stroke-width': 2 }, g);
    g.lights = lt; return g;
  };

  /* ===================================================================
     SET P — the long boat deck seen from high up (broadside, oblique):
     8 boats on the far rail, 8 on the near rail, 4 collapsibles on deck
     =================================================================== */
  const SP = G(world), camP = G(SP);
  const HZP = 170, DF = 330, RF = 380, RN = 462, WB = 515, DN = 700;
  E('rect', { x: -900, y: -700, width: 3400, height: 872, fill: lgrad([[0, '#02040C'], [.55, '#060B1E'], [.86, '#101B40'], [1, '#22325F']]) }, camP);
  E('ellipse', { cx: 820, cy: 30, rx: 1200, ry: 90, fill: rgrad([[0, '#A9BCF0', .17], [.6, '#A9BCF0', .05], [1, '#A9BCF0', 0]]), transform: 'rotate(-6 820 30)' }, camP);
  const starsP = stars(camP, -900, -650, 3400, 810, 380, 5);
  E('rect', { x: -900, y: HZP, width: 3400, height: 1200, fill: lgrad([[0, '#14214A'], [.08, '#0A1028'], [.3, '#050816'], [1, '#02030A']]) }, camP);
  E('rect', { x: -900, y: HZP - 1, width: 3400, height: 2, fill: '#5A6A9A', 'fill-opacity': .6 }, camP);
  { let d = ''; for (let i = 0; i < 60; i++) { const x = -800 + hash(i * 3.3) * 3200, y = HZP + 4 + Math.pow(hash(i * 1.7), 1.7) * 150; d += `M${f2(x)},${f2(y)}h${f2(5 + hash(i * 5.1) * 20)}`; } E('path', { d, stroke: '#C9D6FF', 'stroke-opacity': .2, 'stroke-width': 1.5 }, camP); }
  const shipP = farShip(camP, 1480, HZP + 1, .5);
  /* masts + wireless aerial */
  E('path', { d: 'M-330,640 L-380,-160 M1930,640 L1890,-160', stroke: '#24201E', 'stroke-width': 10 }, camP);
  E('path', { d: 'M-374,-80 Q780,40 1894,-80 M-372,-62 Q780,56 1892,-62', stroke: '#9A968E', 'stroke-width': 1.6, fill: 'none', 'stroke-opacity': .55 }, camP);
  /* deck */
  E('rect', { x: -900, y: DF, width: 3400, height: DN - DF, fill: '#5E4C3E' }, camP);
  { let d = '', b = ''; const rowY = i => DF + (DN - DF) * Math.pow(i / 18, 1.15);
    for (let i = 1; i < 18; i++) d += `M-900,${f2(rowY(i))} H2500 `;
    for (let i = 0; i < 18; i++) for (let k = 0; k < 9; k++) { const x = -800 + hash(i * 9.7 + k * 3.1) * 3200; b += `M${f2(x)},${f2(rowY(i) + 1)} V${f2(rowY(i + 1) - 1)} `; }
    E('path', { d, stroke: '#48392E', 'stroke-width': 1.6 }, camP); E('path', { d: b, stroke: '#4C3E33', 'stroke-width': 1.4 }, camP);
    E('rect', { x: -900, y: DF, width: 3400, height: DN - DF, fill: lgrad([[0, '#0A0E22', .5], [.5, '#0A0E22', .15], [1, '#0A0E22', .3]]) }, camP); }
  /* davit helper (drawn behind its boat) */
  const davits = (p, bx, by, s) => { let d = ''; [-1, 1].forEach(sd => { const dx = bx + sd * 158 * s; d += `M${f2(dx)},${f2(by + 20 * s)} V${f2(by - 112 * s)} Q${f2(dx)},${f2(by - 150 * s)} ${f2(bx + sd * 122 * s)},${f2(by - 150 * s)} `; });
    E('path', { d, stroke: '#5E5A54', 'stroke-width': 13 * s + 2.5, fill: 'none', 'stroke-linecap': 'round' }, p); E('path', { d, stroke: '#D8D4CA', 'stroke-width': 8 * s + 1, fill: 'none', 'stroke-linecap': 'round' }, p); };
  /* far row: 8 boats in the gaps between the funnels */
  const boatsP = [];
  const FAR = [70, 345, 455, 665, 775, 985, 1095, 1310], NEAR = [40, 210, 380, 550, 860, 1030, 1200, 1370];
  const farG = G(camP);
  FAR.forEach(x => { const s = .36, y = DF - 6.5; davits(farG, x, y, s); const lb = Lifeboat(farG, {}); lb.set({ x, y, s, lower: 0, drop: 0 }); boatsP.push({ lb, x, y: y - 28, s }); });
  E('rect', { x: -900, y: DF - 70, width: 3400, height: 74, fill: '#0A1030', 'fill-opacity': .22 }, camP);
  { let d = ''; for (let x = -900; x <= 2500; x += 20) d += `M${x},${DF + 1} V${DF - 12} `; E('path', { d, stroke: '#A8A49A', 'stroke-width': 1.8 }, camP); E('path', { d: `M-900,${DF - 12} H2500`, stroke: '#C9C4BA', 'stroke-width': 2.4 }, camP); }
  /* deckhouse: roof band (skylights, cowls) + lit front wall */
  E('path', { d: `M-900,${RN} L2500,${RN} L2500,${RF} L-900,${RF} Z`, fill: '#A6A29A' }, camP);
  E('rect', { x: -900, y: RF, width: 3400, height: RN - RF, fill: lgrad([[0, '#0A1030', .35], [1, '#0A1030', 0]]) }, camP);
  E('rect', { x: -900, y: RN - 8, width: 3400, height: 8, fill: '#CFCBC2' }, camP);
  { let d = ''; for (let x = -880; x < 2500; x += 64) d += `M${x},${RF + 3} L${x + 8},${RN - 9} `; E('path', { d, stroke: '#95918A', 'stroke-width': 2 }, camP); }
  [[-60, 400], [440, 404], [700, 398], [1060, 402], [1380, 398]].forEach(([x, y]) => { E('path', { d: `M${x - 50},${y + 34} L${x + 50},${y + 34} L${x + 40},${y} L${x - 40},${y} Z`, fill: '#C9C5BC' }, camP); E('path', { d: `M${x - 34},${y + 8} L${x + 34},${y + 8} L${x + 38},${y + 28} L${x - 38},${y + 28} Z`, fill: '#FFE2A0', 'fill-opacity': .75 }, camP); });
  E('rect', { x: -900, y: RN, width: 3400, height: WB - RN, fill: '#BDB8AE' }, camP);
  E('rect', { x: -900, y: WB - 6, width: 3400, height: 6, fill: '#8E897E' }, camP);
  { let w = ''; for (let x = -880; x < 2500; x += 56) if (hash(x * .37) > .15) w += `M${x},${RN + 13} h24 v22 h-24 Z `; E('path', { d: w, fill: '#FFD98A' }, camP);
    [120, 760, 1420].forEach(x => { E('rect', { x: x - 20, y: RN + 6, width: 40, height: WB - RN - 6, fill: '#E8B868' }, camP); E('path', { d: `M${x - 20},${WB} L${x - 60},${WB + 60} L${x + 60},${WB + 60} L${x + 20},${WB} Z`, fill: '#FFD98A', 'fill-opacity': .18 }, camP); });
    E('rect', { x: -900, y: WB, width: 3400, height: 50, fill: lgrad([[0, '#FFD98A', .2], [1, '#FFD98A', 0]]) }, camP); }
  const lampP = [-260, 300, 600, 980, 1290, 1600].map(x => { E('circle', { cx: x, cy: RN + 4, r: 6, fill: '#FFF2C4' }, camP); return E('ellipse', { cx: x, cy: RN + 20, rx: 90, ry: 70, fill: rgrad([[0, '#FFE2A0', .35], [.5, '#FFE2A0', .12], [1, '#FFE2A0', 0]]) }, camP); });
  [[-140, 452], [170, 448], [990, 452], [1500, 450]].forEach(([x, y], i) => { const v = G(camP); tf(v, x, y, 0, .55 + hash(i) * .15);
    E('rect', { x: -13, y: -40, width: 26, height: 40, fill: '#C9C4BA' }, v); E('ellipse', { cx: 14, cy: -48, rx: 18, ry: 22, fill: '#D9D4CA' }, v); E('ellipse', { cx: 16, cy: -48, rx: 12, ry: 16, fill: '#8A2E2A' }, v); });
  /* funnels (raked aft = left); the aft one is the dummy, without smoke */
  const FX = [250, 570, 890, 1210], funnelTop = [];
  FX.forEach(fx => {
    const g = G(camP), bx = fx, by = 424, tx = fx - 36, ty = 24, w = 46;
    E('ellipse', { cx: bx, cy: by + 6, rx: w + 14, ry: 12, fill: '#000', 'fill-opacity': .3 }, g);
    const body = `M${bx - w},${by} L${tx - w},${ty} L${tx + w},${ty} L${bx + w},${by} Z`;
    E('path', { d: body, fill: lgrad([[0, '#6E4A1A'], [.25, '#B9853A'], [.55, '#D8A452'], [.8, '#A87430'], [1, '#6A4616']], 0, 0, 1, 0) }, g);
    E('path', { d: body, fill: lgrad([[0, '#05081A', .1], [1, '#05081A', .45]]) }, g);
    let rv = ''; for (let k = 1; k < 8; k++) { const q = k / 8, x0 = lerp(bx - w, tx - w, q), x1 = lerp(bx + w, tx + w, q), y = lerp(by, ty, q); rv += `M${f2(x0)},${f2(y)} L${f2(x1)},${f2(y)} `; } E('path', { d: rv, stroke: '#7A5420', 'stroke-width': 2, 'stroke-opacity': .5 }, g);
    E('path', { d: `M${bx + w - 14},${by} L${tx + w - 14},${ty + 40}`, stroke: '#9A7430', 'stroke-width': 5 }, g); E('path', { d: `M${bx + w - 26},${by} L${tx + w - 26},${ty + 60}`, stroke: '#8A6428', 'stroke-width': 3 }, g);
    const q0 = .16, bandD = `M${f2(lerp(tx - w, bx - w, q0))},${f2(lerp(ty, by, q0))} L${tx - w},${ty} L${tx + w},${ty} L${f2(lerp(tx + w, bx + w, q0))},${f2(lerp(ty, by, q0))} Z`;
    E('path', { d: bandD, fill: '#15151B' }, g);
    E('ellipse', { cx: tx, cy: ty, rx: w + 1, ry: 13, fill: '#2A2A30' }, g); E('ellipse', { cx: tx, cy: ty + 1, rx: w - 7, ry: 9, fill: '#07070B' }, g);
    E('path', { d: `M${bx - w - 7},${by - 9} L${bx + w + 7},${by - 9} L${bx + w + 7},${by + 3} L${bx - w - 7},${by + 3} Z`, fill: '#8E8A80' }, g);
    funnelTop.push([tx, ty]);
  });
  const smokeP = G(camP), puffP = [];
  for (let i = 0; i < 15; i++) puffP.push(E('path', { d: 'M-26,0 a26,26 0 1 0 52,0 a26,26 0 1 0 -52,0 M-8,-8 a18,18 0 1 0 36,0 a18,18 0 1 0 -36,0', fill: '#50546A' }, smokeP));
  /* the four collapsibles A–D lying flat on deck */
  const colP = G(camP), cols = [];
  [[655, 556, .9, 'A'], [815, 556, .9, 'B'], [645, 594, 1, 'C'], [810, 594, 1, 'D']].forEach(([x, y, s, ch]) => { const g = N(colP, x, y, s);
    E('ellipse', { cx: 4, cy: 9, rx: 82, ry: 10, fill: '#000', 'fill-opacity': .35 }, g);
    E('path', { d: 'M-78,0 Q-60,-17 0,-18 Q60,-17 78,0 Q60,13 0,14 Q-60,13 -78,0 Z', fill: '#E8E0CA' }, g);
    E('path', { d: 'M-62,0 Q-48,-11 0,-12 Q48,-11 62,0 Q48,9 0,10 Q-48,9 -62,0 Z', fill: '#8A6A4A' }, g);
    E('path', { d: 'M-40,-9 V8 M-14,-11 V10 M14,-11 V10 M40,-9 V8', stroke: '#6E5236', 'stroke-width': 3 }, g);
    E('path', { d: 'M-78,0 Q-60,13 0,14 Q60,13 78,0', stroke: '#6A4A2C', 'stroke-width': 3.5, fill: 'none' }, g);
    E('path', { d: 'M-70,-6 Q0,-24 70,-6', stroke: '#C9BFA6', 'stroke-width': 2, fill: 'none' }, g);
    TX(g, 0, 8, ch, 24, '#FFF6DC', { a: 'middle', w: 800 });
    const sp = G(g); E('circle', { r: 34, fill: '#FFE27A', 'fill-opacity': .22 }, sp); E('path', { d: 'M0,-28 L5,-5 L28,0 L5,5 L0,28 L-5,5 L-28,0 L-5,-5 Z', fill: '#FFE27A' }, sp);
    g.sp = sp; cols.push(g); });
  /* little people on deck: officers coaxing passengers in evening dress */
  const minis = [
    mini(camP, 470, 640, 1.1, { c: '#23325A', hat: 'cap', rim: 1 }), mini(camP, 420, 634, 1.05, { c: '#1D1E29', hat: 'top' }), mini(camP, 392, 640, 1.05, { c: '#B9A3DA', dress: 1, hat: 'plume' }),
    mini(camP, 1000, 600, .95, { c: '#23325A', hat: 'cap', rim: 1 }), mini(camP, 1058, 596, .95, { c: '#E28C6A', dress: 1, hat: 'plume', hc: '#2E5E6A' }), mini(camP, 1088, 598, .95, { c: '#2B2A36', hat: 'top' }),
    mini(camP, 150, 600, .95, { c: '#23325A', hat: 'cap' }), mini(camP, 1330, 610, .95, { c: '#5C4636' }), mini(camP, 230, 560, .85, { c: '#4E3A66', dress: 1 })];
  /* near rail */
  { let d = ''; for (let x = -900; x <= 2500; x += 28) d += `M${x},${DN} V${DN - 30} `; E('path', { d, stroke: '#8E8A82', 'stroke-width': 3.2 }, camP);
    E('path', { d: `M-900,${DN - 15} H2500`, stroke: '#C9C4BA', 'stroke-width': 3.2 }, camP); E('path', { d: `M-900,${DN - 30} H2500`, stroke: '#8A6A48', 'stroke-width': 6 }, camP); }
  /* near side of the ship below the deck edge */
  E('rect', { x: -900, y: DN, width: 3400, height: 74, fill: '#AEA99F' }, camP);
  { let w = ''; for (let x = -880; x < 2500; x += 46) w += `M${x},${DN + 22} h20 v24 h-20 Z `; E('path', { d: w, fill: '#FFD98A', 'fill-opacity': .9 }, camP); }
  E('rect', { x: -900, y: DN + 74, width: 3400, height: 900, fill: lgrad([[0, '#14161E'], [1, '#08090E']]) }, camP);
  E('rect', { x: -900, y: DN + 72, width: 3400, height: 5, fill: '#C9A34A' }, camP);
  { let d = ''; for (let r = 0; r < 2; r++) for (let x = -880 + r * 17; x < 2500; x += 34) d += `M${x},${DN + 110 + r * 56}h.01 `; E('path', { d, stroke: '#FFD98A', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-opacity': .8 }, camP); }
  /* near row: 8 boats */
  const nearG = G(camP);
  NEAR.forEach(x => { const s = .5, y = DN - 9; davits(nearG, x, y, s); const lb = Lifeboat(nearG, {}); lb.set({ x, y, s, lower: 0, drop: 0 }); boatsP.push({ lb, x, y: y - 40, s }); });
  E('rect', { x: -900, y: DN - 80, width: 3400, height: 84, fill: '#0A1030', 'fill-opacity': .14 }, camP);
  /* counting pings (one per davit boat) */
  const pingG = G(camP), pings = boatsP.map(b => { const g = N(pingG, b.x, b.y - 18, 1); E('circle', { r: 26, fill: 'none', stroke: '#FFE27A', 'stroke-width': 4 }, g); E('path', { d: 'M0,-15 L4,-4 L15,0 L4,4 L0,15 L-4,4 L-15,0 L-4,-4 Z', fill: '#FFF3B0' }, g); op(g, 0); return g; });
  const tag16 = N(camP, 740, 250, 1);
  E('rect', { x: -62, y: -36, width: 124, height: 68, rx: 34, fill: '#1D2B53', stroke: '#F2C230', 'stroke-width': 4 }, tag16); TX(tag16, 0, 16, '16', 44, '#FFE7A0', { a: 'middle', w: 800 });
  /* the Owner, presenting (foreground) */
  const ownerP = castOwner(camP, {}); gagPocketOn(ownerP);
  op(SP, 0);

  /* ===================================================================
     SET D — bgDeck under the huge chalk blackboard
     =================================================================== */
  const SD = G(world), camD = G(SD);
  const dk = bgDeck(camD, { vignette: false });
  const MID = dk.mid;
  /* the nearby ship on the horizon + rockets (level sky layer) */
  const shipD = farShip(dk.sky, 2250, 401, .62);
  const rocketsD = [Rocket(dk.sky, { h: 560, seed: 3, x: 1150, y: 520 }), Rocket(dk.sky, { h: 640, seed: 7, x: 2230, y: 560 }), Rocket(dk.sky, { h: 560, seed: 11, x: 1760, y: 560 })];
  const flashD = E('rect', { x: -1600, y: -1400, width: 4800, height: 2400, fill: '#DCE6FF', opacity: 0 }, dk.sky);
  /* deck + rail continuing aft past the deckhouse (the board camera looks that way) */
  { const ext = G(dk.ship); dk.ship.insertBefore(ext, dk.mid);
    E('rect', { x: -2400, y: 610, width: 1420, height: 900, fill: '#6E5A48' }, ext);
    let d = ''; let y = 610, h = 8; while (y < 1500) { d += `M-2400,${f2(y)} H-1000 `; y += h; h *= 1.09; } E('path', { d, stroke: '#4E3E32', 'stroke-width': 2 }, ext);
    E('rect', { x: -2400, y: 610, width: 1420, height: 900, fill: lgrad([[0, '#0A0E22', .1], [1, '#0A0E22', .35]]) }, ext);
    let r = ''; for (let x = -2400; x <= -1000; x += 46) r += `M${x},610 V478 `; E('path', { d: r, stroke: '#9E998E', 'stroke-width': 6 }, ext);
    E('path', { d: 'M-2400,530 H-1000 M-2400,575 H-1000', stroke: '#C9C4BA', 'stroke-width': 7 }, ext); E('path', { d: 'M-2400,474 H-1000', stroke: '#8A6A48', 'stroke-width': 12 }, ext); E('path', { d: 'M-2400,470 H-1000', stroke: '#A8845E', 'stroke-width': 4 }, ext);
    E('rect', { x: -1000, y: 230, width: 30, height: 386, fill: '#9E998E' }, ext); }
  /* --- the blackboard --- */
  const BX0 = -1150, BX1 = -90, BY0 = 130, BY1 = 650;
  const board = G(MID);
  E('rect', { x: BX0 + 50, y: BY1, width: 24, height: 140, fill: '#4A3222' }, board); E('rect', { x: BX1 - 74, y: BY1, width: 24, height: 140, fill: '#4A3222' }, board);
  E('rect', { x: BX0 - 20, y: BY0 - 20, width: BX1 - BX0 + 40, height: BY1 - BY0 + 40, rx: 8, fill: '#5E3F28' }, board);
  E('rect', { x: BX0 - 20, y: BY0 - 20, width: BX1 - BX0 + 40, height: 7, rx: 3, fill: '#7E5A3C' }, board);
  E('rect', { x: BX0, y: BY0, width: BX1 - BX0, height: BY1 - BY0, fill: lgrad([[0, '#2A3833'], [1, '#1B2521']]) }, board);
  [[-860, 300, 180, 40, -8], [-420, 520, 230, 50, 6], [-300, 260, 160, 36, -4], [-700, 600, 200, 30, 3]].forEach(([x, y, rx, ry, r]) => E('ellipse', { cx: x, cy: y, rx, ry, fill: '#DDE6E0', 'fill-opacity': .05, transform: `rotate(${r} ${x} ${y})` }, board));
  E('path', { d: 'M-1100,600 q40,-30 80,0 t80,0 M-300,190 l90,30 M-250,600 q30,-20 60,0', stroke: '#DDE6E0', 'stroke-opacity': .07, 'stroke-width': 5, fill: 'none' }, board);
  E('rect', { x: BX0 - 26, y: BY1 + 6, width: BX1 - BX0 + 52, height: 16, rx: 4, fill: '#6E4A30' }, board);
  E('rect', { x: -980, y: BY1 - 6, width: 60, height: 16, rx: 3, fill: '#3A3A44' }, board); E('rect', { x: -980, y: BY1 - 6, width: 60, height: 6, rx: 3, fill: '#C9B48A' }, board);
  E('rect', { x: -860, y: BY1 + 1, width: 30, height: 7, rx: 3, fill: '#F4F2EA' }, board); E('rect', { x: -800, y: BY1 + 2, width: 22, height: 6, rx: 3, fill: '#F2C9C9' }, board);
  /* title + ship doodle */
  TX(board, -640, 225, 'LIFEBOAT MATHS', 62, CH, { a: 'middle', hand: true, w: 700, ls: 3, op: .95 }).setAttribute('textLength', 560);
  E('path', { d: 'M-918,248 q70,-8 140,0 t140,0 t140,0 t130,0', stroke: CH, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', opacity: .85 }, board);
  { const d0 = G(board); tf(d0, -235, 252, 0, .9);
    E('path', { d: 'M-110,0 L100,0 L120,-22 L-122,-22 Z M-80,-22 V-34 H70 V-22 M-60,-34 l-6,-34 h20 l6,34 M-20,-34 l-6,-34 h20 l6,34 M20,-34 l-6,-34 h20 l6,34 M60,-34 l-6,-34 h20 l6,34', stroke: CH, 'stroke-width': 3, fill: 'none', 'stroke-linejoin': 'round', opacity: .75 }, d0);
    E('path', { d: 'M-104,8 q100,14 200,0', stroke: CH, 'stroke-width': 2, fill: 'none', opacity: .5 }, d0); }
  /* the three rows of maths */
  const RX = -840, rows = [chalkRow(board, RX, 352, '≈ 2,200 people', 54, 380), chalkRow(board, RX, 440, '20 lifeboats', 54, 310), chalkRow(board, RX, 528, 'room for ≈ 1,178', 54, 420)];
  /* the star on the board, beside "20 lifeboats" */
  const SXB = -478, SYB = 420;
  const starB = N(board, SXB, SYB, 1); mkStar(starB, 40); const starGlint = G(starB); E('path', { d: 'M26,-44 l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 l10,-4 Z', fill: '#FFFFFF' }, starGlint); op(starB, 0);
  /* the half-a-seat sketch */
  const SKX = -1046, SKY = 596;
  const SK = G(board); tf(SK, SKX, SKY, 0, .9);
  const sk = [
    drawPath(SK, 'M-40,0 H40 M-36,0 V52 M36,0 V52 M-36,0 V-64 H36 V0 M-36,-34 H36', 5.5),                                   // one chair
    drawPath(SK, 'M-30,-4 L-62,-56 M-74,-92 a16,16 0 1 0 0.1,0 M-60,-48 L-100,-84 M-60,-48 L-34,-96 M-30,-4 L-50,48 M-30,-4 L-86,18', 5.5),  // left figure, one cheek on
    drawPath(SK, 'M30,-4 L62,-56 M74,-92 a16,16 0 1 1 -0.1,0 M60,-48 L100,-84 M60,-48 L34,-96 M30,-4 L50,48 M30,-4 L86,18', 5.5),       // right figure
    drawPath(SK, 'M-112,-50 q-9,11 0,22 M112,-50 q9,11 0,22 M-104,-14 q-8,8 0,16 M104,-14 q8,8 0,16', 3.5, CH, .75)          // wobble marks
  ];
  const half = [TX(SK, -84, -122, '½', 40, CH, { a: 'middle', hand: true, w: 700 }), TX(SK, 84, -122, '½', 40, CH, { a: 'middle', hand: true, w: 700 })];
  half.forEach(h => op(h, 0));
  /* chalk dust puff + the snapped chalk half */
  const dustG = G(MID), dust = [0, 1, 2, 3, 4, 5].map(i => E('circle', { r: 6 + i % 3 * 3, fill: '#F4F2EA' }, dustG));
  const snapFx = G(MID); E('path', { d: 'M0,-20 V-44 M17,-14 L34,-31 M20,4 L44,4 M-17,-14 L-34,-31 M-20,4 L-44,4 M12,18 L28,34 M-12,18 L-28,34', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, snapFx); op(snapFx, 0);
  const chalkBit = G(MID); E('rect', { x: -9, y: -4, width: 18, height: 8, rx: 3, fill: '#F7F5EE', stroke: '#C9C6BC', 'stroke-width': 1 }, chalkBit);
  /* the step the Shipbuilder stands on */
  const step = G(MID);
  E('ellipse', { cx: -560, cy: 792, rx: 560, ry: 12, fill: '#000', 'fill-opacity': .25 }, step);
  E('rect', { x: -1120, y: 706, width: 1010, height: 16, rx: 4, fill: '#9A6A3A' }, step); E('rect', { x: -1120, y: 706, width: 1010, height: 5, rx: 2, fill: '#C08E5A' }, step);
  E('rect', { x: -1100, y: 722, width: 970, height: 18, fill: '#6E4A2C' }, step);
  [-1090, -760, -460, -146].forEach(x => E('rect', { x, y: 722, width: 18, height: 72, fill: '#5A3B22' }, step));
  /* the rulebook on its lectern */
  const lect = G(MID);
  const BKX = 40, BKY = 636;
  E('ellipse', { cx: BKX, cy: 796, rx: 76, ry: 10, fill: '#000', 'fill-opacity': .3 }, lect);
  E('path', { d: `M${BKX - 56},796 L${BKX + 56},796 L${BKX + 32},780 L${BKX - 32},780 Z`, fill: '#4A3020' }, lect); E('rect', { x: BKX - 13, y: BKY + 10, width: 26, height: 772 - BKY, fill: '#5A3B22' }, lect);
  E('rect', { x: BKX - 96, y: BKY - 2, width: 192, height: 18, rx: 4, fill: '#7A5032' }, lect); E('rect', { x: BKX - 96, y: BKY - 2, width: 192, height: 5, rx: 2, fill: '#A87444' }, lect);
  const bookG = N(MID, BKX, BKY, 1), bookIn = G(bookG);
  const beard = G(bookIn); tf(beard, 0, -6);
  E('path', { d: 'M-58,0 Q-66,60 -40,110 Q-24,150 -8,190 Q0,206 6,186 Q18,146 34,110 Q62,60 58,0 Z', fill: '#F2F0EA' }, beard);
  E('path', { d: 'M-40,10 Q-44,70 -18,140 M-14,6 Q-16,90 0,180 M14,6 Q18,80 8,170 M40,10 Q40,70 22,130', stroke: '#C9C6BE', 'stroke-width': 2.4, fill: 'none' }, beard);
  E('path', { d: 'M-50,0 Q-30,20 0,8 Q30,20 50,0', fill: '#FFFFFF' }, beard);
  E('rect', { x: -78, y: -176, width: 156, height: 176, rx: 6, fill: '#E9DCB8' }, bookIn);                 // page block
  { let d = ''; for (let i = 0; i < 9; i++) d += `M-64,${-152 + i * 16} h${70 + hash(i) * 50} `; E('path', { d, stroke: '#8A7A5A', 'stroke-width': 3, 'stroke-opacity': .55 }, bookIn); }
  const coverB = G(bookIn); E('rect', { x: 0, y: -180, width: 160, height: 182, rx: 6, fill: '#5A2E1A' }, coverB); E('rect', { x: 8, y: -172, width: 144, height: 166, rx: 4, fill: '#D9C8A0' }, coverB);
  E('path', { d: 'M30,-150 h90 M30,-130 h70', stroke: '#9A8A6A', 'stroke-width': 3 }, coverB); op(coverB, 0);
  const cover = G(bookIn); tf(cover, -78, 0);
  E('rect', { x: 0, y: -180, width: 160, height: 182, rx: 6, fill: '#6E3A22' }, cover);
  E('rect', { x: 10, y: -170, width: 140, height: 162, rx: 4, fill: 'none', stroke: '#C9A34A', 'stroke-width': 3 }, cover);
  TX(cover, 80, -100, 'RULES', 34, '#E8C25A', { a: 'middle', w: 800, ls: 2 });
  E('path', { d: 'M40,-76 h80 M50,-64 h60', stroke: '#C9A34A', 'stroke-width': 2.5 }, cover);
  E('path', { d: 'M48,-132 q14,-10 26,0 M88,-132 q14,-10 26,0', stroke: '#E6E2D8', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, cover); // bushy brows
  E('path', { d: 'M0,-180 l30,24 M0,-180 l14,30 M160,-180 l-28,22 M160,-180 l-12,30 M0,-150 q12,-8 20,-30 M160,-150 q-12,-8 -20,-30', stroke: '#E8E6F0', 'stroke-width': 1.3, 'stroke-opacity': .7, fill: 'none' }, cover); // cobwebs
  { let d = ''; for (let i = 0; i < 26; i++) d += `M${f2(8 + hash(i * 3.1) * 144)},${f2(-176 + hash(i * 7.7) * 170)}h.01 `; E('path', { d, stroke: '#B9B0A0', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-opacity': .6 }, cover); }
  const bookDust = G(MID), bdust = [0, 1, 2, 3, 4, 5, 6].map(i => E('circle', { r: 10 + (i % 3) * 5, fill: i % 2 ? '#D8D0BE' : '#BDB4A2' }, bookDust));
  const coughG = G(MID); E('path', { d: 'M-70,-40 q-14,-10 -10,-28 M-50,-58 q-6,-16 4,-28 M70,-40 q14,-10 10,-28 M50,-58 q6,-16 -4,-28', stroke: '#FFFFFF', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, coughG); op(coughG, 0);
  const moth = G(MID), mothW = [];
  [-1, 1].forEach(sd => { const w = G(moth); E('path', { d: `M0,0 Q${sd * 18},-20 ${sd * 30},-6 Q${sd * 22},6 0,2 Z`, fill: '#9C8E78' }, w); E('path', { d: `M0,2 Q${sd * 16},14 ${sd * 20},6`, fill: '#857660' }, w); E('circle', { cx: sd * 16, cy: -8, r: 3, fill: '#6A5C48' }, w); mothW.push(w); });
  E('ellipse', { rx: 4, ry: 10, fill: '#6A5C48' }, moth); E('path', { d: 'M-1,-9 q-6,-10 -10,-10 M1,-9 q6,-10 10,-10', stroke: '#6A5C48', 'stroke-width': 1.5, fill: 'none' }, moth);
  /* background: an officer coaxing a reluctant couple in evening dress */
  const coupleM = castPassenger(MID, 3, { lite: true }), coupleW = castPassenger(MID, 1, { lite: true }), officer2 = castOfficer(MID, { lite: true });
  /* the star hidden behind the Owner's back (drawn behind him) */
  const starBack = N(MID, 0, 0, 1); mkStar(starBack, 30); op(starBack, 0);
  /* main cast on deck */
  const sb = castShipbuilder(MID, {});
  const chalkS = G(sb.propL); E('rect', { x: -5, y: -24, width: 10, height: 26, rx: 3, fill: '#F7F5EE', stroke: '#C9C6BC', 'stroke-width': 1 }, chalkS);
  const chalkTip = G(chalkS); E('rect', { x: -5, y: -36, width: 10, height: 14, rx: 3, fill: '#F7F5EE', stroke: '#C9C6BC', 'stroke-width': 1 }, chalkTip);
  const owner = castOwner(MID, {}); gagPocketOn(owner);
  const starH = G(owner.propR); tf(starH, 0, -10); mkStar(starH, 30); op(starH, 0);
  const tape = G(owner.propR), tapeLine = E('path', { stroke: '#E8C23A', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, tape), tapeTicks = E('path', { stroke: '#5A4A1A', 'stroke-width': 1.6, fill: 'none', 'stroke-dasharray': '2 9' }, tape);
  const tapeCase = G(owner.propL); E('circle', { r: 16, fill: '#B8862A' }, tapeCase); E('circle', { r: 8, fill: '#E8C23A' }, tapeCase); op(tapeCase, 0);
  const chalkO = G(owner.propR); E('rect', { x: -4, y: -20, width: 8, height: 18, rx: 3, fill: '#F7F5EE' }, chalkO); op(chalkO, 0);
  const notes = G(MID), noteT = [0, 1, 2].map(i => TX(notes, 0, 0, i % 2 ? '♫' : '♪', 34, '#FFE7A0', { a: 'middle', w: 700 }));
  /* the deckchair with a cushion on its head end (left) */
  const CHX = -600; const chair = G(MID); tf(chair, CHX, 805);
  E('ellipse', { cx: 6, cy: 3, rx: 150, ry: 10, fill: '#000', 'fill-opacity': .3 }, chair);
  E('path', { d: 'M-84,0 L-72,-56 M112,0 L104,-44 M-70,-56 L-128,-168 M-84,-96 L44,-88 M30,-88 V-52', stroke: '#4E2E18', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, chair);
  const slD = 'M-120,-156 L-70,-62 Q-40,-50 60,-52 L136,-34';
  E('path', { d: slD, stroke: '#2F5E86', 'stroke-width': 26, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, chair);
  E('path', { d: slD, stroke: '#EDE6D4', 'stroke-width': 26, fill: 'none', 'stroke-dasharray': '11 13', 'stroke-opacity': .8, 'stroke-linejoin': 'round' }, chair);
  E('path', { d: 'M-84,-96 L44,-88 M60,-52 L136,-34', stroke: '#7A4A26', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, chair);
  E('path', { d: 'M-86,-98 L42,-90', stroke: '#A8703E', 'stroke-width': 2.5, fill: 'none' }, chair);
  const cushion = G(chair); tf(cushion, -112, -136, -62);
  E('rect', { x: -46, y: -26, width: 92, height: 52, rx: 22, fill: '#B8302A' }, cushion); E('path', { d: 'M-24,-26 V26 M0,-26 V26 M24,-26 V26', stroke: '#F4E9D0', 'stroke-width': 7, 'stroke-opacity': .9 }, cushion);
  E('rect', { x: -46, y: -26, width: 92, height: 52, rx: 22, fill: 'none', stroke: '#7A1E1A', 'stroke-width': 3 }, cushion);
  [[-44, -24], [44, -24], [-44, 24], [44, 24]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 5, fill: '#E8C23A' }, cushion));
  const xMark = [drawPath(cushion, 'M-26,-18 L26,18', 9, '#FFFFFF', .97), drawPath(cushion, 'M26,-18 L-26,18', 9, '#FFFFFF', .97)];
  MID.insertBefore(chair, owner.root);   /* he stands in front of the deckchair */
  /* the Lady, Mitzi and the Officer */
  const lady = castPoshLady(MID, {});
  const mitzi = Dog(MID, {}); const capM = gagCap(mitzi.head); capM.set({});
  const off1 = castOfficer(MID, {});
  const lamp = G(off1.propR); tf(lamp, 0, -6);
  E('rect', { x: -14, y: -20, width: 46, height: 34, rx: 6, fill: '#2E3240' }, lamp); E('rect', { x: -10, y: -26, width: 30, height: 8, rx: 3, fill: '#4A4E5E' }, lamp);
  const lens = E('ellipse', { cx: 34, cy: -3, rx: 6, ry: 15, fill: '#5A5E6E' }, lamp);
  op(lamp, 0);
  const beam = E('path', { fill: lgrad([[0, '#FFF6D8', .85], [1, '#FFF6D8', .05]], 0, 0, 1, 0), opacity: 0 }, MID);
  /* in the boat (right): two passengers far apart, and the Owner after his hop */
  const B1 = dk.boats[1];
  const pax1 = castPassenger(B1.seat, 2, { lite: true }), pax2 = castPassenger(B1.seat, 0, { lite: true });
  const ownerB = castOwner(B1.seat, { cane: false }); gagPocketOn(ownerB);
  const roset = G(ownerB.torso); tf(roset, -4, -222);
  { let d = ''; for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, r = i % 2 ? 52 : 62; d += (i ? 'L' : 'M') + P(Math.cos(a) * r, Math.sin(a) * r); } E('path', { d: d + 'Z', fill: '#2E5EA8' }, roset); }
  E('circle', { r: 50, fill: '#D9A928' }, roset); E('circle', { r: 43, fill: '#F7EFD8', stroke: '#B3261E', 'stroke-width': 4 }, roset);
  TX(roset, 0, 9, 'TESTED', 25, '#B3261E', { a: 'middle', w: 800 }).setAttribute('textLength', 72);
  op(roset, 0);
  /* a near post that whips past the lens during the pan (strong parallax) */
  const fgD = G(SD);
  { const x = 200; E('rect', { x: x - 26, y: -900, width: 52, height: 2400, fill: '#1A1410' }, fgD); E('rect', { x: x - 26, y: -900, width: 10, height: 2400, fill: '#3A2E24' }, fgD);
    E('path', { d: `M${x + 26},180 h60 v34`, stroke: '#1A1410', 'stroke-width': 10, fill: 'none' }, fgD); E('circle', { cx: x + 86, cy: 236, r: 22, fill: '#FFE7A8' }, fgD);
    E('circle', { cx: x + 86, cy: 236, r: 90, fill: rgrad([[0, '#FFE2A0', .45], [1, '#FFE2A0', 0]]) }, fgD); }
  op(SD, 0);

  /* ===================================================================
     SET L — down the side: the boat that left with room to spare
     =================================================================== */
  const SL = G(world), camL = G(SL);
  const HZL = 330;
  E('rect', { x: -800, y: -900, width: 3800, height: 1230, fill: lgrad([[0, '#02040C'], [.6, '#070C20'], [.9, '#121D44'], [1, '#1C2A58']]) }, camL);
  E('ellipse', { cx: 1500, cy: -60, rx: 1300, ry: 110, fill: rgrad([[0, '#A9BCF0', .16], [.6, '#A9BCF0', .05], [1, '#A9BCF0', 0]]), transform: 'rotate(10 1500 -60)' }, camL);
  const starsL = stars(camL, -800, -900, 3800, 1220, 420, 9);
  E('rect', { x: -800, y: HZL, width: 3800, height: 1300, fill: lgrad([[0, '#0F1B3E'], [.08, '#080E24'], [1, '#01030A']]) }, camL);
  E('rect', { x: -800, y: HZL - 1, width: 3800, height: 2, fill: '#4C5C8C', 'fill-opacity': .6 }, camL);
  { let d = ''; for (let i = 0; i < 110; i++) { const x = -700 + hash(i * 2.3) * 3600, y = HZL + 6 + Math.pow(hash(i * 1.1), 1.5) * 1100; d += `M${f2(x)},${f2(y)}h${f2(4 + hash(i * 4.4) * 20)}`; } E('path', { d, stroke: '#C9D6FF', 'stroke-opacity': .16, 'stroke-width': 1.6 }, camL); }
  const shipL1 = farShip(camL, 1720, HZL + 1, 1.0);   // the nearby ship, lights on
  E('circle', { cx: 2300, cy: HZL - 6, r: 46, fill: rgrad([[0, '#FFE7B0', .45], [1, '#FFE7B0', 0]]) }, camL);
  const shipL2 = farShip(camL, 2300, HZL + 1, .34);    // the rescuer, hours away
  const rocketL = Rocket(camL, { h: 520, seed: 5, x: 700, y: 300 });
  const floes = G(camL); { let d = '', h = ''; for (let i = 0; i < 16; i++) { const x = 1050 + hash(i * 4.7) * 1500, y = HZL + 30 + Math.pow(hash(i * 2.9), 1.4) * 420, w = 10 + (y - HZL) * .12 * (.6 + hash(i)); d += `M${f2(x - w)},${f2(y)} L${f2(x - w * .6)},${f2(y - w * .25)} L${f2(x + w * .5)},${f2(y - w * .3)} L${f2(x + w)},${f2(y)} Z `; h += `M${f2(x - w * .8)},${f2(y + 3)} h${f2(w * 1.6)} `; }
    E('path', { d, fill: '#C9D6EE', 'fill-opacity': .85 }, floes); E('path', { d: h, stroke: '#9AA8D0', 'stroke-width': 2, 'stroke-opacity': .5 }, floes); }
  /* the hull (side elevation, stern quarter) */
  const WL = 830;
  const hull = G(camL);
  E('path', { d: `M-900,${WL + 40} L900,${WL + 40} Q960,${WL - 20} 990,${WL - 300} L1000,190 L-900,190 Z`, fill: '#101219' }, hull);
  E('path', { d: `M-900,190 L1000,190 L1000,203 L-900,203 Z`, fill: '#C9A34A' }, hull);
  { let d = ''; [280, 400, 520, 650].forEach((y, r) => { for (let x = -880 + r * 20; x < 940 - (y > 600 ? 30 : 0); x += 46) d += `M${x},${y}h.01 `; }); E('path', { d, stroke: '#FFD98A', 'stroke-width': 13, 'stroke-linecap': 'round' }, hull);
    E('path', { d, stroke: '#FFD98A', 'stroke-width': 30, 'stroke-linecap': 'round', 'stroke-opacity': .12 }, hull); }
  { let d = ''; for (let x = -860; x < 980; x += 92) d += `M${x},205 V${WL} `; [340, 460, 585, 720].forEach(y => d += `M-900,${y} H${y > 600 ? 960 : 995} `); E('path', { d, stroke: '#20232E', 'stroke-width': 2 }, hull); }
  E('rect', { x: -900, y: 0, width: 1900, height: 190, fill: '#B9B4AA' }, hull);
  { let w = ''; [40, 118].forEach(y => { for (let x = -880; x < 980; x += 58) w += `M${x},${y} h30 v34 h-30 Z `; }); E('path', { d: w, fill: '#FFD98A' }, hull); }
  E('path', { d: 'M-900,96 H1000 M-900,178 H1000', stroke: '#8E8A82', 'stroke-width': 4 }, hull);
  { let d = ''; [280, 400, 520, 650].forEach((y, r) => { for (let x = -880 + r * 20; x < 940; x += 46) if (hash(x * .13 + y) > .8) d += `M${x},${y}h.01 `; }); E('path', { d, stroke: '#1A1C26', 'stroke-width': 11, 'stroke-linecap': 'round' }, hull); }
  { let d = ''; for (let x = -890; x <= 1000; x += 26) d += `M${x},0 V-30 `; E('path', { d, stroke: '#8E8A82', 'stroke-width': 3 }, hull); E('path', { d: 'M-900,-30 H1000 M-900,-15 H1000', stroke: '#C9C4BA', 'stroke-width': 3.5 }, hull); }
  /* reflections */
  { let d = ''; for (let i = 0; i < 40; i++) { const x = -860 + i * 46; d += `M${x},${WL + 50 + (i % 3) * 14} v${30 + hash(i) * 70} `; } E('path', { d, stroke: '#FFD98A', 'stroke-width': 4, 'stroke-opacity': .2, 'stroke-dasharray': '10 8' }, camL); }
  const foamL = E('path', { stroke: '#9AA8D0', 'stroke-width': 3, fill: 'none', 'stroke-opacity': .6 }, camL);
  /* the davits at the top */
  const BLX = 470, davL = G(camL);
  [BLX - 236, BLX + 236].forEach(x => { E('path', { d: `M${x},-30 V-90 Q${x},-130 ${x + 10},-128`, stroke: '#77736C', 'stroke-width': 20, fill: 'none', 'stroke-linecap': 'round' }, davL); E('path', { d: `M${x},-30 V-90 Q${x},-130 ${x + 10},-128`, stroke: '#D8D4CA', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, davL); E('rect', { x: x - 10, y: -122, width: 20, height: 26, rx: 5, fill: '#5A4A38' }, davL); });
  const fallsL = E('path', { stroke: '#D8C49A', 'stroke-width': 3, fill: 'none' }, camL);
  const creak = G(camL), creakP = [0, 1].map(() => E('path', { stroke: '#FFFFFF', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, creak));
  /* the lowering boat, seen from above: rows of empty benches */
  const bL = G(camL), bLin = G(bL);
  const rim = 'M-262,0 Q-190,-54 0,-56 Q190,-54 262,0 Q190,54 0,56 Q-190,54 -262,0 Z';
  E('ellipse', { cx: 0, cy: 70, rx: 250, ry: 30, fill: '#000', 'fill-opacity': .25 }, bLin);
  E('path', { d: 'M-262,0 Q-190,54 0,56 Q190,54 262,0 Q210,88 0,104 Q-210,88 -262,0 Z', fill: '#E9E4D8' }, bLin);
  E('path', { d: 'M-240,40 Q0,74 240,40', stroke: '#C9C2B2', 'stroke-width': 2, fill: 'none' }, bLin);
  const cap65 = TX(bLin, 0, 88, 'CAPACITY 65', 26, '#22305A', { a: 'middle', w: 800, ls: 2 }); cap65.setAttribute('textLength', 220);
  const capGlow = E('rect', { x: -124, y: 62, width: 248, height: 36, rx: 8, fill: '#FFE27A', opacity: 0 }, bLin);
  E('path', { d: rim, fill: '#7A5A3C' }, bLin);
  E('path', { d: 'M-236,0 Q-170,-42 0,-44 Q170,-42 236,0 Q170,42 0,44 Q-170,42 -236,0 Z', fill: '#9A7650' }, bLin);
  { let d = ''; for (let i = -3; i <= 3; i++) d += `M-210,${i * 11} Q0,${i * 12.5} 210,${i * 11} `; E('path', { d, stroke: '#7E5E3E', 'stroke-width': 1.6, fill: 'none' }, bLin); }
  const THW = [-180, -128, -76, -24, 28, 80, 132, 184];
  THW.forEach(x => { const h = 40 * Math.sqrt(1 - Math.pow(x / 240, 2)); E('rect', { x: x - 9, y: -h, width: 18, height: 2 * h, rx: 3, fill: '#D2AE7C' }, bLin); E('rect', { x: x - 9, y: -h, width: 5, height: 2 * h, rx: 2, fill: '#E9CB9C' }, bLin); });
  E('path', { d: rim, fill: 'none', stroke: '#6A4A2C', 'stroke-width': 9 }, bLin); E('path', { d: rim, fill: 'none', stroke: '#C08A55', 'stroke-width': 3 }, bLin);
  /* the handful aboard: seated minis seen from above (spread out like a sparse picnic) */
  const seated = (p, x, y, c, hat, skin) => { const g = N(p, x, y, 1);
    E('ellipse', { cx: 0, cy: 6, rx: 15, ry: 9, fill: shade(c, -.25) }, g); E('rect', { x: -14, y: -26, width: 28, height: 30, rx: 12, fill: c }, g);
    E('circle', { cx: 0, cy: -34, r: 11, fill: skin || '#F0C49E' }, g);
    if (hat === 'top') { E('rect', { x: -8, y: -62, width: 16, height: 20, fill: '#16171E' }, g); E('rect', { x: -13, y: -45, width: 26, height: 5, rx: 2, fill: '#16171E' }, g); }
    else if (hat === 'plume') { E('path', { d: 'M-18,-38 Q0,-54 18,-38 Z', fill: '#2E5E6A' }, g); E('path', { d: 'M6,-46 q12,-16 22,-8', stroke: '#F4F0FF', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g); }
    else if (hat === 'cap') { E('path', { d: 'M-12,-40 Q0,-52 12,-40 Z', fill: '#F0EEE8' }, g); E('rect', { x: -13, y: -42, width: 26, height: 5, rx: 2, fill: '#1A2236' }, g); }
    else if (hat === 'bun') E('circle', { cx: 0, cy: -46, r: 7, fill: '#C9C5BE' }, g);
    return g; };
  const crew = [seated(bLin, -232, -2, '#23325A', 'cap'), seated(bLin, -128, -16, '#1D1E29', 'top'), seated(bLin, -128, 18, '#E28C6A', 'plume'), seated(bLin, 28, 4, '#4E3A66', 'bun', '#EFC7A6'), seated(bLin, 132, -18, '#3E4A5E', 'top'), seated(bLin, 184, 20, '#B9A3DA', 'plume')];
  const paper = G(crew[4]); E('rect', { x: -20, y: -34, width: 40, height: 28, rx: 2, fill: '#EDE8DA', transform: 'rotate(-8)' }, paper); E('path', { d: 'M-14,-26 h22 M-14,-19 h26 M-14,-12 h18', stroke: '#8A8478', 'stroke-width': 2, transform: 'rotate(-8)' }, paper);
  const waveArm = G(crew[5]); tf(waveArm, 10, -20); E('path', { d: 'M0,0 L10,-30', stroke: '#B9A3DA', 'stroke-width': 7, 'stroke-linecap': 'round' }, waveArm); E('path', { d: 'M10,-32 l8,-10 l6,8 Z', fill: '#FFFFFF' }, waveArm);
  /* "about 28" chalk tag */
  const tag28 = G(camL); TX(tag28, 0, 0, 'about 28', 40, CH, { hand: true, w: 700 }).setAttribute('textLength', 170);
  const arr28 = drawPath(tag28, 'M-10,-14 Q-60,-10 -90,26 M-90,26 l4,-20 M-90,26 l18,-8', 4);
  /* radio waves: outgoing pulses and the single reply */
  const waveG = G(camL), outW = [0, 1, 2].map(() => E('path', { stroke: '#BFE6FF', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, waveG)),
    inW = [0, 1, 2].map((_, i) => E('path', { stroke: '#FFE7A0', 'stroke-width': 6 - i * 1.5, fill: 'none', 'stroke-linecap': 'round' }, waveG));
  const zap = G(camL), zapP = E('path', { d: 'M0,0 l-14,-22 l16,-4 l-12,-26 M0,0 l18,-18 l-6,-14 l20,-16', stroke: '#FFF4C0', 'stroke-width': 4, fill: 'none', 'stroke-linejoin': 'round' }, zap); E('circle', { r: 26, fill: '#FFF4C0', 'fill-opacity': .3 }, zap);
  const watch = G(camL);
  E('circle', { cy: 6, r: 34, fill: '#000', 'fill-opacity': .3 }, watch); E('rect', { x: -8, y: -42, width: 16, height: 12, rx: 3, fill: '#C9A34A' }, watch);
  E('circle', { r: 34, fill: '#F7F0DC', stroke: '#C9A34A', 'stroke-width': 6 }, watch);
  { let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; d += `M${P(Math.cos(a) * 24, Math.sin(a) * 24)} L${P(Math.cos(a) * 29, Math.sin(a) * 29)} `; } E('path', { d, stroke: '#3A3020', 'stroke-width': 2 }, watch); }
  const hH = E('path', { d: 'M0,0 V-15', stroke: '#1D2B53', 'stroke-width': 4, 'stroke-linecap': 'round' }, watch), hM = E('path', { d: 'M0,0 V-24', stroke: '#1D2B53', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, watch);
  /* inset: the wireless room (screen space) */
  const inset = G(SL), insetIn = G(inset);
  const icp = uid('icp'); { const c = E('clipPath', { id: icp }, DEFS); E('circle', { r: 150 }, c); }
  E('circle', { r: 162, fill: '#000', 'fill-opacity': .35, transform: 'translate(6,8)' }, insetIn);
  const iw = G(insetIn, { 'clip-path': `url(#${icp})` });
  E('rect', { x: -170, y: -170, width: 340, height: 340, fill: lgrad([[0, '#7A5A3E'], [1, '#4A3424']]) }, iw);
  { let d = ''; for (let x = -160; x < 170; x += 40) d += `M${x},-170 V40 `; E('path', { d, stroke: '#3A2818', 'stroke-width': 2, 'stroke-opacity': .5 }, iw); }
  E('circle', { cx: 92, cy: -70, r: 34, fill: '#0A1028', stroke: '#C9A34A', 'stroke-width': 7 }, iw); E('path', { d: 'M74,-74 h.01 M100,-88 h.01 M106,-60 h.01', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, iw);
  E('circle', { cx: -96, cy: -84, r: 22, fill: '#F7F0DC', stroke: '#3A2818', 'stroke-width': 4 }, iw); E('path', { d: 'M-96,-84 V-98 M-96,-84 H-86', stroke: '#1D2B53', 'stroke-width': 3, 'stroke-linecap': 'round' }, iw);
  const setBox = G(iw); E('rect', { x: -150, y: -34, width: 92, height: 74, rx: 6, fill: '#2A2F3A' }, setBox);
  [[-130, -12], [-100, -12], [-78, -12]].forEach(([x, y]) => { E('circle', { cx: x, cy: y, r: 8, fill: '#C9C4B8' }, setBox); E('path', { d: `M${x},${y} l4,-5`, stroke: '#2A2F3A', 'stroke-width': 2 }, setBox); });
  const valves = [-128, -104, -80].map(x => E('rect', { x: x - 5, y: 12, width: 10, height: 18, rx: 5, fill: '#FFC86A' }, setBox));
  const wop = castWireless(iw, { seed: 55 });
  E('rect', { x: -170, y: 42, width: 340, height: 140, fill: '#6E4A30' }, iw); E('rect', { x: -170, y: 40, width: 340, height: 10, fill: '#9A6A44' }, iw);
  const keyG = G(iw); tf(keyG, 66, 40); E('rect', { x: -24, y: -6, width: 48, height: 8, rx: 2, fill: '#3A3436' }, keyG);
  const keyArm = G(keyG); E('rect', { x: -20, y: -12, width: 34, height: 5, rx: 2, fill: '#C9A34A' }, keyArm); E('circle', { cx: 14, cy: -15, r: 6, fill: '#1A1A20' }, keyArm);
  const pad = G(iw); E('rect', { x: -40, y: 44, width: 54, height: 30, rx: 2, fill: '#F7F2E2', transform: 'rotate(-6)' }, pad); const padInk = drawPath(pad, 'M-34,52 q6,-4 12,0 t12,0 t12,0', 2.4, '#1D2B53', 1);
  const isparks = G(iw); E('path', { d: 'M-52,-170 l-10,-14 l10,-2 l-8,-14 M48,-170 l10,-14 l-10,-2 l8,-14', stroke: '#FFF4C0', 'stroke-width': 3.5, fill: 'none' }, isparks);
  E('circle', { r: 150, fill: 'none', stroke: '#C9A34A', 'stroke-width': 12 }, insetIn); E('circle', { r: 150, fill: 'none', stroke: '#F2D27E', 'stroke-width': 3 }, insetIn);
  op(SL, 0);

  /* ===================================================================
     SET C — the nearby ship that stayed put
     =================================================================== */
  const SC = G(world), camC = G(SC);
  const HZC = 420;
  E('rect', { x: -600, y: -500, width: 2800, height: 920, fill: lgrad([[0, '#02040C'], [.6, '#070C20'], [.9, '#121D44'], [1, '#1C2A58']]) }, camC);
  E('ellipse', { cx: 600, cy: 120, rx: 1100, ry: 90, fill: rgrad([[0, '#A9BCF0', .15], [.6, '#A9BCF0', .05], [1, '#A9BCF0', 0]]), transform: 'rotate(-14 600 120)' }, camC);
  const starsC = stars(camC, -600, -500, 2800, 900, 360, 13);
  E('rect', { x: -600, y: HZC, width: 2800, height: 900, fill: lgrad([[0, '#0F1B3E'], [.1, '#080E24'], [1, '#01030A']]) }, camC);
  E('rect', { x: -600, y: HZC - 1, width: 2800, height: 2, fill: '#4C5C8C', 'fill-opacity': .6 }, camC);
  /* the Titanic, far away, a little bow-down, lights on */
  const tiny = G(camC); tf(tiny, 250, HZC + 2, 2.2, 1);
  E('path', { d: 'M-150,0 L-146,-14 L148,-16 L156,0 Z', fill: '#101219' }, tiny); E('rect', { x: -120, y: -24, width: 230, height: 9, fill: '#B9B4AA' }, tiny);
  [-70, -26, 18, 62].forEach(x => { E('rect', { x, y: -50, width: 13, height: 26, fill: '#C9913E' }, tiny); E('rect', { x, y: -50, width: 13, height: 6, fill: '#15151B' }, tiny); });
  { let d = ''; for (let i = 0; i < 26; i++) d += `M${-140 + i * 11},-7h.01 `; for (let i = 0; i < 18; i++) d += `M${-112 + i * 12},-19h.01 `; E('path', { d, stroke: '#FFE2A0', 'stroke-width': 3, 'stroke-linecap': 'round' }, tiny); }
  E('path', { d: 'M-130,8 h40 M-60,12 h60 M30,8 h50', stroke: '#FFD98A', 'stroke-opacity': .3, 'stroke-width': 2.5 }, tiny);
  const tinyLamp = E('circle', { cx: 40, cy: -30, r: 7, fill: '#FFFFFF' }, tiny);
  const rocketC = [0, 1].map(i => { const w = G(camC); tf(w, 240 + i * 40, HZC - 20, 0, .42); return Rocket(w, { h: 420, seed: 21 + i * 4 }); });
  /* the nearby ship, close up (cut away below deck) */
  const ship = G(camC);
  E('path', { d: 'M600,560 L1900,560 L1900,880 L650,880 Q600,720 600,560 Z', fill: '#1A1C24' }, ship);
  E('rect', { x: 600, y: 556, width: 1300, height: 10, fill: '#8A2E2A' }, ship);
  E('rect', { x: 1080, y: 360, width: 600, height: 200, fill: '#C9C4B8' }, ship); E('rect', { x: 1080, y: 352, width: 610, height: 12, fill: '#E2DDD0' }, ship);
  { let w = ''; for (let x = 1110; x < 1660; x += 64) w += `M${x},400 h34 v40 h-34 Z `; E('path', { d: w, fill: '#FFD98A' }, ship); E('rect', { x: 1080, y: 440, width: 600, height: 40, fill: lgrad([[0, '#FFD98A', .25], [1, '#FFD98A', 0]]) }, ship); }
  E('rect', { x: 1300, y: 100, width: 110, height: 256, fill: '#2A2622' }, ship); E('rect', { x: 1300, y: 150, width: 110, height: 26, fill: '#DCD6C8' }, ship); E('ellipse', { cx: 1355, cy: 100, rx: 55, ry: 12, fill: '#141210' }, ship);
  E('path', { d: 'M780,560 V40 M780,120 L1300,180', stroke: '#2A2420', 'stroke-width': 8, fill: 'none' }, ship);
  E('circle', { cx: 780, cy: 34, r: 22, fill: '#FFF4D6', 'fill-opacity': .25 }, ship); E('circle', { cx: 780, cy: 34, r: 7, fill: '#FFFFFF' }, ship);
  const smokeC = G(ship), puffC = [0, 1, 2, 3, 4, 5].map(() => E('path', { d: 'M-30,0 a30,30 0 1 0 60,0 a30,30 0 1 0 -60,0 M-8,-8 a20,20 0 1 0 40,0 a20,20 0 1 0 -40,0', fill: '#444858' }, smokeC));
  /* cabin (cutaway) */
  const cab = G(camC);
  E('rect', { x: 760, y: 588, width: 470, height: 230, fill: lgrad([[0, '#E8C98E'], [1, '#B98E58']]) }, cab);
  { let d = ''; for (let x = 776; x < 1230; x += 30) d += `M${x},588 V818 `; E('path', { d, stroke: '#A8804E', 'stroke-width': 2, 'stroke-opacity': .5 }, cab); }
  E('rect', { x: 760, y: 790, width: 470, height: 28, fill: '#6E4A2C' }, cab);
  E('circle', { cx: 830, cy: 660, r: 30, fill: '#0A1028', stroke: '#C9A34A', 'stroke-width': 7 }, cab);
  E('rect', { x: 1060, y: 700, width: 150, height: 14, rx: 3, fill: '#7A5032' }, cab); E('rect', { x: 1080, y: 714, width: 14, height: 80, fill: '#5A3B22' }, cab); E('rect', { x: 1180, y: 714, width: 14, height: 80, fill: '#5A3B22' }, cab);
  E('rect', { x: 1070, y: 630, width: 132, height: 72, rx: 6, fill: '#2A2F3A' }, cab);
  [[1096, 652], [1126, 652], [1156, 652]].forEach(([x, y]) => { E('circle', { cx: x, cy: y, r: 9, fill: '#55596A' }, cab); E('path', { d: `M${x},${y} l-5,-4`, stroke: '#2A2F3A', 'stroke-width': 2 }, cab); });
  E('rect', { x: 1086, y: 676, width: 50, height: 16, rx: 3, fill: '#151821' }, cab);
  E('path', { d: 'M1170,690 L1186,676', stroke: '#C9C4B8', 'stroke-width': 6, 'stroke-linecap': 'round' }, cab); E('circle', { cx: 1170, cy: 690, r: 5, fill: '#8A8E9A' }, cab);
  TX(cab, 1150, 626, 'OFF', 20, '#E84855', { a: 'middle', w: 800 });
  E('path', { d: 'M1214,600 q16,20 0,40 M1222,606 a10,10 0 1 1 0.1,0', stroke: '#2A2F3A', 'stroke-width': 4, fill: 'none' }, cab);
  E('path', { d: 'M760,588 H1230 V818 H760 Z', fill: 'none', stroke: '#0E0F14', 'stroke-width': 10 }, cab);
  E('path', { d: 'M922,790 V700 M922,700 Q920,650 930,630 M998,790 V742 M914,736 H1006', stroke: '#6E4426', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, cab);
  E('rect', { x: 908, y: 728, width: 104, height: 14, rx: 5, fill: '#8A5A32' }, cab);
  const sleeper = castWireless(cab, { seed: 77, hat: null });
  const ncap = G(sleeper.head); E('path', { d: 'M-46,-322 Q-40,-392 6,-384 Q58,-376 92,-306 L80,-300 Q50,-352 10,-356 Q-26,-356 -34,-318 Z', fill: '#EDE4F4' }, ncap);
  E('path', { d: 'M-50,-326 Q0,-340 48,-322 L46,-306 Q0,-322 -48,-310 Z', fill: '#B9A3DA' }, ncap); E('circle', { cx: 92, cy: -300, r: 13, fill: '#B9A3DA' }, ncap);
  const zzz = G(camC), zs = [0, 1, 2].map(i => TX(zzz, 0, 0, 'Z', 26 + i * 8, '#CFE0FF', { a: 'middle', w: 800 }));
  /* the two sailors in mufflers, and the rail in front of them */
  const sail1 = castLookout(camC, 0, { scarf: '#3F8A5A', hatColor: '#3A3650', seed: 201 }), sail2 = castLookout(camC, 1, { scarf: '#4A6FB0', scarf2: '#2E4E8A', hat: 'flatcap', hatColor: '#5A4E3E', beard: false, mustache: 'walrus', seed: 202 });
  const mug = G(sail2.propL); E('rect', { x: -10, y: -26, width: 20, height: 24, rx: 4, fill: '#E9E4D8' }, mug); E('path', { d: 'M10,-20 q9,2 0,12', stroke: '#E9E4D8', 'stroke-width': 3, fill: 'none' }, mug);
  const mugSteam = E('path', { d: 'M-3,-30 q-5,-8 0,-16 q5,-8 0,-16', stroke: '#FFFFFF', 'stroke-width': 2.4, fill: 'none', opacity: .5 }, mug);
  { let d = ''; for (let x = 600; x <= 1300; x += 34) d += `M${x},560 V478 `; E('path', { d, stroke: '#7A766E', 'stroke-width': 4 }, camC); E('path', { d: 'M600,482 H1300', stroke: '#8A6A48', 'stroke-width': 9 }, camC); E('path', { d: 'M600,520 H1300', stroke: '#B9B4AA', 'stroke-width': 4 }, camC); }
  /* thought bubble: party cake → "?" */
  const bub = N(camC, 930, 200, 1);
  { let d = ''; const C2 = [[-80, 10, 46], [-36, -30, 52], [24, -34, 54], [76, -4, 46], [44, 38, 42], [-20, 42, 44]]; C2.forEach(([x, y, r]) => d += `M${x - r},${y} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 `);
    E('path', { d, fill: '#F4F2FA' }, bub); E('circle', { cx: -40, cy: 104, r: 16, fill: '#F4F2FA' }, bub); E('circle', { cx: -62, cy: 140, r: 10, fill: '#F4F2FA' }, bub); }
  const cake = G(bub);
  E('rect', { x: -54, y: -2, width: 108, height: 40, rx: 6, fill: '#F2A7C3' }, cake); E('rect', { x: -38, y: -32, width: 76, height: 32, rx: 6, fill: '#FBE3EC' }, cake);
  E('path', { d: 'M-54,6 q9,10 18,0 t18,0 t18,0 t18,0 t18,0 t18,0', stroke: '#FFFFFF', 'stroke-width': 4, fill: 'none' }, cake);
  [-20, 0, 20].forEach(x => { E('rect', { x: x - 3, y: -54, width: 6, height: 22, fill: '#7AB8F2' }, cake); E('path', { d: `M${x},-66 q6,8 0,12 q-6,-4 0,-12 Z`, fill: '#FFC24A' }, cake); });
  E('rect', { x: -64, y: 38, width: 128, height: 6, rx: 3, fill: '#C9C4B8' }, cake);
  const qmark = G(bub); TX(qmark, 0, 34, '?', 104, '#1D2B53', { a: 'middle', w: 800 });
  op(SC, 0);

  /* ===================================================================
     UPDATE
     =================================================================== */
  const MO = morse('-.-. --.-  -.. ...  ---', .11), MOK = morse('.... . .-.. .--.', .09), MLAMP = morse('-.-. --.-  -.-. --.-', .14);
  let cur = '', bgQ = -1;
  return (lt, at) => {
    const shot = lt < T_B1 ? 'P' : lt < T_P2 ? 'D' : lt < T_B2 ? 'P' : lt < T_LOW ? 'D' : lt < T_TEST ? 'L' : lt < T_SHIP ? 'D' : 'C';
    if (shot !== cur) { op(SP, shot === 'P' ? 1 : 0); op(SD, shot === 'D' ? 1 : 0); op(SL, shot === 'L' ? 1 : 0); op(SC, shot === 'C' ? 1 : 0); cur = shot; }

    /* ---------------- SET P ---------------- */
    if (shot === 'P') {
      const pres = lt >= T_P2;
      if (!pres) camK(camP, lt, [[0, 700, 430, 1.0], [T_B1, 790, 446, 1.05]]);
      else camK(camP, lt, [[T_P2, 830, 440, .92], [T_B2, 846, 448, .95]]);
      lampP.forEach((l, i) => op(l, .75 + .25 * wob(at * 2, i)));
      op(shipP.lights, .8 + .2 * Math.sin(at * 2.6));
      starsP.anim(at);
      puffP.forEach((q, i) => { const f = i % 3, ph = (at * .16 + i / 15) % 1, [tx, ty] = funnelTop[3 - f];
        tf(q, tx - ph * 210 + Math.sin(at + i) * 6, ty - 10 - ph * 110, 0, .5 + ph * 1.6); op(q, .55 * Math.min(1, ph * 5) * (1 - ph)); });
      minis.forEach((m, i) => { const w = Math.sin(at * (2.4 + i * .3) + i * 2); tf(m.arm, 6, -44, i % 3 === 0 ? -40 + w * 30 : w * 10); tf(m, m._x + Math.sin(at * .4 + i) * 3, m._y + Math.abs(Math.sin(at * 3 + i)) * -1.5, 0, m._s); });
      op(ownerP.root, pres ? 1 : 0);
      if (pres) {
        /* cane sweep: far row → near row → the four collapsibles */
        const ox = 1600, oy = 1030, s = 1.15;
        const PTS = [[T_P2 + .1, 70, 290], [T_P2 + .55, 70, 290], [L(1) + 1.75, 1310, 290], [L(1) + 1.95, 1370, 640], [L(1) + 2.45, 40, 640], [Le(1) - .25, 730, 575], [T_B2, 730, 575]];
        const tx = keyed(lt, PTS.map(p => [p[0], p[1]])), ty = keyed(lt, PTS.map(p => [p[0], p[2]]));
        const sh = [ox - 46 * s, oy - 232 * s];
        const ang = Math.atan2(ty - sh[1], tx - sh[0]);
        const reach = 150 * s, hx = sh[0] + Math.cos(ang) * reach, hy = sh[1] + Math.sin(ang) * reach;
        const talk = cue.talk(lt, 'O');
        ownerP.set({ x: ox, y: oy, s, at, talk, face: lt > L(1) + 2.4 ? 'joy' : 'proud', hL: [(hx - ox) / s, (hy - oy) / s], bendL: 6, propRotL: ang * 180 / Math.PI - 90, hR: [70, -150], look: [-1, -.4], turn: -.35, bob: Math.sin(at * 2) * 2, rim: .8 });
        /* pings when the cane passes each davit boat */
        const sweep = (t => { if (t < T_P2 + .55) return -1; if (t < L(1) + 1.75) return (t - T_P2 - .55) / (L(1) + 1.75 - T_P2 - .55); if (t < L(1) + 1.95) return 1; if (t < L(1) + 2.45) return 1 + (t - L(1) - 1.95) / .5; return 2.01; })(lt);
        boatsP.forEach((b, i) => { const far = i < 8, k = far ? (b.x - 70) / 1240 : 1 + (1370 - b.x) / 1330, dt = sweep - k;
          const v = sweep < 0 ? 0 : dt < 0 ? 0 : dt < .5 ? 1 : clamp(1 - (dt - .5) * 2); op(pings[i], v * .9); if (v) tf(pings[i], b.x, b.y - 18, at * 40, .6 + .5 * clamp(dt * 6)); });
        const t16 = pop(lt, L(1) + 1.9, .45); op(tag16, t16 > 0 ? 1 : 0); if (t16) tf(tag16, 740, 250 + Math.sin(at * 3) * 3, 0, t16);
        cols.forEach((c, i) => { const k = pop(lt, Le(1) - .45 + i * .08, .4); op(c.sp, k * (.6 + .4 * Math.sin(at * 9 + i))); tf(c.sp, 0, -22, at * 60, .4 + .6 * k); });
      } else { pings.forEach(p => op(p, 0)); op(tag16, 0); cols.forEach(c => op(c.sp, 0)); }
    }

    /* ---------------- SET D ---------------- */
    if (shot === 'D') {
      if (lt < T_P2) camK(camD, lt, [[T_B1, -560, 440, 1.1], [L(0) + 3.4, -580, 440, 1.1], [L(0) + 5.4, -560, 446, 1.12], [Le(0) - .5, -470, 462, 1.22], [Le(0) + .15, -470, 462, 1.22], [L(1) - .45, -640, 450, 1.0], [T_P2, -580, 452, 1.03]]);
      else if (lt < T_LOW) camK(camD, lt, [[T_B2, -930, 520, 1.32], [Le(2) + .1, -880, 516, 1.3], [L(3) + .1, -600, 540, 1.15], [Le(3) + .1, -600, 548, 1.18], [L(4) + .25, -80, 480, 1.12], [L(4) + 1.2, -60, 470, 1.16], [L(4) + 2.5, -380, 455, 1.1], [T_PAN, -400, 452, 1.07], [T_PAN + .5, 640, 400, .84], [L(5) + 1.1, 630, 396, .87], [Le(5) - .2, 560, 318, .86], [T_LOW, 590, 350, .9]]);
      else camK(camD, lt, [[T_TEST, 1270, 470, 1.3], [L(8) + 1.4, 1290, 466, 1.32], [L(8) + 2.5, 1350, 430, 1.62], [L(9) - .3, 1355, 428, 1.6], [L(9) + .8, 1640, 370, .9], [T_SHIP, 1660, 380, .88]]);
      { const v = keyed(lt, [[T_PAN, [-400, 452, 1.07]], [T_PAN + .5, [640, 400, .84]]]); const on = lt > T_PAN - .1 && lt < T_PAN + .6; op(fgD, on ? 1 : 0);
        if (on) fgD.setAttribute('transform', `translate(800,450) scale(${f2(v[2])}) translate(${f2(-v[0] * 2.8)},${f2(-v[1])})`); }
      dk.anim(at);
      dk.setSteam(0);
      /* boats: 0 leaves after the Lady's scene; 1 drops with the Owner */
      const gone0 = lt > T_LOW; op(dk.boats[0].g, gone0 ? 0 : 1); op(dk.boats[0].falls, gone0 ? 0 : 1);
      dk.setBoat(1, lt > T_TEST ? prog(lt, L(9) - .2, 2.4, t => t) * .75 : 0);
      /* rockets + flash */
      const rf = Math.max(rocketsD[0].set((lt - (L(5) + .2)) / 2.8), rocketsD[1].set((lt - (L(9) - .25)) / 2.8), rocketsD[2].set((lt - (L(9) + .45)) / 2.8));
      op(flashD, rf * .1);
      op(shipD.lights, .75 + .25 * Math.sin(at * 3));

      /* ---- the blackboard rows ---- */
      const snapT = Le(0) - .3;
      const r1 = prog(lt, L(0) + 1.62, 1.68, t => t), r2 = prog(lt, L(0) + 3.85, 1.05, t => t), r3 = .965 * prog(lt, L(0) + 5.3, snapT - L(0) - 5.3, t => t);
      rows[0].set(r1); rows[1].set(r2); rows[2].set(r3);
      const fr = [rows[0].x + rows[0].w * r1, rows[1].x + rows[1].w * r2, rows[2].x + rows[2].w * r3];
      /* ---- the Shipbuilder (writes with his screen-left hand, standing right of the chalk) ---- */
      const sS = .95, onStep = lt < T_P2 + .5, sYb = onStep ? 706 : 795;
      const SXk = [[0, -730], [L(0) + 1.62, -725], [L(0) + 3.3, -345], [L(0) + 3.85, -725], [L(0) + 4.9, -415], [L(0) + 5.3, -725], [snapT, -320], [snapT + .6, -320], [L(1) - .3, -170], [T_P2, -170],
        [T_P2 + .5, -905], [L(2) + 1.1, -905], [L(2) + 1.4, -862], [Le(2) + .3, -862], [Le(2) + .9, -835], [L(4) + .4, -835], [L(4) + .9, -840], [T_LOW, -840]];
      const SX = t => keyed(t, SXk, x => x);
      const sx = SX(lt), wpS = walkPose(SX, lt, 30);
      const wig = Math.sin(at * 23) * 6 + Math.sin(at * 9) * 4;
      let shL = [-60, -150], shFace = 'focus', shLook = [-.6, -.4], shTurn = -.3, shTilt = 0, shBendL = 10, shBob = 0, shHR = null;
      const ri = lt < L(0) + 3.6 ? 0 : lt < L(0) + 5.1 ? 1 : 2;
      if (lt < L(0) + 1.5) { shL = handTo(sx, sYb, sS, 1, 0, -838 + Math.sin(at * 3) * 4, rows[0].y - 34 - Math.abs(Math.sin(at * 5)) * 12); shFace = 'think'; }
      else if (lt < snapT + .02) {
        const writing = (lt > L(0) + 1.62 && lt < L(0) + 3.3) || (lt > L(0) + 3.85 && lt < L(0) + 4.9) || lt > L(0) + 5.3;
        if (writing) shL = handTo(sx, sYb, sS, 1, wpS.bob, fr[ri] + 4, rows[ri].y - 20 + wig);
        else { const nx = ri === 0 ? 1 : ri + 1 > 2 ? 2 : ri + 1, k = clamp((sx - fr[ri] - 115) / (rows[0].x - fr[ri])); shL = handTo(sx, sYb, sS, 1, wpS.bob, sx - 115, lerp(rows[ri].y, rows[Math.min(2, ri + 1)].y, clamp(k)) - 20); }
        if (ri === 2) shBob = 34; shTilt = -5;
      }
      else if (lt < L(1) - .3) { const k = prog(lt, snapT, .4); shL = handTo(sx, sYb, sS, 1, 0, lerp(fr[2], sx - 60, k), lerp(rows[2].y - 20, 560, k)); shFace = 'worried'; shLook = [-.3, .7]; shTurn = -.1; shBob = 34 * (1 - k); }
      else if (lt < T_P2 + .1) { shL = [-50, -150]; shFace = 'worried'; shLook = [-1, -.2]; shTurn = -.4; }
      /* line 2: the half-a-seat sketch on the lower left of the board */
      const skT = L(2) + .1, skK = [prog(lt, skT, .5, t => t), prog(lt, skT + .5, .55, t => t), prog(lt, skT + 1.05, .55, t => t), prog(lt, skT + 1.6, .3, t => t)];
      sk.forEach((e, i) => setDraw(e, skK[i]));
      half.forEach((h, i) => op(h, prog(lt, skT + 1.75 + i * .2, .3)));
      tf(SK, SKX, SKY, swing(lt, skT + 1.7, 3, 6, 1.2) + Math.sin(at * 2) * .6, .9);
      if (lt >= T_B2 && lt < Le(2) + .3) {
        const HP = [[skT, -1080, 596], [skT + .5, -1016, 600], [skT + .55, -1072, 592], [skT + .8, -1104, 520], [skT + 1.05, -1126, 530], [skT + 1.1, -1020, 592], [skT + 1.35, -988, 520], [skT + 1.6, -964, 530], [skT + 1.75, -1134, 560], [skT + 1.9, -958, 562]];
        const hx = keyed(lt, HP.map(p => [p[0], p[1]]), x => x), hy = keyed(lt, HP.map(p => [p[0], p[2]]), x => x);
        shL = handTo(sx, sYb, sS, 1, 0, hx + wig * .5, hy + wig * .6); shFace = cue.talk(lt, 'S') ? 'neutral' : 'focus'; shLook = [-.8, .4]; shTurn = -.3; shTilt = -6; shBendL = 24;
      } else if (lt >= Le(2) + .3 && lt < L(4)) { shL = [-50, -135]; shHR = [50, -140]; shFace = lt > L(3) + .6 ? 'sad' : 'neutral'; shLook = [1, .1]; shTurn = .45; }
      else if (lt >= L(4)) { const k = prog(lt, L(4) + .3, .4); shL = [-40, lerp(-140, -290, k)]; shFace = lt < L(4) + 1.6 ? 'surprise' : 'worried'; shLook = [1, -.1]; shTurn = .5; }
      const sbOn = lt < T_PAN + .3; op(sb.root, sbOn ? 1 : 0);
      if (sbOn) sb.set({ x: sx, y: sYb, s: sS, at, fL: wpS.fL, fR: wpS.fR, bob: wpS.bob + shBob + Math.sin(at * 1.8) * 1.5, tilt: shTilt, hL: shL, hR: shHR, bendL: shBendL, rotL: 30, look: shLook, turn: shTurn, face: shFace, talk: cue.talk(lt, 'S'), rim: .6, rimSide: 1 });
      /* the chalk snaps */
      op(chalkTip, lt < snapT ? 1 : 0);
      const x0 = rows[2].x + rows[2].w * .965, y0 = rows[2].y - 24;
      if (lt >= snapT && lt < snapT + 1.6) {
        const q = clamp((lt - snapT) / 1.1);
        const bx = x0 + 10 + q * 150, by = y0 + q * 330 - Math.sin(Math.PI * Math.min(1, q * 1.4)) * 110;
        op(chalkBit, 1); tf(chalkBit, bx, Math.min(by, 790), q * 900, 1.6);
        dust.forEach((c, i) => { const a = i / 6 * Math.PI * 2, r = 10 + q * 60; c.setAttribute('cx', f2(x0 + Math.cos(a) * r)); c.setAttribute('cy', f2(y0 + Math.sin(a) * r * .7 - q * 20)); });
        op(dustG, .55 * (1 - q));
        const sk2 = clamp((lt - snapT) / .3); op(snapFx, sk2 < 1 ? 1 - sk2 : 0); tf(snapFx, x0, y0, 0, .6 + sk2 * .8);
      } else { op(chalkBit, lt >= snapT ? 1 : 0); if (lt >= snapT) tf(chalkBit, x0 + 160, 790, 90, 1.6); op(dustG, 0); op(snapFx, 0); }

      /* ---- the Owner ---- */
      const OXk = [[0, -1010], [L(1) - 1.0, -1010], [L(1) + .05, -390], [T_P2, -390], [T_B2, -380], [L(3) - .3, -380], [L(3) + .35, -548], [L(4) + .45, -548], [L(4) + 1.1, -390], [T_LOW, -390], [T_TEST, 940], [L(8) + .9, 1180], [L(8) + 1.6, 1180]];
      const OX = t => keyed(t, OXk);
      const oS = 1, oY = 795, inBoat = lt > L(8) + 1.62;
      const fl = lt < T_LOW ? -1 : 1;
      let ox = OX(lt), oyy = oY, os = oS, wpO = walkPose(OX, lt, 34), oHR = null, oHL = null, oFace = 'proud', oLook = [-.5, -.3], oTurn = -.2, oBob = 0, oTilt = 0;
      op(starH, 0); op(starB, 0); op(starBack, 0); op(tape, 0); op(tapeCase, 0); op(chalkO, 0); op(owner.handR, 1); op(notes, 0);
      if (lt < T_LOW) {
        if (lt < L(1) - 1.0) {
          /* line 0: approving nods, chest out */
          const kTw = win(lt, L(0) + 3.8, L(0) + 5.1, .3, .3), kMo = win(lt, L(0) + 5.6, snapT - .1, .35, .3);
          oFace = kTw > .3 ? 'joy' : lt > L(0) + 5.3 ? 'smug' : 'proud'; oLook = [1, -.5]; oTurn = .4; oBob = Math.max(0, Math.sin(at * 3)) * -4 - 8 * kTw;
          oHR = [lerp(lerp(52, 78, kTw), 34 + Math.sin(at * 9) * 6, kMo), lerp(lerp(-150, -405, kTw) + Math.sin(at * 8) * 5 * kTw, -282, kMo)];   /* finger up for "twenty", then twirls the moustache */
        } else if (lt < T_P2 + .1) {
          /* line 1: the star */
          const kPull = prog(lt, L(1) - .45, .3), kUp = prog(lt, L(1) - .2, .3);
          const tgt = handTo(ox, oY, oS, fl, wpO.bob, SXB, SYB + 6);
          oHR = kUp > 0 ? [lerp(10, tgt[0], kUp), lerp(-170, tgt[1], kUp)] : [lerp(55, 10, kPull), lerp(-150, -170, kPull)];
          if (lt > L(1) + .15) oHR = [tgt[0] + Math.sin(at * 10) * 4 * prog(lt, L(1) + .25, .2), tgt[1]];
          op(starH, lt > L(1) - .5 && lt < L(1) + .15 ? 1 : 0); oFace = 'joy'; oLook = [-1, -.8]; oTurn = -.5; oBob = -10 * kUp;
        } else if (lt < L(3) - .3) {
          /* line 2: puzzled by the sketch */
          oFace = lt > L(2) + .9 ? 'surprise' : 'proud'; oLook = [-1, .3]; oTurn = -.4; oHR = [50, -170]; oHL = [-58, -130];
        } else if (lt < L(4) + .3) {
          /* line 3: tape measure + chalk X on the cushion */
          const kT = prog(lt, L(3) + .3, .4), kX = prog(lt, L(3) + 1.0, .25), kBd = prog(lt, L(3) + .2, .4) * (1 - prog(lt, Le(3) + .1, .4)), oBend = 30 * kBd, oTl = 10 * kBd;
          op(tape, kT > 0 && lt < L(3) + 1.0 ? 1 : 0); op(tapeCase, lt < L(3) + 1.0 ? kT : 0);
          oHR = [lerp(40, 118, kT), lerp(-140, -112, kT)]; oHL = [lerp(-50, -118, kT), lerp(-140, -100, kT)];
          if (lt > L(3) + 1.0) { const xt = handTo(ox, oY, oS, fl, oBend, CHX - 112, 670, oTl); op(chalkO, 1); oHL = [-70, -150];
            oHR = [lerp(100, xt[0], kX) + Math.sin(at * 18) * 6 * win(lt, L(3) + 1.25, L(3) + 1.85, .05, .05), lerp(-100, xt[1], kX) + Math.cos(at * 18) * 5 * win(lt, L(3) + 1.25, L(3) + 1.85, .05, .05)]; }
          const v = [oHL[0] - oHR[0], oHL[1] - oHR[1]];
          if (lt < L(3) + 1.0) { const d = `M0,0 Q${P(v[0] / 2, v[1] / 2 + 12)} ${P(v[0], v[1])}`; tapeLine.setAttribute('d', d); tapeTicks.setAttribute('d', d); }
          oFace = cue.talk(lt, 'O') ? 'smug' : 'proud'; oLook = [.2, .8]; oTurn = 0; oBob = oBend; oTilt = oTl;
        } else {
          /* line 4: peel the star off, hide it behind the back, whistle */
          const kR = prog(lt, L(4) + 1.2, .35), kB = prog(lt, L(4) + 1.95, .45);
          const tgt = handTo(ox, oY, oS, fl, 0, SXB, SYB + 6);
          if (kB > 0) { oHR = [lerp(tgt[0], 26, kB), lerp(tgt[1], -150, kB)]; if (kB > .7) op(owner.handR, 0); }
          else oHR = [lerp(50, tgt[0], kR), lerp(-170, tgt[1], kR)];
          op(starH, lt > L(4) + 1.6 && kB < .7 ? 1 : 0);
          if (kB > .7) { op(starBack, 1); tf(starBack, ox - 84 + Math.sin(at * 2) * 2, oY - 158 + Math.sin(at * 1.3) * 3, 18 + Math.sin(at * 2.4) * 6, 1.15); }
          oFace = kB > .5 ? 'think' : lt > L(4) + 1.0 ? 'worried' : 'proud'; oLook = kB > .5 ? [.4, -1] : [-1, -.7]; oTurn = kB > .5 ? .2 : -.4; oBob = -6 * kR * (1 - kB);
          if (kB > .5) { op(notes, 1); noteT.forEach((n, i) => { const q = (at * .6 + i / 3) % 1; n.setAttribute('x', f2(ox + 30 + q * 60 + Math.sin(q * 8) * 8)); n.setAttribute('y', f2(oY - 300 - q * 120)); n.setAttribute('opacity', f2(Math.sin(Math.PI * q))); }); }
        }
        if (lt > L(1) + .15 && lt < L(4) + 1.6) { op(starB, 1); const k = pop(lt, L(1) + .15, .4); tf(starB, SXB, SYB, Math.sin(at * 1.5) * 3, k); op(starGlint, lt < L(4) ? Math.max(0, Math.sin(at * 2.5)) : 0); }
      } else {
        /* line 8: test the boats */
        oFace = cue.talk(lt, 'O') ? 'smug' : 'proud'; oLook = [.6, -.3]; oTurn = .3;
        const kU = prog(lt, L(8) + .3, .4);
        oHR = [lerp(60, 70, kU), lerp(-150, -300, kU) + Math.sin(at * 6) * 4 * kU * (1 - prog(lt, L(8) + 1.2, .2))];
        if (lt > L(8) + 1.3) { const kH = prog(lt, L(8) + 1.3, .32, easeIn); ox = lerp(1180, 1356, kH); oyy = lerp(oY, 556, kH) - Math.sin(Math.PI * kH) * 110; os = lerp(oS, .55, kH); oHR = [70, -280]; oHL = [-70, -280]; oFace = 'joy'; }
      }
      const oWalk = lt < T_LOW || lt < L(8) + 1.3;
      const ownOn = lt < T_PAN + .35 || lt > T_LOW;
      if (!ownOn) { op(notes, 0); op(starBack, 0); }
      owner.set({ x: ox, y: oyy, s: inBoat || !ownOn ? 0 : os, flip: fl < 0, at, fL: oWalk ? wpO.fL : [-22, 0], fR: oWalk ? wpO.fR : [22, 0], bob: (oWalk ? wpO.bob : 0) + oBob + Math.sin(at * 1.6) * 1.5, tilt: oTilt, hR: oHR, hL: oHL, look: oLook, turn: oTurn, face: oFace, talk: cue.talk(lt, 'O') && !inBoat, rim: .7, rimSide: 1 });
      /* the deckchair X */
      xMark.forEach((e, i) => setDraw(e, prog(lt, L(3) + 1.25 + i * .3, .24, t => t)));
      /* ---- the rulebook (line 4): creaks open, coughs, a moth ---- */
      const kO = prog(lt, L(4) + .3, .9, easeOut), sxC = Math.cos(kO * Math.PI * .92), c1 = lt > L(4) + 1.2 && lt < L(4) + 1.45, c2 = lt > L(4) + 1.7 && lt < L(4) + 1.95;
      cover.setAttribute('transform', `translate(-78,0) scale(${f2(sxC)},1)`); coverB.setAttribute('transform', `translate(-78,0) scale(${f2(sxC)},1)`);
      op(cover, sxC > 0 ? 1 : 0); op(coverB, sxC < 0 ? 1 : 0);
      tf(bookIn, 0, c1 || c2 ? -8 : Math.sin(at * 1.2) * 1.2, (c1 ? -3 : c2 ? 3 : 0) + (kO > 0 && kO < 1 ? Math.sin(lt * 40) * 1.5 : 0), c1 || c2 ? 1.05 : 1);
      tf(beard, 0, -6, Math.sin(at * 1.4) * 3 + (c1 || c2 ? 8 : 0));
      const dq = clamp((lt - L(4) - 1.2) / 1.2);
      op(bookDust, dq > 0 && dq < 1 ? .85 * (1 - dq * dq) : 0);
      const ck = c1 ? 1 - (lt - L(4) - 1.2) / .25 : c2 ? 1 - (lt - L(4) - 1.7) / .25 : 0; op(coughG, ck); tf(coughG, BKX, BKY - 190, 0, 1 + (1 - ck) * .4);
      if (dq > 0 && dq < 1) bdust.forEach((c, i) => { const a = -Math.PI / 2 + (i - 3) * .5; c.setAttribute('cx', f2(BKX + Math.cos(a) * (30 + dq * 150))); c.setAttribute('cy', f2(BKY - 110 + Math.sin(a) * (30 + dq * 110))); c.setAttribute('r', f2(14 + dq * 26 + i % 3 * 6)); });
      const mq = clamp((lt - L(4) - 1.25) / 2.4);
      if (mq > 0 && mq < 1 && lt < T_LOW) { op(moth, 1); const mx = lerp(BKX - 10, -360, mq) + Math.sin(mq * 16) * 34, my = BKY - 90 - Math.sin(mq * Math.PI) * 200 + Math.sin(mq * 23) * 18 - mq * 120;
        tf(moth, mx, my, Math.sin(mq * 18) * 20, 1.5); mothW.forEach(w => tf(w, 0, 0, 0, Math.abs(Math.sin(at * 26)) * .8 + .2, 1)); } else op(moth, 0);

      /* ---- background couple + second officer (coaxing) ---- */
      const bgOn = lt > T_PAN && lt < T_LOW;
      [coupleM, coupleW, officer2].forEach(p => op(p.root, bgOn ? 1 : 0));
      const q12 = Math.floor(at * 12) / 12, bgK = q12 * 1e5 + Math.floor(lt * 12), upd = bgK !== bgQ; bgQ = bgK;   /* background extras: 12 Hz, redundant updates skipped */
      if (bgOn && upd) {
        const at = q12;
        coupleM.set({ x: 300, y: 690, s: .74, at, face: 'worried', look: [-.5, 0], hR: [40, -170], hL: [-60, -140], rim: 0 });
        coupleW.set({ x: 360, y: 692, s: .72, at, face: 'worried', look: [-.6, -.1], turn: -.3, fan: .9 });
        officer2.set({ x: 445, y: 694, s: .74, at, face: 'happy', look: [-1, 0], turn: -.5, hL: [-110 + Math.sin(at * 3) * 12, -190], hR: [60, -140], talk: Math.sin(at * 2) > .3 });
      }
      /* ---- the Lady, Mitzi and Officer 1 ---- */
      const ladyOn = lt > T_PAN && lt < T_LOW;
      op(lady.root, ladyOn ? 1 : 0); if (!ladyOn) mitzi.set({ s: 0 });
      if (ladyOn) {
        const a1 = lt < L(5) + 1.15, a2 = lt >= L(5) + 1.15 && lt < Le(5) - .1;
        const look = a1 ? [1, -.2] : a2 ? [-1, -1] : [.8, 0], kp = prog(lt, L(5) - .1, .35) * (1 - prog(lt, L(5) + 1.05, .3));
        lady.set({ x: 740, y: 800, s: .96, at, face: a1 ? 'worried' : a2 ? 'happy' : 'smug', look, turn: a1 ? .6 : a2 ? -.55 : .35, headTilt: a1 ? 7 : a2 ? -11 : 4, talk: cue.talk(lt, 'P'), fan: a1 ? 1.2 : .5,
          hL: a2 ? [-8, -206] : [-60, -140], hR: [lerp(70, 128, kp), lerp(-170, -250, kp)], rim: .8, rimSide: 1, bob: Math.sin(at * 1.7) * 1.5 + (a2 ? -4 : 0) });
        const nod = lt > Le(5) - .75 && lt < Le(5) + .45 ? Math.max(0, Math.sin((lt - Le(5) + .75) * 16)) : 0;
        mitzi.set({ s: .82, x: 905, y: 681, flip: true, at, face: nod ? 'smug' : 'happy', wag: .9 });
        tf(mitzi.head, 30, -58 + nod * 8, nod * 26 - 8);
      }
      /* officer 1: waves the Lady (L5), shrugs at the Owner (L8), flashes the lamp (L9) */
      op(lamp, 0); op(beam, 0);
      if (ladyOn) off1.set({ x: 1120, y: 782, s: .92, at, face: 'happy', look: [-1, -.1], turn: -.5, talk: false, hL: [-130 + Math.sin(at * 4) * 10, -230 + Math.sin(at * 4) * 12], hR: [80 + Math.sin(at * 3 + 1) * 8, -260], bendR: -20, rim: .8 });
      else if (lt > T_TEST) {
        const F9 = L(9) - .2, fx = keyed(lt, [[F9, 1730], [F9 + .9, 1990]]), wpF = walkPose(t => keyed(t, [[F9, 1730], [F9 + .9, 1990]]), lt, 32);
        if (lt < F9) {
          const shrug = win(lt, L(8) + .8, L(8) + 1.35, .2, .2), wave = prog(lt, L(8) + 1.3, .3) * (1 - prog(lt, L(8) + 2.3, .3));
          off1.set({ x: 1730, y: 778, s: .9, at, face: shrug > .3 ? 'worried' : 'neutral', look: [-1, -.2], turn: -.4, hL: wave > 0 ? [-120 + Math.sin(at * 9) * 14 * wave, -220] : [-80 - 20 * shrug, -150 - 60 * shrug], hR: [80 + 20 * shrug, -150 - 60 * shrug], bob: -6 * shrug, rim: .8, headTilt: 10 * shrug });
        } else {
          const kl = prog(lt, F9 + .9, .35), on = lt > F9 + 1.3 ? morseAt(MLAMP, lt - F9 - 1.3) : 0;
          op(lamp, kl); off1.set({ x: fx, y: 785, s: .95, at, fL: wpF.fL, fR: wpF.fR, bob: wpF.bob, face: 'focus', look: [1, -.3], turn: .5, hR: [lerp(60, 70, kl), lerp(-140, -300, kl)], hL: [lerp(-60, 20, kl), lerp(-140, -290, kl)], rim: .8 });
          lens.setAttribute('fill', on ? '#FFFBE8' : '#5A5E6E');
          if (on && kl > .9) { const lx = fx + .95 * 104, ly = 785 + .95 * -309; op(beam, .85); beam.setAttribute('d', `M${P(lx, ly - 10)} L${P(2250, 386)} L${P(2250, 420)} L${P(lx, ly + 8)} Z`); }
        }
      }
      op(off1.root, ladyOn || lt > T_TEST ? 1 : 0);
      /* ---- boat 1 passengers + the Owner in the boat ---- */
      const sd = B1.seats, b1On = lt > T_PAN; op(B1.g, b1On ? 1 : 0); op(B1.falls, b1On ? 1 : 0);
      if (b1On && upd) pax1.set({ x: sd[0][0], y: sd[0][1], s: .5, sit: true, at: q12, face: lt > L(8) + 1.6 ? 'surprise' : 'neutral', look: [1, 0], rim: .6 });
      if (b1On && upd) pax2.set({ x: sd[5][0], y: sd[5][1], s: .5, sit: true, at: q12, face: 'neutral', look: [-1, -.2], hR: [50, -160], rim: .6 });
      const ob = lt > L(8) + 1.62;
      if (ob) {
        const land = swing(lt, L(8) + 1.62, 10, 14, 4), kp = prog(lt, L(8) + 2.2, .35);
        ownerB.set({ x: Number(sd[2][0]) + 20, y: sd[2][1], s: .55, sit: true, at, bob: land, face: 'joy', look: [0, .3], talk: cue.talk(lt, 'O'), hR: [lerp(50, 62, kp) + 20 * prog(lt, L(8) + 2.75, .3), lerp(-150, -214, kp) + 70 * prog(lt, L(8) + 2.75, .3)], hL: lt > L(9) ? [-60 + Math.sin(at * 8) * 12, -290] : [-60, -150], rim: .7 });
        const rk = pop(lt, L(8) + 2.45, .45); op(roset, rk > 0 ? 1 : 0); if (rk > 0) tf(roset, -4, -222, Math.sin(at * 3) * 4, rk);
      } else ownerB.set({ s: 0 });
    }

    /* ---------------- SET L ---------------- */
    if (shot === 'L') {
      starsL.anim(at);
      /* the boat creaks down in jerks */
      const steps = [[T_LOW, 150], [L(6) + .6, 150], [L(6) + 1.0, 250], [L(6) + 1.6, 250], [L(6) + 2.0, 360], [L(6) + 2.7, 365], [L(6) + 3.2, 480], [L(6) + 3.9, 485], [L(6) + 4.5, 620], [Le(6) - .2, 640], [Le(6) + .5, WL - 18]];
      const by = keyed(lt, steps), jerk = steps.reduce((s, [t]) => s + swing(lt, t, 1.6, 15, 4), 0);
      const tilt = Math.sin(lt * 2.1) * 1.6 + jerk * .6;
      tf(bL, BLX, by + jerk * 2, tilt);
      const afloat = by > WL - 30;
      tf(bLin, 0, afloat ? Math.sin(at * 1.6) * 2 : 0);
      crew.forEach((c, i) => tf(c, c._x, c._y + Math.sin(at * 2 + i * 1.3) * 1.2, Math.sin(at * 1.1 + i) * 3, 1));
      tf(waveArm, 10, -20, Math.sin(at * 7) * 22);
      const ex = [-232, 232].map(dx => [BLX + dx * Math.cos(tilt * Math.PI / 180), by + jerk * 2 + dx * Math.sin(tilt * Math.PI / 180) - 4]);
      fallsL.setAttribute('d', `M${BLX - 226},-110 L${P(ex[0][0], ex[0][1])} M${BLX + 246},-110 L${P(ex[1][0], ex[1][1])}`);
      creakP.forEach((c, i) => { const k = steps.reduce((s, [t]) => s + Math.max(0, 1 - Math.abs(lt - t - .1) / .25), 0); const x = ex[i][0] + (i ? 30 : -30); c.setAttribute('d', `M${P(x, ex[i][1] - 40)} q${i ? 10 : -10},-8 0,-16 M${P(x + (i ? 12 : -12), ex[i][1] - 30)} q${i ? 10 : -10},-8 0,-16`); c.setAttribute('opacity', f2(clamp(k) * .8)); });
      { let d = ''; for (let x = -900; x <= 990; x += 30) d += (d ? ' L' : 'M') + x + ',' + f2(WL + 4 * Math.sin(x * .02 + at * 1.6)); foamL.setAttribute('d', d); }
      op(capGlow, .35 * win(lt, L(6) + 2.4, L(6) + 3.6, .3, .5) * (.6 + .4 * Math.sin(at * 8)));
      const t28 = prog(lt, L(6) + 3.85, .4); op(tag28, t28 * (1 - prog(lt, Le(6) + .2, .3))); tf(tag28, BLX + 290, by - 70); setDraw(arr28, prog(lt, L(6) + 3.95, .4, t => t));
      const fl = rocketL.set((lt - (L(6) + 1.2)) / 2.8);
      /* camera: follow the boat, then look out to sea */
      camK(camL, lt, [[T_LOW, 560, 150, 1.05], [L(6) + 1.0, 560, 230, 1.05], [L(6) + 3.0, 560, 380, 1.05], [Le(6), 560, 520, 1.02], [L(7) - .2, 560, 560, 1.0], [L(7) + .7, 1590, 290, .96], [T_TEST, 1620, 296, .98]]);
      /* radio: SOS pulses out, one reply back */
      const tOut = L(7) + .3, tIn = L(7) + 1.1, tArr = L(7) + 2.0;
      outW.forEach((w, i) => { const q = clamp((lt - tOut - i * .25) / 1.0); if (q <= 0 || q >= 1) { op(w, 0); return; } const r = 30 + q * 300; op(w, (1 - q) * .9); w.setAttribute('d', `M${P(990 + r * Math.cos(-.7), -40 + r * Math.sin(-.7))} A${r},${r} 0 0 1 ${P(990 + r * Math.cos(.7), -40 + r * Math.sin(.7))}`); });
      const src = [2300, HZL - 8], dst = [990, 60], D0 = Math.hypot(dst[0] - src[0], dst[1] - src[1]);
      inW.forEach((w, i) => { const q = clamp((lt - tIn) / (tArr - tIn)); if (q <= 0 || q >= 1.0 && lt > tArr + .3) { op(w, 0); return; } const r = Math.max(5, q * D0 - i * 30), a0 = Math.atan2(dst[1] - src[1], dst[0] - src[0]), ha = Math.min(.5, 130 / r);
        op(w, (1 - i * .28) * (q < 1 ? 1 : 1 - (lt - tArr) / .3)); w.setAttribute('d', `M${P(src[0] + r * Math.cos(a0 + ha), src[1] + r * Math.sin(a0 + ha))} A${f2(r)},${f2(r)} 0 0 0 ${P(src[0] + r * Math.cos(a0 - ha), src[1] + r * Math.sin(a0 - ha))}`); });
      const zk = win(lt, tArr - .05, tArr + .5, .05, .3); op(zap, zk); tf(zap, 990, 40, 0, .8 + zk * .4 + Math.sin(at * 30) * .1);
      const wk = pop(lt, L(7) + 2.3, .45); op(watch, wk > 0 ? 1 : 0); if (wk > 0) { tf(watch, 2300, HZL - 92, Math.sin(at * 2) * 5, wk * 1.15); hM.setAttribute('transform', `rotate(${f2(lt * 720)})`); hH.setAttribute('transform', `rotate(${f2(lt * 60)})`); }
      op(shipL1.lights, .8 + .2 * Math.sin(at * 2.5)); op(shipL2.lights, .7 + .3 * Math.sin(at * 4));
      /* inset */
      const ik = pop(lt, L(7) - .15, .5) * (1 - prog(lt, T_TEST - .35, .3));
      op(inset, ik > 0 ? 1 : 0);
      if (ik > 0) {
        tf(inset, 330, 290, 0, ik);
        const key = morseAt(MO, lt - L(7)), reply = lt > tArr;
        const kAng = reply ? 0 : key * 9;
        keyArm.setAttribute('transform', `rotate(${kAng} -18 -8)`);
        wop.set({ x: -10, y: 152, s: .62, sit: true, at, face: reply ? 'happy' : 'focus', look: reply ? [0, 0] : [.5, .6], turn: reply ? 0 : .2, talk: cue.talk(lt, 'W'), hR: reply ? [70, -190] : [126, -186 + key * 7], hL: reply ? [-30, -170 + Math.sin(at * 14) * 3] : [-60, -150], rim: 0, headTilt: reply ? 6 : 0 });
        op(isparks, win(lt, tArr, tArr + .45, .05, .2) * (Math.sin(at * 40) > 0 ? 1 : .4));
        valves.forEach((v, i) => op(v, .6 + .4 * Math.sin(at * 7 + i * 2)));
        setDraw(padInk, prog(lt, tArr + .3, 1.2, t => t)); op(pad, reply ? 1 : 0);
      }
    }

    /* ---------------- SET C ---------------- */
    if (shot === 'C') {
      starsC.anim(at);
      camK(camC, lt, [[T_SHIP, 850, 400, 1.0], [L(9) + 3.9, 870, 420, 1.03], [Le(9) - .4, 960, 600, 1.36], [DUR, 966, 606, 1.4]]);
      rocketC.forEach((r, i) => r.set((lt - (T_SHIP - .6 + i * 1.7)) / 2.6));
      op(tinyLamp, morseAt(MLAMP, lt - T_SHIP) ? 1 : 0);
      puffC.forEach((q, i) => { const ph = (at * .12 + i / 6) % 1; tf(q, 1355 - ph * 160, 90 - ph * 140, 0, .6 + ph * 1.5); op(q, .5 * Math.min(1, ph * 5) * (1 - ph)); });
      /* sailors: look towards the far rockets; then shrug and settle */
      const shr = win(lt, L(9) + 4.05, Le(9) + .2, .25, .35);
      sail1.set({ x: 880, y: 560, s: .62, at, face: lt > L(9) + 2.9 ? 'think' : lt > L(9) + 2.0 ? 'happy' : 'surprise', look: [-1, -.4], turn: -.5, headTilt: lt > L(9) + 2.9 ? -10 : 0, hL: [-70 - shr * 20, -128 - shr * 60], hR: [62 + shr * 20, -128 - shr * 60], bob: -5 * shr, rim: .8 });
      sail2.set({ x: 1010, y: 560, s: .62, at, face: lt > L(9) + 2.9 ? 'think' : lt > L(9) + 2.0 ? 'happy' : 'neutral', look: [-1, -.3], turn: -.5, hL: [-40, -200 + Math.sin(at * .8) * 6], hR: [60, -128], rim: .8 });
      mugSteam.setAttribute('transform', `translate(${f2(Math.sin(at * 2) * 2)},${f2(-((at * 8) % 6))})`);
      /* thought bubble */
      const bk = pop(lt, L(9) + 2.0, .5), cq = prog(lt, L(9) + 2.95, .3);
      op(bub, bk > 0 ? 1 : 0); if (bk > 0) tf(bub, 930, 200 + Math.sin(at * 1.4) * 4, 0, bk);
      op(cake, 1 - cq); tf(cake, 0, 0, 0, 1 - cq * .6); const qk = pop(lt, L(9) + 3.1, .45); op(qmark, qk > 0 ? 1 : 0); tf(qmark, 0, 0, Math.sin(at * 2.4) * 6, qk);
      /* the sleeping operator */
      const br = Math.sin(at * 1.5);
      sleeper.set({ x: 960, y: 790, s: .52, sit: true, at, face: br > .2 ? 'surprise' : 'neutral', lid: 1, headTilt: 16 + br * 3, look: [0, .4], bob: br * 3, hL: [-40, -120], hR: [40, -122], rim: 0 });
      zs.forEach((z, i) => { const q = (at * .32 + i / 3) % 1; z.setAttribute('x', f2(990 + q * 60 + Math.sin(q * 7) * 8)); z.setAttribute('y', f2(660 - q * 64)); z.setAttribute('font-size', f2(18 + q * 22)); z.setAttribute('opacity', f2(Math.sin(Math.PI * q) * .95)); });
    }
  };
}});
