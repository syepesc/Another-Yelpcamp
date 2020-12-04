const express = require('express');

// import error handler
const { asyncErrorWrapper } = require('../config/utilities/errorHandler');


// INDEX CONTROLLERS
module.exports = {

    // GET home page
    displayHomePage: asyncErrorWrapper (async (req, res) => {
        res.render('home', { title: 'Yelpcamp - Home' });
    })
}