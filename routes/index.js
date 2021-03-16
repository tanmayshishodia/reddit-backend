const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const post = require('../controller/post')
const postComment = require('../controller/postComment')
const PostStateTest = require('../test/postStateTest')
const Login = require('./login')
const votePosts = require('../controller/postState')
const StateSend = require('../controller/getPostState')

const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.send('login')
  })


//@route create post   POST /
router.post('/upload', upload, post.uploads)

//@route create comment  POST /
router.post('/postComments/:id/:pid', postComment.postComment)

//
router.post('/votePosts/:id', votePosts.postState)

//test route
router.post('/postStateTest', PostStateTest.postStateTest)

//@route create login  POST /
router.post('/login', Login.login)

router.get('/poststate', StateSend.postState)

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