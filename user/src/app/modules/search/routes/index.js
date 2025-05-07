const express = require("express");
const router = express.Router();
const searchController = require("../controllers/SearchController");

// ============ trang ============ 
//url mặt đinh là http://localhost:5000/trang
router.get("/", searchController.list_search); 
router.post("/", searchController.search); 

router.get("/page/:id", searchController.list_search); 


// router.get("/:id", cartController.detail); 


module.exports = {
    //url mặt đinh là http://localhost:5000/trang
    path: "/search",  //  Module mới có đường dẫn riêng
    router,
};