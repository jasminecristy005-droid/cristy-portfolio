// =========================
// ÉLORA ORDER TRACKING
// =========================

let trackingChannel = null;


// =========================
// PAGE LOAD
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("trackingForm");

    const result =
        document.getElementById("trackingResult");


    if (!form || !result) return;


    form.addEventListener(
        "submit",
        handleTrackingSubmit
    );


    // Check if order_id already exists
    // in the URL
    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlOrderId =
        params.get("order_id");


    if (urlOrderId) {

        document.getElementById(
            "orderNumber"
        ).value =
            urlOrderId;

        loadOrder(urlOrderId);

    }

});


// =========================
// TRACK ORDER SUBMIT
// =========================

async function handleTrackingSubmit(event) {

    event.preventDefault();


    const enteredOrderId =
        document
            .getElementById("orderNumber")
            .value
            .trim()
            .toUpperCase();


    if (!enteredOrderId) return;


    await loadOrder(
        enteredOrderId
    );

}


// =========================
// LOAD ORDER FROM SUPABASE
// =========================

async function loadOrder(orderId) {

    const result =
        document.getElementById(
            "trackingResult"
        );


    result.innerHTML = `

        <div class="tracking-loading">

            <p>
                Checking your order...
            </p>

        </div>

    `;


    console.log(
        "ÉLORA: Searching order:",
        orderId
    );


    const {
        data: order,
        error
    } = await supabaseClient
        .from("elora_orders")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();


    if (error) {

        console.error(
            "ÉLORA tracking error:",
            error
        );


        showTrackingError(
            "Unable to check your order right now."
        );

        return;

    }


    if (!order) {

        showTrackingError(
            "Order not found. Please check your order number."
        );

        return;

    }


    console.log(
        "ÉLORA: Order found:",
        order
    );


    renderOrder(order);


    subscribeToOrder(order.order_id);

}


// =========================
// DISPLAY ERROR
// =========================

function showTrackingError(message) {

    const result =
        document.getElementById(
            "trackingResult"
        );


    result.innerHTML = `

        <div class="tracking-error">

            <strong>
                Order not found
            </strong>

            <p>
                ${message}
            </p>

        </div>

    `;

}


// =========================
// RENDER ORDER
// =========================

function renderOrder(order) {

    const result =
        document.getElementById(
            "trackingResult"
        );


    result.innerHTML = `

        <div class="tracking-success">

            <p class="tracking-label">
                ORDER FOUND
            </p>


            <h2>
                ${order.order_id}
            </h2>


            <div class="tracking-info">


                <div>

                    <span>
                        Customer
                    </span>

                    <strong>
                        ${order.customer_name}
                    </strong>

                </div>


                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        $${Number(order.total).toFixed(2)}
                    </strong>

                </div>


                <div>

                    <span>
                        Payment
                    </span>

                    <strong>
                        ${order.payment_method || "-"}
                    </strong>

                </div>


                <div>

                    <span>
                        Status
                    </span>

                    <strong class="order-status">
                        ${order.status}
                    </strong>

                </div>


            </div>


            <div class="order-progress">


                <div class="progress-step ${
                    getStepClass(
                        order.status,
                        "New Order"
                    )
                }">

                    <span>
                        1
                    </span>

                    <p>
                        New Order
                    </p>

                </div>


                <div class="progress-line"></div>


                <div class="progress-step ${
                    getStepClass(
                        order.status,
                        "Processing"
                    )
                }">

                    <span>
                        2
                    </span>

                    <p>
                        Processing
                    </p>

                </div>


                <div class="progress-line"></div>


                <div class="progress-step ${
                    getStepClass(
                        order.status,
                        "Ready"
                    )
                }">

                    <span>
                        3
                    </span>

                    <p>
                        Ready
                    </p>

                </div>


                <div class="progress-line"></div>


                <div class="progress-step ${
                    getStepClass(
                        order.status,
                        "Completed"
                    )
                }">

                    <span>
                        4
                    </span>

                    <p>
                        Completed
                    </p>

                </div>


            </div>


        </div>

    `;

}


// =========================
// REALTIME ORDER STATUS
// =========================

function subscribeToOrder(orderId) {

    // Remove previous subscription
    if (trackingChannel) {

        supabaseClient.removeChannel(
            trackingChannel
        );

    }


    console.log(
        "ÉLORA: Starting order tracking realtime..."
    );


    trackingChannel =
        supabaseClient
            .channel(
                "elora-order-" + orderId
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "elora_orders",
                    filter:
                        `order_id=eq.${orderId}`
                },
                (payload) => {

                    console.log(
                        "ÉLORA ORDER STATUS UPDATED:",
                        payload
                    );


                    if (
                        payload.new
                    ) {

                        renderOrder(
                            payload.new
                        );

                    }

                }
            )
            .subscribe(
                (status) => {

                    console.log(
                        "ÉLORA TRACKING REALTIME:",
                        status
                    );

                }
            );

}


// =========================
// STATUS PROGRESS
// =========================

function getStepClass(
    currentStatus,
    stepStatus
) {

    const steps = [

        "New Order",

        "Processing",

        "Ready",

        "Completed"

    ];


    const currentIndex =
        steps.indexOf(
            currentStatus
        );


    const stepIndex =
        steps.indexOf(
            stepStatus
        );


    if (
        stepIndex <= currentIndex
    ) {

        return "active";

    }


    return "";

}