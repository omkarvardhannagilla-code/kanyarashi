/* ===== KanyaRashi Portfolio — main.js (v7 fixed) ===== */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTouch  = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* ════════════════════════════════════════
     FIX 2 — CURSOR
     Position via left/top (NO CSS transition on left/top → zero lag).
     Scale via transform (CSS transition:transform applies only here).
     cursor.style.scale is non-standard — use transform:scale() instead.
  ════════════════════════════════════════ */
  if (!isMobile && !isTouch) {
    const cursor   = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (cursor && follower) {
      let mx = -200, my = -200;
      let fx = -200, fy = -200;

      // Cursor tracks mouse instantly — left/top, no transition
      document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = (mx - 6) + 'px';
        cursor.style.top  = (my - 6) + 'px';
      }, { passive: true });

      // Follower: smooth RAF lerp via left/top
      ;(function loop() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.left = (fx - 20) + 'px';
        follower.style.top  = (fy - 20) + 'px';
        requestAnimationFrame(loop);
      })();

      // Scale on hover — transform only (transition:transform 0.15s in CSS)
      function addHover(selector) {
        document.querySelectorAll(selector).forEach(el => {
          el.addEventListener('mouseenter', () => {
            cursor.style.transform   = 'scale(2.2)';
            follower.style.transform = 'scale(1.5)';
          });
          el.addEventListener('mouseleave', () => {
            cursor.style.transform   = 'scale(1)';
            follower.style.transform = 'scale(1)';
          });
        });
      }
      addHover('a');
      addHover('button');
      addHover('.btn-primary');
      addHover('.team-card');
      addHover('.skill-card');
      addHover('.member-avatar');
      addHover('.card-cta');
      addHover('.nav-cta');

      // Hide cursor when mouse leaves window
      document.addEventListener('mouseleave', () => {
        cursor.style.opacity   = '0';
        follower.style.opacity = '0';
      });
      document.addEventListener('mouseenter', () => {
        cursor.style.opacity   = '1';
        follower.style.opacity = '1';
      });
    }
  }

  /* ════════════════════════════════════════
     FIX 1 — LOADER EXIT ANIMATION
     loaderExit CSS animation = 0.8s.
     Inner timeout MUST be >= 800ms so animation fully completes before display:none.
     Previous value was 500ms → animation was cut at 62%.
  ════════════════════════════════════════ */
  const loader = document.getElementById('loader');
  const body   = document.body;
  body.classList.add('no-scroll');

  const loaderDelay = isMobile ? 2000 : 3400;

  const loaderNum = document.querySelector('.loader-num');
  let count = 0;
  const counterInterval = setInterval(() => {
    count += isMobile ? 3 : (Math.random() > 0.5 ? 2 : 1);
    if (count >= 100) { count = 100; clearInterval(counterInterval); }
    if (loaderNum) loaderNum.textContent = String(count).padStart(3, '0') + '%';
  }, isMobile ? 18 : 25);

  setTimeout(() => {
    loader.classList.add('loader-exit');
    // 900ms > 800ms animation — guaranteed complete before hiding
    setTimeout(() => {
      loader.style.display = 'none';
      body.classList.remove('no-scroll');
      const nav = document.querySelector('nav');
      if (nav) nav.classList.add('visible');
      initScrollReveal();
    }, 900);
  }, loaderDelay);

  /* ── Smooth scroll nav ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
    });
  });

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), isMobile ? 0 : i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => obs.observe(el));
  }

  /* ── Parallax Hero (desktop only) ── */
  if (!isMobile) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const heroBg = document.querySelector('.hero-bg');
          if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
          const heroContent = document.querySelector('.hero-content');
          if (heroContent) heroContent.style.transform = `translateY(${y * 0.2}px)`;
          const heroTitle = document.querySelector('.hero-title');
          if (heroTitle) heroTitle.style.opacity = Math.max(0, 1 - (y / 600));
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Member Detail Overlay ── */
  window.openMemberDetail = function(name) {
    const member = (window.memberData || []).find(m => m.name === name);
    if (!member) return;

    const panel = document.getElementById('member-detail');
    panel.style.display = 'flex';
    requestAnimationFrame(() => panel.classList.add('active'));

    document.getElementById('detail-num').textContent  = member.num;
    document.getElementById('detail-name').textContent = member.name;
    document.getElementById('detail-role').textContent = member.role;
    document.getElementById('detail-bio').textContent  = member.bio;

    const photoEl = document.getElementById('detail-photo');
    if (member.photo) {
      photoEl.innerHTML = `<img src="assets/${member.photo}" alt="${member.name}" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:center 15%;">`;
    } else {
      photoEl.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:60px;color:var(--accent);">${member.name[0]}</div>`;
    }

    const skillsEl = document.getElementById('detail-skills');
    skillsEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    member.skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.setAttribute('data-level', skill.level + '%');
      card.innerHTML = `<div class="skill-card-icon">${skill.icon}</div><div class="skill-card-name">${skill.name}</div><div class="skill-card-desc">${skill.desc}</div><div class="skill-bar"><div class="skill-fill" data-target="${skill.level}%"></div></div>`;
      frag.appendChild(card);
    });
    skillsEl.appendChild(frag);

    if (isMobile) {
      try { panel.querySelector('.detail-panel').scrollTop = 0; } catch(e) {}
    }
    setTimeout(() => {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-target');
      });
    }, 250);

    document.body.classList.add('no-scroll');
  };

  window.closeMemberDetail = function() {
    const panel = document.getElementById('member-detail');
    panel.classList.remove('active');
    setTimeout(() => {
      panel.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }, 300);
  };

  document.querySelector('.detail-overlay')?.addEventListener('click', window.closeMemberDetail);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeMemberDetail(); });

  /* ── Nav highlight ── */
  if (!isMobile) {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === '#' + entry.target.id ? 'var(--accent)' : '';
          });
        }
      });
    }, { threshold: 0.5, rootMargin: '-50% 0px -50% 0px' })
      .observe(document.querySelector('section[id]') || document.body);
  }

  /* ── Magnetic CTA + Card spotlight (desktop only) ── */
  if (!isMobile) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*0.2}px,${(e.clientY-r.top-r.height/2)*0.3}px)`;
      }, { passive: true });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
    document.querySelectorAll('.team-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.background = `radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(200,255,0,.05) 0%,var(--surface2) 60%)`;
      }, { passive: true });
      card.addEventListener('mouseleave', () => { card.style.background = ''; });
    });
  }

  /* ── Tools marquee pause on hover ── */
  document.querySelectorAll('.tools-track').forEach(track => {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });

  /* ── Counter animation ── */
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let n = 0;
        const step = target / (isMobile ? 35 : 70);
        const t = setInterval(() => {
          n = Math.min(n + step, target);
          el.textContent = Math.floor(n) + suffix;
          if (n >= target) clearInterval(t);
        }, 16);
      });
      counterObs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObs.observe(heroStats);

});

/* ── Member Data ── */
window.memberData = [
  {
    name: 'Omkar',
    num: '01 / MEMBER',
    role: 'Web Developer & Graphic Designer',
    photo: 'omkar.png',
    bio: 'Full-stack developer with a sharp eye for design. Omkar transforms concepts into pixel-perfect, performant web experiences — blending code precision with graphic artistry to build products that look as good as they work.',
    skills: [
      { name: 'React & Next.js', icon: '⚛️', desc: 'Building blazing-fast web applications', level: 92 },
      { name: 'Graphic Design',  icon: '🎨', desc: 'Adobe Suite, Figma, visual systems',      level: 88 },
      { name: 'Node.js & APIs',  icon: '🔧', desc: 'Backend logic, REST & GraphQL APIs',       level: 85 },
      { name: 'CSS Animation',   icon: '✨', desc: 'Motion design & micro-interactions',        level: 90 }
    ]
  },
  {
    name: 'Revan',
    num: '02 / MEMBER',
    role: 'Software Architect',
    photo: 'revan.png',
    bio: 'Revan architects scalable digital systems that power great products. With expertise in system design and backend infrastructure, he ensures every project is built on a solid, future-proof foundation.',
    skills: [
      { name: 'System Design',   icon: '🏗️', desc: 'Scalable architecture & microservices', level: 93 },
      { name: 'Cloud & DevOps',  icon: '☁️', desc: 'AWS, Docker, CI/CD pipelines',          level: 88 },
      { name: 'Database Design', icon: '🗄️', desc: 'SQL, NoSQL, query optimization',         level: 90 },
      { name: 'Security',        icon: '🔐', desc: 'Auth, encryption, secure APIs',           level: 86 }
    ]
  },
  {
    name: 'Shiva Teja',
    num: '03 / MEMBER',
    role: 'UI Designer',
    photo: 'shiva_teja.png',
    bio: 'Shiva crafts interfaces that users fall in love with. His designs are thoughtful, minimal, and deeply intentional — turning complex problems into clean, intuitive visual solutions that delight.',
    skills: [
      { name: 'UI Design',       icon: '🎭', desc: 'Figma, wireframing, design systems',          level: 94 },
      { name: 'Prototyping',     icon: '🔄', desc: 'High-fidelity interactive prototypes',         level: 90 },
      { name: 'Brand Identity',  icon: '💎', desc: 'Logo, typography, color theory',               level: 87 },
      { name: 'Motion Design',   icon: '🎬', desc: 'After Effects, Lottie animations',             level: 85 }
    ]
  },
  {
    name: 'Yuva Teja',
    num: '04 / MEMBER',
    role: 'AI Prompt Engineer',
    photo: 'yuva_teja.png',
    bio: 'Yuva is at the frontier of AI-powered development. He harnesses large language models, generative AI tools, and prompt engineering to supercharge team productivity and build next-gen AI-integrated products.',
    skills: [
      { name: 'Prompt Engineering', icon: '🤖', desc: 'LLMs, Claude, GPT, Gemini',              level: 95 },
      { name: 'AI Automation',      icon: '⚡', desc: 'Workflow automation with AI tools',        level: 91 },
      { name: 'Python & LangChain', icon: '🐍', desc: 'AI pipeline development',                  level: 88 },
      { name: 'No-Code AI',         icon: '🛠️', desc: 'Bubble, Webflow + AI integrations',        level: 86 }
    ]
  },
  {
    name: 'Karthik',
    num: '05 / MEMBER',
    role: 'UX Researcher',
    photo: 'karthik.jpg',
    bio: 'Karthik champions the user in every decision. Through research, testing, and empathy, he uncovers the insights that shape products people actually want to use — turning data into clarity and clarity into direction.',
    skills: [
      { name: 'User Research',          icon: '🔍', desc: 'Interviews, surveys, usability tests', level: 93 },
      { name: 'Data Analysis',          icon: '📊', desc: 'Analytics, heatmaps, A/B testing',     level: 89 },
      { name: 'Information Architecture',icon:'🗺️', desc: 'Sitemaps, user flows, journey maps',   level: 91 },
      { name: 'Accessibility',          icon: '♿', desc: 'WCAG guidelines, inclusive design',     level: 87 }
    ]
  }
];
