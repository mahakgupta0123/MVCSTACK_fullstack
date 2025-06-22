const express = require('express')
const app = express()
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.stack);
});
const port = 8080
const mongoose = require('mongoose')
const listing = require('./models/listings.js')
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
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


app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  next();
});

app.get(
  '/listings',
  wrapAsync(async (req, res, next) => {
    let datas = await listing.find()
    res.render('index.ejs', { datas })
    // console.log(datas);
  })
)

// app.get('/', (req, res) => {
//   res.send('hello, root')
// })

app.get('/listings/new', (req, res) => {
  res.render('form.ejs')
})

app.post('/listings', wrapAsync(async (req, res) => {
  const { title, description, image, price, location } = req.body;

  const newListing = new listing({
    title,
    description,
    image,
    price,
    location
  });

  await newListing.save();
  res.redirect('/listings'); 
}));

app.get(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findById(id)
    res.render('listing.ejs', { data })
  })
)

app.get(
  '/listings/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findById(id)
    res.render('edit.ejs', { data })
  })
)

app.put(
  '/listings/:id',
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
    res.redirect('/listings')
  })
)

app.delete(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params
    let data = await listing.findByIdAndDelete(id)
    console.log(data)
    res.redirect('/listings')
  })
)

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, 'Page not found'));
});


app.use((err, req, res, next) => {
  let { status = 500, message = 'Something went wrong' } = err;
  res.status(status).send(message);
});


app.listen(port, (req, res) => {
  console.log('server is running')
})
