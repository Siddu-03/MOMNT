// Authentication JavaScript
// Handles login and register functionality

document.addEventListener('DOMContentLoaded', () => {
    const { utils, dom, auth } = window.MOMNT;

    // Get form elements
    const loginForm = dom.get('#login-form');
    const registerForm = dom.get('#register-form');
    const passwordToggles = dom.getAll('.password-toggle');
    const passwordInput = dom.get('#password');
    const confirmPasswordInput = dom.get('#confirmPassword');
    const passwordStrength = dom.get('#password-strength');
    const strengthFill = dom.get('#strength-fill');
    const strengthText = dom.get('#strength-text');

    // Password toggle functionality
    passwordToggles.forEach(toggle => {
        dom.on(toggle, 'click', (e) => {
            e.preventDefault();
            const input = toggle.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            toggle.textContent = type === 'password' ? '👁️' : '🙈';
        });
    });

    // Password strength indicator
    if (passwordInput) {
        dom.on(passwordInput, 'input', utils.debounce((e) => {
            const password = e.target.value;
            const validation = utils.validatePassword(password);
            
            // Update strength bar
            dom.removeClass(strengthFill, 'weak fair good strong');
            dom.addClass(strengthFill, validation.level);
            
            // Update strength text
            strengthText.textContent = `Password strength: ${validation.level}`;
            
            // Show/hide strength indicator
            if (password.length > 0) {
                dom.show(passwordStrength);
            } else {
                dom.hide(passwordStrength);
            }
        }, 300));
    }

    // Password confirmation validation
    if (confirmPasswordInput && passwordInput) {
        dom.on(confirmPasswordInput, 'input', utils.debounce((e) => {
            const password = passwordInput.value;
            const confirmPassword = e.target.value;
            
            if (confirmPassword.length > 0 && password !== confirmPassword) {
                dom.addClass(confirmPasswordInput, 'error-shake');
                confirmPasswordInput.setCustomValidity('Passwords do not match');
            } else {
                dom.removeClass(confirmPasswordInput, 'error-shake');
                confirmPasswordInput.setCustomValidity('');
            }
        }, 300));
    }

    // Login form submission
    if (loginForm) {
        dom.on(loginForm, 'submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            const rememberMe = formData.get('rememberMe');

            // Validate inputs
            if (!utils.validateEmail(email)) {
                utils.showNotification('Please enter a valid email address', 'error');
                return;
            }

            if (password.length < 6) {
                utils.showNotification('Password must be at least 6 characters', 'error');
                return;
            }

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;

            try {
                const response = await auth.login(email, password);
                
                // Remember me functionality
                if (rememberMe) {
                    utils.storage.set('rememberMe', true);
                }

                utils.showNotification('Login successful!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } catch (error) {
                console.error('Login error:', error);
                utils.showNotification(error.message || 'Login failed. Please try again.', 'error');
                
                // Reset form
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Register form submission
    if (registerForm) {
        dom.on(registerForm, 'submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
                phone: formData.get('phone'),
                terms: formData.get('terms'),
                newsletter: formData.get('newsletter')
            };

            // Validate inputs
            if (!userData.firstName || !userData.lastName) {
                utils.showNotification('Please enter your full name', 'error');
                return;
            }

            if (!utils.validateEmail(userData.email)) {
                utils.showNotification('Please enter a valid email address', 'error');
                return;
            }

            const passwordValidation = utils.validatePassword(userData.password);
            if (passwordValidation.level === 'weak') {
                utils.showNotification('Please choose a stronger password', 'error');
                return;
            }

            if (userData.password !== userData.confirmPassword) {
                utils.showNotification('Passwords do not match', 'error');
                return;
            }

            if (!userData.terms) {
                utils.showNotification('Please accept the terms of service', 'error');
                return;
            }

            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;

            try {
                const response = await auth.register(userData);
                
                utils.showNotification('Account created successfully!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);

            } catch (error) {
                console.error('Registration error:', error);
                utils.showNotification(error.message || 'Registration failed. Please try again.', 'error');
                
                // Reset form
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Social authentication buttons
    const googleBtn = dom.get('.btn-google');
    const facebookBtn = dom.get('.btn-facebook');

    if (googleBtn) {
        dom.on(googleBtn, 'click', (e) => {
            e.preventDefault();
            utils.showNotification('Google authentication coming soon!', 'info');
        });
    }

    if (facebookBtn) {
        dom.on(facebookBtn, 'click', (e) => {
            e.preventDefault();
            utils.showNotification('Facebook authentication coming soon!', 'info');
        });
    }

    // Forgot password link
    const forgotPasswordLink = dom.get('.forgot-password');
    if (forgotPasswordLink) {
        dom.on(forgotPasswordLink, 'click', (e) => {
            e.preventDefault();
            utils.showNotification('Password reset functionality coming soon!', 'info');
        });
    }

    // Terms and privacy links
    const termsLink = dom.get('.terms-link');
    const privacyLink = dom.get('.privacy-link');

    if (termsLink) {
        dom.on(termsLink, 'click', (e) => {
            e.preventDefault();
            utils.showNotification('Terms of service coming soon!', 'info');
        });
    }

    if (privacyLink) {
        dom.on(privacyLink, 'click', (e) => {
            e.preventDefault();
            utils.showNotification('Privacy policy coming soon!', 'info');
        });
    }

    // Logout button (if on dashboard)
    const logoutBtn = dom.get('#logout-btn');
    if (logoutBtn) {
        dom.on(logoutBtn, 'click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    }

    // Real-time validation
    const inputs = dom.getAll('input[type="email"], input[type="password"], input[type="text"]');
    inputs.forEach(input => {
        dom.on(input, 'blur', () => {
            validateField(input);
        });

        dom.on(input, 'input', utils.debounce(() => {
            validateField(input);
        }, 300));
    });

    function validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;

        // Remove existing error states
        dom.removeClass(input, 'error-shake');
        input.setCustomValidity('');

        // Email validation
        if (type === 'email' && value && !utils.validateEmail(value)) {
            dom.addClass(input, 'error-shake');
            input.setCustomValidity('Please enter a valid email address');
            return false;
        }

        // Password validation
        if (type === 'password' && name === 'password' && value) {
            const validation = utils.validatePassword(value);
            if (validation.level === 'weak') {
                dom.addClass(input, 'error-shake');
                input.setCustomValidity('Password is too weak');
                return false;
            }
        }

        // Required field validation
        if (input.hasAttribute('required') && !value) {
            dom.addClass(input, 'error-shake');
            input.setCustomValidity('This field is required');
            return false;
        }

        return true;
    }

    // Form field animations
    const formGroups = dom.getAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');

        if (input && label) {
            // Add focus effects
            dom.on(input, 'focus', () => {
                dom.addClass(group, 'focused');
            });

            dom.on(input, 'blur', () => {
                if (!input.value) {
                    dom.removeClass(group, 'focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                dom.addClass(group, 'focused');
            }
        }
    });

    // Add floating label styles
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            position: relative;
        }

        .form-group.focused label,
        .form-group input:not(:placeholder-shown) + label {
            transform: translateY(-20px) scale(0.8);
            color: var(--primary-color);
        }

        .form-group label {
            transition: all 0.3s ease;
            position: absolute;
            top: 50%;
            left: 3rem;
            transform: translateY(-50%);
            pointer-events: none;
            background: transparent;
            padding: 0 0.5rem;
        }

        .form-group.focused input,
        .form-group input:not(:placeholder-shown) {
            border-color: var(--primary-color);
        }

        .error-shake {
            animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}); 