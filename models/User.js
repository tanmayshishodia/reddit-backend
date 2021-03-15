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
  username: {
    type: String,
    //required: true,
  },
  dob: {
    type: String
    //required: true,
  },
  karma: {
    type: Number,
    default: 0
  },
  badge: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  }
})
//keep a name for this operation
module.exports = mongoose.model('User', UserSchema)