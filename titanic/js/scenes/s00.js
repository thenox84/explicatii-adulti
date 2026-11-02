"use strict";
/* SCENE 0 — Opening: Southampton quay, 10 April 1912. No chapter sign: the scene owns the whole frame.
   Beat sheet (lt; cN = cue(N), eN = cue.e(N); [current timings]):
   A  0 → c0+2.75        [0–6.25]   WIDE dock establishing shot. The iris opens on the in-sky title "TITANIC"
                                    (letters pop) with a "Practically Unsinkable" ribbon held by two gulls;
                                    slow push-in; the title flies off c0+1.5 → c0+3 [5.0–6.5].            (line 0)
   B  c0+2.75 → c1-.25   [6.25–11.2] CUT to the hull at quay level (band, crowd). The camera tilts up and up:
                                    black hull, portholes, white decks, a funnel, smoke, clouds… into starry
                                    space (it ran out of sky), shuffles, then sheepishly drops back down past
                                    a seagull resting on a rivet.                                         (line 0)
   C  c1-.25 → e1+.5     [11.2–14.8] Gangway: the Owner flings his arms wide, his top hat springs off, the
                                    PRACTICALLY UNSINKABLE banner unrolls behind him.                     (line 1)
   D  c2-.4 → c2+2.75    [14.5–17.6] Newsboys pop up waving PRACTICALLY UNSINKABLE papers;
      c2+2.75 → e2+.3    [17.6–20.9] push-in on the small word: it peeks, rolls up its sleeves, sweats.  (line 2)
   E  c3-.5 → e3         [20.6–24.7] Shipbuilder holds up THE SHIPBUILDER: micro-print "practically";
                                    a magnifying glass, then a bigger one behind it → readable. Meanwhile
                                    the Owner marches up the gangway.                                    (line 3)
   F  c4 → c5-.1         [25.0–28.2] Owner rips PRACTICALLY off, crumples it, stuffs it in his waistcoat
                                    pocket; UNSINKABLE gleams alone; he strolls into the ship.            (line 4)
   G  c5-.9 → c6         [27.4–31.6] Porters wobble up the gangway under the 12-piece tower, Mitzi on top
                                    like a figurehead (ducks under the door); the Lady follows, fanning. (line 5)
   H  c6-.25 → c7-.32    [31.4–35.45] Doorway: the Captain sets his teacup on the rail; push-in: not a ripple
                                    while the tower wobbles behind; proud wink.                          (line 6)
   I  c7-.32 → c8-.32    [35.45–38.8] WIDE: whistle, Titanic pulls away; the moored liner's ropes snap
                                    (TWANG!), suction drags it at her stern; the tug yanks it back with a
                                    whisker to spare.                                                     (line 7)
   J  c8-.32 → c8+1.95   [38.8–41.1] Stern deck: the reporter scribbles OMEN?; the Owner snatches the
                                    notebook and flings it overboard (splash).                            (line 8)
   K  c8+1.95 → end      [41.1–43.08] WIDE harbour mouth: a gull lands on the floating notebook and reads
                                    it while Titanic steams out to sea; iris closes.                      (line 8/tail) */
SCENE(0, { build(world, cue) {
  const c = cue, ce = cue.e, D = cue.d;
  const T_CLOSE = c(0) + 2.75, T_DEP = c(7) - .32, T_DECK = c(8) - .32, T_FIN = c(8) + 1.95;
  const XD = 4400;                                   /* deck set lives far right in the close layer */

  /* ================= helpers (local) ================= */
  const PI2 = Math.PI * 2;
  const kf = (t, K) => {                              /* camera keys [t, cx, cy, z, easing?] */
    if (t <= K[0][0]) return K[0].slice(1, 4);
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
      const a = K[i - 1], b = K[i], p = (b[4] || ease)(clamp((t - a[0]) / Math.max(.001, b[0] - a[0])));
      return [lerp(a[1], b[1], p), lerp(a[2], b[2], p), lerp(a[3], b[3], p)];
    }
    return K[K.length - 1].slice(1, 4);
  };
  /* camera = an outer scale group (written only when the zoom changes) + an inner pure translation.
     A pure-translation change does not force Blink to re-lay-out every SVG text below the camera. */
  const camSet = (g, v, p = 1) => {
    const z = Math.round(v[2] * 1000) / 1000, o = g.parentNode;
    if (o._z !== z) { o._z = z; o.setAttribute('transform', `translate(800,450) scale(${z})`); }
    g.setAttribute('transform', `translate(${f2(-(800 + (v[0] - 800) * p))},${f2(-(450 + (v[1] - 450) * p))})`);
  };
  const lin = t => t;
  const inOut3 = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const pat = (w, h, draw) => { const id = uid('s0p'); const p = E('pattern', { id, width: w, height: h, patternUnits: 'userSpaceOnUse' }, DEFS); draw(p); return 'url(#' + id + ')'; };
  const dots = L => L.map(([x, y, r]) => `M${f2(x - r)},${f2(y)}a${f2(r)},${f2(r)} 0 1,0 ${f2(2 * r)},0a${f2(r)},${f2(r)} 0 1,0 ${f2(-2 * r)},0`).join('');
  /* walking feet on a slope k (dy/dx); ph = phase in steps/2 */
  const gait = (ph, k = 0, amp = 1) => {
    const a = Math.sin(ph * PI2), b = Math.cos(ph * PI2);
    const xl = -22 + a * 16 * amp, xr = 22 - a * 16 * amp;
    return { fL: [xl, xl * k - Math.max(0, b) * 10 * amp], fR: [xr, xr * k - Math.max(0, -b) * 10 * amp], bob: -Math.abs(b) * 4 * amp + 2 * amp, sw: a };
  };
  const stand = (k = 0) => ({ fL: [-22, -22 * k], fR: [22, 22 * k] });
  const toLocal = (px, py, s, w) => [(w[0] - px) / s, (w[1] - py) / s];
  const toWorld = (px, py, s, h) => [px + h[0] * s, py + h[1] * s];
  const mixP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  /* a perched / flying seagull, origin at the feet, facing +x */
  const mkGull = (p, s0 = 1) => {
    const g = G(p), body = G(g);
    const legs = E('path', { d: 'M-4,-13 L-6,0 M6,-13 L6,0 M-11,0 H-1 M1,0 H11', stroke: '#E8963A', 'stroke-width': 3, 'stroke-linecap': 'round' }, body);
    E('path', { d: 'M-20,-31 L-42,-27 L-21,-19 Z', fill: '#2F323B' }, body);
    E('ellipse', { cx: 0, cy: -28, rx: 25, ry: 15, fill: '#FFFFFF' }, body);
    E('ellipse', { cx: 2, cy: -21, rx: 18, ry: 6, fill: '#E3E8EF' }, body);
    const fold = E('path', { d: 'M-24,-33 Q-2,-46 17,-31 Q2,-21 -26,-24 Z M-26,-24 L-38,-21 L-24,-29 Z', fill: '#A7B2C2' }, body);
    const wings = E('path', { fill: '#C9D2DE', stroke: '#2F323B', 'stroke-width': 2 }, body);
    const head = G(body); tf(head, 17, -43);
    E('circle', { r: 12.5, fill: '#FFFFFF' }, head);
    E('path', { d: 'M9,-2 L27,1 L23,6 L9,4 Z', fill: '#F2B33D' }, head);
    E('circle', { cx: 21, cy: 4, r: 1.7, fill: '#D9452B' }, head);
    const eye = E('ellipse', { cx: 4, cy: -3, rx: 2.5, ry: 2.9, fill: '#1E1E24' }, head);
    const brow = E('path', { d: 'M-1,-9 L8,-8', stroke: '#6A7080', 'stroke-width': 2, 'stroke-linecap': 'round' }, head);
    const Gl = { g, body, head, eye, brow, legs, fold, wings };
    /* fly: 0 perched … 1 flapping; ht = head tilt; blink 0..1 */
    Gl.set = (o) => {
      tf(g, o.x, o.y, o.rot || 0, (o.s || s0) * (o.flip ? -1 : 1), o.s || s0);
      const fl = o.fly || 0;
      op(fold, 1 - fl); op(legs, fl > .6 ? .4 : 1);
      if (fl > 0) { const f = Math.sin((o.at || 0) * 16) * fl; wings.setAttribute('d', `M-4,-34 Q-22,${f2(-58 - 26 * f)} -48,${f2(-50 - 40 * f)} Q-24,${f2(-44 - 10 * f)} -6,-26 Z M6,-34 Q22,${f2(-58 - 26 * f)} 44,${f2(-52 - 38 * f)} Q22,${f2(-44 - 10 * f)} 8,-26 Z`); op(wings, 1); }
      else op(wings, 0);
      head.setAttribute('transform', `translate(17,-43) rotate(${f2(o.ht || 0)})`);
      eye.setAttribute('ry', f2(2.9 * Math.max(.12, o.blink != null ? o.blink : 1)));
      brow.setAttribute('transform', `rotate(${f2(o.brow || 0)} 4 -8)`);
    };
    return Gl;
  };
  /* simple flying gull (M wings) */
  const mkFly = (p, col = '#FFFFFF') => {
    const g = G(p);
    const w = E('path', { stroke: col, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const tip = E('path', { stroke: '#3A3F4C', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: 0, cy: 2, rx: 8, ry: 4, fill: col }, g);
    return { g, set: (x, y, s, f, r = 0) => { tf(g, x, y, r, s); w.setAttribute('d', `M-26,${f2(-8 * f)} Q-13,${f2(-15 * f - 4)} 0,0 Q13,${f2(-15 * f - 4)} 26,${f2(-8 * f)}`); tip.setAttribute('d', `M-29,${f2(-8 * f + 2)} L-25,${f2(-8 * f)} M25,${f2(-8 * f)} L29,${f2(-8 * f + 2)}`); } };
  };
  /* comic burst with a word */
  const mkBurst = (p, word, size, col = '#FFE066') => {
    const g = G(p); let d = ''; const n = 14;
    for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * PI2, r = (i % 2 ? .62 : 1) * (1 + .12 * hash(i * 3.1)); d += (i ? 'L' : 'M') + f2(Math.cos(a) * r * size * 2.6) + ',' + f2(Math.sin(a) * r * size * 1.5); }
    E('path', { d: d + 'Z', fill: col, stroke: '#1D2B53', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    TX(g, 0, size * .36, word, size, '#B3261E', { a: 'middle', w: 900 });
    return g;
  };
  /* notebook (reporter's pad), origin = centre, ~70×88 */
  const mkPad = (p, big) => {
    const g = G(p);
    E('rect', { x: -33, y: -42, width: 70, height: 88, rx: 5, fill: '#000', 'fill-opacity': .18 }, g);
    E('rect', { x: -36, y: -46, width: 70, height: 88, rx: 5, fill: '#FBF6E4', stroke: '#B9AE8E', 'stroke-width': 2 }, g);
    E('path', { d: 'M-28,-14 H26 M-28,-2 H26 M-28,10 H26 M-28,22 H26 M-28,34 H26', stroke: '#9DB8D6', 'stroke-width': 1.2 }, g);
    E('path', { d: 'M-26,-46 V-52 M-14,-46 V-52 M-2,-46 V-52 M10,-46 V-52 M22,-46 V-52', stroke: '#6E6A60', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, g);
    const t1 = TX(g, -1, -22, 'NEAR MISS!', 10.5, '#22305A', { a: 'middle', w: 800, hand: true });
    const t2 = TX(g, -1, 15, 'OMEN?', 20, '#B3261E', { a: 'middle', w: 900, hand: true });
    E('path', { d: 'M-24,24 Q-2,30 22,22', stroke: '#B3261E', 'stroke-width': 2, fill: 'none' }, g);
    return { g, t1, t2 };
  };

  /* ================= layers ================= */
  const WL = G(world), WC = G(G(WL));                 /* wide (dock) */
  const CL = G(world), CC = G(G(CL)), CF = G(G(CL));  /* close (gangway / deck) + foreground parallax */
  const OV = G(world);                                /* screen-space (title, speed lines) */

  /* ================================================================
     WIDE LAYER: sky, extension shores, Dock, ships, tugs
     ================================================================ */
  const sky = Sky(WC, { mood: 'day', y: 452, x0: -1700, w: 5800, y0: -520, gulls: 7, sun: [1330, 96] });
  /* extend shore + water beyond the Dock's x range (-160…1760) */
  {
    const ext = G(WC), hz = (col, k = .45) => mix(col, '#C3D5DE', k);
    const WG = lgrad([[0, '#8DB3BE'], [.25, '#6A97A6'], [1, '#3E6E80']]);   /* only outside the Dock's own water (-160…1760) */
    E('rect', { x: -1800, y: 452, width: 1645, height: 560, fill: WG }, ext); E('rect', { x: 1755, y: 452, width: 2445, height: 560, fill: WG }, ext);
    E('rect', { x: -1800, y: 1008, width: 6000, height: 500, fill: '#3E6E80' }, ext);
    let hl = 'M-1800,452'; for (let x = -1800; x <= -120; x += 40) hl += ` L${x},${f2(452 - 26 - Math.sin(x * .004) * 18 - Math.sin(x * .011 + 1) * 8)}`; hl += ' L-120,452 Z';
    let hr = 'M1720,452'; for (let x = 1720; x <= 2900; x += 40) { const k = clamp((2900 - x) / 1180); hr += ` L${x},${f2(452 - (26 + Math.sin(x * .004) * 18 + Math.sin(x * .011 + 1) * 8) * Math.pow(k, .7))}`; } hr += ' L2900,452 Z';
    E('path', { d: hl + hr, fill: hz('#7E9C88', .55) }, ext);
    let tw = '', rf = '';
    const town = (x0, x1, sd, fade) => { let x = x0; for (let i = 0; x < x1; i++) { const bw = 34 + hash(i * 3.1 + sd) * 70, bh = (14 + hash(i * 4.7 + sd) * 40) * (fade ? clamp((x1 - x) / (x1 - x0) * 1.6) : 1); if (bh > 6) { tw += `M${f2(x)},${f2(448 - bh)}h${f2(bw)}v${f2(bh + 4)}h${f2(-bw)}Z`; rf += `M${f2(x - 2)},${f2(448 - bh)} L${f2(x + bw / 2)},${f2(448 - bh - 10)} L${f2(x + bw + 2)},${f2(448 - bh)}Z`; } x += bw + 3; } };
    town(-1800, -150, 5, false); town(1770, 2500, 9, true);
    E('path', { d: tw, fill: hz('#B49A86') }, ext); E('path', { d: rf, fill: hz('#6E5A5A') }, ext);
    /* lighthouse on the far spit */
    E('path', { d: 'M2640,450 L2646,404 L2656,404 L2662,450 Z M2643,404 h22 v-6 h-22 Z', fill: hz('#F2EEE4', .3) }, ext);
    E('path', { d: 'M2646,398 h12 v-10 h-12 Z', fill: hz('#C0392B', .3) }, ext);
    let rp = ''; for (let i = 0; i < 60; i++) { const x = -1700 + hash(i * 2.3 + 1) * 1550, y = 470 + Math.pow(hash(i * 5.1), 1.2) * 250; rp += `M${f2(x)},${f2(y)}h${f2(12 + hash(i) * 30)}`; }
    for (let i = 0; i < 90; i++) { const x = 1760 + hash(i * 3.7 + 2) * 2200, y = 466 + Math.pow(hash(i * 1.9), 1.3) * 560; rp += `M${f2(x)},${f2(y)}h${f2(14 + hash(i * 4.1) * 46 * (y - 400) / 400)}`; }
    E('path', { d: rp, stroke: '#D2E6EC', 'stroke-width': 2, 'stroke-opacity': .45, 'stroke-linecap': 'round' }, ext);
  }
  const dk = Dock(WC, { crowdGap: [[40, 740]], craneX: [[790, 1], [1045, 1], [1300, 1]] });
  /* the smaller moored liner (astern of Titanic) */
  const NY = G(dk.mid);
  {
    E('path', { d: 'M-300,2 L300,2 L290,12 L-290,12 Z', fill: '#000', 'fill-opacity': .16 }, NY);
    E('path', { d: 'M-212,-58 L-218,-236 M40,-60 L36,-256 M244,-62 L240,-222 M-218,-236 L36,-256 L240,-222 M-218,-236 L-300,-60 M240,-222 L322,-66', stroke: '#3A3530', 'stroke-width': 3, fill: 'none' }, NY);
    [-96, 52].forEach(fx => { E('path', { d: `M${fx - 22},-90 L${fx - 31},-200 L${fx + 15},-200 L${fx + 22},-90 Z`, fill: '#1E1F25' }, NY); E('path', { d: `M${fx - 27},-160 L${fx + 18},-160 L${fx + 19},-145 L${fx - 26},-145 Z`, fill: '#F2EEE4' }, NY); });
    E('path', { d: 'M-232,-56 L-232,-92 L212,-96 L212,-58 Z', fill: '#EDE8DC' }, NY);
    E('path', { d: 'M-222,-76 L202,-79', stroke: '#6F8094', 'stroke-width': 9, 'stroke-dasharray': '11 8' }, NY);
    E('path', { d: 'M118,-96 h76 v-22 h-76 Z', fill: '#E3DCCB' }, NY);
    E('path', { d: 'M-320,-60 Q-150,-50 0,-48 Q170,-48 302,-64 L330,-66 Q318,-30 300,0 L-300,0 Q-322,-28 -320,-60 Z', fill: '#1F2129' }, NY);
    E('path', { d: 'M-312,-57 Q-150,-48 0,-46 Q170,-46 302,-61', stroke: '#C9A24A', 'stroke-width': 3, fill: 'none' }, NY);
    E('path', { d: 'M-288,-30 Q0,-24 296,-36', stroke: '#C9D3DA', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '0 14', fill: 'none' }, NY);
    E('path', { d: 'M-301,-7 L302,-7 L299,0 L-300,0 Z', fill: '#8C2A24' }, NY);
  }
  const nyFlag = E('path', { fill: '#C0392B' }, NY);
  const sh = Titanic(dk.mid, {});
  const tugA = Tugboat(dk.mid), tugB = Tugboat(dk.mid);
  /* whistle steam (front funnel) */
  const whistle = G(dk.mid); const wPuffs = [0, 1, 2, 3, 4].map(i => E('circle', { r: 8, fill: '#FFFFFF' }, whistle));
  /* quay extension (left + right pier head) drawn first in front */
  {
    const q = G(dk.front); dk.front.insertBefore(q, dk.front.firstChild);
    const QG = lgrad([[0, '#B6A487'], [1, '#8E7A60']]);
    E('rect', { x: -1800, y: 700, width: 1660, height: 380, fill: QG }, q); E('rect', { x: -1800, y: 1078, width: 1660, height: 80, fill: '#8E7A60' }, q);
    E('path', { d: 'M1740,700 H1990 Q2030,700 2034,740 V1080 H1740 Z', fill: QG }, q); E('rect', { x: 1740, y: 1078, width: 294, height: 80, fill: '#8E7A60' }, q);
    const cobW = pat(34, 16, p => { E('rect', { x: 1, y: 1, width: 15, height: 6, rx: 3, fill: '#000', 'fill-opacity': .08 }, p); E('rect', { x: 18, y: 9, width: 14, height: 6, rx: 3, fill: '#000', 'fill-opacity': .08 }, p); E('rect', { x: 3, y: 2, width: 8, height: 2, rx: 1, fill: '#fff', 'fill-opacity': .08 }, p); });
    E('rect', { x: -1800, y: 714, width: 1660, height: 400, fill: cobW }, q);
    E('path', { d: 'M1740,714 H1990 Q2022,716 2022,744 V1120 H1740 Z', fill: cobW }, q);
    [[748, 9], [846, 13]].forEach(([ry, gap]) => { let sd = ''; for (let x = -1800; x < -150; x += 20) sd += `M${x},${ry - 2} h9 v${gap + 4} h-9 Z `; E('path', { d: sd, fill: '#5E4E3E', 'fill-opacity': .55 }, q); E('path', { d: `M-1800,${ry} H-150 M-1800,${ry + gap} H-150`, stroke: '#6E6A66', 'stroke-width': 3 }, q); });
    E('rect', { x: -1800, y: 700, width: 1660, height: 12, fill: '#CFC6B6' }, q);
    let jd2 = ''; for (let x = -1800; x < -150; x += 46) jd2 += `M${x},700 v12 `; E('path', { d: jd2, stroke: '#9E9484', 'stroke-width': 1.5 }, q);
    E('path', { d: 'M1740,700 H1990 Q2030,700 2034,740 L2022,744 Q2018,712 1990,712 H1740 Z', fill: '#CFC6B6' }, q);
    E('path', { d: 'M2034,740 V1120 L2046,1120 V744 Z', fill: '#6E6050' }, q);
    let b = ''; [-290, -460, -630, -800].forEach(bx => { b += `M${bx - 7},712 L${bx - 5.5},700 Q${bx - 9},699 ${bx - 9},696 L${bx + 9},696 Q${bx + 9},699 ${bx + 5.5},700 L${bx + 7},712 Z `; }); E('path', { d: b, fill: '#24262B' }, q);
    /* pier-head lighthouse */
    E('path', { d: 'M1940,712 L1950,600 L1978,600 L1988,712 Z', fill: '#F2EEE4' }, q);
    E('path', { d: 'M1944,668 h40 v12 h-40 Z M1947,632 h34 v10 h-34 Z', fill: '#C0392B' }, q);
    E('path', { d: 'M1944,600 h40 v-8 h-40 Z M1952,592 h24 v-24 h-24 Z', fill: '#2E3A44' }, q);
    E('path', { d: 'M1955,589 h18 v-18 h-18 Z', fill: '#FFE9A8' }, q);
    E('path', { d: 'M1950,568 L1964,554 L1978,568 Z', fill: '#C0392B' }, q);
  }
  /* mini gangway on the wide shot + mini brass band in the crowd gap */
  const miniGang = G(dk.front); dk.front.insertBefore(miniGang, dk.ropes);
  E('path', { d: 'M1086,712 L960,596 L972,594 L1100,712 Z', fill: '#8A6A48' }, miniGang);
  E('path', { d: 'M1088,690 L962,576 M1086,712 V690 M1044,673 V652 M1003,636 V615 M962,598 V576', stroke: '#F2EEE4', 'stroke-width': 2.5, fill: 'none' }, miniGang);
  E('path', { d: 'M948,594 h22 v-30 h-22 Z', fill: '#3A2A20' }, miniGang);
  const miniBand = G(dk.crowd); dk.crowd.insertBefore(miniBand, dk.crowdRows[2]);
  const mbM = [];
  [[470, 0], [512, 1], [554, 2], [596, 0], [638, 3]].forEach(([x, k], i) => {
    const m = G(miniBand); tf(m, x, 770, 0, .62);
    E('path', { d: 'M-5,-44 L-6,-2 M5,-44 L6,-2', stroke: '#1F2638', 'stroke-width': 7, 'stroke-linecap': 'round' }, m);
    E('path', { d: 'M-13,-82 Q-15,-60 -14,-40 L14,-40 Q15,-60 13,-82 Q0,-86 -13,-82 Z', fill: '#2A3C6E' }, m);
    E('circle', { cx: 0, cy: -92, r: 9, fill: '#F1C9A5' }, m);
    E('path', { d: 'M-10,-97 h20 v-6 h-20 Z M-12,-97 h24 v3 h-24 Z', fill: '#1D2440' }, m);
    const ins = k === 0 ? 'M-6,-70 a16,16 0 1,0 0.1,0 M8,-74 L20,-112 L34,-104 L14,-70' : k === 1 ? 'M4,-80 L38,-80 M38,-86 L46,-74' : k === 2 ? 'M-14,-64 a18,18 0 1,0 0.1,0' : 'M4,-80 L30,-84 L40,-92 L42,-76 Z';
    E('path', { d: ins, fill: k === 2 ? '#C0392B' : 'none', stroke: '#E8B931', 'stroke-width': k === 2 ? 3 : 5, 'stroke-linejoin': 'round' }, m);
    mbM.push({ m, x, k, ph: i * 1.3 });
  });
  /* New York ropes (to bollards at -460 and 50) + TWANG */
  const nyRopes = G(dk.front); dk.front.insertBefore(nyRopes, dk.ropes);
  const ropeEl = [0, 1, 2, 3].map(() => E('path', { stroke: '#6E5434', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, nyRopes));
  const twang = mkBurst(WC, 'TWANG!', 30);
  const twangLines = E('path', { stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, WC);
  const squeeze = mkFly(WC);
  const alarm = mkBurst(WC, '!', 40, '#FFFFFF');
  /* final shot: floating notebook + gull */
  const finG = G(WC);
  const finRip = E('path', { fill: 'none', stroke: '#E6F4F8', 'stroke-width': 3, 'stroke-opacity': .7 }, finG);
  const finPadG = G(finG); const finPad = mkPad(G(finPadG, { transform: 'rotate(-4) scale(2.3,1.012)' }));
  const finGull = mkGull(finG, 1.5);
  const finSplash = E('path', { fill: '#FFFFFF', 'fill-opacity': .8 }, finG);
  const buoy = G(finG); E('path', { d: 'M-22,0 L-14,-58 L14,-58 L22,0 Z', fill: '#C0392B' }, buoy); E('path', { d: 'M-18,-26 h36 v12 h-36 Z', fill: '#F4F1EA' }, buoy); E('path', { d: 'M0,-58 V-84 M-8,-84 h16', stroke: '#2A2A30', 'stroke-width': 4 }, buoy); E('ellipse', { cx: 0, cy: 2, rx: 34, ry: 7, fill: '#2E5A6A', 'fill-opacity': .5 }, buoy);

  /* ================================================================
     CLOSE LAYER (gangway set at x -900…2700; deck set at XD)
     ================================================================ */
  /* ---------- deck set backdrop (first = behind the shared characters) ---------- */
  const deckBG = G(CC), HZD = 372;
  {
    E('rect', { x: XD - 400, y: -300, width: 2600, height: HZD + 302, fill: lgrad([[0, '#3E86CF'], [.5, '#7DBCE9'], [.85, '#B9E0F4'], [1, '#DDF2F8']]) }, deckBG);
    E('circle', { cx: XD + 1350, cy: 110, r: 64, fill: '#FFF6D0', 'fill-opacity': .25 }, deckBG); E('circle', { cx: XD + 1350, cy: 110, r: 40, fill: '#FFFBE6' }, deckBG);
    [[XD + 330, 170, 340, 3], [XD + 1050, 250, 230, 8], [XD + 1560, 150, 260, 13]].forEach(([x, y, w, sd]) => { const cl = wldCloud(deckBG, w, '#FFFFFF', '#D3E5F2', '#FFFFFF', sd, false); tf(cl, x, y); });
    E('rect', { x: XD - 400, y: HZD, width: 2600, height: 760, fill: lgrad([[0, '#8DB3BE'], [.3, '#6A97A6'], [1, '#3E6E80']]) }, deckBG);
  }
  const deckSlide = G(deckBG);                       /* the harbour behind, sliding as the ship moves */
  {
    let hd = `M${XD - 900},${HZD}`; for (let x = XD - 900; x <= XD + 2600; x += 50) hd += ` L${x},${f2(HZD - 70 - Math.sin(x * .004) * 22 - Math.sin(x * .013) * 9)}`; hd += ` L${XD + 2600},${HZD} Z`;
    E('path', { d: hd, fill: '#9FB8AE' }, deckSlide);
    let tw = '', rf = '', wn = ''; let x = XD - 900;
    for (let i = 0; x < XD + 2600; i++) { const bw = 40 + hash(i * 1.7) * 80, bh = 22 + hash(i * 2.9) * 48; tw += `M${f2(x)},${f2(HZD - 12 - bh)}h${f2(bw)}v${f2(bh)}h${f2(-bw)}Z`; rf += `M${f2(x - 3)},${f2(HZD - 12 - bh)}L${f2(x + bw / 2)},${f2(HZD - 24 - bh)}L${f2(x + bw + 3)},${f2(HZD - 12 - bh)}Z`; for (let k = 0; k < bw / 14 - 1; k++) wn += `M${f2(x + 6 + k * 14)},${f2(HZD - bh)}h5v6h-5Z`; x += bw + 5; }
    E('path', { d: tw, fill: '#C9B6A2' }, deckSlide); E('path', { d: rf, fill: '#8E7474' }, deckSlide); E('path', { d: wn, fill: '#6E6470' }, deckSlide);
    E('path', { d: `M${XD - 260},${HZD - 12} V${HZD - 150} L${XD - 140},${HZD - 210} M${XD + 640},${HZD - 12} V${HZD - 140} L${XD + 530},${HZD - 205} M${XD + 1640},${HZD - 12} V${HZD - 150} L${XD + 1760},${HZD - 215}`, stroke: '#6E6A66', 'stroke-width': 6, fill: 'none' }, deckSlide);
    E('rect', { x: XD - 900, y: HZD - 14, width: 3500, height: 16, fill: '#B6A487' }, deckSlide);
    const crowdD = ['', '', '']; for (let i = 0; i < 170; i++) { const px = XD - 700 + i * 17 + hash(i) * 8, h = 12 + hash(i * 3) * 6; crowdD[i % 3] += `M${f2(px)},${HZD - 14}v${f2(-h)}`; }
    crowdD.forEach((d, i) => E('path', { d, stroke: ['#3E4A6A', '#6A3D5A', '#4A3B33'][i], 'stroke-width': 7, 'stroke-linecap': 'round' }, deckSlide));
    let hats = ''; for (let i = 0; i < 170; i += 2) { const px = XD - 700 + i * 17 + hash(i) * 8, h = 12 + hash(i * 3) * 6; hats += `M${f2(px - 4)},${f2(HZD - 18 - h)}h8`; } E('path', { d: hats, stroke: '#F4EEE0', 'stroke-width': 3 }, deckSlide);
    /* the near-missed liner, small, back at her berth with her tug */
    const n = G(deckSlide); tf(n, XD + 230, HZD + 40, 0, .3);
    E('path', { d: 'M-212,-58 L-218,-236 M40,-60 L36,-256 M244,-62 L240,-222', stroke: '#5A5550', 'stroke-width': 5, fill: 'none' }, n);
    E('path', { d: 'M-118,-90 L-127,-200 L-81,-200 L-74,-90 Z M30,-90 L21,-200 L67,-200 L74,-90 Z', fill: '#2A2B31' }, n);
    E('path', { d: 'M-123,-160 L-78,-160 L-77,-145 L-122,-145 Z M25,-160 L70,-160 L71,-145 L26,-145 Z', fill: '#F2EEE4' }, n);
    E('path', { d: 'M-232,-56 L-232,-92 L212,-96 L212,-58 Z', fill: '#E4DED0' }, n);
    E('path', { d: 'M-320,-60 Q-150,-50 0,-48 Q170,-48 302,-64 L330,-66 Q318,-30 300,0 L-300,0 Q-322,-28 -320,-60 Z', fill: '#2A2C34' }, n);
    E('path', { d: `M${XD + 160},${HZD + 56} h70 l-6,12 h-60 Z M${XD + 175},${HZD + 56} v-16 h24 v16 M${XD + 205},${HZD + 56} v-26 h8 v26`, fill: '#3A3030', stroke: '#3A3030', 'stroke-width': 2 }, deckSlide);
  }
  const deckGulls = [mkFly(deckBG), mkFly(deckBG)];
  const deckRip = E('path', { stroke: '#D2E6EC', 'stroke-width': 2, 'stroke-opacity': .5, fill: 'none', 'stroke-linecap': 'round' }, deckBG);
  const deckSplash = G(deckBG); const dSpl = E('path', { fill: '#FFFFFF', 'fill-opacity': .85 }, deckSplash); const dRing = E('ellipse', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5 }, deckSplash);
  const deckPadFly = G(deckBG); const dPadF = mkPad(deckPadFly);
  {
    /* stern rail, deck, ventilator, lifebuoy */
    const r = G(deckBG);
    E('rect', { x: XD - 400, y: 636, width: 2600, height: 480, fill: lgrad([[0, '#B48A5E'], [1, '#8A6440']]) }, r);
    let pl = ''; for (let i = -30; i <= 30; i++) pl += `M${f2(XD + 800 + i * 40)},636 L${f2(XD + 800 + i * 140)},1100 `; E('path', { d: pl, stroke: '#7A5636', 'stroke-width': 2, 'stroke-opacity': .55 }, r);
    E('path', { d: `M${XD - 400},700 H${XD + 2200} M${XD - 400},790 H${XD + 2200} M${XD - 400},905 H${XD + 2200}`, stroke: '#7A5636', 'stroke-width': 1.5, 'stroke-opacity': .4 }, r);
    E('rect', { x: XD - 400, y: 630, width: 2600, height: 12, fill: '#6E4E30' }, r);
    let ps = ''; for (let x = XD - 400; x < XD + 2200; x += 64) ps += `M${x},516 V632 `; E('path', { d: ps, stroke: '#F2EEE4', 'stroke-width': 7 }, r);
    E('path', { d: `M${XD - 400},556 H${XD + 2200} M${XD - 400},594 H${XD + 2200}`, stroke: '#E4DED0', 'stroke-width': 4 }, r);
    E('rect', { x: XD - 400, y: 506, width: 2600, height: 14, rx: 5, fill: '#9A6A3E' }, r); E('rect', { x: XD - 400, y: 506, width: 2600, height: 4, rx: 2, fill: '#C8955F' }, r);
    /* ventilator cowl */
    const v = G(r); tf(v, XD + 120, 700);
    E('path', { d: 'M-34,0 V-170 Q-34,-250 40,-262 L56,-200 Q20,-196 26,-170 V0 Z', fill: '#F2EEE4' }, v);
    E('ellipse', { cx: 48, cy: -232, rx: 26, ry: 40, fill: '#C0392B', transform: 'rotate(-20 48 -232)' }, v);
    E('ellipse', { cx: 50, cy: -230, rx: 17, ry: 30, fill: '#6E1E18', transform: 'rotate(-20 50 -230)' }, v);
    E('path', { d: 'M-24,-10 V-160', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-opacity': .5 }, v);
    /* lifebuoy on the rail */
    const lb = G(r); tf(lb, XD + 1420, 575);
    E('circle', { r: 40, fill: 'none', stroke: '#F4F1EA', 'stroke-width': 20 }, lb);
    E('circle', { r: 40, fill: 'none', stroke: '#C0392B', 'stroke-width': 20, 'stroke-dasharray': '31.4 31.4' }, lb);
    E('circle', { r: 40, fill: 'none', stroke: '#8A6E4A', 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, lb);
    /* bitts + coiled rope */
    E('path', { d: `M${XD + 1210},860 v-50 h26 v50 Z M${XD + 1260},860 v-50 h26 v50 Z`, fill: '#2E2B29' }, r);
    [34, 24, 14].forEach(rr => E('ellipse', { cx: XD + 260, cy: 880, rx: rr * 2, ry: rr * .6, fill: 'none', stroke: '#B08A5A', 'stroke-width': 7 }, r));
  }

  /* ---------- gangway set: sky (tilt-up), funnel, superstructure ---------- */
  const gang = G(CC);
  const skyC = G(gang);
  E('rect', { x: -900, y: -4900, width: 3600, height: 3810, fill: lgrad([[0, '#03050F'], [.16, '#0B1538'], [.36, '#24539A'], [.55, '#4F9AD8'], [.8, '#9CD0F0'], [1, '#DDF2F8']]) }, skyC);
  {
    const A = [], B = [];
    for (let i = 0; i < 220; i++) { const x = -800 + hash(i * 1.31) * 3400, y = -4850 + Math.pow(hash(i * 2.71), 1.4) * 1700, r = .8 + hash(i * 3.3) * 1.8; (hash(i * 4.4) > .7 ? B : A).push([x, y, r]); }
    E('path', { d: dots(A), fill: '#FFFFFF', 'fill-opacity': .55 }, skyC); E('path', { d: dots(B), fill: '#FFFFFF' }, skyC);
  }
  const twk = [[760, -4060], [1180, -3880], [560, -3720], [1340, -4180], [930, -4320]].map(([x, y], i) => { const g = G(skyC); tf(g, x, y); g.bx = x; g.by = y; E('path', { d: 'M-14,0 Q0,-2 0,-14 Q2,0 14,0 Q0,2 0,14 Q-2,0 -14,0 Z', fill: '#FFF6C8' }, g); return g; });
  const moon = G(skyC); tf(moon, 1260, -3990); E('path', { d: 'M0,-46 A46,46 0 1,0 0,46 A34,40 0 1,1 0,-46 Z', fill: '#FFF2C0' }, moon);
  const cloudsC = [[300, -1900, 360], [1300, -2250, 420], [620, -2700, 300], [1500, -3000, 260], [100, -2400, 240]].map(([x, y, w], i) => ({ c: wldCloud(skyC, w, '#FFFFFF', '#D3E5F2', '#FFFFFF', 20 + i, false), x, y, sp: 8 + i * 3 }));
  const flyC = [0, 1, 2].map(() => mkFly(skyC));
  /* funnel + smoke */
  const fun = G(gang);
  E('path', { d: 'M1060,-1140 L1130,-1560 M760,-1140 L860,-1600', stroke: '#3A3530', 'stroke-width': 4 }, fun);
  E('path', { d: 'M820,-1520 L740,-2560 L1100,-2560 L1180,-1520 Z', fill: '#D9A13F' }, fun);
  E('path', { d: 'M1110,-1520 L1032,-2560 L1100,-2560 L1180,-1520 Z', fill: '#B9822C' }, fun);
  E('path', { d: 'M850,-1520 L772,-2560 L812,-2560 L890,-1520 Z', fill: '#EAC26A' }, fun);
  E('path', { d: 'M752,-2400 L740,-2560 L1100,-2560 L1112,-2400 Z', fill: '#1E1E22' }, fun);
  E('path', { d: 'M734,-2580 L1106,-2580 L1102,-2556 L738,-2556 Z', fill: '#2A2A30' }, fun);
  E('path', { d: 'M752,-2402 L1112,-2402', stroke: '#3A3A40', 'stroke-width': 6 }, fun);
  E('path', { d: 'M1196,-1520 L1120,-2520', stroke: '#C49752', 'stroke-width': 10 }, fun);
  E('rect', { x: 1108, y: -2560, width: 22, height: 50, rx: 6, fill: '#D9B04A' }, fun);
  /* the foremast: so tall it pokes out of the sky */
  E('path', { d: 'M1296,-4000 L1760,-1530 M1296,-4000 L960,-1560 M1310,-3000 L1600,-1530', stroke: '#5A4A3A', 'stroke-width': 3 }, fun);
  E('path', { d: 'M1334,-1530 L1296,-4150', stroke: '#B08A5A', 'stroke-width': 18, 'stroke-linecap': 'round' }, fun);
  E('path', { d: 'M1328,-1600 L1300,-4110', stroke: '#D9B985', 'stroke-width': 5 }, fun);
  E('path', { d: 'M1280,-2640 h66 l-7,46 h-52 Z', fill: '#8A6A48', stroke: '#5A4330', 'stroke-width': 3 }, fun);
  E('path', { d: 'M1214,-3320 H1392 M1240,-3700 H1360', stroke: '#8A6A48', 'stroke-width': 9, 'stroke-linecap': 'round' }, fun);
  E('circle', { cx: 1296, cy: -4160, r: 11, fill: '#D9B04A' }, fun);
  const pennant = E('path', { fill: '#C0392B' }, fun);
  const smokeC = G(gang); const puffs = [];
  for (let i = 0; i < 9; i++) puffs.push(E('circle', { r: 40, fill: ['#4A4644', '#5C5754', '#3A3634'][i % 3] }, smokeC));
  /* superstructure (white decks) */
  const sup = G(gang);
  {
    E('rect', { x: -900, y: -1520, width: 3600, height: 410, fill: '#EEEAE0' }, sup);
    const winP = pat(110, 120, p => { E('rect', { x: 18, y: 26, width: 64, height: 38, rx: 6, fill: '#6F8094' }, p); E('rect', { x: 18, y: 26, width: 64, height: 10, rx: 4, fill: '#A9BCCC' }, p); E('rect', { x: 0, y: 96, width: 110, height: 4, fill: '#D9D2C2' }, p); });
    E('rect', { x: -900, y: -1440, width: 3600, height: 320, fill: winP }, sup);
    E('rect', { x: -900, y: -1530, width: 3600, height: 14, fill: '#C9C2B2' }, sup);
    E('path', { d: 'M-900,-1600 H2700', stroke: '#F4F1EA', 'stroke-width': 5 }, sup);
    E('path', { d: 'M-900,-1530 H2700', stroke: '#F4F1EA', 'stroke-width': 5, 'stroke-dasharray': '5 30' }, sup);
    E('path', { d: 'M-900,-1530 V-1600 M-900,-1565 H2700', stroke: '#F4F1EA', 'stroke-width': 4, fill: 'none' }, sup);
    /* lifeboat on davits */
    E('path', { d: 'M300,-1530 V-1640 Q300,-1690 350,-1690 M640,-1530 V-1640 Q640,-1690 590,-1690', stroke: '#E9E4D8', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, sup);
    E('path', { d: 'M330,-1640 Q470,-1630 620,-1646 Q610,-1596 560,-1588 H380 Q336,-1596 330,-1640 Z', fill: '#F7F4EC', stroke: '#B9B2A2', 'stroke-width': 3 }, sup);
    E('path', { d: 'M330,-1640 Q470,-1630 620,-1646', stroke: '#8A5A34', 'stroke-width': 8, fill: 'none' }, sup);
    E('path', { d: 'M350,-1690 V-1640 M590,-1690 V-1646', stroke: '#6E6A60', 'stroke-width': 2.5 }, sup);
    /* ventilator */
    E('path', { d: 'M1400,-1530 V-1640 Q1400,-1700 1460,-1706 L1470,-1660 Q1446,-1658 1448,-1640 V-1530 Z', fill: '#F2EEE4' }, sup);
    E('ellipse', { cx: 1466, cy: -1684, rx: 18, ry: 28, fill: '#C0392B', transform: 'rotate(-18 1466 -1684)' }, sup);
  }
  /* ---------- the hull wall ---------- */
  const hullG = G(gang);
  const hullP = pat(240, 120, p => {
    E('rect', { width: 240, height: 120, fill: '#22252D' }, p);
    E('path', { d: 'M0,1 H240 M0,61 H240 M1,0 V60 M121,60 V120', stroke: '#30343F', 'stroke-width': 2.5 }, p);
    const R = []; for (let x = 6; x < 240; x += 12) { R.push([x, 6, 1.7]); R.push([x, 66, 1.7]); } for (let y = 12; y < 60; y += 12) { R.push([7, y, 1.6]); R.push([127, y + 60, 1.6]); }
    E('path', { d: dots(R), fill: '#454B59' }, p);
    [30, 90, 150, 210].forEach(x => { E('circle', { cx: x, cy: 98, r: 10, fill: '#A88752' }, p); E('circle', { cx: x, cy: 98, r: 7, fill: '#56657C' }, p); E('circle', { cx: x - 2.5, cy: 95.5, r: 2.2, fill: '#CFE3F2' }, p); });
  });
  E('rect', { x: -900, y: -1112, width: 3600, height: 1830, fill: hullP }, hullG);
  E('rect', { x: -900, y: 520, width: 3600, height: 198, fill: lgrad([[0, '#000', 0], [1, '#000', .45]]) }, hullG);
  E('rect', { x: -900, y: -1122, width: 3600, height: 8, fill: '#C9A24A' }, hullG);
  E('rect', { x: -900, y: -1114, width: 3600, height: 14, fill: '#000', 'fill-opacity': .25 }, hullG);
  /* the rivet the seagull rests on */
  const RIV = [985, -300];
  E('ellipse', { cx: RIV[0] + 2, cy: RIV[1] + 6, rx: 22, ry: 18, fill: '#111317' }, hullG); E('ellipse', { cx: RIV[0], cy: RIV[1], rx: 22, ry: 18, fill: '#4A505E' }, hullG); E('ellipse', { cx: RIV[0] - 7, cy: RIV[1] - 6, rx: 8, ry: 5, fill: '#8A93A6' }, hullG);
  const rivGull = mkGull(hullG, 1.6);
  /* the shell door (Captain's doorway) */
  const lowG = G(gang);
  const doorG = G(lowG);
  E('rect', { x: 28, y: -72, width: 404, height: 410, rx: 16, fill: '#15171C' }, doorG);
  E('rect', { x: 40, y: -60, width: 380, height: 390, rx: 10, fill: lgrad([[0, '#6A4A30'], [.6, '#4A3222'], [1, '#2E1E14']]) }, doorG);
  E('path', { d: 'M40,-60 L170,40 L290,40 L420,-60 Z', fill: '#7A5638' }, doorG);
  E('path', { d: 'M40,330 L170,230 L290,230 L420,330 Z', fill: '#5A3A26' }, doorG);
  E('rect', { x: 170, y: 40, width: 120, height: 190, fill: '#3A2618' }, doorG);
  E('rect', { x: 196, y: 70, width: 68, height: 150, rx: 4, fill: '#FFD98A' }, doorG);
  E('circle', { cx: 230, cy: 60, r: 70, fill: rgrad([[0, '#FFE2A0', .55], [1, '#FFE2A0', 0]]) }, doorG);
  E('path', { d: 'M40,-60 L170,40 M420,-60 L290,40 M40,330 L170,230 M420,330 L290,230', stroke: '#2A1A10', 'stroke-width': 3 }, doorG);
  E('rect', { x: 40, y: -60, width: 380, height: 390, rx: 10, fill: 'none', stroke: '#C9A24A', 'stroke-width': 3, 'stroke-opacity': .6 }, doorG);
  /* the banner (behind the gangway) */
  const banG = G(lowG);
  const BAN = { x0: 440, x1: 1490, y0: 40, y1: 252 };
  E('path', { d: `M${BAN.x0 + 20},40 L${BAN.x0 + 60},-420 M${BAN.x1 - 20},40 L${BAN.x1 - 60},-420`, stroke: '#C9B48A', 'stroke-width': 3 }, banG);
  const banClipId = uid('s0bc'); const banClip = E('clipPath', { id: banClipId, clipPathUnits: 'userSpaceOnUse' }, DEFS);
  const banClipR = E('rect', { x: BAN.x0 - 20, y: BAN.y0, width: BAN.x1 - BAN.x0 + 40, height: 0 }, banClip);
  const banCloth = G(banG, { 'clip-path': `url(#${banClipId})` });
  E('rect', { x: BAN.x0, y: BAN.y0, width: BAN.x1 - BAN.x0, height: BAN.y1 - BAN.y0, fill: GAG.cloth }, banCloth);
  E('rect', { x: BAN.x0 + 7, y: BAN.y0 + 7, width: BAN.x1 - BAN.x0 - 14, height: BAN.y1 - BAN.y0 - 14, fill: 'none', stroke: GAG.red, 'stroke-width': 12 }, banCloth);
  E('rect', { x: BAN.x0 + 20, y: BAN.y0 + 20, width: BAN.x1 - BAN.x0 - 40, height: BAN.y1 - BAN.y0 - 40, fill: 'none', stroke: GAG.red, 'stroke-width': 2, 'stroke-dasharray': '8 6', opacity: .6 }, banCloth);
  E('path', { d: `M${BAN.x0},${BAN.y0 + 60} Q900,${BAN.y0 + 80} ${BAN.x1},${BAN.y0 + 56} M${BAN.x0},${BAN.y1 - 40} Q1000,${BAN.y1 - 20} ${BAN.x1},${BAN.y1 - 46}`, stroke: GAG.clothShade, 'stroke-width': 10, 'stroke-opacity': .45, fill: 'none' }, banCloth);
  const patchGhost = G(banCloth);
  E('rect', { x: 487, y: 120, width: 206, height: 58, fill: '#FBF4E2', stroke: GAG.clothShade, 'stroke-width': 2, 'stroke-dasharray': '3 4' }, patchGhost);
  E('path', { d: 'M490,124 l-6,-8 M520,122 l2,-9 M600,176 l3,9 M660,124 l5,-8 M690,170 l8,5', stroke: '#8A7A5A', 'stroke-width': 1.5 }, patchGhost);
  const UNS = { x: 1100, y: 196 };
  const unsSh = TX(banCloth, UNS.x + 5, UNS.y + 6, 'UNSINKABLE', 112, GAG.navy, { a: 'middle', w: 900 });
  const unsT = TX(banCloth, UNS.x, UNS.y, 'UNSINKABLE', 112, GAG.gold, { a: 'middle', w: 900 });
  [unsSh, unsT].forEach(t => { t.setAttribute('textLength', 740); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); });
  unsT.setAttribute('stroke', GAG.goldDark); unsT.setAttribute('stroke-width', 3); unsT.setAttribute('paint-order', 'stroke');
  /* gleam sweep clipped to the letters */
  const glClipId = uid('s0gl'); const glClip = E('clipPath', { id: glClipId }, DEFS);
  const glTxt = TX(glClip, UNS.x, UNS.y, 'UNSINKABLE', 112, '#fff', { a: 'middle', w: 900 }); glTxt.setAttribute('textLength', 740); glTxt.setAttribute('lengthAdjust', 'spacingAndGlyphs');
  const gleamG = G(banCloth, { 'clip-path': `url(#${glClipId})` });
  const gleam = E('path', { d: 'M-40,0 L40,0 L0,200 L-80,200 Z', fill: '#FFFFFF', 'fill-opacity': .75 }, gleamG);
  const sparks = [[760, 104], [905, 96], [1180, 98], [1380, 112], [1450, 180], [820, 186]].map(([x, y]) => { const g = G(banG); tf(g, x, y); g.bx = x; g.by = y; E('path', { d: 'M-16,0 Q0,-2 0,-16 Q2,0 16,0 Q0,2 0,16 Q-2,0 -16,0 Z', fill: '#FFF8D6' }, g); return g; });
  const banRoll = G(banG);
  E('rect', { x: BAN.x0 - 8, y: -11, width: BAN.x1 - BAN.x0 + 16, height: 22, rx: 11, fill: '#E2D3B0', stroke: '#B9A57E', 'stroke-width': 2 }, banRoll);
  E('path', { d: `M${BAN.x0},-4 H${BAN.x1}`, stroke: GAG.red, 'stroke-width': 4 }, banRoll);
  const banPole = E('rect', { x: BAN.x0 - 22, y: 32, width: BAN.x1 - BAN.x0 + 44, height: 12, rx: 6, fill: '#8A5A34' }, banG);
  /* the PRACTICALLY strip: a gagWord in its own group (+ arms, eyes, sweat) */
  const wordG = G(banG); const word = gagWord(wordG);
  const wordX = G(wordG);
  const wArms = [0, 1].map(i => { const a = G(wordX);
    const arm = E('path', { stroke: '#F2C6A0', 'stroke-width': 11, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, a);
    const sl = E('path', { stroke: '#9DC0E8', 'stroke-width': 19, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, a);
    const cuff = E('ellipse', { rx: 12, ry: 7, fill: '#6E98CC', stroke: '#1D2B53', 'stroke-width': 1.5 }, a);
    const hand = E('circle', { r: 11, fill: '#FFFFFF', stroke: '#1D2B53', 'stroke-width': 2.5 }, a); return { a, sl, arm, cuff, hand }; });
  const wEyes = G(wordX); const wEyeW = [-30, 30].map(x => { E('ellipse', { cx: x, cy: -38, rx: 13, ry: 15, fill: '#FFFFFF', stroke: '#1D2B53', 'stroke-width': 2.5 }, wEyes); return E('circle', { cx: x, cy: -36, r: 5.5, fill: '#1D2B53' }, wEyes); });
  const wBrows = E('path', { stroke: '#1D2B53', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, wEyes);
  const wDrops = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-9 Q7,0 0,6 Q-7,0 0,-9 Z', fill: '#8FD3FF', stroke: '#2E6FB0', 'stroke-width': 1.5 }, wordX));
  const wordRip = mkBurst(banG, 'RIIP!', 24, '#FFFFFF');
  const threads = E('path', { stroke: '#8A7A5A', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, banG);

  /* ---------- Captain in the doorway, rail, teacup ---------- */
  const capt = castCaptain(lowG, { rim: false });
  const winkG = G(capt.head);
  E('ellipse', { cx: 15, cy: -303, rx: 9, ry: 10, fill: '#F0C3A0' }, winkG);
  E('path', { d: 'M7,-302 Q15,-296 23,-302', stroke: '#2B1B16', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, winkG);
  const winkStar = G(capt.head); tf(winkStar, 40, -318); E('path', { d: 'M-9,0 Q0,-1 0,-9 Q1,0 9,0 Q0,1 0,9 Q-1,0 -9,0 Z', fill: '#FFF2A8', stroke: '#E8B931', 'stroke-width': 1 }, winkStar);
  /* walkers behind the door rail are drawn later; the rail itself */
  const railG = G(lowG);
  E('rect', { x: 50, y: 230, width: 210, height: 12, rx: 5, fill: '#8A5A34' }, railG);
  E('rect', { x: 50, y: 230, width: 210, height: 4, rx: 2, fill: '#C8955F' }, railG);
  E('path', { d: 'M62,242 V328 M112,242 V328 M162,242 V328 M212,242 V328 M252,242 V328 M56,286 H256', stroke: '#C9A24A', 'stroke-width': 6 }, railG);
  const cup = gagTeacup(lowG);
  const RAILCUP = [226, 230];
  /* ---------- quay, water strip, crowd ---------- */
  const quayG = G(lowG);
  {
    E('rect', { x: -900, y: 700, width: 3600, height: 20, fill: '#2E4E58' }, quayG);
    E('path', { d: 'M-900,706 H2700', stroke: '#6F98A4', 'stroke-width': 2, 'stroke-dasharray': '30 22 8 30' }, quayG);
    E('rect', { x: -900, y: 716, width: 3600, height: 500, fill: lgrad([[0, '#B6A487'], [1, '#8E7A60']]) }, quayG);
    const cob = pat(40, 18, p => { E('rect', { x: 1, y: 1, width: 17, height: 7, rx: 3, fill: '#000', 'fill-opacity': .08 }, p); E('rect', { x: 21, y: 10, width: 17, height: 7, rx: 3, fill: '#000', 'fill-opacity': .08 }, p); E('rect', { x: 3, y: 2, width: 9, height: 2, rx: 1, fill: '#fff', 'fill-opacity': .1 }, p); });
    E('rect', { x: -900, y: 734, width: 3600, height: 480, fill: cob }, quayG);
    E('rect', { x: -900, y: 716, width: 3600, height: 16, fill: '#CFC6B6' }, quayG);
    let jd = ''; for (let x = -900; x < 2700; x += 52) jd += `M${x},716 v16 `; E('path', { d: jd, stroke: '#9E9484', 'stroke-width': 1.5 }, quayG);
    E('rect', { x: -900, y: 732, width: 3600, height: 5, fill: '#000', 'fill-opacity': .15 }, quayG);
    /* bollard + mooring rope up the hull, crates */
    E('path', { d: 'M1760,736 L1762,718 Q1756,716 1756,710 L1784,710 Q1784,716 1778,718 L1780,736 Z', fill: '#24262B' }, quayG);
    E('path', { d: 'M1770,712 Q1900,520 2080,-140', stroke: '#6E5434', 'stroke-width': 7, fill: 'none' }, quayG);
    [[-120, 760, '#9A6A3E'], [-40, 770, '#8A5E34'], [-80, 714, '#A8784A']].forEach(([x, y, col]) => { E('rect', { x: x - 40, y: y - 56, width: 80, height: 56, rx: 4, fill: col }, quayG); E('path', { d: `M${x - 34},${y - 46} L${x + 34},${y - 6} M${x + 34},${y - 46} L${x - 34},${y - 6}`, stroke: shade(col, -.25), 'stroke-width': 4 }, quayG); });
  }
  const crowdC = [[655, 748, 1.75], [735, 742, 1.8], [815, 752, 1.72], [895, 744, 1.8], [975, 750, 1.75], [1700, 748, 1.8], [1880, 744, 1.85], [-240, 752, 1.8], [1960, 760, 1.7]].map(([x, y, s], i) => { const pp = wldPerson(quayG, 300 + i * 7.7); pp.x = x; pp.y = y; pp.sc = s * pp.s; return pp; });
  /* ---------- ramp / landing / steps ---------- */
  const RT = [420, 330], RB = [1150, 620], RK = (RB[1] - RT[1]) / (RB[0] - RT[0]);
  const rampY = x => x <= RT[0] ? RT[1] : x <= RB[0] ? RT[1] + (x - RT[0]) * RK : x <= 1350 ? 620 : x <= 1450 ? lerp(620, 722, (x - 1350) / 100) : 740;
  const groundK = x => x > RT[0] && x < RB[0] ? RK : 0;
  const rampBack = G(lowG);
  {
    /* trestles */
    let tr = ''; for (let x = 520; x < 1150; x += 150) tr += `M${x},${f2(rampY(x) + 16)} V718 `; tr += 'M1170,636 V718 M1330,636 V718 '; E('path', { d: tr, stroke: '#5A4330', 'stroke-width': 10 }, rampBack);
    E('path', { d: `M${RT[0]},${RT[1]} L${RB[0]},${RB[1]} L1350,620 L1350,638 L${RB[0]},638 L${RT[0]},${RT[1] + 18} Z`, fill: '#8A6A48' }, rampBack);
    E('path', { d: `M${RT[0]},${RT[1]} L${RB[0]},${RB[1]} L1350,620`, stroke: '#B48A5E', 'stroke-width': 4, fill: 'none' }, rampBack);
    let st = 'M1350,620'; for (let i = 0; i < 4; i++) st += ` h24 v25.5`; st += ' L1350,722 Z'; E('path', { d: st, fill: '#7A5A3A', stroke: '#B48A5E', 'stroke-width': 3 }, rampBack);
  }
  /* ---------- characters on the ramp (drawn between ramp deck and near railing) ---------- */
  const walkers = G(CC), crewG = G(walkers);
  const pB = castPassenger(crewG, 4, { lite: true, hatColor: '#3A3F52', jacket: '#3A3F52', seed: 501 });
  const pF = castPassenger(crewG, 4, { lite: true, hatColor: '#3A3F52', jacket: '#3A3F52', beard: false, seed: 502 });
  const plank = E('path', { stroke: '#7A5A3A', 'stroke-width': 10, 'stroke-linecap': 'round' }, crewG);
  const tower = gagSuitcases(crewG);
  const mitzi = Dog(crewG);
  const lady = castPoshLady(crewG, { rim: false });
  const owner = castOwner(walkers);
  const pocket = gagPocketOn(owner);
  /* owner's top hat: wrap the hat shapes so the scene can make it spring off */
  const hatIn = (() => { const p = owner.head.querySelector('path[d^="M-40,-354 L-45,-456"]'); if (!p) return null; const hg = p.parentNode; const inner = G(hg); [...hg.childNodes].forEach(n => { if (n !== inner) inner.appendChild(n); }); return inner; })();
  /* wad in hand (crumpled word) travels in world space */
  const wadG = G(walkers); const wad = gagWord(wadG);
  /* ---------- near railing + canvas dodger + bunting ---------- */
  const gang2 = G(CC);
  const rail = G(gang2);
  {
    const rp = (x, h) => [x, rampY(x) - h];
    let posts = ''; for (let x = 440; x <= 1350; x += 75) { const a = rp(x, 0), b = rp(x, 96); posts += `M${f2(a[0])},${f2(a[1])} L${f2(b[0])},${f2(b[1])} `; }
    E('path', { d: posts, stroke: '#F2EEE4', 'stroke-width': 6 }, rail);
    const top = (h) => `M${rp(440, h).join(',')} L${rp(1150, h).join(',')} L${rp(1350, h).join(',')}`;
    E('path', { d: top(96), stroke: '#F7F4EC', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, rail);
    E('path', { d: top(50), stroke: '#E4DED0', 'stroke-width': 4, fill: 'none' }, rail);
    /* canvas dodger with the ship's name */
    E('path', { d: `M${rp(560, 4).join(',')} L${rp(1040, 4).join(',')} L${rp(1040, 48).join(',')} L${rp(560, 48).join(',')} Z`, fill: '#F4F0E4', stroke: '#C9C2B2', 'stroke-width': 2 }, rail);
    const ang = Math.atan(RK) * 180 / Math.PI, mid = rp(800, 18);
    const nm = TX(rail, mid[0], mid[1] + 9, 'R.M.S. TITANIC', 28, '#1D2B53', { a: 'middle', w: 900, ls: 3 }); nm.setAttribute('transform', `rotate(${f2(ang)} ${f2(mid[0])} ${f2(mid[1])})`);
    /* bunting along the top rail */
    const cols = ['#D64545', '#F4F1EA', '#3E6FB0', '#E8B83A', '#3F9A5A'], dd = ['', '', '', '', ''];
    for (let i = 0; i < 40; i++) { const x = 450 + i * 22.5; const p = rp(x, 96); const yy = p[1] + 4 + 6 * Math.sin((i % 6) / 6 * Math.PI); dd[i % 5] += `M${f2(x - 7)},${f2(yy)} L${f2(x + 7)},${f2(yy + (x < 1150 ? 14 * RK * .5 : 0))} L${f2(x)},${f2(yy + 16)} Z `; }
    dd.forEach((d, i) => E('path', { d, fill: cols[i] }, rail));
  }
  /* ---------- quay-level characters ---------- */
  const shipb = castShipbuilder(gang2);
  const band = [0, 1, 2].map(i => castMusician(gang2, i, { instrument: false, lite: true }));
  const BANDP = [[150, 872], [335, 886], [520, 870]];
  /* brass instruments (between head and arms) */
  const brass = band.map((m, i) => {
    const g = G(m.up); m.up.insertBefore(g, m.head.nextSibling);
    const GOLDC = '#E8B931', GD = '#B88A1E';
    if (i === 0) {   /* tuba */
      E('path', { d: 'M-10,-150 a46,40 0 1,0 0.1,0', fill: 'none', stroke: GOLDC, 'stroke-width': 16 }, g);
      E('path', { d: 'M-10,-150 a46,40 0 1,0 0.1,0', fill: 'none', stroke: '#FFE58A', 'stroke-width': 4, 'stroke-dasharray': '30 200' }, g);
      E('path', { d: 'M-40,-180 L-70,-330 L-130,-370 L-30,-370 L-44,-330 L-20,-190 Z', fill: GOLDC, stroke: GD, 'stroke-width': 3 }, g);
      E('ellipse', { cx: -80, cy: -370, rx: 52, ry: 12, fill: '#6E4A10' }, g);
      E('path', { d: 'M14,-206 v-26 M26,-202 v-26 M38,-196 v-26', stroke: GD, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
      E('path', { d: 'M0,-268 Q30,-250 20,-210', stroke: GOLDC, 'stroke-width': 7, fill: 'none' }, g);
    } else if (i === 1) {   /* trombone */
      E('path', { d: 'M0,-270 L120,-312 M6,-254 L126,-296', stroke: GOLDC, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
      E('path', { d: 'M110,-322 L170,-350 L176,-300 L120,-298 Z', fill: GOLDC, stroke: GD, 'stroke-width': 3 }, g);
      g.slide = G(g); E('path', { d: 'M-4,-266 L-110,-226 L-104,-212 L2,-252', fill: 'none', stroke: GOLDC, 'stroke-width': 7, 'stroke-linejoin': 'round' }, g.slide);
    } else {   /* bass drum */
      E('ellipse', { cx: 0, cy: -150, rx: 74, ry: 74, fill: '#F4EEE0', stroke: '#C0392B', 'stroke-width': 14 }, g);
      E('ellipse', { cx: 0, cy: -150, rx: 74, ry: 74, fill: 'none', stroke: '#E8B931', 'stroke-width': 4, 'stroke-dasharray': '6 20' }, g);
      E('path', { d: 'M0,-196 L12,-162 L48,-162 L19,-142 L30,-108 L0,-128 L-30,-108 L-19,-142 L-48,-162 L-12,-162 Z', fill: '#E8B931' }, g);
      g.mallet = G(m.propR); E('path', { d: 'M0,0 L-36,-30', stroke: '#6B4A2B', 'stroke-width': 5, 'stroke-linecap': 'round' }, g.mallet); E('circle', { cx: -40, cy: -33, r: 11, fill: '#F2EEE4' }, g.mallet);
    }
    return g;
  });
  const notes = [0, 1, 2, 3].map(i => { const n = G(gang2); E('path', { d: 'M0,0 a8,6 0 1,0 0.1,0 M7,-2 V-34 Q20,-28 22,-16', fill: '#F7C948', stroke: '#F7C948', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, n); return n; });
  /* ---------- the magazine (The Shipbuilder) + magnifying glasses ---------- */
  const MAG = G(gang2);
  const MG = { x0: 1560, y0: 480, x1: 1690, y1: 650 }, SPECK = [1572, 584];
  const magPage = (p, withSpeck) => {
    E('rect', { x: MG.x0, y: MG.y0, width: MG.x1 - MG.x0, height: MG.y1 - MG.y0, fill: '#F7F0DC' }, p);
    E('rect', { x: MG.x0, y: MG.y0, width: MG.x1 - MG.x0, height: 28, fill: '#1D2B53' }, p);
    const t = TX(p, (MG.x0 + MG.x1) / 2, MG.y0 + 19, 'THE SHIPBUILDER', 11, '#F7F0DC', { a: 'middle', w: 900 }); t.setAttribute('textLength', 116); t.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    E('path', { d: `M1580,560 L1678,560 L1672,572 L1586,572 Z`, fill: '#1F2129' }, p);
    E('path', { d: 'M1596,560 l2,-16 h6 l-2,16 Z M1614,560 l2,-16 h6 l-2,16 Z M1632,560 l2,-16 h6 l-2,16 Z M1650,560 l2,-16 h6 l-2,16 Z', fill: '#D9A13F' }, p);
    E('rect', { x: 1584, y: 552, width: 88, height: 8, fill: '#EDE8DC' }, p);
    E('path', { d: 'M1566,574 H1684', stroke: '#9DB8D6', 'stroke-width': 1.5 }, p);
    const h = TX(p, 1632, 604, 'UNSINKABLE', 17, '#1D2B53', { a: 'middle', w: 900 }); h.setAttribute('textLength', 104); h.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    E('path', { d: 'M1568,618 H1684 M1568,626 H1684 M1568,634 H1660 M1568,642 H1676', stroke: '#B4AC98', 'stroke-width': 3 }, p);
    if (withSpeck) TX(p, SPECK[0], SPECK[1], 'practically', .95, '#1D2B53', { a: 'middle', w: 700, it: true });
  };
  const magG = G(MAG);
  E('rect', { x: MG.x0 + 4, y: MG.y0 + 5, width: MG.x1 - MG.x0, height: MG.y1 - MG.y0, fill: '#000', 'fill-opacity': .2 }, magG);
  magPage(magG, true);
  E('rect', { x: MG.x0, y: MG.y0, width: MG.x1 - MG.x0, height: MG.y1 - MG.y0, fill: 'none', stroke: '#B9AE8E', 'stroke-width': 1.5 }, magG);
  const pointer = E('path', { d: 'M0,0 L-10,-6 L-8,0 L-10,6 Z', fill: '#E84855' }, magG);
  const mkLens = (r, rimW, handleL) => {
    const L = { g: G(MAG) };
    const id = uid('s0ln'); const cp = E('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, DEFS); L.clip = E('circle', { r }, cp);
    L.handle = G(L.g); E('rect', { x: -7, y: r, width: 14, height: handleL, rx: 6, fill: '#5A3A22' }, L.handle); E('rect', { x: -5, y: r - 4, width: 10, height: 12, fill: '#C9A24A' }, L.handle);
    L.view = G(L.g, { 'clip-path': `url(#${id})` }); L.zoom = G(L.view); magPage(L.zoom, false);
    L.txt = TX(L.zoom, SPECK[0], SPECK[1], 'practically', .95, '#1D2B53', { a: 'middle', w: 700, it: true });
    L.glass = E('circle', { r, fill: '#CFE8FF', 'fill-opacity': .12 }, L.g);
    L.rim = E('circle', { r, fill: 'none', stroke: '#C9A24A', 'stroke-width': rimW }, L.g);
    L.glint = E('path', { d: `M${-r * .6},${-r * .3} A${r * .7},${r * .7} 0 0,1 ${-r * .2},${-r * .66}`, stroke: '#FFFFFF', 'stroke-width': rimW * .7, 'stroke-opacity': .7, fill: 'none', 'stroke-linecap': 'round' }, L.g);
    L.set = (x, y, k, rot, o) => { op(L.g, o); if (o <= 0) return; L.clip.setAttribute('cx', f2(x)); L.clip.setAttribute('cy', f2(y)); const zt = `translate(${f2(x)},${f2(y)}) scale(${f2(k * 100) / 100}) translate(${f2(-x)},${f2(-y)})`; if (L._zt !== zt) { L._zt = zt; L.zoom.setAttribute('transform', zt); }
      [L.glass, L.rim].forEach(e => { e.setAttribute('cx', f2(x)); e.setAttribute('cy', f2(y)); }); L.glint.setAttribute('transform', `translate(${f2(x)},${f2(y)})`); L.handle.setAttribute('transform', `translate(${f2(x)},${f2(y)}) rotate(${f2(rot)})`); };
    return L;
  };
  const lens2 = mkLens(40, 6, 70), lens1 = mkLens(21, 4, 40);
  /* a helpful arm from off-frame holding the second, bigger glass */
  const armB = G(MAG); MAG.insertBefore(armB, lens1.g);
  E('path', { d: 'M14,12 L260,128', stroke: '#6B5A48', 'stroke-width': 40, 'stroke-linecap': 'round' }, armB);
  E('path', { d: 'M40,10 L270,118 M30,34 L250,140', stroke: '#584838', 'stroke-width': 3, 'stroke-dasharray': '6 7' }, armB);
  E('path', { d: 'M18,14 L30,20', stroke: '#F4F1E8', 'stroke-width': 42, 'stroke-linecap': 'butt' }, armB);
  E('ellipse', { cx: 2, cy: 2, rx: 17, ry: 15, fill: '#F2C6A0' }, armB);
  E('ellipse', { cx: -8, cy: -9, rx: 8, ry: 6, fill: '#F2C6A0', stroke: '#D9A47E', 'stroke-width': 1.5 }, armB);
  E('path', { d: 'M-8,6 Q2,12 12,6', stroke: '#D9A47E', 'stroke-width': 2, fill: 'none' }, armB);
  /* thumb of the Shipbuilder holding the magazine */
  E('ellipse', { cx: 1596, cy: 640, rx: 9, ry: 13, fill: '#F1C9A0', stroke: '#D9A47E', 'stroke-width': 1.5, transform: 'rotate(-20 1596 640)' }, magG);

  /* ---------- foreground parallax: newsboys ---------- */
  const boys = [0, 1].map(i => castPassenger(CF, 6, { lite: true, hatColor: i ? '#6A5A44' : '#5A6070', jacket: i ? '#5E6E8A' : '#7A5A3E', seed: 610 + i }));
  const papers = [0, 1].map(i => {
    const g = G(CF), gi = G(g, { transform: `rotate(${i ? -5 : 5})` });
    E('rect', { x: -88, y: -110, width: 176, height: 220, rx: 4, fill: '#000', 'fill-opacity': .18 }, gi);
    E('rect', { x: -92, y: -114, width: 176, height: 220, rx: 4, fill: '#F4EFE2', stroke: '#BDB49C', 'stroke-width': 2 }, gi);
    TX(gi, -4, -80, 'EXTRA!', 22, '#B3261E', { a: 'middle', w: 900 });
    E('path', { d: 'M-80,-68 H72', stroke: '#2A2A30', 'stroke-width': 3 }, gi);
    const a = TX(gi, -4, -38, 'PRACTICALLY', 21, '#1D2B53', { a: 'middle', w: 900 }); a.setAttribute('textLength', 150); a.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    const b = TX(gi, -4, -6, 'UNSINKABLE', 27, '#1D2B53', { a: 'middle', w: 900 }); b.setAttribute('textLength', 156); b.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    E('path', { d: 'M-70,42 L60,42 L54,54 L-64,54 Z', fill: '#2A2A30' }, gi); E('path', { d: 'M-40,42 l2,-14 h5 l-2,14 Z M-20,42 l2,-14 h5 l-2,14 Z M0,42 l2,-14 h5 l-2,14 Z M20,42 l2,-14 h5 l-2,14 Z', fill: '#6E6A60' }, gi);
    E('path', { d: 'M-80,70 H-10 M-80,80 H-14 M-80,90 H-12 M6,70 H72 M6,80 H70 M6,90 H66', stroke: '#A9A290', 'stroke-width': 4 }, gi);
    return g;
  });

  /* ---------- deck shot characters (reporter); the Owner is shared ---------- */
  const deckChars = G(CC);
  const rep = castPassenger(deckChars, 0, { pencil: true, seed: 701 });
  { const card = G(rep.head); tf(card, 22, -378, 12); E('rect', { x: -28, y: -14, width: 56, height: 28, rx: 3, fill: '#FBF6E4', stroke: '#8A7A5A', 'stroke-width': 1.5 }, card); TX(card, 0, 6, 'PRESS', 17, '#B3261E', { a: 'middle', w: 900 }); }
  const repPencil = G(rep.propL); E('path', { d: 'M-3,-30 L3,-30 L3,8 L0,15 L-3,8 Z', fill: '#F2C14E', stroke: '#8A6A1E', 'stroke-width': 1.2 }, repPencil); E('rect', { x: -3, y: -36, width: 6, height: 6, fill: '#E88A9A' }, repPencil);
  const padG = G(CC); const pad = mkPad(padG);
  const padClipId = uid('s0pc'); const padClip = E('clipPath', { id: padClipId, clipPathUnits: 'objectBoundingBox' }, DEFS); const padClipR = E('rect', { x: 0, y: 0, width: 1, height: 1 }, padClip);
  pad.t2.setAttribute('clip-path', `url(#${padClipId})`);

  /* ================================================================
     SCREEN-SPACE OVERLAY: title + speed lines
     ================================================================ */
  const title = G(OV);
  const TL = 'TITANIC', TW = [.66, .34, .66, .74, .78, .34, .72], TS = 168;
  let tx0 = 800 - (TW.reduce((a, b) => a + b, 0) * TS + 6 * 12) / 2;
  const tGold = lgrad([[0, '#FFF0A8'], [.45, '#F7C948'], [1, '#C98A1E']]);
  const letters = TL.split('').map((ch, i) => {
    const cx = tx0 + TW[i] * TS / 2; tx0 += TW[i] * TS + 12;
    const g = N(title, cx, 300);
    const s1 = TX(g, 7, 9, ch, TS, '#1D2B53', { a: 'middle', w: 900 }); s1.setAttribute('stroke', '#1D2B53'); s1.setAttribute('stroke-width', 14); s1.setAttribute('stroke-linejoin', 'round');
    const s2 = TX(g, 0, 0, ch, TS, tGold, { a: 'middle', w: 900 }); s2.setAttribute('stroke', '#1D2B53'); s2.setAttribute('stroke-width', 9); s2.setAttribute('paint-order', 'stroke'); s2.setAttribute('stroke-linejoin', 'round');
    return g;
  });
  const ribbon = G(title);
  E('path', { d: 'M-360,-6 L-410,-40 L-388,4 L-410,48 L-344,40 Z M360,-6 L410,-40 L388,4 L410,48 L344,40 Z', fill: '#8E1E18' }, ribbon);
  E('path', { d: 'M-350,-34 Q0,-14 350,-34 L350,30 Q0,50 -350,30 Z', fill: '#B3261E', stroke: '#6E1410', 'stroke-width': 3 }, ribbon);
  E('path', { d: 'M-340,-24 Q0,-4 340,-24', stroke: '#E8B931', 'stroke-width': 2.5, fill: 'none' }, ribbon);
  E('path', { d: 'M-340,22 Q0,42 340,22', stroke: '#E8B931', 'stroke-width': 2.5, fill: 'none' }, ribbon);
  TX(ribbon, 0, 20, 'Practically Unsinkable', 40, '#FFF6E2', { a: 'middle', w: 700, it: true });
  const tStrings = E('path', { stroke: '#5A4A3A', 'stroke-width': 2.5, fill: 'none' }, title);
  const tGulls = [mkFly(title), mkFly(title)];
  const speed = G(OV); const spLines = [];
  for (let i = 0; i < 12; i++) spLines.push(E('path', { d: `M${f2(60 + hash(i * 3.3) * 1480)},0 v${f2(140 + hash(i * 5.7) * 260)}`, stroke: '#FFFFFF', 'stroke-width': f2(2 + hash(i) * 3), 'stroke-linecap': 'round', 'stroke-opacity': .5 }, speed));

  /* ================================================================
     CAMERA KEYS
     ================================================================ */
  /* zoom is held constant during slow drifts (pure pans are cheap); zooms happen in short moves */
  const CAMW = [[0, 790, 470, 1.08], [T_CLOSE, 850, 492, 1.08, lin],
    [T_DEP, 210, 560, 1.1], [c(7) + 1.0, 300, 575, 1.1], [c(7) + 1.75, 470, 592, 1.5], [c(7) + 2.25, 466, 590, 1.5, lin], [T_DECK - .05, 360, 578, 1.15],
    [T_FIN, 2300, 600, 1.0], [D, 2350, 590, 1.0, lin]];
  const CAMC = [[T_CLOSE, 880, 480, 1.0], [T_CLOSE + .2, 880, 470, 1.0],
    [c(0) + 5.25, 905, -3880, 1.0, inOut3], [c(0) + 5.65, 905, -3900, 1.0],
    [c(0) + 6.4, 990, -400, 1.6, inOut3], [c(0) + 7.0, 994, -300, 1.6, lin],
    [c(1) - .25, 1000, 398, 1.12, easeOut], [c(2) - .45, 990, 400, 1.12],
    [c(2) + .1, 880, 420, 1.0], [c(2) + 2.7, 868, 405, 1.0],
    [c(2) + 3.6, 590, 165, 2.75], [c(3) - .5, 598, 160, 2.75, lin],
    [c(3) + .05, 1400, 470, 1.25], [c(3) + .7, 1425, 482, 1.25],
    [c(3) + 1.3, 1622, 562, 3.2], [c(3) + 3.4, 1626, 562, 3.2, lin],
    [c(4), 625, 222, 1.5], [c(4) + 2.1, 635, 226, 1.5, lin],
    [c(4) + 2.85, 930, 270, 1.1], [c(5) - .05, 1470, 420, 1.2],
    [c(5) + 1.4, 1080, 350, 1.2], [c(6) - .35, 580, 215, 1.2, lin],
    [c(6) + .35, 300, 190, 1.6], [c(6) + 1.3, 300, 190, 1.6, lin],
    [c(6) + 1.85, 228, 194, 2.3], [T_DEP, 230, 192, 2.3, lin],
    [T_DECK, XD + 790, 470, 1.15], [T_FIN, XD + 805, 462, 1.15, lin]];
  const camCAt = t => kf(t, CAMC);

  /* ================================================================
     PER-FRAME
     ================================================================ */
  const ownerTop = [430, rampY(430)];
  /* cached op(): skips redundant writes (only for nodes no asset touches) */
  const ov = (n, o) => { const k = o < .004 ? 0 : Math.round(clamp(o) * 1000); if (n._ov === k) return o; n._ov = k; return op(n, o); };
  return (lt, at) => {
    const wideOn = lt < T_CLOSE || (lt >= T_DEP && lt < T_DECK) || lt >= T_FIN;
    const deckOn = lt >= T_DECK && lt < T_FIN;
    ov(WL, wideOn ? 1 : 0); ov(CL, wideOn ? 0 : 1); if (wideOn) ov(speed, 0);

    /* ---------------- title (screen space) ---------------- */
    const tOut = prog(lt, c(0) + 1.5, 1.4, easeIn);
    ov(title, lt < c(0) + 3.2 ? 1 : 0);
    if (lt < c(0) + 3.2) {
      letters.forEach((g, i) => {
        const p = pop(lt, .35 + i * .11, .5), fo = prog(lt, c(0) + 1.5 + i * .07, .9, easeIn);
        const v = ov(g, clamp(p * 3) * (1 - fo));
        if (v > 0) tf(g, g._x + fo * (i - 3) * 30, 300 + Math.sin(at * 2.2 + i * .8) * 5 - fo * 520, fo * (i - 3) * 6, p > .999 && p < 1.001 ? 1 : Math.max(.01, p));
      });
      const rk = prog(lt, 1.2, .8, easeOut), rx = 800 + tOut * 760, ry = 395 + Math.sin(at * 1.5) * 6 - tOut * 520;
      ov(ribbon, rk); tf(ribbon, rx, ry, -tOut * 12, Math.max(.01, rk), 1);
      const gp = [[-430, -118], [430, -118]].map(([dx, dy], i) => [rx + dx * rk + (1 - rk) * (i ? 500 : -500), ry + dy + Math.sin(at * 3 + i) * 10 - (1 - rk) * 120]);
      gp.forEach((p, i) => tGulls[i].set(p[0], p[1], 1.5, Math.sin(at * 11 + i * 2), (i ? -8 : 8)));
      tStrings.setAttribute('d', `M${f2(gp[0][0])},${f2(gp[0][1] + 6)} L${f2(rx - 392 * rk)},${f2(ry - 30)} M${f2(gp[1][0])},${f2(gp[1][1] + 6)} L${f2(rx + 392 * rk)},${f2(ry - 30)}`);
      ov(tStrings, rk);
    }

    /* ================= WIDE ================= */
    if (wideOn) {
      camSet(WC, kf(lt, CAMW));
      sky.anim(at); dk.anim(at);
      const dep = lt >= T_DEP;
      const fin = lt >= T_FIN;
      /* Titanic */
      let tx = 800, ty = dk.shipY, ts = .82, wake = 0;
      if (dep && !fin) { const u = lt - (c(7) - .2); tx = 800 + (u > 0 ? 40 * u * u + 70 * Math.max(0, u - .4) : 0); wake = clamp(u * .5); }
      if (fin) { const u = lt - T_FIN; tx = 2720 + u * 70; ty = 598 - u * 4; ts = .58 - u * .02; wake = .8; }
      sh.set({ x: tx, y: ty, s: ts, smoke: dep ? 1 : .75, wind: dep ? 1 : .5, wake }); sh.anim(at);
      if (!dep) dk.moor(sh.pt(-634, -51), sh.pt(573, -51)); else dk.moor(null, null);
      ov(dk.shedL, dep ? 0 : 1);
      /* final shot looks past the Dock's right end: hide what is out of frame there */
      [dk.crowd, dk.cranes, dk.lamps, dk.bunting, dk.ropes].forEach(g => ov(g, fin ? 0 : 1));
      ov(miniGang, dep ? 0 : 1);
      /* whistle puff at departure */
      const wp = dep && !fin ? win(lt, T_DEP + .05, T_DEP + 1.3, .15, .5) : 0; ov(whistle, wp);
      if (wp > 0) { const ft = sh.funnelTop(0); wPuffs.forEach((e, i) => { const q = ((lt - T_DEP) * 1.6 + i / 5) % 1; e.setAttribute('cx', f2(ft[0] + 16 + q * 30 - i * 3)); e.setAttribute('cy', f2(ft[1] + 10 - q * 60)); e.setAttribute('r', f2(5 + q * 16)); op(e, (1 - q) * .9); }); }
      /* the smaller liner + its ropes + tug */
      const snap = c(7) + .35, near = c(7) + 1.85;
      let nd = 0;
      if (dep) nd = keyed(lt, [[snap, 0], [near, 518], [near + .3, 521], [near + 1.25, 250], [T_DECK + 2, 230]], ease);
      if (lt >= snap && lt < near) nd = 518 * Math.pow(clamp((lt - snap) / (near - snap)), 1.6);
      const nyX = -300 + nd, nyS = .8, nyR = dep ? (nd > 0 ? Math.sin(clamp((lt - snap) / 2) * Math.PI) * -1.2 : 0) : 0;
      tf(NY, nyX, 652 + Math.sin(at * 1.3) * 1.2, nyR, nyS);
      nyFlag.setAttribute('d', `M-218,-236 L${f2(-250 + Math.sin(at * 6) * 3)},${f2(-230 + Math.sin(at * 5) * 2)} L-218,-222 Z`);
      ov(NY, dep && !fin ? 1 : 0); ov(tugA.g, dep ? 1 : 0);
      /* ropes: bow → bollard 50, stern → bollard -460 */
      const bowP = [nyX + 300 * nyS, 652 - 50 * nyS], stP = [nyX - 300 * nyS, 652 - 50 * nyS];
      const QB = [50, 712], QS = [-460, 712];
      const rope = (el1, el2, Q, P, i) => {
        const tsn = snap + i * .12;
        if (lt < tsn) {
          const vib = lt > tsn - .45 && dep ? Math.sin(at * 70) * 4 * (lt - tsn + .45) / .45 : 0;
          const sag = dep ? lerp(16, 0, clamp((lt - (tsn - .6)) / .6)) : 16;
          el1.setAttribute('d', `M${f2(Q[0])},${f2(Q[1] - 4)} Q${f2((Q[0] + P[0]) / 2)},${f2((Q[1] + P[1]) / 2 + sag + vib)} ${f2(P[0])},${f2(P[1])}`); ov(el1, 1); ov(el2, 0);
        } else {
          const u = clamp((lt - tsn) / .6), wv = Math.sin((lt - tsn) * 22) * 22 * (1 - u);
          const m = mixP(Q, P, .5);
          el1.setAttribute('d', `M${f2(Q[0])},${f2(Q[1] - 4)} Q${f2(lerp(m[0], Q[0], u * .6) + wv)},${f2(lerp(m[1], Q[1] + 10, u))} ${f2(lerp(m[0], Q[0] + (P[0] > Q[0] ? 30 : -30), u))},${f2(lerp(m[1] - 20 * (1 - u), Q[1] + 14, u))}`);
          el2.setAttribute('d', `M${f2(P[0])},${f2(P[1])} Q${f2(P[0] + (Q[0] - P[0]) * .2 - wv)},${f2(P[1] + 30)} ${f2(P[0] + (Q[0] - P[0]) * .1)},${f2(P[1] + lerp(40, 70, u))}`);
          ov(el1, 1); ov(el2, 1);
        }
      };
      ov(nyRopes, dep && !fin ? 1 : 0);
      if (dep && !fin) { rope(ropeEl[0], ropeEl[1], QB, bowP, 0); rope(ropeEl[2], ropeEl[3], QS, stP, 1); }
      const tw = dep ? win(lt, snap - .02, snap + .95, .08, .25) : 0; ov(twang, tw);
      if (tw > 0) tf(twang, 20 + nd * .3, 560, -8 + Math.sin(at * 30) * 2, .9 + .25 * pop(lt, snap, .3));
      const twl = dep ? win(lt, snap, snap + .5, .05, .2) : 0; ov(twangLines, twl);
      if (twl > 0) { const q = prog(lt, snap, .5, lin); twangLines.setAttribute('d', `M${f2(30 + nd)},${f2(650)} m-60,-20 l-${f2(20 + q * 30)},-10 m30,40 l-${f2(24 + q * 30)},10 m120,-40 l${f2(20 + q * 30)},-12 m-30,46 l${f2(24 + q * 30)},12`); }
      /* alarm on the drifting liner */
      const al = dep && !fin ? win(lt, snap + .45, near + .2, .1, .3) : 0; ov(alarm, al);
      if (al > 0) tf(alarm, nyX + 150 * nyS, 652 - 190 * nyS + Math.sin(at * 14) * 4, Math.sin(at * 20) * 6, .55 * pop(lt, snap + .45, .35));
      /* the near-miss gull squeezing through the gap */
      const sq = dep ? win(lt, near - .5, near + .45, .1, .1) : 0; ov(squeeze.g, sq);
      if (sq > 0) { const q = clamp((lt - near + .5) / .95); squeeze.set(lerp(nyX + 290 * nyS, 220 + (tx - 800), .5) + 4, lerp(420, 640, q), 1.1, -.2 + Math.sin(at * 30) * .1); }
      /* tugs */
      if (!fin) {
        const strain = dep ? win(lt, near - .2, near + 1.2, .2, .4) : 0;
        if (dep) tugA.set({ x: nyX - 170 + (dep ? -strain * 40 : 0), y: 690, s: .46, flip: true, tow: dep ? [stP[0] + 4, stP[1] + 18] : null, wake: dep ? .3 + strain * .7 : .15, smoke: .6 + strain * .4 });
        tugB.set({ x: tx + 640 * ts + 180, y: 688, s: .46, tow: sh.pt(690, -70), wake: dep ? .8 : .2 });
      } else {
        const u = lt - T_FIN;
        tugA.set({ x: 2560 - u * 40, y: 720, s: .5, flip: true, tow: null, wake: .5, smoke: .8 });
        tugB.set({ x: tx + 600 * ts + 120 + u * 20, y: ty + 30, s: .4, tow: sh.pt(690, -70), wake: .8 });
      }
      if (dep) tugA.anim(at); tugB.anim(at);
      /* mini band */
      mbM.forEach(b => tf(b.m, b.x, 770 + Math.abs(Math.sin(at * 4 + b.ph)) * -3, 0, .62));
      /* final: notebook + gull */
      ov(finG, fin ? 1 : 0);
      if (fin) {
        tf(buoy, 2880, 930 + Math.sin(at * 1.7) * 5, Math.sin(at * 1.3) * 5, 1.2);
        const u = lt - T_FIN, bx = 2125, by = 808 + Math.sin(at * 1.6) * 4;
        tf(finPadG, bx, by);
        finRip.setAttribute('d', `M${bx - 150 - u * 20},${by + 34} q150,16 300,0 M${bx - 110 - u * 30},${by + 52} q110,10 220,0`);
        const land = c(8) + 2.25, lk = prog(lt, land - .5, .5, easeOut);
        const rd = clamp((lt - land - .15) / .4), look = prog(lt, D - 1.0, .3);
        const gx = lerp(bx - 360, bx - 58, lk) + rd * (1 - look) * Math.sin(at * 1.4) * 5, gy = lerp(by - 330, by - 16, lk) - Math.sin(lk * Math.PI) * 30;
        finGull.set({ x: gx, y: gy, s: 1.45, fly: 1 - prog(lt, land - .05, .2), at, ht: rd * (34 + Math.sin(at * 2.6) * 7) * (1 - look) - look * 14, blink: blink(at, 9), brow: look * -18 });
        const spl = win(lt, T_FIN, T_FIN + .35, .01, .25);
        ov(finSplash, spl * .8); if (spl > 0) finSplash.setAttribute('d', dots([[bx - 70, by + 10, 10 * spl], [bx + 80, by + 4, 8 * spl], [bx - 20, by - 30 * spl, 6], [bx + 30, by - 40 * spl, 5]]));
      }
    }

    /* ================= CLOSE ================= */
    if (!wideOn) {
      const v = camCAt(lt);
      /* 'sheepish' shuffle at the top of the tilt */
      const shuffle = win(lt, c(0) + 5.2, c(0) + 5.7, .1, .15);
      if (shuffle > 0) v[0] += Math.sin(at * 18) * 12 * shuffle;
      camSet(CC, v); camSet(CF, v, 1.25);
      ov(gang, deckOn ? 0 : 1); if (deckOn) { ov(crewG, 0); ov(walkers, 1); } ov(gang2, deckOn ? 0 : 1); ov(deckBG, deckOn ? 1 : 0); ov(deckChars, deckOn ? 1 : 0); ov(padG, deckOn ? 1 : 0);
      /* speed lines */
      const vA = camCAt(lt - .03), vB = camCAt(lt + .03), spd = Math.abs(vB[1] - vA[1]) / .06 * v[2];
      const sl = deckOn ? 0 : clamp((spd - 1100) / 2200) * .55; ov(speed, sl);
      if (sl > 0) spLines.forEach((e, i) => tf(e, 0, ((at * 2400 * (vB[1] < vA[1] ? 1 : -1) + i * 337) % 1400 + 1400) % 1400 - 400));

      if (!deckOn) {
        /* ---------- sky / funnel life ---------- */
        const top = v[1] - 450 / v[2], bot = v[1] + 450 / v[2], skyVis = top < -1100;
        ov(skyC, skyVis ? 1 : 0); ov(fun, top < -1500 ? 1 : 0); ov(smokeC, top < -2500 ? 1 : 0); ov(sup, top < -1100 && bot > -1700 ? 1 : 0);
        if (skyVis) {
          cloudsC.forEach(cl => tf(cl.c, cl.x + Math.sin(at * .05) * 40 + (at * cl.sp) % 200, cl.y));
          twk.forEach((g, i) => { const k = .55 + .45 * Math.sin(at * 3 + i * 1.7); tf(g, g.bx, g.by, at * 20 + i * 30, .6 + .5 * k); g.setAttribute('opacity', f2(k)); });
          flyC.forEach((f, i) => { const x = 200 + ((at * (60 + i * 25) + i * 500) % 1500), y = [-1750, -2150, -2600][i] + Math.sin(at + i) * 20; f.set(x, y, 1.6, Math.sin(at * 9 + i * 2)); });
          pennant.setAttribute('d', `M1296,-4150 Q${f2(1340 + Math.sin(at * 7) * 6)},${f2(-4150 + Math.sin(at * 5) * 8)} ${f2(1400 + Math.sin(at * 6) * 8)},${f2(-4136 + Math.sin(at * 8) * 10)} L1296,-4118 Z`);
          puffs.forEach((e, i) => { const q = ((at * .22 + i / 9) % 1); e.setAttribute('cx', f2(920 - q * 380 + Math.sin(i * 2.3) * 40)); e.setAttribute('cy', f2(-2600 - q * 900)); e.setAttribute('r', f2(50 + q * 120)); op(e, (1 - q) * .9); });
        }
        /* ---------- gull on the rivet ---------- */
        const gv = top < RIV[1] + 60 && bot > RIV[1] - 120;
        ov(rivGull.g, gv ? 1 : 0);
        if (gv) {
          const look = clamp((v[1] - RIV[1]) / 500, -1, 1);
          const stare = win(lt, c(0) + 6.1, c(0) + 7.6, .2, .3);
          rivGull.set({ x: RIV[0] - 4, y: RIV[1] - 14, s: 1.6, at, ht: -look * 30 * (1 - stare) + stare * -8, blink: blink(at, 4), brow: stare * -14, flip: stare > .5 });
        }
        /* everything at quay / gangway level is skipped while the camera is up in the sky */
        const lowVis = bot > -140;
        ov(walkers, lowVis ? 1 : 0); ov(gang2, lowVis ? 1 : 0); ov(lowG, lowVis ? 1 : 0);
        if (lowVis) {
        /* ---------- band ---------- */
        band.forEach((m, i) => {
          const [bx, by] = BANDP[i], beat = Math.abs(Math.sin(at * 3.4 + i * .9));
          const st = { x: bx, y: by, s: .6, at, bob: beat * 3, face: i === 2 ? 'happy' : 'focus', look: [.2, -.1], headTilt: Math.sin(at * 1.7 + i) * 3 };
          if (i === 0) { st.hL = [-46, -168]; st.hR = [30, -212]; }
          else if (i === 1) { const sl2 = Math.sin(at * 3.4) * 22; tf(brass[1].slide, -sl2 * .9, sl2 * .35); st.hL = [-96 - sl2 * .9, -222 + sl2 * .35]; st.hR = [128, -300]; }
          else { const hit = Math.pow(Math.abs(Math.sin(at * 3.4)), 6); st.hL = [-70, -150]; st.hR = [90, -170 + hit * 20]; st.propRotR = -20 + hit * 30; }
          m.set(st);
        });
        notes.forEach((n, i) => { const q = (at * .5 + i / 4) % 1; tf(n, 90 + q * 70 + Math.sin(q * 9 + i) * 12, 610 - q * 150, Math.sin(at * 3 + i) * 12, .75); ov(n, Math.sin(q * Math.PI) * .85); });
        /* ---------- quay crowd ---------- */
        crowdC.forEach(pp => { tf(pp.g, pp.x, pp.y, 0, pp.sc); tf(pp.body, 0, Math.sin(at * 2 + pp.ph) * .8, Math.sin(at * 1.3 + pp.ph) * 1.5); if (pp.wave) { tf(pp.arm, pp.side * 11, -77, pp.side * (16 + 24 * Math.sin(at * pp.fr + pp.ph))); if (pp.arm.hk) tf(pp.arm.hk, 0, -28, 0, .7 + .3 * Math.sin(at * 14 + pp.ph), 1); } });

        /* ---------- banner unroll + strip ---------- */
        const un = clamp(easeOut(clamp((lt - (c(1) + .2)) / .75)) + swing(lt, c(1) + .95, .06, 9, 3));
        const banH = (BAN.y1 - BAN.y0) * clamp(un, 0, 1.05);
        banClipR.setAttribute('height', f2(Math.max(0, banH)));
        tf(banRoll, 0, BAN.y0 + banH + 2, 0, 1, 1 - .5 * prog(lt, c(1) + .9, .3));
        ov(banRoll, un < .999 ? 1 : 1 - prog(lt, c(1) + 1.0, .3));
        /* strip state */
        const ripT = c(4) + .62, crT = c(4) + 1.0, pkT = c(4) + 1.8, inT = c(4) + 2.15;
        const OW = owner; let wordPos = [590, 150], wordRot = 0, wordS = .86, crumple = 0, wordOn = 1;
        /* ---------- Owner ---------- */
        let ox = 1250, oy = 620, os = .72, ost = { face: 'proud', look: [0, 0], turn: 0 }, oVis = 1;
        const hatK = { y: 0, r: 0 };
        const tW0 = c(3) + 1.5, tW1 = c(4) - .1;
        if (lt < tW0) {
          Object.assign(ost, stand());
          if (lt < c(1) - .3) { ost.face = 'proud'; ost.look = [-.4, -.3]; ost.hL = [-62, -150]; ost.hR = [40, -196]; ost.bob = Math.sin(at * 2) * 2; }
          else if (lt < ce(1) + .3) {
            const fl = easeBack(clamp((lt - c(1) + .1) / .35));
            ost.hL = mixP([-62, -150], [-170, -330], fl); ost.hR = mixP([40, -196], [170, -330], fl);
            if (lt > c(1) + 1.2 && lt < c(1) + 2.1) { ost.hR = mixP(ost.hR, [-120, -300], prog(lt, c(1) + 1.2, .3)); ost.turn = -.4; ost.look = [-1, -.6]; }
            if (lt > ce(1) - .9) { const k = prog(lt, ce(1) - .9, .2); ost.hR = mixP(ost.hR, [80, -360], k); ost.hL = mixP(ost.hL, [-60, -160], k); }
            ost.face = lt > ce(1) - .9 ? 'joy' : 'proud'; ost.talk = cue.talk(lt, 'O'); ost.tilt = -4 * fl; ost.bob = -6 * fl;
            const hp = clamp((lt - c(1) - .05) / .85);
            if (hp > 0 && hp < 1) { hatK.y = -Math.sin(hp * Math.PI) * 190; hatK.r = hp * 360; }
            ost.headTilt = Math.sin(at * 3) * 2;
          } else if (lt < c(3) - .2) {
            ost.face = 'smug'; ost.hL = [-34, -206]; ost.hR = [34, -206]; ost.look = lt < c(2) + 2.7 ? [-.6, .2] : [-.8, -.9]; ost.bob = -3 - Math.sin(at * 2.4) * 2; ost.tilt = -3;
          } else {
            ost.face = 'smug'; ost.hL = [26, -168]; ost.hR = [-28, -176]; ost.look = [1, -.1]; ost.lid = .4; ost.headTilt = -6; ost.turn = .3;
          }
        } else if (lt < tW1) {
          const u = clamp((lt - tW0) / (tW1 - tW0)); ox = lerp(1250, ownerTop[0], u); oy = rampY(ox);
          const gk = gait((lt - tW0) * 2.6, groundK(ox), 1); Object.assign(ost, { fL: gk.fL, fR: gk.fR, bob: gk.bob, turn: -.6, face: 'focus', look: [-1, -.2], hL: [-70 - gk.sw * 20, -140], hR: [60 + gk.sw * 20, -146], tilt: -5 });
        } else {
          ox = ownerTop[0]; oy = ownerTop[1]; Object.assign(ost, stand(RK));
          const reach = prog(lt, c(4) + .18, .35), yank = prog(lt, ripT - .1, .22, easeOut);
          ost.talk = cue.talk(lt, 'O'); ost.face = lt < ripT ? 'smug' : lt < pkT ? 'focus' : 'smug'; ost.look = lt < crT ? [1, -.5] : [.2, .4];
          let hR = mixP([40, -196], [82, -247], reach); hR = mixP(hR, [58, -180], yank);
          let hL = [-62, -150];
          if (lt > crT - .1) { const sq2 = Math.sin((lt - crT) * 22) * 8 * win(lt, crT, pkT - .1, .1, .1); hR = mixP(hR, [18 + sq2, -188], prog(lt, crT - .1, .2)); hL = mixP(hL, [-18 - sq2, -188], prog(lt, crT - .1, .2)); }
          if (lt > pkT - .1) { hR = mixP(hR, [44, -178], prog(lt, pkT - .1, .3, easeOut)); hL = mixP(hL, [-62, -150], prog(lt, pkT, .3)); }
          if (lt > inT + .1) { hR = mixP(hR, [36, -170], prog(lt, inT + .1, .15)); ost.face = 'smug'; ost.lid = .3; ost.look = [-.4, .1]; }
          ost.hL = hL; ost.hR = hR; ost.tilt = -yank * 4 + (lt > inT ? -2 : 0);
          /* exit into the ship */
          const ex = prog(lt, c(5) - .9, .9, lin);
          if (ex > 0) { ox = lerp(ownerTop[0], 330, ex); oy = lerp(ownerTop[1], 322, ex); os = lerp(.72, .6, ex); oVis = 1 - prog(lt, c(5) - .45, .45); const gk = gait(ex * 2.2, 0, .8); Object.assign(ost, { fL: gk.fL, fR: gk.fR, bob: gk.bob, turn: -.7, look: [-1, 0], hL: [-62, -150], hR: [36, -170] }); }
          /* the word follows his hand */
          const hw = toWorld(ox, oy, os, hR);
          if (lt > ripT - .1) {
            const k = prog(lt, ripT - .1, .15);
            wordPos = mixP([590, 150], [hw[0] + 92, hw[1] + 26], k); wordRot = lerp(0, 16, k) + swing(lt, ripT, 10, 14, 4);
            if (lt > crT - .1) { const kk = prog(lt, crT - .1, .3); wordPos = mixP(wordPos, toWorld(ox, oy, os, [0, -190]), kk); wordS = lerp(.86, .6, kk); }
            crumple = prog(lt, crT, .6, lin);
            if (lt > pkT - .1) { wordPos = mixP(wordPos, toWorld(ox, oy, os, hR), prog(lt, pkT - .1, .2)); wordS = lerp(wordS, .42, prog(lt, pkT, .3)); }
            if (lt > inT) wordOn = 0;
          }
        }
        if (lt >= c(5) && lt < T_DEP) oVis = 0;
        Object.assign(ost, { x: ox, y: oy, s: os, at });
        owner.set(ost); op(owner.root, oVis);
        if (hatIn) hatIn.setAttribute('transform', `translate(0,${f2(hatK.y)}) rotate(${f2(hatK.r)} 0 -405)`);
        pocket.set(lt > inT ? {} : { s: 0 });
        /* the word strip (on banner → in hand → wad) */
        const onBanner = lt < ripT - .1;
        wordG.setAttribute('clip-path', un < 1 ? `url(#${banClipId})` : 'none');
        const nerv = win(lt, c(2) + 3.0, c(3) + .3, .4, .3);
        word.set({ x: wordPos[0], y: wordPos[1], s: wordS, rot: wordRot, crumple: 0, flutter: .25 + nerv * .9, sweat: nerv, at });
        op(word.g, onBanner ? 1 : 0);
        wad.set({ x: wordPos[0], y: wordPos[1], s: wordS, rot: wordRot, crumple, flutter: 1.4, sweat: 1, at }); op(wad.g, !onBanner && wordOn ? 1 : 0);
        ov(patchGhost, lt > ripT ? 1 : 0);
        const rip = win(lt, ripT, ripT + .6, .05, .25); ov(wordRip, rip); if (rip > 0) tf(wordRip, 540, 92, -10, .8 + .3 * pop(lt, ripT, .3));
        const th = win(lt, ripT, ripT + .8, .05, .4); ov(threads, th); if (th > 0) { const q = prog(lt, ripT, .8, easeOut); threads.setAttribute('d', `M490,124 l${f2(-10 - q * 20)},${f2(-6 - q * 14)} M600,120 l${f2(-4)},${f2(-10 - q * 18)} M690,130 l${f2(12 + q * 18)},${f2(-6 - q * 10)} M560,178 l${f2(-6)},${f2(10 + q * 16)} M680,176 l${f2(14 + q * 12)},${f2(8 + q * 10)}`); }
        /* nervous word: eyes, sleeves, sweat (overlay follows the strip) */
        const eyesOn = onBanner ? win(lt, c(2) + 2.9, c(4) + .5, .25, .2) : 0;
        ov(wordX, eyesOn);
        if (eyesOn > 0) {
          tf(wordX, wordPos[0], wordPos[1], wordRot, wordS);
          const dart = Math.sin(at * 2.2) > .3 ? 1 : Math.sin(at * 2.2) < -.3 ? -1 : 0;
          wEyeW.forEach((e, i) => { e.setAttribute('cx', f2((i ? 30 : -30) + dart * 5)); e.setAttribute('cy', f2(-36 + (lt > c(4) ? -3 : 0))); });
          wEyes.setAttribute('transform', `translate(0,${f2(-4 + Math.sin(at * 9) * 1.2)})`);
          wBrows.setAttribute('d', 'M-44,-58 Q-30,-66 -18,-60 M18,-60 Q30,-66 44,-58');
          const out = pop(lt, c(2) + 3.1, .4), roll = prog(lt, c(2) + 3.6, 1.5, lin), flex = prog(lt, c(2) + 5.05, .35, easeBack);
          wArms.forEach((A, i) => {
            const sd = i ? 1 : -1, S = [sd * 117, 14];
            const tug = Math.sin((lt - (c(2) + 3.6)) * 15 + i * Math.PI) * (roll > 0 && roll < 1 ? 1 : 0) * (1 - flex);
            const E0 = [S[0] + sd * 22 * out, S[1] + 36 * out], H0 = [E0[0] + sd * 4 * out, E0[1] + 36 * out];
            const E1 = [S[0] + sd * 46, S[1] - 6], H1 = [E1[0] - sd * 8, E1[1] - 48];
            const Ep = mixP(E0, E1, flex), Hp = mixP(H0, H1, flex); Hp[0] += tug * sd * 8; Hp[1] -= Math.abs(tug) * 10;
            A.arm.setAttribute('d', `M${S[0]},${S[1]} L${f2(Ep[0])},${f2(Ep[1])} L${f2(Hp[0])},${f2(Hp[1])}`);
            const slL = 1 - roll * .72;   /* 1 = down to the wrist … .28 = rolled above the elbow */
            const cp = slL > .5 ? mixP(Ep, Hp, (slL - .5) * 2) : mixP(S, Ep, slL * 2);
            A.sl.setAttribute('d', slL > .5 ? `M${S[0]},${S[1]} L${f2(Ep[0])},${f2(Ep[1])} L${f2(cp[0])},${f2(cp[1])}` : `M${S[0]},${S[1]} L${f2(cp[0])},${f2(cp[1])}`);
            const seg = slL > .5 ? [Ep, Hp] : [S, Ep], ang = Math.atan2(seg[1][1] - seg[0][1], seg[1][0] - seg[0][0]) * 180 / Math.PI;
            A.cuff.setAttribute('cx', f2(cp[0])); A.cuff.setAttribute('cy', f2(cp[1])); A.cuff.setAttribute('transform', `rotate(${f2(ang + 90)} ${f2(cp[0])} ${f2(cp[1])})`);
            A.cuff.setAttribute('rx', f2(12 + roll * 3)); A.cuff.setAttribute('ry', f2(7 + roll * 3));
            A.hand.setAttribute('cx', f2(Hp[0])); A.hand.setAttribute('cy', f2(Hp[1]));
            ov(A.a, out > .02 ? 1 : 0);
          });
          wDrops.forEach((d, i) => { const q = ((at * .9 + i / 4) % 1), sd = i % 2 ? 1 : -1; const sw2 = clamp((lt - (c(2) + 3.4)) * 2); tf(d, sd * (60 + i * 16) + sd * q * 60, -46 - q * 34 + q * q * 150, 0, 1.5 + q * .6); d.setAttribute('opacity', f2(sw2 * (1 - q))); });
        }
        /* gleam on UNSINKABLE */
        const gl = prog(lt, inT - .1, .9, lin);
        ov(gleamG, gl > 0 && gl < 1 ? 1 : 0); if (gl > 0 && gl < 1) tf(gleam, lerp(650, 1560, gl), 70, 0, 1.6, 1);
        sparks.forEach((g, i) => { const k = win(lt, inT + i * .08, c(5) + .6, .1, .4) * (.6 + .4 * Math.sin(at * 8 + i * 2)); ov(g, k); if (k > 0) tf(g, g.bx, g.by, at * 60 + i * 20, .6 + .5 * Math.abs(Math.sin(at * 6 + i))); });

        /* ---------- Captain + teacup ---------- */
        const CP = [140, 330], cs = .74;
        const place = prog(lt, c(6) - .15, .7), release = prog(lt, c(6) + .62, .3);
        const sip = (1 - prog(lt, c(6) - .7, .3)) * clamp(Math.sin(at * .7) * 3 - 1.5);
        let chR = mixP([56, -150], [22, -262], sip);
        const cupHand = toLocal(CP[0], CP[1], cs, [RAILCUP[0] + 8, RAILCUP[1] - 10]);
        chR = mixP(chR, cupHand, place);
        if (release > 0) chR = mixP(chR, lt > c(6) + 1.3 ? [110, -215] : [74, -150], release);
        const cst = { x: CP[0], y: CP[1], s: cs, at, hR: chR, hL: [-58, -138], face: 'neutral', look: [.6, .1], bob: Math.sin(at * 1.6) * 1.5 };
        if (lt > c(1) - .3 && lt < c(2)) { cst.look = [1, .2]; cst.face = 'surprise'; }
        if (lt > c(4) + .5 && lt < c(5)) { cst.look = [1, -.2]; cst.face = 'worried'; }
        if (lt > c(5) && lt < c(6) - .6) { cst.look = [1, .4]; cst.face = 'happy'; }
        if (lt > c(6) - .6) { cst.talk = cue.talk(lt, 'C'); cst.face = 'proud'; cst.look = lt < c(6) + .9 ? [.8, .6] : [1, 0]; cst.turn = .3; }
        const wink = win(lt, c(6) + 2.65, c(6) + 3.3, .06, .08);
        if (wink > 0) { cst.look = [0, 0]; cst.turn = 0; cst.face = 'proud'; cst.headTilt = 5; }
        capt.set(cst); ov(winkG, wink > .5 ? 1 : 0); ov(winkStar, wink); if (wink > 0) winkStar.setAttribute('transform', `translate(42,-322) rotate(${f2(at * 200)}) scale(${f2(.4 + wink * .8)})`);
        /* teacup: in his hand (sipping) → set down on the rail → perfectly still */
        const ch = toWorld(CP[0], CP[1], cs, chR);
        const held = [ch[0] + 2, ch[1] + 8];
        const cupP = release > 0 ? RAILCUP : mixP(held, RAILCUP, place * place);
        cup.set({ x: cupP[0], y: cupP[1], s: .66, tilt: 0, ripple: 0, steam: 1, at });

        /* ---------- porters, tower, Mitzi, Lady ---------- */
        const pT0 = c(5) - 1.0, pT1 = c(6) - .35;
        const pu = clamp((lt - pT0) / (pT1 - pT0));
        const pcx = lerp(1700, 380, pu);
        const pvis = lt > pT0 - .05 && lt < T_DEP;
        ov(crewG, pvis ? 1 : 0);
        if (pvis) {
          const inDoor = lt > pT1 ? 1 : 0;
          const ps = inDoor ? lerp(.6, .5, prog(lt, pT1, .3)) : .6;
          const xF = inDoor ? lerp(310, 318, prog(lt, pT1, .3)) : pcx - 70, xB = inDoor ? lerp(450, 392, prog(lt, pT1, .3)) : pcx + 70;
          const yF = inDoor ? 318 : rampY(xF), yB = inDoor ? lerp(330, 316, prog(lt, pT1, .3)) : rampY(xB);
          const ph = (lt - pT0) * 2.5;
          const wob = Math.sin(at * 5) * 2;
          [[pF, xF, yF, 0], [pB, xB, yB, .5]].forEach(([P, x, y, o]) => {
            const gk = inDoor ? { fL: [-24 + wob, 0], fR: [24 + wob, 0], bob: Math.abs(Math.sin(at * 6)) * 3, sw: 0 } : gait(ph + o, groundK(x), .9);
            P.set({ x, y, s: ps, at, fL: gk.fL, fR: gk.fR, bob: gk.bob + 4, hL: [-44, -262], hR: [44, -262], face: 'worried', sweat: .8, look: [-.5, -1], turn: -.3, tilt: Math.sin(at * 4 + o * 3) * 3 });
          });
          const shF = [xF, yF - ps * 266], shB = [xB, yB - ps * 266];
          plank.setAttribute('d', `M${f2(shF[0] - 20)},${f2(shF[1])} L${f2(shB[0] + 20)},${f2(shB[1])}`);
          const mid = mixP(shF, shB, .5);
          const careful = win(lt, c(5) - .1, c(5) + .9, .2, .4);
          const sway = Math.sin(at * 3.1) * 5 + Math.sin(lt * 2.3) * 3 + careful * Math.sin(at * 6) * 6 + (inDoor ? Math.sin(at * 7) * 5 : 0);
          const ts2 = .58 * ps / .6;
          tower.set({ x: mid[0], y: mid[1] - 4, s: ts2, sway, at });
          const topY = mid[1] - 4 - tower.height * ts2;
          const swayX = Math.sin(sway * Math.PI / 180) * tower.height * ts2 * 1.3;
          const duck = win(lt, pT1 - .5, pT1 + .3, .15, .2);
          mitzi.set({ x: mid[0] + swayX, y: topY + 3 + duck * 12, s: ts2, flip: true, at, face: duck > .3 ? 'worried' : lt < c(6) ? 'happy' : 'smug', wag: .8, rot: sway * .7 + duck * 24 });
          /* the Lady follows, fanning */
          const lA = c(5) - .2, lB = c(6) + .1, lu = clamp((lt - lA) / (lB - lA));
          const lx = lerp(1760, 495, lu), ly = rampY(lx);
          const lmove = lu > 0 && lu < 1;
          const lg = lmove ? gait((lt - lA) * 2.3, groundK(lx), .7) : stand(groundK(lx));
          const talkP = cue.talk(lt, 'P');
          const lst = { x: lx, y: ly, s: .7, at, fL: lg.fL, fR: lg.fR, bob: lg.bob || 0, turn: lt < c(6) ? -.5 : .25, face: lt < c(6) ? 'worried' : 'surprise', look: lt < c(6) ? [-1, -.6] : [-1, -.3], talk: talkP, fan: lt < c(6) + 2.5 ? .6 : 1.5 };
          if (talkP) lst.hL = [-104 + Math.sin(at * 7) * 6, lt < c(5) + 1.0 ? -250 : -226];
          if (lt > c(6) + 2.6) { lst.face = 'happy'; lst.hR = [30, -230]; lst.blush = .6; }
          lady.set(lst); op(lady.root, lt > lA ? 1 : 0);
        }

        /* ---------- Shipbuilder + magazine ---------- */
        const sbx = lerp(1495, 2020, prog(lt, c(4) + 1.6, 2.2, lin)), SBP = [sbx, 805], sbs = .82;
        const magOn = lt > c(3) - .5 && lt < c(4) + .3;
        const sst = { x: SBP[0], y: SBP[1], s: sbs, at, face: 'think', look: [-.8, -.8] };
        if (lt < c(1) + 1.5) { sst.face = 'neutral'; sst.look = [-.6, -.4]; }
        if (lt > ce(1) - .9 && lt < c(3) - .4) { sst.face = 'worried'; sst.look = [-1, -.9]; sst.headTilt = 6; }
        ov(shipb.blueprint, magOn ? 0 : 1); ov(MAG, magOn ? 1 : 0);
        if (magOn) {
          const up = prog(lt, c(3) - .3, .4, easeBack);
          sst.hR = mixP([58, -128], toLocal(SBP[0], SBP[1], sbs, [1598, 640]), up);
          sst.face = cue.talk(lt, 'S') ? 'focus' : 'think'; sst.talk = cue.talk(lt, 'S'); sst.look = [.8, -.6]; sst.turn = .35;
          tf(magG, 0, (1 - up) * 140);
          ov(pointer, win(lt, c(3) + .5, c(3) + 1.2, .2, .2)); tf(pointer, SPECK[0] - 6 - Math.abs(Math.sin(at * 8)) * 6, SPECK[1] - 2, 0, .8);
          const l1in = prog(lt, c(3) + 1.05, .45, easeOut), l2in = prog(lt, c(3) + 2.05, .5, easeOut);
          const l1 = mixP([1470, 720], [SPECK[0], SPECK[1]], l1in), l2 = mixP([1850, 720], [SPECK[0] + 2, SPECK[1] + 2], l2in);
          lens2.set(l2[0], l2[1], 3, -28, l2in > 0 ? 1 : 0);
          lens1.set(l1[0], l1[1], lerp(2.8, 8.4, prog(lt, c(3) + 2.4, .35)), 32, l1in > 0 ? 1 : 0);
          sst.hL = l1in > 0 ? toLocal(SBP[0], SBP[1], sbs, [l1[0] - 30, l1[1] + 50]) : [-58, -128];
          ov(armB, l2in > 0 ? 1 : 0);
          if (l2in > 0) { const hx = l2[0] + 48, hy = l2[1] + 92; tf(armB, hx, hy, 0, 1); }
        } else if (lt > c(4) + .3) {
          sst.face = 'worried'; sst.look = [-1, -.8];
          if (lt > c(4) + 1.6) { const gk = gait((lt - c(4) - 1.6) * 2.2, 0, .8); Object.assign(sst, { fL: gk.fL, fR: gk.fR, bob: gk.bob, turn: .6, look: [1, .2], face: 'sad' }); }
        }
        shipb.set(sst); op(shipb.root, sbx < 1990 ? 1 : 0);
        }
      }

      /* ---------- newsboys (foreground) ---------- */
      const nb = !deckOn ? win(lt, c(2) - .35, c(2) + 2.75, .4, .35) : 0;
      boys.forEach((B, i) => {
        op(B.root, nb > 0 ? 1 : 0); ov(papers[i], nb > 0 ? 1 : 0);
        if (nb <= 0) return;
        const bx = i ? 600 : 190, by = 865 + (1 - easeOut(clamp(nb * (i ? .9 : 1.2)))) * 420 + Math.abs(Math.sin(at * 7 + i * 2)) * -12, s = 1.45;
        const wave = Math.sin(at * 6 + i * 1.7);
        const pp = [bx + (i ? -20 : 25) + wave * 12, by - 420 + Math.cos(at * 6 + i) * 6];
        tf(papers[i], pp[0], pp[1]);
        B.set({ x: bx, y: by, s, at, face: 'joy', talk: true, hL: toLocal(bx, by, s * .6, [pp[0] - 86, pp[1] + 60]), hR: toLocal(bx, by, s * .6, [pp[0] + 80, pp[1] + 60]), look: [i ? -.4 : .4, -.6], turn: i ? -.2 : .2 });
      });

      /* ================= DECK SHOT (line 8) ================= */
      ov(deckChars, deckOn ? 1 : 0);
      if (deckOn) {
        const u = lt - T_DECK;
        tf(deckSlide, -u * 60, 0);
        deckGulls.forEach((gl, i) => gl.set(XD + 560 + i * 520 + ((at * (40 + i * 25)) % 400), 60 + i * 260 + Math.sin(at * 1.3 + i) * 16, 1.4 - i * .4, Math.sin(at * 8 + i * 3), i ? -6 : 6));
        deckRip.setAttribute('d', (() => { let d = ''; for (let i = 0; i < 26; i++) { const x = XD - 300 + ((i * 97 - u * 160) % 2200 + 2200) % 2200, y = HZD + 14 + (i % 7) * 19; d += `M${f2(x)},${y} h${30 + (i % 4) * 12}`; } return d; })());
        const RPP = [XD + 600, 845], rs = .98, OPP = [XD + 945, 845], ows = 1.02;
        const snatch = c(8) + .2, fling = c(8) + 1.36, splashT = c(8) + 1.82;
        /* reporter */
        const scrib = lt < snatch ? 1 : 0;
        const rst = { x: RPP[0], y: RPP[1], s: rs, at, hR: [70, -205], hL: [26 + Math.sin(at * 22) * 6 * scrib, -214 + Math.cos(at * 17) * 4 * scrib], face: lt < snatch ? 'focus' : 'surprise', look: lt < snatch ? [.5, .7] : lt < fling ? [1, -.2] : [1, -1], turn: lt < snatch ? 0 : .4, propRotL: -30 };
        if (lt > fling + .3) { rst.face = 'sad'; rst.hR = [62, -190]; }
        rep.set(rst);
        /* writing reveal */
        padClipR.setAttribute('width', f2(clamp((lt - T_DECK) / .6)));
        /* owner */
        const ost = { x: OPP[0], y: OPP[1], s: ows, at, face: 'neutral', look: [1, -.3], hL: [-62, -150], hR: [40, -196] };
        if (lt > T_DECK + .2) { ost.look = [-1, .2]; ost.face = 'worried'; ost.turn = -.3; }
        const repHandW = toWorld(RPP[0], RPP[1], rs, rst.hR);
        let padW = repHandW, padR = -6, padS = .9;
        if (lt > snatch - .15) {
          const k = prog(lt, snatch - .15, .2, easeOut);
          ost.hL = mixP([-62, -150], toLocal(OPP[0], OPP[1], ows, [repHandW[0] + 10, repHandW[1]]), k);
          if (lt > snatch + .05) { const k2 = prog(lt, snatch + .05, .25, easeOut); ost.hL = mixP(ost.hL, [-80, -300], k2); ost.face = 'surprise'; ost.talk = cue.talk(lt, 'O'); ost.look = [-.6, -.6]; }
          if (lt > snatch + .05) padW = toWorld(OPP[0], OPP[1], ows, ost.hL);
          if (lt > snatch + .6) { ost.hL = [-80 + Math.sin(at * 9) * 10, -300]; padW = toWorld(OPP[0], OPP[1], ows, ost.hL); ost.face = 'focus'; ost.hR = [70, -250]; }
          if (lt > fling - .3) { const kw = prog(lt, fling - .3, .25); ost.hL = mixP(ost.hL, [-40, -400], kw); ost.tilt = -6 * kw; padW = toWorld(OPP[0], OPP[1], ows, ost.hL); ost.turn = -.5; }
          if (lt > fling) { const kf2 = prog(lt, fling, .12, easeOut); ost.hL = mixP([-40, -400], [80, -330], kf2); ost.tilt = lerp(-6, 6, kf2); ost.face = 'smug'; ost.turn = .2; ost.look = [1, -.6]; }
          if (lt > fling + .35) { ost.hL = [-34, -200 + Math.sin(at * 12) * 6]; ost.hR = [34, -200 - Math.sin(at * 12) * 6]; ost.tilt = 0; ost.look = [-.8, .1]; ost.face = cue.talk(lt, 'O') ? 'focus' : 'smug'; }
          ost.talk = cue.talk(lt, 'O');
          padR = lerp(-6, 14, k);
        }
        Object.assign(ost, { bob: Math.sin(at * 2) * 1.5 });
        owner.set(ost); op(owner.root, 1);
        if (hatIn) hatIn.setAttribute('transform', '');
        pocket.set({});
        /* notebook: in hand → flying → splash */
        const flying = lt > fling;
        ov(padG, flying ? 0 : 1); ov(deckPadFly, flying && lt < splashT ? 1 : 0);
        tf(padG, padW[0], padW[1], padR, padS);
        if (flying) {
          const q = clamp((lt - fling) / (splashT - fling)), P0 = toWorld(OPP[0], OPP[1], ows, [80, -330]), P1 = [XD + 1260, 492];
          const p = arcPos(q, P0, P1, 320);
          tf(deckPadFly, p[0], p[1], q * 700, lerp(1.05, .45, q));
        }
        const sp2 = win(lt, splashT, splashT + .5, .02, .3); ov(deckSplash, sp2);
        if (sp2 > 0) { const q = prog(lt, splashT, .5, easeOut), X = XD + 1260, Y = 492; dSpl.setAttribute('d', dots([[X - 16, Y - q * 30, 5], [X + 12, Y - q * 40, 4.5], [X, Y - q * 54, 6], [X - 30, Y - q * 14, 4], [X + 28, Y - q * 18, 3.5]])); dRing.setAttribute('cx', X); dRing.setAttribute('cy', Y + 4); dRing.setAttribute('rx', f2(10 + q * 46)); dRing.setAttribute('ry', f2(3 + q * 9)); }
      }
    }

    /* ================= Owner off-screen states (wide shots) ================= */
  };
}});
