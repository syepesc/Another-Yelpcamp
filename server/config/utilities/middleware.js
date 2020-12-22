// import campground and review model
const Campground = require('../../models/campground');
const Review = require('../../models/review');
// import error handler
const { asyncErrorWrapper } = require('./errorHandler');

module.exports = {

    ensureAuthentication: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error', 'Please login to access this content.');
            res.redirect('/login');
        }
    },
    
    isCampgroundAuthor: asyncErrorWrapper(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/campgrounds/${id}`)
        }
        next()
    }),

    isReviewAuthor: asyncErrorWrapper(async (req, res, next) => {
        const { id, reviewId } = req.params;
        const campground = await Campground.findById(id);
        const review = await Review.findById(reviewId);
        if (review.author.equals(req.user._id) || campground.author.equals(req.user._id)) {
            next() // if the user logged in is the review or the campground author then they can delete the review
        } else {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/campgrounds/${id}`)
        }
    })
}