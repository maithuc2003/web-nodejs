const { getProductsPaging ,countProduct } = require("../models/homeModel");
exports.home_page = async (req, res) => {
    const perPage = 12; // Số sản phẩm trên mỗi trang
    const page = parseInt(req.params.id) || 1; // Lấy số trang từ query hoặc mặc định là trang 1
    const totalProducts = await countProduct();     // Đếm tổng số sản phẩm
    const list_product = await getProductsPaging(page, perPage);
    // console.log(list_product);
    const data = {
        // get_layout,
        list_product,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / perPage), // Tổng số trang
        stt_product: (page - 1) * perPage,
    }
    res.render("home", data);
};


// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.