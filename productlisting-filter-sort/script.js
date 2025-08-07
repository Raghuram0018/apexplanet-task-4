// --- MOCK DATA ---
const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Sony", "Asus", "Motorola", "Nokia", "Realme"];
const modelsByBrand = { "Apple": ["iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone SE", "iPhone 13", "iPhone 13 Mini", "iPhone 12", "iPhone 11", "iPhone XR"], "Samsung": ["Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S23", "Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy A54", "Galaxy A34", "Galaxy M34", "Galaxy F54", "Galaxy S22"], "Google": ["Pixel 8 Pro", "Pixel 8", "Pixel 7a", "Pixel 7 Pro", "Pixel 7", "Pixel 6a", "Pixel 6", "Pixel Fold", "Pixel 5a", "Pixel 5"], "OnePlus": ["OnePlus 12", "OnePlus 11", "OnePlus Nord 3", "OnePlus 10 Pro", "OnePlus 10T", "OnePlus 9RT", "OnePlus 9", "OnePlus 8T", "OnePlus Nord CE 3", "OnePlus Open"], "Xiaomi": ["Xiaomi 14 Ultra", "Xiaomi 13 Pro", "Redmi Note 13 Pro+", "Poco F5", "Mi 11X", "Redmi K50i", "Xiaomi 12 Pro", "Redmi Note 12", "Poco X5 Pro", "Mi 11 Lite"], "Sony": ["Xperia 1 V", "Xperia 5 V", "Xperia 10 V", "Xperia 1 IV", "Xperia 5 IV", "Xperia Pro-I", "Xperia 1 III", "Xperia 5 III", "Xperia 10 IV", "Xperia Ace III"], "Asus": ["ROG Phone 8 Pro", "ROG Phone 7", "Zenfone 10", "Zenfone 9", "ROG Phone 6", "ROG Phone 5s", "Zenfone 8", "ROG Phone 5", "Zenfone 7", "ROG Phone 3"], "Motorola": ["Edge 50 Pro", "Razr 40 Ultra", "Edge 40", "Moto G84", "Moto G54", "Edge 30 Ultra", "Razr 2022", "Moto G73", "Edge 30 Fusion", "Moto X40"], "Nokia": ["Nokia XR21", "Nokia G42", "Nokia X30", "Nokia G60", "Nokia G22", "Nokia C32", "Nokia 8.3", "Nokia 9 PureView", "Nokia 7.2", "Nokia 6.2"], "Realme": ["Realme GT 5 Pro", "Realme 12 Pro+", "Realme GT Neo 5", "Realme 11 Pro+", "Realme 10 Pro", "Realme 9 Pro+", "Realme GT 2 Pro", "Realme Narzo 60 Pro", "Realme C55", "Realme GT Master Edition"] };
const networkTypes = ["5G", "4G"];

function generateProducts() {
    let products = [];
    let id = 1;
    brands.forEach(brand => {
        modelsByBrand[brand].forEach(model => {
            products.push({ id: id++, brand: brand, model: model, camera: `${Math.floor(Math.random() * 108) + 12}MP`, storage: `${[64, 128, 256, 512][Math.floor(Math.random() * 4)]}GB`, battery: `${Math.floor(Math.random() * 2000) + 3000}mAh`, network: networkTypes[Math.floor(Math.random() * networkTypes.length)], price: parseFloat((Math.random() * 1800 + 200).toFixed(2)), rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), imageUrl: `https://placehold.co/400x400/e2e8f0/334155?text=${encodeURIComponent(model.split(' ').join('+'))}` });
        });
    });
    return products;
}

const products = generateProducts();

// --- DOM ELEMENTS ---
const productGrid = document.getElementById('product-grid');
const brandFiltersContainer = document.getElementById('brand-filters');
const networkFiltersContainer = document.getElementById('network-filters');
const priceFilter = document.getElementById('price-filter');
const priceValue = document.getElementById('price-value');
const sortBy = document.getElementById('sort-by');
const searchBar = document.getElementById('search-bar');
const noProductsMessage = document.getElementById('no-products');
const loader = document.getElementById('loader');
const wishlistBtn = document.getElementById('wishlist-btn');
const cartBtn = document.getElementById('cart-btn');
const wishlistModal = document.getElementById('wishlist-modal');
const cartModal = document.getElementById('cart-modal');
const productDetailModal = document.getElementById('product-detail-modal');
const productDetailContainer = document.getElementById('product-detail-container');
const wishlistCountEl = document.getElementById('wishlist-count');
const cartCountEl = document.getElementById('cart-count');
const filtersSidebar = document.getElementById('filters-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
const recentlyViewedSection = document.getElementById('recently-viewed-section');
const recentlyViewedGrid = document.getElementById('recently-viewed-grid');
const compareButtonContainer = document.getElementById('compare-button-container');
const compareBtn = document.getElementById('compare-btn');
const compareCount = document.getElementById('compare-count');
const compareModal = document.getElementById('compare-modal');
const compareItemsContainer = document.getElementById('compare-items-container');


// --- STATE ---
let currentFilters = { brands: [], networks: [], maxPrice: 2000, searchTerm: '' };
let currentSort = 'default';
let wishlistItems = [];
let cartItems = [];
let recentlyViewedItems = [];
let compareItems = [];

// --- LOCAL STORAGE FUNCTIONS ---
const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- RENDER FUNCTIONS ---
function renderProduct(product) {
    const isChecked = compareItems.includes(product.id);
    return `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col relative" data-product-id="${product.id}">
            <div class="compare-checkbox-wrapper absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow">
                <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" class="compare-checkbox h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" data-product-id="${product.id}" ${isChecked ? 'checked' : ''}>
                </label>
            </div>
            <div class="product-card-link flex flex-col flex-grow cursor-pointer">
                <img src="${product.imageUrl}" alt="${product.model}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/400x400/e2e8f0/334155?text=Image+Not+Found';">
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="text-lg font-semibold text-gray-800 h-14">${product.brand} ${product.model}</h3>
                    <div class="flex justify-between items-center mt-4 pt-4 border-t">
                        <span class="text-xl font-bold text-indigo-600">₹${product.price.toFixed(2)}</span>
                        <div class="flex items-center">
                            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <span class="text-gray-600 ml-1">${product.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function renderFilters() {
    brandFiltersContainer.innerHTML = brands.map(brand => `<label class="flex items-center"><input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" value="${brand}"><span class="ml-2 text-gray-700">${brand}</span></label>`).join('');
    networkFiltersContainer.innerHTML = networkTypes.map(network => `<label class="flex items-center"><input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" value="${network}"><span class="ml-2 text-gray-700">${network}</span></label>`).join('');
}

function updateCounts() {
    wishlistCountEl.textContent = wishlistItems.length;
    cartCountEl.textContent = cartItems.length;
}

function renderRecentlyViewed() {
    if (recentlyViewedItems.length === 0) {
        recentlyViewedSection.classList.add('hidden');
        return;
    }
    recentlyViewedSection.classList.remove('hidden');
    const itemsToRender = recentlyViewedItems.map(id => products.find(p => p.id === id)).filter(Boolean); // Filter out any nulls if product list changes
    recentlyViewedGrid.innerHTML = itemsToRender.map(renderProduct).join('');
}


// --- MODAL RENDER FUNCTIONS ---
function renderModalItems(itemIds, containerId, isCart) {
    const container = document.getElementById(containerId);
    if (itemIds.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center py-8">Your ${isCart ? 'cart' : 'wishlist'} is empty.</p>`;
        if(isCart) document.getElementById('cart-footer').innerHTML = '';
        return;
    }

    const items = itemIds.map(id => products.find(p => p.id === id));
    container.innerHTML = items.map(item => `
        <div class="flex items-center justify-between p-2 border-b last:border-b-0">
            <div class="modal-product-link flex items-center flex-grow cursor-pointer" data-product-id="${item.id}">
                <img src="${item.imageUrl}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-grow px-4">
                    <h4 class="font-semibold">${item.brand} ${item.model}</h4>
                    <p class="text-indigo-600 font-bold">₹${item.price.toFixed(2)}</p>
                </div>
            </div>
            <button data-product-id="${item.id}" class="${isCart ? 'remove-from-cart' : 'remove-from-wishlist'} text-red-500 hover:text-red-700 font-semibold ml-4">Remove</button>
        </div>
    `).join('');

    if (isCart) {
        const totalPrice = items.reduce((total, item) => total + item.price, 0);
        document.getElementById('cart-footer').innerHTML = `
            <div class="flex justify-between items-center">
                <p class="text-xl font-bold">Total: <span class="text-indigo-600">₹${totalPrice.toFixed(2)}</span></p>
                <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">Checkout</button>
            </div>
        `;
    }
}

function renderStarRating(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        starsHtml += `<svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
    }
    if (halfStar) {
        starsHtml += `<svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clip-rule="evenodd" /><path d="M10 12.585V3.25a.75.75 0 01.75-.75h.001a.75.75 0 01.75.75v9.335l2.4-1.737a.75.75 0 01.976 1.226l-3.5 2.5a.75.75 0 01-.976 0l-3.5-2.5a.75.75 0 01.976-1.226L10 12.585z" fill-opacity="0.5"/></svg>`;
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += `<svg class="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>`;
    }
    return `<div class="flex items-center justify-center">${starsHtml}</div>`;
}

function renderProductDetailModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const isInWishlist = wishlistItems.includes(product.id);
    const isInCart = cartItems.includes(product.id);

    const wishlistBtnHtml = isInWishlist
        ? `<button class="w-full bg-pink-100 text-pink-600 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2" disabled><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>Added to Wishlist</button>`
        : `<button data-product-id="${product.id}" class="add-to-wishlist-detail w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">Add to Wishlist</button>`;

    const cartBtnHtml = isInCart
        ? `<button disabled class="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2">Added to Cart</button>`
        : `<button data-product-id="${product.id}" class="add-to-cart-detail w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">Add to Cart</button>`;

    productDetailContainer.innerHTML = `
        <button class="close-modal-btn absolute top-2 right-2 p-2 rounded-full bg-gray-800 bg-opacity-50 text-white hover:bg-opacity-75 z-10">&times;</button>
        <div class="max-h-[85vh] overflow-y-auto">
            <img src="${product.imageUrl}" alt="${product.model}" class="w-full h-64 object-cover rounded-t-lg">
            <div class="p-6 text-center">
                <h2 class="text-3xl font-bold text-gray-800">${product.brand} ${product.model}</h2>
                
                <div class="text-left my-6 bg-gray-100 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold mb-2 border-b pb-2">Features</h3>
                    <ul class="space-y-2 text-gray-600">
                        <li><strong>Camera:</strong> ${product.camera}</li>
                        <li><strong>Storage:</strong> ${product.storage}</li>
                        <li><strong>Battery:</strong> ${product.battery}</li>
                        <li><strong>Network:</strong> ${product.network}</li>
                    </ul>
                </div>
                
                <p class="text-4xl font-bold text-indigo-600 my-6">₹${product.price.toFixed(2)}</p>
                
                <div class="flex flex-col gap-3 my-6">
                    ${cartBtnHtml}
                    ${wishlistBtnHtml}
                </div>
                
                <div class="border-t pt-4">
                    ${renderStarRating(product.rating)}
                </div>
            </div>
        </div>
    `;
}

function renderCompareModal() {
    const items = compareItems.map(id => products.find(p => p.id === id));
    const features = ['Brand', 'Model', 'Price', 'Rating', 'Camera', 'Storage', 'Battery', 'Network'];

    let tableHTML = '<table class="w-full text-left border-collapse">';
    // Header row with images
    tableHTML += '<thead><tr><th class="p-2 border-b-2">Feature</th>';
    items.forEach(item => {
        tableHTML += `<th class="p-2 border-b-2 text-center"><img src="${item.imageUrl}" class="w-24 h-24 object-cover mx-auto rounded-lg"><p class="font-semibold mt-2">${item.brand} ${item.model}</p></th>`;
    });
    tableHTML += '</tr></thead>';

    // Body rows for each feature
    tableHTML += '<tbody>';
    features.forEach(feature => {
        tableHTML += `<tr class="hover:bg-gray-50"><td class="p-2 border-b font-semibold">${feature}</td>`;
        items.forEach(item => {
            let value = item[feature.toLowerCase()];
            if (feature === 'Price') value = `₹${item.price.toFixed(2)}`;
            tableHTML += `<td class="p-2 border-b text-center">${value}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    compareItemsContainer.innerHTML = tableHTML;
}


// --- LOGIC ---
let debounceTimer;
function applyFiltersAndSort() {
    loader.classList.remove('hidden');
    productGrid.classList.add('hidden');
    noProductsMessage.classList.add('hidden');

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        let filteredProducts = [...products];
        if (currentFilters.searchTerm) {
            const lowerCaseSearch = currentFilters.searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.model.toLowerCase().includes(lowerCaseSearch) || p.brand.toLowerCase().includes(lowerCaseSearch));
        }
        if (currentFilters.brands.length > 0) filteredProducts = filteredProducts.filter(p => currentFilters.brands.includes(p.brand));
        if (currentFilters.networks.length > 0) filteredProducts = filteredProducts.filter(p => currentFilters.networks.includes(p.network));
        filteredProducts = filteredProducts.filter(p => p.price <= currentFilters.maxPrice);

        switch (currentSort) {
            case 'rating-desc': filteredProducts.sort((a, b) => b.rating - a.rating); break;
            case 'rating-asc': filteredProducts.sort((a, b) => a.rating - b.rating); break;
            case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break;
            case 'price-asc': filteredProducts.sort((a, b) => a.price - b.price); break;
        }

        loader.classList.add('hidden');
        if (filteredProducts.length === 0) {
            noProductsMessage.classList.remove('hidden');
            productGrid.innerHTML = '';
        } else {
            productGrid.innerHTML = filteredProducts.map(renderProduct).join('');
            productGrid.classList.remove('hidden');
        }
    }, 300);
}

function addToRecentlyViewed(productId) {
    // Remove if it already exists to move it to the front
    recentlyViewedItems = recentlyViewedItems.filter(id => id !== productId);
    // Add to the front
    recentlyViewedItems.unshift(productId);
    // Keep the list at a max size of 4
    if (recentlyViewedItems.length > 4) {
        recentlyViewedItems.pop();
    }
    saveToStorage('recentlyViewed', recentlyViewedItems);
    renderRecentlyViewed();
}

function updateCompareButton() {
    const count = compareItems.length;
    compareCount.textContent = count;
    if (count >= 2) {
        compareButtonContainer.classList.remove('hidden');
    } else {
        compareButtonContainer.classList.add('hidden');
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Filter sidebar listeners
    const openSidebar = () => {
        filtersSidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('hidden');
    };
    const closeSidebar = () => {
        filtersSidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('hidden');
    };

    toggleFiltersBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    brandFiltersContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const brand = e.target.value;
            if (e.target.checked) currentFilters.brands.push(brand);
            else currentFilters.brands = currentFilters.brands.filter(b => b !== brand);
            applyFiltersAndSort();
        }
    });
    networkFiltersContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const network = e.target.value;
            if (e.target.checked) currentFilters.networks.push(network);
            else currentFilters.networks = currentFilters.networks.filter(n => n !== network);
            applyFiltersAndSort();
        }
    });
    priceFilter.addEventListener('input', (e) => {
        const value = parseInt(e.target.value, 10);
        currentFilters.maxPrice = value;
        priceValue.textContent = `₹${value}`;
        applyFiltersAndSort();
    });
    sortBy.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndSort();
    });
    searchBar.addEventListener('input', (e) => {
        currentFilters.searchTerm = e.target.value;
        applyFiltersAndSort();
    });

    // Product grid event delegation
    productGrid.addEventListener('click', (e) => {
        const cardLink = e.target.closest('.product-card-link');
        const compareCheckbox = e.target.closest('.compare-checkbox');

        if (compareCheckbox) {
            const productId = parseInt(compareCheckbox.dataset.productId, 10);
            if (compareCheckbox.checked) {
                if (compareItems.length < 4) {
                    compareItems.push(productId);
                } else {
                    compareCheckbox.checked = false;
                    alert("You can only compare up to 4 items.");
                }
            } else {
                compareItems = compareItems.filter(id => id !== productId);
            }
            saveToStorage('compare', compareItems);
            updateCompareButton();
        } else if (cardLink) {
            const card = cardLink.closest('.product-card');
            const productId = parseInt(card.dataset.productId, 10);
            addToRecentlyViewed(productId);
            renderProductDetailModal(productId);
            openModal(productDetailModal);
        }
    });

    // Recently viewed grid delegation
    recentlyViewedGrid.addEventListener('click', (e) => {
         const card = e.target.closest('.product-card');
         if (!card) return;
         const productId = parseInt(card.dataset.productId, 10);
         addToRecentlyViewed(productId);
         renderProductDetailModal(productId);
         openModal(productDetailModal);
    });

    // Modal event listeners
    const openModal = (modal) => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('.modal-container').classList.remove('scale-95', 'opacity-0');
        }, 10);
    };
    const closeModal = (modal) => {
        modal.classList.add('opacity-0');
        modal.querySelector('.modal-container').classList.add('scale-95', 'opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    wishlistBtn.addEventListener('click', () => {
        renderModalItems(wishlistItems, 'wishlist-items', false);
        openModal(wishlistModal);
    });
    cartBtn.addEventListener('click', () => {
        renderModalItems(cartItems, 'cart-items', true);
        openModal(cartModal);
    });
    compareBtn.addEventListener('click', () => {
        renderCompareModal();
        openModal(compareModal);
    });


    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close-modal-btn')) {
                closeModal(modal);
            }
        });
    });
    
    // Modal item removal and detail view click
    const handleModalInteraction = (e, modal, isCart) => {
        const removeButton = e.target.closest(isCart ? '.remove-from-cart' : '.remove-from-wishlist');
        const productLink = e.target.closest('.modal-product-link');

        if (removeButton) {
            const productId = parseInt(removeButton.dataset.productId, 10);
            if (isCart) {
                cartItems = cartItems.filter(id => id !== productId);
                saveToStorage('cart', cartItems);
                renderModalItems(cartItems, 'cart-items', true);
            } else {
                wishlistItems = wishlistItems.filter(id => id !== productId);
                saveToStorage('wishlist', wishlistItems);
                renderModalItems(wishlistItems, 'wishlist-items', false);
            }
            updateCounts();
        } else if (productLink) {
            const productId = parseInt(productLink.dataset.productId, 10);
            closeModal(modal);
            setTimeout(() => {
                addToRecentlyViewed(productId);
                renderProductDetailModal(productId);
                openModal(productDetailModal);
            }, 300); // Wait for close animation
        }
    };

    wishlistModal.addEventListener('click', e => handleModalInteraction(e, wishlistModal, false));
    cartModal.addEventListener('click', e => handleModalInteraction(e, cartModal, true));


    // Product Detail Modal button listeners
    productDetailModal.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const productId = parseInt(target.dataset.productId, 10);
        if (!productId) return;

        if (target.matches('.add-to-cart-detail')) {
            if (!cartItems.includes(productId)) {
                cartItems.push(productId);
                saveToStorage('cart', cartItems);
            }
        } else if (target.matches('.add-to-wishlist-detail')) {
            if (!wishlistItems.includes(productId)) {
                wishlistItems.push(productId);
                saveToStorage('wishlist', wishlistItems);
            }
        }
        updateCounts();
        renderProductDetailModal(productId); // Re-render the detail modal to update buttons
    });
}

// --- INITIALIZATION ---
function initialize() {
    wishlistItems = getFromStorage('wishlist');
    cartItems = getFromStorage('cart');
    recentlyViewedItems = getFromStorage('recentlyViewed');
    compareItems = getFromStorage('compare');
    
    updateCounts();
    renderFilters();
    applyFiltersAndSort();
    renderRecentlyViewed();
    updateCompareButton();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', initialize);
