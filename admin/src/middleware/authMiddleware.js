
module.exports = (req, res, next) => {
    // console.log("🔍 Kiểm tra session user:", req.session.user);

    // Nếu đang truy cập trang đăng nhập, đăng ký hoặc API đăng ký, không cần kiểm tra session
    if (req.path.startsWith("/dang-nhap") || req.path.startsWith("/dang-ky") || req.path.startsWith("/quen-mat-khau") ) {
        return next();
    }
    // // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!req.session.admin) {
        console.log("🚨 Chưa đăng nhập! Chuyển hướng đến /dang-nhap");
        return res.redirect("/dang-nhap");
    }

    next(); // Tiếp tục xử lý nếu đã đăng nhập
};
