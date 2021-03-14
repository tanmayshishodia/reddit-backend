const Post = require('../models/Post')
exports.getAllPosts = async function(action, req, res) {
    // let action = "createdAt"
    // switch(action)
await Post.find({}).sort({
    createdAt: '-1'
}).exec(function (err, doc) {
    if (err) throw err;

    if (doc.length) {
        res.json(doc)
    } else {
        res.status(404);
        res.json({
            error: `Unable to find posts.`
        })
    }
})
}