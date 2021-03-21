let Comment = require('../models/Comment')
let Post = require('../models/Post')
let CommentState = require('../models/CommentState')
let User = require('../models/User')
const mongoose = require('mongoose')
const updateKarma = require('./incrementKarma')



//----------------------------------------GET ALL COMMENTS/REPLIES OF SINGLE POST/COMMENT-----------------------------------------

//Get all Comments/Replies of a particular post/comment
let creatorId
function findCreatorId(id) {

    return new Promise(async (resolve, reject) => {

        const result = await CommentState.find({ uid: id }, function (err, docs) {
            if (err) {
                res.status(500).send(err)
                reject(err)
            }
            else {
                creatorId = docs
                resolve()
            }
        });
    })

}



exports.getAllComments = function (req, res) {

    let findParameters
    if(req.params.pid == undefined) {
        findParameters = {
            postId: req.params.id
        }
    }
    else {
        findParameters = {
            parentId: req.params.pid
        }
    }

    if(req.body.parameter == "single") {
        findParameters = {
            _id: req.params.id
        }
    }

    var uid1 = req.headers.uid
    if (uid1 == "null" || uid1 == "\"\"" || uid1 == undefined) {

        Comment.find(findParameters).populate({
            path: 'uid'
        }).exec(function (err, doc) {
            if (err) {
                res.status(404).send("Not found")
            } else {
                if (doc.length) {
                    res.send(doc)
                } else {
                    res.status(404).send("Not found")
                }
            }
        })

    } else {

        try {

            uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
            imgLoc = findCreatorId(uid1).then(async () => {
                let map = {}
                creatorId.forEach(element => {
                    map[element.commentId] = element.state
                });
                Comment.find(findParameters).populate({
                    path: 'uid'
                }).exec(function (err, doc) {
                    if (err) throw err;
                    if (doc.length) {
                        let map1 = doc.concat(map)
                        res.send(map1)
                    } else {
                        res.status(404);
                        res.send({
                            error: `Unable to find posts.`
                        })
                    }
                })
            })

        } catch(err) {
            res.send(401).send("unauthorized access")
        }

    }
}



//---------------------------------------------EDIT COMMENTS/REPLY--------------------------------------------------

//Editing comments
exports.editComment = function (req, res) {

    try {
        var uid1 = req.headers.uid
        uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));

        Comment.updateOne({
            _id: mongoose.Types.ObjectId(req.params.id),
            uid: uid1
        }, {
            content: req.body.content
        }, function (err, result) {
            if (err)
                res.status(400).send("Something went wrong")
            else
                res.status(200).send(result)
        })
    } catch(err) {
        res.status(401).send("Unauthorized Access")
    }
    
}

//---------------------------------------------DELETE COMMENTS/REPLY--------------------------------------------------

function del(deleteParameter, id) {
    Comment.deleteOne(deleteParameter, function (err) {
        if (err)
            return 0
        else
            return 1
    });
}

//Deleting comment
exports.deleteComment = function (req, res) {

    try {
        var uid1 = req.headers.uid
        uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
        deleteParameter = {
            uid: uid1,
            _id: req.params.id
        }
        var deleted = del(deleteParameter)
        if(deleted == 0)
            res.status(404).send("not found")
        else {
            deleteParameter = {
                parentId: req.params.id
            }
            del(deleteParameter)
            res.send("Deleted")
        }
    } catch (err) {
        res.status(404).send("Not found")
    }

}

//---------------------------------------------POST COMMENTS/REPLY--------------------------------------------------

function findCreatorId1(id) {

    return new Promise((resolve, reject) => {
        Post.findById(id, async (err, docs) => {
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

function findCreatorId2(id) {

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

exports.postComment = async (req, res, next) => {

    try {
        var uid1 = req.headers.uid
        uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
        const content = req.body.content
        const postId = req.body.id
        let parentId = null
        if (req.body.pid != "null")
            parentId = req.body.pid
        const votes = 0

        post = {
            uid: uid1,
            content: content,
            postId: postId,
            votes: votes,
            parentId: parentId
        }


        //upload to mongo
        let commentUpload = new Comment(post);
        try {
            const a1 = await commentUpload.save()
            imgLoc = findCreatorId1(req.body.id).then(async () => {
                updateKarma.updateKarma(creatorId, req, "increment", 2)
                if(req.body.pid != "null") {
                    imgLoc = findCreatorId2(req.body.pid).then(async () => {
                        updateKarma.updateKarma(creatorId, req, "increment", 1)
                        res.send(a1)
                    })
                } else
                    res.send(a1)
            })
        } catch (err) {
            res.status(400).send(err)
        }
    } catch(err) {
        res.status(400).send(err)
    }

}