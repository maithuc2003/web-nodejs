const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const PostCatController = require("../controllers/PostCatController");

const upload = require("@middleware/upload_images");
// Hiển thị danh sách sản phẩm trên giao diện
router.get("/", PostController.list_post);
router.get("/page/:id", PostController.list_post);

router.delete("/:id", PostController.destroy_post);
router.get("/edit/:id", PostController.edit_post);

// Route cập nhật bài viết, thêm `upload.single("post_image")`
router.put("/:id", upload.single("thumb_img"), PostController.update_post);
router.get("/add", PostController.add_post);
router.post("/create", upload.array("thumb_img", 1), PostController.create_post);
// router.post("/create", upload.array("thumb_img", 20), productController.add_product);

router.get("/search", PostController.search_post); // Trang chính (mặc định là trang 1)
// router.get("/search/page/:id", PostController.search_post);
router.post("/search", PostController.search); // Trang chính (mặc định là trang 1)


// ============  Danh mục sản phẩm ============ 
router.get("/danhmuc", PostCatController.list_post_cat);
router.get("/danhmuc/add", PostCatController.show_add_post_cat);
router.post("/danhmuc/add", PostCatController.add_post_cat);
router.get("/danhmuc/edit/:id", PostCatController.edit_post_cat);
router.post("/danhmuc/edit/:id", PostCatController.update_post_cat);
router.get("/danhmuc/delete/:id", PostCatController.delete_post_cat);

module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/bai-viet",  //  Module mới có đường dẫn riêng
    router,
};