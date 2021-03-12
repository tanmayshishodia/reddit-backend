exports.updateKarma = async function(id, req, state) {
    if(state == "increment") {
        user.updateOne(
            {_id: id},
            {
                $inc: {
                    karma: +1
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
                    karma: -1
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