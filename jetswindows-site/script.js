// Mobile navigation
(function () {
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

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

  menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', function () {
    if (!window.matchMedia('(max-width:860px)').matches) closeMenu();
  });
})();

// Quote form: opens the visitor's mail client pre-filled to info@jetswindows.com.
// Swap for a real form endpoint (Jobber, Formspree, etc.) when one is connected.
(function () {
  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    if (!d.get('name') || !d.get('phone')) {
      note.textContent = 'Please add your name and phone number so we can reach you.';
      note.style.color = '#B23A2E';
      return;
    }
    var body = [
      'Name: ' + d.get('name'),
      'Phone: ' + d.get('phone'),
      'Email: ' + (d.get('email') || '-'),
      'City: ' + (d.get('city') || '-'),
      'Service: ' + d.get('service'),
      '',
      d.get('message') || ''
    ].join('\n');
    window.location.href = 'mailto:info@jetswindows.com'
      + '?subject=' + encodeURIComponent('Free Quote Request - ' + d.get('name'))
      + '&body=' + encodeURIComponent(body);
    note.textContent = 'Thanks! Your email app is opening. We will reach out fast.';
    note.style.color = '';
  });
})();
