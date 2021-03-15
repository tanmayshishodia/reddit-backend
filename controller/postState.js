const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')
const post = require('../models/Post')
const mongoose = require('mongoose')

const updateKarma = require('./incrementKarma')
const { Interface } = require('readline')
const { error } = require('console')

exports.postState = async (req, res, next) => {

    //check if already votes
    console.log(req.body)           //empty IDK why
    console.log(req.headers.uid)
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    const result = await postState.find({ uid: uid1, postId: req.params.id }, async (err, docs) => {
        if (err) {
            console.log(err);
        } else {

            //finding id of the post creater
            let creatorId
            post.findById(req.params.id, async(err, docs) => { 
                if (err){ 
                    console.log(err); 
                    res.send(error)
                } 
                else{ 
                    console.log("Result : ", docs); 
                    creatorId = docs.uid
                    console.log("##########!@@@@@@@@@@@@@@@@@!**************")
                    console.log(creatorId)
                } 
            });

            console.log(docs)
            console.log(docs[0].state)
            console.log(req.body.action)
            if (Object.keys(docs).length == 0) {
                //add 1-0

                let voteState = -1
                console.log("Decrement")
                if(req.body.action == "increment") {
                    voteState = 1
                    console.log("-------Changed-------")
                }

                post = {
                    uid: uid1,
                    postId: req.params.id,
                    state: voteState
                }

                console.log("-----------")
                console.log(post)

                let newUpload = new postState(post);

                try {
                    const a1 = await newUpload.save()

                    //calling updateKarma

                    updateKarma.updateKarma(creatorId, req, req.body.action, 1)

                    res.json(a1)
                } catch (err) {
                    console.log(err)
                    res.send(err)
                }

            } else if (docs[0].state == 1 && req.body.action == "increment" || docs[0].state == -1 && req.body.action == "decrement") {
                console.log("----SAME VOTE----")
                //update to make 0
                postState.updateOne({
                    uid: uid1,
                    postId: req.params.id
                }, {
                    state: 0
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] post edited!`)
                    //res.redirect("/")
                    updateKarma.updateKarma(creatorId, req, req.body.action, -1)
                })
            } else {
                console.log("-----DIFF VOTE-----")
                //update to make -1
                let voteState = -1
                if(req.body.action == "increment")
                    voteState = 1

                postState.updateOne({
                    uid: uid1,
                    postId: req.params.id
                }, {
                    state: voteState
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] post edited!`)
                    updateKarma.updateKarma(creatorId, req, req.body.action, 1)
                    //res.redirect("/")
                })
            }
        }
    })
}