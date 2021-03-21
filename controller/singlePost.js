// let Post = require('../models/Post')
// let PostState = require('../models/PostState')
// let User = require('../models/User')
// const mongoose = require('mongoose')

// let creatorId
// function findCreatorId(id, pid) {

//     return new Promise(async (resolve, reject) => {

//         const result = await PostState.find({ uid: id, postId: pid }, function (err, docs) {
//             if (err) {
//                 res.status(500).send(err)
//                 reject(err)
//             }
//             else {
//                 creatorId = docs
//                 resolve()
//             }
//         });
//     })
// }

// exports.singlePost = async function (req, res) {
    
//     var uid1 = req.headers.uid
//     if (uid1 == "null" || uid1 == "\"\"" || uid1 == undefined) {

//         var postWithExtra = await Post.findById(req.params.id).populate({ path: 'uid' }).exec(function (err, doc) {
//             if (err) res.status(404).send("not found");
//             else {
//                 if (doc == null) {
//                     res.status(404).send("not found");
//                 } else {
//                     append = {
//                         test: [doc._doc.uid]
//                     }
//                     map1 = { ...doc._doc, ...append }
//                     res.status(200).send(map1)
//                 }
//             }
//         })

//     } else {



//         try {
//             uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
//             imgLoc = findCreatorId(uid1, req.params.id).then(async () => {
//                 let map
//                 creatorId.forEach(element => {
//                     map = element.state
//                 });


//                 var postWithExtra = await Post.findById(req.params.id).populate({ path: 'uid' }).exec(function (err, doc) {
//                     if (err) res.status(404).send("not found");
//                     else {
//                         if (doc == null) {
//                             res.status(404).send("not found");
//                         } else {
//                             let append1 = {
//                                 test: [doc._doc.uid]
//                             }
//                             map1 = { ...doc._doc, ...append1 }
//                             let append = {
//                                 state: map
//                             }
//                             map2 = { ...map1, ...append }
//                             res.status(200).send(map2)
//                         }
//                     }
//                 })

//             })
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     }
// }