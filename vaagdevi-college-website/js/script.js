document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const result = document.getElementById("form-result");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Basic form validation
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

    const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

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
      alert("Could not send form. Please configure the Apps Script endpoint.");
      console.error(error);
    }

    setTimeout(() => {
      result.textContent = "";
    }, 5000);
  });
});
