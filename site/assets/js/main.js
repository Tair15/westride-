// Shared site behavior. No jQuery, no Bootstrap — vanilla only.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  const open = () => menu.classList.remove("hidden");
  const close = () => menu.classList.add("hidden");
  const isOpen = () => !menu.classList.contains("hidden");

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  // Close when clicking outside the menu/toggle.
  document.addEventListener("click", (e) => {
    if (isOpen() && !menu.contains(e.target) && e.target !== toggle) close();
  });

  // Close when the viewport grows past the nav breakpoint (1100px).
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1100) close();
  });
});

// Contact page: reveal the input fields only after a contact type is chosen
// (mirrors insclicks.com/contactus.php behavior). Vanilla, no framework.
document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("contact-select-type");
  const inputs = document.getElementById("form-inputs");
  if (!typeSelect || !inputs) return;

  const sync = () => {
    const chosen = typeSelect.value && typeSelect.value !== "select";
    inputs.classList.remove("hidden");
    inputs.style.display = chosen ? "flex" : "none";
    // Required fields only enforced once visible.
    inputs.querySelectorAll("[data-required]").forEach((el) => {
      if (chosen) el.setAttribute("required", "");
      else el.removeAttribute("required");
    });
  };

  typeSelect.addEventListener("change", sync);
  sync();
});
