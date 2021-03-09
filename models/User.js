const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
//keep a name for this operation
module.exports = mongoose.model('User', UserSchema)


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