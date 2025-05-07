// const Post = require("../models/PostModel");
const tbl_post_cat = require("../../../../database/tbl_post_cat");
const tbl_post = require("../../../../database/tbl_post"); // Import model sản phẩm
const tbl_menu_items = require("../../../../database/tbl_menu_items"); // Import model sản phẩm

exports.list_post_cat = async (req, res) => {
  try {
    const { id } = req.params;  // Lấy category_id từ URL (post category)
    const perPage = 12;  // Số bài viết mỗi trang
    const page = parseInt(req.params.page) || 1;  // Trang hiện tại từ query string, mặc định là 1

    // Truy vấn tất cả các mục trong tbl_menu_items với product_category_id là id trong URL
    const menuItems = await tbl_menu_items.find({ post_category_id: id });
    if (menuItems.length === 0) {
      return res.status(404).render("404", { message: "Không có mục nào với post_category_id này" });
    }
    // console.log(menuItems);
    // Lấy _id từ từng mục trong menuItems
    const parent_ids = menuItems.map(item => item._id);
    console.log(parent_ids);

    // Lấy tất cả các mục con với parent_id là _id của các menu items
    let menu_sub = await tbl_menu_items.find({ parent_id: { $in: parent_ids } });
    // Nếu không có mục con, dùng menuItems làm mục con
    if (menu_sub.length === 0) {
      menu_sub = menuItems;
    }

    // Lấy tất cả post_category_id từ các mục menu con
    const categoryIds = menu_sub.map(item => item.post_category_id);

    // Truy vấn thông tin danh mục bài viết
    const category = await tbl_post_cat.findById(id);

    // Lấy bài viết cho trang hiện tại
    const posts = await tbl_post.find({
      category_id: { $in: categoryIds },
    })
      .skip((page - 1) * perPage)  // Bỏ qua các bài viết đã hiển thị ở các trang trước
      .sort({ createdAt: -1 })
      .limit(perPage);  // Giới hạn số bài viết hiển thị trên mỗi trang

    // console.log(posts);

    // Tính toán số trang
    const totalPosts = await tbl_post.countDocuments({
      category_id: { $in: categoryIds },
    });

    // Tính toán số trang
    const totalPages = Math.ceil(totalPosts / perPage);
    const stt_post = (page - 1) * perPage;

    const data = {
      category,  // Thông tin danh mục bài viết
      menuItems,  // Các mục trong menu tương ứng với post_category_id
      posts,  // Danh sách bài viết
      currentPage: page,
      totalPages,
      stt_post,  // Thứ tự bài viết bắt đầu từ 0
    };
    console.log(category);
    res.render("list_post", data);  // Render view với bài viết & menu items

  } catch (err) {
    console.error("Lỗi khi lấy danh mục bài viết:", err);
    res.status(500).render("error", { message: "Lỗi máy chủ" });
  }
};


// Hiển thị chi tiết bài viết
exports.detail = async (req, res) => {
  try {
    console.log("ID:", req.params.id); // debug
    const page = await tbl_post.findById(req.params.id); // Nếu ID Mongo

    if (!page) {
      return res.status(404).send("Không tìm thấy bài viết");
    }
    console.log(page);
    res.render("detail_blog", {
      page
    });

  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bài viết:", error);
    res.status(500).send("Đã xảy ra lỗi server");
  }
};

// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.