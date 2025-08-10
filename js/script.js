document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  navToggle.addEventListener("click", function () {
    mainNav.classList.toggle("active");
  });

  // Contact form submission
  const form = document.getElementById("contact-form");
  const result = document.getElementById("form-result");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = {
      timestamp: new Date().toISOString(),
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxm5oPaJ_EBeD3et2shamt6MjlO029OxDMJuZiNPi_i9p-3S8XZbzwPFe8_hnAiKbe/exec";

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      result.textContent = "Message sent — thank you!";
      form.reset();
    } catch (error) {
      alert("Could not send form. Please check your script URL and deployment.");
      console.error(error);
    }

    setTimeout(() => {
      result.textContent = "";
    }, 5000);
  });
});
