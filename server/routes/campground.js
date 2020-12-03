var express = require('express');
var router = express.Router();

// import index controller
const campgroundControllers = require('../controllers/campground');


// CAMPGROUNDS CONTROLLERS
// GET campgrounds index page
router.get('/', campgroundControllers.displayCampgroundsIndex);

// GET add campground page
router.get('/add', campgroundControllers.displayAddCampground);

// POST add campground page
router.post('/add', campgroundControllers.processAddCampground);

// GET campground by ID
router.get('/:id', campgroundControllers.displayCampgroundById);

// GET edit campground page
router.get('/edit/:id', campgroundControllers.displayEditCampground);

// PUT edit campground page
router.put('/edit/:id', campgroundControllers.processEditCampground);

// DELETE edit campground page
router.delete('/delete/:id', campgroundControllers.processDeleteCampground);


module.exports = router;
