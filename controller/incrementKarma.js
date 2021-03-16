const user = require('../models/User')

exports.updateKarma = async function(id, req, state, karmaPoints) {
    console.log("state: ",state)
    if(state == "increment") {
        console.log("karma points: ",karmaPoints)
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
        console.log(karmaPoints)
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
                    console.log(`[${id}] post karma decreased!`)
                }
            }
        )
    }
}