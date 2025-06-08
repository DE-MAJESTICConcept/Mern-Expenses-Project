// src/utils/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); // To load environment variables

dotenv.config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email service (e.g., 'outlook', 'sendgrid')
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent, // Use html for rich content
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    // Depending on the error, you might want to re-throw or handle it gracefully
    throw new Error('Failed to send email. Please check server logs.');
  }
};

module.exports = sendEmail;
