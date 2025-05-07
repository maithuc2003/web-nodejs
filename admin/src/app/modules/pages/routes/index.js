const express = require("express");
const router = express.Router();
const pageController = require("../controllers/PageController");
// Nếu cần upload file thì giữ nguyên, còn không thì có thể bỏ
const upload = require("@middleware/upload_images");


// ============ Trang ============
// URL chính là http://localhost:5000/trang

// 1. Danh sách pages
router.get("/", pageController.list_page);
router.get("/page/:id", pageController.list_page);

// 2. Trang form thêm page
router.get("/add", pageController.add_page);
// 3. Xử lý thêm page
router.post('/add', upload.single('thumb_img'), pageController.create_page);

router.get("/search", pageController.search_page); // Trang chính (mặc định là trang 1)
// router.get("/search/page/:id", pageController.search_page);
router.post("/search", pageController.search); // Trang chính (mặc định là trang 1)

// 4. Trang form sửa page
router.get("/edit/:id", pageController.edit_page);

// 5. Xử lý sửa page
router.post("/edit/:id", pageController.update_page);

// 6. Xóa page
router.get("/delete/:id", pageController.delete_page);


router.post("/slug", pageController.create_slug);


// ===============================

module.exports = {
    path: "/trang",  // Module này sẽ gắn ở /trang
    router
};
