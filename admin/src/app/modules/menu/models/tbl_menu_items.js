const mongoose = require('mongoose');

// Tạo schema cho Menu Item
const menuItemSchema = new mongoose.Schema({
    menu_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_menus', required: true },
    menu_name: { type: String, required: true },
    slug: { type: String, required: true },
    page_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_pages', default: null },
    product_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_product_cats', default: null },
    post_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'tbl_posts', default: null },
    parent_id: { type: String, required: true },
    menu_order: { type: Number, required: true },
});

module.exports = mongoose.model('tbl_menu_items', menuItemSchema);

