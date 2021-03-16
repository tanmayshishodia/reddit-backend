const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')
const post = require('../models/Post')
const mongoose = require('mongoose')

const updateKarma = require('./incrementKarma')
const { Interface } = require('readline')
const { error } = require('console')


//CREATORID promise:
let creatorId
function findCreatorId(id) {

    return new Promise((resolve, reject) => {
        post.findById(id, async(err, docs) => { 
            if (err){ 
                console.log(err);
                res.status(500).send(err)
                reject(err)
            } 
            else{ 
                console.log("Result---- : ", docs); 
                //creatorId = docs.uid
                //console.log("creatorid------: ", creatorId)
                creatorId = docs.uid
                resolve()
            } 
        });
    })
}





exports.postState = async (req, res, next) => {

    //check if already votes
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    const result = await postState.find({ uid: uid1, postId: req.params.id }, async (err, docs) => {
        if (err) {
            console.log(err);
        } else {

            //finding id of the post creater
            //await findCreatorId(req.params.id)
            imgLoc = findCreatorId(req.params.id).then(async() => {

            //})
            // post.findById(req.params.id, async(err, docs) => { 
            //     if (err){ 
            //         console.log(err); 
            //         res.send(error)
            //     } 
            //     else{ 
            //         console.log("Result---- : ", docs); 
            //         creatorId = docs.uid
            //         console.log("creatorid------: ", creatorId)
            //     } 
            // });



            console.log("DOCS-----: ", docs)
            console.log("CreatorId: ", creatorId)
            console.log("state: ", docs[0].state)
            console.log(req.body.actions)
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
                    postId: req.params.id,
                    state: voteState
                }

                console.log("Post-----: ", post)

                let newUpload = new postState(post);

                try {
                    const a1 = await newUpload.save()

                    //calling updateKarma

                    updateKarma.updateKarma(creatorId, req, req.body.actions, 1)

                    res.json(a1)
                    res.send("upvoted")
                } catch (err) {
                    console.log(err)
                    res.send(err)
                }

            } else if (docs[0].state == 1 && req.body.actions == "increment" || docs[0].state == -1 && req.body.actions == "decrement") {
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
                    updateKarma.updateKarma(creatorId, req, req.body.actions, -1)
                    res.send("upvoted")
                })
            } else if(docs[0].state == 1 && req.body.actions == "decrement" || docs[0].state == -1 && req.body.actions == "increment") {
                console.log("-----DIFF VOTE-----")
                //update to make -1
                let voteState = -1
                if(req.body.actions == "increment")
                    voteState = 1

                postState.updateOne({
                    uid: uid1,
                    postId: req.params.id
                }, {
                    state: voteState
                }, function (err, result) {
                    if (err) throw err;

                    console.log(`[${req.params.id}] post edited!`)
                    if(voteState == 1 && docs[0].state == -1 || voteState == -1 && docs[0].state == 1)
                        updateKarma.updateKarma(creatorId, req, req.body.actions, 2)
                    else
                    updateKarma.updateKarma(creatorId, req, req.body.actions, 1)
                    res.send("upvoted")
                    //res.redirect("/")
                })
            }
        })
        }
    })
}