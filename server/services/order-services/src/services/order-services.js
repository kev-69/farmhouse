const Order = require('../models/order-model')
const OrderItem = require('../models/order-items-model');
const sequelize = require('../config/ordersdb-config')

const OrderServices = {
    async createOrder(orderData, orderDataItems) {
        const transaction = await sequelize.transaction()
        try {
            console.log('Order Data:', orderData); // Debug log
            console.log('Order Data Items:', orderDataItems); // Debug log
            if (!orderData || orderDataItems.length === 0) {
                throw new Error('Order items cannot be empty');
            }
            
            const order = await Order.create(orderData, { transaction });

            // create order items
            const orderItems = orderDataItems.map(item => ({
                order_id: order.id,
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
            }));

            // Create order items in bulk
            await OrderItem.bulkCreate(orderItems, { transaction });
            await transaction.commit();
            return order;
        } catch (error) {
            console.error('Error creating order:', error);
            await transaction.rollback();
            throw error;
        }
    },

    async getOrderById(orderId) {
        try {
            const order = await Order.findByPk({
                where: { id: orderId },
                include: [{ model: OrderItem, as: 'items' }],
            });
            return order;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    async getAllOrders() {
        try {
            const orders = await Order.findAll({
                include: [{ model: OrderItem }],
            });
            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    async updateOrder(orderId, orderData) {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            await order.update(orderData);
            return order;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    },

    async deleteOrder(orderId) {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            await order.destroy();
            return order;
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    }
}

module.exports = OrderServices