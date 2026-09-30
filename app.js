
        const productsData = [
            { id: 1, title: "Lumina Sonic Pro Wireless ANC", category: "Electronics", price: 249.99, oldPrice: 299.99, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop", badge: "Best Seller", desc: "Premium active noise cancelling headphones with 40-hour battery life." },
            { id: 2, title: "Apex Titanium Mechanical Watch", category: "Accessories", price: 189.50, oldPrice: 220.00, rating: 4.9, reviews: 88, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop", badge: "New", desc: "Aerospace grade titanium casing with sapphire glass automatic movement." },
            { id: 3, title: "Minimalist Leather Backpack", category: "Fashion", price: 125.00, oldPrice: 150.00, rating: 4.7, reviews: 65, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop", badge: "Sale", desc: "Full-grain leather with dedicated 16-inch laptop padded compartment." },
            { id: 4, title: "Smart Ambient Desk Lamp", category: "Home", price: 79.99, oldPrice: 99.99, rating: 4.6, reviews: 42, image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop", badge: "", desc: "Wireless Qi charging base with customizable ambient color spectrum." },
            { id: 5, title: "Cyber-Deck RGB Keyboard", category: "Electronics", price: 159.00, oldPrice: 189.00, rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop", badge: "Top Rated", desc: "Hot-swappable switches with per-key RGB illumination." },
            { id: 6, title: "Nordic Ceramic Coffee Set", category: "Home", price: 64.50, oldPrice: 80.00, rating: 4.8, reviews: 93, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop", badge: "", desc: "Handcrafted matte ceramic pour-over dripper and server." }
        ];

        let state = {
            cart: [],
            wishlist: [],
            category: "All",
            searchQuery: "",
            sort: "featured",
            discount: 0
        };

        document.addEventListener("DOMContentLoaded", () => {
            renderProducts();
            setupEventListeners();
            startCountdown();
        });

        function setupEventListeners() {
            // Search & Filters
            document.getElementById("searchInput").addEventListener("input", (e) => {
                state.searchQuery = e.target.value.toLowerCase();
                renderProducts();
            });

            document.getElementById("sortSelect").addEventListener("change", (e) => {
                state.sort = e.target.value;
                renderProducts();
            });

            document.querySelectorAll(".pill-btn[data-category]").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    document.querySelectorAll(".pill-btn[data-category]").forEach(b => b.classList.remove("active"));
                    e.target.classList.add("active");
                    state.category = e.target.dataset.category;
                    renderProducts();
                });
            });

            // Drawers & Modals Toggle
            const cartDrawer = document.getElementById("cartDrawer");
            const wishlistDrawer = document.getElementById("wishlistDrawer");
            const overlay = document.getElementById("drawerOverlay");

            document.getElementById("cartBtn").addEventListener("click", () => openDrawer(cartDrawer));
            document.getElementById("wishlistBtn").addEventListener("click", () => openDrawer(wishlistDrawer));
            document.getElementById("closeCartBtn").addEventListener("click", closeDrawers);
            document.getElementById("closeWishlistBtn").addEventListener("click", closeDrawers);
            overlay.addEventListener("click", closeDrawers);

            document.getElementById("closeQuickViewBtn").addEventListener("click", () => closeModal(document.getElementById("quickViewModal")));
            document.getElementById("closeCheckoutBtn").addEventListener("click", () => closeModal(document.getElementById("checkoutModal")));
            document.getElementById("checkoutBtn").addEventListener("click", () => {
                if(state.cart.length === 0) return showToast("Your cart is empty!");
                closeDrawers();
                openModal(document.getElementById("checkoutModal"));
            });

            document.getElementById("applyPromoBtn").addEventListener("click", () => {
                const val = document.getElementById("promoInput").value.trim().toUpperCase();
                if(val === "DISCOUNT10") {
                    state.discount = 0.10;
                    showToast("10% Discount Applied!");
                    updateCartUI();
                } else {
                    showToast("Invalid Promo Code");
                }
            });

            document.getElementById("checkoutForm").addEventListener("submit", (e) => {
                e.preventDefault();
                closeModal(document.getElementById("checkoutModal"));
                state.cart = [];
                updateCartUI();
                showToast("Order Placed Successfully!");
            });
        }

        function renderProducts() {
            const grid = document.getElementById("productsGrid");
            let filtered = productsData.filter(p => {
                const matchCat = state.category === "All" || p.category === state.category;
                const matchSearch = p.title.toLowerCase().includes(state.searchQuery);
                return matchCat && matchSearch;
            });

            if (state.sort === "low-high") filtered.sort((a,b) => a.price - b.price);
            if (state.sort === "high-low") filtered.sort((a,b) => b.price - a.price);
            if (state.sort === "rating") filtered.sort((a,b) => b.rating - a.rating);

            grid.innerHTML = filtered.map(p => {
                const isFav = state.wishlist.includes(p.id);
                return `
                    <div class="product-card">
                        <div class="img-wrap">
                            <img src="${p.image}" class="product-img" alt="${p.title}">
                            ${p.badge ? `<span class="tag-badge">${p.badge}</span>` : ''}
                            <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleWishlist(${p.id})">
                                <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                            </button>
                            <button class="quick-view-overlay" onclick="openQuickView(${p.id})">Quick View</button>
                        </div>
                        <span class="product-cat">${p.category}</span>
                        <h3 class="product-title">${p.title}</h3>
                        <div class="rating-box">
                            <i class="fa-solid fa-star"></i>
                            <span>${p.rating}</span>
                            <span class="rating-count">(${p.reviews})</span>
                        </div>
                        <div class="card-footer">
                            <div class="price-box">
                                <span class="price-curr">$${p.price.toFixed(2)}</span>
                                <span class="price-old">$${p.oldPrice.toFixed(2)}</span>
                            </div>
                            <button class="add-cart-btn" onclick="addToCart(${p.id})">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function addToCart(id) {
            const item = state.cart.find(i => i.id === id);
            if (item) item.qty++;
            else state.cart.push({ id, qty: 1 });
            updateCartUI();
            showToast("Added to Cart!");
        }

        function toggleWishlist(id) {
            const idx = state.wishlist.indexOf(id);
            if (idx > -1) state.wishlist.splice(idx, 1);
            else state.wishlist.push(id);
            updateWishlistUI();
            renderProducts();
        }

        function updateCartUI() {
            const badge = document.getElementById("cartBadge");
            const container = document.getElementById("cartItemsContainer");
            const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);

            badge.textContent = totalQty;
            badge.classList.toggle("active", totalQty > 0);

            let subtotal = 0;
            container.innerHTML = state.cart.map(item => {
                const prod = productsData.find(p => p.id === item.id);
                subtotal += prod.price * item.qty;
                return `
                    <div class="cart-item">
                        <img src="${prod.image}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${prod.title}</div>
                            <div class="cart-item-price">$${prod.price.toFixed(2)}</div>
                            <div class="qty-controls">
                                <button class="qty-btn" onclick="changeQty(${prod.id}, -1)">-</button>
                                <span>${item.qty}</span>
                                <button class="qty-btn" onclick="changeQty(${prod.id}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            const discountVal = subtotal * state.discount;
            const shipping = state.cart.length > 0 ? 10 : 0;
            const grandTotal = Math.max(0, subtotal - discountVal + shipping);

            document.getElementById("cartSubtotal").textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById("cartDiscount").textContent = `-$${discountVal.toFixed(2)}`;
            document.getElementById("cartShipping").textContent = `$${shipping.toFixed(2)}`;
            document.getElementById("cartGrandTotal").textContent = `$${grandTotal.toFixed(2)}`;
        }

        function changeQty(id, delta) {
            const item = state.cart.find(i => i.id === id);
            if (!item) return;
            item.qty += delta;
            if (item.qty <= 0) state.cart = state.cart.filter(i => i.id !== id);
            updateCartUI();
        }

        function updateWishlistUI() {
            const badge = document.getElementById("wishlistBadge");
            badge.textContent = state.wishlist.length;
            badge.classList.toggle("active", state.wishlist.length > 0);

            const container = document.getElementById("wishlistItemsContainer");
            container.innerHTML = state.wishlist.map(id => {
                const prod = productsData.find(p => p.id === id);
                return `
                    <div class="cart-item">
                        <img src="${prod.image}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${prod.title}</div>
                            <div class="cart-item-price">$${prod.price.toFixed(2)}</div>
                        </div>
                        <button class="pill-btn" onclick="addToCart(${prod.id})">Move to Cart</button>
                    </div>
                `;
            }).join('');
        }

        function openQuickView(id) {
            const prod = productsData.find(p => p.id === id);
            document.getElementById("qvImage").src = prod.image;
            document.getElementById("qvCategory").textContent = prod.category;
            document.getElementById("qvTitle").textContent = prod.title;
            document.getElementById("qvRating").textContent = prod.rating;
            document.getElementById("qvPrice").textContent = `$${prod.price.toFixed(2)}`;
            document.getElementById("qvDesc").textContent = prod.desc;
            document.getElementById("qvAddToCartBtn").onclick = () => { addToCart(prod.id); closeModal(document.getElementById("quickViewModal")); };
            openModal(document.getElementById("quickViewModal"));
        }

        /* Drawer & Modal Helpers */
        function openDrawer(el) { el.classList.add("active"); document.getElementById("drawerOverlay").classList.add("active"); }
        function closeDrawers() { document.querySelectorAll(".drawer, .drawer-overlay").forEach(el => el.classList.remove("active")); }
        function openModal(el) { el.classList.add("active"); }
        function closeModal(el) { el.classList.remove("active"); }

        function showToast(msg) {
            const toast = document.createElement("div");
            toast.className = "toast";
            toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--secondary)"></i> ${msg}`;
            document.getElementById("toastContainer").appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function startCountdown() {
            let sec = 120000;
            setInterval(() => {
                sec--;
                document.getElementById("timerSecs").textContent = String(sec % 60).padStart(2, '0');
                document.getElementById("timerMins").textContent = String(Math.floor(sec / 60) % 60).padStart(2, '0');
            }, 1000);
        }
