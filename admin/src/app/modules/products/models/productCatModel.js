const tbl_product_cat = require("./tbl_product_cat");

const addProductCat = async (productCatData) => {
    const add = new tbl_product_cat(productCatData);
    return await add.save();
};

const getProductCat = async () => {
    return await tbl_product_cat.find().populate("admin_id","username").sort({ createdAt: -1 });
}
const getProductCatId = async (id) => {
    return await tbl_product_cat.findById(id).populate("admin_id","username").lean()
}
// Tìm id và xóa
const deletedProductCat = async (id) => {
    // Khi thêm { new: true }, nó sẽ trả về dữ liệu mới nhất sau khi cập nhật.
    return await tbl_product_cat.findByIdAndDelete(id)
}

const updatedProductId = async (id, updatedData) => {
    // Khi thêm { new: true }, nó sẽ trả về dữ liệu mới nhất sau khi cập nhật.
    return await tbl_product_cat.findByIdAndUpdate(id, updatedData, { new: true })
}
const data = { addProductCat, getProductCat, getProductCatId, deletedProductCat,updatedProductId };

// Export các hàm để sử dụng ở file khác
module.exports = data;