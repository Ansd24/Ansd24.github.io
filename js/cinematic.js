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

  /* ---------- Hero entrance (staggered headline lines) ---------- */
  var heroLines = gsap.utils.toArray('.hero-line');
  if (heroLines.length) {
    gsap.to(heroLines, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.2,
    });
  }

  var heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    gsap.to(heroImage, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.15,
    });

    gsap.to(heroImage, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
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

  /* ---------- Section fade/translate on scroll-enter ---------- */
  gsap.utils.toArray('.reveal-section').forEach(function (section) {
    gsap.to(section, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ---------- Staggered children within a section ---------- */
  gsap.utils.toArray('.reveal-stagger').forEach(function (group) {
    gsap.to(group.children, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ---------- Badges / interest pills stagger in ---------- */
  gsap.utils.toArray('.badge-stagger').forEach(function (group) {
    var items = group.querySelectorAll('.badge');
    if (!items.length) return;
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: group,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });

  document.querySelectorAll('.interest-pill').forEach(function (pill, index) {
    gsap.to(pill, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.6 + index * 0.06,
    });
  });

  /* ---------- Card hover (GSAP-driven so it composes with the reveal transform) ---------- */
  document.querySelectorAll('.project-card, .essay-card').forEach(function (card) {
    var hoverTween = gsap.to(card, {
      scale: 1.02,
      duration: 0.5,
      ease: 'power2.out',
      paused: true,
    });
    card.addEventListener('mouseenter', function () {
      hoverTween.play();
    });
    card.addEventListener('mouseleave', function () {
      hoverTween.reverse();
    });
  });

  /* ---------- Section heading split-reveal ---------- */
  document.querySelectorAll('.split-heading').forEach(function (heading) {
    var words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(function (word) {
        return '<span class="split-line"><span class="split-line__inner">' + word + '</span></span>';
      })
      .join(' ');

    gsap.to(heading.querySelectorAll('.split-line__inner'), {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  ScrollTrigger.refresh();
})();
