/* ==========================================================
   MOTION LAYER — behaviour for the effects in motion.css
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PRELUDE → ready state ---------- */

  const boot = document.getElementById('boot');
  let started = false;

  const finishBoot = () => {
    if (started) return;
    started = true;
    if (boot) boot.classList.add('boot-done');
    document.documentElement.classList.remove('booting');
    document.body.classList.add('is-ready');
    window.setTimeout(() => { if (boot) boot.hidden = true; }, 900);
  };

  window.setTimeout(finishBoot, reduced ? 0 : 1150);
  window.addEventListener('load', () => window.setTimeout(finishBoot, 1150));

  /* ---------- PUNCH + CIPHER: split hero and scramble it ---------- */

  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const parts = heroName.innerHTML.split(/<br\s*\/?>/i);
    const fragment = document.createDocumentFragment();
    let index = 0;

    parts.forEach(part => {
      const text = part.replace(/<[^>]*>/g, '').trim();
      if (!text) return;
      const line = document.createElement('span');
      line.className = 'hero-line';
      line.setAttribute('aria-hidden', 'true');

      Array.from(text).forEach(character => {
        const mask = document.createElement('span');
        mask.className = 'hero-char-mask';
        const char = document.createElement('span');
        char.className = 'hero-char';
        const shown = character === ' ' ? '\u00A0' : character;
        char.textContent = shown;
        char.dataset.char = shown;
        char.style.setProperty('--i', index++);
        mask.appendChild(char);
        line.appendChild(mask);
      });

      fragment.appendChild(line);
    });

    heroName.setAttribute('aria-label', parts.map(p => p.replace(/<[^>]*>/g, '').trim()).join(' '));
    heroName.replaceChildren(fragment);
  }

  const scrambleHero = () => {
    const chars = Array.from(document.querySelectorAll('.hero-char'));
    const glyphs = '!<>-_\\/[]{}=+*^?#01ABCDEFGHJKLMNPRSTVXZ';

    chars.forEach((char, i) => {
      if (char.dataset.char === '\u00A0') return;
      const finalChar = char.dataset.char;
      const start = performance.now() + i * 42;
      const duration = 280;

      const tick = now => {
        if (now < start) {
          requestAnimationFrame(tick);
          return;
        }
        const progress = (now - start) / duration;
        if (progress >= 1) {
          char.textContent = finalChar;
          char.style.color = '';
          return;
        }
        char.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        char.style.color = 'var(--yellow)';
        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  if (!reduced) window.setTimeout(scrambleHero, 1500);

  /* ---------- ECHO: split section titles for the rollover ---------- */

  document.querySelectorAll('.section-title').forEach(title => {
    const text = title.textContent.trim();
    if (!text) return;

    title.setAttribute('aria-label', text);
    const wrap = document.createElement('span');
    wrap.setAttribute('aria-hidden', 'true');
    let i = 0;

    Array.from(text).forEach(character => {
      const outer = document.createElement('span');
      outer.className = 'roll-char';
      const inner = document.createElement('span');
      inner.className = 'roll-inner';
      inner.style.setProperty('--i', i++);

      for (let face = 0; face < 2; face++) {
        const b = document.createElement('b');
        b.textContent = character === ' ' ? '\u00A0' : character;
        inner.appendChild(b);
      }

      outer.appendChild(inner);
      wrap.appendChild(outer);
    });

    title.replaceChildren(wrap);
  });

  /* ---------- INDEX: stagger the mobile menu items ---------- */

  document.querySelectorAll('.nav-links li').forEach((item, i) => {
    item.style.setProperty('--i', i);
  });

  /* ---------- AIRWAVE: curved, scroll-reactive ticker ---------- */

  const tickerPath = document.getElementById('ticker-path');
  const tickerText = document.querySelector('.ticker-text');

  if (tickerPath && tickerText && !reduced) {
    const ns = 'http://www.w3.org/2000/svg';
    const words = ['DESIGN', 'CODE', 'DRAW', 'REPEAT', 'MAKE', 'PLAY'];
    const colors = ['#c1121f', '#e85d04', '#ffba08', '#f0f0f0'];

    for (let repeat = 0; repeat < 8; repeat++) {
      words.forEach((word, i) => {
        const span = document.createElementNS(ns, 'tspan');
        span.textContent = `${word} \u2726 `;
        span.setAttribute('fill', colors[(repeat + i) % colors.length]);
        span.setAttribute('fill-opacity', '0.5');
        tickerPath.appendChild(span);
      });
    }

    let textLength = 0;
    const measure = () => {
      const measured = tickerText.getComputedTextLength();
      if (measured > 0) textLength = measured;
    };
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

    let offset = 0;
    let lastY = window.scrollY;
    let boost = 0;

    const frame = () => {
      const y = window.scrollY;
      boost = Math.min(boost + Math.abs(y - lastY) * 0.35, 28);
      lastY = y;
      boost *= 0.94;

      offset -= 0.55 + boost;
      if (textLength > 0 && offset <= -textLength / 2) offset += textLength / 2;
      tickerPath.setAttribute('startOffset', String(offset));
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  /* ---------- STILLFRAME / FORMA: gallery lightbox ---------- */

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const figure = lightbox?.querySelector('.lightbox-figure');
  const items = Array.from(document.querySelectorAll('.art-item'));
  let current = 0;
  let lastFocused = null;

  const showImage = index => {
    if (!items.length) return;
    current = (index + items.length) % items.length;
    const image = items[current].querySelector('img');
    const label = items[current].querySelector('.art-label');

    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    lightboxCaption.textContent = label ? label.textContent.trim() : image.alt;

    figure.classList.remove('swap');
    void figure.offsetWidth;
    figure.classList.add('swap');
  };

  const openLightbox = index => {
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.getElementById('lightbox-close').focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    window.setTimeout(() => {
      lightbox.hidden = true;
      figure.classList.remove('swap');
    }, reduced ? 0 : 500);
    if (lastFocused) lastFocused.focus();
  };

  items.forEach((item, index) => {
    const image = item.querySelector('img');
    item.style.setProperty('--d', `${(index % 4) * 0.07}s`);
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Open drawing ${index + 1} of ${items.length}${image?.alt ? ': ' + image.alt : ''}`);

    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => showImage(current - 1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => showImage(current + 1));
  lightbox?.addEventListener('click', event => {
    if (event.target.closest('[data-close]')) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox || lightbox.hidden) return;

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showImage(current - 1);
    } else if (event.key === 'ArrowRight') {
      showImage(current + 1);
    } else if (event.key === 'Tab') {
      const buttons = Array.from(lightbox.querySelectorAll('button'));
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- MONO + INK: record collection and player ---------- */

  const player = document.getElementById('player');
  const playerFrame = document.getElementById('player-frame');
  const playerTitle = document.getElementById('player-title');
  const playerNumber = document.getElementById('player-number');
  const records = Array.from(document.querySelectorAll('.record'));
  let activeRecord = 0;
  let playerOpen = false;

  const loadRecord = index => {
    activeRecord = (index + records.length) % records.length;
    const record = records[activeRecord];
    playerNumber.textContent = record.dataset.number;
    playerTitle.textContent = record.dataset.title;
    playerFrame.src = `https://www.youtube-nocookie.com/embed/${record.dataset.video}?autoplay=1&rel=0`;
  };

  const openPlayer = index => {
    loadRecord(index);
    playerOpen = true;
    player.hidden = false;
    player.classList.remove('uninking');
    player.classList.add('inking');
    requestAnimationFrame(() => player.classList.add('open'));
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => document.getElementById('player-close').focus(), reduced ? 0 : 700);
  };

  const closePlayer = () => {
    playerOpen = false;
    player.classList.remove('open', 'inking');
    player.classList.add('uninking');
    document.body.style.overflow = '';
    playerFrame.src = '';
    window.setTimeout(() => {
      player.hidden = true;
      player.classList.remove('uninking');
    }, reduced ? 0 : 650);
    records[activeRecord]?.focus();
  };

  records.forEach((record, index) => {
    record.addEventListener('click', () => openPlayer(index));
    record.addEventListener('keydown', event => {
      if (event.key === ' ') {
        event.preventDefault();
        record.classList.toggle('flipped');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        records[(index + 1) % records.length].focus();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        records[(index - 1 + records.length) % records.length].focus();
      }
    });
  });

  document.getElementById('player-close')?.addEventListener('click', closePlayer);
  document.getElementById('player-prev')?.addEventListener('click', () => loadRecord(activeRecord - 1));
  document.getElementById('player-next')?.addEventListener('click', () => loadRecord(activeRecord + 1));
  player?.addEventListener('click', event => {
    if (event.target.closest('[data-close]')) closePlayer();
  });

  document.addEventListener('keydown', event => {
    if (!playerOpen) return;

    if (event.key === 'Escape') {
      closePlayer();
    } else if (event.key === 'ArrowLeft') {
      loadRecord(activeRecord - 1);
    } else if (event.key === 'ArrowRight') {
      loadRecord(activeRecord + 1);
    } else if (event.key === 'Tab') {
      const buttons = Array.from(player.querySelectorAll('button'));
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});
