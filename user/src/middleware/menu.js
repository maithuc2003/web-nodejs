const Menu = require('../database/tbl_menu');
const MenuItem = require('../database/tbl_menu_items');
const MenuPosition = require('../database/tbl_position');

// Hàm xây dựng cây menu
function buildMenuTree(items, parentId = "0") {
    return items
        .filter(item => item.parent_id === parentId)
        .sort((a, b) => a.menu_order - b.menu_order)
        .map(item => ({
            ...item.toObject(),
            children: buildMenuTree(items, item._id.toString())
        }));
}

// Hàm lấy menu dựa trên vị trí
async function getMenu(positionId) {
    try {
        const position = await MenuPosition.findOne({ _id: positionId });
        if (!position) return null;

        const menu = await Menu.findOne({ select_menu: position._id });
        if (!menu) return null;

        const menuItems = await MenuItem.find({ menu_id: menu._id }).sort({ menu_order: 1 });
        return buildMenuTree(menuItems); // Tạo cây phân cấp
    } catch (err) {
        console.error('Error loading menu:', err);
        return null;
    }
}

// Middleware cho main menu
const main_menu = async (req, res, next) => {
    try {
        const menuTree = await getMenu('67f9ce3a93f3ff625b3baace');
        res.locals.main_menus = menuTree || [];
        // console.log(menuTree);
        next();
    } catch (err) {
        console.error('Error loading main menu:', err);
        res.locals.main_menus = [];
        next();
    }
};

// Middleware cho footer menu
const footer_menu = async (req, res, next) => {
    try {
        const menuTree = await getMenu('67f9ce4793f3ff625b3baad0');
        // console.log(menuTree);
        res.locals.footer_menus = menuTree || [];
        next();
    } catch (err) {
        console.error('Error loading footer menu:', err);
        res.locals.footer_menus = [];
        next();
    }
};

module.exports = { main_menu, footer_menu };
