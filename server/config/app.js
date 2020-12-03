//////////////////////////////////////////////////////////////////////////////////////////
// THIRD PARTY MODULES
//////////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
let path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
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
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true});
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'DB Connection Error: '));
mongoDB.once('open', ()=>{
  console.log('Connected to MongoDB...');
});
// create seed data - ONCE
//const generateSeedDB = require('./seeds/index').seedDB;
//generateSeedDB().then(() => {mongoDB.close()});

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






// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  res.status(404);
  res.render('error', { message: err.message });
  next();
});


//////////////////////////////////////////////////////////////////////////////////////////
// ERROR HANDLER
//////////////////////////////////////////////////////////////////////////////////////////
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;