const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
    position_name: {
        type: String,
        required: true,
    },
});

const MenuPosition = mongoose.model("tbl_position", positionSchema);
module.exports = MenuPosition;
