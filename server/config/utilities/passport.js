/* 
this passport config could goes in the app.js file
we are using separate file for better understanding
*/

const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


// Create User schema instance
const User = require('../../models/user');

module.exports = function(passport) {
    // Start passport
    passport.use(
        // use passport local strategy
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({ email: email })
            .then(user => {
                if(!user) {
                    return done(null, false, { message: 'That email is not registered' });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user, { message: 'Welcome Back!' });
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                });
            })
            // if no user found -> catch error
            .catch(err => console.log(err));
        })
    );

    // link user to current session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // take out user from session
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports.ensureAuthentication = function(req, res, next) {
    console.log('REQ.USER...', req.user);
    if(req.isAuthenticated()) {
        return next();
    } else {
        // create new field in session object to return to the page requested before the authentication 
        req.session.returnTo = req.originalUrl; // its recommended to delete this field using: delete req.session.returnTo
        req.flash('error', 'Please login to access this page');
        res.redirect('/users/login');
    }
}
