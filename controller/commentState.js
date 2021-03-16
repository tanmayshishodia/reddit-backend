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
                console.log(err);
                res.status(500).send(err)
                reject(err)
            }
            else {
                console.log("Result---- : ", docs);
                //creatorId = docs.uid
                //console.log("creatorid------: ", creatorId)
                creatorId = docs.uid
                resolve()
            }
        });
    })
}

exports.commentState = async (req, res, next) => {

    //check if already votes
    console.log(req.body)           //empty IDK why
    console.log(req.headers.uid)
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));

    const result = await CommentState.find({ uid: uid1, commentId: req.params.id }, async (err, docs) => {
        if (err) {
            console.log(err);
        } else {

            imgLoc = findCreatorId(req.params.id).then(async () => {
                //updateKarma.updateKarma(creatorId, req, "increment", 2)
                //res.send("Done")
            
            //finding id of the post creater
            // let postId, creatorId
            // console.log("CommentId; ",req.params.id)
            // Comment.findById(req.params.id, function (err, docs) { 
            //     if (err){ 
            //         console.log(err); 
            //         res.send(error)
            //     } 
            //     else{ 
            //         console.log("Result : ", docs); 
            //         postId = docs.postId
            //         console.log("##########!@@@@@@@@@@@@@@@@@!**************")
            //         console.log(postId)
            //     } 
            // });
            // Post.findById(postId, function (err, docs) { 
            //     if (err){ 
            //         console.log(err); 
            //         res.send(error)
            //     } 
            //     else{ 
            //         console.log("Result : ", docs); 
            //         creatorId = docs.uid
            //         console.log("##########!@@@@@@@@@@@@@@@@@!**************")
            //         console.log(creatorId)
            //     } 
            // });

            console.log(docs)
            //console.log(docs[0].state)
            console.log("action: ", req.body.actions)
            if (Object.keys(docs).length == 0) {
                //add 1-0

                let voteState = -1
                console.log("Decrement")
                if(req.body.actions == "increment") {
                    voteState = 1
                    console.log("-------Changed-------")
                }

                post = {
                    uid: uid1,
                    commentId: req.params.id,
                    state: voteState
                }

                console.log("-----------")
                console.log(post)

                let newUpload = new CommentState(post);

                try {
                    const a1 = await newUpload.save()

                    //calling updateKarma
                    

                    updateKarma.updateKarma(creatorId, req, req.body.actions, 1)
                    Comment.updateOne({
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }, {
                        $inc: {
                            votes: voteState
                        }
                    }, function (err, result) {
                        if (err) throw err;
    
                        console.log(`[${req.params.id}] post edited!`)
                        //res.redirect("/")
                        //updateKarma.updateKarma(creatorId, req, req.body.actions, -1)
                        //
                        console.log(voteState)
                        res.send("upvoted")
                    })

                    res.json(a1)
                } catch (err) {
                    console.log(err)
                    res.send(err)
                }

            } else if (docs[0].state == 1 && req.body.actions == "increment" || docs[0].state == -1 && req.body.actions == "decrement") {
                console.log("----SAME VOTE----")
                //update to make 0
                CommentState.updateOne({
                    uid: uid1,
                    commentId: req.params.id
                }, {
                    state: 0
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] post edited!`)
                    //res.redirect("/")
                    updateKarma.updateKarma(creatorId, req, req.body.actions, -1)
                    var increase = -1
                    if(req.body.actions == "decrement")
                        increase = 1
                    Comment.updateOne({
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }, {
                        $inc: {
                            votes: increase
                        }
                    }, function (err, result) {
                        if (err) throw err;
    
                        console.log(`[${req.params.id}] post edited!`)
                        //res.redirect("/")
                        //updateKarma.updateKarma(creatorId, req, req.body.actions, -1)
                        //res.json(a1)
                        console.log(increase)
                        res.send("upvoted")
                    })
                })
                //res.send("Done")
            } else {
                console.log("-----DIFF VOTE-----")
                //update to make -1
                let voteState = -1
                if(req.body.actions == "increment")
                    voteState = 1

                CommentState.updateOne({
                    uid: uid1,
                    commentId: req.params.id
                }, {
                    state: voteState
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] post edited!`)
                    var increment = 1 * voteState
                    if(voteState == 1 && docs[0].state == -1 || voteState == -1 && docs[0].state == 1) {
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
                        if (err) throw err;
    
                        console.log(`[${req.params.id}] post edited!`)
                        //res.redirect("/")
                        //updateKarma.updateKarma(creatorId, req, req.body.actions, -1)
                        //res.json(a1)
                        console.log(increment)
                        res.send("upvoted")
                    })
                    //updateKarma.updateKarma(creatorId, req, req.body.actions, 1)
                    //res.redirect("/")
                })
                //res.send("Done")
            }
        })
        }
    })
}