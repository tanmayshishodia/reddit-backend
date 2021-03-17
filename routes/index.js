const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const post = require('../controller/post')
const postComment = require('../controller/postComment')
const PostStateTest = require('../test/postStateTest')
const Login = require('./login')
const votePosts = require('../controller/postState')
const StateSend = require('../controller/getPostState')
const voteComments = require('../controller/commentState')
const getComments = require('../controller/getComments')
const getReply = require('../controller/getReply')
const authorize = require('../middleware/authorize')

const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.send('login')
  })


//@route create post   POST /
router.post('/upload', authorize(), upload, post.uploads)

//@route create comment  POST /
router.post('/postComments/:id/:pid', authorize(), postComment.postComment)

//@route vote Posts
router.post('/votePosts/:id', authorize(), votePosts.postState)

//@route vote comments and replies
router.post('/votecomments/:id/:pid', authorize(), voteComments.commentState)

//test route
router.post('/postStateTest', PostStateTest.postStateTest)

//@route create login  POST /
router.post('/login', Login.login)

router.get('/poststate', StateSend.postState)

router.get('/comments/:id', getComments.getAllComments)

router.get('/reply/:id', getReply.getAllReplies)

// // @desc    Dashboard
// // @route   GET /dashboard
// router.get('/dashboard', ensureAuth, async (req, res) => {
//     try {
//       const stories = await Story.find({ user: req.user.id }).lean()
//       res.render('dashboard', {
//         name: req.user.firstName,
//         stories,
//       })
//     } catch (err) {
//       console.error(err)
//       res.render('error/500')
//     }
//   })


module.exports = router