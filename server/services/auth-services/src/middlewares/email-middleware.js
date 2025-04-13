const validateEmail = (req, res, next) => {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }

    next();
};

module.exports = validateEmail;