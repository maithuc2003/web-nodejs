const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");
const upload = require("@middleware/multer");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.get("/", cartController.list_cart);

router.post("/", cartController.list_cart);
// router.get("/update-cart", cartController.update_cart); 


// router.get("/:id", cartController.detail); 


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/gio-hang",  //  Module mới có đường dẫn riêng
    router,
};