/* ===================================================================
   CRAVINS ICE CREAM — script.js
=================================================================== */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (header) {
      header.style.boxShadow = y > 8 ? '0 8px 24px -16px rgba(46,26,18,0.35)' : 'none';
    }
    lastScroll = y;
  }, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navList = document.getElementById('navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!navList.classList.contains('is-open')) return;
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
        navList.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Hero staggered entrance ---------- */
  window.addEventListener('DOMContentLoaded', function () {
    var heroReveals = document.querySelectorAll('.hero [data-reveal]');
    heroReveals.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-visible'); }, 120 * i + 80);
    });
  });

  /* ---------- Menu tabs ---------- */
  var menuTabs = document.querySelectorAll('.menu-tab');
  var menuPanels = document.querySelectorAll('.menu-panel');
  menuTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-target');

      menuTabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      menuPanels.forEach(function (panel) {
        var isMatch = panel.id === 'panel-' + target;
        panel.classList.toggle('is-active', isMatch);
        panel.hidden = !isMatch;
      });
    });
  });

  /* ---------- Flavour flight: drag-to-scroll ---------- */
  var scroller = document.getElementById('flightScroller');
  if (scroller) {
    var isDown = false, startX, scrollLeft;

    var startDrag = function (pageX) {
      isDown = true;
      scroller.classList.add('is-dragging');
      startX = pageX - scroller.offsetLeft;
      scrollLeft = scroller.scrollLeft;
    };
    var endDrag = function () {
      isDown = false;
      scroller.classList.remove('is-dragging');
    };
    var moveDrag = function (pageX) {
      if (!isDown) return;
      var x = pageX - scroller.offsetLeft;
      var walk = (x - startX) * 1.2;
      scroller.scrollLeft = scrollLeft - walk;
    };

    scroller.addEventListener('mousedown', function (e) { startDrag(e.pageX); });
    scroller.addEventListener('mouseleave', endDrag);
    scroller.addEventListener('mouseup', endDrag);
    scroller.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      moveDrag(e.pageX);
    });

    scroller.addEventListener('touchstart', function (e) { startDrag(e.touches[0].pageX); }, { passive: true });
    scroller.addEventListener('touchend', endDrag);
    scroller.addEventListener('touchmove', function (e) { moveDrag(e.touches[0].pageX); }, { passive: true });
  }

  /* ---------- Reviews carousel ---------- */
  var revTrack = document.getElementById('reviewsTrack');
  var revPrev = document.getElementById('revPrev');
  var revNext = document.getElementById('revNext');
  if (revTrack && revPrev && revNext) {
    var revCards = revTrack.children.length;
    var revIndex = 0;

    var renderRev = function () {
      revTrack.style.transform = 'translateX(-' + (revIndex * 100) + '%)';
    };
    revNext.addEventListener('click', function () {
      revIndex = (revIndex + 1) % revCards;
      renderRev();
    });
    revPrev.addEventListener('click', function () {
      revIndex = (revIndex - 1 + revCards) % revCards;
      renderRev();
    });

    var revAutoplay = setInterval(function () {
      revIndex = (revIndex + 1) % revCards;
      renderRev();
    }, 6000);

    [revPrev, revNext, revTrack].forEach(function (el) {
      el.addEventListener('mouseenter', function () { clearInterval(revAutoplay); });
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var masonryItems = Array.prototype.slice.call(document.querySelectorAll('.masonry-item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentLightboxIndex = 0;
  var lastFocusedEl = null;

  function openLightbox(index) {
    currentLightboxIndex = index;
    var item = masonryItems[index];
    var img = item.querySelector('img');
    lightboxImg.src = item.getAttribute('data-img');
    lightboxImg.alt = img ? img.alt : '';
    lastFocusedEl = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }
  function showNext() {
    currentLightboxIndex = (currentLightboxIndex + 1) % masonryItems.length;
    openLightbox(currentLightboxIndex);
  }
  function showPrev() {
    currentLightboxIndex = (currentLightboxIndex - 1 + masonryItems.length) % masonryItems.length;
    openLightbox(currentLightboxIndex);
  }

  masonryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (lightbox && lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  /* ---------- Toast helper ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 3500);
  }

  /* ---------- Delivery request form -> WhatsApp ---------- */
  var deliveryForm = document.getElementById('deliveryRequestForm');
  var deliveryNote = document.getElementById('deliveryFormNote');
  var WHATSAPP_NUMBER = '2348000000000';

  if (deliveryForm) {
    deliveryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = deliveryForm.dName.value.trim();
      var phone = deliveryForm.dPhone.value.trim();
      var address = deliveryForm.dAddress.value.trim();
      var items = deliveryForm.dItems.value;

      if (!name || !phone || !address || !items) {
        deliveryNote.textContent = 'Please fill in all fields so we can process your request.';
        deliveryNote.className = 'form-note is-error';
        return;
      }
      var phonePattern = /^[0-9+\s-]{7,15}$/;
      if (!phonePattern.test(phone)) {
        deliveryNote.textContent = 'Please enter a valid phone number.';
        deliveryNote.className = 'form-note is-error';
        return;
      }

      var message = 'Hi Cravins! I would like to place a delivery order.\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Address: ' + address + '\n' +
        'Item(s): ' + items;

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      deliveryNote.textContent = 'Opening WhatsApp to confirm your order...';
      deliveryNote.className = 'form-note is-success';
      showToast('Redirecting you to WhatsApp to confirm your order.');

      window.open(url, '_blank', 'noopener');
      deliveryForm.reset();
    });
  }

  /* ---------- Event booking form -> WhatsApp ---------- */
  var eventForm = document.getElementById('eventBookingForm');
  var eventNote = document.getElementById('eventFormNote');

  if (eventForm) {
    eventForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = eventForm.eName.value.trim();
      var phone = eventForm.ePhone.value.trim();
      var date = eventForm.eDate.value;
      var guests = eventForm.eGuests.value;
      var type = eventForm.eType.value;
      var notes = eventForm.eNotes.value.trim();

      if (!name || !phone || !date || !guests || !type) {
        eventNote.textContent = 'Please fill in all required fields.';
        eventNote.className = 'form-note is-error';
        return;
      }
      var phonePattern = /^[0-9+\s-]{7,15}$/;
      if (!phonePattern.test(phone)) {
        eventNote.textContent = 'Please enter a valid phone number.';
        eventNote.className = 'form-note is-error';
        return;
      }

      var message = 'Hi Cravins! I would like to book an event.\n\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Event Date: ' + date + '\n' +
        'Guest Count: ' + guests + '\n' +
        'Event Type: ' + type +
        (notes ? '\nNotes: ' + notes : '');

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      eventNote.textContent = 'Opening WhatsApp to confirm your booking...';
      eventNote.className = 'form-note is-success';
      showToast('Redirecting you to WhatsApp to confirm your event booking.');

      window.open(url, '_blank', 'noopener');
      eventForm.reset();
    });
  }

  /* ---------- Service worker registration ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function (err) {
        console.warn('Service worker registration failed:', err);
      });
    });
  }

})();
