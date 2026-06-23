const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('[data-nav-links]');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 16));

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navLinks.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const typingTarget = document.querySelector('[data-typing]');
const phrases = ['accessible web experiences.', 'useful software products.', 'clean, scalable solutions.'];
let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeNextCharacter() {
  const phrase = phrases[phraseIndex];
  characterIndex += deleting ? -1 : 1;
  typingTarget.textContent = phrase.slice(0, characterIndex);

  let delay = deleting ? 35 : 65;
  if (!deleting && characterIndex === phrase.length) {
    deleting = true;
    delay = 1500;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 350;
  }
  window.setTimeout(typeNextCharacter, delay);
}

if (typingTarget && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typeNextCharacter();
} else if (typingTarget) {
  typingTarget.textContent = phrases[0];
}

const focusContent = {
  frontend: ['Frontend development', 'Responsive, accessible interfaces with purposeful interactions and clear component systems.'],
  backend: ['Backend & API development', 'Dependable services, thoughtful data models, integrations, and secure application flows.'],
  data: ['Data & AI workflows', 'Practical automation and analysis that turn unstructured information into useful outcomes.']
};

document.querySelectorAll('[data-focus]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-focus]').forEach((item) => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-selected', String(item === button));
  });
  const [title, description] = focusContent[button.dataset.focus];
  document.querySelector('[data-focus-detail]').innerHTML = `<strong>${title}</strong><p>${description}</p>`;
}));

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
  document.querySelectorAll('[data-category]').forEach((project) => {
    project.hidden = button.dataset.filter !== 'all' && !project.dataset.category.split(' ').includes(button.dataset.filter);
  });
}));

document.querySelectorAll('[data-timeline-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-timeline-filter]').forEach((item) => item.classList.toggle('active', item === button));
  document.querySelectorAll('[data-timeline]').forEach((item) => {
    item.hidden = button.dataset.timelineFilter !== 'all' && item.dataset.timeline !== button.dataset.timelineFilter;
  });
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelector('[data-year]').textContent = new Date().getFullYear();
