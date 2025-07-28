// Shopping Cart - Using Storage Manager
let cart = [];

// Get DOM elements for cart functionality
const cartIcon = document.querySelector('.cart-icon');
const cartCountElement = document.querySelector('.cart-count');
const cartModalOverlay = document.getElementById('cart-modal');
const closeCartBtn = document.querySelector('.close-cart-btn');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalAmount = document.getElementById('cart-total-amount');

// Add cart icon click handler
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        if (!currentUser) {
            showNotification('Please login to view your cart!');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        // Show cart modal logic here if needed
        showNotification('Cart feature coming soon!');
    });
}

// Add user avatar click handler
document.addEventListener('DOMContentLoaded', function() {
    const userAvatar = document.querySelector('.user-avatar');
    const username = document.querySelector('.username');
    
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            if (currentUser) {
                window.location.href = 'profile.html';
            }
        });
    }
    
    if (username) {
        username.addEventListener('click', () => {
            if (currentUser) {
                window.location.href = 'profile.html';
            }
        });
    }
    
    // Add My Orders link click handler
    const myOrdersLink = document.getElementById('my-orders-link');
    if (myOrdersLink) {
        myOrdersLink.addEventListener('click', (e) => {
            e.preventDefault();
            showMyOrders();
        });
    }
    
    // Add order status filter handler
    const orderStatusFilter = document.getElementById('order-status-filter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', () => {
            renderOrders(orderStatusFilter.value);
        });
    }
});

// Show My Orders section
function showMyOrders() {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show orders section
    const ordersSection = document.getElementById('orders');
    ordersSection.style.display = 'block';
    
    // Render orders
    renderOrders('all');
}

// Render orders based on status filter
function renderOrders(statusFilter = 'all') {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;
    
    const orders = getItem('orders', []);
    const userOrders = orders.filter(order => order.userId === currentUser?.username);
    
    // Filter by status if not 'all'
    const filteredOrders = statusFilter === 'all' 
        ? userOrders 
        : userOrders.filter(order => order.status === statusFilter);
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open"></i>
                <h4>No orders found</h4>
                <p>${statusFilter === 'all' ? 'You haven\'t placed any orders yet.' : `No ${statusFilter} orders found.`}</p>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">${new Date(order.orderDate).toLocaleDateString()}</div>
                </div>
                <div class="order-status ${order.status}">${order.status}</div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-item-details">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="order-item-quantity">Qty: ${item.quantity}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">
                Total: $${order.total.toFixed(2)}
            </div>
            
            <div class="order-actions">
                <button class="order-action-btn primary" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${order.status === 'pending' ? `
                    <button class="order-action-btn secondary" onclick="cancelOrder(${order.id})">
                        <i class="fas fa-times"></i> Cancel Order
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// View order details
function viewOrderDetails(orderId) {
    const orders = getItem('orders', []);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 16px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #2c5aa0; font-size: 1.5rem;">Order Details</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888;">×</button>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <div><strong>Order ID:</strong> #${order.id}</div>
                    <div><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</div>
                    <div><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></div>
                    <div><strong>Total:</strong> $${order.total.toFixed(2)}</div>
                </div>
                
                <h4 style="color: #333; margin-bottom: 1rem;">Shipping Information:</h4>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <div><strong>Name:</strong> ${order.shippingInfo.name}</div>
                    <div><strong>Email:</strong> ${order.shippingInfo.email}</div>
                    <div><strong>Phone:</strong> ${order.shippingInfo.phone}</div>
                    <div><strong>Address:</strong> ${order.shippingInfo.address}</div>
                    <div><strong>City:</strong> ${order.shippingInfo.city}</div>
                    <div><strong>Country:</strong> ${order.shippingInfo.country}</div>
                </div>
                
                <h4 style="color: #333; margin-bottom: 1rem;">Order Items:</h4>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${order.items.map(item => `
                        <div style="display: flex; align-items: center; padding: 0.8rem; border-bottom: 1px solid #f0f0f0;">
                            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; margin-right: 1rem;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #333;">${item.name}</div>
                                <div style="color: #666; font-size: 0.9rem;">$${item.price.toFixed(2)} x ${item.quantity}</div>
                            </div>
                            <div style="color: #2c5aa0; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Cancel order
function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    const orders = getItem('orders', []);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'cancelled';
        setItem('orders', orders);
        
        showNotification('Order cancelled successfully!');
        renderOrders(document.getElementById('order-status-filter').value);
    }
}

// Get DOM element for products grid
const productGrid = document.getElementById('product-grid');

// ====== STORAGE UTILS ======
function getItem(key, fallback = null) {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}
function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
// ====== PETS ======
function getPets() { return getItem('pets', []); }
function setPets(pets) { setItem('pets', pets); }
let availablePets = getPets();
// ====== USERS ======
function getUsers() { return getItem('users', []); }
function setUsers(users) { setItem('users', users); }
// ====== CART ======
function getCart() { return getItem('cart', []); }
function setCart(cart) { setItem('cart', cart); }
// ====== ORDERS ======
function getOrders() { return getItem('orders', []); }
function setOrders(orders) { setItem('orders', orders); }
// ====== SETTINGS ======
function getSettings() { return getItem('settings', {}); }
function setSettings(settings) { setItem('settings', settings); }
// ====== CURRENT USER ======
function getCurrentUser() { return getItem('currentUser', null); }
function setCurrentUser(user) { setItem('currentUser', user); }

let currentUser = null; // Stores currently logged-in user

// Check login status on page load
function checkLoginStatus() {
    currentUser = getCurrentUser();
    if (currentUser) {
        updateAuthUI(true, currentUser.username);
    } else {
        updateAuthUI(false);
    }
}

// Update UI based on login status
function updateAuthUI(isLoggedIn, username = '') {
    const guestControls = document.getElementById('guest-controls');
    const userControls = document.getElementById('user-controls');
    const usernameDisplay = document.getElementById('username-display');
    const myOrdersLink = document.getElementById('my-orders-link');
    
    if (isLoggedIn) {
        // Hide guest controls, show user controls
        guestControls.style.display = 'none';
        userControls.style.display = 'flex';
        usernameDisplay.textContent = username;
        myOrdersLink.style.display = 'block';
    } else {
        // Show guest controls, hide user controls
        guestControls.style.display = 'flex';
        userControls.style.display = 'none';
        myOrdersLink.style.display = 'none';
    }
    
    // Refresh products display to update button states
    displayProducts();
}

// Handle User Logout
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            setCurrentUser(null);
            updateAuthUI(false);
            showNotification('Logged out successfully!');
        });
    }
});

// Function to display products
function displayProducts() {
    console.log("displayProducts called.");
    console.log("availablePets length:", availablePets.length);
    productGrid.innerHTML = '';
    if (availablePets.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; width: 100%;">No pets available at the moment. Please check back later!</p>';
        console.log("No pets available. Displaying message.");
        return;
    }

    availablePets.forEach(pet => {
        console.log("Processing pet:", pet.name);
        const petCard = document.createElement('div');
        petCard.className = 'product-card';
        if (pet.isSpecial) {
            petCard.classList.add('special-product');
        }
        
        petCard.innerHTML = `
            <div class="product-image">
                <img src="${pet.image}" alt="${pet.name}">
                ${pet.isSpecial ? '<span class="special-badge">Special</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${pet.name}</h3>
                <p class="product-description">${pet.description}</p>
                <p class="product-price">$${pet.price.toFixed(2)}</p>
                <p class="product-quantity">Available: ${pet.quantity}</p>
                <button class="add-to-cart-btn ${!currentUser && pet.quantity > 0 ? 'login-required' : ''}" ${pet.quantity === 0 ? 'disabled' : ''}>
                    ${pet.quantity === 0 ? 'Out of Stock' : (currentUser ? 'Add to Cart' : 'Login to Buy')}
                </button>
            </div>
        `;

        const addToCartBtn = petCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn && pet.quantity > 0) {
            addToCartBtn.addEventListener('click', () => {
                if (currentUser) {
                    addToCart(pet);
                } else {
                    showNotification('Please login to purchase items!');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }
            });
        }

        productGrid.appendChild(petCard);
        console.log("Appended petCard for:", pet.name);
    });
    console.log("Finished displaying products.");
}

// Add to cart function
function addToCart(pet) {
    // Check if user is logged in
    if (!currentUser) {
        showNotification('Please login to purchase items!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    if (pet.quantity <= 0) {
        showNotification('Sorry, this pet is out of stock!');
        return;
    }

    // Add to cart using storage manager
    const cartItem = {
        id: pet.id,
        name: pet.name,
        price: pet.price,
        image: pet.image,
        quantity: 1
    };
    
    const currentCart = getCart();
    currentCart.push(cartItem);
    setCart(currentCart);

    // Update pet quantity
    pet.quantity--;
    const updatedPets = availablePets.map(p =>
        p.id === pet.id ? { ...p, quantity: pet.quantity } : p
    );
    setPets(updatedPets);
    
    updateCartCount();
    showNotification(`${pet.name} added to cart!`);
    displayProducts(); // Refresh the product display
}

// Update cart count
function updateCartCount() {
    const currentCart = getCart();
    const totalItems = currentCart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cart Modal Functionality
cartIcon.addEventListener('click', () => {
    cartModalOverlay.classList.add('active');
    renderCartItems();
});

closeCartBtn.addEventListener('click', () => {
    cartModalOverlay.classList.remove('active');
});

// Add checkout button functionality
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Handle checkout process
function handleCheckout() {
    const currentCart = getCart();
    
    if (currentCart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to proceed with checkout!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Calculate total
    const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Show checkout confirmation modal
    showCheckoutModal(currentCart, total);
}

// Show checkout confirmation modal
function showCheckoutModal(cartItems, total) {
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 16px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #2c5aa0; font-size: 1.5rem;">Order Confirmation</h3>
                <button id="close-checkout-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888;">×</button>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #333; margin-bottom: 1rem;">Order Summary:</h4>
                <div style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; border-radius: 8px; padding: 1rem;">
                    ${cartItems.map(item => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">
                            <div>
                                <strong>${item.name}</strong>
                                <div style="color: #666; font-size: 0.9rem;">Qty: ${item.quantity}</div>
                            </div>
                            <div style="color: #2c5aa0; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="border-top: 2px solid #eee; padding-top: 1rem; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.2rem; font-weight: 600;">
                    <span>Total:</span>
                    <span style="color: #2c5aa0; font-size: 1.5rem;">$${total.toFixed(2)}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: #333; margin-bottom: 1rem;">Shipping Information:</h4>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px;">
                    <div><strong>Name:</strong> ${currentUser.fullName || currentUser.username}</div>
                    <div><strong>Email:</strong> ${currentUser.email}</div>
                    <div><strong>Phone:</strong> ${currentUser.phone}</div>
                    <div><strong>Address:</strong> ${currentUser.address}</div>
                    <div><strong>City:</strong> ${currentUser.city}</div>
                    <div><strong>Country:</strong> ${currentUser.country}</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button id="cancel-checkout" style="background: #6c757d; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Cancel</button>
                <button id="confirm-checkout" style="background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Confirm Order</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('close-checkout-modal').onclick = () => modal.remove();
    document.getElementById('cancel-checkout').onclick = () => modal.remove();
    document.getElementById('confirm-checkout').onclick = () => processOrder(cartItems, total, modal);
}

// Process the order
function processOrder(cartItems, total, modal) {
    // Create order object
    const order = {
        id: Date.now(),
        userId: currentUser.username,
        items: cartItems,
        total: total,
        status: 'pending',
        orderDate: new Date().toISOString(),
        shippingInfo: {
            name: currentUser.fullName || currentUser.username,
            email: currentUser.email,
            phone: currentUser.phone,
            address: currentUser.address,
            city: currentUser.city,
            country: currentUser.country
        }
    };
    
    // Save order to storage using the proper functions
    const orders = getOrders();
    orders.push(order);
    setOrders(orders);
    
    // Clear cart
    setCart([]);
    updateCartCount();
    
    // Close modals
    modal.remove();
    cartModalOverlay.classList.remove('active');
    
    // Show success message
    showOrderSuccess(order);
}

// Show order success message
function showOrderSuccess(order) {
    const successModal = document.createElement('div');
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    `;
    
    successModal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 16px; max-width: 400px; width: 90%; text-align: center;">
            <div style="color: #28a745; font-size: 4rem; margin-bottom: 1rem;">✓</div>
            <h3 style="color: #28a745; margin-bottom: 1rem;">Order Placed Successfully!</h3>
            <p style="color: #666; margin-bottom: 1rem;">Your order #${order.id} has been confirmed.</p>
            <p style="color: #666; margin-bottom: 1.5rem;">We'll send you an email confirmation shortly.</p>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <div><strong>Order Total:</strong> $${order.total.toFixed(2)}</div>
                <div><strong>Items:</strong> ${order.items.length}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: linear-gradient(135deg, #2c5aa0, #1e3c72); color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer; font-weight: 600;">Continue Shopping</button>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successModal.parentElement) {
            successModal.remove();
        }
    }, 5000);
}

// Render cart items
function renderCartItems() {
    cartItemsList.innerHTML = '';
    const currentCart = getCart();
    let total = 0;

    if (currentCart.length === 0) {
        cartItemsList.innerHTML = `
            <li class="cart-item empty-cart">
                <div style="text-align: center; width: 100%; padding: 2rem;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h4 style="color: #666; margin-bottom: 0.5rem;">Your cart is empty</h4>
                    <p style="color: #999;">Add some pets to get started!</p>
                </div>
            </li>
        `;
        cartTotalAmount.textContent = '$0.00';
        return;
    }

    currentCart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn minus" data-id="${item.id}" title="Decrease quantity">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}" title="Increase quantity">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="cart-item-remove" data-id="${item.id}" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsList.appendChild(li);
        total += item.price * item.quantity;
    });

    cartTotalAmount.textContent = `$${total.toFixed(2)}`;

    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', handleQuantityChange);
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
}

// Handle quantity changes
function handleQuantityChange(e) {
    const id = parseInt(e.target.dataset.id);
    const currentCart = getCart();
    const item = currentCart.find(item => item.id === id);
    const pet = availablePets.find(p => p.id === id);
    
    if (e.target.classList.contains('plus')) {
        if (item.quantity >= pet.quantity) {
            showNotification('Sorry, we don\'t have enough in stock!');
            return;
        }
        const updatedCart = currentCart.map(i =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        );
        setCart(updatedCart);
        pet.quantity--;
        const updatedPets = availablePets.map(p =>
            p.id === id ? { ...p, quantity: pet.quantity } : p
        );
        setPets(updatedPets);
    } else if (e.target.classList.contains('minus')) {
        if (item.quantity > 1) {
            const updatedCart = currentCart.map(i =>
                i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            );
            setCart(updatedCart);
            pet.quantity++;
            const updatedPets = availablePets.map(p =>
                p.id === id ? { ...p, quantity: pet.quantity } : p
            );
            setPets(updatedPets);
        } else {
            handleRemoveItem(e);
            return;
        }
    }

    updateCartCount();
    renderCartItems();
    displayProducts();
}

// Handle item removal
function handleRemoveItem(e) {
    const id = parseInt(e.target.closest('.remove-btn').dataset.id);
    const currentCart = getCart();
    const item = currentCart.find(item => item.id === id);
    const pet = availablePets.find(p => p.id === id);
    
    if (item && pet) {
        const updatedCart = currentCart.filter(i => i.id !== id);
        setCart(updatedCart);
        pet.quantity += item.quantity;
        const updatedPets = availablePets.map(p =>
            p.id === id ? { ...p, quantity: pet.quantity } : p
        );
        setPets(updatedPets);
        updateCartCount();
        renderCartItems();
        displayProducts();
        showNotification(`${item.name} removed from cart!`);
    }
}

// Initialize sample data if none exists
function initSampleData() {
    if (getPets().length === 0) {
        setPets([
            {id: 1, name: 'Poodle Puppy', price: 350, quantity: 5, image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg', description: 'Lovely Poodle puppy, playful and friendly.', category: 'dog'},
            {id: 2, name: 'British Shorthair Cat', price: 400, quantity: 3, image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg', description: 'Chubby British Shorthair, calm and cute.', category: 'cat'},
            {id: 3, name: 'Clown Fish', price: 50, quantity: 10, image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg', description: 'Colorful clown fish for your aquarium.', category: 'fish'},
            {id: 4, name: 'Golden Retriever', price: 600, quantity: 2, image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg', description: 'Friendly and intelligent family dog.', category: 'dog'},
            {id: 5, name: 'Persian Cat', price: 450, quantity: 4, image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg', description: 'Elegant Persian cat with long fur.', category: 'cat'},
            {id: 6, name: 'Parakeet', price: 80, quantity: 8, image: 'https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg', description: 'Colorful and talkative parakeet.', category: 'bird'},
            {id: 7, name: 'Hamster', price: 30, quantity: 15, image: 'https://images.pexels.com/photos/4587959/pexels-photo-4587959.jpeg', description: 'Cute and active hamster.', category: 'rodent'},
            {id: 8, name: 'Capybara', price: 1200, quantity: 1, image: 'https://images.pexels.com/photos/47547/pexels-photo-47547.jpeg', description: 'The world\'s largest rodent, very friendly!', category: 'rodent', isSpecial: true}
        ]);
    } else {
        // Update existing pets with category if they don't have it
        const pets = getPets();
        let updated = false;
        const updatedPets = pets.map(pet => {
            if (!pet.category) {
                updated = true;
                // Auto-assign category based on name
                const name = pet.name.toLowerCase();
                if (name.includes('dog') || name.includes('puppy') || name.includes('retriever')) {
                    return { ...pet, category: 'dog' };
                } else if (name.includes('cat') || name.includes('kitten')) {
                    return { ...pet, category: 'cat' };
                } else if (name.includes('bird') || name.includes('parakeet')) {
                    return { ...pet, category: 'bird' };
                } else if (name.includes('fish') || name.includes('clown')) {
                    return { ...pet, category: 'fish' };
                } else if (name.includes('hamster') || name.includes('rodent') || name.includes('capybara')) {
                    return { ...pet, category: 'rodent' };
                } else {
                    return { ...pet, category: 'other' };
                }
            }
            return pet;
        });
        
        if (updated) {
            setPets(updatedPets);
            console.log('Updated existing pets with categories:', updatedPets);
        }
    }
    
    // Ensure admin account exists
    const users = getUsers();
    const adminExists = users.some(u => u.username === "admin" && u.role === "admin");
    if (!adminExists) {
        users.push({
            username: "admin",
            password: "admin123",
            role: "admin"
        });
        setUsers(users);
    }
    
    // Initialize other data if needed
    if (getOrders().length === 0) {
        setOrders([]);
    }
    if (Object.keys(getSettings()).length === 0) {
        setSettings({theme: 'light', language: 'en'});
    }
    if (getCart().length === 0) {
        setCart([]);
    }
    if (getCurrentUser() === null) {
        setCurrentUser(null);
    }
}

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
        initSampleData();
        availablePets = getPets();
        checkLoginStatus();
        console.log("Available Pets:", availablePets);
        console.log("Product Grid Element:", productGrid);
        displayProducts();
        updateCartCount();
        
        // Initialize search functionality
        initializeSearch();
        

    });

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const filterReset = document.getElementById('filter-reset');
    const resultsCount = document.getElementById('results-count');
    
    let searchTerm = '';
    let selectedCategory = '';
    let selectedPriceRange = '';
    
    // Search input handler
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.toLowerCase();
            updateSearchClear();
            performSearch();
        });
    }
    
    // Clear search button
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            searchTerm = '';
            updateSearchClear();
            performSearch();
        });
    }
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            selectedCategory = this.value;
            performSearch();
        });
    }
    
    // Price filter
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            selectedPriceRange = this.value;
            performSearch();
        });
    }
    
    // Reset filters
    if (filterReset) {
        filterReset.addEventListener('click', function() {
            searchInput.value = '';
            categoryFilter.value = '';
            priceFilter.value = '';
            searchTerm = '';
            selectedCategory = '';
            selectedPriceRange = '';
            updateSearchClear();
            performSearch();
        });
    }
    
    function updateSearchClear() {
        if (searchTerm) {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }
    }
    
    function performSearch() {
        let filteredPets = availablePets.filter(pet => {
            // Search term filter
            const matchesSearch = !searchTerm || 
                pet.name.toLowerCase().includes(searchTerm) ||
                pet.description.toLowerCase().includes(searchTerm);
            
            // Category filter
            const matchesCategory = !selectedCategory || 
                (selectedCategory === 'special' && pet.isSpecial) ||
                (selectedCategory === pet.category && pet.category !== 'other');
            
            // Price filter
            let matchesPrice = true;
            if (selectedPriceRange) {
                const price = pet.price;
                switch (selectedPriceRange) {
                    case '0-100':
                        matchesPrice = price >= 0 && price <= 100;
                        break;
                    case '100-500':
                        matchesPrice = price > 100 && price <= 500;
                        break;
                    case '500-1000':
                        matchesPrice = price > 500 && price <= 1000;
                        break;
                    case '1000+':
                        matchesPrice = price > 1000;
                        break;
                }
            }
            
            return matchesSearch && matchesCategory && matchesPrice;
        });
        
        // Update results count
        if (resultsCount) {
            if (searchTerm || selectedCategory || selectedPriceRange) {
                resultsCount.textContent = `Found ${filteredPets.length} product${filteredPets.length !== 1 ? 's' : ''}`;
                resultsCount.parentElement.classList.add('active');
            } else {
                resultsCount.textContent = 'Showing all products';
                resultsCount.parentElement.classList.remove('active');
            }
        }
        
        // Display filtered products
        displayFilteredProducts(filteredPets);
    }
}

// Display filtered products
function displayFilteredProducts(pets) {
    productGrid.innerHTML = '';
    
    if (pets.length === 0) {
        productGrid.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="color: #666; margin-bottom: 0.5rem;">No products found</h3>
                <p style="color: #999;">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    pets.forEach(pet => {
        console.log("Processing pet:", pet.name);
        const petCard = document.createElement('div');
        petCard.className = 'product-card';
        if (pet.isSpecial) {
            petCard.classList.add('special-product');
        }
        
        petCard.innerHTML = `
            <div class="product-image">
                <img src="${pet.image}" alt="${pet.name}">
                ${pet.isSpecial ? '<span class="special-badge">Special</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${pet.name}</h3>
                <p class="product-description">${pet.description}</p>
                <p class="product-price">$${pet.price.toFixed(2)}</p>
                <p class="product-quantity">Available: ${pet.quantity}</p>
                <button class="add-to-cart-btn ${!currentUser && pet.quantity > 0 ? 'login-required' : ''}" ${pet.quantity === 0 ? 'disabled' : ''}>
                    ${pet.quantity === 0 ? 'Out of Stock' : (currentUser ? 'Add to Cart' : 'Login to Buy')}
                </button>
            </div>
        `;

        const addToCartBtn = petCard.querySelector('.add-to-cart-btn');
        if (addToCartBtn && pet.quantity > 0) {
            addToCartBtn.addEventListener('click', () => {
                if (currentUser) {
                    addToCart(pet);
                } else {
                    showNotification('Please login to purchase items!');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }
            });
        }

        productGrid.appendChild(petCard);
        console.log("Appended petCard for:", pet.name);
    });
    console.log("Finished displaying filtered products.");
}

// Lắng nghe sự kiện storage để đồng bộ toàn bộ dữ liệu
window.addEventListener('storage', function(e) {
    if (e.key === 'pets') {
        availablePets = getPets();
        displayProducts && displayProducts();
    }
    if (e.key === 'users') {
        // Nếu có UI user, cập nhật lại
    }
    if (e.key === 'cart') {
        // Nếu có UI cart, cập nhật lại
        updateCartCount && updateCartCount();
        renderCartItems && renderCartItems();
    }
    if (e.key === 'orders') {
        // Nếu có UI orders, cập nhật lại
    }
    if (e.key === 'settings') {
        // Nếu có UI settings, cập nhật lại
    }
    if (e.key === 'currentUser') {
        currentUser = getCurrentUser();
        updateAuthUI && updateAuthUI(!!currentUser, currentUser?.username);
    }
}); 