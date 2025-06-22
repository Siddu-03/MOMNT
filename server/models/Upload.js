const mongoose = require('mongoose')

/**
 * Upload Schema
 * Represents an image uploaded by a guest to an event
 */
const uploadSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: [true, 'IP address is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

/**
 * Index for better query performance
 */
uploadSchema.index({ eventId: 1, uploadedAt: -1 })
uploadSchema.index({ ipAddress: 1, uploadedAt: -1 })

/**
 * Virtual for formatted file size
 */
uploadSchema.virtual('formattedFileSize').get(function() {
  const bytes = this.fileSize
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
})

/**
 * Ensure virtuals are included in JSON output
 */
uploadSchema.set('toJSON', { virtuals: true })
uploadSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Upload', uploadSchema) 