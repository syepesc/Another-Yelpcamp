var express = require('express');
var router = express.Router();

// import index controller
const indexControllers = require('../controllers/index');


// INDEX ROUTES
// GET home page
router.get('/', indexControllers.displayHomePage);

// GET login page
router.get('/login', indexControllers.displayLoginPage);

// GET register page
router.get('/register', indexControllers.displayRegisterPage);

// POST login page
router.post('/login', indexControllers.processUserLogin);

// POST register page
router.post('/register', indexControllers.processUserRegistration);

// GET - Perform user logout
router.get('/logout', indexControllers.performLogout);


module.exports = router;
