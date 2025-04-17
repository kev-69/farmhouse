const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    deleteUserAccount,
} = require('../controllers/user-controller');

// middleware to check if the user is authenticated
const validateToken = require('../middlewares/token-middleware')

// routes
router.get('/users', validateToken, getAllUsers); // For admin users
router.get('/user-profile/:id', validateToken, getUserProfile);
router.get('/user-profile', validateToken, getUserProfile); // For logged-in users

router.put('/update-profile/:id', validateToken, updateUserProfile);

router.delete('/delete-account/:id', validateToken, deleteUserAccount);

module.exports = router;