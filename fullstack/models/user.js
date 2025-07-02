const mongoose = require('mongoose')
const passportlocalmongoose=require("passport-local-mongoose")

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true
  },
})

userSchema.plugin(passportlocalmongoose)
let user = mongoose.model('user', userSchema)

module.exports = user
