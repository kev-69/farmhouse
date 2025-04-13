const crypto = require('crypto');

/**
 * Generates a verification token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} - The generated verification token.
 */
function generateVerificationToken(userId) {
    const token = crypto.randomBytes(32).toString('hex'); // Generate a random 32-byte token
    return `${userId}.${token}`; // Combine the user ID with the token
}

/**
 * Generates a password reset token for a user.
 * @param {string} userId - The ID of the user.
 * @returns {string} - The generated password reset token.
 */
function generatePasswordResetToken(userId) {
    const token = crypto.randomBytes(32).toString('hex'); // Generate a random 32-byte token
    return `${userId}.${token}`; // Combine the user ID with the token
}

/**
 * Verifies an email token and extracts the user ID.
 * @param {string} token - The email verification token.
 * @returns {string|null} - The extracted user ID if the token is valid, otherwise null.
 */
function verifyEmailToken(token) {
    const parts = token.split('.');
    if (parts.length !== 2) {
        return null; // Invalid token format
    }
    const [userId, tokenPart] = parts;
    if (!userId || !tokenPart) {
        return null; // Invalid token content
    }
    return userId; // Return the user ID if the token is valid
}

/**
 * Verifies a password reset token and extracts the user ID.
 * @param {string} token - The password reset token.
 * @returns {string|null} - The extracted user ID if the token is valid, otherwise null.
 */
function verifyPasswordResetToken(token) {
    const parts = token.split('.');
    if (parts.length !== 2) {
        return null; // Invalid token format
    }
    const [userId, tokenPart] = parts;
    if (!userId || !tokenPart) {
        return null; // Invalid token content
    }
    return userId; // Return the user ID if the token is valid
}

module.exports = {
    generateVerificationToken,
    generatePasswordResetToken,
    verifyEmailToken,
    verifyPasswordResetToken, // Reusing the same function for simplicity
};