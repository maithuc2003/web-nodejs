const express = require("express");
const router = express.Router();
const restPassController= require("../controllers/restPassController");
// Nếu cần upload file thì giữ nguyên, còn không thì có thể bỏ


// ============ Trang ============
// URL chính là http://localhost:5000/trang

// 1. Danh sách pages
router.get("/", restPassController.rest_pass);
router.post("/", restPassController.rest_pass_mail);

// 2. Kiểm tra token và render trang đổi mật khẩu
router.get("/check_token", restPassController.check_token);  // Kiểm tra token (dùng query string cho token)

// 3. Xử lý form đổi mật khẩu
// router.get("/change_pass", restPassController.change_pass);  // Thực hiện thay đổi mật khẩu
router.post("/change_pass", restPassController.change_pass);  // Thực hiện thay đổi mật khẩu

// ===============================

module.exports = {
    path: "/quen-mat-khau",  // Module này sẽ gắn ở /trang
    router
};
