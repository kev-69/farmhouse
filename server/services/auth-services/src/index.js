const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// call the routes
const authRoutes = require('./routes/auth-routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

// define the root route
app.get('/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Auth service is running on http://localhost:${PORT}`);
});