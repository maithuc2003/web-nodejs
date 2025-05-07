const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    order_id: { type: Number, unique: true, required: true },

    fullname: { type: String, required: true },

    product_quantity: [{ type: Number, required: true }],

    product_list: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tbl_product' }],

    total_amount: { type: Number, required: true },

    order_date: { type: Date, default: Date.now },

    payment_method: {
      type: String,
      enum: ['COD', 'Online Payment'],
      default: 'COD',
    },

    shipping_address: { type: String, required: true, maxlength: 255 },

    phone: { type: String, required: true, maxlength: 20 },

    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tbl_user',
      required: true,
    },

    // customer_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'tbl_customer',
    //   required: true,
    // },
  },
  {
    timestamps: true, // => createdAt, updatedAt
  }
);

// Add soft delete plugin
OrderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('tbl_order', OrderSchema);
