const express = require('express')
const router = express.Router()
const {
  createSession,
} = require('../controllers/sessions')

router.post('/', createSession)

module.exports = router