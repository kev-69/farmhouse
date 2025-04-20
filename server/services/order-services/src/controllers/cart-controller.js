const redisClient = require('../config/redis-config');

const addToCart = async (req, res) => {
    try {
        // console.log('Redis Client Status:', redisClient.isOpen ? 'Open' : 'Closed'); // Debug log
        const { user_id, product_id, quantity, price } = req.body;
        if (!user_id || !product_id || !quantity || !price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure the user_id matches the token's user_id
        if (user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: User ID mismatch' });
        }

        const cartKey = `cart:${user_id}`;
        const itemKey = `item:${product_id}`;
        const cartData = { product_id, quantity, price };

        // Add item to cart in Redis
        await redisClient.hSet(cartKey, itemKey, JSON.stringify(cartData));
        return res.status(200).json({ message: 'Item added to cart successfully', cartData });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCart = async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({ message: 'Missing user ID' });
        }

        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const cartKey = `cart:${id}`;
        const cartItems = await redisClient.hGetAll(cartKey);

        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartData = Object.values(cartItems).map(item => JSON.parse(item));
        return res.status(200).json({ message: 'Cart retrieved successfully', cartData });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { id } = req.user;
        const {productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: 'Missing product id' });
        }
        // Check if the user is logged in (you can implement your own logic here)
        // if (!req.session.user) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }
        // Check if the user has a valid session
        // const session = await redisClient.get(`session:${req.session.id}`);
        // if (!session) {
        //     return res.status(401).json({ message: 'Session expired' });
        // }

        const cartKey = `cart:${id}`;
        const itemKey = `item:${productId}`;

        // Remove item from cart in Redis
        await redisClient.hDel(cartKey, itemKey);
        
        return res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateCart = async (req, res) => {
    try {
        const { id } = req.user;
        const { productId } = req.params;
        const { quantity, price } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "No product id provided" })
        }

        if (!price || !quantity) {
            return res.status(400).json({ message: 'Missing required fields: Price or quantity' });
        }

        // Check if the user is logged in (you can implement your own logic here)
        // if (!req.session.user) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }
        // Check if the user has a valid session
        // const session = await redisClient.get(`session:${req.session.id}`);
        // if (!session) {
        //     return res.status(401).json({ message: 'Session expired' });
        // }

        const cartKey = `cart:${id}`;
        const itemKey = `item:${productId}`;
        const cartData = { productId, quantity, price };

        // Update item in cart in Redis
        await redisClient.hSet(cartKey, itemKey, JSON.stringify(cartData));

        return res.status(200).json({ message: 'Cart updated successfully', cartData });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const clearCart = async (req, res) => {
    try {
        const { id } = req.user;
        if (!id) {
            return res.status(400).json({ message: 'Missing user ID' });
        }
        // Check if the user is logged in (you can implement your own logic here)
        // if (!req.session.user) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }
        // Check if the user has a valid session
        // const session = await redisClient.get(`session:${req.session.id}`);
        // if (!session) {
        //     return res.status(401).json({ message: 'Session expired' });
        // }

        const cartKey = `cart:${id}`;

        // Clear cart in Redis
        await redisClient.del(cartKey);
        
        return res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateCartItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;
        const { quantity } = req.body;
        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Check if the user is logged in (you can implement your own logic here)
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the user has a valid session
        const session = await redisClient.get(`session:${req.session.id}`);
        if (!session) {
            return res.status(401).json({ message: 'Session expired' });
        }

        const cartKey = `cart:${user_id}`;
        const itemKey = `item:${product_id}`;

        // Update item in cart in Redis
        const cartData = { product_id, quantity };
        await redisClient.hset(cartKey, itemKey, JSON.stringify(cartData));
        
        return res.status(200).json({ message: 'Cart item updated successfully', cartData });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getCartCount = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ message: 'Missing user ID' });
        }
        // Check if the user is logged in (you can implement your own logic here)
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the user has a valid session
        const session = await redisClient.get(`session:${req.session.id}`);
        if (!session) {
            return res.status(401).json({ message: 'Session expired' });
        }

        const cartKey = `cart:${user_id}`;
        const cartItems = await redisClient.hGetAll(cartKey);

        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartCount = Object.keys(cartItems).length;
        
        return res.status(200).json({ message: 'Cart count retrieved successfully', cartCount });
    } catch (error) {
        console.error('Error retrieving cart count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getCartTotal = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            return res.status(400).json({ message: 'Missing user ID' });
        }
        // Check if the user is logged in (you can implement your own logic here)
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the user has a valid session
        const session = await redisClient.get(`session:${req.session.id}`);
        if (!session) {
            return res.status(401).json({ message: 'Session expired' });
        }

        const cartKey = `cart:${user_id}`;
        const cartItems = await redisClient.hGetAll(cartKey);

        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartTotal = Object.values(cartItems).reduce((total, item) => {
            const { price, quantity } = JSON.parse(item);
            return total + (price * quantity);
        }, 0);
        
        return res.status(200).json({ message: 'Cart total retrieved successfully', cartTotal });
    } catch (error) {
        console.error('Error retrieving cart total:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    clearCart,
    // updateCartItem,
    // getCartCount,
    // getCartTotal
};