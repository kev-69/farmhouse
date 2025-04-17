const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyEmail,
    resetPassword,
    changePassword,
} = require('../controllers/auth-controller');

// middleware to check if the user is authenticated
const validateLoginCredentials = require('../middlewares/login-middleware');
const validatePassword = require('../middlewares/password-middleware');
const validateEmail = require('../middlewares/email-middleware');
const validateToken = require('../middlewares/token-middleware');


// routes
router.post('/register', registerUser);
router.post('/login', validateLoginCredentials, loginUser);

router.post('/verify-email', validateEmail, verifyEmail);

router.post('/reset-password', validateToken, validatePassword, resetPassword);
router.post('/change-password', validateToken, validatePassword, changePassword);

module.exports = router;