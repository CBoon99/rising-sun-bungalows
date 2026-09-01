/* Rising Sun Bungalows — theme, Three.js hero, map, form */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem("rsb-theme");
    } catch (e) {
      return null;
    }
  }

  function applyTheme(mode) {
    var dark = mode === "dark";
    root.classList.toggle("dark", dark);
    if (metaTheme) metaTheme.setAttribute("content", dark ? "#1a1612" : "#5e6f5a");
    try {
      localStorage.setItem("rsb-theme", mode);
    } catch (e) {}
    if (window.__rsbSetThreeTheme) window.__rsbSetThreeTheme(dark);
    if (themeBtn) themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  function initTheme() {
    var stored = getStoredTheme();
    applyTheme(stored || (systemPrefersDark() ? "dark" : "light"));
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      applyTheme(root.classList.contains("dark") ? "light" : "dark");
    });
  }

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
    });
  }

  initTheme();

  /* ---------- burger menu ---------- */
  var menuBtn = document.getElementById("menu-toggle");
  var menuDrawer = document.getElementById("menu-drawer");
  var menuBackdrop = document.getElementById("menu-backdrop");

  function setMenu(open) {
    if (!menuDrawer || !menuBtn) return;
    menuDrawer.classList.toggle("is-open", open);
    menuDrawer.setAttribute("aria-hidden", open ? "false" : "true");
    if ("inert" in menuDrawer) menuDrawer.inert = !open;
    menuDrawer.querySelectorAll("a, button").forEach(function (el) {
      if (el.id === "menu-backdrop") return;
      el.tabIndex = open ? 0 : -1;
    });
    menuBtn.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  }

  if (menuBtn && menuDrawer) {
    menuBtn.addEventListener("click", function () {
      setMenu(!menuDrawer.classList.contains("is-open"));
    });
    if (menuBackdrop) {
      menuBackdrop.addEventListener("click", function () {
        setMenu(false);
      });
    }
    menuDrawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    setMenu(false);
  }

  /* ---------- year ---------- */
  var y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- hero image zoom ---------- */
  window.addEventListener("load", function () {
    var hero = document.getElementById("heroImg");
    if (hero) hero.classList.add("is-active");
  });

  /* ---------- GSAP ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".fade-up").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        }
      );
    });
  }

  /* ---------- map ---------- */
  function initMap() {
    if (!window.L || !document.getElementById("map")) return;
    var rsb = window.__RSB || {};
    var lat = typeof rsb.lat === "number" ? rsb.lat : -8.35;
    var lng = typeof rsb.lng === "number" ? rsb.lng : 116.0545;
    var harbourLat = lat + 0.0005;
    var harbourLng = lng + 0.0005;
    var map = L.map("map", { scrollWheelZoom: false }).setView([harbourLat, harbourLng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup("<b>" + (rsb.name || "Rising Sun Bungalows") + "</b><br>" + (rsb.map_popup || "Near Gili Meno harbour"));
    L.marker([harbourLat, harbourLng])
      .addTo(map)
      .bindPopup(rsb.harbour_popup || "Gili Meno harbour");
  }

  function loadLeaflet(cb) {
    if (window.L) {
      cb();
      return;
    }
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = cb;
    document.head.appendChild(s);
  }

  var mapEl = document.getElementById("map");
  if (mapEl) {
    if ("IntersectionObserver" in window) {
      var mapIo = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            mapIo.disconnect();
            loadLeaflet(initMap);
          }
        },
        { rootMargin: "240px" }
      );
      mapIo.observe(mapEl);
    } else {
      loadLeaflet(initMap);
    }
  }

  /* ---------- booking form ---------- */
  var today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    input.min = today;
  });

  var bookingForm = document.querySelector('form[name="booking"]');
  if (bookingForm) {
    var dateError = document.getElementById("date-error");
    bookingForm.addEventListener("submit", function (e) {
      var cin = bookingForm.querySelector("#check-in").value;
      var cout = bookingForm.querySelector("#check-out").value;
      if (cin && cout && cout <= cin) {
        e.preventDefault();
        if (dateError) {
          dateError.hidden = false;
          dateError.focus && dateError.focus();
        }
      } else if (dateError) {
        dateError.hidden = true;
      }
    });
  }

  /* ---------- Three.js futuristic ambient ---------- */
  function initThree() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || !window.THREE) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    var THREE = window.THREE;
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.35, 4.2);

    var isDark = root.classList.contains("dark");

    // Particle field
    var count = 900;
    var positions = new Float32Array(count * 3);
    var speeds = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      speeds[i] = 0.15 + Math.random() * 0.45;
    }
    var pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // Soft warm dust motes only — no grid / tech shapes
    var pMat = new THREE.PointsMaterial({
      size: 0.03,
      color: isDark ? 0xc9a86c : 0xfff6e8,
      transparent: true,
      opacity: isDark ? 0.4 : 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    var points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    var sunGeo = new THREE.SphereGeometry(0.7, 32, 32);
    var sunMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xc9a86c : 0xffe8b8,
      transparent: true,
      opacity: isDark ? 0.28 : 0.22,
    });
    var sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(1.5, 1.0, -2.4);
    scene.add(sun);

    function setTheme(dark) {
      isDark = dark;
      pMat.color.setHex(dark ? 0xc9a86c : 0xfff6e8);
      pMat.opacity = dark ? 0.4 : 0.35;
      sunMat.color.setHex(dark ? 0xc9a86c : 0xffe8b8);
      sunMat.opacity = dark ? 0.28 : 0.22;
    }
    window.__rsbSetThreeTheme = setTheme;

    function resize() {
      var w = canvas.clientWidth || canvas.parentElement.clientWidth;
      var h = canvas.clientHeight || canvas.parentElement.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    var mouseX = 0;
    var mouseY = 0;
    window.addEventListener(
      "pointermove",
      function (e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
      },
      { passive: true }
    );

    var t0 = performance.now();
    var running = true;

    function animate(now) {
      if (!running) return;
      requestAnimationFrame(animate);
      var t = (now - t0) * 0.001;

      var pos = pGeo.attributes.position.array;
      for (var i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(t * speeds[i] + i) * 0.0012;
        pos[i * 3] += Math.cos(t * 0.1 + i * 0.01) * 0.0006;
      }
      pGeo.attributes.position.needsUpdate = true;

      points.rotation.y = t * 0.02;
      sun.position.y = 1.0 + Math.sin(t * 0.4) * 0.06;

      camera.position.x += (mouseX - camera.position.x) * 0.03;
      camera.position.y += (0.35 - mouseY - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(animate);

    // Pause when hero off-screen
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          running = entries[0].isIntersecting;
          if (running) requestAnimationFrame(animate);
        },
        { threshold: 0.05 }
      );
      io.observe(canvas.parentElement || canvas);
    }
  }

  function loadThree() {
    if (reduceMotion) {
      var c = document.getElementById("hero-canvas");
      if (c) c.style.display = "none";
      return;
    }
    if (window.THREE) {
      initThree();
      return;
    }
    var s = document.createElement("script");
    s.src = "https://unpkg.com/three@0.160.0/build/three.min.js";
    s.onload = initThree;
    s.onerror = function () {
      var canvas = document.getElementById("hero-canvas");
      if (canvas) canvas.style.display = "none";
    };
    document.head.appendChild(s);
  }

  if (window.requestIdleCallback) {
    window.requestIdleCallback(loadThree, { timeout: 2500 });
  } else {
    window.setTimeout(loadThree, 1200);
  }
})();
