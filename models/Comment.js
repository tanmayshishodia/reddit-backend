const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        default: 0
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    votes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Comment', CommentSchema)