/* ============================================================
   ShubhMangalKarya.com — JavaScript & GSAP Animations
   ============================================================ */

(function () {
  "use strict";

  /* ── Utility: Reduced Motion Detection ─────────────────────── */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.innerWidth < 769;

  /* Register GSAP plugins */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Preloader ─────────────────────────────────────────────── */
  const preloader = document.getElementById("preloader");
  const preloaderFill = preloader.querySelector(".preloader-fill");
  const preloaderTagline = preloader.querySelector(".preloader-tagline");

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 20 + 5;
    if (loadProgress > 100) loadProgress = 100;
    preloaderFill.style.width = loadProgress + "%";
    if (loadProgress >= 100) {
      clearInterval(loadInterval);
    }
  }, 150);

  gsap.to(preloaderTagline, { opacity: 1, delay: 0.5, duration: 0.8 });

  window.addEventListener("load", () => {
    loadProgress = 100;
    preloaderFill.style.width = "100%";

    gsap.timeline({ delay: 0.5 })
      .to(preloader.querySelector(".preloader-inner"), {
        opacity: 0, y: -30, duration: 0.6, ease: "power2.inOut",
      })
      .to(preloader, {
        yPercent: -100, duration: 0.9, ease: "power4.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          initAllAnimations();
        },
      }, "-=0.2");
  });

  /* ── Custom Cursor ─────────────────────────────────────────── */
  if (!isMobile) {
    const cursor = document.getElementById("cursor");
    const cursorDot = cursor.querySelector(".cursor-dot");
    const cursorRing = cursor.querySelector(".cursor-ring");
    const cursorText = cursor.querySelector(".cursor-text");
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      cursorRing.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      cursorText.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* Hover states */
    document.querySelectorAll("a, button, .magnetic-btn").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
    });

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-view");
        cursorText.textContent = el.dataset.cursor;
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-view");
        cursorText.textContent = "";
      });
    });
  }

  /* ── Magnetic Buttons ──────────────────────────────────────── */
  // Removed magnetic effect as requested.


  /* ── Navigation ────────────────────────────────────────────── */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 80);
  });

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  /* ── Hero Particles (Canvas) ───────────────────────────────── */
  function initParticles(canvasId, count) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5
          ? `rgba(200,149,50,${Math.random() * 0.4 + 0.15})`
          : `rgba(139,18,62,${Math.random() * 0.35 + 0.1})`,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    if (!prefersReducedMotion) draw();
  }

  /* ── Floating Objects Parallax ─────────────────────────────── */
  function initParallaxObjects() {
    if (isMobile || prefersReducedMotion) return;
    const objects = document.querySelectorAll(".float-obj");
    let mx = 0, my = 0;

    document.addEventListener("mousemove", (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function update() {
      objects.forEach((obj) => {
        const speed = parseFloat(obj.dataset.speed) || 0.02;
        const offsetX = mx * speed * 100;
        const offsetY = my * speed * 100;
        gsap.to(obj, {
          x: offsetX, y: offsetY,
          duration: 1.2, ease: "power2.out",
        });
      });
      requestAnimationFrame(update);
    }
    update();
  }

  /* ── 3D Card Tilt ──────────────────────────────────────────── */
  function initCardTilt() {
    if (isMobile || prefersReducedMotion) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const inner = card.querySelector(".event-card-inner");
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (y - 0.5) * -12;
        const rotateY = (x - 0.5) * 12;
        gsap.to(inner, {
          rotateX, rotateY,
          duration: 0.4, ease: "power2.out",
          transformPerspective: 800,
        });

        /* Card glow follows cursor */
        const glow = card.querySelector(".event-card-glow");
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(200,149,50,0.18) 0%, transparent 60%)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(inner, {
          rotateX: 0, rotateY: 0,
          duration: 0.6, ease: "elastic.out(1, 0.6)",
        });
      });
    });
  }

  /* ── Rotating Words ────────────────────────────────────────── */
  function initRotatingWords() {
    const wordEl = document.getElementById("rotatingWord");
    if (!wordEl) return;
    const words = ["Story", "Wedding", "Celebration", "Memory", "Journey"];
    let index = 0;

    function rotateWord() {
      index = (index + 1) % words.length;
      gsap.timeline()
        .to(wordEl, {
          opacity: 0, y: -20, filter: "blur(4px)",
          duration: 0.4, ease: "power2.in",
        })
        .call(() => { wordEl.textContent = words[index]; })
        .to(wordEl, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.5, ease: "power2.out",
        });
    }

    setInterval(rotateWord, 3000);
  }

  /* ── Testimonials ──────────────────────────────────────────── */
  function initTestimonials() {
    const data = [
      {
        text: "ShubhMangalKarya turned our wedding into a fairy tale. Every detail was perfect, every moment was magical. We couldn't have asked for a more beautiful celebration.",
        author: "Priya & Arjun Sharma",
        role: "Royal Wedding — Udaipur",
      },
      {
        text: "From the first meeting to the last dance, the team made us feel like royalty. They understood our vision and elevated it beyond our wildest dreams.",
        author: "Meera & Rahul Kapoor",
        role: "Destination Wedding — Goa",
      },
      {
        text: "Our engagement ceremony was nothing short of spectacular. The attention to detail, the stunning décor — ShubhMangalKarya is truly in a league of their own.",
        author: "Ananya & Vikram Patel",
        role: "Engagement Ceremony — Jaipur",
      },
      {
        text: "They didn't just plan our event — they created an experience. Our corporate gala was the talk of the industry for months. Absolute perfection.",
        author: "Rishi Malhotra",
        role: "Corporate Gala — Mumbai",
      },
    ];

    const textEl = document.getElementById("testimonialText");
    const authorEl = document.getElementById("testimonialAuthor");
    const roleEl = document.getElementById("testimonialRole");
    const progressFill = document.getElementById("testimonialProgressFill");
    const btns = document.querySelectorAll(".testimonial-btn");
    let currentIdx = 0;

    function showTestimonial(idx) {
      if (idx === currentIdx && idx !== 0) return;
      currentIdx = idx;

      const tl = gsap.timeline();
      tl.to([textEl, authorEl, roleEl], {
        opacity: 0, y: -15, duration: 0.3, ease: "power2.in", stagger: 0.05,
      })
        .call(() => {
          textEl.textContent = data[idx].text;
          authorEl.textContent = data[idx].author;
          roleEl.textContent = data[idx].role;
        })
        .fromTo([textEl, authorEl, roleEl],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08 }
        );

      btns.forEach((b, i) => b.classList.toggle("active", i === idx));
      progressFill.style.transform = `translateX(${idx * 100}%)`;
    }

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        showTestimonial(parseInt(btn.dataset.index));
      });
    });

    /* Auto-rotate */
    let autoTimer = setInterval(() => {
      showTestimonial((currentIdx + 1) % data.length);
    }, 6000);

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => {
          showTestimonial((currentIdx + 1) % data.length);
        }, 6000);
      });
    });
  }

  /* ── Back to Top ───────────────────────────────────────────── */
  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ── Smooth Anchor Scrolling ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ============================================================
     MAIN INIT — Called after preloader completes
     ============================================================ */
  function initAllAnimations() {
    initParticles("ctaParticles", isMobile ? 20 : 50);
    initCardTilt();
    initTestimonials();
    initHeroSlider();

    if (prefersReducedMotion) {
      /* Show everything instantly */
      gsap.set(".hero-tagline-wrap, .hero-title-main, .hero-title-script, .hero-ornament-divider, .hero-subtext, .hero-btn-group, .hero-service-dock, .about-section, .about-feature-item, .about-img-wrap, .journey-stage, .why-feature, .stat", {
        opacity: 1, filter: "none", transform: "none",
      });
      return;
    }

    animateHero();
    animateAbout();
    animateJourney();
    animateEvents();
    animateStory();
    animateWhy();
    animatePortfolio();
    animateTestimonials();
    animateStats();
    animateFinalCta();
  }

  /* ── Hero Slider Interaction ───────────────────────────────── */
  function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide-content");
    const backgrounds = document.querySelectorAll(".hero-bg-media");
    const dots = document.querySelectorAll(".hero-slider-dots .h-dot");
    const prevBtn = document.querySelector(".hero-arrow-left");
    const nextBtn = document.querySelector(".hero-arrow-right");
    const heroSection = document.getElementById("hero");
    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideTimer = null;

    function setSlide(idx, animateText = true) {
      const prevIdx = currentSlide;
      currentSlide = (idx + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const isActive = i === currentSlide;
        slide.classList.toggle("active", isActive);

        if (isActive && animateText && typeof gsap !== "undefined" && !prefersReducedMotion && prevIdx !== currentSlide) {
          const textItems = slide.querySelectorAll(".hero-tagline-wrap, .hero-title-main, .hero-title-script, .hero-ornament-divider, .hero-subtext, .hero-btn-group");
          gsap.fromTo(textItems,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
          );
        }
      });

      backgrounds.forEach((background, i) => {
        background.classList.toggle("active", i === currentSlide);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
      });
    }

    function nextSlide() {
      setSlide(currentSlide + 1);
    }

    function prevSlide() {
      setSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 7000);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        setSlide(i);
        startAutoSlide();
      });
    });

    /* Touch Swipe Support */
    if (heroSection) {
      let touchStartX = 0;
      let touchEndX = 0;

      heroSection.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSection.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoSlide();
        }
      }, { passive: true });

      heroSection.addEventListener("mouseenter", stopAutoSlide);
      heroSection.addEventListener("mouseleave", startAutoSlide);
    }

    startAutoSlide();
  }

  /* ── HERO Animations ───────────────────────────────────────── */
  function animateHero() {
    const heroTL = gsap.timeline({ delay: 0.2 });

    /* Tagline */
    heroTL.fromTo(".hero-tagline-wrap",
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
    );

    /* Main Title & Script */
    heroTL.fromTo(".hero-title-main",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    heroTL.fromTo(".hero-title-script",
      { opacity: 0, scale: 0.95, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power2.out" },
      "-=0.5"
    );

    /* Ornament divider & Subtext */
    heroTL.fromTo(".hero-ornament-divider",
      { opacity: 0, scaleX: 0.7 },
      { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    heroTL.fromTo(".hero-subtext",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4"
    );

    /* Buttons */
    heroTL.fromTo(".hero-btn-group",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4"
    );

    /* Floating service bar dock entrance */
    heroTL.fromTo(".hero-service-dock",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      "-=0.5"
    );

    heroTL.fromTo(".dock-item",
      { opacity: 0, y: 15, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
      "-=0.6"
    );
  }

  /* ── ABOUT Animations ──────────────────────────────────────── */
  function animateAbout() {
    gsap.from(".about-top-badge, .about-subtitle", {
      scrollTrigger: { trigger: ".about-section", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out"
    });
    gsap.from(".about-heading-main, .about-heading-script", {
      scrollTrigger: { trigger: ".about-section", start: "top 78%" },
      opacity: 0, y: 25, duration: 0.8, stagger: 0.15, ease: "power3.out"
    });
    gsap.from(".about-ornament-divider, .about-desc", {
      scrollTrigger: { trigger: ".about-section", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.7, stagger: 0.15, ease: "power2.out"
    });
    gsap.from(".about-feature-item", {
      scrollTrigger: { trigger: ".about-section", start: "top 72%" },
      opacity: 0, y: 20, duration: 0.6, stagger: 0.12, ease: "power2.out"
    });
    gsap.from(".about-cta-wrap", {
      scrollTrigger: { trigger: ".about-section", start: "top 70%" },
      opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.7)"
    });
    gsap.from(".about-img-wrap", {
      scrollTrigger: { trigger: ".about-section", start: "top 75%" },
      opacity: 0, x: 40, duration: 1, ease: "power3.out"
    });
    gsap.from(".about-left-flower-overlay", {
      scrollTrigger: { trigger: ".about-section", start: "top 85%" },
      opacity: 0, x: -30, duration: 1.2, ease: "power2.out"
    });
  }

  /* ── JOURNEY Animations ────────────────────────────────────── */
  function animateJourney() {
    /* Section header */
    gsap.from(".journey .section-tag", {
      scrollTrigger: { trigger: ".journey", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".journey .section-title", {
      scrollTrigger: { trigger: ".journey", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".journey .section-desc", {
      scrollTrigger: { trigger: ".journey", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.25,
    });

    /* Timeline line fill */
    gsap.to("#journeyLineFill", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".journey-timeline",
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1,
      },
    });

    /* Each stage */
    document.querySelectorAll(".journey-stage").forEach((stage, i) => {
      const isOdd = i % 2 === 0;
      gsap.to(stage, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stage,
          start: "top 80%",
        },
      });

      const card = stage.querySelector(".journey-card");
      gsap.from(card, {
        x: isOdd ? -60 : 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stage,
          start: "top 75%",
        },
      });
    });
  }

  /* ── EVENTS Animations ─────────────────────────────────────── */
  function animateEvents() {
    /* Section header */
    gsap.from(".events .section-tag", {
      scrollTrigger: { trigger: ".events", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".events .section-title", {
      scrollTrigger: { trigger: ".events", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".events .section-desc", {
      scrollTrigger: { trigger: ".events", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.25,
    });

    /* Staggered card reveal */
    gsap.from(".event-card", {
      scrollTrigger: {
        trigger: ".events-grid",
        start: "top 80%",
      },
      opacity: 0,
      y: 60,
      scale: 0.9,
      rotateX: 8,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }

  /* ── STORY Horizontal Scroll ───────────────────────────────── */
  function animateStory() {
    if (isMobile) {
      /* On mobile, animate each slide individually */
      document.querySelectorAll(".story-slide").forEach((slide) => {
        gsap.from(slide.querySelector(".story-slide-number"), {
          scrollTrigger: { trigger: slide, start: "top 80%" },
          opacity: 0, scale: 0.8, duration: 0.8,
        });
        gsap.from(slide.querySelector(".story-slide-title"), {
          scrollTrigger: { trigger: slide, start: "top 75%" },
          opacity: 0, y: 30, duration: 0.8, delay: 0.1,
        });
        gsap.from(slide.querySelector(".story-slide-desc"), {
          scrollTrigger: { trigger: slide, start: "top 70%" },
          opacity: 0, y: 20, duration: 0.6, delay: 0.2,
        });
      });
      return;
    }

    const track = document.getElementById("storyTrack");
    const slides = track.querySelectorAll(".story-slide");
    const totalWidth = slides.length * window.innerWidth;

    /* Pin section and scroll horizontally */
    const storyScrollTrigger = ScrollTrigger.create({
      trigger: "#story",
      start: "top top",
      end: () => `+=${totalWidth - window.innerWidth}`,
      pin: "#storyWrapper",
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        gsap.set(track, { x: -(totalWidth - window.innerWidth) * self.progress });
        const progressFill = document.getElementById("storyProgressFill");
        if (progressFill) progressFill.style.width = (self.progress * 100) + "%";
      },
    });

    /* Animate each slide content on scroll */
    slides.forEach((slide, i) => {
      const number = slide.querySelector(".story-slide-number");
      const title = slide.querySelector(".story-slide-title");
      const desc = slide.querySelector(".story-slide-desc");

      gsap.from([number, title, desc], {
        opacity: 0, y: 40,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: "#story",
          start: () => `top+=${i * window.innerWidth * 0.7} top`,
          end: () => `top+=${(i + 0.5) * window.innerWidth * 0.7} top`,
          scrub: 1,
        },
      });
    });
  }

  /* ── WHY Animations ────────────────────────────────────────── */
  function animateWhy() {
    /* Title */
    gsap.from(".why-title-line", {
      scrollTrigger: { trigger: ".why", start: "top 70%" },
      opacity: 0, y: 40,
      duration: 0.8, stagger: 0.15, ease: "power3.out",
    });

    /* Features stagger in */
    document.querySelectorAll(".why-feature").forEach((feature, i) => {
      const angle = parseInt(feature.dataset.angle);
      const fromX = Math.cos((angle * Math.PI) / 180) * 60;
      const fromY = Math.sin((angle * Math.PI) / 180) * 40;

      gsap.to(feature, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".why-features",
          start: "top 80%",
        },
        delay: i * 0.1,
      });

      gsap.from(feature, {
        x: fromX,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".why-features",
          start: "top 80%",
        },
        delay: i * 0.1,
      });
    });
  }

  /* ── PORTFOLIO Animations ──────────────────────────────────── */
  function animatePortfolio() {
    /* Section header */
    gsap.from(".portfolio .section-tag", {
      scrollTrigger: { trigger: ".portfolio", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".portfolio .section-title", {
      scrollTrigger: { trigger: ".portfolio", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });
    gsap.from(".portfolio .section-desc", {
      scrollTrigger: { trigger: ".portfolio", start: "top 76%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.25,
    });

    /* Image reveal with clip-path */
    document.querySelectorAll(".portfolio-item").forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
        },
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
        duration: 1,
        ease: "power3.inOut",
        delay: i * 0.08,
      });

      /* Parallax on scroll */
      gsap.to(item.querySelector(".portfolio-img"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
  }

  /* ── TESTIMONIALS Animations ───────────────────────────────── */
  function animateTestimonials() {
    gsap.from(".testimonials .section-tag", {
      scrollTrigger: { trigger: ".testimonials", start: "top 80%" },
      opacity: 0, y: 20, duration: 0.6,
    });
    gsap.from(".testimonials .section-title", {
      scrollTrigger: { trigger: ".testimonials", start: "top 78%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.15,
    });

    gsap.from(".testimonial-quote-mark", {
      scrollTrigger: { trigger: ".testimonials-container", start: "top 80%" },
      opacity: 0, scale: 0.5, duration: 0.8, ease: "power3.out",
    });

    gsap.from(".testimonial-text", {
      scrollTrigger: { trigger: ".testimonials-container", start: "top 75%" },
      opacity: 0, y: 30, duration: 0.8, delay: 0.2,
    });
  }

  /* ── STATS Animations ──────────────────────────────────────── */
  function animateStats() {
    document.querySelectorAll(".stat").forEach((stat, i) => {
      const countEl = stat.querySelector(".stat-count");
      const target = parseInt(stat.dataset.target);

      gsap.from(stat, {
        scrollTrigger: { trigger: ".stats-inner", start: "top 80%" },
        opacity: 0, y: 40,
        duration: 0.8, delay: i * 0.15, ease: "power2.out",
      });

      ScrollTrigger.create({
        trigger: stat,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              countEl.textContent = Math.floor(this.targets()[0].val);
            },
          });
        },
      });
    });
  }

  /* ── FINAL CTA Animations ──────────────────────────────────── */
  function animateFinalCta() {
    gsap.from(".fct-line", {
      scrollTrigger: { trigger: ".final-cta", start: "top 70%" },
      opacity: 0, y: 40,
      duration: 0.8, stagger: 0.15, ease: "power3.out",
    });

    gsap.from(".final-cta-sub", {
      scrollTrigger: { trigger: ".final-cta", start: "top 65%" },
      opacity: 0, y: 20, duration: 0.6, delay: 0.3,
    });

    gsap.from("#finalCtaBtn", {
      scrollTrigger: { trigger: ".final-cta", start: "top 60%" },
      opacity: 0, y: 20, scale: 0.95, duration: 0.8, delay: 0.45, ease: "power2.out",
    });

    /* Footer animations */
    gsap.from(".footer-divider", {
      scrollTrigger: { trigger: ".footer-divider", start: "top 90%" },
      opacity: 0, scaleX: 0,
      duration: 0.8, ease: "power2.out",
    });

    gsap.from(".footer-brand, .footer-col", {
      scrollTrigger: { trigger: ".footer-inner", start: "top 90%" },
      opacity: 0, y: 20,
      duration: 0.6, stagger: 0.1, ease: "power2.out",
    });
  }

  /* ── Window Resize Handler ─────────────────────────────────── */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

})();
