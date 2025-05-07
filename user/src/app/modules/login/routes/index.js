const express = require("express");
const router = express.Router();
const LogInController = require("../controllers/LogInController");

router.get("/", LogInController.index);
router.post("/", LogInController.submit_login);
router.get("/logout", LogInController.logout);

module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/dang-nhap",  //  Module mới có đường dẫn riêng
    router,
};