const Admin = require("../../login/models/tbl_admin");

const { mongooseToObject } = require('../utils/mongoose');
const bcrypt = require('bcrypt');

// [GET] /dang-ky
exports.index = async (req, res, next) => {
    res.render("register");
}

exports.create_user = async (req, res, next) => {
    try {
        const { fullname, username, phone, email, password, confirm_password } = req.body;
        console.log("Dữ liệu nhận từ form:", req.body);
        // Kiểm tra nếu password không khớp
        if (password !== confirm_password) {
            // return res.status(400).send("Mật khẩu nhập lại không khớp!");
            return res.render("register", { password_error: "Mật khẩu nhập lại không khớp!" });
        }
        // Kiểm tra xem username hoặc email đã tồn tại chưa
        const existingUser = await Admin.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            // return res.status(400).send("Tên đăng nhập hoặc email đã tồn tại!");
            return res.render("register", { error: "Tên đăng nhập hoặc email đã tồn tại!" });
        }

        // Lấy user_id lớn nhất hiện tại, tăng lên 1
        const lastUser = await Admin.findOne().sort({ user_id: -1 });
        const newUserId = lastUser ? lastUser.user_id + 1 : 1;
        // Hash mật khẩu trước khi lưu
        // const hashedPassword = await bcrypt.hash(password, 10);
        // Tạo user mới với đúng schema
        const newUser = new Admin({
            user_id: newUserId,
            username,
            phone,
            email,
            password_hash: password, // Đổi từ password sang password_hash
            fullname,
        });
        // Lưu user vào database
        await newUser.save();
        // Chuyển hướng sang trang đăng nhập
        res.redirect("/dang-nhap");
    } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
        res.status(500).send("Lỗi server, vui lòng thử lại sau!");
    }
}
