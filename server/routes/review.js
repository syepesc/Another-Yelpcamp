var express = require('express');
var router = express.Router({mergeParams: true}); // this keeps track of the params of the hole route

// import review controllers
const reviewControllers = require('../controllers/review');
// import form validation
const { ...form } = require('../config/utilities/formValidation');



// REVIEWS ROUTES -> path: '/campgrounds/:id/reviews'
// POST add review
router.post('/', form.validate(form.reviewForm), reviewControllers.addReview);

// DELETE review
router.delete('/:reviewId', reviewControllers.deleteReview);


module.exports = router;