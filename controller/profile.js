let Post = require("../models/Post");
let Comment = require('../models/Comment')
let User = require('../models/User')
const mongoose = require('mongoose')
const Sentry = require("@sentry/node");

exports.posts = function (req, res) {
    let sort;
    action = req.query.action
    switch (action) {
        case "top":
            sort = {
                votes: -1
            }
            break;
        case "recent":
            sort = {
                createdAt: -1
            }
            break;
        case "old":
            sort = {
                createdAt: 1
            }
            break;
        default:
            sort = {
                votes: -1
            }
    }

    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));

    Post.find({
        uid: uid1
    }).sort(sort).exec(function (err, doc) {
        if (err) 
            throw err;
        if (doc.length) {
            res.send(doc)
        } else {
            res.status(403);
            res.send({
                error: `Unauthorised user`
            })
        }
    })
}

exports.comments = function (req, res) {
    let sort;
    action = req.query.action
    switch (action) {
        case "top":
            sort = {
                votes: -1
            }
            break;
        case "recent":
            sort = {
                createdAt: -1
            }
            break;
        case "old":
            sort = {
                createdAt: 1
            }
            break;
        default:
            sort = {
                votes: -1
            }
    }

    Comment.find({
        uid: uid1
    }).sort(sort).exec(function (err, doc) {
        if (err) throw err;
        if (doc.length) {
            res.send(doc)
        } else {
            res.status(404);
            res.send({
                error: `Unable to find Comments.`
            })
        }
    })
}

exports.profile = function (req, res) {
    User.find({
        _id: uid1
    }).exec(function (err, doc) {
        if (err) throw err;
        if (doc.length) {
            res.send(doc)
        } else {
            res.status(404);
            res.send({
                error: `Unable to find user.`
            })
        }
    })
}