const Category = require('../models/category-model'); // Assuming you have a Category model
// const { ForbiddenError } = require('../utils/errors'); // Custom error handling utility

// Middleware to check if the logged-in shop is authorized to update or delete a category
const verifyCategoryOwnership = async (req, res, next) => {
    try {
        const { shopId, role } = req.user; // Extract shopId and role from the token
        const { id } = req.params; // Extract categoryId from the route parameters

        // console.log('Category ID:', id); // Debug log
        // console.log('Shop ID:', shopId); // Debug log
        // console.log('User Role:', role); // Debug log

        if (role !== 'shop_owner') {
            return res.status(403).json({ message: 'Only shop owners can perform this action.' });
        }

        const category = await Category.findByPk(id);
        // console.log('Category:', category); // Debug log

        if (!category) {
            return res.status(404).json({ error: 'Category not found.' });
        }

        if (category.shopId.toString() !== shopId) {
            throw new Error('You are not authorized to modify this category.');
        }

        req.category = category; // Attach the category to the request object for further use
        next();
    } catch (error) {
        next(error);
    }
};

// Middleware to validate category creation
const validateCategoryCreation = (req, res, next) => {
    try {
        const { shopId, role } = req.user; // Extract shopId and role from the token

        if (role !== 'shop_owner') {
            throw new Error('Only shop owners can create categories.');
        }

        req.body.shopId = shopId; // Attach the shopId to the category being created
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    verifyCategoryOwnership,
    validateCategoryCreation,
};