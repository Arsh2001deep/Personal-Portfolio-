// Vanilla ES modules: a static portfolio needs no framework, so it loads instantly and is easy to host anywhere.

initCursor(document.getElementById('spider-cursor'));
const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// document.documentElement.classList.add('js-ready');

// 1. Page-load wipe
addEventListener('load', () => setTimeout(() => document.body.classList.remove('loading'), reduce ? 0 : 900));

// 2. Mobile menu
const nav = $('#nav');
$('#menu').addEventListener('click', () => nav.classList.toggle('open'));
nav.addEventListener('click', e => e.target.matches('a') && nav.classList.remove('open'));

// // 3. Scroll reveals
// const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .15 });
// document.querySelectorAll('.reveal').forEach(el => io.observe(el));


// 3. Scroll reveals
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => io.observe(el));
} else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('in'));
}

// Activate reveal animation after setting up observation
document.documentElement.classList.add('js-ready');


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

// 6. Scroll progress web-line
const bar = $('.progress');
addEventListener('scroll', () => { bar.style.transform = `scaleX(${scrollY / (document.body.scrollHeight - innerHeight || 1)})`; }, { passive: true });

// 7. Rescue pendulum: swings forever; clicks and fast scrolling give it energy, then it eases back to a gentle sway
const hang = $('#hang');
const BASE_AMP = 5, BASE_FREQ = .012;
let amp = 22, freq = .03, phase = 0, lastY = scrollY;
const kick = (a, f) => { amp = Math.min(amp + a, 40); freq = Math.min(freq + f, .055); };
addEventListener('pointerdown', () => kick(12, .014));
addEventListener('scroll', () => { kick(Math.abs(scrollY - lastY) * .03, .0008); lastY = scrollY; }, { passive: true });
(function swing() {
  phase += freq;
  amp += (BASE_AMP - amp) * .004;      // gradually settles
  freq += (BASE_FREQ - freq) * .004;   // and slows, but never stops
  hang.style.transform = `rotate(${reduce ? 0 : Math.sin(phase) * amp}deg)`;
  requestAnimationFrame(swing);
})();

// 8. Face hover: a Spider-Verse comic lens follows the pointer, and the frame tilts toward it
const ph = $('#photo'), fx = ph.querySelector('.fx');
ph.addEventListener('pointermove', e => {
  const r = fx.getBoundingClientRect();
  ph.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  ph.style.setProperty('--my', (e.clientY - r.top) + 'px');
  if (reduce) return;
  const b = ph.getBoundingClientRect(), px = (e.clientX - b.left) / b.width - .5, py = (e.clientY - b.top) / b.height - .5;
  ph.style.transform = `perspective(800px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) scale(1.04)`;
});
ph.addEventListener('pointerleave', () => { ph.style.transform = ''; });
