const express=require("express")
const router=express.Router();
const review = require('../models/review.js')
const listing = require('../models/listings.js')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const reviewSchema = require('../schema')

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}

router.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
  let {id}=req.params
  const foundListing = await listing.findById(req.params.id)
  const newReview = new review(req.body.review)

  foundListing.review.push(newReview)

  await newReview.save()
  await foundListing.save()

 res.redirect(`/listings/${id}`)
}))

router.delete('/listings/:id/reviews/:reviewId', validateReview, wrapAsync( async (req, res) => {
  let { id, reviewId } = req.params
  await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } })
  await review.findByIdAndDelete(reviewId)
 res.redirect(`/listings/${id}`)
}))

module.exports=router