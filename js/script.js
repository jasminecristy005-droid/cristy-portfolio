/* =========================================================
   MOBILE NAVIGATION — HAMBURGER MENU
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", () => {

        const isOpen = mobileMenu.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

    });

    /* Close menu after clicking a navigation link */

    mobileMenuLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );

        });

    });

}