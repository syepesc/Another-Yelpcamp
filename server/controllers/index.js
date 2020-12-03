const express = require('express');


// INDEX CONTROLLERS
module.exports = {

    // GET home page
    displayHomePage: (req, res) => {
        res.render('home', { title: 'Yelpcamp - Home' });
    }
}