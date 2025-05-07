// const { get_layout } = require("@helper/template");
const { formatDate } = require("@helper/format"); // Import helper
const { addProductCat,
    getProductCat,
    deletedProductCat,
    getProductCatId,
    updatedProductId,
} = require("../models/productCatModel");

//Hiện danh sách
exports.list_product_cat = async (req, res) => {
    try {
        const product_cat = await getProductCat();
        const data = {
            product_cat,
        };
        res.render("list_product_cat", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy danh mục!");
    }
};
// Hiện giao diện thêm sản phẩm
exports.show_add_product_cat = async (req, res) => {
    res.render("add_product_cat");
};

// ========= add========
exports.add_product_cat = async (req, res) => {
    try {
        const { title, slug } = req.body;
        // Kiểm tra dữ liệu bắt buộc
        if (!title) {
            throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        }
        // console.log("Dữ liệu req.files:", req.files);
        const productCatData = {
            category_name: title,
            category_slug: slug,
            admin_id: req.session.admin.id, // ✅ Lưu ObjectId của admin
        };
        await addProductCat(productCatData);
        res.redirect("/sanpham/danhmuc");
        // res.render("add_product_cat", { get_layout, message: "Sản phẩm đã được thêm thành công!" });
    } catch (error) {
        console.error(error);
        res.render("add_product_cat", { error: error.message || "Có lỗi xảy ra!" });
    }
};

// ========= edit ========

// Hiện edit sản phẩm
exports.edit_product_cat = async (req, res) => {
    try {
        const id = req.params.id;
        // Kiểm tra xem sản phẩm có tồn tại không
        const productCatId = await getProductCatId(id);
        const data = { productCatId, formatDate };
        res.render("edit_product_cat", data); // Render trang chỉnh sửa
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy thông tin sản phẩm!");
    }
}

exports.update_product_cat = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, slug } = req.body;
        // Kiểm tra dữ liệu bắt buộc
        if (!title) {
            throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        }
        let productCatId = await getProductCatId(id);
        // console.log("Dữ liệu req.files:", req.files);
        const productCatData = {
            category_name: title,
            category_slug: slug,
        };
        // Cập nhật sản phẩm trong database
        await updatedProductId(id, productCatData);
        // Lấy lại sản phẩm sau khi cập nhật
        productCatId = await getProductCatId(id);
        // Kiểm tra xem sản phẩm có tồn tại không
        const data = { productCatId, formatDate };
        res.render("edit_product_cat", data); // Render trang chỉnh sửa
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi cập nhật sản phẩm!");
    }
};
// Xóa danh mục
exports.delete_product_cat = async (req, res) => {
    try {
        const id = req.params.id;
        await deletedProductCat(id);
        res.redirect("/sanpham/danhmuc"); // Chuyển hướng về danh sách sản phẩm
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi xóa sản phẩm!");
    }

}

//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.