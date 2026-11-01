"use strict";
/* =====================================================================
   PLAYER — cronologia, sunetul (narațiunea), subtitrările, controalele.
   Scenele se înregistrează cu SCENE(i, {build}) înainte de acest fișier.
   ===================================================================== */
const HOLD = 15;
const SPK = { T: ['Tudor', '#8FD0FF'], A: ['Agent', '#FFD166'], R: ['Researcher', '#5EEAD4'], K: ['Checker', '#D0B0FF'], B: ['Chatbot', '#FFB199'] };

(function () {
  const svg = document.getElementById('svg');
  initCore(svg);
  const scenesDef = window.SCRIPT.scenes;
  /* cronologia: din TIMING (generat cu vocea) sau estimată */
  let TL = window.TIMING;
  if (!TL || TL.scenes.length !== scenesDef.length) {
    let g0 = 0; TL = { scenes: [] };
    scenesDef.forEach(sc => { let t = sc.lead || 2; const lines = []; let prev = null;
      sc.lines.forEach(l => { if (prev) t += (prev !== 'N' && l.who !== 'N') ? .35 : .55; t += l.pause || 0; const d = l.text.split(/\s+/).length / 2.5 + .3; lines.push([t, t + d]); t += d; prev = l.who; });
      const dur = t + (sc.tail || 1.8); TL.scenes.push({ start: g0, dur, lines }); g0 += dur; });
    TL.total = g0;
  }
  const TOTAL = TL.total;

  const root = G(svg);
  const overlay = G(svg);
  const SC = scenesDef.map((sd, i) => {
    const tm = TL.scenes[i];
    const cue = j => tm.lines[Math.min(j, tm.lines.length - 1)][0];
    cue.e = j => tm.lines[Math.min(j, tm.lines.length - 1)][1];
    cue.d = tm.dur; cue.n = tm.lines.length;
    cue.talk = (lt, who) => sd.lines.some((l, j) => l.who === who && lt >= tm.lines[j][0] && lt <= tm.lines[j][1]);
    const sg = G(root);
    const cid = uid('iris'); const cp = E('clipPath', { id: cid }, DEFS); const iris = E('circle', { cx: 800, cy: 450, r: 1000 }, cp);
    sg.setAttribute('clip-path', `url(#${cid})`);
    E('rect', { x: 0, y: 0, width: 1600, height: 900, fill: '#141726' }, sg);
    const world = G(sg);
    const def = (window.SCENE_DEFS || [])[i];
    let update = () => { };
    if (def) { try { update = def.build(world, cue) || update; } catch (e) { console.error('scene', i, e); } }
    else TX(world, 800, 450, 'Scene ' + i + ' — coming soon', 40, '#fff', { a: 'middle' });
    sg.style.display = 'none';
    return { i, sd, tm, cue, sg, world, iris, update, start: tm.start, dur: tm.dur, title: sd.title };
  });

  /* semnul de capitol (de lemn, atârnat) */
  const sign = G(overlay);
  const ropes = E('path', { d: 'M-200,-400 V0 M200,-400 V0', stroke: '#5A3B2B', 'stroke-width': 5 }, sign);
  const board = woodSign(sign, 560, 116, '', {});
  const signN = TX(sign, 0, 44, '', 20, '#FFE7B8', { a: 'middle', w: 700, ls: 4 });
  const signT = TX(sign, 0, 88, '', 36, '#FFF6E5', { a: 'middle', w: 800 });
  const tag = G(overlay); const tagN = TX(tag, 40, 52, '', 15, '#FFE7B8', { w: 700, ls: 3 }); const tagT = TX(tag, 40, 78, '', 22, '#FFF6E5', { w: 700 });
  tag.setAttribute('style', 'paint-order:stroke');[tagN, tagT].forEach(t => { t.setAttribute('stroke', '#000'); t.setAttribute('stroke-opacity', '.45'); t.setAttribute('stroke-width', '4'); t.setAttribute('paint-order', 'stroke'); });

  const subBox = document.getElementById('sub'), subEl = document.getElementById('subtext');
  let active = null, lastSub = null;
  function render(T, A) {
    const tt = Math.min(T, TOTAL - .001);
    let s = SC[SC.length - 1]; for (const sc of SC) if (tt >= sc.start && tt < sc.start + sc.dur) { s = sc; break; }
    if (active !== s) { if (active) active.sg.style.display = 'none'; s.sg.style.display = ''; active = s; }
    const lt = Math.min(T - s.start, s.dur), last = s.i === SC.length - 1;
    const r = 1000 * easeOut(clamp(lt / .9)) * (last ? 1 : easeOut(clamp((s.dur - lt) / .7)));
    s.iris.setAttribute('r', f2(Math.max(0, r)));
    try { s.update(lt, A); } catch (e) { if (!s.err) { console.error('scene', s.i, e); s.err = 1; } }
    /* capitol */
    if (s.title) {
      signN.textContent = 'CHAPTER ' + s.i; signT.textContent = s.title;
      const dn = prog(lt, .2, .9, easeOut), upv = prog(lt, 3.4, .7, easeIn);
      const y = lerp(-180, 70, dn) - upv * 260;
      tf(sign, 800, y, swing(lt, .7, 6, 4.5, 1.4)); op(sign, dn > 0 && upv < 1 ? 1 : 0);
      tagN.textContent = 'CHAPTER ' + s.i; tagT.textContent = s.title; op(tag, prog(lt, 4, .8) * (last ? 1 : 1 - prog(lt, s.dur - .8, .5)) * .85);
    } else { op(sign, 0); op(tag, 0); }
    /* subtitrare */
    let html = '', so = 0;
    for (let j = 0; j < s.tm.lines.length; j++) { const [a, b] = s.tm.lines[j]; if (lt >= a - .15 && lt < b + .5) { const l = s.sd.lines[j];
      html = (l.who !== 'N' && SPK[l.who] ? `<b style="color:${SPK[l.who][1]}">${SPK[l.who][0]}:</b> ` : '') + l.text; so = Math.min(1, (lt - a + .15) / .25, (b + .5 - lt) / .25); break; } }
    if (html !== lastSub) { subEl.innerHTML = html; lastSub = html; }
    subEl.style.opacity = f2(so);
    fillEl.style.width = (100 * Math.min(T, TOTAL) / TOTAL).toFixed(3) + '%';
  }

  /* ---------- scalare ---------- */
  const stage = document.getElementById('stage'), hintEl = document.getElementById('hint');
  function layout() {
    const W = innerWidth, H = innerHeight; const s = Math.min(W / 1600, H / 900); const portrait = (H - 900 * s) > 150 && W < H;
    let top = (H - 900 * s) / 2; const left = (W - 1600 * s) / 2;
    if (portrait) { const fs = Math.max(15, Math.min(20, W / 22)); top = Math.max(8, (H - 900 * s - (fs * 1.32 * 4 + 40)) / 2);
      Object.assign(subBox.style, { left: '16px', width: (W - 32) + 'px', top: (top + 900 * s + 14) + 'px', height: 'auto', alignItems: 'flex-start', fontSize: fs + 'px' }); hintEl.style.display = 'block'; }
    else { hintEl.style.display = 'none'; Object.assign(subBox.style, { fontSize: (34 * s) + 'px', left: (left + 110 * s) + 'px', width: (1380 * s) + 'px', top: (top + 745 * s) + 'px', height: (140 * s) + 'px', alignItems: 'center' }); }
    stage.style.transform = `translate(${left}px,${top}px) scale(${s})`;
  }
  addEventListener('resize', layout); layout();

  /* ---------- sunet ---------- */
  const audio = new Audio(); audio.preload = 'auto'; audio.src = 'audio/narration.mp3';
  let soundOn = false;
  const sndBtn = document.getElementById('snd');
  function setSound(on) {
    soundOn = on; sndBtn.textContent = on ? '🔊 Sound on' : '🔇 Sound off'; sndBtn.classList.toggle('off', !on);
    if (on && playing && T < TOTAL) { try { audio.currentTime = T; } catch (e) { } audio.play().catch(() => setSound(false)); } else audio.pause();
  }

  /* ---------- redare ---------- */
  const qs = new URLSearchParams(location.search);
  let T = Math.max(0, parseFloat(qs.get('t')) || 0), A = 0, playing = false, started = false, prev = null;
  const startEl = document.getElementById('start'), pausedEl = document.getElementById('paused');
  function begin(withSound) {
    if (started) return; started = true; startEl.classList.add('gone'); playing = true; setSound(withSound);
  }
  document.getElementById('play').addEventListener('click', e => { e.stopPropagation(); begin(true); });
  document.getElementById('mute').addEventListener('click', e => { e.stopPropagation(); begin(false); });
  const autoTimer = qs.get('pause') === '1' ? null : setTimeout(() => begin(false), 9000);
  if (qs.get('pause') === '1') { started = true; startEl.classList.add('gone'); }
  if (qs.get('autoplay') === '1') { clearTimeout(autoTimer); begin(false); }

  function frame(ts) {
    if (prev == null) prev = ts; const dt = Math.min(.1, (ts - prev) / 1000); prev = ts;
    if (playing) {
      A += dt;
      if (soundOn && T < TOTAL - .05) {
        if (audio.paused) { audio.play().catch(() => { }); }
        const ok = audio.readyState >= 3 && !audio.paused;
        if (ok) { const at = audio.currentTime; T = Math.abs(at - T) < .25 ? T + dt + (at - T) * .1 : at; }
      } else T += dt;
      if (T > TOTAL + HOLD) { T = 0; if (soundOn) { try { audio.currentTime = 0; } catch (e) { } } }
    } else if (!started) A += dt;
    render(T, A);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  function setPlaying(p) { playing = p; pausedEl.classList.toggle('on', !p && started); if (!p) audio.pause(); else if (soundOn) { try { audio.currentTime = Math.min(T, TOTAL); } catch (e) { } audio.play().catch(() => { }); } }
  function seek(t) { T = clamp(t, 0, TOTAL); if (soundOn) { try { audio.currentTime = T; } catch (e) { } } render(T, A); }

  /* ---------- controale ---------- */
  const bar = document.getElementById('bar'), track = document.getElementById('track'), fillEl0 = document.getElementById('fill'), tip = document.getElementById('tip');
  var fillEl = fillEl0; window.fillEl = fillEl0;
  SC.forEach(s => { if (!s.i) return; const m = document.createElement('div'); m.className = 'mk'; m.style.left = (100 * s.start / TOTAL) + '%'; track.appendChild(m); });
  bar.addEventListener('click', e => { e.stopPropagation(); const r = track.getBoundingClientRect(); const f = clamp((e.clientX - r.left) / r.width); let t = f * TOTAL;
    for (const s of SC) if (Math.abs(s.start / TOTAL - f) < .012) { t = s.start; break; } if (!started) begin(false); seek(t); });
  const fmt = t => { t = Math.floor(t); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
  bar.addEventListener('mousemove', e => { const r = track.getBoundingClientRect(); const t = clamp((e.clientX - r.left) / r.width) * TOTAL; let s = SC[0]; for (const sc of SC) if (t >= sc.start) s = sc;
    tip.textContent = (s.title ? ('Chapter ' + s.i + ' · ' + s.title) : 'Opening') + ' — ' + fmt(t); tip.style.left = clamp(e.clientX, 110, innerWidth - 110) + 'px'; tip.style.opacity = 1; });
  bar.addEventListener('mouseleave', () => tip.style.opacity = 0);
  sndBtn.addEventListener('click', e => { e.stopPropagation(); if (!started) begin(true); else setSound(!soundOn); });
  document.addEventListener('click', () => { if (!started) return; setPlaying(!playing); poke(); });
  document.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); if (!started) begin(true); else setPlaying(!playing); }
    else if (e.key === 'ArrowRight') seek(T + 5); else if (e.key === 'ArrowLeft') seek(T - 5);
    poke();
  });
  let pk = null; function poke() { document.body.classList.add('ui'); clearTimeout(pk); pk = setTimeout(() => document.body.classList.remove('ui'), 2600); }
  addEventListener('mousemove', poke); addEventListener('touchstart', poke, { passive: true });

  window.__film = { seek: t => seek(t), pause: () => setPlaying(false), play: () => setPlaying(true), total: TOTAL,
    scenes: SC.map(s => ({ t: s.title, start: s.start, dur: s.dur, lines: s.tm.lines, text: s.sd.lines.map(l => l.text) })), frame: (t, a) => { T = t; A = a; render(T, A); } };
  render(T, A);
})();
