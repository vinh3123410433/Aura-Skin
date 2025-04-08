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
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

document.addEventListener('DOMContentLoaded', function () {
    loadFeaturedProducts();
});

function loadFeaturedProducts() {
    fetch('data/detailproducts.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            const productsContainer = document.getElementById('featured-products');
            showProduct(products.slice(index, index += 4), productsContainer);

            const showMoreButton = document.querySelector('#more-products > div');
            showMoreButton.addEventListener('click', function () {
                showProduct(products.slice(index, index += 4), productsContainer);
                if (index >= products.length && showMoreButton) {
                    showMoreButton.style.display = 'none'; // Ẩn nút "Show More" nếu không còn sản phẩm nào
                }
            });
        })
        .catch(error => console.error('Error loading products:', error));
}

function addEventListenersToQuickViewButtons() {
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        // Xóa tất cả sự kiện click bằng cách clone và thay thế element
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Thêm sự kiện mới
        newButton.addEventListener('click', function () {
            showProductDetails(this);
        });
    });
}

function showProduct(featuredProducts, productsContainer) {
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-3 mb-4';
        productCard.setAttribute('data-aos', 'fade-up');

        productCard.innerHTML = `
            <div class="product-card h-100">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid">
                    <div class="product-overlay">
                        <button class="btn btn-sm btn-outline-light quick-view-btn" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
                <div class="product-info p-3">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-description">${product.description}</p>
                </div>
            </div>
        `;

        productsContainer.appendChild(productCard);
    });
    addEventListenersToQuickViewButtons(); // Thêm sự kiện cho các nút Quick View sau khi thêm sản phẩm vào DOM
}

function showProductDetails(button) {
    const productId = button.getAttribute('data-product-id');
    fetch('data/detailproducts.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === parseInt(productId));

            if (product) {
                // Update modal content
                document.getElementById('modal-product-image').src = product.image;
                document.getElementById('modal-product-name').textContent = product.name;
                document.getElementById('modal-product-price').textContent = `$${product.price.toFixed(2)}`;
                document.getElementById('modal-product-description').textContent = product.description;

                // Update ingredients
                const ingredientsList = document.getElementById('modal-product-ingredients');
                ingredientsList.innerHTML = '';
                product.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${ingredient}`;
                    ingredientsList.appendChild(li);
                });

                // Update usage
                document.getElementById('modal-product-usage').textContent = product.usage;

                // Update benefits
                const benefitsList = document.getElementById('modal-product-benefits');
                benefitsList.innerHTML = '';
                product.benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>${benefit}`;
                    benefitsList.appendChild(li);
                });

                // Update skin type
                document.getElementById('modal-product-skin-type').textContent = product.skinType.join(', ');

                // Update rating and reviews
                document.getElementById('modal-product-rating').innerHTML = `
                    ${product.rating} <i class="fas fa-star text-warning"></i>
                `;
                document.getElementById('modal-product-reviews').textContent = product.reviews;

                // Show modal
                const productModal = new bootstrap.Modal(document.getElementById('productModal'));
                
                // Xử lý sự kiện đóng modal
                const modalElement = document.getElementById('productModal');
                
                // Xóa event listener cũ nếu có
                modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
                
                // Thêm event listener mới
                modalElement.addEventListener('hidden.bs.modal', handleModalClose);

                productModal.show();
            }
        })
        .catch(error => console.error('Error loading product details:', error));
}

// Hàm xử lý khi modal đóng
function handleModalClose() {
    while (true) {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        } else break;
    }
    
    // Xóa class modal-open từ body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Reset nội dung modal
    document.getElementById('modal-product-image').src = '';
    document.getElementById('modal-product-name').textContent = '';
    document.getElementById('modal-product-price').textContent = '';
    document.getElementById('modal-product-description').textContent = '';
    document.getElementById('modal-product-usage').textContent = '';
    document.getElementById('modal-product-skin-type').textContent = '';
    document.getElementById('modal-product-rating').innerHTML = '';
    document.getElementById('modal-product-reviews').textContent = '';
    document.getElementById('modal-product-ingredients').innerHTML = '';
    document.getElementById('modal-product-benefits').innerHTML = '';
}