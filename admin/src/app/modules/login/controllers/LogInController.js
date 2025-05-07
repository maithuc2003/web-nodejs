const User = require("../models/tbl_admin");
// const { get_layout } = require("@helper/template");
const bcrypt = require("bcrypt");
// const { mongooseToObject } = require('../utils/mongoose');

// [GET] /dang-nhap
exports.index = async (req, res, next) => {
    let data = {
        // get_layout,
        user: req.session.user || null,
    }
    console.log("🔍 Dữ liệu truyền vào EJS:", data);
    res.render("login", data);
}

// [POST] /dang-nhap
exports.submit_login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.render("login", { error: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        // const isMatch = await user.comparePassword(password, user.password_hash);
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.render("login", { error: "Tên đăng nhập hoặc mật khẩu không đúng!" });
        }

        req.session.admin = {
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
        };
        // Chuyển hướng đến "/san-pham" và truyền tên user
        req.session.save(() => {
            res.redirect("/sanpham"); // Chờ session lưu xong mới redirect
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return res.status(500).send("Lỗi máy chủ!");
    }
};


// [POST] /dang-nhap/logout
exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Lỗi đăng xuất:", err);
            return res.status(500).send("Lỗi đăng xuất");
        }
        res.redirect("/dang-nhap"); // Chuyển hướng về trang đăng nhập
    });
}
