const express = require('express');
const mongoose = require('mongoose');

// IMPORT VARIABLES
// import campground model
const Campground = require('../../models/campground');
// import cities
const cities = require('./cities');
// import cities
const { places, descriptors } = require('./seedHelpers');



const sample = array => array[Math.floor(Math.random() * array.length)];

module.exports.seedDB = async () => {
    await Campground.deleteMany({})
    .then(console.log('All Campgrounds DELETED'));

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const campground = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await campground.save()
        .then(console.log(`Campground #${i+1}: {${campground.location}} {${campground.title}} - saved.`));
    }
};