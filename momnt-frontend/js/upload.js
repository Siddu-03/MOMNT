// Upload JavaScript
// Handles photo upload functionality

document.addEventListener('DOMContentLoaded', () => {
    const { utils, dom, uploadUtils } = window.MOMNT;

    // Get elements
    const uploadZone = dom.get('#upload-zone');
    const fileInput = dom.get('#file-input');
    const uploadForm = dom.get('#upload-form');
    const uploadPreview = dom.get('#upload-preview');
    const previewGrid = dom.get('#preview-grid');
    const uploadProgress = dom.get('#upload-progress');
    const progressFill = dom.get('#progress-fill');
    const progressText = dom.get('#progress-text');
    const uploadSuccess = dom.get('#upload-success');
    const uploadPhotosBtn = dom.get('#upload-photos');
    const clearSelectionBtn = dom.get('#clear-selection');
    const uploadMoreBtn = dom.get('#upload-more');
    const eventCodeInput = dom.get('#event-code');
    const joinEventBtn = dom.get('#join-event');

    let selectedFiles = [];
    let currentEventId = null;

    // File input change handler
    if (fileInput) {
        dom.on(fileInput, 'change', handleFileSelection);
    }

    // Upload zone click handler
    if (uploadZone) {
        dom.on(uploadZone, 'click', () => {
            fileInput.click();
        });
    }

    // Drag and drop functionality
    if (uploadZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dom.on(uploadZone, eventName, preventDefaults);
            dom.on(document.body, eventName, preventDefaults);
        });

        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dom.on(uploadZone, eventName, highlight);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dom.on(uploadZone, eventName, unhighlight);
        });

        // Handle dropped files
        dom.on(uploadZone, 'drop', handleDrop);
    }

    // Join event button
    if (joinEventBtn) {
        dom.on(joinEventBtn, 'click', handleJoinEvent);
    }

    // Upload photos button
    if (uploadPhotosBtn) {
        dom.on(uploadPhotosBtn, 'click', handleUploadPhotos);
    }

    // Clear selection button
    if (clearSelectionBtn) {
        dom.on(clearSelectionBtn, 'click', clearSelection);
    }

    // Upload more button
    if (uploadMoreBtn) {
        dom.on(uploadMoreBtn, 'click', () => {
            dom.hide(uploadSuccess);
            dom.show(uploadForm);
            clearSelection();
        });
    }

    // Event code input enter key
    if (eventCodeInput) {
        dom.on(eventCodeInput, 'keypress', (e) => {
            if (e.key === 'Enter') {
                handleJoinEvent();
            }
        });
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dom.addClass(uploadZone, 'dragover');
    }

    function unhighlight(e) {
        dom.removeClass(uploadZone, 'dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelection(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (!currentEventId) {
            utils.showNotification('Please join an event first', 'error');
            return;
        }

        const validFiles = [];
        const errors = [];

        Array.from(files).forEach(file => {
            const validation = uploadUtils.validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        });

        if (errors.length > 0) {
            utils.showNotification(errors.join('\n'), 'error');
        }

        if (validFiles.length > 0) {
            selectedFiles = [...selectedFiles, ...validFiles];
            updatePreview();
            dom.show(uploadPreview);
        }
    }

    function updatePreview() {
        if (!previewGrid) return;

        previewGrid.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const previewItem = dom.create('div', {
                className: 'preview-item'
            });

            const img = dom.create('img', {
                src: URL.createObjectURL(file),
                alt: file.name
            });

            const removeBtn = dom.create('button', {
                className: 'remove-btn',
                textContent: '×'
            });

            dom.on(removeBtn, 'click', () => {
                selectedFiles.splice(index, 1);
                updatePreview();
                if (selectedFiles.length === 0) {
                    dom.hide(uploadPreview);
                }
            });

            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            previewGrid.appendChild(previewItem);
        });
    }

    function clearSelection() {
        selectedFiles = [];
        updatePreview();
        dom.hide(uploadPreview);
        fileInput.value = '';
    }

    async function handleJoinEvent() {
        const eventCode = eventCodeInput.value.trim().toUpperCase();

        if (!eventCode) {
            utils.showNotification('Please enter an event code', 'error');
            return;
        }

        if (eventCode.length !== 6) {
            utils.showNotification('Event code must be 6 characters', 'error');
            return;
        }

        // Show loading state
        const originalText = joinEventBtn.textContent;
        joinEventBtn.textContent = 'Joining...';
        joinEventBtn.disabled = true;

        try {
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock event data - replace with actual API response
            const eventData = {
                id: eventCode,
                name: `Event ${eventCode}`,
                description: 'A wonderful event for sharing memories',
                code: eventCode
            };

            currentEventId = eventData.id;
            
            // Update UI
            dom.get('#event-name').textContent = eventData.name;
            dom.get('#event-description').textContent = eventData.description;
            
            dom.show(uploadForm);
            dom.hide(dom.get('.qr-section'));
            dom.hide(dom.get('.manual-entry'));

            utils.showNotification(`Joined event: ${eventData.name}`, 'success');

        } catch (error) {
            console.error('Join event error:', error);
            utils.showNotification('Failed to join event. Please check the code and try again.', 'error');
        } finally {
            joinEventBtn.textContent = originalText;
            joinEventBtn.disabled = false;
        }
    }

    async function handleUploadPhotos() {
        if (selectedFiles.length === 0) {
            utils.showNotification('Please select photos to upload', 'error');
            return;
        }

        if (!currentEventId) {
            utils.showNotification('Please join an event first', 'error');
            return;
        }

        // Show progress
        dom.hide(uploadPreview);
        dom.show(uploadProgress);
        
        const uploadBtn = dom.get('#upload-photos');
        const originalText = uploadBtn.textContent;
        uploadBtn.disabled = true;

        try {
            // Simulate upload progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 90) progress = 90;
                
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `Uploading photos... ${Math.round(progress)}%`;
            }, 200);

            // Simulate API call - replace with actual upload
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            clearInterval(progressInterval);
            progressFill.style.width = '100%';
            progressText.textContent = 'Upload complete!';

            // Show success
            setTimeout(() => {
                dom.hide(uploadProgress);
                dom.show(uploadSuccess);
                clearSelection();
            }, 500);

            utils.showNotification('Photos uploaded successfully!', 'success');

        } catch (error) {
            console.error('Upload error:', error);
            utils.showNotification('Upload failed. Please try again.', 'error');
            
            dom.hide(uploadProgress);
            dom.show(uploadPreview);
        } finally {
            uploadBtn.textContent = originalText;
            uploadBtn.disabled = false;
        }
    }

    // Add keyboard navigation
    if (uploadZone) {
        dom.on(uploadZone, 'keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });
    }

    // Add accessibility attributes
    if (uploadZone) {
        uploadZone.setAttribute('tabindex', '0');
        uploadZone.setAttribute('role', 'button');
        uploadZone.setAttribute('aria-label', 'Upload photos by clicking or dragging files here');
    }

    // Add file size display
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Add preview styles
    const style = document.createElement('style');
    style.textContent = `
        .preview-item {
            position: relative;
            aspect-ratio: 1;
            border-radius: 0.5rem;
            overflow: hidden;
            background: var(--gray-800);
            transition: transform 0.3s ease;
        }

        .preview-item:hover {
            transform: scale(1.05);
        }

        .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .remove-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }

        .remove-btn:hover {
            background: rgba(239, 68, 68, 0.8);
            transform: scale(1.1);
        }

        .upload-zone {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .upload-zone.dragover {
            border-color: var(--primary-color);
            background: rgba(99, 102, 241, 0.1);
            transform: scale(1.02);
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 9999px;
            overflow: hidden;
            margin-bottom: 1rem;
        }

        .progress-fill {
            height: 100%;
            background: var(--gradient-primary);
            border-radius: 9999px;
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            width: 0%;
        }

        .upload-success {
            text-align: center;
            padding: 2rem;
        }

        .success-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: bounce 1s ease-in-out;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(style);
}); 