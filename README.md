# Website Bán Ghế Đá Ngoài Trời

## Mô Tả
Đây là một website bán ghế đá ngoài trời được xây dựng với Node.js và MongoDB. Website này cung cấp các sản phẩm ghế đá đẹp, chất lượng, được phân loại rõ ràng. Người dùng có thể xem chi tiết sản phẩm, thêm vào giỏ hàng và thực hiện thanh toán. Quản trị viên có thể quản lý các sản phẩm và đơn hàng qua giao diện quản trị.

## Các Công Nghệ Sử Dụng:
1. **Node.js**: Nền tảng chính để xây dựng server backend cho website.
2. **Express**: Framework cho Node.js giúp tạo API và xử lý request.
3. **MongoDB**: Cơ sở dữ liệu NoSQL để lưu trữ thông tin về sản phẩm, người dùng và đơn hàng.
4. **Mongoose**: ODM (Object Data Modeling) giúp dễ dàng tương tác với MongoDB.
5. **Module Aliases**: Để dễ dàng quản lý và truy cập các module trong dự án.
6. **Colors**: Thêm màu sắc cho các log trong terminal, giúp dễ đọc và dễ theo dõi.
7. **Nodemon**: Tự động tái khởi động server khi có thay đổi trong mã nguồn, giúp phát triển nhanh chóng hơn.
8. **Morgan**: Middleware dùng để log các HTTP request, rất hữu ích trong quá trình phát triển.
9. **Dotenv**: Để quản lý các biến môi trường, chẳng hạn như các thông tin nhạy cảm như mật khẩu, API keys, v.v.
10. **Slugify**: Chuyển đổi các tên sản phẩm thành slug (dạng URL-friendly).
11. **Multer**: Middleware để xử lý upload hình ảnh, dùng để upload ảnh sản phẩm lên server.

`npm init`
`npm i express`
`npm install mongoose`
`npm install module-alias` 
`npm i colors nodemon morgan dotenv cors`
`npm install slugify`
/*
  "_moduleAliases": {
    "@helper": "./src/helper",
    "@lib": "./src/lib",
    "@config": "./src/config"
  },
*/
`npm install multer` => xử lý upload ảnh
