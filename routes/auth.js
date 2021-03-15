const express = require('express')
const passport = require('passport')
const router = express.Router()
const mongoose = require('mongoose')

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

router.post("/register", async(req, res) => {

  //check if username is unique
  const result = await User.find({ username: req.body.username }, async(err, docs) => {
    if (err) {
      console.log(err);
      res.send(err)
    }
    else {
      console.log("CHECKED USERNAME--------------------")
      if (Object.keys(docs).length != 0) {
        res.status(404)
        console.log("Error: username already exists--------------------")
        res.send("Error: username already exists")
      }
    }
  });

  console.log(req.headers.uid)
  var uid = req.headers.uid
  uid = mongoose.Types.ObjectId(uid.substring(1,uid.length-1));
  console.log(uid+"------------")
  User.updateOne({
    _id: uid
  }, {
    username: req.body.username,
    dob: req.body.dob
  }, function (err, result) {
    if (err) throw err;

    console.log(`[${uid}] user edited!`)
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