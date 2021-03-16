const fs = require('fs')
const user = require('../models/User')
const comment = require('../models/Comment')
const Post = require('../models/Post')
const updateKarma = require('./incrementKarma')
const mongoose = require('mongoose')
const Comment = require('../models/Comment')


let creatorId
function findCreatorId(id) {

    return new Promise((resolve, reject) => {
        Post.findById(id, async (err, docs) => {
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

// function findCreatorId(id) {

//     return new Promise((resolve, reject) => {
//         Comment.findById(id, async (err, docs) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send(err)
//                 reject(err)
//             }
//             else {
//                 console.log("Result---- : ", docs);
//                 //creatorId = docs.uid
//                 //console.log("creatorid------: ", creatorId)
//                 creatorId = docs.uid
//                 resolve()
//             }
//         });
//     })
// }

exports.postComment = async (req, res, next) => {
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    const content = req.body.content
    const postId = req.params.id
    let parentId = null
    if (req.params.pid != "null")
        parentId = req.params.pid
    const votes = 0

    post = {
        uid: uid1,
        content: content,
        postId: postId,
        votes: votes,
        parentId: parentId
    }

    //upload to mongo
    let commentUpload = new comment(post);

    try {
        const a1 = await commentUpload.save()
        imgLoc = findCreatorId(req.params.id).then(async () => {
            updateKarma.updateKarma(creatorId, req, "increment", 2)
            if(req.params.pid != "null") {
                imgLoc = findCreatorId(req.params.pid).then(async () => {
                    updateKarma.updateKarma(creatorId, req, "increment", 1)
                    res.send("Done")
                })
            } else
            res.send("Done")
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}