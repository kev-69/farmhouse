const UserServices = require('../services/user-auth-services');
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
        const token = jwt.sign({ id: user.id, role: user.role, verified: user.is_verified }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query; // Extract token from query parameters
        console.log('Token:', token);
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Update user verification status
        const updatedUser = await UserServices.updateUser(userId, { is_verified: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'Email verified successfully.', userId });
    } catch (error) {
        console.error('Error verifying email:', error);

        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ 
                error: 'Token has expired. Please request a new verification email.' 
            });
        }

        res.status(400).json({ error: 'Invalid or expired token.' });
    }
};

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
    resetPassword,
    changePassword,
};