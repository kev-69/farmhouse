const UserServices = require('../services/user-services');

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token

        // Fetch user profile
        const user = await UserServices.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const { username, first_name, last_name } = req.body;

        // Update user profile
        await UserServices.updateUser(userId, { username, first_name, last_name });

        res.status(200).json({ message: 'Profile updated successfully.', user: { username, first_name, last_name } });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token

        // Delete user account
        await UserServices.deleteUser(userId);

        res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        // Fetch all users with pagination
        const users = await UserServices.getAllUsers({ offset, limit });
        const totalUsers = await UserServices.countUsers();

        res.status(200).json({
            users,
            pagination: {
                total: totalUsers,
                page: parseInt(page),
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAllUsers,
};