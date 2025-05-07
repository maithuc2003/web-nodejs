$(document).ready(function () {
    // Khởi tạo Nestable.js cho menu
    $('.dd').nestable();

    nestable_items();

    save_menu();
    // Tao ham xóa riêng lẻ và xóa hết cùng lúc
    // Gọi các hàm xử lý khi DOM sẵn sàng
    initMenuItems();
    add_page_product_post();
    // handleSearchPage();
    handleSearch('#tab-page-2 input', '#tab-page-2 #searchButtonPage', '/menu/search/pages', updatePagesList, '.error_page', 'page_id');
    handleSearch('#tab-product-2 input', '#tab-product-2 #searchButtonProduct', '/menu/search/products', updateProductList, '.error_product', 'product_cat_ids');
    handleSearch('#tab-post-2 input', '#tab-post-2 #searchButtonPost', '/menu/search/posts', updatePostList, '.error_post', 'post_id');

});

function add_page_product_post() {

    // =========================
    // XỬ LÝ checked
    // =========================
    $('#all_page').change(function () {
        // Nếu checkbox "Chọn tất cả" được chọn -> chọn hết các checkbox con
        $('input[name="page_id[]"]').prop('checked', $(this).prop('checked'));
    });

    $('#all_product').change(function () {
        // Checkbox "Chọn tất cả" -> chọn hết checkbox con
        $('input[name="product_cat_ids[]"]').prop('checked', $(this).prop('checked'));
    });
    $('#all_post').change(function () {
        $('input[name="post_id[]"]').prop('checked', $(this).prop('checked'));
    });

    // =========================
    // XỬ LÝ FORM 
    // =========================

    $('#add_page').click(function (event) {
        event.preventDefault(); // Ngăn chặn hành vi submit mặc định

        const selectedPages = $('input[name="page_id[]"]:checked').map(function () {
            return $(this).val();
        }).get();

        if (selectedPages.length === 0) {
            $('.error_page').text('Vui lòng chọn ít nhất một trang.');
            return;
        }

        const menu_id = $('input[name="menu_id"]').val();
        const data = { page_ids: selectedPages };

        $.ajax({
            url: '/menu/item/' + menu_id,
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Nếu thành công, hiển thị thông báo thành công
                    $('.success_page').text(response.message || 'Trang đã được thêm vào menu thành công!');
                    $('.error_page').text(''); // Xóa thông báo lỗi nếu có
                    location.reload(); // Tải lại trang
                } else {
                    // Nếu không thành công, hiển thị thông báo lỗi
                    $('.error_page').text(response.message || 'Không thể thêm bài viết vào menu.');
                    $('.success_page').text(''); // Xóa thông báo thành công nếu có
                }
            },
            error: function (xhr, status, error) {
                $('.error_page').text('Lỗi khi thêm trang vào menu.');
                $('.success').text('');
            }
        });
    });



    $('#add_product').click(function (event) {
        event.preventDefault(); // Ngăn submit form mặc định

        const selectedProducts = $('input[name="product_cat_ids[]"]:checked').map(function () {
            return $(this).val();
        }).get();

        if (selectedProducts.length === 0) {
            $('.error_product').text('Vui lòng chọn ít nhất một danh mục sản phẩm.');
            return;
        }

        const menu_id = $('input[name="menu_id"]').val();
        const data = { product_cat_ids: selectedProducts };

        $.ajax({
            url: '/menu/item/' + menu_id,
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    // Nếu thành công, hiển thị thông báo thành công
                    $('.success_product').text(response.message || 'Danh mục sản phẩm đã được thêm vào menu thành công!');
                    $('.error_product').text(''); // Xóa thông báo lỗi nếu có
                    location.reload(); // Tải lại trang
                } else {
                    // Nếu không thành công, hiển thị thông báo lỗi
                    $('.error_product').text(response.message || 'Không thể thêm bài viết vào menu.');
                    $('.success_product').text(''); // Xóa thông báo thành công nếu có
                }
            },
            error: function (xhr, status, error) {
                $('.error_product').text('Lỗi khi thêm danh mục sản phẩm vào menu.');
                $('.success').text('');
            }
        });
    });



    $('#add_post').click(function (event) {
        event.preventDefault();
        const selectedPosts = $('input[name="post_id[]"]:checked').map(function () {
            return $(this).val();
        }).get();

        if (selectedPosts.length === 0) {
            $('.error_post').text('Vui lòng chọn ít nhất một bài viết.');
            return;
        }

        const menu_id = $('input[name="menu_id"]').val();
        const data = { post_ids: selectedPosts };

        $.ajax({
            url: '/menu/item/' + menu_id,
            type: 'POST',
            data: data,
            dataType: 'json',
            success: function (response) {
                // console.log(response);
                $('input[name="post_id[]"]').prop('checked', false);
                if (response.success) {
                    // Nếu thành công, hiển thị thông báo thành công
                    $('.success_post').text(response.message || 'Bài viết đã được thêm vào menu thành công!');
                    $('.error_post').text(''); // Xóa thông báo lỗi nếu có
                    location.reload(); // Tải lại trang
                } else {
                    // Nếu không thành công, hiển thị thông báo lỗi
                    $('.error_post').text(response.message || 'Không thể thêm bài viết vào menu.');
                    $('.success_post').text(''); // Xóa thông báo thành công nếu có
                }
            },
            error: function (xhr, status, error) {
                $('.error_post').text('Lỗi khi thêm bài viết vào menu.');
                $('.success').text('');
            }
        });
    });
}

// function initMenuItems() {
//     // Hiện checkbox khi nhấn nút "Xóa mục đã chọn"
//     $('#delete_selected').click(function (event) {
//         event.preventDefault();
//         // Lấy danh sách các checkbox đã được chọn
//         var selectedItems = [];
//         $('.delete-checkbox:checked').each(function () {
//             selectedItems.push($(this).data('id'));
//         });
//         const menu_id = $('input[name="menu_id"]').val();
//         let data = { item_ids: selectedItems };
//         // Nếu có mục được chọn, gửi AJAX yêu cầu xóa
//         if (selectedItems.length > 0) {
//             $.ajax({
//                 url: '/menu/item/delete/' + menu_id,  // Địa chỉ xử lý xóa (tùy chỉnh theo route của bạn)
//                 method: 'POST',
//                 data: data,
//                 success: function (response) {
//                     // console.log(response);
//                     if (response.success) {
//                         // Nếu thành công, hiển thị thông báo thành công
//                         $('.success_delete').text(response.message);
//                         location.reload(); // Tải lại trang
//                     }
//                 },
//                 error: function (xhr, status, error) {
//                     $('.error_post').text('Lỗi khi thêm bài viết vào menu.');
//                     $('.success').text('');
//                 }
//             });
//         }
//     });

//     // Hiển thị checkbox và "Xóa mục đã chọn" khi nhấn vào "Chọn tất cả"
//     $('#select_all').click(function () {
//         if ($(this).prop('checked')) {
//             // Hiển thị checkbox khi nhấn chọn tất cả
//             $('.delete-checkbox').show();
//             $('.delete-checkbox').prop('checked', true);  // Chọn tất cả checkbox
//         } else {
//             // Ẩn checkbox khi bỏ chọn tất cả
//             $('.delete-checkbox').hide();
//             $('.delete-checkbox').prop('checked', false); // Bỏ chọn tất cả checkbox
//         }
//     });

//     // Hiển thị checkbox khi nhấn nút "Chọn tất cả"
//     $('#select_all').click(function () {
//         if ($(this).prop('checked')) {
//             // Hiển thị checkbox khi nhấn chọn tất cả
//             $('.delete-checkbox').show();
//             $('.delete-checkbox').prop('checked', true);  // Chọn tất cả checkbox
//         } else {
//             // Ẩn checkbox khi bỏ chọn tất cả
//             $('.delete-checkbox').hide();
//             $('.delete-checkbox').prop('checked', false); // Bỏ chọn tất cả checkbox
//         }
//     });

//     // Xử lý nút "Chọn từng mục"
//     $('#select').on('click', function () {
//         const checked = $(this).prop('checked');
//         $('#select_all').prop('checked', false); // Bỏ chọn "Chọn tất cả"

//         if (checked) {
//             $checkboxes.show().prop('checked', false); // Hiện nhưng chưa chọn
//             $deleteSelectedBtn.show();
//         } else {
//             $checkboxes.hide().prop('checked', false);
//             $deleteSelectedBtn.hide();
//         }
//     });

//     // Đảm bảo các checkbox luôn ẩn khi chưa chọn "Chọn tất cả"
//     $('.delete-checkbox').hide();

//     // Hiển thị checkbox khi nhấn nút "Xóa mục đã chọn"
//     $('#delete_selected').show();

// }

function initMenuItems() {
    const $deleteSelectedBtn = $('#delete_selected');
    const $checkboxes = $('.delete-checkbox');

    // Ẩn checkbox và nút xóa khi mới vào
    $checkboxes.hide();
    $deleteSelectedBtn.hide();

    // Xử lý "Chọn tất cả"
    $('#select_all').on('click', function () {
        const checked = $(this).prop('checked');

        // Bỏ chọn "Chọn từng mục" nếu chọn cái này
        $('#select').prop('checked', false);

        if (checked) {
            $checkboxes.show().prop('checked', true);
            $deleteSelectedBtn.show();
        } else {
            $checkboxes.hide().prop('checked', false);
            $deleteSelectedBtn.hide();
        }
    });

    // Xử lý "Chọn từng mục" (hiện checkbox, không tick sẵn)
    $('#select').on('click', function () {
        const checked = $(this).prop('checked');

        // Bỏ chọn "Chọn tất cả" nếu chọn cái này
        $('#select_all').prop('checked', false);

        if (checked) {
            $checkboxes.show().prop('checked', false);
            $deleteSelectedBtn.show();
        } else {
            $checkboxes.hide().prop('checked', false);
            $deleteSelectedBtn.hide();
        }
    });

    // Xử lý nút "Xóa mục đã chọn"
    $deleteSelectedBtn.on('click', function (event) {
        event.preventDefault();

        const selectedItems = [];
        $('.delete-checkbox:checked').each(function () {
            selectedItems.push($(this).data('id'));
        });

        const menu_id = $('input[name="menu_id"]').val();

        if (selectedItems.length > 0) {
            $.ajax({
                url: '/menu/item/delete/' + menu_id,
                method: 'POST',
                data: { item_ids: selectedItems },
                success: function (response) {
                    if (response.success) {
                        $('.success_delete').text(response.message);
                        location.reload();
                    }
                },
                error: function () {
                    $('.error_post').text('Lỗi khi xóa mục khỏi menu.');
                    $('.success').text('');
                }
            });
        }
    });
}


function nestable_items() {
    $('.dd').on('change', function (event) {
        event.preventDefault();
        var order = $(this).nestable('serialize');
        // console.log('Order:', order);
        const menu_id = $('#menu_items').data('menu-id'); // hoặc lấy từ hidden input
        let data = { order: order };
        $.ajax({
            url: '/menu/item/update/' + menu_id,
            method: 'POST',
            data: data,
            success: function (res) {
                // alert('Cập nhật thành công!');
            },
            error: function () {
                alert('Lỗi khi cập nhật!');
            }
        });
    });

}

function save_menu() {
    $('#btn-save-list').click(function (event) {
        event.preventDefault();
        let item_menu_id = $('#menu_items').data('menu-id'); // Lấy từ HTML data attribute
        // Lấy giá trị của radio button đang được chọn (menu_id)
        let postition_menu_id = $("input[name='select_menu']:checked").data('id');  // Hoặc .val() nếu muốn lấy giá trị là tên của menu
        // Kiểm tra nếu có menu_id được chọn
        if (!postition_menu_id) {
            alert('Vui lòng chọn vị trí hiển thị menu!');
            return;  // Dừng lại nếu không có menu_id
        }

        let data = {
            item_menu_id: item_menu_id,
            postition_menu_id: postition_menu_id
        };
        // Nếu có mục được chọn, gửi AJAX yêu cầu xóa
        $.ajax({
            url: '/menu/item/save/' + item_menu_id,  // Địa chỉ xử lý xóa (tùy chỉnh theo route của bạn)
            method: 'POST',
            data: data,
            success: function (response) {

                if (response.success) {
                    window.location.href = "/menu"; // Chuyển hướng về trang menu
                } else {
                    alert(response.message || 'Có lỗi xảy ra.');
                }
            },
            error: function (xhr, status, error) {
                $('.error_post').text('Lỗi khi thêm bài viết vào menu.');
                $('.success').text('');
            }
        });
    });
}

function handleSearch(inputSelector, buttonSelector, apiUrl, updateCallback, errorSelector, $checkboxname) {
    $(buttonSelector).click(function (event) {
        event.preventDefault();
        const searchQuery = $(inputSelector).val().trim();
        if (!searchQuery) return alert('Vui lòng nhập từ khóa tìm kiếm');
        const data = { query: searchQuery };
        $.ajax({
            url: apiUrl,
            type: 'GET',
            data: data,
            success: function (res) {
                console.log(res);
                if (res.success) {
                    updateCallback(res.items, $checkboxname);
                } else {
                    $(errorSelector).text('Không tìm thấy kết quả.');
                }
            },
            error: function () {
                alert('Lỗi khi tìm kiếm.');
            }
        });
    });
}


// Hàm cập nhật danh sách các mục menu vào UI
function updatePagesList(items, checkboxname) {
    const listContainer = $('#tab-page-1 .list-group');
    listContainer.empty(); // Xóa danh sách hiện tại
    if (items.length > 0) {
        items.forEach(function (item) {
            console.log(item);
            const listItem = `
                <li class="list-group-item">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" name="${checkboxname}[]"
                               value="${item.id}" id="${item.id}">
                        <label class="custom-control-label" for="${item.id}">${item.title}</label>
                    </div>
                </li>`;
            listContainer.append(listItem);
        });
    } else {
        listContainer.append('<li class="list-group-item"><span>Không tìm thấy kết quả</span></li>');
    }
}


function updateProductList(items, checkboxname) {
    const listContainer = $('#tab-product-1 .list-group');
    listContainer.empty(); // Xóa danh sách hiện tại
    if (items.length > 0) {
        items.forEach(function (item) {
            const listItem = `
                <li class="list-group-item">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" name="${checkboxname}[]"
                               value="${item.id}" id="${item.id}">
                        <label class="custom-control-label" for="${item.id}">${item.title}</label>
                    </div>
                </li>`;
            listContainer.append(listItem);
        });
    } else {
        listContainer.append('<li class="list-group-item"><span>Không tìm thấy kết quả</span></li>');
    }
}


function updatePostList(items, checkboxname) {
    const listContainer = $('#tab-post-1 .list-group');
    listContainer.empty(); // Xóa danh sách hiện tại
    if (items.length > 0) {
        items.forEach(function (item) {
            const listItem = `
                <li class="list-group-item">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" name="${checkboxname}[]"
                               value="${item.id}" id="${item.id}">
                        <label class="custom-control-label" for="${item.id}">${item.title}</label>
                    </div>
                </li>`;
            listContainer.append(listItem);
        });
    } else {
        listContainer.append('<li class="list-group-item"><span>Không tìm thấy kết quả</span></li>');
    }
}
