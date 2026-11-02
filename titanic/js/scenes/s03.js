"use strict";
/* =====================================================================
   SCENE 3 — "Iceberg, right ahead!"  (lt ranges for the current timing;
   every boundary is anchored to cue(j) in the code)
   A  0.0– 8.0  [L0] EXTERIOR, mirror sea: the Titanic glides through a
                starfield above and below; shooting star + its reflection
                ("stargazing", 4.9); far ahead a dark berg opens two eyes
                ("hopeless for spotting ice", 6.5–7.7); push-in on the crow's nest.
   B  8.0–11.9  [L1] CROW'S NEST: frosty lookouts squint into the dark; Fleet
                rattles the BINOCULARS locker (9.3–10.1), the padlock smirks,
                deadpan shrug on "the key" (10.9).
   C 11.9–17.0  [L2] FLASHBACK bubble (sepia Southampton quay, daylight): the
                officer with his kitbag waves goodbye from dry land, push-in on
                the key glinting on his watch chain (13.7–14.9), the ship sails
                off without him; Fleet's deadpan look (15.6).
   D 17.0–21.0  [L3] THE ICEBERG close-up: the tip winks ("Evening.", 17.3),
                camera dips under the surface (18.7–19.9): the vast smug body
                with folded arms, a "90%" bracket.
   E 21.0–22.9  [L4] CROW'S NEST: three hard bell strokes (21.0/21.4/21.7) blow
                the frost off both lookouts, Lee points, Fleet grabs the phone.
   F 22.9–28.3  [L5] BRIDGE: phone rings, polite "Thank you." (23.5), neat
                hang-up, cap straightened, then enormous eyes (24.8); whip to
                the window [L6]: dive for the wheel, the quartermaster spins it
                like a roulette wheel (25.5–26.4), both heave; the berg in the
                window creeps sideways while a snail in a bowler hat (the
                committee) overtakes it along the sill (25.4–28.3).
   G 28.3–39.1  [L6 end, L7, L8] EXTERIOR cross-section: rudder turning
                agonisingly slowly, bow squashing round; clock 11:40 pm /
                14 April (29.1–31.9); the bow slides past the berg's nose, the
                berg sucks in and gets a halo ("missed", 32–33.9); "Mostly." →
                underwater scrape, sparks of ice, rivets popping like corks, ice
                on the forward deck, paint gash (34.0–35.6); dip underwater
                [L8]: "Ooh." finds a stripe of the ship's paint, polishes it off
                with one fingertip (36.2–37.4), refolds its arms, smug.
   ===================================================================== */
SCENE(3, { build(world, cue) {
  const c = cue, ce = cue.e, DUR = cue.d;
  /* shot boundaries */
  const SA = c(1) - .45, SB = c(2) - .12, SC = c(3) - .32, SD = c(4) - .22, SE = c(5) - .62, SF = c(6) + 3.45;

  /* ---------------- helpers ---------------- */
  const lin = t => t;
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  /* keyed values with per-key easing: [[t, a, b, c, (ease)], ...] */
  const kv = (t, K) => {
    const num = k => k.slice(1).filter(v => typeof v === 'number');
    if (t <= K[0][0]) return num(K[0]);
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
      const a = K[i - 1], b = K[i], f = typeof b[b.length - 1] === 'function' ? b[b.length - 1] : ease;
      const p = f(clamp((t - a[0]) / Math.max(.001, b[0] - a[0]))), A = num(a), B = num(b);
      return A.map((v, j) => lerp(v, B[j], p));
    }
    return num(K[K.length - 1]);
  };
  const k1 = (t, K) => kv(t, K)[0];
  const setCam = (g, v, dx = 0, dy = 0) => g.setAttribute('transform', `translate(${f2(800 + dx)},${f2(450 + dy)}) scale(${f2(v[2] * 1000) / 1000}) translate(${f2(-v[0])},${f2(-v[1])})`);
  /* damped camera shake after each time in T */
  const shake = (t, T, amp, d = .3) => { let x = 0, y = 0; T.forEach((t0, i) => { const a = t - t0; if (a < 0 || a > d * 3) return; const k = amp * Math.exp(-a / d * 2.2); x += Math.sin(a * 71 + i * 3) * k; y += Math.cos(a * 57 + i) * k * .8; }); return [x, y]; };
  const star4 = (p, r, fill, o = .95) => E('path', { d: `M0,${-r} Q${r * .16},${-r * .16} ${r},0 Q${r * .16},${r * .16} 0,${r} Q${-r * .16},${r * .16} ${-r},0 Q${-r * .16},${-r * .16} 0,${-r} Z`, fill, 'fill-opacity': o }, p);
  const dots = (pts) => pts.map(([x, y, r]) => `M${f2(x - r)},${f2(y)}a${f2(r)},${f2(r)} 0 1,0 ${f2(2 * r)},0a${f2(r)},${f2(r)} 0 1,0 ${f2(-2 * r)},0`).join('');
  /* hand target (torso frame) for a person at (x,y,s) reaching world point (wx,wy) */
  const reach = (x, y, s, wx, wy) => [(wx - x) / s, (wy - y) / s];
  const mixP = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
  const MOON = '#A8C6FF';

  /* =====================================================================
     EXTERIOR WORLD (shots A, D, G): night sky, mirror sea, the Titanic, the
     berg; below WL an underwater cross-section for D and G
     ===================================================================== */
  const HZ = 480, WL = 660;
  const ext = G(world), extCam = G(ext);
  const sky = Sky(extCam, { mood: 'night', y: HZ, x0: -1000, w: 3600, y0: -900, shootEvery: 1e6 });
  const seaWrap = G(extCam);
  const sea = Sea(seaWrap, { mood: 'night', calm: true, rows: 4, y: HZ, x0: -1000, w: 3600, y1: 1500, skyTop: -900 });
  /* in the cross-section shots nothing below WL may be rasterised behind the opaque water */
  const clipWL = clipRect(-1400, -1400, 4400, 1400 + WL + 3);
  /* our own shooting star (and its reflection in the glass sea) */
  const shoot = G(extCam);
  const shootA = E('path', { stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }, shoot);
  const shootA2 = E('path', { stroke: '#BFD0FF', 'stroke-width': 9, 'stroke-opacity': .22, 'stroke-linecap': 'round', fill: 'none' }, shoot);
  const shootB = E('path', { stroke: '#DCE6FF', 'stroke-width': 2.4, 'stroke-opacity': .55, 'stroke-linecap': 'round', fill: 'none' }, shoot);
  const shootH = G(shoot); star4(shootH, 13, '#FFFFFF'); E('circle', { r: 4, fill: '#FFFFFF' }, shootH);
  const shootHB = G(shoot); star4(shootHB, 9, '#DCE6FF', .5);
  const shipWrap = G(extCam);
  const ship = Titanic(shipWrap, { mood: 'night', calm: true });

  /* ---- underwater cross-section (below WL) ---- */
  const uw = G(extCam);
  E('rect', { x: -1000, y: WL, width: 3600, height: 1500, fill: lgrad([[0, '#163A70'], [.04, '#0E2A55'], [.3, '#08193A'], [1, '#020611']]) }, uw);
  const rays = G(uw);
  [[-200, 160], [250, 120], [700, 200], [1180, 140], [1650, 180], [2100, 130]].forEach(([x, w], i) => E('path', { d: `M${x},${WL} L${x + w},${WL} L${x + w + 260},${WL + 700} L${x + 120},${WL + 700} Z`, fill: lgrad([[0, '#8FB4F0', .13], [1, '#8FB4F0', 0]]) }, rays));
  const plank = [0, 1].map(k => { const P = []; for (let i = 0; i < 70; i++) P.push([-600 + hash(i * 3.1 + k * 17) * 2800, WL + 20 + hash(i * 5.3 + k * 9) * 900, .8 + hash(i * 2.2 + k) * 1.4]); return E('path', { d: dots(P), fill: '#BFD8FF', 'fill-opacity': k ? .25 : .4 }, uw); });
  /* fish (behind the berg) */
  const fishMake = (p, col) => { const g = G(p); E('path', { d: 'M-26,0 Q-6,-15 18,-3 Q26,0 18,3 Q-6,15 -26,0 Z', fill: col }, g); E('path', { d: 'M-24,0 L-40,-11 L-36,0 L-40,11 Z', fill: shade(col, -.2) }, g); E('circle', { cx: 11, cy: -2.5, r: 2.6, fill: '#FFFFFF' }, g); E('circle', { cx: 11.6, cy: -2.5, r: 1.3, fill: '#101828' }, g); E('path', { d: 'M-4,-6 Q2,0 -4,6', stroke: shade(col, -.25), 'stroke-width': 1.6, fill: 'none' }, g); return g; };
  const fishes = [['#E8A24A', 980, 1.1, 1], ['#7FC8C0', 860, .8, -1], ['#D96B6B', 1060, .9, 1]].map(([col, y, s, dir], i) => ({ g: fishMake(uw, col), y, s, dir, i }));
  /* the Titanic below the waterline: drawn in ship-local coords (same transform as the ship) */
  const uwHull = G(uw);
  const hullUW = 'M-656,0 L701,0 L701,8 Q697,52 660,60 L-600,60 Q-644,58 -652,26 Z';
  E('path', { d: hullUW, fill: '#6E2128' }, uwHull);
  E('rect', { x: -656, y: 0, width: 1357, height: 5, fill: '#1E2029' }, uwHull);
  { let d = ''; for (let x = -616; x < 690; x += 44) d += `M${x},5 V${x > 640 ? 40 : 60} `; E('path', { d, stroke: '#000', 'stroke-opacity': .2, 'stroke-width': 1.4 }, uwHull); }
  E('path', { d: 'M-460,44 L470,44', stroke: '#4A141C', 'stroke-width': 3 }, uwHull);
  const props = [[-648, 26, 21], [-604, 38, 25]].map(([x, y, r]) => { const g = G(uwHull); tf(g, x, y);
    const b = G(g); E('ellipse', { cx: 0, cy: -r * .62, rx: r * .3, ry: r * .62, fill: '#B08A48' }, b); E('ellipse', { cx: 0, cy: r * .62, rx: r * .3, ry: r * .62, fill: '#8C6A34' }, b);
    E('circle', { r: r * .26, fill: '#5A4224' }, g); return b; });
  const rudder = G(uwHull);
  E('path', { d: 'M0,-9 L-23,-11 Q-30,14 -26,52 L-1,55 Z', fill: '#7A1F26', stroke: '#3A1016', 'stroke-width': 2 }, rudder);
  E('path', { d: 'M-4,-6 L-4,50', stroke: '#C9A45A', 'stroke-width': 2.5, 'stroke-opacity': .6 }, rudder);
  const rudArrow = G(uwHull);
  E('circle', { cx: -668, cy: 22, r: 52, fill: 'none', stroke: '#FFE08A', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, rudArrow);
  E('path', { d: 'M-722,92 Q-668,124 -612,92', stroke: '#FFE08A', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, rudArrow); E('path', { d: 'M-624,78 L-600,88 L-620,106 Z', fill: '#FFE08A' }, rudArrow);
  E('path', { d: hullUW, fill: '#0A2A55', 'fill-opacity': .35 }, uwHull);
  const gash = E('path', { fill: 'none', stroke: '#E8F4FF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, uwHull);
  const gash2 = E('path', { fill: 'none', stroke: '#0B0D14', 'stroke-width': 7, 'stroke-opacity': .7, 'stroke-linejoin': 'round' }, uwHull);
  uwHull.insertBefore(gash2, gash);
  /* underside of the surface */
  E('rect', { x: -1000, y: WL, width: 3600, height: 36, fill: lgrad([[0, '#6E95D8', .35], [1, '#6E95D8', 0]]) }, uw);
  const surf = E('path', { fill: 'none', stroke: '#9DB8EA', 'stroke-width': 3, 'stroke-opacity': .8 }, uw);
  const bubbles = []; for (let i = 0; i < 12; i++) bubbles.push(E('circle', { r: 3 + hash(i * 2.7) * 6, fill: '#CFE6FF', 'fill-opacity': .12, stroke: '#CFE6FF', 'stroke-opacity': .55, 'stroke-width': 1.6 }, uw));

  /* ---- the iceberg (wrapped so it can suck its tummy in) ---- */
  const iceWrap = G(extCam);
  const ice = Iceberg(iceWrap, {});
  /* wink: a closed lid over its right eye (face-local coords) */
  const wink = G(ice.face); tf(wink, 40, -162);
  E('ellipse', { rx: 31, ry: 27, cy: 1, fill: '#C3E8F6' }, wink); E('path', { d: 'M-25,0 Q0,14 25,0', stroke: '#2B5E7E', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, wink);
  E('path', { d: 'M-20,8 l-6,7 M0,12 l0,9 M20,8 l6,7', stroke: '#2B5E7E', 'stroke-width': 3, 'stroke-linecap': 'round' }, wink);
  /* underwater extras (iceberg-local, below its waterline): paint stripe, folded arms, 90% bracket */
  const stripeD = 'M384,118 Q366,92 330,82 Q230,56 110,66 Q70,70 44,80';
  const stripeB = E('path', { d: stripeD, stroke: '#16181F', 'stroke-width': 15, fill: 'none', 'stroke-linecap': 'round' }, ice.under);
  const stripeR = E('path', { d: stripeD, stroke: '#A3302C', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', transform: 'translate(0,13)' }, ice.under);
  stripeB.setAttribute('stroke-width', 20);
  const STRIPE_L = stripeB.getTotalLength ? stripeB.getTotalLength() : 360;
  const stripePts = []; for (let i = 0; i <= 24; i++) { const q = stripeB.getPointAtLength ? stripeB.getPointAtLength(STRIPE_L * i / 24) : { x: lerp(384, 44, i / 24), y: 80 }; stripePts.push([q.x, q.y]); }
  const stripeAt = u => { const f = clamp(u) * 24, i = Math.min(23, Math.floor(f)); return mixP(stripePts[i], stripePts[i + 1], f - i); };
  const shine = G(ice.under); star4(shine, 34, '#FFFFFF'); star4(shine, 16, '#FFF6C0'); op(shine, 0);
  const arms = G(ice.under, { 'fill-opacity': .95 });
  const armMake = () => { const g = G(arms);
    const o = E('path', { fill: 'none', stroke: '#2C6F98', 'stroke-width': 86, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const f = E('path', { fill: 'none', stroke: '#A9DCF0', 'stroke-width': 70, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const h = E('path', { fill: 'none', stroke: '#E8F8FF', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-opacity': .7 }, g);
    const hand = G(g); E('ellipse', { rx: 50, ry: 44, fill: '#2C6F98' }, hand); E('ellipse', { rx: 42, ry: 36, fill: '#BDE6F6' }, hand); E('path', { d: 'M-14,-14 Q-2,-22 12,-16', stroke: '#FFFFFF', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .8 }, hand);
    const fing = G(hand); E('rect', { x: -12, y: -74, width: 24, height: 56, rx: 12, fill: '#2C6F98' }, fing); E('rect', { x: -7, y: -69, width: 14, height: 48, rx: 7, fill: '#BDE6F6' }, fing); E('circle', { cx: 0, cy: -46, r: 30, fill: 'none' }, fing);
    return { g, o, f, h, hand, fing };
  };
  const armL = armMake(), armR = armMake();
  const setArm = (a, S, Ee, H, fingOn, fingRot) => {
    const d = `M${f2(S[0])},${f2(S[1])} L${f2(Ee[0])},${f2(Ee[1])} L${f2(H[0])},${f2(H[1])}`;
    a.o.setAttribute('d', d); a.f.setAttribute('d', d);
    a.h.setAttribute('d', `M${f2(lerp(S[0], Ee[0], .2) - 14)},${f2(lerp(S[1], Ee[1], .2))} L${f2(lerp(S[0], Ee[0], .75) - 14)},${f2(lerp(S[1], Ee[1], .75))}`);
    tf(a.hand, H[0], H[1]); op(a.fing, fingOn); if (fingOn) tf(a.fing, 0, 0, fingRot);
  };
  const tag90 = G(ice.under);
  E('path', { d: 'M440,8 H462 V630 H440 M462,320 H478', stroke: '#FFE08A', 'stroke-width': 6, fill: 'none', 'stroke-linejoin': 'round' }, tag90);
  { const t = TX(tag90, 488, 344, '90%', 80, '#FFE08A', { w: 800 }); t.setAttribute('stroke', '#0B1A33'); t.setAttribute('stroke-width', 8); t.setAttribute('paint-order', 'stroke'); }
  /* shot A: the far berg is a near-invisible black shape with a faint starlit edge... and two bright eyes */
  const darkBerg = G(extCam);
  { const AP = [[-224, 0], [-210, -36], [-192, -66], [-184, -104], [-152, -132], [-138, -176], [-106, -198], [-82, -238], [-42, -254], [-16, -292], [12, -310], [36, -282], [62, -264], [84, -228], [114, -216], [136, -178], [154, -162], [172, -120], [192, -94], [208, -48], [224, 0]];
    const d = 'M' + AP.map(p => p.join(',')).join(' L') + ' Z';
    E('path', { d, fill: '#151D3A', 'fill-opacity': .97 }, darkBerg);
    E('path', { d: 'M' + AP.slice(0, 12).map(p => p.join(',')).join(' L'), fill: 'none', stroke: '#7F93C8', 'stroke-width': 5, 'stroke-opacity': .35, 'stroke-linejoin': 'round' }, darkBerg); }
  const nEyes = G(extCam);
  const nEye = [-1, 1].map(sd => { const g = G(nEyes); const lidG = G(g);
    E('ellipse', { rx: 15, ry: 13, fill: '#EAF6FF' }, lidG); const pup = E('circle', { r: 6, fill: '#0B1628' }, lidG); E('circle', { cx: 2, cy: -2.5, r: 2, fill: '#FFFFFF' }, lidG);
    const glow = E('ellipse', { rx: 34, ry: 26, fill: rgrad([[0, '#CFE8FF', .35], [1, '#CFE8FF', 0]]) }, g); g.insertBefore(glow, lidG);
    return { g, lidG, pup }; });
  /* effects in front of everything outside */
  const fx = G(extCam);
  const bowArrow = G(fx);
  const bowArc = E('path', { stroke: '#FFE08A', 'stroke-width': 5, 'stroke-dasharray': '12 10', fill: 'none', 'stroke-linecap': 'round' }, bowArrow);
  const bowHead = E('path', { d: 'M-12,-10 L10,0 L-12,10 Z', fill: '#FFE08A' }, bowArrow);
  const glowC = E('ellipse', { rx: 70, ry: 30, fill: rgrad([[0, '#FFFFFF', .9], [.4, '#BFEFFF', .45], [1, '#BFEFFF', 0]]) }, fx);
  const sparks = []; for (let j = 0; j < 30; j++) sparks.push(E('path', { stroke: ['#FFFFFF', '#CFF4FF', '#8FDBFF'][j % 3], 'stroke-width': 2.5 + (j % 3), 'stroke-linecap': 'round', fill: 'none' }, fx));
  const screech = [0, 1, 2].map(i => E('path', { stroke: i === 1 ? '#FFE08A' : '#FFFFFF', 'stroke-width': 3.5, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, fx));
  const chunks = []; for (let j = 0; j < 9; j++) { const g = G(fx); const r = 7 + hash(j * 3.3) * 8;
    E('path', { d: `M${-r},${f2(r * .3)} L${f2(-r * .5)},${-r} L${f2(r * .6)},${f2(-r * .8)} L${r},${f2(r * .2)} L${f2(r * .3)},${f2(r * .7)} Z`, fill: j % 2 ? '#DDF3FB' : '#B9E3F2', stroke: '#6FAFD0', 'stroke-width': 1.5 }, g); chunks.push(g); }
  const rivets = []; for (let j = 0; j < 9; j++) { const g = G(fx); const pop2 = G(g); star4(pop2, 18, '#FFF2C0', .9);
    const rv = G(g); E('rect', { x: -5, y: -8, width: 10, height: 13, rx: 3, fill: '#3A3A44' }, rv); E('ellipse', { cx: 0, cy: -8, rx: 7, ry: 3.5, fill: '#5A5A66' }, rv); E('ellipse', { cx: -1.5, cy: -9, rx: 3, ry: 1.2, fill: '#B8BCCA' }, rv);
    rivets.push({ g, pop: pop2, rv }); }

  /* =====================================================================
     CROW'S NEST (shots B, C, E)
     ===================================================================== */
  const cnG = G(world), cnCam = G(cnG);
  const cn = bgCrowsNest(cnCam);
  const cnIce = Iceberg(cn.far, {});
  /* the BINOCULARS locker on the rim, padlocked */
  const LKX = 1086, LKY = 650;
  const locker = G(cn.mid);
  const lockIn = G(locker);
  /* a tall two-door cupboard: name plate above the lookout's reaching arm, padlock on the hasp */
  E('rect', { x: -80, y: -108, width: 160, height: 162, rx: 7, fill: '#5E3E24' }, lockIn);
  E('rect', { x: -73, y: -101, width: 146, height: 148, rx: 4, fill: '#80562F' }, lockIn);
  E('path', { d: 'M0,-58 V47 M-73,-58 H73', stroke: '#4E3220', 'stroke-width': 3 }, lockIn);
  E('path', { d: 'M-60,-44 V36 M60,-44 V36', stroke: '#9A6A3E', 'stroke-width': 3, 'stroke-opacity': .6 }, lockIn);
  E('rect', { x: -73, y: -101, width: 146, height: 7, fill: '#A0703F' }, lockIn);
  [[-80, -108], [64, -108], [-80, 38], [64, 38]].forEach(([x, y]) => E('rect', { x, y, width: 16, height: 16, rx: 3, fill: '#3A3A44' }, lockIn));
  E('rect', { x: -68, y: -96, width: 136, height: 32, rx: 4, fill: '#EFE3C4', stroke: '#3A2A18', 'stroke-width': 2 }, lockIn);
  TX(lockIn, 0, -73, 'BINOCULARS', 20, '#2A1E12', { a: 'middle', w: 800, ls: .3 });
  E('rect', { x: -26, y: -30, width: 52, height: 12, rx: 3, fill: '#3A3A44' }, lockIn); E('circle', { cx: -18, cy: -24, r: 2.5, fill: '#8A8E9A' }, lockIn); E('circle', { cx: 18, cy: -24, r: 2.5, fill: '#8A8E9A' }, lockIn);
  const padlock = G(lockIn); tf(padlock, 0, -22);
  const plIn = G(padlock, { transform: 'scale(1.35)' });
  E('path', { d: 'M-10,6 V-4 Q-10,-16 0,-16 Q10,-16 10,-4 V6', stroke: '#9AA0AE', 'stroke-width': 5, fill: 'none' }, plIn);
  E('rect', { x: -17, y: 4, width: 34, height: 30, rx: 7, fill: '#C9A045', stroke: '#7A5A20', 'stroke-width': 2 }, plIn);
  E('path', { d: 'M-12,9 Q-6,6 2,7', stroke: '#F4DC8C', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, plIn);
  E('path', { d: 'M0,24 m-2.5,0 a2.5,2.5 0 1 1 5,0 L1.5,31 H-1.5 Z', fill: '#3A2A10' }, plIn);
  const plEyes = [-7, 7].map(x => { const g = G(plIn); tf(g, x, 15); E('ellipse', { rx: 4, ry: 3.6, fill: '#FFFFFF' }, g); E('circle', { cx: .8, r: 2, fill: '#1E1408' }, g); const lid = E('rect', { x: -4.5, y: -4, width: 9, height: 3, fill: '#C9A045' }, g); return { g, lid }; });
  const plBrow = E('path', { stroke: '#5A3E10', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, plIn);
  const plMouth = E('path', { stroke: '#3A2A10', 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }, plIn);
  const rattle = G(locker); E('path', { d: 'M-94,-60 q-10,12 0,24 M-106,-66 q-12,18 0,36 M94,-60 q10,12 0,24 M106,-66 q12,18 0,36', stroke: '#E8EEFF', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, rattle);
  /* the lookouts: Lee (left) and Fleet (right, the speaker) */
  const L1 = castLookout(cn.mid, 1), L0 = castLookout(cn.mid, 0);
  const hsL = cn.makeHandset(L0.propL); tf(hsL, 0, 0, -20);
  /* frost on hats, brows and shoulders */
  const frost = (R, hatD) => {
    const h = G(R.head);
    E('path', { d: hatD, fill: '#F2FAFF', 'fill-opacity': .92 }, h);
    E('path', { d: 'M-32,-334 l3,9 l3,-9 M-6,-333 l3,11 l3,-11 M22,-334 l3,8 l3,-8', fill: '#E4F4FF', stroke: '#E4F4FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, h);
    E('path', { d: 'M-26,-325 q11,-5 21,0 M5,-325 q11,-5 21,0', stroke: '#FFFFFF', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-opacity': .85 }, h);
    const s = G(R.torso); E('path', { d: 'M-66,-224 Q-60,-244 -38,-246 Q-22,-246 -18,-236 Q-36,-232 -66,-224 Z M66,-224 Q60,-244 38,-246 Q22,-246 18,-236 Q36,-232 66,-224 Z', fill: '#F2FAFF', 'fill-opacity': .88 }, s);
    return [h, s];
  };
  const frost0 = frost(L0, 'M-46,-374 Q-42,-406 -2,-410 Q40,-406 47,-374 Q37,-383 27,-376 Q15,-389 3,-378 Q-9,-389 -21,-378 Q-33,-386 -46,-374 Z');
  const frost1 = frost(L1, 'M-56,-366 Q-46,-392 -8,-394 Q34,-392 56,-370 Q40,-378 24,-370 Q8,-382 -8,-372 Q-28,-382 -56,-366 Z');
  /* breath clouds, frost flakes, bell DINGs */
  const breath = [0, 1].map(() => { const g = G(cn.over); const a = E('ellipse', { rx: 14, ry: 9, fill: '#EAF3FF' }, g); const b = E('ellipse', { rx: 10, ry: 7, fill: '#EAF3FF' }, g); return { g, a, b }; });
  const flakes = [0, 1].map(k => { const a = []; for (let j = 0; j < 18; j++) { const g = G(cn.over); star4(g, 8 + hash(j * 1.9 + k) * 8, '#F4FBFF', .95); a.push(g); } return a; });
  const dings = [0, 1, 2].map(i => { const g = G(cn.over); let d = ''; for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 + i * .3; d += `M${f2(Math.cos(a) * 60)},${f2(Math.sin(a) * 50)} L${f2(Math.cos(a) * 92)},${f2(Math.sin(a) * 76)} `; }
    E('path', { d, stroke: '#FFE7A0', 'stroke-width': 6, 'stroke-linecap': 'round' }, g); E('ellipse', { rx: 74, ry: 62, fill: 'none', stroke: '#FFF6D0', 'stroke-width': 3, 'stroke-opacity': .7 }, g); return g; });
  const cnDim = E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: '#04060E' }, cnG);

  /* =====================================================================
     FLASHBACK BUBBLE (shot C): sepia Southampton quay, daylight
     ===================================================================== */
  const fbG = G(world);
  const BX = 620, BY = 330, BRX = 440, BRY = 235, BK = .7;
  const trail = [[1290, 418, 13], [1228, 384, 20], [1163, 352, 27]].map(([x, y, r]) => { const g = N(fbG, x, y); E('circle', { r: r + 6, fill: '#FFF4DC' }, g); E('circle', { r, fill: '#D9C29A' }, g); E('circle', { cx: -r * .3, cy: -r * .35, r: r * .3, fill: '#FFFFFF', 'fill-opacity': .5 }, g); return g; });
  const bub = G(fbG);
  const cloudC = [[BX, BY, 0, 0]]; for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; cloudC.push([BX + Math.cos(a) * BRX, BY + Math.sin(a) * BRY, 58 + hash(k * 4.3) * 16, 1]); }
  const cpId = uid('s3cl'); const cp = E('clipPath', { id: cpId }, DEFS);
  E('ellipse', { cx: BX, cy: BY, rx: BRX, ry: BRY }, cp); cloudC.slice(1).forEach(([x, y, r]) => E('circle', { cx: f2(x), cy: f2(y), r: f2(r) }, cp));
  const rimG = G(bub);
  E('ellipse', { cx: BX, cy: BY + 8, rx: BRX + 14, ry: BRY + 14, fill: '#000', 'fill-opacity': .25 }, rimG);
  E('ellipse', { cx: BX, cy: BY, rx: BRX + 9, ry: BRY + 9, fill: '#FFF4DC' }, rimG);
  cloudC.slice(1).forEach(([x, y, r]) => E('circle', { cx: f2(x), cy: f2(y), r: f2(r + 9), fill: '#FFF4DC' }, rimG));
  const inner = G(bub, { 'clip-path': `url(#${cpId})` });
  const innerS = G(inner); tf(innerS, BX - 800 * BK, BY - 450 * BK, 0, BK);
  const fbCam = G(innerS);
  const fbSky = Sky(fbCam, { mood: 'day', y: 520, x0: -300, w: 2200, y0: -500, clouds: 6, gulls: 5, sun: [1250, 150] });
  /* far shore: Southampton waterfront */
  { const g = G(fbCam); let d = 'M-300,522 L-300,470 '; for (let x = -300; x <= 1900; x += 40) { const h = 18 + hash(x * .37) * 34 + (hash(x * .11) > .8 ? 40 : 0); d += `L${x},${f2(522 - h)} L${x + 30},${f2(522 - h)} `; } d += 'L1900,522 Z';
    E('path', { d, fill: '#8C9AA4' }, g); E('path', { d: 'M560,470 L572,410 L584,470 Z M1460,470 L1468,420 L1476,470 Z', fill: '#8C9AA4' }, g);
    let ch = ''; for (let i = 0; i < 9; i++) { const x = -200 + i * 230 + hash(i) * 90; ch += `M${f2(x)},500 v-48 h10 v48 `; } E('path', { d: ch, fill: '#7A8892' }, g);
    E('path', { d: 'M180,500 L180,380 L260,360 M180,392 L244,374', stroke: '#6E7C86', 'stroke-width': 6, fill: 'none' }, g); }
  E('rect', { x: -300, y: 520, width: 2200, height: 200, fill: lgrad([[0, '#9CC4D6'], [1, '#4F86A6']]) }, fbCam);
  const fbRip = G(fbCam); { let d = ''; for (let i = 0; i < 46; i++) { const x = -300 + hash(i * 3.7) * 2300, y = 530 + Math.pow(hash(i * 1.9), 1.4) * 160; d += `M${f2(x)},${f2(y)} q14,-5 28,0 t28,0 `; } E('path', { d, stroke: '#E6F4FA', 'stroke-width': 2.2, fill: 'none', 'stroke-opacity': .6 }, fbRip); }
  /* the Titanic sailing away (small, far): a simplified silhouette at this distance */
  const farShip = G(fbCam);
  { const g = G(farShip);
    const smk = G(g); [[-52, -142], [-6, -142], [40, -142], [86, -142]].forEach(([x, y], i) => [0, 1, 2].forEach(k => E('circle', { cx: x - 30 - k * 34, cy: y - 14 - k * 16, r: 14 + k * 7, fill: '#4A4A50', 'fill-opacity': .32 - k * .07 }, smk)));
    E('path', { d: 'M-260,-40 L250,-46 L272,-74 L246,0 L-236,0 Q-262,-14 -260,-40 Z', fill: '#1E2029' }, g);
    E('path', { d: 'M-236,0 L246,0 L244,8 L-232,8 Z', fill: '#A3302C' }, g);
    E('path', { d: 'M-200,-46 L200,-50 L200,-70 L-200,-66 Z', fill: '#F2EEE4' }, g);
    E('path', { d: 'M-160,-66 L150,-70 L150,-84 L-160,-80 Z', fill: '#E6E0D2' }, g);
    [-60, -14, 32, 78].forEach(x => { E('path', { d: `M${x - 9},-80 L${x - 5},-140 L${x + 11},-140 L${x + 9},-80 Z`, fill: '#D9A35A' }, g); E('path', { d: `M${x - 5},-140 L${x + 11},-140 L${x + 10.5},-128 L${x - 5.6},-128 Z`, fill: '#1E1E22' }, g); });
    E('path', { d: 'M200,-46 L196,-180 M-210,-40 L-206,-170 M196,-170 L-206,-160', stroke: '#3A3530', 'stroke-width': 2.5, fill: 'none' }, g);
    let pd = ''; for (let x = -220; x < 230; x += 9) pd += `M${x},-24 h3 `; E('path', { d: pd, stroke: '#E8E2D0', 'stroke-width': 2.5 }, g); }
  /* the quay */
  const quay = G(fbCam);
  E('rect', { x: -300, y: 690, width: 2200, height: 400, fill: lgrad([[0, '#D4C4A2'], [1, '#A89676']]) }, quay);
  E('rect', { x: -300, y: 684, width: 2200, height: 24, fill: '#8E8270' }, quay);
  { let d = ''; for (let x = -300; x < 1900; x += 70) d += `M${x},684 v24 `; E('path', { d, stroke: '#6E6456', 'stroke-width': 2 }, quay);
    let s = ''; for (let i = 0; i < 26; i++) { const y = 730 + i * 13, w = 60 + hash(i) * 40; for (let x = -300 + (i % 2) * 40; x < 1900; x += w * 1.6) s += `M${f2(x)},${f2(y)} h${f2(w)} `; } E('path', { d: s, stroke: '#9C8C6E', 'stroke-width': 1.5, 'stroke-opacity': .55 }, quay); }
  [[200, 700], [1420, 700]].forEach(([x, y]) => { E('path', { d: `M${x - 22},${y} L${x - 18},${y - 40} Q${x},${y - 56} ${x + 18},${y - 40} L${x + 22},${y} Z`, fill: '#3E3A36' }, quay); E('ellipse', { cx: x, cy: y - 44, rx: 24, ry: 8, fill: '#4E4A44' }, quay); });
  { const g = G(quay); [[90, 790, 150, 110, '#A07A4A'], [110, 690, 110, 100, '#8E6A3E'], [250, 800, 120, 96, '#B48A56']].forEach(([x, y, w, h, col]) => { E('rect', { x, y: y - h, width: w, height: h, rx: 4, fill: col, stroke: shade(col, -.3), 'stroke-width': 3 }, g); E('path', { d: `M${x + 8},${y - h + 8} L${x + w - 8},${y - 8} M${x + w - 8},${y - h + 8} L${x + 8},${y - 8}`, stroke: shade(col, -.25), 'stroke-width': 3 }, g); }); }
  E('ellipse', { cx: 1250, cy: 790, rx: 60, ry: 18, fill: 'none', stroke: '#B89C6A', 'stroke-width': 9 }, quay); E('ellipse', { cx: 1250, cy: 786, rx: 38, ry: 11, fill: 'none', stroke: '#C9AE7C', 'stroke-width': 7 }, quay);
  { const g = G(quay); E('rect', { x: 1093, y: 440, width: 10, height: 300, fill: '#2E2C2A' }, g); E('path', { d: 'M1076,440 L1120,440 L1112,404 L1084,404 Z', fill: '#2E2C2A' }, g); E('rect', { x: 1086, y: 408, width: 24, height: 30, fill: '#F6E7B8' }, g); E('rect', { x: 1082, y: 734, width: 32, height: 10, fill: '#2E2C2A' }, g); }
  /* warehouse with the town's name */
  { const g = G(fbCam); E('rect', { x: -300, y: 330, width: 860, height: 360, fill: '#B58866' }, g); E('path', { d: 'M-300,330 L130,250 L560,330 Z', fill: '#8E6448' }, g);
    let d = ''; for (let y = 350; y < 690; y += 18) d += `M-300,${y} H560 `; E('path', { d, stroke: '#9E7458', 'stroke-width': 1.5 }, g);
    E('rect', { x: 150, y: 520, width: 130, height: 170, fill: '#5E4434' }, g); E('rect', { x: 400, y: 540, width: 90, height: 70, fill: '#E8DDC4' }, g); E('path', { d: 'M445,540 V610 M400,575 H490', stroke: '#5E4434', 'stroke-width': 4 }, g);
    E('rect', { x: 230, y: 380, width: 320, height: 64, rx: 6, fill: '#2E3A4A', stroke: '#E8D9B4', 'stroke-width': 4 }, g);
    TX(g, 390, 424, 'SOUTHAMPTON', 36, '#F4E7C6', { a: 'middle', w: 800, ls: 2 }); }
  /* the officer left ashore: kitbag on his shoulder, key on his watch chain */
  const OFX = 760, OFY = 862, OFS = .92;
  const kit = G(fbCam);
  { const g = G(kit); E('path', { d: 'M-30,-70 Q-44,-10 -28,70 Q0,92 28,70 Q42,-10 28,-70 Q0,-88 -30,-70 Z', fill: '#D8CBA8', stroke: '#8E7E58', 'stroke-width': 3 }, g);
    E('path', { d: 'M-30,-70 Q0,-56 28,-70', stroke: '#8E7E58', 'stroke-width': 3, fill: 'none' }, g); E('path', { d: 'M-4,-70 Q4,-96 18,-104', stroke: '#6E5E40', 'stroke-width': 4, fill: 'none' }, g);
    E('path', { d: 'M10,-40 Q20,10 12,60', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-opacity': .35, fill: 'none', 'stroke-linecap': 'round' }, g); }
  const blair = castOfficer(fbCam, { mustache: false, hair: '#C9A266', jaw: 'round', nose: 'round', skin: '#F3CBA4', rim: false });
  const keyG = G(blair.torso);
  E('path', { d: 'M-14,-176 Q0,-160 16,-158', stroke: '#E2BE62', 'stroke-width': 2.5, fill: 'none' }, keyG);
  const keyB = G(keyG); tf(keyB, 17, -156, 0, 1.7);
  E('circle', { cx: 0, cy: 0, r: 5.5, fill: 'none', stroke: '#E2BE62', 'stroke-width': 3 }, keyB); E('path', { d: 'M0,5 V22 M0,15 h5 M0,20 h6', stroke: '#E2BE62', 'stroke-width': 3, 'stroke-linecap': 'round' }, keyB);
  const keyGlint = G(keyB); tf(keyGlint, 4, -4); star4(keyGlint, 11, '#FFFFFF'); star4(keyGlint, 5, '#FFF2A0');
  const hanky = G(blair.propR); const hankyP = E('path', { fill: '#FFFFFF', stroke: '#D6D0C4', 'stroke-width': 1.5 }, hanky);
  /* sepia wash + old-photo edges + film scratches (screen space, inside the clip) */
  E('rect', { x: 0, y: 0, width: 1600, height: 900, fill: '#A27843', 'fill-opacity': .4 }, inner);
  [[70, .22], [36, .22]].forEach(([w, a]) => E('ellipse', { cx: BX, cy: BY, rx: BRX + 50 - w / 2, ry: BRY + 50 - w / 2, fill: 'none', stroke: '#5A3A18', 'stroke-width': w + 60, 'stroke-opacity': a }, inner));
  const scratches = E('path', { stroke: '#FFF6E0', 'stroke-width': 1.5, 'stroke-opacity': .5 }, inner);

  /* =====================================================================
     BRIDGE (shot F)
     ===================================================================== */
  const brG = G(world), brCam = G(brG);
  const br = bgBridge(brCam);
  const bice = Iceberg(br.far, {});
  /* the committee: a snail in a bowler hat, crawling along the window sill */
  const snailTrail = E('path', { stroke: '#CFE0FF', 'stroke-width': 3, 'stroke-opacity': .55, fill: 'none', 'stroke-linecap': 'round' }, br);
  const snail = G(br); const snBody = G(snail);
  E('path', { d: 'M-34,0 Q-36,-12 -20,-12 L18,-14 Q30,-16 34,-30 Q40,-36 44,-28 Q44,-10 30,-2 Q10,2 -34,0 Z', fill: '#B9A27A', stroke: '#6E5A38', 'stroke-width': 2 }, snBody);
  const stalks = G(snBody); E('path', { d: 'M36,-28 L40,-48 M41,-28 L50,-45', stroke: '#8E7A52', 'stroke-width': 3, 'stroke-linecap': 'round' }, stalks);
  E('circle', { cx: 40, cy: -50, r: 4, fill: '#FFFFFF', stroke: '#3A2E20', 'stroke-width': 1.2 }, stalks); E('circle', { cx: 50.5, cy: -47, r: 4, fill: '#FFFFFF', stroke: '#3A2E20', 'stroke-width': 1.2 }, stalks);
  E('circle', { cx: 41, cy: -50, r: 1.8, fill: '#1E1408' }, stalks); E('circle', { cx: 51.5, cy: -47, r: 1.8, fill: '#1E1408' }, stalks);
  E('path', { d: 'M28,-34 L56,-40 M33,-36 Q34,-50 43,-50 Q51,-50 51,-40 Z', stroke: '#1E1E24', 'stroke-width': 3, fill: '#2A2A30', 'stroke-linecap': 'round' }, stalks);
  const shell = G(snail); tf(shell, -6, -28);
  E('circle', { r: 26, fill: '#C9824A', stroke: '#6E3E1E', 'stroke-width': 2.5 }, shell); E('path', { d: 'M0,0 m-3,0 a3,3 0 1 1 6,0 a7,7 0 1 1 -14,0 a12,12 0 1 1 24,0 a18,18 0 1 1 -36,2', stroke: '#7A4422', 'stroke-width': 2.5, fill: 'none' }, shell);
  E('path', { d: 'M-14,-16 Q-4,-24 8,-20', stroke: '#F2C08A', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, shell);
  /* phone ringing marks */
  const ring = G(br); E('path', { d: 'M18,370 q-14,14 0,28 M8,362 q-22,22 0,44 M142,370 q14,14 0,28 M152,362 q22,22 0,44', stroke: '#FFE7A0', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, ring);
  /* the quartermaster (helm) and the officer */
  const QM = Person(br.mid, { coat: 'uniform', stripes: 0, hat: 'sailor', hatColor: '#1A2340', mustache: 'handlebar', hair: '#4A3424', skin: '#E9BC94', jaw: 'wide', nose: 'round', rim: MOON, seed: 7 });
  const OF = castOfficer(br.mid);
  const hsB = br.makeHandset(OF.propL); tf(hsB, 0, 0, -20);
  /* the officer's enormous eyes */
  const bigEyes = [-1, 1].map(sd => { const g = G(OF.head); E('ellipse', { rx: 21, ry: 26, fill: '#FFFFFF', stroke: '#1E2235', 'stroke-width': 2.6 }, g); const p = G(g); E('circle', { r: 5.5, fill: '#1E2235' }, p); E('circle', { cx: 1.6, cy: -1.8, r: 1.6, fill: '#FFFFFF' }, p); return { g, p, sd }; });
  /* wheel spin lines + clunk */
  const spin = G(br.over);
  E('circle', { cx: 520, cy: 650, r: 95, fill: 'none', stroke: '#8A5A33', 'stroke-width': 30, 'stroke-opacity': .55 }, spin);
  E('circle', { cx: 520, cy: 650, r: 70, fill: '#8A5A33', 'fill-opacity': .35 }, spin);
  E('circle', { cx: 520, cy: 650, r: 24, fill: '#E2BE62', 'fill-opacity': .7 }, spin);
  const spinArcs = [0, 1, 2].map(i => E('path', { d: `M${520 + Math.sin(i * 2.1) * 128},${650 - Math.cos(i * 2.1) * 128} A128,128 0 0,0 ${f2(520 + Math.sin(i * 2.1 - 1.1) * 128)},${f2(650 - Math.cos(i * 2.1 - 1.1) * 128)}`, stroke: '#FFF2C8', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, spin));
  const clunk = G(br.over); tf(clunk, 520, 650); star4(clunk, 46, '#FFE7A0', .9);

  /* =====================================================================
     HUD: 11:40 pm, 14 April (shot G)
     ===================================================================== */
  const hud = N(world, 1100, 150, .9);
  E('circle', { r: 84, fill: '#000', 'fill-opacity': .3, cy: 6 }, hud);
  E('circle', { r: 80, fill: '#9A7430' }, hud); E('circle', { r: 72, fill: '#E2BE62' }, hud); E('circle', { r: 64, fill: '#F6F0E2' }, hud);
  { let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, r0 = i % 3 ? 54 : 48; d += `M${f2(Math.sin(a) * r0)},${f2(-Math.cos(a) * r0)} L${f2(Math.sin(a) * 60)},${f2(-Math.cos(a) * 60)} `; } E('path', { d, stroke: '#2A2A30', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, hud); }
  E('path', { d: 'M0,0 L-6.6,-37.4', stroke: '#1E2235', 'stroke-width': 7, 'stroke-linecap': 'round' }, hud);
  E('path', { d: 'M0,0 L-45,26', stroke: '#1E2235', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, hud);
  const secH = E('path', { d: 'M0,10 L0,-52', stroke: '#C0392B', 'stroke-width': 2, 'stroke-linecap': 'round' }, hud);
  E('circle', { r: 6, fill: '#9A7430' }, hud);
  E('path', { d: 'M-46,-42 Q-30,-56 -10,-60', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-opacity': .6, fill: 'none', 'stroke-linecap': 'round' }, hud);
  E('rect', { x: -102, y: 92, width: 204, height: 88, rx: 14, fill: '#14182A', 'fill-opacity': .88, stroke: '#E2BE62', 'stroke-width': 3 }, hud);
  TX(hud, 0, 130, '11:40 pm', 30, '#FFF6E5', { a: 'middle', w: 800 });
  TX(hud, 0, 165, '14 April', 25, '#F7C948', { a: 'middle', w: 700 });

  /* ---------------- timeline constants for G ---------------- */
  const IX = 1050, IS = .72, SHS = .82;
  const tS = c(7) + 4.8, tSE = c(7) + 6.4;                 /* the scrape */
  const CX = IX + 297 * IS, CY = WL + 30;                    /* contact point */
  const shipXG = t => k1(t, [[SF, -123], [tS, 730, lin], [tSE, 905, lin], [DUR, 1500, lin]]);
  const shipSxG = t => k1(t, [[SF, 1], [tS, .93]]);
  const R1 = c(4) - .15, R2 = R1 + .33, R3 = R1 + .66;      /* bell strokes */
  const tRS = c(8) - .1, tPol = c(8) + .55, tPolE = c(8) + 1.6, tBack = c(8) + 1.85;  /* polish */

  let shotLast = '', aqLast = -1;
  return (lt, at) => {
    const shot = lt < SA ? 'A' : lt < SB ? 'B' : lt < SC ? 'C' : lt < SD ? 'D' : lt < SE ? 'E' : lt < SF ? 'F' : 'G';
    if (shot !== shotLast) {
      const extOn = 'ADG'.includes(shot), cnOn = 'BCE'.includes(shot);
      op(ext, extOn ? 1 : 0); op(cnG, cnOn ? 1 : 0); op(brG, shot === 'F' ? 1 : 0); op(fbG, shot === 'C' || shot === 'B' ? 1 : 0);
      op(uw, shot === 'A' ? 0 : 1); op(nEyes, shot === 'A' ? 1 : 0); op(darkBerg, shot === 'A' ? 1 : 0); op(shoot, shot === 'A' ? 1 : 0); op(fx, shot === 'G' ? 1 : 0);
      [seaWrap, shipWrap].forEach(g => { if (shot === 'A') g.removeAttribute('clip-path'); else g.setAttribute('clip-path', clipWL); });
      op(tag90, shot === 'D' ? 1 : 0); op(wink, shot === 'D' ? 1 : 0); op(cnIce.root, shot === 'E' ? 1 : 0);
      shotLast = shot;
    }
    { const hv = shot === 'G' ? pop(lt, c(7) - .05, .5) : 0, ho = prog(lt, c(7) + 2.75, .35); op(hud, hv > .01 && ho < 1 ? 1 - ho : 0); if (hv > .01) { tf(hud, 1100, 150, 0, .9 * hv); secH.setAttribute('transform', `rotate(${Math.floor(lt * 2) * 3})`); } }
    const talkI = cue.talk(lt, 'I'), talkL = cue.talk(lt, 'L'), talkF = cue.talk(lt, 'F');

    /* ================= EXTERIOR ================= */
    if (shot === 'A' || shot === 'D' || shot === 'G') {
      /* the sky's twinkle and the sea's star glints are refreshed at 20 Hz (identical frames skip the DOM writes) */
      const aq = Math.floor(at * 20) / 20; if (aq !== aqLast) { aqLast = aq; sky.anim(aq); sea.anim(aq); }
      let camV, sh = [0, 0];
      /* ambient underwater life */
      if (shot !== 'A') {
        tf(rays, Math.sin(at * .3) * 30, 0); plank.forEach((p, k) => tf(p, Math.sin(at * .2 + k) * 20, -((at * (6 + k * 4)) % 60)));
        let sd = `M-1000,${WL}`; for (let x = -1000; x <= 2600; x += 60) sd += ` Q${x + 15},${f2(WL - 3 + Math.sin(at * 2 + x * .02) * 2)} ${x + 30},${WL} T${x + 60},${WL}`; surf.setAttribute('d', sd);
        bubbles.forEach((b, i) => { const q = (at * (.12 + hash(i) * .1) + hash(i * 3.3)) % 1; b.setAttribute('cx', f2(IX - 320 + hash(i * 5.1) * 640 + Math.sin(at * 2 + i) * 8)); b.setAttribute('cy', f2(WL + 520 - q * 500)); op(b, Math.sin(Math.PI * q)); });
        fishes.forEach(f => { const span = 2400, q = ((at * 46 * (1 + f.i * .2) + f.i * 700) % span); const x = f.dir > 0 ? -300 + q : 2100 - q; tf(f.g, x, f.y + Math.sin(at * 1.4 + f.i) * 12, Math.sin(at * 4 + f.i) * 4, f.s * f.dir, f.s); });
        props.forEach((p, i) => tf(p, 0, 0, 0, 1, Math.cos(at * 14 + i)));
      }
      if (shot === 'A') {
        /* ---------- glass sea, ship gliding through the stars ---------- */
        const X = 600 + 20 * lt;
        ship.set({ x: X, y: 640, s: .62, sx: 1, lights: 1, smoke: 1, wake: 0, calm: lt < SA - .3 }); ship.anim(at);   /* deep in the push-in the reflections are off-frame */
        const cnP = ship.crowsNest();
        /* the camera holds while nothing needs it (a still camera keeps the heavy exterior cheap), then pans to the berg and pushes in */
        camV = kv(lt, [[0, 800, 470, 1], [c(0) + 2.6, 800, 470, 1], [c(0) + 4.55, 1075, 472, 1.22], [SA - .62, 1080, 470, 1.24], [SA, cnP[0], cnP[1] + 4, 4.8, easeIn]]);
        /* the dark berg far ahead, opening its eyes */
        tf(iceWrap, 1420, HZ + 5); tf(darkBerg, 1420, HZ + 5, 0, .2); ice.set({ x: 0, y: 0, s: .2, dim: .93, showUnder: 0, face: 'neutral', at });
        const open = win(lt, c(0) + 4.5, c(0) + 5.75, .2, .15) * (1 - .9 * win(lt, c(0) + 5.05, c(0) + 5.2, .05, .06));
        op(nEyes, open > .02 ? 1 : 0);
        if (open > .02) { const sq = 1 - .45 * prog(lt, c(0) + 5.3, .25);
          nEye.forEach((e, i) => { const ex = (i ? 52.8 : -60.7) * .2 * 1.25, ey = -174 * .2; tf(e.g, 1420 + ex, HZ + 5 + ey); tf(e.lidG, 0, 0, 0, 1, Math.max(.05, open * sq)); e.pup.setAttribute('cx', f2(-6 + Math.sin(at * .7) * 1.5)); }); }
        /* shooting star across the sky + across the sea */
        const sp = clamp((lt - (c(0) + 2.85)) / .95);
        op(shoot, sp > 0 && sp < 1 ? 1 : 0);
        if (sp > 0 && sp < 1) {
          const hx = lerp(740, 1290, sp), hy = lerp(196, 330, sp), tl = 170 * Math.sin(Math.PI * Math.min(1, sp * 1.3)) + 20, ang = Math.atan2(134, 550);
          const tx = hx - Math.cos(ang) * tl, ty = hy - Math.sin(ang) * tl, m = y => HZ + (HZ - y) * .92;
          const dA = `M${f2(tx)},${f2(ty)} L${f2(hx)},${f2(hy)}`, dB = `M${f2(tx)},${f2(m(ty))} L${f2(hx)},${f2(m(hy))}`;
          shootA.setAttribute('d', dA); shootA2.setAttribute('d', dA); shootB.setAttribute('d', dB);
          tf(shootH, hx, hy, sp * 90, .6 + .4 * Math.sin(Math.PI * sp)); tf(shootHB, hx, m(hy), sp * 90, .6 + .4 * Math.sin(Math.PI * sp));
          shoot.setAttribute('opacity', f2(Math.sin(Math.PI * sp)));
        }
      } else if (shot === 'D') {
        /* ---------- the berg's close-up and the dip "downstairs" ---------- */
        ship.set({ x: 560 + 9 * (lt - SC), y: HZ + 12, s: .11, sx: 1, lights: 1, smoke: .8, wake: 0, calm: true }); ship.anim(at);
        op(uwHull, 0);
        tf(iceWrap, IX, WL);
        const lookDown = win(lt, c(3) + 1.35, c(3) + 2.75, .3, .4);
        ice.set({ x: 0, y: 0, s: IS, dim: 0, showUnder: 1, face: 'smug', talk: talkI, at, look: [lerp(.15, .1, lookDown), lerp(.05, .85, lookDown)] });
        op(wink, win(lt, c(3) - .05, c(3) + .5, .07, .1));
        /* arms folded; a smug little bounce on "downstairs" */
        const bnc = Math.sin(Math.PI * clamp((lt - (c(3) + 2.85)) / .5)) * 10 + Math.sin(at * 1.6) * 3;
        setArm(armL, [-250, 150], [-185, 322 - bnc], [128, 266 - bnc], 0, 0);
        setArm(armR, [250, 150], [185, 318 - bnc], [-124, 246 - bnc], 0, 0);
        op(stripeB, 0); op(stripeR, 0); op(shine, 0);
        const tg = prog(lt, c(3) + 2.1, .45); op(tag90, tg); tag90.setAttribute('transform', `translate(${f2((1 - tg) * 30)},0)`);
        camV = kv(lt, [[SC, 1050, 566, 2.18], [c(3) + 1.3, 1050, 566, 2.18], [c(3) + 2.55, 1100, 850, .86, easeIO]]);
      } else {
        /* ---------- side view: the slow turn, the miss, the scrape, the polish ---------- */
        const X = shipXG(lt), sxv = shipSxG(lt);
        /* calm:false here: its reflections lie below WL (hidden by the cross-section) and the calm streaks are costly */
        ship.set({ x: X, y: WL, s: SHS, sx: sxv, lights: 1, smoke: 1, wake: .3, calm: false }); ship.anim(at);
        op(uwHull, 1); tf(uwHull, X, WL, 0, SHS * sxv, SHS);
        const rud = 38 * prog(lt, SF + .1, 3.2, lin);
        tf(rudder, -657, 0, 0, Math.cos(rud * Math.PI / 180), 1);
        op(rudArrow, win(lt, SF, c(7) + 1.2, .3, .4) * (.7 + .3 * Math.sin(at * 6)));
        { const bt = X + 701 * SHS * sxv, by = WL - 70, ba = win(lt, SF, c(7) + 1.6, .3, .5);
          op(bowArrow, ba); if (ba > 0) { bowArc.setAttribute('d', `M${f2(bt + 20)},${f2(by)} Q${f2(bt + 170)},${f2(by - 6)} ${f2(bt + 230)},${f2(by - 110)}`);
            tf(bowHead, bt + 230, by - 110, -62); } }
        /* the bow tip drives the berg's reactions */
        const bowX = X + 701 * SHS * sxv;
        const miss = clamp((bowX - (IX - 170)) / 120) * (1 - prog(lt, tS - .05, .15));
        const suck = 1 - .12 * miss * (1 - clamp((bowX - (IX + 200)) / 80));
        tf(iceWrap, IX, WL, 0, suck, 1 + (1 - suck) * .4);
        const gone = clamp((lt - tPol) / (tPolE - tPol));
        let face = 'smug', look = [-1, .05];
        if (lt < tS) { if (bowX > IX - 170 && bowX < IX + 150) { face = 'surprised'; look = [clamp((bowX - IX) / 200, -1, 1), -.1]; } else if (bowX >= IX + 150) { face = 'innocent'; look = null; } }
        else if (lt < tRS) { face = 'oops'; look = [.8, .3]; }
        else if (lt < tPol) { face = 'surprised'; look = [.45, .95]; }
        else if (lt < tPolE) { face = 'smug'; const q = stripeAt(gone); look = [clamp((q[0] - 100) / 300, -.2, .8), .9]; }
        else { face = 'smug'; look = [.05, .1]; }
        const scr = lt >= tS && lt < tSE ? 1 : 0;
        ice.set({ x: 0, y: 0, s: IS, dim: 0, showUnder: 1, face, talk: talkI, at, look: look || undefined, bob: scr ? Math.sin(at * 40) * 2 : 0 });
        /* arms: folded, then the right one polishes the paint off with one fingertip (2-bone IK, elbow down) */
        const rp = prog(lt, tPol - .4, .4) * (1 - prog(lt, tBack, .5));
        const rub = lt > tPol && lt < tPolE ? 1 : 0;
        const sp2 = stripeAt(gone);
        const hTgt = [sp2[0] + 6 + Math.sin(lt * 19) * 12 * rub, sp2[1] + 62 + Math.cos(lt * 19) * 6 * rub];
        const flinch = lt > tS && lt < tSE ? -16 : 0;
        const SR = [250, 150], foldE = [185, 318 + flinch], foldH = [-124, 246 + flinch];
        const H = mixP(foldH, hTgt, rp);
        const ik = (S0, Hh, La, Lf) => { const dx = Hh[0] - S0[0], dy = Hh[1] - S0[1], d = Math.min(La + Lf - 1, Math.max(1, Math.hypot(dx, dy))), a = Math.atan2(dy, dx), b = Math.acos(clamp((La * La + d * d - Lf * Lf) / (2 * La * d), -1, 1));
          const e1 = [S0[0] + La * Math.cos(a + b), S0[1] + La * Math.sin(a + b)], e2 = [S0[0] + La * Math.cos(a - b), S0[1] + La * Math.sin(a - b)]; return e1[1] > e2[1] ? e1 : e2; };
        const Eik = rp > 0 ? ik(SR, H, 185, 200) : foldE;
        setArm(armL, [-250, 150], [-185, 322 + flinch], [128, 266 + flinch], 0, 0);
        setArm(armR, SR, rp < 1 ? mixP(foldE, Eik, Math.min(1, rp * 1.4)) : Eik, H, rp > .6 ? 1 : 0, -8);
        /* the paint stripe: appears during the scrape, rubbed away from its right end */
        const grow = prog(lt, tS, tSE - tS, lin);
        op(stripeB, grow > 0 && gone < 1 ? 1 : 0); op(stripeR, grow > 0 && gone < 1 ? 1 : 0);
        if (grow > 0) { const vis = STRIPE_L * (grow - gone), off = -STRIPE_L * gone; [stripeB, stripeR].forEach(e => { e.setAttribute('stroke-dasharray', `${f2(Math.max(0, vis))} 9999`); e.setAttribute('stroke-dashoffset', f2(off)); }); }
        const tg2 = clamp((lt - tPolE) / .55); op(shine, tg2 > 0 && tg2 < 1 ? Math.sin(Math.PI * tg2) : 0);
        if (tg2 > 0 && tg2 < 1) { const q = stripeAt(.5); tf(shine, q[0], q[1] + 6, tg2 * 120, .4 + .9 * Math.sin(Math.PI * tg2)); }
        /* ---- scrape effects ---- */
        const gx0 = clamp((CX - X) / (SHS * sxv), 300, 706);
        op(gash, lt > tS ? 1 : 0); op(gash2, lt > tS ? 1 : 0);
        if (lt > tS) { let d = `M706,22`; for (let x = 700; x >= gx0; x -= 12) d += ` L${x},${f2(24 + (hash(x * .37) - .5) * 9)}`; gash.setAttribute('d', d); gash2.setAttribute('d', d); }
        const sI = lt > tS - .05 && lt < tSE + .2 ? 1 : 0;
        op(glowC, sI * (.7 + .3 * Math.sin(at * 37))); tf(glowC, CX + 6, CY, 0, 1 + .2 * Math.sin(at * 23));
        sparks.forEach((e, j) => { const tb = tS + (j / sparks.length) * (tSE - tS - .3), a = lt - tb, life = .45;
          if (a < 0 || a > life) { op(e, 0); return; }
          const ang = (-35 + hash(j * 7.1) * 95) * Math.PI / 180, v = 320 + hash(j * 3.9) * 380;
          const vx = Math.cos(ang) * v, vy = Math.sin(ang) * v, x = CX + vx * a, y = CY + vy * a + 260 * a * a;
          e.setAttribute('d', `M${f2(x - vx * .045)},${f2(y - vy * .045)} L${f2(x)},${f2(y)}`); op(e, 1 - a / life); });
        screech.forEach((e, i) => { if (!sI) { op(e, 0); return; } let d = ''; const y0 = WL - 8 - i * 14, x0 = CX - 30 + i * 10; for (let k = 0; k < 7; k++) d += (k ? ' L' : 'M') + f2(x0 + k * 20) + ',' + f2(y0 + (k % 2 ? -9 : 9) * (1 + .3 * Math.sin(at * 50 + i))); e.setAttribute('d', d); op(e, .5 + .5 * Math.abs(Math.sin(at * 30 + i * 2))); });
        rivets.forEach((r, j) => { const tb = tS + .08 + j * .16, a = lt - tb;
          if (a < 0 || a > 1.3) { op(r.g, 0); return; } op(r.g, 1);
          const ox = CX + 14 + hash(j * 2.3) * 30, oy = WL - 10 - hash(j * 5.1) * 26, vx = 70 + hash(j * 4.4) * 170, vy = -560 - hash(j * 6.6) * 220;
          const ry = oy + vy * a + 900 * a * a; tf(r.rv, ox + vx * a, ry, a * 720 * (j % 2 ? 1 : -1)); op(r.rv, ry > WL - 4 && a > .3 ? 0 : 1);
          tf(r.pop, ox, oy, 0, .4 + 1.2 * clamp(a / .18)); op(r.pop, 1 - clamp(a / .22)); });
        chunks.forEach((g, j) => { const tb = tS + .05 + j * .17, a = lt - tb, fl = .6;
          if (a < 0) { op(g, 0); return; } op(g, 1);
          const o = [IX + (95 + hash(j * 3.1) * 70) * IS, WL - (110 + hash(j * 1.7) * 90) * IS];
          const tl = tb + fl, Xl = shipXG(tl), sl = SHS * shipSxG(tl), lxl = clamp((o[0] + 90 + hash(j * 9.3) * 170 - Xl) / sl, 380, 650);
          const land = [Xl + lxl * sl, WL + ship.S(lxl) * SHS - 4];
          if (a < fl) { const p = a / fl, P = arcPos(p, o, land, 70 + hash(j) * 60); tf(g, P[0], P[1], a * 500); }
          else { const sNow = SHS * shipSxG(lt); tf(g, X + lxl * sNow, WL + ship.S(lxl) * SHS - 4, fl * 500); } });
        sh = shake(lt, [tS, tS + .35, tS + .7, tS + 1.05], 7, .25);
        camV = kv(lt, [[SF, 250, 600, .74], [c(7) + .2, 250, 600, .74], [c(7) + 3.1, 760, 590, .95], [c(7) + 4.4, 1000, 610, 1.1], [tS, 1115, 640, 1.25], [tSE - .2, 1165, 655, 1.27], [c(8) + .4, 1150, 735, 1.3, easeIO], [c(8) + 1.9, 1150, 735, 1.3], [DUR, 1090, 770, 1.12]]);
      }
      setCam(extCam, camV, sh[0], sh[1]);
    }

    /* ================= CROW'S NEST ================= */
    if (shot === 'B' || shot === 'C' || shot === 'E') {
      /* during the flashback the dimmed nest holds its ambient sway (frozen at a fixed phase), so only the bubble repaints */
      cn.anim(shot === 'C' && lt > SB + .3 ? 0 : at);
      const camV = shot === 'E' ? kv(lt, [[SD, 860, 560, 1.22], [SE, 875, 548, 1.3]])
        : kv(lt, [[SA, 820, 590, 1.9], [SA + .6, 880, 590, 1.15, easeOut], [c(1) + 1.3, 880, 590, 1.15], [c(1) + 2.0, 1018, 615, 1.64], [c(1) + 2.95, 1018, 615, 1.64], [SB + .25, 405, 407, 1, easeIO]]);
      const sh = shot === 'E' ? shake(lt, [R1, R2, R3], 9, .22) : [0, 0];
      setCam(cnCam, camV, sh[0], sh[1]);
      op(cnDim, shot === 'C' ? .5 * prog(lt, SB, .4) * (1 - prog(lt, SC - .3, .3)) : 0);
      /* the bell */
      cn.setBell(shot === 'E' ? swing(lt, R1, 30, 15, 2.6) + swing(lt, R2, 30, 15, 2.6) + swing(lt, R3, 34, 15, 2) : Math.sin(at * .9) * 1.5);
      dings.forEach((g, i) => { const k = clamp((lt - [R1, R2, R3][i]) / .32); if (shot !== 'E' || k <= 0 || k >= 1) { op(g, 0); return; } op(g, 1 - k); tf(g, 930, 368, 0, .55 + .7 * k); });
      /* the locker + its smug padlock */
      const rat = shot === 'B' ? win(lt, c(1) + .8, c(1) + 1.6, .08, .12) : 0;
      tf(locker, LKX + Math.sin(lt * 47) * 3 * rat, LKY + Math.abs(Math.sin(lt * 31)) * -2 * rat, Math.sin(lt * 39) * 1.6 * rat);
      op(rattle, rat * (Math.sin(lt * 60) > -.3 ? 1 : .2));
      const smirk = shot === 'B' ? prog(lt, c(1) + 1.45, .4) : shot === 'C' ? 1 : 0;
      tf(padlock, 0, -22, Math.sin(lt * 23) * 16 * rat + Math.sin(at * 1.3) * 1.5 + swing(lt, c(1) + 1.6, 8, 9, 2.4));
      plEyes.forEach((e, i) => { e.lid.setAttribute('height', f2(2.5 + 3.6 * smirk * (i ? .7 : 1))); });
      plBrow.setAttribute('d', `M3,${f2(9 - 3 * smirk)} L12,${f2(8 - 5 * smirk)}`); op(plBrow, smirk);
      plMouth.setAttribute('d', `M-8,${f2(26 - 1 * smirk)} Q0,${f2(27 + 2 * smirk)} ${f2(8 + 3 * smirk)},${f2(25 - 5 * smirk)}`);
      /* --- Lee (L1), left --- */
      {
        const x = 600, y = 820, s = 1; let st = { x, y, s, at, rim: .8, rimSide: -1, shiver: .55, face: 'focus', look: [-.8, -.1], hL: [-14, -346], bendL: -1 };
        if (shot === 'B') { const gl = win(lt, c(1) + 1.0, c(1) + 2.4, .25, .3); st.look = [lerp(-.8, 1, gl), lerp(-.1, .1, gl)]; st.face = gl > .5 ? 'neutral' : 'focus'; st.lid = gl * .3; }
        if (shot === 'C') { st.look = [-.6, -.9]; st.face = 'think'; st.hL = [-58, -128]; st.hR = [16, -262]; }
        if (shot === 'E') { const p = prog(lt, R1 + .05, .2, easeOut); st.face = 'scared'; st.look = [-1, -.15]; st.shiver = 0;
          st.hL = mixP([-14, -346], [-150, -268], p); st.hR = mixP([58, -128], [70, -170], p); st.bob = -10 * Math.sin(Math.PI * clamp((lt - R1) / .3)); st.tilt = -4 * p; }
        L1.set(st);
        op(frost1[0], shot !== 'E' || lt < R2 ? 1 : 0); op(frost1[1], shot !== 'E' || lt < R2 ? 1 : 0);
      }
      /* --- Fleet (L0), right: the speaker --- */
      {
        const x = shot === 'E' ? 1000 : 960, y = 820, s = 1;
        let st = { x, y, s, at, rim: .8, rimSide: -1, shiver: .45, face: 'focus', look: [-.5, -.1], talk: talkL };
        if (shot === 'B') {
          const g1 = prog(lt, c(1) - .05, .35), gr = win(lt, c(1) + .8, c(1) + 1.65, .15, .2), sh2 = win(lt, c(1) + 2.15, ce(1) + .5, .25, .4);
          const pl = [LKX - x - 6, LKY + 4 - y];
          st.hR = gr > 0 ? mixP([95, -205], [pl[0] + Math.sin(lt * 38) * 6 * gr, pl[1] + Math.cos(lt * 31) * 5 * gr], gr) : mixP([58, -128], [95, -205], g1);
          st.hL = [-30, -326]; if (g1 > 0) st.hL = mixP([-30, -326], [-58, -128], g1);
          st.look = gr > .3 ? [1, .4] : g1 > .5 ? [.3, 0] : [-.5, -.1];
          st.face = gr > .3 ? 'worried' : g1 > .5 ? 'neutral' : 'focus';
          if (lt > c(1) + 1.6) { st.face = 'neutral'; st.lid = .45; st.look = [0, 0]; st.turn = 0; }
          if (sh2 > 0) { st.hL = mixP(st.hL, [-98, -168], sh2); st.hR = mixP(st.hR, [98, -168], sh2); st.bob = -5 * sh2; st.headTilt = 5 * sh2; }
          st.shiver = gr > .1 ? 0 : .45;
        } else if (shot === 'C') {
          const dp = prog(lt, c(2) + 3.4, .35);
          st.look = dp > .5 ? [0, 0] : [-.8, -.7]; st.face = dp > .5 ? 'neutral' : 'think'; st.lid = .5 * dp; st.hR = mixP([18, -262], [58, -128], dp); st.headTilt = -4 * dp;
        } else {
          /* bell rope (hL), alarm (hR), then the phone */
          const rope = reach(x, y, s, 934, 476);
          const yank = Math.max(...[R1, R2, R3].map(t => win(lt, t - .1, t + .02, .1, .14))) * 46;
          const phone = prog(lt, R3 + .25, .14), ear = prog(lt, R3 + .4, .16);
          const hook = reach(x, y, s, 847, 560);
          st.hL = phone > 0 ? mixP(mixP([rope[0], rope[1] + 46], hook, phone), [-34, -300], ear) : [rope[0], rope[1] + yank];
          st.hR = [72, -200 - 30 * Math.abs(Math.sin(lt * 9))]; st.face = 'scared'; st.look = ear > 0 ? [-.6, 0] : [-.9, -.2]; st.shiver = 0;
          st.bob = -6 * Math.max(...[R1, R2, R3].map(t => win(lt, t - .1, t + .02, .1, .14)));
          cn.setHandset(phone > .5 ? 1 : 0); op(hsL, phone > .5 ? 1 : 0);
        }
        if (shot !== 'E') { cn.setHandset(0); op(hsL, 0); }
        L0.set(st);
        op(frost0[0], shot !== 'E' || lt < R1 ? 1 : 0); op(frost0[1], shot !== 'E' || lt < R1 ? 1 : 0);
        /* frost flakes blown off by the bell */
        [[L0, x, R1, 0], [L1, 600, R2, 1]].forEach(([R, px, t0, k]) => flakes[k].forEach((g, j) => { const a = lt - t0;
          if (shot !== 'E' || a < 0 || a > .9) { op(g, 0); return; } op(g, 1 - a / .9);
          const ox = px + (j < 11 ? (hash(j * 3.7 + k) - .5) * 100 : (j % 2 ? 44 : -44)), oy = y - (j < 11 ? 380 : 238), vx = (hash(j * 5.3 + k) - .5) * 620, vy = -260 - hash(j * 2.9 + k) * 340;
          tf(g, ox + vx * a, oy + vy * a + 700 * a * a, a * 400); }));
        /* breath in the cold */
        [[L0, x, 0], [L1, 600, 1]].forEach(([R, px, k]) => { const ph = ((at + k * 1.3) % 2.6) / 2.6, b = breath[k];
          if (ph > .7) { op(b.g, 0); return; } const q = ph / .7; op(b.g, .55 * Math.sin(Math.PI * q));
          const dir = k ? -1 : 1; op(b.g, .42 * Math.sin(Math.PI * q)); tf(b.g, px + dir * (16 + q * 64), y - 268 - q * 26, 0, (.5 + q) * dir, .5 + q); b.b.setAttribute('cx', 14); b.b.setAttribute('cy', -6); });
      }
      /* the berg, now visible dead ahead (shot E) */
      if (shot === 'E') cnIce.set({ x: cn.anchors.aheadL[0], y: cn.anchors.aheadL[1], s: .3, dim: .45, showUnder: 0, face: 'smug', at, look: [.6, -.2] });
    }

    /* ================= FLASHBACK ================= */
    if (shot === 'B' || shot === 'C') {
      const tIn = SB + .05, on = pop(lt, tIn, .5), out = prog(lt, SC - .3, .28);
      trail.forEach((g, i) => { const k = pop(lt, SB - .12 + i * .1, .3) * (1 - out); op(g, k > .01 ? 1 : 0); tf(g, g._x, g._y - Math.sin(at * 2 + i) * 3, 0, Math.max(.01, k)); });
      op(bub, on > .01 && out < 1 ? 1 - out : 0);
      if (shot === 'C') {
        const k = on * (1 + .12 * out);
        bub.setAttribute('transform', `translate(${BX},${BY}) scale(${f2(k * 1000) / 1000}) translate(${-BX},${-BY})`);
        fbSky.anim(at);
        tf(fbRip, -((at * 18) % 56), 0);
        const fv = kv(lt, [[SB, 800, 470, 1], [c(2) + 1.45, 790, 482, 1.04], [c(2) + 2.05, 770, 706, 2.35, easeIO], [c(2) + 2.85, 772, 708, 2.4], [c(2) + 3.5, 820, 470, 1.02, easeIO], [SC, 832, 468, 1.05]]);
        setCam(fbCam, fv);
        tf(farShip, lerp(1010, 1180, clamp((lt - SB) / (SC - SB))), 556 + Math.sin(at * 1.2) * 1.5, 0, .55);
        const hk = prog(lt, c(2) + 3.0, .3);
        const wave = Math.sin(lt * (9 + 4 * hk));
        blair.set({ x: OFX, y: OFY, s: OFS, at, face: 'happy', look: [.5, -.2], turn: .25, hL: [-44, -246], bendL: -1, hR: [76 + wave * 16, -338 + Math.abs(wave) * 8], bendR: 1, headTilt: 4 + wave * 2, bob: Math.sin(lt * 4.5) * 2 });
        tf(kit, OFX - 50 * OFS, OFY - 150 * OFS, -18, OFS);
        const gl = .45 + .35 * Math.sin(at * 3.1) + .6 * win(lt, c(2) + 1.75, c(2) + 2.85, .2, .3);
        tf(keyGlint, 5, -5, at * 40, Math.max(.05, gl * .9)); op(keyGlint, clamp(gl));
        tf(keyB, 17 + Math.sin(lt * 9) * 1.5, -156, Math.sin(lt * 9 + 1) * 12, 1.7);
        op(hanky, hk); if (hk > 0) { const f = Math.sin(at * 16); hankyP.setAttribute('d', `M0,-6 Q14,${f2(-16 + f * 6)} 30,${f2(-10 + f * 10)} Q34,${f2(8 + f * 8)} 26,${f2(22 + f * 6)} Q12,${f2(14 - f * 4)} 0,8 Z`); }
        let sd = ''; for (let i = 0; i < 3; i++) { const q = Math.floor(at * 12 + i * 7); if (hash(q * 1.3 + i) > .45) { const x = 180 + hash(q * 2.7 + i) * 880; sd += `M${f2(x)},40 V620 `; } } scratches.setAttribute('d', sd || 'M0,0');
      }
    }

    /* ================= BRIDGE ================= */
    if (shot === 'F') {
      br.anim(at); br.setTelegraph(1);
      const tPick = c(5) - .38, tHang = c(5) + .75, tCap = c(5) + 1.0, tEyes = ce(5) + .56, tWhip = ce(5) + .84, tDive = ce(5) + 1.16, tFlick = ce(5) + 1.24, tStop = ce(5) + 2.18;
      /* the wheel: spun like a roulette wheel, then the long heave */
      const wa = lt < tFlick ? 0 : lt < tStop ? -900 * easeOut(clamp((lt - tFlick) / (tStop - tFlick))) : -900 - 7 * prog(lt, tStop, 1.6);
      br.setWheel(wa);
      const spinK = lt > tFlick && lt < tStop ? 1 - clamp((lt - tFlick) / (tStop - tFlick)) : 0;
      op(spin, spinK > .05 ? Math.min(1, spinK * 1.6) : 0); if (spinK > .05) spin.setAttribute('transform', `rotate(${f2(wa * .5)} 520 650)`);
      op(clunk, 1 - clamp((lt - tStop) / .25)); if (lt > tStop) tf(clunk, 520, 650, 0, .6 + 1.2 * clamp((lt - tStop) / .25)); else op(clunk, 0);
      op(ring, lt < tPick && Math.sin(lt * 50) > -.2 ? 1 : 0); tf(ring, Math.sin(lt * 70) * 2, 0);
      /* the officer */
      {
        const dv = prog(lt, tDive, .36, easeIO);
        const x = lerp(215, 395, dv), y = 800 - Math.sin(Math.PI * dv) * 36, s = 1;
        const st = { x, y, s, at, rim: .8, rimSide: 1, talk: talkF, face: 'neutral', look: [-.6, -.3], hL: [-58, -128], hR: [58, -128] };
        const up = prog(lt, tPick, .2), atEar = prog(lt, tPick + .2, .16), down = prog(lt, tHang, .14), rest = prog(lt, tHang + .14, .2);
        const hookP = [-72, -342];
        let hL = mixP([-58, -128], hookP, up); hL = mixP(hL, [-34, -298], atEar); hL = mixP(hL, hookP, down); hL = mixP(hL, [-58, -128], rest); st.hL = hL;
        const onPhone = up > .5 && down < .5; br.setHandset(onPhone ? 1 : 0); op(hsB, onPhone ? 1 : 0);
        if (lt > tPick && lt < tHang + .2) { st.look = [-.5, .1]; st.face = 'happy'; }
        st.headTilt = 7 * win(lt, c(5) + .25, c(5) + .7, .15, .2);
        const capK = win(lt, tCap, tCap + .3, .14, .16); st.hR = mixP([58, -128], [42, -372], capK); if (capK > .2) { st.headTilt = -5 + 5 * capK; st.face = 'proud'; }
        const eyes = pop(lt, tEyes, .3);
        if (lt > tEyes) { st.face = 'scared'; st.look = [1, -.1]; st.bob = -12 * Math.sin(Math.PI * clamp((lt - tEyes) / .3)); st.hL = [-74, -196]; st.hR = [74, -200]; }
        if (dv > 0) { st.tilt = 16 * Math.sin(Math.PI * dv); st.hL = mixP([-74, -196], [100, -230], dv); st.hR = mixP([74, -200], [96, -250], dv); st.face = 'scared'; }
        const grab = prog(lt, tStop - .05, .15);
        if (grab > 0) { const a1 = -78 * Math.PI / 180, a2 = -128 * Math.PI / 180; const g1 = reach(x, y, s, 520 + Math.sin(a1) * 95, 650 - Math.cos(a1) * 95), g2 = reach(x, y, s, 520 + Math.sin(a2) * 95, 650 - Math.cos(a2) * 95);
          st.hR = mixP(st.hR, g1, grab); st.hL = mixP(st.hL, g2, grab); st.tilt = -7 * grab + Math.sin(at * 9) * 1.2 * grab; st.face = 'focus'; st.sweat = .8 * grab; st.look = [.6, -.3]; st.bob = 3 * grab; }
        else if (dv > .6 && lt < tStop) { st.hR = [118 + Math.sin(lt * 40) * 10, -210]; st.hL = [96, -170]; }
        OF.set(st);
        bigEyes.forEach(e => { const k = eyes * (1 - prog(lt, tStop, .3)); op(e.g, k > .02 ? 1 : 0); tf(e.g, e.sd * 17, -305, 0, Math.max(.02, k)); tf(e.p, 6 + Math.sin(at * 30) * .8, -2); });
      }
      /* the quartermaster at the helm */
      {
        const x = 520, y = 792, s = 1; const st = { x, y, s, at, rim: .8, rimSide: 1, face: 'neutral', look: [-.4, -.1] };
        const gp = i => reach(x, y, s, ...br.wheelGrip(i));
        if (lt < tFlick) { st.hL = gp(0); st.hR = gp(1); if (lt > tEyes) { st.face = 'surprise'; st.look = [-1, -.1]; } }
        else if (lt < tStop - .05) { const q = clamp((lt - tFlick) / .12); st.hL = [-80, -250]; st.hR = mixP([30, -180], [86, -268], q); st.face = 'surprise'; st.look = [0, .5]; st.bob = -4; }
        else { st.hL = gp(0); st.hR = gp(1); st.face = 'focus'; st.tilt = -6 + Math.sin(at * 8) * 1.2; st.sweat = .7; st.look = [-.2, -.2]; }
        QM.set(st);
      }
      /* through the window: the berg creeps sideways while the snail overtakes it */
      const bx = k1(lt, [[tDive, 925], [SF, 960, lin]]);
      bice.set({ x: bx, y: br.anchors.iceberg[1], s: .45, dim: .3, showUnder: 0, face: lt > tStop + .3 ? 'whistle' : 'smug', at, look: lt > tStop + .3 ? undefined : [-.4, .3] });
      const snx = k1(lt, [[tDive - .1, 660], [SF, 1035, lin]]);
      const crawl = Math.sin(at * 5) * .5 + .5;
      tf(snail, snx, 470, 0, 1.5); op(snail, prog(lt, tWhip, .2)); op(snailTrail, prog(lt, tWhip, .2)); tf(snBody, 0, 0, 0, 1 + .06 * crawl, 1 - .03 * crawl); tf(stalks, 0, 0, Math.sin(at * 2.2) * 6);
      snailTrail.setAttribute('d', `M${f2(Math.min(660, snx - 40))},469 L${f2(snx - 40)},469`);
      const camV = kv(lt, [[SE, 300, 560, 1.4], [c(5) + .9, 318, 552, 1.47], [tWhip, 330, 548, 1.48], [tWhip + .32, 610, 500, 1.04, easeIO], [tStop, 655, 495, 1.06], [SF, 790, 468, 1.22]]);
      const sh = shake(lt, [tStop], 8, .2);
      setCam(brCam, camV, sh[0], sh[1]);
    }
  };
}});
