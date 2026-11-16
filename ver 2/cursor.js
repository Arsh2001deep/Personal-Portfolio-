// Sleek white comic spider cursor: eases toward the pointer, faces its travel direction,
// skitters its legs while moving, grows on interactive things, and fires a web-burst on click.
const SPIDER = `<svg viewBox="0 0 60 60"><g class="legs" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none">
<g class="l a"><path d="M26 25L14 16L6 20"/><path d="M26 30L12 28L5 34"/></g>
<g class="l b"><path d="M26 34L13 42L8 52"/><path d="M27 38L18 50L16 57"/></g>
<g class="l b"><path d="M34 25L46 16L54 20"/><path d="M34 30L48 28L55 34"/></g>
<g class="l a"><path d="M34 34L47 42L52 52"/><path d="M33 38L42 50L44 57"/></g></g>
<ellipse cx="30" cy="36" rx="5.2" ry="9" fill="#fff"/><circle cx="30" cy="24" r="4.2" fill="#fff"/>
<path d="M27.5 23.2l2 1M32.5 23.2l-2 1" stroke="#061323" stroke-width="1.3" stroke-linecap="round"/></svg>`;

export function initCursor(el) {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return el.remove();
  el.innerHTML = SPIDER;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, ang = 0;

  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
  addEventListener('pointerdown', e => { el.classList.add('press'); burst(e.clientX, e.clientY); });
  addEventListener('pointerup', () => el.classList.remove('press'));
  document.addEventListener('pointerover', e => el.classList.toggle('hot', !!e.target.closest('a,button,.card,.photo-frame')));

  (function loop() {
    const dx = tx - x, dy = ty - y, speed = Math.hypot(dx, dy);
    x += dx * 0.22; y += dy * 0.22;
    if (speed > 2) {
      const target = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      ang += ((((target - ang) % 360) + 540) % 360 - 180) * 0.2;   // shortest-path turn
    }
    el.classList.toggle('moving', speed > 1.5);
    el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${ang}deg)`;
    requestAnimationFrame(loop);
  })();
}

function burst(x, y) {
  const b = document.createElement('div');
  b.className = 'web-burst';
  b.style.cssText = `left:${x}px;top:${y}px`;
  let s = '<svg viewBox="-50 -50 100 100">';
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += `<line x1="0" y1="0" x2="${Math.cos(a)*46}" y2="${Math.sin(a)*46}"/>`; }
  [16, 30, 44].forEach(r => s += `<circle r="${r}"/>`);
  b.innerHTML = s + '</svg>';
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 600);
}
