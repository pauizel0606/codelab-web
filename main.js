(function () {
  var root = document.documentElement;

  function save(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Idioma ---------- */
  function setLang(lang, animate) {
    var dict = window.I18N && window.I18N[lang];
    if (!dict) return;
    var apply = function () {
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var v = dict[el.getAttribute('data-i18n')];
        if (v != null) el.innerHTML = v;
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        var v = dict[el.getAttribute('data-i18n-aria')];
        if (v != null) el.setAttribute('aria-label', v);
      });
      document.title = dict['meta.title'];
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute('content', dict['meta.desc']);
      root.setAttribute('lang', lang);
      document.querySelectorAll('[data-lang]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
      });
    };
    if (animate) {
      document.body.classList.add('lang-switching');
      setTimeout(function () { apply(); document.body.classList.remove('lang-switching'); }, 220);
    } else {
      apply();
    }
    save('codelab-lang', lang);
  }

  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      if (l !== root.getAttribute('lang')) setLang(l, true);
    });
  });
  setLang(root.getAttribute('lang') || 'es', false);

  /* ---------- Tema ---------- */
  var themeBtn = document.getElementById('themeToggle');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', next);
    save('codelab-theme', next);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 600);
  });

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.nav__toggle');
  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Cabecera al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('nav--scrolled', window.scrollY > 10); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Aparición al hacer scroll ---------- */
  root.classList.add('js');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .chat').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .chat').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- FAQ: solo una abierta a la vez ---------- */
  var items = document.querySelectorAll('.faq details');
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Título al cargar ---------- */
  setTimeout(function () { root.classList.add('loaded'); }, 60);
})();
