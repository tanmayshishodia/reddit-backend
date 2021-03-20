const Comment = require('../controller/comment')
const Authorize = require('../middleware/authorize')

const express = require('express')
const router = express.Router()

//comment route
router.get('/:id', Comment.getAllComments)

//reply route
router.get('/:id/:pid', Comment.getAllComments)

//comment+reply route
router.put('/:id', Comment.editComment)

//comment+reply route
router.delete('/:id', Comment.deleteComment)

//comment+reply route
router.post('/', Comment.postComment)


module.exports = router
