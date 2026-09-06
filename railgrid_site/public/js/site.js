/* RailGrid Technologies — site behaviour (no dependencies) */
(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mark current page in navigation
  var path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href').replace(/index\.html$/, '');
    if (href !== '/' && href !== './' && path.indexOf(href.replace(/^\.\//, '/')) === 0) a.setAttribute('aria-current', 'page');
  });

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  // Forms.
  // Forms carrying data-webform are posted as JSON to the site's own endpoint
  // (railgrid_site.api.submit), which stores the enquiry, creates a CRM Lead and
  // emails the RailGrid team. Multi-value fields (checkbox groups) are sent as arrays.
  document.querySelectorAll('form[data-webform]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var status = form.querySelector('.form__status');
      var show = function (text, ok) {
        if (!status) return;
        status.textContent = text;
        status.classList.add('is-visible');
        status.classList.toggle('is-error', !ok);
        status.setAttribute('role', ok ? 'status' : 'alert');
      };
      var data = {};
      new FormData(form).forEach(function (v, k) {
        if (data[k] !== undefined) { data[k] = [].concat(data[k], v); } else { data[k] = v; }
      });
      var body = new URLSearchParams();
      body.append('form', form.getAttribute('data-webform'));
      body.append('data', JSON.stringify(data));
      var button = form.querySelector('[type="submit"]');
      var label = button ? button.textContent : '';
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      fetch('/api/method/railgrid_site.api.submit', {
        method: 'POST', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, body: body, credentials: 'same-origin'
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (json) {
          if (!r.ok || !json || !json.message || !json.message.ok) {
            var msg = '';
            try { msg = JSON.parse(json._server_messages || '[]').map(function (m) { return JSON.parse(m).message; }).join(' '); } catch (e) {}
            throw new Error(msg || r.statusText);
          }
          return json.message;
        });
      }).then(function () {
        form.reset();
        show(form.getAttribute('data-success') || 'Thank you. We will reply within one working day.', true);
        if (window.gtag) { try { gtag('event', 'generate_lead', { form: form.getAttribute('data-webform') }); } catch (e) {} }
      }).catch(function (err) {
        var detail = err && err.message && !/Failed to fetch|NetworkError/i.test(err.message) ? ' (' + err.message.replace(/<[^>]+>/g, '') + ')' : '';
        show('Sorry, your message could not be sent' + detail + '. Please email info@railgrid.co.tz or call +255 787 772 012 and we will reply within one working day.', false);
      }).finally(function () { if (button) { button.disabled = false; button.textContent = label; } });
    });
  });

  // Character counter
  document.querySelectorAll('textarea[maxlength]').forEach(function (ta) {
    var out = document.querySelector('[data-count-for="' + ta.id + '"]');
    if (!out) return;
    var update = function () { out.textContent = ta.value.length + ' / ' + ta.getAttribute('maxlength') + ' characters'; };
    ta.addEventListener('input', update); update();
  });
})();
