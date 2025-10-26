// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const cartCounter = document.getElementById('cart-counter');
    const proceedCheckoutBtn = document.getElementById('proceed-checkout');

    // Product mapping based on your existing products from index.html
    const productMapping = {
        'download (4).jpeg': {
            name: 'Cartoon Astronaut T-Shirts',
            brand: 'adidas',
            price: 78,
            image: './assets/download (4).jpeg'
        },
        'download (5).jpeg': {
            name: 'Cartoon Astronaut T-Shirts',
            brand: 'adidas',
            price: 78,
            image: './assets/download (5).jpeg'
        },
        'download (6).jpeg': {
            name: 'Cartoon Astronaut T-Shirts',
            brand: 'adidas',
            price: 78,
            image: './assets/download (6).jpeg'
        },
        'download (7).jpeg': {
            name: 'Cartoon Astronaut T-Shirts',
            brand: 'adidas',
            price: 79,
            image: './assets/download (7).jpeg'
        },
        'download (8).jpeg': {
            name: 'Cartoon Astronaut T-Shirts',
            brand: 'adidas',
            price: 78,
            image: './assets/download (8).jpeg'
        },
        'default-product': {
            name: 'Cartoon Astronaut T-Shirts',
            brand: 'adidas',
            price: 78,
            image: './assets/download (4).jpeg'
        }
    };

    // Load cart items from localStorage (your existing system)
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    

    
    // Clean up cart items - remove null, undefined, or invalid entries
    cartItems = cartItems.filter(item => {
        if (!item) {
            return false;
        }
        if (typeof item === 'object' && !item.id) {
            return false;
        }
        return true;
    });
    
    // Save cleaned cart back to localStorage
    if (cartItems.length !== JSON.parse(localStorage.getItem('cartItems') || '[]').length) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    // Clear cart for testing (remove this line after testing)
    // localStorage.removeItem('cartItems');
    // cartItems = [];
    
    // Group cart items by product and count quantities
    let groupedCartItems = {};
    cartItems.forEach(item => {
        // Skip null, undefined, or invalid items
        if (!item) {
            return;
        }
        
        // Handle both old string format and new object format
        if (typeof item === 'string') {
            // Old format - convert to default product
            const productId = item || 'default-product';
            if (groupedCartItems[productId]) {
                groupedCartItems[productId].quantity += 1;
            } else {
                groupedCartItems[productId] = {
                    id: productId,
                    quantity: 1,
                    product: {
                        name: 'Cartoon Astronaut T-Shirts',
                        brand: 'adidas',
                        price: 78,
                        image: './assets/download (4).jpeg'
                    }
                };
            }
        } else if (typeof item === 'object' && item.id) {
            // New format - item is an object with product data
            const productId = item.id;
            if (groupedCartItems[productId]) {
                groupedCartItems[productId].quantity += 1;
            } else {
                groupedCartItems[productId] = {
                    id: productId,
                    quantity: 1,
                    product: {
                        name: item.name || 'Product',
                        brand: item.brand || 'Brand',
                        price: item.price || 0,
                        image: item.image || './assets/download (4).jpeg'
                    }
                };
            }
        } else {
            // Invalid item format - skip it
           
        }
    });
    
    // Initialize cart display
    updateCartDisplay();
    updateCartCounter();

    function updateCartDisplay() {
        const cartAddSection = document.getElementById('cart-add');
        const cartSection = document.getElementById('cart');
        
        if (cartItems.length === 0) {
            showEmptyCart();
            // Hide coupon and totals section when cart is empty
            if (cartAddSection) {
                cartAddSection.style.display = 'none';
            }
            // Hide cart table when empty
            if (cartSection) {
                cartSection.style.display = 'none';
            }
            return;
        }

        // Hide empty cart section when cart has items
        const emptyCartSection = document.getElementById('empty-cart-section');
        if (emptyCartSection) {
            emptyCartSection.style.display = 'none';
        }
        
        // Show cart table when cart has items
        if (cartSection) {
            cartSection.style.display = 'block';
        }
        // Show coupon and totals section when cart has items
        if (cartAddSection) {
            cartAddSection.style.display = 'flex';
        }

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let itemIndex = 0;

        // Display grouped cart items
        Object.keys(groupedCartItems).forEach(productId => {
            const item = groupedCartItems[productId];
            
            // Use the product data directly from the grouped item
            const product = item.product;

            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;

            const cartItemRow = document.createElement('tr');
            cartItemRow.innerHTML = `
                <td>
                    <button class="remove-btn" onclick="removeFromCart('${productId}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
                <td>
                    <img src="${product.image}" alt="${product.name}">
                </td>
                <td>
                    <div class="cart-product-info">
                        <span>${product.brand}</span>
                        <h5>${product.name}</h5>
                    </div>
                </td>
                <td>$${product.price}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" max="10" 
                           onchange="updateQuantity('${productId}', this.value)">
                </td>
                <td>$${itemSubtotal}</td>
            `;
            cartItemsContainer.appendChild(cartItemRow);
            itemIndex++;
        });

        // Update totals
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    function showEmptyCart() {
        // Create or update empty cart message section
        let emptyCartSection = document.getElementById('empty-cart-section');
        if (!emptyCartSection) {
            emptyCartSection = document.createElement('div');
            emptyCartSection.id = 'empty-cart-section';
            emptyCartSection.className = 'empty-cart-container';
            
            // Insert after page header
            const pageHeader = document.getElementById('page-header');
            if (pageHeader) {
                pageHeader.insertAdjacentElement('afterend', emptyCartSection);
            }
        }
        
        emptyCartSection.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="index.html" class="normal">Continue Shopping</a>
            </div>
        `;
        
        // Show empty cart section
        emptyCartSection.style.display = 'block';
        
        cartSubtotal.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
        
        // Ensure cart-add section is hidden for empty cart
        const cartAddSection = document.getElementById('cart-add');
        if (cartAddSection) {
            cartAddSection.style.display = 'none';
        }
    }

    function updateCartCounter() {
        const totalItems = cartItems.reduce((sum, item) => {
            if (typeof item === 'string') {
                return sum + 1;
            } else if (typeof item === 'object' && item.quantity) {
                return sum + item.quantity;
            }
            return sum + 1;
        }, 0);
        
        cartCounter.textContent = totalItems;
        
        // Update mobile cart counter if it exists
        const mobileCartCounter = document.getElementById('mobile-cart-counter');
        if (mobileCartCounter) {
            mobileCartCounter.textContent = totalItems;
        }
    }

    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function refreshGroupedItems() {
        groupedCartItems = {};
        cartItems.forEach(item => {
            // Skip null, undefined, or invalid items
            if (!item) {
                return;
            }
            
            // Handle both old string format and new object format
            if (typeof item === 'string') {
                // Old format - convert to default product
                const productId = item || 'default-product';
                if (groupedCartItems[productId]) {
                    groupedCartItems[productId].quantity += 1;
                } else {
                    groupedCartItems[productId] = {
                        id: productId,
                        quantity: 1,
                        product: {
                            name: 'Cartoon Astronaut T-Shirts',
                            brand: 'adidas',
                            price: 78,
                            image: './assets/download (4).jpeg'
                        }
                    };
                }
            } else if (typeof item === 'object' && item.id) {
                // New format - item is an object with product data
                const productId = item.id;
                if (groupedCartItems[productId]) {
                    groupedCartItems[productId].quantity += 1;
                } else {
                    groupedCartItems[productId] = {
                        id: productId,
                        quantity: 1,
                        product: {
                            name: item.name || 'Product',
                            brand: item.brand || 'Brand',
                            price: item.price || 0,
                            image: item.image || './assets/download (4).jpeg'
                        }
                    };
                }
            }
        });
    }

    // Global functions for cart operations
    window.removeFromCart = function(productId) {
        // Remove all instances of this product from cart
        cartItems = cartItems.filter(item => {
            if (typeof item === 'string') {
                return item !== productId;
            } else {
                return item.id !== productId;
            }
        });
        saveCartToStorage();
        refreshGroupedItems();
        updateCartDisplay();
        updateCartCounter();
        
        // Show success message
        showCartMessage('Item removed from cart', 'success');
    };

    window.updateQuantity = function(productId, newQuantity) {
        const quantity = parseInt(newQuantity);
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        // Count current instances of this product
        const currentCount = cartItems.filter(item => {
            if (typeof item === 'string') {
                return item === productId;
            } else {
                return item.id === productId;
            }
        }).length;
        
        const difference = quantity - currentCount;
        
        if (difference > 0) {
            // Add more instances - find the original product data
            const originalProduct = cartItems.find(item => {
                if (typeof item === 'string') {
                    return item === productId;
                } else {
                    return item.id === productId;
                }
            });
            
            if (originalProduct) {
                for (let i = 0; i < difference; i++) {
                    cartItems.push(originalProduct);
                }
            }
        } else if (difference < 0) {
            // Remove instances
            const instancesToRemove = Math.abs(difference);
            let removed = 0;
            cartItems = cartItems.filter(item => {
                const isMatch = typeof item === 'string' ? item === productId : item.id === productId;
                if (isMatch && removed < instancesToRemove) {
                    removed++;
                    return false;
                }
                return true;
            });
        }
        
        saveCartToStorage();
        refreshGroupedItems();
        updateCartDisplay();
        updateCartCounter();
        
        // Show success message
        showCartMessage('Quantity updated', 'success');
    };

    function showCartMessage(message, type) {
        const existingMessage = document.querySelector('.cart-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `cart-message ${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#088178' : '#ef3636'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // Proceed to checkout
    proceedCheckoutBtn.addEventListener('click', function() {
        if (cartItems.length === 0) {
            showCartMessage('Your cart is empty!', 'error');
            return;
        }
        
        // Show loading state
        proceedCheckoutBtn.disabled = true;
        proceedCheckoutBtn.classList.add('loading');
        proceedCheckoutBtn.textContent = 'Processing...';
        
        // Show success message
        showCartMessage('Redirecting to checkout...', 'success');
        
        // Small delay for better UX, then redirect
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    });

    // Coupon functionality
    const couponInput = document.querySelector('#coupon input');
    const applyCouponBtn = document.querySelector('#coupon button');
    
    applyCouponBtn.addEventListener('click', function() {
        const couponCode = couponInput.value.trim().toLowerCase();
        
        if (couponCode === '') {
            showCartMessage('Please enter a coupon code', 'error');
            return;
        }
        
        // Sample coupon codes
        const validCoupons = {
            'save10': { discount: 0.1, message: '10% discount applied!' },
            'welcome': { discount: 0.15, message: 'Welcome discount applied!' },
            'summer': { discount: 0.2, message: 'Summer sale discount applied!' }
        };
        
        if (validCoupons[couponCode]) {
            const discount = validCoupons[couponCode].discount;
            const currentTotal = parseFloat(cartTotal.textContent.replace('$', ''));
            const discountedTotal = currentTotal * (1 - discount);
            
            cartTotal.textContent = `$${discountedTotal.toFixed(2)}`;
            showCartMessage(validCoupons[couponCode].message, 'success');
            couponInput.value = '';
        } else {
            showCartMessage('Invalid coupon code', 'error');
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
