const jwt = require('jsonwebtoken');
const Product = require('../models/product-model'); // Assuming you have a Product model

// Middleware to verify if the user is a shop owner
const verifyShopOwnerRole = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded Token:', decoded); // Debug log

        if (decoded.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Access denied. Only shop owners are allowed.' });
        }
        req.user = decoded; // Attach the decoded token payload to req.user
        next();
    } catch (error) {
        // console.error('Token Verification Error:', error); // Debug log
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check if the shop owns the product
const verifyProductOwnership = async (req, res, next) => {
    try {
        const { id } = req.params; // Extract product ID from the route parameters
        const { shopId } = req.user; // Extract shopId from the token payload

        // console.log('Shop ID from Token:', shopId); // Debug log
        // console.log('Product ID from Request:', id); // Debug log

        // Fetch the product from the database
        const product = await Product.findByPk(id);
        // console.log('Retrieved Product:', product); // Debug log

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product belongs to the shop
        if (product.shopId !== shopId) {
            // console.log('Product Ownership Mismatch:', { productShopId: product.shopId, tokenShopId: shopId }); // Debug log
            return res.status(403).json({ message: 'Access denied. You do not own this product.' });
        }

        req.product = product; // Attach product to the request object
        next();
    } catch (error) {
        // console.error('Error in verifyProductOwnership:', error); // Debug log
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    verifyShopOwnerRole,
    verifyProductOwnership,
};