const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const post = require('../controller/post')
const postComment = require('../controller/postComment')
const Login = require('./login')
const votePosts = require('../controller/postState')
const StateSend = require('../controller/getPostState')
const voteComments = require('../controller/commentState')
const getComments = require('../controller/getComments')
const getReply = require('../controller/getReply')
const authorize = require('../middleware/authorize')
const SinglePost = require('../controller/singlePost')

const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc    Login/Landing page
// @route   GET /
// router.get('/', ensureGuest, (req, res) => {
//     res.send('login')
//   })


//@route create post   POST /
//router.post('/upload', authorize(), upload, post.uploads)//DONE

//@route create comment  POST /
//router.post('/postComments/:id/:pid', authorize(), postComment.postComment)//DONE

//@route vote Posts
//router.post('/votePosts/:id', authorize(), votePosts.postState)//DONE

//@route vote comments and replies
//router.post('/votecomments/:id', authorize(), voteComments.commentState)//DONE

//test route
//router.post('/postStateTest', PostStateTest.postStateTest)

//@route create login  POST /
router.post('/login', Login.login)//DONE

//router.get('/poststate', StateSend.postState)//DONE

//and comment state

//router.get('/comments/:id', getComments.getAllComments)//DONE

//router.get('/reply/:id', getReply.getAllReplies)//DONE

//router.get('/post/:id', SinglePost.singlePost)//DONE

module.exports = router