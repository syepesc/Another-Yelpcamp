const express = require('express');
const chalk = require('chalk');

// import campground model
const Campground = require('../models/campground');
// import error handler
const { asyncErrorWrapper } = require('../config/utilities/errorHandler');
// import cloudinary
const { cloudinary } = require('../config/utilities/cloudinary');



// CAMPGROUNDS CONTROLLERS
module.exports = {

    // GET campgrounds index page
    displayAllCampgrounds: asyncErrorWrapper (async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campground/index', { title: 'Yelpcamp - Campgrounds', campgrounds: campgrounds });
    }),

    // GET campground by ID page
    displayCampgroundById: asyncErrorWrapper (async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate({
            // populate review author (mongo commands)
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author'); // <- populate campground author

        if(!campground) {
            req.flash('error', 'Cannot find that Campground!');
            return res.redirect('/campgrounds');
        };
        res.render('campground/show', { title: `Yelpcamp - ${campground.title} Campground`, campground: campground });
    }),

    // GET add campground page
    displayAddCampground: asyncErrorWrapper (async (req, res) => {
        res.render('campground/add', { title: `Yelpcamp - Add new Campground` });
    }),

    // POST add campground page
    addCampground: asyncErrorWrapper (async (req, res) => {
        const newCampground = new Campground(req.body);
        newCampground.images = req.files.map(file => ({ url: file.path, filename: file.filename })); // with cloudinary + multer we got now access to 'files' field on the req object to extract the image data
        newCampground.author = req.user._id;
        console.log(`new campground: ${newCampground}`);
        await newCampground.save();
        req.flash('success', 'Campground created!');
        res.redirect(`/campgrounds/${newCampground._id}`);
    }),

    // GET edit campground page
    displayEditCampground: asyncErrorWrapper (async (req, res) => {
        const campground = await Campground.findById(req.params.id);
        res.render('campground/edit', { title: `Yelpcamp - Edit Campground`, campground: campground });
    }),

    // PUT edit campground page
    editCampground: asyncErrorWrapper (async (req, res) => {
        const id = req.params.id; // extract the id from the req.body
        const updatedCampground = await Campground.findByIdAndUpdate(id, req.body); // ... destruct the req.body object (obtain all fields of the form)
        if(!updatedCampground) {
            req.flash('error', 'Cannot find that Campground!');
            return res.redirect('/campgrounds');
        };
        // add images
        const images = req.files.map(file => ({ url: file.path, filename: file.filename })); // must create a separate array of images to avoid merging one array of images (updated images) into another array of images (campground model)
        updatedCampground.images.push(...images); // spread the new array of images into the existing one (campground images)
        await updatedCampground.save();
        console.log('UPDATE',chalk.red(updatedCampground));
        // delete images
        if (req.body.deleteImages){
            // delete images from cloudinary
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            // delete images from db object
            await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }); // mongo command pull (delete from array) from images: the field that have filename: equal to deleteImages array
        }

        req.flash('success', 'Campground updated!');
        res.redirect(`/campgrounds/${updatedCampground._id}`);
    }),

    // DELETE delete campground page
    deleteCampground: asyncErrorWrapper (async (req, res) => {
        const id = req.params.id; // extract the id from the req.body
        const updatedCampground = await Campground.findByIdAndDelete(id); // ... destruct the req.body object (obtain all fields of the form)
        req.flash('success', 'Campground deleted!');
        res.redirect('/campgrounds');
    })
}