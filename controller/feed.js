let Post = require('../models/Post')
let PostState = require('../models/PostState')
let User = require('../models/User')
const mongoose = require('mongoose')

let creatorId
function findCreatorId(id) {

    return new Promise(async (resolve, reject) => {

        const result = await PostState.find({ uid: id }, function (err, docs) {
            if (err) {
                //console.log(err);
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

exports.getAllPosts = function (req, res) {
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
        Post.aggregate([{
            $lookup: {
                from: "users",
                localField: "uid",
                foreignField: "_id",
                as: "test"
            }
        }]).sort(sort).exec(function (err, doc) {
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
                    map[element.postId] = element.state
                });

                Post.aggregate([{
                    $lookup: {
                        from: "users",
                        localField: "uid",
                        foreignField: "_id",
                        as: "test"
                    }
                }]).sort(sort).exec(function (err, doc) {
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
        } catch (err) {
            res.status(400).send(err)
        }
    }
}