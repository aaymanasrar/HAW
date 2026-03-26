document.addEventListener("DOMContentLoaded", () => {
  // ── Init Lucide icons ─────────────────────────────────────────────────
  if (window.lucide) lucide.createIcons();

  // ── Fade-in hero box images once loaded ───────────────────────────────
  document.querySelectorAll(".hero-box-img").forEach((img) => {
    const reveal = () => img.classList.add("loaded");
    if (img.complete) reveal();
    else img.addEventListener("load", reveal);
  });


  const yearSpan = document.getElementById("year");
  const form = document.querySelector(".quote-form");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const revealEls = document.querySelectorAll(".reveal");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    // Mobile nav: close menu then manually scroll to section
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          navLinks.classList.remove("open");
          const target = document.getElementById(href.slice(1));
          if (target) {
            setTimeout(() => {
              const headerH = document.querySelector(".site-header")?.offsetHeight || 68;
              const top = target.getBoundingClientRect().top + window.scrollY - headerH;
              window.scrollTo({ top, behavior: "smooth" });
            }, 150); // wait for menu to close first
          }
        }
      });
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const required = ["company", "type", "contact"];
      let hasError = false;

      required.forEach((id) => {
        const field = form.querySelector(`#${id}`);
        if (!field) return;
        if (!field.value.trim()) {
          field.classList.add("field-error");
          hasError = true;
        } else {
          field.classList.remove("field-error");
        }
      });

      if (!hasError) {
        const message = form.querySelector(".form-success");
        if (message) message.hidden = false;
        form.reset();
      }
    });
  }

  // ── Enhanced scroll reveal with sibling stagger ─────────────────────────
  if (revealEls.length > 0) {
    if ("IntersectionObserver" in window) {
      // Track which parents have already started staggering
      const staggeredParents = new WeakSet();

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;

            // Compute stagger delay: find siblings with .reveal in same parent
            const parent = el.parentElement;
            if (parent && !staggeredParents.has(parent)) {
              staggeredParents.add(parent);
              const siblings = [...parent.querySelectorAll(":scope > .reveal")];
              siblings.forEach((sib, i) => {
                sib.style.setProperty("--reveal-delay", `${i * 0.10}s`);
              });
            }

            el.classList.add("reveal-visible");
            observer.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("reveal-visible"));
    }
  }
});

// ── Modal close animations (runs after DOMContentLoaded, patching inline JS)
document.addEventListener("DOMContentLoaded", () => {
  // Patch products-modal close to animate out
  const modal = document.getElementById("products-modal");
  if (modal) {
    const origClose = window.__closeProductsModal;
    // Override the close button + backdrop click to use animated close
    function animatedCloseModal() {
      modal.classList.add("closing");
      setTimeout(() => {
        modal.classList.remove("open", "closing");
        document.body.style.overflow = "";
      }, 230);
    }

    const closeBtn = document.getElementById("products-modal-close");
    if (closeBtn) {
      // Replace existing listener by cloning
      const fresh = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(fresh, closeBtn);
      fresh.addEventListener("click", animatedCloseModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) animatedCloseModal();
    }, { capture: false });
  }

  // Patch product sub-popup close to animate out
  const pPopup = document.getElementById("product-popup");
  if (pPopup) {
    function animatedClosePopup() {
      pPopup.classList.remove("popup-open");
      pPopup.classList.add("popup-close");
      setTimeout(() => {
        pPopup.style.display = "none";
        pPopup.classList.remove("popup-close");
      }, 200);
    }

    const pClose = document.getElementById("product-popup-close");
    if (pClose) {
      const fresh = pClose.cloneNode(true);
      pClose.parentNode.replaceChild(fresh, pClose);
      fresh.addEventListener("click", animatedClosePopup);
    }

    pPopup.addEventListener("click", (e) => {
      if (e.target === pPopup) animatedClosePopup();
    });

    // Add open animation whenever popup becomes visible (MutationObserver)
    new MutationObserver(() => {
      if (pPopup.style.display === "flex") {
        pPopup.classList.remove("popup-close");
        // Force reflow so animation restarts
        void pPopup.offsetHeight;
        pPopup.classList.add("popup-open");
      }
    }).observe(pPopup, { attributes: true, attributeFilter: ["style"] });
  }
});

