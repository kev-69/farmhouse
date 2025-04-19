const express = require('express')
const router = express.Router()

// call controllers
const {
    addProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    getAllProducts
} = require('../controllers/product-controller')

// call middlewares
const upload = require('../middlewares/upload')
const {
    verifyShopOwnerRole,
    verifyProductOwnership
} = require('../middlewares/product-middlewares')

router.get('/all-products', getAllProducts)
router.get('/:id', getProductById)
router.post('/add-product', verifyShopOwnerRole, upload, addProduct) //  store owners can add products
router.put('/update-product/:id', verifyProductOwnership, upload, updateProduct) // store owners can update their products
router.delete('/delete/:id', verifyProductOwnership, deleteProduct) // store owners can delete their products

module.exports = router