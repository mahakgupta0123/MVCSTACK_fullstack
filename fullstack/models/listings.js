const mongoose = require('mongoose')
// const review = require('review.js')

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  price: {
    type: Number,
    required: true,
    min: 1
  },

  location: {
    type: String,
    required: true
  },

  country: {
    type: String
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review'
    }
  ]
})

const listing = mongoose.model('listing', listingSchema)

module.exports = listing
