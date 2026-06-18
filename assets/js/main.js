/* ===== Salon Kala — main.js ===== */
(function () {
  'use strict';

  /* --- Preloader (hard fallback) --- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hide');
    setTimeout(function () { preloader.style.display = 'none'; }, 600);
  }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1200); // fallback if load never fires

  /* --- Sticky header --- */
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile full-screen menu --- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mmClose = document.getElementById('mmClose');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (mmClose) mmClose.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('.mm-links a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeLightbox(); }
  });

  /* --- Scroll reveal (IntersectionObserver + fallback) --- */
  var reveals = document.querySelectorAll('.reveal');
  function showAll() { reveals.forEach(function (el) { el.classList.add('in'); }); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // safety fallback: reveal everything after 2.2s no matter what
    setTimeout(showAll, 2200);
  } else {
    showAll();
  }

  /* --- Lightbox --- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  function openLightbox(src, alt) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || 'صورة من أعمال صالون كالا';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.gal-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var full = item.getAttribute('data-full');
      var img = item.querySelector('img');
      openLightbox(full, img ? img.alt : '');
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* --- Toast --- */
  var toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    var span = document.getElementById('toastMsg');
    if (span && msg) span.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  /* --- Booking form -> WhatsApp + localStorage --- */
  var form = document.getElementById('bookForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('name').value || '').trim();
      var phone = (document.getElementById('phone').value || '').trim();
      var service = document.getElementById('service').value || '';
      var date = document.getElementById('date').value || '';
      var notes = (document.getElementById('notes').value || '').trim();

      // Save to localStorage (demo)
      try {
        var store = JSON.parse(localStorage.getItem('kala_bookings') || '[]');
        store.push({ name: name, phone: phone, service: service, date: date, notes: notes, at: new Date().toISOString() });
        localStorage.setItem('kala_bookings', JSON.stringify(store));
      } catch (err) { /* localStorage unavailable — continue */ }

      // Build WhatsApp message
      var lines = [
        'مرحبًا صالون كالا، أرغب بحجز موعد:',
        '• الاسم: ' + name,
        '• الجوال: ' + phone,
        '• الخدمة: ' + service
      ];
      if (date) lines.push('• التاريخ المفضّل: ' + date);
      if (notes) lines.push('• ملاحظات: ' + notes);
      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/966555202585?text=' + text;

      showToast('تم تجهيز طلبك — يفتح واتساب الآن');
      form.reset();
      setTimeout(function () { window.open(url, '_blank'); }, 700);
    });
  }

  /* --- Year (footer) is static 2026 per spec; nothing dynamic needed --- */
})();
