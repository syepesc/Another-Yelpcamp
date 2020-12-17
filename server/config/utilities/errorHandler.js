// personalizing error object for our app
class ExpressError extends Error {

    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

// this function wraps another function that executes when call and bubbles all error in the inner function
function asyncErrorWrapper(functionToWrap){
    return (req, res, next) => { // if an error is found it must return an express function (req,res) to the express error handler (err,req,res)
        functionToWrap(req, res, next).catch(e => next(e)); // Express defines that async errors must be passed into the next() function
    }
}

module.exports = { 

    ExpressError: ExpressError,
    asyncErrorWrapper: asyncErrorWrapper  
}