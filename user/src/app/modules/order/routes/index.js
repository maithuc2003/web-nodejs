const express = require("express");
const router = express.Router();
const InfoController = require("../controllers/InfoController");

router.get("/", InfoController.index);
router.get('/page/:page', InfoController.index); 
router.get("/:id", InfoController.detail_order); // Trang chính (mặc định là trang 1)
// Cập nhật trạng thái đơn hàng thành "cancled"
router.post('/huy-don/:id', InfoController.cancel_order)


module.exports = {
    //url mặt đinh là http://localhost:5000/info-user
    path: "/don-hang",  //  Module mới có đường dẫn riêng
    router,
};