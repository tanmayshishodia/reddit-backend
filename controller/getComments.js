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
    if (uid1 == "null" || uid1 == "\"\"" || uid1 == undefined) {
        Comment.find({ postId: req.params.id, parentId: null }).populate({
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
            imgLoc = findCreatorId(uid1).then(async () => {
                let map = {}
                creatorId.forEach(element => {
                    map[element.commentId] = element.state
                });
                Comment.find({ postId: req.params.id, parentId: null }).populate({
                    path: 'uid'
                }).sort(sort).exec(function (err, doc) {
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



