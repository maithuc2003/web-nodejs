const fs = require("fs");
const path = require("path");

const modulesPath = path.join(__dirname, "../app/modules");
let moduleViews = [];

if (fs.existsSync(modulesPath)) {
    moduleViews = fs.readdirSync(modulesPath)
        .map(module => path.join(modulesPath, module, "views"))
        .filter(viewPath => fs.existsSync(viewPath)); // Kiểm tra thư mục views có tồn tại
}

module.exports = moduleViews;
