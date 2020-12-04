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
    return (req, res, next) => {
        functionToWrap(req, res, next).catch(next);
    }
}

module.exports = { 

    ExpressError: ExpressError,
    asyncErrorWrapper: asyncErrorWrapper  
}