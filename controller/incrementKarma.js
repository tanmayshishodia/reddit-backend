const user = require('../models/User')

exports.updateKarma = async function(id, req, state, karmaPoints) {
    if(state == "increment") {
        user.updateOne(
            {_id: id},
            {
                $inc: {
                    karma: +karmaPoints
                }
            },
            function (err, result) {
                if (err) throw err;

                if (result) {
                    console.log(`[${id}] post karma increased!`)
                }
            }
        )
    } else {
        user.updateOne(
            {_id: id},
            {
                $inc: {
                    karma: -karmaPoints
                }
            },
            function (err, result) {
                if (err) throw err;

                if (result) {
                    console.log(`[${id}] post karma increased!`)
                }
            }
        )
    }
}