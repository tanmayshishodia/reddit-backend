let Post = require('../models/Post')
let PostState = require('../models/PostState')
let User = require('../models/User')
const mongoose = require('mongoose')

let creatorId
function findCreatorId(id) {

    return new Promise(async(resolve, reject) => {

        const result = await PostState.find({ uid: id}, function (err, docs) { 
            if (err){ 
                console.log(err);
                res.status(500).send(err)
                reject(err)
            } 
            else{ 
                console.log("Result---- : ", docs); 
                creatorId = docs
                console.log("docs: ", docs)
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
                votes: -1
            }
    }


    var uid1 = req.headers.uid
    if(uid1 == "\"\"") {
        console.log("\n\n\nyayeyeyebeebbeveubveuue_)))))))))))))))))000000000000\n\n")
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
                console.log(doc)
                console.log(typeof(doc))
                res.send(doc)
            } else {
                res.status(404);
                res.send({
                    error: `Unable to find posts.`
                })
            }
        })
    } else {
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    console.log("uid: ", uid1)
    imgLoc = findCreatorId(uid1).then(async() => {
        console.log("--------", creatorId, "----------")
        let map = {}
        creatorId.forEach(element => {
            map[element.postId] = element.state
            //console.log("key: ", element.postId, "value: ", element.state)
        });
        console.log(map)

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
                console.log("doc: ", doc)
                let map1 = doc.concat(map)
                console.log(typeof(map1))
                res.send(doc)
            } else {
                res.status(404);
                res.send({
                    error: `Unable to find posts.`
                })
            }
        })

    })

    /*Post.aggregate([{
        $lookup: {
            from: "users",
            localField: "uid",
            foreignField: "_id",
            as: "test"
        }
    }]).sort(sort).exec(function (err, doc) {
        if (err) throw err;
        if (doc.length) {
            var i = 0
            doc.forEach(element => {
                i++
                console.log("h ", element)
            })
            res.send(doc)
        } else {
            res.status(404);
            res.send({
                error: `Unable to find posts.`
            })
        }
    })*/
}
}