/* ============================================================
   ULTREIA - Shared Layout Loader
   ============================================================ */

(function () {
  'use strict';

  async function injectIncludes() {
    const containers = Array.from(document.querySelectorAll('[data-include]'));
    if (containers.length === 0) {
      document.dispatchEvent(new CustomEvent('ultreia:layoutready'));
      return;
    }

    await Promise.all(containers.map(async container => {
      const src = container.dataset.include;
      if (!src) return;

      const response = await fetch(src, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Unable to load include: ${src}`);
      }

      container.innerHTML = await response.text();
    }));

    document.dispatchEvent(new CustomEvent('ultreia:layoutready'));
  }

  injectIncludes().catch(error => {
    console.error(error);
    document.dispatchEvent(new CustomEvent('ultreia:layoutready'));
  });
})();
