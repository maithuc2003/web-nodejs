const tbl_product = require("../database/tbl_product"); // Model sản phẩm

const load_featured_products = async (req, res, next) => {
    try {
        const featured_products = await tbl_product.find({ is_featured: 1 }).limit(10);
        // console.log(featured_products);
        res.locals.featured_products = featured_products; // Lưu vào res.locals
    } catch (error) {
        console.error("Lỗi lấy sản phẩm nổi bật:", error);
        res.locals.featured_products = []; // Nếu lỗi, gán mảng rỗng
    }
    next(); // Chuyển tiếp đến middleware tiếp theo hoặc route handler
};

module.exports = load_featured_products;
