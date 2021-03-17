let feedController = require('../controller/feed1')
const express = require('express')
const router = express.Router()

router.get('/', feedController.getAllPosts)

module.exports = router