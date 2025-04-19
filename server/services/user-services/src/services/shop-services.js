const Shop = require('../models/shop-model');

const ShopServices = {
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

    async contShops() {
        try {
            const count = await Shop.count();
            return count;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ShopServices;