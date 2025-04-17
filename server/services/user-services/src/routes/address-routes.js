const express = require('express');
const router = express.Router();

const {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
} = require('../controllers/address-controller');

// middleware to check if the user is authenticated
const validateToken = require('../middlewares/token-middleware')

// routes
router.post('/address/add', validateToken, createAddress);
router.get('/addresses', validateToken, getAddresses);
router.put('/address/update/:id', validateToken, updateAddress);
router.delete('/address/delete/:id', validateToken, deleteAddress);

module.exports = router;