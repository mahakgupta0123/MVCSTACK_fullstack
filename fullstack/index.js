const express = require('express')
const app = express()
const port = 8080
const mongoose = require('mongoose')

main()
  .then(res => {
    console.log('database is connected')
  })
  .catch(err => console.log(err))

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
}

app.get('/', (req, res) => {
  res.send('hello, root')
})

app.listen(port, (req, res) => {
  console.log('server is running')
})
