const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    select_menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_position", // ref tới model "MenuPosition"
        required: true,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tbl_admin',
    },
}, {
    timestamps: true // Bên ngoài phần fields
});

const Menu = mongoose.model("tbl_menu", menuSchema);
module.exports = Menu;
