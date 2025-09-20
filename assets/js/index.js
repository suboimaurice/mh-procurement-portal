/**
 * =================================================
 * MH Procurement Website - Main JavaScript File
 * Municipal Hospital Outpatient Services Department
 * ==================================================
 */

// Global application object for namespace management
const MHProcurement = {
    // Configuration object
    config: {
        hospitalName: 'Municipal Hospital',
        departmentName: 'Outpatient Services Department',
        contactEmail: 'procurement@municipalhospital.org',
        contactPhone: '+1 (555) 123-4567',
        version: '1.0.0'
    },

    // Utility funcs,Navigation,Form ,Shopping cart,PDF generation
    utils: {}, navigation: {}, forms: {}, cart: {}, pdf: {}
};


/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed JSON or default value
 */
MHProcurement.utils.safeParseJSON = function(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.warn('JSON parsing failed:', error);
        return defaultValue;
    }
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
MHProcurement.utils.sanitizeInput = function(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
MHProcurement.utils.formatCurrency = function(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
MHProcurement.utils.validateEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info, warning)
 */
MHProcurement.utils.showToast = function(message, type = 'info') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast fixed top-4 right-4 px-4 py-3 rounded-xl text-white z-50 fade-in`;
    
    // Set toast styling based on type
    const typeStyles = {
        success: 'bg-orange-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    toast.classList.add(typeStyles[type] || typeStyles.info);
    toast.textContent = message;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
};


 //# =============================#
 //# NAVIGATION FUNCTIONALITY     #
 //# =============================#


// Initialize mobile navigation menu
MHProcurement.navigation.initMobileMenu = function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
};

// Highlight active navigation link based on current URL
MHProcurement.navigation.highlightActiveLink = function() {
    const currentPath = window.location.pathname;

    // Get all navigation links including dropdown links
    const allNavLinks = document.querySelectorAll('a[href]');

    allNavLinks.forEach(link => {
        let linkPath;
        try {
            linkPath = new URL(link.href, window.location.origin).pathname;
        } catch (e) {
            return; // Skip invalid URLs
        }

        if (linkPath === currentPath) {
            // Add active class to nav-link elements
            if (link.classList.contains('nav-link')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }

            // Handle dropdown links (desktop)
            if (link.classList.contains('block') && link.closest('.group')) {
                link.classList.remove('text-gray-700', 'hover:bg-blue-50', 'hover:text-blue-700');
                link.classList.add('text-blue-700', 'bg-blue-50', 'font-semibold');
            }

            // Handle mobile menu links
            if (link.classList.contains('block') && link.closest('#mobile-menu')) {
                link.classList.remove('text-gray-300');
                link.classList.add('text-yellow-300', 'font-semibold');
            }
        }
    });
};


//# ===============================#
//# SHOPPING CART FUNCTIONALITY    #
//# ===============================#



// Initialize shopping cart
MHProcurement.cart.init = function() {
    this.items = this.loadFromStorage();
    this.updateCartDisplay();
    this.bindEvents();
};

/**
 * Add item to cart
 * @param {Object} item - Item to add to cart
 */
MHProcurement.cart.addItem = function(item) {
    // Sanitize item data
    const sanitizedItem = {
        id: MHProcurement.utils.sanitizeInput(item.id),
        name: MHProcurement.utils.sanitizeInput(item.name),
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        category: MHProcurement.utils.sanitizeInput(item.category),
        description: MHProcurement.utils.sanitizeInput(item.description)
    };
    
    // Check if item already exists in cart
    const existingItemIndex = this.items.findIndex(cartItem => cartItem.id === sanitizedItem.id);
    
    if (existingItemIndex !== -1) {
        // Update existing item quantity
        this.items[existingItemIndex].quantity += sanitizedItem.quantity;
    } else {
        // Add new item
        this.items.push(sanitizedItem);
    }
    
    this.saveToStorage();
    this.updateCartDisplay();
    
    MHProcurement.utils.showToast(
        `${sanitizedItem.name} added to order list`,
        'success'
    );
};

/**
 * Remove item from cart
 * @param {string} itemId - ID of item to remove
 */
MHProcurement.cart.removeItem = function(itemId) {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const removedItem = this.items[itemIndex];
        this.items.splice(itemIndex, 1);
        this.saveToStorage();
        this.updateCartDisplay();
        
        MHProcurement.utils.showToast(
            `${removedItem.name} removed from order list`,
            'info'
        );
    }
};

/**
 * Update item quantity in cart
 * @param {string} itemId - ID of item to update
 * @param {number} quantity - New quantity
 */
MHProcurement.cart.updateQuantity = function(itemId, quantity) {
    const item = this.items.find(item => item.id === itemId);
    
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity) || 1);
        this.saveToStorage();
        this.updateCartDisplay();
    }
};


 // Clear all items from cart
MHProcurement.cart.clearAll = function() {
    this.items = [];
    this.saveToStorage();
    this.updateCartDisplay();
    
    MHProcurement.utils.showToast('Order list cleared', 'info');
};

/**
 * Get cart total
 * @returns {number} Total cart value
 */
MHProcurement.cart.getTotal = function() {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};


 // Save cart to localStorage
MHProcurement.cart.saveToStorage = function() {
    try {
        localStorage.setItem('mh_procurement_cart', JSON.stringify(this.items));
    } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
    }
};

/**
 * Load cart from localStorage
 * @returns {Array} Cart items
 */
MHProcurement.cart.loadFromStorage = function() {
    try {
        const stored = localStorage.getItem('mh_procurement_cart');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        return [];
    }
};


 // Update cart display in UI
MHProcurement.cart.updateCartDisplay = function() {
   const cartCount = document.getElementById('cart-count');
   const cartCountMobile = document.getElementById('cart-count-mobile');
   const cartItems = document.getElementById('cart-items');
   const cartTotal = document.getElementById('cart-total');

   // Update cart count
   const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
   if (cartCount) {
       cartCount.textContent = totalItems;
       cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
   }
   if (cartCountMobile) {
       cartCountMobile.textContent = totalItems;
       cartCountMobile.style.display = totalItems > 0 ? 'inline' : 'none';
   }
    
    // Update cart items display
    if (cartItems) {
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500">No items in order list</p>';
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="flex justify-between items-center p-3 border-b">
                    <div>
                        <h4 class="font-semibold">${item.name}</h4>
                        <p class="text-sm text-gray-600">Qty: ${item.quantity}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold">${MHProcurement.utils.formatCurrency(item.price * item.quantity)}</p>
                        <button onclick="MHProcurement.cart.removeItem('${item.id}')" 
                                class="text-red-500 text-sm hover:text-red-700">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update cart total
    if (cartTotal) {
        cartTotal.textContent = MHProcurement.utils.formatCurrency(this.getTotal());
    }
};


 // Bind cart-related events
MHProcurement.cart.bindEvents = function() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            
            const button = e.target;
            const productCard = button.closest('.product-card');
            
            if (productCard) {
                const item = {
                    id: productCard.dataset.id,
                    name: productCard.dataset.name,
                    price: productCard.dataset.price,
                    quantity: parseInt(productCard.querySelector('.quantity-input')?.value) || 1,
                    category: productCard.dataset.category,
                    description: productCard.dataset.description
                };
                
                MHProcurement.cart.addItem(item);
            }
        }
    });
};


 //# ==========================#
 //# FORM HANDLING             #
 //# ==========================#



 // Initialize form handling
MHProcurement.forms.init = function() {
    this.bindContactForm();
    this.bindSearchForm();
};


 // Handle contact form submission
MHProcurement.forms.bindContactForm = function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = MHProcurement.utils.sanitizeInput(formData.get('name'));
            const email = formData.get('email');
            const message = MHProcurement.utils.sanitizeInput(formData.get('message'));
            
            // Validate form data
            if (!name || !email || !message) {
                MHProcurement.utils.showToast('Please fill in all required fields', 'error');
                return;
            }
            
            if (!MHProcurement.utils.validateEmail(email)) {
                MHProcurement.utils.showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (in real implementation, this would send to server)
            MHProcurement.utils.showToast('Thank you! Your message has been sent.', 'success');
            contactForm.reset();
        });
    }
};

/**
 * Handle search form
 */
MHProcurement.forms.bindSearchForm = function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = MHProcurement.utils.sanitizeInput(searchInput.value.trim());
            
            if (query) {
                MHProcurement.search.performSearch(query);
            }
        });
    }
};

/**
 * =================================================================
 * SEARCH FUNCTIONALITY
 * =================================================================
 */
MHProcurement.search = {
    /**
     * Perform search across product catalog
     * @param {string} query - Search query
     */
    performSearch: function(query) {
        const products = document.querySelectorAll('.product-card');
        const searchResults = document.getElementById('search-results');
        let matchCount = 0;
        
        products.forEach(product => {
            const name = product.dataset.name?.toLowerCase() || '';
            const description = product.dataset.description?.toLowerCase() || '';
            const category = product.dataset.category?.toLowerCase() || '';
            const queryLower = query.toLowerCase();
            
            const matches = name.includes(queryLower) || 
                          description.includes(queryLower) || 
                          category.includes(queryLower);
            
            if (matches) {
                product.style.display = 'block';
                matchCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        // Update search results count
        if (searchResults) {
            searchResults.textContent = `Found ${matchCount} items matching "${query}"`;
        }
        
        if (matchCount === 0) {
            MHProcurement.utils.showToast(`No products found for "${query}"`, 'warning');
        }
    }
};


  //================================
  //PDF GENERATION                 //
  //================================

MHProcurement.pdf.preloadImage = function(url) {
     return new Promise((resolve, reject) => {
         const img = new Image();
         img.crossOrigin = 'Anonymous'; // Handle CORS if needed
         img.onload = () => {
             try {
                 const canvas = document.createElement('canvas');
                 canvas.width = img.width;
                 canvas.height = img.height;
                 const ctx = canvas.getContext('2d');
                 ctx.drawImage(img, 0, 0);
                 resolve(canvas.toDataURL('image/png'));
             } catch (error) {
                 reject(new Error('Failed to process image: ' + error.message));
             }
         };
         img.onerror = (e) => {
             console.warn('Image failed to load:', url, e);
             reject(new Error('Failed to load image from: ' + url));
         };
         img.src = url;
     });
 };
    // Generate order form PDF
MHProcurement.pdf.generateOrderForm = async function() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        MHProcurement.utils.showToast('PDF generation not available', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Municipal Hospital - Procurement Order Form', 20, 30);
    
    doc.setFontSize(12);
    doc.text('Outpatient Services Department', 20, 45);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
    
    // Order Items
    let yPosition = 80;
    doc.setFontSize(14);
    doc.text('Order Items:', 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(10);
    
    if (MHProcurement.cart.items.length === 0) {
        doc.text('No items in order list', 20, yPosition);
    } else {
        // Table header
        doc.text('Item', 20, yPosition);
        doc.text('Qty', 120, yPosition);
        doc.text('Unit Price', 140, yPosition);
        doc.text('Total', 170, yPosition);
        yPosition += 10;
        
        // Draw line
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
        
        // Order items
        MHProcurement.cart.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            
            doc.text(item.name.substring(0, 40), 20, yPosition);
            doc.text(item.quantity.toString(), 120, yPosition);
            doc.text(`$${item.price.toFixed(2)}`, 140, yPosition);
            doc.text(`$${itemTotal.toFixed(2)}`, 170, yPosition);
            yPosition += 10;
        });
        
        // Total
        yPosition += 10;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 15;
        doc.setFontSize(12);
        doc.text(`Total: ${MHProcurement.utils.formatCurrency(MHProcurement.cart.getTotal())}`, 140, yPosition);
    }
    
    // Footer
    yPosition += 40;
    doc.setFontSize(10);
    doc.text('Contact Information:', 20, yPosition);
    yPosition += 15;
    doc.text(`Email: ${MHProcurement.config.contactEmail}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Phone: ${MHProcurement.config.contactPhone}`, 20, yPosition);
    
   // Add logo to the right side of the footer
    try {
        const logoPath = 'https://suboimaurice.github.io/mh-procurement-portal/assets/images/logo.png';
        const logoDataUrl = await MHProcurement.pdf.preloadImage(logoPath);
        const logoWidth = 20;
        const logoHeight = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoX = pageWidth - logoWidth - 20;
        doc.addImage(logoDataUrl, 'PNG', logoX, yPosition - 15, logoWidth, logoHeight);
        console.log('Logo successfully added to PDF');
    } catch (error) {
        console.warn('Failed to add logo to PDF, continuing without logo:', error.message);
        // Don't show error toast for logo failure - PDF will still be generated
        // MHProcurement.utils.showToast('Logo not available, PDF generated without logo', 'warning');
    }

    // Save PDF
    doc.save('MH_Procurement_Order_Form.pdf');
    
    MHProcurement.utils.showToast('Order form PDF generated successfully', 'success');
};

/**
 * ==========================
 * INITIALIZATION           //
 * ==========================
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    MHProcurement.cart.init();
    MHProcurement.forms.init();

    // Initialize mobile menu if header is already loaded
    // (This handles cases where header might be loaded synchronously)
    MHProcurement.navigation.initMobileMenu();

    // Add fade-in animation
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }

    // Close modal when clicking outside
    const orderListModal = document.getElementById('order-list-modal');
    if (orderListModal) {
        orderListModal.addEventListener('click', function (e) {
            if (e.target === this) {
                toggleOrderList();
            }
        });
    }

    console.log(`MH Procurement Website v${MHProcurement.config.version} initialized successfully`);
});

// Global function for order list modal
function toggleOrderList() {
    const modal = document.getElementById('order-list-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

// Ensure global access for inline scripts
window.MHProcurement = MHProcurement;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MHProcurement;
}
