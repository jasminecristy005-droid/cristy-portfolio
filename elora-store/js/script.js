// =========================
// ÉLORA SHOP INTERACTIONS
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const addButtons = document.querySelectorAll(".add-to-bag");

    addButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            const product = products[index];

            if (!product) return;

            addToCart(product);

        });

    });

});