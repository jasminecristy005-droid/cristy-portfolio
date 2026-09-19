// =========================
// ÉLORA SHOPPING CART
// =========================

let cart = JSON.parse(localStorage.getItem("eloraCart")) || [];


// =========================
// SAVE CART
// =========================

function saveCart() {
    localStorage.setItem("eloraCart", JSON.stringify(cart));
}


// =========================
// ADD PRODUCT TO CART
// =========================

function addToCart(product) {

    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    alert(`${product.name} has been added to your bag.`);
}


// =========================
// REMOVE PRODUCT
// =========================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

}


// =========================
// UPDATE QUANTITY
// =========================

function updateQuantity(productId, quantity) {

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) return;

    product.quantity = Math.max(1, quantity);

    saveCart();

}


// =========================
// CART TOTAL
// =========================

function getCartTotal() {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

}
// =========================
// RENDER CART
// =========================

function renderCart() {

    const cartContainer =
        document.getElementById("cartItems");

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const totalElement =
        document.getElementById("cartTotal");


    if (!cartContainer) return;


    // EMPTY CART

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your bag is empty</h2>

                <p>
                    Discover something beautiful
                    from our collection.
                </p>

                <a href="shop.html">
                    Continue Shopping
                </a>
            </div>
        `;

        subtotalElement.textContent = "$0";
        totalElement.textContent = "$0";

        return;
    }


    // CART PRODUCTS

    cartContainer.innerHTML = cart.map(item => `

        <article class="cart-item">

            <div class="cart-item-image">
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.style.display='none'"
                >
            </div>


            <div class="cart-item-info">

                <h2>${item.name}</h2>

                <p>${item.description}</p>

                <strong>
                    $${item.price}
                </strong>


                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity('${item.id}', -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity('${item.id}', 1)"
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-item"
                    onclick="removeCartItem('${item.id}')"
                >
                    Remove
                </button>

            </div>

        </article>

    `).join("");


    // TOTAL

    const total = getCartTotal();

    subtotalElement.textContent =
        `$${total.toFixed(2)}`;

    totalElement.textContent =
        `$${total.toFixed(2)}`;

}


// =========================
// CHANGE QUANTITY
// =========================

function changeQuantity(productId, change) {

    const product =
        cart.find(item => item.id === productId);

    if (!product) return;

    product.quantity += change;


    if (product.quantity <= 0) {

        removeFromCart(productId);

    } else {

        saveCart();

    }


    renderCart();

}


// =========================
// REMOVE CART ITEM
// =========================

function removeCartItem(productId) {

    removeFromCart(productId);

    renderCart();

}