const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        post_title: { type: String, required: true },
        post_slug: { type: String },
        post_excerpt: { type: String },
        post_content: { type: String },
        post_image: { type: String }, // ✅ Ảnh đại diện của bài viết
        post_status: {
            type: String,
            enum: ['draft', 'published', 'pending', 'archived'],
            default: 'draft',
        },
        category_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "tbl_post_cat" }], // Liên kết với danh mục  // ObjectId("65f123456789abcd12345678")

        admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_admin' }, // ✅ Fix lỗi Schema không được định nghĩa
    },
    { timestamps: true }
);

module.exports = mongoose.model('tbl_post', PostSchema);
