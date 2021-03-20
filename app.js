require('dotenv/config')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
//const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const connectDB = require('./config/db')
const AWS = require('aws-sdk')
const cors = require('cors')

const authorize = require('./middleware/authorize')
//const uuid = require('uuid/v4')
const {
  v4: uuid
} = require('uuid');

const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';
// Load config
dotenv.config({
  path: './config/config.env'
})

// Passport config
//require('./config/passport')(passport)

connectDB()




const app = express()


Sentry.init({
  dsn: "https://df194f4b5e9d46fdae059dc4f37ef1c5@o552997.ingest.sentry.io/5679612",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      tracing: true
    }),
    new Tracing.Integrations.Mongo()
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());




//Newly added -----------------------
let whitelist = ['http://localhost:8000', 'https://accounts.google.com/o/oauth2/v2/auth', 'http://localhost:3000', 'https://obscure-journey.herokuapp.com']

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*")
// }) 


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
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
  })
)

// Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())
app.use(express.json());

// Routes
app.use('/', require('./routes/index'))
app.use('/feed', require('./routes/api'))//DONE
app.use('/leaderboard', require('./routes/leaderboard'))//DONE
app.use('/profile', require('./routes/profile'))//DONE

//Post
app.use('/post', require('./routes/post'));

//Comment
app.use('/comment', require('./routes/comment'));


app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

/*app.listen(3000)*/

module.exports = app