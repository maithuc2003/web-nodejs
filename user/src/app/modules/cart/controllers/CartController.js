const { get_layout } = require("@helper/template"); // == ko xóa==
const tbl_product = require("../../../../database/tbl_product");



exports.index = async (req, res) => {
  res.send("hehe");
}

exports.list_cart = async (req, res) => {
  // Lấy và parse cart từ client
  const cart = JSON.parse(req.body.cart || '{}');
  
  if (cart === '{}')
    return res.render('list_cart')

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

  // console.log("product with quantity value: ");
  // console.log(productsWithQuantity);
  
  const data = {
    // get_layout,
    products: productsWithQuantity
  };

  res.render("list_cart", data);
};

// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.