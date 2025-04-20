const express = require('express');
const router = express.Router();

// controllers
const {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart,
} = require('../controllers/cart-controller');

// middlewares
const authenticateUser = require('../middlewares/cart-middlewares');

// routes
router.post('/add-to-cart', authenticateUser, addToCart);
router.get('/cart-items', authenticateUser, getCart);
router.put('/update-cart-item/:productId', authenticateUser, updateCart);
router.delete('/remove-cart-item/:productId', authenticateUser, removeFromCart);
router.delete('/clear-cart', authenticateUser, clearCart);

module.exports = router;