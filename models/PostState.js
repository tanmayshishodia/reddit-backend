const mongoose = require('mongoose')

const PostStateSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    state: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('PostState', PostStateSchema)