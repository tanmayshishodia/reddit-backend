const mongoose = require('mongoose')
const User = require('../models/User')


//Priviledged operations
module.exports = () => {
    return (req, res, next) => {
        var uid1 = req.headers['uid']
        if(!uid1 || uid1 == "\"\"" || uid1 == undefined || uid1 == null || uid1.length <10) {
            console.log("First line of defence")
            return res.status(401).send("err")
        } else {
            try {
                console.log("try")
                uid1 = mongoose.Types.ObjectId(uid1.substring(1, uid1.length - 1));
                console.log("uid1: ", uid1)
                User.findById(uid1, function (err, docs) { 
                    if (err){ 
                        console.log(err); 
                        res.status(401).send(err)
                    } 
                    else{
                        console.log("Result : ", docs);
                        if(!docs) {
                            console.log("docs empty")
                            res.status(401).send("err")
                        } else {
                            next()
                        }
                    } 
                });
            } catch(err) {
                console.log("catch")
                res.status(401).send(err)
            }
            console.log(uid1)
            //next()
        }
    }
}