const express = require('express');

// import campground model
const Campground = require('../models/campground');


// INDEX CONTROLLERS
module.exports = {

    // GET home page
    displayHomePage: (req, res) => {
        res.render('home', { title: 'Yelpcamp - Home' });
    },

    // GET campgrounds page
    displayCampgroundsPage: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campground/index', { title: 'Yelpcamp - Campgrounds', campgrounds: campgrounds });
    }
}