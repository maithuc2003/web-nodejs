// const ejs = require('ejs');
// const fs = require('fs');
// const path = require('path');

// const get_layout = (layoutName = "", data = {}) => {
//     let filePath = path.join(__dirname, `../layouts/${layoutName}.ejs`);
//     return fs.existsSync(filePath) ? ejs.render(fs.readFileSync(filePath, 'utf8'), data) : `File "${filePath}" không tồn tại!`;
// };


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
