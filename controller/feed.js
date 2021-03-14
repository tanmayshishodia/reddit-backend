const Post = require('../models/Post')
exports.getAllPosts = async function (action, req, res) {
    // let action = "createdAt"
    // switch(action)

    switch (action) {
        case "top":
            sort = {
                votes: -1
            }
            break;
        case "recent":
            sort = {
                createdAt: -1
            }
            break;
        case "old":
            sort = {
                createdAt: 1
            }
            break;
    }

    await Post.find({}).sort(sort).exec(function (err, doc) {
        if (err) throw err;

        if (doc.length) {
            res.send(doc)
        } else {
            res.status(404);
            res.send({
                error: `Unable to find posts.`
            })
        }
    })
}