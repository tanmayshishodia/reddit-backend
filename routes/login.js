const User = require('../models/User')
exports.login = async(req, res, next) => {
    const newUser = {
        googleId: req.body.profileObj.googleId,
        displayName: req.body.profileObj.name,
        firstName: req.body.profileObj.givenName,
        lastName: req.body.profileObj.familyName,
        image: req.body.profileObj.imageUrl,
        email: req.body.profileObj.email
      }

      try {
        let user = await User.findOne({ googleId: profile.id })

        if (user) {
            login = {
                login: 1
            }
            user = { ...user, ...login }
          res.send(user)
        } else {
            login = {
                login: 0
            }
            user = { ...user, ...login }
          user = await User.create(newUser)
          res.send(user)
        }
      } catch (err) {
        console.error(err)
      }
}