const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

async function sendVerificationEmail(email, verificationToken) {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, 
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASSWORD // Your email password
            }
        });

        // Construct the verification URL
        const verificationUrl = `http://localhost:3001/verify-email?token=${verificationToken}`;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Recipient address
            subject: 'Verify Your Email Address',
            html: `
                <h1>Welcome to Farmhouse!</h1>
                <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>If you did not sign up for this account, please ignore this email.</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully.');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email.');
    }
}

async function sendPasswordResetEmail(email, resetToken) {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASSWORD // Your email password
            }
        });

        // Construct the password reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Recipient address
            subject: 'Reset Your Password',
            html: `
                <h1>Password Reset Request</h1>
                <p>We received a request to reset your password. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email.');
    }
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};