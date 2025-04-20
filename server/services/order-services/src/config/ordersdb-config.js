const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = new Sequelize(
    process.env.ORDERS_DATABASE,
    process.env.ORDERS_DATABASE_USER,
    process.env.ORDERS_DATABASE_PASSWORD, {
        host: process.env.ORDERS_DATABASE_HOST,
        dialect: 'postgres',
        port: process.env.ORDERS_DATABASE_PORT,
        logging: false, // Disable logging; default: console.log
    }
)

// console.log('Connecting to the database...');

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.')
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err)
    })
    
module.exports = sequelize;