const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CheckoutController");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.post("/", cartController.index); 
router.post("/checkout", cartController.checkout); 


// router.get("/:id", cartController.detail); 


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/thanh-toan",  //  Module mới có đường dẫn riêng
    router,
};