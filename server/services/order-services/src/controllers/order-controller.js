const OrderService = require('../services/order-services');
const redisClient = require('../config/redis-config');
const Order = require('../models/order-model');
const OrderItem = require('../models/order-items-model');
const { use } = require('../routes/order-routes');

// Create a new order: same as checkout
const createOrder = async (req, res) => {
    try {
        const { id } = req.user; // Extract user_id from the token
        const cartKey = `cart:${id}`;

        // Fetch cart items from Redis
        const cartItems = await redisClient.hGetAll(cartKey);
        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const items = Object.values(cartItems).map(item => JSON.parse(item));

        // Check if cart is empty
        if (items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const user_id = id; // Use the user_id from the token

        // Create order
        const orderData = {
            user_id,
            total_amount: totalAmount,
            order_status: 'pending', // Default status
        };
        const order = await OrderService.createOrder(orderData);

        // Clear cart in Redis after checkout
        await redisClient.del(cartKey);

        return res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { order_status } = req.body;
        // Validate order status
        if (!order_status || !['pending', 'completed', 'cancelled'].includes(order_status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await OrderService.updateOrder(orderId, { order_status });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await OrderService.deleteOrder(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const { id } = req.user; // Extract user_id from the token
        const user_id = id; // Use the user_id from the token

        const orders = await OrderService.getAllOrders(user_id);

        return res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { id } = req.user; // Extract user_id from the token
        const user_id = id; // Use the user_id from the token

        const order = await OrderService.getOrderById(orderId);

        if (!order || order.user_id !== user_id) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }

        return res.status(200).json({ message: 'Order fetched successfully', order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrderById,
};