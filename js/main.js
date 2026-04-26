/* ===== KanyaRashi Portfolio - Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Custom Cursor ── */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let mx = -100, my = -100, fx = -100, fy = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  (function followLoop() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = (fx - 20) + 'px';
    follower.style.top = (fy - 20) + 'px';
    requestAnimationFrame(followLoop);
  })();
  document.querySelectorAll('a, button, .btn-primary, .team-card, .skill-card, .member-avatar').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      follower.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      follower.style.transform = 'scale(1)';
    });
  });

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  const body = document.body;
  body.classList.add('no-scroll');

  setTimeout(() => {
    loader.classList.add('loader-exit');
    setTimeout(() => {
      loader.style.display = 'none';
      body.classList.remove('no-scroll');
      document.querySelector('nav').classList.add('visible');
      initScrollReveal();
    }, 800);
  }, 3400);

  /* ── Loader progress counter ── */
  const loaderNum = document.querySelector('.loader-num');
  let count = 0;
  const counter = setInterval(() => {
    count += Math.random() > 0.5 ? 2 : 1;
    if (count >= 100) { count = 100; clearInterval(counter); }
    if (loaderNum) loaderNum.textContent = String(count).padStart(3, '0') + '%';
  }, 25);

  /* ── Smooth scroll nav ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => obs.observe(el));
  }

  /* ── Parallax Hero ── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.2}px)`;
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.style.opacity = 1 - (y / 600);
  });

  /* ── Skill fill animation on detail open ── */
  window.openMemberDetail = function(name) {
    const members = window.memberData;
    const member = members.find(m => m.name === name);
    if (!member) return;

    const panel = document.getElementById('member-detail');
    panel.style.display = 'flex';
    setTimeout(() => panel.classList.add('active'), 10);

    document.getElementById('detail-num').textContent = member.num;
    document.getElementById('detail-name').textContent = member.name;
    document.getElementById('detail-role').textContent = member.role;
    document.getElementById('detail-bio').textContent = member.bio;

    const photoEl = document.getElementById('detail-photo');
    if (member.photo) {
      photoEl.innerHTML = `<img src="assets/${member.photo}" alt="${member.name}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
      photoEl.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:60px;color:var(--accent);">${member.name[0]}</div>`;
    }

    const skillsEl = document.getElementById('detail-skills');
    skillsEl.innerHTML = '';
    member.skills.forEach((skill, i) => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.setAttribute('data-level', skill.level + '%');
      card.innerHTML = `
        <div class="skill-card-icon">${skill.icon}</div>
        <div class="skill-card-name">${skill.name}</div>
        <div class="skill-card-desc">${skill.desc}</div>
        <div class="skill-bar"><div class="skill-fill" style="width:0%" data-target="${skill.level}%"></div></div>
      `;
      skillsEl.appendChild(card);
    });

    // Animate skill bars
    setTimeout(() => {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-target');
      });
    }, 300);

    document.body.classList.add('no-scroll');
  };

  window.closeMemberDetail = function() {
    const panel = document.getElementById('member-detail');
    panel.classList.remove('active');
    setTimeout(() => {
      panel.style.display = 'none';
      document.body.classList.remove('no-scroll');
    }, 400);
  };

  /* ── Close on overlay click ── */
  document.querySelector('.detail-overlay')?.addEventListener('click', window.closeMemberDetail);

  /* ── Keyboard close ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeMemberDetail();
  });

  /* ── Drone Zoom Effect for Explore ── */
  const exploreSection = document.getElementById('explore');
  if (exploreSection) {
    const exploreObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          exploreSection.classList.add('zoomed-in');
          const exploreTitle = exploreSection.querySelector('.explore-title');
          if (exploreTitle) {
            exploreTitle.style.animation = 'droneZoom 1.2s cubic-bezier(0.16,1,0.3,1) forwards';
          }
          exploreObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    exploreObs.observe(exploreSection);
  }

  /* ── Nav active state ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + entry.target.id
            ? 'var(--accent)' : '';
        });
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => sectionObs.observe(s));

  /* ── Magnetic effect on CTA button ── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const bx = e.clientX - rect.left - rect.width / 2;
      const by = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${bx * 0.25}px, ${by * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── Team card hover ripple ── */
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(200,255,0,0.04) 0%, var(--surface2) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ── Tools marquee pause on hover ── */
  document.querySelectorAll('.tools-track').forEach(track => {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  });

  /* ── Number counter animation ── */
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
      if (start >= target) clearInterval(timer);
    }, 16);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          const target = parseInt(el.dataset.target);
          animateCounter(el, target);
        });
        counterObs.unobserve(entry.target);
      }
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
      { name: 'Graphic Design', icon: '🎨', desc: 'Adobe Suite, Figma, visual systems', level: 88 },
      { name: 'Node.js & APIs', icon: '🔧', desc: 'Backend logic, REST & GraphQL APIs', level: 85 },
      { name: 'CSS Animation', icon: '✨', desc: 'Motion design & micro-interactions', level: 90 }
    ]
  },
  {
    name: 'Revan',
    num: '02 / MEMBER',
    role: 'Software Architect',
    photo: 'revan.png',
    bio: 'Revan architects scalable digital systems that power great products. With expertise in system design and backend infrastructure, he ensures every project is built on a solid, future-proof foundation.',
    skills: [
      { name: 'System Design', icon: '🏗️', desc: 'Scalable architecture & microservices', level: 93 },
      { name: 'Cloud & DevOps', icon: '☁️', desc: 'AWS, Docker, CI/CD pipelines', level: 88 },
      { name: 'Database Design', icon: '🗄️', desc: 'SQL, NoSQL, query optimization', level: 90 },
      { name: 'Security', icon: '🔐', desc: 'Auth, encryption, secure APIs', level: 86 }
    ]
  },
  {
    name: 'Shiva Teja',
    num: '03 / MEMBER',
    role: 'UI Designer',
    photo: 'shiva_teja.png',
    bio: 'Shiva crafts interfaces that users fall in love with. His designs are thoughtful, minimal, and deeply intentional — turning complex problems into clean, intuitive visual solutions that delight.',
    skills: [
      { name: 'UI Design', icon: '🎭', desc: 'Figma, wireframing, design systems', level: 94 },
      { name: 'Prototyping', icon: '🔄', desc: 'High-fidelity interactive prototypes', level: 90 },
      { name: 'Brand Identity', icon: '💎', desc: 'Logo, typography, color theory', level: 87 },
      { name: 'Motion Design', icon: '🎬', desc: 'After Effects, Lottie animations', level: 85 }
    ]
  },
  {
    name: 'Yuva Teja',
    num: '04 / MEMBER',
    role: 'AI Prompt Engineer',
    photo: 'yuva_teja.png',
    bio: 'Yuva is at the frontier of AI-powered development. He harnesses the power of large language models, generative AI tools, and prompt engineering to supercharge team productivity and build next-gen AI-integrated products.',
    skills: [
      { name: 'Prompt Engineering', icon: '🤖', desc: 'LLMs, Claude, GPT, Gemini', level: 95 },
      { name: 'AI Automation', icon: '⚡', desc: 'Workflow automation with AI tools', level: 91 },
      { name: 'Python & LangChain', icon: '🐍', desc: 'AI pipeline development', level: 88 },
      { name: 'No-Code AI', icon: '🛠️', desc: 'Bubble, Webflow + AI integrations', level: 86 }
    ]
  },
  {
    name: 'Karthik',
    num: '05 / MEMBER',
    role: 'UX Researcher',
    photo: 'karthik.jpg',
    bio: 'Karthik champions the user in every decision. Through research, testing, and empathy, he uncovers the insights that shape products people actually want to use — turning data into clarity and clarity into direction.',
    skills: [
      { name: 'User Research', icon: '🔍', desc: 'Interviews, surveys, usability tests', level: 93 },
      { name: 'Data Analysis', icon: '📊', desc: 'Analytics, heatmaps, A/B testing', level: 89 },
      { name: 'Information Architecture', icon: '🗺️', desc: 'Sitemaps, user flows, journey maps', level: 91 },
      { name: 'Accessibility', icon: '♿', desc: 'WCAG guidelines, inclusive design', level: 87 }
    ]
  }
];
