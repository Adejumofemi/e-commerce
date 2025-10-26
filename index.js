const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');
const addToCart = document.querySelectorAll('#add-to-cart');
const cartCounter = document.getElementById('cart-counter');
const mobileCartCounter = document.getElementById('mobile-cart-counter');
const cartSuccess = document.getElementById('cart-success');

// Mobile menu functionality
if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        console.log('Menu opened');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
        // Restore body scroll when menu is closed
        document.body.style.overflow = '';
    });
}

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('#navbar li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !bar.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Update cart counters
function updateCartCounters() {
    const totalItems = cartItems.reduce((sum, item) => {
        if (typeof item === 'string') {
            return sum + 1;
        } else if (typeof item === 'object' && item.quantity) {
            return sum + item.quantity;
        }
        return sum + 1;
    }, 0);
    
    cartCounter.innerHTML = totalItems;
    if (mobileCartCounter) {
        mobileCartCounter.innerHTML = totalItems;
    }
}


let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

if (addToCart) {
    addToCart.forEach((item, index) => {
        item.addEventListener('click', () => {
            cartCounter.innerHTML++;
            
            // Get the product container
            const productContainer = item.closest('.pro');
            
            // Extract product information from the HTML
            const productImg = productContainer.querySelector('img');
            const productBrand = productContainer.querySelector('.des span').textContent;
            const productName = productContainer.querySelector('.des h5').textContent;
            const productPrice = parseInt(productContainer.querySelector('.des h4').textContent.replace('$', ''));
            const productImage = productImg ? productImg.src : './assets/download (4).jpeg';
            
            // Create unique product ID
            const productId = `${productBrand}-${productName}-${productPrice}-${index}`;
            
            // Create product object with all information
            const productData = {
                id: productId,
                brand: productBrand,
                name: productName,
                price: productPrice,
                image: productImage,
                timestamp: Date.now() // For uniqueness
            };
            
            console.log('Adding product to cart:', productData); // Debug log
            cartItems.push(productData);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCounters();
            cartSuccess.style.display = "Flex";

            
    setTimeout(removeSuccess, 3000);
        });
    });
}

// Initialize cart counters
updateCartCounters();


    function removeSuccess(){
        cartSuccess.style.display = "None";
    }

