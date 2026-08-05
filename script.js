(function () {
  "use strict";

  /* ── CONFIG CHECK ─────────────────────────── */
  if (typeof CONFIG === "undefined") {
    console.error("config.js não carregado.");
    return;
  }

  /* ── SEO & META ───────────────────────────── */
  function initMeta() {
    const s = CONFIG.seo;
    document.title = s.title;
    setMeta("meta-description", "content", s.description);
    setMeta("meta-canonical", "href", s.siteUrl);
    setMeta("og-title", "content", s.title);
    setMeta("og-description", "content", s.description);
    setMeta("og-image", "content", s.ogImage);
    setMeta("og-url", "content", s.siteUrl);
    setMeta("tw-title", "content", s.title);
    setMeta("tw-description", "content", s.description);
    setMeta("tw-image", "content", s.ogImage);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: CONFIG.product.name,
      description: s.description,
      url: s.siteUrl,
      image: s.ogImage,
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: CONFIG.pricing.copa.atual.replace(/\D/g, "").replace(/(\d{2})$/, ".$1"),
        availability: "https://schema.org/InStock",
        url: CONFIG.pricing.copa.checkoutUrl,
      },
    };

    const el = document.getElementById("schema-product");
    if (el) el.textContent = JSON.stringify(schema);
  }

  function setMeta(id, attr, val) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  }

  /* ── LOGOS & BRAND ────────────────────────── */
  function initBrand() {
    const m = CONFIG.media;
    const c = CONFIG.contact;
    const p = CONFIG.product;

    setImgSrc("header-logo", m.logo, "Logo");
    setImgSrc("footer-logo", m.logo, "Logo");

    const tagEl = document.getElementById("footer-tagline");
    if (tagEl) tagEl.textContent = p.tagline;

    const yearEl = document.getElementById("footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const wa = document.getElementById("footer-whatsapp");
    if (wa) wa.href = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(c.whatsappMsg)}`;

    const ig = document.getElementById("footer-instagram");
    if (ig) ig.href = c.instagram;

    const em = document.getElementById("footer-email");
    if (em) em.href = `mailto:${c.email}`;
  }

  function setImgSrc(id, src, alt) {
    const el = document.getElementById(id);
    if (!el) return;
    if (src && !src.startsWith("assets/images/LOGO") && src !== "") {
      el.src = src;
      if (alt) el.alt = alt;
    }
  }

  /* ── HERO ─────────────────────────────────── */
  function initHero() {
    const m = CONFIG.media;
    const pr = CONFIG.pricing;
    const p = CONFIG.product;

    const heroImg = document.getElementById("hero-image");
    const heroPlaceholder = document.getElementById("hero-placeholder");
    if (heroImg && m.heroImage && !m.heroImage.startsWith("assets/images/HERO")) {
      heroImg.src = m.heroImage;
      heroImg.style.display = "block";
      if (heroPlaceholder) heroPlaceholder.style.display = "none";
    } else {
      if (heroImg) heroImg.style.display = "none";
    }

    setEl("stat-templates", p.totalTemplates);
    setEl("stat-selecoes", p.totalSelecoes);

    setCheckoutLink("hero-btn", pr.copa.checkoutUrl);
    setCheckoutLink("cta-btn", pr.copa.checkoutUrl);
  }

  /* ── VIDEO ────────────────────────────────── */
  function initVideo() {
    const url = CONFIG.media.videoUrl;
    const iframe = document.getElementById("video-iframe");
    const placeholder = document.getElementById("video-placeholder");

    if (url && url !== "VIDEO_YOUTUBE_EMBED_URL" && url.startsWith("http")) {
      if (iframe) {
        iframe.src = url;
        iframe.style.display = "block";
      }
      if (placeholder) placeholder.style.display = "none";
    }
  }

  /* ── PRICES ───────────────────────────────── */
  function initPrices() {
    const pr = CONFIG.pricing;

    setEl("offer-copa-old", pr.copa.original);
    setEl("offer-copa-new", pr.copa.atual);
    setEl("offer-copa-parcelas", pr.copa.parcelas);
    setEl("offer-europa-old", pr.europa.original);
    setEl("offer-europa-new", pr.europa.atual);
    setEl("offer-europa-parcelas", pr.europa.parcelas);
    setEl("offer-combo-old", pr.combo.original);
    setEl("offer-combo-new", pr.combo.atual);
    setEl("offer-combo-parcelas", pr.combo.parcelas);
    setEl("combo-economia", pr.combo.economia);
    setEl("comparison-price", pr.copa.atual);

    setCheckoutLink("offer-copa-btn", pr.copa.checkoutUrl);
    setCheckoutLink("offer-europa-btn", pr.europa.checkoutUrl);
    setCheckoutLink("offer-combo-btn", pr.combo.checkoutUrl);

    const europaImg = document.getElementById("europa-image");
    const europaPlaceholder = document.getElementById("europa-placeholder");
    const europaWrap = document.querySelector(".europa-mockup-wrap");
    if (CONFIG.media.europaPack && !CONFIG.media.europaPack.startsWith("assets/images/EUROPA")) {
      if (europaImg) {
        europaImg.src = CONFIG.media.europaPack;
        europaImg.style.display = "block";
      }
      if (europaPlaceholder) europaPlaceholder.style.display = "none";
    } else {
      if (europaImg) europaImg.style.display = "none";
    }
  }

  /* ── GALLERY ──────────────────────────────── */
  function initGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    CONFIG.gallery.forEach(function (item) {
      const card = document.createElement("article");
      card.className = "gallery-card reveal";
      card.setAttribute("data-reveal", "fade-up");
      card.setAttribute("role", "listitem");
      card.setAttribute("aria-label", "Template " + item.name);

      const isPlaceholder = !item.image || item.image.includes("/selecao/");

      card.innerHTML = `
        <div class="gallery-card-img">
          ${isPlaceholder
          ? `<div class="gallery-img-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                <span>${item.name}</span>
              </div>`
          : `<img src="${escapeHtml(item.image)}" alt="Template ${escapeHtml(item.name)}" loading="lazy" width="300" height="400" />`
        }
        </div>
        <div class="gallery-card-footer">
          <span class="gallery-card-name">${escapeHtml(item.name)}</span>
          <button class="gallery-zoom" aria-label="Ampliar template ${escapeHtml(item.name)}" data-name="${escapeHtml(item.name)}" data-src="${isPlaceholder ? "" : escapeHtml(item.image)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
        </div>
      `;

      grid.appendChild(card);

      const zoomBtn = card.querySelector(".gallery-zoom");
      if (zoomBtn) {
        zoomBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openLightbox(this.dataset.src, this.dataset.name);
        });
      }

      card.addEventListener("click", function () {
        const btn = this.querySelector(".gallery-zoom");
        if (btn) openLightbox(btn.dataset.src, btn.dataset.name);
      });
    });
  }

  /* ── LIGHTBOX ─────────────────────────────── */
  function initLightbox() {
    const lb = document.getElementById("lightbox");
    const closeBtn = document.getElementById("lightbox-close");

    if (!lb || !closeBtn) return;

    closeBtn.addEventListener("click", closeLightbox);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(src, name) {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-caption");
    if (!lb || !img) return;

    if (src) {
      img.src = src;
      img.alt = name || "";
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }

    if (cap) cap.textContent = name || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.hidden = true;
    document.body.style.overflow = "";
  }

  /* ── FAQ ──────────────────────────────────── */
  function initFaq() {
    const list = document.getElementById("faq-list");
    if (!list) return;

    CONFIG.faq.forEach(function (item, i) {
      const el = document.createElement("div");
      el.className = "faq-item";
      el.setAttribute("role", "listitem");

      const answerId = "faq-answer-" + i;
      el.innerHTML = `
        <button class="faq-q" aria-expanded="false" aria-controls="${answerId}">
          <span>${escapeHtml(item.q)}</span>
          <span class="faq-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
        </button>
        <div class="faq-a" id="${answerId}" role="region">${escapeHtml(item.a)}</div>
      `;

      const btn = el.querySelector(".faq-q");
      const answer = el.querySelector(".faq-a");

      btn.addEventListener("click", function () {
        const isOpen = el.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function (other) {
          other.classList.remove("open");
          other.querySelector(".faq-a").classList.remove("open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          el.classList.add("open");
          answer.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });

      list.appendChild(el);
    });
  }

  /* ── SCROLL REVEAL ────────────────────────── */
  function initReveal() {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            setTimeout(function () {
              entry.target.classList.add("visible");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ── STICKY HEADER ────────────────────────── */
  function initHeader() {
    const header = document.querySelector(".header");
    if (!header) return;
    window.addEventListener("scroll", function () {
      header.style.background = window.scrollY > 32
        ? "rgba(15,17,21,0.97)"
        : "rgba(15,17,21,0.85)";
    }, { passive: true });
  }

  /* ── SMOOTH SCROLL FOR NAV ────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ── UTILS ────────────────────────────────── */
  function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setCheckoutLink(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    if (url && url !== "CHECKOUT_COPA_URL" && url !== "CHECKOUT_EUROPA_URL" && url !== "CHECKOUT_COMBO_URL") {
      el.href = url;
    } else {
      el.href = "#oferta";
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ── INIT ─────────────────────────────────── */
  function init() {
    initMeta();
    initBrand();
    initHero();
    initVideo();
    initPrices();
    initGallery();
    initLightbox();
    initFaq();
    initReveal();
    initHeader();
    initSmoothScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
