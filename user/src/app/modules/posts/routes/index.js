const express = require("express");
const router = express.Router();
const postController = require("../controllers/PostController");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.get("/:slug/:id", postController.list_post_cat);
router.get("/:slug/:id/page/:page", postController.list_post_cat);

router.get("/:id.html", postController.detail);

// router.get("/:slug/:id", productController.list_product_cat);

// router.get("/:slug/:id/page/:page", productController.list_product_cat);

module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/bai-viet",  //  Module mới có đường dẫn riêng
    router,
};