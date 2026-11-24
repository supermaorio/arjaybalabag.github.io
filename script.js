(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  const filters = [...document.querySelectorAll('.filter')];
  const cards = [...document.querySelectorAll('.project-card')];
  filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(item => item.classList.toggle('active', item === filter));
    const category = filter.dataset.filter;
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
    });
  }));

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const caption = lightbox?.querySelector('.lightbox-caption');
  const projectButtons = [...document.querySelectorAll('.project-image')];
  let currentIndex = 0;
  let lastFocusedElement = null;

  function showProject(index) {
    currentIndex = (index + projectButtons.length) % projectButtons.length;
    const button = projectButtons[currentIndex];
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector('img')?.alt || 'Project preview';
    caption.textContent = button.closest('.project-card')?.querySelector('h3')?.textContent || '';
  }
  function openLightbox(index) {
    lastFocusedElement = document.activeElement;
    showProject(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close')?.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
  }

  projectButtons.forEach((button, index) => button.addEventListener('click', () => openLightbox(index)));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => showProject(currentIndex - 1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => showProject(currentIndex + 1));
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showProject(currentIndex - 1);
    if (event.key === 'ArrowRight') showProject(currentIndex + 1);
  });
})();