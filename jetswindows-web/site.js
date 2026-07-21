// ===== Jet's site interactions =====
(function () {
  'use strict';

  // Mobile menu
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    function closeMenu() {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1120) closeMenu();
    });
  }

  // Before/after sliders (pointer-drag, clamp 4-96%)
  document.querySelectorAll('[data-ba]').forEach(function (el) {
    var dragging = false;
    function setFromClientX(x) {
      var r = el.getBoundingClientRect();
      var pct = ((x - r.left) / r.width) * 100;
      pct = Math.max(4, Math.min(96, pct));
      el.style.setProperty('--pos', pct + '%');
    }
    el.addEventListener('pointerdown', function (e) {
      dragging = true; el.setPointerCapture(e.pointerId); setFromClientX(e.clientX);
    });
    el.addEventListener('pointermove', function (e) { if (dragging) setFromClientX(e.clientX); });
    el.addEventListener('pointerup', function () { dragging = false; });
    el.addEventListener('pointercancel', function () { dragging = false; });
  });

  // Crew carousel
  document.querySelectorAll('[data-carousel]').forEach(function (wrap) {
    var track = wrap.querySelector('.crew-track');
    var prev = wrap.querySelector('[data-prev]');
    var next = wrap.querySelector('[data-next]');
    if (!track) return;
    function step(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  });

  // Quote forms: swap for inline success
  document.querySelectorAll('form[data-quote]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var box = document.createElement('div');
      box.className = 'form-success';
      box.setAttribute('role', 'status');
      box.innerHTML = '<h3>Request received!</h3><p>We’ll call or text you shortly with an honest quote. Talk soon — Henry &amp; Zach</p>';
      form.replaceWith(box);
    });
  });

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }
})();
