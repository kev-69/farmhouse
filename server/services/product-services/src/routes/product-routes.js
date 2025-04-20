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
router.post('/add-product', verifyShopOwnerRole, upload, addProduct) //  you need to own a shop to add a product
router.put('/update-product/:id', verifyShopOwnerRole, verifyProductOwnership, upload, updateProduct) // you need to own that shop and product to update it
router.delete('/delete-product/:id', verifyShopOwnerRole, verifyProductOwnership, deleteProduct) // you need to own that shop and product to delete it

module.exports = router