const express = require("express");
const router = express.Router();
const InfoController = require("../controllers/InfoController");

router.get("/", InfoController.index);
router.put("/:id", InfoController.updateUserInfo);
// router.get("/admin", InfoController.listAdmins);
// router.get("/user", InfoController.listUser);
router.get("/admin", InfoController.list_admin);
router.get("/user", InfoController.list_user);

module.exports = {
    //url mặt đinh là http://localhost:5000/info-user
    path: "/info-user",  //  Module mới có đường dẫn riêng
    router,
};