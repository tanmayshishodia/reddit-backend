// const Post = require('../models/Post')
// const mongoose = require('mongoose')
// const Comment = require('../models/Comment')


// //Deleting Post
// exports.deletePost = function (req, res) {

//     try {
//         var uid1 = req.headers.uid
//         uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
//         Post.deleteOne({ uid: uid1, _id: req.params.id }, function (err) {
//             if (err)
//                 res.status(204).send("Not found")
//             else {
//                 Comment.deleteMany({ uid: uid1, postId: req.params.id }, function (err) {
//                     if (err) {
//                         res.send("Deletion Successful")
//                     } else {
//                         res.status(200).send("Deletion Successful")
//                     }
//                 });
//             }
//         });
//     } catch (err) {
//         res.status(401).send("Unauthorized Access")
//     }

// }



// //Deleting comment
// exports.deleteComment = function (req, res) {

//     try {
//         var uid1 = req.headers.uid
//         uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
//         Comment.deleteOne({ uid: uid1, _id: req.params.id }, function (err) {
//             if (err)
//                 res.status(204).send("Not found")
//             else
//                 res.status(200).send("deleted")
//         });
//     } catch (err) {
//         res.status(404).send("Not found")
//     }

// }