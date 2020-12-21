const Joi = require('joi');
const { ExpressError } = require('./errorHandler');


// VALIDATE FORMS
module.exports.validate = (formToValidate) => {
    return (req, res, next) => {
        const { error } = formToValidate.validate(req.body); // extract error variable from joi
        if (error) {
            const msg = error.details.map(el => el.message).join(',') // error is an array so we need to print each element
            throw new ExpressError(400, msg)
        } else {
            next();
        }
    }
}

// FORM SCHEMAS

// campground schema validation
module.exports.campgroundForm = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()
});

// review schema validation
module.exports.reviewForm = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5)
});

// user schema validation
module.exports.userForm = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required().min(6).max(20)
});