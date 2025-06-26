const Joi = require('joi')

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required()
})

module.exports = listingSchema
