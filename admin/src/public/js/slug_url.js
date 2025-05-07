$(document).ready(function () {
  $("#title").blur(function () {
    var title = $(this).val();
    var data = { title: title };
    console.log(data);
    $.ajax({
      url: "trang/slug",
      method: "POST",
      data: data,
      dataType: "text",
      success: function (data) {
        // alert(data);
        $("#slug").val(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(jqXHR.status);
        alert(errorThrown);
      },
    });
    return false;
  });
});

