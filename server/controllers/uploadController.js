const cloudinary = require('cloudinary').v2
const Upload = require('../models/Upload')
const Event = require('../models/Event')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * POST /api/upload
 * Guest image upload (no login)
 */
exports.uploadImages = async (req, res) => {
  try {
    const { eventId } = req.body
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID required' })
    }
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' })
    }
    if (req.files.length > 5) {
      return res.status(400).json({ success: false, message: 'Max 5 files allowed' })
    }
    const uploads = []
    for (const file of req.files) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload_stream({
        folder: `momnt/uploads/${eventId}`,
        resource_type: 'image',
        transformation: [{ width: 1600, height: 1200, crop: 'limit' }]
      }, async (error, result) => {
        if (error) throw error
        // Save upload record
        const upload = new Upload({
          fileUrl: result.secure_url,
          eventId,
          uploadedAt: new Date(),
          ipAddress: req.ip,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype
        })
        await upload.save()
        // Add to event's uploads
        event.uploads.push(upload._id)
        await event.save()
        uploads.push(upload)
        if (uploads.length === req.files.length) {
          // All uploads done
          return res.status(201).json({ success: true, upload: uploads })
        }
      })
      // Write file buffer to stream
      result.end(file.buffer)
    }
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
} 