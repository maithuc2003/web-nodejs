const tbl_product = require("../../../../database/tbl_product");
// C:\Users\Admin\Downloads\tich_hop_he_thong\Nhom4\BTNhom\user\src\database
// const getProducts = async () => {
//     return await tbl_product.find({ product_status: "active" });
// }

const countProduct = async () => {
    return await tbl_product.countDocuments();
}

const getProductsPaging = async (page = 1, perPage = 10) => {
    return await tbl_product
        .find({ product_status: "active" })
        .skip((page - 1) * perPage)
        .sort({ createdAt: -1 })
        .limit(perPage);
};
const data = {  getProductsPaging ,countProduct };

// Export các hàm để sử dụng ở file khác
module.exports = data;