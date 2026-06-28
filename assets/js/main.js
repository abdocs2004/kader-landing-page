(function () {
  "use strict";

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("shadow-soft", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile hamburger menu ---- */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconOpen = document.getElementById("menu-icon-open");
  var iconClose = document.getElementById("menu-icon-close");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      var isOpen = !mobileMenu.classList.contains("hidden");

      mobileMenu.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(!isOpen));

      if (iconOpen && iconClose) {
        iconOpen.classList.toggle("hidden");
        iconClose.classList.toggle("hidden");
      }
    });

    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");

        if (iconOpen && iconClose) {
          iconOpen.classList.remove("hidden");
          iconClose.classList.add("hidden");
        }
      });
    });
  }

  /* ---- Announcement banner dismiss (session-only) ---- */
  var banner = document.getElementById("announcement-banner");

  if (banner) {
    if (sessionStorage.getItem("kader_announcement_dismissed") === "1") {
      banner.remove();
    } else {
      var dismissBtn = banner.querySelector("[data-dismiss-announcement]");

      if (dismissBtn) {
        dismissBtn.addEventListener("click", function () {
          banner.remove();
          sessionStorage.setItem("kader_announcement_dismissed", "1");
        });
      }
    }
  }

  /* ---- Language preference persistence ---- */
  document.querySelectorAll("[data-set-locale]").forEach(function (link) {
    link.addEventListener("click", function () {
      localStorage.setItem(
        "kader_locale",
        link.getAttribute("data-set-locale")
      );
    });
  });

  /* ---- FAQ accordion (Improved) ---- */
  document.querySelectorAll("[data-accordion-group]").forEach(function (group) {
    var triggers = group.querySelectorAll("[data-accordion-trigger]");

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {

        var panel = document.getElementById(
          trigger.getAttribute("aria-controls")
        );

        var icon = trigger.querySelector(".accordion-icon");

        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        // Close all other items
        triggers.forEach(function (t) {
          if (t === trigger) return;

          t.setAttribute("aria-expanded", "false");

          var p = document.getElementById(
            t.getAttribute("aria-controls")
          );

          if (p) {
            p.style.maxHeight = null;
            p.classList.remove("pb-5");
          }

          var ic = t.querySelector(".accordion-icon");
          if (ic) {
            ic.classList.remove("rotate-45");
          }
        });

        // Toggle current item
        if (isOpen) {

          trigger.setAttribute("aria-expanded", "false");

          panel.style.maxHeight = null;
          panel.classList.remove("pb-5");

          if (icon) {
            icon.classList.remove("rotate-45");
          }

        } else {

          trigger.setAttribute("aria-expanded", "true");

          panel.classList.add("pb-5");

          // Calculate the real height
          panel.style.maxHeight = panel.scrollHeight + "px";

          if (icon) {
            icon.classList.add("rotate-45");
          }

        }

      });
    });
  });

  /* ---- Contact form ---- */
  var form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = new FormData(form);

      var payload = {
        name: data.get("name"),
        phone: data.get("phone"),
        childAge: data.get("childAge"),
        message: data.get("message"),
      };

      console.log("Kader contact form submission:", payload);

      var subject = encodeURIComponent(
        "Kader trial enquiry — " + (payload.name || "")
      );

      var body = encodeURIComponent(
        "Name: " + payload.name +
        "\nPhone: " + payload.phone +
        "\nChild's age: " + payload.childAge +
        "\nMessage: " + payload.message
      );

      window.location.href =
        "mailto:info@kadertech.live?subject=" +
        subject +
        "&body=" +
        body;

      var success = document.getElementById("contact-success");

      if (success) {
        success.classList.remove("hidden");
      }

      form.reset();
    });
  }

})();