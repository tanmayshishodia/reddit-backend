const mongoose = require('mongoose')

const CommentStateSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    state: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('CommentState', CommentStateSchema)