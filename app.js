require('dotenv/config')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const connectDB = require('./config/db')
const AWS = require('aws-sdk')
const cors = require('cors')
//const uuid = require('uuid/v4')
const { v4: uuid } = require('uuid');

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()


//Newly added -----------------------
let whitelist = ['http://localhost:8000', 'https://accounts.google.com/o/oauth2/v2/auth']

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var message = 'The CORS policy for this origin doesn ' +
        'allow access from the particular origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));
//end -------------------------------

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //store: MongoStore.create({ mongooseConnection: mongoose.connection }),
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json());

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/feed', require('./routes/api'))
app.use('/leaderboard', require('./routes/leaderboard'))
app.use('/profile', require('./routes/profile'))

// const PORT = process.env.PORT || 3000



// const server = app.listen(
//   PORT,
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// )

module.exports = app