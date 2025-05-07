$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });
});

function filter_product(page = 1) {
    const price = $('input[name="r-price"]:checked').val();
    $.ajax({
        url: "/san-pham/filter_product",
        method: "GET",
        data: { price, page },
        success: function (data) {
            // Render sản phẩm
            // Đổi tiêu đề
            $("#product-title").text("Sản phẩm");
            const html = data.products.map(p => `
                <div class="col-md-4 mb-4 col-sm-6 col-12">
                    <div class="border product p-2 rounded shadow-sm h-100">
                        <a href="/san-pham/${p._id}">
                            <img class="img-fluid w-100" style="height: 200px; object-fit: cover;" src="http://localhost:3000/${p.featured_image}" alt="${p.product_name}">
                        </a>
                        <div class="sub text-center mt-3">
                            <a href="/san-pham/${p._id}" class="fw-bold text-decoration-none text-dark">${p.product_name}</a>
                            <div class="price mt-2 mb-2">
                                <span class="new text-danger fw-bold">${p.product_new_price.toLocaleString("vi-VN")} đ</span>
                                ${p.product_old_price ? `<span class="old text-muted text-decoration-line-through ms-2">${p.product_old_price.toLocaleString("vi-VN")} đ</span>` : ''}
                            </div>
                            <button type="button" class="btn btn-outline-danger btn-sm mb-2 btn-buy" data-product-id="${p._id}">ĐẶT MUA</button>
                        </div>
                    </div>
                </div>`).join('');
            $("#productList").html(html);

            const page = parseInt(data.currentPage);  // Ép kiểu để so sánh chính xác

            const paginationHtml = data.totalPages > 1
                ? `<ul class="pagination pagination-sm justify-content-center">` +
                (page > 1 ? `<li class="page-item"><a class="page-link product-page" href="#" data-page="${page - 1}">&laquo;</a></li>` : '') +
                // Tạo mảng số lượng phần tử bằng số trang (totalPages), sau đó map qua từng phần tử để tạo các nút trang
                Array.from({ length: data.totalPages }, (_, i) => `
                      <li class="page-item ${i + 1 === page ? 'active' : ''}">
                          <a class="page-link product-page" href="#" data-page="${i + 1}">${i + 1}</a>
                      </li>`).join('') +
                (page < data.totalPages ? `<li class="page-item"><a class="page-link product-page" href="#" data-page="${page + 1}">&raquo;</a></li>` : '') +
                `</ul>`
                : '';

            $(".pagination").html(paginationHtml);

        },
        error: function (err) {
            console.error("Lỗi lọc sản phẩm:", err);
        }
    });
}

// Gọi khi load hoặc khi người dùng chọn radio
$(document).on('change', 'input[name="r-price"]', function () {
    filter_product(1);
});

// Gọi khi click phân trang
$(document).on('click', '.product-page', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    filter_product(page);
});
// ==========

function loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { product_list: [], product_quantity: [] };
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showSuccessToast() {
    const toast = document.getElementById('success-toast');
    toast.style.display = 'flex';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 1000); // 1 giây
}

document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.btn-buy');

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("click click");
            const productId = button.getAttribute('data-product-id');
            let cart = loadCart();

            const index = cart.product_list.indexOf(productId);

            if (index === -1) {
                // Chưa có trong cart, thêm vào
                cart.product_list.push(productId);
                cart.product_quantity.push(1); // mặc định số lượng là 1
                saveCart(cart);
                showSuccessToast();
            } else {
                showSuccessToast();
            }
        });
    });
});
