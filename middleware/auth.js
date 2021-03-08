module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      } else {
        res.redirect('/') //if user not authenticated redirect to login
      }
    },
    ensureGuest: function (req, res, next) {
      if (!req.isAuthenticated()) {
        return next()
      } else {
        res.redirect('/dashboard'); //is user authenticated redirect to dasboard
      }
    },
  }
  