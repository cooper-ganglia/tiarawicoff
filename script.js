const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const year = document.querySelector("[data-year]");
const copyButton = document.querySelector("[data-copy-email]");
const toast = document.querySelector("[data-toast]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -24px" }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (element.closest(".hero")) {
    element.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  }
  revealObserver.observe(element);
});

const packageCards = [...document.querySelectorAll(".package-card")];

packageCards.forEach((card) => {
  card.querySelectorAll(".package-details li").forEach((item, index) => {
    item.style.setProperty("--package-item", index);
  });
});

if (!reducedMotion && packageCards.length) {
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    packageCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--package-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--package-y", `${event.clientY - bounds.top}px`);
        card.classList.add("package-active");
      });

      card.addEventListener("pointerleave", () => {
        card.classList.remove("package-active");
      });
    });
  }
}

year.textContent = new Date().getFullYear();

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("TiaraWicoff@gmail.com");
  } catch {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = "TiaraWicoff@gmail.com";
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
  }

  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 1800);
});
