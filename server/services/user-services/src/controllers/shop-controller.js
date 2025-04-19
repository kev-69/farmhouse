const ShopServices = require('../services/shop-services');
const dotenv = require('dotenv');
dotenv.config();

const getShopProfile = async (req, res) => {
    try {
        const shop = req.shop; // Use the shop attached by the middleware
        res.status(200).json({ shop });
    } catch (error) {
        console.error('Error fetching shop profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateShopProfile = async (req, res) => {
    try {
        const shop = req.shop; // Use the shop attached by the middleware
        const updates = req.body;

        // Update shop profile
        await shop.update(updates);

        res.status(200).json({ message: 'Profile updated successfully.', shop });
    } catch (error) {
        console.error('Error updating shop profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteShopAccount = async (req, res) => {
    try {
        const shop = req.shop; // Use the shop attached by the middleware

        // Delete shop account
        await shop.destroy();

        res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting shop account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllShops = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Fetch all shops with pagination
        const shops = await ShopServices.getAllShops({ offset, limit });
        const totalShops = await ShopServices.contShops();

        res.status(200).json({
            shops,
            pagination: {
                total: totalShops,
                page: parseInt(page),
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        console.error('Error fetching all shops:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getShopProfile,
    updateShopProfile,
    deleteShopAccount,
    getAllShops,
}