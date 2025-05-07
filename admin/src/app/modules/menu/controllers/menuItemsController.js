const tbl_pages = require('../../pages/models/tbl_page');
const tbl_product_cat = require('../../products/models/tbl_product_cat');
const tbl_posts = require('../../posts/models/tbl_post_cat');
const tbl_menu_items = require('../models/tbl_menu_items');
const tbl_menu = require('../models/tbl_menu');
exports.add_page_post_page = async (req, res) => {
    try {
        const menu_id = req.params.id;
        const { page_ids = [], product_cat_ids = [], post_ids = [] } = req.body;

        let responseMessage = 'Thêm mục vào menu thành công!'; // Khởi tạo giá trị mặc định cho message
        let isSuccess = true; // Biến xác định tình trạng thành công

        // Hàm chung để thêm vào tbl_menu_items nếu chưa tồn tại trong menu hiện tại
        const addMenuItem = async (idKey, data) => {
            if (!data || !data.title || !data.slug) {
                console.warn('Dữ liệu thiếu title hoặc slug, bỏ qua:', data);
                return { success: false, message: 'Dữ liệu thiếu thông tin cần thiết' };
            }

            // Không kiểm tra trùng lặp, chỉ thêm vào menu hiện tại
            const newMenuItem = new tbl_menu_items({
                menu_id: menu_id,
                menu_name: data.title,
                slug: data.slug,
                [idKey]: data._id,
                parent_id: '0',
                menu_order: 1
            });
            await newMenuItem.save();
            // console.log(`${data.title} đã được thêm vào menu.`);

            return { success: true, message: `Đã được thêm vào menu.` }; // Thêm thông báo thành công
        };

        // Lấy và xử lý thông tin các trang
        if (page_ids.length > 0) {
            const pages = await tbl_pages.find({ _id: { $in: page_ids } });
            for (const page of pages) {
                const url = `/trang/${page.page_slug}/${page._id}`;
                const result = await addMenuItem('page_id', {
                    _id: page._id,
                    title: page.page_title,
                    slug: url
                });

                if (!result.success) {
                    responseMessage = result.message;  // Cập nhật thông báo nếu có lỗi
                    isSuccess = false; // Đánh dấu thất bại
                    break;  // Dừng lại nếu có lỗi xảy ra
                }
            }
        }

        // Lấy và xử lý thông tin các danh mục sản phẩm
        if (product_cat_ids.length > 0) {
            const productCats = await tbl_product_cat.find({ _id: { $in: product_cat_ids } });
            for (const cat of productCats) {
                const url = `/san-pham/${cat.category_slug}/${cat._id}`;
                const result = await addMenuItem('product_category_id', {
                    _id: cat._id,
                    title: cat.category_name,
                    slug: url
                });

                if (!result.success) {
                    responseMessage = result.message;  // Cập nhật thông báo nếu có lỗi
                    isSuccess = false; // Đánh dấu thất bại
                    break;  // Dừng lại nếu có lỗi xảy ra
                }
            }
        }

        // Lấy và xử lý thông tin các bài viết
        if (post_ids.length > 0) {
            const posts = await tbl_posts.find({ _id: { $in: post_ids } });
            for (const post of posts) {
                const url = `/bai-viet/${post.category_slug}/${post._id}`; // Tùy vào logic route của bạn
                const result = await addMenuItem('post_category_id', {
                    _id: post._id,
                    title: post.category_name,
                    slug: url
                });

                if (!result.success) {
                    responseMessage = result.message;  // Cập nhật thông báo nếu có lỗi
                    isSuccess = false; // Đánh dấu thất bại
                    break;  // Dừng lại nếu có lỗi xảy ra
                }
            }
        }

        // Trả về thông báo thành công hoặc lỗi
        if (isSuccess) {
            return res.json({ success: true, message: responseMessage });
        } else {
            return res.json({ success: false, message: responseMessage });
        }

    } catch (error) {
        console.error('Lỗi khi thêm mục vào menu:', error);
        res.status(500).json({ success: false, error: 'Lỗi khi thêm mục vào menu' });
    }
};

exports.delete_menu_items = async (req, res) => {
    try {
        // Lấy danh sách các item_id từ request
        const { item_ids } = req.body;
        // Kiểm tra xem có item_ids không
        if (!item_ids || item_ids.length === 0) {
            return res.status(400).json({ message: 'Không có mục nào được chọn để xóa.' });
        }
        // Xóa các mục từng mục một theo ID
        for (const itemId of item_ids) {
            // Tìm mục theo ID
            await tbl_menu_items.findByIdAndDelete(itemId);
        }
        return res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
};

exports.nestable_items = async (req, res) => {
    try {
        const { order } = req.body;
        // console.log(order);

        // Đệ quy cập nhật thứ tự và parent_id
        const updateItems = async (items, parentId = '0') => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                await tbl_menu_items.findByIdAndUpdate(item.id, {
                    parent_id: parentId,
                    menu_order: i + 1
                });

                if (item.children && item.children.length > 0) {
                    await updateItems(item.children, item.id);
                }
            }
        };

        await updateItems(order);

        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (error) {
        console.error('Lỗi cập nhật menu:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật menu.' });
    }
};


exports.save_menu = async (req, res) => {
    const { item_menu_id, postition_menu_id } = req.body;

    try {
        if (!item_menu_id || !postition_menu_id) {
            return res.status(400).json({ success: false, message: 'Thiếu dữ liệu menu_id.' });
        }

        // Cập nhật trường select_menu cho menu_id tương ứng
        update = await tbl_menu.findByIdAndUpdate(item_menu_id, { select_menu: postition_menu_id });
        // Kiểm tra nếu có bản ghi được cập nhật
        if (!update) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy menu để cập nhật.' });
        }

        // console.log('Updated menu:', update);
        return res.json({ success: true, message: 'Chuyển mục menu thành công.' });
    } catch (err) {
        console.error('Lỗi khi lưu menu:', err);
        return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật menu.' });
    }
};



// Tìm kiếm trang
exports.search_pages = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim() === "") {
            const allPages = await tbl_pages.find();
            return res.json({ success: true, items: allPages });
        }

        const list_pages = await tbl_pages.find({
            page_title: { $regex: query, $options: 'i' }
        });
        const results = list_pages.map(item => ({
            id: item._id,
            title: item.page_title,
            slug: item.page_slug
        }));

        console.log(results);

        return res.json({ success: true, items: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi tìm kiếm trang' });
    }
};

// Tìm kiếm danh mục sản phẩm
exports.search_product_categories = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim() === "") {
            const allProducts = await tbl_product_cat.find();
            return res.json({ success: true, items: allProducts });
        }

        const productCategories = await tbl_product_cat.find({
            category_name: { $regex: query, $options: 'i' }
        });
        console.log(productCategories);
        const results = productCategories.map(item => ({
            id: item._id,
            title: item.category_name,
            slug: item.slug // hoặc item.category_slug nếu có
        }));
        return res.json({ success: true, items: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi tìm kiếm sản phẩm' });
    }
};

// Tìm kiếm danh mục bài viết
exports.search_post_categories = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim() === "") {
            const allPosts = await tbl_posts.find();
            return res.json({ success: true, items: allPosts });
        }

        const list_posts = await tbl_posts.find({
            category_name: { $regex: query, $options: 'i' }
        });
        console.log(list_posts);
        const results = list_posts.map(item => ({
            id: item._id,
            title: item.category_name,
            slug: item.slug // hoặc item.category_slug nếu có
        }));
        return res.json({ success: true, items: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Lỗi tìm kiếm bài viết' });
    }
};
