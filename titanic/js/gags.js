"use strict";
/* Titanic — recuzita gagurilor care revin din scenă în scenă (aceeași înfățișare peste tot).
   gagTeacup   – ceașca de ceai „Southampton” a Căpitanului (scenele 0, 4, 6)
   gagWord     – cuvântul PRACTICALLY: bandă de pânză netedă ↔ cocoloș mototolit (0, 2, 4, 6)
   gagPocket   – colțul cuvântului mototolit ieșind din buzunarul vestei Proprietarului
   gagCap      – șăpcuța lui Mitzi (din scena 1 încolo)
   gagSuitcases– turnul de 12 valize/cutii de pălării al Doamnei (0, 6)
   GAG         – culorile comune (bannerul, hârtia, cerneala)
   Toate se construiesc o singură dată; .set() doar schimbă atribute. */

const GAG = {
  cloth: '#F4E9D0', clothShade: '#E2D3B0', red: '#B3261E', gold: '#E8B931', goldDark: '#9A6F12',
  navy: '#1D2B53', paper: '#F7F0DC', paperShade: '#D9CCA8', cupRim: '#D4A62A', anchor: '#2F5DA8', tea: '#9A5B2E'
};

/* ---------- ceașca de ceai: origine = baza farfuriei; ~70 px lățime la s=1 ---------- */
function gagTeacup(parent) {
  const g = G(parent), body = G(g);
  E('ellipse', { cx: 0, cy: 0, rx: 34, ry: 7, fill: '#000', 'fill-opacity': .18 }, g);
  E('ellipse', { cx: 0, cy: -3, rx: 34, ry: 8, fill: '#FFFFFF', stroke: '#BFC6D6', 'stroke-width': 1.5 }, body);
  E('ellipse', { cx: 0, cy: -4, rx: 27, ry: 5, fill: 'none', stroke: GAG.cupRim, 'stroke-width': 1.6 }, body);
  const cup = G(body);
  E('path', { d: 'M19,-30 C34,-32 34,-14 16,-12', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round' }, cup);
  E('path', { d: 'M19,-30 C34,-32 34,-14 16,-12', fill: 'none', stroke: '#BFC6D6', 'stroke-width': 1.4 }, cup);
  E('path', { d: 'M-22,-36 C-22,-14 -14,-6 0,-6 C14,-6 22,-14 22,-36 Z', fill: '#FFFFFF', stroke: '#BFC6D6', 'stroke-width': 1.5 }, cup);
  E('path', { d: 'M-17,-30 C-16,-17 -10,-10 -3,-9', fill: 'none', stroke: '#E6EBF5', 'stroke-width': 4, 'stroke-linecap': 'round' }, cup);
  /* ancora albastră */
  E('path', { d: 'M5,-28 V-14 M0,-24 H10 M-1,-17 Q5,-11 11,-17', fill: 'none', stroke: GAG.anchor, 'stroke-width': 1.8, 'stroke-linecap': 'round' }, cup);
  E('circle', { cx: 5, cy: -30, r: 1.8, fill: 'none', stroke: GAG.anchor, 'stroke-width': 1.4 }, cup);
  E('ellipse', { cx: 0, cy: -36, rx: 22, ry: 5, fill: '#FFFFFF', stroke: GAG.cupRim, 'stroke-width': 2 }, cup);
  const tea = E('ellipse', { cx: 0, cy: -35.5, rx: 18.5, ry: 3.6, fill: GAG.tea }, cup);
  const ring = E('ellipse', { cx: 0, cy: -35.5, rx: 6, ry: 1.2, fill: 'none', stroke: '#E9C79E', 'stroke-width': 1.2, opacity: 0 }, cup);
  const steam = G(cup); const st3 = [];
  for (let i = 0; i < 3; i++) st3.push(E('path', { d: `M${-8 + i * 8},-42 q-5,-8 0,-16 q5,-8 0,-16`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.4, 'stroke-linecap': 'round', opacity: 0 }, steam));
  const T = { g, cup, body };
  /* tilt = înclinarea suprafeței ceaiului (grade, față de ceașcă), ripple 0..1 = un cerc mic care se lărgește, steam 0..1 */
  T.set = (o = {}) => {
    const s = o.s != null ? o.s : 1; g.style.display = s < .004 ? 'none' : '';
    tf(g, o.x || 0, o.y || 0, o.rot || 0, s);
    tea.setAttribute('transform', `rotate(${f2(o.tilt || 0)} 0 -35.5)`);
    const rp = clamp(o.ripple || 0);
    ring.setAttribute('rx', f2(3 + rp * 15)); ring.setAttribute('ry', f2(.6 + rp * 3)); ring.setAttribute('opacity', f2(rp > 0 && rp < 1 ? (1 - rp) * .9 : 0));
    const at = o.at || 0, sv = clamp(o.steam || 0);
    st3.forEach((p, i) => { const k = ((at * .5 + i / 3) % 1); p.setAttribute('opacity', f2(sv * Math.sin(Math.PI * k) * .55)); tf(p, Math.sin(at * 2 + i) * 2, -k * 10); });
  };
  T.set({});
  return T;
}

/* ---------- cuvântul PRACTICALLY: origine = centrul; bandă ~240×64 la s=1 ----------
   crumple 0 = bandă netedă (cerneală bleumarin pe pânză crem), 1 = cocoloș (~60 px) */
function gagWord(parent, o = {}) {
  const g = G(parent);
  const flat = G(g);
  const wave = E('path', { fill: GAG.cloth, stroke: GAG.clothShade, 'stroke-width': 2 }, flat);
  E('path', { d: 'M-112,-24 H112 M-112,24 H112', stroke: GAG.red, 'stroke-width': 3, 'stroke-dasharray': '10 6', opacity: .7 }, flat);
  const word = TX(flat, 0, 11, 'PRACTICALLY', 31, GAG.navy, { a: 'middle', w: 800, ls: 1 });
  word.setAttribute('textLength', 208); word.setAttribute('lengthAdjust', 'spacingAndGlyphs');
  const wad = G(g);
  E('path', { d: 'M-27,-6 L-20,-24 L-4,-30 L12,-26 L26,-14 L29,4 L20,22 L2,29 L-16,25 L-28,11 Z', fill: GAG.paper, stroke: GAG.paperShade, 'stroke-width': 2, 'stroke-linejoin': 'round' }, wad);
  E('path', { d: 'M-20,-24 L-6,-8 L12,-26 M-6,-8 L-2,10 L20,22 M-2,10 L-28,11 M-6,-8 L29,4', fill: 'none', stroke: GAG.paperShade, 'stroke-width': 1.6 }, wad);
  TX(wad, -12, -2, 'PRA', 11, GAG.navy, { w: 800, op: .85 }).setAttribute('transform', 'rotate(-18 -12 -2)');
  TX(wad, 0, 16, 'LLY', 10, GAG.navy, { w: 800, op: .75 }).setAttribute('transform', 'rotate(14 0 16)');
  const W = { g, flat, wad, word };
  W.set = (st = {}) => {
    const s = st.s != null ? st.s : 1, c = clamp(st.crumple || 0), at = st.at || 0;
    g.style.display = s < .004 ? 'none' : '';
    tf(g, st.x || 0, st.y || 0, st.rot || 0, s);
    const a = (st.flutter || 0) * 6, ph = at * 5;
    wave.setAttribute('d', `M-120,${f2(-30 + Math.sin(ph) * a)} Q0,${f2(-30 - Math.sin(ph + 1) * a)} 120,${f2(-30 + Math.sin(ph + 2) * a)} L120,${f2(30 + Math.sin(ph + 2) * a)} Q0,${f2(30 - Math.sin(ph + 1) * a)} -120,${f2(30 + Math.sin(ph) * a)} Z`);
    op(flat, 1 - clamp(c * 2.2)); tf(flat, 0, 0, c * 25, 1 - c * .7, 1 - c * .8);
    op(wad, clamp((c - .35) * 2.6)); tf(wad, 0, 0, c * 40, .4 + .6 * c);
    if (st.sweat != null) word.setAttribute('fill', mix(GAG.navy, '#3B5BA8', clamp(st.sweat)));
  };
  W.set({});
  return W;
}

/* colțul cocoloșului ieșind din buzunarul vestei (desenează-l în fața Proprietarului, ~16 px) */
function gagPocket(parent) {
  const g = G(parent);
  E('path', { d: 'M-9,2 L-6,-9 L3,-12 L10,-5 L8,3 Z', fill: GAG.paper, stroke: GAG.paperShade, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M-6,-9 L0,-3 L3,-12 M0,-3 L8,3', fill: 'none', stroke: GAG.paperShade, 'stroke-width': .9 }, g);
  E('path', { d: 'M-3,-6 h5', stroke: GAG.navy, 'stroke-width': 1.4, opacity: .7 }, g);
  const P = { g };
  P.set = (st = {}) => { const s = st.s != null ? st.s : 1; g.style.display = s < .004 ? 'none' : ''; tf(g, st.x || 0, st.y || 0, st.rot || 0, s); };
  return P;
}
/* îl prinde direct în vesta Proprietarului (castOwner): buzunarul din dreapta ecranului, opus lanțului de ceas.
   Se mișcă singur cu trunchiul. Ascunde-l cu .set({s:0}) înainte de momentul în care cuvântul ajunge în buzunar. */
function gagPocketOn(person, dx = 0, dy = 0) { const P = gagPocket(person.torso); P.set({ x: 34 + dx, y: -176 + dy, rot: -10, s: 1.3 }); const base = P.set; P.set = (st = {}) => base(Object.assign({ x: 34 + dx, y: -176 + dy, rot: -10, s: 1.3 }, st)); return P; }

/* ---------- șăpcuța lui Mitzi: pune-o în dog.head (coordonatele capului: cerc r=19 în 0,0; urechi sus) ---------- */
function gagCap(parent) {
  const g = G(parent);
  E('path', { d: 'M-21,-12 C-20,-27 6,-31 17,-20 C20,-17 21,-14 20,-12 Z', fill: '#7A6A58' }, g);
  E('path', { d: 'M-21,-12 C-20,-27 6,-31 17,-20', fill: 'none', stroke: '#5E5042', 'stroke-width': 1.6 }, g);
  E('path', { d: 'M-14,-22 L10,-16 M-10,-25 L13,-19', stroke: '#8E7D69', 'stroke-width': 1.2 }, g);
  E('path', { d: 'M14,-14 C22,-16 33,-13 34,-9 C30,-8 20,-8 13,-10 Z', fill: '#5E5042' }, g);
  E('circle', { cx: -3, cy: -27, r: 2.2, fill: '#5E5042' }, g);
  const K = { g };
  K.set = (st = {}) => { const s = st.s != null ? st.s : 1; g.style.display = s < .004 ? 'none' : ''; tf(g, st.x || 0, st.y || 0, st.rot || 0, s); };
  return K;
}

/* ---------- turnul de 12 valize: origine = baza turnului; ~150×330 la s=1 ----------
   .set({x,y,s,sway (grade, unduire în vârf), at, slump 0..1 (se prăbușesc într-o grămadă bosumflată), hop 0..1}) */
function gagSuitcases(parent) {
  const g = G(parent);
  const shadow = E('ellipse', { cx: 0, cy: 0, rx: 80, ry: 10, fill: '#000', 'fill-opacity': .2 }, g);
  const cols = ['#8C3B2E', '#3E6B8C', '#C9A227', '#6B4E9B', '#2F7A5C', '#B8573B', '#D98BA6', '#4F5D75', '#A0522D', '#5B8C5A', '#C77D3A', '#7B3F61'];
  const items = []; let y = 0;
  for (let i = 0; i < 12; i++) {
    const hatbox = i % 3 === 1, w = hatbox ? 92 - (i % 2) * 8 : 140 - i * 4.2, h = hatbox ? 30 : 24 + (i % 2) * 6;
    const it = G(g); const c = cols[i];
    if (hatbox) {
      E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 6, fill: c }, it);
      for (let k = 0; k < 5; k++) E('rect', { x: -w / 2 + 6 + k * (w - 12) / 5, y: -h, width: (w - 12) / 10, height: h, fill: '#FFF6E2', 'fill-opacity': .55 }, it);
      E('ellipse', { cx: 0, cy: -h, rx: w / 2, ry: 5, fill: shade(c, .25) }, it);
      E('path', { d: `M-12,${-h - 3} Q0,${-h - 14} 12,${-h - 3}`, fill: 'none', stroke: '#3A2A1E', 'stroke-width': 2.5 }, it);
    } else {
      E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 5, fill: c, stroke: shade(c, -.35), 'stroke-width': 2 }, it);
      E('rect', { x: -w / 2 + 3, y: -h + 3, width: w - 6, height: 4, rx: 2, fill: '#fff', 'fill-opacity': .18 }, it);
      E('path', { d: `M${-w / 2 + 14},${-h} v${h} M${w / 2 - 14},${-h} v${h}`, stroke: '#5A3B22', 'stroke-width': 4 }, it);
      [[-w / 2, -h], [w / 2, -h], [-w / 2, 0], [w / 2, 0]].forEach(([cx, cy]) => E('circle', { cx, cy, r: 3.6, fill: GAG.gold }, it));
      E('path', { d: `M-10,${-h} q10,-9 20,0`, fill: 'none', stroke: '#3A2A1E', 'stroke-width': 3 }, it);
      if (i % 4 === 0) { const lb = G(it); E('rect', { x: 8, y: -h + 5, width: 22, height: 13, rx: 2, fill: '#FBF3DE', transform: `rotate(-8 18 ${-h + 11})` }, lb); }
    }
    items.push({ g: it, h, w, base: y }); y -= h;
  }
  const S = { g, items, height: -y };
  S.set = (st = {}) => {
    const s = st.s != null ? st.s : 1, at = st.at || 0, sw = st.sway != null ? st.sway : Math.sin(at * 1.7) * 3, sl = clamp(st.slump || 0), hp = clamp(st.hop || 0);
    g.style.display = s < .004 ? 'none' : '';
    tf(g, st.x || 0, (st.y || 0) - hp * 30, st.rot || 0, s);
    items.forEach((it, i) => {
      const k = i / 11, off = Math.sin(sw * Math.PI / 180) * it.base * -1 * (0.4 + k);
      /* prăbușire: fiecare valiză cade lângă bază, într-o grămadă joasă */
      const px = ((i % 4) - 1.5) * 48 + (i % 3) * 6, py = -Math.floor(i / 4) * 22;
      const x = lerp(off, px, sl), yy = lerp(it.base, py, sl), r = lerp(sw * (0.3 + k * .8), ((i * 37) % 30) - 15, sl);
      tf(it.g, x, yy, r);
    });
    shadow.setAttribute('rx', f2(80 + sl * 40));
  };
  S.set({});
  return S;
}
