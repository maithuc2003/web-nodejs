const tbl_order = require('../../../../database/tbl_order');
const tbl_user = require('../../../../database/tbl_user');
const tbl_product = require("../../../../database/tbl_product"); // Import model sản phẩm
exports.index = async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.params.page) || 1;
    // Lấy user_id từ session
    const userId = req.session.user.id;
    // Đếm tổng số đơn hàng của user đó
    const totalResults = await tbl_order.countDocuments({ user_id: userId });

    // Lấy danh sách đơn hàng của user theo phân trang
    const orders = await tbl_order.find({ user_id: userId, status: {$ne: 'canceled'} })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('user_id', 'username');

    const totalPages = Math.ceil(totalResults / perPage);
    console.log(orders);
    res.render("list_order", {
      orders,
      totalResults,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Lỗi khi tải đơn hàng của người dùng:", error);
    res.status(500).send("Có lỗi xảy ra khi tải đơn hàng.");
  }
};


exports.detail_order = async (req, res) => {
  try {
    // const { id } = req.body; // Lấy ID từ URL
    const orderId = req.params.id

    const order = await tbl_order.findById(orderId).populate('user_id', 'username')
    console.log(order);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    const products = await tbl_product.find({
      _id: { $in: order.product_list }
    });

    const data = { order, products };
    res.render("detail_order", data);

    // res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi lấy chi tiết đơn hàng." });
  }
};

exports.cancel_order = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.session.user.id; // Đảm bảo chỉ người sở hữu mới được hủy

    const order = await tbl_order.findOne({ _id: orderId, user_id: userId });

    if (!order) {
      return res.status(404).send("Không tìm thấy đơn hàng.");
    }

    if (order.status === 'canceled' || order.status === 'delivered') {
      return res.status(400).send("Không thể hủy đơn hàng đã giao hoặc đã huỷ.");
    }
    console.log(order);
    order.status = 'canceled';
    await order.save();

    res.redirect('/don-hang'); // hoặc nơi bạn liệt kê đơn hàng
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    res.status(500).send("Lỗi khi xử lý yêu cầu hủy đơn hàng.");
  }
};
