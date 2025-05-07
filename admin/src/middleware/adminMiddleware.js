module.exports = (req, res, next) => {
    // console.log("🔍 Kiểm tra session:", req.session);
    console.log("🔍 Kiểm tra admin:", req.session.admin);
    // Nếu session có user, gán vào res.locals để dùng trong EJS
    res.locals.admin = req.session.admin || null;
    next(); // Chuyển sang middleware tiếp theo
};