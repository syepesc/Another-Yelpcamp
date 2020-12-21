var express = require('express');
var router = express.Router({mergeParams: true}); // this keeps track of the params of the hole route

// import review controllers
const reviewControllers = require('../controllers/review');
// import form validation
const { ...form } = require('../config/utilities/formValidation');
// import ensure authentication
const ensureAuthentication = require('../config/utilities/passport').ensureAuthentication;



// REVIEWS ROUTES -> path: '/campgrounds/:id/reviews'
// GET campground reviews page
router.get('/', reviewControllers.displayCampgroundReviews);

// POST add review
router.post('/', ensureAuthentication, form.validate(form.reviewForm), reviewControllers.addReview);

// DELETE review
router.delete('/:reviewId', ensureAuthentication, reviewControllers.deleteReview);


module.exports = router;