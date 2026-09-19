// =========================
// ÉLORA ADMIN DASHBOARD
// =========================

document.addEventListener("DOMContentLoaded", () => {

    checkAdminAndLoad();

});


// =========================
// CHECK ADMIN SESSION
// =========================

async function checkAdminAndLoad() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    if (!session) {

        window.location.href =
            "admin-login.html";

        return;
    }


    console.log(
        "ÉLORA ADMIN LOGGED IN:",
        session.user.email
    );


    loadDashboard();

subscribeToOrderChanges();

}


// =========================
// LOAD ORDERS FROM SUPABASE
// =========================

async function loadDashboard() {

    console.log(
        "ÉLORA: Loading orders from Supabase..."
    );


    const {
        data: orders,
        error
    } = await supabaseClient
        .from("elora_orders")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "ÉLORA Admin order error:",
            error
        );

        return;
    }


    console.log(
        "ÉLORA: Orders loaded:",
        orders
    );


    updateStats(orders);

    renderOrders(orders);

}


// =========================
// UPDATE STATISTICS
// =========================

function updateStats(orders) {

    const totalOrders =
        document.getElementById("totalOrders");

    const newOrders =
        document.getElementById("newOrders");

    const processingOrders =
        document.getElementById("processingOrders");

    const totalRevenue =
        document.getElementById("totalRevenue");


    const newCount =
        orders.filter(
            order =>
                order.status === "New Order"
        ).length;


    const processingCount =
        orders.filter(
            order =>
                order.status === "Processing"
        ).length;


    const revenue =
        orders.reduce(
            (sum, order) =>
                sum + Number(order.total || 0),
            0
        );


    totalOrders.textContent =
        orders.length;

    newOrders.textContent =
        newCount;

    processingOrders.textContent =
        processingCount;

    totalRevenue.textContent =
        `$${revenue.toFixed(2)}`;

}


function renderOrders(orders) {

    const tableBody =
        document.getElementById(
            "ordersTableBody"
        );


    if (!orders.length) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No orders yet.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML =
        orders.map(order => `

            <tr>

                <td>
                    <strong>
                        ${order.order_id || "-"}
                    </strong>
                </td>


                <td>
                    ${
                        order.created_at
                            ? new Date(
                                order.created_at
                            ).toLocaleString(
                                "en-PH",
                                {
                                    dateStyle: "medium",
                                    timeStyle: "short"
                                }
                            )
                            : "-"
                    }
                </td>


                <td>
                    ${order.customer_name || "-"}
                </td>


                <td>
                    $${Number(
                        order.total || 0
                    ).toFixed(2)}
                </td>


                <td>
                    ${order.payment_method || "-"}
                </td>


                <td>

                    <select
                        class="admin-status-select"
                        data-order-id="${order.order_id}"
                    >

                        <option
                            value="New Order"
                            ${
                                order.status === "New Order"
                                    ? "selected"
                                    : ""
                            }
                        >
                            New Order
                        </option>


                        <option
                            value="Processing"
                            ${
                                order.status === "Processing"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Processing
                        </option>


                        <option
                            value="Ready"
                            ${
                                order.status === "Ready"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Ready
                        </option>


                        <option
                            value="Completed"
                            ${
                                order.status === "Completed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completed
                        </option>

                    </select>

                </td>


                <td>

                    <button
                        type="button"
                        class="view-order-button"
                        onclick="viewOrder('${order.order_id}')"
                    >
                        View
                    </button>

                </td>

            </tr>

        `).join("");


    document
        .querySelectorAll(
            ".admin-status-select"
        )
        .forEach(select => {

            select.addEventListener(
                "change",
                async function () {

                    const orderId =
                        this.dataset.orderId;

                    const newStatus =
                        this.value;


                    await updateOrderStatus(
                        orderId,
                        newStatus
                    );

                }
            );

        });

}

// =========================
// UPDATE ORDER STATUS
// =========================

async function updateOrderStatus(
    orderId,
    newStatus
) {

    const {
        error
    } = await supabaseClient
        .from("elora_orders")
        .update({
            status: newStatus
        })
        .eq(
            "order_id",
            orderId
        );


    if (error) {

        console.error(
            "ÉLORA status update error:",
            error
        );

        alert(
            "Unable to update order status."
        );

        return;
    }


    console.log(
        "ÉLORA ORDER STATUS UPDATED:",
        orderId,
        newStatus
    );


    loadDashboard();

}


// =========================
// VIEW ORDER
// =========================
// =========================
// VIEW ORDER DETAILS
// =========================

async function viewOrder(orderId) {

    console.log(
        "ÉLORA VIEW ORDER:",
        orderId
    );

    const {
        data: order,
        error
    } = await supabaseClient
        .from("elora_orders")
        .select("*")
        .eq("order_id", orderId)
        .single();


    if (error || !order) {

        console.error(
            "ÉLORA VIEW ORDER ERROR:",
            error
        );

        alert(
            "Unable to load order details."
        );

        return;
    }


    const modal =
        document.getElementById("orderModal");

    const modalOrderId =
        document.getElementById("modalOrderId");

    const modalBody =
        document.getElementById("orderModalBody");


    if (!modal || !modalOrderId || !modalBody) {

        console.error(
            "ÉLORA: Order modal elements not found."
        );

        return;
    }


    // =========================
    // ORDER ITEMS
    // =========================

    let items = order.items;

    if (typeof items === "string") {

        try {
            items = JSON.parse(items);
        } catch (error) {

            console.error(
                "ÉLORA items parse error:",
                error
            );

            items = [];
        }

    }


    const itemsHTML =
        Array.isArray(items)
            ? items.map(item => `

                <div class="order-detail-product">

                    <div>

                        <strong>
                            ${item.name}
                        </strong>

                        <span>
                            ${item.description || ""}
                        </span>

                    </div>

                    <div class="order-detail-product-right">

                        <span>
                            ×${item.quantity}
                        </span>

                        <strong>
                            $${Number(item.price).toFixed(2)}
                        </strong>

                    </div>

                </div>

            `).join("")
            : "";


    // =========================
    // DATE
    // =========================

    const orderDate =
        order.created_at
            ? new Date(
                order.created_at
            ).toLocaleString(
                "en-PH",
                {
                    dateStyle: "long",
                    timeStyle: "short"
                }
            )
            : "-";


    // =========================
    // MODAL CONTENT
    // =========================

    modalOrderId.textContent =
        order.order_id;


    modalBody.innerHTML = `

        <div class="order-detail-section">

            <h3>
                Customer
            </h3>

            <div class="order-detail-grid">

                <div>
                    <span>Email</span>
                    <strong>
                        ${order.customer_email || "-"}
                    </strong>
                </div>

                <div>
                    <span>Phone</span>
                    <strong>
                        ${order.phone || "-"}
                    </strong>
                </div>

            </div>

        </div>


        <div class="order-detail-section">

            <h3>
                Shipping Address
            </h3>

            <p class="order-address">

                ${order.address || "-"}<br>

                ${order.city || ""}, 
                ${order.province || ""}<br>

                ${order.postal_code || ""}

            </p>

        </div>


        <div class="order-detail-section">

            <h3>
                Products
            </h3>

            <div class="order-detail-products">

                ${itemsHTML}

            </div>

        </div>


        <div class="order-detail-section">

            <h3>
                Order Summary
            </h3>

            <div class="order-summary-detail">

                <div>
                    <span>Payment</span>
                    <strong>
                        ${order.payment_method || "-"}
                    </strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong>
                        ${order.status || "-"}
                    </strong>
                </div>

                <div>
                    <span>Order Date</span>
                    <strong>
                        ${orderDate}
                    </strong>
                </div>

                <div class="order-grand-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        $${Number(order.total || 0).toFixed(2)}
                    </strong>

                </div>

            </div>

        </div>

    `;


    // SHOW MODAL

    modal.style.display = "flex";

}
// =========================
// ÉLORA REALTIME ORDERS
// =========================

let realtimeStarted = false;

function subscribeToOrderChanges() {

    if (realtimeStarted) {

        console.log(
            "ÉLORA: Realtime already started."
        );

        return;
    }

    realtimeStarted = true;

    console.log(
        "ÉLORA: Starting realtime subscription..."
    );

    supabaseClient
        .channel("elora-admin-orders")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "elora_orders"
            },
            (payload) => {

                console.log(
                    "ÉLORA REALTIME EVENT:",
                    payload
                );

                loadDashboard();

            }
        )
        .subscribe((status) => {

            console.log(
                "ÉLORA REALTIME STATUS:",
                status
            );

        });

}
// =========================
// ÉLORA ADMIN LOGOUT
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const logoutButton =
        document.getElementById("logoutButton");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", async (event) => {

        event.preventDefault();

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {

            console.error(
                "ÉLORA logout error:",
                error
            );

            alert("Unable to log out.");

            return;
        }

        window.location.href =
            "admin-login.html";

    });

});
// =========================
// CLOSE ORDER MODAL
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const closeButton =
        document.getElementById(
            "closeOrderModal"
        );

    const modal =
        document.getElementById(
            "orderModal"
        );


    if (!closeButton || !modal) return;


    closeButton.addEventListener(
        "click",
        () => {

            modal.style.display = "none";

        }
    );


    modal.addEventListener(
        "click",
        (event) => {

            if (event.target === modal) {

                modal.style.display = "none";

            }

        }
    );

});