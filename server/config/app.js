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
const { isEmptyObject } = require('jquery');
require('dotenv').config();

// Initialize app with express
const app = express();
console.log('App Started...');



//////////////////////////////////////////////////////////////////////////////////////////
// CONFIGURATIONS
//////////////////////////////////////////////////////////////////////////////////////////

// DB Config
const DB = process.env.MONGO_URI;
// Connect to Mongo
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true});

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

// Method Override
app.use(methodOverride('_method'));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // does not reveal cookies in case of cross scripting flaw 
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
  if (!['/login'].includes(req.originalUrl)) {
    if (req.query.isEmpty) {
      req.session.returnTo = req.originalUrl; 
    } else {
      req.session.returnTo = req.path;
    }
  };
  
  res.locals.user = req.user ? req.user : ''; // pass user on each request
  res.locals.success = req.flash('success'); // flash success messages
  res.locals.error = req.flash('error'); // flash error messages
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