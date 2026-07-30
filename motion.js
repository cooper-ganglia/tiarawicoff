const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

if (!motionReduced) {
  const progressBar = document.createElement("div");
  progressBar.className = "page-progress";
  progressBar.setAttribute("aria-hidden", "true");
  document.body.appendChild(progressBar);

  const heroImage =
    document.querySelector(".service-hero .hero-photo") ||
    document.querySelector(".about-hero .hero-visual > img");

  let motionFrame;
  const renderScrollMotion = () => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;

    if (heroImage && window.scrollY < window.innerHeight * 1.15) {
      const isAboutPortrait = Boolean(heroImage.closest(".about-hero"));
      if (isAboutPortrait) {
        const portraitDrift = Math.min(window.scrollY * 0.12, 48);
        heroImage.style.transform = `translate3d(0, ${-portraitDrift}px, 0) scale(1.025)`;
      } else {
        heroImage.style.transform = `translate3d(0, ${window.scrollY * 0.075}px, 0) scale(1.035)`;
      }
    }
    motionFrame = null;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!motionFrame) motionFrame = window.requestAnimationFrame(renderScrollMotion);
    },
    { passive: true }
  );
  renderScrollMotion();

  const revealTargets = document.querySelectorAll(
    [
      ".service-statement .statement-copy > *",
      ".offering",
      ".scope-list span",
      ".feature-copy > *",
      ".process-grid article",
      ".service-contact > *",
      ".about-intro > *",
      ".intro-columns > *",
      ".experience-banner > div",
      ".experience-list article",
      ".visual-story > *",
      ".about-values > div > *",
      ".value-grid article",
      ".about-cta > *"
    ].join(",")
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("motion-reveal");
    element.style.setProperty("--motion-delay", `${(index % 4) * 65}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("motion-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px" }
  );
  revealTargets.forEach((element) => revealObserver.observe(element));

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".offering, .experience-list article").forEach((item) => {
      let currentX = item.clientWidth / 2;
      let currentY = item.clientHeight / 2;
      let targetX = currentX;
      let targetY = currentY;
      let pointerFrame;

      const easePointer = () => {
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;
        item.style.setProperty("--pointer-x", `${currentX}px`);
        item.style.setProperty("--pointer-y", `${currentY}px`);

        if (Math.abs(targetX - currentX) > 0.15 || Math.abs(targetY - currentY) > 0.15) {
          pointerFrame = window.requestAnimationFrame(easePointer);
        } else {
          pointerFrame = null;
        }
      };

      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        targetX = event.clientX - rect.left;
        targetY = event.clientY - rect.top;
        item.classList.add("pointer-active");
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(easePointer);
      });
      item.addEventListener("pointerleave", () => {
        item.classList.remove("pointer-active");
        targetX = item.clientWidth / 2;
        targetY = item.clientHeight / 2;
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(easePointer);
      });
    });
  }
}
