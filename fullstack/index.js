const express = require('express')
const app = express()
const port = 8080
const mongoose = require('mongoose')
const listing = require('./models/listings.js')

main()
  .then(res => {
    console.log('database is connected')
  })
  .catch(err => console.log(err))

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
}

app.get('/testing', (req, res) => {
  const listing1 = new listing({
    title: 'verre di wedding 2',
    description: 'a luxury hotel to host private parties',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGpC6N4fsMlT85a8QBOc1aqztKs0CL3ugRKg&s',
    price: 250000,
    location: 'delhi',
    country: 'india'
  })

  listing1
    .save()
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })

    res.send("saved successfully")
})

app.get('/', (req, res) => {
  res.send('hello, root')
})

app.listen(port, (req, res) => {
  console.log('server is running')
})
