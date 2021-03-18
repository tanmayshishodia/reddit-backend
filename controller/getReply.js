let Comment = require('../models/Comment')
let Post = require('../models/Post')
let CommentState = require('../models/CommentState')
let User = require('../models/User')
const mongoose = require('mongoose')


let creatorId
function findCreatorId(id) {

    return new Promise(async (resolve, reject) => {

        const result = await CommentState.find({ uid: id }, function (err, docs) {
            if (err) {
                console.log(err);
                res.status(500).send(err)
                reject(err)
            }
            else {
                console.log("docs---- : ", docs);
                creatorId = docs
                console.log("creatorId: ", creatorId)
                resolve()
            }
        });
    })
}



exports.getAllReplies = function (req, res) {
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
                createdAt: -1
            }
    }

    var uid1 = req.headers.uid
    console.log("UID:---------> ", uid1)
    if (uid1 == undefined)
        console.log("UNDEFINED")
    if (uid1 == "null" || uid1 == "\"\"" || uid1 == undefined) {
        Comment.find({ parentId: req.params.id }).populate({
            path: 'uid'
        }).sort(sort).exec(function (err, doc) {
            if (err) throw err;
            if (doc.length) {
                res.send(doc)
            } else {
                res.status(404);
                res.send({
                    error: `Unable to find posts.`
                })
            }
        })
    } else {
        try {
            uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
            console.log("uid:> ", uid1)
            imgLoc = findCreatorId(uid1).then(async () => {
                console.log("--------", creatorId, "----------")
                let map = {}
                creatorId.forEach(element => {
                    map[element.commentId] = element.state
                    //console.log("key: ", element.postId, "value: ", element.state)
                });
                console.log(map)
                Comment.find({ parentId: req.params.id }).populate({
                    path: 'uid'
                }).sort(sort).exec(function (err, doc) {
                    if (err) throw err;
                    if (doc.length) {
                        console.log("doc: ", doc)
                        let map1 = doc.concat(map)
                        console.log(typeof (map1))
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



