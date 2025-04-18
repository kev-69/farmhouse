const { Sequelize } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const sequelize = new Sequelize(
    process.env.PRODUCT_DATABASE,
    process.env.PRODUCT_DATABASE_USER,
    process.env.PRODUCT_DATABASE_PASSWORD, {
        host: process.env.PRODUCT_DATABASE_HOST,
        dialect: 'postgres',
        port: process.env.PRODUCT_DATABASE_PORT,
        logging: false,
    }
)

// Test the da connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection establishes');
    })
    .catch(err => {
        console.error('Unable to connect to the database', err);
    })

module.exports = sequelize