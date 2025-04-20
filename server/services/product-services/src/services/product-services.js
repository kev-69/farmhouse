const Product = require('../models/product-model')

const ProductServices = {
    async createProduct(productData) {
        try {
            // console.log('Product data:', productData)
            const product = await Product.create(productData)
            return product
        } catch (error) {
            console.error('Error creating product:', error)
            throw error
        }
    },

    async removeProductById(id) {
        try {
            const product = await Product.findByPk(id)

            if (!product) {
                throw new Error('Product not found')
            }

            await product.destroy()
            return true
        } catch (error) {
            throw error
        }
    },
    
    async updateProductById(id, updates) {
        try {
            // console.log('Product ID:', id); // Debug log
            // console.log('Updates:', updates); // Debug log
    
            const [updatedRowsCount, updatedRows] = await Product.update(updates, {
                where: { id },
                returning: true, // Ensure the updated rows are returned
            });
    
            // console.log('Updated Rows Count:', updatedRowsCount); // Debug log
            // console.log('Updated Rows:', updatedRows); // Debug log
    
            if (updatedRowsCount === 0) {
                return null; // No rows were updated
            }
    
            return updatedRows[0]; // Return the first updated row
        } catch (error) {
            console.error('Error in updateProductById:', error); // Debug log
            throw error
        }
    },

    async getProductById(id) {
        try {
            const product = await Product.findByPk(id)

            if (!product) {
                throw new Error('Product not found')
            }
            return product
        } catch (error) {
            throw error
        }
    },

    async getAllProducts() {
        try {
            const products = await Product.findAll()
            return products
        } catch (error) {
            throw error          
        }
    },

    async getProductByName(product_name) {
        try {
            const product = await Product.findOne({ where: { product_name } })
            return product
        } catch (error) {
            throw error
        }
    }
}

module.exports = ProductServices