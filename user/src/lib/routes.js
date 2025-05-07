const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const modulesPath = path.join(__dirname, "../app/modules");

fs.readdirSync(modulesPath).forEach((moduleName) => {
    const routePath = path.join(modulesPath, moduleName, "routes", "index.js");

    if (fs.existsSync(routePath)) {
        const moduleRoutes = require(routePath);
        if (moduleRoutes.path && moduleRoutes.router) {
            router.use(moduleRoutes.path, moduleRoutes.router); // Sử dụng path định nghĩa trong từng file router
        } else {
            console.error(`❌ Lỗi: Module ${moduleName} không có 'path' hoặc 'router'`);
        }
    }
});

module.exports = router;
