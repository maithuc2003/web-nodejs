// const { get_layout } = require("@helper/template");
const { formatDate } = require("@helper/format");

const {
    addPostCat,
    getPostCat,
    getPostCatById,
    deletePostCat,
    updatePostCatById
} = require("../models/postCatModel");

// Hiện danh sách danh mục bài viết
exports.list_post_cat = async (req, res) => {
    try {
        const post_cat = await getPostCat();
        const data = {
            post_cat,
        };
        res.render("list_post_cat", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy danh mục bài viết!");
    }
};

// Hiện giao diện thêm danh mục bài viết
exports.show_add_post_cat = async (req, res) => {
    res.render("add_post_cat");
};

// Thêm danh mục bài viết
exports.add_post_cat = async (req, res) => {
    try {
        const { title, slug } = req.body;

        if (!title) {
            throw new Error("Vui lòng nhập đầy đủ thông tin danh mục!");
        }

        const postCatData = {
            category_name: title,
            category_slug: slug,
            admin_id: req.session.admin.id,
        };

        await addPostCat(postCatData);
        res.redirect("/bai-viet/danhmuc");
    } catch (error) {
        console.error(error);
        res.render("add_post_cat", {  error: error.message || "Có lỗi xảy ra!" });
    }
};

// Hiện form chỉnh sửa danh mục bài viết
exports.edit_post_cat = async (req, res) => {
    try {
        const id = req.params.id;
        const postCatData = await getPostCatById(id);

        if (!postCatData) {
            return res.status(404).send("Không tìm thấy danh mục!");
        }

        const data = {  postCatData, formatDate };
        res.render("edit_post_cat", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy thông tin danh mục!");
    }
};

// Cập nhật danh mục bài viết
exports.update_post_cat = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, slug } = req.body;

        if (!title) {
            throw new Error("Vui lòng nhập đầy đủ thông tin danh mục!");
        }

        const updatedData = {
            category_name: title,
            category_slug: slug,
        };

        await updatePostCatById(id, updatedData);
        const postCatData = await getPostCatById(id);
        const data = { postCatData, formatDate };
        res.render("edit_post_cat", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi cập nhật danh mục!");
    }
};

// Xóa danh mục bài viết
exports.delete_post_cat = async (req, res) => {
    try {
        const id = req.params.id;
        await deletePostCat(id);
        res.redirect("/bai-viet/danhmuc");
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi xóa danh mục!");
    }
};
