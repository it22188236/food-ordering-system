const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "LKR",
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cashOnDelivery", "payHere"],
    },

    transactionId: {
      type: String, // From PayHere → payment_id
    },

    payhereReference: {
      type: String, // Optional custom field
    },

    statusCode: {
      type: String, // e.g. 2 (success), -1 (canceled), etc.
    },

    payhereResponse: {
      type: mongoose.Schema.Types.Mixed, // Store full IPN response (optional)
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("payments", paymentSchema);
module.exports = Payment;
