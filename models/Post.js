const mongoose = require('mongoose')

//User POST
const uploadPostSchema = new mongoose.Schema({
    uid : {
        type: String,
        unique: false,
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
    filename : {
        type: String,
        unique: true,
        required: false
    },
    contentType : {
        type: String,
        required: false
    },
    imageBase64 : {
        type: String,
        required: false
    },
    votes : {             
        type: Number,
        required: true,
    }
  })
  
  //use uploadPostModel to post.
  module.exports = uploadPostModel = mongoose.model('Post_uploads', uploadPostSchema);