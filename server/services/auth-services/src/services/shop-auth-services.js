const Shop = require('../../../user-services/src/models/shop-model');

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

    async getShopByName(shop_name) {
        try {
            const shop = await Shop.findOne({ where: { shop_name } });
            return shop;
        } catch (error) {
            throw error;
        }
    },

    async getShopByEmail(shop_email) {
        try {
            const shop = await Shop.findOne({ where: { shop_email } });
            return shop;
        } catch (error) {
            throw error;
        }
    },
}

module.exports = ShopServices;