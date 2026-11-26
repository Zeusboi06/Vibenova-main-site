/* Core Navigation, Pricing Tabs, Privacy Modal, Analytics & A/B Positioning */
window.vibeNovaTrack = function (eventName, params = {}) {
  const payload = { event: eventName, ...params, timestamp: Date.now() };
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }
  window.dispatchEvent(new CustomEvent("vibenova:analytics", { detail: payload }));
};

document.addEventListener("DOMContentLoaded", () => {
  // 0. A/B-ready positioning (?focus=auto switches to niche-first copy)
  const params = new URLSearchParams(window.location.search);
  const abMode = params.get("focus") === "auto" ? "niche" : "generic";
  document.querySelectorAll("[data-ab-generic][data-ab-niche]").forEach((el) => {
    const content = el.getAttribute(abMode === "niche" ? "data-ab-niche" : "data-ab-generic");
    if (content) el.innerHTML = content;
  });

  // 1. Mobile Navigation Toggle with Scroll Lock & Escape
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  function closeMobileNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-locked");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-locked", isOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && primaryNav.classList.contains("open")) {
        closeMobileNav();
        navToggle.focus();
      }
    });
  }

  // 2. Pricing Tabs with Sliding Indicator & Full Keyboard Support
  const tabList = document.querySelector(".pricing-tabs");
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));
  const tabIndicator = document.querySelector(".tab-indicator");

  function updateTabIndicator(activeBtn) {
    if (!tabIndicator || !activeBtn) return;
    tabIndicator.style.width = `${activeBtn.offsetWidth}px`;
    tabIndicator.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
  }

  function activateTab(tabName, shouldFocus = false) {
    let activeBtn = null;
    tabButtons.forEach((btn) => {
      const isMatch = btn.dataset.tab === tabName;
      btn.classList.toggle("active", isMatch);
      btn.setAttribute("aria-selected", String(isMatch));
      btn.setAttribute("tabindex", isMatch ? "0" : "-1");
      if (isMatch) activeBtn = btn;
    });

    tabPanels.forEach((panel) => {
      const isMatch = panel.id === `panel-${tabName}`;
      panel.classList.toggle("active", isMatch);
      panel.hidden = !isMatch;
    });

    if (activeBtn) {
      updateTabIndicator(activeBtn);
      if (shouldFocus) activeBtn.focus();
      window.vibeNovaTrack("pricing_tab_view", { tab: tabName });
    }
  }

  window.vibeNovaActivateTab = activateTab;

  if (tabButtons.length) {
    const initialActive = tabButtons.find((b) => b.classList.contains("active")) || tabButtons[0];
    requestAnimationFrame(() => updateTabIndicator(initialActive));
    window.addEventListener("resize", () => {
      const current = tabButtons.find((b) => b.classList.contains("active"));
      if (current) updateTabIndicator(current);
    });
  }

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.tab));

    btn.addEventListener("keydown", (e) => {
      let nextIdx = null;
      if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabButtons.length;
      else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabButtons.length) % tabButtons.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = tabButtons.length - 1;

      if (nextIdx !== null) {
        e.preventDefault();
        activateTab(tabButtons[nextIdx].dataset.tab, true);
      }
    });
  });

  document.querySelectorAll("[data-pricing-target]").forEach((link) => {
    link.addEventListener("click", () => {
      const targetTab = link.getAttribute("data-pricing-target");
      if (targetTab) activateTab(targetTab);
    });
  });

  // 3. Privacy Policy Modal with Focus Return
  const privacyTrigger = document.getElementById("privacy-trigger");
  const privacyModal = document.getElementById("privacy-modal");
  const modalClose = privacyModal?.querySelector(".modal-close");
  let lastFocusedTrigger = null;

  function setFloatingWaHidden(hidden) {
    const wa = document.getElementById("floating-whatsapp");
    if (wa) wa.style.visibility = hidden ? "hidden" : "";
  }

  if (privacyTrigger && privacyModal) {
    privacyTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      lastFocusedTrigger = privacyTrigger;
      setFloatingWaHidden(true);
      privacyModal.showModal();
    });

    modalClose?.addEventListener("click", () => {
      privacyModal.close();
    });

    privacyModal.addEventListener("click", (e) => {
      if (e.target === privacyModal) privacyModal.close();
    });

    privacyModal.addEventListener("close", () => {
      setFloatingWaHidden(false);
      lastFocusedTrigger?.focus();
    });
  }

  // 4. Dynamic Copyright Year
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
