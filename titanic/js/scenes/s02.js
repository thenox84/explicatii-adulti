"use strict";
/* SCENE 2 — "Too busy to listen"
   Beat sheet (lt = scene-local seconds at the current timings; every beat is anchored to cue(j)):
   A  0.0–6.4   PURSER'S LOBBY. A queue of first-class passengers hands telegram forms over the
                counter; the purser rolls each into a brass canister and drops it into a glass
                pneumatic tube where canisters zip up nonstop.                                [L0 2.0–7.3]
                2.1 the Posh lady hands in a perfumed pink one (hearts waft); 3.9–5.0 the camera
                rides up with its heart-trailing canister through the decks to the door marked
                WIRELESS TELEGRAPH, crackling with blue sparks, telegrams spilling under it;
                5.6–6.4 push in, the door bursts open in a blue-white flash.
   B1 6.4–20.3  RADIO ROOM (bgWireless). The tube spits telegrams at the operator nonstop and a
                pink snowdrift starts to bury him.                                            [L0 end]
                7.6–12.2 hair springs on end; he taps at blurring speed while holding up
                WONDERFUL TIME. twice, then the perfumed DOG HAS JOINED THIRD CLASS. DON'T TELL
                MOTHER. (paw print; he blushes).                                               [L1]
                12.3–17.4 push in on the desk queue: shivering icy-blue ICE slips arrive and try to
                squeeze forward; fat pink SOUP! / DINNER MENU / CONSOMMÉ OLGA elbow them back,
                CREAM OF BARLEY jumps the queue, the ICE slips are shoved off the desk edge.    [L2]
                17.2–20.3 'Ice… ice…': two blue slips go over his shoulder onto the swaying LATER
                heap; HAPPY BIRTHDAY, REGINALD! drops in and he hugs it to his chest.          [L3]
   C  20.3–25.0 BOAT DECK AT DUSK. The Captain reads an ICE WARNING, "Thank you." (grave nod),
                hands it over and folds his hands; push in as the Owner tucks it into his waistcoat
                beside the crumpled PRACTICALLY (glint, pat-pat).                              [L4 20.6–21.4, tuck 22.0–22.5]
                22.8–24.9 pull back: "In clear weather?" he waves his cane at the cloudless sky (a
                star pings); 23.3 thought bubble of other liners racing at full steam; three funnels
                puff harder while the dummy fourth just puffs out its cheeks; he laughs.       [L5]
   D  25.0–29.0 OPEN SEA. The Titanic ploughs on at speed as dusk turns to night; the camera
                pulls back, then pushes far off onto a small steamer stopped among ice floes,
                radio rings pulsing.                                                         [L6 a]
   E1 29.0–31.2 THE STEAMER (cutaway cabin) in the ice field: its operator leans helpfully into
                his key: STOPPED. SURROUNDED BY ICE.                                          [L6 b]
   B2 31.2–33.5 RADIO ROOM. Buried to the nose; 31.8 his arm bursts out of the drift, 32.4 jabs the
                key: a spark singes his eyebrows into two smoking question marks.              [L7]
   E2 33.5–41.5 THE STEAMER. SHUT UP! I'M BUSY! crackles in; he droops (33.8–35.1), hangs up his
                headphones (35.1–35.6), 36.1 flips the switch to OFF (the valve fades), 36.5
                nightcap, 36.8 hops into the bunk, 38.8 on "he shut up" blows out the candle.
                39.6–41.5 pull back: the little ship sits dark among the floes, Zzz, while the
                Titanic's lights race along the horizon.                                       [L8 33.8–39.9]
*/
SCENE(2, { build(world, cue) {
  const L = cue, Le = cue.e, DUR = cue.d;
  const MOON = '#A8C6FF';
  /* ---------- shot boundaries ---------- */
  const T_AB = L(1) - 1.45, T_BC = L(4) - .3, T_CD = L(6) - .15, T_DE = L(6) + 3.9, T_EB = L(7) - .4, T_BE = L(8) - .3;

  /* ---------- small local helpers ---------- */
  const camVal = (t, K) => keyed(t, K.map(k => [k[0], k.slice(1)]));
  const camSet = (g, v, par = 1, cy0 = 450) => g.setAttribute('transform', `translate(800,450) scale(${f2(v[2] * 1000) / 1000}) translate(${f2(-v[0])},${f2(-(cy0 + (v[1] - cy0) * par))})`);
  const lin = t => t;
  const HEART = 'M0,5 C-9,-3 -5,-11 0,-5 C5,-11 9,-3 0,5 Z';
  const dot = (x, y, r) => `M${f2(x - r)},${f2(y)}a${f2(r)},${f2(r)} 0 1,0 ${f2(2 * r)},0a${f2(r)},${f2(r)} 0 1,0 ${f2(-2 * r)},0`;
  const PAW = (x, y, r) => { let d = dot(x, y, r); [[-1.05, -1.15], [-.38, -1.6], [.38, -1.6], [1.05, -1.15]].forEach(([u, v]) => { d += dot(x + u * r, y + v * r, r * .38); }); return d; };
  const PINK = '#F49AB9', PINK_D = '#C9577F', PINK_L = '#FFD6E4', ICE = '#BDEBFF', ICE_D = '#3E8EC4', ICE_L = '#F1FCFF';
  const fitText = (t, w) => { t.setAttribute('textLength', w); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); return t; };
  /* fat pink passenger telegram (envelope), origin = centre, ~64×44 */
  const pinkTel = (p, w = 64, h = 44) => { const g = G(p);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h * .24, fill: PINK, stroke: PINK_D, 'stroke-width': 2.2 }, g);
    E('path', { d: `M${-w / 2 + 3},${-h / 2 + 5} L0,${f2(h * .1)} L${w / 2 - 3},${-h / 2 + 5}`, fill: 'none', stroke: PINK_D, 'stroke-width': 2 }, g);
    E('path', { d: HEART, fill: '#D8336A', transform: `translate(0,${f2(h * .12)}) scale(${f2(h / 44)})` }, g);
    return g; };
  /* thin icy-blue ice-warning slip, origin = centre, with icicles */
  const iceSlip = (p, w = 72, h = 18, label) => { const g = G(p);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 2, fill: ICE, stroke: ICE_D, 'stroke-width': 1.6 }, g);
    let d = ''; for (let x = -w / 2 + 5; x < w / 2 - 4; x += 9) d += `M${x},${h / 2} l2.5,${f2(4 + hash(x) * 5)} l2.5,${f2(-(4 + hash(x) * 5))}`;
    E('path', { d, fill: ICE_L, stroke: ICE_D, 'stroke-width': 1 }, g);
    if (label) fitText(TX(g, 0, h * .3, label, Math.round(h * .6), '#1D4E7A', { a: 'middle', w: 800, ls: 1 }), w - 16);
    else E('path', { d: `M${-w / 2 + 7},-2 h${f2(w * .45)} M${-w / 2 + 7},3 h${f2(w * .62)}`, stroke: ICE_D, 'stroke-width': 1.6 }, g);
    return g; };
  const canister = (p, band, k = 1) => { const g = G(p);
    E('rect', { x: -9 * k, y: -19 * k, width: 18 * k, height: 38 * k, rx: 6 * k, fill: '#D9B04A', stroke: '#8A6526', 'stroke-width': 1.6 }, g);
    E('rect', { x: -9 * k, y: -7 * k, width: 18 * k, height: 13 * k, fill: band || '#F6EFD9' }, g);
    E('rect', { x: -6 * k, y: -17 * k, width: 4 * k, height: 32 * k, rx: 2 * k, fill: '#FFE9A8', 'fill-opacity': .6 }, g);
    return g; };
  const form = (p, pink) => { const g = G(p);
    E('rect', { x: -15, y: -20, width: 30, height: 40, rx: 2, fill: pink ? PINK_L : '#FBF7EE', stroke: pink ? PINK_D : '#B9AE95', 'stroke-width': 1.5 }, g);
    E('path', { d: 'M-10,-12 h20 M-10,-6 h16 M-10,0 h20 M-10,6 h12', stroke: pink ? PINK_D : '#B9AE95', 'stroke-width': 1.4 }, g);
    if (pink) E('path', { d: HEART, fill: '#D8336A', transform: 'translate(6,12) scale(.5)' }, g);
    return g; };
  const walkFeet = (ph, a = 1) => ({ fL: [-22 + Math.sin(ph) * 13 * a, -Math.max(0, Math.sin(ph)) * 10 * a], fR: [22 - Math.sin(ph) * 13 * a, -Math.max(0, -Math.sin(ph)) * 10 * a], bob: -Math.abs(Math.cos(ph)) * 4 * a });
  const burst = (p, col, r = 30) => { const g = G(p); let d = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; d += `M${f2(Math.cos(a) * r * .35)},${f2(Math.sin(a) * r * .35)} L${f2(Math.cos(a) * r)},${f2(Math.sin(a) * r)} `; }
    E('path', { d, stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); E('circle', { r: r * .3, fill: '#fff' }, g); return g; };
  /* jagged bolt from a to b (deterministic per frame index) */
  const boltD = (a, b, fr, n = 6, amp = 24) => { let d = `M${f2(a[0])},${f2(a[1])}`; for (let i = 1; i <= n; i++) { const t = i / n, j = i < n ? 1 : 0;
    d += ` L${f2(lerp(a[0], b[0], t) + (hash(fr * 1.7 + i * 3.1) - .5) * amp * j)},${f2(lerp(a[1], b[1], t) + (hash(fr * 2.3 + i * 5.7) - .5) * amp * j)}`; } return d; };

  /* cheap moonless night sky (gradient, Milky Way band, dust, two star layers, a few twinklers) */
  const nightSky = (p, x0, y0, w, hy, seed, n = 340) => { const g = G(p), H = hy - y0;
    E('rect', { x: x0, y: y0, width: w, height: H + 8, fill: lgrad([[0, '#02040A'], [.45, '#060A1A'], [.8, '#0C132B'], [1, '#1E2648']]) }, g);
    const mw = G(g, { transform: `rotate(-20 ${x0 + w * .45} ${y0 + H * .45})` });
    E('ellipse', { cx: x0 + w * .45, cy: y0 + H * .45, rx: w * .55, ry: H * .2, fill: rgrad([[0, '#A4B6EE', .2], [.55, '#A4B6EE', .07], [1, '#A4B6EE', 0]]) }, mw);
    { let d = ''; for (let i = 0; i < 380; i++) { const u = hash(i * 1.37 + seed) - .5, v = (hash(i * 2.11 + seed) + hash(i * 3.7 + seed) - 1); d += dot(x0 + w * (.45 + u * 1.05), y0 + H * (.45 + v * .2), .5 + hash(i * 7.7) * .6); } E('path', { d, fill: '#FFFFFF', 'fill-opacity': .45 }, mw); }
    const st = [[], []]; for (let i = 0; i < n; i++) { const x = x0 + hash(i * 1.91 + seed * 3) * w, y = y0 + Math.pow(hash(i * 2.73 + seed), 1.15) * (H - 14); st[i % 4 ? 0 : 1].push(dot(x, y, .6 + hash(i * 4.3 + seed) * 1.1)); }
    E('path', { d: st[0].join(''), fill: '#DCE6FF', 'fill-opacity': .55 }, g); E('path', { d: st[1].join(''), fill: '#FFFFFF', 'fill-opacity': .95 }, g);
    E('rect', { x: x0, y: hy - 90, width: w, height: 92, fill: lgrad([[0, '#2A3866', 0], [1, '#2A3866', .5]]) }, g);
    const tw = [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const t = G(g); tf(t, x0 + 80 + hash(i * 7.7 + seed) * (w - 160), y0 + 40 + hash(i * 3.3 + seed) * (H * .75)); E('circle', { r: 5, fill: '#DCE6FF', 'fill-opacity': .18 }, t);
      E('path', { d: 'M0,-10 L1.6,-1.6 L10,0 L1.6,1.6 L0,10 L-1.6,1.6 L-10,0 L-1.6,-1.6 Z', fill: '#FFFFFF' }, t); return t; });
    g.anim = (at, k = 1) => tw.forEach((t, i) => op(t, k * (.25 + .75 * Math.abs(Math.sin(at * (1.1 + i * .27) + i)))));
    /* fade by leaf opacity (no group layer: a half-transparent group would cost a full-screen offscreen pass) */
    const leaves = Array.from(g.querySelectorAll('rect,ellipse,path')).filter(n => !tw.some(t => t.contains(n)));
    let lastK = -1; g.fade = k => { k = Math.round(clamp(k) * 50) / 50; if (k === lastK) return; lastK = k; g.style.display = k < .01 ? 'none' : ''; leaves.forEach(n => n.setAttribute('opacity', k)); };
    return g; };

  /* =====================================================================
     SHOT A — purser's lobby, glass tube, up the decks to the WIRELESS TELEGRAPH door
     ===================================================================== */
  const shA = G(world), camA = G(shA), fgA = G(shA);
  {
    /* --- exterior boat deck at dusk (y < -60) --- */
    E('rect', { x: -400, y: -1400, width: 2400, height: 780, fill: lgrad([[0, '#231E4A'], [.5, '#6A4682'], [.85, '#D57D78'], [1, '#F2A77A']]) }, camA);
    { let d = ''; for (let i = 0; i < 40; i++) d += dot(-300 + hash(i * 2.3) * 2200, -1380 + hash(i * 3.1) * 520, .8 + hash(i * 5.7) * 1.3); E('path', { d, fill: '#FFF4E0', 'fill-opacity': .7 }, camA); }
    /* aerial lead-in wires */
    E('path', { d: 'M700,-1400 L760,-650 M1180,-1400 L1120,-650', stroke: '#2A2230', 'stroke-width': 3 }, camA);
    [[730, -1020], [1150, -1020]].forEach(([x, y]) => E('rect', { x: x - 5, y: y - 14, width: 10, height: 28, rx: 4, fill: '#E8DCC8' }, camA));
    /* deckhouse wall */
    E('rect', { x: -400, y: -650, width: 2400, height: 560, fill: lgrad([[0, '#F4E4DC'], [1, '#D6C2C4']]) }, camA);
    E('rect', { x: -400, y: -650, width: 2400, height: 560, fill: lgrad([[0, '#FFB27A', .22], [.5, '#FFB27A', 0]], 0, 0, 1, 0) }, camA);
    { let d = ''; for (let x = -380; x < 2000; x += 150) d += `M${x},-640 V-100 `; E('path', { d, stroke: '#C4AEB2', 'stroke-width': 2 }, camA);
      let r = ''; for (let x = -390; x < 2000; x += 25) { r += `M${x},-628 h2 M${x},-114 h2 `; } E('path', { d: r, stroke: '#A8949A', 'stroke-width': 3, 'stroke-linecap': 'round' }, camA); }
    E('rect', { x: -400, y: -672, width: 2400, height: 26, fill: '#7A5038' }, camA); E('rect', { x: -400, y: -672, width: 2400, height: 6, fill: '#A87650' }, camA);
    E('rect', { x: -400, y: -646, width: 2400, height: 14, fill: '#000', 'fill-opacity': .12 }, camA);
    /* portholes on the deckhouse */
    [180, 470, 1420, 1660].forEach(x => { E('circle', { cx: x, cy: -420, r: 46, fill: '#B88E3A' }, camA); E('circle', { cx: x, cy: -420, r: 37, fill: lgrad([[0, '#FFE6A8'], [1, '#F2B860']]) }, camA);
      E('path', { d: `M${x - 22},-430 A26,26 0 0 1 ${x + 4},-450`, stroke: '#fff', 'stroke-opacity': .6, 'stroke-width': 5, fill: 'none' }, camA); });
    /* lifebuoy + deck bench */
    { const b = G(camA); tf(b, 680, -380); E('circle', { r: 46, fill: 'none', stroke: '#F4EEE2', 'stroke-width': 22 }, b);
      E('circle', { r: 46, fill: 'none', stroke: '#C8362E', 'stroke-width': 22, 'stroke-dasharray': '36.1 36.1' }, b); E('circle', { r: 57, fill: 'none', stroke: '#9A8A80', 'stroke-width': 1.5 }, b); }
    { const b = G(camA); tf(b, 300, -100); E('path', { d: 'M-130,-60 H130 M-130,-90 H130 M-130,-120 H130', stroke: '#A8784A', 'stroke-width': 12, 'stroke-linecap': 'round' }, b);
      E('path', { d: 'M-110,-130 V0 M110,-130 V0', stroke: '#3A3036', 'stroke-width': 8 }, b); }
  }
  /* door + plate */
  const doorGlow = itrGlow(camA, 960, -270, 460, 360, '#7FC8FF', .75);
  E('rect', { x: 872, y: -428, width: 176, height: 326, rx: 6, fill: '#5A3A24' }, camA);
  const doorLight = E('rect', { x: 880, y: -420, width: 160, height: 312, fill: '#E8F8FF' }, camA);
  const doorPanel = G(camA);
  { const d = G(doorPanel); E('rect', { x: 0, y: -420, width: 160, height: 312, rx: 4, fill: '#8A5A34' }, d);
    E('rect', { x: 16, y: -400, width: 128, height: 104, rx: 8, fill: '#3A2A20' }, d);
    E('rect', { x: 16, y: -270, width: 128, height: 70, rx: 4, fill: '#7A4E2E' }, d); E('rect', { x: 16, y: -186, width: 128, height: 66, rx: 4, fill: '#7A4E2E' }, d);
    E('circle', { cx: 140, cy: -262, r: 7, fill: '#E2B84A' }, d); }
  const doorWin = E('rect', { x: 22, y: -394, width: 116, height: 92, rx: 6, fill: '#BFE8FF' }, doorPanel);
  const doorWinB = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, doorPanel);
  const doorGaps = E('path', { d: 'M874,-104 H1046 M874,-426 V-104 M1046,-426 V-104', stroke: '#DDF6FF', 'stroke-width': 5 }, camA);
  const doorBolts = [0, 1, 2, 3].map(() => { const g = G(camA); E('path', { stroke: '#6FC6FF', 'stroke-width': 10, 'stroke-opacity': .45, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g); E('path', { stroke: '#F2FBFF', 'stroke-width': 3.5, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g); return g; });
  const underDoor = [0, 1, 2, 3].map(() => { const g = G(camA); pinkTel(g, 40, 28); return g; });
  { const pl = G(camA); tf(pl, 960, -478); E('rect', { x: -186, y: -32, width: 372, height: 62, rx: 8, fill: '#B88E3A' }, pl); E('rect', { x: -178, y: -25, width: 356, height: 48, rx: 5, fill: '#1D2B53' }, pl);
    fitText(TX(pl, 0, 10, 'WIRELESS TELEGRAPH', 28, '#F7D77A', { a: 'middle', w: 800, ls: 1 }), 330); }
  /* lantern */
  { E('rect', { x: 1196, y: -476, width: 6, height: 40, fill: '#3A2A20' }, camA); itrGlow(camA, 1199, -400, 120, 110, '#FFD98A', .5);
    E('path', { d: 'M1180,-440 h38 l-4,58 h-30 Z', fill: '#FFE7A8', stroke: '#3A2A20', 'stroke-width': 4 }, camA); }
  /* deck floor + cross-section slab */
  E('rect', { x: -400, y: -100, width: 2400, height: 44, fill: '#B48A5C' }, camA);
  { let d = ''; for (let x = -380; x < 2000; x += 64) d += `M${x},-100 v44 `; E('path', { d, stroke: '#94704A', 'stroke-width': 2 }, camA); }
  E('rect', { x: -400, y: -56, width: 2400, height: 50, fill: '#3A3036' }, camA);
  { let d = ''; for (let x = -400; x < 2000; x += 26) d += `M${x},-6 l20,-50 `; E('path', { d, stroke: '#4E4248', 'stroke-width': 3 }, camA); }
  /* aerial sparks */
  const aerialBolt = E('path', { stroke: '#CFF0FF', 'stroke-width': 2.5, fill: 'none', 'stroke-linejoin': 'round' }, camA);
  /* exterior tube (opaque brass) + elbow into the wall */
  E('path', { d: 'M1115,-56 V-300 Q1115,-345 1072,-345', stroke: '#B88E3A', 'stroke-width': 30, fill: 'none' }, camA);
  E('path', { d: 'M1106,-56 V-300 Q1106,-336 1072,-336', stroke: '#E8C76A', 'stroke-width': 7, fill: 'none' }, camA);
  E('rect', { x: 1052, y: -366, width: 18, height: 42, rx: 4, fill: '#8A6526' }, camA);
  const tubeBulge = E('ellipse', { cx: 1115, cy: 0, rx: 22, ry: 18, fill: '#F2D27A', stroke: '#8A6526', 'stroke-width': 2 }, camA);
  const thump = burst(camA, '#FFB8D0', 46); tf(thump, 1060, -345);
  const heroTrail = [0, 1, 2, 3, 4, 5].map(() => E('path', { d: HEART, fill: '#F27AA6' }, camA));

  /* --- lobby (y > -6) --- */
  E('rect', { x: -400, y: -6, width: 2400, height: 656, fill: lgrad([[0, '#8E5E36'], [1, '#6A4226']]) }, camA);
  E('rect', { x: -400, y: -6, width: 2400, height: 108, fill: '#F2E6CB' }, camA);
  { let d = ''; for (let x = -400; x < 2000; x += 18) d += `M${x},92 v10 `; E('path', { d, stroke: '#C9A045', 'stroke-width': 7 }, camA); }
  E('rect', { x: -400, y: 102, width: 2400, height: 8, fill: '#C9A045' }, camA);
  /* oak panels + pilasters */
  { let d = ''; for (let x = -340; x < 2000; x += 260) d += `M${x},150 h200 v260 h-200 Z M${x},450 h200 v150 h-200 Z `;
    E('path', { d, fill: 'none', stroke: '#A8784A', 'stroke-width': 4 }, camA); E('path', { d, fill: 'none', stroke: '#5A3820', 'stroke-width': 2, transform: 'translate(3,3)' }, camA);
    let p = ''; for (let x = -390; x < 2000; x += 260) p += `M${x},110 h34 v530 h-34 Z `; E('path', { d: p, fill: '#7A4E2E' }, camA); }
  E('rect', { x: -400, y: 600, width: 2400, height: 40, fill: '#4E3020' }, camA);
  /* chandeliers */
  const glowA = [itrGlow(camA, 300, 150, 300, 220, '#FFE2A0', .35), itrGlow(camA, 1560, 150, 300, 220, '#FFE2A0', .35)];
  [300, 1560].forEach(x => { E('path', { d: `M${x},-6 V70`, stroke: '#7A5A2A', 'stroke-width': 3 }, camA); E('path', { d: `M${x - 50},80 Q${x},110 ${x + 50},80 M${x - 30},96 Q${x},120 ${x + 30},96`, stroke: '#C9A045', 'stroke-width': 4, fill: 'none' }, camA);
    [-50, -25, 0, 25, 50].forEach(dx => { E('circle', { cx: x + dx, cy: 74 + Math.abs(dx) * .1, r: 7, fill: '#FFF2C4' }, camA); }); });
  /* poster: the new wireless */
  { const ps = G(camA); tf(ps, 360, 300, -2);
    E('rect', { x: -118, y: -128, width: 236, height: 266, rx: 4, fill: '#3A2418' }, ps); E('rect', { x: -108, y: -118, width: 216, height: 246, fill: '#F4E9D0' }, ps);
    TX(ps, 0, -78, 'WIRELESS!', 34, '#B3261E', { a: 'middle', w: 900 });
    TX(ps, 0, -42, 'Send a telegram', 20, '#1D2B53', { a: 'middle', w: 700 }); TX(ps, 0, -18, 'from mid-ocean', 20, '#1D2B53', { a: 'middle', w: 700 });
    E('path', { d: 'M-40,90 L0,10 L40,90 M-24,58 H24 M-16,40 H16', stroke: '#1D2B53', 'stroke-width': 4, fill: 'none' }, ps);
    E('path', { d: 'M18,0 q14,10 0,22 M30,-8 q24,20 0,40 M42,-16 q34,30 0,56 M-18,0 q-14,10 0,22 M-30,-8 q-24,20 0,40 M-42,-16 q-34,30 0,56', stroke: '#B3261E', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, ps); }
  const posterWaves = G(camA); tf(posterWaves, 360, 300, -2);
  /* lift gate (right) */
  { const lf = G(camA); tf(lf, 1450, 0); E('rect', { x: -10, y: 200, width: 240, height: 410, fill: '#2A1E16' }, lf); E('rect', { x: 0, y: 210, width: 220, height: 400, fill: '#4A3A2A' }, lf);
    let d = ''; for (let i = 0; i <= 10; i++) d += `M${i * 22},210 V610 `; for (let i = 0; i < 9; i++) d += `M0,${220 + i * 48} L220,${244 + i * 48} M220,${220 + i * 48} L0,${244 + i * 48} `;
    E('path', { d, stroke: '#C9A045', 'stroke-width': 2.5 }, lf); E('rect', { x: 50, y: 160, width: 120, height: 34, rx: 4, fill: '#C9A045' }, lf); TX(lf, 110, 186, 'LIFT', 22, '#2A1E16', { a: 'middle', w: 800, ls: 3 }); }
  /* floor: lino tiles in perspective */
  E('rect', { x: -400, y: 640, width: 2400, height: 400, fill: '#E6D3AE' }, camA);
  { let d = ''; const VX = 800, VY = 150, Y = [640, 668, 702, 744, 796, 860, 940, 1040];
    const X = (u, y) => VX + (u - VX) * (y - VY) / (640 - VY);
    for (let r = 0; r < Y.length - 1; r++) for (let u = -1000; u < 2600; u += 80) { if (((u / 80) + r) % 2 === 0) continue; const a = Y[r], b = Y[r + 1];
      d += `M${f2(X(u, a))},${a} L${f2(X(u + 80, a))},${a} L${f2(X(u + 80, b))},${b} L${f2(X(u, b))},${b} Z`; }
    E('path', { d, fill: '#B8643C', 'fill-opacity': .75 }, camA); }
  E('rect', { x: -400, y: 640, width: 2400, height: 40, fill: lgrad([[0, '#000', .3], [1, '#000', 0]]) }, camA);

  /* --- purser's booth --- */
  E('rect', { x: 840, y: 250, width: 360, height: 400, fill: '#4A2E1C' }, camA);
  E('rect', { x: 858, y: 340, width: 220, height: 280, fill: '#3A2416' }, camA);
  { let d = ''; for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) d += `M${868 + i * 34},${352 + j * 44} h28 v36 h-28 Z `; E('path', { d, fill: '#2A1A10', stroke: '#6A4428', 'stroke-width': 2 }, camA);
    let e = ''; for (let k = 0; k < 14; k++) { const i = k % 6, j = Math.floor(k / 6) + (k % 2); e += `M${872 + i * 34 + hash(k) * 6},${384 + j * 44} h20 v-14 h-20 Z `; } E('path', { d: e, fill: '#F2E8D0' }, camA); }
  { const pl = G(camA); tf(pl, 1010, 292); E('rect', { x: -110, y: -28, width: 220, height: 54, rx: 6, fill: '#C9A045' }, pl); E('rect', { x: -103, y: -21, width: 206, height: 40, rx: 4, fill: '#16302A' }, pl);
    TX(pl, 0, 10, 'PURSER', 28, '#F7D77A', { a: 'middle', w: 800, ls: 4 }); }
  const purser = Person(camA, { coat: 'uniform', stripes: 1, hairStyle: 'bald', hair: '#9A7A5A', mustache: 'handlebar', mustacheColor: '#7A5A3A', glasses: true, skin: '#F0C29C', jacket: '#1F2A44', seed: 211 });
  const pForm = [form(purser.propL), form(purser.propL, true)], pCan = [canister(purser.propR), canister(purser.propR, PINK)];
  /* grille */
  E('path', { d: 'M858,620 V420 Q858,340 968,340 Q1078,340 1078,420 V620 H1060 V424 Q1060,358 968,358 Q876,358 876,424 V620 Z', fill: '#C9A045' }, camA);
  { let d = ''; for (let x = 884; x < 1060; x += 22) d += `M${x},366 V${x < 900 || x > 1040 ? 620 : 396} `; E('path', { d, stroke: '#C9A045', 'stroke-width': 3 }, camA); }
  /* glass pneumatic tube (canisters ride inside) */
  const tubeCans = G(camA);
  const streamC = [0, 1, 2].map(() => canister(tubeCans, null, 1.15));
  const heroC = [canister(tubeCans, null, 1.15), canister(tubeCans, PINK, 1.75)];
  E('rect', { x: 1096, y: -60, width: 38, height: 660, fill: '#CFE8F5', 'fill-opacity': .3, stroke: '#8FB8D0', 'stroke-width': 2 }, camA);
  E('rect', { x: 1102, y: -60, width: 6, height: 660, fill: '#fff', 'fill-opacity': .5 }, camA);
  { let d = ''; for (let y = 20; y < 600; y += 110) d += `M1092,${y} h46 `; E('path', { d, stroke: '#B88E3A', 'stroke-width': 9 }, camA); }
  E('path', { d: 'M1084,640 L1092,592 H1138 L1146,640 Z', fill: '#C9A045', stroke: '#8A6526', 'stroke-width': 2 }, camA);
  const tubeLid = E('path', { d: 'M1088,592 h54', stroke: '#8A6526', 'stroke-width': 6, 'stroke-linecap': 'round' }, camA);
  { const pl = G(camA); tf(pl, 1222, 430); E('rect', { x: -74, y: -24, width: 148, height: 46, rx: 6, fill: '#C9A045' }, pl); E('rect', { x: -68, y: -18, width: 136, height: 34, rx: 4, fill: '#F6EFD9' }, pl);
    TX(pl, -8, 7, 'WIRELESS', 19, '#1D2B53', { a: 'middle', w: 800 }); E('path', { d: 'M52,10 V-10 M45,-3 L52,-11 L59,-3', stroke: '#B3261E', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, pl);
    E('path', { d: 'M-74,0 H-86', stroke: '#8A6526', 'stroke-width': 5 }, pl); }
  const whoosh = E('path', { stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': .8 }, camA);
  /* counter */
  E('rect', { x: 820, y: 632, width: 400, height: 22, rx: 3, fill: '#EDE4D0' }, camA); E('rect', { x: 820, y: 632, width: 400, height: 5, fill: '#FFF8E8' }, camA);
  E('rect', { x: 830, y: 654, width: 380, height: 220, fill: '#6E4226' }, camA);
  [850, 980, 1110].forEach(x => { E('rect', { x, y: 672, width: 86, height: 170, rx: 5, fill: '#7E5030' }, camA); E('rect', { x: x + 6, y: 678, width: 74, height: 6, fill: '#9A6A42' }, camA); });
  { /* stack of blank forms + inkwell on the counter */ E('path', { d: 'M1170,632 l6,-14 h40 l-6,14 Z M1172,626 l6,-14 h40', fill: '#FBF7EE', stroke: '#B9AE95', 'stroke-width': 1.5 }, camA); }
  const bell = G(camA); tf(bell, 852, 632); E('path', { d: 'M-14,0 Q-14,-18 0,-18 Q14,-18 14,0 Z', fill: '#E2B84A' }, bell); E('rect', { x: -17, y: -2, width: 34, height: 4, rx: 2, fill: '#8A6526' }, bell); E('circle', { cx: 0, cy: -20, r: 3, fill: '#8A6526' }, bell);
  const ding = E('path', { d: 'M-24,-30 l-10,-8 M0,-34 v-12 M24,-30 l10,-8', stroke: '#FFE7A8', 'stroke-width': 3, 'stroke-linecap': 'round' }, bell);
  /* the queue (front = 0). Slots recede to the back-left. */
  const QS = k => [775 - 150 * k, 840 - 14 * k, .84 - .025 * k];
  const queue = [
    castPassenger(camA, 0, {}), castPassenger(camA, 3, {}), castPoshLady(camA, {}), castPassenger(camA, 2, { lite: true }),
    castPassenger(camA, 1, { lite: true, jacket: '#5E8A9A', skirt: '#4E7A8A', hatColor: '#6A2E4A' }), castPassenger(camA, 0, { lite: true, jacket: '#5A3E3E', hatColor: '#2A2020', mustache: 'walrus' })
  ];
  for (let j = queue.length - 1; j >= 0; j--) camA.appendChild(queue[j].root);
  const qForm = queue.map((R, j) => form(R.propR, j === 2));
  const perfume = G(camA); const perfH = [0, 1, 2, 3].map(() => E('path', { d: HEART, fill: '#F27AA6' }, perfume));
  const SV = [-.1, L(0) - .95, L(0) + .15, L(0) + 1.25];         /* service times: the front person hands over */
  /* foreground (parallax): velvet ropes + potted palm */
  { E('path', { d: 'M-200,872 Q-60,912 80,872 Q220,912 360,872 Q500,912 640,872', stroke: '#9A1E2E', 'stroke-width': 9, fill: 'none' }, fgA);
    [-200, 80, 360, 640].forEach(x => { E('rect', { x: x - 6, y: 862, width: 12, height: 120, fill: '#C9A045' }, fgA); E('circle', { cx: x, cy: 860, r: 11, fill: '#E2B84A' }, fgA); });
    const palm = G(fgA); tf(palm, 40, 900);
    E('path', { d: 'M-60,0 L-44,-110 H44 L60,0 Z', fill: '#8A5A34' }, palm); E('rect', { x: -52, y: -122, width: 104, height: 16, rx: 6, fill: '#A87650' }, palm);
    [[-140, -330], [-60, -400], [40, -390], [140, -300], [-170, -200], [180, -200]].forEach(([x, y]) => {
      E('path', { d: `M0,-120 Q${f2(x * .4)},${f2(y * .9)} ${x},${y} Q${f2(x * .7)},${f2(y * .7)} 0,-120 Z`, fill: '#2E6A3E' }, palm);
      E('path', { d: `M0,-120 Q${f2(x * .4)},${f2(y * .9)} ${x},${y}`, stroke: '#4E9A5E', 'stroke-width': 3, fill: 'none' }, palm); }); }
  const flashA = E('rect', { x: -2000, y: -2000, width: 6000, height: 6000, fill: '#E8F8FF' }, shA);

  /* =====================================================================
     SHOT B — the radio room (bgWireless)
     ===================================================================== */
  const shB = G(world), camB = G(shB);
  const wr = bgWireless(camB, {});
  wr.setPile(0);
  /* the LATER heap of ignored ice warnings (back-left, on the floor) */
  const HX = 215, HY = 708;
  const heapG = G(null); wr.insertBefore(heapG, wr.vignette || null);
  const heapSign = G(heapG); tf(heapSign, HX + 10, 470, -4);
  E('rect', { x: -66, y: -28, width: 132, height: 54, rx: 3, fill: '#FBF7EE', stroke: '#B9AE95', 'stroke-width': 2 }, heapSign); E('circle', { cx: 0, cy: -21, r: 4, fill: '#E84855' }, heapSign);
  TX(heapSign, -6, 12, 'LATER', 28, '#B3261E', { a: 'middle', w: 800, hand: true }); E('path', { d: 'M46,-6 v26 m-7,-8 l7,9 l7,-9', stroke: '#B3261E', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, heapSign);
  const heap = G(heapG); const heapSl = [];
  E('ellipse', { cx: 0, cy: 2, rx: 60, ry: 9, fill: '#000', 'fill-opacity': .25 }, heap);
  for (let i = 0; i < 22; i++) { const s = G(heap); iceSlip(s, 82, 18); heapSl.push({ g: s, x: (hash(i * 3.3) - .5) * 24 + (i % 2 ? 7 : -7), y: -10 - i * 11.5, r: (hash(i * 1.7) - .5) * 24 }); tf(s, heapSl[i].x, heapSl[i].y, heapSl[i].r); }
  const op1 = castWireless(wr.mid, {});
  /* hair on end */
  const spikes = G(op1.head);
  E('path', { d: 'M-36,0 L-46,-34 L-26,-8 L-22,-46 L-9,-12 L0,-52 L9,-12 L22,-46 L26,-8 L46,-34 L36,0 Z', fill: '#3A2A20' }, spikes);
  const spikeTips = E('path', { d: 'M-46,-34 l5,8 M-22,-46 l3,9 M0,-52 l0,9 M22,-46 l-3,9 M46,-34 l-5,8', stroke: '#111', 'stroke-width': 5, 'stroke-linecap': 'round' }, spikes);
  /* singed eyebrows: hide the rig's brows (found by their path) and draw two question marks */
  const rigBrows = Array.from(op1.head.querySelectorAll('path')).filter(p => p.getAttribute('d') === 'M-8,0 Q0,-4 8,0');
  const singe = G(op1.head);
  E('ellipse', { cx: -16, cy: -322, rx: 14, ry: 7, fill: '#4A3A30', 'fill-opacity': .35 }, singe); E('ellipse', { cx: 16, cy: -322, rx: 14, ry: 7, fill: '#4A3A30', 'fill-opacity': .35 }, singe);
  [-1, 1].forEach(s => TX(singe, s * 18, -312, '?', 38, '#2A1E18', { a: 'middle', w: 900 }));
  const singeSmoke = [0, 1, 2].map(() => E('path', { d: 'M0,0 q-6,-8 0,-16 q6,-8 0,-16', stroke: '#9A9AA4', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, singe));
  /* the pink snowdrift (in front of the desk). A clearing around the Morse key stays open until line 7. */
  const driftG = G(wr.over);
  const HM = 168, DCX = 772, DSG = 182;
  const driftTop = (x, K) => 632 - HM * K * Math.exp(-Math.pow((x - DCX) / DSG, 2));
  const DR = []; {
    for (let j = 0; j < 14; j++) { const lev = (j * 12 + 18) / HM, w = DSG * Math.sqrt(Math.max(0, -Math.log(Math.min(.999, lev)))), n = Math.max(1, Math.ceil(2 * w / 52));
      for (let i = 0; i < n; i++) { const x = DCX - w + (n === 1 ? w : (2 * w) * i / (n - 1)) + (hash(j * 7.1 + i) - .5) * 18, y = 622 - j * 12 + (hash(j + i * 3.3) - .5) * 6;
        let k = lev - .1 + hash(i + j * 2.2) * .06; if (x > 790 && x < 890 && k < .62) k = .66 + hash(i * 3 + j) * .1;
        DR.push({ x, y, r: (hash(i * 5.1 + j) - .5) * 50, k, s: .85 + hash(i * 2 + j) * .35 }); } }
    for (let i = 0; i < 12; i++) DR.push({ x: 450 + hash(i * 9.1) * 640, y: 650 + hash(i * 4.7) * 50, r: (hash(i * 2.9) - .5) * 80, k: .45 + hash(i * 1.3) * .4, s: 1 });
    DR.sort((a, b) => a.k - b.k);
    DR.forEach(d => { d.g = pinkTel(driftG); d.last = -1; d.face = Math.abs(d.x - 765) < 66 && d.y < 494; op(d.g, 0); }); }
  /* the operator's arm bursting out of the drift (line 7) */
  const armOut = G(wr.over);
  E('path', { d: 'M-12,40 Q-14,0 -8,-30 L8,-30 Q14,0 12,40 Z', fill: '#F7F3EA' }, armOut); E('ellipse', { cx: 0, cy: -38, rx: 14, ry: 15, fill: '#F4CFAA' }, armOut);
  E('path', { d: 'M-8,-46 v-10 M-2,-48 v-11 M4,-47 v-10', stroke: '#F4CFAA', 'stroke-width': 6, 'stroke-linecap': 'round' }, armOut);
  const armDrift = [0, 1].map(i => { const g = pinkTel(wr.over); return g; });
  /* lane: telegrams queueing on the desk (lines 2/3) */
  const laneG = G(wr.over);
  const lanePink = (label, fs) => { const g = G(laneG), body = G(g);
    E('rect', { x: -52, y: -70, width: 104, height: 70, rx: 16, fill: PINK, stroke: PINK_D, 'stroke-width': 3 }, body);
    E('path', { d: 'M-48,-64 L0,-38 L48,-64', fill: 'none', stroke: PINK_D, 'stroke-width': 2.5 }, body);
    E('rect', { x: -46, y: -38, width: 92, height: 32, rx: 4, fill: '#FFF4F7' }, body);
    const lines = label.split('\n'); const tt = TX(body, 0, lines.length > 1 ? -25 : -16, label, fs || 14, '#7A1E44', { a: 'middle', w: 800, lh: 1.05 });
    if (lines.length === 1) fitText(tt, Math.min(84, label.length * fs * .62));
    E('path', { d: 'M-18,-54 q5,-4 10,0 M8,-54 q5,-4 10,0', stroke: '#5A1030', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, body);
    const armL = E('path', { stroke: PINK_D, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, g), armR = E('path', { stroke: PINK_D, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, g);
    return { g, body, armL, armR }; };
  const laneBlue = label => { const g = G(laneG), body = G(g);
    E('rect', { x: -40, y: -24, width: 80, height: 24, rx: 2, fill: ICE, stroke: ICE_D, 'stroke-width': 2 }, body);
    let d = ''; for (let x = -34; x < 36; x += 10) d += `M${x},0 l3,${f2(5 + hash(x) * 5)} l3,${f2(-(5 + hash(x) * 5))}`; E('path', { d, fill: ICE_L, stroke: ICE_D, 'stroke-width': 1 }, body);
    TX(body, 8, -6, label, 15, '#1D4E7A', { a: 'middle', w: 800, ls: 2 });
    E('path', { d: 'M-31,-15 h2 M-23,-15 h2', stroke: '#1D3E5A', 'stroke-width': 4, 'stroke-linecap': 'round' }, body);
    E('path', { d: 'M-34,-20 l8,-3 M-24,-23 l7,3', stroke: '#1D3E5A', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, body);
    const shiv = E('path', { d: 'M-50,-22 l-6,4 M-50,-10 l-7,0 M50,-22 l6,4 M50,-10 l7,0', stroke: '#9FD8FF', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    return { g, body, shiv }; };
  const LB = [laneBlue('ICE'), laneBlue('ICE'), laneBlue('ICE!')];
  const LP = [lanePink('SOUP!', 18), lanePink('DINNER\nMENU', 15), lanePink('CONSOMMÉ\nOLGA', 14), lanePink('CREAM OF\nBARLEY', 14)];
  const LBday = lanePink('HAPPY\nBIRTHDAY', 14);
  /* fliers from the tube mouth */
  const flyG = G(wr.over);
  const FLN = 8, fliers = []; for (let i = 0; i < FLN; i++) { const g = G(flyG); fliers.push({ g, p: pinkTel(g), b: iceSlip(g) }); }
  const mouthPuff = G(flyG); E('circle', { r: 26, fill: '#fff', 'fill-opacity': .55 }, mouthPuff); E('circle', { cx: 18, cy: 8, r: 16, fill: '#fff', 'fill-opacity': .45 }, mouthPuff);
  /* morse dots & dashes rising from the key */
  const morse = G(wr.over); const mDots = []; for (let i = 0; i < 9; i++) mDots.push(i % 3 === 1 ? E('rect', { x: -9, y: -3, width: 18, height: 6, rx: 3, fill: '#FFE7A8' }, morse) : E('circle', { r: 4, fill: '#FFE7A8' }, morse));
  const smear = E('path', { d: 'M800,540 q34,-16 68,0 M796,556 q40,-18 80,0 M802,572 q34,-14 68,0', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-opacity': .6, fill: 'none', 'stroke-linecap': 'round' }, wr.over);
  /* held cards (world-level, in front of the drift) */
  const cardG = G(wr.over);
  const card = (lines, fs, opt = {}) => { const g = G(cardG); const w = opt.w || 200, h = opt.h || 120;
    E('rect', { x: -w / 2 + 4, y: -h / 2 + 6, width: w, height: h, rx: 12, fill: '#000', 'fill-opacity': .18 }, g);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: opt.fill || PINK_L, stroke: PINK_D, 'stroke-width': 3 }, g);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: 22, rx: 10, fill: PINK }, g);
    TX(g, 0, -h / 2 + 16, 'TELEGRAM', 13, '#7A1E44', { a: 'middle', w: 800, ls: 4 });
    TX(g, 0, -h / 2 + 22 + fs * 1.15, lines, fs, '#4A1030', { a: 'middle', w: 800, lh: 1.12 });
    return g; };
  const cWT = [card('WONDERFUL\nTIME.', 26), card('WONDERFUL\nTIME.', 26)];
  const cDog = card('DOG HAS JOINED\nTHIRD CLASS.\nDON\'T TELL\nMOTHER.', 21, { w: 236, h: 178 });
  E('path', { d: PAW(74, 62, 8), fill: '#7A4A2A' }, cDog); E('path', { d: 'M-70,64 q10,-14 20,0 t20,0 q8,-12 16,-2 l22,0', stroke: '#7A1E44', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, cDog);
  const cDogHearts = [0, 1, 2, 3, 4].map(() => E('path', { d: HEART, fill: '#F27AA6' }, cardG));
  const cDogWaft = E('path', { d: 'M-130,-40 q14,-14 0,-28 q-14,-14 0,-28 M130,-40 q14,-14 0,-28 q-14,-14 0,-28', stroke: '#F27AA6', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .7 }, cDog);
  const cBday = card('HAPPY\nBIRTHDAY,\nREGINALD!', 23, { w: 210, h: 150 });
  { const ck = G(cBday); tf(ck, 76, -30); E('rect', { x: -14, y: -6, width: 28, height: 18, rx: 3, fill: '#FFF' }, ck); E('rect', { x: -14, y: -6, width: 28, height: 5, fill: '#F27AA6' }, ck); E('path', { d: 'M0,-6 v-8', stroke: '#E2B84A', 'stroke-width': 3 }, ck); }
  const bdayHearts = [0, 1, 2].map(() => E('path', { d: HEART, fill: '#E8557A' }, cardG));
  const heldIce = [iceSlip(cardG, 110, 26, 'ICE'), iceSlip(cardG, 110, 26, 'ICE')];
  const flashB = E('rect', { x: -2000, y: -2000, width: 6000, height: 6000, fill: '#E8F8FF' }, shB);
  const crackle = E('path', { stroke: '#BDE6FF', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, wr.over);
  const bigBoltC = E('path', { stroke: '#7FC8FF', 'stroke-width': 16, 'stroke-opacity': .45, fill: 'none', 'stroke-linejoin': 'round' }, wr.over);
  const bigBolt = E('path', { stroke: '#FFFFFF', 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round' }, wr.over);
  const zap = burst(wr.over, '#BDE6FF', 60);

  /* =====================================================================
     SHOT C — the boat deck at dusk: Captain, Owner, the funnels
     ===================================================================== */
  const shC = G(world), camC = G(shC);
  const skyC = Sky(camC, { mood: 'dusk', y: 560, x0: -500, w: 2600, y0: -300, clouds: 0, sun: [180, 556] });
  const seaC = Sea(camC, { mood: 'dusk', y: 560, x0: -500, w: 2600, y1: 1000, sunX: 180, rows: 8 });
  const starC = G(camC); tf(starC, 190, 150); E('circle', { r: 18, fill: '#FFF6D8', 'fill-opacity': .25 }, starC); E('path', { d: 'M0,-26 L5,-5 L26,0 L5,5 L0,26 L-5,5 L-26,0 L-5,-5 Z', fill: '#FFF6D8' }, starC);
  const cTwinkle = G(camC); tf(cTwinkle, 190, 150); E('circle', { r: 40, fill: 'none', stroke: '#FFF6D8', 'stroke-width': 3 }, cTwinkle);
  /* the Owner's thought bubble: every other liner racing along at full steam too */
  const thought = G(camC); const BX = 470, BY = 220;
  [[560, 380, 9], [530, 340, 14]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#FFFDF6', stroke: '#C9B9A8', 'stroke-width': 3 }, thought));
  E('path', { d: `M${BX - 190},${BY} C${BX - 200},${BY - 80} ${BX - 90},${BY - 120} ${BX - 30},${BY - 96} C${BX + 20},${BY - 140} ${BX + 150},${BY - 120} ${BX + 160},${BY - 60} C${BX + 230},${BY - 40} ${BX + 220},${BY + 70} ${BX + 150},${BY + 80} C${BX + 120},${BY + 130} ${BX - 20},${BY + 130} ${BX - 60},${BY + 96} C${BX - 150},${BY + 120} ${BX - 230},${BY + 60} ${BX - 190},${BY} Z`, fill: '#FFFDF6', stroke: '#C9B9A8', 'stroke-width': 4 }, thought);
  const thClip = G(thought, { 'clip-path': clipRect(BX - 200, BY - 100, 390, 190, 40) });
  E('rect', { x: BX - 200, y: BY + 26, width: 390, height: 80, fill: '#9FC4E0' }, thClip);
  E('path', { d: `M${BX - 200},${BY + 26} H${BX + 190}`, stroke: '#6F9CC4', 'stroke-width': 3 }, thClip);
  const liner = (y, sc, hull) => { const g = G(thClip); const L = G(g); tf(L, 0, 0, 0, sc);
    E('path', { d: 'M-110,0 L-104,-26 L112,-26 L124,-40 L118,0 Z', fill: hull }, L); E('rect', { x: -84, y: -42, width: 170, height: 16, fill: '#F4EEE6' }, L);
    const puffs = [];
    [-60, -24, 12, 48].forEach((x, i) => { E('rect', { x: x - 9, y: -78, width: 18, height: 36, fill: '#E2A04A' }, L); E('rect', { x: x - 9, y: -78, width: 18, height: 9, fill: '#1E1A1C' }, L);
      for (let k = 0; k < 2; k++) puffs.push({ c: E('circle', { r: 10, fill: '#8A8490' }, L), x, k }); });
    E('path', { d: 'M118,-4 q14,-10 26,0 M118,4 q18,-4 30,4', stroke: '#FFFFFF', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, L);
    return { g, y, puffs }; };
  const liners = [liner(BY + 44, .66, '#2A2A34'), liner(BY + 84, .86, '#3A2A2A')];
  const speedL = E('path', { d: `M${BX - 190},${BY + 10} h60 M${BX - 170},${BY + 56} h80 M${BX - 160},${BY + 90} h50`, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, thClip);
  /* funnels (behind the deckhouse) */
  const FUN = [1060, 1215, 1370, 1525], FT = 128;
  const funPuffs = [];
  FUN.forEach((x, i) => { const f = G(camC); tf(f, x, 0, 4);
    E('rect', { x: -52, y: FT, width: 104, height: 300, fill: '#D9A35A' }, f); E('rect', { x: 22, y: FT, width: 30, height: 300, fill: '#B8823E' }, f); E('rect', { x: -44, y: FT, width: 12, height: 300, fill: '#EBC07A' }, f);
    E('rect', { x: -54, y: FT - 14, width: 108, height: 58, fill: '#1E1A1C' }, f); E('ellipse', { cx: 0, cy: FT - 14, rx: 54, ry: 10, fill: '#0E0A0C' }, f);
    E('path', { d: `M-52,${FT + 90} h104`, stroke: '#B8823E', 'stroke-width': 3 }, f);
    const pp = []; for (let k = 0; k < 6; k++) pp.push(E('circle', { r: 30, fill: '#6A5A66' }, camC)); funPuffs.push({ x: x + 6, y: FT - 18, pp }); });
  const fun4 = G(camC); tf(fun4, FUN[3], 0, 4);
  const f4cheeks = [-1, 1].map(s => E('ellipse', { cx: s * 32, cy: FT + 120, rx: 18, ry: 16, fill: '#EE9A70' }, fun4));
  const f4eyes = E('path', { stroke: '#2A1E18', 'stroke-width': 4.5, 'stroke-linecap': 'round', fill: 'none' }, fun4);
  const f4mouth = E('ellipse', { cx: 0, cy: FT + 132, rx: 7, ry: 6, fill: '#5A2A1A' }, fun4);
  const f4ring = E('circle', { cx: 0, cy: FT - 20, r: 10, fill: 'none', stroke: '#C8BCC4', 'stroke-width': 5 }, fun4);
  /* deckhouse */
  E('rect', { x: 1000, y: 330, width: 1200, height: 380, fill: lgrad([[0, '#EADAD4'], [1, '#C8B4B8']]) }, camC);
  E('rect', { x: 990, y: 316, width: 1220, height: 22, fill: '#7A5038' }, camC);
  [1130, 1460].forEach(x => { E('circle', { cx: x, cy: 470, r: 36, fill: '#B88E3A' }, camC); E('circle', { cx: x, cy: 470, r: 28, fill: '#FFD98A' }, camC); });
  { const d = G(camC); E('rect', { x: 1250, y: 420, width: 130, height: 290, rx: 4, fill: '#8A5A34' }, d); E('rect', { x: 1266, y: 438, width: 98, height: 80, rx: 6, fill: '#BFE8FF' }, d);
    const pl = G(d); tf(pl, 1315, 394); E('rect', { x: -120, y: -20, width: 240, height: 40, rx: 5, fill: '#1D2B53', stroke: '#B88E3A', 'stroke-width': 4 }, pl); fitText(TX(pl, 0, 8, 'WIRELESS TELEGRAPH', 19, '#F7D77A', { a: 'middle', w: 800 }), 216); }
  const cDoorFlash = E('rect', { x: 1266, y: 438, width: 98, height: 80, rx: 6, fill: '#FFFFFF' }, camC);
  /* ventilator cowl */
  { const v = G(camC); tf(v, 1480, 712); E('rect', { x: -22, y: -170, width: 44, height: 170, fill: '#E8DED4' }, v); E('path', { d: 'M-22,-170 Q-24,-230 30,-236 Q70,-236 70,-196 Q70,-170 40,-170 Z', fill: '#E8DED4' }, v); E('ellipse', { cx: 50, cy: -204, rx: 20, ry: 30, fill: '#7A2A22' }, v); }
  /* rail + deck */
  E('rect', { x: -600, y: 640, width: 1620, height: 12, rx: 4, fill: '#A87650' }, camC); E('rect', { x: -600, y: 640, width: 1620, height: 4, fill: '#D09A6A' }, camC);
  { let d = ''; for (let x = -580; x < 1010; x += 46) d += `M${x},652 V712 `; d += 'M-600,684 H1010'; E('path', { d, stroke: '#EDE6DA', 'stroke-width': 5 }, camC); }
  E('rect', { x: -600, y: 708, width: 2800, height: 400, fill: '#B48A5C' }, camC);
  { let d = ''; for (let i = 0; i < 9; i++) { const y = 712 + Math.pow(i / 8, 1.5) * 380; d += `M-600,${f2(y)} H2200 `; } for (let x = -600; x < 2200; x += 120) d += `M${x},712 L${f2(800 + (x - 800) * 2.4)},1100 `;
    E('path', { d, stroke: '#94704A', 'stroke-width': 2.5 }, camC); }
  E('rect', { x: -600, y: 708, width: 2800, height: 30, fill: lgrad([[0, '#000', .25], [1, '#000', 0]]) }, camC);
  E('rect', { x: -600, y: 708, width: 1600, height: 300, fill: lgrad([[0, '#FF9A6A', .18], [1, '#FF9A6A', 0]], 0, 0, 1, 0) }, camC);
  { const b = G(camC); tf(b, 120, 690); E('circle', { r: 34, fill: 'none', stroke: '#F4EEE2', 'stroke-width': 16 }, b); E('circle', { r: 34, fill: 'none', stroke: '#C8362E', 'stroke-width': 16, 'stroke-dasharray': '26.7 26.7' }, b); }
  const owner = castOwner(camC, {});
  const pocket = gagPocketOn(owner);
  const tab = G(owner.torso); tf(tab, 52, -178, 16);
  E('rect', { x: -8, y: -38, width: 17, height: 46, rx: 1.5, fill: ICE, stroke: ICE_D, 'stroke-width': 1.8 }, tab); E('path', { d: 'M-3,-30 v24 M3,-33 v27', stroke: ICE_D, 'stroke-width': 1.5 }, tab);
  E('path', { d: 'M-8,-38 l2.5,-6 l2.5,6 l2.5,-7 l2.5,7 l2.5,-6 l2.5,6 l2,-5', fill: ICE_L, stroke: ICE_D, 'stroke-width': 1 }, tab);
  const tabGlint = G(owner.torso); tf(tabGlint, 62, -214); E('path', { d: 'M0,-12 L2.5,-2.5 L12,0 L2.5,2.5 L0,12 L-2.5,2.5 L-12,0 L-2.5,-2.5 Z', fill: '#FFFFFF' }, tabGlint);
  const captain = castCaptain(camC, {});
  const slipC = G(camC); iceSlip(slipC, 176, 46, 'ICE WARNING');
  const slipFold = G(camC); iceSlip(slipFold, 44, 28);

  /* the stopped steamer (shared by the far shot and the close-up); waterline centre ≈ (805,656) */
  const steamerBody = p => {
    E('path', { d: 'M260,656 L300,724 L1300,724 L1350,656 Z', fill: '#000', 'fill-opacity': .3 }, p);
    /* masts, rigging, aerial */
    E('path', { d: 'M360,40 L240,640 M360,40 L480,560 M1230,30 L1330,600 M1230,30 L1110,545', stroke: '#22222A', 'stroke-width': 2 }, p);
    E('path', { d: 'M360,560 V40 M1230,545 V30', stroke: '#2A2830', 'stroke-width': 9 }, p);
    E('path', { d: 'M336,120 H384 M1206,110 H1254', stroke: '#2A2830', 'stroke-width': 6 }, p);
    E('path', { d: 'M360,60 Q800,120 1230,50', stroke: '#5A5A6A', 'stroke-width': 2.5, fill: 'none' }, p);
    E('path', { d: 'M800,96 L792,262', stroke: '#5A5A6A', 'stroke-width': 2.5 }, p);
    [[380, 64], [1210, 54], [800, 98]].forEach(([x, y]) => E('rect', { x: x - 4, y: y - 9, width: 8, height: 18, rx: 3, fill: '#D8D0C0' }, p));
    /* funnel */
    E('rect', { x: 1062, y: 140, width: 84, height: 200, fill: '#C9785E' }, p); E('rect', { x: 1062, y: 140, width: 84, height: 40, fill: '#18161C' }, p); E('rect', { x: 1120, y: 180, width: 26, height: 160, fill: '#000', 'fill-opacity': .2 }, p);
    E('path', { d: 'M1072,190 h64', stroke: '#E89A7A', 'stroke-width': 3 }, p);
    /* hull */
    E('path', { d: 'M240,560 L1300,560 Q1350,548 1370,520 L1350,600 Q1330,650 1290,660 L320,660 Q280,650 268,620 Z', fill: '#1E2030' }, p);
    E('path', { d: 'M248,566 L1300,566 Q1344,556 1362,530', stroke: '#E8E0D0', 'stroke-width': 5, fill: 'none' }, p);
    E('path', { d: 'M268,640 Q290,656 320,658 L1290,658 Q1320,652 1336,640', stroke: '#8A2A22', 'stroke-width': 7, fill: 'none' }, p);
    E('path', { d: 'M248,556 H1300', stroke: '#6A6A78', 'stroke-width': 2 }, p);
    { let d = ''; for (let x = 250; x < 1300; x += 14) d += `M${x},556 v-14 `; d += 'M248,542 H1300'; E('path', { d, stroke: '#8A8A98', 'stroke-width': 1.5 }, p); }
    { let d = '', l = ''; for (let x = 300; x < 1300; x += 46) if (x < 580 || x > 1060) { if (hash(x) > .6) l += dot(x, 600, 5); else d += dot(x, 600, 5); } E('path', { d, fill: '#3A3C4C' }, p); E('path', { d: l, fill: '#FFD98A' }, p); }
    /* superstructure + bridge + boats */
    E('rect', { x: 560, y: 322, width: 520, height: 238, fill: '#D6D0CC' }, p);
    E('rect', { x: 610, y: 270, width: 400, height: 54, fill: '#C8C2C0' }, p); E('rect', { x: 596, y: 262, width: 428, height: 10, fill: '#7A5A44' }, p);
    { let d = ''; for (let x = 626; x < 1000; x += 42) d += `M${x},282 h26 v22 h-26 Z `; E('path', { d, fill: '#2A3048' }, p); }
    E('rect', { x: 550, y: 312, width: 540, height: 10, fill: '#7A5A44' }, p);
    [[650, 252], [930, 252]].forEach(([x, y]) => { E('path', { d: `M${x - 54},${y} H${x + 54} Q${x + 48},${y + 18} ${x + 32},${y + 20} H${x - 32} Q${x - 48},${y + 18} ${x - 54},${y} Z`, fill: '#F2EEE6' }, p);
      E('path', { d: `M${x - 62},${y + 10} Q${x - 66},${y - 30} ${x - 40},${y - 30} M${x + 62},${y + 10} Q${x + 66},${y - 30} ${x + 40},${y - 30}`, stroke: '#3A3A44', 'stroke-width': 4, fill: 'none' }, p); });
    /* stern + bow houses */
    E('rect', { x: 260, y: 520, width: 200, height: 42, fill: '#C8C2C0' }, p); E('rect', { x: 1180, y: 516, width: 150, height: 46, fill: '#C8C2C0' }, p);
    { let d = ''; for (let x = 276; x < 450; x += 34) d += `M${x},530 h16 v12 h-16 Z `; for (let x = 1194; x < 1320; x += 34) d += `M${x},528 h16 v12 h-16 Z `; E('path', { d, fill: '#2A3048' }, p); }
    E('rect', { x: 1222, y: 500, width: 16, height: 16, fill: '#FFF2D0' }, p);
    itrGlow(p, 1230, 40, 40, 40, '#FFF2D0', .5); E('circle', { cx: 1230, cy: 40, r: 4, fill: '#FFF8E8' }, p);
    itrGlow(p, 360, 50, 40, 40, '#FFF2D0', .4); E('circle', { cx: 360, cy: 50, r: 3.5, fill: '#FFF8E8' }, p);
  };
  /* =====================================================================
     SHOT D — open sea, dusk to night; a small steamer far off in the ice
     ===================================================================== */
  const shD = G(world), camD = G(shD);
  const skyD1 = Sky(camD, { mood: 'dusk', y: 520, x0: -400, w: 2600, y0: -300, clouds: 3, sun: [120, 522] });
  const skyD2 = nightSky(camD, -400, -300, 2600, 520, 3, 320);
  const seaD = Sea(camD, { mood: 'dusk', y: 520, x0: -400, w: 2600, y1: 1000, sunX: 120, rows: 6 });
  const seaDark = E('rect', { x: -400, y: 518, width: 2600, height: 500, fill: lgrad([[0, '#141A3A', .9], [1, '#05070F', .95]]) }, camD);
  /* the far steamer + its little ice field */
  const farIce = G(camD); tf(farIce, 1330, 528, 0, .2);
  { let d = '', e = ''; for (let i = 0; i < 26; i++) { const a = hash(i * 3.7) * Math.PI * 2, rr = 520 + hash(i * 1.9) * 1100, x = Math.cos(a) * rr * 1.1, y = 8 + Math.abs(Math.sin(a)) * rr * .07 * (Math.sin(a) > 0 ? 1.4 : .5), w = 60 + hash(i * 5.3) * 140;
      d += `M${f2(x - w)},${f2(y)} L${f2(x - w * .6)},${f2(y - 10)} L${f2(x + w * .7)},${f2(y - 9)} L${f2(x + w)},${f2(y)} Z `; e += `M${f2(x - w)},${f2(y)} L${f2(x + w)},${f2(y)} L${f2(x + w * .9)},${f2(y + 8)} L${f2(x - w * .9)},${f2(y + 8)} Z `; }
    E('path', { d: e, fill: '#4A5680' }, farIce); E('path', { d, fill: '#B8C6E6' }, farIce); }
  const SFX = 1330, SFY = 530, SFS = .2;
  const steamerFar = G(camD); tf(steamerFar, SFX - 805 * SFS, SFY - 656 * SFS, 0, SFS);
  steamerBody(steamerFar);
  E('rect', { x: 600, y: 340, width: 440, height: 216, fill: '#FFD98A' }, steamerFar);
  { let d = ''; for (let x = 620; x < 1030; x += 70) d += `M${x},350 v196 `; E('path', { d, stroke: '#C8964A', 'stroke-width': 10 }, steamerFar); }
  const farGlow = itrGlow(camD, SFX, SFY - 40, 70, 40, '#FFD98A', .6);
  const farWaves = G(camD); const fw = [0, 1, 2].map(() => E('path', { stroke: '#BDE6FF', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }, farWaves));
  const tit = Titanic(camD, { mood: 'dusk' });
  /* cheap local smoke (the asset's plume uses ~76 half-transparent groups, too costly with the moving camera here) */
  const smokeD = G(camD); const SMK = [];
  for (let f = 0; f < 4; f++) for (let k = 0; k < 10; k++) SMK.push({ f, k, c: E('circle', { r: 10, fill: '#625666' }, smokeD), hl: E('circle', { r: 6, fill: '#B8A6B4' }, smokeD) });
  /* speed spray in the foreground */
  const sprayD = G(camD); const spr = []; for (let i = 0; i < 9; i++) spr.push(E('path', { stroke: '#FFE2D0', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': .6 }, sprayD));

  /* =====================================================================
     SHOT E — the stopped steamer in the ice field (cutaway wireless cabin), night
     ===================================================================== */
  const shE = G(world), camE = G(shE);
  const skyE = nightSky(camE, -600, -500, 2800, 560, 11, 420);
  const seaE = Sea(camE, { mood: 'night', calm: true, stars: false, y: 560, x0: -600, w: 2800, y1: 1200, rows: 6 });
  /* pack ice along the horizon */
  { let d = 'M-600,566'; for (let x = -600; x <= 2200; x += 40) d += ` L${x},${f2(561 - hash(x * .37) * 7)}`; d += ' L2200,574 L-600,574 Z'; E('path', { d, fill: '#9AA8CC', 'fill-opacity': .8 }, camE); }
  /* the Titanic far away: a string of lights racing along the horizon */
  const farTit = G(camE);
  { E('path', { d: 'M-90,0 L-86,-9 L92,-9 L96,0 Z', fill: '#0A0C16' }, farTit); [-40, -14, 12, 38].forEach(x => E('rect', { x, y: -22, width: 9, height: 13, fill: '#1A1820' }, farTit));
    let d = ''; for (let i = 0; i < 26; i++) { const x = -82 + i * 6.6; d += `M${f2(x)},-5 h2.6 `; if (i % 2) d += `M${f2(x + 2)},-11 h2 `; } E('path', { d, stroke: '#FFE2A0', 'stroke-width': 2.4 }, farTit);
    itrGlow(farTit, 0, -6, 130, 18, '#FFD98A', .4); }
  /* ice field: flat floes around the ship (back half before the ship, front half after) */
  const floe = (p, x, y, w, sd) => { const g = G(p); tf(g, x, y); const h = w * .16, t = Math.max(5, w * .06);
    const P = []; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, r = .78 + hash(sd * 3.1 + k * 1.7) * .3; P.push([Math.cos(a) * w / 2 * r, Math.sin(a) * h * r]); }
    const top = 'M' + P.map(q => f2(q[0]) + ',' + f2(q[1])).join(' L') + ' Z';
    E('path', { d: top, fill: '#56628C', transform: `translate(0,${f2(t)})` }, g); E('path', { d: top, fill: '#C3CEEA' }, g);
    E('path', { d: `M${f2(-w * .28)},${f2(-h * .2)} Q0,${f2(-h * .5)} ${f2(w * .24)},${f2(-h * .25)}`, stroke: '#EEF3FF', 'stroke-width': 2, fill: 'none', 'stroke-opacity': .7 }, g);
    return g; };
  const iceBack = G(camE), FL = [];
  for (let i = 0; i < 26; i++) { const y = 578 + Math.pow(hash(i * 2.9), 1.3) * 76, w = 40 + (y - 570) * 2.6 * (.6 + hash(i * 1.3) * .8), x = -500 + hash(i * 4.1 + 2) * 2600;
    FL.push({ g: floe(iceBack, x, y, w, i), x, y, ph: hash(i) * 6 }); }
  const shipE = G(camE);
  steamerBody(shipE);
  /* cabin interior (cutaway): x 600–1040, y 340–556 */
  const cab = G(shipE);
  E('rect', { x: 600, y: 340, width: 440, height: 216, fill: '#8E6440' }, cab);
  { let d = ''; for (let x = 612; x < 1040; x += 26) d += `M${x},340 V556 `; E('path', { d, stroke: '#7A5434', 'stroke-width': 2 }, cab); }
  E('rect', { x: 600, y: 540, width: 440, height: 16, fill: '#5A3A22' }, cab);
  /* porthole */
  E('circle', { cx: 952, cy: 392, r: 20, fill: '#B88E3A' }, cab); E('circle', { cx: 952, cy: 392, r: 14, fill: '#0E1838' }, cab); E('circle', { cx: 947, cy: 387, r: 1.6, fill: '#fff' }, cab);
  /* clock (11:35) */
  { const c = G(cab); tf(c, 770, 372); E('circle', { r: 20, fill: '#B88E3A' }, c); E('circle', { r: 16, fill: '#FBF7EE' }, c);
    E('path', { d: 'M0,0 V-13', stroke: '#2A2A30', 'stroke-width': 2.2, 'stroke-linecap': 'round', transform: 'rotate(210)' }, c); E('path', { d: 'M0,0 V-8', stroke: '#2A2A30', 'stroke-width': 3, 'stroke-linecap': 'round', transform: 'rotate(347)' }, c); }
  /* headphones hook (left wall) */
  E('rect', { x: 638, y: 366, width: 8, height: 12, fill: '#B88E3A' }, cab);
  const phones = (p, s = 1) => { const g = G(p); E('path', { d: 'M-22,6 Q-24,-30 0,-31 Q24,-30 22,6', stroke: '#2A2622', 'stroke-width': 5, fill: 'none' }, g); [-1, 1].forEach(k => E('rect', { x: k * 22 - 8, y: -4, width: 16, height: 22, rx: 6, fill: '#3A3436' }, g)); tf(g, 0, 0, 0, s); return g; };
  const hookPh = G(cab); tf(hookPh, 642, 400); phones(hookPh);
  /* switch: ON / OFF */
  { const s = G(cab); tf(s, 852, 425); E('rect', { x: -24, y: -44, width: 48, height: 88, rx: 4, fill: '#2A2622' }, s);
    TX(s, 0, -28, 'ON', 13, '#9AE6A0', { a: 'middle', w: 800 }); TX(s, 0, 39, 'OFF', 13, '#FF9A8A', { a: 'middle', w: 800 }); }
  const switchArm = G(cab); tf(switchArm, 852, 425); E('rect', { x: -3, y: -26, width: 6, height: 26, rx: 3, fill: '#C9CED6' }, switchArm); E('circle', { cx: 0, cy: -26, r: 5.5, fill: '#E84855' }, switchArm);
  /* chair behind the operator */
  E('path', { d: 'M680,546 V448 M724,546 V448 M680,452 H724 M680,470 H724 M676,500 H728', stroke: '#5A3820', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, cab);
  E('rect', { x: 672, y: 496, width: 60, height: 9, rx: 3, fill: '#6A4428' }, cab);
  /* bunk */
  E('rect', { x: 884, y: 466, width: 154, height: 76, fill: '#6A4428' }, cab);
  E('rect', { x: 888, y: 482, width: 146, height: 22, rx: 6, fill: '#E8E0D0' }, cab);
  E('ellipse', { cx: 994, cy: 482, rx: 24, ry: 11, fill: '#FBF7EE' }, cab);
  /* candle shelf (right wall, by the pillow) */
  E('rect', { x: 994, y: 440, width: 44, height: 7, rx: 2, fill: '#6A4428' }, cab);
  E('rect', { x: 1014, y: 418, width: 10, height: 22, rx: 2, fill: '#FBF3DE' }, cab);
  const candleGlow = itrGlow(cab, 1019, 412, 140, 120, '#FFD27A', .55);
  const flame = E('path', { d: 'M1019,398 Q1026,408 1019,416 Q1012,408 1019,398 Z', fill: '#FFD27A' }, cab);
  const candleSmoke = E('path', { d: 'M1019,414 q-6,-10 0,-20 q6,-10 0,-20 q-6,-10 0,-20', stroke: '#B8B8C8', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, cab);
  const breath = E('path', { d: 'M0,0 q8,-6 16,0 t16,0 M2,10 q8,-6 16,0', stroke: '#E8F0FF', 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, cab);
  /* the other operator (no hat: his headphones and nightcap are local overlays) */
  const op2 = Person(cab, { coat: 'waistcoat', jacket: '#5A6E4A', shirt: '#EDE6D6', tie: '#7A3A2A', hairStyle: 'curly', hair: '#B5562A', skin: '#F0C29C', mustache: true, mustacheColor: '#9A4A22', rim: MOON, seed: 707 });
  const ph2 = G(op2.head); tf(ph2, 0, -306); E('path', { d: 'M-48,4 Q-52,-66 0,-68 Q52,-66 48,4', stroke: '#2A2622', 'stroke-width': 9, fill: 'none' }, ph2); [-1, 1].forEach(k => E('rect', { x: k * 48 - 14, y: -14, width: 28, height: 40, rx: 11, fill: '#3A3436' }, ph2));
  const handPh = phones(cab);
  const nightcap = G(op2.head); E('path', { d: 'M-46,-322 Q-40,-388 10,-384 Q60,-380 92,-332 Q70,-350 40,-346 Q0,-350 -46,-322 Z', fill: '#4E6EA8' }, nightcap);
  E('path', { d: 'M-40,-346 Q10,-372 70,-346', stroke: '#E8E0D0', 'stroke-width': 7, fill: 'none' }, nightcap); E('circle', { cx: 94, cy: -330, r: 12, fill: '#F4EEE2' }, nightcap);
  E('rect', { x: -50, y: -334, width: 100, height: 16, rx: 8, fill: '#E8E0D0' }, nightcap);
  /* desk in front of him, with the set and the key */
  E('rect', { x: 612, y: 482, width: 196, height: 12, rx: 3, fill: '#7A5030' }, cab); E('rect', { x: 620, y: 494, width: 180, height: 62, fill: '#5A3820' }, cab);
  E('rect', { x: 632, y: 504, width: 70, height: 20, rx: 3, fill: '#6A4428' }, cab); E('rect', { x: 718, y: 504, width: 70, height: 20, rx: 3, fill: '#6A4428' }, cab);
  E('rect', { x: 622, y: 436, width: 70, height: 46, rx: 4, fill: '#2A2A30' }, cab); [636, 656, 676].forEach(x => E('circle', { cx: x, cy: 466, r: 6, fill: '#4A4A54' }, cab));
  const valveGlow = itrGlow(cab, 660, 424, 56, 46, '#FFB860', .85);
  E('rect', { x: 652, y: 408, width: 16, height: 26, rx: 8, fill: '#E8E0D0', 'fill-opacity': .5 }, cab);
  const valve = E('rect', { x: 655, y: 412, width: 10, height: 18, rx: 5, fill: '#FFC870' }, cab);
  const keyE = G(cab); tf(keyE, 752, 482); E('rect', { x: -22, y: -6, width: 44, height: 6, rx: 2, fill: '#2A2A30' }, keyE);
  const keyArm = G(keyE); E('rect', { x: -18, y: -12, width: 34, height: 5, rx: 2, fill: '#E2B84A' }, keyArm); E('ellipse', { cx: 14, cy: -14, rx: 7, ry: 4, fill: '#1A1618' }, keyArm);
  const keySpk = E('path', { d: 'M8,-8 l-4,-8 M14,-6 l2,-10 M20,-8 l6,-6', stroke: '#BDE6FF', 'stroke-width': 2, 'stroke-linecap': 'round' }, keyE);
  const blanket = G(cab); E('path', { d: 'M880,478 Q920,466 966,470 L972,530 L880,530 Z', fill: '#B8463A' }, blanket); E('path', { d: 'M880,478 Q920,466 966,470', stroke: '#E8E0D0', 'stroke-width': 6, fill: 'none' }, blanket);
  E('path', { d: 'M892,496 h70 M892,508 h70', stroke: '#9A3A30', 'stroke-width': 2 }, blanket);
  const cabDark = E('rect', { x: 600, y: 340, width: 440, height: 216, fill: '#070A1A' }, cab);
  /* cutaway frame */
  E('path', { d: 'M596,336 H1044 V560 H596 Z', fill: 'none', stroke: '#EDE6DA', 'stroke-width': 9 }, shipE);
  E('path', { d: 'M596,336 H1044 V560 H596 Z', fill: 'none', stroke: '#5A5050', 'stroke-width': 2 }, shipE);
  const shipLamp = itrGlow(shipE, 820, 450, 300, 180, '#FFD27A', .22);
  const zzz = G(shipE); const zz = [0, 1, 2].map(i => TX(zzz, 0, 0, 'z', 30 + i * 8, '#DCE6FF', { w: 800, it: true }));
  const iceFront = G(camE);
  for (let i = 0; i < 16; i++) { const y = 676 + Math.pow(hash(i * 3.9 + 1), 1.2) * 300, w = 60 + (y - 640) * 1.4 * (.6 + hash(i * 2.3) * .7), x = -600 + hash(i * 5.3 + 7) * 2800;
    FL.push({ g: floe(iceFront, x, y, w, i + 40), x, y, ph: hash(i + 9) * 6 }); }
  { const cl = [[180, 640, 190], [1420, 630, 210], [70, 668, 150], [1560, 664, 170], [520, 700, 230], [1080, 712, 260]]; cl.forEach(([x, y, w], i) => FL.push({ g: floe(iceFront, x, y, w, i + 70), x, y, ph: i })); }
  /* radio arcs + the message */
  const arcsE = G(camE); const arcE = [0, 1, 2, 3].map(() => E('path', { stroke: '#BDE6FF', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, arcsE));
  const msgE = G(camE); tf(msgE, 420, 186);
  E('rect', { x: -230, y: -48, width: 460, height: 92, rx: 14, fill: '#0E1838', 'fill-opacity': .85, stroke: '#BDE6FF', 'stroke-width': 3 }, msgE);
  TX(msgE, 0, -8, 'STOPPED.', 30, '#E8F6FF', { a: 'middle', w: 800, ls: 1 }); TX(msgE, 0, 28, 'SURROUNDED BY ICE.', 30, '#E8F6FF', { a: 'middle', w: 800, ls: 1 });
  const shutE = G(camE); tf(shutE, 690, 300);
  E('path', { d: 'M-120,-40 L-96,-58 L-70,-44 L-40,-66 L-10,-46 L24,-70 L50,-46 L86,-62 L104,-36 L130,-30 L110,-6 L128,20 L96,26 L80,48 L46,32 L10,52 L-20,32 L-56,48 L-74,24 L-112,26 L-104,0 L-130,-16 Z', fill: '#FFF4E8', stroke: '#C8362E', 'stroke-width': 4, 'stroke-linejoin': 'round' }, shutE);
  TX(shutE, 0, -10, 'SHUT UP!', 26, '#C8362E', { a: 'middle', w: 900 }); TX(shutE, 0, 20, "I'M BUSY!", 20, '#C8362E', { a: 'middle', w: 900 });
  E('path', { d: 'M40,44 L66,80 L70,40', fill: '#FFF4E8', stroke: '#C8362E', 'stroke-width': 4, 'stroke-linejoin': 'round' }, shutE);

  /* =====================================================================
     UPDATE
     ===================================================================== */
  const shots = [[shA, 0, T_AB], [shB, T_AB, T_BC], [shC, T_BC, T_CD], [shD, T_CD, T_DE], [shE, T_DE, T_EB], [shB, T_EB, T_BE], [shE, T_BE, 1e9]];
  return (lt, at) => {
    const vis = g => shots.some(([h, a, b]) => h === g && lt >= a && lt < b);
    const onA = vis(shA), onB = vis(shB), onC = vis(shC), onD = vis(shD), onE = vis(shE);
    op(shA, onA ? 1 : 0); op(shB, onB ? 1 : 0); op(shC, onC ? 1 : 0); op(shD, onD ? 1 : 0); op(shE, onE ? 1 : 0);

    /* ================= A ================= */
    if (onA) {
      const tPan0 = L(0) + 1.85, tPan1 = L(0) + 2.95;
      const cv = camVal(lt, [[0, 800, 450, 1], [tPan0, 820, 450, 1], [tPan1, 960, -360, 1], [T_AB - .75, 960, -330, 1.08], [T_AB, 960, -300, 2.7]]);
      camSet(camA, cv); camSet(fgA, cv, 1.6);
      glowA.forEach((g, i) => op(g, .8 + .2 * wob(at * 2, i)));
      /* queue */
      const adv = SV.reduce((s, t) => s + prog(lt, t + .55, .65), 0);
      queue.forEach((R, j) => {
        const leaveT = SV[j] != null ? SV[j] + .45 : 1e9, e = clamp((lt - leaveT) / 1.6);
        let x, y, s; const st = { at, turn: .45, look: [1, -.1], face: 'neutral' };
        if (e > 0) { x = lerp(775, 1800, e); y = lerp(840, 884, Math.min(1, e * 3)); s = lerp(.84, .92, Math.min(1, e * 3)); Object.assign(st, walkFeet(e * 22, 1)); st.turn = .6; st.look = [1, 0]; st.face = 'happy'; }
        else {
          const q = j - adv, k0 = Math.floor(q), fr = q - k0, A0 = QS(Math.max(0, k0)), A1 = QS(Math.max(0, k0 + 1));
          x = lerp(A0[0], A1[0], fr); y = lerp(A0[1], A1[1], fr); s = lerp(A0[2], A1[2], fr);
          if (fr > .02 && fr < .98) Object.assign(st, walkFeet(fr * 9, .8));
          const ph = at * .6 + j * 1.9;
          st.headTilt = Math.sin(ph) * 3; st.bob = (st.bob || 0) + Math.sin(at * 1.6 + j) * 1.2;
          if (j === 2) { st.fan = .9; st.face = 'proud'; st.look = [1, -.2]; }
          if (j === 3) { st.look = [Math.sin(ph * .7) > 0 ? 1 : -.6, 0]; st.face = 'think'; }
          if (j === 4) { st.hx = Math.sin(ph) * 6; st.look = [1, -.3]; }
          if (j === 5) { st.face = Math.sin(ph * .5) > .3 ? 'worried' : 'neutral'; st.hL = [-40, -210 + Math.sin(at * 3) * 6]; }
        }
        const hv = SV[j] != null ? win(lt, SV[j] - .45, SV[j] + .25, .35, .3) : 0;
        if (hv > 0) { st.hR = [lerp(58, 74, hv), lerp(-128, -246, hv)]; st.bendR = -20; st.tilt = 4 * hv; if (j === 2) op(R.fan, 1 - hv); }
        else if (j === 2) op(R.fan, 1);
        op(qForm[j], SV[j] != null && lt < SV[j] + .22 ? 1 : 0);
        st.x = x; st.y = y; st.s = s;
        R.set(st);
      });
      /* perfume hearts from the lady's pink form */
      { const q = 2 - adv, k0 = Math.floor(q), x = lerp(QS(Math.max(0, k0))[0], QS(Math.max(0, k0 + 1))[0], q - k0);
        const hv = win(lt, SV[2] - .45, SV[2] + .25, .35, .3);
        const hx = x + .84 * lerp(58, 74, hv), hy = 840 + .84 * lerp(-128, -246, hv);
        const on = lt < SV[2] + .25 ? 1 : 1 - prog(lt, SV[2] + .25, .4);
        perfH.forEach((h, i) => { const k = (at * .5 + i / 4) % 1; tf(h, hx - 10 + Math.sin(at * 2 + i * 2) * 10, hy - 20 - k * 60, 0, .8 + k * .4); op(h, on * Math.sin(Math.PI * k)); });
        op(perfume, on > 0 ? 1 : 0); }
      /* purser: take (left), roll, drop into the tube (right) */
      { let m = -1; for (let i = 0; i < SV.length; i++) if (lt >= SV[i] - .4) m = i;
        const t = m >= 0 ? lt - SV[m] : 9;
        const px = keyed(t, [[-.4, 1000], [0, 935], [.25, 935], [.6, 1030], [1.0, 1030], [1.4, 1000]]);
        const st = { at, x: px, y: 772, s: .88, turn: t < .45 ? -.5 : .4, look: t < .45 ? [-1, .2] : [1, .3], face: t > .3 && t < .9 ? 'focus' : 'happy' };
        const reach = win(t, -.25, .3, .2, .2);
        st.hL = t < .45 ? [lerp(-58, -112, reach), lerp(-128, -186, reach)] : [-30, -150];
        st.hR = t > .3 && t < 1.05 ? [lerp(40, 88, prog(t, .55, .3)), lerp(-160, -222, prog(t, .55, .3))] : [58, -128];
        st.bob = Math.sin(at * 3) * 1.5; st.headTilt = (t > .3 && t < .6) ? Math.sin(at * 20) * 3 : 0;
        purser.set(st);
        const pink = m === 2;
        pForm.forEach((f, i) => { op(f, (i === 1) === pink && t > .2 && t < .55 ? 1 : 0); tf(f, 0, 0, 0, 1 - prog(t, .35, .2) * .6); });
        pCan.forEach((c, i) => op(c, (i === 1) === pink && t >= .5 && t < .82 ? 1 : 0));
        tubeLid.setAttribute('transform', t > .7 && t < 1.0 ? 'rotate(-35 1088 592)' : '');
        op(ding, win(t, -.15, .1, .05, .25)); }
      /* canisters in the glass tube */
      streamC.forEach((c, i) => { const per = .62, ph = ((lt + i * per / 3) % per) / per; const y = lerp(760, -120, ph); tf(c, 1115, y); op(c, y < 600 ? 1 : 0); });
      /* the perfumed canister rides up with the camera (it stays in frame through the pan) */
      const T2 = SV[2] + .82, pp = clamp((lt - tPan0) / (tPan1 - tPan0));
      const heroY = lt < T2 ? 600 : lt < tPan0 ? lerp(600, 470, (lt - T2) / Math.max(.1, tPan0 - T2)) : lt < tPan1 ? cv[1] + lerp(20, 15, pp) : -345 - (lt - tPan1) * 400;
      heroC.forEach((c, i) => { let y = 2000; for (let m = 0; m < SV.length; m++) { if ((m === 2) !== (i === 1)) continue; const t0 = SV[m] + .82; if (lt >= t0) y = m === 2 ? heroY : 600 - (lt - t0) * 1500; }
        tf(c, 1115, y); op(c, y < 600 && y > -70 ? 1 : 0); });
      heroTrail.forEach((h, i) => { const y = heroY + 40 + i * 34; const on = lt > T2 && lt < tPan1 && y < 600 ? 1 : 0; tf(h, 1115 + Math.sin(at * 6 + i * 1.3) * 18, y, 0, 1.3 - i * .12); op(h, on * (1 - i / 6)); });
      { tubeBulge.setAttribute('cy', f2(heroY)); op(tubeBulge, heroY < -60 && heroY > -330 ? 1 : 0);
        whoosh.setAttribute('d', `M1078,${f2(heroY + 30)} v70 M1152,${f2(heroY + 20)} v90`); op(whoosh, heroY < 560 && heroY > -60 ? 1 : 0);
        const th = prog(lt, tPan1 - .02, .35); tf(thump, 1060, -345, 0, .5 + th); op(thump, th > 0 && th < 1 ? 1 - th : 0); }
      /* door: flicker, sparks, rattle, telegrams under the door, burst open */
      { const fr = Math.floor(at * 18), fl = hash(fr * 1.3) > .45 ? 1 : .35, rise = prog(lt, tPan1 - .1, .4);
        op(doorGlow, (.5 + .5 * rise) * (.55 + .45 * fl)); doorWin.setAttribute('fill', mix('#8FB8D8', '#F2FBFF', fl * (.5 + .5 * rise)));
        let d = 'M30,-380'; for (let i = 1; i < 6; i++) d += ` L${30 + i * 19},${f2(-380 + (hash(fr + i) - .5) * 44 + i * 9)}`; doorWinB.setAttribute('d', d); op(doorWinB, fl > .5 ? 1 : 0);
        op(doorGaps, .3 + .7 * fl * (.4 + .6 * rise));
        doorBolts.forEach((b, i) => { const on = hash(fr * 2.1 + i * 7.3) < .35 + .45 * rise; if (!on) { op(b, 0); return; }
          const side = i % 2 ? 1046 : 874, y0 = -400 + hash(fr + i * 3) * 280, d = boltD([side, y0], [side + (i % 2 ? 1 : -1) * (50 + hash(fr * 3 + i) * 70), y0 + (hash(fr * 5 + i) - .5) * 90], fr + i, 5, 26);
          b.childNodes.forEach(c => c.setAttribute('d', d)); op(b, 1); });
        underDoor.forEach((u, i) => { const k = ((lt * .8 + i / 4) % 1); tf(u, 900 + i * 40 + k * 60 * (i % 2 ? 1 : -1), -100 + k * 20, (k * 200 + i * 40) * (i % 2 ? 1 : -1)); op(u, Math.sin(Math.PI * k) * prog(lt, tPan1 - .2, .3)); });
        const fr2 = Math.floor(at * 12), ab = hash(fr2 * 1.9) < .35 + .4 * rise; if (ab) aerialBolt.setAttribute('d', boltD([745 + hash(fr2) * 10, -880 + hash(fr2 * 3) * 150], [760, -660], fr2, 5, 18) + boltD([1130 - hash(fr2 * 2) * 10, -900 + hash(fr2 * 7) * 160], [1120, -660], fr2 + 9, 5, 18)); op(aerialBolt, ab ? 1 : 0);
        const open = prog(lt, T_AB - .45, .4, easeIn);
        tf(doorPanel, 880 + Math.sin(at * 53) * 2 * rise * (1 - open), 0, Math.sin(at * 40) * 1.4 * rise * (1 - open), 1 - open * .92, 1); op(doorLight, open > 0 ? 1 : 0);
        op(flashA, prog(lt, T_AB - .2, .2)); }
    }

    /* ================= B ================= */
    if (onB) {
      const B2 = lt >= T_EB, t7 = L(7), JAB = t7 + .85;
      const cv = B2 ? camVal(lt, [[T_EB, 720, 480, 1.35], [t7 + .1, 760, 480, 1.7], [t7 + .65, 785, 478, 2.2], [T_BE, 784, 474, 2.35]])
        : camVal(lt, [[T_AB, 800, 450, 1.0], [L(1) - .3, 780, 450, 1.0], [L(1) + .5, 640, 470, 1.3], [L(2) - .4, 640, 470, 1.32], [L(2) + .2, 560, 560, 1.9], [L(3) - .5, 575, 555, 1.95], [L(3) - .05, 560, 470, 1.25], [T_BC, 580, 470, 1.3]]);
      camSet(camB, cv);
      /* drift level */
      const K = B2 ? .87 : keyed(lt, [[T_AB, .08], [L(1), .13], [L(2), .2], [L(3), .28], [T_BC, .34]], lin);
      DR.forEach((d, i) => { const buried = d.y < 600 && driftTop(d.x, K) < d.y - 100 && Math.abs(d.x - 772) > 120;   /* deep inside the heap: covered, skip drawing it */
        const p = (B2 && d.face) || buried ? 0 : clamp((K - d.k) / .05); const v = p > 0 ? Math.round(p * 20) / 20 : 0;
        if (v <= 0) { if (d.last !== 0) { op(d.g, 0); d.last = 0; } return; }
        const fl = (i % 5 === 0) ? Math.sin(at * 3 + i) * 3 : 0;
        if (v === 1 && d.last === 1 && !fl) return;
        tf(d.g, d.x, d.y - (1 - v) * 60, d.r * v + fl + (1 - v) * 40, d.s); if (d.last <= 0) op(d.g, 1); d.last = v; });
      /* operator acting */
      const tk = cue.talk(lt, 'W');
      const st = { at, x: 760, y: 765, s: 1, sit: true, talk: tk, face: 'worried', hR: [76, -199], hL: [-62, -150], bendL: 18, bendR: -14, look: [0, 0], sweat: 0 };
      let keyD = 0, tap = 0, spikeK = 0;
      if (!B2) {
        tap = lt < L(2) - .2 ? 1 : lt < L(3) - .6 ? .5 : 0;
        spikeK = prog(lt, L(1) - .2, .3, easeBack);
        if (lt < L(1)) { st.face = 'scared'; st.look = [-.8, -.4]; tap = .6; }
        else if (lt < L(2)) { st.face = lt < L(1) + 1.8 ? 'worried' : 'surprise'; st.sweat = .7; }
        else if (lt < L(3) - .6) { st.face = 'focus'; st.look = [-.7, .5]; }
        else st.face = lt < L(3) + 1.3 ? 'neutral' : 'joy';
      } else { st.face = 'focus'; spikeK = 1.15; st.sweat = .8; }
      if (tap) { const v = Math.sin(at * 48); keyD = .5 + .5 * v; st.hR = [76 + v * 2, -197 + Math.abs(v) * 7]; st.bob = Math.sin(at * 24) * 1.5 * tap; }
      const handAt = (x, y) => [(x - 760), (y - 765)];
      const cardsOn = [0, 0, 0, 0];
      let cpos = null;
      if (!B2) {
        const w1 = win(lt, L(1) - .1, L(1) + .85, .2, .15), w2 = win(lt, L(1) + .85, L(1) + 1.7, .15, .15), w3 = win(lt, L(1) + 1.7, L(2) + .1, .2, .3);
        if (w1 > 0) { cardsOn[0] = w1; cpos = [560, 410, -8, w1]; }
        else if (w2 > 0) { cardsOn[1] = w2; cpos = [575, 400, 6, w2]; }
        else if (w3 > 0) { cardsOn[2] = w3; cpos = [540, 400, -4, w3 * 1.05]; st.face = lt > L(1) + 3.1 ? 'surprise' : 'worried'; st.blush = win(lt, L(1) + 2.6, L(2), .3, .3) * .8; st.look = [-.8, -.2]; }
        if (cpos) { st.hL = handAt(cpos[0] + 70, cpos[1] + 60); st.bendL = 30; }
        /* line 3: two ice slips over the shoulder, then the birthday telegram */
        const g1 = L(3) - .15, g2 = L(3) + .55, gb = L(3) + 1.2;
        [g1, g2].forEach((g) => { const hold = win(lt, g - .1, g + .45, .1, .05); if (hold > 0) { st.hL = keyed(lt, [[g - .1, [-100, -200]], [g + .2, [-110, -250]], [g + .45, [-20, -360]]]); st.look = [-.7, .2]; st.face = 'neutral'; st.headTilt = -6; } });
        const hug = prog(lt, gb + .7, .4);
        if (lt > gb - .1) { cardsOn[3] = 1; st.face = 'joy'; st.hL = [lerp(-140, -40, hug), lerp(-280, -200, hug)]; if (hug > 0) st.hR = [lerp(76, 40, hug), lerp(-199, -200, hug)]; st.headTilt = hug * 8 * Math.sin(at * 3); st.look = [-.5, -.2]; }
      }
      /* line 7: the arm bursts out of the drift and jabs the key */
      let armK = 0;
      if (B2) { st.y = 750; st.look = [.3, .5]; armK = prog(lt, t7 + .25, .25, easeBack);
        st.hR = [70, -250]; if (lt > JAB + .05) st.face = 'surprise';
        keyD = lt > JAB && lt < JAB + .35 ? 1 : 0; }
      op1.set(st);
      wr.setKey(keyD);
      tf(spikes, 0, -342, 0, 1, Math.max(.05, spikeK)); op(spikes, spikeK > .06 ? 1 : 0);
      { const pump = B2 ? Math.abs(Math.sin((lt - t7) * 9)) * (lt < JAB ? 1 : 0) : 0, jab = B2 && lt >= JAB ? 1 - prog(lt, JAB + .4, .4) : 0;
        tf(armOut, 872, lerp(560, 476, armK) + pump * 26 + jab * 40, (B2 ? Math.sin((lt - t7) * 9) * 6 : 0)); op(armOut, armK > .02 ? 1 : 0);
        armDrift.forEach((g, i) => { tf(g, 872 + (i ? 30 : -30), 556 - armK * 12, (i ? 30 : -30) * armK); op(g, armK > .02 ? 1 : 0); }); }
      /* singed brows */
      const sg = B2 ? prog(lt, JAB + .05, .08) : 0;
      rigBrows.forEach(b => op(b, sg > .5 ? 0 : 1)); op(singe, sg); op(spikeTips, sg);
      singeSmoke.forEach((s, i) => { const k = ((at * .7 + i / 3) % 1); tf(s, -20 + i * 20, -340 - k * 30); op(s, sg * Math.sin(Math.PI * k) * .8); });
      /* spark */
      const bolt = B2 ? win(lt, JAB, JAB + .22, .02, .1) : 0;
      wr.setSpark(B2 ? (lt > JAB - .1 && lt < JAB + .6 ? 1 : .8) : tap ? .85 : .55);
      if (bolt > 0) { const d = boltD([836, 548], [758, 448], Math.floor(at * 30), 6, 34); bigBolt.setAttribute('d', d); bigBoltC.setAttribute('d', d); }
      op(bigBolt, bolt); op(bigBoltC, bolt);
      { const z = B2 && lt >= JAB ? prog(lt, JAB, .3) : 1; tf(zap, 840, 540, at * 90, .4 + z * 1.4); op(zap, z < 1 ? 1 - z : 0); }
      op(flashB, B2 ? win(lt, JAB, JAB + .06, .02, .14) * .75 : 1 - prog(lt, T_AB, .35));
      /* headphone crackle (B2: the steamer calling) */
      { const c = B2 ? win(lt, T_EB, JAB, .1, .2) : 0; if (c > 0) { const fr = Math.floor(at * 16); let d = '';
          [-1, 1].forEach(s => { const x0 = 760 + s * 52, y0 = 470; d += `M${x0},${y0} l${s * 14},${f2(-8 + hash(fr + s) * 6)} l${s * 6},12 l${s * 14},-14 l${s * 6},8 `; }); crackle.setAttribute('d', d); } op(crackle, c); }
      /* morse + smear */
      mDots.forEach((m, i) => { const k = (at * 1.4 + i / 9) % 1; tf(m, 850 + Math.sin(i * 2.1) * 20 + k * 70, 550 - k * 150); op(m, tap ? Math.sin(Math.PI * k) * .9 : 0); });
      op(smear, tap > .8 ? .5 + .5 * Math.sin(at * 30) : 0);
      /* cards */
      [cWT[0], cWT[1], cDog].forEach((c, i) => { const v = cardsOn[i]; op(c, v); if (v > 0) tf(c, cpos[0], cpos[1] + (1 - v) * 40, cpos[2] + (1 - v) * 20 + (i === 2 ? Math.sin(at * 2) * 2 : 0), (i === 2 ? .95 : .85) * (.6 + .4 * v)); });
      cDogHearts.forEach((h, i) => { const k = (at * .45 + i / 5) % 1; tf(h, 450 + i * 40 + Math.sin(at * 2 + i) * 10, 330 - k * 100, 0, .9 + k * .5); op(h, cardsOn[2] * Math.sin(Math.PI * k)); });
      tf(cDogWaft, 0, -Math.sin(at * 3) * 4);
      { const gb = L(3) + 1.2, v = cardsOn[3], hug = prog(lt, gb + .7, .4); op(cBday, v);
        if (v) tf(cBday, lerp(600, 760, hug), lerp(420, 555, hug), lerp(-6, 0, hug) + Math.sin(at * 3) * 2 * hug, lerp(.9, .62, hug));
        bdayHearts.forEach((h, i) => { const k = (at * .6 + i / 3) % 1; tf(h, 720 + i * 34, 420 - k * 90, 0, 1 + k * .5); op(h, B2 ? 0 : hug * Math.sin(Math.PI * k)); }); }
      heldIce.forEach((c, i) => { const g = i ? L(3) + .55 : L(3) - .15; const t = lt - g; op(c, 0);
        if (t > -.1 && t < 1.15) { let x, y, r;
          if (t < .45) { const h = keyed(t, [[-.1, [-100, -200]], [.2, [-110, -250]], [.45, [-20, -360]]]); x = 760 + h[0] - 10; y = 765 + h[1] - 22; r = -20 - Math.max(0, t) * 80; }
          else { const p = (t - .45) / .7, a = arcPos(p, [740, 395], [HX, HY - (8 + i) * 11.5 - 14], 170); x = a[0]; y = a[1]; r = -60 - p * 420; }
          tf(c, x, y, r, .8); op(c, 1); } });
      /* LATER heap */
      { const n = 8 + (lt > L(3) + .3 ? 1 : 0) + (lt > L(3) + 1.0 ? 1 : 0) + (B2 ? 10 : 0);
        heapSl.forEach((h, i) => op(h.g, i < n ? 1 : 0));
        const sw = swing(lt, L(3) + .3, 8, 6, 1.3) + swing(lt, L(3) + 1.0, 10, 6, 1.3) + Math.sin(at * 1.3) * 1.5;
        tf(heap, HX, HY, sw); }
      /* the desk queue */
      { const on = !B2 && lt > L(2) - .6 ? 1 : 0; op(laneG, on);
        if (on) {
          const t2 = L(2), shv = Math.sin(at * 46) * 1.6, S = .86;
          const base = [706, 608, 510, 418];
          const jumpP4 = prog(lt, t2 + 3.0, .5);
          const elb1 = win(lt, t2 + 2.15, t2 + 2.5, .12, .2), elb2 = win(lt, t2 + 2.9, t2 + 3.25, .12, .2);
          LP.forEach((p, i) => { let x = base[Math.min(i, 2)], y = 632, r = Math.sin(at * 1.4 + i) * 2, sq = 1 + Math.sin(at * 2.2 + i) * .02;
            if (i === 3) { const a = arcPos(jumpP4, [300, 610], [418, 632], 120); x = a[0]; y = a[1]; op(p.g, lt > t2 + 2.95 ? 1 : 0); r = (1 - jumpP4) * -30; }
            if (i === 1) { x -= elb1 * 20; r -= elb1 * 10; }
            if (i === 2) { x -= elb2 * 16; r -= elb2 * 12; }
            tf(p.g, x, y, r, S); tf(p.body, 0, 0, 0, 1 / sq, sq);
            const ea = i === 1 ? elb1 : i === 2 ? elb2 : 0;
            p.armL.setAttribute('d', `M-50,-34 q${f2(-14 - ea * 16)},${f2(4 - ea * 10)} ${f2(-18 - ea * 18)},${f2(14 - ea * 14)}`); p.armR.setAttribute('d', 'M50,-34 q14,4 18,14');
            if (i === 0 && lt > L(3) - .2) op(p.g, 1 - prog(lt, L(3) + 1.05, .1)); });
          LB.forEach((b, i) => {
            const land = t2 + .25 + i * .45;
            const back = [[440, 632], [418, 620], [398, 632]][i];
            let x = back[0], y = back[1], r = (i - 1) * 6;
            const arr = prog(lt, land - .55, .55, lin); if (arr < 1) { const a = arcPos(arr, [140, 330], back, 120); x = a[0]; y = a[1]; r = (1 - arr) * 300; }
            if (i === 0) { const sq = win(lt, t2 + 1.7, t2 + 2.25, .45, .1); x += sq * 100; y -= sq * 50; const kb = prog(lt, t2 + 2.25, .5); if (kb > 0 && kb < 1) { const a = arcPos(kb, [540, 582], [x, y], 70); x = a[0]; y = a[1]; r = -kb * 360; } }
            if (i === 1) { const sq = win(lt, t2 + 2.5, t2 + 3.0, .4, .1); x += sq * 130; y -= sq * 40; const kb = prog(lt, t2 + 3.0, .5); if (kb > 0 && kb < 1) { const a = arcPos(kb, [548, 580], [x, y], 80); x = a[0]; y = a[1]; r = kb * 360; } }
            const off = prog(lt, t2 + 3.1, .45); if (off > 0) { x = lerp(x, [372, 352, 334][i], off); y = lerp(y, [646, 660, 642][i], off); r = lerp(r, [-62, -78, -55][i], off); }
            const hopT = [L(3) - .55, L(3) + .15][i];
            if (i < 2) { const hp = prog(lt, hopT, .45); if (hp > 0) { const a = arcPos(hp, [x, y], [650, 560], 120); x = a[0]; y = a[1]; r = hp * 20; } op(b.g, lt < hopT + .45 ? 1 : 0); }
            tf(b.g, x + shv * (arr >= 1 ? 1 : 0), y, r, .95); op(b.shiv, arr >= 1 ? .5 + .5 * Math.sin(at * 20 + i) : 0); });
          const bd = prog(lt, L(3) + .6, .45);
          op(LBday.g, bd > 0 && lt < L(3) + 1.25 ? 1 : 0); { const a = arcPos(bd, [150, 340], [690, 560], 140); tf(LBday.g, a[0], a[1], (1 - bd) * 200, .9); }
        } }
      /* the tube spits telegrams */
      { const dt = B2 ? .2 : lt < L(2) ? .26 : .45, t0 = B2 ? T_EB : T_AB, i0 = Math.floor((lt - t0) / dt);
        fliers.forEach((f, s) => { const i = i0 - (((i0 - s) % FLN) + FLN) % FLN, age = lt - (t0 + i * dt), dur = .75;
          if (i < 0 || age < 0 || age > dur) { op(f.g, 0); return; }
          const blue = hash(i * 7.7 + 3) > .85 && !B2;
          const tx = B2 ? 540 + hash(i * 3.1) * 120 : 600 + hash(i * 3.1) * 380; const ty = driftTop(tx, K) - 10;
          const a = arcPos(age / dur, [124, 330], [tx, ty], 120 + hash(i) * 120);
          tf(f.g, a[0], a[1], age * (300 + hash(i * 2) * 400) * (hash(i * 4) > .5 ? 1 : -1), .95); op(f.g, 1); op(f.p, blue ? 0 : 1); op(f.b, blue ? 1 : 0); });
        const pa = ((lt - t0) % dt) / dt; tf(mouthPuff, 130, 350, 0, .5 + pa); op(mouthPuff, (1 - pa) * .9); }
      wr.setClock(B2 ? 10 : 7, B2 ? 55 + Math.floor((lt - T_EB) * 1.5) : 20 + Math.floor((lt - T_AB) * .8));
      wr.anim(at);
    }

    /* ================= C ================= */
    if (onC) {
      const tq = L(4), to = L(5);
      const cv = camVal(lt, [[T_BC, 800, 560, 1.25], [tq + .55, 820, 570, 1.3], [to + .15, 706, 640, 2.1], [to + .5, 700, 650, 2.55], [to + .8, 700, 652, 2.55], [to + 1.25, 790, 420, .97], [T_CD, 800, 415, 1.0]]);
      camSet(camC, cv);
      skyC.anim(at); seaC.anim(at);
      /* the slip's timeline: read → hand over → Owner looks → fold + tuck */
      const tGive = Le(4) - .2, tTake = tGive + .35, tTuck = to + .2, tIn = tTuck + .45;
      const give = prog(lt, tGive, .35), back = prog(lt, tTake + .2, .4);
      const cst = { at, x: 975, y: 862, s: 1, rim: .25, rimSide: -1, talk: cue.talk(lt, 'C'), look: [0, .6], face: 'focus', turn: -.2 };
      cst.hL = [lerp(-34, -126, give), lerp(-200, -214, give)]; cst.hR = [lerp(34, 58, give), lerp(-200, -128, give)];
      if (back > 0) { cst.hL = [lerp(-126, -30, back), lerp(-214, -132, back)]; cst.hR = [lerp(58, 30, back), lerp(-128, -132, back)]; cst.bendL = 30; cst.bendR = -30; }
      if (lt > tq - .05 && lt < Le(4) + .2) { cst.face = 'neutral'; cst.headTilt = Math.sin((lt - tq) * 9) * 5; cst.look = [-.2, .4]; }
      if (lt > Le(4) + .1) { cst.look = [-1, -.1]; cst.face = 'proud'; cst.turn = -.4; cst.headTilt = -3 * win(lt, Le(4) + .1, to + .6, .2, .3); }
      if (lt > to + 1.1) { cst.look = [-1, -1]; cst.face = 'think'; cst.headTilt = -4; }
      if (lt > to + 2.2) { cst.look = [-1, 0]; cst.face = 'proud'; cst.headTilt = Math.sin((lt - to - 2.2) * 8) * 3 * (1 - prog(lt, to + 2.8, .3)); }
      cst.bob = Math.sin(at * 1.4) * 1.2;
      captain.set(cst);
      const take = prog(lt, tTake - .15, .3), tuck = prog(lt, tTuck, .45), gest = win(lt, to + .95, to + 1.95, .35, .4), laugh = lt > to + 2.0 ? 1 : 0;
      const ost = { at, x: 660, y: 862, s: 1.02, talk: cue.talk(lt, 'O'), turn: .3, look: [1, .2], face: 'smug' };
      ost.hR = [lerp(58, 130, take), lerp(-128, -214, take)];
      if (tuck > 0) ost.hR = [lerp(130, 44, tuck), lerp(-214, -182, tuck)];
      if (lt > tIn) { const k = prog(lt, tIn + .25, .3), pat = lt < tIn + .3 ? Math.abs(Math.sin((lt - tIn) * 20)) * 10 : 0; ost.hR = [lerp(48, 40, k), lerp(-182, -150, k) - pat]; }
      if (lt < to) { ost.face = take > 0 ? 'surprise' : 'neutral'; ost.look = take > 0 ? [1, .6] : [1, .1]; }
      else if (lt < tIn) { ost.face = 'smug'; ost.look = [.6, .9]; }
      else if (lt < to + .95) { ost.face = 'surprise'; ost.look = [1, 0]; }
      else if (lt < to + 2.0) { ost.face = 'proud'; ost.look = [-1, -1]; ost.turn = -.3; }
      else { ost.face = 'joy'; ost.look = [1, 0]; }
      ost.hL = [lerp(-58, -170, gest), lerp(-128, -330, gest)]; ost.propRotL = gest * -20; ost.bendL = 10;
      ost.bob = Math.sin(at * 1.3) * 1.5 + laugh * Math.abs(Math.sin(at * 14)) * -3; ost.tilt = laugh * Math.sin(at * 7) * 2;
      owner.set(ost);
      { const capMid = [975, 862 - 200 - 4], meet = [(975 - 126 + 660 + 1.02 * 130) / 2, 862 - 216], ownH = [660 + 1.02 * 130, 862 - 1.02 * 214], pk = [660 + 1.02 * 50, 862 - 1.02 * 186];
        let x, y, r = 0, s = 1;
        if (give < 1) { x = lerp(capMid[0], meet[0], give); y = lerp(capMid[1], meet[1], give); r = -4 * give; }
        else if (take < 1) { x = lerp(meet[0], ownH[0], take); y = meet[1]; r = -4; }
        else { x = lerp(ownH[0], pk[0], tuck); y = lerp(ownH[1], pk[1], tuck) - 4; r = -4 - tuck * 70; s = lerp(1, .5, tuck); }
        tf(slipC, x, y, r + Math.sin(at * 2) * 1.5, .95 * (tuck > 0 ? lerp(1, .2, prog(tuck, 0, .4)) : 1)); op(slipC, tuck < .4 ? 1 : 0);
        tf(slipFold, x, y, r, s); op(slipFold, tuck >= .4 && tuck < 1 ? 1 : 0);
        tf(tab, 52, -178, 16, 1, Math.max(.05, prog(lt, tTuck + .4, .15))); op(tab, lt > tTuck + .4 ? 1 : 0);
        const gl = win(lt, tTuck + .45, tTuck + .8, .1, .2); tf(tabGlint, 62, -214, at * 120, .4 + gl); op(tabGlint, gl); }
      /* twinkling star on "clear weather" */
      { const tw = prog(lt, to + 1.2, .5, easeBack); tf(starC, 190, 150, at * 20, .5 + tw * .7); op(starC, .4 + .6 * tw); const ring = prog(lt, to + 1.25, .6); tf(cTwinkle, 190, 150, 0, .4 + ring * 1.6); op(cTwinkle, ring > 0 && ring < 1 ? 1 - ring : 0); }
      { const th = win(lt, to + 1.55, T_CD - .1, .35, .25); op(thought, th);
        if (th > 0) { tf(thought, 0, (1 - pop(lt, to + 1.55, .45)) * 30, 0, 1);
          liners.forEach((l, i) => { const k = lt - to - 1.55; tf(l.g, (i ? BX - 130 + k * 150 : BX - 30 + k * 110), l.y + Math.sin(at * 5 + i) * 2, Math.sin(at * 5 + i) * 1.5);
            l.puffs.forEach(q => { const k = (at * 2.2 + q.k * .5 + q.x * .01) % 1; q.c.setAttribute('cx', f2(q.x - k * 60)); q.c.setAttribute('cy', f2(-82 - k * 30)); q.c.setAttribute('r', f2(6 + k * 12)); op(q.c, (1 - k) * .9); }); });
          tf(speedL, -((lt * 300) % 80), 0); } }
      /* funnels: three puff harder, the dummy fourth puffs its cheeks */
      { const hard = prog(lt, to + .9, .5);
        funPuffs.forEach((f, i) => { const dummy = i === 3;
          f.pp.forEach((c, k) => { if (dummy) { op(c, 0); return; } const rate = .6 + hard * .8, ph = (at * rate + k / 6 + i * .17) % 1;
            const r = (16 + ph * 46) * (1 + hard * .45), x = f.x + ph * 170 + Math.sin(at + k) * 8, y = f.y - ph * 150;
            c.setAttribute('cx', f2(x)); c.setAttribute('cy', f2(y)); c.setAttribute('r', f2(r)); op(c, (1 - ph) * .8); }); });
        const ch = win(lt, to + 1.1, to + 2.75, .3, .3), blow = (.5 + .5 * Math.abs(Math.sin(at * 4))) * ch;
        f4cheeks.forEach((c, i) => { c.setAttribute('rx', f2(12 + blow * 14)); c.setAttribute('ry', f2(10 + blow * 12)); op(c, .3 + .7 * ch); });
        f4eyes.setAttribute('d', ch > .3 ? `M-30,${FT + 96} l14,5 M30,${FT + 96} l-14,5` : `M-22,${FT + 92} v8 M22,${FT + 92} v8`); f4mouth.setAttribute('rx', f2(7 - 4 * ch)); f4mouth.setAttribute('ry', f2(6 - 3 * ch));
        const ring = ((lt - to - 1.1) % .9 + .9) % .9 / .9; tf(f4ring, 0, -ring * 50, 0, .6 + ring); op(f4ring, ch > .2 ? (1 - ring) * .85 : 0); }
      op(cDoorFlash, hash(Math.floor(at * 14)) > .7 ? .7 : 0);
    }

    /* ================= D ================= */
    if (onD) {
      const cv = camVal(lt, [[T_CD, 640, 470, 1.3], [L(6) + 1.6, 700, 470, 1.08], [L(6) + 2.3, 740, 460, 1.0], [T_DE, SFX + 6, 500, 2.7]]);
      camSet(camD, cv);
      const night = prog(lt, L(6) - .2, 3.6, lin);
      skyD2.fade(night); op(seaDark, night * .85); if (night < .98) skyD1.anim(at); op(skyD1, night < .99 ? 1 : 0); seaD.anim(at);
      tit.set({ x: 560, y: 650, s: .6, wake: 1, lights: 1, smoke: 0 }); tit.anim(at);
      { const FT = [0, 1, 2, 3].map(i => tit.funnelTop(i));
        SMK.forEach(q => { const u = at * .6 + q.k / 10 + q.f * .13, ph = u % 1, h = hash(q.k * 3.1 + q.f * 7.7 + Math.floor(u));
          const x = FT[q.f][0] - Math.pow(ph, 1.2) * 260 * (.85 + .3 * h) + Math.sin(at * 1.3 + q.k) * 4 * ph, y = FT[q.f][1] - 4 - 110 * (1 - Math.exp(-2.4 * ph)) * (.8 + .4 * h), r = 9 + ph * 36 * (.8 + .4 * h), a = Math.min(1, ph / .05) * Math.pow(1 - ph, 1.4);
          q.c.setAttribute('cx', f2(x)); q.c.setAttribute('cy', f2(y)); q.c.setAttribute('r', f2(r)); q.c.setAttribute('fill-opacity', f2(a * .62));
          q.hl.setAttribute('cx', f2(x - r * .3)); q.hl.setAttribute('cy', f2(y - r * .35)); q.hl.setAttribute('r', f2(r * .45)); q.hl.setAttribute('fill-opacity', f2(a * .22 * (1 - night * .7))); }); }
      spr.forEach((p, i) => { const k = (at * 1.6 + i / 9) % 1, y = 700 + hash(i * 3.3) * 200, x = 1700 - k * 2200; p.setAttribute('d', `M${f2(x)},${f2(y)} h${f2(60 + hash(i) * 90)}`); op(p, Math.sin(Math.PI * k) * .7 * (1 - night * .6)); });
      op(farGlow, .4 + .2 * Math.sin(at * 3)); if (night > .02) skyD2.anim(at, night);
      fw.forEach((p, i) => { const k = (at * .9 + i / 3) % 1, r = 6 + k * 46; p.setAttribute('d', `M${f2(SFX - 1 - r * .3)},${f2(SFY - 112 - r * .8)} A${f2(r)},${f2(r)} 0 0,0 ${f2(SFX - 1 - r * .3)},${f2(SFY - 112 + r * .8)}`); op(p, (1 - k) * prog(lt, L(6) + 2.2, .5)); });
    }

    /* ================= E ================= */
    if (onE) {
      const E2 = lt >= T_BE, t8 = L(8);
      const cv = E2 ? camVal(lt, [[T_BE, 805, 455, 2.05], [t8 + 5.3, 830, 460, 2.15], [t8 + 6.1, 800, 440, 1.25], [DUR, 800, 420, .92]])
        : camVal(lt, [[T_DE, 800, 430, .95], [T_DE + .9, 770, 410, 1.22], [T_EB, 745, 405, 1.36]]);
      camSet(camE, cv);
      skyE.anim(at); seaE.anim(at);
      FL.forEach((f, i) => { if (i % 2 === (Math.floor(at * 15) % 2)) tf(f.g, f.x + Math.sin(at * .3 + f.ph) * 3, f.y + Math.sin(at * .9 + f.ph) * 1.4); });
      /* line 8 phases */
      const tHead = t8 + 1.3, tUp = t8 + 1.75, tSw = t8 + 2.3, capT = t8 + 2.65, bedT = t8 + 3.0, blowT = t8 + 4.95;
      const sw = prog(lt, tSw, .18), bed = prog(lt, bedT, .55), out = prog(lt, blowT + .1, .15);
      const st = { at, s: .5, rim: .35, rimSide: 1, face: 'happy', look: [.6, .4], turn: .3, x: 702, y: 556, sit: true };
      if (!E2) { const v = Math.abs(Math.sin(at * 18)); st.tilt = 8; st.hR = [100, -146 + v * 8]; st.hL = [-58, -150]; st.face = 'happy'; st.headTilt = 6; keyArm.setAttribute('transform', `rotate(${f2(v * 6)} -18 -10)`); op(keySpk, v > .7 ? 1 : 0); }
      else {
        keyArm.setAttribute('transform', ''); op(keySpk, 0);
        st.hR = [96, -148]; st.hL = [-58, -150];
        if (lt < t8 + .6) { st.face = 'surprise'; st.tilt = -6; st.look = [0, -.3]; st.hR = [70, -200]; }
        else if (lt < tHead) { st.face = 'sad'; st.look = [.6, -1]; st.hL = [-140, -330]; st.hR = [140, -330]; st.headTilt = 6; st.tilt = Math.sin((lt - t8) * 3) * 3; }
        if (lt >= tHead - .1 && lt < tUp) { st.hL = keyed(lt, [[tHead - .1, [-80, -280]], [tHead + .15, [-60, -330]], [tUp, [-120, -320]]]); st.face = 'neutral'; st.look = [-.6, -.3]; }
        if (lt >= tUp) { const w = prog(lt, tUp, .45); st.sit = w < .3; st.x = lerp(702, 792, w); st.y = 556; Object.assign(st, w > 0 && w < 1 ? walkFeet(w * 9, .7) : {}); st.hL = [-58, -128]; st.hR = [58, -128]; st.face = 'neutral'; st.look = [1, 0]; st.turn = .4; }
        if (lt >= tSw - .25 && lt < capT) { st.hR = keyed(lt, [[tSw - .25, [58, -128]], [tSw, [116, -300]], [tSw + .15, [116, -246]], [capT, [70, -200]]]); st.bendR = -30; st.face = lt > tSw ? 'smug' : 'focus'; }
        if (lt >= capT && bed <= 0) { st.face = 'happy'; st.hR = [60, -140]; st.look = [0, 0]; st.turn = 0; st.headTilt = Math.sin((lt - capT) * 6) * 4; }
        if (bed > 0) { const a = arcPos(bed, [792, 556], [842, 496], 80); st.x = a[0]; st.y = a[1]; st.rot = 88 * bed; st.sit = false; st.noLegs = bed > .85; st.hL = [-58, -128]; st.hR = [58, -128]; st.face = bed < 1 ? 'surprise' : 'neutral'; st.look = [0, -.6]; st.turn = 0; }
        if (bed >= 1) { st.face = lt < blowT - .3 ? 'neutral' : 'surprise'; st.look = lt < t8 + 3.9 ? [0, 0] : [1, -1]; st.lid = lt > t8 + 3.9 && lt < blowT - .3 ? .35 : 0; st.hL = [-50, -150]; st.hR = [50, -150]; }
        if (out > 0) { st.face = 'happy'; st.lid = .95; }
      }
      op2.set(st);
      op(ph2, E2 && lt > tHead + .2 ? 0 : 1);
      { const hpOn = E2 && lt > tHead + .2 && lt < tUp; op(handPh, hpOn ? 1 : 0); if (hpOn) { const p = prog(lt, tHead + .2, .3); tf(handPh, lerp(674, 642, p), lerp(392, 400, p), 0, .9); } op(hookPh, E2 && lt > tUp - .05 ? 1 : 0); }
      op(nightcap, E2 && lt > capT ? 1 : 0); tf(nightcap, 0, 0, 0, 1, E2 ? Math.max(.05, Math.min(1, pop(lt, capT, .4))) : 1);
      switchArm.setAttribute('transform', `translate(852,425) rotate(${f2(180 * sw)})`);
      const valveOn = E2 ? 1 - prog(lt, tSw + .1, .6) : 1;
      op(valveGlow, valveOn * (.8 + .2 * Math.sin(at * 7))); valve.setAttribute('fill', mix('#5A4A40', '#FFC870', valveOn));
      op(blanket, bed > .7 ? 1 : 0);
      flame.setAttribute('transform', `translate(1019,414) scale(${f2(Math.max(.01, (1 - out) * (1 + Math.sin(at * 13) * .08 - win(lt, blowT - .15, blowT + .1, .1, .05) * .3)))},${f2(Math.max(.01, 1 - out))}) rotate(${f2(win(lt, blowT - .2, blowT + .1, .1, .05) * 30)}) translate(-1019,-414)`);
      op(flame, 1 - out);
      op(breath, E2 ? win(lt, blowT - .25, blowT + .2, .1, .15) : 0); tf(breath, 1000, 470, -45);
      op(candleGlow, (1 - out) * (.8 + .2 * wob(at * 3, 2))); op(candleSmoke, E2 ? win(lt, blowT + .2, blowT + 1.8, .2, .6) * .8 : 0);
      op(cabDark, E2 ? out * .86 : 0); op(shipLamp, E2 ? (1 - out) : 1);
      zz.forEach((z, i) => { const k = ((at * .45 + i / 3) % 1); tf(z, 990 + i * 16 + k * 34, 470 - k * 130 - i * 8); op(z, E2 ? prog(lt, blowT + .7, .5) * Math.sin(Math.PI * k) : 0); });
      /* radio arcs + message (line 6) */
      const send = !E2 ? 1 : 1 - prog(lt, tSw, .3);
      arcE.forEach((a, i) => { const k = (at * .8 + i / 4) % 1, r = 30 + k * 440; a.setAttribute('d', `M${f2(800 - r * .2)},${f2(96 - r * .9)} A${f2(r)},${f2(r)} 0 0,0 ${f2(800 - r * .2)},${f2(96 + r * .9)}`); op(a, send * (1 - k) * .8); });
      op(msgE, !E2 ? prog(lt, T_DE + .4, .4) : 0);
      { const sh = E2 ? win(lt, T_BE + .05, t8 + 1.1, .2, .3) : 0; op(shutE, sh); tf(shutE, 690 + Math.sin(at * 50) * 2 * sh, 300, 0, .5 + .5 * pop(lt, T_BE + .05, .4)); }
      /* the Titanic's lights racing along the horizon */
      { const k = clamp((lt - (t8 + 4.5)) / (DUR - t8 - 4.5)); tf(farTit, lerp(-460, 190, k), 563, 0, 1.25); op(farTit, E2 && k > 0 ? 1 : 0); }
    }
  };
}});
