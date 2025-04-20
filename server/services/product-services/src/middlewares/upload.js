const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'farmhouse_products',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage }).array('product_images', 10);

const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            // console.error('Error in upload middleware:', err); // Log the error
            return res.status(500).json({ message: 'Error uploading files', error: err.message });
        }
        // console.log('Uploaded Files:', req.files); // Debug log
        next();
    });
};

module.exports = uploadMiddleware;