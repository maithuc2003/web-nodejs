const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

// ============ trang ============ 
router.get("/filter_product", productController.filter_product);

//url mặt đinh là http://localhost:5000/trang
// router.get("/", productController.list_page); 
router.get("/:slug/:id", productController.list_product_cat);

router.get("/:slug/:id/page/:page", productController.list_product_cat);
router.get("/:id", productController.detail_product);
// /filter_product → bị bắt nhầm là id = "filter_product"
// → gọi vào detail_product → nổ ObjectId


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/san-pham",  //  Module mới có đường dẫn riêng
    router,
};