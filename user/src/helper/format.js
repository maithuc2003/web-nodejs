// Hàm format ngày giờ theo múi giờ Việt Nam
const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };
  
  module.exports = { formatDate };
  