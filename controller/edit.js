// const Post = require('../models/Post')
// const mongoose = require('mongoose')
// const Comment = require('../models/Comment')

// //Editing Post
// exports.editPost = function (req, res) {

//     try {
//         var uid1 = req.headers.uid
//         uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
        
//         var myquery = { 
//             _id: mongoose.Types.ObjectId(req.params.id),
//             uid: uid1
//         }
//         var newvalues = {
//             $set: {
//                 caption: req.body.caption,
//                 desc: req.body.description
//             }
//         }
        

//         Post.updateOne(
//             myquery, newvalues , function (err, result) {
//             if (err)
//                 res.status(400).send("Something went wrong")
//             else
//                 res.status(200).send(result)
//         })
//     } catch(err) {
//         res.status(401).send("Unauthorized Access")
//     }

// }


// //Editing comments
// exports.editComment = function (req, res) {

//     try {
//         var uid1 = req.headers.uid
//         uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));

//         Comment.updateOne({
//             _id: mongoose.Types.ObjectId(req.params.id),
//             uid: uid1
//         }, {
//             content: req.body.content
//         }, function (err, result) {
//             if (err)
//                 res.status(400).send("Something went wrong")
//             else
//                 res.status(200).send(result)
//         })
//     } catch(err) {
//         res.status(401).send("Unauthorized Access")
//     }
    
// }