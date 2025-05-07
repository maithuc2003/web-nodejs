const fs = require("fs");
const path = require("path");

// Danh sách các file cần load (chỉ định)
const lib = ["feature_product.js"]; 
const helper = ["format_date.js"]; 

const autoLoad = (app) => {
    const loadModules = (directory, globalName, whitelist) => {
        const dirPath = path.join(__dirname, "..", directory); // Tạo đường dẫn thư mục
        if (!fs.existsSync(dirPath)) return; // Kiểm tra thư mục có tồn tại không
        const modules = {};
        fs.readdirSync(dirPath).forEach((file) => {
            if (whitelist.includes(file)) { // Chỉ load file có trong whitelist
                const moduleName = file.replace(".js", ""); // Xóa phần mở rộng ".js"
                modules[moduleName] = require(path.join(dirPath, file)); // Import module
            }
        });
        app.locals[globalName] = modules; // Gán vào app.locals
        console.log(`✔ ${globalName} loaded:`, Object.keys(modules));
    };
    // Load các file trong thư mục `lib`
    loadModules("lib", "lib", lib);
    // Load các file trong thư mục `helper`
    loadModules("helper", "helper", helper);
};

module.exports = autoLoad;


// modules[moduleName] = require(path.join(dirPath, file)); // Import module

// app.locals.lib = {
//     feature_product: require("../lib/feature_product.js")
// };
