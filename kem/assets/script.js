
(() => {
  const preloader = document.getElementById('preloader');
  const loaderStartedAt = Date.now();
  let loaderHidden = false;
  const hideLoader = () => {
    if (!preloader || loaderHidden) return;
    loaderHidden = true;
    const remaining = Math.max(0, 900 - (Date.now() - loaderStartedAt));
    window.setTimeout(() => preloader.classList.add('loaded'), remaining);
  };
  window.addEventListener('load', hideLoader, { once: true });
  window.setTimeout(hideLoader, 3500);

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 450);
    const nav = document.querySelector('.kem-nav');
    if (nav) nav.classList.toggle('nav-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelectorAll('[data-scroll-strip]').forEach(button => {
    button.addEventListener('click', () => {
      const strip = document.querySelector('.service-strip');
      if (strip) strip.scrollBy({ left: Number(button.dataset.scrollStrip) * 300, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-quote-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = `Quote request - ${data.get('service') || 'Engineering services'}`;
      const body = [
        'KeM Engineering Service LLC - Quote Request',
        '',
        `Name: ${data.get('name') || ''}`,
        `Company: ${data.get('company') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Phone / WhatsApp: ${data.get('phone') || ''}`,
        `Service: ${data.get('service') || ''}`,
        '',
        'Project details:',
        data.get('details') || ''
      ].join('\n');
      const feedback = form.querySelector('.quote-feedback');
      if (feedback) feedback.textContent = 'Opening your email app with the request details…';
      window.location.href = `mailto:info@kem4design.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  });

  document.querySelectorAll('.blog-read').forEach(button => {
    button.addEventListener('click', () => {
      const title = document.getElementById('blogTitle');
      const category = document.getElementById('blogCategory');
      const content = document.getElementById('blogContent');
      if (title) title.textContent = button.dataset.blogTitle || '';
      if (category) category.textContent = button.dataset.blogCategory || '';
      if (content) content.textContent = button.dataset.blogContent || '';
      const modal = document.getElementById('blogModal');
      if (modal && window.bootstrap) bootstrap.Modal.getOrCreateInstance(modal).show();
    });
  });

  // Highlight the current navigation item.
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
})();

document.addEventListener('shown.bs.modal', event => {
  if (event.target && event.target.id === 'quoteModal') {
    const firstField = event.target.querySelector('input[name="name"]');
    if (firstField) window.setTimeout(() => firstField.focus({ preventScroll: true }), 120);
  }
});
document.querySelectorAll('[data-bs-target="#quoteModal"]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const select = document.querySelector('#quoteModal select[name="service"]');
    const pageTitle = document.querySelector('.page-hero h1');
    if (!select || !pageTitle) return;
    const title = pageTitle.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    const option = Array.from(select.options).find(o => title.includes(o.text.toLowerCase()));
    if (option) select.value = option.value;
  });
});
