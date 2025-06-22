// Main JavaScript file for MOMNT
// Common functions and utilities

// Global variables
let currentUser = null;
let currentEvent = null;

// Physics-based cursor system
class PhysicsCursor {
    constructor() {
        this.cursor = null;
        this.follower = null;
        this.wave = null;
        this.mouse = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.friction = 0.85;
        this.spring = 0.1;
        this.mass = 1;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        // Create cursor elements
        this.createCursorElements();
        
        // Add event listeners
        this.addEventListeners();
        
        // Start animation loop
        this.animate();
    }
    
    createCursorElements() {
        // Create main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';
        document.body.appendChild(this.cursor);
        
        // Create follower
        this.follower = document.createElement('div');
        this.follower.className = 'cursor-follower';
        document.body.appendChild(this.follower);
        
        // Create wave effect
        this.wave = document.createElement('div');
        this.wave.className = 'cursor-wave';
        document.body.appendChild(this.wave);
    }
    
    addEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.isActive = true;
        });
        
        // Mouse enter
        document.addEventListener('mouseenter', () => {
            this.isActive = true;
        });
        
        // Mouse leave
        document.addEventListener('mouseleave', () => {
            this.isActive = false;
        });
        
        // Click events for wave effect
        document.addEventListener('click', (e) => {
            this.createWave(e.clientX, e.clientY);
        });
        
        // Interactive elements
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('interactive') || 
                e.target.closest('.interactive') ||
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('button') ||
                e.target.closest('a')) {
                this.setInteractiveState(true);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (!e.target.classList.contains('interactive') && 
                !e.target.closest('.interactive') &&
                e.target.tagName !== 'BUTTON' &&
                e.target.tagName !== 'A' &&
                !e.target.closest('button') &&
                !e.target.closest('a')) {
                this.setInteractiveState(false);
            }
        });
    }
    
    setInteractiveState(isInteractive) {
        if (isInteractive) {
            this.cursor.style.transform = 'scale(1.5)';
            this.follower.style.transform = 'scale(1.2)';
            this.follower.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 100%)';
            this.follower.style.borderColor = 'rgba(99, 102, 241, 0.6)';
        } else {
            this.cursor.style.transform = 'scale(1)';
            this.follower.style.transform = 'scale(1)';
            this.follower.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%)';
            this.follower.style.borderColor = 'rgba(99, 102, 241, 0.3)';
        }
    }
    
    createWave(x, y) {
        this.wave.style.left = x + 'px';
        this.wave.style.top = y + 'px';
        this.wave.classList.add('active');
        
        setTimeout(() => {
            this.wave.classList.remove('active');
        }, 600);
    }
    
    animate() {
        if (this.isActive) {
            // Update follower position with physics
            const dx = this.mouse.x - this.followerPos.x;
            const dy = this.mouse.y - this.followerPos.y;
            
            // Apply spring force
            this.velocity.x += dx * this.spring;
            this.velocity.y += dy * this.spring;
            
            // Apply friction
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            
            // Update position
            this.followerPos.x += this.velocity.x;
            this.followerPos.y += this.velocity.y;
            
            // Update cursor elements
            this.cursor.style.left = this.mouse.x + 'px';
            this.cursor.style.top = this.mouse.y + 'px';
            
            this.follower.style.left = this.followerPos.x + 'px';
            this.follower.style.top = this.followerPos.y + 'px';
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize physics cursor on desktop
if (window.innerWidth > 768) {
    const physicsCursor = new PhysicsCursor();
}

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

    // Format file size
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate password
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
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 
                        type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                        type === 'warning' ? 'rgba(245, 158, 11, 0.9)' : 
                        'rgba(99, 102, 241, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 400px;
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

    // Loading spinner
    showLoading: (container, message = 'Loading...') => {
        const loading = document.createElement('div');
        loading.className = 'loading-spinner';
        loading.innerHTML = `
            <div class="spinner"></div>
            <p class="loading-text">${message}</p>
        `;
        
        loading.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            color: white;
        `;
        
        const spinner = loading.querySelector('.spinner');
        spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        `;
        
        const text = loading.querySelector('.loading-text');
        text.style.cssText = `
            font-size: 1rem;
            opacity: 0.9;
        `;
        
        container.style.position = 'relative';
        container.appendChild(loading);
        
        return loading;
    },

    hideLoading: (loading) => {
        if (loading && loading.parentNode) {
            loading.parentNode.removeChild(loading);
        }
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
        baseURL: 'https://api.momnt.com', // Replace with your actual API URL

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

// --- Advanced Animations and Effects ---

// 1. 3D Tilt/Parallax Effect for [data-tilt]
function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      el.style.transform = `perspective(800px) rotateY(${-dx * 12}deg) rotateX(${dy * 12}deg) scale(1.04)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// 2. Glitch Text Animation
function initGlitchText() {
  document.querySelectorAll('.glitch').forEach(el => {
    if (!el.hasAttribute('data-text')) {
      el.setAttribute('data-text', el.textContent.trim());
    }
  });
}

// 3. Scroll-triggered Entrance Animations
function initScrollAnimate() {
  const observer = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// 4. Animated Particles Background
function initParticlesBG() {
  const canvas = document.getElementById('mainParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;
  let particles = Array.from({length: 64}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1.5 + Math.random() * 2.5,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    hue: 200 + Math.random() * 100
  }));
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.shadowColor = `hsl(${p.hue}, 100%, 70%)`;
      ctx.shadowBlur = 16;
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, 0.8)`;
      ctx.fill();
      ctx.restore();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
  });
}

// 5. Initialize all effects on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  init3DTilt();
  initGlitchText();
  initScrollAnimate();
  initParticlesBG();
}); 