const ShopServices = require('../services/shop-auth-services');
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

const createShop = async (req, res) => {
    try {
        const { shop_name, shop_owner, shop_email, shop_location, shop_password, shop_description, phone_number } = req.body;

        // Check if shop already exists
        const existingShop = await ShopServices.getShopByName(shop_name);
        if (existingShop) {
            return res.status(400).json({ error: 'Shop already exists with this name.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(shop_password, 10);

        // Create a new shop
        const newShop = await ShopServices.addShop({
            shop_name,
            shop_owner,
            shop_email,
            shop_location,
            shop_password: hashedPassword,
            shop_description,
            phone_number,
            is_verified: false,
        });

        // Generate verification token
        const verificationToken = generateVerificationToken(newShop.id);
        // Send verification email
        await sendVerificationEmail(shop_email, verificationToken);

        res.status(201).json({ message: 'Shop registered successfully. Please verify your email.', shop: newShop });
    } catch (error) {
        console.error('Error registering shop:', error);
        res.status(500).json({ error: 'Internal server error' });    
    }
}

const loginShop = async (req, res) => {
    try {
        const { shop_email, shop_password } = req.body;

        // Check if shop exists
        const existingShop = await ShopServices.getShopByEmail(shop_email);
        if (!existingShop) {
            return res.status(400).json({ error: 'Shop not found with this email.' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(shop_password, existingShop.shop_password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: existingShop.id, role: existingShop.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.error('Error logging in shop:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const verifyShopEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Verify the token
        const decoded = verifyEmailToken(token);
        if (!decoded) {
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }

        // Update shop verification status
        const updatedShop = await ShopServices.updateShop(decoded.id, { is_verified: true });
        if (!updatedShop) {
            return res.status(404).json({ error: 'Shop not found.' });
        }

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const requestPasswordReset = async (req, res) => {
    try {
        const { shop_email } = req.body;

        // Check if shop exists
        const existingShop = await ShopServices.getShopByEmail(shop_email);
        if (!existingShop) {
            return res.status(400).json({ error: 'Shop not found with this email.' });
        }

        // Generate password reset token
        const passwordResetToken = generatePasswordResetToken(existingShop.id);
        // Send password reset email
        await sendPasswordResetEmail(shop_email, passwordResetToken);

        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const resetShopPassword = async (req, res) => {
    try {
        const { token, new_password } = req.body;

        // Verify the token
        const decoded = verifyPasswordResetToken(token);
        if (!decoded) {
            return res.status(400).json({ error: 'Invalid or expired password reset token.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update shop password
        const updatedShop = await ShopServices.updateShop(decoded.id, { shop_password: hashedPassword });
        if (!updatedShop) {
            return res.status(404).json({ error: 'Shop not found.' });
        }

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createShop,
    loginShop,
    verifyShopEmail,
    requestPasswordReset,
    resetShopPassword,
};