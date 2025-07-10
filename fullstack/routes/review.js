const express = require('express')
const router = express.Router()
const review = require('../models/review.js')
const listing = require('../models/listings.js')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const reviewSchema = require('../reviewSchema.js')

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}

router.post(
  '/listings/:id/reviews',
  validateReview,
  wrapAsync(async (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('error', 'you need to logged it first')
      return res.redirect('/login')
    }
    let { id } = req.params
    const foundListing = await listing.findById(req.params.id)
    const newReview = new review(req.body.review)
    newReview.author = req.user._id
    foundListing.review.push(newReview)

    await newReview.save()
    await foundListing.save()
    req.flash('success', 'new review is created and added')
    res.redirect(`/listings/${id}`)
  })
)

router.delete(
  '/listings/:id/reviews/:reviewId',
  wrapAsync(async (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('error', 'you need to logged in first')
      return res.redirect('/login')
    }

    const { id, reviewId } = req.params
    const foundReview = await review.findById(reviewId)

    if (
      !res.locals.currentUser ||
      !foundReview.author.equals(res.locals.currentUser._id)
    ) {
      req.flash('error', "You don't have permission to delete this review")
      return res.redirect(`/listings/${id}`)
    }

    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await review.findByIdAndDelete(reviewId)

    req.flash('success', 'Review deleted successfully')
    res.redirect(`/listings/${id}`)
  })
)

module.exports = router
