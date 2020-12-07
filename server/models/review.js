const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create campground schema model
const ReviewSchema = Schema({
    review: String,
    rating: Number
},
{
    collection: "reviews"
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;