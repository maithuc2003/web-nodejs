// const { get_layout } = require("@helper/template");
const { formatDate } = require("@helper/format"); // Import helper
const tbl_slider = require("../models/tbl_slider");
const { deleteOldImage } = require("../models/SliderModel");

// ================== Trang ==================

// 1. Hiển thị danh sách Page
exports.list_slider = async (req, res) => {
  const perPage = 6; // Số sản phẩm trên mỗi slider
  const slider = parseInt(req.params.id) || 1; // Lấy số slider từ query hoặc mặc định là slider 1
  const totalPages = await tbl_slider.countDocuments();     // Đếm tổng số sản phẩm
  const status_vn = {
    draft: "Bản nháp",
    published: "Đã Đăng",
  };
  try {
    // Gọi hàm getProducts() để lấy danh sách sản phẩm theo slider
    const sliders = await tbl_slider.find()
      .populate("admin_id", "username") // Lấy username của admin
      .skip((slider - 1) * perPage).limit(perPage);
    sliders.forEach(slider => {
      slider.slider_status = status_vn[slider.slider_status] || "Không xác định";
    });
    console.log(sliders);
    const data = {
      sliders, // truyền vào view
      formatDate,
      currentPage: slider,
      totalPages: Math.ceil(totalPages / perPage), // Tổng số slider
      stt_slider: (slider - 1) * perPage,
    };
    res.render("list_slider", data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server!");
  }
};

// 2. Hiện giao diện thêm Page
exports.add_slider = (req, res) => {
  const data = {
  };
  res.render("add_slider", data);
};

// 3. Xử lý thêm Page
exports.create_slider = async (req, res) => {
  try {
    // 👉 Thêm dòng này để xem dữ liệu form gửi về là gì
    const { title, slug, detail, status } = req.body;
    if (!title) {
      return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ thông tin!',
        errors: {
          title: !title ? 'Tiêu đề không được để trống' : null,
        }
      });
    }
    const slider_image = req.files && req.files.length > 0 ? `/images/uploads/${req.files[0].filename}` : null;

    const newPage = new tbl_slider({
      slider_title: title,
      slider_slug: slug,
      slider_content: detail,
      slider_status: status,
      slider_image, // ✅ Lưu ảnh
      admin_id: req.session.admin.id, // ✅ Lưu ObjectId của admin

    });
    await newPage.save();
    // res.json("hello");
    res.redirect("/slider");
  } catch (err) {
    console.error("Lỗi khi thêm slider:", err);
    res.status(500).send("Thêm slider thất bại!");
  }
};

// 4. Hiện form sửa Page
exports.edit_slider = async (req, res) => {
  try {
    const slider = await tbl_slider.findById(req.params.id).populate('admin_id', 'username');
    if (!slider) {
      return res.status(404).send("Không tìm thấy slider!");
    }
    const data = {
      slider,
      formatDate,
    };
    res.render("edit_slider", data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi khi load form sửa!");
  }
};

// 5. Xử lý sửa Slider
exports.update_slider = async (req, res) => {
  try {
    const sliderId = req.params.id;
    const { title, slug, detail, status } = req.body;
    // Lấy slider hiện tại
    let slider = await tbl_slider.findById(sliderId);
    // Xóa ảnh cũ nếu có ảnh mới được upload
    if (req.files && req.files.length > 0) {
      deleteOldImage(slider);
    }
    const slider_image = req.files && req.files.length > 0 ? `/images/uploads/${req.files[0].filename}` : slider.slider_image;

    await tbl_slider.findByIdAndUpdate(
      sliderId,
      {
        slider_title: title,
        slider_slug: slug,
        slider_content: detail,
        slider_status: status,
        slider_image,
      },
      { new: true }
    );
    slider = await tbl_slider.findById(req.params.id).populate('admin_id', 'username');

    const data = {
      slider,
      formatDate,
    };
    res.render("edit_slider", data);
    // res.redirect("/slider");
  } catch (err) {
    console.error(err);
    res.status(500).send("Cập nhật slider thất bại!");
  }
};

// 6. Xóa Page
exports.delete_slider = async (req, res) => {
  try {
    const slider = await tbl_slider.findById(req.params.id);
    deleteOldImage(slider); // Xóa ảnh cũ trước khi xóa slider
    await tbl_slider.findByIdAndDelete(req.params.id);
    res.redirect("/slider");
  } catch (err) {
    console.error(err);
    res.status(500).send("Xóa slider thất bại!");
  }
};
