"use strict";
/* SCENE 1 — "Life on board": the layer-cake cutaway (shipCutaway, day) + stokehold (bgBoiler) + bridge (bgBridge, daylit).
   Beat sheet (lt; every beat is anchored to cue(j)/cue.e(j); values shown for the current timing):
   0.0–1.6   lead-in   iris opens on the liner at sea (a painted hull skin hides the cutaway); gulls, smoke, chapter sign
   1.6–5.5   L0        "After stops in France and Ireland": CHERBOURG, FRANCE and QUEENSTOWN, IRELAND postcards flutter past the hull
   3.9–6.2   L0        "life aboard was a layer cake": a giant cake knife stabs in and saws along the hull; skin + sea fall away, crumbs fly
   6.3–8.5   L0        "The higher you lived, the more icing": icing pours, thick gold on first class, thin cream on second, a trace on third;
                       cream dollop + glacé cherry plops onto the gold-iced dome (7.9)
   8.4–9.1   lift      the camera drops like a lift into the first-class lounge
   9.1–13.0  L1        the Owner's advent calendar, one door per word: 1 pool splash (9.3), 2 Turkish-bath steam (9.9),
                       3 gent on the mechanical camel (10.5), 4 squash ball ricochets off his top hat (11.1),
                       5 cupboard of lifeboats stacked like teacups (11.7), he pats them (12.4) and shuts it (12.9)
   13.0–16.0 L2        pan to the Lady: she sinks onto a velvet chaise (14.5); steward A fans her (14.6), steward B fans Mitzi (15.0)
   15.9–17.4 L2→L3     Mitzi hops onto the banister and slides down two decks; the camera rides down with her
   17.4–20.9 L3        third-class party: fiddle, accordion, jig, hopping soup bowls, confetti, one swinging bare bulb ("fewer chandeliers");
                       push-in as a man hands Mitzi her tiny flat cap (17.9–18.5) — she wears it from then on
   20.9–21.6 L3→L4     music notes float up through second class (the reader looks up); the lift rises back to first class
   21.5–24.1 L4        Owner cocks an ear, hooks up the carpet corner with his cane (22.0–22.3): faceful of confetti and music (22.5),
                       slams it (22.9), appalled, confetti stuck to his hat
   24.2–25.3 L4→L5     the lift plunges to the boiler rooms and pushes through into the stokehold
   25.3–29.9 L5        four stokers shovel in perfect rhythm (furnace doors swing on the beat); petrol-pump meter rolls up to
                       600 TONS OF COAL (25.5–27.1), "A DAY" (28.0); fierce heat: thermometer shoots up, sweat, heat shimmer (28.7)
   30.0–30.7 L5→L6     split screen drops in: Turkish bath above, stokehold below
   30.8–35.1 L6        STOKEHOLD / NO CHARGE and TURKISH BATH / EXTRA CHARGE signs; the bath gent and a stoker mop their brows
                       in perfect sync (31.6–32.8, 33.5–34.5); the gent sighs blissfully
   35.1–35.5 L6→L7     whoosh up to the bridge
   35.6–39.3 L7        Captain leans by the binnacle, arms folded, smug; the wheel turns by itself: "She practically drives herself."
                       a floor hatch creaks open (36.3), a soot-black hand raises a shovel (36.6), lowers it (37.3),
                       the hatch clangs shut (37.6, CLANG! + soot puff); he glances over, startled, then smug again */
SCENE(1, { build(world, cue) {
  const C = cue, Ce = cue.e;
  const fr = (j, f) => C(j) + (Ce(j) - C(j)) * f;
  const sa = (n, k, v) => { if (n['_' + k] !== v) { n['_' + k] = v; n.setAttribute(k, v); } };
  const lin = t => t;
  const cam = (g, cx, cy, z) => sa(g, 'transform', 'translate(800,450) scale(' + f2(z * 1000) / 1000 + ') translate(' + f2(-cx) + ',' + f2(-cy) + ')');
  /* camera track [t, cx, cy, zoom, ease?]; zoom interpolates geometrically */
  const track = (t, K) => {
    if (t <= K[0][0]) return [K[0][1], K[0][2], K[0][3]];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
      const a = K[i - 1], b = K[i], p = (b[4] || ease)(clamp((t - a[0]) / Math.max(.001, b[0] - a[0])));
      return [lerp(a[1], b[1], p), lerp(a[2], b[2], p), a[3] * Math.pow(b[3] / a[3], p)];
    }
    const k = K[K.length - 1]; return [k[1], k[2], k[3]];
  };
  const clipR = (x, y, w, h) => { const id = uid('s1c'); const cp = E('clipPath', { id }, DEFS); const r = E('rect', { x, y, width: w, height: h }, cp); return { url: 'url(#' + id + ')', r }; };
  const clipP = d => { const id = uid('s1p'); const cp = E('clipPath', { id }, DEFS); E('path', { d }, cp); return 'url(#' + id + ')'; };
  const before = (n, ref) => { ref.parentNode.insertBefore(n, ref); return n; };
  const env = (t, a, b, fi = .25, fo = .25) => prog(t, a, fi) * (1 - prog(t, b, fo));
  /* torso-frame point for a local target, given the body tilt/bob (inverse of the rig's up-transform) */
  const torsoPt = (lx, ly, tilt = 0, bob = 0) => { const r = -tilt * Math.PI / 180, x = lx, y = ly - bob + 112; return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r) - 112]; };
  const mixP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const note = (p, col) => { const g = G(p); E('path', { d: 'M-5,0 a5,3.6 0 1 0 10,0 a5,3.6 0 1 0 -10,0 Z', fill: col, transform: 'rotate(-20)' }, g); E('path', { d: 'M4.4,-1 V-18 Q10,-15 11,-8', stroke: col, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, g); return g; };
  const CONF = ['#E84855', '#F7C948', '#2F6FD6', '#3BB273', '#FF7AA2', '#FFFFFF', '#9B5DE5'];

  /* ---------------- story times (all from cues) ---------------- */
  const T = {
    pc1: C(0) - .45, pc2: fr(0, .095),
    kIn: fr(0, .29), kCut0: fr(0, .33), kCut1: fr(0, .555), kOut: fr(0, .64),
    ice1: fr(0, .655), ice2: fr(0, .715), ice3: fr(0, .77), cream: fr(0, .82), cherry: fr(0, .9),
    lift0: Ce(0) - .12, lift1: C(1) - .02,
    d1: fr(1, .04), d2: fr(1, .2), d3: fr(1, .355), d4: fr(1, .5), d5: fr(1, .67), pat: fr(1, .84), shut: fr(1, .965),
    pan0: Ce(1) + .02, pan1: C(2) + .34,
    sink: fr(2, .44), fanA: fr(2, .48), fanB: fr(2, .6),
    hop: Ce(2) - .14, rail0: Ce(2) + .2, rail1: C(3) + .52, land: C(3) + .82,
    capOut: fr(3, .3), cap: fr(3, .45), party: fr(3, .57),
    rise0: Ce(3) + .02, rise1: C(4) + .14,
    hook: fr(4, .22), lift: fr(4, .32), burst: fr(4, .4), slam: fr(4, .55),
    dive0: Ce(4) + .04, dive1: C(5) + .32, xf0: C(5) + .18, xf1: C(5) + .62,
    cnt0: fr(5, .15), cnt1: fr(5, .47), day: fr(5, .64), heat: fr(5, .76),
    sp0: Ce(5) + .08, sp1: C(6) - .06,
    sign1: fr(6, .02), tagX: fr(6, .22), tagN: fr(6, .38), m1a: fr(6, .2), m1b: fr(6, .46), m2a: fr(6, .62), m2b: fr(6, .86), bath: fr(6, .74), sigh: fr(6, .8),
    wh0: Ce(6) + .02, wh1: C(7) - .1,
    hOpen: fr(7, .3), hRise: fr(7, .45), hDown: fr(7, .82), clang: fr(7, .97)
  };

  /* ---------------- view stack ---------------- */
  const SPLIT = G(world), VA = G(SPLIT), camA = G(VA), VB = G(SPLIT), camB = G(VB), DIV = G(SPLIT);
  const VC = G(world), camC = G(VC);
  const HUD = G(world);
  const cpA = clipR(0, 0, 1600, 900), cpB = clipR(0, 452, 1600, 448), cpC = clipR(0, 0, 1600, 900);

  /* =====================================================================
     A) THE CUTAWAY
     ===================================================================== */
  const cut = shipCutaway(camA, { sky: 'day', vignette: false });
  const RM = cut.rooms, RG = RM.boat.parentNode, HL = RG.nextElementSibling, SG = cut.signs.first.parentNode;
  const HULL = 'M36,215 L1574,215 L1559,650 Q1552,846 1452,872 L272,872 Q192,872 164,836 L142,692 Q74,690 52,612 Q33,470 36,215 Z';
  const hullClip = clipP(HULL);

  /* the sea in front of the hull (exterior shot only; it drains away as the cake is cut) */
  const seaF = G(camA);
  E('rect', { x: -1400, y: 648, width: 4400, height: 1400, fill: lgrad([[0, '#2D7AAE', .86], [.25, '#1E5F8E', .94], [1, '#0F3858', 1]]) }, seaF);
  const seaCrest = E('path', { fill: 'none', stroke: '#E6F4FA', 'stroke-width': 3.5, 'stroke-opacity': .85, 'stroke-linecap': 'round' }, seaF);
  const seaDash = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-opacity': .35, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, seaF);
  const bowFoam = G(seaF); E('path', { d: 'M1540,650 Q1580,610 1612,636 Q1640,622 1660,648 Q1600,664 1540,650 Z', fill: '#FFFFFF', 'fill-opacity': .9 }, bowFoam);
  E('path', { d: 'M1500,664 Q1560,676 1640,664 M1420,676 Q1500,690 1600,680', stroke: '#FFFFFF', 'stroke-opacity': .6, 'stroke-width': 3, fill: 'none' }, bowFoam);
  /* gulls over the sea (opening wide shot) */
  const gulls = [0, 1, 2, 3].map(i => { const g = G(camA); E('path', { d: 'M-14,0 Q-7,-8 0,0 Q7,-8 14,0', stroke: '#F4F1EA', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g); return g; });

  /* ---------- second class: a couple of prim passengers ---------- */
  const reader = castPassenger(RM.second, 0, { lite: true });
  const dowager = castPassenger(RM.second, 2, { lite: true });
  const paper2 = G(reader.propR); E('rect', { x: -26, y: -40, width: 52, height: 40, rx: 2, fill: '#F2ECDD', stroke: '#BDB29A', 'stroke-width': 2 }, paper2);
  E('path', { d: 'M-20,-32 h40 M-20,-24 h40 M-20,-16 h28 M-20,-8 h36', stroke: '#8A8274', 'stroke-width': 2 }, paper2);

  /* ---------- FIRST CLASS ---------- */
  /* Turkish bath: marble bench + gentleman in a towel (used in the split screen) */
  const bathBack = G(RM.first);
  const steamB = [0, 1, 2, 3, 4].map(i => { const g = G(bathBack); E('ellipse', { rx: 18, ry: 12, fill: '#FFFFFF' }, g); E('ellipse', { cx: 12, cy: -6, rx: 12, ry: 9, fill: '#FFFFFF' }, g); return g; });
  E('rect', { x: 214, y: 340, width: 76, height: 30, rx: 3, fill: '#E3DED3' }, RM.first);
  E('path', { d: 'M224,348 q12,6 20,-2 M256,352 q10,8 24,2', stroke: '#C9C2B4', 'stroke-width': 1.4, fill: 'none' }, RM.first);
  E('rect', { x: 210, y: 334, width: 84, height: 7, rx: 3, fill: '#F4F0E8' }, RM.first);
  const gent = Person(RM.first, { coat: 'stoker', jacket: '#F0C4A2', skin: '#F0C4A2', hairStyle: 'bald', hair: '#6A4A30', mustache: 'handlebar', mustacheColor: '#5A3A22', rosy: true, belly: .7, pants: '#F7F4EE', shoes: '#E9E2D2', seed: 33 });
  { const tw = G(gent.torso); E('path', { d: 'M-62,-150 Q0,-140 62,-150 L66,-96 Q0,-84 -66,-96 Z', fill: '#FFFFFF' }, tw); E('path', { d: 'M-60,-134 Q0,-124 60,-134 M-62,-116 Q0,-106 62,-116', stroke: '#DCD8CE', 'stroke-width': 3, fill: 'none' }, tw);
    E('path', { d: 'M-40,-250 Q-58,-200 -46,-160 L-30,-160 Q-40,-205 -22,-248 Z', fill: '#FFFFFF' }, tw);
  }
  const gentCloth = G(gent.propL); E('path', { d: 'M-14,-10 Q0,-18 14,-8 L12,12 Q0,6 -12,14 Z', fill: '#FFFFFF', stroke: '#D8D2C6', 'stroke-width': 1.5 }, gentCloth);
  const steamF = [0, 1, 2].map(i => { const g = G(RM.first); E('ellipse', { rx: 20, ry: 13, fill: '#FFFFFF' }, g); return g; });
  const sigh = G(RM.first); E('ellipse', { rx: 6, ry: 4, fill: '#FFFFFF' }, sigh); E('ellipse', { cx: 9, cy: -4, rx: 4, ry: 3, fill: '#FFFFFF' }, sigh);

  /* advent-calendar wall over the lounge */
  const adv = G(RM.first);
  E('rect', { x: 734, y: 225, width: 406, height: 138, fill: '#F3E2BD' }, adv);
  E('rect', { x: 734, y: 225, width: 406, height: 11, fill: '#FFF4DA' }, adv);
  E('rect', { x: 734, y: 235, width: 406, height: 3, fill: '#C9A045' }, adv);
  { let d = ''; for (let x = 744; x < 1130; x += 66) d += `M${x},248 h56 v100 h-56 Z `; E('path', { d, fill: 'none', stroke: '#E2CB96', 'stroke-width': 1.6 }, adv); }
  E('rect', { x: 734, y: 355, width: 406, height: 7, fill: '#C9A045' }, adv);
  { let sw = '', be = '', stars = ''; for (let x = 738; x < 1136; x += 44) { sw += `M${x},240 Q${x + 22},256 ${x + 44},240 `; be += `M${x + 22},249 m-2.2,0 a2.2,2.2 0 1 0 4.4,0 a2.2,2.2 0 1 0 -4.4,0 M${x + 18},247 m-1.8,0 a1.8,1.8 0 1 0 3.6,0 a1.8,1.8 0 1 0 -3.6,0 `;
      stars += `M${x},234 l1.8,4 4.2,.4 -3.2,2.8 1,4.2 -3.8,-2.2 -3.8,2.2 1,-4.2 -3.2,-2.8 4.2,-.4 Z `; }
    E('path', { d: sw, stroke: '#2F6B3A', 'stroke-width': 5.5, fill: 'none', 'stroke-linecap': 'round' }, adv);
    E('path', { d: sw, stroke: '#7FB069', 'stroke-width': 1.6, fill: 'none', 'stroke-dasharray': '2 5' }, adv);
    E('path', { d: be, fill: '#D62F2F' }, adv); E('path', { d: stars, fill: '#F2C14E' }, adv); }
  const mkDoor = (x0, y0, w, h, num, col, right) => {
    const g = G(adv), hx = right ? x0 + w : x0;
    E('rect', { x: x0 - 4, y: y0 - 4, width: w + 8, height: h + 8, rx: 4, fill: '#A87C2E' }, g);
    E('rect', { x: x0 - 2, y: y0 - 2, width: w + 4, height: h + 4, rx: 3, fill: '#E8C76A' }, g);
    const inn = G(g, { 'clip-path': clipR(x0, y0, w, h).url });
    E('rect', { x: x0, y: y0, width: w, height: h, fill: '#2A2024' }, inn);
    const leaf = G(g), front = G(leaf), back = G(leaf);
    E('rect', { x: x0, y: y0, width: w, height: h, rx: 2, fill: col }, front);
    E('rect', { x: x0 + 4, y: y0 + 4, width: w - 8, height: h - 8, rx: 2, fill: 'none', stroke: shade(col, .3), 'stroke-width': 1.4 }, front);
    const r = Math.min(w, h) * .27, cx = x0 + w / 2, cy = y0 + h / 2;
    E('circle', { cx, cy, r, fill: '#FBF3DE', stroke: '#E8C76A', 'stroke-width': 2 }, front);
    TX(front, cx, cy + r * .45, String(num), r * 1.3, col, { a: 'middle', w: 800 });
    E('path', { d: `M${x0 + 7},${y0 + 9} q5,-6 10,0 q-5,3 -10,0 M${x0 + 9},${y0 + 13} q6,-2 9,4`, fill: '#2F6B3A' }, front);
    E('circle', { cx: x0 + 12, cy: y0 + 10, r: 1.8, fill: '#D62F2F' }, front);
    E('circle', { cx: right ? x0 + 5 : x0 + w - 5, cy, r: 2.2, fill: '#F2C14E' }, front);
    E('rect', { x: x0, y: y0, width: w, height: h, rx: 2, fill: shade(col, -.35) }, back);
    E('rect', { x: x0 + 3, y: y0 + 3, width: w - 6, height: h - 6, rx: 2, fill: '#F1E6CC', 'fill-opacity': .25 }, back);
    op(back, 0);
    const D = { g, inn, x0, y0, w, h, cx, cy };
    D.set = k => { const c = Math.cos(clamp(k, 0, 1.15) * 1.93); sa(leaf, 'transform', `translate(${hx},0) scale(${f2(Math.abs(c) < .02 ? .02 : c)},1) translate(${-hx},0)`); op(front, c > 0 ? 1 : 0); op(back, c > 0 ? 0 : 1); };
    D.set(0);
    return D;
  };
  /* door 1: the pool */
  const dPool = mkDoor(1030, 258, 92, 96, 1, '#A8322D', true);
  { const p = dPool.inn; E('rect', { x: 1030, y: 258, width: 92, height: 96, fill: '#D5ECEE' }, p);
    let d = ''; for (let x = 1036; x < 1122; x += 10) d += `M${x},258 V320 `; for (let y = 264; y < 320; y += 10) d += `M1030,${y} H1122 `; E('path', { d, stroke: '#BFDDE2', 'stroke-width': 1 }, p);
    E('rect', { x: 1094, y: 300, width: 30, height: 5, rx: 2, fill: '#B88E3A' }, p); E('rect', { x: 1114, y: 304, width: 5, height: 50, fill: '#9A7430' }, p);
    E('path', { d: 'M1040,272 h16 v4 h-16 Z M1042,276 v8 M1054,276 v8', stroke: '#E86A5A', 'stroke-width': 1.5, fill: '#E86A5A' }, p); }
  const poolW = E('path', { fill: lgrad([[0, '#5FC6DD'], [1, '#1E78A6']]) }, dPool.inn);
  const swimmer = G(dPool.inn); E('path', { d: 'M-16,2 Q-10,-14 0,-6', stroke: '#F2C6A0', 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }, swimmer);
  E('circle', { cx: 4, cy: -2, r: 7, fill: '#F2C6A0' }, swimmer); E('path', { d: 'M-3,-4 Q4,-13 11,-4 Z', fill: '#D9443F' }, swimmer); E('path', { d: 'M3,3 q3,2 6,0', stroke: '#5A3A22', 'stroke-width': 1.6, fill: 'none' }, swimmer);
  /* door 2: Turkish bath */
  const dBath = mkDoor(936, 256, 52, 46, 2, '#2F6B4A');
  { const p = dBath.inn; E('rect', { x: 936, y: 256, width: 52, height: 46, fill: '#2F7D77' }, p);
    let d = ''; for (let x = 940; x < 988; x += 8) d += `M${x},256 V302 `; for (let y = 260; y < 302; y += 8) d += `M936,${y} H988 `; E('path', { d, stroke: '#28706A', 'stroke-width': 1 }, p);
    E('path', { d: 'M950,302 V278 Q950,268 962,262 Q974,268 974,278 V302 Z', fill: lgrad([[0, '#FFD08A'], [1, '#C8662A']]) }, p); itrGlow(p, 962, 284, 40, 30, '#FFB65C', .5); }
  /* door 3: the gym, with the mechanical camel */
  const dGym = mkDoor(930, 306, 82, 52, 3, '#1D2B53');
  { const p = dGym.inn; E('rect', { x: 930, y: 306, width: 82, height: 52, fill: '#EAD3A6' }, p);
    let d = ''; for (let x = 934; x < 950; x += 5) d += `M${x},308 V352 `; for (let y = 312; y < 352; y += 7) d += `M932,${y} H950 `; E('path', { d, stroke: '#A8743F', 'stroke-width': 1.5 }, p);
    E('rect', { x: 930, y: 351, width: 82, height: 7, fill: '#B07A42' }, p);
    E('rect', { x: 952, y: 348, width: 34, height: 5, rx: 2, fill: '#5A5F66' }, p); E('rect', { x: 966, y: 340, width: 6, height: 10, fill: '#7A8088' }, p);
    E('rect', { x: 998, y: 322, width: 4, height: 30, fill: '#7A8088' }, p); E('circle', { cx: 1000, cy: 322, r: 4, fill: '#D9443F' }, p); }
  const camel = G(dGym.inn), rider = G(dGym.inn);
  { const c = camel; E('path', { d: 'M-12,8 V20 M-6,8 V20 M6,8 V20 M12,8 V20', stroke: '#9A6A3A', 'stroke-width': 3, 'stroke-linecap': 'round' }, c);
    E('ellipse', { cx: 0, cy: 2, rx: 17, ry: 8, fill: '#C9904E' }, c); E('ellipse', { cx: -2, cy: -6, rx: 8, ry: 7, fill: '#C9904E' }, c);
    E('path', { d: 'M13,0 Q22,-4 20,-16', stroke: '#C9904E', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, c);
    E('ellipse', { cx: 24, cy: -17, rx: 6, ry: 3.6, fill: '#C9904E' }, c); E('circle', { cx: 25, cy: -18, r: 1, fill: '#2B1B16' }, c);
    E('path', { d: 'M-10,-4 h12 v4 h-12 Z', fill: '#B5302A' }, c); E('path', { d: 'M-2,-14 L24,-16', stroke: '#5A3A22', 'stroke-width': 1, fill: 'none' }, c); }
  const camelRider = castPassenger(rider, 0, { lite: true });
  /* door 4: squash court */
  const dSq = mkDoor(870, 258, 50, 60, 4, '#7A2E5A');
  { const p = dSq.inn; E('rect', { x: 870, y: 258, width: 50, height: 60, fill: '#F2EFE8' }, p); E('path', { d: 'M870,276 H920 M870,308 H920 M895,308 V318', stroke: '#C8343F', 'stroke-width': 2 }, p);
    E('path', { d: 'M910,316 L916,292', stroke: '#8A5A33', 'stroke-width': 2.4 }, p); E('ellipse', { cx: 917, cy: 286, rx: 4.5, ry: 7, fill: 'none', stroke: '#8A5A33', 'stroke-width': 2 }, p); }
  /* door 5: the lifeboat cupboard (hinged on its right) */
  const dBoat = mkDoor(798, 312, 50, 44, 5, '#A8322D', true);
  const boatStack = G(null);
  { const p = dBoat.inn; E('rect', { x: 798, y: 312, width: 50, height: 44, fill: '#4A2E22' }, p); E('rect', { x: 798, y: 349, width: 50, height: 7, fill: '#6E4426' }, p); p.appendChild(boatStack);
    for (let i = 0; i < 4; i++) { const y = 349 - i * 7.5, w = 40 - i * .6; const b = G(boatStack); tf(b, 823, y);
      E('path', { d: `M${-w / 2},-10 Q${-w / 2 + 3},0 ${-w / 2 + 11},2 H${w / 2 - 11} Q${w / 2 - 3},0 ${w / 2},-10 Q0,-5 ${-w / 2},-10 Z`, fill: '#F6F2E8', stroke: '#9A9282', 'stroke-width': .9 }, b);
      E('path', { d: `M${-w / 2},-10 Q0,-5 ${w / 2},-10`, stroke: '#8A5A33', 'stroke-width': 2.4, fill: 'none' }, b);
      E('path', { d: `M${-w / 2 + 6},-4 Q0,-1 ${w / 2 - 6},-4`, stroke: '#C8343F', 'stroke-width': 1.4, fill: 'none' }, b); } }
  const doors = [dPool, dBath, dGym, dSq, dBoat], tD = [T.d1, T.d2, T.d3, T.d4, T.d5];
  /* door effects */
  const splash = G(RM.first), drops = [];
  for (let i = 0; i < 12; i++) drops.push(E('ellipse', { rx: 2.6, ry: 3.4, fill: i % 3 ? '#8FD8EC' : '#FFFFFF' }, splash));
  const sheet = E('path', { d: 'M-24,0 Q-20,-26 -8,-10 Q0,-34 8,-10 Q20,-26 24,0 Z', fill: '#BDEBF5', 'fill-opacity': .85 }, splash);
  const puffs = [0, 1, 2, 3, 4, 5].map(i => { const g = G(RM.first); E('ellipse', { rx: 16, ry: 11, fill: '#FFFFFF' }, g); E('ellipse', { cx: 10, cy: -6, rx: 11, ry: 8, fill: '#FFFFFF' }, g); return g; });
  /* rug (the "first-class carpet" corner) */
  const rugG = G(RM.first);
  const rugGlow = E('ellipse', { cx: 760, cy: 368, rx: 30, ry: 10, fill: rgrad([[0, '#FFE7A0', .9], [1, '#FFB04A', 0]]) }, rugG);
  const rugCone = E('path', { d: 'M736,368 L800,368 L820,250 L716,250 Z', fill: lgrad([[0, '#FFE7A0', 0], [1, '#FFE7A0', .55]]) }, rugG);
  const rug = G(rugG);
  E('rect', { x: 0, y: -5, width: 52, height: 6, rx: 1.5, fill: '#8E2E2A' }, rug); E('rect', { x: 2, y: -4, width: 48, height: 1.6, fill: '#E2BE62' }, rug); E('rect', { x: 2, y: -1.4, width: 48, height: 1, fill: '#2F5DA8' }, rug);
  E('path', { d: 'M52,-5 v6 M54.5,-5 v6 M57,-5 v6', stroke: '#E9DCC0', 'stroke-width': 1.1 }, rug);
  /* the Lady's velvet chaise */
  const chaise = G(RM.first);
  E('path', { d: 'M1280,338 Q1276,300 1290,298 Q1306,298 1302,316 L1302,338 Z', fill: '#6E1F45' }, chaise);
  E('path', { d: 'M1284,300 q-10,-2 -8,10', stroke: '#E2BE62', 'stroke-width': 2, fill: 'none' }, chaise);
  E('rect', { x: 1280, y: 334, width: 122, height: 18, rx: 7, fill: '#7E2350' }, chaise);
  E('rect', { x: 1282, y: 335, width: 118, height: 4, rx: 2, fill: '#A84477' }, chaise);
  { let d = ''; for (let x = 1296; x < 1400; x += 14) d += `M${x},344 m-1.3,0 a1.3,1.3 0 1 0 2.6,0 a1.3,1.3 0 1 0 -2.6,0 `; E('path', { d, fill: '#4E1230' }, chaise); }
  E('path', { d: 'M1288,352 l-3,18 M1396,352 l3,18', stroke: '#C9A045', 'stroke-width': 3, 'stroke-linecap': 'round' }, chaise);
  E('ellipse', { cx: 1384, cy: 333, rx: 17, ry: 5, fill: '#5A2E7A' }, chaise); E('path', { d: 'M1368,333 l-3,5 M1400,333 l3,5', stroke: '#E2BE62', 'stroke-width': 1.6 }, chaise);
  /* people in first class */
  const lady = castPoshLady(RM.first);
  const stewA = Person(RM.first, { coat: 'suit', jacket: '#F5F1E6', shirt: '#FFFFFF', tie: '#20202A', pants: '#22232E', hair: '#3A2A20', hairStyle: 'parted', skin: '#F1C49C', seed: 13 });
  const stewB = Person(RM.first, { coat: 'suit', jacket: '#F5F1E6', shirt: '#FFFFFF', tie: '#20202A', pants: '#22232E', hair: '#B5562A', hairStyle: 'side', skin: '#F4CFAA', mustache: true, mustacheColor: '#8A3E1E', seed: 17 });
  const palmFan = (p, side) => { const f = G(p); E('rect', { x: -2.5, y: -150, width: 5, height: 152, rx: 2.5, fill: '#8A5A33' }, f);
    E('path', { d: 'M0,-138 C-62,-150 -74,-236 0,-268 C74,-236 62,-150 0,-138 Z', fill: '#6E9A3E' }, f);
    E('path', { d: 'M0,-140 L0,-262 M0,-142 L-44,-230 M0,-142 L44,-230 M0,-142 L-60,-190 M0,-142 L60,-190', stroke: '#4E7A2A', 'stroke-width': 3, fill: 'none' }, f);
    E('path', { d: 'M-20,-160 C-50,-180 -52,-226 -14,-250', stroke: '#9CC46A', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, f); return f; };
  palmFan(stewA.propR); palmFan(stewB.propL);
  const owner = castOwner(RM.first); const pocket = gagPocketOn(owner);
  /* confetti that stays stuck on the Owner after the faceful */
  const stuck = G(owner.head);
  [[-30, -398, 0], [18, -420, 2], [40, -372, 1], [-12, -290, 3], [24, -286, 4], [-44, -350, 6]].forEach(([x, y, c], i) => E('rect', { x: x - 5, y: y - 3, width: 10, height: 6, rx: 1, fill: CONF[c], transform: `rotate(${(i * 47) % 90 - 45} ${x} ${y})` }, stuck));
  E('path', { d: 'M-20,-420 q16,-10 22,6 q6,16 22,4 q14,-10 18,10', stroke: '#2F6FD6', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, stuck);
  E('path', { d: 'M8,-282 q-6,14 4,22 q8,8 0,18', stroke: '#E84855', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, stuck);
  op(stuck, 0);
  const ball = G(RM.first); const ballTrail = E('path', { stroke: '#2A2A30', 'stroke-opacity': .3, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, ball);
  const ballB = E('circle', { r: 4.6, fill: '#24242C' }, ball); E('circle', { cx: -1, cy: -1, r: 1, fill: '#fff', 'fill-opacity': .5 }, ball);
  const ping = G(RM.first); E('path', { d: 'M0,-12 V-6 M10,-8 L5,-4 M-10,-8 L-5,-4 M12,2 H6 M-12,2 H-6', stroke: '#F7C948', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, ping);
  const pats = G(RM.first); E('path', { d: 'M-8,-6 l-4,-4 M0,-9 v-5 M8,-6 l4,-4', stroke: '#F7C948', 'stroke-width': 2, 'stroke-linecap': 'round' }, pats);
  const confFace = []; for (let i = 0; i < 24; i++) confFace.push(E('rect', { x: -3, y: -1.8, width: 6, height: 3.6, rx: .8, fill: CONF[i % CONF.length] }, RM.first));
  const waves4 = G(RM.first); [0, 1, 2].forEach(k => E('path', { d: `M${-6 - k * 7},${-4 - k * 4} q${6 + k * 7},${-10 - k * 5} ${12 + k * 14},0`, stroke: '#FFE7A0', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, waves4));

  /* ---------- THIRD CLASS: the party ---------- */
  const R3 = RM.third;
  const bulb = G(R3); E('path', { d: 'M0,0 V26', stroke: '#3A2A20', 'stroke-width': 1.2 }, bulb); itrGlow(bulb, 0, 30, 34, 26, '#FFE29A', .55); E('circle', { cx: 0, cy: 30, r: 4.5, fill: '#FFF4C8' }, bulb); E('rect', { x: -2.5, y: 23, width: 5, height: 4, fill: '#8A8274' }, bulb);
  const fiddler = castPassenger(R3, 8, { instrument: 'violin', lite: true, jacket: '#6A4A3A' });
  const accord = castPassenger(R3, 4, { lite: true, hatColor: '#3E4A5A', beard: false, mustache: true, mustacheColor: '#4A3226', jacket: '#4A5A3A', seed: 141 });
  const capMan = castPassenger(R3, 4, { lite: true, seed: 147 });
  const handCap = gagCap(capMan.propL); handCap.set({ s: 0 });
  const capSpark = G(null);
  /* accordion (drawn in the player's torso frame, between his hands) */
  const acc = G(accord.torso);
  const bell = E('path', { fill: '#2A2A30', stroke: '#F2C14E', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, acc);
  const accL = G(acc), accR = G(acc);
  [accL, accR].forEach(g => { E('rect', { x: -11, y: -32, width: 22, height: 64, rx: 4, fill: '#C8343F', stroke: '#7A1E22', 'stroke-width': 2 }, g); let d = ''; for (let k = 0; k < 4; k++) d += `M-4,${-20 + k * 12} m-2.6,0 a2.6,2.6 0 1 0 5.2,0 a2.6,2.6 0 1 0 -5.2,0 M5,${-14 + k * 12} m-2.6,0 a2.6,2.6 0 1 0 5.2,0 a2.6,2.6 0 1 0 -5.2,0 `; E('path', { d, fill: '#FBF3DE' }, g); });
  /* table front (so the people behind the table are behind it) + hopping soup bowls */
  const tableF = G(R3);
  E('rect', { x: 690, y: 596, width: 320, height: 6, rx: 2, fill: '#A8743F' }, tableF); E('rect', { x: 690, y: 600, width: 320, height: 4, fill: '#F2EADA' }, tableF);
  E('path', { d: 'M700,602 V630 M1000,602 V630 M850,602 V630', stroke: '#7E5230', 'stroke-width': 4 }, tableF); E('rect', { x: 684, y: 616, width: 332, height: 5, rx: 2, fill: '#B07A42' }, tableF);
  const bowls = [714, 752, 790, 828, 866].map((x, i) => { const g = G(R3);
    E('path', { d: 'M-9,-6 Q-9,2 0,2 Q9,2 9,-6 Z', fill: '#F4EFE6', stroke: '#B8AE9C', 'stroke-width': 1 }, g); E('ellipse', { cx: 0, cy: -6, rx: 9, ry: 2.4, fill: '#C8783A' }, g);
    const dr = E('circle', { cx: 0, cy: -10, r: 1.6, fill: '#C8783A' }, g); return { g, x, dr }; });
  const dancers = [castPassenger(R3, 5, { lite: true }), castPassenger(R3, 7, { lite: true }), castPassenger(R3, 6, { lite: true })];
  const conf3 = []; for (let i = 0; i < 16; i++) conf3.push(E('rect', { x: -2.4, y: -1.5, width: 4.8, height: 3, rx: .7, fill: CONF[(i * 3) % CONF.length] }, R3));

  /* ---------- second class / boiler rooms in the cutaway ---------- */
  const cStk = [castStoker(RM.boiler, 1, { lite: true }), castStoker(RM.boiler, 2, { lite: true })];

  /* ---------- the banister: a staircase from first class down to third ---------- */
  const SA = [1212, 370], SB = [975, 630], RA = [1212, 340], RB = [984, 586];
  const stairs = before(G(null, {}), HL); stairs.setAttribute('clip-path', hullClip);
  { let d = `M${SA[0] + 10},${SA[1]}`; const n = 14, dx = (SB[0] - SA[0]) / n, dy = (SB[1] - SA[1]) / n;
    let x = SA[0], y = SA[1]; d = `M${x + 8},${y}`; for (let i = 0; i < n; i++) { d += ` H${f2(x + dx)} V${f2(y + dy)}`; x += dx; y += dy; } d += ` H${SB[0] - 6} L${SA[0] + 8},${SA[1] + 22} Z`;
    E('path', { d, fill: '#8E5E33' }, stairs);
    let c = ''; x = SA[0]; y = SA[1]; for (let i = 0; i < n; i++) { c += `M${f2(x)},${f2(y)} H${f2(x + dx)} `; x += dx; y += dy; } E('path', { d: c, stroke: '#A8322F', 'stroke-width': 3 }, stairs);
    let b = ''; for (let i = 1; i < 18; i++) { const t = i / 18, bx = lerp(RA[0], RB[0], t), by = lerp(RA[1], RB[1], t); const sy = lerp(SA[1], SB[1], (SA[0] - bx) / (SA[0] - SB[0])); b += `M${f2(bx)},${f2(by)} V${f2(sy)} `; }
    E('path', { d: b, stroke: '#2E2522', 'stroke-width': 1.6 }, stairs);
    E('path', { d: `M${RA[0] + 4},${RA[1] - 3} L${RB[0] - 4},${RB[1] + 4}`, stroke: '#6E4426', 'stroke-width': 6, 'stroke-linecap': 'round' }, stairs);
    E('path', { d: `M${RA[0] + 4},${RA[1] - 5} L${RB[0] - 4},${RB[1] + 2}`, stroke: '#A8743F', 'stroke-width': 2 }, stairs);
    [[RA[0] + 4, RA[1] - 4, SA[1]], [RB[0] - 4, RB[1] + 2, SB[1]]].forEach(([x, y0, y1]) => { E('rect', { x: x - 4, y: y0, width: 8, height: y1 - y0, fill: '#7A4A26' }, stairs); E('circle', { cx: x, cy: y0 - 3, r: 5, fill: '#C9A045' }, stairs); }); }
  /* ---------- hull skin (the outside of the ship, sliced away by the knife) ---------- */
  const knifeClip = clipR(-500, -500, 2600, 1800);
  const skin = before(G(null), HL); skin.setAttribute('clip-path', knifeClip.url);
  { const sk = G(skin, { 'clip-path': hullClip });
    E('rect', { x: 0, y: 200, width: 1600, height: 182, fill: '#F2EEE4' }, sk);
    E('rect', { x: 0, y: 381, width: 1600, height: 260, fill: '#24252D' }, sk);
    E('rect', { x: 0, y: 641, width: 1600, height: 260, fill: '#A8322D' }, sk);
    E('rect', { x: 0, y: 376, width: 1600, height: 6, fill: '#D4A73A' }, sk);
    let w1 = '', w2 = '', ph = '', ph2 = '', sm = '';
    for (let x = 58; x < 1556; x += 22) w1 += `M${x},250 h11 v15 h-11 Z `;
    for (let x = 64; x < 1556; x += 38) w2 += `M${x},300 h26 v26 h-26 Z `;
    for (let x = 62; x < 1548; x += 24) ph += `M${x},${x % 48 ? 432 : 432} m-4.5,0 a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0 M${x + 12},482 m-4,0 a4,4 0 1 0 8,0 a4,4 0 1 0 -8,0 `;
    for (let x = 110; x < 1530; x += 30) ph2 += `M${x},566 m-3.5,0 a3.5,3.5 0 1 0 7,0 a3.5,3.5 0 1 0 -7,0 `;
    for (let x = 96; x < 1560; x += 96) sm += `M${x},384 V640 `;
    sm += 'M40,456 H1570 M44,524 H1566 M48,604 H1562';
    E('path', { d: w1, fill: '#9FC3D8', stroke: '#C9C2B0', 'stroke-width': 1.4 }, sk);
    E('path', { d: w2, fill: '#B8D4E2', stroke: '#C9C2B0', 'stroke-width': 1.6 }, sk);
    E('path', { d: 'M40,286 H1572 M40,340 H1572', stroke: '#D8D1C2', 'stroke-width': 2 }, sk);
    E('path', { d: sm, stroke: '#30313A', 'stroke-width': 2 }, sk);
    E('path', { d: ph, fill: '#E8DFC4' }, sk); E('path', { d: ph2, fill: '#C9C0A6' }, sk);
    E('rect', { x: 0, y: 200, width: 1600, height: 700, fill: lgrad([[0, '#fff', .12], [.25, '#fff', 0], [.7, '#000', 0], [1, '#000', .28]]) }, sk);
    TX(sk, 1418, 438, 'TITANIC', 30, '#E2BE62', { a: 'middle', w: 800, ls: 5 });
    E('path', { d: 'M1528,452 V494 M1516,462 H1540 M1512,486 Q1528,506 1544,486', stroke: '#8A8274', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, sk);
    E('circle', { cx: 1528, cy: 448, r: 5, fill: 'none', stroke: '#8A8274', 'stroke-width': 3 }, sk); }
  const cutEdge = before(E('rect', { x: 0, y: 205, width: 5, height: 670, fill: '#FFF3D6', 'fill-opacity': .85 }), HL);

  /* ---------- icing (above the hull plating) ---------- */
  const iceG = before(G(null), SG);
  const mkIcing = (y, x0, x1, thick, maxL, col, hi, sh, seed, quiet = []) => {
    const g = G(iceG); let d = `M${x0},${y - thick} H${x1} V${y}`, x = x1, i = 0;
    while (x > x0 + 4) { const w = 10 + hash(i * 3.1 + seed) * 18, xb = Math.max(x0, x - w), L = (hash(i * 7.7 + seed) < .55 && !quiet.some(([a, b]) => x > a && xb < b)) ? maxL * (.35 + .65 * hash(i * 1.3 + seed)) : maxL * .14, r = (x - xb) * .34, m = (x + xb) / 2;
      d += ` C${f2(x)},${f2(y + L * .6)} ${f2(m + r)},${f2(y + L)} ${f2(m)},${f2(y + L)} C${f2(m - r)},${f2(y + L)} ${f2(xb)},${f2(y + L * .6)} ${f2(xb)},${f2(y)}`; x = xb; i++; }
    d += ' Z';
    E('path', { d: d, fill: sh, transform: 'translate(0,2)' }, g); E('path', { d, fill: col }, g);
    E('path', { d: `M${x0 + 4},${y - thick + 2.5} H${x1 - 4}`, stroke: hi, 'stroke-width': Math.max(1.5, thick * .3), 'stroke-linecap': 'round' }, g);
    g._y = y - thick; return g; };
  const ice = [mkIcing(226, 30, 1580, 13, 32, '#F2C14E', '#FFEBA8', '#B9861E', 1, [[218, 286], [740, 830], [1286, 1352]]), mkIcing(386, 33, 1572, 7, 18, '#FFF2D6', '#FFFFFF', '#D9C7A0', 5, [[860, 920]]), mkIcing(515, 38, 1565, 3.5, 9, '#FFFFFF', '#FFFFFF', '#D8D2C6', 9)];
  const sprinkles = G(ice[0]); { for (let i = 0; i < 40; i++) { const x = 50 + i * 38.4 + hash(i) * 10, y = 216 + hash(i * 2.2) * 6; E('rect', { x: f2(x), y: f2(y), width: 5, height: 2, rx: 1, fill: CONF[i % 5], transform: `rotate(${f2(hash(i * 5) * 180)} ${f2(x)} ${f2(y)})` }, sprinkles); } }

  /* Mitzi lives above the rooms so she can cross the decks */
  const mitziG = before(G(null), SG);
  const speed = G(mitziG); [0, 1, 2].forEach(k => E('path', { d: `M${10 + k * 4},${-8 - k * 8} H${40 + k * 14}`, stroke: '#FFFFFF', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-opacity': .8 }, speed));
  const mitzi = Dog(mitziG); const cap = gagCap(mitzi.head); cap.set({ s: 0 });
  mitziG.appendChild(capSpark); E('path', { d: 'M0,-14 L3,-3 L14,0 L3,3 L0,14 L-3,3 L-14,0 L-3,-3 Z', fill: '#FFE7A0' }, capSpark); E('circle', { r: 3, fill: '#FFFFFF' }, capSpark);

  /* ---------- knife, crumbs, cream dollop, cherry, notes (above the whole cutaway) ---------- */
  const crumbs = []; for (let i = 0; i < 18; i++) crumbs.push(E('rect', { x: -4, y: -3, width: 8, height: 6, rx: 2, fill: ['#F7E8C8', '#E9C98A', '#F2C14E', '#24252D', '#F2EEE4'][i % 5] }, camA));
  const knife = G(camA);
  { const k = knife;
    E('rect', { x: -48, y: -1040, width: 96, height: 252, rx: 42, fill: '#F3EAD8' }, k);
    E('rect', { x: 18, y: -1030, width: 20, height: 232, rx: 10, fill: '#DCCFB8' }, k);
    E('rect', { x: -36, y: -1028, width: 14, height: 228, rx: 7, fill: '#FFFFFF', 'fill-opacity': .7 }, k);
    [-990, -900, -830].forEach(y => E('circle', { cx: 0, cy: y, r: 7, fill: '#C9A045' }, k));
    E('path', { d: 'M0,-880 q-40,-30 -50,6 q30,6 50,-6 q40,-30 50,6 q-30,6 -50,-6 M-4,-878 q-14,30 -26,50 M4,-878 q14,30 26,50', stroke: '#E58FAE', 'stroke-width': 7, fill: '#F6B6C8', 'stroke-linejoin': 'round' }, k);
    E('rect', { x: -62, y: -800, width: 124, height: 32, rx: 9, fill: '#C9A045' }, k); E('rect', { x: -62, y: -800, width: 124, height: 9, rx: 4, fill: '#F0D27E' }, k);
    E('path', { d: 'M-56,-770 H56 V-86 Q56,0 0,0 Q-56,0 -56,-86 Z', fill: lgrad([[0, '#9EA9B6'], [.32, '#E9EEF3'], [.5, '#FFFFFF'], [.75, '#C9D1DA'], [1, '#A9B4C0']], 0, 0, 1, 0) }, k);
    E('path', { d: 'M-56,-770 H-38 V-80 Q-36,-14 0,0 Q-56,0 -56,-86 Z', fill: '#000', 'fill-opacity': .08 }, k);
    E('path', { d: 'M-14,-700 L20,-760 L34,-760 L0,-700 Z M-20,-520 L30,-610 L40,-610 L-10,-520 Z', fill: '#fff', 'fill-opacity': .6 }, k);
    let s = 'M56,-740'; for (let y = -740; y < -110; y += 18) s += ` q8,9 0,18`; E('path', { d: s, stroke: '#8E99A6', 'stroke-width': 2.4, fill: 'none' }, k); }
  const cream = G(camA); E('path', { d: 'M-24,0 Q-26,-12 -12,-14 Q-14,-26 0,-28 Q14,-26 12,-14 Q26,-12 24,0 Z', fill: '#FFFDF4', stroke: '#E8DCC0', 'stroke-width': 2 }, cream); E('path', { d: 'M-14,-8 Q0,-4 14,-10 M-6,-20 Q2,-17 8,-22', stroke: '#E8DCC0', 'stroke-width': 2, fill: 'none' }, cream);
  const cherry = G(camA); const cherryIn = G(cherry);
  E('path', { d: 'M2,-18 Q8,-46 26,-58', stroke: '#5A7A2A', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, cherryIn);
  E('path', { d: 'M20,-54 Q36,-66 44,-50 Q30,-44 20,-54 Z', fill: '#4E8A3A' }, cherryIn);
  E('circle', { cx: 0, cy: 0, r: 20, fill: rgrad([[0, '#FF6A6A'], [.55, '#D4202A'], [1, '#8E0E1A']], .38, .35, .7) }, cherryIn);
  E('ellipse', { cx: -7, cy: -8, rx: 6, ry: 4, fill: '#FFFFFF', 'fill-opacity': .75, transform: 'rotate(-30 -7 -8)' }, cherryIn);
  const plop = G(camA); E('path', { d: 'M-34,-6 l-12,-6 M-30,-20 l-8,-12 M34,-6 l12,-6 M30,-20 l8,-12 M0,-30 v-12', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, plop);
  const notes = []; for (let i = 0; i < 9; i++) notes.push(note(camA, ['#FFE7A0', '#FFFFFF', '#FFD166'][i % 3]));

  /* plaques: keep the cutaway's own floor signs on the left edge while zoomed */
  const SIGN = [['first', 145, 236], ['second', 145, 396], ['third', 145, 526], ['boiler', 800, 658]];

  /* =====================================================================
     B) THE STOKEHOLD (bgBoiler)
     ===================================================================== */
  const boil = bgBoiler(camB, { vignette: false });
  const BA = boil.anchors;
  /* petrol-pump coal meter, hung from the overhead pipe */
  const meter = G(boil);
  { const m = meter;
    E('path', { d: 'M620,64 L640,124 M980,64 L960,124', stroke: '#2A2426', 'stroke-width': 4, 'stroke-dasharray': '6 3' }, m);
    E('rect', { x: 586, y: 118, width: 428, height: 214, rx: 22, fill: '#000', 'fill-opacity': .35, transform: 'translate(6,8)' }, m);
    E('rect', { x: 586, y: 118, width: 428, height: 214, rx: 22, fill: lgrad([[0, '#E9C46A'], [.5, '#C9A045'], [1, '#8E6A22']]) }, m);
    E('rect', { x: 600, y: 132, width: 400, height: 186, rx: 14, fill: '#FBF3DE' }, m);
    E('rect', { x: 600, y: 132, width: 400, height: 48, rx: 14, fill: '#1D2B53' }, m);
    TX(m, 800, 166, 'TONS OF COAL', 28, '#FFE7A8', { a: 'middle', w: 800, ls: 2 }); }
  const digits = [];
  [0, 1, 2].forEach(i => { const x = 683 + i * 80, y = 188;
    E('rect', { x: x - 3, y: y - 3, width: 76, height: 92, rx: 8, fill: '#3A2A10' }, meter);
    const w = G(meter, { 'clip-path': clipR(x, y, 70, 86).url }); E('rect', { x, y, width: 70, height: 86, fill: '#16131A' }, w);
    const col = G(w); for (let k = 0; k <= 10; k++) TX(col, x + 35, y + 68 + k * 86, String(k % 10), 70, '#FFF6E0', { a: 'middle', w: 800 });
    E('rect', { x, y, width: 70, height: 22, fill: lgrad([[0, '#000', .6], [1, '#000', 0]]) }, w); E('rect', { x, y: y + 64, width: 70, height: 22, fill: lgrad([[0, '#000', 0], [1, '#000', .6]]) }, w);
    E('rect', { x: x + 4, y: y + 6, width: 62, height: 10, rx: 5, fill: '#fff', 'fill-opacity': .12 }, w);
    digits.push({ col, x }); });
  const dayLbl = G(meter); E('rect', { x: 724, y: 284, width: 152, height: 34, rx: 8, fill: '#B5302A' }, dayLbl); TX(dayLbl, 800, 309, 'A DAY', 24, '#FFF6E0', { a: 'middle', w: 800, ls: 2 });
  const mBell = G(meter); E('path', { d: 'M-16,0 Q-16,-22 0,-24 Q16,-22 16,0 Z', fill: '#F2C14E', stroke: '#8E6A22', 'stroke-width': 2 }, mBell); E('circle', { cx: 0, cy: 3, r: 4, fill: '#8E6A22' }, mBell);
  const mFlash = E('rect', { x: 586, y: 118, width: 428, height: 214, rx: 22, fill: '#FFF6D0' }, meter); op(mFlash, 0);
  const dingL = G(meter); E('path', { d: 'M-34,-10 l-14,-8 M-30,-26 l-10,-12 M34,-10 l14,-8 M30,-26 l10,-12', stroke: '#FFE7A0', 'stroke-width': 4, 'stroke-linecap': 'round' }, dingL);
  /* thermometer */
  const thermo = G(boil);
  E('rect', { x: 1066, y: 140, width: 30, height: 300, rx: 15, fill: '#E9E4D8', stroke: '#8A8274', 'stroke-width': 3 }, thermo);
  E('circle', { cx: 1081, cy: 452, r: 26, fill: '#E9E4D8', stroke: '#8A8274', 'stroke-width': 3 }, thermo);
  E('circle', { cx: 1081, cy: 452, r: 19, fill: '#D62F2F' }, thermo);
  const merc = E('rect', { x: 1075, width: 12, rx: 6, fill: '#D62F2F' }, thermo);
  { let d = ''; for (let y = 170; y < 430; y += 26) d += `M1096,${y} h10 `; E('path', { d, stroke: '#8A8274', 'stroke-width': 2.4 }, thermo); }
  const thermoPop = G(thermo); E('ellipse', { cx: 1081, cy: 128, rx: 22, ry: 14, fill: '#FFFFFF', 'fill-opacity': .85 }, thermoPop); E('ellipse', { cx: 1096, cy: 116, rx: 14, ry: 10, fill: '#FFFFFF', 'fill-opacity': .8 }, thermoPop);
  /* stokers */
  const stk = [0, 1, 2, 3].map(i => castStoker(boil.mid, i));
  const stFlip = BA.stokers.map((p, i) => BA.doors[BA.stokerDoor[i]][0] > p[0]);
  const rag = G(stk[1].propL); E('path', { d: 'M-14,-10 Q0,-18 14,-8 L12,12 Q0,6 -12,14 Z', fill: '#8E8A80', stroke: '#5E5A52', 'stroke-width': 1.5 }, rag);
  const shimmer = [0, 1, 2, 3, 4, 5].map(i => E('path', { stroke: '#FFE2B0', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, boil.front));

  /* =====================================================================
     C) THE BRIDGE (bgBridge, turned to daylight)
     ===================================================================== */
  const br = bgBridge(camC, { vignette: false });
  const view = br.far.parentNode;
  { const day = G(null); view.insertBefore(day, br.far);
    E('rect', { x: -1000, y: -900, width: 3600, height: 1253, fill: lgrad([[0, '#3E8FD0'], [.75, '#8CC6EA'], [1, '#D6EEF6']]) }, day);
    itrGlow(day, 1240, 120, 300, 200, '#FFF4D0', .55);
    [[300, 150, 1], [980, 90, .8], [1450, 210, .7]].forEach(([x, y, s]) => { const c = G(day); tf(c, x, y, 0, s); [[0, 0, 70], [60, -14, 52], [110, 4, 40], [-56, 8, 40]].forEach(([cx, cy, r]) => E('ellipse', { cx, cy, rx: r, ry: r * .42, fill: '#FFFFFF', 'fill-opacity': .85 }, c)); });
    E('rect', { x: -1000, y: 352, width: 3600, height: 600, fill: lgrad([[0, '#3C86B8'], [1, '#1A4E78']]) }, day);
    E('rect', { x: -1000, y: 350, width: 3600, height: 3, fill: '#E6F4FA', 'fill-opacity': .7 }, day);
    let d = ''; for (let i = 0; i < 60; i++) { const x = -200 + hash(i * 4.7) * 2000, y = 360 + Math.pow(hash(i * 1.3), 1.5) * 140; d += `M${f2(x)},${f2(y)} q6,-4 12,0 `; } E('path', { d, stroke: '#FFFFFF', 'stroke-opacity': .4, 'stroke-width': 2, fill: 'none' }, day);
    const fc = br.far.nextElementSibling, deck = fc.nextElementSibling, planks = deck.nextElementSibling;
    fc.setAttribute('fill', '#E9E4D8'); deck.setAttribute('fill', '#C49A6A'); planks.setAttribute('stroke', '#A87C50'); }
  E('rect', { x: -1000, y: 652, width: 3600, height: 600, fill: lgrad([[0, '#FFE2B0', .22], [1, '#FFE2B0', .08]]) }, br);
  E('rect', { x: -1000, y: 120, width: 3600, height: 360, fill: '#FFF2D0', 'fill-opacity': .06 }, br);
  /* the floor hatch (beside the Captain, near the back wall so it stays clear of the subtitles) */
  const HX = 1130, HY0 = 690, HY1 = 714;
  const hatchG = G(br);
  E('ellipse', { cx: HX, cy: HY1 + 4, rx: 86, ry: 12, fill: '#000', 'fill-opacity': .18 }, hatchG);
  E('path', { d: `M${HX - 60},${HY1} L${HX + 60},${HY1} L${HX + 54},${HY0} L${HX - 54},${HY0} Z`, fill: '#5A3C28', stroke: '#3A2618', 'stroke-width': 3 }, hatchG);
  const hole = G(hatchG);
  E('path', { d: `M${HX - 54},${HY1 - 2} L${HX + 54},${HY1 - 2} L${HX + 49},${HY0 + 2} L${HX - 49},${HY0 + 2} Z`, fill: '#1A0E0A' }, hole);
  const holeGlow = itrGlow(hole, HX, HY0 + 6, 90, 40, '#FF8A2A', .7);
  const lidG = G(br.mid);
  const lid = E('path', { fill: '#7A5236', stroke: '#3A2618', 'stroke-width': 3 }, lidG);
  const lidPl = E('path', { stroke: '#5E3E28', 'stroke-width': 2, fill: 'none' }, lidG);
  const lidRing = E('ellipse', { rx: 9, ry: 4, fill: 'none', stroke: '#C9A045', 'stroke-width': 3 }, lidG);
  const armG = G(br.mid, { 'clip-path': clipR(HX - 80, -400, 160, HY1 - 2 + 400).url });
  const arm = G(armG);
  { const a = arm;
    E('path', { d: 'M8,140 Q2,70 0,0', stroke: '#2A2220', 'stroke-width': 34, fill: 'none', 'stroke-linecap': 'round' }, a);
    E('path', { d: 'M14,140 Q8,70 6,8', stroke: '#4A3C36', 'stroke-width': 5, fill: 'none', 'stroke-opacity': .7 }, a);
    const sh = G(a); tf(sh, 0, 0, -8);
    E('rect', { x: -5, y: -170, width: 10, height: 230, rx: 4, fill: '#8A5A32' }, sh);
    E('path', { d: 'M-30,-230 Q-34,-250 -20,-262 Q0,-268 20,-262 Q34,-250 30,-230 L8,-168 L-8,-168 Z', fill: '#9AA0AC' }, sh);
    E('path', { d: 'M-22,-236 Q-24,-250 -14,-256 Q0,-260 14,-256 Q24,-250 22,-236 L6,-180 L-6,-180 Z', fill: '#4B515D' }, sh);
    [[-10, -246, 7], [6, -250, 8], [12, -238, 6], [-2, -236, 6]].forEach(([x, y, r]) => E('path', { d: `M${x - r},${y} L${x - r * .4},${y - r} L${x + r * .7},${y - r * .7} L${x + r},${y + r * .3} L${x},${y + r * .6} Z`, fill: '#1C1C22' }, sh));
    E('ellipse', { cx: 0, cy: 0, rx: 16, ry: 14, fill: '#2A2220' }, a); E('path', { d: 'M-12,-6 q12,-6 24,0 M-12,2 q12,-6 24,0', stroke: '#140E0C', 'stroke-width': 3, fill: 'none' }, a); }
  const fumes = [0, 1, 2].map(i => { const g = G(br.mid); E('ellipse', { rx: 20, ry: 13, fill: '#8E8682' }, g); E('ellipse', { cx: 12, cy: -8, rx: 13, ry: 9, fill: '#A39C98' }, g); return g; });
  const captain = castCaptain(br.mid);
  const soot = [0, 1, 2, 3, 4].map(i => E('ellipse', { rx: 22, ry: 13, fill: '#77706E' }, br.mid));
  const clangG = G(br.mid); E('path', { d: 'M-70,-10 l-26,-10 M-60,-40 l-20,-22 M70,-10 l26,-10 M60,-40 l20,-22 M0,-56 v-24', stroke: '#F7C948', 'stroke-width': 6, 'stroke-linecap': 'round' }, clangG);
  { const t = TX(clangG, 0, -96, 'CLANG!', 54, '#FFD23F', { a: 'middle', w: 800, ls: 2 }); t.setAttribute('stroke', '#5A2A10'); t.setAttribute('stroke-width', '8'); t.setAttribute('paint-order', 'stroke'); t.setAttribute('transform', 'rotate(-8 0 -110)'); }

  /* =====================================================================
     D) SPLIT-SCREEN DIVIDER + SIGNS, HUD (postcards, whoosh lines, vignette)
     ===================================================================== */
  const divB = G(DIV);
  E('rect', { x: -20, y: -14, width: 1640, height: 28, fill: '#2A2628' }, divB);
  E('rect', { x: -20, y: -14, width: 1640, height: 5, fill: '#C9A045' }, divB); E('rect', { x: -20, y: 9, width: 1640, height: 5, fill: '#C9A045' }, divB);
  { let d = ''; for (let x = 10; x < 1600; x += 30) d += `M${x},0 m-2.4,0 a2.4,2.4 0 1 0 4.8,0 a2.4,2.4 0 1 0 -4.8,0 `; E('path', { d, fill: '#6A5E5A' }, divB); }
  const plaque = (p, x, y, text, size, col) => { const g = N(p, x, y); const w = Math.round(text.length * size * .62 + 54), h = Math.round(size * 1.9);
    E('rect', { x: -w / 2 + 4, y: 6, width: w, height: h, rx: 10, fill: '#000', 'fill-opacity': .35 }, g);
    E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 10, fill: '#C9A045' }, g); E('rect', { x: -w / 2 + 5, y: 5, width: w - 10, height: h - 10, rx: 7, fill: col }, g);
    TX(g, 0, h / 2 + size * .36, text, size, '#FFF1D0', { a: 'middle', w: 800, ls: 1.5 }); return g; };
  const tag = (p, x, y, text, col, len = 46) => { const g = N(p, x, y); const w = text.length * 14 + 52;
    E('path', { d: `M0,${-len} L-10,0`, stroke: '#5A4A3A', 'stroke-width': 2.5 }, g);
    E('path', { d: `M-18,0 H${w - 18} V48 H-18 L-34,24 Z`, fill: '#FBF3DE', stroke: '#B8A27A', 'stroke-width': 2.5 }, g);
    E('circle', { cx: -14, cy: 24, r: 5, fill: '#B8A27A' }, g);
    TX(g, (w - 30) / 2 - 4, 33, text, 25, col, { a: 'middle', w: 800, ls: .5 }); return g; };
  const signBath = plaque(DIV, 600, 30, 'TURKISH BATH', 28, '#2F6B6A'), signStoke = plaque(DIV, 600, 482, 'STOKEHOLD', 28, '#3A2A2A');
  const tagX = tag(DIV, 1170, 120, 'EXTRA CHARGE', '#B5302A', 140), tagN = tag(DIV, 1190, 560, 'NO CHARGE', '#1D2B53', 46);
  /* postcards */
  const postcard = (title, picture) => { const g = G(HUD), inner = G(g);
    E('rect', { x: -164, y: -98, width: 336, height: 210, rx: 8, fill: '#000', 'fill-opacity': .28 }, inner);
    E('rect', { x: -168, y: -105, width: 336, height: 210, rx: 8, fill: '#FBF3DE', stroke: '#D9C9A2', 'stroke-width': 3 }, inner);
    const pic = G(inner, { 'clip-path': clipR(-154, -92, 308, 128, 4).url }); picture(pic);
    E('rect', { x: -154, y: -92, width: 308, height: 128, rx: 4, fill: 'none', stroke: '#8A7A5A', 'stroke-width': 2 }, inner);
    E('rect', { x: 108, y: -88, width: 40, height: 48, fill: '#E86A5A', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '3 2' }, inner);
    E('circle', { cx: 100, cy: -40, r: 22, fill: 'none', stroke: '#3A3A4A', 'stroke-width': 2, 'stroke-opacity': .55 }, inner);
    E('path', { d: 'M70,-50 q12,-6 24,0 q12,6 24,0 q12,-6 24,0 M70,-40 q12,-6 24,0 q12,6 24,0 q12,-6 24,0', stroke: '#3A3A4A', 'stroke-width': 2, fill: 'none', 'stroke-opacity': .55 }, inner);
    { const t = TX(inner, 0, 80, title, 26, '#1D2B53', { a: 'middle', w: 800, ls: .5 }); if (title.length > 17) { t.setAttribute('textLength', 312); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } }
    return { g, inner }; };
  const pc1 = postcard('CHERBOURG, FRANCE', p => {
    E('rect', { x: -160, y: -100, width: 320, height: 140, fill: lgrad([[0, '#8FC8EE'], [1, '#E8F4FA']]) }, p);
    E('circle', { cx: 90, cy: -56, r: 16, fill: '#FFE7A0' }, p);
    E('rect', { x: -160, y: -6, width: 320, height: 50, fill: '#3D86C0' }, p);
    E('path', { d: 'M-160,-6 L-40,-6 L-30,-24 L40,-24 L50,-6 L160,-6 L160,4 L-160,4 Z', fill: '#B9A88A' }, p);
    E('path', { d: 'M-120,-6 V-58 H-104 V-6 Z', fill: '#FFFFFF' }, p); E('path', { d: 'M-124,-58 H-100 L-104,-70 H-120 Z', fill: '#C8343F' }, p);
    E('path', { d: 'M20,-24 V-50 M20,-50 h12 v6 h-12 M20,-44 h12 v6 h-12', stroke: '#5A4A3A', 'stroke-width': 2 }, p);
    E('rect', { x: 32, y: -50, width: 6, height: 12, fill: '#1D3F8A' }, p); E('rect', { x: 38, y: -50, width: 6, height: 12, fill: '#FFFFFF' }, p); E('rect', { x: 44, y: -50, width: 6, height: 12, fill: '#C8343F' }, p);
    E('path', { d: 'M-150,20 q10,-4 20,0 M-60,30 q10,-4 20,0 M60,18 q10,-4 20,0', stroke: '#FFFFFF', 'stroke-width': 2, fill: 'none' }, p); });
  const pc2 = postcard('QUEENSTOWN, IRELAND', p => {
    E('rect', { x: -160, y: -100, width: 320, height: 140, fill: lgrad([[0, '#9CCDEB'], [1, '#EAF5F8']]) }, p);
    E('path', { d: 'M-160,-10 Q-100,-74 -20,-40 Q60,-80 160,-30 V40 H-160 Z', fill: '#4E9A4A' }, p);
    E('path', { d: 'M-160,4 Q-60,-30 40,-14 Q100,-24 160,0 V40 H-160 Z', fill: '#3E8A3E' }, p);
    [['#E8C24E', -110], ['#E86A5A', -86], ['#7FB6E0', -62], ['#F4EEE2', -38], ['#C88AD0', -14], ['#E8C24E', 10]].forEach(([c, x]) => { E('rect', { x, y: -6, width: 22, height: 20, fill: c }, p); E('path', { d: `M${x - 2},-6 L${x + 11},-16 L${x + 24},-6 Z`, fill: '#6A4A3A' }, p); });
    E('path', { d: 'M54,-10 V-52 L62,-86 L70,-52 V-10 Z', fill: '#B8B2A8' }, p); E('rect', { x: 40, y: -30, width: 44, height: 22, fill: '#C8C2B8' }, p);
    E('rect', { x: -160, y: 14, width: 320, height: 30, fill: '#3D86C0' }, p); E('path', { d: 'M-130,26 q10,-4 20,0 M10,30 q10,-4 20,0', stroke: '#FFFFFF', 'stroke-width': 2, fill: 'none' }, p); });
  const whoosh = G(HUD); const wl = []; for (let i = 0; i < 12; i++) wl.push(E('rect', { x: 60 + i * 128 + hash(i) * 60, y: 0, width: 5, height: 180 + hash(i * 3) * 220, rx: 2.5, fill: '#FFFFFF', 'fill-opacity': .55 }, whoosh));
  const seam = G(HUD); E('rect', { x: -20, y: -22, width: 1640, height: 44, fill: '#2A2628' }, seam); E('rect', { x: -20, y: -22, width: 1640, height: 6, fill: '#C9A045' }, seam); E('rect', { x: -20, y: 16, width: 1640, height: 6, fill: '#C9A045' }, seam);

  /* =====================================================================
     per-frame helpers
     ===================================================================== */
  /* knife state: tip position + rotation */
  const knifeAt = lt => {
    if (lt < T.kIn) return { x: 40, y: -1300, r: -14, v: 0 };
    if (lt < T.kCut0) { const p = prog(lt, T.kIn, T.kCut0 - T.kIn, easeIn); return { x: 40, y: lerp(-900, 878, p), r: lerp(-14, 4, p), v: 1 }; }
    if (lt < T.kCut1) { const p = prog(lt, T.kCut0, T.kCut1 - T.kCut0, ease); return { x: lerp(40, 1594, p), y: 878 - Math.abs(Math.sin((lt - T.kCut0) * 15)) * 22, r: 5 + Math.sin((lt - T.kCut0) * 15) * 2, v: 1 }; }
    const p = prog(lt, T.kCut1, T.kOut - T.kCut1, easeIn); return { x: lerp(1594, 1760, p), y: lerp(878, -1400, p), r: lerp(5, 30, p), v: p < 1 ? 1 : 0 };
  };
  /* Mitzi's path */
  const RAIL = (k) => [lerp(RA[0], RB[0], k), lerp(RA[1], RB[1], k)];
  const railRot = -Math.atan2(RB[1] - RA[1], RA[0] - RB[0]) * 180 / Math.PI;
  const mitziAt = lt => {
    if (lt < T.hop) return { x: 1386, y: 330, rot: 0, flip: true, jump: 0, rail: 0 };
    if (lt < T.rail0) { const p = prog(lt, T.hop, T.rail0 - T.hop, lin), q = arcPos(p, [1386, 330], [RA[0] - 2, RA[1] - 1], 60); return { x: q[0], y: q[1], rot: lerp(0, railRot, p * p), flip: true, jump: Math.sin(p * Math.PI) * .6, rail: 0 }; }
    if (lt < T.rail1) { const p = Math.pow(clamp((lt - T.rail0) / (T.rail1 - T.rail0)), 1.5), q = RAIL(p); return { x: q[0], y: q[1] - 1, rot: railRot, flip: true, jump: 0, rail: 1 }; }
    if (lt < T.land) { const p = prog(lt, T.rail1, T.land - T.rail1, lin), q = arcPos(p, [RB[0], RB[1]], [916, 596], 26); return { x: q[0], y: q[1], rot: lerp(railRot, 0, Math.min(1, p * 1.6)), flip: true, jump: .3 * Math.sin(p * Math.PI), rail: 0 }; }
    return { x: 916, y: 596, rot: 0, flip: true, jump: 0, rail: 0, table: 1 };
  };
  /* the jig beat */
  const beatPh = lt => (lt - C(3) + .2) * 2.3;
  /* brow-mop (shared by the bath gent and the stoker, so they are in perfect sync) */
  const mop = lt => { let k = 0, w = 0; [[T.m1a, T.m1b], [T.m2a, T.m2b]].forEach(([a, b]) => { const e = env(lt, a, b - .22, .22, .22); if (e > k) { k = e; w = Math.sin(clamp((lt - a - .2) / (b - a - .4)) * Math.PI * 4); } }); return { k, w }; };

  const signPos = SIGN.map(([k, x, y]) => { const n = cut.signs[k]; return { n, k, x, y }; });
  op(cut.signs.engine, 0);

  /* =====================================================================
     UPDATE
     ===================================================================== */
  /* WORKAROUND (player.js): the player rewrites the iris circle's r every frame, even when unchanged; that invalidates
     the clip-path and forces a full repaint of the whole scene on every frame. While the iris is fully open we
     detach it from this scene's group (pure function of lt; it is re-attached for the opening and closing wipes). */
  const SG0 = world.parentNode, irisUrl = SG0 && SG0.getAttribute('clip-path');
  return (lt0, at0) => {
    if (irisUrl) sa(SG0, 'clip-path', lt0 < 1 || lt0 > cue.d - .8 ? irisUrl : 'none');
    /* animated "on twos": story and character motion step at 30 fps, set dressing (smoke, fires, steam) at 15 fps.
       Frames between steps change nothing, so the browser skips repainting them. The stokehold and the split screen
       (two full sets on screen) hold their static-camera stretches on fours (15 fps). */
    const heavy = (lt0 >= T.xf1 + .5 && lt0 < T.sp0) || (lt0 >= T.sp1 + .05 && lt0 < T.wh0), Q = heavy ? 15 : 30;
    const lt = Math.floor(lt0 * Q + 1e-6) / Q, at = Math.floor(at0 * Q) / Q, aq = Math.floor(at0 * 15) / 15;
    /* ---------- which views are live ---------- */
    const inSplit = lt >= T.sp0 - .02 && lt < T.wh1 + .05;
    const showA = lt < T.xf1 + .05 || inSplit;
    const showB = (lt >= T.xf0 && lt < T.wh1 + .05);
    const showC = lt >= T.wh0;
    op(VA, showA ? 1 : 0); op(VB, showB ? (lt < T.xf1 ? prog(lt, T.xf0, T.xf1 - T.xf0) : 1) : 0); op(VC, showC ? 1 : 0); op(DIV, inSplit ? 1 : 0);
    if (inSplit) { sa(VA, 'clip-path', cpA.url); sa(VB, 'clip-path', cpB.url); } else { sa(VA, 'clip-path', 'none'); sa(VB, 'clip-path', 'none'); }
    /* whoosh up to the bridge */
    const wp = prog(lt, T.wh0, T.wh1 - T.wh0, ease);
    sa(VC, 'clip-path', lt < T.wh1 ? cpC.url : 'none'); op(seam, wp > 0 && wp < 1 ? 1 : 0); if (wp > 0 && wp < 1) tf(seam, 0, wp * 900);
    sa(SPLIT, 'transform', wp > 0 ? `translate(0,${f2(wp * 900)})` : ''); sa(VC, 'transform', lt < T.wh1 ? `translate(0,${f2((wp - 1) * 900)})` : '');
    op(whoosh, Math.sin(Math.PI * clamp((lt - T.wh0 + .05) / (T.wh1 - T.wh0 + .25))) * .9);
    if (lt > T.wh0 - .1 && lt < T.wh1 + .3) wl.forEach((r, i) => sa(r, 'y', f2(((lt * 2400 + hash(i) * 900) % 1300) - 400)));

    /* ================= A: cutaway ================= */
    if (showA) {
      let cx, cy, z;
      if (inSplit) { cx = 289; cy = 368 - 18 * (1 - prog(lt, T.sp0, .7)); z = 3.3; }
      else { [cx, cy, z] = track(lt, [
        [0, 800, 466, .86], [T.kIn - .3, 800, 466, .86], [T.kCut1, 800, 452, .95], [T.ice1, 790, 430, 1],
        [T.cherry + .12, 640, 215, 1.58], [T.lift0, 640, 215, 1.58], [T.lift1, 960, 302, 2.9],
        [T.pan0, 960, 302, 2.9], [T.pan1, 1322, 300, 2.95], [T.hop, 1322, 300, 2.95],
        [T.rail0, 1262, 322, 2.85], [T.rail1, 1010, 548, 2.7, lin], [T.land + .3, 782, 580, 3.2],
        [T.cap - .32, 905, 572, 3.9], [T.cap + .4, 905, 572, 3.9], [T.party + .55, 782, 580, 3.2], [T.rise0, 782, 580, 3.2],
        [T.rise1, 838, 300, 3.15], [T.dive0, 838, 300, 3.15], [T.dive1, 1116, 770, 3.6], [T.xf1, 1116, 790, 5.4, easeIn]]); }
      cam(camA, cx, cy, z);
      /* the wide shots repaint the whole ship, so their set dressing steps at 7.5 fps; close-ups at 15 fps */
      const aw = z < 1.3 ? Math.floor(at0 * 7.5) / 7.5 : aq;
      cut.anim(aw);
      /* cull what the lift camera cannot see (skips their per-frame updates and painting) */
      const vx0 = cx - 800 / z, vx1 = cx + 800 / z, vy0 = cy - 450 / z, vy1 = cy + 450 / z;
      const seen = (x0, y0, x1, y1) => x1 > vx0 && x0 < vx1 && y1 > vy0 && y0 < vy1;
      const opened = lt >= T.kCut0 - .05;   /* before the knife, the hull skin hides every room */
      const vF = opened && seen(0, 225, 1600, 387), vS = opened && seen(0, 387, 1600, 517), vT = opened && seen(0, 517, 1600, 647), vB = opened && seen(0, 641, 1600, 880);
      const vBath = seen(0, 225, 360, 387), vLounge = seen(690, 225, 1160, 387), vPool = seen(1150, 225, 1600, 387);
      op(RM.first, vF ? 1 : 0); op(RM.second, vS ? 1 : 0); op(RM.third, vT ? 1 : 0); op(RM.boiler, vB ? 1 : 0);
      /* focus (the current deck stays lit) */
      let fName = null, fK = 0;
      if (inSplit) { fName = 'first'; fK = .6; }
      else if (lt > T.lift1 - .2 && lt < T.hop + .1) { fName = 'first'; fK = .6 * prog(lt, T.lift1 - .2, .5) * (1 - prog(lt, T.hop - .1, .2)); }
      else if (lt >= T.land - .1 && lt < T.rise0 + .1) { fName = 'third'; fK = .6 * prog(lt, T.land - .1, .4) * (1 - prog(lt, T.rise0 - .1, .2)); }
      else if (lt >= T.rise1 - .1 && lt < T.dive0 + .1) { fName = 'first'; fK = .6 * prog(lt, T.rise1 - .1, .3) * (1 - prog(lt, T.dive0 - .1, .15)); }
      else if (lt >= T.dive1 - .3) { fName = 'boiler'; fK = .55 * prog(lt, T.dive1 - .3, .3); }
      cut.focus(fName, fK);

      /* gulls */
      gulls.forEach((g, i) => { const x = ((i * 430 + aw * (26 + i * 5)) % 2400) - 400, y = -10 + i * 38 + Math.sin(aw * .7 + i) * 14; sa(g, 'transform', `translate(${f2(x)},${f2(y)}) scale(1,${f2(.55 + .45 * Math.abs(Math.sin(aw * 6 + i * 1.3)))})`); });

      /* front sea */
      { const so = 1 - prog(lt, T.kCut0 + .3, T.kCut1 - T.kCut0); op(seaF, so);
        if (so > 0) { let d = '', d2 = ''; for (let x = -400; x <= 2000; x += 40) d += (d ? ' L' : 'M') + x + ',' + f2(648 + 5 * Math.sin(x * .025 + aw * 2) + 2 * Math.sin(x * .07 - aw * 3));
          for (let i = 0; i < 26; i++) { const x = -300 + ((i * 97 + aw * 30) % 2200), y = 690 + (i % 5) * 40; d2 += `M${f2(x)},${y} q10,-6 20,0 `; }
          seaCrest.setAttribute('d', d); seaDash.setAttribute('d', d2); tf(bowFoam, Math.sin(aw * 2) * 4, Math.sin(aw * 2.6) * 2); } }
      /* knife + skin + crumbs */
      const K = knifeAt(lt);
      op(knife, K.v); if (K.v) tf(knife, K.x, K.y, K.r, .95);
      const kx = lt < T.kCut0 ? -600 : lt < T.kCut1 ? K.x : 2400;
      sa(knifeClip.r, 'x', f2(kx)); op(skin, kx < 1700 ? 1 : 0);
      op(cutEdge, lt > T.kCut0 && lt < T.kCut1 ? .9 : 0); if (lt > T.kCut0 && lt < T.kCut1) sa(cutEdge, 'x', f2(kx - 2));
      crumbs.forEach((c, i) => { const te = T.kCut0 + (T.kCut1 - T.kCut0) * (i / 18), dt = lt - te;
        if (dt < 0 || dt > 1.1) { op(c, 0); return; }
        const x0 = knifeAt(te).x + 30, y0 = 250 + hash(i * 3.3) * 580, vx = 80 + hash(i) * 140, vy = -160 - hash(i * 2) * 160;
        op(c, 1 - dt / 1.1); tf(c, x0 + vx * dt, y0 + vy * dt + 520 * dt * dt, dt * 400 * (hash(i * 9) - .5), .9 + hash(i * 4) * .8); });
      /* plaques */
      signPos.forEach(sg => { const w = clamp((z - 1.15) / .6), right = w > .5, sw = right ? (w - .5) * 2 : 1 - w * 2, sc = right ? .95 / z : 1;
        const x = right ? cx + (1430 - 800) / z : sg.x, sy = (sg.y - cy) * z + 450;
        const shown = (kx > sg.x + 60 ? pop(lt, T.kCut0 + (T.kCut1 - T.kCut0) * clamp((sg.x + 60 - 40) / 1554), .5) : 0) * (inSplit ? 0 : 1) * clamp((sy - 110) / 50) * clamp((700 - sy) / 60) * sw;
        op(sg.n, shown); if (shown > 0) tf(sg.n, x, sg.y, 0, sc * (shown < 1 ? .6 + .4 * shown : 1)); });
      /* icing */
      [[T.ice1, 0], [T.ice2, 1], [T.ice3, 2]].forEach(([t0, i]) => { const g = ice[i], p = prog(lt, t0, .75, easeOut);
        op(g, p > 0 ? 1 : 0); if (p > 0) sa(g, 'transform', `translate(0,${g._y}) scale(1,${f2(p * (1 + .06 * Math.sin((lt - t0) * 9) * Math.exp(-(lt - t0) * 2)))}) translate(0,${-g._y})`); });
      /* cream dollop + cherry */
      const cr = pop(lt, T.cream, .4); op(cream, cr ? 1 : 0); if (cr) tf(cream, 545, 94, 0, cr);
      const chFall = prog(lt, T.cherry - .42, .42, easeIn);
      if (lt < T.cherry - .42) op(cherry, 0);
      else { op(cherry, 1); const imp = lt - T.cherry, y = imp < 0 ? lerp(-420, 48, chFall) : 48 - Math.abs(Math.sin(imp * 7)) * 22 * Math.exp(-imp * 5);
        const sq = imp >= 0 ? 1 + .3 * Math.exp(-imp * 9) * Math.cos(imp * 26) : 1; tf(cherry, 545, y + 18, swing(lt, T.cherry, 10, 9, 3), 1.05); tf(cherryIn, 0, -18 * (1 - 1 / sq) * 0, 0, sq, 2 - sq); }
      const pl = env(lt, T.cherry, T.cherry + .25, .05, .2); op(plop, pl); if (pl) tf(plop, 545, 70, 0, .8 + prog(lt, T.cherry, .3) * .5);

      /* ---------- second class ---------- */
      if (vS) {
      { const nt = env(lt, T.rise0 - .1, T.rise1 + .2, .2, .3); reader.set({ x: 860, y: 500, s: .27, at, face: nt > .3 ? 'surprise' : 'focus', look: [lerp(.4, -.5, nt), lerp(.6, -.9, nt)], hR: [56, lerp(-190, -150, nt)], hL: [-20, -190], propRotR: -8, headTilt: -6 * nt }); }
      dowager.set({ x: 214, y: 500, s: .27, at, face: 'smug', look: [.6, 0], headTilt: 6, lid: .4 });

      }
      /* ---------- first class: the Owner and the advent calendar ---------- */
      if (vLounge) {
      doors.forEach((d, i) => { let k = pop(lt, tD[i] - .06, .42); if (i === 4) k *= 1 - prog(lt, T.shut, .18, easeIn); d.set(k); });
      /* pool: water + swimmer + splash */
      { let d = ''; for (let x = 1030; x <= 1122; x += 10) d += (d ? ' L' : 'M') + x + ',' + f2(318 + 2 * Math.sin(x * .12 + at * 3)); poolW.setAttribute('d', d + ' L1122,354 L1030,354 Z');
        tf(swimmer, 1062 + Math.sin(at * .8) * 14, 320 + Math.sin(at * 3) * 1.5, 0, 1.15); }
      { const dt = lt - T.d1; op(splash, dt > 0 && dt < 1.4 ? 1 : 0);
        if (dt > 0 && dt < 1.4) { drops.forEach((e, i) => { const a = -Math.PI * (.15 + .7 * hash(i * 2.7)), v = 90 + hash(i) * 120; const x = 1070 + Math.cos(a) * v * dt * 1.2 - 40 * dt, y = 300 + Math.sin(a) * v * dt + 300 * dt * dt;
            sa(e, 'cx', f2(x)); sa(e, 'cy', f2(Math.min(y, 366))); op(e, 1 - dt / 1.4); });
          sa(sheet, 'transform', `translate(1070,312) scale(${f2(.6 + dt * 1.6)},${f2(Math.max(.01, Math.sin(clamp(dt / .6) * Math.PI) * 1.3))})`); op(sheet, dt < .6 ? .9 : 0); } }
      /* bath steam */
      puffs.forEach((g, i) => { const dt = lt - T.d2 - i * .06; if (dt < 0) { op(g, 0); return; } const ph = dt < 1.2 ? dt / 1.2 : 1 + ((dt - 1.2) * .25 + i / 6) % 1;
        const burst = dt < 1.2; const x = 941 + (burst ? (hash(i) - .5) * 70 * ph - 30 * ph : -40 + (hash(i * 3) - .5) * 60 + Math.sin(at + i) * 6), y = burst ? 268 - 40 * ph : 262 - ((ph - 1) * 40);
        op(g, burst ? .9 * Math.sin(Math.min(1, ph * 1.4) * Math.PI * .5 + .4) * (1 - ph * .4) : .22 * Math.sin((ph - 1) * Math.PI)); tf(g, x, y, 0, burst ? .5 + ph * 1.6 : .7 + (ph - 1) * .6); });
      /* camel */
      { const on = lt > T.d3 - .1, bp = on ? (lt - T.d3) * 5.5 : at * .3; const bump = Math.abs(Math.sin(bp)) * (on ? 4 : 0);
        tf(camel, 972, 341 - bump * .6, on ? Math.sin(bp) * 7 : 0, .85);
        camelRider.set({ x: 969, y: 346.5 - bump, s: .095, sit: true, at, face: on ? 'joy' : 'neutral', hL: [-30, -200 - bump * 8], hR: [60, -210 - bump * 8], tilt: on ? Math.sin(bp) * 6 : 0, headTilt: on ? Math.sin(bp + .5) * 8 : 0 }); }
      /* lifeboat stack wobble */
      { const pw = lt > T.pat - .05 && lt < T.shut ? Math.sin((lt - T.pat) * 26) * 3 * Math.exp(-(lt - T.pat) * 2) : 0; [...boatStack.children].forEach((b, i) => tf(b, 823 + pw * i * .4, 349 - i * 7.5 - Math.max(0, pw) * i * .2, pw * (i % 2 ? 1 : -1))); }
      /* squash ball */
      { const t0 = T.d4 + .08, tHit = T.d4 + .42, t2 = T.d4 + 1.0; const hit = [781, 236];
        if (lt < t0 || lt > t2) { op(ball, 0); }
        else { op(ball, 1); let x, y, px, py;
          if (lt < tHit) { const p = (lt - t0) / (tHit - t0); [x, y] = arcPos(p, [895, 292], hit, 22); [px, py] = arcPos(Math.max(0, p - .12), [895, 292], hit, 22); }
          else { const p = (lt - tHit) / (t2 - tHit); [x, y] = arcPos(p, hit, [700, 352], 34); [px, py] = arcPos(Math.max(0, p - .1), hit, [700, 352], 34); if (p > .8) y -= Math.sin((p - .8) / .2 * Math.PI) * 10; }
          sa(ballB, 'cx', f2(x)); sa(ballB, 'cy', f2(y)); ball.lastChild.setAttribute('transform', `translate(${f2(x)},${f2(y)})`); ballTrail.setAttribute('d', `M${f2(px)},${f2(py)} L${f2(x)},${f2(y)}`); }
        const pg = env(lt, tHit, tHit + .2, .03, .12); op(ping, pg); if (pg) tf(ping, hit[0], hit[1], 0, .8 + (lt - tHit) * 2); }
      const pt = env(lt, T.pat, T.pat + .45, .05, .15); op(pats, pt); if (pt) tf(pats, 823, 312 - Math.abs(Math.sin((lt - T.pat) * 14)) * 3);

      /* Owner */
      { const ox = lt < 17 ? 776 : 800, s = .3; const st = { x: ox, y: 370, s, at, talk: cue.talk(lt, 'O'), face: 'proud', look: [.15, 0], turn: .15, tilt: 0, bob: Math.sin(at * 1.6) * 1.5 };
        let hR = [74, -128], hL = null, bendR = -14, propRotL = 0;
        if (lt < 17) {
          /* reveals 1–4: a showman's fling toward each door */
          let best = 0, bi = -1; for (let i = 0; i < 4; i++) { const w = prog(lt, tD[i] - .16, .16, easeOut) * (1 - prog(lt, (i < 3 ? tD[i + 1] : T.d5) - .2, .2)); if (w > best) { best = w; bi = i; } }
          if (bi >= 0) { const d = doors[bi], tx = (d.cx - ox) / s, ty = (d.cy - 370) / s, sh = [62, -232], dx = tx - sh[0], dy = ty - sh[1], L = Math.hypot(dx, dy);
            const ext = 118 + 14 * Math.exp(-(lt - tD[bi]) * 8) * (lt > tD[bi] ? 1 : 0);
            hR = mixP(hR, [sh[0] + dx / L * ext, sh[1] + dy / L * ext], best); bendR = lerp(-14, -4, best);
            st.look = [lerp(.15, .9, best), lerp(0, clamp(dy / L * 1.4, -.8, .6), best)]; st.turn = lerp(.15, .45, best); st.tilt = 3 * best; st.face = lt > tD[bi] && lt < tD[bi] + .4 ? 'joy' : 'proud'; }
          /* squash ball off the hat */
          const tHit = T.d4 + .42; if (lt > tHit && lt < tHit + 1) { st.headTilt = swing(lt, tHit, 13, 20, 4); st.hy = -6 * Math.exp(-(lt - tHit) * 8); if (lt < tHit + .4) st.face = 'surprise'; }
          /* door 5: the lifeboat cupboard */
          const w5 = prog(lt, T.d5 - .2, .25) * (1 - prog(lt, T.shut + .15, .3));
          if (w5 > 0) { const tilt = 15 * w5; st.tilt = tilt; st.look = [.8, .7]; st.turn = .4;
            const tgt = lt < T.pat - .1 ? [(846 - ox) / s, (330 - 370) / s] : lt < T.shut - .12 ? [(818 - ox) / s, (318 - 370) / s - Math.abs(Math.sin((lt - T.pat) * 14)) * 10] : [(848 - ox) / s - 6 * prog(lt, T.shut - .12, .12), (334 - 370) / s];
            hR = mixP(hR, torsoPt(tgt[0], tgt[1], tilt, st.bob), w5); bendR = -24; st.face = lt > T.pat ? 'joy' : 'proud'; }
        } else {
          /* line 4: hears the party, hooks the carpet corner with his cane, faceful, slams it */
          st.turn = -.1; st.look = [0, 0];
          if (lt > T.rise1 - .4 && lt < T.hook) { st.face = 'think'; st.look = [-.5, .8]; const k = env(lt, C(4) - .1, T.hook - .15, .25, .2); hR = mixP(hR, [44, -298], k); bendR = -40; st.headTilt = 8 * k; }
          const kh = prog(lt, T.hook - .15, .3) * (1 - prog(lt, T.slam - .02, .08, easeIn)), kl = prog(lt, T.lift - .05, .25);
          hL = mixP([-74, -128], mixP([-74, -128], [-86, -200], kl), kh); propRotL = lerp(0, 12 * kl, kh);
          if (lt > T.hook - .15 && lt < T.burst) { st.face = 'think'; st.look = [-.6, .7]; st.turn = -.3; }
          if (lt >= T.burst && lt < T.slam + .1) { st.face = 'scared'; st.headTilt = -10 * prog(lt, T.burst, .08); st.hy = -8 * prog(lt, T.burst, .08); hR = mixP(hR, [40, -270], prog(lt, T.burst, .12)); bendR = -50; st.look = [-.2, .3]; }
          if (lt >= T.slam + .1) { st.face = 'worried'; st.blush = .6 * prog(lt, T.slam, .3); st.look = [.1, -.1]; st.headTilt = -3; }
          if (lt >= T.slam - .02 && lt < T.slam + .3) st.bob += 6 * Math.exp(-(lt - T.slam) * 12);
        }
        st.hR = hR; st.bendR = bendR; if (hL) { st.hL = hL; st.propRotL = propRotL; }
        owner.set(st); op(stuck, lt > T.burst + .12 && lt > 17 ? 1 : 0);
        /* rug: hinged at its left end; the cane tip lifts the right end */
        const ang = lt < 17 ? 0 : -34 * prog(lt, T.lift - .05, .25) * (1 - prog(lt, T.slam - .02, .08, easeIn));
        tf(rug, 728, 369, ang); op(rugGlow, clamp(-ang / 20)); op(rugCone, clamp(-ang / 30) * (lt > T.burst - .05 ? 1 : .35)); }
      /* confetti faceful + accordion wheeze */
      confFace.forEach((c, i) => { const dt = lt - T.burst - i * .015; if (dt < 0 || dt > 2.2 || lt < 17) { op(c, 0); return; }
        const a = -Math.PI / 2 + (hash(i * 3.1) - .2) * 1.1, v = 180 + hash(i) * 160, tt = Math.min(dt, .35);
        const x = 770 + Math.cos(a) * v * tt + (dt > .35 ? Math.sin((dt - .35) * 5 + i) * 6 : 0), y = 362 + Math.sin(a) * v * tt + (dt > .35 ? (dt - .35) * 34 : 0);
        op(c, 1 - prog(dt, 1.6, .6)); tf(c, x, Math.min(y, 368), dt * 300 * (hash(i * 7) - .5), 1, Math.abs(Math.cos(dt * 9 + i))); });
      { const wv = env(lt, T.burst, T.slam, .05, .05); op(waves4, wv); if (wv) tf(waves4, 762, 352 - (lt - T.burst) * 10, 0, 1 + (lt - T.burst) * 1.5); }

      }
      /* the Lady, the stewards, Mitzi */
      if (vPool) { const sunk = prog(lt, T.sink, .3, easeOut), sit = lt >= T.sink + .12, talkP = cue.talk(lt, 'P');
        const st = { x: 1318, y: 370, s: .3, at, talk: talkP, face: lt < C(2) ? 'neutral' : 'smug', look: lt < T.pan1 ? [-.8, 0] : lt > T.hop ? [-.9, .5] : [-.2, -.1], turn: lt < T.pan1 ? -.35 : lt > T.hop ? -.3 : -.1, fan: lt > T.fanA ? .2 : .6, lid: .35 };
        if (sit) { st.sit = true; st.tilt = -7 * sunk; st.lid = .5; st.headTilt = -6; st.face = 'proud'; st.hL = [-62, -150]; }
        else st.bob = 22 * prog(lt, T.sink, .12, easeIn);
        lady.set(st);
        const fA = lt > T.fanA ? Math.sin((lt - T.fanA) * 9) : 0, fB = lt > T.fanB ? Math.sin((lt - T.fanA) * 9) : 0;
        const upA = prog(lt, T.fanA - .25, .25), upB = prog(lt, T.fanB - .25, .25);
        stewA.set({ x: 1262, y: 370, s: .3, at, face: 'neutral', look: [.6, -.2], turn: .2, hR: mixP([62, -160], [62 + fA * 8, -262], upA), bendR: -30, propRotR: lerp(0, 34 + fA * 22, upA), bob: Math.sin(at * 1.4) });
        stewB.set({ x: 1432, y: 370, s: .3, at, face: 'neutral', look: [-.6, .2], turn: -.2, hL: mixP([-62, -160], [-62 + fB * 8, -250], upB), bendL: 30, propRotL: lerp(0, -40 + fB * 22, upB), bob: Math.sin(at * 1.4 + 1) }); }
      { const M = mitziAt(lt); const party = lt > T.land, beat = beatPh(lt);
        let jump = M.jump, face = 'happy', rot = M.rot, x = M.x, y = M.y;
        if (lt < T.hop) { face = lt > T.fanB ? 'smug' : 'happy'; rot = lt > T.fanB ? -4 + Math.sin(lt * 9) * 2 : 0; }
        if (party) { const lnd = lt - T.land; jump = lnd < .4 ? .35 * Math.abs(Math.sin(lnd * 8)) * Math.exp(-lnd * 4) : (lt > T.cap + .3 ? .45 * Math.max(0, Math.sin(Math.PI * beat)) : 0); face = lt > T.cap && lt < T.cap + .7 ? 'smug' : 'happy'; if (lt > T.cap + .05 && lt < T.cap + .45) jump = .5 * Math.sin((lt - T.cap - .05) / .4 * Math.PI); }
        mitzi.set({ x, y, s: kx > 1395 ? .32 : 0, rot, flip: M.flip, at, face, jump, wag: party ? .9 : .5 });
        op(speed, M.rail ? 1 : 0); if (M.rail) tf(speed, x, y, rot, .32 * 1, .32);
        cap.set({ s: lt > T.cap ? 1 : 0, x: 0, y: 0, rot: lt > T.cap ? swing(lt, T.cap, 10, 14, 4) : 0 }); }

      /* ---------- the third-class party ---------- */
      if (vT) { const beat = beatPh(lt), live = lt > T.land - .6 && lt < T.dive1, onB = Math.max(0, Math.sin(Math.PI * beat)), alt = Math.floor(beat) % 2;
        tf(bulb, 806, 517, (live ? 22 : 6) * Math.sin(Math.PI * beat * .5));
        fiddler.set({ x: 600, y: 604, s: .27, at, play: 1, face: 'joy', bob: -onB * 6, fL: alt ? [-22, -8 * onB] : [-22, 0], fR: alt ? [22, 0] : [22, -8 * onB], headTilt: 6 + Math.sin(Math.PI * beat) * 4 });
        const sq = .5 + .5 * Math.sin(Math.PI * beat);
        accord.set({ x: 740, y: 630, s: .27, at, face: 'joy', hL: [-46 - sq * 22, -160], hR: [46 + sq * 22, -160], bendL: 20, bendR: -20, bob: -onB * 3, headTilt: Math.sin(Math.PI * beat) * 6 });
        tf(accL, -46 - sq * 22, 0); tf(accR, 46 + sq * 22, 0);
        { let d = '', x0 = -36 - sq * 22, x1 = 36 + sq * 22, n = 10; d = `M${f2(x0)},-28`; for (let i = 1; i <= n; i++) d += ` L${f2(lerp(x0, x1, (i - .5) / n))},${i % 2 ? -20 : -28}`; d += ` L${f2(x1)},-28 V28`; for (let i = n; i >= 1; i--) d += ` L${f2(lerp(x0, x1, (i - .5) / n))},${i % 2 ? 20 : 28}`; d += ` L${f2(x0)},28 Z`;
          for (let i = 1; i < n; i++) { const x = f2(lerp(x0, x1, i / n)); d += ` M${x},-24 V24`; } bell.setAttribute('d', d); }
        sa(acc, 'transform', 'translate(0,-160)');
        /* the cap hand-over */
                const head = [916 + 30 * .32 * -1, 596 - 70 * .32], pc = [(head[0] - 942) / .27, (head[1] - 630) / .27];
        const cTilt = -12 * env(lt, T.cap - .45, T.cap + .2, .25, .3), place = torsoPt(pc[0] - 4, pc[1] - 26, cTilt);
        const hand = keyed(lt, [[T.capOut - .35, [-58, -128]], [T.capOut, [-30, -176]], [T.capOut + .22, [-66, -318]], [T.cap - .38, [-60, -312]], [T.cap - .03, place], [T.cap + .28, [place[0] + 20, place[1] - 60]], [T.cap + .6, [-58, -128]]]);
        capMan.set({ x: 942, y: 630, s: .27, at, face: lt > T.cap ? 'joy' : lt > T.capOut ? 'proud' : 'happy', look: lt > T.capOut && lt < T.cap - .3 ? [-.3, -.6] : [-.7, .5], turn: -.3, tilt: cTilt, hL: hand, bendL: 30, bob: lt > T.cap + .5 ? -onB * 4 : 0 });
        handCap.set({ s: lt > T.capOut && lt < T.cap ? 1.35 : 0, x: 0, y: -12, rot: -10 });
        const cs = env(lt, T.cap - .02, T.cap + .5, .06, .3); op(capSpark, cs); if (cs) tf(capSpark, 906, 566, (lt - T.cap) * 90, .6 + (lt - T.cap) * 1.2);
        /* dancers */
        dancers.forEach((p, i) => { const b = beat + i * .5, on = Math.max(0, Math.sin(Math.PI * b)), a2 = Math.floor(b) % 2, x = [642, 560, 684][i];
          p.set({ x: x + Math.sin(Math.PI * b * .25) * 8, y: 630, s: .27, at, face: 'joy', bob: -on * 12, fL: a2 ? [-28, -26 * on] : [-18, 0], fR: a2 ? [18, 0] : [28, -26 * on], hL: [-46, -150 + (i === 2 ? -on * 40 : 0)], hR: [46, -150], bendL: 30, bendR: -30, headTilt: (a2 ? 6 : -6) * on, tilt: (a2 ? 4 : -4) * on }); });
        bowls.forEach((bw, i) => { const b = beat + (i % 2) * .5, on = Math.max(0, Math.sin(Math.PI * b)) * (live ? 1 : 0); tf(bw.g, bw.x, 596 - on * 7, (i % 2 ? 1 : -1) * on * 8); op(bw.dr, on > .6 ? 1 : 0); sa(bw.dr, 'cy', f2(-10 - on * 6)); });
        conf3.forEach((c, i) => { const ph = ((lt - C(3)) * (.35 + hash(i) * .25) + hash(i * 3)) % 1, x = 520 + hash(i * 7) * 500 + Math.sin(lt * 2 + i) * 8, y = 520 + ph * 110;
          op(c, live && lt > T.land ? .9 : 0); tf(c, x, y, lt * 200 * (hash(i * 5) - .5), 1, Math.abs(Math.cos(lt * 7 + i))); }); }
      /* music notes: from the party, up through the decks, around the Owner, out of the carpet */
      notes.forEach((n, i) => { let x, y, o = 0, s = 1.1;
        if (lt > T.land && lt < T.rise0) { const ph = ((lt - T.land) * .55 + i / 9) % 1, src = i % 2 ? [600, 560] : [740, 572]; x = src[0] + Math.sin(ph * 9 + i) * 10 + ph * 30; y = src[1] - ph * 60; o = Math.sin(ph * Math.PI) * .9; }
        else if (lt >= T.rise0 && lt < T.hook) { const p = prog(lt, T.rise0 - .05 + i * .03, .62, easeOut); x = lerp(700 + i * 12, 760 + (i % 3) * 24, p) + Math.sin(lt * 5 + i) * 8; y = lerp(560, 300 + (i % 4) * 16, p) + Math.sin(lt * 4 + i * 2) * 5; o = .95 * (1 - prog(lt, T.hook - .3, .3)); }
        else if (lt >= T.burst && lt < T.slam + .6) { const dt = lt - T.burst; x = 764 + (hash(i * 4) - .5) * 70 * Math.min(1, dt * 3) + Math.sin(dt * 6 + i) * 5; y = 360 - (40 + hash(i) * 70) * Math.min(1, dt * 2.5); o = 1 - prog(lt, T.slam + .2, .4); s = 1.3; }
        op(n, o); if (o > 0) tf(n, x, y, Math.sin(lt * 4 + i) * 14, s * .8); });

      /* ---------- the gentleman in the Turkish bath (split screen) ---------- */
      if (vBath) { const M = mop(lt), happy = lt > T.sigh;
        gent.set({ x: 252, y: 370, s: .3, sit: true, at, face: 'happy', lid: .78, look: [0, -.2], headTilt: (happy ? -8 : 0) + Math.sin(at * .9) * 2,
          bob: (happy ? -5 * Math.sin(clamp((lt - T.sigh) / .7) * Math.PI) : 0), hL: mixP([-56, -150], [-8 + M.w * 22, -330], M.k), bendL: 30, hR: [60, -150], rotL: M.k * 30 });
        op(gentCloth, 1);
        const sg = env(lt, T.sigh + .1, T.sigh + .8, .1, .3); op(sigh, sg); if (sg) tf(sigh, 256 + (lt - T.sigh) * 30, 286 - (lt - T.sigh) * 14, 0, .8 + (lt - T.sigh));
        steamB.forEach((g, i) => { const ph = (aq * .12 + i / 5) % 1; op(g, .3 * Math.sin(ph * Math.PI)); tf(g, 60 + i * 64 + Math.sin(at * .5 + i) * 12, 368 - ph * 130, 0, .8 + ph * 1.4); });
        steamF.forEach((g, i) => { const ph = (aq * .1 + i / 3 + .2) % 1; op(g, .22 * Math.sin(ph * Math.PI)); tf(g, [150, 330, 300][i] + Math.sin(at * .4 + i) * 10, 372 - ph * 110, 0, .9 + ph); }); }

      /* cutaway stokers */
      if (vB) cStk.forEach((p, i) => p.set({ x: [808, 1116][i], y: 855, s: .42, flip: true, at, shovel: at * .8 + i * .5, face: 'focus', sweat: .6, rim: .6, lite: true }));
    }

    /* ================= B: stokehold ================= */
    if (showB) {
      boil.anim(Math.floor(at0 * 7.5) / 7.5);
      let bx, by, bz;
      if (lt < T.sp0) [bx, by, bz] = track(lt, [[T.xf0, 800, 470, .9], [T.xf1 + .5, 800, 450, 1.0, easeOut]]);
      else [bx, by, bz] = track(lt, [[T.sp0, 800, 450, 1.0], [T.sp1, 690, 317, .9]]);
      cam(camB, bx, by, bz);
      const hp = prog(lt, T.heat - .2, .5);
      boil.setHeat(1 + .5 * hp); boil.setGauge(.6 + .35 * hp + Math.sin(at * 9) * .02 * hp);
      const ph = (lt - C(5)) * .85 + .15, fp = ((ph % 1) + 1) % 1;
      const dk = prog(fp, .42, .1) * (1 - prog(fp, .82, .12));
      BA.stokerDoor.forEach((di, i) => boil.setDoor(di, (inSplit && i === 1) ? 0 : dk));
      stk.forEach((p, i) => { const fl = stFlip[i], [x, y] = BA.stokers[i];
        const st = { x, y, s: 1, flip: fl, at, shovel: ph, face: lt > T.heat ? 'worried' : 'focus', sweat: .5 + .5 * hp, rim: .85, rimSide: fl ? 1 : -1 };
        if (inSplit && i === 1) { const M = mop(lt); delete st.shovel; st.face = 'worried'; st.sweat = 1; st.look = [0, -.2]; st.lid = .3;
          st.hL = mixP([-80, -150], [-8 + M.w * 22 * (fl ? -1 : 1), -330], M.k); st.bendL = 30; st.rotL = M.k * 30; st.headTilt = -4; }
        p.set(st); });
      op(rag, inSplit ? 1 : 0);
      /* meter */
      const cnt = 600 * prog(lt, T.cnt0, T.cnt1 - T.cnt0, t => 1 - Math.pow(1 - t, 2.2));
      const pos = [Math.floor(cnt / 100) % 10 + Math.max(0, cnt % 100 - 99), Math.floor(cnt / 10) % 10 + Math.max(0, cnt % 10 - 9), cnt % 10];
      digits.forEach((dg, i) => sa(dg.col, 'transform', `translate(0,${f2(-pos[i] * 86)})`));
      const dn = env(lt, T.cnt1, T.cnt1 + .5, .02, .4); op(mFlash, dn * .45); op(dingL, dn); tf(dingL, 800, 112, 0, 1 + (lt - T.cnt1) * .6);
      tf(mBell, 800, 118, swing(lt, T.cnt1, 22, 18, 2.5)); op(dayLbl, pop(lt, T.day, .4)); if (lt > T.day) tf(dayLbl, 0, 0, 0, 1);
      const lvl = .3 + .15 * prog(lt, T.cnt0, 2) + .55 * prog(lt, T.heat - .25, .7, easeOut); sa(merc, 'y', f2(440 - lvl * 290)); sa(merc, 'height', f2(lvl * 290 + 14));
      const tp = env(lt, T.heat + .4, Ce(5) + .4, .1, .3); op(thermoPop, tp * .9); if (tp) tf(thermoPop, 0, -(lt - T.heat) * 20, 0, 1);
      shimmer.forEach((pth, i) => { const o = .25 * hp * (lt < T.sp0 ? 1 : 0); op(pth, o); if (o > .01) { const x = 150 + i * 260, y0 = 700, ph2 = aq * 3 + i; let d = `M${x},${y0}`; for (let k = 1; k <= 6; k++) d += ` Q${f2(x + Math.sin(ph2 + k) * 14)},${y0 - k * 70 + 35} ${x},${y0 - k * 70}`; pth.setAttribute('d', d); } });
    }

    /* ================= split-screen chrome ================= */
    if (inSplit) {
      const h = 452 * prog(lt, T.sp0, T.sp1 - T.sp0, easeOut);
      sa(cpA.r, 'height', f2(Math.max(0, h - 2))); sa(cpB.r, 'y', f2(h)); sa(cpB.r, 'height', f2(900 - h));
      tf(divB, 0, h);
      const s1 = pop(lt, T.sign1, .5), s2 = pop(lt, T.bath, .5); op(signStoke, s1); op(signBath, s2);
      if (s1) tf(signStoke, 470, h + 22, 0, s1); if (s2) tf(signBath, 560, 24, 0, s2);
      const t1 = pop(lt, T.tagX, .5), t2 = pop(lt, T.tagN, .5); op(tagX, t1); op(tagN, t2);
      if (t1) tf(tagX, 1170, 132, swing(lt, T.tagX, 10, 5, 1.2) + Math.sin(at * 1.3) * 2, t1);
      if (t2) tf(tagN, 1100, h + 40, swing(lt, T.tagN, 10, 5, 1.2) + Math.sin(at * 1.1) * 2, t2);
    }

    /* ================= C: the bridge ================= */
    if (showC) {
      br.anim(aq);
      const [cx, cy, z] = [900, 466, 1.05];
      cam(camC, cx, cy, z);
      br.setWheel(26 * Math.sin((lt - T.wh1) * 1.1) + 6 * Math.sin(at * 2.3));
      /* hatch: creak open, arm + shovel up, down, CLANG */
      const open = lt < T.clang - .12 ? 72 * prog(lt, T.hOpen, .4, easeOut) * (1 + .05 * Math.sin(lt * 30) * env(lt, T.hOpen, T.hOpen + .4, .05, .1)) : 72 * (1 - prog(lt, T.clang - .12, .12, easeIn));
      const th = open * Math.PI / 180, fy = HY0 + (HY1 - HY0) * Math.cos(th) - 92 * Math.sin(th), wx = 4 * Math.sin(th);
      lid.setAttribute('d', `M${HX - 54},${HY0} L${HX + 54},${HY0} L${f2(HX + 60 + wx)},${f2(fy)} L${f2(HX - 60 - wx)},${f2(fy)} Z`);
      lid.setAttribute('fill', open > 8 ? '#5E3E28' : '#7A5236');
      lidPl.setAttribute('d', `M${HX - 18},${HY0} L${f2(HX - 20)},${f2(fy)} M${HX + 18},${HY0} L${f2(HX + 20)},${f2(fy)}`);
      tf(lidRing, HX, (HY0 + fy) / 2 + 2, 0, 1, Math.max(.2, Math.abs(Math.cos(th))));
      op(hole, open > 2 ? 1 : 0); op(holeGlow, .5 + .3 * wob(at * 4, 2));
      const rise = prog(lt, T.hRise, .35, easeOut) * (1 - prog(lt, T.hDown, .28, easeIn));
      op(armG, rise > .01 ? 1 : 0); if (rise > .01) tf(arm, HX - 4, HY1 + 160 - rise * 300 + (lt > T.hRise + .35 && lt < T.hDown ? Math.sin((lt - T.hRise) * 7) * 3 : 0), Math.sin(lt * 3) * 2);
      fumes.forEach((g, i) => { const ph = ((lt - T.hOpen) * .9 + i / 3) % 1, o = open > 20 ? .5 * Math.sin(ph * Math.PI) : 0; op(g, o); if (o > 0) tf(g, HX - 30 + i * 30 + Math.sin(lt * 2 + i) * 8, HY0 - ph * 160, 0, .6 + ph); });
      const cl = env(lt, T.clang, T.clang + .75, .04, .35); op(clangG, cl); if (cl) tf(clangG, HX - 40, HY0 - 40, 0, .7 + .3 * pop(lt, T.clang, .3));
      soot.forEach((e, i) => { const dt = lt - T.clang; if (dt < 0 || dt > 1.4) { op(e, 0); return; } const a = Math.PI * (i / 4), x = HX + Math.cos(a) * -70 * Math.min(1, dt * 2.5), y = HY1 - 8 - Math.sin(a) * 30 * dt - dt * 30; op(e, .55 * (1 - dt / 1.4)); tf(e, x, y, 0, .6 + dt * 1.2); });
      /* Captain: leaning on the binnacle, arms folded, smug */
      const jolt = lt > T.clang ? Math.exp(-(lt - T.clang) * 7) : 0, glance = env(lt, T.clang + .05, T.clang + 1.1, .12, .35);
      captain.set({ x: 900, y: 805, s: 1, at, talk: cue.talk(lt, 'C'), face: lt > T.clang && lt < T.clang + .45 ? 'surprise' : 'smug', lid: lt > T.clang && lt < T.clang + .45 ? 0 : .55,
        look: [lerp(-.2, .9, glance), lerp(-.1, .5, glance)], turn: .25 * glance, tilt: -6 + 2 * jolt, headTilt: -4 + Math.sin(at * .8) * 2 + (lt > C(7) + .25 && lt < C(7) + .7 ? 4 * Math.sin((lt - C(7) - .25) * 7) : 0),
        hy: -6 * jolt, hL: [34, -176], hR: [-30, -166], bendL: -40, bendR: 40, fL: [-6, 0], fR: [26, 0], rim: 0, bob: Math.sin(at * 1.4) * 1.5 });
    }

    /* ================= HUD: postcards ================= */
    [[pc1, T.pc1, [-260, 420], [600, 430], [1900, 250]], [pc2, T.pc2, [-260, 640], [1010, 540], [1900, 430]]].forEach(([pc, t0, a, m, b]) => {
      const t = lt - t0; if (t < 0 || t > 2.9) { op(pc.g, 0); return; } op(pc.g, 1);
      let x, y; if (t < .8) { const p = easeOut(t / .8); x = lerp(a[0], m[0], p); y = lerp(a[1], m[1], p) - Math.sin(p * Math.PI) * 60; }
      else if (t < 1.85) { x = m[0] + (t - .8) * 30; y = m[1] + Math.sin((t - .8) * 4) * 8; }
      else { const p = easeIn((t - 1.85) / 1.05); x = lerp(m[0] + 31, b[0], p); y = lerp(m[1], b[1], p) - Math.sin(p * Math.PI) * 50; }
      tf(pc.g, x, y, Math.sin(t * 3.2 + t0) * 9 + (t < .8 ? (1 - t / .8) * -30 : 0) + (t > 1.85 ? (t - 1.85) * 40 : 0));
      sa(pc.inner, 'transform', `scale(${f2(.82 + .18 * Math.abs(Math.cos(t * 2.6)))},1) skewY(${f2(Math.sin(t * 2.6) * 6)})`); });
  };
}});
