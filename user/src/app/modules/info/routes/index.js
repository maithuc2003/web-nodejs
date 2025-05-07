const express = require("express");
const router = express.Router();
const InfoController = require("../controllers/InfoController");

router.get("/", InfoController.index);
router.put("/:id", InfoController.updateUserInfo);

module.exports = {
    //url mặt đinh là http://localhost:5000/info-user
    path: "/info-user",  //  Module mới có đường dẫn riêng
    router,
};