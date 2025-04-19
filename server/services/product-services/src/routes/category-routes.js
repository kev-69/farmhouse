const express = require('express')
const router = express.Router()

const {
    addCategory,
    updateCategory,
    getAllCategories,
    removeCategoryById
} = require('../controllers/category-controller')

// middlewares
const {
    validateCategoryCreation,
    verifyCategoryOwnership
} = require('../middlewares/category-middlewares')
const validateToken = require('../middlewares/token-middleware')

// routes
router.get('/all', getAllCategories)
router.post('/add-category', validateToken, validateCategoryCreation, addCategory) //admin and store owners add categories
router.put('/update-category/:id', validateToken, verifyCategoryOwnership, updateCategory) // admin and store owners update categories
router.delete('/delete-category/:id', validateToken, verifyCategoryOwnership, removeCategoryById) // admins can update categories

module.exports = router