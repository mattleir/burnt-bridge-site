/* Burnt Bridge Strength Lab — site behaviour */
(function () {
  'use strict';

  /* ---- Sticky header state ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-solid', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---- Mobile nav ---- */
    var toggle = header.querySelector('.nav-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      header.querySelectorAll('.nav a').forEach(function (a) {
        a.addEventListener('click', function () {
          header.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('is-open')) {
          header.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
      });
    }
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Hero slideshow ---- */
  var stage = document.getElementById('hero-slideshow');
  var controls = document.getElementById('hero-controls');
  var slides = stage ? Array.prototype.slice.call(stage.querySelectorAll('img')) : [];

  if (stage && slides.length > 1) {
    var INTERVAL = 6000;
    var index = 0;
    var timer = null;
    var paused = false;
    var dots = [];
    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    var pauseBtn = controls ? controls.querySelector('.hero__pause') : null;
    var dotWrap = controls ? controls.querySelector('.hero__dots') : null;

    // Build one dot per slide so the markup stays the single source of truth.
    if (dotWrap) {
      slides.forEach(function (slide, n) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Background image ' + (n + 1) + ' of ' + slides.length);
        dot.setAttribute('aria-selected', n === 0 ? 'true' : 'false');
        dot.addEventListener('click', function () { pause(); show(n); });
        dotWrap.appendChild(dot);
        dots.push(dot);
      });
    }
    if (controls) controls.hidden = false;

    function show(n) {
      slides[index].classList.remove('is-active');
      if (dots[index]) dots[index].setAttribute('aria-selected', 'false');
      index = (n + slides.length) % slides.length;
      slides[index].classList.add('is-active');
      if (dots[index]) dots[index].setAttribute('aria-selected', 'true');
    }

    function play() {
      stop();
      if (paused || motionQuery.matches || document.hidden) return;
      timer = window.setInterval(function () { show(index + 1); }, INTERVAL);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function pause() {
      paused = true;
      stop();
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', 'true');
        pauseBtn.setAttribute('aria-label', 'Play background slideshow');
      }
    }
    function resume() {
      paused = false;
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', 'false');
        pauseBtn.setAttribute('aria-label', 'Pause background slideshow');
      }
      play();
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () { paused ? resume() : pause(); });
    }

    // Don't animate in a hidden tab, and honour a mid-session motion-preference change.
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', function () { motionQuery.matches ? stop() : play(); });
    }

    play();
  }

  /* ---- Current year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Consult form ---- */
  var form = document.getElementById('consult-form');
  if (form) {
    var note = document.getElementById('form-note');
    var submit = form.querySelector('[type="submit"]');

    var say = function (kind, html) {
      if (!note) return;
      note.className = 'form-note is-visible ' + kind;
      note.innerHTML = html;
      note.setAttribute('role', 'status');
    };

    form.addEventListener('submit', function (e) {
      // Honeypot — silently drop bot submissions.
      if (form.querySelector('[name="_company"]').value !== '') {
        e.preventDefault();
        return;
      }

      var action = form.getAttribute('action') || '';

      // Not wired up to a form service yet: explain instead of failing silently.
      if (action.indexOf('YOUR_FORM_ID') !== -1 || action === '') {
        e.preventDefault();
        if (!form.reportValidity()) return;
        say(
          'warn',
          '<strong>This form isn’t connected yet.</strong> ' +
          'Add your form endpoint to the <code>action</code> attribute on ' +
          '<code>contact.html</code> (see <code>README.md</code>) and submissions ' +
          'will start arriving by email. In the meantime, reach out at ' +
          '<a href="mailto:hello@burntbridgestrengthlab.com">hello@burntbridgestrengthlab.com</a>.'
        );
        note.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }

      // Wired up: submit over fetch so the visitor stays on the page.
      e.preventDefault();
      if (!form.reportValidity()) return;

      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Sending…';

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          say('ok', '<strong>Thanks — that’s in.</strong> Coach Julia will get back to you within a business day to set up your free consult.');
        })
        .catch(function () {
          say('error', '<strong>Something went wrong sending that.</strong> Please email <a href="mailto:hello@burntbridgestrengthlab.com">hello@burntbridgestrengthlab.com</a> and we’ll take it from there.');
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = original;
          note.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
    });
  }
})();
