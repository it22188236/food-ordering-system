const Payment = require("../models/paymentModel");

const existPayment = async (customer, restaurant) => {
  try {
    const existPayment = await Payment.findOne({
      customer: customer,
      restaurant: restaurant,
      paymentStatus: { $ne: "failed" },
    });

    if (existPayment) {
      return console.error("You already paid for this order.");
    }
  } catch (error) {
    console.error(error);
  }
};

const ipn = async (req, res) => {
  try {
    const { order_id, payment_id, status_code, amount } = req.body;

    const payment = await Payment.findById(order_id);
    if (!payment) return res.status(404).send("Payment not found");

    // Determine payment status
    let status = "pending";
    if (status_code === "2") status = "paid";
    else if (status_code === "-1") status = "failed";

    payment.paymentStatus = status;
    payment.payhereReference = payment_id;
    await payment.save();

    // Publish event if paid
    if (status === "paid") {
      publishEvent("payment.success", {
        orderId: payment.orderID,
        customerId: payment.customer,
        restaurantId: payment.restaurant,
        amount: payment.amount,
        transactionId: payment.payhereReference,
      });
    }

    res.send("IPN received");
  } catch (err) {
    console.error("IPN processing failed:", err);
    res.status(500).send("Error");
  }
};

const generatePayHereFormData = (payment, customerInfo) => {
  return {
    merchant_id: process.env.PAYHERE_MERCHANT_ID,
    return_url: process.env.PAYHERE_RETURN_URL,
    cancel_url: process.env.PAYHERE_CANCEL_URL,
    notify_url: process.env.PAYHERE_NOTIFY_URL,
    order_id: payment._id.toString(),
    items: "Food Order",
    amount: payment.amount.toFixed(2),
    currency: "LKR",
    first_name: customerInfo.firstName,
    last_name: customerInfo.lastName,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: "No 1, Main Street",
    city: "Colombo",
    country: "Sri Lanka"
  };
};
module.exports = { existPayment, ipn, generatePayHereFormData };
