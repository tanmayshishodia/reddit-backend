const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')
const post = require('../models/Post')

exports.postStateTest = async(req, res, next) => {
        const result = await post.find({ uid: '1', caption: 'Hi'}, function (err, docs) { 
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
    console.log("Hi")
    //result.forEach(function(doc, err) {
        console.log("Hello")
        console.log(doc)
    //})
    console.log("Bye")
}