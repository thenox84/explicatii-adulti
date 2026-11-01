SCENE(3, { build(world, cue) {
  const bg = bgWorkshop(world);
  const boss = Robot(world, { hat: 'hard', color: '#F2994A', seed: 1 });
  const res = Robot(world, { color: '#2EC4B6', glasses: true, hat: 'beret', capColor: '#1F7A70', seed: 2, scale: .75 });
  const bld = Robot(world, { color: '#4D96FF', hat: 'cap', capColor: '#E84855', belt: true, seed: 3, scale: .75 });
  const chk = Robot(world, { color: '#9B5DE5', badge: true, seed: 5, scale: .75 });
  const hm = hammer(bld.propR, .9); tf(hm, 0, -10);
  const mg = magnifier(chk.propR, .7);
  const bk = bookProp(res.propL, '#E84855', .8, 1);
  return (lt, at) => {
    bg.anim(at);
    const w = walkCycle(at * 6);
    boss.set({ x: 300, y: 720, at, face: ['neutral','happy','focus','surprise','worried','think'][Math.floor(at/1.5)%6], talk: false, hR: [90, -260 + Math.sin(at*8)*20], bob: Math.sin(at*2)*2 });
    res.set({ x: 640, y: 720, at, face: 'happy', hL: [-40, -120], hR: [60,-100], look: [0,1] });
    bld.set({ x: 940, y: 720, at, face: 'focus', fL: w.fL, fR: w.fR, bob: w.bob, hR: [70, -170 + Math.sin(at*9)*30], rotR: 0 });
    chk.set({ x: 1260, y: 720, at, face: 'surprise', hR: [60, -200], tilt: 6, talk: true });
  };
} });
