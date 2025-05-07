const Admin = require("../../login/models/tbl_admin");
// const { get_layout } = require("@helper/template");
const bcrypt = require('bcrypt');

// const { mongooseToObject } = require('../utils/mongoose');

// [GET] /dang-nhap
exports.index = async (req, res, next) => {
    res.render("changepass");
}

exports.changePassword = async (req, res, next) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        // Bảo vệ: chỉ cho phép đổi mật khẩu người đang đăng nhập
        if (email !== req.session.admin.email) {
            return res.status(403).json({ message: 'Bạn không có quyền đổi mật khẩu người khác.' });
        }

        const user = await Admin.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng.' });
        }

        // const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = newPassword;
        await user.save();

        res.redirect("/sanpham");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xử lý.' });
    }
};
