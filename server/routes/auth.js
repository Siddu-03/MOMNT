const express = require('express')
const { body } = require('express-validator')
const { signup, login, getMe } = require('../controllers/authController')
const { auth } = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/signup - Register new host
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
  ],
  signup
)

// POST /api/auth/login - Host login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').exists().withMessage('Password required')
  ],
  login
)

// GET /api/auth/me - Get current user (auth required)
router.get('/me', auth, getMe)

module.exports = router 