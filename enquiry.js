/* ============================================================
   SANJAY TOURS & TRAVELS — enquiry.js
   WhatsApp enquiry system: quick-enquire buttons + full form.
   No backend — every enquiry is handed to WhatsApp for the
   customer to review and send themselves.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Configuration ---------- */
  /* Business WhatsApp number in international format, no symbols. */
  var WHATSAPP_NUMBER = "919500411912";

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function openWhatsApp(message) {
    window.open(buildWhatsAppUrl(message), "_blank", "noopener");
  }

  /* ---------- Quick enquiry buttons ----------
     Any element with [data-whatsapp-quick] sends a short,
     pre-filled message naming the specific service/destination/
     vehicle it was clicked from (data-item attribute). */
  document.querySelectorAll("[data-whatsapp-quick]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var item = btn.getAttribute("data-item") || "your services";
      var message =
        "Hello Sanjay Tours & Travels!\n\n" +
        "I would like to enquire about: " + item + "\n\n" +
        "Please share availability and quotation.\n\n" +
        "Thank you!";
      openWhatsApp(message);
    });
  });

  /* ---------- Floating WhatsApp button + generic nav CTAs ---------- */
  document.querySelectorAll("[data-whatsapp-general]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var message =
        "Hello Sanjay Tours & Travels!\n\n" +
        "I would like to enquire about your travel services.\n\n" +
        "Please share availability and quotation.\n\n" +
        "Thank you!";
      openWhatsApp(message);
    });
  });

  /* ---------- Full enquiry form ---------- */
  var form = document.getElementById("enquiry-form");
  if (!form) return;

  var successBox = document.getElementById("form-success");

  var fields = {
    name: { required: true, label: "Name" },
    phone: { required: true, label: "Phone Number" },
    pickup: { required: true, label: "Pickup Location" },
    destination: { required: true, label: "Destination" },
    date: { required: true, label: "Travel Date" },
    passengers: { required: true, label: "Number of Passengers" },
    vehicle: { required: false, label: "Vehicle Preference" },
    notes: { required: false, label: "Additional Requirements" }
  };

  function setError(name, msg) {
    var group = form.querySelector('[data-group="' + name + '"]');
    if (!group) return;
    var errorEl = group.querySelector(".form-error");
    if (msg) {
      group.classList.add("has-error");
      if (errorEl) errorEl.textContent = msg;
    } else {
      group.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function validatePhone(value) {
    var digits = value.replace(/[^0-9]/g, "");
    return digits.length >= 10;
  }

  function validate() {
    var valid = true;
    var data = {};

    Object.keys(fields).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var value = (el.value || "").trim();
      data[name] = value;

      if (fields[name].required && !value) {
        setError(name, fields[name].label + " is required.");
        valid = false;
        return;
      }

      if (name === "phone" && value && !validatePhone(value)) {
        setError(name, "Enter a valid phone number.");
        valid = false;
        return;
      }

      setError(name, "");
    });

    return { valid: valid, data: data };
  }

  function buildMessage(data) {
    return (
      "Hello Sanjay Tours & Travels!\n\n" +
      "I would like to enquire about your travel services.\n\n" +
      "Name: " + data.name + "\n" +
      "Phone: " + data.phone + "\n" +
      "Pickup Location: " + data.pickup + "\n" +
      "Destination: " + data.destination + "\n" +
      "Travel Date: " + data.date + "\n" +
      "Passengers: " + data.passengers + "\n" +
      "Vehicle Preference: " + (data.vehicle || "Not specified") + "\n" +
      "Additional Requirements: " + (data.notes || "None") + "\n\n" +
      "Please share availability and quotation.\n\n" +
      "Thank you!"
    );
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var result = validate();
    if (!result.valid) {
      var firstError = form.querySelector(".has-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    var message = buildMessage(result.data);

    if (successBox) {
      successBox.classList.add("show");
      successBox.textContent =
        "Your enquiry is ready. We're opening WhatsApp so you can review and send it to us.";
    }

    openWhatsApp(message);
  });

  /* Clear a field's error as soon as the person starts fixing it */
  Object.keys(fields).forEach(function (name) {
    var el = form.elements[name];
    if (!el) return;
    el.addEventListener("input", function () { setError(name, ""); });
    el.addEventListener("change", function () { setError(name, ""); });
  });
})();
