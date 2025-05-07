// middlewares/userMiddleware.js
module.exports = (req, res, next) => {
    // console.log("🔍 Kiểm tra session:", req.session);
    // console.log("🔍 Kiểm tra user:", req.session.user);
    // Nếu session có user, gán vào res.locals để dùng trong EJS
    res.locals.user = req.session.user || null;
    next(); // Chuyển sang middleware tiếp theo
};