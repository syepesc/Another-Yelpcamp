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
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log('Connected to MongoDB...');
  // create seed data - ONCE
  const generateSeedDB = require('./utilities/seedDB/index').seedDB;
  generateSeedDB().then(() => {mongoose.connection.close()});
})
.catch(e => {throw new ExpressError(500, e.message)});


// EJS Config
app.use(expressLayouts);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');



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
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
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