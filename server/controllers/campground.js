const express = require('express');

// import campground model
const Campground = require('../models/campground');


// CAMPGROUNDS CONTROLLERS
module.exports = {

    // GET campgrounds index page
    displayCampgroundsIndex: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campground/index', { title: 'Yelpcamp - Campgrounds', campgrounds: campgrounds });
    },

    // GET campground by ID page
    displayCampgroundById: async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campground/show', { title: `Yelpcamp - ${campground.title} Campground`, campground: campground });
    },

    // GET add campground page
    displayAddCampground: async (req, res) => {
        res.render('campground/add', { title: `Yelpcamp - Add new Campground` });
    },

    // POST add campground page
    processAddCampground: async (req, res) => {
        const newCampground = new Campground(req.body);
        console.log(`new campground: ${newCampground}`);
        await newCampground.save();
        res.redirect(`/campgrounds/${newCampground._id}`);
    },

    // GET edit campground page
    displayEditCampground: async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campground/edit', { title: `Yelpcamp - Edit Campground`, campground: campground });
    },

    // PUT edit campground page
    processEditCampground: async (req, res) => {
        const id = req.params.id; // extract the id from the req.body
        const updatedCampground = await Campground.findByIdAndUpdate(id, req.body); // ... destruct the req.body object (obtain all fields of the form)
        res.redirect(`/campgrounds/${updatedCampground._id}`);
    },

    // DELETE delete campground page
    processDeleteCampground: async (req, res) => {
        const id = req.params.id; // extract the id from the req.body
        const updatedCampground = await Campground.findByIdAndDelete(id); // ... destruct the req.body object (obtain all fields of the form)
        res.redirect('/campgrounds');
    }
}