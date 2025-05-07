const express = require('express');
const path = require('path');
const app = express();

// Cấu hình để phục vụ thư mục uploads
app.use(express.static('public'))

// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
