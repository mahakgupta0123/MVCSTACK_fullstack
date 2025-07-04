const express = require('express')
const router = express.Router()
const listingSchema = require('../schema')
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const listing = require('../models/listings.js')
const flash = require('connect-flash')

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
  if (!req.isAuthenticated()) {
    req.flash('error', 'you need to logged it first')
    return res.redirect('/login')
  }
  res.render('form.ejs')
})

router.post(
  '/listings',
  validateListings,
  wrapAsync(async (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('error', 'you need to logged it first')
      return res.redirect('/login')
    }
    const { title, description, image, price, location } = req.body

    let newListing = new listing({
      title,
      description,
      image,
      price,
      location
    })
    console.log(req.user._id)
    newListing.owner = req.user._id

    await newListing.save()
    req.flash('success', 'new listings is created and added')
    res.redirect('/listings')
  })
)

router.get(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    // let listings = await listing.findById(id)
    // if (!res.locals.currentUser || !listings.owner.equals(res.locals.currentUser._id)) {
    //   req.flash(
    //     'error',
    //     "you don't have permissions as you don't owned that listings"
    //   )
    //   return res.redirect(`/listings`)
    // }
    let data = await listing
      .findById(id)
      .populate({ path: 'review', populate: { path: 'author' } })
      .populate('owner')
    res.render('listing.ejs', { data })
  })
)

router.get(
  '/listings/:id/edit',
  wrapAsync(async (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('error', 'you need to logged it first')
      return res.redirect('/login')
    }
    let { id } = req.params
    let listings = await listing.findById(id)
    if (
      !res.locals.currentUser ||
      !listings.owner.equals(res.locals.currentUser._id)
    ) {
      req.flash(
        'error',
        "you don't have permissions as you don't owned that listings"
      )
      return res.redirect(`/listings/${id}`)
    }
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
    let listings = await listing.findById(id)
    if (
      !res.locals.currentUser ||
      !listings.owner.equals(res.locals.currentUser._id)
    ) {
      req.flash(
        'error',
        "you don't have permissions as you don't owned that listings"
      )
      return res.redirect(`/listings/${id}`)
    }
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
    if (!req.isAuthenticated()) {
      req.flash('error', 'you need to logged it first')
      return res.redirect('/login')
    }
    let { id } = req.params
    let listings = await listing.findById(id)
    if (
      !res.locals.currentUser ||
      !listings.owner.equals(res.locals.currentUser._id)
    ) {
      req.flash(
        'error',
        "you don't have permissions as you don't owned that listings"
      )
      return res.redirect(`/listings/${id}`)
    }
    let data = await listing.findByIdAndDelete(id)
    console.log(data)
    req.flash('success', 'listing is deleted')
    res.redirect('/listings')
  })
)

module.exports = router
