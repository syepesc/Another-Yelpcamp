var express = require('express');
var router = express.Router();

// import index controller
const indexControllers = require('../controllers/index');


// INDEX ROUTES
// GET home page
router.get('/', indexControllers.displayHomePage);


module.exports = router;
