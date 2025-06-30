const express = require('express')
const router = express.Router()
const listingSchema = require('../schema')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const listing = require('../models/listings.js')
const flash=require("connect-flash")

const validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next()
  }
}

router.get(
  '/listings',
  wrapAsync(async (req, res, next) => {
    let datas = await listing.find()
    res.render('index.ejs', { datas })
    // console.log(datas);
  })
)

router.get('/listings/new', (req, res) => {
  res.render('form.ejs')
})

router.post(
  '/listings',
  validateListings,
  wrapAsync(async (req, res) => {
    const { title, description, image, price, location } = req.body

    const newListing = new listing({
      title,
      description,
      image,
      price,
      location
    })

    await newListing.save()
    req.flash('success', 'new listings is created and added')
    res.redirect('/listings')
  })
)

router.get(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findById(id).populate('review')
    res.render('listing.ejs', { data })
  })
)

router.get(
  '/listings/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findById(id)
    res.render('edit.ejs', { data })
  })
)

router.put(
  '/listings/:id',
  validateListings,
  wrapAsync(async (req, res) => {
    let { id } = req.params
    let { title, description, image, price, location } = req.body
    console.log(req.body)
    let newListings = await listing.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location
      },
      { new: true, runValidators: true }
    )
    console.log(newListings)
    req.flash('success', 'listings is updated')
    res.redirect('/listings')
  })
)

router.delete(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findByIdAndDelete(id)
    console.log(data)
    req.flash('success', 'listing is deleted')
    res.redirect('/listings')
  })
)

module.exports = router
