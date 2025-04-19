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

router.get('/all-products', getAllProducts)
router.get('/:id', getProductById)
router.post('/add-product', upload, addProduct) //  store owners can add products
router.put('/update-product/:id', upload, updateProduct) // store owners can update their products
router.delete('/delete/:id', deleteProduct) // store owners can delete their products

module.exports = router