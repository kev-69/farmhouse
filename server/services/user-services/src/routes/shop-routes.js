const express = require('express');
const router = express.Router();

const {
    getShopProfile,
    getAllShops,
    updateShopProfile,
    deleteShopAccount,
} = require('../controllers/shop-controller');

// middlewares
const authorizeShop = require('../middlewares/authorize-shop');

// routes
router.get('/shops', getAllShops); // For admin users
router.get('/shop-profile/:id', authorizeShop, getShopProfile); // For logged-in shops
router.put('/update-shop-profile/:id', authorizeShop, updateShopProfile); // Update shop profile
router.delete('/delete-shop-account/:id', authorizeShop, deleteShopAccount); // Delete shop account

module.exports = router;