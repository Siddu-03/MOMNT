/**
 * LOGIN PAGE JAVASCRIPT
 * Handles form validation, error display, and navigation
 * for the Momnt login page
 */

// ===========================================
// DOM ELEMENT REFERENCES
// ===========================================

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginBtn');
const errorMessage = document.getElementById('errorMessage');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.getElementById('btnLoading');

// ===========================================
// FORM VALIDATION FUNCTIONS
// ===========================================

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates individual form field
 * @param {HTMLInputElement} field - The input field to validate
 * @returns {object} - Validation result with isValid boolean and message string
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Check if field is empty
    if (!value) {
        return {
            isValid: false,
            message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
        };
    }
    
    // Additional validation for email field
    if (fieldName === 'email' && !isValidEmail(value)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address'
        };
    }
    
    // Additional validation for password field
    if (fieldName === 'password' && value.length < 6) {
        return {
            isValid: false,
            message: 'Password must be at least 6 characters long'
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

/**
 * Validates the entire login form
 * @returns {object} - Validation result with isValid boolean and message string
 */
function validateForm() {
    const emailValidation = validateField(emailInput);
    const passwordValidation = validateField(passwordInput);
    
    // Check email validation first
    if (!emailValidation.isValid) {
        return emailValidation;
    }
    
    // Then check password validation
    if (!passwordValidation.isValid) {
        return passwordValidation;
    }
    
    // If both fields are valid
    return {
        isValid: true,
        message: ''
    };
}

// ===========================================
// UI FEEDBACK FUNCTIONS
// ===========================================

/**
 * Shows error message with smooth animation
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Add error styling to form inputs
    emailInput.classList.add('error');
    passwordInput.classList.add('error');
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Hides error message with smooth animation
 */
function hideError() {
    errorMessage.classList.remove('show');
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');
}

/**
 * Shows loading state on login button
 */
function showLoading() {
    loginButton.classList.add('loading');
    loginButton.disabled = true;
}

/**
 * Hides loading state on login button
 */
function hideLoading() {
    loginButton.classList.remove('loading');
    loginButton.disabled = false;
}

/**
 * Simulates login process with loading animation
 * @param {Function} successCallback - Function to call on successful login
 */
function simulateLogin(successCallback) {
    showLoading();
    
    // Simulate API call delay (1.5 seconds)
    setTimeout(() => {
        hideLoading();
        successCallback();
    }, 1500);
}

// ===========================================
// NAVIGATION FUNCTIONS
// ===========================================

/**
 * Redirects user to create-event page after successful login
 */
function redirectToCreateEvent() {
    // Add a small delay for better UX
    setTimeout(() => {
        window.location.href = 'host-dashboard.html';
    }, 300);
}

// ===========================================
// EVENT LISTENERS
// ===========================================

/**
 * Handle form submission
 */
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Hide any existing error messages
    hideError();
    
    // Validate the form
    const validation = validateForm();
    
    if (!validation.isValid) {
        // Show error message if validation fails
        showError(validation.message);
        return;
    }
    
    // If validation passes, simulate login process
    simulateLogin(redirectToCreateEvent);
});

/**
 * Clear error styling when user starts typing
 */
emailInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        hideError();
    }
});

passwordInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
        hideError();
    }
});

/**
 * Handle Enter key press in form fields
 */
emailInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize the login page - UPDATED
 * Set up any necessary initial state
 */
function initializeLoginPage() {
    // Create password toggle functionality
    createPasswordToggle();
    
    // Focus on email input when page loads
    emailInput.focus();
    
    // Add smooth transitions after page load
    document.body.style.opacity = '0';
    window.addEventListener('load', function() {
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '1';
    });
    
    console.log('Momnt Login Page initialized successfully');
}

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeLoginPage);

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Check if user is already logged in (for future implementation)
 * This could check localStorage, sessionStorage, or cookies
 * @returns {boolean} - True if user appears to be logged in
 */
function checkExistingLogin() {
    // For now, always return false
    // In a real implementation, this would check for valid auth tokens
    return false;
}

// ===========================================
// ACCESSIBILITY HELPERS
// ===========================================

/**
 * Announce messages to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after it's been read
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===========================================
// ERROR HANDLING
// ===========================================

/**
 * Global error handler for uncaught errors
 */
window.addEventListener('error', function(event) {
    console.error('Login page error:', event.error);
    
    // Show user-friendly error message
    showError('Something went wrong. Please try again.');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error message
    showError('Something went wrong. Please try again.');
});

// ===========================================
// DEVELOPMENT HELPERS
// ===========================================

/**
 * Development mode helper - auto-fill form for testing
 * Remove this in production
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Add keyboard shortcut for quick testing (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
            emailInput.value = 'test@example.com';
            passwordInput.value = 'password123';
            console.log('Test credentials filled');
        }
    });
}
// ===========================================
// PASSWORD TOGGLE FUNCTIONALITY - NEW
// ===========================================

/**
 * Creates and inserts password toggle button
 */
function createPasswordToggle() {
    // Create container for password input and toggle
    const passwordContainer = document.createElement('div');
    passwordContainer.className = 'password-input-container';
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'password-toggle';
    toggleButton.innerHTML = '👁️';
    toggleButton.setAttribute('aria-label', 'Toggle password visibility');
    toggleButton.id = 'passwordToggle';
    
    // Wrap password input in container
    passwordInput.parentNode.insertBefore(passwordContainer, passwordInput);
    passwordContainer.appendChild(passwordInput);
    passwordContainer.appendChild(toggleButton);
    
    // Add event listener for toggle
    toggleButton.addEventListener('click', togglePasswordVisibility);
}

/**
 * Toggles password visibility
 */
function togglePasswordVisibility() {
    const toggleButton = document.getElementById('passwordToggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordInput.classList.add('password-field');
        toggleButton.innerHTML = '🙈';
        toggleButton.setAttribute('aria-label', 'Hide password');
    } else {
        passwordInput.type = 'password';
        passwordInput.classList.remove('password-field');
        toggleButton.innerHTML = '👁️';
        toggleButton.setAttribute('aria-label', 'Show password');
    }
}