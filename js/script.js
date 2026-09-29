/* =========================================================
   CRISTY DEVELLERES — PORTFOLIO JAVASCRIPT
   ========================================================= */


/* =========================================================
   01. MOBILE MENU
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", () => {

        const isOpen = mobileMenu.classList.toggle("is-open");

        mobileMenu.style.display = isOpen ? "block" : "none";

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        document.body.style.overflow = isOpen ? "hidden" : "";
    });


    mobileLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("is-open");

            mobileMenu.style.display = "none";

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.style.overflow = "";
        });

    });
}


/* =========================================================
   02. LUMACARE PROJECT SLIDESHOW
   ========================================================= */

const slideshowImages = document.querySelectorAll(
    ".project-slideshow img"
);

if (slideshowImages.length > 1) {

    let currentSlide = 0;

    setInterval(() => {

        slideshowImages[currentSlide].style.opacity = "0";

        currentSlide =
            (currentSlide + 1) % slideshowImages.length;

        slideshowImages[currentSlide].style.opacity = "1";

    }, 3500);
}


/* =========================================================
   03. CLOSE MOBILE MENU WHEN RESIZING
   ========================================================= */

window.addEventListener("resize", () => {

    if (window.innerWidth > 700) {

        if (mobileMenu) {
            mobileMenu.style.display = "none";
            mobileMenu.classList.remove("is-open");
        }

        if (menuToggle) {
            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        document.body.style.overflow = "";
    }

});