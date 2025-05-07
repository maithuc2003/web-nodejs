const mongoose = require("mongoose");

const tbl_post_cat = new mongoose.Schema(
    {
        category_name: { type: String, required: true },
        category_slug: { type: String, required: true, lowercase: true },
        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_admin' }, // ✅ Fix lỗi Schema không được định nghĩa
    },
    { timestamps: true } // Bật tự động cập nhật createdAt, updatedAt
);

module.exports = mongoose.model("tbl_post_cat", tbl_post_cat);
