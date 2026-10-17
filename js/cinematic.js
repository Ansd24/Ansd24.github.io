/*
 * Site interactions: nav behaviour, writing filters, clipboard copy, and two
 * scroll-tied effects (hero parallax, scroll-cue visibility) via GSAP/
 * ScrollTrigger + Lenis smooth scroll. Loaded at the end of <body>, after
 * the GSAP/ScrollTrigger/Lenis CDN scripts, so the DOM is already parsed
 * and those globals are available.
 */
(function () {
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navbar = document.querySelector('.site-navbar');

  /* ---------- Navbar background on scroll (works even without GSAP) ---------- */
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 24) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  /* ---------- Mobile menu toggle ---------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navMobile = document.querySelector('[data-nav-mobile]');
  if (navToggle && navMobile) {
    var closeMobileMenu = function () {
      navMobile.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navMobile.querySelectorAll('[data-nav-link]').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---------- Active section highlighting in nav (IntersectionObserver) ----------
     Runs regardless of motion prefs / GSAP availability so the active link
     stays in sync even if the reveal animations below are skipped. */
  (function () {
    var navAnchors = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'));
    var trackedSections = [];

    navAnchors.forEach(function (link) {
      var url;
      try {
        url = new URL(link.href);
      } catch (err) {
        return;
      }
      if (url.pathname !== window.location.pathname || !url.hash) return;
      var section = document.querySelector(url.hash);
      if (!section) return;
      trackedSections.push({ href: link.getAttribute('href'), section: section });
    });

    if (!trackedSections.length || !('IntersectionObserver' in window)) return;

    var setActive = function (href) {
      navAnchors.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === href);
      });
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var match = trackedSections.find(function (s) {
          return s.section === entry.target;
        });
        if (match) setActive(match.href);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    trackedSections.forEach(function (s) {
      observer.observe(s.section);
    });
  })();

  /* ---------- Writing section category filters ----------
     Fading uses GSAP (when available) so it doesn't fight the GSAP-driven
     scroll-reveal animation on the same elements via competing CSS
     transitions. Falls back to an instant display toggle otherwise. */
  (function () {
    var filterContainer = document.querySelector('.writing-filters');
    var posts = document.querySelectorAll('.writing-post');
    if (!filterContainer || !posts.length) return;

    /* Build one button per category that actually has at least one post,
       so a filter can never produce an empty result. The button label is
       taken from the post's visible category text; the filter value from
       its data-writing-category attribute. */
    var seenCategories = {};
    posts.forEach(function (post) {
      var category = post.getAttribute('data-writing-category');
      if (!category || seenCategories[category]) return;
      var labelEl = post.querySelector('.writing-post__category');
      var label = labelEl && labelEl.textContent.trim();
      if (!label) {
        label = category.split('-').map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
      }
      seenCategories[category] = label;
    });

    Object.keys(seenCategories).forEach(function (category) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'writing-filter';
      button.setAttribute('data-writing-filter', category);
      button.textContent = seenCategories[category];
      filterContainer.appendChild(button);
    });

    var filterButtons = filterContainer.querySelectorAll('.writing-filter');
    var canAnimate = !prefersReduced && typeof gsap !== 'undefined';

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-writing-filter');

        filterButtons.forEach(function (btn) {
          btn.classList.toggle('is-active', btn === button);
        });

        posts.forEach(function (post) {
          var isMatch = filter === 'all' || post.getAttribute('data-writing-category') === filter;

          if (!canAnimate) {
            post.style.display = isMatch ? '' : 'none';
            return;
          }

          gsap.killTweensOf(post);
          if (isMatch) {
            post.style.display = '';
            gsap.fromTo(post, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
          } else {
            gsap.to(post, {
              opacity: 0,
              y: -8,
              duration: 0.25,
              ease: 'power2.out',
              onComplete: function () {
                post.style.display = 'none';
              },
            });
          }
        });
      });
    });
  })();

  /* ---------- Copy email to clipboard (connect section) ---------- */
  (function () {
    var copyButtons = document.querySelectorAll('[data-copy-email]');
    if (!copyButtons.length) return;

    copyButtons.forEach(function (button) {
      var email = button.getAttribute('data-copy-email');
      var resetTimer;

      var showCopied = function () {
        button.classList.add('is-copied');
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          button.classList.remove('is-copied');
        }, 1600);
      };

      // Fallback for browsers without the async clipboard API (or non-secure
      // contexts, where navigator.clipboard is undefined).
      var fallbackCopy = function () {
        var textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          if (document.execCommand('copy')) showCopied();
        } catch (err) { /* clipboard unavailable — leave silently */ }
        document.body.removeChild(textarea);
      };

      button.addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(showCopied, fallbackCopy);
        } else {
          fallbackCopy();
        }
      });
    });
  })();

  // If the user prefers reduced motion, or GSAP failed to load, the CSS
  // already keeps everything visible — stop here.
  if (prefersReduced || typeof gsap === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  var lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Back-button scroll restoration ----------
     Lenis and the reveal animations change page height after load, so the
     browser's own restore lands in the wrong place (usually the footer).
     Save the position on leave and put it back once layout has settled. */
  (function () {
    var key = 'scrollY:' + window.location.pathname;
    var saved = null;
    try {
      saved = sessionStorage.getItem(key);
      history.scrollRestoration = 'manual';
    } catch (err) { /* storage or API unavailable — leave default behaviour */ }

    function save() {
      try { sessionStorage.setItem(key, String(window.scrollY)); } catch (err) {}
    }
    window.addEventListener('pagehide', save);

    function jump(y) {
      if (lenis) {
        lenis.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }
    }

    // Only restore on back/forward or reload, never on a fresh link visit.
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var isHistoryNav = nav && (nav.type === 'back_forward' || nav.type === 'reload');
    if (saved !== null && isHistoryNav && !window.location.hash) {
      var y = parseFloat(saved) || 0;
      jump(y);
      window.addEventListener('load', function () {
        ScrollTrigger.refresh();
        jump(y);
      });
    }
  })();

  /* ---------- Smooth scroll for in-page nav links ---------- */
  document.querySelectorAll('[data-nav-link][href*="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var url;
      try {
        url = new URL(link.href);
      } catch (err) {
        return;
      }
      if (url.pathname !== window.location.pathname || !url.hash) return;
      var target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      var offset = navbar ? -navbar.offsetHeight : 0;
      if (lenis) {
        lenis.scrollTo(target, { offset: offset, duration: 1.4 });
      } else {
        var top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Hero background parallax ---------- */
  var heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    gsap.to(heroGlow, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ---------- Scroll-down indicator ---------- */
  var scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'top top-=10',
      onEnter: function () {
        scrollIndicator.classList.add('is-hidden');
      },
      onLeaveBack: function () {
        scrollIndicator.classList.remove('is-hidden');
      },
    });
  }

  /* Recalculate trigger positions now, and again once everything (including
     lazy-loaded images that shift layout) has finished loading. Stale trigger
     positions were the root cause of elements never reaching full opacity. */
  ScrollTrigger.refresh();
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });
})();
