const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

/**
 * POST /api/auth/signup
 * Register new host
 */
exports.signup = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  try {
    const { email, password } = req.body
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }
    user = new User({ email, password })
    await user.save()
    const token = generateToken(user)
    res.status(201).json({ success: true, user: user.toJSON(), token })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * POST /api/auth/login
 * Host login
 */
exports.login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' })
    }
    const token = generateToken(user)
    res.json({ success: true, user: user.toJSON(), token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

/**
 * GET /api/auth/me
 * Get current user (auth required)
 */
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
} 