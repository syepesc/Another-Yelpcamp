const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// import error handler
const { asyncErrorWrapper } = require('../config/utilities/errorHandler');
// import User model
const User = require('../models/user');
// import User model
const returnToPreviousURL = require('../config/utilities/passport').returnToPreviousURL;


// INDEX CONTROLLERS
module.exports = {

    // GET home page
    displayHomePage: asyncErrorWrapper (async (req, res) => {
        res.render('home', { title: 'Yelpcamp - Home' });
    }),

    // GET login page
    displayLoginPage: asyncErrorWrapper (async (req, res) => {
        res.render('user/login', { title: 'Yelpcamp - User Login' });
    }),

    // GET register page
    displayRegisterPage: asyncErrorWrapper (async (req, res) => {
        res.render('user/register', { title: 'Yelpcamp - User Registration' });
    }),

    // Register handle
    processUserRegistration: asyncErrorWrapper (async (req, res) => {
        // grab form inputs
        const { email, password } = req.body;
        let formErrors = [];

        // PASSWORD VALIDATIONS
        // check required fields
        if (!email || !password) {
            formErrors.push({ msg: 'Please fill all the require (*) fields' });
        }
        // check password length
        if(password.length < 6) {
            formErrors.push({ msg: 'Password must be at least 6 characters.' });
        }
        // check errors
        if (formErrors.length > 0) {
            res.render('user/register', {
                title: 'Yelpcamp - User Registration',
                formErrors,
                email,
                password
            });
        } else {
            // validation passed
            User.findOne({ email: email })
            .then(user => {
                // if user already exists
                formErrors.push({  msg: 'Email is already registered, please use a different one.' });
                // if user = false (user is false because the search (User.findOne) was not successfully)
                if (user) {
                    // render errors and failed to register user
                    res.render('user/register', {
                        title: 'Yelpcamp - User Registration',
                        formErrors,
                        email,
                        password
                    });
                } else {
                    const newUser = new User({
                        email,
                        password
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // set password to hashed
                        newUser.password = hash;
                        // save user
                        newUser.save()
                        .then(user => {
                            req.flash('success', 'Successfully registered!')
                            // login the user after is registered
                            req.login(newUser, err => {
                                if (err) { return next(err); } // most probably this error never trigger
                                return res.redirect('/'); //redirect to dashboard
                            });
                        })
                        .catch(err => console.log(err));
                    }));
                }
            })
            .catch(err => console.log(err));
        }
    }),

    // Login handle
    processUserLogin: asyncErrorWrapper (async (req, res, next) => {
        const redirectUrl = req.session.returnTo || '/campgrounds' // store variable
        passport.authenticate('local', {
            successRedirect: redirectUrl,
            successFlash: true,
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }),

    // Logout handle
    performLogout: asyncErrorWrapper (async (req, res) => {
        req.logOut();
        req.flash('success', 'Logout successfully');
        res.redirect('/campgrounds');
    })
}