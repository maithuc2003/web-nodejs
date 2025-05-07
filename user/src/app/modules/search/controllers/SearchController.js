const Product = require("../../../../database/tbl_product"); // đảm bảo bạn có model này

exports.list_search = async (req, res) => {
    const perPage = 9; // Số sản phẩm mỗi trang
    const page = parseInt(req.query.page) || 1; // Trang hiện tại từ query ?page=...
    const searchQuery = req.query.q || ""; // Từ khóa tìm kiếm từ người dùng

    try {
        // Tìm các sản phẩm phù hợp với từ khóa
        const filter = {
            product_name: { $regex: searchQuery, $options: "i" }
        };
        // Đếm tổng số kết quả phù hợp
        const totalResults = await Product.countDocuments(filter);
        // Lấy danh sách sản phẩm phân trang
        const results = await Product.find(filter)
            .skip((page - 1) * perPage)
            .limit(perPage);

        const data = {
            results,
            query: searchQuery,
            currentPage: page,
            totalResults,
            totalPages: Math.ceil(totalResults / perPage),
            stt_product: (page - 1) * perPage,
        };
        // console.log(totalResults);
        res.render("list_search", data); // render ra trang kết quả tìm kiếm
    } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
        res.status(500).send("Lỗi máy chủ. Vui lòng thử lại sau.");
    }
};

exports.search = async (req, res) => {
    try {
        const key = req.body.key?.trim();
        // const key = "Ghế đá";
        // if (!key) return res.json([]);
        // // Tìm kiếm sản phẩm (demo query)
        const products = await Product.find({
            product_name: { $regex: key, $options: "i" }
        }).limit(6);

        const result = products.map(product => ({
            id: product._id,
            product_name: product.product_name,
            product_slug: product.slug,
            image_url: product.featured_image,
            product_price: product.product_new_price,
            product_price_old: product.product_old_price,
            stock_quantity: product.stock_quantity,
        }));

        // console.log(products);
        res.json(result); // Trả về JSON cho jQuery xử lý
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.