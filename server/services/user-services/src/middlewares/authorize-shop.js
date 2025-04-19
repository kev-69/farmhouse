const jwt = require('jsonwebtoken');
const Shop = require('../models/shop-model'); // Adjust the path to your Shop model

const authorizeShop = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const shopOwnerId = decoded.id; // Extract shop owner ID from the token

        // Check if the shop belongs to the logged-in shop owner
        const shopId = req.params.id || req.params.shopId; // Use the correct parameter name
        const shop = await Shop.findByPk(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Attach the shop to the request object for further use
        req.shop = shop;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authorizeShop;