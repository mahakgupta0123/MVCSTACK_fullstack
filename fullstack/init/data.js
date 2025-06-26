const mongoose = require('mongoose')
const listing = require('../models/listings.js')
const data = require('./init.js')

main()
  .then(res => {
    console.log('database is connected')
  })
  .catch(err => console.log(err))

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
}

const data1 = async () => {
  await listing.deleteMany({})
  await listing.insertMany(data.data).then(() => {
    console.log('data is added')
  })
}

data1()
