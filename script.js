const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const year = document.querySelector("[data-year]");
const copyButton = document.querySelector("[data-copy-email]");
const toast = document.querySelector("[data-toast]");

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
