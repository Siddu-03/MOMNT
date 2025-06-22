const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request object
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      })
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error in authentication.' 
    })
  }
}

/**
 * Optional Authentication Middleware
 * Similar to auth but doesn't require token (for guest routes)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId).select('-password')
      if (user) {
        req.user = user
      }
    }
    
    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}

module.exports = { auth, optionalAuth } 