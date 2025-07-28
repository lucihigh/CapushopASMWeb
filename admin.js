// ===== STORAGE FUNCTIONS =====
function getItem(key, fallback = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return fallback;
    }
}

function setItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting item to localStorage:', error);
    }
}

function getCurrentUser() { return getItem('currentUser', null); }
function setCurrentUser(user) { setItem('currentUser', user); }

// ===== NOTIFICATION =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
// ===== DATA STRUCTURE =====
function getPets() { return getItem('pets', []); }
function setPets(pets) { setItem('pets', pets); }
function getUsers() { return getItem('users', []); }
function setUsers(users) { setItem('users', users); }
function getOrders() { return getItem('orders', []); }
function setOrders(orders) { setItem('orders', orders); }
function getSettings() { return getItem('settings', {}); }
function setSettings(settings) { setItem('settings', settings); }
function getCart() { return getItem('cart', []); }
function setCart(cart) { setItem('cart', cart); }
// ===== INIT SAMPLE DATA =====
function initSampleData() {
    if (!getItem('pets')) {
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
    }
    if (!getItem('users')) {
        setUsers([{username: 'admin', password: 'admin123', isAdmin: true}]);
    }
    if (!getItem('orders')) {
        setOrders([]);
    }
    if (!getItem('settings')) {
        setSettings({theme: 'light', language: 'en'});
    }
}
initSampleData();
// ===== RENDER PRODUCTS =====
function renderProducts() {
    const list = document.getElementById('products-list');
    if (!list) return;
    const pets = getPets();
    list.innerHTML = '';
    if (pets.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#888;padding:2rem;">No products to manage. Add a new product!</div>';
        return;
    }
    pets.forEach((pet, idx) => {
        const item = document.createElement('div');
        item.className = 'product-list-item';
        // Get category display name
        const getCategoryDisplayName = (category) => {
            const categoryMap = {
                'dog': '🐕 Dog',
                'cat': '🐱 Cat', 
                'bird': '🐦 Bird',
                'fish': '🐠 Fish',
                'rodent': '🐹 Rodent',
                'other': '❓ Other'
            };
            return categoryMap[category] || '❓ Unknown';
        };
        
        item.innerHTML = `
            <div class="product-list-image">
                <img src="${pet.image}" alt="${pet.name}">
                ${pet.isSpecial ? '<span style="position:absolute;top:5px;right:5px;background:#ff6b6b;color:white;padding:2px 6px;border-radius:4px;font-size:0.7rem;">Special</span>' : ''}
            </div>
            <div class="product-list-info">
                <div class="product-list-name">${pet.name}</div>
                <div class="product-list-category" style="color:#666;font-size:0.9rem;margin-bottom:0.5rem;">${getCategoryDisplayName(pet.category || 'other')}</div>
                <div class="product-list-price">$${pet.price.toFixed(2)}</div>
                <div class="product-list-quantity">Quantity: ${pet.quantity}</div>
                <div class="product-list-description">${pet.description}</div>
            </div>
            <div class="product-list-actions">
                <button class="product-list-edit-btn" data-idx="${idx}">Edit</button>
                <button class="product-list-delete-btn" data-idx="${idx}">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
    
    // Sự kiện edit product
    list.querySelectorAll('.product-list-edit-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const idx = +this.dataset.idx;
            showEditProductModal(idx);
        };
    });
    
    // Sự kiện delete product
    list.querySelectorAll('.product-list-delete-btn').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            const idx = +this.dataset.idx;
            if(confirm('Bạn có chắc muốn xóa sản phẩm này?')){
                const pets = getPets();
                pets.splice(idx,1);
                setPets(pets);
                renderProducts();
                renderDashboard && renderDashboard();
            }
        };
    });
    
    // Sự kiện click vào item để xem chi tiết
    list.querySelectorAll('.product-list-item').forEach(item => {
        item.onclick = function() {
            const idx = +this.querySelector('.product-list-edit-btn').dataset.idx;
            showProductDetailModal(idx);
        };
    });
}

// ===== SHOW PRODUCT DETAIL MODAL =====
function showProductDetailModal(idx) {
    const pets = getPets();
    const pet = pets[idx];
    if (!pet) return;
    
    if(document.getElementById('product-detail-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'product-detail-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.25)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div style="background:#fff;padding:2.5rem;border-radius:16px;min-width:400px;max-width:600px;box-shadow:0 8px 40px rgba(44,90,160,0.18);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <h3 style="margin:0;color:#223a5f;">Product Details</h3>
                <button id="close-detail-modal" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888;">×</button>
            </div>
            <div style="display:flex;gap:2rem;margin-bottom:2rem;">
                <div style="flex-shrink:0;">
                    <img src="${pet.image}" alt="${pet.name}" style="width:200px;height:200px;object-fit:cover;border-radius:12px;">
                </div>
                <div style="flex:1;">
                    <h4 style="margin:0 0 1rem 0;color:#223a5f;font-size:1.3rem;">${pet.name}</h4>
                    <div style="margin-bottom:0.8rem;"><strong>Price:</strong> <span style="color:#28a745;font-weight:600;">$${pet.price.toFixed(2)}</span></div>
                    <div style="margin-bottom:0.8rem;"><strong>Quantity:</strong> <span style="color:#666;">${pet.quantity}</span></div>
                    <div style="margin-bottom:0.8rem;"><strong>Description:</strong></div>
                    <p style="color:#666;line-height:1.5;margin:0;">${pet.description}</p>
                </div>
            </div>
            <div style="display:flex;gap:1rem;justify-content:flex-end;">
                <button id="edit-from-detail" style="background:#28a745;color:#fff;border:none;padding:0.7rem 1.5rem;border-radius:8px;font-weight:600;cursor:pointer;">Edit Product</button>
                <button id="delete-from-detail" style="background:#dc3545;color:#fff;border:none;padding:0.7rem 1.5rem;border-radius:8px;font-weight:600;cursor:pointer;">Delete Product</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('close-detail-modal').onclick = function(){modal.remove();};
    document.getElementById('edit-from-detail').onclick = function(){
        modal.remove();
        showEditProductModal(idx);
    };
    document.getElementById('delete-from-detail').onclick = function(){
        if(confirm('Bạn có chắc muốn xóa sản phẩm này?')){
            const pets = getPets();
            pets.splice(idx,1);
            setPets(pets);
            modal.remove();
            renderProducts();
            renderDashboard && renderDashboard();
        }
    };
}

// ===== SHOW EDIT PRODUCT MODAL =====
function showEditProductModal(idx) {
    const pets = getPets();
    const pet = pets[idx];
    if (!pet) return;
    
    if(document.getElementById('edit-product-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'edit-product-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.25)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <form id="edit-product-form" style="background:#fff;padding:2rem 2.5rem;border-radius:12px;min-width:400px;box-shadow:0 2px 16px rgba(44,90,160,0.13);display:flex;flex-direction:column;gap:1rem;">
            <h3 style="margin-bottom:0.5rem;color:#223a5f;">Edit Product</h3>
            
            <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1rem;">
                <img src="${pet.image}" alt="${pet.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
                <div>
                    <div style="font-weight:600;color:#223a5f;">${pet.name}</div>
                    <div style="font-size:0.9rem;color:#666;">Current Category: ${pet.category || 'Not set'}</div>
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Product Name</label>
                    <input type="text" id="edit-product-name" value="${pet.name}" required placeholder="Product Name" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Category</label>
                    <select id="edit-product-category" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                        <option value="">Select Category</option>
                        <option value="dog" ${pet.category === 'dog' ? 'selected' : ''}>🐕 Dog</option>
                        <option value="cat" ${pet.category === 'cat' ? 'selected' : ''}>🐱 Cat</option>
                        <option value="bird" ${pet.category === 'bird' ? 'selected' : ''}>🐦 Bird</option>
                        <option value="fish" ${pet.category === 'fish' ? 'selected' : ''}>🐠 Fish</option>
                        <option value="rodent" ${pet.category === 'rodent' ? 'selected' : ''}>🐹 Rodent</option>
                    </select>
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Price ($)</label>
                    <input type="number" id="edit-product-price" value="${pet.price}" min="0" step="0.01" required placeholder="Price" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Quantity</label>
                    <input type="number" id="edit-product-quantity" value="${pet.quantity}" min="0" required placeholder="Quantity" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                </div>
            </div>
            
            <div>
                <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Product Image</label>
                <div style="display:flex;gap:1rem;align-items:center;">
                    <div style="flex:1;">
                        <input type="url" id="edit-product-image" value="${pet.image}" placeholder="Image URL" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    </div>
                    <div style="text-align:center;color:#666;font-size:0.9rem;">OR</div>
                    <div>
                        <input type="file" id="edit-product-image-file" accept="image/*" style="display:none;">
                        <button type="button" onclick="document.getElementById('edit-product-image-file').click()" style="background:#007bff;color:white;border:none;padding:0.6rem 1rem;border-radius:6px;cursor:pointer;font-size:0.9rem;">Upload Image</button>
                    </div>
                </div>
                <div id="edit-image-preview" style="margin-top:0.5rem;text-align:center;">
                    ${pet.image ? `<img src="${pet.image}" alt="Preview" style="max-width:100px;max-height:100px;border-radius:6px;border:1px solid #ddd;">` : ''}
                </div>
            </div>
            
            <div>
                <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Description</label>
                <textarea id="edit-product-description" required placeholder="Description" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;min-height:80px;">${pet.description}</textarea>
            </div>
            
            <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
                <button type="button" id="cancel-edit-product" style="background:#ccc;color:#333;border:none;padding:0.5rem 1.2rem;border-radius:6px;">Cancel</button>
                <button type="submit" style="background:#28a745;color:#fff;border:none;padding:0.5rem 1.2rem;border-radius:6px;font-weight:600;">Save Changes</button>
            </div>
        </form>
    `;
    document.body.appendChild(modal);
    document.getElementById('cancel-edit-product').onclick = function(){modal.remove();};
    
    // Handle image file upload for edit form
    document.getElementById('edit-product-image-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                document.getElementById('edit-product-image').value = imageUrl;
                document.getElementById('edit-image-preview').innerHTML = `
                    <img src="${imageUrl}" alt="Preview" style="max-width:100px;max-height:100px;border-radius:6px;border:1px solid #ddd;">
                    <div style="font-size:0.8rem;color:#666;margin-top:0.3rem;">${file.name} (${(file.size/1024).toFixed(1)}KB)</div>
                `;
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('edit-product-form').onsubmit = function(e){
        e.preventDefault();
        const name = document.getElementById('edit-product-name').value.trim();
        const price = parseFloat(document.getElementById('edit-product-price').value);
        const quantity = parseInt(document.getElementById('edit-product-quantity').value);
        const category = document.getElementById('edit-product-category').value;
        const image = document.getElementById('edit-product-image').value.trim() || 'no-image.png';
        const description = document.getElementById('edit-product-description').value.trim();
        if(!name||isNaN(price)||isNaN(quantity)||!category||!description){alert('Vui lòng nhập đầy đủ thông tin!');return;}
        const pets = getPets();
        pets[idx] = { ...pets[idx], name, price, quantity, image, description, category };
        setPets(pets);
        modal.remove();
        renderProducts();
        renderDashboard && renderDashboard();
    };
}
// ===== TAB SWITCHING =====
function showSection(section) {
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('products-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('customers-section').style.display = 'none';
    document.getElementById('storage-section').style.display = 'none';
    document.getElementById(section + '-section').style.display = '';
    
    // Clear orders list when switching away from orders section
    if (section !== 'orders') {
        clearOrdersList();
    }
    
    // Cập nhật active cho sidebar
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.nav-item[href="#' + section + '"]').classList.add('active');
}

// ===== CLEAR ORDERS LIST =====
function clearOrdersList() {
    const ordersList = document.getElementById('orders-list-admin');
    if (ordersList) {
        ordersList.innerHTML = '';
    }
}
// ===== DASHBOARD METRICS =====
function renderDashboard() {
    document.getElementById('metric-products').textContent = getPets().length;
    document.getElementById('metric-customers').textContent = getUsers().length;
    document.getElementById('metric-orders').textContent = getOrders().length;
    // Tính doanh thu mẫu (tổng tiền các đơn hàng)
    let revenue = 0;
    getOrders().forEach(o => revenue += o.total || 0);
    document.getElementById('metric-revenue').textContent = '$' + revenue.toFixed(2);
    
    // Thêm thống kê category
    const pets = getPets();
    const categoryStats = {};
    pets.forEach(pet => {
        const category = pet.category || 'other';
        categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
    
    // Hiển thị thống kê category nếu có element
    const categoryStatsElement = document.getElementById('category-stats');
    if (categoryStatsElement) {
        const categoryDisplayNames = {
            'dog': '🐕 Dogs',
            'cat': '🐱 Cats',
            'bird': '🐦 Birds', 
            'fish': '🐠 Fish',
            'rodent': '🐹 Rodents',
            'other': '❓ Others'
        };
        
        categoryStatsElement.innerHTML = Object.entries(categoryStats)
            .map(([category, count]) => `
                <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #eee;">
                    <span>${categoryDisplayNames[category] || category}</span>
                    <span style="font-weight:600;color:#28a745;">${count}</span>
                </div>
            `).join('');
    }
}
// ===== RENDER CUSTOMERS (CÓ SỬA/XÓA) =====
function renderCustomers() {
    const grid = document.getElementById('customers-grid');
    if (!grid) return;
    const users = getUsers();
    grid.innerHTML = '';
    if (users.length === 0) {
        grid.innerHTML = '<div style="text-align:center;color:#888;padding:2rem;">No customers found.</div>';
            return;
        }
    users.forEach((u, idx) => {
        const card = document.createElement('div');
        card.className = 'customer-card';
        card.innerHTML = `
            <div class="customer-name">${u.username}</div>
            <div class="customer-username">${u.isAdmin ? 'Admin' : 'User'}</div>
            <div style="display:flex;gap:0.5rem;margin-top:0.5rem;">
                <button class="edit-user-btn" data-idx="${idx}" style="background:#28a745;color:#fff;border:none;padding:0.3rem 0.9rem;border-radius:5px;font-size:0.98rem;">Edit</button>
                <button class="delete-user-btn" data-idx="${idx}" style="background:#dc3545;color:#fff;border:none;padding:0.3rem 0.9rem;border-radius:5px;font-size:0.98rem;">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
    // Sự kiện xóa user
    grid.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = +this.dataset.idx;
            if(confirm('Bạn có chắc muốn xóa user này?')) {
                const users = getUsers();
                users.splice(idx,1);
                setUsers(users);
                renderCustomers();
                renderDashboard();
                renderStorageInfo();
            }
        };
    });
    // Sự kiện sửa user
    grid.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = +this.dataset.idx;
            const users = getUsers();
            const user = users[idx];
            if(!user) return;
            // Hiện modal sửa
            if(document.getElementById('edit-user-modal')) return;
            const modal = document.createElement('div');
            modal.id = 'edit-user-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.background = 'rgba(0,0,0,0.25)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.innerHTML = `
                <form id="edit-user-form" style="background:#fff;padding:2rem 2.5rem;border-radius:12px;min-width:320px;box-shadow:0 2px 16px rgba(44,90,160,0.13);display:flex;flex-direction:column;gap:1rem;">
                    <h3 style="margin-bottom:0.5rem;">Edit User</h3>
                    <input type="text" id="edit-username" value="${user.username}" required placeholder="Username" style="padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    <input type="password" id="edit-password" placeholder="New Password (leave blank to keep old)" style="padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    <input type="password" id="edit-confirm-password" placeholder="Confirm New Password" style="padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    <input type="email" id="edit-email" value="${user.email ? user.email : ''}" placeholder="Email" style="padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    <input type="tel" id="edit-phone" value="${user.phone ? user.phone : ''}" placeholder="Phone" style="padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    <input type="text" id="edit-address" value="${user.address ? user.address : ''}" placeholder="Address" style="padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    <label style="font-size:0.98rem;"><input type="checkbox" id="edit-isadmin" ${user.isAdmin ? 'checked' : ''}> Admin</label>
                    <div style="display:flex;gap:1rem;justify-content:flex-end;">
                        <button type="button" id="cancel-edit-user" style="background:#ccc;color:#333;border:none;padding:0.5rem 1.2rem;border-radius:6px;">Cancel</button>
                        <button type="submit" style="background:#28a745;color:#fff;border:none;padding:0.5rem 1.2rem;border-radius:6px;font-weight:600;">Save</button>
                    </div>
                </form>
            `;
            document.body.appendChild(modal);
            document.getElementById('cancel-edit-user').onclick = function(){modal.remove();};
            document.getElementById('edit-user-form').onsubmit = function(e){
                e.preventDefault();
                const username = document.getElementById('edit-username').value.trim();
                const password = document.getElementById('edit-password').value;
                const confirmPassword = document.getElementById('edit-confirm-password').value;
                const isAdmin = document.getElementById('edit-isadmin').checked;
                const email = document.getElementById('edit-email').value.trim();
                const phone = document.getElementById('edit-phone').value.trim();
                const address = document.getElementById('edit-address').value.trim();
                if(!username){alert('Vui lòng nhập đủ thông tin!');return;}
                let newPassword = user.password;
                if(password || confirmPassword) {
                    if(password !== confirmPassword){alert('Mật khẩu xác nhận không khớp!');return;}
                    if(password.length < 1){alert('Mật khẩu mới không được để trống!');return;}
                    newPassword = password;
                }
                users[idx] = {username,password:newPassword,isAdmin,email,phone,address};
                setUsers(users);
                modal.remove();
                renderCustomers();
                renderDashboard();
                renderStorageInfo();
            };
        };
    });
}
// ===== RENDER STORAGE INFO =====
function renderStorageInfo() {
    const info = document.getElementById('storage-info');
    if (!info) return;
    info.innerHTML = `
        <div><b>Products:</b> ${getPets().length}</div>
        <div><b>Customers:</b> ${getUsers().length}</div>
        <div><b>Orders:</b> ${getOrders().length}</div>
        <div><b>Settings:</b> ${Object.keys(getSettings()).length}</div>
        <div><b>Storage Used:</b> ${(JSON.stringify(localStorage).length/1024).toFixed(2)} KB</div>
    `;
}
// ===== ADD PRODUCT MODAL =====
function showAddProductModal() {
    if(document.getElementById('add-product-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'add-product-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.25)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.innerHTML = `
        <form id="add-product-form" style="background:#fff;padding:2rem 2.5rem;border-radius:12px;min-width:400px;box-shadow:0 2px 16px rgba(44,90,160,0.13);display:flex;flex-direction:column;gap:1rem;">
            <h3 style="margin-bottom:0.5rem;color:#223a5f;">Add New Product</h3>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Product Name</label>
                    <input type="text" id="new-product-name" placeholder="Product Name" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Category</label>
                    <select id="new-product-category" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                        <option value="">Select Category</option>
                        <option value="dog">🐕 Dog</option>
                        <option value="cat">🐱 Cat</option>
                        <option value="bird">🐦 Bird</option>
                        <option value="fish">🐠 Fish</option>
                        <option value="rodent">🐹 Rodent</option>
                    </select>
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Price ($)</label>
                    <input type="number" id="new-product-price" placeholder="Price" min="0" step="0.01" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                </div>
                <div>
                    <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Quantity</label>
                    <input type="number" id="new-product-quantity" placeholder="Quantity" min="0" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                </div>
            </div>
            
            <div>
                <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Product Image</label>
                <div style="display:flex;gap:1rem;align-items:center;">
                    <div style="flex:1;">
                        <input type="url" id="new-product-image" placeholder="Image URL" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;">
                    </div>
                    <div style="text-align:center;color:#666;font-size:0.9rem;">OR</div>
                    <div>
                        <input type="file" id="new-product-image-file" accept="image/*" style="display:none;">
                        <button type="button" onclick="document.getElementById('new-product-image-file').click()" style="background:#007bff;color:white;border:none;padding:0.6rem 1rem;border-radius:6px;cursor:pointer;font-size:0.9rem;">Upload Image</button>
                    </div>
                </div>
                <div id="new-image-preview" style="margin-top:0.5rem;text-align:center;"></div>
            </div>
            
            <div>
                <label style="display:block;margin-bottom:0.3rem;font-weight:600;color:#333;">Description</label>
                <textarea id="new-product-description" placeholder="Description" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #ccc;min-height:80px;"></textarea>
            </div>
            
            <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1rem;">
                <button type="button" id="cancel-add-product" style="background:#ccc;color:#333;border:none;padding:0.5rem 1.2rem;border-radius:6px;">Cancel</button>
                <button type="submit" style="background:#28a745;color:#fff;border:none;padding:0.5rem 1.2rem;border-radius:6px;font-weight:600;">Add Product</button>
            </div>
        </form>
    `;
    document.body.appendChild(modal);
    document.getElementById('cancel-add-product').onclick = function(){modal.remove();};
    
    // Handle image file upload for add form
    document.getElementById('new-product-image-file').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                document.getElementById('new-product-image').value = imageUrl;
                document.getElementById('new-image-preview').innerHTML = `
                    <img src="${imageUrl}" alt="Preview" style="max-width:100px;max-height:100px;border-radius:6px;border:1px solid #ddd;">
                    <div style="font-size:0.8rem;color:#666;margin-top:0.3rem;">${file.name} (${(file.size/1024).toFixed(1)}KB)</div>
                `;
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('add-product-form').onsubmit = function(e){
        e.preventDefault();
        const name = document.getElementById('new-product-name').value.trim();
        const price = parseFloat(document.getElementById('new-product-price').value);
        const quantity = parseInt(document.getElementById('new-product-quantity').value);
        const category = document.getElementById('new-product-category').value;
        const image = document.getElementById('new-product-image').value.trim() || 'no-image.png';
        const description = document.getElementById('new-product-description').value.trim();
        if(!name||isNaN(price)||isNaN(quantity)||!category||!description){alert('Vui lòng nhập đầy đủ thông tin!');return;}
        const pets = getPets();
        pets.push({id:Date.now(),name,price,quantity,image,description,category});
        setPets(pets);
        modal.remove();
        renderProducts();
        renderDashboard();
    };
}
// ===== RENDER ORDERS =====
function renderOrders() {
    const list = document.getElementById('orders-list-admin');
    if (!list) return;
    const orders = getOrders();
    list.innerHTML = '';
    if (orders.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#888;padding:2rem;">No orders found.</div>';
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    orders.forEach((order, idx) => {
        const card = document.createElement('div');
        card.className = 'order-card-admin';
        card.innerHTML = `
            <div class="order-header-admin">
                <div class="order-info-admin">
                    <div class="order-id-admin">Order #${order.id}</div>
                    <div class="order-customer-admin">Customer: ${order.userId}</div>
                    <div class="order-date-admin">${new Date(order.orderDate).toLocaleDateString()}</div>
                </div>
                <div class="order-status-admin ${order.status}">${order.status}</div>
            </div>
            
            <div class="order-shipping-info-admin">
                <h4>Shipping Information</h4>
                <div><strong>Name:</strong> ${order.shippingInfo.name}</div>
                <div><strong>Email:</strong> ${order.shippingInfo.email}</div>
                <div><strong>Phone:</strong> ${order.shippingInfo.phone}</div>
                <div><strong>Address:</strong> ${order.shippingInfo.address}</div>
                <div><strong>City:</strong> ${order.shippingInfo.city}</div>
                <div><strong>Country:</strong> ${order.shippingInfo.country}</div>
            </div>
            
            <div class="order-items-admin">
                ${order.items.map(item => `
                    <div class="order-item-admin">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-item-details-admin">
                            <div class="order-item-name-admin">${item.name}</div>
                            <div class="order-item-price-admin">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="order-item-quantity-admin">Qty: ${item.quantity}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total-admin">
                Total: $${order.total.toFixed(2)}
            </div>
            
            <div class="order-actions-admin">
                <button class="order-action-btn-admin primary" onclick="viewOrderDetailsAdmin(${order.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${order.status === 'pending' ? `
                    <button class="order-action-btn-admin secondary" onclick="updateOrderStatus(${order.id}, 'processing')">
                        <i class="fas fa-cog"></i> Process
                    </button>
                ` : ''}
                ${order.status === 'processing' ? `
                    <button class="order-action-btn-admin warning" onclick="updateOrderStatus(${order.id}, 'shipped')">
                        <i class="fas fa-shipping-fast"></i> Ship
                    </button>
                ` : ''}
                ${order.status === 'shipped' ? `
                    <button class="order-action-btn-admin primary" onclick="updateOrderStatus(${order.id}, 'delivered')">
                        <i class="fas fa-check"></i> Deliver
                    </button>
                ` : ''}
                ${order.status === 'pending' ? `
                    <button class="order-action-btn-admin danger" onclick="updateOrderStatus(${order.id}, 'cancelled')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : ''}
            </div>
        `;
        list.appendChild(card);
    });
}

// ===== VIEW ORDER DETAILS ADMIN =====
function viewOrderDetailsAdmin(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    if(document.getElementById('order-detail-modal-admin')) return;
    const modal = document.createElement('div');
    modal.id = 'order-detail-modal-admin';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.25)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div style="background:#fff;padding:2.5rem;border-radius:16px;min-width:500px;max-width:700px;box-shadow:0 8px 40px rgba(44,90,160,0.18);max-height:80vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <h3 style="margin:0;color:#223a5f;">Order Details #${order.id}</h3>
                <button id="close-order-detail-admin" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#888;">×</button>
            </div>
            
            <div style="margin-bottom:1.5rem;">
                <div style="background:#f8f9fa;padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <div><strong>Order ID:</strong> #${order.id}</div>
                    <div><strong>Customer:</strong> ${order.userId}</div>
                    <div><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</div>
                    <div><strong>Status:</strong> <span class="order-status-admin ${order.status}">${order.status}</span></div>
                    <div><strong>Total:</strong> $${order.total.toFixed(2)}</div>
                </div>
                
                <h4 style="color:#333;margin-bottom:1rem;">Shipping Information:</h4>
                <div style="background:#f8f9fa;padding:1rem;border-radius:8px;margin-bottom:1rem;">
                    <div><strong>Name:</strong> ${order.shippingInfo.name}</div>
                    <div><strong>Email:</strong> ${order.shippingInfo.email}</div>
                    <div><strong>Phone:</strong> ${order.shippingInfo.phone}</div>
                    <div><strong>Address:</strong> ${order.shippingInfo.address}</div>
                    <div><strong>City:</strong> ${order.shippingInfo.city}</div>
                    <div><strong>Country:</strong> ${order.shippingInfo.country}</div>
                </div>
                
                <h4 style="color:#333;margin-bottom:1rem;">Order Items:</h4>
                <div style="max-height:200px;overflow-y:auto;">
                    ${order.items.map(item => `
                        <div style="display:flex;align-items:center;padding:0.8rem;border-bottom:1px solid #f0f0f0;">
                            <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;margin-right:1rem;">
                            <div style="flex:1;">
                                <div style="font-weight:600;color:#333;">${item.name}</div>
                                <div style="color:#666;font-size:0.9rem;">$${item.price.toFixed(2)} x ${item.quantity}</div>
                            </div>
                            <div style="color:#2c5aa0;font-weight:600;">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="display:flex;gap:1rem;justify-content:flex-end;">
                <button id="cancel-order-detail-admin" style="background:#6c757d;color:#fff;border:none;padding:0.7rem 1.5rem;border-radius:8px;font-weight:600;cursor:pointer;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('close-order-detail-admin').onclick = function(){modal.remove();};
    document.getElementById('cancel-order-detail-admin').onclick = function(){modal.remove();};
}

// ===== UPDATE ORDER STATUS =====
function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        setOrders(orders);
        
        showNotification(`Order #${orderId} status updated to ${newStatus}!`);
        renderOrders();
        renderDashboard();
    }
}
// ===== STORAGE ACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').replace('#','');
            showSection(section);
            if(section==='dashboard') renderDashboard();
            if(section==='customers') renderCustomers();
            if(section==='storage') renderStorageInfo();
            if(section==='products') renderProducts();
            if(section==='orders') renderOrders();
        });
    });
    
    // Order status filter
    const orderStatusFilter = document.getElementById('order-status-filter-admin');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', function() {
            const selectedStatus = this.value;
            renderOrdersByStatus(selectedStatus);
        });
    }
    
    // Export orders button
    const exportOrdersBtn = document.querySelector('.export-orders-btn');
    if (exportOrdersBtn) {
        exportOrdersBtn.addEventListener('click', exportOrders);
    }
    
    // Hiển thị dashboard mặc định
    showSection('dashboard');
    renderDashboard();
    renderProducts();
    renderCustomers();
    renderStorageInfo();
    
    // Storage actions
    document.querySelector('.backup-btn').onclick = function(){alert('Backup thành công (demo)!');};
    document.querySelector('.restore-btn').onclick = function(){alert('Restore thành công (demo)!');};
    document.querySelector('.export-btn').onclick = function(){alert('Export thành công (demo)!');};
    document.querySelector('.clear-btn').onclick = function(){localStorage.clear();alert('Đã xóa toàn bộ dữ liệu!');location.reload();};
    document.querySelector('.add-product-btn').onclick = showAddProductModal;
    document.querySelector('.logout-btn').onclick = function(){
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    };
});

// ===== RENDER ORDERS BY STATUS =====
function renderOrdersByStatus(statusFilter = 'all') {
    const list = document.getElementById('orders-list-admin');
    if (!list) return;
    const orders = getOrders();
    
    // Filter orders by status
    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);
    
    list.innerHTML = '';
    if (filteredOrders.length === 0) {
        list.innerHTML = `<div style="text-align:center;color:#888;padding:2rem;">No ${statusFilter === 'all' ? '' : statusFilter} orders found.</div>`;
        return;
    }
    
    // Sort orders by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    filteredOrders.forEach((order, idx) => {
        const card = document.createElement('div');
        card.className = 'order-card-admin';
        card.innerHTML = `
            <div class="order-header-admin">
                <div class="order-info-admin">
                    <div class="order-id-admin">Order #${order.id}</div>
                    <div class="order-customer-admin">Customer: ${order.userId}</div>
                    <div class="order-date-admin">${new Date(order.orderDate).toLocaleDateString()}</div>
                </div>
                <div class="order-status-admin ${order.status}">${order.status}</div>
            </div>
            
            <div class="order-shipping-info-admin">
                <h4>Shipping Information</h4>
                <div><strong>Name:</strong> ${order.shippingInfo.name}</div>
                <div><strong>Email:</strong> ${order.shippingInfo.email}</div>
                <div><strong>Phone:</strong> ${order.shippingInfo.phone}</div>
                <div><strong>Address:</strong> ${order.shippingInfo.address}</div>
                <div><strong>City:</strong> ${order.shippingInfo.city}</div>
                <div><strong>Country:</strong> ${order.shippingInfo.country}</div>
            </div>
            
            <div class="order-items-admin">
                ${order.items.map(item => `
                    <div class="order-item-admin">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-item-details-admin">
                            <div class="order-item-name-admin">${item.name}</div>
                            <div class="order-item-price-admin">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="order-item-quantity-admin">Qty: ${item.quantity}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total-admin">
                Total: $${order.total.toFixed(2)}
            </div>
            
            <div class="order-actions-admin">
                <button class="order-action-btn-admin primary" onclick="viewOrderDetailsAdmin(${order.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${order.status === 'pending' ? `
                    <button class="order-action-btn-admin secondary" onclick="updateOrderStatus(${order.id}, 'processing')">
                        <i class="fas fa-cog"></i> Process
                    </button>
                ` : ''}
                ${order.status === 'processing' ? `
                    <button class="order-action-btn-admin warning" onclick="updateOrderStatus(${order.id}, 'shipped')">
                        <i class="fas fa-shipping-fast"></i> Ship
                    </button>
                ` : ''}
                ${order.status === 'shipped' ? `
                    <button class="order-action-btn-admin primary" onclick="updateOrderStatus(${order.id}, 'delivered')">
                        <i class="fas fa-check"></i> Deliver
                    </button>
                ` : ''}
                ${order.status === 'pending' ? `
                    <button class="order-action-btn-admin danger" onclick="updateOrderStatus(${order.id}, 'cancelled')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                ` : ''}
            </div>
        `;
        list.appendChild(card);
    });
}

// ===== EXPORT ORDERS =====
function exportOrders() {
    const orders = getOrders();
    if (orders.length === 0) {
        alert('No orders to export!');
        return;
    }
    
    const csvContent = generateOrdersCSV(orders);
    downloadCSV(csvContent, 'orders_export.csv');
    alert('Orders exported successfully!');
}

// ===== GENERATE ORDERS CSV =====
function generateOrdersCSV(orders) {
    const headers = ['Order ID', 'Customer', 'Order Date', 'Status', 'Total', 'Items', 'Shipping Name', 'Shipping Email', 'Shipping Phone', 'Shipping Address'];
    const csvRows = [headers.join(',')];
    
    orders.forEach(order => {
        const items = order.items.map(item => `${item.name} (${item.quantity})`).join('; ');
        const row = [
            order.id,
            order.userId,
            new Date(order.orderDate).toLocaleDateString(),
            order.status,
            order.total.toFixed(2),
            items,
            order.shippingInfo.name,
            order.shippingInfo.email,
            order.shippingInfo.phone,
            `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.country}`
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

// ===== DOWNLOAD CSV =====
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 