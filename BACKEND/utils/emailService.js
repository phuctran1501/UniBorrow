const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"UniBorrow Library" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email đã được gửi: %s', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
