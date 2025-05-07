const tbl_product = require("../../../../database/tbl_product");
const User = require("../../register/models/UserModel");
const Order = require("../../../../database/tbl_order");
exports.index = async (req, res) => {
  // const data = {
  //     get_layout,
  // }
  // res.render("checkout", data);

  // Lấy và parse cart từ client
  const cart = JSON.parse(req.body.cart || '{}');

  if (cart === '{}')
    return res.render('checkout')

  const productIds = cart.product_list || [];
  const quantities = cart.product_quantity || [];

  // Lấy thông tin sản phẩm từ DB theo danh sách ID
  const products = await tbl_product.find({ _id: { $in: productIds } });

  // Gắn quantity tương ứng vào từng sản phẩm
  const productsWithQuantity = products.map(product => {
    const index = productIds.indexOf(product._id.toString());
    return {
      ...product._doc,
      quantity: quantities[index] || 1 // fallback nếu không tìm thấy
    };
  });

  const data = {
    // get_layout,
    products: productsWithQuantity
  };

  res.render("checkout", data);
};

exports.checkout = async (req, res) => {
  // res.json(req.body);
  try {
    const {
      fullname,
      phone,
      email,
      address,
      payment_method,
      note,
      cart, // stringified JSON
    } = req.body;

    const parsedCart = JSON.parse(cart);

    const { product_list, product_quantity } = parsedCart;

    // Validate dữ liệu cơ bản
    if (!product_list || !product_quantity || product_list.length !== product_quantity.length) {
      return res.status(400).send('Dữ liệu giỏ hàng không hợp lệ.');
    }

    // Tính tổng tiền (có thể thêm bước truy xuất product từ DB để lấy giá mới nhất)
    const products = await tbl_product.find({ _id: { $in: product_list } });

    let total_amount = 0;
    for (let i = 0; i < product_list.length; i++) {
      const product = products.find(p => p._id.toString() === product_list[i]);
      if (product) {
        total_amount += product.product_new_price * product_quantity[i];
      }
    }

    // Lấy user_id và customer_id từ session nếu có (tùy hệ thống bạn)
    const user_id = req.session.user?.id || null;
    // const customer_id = req.session.customer?._id || null;
    const customer_id = user_id;

    console.log("user id value: ");
    console.log(user_id);

    // Tạo order_id ngẫu nhiên (hoặc bạn có thể auto-increment bằng cách khác)
    const order_id = Date.now(); // Hoặc dùng sequence nếu muốn

    const newOrder = new Order({
      order_id,
      fullname,
      product_list,
      product_quantity,
      total_amount,
      shipping_address: address,
      payment_method,
      phone,
      user_id,
      customer_id,
    });

    await newOrder.save();

    // Redirect hoặc thông báo thành công
    // res.redirect('/checkout/orderSuccess');
    res.render("orderSuccess");
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).send('Có lỗi xảy ra khi xử lý đơn hàng.');
  }
}

// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.