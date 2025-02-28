document.addEventListener('DOMContentLoaded', function() {
    // Console log to check if script is running
    console.log("Script started loading");
    
    // Simplify performance timing to avoid potential errors
    try {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page load time: ${pageLoadTime/1000} seconds`);
    } catch(e) {
        console.log("Error tracking performance:", e);
    }
    
    // Define theme toggle functions
    // Add theme toggle button
    const createThemeToggle = () => {
        if (!document.querySelector('.theme-toggle')) {
            console.log("Creating theme toggle");
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            document.body.appendChild(themeToggle);
            
            // Add click event listener
            themeToggle.addEventListener('click', toggleTheme);
            
            // Make it visible immediately
            themeToggle.style.display = 'flex';
        }
    };

    // Toggle between dark and light theme
    function toggleTheme() {
        const body = document.body;
        const themeToggle = document.querySelector('.theme-toggle i');
        
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            themeToggle.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    }

    // Check for saved theme preference
    const loadThemePreference = () => {
        const savedTheme = localStorage.getItem('theme');
        const themeToggle = document.querySelector('.theme-toggle i');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.className = 'fas fa-sun';
            }
        }
    };
    
    // Create theme toggle only once
    createThemeToggle();
    loadThemePreference();
    
    // Initialize skeleton screens if needed
    const hideSkeletons = () => {
        const skeletonElements = document.querySelectorAll('.skeleton-target');
        skeletonElements.forEach(el => {
            el.classList.remove('skeleton');
            el.setAttribute('aria-busy', 'false');
        });
    };

    // Hide skeletons after a short delay
    setTimeout(hideSkeletons, 300);

    // Elements
    const header = document.querySelector('header');
    const form = document.getElementById('interest-form');
    
    // Scroll Progress Indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    });
    
    // Custom cursor for desktop
    const cursor = document.querySelector('.custom-cursor');
    const cursorAreas = document.querySelectorAll('.custom-cursor-area');
    
    if (cursor && !isMobileDevice()) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        cursorAreas.forEach(area => {
            area.addEventListener('mouseenter', () => {
                cursor.classList.add('custom-cursor-active');
            });
            
            area.addEventListener('mouseleave', () => {
                cursor.classList.remove('custom-cursor-active');
            });
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }
    
    // Detect if mobile device
    function isMobileDevice() {
        return (typeof window.orientation !== 'undefined') || 
               (navigator.userAgent.indexOf('IEMobile') !== -1) ||
               window.matchMedia("(max-width: 768px)").matches;
    }

    // Cookie consent banner
    const setupCookieConsent = () => {
        const cookieConsent = document.getElementById('cookieConsent');
        const acceptBtn = document.getElementById('acceptCookies');
        const settingsBtn = document.getElementById('cookieSettings');
        
        if (cookieConsent && !localStorage.getItem('cookiesAccepted')) {
            // Show after a slight delay for better UX
            setTimeout(() => {
                cookieConsent.classList.add('show');
            }, 2000);
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieConsent.classList.remove('show');
                });
            }
            
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    // Could open a modal with detailed cookie settings
                    console.log('Cookie settings clicked');
                    // For now, just accept
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieConsent.classList.remove('show');
                });
            }
        }
    };
    
    setupCookieConsent();
    
    // Smooth scroll handling - optimize by using requestAnimationFrame
    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Enhanced Form Validation and Feedback
    if (form) {
        const formFields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
        const formSuccess = document.getElementById('form-success');
        
        // Make sure success message is hidden initially
        if (formSuccess) {
            formSuccess.style.display = 'none';
        }
        
        // Initialize form fields on page load
        formFields.forEach(field => {
            // Special initialization for select fields
            if (field.tagName === 'SELECT') {
                // Check if the select has a selected value (not the first placeholder option)
                if (field.selectedIndex > 0) {
                    field.classList.add('field-has-value');
                    field.parentNode.classList.add('field-has-value');
                }
            } 
            // Regular initialization for other field types
            else if (field.value !== '') {
                field.parentNode.classList.add('field-has-value');
            }
            
            // Add a ripple effect to form fields
            field.addEventListener('mousedown', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'form-ripple';
                ripple.style.left = `${e.clientX - rect.left}px`;
                ripple.style.top = `${e.clientY - rect.top}px`;
                this.parentNode.appendChild(ripple);
                
                // Add active class to trigger animation
                setTimeout(() => {
                    ripple.classList.add('active');
                }, 10);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Focus effect
            field.addEventListener('focus', function() {
                this.parentNode.classList.add('field-focused');
                
                // Show placeholder on focus for non-select fields
                if (this.tagName !== 'SELECT') {
                    this.setAttribute('data-original-placeholder', this.placeholder || '');
                    if (!this.placeholder) {
                        this.placeholder = this.parentNode.querySelector('label').textContent;
                    }
                }
                
                // Clear any existing error state on focus
                this.parentNode.classList.remove('field-error');
                const errorMessage = this.parentNode.querySelector('.form-error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            });
            
            // Blur effect
            field.addEventListener('blur', function() {
                this.parentNode.classList.remove('field-focused');
                
                // If field has value, keep label in active position
                if (this.value !== '') {
                    this.parentNode.classList.add('field-has-value');
                } else {
                    this.parentNode.classList.remove('field-has-value');
                    
                    // Reset placeholder to empty on blur if no value
                    if (this.tagName !== 'SELECT') {
                        this.placeholder = '';
                    }
                }
                
                // Validate on blur for better UX
                validateField(this);
            });
            
            // Input effect for live validation feedback and animated label
            field.addEventListener('input', function() {
                if (this.value !== '') {
                    this.parentNode.classList.add('field-has-value');
                } else {
                    this.parentNode.classList.remove('field-has-value');
                }
                
                // Clear error state if field was previously in error
                const errorMessage = this.parentNode.querySelector('.form-error-message');
                if (errorMessage) {
                    validateField(this);
                }
            });
            
            // Special handling for select fields - improve this section
            if (field.tagName === 'SELECT') {
                // Check if select has a valid selection on page load
                if (field.selectedIndex > 0) {
                    field.parentNode.classList.add('field-has-value');
                }
                
                // Handle focus event for selects
                field.addEventListener('focus', function() {
                    this.parentNode.classList.add('field-focused');
                });
                
                // Handle change event for selects
                field.addEventListener('change', function() {
                    if (this.selectedIndex > 0) {
                        this.parentNode.classList.add('field-has-value');
                    } else {
                        this.parentNode.classList.remove('field-has-value');
                    }
                    validateField(this);
                });
            }
        });
        
        // Interactive form elements
        const addFormInteractivity = () => {
            // Add progress indicator to the form
            const formSteps = document.createElement('div');
            formSteps.className = 'form-progress';
            formSteps.innerHTML = `
                <div class="progress-step active" data-step="1">Personal</div>
                <div class="progress-step" data-step="2">Fitness</div>
                <div class="progress-step" data-step="3">Service</div>
            `;
            
            const personalFields = document.querySelectorAll('#name, #email, #phone');
            const fitnessFields = document.querySelectorAll('#goals, #experience');
            const serviceFields = document.querySelectorAll('#service, #message');
            
            // Group form fields visually (without changing structure)
            personalFields.forEach(field => {
                field.closest('.form-group').dataset.step = '1';
            });
            fitnessFields.forEach(field => {
                field.closest('.form-group').dataset.step = '2';
            });
            serviceFields.forEach(field => {
                field.closest('.form-group').dataset.step = '3';
            });
            
            // Insert progress before form
            form.insertBefore(formSteps, form.firstChild);
            
            // Add interactive form field highlighting
            formFields.forEach(field => {
                field.addEventListener('focus', function() {
                    const step = this.closest('.form-group').dataset.step;
                    highlightStep(step);
                });
            });
            
            function highlightStep(step) {
                const steps = document.querySelectorAll('.progress-step');
                steps.forEach(s => {
                    if (s.dataset.step === step) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            }
        };
        
        // Form submission handling
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear all previous errors
            formFields.forEach(field => {
                const errorMessage = field.parentNode.querySelector('.form-error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
                field.parentNode.classList.remove('field-error');
            });
            
            if (validateAllFields()) {
                // Show loading state
                form.classList.add('form-submitting');
                const submitButton = form.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<span class="spinner-border"></span>Submitting...';
                submitButton.disabled = true;
                
                // Get form data
                const formData = new FormData(form);
                
                // Submit the form to Formspree using fetch API
                fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    // Hide the form
                    form.style.display = 'none';
                    
                    // Show success message
                    const formSuccess = document.getElementById('form-success');
                    if (formSuccess) {
                        formSuccess.style.display = 'block';
                        formSuccess.classList.add('show');
                        formSuccess.style.animation = 'fadeIn 0.5s ease forwards';
                        
                        // Scroll to the success message
                        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Reset form for future use (though it's hidden now)
                    form.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Show error message
                    const submitButton = form.querySelector('button[type="submit"]');
                    submitButton.innerHTML = 'Submit';
                    submitButton.disabled = false;
                    form.classList.remove('form-submitting');
                    
                    // Add a general error message at the top of the form
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'form-submission-error';
                    errorDiv.textContent = 'Sorry, there was a problem submitting your form. Please try again.';
                    form.prepend(errorDiv);
                });
            } else {
                // Scroll to the first error
                const firstError = document.querySelector('.field-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        function validateAllFields() {
            let isValid = true;
            
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        function validateField(field) {
            const formGroup = field.parentNode;
            const fieldType = field.type;
            const fieldId = field.id;
            const fieldValue = field.value.trim();
            const isRequired = field.hasAttribute('required');
            let isValid = true;
            
            // Clear previous error
            const existingError = formGroup.querySelector('.form-error-message');
            if (existingError) {
                existingError.remove();
            }
            formGroup.classList.remove('field-error');
            
            // Skip validation if field is not required and is empty
            if (!isRequired && fieldValue === '') {
                return true;
            }
            
            // Required field validation
            if (isRequired && fieldValue === '') {
                const fieldLabel = formGroup.querySelector('label').textContent.replace('*', '').trim();
                displayError(field, `${fieldLabel} is required`);
                return false;
            }
            
            // Specific field validations
            switch (fieldType) {
                case 'email':
                    if (!isValidEmail(fieldValue)) {
                        displayError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                    break;
                    
                case 'tel':
                    if (fieldValue !== '' && !isValidPhone(fieldValue)) {
                        displayError(field, 'Please enter a valid phone number');
                        isValid = false;
                    }
                    break;
                    
                case 'select-one':
                    if (field.selectedIndex === 0) {
                        const fieldLabel = formGroup.querySelector('label').textContent.replace('*', '').trim();
                        displayError(field, `Please select a ${fieldLabel.toLowerCase()}`);
                        isValid = false;
                    }
                    break;
                    
                default:
                    // Text and textarea validation
                    if (fieldId === 'name' && fieldValue.length < 2) {
                        displayError(field, 'Name must be at least 2 characters');
                        isValid = false;
                    }
                    break;
            }
            
            return isValid;
        }
        
        function displayError(field, message) {
            const formGroup = field.parentNode;
            formGroup.classList.add('field-error');
            
            // Create error message element
            const errorElement = document.createElement('span');
            errorElement.classList.add('form-error-message');
            errorElement.textContent = message;
            
            // Add error message after the field
            formGroup.appendChild(errorElement);
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function isValidPhone(phone) {
            // Basic phone validation - customize based on requirements
            const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
            return phoneRegex.test(phone);
        }
    }
    
    // Smooth scrolling for navigation links - debounced for performance
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - headerHeight,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (document.querySelector('.mobile-nav.active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // OPTIMIZED Counter animation for metrics
    // Use more efficient animation approach with reduced calculations
    const counters = document.querySelectorAll('.metric-number');
    
    const countUp = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const duration = 2000; // ms
            const startTime = performance.now();
            const startValue = 0;
            
            // Use requestAnimationFrame for smoother animation
            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing function for smoother counting
                const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
                
                counter.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    };
    
    // Initialize intersection observer for counter animation
    const metricsSection = document.querySelector('.metrics');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 }); // Lower threshold for earlier triggering
        
        observer.observe(metricsSection);
    }
    
    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            question.classList.toggle('active');
        });
    });
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Parallax effect for hero section
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (parallaxElements.length > 0 && !isMobileDevice()) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    
                    parallaxElements.forEach(element => {
                        const speed = 0.3; // Adjust parallax speed
                        element.style.backgroundPosition = `center ${-scrollY * speed}px`;
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    // Text Reveal Animation
    const observeTextReveal = () => {
        const textElements = document.querySelectorAll('.reveal-text');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        textElements.forEach(element => {
            observer.observe(element);
        });
    };
    
    observeTextReveal();
    
    // OPTIMIZED: Animate elements on scroll
    // Use fewer observers and more efficient targeting
    const animateOnScroll = () => {
        // Group elements by animation type for better performance
        const elementGroups = {
            'animate-slide-up': document.querySelectorAll('.animate-slide-up'),
            'service-card': document.querySelectorAll('.service-card'),
            'testimonial-card': document.querySelectorAll('.testimonial-card')
        };
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px 100px 0px', // Preload animations before they come into view
            threshold: 0.1
        };
        
        // Create a single observer for better performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a small delay based on index for staggered animations
                    setTimeout(() => {
                        entry.target.classList.add('animate-fade-in');
                    }, entry.target.dataset.delay || 0);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Add all elements to the observer with staggered delays
        Object.values(elementGroups).forEach(elements => {
            elements.forEach((element, index) => {
                // Add small delay for staggered effect based on index
                element.dataset.delay = index * 100;
                observer.observe(element);
            });
        });
    };
    
    // Delay animation initialization slightly to prioritize initial page load
    setTimeout(animateOnScroll, 100);
    
    // Mobile Menu Toggle
    const createMobileMenu = () => {
        // Remove any existing mobile navigation elements first
        const existingMobileNav = document.querySelector('.mobile-nav');
        if (existingMobileNav) {
            existingMobileNav.parentNode.removeChild(existingMobileNav);
        }
        
        const existingToggle = document.querySelector('.mobile-menu-toggle');
        if (existingToggle) {
            existingToggle.parentNode.removeChild(existingToggle);
        }
        
        // Find and remove any duplicate navigation at the bottom of the page
        const bodyNavs = document.querySelectorAll('body > nav:not(header nav)');
        bodyNavs.forEach(nav => {
            if (nav !== document.querySelector('header nav')) {
                nav.parentNode.removeChild(nav);
            }
        });
        
        // Create mobile menu toggle button
        const mobileMenuToggle = document.createElement('div');
        mobileMenuToggle.className = 'mobile-menu-toggle';
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            mobileMenuToggle.appendChild(span);
        }
        
        // Create mobile navigation
        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-nav';
        mobileNav.setAttribute('aria-label', 'Mobile navigation');
        
        // Clone the desktop navigation links
        const headerNav = document.querySelector('header nav ul');
        if (headerNav) {
            const desktopNav = headerNav.cloneNode(true);
            mobileNav.appendChild(desktopNav);
            
            // Add toggle button to header
            const headerContainer = document.querySelector('header .container');
            if (headerContainer) {
                headerContainer.appendChild(mobileMenuToggle);
            }
            
            // Add mobile nav to body (as the first child to ensure proper z-index)
            document.body.insertBefore(mobileNav, document.body.firstChild);
            
            // Add event listener for toggle
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }
    };
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');
        
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Create image lightbox functionality
    const setupImageLightbox = () => {
        // Select all transformation images
        const transformationImages = document.querySelectorAll('.before-image img, .after-image img');
        
        transformationImages.forEach(img => {
            img.addEventListener('click', () => {
                // Create lightbox container
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.style.position = 'fixed';
                lightbox.style.top = '0';
                lightbox.style.left = '0';
                lightbox.style.width = '100%';
                lightbox.style.height = '100%';
                lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                lightbox.style.display = 'flex';
                lightbox.style.alignItems = 'center';
                lightbox.style.justifyContent = 'center';
                lightbox.style.zIndex = '9999';
                lightbox.style.opacity = '0';
                lightbox.style.transition = 'opacity 0.3s ease';
                
                // Create lightbox image
                const lightboxImage = document.createElement('img');
                lightboxImage.src = img.src;
                lightboxImage.style.maxWidth = '90%';
                lightboxImage.style.maxHeight = '90%';
                lightboxImage.style.objectFit = 'contain';
                lightboxImage.style.transform = 'scale(0.9)';
                lightboxImage.style.transition = 'transform 0.3s ease';
                lightbox.appendChild(lightboxImage);
                
                // Add close button
                const closeButton = document.createElement('span');
                closeButton.innerHTML = '&times;';
                closeButton.style.position = 'absolute';
                closeButton.style.top = '20px';
                closeButton.style.right = '30px';
                closeButton.style.color = 'white';
                closeButton.style.fontSize = '40px';
                closeButton.style.fontWeight = 'bold';
                closeButton.style.cursor = 'pointer';
                lightbox.appendChild(closeButton);
                
                // Add lightbox to body
                document.body.appendChild(lightbox);
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
                
                // Trigger reflow
                void lightbox.offsetWidth;
                
                // Show lightbox with animation
                lightbox.style.opacity = '1';
                lightboxImage.style.transform = 'scale(1)';
                
                // Close lightbox on click
                lightbox.addEventListener('click', () => {
                    lightbox.style.opacity = '0';
                    lightboxImage.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        document.body.removeChild(lightbox);
                        document.body.style.overflow = '';
                    }, 300);
                });
            });
        });
    };
    
    // Add Privacy Policy and Terms & Conditions Modals
    const setupLegalModals = () => {
        const privacyLink = document.getElementById('privacyPolicy');
        const termsLink = document.getElementById('termsConditions');
        
        if (privacyLink) {
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('Privacy Policy', `
                    <h3>Privacy Policy</h3>
                    <p>Last updated: ${new Date().toLocaleDateString()}</p>
                    <p>The Protein Princess ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by The Protein Princess.</p>
                    <h4>Information We Collect</h4>
                    <p>We collect information you provide directly to us when you fill out our contact form, including your name, email address, phone number, and any other information you choose to provide.</p>
                    <h4>How We Use Your Information</h4>
                    <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with applicable laws and regulations.</p>
                    <h4>Cookies</h4>
                    <p>We use cookies to enhance your experience on our website. You can set your browser to refuse all or some browser cookies, but this may prevent our website from functioning properly.</p>
                `);
            });
        }
        
        if (termsLink) {
            termsLink.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('Terms & Conditions', `
                    <h3>Terms & Conditions</h3>
                    <p>Last updated: ${new Date().toLocaleDateString()}</p>
                    <p>Please read these Terms and Conditions ("Terms") carefully before using the website operated by The Protein Princess.</p>
                    <h4>Use of Website</h4>
                    <p>The content of this website is for your general information and use only. It is subject to change without notice.</p>
                    <h4>Limitations of Liability</h4>
                    <p>The Protein Princess shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or use of the website.</p>
                    <h4>Fitness Disclaimer</h4>
                    <p>The information provided by The Protein Princess is for educational purposes only and is not intended as a substitute for medical advice. Always consult with a healthcare professional before starting any diet or exercise program.</p>
                `);
            });
        }
    };
    
    // Show modal with content
    function showModal(title, content) {
        console.log("showModal called with title:", title);
        try {
        // Create modal container
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.zIndex = '10000';
        modalOverlay.style.opacity = '0';
        modalOverlay.style.transition = 'opacity 0.3s ease';
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.backgroundColor = 'white';
        modal.style.borderRadius = '8px';
        modal.style.maxWidth = '800px';
        modal.style.width = '90%';
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';
        modal.style.padding = '30px';
        modal.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        modal.style.transform = 'scale(0.9)';
        modal.style.transition = 'transform 0.3s ease';
        modal.style.position = 'relative';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '15px';
        closeButton.style.right = '20px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#333';
        
        // Add title
        const modalTitle = document.createElement('h2');
        modalTitle.textContent = title;
        modalTitle.style.marginTop = '0';
        
        // Add content
        const modalContent = document.createElement('div');
        modalContent.innerHTML = content;
        
        // Assemble modal
        modal.appendChild(closeButton);
        modal.appendChild(modalTitle);
        modal.appendChild(modalContent);
        modalOverlay.appendChild(modal);
        
        // Add to body
        document.body.appendChild(modalOverlay);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Trigger reflow
        void modalOverlay.offsetWidth;
        
        // Show modal with animation
        modalOverlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
        
        // Close modal on click
        closeButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        function closeModal() {
            modalOverlay.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                document.body.style.overflow = '';
            }, 300);
            }
            
            console.log("Modal successfully created and displayed");
        } catch (error) {
            console.error("Error in showModal:", error);
            alert("Error in showModal: " + error.message);
        }
    }
    
    // Initialize features
    createMobileMenu();
    createThemeToggle();
    loadThemePreference();
    setupImageLightbox();
    setupLegalModals();
    
    // ADDITIONAL INTERACTIVE ELEMENTS
    
    // 1. Interactive Before/After Slider for transformations
    const setupBeforeAfterSlider = () => {
        const transformationCards = document.querySelectorAll('.transformation-card');
        
        transformationCards.forEach(card => {
            const beforeAfterContainer = document.createElement('div');
            beforeAfterContainer.className = 'before-after-container';
            
            // Get the before and after images from the card
            const beforeImage = card.querySelector('.before-image img');
            const afterImage = card.querySelector('.after-image img');
            
            if (!beforeImage || !afterImage) return;
            
            // Hide original image containers
            card.querySelector('.before-image').style.display = 'none';
            card.querySelector('.after-image').style.display = 'none';
            
            // Create the slider structure
            beforeAfterContainer.innerHTML = `
                <div class="ba-images">
                    <div class="ba-before">
                        <img src="${beforeImage.src}" alt="Before">
                        <span class="ba-label">BEFORE</span>
                    </div>
                    <div class="ba-after">
                        <img src="${afterImage.src}" alt="After">
                        <span class="ba-label">AFTER</span>
                    </div>
                </div>
                <div class="ba-slider">
                    <div class="ba-handle"></div>
                </div>
                <div class="ba-overlay">
                    <button class="ba-reset">Reset</button>
                </div>
            `;
            
            // Insert the container into the transformation card
            card.querySelector('.transformation-images').appendChild(beforeAfterContainer);
            
            // Setup the slider functionality
            const slider = beforeAfterContainer.querySelector('.ba-slider');
            const handle = beforeAfterContainer.querySelector('.ba-handle');
            const afterDiv = beforeAfterContainer.querySelector('.ba-after');
            const resetBtn = beforeAfterContainer.querySelector('.ba-reset');
            
            // Set initial position to mid-point
            let sliderPosition = 50;
            updateSliderPosition();
            
            // Slider events
            slider.addEventListener('mousedown', handleDown);
            slider.addEventListener('touchstart', handleDown, { passive: true });
            
            // Reset button
            resetBtn.addEventListener('click', () => {
                sliderPosition = 50;
                updateSliderPosition();
            });
            
            function handleDown() {
                document.addEventListener('mousemove', handleMove);
                document.addEventListener('touchmove', handleMove, { passive: false });
                document.addEventListener('mouseup', handleUp);
                document.addEventListener('touchend', handleUp);
            }
            
            function handleMove(e) {
                e.preventDefault();
                const sliderRect = slider.getBoundingClientRect();
                let clientX = e.clientX;
                
                // Handle touch events
                if (e.touches && e.touches[0]) {
                    clientX = e.touches[0].clientX;
                }
                
                // Calculate position percentage
                sliderPosition = ((clientX - sliderRect.left) / sliderRect.width) * 100;
                
                // Constrain to slider boundaries
                sliderPosition = Math.max(0, Math.min(100, sliderPosition));
                
                updateSliderPosition();
            }
            
            function handleUp() {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('mouseup', handleUp);
                document.removeEventListener('touchend', handleUp);
            }
            
            function updateSliderPosition() {
                afterDiv.style.width = `${sliderPosition}%`;
                handle.style.left = `${sliderPosition}%`;
            }
        });
    };
    
    // 2. Fitness Quiz/Calculator
    const setupFitnessQuiz = () => {
        console.log("Setting up fitness quiz from script.js (backup approach)");
        
        // Get the button
        const quizButton = document.querySelector('#fitnessQuizBtn');
        if (!quizButton) {
            console.error("Quiz button not found in script.js");
            return;
        }
        
        // Only add handler if not already set in HTML
        if (!quizButton.onclick) {
            console.log("No onclick handler found on button - adding one");
            quizButton.onclick = function(e) {
                console.log("Quiz button clicked from script.js handler");
                
                // Use the global function if it exists
                if (typeof openFitnessQuiz === 'function') {
                    return openFitnessQuiz();
                }
                
                // Fallback implementation
                alert("Fitness Quiz from script.js");
                
                // Create a simple modal
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                overlay.style.zIndex = '99999';
                overlay.style.display = 'flex';
                overlay.style.justifyContent = 'center';
                overlay.style.alignItems = 'center';
                
                const modal = document.createElement('div');
                modal.style.backgroundColor = 'white';
                modal.style.padding = '30px';
                modal.style.borderRadius = '8px';
                modal.style.maxWidth = '800px';
                modal.style.width = '90%';
                modal.style.maxHeight = '80vh';
                modal.style.overflowY = 'auto';
                modal.style.position = 'relative';
                
                // Add close button
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;';
                closeButton.style.position = 'absolute';
                closeButton.style.top = '10px';
                closeButton.style.right = '15px';
                closeButton.style.border = 'none';
                closeButton.style.background = 'none';
                closeButton.style.fontSize = '24px';
                closeButton.style.cursor = 'pointer';
                closeButton.onclick = function() {
                    document.body.removeChild(overlay);
                };
                
                // Simple content
                modal.innerHTML = `
                    <h2 style="margin-top: 0; margin-bottom: 20px;">Find Your Ideal Fitness Plan (Fallback)</h2>
                    <p>Our fallback fitness quiz will help you find the perfect workout plan.</p>
                    <button style="padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px;">OK</button>
                `;
                
                // Add close button
                modal.appendChild(closeButton);
                
                // Add to body
                overlay.appendChild(modal);
                document.body.appendChild(overlay);
                
                // Add click handler to the OK button
                const okButton = modal.querySelector('button');
                okButton.onclick = function() {
                    document.body.removeChild(overlay);
                };
                
                return false;
            };
        } else {
            console.log("Button already has an onclick handler from HTML - not overriding");
        }
    };
    
    // 3. Animated Statistics with Targeting Feature
    const setupAnimatedStats = () => {
        const metricsSection = document.querySelector('.metrics');
        if (!metricsSection) return;
        
        // Create a targeting UI
        const targetingUI = document.createElement('div');
        targetingUI.className = 'stats-target active'
        targetingUI.innerHTML = `
            <button class="stats-target active" data-stat="all">All Statistics</button>
            <button class="stats-target" data-stat="experience">Experience</button>
            <button class="stats-target" data-stat="clients">Clients</button>
            <button class="stats-target" data-stat="programs">Programs</button>
            <button class="stats-target" data-stat="success">Success Rate</button>
        `;
        
        metricsSection.querySelector('.container').insertBefore(
            targetingUI, 
            metricsSection.querySelector('.metrics-grid')
        );
        
        // Add data attributes to metric items for targeting
        const metricItems = metricsSection.querySelectorAll('.metric-item');
        metricItems[0].dataset.stat = 'experience';
        metricItems[1].dataset.stat = 'clients';
        metricItems[2].dataset.stat = 'programs';
        metricItems[3].dataset.stat = 'success';
        
        // Add click events to targeting buttons
        const targetButtons = targetingUI.querySelectorAll('.stats-target');
        targetButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                targetButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const targetStat = this.dataset.stat;
                
                // Show/hide appropriate stats
                metricItems.forEach(item => {
                    if (targetStat === 'all' || item.dataset.stat === targetStat) {
                        item.style.display = 'flex';
                        // Trigger counting animation if shown
                        if (!item.classList.contains('counted')) {
                            const counter = item.querySelector('.metric-number');
                            animateCounter(counter);
                            item.classList.add('counted');
                        }
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
        
        // Individual counter animation function
        function animateCounter(counter) {
            const target = +counter.getAttribute('data-count');
            const duration = 2000; // ms
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Easing function for smoother counting
                const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentValue = Math.floor(easedProgress * target);
                
                counter.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            requestAnimationFrame(updateCounter);
        }
    };
    
    // Initialize new interactive elements
    setupBeforeAfterSlider();
    setupFitnessQuiz();
    setupAnimatedStats();

    // Function to remove duplicate navigation elements
    const removeDuplicateNavigation = () => {
        console.log("Removing duplicate navigation elements");
        
        // Remove any navigation elements directly under the body
        const bodyNavs = document.querySelectorAll('body > nav:not(.mobile-nav), body > ul:not(header ul), body > div.nav, body > .navigation, body > .menu');
        bodyNavs.forEach(nav => {
            if (nav.parentNode === document.body && !nav.closest('header')) {
                console.log("Removing navigation element:", nav);
                nav.parentNode.removeChild(nav);
            }
        });
        
        // Also remove any cloned navigation in the footer
        const footerNavs = document.querySelectorAll('footer nav, footer ul.nav, footer .nav, footer ul');
        footerNavs.forEach(nav => {
            console.log("Removing footer navigation element:", nav);
            if (nav.parentNode) {
                nav.parentNode.removeChild(nav);
            }
        });
        
        // Find all navigation links at the bottom of the page
        const navLinks = ['home', 'about', 'services', 'transformations', 'testimonials', 'faq', 'contact'];
        
        // Find any element with these navigation links that's not in the header
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            const href = link.getAttribute('href').substring(1); // Remove the # character
            if (navLinks.includes(href) && !link.closest('header')) {
                // Check if this link is part of a navigation group
                let parent = link.parentNode;
                
                // If it's in a list item, move up to the list
                if (parent.tagName === 'LI') {
                    parent = parent.parentNode;
                }
                
                // If it's part of a list that contains multiple navigation links, remove the whole list
                if (parent.tagName === 'UL' || parent.tagName === 'NAV') {
                    const links = parent.querySelectorAll('a[href^="#"]');
                    let navigationGroup = false;
                    
                    // Check if this is likely a navigation group
                    if (links.length >= 3) {
                        let navLinkCount = 0;
                        links.forEach(navLink => {
                            const navHref = navLink.getAttribute('href').substring(1);
                            if (navLinks.includes(navHref)) {
                                navLinkCount++;
                            }
                        });
                        
                        // If more than half are navigation links, it's a navigation group
                        navigationGroup = (navLinkCount / links.length) > 0.5;
                    }
                    
                    if (navigationGroup) {
                        console.log("Removing navigation group:", parent);
                        parent.style.display = 'none';
                        parent.style.visibility = 'hidden';
                        parent.style.opacity = '0';
                        parent.style.pointerEvents = 'none';
                        
                        // Try to physically remove it if possible
                        if (parent.parentNode) {
                            parent.parentNode.removeChild(parent);
                        }
                    } else {
                        // Just remove this individual link
                        console.log("Removing navigation link:", link);
                        link.style.display = 'none';
                        link.style.visibility = 'hidden';
                        link.style.opacity = '0';
                        link.style.pointerEvents = 'none';
                        
                        if (link.parentNode) {
                            link.parentNode.removeChild(link);
                        }
                    }
                }
            }
        });
    };

    // Call this function on page load
    removeDuplicateNavigation();

    // Also run it after a short delay to catch any dynamically added elements
    setTimeout(removeDuplicateNavigation, 1000);

    // And run it whenever the window is resized (which might trigger responsive layout changes)
    window.addEventListener('resize', removeDuplicateNavigation);
}); 