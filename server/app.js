require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/database')

// Import routes
const authRoutes = require('./routes/auth')
const eventRoutes = require('./routes/events')
const uploadRoutes = require('./routes/upload')

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(helmet())
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate Limiting (global, can be customized per route)
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 min
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: 'Too many requests, please try again later.'
})
app.use(limiter)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/upload', uploadRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ success: false, message: 'Server error', error: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 MOMNT API running on port ${PORT}`)
}) 