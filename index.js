/**
 * MOMNT - Landing Page JavaScript
 * Handles all interactive functionality and animations
 */

// ===== GLOBAL VARIABLES AND CONFIGURATION =====
let isScrolling = false;
let ticking = false;

// Configuration object for animation settings
const CONFIG = {
    scrollThreshold: 100,
    animationDuration: 300,
    easing: 'ease-out',
    intersectionThreshold: 0.1
};

// ===== DOM CONTENT LOADED EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Momnt landing page initialized');
    
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeCTAButtons();
    initializeIntersectionObserver();
    initializeParallaxEffects();
    
    // Add loading complete class for CSS transitions
    document.body.classList.add('loaded');
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) {
        console.warn('⚠️ Navbar element not found');
        return;
    }
    
    // Handle scroll effects on navbar
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavbarScroll(navbar, lastScrollTop);
                lastScrollTop = window.pageYOffset;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Handle mobile menu toggle (if hamburger exists)
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            toggleMobileMenu(hamburger);
        });
    }
    
    // Handle smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            handleSmoothScroll(e, this);
        });
    });
    
    console.log('✅ Navigation initialized');
}

/**
 * Handle navbar appearance changes on scroll
 * @param {HTMLElement} navbar - The navigation bar element
 * @param {number} lastScrollTop - Previous scroll position
 */
function handleNavbarScroll(navbar, lastScrollTop) {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > CONFIG.scrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll direction (optional enhancement)
    if (currentScroll > lastScrollTop && currentScroll > CONFIG.scrollThreshold) {
        // Scrolling down - hide navbar
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up - show navbar
        navbar.style.transform = 'translateY(0)';
    }
}

/**
 * Toggle mobile menu visibility
 * @param {HTMLElement} hamburger - The hamburger menu button
 */
function toggleMobileMenu(hamburger) {
    hamburger.classList.toggle('active');
    
    // Add animation to hamburger lines
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.style.transform = hamburger.classList.contains('active') 
            ? `rotate(${index === 0 ? '45deg' : index === 1 ? '0deg' : '-45deg'})` 
            : 'rotate(0deg)';
        span.style.opacity = hamburger.classList.contains('active') && index === 1 ? '0' : '1';
    });
}

/**
 * Handle smooth scrolling for anchor links
 * @param {Event} e - The click event
 * @param {HTMLElement} link - The clicked link element
 */
function handleSmoothScroll(e, link) {
    const href = link.getAttribute('href');
    
    // Only handle internal anchor links
    if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Add active state to clicked link
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    }
}

// ===== SCROLL EFFECTS AND ANIMATIONS =====
function initializeScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Hide scroll indicator after user starts scrolling
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        }
    });
    
    // Add scroll-triggered animations
    window.addEventListener('scroll', debounce(handleScrollAnimations, 16));
    
    console.log('✅ Scroll effects initialized');
}

/**
 * Handle scroll-triggered animations
 */
function handleScrollAnimations() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    // Animate floating elements based on scroll
    const floatingElements = document.querySelectorAll('.float-item');
    floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrolled * speed);
        element.style.transform = `translate(${element.style.left || '0'}, ${yPos}px)`;
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initializeIntersectionObserver() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: CONFIG.intersectionThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger delay for child elements
                const children = entry.target.querySelectorAll('.feature-card, .step-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sectionsToObserve = document.querySelectorAll('.features-preview, .how-it-works, .footer');
    sectionsToObserve.forEach(section => {
        observer.observe(section);
    });
    
    console.log('✅ Intersection Observer initialized');
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    const phoneScreen = document.querySelector('.phone-screen');
    
    if (phoneScreen) {
        // Add mouse movement parallax to phone mockup
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const rotateX = (mouseY - 0.5) * 10;
            const rotateY = (mouseX - 0.5) * -10;
            
            phoneScreen.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset transform when mouse leaves
        document.addEventListener('mouseleave', function() {
            phoneScreen.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }
    
    console.log('✅ Parallax effects initialized');
}

// ===== GENERAL ANIMATIONS =====
function initializeAnimations() {
    // Add random delays to floating elements
    const floatingElements = document.querySelectorAll('.float-item');
    floatingElements.forEach((element, index) => {
        const delay = Math.random() * 2;
        element.style.animationDelay = `${delay}s`;
    });
    
    // Initialize typing animation for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        animateHeroTitle(heroTitle);
    }
    
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('✅ General animations initialized');
}

/**
 * Animate hero title with typewriter effect
 * @param {HTMLElement} titleElement - The hero title element
 */
function animateHeroTitle(titleElement) {
    const lines = titleElement.querySelectorAll('.title-line');
    
    lines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.borderRight = '2px solid white';
        
        setTimeout(() => {
            typeText(line, text, 100);
        }, index * 1000);
    });
}

/**
 * Type text character by character
 * @param {HTMLElement} element - Element to type into
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in milliseconds
 */
function typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i >= text.length) {
            clearInterval(timer);
            element.style.borderRight = 'none';
        }
    }, speed);
}

// ===== CTA BUTTON FUNCTIONALITY =====
function initializeCTAButtons() {
    const createEventBtn = document.getElementById('createEventBtn');
    const secondaryButtons = document.querySelectorAll('.cta-secondary');
    
    // Handle main CTA button click
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function(e) {
            handleCreateEventClick(e, this);
        });
        
        // Add ripple effect to CTA button
        addRippleEffect(createEventBtn);
    }
    
    // Handle secondary button clicks
    secondaryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            handleSecondaryButtonClick(e, this);
        });
        
        addRippleEffect(button);
    });
    
    console.log('✅ CTA buttons initialized');
}

/**
 * Handle main CTA button click
 * @param {Event} e - Click event
 * @param {HTMLElement} button - The clicked button
 */
function handleCreateEventClick(e, button) {
    e.preventDefault();
    
    // Add loading state
    const originalText = button.querySelector('.btn-text').textContent;
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('.btn-icon');
    
    // Show loading state
    btnText.textContent = 'Loading...';
    btnIcon.className = 'fas fa-spinner fa-spin btn-icon';
    button.disabled = true;
    
    // Simulate loading and redirect
    setTimeout(() => {
        // In a real application, you would navigate to login.html
        window.location.href = 'login.html';
        
        // Reset button state (in case navigation fails)
        btnText.textContent = originalText;
        btnIcon.className = 'fas fa-arrow-right btn-icon';
        button.disabled = false;
    }, 1000);
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    console.log('🎯 Create Event button clicked');
}

/**
 * Handle secondary button clicks
 * @param {Event} e - Click event
 * @param {HTMLElement} button - The clicked button
 */
function handleSecondaryButtonClick(e, button) {
    e.preventDefault();
    
    // Check button text to determine action
    const buttonText = button.textContent.trim();
    
    if (buttonText.includes('Demo')) {
        // Show demo modal or video (placeholder)
        showDemoModal();
    }
    
    console.log(`🎯 Secondary button clicked: ${buttonText}`);
}

/**
 * Show demo modal (placeholder function)
 */
function showDemoModal() {
    // This would typically open a modal with a demo video
    alert('Demo video would open here!\n\nIn a real implementation, this would show a product demo or tutorial video.');
}

/**
 * Add ripple effect to buttons
 * @param {HTMLElement} button - Button to add ripple effect to
 */
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get scroll percentage of page
 * @returns {number} Scroll percentage (0-100)
 */
function getScrollPercentage() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', e.error);
    
    // In production, you might want to send this to an error tracking service
    // trackError(e.error);
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log performance metrics
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    console.log(`📊 Page load time: ${loadTime}ms`);
    
    // You could send this data to analytics
    // analytics.track('page_load_time', { duration: loadTime });
});

// ===== CSS ANIMATION CLASSES (to be used with Intersection Observer) =====
// Add CSS for these classes in your CSS file:
/*
.animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.features-preview .feature-card,
.how-it-works .step-item {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}
*/

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Handle keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
    
    // Handle Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('cta-primary')) {
        e.target.click();
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ===== ADD RIPPLE ANIMATION CSS DYNAMICALLY =====
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

console.log('🎉 Momnt landing page fully loaded and interactive!');