const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create campground schema model
const CampgroundSchema = Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},
{
    collection: "campgrounds"
});

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;