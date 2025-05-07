const post = require("./tbl_post");
const tbl_post_cat = require("./tbl_post_cat");

const path = require("path");
const fs = require("fs");

// Hàm xóa ảnh cũ của bài viết
const deleteOldImage = (post) => {
    if (!post || !post.post_image) return;

    const imagePath = path.join(__dirname, "../../../../../../uploads/public/", post.post_image);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Đã xóa ảnh cũ: ${imagePath}`);
    }
};

const getListCategories = async () => {
    // .populate("category_id", "category_name").lean()
    const list_cat = await tbl_post_cat.find();
    let categories = {};
    list_cat.forEach(cat => {
        categories[cat._id.toString()] = cat.category_name;
    });
    return categories;
}

const data = { deleteOldImage, getListCategories };

// Export các hàm để sử dụng ở file khác
module.exports = data;