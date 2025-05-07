const slider = require("./tbl_slider");

const path = require("path");
const fs = require("fs");

// Hàm xóa ảnh cũ của slider
const deleteOldImage = (slider) => {
    if (!slider || !slider.slider_image) return;

    const imagePath = path.join(__dirname, "../../../../../../uploads/public/", slider.slider_image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Đã xóa ảnh cũ: ${imagePath}`);
    }

    // Xóa ảnh liên quan (nếu có)
    if (slider.slider_images && slider.slider_images.length > 0) {
        slider.slider_images.forEach(image => {
            const imagePath = path.join(__dirname, "../../../../../../uploads/public/", image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Đã xóa ảnh liên quan: ${imagePath}`);
            }
        });
    }
};

const data = { deleteOldImage };

// Export các hàm để sử dụng ở file khác
module.exports = data;
