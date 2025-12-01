// IC3 Theme JavaScript
// Version: 1.0.0

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Cart Toggle
  const cartToggle = document.querySelector('.cart-toggle');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-overlay');
  
  if (cartToggle && cartDrawer) {
    cartToggle.addEventListener('click', function(e) {
      e.preventDefault();
      cartDrawer.classList.add('active');
      document.body.classList.add('cart-open');
    });
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', function() {
      cartDrawer.classList.remove('active');
      document.body.classList.remove('cart-open');
    });
  }
  
  // Search Toggle
  const searchToggle = document.querySelector('.search-toggle');
  const searchForm = document.querySelector('.search-form');
  
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      searchForm.classList.toggle('active');
      if (searchForm.classList.contains('active')) {
        searchForm.querySelector('input[type="search"]').focus();
      }
    });
  }
  
  // Product Quantity Selector
  const quantityButtons = document.querySelectorAll('.quantity-button');
  
  quantityButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.parentNode.querySelector('.quantity-input');
      const currentValue = parseInt(input.value);
      
      if (this.classList.contains('minus') && currentValue > 1) {
        input.value = currentValue - 1;
      } else if (this.classList.contains('plus')) {
        input.value = currentValue + 1;
      }
      
      // Trigger change event
      const event = new Event('change');
      input.dispatchEvent(event);
    });
  });
  
  // Product Gallery
  const productThumbnails = document.querySelectorAll('.product-thumbnail');
  const productMainImage = document.querySelector('.product-main-image');
  
  if (productThumbnails.length > 0 && productMainImage) {
    productThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function(e) {
        e.preventDefault();
        const newImageSrc = this.getAttribute('data-image');
        productMainImage.src = newImageSrc;
        
        // Update active thumbnail
        productThumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  // Accordion
  const accordionToggles = document.querySelectorAll('.accordion-toggle');
  
  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = this.classList.contains('active');
      
      // Close all other accordions
      if (!isOpen) {
        accordionToggles.forEach(item => {
          if (item !== this) {
            item.classList.remove('active');
            item.setAttribute('aria-expanded', 'false');
            item.nextElementSibling.style.maxHeight = null;
          }
        });
      }
      
      // Toggle current accordion
      this.classList.toggle('active');
      
      if (this.classList.contains('active')) {
        this.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        this.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });
  
  // Tabs
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      
      if (!tabContent) return;
      
      // Update active tab button
      const tabContainer = this.closest('.tabs');
      tabContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      
      // Show active tab content
      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      tabContent.classList.add('active');
    });
  });
  
  // Initialize first tab if exists
  const firstTabButton = document.querySelector('.tab-button');
  if (firstTabButton) firstTabButton.click();
  
  // Modal
  const modalTriggers = document.querySelectorAll('[data-modal]');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', function() {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        });
        
        // Close on close button click
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
          closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
          });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
          if (e.key === 'Escape') {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.removeEventListener('keydown', closeOnEscape);
          }
        });
      }
    });
  });
  
  // Lazy loading for images
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.remove('lazy');
    });
  } else {
    // Fallback for browsers that don't support loading="lazy"
    const lazyLoad = function() {
      const lazyImages = document.querySelectorAll('img.lazy');
      
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    };
    
    // Run lazy load on load and scroll
    window.addEventListener('load', lazyLoad);
    window.addEventListener('scroll', lazyLoad);
  }
  
  // Form validation
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      // For checkboxes and radio buttons
      if (input.type === 'checkbox' || input.type === 'radio') {
        const name = input.name;
        const group = form.querySelectorAll(`input[name="${name}"]`);
        
        group.forEach(item => {
          item.addEventListener('change', function() {
            validateField(this);
          });
        });
      }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });
  
  // Helper function to validate a single field
  function validateField(field) {
    const errorElement = field.nextElementSibling;
    let isValid = true;
    
    // Clear previous error
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
    }
    
    field.classList.remove('error');
    
    // Check required fields
    if (field.required) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        const name = field.name;
        const group = document.querySelectorAll(`input[name="${name}"]`);
        const isChecked = Array.from(group).some(input => input.checked);
        
        if (!isChecked) {
          showError(field, 'This field is required');
          isValid = false;
        }
      } else if (!field.value.trim()) {
        showError(field, 'This field is required');
        isValid = false;
      }
    }
    
    // Check email format
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        showError(field, 'Please enter a valid email address');
        isValid = false;
      }
    }
    
    // Check password match
    if (field.dataset.match) {
      const matchField = document.querySelector(field.dataset.match);
      if (matchField && field.value !== matchField.value) {
        showError(field, 'Passwords do not match');
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  // Helper function to show error message
  function showError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    field.insertAdjacentElement('afterend', errorElement);
  }
  
  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Initialize tooltips
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  tooltipTriggers.forEach(trigger => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = trigger.getAttribute('data-tooltip');
    
    trigger.appendChild(tooltip);
    
    trigger.addEventListener('mouseenter', function() {
      tooltip.classList.add('show');
    });
    
    trigger.addEventListener('mouseleave', function() {
      tooltip.classList.remove('show');
    });
  });
  
  // Initialize dropdowns
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close other dropdowns
      dropdownToggles.forEach(item => {
        if (item !== this) {
          item.nextElementSibling.classList.remove('show');
          item.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current dropdown
      const dropdown = this.nextElementSibling;
      const isOpen = dropdown.classList.toggle('show');
      
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      
      // Close on click outside
      if (isOpen) {
        document.addEventListener('click', function closeDropdown(e) {
          if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', closeDropdown);
          }
        });
      }
    });
  });
  
  // Initialize sliders
  const sliders = document.querySelectorAll('.slider');
  
  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.slide');
    const prevButton = slider.querySelector('.slider-prev');
    const nextButton = slider.querySelector('.slider-next');
    const dotsContainer = slider.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;
    const slideIntervalTime = 5000; // 5 seconds
    
    // Create dots if they don't exist
    if (dotsContainer && slides.length > 1) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.setAttribute('data-slide', index);
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        
        if (index === 0) {
          dot.classList.add('active');
        }
        
        dot.addEventListener('click', function() {
          goToSlide(parseInt(this.getAttribute('data-slide')));
          resetInterval();
        });
        
        dotsContainer.appendChild(dot);
      });
    }
    
    // Go to specific slide
    function goToSlide(n) {
      slides[currentSlide].classList.remove('active');
      updateDots(currentSlide, false);
      
      currentSlide = (n + slides.length) % slides.length;
      
      slides[currentSlide].classList.add('active');
      updateDots(currentSlide, true);
    }
    
    // Update dot indicators
    function updateDots(index, active) {
      const dots = slider.querySelectorAll('.slider-dot');
      if (dots.length) {
        if (active) {
          dots[index].classList.add('active');
        } else {
          dots[index].classList.remove('active');
        }
      }
    }
    
    // Next slide
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    // Previous slide
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    // Auto slide
    function startInterval() {
      slideInterval = setInterval(nextSlide, slideIntervalTime);
    }
    
    // Reset interval
    function resetInterval() {
      clearInterval(slideInterval);
      startInterval();
    }
    
    // Event listeners for navigation
    if (nextButton) {
      nextButton.addEventListener('click', function() {
        nextSlide();
        resetInterval();
      });
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', function() {
        prevSlide();
        resetInterval();
      });
    }
    
    // Keyboard navigation
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetInterval();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetInterval();
      }
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', function() {
      clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', function() {
      resetInterval();
    });
    
    // Start auto slide if more than one slide
    if (slides.length > 1) {
      startInterval();
    }
  });
  
  // Initialize AJAX add to cart
  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
  
  addToCartForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const addToCartButton = this.querySelector('[type="submit"]');
      const originalButtonText = addToCartButton ? addToCartButton.innerHTML : '';
      
      // Disable button and show loading state
      if (addToCartButton) {
        addToCartButton.disabled = true;
        addToCartButton.innerHTML = 'Adding...';
      }
      
      // Send AJAX request
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // Update cart count
        updateCartCount();
        
        // Show success message
        showNotification('Product added to cart', 'success');
        
        // Open cart drawer if it exists
        const cartDrawer = document.querySelector('.cart-drawer');
        if (cartDrawer) {
          cartDrawer.classList.add('active');
          document.body.classList.add('cart-open');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showNotification('Error adding product to cart', 'error');
      })
      .finally(() => {
        // Re-enable button
        if (addToCartButton) {
          addToCartButton.disabled = false;
          addToCartButton.innerHTML = originalButtonText;
        }
      });
    });
  });
  
  // Update cart count
  function updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
          element.textContent = cart.item_count;
          element.classList.toggle('empty', cart.item_count === 0);
        });
      })
      .catch(error => console.error('Error updating cart count:', error));
  }
  
  // Show notification
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Hide after delay
    setTimeout(() => {
      notification.classList.remove('show');
      
      // Remove from DOM after animation
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
  
  // Initialize product variants
  const productForms = document.querySelectorAll('form[data-product-form]');
  
  productForms.forEach(form => {
    const productJson = document.getElementById('ProductJson');
    if (!productJson) return;
    
    const product = JSON.parse(productJson.textContent);
    const variantSelects = form.querySelectorAll('select[data-option-index]');
    const addToCartButton = form.querySelector('[type="submit"]');
    const priceElement = document.getElementById('ProductPrice');
    const comparePriceElement = document.getElementById('ComparePrice');
    const variantImage = document.querySelector('[data-product-image]');
    const variantIdInput = form.querySelector('input[name="id"]');
    
    // Initialize options
    const options = [];
    variantSelects.forEach(select => {
      options[select.dataset.optionIndex] = select.value;
      
      select.addEventListener('change', function() {
        options[this.dataset.optionIndex] = this.value;
        updateVariant();
      });
    });
    
    // Update variant based on selected options
    function updateVariant() {
      const selectedVariant = product.variants.find(variant => {
        return variant.options.every((option, index) => {
          return options[index] === option;
        });
      });
      
      if (!selectedVariant) return;
      
      // Update variant ID
      if (variantIdInput) {
        variantIdInput.value = selectedVariant.id;
      }
      
      // Update price
      if (priceElement) {
        priceElement.textContent = formatMoney(selectedVariant.price);
      }
      
      // Update compare price
      if (comparePriceElement) {
        if (selectedVariant.compare_at_price > selectedVariant.price) {
          comparePriceElement.textContent = formatMoney(selectedVariant.compare_at_price);
          comparePriceElement.style.display = 'inline';
        } else {
          comparePriceElement.style.display = 'none';
        }
      }
      
      // Update image
      if (variantImage && selectedVariant.featured_image) {
        variantImage.src = selectedVariant.featured_image.src;
        variantImage.alt = selectedVariant.title;
      }
      
      // Update add to cart button
      if (addToCartButton) {
        addToCartButton.disabled = !selectedVariant.available;
        
        if (!selectedVariant.available) {
          addToCartButton.textContent = 'Sold Out';
        } else {
          addToCartButton.textContent = 'Add to Cart';
        }
      }
    }
    
    // Format money
    function formatMoney(cents, format) {
      if (typeof cents === 'string') {
        cents = cents.replace('.', '');
      }
      
      const value = '';
      const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      const formatString = format || '{{amount}}';
      
      function formatWithDelimiters(number, precision, thousands, decimal) {
        thousands = thousands || ',';
        decimal = decimal || '.';
        
        if (isNaN(number) || number === null) {
          return 0;
        }
        
        number = (number / 100.0).toFixed(precision);
        
        const parts = number.split('.');
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
        
        return dollars + (parts[1] ? decimal + parts[1] : '');
      }
      
      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          return formatWithDelimiters(cents, 2);
        case 'amount_no_decimals':
          return formatWithDelimiters(cents, 0);
        case 'amount_with_comma_separator':
          return formatWithDelimiters(cents, 2, '.', ',');
        case 'amount_no_decimals_with_comma_separator':
          return formatWithDelimiters(cents, 0, '.', ',');
      }
      
      return formatWithDelimiters(cents, 2);
    }
    
    // Initialize
    updateVariant();
  });
  
  // Initialize cart page functionality
  const updateCartButtons = document.querySelectorAll('.update-cart');
  
  updateCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const line = this.dataset.line;
      const quantityInput = document.querySelector(`.cart-quantity[data-line="${line}"]`);
      const quantity = parseInt(quantityInput.value);
      
      if (isNaN(quantity) || quantity < 0) {
        showNotification('Please enter a valid quantity', 'error');
        return;
      }
      
      updateCartItem(line, quantity);
    });
  });
  
  // Update cart item quantity
  function updateCartItem(line, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line: line,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(cart => {
      // Update cart count
      updateCartCount();
      
      // Update cart page
      if (window.location.pathname === '/cart') {
        window.location.reload();
      }
    })
    .catch(error => {
      console.error('Error updating cart:', error);
      showNotification('Error updating cart', 'error');
    });
  }
  
  // Initialize cart page quantity selectors
  const quantitySelectors = document.querySelectorAll('.quantity-selector');
  
  quantitySelectors.forEach(selector => {
    const input = selector.querySelector('input');
    const minusButton = selector.querySelector('.quantity-minus');
    const plusButton = selector.querySelector('.quantity-plus');
    
    if (minusButton) {
      minusButton.addEventListener('click', function() {
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
          input.value = currentValue - 1;
          input.dispatchEvent(new Event('change'));
        }
      });
    }
    
    if (plusButton) {
      plusButton.addEventListener('click', function() {
        const currentValue = parseInt(input.value);
        input.value = currentValue + 1;
        input.dispatchEvent(new Event('change'));
      });
    }
    
    input.addEventListener('change', function() {
      const line = this.dataset.line;
      const quantity = parseInt(this.value);
      
      if (isNaN(quantity) || quantity < 1) {
        this.value = 1;
        return;
      }
      
      updateCartItem(line, quantity);
    });
  });
  
  // Initialize cart page remove buttons
  const removeButtons = document.querySelectorAll('.remove-item');
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const line = this.dataset.line;
      updateCartItem(line, 0);
    });
  });
  
  // Initialize newsletter form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Disable form
      const submitButton = this.querySelector('[type="submit"]');
      const originalButtonText = submitButton ? submitButton.innerHTML : '';
      
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = 'Subscribing...';
      }
      
      // In a real implementation, you would send this to your email service
      // For now, we'll just show a success message
      setTimeout(() => {
        showNotification('Thanks for subscribing!', 'success');
        
        // Reset form
        this.reset();
        
        // Re-enable button
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }, 1000);
    });
  });
  
  // Initialize image zoom
  const zoomImages = document.querySelectorAll('[data-zoom]');
  
  zoomImages.forEach(image => {
    image.addEventListener('mousemove', function(e) {
      const { left, top, width, height } = this.getBoundingClientRect();
      const x = (e.clientX - left) / width * 100;
      const y = (e.clientY - top) / height * 100;
      
      this.style.transformOrigin = `${x}% ${y}%`;
      this.style.transform = 'scale(2)';
    });
    
    image.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Initialize scroll animations
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animated');
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
  
  // Initialize back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });
    
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Initialize responsive tables
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
  
  // Initialize responsive videos
  const videos = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]');
  
  videos.forEach(video => {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    video.parentNode.insertBefore(wrapper, video);
    wrapper.appendChild(video);
  });
  
  // Initialize tooltips
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.getAttribute('data-tooltip');
    
    element.appendChild(tooltip);
    
    element.addEventListener('mouseenter', function() {
      tooltip.classList.add('show');
    });
    
    element.addEventListener('mouseleave', function() {
      tooltip.classList.remove('show');
    });
  });
  
  // Initialize responsive navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        mobileNavToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }
  
  // Initialize dropdowns
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dropdown = this.nextElementSibling;
      const isOpen = dropdown.classList.contains('show');
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu !== dropdown) {
          menu.classList.remove('show');
        }
      });
      
      // Toggle current dropdown
      dropdown.classList.toggle('show');
      
      // Close on click outside
      if (!isOpen) {
        const clickHandler = function(e) {
          if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', clickHandler);
          }
        };
        
        document.addEventListener('click', clickHandler);
      }
    });
  });
  
  // Initialize accordions
  const accordionToggles = document.querySelectorAll('.accordion-toggle');
  
  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = this.classList.contains('active');
      
      // Close all other accordions if accordion group
      if (this.closest('.accordion-group')) {
        const group = this.closest('.accordion-group');
        group.querySelectorAll('.accordion-toggle').forEach(item => {
          if (item !== this) {
            item.classList.remove('active');
            item.setAttribute('aria-expanded', 'false');
            item.nextElementSibling.style.maxHeight = null;
          }
        });
      }
      
      // Toggle current accordion
      this.classList.toggle('active');
      
      if (this.classList.contains('active')) {
        this.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        this.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      }
    });
  });
  
  // Initialize tabs
  const tabButtons = document.querySelectorAll('[data-tab]');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      const tabContainer = this.closest('.tabs');
      
      if (!tabContent || !tabContainer) return;
      
      // Update active tab button
      tabContainer.querySelectorAll('[data-tab]').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      
      // Show active tab content
      tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      tabContent.classList.add('active');
    });
  });
  
  // Initialize modals
  const modalButtons = document.querySelectorAll('[data-modal]');
  
  modalButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (!modal) return;
      
      // Show modal
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      
      // Close on overlay click
      const overlay = modal.querySelector('.modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', function() {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        });
      }
      
      // Close on close button click
      const closeButton = modal.querySelector('.modal-close');
      if (closeButton) {
        closeButton.addEventListener('click', function() {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
        });
      }
      
      // Close on Escape key
      const closeOnEscape = function(e) {
        if (e.key === 'Escape') {
          modal.classList.remove('active');
          document.body.classList.remove('modal-open');
          document.removeEventListener('keydown', closeOnEscape);
        }
      };
      
      document.addEventListener('keydown', closeOnEscape);
    });
  });
  
  // Initialize tooltips
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  tooltipTriggers.forEach(trigger => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = trigger.getAttribute('data-tooltip');
    
    trigger.appendChild(tooltip);
    
    trigger.addEventListener('mouseenter', function() {
      tooltip.classList.add('show');
    });
    
    trigger.addEventListener('mouseleave', function() {
      tooltip.classList.remove('show');
    });
  });
  
  // Initialize responsive tables
  const responsiveTables = document.querySelectorAll('table');
  
  responsiveTables.forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
  
  // Initialize responsive videos
  const responsiveVideos = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]');
  
  responsiveVideos.forEach(video => {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    video.parentNode.insertBefore(wrapper, video);
    wrapper.appendChild(video);
  });
  
  // Initialize image zoom
  const zoomableImages = document.querySelectorAll('[data-zoom]');
  
  zoomableImages.forEach(image => {
    image.addEventListener('mousemove', function(e) {
      const { left, top, width, height } = this.getBoundingClientRect();
      const x = (e.clientX - left) / width * 100;
      const y = (e.clientY - top) / height * 100;
      
      this.style.transformOrigin = `${x}% ${y}%`;
      this.style.transform = 'scale(2)';
    });
    
    image.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Initialize scroll animations
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const animateOnScroll = function() {
    animateElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate');
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
});

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
  initializeTheme();
}
