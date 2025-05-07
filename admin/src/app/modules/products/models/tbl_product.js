const mongoose = require("mongoose");

const tbl_product = new mongoose.Schema(
    {
        product_name: { type: String, required: true },
        product_slug: { type: String, required: true },
        product_desc: { type: String },
        product_details: { type: String },
        product_new_price: { type: Number, required: true },
        product_old_price: { type: Number },
        stock_quantity: { type: Number, required: true },
        is_featured: { type: Number, enum: [1, 0], default: 1 },
        product_status: {
            type: String,
            enum: ["active", "inactive", "out_of_stock"],
            default: "active",
        },
        featured_image: { type: String },   // Ảnh hiển thị
        product_images: { type: [String] }, // Lưu danh sách ảnh
        category_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "tbl_product_cat" }], // Liên kết với danh mục  // ObjectId("65f123456789abcd12345678")
        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_admin' }, 

    },
    { timestamps: true } // Tự động tạo createdAt & updatedAt
);

module.exports = mongoose.model("tbl_product", tbl_product);

// Thuộc tính	Chức năng	Ví dụ
// type	Xác định kiểu dữ liệu	{ type: String }
// required	Bắt buộc phải có	{ type: String, required: true }
// default	Giá trị mặc định	{ type: Date, default: Date.now }
// unique	Đảm bảo giá trị không trùng	{ type: String, unique: true }
// validate	Kiểm tra dữ liệu hợp lệ	{ type: String, validate: /\S+@\S+\.\S+/ }