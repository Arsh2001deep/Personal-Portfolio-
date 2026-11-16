// Vanilla ES modules: a static portfolio needs no framework, so it loads instantly and is easy to host anywhere.
import { initCursor } from './cursor.js';
import { universes, projects } from './projects.js';

initCursor(document.getElementById('spider-cursor'));
const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Page-load wipe
addEventListener('load', () => setTimeout(() => document.body.classList.remove('loading'), reduce ? 0 : 900));

// 2. Mobile menu
const nav = $('#nav');
$('#menu').addEventListener('click', () => nav.classList.toggle('open'));
nav.addEventListener('click', e => e.target.matches('a') && nav.classList.remove('open'));

// 3. Scroll reveals
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 4. Multiverse: render filters + comic panels from data
const filters = $('#filters'), panels = $('#panels');
const uname = id => universes.find(u => u.id === id)?.name ?? id;

filters.innerHTML = universes.map((u, i) => `<button role="tab" data-u="${u.id}" class="${i ? '' : 'on'}">${u.name}</button>`).join('');
panels.innerHTML = projects.map(p => `
  <a class="card ${p.size} u-${p.universe}" data-u="${p.universe}" href="${p.link}">
    <span class="issue">${p.issue}</span>
    <span class="uni">${uname(p.universe)}</span>
    <h3 data-t="${p.title}">${p.title}</h3>
    <p>${p.desc}</p>
    <span class="tags">${p.tags.map(t => `<i>${t}</i>`).join('')}</span>
    <span class="pow">POW!</span>
  </a>`).join('');

filters.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  filters.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  panels.querySelectorAll('.card').forEach((c, i) => {
    const show = b.dataset.u === 'all' || c.dataset.u === b.dataset.u;
    c.classList.toggle('off', !show);
    c.style.transitionDelay = show ? `${i * 50}ms` : '0ms';
  });
});

// 5. 3D tilt on cards (answers the pointer, so motion is user-driven)
if (!reduce) panels.addEventListener('pointermove', e => {
  const c = e.target.closest('.card'); if (!c) return;
  const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
  c.style.transform = `perspective(700px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg) translateY(-6px)`;
});
panels.addEventListener('pointerout', e => { const c = e.target.closest('.card'); if (c) c.style.transform = ''; });

// 6. Scroll progress web-line + hanging LEGO Spidey swings harder when you scroll fast
const bar = $('.progress'), hang = $('#hang');
let lastY = scrollY, impulse = 0, t = 0;
addEventListener('scroll', () => {
  bar.style.transform = `scaleX(${scrollY / (document.body.scrollHeight - innerHeight || 1)})`;
  impulse = Math.max(-28, Math.min(28, impulse + (scrollY - lastY) * .12)); lastY = scrollY;
}, { passive: true });
if (!reduce) (function swing() {
  t += .02; impulse *= .96;
  hang.style.transform = `rotate(${Math.sin(t) * 4 + impulse}deg)`;
  requestAnimationFrame(swing);
})();
