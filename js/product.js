let products = [];
let index = 0;

// Hàm lấy thông tin chi tiết sản phẩm từ file JSON
async function getProductById(productId) {
    try {
        const response = await fetch('data/detailproducts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        console.log('Detail products:', products); // Debug log
        console.log('Looking for product with ID:', productId, 'Type:', typeof productId); // Debug log
        
        // Chuyển đổi productId thành số để so sánh
        const numericProductId = parseInt(productId, 10);
        const product = products.find(product => product.id === numericProductId);
        
        console.log('Found product:', product); // Debug log
        return product;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

// Hàm hiển thị chi tiết sản phẩm
async function showProductDetail(productId) {
    console.log('Showing detail for product:', productId); // Debug log
    const product = await getProductById(productId);
    if (!product) {
        console.error('Product not found');
        return;
    }

    // Cập nhật nội dung modal
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = formatPrice(product.price);
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductIngredients').textContent = product.ingredients;
    document.getElementById('modalProductUsage').textContent = product.usage;

    // Hiển thị modal
    const productModal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    productModal.show();
}

// Hàm định dạng giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

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
            }
        })
        .catch(error => console.error('Lỗi khi lấy JSON:', error));
});

function renderProducts(products, container) {
    products.forEach((product, index) => {
        const delay = 200 + (index * 200);

        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 mb-4';
        productCard.setAttribute('data-aos', 'fade-up');
        productCard.setAttribute('data-aos-delay', delay);

        productCard.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                    <div class="product-overlay">
                        <button class="btn btn-outline-light quick-view-btn" data-product-id="${product.id}">Quick View</button>
                    </div>
                </div>
                <div class="product-info text-center p-3">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">${formatPrice(product.price)}</span>
                    <button class="btn btn-primary mt-2 add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        container.appendChild(productCard);
    });

    // Add event listeners to the new buttons
    addEventListeners();

    // Re-initialize AOS after adding elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function addEventListeners() {
    // Quick View buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            console.log('Quick view clicked for product:', productId); // Debug log
            showProductDetail(productId);
        });
    });

    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            console.log(`Added product ${productId} to cart`);
            // Add your cart functionality here
        });
    });
}