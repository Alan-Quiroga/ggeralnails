  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.toggle("show");
      });
    }

    // Opcional: cerrar menú al hacer clic en un link
    const links = menu.querySelectorAll(".nav-link");
    links.forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("show");
      });
    });
  });
