let User = require('../models/User')
exports.leaderboard = function (req, res) {
    let sort;
    action = req.query.action
    switch (action) {
        case "top":
            sort = {
                karma: -1
            }
            break;
        case "bottom":
            sort = {
                karma: 1
            }
            break;
        default:
            sort = {
                karma: -1
            }
    }

    User.find({}).sort(sort).exec(function (err, doc) {
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