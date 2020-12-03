const mongoose = require('mongoose');


// create a model class
const CampgroundSchema = mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
},
{
    collection: "campgrounds"
});

const Campground = mongoose.model('Campground', CampgroundSchema);
module.exports = Campground;