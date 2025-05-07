const express = require("express");
const router = express.Router();
const pageController = require("../controllers/PageController");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
// router.get("/", pageController.list_post);


router.get("/:slug/:id", pageController.detail);


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/trang",  //  Module mới có đường dẫn riêng
    router,
};