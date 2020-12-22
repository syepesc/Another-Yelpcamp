const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create campground schema model
const ReviewSchema = Schema({
    review: {
        type: String,
        trim: true
    },
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    collection: "reviews"
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;