const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".landing-menu");
const year = document.querySelector("[data-year]");
const copyButton = document.querySelector("[data-copy-email]");
const toast = document.querySelector("[data-toast]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("open");
  document.body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -24px" }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (element.closest(".landing-hero")) element.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
  observer.observe(element);
});

year.textContent = new Date().getFullYear();

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("TiaraWicoff@gmail.com");
  } catch {
    const input = document.createElement("textarea");
    input.value = "TiaraWicoff@gmail.com";
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 1800);
});

if (!reducedMotion) {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const titleLines = [...document.querySelectorAll(".title-line")];
  let scrollFrame;
  const updateMotion = () => {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${scrollRange > 0 ? window.scrollY / scrollRange : 0})`;

    if (window.scrollY < window.innerHeight && titleLines.every((line) => line.classList.contains("visible"))) {
      titleLines.forEach((line, index) => {
        line.style.transform = `translate3d(0, ${window.scrollY * (0.018 + index * 0.012)}px, 0)`;
      });
    }
    scrollFrame = null;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateMotion);
    },
    { passive: true }
  );
  updateMotion();

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--rx", `${-y * 2.2}deg`);
        card.style.setProperty("--ry", `${x * 2.2}deg`);
        card.style.setProperty("--image-x", `${-x * 5}px`);
        card.style.setProperty("--image-y", `${-y * 5}px`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--image-x", "0px");
        card.style.setProperty("--image-y", "0px");
      });
    });
  }
}
