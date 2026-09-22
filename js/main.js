/**
 * CyberWatch — main.js v2 Premium
 * Enhanced Three.js · GSAP ScrollTrigger · Lenis · Cursor Glow
 * Respects prefers-reduced-motion throughout.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   CURSOR GLOW
───────────────────────────────────────────── */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || prefersReducedMotion) {
    if (glow) glow.style.display = 'none';
    return;
  }

  let cx = -300, cy = -300;
  let tx = -300, ty = -300;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });

  function raf() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/* ─────────────────────────────────────────────
   LENIS SMOOTH SCROLL
───────────────────────────────────────────── */
let lenis;

function initLenis() {
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
}

/* ─────────────────────────────────────────────
   NAVBAR SCROLL STATE
───────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on any link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* Active section tracking */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-pill-link');
  if (!links.length || !sections.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ─────────────────────────────────────────────
   THREE.JS HERO — PREMIUM SHIELD + NODE NETWORK
───────────────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0x3b82f6, 0.2));

  const light1 = new THREE.PointLight(0x3b82f6, 3, 25);
  light1.position.set(4, 4, 4);
  scene.add(light1);

  const light2 = new THREE.PointLight(0x6366f1, 2, 20);
  light2.position.set(-5, -3, 2);
  scene.add(light2);

  const light3 = new THREE.PointLight(0x06b6d4, 1.5, 15);
  light3.position.set(0, 5, -2);
  scene.add(light3);

  /* ── Central shield group ── */
  const shieldGroup = new THREE.Group();
  scene.add(shieldGroup);

  // Outer torus ring
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.15,
  });
  const torus = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.025, 16, 100), torusMat);
  shieldGroup.add(torus);

  // Inner torus ring (rotated)
  const torus2 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.015, 12, 100), torusMat.clone());
  torus2.rotation.x = Math.PI / 2;
  shieldGroup.add(torus2);

  // Core icosahedron
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0c1d3f,
    emissive: 0x2563eb,
    emissiveIntensity: 0.5,
    metalness: 0.95,
    roughness: 0.05,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 2), coreMat);
  shieldGroup.add(core);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
  });
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.77, 2), wireMat);
  shieldGroup.add(wire);

  // Outer shell (glassy)
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a6e,
    emissive: 0x2563eb,
    emissiveIntensity: 0.1,
    metalness: 0.7,
    roughness: 0.3,
    transparent: true,
    opacity: 0.08,
    side: THREE.FrontSide,
  });
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1.55, 32, 32), shellMat);
  shieldGroup.add(shell);

  /* ── Orbit nodes ── */
  const nodeData = [
    { color: 0x3b82f6, label: 'LOCK',   r: 2.3, speed: 0.38, inc: 0.0, phase: 0.0 },
    { color: 0x10b981, label: 'UNLOCK', r: 2.7, speed: -0.28, inc: 0.6, phase: 1.0 },
    { color: 0xf59e0b, label: 'DB',     r: 2.1, speed: 0.22, inc: 1.1, phase: 2.1 },
    { color: 0x6366f1, label: 'SMTP',   r: 2.5, speed: -0.45, inc: 1.6, phase: 3.4 },
    { color: 0x06b6d4, label: 'START',  r: 3.0, speed: 0.3, inc: 0.9, phase: 4.7 },
    { color: 0xef4444, label: 'ALERT',  r: 2.2, speed: -0.2, inc: 0.3, phase: 5.8 },
  ];

  const orbitNodes = nodeData.map(d => {
    const geo = new THREE.SphereGeometry(0.07, 12, 12);
    const mat = new THREE.MeshStandardMaterial({
      color: d.color,
      emissive: d.color,
      emissiveIntensity: 1.2,
    });
    const node = new THREE.Mesh(geo, mat);
    scene.add(node);
    return { mesh: node, ...d };
  });

  /* ── Connection lines ── */
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.07,
  });

  // Dynamic lines from shield to nodes
  const lineGeometries = nodeData.map(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const line = new THREE.Line(geo, lineMat);
    scene.add(line);
    return line;
  });

  /* ── Particle field ── */
  const pCount = 300;
  const pPositions = new Float32Array(pCount * 3);
  const pSizes     = new Float32Array(pCount);

  for (let i = 0; i < pCount; i++) {
    pPositions[i * 3]     = (Math.random() - 0.5) * 22;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    pSizes[i] = Math.random() * 0.04 + 0.01;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 0.035,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── Secondary indigo particle field ── */
  const p2Count = 150;
  const p2Pos = new Float32Array(p2Count * 3);
  for (let i = 0; i < p2Count; i++) {
    p2Pos[i * 3]     = (Math.random() - 0.5) * 18;
    p2Pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    p2Pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const p2Geo = new THREE.BufferGeometry();
  p2Geo.setAttribute('position', new THREE.BufferAttribute(p2Pos, 3));
  const p2 = new THREE.Points(p2Geo, new THREE.PointsMaterial({
    color: 0x6366f1,
    size: 0.025,
    transparent: true,
    opacity: 0.2,
    sizeAttenuation: true,
  }));
  scene.add(p2);

  /* ── Mouse parallax ── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Resize ── */
  const resizeObs = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  resizeObs.observe(canvas);

  /* ── Animation loop ── */
  let rafId;
  const clock = new THREE.Clock();

  function animate() {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Shield rotation
    shieldGroup.rotation.y = t * 0.18;
    shieldGroup.rotation.x = Math.sin(t * 0.12) * 0.08;
    torus2.rotation.x     += 0.003;

    // Core subtle pulse
    const pulse = 1 + Math.sin(t * 1.8) * 0.025;
    core.scale.setScalar(pulse);
    wire.scale.setScalar(pulse * 1.01);

    // Light pulse
    light1.intensity = 2.5 + Math.sin(t * 2.2) * 0.5;
    light2.intensity = 1.5 + Math.cos(t * 1.6) * 0.3;

    // Orbit nodes
    orbitNodes.forEach((nd, i) => {
      const angle = t * nd.speed + nd.phase;
      const inc   = nd.inc;
      nd.mesh.position.set(
        Math.cos(angle) * nd.r,
        Math.sin(angle) * nd.r * Math.cos(inc),
        Math.sin(angle) * nd.r * Math.sin(inc),
      );

      // Update connection line
      const line = lineGeometries[i];
      const pos  = line.geometry.attributes.position.array;
      pos[0] = 0; pos[1] = 0; pos[2] = 0;
      pos[3] = nd.mesh.position.x;
      pos[4] = nd.mesh.position.y;
      pos[5] = nd.mesh.position.z;
      line.geometry.attributes.position.needsUpdate = true;
    });

    // Particle drift
    particles.rotation.y = t * 0.018;
    particles.rotation.x = t * 0.01;
    p2.rotation.y = -t * 0.022;
    p2.rotation.z = t * 0.008;

    // Mouse parallax
    if (!prefersReducedMotion) {
      targetX += (mouseX - targetX) * 0.035;
      targetY += (mouseY - targetY) * 0.035;
      shieldGroup.rotation.y += targetX * 0.25;
      shieldGroup.rotation.x += targetY * 0.08;
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.015;
      camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.015;
    }

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  if (!prefersReducedMotion) {
    animate();
  } else {
    shieldGroup.rotation.y = 0.4;
    renderer.render(scene, camera);
  }

  return () => {
    cancelAnimationFrame(rafId);
    renderer.dispose();
    resizeObs.disconnect();
  };
}

/* ─────────────────────────────────────────────
   GSAP SCROLL ANIMATIONS
───────────────────────────────────────────── */
function initScrollAnimations() {
  if (typeof gsap === 'undefined') {
    initFallbackAnimations();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-up, .fade-in').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.arch-node').forEach(n => n.classList.add('active'));
    document.querySelectorAll('.arch-connector-fill').forEach(f => { f.style.height = '100%'; });
    return;
  }

  /* Hero entrance — cinematic stagger */
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .from('.hero-badge',       { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' })
    .from('.hero-title .line-1', { opacity: 0, y: 50, duration: 1.0, ease: 'power4.out' }, '-=0.3')
    .from('.hero-title .line-2', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.6')
    .from('.hero-description', { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .from('.hero-ctas',        { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.45')
    .from('.hero-stats',       { opacity: 0, y: 16, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .from('.hero-scroll-indicator', { opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1');

  /* Fade-up elements */
  gsap.utils.toArray('.fade-up').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 44 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Fade-in */
  gsap.utils.toArray('.fade-in').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1, duration: 1.0, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Feature cards — stagger in groups */
  const featureCards = gsap.utils.toArray('.feature-card');
  featureCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65,
        delay: (i % 3) * 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Architecture flow */
  initArchFlow();

  /* Test items */
  gsap.utils.toArray('.test-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -16 },
      {
        opacity: 1, x: 0,
        duration: 0.45, delay: i * 0.04, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 93%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Install steps */
  gsap.utils.toArray('.install-step').forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, x: -28 },
      {
        opacity: 1, x: 0,
        duration: 0.65, delay: i * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 92%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Download button pulse on enter */
  const dlBtn = document.querySelector('.download-primary');
  if (dlBtn) {
    gsap.fromTo(dlBtn,
      { opacity: 0, scale: 0.95, y: 20 },
      {
        opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: dlBtn, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }

  /* Validation stats count-up feel */
  gsap.utils.toArray('.validation-stat-number').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.6, y: 20 },
      {
        opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.8)',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Tech items */
  gsap.utils.toArray('.tech-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 16 },
      {
        opacity: 1, y: 0,
        duration: 0.4, delay: i * 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 92%', toggleActions: 'play none none none' }
      }
    );
  });

  /* Parallax on hero orbs */
  gsap.utils.toArray('.hero-orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: (i % 2 === 0 ? -80 : 80),
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  });
}

/* ─────────────────────────────────────────────
   ARCHITECTURE FLOW ANIMATION
───────────────────────────────────────────── */
function initArchFlow() {
  if (typeof gsap === 'undefined' || prefersReducedMotion) {
    document.querySelectorAll('.arch-node').forEach(n => n.classList.add('active'));
    document.querySelectorAll('.arch-connector-fill').forEach(f => { f.style.height = '100%'; });
    return;
  }

  const steps      = document.querySelectorAll('.arch-step');
  const connectors = document.querySelectorAll('.arch-connector-fill');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#how-it-works',
      start: 'top 55%',
      once: true,
    }
  });

  steps.forEach((step, i) => {
    const node = step.querySelector('.arch-node');

    tl.add(() => {
      if (node) node.classList.add('active');
      if (step.querySelector('.arch-step-title')) {
        step.classList.add('has-active');
      }
    }, i * 0.4);

    if (i < connectors.length) {
      tl.to(connectors[i], {
        height: '100%', duration: 0.35, ease: 'power2.inOut'
      }, i * 0.4 + 0.18);
    }
  });
}

/* ─────────────────────────────────────────────
   FALLBACK ANIMATIONS (no GSAP)
───────────────────────────────────────────── */
function initFallbackAnimations() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-up, .fade-in').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.arch-node').forEach(n => n.classList.add('active'));
    document.querySelectorAll('.arch-connector-fill').forEach(f => { f.style.height = '100%'; });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => io.observe(el));

  const archIO = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.arch-node').forEach((node, i) => {
        setTimeout(() => node.classList.add('active'), i * 350);
      });
      document.querySelectorAll('.arch-connector-fill').forEach((fill, i) => {
        setTimeout(() => { fill.style.height = '100%'; }, i * 350 + 200);
      });
      archIO.disconnect();
    }
  }, { threshold: 0.2 });

  const archSection = document.getElementById('how-it-works');
  if (archSection) archIO.observe(archSection);
}

/* ─────────────────────────────────────────────
   FEATURE CARD SPOTLIGHT EFFECT
───────────────────────────────────────────── */
function initCardSpotlight() {
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
}

/* ─────────────────────────────────────────────
   SMOOTH ANCHORS
───────────────────────────────────────────── */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─────────────────────────────────────────────
   DOWNLOAD BUTTONS
───────────────────────────────────────────── */
function initDownloadButtons() {
  document.querySelectorAll('[data-download]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('downloading');
      setTimeout(() => btn.classList.remove('downloading'), 2500);
    });
  });
}

/* ─────────────────────────────────────────────
   HERO STATS — STAGGERED HOVER
───────────────────────────────────────────── */
function initHeroStats() {
  const stats = document.querySelectorAll('.hero-stat');
  stats.forEach((stat, i) => {
    stat.style.transitionDelay = `${i * 50}ms`;
  });
}

/* ═══════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initLenis();
  initHeroCanvas();
  initScrollAnimations();
  initCardSpotlight();
  initSmoothAnchors();
  initDownloadButtons();
  initHeroStats();
});
