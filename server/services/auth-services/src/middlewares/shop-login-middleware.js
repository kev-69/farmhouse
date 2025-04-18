const validateLoginCredentials = (req, res, next) => {
    const { shop_email } = req.body;

    if (!shop_email) {
        return res.status(400).json({ error: 'Email is required for login.' });
    }

    // Check if email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shop_email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }
    next();
};

module.exports = validateLoginCredentials;