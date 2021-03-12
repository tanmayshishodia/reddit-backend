const mongoose = require('mongoose')

//User POST
const uploadPostSchema = new mongoose.Schema({
    uid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    }
  })
  
  //use uploadPostModel to post.
  module.exports = uploadPostModel = mongoose.model('Post_uploads', uploadPostSchema);