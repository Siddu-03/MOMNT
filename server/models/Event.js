const mongoose = require('mongoose')

/**
 * Event Schema
 * Represents an event created by a host
 */
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host ID is required']
  },
  coverImageUrl: {
    type: String,
    default: null
  },
  uploads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload'
  }],
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
eventSchema.index({ hostId: 1, createdAt: -1 })

/**
 * Virtual for upload count
 */
eventSchema.virtual('uploadCount').get(function() {
  return this.uploads.length
})

/**
 * Ensure virtuals are included in JSON output
 */
eventSchema.set('toJSON', { virtuals: true })
eventSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Event', eventSchema) 