const express = require('express');
const router = express.Router();

// controllers
const {
    createOrder,
    updateOrder,
    getOrderById,
    getAllOrders,
    deleteOrder,
} = require('../controllers/order-controller');

// middlewares
const authenticateUser = require('../middlewares/cart-middlewares')
const {
    verifyUser,
    validateOrderStatus,
    authorizeShop,
    // validateCart
} = require('../middlewares/order-middlewares')

// routes
router.get('/history', authenticateUser, getAllOrders)
router.get('/history/:orderId', authenticateUser, getOrderById)
router.post('/checkout', authenticateUser, verifyUser, createOrder)
router.put('/update-status/:orderId', authenticateUser, authorizeShop, validateOrderStatus, updateOrder) // shop owner only can update order status
router.delete('/remove-order/:orderId', authenticateUser, authorizeShop, deleteOrder) // shop owner only can delete order

module.exports = router