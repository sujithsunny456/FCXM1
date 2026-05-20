const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const questionRoutes = require('./routes/questions')

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/questions', questionRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FocalCXM API is running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI || MONGO_URI.includes('localhost')) {
  console.warn('⚠️  WARNING: Using localhost MongoDB. If not installed, set MONGO_URI to your Atlas connection string in .env')
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`🚀 FocalCXM API running on http://localhost:${PORT}`)
      console.log(`   Health check: http://localhost:${PORT}/api/health`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    console.error('')
    console.error('👉 Fix: Set MONGO_URI in fcxm-server/.env to your MongoDB Atlas connection string.')
    console.error('   Get a free cluster at: https://www.mongodb.com/cloud/atlas')
    process.exit(1)
  })
