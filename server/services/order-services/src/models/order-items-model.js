const sequelize = require('../config/ordersdb-config')
const { DataTypes } = require('sequelize')
const Order = require('./order-model')

const OrderItem = sequelize.define('order_items', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Order,
            key: 'id',
        },
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false,
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'order_items'
})


// Define the relationship between OrderItem and Order
OrderItem.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id' })
Order.hasMany(OrderItem, { foreignKey: 'order_id', sourceKey: 'id' })
// uncomment the following lines to create the table in the database
// OrderItem.sync()
//     .then(() => {
//         console.log('OrderItem table created successfully')
//     })
//     .catch((err) => {
//         console.error('Unable to create OrderItem table:', err)
//     })

module.exports = OrderItem