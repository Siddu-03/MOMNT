const express = require('express')
const { body } = require('express-validator')
const { auth } = require('../middleware/auth')
const {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getHostEvents,
  getEventUploads
} = require('../controllers/eventController')

const router = express.Router()

// POST /api/events/create - Create new event (auth required)
router.post(
  '/create',
  auth,
  [
    body('title').notEmpty().withMessage('Title required'),
    body('date').notEmpty().withMessage('Date required')
  ],
  createEvent
)

// GET /api/events/host - Get all events for current host
router.get('/host', auth, getHostEvents)

// GET /api/events/:id - Fetch event details
router.get('/:id', getEvent)

// PUT /api/events/:id - Update event info (auth required)
router.put('/:id', auth, updateEvent)

// DELETE /api/events/:id - Delete event (auth required)
router.delete('/:id', auth, deleteEvent)

// GET /api/events/:id/uploads - View all uploads for an event
router.get('/:id/uploads', getEventUploads)

module.exports = router 