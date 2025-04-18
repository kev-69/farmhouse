const ShopServices = require('../services/shop-services');
dotenv.config();


const updateShopById = async (req, res) => {
    try {
        
    } catch (error) {
        console.error('Error updating shop:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
}

module.exports = {
    updateShopById,

}