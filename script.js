document.addEventListener("DOMContentLoaded", () => {
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

  if (revealEls.length > 0) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("reveal-visible"));
    }
  }
});

