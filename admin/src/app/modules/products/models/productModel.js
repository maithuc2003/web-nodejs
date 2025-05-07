const tbl_product = require("./tbl_product");
const tbl_product_cat = require("./tbl_product_cat");


const addProduct = async (productData) => {
    const add = new tbl_product(productData);
    return await add.save();
};

const getProductId = async (id) => {
    return await tbl_product.findById(id).populate("admin_id","username").lean()
}
const updatedProduct = async (id, updatedData) => {
    // Khi thêm { new: true }, nó sẽ trả về dữ liệu mới nhất sau khi cập nhật.
    return await tbl_product.findByIdAndUpdate(id, updatedData, { new: true })
}

const getListCategories = async () => {
    // .populate("category_id", "category_name").lean()
    const list_cat = await tbl_product_cat.find();
    let categories = {};
    list_cat.forEach(cat => {
        categories[cat._id.toString()] = cat.category_name;
    });
    return categories;
}

// const getProducts = async () => {
//     return await tbl_product.find();
// }
// Lấy sản phẩm theo phân trang
const getProductsPaging = async (page = 1, perPage = 10) => {
    return await tbl_product
        .find()
        .populate("admin_id", "username")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .populate('category_id'); // hoặc 'categories' nếu bạn đổi tên field;
};
// Đếm tổng sản phẩm
const countProduct = async () => {
    return await tbl_product.countDocuments();
}

// Tìm id và xóa
const deletedProduct = async (id) => {
    // Khi thêm { new: true }, nó sẽ trả về dữ liệu mới nhất sau khi cập nhật.
    return await tbl_product.findByIdAndDelete(id)
}

const path = require("path");
const fs = require("fs");

// Hàm xóa ảnh cũ của sản phẩm
const deleteOldImages = (product) => {
    if (!product) return;

    // Xóa ảnh đại diện
    if (product.featured_image) {
        const featuredImagePath = path.join(__dirname, "../../../../../../uploads/public/", product.featured_image);
        if (fs.existsSync(featuredImagePath)) {
            fs.unlinkSync(featuredImagePath);
            console.log(`Đã xóa ảnh đại diện: ${featuredImagePath}`);
        }
    }

    // Xóa ảnh liên quan
    if (product.product_images && product.product_images.length > 0) {
        product.product_images.forEach(image => {
            const imagePath = path.join(__dirname, "../../../../../../uploads/public/", image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Đã xóa ảnh: ${imagePath}`);
            }
        });
    }
};

const data = { addProduct, updatedProduct, getProductsPaging, getProductId, countProduct, deletedProduct, getListCategories, deleteOldImages };

// Export các hàm để sử dụng ở file khác
module.exports = data;