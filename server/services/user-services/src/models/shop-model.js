const sequelize = require('../../../../shared/config/db-config');
const { DataTypes } = require('sequelize');

const Shop = sequelize.define('Shop', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
    },
    shop_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shop_owner : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shop_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    shop_location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shop_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shop_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'shop_owner',
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'shops',
    timestamps: true,
});

module.exports = Shop;