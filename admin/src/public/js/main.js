// Replace the <textarea id="editor1"> with a CKEditor 4
// instance, using default configuration.
$(document).ready(function () {
    // $("textarea#desc, textarea#detail").each(function () {
    //     let id = $(this).attr("id"); // Chỉ lấy id "desc" hoặc "detail"
    //     let module = $(this).data("module"); // Lấy module từ data-attribute
    //     // alert(module);
    //     CKEDITOR.replace(id, {
    //         extraPlugins: "filebrowser",
    //         filebrowserUploadMethod: "form",
    //         filebrowserUploadUrl: `/${module}/upload`, // Chọn URL theo module
    //     });
    // });
    CKEDITOR.replace('desc');
    CKEDITOR.replace('detail');
});
