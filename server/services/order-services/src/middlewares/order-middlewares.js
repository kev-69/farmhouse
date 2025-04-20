const validateOrderStatus = (req, res, next) => {
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    const { status } = req.body; // Assuming status is sent in the request body

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
    }

    next();
}

const verifyUser = (req, res, next) => {
    const { is_verified } = req.user; // Assuming `isVerified` is part of the token payload or fetched from the database
    if (!is_verified) {
        return res.status(403).json({ message: 'Email verification required to place an order.' });
    }
    next();
};

const authorizeShop = (req, res, next) => {
    const { role } = req.user; // Assuming `role` is part of the token payload or fetched from the database
    if (role !== 'shop_owner') {
        return res.status(403).json({ message: 'Access denied. Only shops can access.' });
    }
    next();
}

const validateCart = async (req, res, next) => {
    const { userId } = req.user; // Assuming `userId` is in the token payload
    const cart = await getCart(userId); // Fetch cart from Redis or database

    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock availability for each product
    for (const item of cart.products) {
        const product = await Product.findByPk(item.productId);
        if (!product || product.stock_quantity < item.quantity) {
            return res.status(400).json({ message: `Product ${item.productId} is out of stock or invalid` });
        }
    }

    req.cart = cart; // Attach the validated cart to the request object
    next();
};

module.exports = {
    verifyUser,
    validateOrderStatus,
    authorizeShop,
    validateCart
}