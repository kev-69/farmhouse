const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../utils/cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'farmhouse_products',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    }
});

const upload = multer({ storage }).array('product_images', 10);

module.exports = upload