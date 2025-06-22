const Joi = require('joi');
let listingSchema=Joi.object({
    title:Joi.string().required(),
    desciption:Joi.string().required(),
    
}

).required()