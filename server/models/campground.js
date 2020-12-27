const mongoose = require('mongoose');
const { schema } = require('./review');
const Schema = mongoose.Schema; // change variable name
// import Review schema
const Review = require('./review');


// create campground schema model
const CampgroundSchema = new Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    price: Number,
    description: String,
    location: String,
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            require: true
        },
        coordinates: {
            type: [Number],
            require: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    deleteImages: [{
        type: [String]
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
},
{
    collection: "campgrounds"
});


// QUERY FUNCTIONS
// after (post) we delete a campground we are going to use this middleware to delete all the reviews of the campground
CampgroundSchema.post('findOneAndDelete', async (campgroundDeleted) => {
    console.log('DELETING THIS:', campgroundDeleted);
    
    if (campgroundDeleted) {
        const reviewsFromDeletedCampground = campgroundDeleted.reviews;
        reviewsFromDeletedCampground.map(async reviewId => {
            console.log(reviewId);
            await Review.deleteMany( { _id: reviewId } );
        });
    }
})


const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;
    

