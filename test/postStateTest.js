const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')

exports.postStateTest = async(req, res, next) => {
        const result = await postState.find({ uid: '6045fd1e46373130ec9d2431'}, function (err, docs) { 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("First function call : ", docs); 
        } 
    });
    console.log("Hi")
    result.forEach(function(doc, err) {
        console.log("Hello")
        console.log(doc)
    })
    console.log("Bye")
}