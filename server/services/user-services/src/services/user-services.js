const User = require('../../../../shared/models/user-model');

const UserServices = {
    async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    },

    async updateUser(id, userData) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            await user.update(userData);
            return user;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    },

    async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found');
            }
            await user.destroy();
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    },

    async getAllUsers() {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }
}

module.exports = UserServices;