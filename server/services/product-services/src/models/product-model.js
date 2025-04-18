const sequelize = require('../config/productdb-config')
const { DataTypes } = require('sequelize')
const Category = require('./category-model')

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.NUMERIC(10, 2),
        allowNull: false
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    product_images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            isUrl: true,
        }
    },
}, {
    tableName: 'products',
    timestamps: true,
})

// Define associations
Product.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }) 
// a product belongs to a category and when a category is deleted or updated, the products under that category are afftected
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
// a category can have many products upder it

module.exports = Product