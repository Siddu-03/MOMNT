const express = require('express')
const multer = require('multer')
const rateLimit = require('express-rate-limit')
const { uploadImages } = require('../controllers/uploadController')

// Multer config: store files in memory for Cloudinary upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true)
    } else {
      cb(new Error('Only JPG and PNG images are allowed'))
    }
  }
})

// Rate limit guest uploads by IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // 10 uploads per IP per window
  message: 'Too many uploads from this IP, please try again later.'
})

const router = express.Router()

// POST /api/upload - Guest image upload (no login)
router.post('/', uploadLimiter, upload.array('files', 5), uploadImages)

module.exports = router 