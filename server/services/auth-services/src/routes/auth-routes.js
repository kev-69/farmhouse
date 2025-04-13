const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyEmail,
    resetPassword,
    changePassword,
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    deleteUserAccount,
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

router.get('/users', validateToken, getAllUsers); // For admin users
router.get('/user-profile/:id', validateToken, getUserProfile);
router.get('/user-profile', validateToken, getUserProfile); // For logged-in users

router.put('/update-profile/:id', validateToken, updateUserProfile);

router.delete('/delete-account/:id', validateToken, deleteUserAccount);

module.exports = router;