function createSlug(str) {
    return str
        .toLowerCase()
        .normalize('NFD') // Tách ký tự có dấu thành base + dấu
        .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
        .replace(/đ/g, 'd') // thay đ -> d
        .replace(/Đ/g, 'd') // thay Đ -> d
        .replace(/[^a-z0-9-_]/g, '-') // thay ký tự không hợp lệ thành -
        .replace(/-+/g, '-') // gộp các dấu - liên tiếp
        .replace(/^-+|-+$/g, ''); // xóa dấu - ở đầu hoặc cuối chuỗi
}
