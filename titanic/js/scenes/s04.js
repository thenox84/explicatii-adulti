"use strict";
/* SCENE 4 — "A little bump"
   Beat sheet (lt in s; every beat is anchored to cue(j), values below are for the current recording)
   SHOT A  first-class smoking room ...................................... 0.0 – 7.2
     0.0–2.0   iris opens on the card table: cigars smoke, fire flickers, a steward far off down the corridor
     L0 2.00–7.06  2.0–3.8 push-in on the foreground whisky: one tiny ripple, chandeliers tremble; nobody looks up
                   3.8–5.0 pan right to the far corridor; 5.2 the steward drops a spoon → "tink" mark at 5.4;
                   5.5–6.3 players glance up, the newspaper dips; 6.4 straight back to the game, a card is slapped down
     7.0–7.4  whip pan →
   SHOT B  forward well deck, night ...................................... 7.2 – 11.4
     L1 7.61–11.19  7.4–9.1 ice tumbles over the bulwark as the iceberg slides past whistling; passengers jump back, then grin
                    9.6 kick → 10.0 the boy chips it → 10.4 Mitzi (in her cap) heads it → 10.7 between the bollards,
                    the keeper dives the wrong way → cheers
     11.3–11.8 tilt down "below the waterline" →
   SHOT C  bow cutaway .................................................... 11.4 – 17.2
     L2 11.74–17.19  12.9–15.0 an ice spur scrapes along the bow: a dotted line of splits and popped rivets,
                    a jet spurts into compartment 1, 2 … 6 in turn; 14.6–17.2 water rises in 1–6, plates turn red
   SHOT D  the flooded hold ............................................... 17.2 – end
     17.2–18.6 the cutaway turns into a blueprint pinned in the hold; pull back: Captain (tea), Owner, Shipbuilder
               wading in through ankle-deep water
     L3 17.74–22.11  the compartments become an ice-cube tray; "four": 1–4 glow; "not five": ✗ on 5, the tray tips;
                     "six": ✗ on 6, water spills over cube to cube 6→7→8 (9 cubes)
     L4 22.46–24.06  the Owner snatches the pencil and frantically rubs out compartment 5 (crumbs, the blue vanishes)
     L5 24.41–28.05  the Shipbuilder gently takes the pencil back; 5 quietly fills with blue again; he writes 6 > 4
     28.1–29.3 pan to the Captain
     L6 29.60–30.41  cap off, one nod, cap back on; a single ripple crosses his tea
     L7 30.76–33.04  the Owner pulls out the PRACTICALLY wad, licks it, slaps it on the blueprint; it peels and droops,
                     he catches it and tucks it back
     L8 33.59–37.75  the Shipbuilder rubs out 6 > 4 (33.4–34.5), it pops back bigger and bolder (34.6); the Owner pushes two
                     beads off his abacus twice, they snap back ("clack!" 35.7, 36.8); an underline he did not draw writes
                     itself (36.3, 36.8); he stares at his pencil; tail 37.8–39.35: push in on the sum, iris closes */

SCENE(4, { build(world, cue) {
  const L = cue, Le = cue.e, DUR = cue.d;
  const tAB = L(1) - .42, tBC = L(2) - .45, tCD = L(3) - .55;
  const MOON = '#A8C6FF';
  const P = (p, d, fill, ex) => E('path', Object.assign({ d, fill: fill || 'none' }, ex || {}), p);
  const R_ = (p, x, y, w, h, fill, ex) => E('rect', Object.assign({ x, y, width: w, height: h, fill }, ex || {}), p);
  const sa = (n, k, v) => { if (n['_' + k] !== v) { n['_' + k] = v; n.setAttribute(k, v); } };
  /* rivet rows as cheap pattern fills (a dash-array of round caps rasterises very slowly) */
  const rivets = (p, d, r, col, step, o = 1) => {
    const re = /M(-?[\d.]+),(-?[\d.]+)\s*([HV])(-?[\d.]+)/g; let m;
    while ((m = re.exec(d))) { const x = +m[1], y = +m[2], v = m[3] === 'V', e = +m[4], id = uid('rv');
      const w = v ? r * 2 + 2 : step, h = v ? step : r * 2 + 2;
      const pt = E('pattern', { id, patternUnits: 'userSpaceOnUse', width: w, height: h, x: v ? x - r - 1 : x, y: v ? y : y - r - 1 }, DEFS);
      E('circle', { cx: w / 2, cy: h / 2, r, fill: col, 'fill-opacity': o }, pt);
      if (v) R_(p, x - r - 1, Math.min(y, e), r * 2 + 2, Math.abs(e - y), `url(#${id})`); else R_(p, Math.min(x, e), y - r - 1, Math.abs(e - x), r * 2 + 2, `url(#${id})`); } };
  const camT = (g, x, y, z) => sa(g, 'transform', `translate(800,450) scale(${f2(z * 1000) / 1000}) translate(${f2(-x)},${f2(-y)})`);
  const camAt = (t, K) => { const v = keyed(t, K.map(k => [k[0], k.slice(1)])); return v; };
  /* parallax layer: depth f (>1 = nearer than the set) */
  const camPar = (g, c, f) => sa(g, 'transform', `translate(800,450) scale(${f2(c[2] * 1000) / 1000}) translate(${f2(-(c[0] * f + 800 * (1 - f)))},${f2(-(c[1] * f + 450 * (1 - f)))})`);
  const breath = (at, k = 0) => Math.sin(at * 1.7 + k) * 1.4;
  /* smoke / vapour puffs rising from (x,y) */
  const puffs = (p, x, y, n, o = {}) => {
    const g = G(p), ps = [];
    for (let i = 0; i < n; i++) ps.push(E('ellipse', { rx: 6, ry: 5, fill: o.col || '#DCD6CC' }, g));
    g.anim = (at, k = 1, x2, y2) => ps.forEach((e, i) => {
      const ph = ((at * (o.sp || .2)) + i / n + (o.ph || 0)) % 1, r = (o.r0 || 4) + ph * (o.r1 || 24);
      const X = (x2 != null ? x2 : x), Y = (y2 != null ? y2 : y);
      e.setAttribute('cx', f2(X + Math.sin(ph * 5 + i * 2.1 + at * .6) * (o.wx || 12) * ph + (o.dx || 0) * ph));
      e.setAttribute('cy', f2(Y - ph * (o.h || 140)));
      e.setAttribute('rx', f2(r)); e.setAttribute('ry', f2(r * .8));
      e.setAttribute('opacity', f2(k * (o.a || .3) * Math.sin(Math.PI * Math.min(1, ph * 1.1))));
    });
    return g;
  };
  /* walking: feet + bob for a stride phase */
  const walkSt = (ph, amp = 1) => { const s = Math.sin(ph), c = Math.cos(ph);
    return { fL: [-22 + s * 15 * amp, -Math.max(0, c) * 16 * amp], fR: [22 - s * 15 * amp, -Math.max(0, -c) * 16 * amp], bob: -Math.abs(c) * 4 * amp }; };
  const mkPencil = p => { const g = G(p);
    R_(g, -30, -4, 62, 8, '#F2C14E', { rx: 1.5 }); R_(g, -30, -4, 62, 2.6, '#FFE08A'); R_(g, -30, 1.6, 62, 2.4, '#D9A12E');
    P(g, 'M32,-4 L46,0 L32,4 Z', '#E9CFA0'); P(g, 'M42,-1.3 L46,0 L42,1.3 Z', '#333');
    R_(g, -36, -4.4, 6.5, 8.8, '#B9BCC6'); R_(g, -45, -4, 9.5, 8, '#E88A9A', { rx: 2.8 });
    return g; };
  /* sound mark: little radiating ticks (+ optional word) */
  const soundMark = (p, word, size = 22) => { const g = N(p, 0, 0);
    P(g, 'M-14,-10 l-10,-8 M0,-16 v-12 M14,-10 l10,-8 M-18,4 h-12 M18,4 h12', 'none', { stroke: '#FFF4D0', 'stroke-width': 3, 'stroke-linecap': 'round' });
    if (word) TX(g, 0, -34, word, size, '#FFF4D0', { a: 'middle', w: 800, it: true });
    return g; };

  /* =====================================================================
     SHOT A — the first-class smoking room
     ===================================================================== */
  const shotA = G(world), camA = G(shotA);
  const animA = [];
  /* ceiling, beams, gilded frieze */
  [[-260, 230, '#A89070'], [-30, 70, '#C4B28C'], [40, 70, '#D3C29C']].forEach(([y, h, c]) => R_(camA, -300, y, 2200, h, c));
  { let d = '', d2 = ''; for (let x = -300; x < 1900; x += 170) { d += `M${x},-260 h26 v370 h-26 Z`; d2 += `M${x + 40},-240 h104 v80 h-104 Z M${x + 40},-140 h104 v80 h-104 Z M${x + 40},-40 h104 v70 h-104 Z`; }
    P(camA, d2, '#D3C19C'); P(camA, d, '#6B4A2C'); }
  R_(camA, -300, 92, 2200, 30, '#A87A36'); R_(camA, -300, 92, 2200, 5, '#E2BE62');
  { let d = ''; for (let x = -290; x < 1900; x += 22) d += `M${x},107 m-5,0 a5,6 0 1 0 10,0 a5,6 0 1 0 -10,0 `; P(camA, d, '#E7C773', { 'fill-opacity': .8 }); }
  /* panelled mahogany wall */
  [[122, 48, '#30190F'], [170, 150, '#3A2116'], [320, 148, '#40251A'], [468, 184, '#38200F']].forEach(([y, h, c]) => R_(camA, -300, y, 2200, h, c));
  R_(camA, -300, 122, 2200, 14, '#1E0E08'); R_(camA, -300, 136, 2200, 12, '#26130B');
  { let d = '', di = '', pearl = '';
    for (let x = -280; x < 1900; x += 128) { d += `M${x},486 h112 v140 h-112 Z`; di += `M${x + 10},496 h92 v120 h-92 Z`;
      pearl += `M${x + 56},540 l7,14 l-7,14 l-7,-14 Z M${x + 24},556 m-3,0 a3,3 0 1 0 6,0 a3,3 0 1 0 -6,0 M${x + 88},556 m-3,0 a3,3 0 1 0 6,0 a3,3 0 1 0 -6,0 `; }
    P(camA, d, '#4E2D1D', { stroke: '#6E4329', 'stroke-width': 3 }); P(camA, di, 'none', { stroke: '#2A160E', 'stroke-width': 2 }); P(camA, pearl, '#A9927E');
    let up = '', upi = ''; for (let x = -280; x < 1900; x += 128) { up += `M${x},170 h112 v290 h-112 Z`; upi += `M${x + 14},${184} h84 v262 h-84 Z`; }
    P(camA, up, 'none', { stroke: '#5A3422', 'stroke-width': 3 }); P(camA, upi, 'none', { stroke: '#22110A', 'stroke-width': 1.6, 'stroke-opacity': .7 }); }
  R_(camA, -300, 468, 2200, 16, '#6E4329'); R_(camA, -300, 468, 2200, 4, '#9A6A3E');
  R_(camA, -300, 626, 2200, 26, '#24120B');
  /* stained-glass windows (lit from behind) */
  const sglass = (cx, y0 = 158, w = 176, h = 300) => {
    const x0 = cx - w / 2, r = w / 2;
    const shape = `M${x0},${y0 + h} V${y0 + r} A${r},${r} 0 0 1 ${x0 + w},${y0 + r} V${y0 + h} Z`;
    P(camA, `M${x0 - 18},${y0 + h + 16} V${y0 + r} A${r + 18},${r + 18} 0 0 1 ${x0 + w + 18},${y0 + r} V${y0 + h + 16} Z`, '#1F0F08');
    P(camA, shape, '#3A281C');
    /* panes (no clip-path: only the panes that fit inside the arch are drawn; lead = the dark base showing between them) */
    const gl = G(camA);
    const cols = ['#F7D27A', '#9FCB8E', '#86AEDD', '#E08A72', '#FFF0C4'], dd = cols.map(() => '');
    const inside = (px, py) => py >= y0 + r || Math.hypot(px - cx, py - (y0 + r)) <= r - 1;
    for (let yy = y0; yy < y0 + h; yy += 28) for (let xx = x0; xx < x0 + w - 1; xx += 29.4) {
      const a = xx + 1.5, b = yy + 1.5, c = xx + 27.9, e = Math.min(yy + 26.5, y0 + h - 1.5);
      if (!inside(a, b) || !inside(c, b)) continue;
      const k = Math.floor(hash(xx * .37 + yy * 1.91 + cx) * 5); dd[k] += `M${f2(a)},${f2(b)} H${f2(c)} V${f2(e)} H${f2(a)} Z`; }
    dd.forEach((d, k) => d && P(gl, d, cols[k]));
    /* the arch crown: two curved panes */
    P(gl, `M${x0 + 4},${y0 + r - 2} A${r - 4},${r - 4} 0 0 1 ${cx - 2},${y0 + 4} V${y0 + r - 2} Z`, '#FFF0C4');
    P(gl, `M${cx + 2},${y0 + 4} A${r - 4},${r - 4} 0 0 1 ${x0 + w - 4},${y0 + r - 2} H${cx + 2} Z`, '#F7D27A');
    { let d = ''; [-62, -28, 28, 62].forEach(a => { const t = (a - 90) * Math.PI / 180; d += `M${cx},${y0 + r} L${f2(cx + Math.cos(t) * r)},${f2(y0 + r + Math.sin(t) * r)}`; });
      P(gl, d, 'none', { stroke: '#3A281C', 'stroke-width': 3 }); P(gl, `M${x0 + 4},${y0 + r} A${r * .55},${r * .55} 0 0 1 ${x0 + w - 4},${y0 + r}`.replace(`A${r * .55}`, `M${cx - r * .55},${y0 + r} A${r * .55}`).replace(`M${x0 + 4},${y0 + r} `, '').replace(`${x0 + w - 4},${y0 + r}`, `${cx + r * .55},${y0 + r}`), 'none', { stroke: '#3A281C', 'stroke-width': 3 });
      E('circle', { cx: cx - 30, cy: y0 + r - 50, r: 10, fill: '#86AEDD', stroke: '#3A281C', 'stroke-width': 2.5 }, gl); E('circle', { cx: cx + 30, cy: y0 + r - 50, r: 10, fill: '#E08A72', stroke: '#3A281C', 'stroke-width': 2.5 }, gl); }

    E('circle', { cx, cy: y0 + r + 36, r: 38, fill: '#FBE3A0', stroke: '#3A281C', 'stroke-width': 4 }, gl);
    P(gl, `M${cx},${y0 + r + 6} l9,22 l23,2 l-17,15 l6,23 l-21,-12 l-21,12 l6,-23 l-17,-15 l23,-2 Z`, '#D9763A', { stroke: '#3A281C', 'stroke-width': 2 });
    P(camA, shape, 'none', { stroke: '#120804', 'stroke-width': 6 });
    R_(camA, x0 - 26, y0 + h + 10, w + 52, 14, '#5A3422', { rx: 3 }); R_(camA, x0 - 26, y0 + h + 10, w + 52, 4, '#8A5A36');
  };
  sglass(232); sglass(1268);
  /* pilasters with gilded capitals */
  [440, 1060, 1405, 30].forEach(x => { R_(camA, x - 22, 128, 44, 500, '#5C3524'); R_(camA, x - 22, 128, 8, 500, '#7A4A30'); R_(camA, x + 14, 128, 8, 500, '#3A1F14');
    R_(camA, x - 28, 128, 56, 22, '#B88E3A'); R_(camA, x - 28, 600, 56, 26, '#3A1F14'); });
  /* fireplace + painting */
  R_(camA, 618, 128, 364, 500, '#4A2A1B'); R_(camA, 618, 128, 10, 500, '#6A3E28'); R_(camA, 972, 128, 10, 500, '#2C170F');
  R_(camA, 660, 168, 280, 214, '#B88E3A', { rx: 4 }); R_(camA, 670, 178, 260, 194, '#E2BE62');
  { const pg = G(camA); R_(pg, 680, 188, 240, 174, lgrad([[0, '#F1D29A'], [.55, '#C9C8B8'], [.56, '#5C7F95'], [1, '#3E5A6E']]));
    P(pg, 'M680,286 Q720,268 760,282 Q790,262 830,280 L830,286 Z', '#7A8C78'); P(pg, 'M860,290 l6,-40 l6,40 Z M858,250 h16 v-6 h-16 Z', '#E9E2CF');
    P(pg, 'M736,318 h70 l-10,14 h-52 Z', '#3A2A20'); P(pg, 'M770,318 V262 M770,268 L746,312 H770 M770,270 L800,312 H770', '#F4ECD8', { stroke: '#5A4A3A', 'stroke-width': 1.4 });
    P(pg, 'M700,340 q20,-6 40,0 t40,0 t40,0 t40,0 t40,0', 'none', { stroke: '#A9C4D2', 'stroke-width': 2, 'stroke-opacity': .6 }); }
  R_(camA, 650, 432, 300, 16, '#E8E0D0', { rx: 3 }); R_(camA, 660, 446, 280, 6, '#000', { 'fill-opacity': .25 });
  R_(camA, 686, 452, 228, 176, '#D9D0BE'); R_(camA, 686, 452, 228, 10, '#EEE6D6');
  P(camA, 'M730,628 V520 Q730,494 800,494 Q870,494 870,520 V628 Z', '#170C08');
  const fireG = G(camA);
  const flames = [P(fireG, '', '#FF8A2A'), P(fireG, '', '#FFC24A'), P(fireG, '', '#FFF0A0')];
  R_(camA, 742, 606, 116, 10, '#2A2A2E', { rx: 3 }); P(camA, 'M752,616 v12 M848,616 v12', 'none', { stroke: '#2A2A2E', 'stroke-width': 4 });
  const fireGlow = itrGlow(camA, 800, 620, 230, 70, '#FF9A3A', .4);
  R_(camA, 700, 620, 200, 8, '#C9A045', { rx: 3 });
  /* mantel clock + vases */
  R_(camA, 784, 404, 32, 30, '#B88E3A', { rx: 6 }); E('circle', { cx: 800, cy: 416, r: 10, fill: '#FBF3DE' }, camA); P(camA, 'M800,416 V409 M800,416 L805,419', 'none', { stroke: '#333', 'stroke-width': 1.6 });
  [690, 910].forEach(x => { P(camA, `M${x - 10},432 Q${x - 14},412 ${x - 4},400 h8 Q${x + 14},412 ${x + 10},432 Z`, '#2E5E8E'); R_(camA, x - 6, 396, 12, 6, '#C9A045'); });
  /* sconces + chandeliers */
  /* sconces and chandeliers without their radial glows (big gradients rasterise slowly while the camera moves) */
  const noGlow = g => g.querySelectorAll('ellipse').forEach(e => { if (/url\(#rg/.test(e.getAttribute('fill') || '')) e.remove(); });
  [[548, 300], [1152, 300], [120, 300]].forEach(([x, y]) => noGlow(itrSconce(camA, x, y, 1.2)));
  const chandA = [[470, 122], [1135, 122]].map(([x, y], i) => { const w = G(camA); const c = itrChandelier(w, x, y, 46, .9, i + 4); noGlow(c); return { w, c }; });
  /* far doorway with a long corridor (the far-off steward) */
  { const dx0 = 1450, dx1 = 1592, top = 230, vb = [1497, 1545, 420, 515];
    P(camA, `M${dx0 - 16},640 V${top + 70} Q${dx0 - 16},${top - 16} ${(dx0 + dx1) / 2},${top - 16} Q${dx1 + 16},${top - 16} ${dx1 + 16},${top + 70} V640 Z`, '#1F0F08');
    const cor = G(camA, { 'clip-path': itrClip(`M${dx0},640 V${top + 70} Q${dx0},${top} ${(dx0 + dx1) / 2},${top} Q${dx1},${top} ${dx1},${top + 70} V640 Z`) });
    R_(cor, dx0, top - 10, dx1 - dx0, 420, '#C9A87A');
    P(cor, `M${dx0},${top} L${vb[0]},${vb[2]} H${vb[1]} L${dx1},${top} Z`, '#E8D7B4');
    P(cor, `M${dx0},640 L${vb[0]},${vb[3]} H${vb[1]} L${dx1},640 Z`, '#8E3B32');
    P(cor, `M${dx0},${top} L${vb[0]},${vb[2]} V${vb[3]} L${dx0},640 Z`, '#B48A5A');
    P(cor, `M${dx1},${top} L${vb[1]},${vb[2]} V${vb[3]} L${dx1},640 Z`, '#9E7448');
    R_(cor, vb[0], vb[2], vb[1] - vb[0], vb[3] - vb[2], '#F2E2C0');
    P(cor, `M${vb[0] + 14},${vb[3]} V${vb[2] + 22} H${vb[1] - 14} V${vb[3]} Z`, '#7A5034');
    P(cor, `M${dx0 + 12},600 L${vb[0] + 4},${vb[3] - 6} M${dx0 + 18},560 L${vb[0] + 6},${vb[3] - 16} M${dx1 - 12},600 L${vb[1] - 4},${vb[3] - 6}`, 'none', { stroke: '#6E4A2E', 'stroke-width': 2, 'stroke-opacity': .6 });
    [[1521, 300, 14], [1521, 370, 9], [1521, 404, 6]].forEach(([x, y, r]) => itrGlow(cor, x, y, r * 3, r * 2, '#FFF0C0', .7));
    P(cor, `M${dx0},${top} L${vb[0]},${vb[2]} L${vb[0]},${vb[3]} L${dx0},640 Z`, lgrad([[0, '#000', .25], [1, '#000', 0]], 0, 0, 1, 0));
  }
  const steward = Person(camA, { lite: true, coat: 'suit', jacket: '#F2EFE6', shirt: '#FFFFFF', tie: '#1D1E29', pants: '#22232E', hair: '#3A2A20', seed: 41 });
  const sTray = G(steward.propR); E('ellipse', { cx: 18, cy: -6, rx: 30, ry: 6, fill: '#D9DDE6', stroke: '#9AA0AE', 'stroke-width': 2 }, sTray);
  E('rect', { x: 8, y: -22, width: 9, height: 16, rx: 2, fill: '#F2F6FF', 'fill-opacity': .9 }, sTray); E('rect', { x: 22, y: -18, width: 12, height: 12, rx: 3, fill: '#fff' }, sTray);
  const spoon = N(camA, 0, 0); P(spoon, 'M-6,0 H5', 'none', { stroke: '#E8ECF4', 'stroke-width': 1.8, 'stroke-linecap': 'round' }); E('ellipse', { cx: 6.5, cy: 0, rx: 3, ry: 2, fill: '#E8ECF4' }, spoon);
  const tink = soundMark(camA, 'tink', 30);
  tink.querySelectorAll('text, path').forEach(n => { n.setAttribute('stroke', '#2A160E'); n.setAttribute('stroke-width', n.tagName === 'text' ? 6 : 7); n.setAttribute('paint-order', 'stroke'); n.setAttribute('stroke-linejoin', 'round'); });
  { const pth = tink.querySelector('path'); const p2 = pth.cloneNode(); p2.removeAttribute('paint-order'); p2.setAttribute('stroke', '#FFF4D0'); p2.setAttribute('stroke-width', 3); tink.appendChild(p2); }
  const tinkStar = N(camA, 0, 0); P(tinkStar, 'M0,-12 L3,-3 L12,0 L3,3 L0,12 L-3,3 L-12,0 L-3,-3 Z', '#FFFDF0');
  /* floor: red/cream linoleum diamonds + oriental rug */
  R_(camA, -300, 650, 2200, 500, '#6A2A22');
  { const mkTile = (sc, y0) => { const id = uid('fl'), w = 60 * sc, h = 26 * sc;
      const pt = E('pattern', { id, patternUnits: 'userSpaceOnUse', width: w, height: h, x: 0, y: y0 }, DEFS);
      R_(pt, 0, 0, w, h, '#6A2A22'); P(pt, `M${w / 2},0 L${w},${h / 2} L${w / 2},${h} L0,${h / 2} Z`, mix('#6A2A22', '#E9DCC0', .16), { stroke: mix('#6A2A22', '#2E120C', .5), 'stroke-width': 1.2 });
      return `url(#${id})`; };
    [[650, 46, .7], [696, 70, .85], [766, 110, 1.05], [876, 200, 1.35]].forEach(([y, h, sc]) => R_(camA, -300, y, 2200, h, mkTile(sc, y))); }
  R_(camA, -300, 650, 2200, 50, lgrad([[0, '#000', .45], [1, '#000', 0]]));
  P(camA, 'M420,724 L1180,724 L1250,830 L350,830 Z', '#5A1E28'); P(camA, 'M436,732 L1164,732 L1226,822 L374,822 Z', 'none', { stroke: '#C9A045', 'stroke-width': 4 });
  P(camA, 'M470,746 L1130,746 L1180,808 L420,808 Z', 'none', { stroke: '#2E5E6E', 'stroke-width': 7, 'stroke-dasharray': '14 10' });
  /* palm */
  { const pl = itrPalm(camA, 1338, 655, .95, 7, '#8E6A2E'); animA.push(pl.anim); }
  /* background card table (mid-ground right) */
  const bgPl = [castPassenger(camA, 0, { lite: true, hat: false }), castPassenger(camA, 3, { lite: true })];
  const bgTable = G(camA);
  { P(bgTable, 'M1110,606 Q1108,640 1104,664 H1294 Q1290,640 1288,606 Z', '#2C5A3C'); P(bgTable, 'M1130,612 Q1128,640 1126,662 M1170,614 v48 M1230,614 v48 M1270,612 Q1272,640 1274,662', 'none', { stroke: '#1E4A2E', 'stroke-width': 3 });
    E('ellipse', { cx: 1199, cy: 606, rx: 90, ry: 13, fill: '#3A7A50', stroke: '#4A2A1B', 'stroke-width': 4 }, bgTable); }
  const bgSmoke = puffs(camA, 1180, 560, 6, { sp: .12, h: 120, r1: 26, a: .16 });
  /* newspaper gentleman in a wingback */
  const wing = (p, x, y, s, col = '#2F4A3A') => { const g = N(p, x, y, s);
    P(g, 'M-70,-10 V-196 Q-70,-226 -40,-228 H40 Q70,-226 70,-196 V-10 Z', col);
    P(g, 'M-70,-196 Q-92,-200 -90,-170 V-120 Q-80,-110 -70,-118 Z M70,-196 Q92,-200 90,-170 V-120 Q80,-110 70,-118 Z', shade(col, -.15));
    P(g, cstDots([[-40, -190, 2.5], [0, -196, 2.5], [40, -190, 2.5], [-20, -160, 2.5], [20, -160, 2.5], [-40, -130, 2.5], [0, -130, 2.5], [40, -130, 2.5]]), shade(col, -.35));
    return g; };
  const wingFront = (p, x, y, s, col = '#2F4A3A') => { const g = N(p, x, y, s);
    P(g, 'M-92,-120 Q-96,-136 -76,-136 H-56 Q-46,-136 -48,-120 V-6 H-92 Z M92,-120 Q96,-136 76,-136 H56 Q46,-136 48,-120 V-6 H92 Z', shade(col, .06));
    R_(g, -50, -64, 100, 54, shade(col, -.08), { rx: 8 }); P(g, 'M-86,-6 v14 M86,-6 v14 M-40,-6 v12 M40,-6 v12', 'none', { stroke: '#1E120C', 'stroke-width': 6, 'stroke-linecap': 'round' });
    P(g, 'M-88,-118 Q-70,-126 -52,-118 M88,-118 Q70,-126 52,-118', 'none', { stroke: '#fff', 'stroke-opacity': .15, 'stroke-width': 4 });
    return g; };
  wing(camA, 380, 694, .82);
  const reader = Person(camA, { coat: 'suit', jacket: '#3E3A52', hairStyle: 'bald', hair: '#9A8A7A', old: true, mustache: 'walrus', mustacheColor: '#E9E6DF', brows: 'bushy', browColor: '#D9D5CC', seed: 77, nose: 'round' });
  const paper = G(reader.up); reader.up.insertBefore(paper, reader.handL);
  { R_(paper, -78, -62, 156, 108, '#EFE8D6', { rx: 2 }); R_(paper, -78, -62, 156, 108, 'none', { stroke: '#BDB49C', 'stroke-width': 1.5 }); P(paper, 'M0,-62 V46', 'none', { stroke: '#CFC6AE', 'stroke-width': 2 });
    R_(paper, -70, -54, 140, 14, '#3A3A40', { 'fill-opacity': .75 });
    let d = ''; for (let c = 0; c < 4; c++) for (let r = 0; r < 8; r++) d += `M${-70 + c * 36},${-30 + r * 9} h${28 - (r % 3) * 3}`; P(paper, d, 'none', { stroke: '#7A766C', 'stroke-width': 2.4 });
    R_(paper, -66, -28, 30, 24, '#9A968C'); }
  wingFront(camA, 380, 694, .82);
  /* card players (behind the table) */
  const plDefs = [
    { x: 585, o: { coat: 'tailcoat', hairStyle: 'parted', hair: '#2A1E18', mustache: 'handlebar', chain: true, skin: '#F2CAA6', seed: 51 } },
    { x: 735, o: { coat: 'suit', jacket: '#5E2A36', shirt: '#F4EFE4', tie: '#C9A045', hairStyle: 'bald', hair: '#8A7A6A', mustache: 'walrus', mustacheColor: '#D9D5CC', old: true, glasses: true, belly: .7, seed: 52 } },
    { x: 885, o: { coat: 'suit', jacket: '#2E4A3E', shirt: '#F4EFE4', tie: '#8E2E3A', hairStyle: 'side', hair: '#B5562A', beard: 'full', beardColor: '#A84E28', rosy: true, seed: 53 } },
    { x: 1035, o: { coat: 'tailcoat', hairStyle: 'curly', hair: '#3A2A20', mustache: true, jaw: 'long', skin: '#E8B48C', seed: 54 } }];
  const chairsA = G(camA);
  plDefs.forEach(d => { const g = N(chairsA, d.x, 772, .95);
    P(g, 'M-66,-110 V-226 Q-66,-252 -36,-254 H36 Q66,-252 66,-226 V-110 Z', '#5A2A22'); P(g, 'M-66,-226 Q-66,-252 -36,-254 H36 Q66,-252 66,-226', 'none', { stroke: '#8E4A3A', 'stroke-width': 4 });
    P(g, cstDots([[-36, -230, 2.4], [0, -236, 2.4], [36, -230, 2.4], [-18, -206, 2.4], [18, -206, 2.4]]), '#3A140F'); });
  const players = plDefs.map(d => { const R = Person(camA, d.o); const fan = G(R.propR);
    for (let k = 0; k < 5; k++) { const c = G(fan); tf(c, 0, 0, -32 + k * 16); R_(c, -10, -44, 20, 30, '#FBF6EA', { rx: 2.5, stroke: '#9A8E78', 'stroke-width': 1 }); R_(c, -7, -41, 14, 24, k % 2 ? '#8E2E3A' : '#24406E', { rx: 1.5 }); }
    return { R, x: d.x, fan }; });
  /* cigar for player 3 */
  const cigar = G(players[3].R.head); P(cigar, 'M6,-271 L40,-262', 'none', { stroke: '#5A3A22', 'stroke-width': 6, 'stroke-linecap': 'round' }); E('circle', { cx: 41, cy: -262, r: 3.6, fill: '#FF7A2A' }, cigar);
  /* the card table */
  const tableA = G(camA);
  R_(tableA, 520, 712, 560, 52, '#3E2014', { rx: 8 }); R_(tableA, 520, 712, 560, 10, '#5C3422');
  P(tableA, 'M560,760 v120 M1040,760 v120 M700,760 v110 M900,760 v110', 'none', { stroke: '#2A140C', 'stroke-width': 12, 'stroke-linecap': 'round' });
  E('ellipse', { cx: 800, cy: 700, rx: 300, ry: 44, fill: '#4A2A1B' }, tableA);
  E('ellipse', { cx: 800, cy: 697, rx: 284, ry: 37, fill: '#2C6A46' }, tableA);
  E('ellipse', { cx: 790, cy: 692, rx: 240, ry: 24, fill: '#3A7E55', 'fill-opacity': .5 }, tableA);
  /* chips, discard pile, ashtray */
  [[640, 703, '#C8343F'], [652, 698, '#F4EFE4'], [960, 704, '#24406E'], [972, 699, '#C8343F']].forEach(([x, y, c]) => { for (let k = 0; k < 3; k++) { E('ellipse', { cx: x, cy: y - k * 4, rx: 11, ry: 4, fill: shade(c, -.2) }, tableA); E('ellipse', { cx: x, cy: y - k * 4 - 1.5, rx: 11, ry: 3.6, fill: c }, tableA); } });
  [[786, 694, -14], [800, 696, 8]].forEach(([x, y, r]) => { const c = G(tableA); tf(c, x, y, r, 1, .45); R_(c, -16, -22, 32, 44, '#FBF6EA', { rx: 3, stroke: '#9A8E78', 'stroke-width': 1.2 }); });
  const played = G(tableA); tf(played, 818, 690, 22, 1, .45); R_(played, -16, -22, 32, 44, '#FBF6EA', { rx: 3, stroke: '#9A8E78', 'stroke-width': 1.2 }); P(played, 'M0,-12 l7,10 l-7,10 l-7,-10 Z', '#C8343F');
  E('ellipse', { cx: 905, cy: 702, rx: 22, ry: 7, fill: '#B8B0A0' }, tableA); E('ellipse', { cx: 905, cy: 700, rx: 16, ry: 4.5, fill: '#5A5650' }, tableA);
  P(tableA, 'M896,698 L930,692', 'none', { stroke: '#6A4428', 'stroke-width': 5, 'stroke-linecap': 'round' }); E('circle', { cx: 931, cy: 692, r: 2.6, fill: '#FF8A3A' }, tableA);
  const slapMark = N(camA, 840, 668); P(slapMark, 'M-30,-8 l-14,-6 M-26,-20 l-8,-12 M30,-8 l14,-6 M26,-20 l8,-12', 'none', { stroke: '#FFF4D0', 'stroke-width': 3, 'stroke-linecap': 'round' });
  const smokeA = [null, puffs(camA, 1078, 520, 7, { sp: .12, h: 220, r1: 40, a: .16, wx: 18, dx: 40 })];

  /* foreground: side table with decanter and the whisky glass */
  const fgA = G(shotA);
  const glassG = G(fgA);
  { const g = glassG;
    P(g, 'M150,980 L170,740 H210 L230,980 Z', '#2A140C'); E('ellipse', { cx: 190, cy: 712, rx: 120, ry: 22, fill: '#3A1E12' }, g); E('ellipse', { cx: 190, cy: 708, rx: 116, ry: 19, fill: '#5C3422' }, g);
    E('ellipse', { cx: 180, cy: 704, rx: 90, ry: 10, fill: '#7A4A30', 'fill-opacity': .5 }, g);
    /* decanter */
    P(g, 'M110,706 Q84,700 86,660 Q88,628 104,618 V596 H122 V618 Q138,628 140,660 Q142,700 116,706 Z', '#E9C47A', { 'fill-opacity': .55, stroke: '#F4EEDC', 'stroke-width': 2.4 });
    P(g, 'M90,660 Q92,690 110,700 Q132,690 136,660 Z', '#B8742E', { 'fill-opacity': .8 });
    P(g, 'M96,640 Q94,670 104,690', 'none', { stroke: '#fff', 'stroke-opacity': .5, 'stroke-width': 4, 'stroke-linecap': 'round' }); R_(g, 101, 584, 24, 14, '#F4EEDC', { rx: 5, 'fill-opacity': .8 });
  }
  const glass = N(fgA, 252, 706, 1.4);
  P(glass, 'M-26,-62 L-22,0 H22 L26,-62 Z', '#DDE8F2', { 'fill-opacity': .32, stroke: '#F4F8FF', 'stroke-width': 2.4 });
  P(glass, 'M-24.4,-30 L-22,0 H22 L24.4,-30 Z', '#C07A2A', { 'fill-opacity': .85 });
  const whisky = E('ellipse', { cx: 0, cy: -30, rx: 24.4, ry: 7, fill: '#E8A452' }, glass);
  const wRing = E('ellipse', { cx: 0, cy: -30, rx: 4, ry: 1, fill: 'none', stroke: '#FFF4D8', 'stroke-width': 2.4 }, glass);
  const wRing2 = E('ellipse', { cx: 0, cy: -30, rx: 4, ry: 1, fill: 'none', stroke: '#FFF4D8', 'stroke-width': 1.6 }, glass);
  P(glass, 'M-20,-56 L-17,-6 M-12,-56 L-10,-6', 'none', { stroke: '#fff', 'stroke-opacity': .45, 'stroke-width': 3 });
  P(glass, 'M-22,-8 H22 M-22,-16 H22', 'none', { stroke: '#fff', 'stroke-opacity': .25, 'stroke-width': 1.5 });
  E('ellipse', { cx: 0, cy: -62, rx: 26, ry: 5, fill: 'none', stroke: '#F4F8FF', 'stroke-width': 2 }, glass);
  const shiverMk = N(fgA, 252, 650); P(shiverMk, 'M-40,-6 q-6,10 0,20 M40,-6 q6,10 0,20', 'none', { stroke: '#FFE7B8', 'stroke-width': 2.4, 'stroke-linecap': 'round' });
  /* foreground armchair edge (parallax) */
  const fgChair = G(shotA);
  P(fgChair, 'M1440,980 V760 Q1440,700 1500,690 H1720 V980 Z', '#22362A'); P(fgChair, 'M1440,760 Q1440,700 1500,690', 'none', { stroke: '#4A6A54', 'stroke-width': 6 });
  P(fgChair, cstDots([[1500, 740, 4], [1560, 728, 4], [1530, 790, 4], [1590, 780, 4]]), '#16241C');
  /* smoke haze under the ceiling */
  const hazeA = G(camA); const hz = [0, 1].map(i => E('ellipse', { cx: 0, cy: 0, rx: 520, ry: 70, fill: '#D8CFC2', 'fill-opacity': .09 + i * .03 }, hazeA));

  /* =====================================================================
     SHOT B — the forward well deck at night
     ===================================================================== */
  const shotB = G(world), camB = G(shotB);
  for (let k = 0; k < 12; k++) R_(camB, -500, -400 + k * 75, 2700, 76, mix(k < 6 ? '#03050F' : '#0B1330', k < 6 ? '#0B1330' : '#1B2A55', (k % 6) / 6 + (k < 6 ? 0 : 1 / 6) * 0));
  { const mw = G(camB); [[300, 40, 700, 120, -18, .06], [700, -60, 600, 90, -18, .05], [1200, -160, 500, 80, -18, .045]].forEach(([x, y, rx, ry, r, a]) => E('ellipse', { cx: x, cy: y, rx, ry, fill: '#C9D6FF', 'fill-opacity': a, transform: `rotate(${r} ${x} ${y})` }, mw)); }
  const starsB = itrStars(camB, -500, -400, 2700, 880, 260, 12, { pow: 1.4 });
  R_(camB, -500, 470, 2700, 300, lgrad([[0, '#0E1A3C'], [1, '#050A1A']]));
  P(camB, 'M-500,471 H2200', 'none', { stroke: '#3A4E86', 'stroke-width': 2, 'stroke-opacity': .7 });
  const bergB = Iceberg(camB, { foam: false });
  /* superstructure (left) */
  const supB = G(camB);
  R_(supB, -500, 60, 640, 640, '#B9C2D4'); R_(supB, 120, 60, 22, 640, '#8E98AE');
  R_(supB, -500, 60, 640, 22, '#DDE3EE'); R_(supB, -500, 300, 640, 12, '#9AA4BA');
  [[-380, 180], [-250, 180], [-120, 180], [10, 180], [-380, 400], [-250, 400], [-120, 400]].forEach(([x, y], i) => { E('circle', { cx: x, cy: y, r: 20, fill: '#6E7A92' }, supB); E('circle', { cx: x, cy: y, r: 15, fill: i % 3 ? '#FFD98A' : '#3A4466' }, supB); if (i % 3) itrGlow(supB, x, y, 40, 40, '#FFD98A', .35); });
  R_(supB, -30, 430, 110, 210, '#7A6A5A', { rx: 6 }); R_(supB, -20, 440, 90, 190, '#8E7C66', { rx: 4 }); E('circle', { cx: 56, cy: 540, r: 5, fill: '#C9A045' }, supB);
  P(supB, 'M140,520 L300,700 M150,520 L310,700', 'none', { stroke: '#D9DFEA', 'stroke-width': 5 });
  { let d = ''; for (let i = 0; i < 8; i++) d += `M${160 + i * 18},${540 + i * 20} h22`; P(supB, d, 'none', { stroke: '#8E98AE', 'stroke-width': 6 }); }
  /* bulwark + rail */
  R_(camB, 140, 520, 1300, 140, '#C6CEDD'); R_(camB, 140, 520, 1300, 10, '#EEF2F8'); R_(camB, 140, 640, 1300, 20, '#8E98AE');
  { let d = ''; for (let x = 160; x < 1440; x += 90) d += `M${x},530 V640`; P(camB, d, 'none', { stroke: '#9EA8BE', 'stroke-width': 6 }); rivets(camB, 'M150,600 H1440', 2, '#8E98AE', 12); }
  itrRail(camB, 140, 1440, 520, 46, '#E3E8F0', 22, 3);
  /* foremast + derrick */
  R_(camB, 1490, -400, 40, 980, lgrad([[0, '#C9A86A'], [.5, '#E8CC8A'], [1, '#9A7A44']], 0, 0, 1, 0));
  P(camB, 'M1505,250 L1020,470', 'none', { stroke: '#BFA06A', 'stroke-width': 14, 'stroke-linecap': 'round' }); P(camB, 'M1510,120 L1030,466 M1022,470 V600', 'none', { stroke: '#4A4E5E', 'stroke-width': 2.5 });
  P(camB, 'M1022,600 q-10,10 0,20 q10,6 4,-6', 'none', { stroke: '#4A4E5E', 'stroke-width': 3 });
  /* forecastle (right) */
  const fcB = G(camB);
  R_(fcB, 1440, 470, 900, 240, '#B9C2D4'); R_(fcB, 1440, 470, 900, 14, '#DDE3EE'); R_(fcB, 1440, 470, 18, 240, '#8E98AE');
  R_(fcB, 1600, 540, 90, 170, '#7A6A5A', { rx: 5 }); itrRail(fcB, 1440, 2300, 470, 42, '#E3E8F0', 22, 3);
  P(fcB, 'M1440,700 L1350,860 M1458,700 L1368,860', 'none', { stroke: '#D9DFEA', 'stroke-width': 5 }); { let d = ''; for (let i = 0; i < 7; i++) d += `M${1430 - i * 13},${720 + i * 22} h22`; P(fcB, d, 'none', { stroke: '#8E98AE', 'stroke-width': 6 }); }
  const lampB = [[60, 330], [1560, 520]].map(([x, y]) => { itrGlow(camB, x, y + 6, 120, 90, '#FFD98A', .35); E('circle', { cx: x, cy: y, r: 9, fill: '#FFF2C4' }, camB); return itrGlow(camB, x, y + 380, 260, 70, '#FFD98A', .16); });
  /* deck planks */
  R_(camB, -500, 660, 2700, 420, '#6E6656');
  { let d = ''; let y = 664, h = 9; while (y < 1080) { d += `M-500,${f2(y)} H2200`; y += h; h *= 1.12; } P(camB, d, 'none', { stroke: '#3E3A34', 'stroke-width': 1.6, 'stroke-opacity': .7 });
    let b = ''; for (let i = 0; i < 40; i++) { const y0 = 670 + hash(i) * 300; b += `M${f2(-400 + hash(i * 3) * 2500)},${f2(y0)} v${f2(4 + y0 * .01)}`; } P(camB, b, 'none', { stroke: '#3E3A34', 'stroke-width': 2, 'stroke-opacity': .5 }); }
  R_(camB, -500, 660, 2700, 140, lgrad([[0, '#000', .4], [1, '#000', 0]]));
  /* hatch */
  { const h = G(camB); R_(h, 230, 600, 420, 90, '#5A5244'); R_(h, 222, 592, 436, 14, '#7A7262', { rx: 3 }); P(h, 'M240,606 Q300,596 360,606 T480,606 T640,606 V690 H240 Z', '#4A5A4A');
    P(h, 'M300,606 V690 M380,606 V690 M460,606 V690 M540,606 V690', 'none', { stroke: '#3A4A3A', 'stroke-width': 3 }); }
  /* static ice bits lying around */
  const iceShape = (p, x, y, s, r = 0) => { const g = N(p, x, y, s, r);
    P(g, 'M-24,6 L-28,-8 L-14,-24 L6,-26 L24,-14 L28,4 L14,14 L-10,14 Z', '#E2F4FF', { stroke: '#9CC8E6', 'stroke-width': 2 });
    P(g, 'M-14,-24 L-2,-6 L24,-14 M-2,-6 L14,14', 'none', { stroke: '#A8D4F0', 'stroke-width': 2 }); P(g, 'M-20,-6 L-12,-18 L-4,-16 Z', '#FFFFFF', { 'fill-opacity': .8 }); return g; };
  const actB = N(camB, 0, -86);
  const iceB = G(actB);
  [[120, 790, .45, 20], [600, 772, .35, -30], [1060, 800, .4, 50], [1560, 824, .5, 10], [880, 900, .45, -12]].forEach(([x, y, s, r]) => iceShape(iceB, x, y, s, r));
  op(iceB, .85);
  const falling = [[-80, 360, 760, 780, .5, 0], [60, 320, 1150, 800, .45, .18], [-20, 280, 300, 800, .55, .36], [120, 300, 980, 790, .4, .5]].map(([x0, y0, x1, y1, s, d]) => ({ g: iceShape(actB, 0, 0, s), x0, y0, x1, y1, d, s }));
  /* bollards (goal posts) */
  const bollard = (x, y) => { const g = N(actB, x, y);
    E('ellipse', { cx: 0, cy: 0, rx: 52, ry: 12, fill: '#1A1C24' }, g);
    [-22, 22].forEach(dx => { R_(g, dx - 15, -52, 30, 52, '#2A2E3A'); R_(g, dx - 15, -52, 9, 52, '#4A5066'); E('ellipse', { cx: dx, cy: -52, rx: 18, ry: 6, fill: '#3E4458' }, g); E('ellipse', { cx: dx, cy: -56, rx: 13, ry: 4.5, fill: '#5A627A' }, g); });
    return g; };
  const ballTrail = P(actB, '', 'none', { stroke: '#E2F4FF', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-opacity': .35, 'stroke-dasharray': '6 12' });
  const ball = iceShape(actB, 0, 0, 1);
  const charsB = G(actB);
  const woman = castPassenger(charsB, 5, { rim: MOON });
  const kicker = castPassenger(charsB, 4, { rim: MOON });
  const boy = castPassenger(charsB, 6, { rim: MOON });
  const keeper = castPassenger(charsB, 8, { rim: MOON });
  const mitzi = Dog(charsB, {}); const capM = gagCap(mitzi.head);
  const bollL = bollard(1205, 842), bollR = bollard(1395, 842);
  const goalStars = N(actB, 1300, 700);
  [[-40, -30], [30, -50], [60, 10], [-60, 20]].forEach(([x, y], i) => P(goalStars, `M${x},${y - 10} L${x + 3},${y - 3} L${x + 10},${y} L${x + 3},${y + 3} L${x},${y + 10} L${x - 3},${y + 3} L${x - 10},${y} L${x - 3},${y - 3} Z`, i % 2 ? '#FFE7A8' : '#FFFFFF'));

  /* foreground: rope coil + ventilator (parallax) */
  const fgB = G(shotB);
  { const g = N(fgB, 70, 900); for (let k = 0; k < 4; k++) E('ellipse', { cx: 0, cy: -k * 9, rx: 120 - k * 6, ry: 26 - k, fill: 'none', stroke: k % 2 ? '#8E7A58' : '#A8926A', 'stroke-width': 10 }, g); }
  /* lifebuoys on the bulwark */
  [[700, 575], [1110, 575]].forEach(([x, y]) => { const g = N(camB, x, y); camB.insertBefore(g, actB);
 E('circle', { r: 30, fill: 'none', stroke: '#F1EDE4', 'stroke-width': 16 }, g);
    P(g, 'M0,-38 V-22 M0,22 V38 M-38,0 H-22 M22,0 H38', 'none', { stroke: '#C8343F', 'stroke-width': 13 }); E('circle', { r: 38, fill: 'none', stroke: '#B8B0A0', 'stroke-width': 2 }, g); });

  /* =====================================================================
     SHOT C + D — the bow cutaway (C) is drawn on a 1600×900 sheet "B" that
     sits on the blueprint board of the flooded hold (D); the camera starts
     zoomed in on the sheet and pulls back to reveal the hold.
     ===================================================================== */
  const shotD = G(world), camD = G(shotD);
  const BX0 = 490, BY0 = 300, BK = .3875;
  const SHY = -50, toW = (bx, by) => [BX0 + BK * bx, BY0 + BK * (by + SHY)];
  const FY = 905, SC = 1.3;
  const holdBg = G(camD);
  /* riveted steel wall */
  [[-300, 340, '#2E3638'], [40, 160, '#3A4646'], [200, 160, '#44524F'], [360, 160, '#4A5856'], [520, 160, '#465452'], [680, 160, '#404C4A'], [840, 260, '#3C4846']].forEach(([y, h, c]) => R_(holdBg, -500, y, 3000, h, c));
  { let d = ''; [40, 200, 360, 520, 680, 840].forEach(y => d += `M-500,${y} H2500`); for (let r = 0; r < 7; r++) for (let x = -500 + (r % 2) * 130; x < 2500; x += 260) d += `M${x},${-120 + r * 160} v160`;
    P(holdBg, d, 'none', { stroke: '#2A3234', 'stroke-width': 3 });
    let rv = ''; [46, 206, 366, 526, 686, 846].forEach(y => rv += `M-500,${y} H2500`); rivets(holdBg, rv, 2.6, '#7A8A86', 14, .8);
    let hl = ''; [43, 203, 363, 523, 683].forEach(y => hl += `M-500,${y + 4} H2500`); P(holdBg, hl, 'none', { stroke: '#6E7E7A', 'stroke-width': 1.5, 'stroke-opacity': .5 }); }
  /* ribs */
  [-230, 120, 1345, 1830, 2150].forEach(x => { R_(holdBg, x - 26, -300, 52, 1300, '#3A4644'); R_(holdBg, x - 26, -300, 10, 1300, '#5E6E6A'); R_(holdBg, x + 16, -300, 10, 1300, '#262E2E'); rivets(holdBg, `M${x},-300 V1000`, 2.4, '#7A8A86', 18, .7); });
  /* ceiling beams + pipes */
  R_(holdBg, -500, -300, 3000, 290, '#20282A'); { let d = ''; for (let x = -480; x < 2500; x += 220) d += `M${x},-300 h40 v300 h-40 Z`; P(holdBg, d, '#2E3839'); }
  R_(holdBg, -500, -12, 3000, 18, '#3A4644');
  const pipe = (y, r, col) => { R_(holdBg, -500, y - r, 3000, r * 2, col); R_(holdBg, -500, y - r + 3, 3000, r * .5, shade(col, .3), { 'fill-opacity': .6 });
    let d = ''; for (let x = -420; x < 2500; x += 300) d += `M${x},${y - r - 5} h16 v${r * 2 + 10} h-16 Z`; P(holdBg, d, shade(col, -.25)); };
  pipe(52, 13, '#8E5A3A'); pipe(96, 9, '#5A6E7A'); pipe(126, 6, '#9A8A5A');
  R_(holdBg, 1640, 90, 18, 700, '#5A6E7A'); E('circle', { cx: 1649, cy: 470, r: 28, fill: 'none', stroke: '#B8453E', 'stroke-width': 7 }, holdBg); P(holdBg, 'M1621,470 H1677 M1649,442 V498', 'none', { stroke: '#B8453E', 'stroke-width': 4 });
  /* watertight door (right) */
  { const g = G(holdBg); R_(g, 1700, 300, 300, 620, '#2C3436'); R_(g, 1730, 330, 240, 580, '#56645F', { rx: 18 }); R_(g, 1730, 330, 240, 580, 'none', { rx: 18, stroke: '#7A8A84', 'stroke-width': 5 });
    [[1750, 420], [1950, 420], [1750, 780], [1950, 780]].forEach(([x, y]) => { R_(g, x - 8, y - 22, 16, 44, '#8A9894', { rx: 5 }); });
    E('circle', { cx: 1850, cy: 600, r: 46, fill: 'none', stroke: '#9AA6A0', 'stroke-width': 8 }, g); P(g, 'M1804,600 H1896 M1850,554 V646', 'none', { stroke: '#9AA6A0', 'stroke-width': 5 }); }
  /* ladder (left) */
  { const g = G(holdBg); P(g, 'M-170,-20 V1000 M-90,-20 V1000', 'none', { stroke: '#8A9894', 'stroke-width': 8 }); let d = ''; for (let y = 20; y < 1000; y += 56) d += `M-170,${y} H-90`; P(g, d, 'none', { stroke: '#8A9894', 'stroke-width': 6 }); }
  /* stencil + caustics + leak */
  TX(holdBg, 1500, 270, 'KEEP CLEAR', 26, '#C9C2A6', { a: 'middle', w: 800, ls: 4, op: .45 });
  const caust = [0, 1, 2].map(i => P(holdBg, '', 'none', { stroke: '#BFEAE6', 'stroke-width': 3 - i * .6, 'stroke-opacity': .16 }));
  const lamps = [[300, -10, 80], [1440, -10, 70], [2000, -10, 70]].map(([x, y, l], i) => { const w = G(holdBg); const c = itrCageLamp(w, x, y, l, 1.3); return { w, c, x, y, ph: i * 1.7 }; });
  const leak = P(holdBg, '', 'none', { stroke: '#BFE6F2', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-opacity': .75, 'stroke-dasharray': '18 10' });
  const drips = [0, 1, 2, 3].map(() => P(holdBg, 'M0,-6 Q2.6,-1 2.6,1.4 A2.6,2.6 0 1 1 -2.6,1.4 Q-2.6,-1 0,-6 Z', '#CFEFFF', { 'fill-opacity': .85 }));
  /* the blueprint paper (shadow, sheet, grid, tacks) */
  const paperD = G(camD);
  R_(paperD, 478, 292, 662, 470, '#000', { 'fill-opacity': .3, rx: 4 });
  R_(paperD, 470, 282, 660, 235, '#285EA2'); R_(paperD, 470, 517, 660, 235, '#20528F');
  { const id = uid('gr'), pt = E('pattern', { id, patternUnits: 'userSpaceOnUse', width: 15.5, height: 15.5, x: 480, y: 292 }, DEFS);
    P(pt, 'M0,0 V15.5 M0,0 H15.5', 'none', { stroke: mix('#245898', '#CFE2FF', .16), 'stroke-width': .8 }); R_(paperD, 470, 282, 660, 470, `url(#${id})`); }

  R_(paperD, 476, 288, 648, 458, 'none', { stroke: '#E6F0FF', 'stroke-width': 1.6, 'stroke-opacity': .5 });
  P(paperD, 'M1130,724 L1102,752 L1130,752 Z', '#123A6E'); P(paperD, 'M488,676 H1112', 'none', { stroke: '#E6F0FF', 'stroke-width': 1.6, 'stroke-opacity': .5 });
  [[484, 296], [1116, 296], [484, 738], [1100, 734]].forEach(([x, y]) => { E('circle', { cx: x + 2, cy: y + 2, r: 7, fill: '#000', 'fill-opacity': .3 }, paperD); E('circle', { cx: x, cy: y, r: 7, fill: '#D9A93A' }, paperD); E('circle', { cx: x - 2, cy: y - 2, r: 2.6, fill: '#FFF1C0' }, paperD); });
  /* ---------- the sheet B ---------- */
  const sheet = G(camD); tf(sheet, BX0, BY0, 0, BK);
  const cut0 = G(sheet), cut = G(cut0);    /* coloured cutaway (shot C) */
  const bp0 = G(sheet), bp = G(bp0);       /* blueprint version (shot D) */
  tf(cut, 0, SHY); tf(bp, 0, SHY);
  /* geometry of the bow in sheet units */
  const BH = [1548, 1460, 1290, 1120, 950, 780, 610, 440, 270, 100, -70];   /* BH[0] = stem, cube i spans BH[i]..BH[i-1] */
  const TOP = 210, BOT = 720, KEEL = 780, WL = 300;
  const HULL = 'M-120,96 L1320,90 Q1500,82 1592,56 L1576,560 Q1566,742 1478,780 L-120,780 Z';
  const cx_ = i => (BH[i] + BH[i - 1]) / 2;
  /* sky / sea */
  for (let k = 0; k < 5; k++) R_(cut, -40, -40 + k * 68, 1700, 70, mix('#060A1C', '#18244A', k / 4));
  itrStars(cut, -40, -40, 1700, 330, 90, 21, { glint: false });
  for (let k = 0; k < 6; k++) R_(cut, -40, WL + k * 110, 1700, 112, mix('#14406A', '#04101E', k / 5));
  P(cut, `M-40,${WL} H1640`, 'none', { stroke: '#7FB8E8', 'stroke-width': 4, 'stroke-opacity': .7 });
  const bubbles = [0, 1, 2, 3, 4, 5, 6, 7].map(() => E('circle', { r: 5, fill: 'none', stroke: '#9FD6FF', 'stroke-width': 2, 'stroke-opacity': .5 }, cut));
  const fish = [0, 1].map(i => { const g = N(cut, 0, 0, 1); P(g, 'M-26,0 Q-6,-14 18,0 Q-6,14 -26,0 Z M18,0 L32,-10 L30,10 Z', i ? '#6E9AB8' : '#8EB4C8'); E('circle', { cx: -14, cy: -2, r: 2.6, fill: '#0A1426' }, g); return g; });
  /* the hull interior */
  const hullIn = G(cut, { 'clip-path': itrClip(HULL) });
  R_(hullIn, -140, 40, 1760, 760, '#2E2A2E');
  /* upper decks: cabins with lit portholes */
  R_(hullIn, -140, 96, 1760, 114, '#5A4E48'); { let d = '', w = ''; for (let x = -100; x < 1600; x += 120) { d += `M${x},100 v108`; if (x + 60 < 560 || x + 60 > 1600) w += `M${x + 60},150 m-11,0 a11,11 0 1 0 22,0 a11,11 0 1 0 -22,0 `; } P(hullIn, d, 'none', { stroke: '#3A322E', 'stroke-width': 5 }); P(hullIn, w, '#FFD98A'); }
  R_(hullIn, -140, 150, 1760, 6, '#3A322E');
  /* compartments */
  const compBg = ['#3A3E4A', '#4A4038', '#4C4436', '#4A4238', '#3E3434', '#3E3434', '#3A3232', '#363030', '#343030', '#323030'];
  for (let i = 1; i <= 10; i++) R_(hullIn, BH[i], TOP, BH[i - 1] - BH[i] + (i === 1 ? 60 : 0), BOT - TOP, compBg[i - 1]);
  P(hullIn, `M-140,420 H1600`, 'none', { stroke: '#2A2626', 'stroke-width': 6 });
  /* contents: chain locker, cargo, a motorcar, mail sacks, boilers */
  { const c = G(hullIn);
    P(c, 'M1500,230 V700 M1520,230 V690', 'none', { stroke: '#8A8E98', 'stroke-width': 7, 'stroke-dasharray': '9 5' });
    [[1310, 640, 70, 60], [1385, 650, 60, 50], [1330, 580, 50, 60], [1140, 640, 60, 60], [1215, 610, 64, 90], [1150, 360, 60, 50], [1320, 360, 60, 50]].forEach(([x, y, w, h], i) => { R_(c, x, y, w, h, i % 2 ? '#9A7448' : '#B88A54'); P(c, `M${x},${y} L${x + w},${y + h} M${x + w},${y} L${x},${y + h}`, 'none', { stroke: '#7A5634', 'stroke-width': 3 }); });
    /* the motorcar */
    P(c, 'M1150,560 h120 q16,0 18,-20 l-14,-30 h-70 l-20,24 h-34 q-10,4 -10,14 Z', '#8E2E2A'); R_(c, 1206, 512, 46, 22, '#CFE2F2', { 'fill-opacity': .7 });
    [1172, 1262].forEach(x => { E('circle', { cx: x, cy: 566, r: 16, fill: '#1E1E24' }, c); E('circle', { cx: x, cy: 566, r: 6, fill: '#B8B8C0' }, c); });
    /* mail sacks (hold 3) */
    [[975, 690], [1010, 680], [1050, 692], [990, 650], [1035, 646], [1080, 688]].forEach(([x, y]) => { E('ellipse', { cx: x, cy: y, rx: 22, ry: 26, fill: '#C9B48A' }, c); P(c, `M${x - 6},${y - 26} l6,-8 l6,8`, 'none', { stroke: '#7A6040', 'stroke-width': 3 }); });
    R_(c, 960, 330, 140, 60, '#6E5A44'); P(c, 'M960,350 h140 M960,370 h140 M995,330 v60 M1030,330 v60 M1065,330 v60', 'none', { stroke: '#4A3A2A', 'stroke-width': 3 });
    /* boiler rooms */
    for (let i = 5; i <= 10; i++) { const x0 = BH[i], x1 = BH[i - 1], w = x1 - x0;
      [.3, .72].forEach(f => { const bx = x0 + w * f; E('circle', { cx: bx, cy: 600, r: 58, fill: '#4A4A50' }, c); E('circle', { cx: bx, cy: 600, r: 50, fill: '#5E5E66' }, c);
        [-18, 0, 18].forEach(dx => R_(c, bx + dx - 7, 620, 14, 10, '#FF9A3A', { rx: 2 })); });
      R_(c, x0 + 6, 440, w - 12, 60, '#22201E'); P(c, `M${x0 + 10},480 h${w - 20}`, 'none', { stroke: '#3A3634', 'stroke-width': 4 }); }
  }
  /* double bottom + bulkheads + decks */
  R_(hullIn, -140, BOT, 1760, 80, '#24201E'); { let d = ''; for (let x = -120; x < 1600; x += 40) d += `M${x},${BOT} l20,60`; P(hullIn, d, 'none', { stroke: '#3A3432', 'stroke-width': 3 }); }
  R_(hullIn, -140, TOP - 8, 1760, 10, '#4A4442');
  for (let i = 1; i < 11; i++) { R_(hullIn, BH[i] - 7, TOP - 4, 14, BOT - TOP + 4, '#6A6266'); R_(hullIn, BH[i] - 7, TOP - 4, 4, BOT - TOP + 4, '#8A8286'); }
  /* water in compartments (coloured) */
  const cutWater = [];
  for (let i = 1; i <= 6; i++) { const w = R_(hullIn, BH[i] + 7, BOT, BH[i - 1] - BH[i] - 14 + (i === 1 ? 60 : 0), 0, '#2F8AC8', { 'fill-opacity': .82 });
    const s = R_(hullIn, BH[i] + 7, BOT, BH[i - 1] - BH[i] - 14 + (i === 1 ? 60 : 0), 6, '#9FD8FF', { 'fill-opacity': .8 }); cutWater.push({ w, s }); }
  /* hull edge: black above the waterline, red below */
  const hullEdge = G(cut);
  P(hullEdge, HULL, 'none', { stroke: '#121216', 'stroke-width': 18 });
  const redClip = itrClip(`M-200,${WL} H1700 V900 H-200 Z`);
  P(G(hullEdge, { 'clip-path': redClip }), HULL, 'none', { stroke: '#A8322C', 'stroke-width': 18 });
  P(hullEdge, `M-120,${WL} H1590`, 'none', { stroke: '#E9E4D8', 'stroke-width': 3, 'stroke-dasharray': '16 12', 'stroke-opacity': .55 });
  /* foremast + forecastle bits above */
  R_(cut, 1360, -60, 18, 150, '#C9A86A'); itrRail(cut, 1100, 1590, 60, 20, '#C6CEDD', 16, 2);
  /* compartment plates 1–6 */
  const plates = [];
  for (let i = 1; i <= 6; i++) { const x = cx_(i); const g = N(cut, x, TOP - 60);
    const bg = E('circle', { r: 32, fill: '#1E2A4A', stroke: '#E2BE62', 'stroke-width': 5 }, g); TX(g, 0, 19, String(i), 52, '#FFF1D0', { a: 'middle', w: 800 });
    plates.push({ g, bg, x }); }
  /* the gash: splits, popped rivets, jets */
  const SPL = [[1534, 600, 1], [1420, 620, 2], [1340, 630, 2], [1240, 640, 3], [1160, 646, 3], [1070, 652, 4], [995, 657, 4], [900, 662, 5], [825, 667, 5], [730, 672, 6], [660, 676, 6]];
  const SP0 = L(2) + 1.2, SP1 = L(2) + 3.35, spurX = t => lerp(1720, 560, prog(t, SP0, SP1 - SP0, x => x * (2 - x) * .4 + x * .6));
  const tOpen = SPL.map(([x]) => { let lo = SP0, hi = SP1 + .5; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (spurX(m) > x) lo = m; else hi = m; } return hi; });
  const splitG = G(cut), jetG = G(cut), popG = G(cut);
  const splits = SPL.map(([x, y], k) => { const g = N(splitG, x, y, 1, -6);
    P(g, 'M-26,0 Q0,-9 26,0 Q0,9 -26,0 Z', '#05080F'); P(g, 'M-26,0 Q0,-9 26,0', 'none', { stroke: '#BFE6FF', 'stroke-width': 3 });
    E('circle', { cx: -36, cy: 1, r: 4, fill: '#8A8E98' }, g); E('circle', { cx: 36, cy: -1, r: 4, fill: '#8A8E98' }, g); return g; });
  const jets = SPL.map(([x, y], k) => { const g = G(jetG);
    const a = P(g, '', 'none', { stroke: '#BFEAFF', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-dasharray': '26 14' });
    const b = P(g, '', 'none', { stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '12 22', 'stroke-opacity': .8 });
    return { g, a, b, x, y }; });
  const pops = SPL.map(() => { const g = N(popG, 0, 0); E('circle', { r: 7, fill: '#A8ACB6', stroke: '#5A5E68', 'stroke-width': 2 }, g); P(g, 'M-16,-16 l-8,-8 M16,-16 l8,-8 M0,-20 v-10', 'none', { stroke: '#FFF4D0', 'stroke-width': 3, 'stroke-linecap': 'round' }); return g; });
  /* the ice spur scraping past */
  const spur = N(cut, 0, 0);
  P(spur, 'M-170,120 L-150,40 L-110,8 L-60,-6 L-20,10 L30,-4 L90,6 L140,30 L180,90 L190,160 L-160,170 Z', '#D8F0FF', { 'fill-opacity': .9, stroke: '#8CC4E8', 'stroke-width': 4 });
  P(spur, 'M-110,8 L-80,70 L30,-4 M-80,70 L90,6 M-80,70 L-150,120 M60,80 L140,30 M60,80 L180,140', 'none', { stroke: '#9CCBEA', 'stroke-width': 3 });
  P(spur, 'M-130,40 L-100,20 L-80,40 Z M10,10 L40,6 L30,26 Z', '#FFFFFF', { 'fill-opacity': .9 });
  const chips = [0, 1, 2, 3, 4, 5].map(() => P(cut, 'M-6,0 L0,-7 L7,0 L0,6 Z', '#EAF8FF'));
  /* ---------- blueprint version on the same sheet ---------- */
  const bpLine = { stroke: '#EAF3FF', 'stroke-width': 6, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  const bpHull = G(bp);
  P(bpHull, HULL, 'none', bpLine);
  P(bpHull, 'M-120,150 H1590 M-120,420 H1590', 'none', { stroke: '#EAF3FF', 'stroke-width': 3, 'stroke-opacity': .6 });
  P(bpHull, `M-120,${KEEL - 30} H1520`, 'none', { stroke: '#EAF3FF', 'stroke-width': 3, 'stroke-opacity': .5, 'stroke-dasharray': '10 8' });
  { let d = ''; for (let x = -100; x < 1600; x += 120) d += `M${x + 60},150 m-11,0 a11,11 0 1 0 22,0 a11,11 0 1 0 -22,0 `; P(bpHull, d, 'none', { stroke: '#EAF3FF', 'stroke-width': 3, 'stroke-opacity': .6 }); }
  const bpTitle = G(bp); TX(bpTitle, 60, 70, 'S.S. TITANIC — BOW', 50, '#EAF3FF', { w: 800, ls: 3, op: .85 });
  /* sea level line (world-horizontal) */
  const seaLine = P(bp, `M-60,${WL} H1660`, 'none', { stroke: '#9FE0FF', 'stroke-width': 6, 'stroke-dasharray': '24 14' });
  const seaWave = P(bp, '', 'none', { stroke: '#9FE0FF', 'stroke-width': 4, 'stroke-opacity': .6 });
  /* the tray (tilts around its middle) */
  const PIV = [760, 470];
  const trayAng = t => keyed(t, [[L(3) + .05, 0], [L(3) + 1.1, 2], [L(3) + 1.9, 4.5], [L(3) + 3.4, 7], [Le(3) + .4, 8]]);
  const trayW = (bx, by, t) => { const a = trayAng(t) * Math.PI / 180, dx = bx - PIV[0], dy = by - PIV[1];
    return toW(PIV[0] + dx * Math.cos(a) - dy * Math.sin(a), PIV[1] + dx * Math.sin(a) + dy * Math.cos(a)); };
  const tray = G(bp);
  const NC = 9;
  const trayRim = P(tray, `M${BH[NC] - 20},${TOP - 14} H${BH[0] + 22} V${BOT + 16} Q${BH[0] + 22},${BOT + 40} ${BH[0] - 4},${BOT + 40} H${BH[NC] + 6} Q${BH[NC] - 20},${BOT + 40} ${BH[NC] - 20},${BOT + 16} Z
    M${BH[0] + 22},${TOP - 14} h50 q22,0 22,24 v30 q0,22 -22,22 h-50 Z M${BH[NC] - 20},${TOP - 14} h-50 q-22,0 -22,24 v30 q0,22 22,22 h50 Z`, mix('#245898', '#EAF3FF', .1), { stroke: '#EAF3FF', 'stroke-width': 9 });
  const trayWater = [], cubeHi = [];
  for (let i = 1; i <= NC; i++) { trayWater.push({ p: P(tray, '', mix('#245898', '#6FD0FF', .62)), s: P(tray, '', 'none', { stroke: '#D8F4FF', 'stroke-width': 5 }) }); }
  const trayWalls = P(tray, (() => { let d = ''; for (let i = 0; i <= NC; i++) d += `M${BH[i]},${TOP - 14} V${BOT + 14}`; return d + `M${BH[NC]},${BOT + 14} H${BH[0]}`; })(), 'none', { stroke: '#EAF3FF', 'stroke-width': 9, 'stroke-linecap': 'round' });
  for (let i = 1; i <= NC; i++) cubeHi.push(R_(tray, BH[i] + 10, TOP, BH[i - 1] - BH[i] - 20, BOT - TOP, 'none', { stroke: '#7DFF9A', 'stroke-width': 10, rx: 14, opacity: 0 }));
  const glints = P(tray, (() => { let d = ''; for (let i = 1; i <= NC; i++) d += `M${BH[i] + 22},${TOP + 30} v60 M${BH[i] + 36},${TOP + 30} v24 `; return d; })(), 'none', { stroke: '#D8EEFF', 'stroke-width': 7, 'stroke-linecap': 'round' });
  const bpPlates = [];
  for (let i = 1; i <= 6; i++) { const g = N(tray, cx_(i), TOP - 60); E('circle', { r: 32, fill: '#1E4F8E', stroke: '#EAF3FF', 'stroke-width': 5 }, g); TX(g, 0, 19, String(i), 52, '#EAF3FF', { a: 'middle', w: 800 }); bpPlates.push(g); }
  const spills = [];
  spills.push(null);
  for (let i = 6; i <= 8; i++) spills.push(
{ i, a: P(tray, '', 'none', { stroke: '#9FE4FF', 'stroke-width': 30, 'stroke-linecap': 'round', 'stroke-dasharray': '40 10' }), b: P(tray, '', 'none', { stroke: '#FFFFFF', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-dasharray': '12 30' }),
    sp: E('ellipse', { rx: 40, ry: 12, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6 }, tray) });
  /* pencil marks: ✗ on 5 and on 6, smudge where 5 is rubbed out */
  const xMark = (cx, cy, col) => { const g = G(tray); const a = P(g, `M${cx - 60},${cy - 60} L${cx + 60},${cy + 60}`, 'none', { stroke: col, 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-dasharray': '180', 'stroke-dashoffset': 180 });
    const b = P(g, `M${cx + 60},${cy - 60} L${cx - 60},${cy + 60}`, 'none', { stroke: col, 'stroke-width': 18, 'stroke-linecap': 'round', 'stroke-dasharray': '180', 'stroke-dashoffset': 180 }); return { g, a, b }; };
  const x5 = xMark(cx_(5), 360, '#FF6A5A'), x6 = xMark(cx_(6), 360, '#FF6A5A');
  const smudge = P(tray, `M${BH[5] + 20},430 l40,-30 l20,60 l40,-50 l20,70 l30,-40`, 'none', { stroke: '#EAF3FF', 'stroke-width': 10, 'stroke-opacity': .25, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  /* the sum: 6 > 4 (bottom right of the sheet) */
  const SUM = [985, 718];
  const sumG = N(camD, SUM[0], SUM[1]);
  const sumA = TX(sumG, 0, 0, '6 > 4', 46, '#FFFFFF', { a: 'middle', w: 800, hand: true });
  const sumB = N(camD, SUM[0], SUM[1]);
  const sumB_t = TX(sumB, 0, 0, '6 > 4', 46, '#FFFFFF', { a: 'middle', w: 900, hand: true }); sumB_t.setAttribute('stroke', '#FFFFFF'); sumB_t.setAttribute('stroke-width', '2');
  const under = P(sumB, 'M-62,11 Q0,17 62,9', 'none', { stroke: '#FFE07A', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '140', 'stroke-dashoffset': 140 });
  const under2 = P(sumB, 'M-58,20 Q0,24 58,18', 'none', { stroke: '#FFE07A', 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-dasharray': '130', 'stroke-dashoffset': 130 });
  const crumbsD = [0, 1, 2, 3, 4, 5, 6].map(i => E('ellipse', { rx: 3.2, ry: 2.2, fill: i % 2 ? '#F2A0B0' : '#C9D6EA' }, camD));
  /* the word PRACTICALLY on the board (stuck, then peeling) */
  const wadPiv = N(camD, 0, 0); const wadInner = N(wadPiv, 0, 0); const wordB = gagWord(wadInner);
  const wrink = P(wadInner, 'M-90,-14 l20,22 M-30,-20 l10,26 M40,-18 l-8,30 M90,-8 l-14,14', 'none', { stroke: '#BFAF8A', 'stroke-width': 2.4, 'stroke-opacity': .7 });
  const slapD = soundMark(camD, '', 22);
  const snapMk = soundMark(camD, 'clack!', 22);
  /* ---------- characters ---------- */
  const charsD = G(camD);
  const capt = castCaptain(charsD, { rim: false });
  const owner = castOwner(charsD);
  const sb = castShipbuilder(charsD);
  if (owner.cane) op(owner.cane, 0);
  if (sb.blueprint) op(sb.blueprint, 0);
  const pocket = gagPocketOn(owner);
  const cup = gagTeacup(capt.propL);
  /* local overlay: a crisper copy of the gag's single ripple, readable in the close-up */
  const cupRing = E('ellipse', { cx: 0, cy: -35.5, rx: 3, ry: .6, fill: 'none', stroke: '#FFF4DE', 'stroke-width': 1.3, opacity: 0 }, cup.cup);
  const capHat = (() => { const n = capt.head.querySelector('path[d^="M-46,-350"]'); return n ? n.parentNode : null; })();
  const earPencil = sb.head.querySelector('g[transform="translate(46,-326) rotate(58)"]');
  const pencilS = mkPencil(sb.propL), pencilO = mkPencil(owner.propR);
  const wadHand = gagWord(owner.propR);
  const tongue = P(owner.head, 'M-10,-268 Q-12,-240 1,-237 Q13,-240 10,-268 Z M0,-262 V-246', '#F07A88', { stroke: '#B8454E', 'stroke-width': 2 });
  /* the abacus (Owner, line 8) */
  const abacus = G(owner.up); owner.up.insertBefore(abacus, owner.handL);
  R_(abacus, -72, -232, 144, 92, '#8A5A32', { rx: 6 }); R_(abacus, -62, -222, 124, 72, '#F4E7C8', { rx: 3 });
  P(abacus, 'M-62,-204 H62 M-62,-186 H62 M-62,-168 H62', 'none', { stroke: '#6A4428', 'stroke-width': 2.4 });
  const beadRows = [[-204, '#C8443A', 6], [-186, '#3E6E9E', 3], [-168, '#3E8E5A', 4]].map(([y, c, n], r) => {
    const bs = []; for (let k = 0; k < n; k++) bs.push(E('ellipse', { cx: 0, cy: y, rx: 7, ry: 7.5, fill: c, stroke: shade(c, -.3), 'stroke-width': 1.4 }, abacus)); return { y, bs, n }; });
  /* water in the hold (in front of the feet) */
  const waterD = G(camD);
  const wBack = R_(waterD, -500, 0, 3000, 400, lgrad([[0, '#3E7E86', .55], [1, '#123A44', .9]]));
  const wSurf = P(waterD, '', 'none', { stroke: '#BFEFF2', 'stroke-width': 3, 'stroke-opacity': .6 });
  const wSurf2 = P(waterD, '', 'none', { stroke: '#BFEFF2', 'stroke-width': 2, 'stroke-opacity': .3 });
  const ringsD = [0, 1, 2, 3, 4, 5].map(() => E('ellipse', { rx: 40, ry: 8, fill: 'none', stroke: '#D8F6F8', 'stroke-width': 2.4 }, waterD));
  const splashD = [0, 1, 2, 3, 4, 5, 6, 7].map(() => E('circle', { r: 4, fill: '#D8F6F8', 'fill-opacity': .8 }, waterD));
  const glowRefl = [300, 1440].map(x => E('ellipse', { cx: x, cy: 0, rx: 70, ry: 10, fill: '#FFE7A8', 'fill-opacity': .18 }, waterD));
  const floaters = [[150, 0], [760, 1], [1580, 0], [980, 2]].map(([x, k], i) => { const g = N(waterD, x, 0);
    if (k === 0) { E('ellipse', { cx: 0, cy: -8, rx: 46, ry: 20, fill: '#C9B48A' }, g); P(g, 'M30,-22 l18,-10 l-4,14', '#A8925E'); P(g, 'M-30,-14 q30,-10 60,0', 'none', { stroke: '#8E7A50', 'stroke-width': 3 }); }
    else if (k === 1) { R_(g, -26, -16, 52, 30, '#F4EEDC', { rx: 2, transform: 'rotate(-8)' }); P(g, 'M-24,-14 L0,2 L24,-18', 'none', { stroke: '#B8AE96', 'stroke-width': 2 }); }
    else { R_(g, -50, -40, 100, 56, '#8A6A44'); P(g, 'M-50,-40 L50,16 M50,-40 L-50,16', 'none', { stroke: '#6A4E30', 'stroke-width': 4 }); }
    return { g, x, k, ph: i * 1.3 }; });
  /* foreground pipe stanchion (parallax) */
  const fgD = G(shotD); R_(fgD, -470, -300, 80, 1500, '#1C2224'); R_(fgD, -470, -300, 18, 1500, '#323C3E'); rivets(fgD, 'M-430,-300 V1200', 3, '#4A5658', 22);

  /* ---------- screen-space overlay: whip-pan streaks ---------- */
  /* smear frames for the whip pan (horizontal) and the tilt (vertical): striped pattern fills */
  const smear = (vert) => { const id = uid('sm'), w = vert ? 1600 : 40, h = vert ? 40 : 900;
    const pt = E('pattern', { id, patternUnits: 'userSpaceOnUse', width: vert ? 97 : 1600, height: vert ? 900 : 31 }, DEFS);
    const cols = ['#3A2418', '#5A3422', '#1B2A55', '#8E98AE', '#2A1A12', '#0E1838', '#6E6656'];
    for (let k = 0; k < 9; k++) { const c = cols[k % cols.length], a = 2 + hash(k * 3.7) * 9, o = hash(k * 5.1) * (vert ? 97 : 31);
      if (vert) R_(pt, o, 0, a, 900, c); else R_(pt, 0, o, 1600, a, c); }
    return R_(world, -100, -100, 1800, 1100, `url(#${id})`); };
  const smearH = smear(false), smearV = smear(true);
  const streak = G(world);
  const streaks = [];
  for (let i = 0; i < 16; i++) streaks.push(E('rect', { x: 0, y: 0, width: 10, height: 10, fill: '#FFFFFF', 'fill-opacity': .1 + hash(i * 3.3) * .12, rx: 3 }, streak));

  /* =====================================================================
     per-frame
     ===================================================================== */
  const lim = (x, a, b) => clamp(x, a, b);
  /* hand target in a Person's local frame (s, origin, bob) */
  const toLoc = (px, py, s, wx, wy, bob = 0) => [(wx - px) / s, (wy - py) / s - bob];

  return (lt, at) => {
    /* ---------------- visibility of the shots ---------------- */
    const vA = lt < tAB + .02, vB = lt > tAB - .3 && lt < tBC + .5, vD = lt > tBC - .05;
    op(shotA, vA ? 1 : 0); op(shotB, vB ? 1 : 0); op(shotD, vD ? 1 : 0);
    /* whip / tilt streaks */
    const wA = win(lt, tAB - .28, tAB + .12, .14, .16), wB = win(lt, tBC - .22, tBC + .2, .12, .16);
    op(streak, Math.max(wA, wB));
    op(smearH, win(lt, tAB - .16, tAB + .02, .1, .12) * .8); op(smearV, win(lt, tBC - .14, tBC + .06, .1, .12) * .75);


    if (wA > 0 || wB > 0) streaks.forEach((r, i) => { const hy = hash(i * 7.1), hx = hash(i * 2.3);
      if (wA >= wB) { r.setAttribute('x', f2(-200 + hx * 1800 - ((lt * 4000) % 2000))); r.setAttribute('y', f2(hy * 900)); r.setAttribute('width', f2(300 + hx * 500)); r.setAttribute('height', f2(3 + hy * 8)); }
      else { r.setAttribute('y', f2(-200 + hx * 1200 - ((lt * 3600) % 1400))); r.setAttribute('x', f2(hy * 1600)); r.setAttribute('height', f2(240 + hx * 400)); r.setAttribute('width', f2(3 + hy * 8)); } });

    /* ======================= SHOT A ======================= */
    if (vA) {
      const whip = easeIn(clamp((lt - (tAB - .3)) / .3));
      const cA = camAt(lt, [[0, 800, 450, 1], [L(0) - .2, 790, 460, 1.0], [L(0) + .75, 470, 545, 1.42], [L(0) + 1.75, 520, 535, 1.38],
 [L(0) + 2.9, 960, 465, 1.1], [L(0) + 4.0, 980, 470, 1.1], [Le(0), 860, 480, 1.1]]);
      camT(camA, cA[0] + whip * 1100, cA[1], cA[2]);
      camPar(fgA, [cA[0] + whip * 1100, cA[1], cA[2]], 1.18); camPar(fgChair, [cA[0] + whip * 1100, cA[1], cA[2]], 1.3);
      animA.forEach(f => f(at));
      /* the bump: chandeliers jiggle, the whisky gets one ripple */
      const bump = L(0) + .7, jig = lt > bump && lt < bump + 1.2 ? Math.sin((lt - bump) * 38) * 2.2 * Math.exp(-(lt - bump) * 3) : 0;
      chandA.forEach(({ w, c }) => { c.anim(at); tf(w, jig, 0); });
      const rp = clamp((lt - bump - .05) / 1.1), rp2 = clamp((lt - bump - .4) / 1.1);
      sa(wRing, 'rx', f2(3 + rp * 20)); sa(wRing, 'ry', f2(.9 + rp * 5.6)); op(wRing, rp > 0 && rp < 1 ? (1 - rp) * .95 : 0);
      sa(wRing2, 'rx', f2(3 + rp2 * 17)); sa(wRing2, 'ry', f2(.9 + rp2 * 4.8)); op(wRing2, rp2 > 0 && rp2 < 1 ? (1 - rp2) * .6 : 0);
      tf(whisky, 0, Math.sin((lt - bump) * 30) * 1.2 * win(lt, bump, bump + .6, .05, .4));
      op(shiverMk, win(lt, bump, bump + .5, .08, .3) * .9); tf(shiverMk, 252 + Math.sin(lt * 60) * 1.5, 640, 0, 1.4);
      /* fire */
      const fl = (k, h) => `M${742 + k * 6},616 Q${752 + k * 4},${f2(590 - h * (1 + .2 * wob(at * 6, k)))} ${770},${f2(600 - h * .6)} Q${786},${f2(560 - h * (1 + .25 * wob(at * 5, k + 2)))} ${800},${f2(590 - h * .4)} Q${816},${f2(556 - h * (1 + .3 * wob(at * 7, k + 4)))} ${830},${f2(596 - h * .5)} Q${848 - k * 4},${f2(584 - h * (1 + .2 * wob(at * 6, k + 6)))} ${858 - k * 6},616 Z`;
      flames.forEach((f, k) => sa(f, 'd', fl(k, 22 - k * 7)));
      op(fireGlow, .75 + .25 * wob(at * 4, 1));
      /* haze */
      hz.forEach((e, i) => { e.setAttribute('cx', f2(((at * (8 + i * 3) + i * 500) % 2400) - 400)); e.setAttribute('cy', f2(180 + i * 40 + Math.sin(at * .3 + i) * 10)); });
      /* the far steward + spoon */
      const tDrop = L(0) + 3.2, tTink = tDrop + .22;
      const stx = 1514 + Math.sin(at * .5) * 3;
      steward.set({ x: stx, y: 512, s: .2, at, hR: [70, -150], hL: [-58, -130], face: lt > tTink + .1 ? 'worried' : 'neutral', look: lt > tTink + .1 ? [.6, -.3] : [0, 0], bob: lt > tTink && lt < tTink + .3 ? 3 : 0 });
      const sp = clamp((lt - tDrop) / .22);
      op(spoon, lt > tDrop - .01 && lt < tTink + 1.4 ? 1 : 0);
      tf(spoon, stx + 18 - sp * 6, 482 + sp * sp * 30 + (lt > tTink ? -Math.abs(Math.sin((lt - tTink) * 18)) * 4 * Math.exp(-(lt - tTink) * 5) : 0), sp * 420 + (lt > tTink ? 90 : 0), .9);
      const tk = win(lt, tTink, tTink + .9, .12, .4);
      op(tink, tk); tf(tink, 1478, 470, -8, .6 + .4 * pop(lt, tTink, .4));
      op(tinkStar, win(lt, tTink, tTink + .25, .03, .2)); tf(tinkStar, 1532, 512, lt * 200, .8);
      /* players */
      const gU = win(lt, tTink + .12, tTink + .85, .16, .3);   /* glance up */
      const tPlay = tTink + 1.05;
      players.forEach((p, i) => {
        const b = breath(at, i * 1.3), fid = Math.sin(at * 1.1 + i * 2) * 3;
        let hL = [-30, -186 + fid * .3], hR = [26, -190 + fid * .3], prop = 0;
        if (i === 1) { const pl = win(lt, tPlay - .25, tPlay + .35, .25, .4); hR = [lerp(26, 62, pl), lerp(-190, -96, pl)]; }
        if (i === 2) { const sh = Math.sin(at * .7) > .6 ? Math.sin(at * 9) * 4 : 0; hL = [-30 + sh, -184]; }
        const look = [lerp(i < 2 ? .15 : -.15, .95, gU), lerp(.7, -.55, gU)];
        p.R.set({ x: p.x, y: 772, s: .95, sit: true, at, bob: b, hL, hR, propRotR: -6 + Math.sin(at * .6 + i) * 4, look, turn: lerp(i < 2 ? .25 : -.25, .55, gU),
          face: gU > .3 ? (i === 1 ? 'surprise' : 'think') : (i === 1 && lt > tPlay ? 'smug' : (i === 3 ? 'proud' : 'focus')), headTilt: gU * (i % 2 ? 4 : -3) + Math.sin(at * .8 + i) * 1.5 });
      });
      op(played, lt > tPlay ? 1 : 0); op(slapMark, win(lt, tPlay, tPlay + .35, .03, .25));
      /* background players + reader */
      bgPl.forEach((p, i) => p.set({ x: 1158 + i * 84, y: 662, s: .52, sit: true, at, look: gU > .1 ? [lerp(.2, 1, gU), -.4 * gU] : [i ? -.6 : .6, .2], hL: [-30, -178], hR: [30, -176], face: gU > .3 ? 'surprise' : 'focus' }));
      bgSmoke.anim(at, 1);
      const dip = win(lt, tTink + .08, tTink + .9, .18, .3);
      reader.set({ x: 380, y: 694, s: .82, sit: true, at, hL: [-70, -270 + dip * 46], hR: [70, -270 + dip * 46], look: [.9 * dip, -.3 * dip], face: dip > .3 ? 'surprise' : 'neutral', lid: .3 * (1 - dip) });
      tf(paper, 0, -230 + dip * 46, Math.sin(at * .9) * 1.2);

      const hd = players[3]; smokeA[1].anim(at, .9, hd.x + 40, 772 - .95 * 262);
    }

    /* ======================= SHOT B ======================= */
    if (vB) {
      const tIn = tAB, whipIn = 1 - easeOut(clamp((lt - (tIn - .05)) / .32));
      const tilt = easeIn(clamp((lt - (tBC - .3)) / .3));
      const k1 = L(1);
      const kick1 = k1 + 1.98, chip = kick1 + .42, head = chip + .4, goal = head + .3;
      const cB = camAt(lt, [[tIn, 640, 500, 1.06], [k1 + 1.2, 690, 505, 1.06], [kick1, 720, 510, 1.08], [head, 860, 510, 1.1], [goal + .5, 960, 505, 1.1]]);
      const cx = cB[0] - whipIn * 1000, cy = cB[1] + tilt * 900;
      camT(camB, cx, cy, cB[2]); camPar(fgB, [cx, cy, cB[2]], 1.25);
      starsB.anim(at);
      /* the iceberg slides past, whistling innocently */
      const bx = lerp(520, -900, ease(clamp((lt - (k1 - .5)) / 3.6)));
      bergB.set({ x: bx, y: 650, s: 1.35, at, face: lt < k1 + 1.4 ? 'whistle' : 'innocent', dim: .25, showUnder: 0, bob: Math.sin(at) * 2, look: [-1, .2] });
      lampB.forEach((g, i) => op(g, .8 + .2 * wob(at * 3, i)));
      /* falling ice */
      falling.forEach((f, i) => { const t0 = k1 - .25 + f.d; const p = clamp((lt - t0) / .55);
        if (lt < t0) { op(f.g, 0); return; } op(f.g, 1);
        const bounce = lt > t0 + .55 ? Math.abs(Math.sin((lt - t0 - .55) * 9)) * 26 * Math.exp(-(lt - t0 - .55) * 5) : 0;
        const slide = lt > t0 + .55 ? easeOut(clamp((lt - t0 - .55) / .8)) * 40 : 0;
        tf(f.g, lerp(f.x0, f.x1, p) + slide, lerp(f.y0, f.y1, p * p) - bounce, (lt - t0) * 260 * (1 - clamp((lt - t0 - .6) / .6)), f.s); });
      /* the ball (the big chunk) */
      const bL = k1 + .55;
      let bxp, byp, brot = 0, bs = .62;
      if (lt < bL) { const p = clamp((lt - (k1 - .1)) / .65); bxp = lerp(240, 470, p); byp = lerp(200, 836, p * p); brot = p * 300; }
      else if (lt < kick1) { const q = lt - bL; bxp = 470 + easeOut(clamp(q / .6)) * 24; byp = 836 - Math.abs(Math.sin(q * 10)) * 30 * Math.exp(-q * 6); brot = 300 + easeOut(clamp(q / .6)) * 60; }
      else if (lt < chip) { const p = clamp((lt - kick1) / (chip - kick1)); bxp = lerp(494, 700, easeOut(p)); byp = 836; brot = 360 + p * 400; }
      else if (lt < head) { const p = clamp((lt - chip) / (head - chip)); bxp = lerp(700, 930, p); byp = lerp(836, 690, p) - Math.sin(Math.PI * p) * 170; brot = 760 + p * 300; }
      else if (lt < goal + .6) { const p = clamp((lt - head) / .42); bxp = lerp(930, 1330, easeOut(p)); byp = lerp(690, 800, p * p); brot = 1060 + p * 500;
        if (lt > head + .42) { const q = lt - head - .42; bxp = 1330 + easeOut(clamp(q / .5)) * 90; byp = 800 + easeOut(clamp(q / .3)) * 20; } }
      else { bxp = 1420; byp = 820; brot = 1560; }
      tf(ball, bxp, byp, brot, 1);
      { const tr = lt > kick1 && lt < goal + .3; op(ballTrail, tr ? .9 : 0);
        if (tr) { const pts = []; for (let k = 1; k <= 3; k++) { const q = lt - k * .06; pts.push(q); } sa(ballTrail, 'd', `M${f2(bxp - (lt < chip ? 70 : lt < head ? 60 : 90))},${f2(byp + (lt < head && lt > chip ? 40 : 0))} L${f2(bxp)},${f2(byp)}`); } }
      op(goalStars, win(lt, goal, goal + .9, .1, .4)); tf(goalStars, 1300, 700, 0, .6 + .5 * pop(lt, goal, .5));

      /* people */
      const scare = win(lt, k1 + .15, k1 + 1.1, .15, .4), grin = clamp((lt - (k1 + .9)) / .4);
      const cheer = clamp((lt - goal) / .25);
      /* kicker */
      { const kk = win(lt, kick1 - .25, kick1 + .2, .2, .25); const st = { x: 420 - scare * 30, y: 836, s: .86, at, rim: .55, rimSide: -1, bob: breath(at), face: scare > .4 ? 'surprise' : cheer > .2 ? 'joy' : grin > .5 ? 'happy' : 'neutral',
          look: lt < kick1 + .3 ? [.5, .6] : [1, -.3], fR: [22 + kk * 50, -kk * 40], hL: [-62 - kk * 20, -150 - kk * 30], hR: [60 + kk * 10, -140] };
        if (cheer > 0) { st.hL = [-70, -230 - cheer * 80]; st.hR = [70, -230 - cheer * 80]; st.bob = -Math.abs(Math.sin(at * 9)) * 10 * cheer; }
        kicker.set(st); }
      /* boy */
      { const cc = win(lt, chip - .2, chip + .2, .15, .25); const st = { x: 690 - scare * 20, y: 842, s: .95, at, rim: .55, face: scare > .4 ? 'surprise' : cheer > .2 ? 'joy' : 'happy', look: lt < chip + .1 ? [-.6, .6] : [1, -.6],
          fL: [-22 - cc * 30, -cc * 50], hL: [-60, -160 - cc * 30], hR: [64, -150 - cc * 40], bob: breath(at, 1) };
        if (cheer > 0) { st.hL = [-60, -240 - cheer * 60]; st.hR = [64, -240 - cheer * 60]; st.bob = -Math.abs(Math.sin(at * 10 + 1)) * 12 * cheer; }
        boy.set(st); }
      /* woman spectator */
      woman.set({ x: 200, y: 830, s: .84, at, rim: .55, bob: breath(at, 2) - cheer * Math.abs(Math.sin(at * 8)) * 8, face: scare > .4 ? 'scared' : cheer > .1 ? 'joy' : 'happy', look: [lerp(.6, 1, cheer), -.2],
        hL: cheer > 0 ? [-30 + Math.sin(at * 16) * 10, -200] : [-56, -150], hR: cheer > 0 ? [24 - Math.sin(at * 16) * 10, -200] : [56, -150] });
      /* keeper: crouches, then dives the wrong way */
      { const dv = clamp((lt - (head + .05)) / .3); const st = { x: 1300 + dv * 70, y: 806 - Math.sin(Math.PI * dv) * 40, s: .82, at, rim: .55, rimSide: 1, rot: dv * 38, face: dv > .2 ? 'scared' : 'focus', look: [lerp(-.8, .6, dv), .2],
          hL: [-70 + dv * 20, -150 - dv * 120], hR: [70 + dv * 40, -150 - dv * 120], bob: 6 * (1 - dv) + breath(at, 3), fL: [-30, 0], fR: [30, 0] };
        if (lt > goal + .5) { const q = clamp((lt - goal - .5) / .4); st.rot = lerp(38, 70, q); st.y = 812; st.x = 1376; st.face = 'sad'; }
        keeper.set(st); }
      /* Mitzi heads it in */
      { const jp = win(lt, head - .22, head + .25, .2, .3); const run = clamp((lt - (chip - .1)) / .35);
        mitzi.set({ x: 870 + run * 30 + cheer * 20, y: 842, s: 1.2, at, jump: jp + (cheer > 0 ? Math.abs(Math.sin(at * 9)) * .5 * cheer : 0), face: cheer > 0 ? 'smug' : 'happy', wag: .9, walk: lt < head && run > 0 && run < 1 ? 1 : 0, rot: -jp * 12 });
        capM.set({ x: 0, y: 0, rot: jp * -8 }); }
      /* breath vapour */

    }

    /* ======================= SHOT C + D ======================= */
    if (vD) {
      const inT = 1 - easeOut(clamp((lt - (tBC - .05)) / .45));
      const zIn = 1 / BK, cxC = BX0 + 800 * BK, cyC = BY0 + 450 * BK;
      const tW = L(3) + .05;   /* blueprint becomes a tray */
      /* camera keys (hold world) */
      const sbH = 1240, owH = 380, capX = 120;
      const K = [[tBC, cxC, cyC, zIn], [L(2) + 1.1, cxC, cyC, zIn], [L(2) + 3.2, cxC + 30, cyC + 12, zIn * 1.06], [tCD, cxC, cyC, zIn],
        [tCD + 1.35, 800, 560, .92], [L(3) + 1.7, 820, 585, 1.1], [Le(3), 830, 595, 1.15],
        [L(4) + .1, 770, 600, 1.2], [Le(4), 780, 600, 1.22], [L(5) + 1.2, 850, 600, 1.18], [Le(5), 860, 600, 1.15],
        [L(6) - .45, 170, 580, 1.65], [Le(6) + .05, 165, 580, 1.7], [L(7) + .2, 480, 600, 1.3], [Le(7), 500, 600, 1.3],
        [L(8) + .15, 790, 600, 1.2], [Le(8), 880, 620, 1.3], [DUR, 975, 690, 1.55]];
      const cD = camAt(lt, K);
      const cyS = cD[1] - inT * 900 / cD[2];
      camT(camD, cD[0], cyS, cD[2]); camPar(fgD, [cD[0], cyS, cD[2]], 1.3);
      const reveal = clamp((lt - tCD) / .5);          /* hold set visible */
      const bpK = clamp((lt - (tCD - .05)) / .6);      /* coloured → blueprint */
      const vHold = lt > tCD - .02;
      op(holdBg, vHold ? 1 : 0); op(paperD, vHold ? 1 : 0); op(charsD, vHold ? 1 : 0); op(waterD, vHold ? 1 : 0); op(fgD, vHold ? 1 : 0);
      op(cut0, 1 - bpK); op(bp0, bpK);

      /* ---------- C: the cutaway ---------- */
      if (bpK < 1) {
        const sx = spurX(lt);
        op(spur, win(lt, SP0 - .1, SP1 + .1, .2, .5) * .85); tf(spur, sx, 666 + Math.sin(lt * 7) * 3, -4, 1, .72);
        chips.forEach((c, i) => { const ph = ((lt * 2.2 + i / 6) % 1); op(c, lt > SP0 && lt < SP1 + .2 ? 1 - ph : 0); tf(c, sx + 60 + ph * 90 + i * 8, 640 - ph * 60 + Math.sin(i * 2) * 20 + ph * ph * 90, ph * 400); });
        SPL.forEach(([x, y, ci], k) => {
          const to = tOpen[k], o = clamp((lt - to) / .12);
          op(splits[k], o); tf(splits[k], x, y, -6, .3 + .7 * o);
          const pp = clamp((lt - to) / .5); op(pops[k], pp > 0 && pp < 1 ? 1 - pp : 0); tf(pops[k], x + 20 + pp * 40, y - pp * 90 + pp * pp * 60, pp * 300, .9);
          const jt = clamp((lt - to - .05) / .3), J = jets[k];
          op(J.g, jt > 0 ? 1 : 0);
          if (jt > 0) { const h = (140 + (k % 3) * 30) * jt * (1 + .08 * Math.sin(at * 13 + k)), dx = -(60 + (k % 2) * 30) * jt;
            const d = `M${x},${y} Q${f2(x + dx * .4)},${f2(y - h * 1.2)} ${f2(x + dx)},${f2(y - h * .5)}`;
            sa(J.a, 'd', d); sa(J.b, 'd', d); J.a.setAttribute('stroke-dashoffset', f2(-at * 160)); J.b.setAttribute('stroke-dashoffset', f2(-at * 220)); }
        });
        /* water levels 1–6 */
        const TG = [300, 330, 380, 430, 520, 600];
        for (let i = 1; i <= 6; i++) { const k0 = SPL.findIndex(s => s[2] === i), t0 = tOpen[k0] + .1;
          const lev = lerp(BOT, TG[i - 1], easeOut(clamp((lt - t0) / (tCD - t0 + .2))) * (lt > t0 ? 1 : 0));
          const W = cutWater[i - 1]; sa(W.w, 'y', f2(lev)); sa(W.w, 'height', f2(BOT - lev)); sa(W.s, 'y', f2(lev - 3 + Math.sin(at * 4 + i) * 2)); op(W.s, lev < BOT - 4 ? 1 : 0);
          const fl = clamp((lt - t0 - .3) / .25), pl = plates[i - 1];
          sa(pl.bg, 'fill', fl > .5 ? '#C8443A' : '#1E2A4A'); tf(pl.g, pl.x, TOP - 60, 0, 1 + .25 * win(lt, t0 + .3, t0 + .7, .1, .3) + (lt > L(2) + 3.9 && i >= 5 ? .12 * Math.max(0, Math.sin((lt - L(2) - 3.9) * 8)) * (lt < Le(2) + .3 ? 1 : 0) : 0)); }
        bubbles.forEach((b, i) => { const ph = (at * .25 + i / 8) % 1; sa(b, 'cx', f2(200 + i * 170 + Math.sin(at + i) * 20)); sa(b, 'cy', f2(880 - ph * 560)); op(b, Math.sin(Math.PI * ph) * .8); sa(b, 'r', f2(3 + i % 3 * 2)); });
        fish.forEach((f, i) => { const p = ((at * .04 + i * .5) % 1); const scared = lt > SP0 && lt < SP1 + 1 ? 1 : 0; tf(f, 1700 - p * 1900 - scared * 0, 820 - i * 60 + Math.sin(at * 2 + i) * 8, 0, 1.1 - i * .2, 1.1 - i * .2); });
      }

      /* ---------- D: the blueprint tray ---------- */
      if (bpK > 0) {
        /* tray angle + fills */
        const th = trayAng(lt);
        sa(tray, 'transform', `rotate(${f2(th)} ${PIV[0]} ${PIV[1]})`);
        op(bpHull, 1 - clamp((lt - tW) / .6)); op(bpTitle, 1 - clamp((lt - tW) / .6));
        op(trayRim, clamp((lt - tW) / .6)); op(glints, clamp((lt - tW - .2) / .5));
        const tr = Math.tan(th * Math.PI / 180), sn = Math.sin(th * Math.PI / 180), cs = Math.cos(th * Math.PI / 180);
        /* sea level in tray-local coords at x */
        const seaY = x => PIV[1] + (WL - 40 * clamp((lt - tW) / 2) - PIV[1] - sn * (x - PIV[0])) / cs;
        const cutLev = [300, 330, 380, 430, 520, 600];
        const rub5 = clamp((lt - (L(4) + .35)) / 1.0), refill5 = clamp((lt - (L(5) + .45)) / 1.2);
        for (let i = 1; i <= NC; i++) {
          const x0 = BH[i] + 5, x1 = BH[i - 1] - 5, xm = (x0 + x1) / 2;
          const full = Math.max(TOP + 4, seaY(xm));
          let f, base = i <= 6 ? cutLev[i - 1] : BOT;
          if (i <= 4) f = clamp((lt - tW) / 1.0);
          else if (i === 5) f = clamp((lt - (L(3) + 1.5)) / .6);
          else if (i === 6) f = clamp((lt - (L(3) + 2.6)) / .9);
          else { const t0 = L(3) + 3.1 + (i - 7) * .75; f = clamp((lt - t0) / .8); base = BOT; }
          let lev = lerp(base, full, ease(f));
          let a = 1;
          if (i === 5) { if (lt < L(5) + .45) a = 1 - rub5; else { a = 1; lev = lerp(BOT, full, ease(refill5)); } }
          const yL = Math.min(BOT, Math.max(TOP, lev + (x0 - xm) * -tr)), yR = Math.min(BOT, Math.max(TOP, lev + (x1 - xm) * -tr));
          const W = trayWater[i - 1];
          if (lev >= BOT - 1 || a < .01) { op(W.p, 0); op(W.s, 0); }
          else { op(W.p, a); op(W.s, a); const wv = Math.sin(at * 3 + i) * 3;
            sa(W.p, 'd', `M${x0},${f2(yL)} L${x1},${f2(yR)} L${x1},${BOT} L${x0},${BOT} Z`); sa(W.s, 'd', `M${x0},${f2(yL + wv)} L${x1},${f2(yR - wv)}`); }
          if (i >= 6 && i <= 8) { const S = spills[i - 5]; const t0 = L(3) + 3.1 + (i - 6) * .75; const sp = win(lt, t0 - .1, t0 + .9, .15, .3);
            op(S.a, sp); op(S.b, sp); op(S.sp, sp * .8);
            if (sp > 0) { const wx = BH[i], ly = Math.max(TOP + 60, Math.min(BOT - 20, lev - (BH[i] - 60 - xm) * tr)), d = `M${wx + 50},${TOP - 10} Q${wx},${TOP - 110} ${wx - 60},${f2(ly)}`; sa(S.a, 'd', d); sa(S.b, 'd', d); S.a.setAttribute('stroke-dashoffset', f2(-at * 220)); S.b.setAttribute('stroke-dashoffset', f2(-at * 300));
              const k = (at * 2.5) % 1; sa(S.sp, 'cx', wx - 60); sa(S.sp, 'cy', f2(ly)); sa(S.sp, 'rx', f2(20 + k * 50)); sa(S.sp, 'ry', f2(6 + k * 12)); sa(S.sp, 'stroke-opacity', f2(1 - k)); } }

        }
        sa(seaWave, 'd', `M-60,${f2(WL - 40 * clamp((lt - tW) / 2) + 10)} q40,-12 80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0`);
        tf(seaWave, -((at * 30) % 80), 0); op(seaWave, clamp((lt - tW) / .6) * .8);
        sa(seaLine, 'd', `M-60,${f2(WL - 40 * clamp((lt - tW) / 2))} H1660`);
        /* "four" glow on 1–4, ✗ on 5 and 6 */
        const g4 = win(lt, L(3) + .7, L(3) + 1.6, .2, .4);
        cubeHi.forEach((c, i) => { op(c, i < 4 ? g4 * .9 : 0); });
        const xA = (m, t0) => { const p1 = clamp((lt - t0) / .18), p2 = clamp((lt - t0 - .2) / .18); sa(m.a, 'stroke-dashoffset', f2(180 * (1 - p1))); sa(m.b, 'stroke-dashoffset', f2(180 * (1 - p2))); };
        xA(x5, L(3) + 1.7); xA(x6, L(3) + 3.2);
        op(x5.g, lt < L(5) ? 1 - rub5 : 0); op(x6.g, 1);
        op(smudge, lt > L(4) + .4 ? (lt < L(5) + .45 ? rub5 : 1 - refill5) * 1 : 0);
        op(bpPlates[4], lt < L(5) + .45 ? 1 - rub5 * .85 : .15 + refill5 * .85);
      }
      /* the sum (paper margin) */
      { const wr = clamp((lt - (L(5) + 1.6)) / 1.0), rubS = clamp((lt - (L(8) + .05)) / .75);
        op(sumG, vHold ? (lt < L(8) ? wr : 1 - rubS) : 0); tf(sumG, SUM[0], SUM[1], 0, lt < L(8) ? lerp(.85, 1, wr) : 1);
        const back = pop(lt, L(8) + 1.05, .55);
        op(sumB, vHold ? back : 0); tf(sumB, SUM[0] - 6, SUM[1] - 14, -3, back * 1.75);
        sa(under, 'stroke-dashoffset', f2(140 * (1 - clamp((lt - (L(8) + 2.75)) / .45))));
        sa(under2, 'stroke-dashoffset', f2(130 * (1 - clamp((lt - (L(8) + 3.25)) / .4)))); }

      if (vHold) {
        /* ---------- the hold: water, lamps, leak ---------- */
        const wl = lerp(842, 822, clamp((lt - tCD) / (DUR - tCD)));
        sa(wBack, 'y', f2(wl));
        let d1 = `M-500,${f2(wl)}`, d2 = `M-500,${f2(wl + 18)}`; for (let x = -500; x <= 2500; x += 100) { d1 += ` Q${x + 50},${f2(wl + 5 * Math.sin(at * 2 + x * .01))} ${x + 100},${f2(wl)}`; d2 += ` Q${x + 50},${f2(wl + 18 + 4 * Math.sin(at * 2.4 + x * .013 + 1))} ${x + 100},${f2(wl + 18)}`; }
        sa(wSurf, 'd', d1); sa(wSurf2, 'd', d2);
        glowRefl.forEach((e, i) => { sa(e, 'cy', f2(wl + 10)); sa(e, 'rx', f2(60 + 14 * Math.sin(at * 2 + i))); });
        lamps.forEach(l => { const sw = Math.sin(at * .9 + l.ph) * 3 + (lt > L(4) && lt < L(4) + .8 ? Math.sin(lt * 20) * 2 : 0); sa(l.w, 'transform', `rotate(${f2(sw)} ${l.x} ${l.y})`); op(l.c.glow, .8 + .2 * wob(at * 5, l.ph)); });
        caust.forEach((c, i) => { let d = `M-500,${f2(wl - 40 - i * 30)}`; for (let x = -500; x < 2500; x += 120) d += ` q30,${f2(-8 * Math.sin(at * 1.5 + x * .02 + i))} 60,0 t60,0`; sa(c, 'd', d); });
        sa(leak, 'd', `M60,560 Q120,${f2(560 + Math.sin(at * 3) * 6)} 150,${f2(wl)}`); leak.setAttribute('stroke-dashoffset', f2(-at * 140));
        drips.forEach((e, i) => { const ph = (at * .7 + i * .27) % 1; const x = [1250, 1180, 1660, 260][i]; tf(e, x, 136 + ph * ph * (wl - 136), 0, .6 + ph * .5); op(e, ph > .04 && ph < .97 ? .9 : 0); });
        floaters.forEach(f => {
 tf(f.g, f.x + Math.sin(at * .3 + f.ph) * 30 + (lt - tCD) * 4, wl + 4 + Math.sin(at * 1.6 + f.ph) * 3, Math.sin(at * 1.2 + f.ph) * 5); });

        /* ---------- characters ---------- */
        let sbX = sbH, owX = owH;
        const talkS = cue.talk(lt, 'S'), talkO = cue.talk(lt, 'O'), talkC = cue.talk(lt, 'C');
        /* SHIPBUILDER: wades in, presents, points ✗, gets the pencil snatched, takes it back, writes, rubs */
        {
          let x = sbH, st = { y: FY, s: SC, at, bob: breath(at, .4), face: 'think', look: [-.6, .1] };
          const wIn = clamp((lt - (tCD + .05)) / 1.5);
          if (wIn < 1) { x = lerp(1560, sbH, ease(wIn)); Object.assign(st, walkSt(wIn * Math.PI * 5, wIn < 1 ? 1 : 0)); st.face = 'worried'; st.look = [-.8, 0]; }
          const step = win(lt, L(3) + 1.35, Le(5) - 2.3, .35, .4);            /* steps in to the board */
          x = lerp(x, 1060, step);
          if (step > 0 && step < 1) Object.assign(st, walkSt(step * Math.PI * 2, .7));
          const pen = (wx, wy, rot) => { st.hL = toLoc(x, FY, SC, wx, wy, st.bob || 0); st.propRotL = rot; };
          /* default: pencil hand at chest */
          st.hL = [-60, -170 + Math.sin(at * 1.3) * 3]; st.propRotL = 210;
          const takeEar = win(lt, L(3) + .1, L(3) + .45, .2, .2);
          if (lt < L(3) + .35) { st.hL = [lerp(-60, -40, takeEar), lerp(-150, -320, takeEar)]; }
          op(earPencil, lt < L(3) + .3 ? 1 : 0); op(pencilS, lt > L(3) + .3 && (lt < L(4) - .05 || (lt > L(5) + .25 && lt < L(8) + 3.95)) ? 1 : 0);
          /* "four": sweep over 1–4 */
          const s4 = win(lt, L(3) + .55, L(3) + 1.5, .25, .3);
          if (s4 > 0) { const sw = Math.sin((lt - L(3)) * 4) * 20; st.hL = [lerp(st.hL[0], -150, s4), lerp(st.hL[1], -290 + sw * .3, s4)]; st.propRotL = lerp(210, 196 + sw * .4, s4); st.look = [-.9, -.4]; st.face = 'focus'; }
          /* ✗ on 5, then on 6 */
          const X5 = trayW(cx_(5) + 40, 360, lt), X6 = trayW(cx_(6) + 40, 360, lt);
          const p5 = win(lt, L(3) + 1.5, L(3) + 2.9, .25, .25), p6 = win(lt, L(3) + 2.9, L(4) + .1, .25, .2);
          if (p5 > 0 || p6 > 0) { const tgt = p6 > 0 ? X6 : X5, jit = (lt > L(3) + 1.7 && lt < L(3) + 2.1) || (lt > L(3) + 3.2 && lt < L(3) + 3.6) ? Math.sin(lt * 40) * 6 : 0;
            const hx = tgt[0] + 72 + jit, hy = tgt[1] + 22 + jit * .5; const l0 = toLoc(x, FY, SC, hx, hy, st.bob);
            const k = Math.max(p5, p6); st.hL = [lerp(st.hL[0], l0[0], k), lerp(st.hL[1], l0[1], k)]; st.propRotL = 196; st.look = [-.9, -.5]; st.face = 'focus'; }
          /* snatched */
          const sn = clamp((lt - (L(4) - .1)) / .25);
          if (lt > L(4) - .1 && lt < L(5)) { st.face = 'surprise'; st.look = [-.6, -.2]; st.hL = [lerp(-150, -80, sn), lerp(-320, -230, sn)]; }
          /* takes it back (gently) */
          const tb = win(lt, L(5), L(5) + .7, .3, .3);
          const oHand = trayW(cx_(5) + 60, 520, lt);
          if (lt > L(5) - .1 && lt < L(5) + 1.5) { const l0 = toLoc(x, FY, SC, oHand[0] + 50, oHand[1] - 10, st.bob); st.hL = [lerp(-70, l0[0], tb), lerp(-200, l0[1], tb)]; st.propRotL = 200; st.face = talkS ? 'sad' : 'think'; st.look = [-.7, .2]; }
          if (lt > L(5) + .7 && lt < L(5) + 1.5) { const c5 = trayW(cx_(5), 480, lt), l0 = toLoc(x, FY, SC, c5[0] + 90, c5[1], st.bob); const q = clamp((lt - L(5) - .7) / .3); st.hL = [lerp(st.hL[0], l0[0], q), lerp(st.hL[1], l0[1], q)]; st.propRotL = 196; st.look = [-.9, -.2]; }
          /* writes 6 > 4 */
          const wrt = win(lt, L(5) + 1.5, L(5) + 2.7, .3, .3);
          if (wrt > 0) { const sw = [SUM[0] + (clamp((lt - L(5) - 1.6) / 1) - .5) * 100, SUM[1] - 14]; const l0 = toLoc(x, FY, SC, sw[0] + 60, sw[1] + Math.sin(lt * 30) * 5, st.bob);
            st.hL = [lerp(st.hL[0], l0[0], wrt), lerp(st.hL[1], l0[1], wrt)]; st.propRotL = 160; st.look = [-.8, .3]; st.face = 'sad'; }
          /* line 8: rubs the sum out, recoils when it returns, looks at his pencil */
          const rb = win(lt, L(8) - .15, L(8) + .9, .2, .25);
          if (rb > 0) { const sw = [SUM[0] + Math.sin(lt * 26) * 46, SUM[1] - 14 + Math.cos(lt * 26) * 8]; const l0 = toLoc(x, FY, SC, sw[0] + 28, sw[1] + 28, st.bob);
            st.hL = [lerp(st.hL[0], l0[0], rb), lerp(st.hL[1], l0[1], rb)]; st.propRotL = 45; st.look = [-.7, .4]; st.face = 'focus'; }
          const rc = win(lt, L(8) + 1.05, L(8) + 2.4, .15, .4);
          if (rc > 0) { st.face = 'surprise'; st.tilt = 5 * rc; st.look = [-.8, .2]; st.hL = [lerp(st.hL[0], -40, rc), lerp(st.hL[1], -190, rc)]; }
          const lp = win(lt, L(8) + 2.9, L(8) + 3.9, .2, .3);
          if (lp > 0) { st.hL = [lerp(st.hL[0], -40, lp), lerp(st.hL[1], -238, lp)]; st.propRotL = lerp(st.propRotL || 45, 272, lp); st.look = [-.5 * lp, -.6 * lp]; st.face = 'think'; st.headTilt = -7 * lp; }
          if (lt > L(8) + 3.9) { st.face = 'sad'; st.look = [-.2, .3]; st.hL = [-60, -160]; }
          /* reactions while others speak */
          if (lt > L(6) - .5 && lt < L(7) - .2) { st.look = [-1, .1]; st.face = 'neutral'; }
          if (lt > L(7) - .2 && lt < L(8) - .3) { st.look = [-1, -.1]; st.face = lt > L(7) + 1.4 ? 'worried' : 'surprise'; }
          st.talk = talkS; if (talkS && lt > L(3) + 1.4 && lt < L(4)) st.headTilt = Math.sin(at * 6) * 3;
          st.x = x; sbX = x; sb.set(st);
        }
        /* OWNER */
        {
          let x = owH; const st = { y: FY, s: SC, at, bob: breath(at, 2.2), face: 'worried', look: [.8, 0], sweat: 0 };
          const lift = Math.sin(at * .7) > .75 ? 1 : 0; st.fR = [22, -lift * 18];
          st.hL = [-74, -128]; st.hR = [70, -140];
          if (lt < L(4) - .35) { st.face = lt > L(3) + 2 ? 'scared' : 'worried'; st.sweat = clamp((lt - L(3) - 2) / 1.5) * .8; st.look = [.9, -.2]; if (lt > L(3) + 3.2) { st.hR = [30, -250]; } }
          /* line 4: lunge, snatch, rub */
          const lg = win(lt, L(4) - .35, L(5) + .75, .25, .5);
          x = lerp(owH, 640, lg);
          if (lg > 0 && lg < 1) Object.assign(st, walkSt(lg * Math.PI * 2, .8));
          const x6w = trayW(cx_(6) + 40, 360, lt), sbPen = [x6w[0] + 72, x6w[1] + 22];
          if (lt > L(4) - .3 && lt < L(4) + .25) { const l0 = toLoc(x, FY, SC, sbPen[0] - 10, sbPen[1], st.bob); const q = clamp((lt - L(4) + .3) / .25); st.hR = [lerp(70, l0[0], q), lerp(-140, l0[1], q)]; st.face = 'focus'; st.look = [1, -.5]; }
          const rubbing = lt > L(4) + .25 && lt < L(4) + 1.6;
          const rubP = trayW(cx_(5), 480 + Math.sin(lt * 30) * 90, lt);
          if (rubbing) { const jx = Math.sin(lt * 42) * 26; const l0 = toLoc(x, FY, SC, rubP[0] - 26 + jx, rubP[1] + 26, st.bob); st.hR = l0; st.face = 'focus'; st.look = [1, -.4]; st.sweat = .9; st.tilt = Math.sin(lt * 42) * 2; }
          if (lt > L(4) + 1.6 && lt < L(5) + .4) { const o5 = trayW(cx_(5) + 60, 520, lt), l0 = toLoc(x, FY, SC, o5[0], o5[1], st.bob); const q = clamp((lt - L(4) - 1.6) / .25); st.hR = [lerp(st.hR[0], l0[0], q), lerp(st.hR[1], l0[1], q)]; st.face = 'joy'; st.look = [-.2, -.2]; }
          if (lt > L(5) + .4 && lt < L(6) - .6) { st.face = lt > L(5) + 1.5 ? 'sad' : 'surprise'; st.look = [.9, 0]; st.sweat = .7; st.hR = [56, -150]; }
          op(pencilO, lt > L(4) - .05 && lt < L(5) + .35 ? 1 : 0);
          st.propRotR = rubbing ? 135 : -30;
          /* line 6: looks at the Captain */
          if (lt > L(6) - .6 && lt < L(7) - .4) { st.look = [-1, -.1]; st.face = 'worried'; }
          /* line 7: the wad */
          const W0 = L(7) - .25;
          const step7 = win(lt, W0 - .3, Le(7) + .5, .3, .4);
          x = lerp(x, 470, step7);
          const pocketL = [34, -176], mouth = [12, -258], slapW = [612, 460];
          const slapL = toLoc(x, FY, SC, slapW[0] - 30, slapW[1] + 12, st.bob);
          let wadIn = false, wadOnBoard = false, hand = null;
          const tPull = W0, tLick = W0 + .4, tSlap = W0 + .95, tPeel = W0 + 1.5, tFall = W0 + 2.15, tCatch = W0 + 2.35, tTuck = W0 + 2.55, tBack = W0 + 3.0;
          if (lt > tPull - .25 && lt < tBack + .2) {
            const k = (a, b, t0, d) => lerp(a, b, ease(clamp((lt - t0) / d)));
            if (lt < tPull + .2) { const q = clamp((lt - tPull + .25) / .35); hand = [lerp(70, pocketL[0], q), lerp(-140, pocketL[1], q)]; }
            else if (lt < tLick + .45) { hand = [k(pocketL[0], mouth[0], tPull + .2, .3), k(pocketL[1], mouth[1], tPull + .2, .3)]; }
            else if (lt < tSlap + .1) { hand = [k(mouth[0], slapL[0], tLick + .45, .2), k(mouth[1], slapL[1], tLick + .45, .2)]; }
            else if (lt < tFall) { hand = [k(slapL[0], 60, tSlap + .15, .3), k(slapL[1], -200, tSlap + .15, .3)]; }
            else if (lt < tTuck) { const cw = toLoc(x, FY, SC, slapW[0] - 40, slapW[1] + 120, st.bob); hand = [k(60, cw[0], tFall - .2, .25), k(-200, cw[1], tFall - .2, .25)]; }
            else { const cw = toLoc(x, FY, SC, slapW[0] - 40, slapW[1] + 120, st.bob); hand = [k(cw[0], pocketL[0], tTuck, .35), k(cw[1], pocketL[1], tTuck, .35)]; if (lt > tBack) hand = [k(pocketL[0], 70, tBack, .2), k(pocketL[1], -140, tBack, .2)]; }
            st.hR = hand; st.propRotR = 0;
            wadIn = (lt > tPull + .05 && lt < tSlap) || (lt > tCatch && lt < tTuck + .3);
            wadOnBoard = lt >= tSlap && lt < tCatch;
            st.face = lt < tLick ? 'smug' : lt < tLick + .45 ? 'joy' : lt < tPeel ? 'proud' : lt < tCatch ? 'worried' : 'sad';
            st.look = lt < tLick + .45 ? [.3, .4] : [.9, -.4]; st.blush = lt > tCatch ? .7 : 0;
            if (lt > tLick && lt < tLick + .45) st.headTilt = Math.sin((lt - tLick) * 30) * 4;
          }
          op(tongue, lt > tLick + .05 && lt < tLick + .4 ? 1 : 0); if (lt > tLick && lt < tLick + .45) tf(tongue, Math.sin(lt * 34) * 2, Math.abs(Math.sin(lt * 17)) * 3);
          op(wadHand.g, wadIn ? 1 : 0); wadHand.set({ x: 0, y: -4, s: .55, crumple: 1, at, rot: lt * 30 % 360 * 0 });
          pocket.set({ s: wadIn || wadOnBoard || (lt > tPull - .02 && lt < tTuck + .3) ? 0 : 1.3 });
          op(wadPiv, wadOnBoard ? 1 : 0);
          if (wadOnBoard) { const pe = clamp((lt - tPeel) / .6), fa = clamp((lt - tFall) / .2);
            const sl = pop(lt, tSlap, .25);
            tf(wadPiv, slapW[0] - 66, slapW[1] - 14 + fa * fa * 110, -6 + pe * 70 + fa * 30);
            tf(wadInner, 66, 14, 0, 1, 1 - pe * .25); wordB.set({ x: 0, y: 0, s: .7 * (.7 + .3 * sl), crumple: lerp(.06, .3, pe), at, flutter: pe * .5 }); op(wrink, 1 - pe); }
          op(slapD, win(lt, tSlap, tSlap + .4, .03, .25)); tf(slapD, slapW[0], slapW[1] - 30, 0, 1.2);
          /* line 8: the abacus */
          const ab = win(lt, L(8) + .6, DUR, .35, .3);
          op(abacus, ab);
          { const k = Math.max(win(lt, L(8) + 2.15, L(8) + 2.5, .04, .25), win(lt, L(8) + 3.2, L(8) + 3.6, .04, .25)); op(snapMk, k);
            if (k > 0) tf(snapMk, x + SC * 62, FY - SC * 236, 8, .8 + .2 * k); }

          if (ab > 0) { st.hL = [-70, -186]; st.hR = [70, -186]; st.look = [.1, .6]; st.face = 'worried'; st.sweat = .4;
            const pushT = L(8) + 1.4, snap = L(8) + 2.15, push2 = L(8) + 2.6, snap2 = L(8) + 3.2;
            const mv = clamp((lt - pushT) / .3) * (1 - easeOut(clamp((lt - snap) / .15))) + clamp((lt - push2) / .25) * (1 - easeOut(clamp((lt - snap2) / .12)));
            beadRows.forEach((r, ri) => r.bs.forEach((b, k) => { let bx = ri === 0 ? 54 - (r.n - 1 - k) * 15 : -54 + k * 15; if (ri === 0 && k < 2) bx -= mv * 50; tf(b, bx, 0); }));
            if (lt > pushT - .2 && lt < snap2 + .4) { st.hR = [lerp(70, 10, Math.min(1, mv * 1.4)), -200]; st.face = mv > .5 ? 'smug' : 'scared'; }
            if (lt > snap2 + .3) { st.face = 'sad'; st.look = [.8, -.2]; } }
          st.talk = talkO; st.x = x; owX = x; owner.set(st);
          if (lt > L(4) + .25 && lt < L(4) + 1.6) { const c = crumbsD; c.forEach((e, i) => { const ph = (lt * 3 + i / 7) % 1; sa(e, 'cx', f2(rubP[0] + (i - 3) * 9 + ph * (i % 2 ? 40 : -40))); sa(e, 'cy', f2(rubP[1] + ph * 120 + ph * ph * 60)); op(e, 1 - ph); }); }
          else if (lt > L(8) - .05 && lt < L(8) + .9) { const sp = [SUM[0], SUM[1] - 10];
 crumbsD.forEach((e, i) => { const ph = (lt * 3 + i / 7) % 1; sa(e, 'cx', f2(sp[0] + (i - 3) * 14 + ph * (i % 2 ? 30 : -30))); sa(e, 'cy', f2(sp[1] + ph * 100 + ph * ph * 50)); op(e, 1 - ph); }); }
          else crumbsD.forEach(e => op(e, 0));
        }
        /* CAPTAIN: perfectly calm, tea in hand */
        {
          const st = { x: capX, y: FY, s: SC, at, bob: breath(at, 3.1) * .6, face: 'neutral', look: [.8, 0], hL: [-30, -176], talk: talkC };
          if (lt < L(4)) st.look = [1, -.2]; else if (lt < L(6) - .6) st.look = [.9, -.1];
          const T6 = L(6);
          const up_ = clamp((lt - (T6 - .45)) / .25), off = clamp((lt - (T6 - .2)) / .2), nod = win(lt, T6 + .05, T6 + .4, .15, .2), on = clamp((lt - (T6 + .55)) / .25), down = clamp((lt - (T6 + .85)) / .3);
          let capDy = 0, capR = 0;
          if (lt > T6 - .5 && lt < T6 + 1.2) { const lifted = off * (1 - on);
            capDy = -26 * lifted; capR = -16 * lifted;
            st.hR = [lerp(lerp(60, 50, up_), 60, down), lerp(lerp(-140, -352, up_), -140, down) + capDy]; st.bendR = -30;
            st.hy = nod * 9; st.lid = nod * .8; st.face = 'proud'; st.look = [.2, .3 * nod]; }
          capt.set(st);
          if (capHat) capHat.setAttribute('transform', `translate(0,${f2(capDy)}) rotate(${f2(capR)} 0 -370)`);
          const rp = clamp((lt - (T6 + .2)) / .8);
          cup.set({ x: 0, y: 12, s: .95, at, ripple: rp > 0 && rp < 1 ? rp : 0, steam: 1 });
          sa(cupRing, 'rx', f2(3 + rp * 14.5)); sa(cupRing, 'ry', f2(.6 + rp * 2.9)); sa(cupRing, 'opacity', f2(rp > 0 && rp < 1 ? Math.sin(Math.PI * rp) : 0));
        }
        /* ripples round the legs, splashes while wading */
        [[sbX, 0], [owX, 1], [capX, 2]].forEach(([x, k]) => [0, 1].forEach(j => { const e = ringsD[k * 2 + j], ph = (at * .55 + j * .5 + k * .3) % 1;
          sa(e, 'cx', f2(x)); sa(e, 'cy', f2(wl + 4)); sa(e, 'rx', f2(50 + ph * 70)); sa(e, 'ry', f2(7 + ph * 9)); sa(e, 'stroke-opacity', f2((1 - ph) * .7)); }));
        const wadeK = clamp((lt - (tCD + .05)) / 1.5) < 1 && lt > tCD ? 1 : (lt > L(4) - .4 && lt < L(4) + .1) || (lt > L(3) + 1.3 && lt < L(3) + 1.8) ? .7 : 0;
        splashD.forEach((e, i) => { const ph = (at * 2.2 + i / 8) % 1; const x = (i % 2 ? owX : sbX) + (i - 3.5) * 14;
          op(e, wadeK * (1 - ph)); if (wadeK) { sa(e, 'cx', f2(x + (i % 3 - 1) * ph * 40)); sa(e, 'cy', f2(wl - Math.sin(Math.PI * ph) * 40)); } });
      }
    }
  };
}});
