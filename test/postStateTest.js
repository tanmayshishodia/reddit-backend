const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')
const post = require('../models/Post')

exports.postStateTest = async(req, res, next) => {
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
        const result = await post.find({ uid: uid1}, function (err, docs) { 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("First function call : ", docs); 
            docs.forEach(function(doc, err) {
                if(doc.uid == '1')
                    console.log("---------------")
            })
        } 
    });
    console.log(result)
    //result.forEach(function(doc, err) {
        console.log("Hello")
        console.log(doc)
    //})
    console.log("Bye")
}