const User = require('../../../../shared/models/user-model');

const UserServices = {
    async createUser(userData) {
        try {
            // console.log('Creating user with data:', userData);
            const user = await User.create(userData);
            return user;
        } catch (error) {
            console.error('Validation error details:', error.errors);
            throw new Error('Error registering user: ' + error.message);
        }
    },

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

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ where: { email } });
            return user; // Return null if user is not found
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

    async verifyEmail(email) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }
            user.email_verified = true;
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error verifying email: ' + error.message);
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