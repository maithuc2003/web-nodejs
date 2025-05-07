// const { get_layout } = require("@helper/template");
const { formatDate } = require("@helper/format"); // Import helper
const tbl_page = require("../models/tbl_page");


// ================== Trang ==================

// 1. Hiển thị danh sách Page
exports.list_page = async (req, res) => {
  const perPage = 6; // Số sản phẩm trên mỗi trang
  const page = parseInt(req.params.id) || 1; // Lấy số trang từ query hoặc mặc định là trang 1
  const total_pages = await tbl_page.countDocuments();     // Đếm tổng số sản phẩm
  const status_vn = {
    draft: "Bản nháp",
    published: "Đã Đăng",
  };
  try {
    // Gọi hàm getProducts() để lấy danh sách sản phẩm theo trang
    const pages = await tbl_page.find().populate("admin_id", "username").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
    pages.forEach(page => {
      page.page_status = status_vn[page.page_status] || "Không xác định";
    });
    // console.log(pages);
    const data = {
      pages, // truyền vào view
      formatDate,
      currentPage: page,
      total_pages,
      totalPages: Math.ceil(total_pages / perPage), // Tổng số trang
      stt_page: (page - 1) * perPage,
    };
    res.render("list_page", data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server!");
  }
};

// 2. Hiện giao diện thêm Page
exports.add_page = (req, res) => {
  const data = {
  };
  res.render("add_page", data);
};

// 3. Xử lý thêm Page

exports.create_page = async (req, res) => {
  try {
    const { title, slug, detail, status } = req.body;

    const newPage = new tbl_page({
      page_title: title,
      page_slug: slug, // tạo trống trước
      page_content: detail,
      page_status: status,
      admin_id: req.session.admin.id,
    });
    await newPage.save();

    res.redirect("/trang");
  } catch (err) {
    console.error("Lỗi khi thêm page:", err);
    res.status(500).send("Thêm trang thất bại!");
  }
};

// 4. Hiện form sửa Page
exports.edit_page = async (req, res) => {
  try {
    const page = await tbl_page.findById(req.params.id).populate("admin_id", "username");
    if (!page) {
      return res.status(404).send("Không tìm thấy trang!");
    }

    const data = {
      page,
      formatDate,
    };
    // console.log(page);

    res.render("edit_page", data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi load form sửa!");
  }
};

// 5. Xử lý sửa Page
exports.update_page = async (req, res) => {
  try {
    const pageId = req.params.id;
    const { title, slug, detail, status } = req.body;
    // Cập nhật dữ liệu trong MongoDB
    await tbl_page.findByIdAndUpdate(
      pageId,
      {
        page_title: title,
        page_slug: slug,
        page_content: detail, // Thay vì "desc"
        page_status: status,
      },
      { new: true }
    );

    res.redirect("/trang");
  } catch (err) {
    console.error(err);
    res.status(500).send("Cập nhật trang thất bại!");
  }
};

// 6. Xóa Page
exports.delete_page = async (req, res) => {
  try {
    await tbl_page.findByIdAndDelete(req.params.id);
    res.redirect("/trang");
  } catch (err) {
    console.error(err);
    res.status(500).send("Xóa trang thất bại!");
  }
};

exports.search_page = async (req, res) => {
  const perPage = 6;
  const page = parseInt(req.query.page) || 1;
  const searchQuery = req.query.q || ""; // Từ khóa tìm kiếm

  const status_vn = {
    draft: "Bản nháp",
    published: "Đã Đăng",
  };

  try {
    // Tạo bộ lọc tìm kiếm cho tiêu đề trang
    const filter = {
      page_title: { $regex: searchQuery, $options: "i" }
    };

    // Đếm tổng số kết quả
    const totalPages = await tbl_page.countDocuments();
    const totalResults = await tbl_page.countDocuments(filter);

    // Truy vấn các bản ghi phù hợp
    const results = await tbl_page.find(filter)
      .populate("admin_id", "username")
      .skip((page - 1) * perPage)
      .limit(perPage);

    results.forEach(pageDoc => {
      pageDoc.page_status = status_vn[pageDoc.page_status] || "Không xác định";
    });

    const data = {
      pages: results,
      query: searchQuery,
      currentPage: page,
      totalResults,
      totalPages,
      totalPages: Math.ceil(totalResults / perPage),
      stt_page: (page - 1) * perPage,
      formatDate,
      perPage,
    };

    res.render("list_search_pages", data); // có thể tạo view riêng nếu muốn
  } catch (err) {
    console.error("Lỗi khi tìm kiếm trang:", err);
    res.status(500).send("Lỗi máy chủ. Vui lòng thử lại sau.");
  }
};

exports.search = async (req, res) => {
  const perPage = 6;
  const page = parseInt(req.body.page) || 1;

  const { status } = req.body;

  const status_vn = {
    draft: "Bản nháp",
    published: "Đã Đăng",
  };

  try {
    const filter = {};

    // Lọc theo trạng thái
    if (status) {
      filter.page_status = status;
    }

    // Đếm tổng số page sau khi lọc
    const totalResults = await tbl_page.countDocuments(filter);

    // Truy vấn page theo trang
    const results = await tbl_page.find(filter)
      .populate('admin_id', 'username')
      .skip((page - 1) * perPage)
      .limit(perPage);

    const pages = results.map(pageItem => ({
      _id: pageItem._id,
      page_title: pageItem.page_title,
      page_slug: pageItem.page_slug,
      page_status: status_vn[pageItem.page_status] || "Không xác định",
      page_content: pageItem.page_content, // tóm tắt nội dung
      admin_id: pageItem.admin_id?._id || null,
      admin_username: pageItem.admin_id?.username || "Không có admin",
      createdAt: pageItem.createdAt,
      updatedAt: pageItem.updatedAt

    }));
    // console.log(pages);
    return res.json({
      success: true,
      totalResults,
      pages,
      perPage,
      currentPage: page
    });

  } catch (err) {
    console.error("Lỗi khi tìm kiếm trang:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau."
    });
  }
};


const slugify = require('slugify');

exports.create_slug = async (req, res) => {
  try {
    const { title } = req.body;
    const slug_url = slugify(title, { lower: true, strict: true });
    // console.log(slug_url);
    res.send(slug_url); // Trả về slug cho client
  } catch (err) {
    console.error("Lỗi khi tạo slug:", err);
    res.status(500).send("Lỗi khi tạo slug");
  }
};