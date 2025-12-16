const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function highlightNav() {
  const scrollPos = window.scrollY + 120;
  let activeId = "home";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const hrefId = link.getAttribute("href")?.replace("#", "");
    if (hrefId === activeId) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
}

window.addEventListener("scroll", highlightNav);
highlightNav();
