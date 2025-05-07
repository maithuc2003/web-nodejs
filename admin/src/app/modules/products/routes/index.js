const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const productCatController = require("../controllers/ProductCatController");
const upload = require("@middleware/upload_images");

// ============ Sản phẩm ============ 
router.get("/", productController.list_product); // Trang chính (mặc định là trang 1)
router.get("/page/:id", productController.list_product); // Phân trang
//name img và  Cho phép tải tối đa 20 ảnh.
router.get("/add", productController.show_add_product);
router.post("/add", upload.array("thumb_img", 20), productController.add_product);
// Cập nhật sản phẩm
router.get("/edit/:id", productController.edit_product);
router.post("/edit/:id", upload.array("thumb_img", 20), productController.update_product);
// Xóa
router.get("/delete/:id", productController.delete_product);

router.get("/search", productController.list_search); // Trang chính (mặc định là trang 1)
// router.get("/search/page/:id", productController.list_search);  
router.post("/search", productController.search); // Trang chính (mặc định là trang 1)


// ============  Danh mục sản phẩm ============ 
router.get("/danhmuc", productCatController.list_product_cat);
//Thêm danh mục
router.get("/danhmuc/add", productCatController.show_add_product_cat);
router.post("/danhmuc/add", productCatController.add_product_cat);
// Chỉnh sửa
router.get("/danhmuc/edit/:id", productCatController.edit_product_cat);
router.post("/danhmuc/edit/:id", productCatController.update_product_cat);

// Xóa
router.get("/danhmuc/delete/:id", productCatController.delete_product_cat);



module.exports = {
    //url mặt đinh là http://localhost:5000/san-pham
    path: "/sanpham",  //  Module mới có đường dẫn riêng
    router,
};