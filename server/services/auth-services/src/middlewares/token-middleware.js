const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ error: 'Authorization header with Bearer token is required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { maxAge: JWT_EXPIRATION });
        req.user = decoded; // Attach decoded token payload to the request object
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    next();
};

module.exports = validateToken;