const express = require('express')
const passport = require('passport')
const router = express.Router()

let User = require("../models/User");
exports.username = async(req, res, next) => {

    //check if username is unique
    const result = await post.find({ username: req.body.username }, async(err, docs) => {
      if (err) {
        //console.log(err);
        res.status(400).send(err)
      }
      else {
        if (Object.keys(docs).length != 0) {
          res.status(404)
          res.send("Error: username already exists")
        }
      }
    });
  
  
    User.updateOne({
      _id: req.session.uid
    }, {
      username: req.body.username,
      dob: req.body.dob
    }, function (err, result) {
      if (err) throw err;
  
      //console.log(`[${req.params.id}] user edited!`)
      res.redirect("/")
    })
  }