const { validationResult } = require('express-validator')
const Event = require('../models/Event')
const Upload = require('../models/Upload')
const cloudinary = require('cloudinary').v2

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * POST /api/events/create
 * Create new event (auth required)
 */
exports.createEvent = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  try {
    let coverImageUrl = null
    if (req.files && req.files.image) {
      // If using multer for single file: req.file
      const result = await cloudinary.uploader.upload(req.files.image.path, {
        folder: 'momnt/events',
        resource_type: 'image',
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
      })
      coverImageUrl = result.secure_url
    }
    const event = new Event({
      title: req.body.title,
      date: req.body.date,
      hostId: req.user._id,
      coverImageUrl
    })
    await event.save()
    res.status(201).json({ success: true, event })
  } catch (error) {
    console.error('Create event error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * GET /api/events/host
 * Get all events for current host
 */
exports.getHostEvents = async (req, res) => {
  try {
    const events = await Event.find({ hostId: req.user._id }).sort({ createdAt: -1 })
    res.json({ success: true, events })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * GET /api/events/:id
 * Fetch event details
 */
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' })
    res.json({ success: true, event })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * PUT /api/events/:id
 * Update event info (auth required)
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, hostId: req.user._id },
      req.body,
      { new: true }
    )
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' })
    res.json({ success: true, event })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * DELETE /api/events/:id
 * Delete event (auth required)
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, hostId: req.user._id })
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' })
    res.json({ success: true, message: 'Event deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * GET /api/events/:id/uploads
 * View all uploads for an event
 */
exports.getEventUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ eventId: req.params.id }).sort({ uploadedAt: -1 })
    res.json({ success: true, uploads })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
} 