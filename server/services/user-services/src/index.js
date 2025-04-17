const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require("../../../shared/config/db-config");

dotenv.config();

// call the routes
const userRoutes = require('./routes/user-routes');
const addressRoutes = require('./routes/address-routes');

const PORT = process.env.PORT || 3002;
const app = express();

// Sync database
sequelize.sync({ force: true }) // Set `force: true` only for development to drop and recreate tables
  .then(() => {
    console.log('Database synced successfully!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// define the root route
app.use('/api/user', userRoutes);
app.use('/api/user', addressRoutes);

app.listen(PORT, () => {
  console.log(`User service is running on http://localhost:${PORT}`);
});