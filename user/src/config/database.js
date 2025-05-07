const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ Kết nối MongoDB thành công!");
    } catch (err) {
        console.error("❌ Lỗi kết nối MongoDB:", err);
        process.exit(1); //Dừng chương trình với mã lỗi 1 (lỗi nghiêm trọng)
    } 
};

module.exports = connectDB;
