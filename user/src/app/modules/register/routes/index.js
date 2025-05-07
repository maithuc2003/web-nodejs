const express = require("express");
const router = express.Router();
const RegisterController = require("../controllers/RegisterController");

router.get("/", RegisterController.index);
router.post("/create-user", RegisterController.create_user);

module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/dang-ky",  //  Module mới có đường dẫn riêng
    router,
};
