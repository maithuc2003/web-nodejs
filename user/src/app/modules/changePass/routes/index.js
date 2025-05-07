const express = require("express");
const router = express.Router();
const ChangePasswordController = require("../controllers/ChangePasswordController");

router.get("/", ChangePasswordController.index);
router.post("/change-password", ChangePasswordController.changePassword);
// router.get("/logout", LogInController.logout);

module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/doi-mat-khau",  //  Module mới có đường dẫn riêng
    router,
};