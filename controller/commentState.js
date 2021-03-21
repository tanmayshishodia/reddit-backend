const fs = require('fs')
const user = require('../models/User')
const CommentState = require('../models/CommentState')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const mongoose = require('mongoose')

const updateKarma = require('./incrementKarma')
const { Interface } = require('readline')
const { error } = require('console')

let creatorId
function findCreatorId(id) {

    return new Promise((resolve, reject) => {
        Comment.findById(id, async (err, docs) => {
            if (err) {
                res.status(400).send(err)
                reject(err)
            }
            else {
                creatorId = docs.uid
                resolve()
            }
        });
    })
}

exports.commentState = async (req, res, next) => {
    console.log(req.body)
    console.log(req.headers.uid)
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));

    const result = await CommentState.find({ uid: uid1, commentId: req.params.id }, async (err, docs) => {
        if (err) {
            res.status(400).send("Something went wrong")
        } else {

            imgLoc = findCreatorId(req.params.id).then(async () => {

                if (Object.keys(docs).length == 0) {
                    //add 1-0

                    let voteState = -1
                    if (req.body.actions == "increment") {
                        voteState = 1
                    }

                    post = {
                        uid: uid1,
                        commentId: req.params.id,
                        state: voteState
                    }

                    let newUpload = new CommentState(post);

                    try {
                        const a1 = await newUpload.save()

                        updateKarma.updateKarma(creatorId, req, req.body.actions, 1)
                        Comment.updateOne({
                            _id: mongoose.Types.ObjectId(req.params.id)
                        }, {
                            $inc: {
                                votes: voteState
                            }
                        }, function (err, result) {
                            if (err)
                                res.status(400).send("Something went wrong")
                            else
                                res.status(200).send("upvoted") //ERRRR HERE
                        })

                        //res.json(a1)
                    } catch (err) {
                        console.log({err})
                        res.status(401).send(err)
                    }

                } else if (docs[0].state == 1 && req.body.actions == "increment" || docs[0].state == -1 && req.body.actions == "decrement") {

                    CommentState.updateOne({
                        uid: uid1,
                        commentId: req.params.id
                    }, {
                        state: 0
                    }, function (err, result) {
                        if (err)
                            res.status(400).send("Something went wrong")
                        else {

                            updateKarma.updateKarma(creatorId, req, req.body.actions, -1)
                            var increase = -1
                            if (req.body.actions == "decrement")
                                increase = 1
                            Comment.updateOne({
                                _id: mongoose.Types.ObjectId(req.params.id)
                            }, {
                                $inc: {
                                    votes: increase
                                }
                            }, function (err, result) {
                                if (err)
                                    res.status(400).send("Something went wrong")
                                else
                                    res.send("upvoted")
                            })
                        }
                    })
                } else {
                    let voteState = -1
                    if (req.body.actions == "increment")
                        voteState = 1

                    CommentState.updateOne({
                        uid: uid1,
                        commentId: req.params.id
                    }, {
                        state: voteState
                    }, function (err, result) {
                        if (err)
                            res.status(400).send("Something went wrong")
                        else {
                            var increment = 1 * voteState
                            if (voteState == 1 && docs[0].state == -1 || voteState == -1 && docs[0].state == 1) {
                                updateKarma.updateKarma(creatorId, req, req.body.actions, 2)
                                increment = 2 * voteState
                            } else {
                                updateKarma.updateKarma(creatorId, req, req.body.actions, 1)
                            }

                            Comment.updateOne({
                                _id: mongoose.Types.ObjectId(req.params.id)
                            }, {
                                $inc: {
                                    votes: increment
                                }
                            }, function (err, result) {
                                if (err)
                                    res.status(400).send("Something went wrong")
                                else
                                    res.send("upvoted")
                            })
                        }
                    })
                }
            })
        }
    })
}