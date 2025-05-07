$(document).ready(function () {
    $("input#searchInput").on('input', function () {
        var key = $(this).val().trim();
        if (key.length === 0) {
            $("#dropdown-search").hide();
            return;
        }
        let data = { key: key };
        $.ajax({
            url: "/search",
            method: 'POST',
            data: data,
            dataType: 'json', // <- Đảm bảo server trả về JSON nhé
            success: function (response) {
                console.log(response);
                if (response.length > 0) {
                    var search = '<ul class="list-group list-group-flush">';
                    response.forEach(product => {
                        search += `
                        <li class="list-group-item">
                        <a href="san-pham/${product.id}" class="d-flex align-items-center text-dark text-decoration-none">
                            <img src="http://localhost:3000/${product.image_url}" alt="${product.product_name}" width="60" height="60" style="object-fit: cover;" class="mr-3">
                            <div>
                                <h6 class="mb-1">${product.product_name}</h6>
                                <div>
                                    <span class="text-danger font-weight-bold">${product.product_price}</span>
                                    <span class="text-muted" style="text-decoration: line-through;">${product.product_price_old}</span>
                                </div>
                                <div class="mt-1">
                                    <small class="text-muted">Kho còn: ${product.stock_quantity}</small>
                                </div>
                            </div>
                        </a>
                    </li>`;
                    });
                    search += '</ul>';
                    $("#dropdown-search").html(search).show();
                } else {
                    $("#dropdown-search").html('<li class="list-group-item">Không tìm thấy kết quả phù hợp.</li>').show();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Lỗi HTTP:", jqXHR.status);                   // Mã lỗi HTTP (vd: 404, 500)
                console.log("Trạng thái lỗi:", textStatus);              // Thông tin trạng thái (vd: "error", "timeout")
                console.log("Chi tiết:", errorThrown);                    // Lỗi từ máy chủ (vd: "Internal Server Error")
                console.log("Phản hồi từ server:", jqXHR.responseText);  // Nội dung lỗi từ server trả về
            
                // Hiện chi tiết lỗi ra alert (có thể format lại)
                alert("Lỗi: " + jqXHR.status + " - " + errorThrown + "\nChi tiết: " + jqXHR.responseText);
            }
            
        });
    });

    // Ẩn dropdown khi click ra ngoài
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#search-wp').length) {
            $('#dropdown-search').hide();
        }
    });
});
