const mongoose = require('mongoose');

// Định nghĩa Schema cho Page
const sliderSchema = new mongoose.Schema({
  slider_title: {
    type: String,
    required: true,
    maxlength: 120,
  },
  slider_slug: {
    type: String,
    required: true,
    maxlength: 120,
  },
  slider_content: {
    type: String,
  },
  slider_status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  slider_image: { type: String }, // ✅ Ảnh đại diện của bài viết
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_admin' }, // ✅ Fix lỗi Schema không được định nghĩa
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Tạo model Page
const tbl_slider = mongoose.model('tbl_slider', sliderSchema);

module.exports = tbl_slider;
