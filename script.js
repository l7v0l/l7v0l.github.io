const USER = 'l7v0l';

const T = {
  en: {
    nav_about:'About', nav_skills:'Skills', nav_projects:'Projects', nav_contact:'Contact',
    hello:"Hello, I'm",
    lead:'I build fast, modern and good-looking websites, and I code in many programming languages.',
    cta_work:'View my work', cta_contact:'Contact me',
    st_tech:'Technologies', st_lang:'Spoken languages', st_ready:'Curiosity',
    about_t:'About me',
    about_p1:"I'm a web developer who loves turning ideas into real, polished products. I work across the full web stack and I'm comfortable in many programming languages.",
    about_p2:"I care about clean code, performance and design details. I'm always learning, always shipping, and I speak both English and Arabic.",
    f1:'Web development', f2:'Multi-language programming', f3:'English · العربية',
    skills_t:'Skills', proj_t:'Projects',
    proj_sub:'Live from my GitHub. New repositories appear here automatically.',
    proj_empty:'No public projects yet. Something great is coming soon 🚀',
    proj_err:'Could not load projects right now.',
    contact_t:'Contact', contact_p:"Have an idea or a project? Let's build it together.",
    made:'Built with HTML, CSS & JS',
    roles:['Web Developer','Multi-language Programmer','Problem Solver','Always Learning']
  },
  ar: {
    nav_about:'نبذة', nav_skills:'المهارات', nav_projects:'المشاريع', nav_contact:'تواصل',
    hello:'مرحباً، أنا',
    lead:'أبني مواقع سريعة وحديثة وجميلة، وأبرمج بعدة لغات برمجة.',
    cta_work:'شاهد أعمالي', cta_contact:'تواصل معي',
    st_tech:'تقنية', st_lang:'لغات أتحدثها', st_ready:'فضول',
    about_t:'نبذة عني',
    about_p1:'أنا مطوّر ويب أحب تحويل الأفكار إلى منتجات حقيقية متقنة. أعمل على كامل مكوّنات الويب وأتقن عدة لغات برمجة.',
    about_p2:'أهتم بالكود النظيف والأداء وتفاصيل التصميم. أتعلّم دائماً وأنجز دائماً، وأتحدث العربية والإنجليزية.',
    f1:'تطوير الويب', f2:'البرمجة بعدة لغات', f3:'العربية · English',
    skills_t:'المهارات', proj_t:'المشاريع',
    proj_sub:'مباشرة من حسابي في GitHub. أي مستودع جديد يظهر هنا تلقائياً.',
    proj_empty:'ما فيه مشاريع عامة حالياً. شي حلو قادم قريباً 🚀',
    proj_err:'تعذّر تحميل المشاريع الآن.',
    contact_t:'تواصل', contact_p:'عندك فكرة أو مشروع؟ خلنا نبنيه سوا.',
    made:'مبني بـ HTML و CSS و JS',
    roles:['مطوّر ويب','مبرمج بعدة لغات','حلّال مشاكل','متعلّم دائماً']
  }
};

const SKILLS = [
  ['HTML5','html5/html5-original'],['CSS3','css3/css3-original'],['JavaScript','javascript/javascript-original'],
  ['TypeScript','typescript/typescript-original'],['Python','python/python-original'],['Node.js','nodejs/nodejs-original'],
  ['React','react/react-original'],['Next.js','nextjs/nextjs-original'],['PHP','php/php-original'],
  ['Java','java/java-original'],['C++','cplusplus/cplusplus-original'],['C#','csharp/csharp-original'],
  ['Go','go/go-original'],['Rust','rust/rust-original'],['MySQL','mysql/mysql-original'],
  ['SQLite','sqlite/sqlite-original'],['Git','git/git-original'],['Linux','linux/linux-original'],
  ['VS Code','vscode/vscode-original'],['GitHub','github/github-original']
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
let lang = (navigator.language || '').startsWith('ar') ? 'ar' : 'en';
try { lang = localStorage.getItem('lang') || lang; } catch (e) {}

/* ---------- i18n ---------- */
function applyLang(l) {
  lang = l;
  const d = T[l];
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { if (d[el.dataset.i18n]) el.textContent = d[el.dataset.i18n]; });
  $('#lang').textContent = l === 'ar' ? 'English' : 'العربية';
  try { localStorage.setItem('lang', l); } catch (e) {}
  startTyping();
  loadProjects();
}
$('#lang').addEventListener('click', () => applyLang(lang === 'ar' ? 'en' : 'ar'));

/* ---------- typing ---------- */
let typeTimer;
function startTyping() {
  clearTimeout(typeTimer);
  const roles = T[lang].roles, el = $('#typed');
  let i = 0, j = 0, del = false;
  (function tick() {
    const w = roles[i];
    el.textContent = w.slice(0, j);
    if (!del && j === w.length) { del = true; typeTimer = setTimeout(tick, 1400); return; }
    if (del && j === 0) { del = false; i = (i + 1) % roles.length; }
    j += del ? -1 : 1;
    typeTimer = setTimeout(tick, del ? 40 : 85);
  })();
}

/* ---------- skills ---------- */
$('#skills-grid').innerHTML = SKILLS.map(([n, p]) =>
  `<div class="skill"><img loading="lazy" alt="${n}" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${p}.svg"><span>${n}</span></div>`).join('');

/* ---------- projects (GitHub API) ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function loadProjects() {
  const box = $('#projects-grid');
  box.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  try {
    const r = await fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=30`);
    if (!r.ok) throw new Error(r.status);
    const repos = (await r.json()).filter(x => !x.fork && x.name.toLowerCase() !== USER);
    if (!repos.length) { box.innerHTML = `<div class="empty">${T[lang].proj_empty}</div>`; return; }
    box.innerHTML = repos.map(p => `
      <a class="proj" href="${esc(p.html_url)}" target="_blank" rel="noopener">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description || '—')}</p>
        <div class="meta">${p.language ? `<span class="lang">${esc(p.language)}</span>` : ''}<span>★ ${p.stargazers_count}</span><span>⑂ ${p.forks_count}</span></div>
      </a>`).join('');
  } catch (e) {
    box.innerHTML = `<div class="empty">${T[lang].proj_err}</div>`;
  }
}
document.addEventListener('mousemove', e => {
  const c = e.target.closest && e.target.closest('.proj');
  if (!c) return;
  const b = c.getBoundingClientRect();
  c.style.setProperty('--mx', e.clientX - b.left + 'px');
  c.style.setProperty('--my', e.clientY - b.top + 'px');
});

/* ---------- nav ---------- */
const nav = $('#nav'), links = $('#links');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });
$('#burger').addEventListener('click', () => links.classList.toggle('open'));
$$('#links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) $$('#links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ---------- reveal + counters ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));
$$('[data-count]').forEach(el => {
  const to = +el.dataset.count, t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1600, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
});
$('#year').textContent = new Date().getFullYear();

/* ---------- particles ---------- */
(function () {
  const cv = $('#bg'), ctx = cv.getContext('2d');
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let W, H, pts, mouse = { x: -999, y: -999 };
  function size() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    pts = Array.from({ length: Math.min(90, Math.floor(W * H / 16000)) }, () => ({
      x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  }
  size();
  addEventListener('resize', size);
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.fillStyle = 'rgba(88,166,255,.7)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 120) { ctx.strokeStyle = `rgba(137,87,229,${.25 * (1 - d / 120)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
      const m = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
      if (m < 160) { ctx.strokeStyle = `rgba(88,166,255,${.5 * (1 - m / 160)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    }
    requestAnimationFrame(draw);
  })();
})();

applyLang(lang);
