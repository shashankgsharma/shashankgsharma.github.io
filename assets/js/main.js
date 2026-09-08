/* Shashank Sharma — site behaviour.
   Every feature lives in its own function so nothing can shadow anything else.
   (An earlier version had a `var current` clobber a `function current()` and
   silently killed the theme toggle. Hence the strict separation.) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var THEME_KEY = "theme";

  function readStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function writeStoredTheme(v) {
    try { localStorage.setItem(THEME_KEY, v); } catch (e) {}
  }
  function activeTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  var themeListeners = [];
  function onThemeChange(fn) { themeListeners.push(fn); }
  function setTheme(next) {
    root.setAttribute("data-theme", next);
    for (var i = 0; i < themeListeners.length; i++) themeListeners[i](next);
  }

  /* ---- Theme toggle -------------------------------------------------- */
  function initTheme() {
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      var label = function () {
        btn.setAttribute("aria-label",
          "Switch to " + (activeTheme() === "dark" ? "light" : "dark") + " theme");
      };
      label();
      btn.addEventListener("click", function () {
        setTheme(activeTheme() === "dark" ? "light" : "dark");
        writeStoredTheme(activeTheme());
        label();
      });
    }
  }

  /* ---- Header ------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var update = function () {
      header.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---- Mobile nav ---------------------------------------------------- */
  function initNav() {
    var btn = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      btn.setAttribute("aria-expanded", String(!open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName !== "A") return;
      nav.setAttribute("data-open", "false");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  /* ---- Reveal on scroll ---------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay =
          (parseFloat(entry.target.getAttribute("data-delay") || "0")) + "ms";
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ---- Ambient spiking network --------------------------------------- */
  /* A small leaky integrate-and-fire network living behind the page.
     Neurons charge, fire, and push spikes down their axons to neighbours. */
  function initNetwork() {
    var canvas = document.querySelector("[data-neuro]");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");

    var neurons = [], axons = [], spikes = [];
    var W = 0, H = 0, dpr = 1;
    var palette = { line: "#000", cell: "#000", spike: "#000" };
    var seed = 8675309;

    function rand() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    function readPalette() {
      var cs = getComputedStyle(root);
      palette.line = (cs.getPropertyValue("--net-line") || "#888").trim();
      palette.cell = (cs.getPropertyValue("--net-cell") || "#888").trim();
      palette.spike = (cs.getPropertyValue("--net-spike") || "#b0472b").trim();
    }

    function build() {
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seed = 8675309;
      neurons = []; axons = []; spikes = [];

      // Jittered grid so the layout reads organic but never clumps.
      var target = Math.round((W * H) / 21000);
      var count = Math.max(30, Math.min(110, target));
      var cols = Math.max(3, Math.round(Math.sqrt(count * (W / Math.max(H, 1)))));
      var rows = Math.max(3, Math.ceil(count / cols));
      var cw = W / cols, ch = H / rows;

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          neurons.push({
            x: cw * (c + 0.5) + (rand() - 0.5) * cw * 0.72,
            y: ch * (r + 0.5) + (rand() - 0.5) * ch * 0.72,
            v: rand() * 0.45,
            flash: 0,
            refractory: 0,
            out: []
          });
        }
      }

      // Connect each neuron to its nearest few, without duplicating an axon.
      var linked = {};
      for (var i = 0; i < neurons.length; i++) {
        var order = [];
        for (var j = 0; j < neurons.length; j++) {
          if (i === j) continue;
          var dx = neurons[i].x - neurons[j].x, dy = neurons[i].y - neurons[j].y;
          order.push([dx * dx + dy * dy, j]);
        }
        order.sort(function (a, b) { return a[0] - b[0]; });
        var links = 2 + Math.floor(rand() * 2);
        for (var k = 0; k < links && k < order.length; k++) {
          var t = order[k][1];
          var key = Math.min(i, t) + ":" + Math.max(i, t);
          if (linked[key]) continue;
          linked[key] = 1;
          var len = Math.sqrt(order[k][0]);
          if (len > Math.max(W, H) * 0.28) continue;
          var axon = { a: i, b: t, len: len };
          axons.push(axon);
          neurons[i].out.push(axon);
        }
      }
    }

    function fire(n, idx) {
      n.v = 0;
      n.flash = 1;
      n.refractory = 26;
      for (var i = 0; i < n.out.length; i++) {
        if (spikes.length > 90) break;
        var ax = n.out[i];
        spikes.push({ ax: ax, from: idx, t: 0, speed: 0.9 / Math.max(ax.len, 24) });
      }
    }

    function step() {
      // Leak, decay the flash, and let a few neurons receive outside input.
      for (var i = 0; i < neurons.length; i++) {
        var n = neurons[i];
        n.v *= 0.992;
        n.flash *= 0.94;
        if (n.refractory > 0) n.refractory--;
        if (rand() < 0.0026 && n.refractory === 0) n.v += 0.5 + rand() * 0.35;
        if (n.v >= 1 && n.refractory === 0) fire(n, i);
      }
      // Advance spikes; deliver charge on arrival.
      for (var s = spikes.length - 1; s >= 0; s--) {
        var sp = spikes[s];
        sp.t += sp.speed * 2.6;
        if (sp.t < 1) continue;
        var target = neurons[sp.ax.a === sp.from ? sp.ax.b : sp.ax.a];
        if (target.refractory === 0) target.v += 0.34;
        spikes.splice(s, 1);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.line;
      ctx.beginPath();
      for (var e = 0; e < axons.length; e++) {
        var a = neurons[axons[e].a], b = neurons[axons[e].b];
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      for (var i = 0; i < neurons.length; i++) {
        var n = neurons[i];
        var lit = Math.min(1, n.v * 0.8 + n.flash);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.9 + lit * 2.8, 0, 6.2832);
        ctx.fillStyle = n.flash > 0.12 ? palette.spike : palette.cell;
        ctx.globalAlpha = 0.5 + lit * 0.5;
        ctx.fill();
        if (n.flash > 0.25) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 4 + n.flash * 12, 0, 6.2832);
          ctx.strokeStyle = palette.spike;
          ctx.globalAlpha = n.flash * 0.5;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = palette.spike;
      for (var s = 0; s < spikes.length; s++) {
        var sp = spikes[s];
        var from = neurons[sp.from];
        var to = neurons[sp.ax.a === sp.from ? sp.ax.b : sp.ax.a];
        var x = from.x + (to.x - from.x) * sp.t;
        var y = from.y + (to.y - from.y) * sp.t;
        ctx.globalAlpha = 0.85 * (1 - Math.abs(sp.t - 0.5) * 0.7);
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    var last = 0;
    function frame(now) {
      if (document.hidden) { requestAnimationFrame(frame); return; }
      if (now - last > 33) { last = now; step(); draw(); }
      requestAnimationFrame(frame);
    }

    readPalette();
    build();

    if (reduceMotion.matches) {
      for (var w = 0; w < 260; w++) step();
      draw();
    } else {
      requestAnimationFrame(frame);
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { build(); draw(); }, 220);
    });
    onThemeChange(function () { setTimeout(function () { readPalette(); draw(); }, 30); });
  }

  /* ---- Trajectory graph ---------------------------------------------- */
  function initJourney() {
    var wrap = document.querySelector("[data-journey]");
    if (!wrap) return;
    var panel = wrap.querySelector("[data-journey-panel]");
    var nodes = wrap.querySelectorAll(".jnode");
    var rows = wrap.querySelectorAll(".jitem__btn");

    var show = function (id) {
      var node = wrap.querySelector('.jnode[data-node="' + id + '"]');
      if (!node || !panel) return;
      panel.querySelector(".jpanel__period").textContent = node.getAttribute("data-period");
      panel.querySelector(".jpanel__title").textContent = node.getAttribute("data-title");
      panel.querySelector(".jpanel__org").textContent = node.getAttribute("data-org");
      panel.querySelector(".jpanel__body").textContent = node.getAttribute("data-body");
      nodes.forEach(function (n) { n.classList.toggle("is-active", n === node); });
    };

    nodes.forEach(function (node) {
      var id = node.getAttribute("data-node");
      node.addEventListener("click", function () { show(id); });
      node.addEventListener("mouseenter", function () { show(id); });
      node.addEventListener("focus", function () { show(id); });
      node.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        show(id);
      });
    });

    rows.forEach(function (row) {
      row.addEventListener("click", function () {
        var open = row.getAttribute("aria-expanded") === "true";
        rows.forEach(function (r) { r.setAttribute("aria-expanded", "false"); });
        row.setAttribute("aria-expanded", open ? "false" : "true");
        show(row.getAttribute("data-jump"));
      });
    });

    var startNode = wrap.querySelector(".jnode--current") || nodes[nodes.length - 1];
    if (startNode) show(startNode.getAttribute("data-node"));
  }

  /* ---- Bookshelf ------------------------------------------------------ */
  function initShelf() {
    var shelf = document.querySelector("[data-shelf]");
    if (!shelf) return;
    var caption = shelf.querySelector("[data-shelf-caption]");
    var spines = shelf.querySelectorAll(".spine");

    var reveal = function (spine) {
      spines.forEach(function (s) { s.classList.toggle("is-active", s === spine); });
      caption.innerHTML =
        '<p class="shelf__title"></p><p class="shelf__meta"></p><p class="shelf__note"></p>';
      caption.querySelector(".shelf__title").textContent = spine.getAttribute("data-title");
      caption.querySelector(".shelf__meta").textContent =
        spine.getAttribute("data-author") + " · " + spine.getAttribute("data-year");
      caption.querySelector(".shelf__note").textContent = spine.getAttribute("data-note");
    };

    spines.forEach(function (spine) {
      spine.addEventListener("mouseenter", function () { reveal(spine); });
      spine.addEventListener("focus", function () { reveal(spine); });
      spine.addEventListener("click", function () { reveal(spine); });
    });
  }

  /* ---- Copy BibTeX ---------------------------------------------------- */
  function initBibtex() {
    document.querySelectorAll("[data-bibtex]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-bibtex");
        var label = btn.querySelector("span") || btn;
        var was = label.textContent;
        var flash = function (msg) {
          label.textContent = msg;
          setTimeout(function () { label.textContent = was; }, 1600);
        };
        var fallback = function () {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.cssText = "position:absolute;left:-9999px";
          document.body.appendChild(ta);
          ta.select();
          var ok = false;
          try { ok = document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
          flash(ok ? "copied" : "select manually");
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { flash("copied"); }, fallback);
        } else {
          fallback();
        }
      });
    });
  }

  root.classList.remove("no-js");
  root.classList.add("has-js");

  initTheme();
  initHeader();
  initNav();
  initReveal();
  initNetwork();
  initJourney();
  initShelf();
  initBibtex();
})();
