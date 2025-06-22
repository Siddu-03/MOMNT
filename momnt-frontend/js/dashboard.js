// Dashboard JavaScript
// Handles event management and gallery functionality

document.addEventListener('DOMContentLoaded', () => {
    const { utils, dom, auth, eventUtils } = window.MOMNT;

    // Get elements
    const createEventBtn = dom.get('#create-event-btn');
    const createEventModal = dom.get('#create-event-modal');
    const closeModalBtn = dom.get('#close-modal');
    const cancelCreateBtn = dom.get('#cancel-create');
    const createEventForm = dom.get('#create-event-form');
    const eventsGrid = dom.get('#events-grid');
    const activeEventDashboard = dom.get('#active-event-dashboard');
    const currentEventName = dom.get('#current-event-name');
    const currentEventDescription = dom.get('#current-event-description');
    const totalPhotos = dom.get('#total-photos');
    const totalUploads = dom.get('#total-uploads');
    const activeUsers = dom.get('#active-users');
    const qrCode = dom.get('#qr-code');
    const galleryGrid = dom.get('#gallery-grid');
    const refreshGalleryBtn = dom.get('#refresh-gallery');
    const downloadAllBtn = dom.get('#download-all');
    const shareEventBtn = dom.get('#share-event');
    const downloadQrBtn = dom.get('#download-qr');
    const closeEventBtn = dom.get('#close-event');
    const photoModal = dom.get('#photo-modal');
    const closePhotoModalBtn = dom.get('#close-photo-modal');
    const modalPhoto = dom.get('#modal-photo');
    const photoUploader = dom.get('#photo-uploader');
    const photoTime = dom.get('#photo-time');
    const downloadPhotoBtn = dom.get('#download-photo');
    const deletePhotoBtn = dom.get('#delete-photo');

    let events = [];
    let currentEvent = null;
    let photos = [];

    // Check authentication
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    initDashboard();

    // Event listeners
    if (createEventBtn) {
        dom.on(createEventBtn, 'click', showCreateEventModal);
    }

    if (closeModalBtn) {
        dom.on(closeModalBtn, 'click', hideCreateEventModal);
    }

    if (cancelCreateBtn) {
        dom.on(cancelCreateBtn, 'click', hideCreateEventModal);
    }

    if (createEventForm) {
        dom.on(createEventForm, 'submit', handleCreateEvent);
    }

    if (refreshGalleryBtn) {
        dom.on(refreshGalleryBtn, 'click', refreshGallery);
    }

    if (downloadAllBtn) {
        dom.on(downloadAllBtn, 'click', downloadAllPhotos);
    }

    if (shareEventBtn) {
        dom.on(shareEventBtn, 'click', shareEvent);
    }

    if (downloadQrBtn) {
        dom.on(downloadQrBtn, 'click', downloadQrCode);
    }

    if (closeEventBtn) {
        dom.on(closeEventBtn, 'click', closeEvent);
    }

    if (closePhotoModalBtn) {
        dom.on(closePhotoModalBtn, 'click', hidePhotoModal);
    }

    if (downloadPhotoBtn) {
        dom.on(downloadPhotoBtn, 'click', downloadPhoto);
    }

    if (deletePhotoBtn) {
        dom.on(deletePhotoBtn, 'click', deletePhoto);
    }

    // Close modals when clicking outside
    if (createEventModal) {
        dom.on(createEventModal, 'click', (e) => {
            if (e.target === createEventModal) {
                hideCreateEventModal();
            }
        });
    }

    if (photoModal) {
        dom.on(photoModal, 'click', (e) => {
            if (e.target === photoModal) {
                hidePhotoModal();
            }
        });
    }

    async function initDashboard() {
        try {
            await loadEvents();
            renderEvents();
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            utils.showNotification('Failed to load events', 'error');
        }
    }

    async function loadEvents() {
        try {
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock events data - replace with actual API response
            events = [
                {
                    id: 'EVT001',
                    name: 'Summer Party 2024',
                    description: 'Annual summer celebration with friends and family',
                    date: '2024-07-15',
                    location: 'Central Park',
                    photoCount: 45,
                    uploadCount: 12,
                    activeUsers: 8,
                    status: 'active'
                },
                {
                    id: 'EVT002',
                    name: 'Birthday Bash',
                    description: 'Sarah\'s 25th birthday party',
                    date: '2024-06-20',
                    location: 'Downtown Club',
                    photoCount: 23,
                    uploadCount: 5,
                    activeUsers: 3,
                    status: 'active'
                },
                {
                    id: 'EVT003',
                    name: 'Wedding Reception',
                    description: 'John and Jane\'s wedding celebration',
                    date: '2024-05-10',
                    location: 'Grand Hotel',
                    photoCount: 156,
                    uploadCount: 25,
                    activeUsers: 15,
                    status: 'completed'
                }
            ];
        } catch (error) {
            throw error;
        }
    }

    function renderEvents() {
        if (!eventsGrid) return;

        eventsGrid.innerHTML = '';

        if (events.length === 0) {
            const emptyState = dom.create('div', {
                className: 'empty-state',
                innerHTML: `
                    <div class="empty-icon">📸</div>
                    <h3>No events yet</h3>
                    <p>Create your first event to start collecting photos</p>
                    <button class="btn btn-primary" onclick="showCreateEventModal()">Create Event</button>
                `
            });
            eventsGrid.appendChild(emptyState);
            return;
        }

        events.forEach(event => {
            const eventCard = createEventCard(event);
            eventsGrid.appendChild(eventCard);
        });
    }

    function createEventCard(event) {
        const card = dom.create('div', {
            className: `event-card ${event.status === 'active' ? 'active' : ''}`,
            innerHTML: `
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div class="event-meta">
                    <span>${utils.formatDate(event.date)}</span>
                    <span>${event.location}</span>
                </div>
                <div class="event-stats">
                    <div class="event-stat">
                        <span class="number">${event.photoCount}</span>
                        <span class="label">Photos</span>
                    </div>
                    <div class="event-stat">
                        <span class="number">${event.uploadCount}</span>
                        <span class="label">Uploads</span>
                    </div>
                    <div class="event-stat">
                        <span class="number">${event.activeUsers}</span>
                        <span class="label">Users</span>
                    </div>
                </div>
            `
        });

        dom.on(card, 'click', () => {
            selectEvent(event);
        });

        return card;
    }

    function selectEvent(event) {
        currentEvent = event;
        
        // Update active event dashboard
        currentEventName.textContent = event.name;
        currentEventDescription.textContent = event.description;
        totalPhotos.textContent = event.photoCount;
        totalUploads.textContent = event.uploadCount;
        activeUsers.textContent = event.activeUsers;

        // Generate QR code
        generateQrCode(event.id);

        // Load photos
        loadPhotos(event.id);

        // Show active event dashboard
        dom.show(activeEventDashboard);

        // Update active card
        dom.getAll('.event-card').forEach(card => {
            dom.removeClass(card, 'active');
        });
        
        const activeCard = eventsGrid.querySelector(`[data-event-id="${event.id}"]`);
        if (activeCard) {
            dom.addClass(activeCard, 'active');
        }
    }

    function generateQrCode(eventId) {
        if (!qrCode) return;

        // Simple QR code generation - replace with actual QR library
        const qrData = `https://momnt.app/upload?event=${eventId}`;
        
        // For demo purposes, create a simple QR representation
        qrCode.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: repeating-conic-gradient(
                    #000 0deg 90deg,
                    #fff 90deg 180deg
                ) 50% 50% / 20% 20%;
                border-radius: 0.375rem;
            "></div>
        `;
    }

    async function loadPhotos(eventId) {
        try {
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock photos data - replace with actual API response
            photos = [
                {
                    id: '1',
                    url: 'https://picsum.photos/400/400?random=1',
                    uploader: 'Guest User',
                    uploadedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                    eventId: eventId
                },
                {
                    id: '2',
                    url: 'https://picsum.photos/400/400?random=2',
                    uploader: 'John Doe',
                    uploadedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                    eventId: eventId
                },
                {
                    id: '3',
                    url: 'https://picsum.photos/400/400?random=3',
                    uploader: 'Jane Smith',
                    uploadedAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
                    eventId: eventId
                }
            ];

            renderPhotos();
        } catch (error) {
            console.error('Failed to load photos:', error);
            utils.showNotification('Failed to load photos', 'error');
        }
    }

    function renderPhotos() {
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        if (photos.length === 0) {
            const emptyState = dom.create('div', {
                className: 'empty-gallery',
                innerHTML: `
                    <div class="empty-icon">📷</div>
                    <h3>No photos yet</h3>
                    <p>Photos will appear here when guests upload them</p>
                `
            });
            galleryGrid.appendChild(emptyState);
            return;
        }

        photos.forEach(photo => {
            const photoItem = createPhotoItem(photo);
            galleryGrid.appendChild(photoItem);
        });
    }

    function createPhotoItem(photo) {
        const item = dom.create('div', {
            className: 'gallery-item',
            innerHTML: `
                <img src="${photo.url}" alt="Event photo">
                <div class="overlay">
                    <div class="icon">👁️</div>
                </div>
            `
        });

        dom.on(item, 'click', () => {
            showPhotoModal(photo);
        });

        return item;
    }

    function showPhotoModal(photo) {
        if (!photoModal || !modalPhoto) return;

        modalPhoto.src = photo.url;
        photoUploader.textContent = photo.uploader;
        photoTime.textContent = utils.formatTime(photo.uploadedAt);

        dom.show(photoModal);
    }

    function hidePhotoModal() {
        if (photoModal) {
            dom.hide(photoModal);
        }
    }

    function showCreateEventModal() {
        if (createEventModal) {
            dom.show(createEventModal);
            createEventForm.reset();
        }
    }

    function hideCreateEventModal() {
        if (createEventModal) {
            dom.hide(createEventModal);
        }
    }

    async function handleCreateEvent(e) {
        e.preventDefault();

        const formData = new FormData(createEventForm);
        const eventData = {
            name: formData.get('eventName'),
            description: formData.get('eventDescription'),
            date: formData.get('eventDate'),
            location: formData.get('eventLocation')
        };

        // Validate inputs
        if (!eventData.name || !eventData.date) {
            utils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const submitBtn = createEventForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;

        try {
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock new event - replace with actual API response
            const newEvent = {
                id: 'EVT' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                ...eventData,
                photoCount: 0,
                uploadCount: 0,
                activeUsers: 0,
                status: 'active'
            };

            events.unshift(newEvent);
            renderEvents();
            selectEvent(newEvent);

            hideCreateEventModal();
            utils.showNotification('Event created successfully!', 'success');

        } catch (error) {
            console.error('Create event error:', error);
            utils.showNotification('Failed to create event', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async function refreshGallery() {
        if (!currentEvent) return;

        const btn = refreshGalleryBtn;
        const originalText = btn.textContent;
        btn.textContent = 'Refreshing...';
        btn.disabled = true;

        try {
            await loadPhotos(currentEvent.id);
            utils.showNotification('Gallery refreshed!', 'success');
        } catch (error) {
            utils.showNotification('Failed to refresh gallery', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    function downloadAllPhotos() {
        if (!currentEvent || photos.length === 0) {
            utils.showNotification('No photos to download', 'info');
            return;
        }

        utils.showNotification('Download functionality coming soon!', 'info');
    }

    function shareEvent() {
        if (!currentEvent) return;

        const shareUrl = `https://momnt.app/upload?event=${currentEvent.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: currentEvent.name,
                text: `Join my event: ${currentEvent.name}`,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                utils.showNotification('Event link copied to clipboard!', 'success');
            }).catch(() => {
                utils.showNotification('Failed to copy link', 'error');
            });
        }
    }

    function downloadQrCode() {
        if (!currentEvent) return;

        utils.showNotification('QR code download coming soon!', 'info');
    }

    function closeEvent() {
        if (!currentEvent) return;

        if (confirm(`Are you sure you want to close "${currentEvent.name}"? This action cannot be undone.`)) {
            currentEvent.status = 'completed';
            renderEvents();
            dom.hide(activeEventDashboard);
            currentEvent = null;
            utils.showNotification('Event closed successfully', 'success');
        }
    }

    function downloadPhoto() {
        if (!modalPhoto || !modalPhoto.src) return;

        const link = document.createElement('a');
        link.href = modalPhoto.src;
        link.download = `photo-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        utils.showNotification('Photo downloaded!', 'success');
    }

    function deletePhoto() {
        if (!modalPhoto || !modalPhoto.src) return;

        if (confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
            // Remove photo from array
            const photoIndex = photos.findIndex(p => p.url === modalPhoto.src);
            if (photoIndex > -1) {
                photos.splice(photoIndex, 1);
                renderPhotos();
                hidePhotoModal();
                utils.showNotification('Photo deleted successfully', 'success');
            }
        }
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--white);
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.7;
        }

        .empty-state h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .empty-state p {
            opacity: 0.8;
            margin-bottom: 1.5rem;
        }

        .empty-gallery {
            text-align: center;
            padding: 2rem;
            color: var(--white);
            grid-column: 1 / -1;
        }

        .empty-gallery .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.7;
        }

        .empty-gallery h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .empty-gallery p {
            opacity: 0.8;
        }

        .event-card[data-event-id] {
            cursor: pointer;
        }

        .event-card.active {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .gallery-item {
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .gallery-item:hover {
            transform: scale(1.05);
            z-index: 10;
        }

        .gallery-item .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .gallery-item:hover .overlay {
            opacity: 1;
        }

        .gallery-item .overlay .icon {
            font-size: 1.5rem;
            color: var(--white);
        }
    `;
    document.head.appendChild(style);
}); 