const UserServices = require('../services/auth-services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const { 
    generateVerificationToken,
    generatePasswordResetToken,
    verifyEmailToken,
    verifyPasswordResetToken
} = require('../utils/token-util');

const {
    sendVerificationEmail,
    sendPasswordResetEmail
} = require('../utils/email-util');

const registerUser = async (req, res) => {
    try {
        const { username, first_name, last_name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserServices.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await UserServices.createUser({
            username,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            is_verified: false,
        });

        // Generate verification token
        const verificationToken = generateVerificationToken(newUser.id);

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'User registered successfully. Please verify your email.', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserServices.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify the token
        const userId = verifyEmailToken(token);
        if (!userId) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        // Update user verification status
        await UserServices.updateUser(userId, { is_verified: true });

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// for forgot password
const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (email) {
            // Request password reset
            const user = await UserServices.getUserByEmail(email);
            if (!user) {
                return res.status(400).json({ error: 'User not found.' });
            }

            const resetToken = generatePasswordResetToken(user.id);
            await sendPasswordResetEmail(email, resetToken);

            return res.status(200).json({ message: 'Password reset email sent.' });
        } else if (token && newPassword) {
            // Reset password
            const userId = verifyPasswordResetToken(token);
            if (!userId) {
                return res.status(400).json({ error: 'Invalid or expired token.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserServices.updateUser(userId, { password: hashedPassword });

            return res.status(200).json({ message: 'Password reset successfully.' });
        } else {
            return res.status(400).json({ error: 'Invalid request.' });
        }
    } catch (error) {
        console.error('Error handling password reset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

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

// for when maybe a user is logged in and wants to change their password
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const { oldPassword, newPassword } = req.body;

        // Check if user exists
        const user = await UserServices.getUserById(userId);
        if (!user) {
            return res.status(400).json({ error: 'User not found.' });
        }

        // Check if old password is correct
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ error: 'Old password is incorrect.' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await UserServices.updateUser(userId, { password: hashedNewPassword });

        res.status(200).json({ message: 'Password changed successfully.', newPassword: hashedNewPassword });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    // requestPasswordReset,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAllUsers,
    changePassword,
};