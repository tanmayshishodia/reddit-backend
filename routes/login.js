const User = require('../models/User')
exports.login = async(req, res, next) => {
    console.log(req.body.profileObj.googleId)
    // var data = req.body
    // console.log(data)
    const newUser = {
        googleId: req.body.profileObj.googleId,
        displayName: req.body.profileObj.name,
        firstName: req.body.profileObj.givenName,
        lastName: req.body.profileObj.familyName,
        image: req.body.profileObj.imageUrl,
        email: req.body.profileObj.email
      }
      console.log(newUser)
      try {
        let user = await User.findOne({ googleId: req.body.profileObj.googleId })
        var firstLogin;
        console.log(user)
        if (user) {
          firstLogin = 0;
          req.session.uid = user._id
        } else {
            user = await User.create(newUser)
            user = await User.findOne({ googleId: req.body.profileObj.googleId })
            req.session.uid = user._id
            firstLogin = 1;
          }

          data = {user,firstLogin}
          console.log(data)
          res.send(data)
      } catch (err) {
        console.error(err)
      }
}