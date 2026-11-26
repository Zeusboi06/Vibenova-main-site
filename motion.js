/* Motion System, Scroll Reveal, Header Progress, FAQ Accordion, & Giant Footer Wordmark */
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  // 1. Hero Word-by-Word Reveal
  const headline = document.querySelector(".hero-headline");
  if (headline && !prefersReduced) {
    const nodes = Array.from(headline.childNodes);
    const wrapped = [];
    let wordIndex = 0;

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            wrapped.push(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "hero-word";
            span.style.transitionDelay = `${wordIndex * 65}ms`;
            span.textContent = part;
            wrapped.push(span);
            wordIndex += 1;
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(true);
        clone.classList.add("hero-word");
        clone.style.transitionDelay = `${wordIndex * 65 + 120}ms`;
        wrapped.push(clone);
        wordIndex += 1;
      }
    });

    headline.replaceChildren(...wrapped);
    requestAnimationFrame(() => {
      headline.querySelectorAll(".hero-word").forEach((w) => w.classList.add("is-visible"));
    });
  }

  // 2. Scroll Reveal with Stagger
  const revealEls = document.querySelectorAll(".reveal");
  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const parentStagger = el.closest(".reveal-stagger");
          if (parentStagger) {
            const siblings = Array.from(parentStagger.querySelectorAll(":scope > .reveal"));
            const idx = siblings.indexOf(el);
            if (idx > 0) el.style.transitionDelay = `${idx * 70}ms`;
          }
          el.classList.add("in-view");
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // 3. Header Scroll State, Progress Line, Scroll Cue & Floating WhatsApp
  const header = document.querySelector(".site-header");
  const scrollCue = document.querySelector(".scroll-cue");
  const floatingWa = document.getElementById("floating-whatsapp");
  const heroSection = document.getElementById("hero");
  const processSection = document.getElementById("process");
  let currentSectionName = "Top";

  function onScroll() {
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;

    if (header) {
      header.classList.toggle("is-scrolled", y > 40);
      header.style.setProperty("--scroll-progress", progress.toFixed(4));
    }

    if (scrollCue && y > 30) {
      scrollCue.classList.add("is-hidden");
    }

    if (floatingWa && heroSection) {
      const pastHero = y > heroSection.offsetHeight * 0.65;
      floatingWa.classList.toggle("is-visible", pastHero);
    }

    if (processSection && !prefersReduced) {
      const rect = processSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const pct = Math.min(1, Math.max(0.15, (vh - rect.top) / (vh * 0.75)));
      processSection.style.setProperty("--process-progress", pct.toFixed(3));
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 4. Active Nav Section Highlighting & Floating WA Context
  const navLinks = Array.from(document.querySelectorAll(".nav-link[data-section]"));
  const trackedSections = Array.from(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window && trackedSections.length) {
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          currentSectionName = id;
          navLinks.forEach((link) => {
            const match = link.dataset.section === id;
            if (match) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
          if (floatingWa) {
            const msg = encodeURIComponent(
              `Hi VibeNova, I was looking at the ${id} section on your website and would like to chat.`
            );
            floatingWa.href = `https://wa.me/916363609485?text=${msg}`;
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    trackedSections.forEach((sec) => navObs.observe(sec));
  }

  // 5. Card Cursor Glow & Orbit Parallax (Desktop pointer:fine only)
  if (finePointer && !prefersReduced) {
    document.querySelectorAll(".card-glow").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    });

    const orbitSvg = document.querySelector(".orbit-svg");
    if (heroSection && orbitSvg) {
      heroSection.addEventListener("pointermove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
        orbitSvg.style.transform = `translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`;
      });
      heroSection.addEventListener("pointerleave", () => {
        orbitSvg.style.transform = "translate3d(0, 0, 0)";
      });
    }
  }

  // Pause infinite orbit animation when tab is hidden
  const orbitSvgEl = document.querySelector(".orbit-svg");
  if (orbitSvgEl) {
    document.addEventListener("visibilitychange", () => {
      orbitSvgEl.classList.toggle("is-paused", document.hidden);
    });
  }

  // 6. Pricing "Get Started" Plan Prefill + Audit Pulse
  document.querySelectorAll(".plan-cta").forEach((btn) => {
    btn.addEventListener("click", () => {
      const plan = btn.dataset.plan || "";
      const goal = btn.dataset.goal || "";
      window.vibeNovaTrack("plan_cta_click", { plan });
      window.dispatchEvent(
        new CustomEvent("vibenova:prefill-audit", { detail: { plan, goal } })
      );
      const auditCard = document.getElementById("audit-card");
      if (auditCard && !prefersReduced) {
        auditCard.classList.add("is-pulsing");
        setTimeout(() => auditCard.classList.remove("is-pulsing"), 900);
      }
    });
  });

  // 7. FAQ Accordion (One open at a time)
  const faqTriggers = Array.from(document.querySelectorAll(".faq-trigger"));
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      faqTriggers.forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        const panel = document.getElementById(other.getAttribute("aria-controls"));
        panel?.classList.remove("is-open");
      });

      if (!isExpanded) {
        trigger.setAttribute("aria-expanded", "true");
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        panel?.classList.add("is-open");
        window.vibeNovaTrack("faq_open", { question: trigger.textContent.trim() });
      }
    });
  });

  // 8. Giant Full-Width Footer Wordmark (Exact getBBox Fit + Staggered Rise)
  const footerSvg = document.getElementById("footer-wordmark-svg");
  const footerText = document.getElementById("footer-wordmark-text");
  const footerWrap = document.querySelector(".footer-giant-wrap");

  function fitFooterWordmark() {
    if (!footerSvg || !footerText) return;
    try {
      const bbox = footerText.getBBox();
      if (bbox.width > 0 && bbox.height > 0) {
        footerSvg.setAttribute(
          "viewBox",
          `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height * 0.94}`
        );
      }
    } catch {
      // Fallback viewBox already present in HTML
    }
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitFooterWordmark);
  } else {
    fitFooterWordmark();
  }
  window.addEventListener("resize", fitFooterWordmark);

  if (footerWrap) {
    const letters = footerWrap.querySelectorAll(".fw-letter");
    letters.forEach((letter, idx) => {
      letter.style.transitionDelay = `${idx * 45}ms`;
    });

    if (!prefersReduced && "IntersectionObserver" in window) {
      const fwObs = new IntersectionObserver(
        (entries, obs) => {
          if (entries[0].isIntersecting) {
            footerWrap.classList.add("in-view");
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      fwObs.observe(footerWrap);
    } else {
      footerWrap.classList.add("in-view");
    }
  }

  // Track footer & nav CTA clicks
  document.querySelectorAll("[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      window.vibeNovaTrack(el.getAttribute("data-track"), { section: currentSectionName });
    });
  });
});
