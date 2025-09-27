// Menu Data
const menuData = [
    {
        id: 1,
        name: "Bruschetta Classica",
        category: "appetizers",
        price: 270,
        description: "Grilled bread topped with fresh tomatoes, garlic, basil and olive oil",
        image: "images/Menu/Bruschetta_Classica.jpg",
        rating: 4.8
    },
    {
        id: 2,
        name: "Antipasto Misto",
        category: "appetizers",
        price: 450,
        description: "Selection of cured meats, cheeses, olives and roasted vegetables",
        image:"images/Menu/Antipasto_Misto.jpg",
        rating: 4.9
    },
    {
        id: 3,
        name: "Calamari Fritti",
        category: "appetizers",
        price: 350,
        description: "Crispy fried squid rings served with marinara sauce",
        image: "images/Menu/Calamari_Fritti.jpg",
        rating: 4.7
    },
    {
        id: 4,
        name: "Spaghetti Carbonara",
        category: "main-course",
        price: 450,
        description: "Classic Roman pasta with eggs, cheese, pancetta and black pepper",
        image: "images/Menu/Spaghetti_Carbonara.jpg",
        rating: 4.9
    },
    {
        id: 5,
        name: "Risotto ai Porcini",
        category: "main-course",
        price: 540,
        description: "Creamy arborio rice with porcini mushrooms and parmesan",
        image: "images/Menu/Risotto_ai_Porcini.jpg",
        rating: 4.8
    },
    {
        id: 6,
        name: "Osso Buco",
        category: "main-course",
        price: 480,
        description: "Braised veal shanks with vegetables, white wine and herbs",
        image: "images/Menu/Osso_Buco.jpg",
        rating: 4.9
    },
    {
        id: 7,
        name: "Pizza Margherita",
        category: "main-course",
        price: 360,
        description: "Traditional pizza with tomato sauce, mozzarella and fresh basil",
        image: "images/Menu/Pizza_Margherita.jpg",
        rating: 4.7
    },
    {
        id: 8,
        name: "Tiramisu",
        category: "desserts",
        price: 180,
        description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
        image: "images/Menu/Tiramisu.jpg",
        rating: 4.9
    },
    {
        id: 9,
        name: "Panna Cotta",
        category: "desserts",
        price: 270,
        description: "Silky vanilla custard topped with berry compote",
        image: "images/Menu/Panna_Cotta.jpg",
        rating: 4.8
    },
    {
        id: 10,
        name: "Gelato Selection",
        category: "desserts",
        price: 90,
        description: "Three scoops of artisanal gelato - vanilla, chocolate, and pistachio",
        image: "images/Menu/Gelato_Selection.jpg",
        rating: 4.7
    },
    {
        id: 11,
        name: "Italian Wine Selection",
        category: "beverages",
        price: 450,
        description: "Premium bottle of Chianti Classico DOCG",
        image: "images/Menu/Italian_Wine_Selection.jpg",
        rating: 4.9
    },
    {
        id: 12,
        name: "Espresso",
        category: "beverages",
        price: 90,
        description: "Authentic Italian espresso made from premium beans",
        image: "images/Menu/espresso.jpg",
        rating: 4.8
    },
    {
        id: 13,
        name: "Limoncello",
        category: "beverages",
        price: 45,
        description: "Traditional Italian lemon liqueur, served chilled",
        image: "images/Menu/Limoncello.jpg",
        rating: 4.7
    },
    {
        id: 14,
        name: "Aperol Spritz",
        category: "beverages",
        price: 90,
        description: "Refreshing cocktail with Aperol, prosecco and soda water",
        image: "images/Menu/Aperol_Spritz.jpg",
        rating: 4.6
    }
];

// Cart functionality - optimized
let cart = [];
let cartTotal = 0;

// Testimonials Carousel Functionality
let currentTestimonial = 0;
let testimonialsInterval;
let totalTestimonials = 5; // Total number of testimonials

// Initialize the website - optimized
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    updateCartDisplay();
    
    // Initialize testimonials carousel
    setTimeout(initTestimonialsCarousel, 100);
    
    // Set minimum date for reservations to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;

    // Smooth scrolling for navigation links - throttled
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Optimized intersection observer (only for menu items now)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Apply initial styles and observe elements (only menu items)
    document.querySelectorAll('.menu-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Initialize testimonials carousel
function initTestimonialsCarousel() {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (!testimonialsGrid) return;
    
    totalTestimonials = document.querySelectorAll('.testimonial').length;
    if (totalTestimonials === 0) return;
    
    // Create dots navigation
    const dotsContainer = document.getElementById('carousel-dots');
    const visibleTestimonials = getVisibleTestimonials();
    const totalDots = Math.ceil(totalTestimonials / visibleTestimonials);
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(i));
        dotsContainer.appendChild(dot);
    }
    
    // Start auto-slide
    startAutoSlide();
}

// Get number of visible testimonials based on screen size
function getVisibleTestimonials() {
    if (window.innerWidth <= 768) return 1; // Show 1 on mobile
    if (window.innerWidth <= 1024) return 2; // Show 2 on tablet
    return 3; // Show 3 on desktop
}

// Move testimonials
function moveTestimonials(direction) {
    const visibleTestimonials = getVisibleTestimonials();
    const maxSlides = totalTestimonials - visibleTestimonials;
    
    currentTestimonial += direction;
    
    if (currentTestimonial > maxSlides) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = maxSlides;
    }
    
    updateTestimonialsPosition();
    updateDots();
    
    // Reset auto-slide
    stopAutoSlide();
    startAutoSlide();
}

// Go to specific testimonial
function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialsPosition();
    updateDots();
    
    // Reset auto-slide
    stopAutoSlide();
    startAutoSlide();
}

// Update testimonials position
function updateTestimonialsPosition() {
    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (!testimonialsGrid) return;
    
    const visibleTestimonials = getVisibleTestimonials();
    
    // Calculate translation based on screen size
    let translateX;
    if (window.innerWidth <= 768) {
        // Mobile: 1 testimonial visible, each is 100% width
        translateX = -(currentTestimonial * 100);
    } else if (window.innerWidth <= 1024) {
        // Tablet: 2 testimonials visible, each is 50% width
        translateX = -(currentTestimonial * 50);
    } else {
        // Desktop: 3 testimonials visible, each is 33.333% width
        translateX = -(currentTestimonial * 33.333);
    }
    
    testimonialsGrid.style.transform = `translateX(${translateX}%)`;
}

// Update dots
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

// Auto-slide functionality
function startAutoSlide() {
    testimonialsInterval = setInterval(() => {
        moveTestimonials(1);
    }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
    if (testimonialsInterval) {
        clearInterval(testimonialsInterval);
    }
}

// Pause auto-slide on hover
document.querySelector('.testimonials')?.addEventListener('mouseenter', stopAutoSlide);
document.querySelector('.testimonials')?.addEventListener('mouseleave', startAutoSlide);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reset to first slide on resize
        currentTestimonial = 0;
        initTestimonialsCarousel();
        updateTestimonialsPosition();
    }, 250);
});

// Navigation toggle - optimized
function toggleNav() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Theme toggle - optimized
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

// Load saved theme
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Menu filtering - optimized with requestAnimationFrame
function filterMenu(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const filteredItems = category === 'all' ? menuData : menuData.filter(item => item.category === category);
    
    requestAnimationFrame(() => {
        renderMenu(filteredItems);
    });
}

// Render menu items - optimized
function renderMenu(items = menuData) {
    const menuGrid = document.getElementById('menu-grid');
    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">$${item.price}</span>
                    <div class="rating">${'⭐'.repeat(Math.floor(item.rating))} ${item.rating}</div>
                </div>
                <div class="quantity-controls" style="display: none;">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="quantity" id="qty-${item.id}">1</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        `;
        fragment.appendChild(menuItem);
    });
    
    menuGrid.innerHTML = '';
    menuGrid.appendChild(fragment);
}

// Add item to cart - optimized
function addToCart(itemId) {
    const item = menuData.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    updateCartDisplay();
    showNotification(`${item.name} added to cart!`);
}

// Change quantity
function changeQuantity(itemId, change) {
    const qtySpan = document.getElementById(`qty-${itemId}`);
    let quantity = parseInt(qtySpan.textContent) + change;
    if (quantity < 1) quantity = 1;
    qtySpan.textContent = quantity;
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

// Update cart quantity
function updateCartQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
    }
}

// Update cart display - optimized
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = cartTotal.toFixed(2);
    
    const fragment = document.createDocumentFragment();
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
                <button onclick="removeFromCart(${item.id})" style="color: var(--accent-color); background: none; border: none; cursor: pointer; margin-top: 0.5rem;">Remove</button>
            </div>
        `;
        fragment.appendChild(cartItem);
    });
    
    cartItems.innerHTML = '';
    cartItems.appendChild(fragment);
}

// Toggle cart
function toggleCart() {
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartSidebar = document.querySelector('.cart-sidebar');
    cartOverlay.classList.toggle('active');
    cartSidebar.classList.toggle('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert(`Thank you for your order! Total: $${cartTotal.toFixed(2)}\n\nYour order will be ready in 20-30 minutes.`);
    cart = [];
    updateCartDisplay();
    toggleCart();
}

// Submit reservation
function submitReservation(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reservation = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        message: formData.get('message')
    };
    
    // Simulate API call
    setTimeout(() => {
        alert(`Thank you ${reservation.name}! Your reservation for ${reservation.guests} guests on ${reservation.date} at ${reservation.time} has been confirmed. We'll send a confirmation email to ${reservation.email}.`);
        event.target.reset();
    }, 1000);
}

// Show notification - optimized
let notificationTimeout;
function showNotification(message) {
    // Clear existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Optimized navbar scroll effect with throttling
let ticking = false;
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const isDark = document.body.classList.contains('dark-mode');
    
    if (window.scrollY > 100) {
        navbar.style.background = isDark ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});
