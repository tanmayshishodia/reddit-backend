const fs = require('fs')
const user = require('../models/User')
const comment = require('../models/Comment')
const post = require('../models/Post')
const updateKarma = require('./incrementKarma')

exports.postComment = async(req, res, next) => {
    const uid = req.session.uid
    const content = req.body.content
    const postId = req.params.id
    const parentId = null
    if(req.params.pid != null)
        parentId = req.params.pid
    const votes = 0

    post = {
        uid: uid,
        content: content,
        postId: postId,
        votes: votes,
        parentId: parentId
    }

    //upload to mongo
    let commentUpload = new comment(post);

    try {
        const a1 = await newUpload.save()

        //calling updateKarma
        updateKarma("req.session.uid", req, "increment")

        res.json(a1)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
}