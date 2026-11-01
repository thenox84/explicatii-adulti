"use strict";
/* =====================================================================
   CORE — utilitare comune pentru toate scenele
   Scena: 1600 × 900. Timpul „poveștii” (lt) e în secunde de la începutul
   scenei; timpul „ambiental” (at) curge mereu (clipit, abur, nori…).
   ===================================================================== */
const NS = 'http://www.w3.org/2000/svg';
const SW = 1600, SH = 900;

const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const lerp = (a, b, p) => a + (b - a) * p;
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeIn = t => t * t * t;
const easeBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
/* progres 0→1 între t0 și t0+d */
const prog = (t, t0, d = .8, f = ease) => f(clamp((t - t0) / d));
/* fereastră: urcă la a, coboară la b */
const win = (t, a, b, fi = .5, fo = .5) => prog(t, a, fi) * (1 - prog(t, b, fo));
const f2 = v => (Math.round(v * 100) / 100);

function E(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const G = (parent, attrs) => E('g', attrs, parent);
/* transformare: translate, rotate, scale */
function tf(n, x = 0, y = 0, r = 0, sx = 1, sy = sx) {
  let s = 'translate(' + f2(x) + ',' + f2(y) + ')';
  if (r) s += ' rotate(' + f2(r) + ')';
  if (sx !== 1 || sy !== 1) s += ' scale(' + f2(sx * 1000) / 1000 + ',' + f2(sy * 1000) / 1000 + ')';
  n.setAttribute('transform', s);
}
function op(n, o) { n.setAttribute('opacity', f2(clamp(o) * 1000) / 1000); n.style.display = o < .004 ? 'none' : ''; return o; }
function at_(n, k, v) { n.setAttribute(k, v); }

/* text (rândurile separate cu \n) */
function TX(parent, x, y, str, size, fill, o = {}) {
  const t = E('text', { x, y, 'font-size': size, fill, 'font-weight': o.w || 500, 'text-anchor': o.a || 'start' }, parent);
  t.setAttribute('class', o.mono ? 'mono' : (o.hand ? 'hand' : 'rnd'));
  if (o.ls != null) t.setAttribute('letter-spacing', o.ls);
  if (o.it) t.setAttribute('font-style', 'italic');
  if (o.op != null) t.setAttribute('opacity', o.op);
  const L = String(str).split('\n');
  if (L.length === 1) t.textContent = str;
  else L.forEach((l, i) => { const s = E('tspan', { x, dy: i ? size * (o.lh || 1.25) : 0 }, t); s.textContent = l; });
  return t;
}

/* zgomot neted și hash determinist */
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const wob = (t, s = 0) => Math.sin(t * 1.3 + s) * .5 + Math.sin(t * 2.7 + s * 1.7) * .3 + Math.sin(t * .63 + s * .4) * .2;
/* clipit: 1 = deschis, 0 = închis */
function blink(at, seed = 0) {
  const per = 2.8 + hash(seed) * 2.6, ph = (at + seed * 1.37) % per;
  if (ph > .22) return 1;
  return clamp(Math.abs(ph - .11) / .11);
}
/* valoare din cadre-cheie [[t,v],...] (v poate fi număr sau [..]) */
function keyed(t, K, f = ease) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) {
    if (t <= K[i][0]) {
      const [t0, v0] = K[i - 1], [t1, v1] = K[i], p = f(clamp((t - t0) / Math.max(.001, t1 - t0)));
      return Array.isArray(v0) ? v0.map((a, j) => lerp(a, v1[j], p)) : lerp(v0, v1, p);
    }
  }
  return K[K.length - 1][1];
}
/* „pop”: apariție cu mică depășire (0→1, cu overshoot) */
const pop = (t, t0, d = .55) => t < t0 ? 0 : t > t0 + d ? 1 : easeBack((t - t0) / d);
/* pendul amortizat (pt. semne care se leagănă) */
const swing = (t, t0, amp = 12, fr = 4, damp = 1.6) => t < t0 ? 0 : amp * Math.sin((t - t0) * fr) * Math.exp(-(t - t0) * damp);
/* zbor pe arc: din a în b, cu înălțimea h */
function arcPos(p, a, b, h = 80) { return [lerp(a[0], b[0], p), lerp(a[1], b[1], p) - Math.sin(Math.PI * p) * h]; }

/* culori */
function hex(c) { return [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16)); }
function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(t))).toString(16).padStart(2, '0')).join(''); }
const shade = (c, k) => k >= 0 ? mix(c, '#ffffff', k) : mix(c, '#000000', -k);

const C = {
  ink: '#1E2235', text: '#F4F1EA', muted: '#A9B1C7', paper: '#FBF7EE', paper2: '#EFE7D6',
  warm: '#F2994A', gold: '#F7C948', teal: '#2EC4B6', blue: '#4D96FF', purple: '#9B5DE5',
  green: '#3BB273', red: '#E84855', pink: '#FF7AA2', night: '#16192B'
};

/* ---------- defs globale (gradienți) ---------- */
let SVG, DEFS;
let _gid = 0;
function uid(p = 'u') { return p + (_gid++); }
function lgrad(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, id) {
  id = id || uid('lg');
  const g = E('linearGradient', { id, x1, y1, x2, y2 }, DEFS);
  stops.forEach(([o, c, a]) => E('stop', { offset: o, 'stop-color': c, 'stop-opacity': a == null ? 1 : a }, g));
  return 'url(#' + id + ')';
}
function rgrad(stops, cx = .5, cy = .5, r = .5, id) {
  id = id || uid('rg');
  const g = E('radialGradient', { id, cx, cy, r }, DEFS);
  stops.forEach(([o, c, a]) => E('stop', { offset: o, 'stop-color': c, 'stop-opacity': a == null ? 1 : a }, g));
  return 'url(#' + id + ')';
}
function clipRect(x, y, w, h, rx = 0) {
  const id = uid('cp'); const cp = E('clipPath', { id }, DEFS);
  E('rect', { x, y, width: w, height: h, rx }, cp); return 'url(#' + id + ')';
}
function initCore(svg) {
  SVG = svg; DEFS = E('defs', null, svg);
}

/* ---------- cameră: [[t, cx, cy, zoom], ...] ---------- */
function camera(g, t, K, f = ease) {
  const v = keyed(t, K, f); const z = v[2];
  g.setAttribute('transform', 'translate(800,450) scale(' + f2(z * 1000) / 1000 + ') translate(' + f2(-v[0]) + ',' + f2(-v[1]) + ')');
}

/* ---------- apariție lină a unui nod (opacitate + alunecare/scalare) ---------- */
function show(n, t, tIn, tOut = 1e9, o = {}) {
  const pi = prog(t, tIn, o.d || .6), po = prog(t, tOut, o.dOut || .5), v = pi * (1 - po);
  op(n, v);
  if (v > 0 && n._x != null) {
    const k = o.pop ? pop(t, tIn, o.d || .55) : pi;
    const dy = (o.dy != null ? o.dy : 14) * (1 - pi), dx = (o.dx || 0) * (1 - pi);
    const s = o.pop ? k : (o.s != null ? lerp(o.s, 1, pi) : 1);
    tf(n, n._x + dx, n._y + dy, n._r || 0, s * (n._s || 1));
  }
  return v;
}
/* grup poziționat, cu coordonate de bază memorate */
function N(parent, x = 0, y = 0, s = 1, r = 0) { const g = G(parent); g._x = x; g._y = y; g._s = s; g._r = r; tf(g, x, y, r, s); return g; }
