//////////////////////////////////////////////////////////////////////////////////////////
// THIRD PARTY MODULES
//////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
let path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const { ExpressError } = require('./utilities/errorHandler');
const logger = require('morgan');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const { Cookie } = require('express-session');
const passport = require('passport');
const chalk = require('chalk');
const  mongoSanitize = require('express-mongo-sanitize');
const mongoSessionStorage = require('connect-mongo')(session);
const helmet = require('helmet');
require('dotenv').config();

// Initialize app with express
const app = express();
console.log('App Started...');



//////////////////////////////////////////////////////////////////////////////////////////
// CONFIGURATIONS
//////////////////////////////////////////////////////////////////////////////////////////

// DB Config
const DB_URL = process.env.MONGO_URL;
// Connect to Mongo
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error: '));
mongoDB.once('open', ()=>{
  console.log('Connected to MongoDB...');
}).then(() => {
  // create seed data - ONCE
  //const generateSeedDB = require('./utilities/seedDB/index').seedDB;
  //generateSeedDB().then(() => {mongoDB.close().then(() => console.log('MongoDB connection closed.'))});
}).catch(e => {throw new ExpressError(500, e.message)});

// EJS Config
app.use(expressLayouts);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Passport config
require('./utilities/passport')(passport);


//////////////////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE
//////////////////////////////////////////////////////////////////////////////////////////

// Body parser
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../node_modules'))); // added to predetermine the path for libraries used inside node modules
app.use(express.static(path.join(__dirname, '../../public'))); // added to predetermine the path for libraries used inside node modules

// Security
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
// TO PREVENT ALL THE ABOVE WE USE HELMET AND BY DEFAULT PREVENTS "EVERYTHING"
// app.use(helmet.contentSecurityPolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "blob:", "data:"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
        "https://images.unsplash.com/"
      ],
      fontSrc: ["'self'", ...fontSrcUrls]
    },
  })
);

app.use(mongoSanitize()); // TO PREVENT MONGO INJECTION ATTACK
// TODO - MISSING CROSS SITE SCRIPTING - XSS

// Method Override
app.use(methodOverride('_method'));

// Express session
app.use(session({
  store: new mongoSessionStorage({
    url: process.env.MONGO_URL,
    touchAfter: 24 * 60 * 60 // prevent store of session until one day has passed
  }),
  name: 'sessionId',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  cookie: {
    httpOnly: true, // does not reveal cookies in case of cross scripting flaw 
    // secure: true, // this mean that cookies could only be change using HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // (1 week) // milliseconds * seconds * minutes * hours * days
    maxAge: 1000 * 60 * 60 * 24 * 7 // (1 week)
  }
}));

// Connect flash
app.use(flash());

// Passport - must be AFTER express session
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  // fix for redirecting url
  if (!['/login', '/', '/favicon.ico'].includes(req.originalUrl)) {
    if (req.query.isEmpty) {
      req.session.returnTo = req.originalUrl; 
    } else {
      req.session.returnTo = req.path;
    }
  };

  res.locals.user = req.user ? req.user : ''; // pass user on each request
  res.locals.success = req.flash('success'); // flash success messages
  res.locals.error = req.flash('error'); // flash error messages
  console.log(chalk.green('//// SESSION:'));
  console.dir(req.session);
  next();
});

// Routes
app.use('/', require('../routes/index'));
app.use('/campgrounds', require('../routes/campground'));
app.use('/campgrounds/:id/reviews', require('../routes/review'));




//////////////////////////////////////////////////////////////////////////////////////////
// ERROR HANDLER
//////////////////////////////////////////////////////////////////////////////////////////

// catch 404
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
})

// handle error
app.use(function(err, req, res, next) {
  const { statusCode = 500, message = 'Something went wrong!' } = err;
  res.status(statusCode);
  res.render('error', { error: err });
});


module.exports = app;