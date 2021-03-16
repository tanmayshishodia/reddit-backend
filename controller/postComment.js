const fs = require('fs')
const user = require('../models/User')
const comment = require('../models/Comment')
const post = require('../models/Post')
const updateKarma = require('./incrementKarma')


let creatorId
function findCreatorId(id) {

    return new Promise((resolve, reject) => {
        post.findById(id, async (err, docs) => {
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

exports.postComment = async (req, res, next) => {
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    const content = req.body.content
    const postId = req.params.id
    const parentId = null
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
        const a1 = await newUpload.save()
        imgLoc = findCreatorId(req.params.id).then(async () => {
            updateKarma(creatorId, req, "increment", 2)
            res.send("Done")
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}