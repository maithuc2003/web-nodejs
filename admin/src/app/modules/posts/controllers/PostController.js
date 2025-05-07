const Post = require("../models/tbl_post");
const { deleteOldImage,
    getListCategories,

} = require("../models/PostModel");
const { formatDate } = require("@helper/format"); // Import helper
// const { get_layout } = require("@helper/template");
const { mongooseToObject } = require('../utils/mongoose');
const {
    getPostCat,
} = require("../models/PostCatModel");

// [POST] /bai-viet
exports.list_post = async (req, res, next) => {
    const perPage = 6; // Số bài viết trên mỗi trang
    const page = parseInt(req.params.id) || 1; // Lấy số trang từ query hoặc mặc định là trang 1
    const totalPosts = await Post.countDocuments(); // Đếm tổng số bài viết
    const listPostCat = await getPostCat();
    const cat_name = await getListCategories();

    const status_vn = {
        draft: "Bản nháp",
        published: "Đã đăng",
        pending: "Chờ duyệt",
        archived: "Đã lưu trữ",
    };
    try {
        // Lấy danh sách bài viết theo trang, có phân trang và liên kết với admin
        const posts = await Post.find()
            .populate("admin_id", "username") // Lấy username của admin
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
            .populate('category_id', 'category_name'); // hoặc 'categories' nếu bạn đổi tên field;;
        // Chuyển đổi trạng thái bài viết sang tiếng Việt
        posts.forEach(post => {
            post.post_status = status_vn[post.post_status] || "Không xác định";
            // Nếu category_id là mảng đã populate
            if (Array.isArray(post.category_id)) {
                post.category_names = post.category_id.map(cat => cat.name).join(", ");
            } else {
                post.category_names = "Không xác định";
            }

        });
        posts.forEach(cat => {
            console.log("Danh mục:", cat);
        });
        // Chuẩn bị dữ liệu truyền vào view
        const data = {
            posts: mongooseToObject(posts), // Chuyển đổi Mongoose object
            formatDate,
            currentPage: page,
            listPostCat,
            totalPosts,
            totalPages: Math.ceil(totalPosts / perPage), // Tổng số trang
            stt_post: (page - 1) * perPage, // STT bài viết trên trang
        };
        res.render("list_post", data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi server!");
    }
};

// [DELETE] /bai-viet/:id
exports.destroy_post = async (req, res) => {
    try {
        // Tìm bài viết cần xóa
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
        // console.log(post);
        // Xóa ảnh cũ liên quan đến bài viết
        deleteOldImage(post); // Xóa ảnh cũ trước khi xóa bài viết

        // Xóa bài viết
        await Post.findByIdAndDelete(req.params.id);

        // Chuyển hướng về trang danh sách bài viết
        res.redirect('/bai-viet');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi khi xóa bài viết', error });
    }
};

// [GET] /bai-viet/edit/:id
exports.edit_post = async (req, res, next) => {
    try {
        const listPostCat = await getPostCat();
        const post = await Post.findById(req.params.id).populate('admin_id', 'username').lean();

        if (!post) {
            return res.status(404).send("Bài viết không tồn tại!");
        }
        // Kiểm tra nếu category_id là mảng hoặc ObjectId
        const post_cat = Array.isArray(post.category_id)
            ? post.category_id.map(cat => cat.toString())  // Lấy mảng các ID chuỗi của category
            : post.category_id.toString();  // Nếu chỉ có một ID, chuyển thành string

        // const post_cat = post.category_id ? post.category_id.toString() : "";

        res.render('edit_post', {
            listPostCat,
            post_cat,
            formatDate,
            post: mongooseToObject(post),
        });
    } catch (error) {
        next(error);
    }
};


// [PUT] /bai-viet/:id

exports.update_post = async (req, res, next) => {
    try {
        const id = req.params.id;
        let { post_title, post_slug, post_excerpt, post_content, post_status, post_cat } = req.body;
        const newImagePath = req.file ? `/images/uploads/${req.file.filename}` : null;
        const listPostCat = await getPostCat();
          // Kiểm tra nếu post_cat không phải là mảng, thì ép thành mảng
          if (!Array.isArray(post_cat)) {
            post_cat = [post_cat];  // Chuyển về mảng nếu chỉ có một danh mục
        }
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).send("Bài viết không tồn tại!");
        }
        if (newImagePath) {
            deleteOldImage(post);
        }

        await Post.updateOne(
            { _id: id },
            {
                post_title,
                post_slug,
                post_excerpt,
                post_content,
                post_status,
                category_id: post_cat,
                post_image: newImagePath || post.post_image,
            }
        );

        post = await Post.findById(id).populate("admin_id", "username");
        // const post_cat = post.category_id ? post.category_id.toString() : "";

        res.render("edit_post", {
            listPostCat,
            formatDate,
            post_cat,
            post: mongooseToObject(post),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi cập nhật bài viết!");
    }
};

// [GET] /bai-viet/add
exports.add_post = async (req, res) => {
    const listPostCat = await getPostCat();

    const data = {
        listPostCat
    };
    res.render("add_post", data);
};


exports.create_post = async (req, res) => {
    try {
        // Lấy bài viết cuối cùng để tính ID mới
        const { post_title, post_slug, post_excerpt, post_content, post_status, post_cat } = req.body;
        // Kiểm tra nếu thiếu thông tin
        if (!post_title || !post_slug || !post_content) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin!',
                errors: {
                    post_title: !post_title ? 'Tiêu đề không được để trống' : null,
                    post_slug: !post_slug ? 'Slug không được để trống' : null,
                    post_content: !post_content ? 'Nội dung không được để trống' : null
                }
            });
        }
        const slugExists = await Post.findOne({ post_slug });
        if (slugExists) {
            return res.status(400).json({ message: "Slug đã tồn tại!" });
        }

        // Đảm bảo category là mảng nếu người dùng chỉ chọn 1 danh mục
        const category_ids = Array.isArray(post_cat) ? post_cat : [post_cat];
        // Lưu đường dẫn ảnh đại diện (chỉ lấy ảnh đầu tiên)
        const post_image = req.files && req.files.length > 0 ? `/images/uploads/${req.files[0].filename}` : null;
        // Tạo bài viết mới
        await Post.create({
            post_title,
            post_slug,
            post_excerpt,
            post_content,
            post_status,
            post_image, // ✅ Lưu ảnh
            category_id: category_ids,
            admin_id: req.session.admin.id, // ✅ Lưu ObjectId của admin
        });
        // res.json(post_image);
        res.redirect('/bai-viet');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post', error });
    }
};


// [GET] /tim-kiem-bai-viet
exports.search_post = async (req, res) => {
    const perPage = 6;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.q || "";

    const status_vn = {
        draft: "Bản nháp",
        published: "Đã đăng",
        pending: "Chờ duyệt",
        archived: "Đã lưu trữ",
    };

    try {
        const filter = {
            post_title: { $regex: searchQuery, $options: "i" }
        };
        const listPostCat = await getPostCat();
        const totalPosts = await Post.countDocuments(); // Tổng số bài viết
        const totalResults = await Post.countDocuments(filter); // Kết quả tìm kiếm

        const posts = await Post.find(filter)
            .populate("admin_id", "username")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('category_id', 'category_name');

        posts.forEach(post => {
            post.post_status = status_vn[post.post_status] || "Không xác định";
            if (Array.isArray(post.category_id)) {
                post.category_name = post.category_id.map(cat => cat.category_name).join(', ');
            } else {
                post.category_name = "Không xác định";
            }
        });

        const data = {
            posts: mongooseToObject(posts),
            formatDate,
            query: searchQuery,
            currentPage: page,
            totalResults,
            totalPosts,
            listPostCat,
            perPage,
            totalPages: Math.ceil(totalResults / perPage),
            stt_post: (page - 1) * perPage,
        };

        res.render("list_search_post", data);
    } catch (err) {
        console.error("Lỗi khi tìm kiếm bài viết:", err);
        res.status(500).send("Lỗi máy chủ. Vui lòng thử lại sau.");
    }
};


exports.search = async (req, res) => {
    const perPage = 10;

    const page = parseInt(req.body.page) || 1;

    const { category, status } = req.body; // Lọc theo trạng thái và admin

    const status_vn = {
        draft: "Bản nháp",
        published: "Đã đăng",
        pending: "Chờ duyệt",
        archived: "Đã lưu trữ"
    };

    try {
        const filter = {};
        if (category) {
            filter.category_id = category;
        }

        // Lọc theo trạng thái bài viết
        if (status) {
            filter.post_status = status;
        }

        const cat_name = await getListCategories();

        // Đếm tổng số bài viết sau khi lọc
        const totalResults = await Post.countDocuments(filter);

        // Truy vấn bài viết theo trang
        const results = await Post.find(filter)
            .populate('admin_id', 'username')
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('category_id', 'category_name');

        // Định dạng kết quả trả về
        const posts = results.map(post => ({
            _id: post._id,
            post_title: post.post_title,
            post_slug: post.post_slug,
            post_excerpt: post.post_excerpt,
            post_image: post.post_image,
            post_status: status_vn[post.post_status] || "Không xác định",
            category_name: Array.isArray(post.category_id)
                ? post.category_id.map(cat => cat.category_name).join(', ')
                : "Không xác định",
            admin_id: post.admin_id?._id || null,
            admin_username: post.admin_id?.username || "Không có admin",
            createdAt: post.createdAt,
            updatedAt: post.updatedAt

        }));
        // console.log(posts);
        return res.json({
            success: true,
            totalResults,
            posts,
            perPage,
            currentPage: page
        });

    } catch (err) {
        console.error("Lỗi khi tìm kiếm bài viết:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ. Vui lòng thử lại sau."
        });
    }
};
