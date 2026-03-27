/* ============================================================
   ULTREIA — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ── Constants ─────────────────────────────────────────── */

  const OVERLAY_PADDING_V = 48 + 48; // top + bottom padding inside panel
  const CLOSE_DELAY = 120;           // ms before closing overlay on mouseleave

  /* ── State ─────────────────────────────────────────────── */

  let activeMenu = null;
  let closeTimer = null;

  /* ── Elements ───────────────────────────────────────────── */

  const overlay    = document.getElementById('menu-overlay');
  const navLinks   = document.querySelectorAll('.nav__link[data-menu]');
  const panels     = document.querySelectorAll('.menu-panel');
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieBtn  = document.getElementById('cookie-accept');

  /* ── Menu logic ─────────────────────────────────────────── */

  function openMenu(menuId) {
    clearTimeout(closeTimer);

    const panel = document.getElementById('menu-' + menuId);
    if (!panel) return;

    // Close previous panel without animation (immediate swap)
    if (activeMenu && activeMenu !== menuId) {
      const prev = document.getElementById('menu-' + activeMenu);
      if (prev) prev.classList.remove('is-visible');
      setNavActive(activeMenu, false);
    }

    activeMenu = menuId;
    setNavActive(menuId, true);

    // Show overlay with correct height
    const panelHeight = getPanelHeight(panel);
    overlay.style.height = panelHeight + 'px';
    overlay.classList.add('is-open');
    overlay.removeAttribute('aria-hidden');

    // Show panel (small delay lets height transition start first)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.add('is-visible');
      });
    });
  }

  function closeMenu() {
    if (!activeMenu) return;

    panels.forEach(p => p.classList.remove('is-visible'));
    navLinks.forEach(l => {
      l.classList.remove('is-active');
      l.setAttribute('aria-expanded', 'false');
    });

    overlay.style.height = '0';
    overlay.setAttribute('aria-hidden', 'true');
    activeMenu = null;
  }

  function scheduleClose() {
    closeTimer = setTimeout(closeMenu, CLOSE_DELAY);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  function getPanelHeight(panel) {
    // Temporarily show panel off-screen to measure
    panel.style.visibility = 'hidden';
    panel.style.display = 'grid';
    panel.classList.add('is-visible');
    const h = panel.scrollHeight + OVERLAY_PADDING_V;
    panel.classList.remove('is-visible');
    panel.style.visibility = '';
    panel.style.display = '';
    return Math.min(h, Math.round(window.innerHeight * 0.78));
  }

  function setNavActive(menuId, active) {
    navLinks.forEach(link => {
      if (link.dataset.menu === menuId) {
        link.classList.toggle('is-active', active);
        link.setAttribute('aria-expanded', active ? 'true' : 'false');
      }
    });
  }

  /* ── Nav events ─────────────────────────────────────────── */

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => openMenu(link.dataset.menu));
    link.addEventListener('focus', () => openMenu(link.dataset.menu));
  });

  overlay.addEventListener('mouseenter', cancelClose);
  overlay.addEventListener('mouseleave', scheduleClose);

  // Close on nav bar mouseleave (when moving away from all links)
  document.querySelector('.nav__links').addEventListener('mouseleave', scheduleClose);
  document.querySelector('.nav__links').addEventListener('mouseenter', cancelClose);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeMenu) closeMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (activeMenu && !overlay.contains(e.target) && !e.target.closest('.nav__links')) {
      closeMenu();
    }
  });

  /* ── Image hover ─────────────────────────────────────────── */

  panels.forEach(panel => {
    const lists = panel.querySelectorAll('.menu-list[data-image-target]');

    lists.forEach(list => {
      const targetId  = list.dataset.imageTarget;
      const container = document.getElementById(targetId);
      if (!container) return;

      const imgEl = container.querySelector('img');
      if (!imgEl) return;

      const items = list.querySelectorAll('.menu-list__item[data-img]');

      items.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const src = item.dataset.img;
          if (!src) return;

          // Swap image
          if (imgEl.src !== src) {
            imgEl.classList.remove('is-visible');
            imgEl.addEventListener('transitionend', () => {
              imgEl.src = src;
              imgEl.classList.add('is-visible');
            }, { once: true });
          }

          items.forEach(i => i.classList.remove('is-active'));
          item.classList.add('is-active');
        });
      });
    });
  });

  /* ── Cookie banner ───────────────────────────────────────── */

  function initCookieBanner() {
    if (localStorage.getItem('ultreia_cookies_accepted')) {
      cookieBanner.classList.add('is-hidden');
      return;
    }
    cookieBanner.classList.remove('is-hidden');
  }

  if (cookieBtn) {
    cookieBtn.addEventListener('click', () => {
      localStorage.setItem('ultreia_cookies_accepted', '1');
      cookieBanner.classList.add('is-hidden');
    });
  }

  initCookieBanner();

})();
