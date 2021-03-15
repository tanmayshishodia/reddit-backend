const User = require('../models/User')
exports.login = async(req, res, next) => {
    // const newUser = {
    //     googleId: req.body.profile.id,
    //     displayName: profile.displayName,
    //     firstName: profile.name.givenName,
    //     lastName: profile.name.familyName,
    //     image: profile.photos[0].value,
    //   }

    //   try {
    //     let user = await User.findOne({ googleId: profile.id })

    //     if (user) {
    //         login = {
    //             login: 1
    //         }
    //         user = { ...user, ...login }
    //       res.send(user)
    //     } else {
    //         login = {
    //             login: 0
    //         }
    //         user = { ...user, ...login }
    //       user = await User.create(newUser)
    //       res.send(user)
    //     }
    //   } catch (err) {
    //     console.error(err)
    //   }
}