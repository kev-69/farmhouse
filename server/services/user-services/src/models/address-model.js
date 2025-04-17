const { DataTypes } = require('sequelize');
const sequelize = require('../../../../shared/config/db-config');
const User = require('../../../../shared/models/user-model'); // Shared User model

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.literal('uuid_generate_v4()'),
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE', // Delete addresses if the user is deleted
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'addresses',
  timestamps: true,
});

// Define the relationship
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Address;