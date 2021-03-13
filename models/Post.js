const mongoose = require('mongoose')

//User POST
const PostSchema = new mongoose.Schema({
    uid : {
        type: "String",//mongoose.Schema.Types.ObjectId,
        //ref: 'User',
        required: true
    },
    caption : {
        type: String,
        unique: false,
        required: true
    },
    desc : {
        type: String,
        unique: false,
        required: false
    },
    Etag : {
        type : String,
        unique: false,
        required: false
    },
    Location : {
        type : String,
        unique: false,
        required: false
    },
    key : {
        type : String,
        unique: false,
        required: false
    },
    bucket : {
        type : String,
        unique: false,
        required: false
    },
    filename : {
        type: String,
        unique: false,
        required: false
    },
    votes : {             
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  })
  
  //use uploadPostModel to post.
  module.exports = mongoose.model('Post', PostSchema)