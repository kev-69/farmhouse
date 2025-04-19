const CategoryServices = require('../services/category-services')
const { check, validationResult } = require('express-validator')
const dotenv = require('dotenv')
dotenv.config()

const addCategory = async (req, res) => {
    const { category_name, description } = req.body
    const { shopId } = req.user // Assuming the shopId is in the token payload
    // console.log('Shop ID:', shopId); // Debug log
    try {
        // validate inputs
        await check('category_name').notEmpty().withMessage('Category name is required').run(req);
        await check('description').notEmpty().withMessage('Category description is required').run(req)

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // check if category already exist
        const existingCategory = await CategoryServices.getCategoryByName(category_name);
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exist' })
        }

        // create the category
        const newCategory = await CategoryServices.addCategory({ category_name, description, shopId })
        
        res.status(201).json({ message: 'Category successfully added', newCategory })
    } catch(error) {
        console.error('Error adding category:', error); // Debug log
        res.status(500).json({ message: 'Error adding category', error })
    }
}

const updateCategory = async (req, res) => {
    const id = req.params.id;
    const { category_name, description } = req.body;
    const { shopId } = req.user // Assuming the shopId is in the token payload
    // console.log('Shop ID:', shopId); // Debug log
    try {
        // validate inputs if they are provided
        if (category_name !== undefined) {
            await check('category_name').notEmpty().withMessage('Category name is required').run(req);
        }
        if (description !== undefined) {
            await check('description').notEmpty().withMessage('Category description is required').run(req);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Prepare the fields to update
        const updateData = {};
        if (category_name !== undefined) updateData.category_name = category_name;
        if (description !== undefined) updateData.description = description;

        // console.log('Category ID:', id); // Debug log
        // console.log('Update Data:', updateData); // Debug log

        // Update the category
        const updatedCategory = await CategoryServices.updateCategoryById(id, updateData);

        res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error); // Debug log
        res.status(500).json({ message: "Error updating category", error });
    }
};

const removeCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { shopId } = req.user // Assuming the shopId is in the token payload
        // console.log('Shop ID:', shopId); // Debug log

        // Check if the category exists
        const existingCategory = await CategoryServices.getCategoryById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Remove the category
        await CategoryServices.removeCategoryById(categoryId);

        res.status(200).json({ message: 'Category removed successfully' });
    } catch (error) {
        console.error('Error removing category:', error);
        res.status(500).json({ message: 'Error removing category', error });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryServices.getAllCategories()
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error })
    }
}

module.exports = {
    addCategory,
    updateCategory,
    removeCategoryById,
    getAllCategories
}