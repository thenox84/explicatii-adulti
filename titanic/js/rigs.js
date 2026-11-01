"use strict";
/* =====================================================================
   PERSONAJE ARTICULATE
   Robot(...)  – agentul (șeful de șantier) și subagenții
   Human(...)  – Tudor și alți oameni
   Ambele: origine = la tălpi (0,0); înălțime ≈ 330 px la scala 1.
   Se animă prin .set(st) la fiecare cadru. Coordonatele mâinilor/picioarelor
   sunt în sistemul local al personajului.
   ===================================================================== */

/* membru „din furtun” (rubber-hose): M a Q c b, cu cot/genunchi îndoit */
function hose(el, a, b, bend) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / L * bend, cy = my + dx / L * bend;
  el.setAttribute('d', `M${f2(a[0])},${f2(a[1])} Q${f2(cx)},${f2(cy)} ${f2(b[0])},${f2(b[1])}`);
  return Math.atan2(b[1] - cy, b[0] - cx) * 180 / Math.PI;
}

/* ciclu de mers: ph în radiani; întoarce picioare, bob, balans brațe */
function walkCycle(ph, stride = 22, lift = 16, spread = 22) {
  const a = Math.sin(ph), b = Math.cos(ph);
  return {
    fL: [-spread + a * stride, -Math.max(0, b) * lift],
    fR: [spread - a * stride, -Math.max(0, -b) * lift],
    bob: -Math.abs(b) * 6 + 3, swing: a
  };
}

/* ----------------------------------------------------------------- */
function Robot(parent, o = {}) {
  const c = o.color || '#F2994A', d = shade(c, -.3), l = shade(c, .4);
  const eyeC = o.eye || '#A8F4FF';
  const root = G(parent);
  const shadow = E('ellipse', { cx: 0, cy: 3, rx: 62, ry: 12, fill: '#000', 'fill-opacity': .22 }, root);
  /* picioare */
  const legs = G(root);
  const legL = E('path', { fill: 'none', stroke: d, 'stroke-width': 15, 'stroke-linecap': 'round' }, legs);
  const legR = E('path', { fill: 'none', stroke: d, 'stroke-width': 15, 'stroke-linecap': 'round' }, legs);
  const boot = () => { const b = G(legs); E('path', { d: 'M-19,1 Q-21,-17 0,-18 Q21,-17 21,1 Z', fill: '#2B3047' }, b); E('rect', { x: -21, y: -3, width: 42, height: 6, rx: 3, fill: '#1B1F30' }, b); return b; };
  const bootL = boot(), bootR = boot();
  /* corp superior (bob + înclinare) */
  const up = G(root);
  const armBackL = E('path', { fill: 'none', stroke: d, 'stroke-width': 13, 'stroke-linecap': 'round' }, up);
  const torso = G(up);
  E('rect', { x: -50, y: -176, width: 100, height: 116, rx: 44, fill: c }, torso);
  E('path', { d: 'M8,-176 Q50,-174 50,-130 L50,-104 Q50,-60 8,-60 Z', fill: d, 'fill-opacity': .32 }, torso);
  E('rect', { x: -31, y: -148, width: 62, height: 52, rx: 17, fill: l, 'fill-opacity': .6 }, torso);
  const chest = E('circle', { cx: 0, cy: -122, r: 7.5, fill: '#7CFFB2' }, torso);
  const chestG = E('circle', { cx: 0, cy: -122, r: 16, fill: '#7CFFB2', 'fill-opacity': .25 }, torso);
  [-18, 18].forEach(x => E('circle', { cx: x, cy: -106, r: 3, fill: d, 'fill-opacity': .6 }, torso));
  if (o.belt) { E('rect', { x: -50, y: -82, width: 100, height: 14, rx: 6, fill: '#6B4A2B' }, torso); E('rect', { x: -10, y: -84, width: 20, height: 18, rx: 4, fill: '#D9B45A' }, torso);
    E('rect', { x: 26, y: -78, width: 12, height: 26, rx: 3, fill: '#8C6239' }, torso); E('rect', { x: -40, y: -78, width: 10, height: 22, rx: 3, fill: '#5C5F73' }, torso); }
  if (o.badge) { const bg = G(torso); tf(bg, 30, -150); E('circle', { r: 11, fill: '#fff' }, bg); E('path', { d: 'M-5,0 L-1,4 L6,-4', stroke: c, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, bg); }
  E('rect', { x: -12, y: -190, width: 24, height: 20, rx: 7, fill: d }, torso);
  /* cap */
  const head = G(up);
  const headIn = G(head);
  E('rect', { x: -60, y: -280, width: 120, height: 98, rx: 34, fill: c }, headIn);
  E('path', { d: 'M-60,-214 Q-60,-182 -26,-182 L26,-182 Q60,-182 60,-214 Z', fill: d, 'fill-opacity': .3 }, headIn);
  [-1, 1].forEach(s => { E('circle', { cx: s * 62, cy: -231, r: 10, fill: d }, headIn); E('circle', { cx: s * 62, cy: -231, r: 4, fill: l }, headIn); });
  E('rect', { x: -47, y: -267, width: 94, height: 72, rx: 23, fill: '#141A2C' }, headIn);
  E('path', { d: 'M-38,-256 Q-33,-262 -20,-262', stroke: '#fff', 'stroke-opacity': .22, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, headIn);
  const face = G(headIn);
  const cheeks = G(face); [-1, 1].forEach(s => E('ellipse', { cx: s * 30, cy: -209, rx: 8, ry: 5, fill: '#FF7AA2', 'fill-opacity': .55 }, cheeks));
  const eyes = [-1, 1].map(s => {
    const g = G(face); const open = E('rect', { x: -8, y: -12, width: 16, height: 24, rx: 8, fill: eyeC }, g);
    const hap = E('path', { d: 'M-9,5 Q0,-9 9,5', stroke: eyeC, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
    const glow = E('rect', { x: -12, y: -16, width: 24, height: 32, rx: 12, fill: eyeC, 'fill-opacity': .18 }, g);
    return { g, open, hap, glow, s };
  });
  const brows = [-1, 1].map(s => E('rect', { x: -9, y: -2.5, width: 18, height: 5, rx: 2.5, fill: eyeC }, face));
  const mouth = E('path', { stroke: eyeC, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, face);
  if (o.glasses) { const gl = G(headIn); [-1, 1].forEach(s => E('circle', { cx: s * 19, cy: -230, r: 17, fill: '#fff', 'fill-opacity': .06, stroke: '#E8E1C9', 'stroke-width': 3.5 }, gl)); E('path', { d: 'M-3,-232 Q0,-236 3,-232', stroke: '#E8E1C9', 'stroke-width': 3, fill: 'none' }, gl); }
  /* pălării */
  if (o.hat === 'hard') {
    const h = G(headIn);
    E('path', { d: 'M-64,-266 C-66,-334 66,-334 64,-266 Z', fill: '#F7C948' }, h);
    E('path', { d: 'M12,-328 C46,-322 62,-300 64,-266 L40,-266 C40,-296 30,-316 12,-328 Z', fill: '#D9A521' }, h);
    E('rect', { x: -9, y: -330, width: 18, height: 62, rx: 6, fill: '#E6B530' }, h);
    E('rect', { x: -78, y: -272, width: 156, height: 13, rx: 6.5, fill: '#E0A82E' }, h);
    E('path', { d: 'M-40,-312 Q-30,-322 -14,-324', stroke: '#fff', 'stroke-opacity': .45, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, h);
  } else if (o.hat === 'cap') {
    const h = G(headIn);
    E('path', { d: 'M-58,-262 C-60,-318 58,-318 58,-262 Z', fill: o.capColor || '#E84855' }, h);
    E('path', { d: 'M10,-268 Q60,-276 92,-262 Q86,-252 10,-256 Z', fill: shade(o.capColor || '#E84855', -.25) }, h);
    E('circle', { cx: 0, cy: -312, r: 5, fill: shade(o.capColor || '#E84855', -.25) }, h);
  } else if (o.hat === 'beret') {
    const h = G(headIn);
    E('ellipse', { cx: -6, cy: -282, rx: 62, ry: 20, fill: o.capColor || '#3A3F8F' }, h);
    E('circle', { cx: -6, cy: -302, r: 5, fill: o.capColor || '#3A3F8F' }, h);
  } else if (o.antenna !== false) {
    const h = G(headIn); E('rect', { x: -3, y: -306, width: 6, height: 28, rx: 3, fill: d }, h);
    E('circle', { cx: 0, cy: -308, r: 8, fill: o.tip || '#FFD166' }, h);
  }
  /* brațe (în față) */
  const armL = E('path', { fill: 'none', stroke: d, 'stroke-width': 13, 'stroke-linecap': 'round' }, up);
  const armR = E('path', { fill: 'none', stroke: d, 'stroke-width': 13, 'stroke-linecap': 'round' }, up);
  const hand = () => { const h = G(up); const hi = G(h); E('rect', { x: -10, y: -24, width: 20, height: 10, rx: 4, fill: d }, hi);
    E('circle', { r: 14.5, fill: '#F4F6FB' }, hi); E('circle', { cx: -11, cy: -4, r: 6.5, fill: '#F4F6FB' }, hi);
    E('path', { d: 'M-4,6 Q2,9 8,5', stroke: '#C9CFDE', 'stroke-width': 2, fill: 'none' }, hi); const prop = G(h); return { h, hi, prop }; };
  const hL = hand(), hR = hand();
  armBackL.style.display = 'none';
  const R = { root, up, head, torso, propL: hL.prop, propR: hR.prop, handL: hL.h, handR: hR.h, color: c, dark: d, light: l };
  R.set = function (st) {
    const s = (st.s != null ? st.s : (o.scale || 1));
    tf(root, st.x || 0, st.y || 0, st.rot || 0, s * (st.flip ? -1 : 1), s * (st.squash || 1));
    const bob = st.bob || 0, tilt = st.tilt || 0;
    up.setAttribute('transform', `translate(0,${f2(bob)}) rotate(${f2(tilt)} 0 -66)`);
    op(shadow, st.air ? .12 : 1);
    /* picioare */
    const fL = st.fL || [-24, 0], fR = st.fR || [24, 0];
    const tl = tilt * Math.PI / 180;
    const hip = sx => [sx * Math.cos(tl) - (-66) * Math.sin(tl) * 0, -66 + bob + sx * Math.sin(tl)];
    hose(legL, hip(-20), [fL[0], fL[1] - 14], -8);
    hose(legR, hip(20), [fR[0], fR[1] - 14], 8);
    tf(bootL, fL[0] - 3, fL[1]); tf(bootR, fR[0] + 3, fR[1]);
    op(legs, st.noLegs ? 0 : 1);
    /* cap */
    head.setAttribute('transform', `translate(${f2(st.hx || 0)},${f2(st.hy || 0)}) rotate(${f2(st.headTilt || 0)} 0 -186)`);
    const lk = st.look || [0, 0];
    tf(face, lk[0] * 7, lk[1] * 5);
    /* expresii */
    const ex = st.face || 'neutral', at = st.at || 0;
    const bl = st.noBlink ? 1 : blink(at, o.seed || 1);
    let eyeH = 1, eyeS = 1, happy = 0, bR = 0, bY = -253, mouthD = 'M-10,-207 Q0,-201 10,-207', ch = 0;
    switch (ex) {
      case 'happy': happy = 1; mouthD = 'M-14,-210 Q0,-194 14,-210'; ch = 1; bY = -258; break;
      case 'joy': happy = 1; mouthD = 'M-15,-211 Q0,-188 15,-211 Z'; ch = 1; bY = -260; break;
      case 'focus': eyeH = .5; bR = 14; bY = -249; mouthD = 'M-9,-205 L9,-205'; break;
      case 'surprise': eyeS = 1.25; bY = -262; mouthD = 'M-6,-206 Q0,-196 6,-206 Q0,-214 -6,-206 Z'; break;
      case 'worried': bR = -16; bY = -255; mouthD = 'M-11,-202 Q-5,-208 0,-204 Q5,-200 11,-205'; break;
      case 'think': bR = -8; bY = -256; mouthD = 'M-8,-205 Q2,-203 10,-208'; break;
      case 'sad': bR = -18; mouthD = 'M-11,-201 Q0,-210 11,-201'; break;
      case 'proud': happy = 1; bY = -258; mouthD = 'M-13,-208 Q0,-198 13,-208'; ch = .6; break;
    }
    if (st.talk) { const m = .5 + .5 * Math.abs(Math.sin(at * 13) * Math.sin(at * 5.3 + 1)); mouthD = `M-10,-207 Q0,${f2(-207 + 14 * m)} 10,-207 Q0,${f2(-207 + 4 * m)} -10,-207 Z`; }
    mouth.setAttribute('d', mouthD);
    mouth.setAttribute('fill', (ex === 'joy' || ex === 'surprise' || st.talk) ? eyeC : 'none');
    op(cheeks, ch);
    eyes.forEach(e => {
      tf(e.g, e.s * 19, -230, 0, eyeS, eyeS * (happy ? 1 : eyeH * Math.max(.08, bl)));
      op(e.open, happy ? 0 : 1); op(e.hap, happy ? 1 : 0); op(e.glow, happy ? 0 : 1);
    });
    brows.forEach((b, i) => { const sd = i ? 1 : -1; b.setAttribute('transform', `translate(${sd * 19},${bY}) rotate(${sd * bR})`); });
    /* lumină piept */
    const lc = st.light || '#7CFFB2'; chest.setAttribute('fill', lc); chestG.setAttribute('fill', lc);
    chestG.setAttribute('r', f2(13 + 4 * Math.sin(at * 3)));
    /* brațe */
    const sL = [-48, -150], sR = [48, -150];
    const pL = st.hL || [-66, -92 + Math.sin(at * 1.7) * 3], pR = st.hR || [66, -92 + Math.sin(at * 1.7 + 1) * 3];
    const aL = hose(armL, sL, pL, st.bendL != null ? st.bendL : 14);
    const aR = hose(armR, sR, pR, st.bendR != null ? st.bendR : -14);
    tf(hL.h, pL[0], pL[1], 0); tf(hL.hi, 0, 0, aL - 90 + (st.rotL || 0), 1);
    tf(hR.h, pR[0], pR[1], 0); tf(hR.hi, 0, 0, aR - 90 + (st.rotR || 0), -1, 1);
    tf(hL.prop, 0, 0, st.propRotL || 0); tf(hR.prop, 0, 0, st.propRotR || 0);
  };
  R.set({});
  return R;
}

/* ----------------------------------------------------------------- */
function Human(parent, o = {}) {
  const skin = o.skin || '#F1C27D', sd = shade(skin, -.16);
  const jacket = o.jacket || '#34495E', shirt = o.shirt || '#DCEBFA', pants = o.pants || '#2C3040', hair = o.hair || '#4A3226';
  const root = G(parent);
  const shadow = E('ellipse', { cx: 0, cy: 3, rx: 60, ry: 11, fill: '#000', 'fill-opacity': .22 }, root);
  const legs = G(root);
  const legL = E('path', { fill: 'none', stroke: pants, 'stroke-width': 25, 'stroke-linecap': 'round' }, legs);
  const legR = E('path', { fill: 'none', stroke: pants, 'stroke-width': 25, 'stroke-linecap': 'round' }, legs);
  const shoe = s => { const g = G(legs); E('path', { d: `M${-14 * s},2 Q${-16 * s},-14 ${4 * s},-14 Q${26 * s},-12 ${28 * s},2 Z`, fill: o.shoes || '#3B2A20' }, g); return g; };
  const shL = shoe(-1), shR = shoe(1);
  const up = G(root);
  const torso = G(up);
  E('path', { d: 'M-54,-236 Q-58,-246 -38,-252 L38,-252 Q58,-246 54,-236 L48,-112 Q0,-100 -48,-112 Z', fill: jacket }, torso);
  E('path', { d: 'M-17,-252 L0,-200 L17,-252 Z', fill: shirt }, torso);
  if (o.tie !== false) E('path', { d: 'M-6,-246 L6,-246 L10,-200 L0,-186 L-10,-200 Z', fill: o.tie || '#9B2C3C' }, torso);
  E('path', { d: 'M-17,-252 L-4,-238 L-14,-232 Z M17,-252 L4,-238 L14,-232 Z', fill: shade(shirt, .4) }, torso);
  E('path', { d: 'M18,-250 Q50,-244 52,-232 L46,-112 Q30,-106 14,-104 Z', fill: '#000', 'fill-opacity': .12 }, torso);
  if (o.apron) E('path', { d: 'M-34,-196 L34,-196 L40,-96 Q0,-88 -40,-96 Z', fill: o.apron }, torso);
  [-150, -128].forEach(y => E('circle', { cx: 0, cy: y, r: 3.2, fill: shade(jacket, -.35) }, torso));
  E('rect', { x: -13, y: -270, width: 26, height: 24, rx: 8, fill: sd }, torso);
  /* cap */
  const head = G(up);
  const hin = G(head);
  [-1, 1].forEach(s => E('ellipse', { cx: s * 43, cy: -304, rx: 9, ry: 12, fill: sd }, hin));
  E('ellipse', { cx: 0, cy: -308, rx: 44, ry: 48, fill: skin }, hin);
  const face = G(hin);
  const blush = G(face); [-1, 1].forEach(s => E('ellipse', { cx: s * 25, cy: -290, rx: 9, ry: 5, fill: '#FF8A80', 'fill-opacity': .45 }, blush));
  const eyes = [-1, 1].map(s => { const g = G(face); E('ellipse', { rx: 5.2, ry: 6.8, fill: '#2A1E1A' }, g); E('circle', { cx: 1.8, cy: -2.5, r: 1.8, fill: '#fff' }, g); return { g, s }; });
  const hapEyes = G(face); [-1, 1].forEach(s => E('path', { d: `M${s * 15 - 7},-302 Q${s * 15},-311 ${s * 15 + 7},-302`, stroke: '#2A1E1A', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, hapEyes));
  const brows = [-1, 1].map(s => E('path', { d: 'M-8,0 Q0,-4 8,0', stroke: shade(hair, -.1), 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }, face));
  E('path', { d: 'M1,-300 Q7,-288 0,-285', stroke: sd, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, face);
  const mouth = E('path', { stroke: '#7A3B2E', 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, face);
  if (o.mustache) E('path', { d: 'M-16,-278 Q-8,-286 0,-281 Q8,-286 16,-278 Q8,-276 0,-279 Q-8,-276 -16,-278 Z', fill: hair }, face);
  if (o.glasses !== false) { const gl = G(face); [-1, 1].forEach(s => E('rect', { x: s * 15 - 13, y: -315, width: 26, height: 22, rx: 8, fill: '#fff', 'fill-opacity': .14, stroke: '#2B2B35', 'stroke-width': 3 }, gl)); E('path', { d: 'M-2,-306 Q0,-309 2,-306', stroke: '#2B2B35', 'stroke-width': 3, fill: 'none' }, gl); }
  /* păr */
  const hs = o.hairStyle || 'side';
  if (hs === 'side') {
    E('path', { d: 'M-46,-306 Q-50,-360 -4,-362 Q42,-362 47,-312 Q44,-330 26,-338 Q8,-334 -12,-340 Q-30,-336 -38,-322 Q-44,-314 -46,-306 Z', fill: hair }, hin);
    E('path', { d: 'M-44,-312 Q-46,-296 -42,-288 L-38,-300 Z M44,-312 Q46,-296 42,-288 L38,-300 Z', fill: shade(hair, .35) }, hin);
  } else if (hs === 'bun') {
    E('circle', { cx: 0, cy: -362, r: 20, fill: hair }, hin);
    E('path', { d: 'M-47,-296 Q-52,-358 0,-360 Q52,-358 47,-296 Q42,-330 0,-336 Q-42,-330 -47,-296 Z', fill: hair }, hin);
  } else if (hs === 'long') {
    E('path', { d: 'M-48,-250 Q-58,-360 0,-362 Q58,-360 48,-250 Q40,-300 38,-330 Q0,-344 -38,-330 Q-40,-300 -48,-250 Z', fill: hair }, hin);
  } else if (hs === 'kid') {
    E('path', { d: 'M-46,-300 Q-48,-362 0,-362 Q48,-362 46,-300 Q36,-332 16,-326 Q20,-342 -2,-334 Q-20,-340 -30,-324 Q-40,-318 -46,-300 Z', fill: hair }, hin);
  }
  if (o.scarf) E('path', { d: 'M-46,-312 Q-50,-366 0,-366 Q50,-366 46,-312 L52,-280 Q0,-262 -52,-280 Z', fill: o.scarf, 'fill-opacity': .95 }, hin);
  /* brațe */
  const armL = E('path', { fill: 'none', stroke: jacket, 'stroke-width': 21, 'stroke-linecap': 'round' }, up);
  const armR = E('path', { fill: 'none', stroke: jacket, 'stroke-width': 21, 'stroke-linecap': 'round' }, up);
  const hand = () => { const h = G(up); const hi = G(h); E('circle', { r: 12.5, fill: skin }, hi); E('ellipse', { cx: -9, cy: -6, rx: 5, ry: 6.5, fill: skin }, hi); const prop = G(h); return { h, hi, prop }; };
  const hL = hand(), hR = hand();
  const R = { root, up, head, torso, propL: hL.prop, propR: hR.prop, handL: hL.h, handR: hR.h };
  R.set = function (st) {
    const s = st.s != null ? st.s : (o.scale || 1);
    tf(root, st.x || 0, st.y || 0, st.rot || 0, s * (st.flip ? -1 : 1), s);
    const bob = st.bob || 0, tilt = st.tilt || 0;
    up.setAttribute('transform', `translate(0,${f2(bob)}) rotate(${f2(tilt)} 0 -112)`);
    const fL = st.fL || [-22, 0], fR = st.fR || [22, 0];
    if (st.sit) { hose(legL, [-18, -112 + bob], [-28, -40], -10); hose(legR, [18, -112 + bob], [28, -40], 10); tf(shL, -28, -30); tf(shR, 28, -30); }
    else { hose(legL, [-18, -112 + bob], [fL[0], fL[1] - 10], -6); hose(legR, [18, -112 + bob], [fR[0], fR[1] - 10], 6); tf(shL, fL[0], fL[1]); tf(shR, fR[0], fR[1]); }
    op(legs, st.noLegs ? 0 : 1); op(shadow, st.noLegs ? 0 : 1);
    head.setAttribute('transform', `translate(${f2(st.hx || 0)},${f2(st.hy || 0)}) rotate(${f2(st.headTilt || 0)} 0 -262)`);
    const lk = st.look || [0, 0], turn = st.turn || 0;
    tf(face, turn * 9 + lk[0] * 2, lk[1] * 2);
    const ex = st.face || 'neutral', at = st.at || 0, bl = blink(at, o.seed || 3);
    let mouthD = 'M-11,-276 Q0,-268 11,-276', bY = -323, bR = 0, hap = 0, eyeY = 1, bl2 = 0;
    switch (ex) {
      case 'happy': mouthD = 'M-14,-279 Q0,-264 14,-279 Z'; bY = -327; bl2 = 1; break;
      case 'joy': hap = 1; mouthD = 'M-15,-280 Q0,-260 15,-280 Z'; bY = -329; bl2 = 1; break;
      case 'surprise': mouthD = 'M-6,-276 Q0,-264 6,-276 Q0,-284 -6,-276 Z'; bY = -331; eyeY = 1.2; break;
      case 'think': mouthD = 'M-9,-274 Q2,-274 10,-279'; bY = -325; bR = -10; break;
      case 'focus': mouthD = 'M-9,-274 L9,-274'; bY = -320; bR = 10; eyeY = .8; break;
      case 'worried': mouthD = 'M-10,-272 Q0,-279 10,-272'; bR = -14; bY = -325; break;
      case 'proud': mouthD = 'M-13,-278 Q0,-266 13,-278'; bl2 = .7; break;
    }
    if (st.talk) { const m = .5 + .5 * Math.abs(Math.sin(at * 12) * Math.sin(at * 4.7 + 1)); mouthD = `M-10,-276 Q0,${f2(-276 + 13 * m)} 10,-276 Q0,${f2(-276 + 3 * m)} -10,-276 Z`; }
    mouth.setAttribute('d', mouthD);
    mouth.setAttribute('fill', /Z$/.test(mouthD) ? '#7A3B2E' : 'none');
    op(blush, bl2 * .9 + .1);
    op(hapEyes, hap);
    eyes.forEach(e => { op(e.g, hap ? 0 : 1); tf(e.g, e.s * 15 + lk[0] * 3, -303 + lk[1] * 3, 0, 1, eyeY * Math.max(.1, bl)); });
    brows.forEach((b, i) => { const sd2 = i ? 1 : -1; b.setAttribute('transform', `translate(${sd2 * 15},${bY}) rotate(${sd2 * bR})`); });
    const sL = [-46, -232], sR = [46, -232];
    const pL = st.hL || [-58, -128], pR = st.hR || [58, -128];
    const aL = hose(armL, sL, pL, st.bendL != null ? st.bendL : 12);
    const aR = hose(armR, sR, pR, st.bendR != null ? st.bendR : -12);
    tf(hL.h, pL[0], pL[1]); tf(hL.hi, 0, 0, aL - 90 + (st.rotL || 0));
    tf(hR.h, pR[0], pR[1]); tf(hR.hi, 0, 0, aR - 90 + (st.rotR || 0), -1, 1);
  };
  R.set({});
  return R;
}

/* ---------------- baloane ---------------- */
function speechBubble(parent, w, h, tail = 'bl', o = {}) {
  const g = G(parent); const fill = o.fill || '#FFFFFF';
  const tails = { bl: `M${w * .16},${h} L${w * .08},${h + 34} L${w * .3},${h}`, br: `M${w * .7},${h} L${w * .9},${h + 34} L${w * .84},${h}`,
    tl: `M${w * .16},0 L${w * .1},-34 L${w * .3},0`, tr: `M${w * .7},0 L${w * .9},-34 L${w * .84},0`, l: `M0,${h * .4} L-30,${h * .6} L0,${h * .65}`, r: `M${w},${h * .4} L${w + 30},${h * .6} L${w},${h * .65}` };
  E('rect', { x: 4, y: 7, width: w, height: h, rx: Math.min(26, h / 2.5), fill: '#000', 'fill-opacity': .18 }, g);
  E('rect', { x: 0, y: 0, width: w, height: h, rx: Math.min(26, h / 2.5), fill }, g);
  if (tail) E('path', { d: tails[tail], fill }, g);
  return g;
}
function thoughtBubble(parent, w, h, o = {}) {
  const g = G(parent); const fill = o.fill || '#FFFFFF';
  const bumps = 9; const cx = w / 2, cy = h / 2;
  for (let i = 0; i < bumps; i++) { const a = i / bumps * Math.PI * 2; E('circle', { cx: cx + Math.cos(a) * w * .42, cy: cy + Math.sin(a) * h * .36, r: h * .3, fill }, g); }
  E('ellipse', { cx, cy, rx: w * .45, ry: h * .42, fill }, g);
  E('circle', { cx: w * .2, cy: h + 14, r: 11, fill }, g); E('circle', { cx: w * .1, cy: h + 38, r: 7, fill }, g);
  return g;
}
