const feed = require('../controller/feed')
const singlePost = require('../controller/singlePost')
const upload = require('../controller/post')
const del = require('../controller/delete')

const express = require('express')
const router = express.Router()

router.get('/', feed.getAllPosts)
router.get('/:id', singlePost.singlePost)
router.post('/upload', upload.uploads)
router.delete('/:id', del.deletePost)

module.exports = router