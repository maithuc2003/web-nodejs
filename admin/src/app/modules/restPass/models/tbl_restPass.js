const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'tbl_admin' },
    token: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true },
  }
);

module.exports = mongoose.model('tbl_restPass', PasswordResetSchema);
