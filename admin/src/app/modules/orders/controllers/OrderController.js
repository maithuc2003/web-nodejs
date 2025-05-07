// const { get_layout } = require("@helper/template");
const tbl_order = require('../models/tbl_order');
const tbl_user = require('../models/tbl_user');

const tbl_product = require('../../products/models/tbl_product');
exports.list_order = async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.params.page) || 1;

    // Đếm tổng số đơn hàng
    const totalResults = await tbl_order.countDocuments();

    // Lấy đơn hàng phân trang + populate user
    const orders = await tbl_order.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('user_id', 'username');

    const totalPages = Math.ceil(totalResults / perPage);

    const data = {
      orders,
      totalResults,
      currentPage: page,
      totalPages,
    };

    res.render("list_order", data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Lỗi khi tải danh sách đơn hàng.");
  }
};


exports.detail_order = async (req, res) => {
  try {
    // const { id } = req.body; // Lấy ID từ URL
    const orderId = req.params.id
    console.log("orderId value: ");
    console.log(orderId);

    const order = await tbl_order.findById(orderId).populate('user_id', 'username')

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    const products = await tbl_product.find({
      _id: { $in: order.product_list }
    });

    const data = {order, products };
    res.render("edit_order", data);

    // res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy chi tiết đơn hàng." });
  }
};

exports.edit_order_status = async (req, res) => {
  try {
    const orderId = req.params.id;
    const newStatus = req.body.status;

    // Cập nhật tình trạng đơn hàng
    const updatedOrder = await tbl_order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send('Không tìm thấy đơn hàng');
    }

    // Redirect hoặc trả về JSON theo nhu cầu
    //   res.json(updatedOrder);
    res.redirect(`/ban-hang/${orderId}`);
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
    res.status(500).send('Đã có lỗi xảy ra khi cập nhật đơn hàng');
  }
};

exports.destroy_order = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Xóa đơn hàng theo ID
    const deletedOrder = await tbl_order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).send('Không tìm thấy đơn hàng để xóa');
    }

    // Redirect lại trang danh sách đơn hàng
    res.redirect('/ban-hang');
  } catch (error) {
    console.error('Lỗi khi xóa đơn hàng:', error);
    res.status(500).send('Đã xảy ra lỗi khi xóa đơn hàng');
  }
};


exports.search = async (req, res) => {
  const perPage = 10;
  const page = parseInt(req.body.page) || 1;
  const { status } = req.body;

  const statusMap = {
    pending: "Chờ duyệt",
    processing: "Đang vận chuyển",
    shipped: "Đã gửi hàng",
    delivered: "Thành công",
    canceled: "Đã huỷ"
  };

  try {
    const filter = { deleted: false };
    if (status) {
      filter.status = status;
    }

    const totalResults = await tbl_order.countDocuments(filter);

    const results = await tbl_order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const orders = results.map(order => ({
      _id: order._id,
      order_id: order.order_id,
      fullname: order.fullname,
      phone: order.phone,
      status: order.status,
      status_vi: statusMap[order.status] || "Không xác định",
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
    // console.log(orders);
    return res.json({
      success: true,
      totalResults,
      orders,
      perPage,
      currentPage: page
    });
  } catch (err) {
    console.error("Lỗi khi tìm kiếm đơn hàng:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau."
    });
  }
};

exports.search_order = async (req, res) => {
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const searchQuery = req.query.q?.trim() || "";

  const status_vn = {
    pending: "Chờ duyệt",
    processing: "Đang vận chuyển",
    shipped: "Đã gửi hàng",
    delivered: "Thành công",
    canceled: "Đã huỷ"
  };

  try {
    const filter = [];

    // Tìm theo order_id nếu query là số
    if (!isNaN(searchQuery)) {
      filter.push({ order_id: Number(searchQuery) });
    }

    // Tìm theo tên hoặc số điện thoại
    filter.push(
      { fullname: { $regex: searchQuery, $options: "i" } },
      { phone: { $regex: searchQuery, $options: "i" } }
    );

    const finalFilter = { $or: filter };

    const totalResults = await tbl_order.countDocuments(finalFilter);
    const totalPages = Math.ceil(totalResults / perPage);

    const results = await tbl_order.find(finalFilter)
      .populate("user_id", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    results.forEach(order => {
      order.status_vi = status_vn[order.status] || "Không xác định";
    });

    const stt_page = (page - 1) * perPage; // <== Tính số thứ tự bắt đầu

    const data = {
      orders: results,
      query: searchQuery,
      currentPage: page,
      totalResults,
      totalPages,
      perPage,
      stt_page // Gửi qua view
    };

    res.render("list_order_search", data);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm đơn hàng:", err);
    res.status(500).send("Lỗi máy chủ. Vui lòng thử lại sau.");
  }
};
