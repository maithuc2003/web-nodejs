module.exports = (req, res, next) => {
    // Nếu là đường dẫn /gio-hang thì mới kiểm tra đăng nhập
    if (req.path.startsWith("/gio-hang") || req.path.startsWith("/thanh-toan") ||req.path.startsWith("/doi-mat-khau") || req.path.startsWith("/info-user") || req.path.startsWith("/don-hang") ) {
        if (!req.session.user) {
            console.log("🚨 Chưa đăng nhập! Chuyển hướng đến /dang-nhap");
            return res.redirect("/dang-nhap");
        }
    }

    next(); // Cho phép truy cập các route còn lại hoặc đã đăng nhập
};