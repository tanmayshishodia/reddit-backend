
const post = require('../controller/post')
const authorize = require('../middleware/authorize')
const multer = require('../middleware/multer')

const express = require('express')
const router = express.Router()

router.get('/', post.getAllPosts)
router.get('/:id', post.singlePost)
router.post('/', authorize(), multer, post.uploads)
router.delete('/:id', authorize(), post.deletePost)
router.put('/:id', authorize(), multer, post.editPost)

module.exports = router