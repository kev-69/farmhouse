const CategoryServices = require('../services/category-services')
const ProductServices = require('../services/product-services')

const { check, validationResult } = require('express-validator')

const addProduct = async (req, res) => {
    const { product_name, description, price, category_id, stock_quantity } = req.body
    try {
        const productImages = req.files.map(file => file.path)

        // validate inputs
        await check('product_name').notEmpty().withMessage('Product name is required').run(req);
        await check('description').notEmpty().withMessage('Product description is required').run(req)
        await check('price').isNumeric().withMessage('Price must be a number').run(req)
        await check('category_id').isNumeric().withMessage('Category ID must be a number').run(req)
        await check('stock_quantity').isNumeric().withMessage('Stock quantity must be a number').run(req)

        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() })
        }

        // check if category exist
        const category = await CategoryServices.getCategoryById(category_id) 
        if (!category) {
            return res.status(400).json({ message: 'Invalid category. Category does not exist' })
        }

        // create product
        const newProduct = await ProductServices.addProduct({
            product_name,
            description,
            price,
            category_id,
            stock_quantity,
            product_images: productImages
        })

        if(!newProduct) {
            return res.status(400).json({ message: 'Error creating product' })
        }
        res.status(201).json({ message: "Product successfully added", newProduct })
    } catch (error) {
        res.status(500).json({ message: 'Error adding product. Please try again', error})
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.id
    const updates = req.body
    try {
        // Validate that at least one field is being updated
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' })
        }

        const updatedProduct = await ProductServices.updateProductById(productId, updates)

        if (!updatedProduct) {
            return res.status(400).json({ message: 'Error updating product or product not found' })
        }

        res.status(200).json({ message: 'Product successfully updated', updatedProduct })
    } catch (error) {
        res.status(500).json({ message: 'Error updating product. Please try again', error })
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    try {
        const product = await ProductServices.removeProductById(productId)
        
        // check if product exist before deleting
        if (!product) {
            return res.status(400).json({ message: "Product not found" })
        }
        
        res.status(200).json({message: "Product successfully deleted"})
    } catch (error) {
        res.status(500).json({message: 'Error deleting product', error})
    }
}

const getProductById = async (req, res) => {
    const productId = req.params.id
    try {
        const product = await ProductServices.getProductById(productId)

        if(!product) {
            return res.status(400).json({ message: 'Product not found' })
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductServices.getAllProducts()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error
        })
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts
}