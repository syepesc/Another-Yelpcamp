const express = require('express');

// import campground model
const Campground = require('../models/campground');
// import review model
const Review = require('../models/review');
// import error handler
const { asyncErrorWrapper } = require('../config/utilities/errorHandler');


// CAMPGROUNDS CONTROLLERS
module.exports = {

    // GET reviews
    addReview: asyncErrorWrapper (async (req, res) => {
        const { ...formInput } = req.body;
        const campground = await Campground.findById(req.params.id);
        const newReview = new Review({ review: formInput.review, rating: formInput.rating });
        campground.reviews.push(newReview);
        await newReview.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    }),

    deleteReview: asyncErrorWrapper(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId } }); // using mongo query to delete an element from an array 
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/campgrounds/${id}`)
    })
}