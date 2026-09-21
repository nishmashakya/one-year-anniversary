document.addEventListener('DOMContentLoaded', () => {
  // page transition overlay
  let overlay = document.querySelector('.page-transition');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);
  }
  // fade the overlay out to reveal the page
  requestAnimationFrame(() => overlay.classList.add('hidden'));

  // also ensure overlay is hidden when the page is shown from bfcache (back/forward)
  window.addEventListener('pageshow', () => {
    requestAnimationFrame(() => overlay.classList.add('hidden'));
  });

  // intercept link clicks to fade out before navigation
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    // ignore external, anchors, mailto, or targets
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || a.target === '_blank') return;
    e.preventDefault();
    overlay.classList.remove('hidden');
    setTimeout(() => { window.location.href = href; }, 500);
  });

  const folder = document.querySelector('.folder');
  const heart = document.querySelector('.heart-svg');
  const instr = document.querySelector('.instructions');

  // Typewriter: read full text, clear, then type
  if (instr) {
    const fullText = instr.textContent.trim();
    instr.textContent = '';
    instr.classList.add('typing');
    let i = 0;
    const speed = 40; // ms per char
    function type() {
      if (i <= fullText.length) {
        instr.textContent = fullText.slice(0, i);
        i++;
        setTimeout(type, speed);
      } else {
        // finished typing: keep caret blinking
        instr.classList.remove('typing');
        instr.classList.add('typed');
      }
    }
    // start typing after 2 seconds (2000ms)
    setTimeout(type, 1000);
  }

  // Click to open: pulse heart then navigate to opened.html
  if (folder) {
    folder.addEventListener('click', () => {
      // fade out then navigate to opened page
      const overlayEl = document.querySelector('.page-transition');
      if (overlayEl) overlayEl.classList.remove('hidden');
      setTimeout(() => { window.location.href = 'opened.html'; }, 500);
    });
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxMedia = document.querySelector('.lightbox-media');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxMedia.replaceChildren();
  }

  if (lightbox && lightboxMedia && lightboxCaption && lightboxClose) {
    document.querySelectorAll('.gallery-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const media = trigger.querySelector('img, video');
        const caption = trigger.closest('.gallery-item')?.querySelector('figcaption');
        if (!media) return;

        const enlargedMedia = media.cloneNode(true);
        if (enlargedMedia.tagName === 'VIDEO') {
          enlargedMedia.controls = true;
          enlargedMedia.autoplay = true;
        }

        lightboxMedia.replaceChildren(enlargedMedia);
        lightboxCaption.textContent = caption?.textContent || '';
        lightbox.hidden = false;
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });
  }

  const music = document.querySelector('#page-music');
  const musicButton = document.querySelector('.music-control');

  if (music && musicButton) {
    const updateMusicButton = () => {
      musicButton.textContent = music.paused ? 'Play music' : 'Pause music';
    };

    musicButton.addEventListener('click', () => {
      if (music.paused) {
        music.play().then(updateMusicButton).catch(updateMusicButton);
      } else {
        music.pause();
        updateMusicButton();
      }
    });

    music.play().then(updateMusicButton).catch(updateMusicButton);
  }
});
