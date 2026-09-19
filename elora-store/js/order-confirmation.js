document.addEventListener("DOMContentLoaded", () => {

    const params =
        new URLSearchParams(window.location.search);

    const orderId =
        params.get("order_id");


    const order =
        JSON.parse(
            localStorage.getItem("eloraLastOrder")
        );


    const orderIdElement =
        document.getElementById("orderId");

    const detailsElement =
        document.getElementById("orderDetails");

    const trackButton =
        document.getElementById("trackOrder");


    if (!orderId) {

        orderIdElement.textContent =
            "Unavailable";

        return;
    }


    orderIdElement.textContent =
        orderId;


    if (!order) {

        detailsElement.innerHTML = `
            <p>
                Your order has been received.
            </p>
        `;

        return;
    }


    detailsElement.innerHTML = `

        <div class="confirmation-row">
            <span>Customer</span>
            <strong>
                ${order.customer.fullName}
            </strong>
        </div>

        <div class="confirmation-row">
            <span>Payment</span>
            <strong>
                ${order.customer.paymentMethod}
            </strong>
        </div>

        <div class="confirmation-row">
            <span>Total</span>
            <strong>
                $${order.total.toFixed(2)}
            </strong>
        </div>

        <div class="confirmation-row">
            <span>Status</span>
            <strong>
                ${order.status}
            </strong>
        </div>

    `;


    trackButton.href =
        `order-tracking.html?order_id=${orderId}`;

});