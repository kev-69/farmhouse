const express = require('express');
const router = express.Router();

const {
    createShop,
    loginShop,
    verifyShopEmail,
    resetShopPassword,
    requestPasswordReset
} = require('../controllers/shop-auth-controller');

const validateLoginCredentials = require('../middlewares/shop-login-middleware');
const validatePassword = require('../middlewares/password-middleware');
// const validateEmail = require('../middlewares/email-middleware');
const validateToken = require('../middlewares/token-middleware');
// const authorizeRole = require('../middlewares/authorize-role');

// routes
router.post('/register-shop', createShop);
router.post('/login-shop', validateLoginCredentials, loginShop);

router.get('/verify-shop-email', validateToken, verifyShopEmail);

router.post('/request-password-reset', validateToken, requestPasswordReset);
router.post('/reset-shop-password', validateToken, validatePassword, resetShopPassword);

module.exports = router;