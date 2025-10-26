// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const orderItemsContainer = document.getElementById('order-items');
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderShipping = document.getElementById('order-shipping');
    const orderTax = document.getElementById('order-tax');
    const orderTotal = document.getElementById('order-total');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const shippingSameCheckbox = document.getElementById('shippingSame');
    const shippingDetails = document.getElementById('shipping-details');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('card-details');

    // Load cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Initialize checkout
    updateOrderSummary();
    setupEventListeners();
    
    // Redirect to cart if empty
    if (cartItems.length === 0) {
        showMessage('Your cart is empty. Redirecting to cart...', 'error');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }

    function updateOrderSummary() {
        if (cartItems.length === 0) {
            return;
        }

        // Group cart items by product
        let groupedCartItems = {};
        cartItems.forEach(item => {
            if (!item) return;
            
            if (typeof item === 'string') {
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

        // Display order items
        orderItemsContainer.innerHTML = '';
        let subtotal = 0;

        Object.keys(groupedCartItems).forEach(productId => {
            const item = groupedCartItems[productId];
            const product = item.product;
            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;

            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="order-item-info">
                    <h5>${product.name}</h5>
                    <span>${product.brand}</span>
                </div>
                <div class="order-item-quantity">Qty: ${item.quantity}</div>
                <div class="order-item-price">$${itemSubtotal}</div>
            `;
            orderItemsContainer.appendChild(orderItem);
        });

        // Calculate totals
        const shipping = 0; // Free shipping
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;

        orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        orderShipping.textContent = 'Free';
        orderTax.textContent = `$${tax.toFixed(2)}`;
        orderTotal.textContent = `$${total.toFixed(2)}`;
    }

    function setupEventListeners() {
        // Shipping address toggle
        shippingSameCheckbox.addEventListener('change', function() {
            if (this.checked) {
                shippingDetails.style.display = 'block';
                // Make shipping fields required
                const shippingFields = shippingDetails.querySelectorAll('input');
                shippingFields.forEach(field => {
                    field.required = true;
                });
            } else {
                shippingDetails.style.display = 'none';
                // Remove required from shipping fields
                const shippingFields = shippingDetails.querySelectorAll('input');
                shippingFields.forEach(field => {
                    field.required = false;
                    field.value = '';
                });
            }
        });

        // Payment method toggle
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                if (this.value === 'card') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            });
        });

        // Form validation
        checkoutForm.addEventListener('submit', handleFormSubmit);

        // Real-time validation
        const inputs = checkoutForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', formatCardNumber);
        }

        // Expiry date formatting
        const expiryDateInput = document.getElementById('expiryDate');
        if (expiryDateInput) {
            expiryDateInput.addEventListener('input', formatExpiryDate);
        }

        // CVV formatting
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', formatCVV);
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('Please fix the errors below', 'error');
            return;
        }

        // Show loading state
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        
        // Simulate order processing
        setTimeout(() => {
            processOrder();
        }, 2000);
    }

    function validateForm() {
        let isValid = true;
        const formData = new FormData(checkoutForm);
        
        // Clear previous errors
        clearAllErrors();
        
        // Validate required fields
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 'address', 
            'city', 'state', 'zipCode', 'country'
        ];
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });

        // Validate email
        const email = document.getElementById('email');
        if (email.value && !isValidEmail(email.value)) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phone = document.getElementById('phone');
        if (phone.value && !isValidPhone(phone.value)) {
            showFieldError(phone, 'Please enter a valid phone number');
            isValid = false;
        }

        // Validate shipping fields if different address is selected
        if (shippingSameCheckbox.checked) {
            const shippingRequiredFields = [
                'shippingFirstName', 'shippingLastName', 'shippingAddress',
                'shippingCity', 'shippingState', 'shippingZipCode'
            ];
            
            shippingRequiredFields.forEach(fieldName => {
                const field = document.getElementById(fieldName);
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                }
            });
        }

        // Validate card details if card payment is selected
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        if (selectedPayment && selectedPayment.value === 'card') {
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');
            const cardName = document.getElementById('cardName');

            if (!cardNumber.value.trim()) {
                showFieldError(cardNumber, 'Card number is required');
                isValid = false;
            } else if (!isValidCardNumber(cardNumber.value)) {
                showFieldError(cardNumber, 'Please enter a valid card number');
                isValid = false;
            }

            if (!expiryDate.value.trim()) {
                showFieldError(expiryDate, 'Expiry date is required');
                isValid = false;
            } else if (!isValidExpiryDate(expiryDate.value)) {
                showFieldError(expiryDate, 'Please enter a valid expiry date (MM/YY)');
                isValid = false;
            }

            if (!cvv.value.trim()) {
                showFieldError(cvv, 'CVV is required');
                isValid = false;
            } else if (!isValidCVV(cvv.value)) {
                showFieldError(cvv, 'Please enter a valid CVV');
                isValid = false;
            }

            if (!cardName.value.trim()) {
                showFieldError(cardName, 'Name on card is required');
                isValid = false;
            }
        }

        // Validate terms acceptance
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            showFieldError(terms, 'You must accept the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        clearFieldError(e);
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return;
        }

        switch (field.type) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                }
                break;
            case 'tel':
                if (value && !isValidPhone(value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                }
                break;
        }
    }

    function clearFieldError(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function clearAllErrors() {
        const errorGroups = document.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    }

    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    function processOrder() {
        // Clear cart
        localStorage.removeItem('cartItems');
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        checkoutForm.reset();
    }

    function showSuccessModal() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'success-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="success-modal">
                <div class="success-modal-content">
                    <div class="success-icon">
                        <i class="fa-solid fa-check-circle"></i>
                    </div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for your purchase. Your order has been confirmed and you will receive a confirmation email shortly.</p>
                    
                    <div class="order-details">
                        <div class="detail-row">
                            <span>Order Number:</span>
                            <span class="order-number">#${generateOrderNumber()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Estimated Delivery:</span>
                            <span class="delivery-date">${getDeliveryDate()}</span>
                        </div>
                        <div class="detail-row">
                            <span>Total Amount:</span>
                            <span class="total-amount">${orderTotal.textContent}</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeSuccessModal()">
                            <i class="fa-solid fa-shopping-bag"></i>
                            Continue Shopping
                        </button>
                    </div>
                    
                    <div class="modal-footer">
                        <p>You will receive an email confirmation at <strong>${document.getElementById('email').value}</strong></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Animate modal appearance
        setTimeout(() => {
            modalOverlay.classList.add('show');
        }, 100);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeSuccessModal() {
        const modal = document.querySelector('.success-modal-overlay');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
                // Redirect to home page
                window.location.href = 'index.html';
            }, 300);
        }
    }

    function trackOrder() {
        // Close modal first
        closeSuccessModal();
        // In a real app, this would redirect to order tracking
        showMessage('Order tracking feature would be implemented here', 'success');
    }

    function generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp.toString().slice(-6)}-${random}`;
    }

    function getDeliveryDate() {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
        return deliveryDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Make functions globally available
    window.closeSuccessModal = closeSuccessModal;
    window.trackOrder = trackOrder;

    function showMessage(message, type) {
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#e8f6ea' : '#f8d7da'};
            color: ${type === 'success' ? '#088178' : '#721c24'};
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            max-width: 400px;
            border-left: 4px solid ${type === 'success' ? '#088178' : '#ef3636'};
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // Validation helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    function isValidCardNumber(cardNumber) {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        return /^\d{13,19}$/.test(cleanNumber);
    }

    function isValidExpiryDate(expiryDate) {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(expiryDate)) return false;
        
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }
        
        return true;
    }

    function isValidCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    // Formatting functions
    function formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    }

    function formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    function formatCVV(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
