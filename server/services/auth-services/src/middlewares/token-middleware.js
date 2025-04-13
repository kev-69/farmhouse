const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required.' });
    }

    const { JWT_SECRET, JWT_EXPIRATION } = process.env;

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { maxAge: JWT_EXPIRATION });
        req.user = decoded; // Attach decoded token payload to the request object
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    next();
};

module.exports = validateToken;