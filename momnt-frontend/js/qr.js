// QR Code Scanning JavaScript
// Handles camera access and QR code detection

document.addEventListener('DOMContentLoaded', () => {
    const { utils, dom } = window.MOMNT;

    // Get elements
    const startScanBtn = dom.get('#start-scan');
    const stopScanBtn = dom.get('#stop-scan');
    const qrVideo = dom.get('#qr-video');
    const qrCanvas = dom.get('#qr-canvas');

    let stream = null;
    let scanning = false;
    let scanInterval = null;

    // Check if QR scanning is available on this page
    if (!startScanBtn || !qrVideo) {
        return;
    }

    // Event listeners
    dom.on(startScanBtn, 'click', startScanning);
    dom.on(stopScanBtn, 'click', stopScanning);

    // Check for camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        startScanBtn.disabled = true;
        startScanBtn.textContent = 'Camera not supported';
        utils.showNotification('Camera access is not supported in this browser', 'error');
        return;
    }

    async function startScanning() {
        try {
            // Request camera access
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            // Set video source
            qrVideo.srcObject = stream;
            qrVideo.play();

            // Show stop button, hide start button
            dom.hide(startScanBtn);
            dom.show(stopScanBtn);

            scanning = true;

            // Start QR code detection
            startQRDetection();

            utils.showNotification('Camera started successfully', 'success');

        } catch (error) {
            console.error('Camera access error:', error);
            
            if (error.name === 'NotAllowedError') {
                utils.showNotification('Camera access denied. Please allow camera access and try again.', 'error');
            } else if (error.name === 'NotFoundError') {
                utils.showNotification('No camera found on this device.', 'error');
            } else {
                utils.showNotification('Failed to access camera: ' + error.message, 'error');
            }
        }
    }

    function stopScanning() {
        if (stream) {
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }

        // Clear video source
        qrVideo.srcObject = null;

        // Stop QR detection
        if (scanInterval) {
            clearInterval(scanInterval);
            scanInterval = null;
        }

        scanning = false;

        // Show start button, hide stop button
        dom.show(startScanBtn);
        dom.hide(stopScanBtn);

        utils.showNotification('Camera stopped', 'info');
    }

    function startQRDetection() {
        if (!scanning) return;

        // Create canvas context for image processing
        const canvas = qrCanvas;
        const context = canvas.getContext('2d');

        scanInterval = setInterval(() => {
            if (qrVideo.videoWidth === 0) return;

            // Set canvas dimensions
            canvas.width = qrVideo.videoWidth;
            canvas.height = qrVideo.videoHeight;

            // Draw video frame to canvas
            context.drawImage(qrVideo, 0, 0, canvas.width, canvas.height);

            // Get image data for QR detection
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Simple QR code detection (this is a basic implementation)
            // In a real application, you would use a QR code library like jsQR
            detectQRCode(imageData);
        }, 100); // Check every 100ms
    }

    function detectQRCode(imageData) {
        // This is a simplified QR detection
        // In a real implementation, you would use a proper QR code library
        
        // For demo purposes, we'll simulate QR detection
        // Replace this with actual QR code detection logic
        
        // Example: jsQR library usage
        /*
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
            handleQRCodeDetected(code.data);
        }
        */

        // Simulate QR detection for demo
        if (Math.random() < 0.01) { // 1% chance per frame
            const mockQRData = 'EVT' + Math.random().toString(36).substr(2, 6).toUpperCase();
            handleQRCodeDetected(mockQRData);
        }
    }

    function handleQRCodeDetected(qrData) {
        // Stop scanning
        stopScanning();

        // Parse QR data
        const eventCode = parseQRData(qrData);
        
        if (eventCode) {
            // Fill in the event code input
            const eventCodeInput = dom.get('#event-code');
            if (eventCodeInput) {
                eventCodeInput.value = eventCode;
                
                // Trigger join event
                const joinEventBtn = dom.get('#join-event');
                if (joinEventBtn) {
                    joinEventBtn.click();
                }
            }

            utils.showNotification(`QR Code detected: ${eventCode}`, 'success');
        } else {
            utils.showNotification('Invalid QR code format', 'error');
        }
    }

    function parseQRData(qrData) {
        // Parse QR code data to extract event code
        // This depends on your QR code format
        
        // Example formats:
        // - Direct event code: "EVT123456"
        // - URL with event code: "https://momnt.app/upload?event=EVT123456"
        // - JSON format: '{"event":"EVT123456","name":"Event Name"}'
        
        try {
            // Try to parse as JSON
            const jsonData = JSON.parse(qrData);
            return jsonData.event || jsonData.eventCode;
        } catch {
            // Try to extract from URL
            if (qrData.includes('event=')) {
                const match = qrData.match(/event=([A-Z0-9]+)/);
                return match ? match[1] : null;
            }
            
            // Check if it's a direct event code
            if (qrData.match(/^EVT[A-Z0-9]{6}$/)) {
                return qrData;
            }
            
            return null;
        }
    }

    // Add QR code library (jsQR) for actual QR detection
    function loadQRLibrary() {
        // Check if jsQR is already loaded
        if (window.jsQR) {
            return Promise.resolve();
        }

        // Load jsQR library
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        }).then(() => {
            // Update QR detection to use jsQR
            window.detectQRCode = function(imageData) {
                const code = window.jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    handleQRCodeDetected(code.data);
                }
            };
        }).catch(error => {
            console.warn('Failed to load QR library:', error);
            // Fall back to basic detection
        });
    }

    // Load QR library when page loads
    loadQRLibrary();

    // Add camera permission request
    function requestCameraPermission() {
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'camera' }).then(result => {
                if (result.state === 'denied') {
                    startScanBtn.disabled = true;
                    startScanBtn.textContent = 'Camera blocked';
                    utils.showNotification('Camera access is blocked. Please enable it in your browser settings.', 'error');
                }
            });
        }
    }

    // Request permission on page load
    requestCameraPermission();

    // Add visual feedback for scanning
    function addScanningFeedback() {
        const scannerFrame = dom.get('.scanner-frame');
        if (scannerFrame) {
            dom.addClass(scannerFrame, 'scanning');
        }
    }

    function removeScanningFeedback() {
        const scannerFrame = dom.get('.scanner-frame');
        if (scannerFrame) {
            dom.removeClass(scannerFrame, 'scanning');
        }
    }

    // Update start/stop button handlers
    const originalStartScanning = startScanning;
    startScanning = async function() {
        await originalStartScanning();
        if (scanning) {
            addScanningFeedback();
        }
    };

    const originalStopScanning = stopScanning;
    stopScanning = function() {
        originalStopScanning();
        removeScanningFeedback();
    };

    // Add styles for scanning feedback
    const style = document.createElement('style');
    style.textContent = `
        .scanner-frame.scanning .scanner-line {
            animation: scan 2s linear infinite;
        }

        .scanner-frame.scanning .scanner-corner {
            animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes scan {
            0% {
                top: 20px;
            }
            50% {
                top: calc(100% - 20px);
            }
            100% {
                top: 20px;
            }
        }

        @keyframes glow {
            0%, 100% {
                box-shadow: 0 0 5px rgba(99, 102, 241, 0.5);
            }
            50% {
                box-shadow: 0 0 20px rgba(99, 102, 241, 0.8), 0 0 30px rgba(99, 102, 241, 0.6);
            }
        }

        #qr-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .qr-scanner {
            position: relative;
            overflow: hidden;
        }

        .scanner-frame {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10;
            pointer-events: none;
        }

        .scanner-corner {
            position: absolute;
            width: 30px;
            height: 30px;
            border: 3px solid var(--primary-color);
        }

        .scanner-corner.top-left {
            top: 20px;
            left: 20px;
            border-right: none;
            border-bottom: none;
        }

        .scanner-corner.top-right {
            top: 20px;
            right: 20px;
            border-left: none;
            border-bottom: none;
        }

        .scanner-corner.bottom-left {
            bottom: 20px;
            left: 20px;
            border-right: none;
            border-top: none;
        }

        .scanner-corner.bottom-right {
            bottom: 20px;
            right: 20px;
            border-left: none;
            border-top: none;
        }

        .scanner-line {
            position: absolute;
            top: 50%;
            left: 20px;
            right: 20px;
            height: 2px;
            background: var(--primary-color);
        }
    `;
    document.head.appendChild(style);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (scanInterval) {
            clearInterval(scanInterval);
        }
    });
}); 