// Main JavaScript file for MOMNT
// Common functions and utilities

// Global variables
let currentUser = null;
let currentEvent = null;

// Utility functions
const utils = {
    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Format time
    formatTime: (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate password strength
    validatePassword: (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const strength = {
            length: password.length >= minLength,
            upperCase: hasUpperCase,
            lowerCase: hasLowerCase,
            numbers: hasNumbers,
            specialChar: hasSpecialChar
        };

        const score = Object.values(strength).filter(Boolean).length;
        
        let level = 'weak';
        if (score >= 4) level = 'strong';
        else if (score >= 3) level = 'good';
        else if (score >= 2) level = 'fair';

        return { strength, score, level };
    },

    // Show notification
    showNotification: (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });

        // Auto remove
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, duration);
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Local storage helpers
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        },

        get: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },

        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from localStorage:', e);
            }
        }
    },

    // API helpers
    api: {
        baseURL: 'http://localhost:5000/api', // Change this to your backend URL

        request: async (endpoint, options = {}) => {
            const url = `${utils.api.baseURL}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            // Add auth token if available
            const token = utils.storage.get('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            try {
                const response = await fetch(url, config);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'API request failed');
                }

                return data;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },

        get: (endpoint) => utils.api.request(endpoint),
        
        post: (endpoint, data) => utils.api.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

        put: (endpoint, data) => utils.api.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),

        delete: (endpoint) => utils.api.request(endpoint, {
            method: 'DELETE'
        })
    }
};

// DOM utilities
const dom = {
    // Get element by selector
    get: (selector) => document.querySelector(selector),

    // Get all elements by selector
    getAll: (selector) => document.querySelectorAll(selector),

    // Create element with attributes
    create: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        // Add children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    },

    // Add event listener with error handling
    on: (element, event, handler) => {
        if (element) {
            element.addEventListener(event, handler);
        }
    },

    // Remove event listener
    off: (element, event, handler) => {
        if (element) {
            element.removeEventListener(event, handler);
        }
    },

    // Toggle class
    toggleClass: (element, className) => {
        if (element) {
            element.classList.toggle(className);
        }
    },

    // Add class
    addClass: (element, className) => {
        if (element) {
            element.classList.add(className);
        }
    },

    // Remove class
    removeClass: (element, className) => {
        if (element) {
            element.classList.remove(className);
        }
    },

    // Show element
    show: (element) => {
        if (element) {
            element.style.display = '';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
        }
    },

    // Hide element
    hide: (element) => {
        if (element) {
            element.style.display = 'none';
        }
    },

    // Fade in element
    fadeIn: (element, duration = 300) => {
        if (element) {
            element.style.opacity = '0';
            element.style.display = '';
            element.style.transition = `opacity ${duration}ms ease`;
            
            setTimeout(() => {
                element.style.opacity = '1';
            }, 10);
        }
    },

    // Fade out element
    fadeOut: (element, duration = 300) => {
        if (element) {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        }
    }
};

// Authentication utilities
const auth = {
    // Check if user is logged in
    isLoggedIn: () => {
        const token = utils.storage.get('authToken');
        const user = utils.storage.get('user');
        return !!(token && user);
    },

    // Get current user
    getCurrentUser: () => {
        return utils.storage.get('user');
    },

    // Set current user
    setCurrentUser: (user) => {
        utils.storage.set('user', user);
        currentUser = user;
    },

    // Login
    login: async (email, password) => {
        try {
            const response = await utils.api.post('/auth/login', { email, password });
            
            utils.storage.set('authToken', response.token);
            auth.setCurrentUser(response.user);
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Register
    register: async (userData) => {
        try {
            const response = await utils.api.post('/auth/register', userData);
            
            utils.storage.set('authToken', response.token);
            auth.setCurrentUser(response.user);
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Logout
    logout: () => {
        utils.storage.remove('authToken');
        utils.storage.remove('user');
        currentUser = null;
        currentEvent = null;
        
        // Redirect to home page
        window.location.href = '/html/index.html';
    },

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const response = await utils.api.put('/auth/profile', userData);
            auth.setCurrentUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

// Event utilities
const eventUtils = {
    // Get all events
    getEvents: async () => {
        try {
            return await utils.api.get('/events');
        } catch (error) {
            throw error;
        }
    },

    // Get single event
    getEvent: async (eventId) => {
        try {
            return await utils.api.get(`/events/${eventId}`);
        } catch (error) {
            throw error;
        }
    },

    // Create event
    createEvent: async (eventData) => {
        try {
            return await utils.api.post('/events', eventData);
        } catch (error) {
            throw error;
        }
    },

    // Update event
    updateEvent: async (eventId, eventData) => {
        try {
            return await utils.api.put(`/events/${eventId}`, eventData);
        } catch (error) {
            throw error;
        }
    },

    // Delete event
    deleteEvent: async (eventId) => {
        try {
            return await utils.api.delete(`/events/${eventId}`);
        } catch (error) {
            throw error;
        }
    },

    // Get event photos
    getEventPhotos: async (eventId) => {
        try {
            return await utils.api.get(`/events/${eventId}/photos`);
        } catch (error) {
            throw error;
        }
    }
};

// Upload utilities
const uploadUtils = {
    // Upload photos
    uploadPhotos: async (eventId, files) => {
        try {
            const formData = new FormData();
            formData.append('eventId', eventId);
            
            Array.from(files).forEach((file, index) => {
                formData.append('photos', file);
            });

            const response = await fetch(`${utils.api.baseURL}/uploads`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${utils.storage.get('authToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    // Validate file
    validateFile: (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'File too large. Maximum size is 10MB.' };
        }

        return { valid: true };
    },

    // Create preview
    createPreview: (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
};

// Initialize app
const initApp = () => {
    // Add page load animation
    document.body.classList.add('page-load');

    // Check authentication status
    if (auth.isLoggedIn()) {
        currentUser = auth.getCurrentUser();
    }

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe scroll animate elements
    dom.getAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });

    // Add focus visible polyfill
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add keyboard navigation styles
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--primary-color) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);
};

// Export utilities for use in other files
window.MOMNT = {
    utils,
    dom,
    auth,
    eventUtils,
    uploadUtils,
    initApp
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
} 