const OrderService = require('../services/order-services');
const redisClient = require('../config/redis-config');
const Order = require('../models/order-model');
const OrderItem = require('../models/order-items-model');

// Create a new order: same as checkout
const createOrder = async (req, res) => {
    try {
        const { user_id, total_amount, order_status } = req.body;
        if (!user_id || !total_amount || !order_status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const cartKey = `cart:${user_id}`;
        // Check if the user is logged in (you can implement your own logic here)
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the user has a valid session
        const session = await redisClient.get(`session:${req.session.id}`);
        if (!session) {
            return res.status(401).json({ message: 'Session expired' });
        }
        // Fetch cart items from Redis
        const cartItems = await redisClient.hGetAll(cartKey);
        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const items = Object.values(cartItems).map(item => JSON.parse(item));

        // check if items are empty
        if (items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create order
        const orderData = {
            user_id,
            total_amount,
            order_status,
        };
        const order = await OrderService.createOrder(orderData);

        // clear cart in Redis after checkout
        await redisClient.del(cartKey);

        return res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { order_status } = req.body;
        if (!order_status) {
            return res.status(400).json({ message: 'Missing required fields' });
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
        const orders = await OrderService.getAllOrders();
        return res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
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