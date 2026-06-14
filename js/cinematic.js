/*
 * Cinematic interactions: Lenis smooth scroll + GSAP/ScrollTrigger reveals.
 * Loaded at the end of <body>, after GSAP/ScrollTrigger/Lenis CDN scripts,
 * so the DOM is already parsed and those globals are available.
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

  /* ---------- Live clock (nav) — runs regardless of motion prefs ---------- */
  var navClock = document.querySelector('[data-nav-clock]');
  if (navClock) {
    var updateClock = function () {
      var now = new Date();
      var time = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);

      // Europe/London is either GMT (UTC+0) or BST (UTC+1) depending on DST.
      var utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      var london = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
      var isBST = Math.round((london - utc) / 3600000) === 1;

      navClock.textContent = 'LONDON · ' + time + ' ' + (isBST ? 'BST' : 'GMT');
    };
    updateClock();
    setInterval(updateClock, 60000);
  }

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
    var filterButtons = document.querySelectorAll('.writing-filter');
    var posts = document.querySelectorAll('.writing-post');
    if (!filterButtons.length || !posts.length) return;

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

  /* ---------- Hero entrance ----------
     gsap.from animates FROM the hidden state TO the element's natural,
     already-visible DOM state, so content is never stranded invisible.
     Sequence: status indicator -> headline words (staggered) -> tagline
     -> photo + stats. */
  var heroStatus = document.querySelector('.hero-status');
  var heroWords = gsap.utils.toArray('.hero-headline__word');
  var heroTagline = document.querySelector('.hero-tagline');
  var heroPhoto = document.querySelector('.hero-photo-wrap');
  var heroStats = document.querySelector('.hero-stats');

  if (heroStatus || heroWords.length || heroTagline || heroPhoto || heroStats) {
    var heroTl = gsap.timeline({ delay: 0.2 });

    if (heroStatus) {
      heroTl.from(heroStatus, { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' });
    }

    if (heroWords.length) {
      heroTl.from(heroWords, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
      }, heroStatus ? '-=0.2' : 0);
    }

    if (heroTagline) {
      heroTl.from(heroTagline, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=0.3');
    }

    var heroPhotoAndStats = [heroPhoto, heroStats].filter(Boolean);
    if (heroPhotoAndStats.length) {
      heroTl.from(heroPhotoAndStats, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      }, '-=0.4');
    }
  }

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

  /* ---------- Section fade/translate on scroll-enter ----------
     All reveals below use gsap.from(): they animate from a hidden state back
     to the element's natural visible DOM, and `once: true` settles them there
     permanently. If a trigger somehow never fires, the element stays at its
     default (visible) CSS state — content is never dependent on JS to appear. */
  gsap.utils.toArray('.reveal-section').forEach(function (section) {
    gsap.from(section, {
      opacity: 0,
      y: 48,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        once: true,
      },
    });
  });

  /* ---------- Staggered children within a section ---------- */
  gsap.utils.toArray('.reveal-stagger:not(.connect-bento)').forEach(function (group) {
    gsap.from(group.children, {
      opacity: 0,
      y: 36,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        once: true,
      },
    });
  });

  /* ---------- Connect bento: anchor tile first, link tiles stagger ----------
     The anchor tile is the visual focal point, so it gets its own quick
     scale+fade entrance. The surrounding link tiles then cascade in with a
     tight 30-80ms stagger (per polish-stagger-children) just after it. */
  gsap.utils.toArray('.connect-bento').forEach(function (grid) {
    var anchor = grid.querySelector('.connect-tile--anchor');
    var tiles = Array.prototype.filter.call(grid.children, function (el) {
      return el !== anchor;
    });

    if (anchor) {
      gsap.from(anchor, {
        opacity: 0,
        scale: 0.96,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          once: true,
        },
      });
    }

    if (tiles.length) {
      gsap.from(tiles, {
        opacity: 0,
        y: 24,
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.06,
        delay: anchor ? 0.08 : 0,
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          once: true,
        },
      });
    }
  });

  /* ---------- Badges / interest pills stagger in ---------- */
  gsap.utils.toArray('.badge-stagger').forEach(function (group) {
    var items = group.querySelectorAll('.badge');
    if (!items.length) return;
    gsap.from(items, {
      opacity: 0,
      y: 10,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: group,
        start: 'top 90%',
        once: true,
      },
    });
  });

  var interestPills = document.querySelectorAll('.interest-pill');
  if (interestPills.length) {
    gsap.from(interestPills, {
      opacity: 0,
      y: 10,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.06,
      delay: 0.6,
    });
  }

  /* ---------- Section heading split-reveal ---------- */
  document.querySelectorAll('.split-heading').forEach(function (heading) {
    var words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(function (word) {
        return '<span class="split-line"><span class="split-line__inner">' + word + '</span></span>';
      })
      .join(' ');

    gsap.from(heading.querySelectorAll('.split-line__inner'), {
      yPercent: 110,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        once: true,
      },
    });
  });

  /* Recalculate trigger positions now, and again once everything (including
     lazy-loaded images that shift layout) has finished loading. Stale trigger
     positions were the root cause of elements never reaching full opacity. */
  ScrollTrigger.refresh();
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });
})();
