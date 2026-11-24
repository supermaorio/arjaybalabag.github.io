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
  const projectButtons = [...document.querySelectorAll('.project-image:not(.comic-project-trigger):not(.website-project)')];
  const lightboxControls = [...(lightbox?.querySelectorAll('button') || [])];
  let currentIndex = 0;
  let visibleProjects = projectButtons;
  let lastFocusedElement = null;

  function showProject(index) {
    if (!visibleProjects.length) return;
    currentIndex = (index + visibleProjects.length) % visibleProjects.length;
    const button = visibleProjects[currentIndex];
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector('img')?.alt || 'Project preview';
    caption.textContent = button.closest('.project-card')?.querySelector('h3')?.textContent || button.querySelector('img')?.alt || '';
  }
  function openLightbox(button) {
    lastFocusedElement = document.activeElement;
    visibleProjects = projectButtons.filter(item => !item.closest('.project-card')?.hidden);
    const index = visibleProjects.indexOf(button);
    showProject(index < 0 ? 0 : index);
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

  projectButtons.forEach(button => button.addEventListener('click', () => openLightbox(button)));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', () => showProject(currentIndex - 1));
  lightbox?.querySelector('.lightbox-next')?.addEventListener('click', () => showProject(currentIndex + 1));
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showProject(currentIndex - 1);
    if (event.key === 'ArrowRight') showProject(currentIndex + 1);
    if (event.key === 'Tab' && lightboxControls.length) {
      const first = lightboxControls[0];
      const last = lightboxControls[lightboxControls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  // Keep the comic inside the portfolio in a view-only Canva embed.
  const comicViewer = document.querySelector('.comic-viewer');
  const comicTrigger = document.querySelector('.comic-project-trigger');
  const comicClose = comicViewer?.querySelector('.comic-viewer-close');
  let comicLastFocus = null;
  function openComicViewer() {
    comicLastFocus = document.activeElement;
    comicViewer?.classList.add('open');
    comicViewer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    comicClose?.focus();
  }
  function closeComicViewer() {
    comicViewer?.classList.remove('open');
    comicViewer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    comicLastFocus?.focus();
  }
  comicTrigger?.addEventListener('click', openComicViewer);
  comicClose?.addEventListener('click', closeComicViewer);
  comicViewer?.addEventListener('click', event => {
    if (event.target === comicViewer) closeComicViewer();
  });
  document.addEventListener('keydown', event => {
    if (comicViewer?.classList.contains('open') && event.key === 'Escape') closeComicViewer();
  });

})();