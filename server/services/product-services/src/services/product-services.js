const Product = require('../models/product-model')

const ProductServices = {
    async addProduct(productData) {
        try {
            const product = await Product.create(productData)
            return product
        } catch (error) {
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
    
    async updateProductById(id, productData) {
        try {
            const product = await Product.findByPk(id)

            if (!product) {
                throw new Error('Product not found')
            }

            await Product.update(productData)
            return product
        } catch (error) {
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