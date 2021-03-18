let Post = require('../models/Post')
let PostState = require('../models/PostState')
let User = require('../models/User')
const mongoose = require('mongoose')

let creatorId
function findCreatorId(id, pid) {

    return new Promise(async (resolve, reject) => {

        const result = await PostState.find({ uid: id , postId: pid }, function (err, docs) {
            if (err) {
                console.log(err);
                res.status(500).send(err)
                reject(err)
            }
            else {
                console.log("Result---- : ", docs);
                creatorId = docs
                console.log("docs: ", docs)
                resolve()
            }
        });
    })
}

exports.singlePost = function (req, res) {
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
    console.log("UID:---------> ", uid1)
    if (uid1 == undefined)
        console.log("UNDEFINED")
    if (uid1 == "null" || uid1 == "\"\"" || uid1 == undefined) {
        console.log("\n\n\nyayeyeyebeebbeveubveuue_)))))))))))))))))000000000000\n\n")
        
        
        Post.findById(req.params.id, function (err, docs) { 
            if (err){ 
                res.status(404).send("not found")
            } 
            else{ 
                res.status(200).send(docs)
            } 
        }); 

    } else {



        try {
            uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
            console.log("uid:> ", uid1)
            imgLoc = findCreatorId(uid1, req.params.id).then(async () => {
                console.log("--------", creatorId, "----------")
                let map
                creatorId.forEach(element => {
                    map = element.state
                });
                console.log(map)


                Post.findById(req.params.id, function (err, doc) { 
                    if (err){ 
                        res.status(404).send("not found")
                    } 
                    else{
                        append = {
                            state: map
                        }
                        map1 = {...doc._doc, ...append}
                        console.log(typeof (map1))
                        res.status(200).send(map1)
                    } 
                }); 

             })
        } catch (err) {
            res.status(400).send(err)
        }
    }
}