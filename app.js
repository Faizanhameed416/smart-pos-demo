// =====================================================
// SMART POS - WORKING DEMO JAVASCRIPT
// =====================================================

let cart = [];


// =====================================================
// STORAGE HELPERS
// =====================================================

const STORAGE_KEYS = {
    products: "smartpos_products",
    customers: "smartpos_customers",
    suppliers: "smartpos_suppliers",
    sales: "smartpos_sales",
    expenses: "smartpos_expenses",
    settings: "smartpos_settings"
};


const defaultProducts = [
    {
        id: 1,
        name: "Wireless Mouse",
        category: "Electronics",
        price: 1800,
        stock: 25,
        icon: "🖱️"
    },
    {
        id: 2,
        name: "USB Keyboard",
        category: "Electronics",
        price: 2500,
        stock: 18,
        icon: "⌨️"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 4500,
        stock: 12,
        icon: "🔊"
    },
    {
        id: 4,
        name: "Premium Coffee",
        category: "Grocery",
        price: 1200,
        stock: 30,
        icon: "☕"
    },
    {
        id: 5,
        name: "Office Notebook",
        category: "Stationery",
        price: 450,
        stock: 40,
        icon: "📓"
    },
    {
        id: 6,
        name: "Water Bottle",
        category: "General",
        price: 850,
        stock: 22,
        icon: "🧴"
    }
];


const defaultCustomers = [
    {
        id: 1,
        name: "Ahmed Khan",
        phone: "0300-1234567"
    },
    {
        id: 2,
        name: "Ali Raza",
        phone: "0312-9876543"
    },
    {
        id: 3,
        name: "Sara Ahmed",
        phone: "0333-4567890"
    }
];


const defaultSuppliers = [
    {
        id: 1,
        name: "Ali Traders",
        company: "Ali Traders Pvt Ltd",
        phone: "0300-1112233",
        balance: 45000
    },
    {
        id: 2,
        name: "Tech World",
        company: "Tech World",
        phone: "0312-4445566",
        balance: 0
    }
];


function getData(key, fallback = []) {

    try {

        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : fallback;

    } catch (error) {

        return fallback;

    }

}


function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


let demoProducts =
    getData(
        STORAGE_KEYS.products,
        defaultProducts
    );


let customers =
    getData(
        STORAGE_KEYS.customers,
        defaultCustomers
    );


let suppliers =
    getData(
        STORAGE_KEYS.suppliers,
        defaultSuppliers
    );


let sales =
    getData(
        STORAGE_KEYS.sales,
        []
    );


let expenses =
    getData(
        STORAGE_KEYS.expenses,
        []
    );


let settings =
    getData(
        STORAGE_KEYS.settings,
        {
            businessName: "Smart POS Store",
            phone: "+92 300 1234567",
            currency: "PKR",
            tax: 5
        }
    );


// =====================================================
// LOGIN
// =====================================================

function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (
        username === "admin" &&
        password === "123456"
    ) {

        document
            .getElementById("loginScreen")
            .classList.add("hidden");

        document
            .getElementById("app")
            .classList.remove("hidden");

        updateDate();

        showPage("dashboard");

        showToast("Welcome to Smart POS!");

    } else {

        alert(
            "Invalid login!\n\n" +
            "Demo Login:\n" +
            "Username: admin\n" +
            "Password: 123456"
        );

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    if (!confirm("Are you sure you want to logout?")) {
        return;
    }

    document
        .getElementById("app")
        .classList.add("hidden");

    document
        .getElementById("loginScreen")
        .classList.remove("hidden");

    document.getElementById("password").value = "";

}


// =====================================================
// DATE
// =====================================================

function updateDate() {

    const element =
        document.getElementById("currentDate");

    if (!element) return;

    const today = new Date();

    element.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(
    page,
    clickedButton = null
) {

    const pageTitle =
        document.getElementById("pageTitle");

    const content =
        document.getElementById("pageContent");


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove("active");

        });


    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        const matchingButton =
            [...document.querySelectorAll(".nav-item")]
                .find(button =>
                    button
                        .getAttribute("onclick")
                        ?.includes(`'${page}'`)
                );

        if (matchingButton) {
            matchingButton.classList.add("active");
        }

    }


    const titles = {

        dashboard: "Dashboard",
        pos: "Point of Sale",
        products: "Products",
        inventory: "Inventory",
        customers: "Customers",
        suppliers: "Suppliers",
        purchases: "Purchases",
        sales: "Sales",
        expenses: "Expenses",
        reports: "Reports",
        users: "Users",
        settings: "Settings"

    };


    pageTitle.textContent =
        titles[page] || "Dashboard";


    switch (page) {

        case "dashboard":
            renderDashboard();
            break;

        case "pos":
            renderPOS();
            break;

        case "products":
            renderProducts();
            break;

        case "inventory":
            renderInventory();
            break;

        case "customers":
            renderCustomers();
            break;

        case "suppliers":
            renderSuppliers();
            break;

        case "purchases":
            renderPurchases();
            break;

        case "sales":
            renderSales();
            break;

        case "expenses":
            renderExpenses();
            break;

        case "reports":
            renderReports();
            break;

        case "users":
            renderUsers();
            break;

        case "settings":
            renderSettings();
            break;

        default:
            renderDashboard();

    }

}


// =====================================================
// DASHBOARD
// =====================================================

function renderDashboard() {

    const today =
        new Date().toDateString();


    const todaySales =
        sales.filter(
            sale =>
                new Date(sale.date)
                    .toDateString() === today
        );


    const todayTotal =
        todaySales.reduce(
            (sum, sale) =>
                sum + sale.total,
            0
        );


    const totalProducts =
        demoProducts.length;


    const lowStock =
        demoProducts.filter(
            product => product.stock <= 5
        ).length;


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Business Overview</h2>

                <p>
                    Welcome back, Admin.
                    Here's what's happening today.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="showPage('pos')"
            >
                + New Sale
            </button>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <div class="stat-icon">💰</div>

                <div class="stat-label">
                    Today's Sales
                </div>

                <div class="stat-value">
                    Rs. ${formatNumber(todayTotal)}
                </div>

                <div class="stat-trend">
                    ${todaySales.length} sale(s) today
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon">🛒</div>

                <div class="stat-label">
                    Total Orders
                </div>

                <div class="stat-value">
                    ${sales.length}
                </div>

                <div class="stat-trend">
                    Live demo data
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon">📦</div>

                <div class="stat-label">
                    Products
                </div>

                <div class="stat-value">
                    ${totalProducts}
                </div>

                <div class="stat-trend">
                    ${lowStock} low stock
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-icon">👥</div>

                <div class="stat-label">
                    Customers
                </div>

                <div class="stat-value">
                    ${customers.length}
                </div>

                <div class="stat-trend">
                    Customer database
                </div>

            </div>

        </div>


        <div class="card-grid two-columns">

            <div class="card">

                <div class="card-title">
                    Sales Overview
                </div>

                ${salesBars()}

            </div>


            <div class="card">

                <div class="card-title">
                    Recent Transactions
                </div>

                ${recentTransactions()}

            </div>

        </div>


        <div
            class="card"
            style="margin-top:18px"
        >

            <div class="card-title">
                Low Stock Products
            </div>

            ${lowStockTable()}

        </div>

    `;

}


// =====================================================
// SALES BARS
// =====================================================

function salesBars() {

    const days = [
        ["Monday", 65],
        ["Tuesday", 82],
        ["Wednesday", 55],
        ["Thursday", 90],
        ["Friday", 75],
        ["Saturday", 100]
    ];


    return days.map(day => `

        <div class="sales-bar">

            <div class="sales-bar-title">

                <span>
                    ${day[0]}
                </span>

                <strong>
                    Demo
                </strong>

            </div>

            <div class="bar-background">

                <div
                    class="bar-fill"
                    style="width:${day[1]}%"
                ></div>

            </div>

        </div>

    `).join("");

}


// =====================================================
// RECENT TRANSACTIONS
// =====================================================

function recentTransactions() {

    if (sales.length === 0) {

        return `

            <div
                style="
                    padding:30px;
                    text-align:center;
                    color:#6b7280;
                "
            >
                No sales yet.
            </div>

        `;

    }


    const recent =
        [...sales]
            .reverse()
            .slice(0, 5);


    return `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Invoice</th>
                        <th>Customer</th>
                        <th>Total</th>

                    </tr>

                </thead>

                <tbody>

                    ${recent.map(
                        sale => `

                            <tr>

                                <td>
                                    ${sale.invoice}
                                </td>

                                <td>
                                    ${sale.customer}
                                </td>

                                <td>
                                    <strong>
                                        Rs.
                                        ${formatNumber(
                                            sale.total
                                        )}
                                    </strong>
                                </td>

                            </tr>

                        `
                    ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


// =====================================================
// LOW STOCK
// =====================================================

function lowStockTable() {

    const products =
        demoProducts
            .filter(
                product =>
                    product.stock <= 5
            )
            .slice(0, 10);


    if (products.length === 0) {

        return `

            <div
                style="
                    padding:25px;
                    color:#6b7280;
                "
            >
                No low stock products.
            </div>

        `;

    }


    return `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Product</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${products.map(
                        product => `

                            <tr>

                                <td>
                                    <strong>
                                        ${product.icon}
                                        ${product.name}
                                    </strong>
                                </td>

                                <td>
                                    ${product.category}
                                </td>

                                <td>
                                    ${product.stock}
                                </td>

                                <td>

                                    <span
                                        class="badge badge-danger"
                                    >
                                        Low Stock
                                    </span>

                                </td>

                            </tr>

                        `
                    ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


// =====================================================
// POS
// =====================================================

function renderPOS() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Point of Sale</h2>

                <p>
                    Create a new customer sale.
                </p>

            </div>

        </div>


        <div class="pos-layout">

            <div class="card">

                <input
                    class="search-box"
                    id="productSearch"
                    placeholder="Search products..."
                    oninput="filterProducts()"
                >


                <div
                    class="products-grid"
                    id="productsGrid"
                >

                    ${productCards()}

                </div>

            </div>


            <div class="card">

                <div class="card-title">
                    Current Cart
                </div>


                <div id="cartContainer">

                    ${renderCartHTML()}

                </div>

            </div>

        </div>

    `;

}


// =====================================================
// PRODUCT CARDS
// =====================================================

function productCards(
    products = demoProducts
) {

    if (products.length === 0) {

        return `

            <div
                style="
                    padding:30px;
                    color:#6b7280;
                "
            >
                No products found.
            </div>

        `;

    }


    return products.map(
        product => `

            <div
                class="product-card"
                data-name="${product.name.toLowerCase()}"
            >

                <div class="product-image">
                    ${product.icon}
                </div>

                <span class="product-name">
                    ${product.name}
                </span>

                <div class="product-info">
                    ${product.category}
                    • Stock: ${product.stock}
                </div>

                <div class="product-price">
                    Rs.
                    ${formatNumber(product.price)}
                </div>


                <button
                    class="primary-btn"
                    style="width:100%"
                    onclick="addToCart(${product.id})"
                    ${product.stock <= 0 ? "disabled" : ""}
                >

                    ${
                        product.stock <= 0
                            ? "Out of Stock"
                            : "Add to Cart"
                    }

                </button>

            </div>

        `
    ).join("");

}


// =====================================================
// SEARCH
// =====================================================

function filterProducts() {

    const input =
        document.getElementById(
            "productSearch"
        );

    if (!input) return;


    const search =
        input.value
            .toLowerCase()
            .trim();


    const filtered =
        demoProducts.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search)
        );


    document.getElementById(
        "productsGrid"
    ).innerHTML =
        productCards(filtered);

}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

    const product =
        demoProducts.find(
            product =>
                product.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    const currentQuantity =
        existing
            ? existing.quantity
            : 0;


    if (
        currentQuantity >=
        product.stock
    ) {

        showToast(
            "Not enough stock!"
        );

        return;

    }


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    renderCart();

    showToast(
        `${product.name} added to cart`
    );

}


// =====================================================
// CART HTML
// =====================================================

function renderCartHTML() {

    if (cart.length === 0) {

        return `

            <div
                style="
                    text-align:center;
                    padding:35px 10px;
                    color:#6b7280;
                "
            >

                <div style="font-size:40px">
                    🛒
                </div>

                <p>
                    Your cart is empty
                </p>

                <small>
                    Add products to start a sale
                </small>

            </div>

        `;

    }


    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const tax =
        Math.round(
            subtotal *
            (Number(settings.tax) / 100)
        );


    const total =
        subtotal + tax;


    return `

        ${cart.map(
            item => `

                <div class="cart-item">

                    <div>

                        <div class="cart-item-name">
                            ${item.name}
                        </div>

                        <div class="cart-item-info">
                            Rs.
                            ${formatNumber(item.price)}
                        </div>

                    </div>


                    <div class="quantity">

                        <button
                            onclick="
                                changeQuantity(
                                    ${item.id},
                                    -1
                                )
                            "
                        >
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="
                                changeQuantity(
                                    ${item.id},
                                    1
                                )
                            "
                        >
                            +
                        </button>

                    </div>


                    <strong>
                        Rs.
                        ${formatNumber(
                            item.price *
                            item.quantity
                        )}
                    </strong>

                </div>

            `
        ).join("")}


        <div class="cart-total">

            <div class="total-line">

                <span>
                    Subtotal
                </span>

                <strong>
                    Rs.
                    ${formatNumber(subtotal)}
                </strong>

            </div>


            <div class="total-line">

                <span>
                    Tax ${settings.tax}%
                </span>

                <strong>
                    Rs.
                    ${formatNumber(tax)}
                </strong>

            </div>


            <div
                class="total-line grand-total"
            >

                <span>
                    Total
                </span>

                <strong>
                    Rs.
                    ${formatNumber(total)}
                </strong>

            </div>


            <button
                class="primary-btn"
                style="
                    width:100%;
                    margin-top:15px
                "
                onclick="completeSale()"
            >
                Complete Sale
            </button>


            <button
                class="secondary-btn"
                style="
                    width:100%;
                    margin-top:8px
                "
                onclick="clearCart()"
            >
                Clear Cart
            </button>

        </div>

    `;

}


function renderCart() {

    const container =
        document.getElementById(
            "cartContainer"
        );

    if (!container) return;

    container.innerHTML =
        renderCartHTML();

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            item =>
                item.id === productId
        );


    if (!item) return;


    const product =
        demoProducts.find(
            product =>
                product.id === productId
        );


    if (!product) return;


    if (
        amount > 0 &&
        item.quantity >= product.stock
    ) {

        showToast(
            "Maximum available stock reached"
        );

        return;

    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item =>
                    item.id !== productId
            );

    }


    renderCart();

}


// =====================================================
// CLEAR CART
// =====================================================

function clearCart() {

    cart = [];

    renderCart();

    showToast(
        "Cart cleared"
    );

}


// =====================================================
// COMPLETE SALE
// =====================================================

function completeSale() {

    if (cart.length === 0) {

        alert(
            "Please add at least one product."
        );

        return;

    }


    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const tax =
        Math.round(
            subtotal *
            (Number(settings.tax) / 100)
        );


    const total =
        subtotal + tax;


    for (const item of cart) {

        const product =
            demoProducts.find(
                product =>
                    product.id === item.id
            );


        if (
            !product ||
            product.stock <
            item.quantity
        ) {

            alert(
                `Not enough stock for ${item.name}`
            );

            return;

        }

    }


    const invoice =
        "#INV-" +
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    const sale = {

        id: Date.now(),

        invoice: invoice,

        customer: "Walk-in Customer",

        date:
            new Date().toISOString(),

        items:
            cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),

        subtotal: subtotal,

        tax: tax,

        total: total,

        payment: "Cash"

    };


    sales.push(sale);

    saveData(
        STORAGE_KEYS.sales,
        sales
    );


    cart.forEach(item => {

        const product =
            demoProducts.find(
                product =>
                    product.id === item.id
            );


        if (product) {

            product.stock -=
                item.quantity;

        }

    });


    saveData(
        STORAGE_KEYS.products,
        demoProducts
    );


    alert(
        "SALE COMPLETED!\n\n" +
        "Invoice: " +
        invoice +
        "\n\n" +
        "Total: Rs. " +
        formatNumber(total) +
        "\n\n" +
        "Payment: Cash"
    );


    cart = [];

    renderPOS();

    showToast(
        "Sale completed successfully"
    );

}


// =====================================================
// PRODUCTS PAGE
// =====================================================

function renderProducts() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Products</h2>

                <p>
                    Add, edit and manage your products.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="openProductForm()"
            >
                + Add Product
            </button>

        </div>


        <div class="card">

            <input
                class="search-box"
                id="productPageSearch"
                placeholder="Search products..."
                oninput="searchProductsPage()"
            >


            <div
                id="productsTableContainer"
            >

                ${productsTableHTML()}

            </div>

        </div>

    `;

}


// =====================================================
// PRODUCTS TABLE
// =====================================================

function productsTableHTML(
    products = demoProducts
) {

    if (products.length === 0) {

        return `

            <div
                style="
                    padding:30px;
                    text-align:center;
                    color:#6b7280;
                "
            >
                No products found.
            </div>

        `;

    }


    return `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>

                    ${products.map(
                        product => `

                            <tr>

                                <td>
                                    <strong>
                                        ${product.icon}
                                        ${product.name}
                                    </strong>
                                </td>

                                <td>
                                    ${product.category}
                                </td>

                                <td>
                                    Rs.
                                    ${formatNumber(
                                        product.price
                                    )}
                                </td>

                                <td>
                                    ${product.stock}
                                </td>

                                <td>

                                    ${
                                        product.stock <= 0
                                            ? `
                                                <span
                                                    class="
                                                        badge
                                                        badge-danger
                                                    "
                                                >
                                                    Out of Stock
                                                </span>
                                            `
                                            : product.stock <= 5
                                            ? `
                                                <span
                                                    class="
                                                        badge
                                                        badge-warning
                                                    "
                                                >
                                                    Low Stock
                                                </span>
                                            `
                                            : `
                                                <span
                                                    class="
                                                        badge
                                                        badge-success
                                                    "
                                                >
                                                    In Stock
                                                </span>
                                            `
                                    }

                                </td>

                                <td>

                                    <button
                                        class="secondary-btn"
                                        onclick="
                                            editProduct(
                                                ${product.id}
                                            )
                                        "
                                    >
                                        Edit
                                    </button>


                                    <button
                                        class="secondary-btn"
                                        onclick="
                                            deleteProduct(
                                                ${product.id}
                                            )
                                        "
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        `
                    ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


// =====================================================
// SEARCH PRODUCTS PAGE
// =====================================================

function searchProductsPage() {

    const input =
        document.getElementById(
            "productPageSearch"
        );

    if (!input) return;


    const search =
        input.value
            .toLowerCase()
            .trim();


    const filtered =
        demoProducts.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search)
        );


    document.getElementById(
        "productsTableContainer"
    ).innerHTML =
        productsTableHTML(filtered);

}


// =====================================================
// ADD PRODUCT
// =====================================================

function openProductForm(
    product = null
) {

    const isEdit =
        product !== null;


    const id =
        isEdit
            ? product.id
            : "";


    const name =
        isEdit
            ? product.name
            : "";


    const category =
        isEdit
            ? product.category
            : "General";


    const price =
        isEdit
            ? product.price
            : "";


    const stock =
        isEdit
            ? product.stock
            : "";


    const icon =
        isEdit
            ? product.icon
            : "📦";


    const modal =
        document.createElement("div");


    modal.id =
        "productModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:9999;
        padding:20px;
    `;


    modal.innerHTML = `

        <div
            style="
                background:white;
                width:100%;
                max-width:500px;
                border-radius:14px;
                padding:25px;
                box-shadow:0 20px 50px rgba(0,0,0,.2);
            "
        >

            <h2>
                ${isEdit ? "Edit Product" : "Add Product"}
            </h2>


            <p
                style="
                    color:#6b7280;
                    margin-bottom:20px;
                "
            >
                Enter product information below.
            </p>


            <div
                class="form-grid"
                style="
                    grid-template-columns:1fr;
                "
            >

                <div class="form-field">

                    <label>
                        Product Name
                    </label>

                    <input
                        id="formProductName"
                        value="${escapeHTML(name)}"
                        placeholder="Product name"
                    >

                </div>


                <div class="form-field">

                    <label>
                        Category
                    </label>

                    <input
                        id="formProductCategory"
                        value="${escapeHTML(category)}"
                        placeholder="Category"
                    >

                </div>


                <div class="form-field">

                    <label>
                        Price
                    </label>

                    <input
                        id="formProductPrice"
                        type="number"
                        min="0"
                        value="${price}"
                        placeholder="Price"
                    >

                </div>


                <div class="form-field">

                    <label>
                        Stock
                    </label>

                    <input
                        id="formProductStock"
                        type="number"
                        min="0"
                        value="${stock}"
                        placeholder="Stock"
                    >

                </div>


                <div class="form-field">

                    <label>
                        Icon
                    </label>

                    <input
                        id="formProductIcon"
                        value="${escapeHTML(icon)}"
                        placeholder="📦"
                    >

                </div>

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    margin-top:20px;
                "
            >

                <button
                    class="primary-btn"
                    style="flex:1"
                    onclick="
                        saveProductFromForm(
                            ${id || "null"}
                        )
                    "
                >
                    ${isEdit ? "Update Product" : "Save Product"}
                </button>


                <button
                    class="secondary-btn"
                    style="flex:1"
                    onclick="closeProductForm()"
                >
                    Cancel
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

}


function closeProductForm() {

    const modal =
        document.getElementById(
            "productModal"
        );

    if (modal) {
        modal.remove();
    }

}


// =====================================================
// SAVE PRODUCT
// =====================================================

function saveProductFromForm(
    productId = null
) {

    const name =
        document
            .getElementById(
                "formProductName"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "formProductCategory"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "formProductPrice"
                )
                .value
        );


    const stock =
        Number(
            document
                .getElementById(
                    "formProductStock"
                )
                .value
        );


    const icon =
        document
            .getElementById(
                "formProductIcon"
            )
            .value
            .trim() || "📦";


    if (!name) {

        alert(
            "Please enter product name."
        );

        return;

    }


    if (
        isNaN(price) ||
        price < 0
    ) {

        alert(
            "Please enter a valid price."
        );

        return;

    }


    if (
        isNaN(stock) ||
        stock < 0
    ) {

        alert(
            "Please enter a valid stock."
        );

        return;

    }


    if (productId) {

        const product =
            demoProducts.find(
                product =>
                    product.id === productId
            );


        if (product) {

            product.name = name;
            product.category = category;
            product.price = price;
            product.stock = stock;
            product.icon = icon;

        }


        showToast(
            "Product updated successfully"
        );

    } else {

        const newProduct = {

            id:
                Date.now(),

            name:
                name,

            category:
                category || "General",

            price:
                price,

            stock:
                stock,

            icon:
                icon

        };


        demoProducts.push(
            newProduct
        );


        showToast(
            "Product added successfully"
        );

    }


    saveData(
        STORAGE_KEYS.products,
        demoProducts
    );


    closeProductForm();

    renderProducts();

}


// =====================================================
// EDIT PRODUCT
// =====================================================

function editProduct(
    productId
) {

    const product =
        demoProducts.find(
            product =>
                product.id === productId
        );


    if (!product) return;


    openProductForm(product);

}


// =====================================================
// DELETE PRODUCT
// =====================================================

function deleteProduct(
    productId
) {

    const product =
        demoProducts.find(
            product =>
                product.id === productId
        );


    if (!product) return;


    if (
        !confirm(
            `Delete "${product.name}"?`
        )
    ) {

        return;

    }


    demoProducts =
        demoProducts.filter(
            product =>
                product.id !== productId
        );


    saveData(
        STORAGE_KEYS.products,
        demoProducts
    );


    showToast(
        "Product deleted"
    );


    renderProducts();

}


// =====================================================
// INVENTORY
// =====================================================

function renderInventory() {

    const total =
        demoProducts.reduce(
            (sum, product) =>
                sum + Number(product.stock),
            0
        );


    const low =
        demoProducts.filter(
            product =>
                product.stock > 0 &&
                product.stock <= 5
        ).length;


    const out =
        demoProducts.filter(
            product =>
                product.stock <= 0
        ).length;


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Inventory</h2>

                <p>
                    Monitor your current stock.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="showPage('products')"
            >
                Manage Products
            </button>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <div class="stat-label">
                    Products
                </div>

                <div class="stat-value">
                    ${demoProducts.length}
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-label">
                    Total Stock
                </div>

                <div class="stat-value">
                    ${formatNumber(total)}
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-label">
                    Low Stock
                </div>

                <div class="stat-value">
                    ${low}
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-label">
                    Out of Stock
                </div>

                <div class="stat-value">
                    ${out}
                </div>

            </div>

        </div>


        <div
            class="card"
            style="margin-top:18px"
        >

            <div class="card-title">
                Stock Overview
            </div>

            ${productsTableHTML()}

        </div>

    `;

}


// =====================================================
// CUSTOMERS
// =====================================================

function renderCustomers() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Customers</h2>

                <p>
                    Manage customer records.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="addCustomer()"
            >
                + Add Customer
            </button>

        </div>


        <div class="card">

            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${customers.map(
                            customer => `

                                <tr>

                                    <td>
                                        <strong>
                                            ${customer.name}
                                        </strong>
                                    </td>

                                    <td>
                                        ${customer.phone}
                                    </td>

                                    <td>

                                        <button
                                            class="secondary-btn"
                                            onclick="
                                                editCustomer(
                                                    ${customer.id}
                                                )
                                            "
                                        >
                                            Edit
                                        </button>


                                        <button
                                            class="secondary-btn"
                                            onclick="
                                                deleteCustomer(
                                                    ${customer.id}
                                                )
                                            "
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            `
                        ).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function addCustomer() {

    const name =
        prompt(
            "Customer name:"
        );


    if (!name) return;


    const phone =
        prompt(
            "Customer phone:"
        ) || "";


    customers.push({

        id:
            Date.now(),

        name:
            name.trim(),

        phone:
            phone.trim()

    });


    saveData(
        STORAGE_KEYS.customers,
        customers
    );


    renderCustomers();

    showToast(
        "Customer added successfully"
    );

}


function editCustomer(
    customerId
) {

    const customer =
        customers.find(
            customer =>
                customer.id === customerId
        );


    if (!customer) return;


    const name =
        prompt(
            "Customer name:",
            customer.name
        );


    if (!name) return;


    const phone =
        prompt(
            "Customer phone:",
            customer.phone
        );


    customer.name =
        name.trim();

    customer.phone =
        phone
            ? phone.trim()
            : "";


    saveData(
        STORAGE_KEYS.customers,
        customers
    );


    renderCustomers();

    showToast(
        "Customer updated"
    );

}


function deleteCustomer(
    customerId
) {

    const customer =
        customers.find(
            customer =>
                customer.id === customerId
        );


    if (!customer) return;


    if (
        !confirm(
            `Delete "${customer.name}"?`
        )
    ) {
        return;
    }


    customers =
        customers.filter(
            customer =>
                customer.id !== customerId
        );


    saveData(
        STORAGE_KEYS.customers,
        customers
    );


    renderCustomers();

    showToast(
        "Customer deleted"
    );

}


// =====================================================
// SUPPLIERS
// =====================================================

function renderSuppliers() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Suppliers</h2>

                <p>
                    Manage suppliers and vendors.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="addSupplier()"
            >
                + Add Supplier
            </button>

        </div>


        <div class="card">

            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>Supplier</th>
                            <th>Company</th>
                            <th>Phone</th>
                            <th>Balance</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>

                        ${suppliers.map(
                            supplier => `

                                <tr>

                                    <td>
                                        <strong>
                                            ${supplier.name}
                                        </strong>
                                    </td>

                                    <td>
                                        ${supplier.company}
                                    </td>

                                    <td>
                                        ${supplier.phone}
                                    </td>

                                    <td>
                                        Rs.
                                        ${formatNumber(
                                            supplier.balance
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            class="secondary-btn"
                                            onclick="
                                                editSupplier(
                                                    ${supplier.id}
                                                )
                                            "
                                        >
                                            Edit
                                        </button>


                                        <button
                                            class="secondary-btn"
                                            onclick="
                                                deleteSupplier(
                                                    ${supplier.id}
                                                )
                                            "
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            `
                        ).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function addSupplier() {

    const name =
        prompt(
            "Supplier name:"
        );


    if (!name) return;


    const company =
        prompt(
            "Company:"
        ) || "";


    const phone =
        prompt(
            "Phone:"
        ) || "";


    const balance =
        Number(
            prompt(
                "Balance:",
                "0"
            )
        ) || 0;


    suppliers.push({

        id:
            Date.now(),

        name:
            name.trim(),

        company:
            company.trim(),

        phone:
            phone.trim(),

        balance:
            balance

    });


    saveData(
        STORAGE_KEYS.suppliers,
        suppliers
    );


    renderSuppliers();

    showToast(
        "Supplier added successfully"
    );

}


function editSupplier(
    supplierId
) {

    const supplier =
        suppliers.find(
            supplier =>
                supplier.id === supplierId
        );


    if (!supplier) return;


    const name =
        prompt(
            "Supplier name:",
            supplier.name
        );


    if (!name) return;


    const company =
        prompt(
            "Company:",
            supplier.company
        );


    const phone =
        prompt(
            "Phone:",
            supplier.phone
        );


    const balance =
        Number(
            prompt(
                "Balance:",
                supplier.balance
            )
        ) || 0;


    supplier.name =
        name.trim();

    supplier.company =
        company
            ? company.trim()
            : "";

    supplier.phone =
        phone
            ? phone.trim()
            : "";

    supplier.balance =
        balance;


    saveData(
        STORAGE_KEYS.suppliers,
        suppliers
    );


    renderSuppliers();

    showToast(
        "Supplier updated"
    );

}


function deleteSupplier(
    supplierId
) {

    const supplier =
        suppliers.find(
            supplier =>
                supplier.id === supplierId
        );


    if (!supplier) return;


    if (
        !confirm(
            `Delete "${supplier.name}"?`
        )
    ) {
        return;
    }


    suppliers =
        suppliers.filter(
            supplier =>
                supplier.id !== supplierId
        );


    saveData(
        STORAGE_KEYS.suppliers,
        suppliers
    );


    renderSuppliers();

    showToast(
        "Supplier deleted"
    );

}


// =====================================================
// PURCHASES
// =====================================================

function renderPurchases() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Purchases</h2>

                <p>
                    Track stock purchases from suppliers.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="newPurchase()"
            >
                + New Purchase
            </button>

        </div>


        <div class="card">

            <div
                style="
                    padding:20px;
                    color:#6b7280;
                "
            >
                Purchase management demo.
                Add stock through the New Purchase button.
            </div>

        </div>

    `;

}


function newPurchase() {

    const productName =
        prompt(
            "Enter product name to receive stock:"
        );


    if (!productName) return;


    const product =
        demoProducts.find(
            product =>
                product.name
                    .toLowerCase() ===
                productName
                    .toLowerCase()
        );


    if (!product) {

        alert(
            "Product not found. Please add it from Products first."
        );

        return;

    }


    const quantity =
        Number(
            prompt(
                "Quantity received:",
                "1"
            )
        );


    if (
        !quantity ||
        quantity <= 0
    ) {

        return;

    }


    product.stock += quantity;


    saveData(
        STORAGE_KEYS.products,
        demoProducts
    );


    showToast(
        `${product.name} stock updated`
    );


    renderPurchases();

}


// =====================================================
// SALES
// =====================================================

function renderSales() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Sales</h2>

                <p>
                    View completed sales and invoices.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="showPage('pos')"
            >
                + New Sale
            </button>

        </div>


        <div class="card">

            ${
                sales.length === 0
                    ? `
                        <div
                            style="
                                padding:35px;
                                text-align:center;
                                color:#6b7280;
                            "
                        >
                            No sales yet.
                        Create your first sale from POS.
                        </div>
                    `
                    : salesTableHTML()
            }

        </div>

    `;

}


function salesTableHTML() {

    return `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Invoice</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Total</th>
                        <th>Action</th>

                    </tr>

                </thead>


                <tbody>

                    ${[...sales]
                        .reverse()
                        .map(
                            sale => `

                                <tr>

                                    <td>
                                        ${sale.invoice}
                                    </td>

                                    <td>
                                        ${sale.customer}
                                    </td>

                                    <td>
                                        ${new Date(
                                            sale.date
                                        ).toLocaleDateString(
                                            "en-PK"
                                        )}
                                    </td>

                                    <td>
                                        ${sale.payment}
                                    </td>

                                    <td>
                                        <strong>
                                            Rs.
                                            ${formatNumber(
                                                sale.total
                                            )}
                                        </strong>
                                    </td>

                                    <td>

                                        <button
                                            class="secondary-btn"
                                            onclick="
                                                viewSale(
                                                    ${sale.id}
                                                )
                                            "
                                        >
                                            View
                                        </button>

                                    </td>

                                </tr>

                            `
                        ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


function viewSale(
    saleId
) {

    const sale =
        sales.find(
            sale =>
                sale.id === saleId
        );


    if (!sale) return;


    const items =
        sale.items
            .map(
                item =>
                    `${item.name} x ${item.quantity}`
            )
            .join("\n");


    alert(
        "INVOICE " +
        sale.invoice +
        "\n\n" +
        items +
        "\n\n" +
        "Subtotal: Rs. " +
        formatNumber(
            sale.subtotal
        ) +
        "\nTax: Rs. " +
        formatNumber(
            sale.tax
        ) +
        "\nTotal: Rs. " +
        formatNumber(
            sale.total
        ) +
        "\nPayment: " +
        sale.payment
    );

}


// =====================================================
// EXPENSES
// =====================================================

function renderExpenses() {

    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Expenses</h2>

                <p>
                    Track business expenses.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="addExpense()"
            >
                + Add Expense
            </button>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <div class="stat-label">
                    Total Expenses
                </div>

                <div class="stat-value">
                    Rs.
                    ${formatNumber(total)}
                </div>

            </div>

        </div>


        <div
            class="card"
            style="margin-top:18px"
        >

            <div class="card-title">
                Recent Expenses
            </div>

            ${
                expenses.length === 0
                    ? `
                        <div
                            style="
                                padding:25px;
                                color:#6b7280;
                            "
                        >
                            No expenses added.
                        </div>
                    `
                    : expenseTable()
            }

        </div>

    `;

}


function addExpense() {

    const description =
        prompt(
            "Expense description:"
        );


    if (!description) return;


    const category =
        prompt(
            "Category:",
            "General"
        ) || "General";


    const amount =
        Number(
            prompt(
                "Amount:",
                "0"
            )
        );


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;

    }


    expenses.push({

        id:
            Date.now(),

        description:
            description.trim(),

        category:
            category.trim(),

        amount:
            amount,

        date:
            new Date().toISOString()

    });


    saveData(
        STORAGE_KEYS.expenses,
        expenses
    );


    renderExpenses();

    showToast(
        "Expense added successfully"
    );

}


function expenseTable() {

    return `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Description</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    ${[...expenses]
                        .reverse()
                        .map(
                            expense => `

                                <tr>

                                    <td>
                                        ${expense.description}
                                    </td>

                                    <td>
                                        ${expense.category}
                                    </td>

                                    <td>
                                        ${new Date(
                                            expense.date
                                        ).toLocaleDateString(
                                            "en-PK"
                                        )}
                                    </td>

                                    <td>
                                        Rs.
                                        ${formatNumber(
                                            expense.amount
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            class="secondary-btn"
                                            onclick="
                                                deleteExpense(
                                                    ${expense.id}
                                                )
                                            "
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            `
                        ).join("")}

                </tbody>

            </table>

        </div>

    `;

}


function deleteExpense(
    expenseId
) {

    if (
        !confirm(
            "Delete this expense?"
        )
    ) {
        return;
    }


    expenses =
        expenses.filter(
            expense =>
                expense.id !== expenseId
        );


    saveData(
        STORAGE_KEYS.expenses,
        expenses
    );


    renderExpenses();

    showToast(
        "Expense deleted"
    );

}


// =====================================================
// REPORTS
// =====================================================

function renderReports() {

    const totalSales =
        sales.reduce(
            (sum, sale) =>
                sum + sale.total,
            0
        );


    const totalExpenses =
        expenses.reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );


    const estimatedProfit =
        totalSales -
        totalExpenses;


    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Reports</h2>

                <p>
                    Business performance overview.
                </p>

            </div>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <div class="stat-label">
                    Total Sales
                </div>

                <div class="stat-value">
                    Rs.
                    ${formatNumber(totalSales)}
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-label">
                    Total Orders
                </div>

                <div class="stat-value">
                    ${sales.length}
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-label">
                    Expenses
                </div>

                <div class="stat-value">
                    Rs.
                    ${formatNumber(totalExpenses)}
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-label">
                    Estimated Profit
                </div>

                <div class="stat-value">
                    Rs.
                    ${formatNumber(
                        estimatedProfit
                    )}
                </div>

            </div>

        </div>


        <div
            class="card"
            style="margin-top:18px"
        >

            <div class="card-title">
                Sales Overview
            </div>

            ${salesBars()}

        </div>

    `;

}


// =====================================================
// USERS
// =====================================================

function renderUsers() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Users & Roles</h2>

                <p>
                    Manage system users and permissions.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="
                    showToast(
                        'User management can be connected to Firebase later'
                    )
                "
            >
                + Add User
            </button>

        </div>


        <div class="card">

            <div class="table-wrapper">

                <table class="data-table">

                    <thead>

                        <tr>

                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                <strong>
                                    Administrator
                                </strong>
                            </td>

                            <td>
                                admin@smartpos.com
                            </td>

                            <td>
                                Admin
                            </td>

                            <td>

                                <span
                                    class="
                                        badge
                                        badge-success
                                    "
                                >
                                    Active
                                </span>

                            </td>

                        </tr>


                        <tr>

                            <td>
                                <strong>
                                    Sales User
                                </strong>
                            </td>

                            <td>
                                sales@smartpos.com
                            </td>

                            <td>
                                Cashier
                            </td>

                            <td>

                                <span
                                    class="
                                        badge
                                        badge-success
                                    "
                                >
                                    Active
                                </span>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


// =====================================================
// SETTINGS
// =====================================================

function renderSettings() {

    document.getElementById(
        "pageContent"
    ).innerHTML = `

        <div class="page-header">

            <div>

                <h2>Settings</h2>

                <p>
                    Configure your POS system.
                </p>

            </div>

        </div>


        <div class="card">

            <div class="card-title">
                Business Information
            </div>


            <div class="form-grid">

                <div class="form-field">

                    <label>
                        Business Name
                    </label>

                    <input
                        id="businessName"
                        value="${escapeHTML(
                            settings.businessName
                        )}"
                    >

                </div>


                <div class="form-field">

                    <label>
                        Phone
                    </label>

                    <input
                        id="businessPhone"
                        value="${escapeHTML(
                            settings.phone
                        )}"
                    >

                </div>


                <div class="form-field">

                    <label>
                        Currency
                    </label>

                    <select id="businessCurrency">

                        <option
                            value="PKR"
                            ${
                                settings.currency ===
                                "PKR"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pakistani Rupee (PKR)
                        </option>

                        <option
                            value="USD"
                            ${
                                settings.currency ===
                                "USD"
                                    ? "selected"
                                    : ""
                            }
                        >
                            US Dollar (USD)
                        </option>

                    </select>

                </div>


                <div class="form-field">

                    <label>
                        Tax %
                    </label>

                    <input
                        id="businessTax"
                        value="${settings.tax}"
                        type="number"
                        min="0"
                        max="100"
                    >

                </div>

            </div>


            <button
                class="primary-btn"
                style="margin-top:20px"
                onclick="saveSettings()"
            >
                Save Settings
            </button>


            <button
                class="secondary-btn"
                style="margin-top:10px"
                onclick="resetDemoData()"
            >
                Reset Demo Data
            </button>

        </div>

    `;

}


function saveSettings() {

    settings.businessName =
        document.getElementById(
            "businessName"
        ).value.trim();


    settings.phone =
        document.getElementById(
            "businessPhone"
        ).value.trim();


    settings.currency =
        document.getElementById(
            "businessCurrency"
        ).value;


    settings.tax =
        Number(
            document.getElementById(
                "businessTax"
            ).value
        ) || 0;


    saveData(
        STORAGE_KEYS.settings,
        settings
    );


    showToast(
        "Settings saved successfully"
    );

}


// =====================================================
// RESET DEMO DATA
// =====================================================

function resetDemoData() {

    if (
        !confirm(
            "Reset all demo data?\n\n" +
            "Products, customers, sales and expenses " +
            "will return to the original demo data."
        )
    ) {

        return;

    }


    demoProducts =
        JSON.parse(
            JSON.stringify(
                defaultProducts
            )
        );


    customers =
        JSON.parse(
            JSON.stringify(
                defaultCustomers
            )
        );


    suppliers =
        JSON.parse(
            JSON.stringify(
                defaultSuppliers
            )
        );


    sales = [];

    expenses = [];


    settings = {

        businessName:
            "Smart POS Store",

        phone:
            "+92 300 1234567",

        currency:
            "PKR",

        tax:
            5

    };


    saveData(
        STORAGE_KEYS.products,
        demoProducts
    );

    saveData(
        STORAGE_KEYS.customers,
        customers
    );

    saveData(
        STORAGE_KEYS.suppliers,
        suppliers
    );

    saveData(
        STORAGE_KEYS.sales,
        sales
    );

    saveData(
        STORAGE_KEYS.expenses,
        expenses
    );

    saveData(
        STORAGE_KEYS.settings,
        settings
    );


    cart = [];


    showToast(
        "Demo data reset successfully"
    );


    renderSettings();

}


// =====================================================
// MOBILE SIDEBAR
// =====================================================

function toggleSidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (!sidebar) return;


    sidebar.classList.toggle(
        "open"
    );

}


// =====================================================
// TOAST
// =====================================================

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.style.display =
        "block";


    setTimeout(
        () => {

            toast.style.display =
                "none";

        },
        2500
    );

}


// =====================================================
// NUMBER FORMAT
// =====================================================

function formatNumber(
    number
) {

    return Number(
        number
    ).toLocaleString(
        "en-PK"
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// STARTUP
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDate();

    }
);