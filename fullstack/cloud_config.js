const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'airbnb_dev',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => Date.now().toString()
  }
})

module.exports = {
  cloudinary,
  storage
}
