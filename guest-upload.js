/**
 * MOMNT Guest Upload JavaScript
 * Handles photo upload functionality with drag-and-drop support
 * and smooth UI interactions
 */

class PhotoUploader {
    constructor() {
        // Initialize DOM elements
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('fileInput');
        this.previewSection = document.getElementById('previewSection');
        this.previewGrid = document.getElementById('previewGrid');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.successToast = document.getElementById('successToast');
        
        // State management
        this.selectedFiles = [];
        this.maxFiles = 5;
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        this.isUploading = false;
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Check for drag and drop support
        this.checkDragDropSupport();
        
        console.log('MOMNT Photo Uploader initialized successfully');
    }
    
    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // File input change event
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drop zone click event
        this.dropZone.addEventListener('click', () => this.triggerFileInput());
        
        // Drop zone keyboard events
        this.dropZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.triggerFileInput();
            }
        });
        
        // Drag and drop events
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Upload button click event
        this.uploadBtn.addEventListener('click', () => this.handleUpload());
        
        // Toast click to dismiss
        this.successToast.addEventListener('click', () => this.hideToast());
        
        // Prevent default drag behaviors on document
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }
    
    /**
     * Check if browser supports drag and drop
     */
    checkDragDropSupport() {
        const div = document.createElement('div');
        const dragDropSupported = (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div));
        
        if (!dragDropSupported) {
            console.warn('Drag and drop not supported in this browser');
            // Could show a fallback message here if needed
        }
    }
    
    /**
     * Trigger the hidden file input
     */
    triggerFileInput() {
        if (!this.isUploading) {
            this.fileInput.click();
        }
    }
    
    /**
     * Handle file selection from input or drop
     */
    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.processFiles(files);
    }
    
    /**
     * Handle drag over event
     */
    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }
    
    /**
     * Handle drag enter event
     */
    handleDragEnter(event) {
        event.preventDefault();
        this.dropZone.classList.add('drag-over');
    }
    
    /**
     * Handle drag leave event
     */
    handleDragLeave(event) {
        event.preventDefault();
        // Only remove drag-over if leaving the drop zone entirely
        if (!this.dropZone.contains(event.relatedTarget)) {
            this.dropZone.classList.remove('drag-over');
        }
    }
    
    /**
     * Handle drop event
     */
    handleDrop(event) {
        event.preventDefault();
        this.dropZone.classList.remove('drag-over');
        
        const files = Array.from(event.dataTransfer.files);
        this.processFiles(files);
    }
    
    /**
     * Process and validate selected files
     */
    processFiles(files) {
        // Filter valid image files
        const validFiles = files.filter(file => {
            if (!this.allowedTypes.includes(file.type)) {
                this.showError(`${file.name} is not a supported format. Please use JPG, PNG, or JPEG.`);
                return false;
            }
            
            // Check file size (max 10MB per file)
            if (file.size > 10 * 1024 * 1024) {
                this.showError(`${file.name} is too large. Maximum file size is 10MB.`);
                return false;
            }
            
            return true;
        });
        
        // Check if adding these files would exceed the limit
        if (this.selectedFiles.length + validFiles.length > this.maxFiles) {
            const remaining = this.maxFiles - this.selectedFiles.length;
            this.showError(`You can only upload ${remaining} more photo(s). Maximum ${this.maxFiles} photos allowed.`);
            return;
        }
        
        // Add valid files to selection
        validFiles.forEach(file => {
            // Check for duplicates
            const isDuplicate = this.selectedFiles.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size
            );
            
            if (!isDuplicate) {
                this.selectedFiles.push(file);
            }
        });
        
        // Update UI
        this.updatePreview();
        this.resetFileInput();
    }
    
    /**
     * Reset the file input to allow selecting the same files again
     */
    resetFileInput() {
        this.fileInput.value = '';
    }
    
    /**
     * Update the preview section with selected files
     */
    updatePreview() {
        if (this.selectedFiles.length === 0) {
            this.previewSection.style.display = 'none';
            return;
        }
        
        // Show preview section
        this.previewSection.style.display = 'block';
        
        // Clear existing previews
        this.previewGrid.innerHTML = '';
        
        // Create preview for each file
        this.selectedFiles.forEach((file, index) => {
            this.createPreviewItem(file, index);
        });
        
        // Update upload button text
        const fileCount = this.selectedFiles.length;
        const btnText = this.uploadBtn.querySelector('.btn-text');
        btnText.textContent = `Upload ${fileCount} photo${fileCount > 1 ? 's' : ''} to MOMNT`;
    }
    
    /**
     * Create a preview item for a file
     */
    createPreviewItem(file, index) {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        // Create image element
        const img = document.createElement('img');
        img.className = 'preview-image';
        img.alt = `Preview of ${file.name}`;
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.title = 'Remove photo';
        removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFile(index);
        });
        
        // Read file and set image source
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Assemble preview item
        previewItem.appendChild(img);
        previewItem.appendChild(removeBtn);
        this.previewGrid.appendChild(previewItem);
    }
    
    /**
     * Remove a file from selection
     */
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updatePreview();
        
        // Add smooth removal animation
        const previewItems = this.previewGrid.querySelectorAll('.preview-item');
        if (previewItems[index]) {
            previewItems[index].style.animation = 'fadeOutScale 0.3s ease-out forwards';
            setTimeout(() => {
                this.updatePreview();
            }, 300);
        }
    }
    
    /**
     * Handle the upload process
     */
    async handleUpload() {
        if (this.selectedFiles.length === 0 || this.isUploading) {
            return;
        }
        
        this.isUploading = true;
        this.updateUploadButton(true);
        
        try {
            // Simulate upload process
            await this.simulateUpload();
            
            // Show success message
            this.showSuccessToast();
            
            // Reset the form
            this.resetForm();
            
        } catch (error) {
            console.error('Upload failed:', error);
            this.showError('Upload failed. Please try again.');
        } finally {
            this.isUploading = false;
            this.updateUploadButton(false);
        }
    }
    
    /**
     * Simulate the upload process (replace with real API call)
     */
    simulateUpload() {
        return new Promise((resolve) => {
            // Simulate network delay
            const uploadTime = 1500 + (this.selectedFiles.length * 500);
            setTimeout(resolve, uploadTime);
        });
    }
    
    /**
     * Update upload button state
     */
    updateUploadButton(isLoading) {
        const btnText = this.uploadBtn.querySelector('.btn-text');
        const btnLoader = this.uploadBtn.querySelector('.btn-loader');
        
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            this.uploadBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            this.uploadBtn.disabled = false;
        }
    }
    
    /**
     * Show success toast message
     */
    showSuccessToast() {
        this.successToast.classList.add('show');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.hideToast();
        }, 4000);
    }
    
    /**
     * Hide success toast
     */
    hideToast() {
        this.successToast.classList.remove('show');
    }
    
    /**
     * Reset the form to initial state
     */
    resetForm() {
        this.selectedFiles = [];
        this.updatePreview();
        this.resetFileInput();
        
        // Reset upload button text
        const btnText = this.uploadBtn.querySelector('.btn-text');
        btnText.textContent = 'Upload to MOMNT';
    }
    
    /**
     * Show error message (simple implementation)
     */
    showError(message) {
        // Create a temporary error toast
        const errorToast = document.createElement('div');
        errorToast.className = 'toast';
        errorToast.style.background = 'rgba(244, 67, 67, 0.9)';
        errorToast.innerHTML = `
            <div class="toast-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
            </div>
            <div class="toast-content">
                <h4>⚠️ Upload Error</h4>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(errorToast);
        
        // Show the error toast
        setTimeout(() => {
            errorToast.classList.add('show');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorToast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(errorToast);
            }, 300);
        }, 5000);
        
        console.warn('Upload Error:', message);
    }
    
    /**
     * Get selected files (useful for integration with real upload API)
     */
    getSelectedFiles() {
        return this.selectedFiles;
    }
    
    /**
     * Clear all selected files
     */
    clearFiles() {
        this.resetForm();
    }
}

/**
 * Additional utility functions
 */

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Add CSS animation keyframes dynamically
 */
function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOutScale {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.8);
            }
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }
        
        .pulse {
            animation: pulse 0.6s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Add custom animations
        addCustomAnimations();
        
        // Initialize the photo uploader
        window.photoUploader = new PhotoUploader();
        
        // Add some mobile-specific optimizations
        if (isMobileDevice()) {
            document.body.classList.add('mobile-device');
            
            // Prevent zoom on double tap for better UX
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
        
        // Add performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                    console.log('Page load time:', loadTime + 'ms');
                }, 0);
            });
        }
        
        // Add accessibility improvements
        const focusableElements = document.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
        
        // Trap focus within the main container for better keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
        
        console.log('MOMNT Guest Upload app initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize MOMNT Guest Upload app:', error);
        
        // Show fallback error message
        const fallbackMessage = document.createElement('div');
        fallbackMessage.className = 'fallback-message';
        fallbackMessage.innerHTML = `
            <h3>⚠️ App Loading Error</h3>
            <p>There was an issue loading the upload interface. Please refresh the page and try again.</p>
            <button onclick="window.location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                Refresh Page
            </button>
        `;
        document.body.appendChild(fallbackMessage);
    }
});

/**
 * Export for potential integration with other systems
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhotoUploader, formatFileSize, isMobileDevice };
}