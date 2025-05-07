// 1. Load module alias và biến môi trường
require("module-alias/register");
require("dotenv").config();

// 2. Cấu hình thư viện cần thiết
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const session = require('express-session');

// 3. Kết nối MongoDB
const connectDB = require("@config/database");
connectDB();

const app = express();
const port = process.env.PORT || 8000;

// 4. Cấu hình View Engine
const moduleViews = require("@lib/views");
app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views"), ...moduleViews]);
app.locals.BASE_URL = process.env.BASE_URL;
const methodOverride = require('method-override')

// 5. Middleware chung (cần dùng trước routes)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static('./src/public'));

// 6. Middleware session (đặt sau các middleware chung)
app.use(session({
    name: 'user.sid',
    secret: process.env.SCRET_SESSION_KEY || "4a3f1e98c9a0b2e4d2fabcde67589fdc2e3a7b9c5d4e3f1a9b2c4d6e8f0a1b3c",
    resave: false,
    saveUninitialized: true,  // Đảm bảo session không bị trống
    cookie: {
        secure: false,         // Dùng true nếu HTTPS
        httpOnly: true,        // Bảo mật: chỉ server truy cập
        maxAge: 24 * 60 * 60 * 1000  // 1 ngày
    }
}));

// 7. Middleware inject dữ liệu cho view (phải trước routes)
const load_featured_products = require("./src/middleware/featured_products");
app.use(load_featured_products);

const menuMiddleware = require("./src/middleware/menu");
app.use(menuMiddleware.main_menu);
app.use(menuMiddleware.footer_menu);

const layoutMiddleware = require("@helper/template");
app.use(layoutMiddleware);

// 8. Middleware xác thực và user
const userMiddleware = require("./src/middleware/userMiddleware");
app.use(userMiddleware); // Gán user vào res.locals

// 8. Middleware xác thực và user
const sliderMiddleware = require("./src/middleware/slider");
app.use(sliderMiddleware); // Gán user vào res.locals

const authMiddleware = require("./src/middleware/authMiddleware");
app.use(authMiddleware); // Xác thực user trước khi vào route
app.use(methodOverride('_method'))
// 9. Routes (Đặt routes sau tất cả middleware)
const route = require("@lib/routes");
app.use("/", route);

// 10. Redirect mặc định
app.get("/", (req, res) => {
    res.redirect("/trang-chu");
});

// 11. Start server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
