const express = require('express');


// INDEX CONTROLLERS
module.exports = {

    // GET home page
    displayHomePage: (req, res, next) => {
        res.render('index', { title: 'Express' });
    }
}