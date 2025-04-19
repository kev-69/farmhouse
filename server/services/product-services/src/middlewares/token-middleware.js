const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No Bearer token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid Bearer token format.' });
  }

  try {
    // console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token payload to req.user
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired Bearer token.' });
  }
};

module.exports = validateToken;