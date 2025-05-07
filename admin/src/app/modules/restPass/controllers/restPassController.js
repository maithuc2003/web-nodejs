// const { get_layout } = require("@helper/template");
const tbl_restPass = require("../models/tbl_restPass");
const Admin = require("../../login/models/tbl_admin");

const crypto = require('crypto');
const {
    sendEmail,
} = require("../models/sendEmailModel");

exports.rest_pass = async (req, res) => {
    try {

        const data = {
            // cat_name,
        }
        // console.log(products); // Kiểm tra toàn bộ danh sách sản phẩm
        res.render("rest_pass", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy danh sách sản phẩm!");
    }
};


exports.rest_pass_mail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Vui lòng nhập email" });
    }
    try {
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(404).json({ message: "Không tìm thấy người dùng với email này" });
        }
        // console.log(admin);
        // Tạo token reset mật khẩu
        const token = crypto.randomBytes(20).toString('hex');
        const expiresAt = Date.now() + 3600000; // Token hết hạn sau 1 giờ
        // Lưu token vào cơ sở dữ liệu
        const passwordReset = new tbl_restPass({
            user_id: admin._id,
            token: token,
            expires_at: expiresAt
        });

        await passwordReset.save();
        // Tạo link reset password (mẫu)
        const resetLink = `${process.env.FRONTEND_URL}/quen-mat-khau/check_token?token=${token}`;
        // Thực hiện gửi email với link reset
        await sendEmail(email, resetLink);

        return res.render("rest_pass", {
            message: "🎉 Vui lòng kiểm tra email để đặt lại mật khẩu."
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi gửi email hoặc render trang!");
    }
};

exports.check_token = async (req, res) => {
    const { token } = req.query;  // Lấy token từ query string

    try {
        const resetRecord = await tbl_restPass.findOne({ token });

        // Kiểm tra token
        if (!resetRecord || resetRecord.expires_at < Date.now()) {
            return res.status(400).send(`
                    Token không hợp lệ hoặc đã hết hạn. 
                    <a href="/dang-nhap">Đăng nhập</a>
                `);
        }

        // Tìm người dùng tương ứng
        const user = await Admin.findById(resetRecord.user_id);
        if (!user) {
            return res.status(404).send("Người dùng không tồn tại.");
        }

        // Token hợp lệ, render trang thay đổi mật khẩu
        return res.render("change_pass", {
            user_id: user._id,
            token: token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Lỗi khi kiểm tra token.");
    }
};


exports.change_pass = async (req, res) => {
    const { user_id, token, newPassword } = req.body;  // Lấy thông tin từ form

    try {
        // Tìm bản ghi reset mật khẩu dựa trên token
        const resetRecord = await tbl_restPass.findOne({ token });
        // Kiểm tra token
        if (!resetRecord || resetRecord.expires_at < Date.now()) {
            return res.status(400).send("Token không hợp lệ hoặc đã hết hạn.");
        }

        // Tìm người dùng tương ứng
        const user = await Admin.findById(user_id);
        if (!user) {
            return res.status(404).send("Người dùng không tồn tại.");
        }
        console.log(user)
        // Cập nhật mật khẩu (Lưu ý: Cần mã hóa mật khẩu bằng bcrypt)
        user.password_hash = newPassword; // Bạn cần hash mật khẩu ở đây (sử dụng bcrypt)

        await user.save();  // Lưu người dùng với mật khẩu mới

        // Xóa token sau khi sử dụng để đảm bảo tính bảo mật
        await tbl_restPass.deleteOne({ _id: resetRecord._id });

        // res.send("Đặt lại mật khẩu thành công!");
        res.redirect("/dang-nhap"); // Chờ session lưu xong mới redirect

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi đặt lại mật khẩu.");
    }
};


// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.