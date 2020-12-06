var express = require('express');
var router = express.Router();

// import campground controllers
const campgroundControllers = require('../controllers/campground');
// import review controllers
const reviewControllers = require('../controllers/review');
// import form validation
const { ...form } = require('../config/utilities/formValidation');


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CAMPGROUNDS CONTROLLERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET campgrounds index page
router.get('/', campgroundControllers.displayAllCampgrounds);

// GET add campground page
router.get('/add', campgroundControllers.displayAddCampground);

// POST add campground page
router.post('/add', form.validate(form.campgroundForm), campgroundControllers.addCampground);

// GET campground by ID
router.get('/:id', campgroundControllers.displayCampgroundById);

// GET edit campground page
router.get('/edit/:id', campgroundControllers.displayEditCampground);

// PUT edit campground page
router.put('/edit/:id', form.validate(form.campgroundForm), campgroundControllers.editCampground);

// DELETE edit campground page
router.delete('/delete/:id', campgroundControllers.deleteCampground);


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// REVIEWS CONTROLLERS
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// POST add review
router.post('/:id/reviews', form.validate(form.reviewForm), reviewControllers.addReview);


module.exports = router;
