const nav = document.querySelector('#siteNav');
const progress = document.querySelector('#progress');
const burger = document.querySelector('#burgerBtn');
const mobileNav = document.querySelector('#mobileNav');
const mobileClose = document.querySelector('#mobileClose');
const typedText = document.querySelector('#typedText');

function updateScrollEffects() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  nav?.classList.toggle('scrolled', scrollTop > 18);
  if (progress && maxScroll > 0) {
    progress.style.width = `${(scrollTop / maxScroll) * 100}%`;
  }

  document.querySelectorAll('[data-speed]').forEach((item) => {
    const speed = Number(item.dataset.speed || 0);
    item.style.transform = `translate3d(0, ${scrollTop * (1 - speed) * 0.08}px, 0)`;
  });
}

window.addEventListener('scroll', updateScrollEffects, { passive: true });
updateScrollEffects();

function setMenu(open) {
  mobileNav?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  burger?.setAttribute('aria-expanded', String(open));
}

burger?.addEventListener('click', () => setMenu(true));
mobileClose?.addEventListener('click', () => setMenu(false));
document.querySelectorAll('[data-close-mobile]').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

const phrases = [
  'AI-first product experiences.',
  'reliable travel booking journeys.',
  'workflow automation systems.',
  'B2B SaaS products grounded in user insight.'
];
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typedText) return;
  const phrase = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  typedText.textContent = phrase.slice(0, charIndex);

  let delay = deleting ? 34 : 58;
  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    delay = 1450;
  }
  if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 330;
  }
  window.setTimeout(typeLoop, delay);
}

if (typedText) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedText.textContent = phrases[0];
  } else {
    typeLoop();
  }
}

const interestCopy = {
  product: ['Product strategy', 'I turn business goals and customer problems into roadmaps, PRDs, priorities, and product releases.'],
  ux: ['User experience', 'I map user journeys, interview users, prototype flows, and remove friction from high-impact moments.'],
  data: ['Data & experimentation', 'I use funnels, analytics, A/B testing, and product signals to decide what needs to improve next.'],
  ai: ['AI / automation', 'I design AI-first workflows that reduce repetitive work and make teams faster without losing clarity.']
};

document.querySelectorAll('[data-interest]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-interest]').forEach((item) => item.classList.toggle('active', item === button));
    const [title, body] = interestCopy[button.dataset.interest];
    document.querySelector('#interestResult').innerHTML = `<strong>${title}</strong><span>${body}</span>`;
  });
});

function applyCaseFilter(filter) {
  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  document.querySelectorAll('[data-cats]').forEach((card) => {
    const categories = card.dataset.cats.split(' ');
    card.hidden = filter !== 'all' && !categories.includes(filter);
  });
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => applyCaseFilter(button.dataset.filter));
});
document.querySelectorAll('[data-approach]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-approach]').forEach((item) => item.classList.toggle('active', item === button));
    applyCaseFilter(button.dataset.approach);
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('[data-timeline-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-timeline-filter]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('[data-timeline]').forEach((item) => {
      item.hidden = button.dataset.timelineFilter !== 'all' && item.dataset.timeline !== button.dataset.timelineFilter;
    });
  });
});

document.querySelectorAll('.show-more').forEach((button) => {
  button.addEventListener('click', () => {
    const body = button.closest('.timeline-body');
    const open = !body.classList.contains('open');
    body.classList.toggle('open', open);
    button.textContent = open ? 'Hide details' : 'Show details';
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const cursorDot = document.querySelector('#cursor-dot');
const cursorRing = document.querySelector('#cursor-ring');
let pointerX = 0;
let pointerY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse') return;
  document.body.classList.add('has-cursor');
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${pointerX}px`;
    cursorDot.style.top = `${pointerY}px`;
  }
});

function animateCursor() {
  ringX += (pointerX - ringX) * 0.18;
  ringY += (pointerY - ringY) * 0.18;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .album-card, .case-card').forEach((item) => {
  item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.querySelectorAll('.magnetic').forEach((item) => {
  item.addEventListener('mousemove', (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

document.querySelectorAll('.album-card').forEach((card) => {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let left = 0;
  let top = 0;

  card.addEventListener('pointerdown', (event) => {
    dragging = true;
    card.setPointerCapture(event.pointerId);
    const rect = card.getBoundingClientRect();
    const parent = card.offsetParent.getBoundingClientRect();
    startX = event.clientX;
    startY = event.clientY;
    left = rect.left - parent.left;
    top = rect.top - parent.top;
    card.style.transform = 'rotate(0deg) scale(1.02)';
    card.style.zIndex = '10';
  });

  card.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    card.style.left = `${left + event.clientX - startX}px`;
    card.style.top = `${top + event.clientY - startY}px`;
  });

  card.addEventListener('pointerup', () => {
    dragging = false;
    card.style.zIndex = '';
  });
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
