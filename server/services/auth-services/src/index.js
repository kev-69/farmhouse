const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require("../../../shared/config/db-config");

dotenv.config();

// call the routes
const userAuthRoutes = require('./routes/user-auth-routes');
const shopAuthRoutes = require('./routes/shop-auth-routes');

const PORT = process.env.PORT || 3001;
const app = express();

// sync database
sequelize.sync({ force: false }) // force: true will drop the table if it already exists
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define the root route
app.use('/api/auth', userAuthRoutes);
app.use('/api/auth/shop', shopAuthRoutes);

app.listen(PORT, () => {
  console.log(`Auth service is running on http://localhost:${PORT}`);
});