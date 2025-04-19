const express = require('express')
const cors = require('cors')
const sequelize = require('./config/productdb-config')
const dotenv = require('dotenv')
dotenv.config()

// call routes
const categoryRoutes = require('./routes/category-routes')
const productRoutes = require('./routes/product-routes')

const app = express()
const PORT = process.env.PORT || 3003

sequelize.sync({ force: false }) // force: true will drop the table if it already exists
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Error syncing database', err);
    })

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// product routes
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoutes)

// start server
app.listen(PORT, () => {
    console.log(`Products server is running on http://localhost:${PORT}`);
})