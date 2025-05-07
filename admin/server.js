// 1. Cấu hình môi trường và thư viện cần thiết
require("module-alias/register");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");

const session = require("express-session");

// 2. Middleware riêng
const adminMiddleware = require("@middleware/adminMiddleware");
const authMiddleware = require("@middleware/authMiddleware");
const layoutMiddleware = require("@helper/template");

const app = express();
const port = process.env.PORT || 8000;

// 3. Thiết lập Session (PHẢI trước userMiddleware hoặc authMiddleware)
app.use(session({
    name: 'admin.sid',
    secret: process.env.SCRET_SESSION_KEY || "4a3f1e98...",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,         // Dùng true nếu HTTPS
        httpOnly: true,        // Bảo mật: chỉ server truy cập
        maxAge: 24 * 60 * 60 * 1000  // 1 ngày
    }
}));

// 4. Kết nối DB
const connectDB = require("@config/database");
connectDB();

// 5. Middleware toàn cục
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static('./src/public'));
app.use(methodOverride('_method')); // PUT/DELETE support

// 6. Cấu hình view
const moduleViews = require("@lib/views");
app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "views"), ...moduleViews]);
app.locals.BASE_URL = process.env.BASE_URL;

// 7. Middleware session-related (THỨ TỰ QUAN TRỌNG)
app.use(layoutMiddleware);   // Gán biến vào layout (nên gán sau session đã có)
app.use(adminMiddleware);     // Gán user/admin vào res.locals
app.use(authMiddleware);
// --> authMiddleware đặt sau cùng hoặc trong từng route riêng nếu cần bảo vệ từng phần

// 8. Routes
const route = require("@lib/routes");
app.use("/", route);

app.get("/", (req, res) => {
    res.redirect("/trang");
});

// 9. Khởi động server
app.listen(port, () => {
    console.log(`Ket noi thanh cong ${port}`);
});
