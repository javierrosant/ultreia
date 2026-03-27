/* ============================================================
   ULTREIA - Main JS
   ============================================================ */

(function () {
  'use strict';

  const CLOSE_DELAY = 120;

  const overlay = document.getElementById('menu-overlay');
  const nav = document.querySelector('.nav');
  const navList = document.querySelector('.nav__links');
  const navLinks = Array.from(document.querySelectorAll('.nav__link[data-menu]'));
  const panels = Array.from(document.querySelectorAll('.menu-panel'));
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieButton = document.getElementById('cookie-accept');
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const level1 = document.getElementById('mobile-level-1');
  const mobileNavItems = Array.from(document.querySelectorAll('.mobile-nav-item[data-target]'));
  const mobileBackButtons = Array.from(document.querySelectorAll('.mobile-back'));

  let activeMenuId = null;
  let closeTimer = null;
  let currentSubLevel = null;

  function getMenuPanel(menuId) {
    return document.getElementById(`menu-${menuId}`);
  }

  function setNavLinkState(menuId, active) {
    navLinks.forEach(link => {
      const isTarget = link.dataset.menu === menuId;
      if (!isTarget) return;
      link.classList.toggle('is-active', active);
      link.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
  }

  function clearNavLinkState() {
    navLinks.forEach(link => {
      link.classList.remove('is-active');
      link.setAttribute('aria-expanded', 'false');
    });
  }

  function hideAllPanels() {
    panels.forEach(panel => panel.classList.remove('is-visible'));
  }

  function resetPanelState(panel) {
    if (!panel) return;

    panel.querySelectorAll('.menu-list__item.is-active').forEach(item => {
      item.classList.remove('is-active');
    });

    panel.querySelectorAll('.menu-image img.is-visible').forEach(image => {
      image.classList.remove('is-visible');
    });

    panel.querySelectorAll('.menu-preview').forEach(preview => {
      setPreviewMode(preview, null);
    });
  }

  function getOverlayMaxHeight() {
    const maxHeightVh = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--menu-max-height-vh')
    );

    if (Number.isNaN(maxHeightVh)) {
      return Math.round(window.innerHeight * 0.78);
    }

    return Math.round(window.innerHeight * (maxHeightVh / 100));
  }

  function measurePanelHeight(panel) {
    panel.style.visibility = 'hidden';
    panel.style.display = 'grid';
    panel.classList.add('is-visible');

    const measuredHeight = panel.scrollHeight;

    panel.classList.remove('is-visible');
    panel.style.visibility = '';
    panel.style.display = '';

    return Math.min(measuredHeight, getOverlayMaxHeight());
  }

  function syncOverlayHeight(menuId) {
    if (!overlay || !menuId) return;

    const panel = getMenuPanel(menuId);
    if (!panel) return;

    overlay.style.height = `${measurePanelHeight(panel)}px`;
  }

  function openMenu(menuId) {
    if (!overlay || !nav) return;

    window.clearTimeout(closeTimer);

    const panel = getMenuPanel(menuId);
    if (!panel) return;

    if (activeMenuId && activeMenuId !== menuId) {
      const previousPanel = getMenuPanel(activeMenuId);
      if (previousPanel) {
        previousPanel.classList.remove('is-visible');
        resetPanelState(previousPanel);
      }
      setNavLinkState(activeMenuId, false);
    }

    activeMenuId = menuId;
    setNavLinkState(menuId, true);
    resetPanelState(panel);
    syncOverlayHeight(menuId);

    overlay.classList.add('is-open');
    overlay.removeAttribute('aria-hidden');
    nav.classList.add('is-menu-open');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.add('is-visible');
      });
    });
  }

  function closeMenu() {
    if (!overlay || !nav || !activeMenuId) return;

    panels.forEach(panel => resetPanelState(panel));
    hideAllPanels();
    clearNavLinkState();

    overlay.style.height = '0';
    overlay.setAttribute('aria-hidden', 'true');
    nav.classList.remove('is-menu-open');
    activeMenuId = null;
  }

  function scheduleClose() {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(closeMenu, CLOSE_DELAY);
  }

  function cancelClose() {
    window.clearTimeout(closeTimer);
  }

  function bindDesktopMenu() {
    if (!overlay || !nav || !navList || navLinks.length === 0) return;

    navLinks.forEach(link => {
      const menuId = link.dataset.menu;
      link.addEventListener('mouseenter', () => openMenu(menuId));
      link.addEventListener('focus', () => openMenu(menuId));
    });

    overlay.addEventListener('mouseenter', cancelClose);
    overlay.addEventListener('mouseleave', scheduleClose);

    navList.addEventListener('mouseenter', cancelClose);
    navList.addEventListener('mouseleave', scheduleClose);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', event => {
      if (!activeMenuId) return;

      const clickedInsideOverlay = overlay.contains(event.target);
      const clickedInsideNav = event.target.closest('.nav__links');

      if (!clickedInsideOverlay && !clickedInsideNav) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (activeMenuId) syncOverlayHeight(activeMenuId);
    });
  }

  function swapImagePreview(imgElement, src) {
    if (!imgElement || !src) return;

    const currentSrc = imgElement.getAttribute('src');

    if (currentSrc === src) {
      imgElement.classList.add('is-visible');
      return;
    }

    const revealImage = () => {
      imgElement.setAttribute('src', src);
      imgElement.classList.add('is-visible');
    };

    if (!currentSrc || !imgElement.classList.contains('is-visible')) {
      revealImage();
      return;
    }

    imgElement.classList.remove('is-visible');
    imgElement.addEventListener('transitionend', revealImage, { once: true });
  }

  function setPreviewMode(container, mode) {
    if (!container) return;

    container.classList.toggle('is-image-visible', mode === 'image');
    container.classList.toggle('is-detail-visible', mode === 'detail');
  }

  function updateDetailPreview(container, item) {
    if (!container || !item) return;

    const text = item.dataset.detailText;
    if (!text) return;

    const textElement = container.querySelector('.menu-detail__text');
    if (textElement) {
      textElement.innerHTML = '';
      text.split('||').map(block => block.trim()).filter(Boolean).forEach(block => {
        const paragraph = document.createElement('p');
        paragraph.textContent = block;
        textElement.appendChild(paragraph);
      });
    }

    setPreviewMode(container, 'detail');
  }

  function bindPreviewList(listSelector, itemSelector, targetAttribute) {
    document.querySelectorAll(listSelector).forEach(list => {
      const targetId = list.dataset[targetAttribute];
      if (!targetId) return;

      const container = document.getElementById(targetId);
      const items = Array.from(list.querySelectorAll(itemSelector));
      const previewMode = list.dataset.previewMode || 'image';
      const imgElement = container ? container.querySelector('img') : null;

      if (!container) return;
      if (previewMode === 'image' && !imgElement) return;

      items.forEach(item => {
        const activate = () => {
          if (previewMode === 'detail') {
            updateDetailPreview(container, item);
          } else {
            const src = item.dataset.img;
            if (!src) return;
            swapImagePreview(imgElement, src);
            setPreviewMode(container, 'image');
          }

          items.forEach(entry => entry.classList.remove('is-active'));
          item.classList.add('is-active');
        };

        item.addEventListener('mouseenter', activate);
        item.addEventListener('click', activate);
      });
    });
  }

  function initCookieBanner() {
    if (!cookieBanner) return;

    cookieBanner.classList.remove('is-hidden');

    if (cookieButton) {
      cookieButton.addEventListener('click', event => {
        event.preventDefault();
      });
    }
  }

  function openMobileMenu() {
    if (!burger || !mobileMenu || !level1) return;

    mobileMenu.removeAttribute('aria-hidden');
    mobileMenu.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    level1.removeAttribute('hidden');
    level1.classList.add('is-active');
  }

  function closeMobileMenu() {
    if (!burger || !mobileMenu || !level1) return;

    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    window.setTimeout(() => {
      if (currentSubLevel) {
        currentSubLevel.setAttribute('hidden', '');
        currentSubLevel.classList.remove('is-active');
        currentSubLevel = null;
      }

      level1.classList.remove('is-exiting');
    }, 400);
  }

  function openSubLevel(targetId) {
    if (!level1) return;

    const subLevel = document.getElementById(targetId);
    if (!subLevel) return;

    currentSubLevel = subLevel;

    level1.classList.add('is-exiting');

    subLevel.removeAttribute('hidden');
    subLevel.classList.add('is-entering');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        subLevel.classList.remove('is-entering');
        subLevel.classList.add('is-active');
      });
    });

    window.setTimeout(() => {
      level1.setAttribute('hidden', '');
      level1.classList.remove('is-exiting');
    }, 350);
  }

  function closeSubLevel() {
    if (!level1 || !currentSubLevel) return;

    const subLevel = currentSubLevel;

    subLevel.classList.remove('is-active');
    subLevel.classList.add('is-entering');

    level1.removeAttribute('hidden');
    level1.classList.remove('is-exiting');

    window.setTimeout(() => {
      subLevel.setAttribute('hidden', '');
      subLevel.classList.remove('is-entering');
      currentSubLevel = null;
    }, 350);
  }

  function bindMobileMenu() {
    if (!burger || !mobileMenu || !level1) return;

    burger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        return;
      }

      openMobileMenu();
    });

    mobileNavItems.forEach(item => {
      item.addEventListener('click', () => openSubLevel(item.dataset.target));
    });

    mobileBackButtons.forEach(button => {
      button.addEventListener('click', closeSubLevel);
    });
  }

  bindDesktopMenu();
  bindPreviewList('.menu-list[data-image-target]', '.menu-list__item[data-img]', 'imageTarget');
  bindPreviewList('.menu-list[data-preview-target]', '.menu-list__item', 'previewTarget');
  initCookieBanner();
  bindMobileMenu();
  bindPreviewList('.mobile-item-list[data-image]', '.mobile-item[data-img]', 'image');
})();
