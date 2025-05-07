const nodemailer = require("nodemailer");

// Hàm gửi email (có thể sử dụng nodemailer như trước)
const sendEmail = async (to, resetLink) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Reset Mật Khẩu',
        text: `Bạn đã yêu cầu reset mật khẩu. Vui lòng nhấn vào link dưới đây để thay đổi mật khẩu:\n\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
};


const data = { sendEmail };

// Export các hàm để sử dụng ở file khác
module.exports = data;