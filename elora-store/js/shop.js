// =========================
// ÉLORA SHOP
// =========================

let products = [];


// =========================
// INITIALIZE SHOP
// =========================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadProducts();

        setupCategoryFilters();

    }
);


// =========================
// LOAD PRODUCTS FROM SUPABASE
// =========================

async function loadProducts() {

    console.log(
        "ÉLORA: Loading products from Supabase..."
    );


    const {
        data,
        error
    } = await supabaseClient
        .from("elora_products")
        .select("*")
        .order("created_at", {
            ascending: true
        });


    if (error) {

        console.error(
            "ÉLORA Shop Product Error:",
            error
        );

        const grid =
            document.querySelector(
                ".shop-grid"
            );

        if (grid) {

            grid.innerHTML = `
                <p>
                    Unable to load products.
                </p>
            `;

        }

        return;
    }


    products = data || [];


    console.log(
        "ÉLORA Shop Products Loaded:",
        products
    );


    renderProducts();

}


// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(
    category = "All"
) {

    const grid =
        document.querySelector(
            ".shop-grid"
        );


    if (!grid) return;


    const filteredProducts =
        category === "All"
            ? products
            : products.filter(
                product =>
                    product.category === category
            );


    if (
        filteredProducts.length === 0
    ) {

        grid.innerHTML = `
            <p>
                No products available.
            </p>
        `;

        return;
    }


    grid.innerHTML =
        filteredProducts.map(
            product => `

        <article class="shop-card">

            <div class="shop-image">

                <img
                    src="${product.image || ""}"
                    alt="${product.name || ""}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="shop-info">

                <h2>
                    ${product.name || "-"}
                </h2>


                <p>
                    ${product.description || ""}
                </p>


                <strong>
                    $${Number(
                        product.price || 0
                    ).toFixed(2)}
                </strong>


                <button
                    class="add-to-bag"
                    data-product-id="${product.id}"
                >
                    Add to Bag
                </button>

            </div>

        </article>

    `
        ).join("");


    // =========================
    // ADD TO BAG
    // =========================

    document
        .querySelectorAll(
            ".add-to-bag"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const productId =
                        button.dataset.productId;


                    const product =
                        products.find(
                            item =>
                                item.id ===
                                productId
                        );


                    if (!product) return;


                    addToCart(product);

                }
            );

        });

}


// =========================
// CATEGORY FILTER
// =========================

function setupCategoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".category"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                renderProducts(
                    button.textContent.trim()
                );

            }
        );

    });

}