const feed = require('../controller/feed')
const singlePost = require('../controller/singlePost')
const post = require('../controller/post')
const del = require('../controller/delete')
const edit = require('../controller/edit')
const authorize = require('../middleware/authorize')
const multer = require('../middleware/multer')

const express = require('express')
const router = express.Router()

router.get('/', post.getAllPosts)
router.get('/:id', singlePost.singlePost)
router.post('/', authorize(), multer, post.uploads)
router.delete('/:id', authorize(), del.deletePost)
router.put('/:id', authorize(), multer, edit.editPost)

module.exports = router