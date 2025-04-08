let products = [];
let index = 0;
document.addEventListener('DOMContentLoaded', function () {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            console.log(products);
            const productContainer = document.querySelector('#products .row');

            // Clear any existing content
            if (productContainer) {
                productContainer.innerHTML = '';
                renderProducts(products.slice(index, index+=3), productContainer);
            }
            const showMoreButton = document.querySelector('#more-products');
            if (showMoreButton) {
                showMoreButton.addEventListener('click', function () {
                    
                    console.log('Show more button clicked!'); // Debug output
                    const productContainer = document.querySelector('#products .row');
                    const additionalProducts = products.slice(index, index+=3); // Get the next 3 products
                    renderProducts(additionalProducts, productContainer);
                    if (index >= products.length) {
                        console.log('No more products to load');
                        showMoreButton.style.display = 'none';
                        return;
                    }
                });
            } else {
                console.error('Show more button not found in the DOM');
            }// Dữ liệu JSON đã được parse thành mảng object
        })
        .catch(error => console.error('Lỗi khi lấy JSON:', error));
    // Get the container where products will be rendered

});

/**
 * Renders product cards in the specified container
 * @param {Array} products - Array of product objects
 * @param {Element} container - DOM element to render products into
 */
function renderProducts(products, container) {
    // Loop through products and create HTML for each
    products.forEach((product, index) => {
        const delay = 200 + (index * 200); // Increasing delay for each product

        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        productCard.setAttribute('data-aos', 'fade-up');
        productCard.setAttribute('data-aos-delay', delay);

        productCard.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                    <div class="product-overlay">
                        <a href="#" class="btn btn-outline-light" data-product-id="${product.id}">Quick View</a>
                    </div>
                </div>
                <div class="product-info text-center p-3">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary mt-2" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        container.appendChild(productCard);
    });

    // Re-initialize AOS after adding elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }

    // Add event listeners to the new buttons
    addEventListeners();
}

/**
 * Adds event listeners to product buttons
 */
function addEventListeners() {
    // Quick View buttons
    document.querySelectorAll('.product-overlay .btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            console.log(`Quick view for product ${productId}`);
            // Add your quick view functionality here
        });
    });

    // Add to Cart buttons
    document.querySelectorAll('.product-info .btn-primary').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            console.log(`Added product ${productId} to cart`);
            // Add your cart functionality here
        });
    });
}