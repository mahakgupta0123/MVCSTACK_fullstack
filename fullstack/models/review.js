const mongoose = require('mongoose')
const user = require('./user.js')

let reviewSchema = new mongoose.Schema({
  comment: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:user
  }
})

let review = mongoose.model('review', reviewSchema)

module.exports = review
