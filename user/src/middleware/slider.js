const tbl_slider = require("../database/tbl_slider"); // Model sản phẩm

const load_slider = async (req, res, next) => {
    try {
        const slider = await tbl_slider.find({ slider_status: "published" }).sort({ createdAt: -1 })
        .limit(5); // Lấy 5 cái mới nhất;
        // console.log(slider);
        res.locals.slider = slider; // Lưu vào res.locals
    } catch (error) {
        console.error("Lỗi lấy sản phẩm nổi bật:", error);
        res.locals.slider = []; // Nếu lỗi, gán mảng rỗng
    }
    next(); // Chuyển tiếp đến middleware tiếp theo hoặc route handler
};

module.exports = load_slider;
