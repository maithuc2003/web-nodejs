const express = require("express");
const router = express.Router();
const homeController = require("../controllers/HomeController");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.get("/page/:id", homeController.home_page); 
router.get("/", homeController.home_page); 

//url là http://localhost:5000/trang/add
// router.get("/add", productController.add_page); 



module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/trang-chu",  //  Module mới có đường dẫn riêng
    router,
};