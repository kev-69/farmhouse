const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming the role is stored in req.user after token validation

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = authorizeRole;