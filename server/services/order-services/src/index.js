const express = require('express');
const cors = require('cors');
const sequelize = require('./config/ordersdb-config');
const dotenv = require('dotenv');
dotenv.config();

// Call routes
// const orderRoutes = require('./routes/order-routes');
const cartRoutes = require('./routes/cart-routes');


const app = express();
const PORT = process.env.PORT || 3004;

sequelize.sync({ force: false }) // force: true will drop the table if it already exists
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Error syncing database', err);
    });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Order server is running on http://localhost:${PORT}`);
});