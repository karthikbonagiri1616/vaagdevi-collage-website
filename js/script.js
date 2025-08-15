/* Mobile nav + active link + lightbox + form submit + accessible ticker pause on hover */
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = document.querySelectorAll("main section[id], header, footer");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lbClose = document.querySelector(".lightbox-close");
  const ticker = document.querySelector(".ticker-track");

  // Mobile nav toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", (!expanded).toString());
      mainNav.classList.toggle("active");
    });
  }

  // Close mobile nav when link clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 760 && mainNav.classList.contains("active")) {
        mainNav.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // IntersectionObserver -> highlight active nav link
  const observerOptions = { root: null, rootMargin: "0px 0px -48% 0px", threshold: 0 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      if (!id) return;
      const link = document.querySelector(`.main-nav a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll(".main-nav a").forEach(a => a.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  }, observerOptions);

  document.querySelectorAll("section[id]").forEach(sec => observer.observe(sec));

  // Lightbox: open
  galleryItems.forEach(img => {
    img.addEventListener("click", (e) => {
      const src = img.dataset.full || img.src;
      lightboxImg.src = src;
      lightboxImg.alt = img.alt || "";
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  // Lightbox: close actions
  function closeLightbox() {
    lightboxImg.src = "";
    lightbox.setAttribute("aria-hidden", "true");
  }
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === lbClose) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") closeLightbox();
  });

  // Contact form submit (keeps your Apps Script endpoint)
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const resultEl = document.getElementById("form-result");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const payload = {
        timestamp: new Date().toISOString(),
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
      };
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz78cUiknj1QP0vdkRr2xg-FV1crOeezJVvubN66v0fdyWU3-O_jzYmOrGGkzD1oCgK/exec";
      fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(() => {
        resultEl.textContent = "Message sent — thank you!";
        resultEl.style.color = "#047857";
        form.reset();
        setTimeout(() => resultEl.textContent = "", 5000);
      }).catch((err) => {
        alert("Could not send form. Please verify script URL & deployment.");
        console.error(err);
      });
    });
  }

  // Pause ticker on hover / focus for accessibility
  const tickerTrack = document.querySelector(".ticker-track");
  if (tickerTrack) {
    tickerTrack.addEventListener("mouseenter", () => tickerTrack.style.animationPlayState = "paused");
    tickerTrack.addEventListener("mouseleave", () => tickerTrack.style.animationPlayState = "running");
    tickerTrack.addEventListener("focusin", () => tickerTrack.style.animationPlayState = "paused");
    tickerTrack.addEventListener("focusout", () => tickerTrack.style.animationPlayState = "running");
  }
});
