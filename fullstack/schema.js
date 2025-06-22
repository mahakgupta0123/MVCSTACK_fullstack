const Joi = require('joi')
let listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    desciption: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required()
  }).required()
})

module.exports=listingSchema
