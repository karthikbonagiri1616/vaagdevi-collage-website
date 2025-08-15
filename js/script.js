// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", (!expanded).toString());
      mainNav.classList.toggle("active");
    });

    // Close menu after clicking a link (on mobile)
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 760 && mainNav.classList.contains("active")) {
          mainNav.classList.remove("active");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Active link highlight on scroll
  const sections = document.querySelectorAll("section[id]");
  const options = { root: null, rootMargin: "0px 0px -55% 0px", threshold: 0 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      const current = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (!current) return;
      if (entry.isIntersecting) {
        document.querySelectorAll(".main-nav a").forEach(a => a.classList.remove("is-active"));
        current.classList.add("is-active");
      }
    });
  }, options);

  sections.forEach(sec => observer.observe(sec));

  // Contact form submit (kept your Apps Script endpoint + UX feedback)
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const result = document.getElementById("form-result");
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      const formData = {
        timestamp: new Date().toISOString(),
        name: this.name.value.trim(),
        email: this.email.value.trim(),
        message: this.message.value.trim(),
      };

      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz78cUiknj1QP0vdkRr2xg-FV1crOeezJVvubN66v0fdyWU3-O_jzYmOrGGkzD1oCgK/exec";

      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then(() => {
          if (result) {
            result.textContent = "Message sent — thank you!";
            result.style.color = "#047857";
          }
          this.reset();
          setTimeout(() => { if (result) result.textContent = ""; }, 5000);
        })
        .catch((error) => {
          alert("Could not send form. Please check your script URL & deployment.");
          console.error(error);
        });
    });
  }
});
