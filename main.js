const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLowPowerDevice =
  (Number(navigator.hardwareConcurrency) > 0 && Number(navigator.hardwareConcurrency) <= 4) ||
  (Number(navigator.deviceMemory) > 0 && Number(navigator.deviceMemory) <= 4);

const SEND_ICON =
  '<span class="iconify icon-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 20 4l-4 16-4-6-8-2Z"/><path d="m12 14 8-10"/></svg></span>';
const CALL_SENT_ICON =
  '<span class="iconify icon-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg></span>';
let typedWordsState = [];
let typedEffectVersion = 0;

const LANGUAGE_TEXT = {
  en: {
    sending: "Sending...",
    sent: "Sent",
    call_request_subject: "Book a call request",
    call_request_message: "A visitor clicked the Book a Call button and requested a call.",
    call_request_sent: "Call request sent to radmanqelichi@gmail.com",
    call_request_failed: "Could not send request now. Please email radmanqelichi@gmail.com",
    submit_default: "Send Message",
    thanks: "Thanks!",
    fix_fields: "Please fix the highlighted fields and try again.",
    sent_ok: "Message sent successfully. I will get back to you soon.",
    fallback_mailto: "Could not send directly from the website. Your email app should open now with your message pre-filled.",
    err_name_required: "Please enter your name.",
    err_name_short: "Name should be at least 2 characters.",
    err_email_required: "Please enter your email address.",
    err_email_invalid: "Please enter a valid email address.",
    err_subject_required: "Please enter a subject.",
    err_subject_short: "Subject should be at least 4 characters.",
    err_message_required: "Please share a quick message.",
    err_message_short: "Message should be at least 12 characters.",
    mail_subject_prefix: "[Portfolio]",
  },
  fa: {
    sending: "در حال ارسال...",
    sent: "ارسال شد",
    call_request_subject: "درخواست رزرو تماس",
    call_request_message: "یک بازدیدکننده روی دکمه رزرو تماس کلیک کرد و درخواست تماس ارسال شد.",
    call_request_sent: "درخواست تماس به radmanqelichi@gmail.com ارسال شد",
    call_request_failed: "فعلاً ارسال انجام نشد. لطفاً به radmanqelichi@gmail.com ایمیل بزنید",
    submit_default: "ارسال پیام",
    thanks: "ممنون!",
    fix_fields: "لطفاً خطاهای فرم را اصلاح کنید و دوباره تلاش کنید.",
    sent_ok: "پیام با موفقیت ارسال شد. به‌زودی پاسخ می‌دهم.",
    fallback_mailto: "ارسال مستقیم از سایت انجام نشد. برنامه ایمیل شما با متن آماده باز می‌شود.",
    err_name_required: "لطفاً نام خود را وارد کنید.",
    err_name_short: "نام باید حداقل ۲ کاراکتر باشد.",
    err_email_required: "لطفاً ایمیل خود را وارد کنید.",
    err_email_invalid: "لطفاً یک ایمیل معتبر وارد کنید.",
    err_subject_required: "لطفاً موضوع را وارد کنید.",
    err_subject_short: "موضوع باید حداقل ۴ کاراکتر باشد.",
    err_message_required: "لطفاً یک پیام کوتاه بنویسید.",
    err_message_short: "پیام باید حداقل ۱۲ کاراکتر باشد.",
    mail_subject_prefix: "[پورتفولیو]",
  },
};

function getCurrentLanguage() {
  return document.documentElement.getAttribute("lang") === "fa" ? "fa" : "en";
}

function t(key) {
  const lang = getCurrentLanguage();
  const scoped = LANGUAGE_TEXT[lang] || LANGUAGE_TEXT.en;
  return scoped[key] || LANGUAGE_TEXT.en[key] || key;
}

function resolveSitePath(path) {
  return new URL(path, window.location.href).toString();
}

document.addEventListener("DOMContentLoaded", () => {
  if (isLowPowerDevice) {
    document.documentElement.classList.add("reduced-effects");
  }

  setupThemeToggle();
  setupScrollBehavior();
  setupMobileMenu();
  setupActiveNavLinks();
  initLanguageToggle();
  setupBookCallButton();
  setupInsightsPrefetch();
  setupCommandMenu();
  setupCredibilityWidgets();

  initWhenNearViewport("#contact", setupContactForm, "220px 0px");

  runWhenIdle(() => {
    setupTypedEffect();
    setupAnalyticsTracking();
    setupSectionReveal();
    setupCounters();
    setupWebVitalsReporting();
    setupModernInteractiveEffects();
    setupAmbientMotion();
    setupClsDebug();
  });
});

function runWhenIdle(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 400 });
    return;
  }

  window.setTimeout(callback, 1);
}

function initWhenNearViewport(selector, initCallback, rootMargin = "180px 0px") {
  const target = document.querySelector(selector);
  if (!target || typeof initCallback !== "function") {
    return;
  }

  let hasInitialized = false;
  let observer = null;

  const initialize = () => {
    if (hasInitialized) {
      return;
    }
    hasInitialized = true;
    initCallback();
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  if (!("IntersectionObserver" in window)) {
    runWhenIdle(initialize);
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initialize();
        }
      });
    },
    {
      rootMargin,
      threshold: 0.01,
    }
  );

  observer.observe(target);
}

function trackEvent(eventName, props = {}) {
  if (typeof window.plausible === "function") {
    window.plausible(eventName, { props });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, props);
  }
}

function setupClsDebug() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("clsdebug") !== "1") {
    return;
  }
  if (!("PerformanceObserver" in window)) {
    return;
  }

  let clsValue = 0;
  const badge = document.createElement("div");
  badge.setAttribute("aria-live", "polite");
  badge.style.position = "fixed";
  badge.style.right = "12px";
  badge.style.bottom = "12px";
  badge.style.zIndex = "99999";
  badge.style.padding = "8px 10px";
  badge.style.borderRadius = "10px";
  badge.style.background = "rgba(12,12,12,0.88)";
  badge.style.color = "#ffc107";
  badge.style.font = "600 12px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif";
  badge.style.border = "1px solid rgba(255,193,7,0.32)";
  badge.style.backdropFilter = "blur(6px)";
  badge.textContent = "CLS: 0.000";
  document.body.appendChild(badge);

  const elementLabel = (el) => {
    if (!(el instanceof Element)) {
      return "(unknown)";
    }
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim()
      ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };

  const debugStyle = document.createElement("style");
  debugStyle.textContent = `
    .cls-debug-shift {
      outline: 2px solid #ff3b30 !important;
      outline-offset: 2px !important;
      animation: clsShiftPulse 0.85s ease;
    }
    @keyframes clsShiftPulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.55); }
      100% { box-shadow: 0 0 0 12px rgba(255, 59, 48, 0); }
    }
  `;
  document.head.appendChild(debugStyle);

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.hadRecentInput) {
          return;
        }

        clsValue += entry.value;
        badge.textContent = `CLS: ${clsValue.toFixed(3)}`;
        const sources = Array.isArray(entry.sources) ? entry.sources : [];
        sources.forEach((source) => {
          if (!(source && source.node instanceof Element)) {
            return;
          }
          source.node.classList.remove("cls-debug-shift");
          // Force reflow so repeated shifts on the same element still animate.
          void source.node.offsetWidth;
          source.node.classList.add("cls-debug-shift");
          window.setTimeout(() => {
            source.node.classList.remove("cls-debug-shift");
          }, 950);
        });
        const mainSource = sources.length ? sources[0].node : null;
        const sourceText = elementLabel(mainSource);
        console.log("[CLS debug]", {
          delta: Number(entry.value.toFixed(4)),
          total: Number(clsValue.toFixed(4)),
          source: sourceText,
        });
      });
    });

    observer.observe({ type: "layout-shift", buffered: true });
  } catch (_error) {
    // Ignore browsers that block this API despite exposure.
  }
}

function setupModernInteractiveEffects() {
  if (prefersReducedMotion || document.documentElement.classList.contains("reduced-effects")) {
    return;
  }

  if (!window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  const targets = document.querySelectorAll(".skill-card, .project-card");
  if (!targets.length) {
    return;
  }

  const maxTilt = 6;

  targets.forEach((card) => {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    let frame = null;
    const reset = () => {
      card.classList.remove("modern-tilt-active");
      card.style.transform = "";
    };

    card.addEventListener("mouseenter", () => {
      card.classList.add("modern-tilt-active");
    });

    card.addEventListener("mousemove", (event) => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const px = x / rect.width - 0.5;
        const py = y / rect.height - 0.5;

        const rotateY = px * (maxTilt * 2);
        const rotateX = py * (maxTilt * -2);
        card.style.transform = `translateY(-8px) perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        frame = null;
      });
    });

    card.addEventListener("mouseleave", () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      reset();
    });
  });
}

function setupAmbientMotion() {
  if (prefersReducedMotion || document.documentElement.classList.contains("reduced-effects")) {
    return;
  }

  const hero = document.querySelector(".hero");
  if (!(hero instanceof HTMLElement)) {
    return;
  }

  let frame = null;
  window.addEventListener("pointermove", (event) => {
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
    }
    frame = window.requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      document.body.style.setProperty("--mouse-x", `${x.toFixed(2)}%`);
      document.body.style.setProperty("--mouse-y", `${y.toFixed(2)}%`);
      frame = null;
    });
  }, { passive: true });
}

function setupAnalyticsTracking() {
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const trackedElement = target.closest("[data-track]");
    if (trackedElement) {
      trackEvent(String(trackedElement.getAttribute("data-track") || "ui_click"), {
        href: String(trackedElement.getAttribute("href") || ""),
        text: String(trackedElement.textContent || "").trim().slice(0, 80),
      });
    }

    const link = target.closest("a[href]");
    if (!link) {
      return;
    }

    const href = link.getAttribute("href") || "";
    if (!href.startsWith("http")) {
      return;
    }

    try {
      if (new URL(href).origin !== window.location.origin) {
        trackEvent("outbound_link_click", { href });
      }
    } catch (_error) {
      // Ignore invalid links.
    }
  });
}

function setupInsightsPrefetch() {
  const insightsLink = document.querySelector('a[href="./insights/index.html"], a[href="insights/index.html"]');
  if (!(insightsLink instanceof HTMLAnchorElement)) {
    return;
  }

  let didPrefetch = false;
  const prefetch = () => {
    if (didPrefetch) {
      return;
    }
    didPrefetch = true;

    const hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = resolveSitePath("./insights/index.html");
    hint.as = "document";
    document.head.appendChild(hint);
  };

  insightsLink.addEventListener("pointerenter", prefetch, { once: true });
  insightsLink.addEventListener("focus", prefetch, { once: true });
  runWhenIdle(prefetch);
}

function setupBookCallButton() {
  const bookCallButton = document.querySelector('[data-track="cta_book_call"]');

  if (!bookCallButton) {
    return;
  }

  const defaultLabel = () => (bookCallButton.textContent || "").trim() || (getCurrentLanguage() === "fa" ? "رزرو جلسه" : "Book a Call");
  let isSent = false;
  const setLoadingState = (isLoading) => {
    bookCallButton.classList.toggle("is-sent", false);
    bookCallButton.classList.toggle("is-loading", isLoading);
    bookCallButton.disabled = isLoading;
    bookCallButton.setAttribute("aria-disabled", isLoading ? "true" : "false");
    bookCallButton.setAttribute("aria-busy", isLoading ? "true" : "false");
    bookCallButton.innerHTML = isLoading
      ? `<span class="loading-spinner" aria-hidden="true"></span>${t("sending")}`
      : defaultLabel();
  };
  const setSentState = () => {
    isSent = true;
    bookCallButton.disabled = true;
    bookCallButton.classList.remove("is-loading");
    bookCallButton.classList.add("is-sent");
    bookCallButton.setAttribute("aria-disabled", "true");
    bookCallButton.setAttribute("aria-busy", "false");
    bookCallButton.innerHTML = `${CALL_SENT_ICON}${t("sent")}`;
  };

  bookCallButton.addEventListener("click", async (event) => {
    event.preventDefault();
    if (bookCallButton.disabled) {
      return;
    }
    setLoadingState(true);

    try {
      const response = await fetch(resolveSitePath("./api/contact.php"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: "Website Visitor",
          email: "radmanqelichi@gmail.com",
          subject: t("call_request_subject"),
          message: t("call_request_message"),
          company: "",
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (_error) {
        data = null;
      }

      if (!response.ok || !data || data.ok !== true) {
        throw new Error("book_call_failed");
      }

      showSiteNotification(t("call_request_sent"), "success");
      trackEvent("book_call_request", { status: "success" });
      setSentState();
      await new Promise((resolve) => {
        window.setTimeout(resolve, 1000);
      });
    } catch (_error) {
      showSiteNotification(t("call_request_failed"), "error");
      trackEvent("book_call_request", { status: "failed" });
    } finally {
      if (!isSent) {
        setLoadingState(false);
      }
    }
  });
}

function setupWebVitalsReporting() {
  if (!("PerformanceObserver" in window)) {
    return;
  }

  let clsValue = 0;
  let lcpValue = 0;
  let inpValue = 0;
  let hasReported = false;

  const reportMetric = (name, value) => {
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    const rounded = Number(value.toFixed(2));
    let rating = "good";
    if (name === "LCP" && rounded > 2500) {
      rating = "needs-improvement";
    } else if (name === "CLS" && rounded > 0.1) {
      rating = "needs-improvement";
    } else if (name === "INP" && rounded > 200) {
      rating = "needs-improvement";
    }

    trackEvent("web_vital", { metric: name, value: rounded, rating });
  };

  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        lcpValue = lastEntry.startTime;
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch (_error) {
    // Older browsers may not support this entry type.
  }

  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch (_error) {
    // Older browsers may not support this entry type.
  }

  try {
    const inpObserver = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (entry.interactionId && entry.duration > inpValue) {
          inpValue = entry.duration;
        }
      });
    });
    inpObserver.observe({ type: "event", durationThreshold: 40, buffered: true });
  } catch (_error) {
    // Older browsers may not support this entry type.
  }

  const flushMetrics = () => {
    if (hasReported) {
      return;
    }
    hasReported = true;
    reportMetric("LCP", lcpValue);
    reportMetric("CLS", clsValue);
    reportMetric("INP", inpValue);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushMetrics();
    }
  });
  window.addEventListener("pagehide", flushMetrics, { once: true });
}

function showSiteNotification(message, kind) {
  const notificationId = "siteNotification";
  let notification = document.getElementById(notificationId);

  if (!notification) {
    notification = document.createElement("div");
    notification.id = notificationId;
    notification.className = "site-notice";
    notification.setAttribute("role", "status");
    notification.setAttribute("aria-live", "polite");
    document.body.appendChild(notification);
  }

  notification.textContent = message;
  notification.classList.remove("is-error", "is-success");
  notification.classList.add(kind === "error" ? "is-error" : "is-success", "is-visible");

  if (notification.hideTimer) {
    window.clearTimeout(notification.hideTimer);
  }

  notification.hideTimer = window.setTimeout(() => {
    notification.classList.remove("is-visible");
  }, 3600);
}

function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;

  if (!themeToggle) {
    return;
  }

  const updateThemeLabel = () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const label = currentTheme === "light" ? "Switch to dark mode" : "Switch to light mode";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  };

  updateThemeLabel();

  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeLabel();

    trackEvent("theme_toggled", { theme: newTheme });
  });
}

function setupScrollBehavior() {
  const navbar = document.querySelector(".navbar");
  const scrollBtn = document.getElementById("scrollTop");
  const scrollProgress = document.getElementById("scrollProgress");

  let lastKnownScrollY = window.scrollY;
  let isTicking = false;

  const updateScrollUi = () => {
    const documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
    const viewportHeight = window.innerHeight;
    const maxScrollableDistance = Math.max(documentHeight - viewportHeight, 1);

    if (navbar) {
      navbar.classList.toggle("scrolled", lastKnownScrollY > 50);
    }
    if (scrollBtn) {
      scrollBtn.classList.toggle("is-visible", lastKnownScrollY > 500);
    }
    if (scrollProgress) {
      const reachedBottom = Math.ceil(lastKnownScrollY + viewportHeight) >= documentHeight;
      const progress = reachedBottom ? 1 : Math.min(Math.max(lastKnownScrollY / maxScrollableDistance, 0), 1);
      scrollProgress.style.transform = `scaleX(${progress})`;
    }
  };

  const onScroll = () => {
    lastKnownScrollY = Math.max(window.scrollY, document.documentElement.scrollTop, document.body ? document.body.scrollTop : 0);
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(() => {
      updateScrollUi();
      isTicking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    lastKnownScrollY = Math.max(window.scrollY, document.documentElement.scrollTop, document.body ? document.body.scrollTop : 0);
    updateScrollUi();
  });
  window.addEventListener(
    "load",
    () => {
      lastKnownScrollY = Math.max(window.scrollY, document.documentElement.scrollTop, document.body ? document.body.scrollTop : 0);
      updateScrollUi();
    },
    { once: true }
  );
  lastKnownScrollY = Math.max(window.scrollY, document.documentElement.scrollTop, document.body ? document.body.scrollTop : 0);
  updateScrollUi();

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      trackEvent("scroll_to_top");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function setupMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = navMenu ? navMenu.querySelectorAll(".nav-link") : [];
  const mainContent = document.getElementById("main-content");
  const siteFooter = document.querySelector("footer");
  let previouslyFocusedElement = null;

  if (!hamburger || !navMenu) {
    return;
  }

  const closeMenu = () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("toggle");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    if (mainContent) {
      mainContent.removeAttribute("aria-hidden");
    }
    if (siteFooter) {
      siteFooter.removeAttribute("aria-hidden");
    }
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
      previouslyFocusedElement.focus();
      previouslyFocusedElement = null;
    }
  };

  const openMenu = () => {
    previouslyFocusedElement = document.activeElement;
    navMenu.classList.add("active");
    hamburger.classList.add("toggle");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
    }
    if (siteFooter) {
      siteFooter.setAttribute("aria-hidden", "true");
    }

    const focusableItems = getFocusableElements(navMenu);
    if (focusableItems.length) {
      focusableItems[0].focus();
    }
  };

  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("active");
    if (isOpen) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    const isMenuOpen = navMenu.classList.contains("active");
    if (!isMenuOpen) {
      return;
    }

    if (event.key === "Escape") {
      closeMenu();
      hamburger.focus();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableItems = getFocusableElements(navMenu);
    if (!focusableItems.length) {
      return;
    }

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  });
}

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("hidden"));
}

function setupActiveNavLinks() {
  const navLinks = document.querySelectorAll(".navbar .nav-link[href^='#']");

  if (!navLinks.length || !("IntersectionObserver" in window)) {
    return;
  }

  const linkBySectionId = new Map();
  navLinks.forEach((link) => {
    const target = link.getAttribute("href");
    if (!target || target.length <= 1) {
      return;
    }
    linkBySectionId.set(target.slice(1), link);
  });

  let activeSectionId = "";
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const nextActiveId = entry.target.id;
        if (nextActiveId === activeSectionId) {
          return;
        }

        const previousLink = activeSectionId ? linkBySectionId.get(activeSectionId) : null;
        if (previousLink) {
          previousLink.classList.remove("active");
          previousLink.removeAttribute("aria-current");
        }

        const nextLink = linkBySectionId.get(nextActiveId);
        if (nextLink) {
          nextLink.classList.add("active");
          nextLink.setAttribute("aria-current", "true");
          activeSectionId = nextActiveId;
        }
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.01,
    }
  );

  linkBySectionId.forEach((_link, sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      sectionObserver.observe(section);
    }
  });
}

function setupSectionReveal() {
  const sections = document.querySelectorAll(".fade-in-section");

  if (!sections.length) {
    return;
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("visible"));
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function setupCounters() {
  const counters = document.querySelectorAll(".counter[data-target]");

  if (!counters.length) {
    return;
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((counter) => {
      const target = Number(counter.getAttribute("data-target")) || 0;
      counter.textContent = getCounterValue(counter, target);
    });
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.75,
    }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(counter) {
  const target = Number(counter.getAttribute("data-target")) || 0;
  const durationMs = 1200;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / durationMs, 1);
    const eased = 1 - (1 - progress) ** 3;
    const currentValue = Math.round(target * eased);
    counter.textContent = getCounterValue(counter, currentValue);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
}

function getCounterValue(counter, value) {
  const prefix = counter.getAttribute("data-prefix") || "";
  const suffix = counter.getAttribute("data-suffix") || "";
  return `${prefix}${value}${suffix}`;
}

function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const submitButton = document.getElementById("contactSubmit");

  if (!contactForm || !formMessage || !submitButton) {
    return;
  }

  const defaultSubmitLabel = () => t("submit_default");
  const fields = [
    {
      name: "name",
      input: contactForm.querySelector("#name"),
      error: contactForm.querySelector("#nameError"),
      validate(value) {
        if (!value) {
          return t("err_name_required");
        }
        if (value.length < 2) {
          return t("err_name_short");
        }
        return "";
      },
    },
    {
      name: "email",
      input: contactForm.querySelector("#email"),
      error: contactForm.querySelector("#emailError"),
      validate(value) {
        if (!value) {
          return t("err_email_required");
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return t("err_email_invalid");
        }
        return "";
      },
    },
    {
      name: "subject",
      input: contactForm.querySelector("#subject"),
      error: contactForm.querySelector("#subjectError"),
      validate(value) {
        if (!value) {
          return t("err_subject_required");
        }
        if (value.length < 4) {
          return t("err_subject_short");
        }
        return "";
      },
    },
    {
      name: "message",
      input: contactForm.querySelector("#message"),
      error: contactForm.querySelector("#messageError"),
      validate(value) {
        if (!value) {
          return t("err_message_required");
        }
        if (value.length < 12) {
          return t("err_message_short");
        }
        return "";
      },
    },
  ].filter((field) => field.input && field.error);

  const setSubmitButtonState = (isLoading) => {
    submitButton.disabled = isLoading;
    submitButton.setAttribute("aria-busy", isLoading ? "true" : "false");
    submitButton.innerHTML = isLoading
      ? `<span class="loading-spinner" aria-hidden="true"></span>${t("sending")}`
      : `${SEND_ICON}${defaultSubmitLabel()}`;
  };

  const setFieldError = (field, message) => {
    field.error.textContent = message;
    field.input.classList.toggle("is-invalid", Boolean(message));
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
  };

  const validateField = (field) => {
    const value = String(field.input.value || "").trim();
    const error = field.validate(value);
    setFieldError(field, error);
    return !error;
  };

  const validateAllFields = () => {
    let firstInvalidField = null;
    let allValid = true;

    fields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid) {
        allValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field.input;
        }
      }
    });

    return { allValid, firstInvalidField };
  };

  fields.forEach((field) => {
    field.input.addEventListener("blur", () => {
      validateField(field);
    });
    field.input.addEventListener("input", () => {
      if (field.input.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const validation = validateAllFields();
    if (!validation.allValid) {
      showFormMessage(formMessage, t("fix_fields"), "error");
      if (validation.firstInvalidField) {
        validation.firstInvalidField.focus();
      }
      return;
    }

    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      company: String(formData.get("company") || "").trim(),
    };

    if (payload.company) {
      contactForm.reset();
      fields.forEach((field) => setFieldError(field, ""));
      showFormMessage(formMessage, t("thanks"), "success");
      return;
    }

    setSubmitButtonState(true);

    try {
      const endpoint = contactForm.getAttribute("action") || "/api/contact.php";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (_error) {
        data = null;
      }

      if (!response.ok || !data || data.ok !== true) {
        throw new Error("submit_failed");
      }

      showFormMessage(formMessage, t("sent_ok"), "success");
      trackEvent("contact_form_submit", { status: "success" });
      contactForm.reset();
      fields.forEach((field) => setFieldError(field, ""));
    } catch (_error) {
      const mailSubject = encodeURIComponent(`${t("mail_subject_prefix")} ${payload.subject}`);
      const mailBody = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);

      window.location.href = `mailto:radmanqelichi@gmail.com?subject=${mailSubject}&body=${mailBody}`;
      showFormMessage(
        formMessage,
        t("fallback_mailto"),
        "success"
      );
      trackEvent("contact_form_submit", { status: "mailto_fallback" });
    } finally {
      setSubmitButtonState(false);
    }
  });
}

function showFormMessage(formMessage, message, kind) {
  formMessage.textContent = message;
  formMessage.classList.remove("success", "error");
  formMessage.classList.add(kind, "show");
  formMessage.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
  if (kind === "error") {
    formMessage.focus();
  }
}

function reserveTypedTextSpace(typedElement, words) {
  const isFa = document.documentElement.getAttribute("lang") === "fa";

  if (isFa) {
    typedElement.style.width = "auto";
    return;
  }

  if (!words.length) {
    return;
  }

  const probe = document.createElement("span");
  const computedStyle = window.getComputedStyle(typedElement);

  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.whiteSpace = "nowrap";
  probe.style.fontFamily = computedStyle.fontFamily;
  probe.style.fontSize = computedStyle.fontSize;
  probe.style.fontWeight = computedStyle.fontWeight;
  probe.style.fontStyle = computedStyle.fontStyle;
  probe.style.letterSpacing = computedStyle.letterSpacing;
  probe.style.textTransform = computedStyle.textTransform;

  document.body.appendChild(probe);

  let maxWordWidth = 0;
  words.forEach((word) => {
    probe.textContent = word;
    maxWordWidth = Math.max(maxWordWidth, probe.getBoundingClientRect().width);
  });

  probe.remove();

  typedElement.style.width = `${Math.ceil(maxWordWidth + 14)}px`;
}

function setupTypedEffect() {
  const typedElement = document.querySelector(".typed-text");

  if (!typedElement) {
    return;
  }

  const initialLang = document.documentElement.getAttribute("lang") === "fa" ? "fa" : "en";
  const words = initialLang === "fa"
    ? ["رادمان قلیچی", "توسعه‌دهنده فول‌استک", "طراح رابط کاربری", "حل‌کننده مسائل"]
    : ["Radman Qelichi", "Full Stack Developer", "UI/UX Designer", "Problem Solver"];
  const currentVersion = ++typedEffectVersion;
  typedWordsState = words.slice();
  let resizeFrame = null;

  reserveTypedTextSpace(typedElement, typedWordsState.length ? typedWordsState : words);
  window.addEventListener("resize", () => {
    if (resizeFrame !== null) {
      window.cancelAnimationFrame(resizeFrame);
    }
    resizeFrame = window.requestAnimationFrame(() => {
      reserveTypedTextSpace(typedElement, typedWordsState.length ? typedWordsState : words);
      resizeFrame = null;
    });
  });

  if (prefersReducedMotion || document.documentElement.classList.contains("reduced-effects")) {
    typedElement.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    if (currentVersion !== typedEffectVersion) {
      return;
    }

    if (document.hidden) {
      window.setTimeout(tick, 250);
      return;
    }

    const activeWords = typedWordsState.length ? typedWordsState : words;
    const currentWord = activeWords[wordIndex % activeWords.length];
    charIndex += isDeleting ? -1 : 1;
    typedElement.textContent = currentWord.slice(0, charIndex);

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      window.setTimeout(tick, 1200);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % activeWords.length;
    }

    const baseDelay = isDeleting ? 40 : 75;
    const jitter = Math.floor(Math.random() * 20);
    window.setTimeout(tick, baseDelay + jitter);
  };

  window.setTimeout(tick, 350);
}

// Language Toggle
function initLanguageToggle() {
  const langToggle = document.getElementById('langToggle');
  const html = document.documentElement;
  
  if (!langToggle) return;
  
  // Get saved language or default to 'en'
  const savedLang = localStorage.getItem('language') || 'en';
  html.setAttribute('lang', savedLang);
  updateLanguage(savedLang);
  
  langToggle.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const option = target.closest('[data-set-lang]');
    if (option instanceof HTMLElement) {
      const nextLang = option.getAttribute('data-set-lang');
      if (nextLang === 'en' || nextLang === 'fa') {
        html.setAttribute('lang', nextLang);
        localStorage.setItem('language', nextLang);
        updateLanguage(nextLang);
      }
      return;
    }

    const currentLang = html.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'fa' : 'en';
    html.setAttribute('lang', newLang);
    localStorage.setItem('language', newLang);
    updateLanguage(newLang);
  });
}

function updateLanguage(lang) {
  const langToggle = document.getElementById('langToggle');
  const langOptions = langToggle?.querySelectorAll('.lang-option');

  langOptions?.forEach((option) => {
    const optionLang = option.getAttribute('data-set-lang');
    option.classList.toggle('is-active', optionLang === lang);
  });
  
  // Update all elements with data-en and data-fa attributes
  document.querySelectorAll('[data-en][data-fa]').forEach(element => {
    const text = element.getAttribute(`data-${lang}`);
    if (text !== null) {
      element.innerHTML = text;
    }
  });
  
  // Update typed text words based on language
  const typedElement = document.querySelector('.typed-text');
  if (typedElement) {
    const wordsEn = ["Radman Qelichi", "Full Stack Developer", "UI/UX Designer", "Problem Solver"];
    const wordsFa = ["رادمان قلیچی", "توسعه‌دهنده فول‌استک", "طراح رابط کاربری", "حل‌کننده مسائل"];
    const words = lang === 'en' ? wordsEn : wordsFa;
    typedWordsState = words.slice();
    // Reset typed text with new language
    typedElement.textContent = words[0];
    reserveTypedTextSpace(typedElement, words);
  }
  
  applyStrictLanguageContent(lang);

  // Update document direction
  document.body.style.direction = lang === 'fa' ? 'rtl' : 'ltr';
}

function applyStrictLanguageContent(lang) {
  const isFa = lang === "fa";

  const textMap = [
    [".about-target-box .target-item:nth-child(1) span:last-child", isFa ? "کدنویسی تمیز و قابل نگهداری" : "Clean, maintainable code"],
    [".about-target-box .target-item:nth-child(2) span:last-child", isFa ? "طراحی کاربرمحور" : "User-centered design"],
    [".about-target-box .target-item:nth-child(3) span:last-child", isFa ? "گردش کار چابک و اسپرینت" : "Agile workflow and sprints"],
    [".about-target-box .target-item:nth-child(4) span:last-child", isFa ? "یادگیری مداوم تکنولوژی‌های جدید" : "Always learning new tech"],
    ["#testimonials-title", isFa ? "نظر مشتریان" : "What clients say"],
    ["#testimonials .section-subtitle", isFa ? "اثباتی از اینکه طراحی باکیفیت و مهندسی تمیز نتیجه تجاری می‌سازد." : "Proof that design quality and clean engineering drive business results."],
    ["#insights-title", isFa ? "راهنماهای کاربردی" : "High-intent guides"],
    ["#insights .section-subtitle", isFa ? "مقاله‌های کاربردی برای انتشار سریع‌تر، سئوی بهتر و رشد اصولی." : "Practical articles to help teams ship faster, rank better, and scale cleanly."],
    [".insights-cta a[data-track=\"insight_view_all\"]", isFa ? "مشاهده همه راهنماها" : "View all guides"],
    ["#faq-title", isFa ? "سوالات متداول" : "Frequently asked questions"],
    ["#faq .section-subtitle", isFa ? "پاسخ‌های سریع درباره روند، زمان‌بندی و همکاری." : "Quick answers about process, timeline, and collaboration."],
    ["#faq .faq-cta .btn", isFa ? "سوال خود را بپرسید" : "Ask your question"],
    ["#contact .info-item:nth-child(2) h4", isFa ? "مشاهده سایت" : "Check out"],
    ["#contact .info-item:nth-child(2) a", isFa ? "وب‌سایت تکناو" : "teknav.ir"],
    ["#contact .info-item:nth-child(3) h4", isFa ? "موقعیت" : "Based in"],
    ["#contact .info-item:nth-child(3) p", isFa ? "مشهد، ایران" : "Iran, Mashhad"],
    ["#contactForm .hp-field label", isFa ? "شرکت" : "Company"],
    ["label[for=\"name\"]", isFa ? "نام شما چیست؟" : "What's your name?"],
    ["label[for=\"email\"]", isFa ? "ایمیل شما" : "Your email address"],
    ["label[for=\"subject\"]", isFa ? "موضوع چیست؟" : "What's this about?"],
    ["label[for=\"message\"]", isFa ? "توضیحات بیشتر" : "Tell me more"],
    ["#contactSubmit", isFa ? `${SEND_ICON}ارسال پیام` : `${SEND_ICON}Send Message`],
    [".form-note", isFa ? 'ایمیل مستقیم ترجیح می‌دهید؟ به <a href="mailto:radmanqelichi@gmail.com">radmanqelichi@gmail.com</a> ایمیل بزنید' : 'Prefer direct email? Write to <a href="mailto:radmanqelichi@gmail.com">radmanqelichi@gmail.com</a>'],
    [".footer-brand h3", isFa ? "رادمان قلیچی" : "Radman Qelichi"],
    [".footer-brand p", isFa ? "توسعه‌دهنده فول‌استک در مشهد، ایران | ساخت تجربه‌های دیجیتال اثرگذار" : "Full-Stack Developer in Mashhad, Iran | Building digital experiences that make a difference."],
    [".footer-section:nth-child(2) ul li:nth-child(1) a", isFa ? "ایمیل" : "Email"],
    [".footer-section:nth-child(2) ul li:nth-child(2) a", isFa ? "گیت‌هاب" : "GitHub"],
    [".footer-section:nth-child(2) ul li:nth-child(3) a", isFa ? "تکناو" : "Teknav"],
    [".footer-section:nth-child(2) ul li:nth-child(4) a", isFa ? "فیگما" : "Figma"],
    [".footer-section:nth-child(2) ul li:nth-child(5) a", isFa ? "تلگرام" : "Telegram"],
    [".footer-section:nth-child(2) ul li:nth-child(6) a", isFa ? "دانلود رزومه" : "Download CV"],
    [".footer-section:nth-child(3) h4", isFa ? "دوستان برنامه‌نویس" : "Friends in Code"],
    [".footer-bottom p", isFa ? "© 2026 رادمان قلیچی - توسعه‌دهنده فول‌استک ایران" : "© 2026 Radman Qelichi - Full-Stack Developer Iran"],
    [".mobile-cta-item--primary", isFa ? "رزرو تماس" : "Book Call"],
    [".mobile-cta-item[data-track=\"mobile_cta_telegram\"]", isFa ? "تلگرام" : "Telegram"],
    [".mobile-cta-item[data-track=\"mobile_cta_email\"]", isFa ? "ایمیل" : "Email"],
    [".hero-intro", isFa ? "سلام، من " : "Hey, I'm "],
    [".hero-outro", isFa ? " هستم" : ""],
    [".footer-badges span:nth-child(1)", isFa ? "تحویل سریع" : "Fast Delivery"],
    [".footer-badges span:nth-child(2)", isFa ? "کد تمیز" : "Clean Code"],
    [".footer-badges span:nth-child(3)", isFa ? "سئوی فنی" : "SEO Focused"],
  ];

  textMap.forEach(([selector, text]) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.innerHTML = text;
  });

  const skillTitlesEn = [
    "Frontend Development",
    "UI/UX Design",
    "Backend Development",
    "Mobile Development",
    "DevOps & Cloud",
    "Performance & Analytics",
  ];
  const skillTitlesFa = [
    "توسعه فرانت‌اند",
    "طراحی رابط و تجربه کاربری",
    "توسعه بک‌اند",
    "توسعه موبایل",
    "دوآپس و کلاد",
    "عملکرد و تحلیل داده",
  ];
  document.querySelectorAll("#skills .skill-card h3").forEach((item, index) => {
    item.textContent = isFa ? skillTitlesFa[index] || item.textContent : skillTitlesEn[index] || item.textContent;
  });

  const skillDescriptionsEn = [
    "I build responsive, interactive interfaces using React, Vue, and TypeScript. Performance and user experience are always top priorities.",
    "Good design isn't just about looking pretty, it's about solving problems. I create interfaces that people actually enjoy using.",
    "From APIs to databases, I handle the server-side stuff. Building scalable, secure systems is what I do.",
    "Cross-platform apps that work smoothly on iOS and Android. React Native is my go-to for mobile projects.",
    "Deploying, monitoring, and scaling applications. I work with AWS, Docker, and modern CI/CD pipelines.",
    "Making things fast and tracking what matters. I optimize apps and use data to make smart decisions.",
  ];
  const skillDescriptionsFa = [
    "رابط‌های واکنش‌گرا و تعاملی با ری‌اکت، ویو و تایپ‌اسکریپت می‌سازم. عملکرد و تجربه کاربری همیشه اولویت اصلی من است.",
    "طراحی خوب فقط ظاهر زیبا نیست؛ حل مسئله است. رابط‌هایی می‌سازم که کاربر از استفاده آن لذت ببرد.",
    "از رابط برنامه‌نویسی تا پایگاه‌داده، بخش سرور را کامل مدیریت می‌کنم. ساخت سیستم‌های امن و مقیاس‌پذیر تخصص من است.",
    "اپلیکیشن‌های کراس‌پلتفرم روان برای آی‌اواس و اندروید توسعه می‌دهم و ری‌اکت نیتیو ابزار اصلی من است.",
    "استقرار، مانیتورینگ و مقیاس‌پذیری اپلیکیشن‌ها را با سرویس‌های ابری، داکر و خط استقرار خودکار انجام می‌دهم.",
    "سرعت و داده برای من مهم است؛ اپلیکیشن را بهینه می‌کنم و تصمیم‌های فنی را با تحلیل داده می‌گیرم.",
  ];
  document.querySelectorAll("#skills .skill-card p").forEach((item, index) => {
    item.textContent = isFa ? skillDescriptionsFa[index] || item.textContent : skillDescriptionsEn[index] || item.textContent;
  });

  const projectButtonsEn = ["Read Case Study", "Code Samples", "Visit Site"];
  const projectButtonsFa = ["مطالعه کیس‌استادی", "نمونه کد", "مشاهده سایت"];
  document.querySelectorAll("#projects .project-link").forEach((item) => {
    const text = (item.textContent || "").trim();
    if (isFa) {
      if (text.includes("Read Case Study")) item.textContent = projectButtonsFa[0];
      if (text.includes("Code Samples")) item.textContent = projectButtonsFa[1];
      if (text.includes("Visit Site")) item.textContent = projectButtonsFa[2];
    } else {
      if (text.includes(projectButtonsFa[0])) item.textContent = projectButtonsEn[0];
      if (text.includes(projectButtonsFa[1])) item.textContent = projectButtonsEn[1];
      if (text.includes(projectButtonsFa[2])) item.textContent = projectButtonsEn[2];
    }
  });

  const insightsReadLinks = document.querySelectorAll("#insights .project-link");
  insightsReadLinks.forEach((item) => {
    if (item.closest(".insights-cta")) {
      item.textContent = isFa ? "مشاهده همه راهنماها" : "View all guides";
    } else {
      item.textContent = isFa ? "مطالعه راهنما" : "Read Guide";
    }
  });

  // Projects section translations (fixes FA blank text after skills)
  const projectTitlesEn = [
    "Social Media Dashboard",
    "E-Commerce Platform",
    "teknav.ir",
    "Analytics Dashboard",
    "Learning Management System",
    "teknavglobal.com",
  ];
  const projectTitlesFa = [
    "داشبورد شبکه‌های اجتماعی",
    "پلتفرم فروشگاه آنلاین",
    "پروژه تکناو",
    "داشبورد تحلیل داده",
    "سیستم مدیریت آموزش",
    "پروژه تکناوگلوبال",
  ];
  const projectDescriptionsEn = [
    "Built a dashboard for managing multiple social media accounts in one place. Real-time analytics, scheduling posts, and performance tracking—all the good stuff.",
    "Full-featured online marketplace with payment processing, inventory management, and a smooth checkout experience. Handles thousands of products without breaking a sweat.",
    "Modern e-commerce solution for tech hardware, featuring an advanced filtering engine and real-time inventory.",
    "Real-time data visualization tool for business metrics. Clean charts, custom reports, and data that actually makes sense to non-technical users.",
    "Online education platform with video courses, quizzes, progress tracking, and certificates. Think Udemy, but custom-built for a specific client.",
    "Big project I'm working on right now—a global tech solutions platform. Can't say too much yet, but it's going to be pretty cool when it's done.",
  ];
  const projectDescriptionsFa = [
    "داشبوردی برای مدیریت چندین حساب شبکه اجتماعی در یک محیط یکپارچه؛ شامل تحلیل لحظه‌ای، زمان‌بندی پست و پایش عملکرد.",
    "یک مارکت‌پلیس کامل با پرداخت آنلاین، مدیریت موجودی و فرآیند خرید روان که توان مدیریت هزاران محصول را دارد.",
    "راهکار فروشگاهی مدرن برای تجهیزات فناوری با موتور فیلتر پیشرفته و موجودی لحظه‌ای.",
    "ابزار مصورسازی داده‌های کسب‌وکار در لحظه با نمودارهای خوانا، گزارش‌های سفارشی و خروجی قابل فهم برای تیم‌های غیرتکنیکال.",
    "پلتفرم آموزش آنلاین با ویدئو، آزمون، پیگیری پیشرفت و گواهی؛ شبیه سامانه‌های آموزشی بزرگ اما سفارشی برای نیاز مشتری.",
    "پروژه در حال توسعه برای یک پلتفرم جهانی راهکارهای فناوری؛ جزئیات بیشتر به‌زودی منتشر می‌شود.",
  ];
  document.querySelectorAll("#projects .project-card .project-content h3").forEach((item, index) => {
    item.textContent = isFa ? projectTitlesFa[index] || item.textContent : projectTitlesEn[index] || item.textContent;
  });
  document.querySelectorAll("#projects .project-card .project-content p").forEach((item, index) => {
    item.textContent = isFa ? projectDescriptionsFa[index] || item.textContent : projectDescriptionsEn[index] || item.textContent;
  });

  // Testimonials section translations
  const testimonialsQuoteEn = [
    "\"Radman Qelichi turned our rough concept into a polished dashboard our team uses every day. The UX decisions saved us weeks of onboarding.\"",
    "\"Fast delivery, clean code, and proactive communication. We saw an immediate lift in lead quality after launch.\"",
    "\"From wireframes to deployment, everything was handled with strong attention to detail. Exactly what we needed for a serious product.\"",
  ];
  const testimonialsQuoteFa = [
    "\"رادمان قلیچی ایده خام ما را به یک داشبورد حرفه‌ای تبدیل کرد که تیم ما هر روز از آن استفاده می‌کند. تصمیم‌های تجربه کاربری باعث صرفه‌جویی چشمگیر در زمان آموزش شد.\"",
    "\"تحویل سریع، کد تمیز و ارتباط حرفه‌ای؛ بعد از لانچ، کیفیت لیدهای ما به‌صورت محسوس بهتر شد.\"",
    "\"از وایرفریم تا استقرار، همه‌چیز با دقت بالا انجام شد؛ دقیقاً همان چیزی که برای یک محصول جدی نیاز داشتیم.\"",
  ];
  const testimonialsRoleEn = ["Product Manager", "Marketing Lead", "Founder"];
  const testimonialsRoleFa = ["مدیر محصول", "مدیر بازاریابی", "بنیان‌گذار"];
  const testimonialsCompanyEn = ["SaaS Analytics Startup", "B2B Services Company", "EdTech Platform"];
  const testimonialsCompanyFa = ["استارتاپ تحلیل نرم‌افزار", "شرکت خدمات سازمانی", "پلتفرم آموزش دیجیتال"];
  document.querySelectorAll("#testimonials .testimonial-card p").forEach((item, index) => {
    item.textContent = isFa ? testimonialsQuoteFa[index] || item.textContent : testimonialsQuoteEn[index] || item.textContent;
  });
  document.querySelectorAll("#testimonials .testimonial-card h3").forEach((item, index) => {
    item.textContent = isFa ? testimonialsRoleFa[index] || item.textContent : testimonialsRoleEn[index] || item.textContent;
  });
  document.querySelectorAll("#testimonials .testimonial-card span").forEach((item, index) => {
    item.textContent = isFa ? testimonialsCompanyFa[index] || item.textContent : testimonialsCompanyEn[index] || item.textContent;
  });

  // Insights section translations
  const insightTitlesEn = [
    "Web Developer in Iran: What to look for before hiring",
    "React performance optimization for production apps",
    "Python backend architecture that scales",
    "CloudLinux deployment checklist for portfolio and SaaS sites",
    "How to hire a freelance full-stack developer in Iran",
    "Technical SEO for JavaScript-heavy websites",
  ];
  const insightTitlesFa = [
    "توسعه‌دهنده وب در ایران: قبل از استخدام به چه نکاتی توجه کنیم",
    "بهینه‌سازی عملکرد ری‌اکت برای اپلیکیشن‌های واقعی",
    "معماری بک‌اند پایتون برای مقیاس‌پذیری",
    "چک‌لیست استقرار کلاد لینوکس برای سایت‌های نمونه‌کار و محصولات نرم‌افزاری",
    "چطور یک توسعه‌دهنده فول‌استک فریلنس در ایران استخدام کنیم",
    "سئوی فنی برای وب‌سایت‌های جاوااسکریپت محور",
  ];
  const insightDescEn = [
    "A practical hiring checklist for founders and product teams who need delivery speed without quality tradeoffs.",
    "How to reduce JavaScript cost, protect Core Web Vitals, and keep React experiences fast at scale.",
    "A clean approach to APIs, data access, background jobs, and observability for growing products.",
    "A deployment workflow to improve uptime, security headers, caching policy, and release confidence.",
    "Interview questions, delivery milestones, and quality signals to reduce hiring risk and rework.",
    "Quick wins for crawlability, structured data, performance budgets, and measurable organic growth.",
  ];
  const insightDescFa = [
    "چک‌لیست کاربردی استخدام برای بنیان‌گذاران و تیم‌های محصول که به تحویل سریع بدون افت کیفیت نیاز دارند.",
    "روش کاهش هزینه جاوااسکریپت، حفظ شاخص‌های حیاتی وب و سریع نگه‌داشتن تجربه ری‌اکت در مقیاس.",
    "رویکردی تمیز برای رابط برنامه‌نویسی، لایه داده، پردازش پس‌زمینه و مانیتورینگ در محصولات در حال رشد.",
    "جریان استقرار برای بهبود پایداری، هدرهای امنیتی، سیاست کش و اطمینان در انتشار نسخه.",
    "سوالات مصاحبه، مایلستون‌های تحویل و شاخص‌های کیفیت برای کاهش ریسک استخدام و دوباره‌کاری.",
    "بهبودهای سریع برای خزش‌پذیری، داده ساختاریافته، بودجه عملکرد و رشد ارگانیک قابل اندازه‌گیری.",
  ];
  document.querySelectorAll("#insights .insight-card h3").forEach((item, index) => {
    item.textContent = isFa ? insightTitlesFa[index] || item.textContent : insightTitlesEn[index] || item.textContent;
  });
  document.querySelectorAll("#insights .insight-card p").forEach((item, index) => {
    item.textContent = isFa ? insightDescFa[index] || item.textContent : insightDescEn[index] || item.textContent;
  });

  // FAQ section translations
  const faqQEn = [
    "How quickly can we start a project?",
    "Do you only work with clients in Iran?",
    "Can you improve an existing product instead of rebuilding it?",
    "What tech stacks do you usually use?",
    "How do you report progress?",
    "What is your typical engagement model?",
  ];
  const faqQFa = [
    "چقدر سریع می‌توانیم پروژه را شروع کنیم؟",
    "فقط با مشتریان داخل ایران کار می‌کنید؟",
    "می‌توانید محصول فعلی را بهبود دهید بدون بازسازی کامل؟",
    "معمولاً از چه استک‌هایی استفاده می‌کنید؟",
    "گزارش پیشرفت را چطور ارائه می‌دهید؟",
    "مدل همکاری معمول شما چیست؟",
  ];
  const faqAEn = [
    "Most projects can start within 3 to 7 days after a discovery call and scope confirmation.",
    "No. I work with teams in Iran and internationally, with async-friendly communication and clear delivery cycles.",
    "Yes. I often optimize existing codebases for speed, UX clarity, and conversion before suggesting major rewrites.",
    "Python and Node.js for backend, React/Next.js or Vue for frontend, plus PostgreSQL/Redis and cloud deployment workflows.",
    "I share structured weekly updates with milestones, blockers, performance numbers, and next sprint priorities.",
    "Fixed-scope projects, monthly retainers, and dedicated sprint-based product development are all available.",
  ];
  const faqAFa = [
    "بیشتر پروژه‌ها بعد از جلسه اولیه و نهایی شدن محدوده، بین ۳ تا ۷ روز قابل شروع هستند.",
    "خیر. با تیم‌های داخل ایران و بین‌المللی همکاری می‌کنم و روند ارتباط/تحویل شفاف دارم.",
    "بله. قبل از پیشنهاد بازنویسی کامل، معمولاً کد فعلی را از نظر سرعت، تجربه کاربری و نرخ تبدیل بهینه می‌کنم.",
    "برای بک‌اند معمولاً پایتون و نود جی‌اس، برای فرانت‌اند ری‌اکت یا ویو و برای داده پستگرس و ردیس.",
    "هر هفته گزارش ساختاریافته شامل مایلستون، چالش‌ها، شاخص‌های عملکرد و برنامه اسپرینت بعدی ارائه می‌دهم.",
    "هم پروژه ثابت، هم ریتینر ماهانه و هم همکاری مبتنی بر اسپرینت قابل ارائه است.",
  ];
  document.querySelectorAll("#faq .faq-card h3").forEach((item, index) => {
    item.textContent = isFa ? faqQFa[index] || item.textContent : faqQEn[index] || item.textContent;
  });
  document.querySelectorAll("#faq .faq-card p").forEach((item, index) => {
    item.textContent = isFa ? faqAFa[index] || item.textContent : faqAEn[index] || item.textContent;
  });

  const formPlaceholders = {
    name: isFa ? "مثلاً: علی" : "David",
    email: isFa ? "ایمیل@نمونه.کام" : "david@example.com",
    subject: isFa ? "درخواست پروژه / همکاری / سوال" : "Project inquiry / Job offer / Just saying hi",
    message: isFa ? "سلام رادمان، یک ایده برای پروژه دارم..." : "Hey Radman Qelichi, I have this idea...",
  };
  Object.entries(formPlaceholders).forEach(([fieldId, placeholder]) => {
    const field = document.getElementById(fieldId);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.setAttribute("placeholder", placeholder);
    }
  });
}

function setupCommandMenu() {
  const toggle = document.getElementById("commandToggle");
  const menu = document.getElementById("commandMenu");
  const backdrop = document.getElementById("commandBackdrop");
  const closeButton = document.getElementById("commandClose");
  if (!(toggle instanceof HTMLElement) || !(menu instanceof HTMLElement) || !(backdrop instanceof HTMLElement)) {
    return;
  }

  const closeMenu = () => {
    menu.hidden = true;
    backdrop.hidden = true;
  };

  const openMenu = () => {
    menu.hidden = false;
    backdrop.hidden = false;
  };

  toggle.addEventListener("click", openMenu);
  if (closeButton instanceof HTMLElement) {
    closeButton.addEventListener("click", closeMenu);
  }
  backdrop.addEventListener("click", closeMenu);

  menu.addEventListener("click", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    const command = target?.getAttribute("data-command");
    if (!command) return;

    if (command === "projects") location.hash = "#projects";
    if (command === "contact") location.hash = "#contact";
    if (command === "cv") window.open(resolveSitePath("./radman-qelichi-cv.pdf?v=20260503"), "_blank", "noopener");
    if (command === "github") window.open("https://github.com/RADIREX666", "_blank", "noopener");
    if (command === "theme") document.getElementById("themeToggle")?.click();
    if (command === "lang") document.getElementById("langToggle")?.click();
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (menu.hidden) openMenu();
      else closeMenu();
    }
    if (event.key === "Escape" && !menu.hidden) {
      closeMenu();
    }
  });
}

async function setupCredibilityWidgets() {
  const section = document.getElementById("credibility");
  if (!(section instanceof HTMLElement)) {
    return;
  }
  const username = section.getAttribute("data-github-user") || "RADIREX666";
  const eventsNode = document.getElementById("githubEvents");
  const streakNode = document.getElementById("streakValue");
  if (!(eventsNode instanceof HTMLElement) || !(streakNode instanceof HTMLElement)) {
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) {
      throw new Error("github fetch failed");
    }
    const events = await response.json();
    const count = Array.isArray(events) ? events.length : 0;
    eventsNode.textContent = String(count);

    let streak = 0;
    let cursor = new Date();
    const activeDays = new Set(
      (Array.isArray(events) ? events : [])
        .map((event) => (event && event.created_at ? String(event.created_at).slice(0, 10) : ""))
        .filter(Boolean)
    );
    for (let index = 0; index < 30; index += 1) {
      const key = cursor.toISOString().slice(0, 10);
      if (activeDays.has(key)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    streakNode.textContent = String(streak);
  } catch (_error) {
    eventsNode.textContent = "N/A";
    streakNode.textContent = "N/A";
  }
}
