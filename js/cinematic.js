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
  document.querySelectorAll('a.nav-link[href*="#"]').forEach(function (link) {
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

  /* ---------- Active section highlighting in nav ---------- */
  var navLinks = navbar ? Array.prototype.slice.call(navbar.querySelectorAll('a.nav-link[href*="#"]')) : [];
  navLinks.forEach(function (link) {
    var url;
    try {
      url = new URL(link.href);
    } catch (err) {
      return;
    }
    if (url.pathname !== window.location.pathname || !url.hash) return;
    var section = document.querySelector(url.hash);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: function (self) {
        if (self.isActive) {
          navLinks.forEach(function (l) {
            l.classList.remove('is-active');
          });
          link.classList.add('is-active');
        }
      },
    });
  });

  /* ---------- Hero entrance (profile card) ----------
     gsap.from animates FROM the hidden state TO the element's natural,
     already-visible DOM state, so the card is never stranded invisible. */
  var heroLines = gsap.utils.toArray('.hero-line');
  if (heroLines.length) {
    gsap.from(heroLines, {
      opacity: 0,
      y: 40,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.2,
    });
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
