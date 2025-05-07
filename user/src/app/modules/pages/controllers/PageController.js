const tbl_page = require("../models/tbl_page");
const { get_layout } = require("@helper/template"); // == ko xóa ==

exports.detail = async (req, res) => {
    try {
        const { slug, id } = req.params;

        const page = await tbl_page.findOne({ _id: id });
        
        if (!page) {
            return res.status(404).render("404", { message: "Page not found" });  // Handle page not found
        }
        const data = {
            page // Pass the page data to the view
        };
        console.log(page);

        res.render("detail_page", data);  // Render the view with page data

    } catch (err) {
        console.error("Error fetching page details:", err);
        res.status(500).render("error", { message: "Internal server error" });  // Handle server error
    }
};
