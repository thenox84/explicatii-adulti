"use strict";
/* SCENE 7 — Rescue, and the rules.  Every beat is anchored to cue(); lt ranges are at the current timing (cue.d 56.35).
   [0]  0.0–7.4   NIGHT: Carpathia slaloms between icebergs (weaves near/far, foam track snaking behind her), every lamp lit
                  (strings of bulbs, glowing portholes), five lantern-lit lookouts; camera tracks and pushes in on the near pass.
   [0]  7.1–10.0  COLD PINK DAWN on Carpathia's deck (crossfade): a lifeboat alongside, a survivor climbs aboard, a human chain of
                  stewards passes blankets and cocoa mugs hand to hand from the COCOA urn; the shivering family waits.
   [1] 10.0–14.2  push in: the rescue captain swings one big tartan blanket round the Posh lady, a boy, his mother and sister;
                  shivering stops, everyone beams; Mitzi (flat cap) licks the boy's nose, a heart pops.
   [2] 14.2–17.1  cut in to a two-shot: giant binoculars with a red bow, presented with a little bow ("No key required").
   [3] 16.6–17.7  the Lookout hugs them (hearts), "Thank you." with a blush and a nod, raises them to the horizon...
       17.7–19.1  ...binocular POV: the Iceberg's tip whistles, notices, ducks underwater: ripples, bubbles, "glug!".
   [4] 19.1–27.4  wood-panelled committee room (London window): delegates bicker, then all raise hands at once; the 1914
                  SAFETY OF LIFE AT SEA TREATY book thuds onto the lectern (dust, jumps); the cover opens; the hand of officialdom
                  stamps LIFEBOAT SEATS FOR EVERYONE beside the crossed-out 1912 half-empty boat; blackboard SEATS < PEOPLE
                  becomes SEATS = PEOPLE with a tick and a DING.
   [5] 27.3–30.8  page turn: RADIO WATCH 24 HOURS over the crossed-out sleeping radio; the wall clock whizzes "around the clock";
                  the wide-awake operator by his DAY AND NIGHT rota files a HAPPY BIRTHDAY telegram in the LATER tray.
   [6] 30.8–33.4  page turn: INTERNATIONAL ICE PATROL over the crossed-out iceberg; the camera pushes into the page's picture...
   [7] 33.4–38.0  ...an ICE PATROL ship sweeps round the Iceberg with a searchlight, a sailor with a clipboard and a very long tape
                  that runs down into the water beside its hidden ninety per cent; "A patrol?" (startled) "Just for me?" (smug)
                  "ninety per cent offended": it turns away, folds its arms, pouts, hides behind a small berg that edges away.
   [8] 38.0–46.0  fade through black to the SINCERE CODA (no gags, no faces): grey first light, a still sea, a memorial wreath
                  drifting in the sun's path, one gull gliding low.
   [9] 45.5–end   the sun rises and warms the sky; a modern ship lined with bright orange lifeboats sails calmly past, mast light
                  blinking; tail: small end card "TITANIC · 10–15 April 1912". The held final frame (lt clamped) stays alive on
                  `at`: swell, glints, slow clouds, high gulls, wreath bob and ripples, mast light, radar. */
SCENE(7, { build(world, cue) {
  const LT = cue, LE = cue.e, DUR = cue.d;
  /* ---------- shot boundaries ---------- */
  const T_DAWN = LT(0) + 4.05;                 // night → dawn deck
  const T_POV = LT(3) + .52;                   // binocular POV
  const T_ROOM = LT(4) + .42;                  // committee room
  const T_PUSH0 = LT(6) + 1.3, T_PUSH1 = LT(6) + 2.3;   // push into the page's picture
  const T_FADE = LT(8) - 1.35, T_CODA = LT(8) - .7;    // fade to black, coda fades up

  /* ---------- helpers ---------- */
  const frac = v => v - Math.floor(v);
  const layT = (g, cx, cy, z, f, x0) => g.setAttribute('transform', `translate(800,450) scale(${f2(z * 1000) / 1000}) translate(${f2(-(x0 + (cx - x0) * f))},${f2(-cy)})`);
  const camT = (g, cx, cy, z) => g.setAttribute('transform', `translate(800,450) scale(${f2(z * 1000) / 1000}) translate(${f2(-cx)},${f2(-cy)})`);
  const camAt = (t, K) => keyed(t, K.map(k => [k[0], k.slice(1)]));
  const dots = L => L.map(([x, y, r]) => `M${f2(x - r)},${f2(y)}a${f2(r)},${f2(r)} 0 1,0 ${f2(2 * r)},0a${f2(r)},${f2(r)} 0 1,0 ${f2(-2 * r)},0`).join('');
  /* split a wide multi-subpath path into spatial chunks (raster tiles only process the chunks they overlap) */
  const chunkP = (p, items, attrs, cw = 420) => { const m = {}; items.forEach(([x, d]) => { const k = Math.floor(x / cw); (m[k] = m[k] || []).push(d); }); return Object.keys(m).map(k => E('path', Object.assign({ d: m[k].join(' ') }, attrs), p)); };
  const poly = P => 'M' + P.map(p => f2(p[0]) + ',' + f2(p[1])).join(' L') + ' Z';
  const smooth = (P, closed = true) => {
    const n = P.length, gp = i => closed ? P[(i + n) % n] : P[clamp(i, 0, n - 1)];
    let d = `M${f2(P[0][0])},${f2(P[0][1])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = gp(i - 1), p1 = gp(i), p2 = gp(i + 1), p3 = gp(i + 2);
      d += ` C${f2(p1[0] + (p2[0] - p0[0]) / 6)},${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)},${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])},${f2(p2[1])}`;
    }
    return d + (closed ? ' Z' : '');
  };
  /* world position of a Person's hand (approx.; ignores tilt) and the inverse */
  const handW = (x, y, s, h, flip, bob = 0) => [x + (flip ? -1 : 1) * s * h[0], y + s * (h[1] + bob)];
  const handL = (x, y, s, w, flip, bob = 0) => [(w[0] - x) / s * (flip ? -1 : 1), (w[1] - y) / s - bob];
  const kick = (t, T, amp, dec = 7, fr = 46) => { let v = 0; T.forEach(t0 => { if (t > t0) v += amp * Math.exp(-(t - t0) * dec) * Math.sin((t - t0) * fr); }); return v; };
  const hop = (t, t0, h = 10, d = .35) => t > t0 && t < t0 + d ? -h * Math.sin(Math.PI * (t - t0) / d) : 0;
  const DAWNRIM = '#FFC2A4';

  /* light-weight night sky and calm seas (same palettes as world.js, a fraction of the raster cost) */
  const nightSky = (p, x0, w, y0, hy) => {
    E('rect', { x: x0, y: y0, width: w, height: hy - y0 + 6, fill: lgrad([[0, '#02040A'], [.45, '#060A1A'], [.74, '#0D1430'], [.9, '#1E2A52'], [1, '#3A3C6C']]) }, p);
    const cx = x0 + w * .42, cy = y0 + (hy - y0) * .42, mw = G(p, { transform: `rotate(-22 ${f2(cx)} ${f2(cy)})` });
    E('ellipse', { cx, cy, rx: w * .5, ry: 170, fill: rgrad([[0, '#9AACF0', .14], [.55, '#8FA4F0', .05], [1, '#8FA4F0', 0]]) }, mw);
    E('ellipse', { cx: cx + 120, cy: cy + 6, rx: 520, ry: 22, fill: rgrad([[0, '#03050D', .5], [1, '#03050D', 0]]) }, mw);
    const dd = [[], []]; for (let i = 0; i < 420; i++) { const u = hash(i * 1.37 + 3) - .5, v = (hash(i * 2.11) + hash(i * 3.7 + 1) - 1); dd[i % 2].push([cx + u * w * .95, cy + v * 150 * (1 - Math.abs(u) * .8), .5 + hash(i * 7.7) * .8]); }
    dd.forEach((a, k) => chunkP(mw, a.map(q => [q[0], dots([q])]), { fill: '#FFFFFF', 'fill-opacity': [.28, .5][k] }));
    const B = [[], [], []], tw = [];
    for (let i = 0; i < 300; i++) { const x = x0 + hash(i * 13.7 + 1) * w, y = y0 + Math.pow(hash(i * 3.77 + 2), 1.3) * (hy - y0 - 20), b = Math.pow(hash(i * 5.31 + 4), 2.2); B[b > .6 ? 2 : b > .25 ? 1 : 0].push([x, y, .6 + b * 1.4]); }
    B.forEach((a, k) => chunkP(p, a.map(q => [q[0], dots([q])]), { fill: k === 2 ? '#FFF6E6' : '#E6ECFF', 'fill-opacity': [.35, .6, .95][k] }));
    for (let i = 0; i < 16; i++) { const g = G(p); g.x = x0 + hash(i * 9.1 + 5) * w; g.y = y0 + hash(i * 4.3 + 7) * (hy - y0 - 80); tf(g, g.x, g.y);
      E('circle', { r: 6, fill: '#CFE0FF', 'fill-opacity': .14 }, g); E('circle', { r: 1.9, fill: '#FFFFFF' }, g); E('path', { d: 'M-8,0 H8 M0,-8 V8', stroke: '#FFFFFF', 'stroke-width': .7, 'stroke-opacity': .6 }, g); tw.push({ g, ph: hash(i) * 6.28, fr: 1.2 + hash(i * 2) * 2 }); }
    const shoot = E('path', { stroke: '#FFFFFF', 'stroke-width': 1.8, 'stroke-linecap': 'round', fill: 'none' }, p);
    return { anim: at => { tw.forEach(t => tf(t.g, t.g.x, t.g.y, 0, .65 + .35 * Math.sin(at * t.fr + t.ph)));
      const k = Math.floor(at / 4.6), q = (at - k * 4.6) / 1.1; if (q > 1 || hash(k * 3.1) < .25) { op(shoot, 0); return; }
      const sx = x0 + w * (.3 + .4 * hash(k * 5.3)), sy = y0 + 80 + hash(k * 6.1) * 200, dir = hash(k * 7.7) > .5 ? 1 : -1, L = 300;
      const hx = sx + dir * L * q, hy2 = sy + L * .45 * q, tl = 60 + 50 * Math.sin(Math.PI * q);
      shoot.setAttribute('d', `M${f2(hx - dir * tl)},${f2(hy2 - tl * .45)} L${f2(hx)},${f2(hy2)}`); op(shoot, Math.sin(Math.PI * q)); } };
  };
  const calmSea = (p, x0, w, hy, y1, pal) => {
    E('rect', { x: x0, y: hy, width: w, height: y1 - hy, fill: lgrad(pal.grad) }, p);
    E('rect', { x: x0, y: hy - 1, width: w, height: 4, fill: pal.hi, 'fill-opacity': .35 }, p);
    const rows = [];
    for (let r = 0; r < pal.rows; r++) { const t = (r + 1) / (pal.rows + 1), y = hy + 4 + Math.pow(t, 1.7) * (y1 - hy) * .95, P = lerp(60, 340, t), a = lerp(.6, pal.amp, t); const d = [], d2 = [];
      for (let x = x0 - P, k = 0; x < x0 + w + P; x += P, k++) { const j = hash(r * 7.1 + k * 1.3); if (pal.wavy) { d.push([x, `M${f2(x)},${f2(y)} q${f2(P * .25)},${f2(-a)} ${f2(P * .5)},0`]); d2.push([x, `M${f2(x + P * .5)},${f2(y + a * .6)} q${f2(P * .25)},${f2(a * .7)} ${f2(P * .45)},0`]); }
        else if (j > .3) d.push([x, `M${f2(x + P * j * .4)},${f2(y)} h${f2(P * (.15 + j * .4))}`]); }
      const g = G(p); chunkP(g, d, { stroke: pal.hi, 'stroke-width': lerp(.8, pal.sw, t), 'stroke-opacity': lerp(.18, pal.op, t), fill: 'none', 'stroke-linecap': 'round' }, 500);
      if (d2.length && t > .4) chunkP(g, d2, { stroke: pal.lo, 'stroke-width': lerp(1, pal.sw * 1.6, t), 'stroke-opacity': lerp(.1, .3, t), fill: 'none', 'stroke-linecap': 'round' }, 500);
      rows.push({ g, P, sp: lerp(3, pal.sp, t), r, a }); }
    const gl = [];
    if (pal.sunX != null) { const L2 = [[], []]; for (let j = 0; j < 40; j++) { const tt = Math.pow(hash(j * 2.71 + 5), 1.5), y = hy + 3 + tt * (y1 - hy) * .9, spr = 8 + tt * 140, x = pal.sunX + (hash(j * 4.33) - .5) * 2 * spr, wd = 6 + 40 * tt * (.3 + .7 * hash(j * 6.1)); L2[j & 1].push(`M${f2(x - wd / 2)},${f2(y)} h${f2(wd)}`); }
      L2.forEach((d, k) => { gl[k] = E('path', { d: d.join(''), stroke: pal.glint, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, p); }); }
    let refl = null;
    if (pal.stars) { const d = []; for (let i = 0; i < 120; i++) { const x = x0 + hash(i * 6.1 + 2) * w, y = hy + 6 + Math.pow(hash(i * 2.9), 1.4) * (y1 - hy) * .8, l = 2 + hash(i * 1.7) * 4; d.push([x, `M${f2(x)},${f2(y)} v${f2(l)}`]); } refl = G(p, { stroke: '#C9D4FF', 'stroke-width': 1.4, 'stroke-opacity': .35, 'stroke-linecap': 'round' }); chunkP(refl, d, {}); }
    return { anim: at => { rows.forEach(o => tf(o.g, -((at * o.sp + o.r * 37) % o.P), Math.sin(at * .8 + o.r * 1.3) * o.a * .25));
      gl.forEach((g, k) => g.setAttribute('stroke-opacity', f2(.35 + .65 * Math.max(0, Math.sin(at * (2.1 + k * .7) + k * 2)))));
      if (refl) refl.setAttribute('stroke-opacity', f2(.28 + .1 * Math.sin(at * 1.3))); } };
  };

  /* light-weight dawn sky: static rays (no full-sky repaint every frame), a few drifting lens clouds */
  const dawnSky = (p, x0, w, y0, hy, sun) => {
    E('rect', { x: x0, y: y0, width: w, height: hy - y0 + 6, fill: lgrad([[0, '#3C4F8A'], [.42, '#8A7DAE'], [.68, '#E39EA4'], [.86, '#F8BE96'], [1, '#FFDDA2']]) }, p);
    const sg = G(p); tf(sg, sun[0], sun[1]);
    E('circle', { r: 330, fill: rgrad([[0, '#FFE6A8', .5], [.45, '#FFD0A0', .16], [1, '#FFC090', 0]]) }, sg);
    { let d = ''; for (let i = 0; i < 12; i++) { const a = -Math.PI * (i + .5) / 12, a2 = a + .07; d += `M0,0 L${f2(Math.cos(a) * 1500)},${f2(Math.sin(a) * 1500)} L${f2(Math.cos(a2) * 1500)},${f2(Math.sin(a2) * 1500)} Z `; } E('path', { d, fill: '#FFF2D0', 'fill-opacity': .07 }, sg); }
    E('circle', { r: 84, fill: '#FFE7B0', 'fill-opacity': .5 }, sg); E('circle', { r: 66, fill: '#FFF1CC' }, sg); E('circle', { r: 56, fill: '#FFF8E6' }, sg);
    const cl = [[180, 80, 300], [980, 30, 360], [1500, 150, 260], [-300, 170, 240], [2050, 60, 320]].map(([x, y, cw], i) => { const g = G(p);
      E('path', { d: dots([[-cw * .28, 6, cw * .14], [-cw * .04, 2, cw * .2], [cw * .22, 6, cw * .15]]).replace(/a(\S+?),(\S+?) /g, (m, rx, ry) => `a${rx},${f2(+ry * .2)} `), fill: '#E7AABB' }, g);
      E('path', { d: dots([[-cw * .26, 0, cw * .12], [-cw * .03, -4, cw * .18], [cw * .2, 0, cw * .13]]).replace(/a(\S+?),(\S+?) /g, (m, rx, ry) => `a${rx},${f2(+ry * .22)} `), fill: '#F6C3B4' }, g);
      E('path', { d: `M${f2(-cw * .36)},${f2(cw * .035)} Q0,${f2(cw * .07)} ${f2(cw * .34)},${f2(cw * .035)}`, stroke: '#FFE3B8', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
      return { g, x, y, sp: 3 + hash(i) * 4 }; });
    return { anim: at => cl.forEach(c => tf(c.g, c.x + Math.sin(at * .03 + c.x) * 60, c.y)) };
  };

  /* faceless icebergs (shot A, picture, coda backgrounds) */
  const BERG = [
    [[-.5, 0], [-.44, -.3], [-.33, -.38], [-.2, -.72], [-.07, -.6], [.05, -1], [.18, -.76], [.29, -.82], [.41, -.36], [.5, 0]],
    [[-.5, 0], [-.47, -.5], [-.34, -.6], [-.12, -.57], [.08, -.64], [.33, -.58], [.46, -.48], [.5, 0]],
    [[-.5, 0], [-.38, -.42], [-.27, -.92], [-.13, -.55], [0, -.64], [.13, -1], [.27, -.62], [.4, -.46], [.5, 0]]
  ];
  const mkBerg = (p, k, W, H, pal, o = {}) => {
    const g = G(p); const P = BERG[k].map(([u, v]) => [u * W, v * H]);
    let pi = 0; P.forEach((q, i) => { if (q[1] < P[pi][1]) pi = i; }); const pk = P[pi];
    if (o.reflect) E('path', { d: poly(P.map(([x, y]) => [x, -y * .6])), fill: pal[1], 'fill-opacity': o.reflect }, g);
    E('path', { d: poly(P), fill: pal[0] }, g);
    E('path', { d: poly([pk, ...P.slice(pi + 1), [pk[0] + W * .08, 0]]), fill: pal[1] }, g);
    E('path', { d: poly([pk, [pk[0] - W * .16, -H * .4], [pk[0] - W * .04, 0], [pk[0] + W * .08, 0]]), fill: pal[2], 'fill-opacity': .45 }, g);
    E('path', { d: 'M' + P.slice(1, pi + 1).map(q => f2(q[0] + 3) + ',' + f2(q[1] + 3)).join(' L'), fill: 'none', stroke: pal[3], 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-opacity': .75 }, g);
    E('path', { d: `M${f2(-W * .53)},1 H${f2(W * .53)}`, stroke: pal[4], 'stroke-width': 3, 'stroke-opacity': .55, 'stroke-linecap': 'round' }, g);
    g.warm = o.warm ? E('path', { d: poly(P), fill: o.warm, opacity: 0 }, g) : null;
    return g;
  };

  /* ====================================================================
     SHOT A — night slalom
     ==================================================================== */
  const A = G(world);
  const HZA = 500, AX0 = 700;
  const aSky = G(A), aSea = G(A), aFar = G(A), aMain = G(A), aFG = G(A);
  const skyA = nightSky(aSky, -600, 3400, -300, HZA);
  const seaA = calmSea(aSea, -600, 3800, HZA, 960, { grad: [[0, '#18213F'], [.12, '#0D1430'], [1, '#04070F']], hi: '#4A5C96', lo: '#020409', rows: 9, amp: 2, sw: 1.8, op: .45, sp: 8, stars: true });
  const PAL_N = ['#45527C', '#2B3662', '#1A2246', '#94A4D2', '#A8B6DE'], PAL_NF = ['#39456C', '#28325A', '#1C2448', '#6E7EAC', '#7E8CB8'];
  [[260, 80, 34, 1], [980, 120, 52, 2], [1700, 90, 36, 0], [2320, 130, 46, 2], [2900, 90, 30, 1]].forEach(([x, w, h, k]) => { const b = mkBerg(aFar, k, w, h, PAL_NF, { reflect: .25 }); tf(b, x, HZA + 3); });
  const backB = [[560, 568, 250, 160, 0], [1345, 556, 290, 140, 1], [1950, 562, 280, 190, 0], [2620, 566, 260, 170, 2]].map(([x, y, w, h, k]) => { const b = mkBerg(aMain, k, w, h, PAL_NF, { reflect: .25, warm: '#FFD9A0' }); tf(b, x, y); b.bx = x; return b; });
  /* the foam track: a snaking ski-run behind the ship */
  const wakeGrad = E('linearGradient', { id: uid('wk'), gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 1, y2: 0 }, DEFS);
  E('stop', { offset: 0, 'stop-color': '#C8D4F4', 'stop-opacity': 0 }, wakeGrad); E('stop', { offset: 1, 'stop-color': '#F0F4FF', 'stop-opacity': .85 }, wakeGrad);
  const wakeW = E('path', { fill: 'none', stroke: `url(#${wakeGrad.id})`, 'stroke-width': 9, 'stroke-linecap': 'round', opacity: .22 }, aMain);
  const wakeL = E('path', { fill: 'none', stroke: `url(#${wakeGrad.id})`, 'stroke-width': 2.2, 'stroke-dasharray': '34 14 60 18', 'stroke-linecap': 'round', opacity: .8 }, aMain);
  /* the ship + extra lamps + lookouts (ship-local coordinates) */
  const shipA = G(aMain);
  E('ellipse', { cx: 0, cy: -70, rx: 430, ry: 170, fill: rgrad([[0, '#FFD38A', .26], [.5, '#FFB870', .08], [1, '#FFB870', 0]]) }, shipA);
  const reflA = G(shipA); const refl2 = [];
  { const S2 = [[], []]; for (let x = -176, c = 0; x <= 340; x += 16, c++) { if (hash(c * 2.7) < .3) continue; const k = c & 1, n = 3 + Math.floor(hash(c * 1.9) * 4); for (let j = 0; j < n; j++) { const y = 10 + j * 13 + hash(c + j) * 5, w = (7 + hash(c * 1.3 + j) * 8) * (1 - j / (n + 1)); S2[k].push(`M${f2(x - w / 2)},${f2(y)} h${f2(w)}`); } }
    S2.forEach((s, k) => { refl2[k] = E('path', { d: s.join(''), stroke: k ? '#FFD27A' : '#FFE8B0', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-opacity': .5 }, reflA); }); }
  const carp = Carpathia(shipA, { mood: 'night' });
  const CS = x => -50 - 14 * Math.pow(Math.max(0, x / 350), 2) - 8 * Math.pow(Math.max(0, -x / 350), 2);
  const lampsA = G(shipA);
  const SPAN = [[354, -66], [262, -236], [-92, -224], [-180, -220], [-268, -214], [-352, -60]];
  const bulbs = [];
  for (let i = 0; i < SPAN.length - 1; i++) { const a = SPAN[i], b = SPAN[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(2, Math.round(len / 19)), sag = Math.abs(b[0] - a[0]) / len * len * .045;
    for (let k = i ? 1 : 0; k <= n; k++) { const u = k / n; bulbs.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + Math.sin(Math.PI * u) * sag]); } }
  for (let x = -160; x <= 170; x += 17) bulbs.push([x, CS(x) - 30]);
  E('path', { d: smooth(bulbs.slice(0, bulbs.length - 20), false), fill: 'none', stroke: '#2A2630', 'stroke-width': 1 }, lampsA);
  const halo = E('path', { d: dots(bulbs.map(([x, y]) => [x, y, 7])), fill: '#FFD68A', 'fill-opacity': .22 }, lampsA);
  const bulbG = [0, 1, 2].map(k => E('path', { d: dots(bulbs.filter((_, i) => i % 3 === k).map(([x, y]) => [x, y, 2.4])), fill: ['#FFF3C8', '#FFD27A', '#FFE9A8'][k] }, lampsA));
  const lookSil = (p, x, y, dir, k = 1, nest) => {
    const g = G(p); tf(g, x, y, 0, k * dir, k);
    E('circle', { cx: 10, cy: -12, r: 18, fill: rgrad([[0, '#FFD68A', .6], [1, '#FFD68A', 0]]) }, g);
    E('path', { d: 'M-7,0 L-8,-19 Q-8,-26 0,-27 Q8,-26 8,-19 L7,0 Z', fill: '#1B2238' }, g);
    E('path', { d: 'M-7.5,-20 Q-7.5,-26 0,-27', stroke: '#FFB870', 'stroke-width': 1.2, fill: 'none', 'stroke-opacity': .8 }, g);
    E('circle', { cx: 0, cy: -32, r: 6, fill: '#1B2238' }, g);
    E('path', { d: 'M-6,-33 Q0,-42 6,-33 Z', fill: '#3A3048' }, g);
    E('path', { d: 'M3,-33 L17,-35', stroke: '#2A2E3A', 'stroke-width': 3.6, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M3,-22 Q10,-24 9,-31', stroke: '#1B2238', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
    E('rect', { x: 8, y: -16, width: 4.5, height: 6.5, rx: 1.2, fill: '#FFE7A8' }, g);
    if (nest) { E('path', { d: 'M-11,-8 L11,-8 L10,6 L-10,6 Z', fill: '#2A2430' }, g); E('path', { d: 'M-11,-8 H11', stroke: '#8A6A44', 'stroke-width': 2 }, g); }
    return g;
  };
  lookSil(lampsA, 326, CS(326), 1); lookSil(lampsA, 304, CS(304), 1, .95); lookSil(lampsA, 262, -176, 1, .9, true);
  lookSil(lampsA, 170, CS(170) - 43, 1, .9); lookSil(lampsA, -326, CS(-326), -1, .95);
  const frontB = [[905, 706, 430, 330, 2], [1590, 712, 470, 300, 0], [2330, 716, 420, 320, 2]].map(([x, y, w, h, k]) => { const b = mkBerg(aMain, k, w, h, PAL_N, { reflect: .3, warm: '#FFD9A0' }); tf(b, x, y); b.bx = x; return b; });
  /* foreground floes (faster parallax) */
  [[300, 820, 170], [760, 868, 230], [1180, 805, 140], [1660, 860, 260], [2050, 812, 150], [2520, 872, 220], [2900, 830, 170]].forEach(([x, y, w], i) => {
    const g = G(aFG); tf(g, x, y);
    const P = []; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, r = .8 + hash(i * 7 + k) * .3; P.push([Math.cos(a) * w / 2 * r, Math.sin(a) * w * .12 * r]); }
    E('path', { d: poly(P.map(([x2, y2]) => [x2, y2 + 14])), fill: '#141B38' }, g);
    E('path', { d: poly(P), fill: '#3A4672' }, g);
    E('path', { d: `M${f2(-w * .3)},${f2(-w * .05)} Q0,${f2(-w * .09)} ${f2(w * .25)},${f2(-w * .05)}`, stroke: '#8E9CC8', 'stroke-width': 2.5, fill: 'none', 'stroke-opacity': .7, 'stroke-linecap': 'round' }, g);
  });
  const shipX = t => 640 + 175 * t, WV = x => Math.cos(Math.PI * (x - 905) / 342.5);
  const shipY = x => 612 - 27 * WV(x), shipSc = x => .84 - .1 * WV(x);
  const CAM_A = [[0, 700, 480, 1], [2.2, 1010, 490, 1.05], [3.6, 1265, 520, 1.25], [5.3, 1560, 505, 1.1], [7.8, 1990, 485, 1]];

  /* ====================================================================
     SHOT D — Carpathia's deck at a cold pink dawn
     ==================================================================== */
  const D = G(world);
  const HZD = 360, DX0 = 720;
  const dSky = G(D), dSea = G(D), dMain = G(D);
  const skyD = dawnSky(dSky, -500, 2900, -300, HZD, [430, HZD - 4]);
  const seaD = calmSea(dSea, -500, 3000, HZD, 700, { grad: [[0, '#F2C2A8'], [.1, '#C4A6BE'], [.35, '#8A8FB9'], [1, '#3E5088']], hi: '#FFE8D2', lo: '#33467C', rows: 6, amp: 7, sw: 2.6, op: .5, sp: 14, wavy: true, sunX: 430, glint: '#FFE2A6' });
  const floesD = IceFloes(dSea, { mood: 'dawn', y: HZD + 14, y1: 590, n: 7, x0: -400, w: 2600, seed: 5, berg: { x: 1560, y: HZD + 5, s: .26 } });
  const pax = (p, x, col, hat, s = 1, blanket) => { const g = G(p); tf(g, x, -4, 0, s);
    E('path', { d: 'M-15,0 L-17,-50 Q0,-60 17,-50 L15,0 Z', fill: col }, g);
    if (blanket) E('path', { d: 'M-19,-8 L-18,-52 Q0,-64 18,-52 L19,-8 Z', fill: blanket }, g);
    E('circle', { cx: 0, cy: -66, r: 13, fill: '#F1C9A5' }, g);
    if (hat === 1) { E('ellipse', { cx: 0, cy: -76, rx: 16, ry: 3.5, fill: '#2B2B30' }, g); E('path', { d: 'M-9,-76 Q-9,-90 0,-90 Q9,-90 9,-76 Z', fill: '#2B2B30' }, g); }
    else if (hat === 2) { E('ellipse', { cx: 0, cy: -77, rx: 20, ry: 4, fill: '#E9D6B0' }, g); E('ellipse', { cx: 0, cy: -81, rx: 10, ry: 6, fill: '#E9D6B0' }, g); }
    else E('path', { d: 'M-13,-68 Q-14,-82 0,-82 Q14,-82 13,-68 Q0,-74 -13,-68 Z', fill: hat === 3 ? '#8A5A3A' : '#4A3226' }, g);
    E('circle', { cx: -4.5, cy: -66, r: 1.8, fill: '#2A1E1A' }, g); E('circle', { cx: 4.5, cy: -66, r: 1.8, fill: '#2A1E1A' }, g);
    return g; };
  const PCOL = ['#5A3348', '#2E3A52', '#C9B48A', '#3E4A3C', '#6B2F36', '#7A6A55'], BCOL = ['#9A3A34', '#6E7A8A', '#B8863A', null];
  const lbFar = [[560, 468, .4, 9, true]].map(([x, y, s, n, fl], j) => { const lb = Lifeboat(dSea, { mood: 'dawn', num: n });
    for (let i = 0; i < 4; i++) pax(lb.crew, -100 + i * 64, PCOL[(i + j) % 6], (i + j) % 4, 1, BCOL[(i + j * 2) % 4]); lb.pos = [x, y, s, fl]; return lb; });
  /* alongside boat (just beyond the rail) */
  const lbNear = Lifeboat(dMain, { mood: 'dawn', num: 13 });
  [0, 1, 2, 3].forEach(i => pax(lbNear.crew, -110 + i * 66, PCOL[(i + 3) % 6], (i + 1) % 4, 1, BCOL[i % 4]));
  /* a survivor climbing the rope ladder (hidden by the deck edge until he clears it) */
  const climbG = G(dMain);
  const climber = castPassenger(climbG, 8, { lite: true, rim: DAWNRIM });
  const climbBl = E('path', { d: 'M-48,-238 Q0,-262 48,-238 L58,-120 Q0,-104 -58,-120 Z', fill: '#9A3A34' }, climber.torso);
  /* rail */
  const railG = G(dMain);
  { const posts = []; for (let x = -500; x <= 2400; x += 70) { if (x > 120 && x < 240) continue; posts.push(x); }
    chunkP(railG, posts.map(x => [x, `M${x},598 V690`]), { stroke: '#E4DCD2', 'stroke-width': 6 });
    chunkP(railG, posts.map(x => [x, `M${x + 2},598 V690`]), { stroke: '#B9A9A4', 'stroke-width': 2 });
    E('path', { d: 'M-500,628 H124 M240,628 H2400 M-500,658 H124 M240,658 H2400', stroke: '#EDE6DC', 'stroke-width': 4 }, railG);
    E('rect', { x: -500, y: 589, width: 624, height: 10, rx: 4, fill: '#A2714A' }, railG); E('rect', { x: 238, y: 589, width: 2200, height: 10, rx: 4, fill: '#A2714A' }, railG);
    E('path', { d: 'M-500,590.5 H124 M238,590.5 H2400', stroke: '#E6B58C', 'stroke-width': 2 }, railG);
    [[118, 0], [236, 0]].forEach(([x]) => { E('rect', { x: x - 6, y: 572, width: 12, height: 120, rx: 3, fill: '#E9E2D8' }, railG); E('circle', { cx: x, cy: 570, r: 8, fill: '#C9A050' }, railG); });
    /* rope ladder hooks over the edge */
    E('path', { d: 'M150,700 Q148,684 156,676 M206,700 Q208,684 200,676', stroke: '#CDB48A', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, railG);
    /* lifebuoy on the rail */
    const lb = G(railG); tf(lb, 40, 640);
    E('circle', { r: 34, fill: 'none', stroke: '#F3EEE4', 'stroke-width': 17 }, lb);
    E('circle', { r: 34, fill: 'none', stroke: '#D2452E', 'stroke-width': 17, 'stroke-dasharray': '26.7 26.7', transform: 'rotate(22)' }, lb);
    E('circle', { r: 34, fill: 'none', stroke: '#000', 'stroke-opacity': .12, 'stroke-width': 3, transform: 'translate(2,3)' }, lb);
    E('path', { d: 'M-30,-14 Q-34,0 -28,14', stroke: '#fff', 'stroke-width': 3, fill: 'none', 'stroke-opacity': .7 }, lb);
  }
  /* deck */
  const deckG = G(dMain);
  E('rect', { x: -500, y: 688, width: 2900, height: 420, fill: lgrad([[0, '#D2A894'], [.35, '#BC9484'], [1, '#9C7A68']]) }, deckG);
  { const k = (1100 - HZD) / (692 - HZD), seams = []; for (let x = -900; x <= 2500; x += 80) { const xb = 800 + (x - 800) * k, n = 4; for (let j = 0; j < n; j++) { const a = j / n, b = (j + 1) / n; seams.push([lerp(x, xb, (a + b) / 2), `M${f2(lerp(x, xb, a))},${f2(lerp(692, 1100, a))} L${f2(lerp(x, xb, b))},${f2(lerp(692, 1100, b))}`]); } }
    chunkP(deckG, seams, { stroke: '#7E5E50', 'stroke-width': 1.4, 'stroke-opacity': .45 }, 360);
    /* long dawn shadows of the rail posts, falling toward us */
    const sh = []; for (let x = -500; x <= 2400; x += 140) { if (x > 120 && x < 240) continue; const dx = x - 430, dy = 690 - (HZD - 4), L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, len = 230;
      sh.push([x, `M${x - 3},692 L${f2(x - 3 + ux * len - 7)},${f2(692 + uy * len)} L${f2(x + 3 + ux * len + 7)},${f2(692 + uy * len)} L${x + 3},692 Z`]); }
    chunkP(deckG, sh, { fill: '#5A3A44', 'fill-opacity': .13 }, 300);
    E('rect', { x: -500, y: 682, width: 2900, height: 16, fill: '#E9E1D6' }, deckG);
    E('rect', { x: -500, y: 696, width: 2900, height: 5, fill: '#7E5E50', 'fill-opacity': .35 }, deckG);
  }
  /* cocoa table */
  const tableG = G(dMain);
  { E('ellipse', { cx: 790, cy: 738, rx: 110, ry: 9, fill: '#000', 'fill-opacity': .18 }, tableG);
    E('path', { d: 'M712,662 L700,736 M868,662 L880,736 M730,662 L742,736 M850,662 L838,736', stroke: '#6E4630', 'stroke-width': 6, 'stroke-linecap': 'round' }, tableG);
    E('rect', { x: 696, y: 648, width: 190, height: 16, rx: 3, fill: '#9A6A44' }, tableG); E('rect', { x: 696, y: 648, width: 190, height: 4, rx: 2, fill: '#C48B60' }, tableG);
    /* urn */
    E('rect', { x: 718, y: 574, width: 52, height: 76, rx: 8, fill: '#C9973E' }, tableG);
    E('rect', { x: 724, y: 578, width: 10, height: 66, rx: 4, fill: '#F0CF7A', 'fill-opacity': .6 }, tableG);
    E('path', { d: 'M714,576 Q744,556 774,576 Z', fill: '#B7832E' }, tableG); E('circle', { cx: 744, cy: 562, r: 5, fill: '#8A5E1E' }, tableG);
    E('path', { d: 'M770,630 h10 v8', stroke: '#8A5E1E', 'stroke-width': 4, fill: 'none' }, tableG);
    E('rect', { x: 700, y: 600, width: 86, height: 26, rx: 4, fill: '#FBF3E2', stroke: '#8A5E1E', 'stroke-width': 1.5 }, tableG);
    TX(tableG, 743, 620, 'COCOA', 20, '#6A3A1A', { a: 'middle', w: 800 });
    /* mugs + blanket stack */
    [790, 808, 826].forEach((x, i) => { E('rect', { x, y: 632, width: 14, height: 17, rx: 3, fill: '#FBFBF7', stroke: '#9AA6BC', 'stroke-width': 1 }, tableG); E('rect', { x, y: 632, width: 14, height: 3, fill: '#3E62A8' }, tableG); });
    [['#9A3A34', 0], ['#6E7A8A', 1], ['#3E5A7A', 2], ['#B8863A', 3]].forEach(([c, i]) => { E('rect', { x: 842 - i, y: 636 - i * 13, width: 44, height: 12, rx: 3, fill: c }, tableG); E('path', { d: `M${846 - i},${642 - i * 13} h36`, stroke: '#FFF3DA', 'stroke-opacity': .35, 'stroke-width': 2 }, tableG); });
  }
  const urnSteam = [0, 1, 2].map(i => E('path', { d: 'M0,0 q-6,-10 0,-20 q6,-10 0,-20', stroke: '#FFFFFF', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, tableG));
  /* chain of stewards */
  const STW = [300, 412, 524, 636], STY = 738, STS = .62;
  const stew = STW.map((x, i) => Person(dMain, { coat: 'suit', jacket: '#F2EEE4', shirt: '#FFFFFF', tie: '#2A2A33', pants: '#2B2D3A', hairStyle: ['parted', 'side', 'bald', 'kid'][i], hair: ['#3A2A20', '#7A4A2A', '#5A4A3A', '#2A1E18'][i], skin: ['#F1C49C', '#E8B48C', '#F4CFAA', '#C48A60'][i], mustache: i === 2, lite: true, seed: 301 + i * 7, rim: DAWNRIM }));
  const sailor = castLookout(dMain, 1, { lite: true, rim: DAWNRIM });
  /* chain items: a folded blanket or a steaming mug, one per steward */
  const mkBundle = (p, c) => { const g = G(p); E('rect', { x: -25, y: -15, width: 50, height: 28, rx: 5, fill: c }, g); E('path', { d: 'M-25,-3 H25 M-8,-15 V13 M10,-15 V13', stroke: '#FFF3DA', 'stroke-opacity': .35, 'stroke-width': 2.4 }, g); E('path', { d: 'M-25,-9 H25', stroke: '#000', 'stroke-opacity': .15, 'stroke-width': 2 }, g); return g; };
  const mkMug = p => { const g = G(p); E('path', { d: 'M8,-12 q10,0 10,8 q0,8 -10,8', stroke: '#E9EEF6', 'stroke-width': 4, fill: 'none' }, g); E('rect', { x: -10, y: -16, width: 20, height: 24, rx: 4, fill: '#FBFBF7', stroke: '#9AA6BC', 'stroke-width': 1.2 }, g); E('rect', { x: -10, y: -16, width: 20, height: 4, fill: '#3E62A8' }, g); E('ellipse', { cx: 0, cy: -15, rx: 8, ry: 2, fill: '#6A3A1E' }, g);
    const st = E('path', { d: 'M-3,-20 q-5,-8 0,-16 q5,-8 0,-16', stroke: '#fff', 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round' }, g); g.st = st; return g; };
  const items = STW.map((_, i) => ({ b: mkBundle(dMain, ['#9A3A34', '#3E5A7A', '#B8863A', '#6E7A8A'][i]), m: mkMug(dMain) }));
  /* main group */
  const look = castLookout(dMain, 0, { rim: DAWNRIM });
  const mother = castPassenger(dMain, 5, { rim: DAWNRIM });
  const lady = castPoshLady(dMain, { rim: DAWNRIM });
  const rcap = castRescueCaptain(dMain, { rim: DAWNRIM });
  const boy = castPassenger(dMain, 6, { rim: DAWNRIM });
  const girl = castPassenger(dMain, 7, { rim: DAWNRIM });
  /* the one big blanket */
  const blanketG = G(dMain);
  const blClipP = E('path', { d: 'M0,0' }, E('clipPath', { id: uid('blc') }, DEFS));
  const blBase = E('path', { fill: '#A8433A' }, blanketG);
  const blPat = G(blanketG, { 'clip-path': `url(#${blClipP.parentNode.id})` }); const blPatIn = G(blPat);
  { let a = '', b = ''; for (let i = -9; i <= 9; i++) { a += `M${i * 36},-240 V240 M-340,${i * 36} H340 `; b += `M${i * 36 + 11},-240 V240 M-340,${i * 36 + 11} H340 `; }
    E('path', { d: a, stroke: '#6E2A2C', 'stroke-width': 8 }, blPatIn); E('path', { d: b, stroke: '#E9C08E', 'stroke-width': 2 }, blPatIn); }
  const blShade = E('path', { fill: '#3A1010', 'fill-opacity': .18 }, blanketG);
  const blEdge = E('path', { fill: 'none', stroke: '#6E2420', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, blanketG);
  const mitzi = Dog(dMain, {}); const mCap = gagCap(mitzi.head); mCap.set({});
  const lick = E('path', { d: 'M16,9 Q32,2 46,8 Q54,16 44,22 Q30,24 16,16 Z', fill: '#F26B7A', stroke: '#C94A5A', 'stroke-width': 1.5 }, mitzi.head);
  /* the binoculars: front view (presented / hugged) and profile (raised) */
  const binoc = G(dMain); const bFront = G(binoc), bSide = G(binoc);
  { [-30, 30].forEach(x => { E('circle', { cx: x, cy: 0, r: 30, fill: '#23252E' }, bFront); E('circle', { cx: x, cy: 0, r: 30, fill: 'none', stroke: '#C9A050', 'stroke-width': 4 }, bFront);
      E('circle', { cx: x, cy: 0, r: 19, fill: rgrad([[0, '#9FD0F0'], [.7, '#3E6A9A'], [1, '#1E2E4A']]) }, bFront); E('ellipse', { cx: x - 7, cy: -7, rx: 6, ry: 4, fill: '#fff', 'fill-opacity': .75 }, bFront); });
    E('rect', { x: -10, y: -8, width: 20, height: 16, rx: 4, fill: '#C9A050' }, bFront);
    E('path', { d: 'M0,-30 C-30,-62 -52,-34 -4,-28 Z M0,-30 C30,-62 52,-34 4,-28 Z', fill: '#E0303A' }, bFront);
    E('path', { d: 'M-2,-28 L-16,8 M2,-28 L16,8', stroke: '#E0303A', 'stroke-width': 7, 'stroke-linecap': 'round' }, bFront);
    E('circle', { cx: 0, cy: -30, r: 7, fill: '#B81E2A' }, bFront);
    E('path', { d: 'M-46,-12 L-14,-16 L-14,16 L-46,12 Z', fill: '#23252E' }, bSide); E('rect', { x: -14, y: -22, width: 62, height: 44, rx: 10, fill: '#2B2E38' }, bSide);
    E('rect', { x: 44, y: -26, width: 16, height: 52, rx: 5, fill: '#C9A050' }, bSide); E('rect', { x: -56, y: -10, width: 12, height: 20, rx: 4, fill: '#C9A050' }, bSide);
    E('path', { d: 'M10,-22 C-10,-52 -30,-30 6,-24 Z M10,-22 C30,-52 50,-30 14,-24 Z', fill: '#E0303A' }, bSide); E('circle', { cx: 10, cy: -23, r: 6, fill: '#B81E2A' }, bSide); }
  const sparkG = G(dMain); const sparks = [0, 1, 2, 3, 4, 5].map(i => E('path', { d: 'M0,-9 L2,-2 L9,0 L2,2 L0,9 L-2,2 L-9,0 L-2,-2 Z', fill: '#FFF2B0' }, sparkG));
  const hearts = [0, 1, 2, 3].map(() => { const g = G(dMain); E('path', { d: 'M0,7 C-12,-2 -9,-14 0,-8 C9,-14 12,-2 0,7 Z', fill: '#FF6F8E' }, g); return g; });
  /* breath puffs (cold air) */
  const puffs = [0, 1, 2, 3].map(() => E('ellipse', { rx: 9, ry: 6, fill: '#FFFFFF' }, dMain));
  /* blanket shapes (held by the captain → draped round lady, boy, mother, girl) */
  const BL_D = [[1262, 696], [1288, 634], [1333, 628], [1368, 652], [1380, 744], [1416, 748], [1452, 646], [1500, 632], [1545, 646], [1556, 756], [1592, 758], [1622, 774], [1636, 862], [1450, 878], [1262, 866], [1250, 772]];
  const BL_H = []; for (let i = 0; i < 12; i++) BL_H.push([lerp(1100, 1282, i / 11), 593 + 10 * Math.sin(Math.PI * i / 11)]);
  BL_H.push([1292, 802], [1190, 814], [1090, 802], [1084, 700]);
  const CAM_D = [[T_DAWN, 720, 456, .93], [LT(1) - .5, 770, 462, .95], [LT(1) + .3, 1385, 575, 1.42], [LT(2) - .21, 1400, 575, 1.43], [LT(2) - .2, 1125, 548, 1.7], [LT(3) + .3, 1112, 540, 1.82]];

  /* ====================================================================
     SHOT P — binocular POV: the Iceberg's tip ducks
     ==================================================================== */
  const PV = G(world); const pvIn = G(PV);
  E('rect', { x: -200, y: -200, width: 2000, height: 730, fill: lgrad([[0, '#6E6EA6'], [.5, '#D99AAE'], [.85, '#F8C29E'], [1, '#FFD9A8']]) }, pvIn);
  E('circle', { cx: 1250, cy: 500, r: 420, fill: rgrad([[0, '#FFF0C8', .55], [.4, '#FFD0A0', .18], [1, '#FFC090', 0]]) }, pvIn);
  E('path', { d: 'M-200,512 L180,512 L230,470 L265,492 L300,455 L345,500 L420,512 Z', fill: '#E8E0F0', opacity: .55 }, pvIn);
  const pvBerg = Iceberg(pvIn, { foam: false });
  const pvSea = G(pvIn);
  E('rect', { x: -200, y: 520, width: 2000, height: 600, fill: lgrad([[0, '#B49CC4'], [.25, '#7E86B8'], [1, '#3E4E86']]) }, pvSea);
  E('rect', { x: -200, y: 518, width: 2000, height: 5, fill: '#FFE7D0', 'fill-opacity': .6 }, pvSea);
  const pvSw = [0, 1, 2, 3, 4, 5].map(i => E('path', { d: (() => { let d = ''; const y = 560 + i * i * 22, P = 120 + i * 60; for (let x = -400; x < 2000; x += P) d += `M${x},${y} q${P / 4},-${4 + i * 2} ${P / 2},0 `; return d; })(), stroke: '#E6D4EE', 'stroke-width': 2 + i * .6, fill: 'none', 'stroke-opacity': .45 }, pvSea));
  const pvRip = [0, 1, 2].map(() => E('ellipse', { cx: 820, cy: 524, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, pvIn));
  const pvBub = [0, 1, 2, 3, 4, 5, 6].map(i => E('circle', { r: 6 + (i % 3) * 4, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, pvIn));
  const glugG = G(pvIn); { const t = TX(glugG, 0, 0, 'glug!', 84, '#FFFFFF', { a: 'middle', w: 800, hand: true }); t.setAttribute('stroke', '#2E3A6A'); t.setAttribute('stroke-width', 8); t.setAttribute('paint-order', 'stroke'); }
  E('rect', { x: -200, y: -200, width: 2000, height: 1300, fill: rgrad([[0, '#BFE0FF', 0], [.7, '#1A2A4A', .12], [1, '#0A1020', .45]]) }, pvIn);
  /* binocular mask: two overlapping circles cut out of black (union outline + evenodd) */
  const pvMask = G(PV);
  { const r = 380, c1 = 560, c2 = 1040, cy = 450, hx = (c1 + c2) / 2, hy = Math.sqrt(r * r - Math.pow((c2 - c1) / 2, 2));
    const fig = `M${hx},${f2(cy - hy)} A${r},${r} 0 1,0 ${hx},${f2(cy + hy)} A${r},${r} 0 1,0 ${hx},${f2(cy - hy)} Z`;
    E('path', { d: 'M-400,-400 H2000 V1300 H-400 Z ' + fig, fill: '#05060A', 'fill-rule': 'evenodd' }, pvMask);
    E('path', { d: fig, fill: 'none', stroke: '#2A2E3E', 'stroke-width': 14 }, pvMask);
    E('path', { d: fig, fill: 'none', stroke: '#8A90A8', 'stroke-width': 3, 'stroke-opacity': .5 }, pvMask); }

  /* ====================================================================
     SHOT R — the wood-panelled committee room (+ the rulebook)
     ==================================================================== */
  const RM = G(world); const camC = G(RM);
  const WOOD = '#5E3A24', WOOD2 = '#6E4630', WOODHI = '#8C5A3A', WOODLO = '#3E2416';
  /* back wall: panels */
  E('rect', { x: -400, y: -300, width: 2600, height: 1100, fill: lgrad([[0, '#3E2618'], [.4, WOOD], [1, '#4A2C1A']]) }, camC);
  { let pan = '', hi = '', lo = ''; for (let x = -380; x < 2200; x += 190) { [[-60, 300], [330, 130]].forEach(([y, h]) => { pan += `M${x + 14},${y} h162 v${h} h-162 Z `; hi += `M${x + 14},${y + h} V${y} H${x + 176} `; lo += `M${x + 176},${y} V${y + h} H${x + 14} `; }); }
    E('path', { d: pan, fill: WOOD2 }, camC); E('path', { d: hi, stroke: WOODLO, 'stroke-width': 4, fill: 'none' }, camC); E('path', { d: lo, stroke: WOODHI, 'stroke-width': 3, fill: 'none' }, camC); }
  E('rect', { x: -400, y: 252, width: 2600, height: 22, fill: '#4A2C1A' }, camC); E('rect', { x: -400, y: 252, width: 2600, height: 5, fill: WOODHI }, camC);
  E('rect', { x: -400, y: -86, width: 2600, height: 18, fill: '#4A2C1A' }, camC);
  /* window with a London morning */
  const winG = G(camC);
  { const x = 1215, y = 40, w = 190, h = 380;
    E('rect', { x: x - 12, y: y - 12, width: w + 24, height: h + 24, rx: 8, fill: '#3E2416' }, winG);
    E('rect', { x, y, width: w, height: h, fill: lgrad([[0, '#B9C6D6'], [.6, '#E7E0D6'], [1, '#F2D9C4']]) }, winG);
    E('path', { d: `M${x},${y + 300} L${x + 20},${y + 290} L${x + 34},${y + 296} L${x + 50},${y + 270} L${x + 74},${y + 276} L${x + 92},${y + 262} L${x + 126},${y + 280} L${x + 160},${y + 268} L${x + w},${y + 284} V${y + h} H${x} Z`, fill: '#A8A4B4' }, winG);
    /* the clock tower */
    const tw = G(winG); tf(tw, x + 128, y + 300);
    E('path', { d: 'M-16,0 V-150 L-20,-156 V-176 L0,-226 L20,-176 V-156 L16,-150 V0 Z', fill: '#8E8AA0' }, tw);
    E('circle', { cx: 0, cy: -164, r: 9, fill: '#E7E0D6' }, tw); E('path', { d: 'M0,-164 V-170 M0,-164 h5', stroke: '#6A6680', 'stroke-width': 1.6 }, tw);
    E('path', { d: 'M-16,-60 V-120 M-6,-60 V-120 M6,-60 V-120', stroke: '#7E7A92', 'stroke-width': 2 }, tw);
    E('rect', { x, y: y + 300, width: w, height: 80, fill: '#C9C2C8', 'fill-opacity': .5 }, winG);
    E('path', { d: `M${x + w / 2},${y} V${y + h} M${x},${y + 127} H${x + w} M${x},${y + 254} H${x + w}`, stroke: '#3E2416', 'stroke-width': 8 }, winG);
    E('path', { d: `M${x + w / 4},${y} V${y + h} M${x + w * .75},${y} V${y + h}`, stroke: '#3E2416', 'stroke-width': 3 }, winG);
    [x - 34, x + w + 4].forEach((cx, i) => { E('path', { d: `M${cx},${y - 30} h40 q${i ? 10 : -10},200 ${i ? -6 : 6},420 h-34 q${i ? -8 : 8},-210 ${i ? 0 : 0},-420 Z`, fill: '#2E4A36' }, winG);
      E('path', { d: `M${cx + 12},${y - 20} q${i ? 4 : -4},200 0,410 M${cx + 24},${y - 20} q${i ? 6 : -6},200 0,410`, stroke: '#1E3426', 'stroke-width': 3, fill: 'none' }, winG); });
    E('rect', { x: x - 44, y: y - 40, width: w + 88, height: 18, rx: 4, fill: '#C9A050' }, winG);
  }
  /* light shaft + dust motes */
  E('path', { d: 'M1215,60 L1405,60 L1180,760 L760,760 Z', fill: lgrad([[0, '#FFF2DA', .16], [1, '#FFF2DA', 0]]) }, camC);
  const motes = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => E('circle', { r: 1.6 + hash(i) * 1.6, fill: '#FFF6E2', 'fill-opacity': .7 }, camC));
  /* portraits: lighthouse and a ship */
  [[640, 'light'], [960, 'ship']].forEach(([cx, k]) => { const g = G(camC); tf(g, cx, 175, 0, .82);
    E('rect', { x: -72, y: -92, width: 144, height: 176, rx: 4, fill: '#C9A050' }, g); E('rect', { x: -62, y: -82, width: 124, height: 156, fill: '#2E3E5A' }, g);
    E('rect', { x: -62, y: 10, width: 124, height: 64, fill: '#3E5E7A' }, g);
    if (k === 'light') { E('path', { d: 'M-12,40 L-8,-40 L8,-40 L12,40 Z', fill: '#F2EDE2' }, g); E('path', { d: 'M-10,0 h20 M-11,20 h22', stroke: '#C8302A', 'stroke-width': 7 }, g); E('rect', { x: -9, y: -54, width: 18, height: 14, fill: '#FFE7A0' }, g); E('path', { d: 'M8,-48 L62,-70 L62,-26 Z', fill: '#FFE7A0', 'fill-opacity': .35 }, g); E('path', { d: 'M-62,40 Q0,30 62,42 V74 H-62 Z', fill: '#4A3A30' }, g); }
    else { E('path', { d: 'M-46,22 L40,22 L30,40 L-40,40 Z', fill: '#1E1E24' }, g); E('path', { d: 'M-30,22 V-30 M0,22 V-44 M28,22 V-28', stroke: '#E9E2D2', 'stroke-width': 3 }, g); E('path', { d: 'M-28,-26 L-4,-8 L-28,10 Z M2,-40 L26,-16 L2,8 Z', fill: '#EFE6D2' }, g); E('path', { d: 'M-62,46 q30,-8 62,0 t62,0', stroke: '#9FC0D8', 'stroke-width': 3, fill: 'none' }, g); }
    E('rect', { x: -62, y: -82, width: 124, height: 156, fill: lgrad([[0, '#FFF', .12], [1, '#000', .2]]) }, g); });
  /* the blackboard sum from the boat deck */
  const bbG = G(camC); tf(bbG, 395, 300);
  E('rect', { x: -150, y: -102, width: 300, height: 196, rx: 6, fill: '#6E4630' }, bbG);
  E('rect', { x: -138, y: -90, width: 276, height: 172, fill: '#2E3B33' }, bbG);
  E('rect', { x: -138, y: -90, width: 276, height: 172, fill: lgrad([[0, '#FFFFFF', .06], [1, '#000', .1]]) }, bbG);
  E('path', { d: 'M-120,-60 q30,-6 60,2 M60,48 q20,4 50,-2', stroke: '#E8EDE6', 'stroke-opacity': .18, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, bbG);
  E('rect', { x: -150, y: 90, width: 300, height: 10, rx: 3, fill: '#8C5A3A' }, bbG);
  TX(bbG, -78, 12, 'SEATS', 30, '#F2F0E6', { a: 'middle', w: 700, hand: true });
  TX(bbG, 74, 12, 'PEOPLE', 30, '#F2F0E6', { a: 'middle', w: 700, hand: true });
  const bbLt = TX(bbG, -4, 15, '<', 44, '#FF8A80', { a: 'middle', w: 800, hand: true });
  const bbEq = TX(bbG, -4, 15, '=', 46, '#9BF0A8', { a: 'middle', w: 800, hand: true });
  const bbTick = E('path', { d: 'M-30,46 l14,14 l30,-30', stroke: '#9BF0A8', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, bbG);
  const bbOld = E('path', { d: 'M-130,-56 L130,-56', stroke: '#F2F0E6', 'stroke-width': 0 }, bbG);
  const bell = G(bbG); tf(bell, 112, 88);
  E('path', { d: 'M-16,0 Q-16,-22 0,-22 Q16,-22 16,0 Z', fill: '#E3B341' }, bell); E('rect', { x: -20, y: -2, width: 40, height: 5, rx: 2, fill: '#B7862A' }, bell); E('circle', { cx: 0, cy: -25, r: 3.5, fill: '#B7862A' }, bell);
  const dingG = G(bbG); tf(dingG, 112, 50);
  E('path', { d: 'M-34,-14 l-14,-8 M34,-14 l14,-8 M-30,6 l-16,2 M30,6 l16,2 M0,-30 v-14', stroke: '#FFE27A', 'stroke-width': 4, 'stroke-linecap': 'round' }, dingG);
  { const t = TX(dingG, 0, -52, 'DING!', 30, '#FFE27A', { a: 'middle', w: 800 }); t.setAttribute('stroke', '#3E2416'); t.setAttribute('stroke-width', 6); t.setAttribute('paint-order', 'stroke'); }
  /* the wall clock (whizzes round during "around the clock") */
  const clockG = G(camC); tf(clockG, 800, 150);
  E('rect', { x: -46, y: 50, width: 92, height: 120, rx: 8, fill: '#4A2C1A' }, clockG); E('rect', { x: -34, y: 60, width: 68, height: 98, rx: 4, fill: '#2A1A10' }, clockG);
  const pend = G(clockG); tf(pend, 0, 54); E('path', { d: 'M0,0 V74', stroke: '#C9A050', 'stroke-width': 3 }, pend); E('circle', { cx: 0, cy: 80, r: 12, fill: '#E3B341' }, pend);
  E('circle', { r: 64, fill: '#6E4630' }, clockG); E('circle', { r: 56, fill: '#F6EEDC', stroke: '#C9A050', 'stroke-width': 5 }, clockG);
  { let tk = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; tk += `M${f2(Math.sin(a) * 44)},${f2(-Math.cos(a) * 44)} L${f2(Math.sin(a) * (i % 3 ? 49 : 52))},${f2(-Math.cos(a) * (i % 3 ? 49 : 52))} `; } E('path', { d: tk, stroke: '#3A2A20', 'stroke-width': 3 }, clockG); }
  const hHand = E('path', { d: 'M0,4 V-28', stroke: '#2A1E18', 'stroke-width': 6, 'stroke-linecap': 'round' }, clockG);
  const mHand = E('path', { d: 'M0,6 V-42', stroke: '#2A1E18', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, clockG);
  E('circle', { r: 5, fill: '#C9A050' }, clockG);
  const clockLines = G(clockG); E('path', { d: 'M-78,-30 l-16,-6 M-80,0 h-18 M-78,30 l-16,6 M78,-30 l16,-6 M80,0 h18 M78,30 l16,6', stroke: '#FFE7A8', 'stroke-width': 4, 'stroke-linecap': 'round' }, clockLines);
  /* chandeliers */
  const chand = [450, 1150].map(x => { const g = G(camC); tf(g, x, -86);
    E('circle', { cx: 0, cy: 96, r: 150, fill: rgrad([[0, '#FFD89A', .3], [1, '#FFD89A', 0]]) }, g);
    E('path', { d: 'M0,0 V70', stroke: '#C9A050', 'stroke-width': 3 }, g); E('path', { d: 'M-56,92 Q0,124 56,92', stroke: '#C9A050', 'stroke-width': 5, fill: 'none' }, g);
    [-56, -20, 20, 56].forEach(dx => { E('path', { d: `M${dx},${92 + (Math.abs(dx) < 30 ? 14 : 0)} v-14`, stroke: '#C9A050', 'stroke-width': 3 }, g); E('ellipse', { cx: dx, cy: 74 + (Math.abs(dx) < 30 ? 14 : 0), rx: 6, ry: 9, fill: '#FFF0C0' }, g); });
    E('circle', { cx: 0, cy: 100, r: 9, fill: '#C9A050' }, g); return g; });
  /* the wireless corner (right) */
  const wcG = G(camC);
  { const rb = G(wcG); tf(rb, 1620, 330);
    E('rect', { x: -132, y: -118, width: 264, height: 236, rx: 6, fill: '#E9DFC8', stroke: '#8C5A3A', 'stroke-width': 8 }, rb);
    TX(rb, 0, -80, 'RADIO ROTA', 22, '#3A2A20', { a: 'middle', w: 800, ls: 2 });
    TX(rb, 0, -40, 'DAY AND NIGHT', 30, '#B3261E', { a: 'middle', w: 800 });
    const sun = G(rb); tf(sun, -78, 22); E('circle', { r: 16, fill: '#F2B33D' }, sun); E('path', { d: 'M0,-26 v6 M0,20 v6 M-26,0 h6 M20,0 h6 M-18,-18 l4,4 M14,14 l4,4 M18,-18 l-4,4 M-14,14 l-4,4', stroke: '#F2B33D', 'stroke-width': 3, 'stroke-linecap': 'round' }, sun);
    const moon = G(rb); tf(moon, 78, 22); E('path', { d: 'M0,-18 A18,18 0 1,0 0,18 A11,18 0 1,1 0,-18 Z', fill: '#4A5A8A' }, moon);
    let gr = ''; for (let i = 0; i < 4; i++) gr += `M-110,${48 + i * 16} H110 `; for (let j = 0; j <= 6; j++) gr += `M${-110 + j * 36.6},48 V96 `;
    E('path', { d: gr, stroke: '#8A7A64', 'stroke-width': 1.4, fill: 'none' }, rb);
    let tk = ''; for (let i = 0; i < 3; i++) for (let j = 0; j < 6; j++) tk += `M${f2(-104 + j * 36.6)},${58 + i * 16} l5,5 l10,-10 `; E('path', { d: tk, stroke: '#2E7A4A', 'stroke-width': 2.4, fill: 'none' }, rb);
  }
  /* delegates (seated behind the table) */
  const DEL = [
    [250, 660, .64, { coat: 'suit', jacket: '#3A3F52', hairStyle: 'bald', hair: '#9A8E80', mustache: 'handlebar', mustacheColor: '#D9D5CC', glasses: true, skin: '#F0C49E', tie: '#7A2E2E', old: true }],
    [395, 664, .66, { coat: 'tailcoat', hairStyle: 'parted', hair: '#2A1E18', beard: 'full', beardColor: '#3A2A20', skin: '#EBC09A' }],
    [1205, 664, .66, { coat: 'suit', jacket: '#4A4038', hairStyle: 'side', hair: '#C9C5BE', mustache: 'walrus', mustacheColor: '#D9D5CC', skin: '#F2C8A4', old: true, tie: '#2E4E7A' }],
    [1350, 660, .64, { coat: 'suit', jacket: '#2E3A4E', hairStyle: 'curly', hair: '#5A3A26', skin: '#C48A60', glasses: true, tie: '#6A4A1E' }]
  ];
  const dels = DEL.map(([x, y, s, o], i) => { const P = Person(camC, Object.assign({ seed: 401 + i * 13 }, o)); P.pos = [x, y, s]; return P; });
  /* table */
  const tblG = G(camC);
  E('path', { d: 'M150,566 L1450,566 L1560,704 L40,704 Z', fill: lgrad([[0, '#2E5A3E'], [1, '#24493A']]) }, tblG);
  E('path', { d: 'M150,566 L1450,566 L1454,572 L146,572 Z', fill: '#4A2C1A' }, tblG);
  E('path', { d: 'M40,704 L1560,704 L1560,770 L40,770 Z', fill: '#6E4630' }, tblG);
  E('path', { d: 'M40,704 L1560,704 L1560,712 L40,712 Z', fill: '#9A6A44' }, tblG);
  { let p = ''; for (let x = 80; x < 1540; x += 180) p += `M${x},722 h150 v38 h-150 Z `; E('path', { d: p, fill: 'none', stroke: '#4A2C1A', 'stroke-width': 3 }, tblG); }
  E('rect', { x: -400, y: 770, width: 2600, height: 400, fill: lgrad([[0, '#5A2E24'], [1, '#3A1C16']]) }, tblG);
  E('path', { d: 'M-400,800 H2200 M-400,850 H2200', stroke: '#C9A050', 'stroke-opacity': .25, 'stroke-width': 3 }, tblG);
  /* banker's lamps + papers on the table */
  [[300, 600], [1300, 600]].forEach(([x, y]) => { const g = G(tblG); tf(g, x, y);
    E('circle', { cx: 0, cy: 10, r: 90, fill: rgrad([[0, '#FFE7A0', .35], [1, '#FFE7A0', 0]]) }, g);
    E('rect', { x: -3, y: -40, width: 6, height: 46, fill: '#C9A050' }, g); E('ellipse', { cx: 0, cy: 8, rx: 22, ry: 6, fill: '#C9A050' }, g);
    E('path', { d: 'M-40,-40 Q0,-62 40,-40 L36,-30 L-36,-30 Z', fill: '#1E6A44' }, g); E('rect', { x: -36, y: -31, width: 72, height: 4, fill: '#FFF0B0' }, g); });
  [[470, 640, -8], [560, 668, 6], [1080, 648, -4], [1170, 676, 10]].forEach(([x, y, r]) => { const g = G(tblG); tf(g, x, y, r); E('rect', { x: -34, y: -22, width: 68, height: 44, fill: '#F6F0E2' }, g); E('path', { d: 'M-26,-12 h46 M-26,-2 h50 M-26,8 h36', stroke: '#9A9080', 'stroke-width': 2 }, g); });
  /* desk flags (1914 designs, simplified) */
  const mkFlag = (p, kind) => { const g = G(p); const W = 46, H = 30; const r = (x, y, w, h, c) => E('rect', { x, y, width: w, height: h, fill: c }, g);
    if (kind === 'uk') { r(0, 0, W, H, '#1F3A7A'); E('path', { d: `M0,0 L${W},${H} M${W},0 L0,${H}`, stroke: '#fff', 'stroke-width': 6 }, g); E('path', { d: `M0,0 L${W},${H} M${W},0 L0,${H}`, stroke: '#C8302A', 'stroke-width': 2 }, g); E('path', { d: `M${W / 2},0 V${H} M0,${H / 2} H${W}`, stroke: '#fff', 'stroke-width': 9 }, g); E('path', { d: `M${W / 2},0 V${H} M0,${H / 2} H${W}`, stroke: '#C8302A', 'stroke-width': 5 }, g); }
    else if (kind === 'fr') { r(0, 0, W / 3, H, '#1F4FA0'); r(W / 3, 0, W / 3, H, '#FFFFFF'); r(2 * W / 3, 0, W / 3, H, '#D23A35'); }
    else if (kind === 'us') { for (let i = 0; i < 7; i++) r(0, i * H / 7, W, H / 7, i % 2 ? '#FFFFFF' : '#C8302A'); r(0, 0, W * .45, H * .57, '#1F3A7A'); E('path', { d: dots([[5, 4, 1.2], [11, 4, 1.2], [17, 4, 1.2], [8, 9, 1.2], [14, 9, 1.2], [5, 14, 1.2], [11, 14, 1.2], [17, 14, 1.2]]), fill: '#fff' }, g); }
    else if (kind === 'de') { r(0, 0, W, H / 3, '#1A1A1A'); r(0, H / 3, W, H / 3, '#FFFFFF'); r(0, 2 * H / 3, W, H / 3, '#D23A35'); }
    else if (kind === 'nl') { r(0, 0, W, H / 3, '#C8302A'); r(0, H / 3, W, H / 3, '#FFFFFF'); r(0, 2 * H / 3, W, H / 3, '#1F3A8A'); }
    else if (kind === 'no') { r(0, 0, W, H, '#C8302A'); E('path', { d: `M16,0 V${H} M0,${H / 2} H${W}`, stroke: '#fff', 'stroke-width': 8 }, g); E('path', { d: `M16,0 V${H} M0,${H / 2} H${W}`, stroke: '#1F3A7A', 'stroke-width': 4 }, g); }
    E('rect', { x: 0, y: 0, width: W, height: H, fill: lgrad([[0, '#fff', .18], [.5, '#000', 0], [1, '#000', .18]], 0, 0, 1, 0) }, g);
    return g; };
  const flags = [[190, 'nl'], [330, 'uk'], [470, 'fr'], [1130, 'us'], [1270, 'de'], [1420, 'no']].map(([x, k], i) => { const g = G(tblG); tf(g, x, 628);
    E('ellipse', { cx: 0, cy: 0, rx: 12, ry: 4, fill: '#C9A050' }, g); E('path', { d: 'M0,0 V-84', stroke: '#C9A050', 'stroke-width': 3 }, g); E('circle', { cx: 0, cy: -86, r: 3.5, fill: '#E3B341' }, g);
    const f = mkFlag(g, k); f.ph = i * 1.3; return f; });
  /* the wireless desk + LATER tray */
  const wop = castWireless(camC);
  const wdG = G(camC);
  { E('rect', { x: 1590, y: 650, width: 220, height: 14, rx: 3, fill: '#9A6A44' }, wdG); E('rect', { x: 1600, y: 664, width: 200, height: 120, fill: '#6E4630' }, wdG);
    E('rect', { x: 1690, y: 576, width: 104, height: 74, rx: 6, fill: '#4A3A2A' }, wdG); E('circle', { cx: 1716, cy: 612, r: 12, fill: '#2A2420', stroke: '#C9A050', 'stroke-width': 3 }, wdG); E('circle', { cx: 1752, cy: 612, r: 9, fill: '#2A2420', stroke: '#C9A050', 'stroke-width': 3 }, wdG);
    E('rect', { x: 1774, y: 592, width: 12, height: 20, rx: 5, fill: '#FFC27A' }, wdG);
    E('rect', { x: 1660, y: 638, width: 16, height: 14, rx: 3, fill: '#FBFBF7', stroke: '#9AA6BC', 'stroke-width': 1 }, wdG); }
  const coffeeSt = [0, 1].map(() => E('path', { d: 'M0,0 q-4,-8 0,-16 q4,-8 0,-16', stroke: '#fff', 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round' }, wdG));
  const trayG = G(camC); tf(trayG, 1612, 650);
  E('path', { d: 'M-8,-46 L-4,-56 L58,-60 L60,-48 Z', fill: '#F2A9C0' }, trayG); E('path', { d: 'M4,-46 L8,-62 L66,-58 L62,-46 Z', fill: '#F7C4D2' }, trayG);
  const trayStack = E('rect', { x: 2, y: -50, width: 64, height: 6, fill: '#F2A9C0' }, trayG);
  E('path', { d: 'M-14,-44 L80,-44 L74,0 L-8,0 Z', fill: '#B98A56' }, trayG); E('path', { d: 'M-14,-44 L80,-44', stroke: '#E0B27A', 'stroke-width': 3 }, trayG);
  E('rect', { x: 4, y: -34, width: 58, height: 24, rx: 3, fill: '#FBF3E2' }, trayG);
  TX(trayG, 33, -15, 'LATER', 19, '#3A2A20', { a: 'middle', w: 800 });
  /* the birthday telegram */
  const telG = G(camC);
  E('rect', { x: -62, y: -40, width: 124, height: 80, rx: 4, fill: '#F7B9CB', stroke: '#C9708C', 'stroke-width': 2 }, telG);
  TX(telG, 0, -8, 'HAPPY', 22, '#5A1E3A', { a: 'middle', w: 800 }); TX(telG, 0, 20, 'BIRTHDAY', 22, '#5A1E3A', { a: 'middle', w: 800 });
  /* ---- the rulebook (on a lectern on the table) ---- */
  const BX = 800, BT = 380, BB = 650, BW = 230;
  const bookG = G(camC);
  const lect = G(bookG); E('path', { d: 'M690,640 L910,640 L930,700 L670,700 Z', fill: '#7A4A30' }, lect); E('path', { d: 'M670,700 L930,700 L930,708 L670,708 Z', fill: '#4A2C1A' }, lect);
  const bookIn = G(bookG);
  const dust = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => E('circle', { r: 20, fill: rgrad([[0, '#EFE2C8', .8], [.6, '#E3D2B2', .5], [1, '#E3D2B2', 0]]) }, bookG));
  const pageLines = (p, x0, y0, n, w = 180) => { let d = ''; for (let i = 0; i < n; i++) d += `M${x0},${y0 + i * 14} h${f2(w * (.7 + .3 * hash(i + x0)))} `; E('path', { d, stroke: '#A89E8E', 'stroke-width': 3, 'stroke-linecap': 'round' }, p); };
  const paperP = (p, x0, x1) => { E('rect', { x: Math.min(x0, x1), y: BT, width: Math.abs(x1 - x0), height: BB - BT, fill: '#F8F1E0' }, p);
    E('rect', { x: Math.min(x0, x1), y: BT, width: Math.abs(x1 - x0), height: BB - BT, fill: lgrad(x0 < x1 ? [[0, '#8A6A40', .28], [.12, '#8A6A40', 0], [1, '#8A6A40', 0]] : [[0, '#8A6A40', 0], [.88, '#8A6A40', 0], [1, '#8A6A40', .28]], 0, 0, 1, 0) }, p); };
  const stampMark = (p, x, y, l1, l2, sz = 22) => { const g = G(p); tf(g, x, y, -5);
    E('rect', { x: -98, y: -40, width: 196, height: 80, rx: 10, fill: 'none', stroke: '#C8302A', 'stroke-width': 5 }, g);
    E('rect', { x: -90, y: -32, width: 180, height: 64, rx: 6, fill: 'none', stroke: '#C8302A', 'stroke-width': 2 }, g);
    TX(g, 0, -4, l1, sz, '#C8302A', { a: 'middle', w: 800 }); TX(g, 0, 24, l2, sz, '#C8302A', { a: 'middle', w: 800 });
    E('path', { d: dots([[-70, -20, 2], [40, 18, 2.5], [76, -24, 1.6], [-30, 26, 1.8], [10, -30, 1.5], [-84, 10, 1.5]]), fill: '#F8F1E0', 'fill-opacity': .8 }, g);
    return g; };
  const doodle = (p, k) => { const g = G(p); const S = { stroke: '#5A5A66', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (k === 0) { E('path', Object.assign({ d: 'M600,520 Q685,560 770,520 L756,548 Q685,572 614,548 Z' }, S), g); [628, 652, 676, 700, 724, 748].forEach((x, i) => E('path', Object.assign({ d: `M${x},${i < 2 ? 520 : 528} v-${i < 2 ? 0 : 6}` }, S), g)); [626, 650].forEach(x => E('circle', Object.assign({ cx: x, cy: 506, r: 9 }, S), g)); E('path', Object.assign({ d: 'M672,528 h86' }, S, { 'stroke-dasharray': '6 8' }), g); }
    else if (k === 1) { E('rect', Object.assign({ x: 620, y: 470, width: 110, height: 70, rx: 6 }, S), g); E('circle', Object.assign({ cx: 650, cy: 505, r: 12 }, S), g); E('circle', Object.assign({ cx: 698, cy: 505, r: 9 }, S), g); E('path', Object.assign({ d: 'M640,470 Q675,420 710,470' }, S), g); TX(g, 742, 452, 'Zzz', 30, '#5A5A66', { w: 700, hand: true }); }
    else { E('path', Object.assign({ d: 'M610,560 L640,500 L662,510 L690,440 L716,486 L740,476 L764,560 Z' }, S), g); E('path', Object.assign({ d: 'M662,512 q8,-6 16,0 M698,508 q8,-6 16,0 M670,532 q20,10 40,-6' }, S), g); E('path', Object.assign({ d: 'M590,562 H784' }, S), g); }
    TX(g, 685, 610, '1912', 20, '#5A5A66', { a: 'middle', w: 700, hand: true });
    E('path', { d: 'M610,450 L760,590 M760,450 L610,590', stroke: '#C8302A', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .85 }, g);
    return g; };
  const flipT = (g, sx) => g.setAttribute('transform', `translate(${BX},0) scale(${f2(Math.max(.004, Math.abs(sx)) * 1000) / 1000 * (sx < 0 ? -1 : 1)},1) translate(${-BX},0)`);
  const mirrorIn = p => G(p, { transform: `translate(${2 * BX},0) scale(-1,1)` });
  /* page block thickness */
  const blockL = G(bookIn), blockR = G(bookIn);
  [[blockL, BX - BW - 6, BX], [blockR, BX, BX + BW + 6]].forEach(([g, a, b], k) => {
    E('path', { d: `M${a},${BT - 4} L${b},${BT - 4} L${b},${BB + 24} L${a},${BB + 24} Z`, fill: '#5A1E1A' }, g);
    E('path', { d: `M${k ? a : a + 6},${BB} L${k ? b - 6 : b},${BB} L${k ? b - 10 : b},${BB + 20} L${k ? a : a + 10},${BB + 20} Z`, fill: '#EFE4CC' }, g);
    E('path', { d: `M${k ? a : a + 10},${BB + 7} H${k ? b - 10 : b} M${k ? a : a + 12},${BB + 13} H${k ? b - 12 : b}`, stroke: '#C9B898', 'stroke-width': 1.5 }, g); });
  const backs = G(bookIn), fronts = G(bookIn);
  /* faces: cover ↔ left 1, leaf1 = right 1 ↔ left 2, leaf2 = right 2 ↔ left 3, base right = right 3 */
  const mkFace = (parent, fn) => { const g = G(parent); fn(g); return g; };
  const coverBack = mkFace(backs, g => { const m = mirrorIn(g); paperP(m, BX, BX - BW); doodle(m, 0); });
  const leaf1Back = mkFace(backs, g => { const m = mirrorIn(g); paperP(m, BX, BX - BW); doodle(m, 1); });
  const leaf2Back = mkFace(backs, g => { const m = mirrorIn(g); paperP(m, BX, BX - BW); doodle(m, 2); });
  [coverBack, leaf1Back, leaf2Back].forEach(g => { const m = g.firstChild; m.setAttribute('transform', `translate(${2 * BX},0) scale(-1,1)`); });
  const rightPage = (g, n, lines) => { paperP(g, BX, BX + BW); TX(g, BX + BW / 2, BT + 34, 'RULE ' + n, 20, '#6A5A48', { a: 'middle', w: 800, ls: 3 }); E('path', { d: `M${BX + 60},${BT + 46} h110`, stroke: '#B8A27E', 'stroke-width': 2 }, g); if (lines) pageLines(g, BX + 26, BT + 70, 6); };
  const baseR = mkFace(fronts, g => { rightPage(g, 3, false); });
  const FR = [BX + 20, BT + 58, 190, 190 * 9 / 16];   /* the picture frame on page 3 */
  E('rect', { x: FR[0] - 4, y: FR[1] - 4, width: FR[2] + 8, height: FR[3] + 8, fill: 'none', stroke: '#5A4A3A', 'stroke-width': 2 }, baseR);
  E('rect', { x: FR[0], y: FR[1], width: FR[2], height: FR[3], fill: '#C9D6DC' }, baseR);
  const stamp3 = stampMark(baseR, BX + BW / 2, BB - 58, 'INTERNATIONAL', 'ICE PATROL', 20);
  const leaf2F = mkFace(fronts, g => rightPage(g, 2, true));
  const stamp2 = stampMark(leaf2F, BX + BW / 2, BB - 70, 'RADIO WATCH', '24 HOURS');
  const leaf1F = mkFace(fronts, g => rightPage(g, 1, true));
  const stamp1 = stampMark(leaf1F, BX + BW / 2, BB - 70, 'LIFEBOAT SEATS', 'FOR EVERYONE', 21);
  const coverF = mkFace(fronts, g => {
    E('rect', { x: BX, y: BT - 4, width: BW + 6, height: BB - BT + 28, rx: 6, fill: '#6E2420' }, g);
    E('rect', { x: BX, y: BT - 4, width: 22, height: BB - BT + 28, fill: '#4E1814' }, g);
    E('rect', { x: BX + 34, y: BT + 14, width: BW - 52, height: BB - BT - 8, rx: 4, fill: 'none', stroke: '#E8C46A', 'stroke-width': 3 }, g);
    E('rect', { x: BX + 42, y: BT + 22, width: BW - 68, height: BB - BT - 24, rx: 3, fill: 'none', stroke: '#E8C46A', 'stroke-width': 1.2 }, g);
    const cx = BX + 11 + BW / 2;
    TX(g, cx, BT + 92, 'SAFETY OF', 27, '#F0CF7A', { a: 'middle', w: 800, ls: 1 });
    TX(g, cx, BT + 126, 'LIFE AT SEA', 27, '#F0CF7A', { a: 'middle', w: 800, ls: 1 });
    E('path', { d: `M${cx - 50},${BT + 150} h100 M${cx},${BT + 142} l8,8 l-8,8 l-8,-8 Z`, stroke: '#E8C46A', 'stroke-width': 2, fill: '#E8C46A' }, g);
    TX(g, cx, BT + 196, '1914', 40, '#F0CF7A', { a: 'middle', w: 800, ls: 3 });
    TX(g, cx, BT + 230, 'TREATY', 20, '#E8C46A', { a: 'middle', w: 700, ls: 4 });
    E('rect', { x: BX, y: BT - 4, width: BW + 6, height: BB - BT + 28, rx: 6, fill: lgrad([[0, '#fff', .1], [.5, '#000', 0], [1, '#000', .18]], 0, 0, 1, 1) }, g);
  });
  const turnShadow = E('rect', { x: BX, y: BT, width: BW, height: BB - BT, fill: '#3A2A1A', opacity: 0 }, fronts);
  /* the hand of officialdom with the giant stamp (own layer, above the picture) */
  const cTop = G(RM); const stampH = G(cTop);
  { E('rect', { x: -95, y: -16, width: 190, height: 16, rx: 3, fill: '#B3261E' }, stampH);
    E('rect', { x: -100, y: -66, width: 200, height: 52, rx: 7, fill: '#8A5A32' }, stampH); E('rect', { x: -100, y: -66, width: 200, height: 9, rx: 4, fill: '#B07A4A' }, stampH);
    E('rect', { x: -16, y: -114, width: 32, height: 50, fill: '#6E4426' }, stampH); E('ellipse', { cx: 0, cy: -132, rx: 38, ry: 25, fill: '#9A6A3A' }, stampH); E('ellipse', { cx: -10, cy: -140, rx: 12, ry: 7, fill: '#C48B60' }, stampH);
    E('rect', { x: -40, y: -1300, width: 80, height: 1150, fill: '#2A2E3E' }, stampH); E('path', { d: 'M-40,-1300 V-150 M40,-1300 V-150', stroke: '#1A1C26', 'stroke-width': 4 }, stampH);
    E('rect', { x: -44, y: -168, width: 88, height: 22, rx: 4, fill: '#F4F1EA' }, stampH); E('circle', { cx: 26, cy: -157, r: 4.5, fill: '#E3B341' }, stampH);
    E('path', { d: 'M-36,-150 Q-46,-126 -30,-116 L30,-116 Q46,-126 36,-150 Z', fill: '#F0C49E' }, stampH);
    E('path', { d: 'M-28,-120 v14 M-10,-118 v16 M8,-118 v16 M26,-120 v14', stroke: '#F0C49E', 'stroke-width': 13, 'stroke-linecap': 'round' }, stampH);
    E('path', { d: 'M-28,-114 v8 M-10,-112 v10 M8,-112 v10 M26,-114 v8', stroke: '#C9906A', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, stampH); }
  const inkSplat = G(cTop); [0, 1, 2, 3, 4].forEach(i => E('path', { d: `M0,0 l${f2(Math.cos(i * 1.3) * 14)},${f2(Math.sin(i * 1.3) * 6)}`, stroke: '#7A5A3A', 'stroke-width': 4, 'stroke-linecap': 'round' }, inkSplat));
  const T_THUD = LT(4) + 3.25, T_OPEN = LT(4) + 5.55, T_ST1 = LT(4) + 6.8, T_DING = LT(4) + 7.55;
  const T_TURN2 = LT(5) - .45, T_ST2 = LT(5) + .45, T_FILE = LT(5) + 1.75;
  const T_TURN3 = LT(6) - .35, T_ST3 = LT(6) + .62;
  const CAM_R = [[T_ROOM, 800, 455, 1], [LT(4) + 1.5, 800, 462, 1.02], [LT(4) + 2.4, 800, 478, 1.12], [LT(4) + 3, 805, 480, 1.12], [LT(4) + 3.9, 905, 505, 1.36], [LT(4) + 5.6, 905, 505, 1.4], [LT(4) + 6.3, 740, 480, 1.2], [LT(5) - .45, 760, 480, 1.2], [LT(5) + .35, 1190, 480, 1.22], [LT(6) - .5, 1200, 482, 1.22], [LT(6) + .3, 915, 500, 1.45], [T_PUSH0, 915, 482, 1.5]];

  /* ====================================================================
     SHOT I — the page's picture comes alive: the International Ice Patrol
     ==================================================================== */
  const PI = G(world); const piClip = G(PI, { 'clip-path': clipRect(0, 0, 1600, 900) }); const piCam = G(piClip);
  E('rect', { x: -300, y: -300, width: 2200, height: 775, fill: lgrad([[0, '#9FB4C6'], [.6, '#D9E0E0'], [1, '#EEEBE0']]) }, piCam);
  const piClouds = [[300, 150, 260], [1150, 110, 340], [800, 260, 200]].map(([x, y, w], i) => { const g = G(piCam); tf(g, x, y); E('path', { d: dots([[-w * .3, 0, w * .16], [-w * .05, -w * .08, w * .22], [w * .22, 0, w * .17], [0, w * .05, w * .2]]), fill: '#F4F2EA', 'fill-opacity': .85 }, g); g.bx = x; g.by = y; return g; });
  [[180, 474, 70, 30, 1], [1420, 474, 90, 40, 2]].forEach(([x, y, w, h, k]) => { const b = mkBerg(piCam, k, w, h, ['#DCE8EE', '#B4C8D6', '#9AB2C4', '#FFFFFF', '#FFFFFF']); tf(b, x, y); });
  E('rect', { x: -300, y: 470, width: 2200, height: 760, fill: lgrad([[0, '#8FB0C0'], [.4, '#6A95AA'], [1, '#3E6E88']]) }, piCam);
  const piWaves = [0, 1, 2, 3, 4].map(i => { const y = 500 + i * i * 26 + i * 20, P = 110 + i * 50; let d = ''; for (let x = -400; x < 2100; x += P) d += `M${x},${y} q${P / 4},-${5 + i * 2} ${P / 2},0 `; return E('path', { d, stroke: '#2E5A72', 'stroke-width': 2 + i * .5, fill: 'none', 'stroke-opacity': .35 }, piCam); });
  /* patrol ship (bow right, waterline origin) — two copies: behind / in front of the berg */
  const mkPatrol = p => { const g = G(p); const wk = G(g);
    E('path', { d: 'M-200,0 C-280,4 -400,10 -520,16 L-520,26 C-400,18 -280,10 -200,6 Z', fill: '#FFFFFF', 'fill-opacity': .55 }, wk);
    E('path', { d: 'M150,-2 Q190,-6 214,-14 Q222,-4 236,2 Z', fill: '#FFFFFF', 'fill-opacity': .8 }, wk);
    E('path', { d: 'M90,-170 V-40 M90,-150 L-60,-112', stroke: '#4A4A50', 'stroke-width': 3 }, g);
    E('path', { d: 'M92,-168 l26,7 l-26,7 Z', fill: '#1F3A7A' }, g);
    E('path', { d: 'M-46,-60 L-40,-138 L-10,-138 L-6,-60 Z', fill: '#D9A441' }, g); E('path', { d: 'M-41,-122 L-40,-138 L-10,-138 L-9,-122 Z', fill: '#1E1E24' }, g);
    E('rect', { x: -70, y: -74, width: 140, height: 34, rx: 3, fill: '#F2EFE6' }, g); E('rect', { x: 20, y: -100, width: 56, height: 28, rx: 3, fill: '#F2EFE6' }, g);
    E('path', { d: 'M26,-92 h44', stroke: '#2E3A52', 'stroke-width': 9, 'stroke-dasharray': '8 4' }, g);
    E('path', { d: 'M-60,-58 h120', stroke: '#2E3A52', 'stroke-width': 6, 'stroke-dasharray': '6 8' }, g);
    E('rect', { x: 42, y: -116, width: 20, height: 16, rx: 4, fill: '#3A3A44' }, g); const lamp = E('circle', { cx: 60, cy: -108, r: 6, fill: '#FFF6C0' }, g);
    E('path', { d: 'M-210,-46 L190,-50 Q214,-50 232,-60 L214,0 L-196,0 Q-212,-20 -210,-46 Z', fill: '#F7F5EE' }, g);
    E('path', { d: 'M-204,-8 L222,-8 L214,0 L-196,0 Z', fill: '#B3261E' }, g);
    E('path', { d: 'M-210,-46 L190,-50 Q214,-50 232,-60', stroke: '#9AA0AE', 'stroke-width': 2, fill: 'none' }, g);
    const nm = TX(g, 10, -18, 'ICE PATROL', 26, '#1D2B53', { a: 'middle', w: 800, ls: 1 });
    /* sailor with a clipboard at the stern */
    const sl = G(g); tf(sl, -150, -48);
    E('path', { d: 'M-8,0 L-9,-26 Q0,-32 9,-26 L8,0 Z', fill: '#1F2A4A' }, sl); E('circle', { cx: 0, cy: -38, r: 8, fill: '#F1C49C' }, sl); E('path', { d: 'M-9,-42 Q0,-52 9,-42 Z', fill: '#FFFFFF' }, sl);
    E('rect', { x: 4, y: -26, width: 14, height: 18, rx: 2, fill: '#FFFFFF', stroke: '#8A6A44', 'stroke-width': 2 }, sl); E('path', { d: 'M7,-20 h8 M7,-15 h8', stroke: '#8A8A90', 'stroke-width': 1.2 }, sl);
    /* tape reel at the bow */
    E('circle', { cx: 196, cy: -58, r: 9, fill: '#F2C230', stroke: '#8A6A1E', 'stroke-width': 2 }, g);
    g.nm = nm; g.wk = wk; g.lamp = lamp; return g; };
  const shipBack = mkPatrol(piCam);
  const beamBack = E('path', { fill: '#FFF8DC', 'fill-opacity': .14 }, piCam);
  const piBerg = Iceberg(piCam, {});
  const pout = G(piBerg.face);
  E('ellipse', { cx: -4, cy: -68, rx: 70, ry: 44, fill: lgrad([[0, '#E2F4FB'], [.7, '#D7F0F9'], [1, '#C8E8F5']]) }, pout);
  const poutM = E('path', { fill: '#1F4B66' }, pout);
  E('path', { d: 'M-18,-62 Q-4,-56 10,-62', stroke: '#7DBFD9', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, pout);
  const armsG = G(piCam); const armsIn = G(armsG);
  [[-1, -50, 58, -8], [1, -14, -60, -48]].forEach(([sd, ey, hx, hy]) => {
    const ex = sd * 186, d = `M${ex},${ey} L${hx},${hy}`;
    E('circle', { cx: ex, cy: ey, r: 27, fill: '#E4F6FC', stroke: '#4E8EB2', 'stroke-width': 5 }, armsIn);
    E('path', { d, stroke: '#4E8EB2', 'stroke-width': 42, 'stroke-linecap': 'round' }, armsIn);
    E('path', { d, stroke: '#E4F6FC', 'stroke-width': 32, 'stroke-linecap': 'round' }, armsIn);
    E('path', { d: `M${ex + sd * -10},${ey - 9} L${hx + sd * 8},${hy - 9}`, stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-opacity': .9 }, armsIn);
    E('path', { d: `M${hx - 14},${hy - 6} q4,8 0,14 M${hx - 4},${hy - 8} q4,9 0,16`, stroke: '#7DB4D0', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, armsIn); });
  const spot = E('ellipse', { rx: 170, ry: 140, fill: rgrad([[0, '#FFFBEA', .38], [.6, '#FFFBEA', .12], [1, '#FFFBEA', 0]]) }, piCam);
  /* the much smaller iceberg (two worried dot eyes) */
  const smallB = G(piCam); { const b = mkBerg(smallB, 0, 190, 120, ['#E6F4FA', '#B6D8E8', '#9CC8DE', '#FFFFFF', '#FFFFFF']); E('path', { d: 'M-104,4 q26,8 52,0 t52,0 t52,0 t52,0', stroke: '#fff', 'stroke-width': 4, fill: 'none', 'stroke-opacity': .8 }, smallB); }
  const sbEyes = G(smallB); [-14, 14].forEach(x => { E('ellipse', { cx: x, cy: -62, rx: 7, ry: 9, fill: '#fff' }, sbEyes); E('circle', { cx: x, cy: -60, r: 4, fill: '#173248' }, sbEyes); });
  const sbBrow = E('path', { d: 'M-22,-78 l12,4 M22,-78 l-12,4', stroke: '#6FA8C6', 'stroke-width': 3, 'stroke-linecap': 'round' }, smallB);
  const sbSweat = E('path', { d: 'M34,-80 q6,8 0,12 q-6,-4 0,-12 Z', fill: '#E9FBFF', stroke: '#6FB4D0', 'stroke-width': 1.5 }, smallB);
  const tapeU = E('path', { fill: 'none', stroke: '#F2C230', 'stroke-width': 6, 'stroke-opacity': .55, 'stroke-dasharray': '30 3' }, piCam);
  const tape = E('path', { fill: 'none', stroke: '#F2C230', 'stroke-width': 7, 'stroke-linecap': 'round' }, piCam);
  const tapeTk = E('path', { fill: 'none', stroke: '#6A4A10', 'stroke-width': 7, 'stroke-dasharray': '1.5 10' }, piCam);
  const beamFront = E('path', { fill: lgrad([[0, '#FFFBE6', .1], [1, '#FFFBE6', .45]], 0, 0, 1, 0) }, piCam);
  const shipFront = mkPatrol(piCam);
  /* paper feel + a printed border */
  E('rect', { x: -300, y: -300, width: 2200, height: 1500, fill: '#F4E9D0', 'fill-opacity': .1 }, piClip);
  world.appendChild(cTop);
  const piBorder = G(PI); E('rect', { x: 12, y: 12, width: 1576, height: 876, fill: 'none', stroke: '#5A4A3A', 'stroke-width': 6 }, piBorder); E('rect', { x: 26, y: 26, width: 1548, height: 848, fill: 'none', stroke: '#5A4A3A', 'stroke-width': 2 }, piBorder);

  /* ====================================================================
     SHOT Z — the sincere coda: calm sea at sunrise (no gags, no faces)
     ==================================================================== */
  const Z = G(world); const zCam = G(Z);
  const HZZ = 470;
  E('rect', { x: -200, y: -200, width: 2000, height: HZZ + 206, fill: lgrad([[0, '#3E465E'], [.55, '#7C8296'], [.9, '#B9B3B8'], [1, '#CFC6C2']]) }, zCam);
  const zWarm = E('rect', { x: -200, y: -200, width: 2000, height: HZZ + 206, fill: lgrad([[0, '#34467E'], [.45, '#7E78AE'], [.72, '#E59AA0'], [.9, '#FFC08E'], [1, '#FFDDA6']]) }, zCam);
  const zSun = G(zCam);
  E('circle', { r: 520, fill: rgrad([[0, '#FFE6B0', .5], [.35, '#FFC796', .2], [1, '#FFB088', 0]]) }, zSun);
  E('circle', { r: 80, fill: '#FFE3A8', 'fill-opacity': .45 }, zSun); E('circle', { r: 50, fill: '#FFF0C8' }, zSun); E('circle', { r: 42, fill: '#FFF8E6' }, zSun);
  const zRays = G(zSun); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, a2 = a + .06; E('path', { d: `M0,0 L${f2(Math.cos(a) * 1600)},${f2(Math.sin(a) * 1600)} L${f2(Math.cos(a2) * 1600)},${f2(Math.sin(a2) * 1600)} Z`, fill: '#FFF2D0', 'fill-opacity': i % 2 ? .03 : .06 }, zRays); }
  const zClouds = [[260, 150, 420, 0], [1180, 110, 520, 1], [760, 300, 300, 2], [1460, 330, 260, 3], [120, 360, 240, 4]].map(([x, y, w, i]) => { const g = G(zCam);
    const lens = (c, dy, k, o2) => E('path', { d: dots([[-w * .28, dy, w * .14 * k], [-w * .05, dy - w * .02, w * .2 * k], [w * .2, dy, w * .15 * k]]).replace(/a(\S+?),(\S+?) /g, (m, rx, ry) => `a${rx},${f2(+ry * .22)} `), fill: c, 'fill-opacity': o2 }, g);
    const shd = lens('#8E8AA8', 6, 1, .55), top = lens('#E8D6DA', 0, .92, .5), rim = E('path', { d: `M${f2(-w * .36)},${f2(w * .03)} Q0,${f2(w * .07)} ${f2(w * .34)},${f2(w * .03)}`, stroke: '#FFD9B0', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, g);
    g.bx = x; g.by = y; g.sp = 4 + hash(i * 3.3) * 5; g.ph = hash(i * 7.1) * 6.28; g.rim = rim; g.top = top; return g; });
  /* sea */
  E('rect', { x: -200, y: HZZ, width: 2000, height: 700, fill: lgrad([[0, '#A7A6B4'], [.2, '#6E7A92'], [1, '#2E3A56']]) }, zCam);
  const zSeaW = E('rect', { x: -200, y: HZZ, width: 2000, height: 700, fill: lgrad([[0, '#F6C8A8'], [.18, '#B88EA4'], [.5, '#5E6A9A'], [1, '#2A3660']]) }, zCam);
  E('rect', { x: -200, y: HZZ - 2, width: 2000, height: 5, fill: '#FFF0E0', 'fill-opacity': .5 }, zCam);
  const zSwell = []; for (let i = 0; i < 8; i++) { const t = (i + 1) / 9, y = HZZ + 6 + Math.pow(t, 1.7) * 430, P = lerp(90, 420, t), a = lerp(.6, 4.5, t); const d = [];
    for (let x = -600; x < 2200; x += P) d.push([x, `M${f2(x + P * hash(i * 3 + x) * .3)},${f2(y)} q${f2(P * .25)},${f2(-a)} ${f2(P * .5)},0`]);
    const e = G(zCam, { stroke: '#E9E4F0', 'stroke-width': lerp(.8, 2.4, t), fill: 'none', 'stroke-opacity': lerp(.18, .32, t), 'stroke-linecap': 'round' }); chunkP(e, d, {}, 500);
    zSwell.push({ e, P, sp: lerp(2, 9, t), i }); }
  const zGlint = G(zCam); const glints = [0, 1, 2].map(k => { let d = ''; for (let j = k; j < 48; j += 3) { const tt = Math.pow(hash(j * 2.71 + 5), 1.5), y = HZZ + 3 + tt * 420, spr = 8 + tt * 150, x = (hash(j * 4.33) - .5) * 2 * spr, w = 6 + (8 + 50 * tt) * (.3 + .7 * hash(j * 6.1));
    d += `M${f2(x - w / 2)},${f2(y)} h${f2(w)} `; } return E('path', { d, stroke: '#FFF0D0', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, zGlint); });
  /* the modern ship (bow right): white decks, a long row of bright orange lifeboats, a blinking mast light */
  const mShip = G(zCam); const msIn = G(mShip);
  { const g = msIn;
    E('path', { d: 'M-320,0 C-440,4 -620,10 -900,14 L-900,22 C-620,18 -440,10 -320,6 Z', fill: '#FFF2E6', 'fill-opacity': .4 }, g);
    E('path', { d: 'M-300,6 L290,6 L300,18 L-290,24 Z', fill: '#1E2A44', 'fill-opacity': .25 }, g);
    /* superstructure */
    E('path', { d: 'M-250,-62 L230,-62 L222,-96 L-236,-96 Z', fill: '#F6F5F0' }, g);
    E('path', { d: 'M-224,-96 L190,-96 L178,-128 L-210,-128 Z', fill: '#F2F1EC' }, g);
    E('path', { d: 'M-196,-128 L150,-128 L136,-156 L-180,-156 Z', fill: '#EDEBE6' }, g);
    E('path', { d: 'M70,-156 L150,-156 L162,-180 L60,-180 Z', fill: '#F6F5F0' }, g);
    E('path', { d: 'M74,-170 L156,-170', stroke: '#2A3A5A', 'stroke-width': 8 }, g);
    E('path', { d: 'M-232,-80 H222 M-206,-112 H180 M-176,-142 H140', stroke: '#33507A', 'stroke-width': 6, 'stroke-dasharray': '10 5' }, g);
    /* funnel */
    E('path', { d: 'M-130,-156 L-74,-156 L-62,-214 L-120,-214 Z', fill: '#F6F5F0' }, g); E('path', { d: 'M-120,-214 L-62,-214 L-64,-202 L-122,-202 Z', fill: '#1E2A44' }, g); E('path', { d: 'M-126,-180 L-70,-180 L-68,-190 L-124,-190 Z', fill: '#2E6AB0' }, g);
    /* mast + radar */
    E('path', { d: 'M110,-180 V-252 M96,-226 H124', stroke: '#9AA0AE', 'stroke-width': 3 }, g);
    /* hull */
    E('path', { d: 'M-300,-62 L250,-62 Q290,-62 320,-70 L292,0 L-292,0 Q-300,-30 -300,-62 Z', fill: '#FBFAF6' }, g);
    E('path', { d: 'M-298,-28 L306,-34 L292,0 L-292,0 Z', fill: '#1F3A5F' }, g);
    E('path', { d: 'M-296,-30 L307,-36', stroke: '#2E8AC8', 'stroke-width': 4 }, g);
    E('path', { d: 'M-292,0 L292,0 L289,6 L-290,6 Z', fill: '#B3261E' }, g);
    { let w = ''; for (let x = -280; x < 270; x += 13) w += `M${x},-46 h7 `; E('path', { d: w, stroke: '#4A5A78', 'stroke-width': 4 }, g); }
    /* the lifeboats: bright orange, lots of them */
    for (let x = -226, k = 0; x <= 186; x += 34, k++) { E('path', { d: `M${x - 10},-104 L${x - 3},-98`, stroke: '#9AA0AE', 'stroke-width': 2 }, g);
      E('rect', { x: x - 15, y: -98, width: 30, height: 15, rx: 7, fill: '#F47A20' }, g); E('rect', { x: x - 13, y: -98, width: 26, height: 5, rx: 2.5, fill: '#FFB070' }, g); E('path', { d: `M${x - 13},-86 h26`, stroke: '#B8521A', 'stroke-width': 2 }, g); }
  }
  const msLight = E('circle', { cx: 110, cy: -256, r: 5, fill: '#FF4A3A' }, msIn);
  const msGlow = E('circle', { cx: 110, cy: -256, r: 18, fill: rgrad([[0, '#FF6A5A', .7], [1, '#FF6A5A', 0]]) }, msIn);
  const msRadar = E('path', { d: 'M96,-238 H124', stroke: '#C9CED8', 'stroke-width': 4, 'stroke-linecap': 'round' }, msIn);
  const msWake = E('path', { d: 'M-300,4 C-420,8 -600,12 -880,16', stroke: '#FFF4EA', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '40 22 70 26', 'stroke-opacity': .7 }, msIn);
  const msBow = E('path', { d: 'M286,-4 Q300,-10 318,-2 Q300,2 286,2 Z', fill: '#FFFFFF', 'fill-opacity': .8 }, msIn);
  /* the wreath */
  const wreath = G(zCam); const wrIn = G(wreath);
  E('ellipse', { cx: 0, cy: 6, rx: 96, ry: 22, fill: '#1E2840', 'fill-opacity': .18 }, wrIn);
  const wrRip = [0, 1].map(() => E('ellipse', { cx: 0, cy: 4, fill: 'none', stroke: '#F4E6E0', 'stroke-width': 2 }, wrIn));
  { const g = wrIn; E('ellipse', { cx: 0, cy: -6, rx: 74, ry: 24, fill: 'none', stroke: '#2E4A30', 'stroke-width': 22 }, g);
    for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2, x = Math.cos(a) * 74, y = Math.sin(a) * 24 - 6, back = Math.sin(a) < 0;
      E('ellipse', { cx: f2(x), cy: f2(y), rx: 13, ry: 5.5, fill: i % 3 ? '#4E7A44' : '#6E9A58', transform: `rotate(${f2(a * 57.3 + 60)} ${f2(x)} ${f2(y)})`, opacity: back ? .85 : 1 }, g); }
    [[-50, 10], [-14, 18], [26, 17], [58, 6], [-66, -12], [64, -16], [0, -28]].forEach(([x, y], i) => { E('circle', { cx: x, cy: y, r: 8, fill: i % 2 ? '#F6F2EC' : '#FFFFFF' }, g); E('circle', { cx: x, cy: y, r: 3.4, fill: '#E6D8C8' }, g); });
    E('path', { d: 'M-6,16 C-16,30 -30,40 -46,46 M6,16 C14,32 24,42 40,50', stroke: '#7A1E28', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M0,16 C-22,2 -26,24 -2,18 Z M0,16 C22,2 26,24 2,18 Z', fill: '#8E2A32' }, g); E('circle', { cx: 0, cy: 17, r: 5, fill: '#6A1A22' }, g); }
  /* gulls: one low glider for line 8, a few high ones for the hold */
  const mkGull = (p, c = '#F4F2EE', tipc = '#4A4F5C') => { const g = G(p); const wing = E('path', { stroke: c, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); const tip = E('path', { stroke: tipc, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g); E('ellipse', { cx: 0, cy: 1, rx: 6, ry: 2.6, fill: c }, g);
    g.set = (x, y, s, f, dir = 1, rot = 0) => { tf(g, x, y, rot, s * dir, s); wing.setAttribute('d', `M-18,${f2(-6 * f)} Q-9,${f2(-10 * f - 3)} 0,0 Q9,${f2(-10 * f - 3)} 18,${f2(-6 * f)}`); tip.setAttribute('d', `M-20,${f2(-6 * f + 1)} L-17,${f2(-6 * f)} M17,${f2(-6 * f)} L20,${f2(-6 * f + 1)}`); }; return g; };
  const lowGull = mkGull(zCam), gullShadow = E('ellipse', { rx: 14, ry: 2.5, fill: '#1E2840', 'fill-opacity': .2 }, zCam);
  const hiGulls = [0, 1, 2].map(i => mkGull(zCam, '#FBF6F0', '#5A5E6A'));
  /* end card */
  const card = G(Z);
  { const t1 = TX(card, 807, 160, 'TITANIC', 40, '#FFF6EA', { a: 'middle', w: 700, ls: 14 }), t2 = TX(card, 800, 222, '10–15 April 1912', 24, '#FFF1E0', { a: 'middle', w: 600, ls: 3 });
    [t1, t2].forEach(t => { t.setAttribute('stroke', '#3A3456'); t.setAttribute('stroke-opacity', '.3'); t.setAttribute('stroke-width', '4'); t.setAttribute('paint-order', 'stroke'); });
    E('path', { d: 'M730,186 H870', stroke: '#FFF1E0', 'stroke-width': 1.6, 'stroke-opacity': .75 }, card); E('path', { d: 'M800,180 l6,6 l-6,6 l-6,-6 Z', fill: '#FFF1E0', 'fill-opacity': .85 }, card); }

  const black = E('rect', { x: -100, y: -100, width: 1800, height: 1100, fill: '#05060A' }, world);

  /* ====================================================================
     UPDATE
     ==================================================================== */
  return (lt, at) => {
    /* ---------- which shots are on ---------- */
    const onA = lt < T_DAWN + .35, onD = lt >= T_DAWN && lt < T_POV, onP = lt >= T_POV && lt < T_ROOM;
    const onR = lt >= T_ROOM && lt < T_PUSH1 + .02, onI = lt >= T_TURN3 + .26 && lt < T_CODA, onZ = lt >= T_CODA;
    op(A, onA ? 1 : 0); op(D, onD ? (lt < T_DAWN + .35 ? clamp((lt - T_DAWN) / .35) : 1) : 0); op(PV, onP ? 1 : 0); op(RM, onR ? 1 : 0); op(cTop, onR ? 1 : 0); op(Z, onZ ? 1 : 0);
    const fade = lt < T_FADE ? 0 : lt < T_CODA ? prog(lt, T_FADE, T_CODA - T_FADE - .05) : 1 - prog(lt, T_CODA, .8);
    op(black, fade);

    /* ================= A ================= */
    if (onA) {
      const [cx, cy, z] = camAt(lt, CAM_A);
      layT(aSky, cx, cy, z, .18, AX0); layT(aSea, cx, cy, z, 1, AX0); layT(aFar, cx, cy, z, .42, AX0); layT(aMain, cx, cy, z, 1, AX0); layT(aFG, cx, cy, z, 1.35, AX0);
      skyA.anim(at); seaA.anim(at);
      const xs = shipX(lt), ys = shipY(xs), ss = shipSc(xs), ph = Math.PI * (xs - 905) / 342.5, sl = Math.sin(ph);
      tf(shipA, xs, ys + Math.sin(at * 1.1) * 1.5, -sl * 1.6 + Math.sin(at * .9) * .4, ss * (1 - .14 * Math.abs(sl)), ss);
      carp.set({ x: 0, y: 0, s: 1, wake: 1, lights: 1, smoke: 1 }); carp.anim(at);
      refl2[0].setAttribute('stroke-opacity', f2(.3 + .22 * Math.sin(at * 7))); refl2[1].setAttribute('stroke-opacity', f2(.3 + .22 * Math.sin(at * 6 + 2)));
      bulbG.forEach((b, k) => op(b, .75 + .25 * Math.sin(at * 4 + k * 2.1)));
      halo.setAttribute('fill-opacity', f2(.18 + .06 * Math.sin(at * 3)));
      /* foam track */
      let d = ''; const xe = xs - 300 * ss;
      for (let x = xe - 1100; x <= xe; x += 30) d += (d ? ' L' : 'M') + f2(x) + ',' + f2(shipY(x) + 3);
      d += ' L' + f2(xe) + ',' + f2(shipY(xe) + 3);
      wakeW.setAttribute('d', d); wakeL.setAttribute('d', d); wakeL.setAttribute('stroke-dashoffset', f2(-at * 90));
      wakeGrad.setAttribute('x1', f2(xe - 1100)); wakeGrad.setAttribute('x2', f2(xe));
      /* bergs catch the ship's lamplight */
      backB.concat(frontB).forEach((b, i) => { const k = clamp(1 - Math.abs(xs - b.bx) / 520); b.warm.setAttribute('opacity', f2(Math.pow(k, 1.5) * (i < backB.length ? .08 : .2))); });
    }

    /* ================= D ================= */
    if (onD) {
      const [cx, cy, z] = camAt(lt, CAM_D);
      layT(dSky, cx, cy, z, .25, DX0); layT(dSea, cx, cy, z, .6, DX0); layT(dMain, cx, cy, z, 1, DX0);
      skyD.anim(at); seaD.anim(at); floesD.anim(at);
      lbFar.forEach((lb, i) => { const [x, y, s, fl] = lb.pos; lb.set({ x: x - (lt - T_DAWN) * (10 + i * 4), y, s, flip: fl, row: at * .55 + i * .4, lower: 1 }); lb.anim(at); });
      if (lt < LT(1) + .35) { lbNear.set({ x: 178, y: 612, s: .6, row: .2 + Math.sin(at * .5) * .04, lower: 1 }); lbNear.anim(at); }
      urnSteam.forEach((p, i) => { const k = frac(at * .45 + i / 3); tf(p, 734 + i * 10 + Math.sin(at * 2 + i) * 3, 556 - k * 26); p.setAttribute('opacity', f2(Math.sin(Math.PI * k) * .55)); });
      const farOn = lt < LT(1) + .35 ? 1 : 0; [climbG, sailor.root, lbNear.g, stew[0].root, stew[1].root, stew[2].root].forEach(g => op(g, farOn));
      /* climber */
      const cu = prog(lt, T_DAWN + .15, 1.25, easeOut);
      if (farOn) climber.set({ x: 182, y: lerp(900, 736, cu), s: .6, at, face: cu < 1 ? 'worried' : 'happy', hL: cu < 1 ? [-70, -300 + Math.sin(at * 6) * 10] : [-40, -170], hR: cu < 1 ? [70, -280 - Math.sin(at * 6) * 10] : [40, -170], shiver: .5, rim: .7, look: [.5, -.2], turn: .3 });
      op(climbBl, prog(lt, T_DAWN + 1.75, .3));
      if (farOn) sailor.set({ x: 66, y: 738, s: .6, at, face: 'happy', turn: .5, look: [.8, .3], hR: [90 + cu * 10, -140 - cu * 60], hL: [30, -150 - cu * 40], bendR: -20, rim: .7, tilt: 6 - cu * 4 });
      /* chain of stewards: every hand-off is a pure function of lt */
      const base = (lt - T_DAWN + 4) / 1.15;
      STW.forEach((x, i) => {
        if (!farOn && i < 3) { op(items[i].b, 0); op(items[i].m, 0); return; }
        const ph = base + .62 * i, p = frac(ph), c = Math.floor(ph);
        const sw = p < .62 ? ease(p / .62) : 1 - ease((p - .62) / .38), arc = Math.sin(Math.PI * Math.min(1, p / .62)) * (p < .62 ? 1 : 0);
        const hx = lerp(90, -90, sw), hy = -158 - 26 * arc;
        stew[i].set({ x, y: STY, s: STS, at, face: (i + c) % 3 ? 'happy' : 'joy', hL: [hx - 22, hy + 6], hR: [hx + 22, hy], bendL: 10, bendR: -10, tilt: lerp(5, -5, sw), turn: lerp(.45, -.45, sw), look: [lerp(.7, -.7, sw), .2], bob: Math.sin(Math.PI * sw) * -3, rim: .7 });
        const it = items[i], hw = handW(x, STY, STS, [hx, hy - 14], false);
        const show = p < .62 && !(i === 3 && p < .04);
        const type = ((c % 2) + 2) % 2;
        op(it.b, show && type === 0 ? 1 : 0); op(it.m, show && type === 1 ? 1 : 0);
        if (show) { tf(type ? it.m : it.b, hw[0], hw[1] + (type ? 4 : 0), lerp(6, -6, sw), 1);
          if (type) { const k = frac(at * .8 + i * .3); it.m.st.setAttribute('opacity', f2(Math.sin(Math.PI * k) * .7)); tf(it.m.st, 0, -k * 6); } }
      });
      /* ---- main group ---- */
      const tWrap0 = LT(1) + .95, u = prog(lt, tWrap0, .75, x => x), uE = ease(u);
      const wrapped = lt > tWrap0 + .7;
      const tTurn = LT(2) - .25, tGive = LT(2) + 1.65, tHug = LT(2) + 1.85, tRaise = LT(3) + .2;
      const RS = .95 * 1.03, RX = 1190, RY = 850;
      /* rescue captain */
      const rTalk = cue.talk(lt, 'R');
      let rh = [[-95, -232], [95, -232]], rFace = 'happy', rTurn = .3, rLook = [.6, .1], rTilt = 0, rBob = 0;
      if (lt < tWrap0) { const up = prog(lt, LT(1) - .2, .5); rh = [[-95, lerp(-232, -268, up)], [95, lerp(-232, -268, up)]]; rTurn = .35; }
      else if (lt < tWrap0 + .9) { const hp0 = [lerp(BL_H[0][0], BL_D[0][0], uE), lerp(BL_H[0][1], BL_D[0][1], uE) + Math.sin(Math.PI * u) * 40], hp1 = [lerp(BL_H[5][0], BL_D[3][0], uE), lerp(BL_H[5][1], BL_D[3][1], uE) + Math.sin(Math.PI * u) * 40];
        const l0 = handL(RX, RY, RS, hp0, false), l1 = handL(RX, RY, RS, hp1, false); const rel = prog(lt, tWrap0 + .6, .3);
        rh = [[lerp(clamp(l0[0], -120, 150), 60, rel), lerp(clamp(l0[1], -300, -150), -180, rel)], [lerp(clamp(l1[0], -40, 175), 120, rel), lerp(clamp(l1[1], -300, -150), -190, rel)]]; rTilt = 6 * Math.sin(Math.PI * u); rTurn = .5; rLook = [.9, .2]; }
      else if (lt < tTurn) { const pat = Math.max(0, Math.sin((lt - tWrap0) * 9)) * prog(lt, tWrap0 + 1.6, .2) * (1 - prog(lt, tWrap0 + 2.4, .2)); rh = [[-58, -132], [118, -196 + pat * 10]]; rFace = lt > LT(1) + 2 ? 'joy' : 'happy'; rTurn = .45; rLook = [.7, .2]; }
      else { const present = prog(lt, LT(2) + .1, .35), extend = prog(lt, LT(2) + 1.05, .45), back = prog(lt, tGive + .1, .4);
        rTurn = lerp(.45, -.55, prog(lt, tTurn, .35)); rLook = [-.8, .1]; rFace = lt > tGive ? 'joy' : 'happy';
        const cxh = lerp(0, -70, extend) * (1 - back), cyh = lerp(-150, -196, present) - extend * 10 * (1 - back);
        rh = present > 0 ? [[cxh - 36, cyh + 4], [cxh + 36, cyh]] : [[-58, -132], [58, -132]];
        if (back > 0) rh = [[lerp(rh[0][0], -58, back), lerp(rh[0][1], -132, back)], [lerp(rh[1][0], 58, back), lerp(rh[1][1], -132, back)]];
        rTilt = -4 * extend * (1 - back); rBob = 6 * Math.sin(Math.PI * clamp((lt - (LT(2) + .95)) / .7)); }
      rcap.set({ x: RX, y: RY, s: .95, at, face: rFace, talk: rTalk, turn: rTurn, look: rLook, hL: rh[0], hR: rh[1], bendL: 14, bendR: -14, tilt: rTilt, bob: rBob, rim: .75, headTilt: rBob * .8 });
      /* breath puffs from the captain while he speaks, and from the shivering family before the wrap */
      const mouthR = handW(RX, RY, RS, [rTurn * 9, -272], false, rBob);
      puffs.forEach((pf, i) => { const k = frac(at * .9 + i * .25), src = i < 2 ? mouthR : [lerp(1333, 1500, i - 2), 850 - .93 * 272];
        const on = i < 2 ? (rTalk ? 1 : 0) : (wrapped ? 0 : .7);
        tf(pf, src[0] + (i < 2 ? (rTurn > 0 ? 1 : -1) : 1) * (6 + k * 34), src[1] - 4 - k * 18, 0, .5 + k * 1.3); pf.setAttribute('opacity', f2(on * Math.sin(Math.PI * k) * .45)); });
      /* lookout */
      const lTalk = cue.talk(lt, 'L');
      let lh = [[-50, -128], [50, -128]], lFace = 'neutral', lTurn = 0, lLook = [.5, .1], lTilt = 0, lHead = 0, lBlush = 0;
      if (lt < tTurn) { lLook = lt < LT(1) ? [-.6, .1] : [.7, .1]; lTurn = lt < LT(1) ? -.2 : .3; lFace = lt > tWrap0 + .6 ? 'happy' : 'neutral'; }
      else if (lt < tHug) { const reach = prog(lt, LT(2) + 1.05, .4); lTurn = .5; lLook = [.8, 0]; lFace = reach > .2 ? 'surprise' : 'happy'; lh = [[lerp(-50, 30, reach), lerp(-128, -196, reach)], [lerp(50, 96, reach), lerp(-128, -190, reach)]]; }
      else if (lt < tRaise) { lFace = 'joy'; lTilt = Math.sin((lt - tHug) * 7) * 5; lh = [[-46, -186], [46, -182]]; lBlush = .5 + prog(lt, LT(3) - .1, .3) * .5; lHead = lTalk ? -6 * Math.sin(Math.PI * clamp((lt - LT(3)) / .5)) : 0; if (lTalk) lFace = 'happy'; }
      else { const r2 = prog(lt, tRaise, .26); lFace = r2 > .5 ? 'focus' : 'happy'; lTurn = .6 * r2; lLook = [.9, -.1]; lBlush = 1 - r2; lh = [[lerp(-46, 34, r2), lerp(-186, -300, r2)], [lerp(46, 92, r2), lerp(-182, -298, r2)]]; }
      look.set({ x: 1060, y: 850, s: .95, at, face: lFace, talk: lTalk, turn: lTurn, look: lLook, hL: lh[0], hR: lh[1], tilt: lTilt, headTilt: lHead, blush: lBlush, rim: .75, bendL: 12, bendR: -12 });
      /* binoculars */
      let bv = 0, bx = 0, by = 0, bs = .95, br = 0, side = 0;
      if (lt >= LT(2) + .1) {
        bv = 1;
        if (lt < tGive) { const w2 = handW(RX, RY, RS, [(rh[0][0] + rh[1][0]) / 2, (rh[0][1] + rh[1][1]) / 2 - 12], false, rBob); bx = w2[0]; by = w2[1]; bs = .95 * pop(lt, LT(2) + .1, .45); br = -4; }
        else { const tr = prog(lt, tGive, .2); const lw = handW(1060, 850, .95, [(lh[0][0] + lh[1][0]) / 2, (lh[0][1] + lh[1][1]) / 2 + 4], false);
          const cw = handW(RX, RY, RS, [-70 * 1, -206], false); bx = lerp(cw[0], lw[0], tr); by = lerp(cw[1], lw[1], tr) - Math.sin(Math.PI * tr) * 20; br = lTilt * .9;
          if (lt >= tRaise) { const r2 = prog(lt, tRaise, .28); side = r2 > .45 ? 1 : 0; const ew = handW(1060, 850, .95, [62 * r2, -300], false); bx = lerp(lw[0], ew[0], r2); by = lerp(lw[1], ew[1], r2); br = 0; } }
      }
      op(binoc, bv); if (bv) { tf(binoc, bx, by, br, bs); op(bFront, side ? 0 : 1); op(bSide, side); }
      sparks.forEach((sp, i) => { const k = clamp((lt - (LT(2) + .12)) / .7); const a = i / 6 * Math.PI * 2 + .3; op(sp, k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0); if (k > 0 && k < 1) tf(sp, bx + Math.cos(a) * (30 + 50 * k), by + Math.sin(a) * (24 + 40 * k), at * 120, .6 + .5 * Math.sin(Math.PI * k)); });
      { const h = hearts[3], k = clamp((lt - (LT(1) + 2.45)) / 1.1); op(h, k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0); if (k > 0 && k < 1) tf(h, 1420 + Math.sin(k * 7) * 8, 660 - k * 60, 0, .9 + .4 * k); }
      hearts.slice(0, 3).forEach((h, i) => { const k = clamp((lt - tHug - .2 - i * .25) / 1.1); op(h, k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0); if (k > 0 && k < 1) tf(h, 1060 + (i - 1) * 34 + Math.sin(k * 6 + i) * 8, 520 - k * 70, 0, 1.1); });
      /* lady, Mitzi, mother, kids */
      const shv = wrapped ? 0 : .55, joy = wrapped;
      const lickK = clamp((lt - (LT(1) + 2.2)) / 1.1), licking = lickK > 0 && lickK < 1;
      const lookAtCap = lt > tTurn ? [-.7, 0] : [-.5, .1];
      lady.set({ x: 1333, y: 850, s: .93, at, face: joy ? (licking ? 'joy' : 'happy') : 'worried', shiver: shv, hL: [-6, -168], hR: [44, -160], bendL: 16, bendR: -16, turn: -.2, look: licking ? [.7, .4] : lookAtCap, rim: .75, fan: 0 });
      op(lady.fan, 0);
      mother.set({ x: 1495, y: 850, s: .93, at, face: joy ? 'happy' : 'worried', shiver: shv, turn: -.3, look: licking ? [-.7, .5] : lookAtCap, hL: [-40, -150], hR: [40, -150], rim: .75 });
      const mDx = licking ? Math.sin(Math.PI * lickK) * 10 : 0;
      mitzi.set({ x: 1350 + mDx, y: 712, s: .58, at, face: licking ? 'happy' : (wrapped ? 'happy' : 'worried'), rot: licking ? 8 * Math.sin(Math.PI * lickK) : 0, wag: wrapped ? 1 : .2 });
      op(lick, licking ? 1 : 0); if (licking) { const lk = Math.max(0, Math.sin(lickK * Math.PI * 4)); tf(lick, 0, 0, -20 * lk, .6 + .6 * lk, 1); }
      boy.set({ x: 1402, y: 872, s: .95, at, face: licking ? 'joy' : joy ? 'happy' : 'worried', shiver: shv, turn: licking ? -.4 : -.2, look: licking ? [-.8, -.3] : lookAtCap, headTilt: licking ? -10 * Math.sin(Math.PI * lickK) : 0, rim: .75 });
      girl.set({ x: 1578, y: 874, s: .95, at, face: joy ? 'joy' : 'worried', shiver: shv, turn: -.3, look: lookAtCap, rim: .75 });
      /* the big blanket */
      const P = BL_H.map((h, i) => { const dd = BL_D[i]; return [lerp(h[0], dd[0], uE), lerp(h[1], dd[1], uE) + Math.sin(Math.PI * u) * (i < 12 ? 46 : 10)]; });
      if (u <= 0) { const w0 = handW(RX, RY, RS, rh[0], false), w1 = handW(RX, RY, RS, rh[1], false); for (let i = 0; i < 12; i++) { const k = i / 11; P[i] = [lerp(w0[0], w1[0], k), lerp(w0[1], w1[1], k) + 10 * Math.sin(Math.PI * k) + 4]; }
        const sw = Math.sin(at * 1.7) * 4; P[12][0] += sw; P[13][0] += sw * .7; P[14][0] += sw; P[12][1] = P[0][1] + 210; P[13][1] = P[0][1] + 222; P[14][1] = P[0][1] + 210; P[15][1] = P[0][1] + 108; }
      if (wrapped) { const br2 = Math.sin(at * 1.6) * 1.6; for (let i = 0; i < 12; i++) P[i][1] += br2 * (i % 2 ? 1 : .6); }
      const bd = smooth(P);
      blBase.setAttribute('d', bd); blClipP.setAttribute('d', bd); blEdge.setAttribute('d', bd);
      const cxB = P.reduce((a, p) => a + p[0], 0) / P.length, cyB = P.reduce((a, p) => a + p[1], 0) / P.length;
      tf(blPatIn, cxB, cyB, lerp(-8, 3, uE));
      blShade.setAttribute('d', smooth([P[13], P[14], P[15], [lerp(P[15][0], P[13][0], .5), lerp(P[15][1], P[13][1], .5) - 20]]));
    }

    /* ================= P ================= */
    if (onP) {
      const t = lt - T_POV, jx = Math.sin(at * 2.3) * 6 + Math.sin(at * 5.1) * 2, jy = Math.sin(at * 1.7 + 1) * 5;
      tf(pvMask, jx * .3, jy * .3);
      pvIn.setAttribute('transform', `translate(${f2(800 + jx)},${f2(450 + jy)}) scale(${f2(1 + t * .03)}) translate(-800,-450)`);
      const notice = .1, duck0 = .26, duck = prog(t, duck0, .28, easeIn);
      pvBerg.set({ x: 820, y: 640 + duck * 280, s: 1.15, at, face: t < notice ? 'whistle' : t < duck0 + .1 ? 'surprised' : 'oops', look: t < notice ? [-.7, -.4] : [0, .2], showUnder: 0, bob: 0 });
      pvSw.forEach((p, i) => tf(p, -((at * (8 + i * 6)) % (120 + i * 60)), Math.sin(at + i) * 2));
      pvRip.forEach((r, i) => { const k = clamp((t - duck0 - .22 - i * .16) / .8); op(r, k > 0 && k < 1 ? (1 - k) * .8 : 0); r.setAttribute('rx', f2(40 + k * 220)); r.setAttribute('ry', f2(6 + k * 26)); });
      pvBub.forEach((b, i) => { const k = clamp((t - duck0 - .22 - i * .06) / .6); op(b, k > 0 && k < 1 ? 1 - k * .6 : 0); b.setAttribute('cx', f2(820 + (hash(i * 3.1) - .5) * 120 + Math.sin(k * 8 + i) * 8)); b.setAttribute('cy', f2(530 - k * (120 + hash(i) * 80))); });
      const gk = prog(t, duck0 + .26, .1); op(glugG, gk); tf(glugG, 900, 430 - prog(t, duck0 + .26, 1) * 30, -8, pop(t, duck0 + .26, .35));
    }

    /* ================= R ================= */
    if (onR) {
      let cx, cy, z;
      if (lt < T_PUSH0) [cx, cy, z] = camAt(lt, CAM_R);
      else { const p = prog(lt, T_PUSH0, T_PUSH1 - T_PUSH0, ease), z0 = 1.5, zF = 1600 / FR[2]; z = z0 * Math.pow(zF / z0, p); cx = lerp(915, FR[0] + FR[2] / 2, Math.min(1, p * 1.4)); cy = lerp(482, FR[1] + FR[3] / 2, Math.min(1, p * 1.4)); }
      const sh = kick(lt, [T_THUD], 9, 6) + kick(lt, [T_ST1, T_ST2, T_ST3], 5, 9);
      cy += sh / z;
      camT(camC, cx, cy, z); camT(cTop, cx, cy, z);
      /* picture frame on the page → screen */
      const sx = (FR[0] - cx) * z + 800, sy = (FR[1] - cy) * z + 450, sk = FR[2] * z / 1600;
      PI._sc = [sx, sy, sk];
      /* ambient room life */
      motes.forEach((m, i) => { const k = frac(at * (.03 + hash(i) * .03) + hash(i * 3)); m.setAttribute('cx', f2(lerp(1150, 900, k) + Math.sin(at * .7 + i) * 30 - hash(i * 5) * 200)); m.setAttribute('cy', f2(lerp(120, 700, k))); m.setAttribute('fill-opacity', f2(.5 * Math.sin(Math.PI * k))); });
      tf(pend, 0, 54, Math.sin(at * 3.1) * 14);
      const spin = prog(lt, LT(5) + .05, 1.5, ease) * 720;
      tf(hHand, 0, 0, 300 + spin / 12 * 2); tf(mHand, 0, 0, 60 + spin * 2);
      const cl = prog(lt, LT(5) + .05, .2) * (1 - prog(lt, LT(5) + 1.5, .3)); op(clockLines, cl); if (cl) tf(clockLines, Math.sin(at * 40) * 2, 0);
      chand.forEach((c, i) => tf(c, [450, 1150][i], -86, Math.sin(at * .8 + i) * .8 + kick(lt, [T_THUD], 3, 3, 12)));
      flags.forEach(f => f.setAttribute('transform', `translate(0,-84) skewY(${f2(Math.sin(at * 2.2 + f.ph) * 4)}) scale(${f2(1 - .05 * Math.abs(Math.sin(at * 2.2 + f.ph)))},1)`));
      coffeeSt.forEach((p, i) => { const k = frac(at * .6 + i * .5); tf(p, 1668 + i * 4, 634 - k * 14); p.setAttribute('opacity', f2(Math.sin(Math.PI * k) * .6)); });
      /* delegates */
      const agree = prog(lt, LT(4) + 1.75, .22, easeOut) * (1 - prog(lt, LT(4) + 2.95, .35));
      const clap = (t0) => lt > t0 && lt < t0 + 1.2 ? 1 : 0;
      dels.forEach((P, i) => { const [x, y, s] = P.pos; const dir = i < 2 ? 1 : -1;
        let face = 'neutral', talk = false, hL = [-50, -150], hR = [50, -150], lk = [dir * .6, .2], turn = dir * .3, bob = hop(lt, T_THUD + .02 + i * .04, 12, .3);
        if (lt < LT(4) + 1.7) { talk = Math.sin(at * 3 + i * 2) > -.2; face = i % 2 ? 'worried' : 'focus'; lk = [i % 2 ? -.6 : .6, 0]; turn = i % 2 ? -.4 : .4; if (i === 0) hR = [80, -230 + Math.sin(at * 8) * 8]; if (i === 3) hL = [-80, -226 + Math.sin(at * 7) * 8]; }
        else if (agree > 0) { face = lt < LT(4) + 2.35 ? 'surprise' : 'joy'; lk = [Math.sin(at * 2 + i) > 0 ? .8 : -.8, 0]; turn = lk[0] * .4; hR = [lerp(50, 64, agree), lerp(-150, -330, agree)]; }
        else if (lt < T_THUD) { face = 'happy'; }
        else { face = lt < T_THUD + .7 ? 'surprise' : 'happy'; const bkx = 900 - x; lk = [clamp(bkx / 400, -1, 1), .3]; turn = lk[0] * .35;
          const cl2 = clap(T_ST1 + .2) || clap(T_ST3 + .2); if (cl2) { face = 'joy'; const k = Math.abs(Math.sin(at * 14)); hL = [-14 - 18 * k, -180]; hR = [14 + 18 * k, -180]; }
          if (lt > LT(5) - .4 && lt < LT(6) - .4) { lk = [dir > 0 ? .9 : .7, .1]; turn = .4; } }
        P.set({ x, y, s, at, face, talk, hL, hR, look: lk, turn, bob, sit: true, headTilt: lt > T_ST2 && lt < T_ST2 + 1 ? Math.sin((lt - T_ST2) * 10) * 5 : 0 }); });
      /* wireless operator: wide awake, files the birthday telegram under LATER */
      const wTalk = cue.talk(lt, 'W'), fp = prog(lt, T_FILE, .45), fd = prog(lt, T_FILE + .45, .25, easeIn);
      const WX = 1530, WY = 790, WS = .82;
      let wh = [[-50, -150], [60, -205]];
      if (lt > T_FILE - .2) wh = [[-50, -150], [lerp(60, 100, fp) + fd * 26, lerp(-205, -250, fp) + fd * 120]];
      wop.set({ x: WX, y: WY, s: WS, at, face: lt < LT(5) - .3 ? 'surprise' : fp > 0 && fp < 1 ? 'focus' : 'proud', talk: wTalk, turn: lt > LT(5) - .5 ? -.3 : -.1, look: fp > 0 && fd < 1 ? [.6, .2] : [-.6, 0], hL: wh[0], hR: wh[1], lid: 0, headTilt: fd > 0 ? -6 * fd : 0 });
      const tw = handW(WX, WY, WS, [wh[1][0] + 10, wh[1][1] - 34], false);
      const inTray = fd >= 1;
      tf(telG, inTray ? 1645 : tw[0], inTray ? 600 : tw[1], inTray ? -6 : lerp(-8, 10, fp), inTray ? .62 : .7);
      op(telG, inTray ? 0 : prog(lt, T_FILE - .95, .15)); if (!inTray && lt < T_FILE) tf(telG, tw[0], tw[1], -8, .7 * pop(lt, T_FILE - .95, .4)); trayStack.setAttribute('height', inTray ? 14 : 6); trayStack.setAttribute('y', inTray ? -58 : -50);
      /* blackboard: the old sum finally balances */
      const dk = prog(lt, T_DING, .25); op(bbLt, 1 - dk); op(bbEq, dk); op(bbTick, prog(lt, T_DING + .15, .25));
      const dg = clamp((lt - T_DING) / 1.4); op(dingG, dg > 0 && dg < 1 ? Math.min(1, dg * 6) * (1 - prog(dg, .75, .25)) : 0); tf(dingG, 112, 50, 0, .8 + .3 * pop(lt, T_DING, .3));
      tf(bell, 112, 88, swing(lt, T_DING, 14, 22, 3));
      /* the book */
      const fall = prog(lt, T_THUD - .38, .38, easeIn), land = lt > T_THUD ? Math.exp(-(lt - T_THUD) * 9) * Math.sin((lt - T_THUD) * 30) : 0;
      op(bookG, lt > T_THUD - .4 ? 1 : 0);
      bookIn.setAttribute('transform', `translate(0,${f2((1 - fall) * -760)}) translate(800,${BB + 20}) scale(${f2(1 + land * .04)},${f2(1 - land * .08)}) translate(-800,${-(BB + 20)})`);
      dust.forEach((dd, i) => { const k = clamp((lt - T_THUD) / 1.1), sd = i % 2 ? 1 : -1, j = Math.floor(i / 2); op(dd, k > 0 && k < 1 ? Math.pow(1 - k, 1.4) : 0); if (k > 0 && k < 1) { const e = easeOut(k); dd.setAttribute('cx', f2(915 + sd * (130 + j * 26 + e * (90 + j * 30)))); dd.setAttribute('cy', f2(BB + 22 - e * (20 + j * 16) - j * 6)); dd.setAttribute('r', f2(18 + j * 4 + e * (30 + j * 6))); } });
      const sxC = 1 - 2 * prog(lt, T_OPEN, .7, ease), sx1 = 1 - 2 * prog(lt, T_TURN2, .5, ease), sx2 = 1 - 2 * prog(lt, T_TURN3, .5, ease);
      op(blockL, sxC < .2 ? 1 : 0);
      flipT(coverF, sxC); flipT(coverBack, sxC); op(coverF, sxC > 0 ? 1 : 0); op(coverBack, sxC < 0 ? 1 : 0);
      flipT(leaf1F, sx1); flipT(leaf1Back, sx1); op(leaf1F, sx1 > 0 ? 1 : 0); op(leaf1Back, sx1 < 0 ? 1 : 0);
      flipT(leaf2F, sx2); flipT(leaf2Back, sx2); op(leaf2F, sx2 > 0 ? 1 : 0); op(leaf2Back, sx2 < 0 ? 1 : 0);
      const turning = Math.max(sx1 < 1 && sx1 > -1 ? 1 - Math.abs(sx1) : 0, sx2 < 1 && sx2 > -1 ? 1 - Math.abs(sx2) : 0, sxC < 1 && sxC > -1 ? 1 - Math.abs(sxC) : 0);
      turnShadow.setAttribute('opacity', f2(turning * .25));
      op(stamp1, lt > T_ST1 + .05 ? 1 : 0); op(stamp2, lt > T_ST2 + .05 ? 1 : 0); op(stamp3, lt > T_ST3 + .05 ? 1 : 0);
      /* the hand of officialdom */
      const STS2 = [[T_ST1, BB - 70], [T_ST2, BB - 70], [T_ST3, BB - 58]];
      let hv = 0, hxp = 0, hyp = 0, hr = 0;
      STS2.forEach(([t0, y0]) => { const t = lt - t0; if (t > -.55 && t < .75) { hv = 1; hxp = BX + BW / 2 + 40 * (1 - prog(t, -.55, .4)); const dn = t < -.1 ? lerp(-520, -90, ease(clamp((t + .55) / .35))) : t < 0 ? lerp(-90, 0, easeIn(clamp((t + .1) / .1))) : t < .16 ? 0 : lerp(0, -700, easeIn(clamp((t - .16) / .55))); hyp = y0 + 40 + dn; hr = -5 + (t < -.1 ? 6 * (1 - clamp((t + .55) / .45)) : 0); } });
      op(stampH, hv); if (hv) tf(stampH, hxp, hyp, hr);
      const sp = STS2.find(([t0]) => lt > t0 && lt < t0 + .4);
      op(inkSplat, sp ? 1 - (lt - sp[0]) / .4 : 0); if (sp) tf(inkSplat, BX + BW / 2 + 104, sp[1] + 40, 0, 1 + (lt - sp[0]) * 3);
    }

    /* ================= I (the picture) ================= */
    op(PI, onI ? 1 : 0);
    if (onI) {
      if (lt < T_PUSH1 && PI._sc) { const [sx, sy, sk] = PI._sc; tf(PI, sx, sy, 0, sk); op(PI, prog(lt, T_TURN3 + .26, .12)); } else tf(PI, 0, 0, 0, 1);
      op(piBorder, 1 - prog(lt, T_PUSH1 - .3, .3));
      /* internal camera: slow drift + follow the scooting berg */
      const scoot = prog(lt, LE(7) - 1.32, .62, easeOut), edge = prog(lt, LE(7) - .74, 1.0);
      const icx = 800 - scoot * 120, icz = 1 + prog(lt, T_PUSH1, 4) * .06;
      piCam.setAttribute('transform', `translate(800,450) scale(${f2(icz)}) translate(${f2(-icx)},-450)`);
      piClouds.forEach((c, i) => tf(c, c.bx + Math.sin(at * .1 + i) * 40, c.by + Math.sin(at * .13 + i) * 4));
      piWaves.forEach((w, i) => tf(w, -((at * (10 + i * 7)) % (110 + i * 50)), Math.sin(at * .9 + i) * 2));
      /* patrol ship: sweeps round behind the berg, comes to the near side, then parks and shadows it */
      const TS = LT(7) + 1.5, RX2 = 470;
      const th = keyed(lt, [[T_PUSH0, -2.75], [LT(7) - .05, .02], [TS, .95]], x => x);
      const bergX = 840 - scoot * 200, sideK = Math.sin(th);
      let px = 840 + RX2 * Math.cos(th), py = 612 + 70 * sideK, ps = .56 + .12 * sideK, dir = sideK >= 0 ? -1 : 1, sqx = .28 + .72 * Math.abs(sideK);
      if (lt >= TS) { px -= scoot * 200; sqx = lerp(sqx, 1, prog(lt, TS, .5)); }
      const front = sideK >= 0;
      [shipBack, shipFront].forEach((g, k) => { const on = (k === 1) === front; op(g, on ? 1 : 0); if (on) { tf(g, px, py + Math.sin(at * 1.4) * 2, Math.sin(at * 1.1) * 1.2, ps * sqx * dir, ps); g.nm.setAttribute('transform', dir < 0 ? 'translate(20,0) scale(-1,1)' : ''); g.lamp.setAttribute('fill-opacity', f2(.8 + .2 * Math.sin(at * 9))); tf(g.wk, 0, 0, 0, 1, 1 + .1 * Math.sin(at * 3)); } });
      /* the Iceberg: startled, flattered, then ninety per cent offended */
      const iT = cue.talk(lt, 'I'), t7 = lt - LT(7);
      const sulk = t7 > 1.5, turned = t7 > 1.56;
      const ibX = bergX, ibY = 652, ibS = .74;
      const face = lt < LT(7) - .2 ? (lt < T_PUSH1 ? 'smug' : 'whistle') : t7 < .62 ? 'surprised' : 'smug';
      const lookShip = [clamp((px - ibX) / 400, -1, 1), clamp((py - 560) / 200, -.5, .6)];
      piBerg.set({ x: ibX, y: ibY, s: ibS, at, face, talk: iT, look: sulk ? [-.9, .25] : face === 'whistle' ? undefined : lookShip, showUnder: .4, flip: turned, rot: sulk ? -3 : t7 > .62 ? Math.sin(at * 3) * 1.5 : 0, bob: 0 });
      op(pout, sulk ? 1 : 0);
      if (sulk) { const m = iT ? .5 + .5 * Math.abs(Math.sin(at * 11) * Math.sin(at * 4.3 + 1)) : 0; poutM.setAttribute('d', `M-30,-76 Q-4,-104 22,-78 Q-4,${f2(-88 + m * 16)} -30,-76 Z`); }
      const ak = pop(lt, LT(7) + 1.62, .4); op(armsG, ak > .01 ? 1 : 0); tf(armsG, ibX, ibY + Math.sin(at * .8) * 3 * ibS, turned ? 3 : 0, ibS * (turned ? -1 : 1), ibS); tf(armsIn, 0, -40 * (1 - ak), 0, ak, ak);
      /* beam + spot (from the ship's searchlight to the berg's face) */
      const lampW = [px + dir * ps * sqx * 60, py - ps * 108], tgt = [ibX + (sulk ? -14 : 0), ibY - 150 * ibS];
      const ang = Math.atan2(tgt[1] - lampW[1], tgt[0] - lampW[0]), nx = -Math.sin(ang), ny = Math.cos(ang), Lb = Math.hypot(tgt[0] - lampW[0], tgt[1] - lampW[1]) + 110;
      const bd = `M${f2(lampW[0])},${f2(lampW[1])} L${f2(lampW[0] + Math.cos(ang) * Lb + nx * 110)},${f2(lampW[1] + Math.sin(ang) * Lb + ny * 110)} L${f2(lampW[0] + Math.cos(ang) * Lb - nx * 110)},${f2(lampW[1] + Math.sin(ang) * Lb - ny * 110)} Z`;
      beamFront.setAttribute('d', bd); beamBack.setAttribute('d', bd); op(beamFront, front ? 1 : 0); op(beamBack, front ? 0 : 1);
      spot.setAttribute('cx', f2(tgt[0])); spot.setAttribute('cy', f2(tgt[1] + 20)); op(spot, front ? .9 + .1 * Math.sin(at * 9) : .3);
      /* the very long measuring tape, from the reel on the bow to the berg's flank */
      const tk = prog(lt, LT(7) + 1.2, .5), td = prog(lt, LT(7) + 1.7, 1.4, x => x);
      if (front && tk > 0) { const a0 = [px + dir * ps * sqx * 196, py - ps * 58], fx2 = ibX + (turned ? 150 : 200) * ibS, a1 = [lerp(a0[0], fx2, tk), lerp(a0[1], ibY + 2, tk)];
        const dt = `M${f2(a0[0])},${f2(a0[1])} Q${f2((a0[0] + a1[0]) / 2)},${f2(Math.max(a0[1], a1[1]) + 14)} ${f2(a1[0])},${f2(a1[1])}`; tape.setAttribute('d', dt); tapeTk.setAttribute('d', dt); op(tape, 1); op(tapeTk, 1);
        op(tapeU, td > 0 ? 1 : 0); if (td > 0) tapeU.setAttribute('d', `M${f2(a1[0])},${f2(a1[1])} Q${f2(a1[0] + 30 + Math.sin(at * 2) * 6)},${f2(a1[1] + 140 * td)} ${f2(a1[0] - 10)},${f2(a1[1] + 330 * td)}`); }
      else { op(tape, 0); op(tapeTk, 0); op(tapeU, 0); }
      /* the much smaller berg edges away */
      const sbx = 600 - edge * 330 + (edge > 0 && edge < 1 ? Math.sin(at * 18) * 3 : 0);
      tf(smallB, sbx, 662, 0, 1); tf(sbEyes, lerp(0, 6, scoot) - edge * 10, 0);
      op(sbSweat, scoot > .5 ? 1 : 0); tf(sbSweat, 0, (at * 30) % 14);
    }

    /* ================= Z (coda) ================= */
    if (onZ) {
      const zt = lt - T_CODA;
      const zz = 1 + prog(lt, T_CODA, DUR - T_CODA, x => x) * .045;
      zCam.setAttribute('transform', `translate(800,450) scale(${f2(zz * 1000) / 1000}) translate(-800,${f2(-450 + zt * .4)})`);
      const warm = prog(lt, LT(8) + 2.2, LT(9) + 4.5 - (LT(8) + 2.2), ease);
      op(zWarm, warm); op(zSeaW, warm * .9);
      const sunY = lerp(HZZ + 60, HZZ - 64, prog(lt, LT(8) + 2.5, DUR - (LT(8) + 2.5), x => 1 - Math.pow(1 - x, 1.6)));
      tf(zSun, 560, sunY); op(zSun, .25 + .75 * warm);
      zClouds.forEach((c, i) => { tf(c, c.bx + Math.sin(at * .035 + c.ph) * 70, c.by + Math.sin(at * .05 + c.ph) * 4); c.rim.setAttribute('opacity', f2(warm * .8)); });
      zSwell.forEach(s => tf(s.e, -((at * s.sp + s.i * 31) % s.P), Math.sin(at * .5 + s.i * .9) * 1.4));
      tf(zGlint, 560, 0); glints.forEach((g, k) => g.setAttribute('stroke-opacity', f2(warm * (.15 + .75 * Math.max(0, Math.sin(at * (1.7 + k * .6) + k * 2.1))))));
      /* wreath */
      const wx = lerp(470, 560, prog(lt, T_CODA, DUR - T_CODA, x => x));
      tf(wreath, wx, 694 + Math.sin(at * .8) * 2.2, Math.sin(at * .55) * 1.6, 1.15);
      wrRip.forEach((r, i) => { const k = frac(at * .18 + i * .5); r.setAttribute('rx', f2(90 + k * 90)); r.setAttribute('ry', f2(22 + k * 20)); r.setAttribute('stroke-opacity', f2((1 - k) * .3)); });
      /* the low gull (line 8) */
      const gk = prog(lt, LT(8) + .2, LE(8) + 1.4 - LT(8), x => x);
      if (gk > 0 && gk < 1) { const gx = lerp(1720, -120, gk), gy = 600 - Math.sin(gk * Math.PI) * 40, f = Math.sin(gk * 30) > .6 ? Math.sin(at * 9) : .2; lowGull.set(gx, gy, 1.2, f, -1, Math.sin(gk * 6) * 4); op(lowGull, 1); op(gullShadow, 1); gullShadow.setAttribute('cx', f2(gx)); gullShadow.setAttribute('cy', f2(640)); }
      else { op(lowGull, 0); op(gullShadow, 0); }
      hiGulls.forEach((g, i) => { const a = at * (.12 + i * .03) + i * 2.1, gx = [260, 1340, 1180][i] + Math.cos(a) * [110, 150, 170][i], gy = [260, 205, 330][i] + Math.sin(a * 1.3) * 24, f = Math.sin(at * .7 + i) > .3 ? Math.sin(at * 8 + i) : .25;
        g.set(gx, gy, .6 - i * .1, f, Math.sin(a) > 0 ? -1 : 1, Math.cos(a) * 5); op(g, prog(lt, LE(8) - 1, 2)); });
      /* the modern ship sails calmly past */
      const mk = prog(lt, LT(9) - 1.1, DUR - (LT(9) - 1.1), x => 1 - Math.pow(1 - x, 1.7));
      tf(mShip, lerp(-400, 1150, mk), 562 + Math.sin(at * .7) * 1.2, Math.sin(at * .5) * .3, .6);
      const bl = frac(at / 1.3) < .14 ? 1 : 0; op(msLight, .35 + .65 * bl); op(msGlow, bl);
      tf(msRadar, 110, -238, 0, Math.cos(at * 2.4), 1); msRadar.setAttribute('d', 'M-14,0 H14');
      msWake.setAttribute('stroke-dashoffset', f2(at * 40)); tf(msBow, 0, 0, 0, 1, 1 + .15 * Math.sin(at * 3));
      /* end card (tail only) */
      op(card, prog(lt, LE(9) + .7, 1.6));
    } else op(card, 0);
  };
}});
