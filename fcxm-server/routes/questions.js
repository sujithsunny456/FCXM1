const express = require('express')
const router = express.Router()
const { generateQuestions } = require('../controllers/questionsController')
const { protect } = require('../middleware/auth')

// Protected — user must be logged in to generate questions
router.post('/generate', protect, generateQuestions)

module.exports = router
