const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error); // Debug log
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authenticateUser;