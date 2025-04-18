const Shop = require('../models/shop-model');
// const User = require('../models/user-model');

const ShopServices = {
    async addShop(shopData) {
        try {
            const shop = await Shop.create(shopData);
            return shop;
        } catch (error) {
            throw error;
        }
    },

    async removeShop(id) {
        try {
            const shop = await Shop.findByPk(id);

            if (!shop) {
                throw new Error('Shop not found');
            }

            await shop.destroy();
            return true;
        } catch (error) {
            throw error;
        }
    },

    async updateShop(id, shopData) {
        try {
            const shop = await Shop.findByPk(id);

            if (!shop) {
                throw new Error('Shop not found');
            }

            await Shop.update(shopData);
            return shop;
        } catch (error) {
            throw error;
        }
    },

    async getShopById(id) {
        try {
            const shop = await Shop.findByPk(id);

            if (!shop) {
                throw new Error('Shop not found');
            }
            return shop;
        } catch (error) {
            throw error;
        }
    },

    async getAllShops() {
        try {
            const shops = await Shop.findAll();
            return shops;
        } catch (error) {
            throw error;
        }
    },

    async getShopByName(shop_name) {
        try {
            const shop = await Shop.findOne(shop_name);
        
            if (!shop) {
                throw new Error('Shop not found')
            }

            return shop
        } catch (error) {
            throw error
        }
    }
}

module.exports = ShopServices;