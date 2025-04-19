const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// this is a shared middleware to check if the user is an admin
// it will be used accross all services. for example, in user services, we will check if the user is an admin before allowing them to view all users, viewing all orders, viewing all users' addresses
function authorizeAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        // console.log('Token:', token); // Log the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        req.user = decoded; // Attach the decoded token to the request
        next();
    } catch (err) {
        // console.error('Token verification error:', err); // Log the error

        res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = authorizeAdmin;