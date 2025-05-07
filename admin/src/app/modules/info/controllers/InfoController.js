const tbl_admin = require("../../login/models/tbl_admin");
// const { get_layout } = require("@helper/template"); // == ko xóa==
const tbl_user = require("../../orders/models/tbl_user");

exports.index = async (req, res) => {
    const data = {
        // get_layout
    };

    res.render("info_user", data);
};

exports.updateUserInfo = async (req, res, next) => {
    try {
        const { fullname, username, phone, email } = req.body;
        const { id } = req.params; // Lấy user id từ URL params

        console.log("Dữ liệu cập nhật:", req.body);

        // Tìm user cần cập nhật
        const user = await tbl_admin.findById(id);
        if (!user) {
            return res.status(404).send("Không tìm thấy người dùng!");
        }

        // Kiểm tra nếu username hoặc email đã tồn tại ở user khác
        const existingUser = await tbl_admin.findOne({
            $or: [{ username }, { email }],
            _id: { $ne: id } // _id khác user hiện tại
        });
        console.log(existingUser);
        if (existingUser) {
            return res.render("info_user", { error: "Tên đăng nhập hoặc email đã tồn tại!" });
        }

        // Cập nhật thông tin user
        user.fullname = fullname;
        user.username = username;
        user.phone = phone;
        user.email = email;

        // Lưu thay đổi
        await user.save();

        // Lưu thông tin user vào session
        req.session.admin = {
            id: user._id,
            username: user.username,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
        };
        // Chuyển hướng đến "/san-pham" và truyền tên user
        req.session.save(() => {
            res.redirect("/info-user"); // Chờ session lưu xong mới redirect
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản:", error);
        res.status(500).send("Lỗi server, vui lòng thử lại sau!");
    }
}


// [GET] /danh-sach/admin
exports.list_admin = async (req, res, next) => {
    try {
        // Lấy tất cả admin từ MongoDB
        const admins = await tbl_admin.find(); // Nếu cần thêm điều kiện, có thể truyền vào trong find() như: Admin.find({ ... })

        // Render view và truyền danh sách admin vào
        res.render("list_admin", { admins: admins });
    } catch (err) {
        // Xử lý lỗi nếu có
        console.error("Error fetching admins:", err);
        res.status(500).send("Internal Server Error");
    }
}

// [GET] /danh-sach/user
exports.list_user = async (req, res, next) => {
    try {
        // Lấy tất cả user từ MongoDB
        const users = await tbl_user.find(); // Tương tự, nếu cần điều kiện, có thể thêm vào trong find() 

        // Render view và truyền danh sách user vào
        res.render("list_user", { users: users });
    } catch (err) {
        // Xử lý lỗi nếu có
        console.error("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
}
