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
        if (decoded.role !== 'shop_owner') {
            return res.status(403).json({ message: 'Access denied. Only shop owners are allowed.' });
        }
        req.shopId = decoded.shopId; // Attach shopId to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Middleware to check if the shop owns the product
const verifyProductOwnership = async (req, res, next) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.shopId.toString() !== req.shopId) {
            return res.status(403).json({ message: 'Access denied. You do not own this product.' });
        }

        req.product = product; // Attach product to the request object
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    verifyShopOwnerRole,
    verifyProductOwnership,
};