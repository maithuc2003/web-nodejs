$(document).ready(function () {
    // 
    $("#categoryFilter, #statusFilterProducts").on('change', function () {
        fetchProducts(1);
    });
    $("#statusFilterPages").on('change', function () {
        fetchPages(1);
    });
    $("#categoryFilterPost,#statusFilterPost").on('change', function () {
        fetchPosts(1)
    });
    $(document).on('click', '.product-link-ajax', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        fetchProducts(page);
    });
    $(document).on('click', '.page-link-ajax', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        fetchPages(page);
    });

    $(document).on('click', '.post-link-ajax', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        fetchPosts(page);
    });
    // Gắn sự kiện onchange và click phân trang
    $(document).on("change", "#statusFilterOrder", function () {
        fetchOrders(1);
    });

    $(document).on("click", ".order-link-ajax", function (e) {
        e.preventDefault();
        const page = $(this).data("page");
        fetchOrders(page);
    });


});

// ===== sản phẩm
function fetchProducts(page = 1) {
    const category = $("#categoryFilter").val();
    const status = $("#statusFilterProducts").val();

    const data = {
        category: category,
        status: status,
        page: page // Thêm page để phân trang
    };

    $.ajax({
        url: "/sanpham/search",
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function (response) {
            const tbody = $("table tbody");
            tbody.empty();
            $("#pageCount").text(response.products.length);
            $("#pageCountAll").text(response.totalResults);

            if (response.products.length === 0) {
                tbody.append(`
                <tr>
                    <td colspan="9" class="text-center">Không có sản phẩm nào</td>
                </tr>
            `);
                $("#paginationAjax").empty(); // Ẩn phân trang
                return;
            }

            response.products.forEach((product, index) => {
                const row = `
                <tr>
                    <td>${(response.currentPage - 1) * response.perPage + index + 1}</td>
                    <td>
                        <a href="${product.product_slug}">
                            <img src="http://localhost:3000/${product.featured_image}" width="100">
                        </a>
                    </td>
                    <td>
                        <ul class="list-inline">
                            <li class="list-inline-item">
                                <a href="/sanpham/edit/${product._id}" class="name-product">${product.product_name}</a>
                            </li>
                            <li class="list-inline-item">
                                <a data-id="${product._id}" href="/sanpham/edit/${product._id}" class="update-product">
                                    <i class="fa-solid fa-pencil"></i>
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a data-id="${product._id}" href="/sanpham/delete/${product._id}" class="del-product">
                                    <i class="fa-solid fa-trash"></i>
                                </a>
                            </li>
                        </ul>
                    </td>
                    <td>${product.category_name}</td>
                    <td>${Number(product.product_new_price).toLocaleString("vi-VN")}đ</td>
                    <td>${product.stock_quantity}</td>
                    <td>${product.product_status}</td>
                    <td>${product.admin_username || "Không rõ"}</td>
                    <td>${new Date(product.createdAt).toLocaleString("vi-VN")}</td>
                </tr>
            `;
                tbody.append(row);
            });

            // Hiển thị lại phân trang
            const totalPages = Math.ceil(response.totalResults / 6); // 6 là perPage
            let paginationHTML = `<ul class="pagination pagination-sm justify-content-center">`;

            if (page > 1) {
                paginationHTML += `<li class="page-item"><a class="page-link product-link-ajax" href="#" data-page="${page - 1}">&laquo;</a></li>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link product-link-ajax" href="#" data-page="${i}">${i}</a>
                </li>`;
            }

            if (page < totalPages) {
                paginationHTML += `<li class="page-item"><a class="page-link product-link-ajax" href="#" data-page="${page + 1}">&raquo;</a></li>`;
            }

            paginationHTML += `</ul>`;
            $("#paginationAjax").html(paginationHTML);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Lỗi: " + jqXHR.status + " - " + errorThrown + "\nChi tiết: " + jqXHR.responseText);
        }
    });
}


function fetchPages(page = 1) {
    const status = $("#statusFilterPages").val();

    const data = {
        status: status,
        page: page
    };
    // console.log(status);
    $.ajax({
        url: "/trang/search", // Đường dẫn phù hợp với định tuyến của bạn
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function (response) {
            const tbody = $("table tbody");
            tbody.empty();
            $("#totalPages #pageCount").text(response.pages.length);
            $("#totalPages #pageCountAll").text(response.totalResults);

            if (response.pages.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="7" class="text-center">Không có trang nào</td>
                    </tr>
                `);
                $("#paginationAjax").empty();
                return;
            }

            response.pages.forEach((pageItem, index) => {

                const row = `
                <tr>
                <td>${(response.currentPage - 1) * response.perPage + index + 1}</td>
                <td>
                    <ul class="list-inline">
                        <!-- Xem chi tiết trang -->
                        <li class="list-inline-item">
                            <a href="/trang/edit/${pageItem._id}" title="${pageItem.page_title}" class="name-product">
                                ${pageItem.page_title}
                            </a>
                        </li>
                        <!-- Sửa -->
                        <li class="list-inline-item">
                            <a href="/trang/edit/${pageItem._id}" title="Sửa" class="update-product">
                                <i class="fa-solid fa-pencil"></i>
                            </a>
                        </li>
                        <!-- Xóa -->
                        <li class="list-inline-item">
                            <a href="/trang/delete/${pageItem._id}" title="Xóa" class="del-product"
                                onclick="return confirm('Bạn có chắc chắn muốn xóa không?')">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </li>
                    </ul>
                </td>
                <td>${pageItem.page_status || "Chưa rõ"}</td>
                <td>${pageItem.admin_username || "Không có admin"}</td>
                <td>${new Date(pageItem.createdAt).toLocaleString('vi-VN')}</td>
                <td>${new Date(pageItem.updatedAt).toLocaleString('vi-VN')}</td>
            </tr>
                `;
                tbody.append(row);
            });

            // Phân trang
            const totalPages = Math.ceil(response.totalResults / 6);
            let paginationHTML = `<ul class="pagination pagination-sm justify-content-center">`;

            if (page > 1) {
                paginationHTML += `<li class="page-item"><a class="page-link page-link-ajax" href="#" data-page="${page - 1}">&laquo;</a></li>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <li class="page-item ${i === page ? 'active' : ''}">
                        <a class="page-link page-link-ajax" href="#" data-page="${i}">${i}</a>
                    </li>`;
            }

            if (page < totalPages) {
                paginationHTML += `<li class="page-item"><a class="page-link page-link-ajax" href="#" data-page="${page + 1}">&raquo;</a></li>`;
            }

            paginationHTML += `</ul>`;
            $("#paginationAjax").html(paginationHTML);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Lỗi: " + jqXHR.status + " - " + errorThrown + "\nChi tiết: " + jqXHR.responseText);
        }
    });
}

// ===== bài viết
function fetchPosts(page = 1) {
    const category = $("#categoryFilterPost").val();
    const status = $("#statusFilterPost").val();
    const data = {
        category: category,
        status: status,
        page: page
    };

    $.ajax({
        url: "/bai-viet/search", // Đảm bảo tuyến đường này đúng với controller bạn đã đặt
        method: 'POST',
        data: data,
        dataType: 'json',
        success: function (response) {

            const tbody = $("table tbody");
            tbody.empty();
            $("#totalPosts #pageCount").text(response.posts.length);
            $("#totalPosts #pageCountAll").text(response.totalResults);

            if (response.posts.length === 0) {
                tbody.append(`
                <tr>
                    <td colspan="8" class="text-center">Không có bài viết nào</td>
                </tr>
            `);
                $("#paginationAjax").empty();
                return;
            }
            // console.log(response);
            response.posts.forEach((post, index) => {
                const titleShort = post.post_title.length > 10
                    ? post.post_title.substring(0, 20) + "..."
                    : post.post_title;
                const row = `
                    <tr>
                        <td>${(response.currentPage - 1) * response.perPage + index + 1}</td>
                        <td>
                            <a href="${post.post_slug}">
                                <img src="http://localhost:3000/${post.post_image}" width="100" height="auto">
                            </a>
                        </td>
                        <td>
                            <ul class="list-inline">
                                <li class="list-inline-item">
                                    <a href="/bai-viet/${post.post_slug}" title="" class="title-post">
                                        ${titleShort}
                                    </a>
                                </li>
                                <li class="list-inline-item">
                                    <a href="/bai-viet/edit/${post._id}" title="" class="update-product">
                                        <i class="fa-solid fa-pencil"></i>
                                    </a>
                                </li>
                                <li class="list-inline-item">
                                    <button type="button" class="del-product" data-toggle="modal"
                                        data-target="#deleteWarningModal-${post._id}">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </li>
                            </ul>
                        </td>
                        <td>${post.category_name}</td>
                        <td>${post.post_status}</td>
                        <td>${post.admin_username || "Không có admin"}</td>
                        <td>${new Date(post.createdAt).toLocaleString("vi-VN")}</td>
                        <td>${new Date(post.updatedAt).toLocaleString("vi-VN")}</td>
            </tr>
            `;
                tbody.append(row);
            });

            // Hiển thị phân trang
            const totalPages = Math.ceil(response.totalResults / 6);
            let paginationHTML = `<ul class="pagination pagination-sm justify-content-center">`;

            if (page > 1) {
                paginationHTML += `<li class="page-item"><a class="page-link post-link-ajax" href="#" data-page="${page - 1}">&laquo;</a></li>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link post-link-ajax" href="#" data-page="${i}">${i}</a>
                </li>`;
            }

            if (page < totalPages) {
                paginationHTML += `<li class="page-item"><a class="page-link post-link-ajax" href="#" data-page="${page + 1}">&raquo;</a></li>`;
            }

            paginationHTML += `</ul>`;
            $("#paginationAjax").html(paginationHTML);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Lỗi: " + jqXHR.status + " - " + errorThrown + "\nChi tiết: " + jqXHR.responseText);
        }
    });
}


function fetchOrders(page = 1) {
    const status = $("#statusFilterOrder").val();

    const data = {
        status: status,
        page: page
    };

    $.ajax({
        url: "/ban-hang/search",
        method: "POST",
        data: data,
        dataType: "json",
        success: function (response) {
            const tbody = $("table tbody");
            tbody.empty();

            $("#totalOrder #pageCount").text(response.orders.length);
            $("#totalOrder #pageCountAll").text(response.totalResults);
            if (response.orders.length === 0) {
                tbody.append(`
            <tr>
              <td colspan="7" class="text-center">Không có đơn hàng nào</td>
            </tr>
          `);
                $("#paginationAjax").empty();
                return;
            }

            response.orders.forEach((order, index) => {
                const row = `
            <tr>
              <td>${(response.currentPage - 1) * response.perPage + index + 1}</td>
              <td>
                          <ul class="list-inline">
                            <li class="list-inline-item">
                            ${order.order_id}
                            </li>
                            <li class="list-inline-item">
                              <a href="/ban-hang/${order._id}" title="detail order" class="update-order">
                                <i class="fa-solid fa-pencil"></i>
                              </a>
                            </li>
                            <li class="list-inline-item">
                              <a href="" title="Delete order" class="del-order">
                                <i class="fa-solid fa-trash"></i>
                              </a>
                              <form id="delete-order-form" method="POST"
                                action="/ban-hang/${order._id}?_method=DELETE" style="display: none;">
                                <input type="hidden" name="_method" value="DELETE" />
                              </form>
                            </li>
                          </ul>
               </td>
              <td>${order.fullname}</td>
              <td>${order.status_vi}</td>
              <td>${order.phone}</td>
              <td>${new Date(order.createdAt).toLocaleString("vi-VN")}</td>
              <td>${new Date(order.updatedAt).toLocaleString("vi-VN")}</td>
            </tr>
          `;
                tbody.append(row);
            });

            // Phân trang
            const totalPages = Math.ceil(response.totalResults / response.perPage);
            let paginationHTML = `<ul class="pagination pagination-sm justify-content-center">`;

            if (page > 1) {
                paginationHTML += `<li class="page-item"><a class="page-link order-link-ajax" href="#" data-page="${page - 1}">&laquo;</a></li>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}">
            <a class="page-link order-link-ajax" href="#" data-page="${i}">${i}</a>
          </li>`;
            }

            if (page < totalPages) {
                paginationHTML += `<li class="page-item"><a class="page-link order-link-ajax" href="#" data-page="${page + 1}">&raquo;</a></li>`;
            }

            paginationHTML += `</ul>`;
            $("#paginationAjax").html(paginationHTML);
        },
        error: function (xhr) {
            alert("Lỗi khi tìm đơn hàng: " + xhr.responseText);
        }
    });
}


$(document).on("click", ".del-order", function(e) {
    e.preventDefault();
    const form = $(this).siblings("form");
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) {
        form.submit();
    }
});
