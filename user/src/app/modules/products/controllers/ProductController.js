const tbl_product_cat = require("../../../../database/tbl_product_cat");
const tbl_product = require("../../../../database/tbl_product"); // Import model sản phẩm
const tbl_menu_items = require("../../../../database/tbl_menu_items"); // Import model sản phẩm

exports.list_product_cat = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy parent_id từ URL
        const perPage = 12;  // Số sản phẩm trên mỗi trang
        const page = parseInt(req.params.page) || 1;  // Lấy số trang từ query string, mặc định là 1

        // Truy vấn tất cả các mục trong tbl_menu_items với parent_id là parent_id trong URL
        const menuItems = await tbl_menu_items.find({ product_category_id: id });
        if (menuItems.length === 0) {
            return res.status(404).render("404", { message: "Không có mục nào với parent_id này" });
        }
        console.log(menuItems);
        // Lấy _id từ từng mục trong menuItems
        const parent_ids = menuItems.map(item => item._id);
        console.log(parent_ids);
        // Lấy tất cả các mục con với parent_id là _id của các menu items
        let menu_sub = await tbl_menu_items.find({ parent_id: { $in: parent_ids } });
        // Nếu không có mục con, dùng menuItems như mục con
        if (menu_sub.length === 0) {
            menu_sub = menuItems;
        }
        // console.log(menu_sub);

        // / Lấy tất cả product_category_id từ các mục menu con
        const categoryIds = menu_sub.map(item => item.product_category_id);
        // console.log("Danh sách category_ids:", categoryIds);
        const category = await tbl_product_cat.findById(id);
        if (!category) {
            return res.status(404).render("404", { message: "Danh mục không tồn tại!" });
        }
        // console.log("Danh sách category_ids:", categoryIds);
        // Lấy sản phẩm cho trang hiện tại
        const products = await tbl_product.find({
            category_id: { $in: categoryIds },
        })
            .skip((page - 1) * perPage)  // Bỏ qua các sản phẩm đã hiển thị ở các trang trước
            .limit(perPage)  // Giới hạn số sản phẩm hiển thị trên mỗi trang
            .sort({ createdAt: -1 })
            .populate('category_id', 'category_name');  // Lấy thông tin 'category_name' từ bảng tbl_product_cat

        console.log("Danh sách category_ids:", category);

        // Tính toán số trang
        const totalProducts = await tbl_product.countDocuments({
            category_id: { $in: categoryIds },
        });
        // Tính toán số trang
        const totalPages = Math.ceil(totalProducts / perPage);
        const stt_product = (page - 1) * perPage;
        const data = {
            category,
            menuItems,  // Các mục trong menu tương ứng với parent_id
            products,
            currentPage: page,
            totalPages,
            stt_product,  // Thứ tự sản phẩm bắt đầu từ 0, thay đổi tùy vào trang
        };

        res.render("list_product_cat", data);  // Render view với sản phẩm & menu items

    } catch (err) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", err);
        res.status(500).render("error", { message: "Lỗi máy chủ" });
    }
};



exports.filter_product = async (req, res) => {
    try {
        const { price, page = 1 } = req.query;
        const currentPage = parseInt(req.query.page) || 1;

        let filter = {};
        switch (price) {
            case "under_500000":
                filter.product_new_price = { $lt: 500000 };
                break;
            case "500k_1m":
                filter.product_new_price = { $gte: 500000, $lte: 1000000 };
                break;
            case "1m_5m":
                filter.product_new_price = { $gte: 1000000, $lte: 5000000 };
                break;
            case "5m_10m":
                filter.product_new_price = { $gte: 5000000, $lte: 10000000 };
                break;
            case "over_10m":
                filter.product_new_price = { $gt: 10000000 };
                break;
            default:
                break;
        }

        const perPage = 12;  // Số sản phẩm mỗi trang
        const skip = (page - 1) * perPage;  // Tính skip cho phân trang

        const totalProducts = await tbl_product.countDocuments(filter);
        const products = await tbl_product.find(filter).skip(skip).limit(perPage);

        const totalPages = Math.ceil(totalProducts / perPage);
        // console.log(products);
        // Trả về dữ liệu JSON (sản phẩm và phân trang)
        res.json({
            products,
            totalPages,
            perPage,
            currentPage: currentPage,
        });
    } catch (err) {
        console.error("Lỗi lọc sản phẩm:", err);
        res.status(500).send("Lỗi server khi lọc sản phẩm");
    }
};

exports.detail_product = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await tbl_product.findById(id);

        if (!product) {
            return res.status(404).render("404", { message: "Không tìm thấy sản phẩm" });
        }

        // Lấy toàn bộ danh mục sản phẩm (nếu muốn lấy 1 thì dùng product.category_id[0])
        const categories = await tbl_product_cat.find({ _id: { $in: product.category_id } });

        const relatedProducts = await tbl_product.find({
            category_id: { $in: product.category_id },
            _id: { $ne: product._id }
        }).limit(4);
        console.log(categories);
        res.render("detail_product", {
            product,
            categories,
            relatedProducts,
        });

    } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        res.status(500).render("error", { message: "Lỗi máy chủ khi hiển thị chi tiết sản phẩm" });
    }
};
