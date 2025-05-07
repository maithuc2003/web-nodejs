const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const AdminSchema = new Schema(
    {
        user_id: { type: Number, unique: true, required: true },
        username: { type: String, required: true, unique: true, maxlength: 20 },
        email: { type: String, required: true, unique: true, maxlength: 50 },
        password_hash: { type: String, required: true },
        phone: { type: String, required: true, maxlength: 20 },
        fullname: { type: String, required: true, maxlength: 100 },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Hash password before saving
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password_hash')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password_hash = await bcrypt.hash(this.password_hash, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
AdminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password_hash);
};

// Add plugin for soft delete
AdminSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('tbl_admin', AdminSchema);
