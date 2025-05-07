const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const menuItemsController = require("../controllers/menuItemsController");

const upload = require("@middleware/upload_images");


// ============ slider ============ 
//url mặt đinh là http://localhost:5000/slider
router.get("/", menuController.get_menu);
router.get("/add", menuController.show_add_menu);
router.post("/add", menuController.add_menu);
router.get("/edit/:id", menuController.edit_menu);
router.get("/delete/:id", menuController.delete_menu);

router.post('/item/:id', menuItemsController.add_page_post_page);
router.post('/item/delete/:id', menuItemsController.delete_menu_items);
router.post('/item/update/:id', menuItemsController.nestable_items);
router.post('/item/save/:id', menuItemsController.save_menu);

router.get('/search/pages', menuItemsController.search_pages);
router.get('/search/products', menuItemsController.search_product_categories);
router.get('/search/posts', menuItemsController.search_post_categories);


module.exports = {
    //url mặt đinh là http://localhost:5000/slider
    path: "/menu",  //  Module mới có đường dẫn riêng
    router,
};