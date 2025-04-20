const sequelize = require('../config/ordersdb-config')
const { DataTypes } = require('sequelize')

const Order = sequelize.define('orders', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
    },
    order_status: {
        type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    }
}, {
    timestamps: true,
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
    tableName: 'orders'
})

module.exports = Order