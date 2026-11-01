#!/usr/bin/env python3
"""Generează narațiunea filmului cu vocile Kokoro (model liber, Apache-2.0).

Citește js/script.js, sintetizează fiecare replică, potrivește replicile pe o
cronologie și scrie:
  audio/narration.mp3  – o singură pistă pentru tot filmul
  js/timing.js         – începutul/sfârșitul fiecărei replici și al fiecărei scene

Folosire:
  python make_narration.py <model.onnx> <voices.bin> <cache_dir> [film_root]
  (film_root implicit = rădăcina depozitului; pentru Titanic: titanic)
"""
import hashlib, json, os, re, subprocess, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP, GAP_DIALOG = 0.55, 0.35
SR = 24000

def load_script():
    src = open(os.path.join(ROOT, 'js', 'script.js'), encoding='utf-8').read()
    body = src[src.index('{', src.index('window.SCRIPT')):src.rindex('}') + 1]
    return json.loads(body)

def trim(s, thr=0.006, keep=0.04):
    idx = np.where(np.abs(s) > thr)[0]
    if not len(idx):
        return s
    a = max(0, idx[0] - int(keep * SR)); b = min(len(s), idx[-1] + int(keep * 2 * SR))
    return s[a:b]

def main(model, voices, cache):
    os.makedirs(cache, exist_ok=True)
    sc = load_script(); V = sc['voices']
    k = Kokoro(model, voices)
    clips, timing, t_global = [], [], 0.0
    for si, scene in enumerate(sc['scenes']):
        t = scene.get('lead', 2.0); lines = []; prev = None
        for li, ln in enumerate(scene['lines']):
            v = V[ln['who']]; say = ln.get('say', ln['text'])
            key = hashlib.sha1(json.dumps([say, v['voice'], v['lang'], v['speed']]).encode()).hexdigest()[:16]
            fn = os.path.join(cache, key + '.wav')
            if not os.path.exists(fn):
                s, sr = k.create(say, voice=v['voice'], speed=v['speed'], lang=v['lang'])
                assert sr == SR
                sf.write(fn, trim(s), SR)
            s, _ = sf.read(fn, dtype='float32')
            if prev is not None:
                t += GAP_DIALOG if (prev != 'N' and ln['who'] != 'N') else GAP
            t += ln.get('pause', 0)
            d = len(s) / SR
            lines.append([round(t, 3), round(t + d, 3)])
            clips.append((t_global + t, s, ln['who']))
            t += d; prev = ln['who']
        dur = round(t + scene.get('tail', 1.8), 3)
        timing.append({'start': round(t_global, 3), 'dur': dur, 'lines': lines})
        t_global += dur
    total = round(t_global, 3)
    track = np.zeros(int((total + 1) * SR), dtype=np.float32)
    for t0, s, who in clips:
        i = int(t0 * SR); g = 1.0 if who == 'N' else 0.95
        track[i:i + len(s)] += s * g
    peak = np.abs(track).max() or 1
    track = track / peak * 0.89
    os.makedirs(os.path.join(ROOT, 'audio'), exist_ok=True)
    wav = os.path.join(cache, 'narration.wav'); sf.write(wav, track, SR)
    mp3 = os.path.join(ROOT, 'audio', 'narration.mp3')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-ac', '1', '-ar', '24000', '-b:a', '64k', mp3], check=True)
    with open(os.path.join(ROOT, 'js', 'timing.js'), 'w', encoding='utf-8') as f:
        f.write('/* generat de tools/make_narration.py — nu edita manual */\n')
        f.write('window.TIMING = ' + json.dumps({'total': total, 'scenes': timing}) + ';\n')
    print('total', total, 's =', round(total / 60, 2), 'min')
    for i, s in enumerate(timing):
        print(i, s['start'], s['dur'], len(s['lines']))

if __name__ == '__main__':
    if len(sys.argv) > 4:
        ROOT = os.path.abspath(sys.argv[4])
    main(*sys.argv[1:4])
