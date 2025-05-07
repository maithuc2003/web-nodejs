const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    user_id: { type: Number, unique: true, required: true }, // id người dùng

    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
    },
    phone: { type: String, required: true, maxlength: 20 },

    password_hash: {
      type: String,
      required: true,
      maxlength: 255,
    },

    fullname: {
      type: String,
      required: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true, // tự động thêm createdAt và updatedAt
  }
);

// Hash password trước khi lưu nếu có thay đổi
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// So sánh mật khẩu khi login
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password_hash);
};

// Kích hoạt soft delete
UserSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('tbl_user', UserSchema);