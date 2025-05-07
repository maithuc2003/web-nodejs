const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");


// ============ Sản phẩm ============ 

router.get("/search", OrderController.search_order); // Trang chính (mặc định là trang 1)
router.post("/search", OrderController.search); // Trang chính (mặc định là trang 1)


router.get("/", OrderController.list_order); // Trang chính (mặc định là trang 1)
router.get("/page/:page", OrderController.list_order); // Trang chính (mặc định là trang 1)

router.put("/edit-order-status/:id", OrderController.edit_order_status); // Trang chính (mặc định là trang 1)
router.delete("/:id", OrderController.destroy_order); // Trang chính (mặc định là trang 1)
router.get("/:id", OrderController.detail_order); // Trang chính (mặc định là trang 1)



module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/ban-hang",  //  Module mới có đường dẫn riêng
    router,
};