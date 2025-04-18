const sequelize = require('../config/productdb-config')
const { DataTypes } = require('sequelize')

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},  {
    tableName: 'categories',
    timestamps: true,
})

module.exports = Category