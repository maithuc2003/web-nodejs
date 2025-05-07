// const ejs = require('ejs');
// const fs = require('fs');
// const path = require('path');


// const get_layout = (layoutName = "", data = {}) => {
//     data.BASE_URL = data.BASE_URL || process.env.BASE_URL || "http://localhost:8000/"; // Lấy BASE_URL từ env nếu không có
//     if (!layoutName) {
//         return "Chưa chọn giao diện!";
//     }
//     let filePath = path.join(__dirname, `../layouts/${layoutName}.ejs`);
//     if (!fs.existsSync(filePath)) {
//         // console.log("Views directory:", path.join(__dirname, "src/views"));
//         return `File "${filePath}" không tồn tại!`;
//     }
//     return ejs.render(fs.readFileSync(filePath, 'utf8'), data);
// };

// // Khi bạn xuất module trong layout.js như sau:
// module.exports = { get_layout };

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Middleware gắn get_layout vào res.locals
const layoutMiddleware = (req, res, next) => {
    res.locals.get_layout = (layoutName = "") => {
        if (!layoutName) {
            return "Chưa chọn giao diện!";
        }

        const filePath = path.join(__dirname, `../layouts/${layoutName}.ejs`);
        if (!fs.existsSync(filePath)) {
            return `File "${filePath}" không tồn tại!`;
        }

        // Tự động truyền res.locals
        const data = { ...res.locals, BASE_URL: res.locals.BASE_URL || process.env.BASE_URL || "http://localhost:8000/" };

        return ejs.render(fs.readFileSync(filePath, 'utf8'), data);
    };

    next();
};

module.exports = layoutMiddleware;
