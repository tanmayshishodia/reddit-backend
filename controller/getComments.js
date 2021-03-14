let Comment = require('../models/Comment')
let User = require('../models/User')
exports.getAllComments = function (req, res) {
    let sort;
    action = req.query.action
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
        default:
            sort = {
                votes: -1
            }
    }

    Comment.aggregate([{
        $lookup: {
            from: "users",
            localField: "uid",
            foreignField: "_id",
            as: "test"
        }
    }]).sort(sort).exec(function (err, doc) {
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


