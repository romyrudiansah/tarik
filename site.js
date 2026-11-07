// Ganti bahasa dan tema (disimpan di browser ini saja), menu ponsel, dan tombol salin SHA-256.
(function () {
  var root = document.documentElement;
  var store = function (key, value) {
    try {
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) {}
  };

  document.querySelectorAll("[data-switch-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.dataset.lang === "id" ? "en" : "id";
      root.dataset.lang = next;
      root.lang = next;
      store("tarik-lang", next);
    });
  });

  // Mode gelap: tombol dua keadaan. Bawaannya terang, tidak mengikuti tema Windows.
  document.querySelectorAll("[data-switch-theme]").forEach(function (btn) {
    var sync = function () { btn.setAttribute("aria-pressed", root.dataset.theme === "dark" ? "true" : "false"); };
    sync();
    btn.addEventListener("click", function () {
      var dark = root.dataset.theme !== "dark";
      if (dark) root.dataset.theme = "dark"; else delete root.dataset.theme;
      store("tarik-theme", dark ? "dark" : null);
      sync();
    });
  });

  var menuBtn = document.querySelector("[data-menu]");
  var menu = document.getElementById("menu");
  if (menuBtn && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    menuBtn.addEventListener("click", function () {
      setOpen(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        setOpen(false);
        menuBtn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") && !menu.contains(e.target) && !menuBtn.contains(e.target)) setOpen(false);
    });
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = document.getElementById(btn.dataset.copy).textContent.trim();
      var labels = btn.querySelectorAll("[data-l]");
      var show = function (id, en) {
        var old = Array.prototype.map.call(labels, function (s) { return s.textContent; });
        labels.forEach(function (s) { s.textContent = s.dataset.l === "id" ? id : en; });
        setTimeout(function () { labels.forEach(function (s, i) { s.textContent = old[i]; }); }, 1600);
      };
      // Cadangan bila Clipboard API ditolak: pilih teksnya dan coba cara lama; teks tetap
      // terpilih supaya bisa disalin dengan Ctrl+C.
      var fallback = function () {
        var range = document.createRange();
        range.selectNodeContents(document.getElementById(btn.dataset.copy));
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) {}
        if (ok) show("Tersalin", "Copied"); else show("Tekan Ctrl+C", "Press Ctrl+C");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { show("Tersalin", "Copied"); }, fallback);
      } else {
        fallback();
      }
    });
  });
})();
