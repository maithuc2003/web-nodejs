const tbl_post_cat = require("./tbl_post_cat");

// Thêm danh mục bài viết
const addPostCat = async (postCatData) => {
    const add = new tbl_post_cat(postCatData);
    return await add.save();
};

// Lấy tất cả danh mục bài viết
const getPostCat = async () => {
    return await tbl_post_cat.find().populate("admin_id", "username");
};

// Lấy danh mục bài viết theo ID
const getPostCatById = async (id) => {
    return await tbl_post_cat.findById(id).populate("admin_id", "username").lean();
};

// Xóa danh mục bài viết theo ID
const deletePostCat = async (id) => {
    return await tbl_post_cat.findByIdAndDelete(id);
};

// Cập nhật danh mục bài viết theo ID
const updatePostCatById = async (id, updatedData) => {
    return await tbl_post_cat.findByIdAndUpdate(id, updatedData, { new: true });
};

module.exports = {
    addPostCat,
    getPostCat,
    getPostCatById,
    deletePostCat,
    updatePostCatById
};
