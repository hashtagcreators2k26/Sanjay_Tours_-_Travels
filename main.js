/* ============================================================
   SANJAY TOURS & TRAVELS — main.js
   Navigation, scroll reveal, FAQ accordion, misc UI behaviour.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Sticky nav: solid background on scroll ---------- */
  var nav = document.querySelector(".site-nav");
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  handleNavScroll();
  window.addEventListener("scroll", handleNavScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  function closeMobileNav() {
    if (!toggle || !navLinks) return;
    toggle.classList.remove("open");
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* ---------- Mark current page in nav ---------- */
  (function markActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  })();

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  var revealTargets = document.querySelectorAll(".reveal, .reveal-up");

  if ("IntersectionObserver" in window && revealTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything immediately
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Hero reveal fires immediately on load rather than on scroll */
  document.querySelectorAll(".hero .reveal-up").forEach(function (el, i) {
    setTimeout(function () { el.classList.add("is-visible"); }, 150 + i * 120);
  });

  /* ---------- FAQ accordion (contact page) ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    if (!question || !answer) return;

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach(function (open) {
        if (open !== item) {
          open.classList.remove("open");
          open.querySelector(".faq-a").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Smooth-scroll for in-page anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
