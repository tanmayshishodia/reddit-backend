const Post = require('../controller/post')
const Authorize = require('../middleware/authorize')
const Multer = require('../middleware/multer')

const express = require('express')
const router = express.Router()

router.get('/', Post.getAllPosts)
router.get('/:id', Post.singlePost)
router.post('/', Authorize(), Multer, Post.uploads)
router.delete('/:id', Authorize(), Post.deletePost)
router.put('/:id', Authorize(), Multer, Post.editPost)

module.exports = router