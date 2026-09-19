// =========================
// ÉLORA CHECKOUT
// =========================
console.log("ÉLORA CHECKOUT JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("checkoutForm");

    if (!form) return;

    renderCheckoutSummary();


    form.addEventListener("submit", async (event) => {
        console.log("ÉLORA CHECKOUT SUBMIT FIRED");

        event.preventDefault();

        if (cart.length === 0) {

            alert("Your bag is empty.");

            window.location.href = "shop.html";

            return;
        }


        // =========================
        // CUSTOMER INFORMATION
        // =========================

        const customer = {

            fullName:
                document.getElementById("fullName").value.trim(),

            email:
                document.getElementById("email").value.trim(),

            phone:
                document.getElementById("phone").value.trim(),

            address:
                document.getElementById("address").value.trim(),

            city:
                document.getElementById("city").value.trim(),

            province:
                document.getElementById("province").value.trim(),

            postalCode:
                document.getElementById("postalCode").value.trim(),

            paymentMethod:
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                ).value

        };


        // =========================
        // CREATE ORDER
        // =========================

        const order = {

            orderId:
                "EL-" +
                Date.now()
                    .toString()
                    .slice(-6),

            customer,

            items: [...cart],

            total: getCartTotal(),

            status: "New Order",

            createdAt:
                new Date().toISOString()

        };


        // =========================
        // SAVE TO LOCAL STORAGE
        // =========================

        localStorage.setItem(
            "eloraLastOrder",
            JSON.stringify(order)
        );


        // =========================
        // SAVE TO SUPABASE
        // =========================
console.log("ÉLORA: Starting Supabase save...");
        try {
console.log("ÉLORA: Inserting order:", order);
const { data: authData } = await supabaseClient.auth.getSession();

console.log(
    "ÉLORA SESSION:",
    authData.session
);
            const { data, error } =
    await supabaseClient
        .from("elora_orders")
        .insert([{

            order_id: order.orderId,

            customer_name: customer.fullName,

            customer_email: customer.email,

            phone: customer.phone,

            address: customer.address,

            city: customer.city,

            province: customer.province,

            postal_code: customer.postalCode,

            items: order.items,

            total: order.total,

            payment_method: customer.paymentMethod,

            status: order.status,

            created_at: order.createdAt

        }]);


            if (error) {

               console.error(
    "ÉLORA Supabase order error:",
    JSON.stringify(error, null, 2)

);

alert(
    "Supabase Error:\n\n" +
    JSON.stringify(error, null, 2)
);

            } else {

                console.log(
                    "ÉLORA order saved to Supabase:",
                    data
                );

            }

        } catch (error) {

            console.error(
                "ÉLORA Supabase connection error:",
                error
            );

        }


        // =========================
        // CLEAR CART
        // =========================

        cart = [];

        saveCart();


        // =========================
        // GO TO CONFIRMATION
        // =========================

        window.location.href =
            `order-confirmation.html?order_id=${order.orderId}`;

    });

});


// =========================
// CHECKOUT SUMMARY
// =========================

function renderCheckoutSummary() {

    const container =
        document.getElementById("checkoutItems");

    const subtotal =
        document.getElementById("checkoutSubtotal");

    const total =
        document.getElementById("checkoutTotal");


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `
            <p class="empty-checkout">
                Your bag is empty.
            </p>
        `;

        subtotal.textContent = "$0";
        total.textContent = "$0";

        return;
    }


    container.innerHTML = cart.map(item => `

        <div class="checkout-item">

            <div>

                <strong>
                    ${item.name}
                </strong>

                <span>
                    × ${item.quantity}
                </span>

            </div>

            <strong>
                $${(item.price * item.quantity).toFixed(2)}
            </strong>

        </div>

    `).join("");


    const cartTotal =
        getCartTotal();


    subtotal.textContent =
        `$${cartTotal.toFixed(2)}`;

    total.textContent =
        `$${cartTotal.toFixed(2)}`;

}