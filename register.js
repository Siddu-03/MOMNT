/**
 * Momnt Registration Page JavaScript
 * Handles form validation, error display, and successful registration flow
 */

// ===== DOM ELEMENTS =====
const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const registerBtn = document.querySelector('.register-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const successMessage = document.getElementById('successMessage');

// ===== VALIDATION RULES =====
const validationRules = {
    fullName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Please enter a valid full name (letters and spaces only)'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Password must be 8+ characters with uppercase, lowercase, and number'
    },
    confirmPassword: {
        required: true,
        message: 'Please confirm your password'
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addInputAnimations();
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Form submission
    registerForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation on blur
    fullNameInput.addEventListener('blur', () => validateField('fullName'));
    emailInput.addEventListener('blur', () => validateField('email'));
    passwordInput.addEventListener('blur', () => validateField('password'));
    confirmPasswordInput.addEventListener('blur', () => validateField('confirmPassword'));
    
    // Clear errors on focus
    [fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('focus', () => clearFieldError(input.name));
    });
    
    // Password matching validation
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
}

/**
 * Add subtle animations to input fields
 */
function addInputAnimations() {
    const inputGroups = document.querySelectorAll('.input-group');
    
    inputGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.6s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Clear any existing messages
    hideSuccessMessage();
    
    // Validate all fields
    const isValid = validateAllFields();
    
    if (!isValid) {
        shakeForm();
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Simulate registration process (replace with actual API call)
        await simulateRegistration();
        
        // Show success and redirect
        showSuccessMessage();
        setTimeout(() => {
            redirectToLogin();
        }, 2500);
        
    } catch (error) {
        console.error('Registration failed:', error);
        showError('registration', 'Registration failed. Please try again.');
        setLoadingState(false);
    }
}

/**
 * Validate all form fields
 * @returns {boolean} - Whether all fields are valid
 */
function validateAllFields() {
    let isValid = true;
    
    // Validate each field
    if (!validateField('fullName')) isValid = false;
    if (!validateField('email')) isValid = false;
    if (!validateField('password')) isValid = false;
    if (!validateField('confirmPassword')) isValid = false;
    
    return isValid;
}

/**
 * Validate individual field
 * @param {string} fieldName - Name of the field to validate
 * @returns {boolean} - Whether the field is valid
 */
function validateField(fieldName) {
    const input = document.getElementById(fieldName);
    const value = input.value.trim();
    const rules = validationRules[fieldName];
    
    // Clear previous error state
    clearFieldError(fieldName);
    
    // Check if field is required and empty
    if (rules.required && !value) {
        showFieldError(fieldName, `${getFieldDisplayName(fieldName)} is required`);
        return false;
    }
    
    // Skip further validation if field is empty and not required
    if (!value && !rules.required) {
        return true;
    }
    
    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(fieldName, `${getFieldDisplayName(fieldName)} must be at least ${rules.minLength} characters`);
        return false;
    }
    
    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(fieldName, rules.message);
        return false;
    }
    
    // Special validation for confirm password
    if (fieldName === 'confirmPassword') {
        return validatePasswordMatch();
    }
    
    return true;
}

/**
 * Validate password confirmation
 * @returns {boolean} - Whether passwords match
 */
function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    clearFieldError('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        return false;
    }
    
    return true;
}

/**
 * Show error message for a specific field
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message to display
 */
function showFieldError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Add shake animation to input
    input.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

/**
 * Clear error state for a specific field
 * @param {string} fieldName - Name of the field
 */
function clearFieldError(fieldName) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    input.classList.remove('error');
    errorElement.classList.remove('show');
    errorElement.textContent = '';
}

/**
 * Get display name for field
 * @param {string} fieldName - Field name
 * @returns {string} - Human readable field name
 */
function getFieldDisplayName(fieldName) {
    const displayNames = {
        fullName: 'Full name',
        email: 'Email address',
        password: 'Password',
        confirmPassword: 'Password confirmation'
    };
    
    return displayNames[fieldName] || fieldName;
}

/**
 * Shake the form to indicate validation errors
 */
function shakeForm() {
    const registerCard = document.querySelector('.register-card');
    registerCard.style.animation = 'shake 0.6s ease-in-out';
    
    setTimeout(() => {
        registerCard.style.animation = '';
    }, 600);
}

/**
 * Set loading state for the form
 * @param {boolean} isLoading - Whether form is in loading state
 */
function setLoadingState(isLoading) {
    registerBtn.disabled = isLoading;
    
    if (isLoading) {
        btnText.style.opacity = '0';
        btnLoader.style.display = 'block';
    } else {
        btnText.style.opacity = '1';
        btnLoader.style.display = 'none';
    }
}

/**
 * Show success message
 */
function showSuccessMessage() {
    setLoadingState(false);
    successMessage.style.display = 'flex';
    
    // Add success animation to the entire form
    const registerCard = document.querySelector('.register-card');
    registerCard.style.animation = 'successPulse 0.6s ease-in-out';
}

/**
 * Hide success message
 */
function hideSuccessMessage() {
    successMessage.style.display = 'none';
}

/**
 * Simulate registration API call
 * @returns {Promise} - Simulated async operation
 */
function simulateRegistration() {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // For demo purposes, always succeed
            // In real implementation, this would be an actual API call
            const success = Math.random() > 0.1; // 90% success rate for demo
            
            if (success) {
                resolve({ success: true });
            } else {
                reject(new Error('Registration failed'));
            }
        }, 1500);
    });
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
    // Add fade out animation before redirect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 300);
}

/**
 * Show general error message
 * @param {string} type - Error type
 * @param {string} message - Error message
 */
function showError(type, message) {
    // Create or update a general error message area
    let errorDiv = document.getElementById('general-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'general-error';
        errorDiv.className = 'error-message show';
        errorDiv.style.marginTop = '1rem';
        errorDiv.style.textAlign = 'center';
        registerForm.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

// ===== CSS ANIMATIONS (Added via JavaScript) =====
const additionalStyles = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);