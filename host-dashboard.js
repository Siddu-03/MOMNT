// ===== DASHBOARD JAVASCRIPT - MOMNT HOST DASHBOARD =====
// Modern, futuristic event management system with smooth animations and interactions

// ===== GLOBAL VARIABLES AND STATE =====
const dashboardState = {
    currentSection: 'dashboard',
    hostName: 'Sarah Johnson',
    events: [
        {
            id: 1,
            name: 'Sarah & Mike\'s Wedding',
            date: '2024-06-15',
            photos: 247,
            guests: 85,
            status: 'active'
        },
        {
            id: 2,
            name: 'Johnson Family Reunion',
            date: '2024-07-22',
            photos: 156,
            guests: 32,
            status: 'active'
        },
        {
            id: 3,
            name: 'Corporate Summer Party',
            date: '2024-08-10',
            photos: 89,
            guests: 45,
            status: 'completed'
        },
        {
            id: 4,
            name: 'Baby Shower Celebration',
            date: '2024-09-05',
            photos: 134,
            guests: 28,
            status: 'active'
        },
        {
            id: 5,
            name: 'Graduation Party',
            date: '2024-05-20',
            photos: 198,
            guests: 67,
            status: 'completed'
        },
        {
            id: 6,
            name: 'Anniversary Dinner',
            date: '2024-04-14',
            photos: 76,
            guests: 24,
            status: 'completed'
        }
    ],
    isLoading: false,
    currentTheme: 'dark',
    animationSpeed: 'normal'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * Initialize the dashboard with loading animation and setup
 */
function initializeDashboard() {
    // Show loading screen
    showLoadingScreen();
    
    // Simulate loading time for smooth transition
    setTimeout(() => {
        hideLoadingScreen();
        setupEventListeners();
        populateEventCards();
        updateWelcomeMessage();
        setupAnimations();
        initializeResponsiveFeatures();
        loadUserPreferences();
    }, 1500);
}

/**
 * Show loading screen with animation
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    loadingScreen.style.display = 'flex';
}

/**
 * Hide loading screen and show dashboard
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    const dashboard = document.getElementById('dashboard');
    
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        dashboard.classList.add('loaded');
    }, 500);
}

/**
 * Setup all event listeners for interactive elements
 */
function setupEventListeners() {
    // Navigation items click handlers
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });
    
    // Form submission handler
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventFormSubmit);
    }
    
    // Mobile navigation toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.querySelector('.mobile-nav-toggle');
        
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
    
    // Floating button pulse animation
    const floatingBtn = document.querySelector('.floating-btn');
    if (floatingBtn) {
        floatingBtn.addEventListener('mouseenter', () => {
            floatingBtn.style.animationPlayState = 'paused';
        });
        
        floatingBtn.addEventListener('mouseleave', () => {
            floatingBtn.style.animationPlayState = 'running';
        });
    }
    
    // Add window resize listener
    window.addEventListener('resize', handleResize);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Add settings form listeners
    setupSettingsListeners();
}

/**
 * Switch between different dashboard sections with smooth transitions
 * @param {string} sectionName - The name of the section to switch to
 */
function switchSection(sectionName) {
    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Hide current section
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) {
        currentSection.style.opacity = '0';
        currentSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            currentSection.classList.remove('active');
            showNewSection(sectionName);
        }, 300);
    } else {
        showNewSection(sectionName);
    }
    
    // Update current section state
    dashboardState.currentSection = sectionName;
    
    // Close mobile nav if open
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    
    // Update page title
    updatePageTitle(sectionName);
}

/**
 * Show the new section with smooth animation
 * @param {string} sectionName - The name of the section to show
 */
function showNewSection(sectionName) {
    const newSection = document.getElementById(`${sectionName}-section`);
    if (newSection) {
        newSection.classList.add('active');
        newSection.style.opacity = '0';
        newSection.style.transform = 'translateY(20px)';
        
        // Trigger reflow
        newSection.offsetHeight;
        
        setTimeout(() => {
            newSection.style.opacity = '1';
            newSection.style.transform = 'translateY(0)';
        }, 50);
        
        // Load section-specific content
        loadSectionContent(sectionName);
    }
}

/**
 * Toggle mobile navigation with smooth animation
 */
function toggleMobileNav() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    sidebar.classList.toggle('open');
    toggle.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = toggle.querySelectorAll('span');
    if (toggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

/**
 * Populate event cards in the dashboard and events sections
 */
function populateEventCards() {
    const recentEventsGrid = document.getElementById('events-grid');
    const allEventsGrid = document.getElementById('all-events-grid');
    
    // Show recent events (last 3) on dashboard
    if (recentEventsGrid) {
        const recentEvents = dashboardState.events.slice(0, 3);
        recentEventsGrid.innerHTML = '';
        recentEvents.forEach((event, index) => {
            const eventCard = createEventCard(event, index * 100);
            recentEventsGrid.appendChild(eventCard);
        });
    }
    
    // Show all events on events page
    if (allEventsGrid) {
        allEventsGrid.innerHTML = '';
        dashboardState.events.forEach((event, index) => {
            const eventCard = createEventCard(event, index * 50);
            allEventsGrid.appendChild(eventCard);
        });
    }
    
    // Update dashboard stats
    updateDashboardStats();
}

/**
 * Create an animated event card element
 * @param {Object} event - Event data object
 * @param {number} delay - Animation delay in milliseconds
 * @returns {HTMLElement} - The created event card element
 */
function createEventCard(event, delay = 0) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    // Format date for display
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Determine status color and text
    const statusColor = event.status === 'active' ? '#4facfe' : '#a8edea';
    const statusText = event.status === 'active' ? 'Active' : 'Completed';
    
    card.innerHTML = `
        <div class="event-header">
            <div>
                <h3 class="event-title">${event.name}</h3>
                <p class="event-date">${formattedDate}</p>
                <span class="event-status" style="color: ${statusColor}; font-size: 0.8rem; font-weight: 600;">
                    ● ${statusText}
                </span>
            </div>
            <div class="event-actions">
                <button class="action-btn" onclick="editEvent(${event.id})" title="Edit Event">
                    ✏️
                </button>
                <button class="action-btn" onclick="shareEvent(${event.id})" title="Share Event">
                    📤
                </button>
            </div>
        </div>
        
        <div class="event-stats">
            <div class="stat">
                <span class="stat-value">${event.photos}</span>
                <span class="stat-label">Photos</span>
            </div>
            <div class="stat">
                <span class="stat-value">${event.guests}</span>
                <span class="stat-label">Guests</span>
            </div>
            <div class="stat">
                <span class="stat-value">${Math.round(event.photos / event.guests * 10) / 10}</span>
                <span class="stat-label">Avg/Guest</span>
            </div>
        </div>
        
        <div class="event-actions-bottom">
            <button class="view-album-btn" onclick="viewAlbum(${event.id})">
                View Album
            </button>
            <button class="edit-btn" onclick="editEvent(${event.id})">
                Edit
            </button>
        </div>
    `;
    
    // Add click handler for card selection
    card.addEventListener('click', function(e) {
        if (!e.target.closest('button')) {
            selectEventCard(this);
        }
    });
    
    // Animate card appearance
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, delay);
    
    return card;
}

/**
 * Update welcome message with current host name
 */
function updateWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${dashboardState.hostName}`;
    }
}

/**
 * Setup various animations and interactive effects
 */
function setupAnimations() {
    // Animate stat cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate stat numbers
                if (entry.target.classList.contains('stat-card')) {
                    animateStatNumber(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => observer.observe(card));
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add parallax effect to header
    setupParallaxEffect();
}

/**
 * Animate stat numbers with counting effect
 * @param {HTMLElement} statCard - The stat card element
 */
function animateStatNumber(statCard) {
    const statValue = statCard.querySelector('.stat-info h3');
    const finalValue = parseInt(statValue.textContent.replace(/,/g, ''));
    const duration = 1000;
    const steps = 60;
    const increment = finalValue / steps;
    let currentValue = 0;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        
        // Format number with commas
        statValue.textContent = Math.floor(currentValue).toLocaleString();
    }, duration / steps);
}

/**
 * Handle event form submission with validation and animation
 * @param {Event} e - Form submit event
 */
function handleEventFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const eventData = {
        name: formData.get('event-name') || document.getElementById('event-name').value,
        date: formData.get('event-date') || document.getElementById('event-date').value,
        description: formData.get('event-description') || document.getElementById('event-description').value
    };
    
    // Validate form data
    if (!eventData.name || !eventData.date) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Event date cannot be in the past', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.create-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Create new event
        const newEvent = {
            id: dashboardState.events.length + 1,
            name: eventData.name,
            date: eventData.date,
            photos: 0,
            guests: 0,
            status: 'active',
            description: eventData.description
        };
        
        dashboardState.events.unshift(newEvent);
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show success notification
        showNotification('Event created successfully!', 'success');
        
        // Refresh event cards
        populateEventCards();
        
        // Switch to events section
        setTimeout(() => {
            switchSection('events');
        }, 1000);
        
    }, 1500);
}

/**
 * Show floating notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// ===== EVENT HANDLERS =====

/**
 * Handle logout button click
 */
function handleLogout() {
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
        showNotification('Logging out...', 'info');
        
        // Add logout animation
        const dashboard = document.getElementById('dashboard');
        dashboard.style.opacity = '0';
        dashboard.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // In a real app, this would redirect to login page
            window.location.href = 'login.html';
        }, 1000);
    }
}

/**
 * View album for a specific event
 * @param {number} eventId - The ID of the event
 */
function viewAlbum(eventId) {
    const event = dashboardState.events.find(e => e.id === eventId);
    if (event) {
        showNotification(`Opening album for "${event.name}"`, 'info');
        // In a real app, this would navigate to the album page
        setTimeout(() => {
            console.log(`Navigating to album for event ${eventId}`);
            // window.location.href = `album.html?eventId=${eventId}`;
        }, 1000);
    }
}

/**
 * Edit event details
 * @param {number} eventId - The ID of the event to edit
 */
function editEvent(eventId) {
    const event = dashboardState.events.find(e => e.id === eventId);
    if (event) {
        // Pre-populate form with event data
        document.getElementById('event-name').value = event.name;
        document.getElementById('event-date').value = event.date;
        document.getElementById('event-description').value = event.description || '';
        
        // Switch to create section for editing
        switchSection('create');
        
        // Update form title
        const sectionHeader = document.querySelector('#create-section .section-header h2');
        sectionHeader.textContent = 'Edit Event';
        
        // Update button text
        const submitBtn = document.querySelector('#create-section .create-btn');
        submitBtn.textContent = 'Update Event';
        
        showNotification(`Editing "${event.name}"`, 'info');
    }
}

/**
 * Share event with guests
 * @param {number} eventId - The ID of the event to share
 */
function shareEvent(eventId) {
    const event = dashboardState.events.find(e => e.id === eventId);
    if (event) {
        // Create share URL
        const shareUrl = `${window.location.origin}/event/${eventId}`;
        
        // Try to use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: event.name,
                text: `Join my event: ${event.name}`,
                url: shareUrl
            }).then(() => {
                showNotification('Event shared successfully!', 'success');
            }).catch(() => {
                fallbackShare(shareUrl, event.name);
            });
        } else {
            fallbackShare(shareUrl, event.name);
        }
    }
}

/**
 * Fallback share method using clipboard
 * @param {string} url - URL to share
 * @param {string} eventName - Name of the event
 */
function fallbackShare(url, eventName) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification(`Link copied to clipboard for "${eventName}"`, 'success');
    }).catch(() => {
        showNotification('Unable to copy link', 'error');
    });
}

/**
 * Show create event section (called by floating button)
 */
function showCreateSection() {
    switchSection('create');
}

/**
 * Select/highlight an event card
 * @param {HTMLElement} card - The event card element
 */
function selectEventCard(card) {
    // Remove selection from other cards
    document.querySelectorAll('.event-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    
    // Add ripple effect
    createRippleEffect(card);
}

// ===== UTILITY FUNCTIONS =====

/**
 * Format date for display
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Generate random gradient for dynamic styling
 * @returns {string} - CSS gradient string
 */
function generateRandomGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)'
    ];
    
    return gradients[Math.floor(Math.random() * gradients.length)];
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Create ripple effect on element click
 * @param {HTMLElement} element - Element to add ripple effect to
 */
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: 50%;
        top: 50%;
        margin-left: ${-size / 2}px;
        margin-top: ${-size / 2}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats() {
    const totalEvents = dashboardState.events.length;
    const totalPhotos = dashboardState.events.reduce((sum, event) => sum + event.photos, 0);
    const totalGuests = dashboardState.events.reduce((sum, event) => sum + event.guests, 0);
    const avgRating = 4.9; // This would come from user feedback in a real app
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-info h3').textContent = totalEvents;
        statCards[1].querySelector('.stat-info h3').textContent = totalPhotos.toLocaleString();
        statCards[2].querySelector('.stat-info h3').textContent = totalGuests;
        statCards[3].querySelector('.stat-info h3').textContent = avgRating;
    }
}

/**
 * Update page title based on current section
 * @param {string} sectionName - Current section name
 */
function updatePageTitle(sectionName) {
    const titles = {
        dashboard: 'Dashboard',
        events: 'My Events',
        create: 'Create Event',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    
    document.title = `MOMNT Host - ${titles[sectionName] || 'Dashboard'}`;
}

/**
 * Load section-specific content
 * @param {string} sectionName - Section to load content for
 */
function loadSectionContent(sectionName) {
    switch (sectionName) {
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'settings':
            loadUserSettings();
            break;
        case 'events':
            // Events are already loaded
            break;
        default:
            break;
    }
}

/**
 * Load analytics data and charts
 */
function loadAnalyticsData() {
    // Simulate loading analytics data
    const analyticsCard = document.querySelector('.analytics-card .chart-placeholder');
    if (analyticsCard) {
        analyticsCard.innerHTML = `
            <div class="chart-container">
                <div class="chart-bar" style="height: 60%; background: #4facfe;">
                    <span class="chart-value">247</span>
                </div>
                <div class="chart-bar" style="height: 80%; background: #00f2fe;">
                    <span class="chart-value">320</span>
                </div>
                <div class="chart-bar" style="height: 45%; background: #4facfe;">
                    <span class="chart-value">180</span>
                </div>
                <div class="chart-bar" style="height: 70%; background: #00f2fe;">
                    <span class="chart-value">280</span>
                </div>
            </div>
        `;
    }
}

/**
 * Load user settings
 */
function loadUserSettings() {
    // Load saved user preferences
    const hostName = localStorage.getItem('hostName') || dashboardState.hostName;
    const hostEmail = localStorage.getItem('hostEmail') || 'sarah@example.com';
    
    const nameInput = document.querySelector('input[value="Sarah Johnson"]');
    const emailInput = document.querySelector('input[value="sarah@example.com"]');
    
    if (nameInput) nameInput.value = hostName;
    if (emailInput) emailInput.value = hostEmail;
}

/**
 * Setup settings form listeners
 */
function setupSettingsListeners() {
    // Settings form inputs
    const settingsInputs = document.querySelectorAll('#settings-section input');
    settingsInputs.forEach(input => {
        input.addEventListener('change', saveUserSettings);
    });
}

/**
 * Save user settings to localStorage
 */
function saveUserSettings() {
    const nameInput = document.querySelector('#settings-section input[type="text"]');
    const emailInput = document.querySelector('#settings-section input[type="email"]');
    
    if (nameInput) {
        localStorage.setItem('hostName', nameInput.value);
        dashboardState.hostName = nameInput.value;
        updateWelcomeMessage();
    }
    
    if (emailInput) {
        localStorage.setItem('hostEmail', emailInput.value);
    }
    
    showNotification('Settings saved successfully!', 'success');
}

/**
 * Load user preferences from localStorage
 */
function loadUserPreferences() {
    const savedTheme = localStorage.getItem('theme');
    const savedAnimationSpeed = localStorage.getItem('animationSpeed');
    
    if (savedTheme) {
        dashboardState.currentTheme = savedTheme;
        document.body.classList.add(`theme-${savedTheme}`);
    }
    
    if (savedAnimationSpeed) {
        dashboardState.animationSpeed = savedAnimationSpeed;
        document.body.classList.add(`animation-${savedAnimationSpeed}`);
    }
}
/**
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardShortcuts(e) {
    // Only handle shortcuts when not typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch (e.key) {
        case '1':
            switchSection('dashboard');
            break;
        case '2':
            switchSection('events');
            break;
        case '3':
            switchSection('create');
            break;
        case '4':
            switchSection('analytics');
            break;
        case '5':
            switchSection('settings');
            break;
        case 'Escape':
            // Close mobile nav if open
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('open');
            break;
        case 'n':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                switchSection('create');
            }
            break;
        default:
            break;
    }
}

/**
 * Handle window resize events
 */
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    
    // Close mobile nav on desktop size
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
    
    // Update chart dimensions if analytics section is active
    if (dashboardState.currentSection === 'analytics') {
        updateChartDimensions();
    }
}

/**
 * Update chart dimensions for responsive design
 */
function updateChartDimensions() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        // Recalculate bar dimensions based on container size
        const container = bar.parentElement;
        if (container) {
            const containerWidth = container.offsetWidth;
            bar.style.width = `${containerWidth / chartBars.length - 10}px`;
        }
    });
}

/**
 * Initialize responsive features
 */
function initializeResponsiveFeatures() {
    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch gestures
        setupTouchGestures();
    }
    
    // Initialize intersection observers for animations
    setupScrollAnimations();
    
    // Setup responsive navigation
    setupResponsiveNavigation();
}

/**
 * Setup touch gestures for mobile interaction
 */
function setupTouchGestures() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Detect horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - open mobile nav
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.add('open');
            } else {
                // Swipe right - close mobile nav
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.remove('open');
            }
        }
        
        // Reset values
        startX = 0;
        startY = 0;
    });
}

/**
 * Setup scroll-based animations
 */
function setupScrollAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.event-card, .stat-card, .analytics-card');
    animateElements.forEach(el => animationObserver.observe(el));
}

/**
 * Setup responsive navigation behavior
 */
function setupResponsiveNavigation() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleMediaQueryChange(e) {
        const sidebar = document.getElementById('sidebar');
        
        if (!e.matches) {
            // Desktop view - ensure sidebar is visible
            sidebar.classList.remove('open');
        }
    }
    
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);
}

/**
 * Setup parallax effect for header
 */
function setupParallaxEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', debounce(() => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (header) {
            header.style.transform = `translateY(${parallax}px)`;
        }
    }, 10));
}

/**
 * Add CSS animations dynamically
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        .chart-container {
            display: flex;
            align-items: end;
            justify-content: space-around;
            height: 200px;
            padding: 1rem;
            gap: 0.5rem;
        }
        
        .chart-bar {
            position: relative;
            background: linear-gradient(to top, #4facfe, #00f2fe);
            border-radius: 4px 4px 0 0;
            min-width: 40px;
            transition: all 0.3s ease;
            display: flex;
            align-items: end;
            justify-content: center;
            padding-bottom: 0.5rem;
        }
        
        .chart-bar:hover {
            filter: brightness(1.1);
            transform: scale(1.05);
        }
        
        .chart-value {
            color: white;
            font-size: 0.8rem;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 768px) {
            .chart-container {
                height: 150px;
            }
            
            .chart-bar {
                min-width: 30px;
            }
            
            .chart-value {
                font-size: 0.7rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Initialize theme system
 */
function initializeThemeSystem() {
    // Check for system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

/**
 * Apply theme to the dashboard
 * @param {string} theme - Theme name ('light' or 'dark')
 */
function applyTheme(theme) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    dashboardState.currentTheme = theme;
    localStorage.setItem('theme', theme);
}

/**
 * Performance monitoring and optimization
 */
function initializePerformanceMonitoring() {
    // Monitor frame rate
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Log performance issues
            if (fps < 30) {
                console.warn('Low FPS detected:', fps);
                // Reduce animation complexity if needed
                document.body.classList.add('reduce-animations');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
}

/**
 * Error handling and logging
 */
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Dashboard Error:', e.error);
        showNotification('An error occurred. Please refresh the page.', 'error');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        showNotification('Something went wrong. Please try again.', 'error');
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    addDynamicStyles();
    initializeThemeSystem();
    initializePerformanceMonitoring();
    setupErrorHandling();
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        dashboardState,
        switchSection,
        createEventCard,
        showNotification,
        formatDate,
        debounce
    };
}