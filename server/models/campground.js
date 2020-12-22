const mongoose = require('mongoose');
const Schema = mongoose.Schema; // change variable name
// import Review schema
const Review = require('./review');


// create campground schema model
const CampgroundSchema = Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
},
{
    collection: "campgrounds"
});

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;


// QUERY FUNCTIONS
// after (post) we delete a campground we are going to use this middleware to delete all the reviews of the campground
CampgroundSchema.post('findOneAndDelete', async (campgroundDeleted) => {
    console.log(campgroundDeleted);
    
    if (campgroundDeleted) {
        const reviewsFromDeletedCampground = campgroundDeleted.reviews;
        reviewsFromDeletedCampground.map(async reviewId => {
            console.log(reviewId);
            await Review.deleteMany( { _id: reviewId } );
        });
    }
})
    

