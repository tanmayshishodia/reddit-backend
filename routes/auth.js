const express = require('express')
const passport = require('passport')
const router = express.Router()

let User = require("../models/User");
// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }), //redirect after failure
  async (req, res) => {
    console.log(req.user.googleId)
    req.session.uid = req.user._id;
    console.log(req.session.uid)
    const userDetails = await User.findById(req.session.uid)

    console.log("Username:", userDetails)
    if (!userDetails.username)
      res.redirect("/auth/register")
    else {
      console.log("hello")
    res.redirect("/") //redirect to front page
    }
  }
)

router.post("/register", function (req, res){
  User.updateOne({
    _id: req.session.uid
  }, {
    username: req.body.username,
    dob: req.body.dob
  }, function (err, result) {
    if (err) throw err;

    console.log(`[${req.params.id}] user edited!`)
    res.redirect("/")
  })
})

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/') //redirect after logout
})

module.exports = router