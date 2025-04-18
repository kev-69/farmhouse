const validateEmail = (req, res, next) => {
    const { email } = req.body;

    const emailRegex = /^[_%+-]+@[a-zA-Z0–9. -]+\. [a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required.' });
    }

    next();
};

module.exports = validateEmail;