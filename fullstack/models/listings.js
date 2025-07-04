const mongoose = require('mongoose')
const review = require('./review.js')
const user = require('./user.js')

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
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:user
  }
})

listingSchema.post('findOneAndDelete', async listing => {
  if (listing) {
    await review.deleteMany({ id: { $in: listing.review } })
  }
})
const listing = mongoose.model('listing', listingSchema)

module.exports = listing
