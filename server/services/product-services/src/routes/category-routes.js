const express = require('express')
const router = express.Router()

const {
    addCategory,
    updateCategoryById,
    getAllCategories,
    removeCategoryById
} = require('../controllers/category-controller')

// middlewares


// routes
router.get('/all', getAllCategories) 
router.post('/add-category', addCategory) //admin and store owners add categories
router.put('/update-category/:id', updateCategoryById) // admin and store owners update categories
router.delete('/delete-category/:id', removeCategoryById) // admins and store owners can update categories

module.exports = router