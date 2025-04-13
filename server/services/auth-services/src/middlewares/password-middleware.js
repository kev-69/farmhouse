const validatePassword = (req, res, next) => {
    const { password } = req.body;

    if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
        return res.status(400).json({ error: 'Password must contain at least one uppercase letter.' });
    }

    if (!hasLowerCase) {
        return res.status(400).json({ error: 'Password must contain at least one lowercase letter.' });
    }

    if (!hasNumber) {
        return res.status(400).json({ error: 'Password must contain at least one number.' });
    }

    if (!hasSpecialChar) {
        return res.status(400).json({ error: 'Password must contain at least one special character.' });
    }
    next();
};

module.exports = validatePassword;