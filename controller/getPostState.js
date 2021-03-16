const fs = require('fs')
const user = require('../models/User')
const postState = require('../models/PostState')
const post = require('../models/Post')
const mongoose = require('mongoose')

const updateKarma = require('./incrementKarma')
const { Interface } = require('readline')
const { error } = require('console')

exports.postState = async(req, res, next) => {
    var uid1 = req.headers.uid
    uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
    
    const result = await postState.find({ uid: uid1 }, function (err, docs) { 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            res.send(docs)
        } 
    });
    //})
    console.log("Bye")
}