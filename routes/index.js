const express = require('express')
const router = express.Router()

const controller = require('../controller/controller')
const multer = require('../middleware/multer')

const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.send('login')
  })


//@route upload   POST /
router.post('/upload', store.array('images', 1), controller.uploads)

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