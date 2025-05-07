function buildMenuTree(items, parentId = "0") {
    // Lọc ra những item có parent_id trùng với parentId hiện tại (mặc định là "0" - tức là gốc)
    return items
        .filter(item => item.parent_id === parentId)
        // Sắp xếp các item con theo thứ tự menu_order tăng dần
        .sort((a, b) => a.menu_order - b.menu_order)
        // Với mỗi item, tạo một object mới có thêm trường children (danh sách con)
        .map(item => {
            return {
                ...item.toObject(), // Chuyển item (là document mongoose) sang object thuần
                children: buildMenuTree(items, item._id.toString()) // Gọi đệ quy để tìm con của item hiện tại
            };
        });
}



const data = { buildMenuTree };

// Export các hàm để sử dụng ở file khác
module.exports = data;