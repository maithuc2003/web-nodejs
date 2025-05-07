// const { get_layout } = require("@helper/template"); // == ko xóa==
const { formatDate } = require("@helper/format"); // Import helper


const Page = require('../../pages/models/tbl_page'); // Import model
const Product_cat = require('../../products/models/tbl_product_cat'); // Import model
const Post = require('../../posts/models/tbl_post_cat'); // Import model
const tbl_position = require('../models/tbl_position'); // Import model
const tbl_menu = require('../models/tbl_menu'); // Import model
const tbl_menu_items = require('../models/tbl_menu_items'); // Import model
const {
    buildMenuTree,
} = require("../models/menuModel");

exports.get_menu = async (req, res) => {
    try {
        const menus = await tbl_menu.find().populate("admin_id", "username").populate("select_menu", "position_name");
        const data = {
            menus,
        }
        // console.log(menus);
        res.render('list_menu', data); // Truyền pages vào view
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};

exports.show_add_menu = async (req, res) => {
    try {
        const MenuPositions = await tbl_position.find();
        const data = {
            MenuPositions,
        }
        res.render('add_menu', data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};

exports.add_menu = async (req, res) => {
    try {
        const { title, slug, select_menu } = req.body;

        // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
        if (!title || !slug || !select_menu) {
            const allPositions = await tbl_position.find(); // cần lấy lại danh sách để render lại form
            return res.render('add_menu', {
                error: 'Vui lòng điền đầy đủ thông tin',
                MenuPositions: allPositions,
            });
        }
        // Lấy danh sách các vị trí menu
        const MenuPosition = await tbl_position.findOne({ position_name: select_menu });
        // Tạo mới một menu
        const newMenu = new tbl_menu({
            title,
            slug,
            select_menu: MenuPosition._id, // select_menu là ObjectId của vị trí menu
            admin_id: req.session.admin.id,
        });
        // Lưu menu vào MongoDB
        await newMenu.save();
        res.redirect("/menu");
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};


exports.edit_menu = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy ID của menu từ URL
        const menu = await tbl_menu.findById(id).populate('select_menu').populate('admin_id');  // Lấy menu cần sửa
        const MenuPositions = await tbl_position.find();
        // Lấy dữ liệu để điền vào form chỉnh sửa (các trang, danh mục, bài viết, ...)
        const pages = await Page.find({ page_status: 'published' });
        const product_cat = await Product_cat.find();
        const posts = await Post.find();
        console.log(posts);
        // const menu_items = await tbl_menu_items.find();
        const raw_menu_items = await tbl_menu_items.find({ menu_id: id });
        const menu_items = buildMenuTree(raw_menu_items);

        // Dữ liệu truyền vào view
        const data = {
            MenuPositions,
            menu,  // Truyền thông tin menu cần chỉnh sửa
            product_cat,
            posts,
            pages,
            menu_items,
            formatDate,
        }


        // Render trang chỉnh sửa
        res.render('edit_menu', data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};
exports.delete_menu = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy ID của menu từ URL

        // Tìm và xóa menu theo ID
        const deletedMenu = await tbl_menu.findByIdAndDelete(id);

        if (!deletedMenu) {
            return res.status(404).send('Menu không tồn tại');
        }

        // Xóa các mục liên quan trong tbl_menu_items dựa trên menu_id
        await tbl_menu_items.deleteMany({ menu_id: id });

        // Quay lại trang danh sách menu sau khi xóa
        res.redirect('/menu');
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi xóa menu');
    }
};


// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.