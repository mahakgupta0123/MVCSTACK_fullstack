const express = require('express')
const app = express()
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err.stack)
})
const port = 8080
const mongoose = require('mongoose')
const engine = require('ejs-mate')

app.engine('ejs', engine)
const path = require('path')
var methodOverride = require('method-override')
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
main()
  .then(res => {
    console.log('database is connected')
  })
  .catch(err => console.log(err))

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
}

const user = require('./models/user.js')

const expressSession = require('express-session')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const localstrategy = require('passport-local')
const passport = require('passport')
app.use(cookieParser())
app.use(
  expressSession({
    secret: 'mysecretmessage',
    resave: false,
    saveUninitialized: true,
    cookie: {
      //to track sessions
      expires: Date.now() + 7 * 34 * 60 * 60 * 1000,
      maxAge: 7 * 34 * 60 * 60 * 1000,
      httpOnly: true //for security - crossscripting attacks.
    }
  })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
const listings = require('./routes/listings.js')
const reviews = require('./routes/review.js')
const wrapAsync = require('./utils/wrapAsync.js')

// app.get('/testing', (req, res) => {
//   const listing1 = new listing({
//     title: 'verre di wedding 2',
//     description: 'a luxury hotel to host private parties',
//     image:
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGpC6N4fsMlT85a8QBOc1aqztKs0CL3ugRKg&s',
//     price: 250000,
//     location: 'delhi',
//     country: 'india'
//   })

//     res.send("saved successfully")
// })

// app.use((req, res, next) => {
//   console.log('Request URL:', req.url)
//   next()
// })

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  // console.log(req.flash('success'))
  next()
})

app.use('/', listings)
app.use('/', reviews)

app.get('/signup', (req, res) => {
  res.render('signup.ejs')
})

app.post(
  '/signup',
  wrapAsync(async (req, res) => {
    try {
      let { email, username, password } = req.body
      const user1 = new user({
        email,
        username
      })
      await user.register(user1, password)
      req.flash('success', 'signup successfully')
      res.redirect('/listings')
    } catch (err) {
      req.flash('error', err.message)
      res.redirect('/signup')
    }
  })
)

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  async (req, res) => {
    req.flash('success', 'login successfully')
    res.redirect('/listings')
  }
)

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (!req.isAuthenticated()) {
      req.flash('error', 'you need to logged it first')
      return res.redirect('/login')
    }
    if (err) {
      req.flash('error', err.message)
      return next(err)
    }
    req.flash('success', 'You logged out')
    return res.redirect('/listings')
  })
})

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, 'Page not found'))
})

app.use((err, req, res, next) => {
  let { status = 500, message = 'Something went wrong' } = err
  res.status(status).render('error.ejs', { message })
})

app.listen(port, (req, res) => {
  console.log('server is running')
})
