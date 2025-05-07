const User = require("../../../../database/tbl_user");

exports.index = async (req, res) => {
  const data = {
  };

  res.render("info_user", data);
};

exports.updateUserInfo = async (req, res, next) => {
  try {
      const { fullname, username, phone, email } = req.body;
      const { id } = req.params; // Lấy user id từ URL params
      
      console.log("Dữ liệu cập nhật:", req.body);

      // Tìm user cần cập nhật
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).send("Không tìm thấy người dùng!");
      }

      // Kiểm tra nếu username hoặc email đã tồn tại ở user khác
      const existingUser = await User.findOne({ 
          $or: [{ username }, { email }],
          _id: { $ne: id } // _id khác user hiện tại
      });
      if (existingUser) {
          return res.render("update", { error: "Tên đăng nhập hoặc email đã tồn tại!" });
      }

      // Cập nhật thông tin user
      user.fullname = fullname;
      user.username = username;
      user.phone = phone;
      user.email = email;

      // Lưu thay đổi
      await user.save();

    // Lưu thông tin user vào session
    req.session.user = {
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


