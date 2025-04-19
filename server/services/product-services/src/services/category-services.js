const Category = require('../models/category-model')

const CategoryServices = {
    async addCategory(categoryData) {
        try {
            const category = await Category.create(categoryData)
            return category
        } catch (error) {
            throw error
        }
    },

    async removeCategoryById(id) {
        try {
            const category = await Category.findByPk(id)

            if (!category) {
                throw new Error('Category not found')
            }

            await category.destroy()
            return true
        } catch (error) {
            throw error
        }
    },
    
    async updateCategoryById(id, updateData) {
        try {
            // console.log('Updating Category ID:', id); // Debug log
            // console.log('Update Data:', updateData); // Debug log

            const category = await Category.findByPk(id)

            if (!category) {
                throw new Error('Category not found')
            }

            await category.update(updateData)
            return category
        } catch (error) {
            throw error
        }
    },

    async getCategoryById(id) {
        try {
            const category = await Category.findByPk(id)

            if (!category) {
                throw new Error('Category not found')
            }
            return category
        } catch (error) {
            throw error
        }
    },

    async getAllCategories() {
        try {
            const categories = await Category.findAll()
            return categories
        } catch (error) {
            throw error          
        }
    },

    async getCategoryByName(category_name) {
        try {
            const category = await Category.findOne({ where: { category_name } })
            return category
        } catch (error) {
            throw error
        }
    }
}

module.exports = CategoryServices