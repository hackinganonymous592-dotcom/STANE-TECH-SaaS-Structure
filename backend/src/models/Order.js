const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    paymentId: String,
    method: String,
    status: String,
    amount: Number,
    currency: String,
    paidAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
