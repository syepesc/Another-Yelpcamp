const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/utilities/cloudinary');
const upload = multer({ storage });


// import campground controllers
const campgroundControllers = require('../controllers/campground');
// import form validation
const { ...form } = require('../config/utilities/formValidation');
// import middleware
const { ensureAuthentication, isCampgroundAuthor } = require('../config/utilities/middleware');



// CAMPGROUNDS ROUTES
// GET campgrounds index page
router.get('/', campgroundControllers.displayAllCampgrounds);

// GET add campground page
router.get('/add', ensureAuthentication, campgroundControllers.displayAddCampground);

// POST add campground page
router.post('/add', ensureAuthentication, upload.array('image'), campgroundControllers.addCampground);

// GET campground by ID
router.get('/:id', campgroundControllers.displayCampgroundById);

// GET edit campground page
router.get('/edit/:id', ensureAuthentication, isCampgroundAuthor, campgroundControllers.displayEditCampground);

// PUT edit campground page
router.put('/edit/:id', ensureAuthentication, isCampgroundAuthor, upload.array('image'), form.validate(form.campgroundForm), campgroundControllers.editCampground);

// DELETE edit campground page
router.delete('/delete/:id', ensureAuthentication, isCampgroundAuthor, campgroundControllers.deleteCampground);


module.exports = router;
