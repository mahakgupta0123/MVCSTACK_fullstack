const Joi = require('joi')

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().required(),
  location: Joi.string().required()
})

module.exports = listingSchema


const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
})

module.exports = reviewSchema
