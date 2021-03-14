let profileController = require('../controller/profile')
const express = require('express')
const router = express.Router()

router.get('/posts', profileController.posts)
router.get('/comments', profileController.comments)


module.exports = router