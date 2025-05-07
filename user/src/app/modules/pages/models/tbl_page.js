const mongoose = require('mongoose');

// Định nghĩa Schema cho Page
const pageSchema = new mongoose.Schema({
  page_title: {
    type: String,
    required: true,
    maxlength: 120,
  },
  page_slug: {
    type: String,
    required: true,
    maxlength: 120,
  },
  page_content: {
    type: String,
  },
  page_status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_admin' }, // ✅ Fix lỗi Schema không được định nghĩa
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Tạo model Page
const tbl_page = mongoose.model('tbl_page', pageSchema);

module.exports = tbl_page;
