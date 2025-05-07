const express = require("express");
const router = express.Router();
const sliderController = require("../controllers/SliderController");
// Nếu cần upload file thì giữ nguyên, còn không thì có thể bỏ
const upload = require("@middleware/upload_images");

// ============ Trang ============
// URL chính là http://localhost:5000/slider

// 1. Danh sách sliders
router.get("/", sliderController.list_slider);
// router.get("/list", sliderController.list_slider);
// router.get("/slider/:id", sliderController.list_slider);
router.get("/page/:id", sliderController.list_slider);

// 2. Trang form thêm slider
router.get("/add", sliderController.add_slider);
// 3. Xử lý thêm slider
router.post('/add',  upload.array("thumb_img", 1), sliderController.create_slider);


// 4. Trang form sửa slider
router.get("/edit/:id", sliderController.edit_slider);

// 5. Xử lý sửa slider
router.post("/edit/:id", upload.array("thumb_img", 1), sliderController.update_slider);

// 6. Xóa slider
router.get("/delete/:id", sliderController.delete_slider);

// ===============================

module.exports = {
    path: "/slider",  // Module này sẽ gắn ở /slider
    router
};
