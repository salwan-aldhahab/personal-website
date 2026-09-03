// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ── Nav active-section highlighting ──────────────────────────
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function highlightNav() {
  const scrollPos = window.scrollY + 120;
  let activeId = sections.length ? sections[0].id : null;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const hrefId = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("is-active", hrefId === activeId);
  });
}

// ── Scroll progress bar ──────────────────────────────────────
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function updateProgress() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(ratio, 1)})`;
}

// ── Back-to-top button ───────────────────────────────────────
const toTop = document.createElement("button");
toTop.className = "to-top";
toTop.type = "button";
toTop.setAttribute("aria-label", "Back to top");
toTop.innerHTML =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
document.body.appendChild(toTop);

toTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
});

function updateToTop() {
  toTop.classList.toggle("is-shown", window.scrollY > 500);
}

// ── Single throttled scroll handler ──────────────────────────
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    highlightNav();
    updateProgress();
    updateToTop();
    ticking = false;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateProgress, { passive: true });

// ── Reveal-on-scroll ─────────────────────────────────────────
// Only wire this up when motion is welcome; otherwise everything
// stays visible (no .reveal class is ever added).
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const cards = Array.from(document.querySelectorAll(".card--project"));
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
  });

  const revealTargets = [
    ...document.querySelectorAll("#about, #contact"),
    ...document.querySelectorAll("#projects .section__header"),
    ...cards,
  ];

  revealTargets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        obs.unobserve(el);
        // Drop the stagger delay once revealed so hover stays snappy.
        const delayMs = parseFloat(el.style.transitionDelay) || 0;
        window.setTimeout(() => {
          el.style.transitionDelay = "";
        }, 650 + delayMs);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
}

// Initial paint
highlightNav();
updateProgress();
updateToTop();
