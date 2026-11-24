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

  // Album folders are intentionally empty until photo sets are supplied.
  const albumViewer = document.querySelector('.album-viewer');
  const albumTitle = albumViewer?.querySelector('.album-viewer-title');
  const albumEmpty = albumViewer?.querySelector('.album-empty');
  const albumNames = {events:'iDeasigns',photography:'mugnaniMao'};
  const albumPhotos = {
    events: [
      {src:'images/sportsfest.jpg',alt:'Sports Fest event'},
      {src:'images/retreat.jpg',alt:'Retreat event'},
      {src:'images/fellowship.jpg',alt:'Fellowship event'},
      {src:'images/foundationschool.jpg',alt:'Foundation School'},
      {src:'images/youthcamp.jpg',alt:'Youth Camp'},
      {src:'images/vbs.jpg',alt:'Vacation Bible School'},
      {src:'images/conference.jpg',alt:'Conference'},
      {src:'images/anniversary.jpg',alt:'Anniversary'}
    ],
    photography: []
  };
  const albumGrid = albumViewer?.querySelector('.album-photo-grid');
  const albumButtons = [...document.querySelectorAll('.collection-card')];
  let albumLastFocus = null;
  function openAlbum(button) {
    albumLastFocus = document.activeElement;
    const album = button.dataset.album;
    if (albumTitle) albumTitle.textContent = albumNames[album] || 'Photo Album';
    const photos = albumPhotos[album] || [];
    if (albumGrid) {
      albumGrid.replaceChildren();
      photos.forEach(photo => {
        const image = document.createElement('img');
        image.src = photo.src;
        image.alt = photo.alt;
        image.loading = 'lazy';
        albumGrid.appendChild(image);
      });
    }
    if (albumEmpty) albumEmpty.hidden = photos.length > 0;
    albumViewer?.classList.add('open');
    albumViewer?.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    albumViewer?.querySelector('.album-viewer-close')?.focus();
  }
  function closeAlbum() {
    albumViewer?.classList.remove('open');
    albumViewer?.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    albumLastFocus?.focus();
  }
  albumButtons.forEach(button => button.addEventListener('click', () => openAlbum(button)));
  albumViewer?.querySelector('.album-viewer-close')?.addEventListener('click', closeAlbum);
  albumViewer?.addEventListener('click', event => { if (event.target === albumViewer) closeAlbum(); });
  document.addEventListener('keydown', event => {
    if (albumViewer?.classList.contains('open') && event.key === 'Escape') closeAlbum();
  });

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const caption = lightbox?.querySelector('.lightbox-caption');
  const projectButtons = [...document.querySelectorAll('.project-image:not(.comic-project-trigger)')];
  const lightboxControls = [...(lightbox?.querySelectorAll('button') || [])];
  let currentIndex = 0;
  let visibleProjects = projectButtons;
  let lastFocusedElement = null;

  function showProject(index) {
    visibleProjects = projectButtons.filter(button => !button.closest('.project-card')?.hidden);
    if (!visibleProjects.length) return;
    currentIndex = (index + visibleProjects.length) % visibleProjects.length;
    const button = visibleProjects[currentIndex];
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector('img')?.alt || 'Project preview';
    caption.textContent = button.closest('.project-card')?.querySelector('h3')?.textContent || '';
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