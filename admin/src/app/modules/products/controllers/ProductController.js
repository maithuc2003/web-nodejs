// const { get_layout } = require("@helper/template");
const { formatDate } = require("@helper/format"); // Import helper
const { addProduct,
    getProductId,
    updatedProduct,
    countProduct,
    deletedProduct,
    getListCategories,
    getProductsPaging,
    deleteOldImages } = require("../models/productModel");
const {
    getProductCat,
} = require("../models/productCatModel");
const tbl_product = require("../models/tbl_product")

exports.list_product = async (req, res) => {
    // console.log(req.session.user);  // In ra thông tin người dùng trong session
    const perPage = 6; // Số sản phẩm trên mỗi trang
    const page = parseInt(req.params.id) || 1; // Lấy số trang từ query hoặc mặc định là trang 1
    const totalProducts = await countProduct();     // Đếm tổng số sản phẩm
    const listProductCat = await getProductCat();
    const status_vn = {
        active: "Đang hoạt động",
        inactive: "Không hoạt động",
        out_of_stock: "Hết hàng"
    };
    try {
        // Gọi hàm getProducts() để lấy danh sách sản phẩm theo trang
        const products = await getProductsPaging(page, perPage);
        const cat_name = await getListCategories();
        products.forEach(product => {
            product.product_status = status_vn[product.product_status] || "Không xác định";

            // Nếu category_id là mảng đã populate
            if (Array.isArray(product.category_id)) {
                product.category_names = product.category_id.map(cat => cat.name).join(", ");
            } else {
                product.category_names = "Không xác định";
            }
        });

        // products.forEach(cat => {
        //     console.log("Danh mục:", cat);
        // });


        const data = {
            // cat_name,
            products,
            currentPage: page,
            listProductCat,
            totalProducts,
            totalPages: Math.ceil(totalProducts / perPage), // Tổng số trang
            stt_product: (page - 1) * perPage,
        }
        // console.log(products); // Kiểm tra toàn bộ danh sách sản phẩm
        res.render("list_product", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy danh sách sản phẩm!");
    }
};
// Hiện giao diện thêm sản phẩm
exports.show_add_product = async (req, res) => {
    const listProductCat = await getProductCat();
    const data = { listProductCat }
    res.render("add_product", data);
};

exports.add_product = async (req, res) => {
    try {
        let { title, slug, desc, detail, status, stock_quantity, new_price, old_price, is_featured, product_cat } = req.body;

        if (!Array.isArray(product_cat)) {
            product_cat = [product_cat];
        }

        if (!title || !slug || !new_price || !stock_quantity || !product_cat || product_cat.length === 0) {
            throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        }

        // Kiểm tra nếu có nhiều ảnh
        const imagePaths = req.files ? req.files.map(file => `/images/uploads/${file.filename}`) : [];
        // console.log("Dữ liệu req.files:", req.files);
        const productData = {
            product_name: title,
            product_slug: slug,
            product_desc: desc,
            product_details: detail,
            stock_quantity: Number(stock_quantity),
            product_new_price: Number(new_price),
            product_old_price: Number(old_price),
            is_featured: Number(is_featured),
            featured_image: imagePaths[0],
            product_status: status,
            category_id: product_cat,
            product_images: imagePaths, // Lưu danh sách ảnh
            admin_id: req.session.admin.id, // ✅ Lưu ObjectId của admin
        };
        await addProduct(productData);
        res.redirect("/sanpham")

    } catch (error) {
        console.error(error);
        res.render("add_product", {  error: error.message || "Có lỗi xảy ra!" });
    }
};
exports.edit_product = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await getProductId(id); // Nên populate('category_id') ở đây nếu cần
        const listProductCat = await getProductCat();

        // Convert các ObjectId trong category_id thành mảng string để tiện so sánh
        const product_cat = product.category_id ? product.category_id.map(cat => cat._id.toString()) : [];

        const data = {
        
            product,
            formatDate,
            listProductCat,
            product_cat,
        };

        res.render("edit_product", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi lấy thông tin sản phẩm!");
    }
}


exports.update_product = async (req, res) => {
    try {
        const listProductCat = await getProductCat();
        const id = req.params.id;
        let { title, slug, stock_quantity, new_price, old_price, desc, detail, is_featured, status, selected_img, product_cat } = req.body;
        if (!Array.isArray(product_cat)) {
            product_cat = [product_cat]; // ép thành mảng nếu chỉ có 1 danh mục
        }
        const imagePaths = req.files ? req.files.map(file => `/images/uploads/${file.filename}`) : [];
        // Kiểm tra xem sản phẩm có tồn tại không
        let product = await getProductId(id);
        if (!title || !slug || !new_price || !stock_quantity) {
            throw new Error("Vui lòng nhập đầy đủ thông tin sản phẩm!");
        }
        // Cập nhật danh sách ảnh: Nếu có ảnh mới, thay toàn bộ ảnh cũ; nếu không, giữ nguyên
        const updatedImages = imagePaths.length > 0 ? imagePaths : product.product_images;
        // Nếu không có selected_img, dùng ảnh đầu tiên trong danh sách ảnh mới
        if (imagePaths.length > 0) {
            const product = await getProductId(id); // Lấy sản phẩm theo ID
            deleteOldImages(product); // Xóa ảnh cũ
        }
        const productData = {
            id,
            product_name: title,
            product_slug: slug,
            product_desc: desc,
            product_details: detail,
            stock_quantity: Number(stock_quantity),
            product_new_price: Number(new_price),
            product_old_price: Number(old_price),
            is_featured: Number(is_featured),
            featured_image: selected_img,
            product_status: status,
            category_id: product_cat,
            product_images: updatedImages, // Lưu danh sách ảnh
        };
        // Cập nhật sản phẩm trong database
        await updatedProduct(id, productData);
        // Lấy lại sản phẩm sau khi cập nhật
        product = await getProductId(id);
        // Kiểm tra xem sản phẩm có tồn tại không
        const data = {  product, formatDate, listProductCat, product_cat };
        res.render("edit_product", data); // Render trang chỉnh sửa
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi cập nhật sản phẩm!");
    }
};

// Xóa sản phẩm
exports.delete_product = async (req, res) => {
    try {
        const id = req.params.id;
        // Lấy thông tin sản phẩm trước khi xóa
        const product = await getProductId(id);
        if (!product) {
            return res.status(404).send("Sản phẩm không tồn tại!");
        }
        deleteOldImages(product); // Xóa ảnh cũ
        await deletedProduct(id);
        res.redirect("/sanpham"); // Chuyển hướng về danh sách sản phẩm
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi xóa sản phẩm!");
    }
}

exports.list_search = async (req, res) => {
    const perPage = 6; // Đồng bộ với list_product
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query string
    const searchQuery = req.query.q || ""; // Từ khóa tìm kiếm

    const status_vn = {
        active: "Đang hoạt động",
        inactive: "Không hoạt động",
        out_of_stock: "Hết hàng"
    };

    try {
        const listProductCat = await getProductCat();
        const cat_name = await getListCategories(); // Lấy danh mục sản phẩm
        // Tạo bộ lọc tìm kiếm
        const filter = {
            product_name: { $regex: searchQuery, $options: "i" }
        };

        // Đếm tổng kết quả
        const totalProducts = await countProduct();     // Đếm tổng số sản phẩm
        const totalResults = await tbl_product.countDocuments(filter);

        // Lấy danh sách sản phẩm theo trang
        const results = await tbl_product.find(filter)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('category_id', 'category_name') ;

        // Chuyển đổi status và category_name
        results.forEach(product => {
            product.product_status = status_vn[product.product_status] || "Không xác định";
            if (Array.isArray(product.category_id)) {
                product.category_name = product.category_id.map(cat => cat.category_name).join(', ');
            } else {
                product.category_name = "Không xác định";
            }
        });
        
        results.forEach(cat => {
            console.log("Danh mục:", cat);
        });
        const data = {
       
            products: results,
            query: searchQuery,
            currentPage: page,
            totalResults,
            totalProducts,
            listProductCat,
            perPage,
            totalPages: Math.ceil(totalResults / perPage),
            stt_product: (page - 1) * perPage
        };

        res.render("list_search", data);
    } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
        res.status(500).send("Lỗi máy chủ. Vui lòng thử lại sau.");
    }
};

exports.search = async (req, res) => {
    const perPage = 6;
    const page = parseInt(req.body.page) || 1;

    const { category, status } = req.body;

    const status_vn = {
        active: "Đang hoạt động",
        inactive: "Không hoạt động",
        out_of_stock: "Hết hàng"
    };

    try {
        const filter = {};
        // Lọc theo category
        if (category) {
            filter.category_id = category;
        }

        if (status) {
            filter.product_status = status;
        }
        // const cat_name = await getListCategories();
        // Đếm tổng số sản phẩm sau khi lọc
        const totalResults = await tbl_product.countDocuments(filter);

        // Truy vấn sản phẩm theo trang
        const results = await tbl_product.find(filter)
            .populate('admin_id', 'username')
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('category_id', 'category_name') // Thêm dòng này;


        const products = results.map(product => ({
            _id: product._id,
            product_name: product.product_name,
            product_slug: product.product_slug,
            featured_image: product.featured_image,
            product_images: product.product_images,
            product_new_price: product.product_new_price,
            stock_quantity: product.stock_quantity,
            product_status: status_vn[product.product_status] || "Không xác định",
            category_name: Array.isArray(product.category_id)
                ? product.category_id.map(cat => cat.category_name).join(', ')
                : "Không xác định",
            admin_id: product.admin_id?._id || null,
            admin_username: product.admin_id?.username || "Không có admin",
            createdAt: product.createdAt

        }));
        // console.log(results);
        return res.json({
            success: true,
            totalResults,
            products,
            perPage,
            currentPage: page
        });

    } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ. Vui lòng thử lại sau."
        });
    }
};


// ========= add========
//  Cách thực hiện
// Lấy dữ liệu từ req.body do người dùng nhập vào form.
// Tạo một document mới trong MongoDB dựa trên model Product.
// Lưu sản phẩm vào database và xử lý lỗi nếu có.
// Hiển thị thông báo khi thêm thành công hoặc thất bại.